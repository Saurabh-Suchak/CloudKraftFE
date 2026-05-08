const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface TerraformFile { filename: string; content: string; }
interface LogItem { id: number; level: string; message: string; timestamp: string; }

let _pollTimer: ReturnType<typeof setInterval> | null = null;

function stopPolling(): void {
  if (_pollTimer !== null) { clearInterval(_pollTimer); _pollTimer = null; }
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

function addLog(logsEl: HTMLElement, message: string, level = 'info'): void {
  const ts = new Date().toLocaleTimeString();
  const entry = document.createElement('div');
  entry.className = `log-entry${level !== 'info' ? ` ${level}` : ''}`;
  entry.innerHTML = `<span class="log-time">[${ts}]</span> <span class="log-message">${escHtml(message)}</span>`;
  logsEl.appendChild(entry);
  logsEl.scrollTop = logsEl.scrollHeight;
}

function setStatus(text: string, type: 'info' | 'success' | 'error' | 'warning'): void {
  const badge = document.getElementById('deploymentStatusBadge');
  const textEl = document.getElementById('deploymentStatusText');
  const summaryStatus = document.getElementById('summaryStatus');
  if (badge) badge.className = `status-badge ${type === 'info' ? 'warning' : type}`;
  if (textEl) textEl.textContent = text;
  if (summaryStatus) summaryStatus.textContent = text;
}

function escHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showDestroyBtn(deploymentId: number): void {
  const actions = document.querySelector('.deployment-actions');
  if (!actions || document.getElementById('destroyBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'destroyBtn';
  btn.className = 'btn btn-outline';
  btn.style.color = '#ef4444';
  btn.style.borderColor = '#ef4444';
  btn.textContent = 'Destroy Resources';
  btn.addEventListener('click', () => runDestroy(deploymentId));
  actions.insertBefore(btn, actions.firstChild);
}

export function initDeployment(): void {
  stopPolling();

  // If ?id= param present — view existing deployment, don't start new one
  const existingId = new URLSearchParams(window.location.search).get('id');
  if (existingId) {
    loadExistingDeployment(parseInt(existingId, 10));
    return;
  }

  const workflowName = localStorage.getItem('deployment_workflow_name') || 'Unnamed Workflow';
  const filesJson    = localStorage.getItem('generated_terraform_files');
  const token        = localStorage.getItem('auth_token');

  let files: TerraformFile[] = [];
  try { if (filesJson) files = JSON.parse(filesJson); } catch { /* ignore */ }

  const nameEl = document.getElementById('deploymentWorkflowName');
  if (nameEl) nameEl.textContent = workflowName;

  const timeEl = document.getElementById('deploymentTime');
  if (timeEl) timeEl.textContent = new Date().toLocaleString();

  const summaryNodeCount = document.getElementById('summaryNodeCount');
  const summaryFileCount = document.getElementById('summaryFileCount');
  const summaryStartedAt = document.getElementById('summaryStartedAt');
  if (summaryNodeCount) summaryNodeCount.textContent = localStorage.getItem('deployment_node_count') || '—';
  if (summaryFileCount) summaryFileCount.textContent = String(files.length);
  if (summaryStartedAt) summaryStartedAt.textContent = '—';

  const filesEl = document.getElementById('deploymentFiles');
  if (filesEl && files.length > 0) {
    filesEl.innerHTML = `
      <h4 class="deployment-files-title">Generated Files</h4>
      <ul class="deployment-files-list">
        ${files.map(f => `<li class="deployment-file-item">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ${escHtml(f.filename)}
        </li>`).join('')}
      </ul>`;
  }

  const logsEl = document.getElementById('deploymentLogs');
  const startBtn = document.getElementById('startDeployBtn') as HTMLButtonElement | null;

  // No auth — block deploy
  if (!token) {
    if (logsEl) logsEl.innerHTML = '<div class="log-entry error"><span class="log-message">Not logged in. Please log in first.</span></div>';
    if (startBtn) startBtn.disabled = true;
    setStatus('Not authenticated', 'error');
    document.getElementById('backToCodeBtn')?.addEventListener('click', async () => {
      const { router } = await import('./router');
      router.navigate('/login');
    });
    return;
  }

  // No canvas state — block deploy
  const canvasStateJson = localStorage.getItem('canvas_state');
  if (!canvasStateJson || files.length === 0) {
    if (logsEl) logsEl.innerHTML = '<div class="log-entry warning"><span class="log-message">No workflow found. Go to Workflow Designer and generate code first.</span></div>';
    if (startBtn) startBtn.disabled = true;
  }

  document.getElementById('backToCodeBtn')?.addEventListener('click', async () => {
    const { router } = await import('./router');
    router.navigate('/code');
  });

  startBtn?.addEventListener('click', () => {
    const canvas = localStorage.getItem('canvas_state');
    if (!canvas) { alert('No workflow state found. Generate code from the designer first.'); return; }
    let workflowState: any;
    try { workflowState = JSON.parse(canvas); } catch { alert('Invalid workflow state.'); return; }
    runDeploy(workflowState, workflowName);
  });

  setStatus('Ready', 'info');
}

async function runDeploy(workflowState: any, workflowName: string): Promise<void> {
  const logsEl = document.getElementById('deploymentLogs');
  const startBtn = document.getElementById('startDeployBtn') as HTMLButtonElement | null;
  const summaryStartedAt = document.getElementById('summaryStartedAt');
  if (!logsEl) return;

  stopPolling();
  logsEl.innerHTML = '';
  if (startBtn) startBtn.disabled = true;
  if (summaryStartedAt) summaryStartedAt.textContent = new Date().toLocaleString();
  setStatus('Deploying...', 'info');
  addLog(logsEl, 'Submitting deployment to backend...');

  let deploymentId: number;
  try {
    const res = await fetch(`${API_BASE}/api/deploy/apply`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        workflow: workflowState,
        workflow_name: workflowName,
        workflow_id: localStorage.getItem('current_workflow_id')
          ? parseInt(localStorage.getItem('current_workflow_id')!)
          : undefined,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
      addLog(logsEl, `Failed to start deployment: ${err.detail || res.status}`, 'error');
      setStatus('Failed', 'error');
      if (startBtn) startBtn.disabled = false;
      return;
    }
    const data = await res.json();
    deploymentId = data.id;
    addLog(logsEl, 'Deployment queued — streaming logs...');
  } catch (e) {
    addLog(logsEl, `Network error: ${e}`, 'error');
    setStatus('Failed', 'error');
    if (startBtn) startBtn.disabled = false;
    return;
  }

  let lastLogId = 0;
  const TERMINAL = new Set(['succeeded', 'failed', 'destroyed']);

  _pollTimer = setInterval(async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/deploy/${deploymentId}/logs?after_id=${lastLogId}`,
        { headers: authHeaders() }
      );
      if (!res.ok) return;
      const data: { logs: LogItem[]; deployment_status: string } = await res.json();

      for (const log of data.logs) {
        addLog(logsEl, log.message, log.level as any);
        lastLogId = log.id;
      }

      if (TERMINAL.has(data.deployment_status)) {
        stopPolling();
        if (data.deployment_status === 'succeeded') {
          setStatus('Succeeded', 'success');
          showDestroyBtn(deploymentId);
          const nodeCount = document.getElementById('summaryNodeCount');
          const resCountRes = await fetch(`${API_BASE}/api/deploy/${deploymentId}`, { headers: authHeaders() });
          if (resCountRes.ok) {
            const dep = await resCountRes.json();
            if (dep.resource_count != null && nodeCount) nodeCount.textContent = String(dep.resource_count);
          }
        } else if (data.deployment_status === 'failed') {
          setStatus('Failed', 'error');
          if (startBtn) { startBtn.disabled = false; startBtn.textContent = 'Retry Deployment'; }
        } else {
          setStatus('Destroyed', 'warning');
        }
      }
    } catch { /* network hiccup — keep polling */ }
  }, 2000);
}

async function loadExistingDeployment(deploymentId: number): Promise<void> {
  const logsEl = document.getElementById('deploymentLogs');
  const startBtn = document.getElementById('startDeployBtn') as HTMLButtonElement | null;
  if (!logsEl) return;

  if (startBtn) { startBtn.style.display = 'none'; }
  document.getElementById('backToCodeBtn')?.addEventListener('click', async () => {
    const { router } = await import('./router');
    router.navigate('/deployments');
  });

  try {
    const res = await fetch(`${API_BASE}/api/deploy/${deploymentId}`, { headers: authHeaders() });
    if (!res.ok) { addLog(logsEl, 'Could not load deployment.', 'error'); return; }
    const dep = await res.json();

    const nameEl = document.getElementById('deploymentWorkflowName');
    if (nameEl) nameEl.textContent = dep.workflow_name || 'Deployment';
    const timeEl = document.getElementById('deploymentTime');
    if (timeEl) timeEl.textContent = dep.started_at ? new Date(dep.started_at).toLocaleString() : '—';
    const summaryNodeCount = document.getElementById('summaryNodeCount');
    if (summaryNodeCount) summaryNodeCount.textContent = dep.resource_count != null ? String(dep.resource_count) : '—';
    const summaryStartedAt = document.getElementById('summaryStartedAt');
    if (summaryStartedAt) summaryStartedAt.textContent = dep.started_at ? new Date(dep.started_at).toLocaleString() : '—';

    const TERMINAL = new Set(['succeeded', 'failed', 'destroyed']);
    const POLL_STATUSES = new Set(['pending', 'running', 'destroying']);

    if (!POLL_STATUSES.has(dep.status) && TERMINAL.has(dep.status)) {
      // Load all logs once then stop
      const logRes = await fetch(`${API_BASE}/api/deploy/${deploymentId}/logs?after_id=0`, { headers: authHeaders() });
      if (logRes.ok) {
        logsEl.innerHTML = '';
        const logData: { logs: LogItem[]; deployment_status: string } = await logRes.json();
        for (const log of logData.logs) addLog(logsEl, log.message, log.level as any);
      }
      if (dep.status === 'succeeded') { setStatus('Succeeded', 'success'); showDestroyBtn(deploymentId); }
      else if (dep.status === 'failed') { setStatus('Failed', 'error'); }
      else { setStatus('Destroyed', 'warning'); }
    } else {
      // Still running — poll from 0
      setStatus('Deploying...', 'info');
      logsEl.innerHTML = '';
      let lastLogId = 0;
      _pollTimer = setInterval(async () => {
        try {
          const r = await fetch(`${API_BASE}/api/deploy/${deploymentId}/logs?after_id=${lastLogId}`, { headers: authHeaders() });
          if (!r.ok) return;
          const data: { logs: LogItem[]; deployment_status: string } = await r.json();
          for (const log of data.logs) { addLog(logsEl, log.message, log.level as any); lastLogId = log.id; }
          if (TERMINAL.has(data.deployment_status)) {
            stopPolling();
            if (data.deployment_status === 'succeeded') { setStatus('Succeeded', 'success'); showDestroyBtn(deploymentId); }
            else if (data.deployment_status === 'failed') { setStatus('Failed', 'error'); }
            else { setStatus('Destroyed', 'warning'); }
          }
        } catch { /* keep polling */ }
      }, 2000);
    }
  } catch (e) {
    addLog(logsEl, `Error loading deployment: ${e}`, 'error');
  }
}

async function runDestroy(deploymentId: number): Promise<void> {
  if (!confirm('This will destroy all AWS resources created by this deployment. Continue?')) return;

  const logsEl = document.getElementById('deploymentLogs');
  const destroyBtn = document.getElementById('destroyBtn') as HTMLButtonElement | null;
  if (!logsEl) return;

  stopPolling();
  if (destroyBtn) destroyBtn.disabled = true;
  setStatus('Destroying...', 'warning');
  addLog(logsEl, 'Submitting destroy request...');

  try {
    const res = await fetch(`${API_BASE}/api/deploy/${deploymentId}/destroy`, {
      method: 'POST',
      headers: authHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
      addLog(logsEl, `Destroy request failed: ${err.detail}`, 'error');
      setStatus('Failed', 'error');
      if (destroyBtn) destroyBtn.disabled = false;
      return;
    }
    addLog(logsEl, 'Destroy job queued — streaming logs...');
  } catch (e) {
    addLog(logsEl, `Network error: ${e}`, 'error');
    if (destroyBtn) destroyBtn.disabled = false;
    return;
  }

  let lastLogId = 0;
  const TERMINAL = new Set(['succeeded', 'failed', 'destroyed']);

  _pollTimer = setInterval(async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/deploy/${deploymentId}/logs?after_id=${lastLogId}`,
        { headers: authHeaders() }
      );
      if (!res.ok) return;
      const data: { logs: LogItem[]; deployment_status: string } = await res.json();

      for (const log of data.logs) {
        addLog(logsEl, log.message, log.level as any);
        lastLogId = log.id;
      }

      if (TERMINAL.has(data.deployment_status)) {
        stopPolling();
        if (data.deployment_status === 'destroyed') {
          setStatus('Destroyed', 'warning');
          if (destroyBtn) destroyBtn.remove();
          addLog(logsEl, 'All resources destroyed.', 'success');
        } else if (data.deployment_status === 'failed') {
          setStatus('Failed', 'error');
          if (destroyBtn) destroyBtn.disabled = false;
        }
      }
    } catch { /* keep polling */ }
  }, 2000);
}
