// Deployment page logic

interface TerraformFile {
  filename: string;
  content: string;
}

export function initDeployment(): void {
  const workflowName  = localStorage.getItem('deployment_workflow_name') || 'Unnamed Workflow';
  const nodeCount     = localStorage.getItem('deployment_node_count') || '0';
  const filesJson     = localStorage.getItem('generated_terraform_files');

  let files: TerraformFile[] = [];
  try { if (filesJson) files = JSON.parse(filesJson); } catch { /* ignore */ }

  // Populate header
  const nameEl = document.getElementById('deploymentWorkflowName');
  if (nameEl) nameEl.textContent = workflowName;

  const timeEl = document.getElementById('deploymentTime');
  if (timeEl) timeEl.textContent = new Date().toLocaleString();

  // Populate summary
  const summaryStatus    = document.getElementById('summaryStatus');
  const summaryNodeCount = document.getElementById('summaryNodeCount');
  const summaryFileCount = document.getElementById('summaryFileCount');
  const summaryStartedAt = document.getElementById('summaryStartedAt');
  if (summaryStatus)    summaryStatus.textContent    = 'Ready';
  if (summaryNodeCount) summaryNodeCount.textContent = nodeCount;
  if (summaryFileCount) summaryFileCount.textContent = String(files.length);
  if (summaryStartedAt) summaryStartedAt.textContent = '—';

  // List generated files
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
          ${f.filename}
        </li>`).join('')}
      </ul>`;
  }

  // If no files were generated, show a prompt
  if (files.length === 0) {
    const logsEl = document.getElementById('deploymentLogs');
    if (logsEl) {
      logsEl.innerHTML = `<div class="log-entry warning">
        <span class="log-message">No generated files found. Go to the Workflow Designer and click "Generate Code" first.</span>
      </div>`;
    }
    const startBtn = document.getElementById('startDeployBtn') as HTMLButtonElement | null;
    if (startBtn) startBtn.disabled = true;
  }

  // Back to Code
  document.getElementById('backToCodeBtn')?.addEventListener('click', async () => {
    const { router } = await import('./router');
    router.navigate('/code');
  });

  // Run Deployment — simulates terraform apply steps
  document.getElementById('startDeployBtn')?.addEventListener('click', () => runDeployment(files, nodeCount));
}

function addLog(logsEl: HTMLElement, message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info'): void {
  const ts = new Date().toLocaleTimeString();
  const entry = document.createElement('div');
  entry.className = `log-entry${type !== 'info' ? ` ${type}` : ''}`;
  entry.innerHTML = `<span class="log-time">[${ts}]</span> <span class="log-message">${message}</span>`;
  logsEl.appendChild(entry);
  logsEl.scrollTop = logsEl.scrollHeight;
}

function setStatus(text: string, type: 'info' | 'success' | 'error' | 'warning'): void {
  const badge = document.getElementById('deploymentStatusBadge');
  const textEl = document.getElementById('deploymentStatusText');
  const summaryStatus = document.getElementById('summaryStatus');
  if (badge) {
    badge.className = `status-badge ${type === 'info' ? 'warning' : type}`;
  }
  if (textEl) textEl.textContent = text;
  if (summaryStatus) summaryStatus.textContent = text;
}

async function runDeployment(files: TerraformFile[], nodeCount: string): Promise<void> {
  const logsEl = document.getElementById('deploymentLogs');
  const startBtn = document.getElementById('startDeployBtn') as HTMLButtonElement | null;
  const summaryStartedAt = document.getElementById('summaryStartedAt');

  if (!logsEl) return;

  if (startBtn) startBtn.disabled = true;
  logsEl.innerHTML = '';
  if (summaryStartedAt) summaryStartedAt.textContent = new Date().toLocaleString();

  setStatus('Deploying...', 'info');

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  addLog(logsEl, 'Initializing Terraform...');
  await delay(800);

  addLog(logsEl, `Loading ${files.length} configuration file(s)...`);
  await delay(600);

  for (const file of files) {
    addLog(logsEl, `  ✓ ${file.filename} (${file.content.split('\n').length} lines)`);
    await delay(200);
  }

  addLog(logsEl, 'Running terraform init...');
  await delay(1000);
  addLog(logsEl, '  ✓ Provider plugins initialized');
  await delay(400);

  addLog(logsEl, 'Running terraform plan...');
  await delay(1200);
  addLog(logsEl, `  ✓ Plan: ${nodeCount} resource(s) to add, 0 to change, 0 to destroy`);
  await delay(400);

  addLog(logsEl, 'Running terraform apply...');
  await delay(1500);

  addLog(logsEl, `  ✓ ${nodeCount} resource(s) created successfully`, 'success');
  await delay(300);

  addLog(logsEl, 'Deployment complete.', 'success');
  setStatus('Succeeded', 'success');

  if (startBtn) {
    startBtn.disabled = false;
    startBtn.textContent = 'Re-run Deployment';
  }
}
