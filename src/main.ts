import { router } from './router';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { SignUpAWS } from './pages/SignUpAWS';
import { Dashboard } from './pages/Dashboard';
import { WorkflowDesigner } from './pages/WorkflowDesigner';
import { CodeViewer } from './pages/CodeViewer';
import { DeploymentStatus } from './pages/DeploymentStatus';
import { AWSConnect } from './pages/AWSConnect';
import { DeploymentsList } from './pages/DeploymentsList';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';
import './styles/main.css';
import { reinitWorkflowDesigner, resetWorkflowDesignerInit, loadWorkflowState } from './workflow';
import { initDeployment } from './deployment';
import { apiService } from './services/api';
import { initCodeViewer } from './codeviewer';

// Register routes
router.addRoute('/', Login);
router.addRoute('/login', Login);
router.addRoute('/signup', SignUp);
router.addRoute('/signup-aws', SignUpAWS);
router.addRoute('/dashboard', Dashboard);
router.addRoute('/workflow', WorkflowDesigner);
router.addRoute('/code', CodeViewer);
router.addRoute('/deployment', DeploymentStatus);
router.addRoute('/aws-connect', AWSConnect);
router.addRoute('/deployments', DeploymentsList);
router.addRoute('/profile', Profile);
router.addRoute('*', NotFound);

const PUBLIC_ROUTES = new Set(['/', '/login', '/signup', '/signup-aws']);

function isSessionActive(): boolean {
  return !!localStorage.getItem('auth_token');
}

router.setGuard((to: string) => {
  const active = isSessionActive();
  if (!active && !PUBLIC_ROUTES.has(to)) return '/login';
  if (active && (to === '/' || to === '/login')) return '/dashboard';
  return null;
});

// Initialize router
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => router.init());
} else {
  router.init();
}

// ─── User display ────────────────────────────────────────────────────────────

function updateUserDisplay(): void {
  const userJson = localStorage.getItem('current_user');
  if (!userJson) return;
  try {
    const user = JSON.parse(userJson);
    const fullName: string = user.full_name || user.email || 'User';
    const email: string = user.email || '';
    const initials = fullName
      .split(' ')
      .map((p: string) => p[0]?.toUpperCase() ?? '')
      .slice(0, 2)
      .join('') || 'U';

    document.querySelectorAll('[data-user-name]').forEach(el => { el.textContent = fullName; });
    document.querySelectorAll('[data-user-email]').forEach(el => { el.textContent = email; });
    document.querySelectorAll('[data-user-avatar]').forEach(el => { el.textContent = initials; });
  } catch { /* malformed stored value — ignore */ }
}

function setDesignerTitle(name: string | null | undefined): void {
  const titleEl = document.querySelector('.workflow-title');
  if (titleEl && name) titleEl.textContent = name;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

let dashboardInitialized = false;
let codeViewerInitialized = false;
let deploymentInitialized = false;
let profileInitialized = false;
let workflowsCache: any[] = [];

function formatRelativeDate(dateStr: string): string {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(mins  / 60);
  const days  = Math.floor(hours / 24);
  if (mins  <  1) return 'Just now';
  if (mins  < 60) return `${mins} minute${mins  !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours  !== 1 ? 's' : ''} ago`;
  if (days  <  7) return `${days} day${days   !== 1 ? 's' : ''} ago`;
  return new Date(dateStr).toLocaleDateString();
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function initDashboard(): Promise<void> {
  const tbody = document.getElementById('workflowsTableBody');
  if (!tbody) return;

  // New Project — clear any previous session state so canvas starts empty
  document.getElementById('newProjectBtn')?.addEventListener('click', () => {
    localStorage.removeItem('canvas_state');
    localStorage.removeItem('current_workflow_id');
    localStorage.removeItem('current_workflow_name');
  });

  // AWS connection banner — always fetch live from API
  const banner     = document.getElementById('awsConnectionBanner');
  const bannerDot  = document.getElementById('awsBannerDot');
  const bannerLabel = document.getElementById('awsBannerLabel');
  const bannerRight = document.getElementById('awsBannerRight');
  if (banner) {
    const awsStatus = await apiService.getAWSStatus();
    const connected = awsStatus.data?.connected === true;
    banner.className = `aws-connection-banner ${connected ? 'aws-banner-connected' : 'aws-banner-disconnected'}`;
    if (bannerLabel) bannerLabel.textContent = connected ? 'AWS Connected' : 'AWS Not Connected';
    if (bannerRight) {
      bannerRight.innerHTML = connected
        ? `Region: <strong>${awsStatus.data?.region || '—'}</strong>
           &nbsp;|&nbsp; Auth: <strong>${awsStatus.data?.auth_method === 'assume_role' ? 'IAM Role' : 'Access Keys'}</strong>`
        : `<a href="/profile" data-navigate="/profile" class="aws-banner-link">Connect AWS →</a>`;
    }
  }

  tbody.innerHTML = '<tr><td colspan="4" class="table-loading">Loading projects...</td></tr>';

  const [result, deplResult] = await Promise.all([
    apiService.getWorkflows(),
    apiService.listDeployments(),
  ]);

  if (result.error) {
    tbody.innerHTML = `<tr><td colspan="4" class="table-empty">Could not load projects: ${escapeHtml(result.error)}</td></tr>`;
    return;
  }

  const workflows: any[] = result.data || [];
  workflowsCache = workflows;

  // Build map: workflow_id → latest deployment status
  const deployments: any[] = deplResult.data || [];
  const latestDeployStatus = new Map<number, string>();
  for (const d of deployments) {
    if (d.workflow_id != null) {
      const existing = latestDeployStatus.get(d.workflow_id);
      if (!existing || new Date(d.started_at) > new Date(deployments.find((x: any) => x.status === existing && x.workflow_id === d.workflow_id)?.started_at || 0)) {
        latestDeployStatus.set(d.workflow_id, d.status);
      }
    }
  }

  const deployStatusBadge = (wfId: number): string => {
    const status = latestDeployStatus.get(wfId);
    if (!status) return '<span class="status-badge status-not-deployed">Not Deployed</span>';
    const cls: Record<string, string> = {
      succeeded: 'status-succeeded',
      failed:    'status-failed',
      running:   'status-running',
      pending:   'status-pending',
      destroying:'status-running',
      destroyed: 'destroyed',
    };
    const label: Record<string, string> = {
      succeeded: 'Deployed',
      failed:    'Failed',
      running:   'Deploying',
      pending:   'Pending',
      destroying:'Destroying',
      destroyed: 'Destroyed',
    };
    return `<span class="status-badge ${cls[status] || ''}">${label[status] || status}</span>`;
  };

  if (workflows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="table-empty">No projects yet. Click "New Project" to get started.</td></tr>';
    return;
  }

  tbody.innerHTML = workflows.map(wf => `
    <tr>
      <td>${escapeHtml(wf.name)}${wf.description ? `<div class="project-desc">${escapeHtml(wf.description)}</div>` : ''}</td>
      <td>${formatRelativeDate(wf.updated_at || wf.created_at)}</td>
      <td>${deployStatusBadge(wf.id)}</td>
      <td>
        <div class="action-links">
          <button class="action-link" data-action="open" data-id="${wf.id}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Open
          </button>
          <button class="action-link action-link-danger" data-action="delete" data-id="${wf.id}" data-name="${escapeHtml(wf.name)}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            Delete
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  // Open — store workflow and navigate to designer
  tbody.querySelectorAll<HTMLButtonElement>('[data-action="open"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id') || '0');
      const wf = workflowsCache.find(w => w.id === id);
      if (wf) {
        localStorage.setItem('pending_workflow', JSON.stringify(wf));
        localStorage.setItem('current_workflow_id', String(wf.id));
        localStorage.setItem('current_workflow_name', wf.name || 'Untitled');
        localStorage.removeItem('canvas_state');
        router.navigate('/workflow');
      }
    });
  });

  // Delete — confirm then remove
  tbody.querySelectorAll<HTMLButtonElement>('[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id   = parseInt(btn.getAttribute('data-id')   || '0');
      const name = btn.getAttribute('data-name') || 'this project';

      const activeDepls = deployments.filter(
        (d: any) => d.status === 'succeeded' &&
          (d.workflow_id === id || d.workflow_name === name)
      );

      const confirmMsg = activeDepls.length > 0
        ? `Delete "${name}"?\n\nThis project has ${activeDepls.length} active deployment(s). AWS resources will be destroyed before deletion.\n\nThis cannot be undone.`
        : `Delete "${name}"? This cannot be undone.`;

      if (!confirm(confirmMsg)) return;

      btn.disabled = true;
      btn.textContent = activeDepls.length > 0 ? 'Destroying...' : 'Deleting...';

      // Destroy active deployments first
      for (const d of activeDepls) {
        await apiService.destroyDeployment(d.id);
      }

      const del = await apiService.deleteWorkflow(id);
      if (del.error) { alert(`Delete failed: ${del.error}`); return; }

      dashboardInitialized = false;
      initDashboard();
    });
  });

  // Client-side search filtering
  const searchInput = document.getElementById('projectSearch') as HTMLInputElement | null;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      tbody.querySelectorAll<HTMLTableRowElement>('tr').forEach(row => {
        const name = row.cells[0]?.textContent?.toLowerCase() ?? '';
        row.style.display = name.includes(q) ? '' : 'none';
      });
    });
  }
}

// ─── MutationObserver — re-init features after each route render ──────────────

// Observe only direct children of #app — fires once per route render, not on
// every text/attribute change inside the page (which caused infinite loops).
function onRouteChange(): void {
  updateUserDisplay();
  resetWorkflowDesignerInit();
  dashboardInitialized = false;
  codeViewerInitialized = false;
  deploymentInitialized = false;
  profileInitialized = false;

  if (document.getElementById('workflowCanvas')) {
    reinitWorkflowDesigner();

    // Opening a saved workflow from the dashboard takes priority
    const pendingJson = localStorage.getItem('pending_workflow');
    if (pendingJson) {
      localStorage.removeItem('pending_workflow');
      try {
        const wf = JSON.parse(pendingJson);
        if (wf.workflow_state) {
          setTimeout(() => {
            loadWorkflowState(wf.workflow_state);
            setDesignerTitle(wf.name);
          }, 200);
        }
      } catch { /* ignore malformed data */ }
    } else {
      const canvasJson = localStorage.getItem('canvas_state');
      const hasCanvas = (() => {
        try { const s = JSON.parse(canvasJson || ''); return s?.nodes?.length > 0; } catch { return false; }
      })();

      const autoName = () => {
        apiService.getWorkflows().then(result => {
          const count = (result.data?.length ?? 0) + 1;
          const name = `Workflow ${count}`;
          localStorage.setItem('current_workflow_name', name);
          setDesignerTitle(name);
        });
      };

      if (hasCanvas) {
        setTimeout(() => {
          loadWorkflowState(JSON.parse(canvasJson!));
          const savedName = localStorage.getItem('current_workflow_name');
          if (savedName) {
            setDesignerTitle(savedName);
          } else {
            autoName();
          }
        }, 200);
      } else {
        autoName();
      }
    }

    // Editable title — save on blur or Enter
    setTimeout(() => {
      const titleEl = document.querySelector('.workflow-title') as HTMLElement | null;
      if (!titleEl || titleEl.hasAttribute('data-title-wired')) return;
      titleEl.setAttribute('data-title-wired', 'true');

      const save = async () => {
        const newName = titleEl.textContent?.trim() || 'Untitled Workflow';
        if (!titleEl.textContent?.trim()) titleEl.textContent = newName;
        localStorage.setItem('current_workflow_name', newName);
        const wfId = localStorage.getItem('current_workflow_id');
        if (wfId) await apiService.updateWorkflow(parseInt(wfId), { name: newName });
      };

      titleEl.addEventListener('blur', save);
      titleEl.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter') { e.preventDefault(); titleEl.blur(); }
        if (e.key === 'Escape') {
          titleEl.textContent = localStorage.getItem('current_workflow_name') || 'Untitled Workflow';
          titleEl.blur();
        }
      });
    }, 300);
  }

  // Initialize AWS Signup form if it exists in DOM
  const awsFormEl = document.getElementById('awsSignupForm');
  if (awsFormEl && !awsFormEl.hasAttribute('data-initialized')) {
    initAwsSignupForm();
  }

  if (document.getElementById('workflowsTableBody')) {
    dashboardInitialized = true;
    initDashboard();
  }

  if (document.querySelector('.code-viewer-main')) {
    codeViewerInitialized = true;
    initCodeViewer();
  }

  if (document.querySelector('.deployment-main')) {
    deploymentInitialized = true;
    initDeployment();
  }

  if (document.getElementById('awsConnectForm')) {
    initAWSConnect();
  }

  if (document.getElementById('deploymentsContainer')) {
    initDeploymentsList();
  }

  if (document.querySelector('.profile-main')) {
    profileInitialized = true;
    initProfile();
  }
}

const appEl = document.getElementById('app');
if (appEl) {
  new MutationObserver(onRouteChange).observe(appEl, { childList: true });
  // Initial render fires before observer is wired — run once manually
  onRouteChange();
}

// ─── AWS Signup form helpers ──────────────────────────────────────────────────

// Helper function to initialize AWS Signup interactions
function initAwsSignupForm() {
  const awsForm = document.getElementById('awsSignupForm');
  if (!awsForm) return;
  awsForm.setAttribute('data-initialized', 'true');

  const awsExternalIdInput = document.getElementById('awsExternalId') as HTMLInputElement;
  const displayExternalId = document.getElementById('displayExternalId');

  // Generate External ID if not already generated
  if (displayExternalId && awsExternalIdInput && !awsExternalIdInput.value) {
    const generatedId = crypto.randomUUID();
    awsExternalIdInput.value = generatedId;
    displayExternalId.textContent = generatedId;
  }
}

// Delegate radio toggle events to the document so they survive DOM re-renders by the router
document.addEventListener('change', (e) => {
  const target = e.target as HTMLInputElement;
  if (target.name === 'authMethod') {
    const accessKeySection = document.getElementById('accessKeySection');
    const assumeRoleSection = document.getElementById('assumeRoleSection');

    if (target.value === 'access_key') {
      if (accessKeySection) {
        accessKeySection.style.display = 'block';
        accessKeySection.classList.add('active');
      }
      if (assumeRoleSection) {
        assumeRoleSection.style.display = 'none';
        assumeRoleSection.classList.remove('active');
      }
    } else if (target.value === 'assume_role') {
      if (accessKeySection) {
        accessKeySection.style.display = 'none';
        accessKeySection.classList.remove('active');
      }
      if (assumeRoleSection) {
        assumeRoleSection.style.display = 'block';
        assumeRoleSection.classList.add('active');
      }
    }
  }
});

// Check periodically in case the router renders the form asynchronously
setInterval(() => {
  const awsForm = document.getElementById('awsSignupForm');
  if (awsForm && !awsForm.hasAttribute('data-initialized')) {
    initAwsSignupForm();
  }
}, 250);

setInterval(() => {
  const connectForm = document.getElementById('awsConnectForm');
  if (connectForm && !connectForm.hasAttribute('data-initialized')) {
    initAWSConnect();
  }
}, 250);

// ─── Logout ───────────────────────────────────────────────────────────────────

document.addEventListener('click', async (e) => {
  const target = e.target as HTMLElement;
  if (target.closest('#logoutBtn')) {
    await apiService.logout();
    localStorage.removeItem('current_user');
    localStorage.removeItem('canvas_state');
    localStorage.removeItem('current_workflow_id');
    localStorage.removeItem('current_workflow_name');
    localStorage.removeItem('generated_terraform');
    localStorage.removeItem('generated_terraform_files');
    router.navigate('/login');
  }
});

// ─── Password toggles ─────────────────────────────────────────────────────────

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.id === 'passwordToggle' || target.closest('#passwordToggle')) {
    const input = document.getElementById('password') as HTMLInputElement;
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
  }
  if (target.id === 'confirmPasswordToggle' || target.closest('#confirmPasswordToggle')) {
    const input = document.getElementById('confirmPassword') as HTMLInputElement;
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
  }
  if (target.id === 'awsSecretToggle' || target.closest('#awsSecretToggle')) {
    const input = document.getElementById('awsSecretKey') as HTMLInputElement;
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
  }
});

// ─── Form submissions ─────────────────────────────────────────────────────────

document.addEventListener('submit', async (e) => {
  const form = e.target as HTMLFormElement;

  if (form.id === 'loginForm') {
    e.preventDefault();
    const email    = (form.querySelector('#email')    as HTMLInputElement)?.value;
    const password = (form.querySelector('#password') as HTMLInputElement)?.value;
    if (!email || !password) { alert('Please fill in all fields.'); return; }

    const result = await apiService.login(email, password);
    if (result.error) { alert(`Login failed: ${result.error}`); return; }

    // Store user info for sidebar display
    const userResult = await apiService.getCurrentUser();
    if (userResult.data) localStorage.setItem('current_user', JSON.stringify(userResult.data));

    router.navigate('/dashboard');

  } else if (form.id === 'signupForm') {
    e.preventDefault();
    const email           = (form.querySelector('#email')           as HTMLInputElement)?.value;
    const password        = (form.querySelector('#password')        as HTMLInputElement)?.value;
    const confirmPassword = (form.querySelector('#confirmPassword') as HTMLInputElement)?.value;
    const fullName        = (form.querySelector('#fullName')        as HTMLInputElement)?.value;

    if (password !== confirmPassword) { alert('Passwords do not match!'); return; }
    if (!email || !password) { alert('Please fill in all required fields.'); return; }

    const result = await apiService.register(email, password, fullName);
    if (result.error) { alert(`Registration failed: ${result.error}`); return; }

    const loginResult = await apiService.login(email, password);
    if (loginResult.error) {
      alert('Registration successful, but login failed. Please log in manually.');
      router.navigate('/login');
      return;
    }

    const userResult = await apiService.getCurrentUser();
    if (userResult.data) localStorage.setItem('current_user', JSON.stringify(userResult.data));

    router.navigate('/dashboard');

  } else if (form.id === 'awsSignupForm') {
    e.preventDefault();
    // Validate AWS credentials based on Auth Method
    const authMethodEl = form.querySelector('input[name="authMethod"]:checked') as HTMLInputElement;
    const authMethod = authMethodEl ? authMethodEl.value : 'access_key';

    let accessKey: string | undefined;
    let secretKey: string | undefined;
    let roleArn: string | undefined;
    let externalId: string | undefined;
    const region = (form.querySelector('#awsRegion') as HTMLSelectElement)?.value;

    if (authMethod === 'access_key') {
      accessKey = (form.querySelector('#awsAccessKey') as HTMLInputElement)?.value.trim();
      secretKey = (form.querySelector('#awsSecretKey') as HTMLInputElement)?.value.trim();

      if (!accessKey || !secretKey || !region) {
        alert('Please fill in all AWS Access Key fields.');
        return;
      }

      if (!accessKey.startsWith('AKIA') && accessKey.length < 16) {
        alert('Please enter a valid AWS Access Key ID.');
        return;
      }
    } else if (authMethod === 'assume_role') {
      roleArn = (form.querySelector('#awsRoleArn') as HTMLInputElement)?.value.trim();
      externalId = (form.querySelector('#awsExternalId') as HTMLInputElement)?.value.trim();

      if (!roleArn || !region) {
        alert('Please fill in your AWS Role ARN and Region.');
        return;
      }

      if (!roleArn.startsWith('arn:aws:iam::')) {
        alert('Please enter a valid IAM Role ARN.');
        return;
      }
    }

    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalBtnContent = submitBtn.innerHTML;

    // Set loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="aws-icon animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-dasharray="31.4 31.4" stroke-linecap="round"/>
      </svg>
      Connecting...
    `;

    // Call actual FastAPI Backend
    const payload = {
      authMethod,
      accessKey: accessKey || null,
      secretKey: secretKey || null,
      roleArn: roleArn || null,
      externalId: externalId || null,
      region,
      email: (form.querySelector('#email') as HTMLInputElement)?.value.trim() || 'user@example.com',
      fullName: (form.querySelector('#fullName') as HTMLInputElement)?.value.trim() || 'User'
    };

    fetch('http://localhost:8000/api/aws/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(async (response) => {
      if (!response.ok) {
        let errMessage = 'Failed to connect to AWS';
        try {
          const err = await response.json();
          errMessage = err.detail || errMessage;
        } catch { /* non-JSON response */ }
        throw new Error(errMessage);
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem('aws_connected', 'true');
      localStorage.setItem('aws_region', data.region);
      router.navigate('/dashboard');
    })
    .catch((error) => {
      // Remove any existing error messages
      const existingError = form.querySelector('.error-message');
      if (existingError) existingError.remove();

      // Show inline error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.style.cssText = 'color:#ff4d4f;background:rgba(255,77,79,0.1);padding:10px;border-radius:4px;margin-bottom:15px;border:1px solid #ff4d4f;font-size:14px;';
      errorDiv.innerText = error.message;

      form.insertBefore(errorDiv, submitBtn);
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
    });
  }

  // ── AWS Connect form ──────────────────────────────────────────────────────────
  if (form.id === 'awsConnectForm') {
    e.preventDefault();
    const methodEl = form.querySelector('input[name="authMethod"]:checked') as HTMLInputElement;
    const method   = (methodEl?.value || 'assume_role') as 'access_key' | 'assume_role';
    const region   = (document.getElementById('awsRegion') as HTMLSelectElement)?.value;
    const feedback  = document.getElementById('awsConnectFeedback');
    const submitBtn = document.getElementById('awsConnectSubmit') as HTMLButtonElement;

    const showFeedback = (msg: string, isError: boolean) => {
      if (!feedback) return;
      feedback.style.display = 'block';
      feedback.className = `aws-connect-feedback ${isError ? 'aws-connect-feedback-error' : 'aws-connect-feedback-success'}`;
      feedback.textContent = msg;
    };

    let payload: Parameters<typeof apiService.connectAWS>[0] = { auth_method: method, region };

    if (method === 'access_key') {
      const accessKey = (document.getElementById('awsAccessKey') as HTMLInputElement)?.value.trim();
      const secretKey = (document.getElementById('awsSecretKey') as HTMLInputElement)?.value.trim();
      if (!accessKey || !secretKey) { showFeedback('Access Key ID and Secret Access Key are required.', true); return; }
      payload = { ...payload, access_key: accessKey, secret_key: secretKey };
    } else {
      const roleArn    = (document.getElementById('awsRoleArn')    as HTMLInputElement)?.value.trim();
      const externalId = (document.getElementById('awsExternalId') as HTMLInputElement)?.value.trim();
      if (!roleArn) { showFeedback('IAM Role ARN is required.', true); return; }
      if (!roleArn.startsWith('arn:aws:iam::')) { showFeedback('Invalid Role ARN format. Must start with arn:aws:iam::', true); return; }
      payload = { ...payload, role_arn: roleArn, external_id: externalId || undefined };
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Connecting...';
    if (feedback) feedback.style.display = 'none';

    const result = await apiService.connectAWS(payload);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Connect AWS Account';

    if (result.error) {
      showFeedback(`Connection failed: ${result.error}`, true);
      return;
    }

    localStorage.setItem('aws_connected', 'true');
    localStorage.setItem('aws_region', result.data?.region || region);

    const banner  = document.getElementById('awsStatusBanner');
    const bannerTxt = document.getElementById('awsStatusText');
    if (banner && bannerTxt) {
      banner.className = 'aws-status-banner aws-status-connected';
      bannerTxt.textContent = `Connected · ${result.data?.auth_method === 'assume_role' ? 'IAM Role' : 'Access Keys'} · ${result.data?.region}`;
    }
    showFeedback('AWS account connected successfully!', false);
  }
});

// ─── AWS Connect page init ────────────────────────────────────────────────────

async function initAWSConnect(): Promise<void> {
  const connectForm = document.getElementById('awsConnectForm');
  if (!connectForm) return;
  if (connectForm.hasAttribute('data-initialized')) return;
  connectForm.setAttribute('data-initialized', 'true');

  // External ID is fetched from backend (permanent per-user, generated on registration)
  // Will be populated after getAWSStatus() resolves below

  // Radio card toggling
  const radios = document.querySelectorAll<HTMLInputElement>('input[name="authMethod"]');
  const toggleSections = (method: string) => {
    const accessKeySection  = document.getElementById('accessKeySection');
    const assumeRoleSection = document.getElementById('assumeRoleSection');
    if (accessKeySection) {
      const show = method === 'access_key';
      accessKeySection.style.display = show ? 'block' : 'none';
      accessKeySection.classList.toggle('active', show);
    }
    if (assumeRoleSection) {
      const show = method === 'assume_role';
      assumeRoleSection.style.display = show ? 'block' : 'none';
      assumeRoleSection.classList.toggle('active', show);
    }
  };
  radios.forEach(r => r.addEventListener('change', () => toggleSections(r.value)));
  // Set initial state from checked radio
  const checkedRadio = document.querySelector<HTMLInputElement>('input[name="authMethod"]:checked');
  if (checkedRadio) toggleSections(checkedRadio.value);

  // Password toggle
  document.getElementById('awsSecretToggle')?.addEventListener('click', () => {
    const input = document.getElementById('awsSecretKey') as HTMLInputElement;
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
  });

  const banner    = document.getElementById('awsStatusBanner');
  const bannerTxt = document.getElementById('awsStatusText');
  const regionSel = document.getElementById('awsRegion') as HTMLSelectElement;

  const status = await apiService.getAWSStatus();
  if (!banner || !bannerTxt) return;

  // Populate permanent external ID from backend
  const extIdDisplay = document.getElementById('displayExternalId');
  const extIdHidden  = document.getElementById('awsExternalId') as HTMLInputElement | null;
  if (status.data?.external_id) {
    if (extIdDisplay) extIdDisplay.textContent = status.data.external_id;
    if (extIdHidden)  extIdHidden.value = status.data.external_id;
  }

  // F-006: fetch IAM ARN from API instead of hardcoding it in source
  const trustPolicyPre = document.getElementById('trustPolicyPre');
  if (trustPolicyPre) {
    const externalId = status.data?.external_id ?? 'PUT_THE_EXTERNAL_ID_HERE';
    try {
      const platformInfo = await apiService.getPlatformInfo();
      const arn = platformInfo.data?.cloudkraft_iam_arn ?? 'arn:aws:iam::REPLACE_ACCOUNT_ID:user/cloudkraft';
      trustPolicyPre.textContent = JSON.stringify({
        Version: '2012-10-17',
        Statement: [{
          Effect: 'Allow',
          Principal: { AWS: arn },
          Action: 'sts:AssumeRole',
          Condition: { StringEquals: { 'sts:ExternalId': externalId } },
        }],
      }, null, 4);
    } catch {
      trustPolicyPre.textContent = 'Could not load trust policy — please refresh.';
    }
  }

  const disconnectSection = document.getElementById('awsDisconnectSection');
  const disconnectBtn     = document.getElementById('awsDisconnectBtn') as HTMLButtonElement | null;

  if (status.data?.connected) {
    banner.className = 'aws-status-banner aws-status-connected';
    const method = status.data.auth_method === 'assume_role' ? 'IAM Role' : 'Access Keys';
    bannerTxt.textContent = `Connected · ${method} · ${status.data.region}`;
    if (regionSel && status.data.region) regionSel.value = status.data.region;
    const matchingRadio = document.querySelector<HTMLInputElement>(`input[name="authMethod"][value="${status.data.auth_method}"]`);
    if (matchingRadio) { matchingRadio.checked = true; toggleSections(status.data.auth_method); }
    if (disconnectSection) disconnectSection.style.display = 'block';
  } else {
    banner.className = 'aws-status-banner aws-status-disconnected';
    bannerTxt.textContent = 'Not connected — enter credentials below to connect';
    if (disconnectSection) disconnectSection.style.display = 'none';
  }

  disconnectBtn?.addEventListener('click', async () => {
    if (!confirm('Disconnect your AWS account? You will need to reconnect to deploy infrastructure.')) return;
    disconnectBtn.disabled = true;
    disconnectBtn.textContent = 'Disconnecting...';

    const result = await apiService.disconnectAWS();
    if (result.error) {
      alert(`Disconnect failed: ${result.error}`);
      disconnectBtn.disabled = false;
      disconnectBtn.textContent = 'Disconnect AWS Account';
      return;
    }

    localStorage.removeItem('aws_connected');
    localStorage.removeItem('aws_region');
    banner.className = 'aws-status-banner aws-status-disconnected';
    bannerTxt.textContent = 'Not connected — enter credentials below to connect';
    if (disconnectSection) disconnectSection.style.display = 'none';
    disconnectBtn.disabled = false;
    disconnectBtn.textContent = 'Disconnect AWS Account';
  });
}

// ─── Deployments list ─────────────────────────────────────────────────────────

const API_BASE_DEPLOY = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function deplStatusClass(status: string): string {
  if (status === 'succeeded') return 'success';
  if (status === 'failed') return 'error';
  if (status === 'destroyed') return 'destroyed';
  return 'warning';
}

async function initDeploymentsList(): Promise<void> {
  const container = document.getElementById('deploymentsContainer');
  if (!container) return;

  const render = async () => {
    container.innerHTML = '<div class="deployments-loading">Loading deployments...</div>';

    try {
      const res = await fetch(`${API_BASE_DEPLOY}/api/deploy/`, { credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const deployments: any[] = await res.json();

      if (deployments.length === 0) {
        container.innerHTML = `
          <div class="deployments-empty">
            <svg viewBox="0 0 24 24" fill="none" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>No deployments yet.</p>
            <a href="/workflow" data-navigate="/workflow" class="btn btn-primary">Go to Designer</a>
          </div>`;
        return;
      }

      container.innerHTML = `
        <table class="deployments-table">
          <thead>
            <tr>
              <th>Workflow</th>
              <th>Status</th>
              <th>Started</th>
              <th>Resources</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${deployments.map(d => `
              <tr data-deployment-id="${d.id}">
                <td class="depl-name">${d.workflow_name || '—'}</td>
                <td><span class="status-badge ${deplStatusClass(d.status)}">${d.status}</span></td>
                <td class="depl-time">${d.started_at ? new Date(d.started_at).toLocaleString() : '—'}</td>
                <td>${d.resource_count != null ? d.resource_count : '—'}</td>
                <td class="depl-actions">
                  <button class="btn btn-sm btn-outline depl-view-btn" data-id="${d.id}">View Logs</button>
                  ${d.status === 'succeeded'
                    ? `<button class="btn btn-sm btn-danger depl-destroy-btn" data-id="${d.id}">Destroy</button>`
                    : ''}
                </td>
              </tr>`).join('')}
          </tbody>
        </table>`;
    } catch (e) {
      container.innerHTML = `<div class="deployments-empty">Failed to load deployments: ${e}</div>`;
    }
  };

  await render();

  // Refresh button
  document.getElementById('refreshDeploymentsBtn')?.addEventListener('click', render);

  // Event delegation for View / Destroy buttons
  container.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;

    if (target.classList.contains('depl-view-btn')) {
      const id = target.dataset.id;
      if (id) { const { router } = await import('./router'); router.navigate(`/deployment?id=${id}`); }
    }

    if (target.classList.contains('depl-destroy-btn')) {
      const id = target.dataset.id;
      if (!id) return;
      if (!confirm('Destroy all AWS resources from this deployment? This cannot be undone.')) return;

      target.setAttribute('disabled', 'true');
      target.textContent = 'Destroying...';

      try {
        const res = await fetch(`${API_BASE_DEPLOY}/api/deploy/${id}/destroy`, {
          method: 'POST',
          credentials: 'include',
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
          alert(`Destroy failed: ${err.detail}`);
          target.removeAttribute('disabled');
          target.textContent = 'Destroy';
          return;
        }
        // Navigate to detail page to watch destroy logs
        const { router } = await import('./router');
        router.navigate(`/deployment?id=${id}`);
      } catch (err) {
        alert(`Network error: ${err}`);
        target.removeAttribute('disabled');
        target.textContent = 'Destroy';
      }
    }
  });
}

// ─── Profile page ─────────────────────────────────────────────────────────────

async function initProfile(): Promise<void> {
  if (!document.querySelector('.profile-main')) return;

  const setFeedback = (id: string, msg: string, isError: boolean) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.style.color = isError ? '#ef4444' : '#22c55e';
    if (msg) setTimeout(() => { el.textContent = ''; }, 4000);
  };

  // Password visibility toggles
  document.querySelectorAll<HTMLButtonElement>('.input-toggle-btn[data-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const inputId = btn.getAttribute('data-toggle');
      if (!inputId) return;
      const input = document.getElementById(inputId) as HTMLInputElement | null;
      if (input) input.type = input.type === 'password' ? 'text' : 'password';
    });
  });

  // Load current user data into form
  const userResult = await apiService.getCurrentUser();
  if (userResult.data) {
    const u = userResult.data as any;
    const nameInput = document.getElementById('profileFullName') as HTMLInputElement | null;
    const emailInput = document.getElementById('profileEmail') as HTMLInputElement | null;
    if (nameInput) nameInput.value = u.full_name || '';
    if (emailInput) emailInput.value = u.email || '';

    const userIdEl = document.getElementById('profileUserId');
    if (userIdEl) userIdEl.textContent = String(u.id);

    const memberSinceEl = document.getElementById('profileMemberSince');
    if (memberSinceEl && u.created_at) {
      memberSinceEl.textContent = new Date(u.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    }
  }

  // Load AWS status
  const awsStatusEl = document.getElementById('profileAwsStatus');
  const profileDisconnectSection = document.getElementById('profileDisconnectSection');
  const profileDisconnectBtn = document.getElementById('profileDisconnectBtn') as HTMLButtonElement | null;

  const refreshAwsStatus = async () => {
    if (!awsStatusEl) return;
    const awsResult = await apiService.getAWSStatus();
    const aws = awsResult.data;
    if (aws?.connected) {
      const method = aws.auth_method === 'assume_role' ? 'IAM Role Assumption' : 'Access Keys';
      awsStatusEl.innerHTML = `
        <div class="profile-aws-connected">
          <span class="profile-aws-dot connected"></span>
          <div class="profile-aws-info">
            <strong>Connected</strong>
            <div class="profile-aws-details">
              <span>Auth: ${method}</span>
              <span>·</span>
              <span>Region: ${aws.region || '—'}</span>
              ${aws.role_arn ? `<span>·</span><span class="profile-aws-arn">Role: ${aws.role_arn}</span>` : ''}
            </div>
          </div>
          <a href="/aws-connect" data-navigate="/aws-connect" class="btn btn-outline btn-sm">Manage</a>
        </div>`;
      if (profileDisconnectSection) profileDisconnectSection.style.display = 'block';
    } else {
      awsStatusEl.innerHTML = `
        <div class="profile-aws-connected">
          <span class="profile-aws-dot disconnected"></span>
          <div class="profile-aws-info">
            <strong>Not Connected</strong>
            <div class="profile-aws-details">Link your AWS account to enable deployments.</div>
          </div>
          <a href="/aws-connect" data-navigate="/aws-connect" class="btn btn-primary btn-sm">Connect AWS</a>
        </div>`;
      if (profileDisconnectSection) profileDisconnectSection.style.display = 'none';
    }
  };

  await refreshAwsStatus();

  profileDisconnectBtn?.addEventListener('click', async () => {
    if (!confirm('Disconnect your AWS account? You will need to reconnect to deploy infrastructure.')) return;
    profileDisconnectBtn.disabled = true;
    profileDisconnectBtn.textContent = 'Disconnecting...';
    const result = await apiService.disconnectAWS();
    profileDisconnectBtn.disabled = false;
    profileDisconnectBtn.textContent = 'Disconnect AWS Account';
    if (result.error) { alert(`Disconnect failed: ${result.error}`); return; }
    localStorage.removeItem('aws_connected');
    localStorage.removeItem('aws_region');
    await refreshAwsStatus();
  });

  // Load env vars status
  const envResult = await apiService.getEnvVars();
  const keyStatusEl = document.getElementById('anthropicKeyStatus');
  if (keyStatusEl && envResult.data) {
    if (envResult.data.anthropic_api_key_set) {
      keyStatusEl.innerHTML = `<span class="profile-key-active">Current key: ${envResult.data.anthropic_api_key_preview || '****'}</span>`;
    } else {
      keyStatusEl.innerHTML = `<span class="profile-key-none">No key set — server default will be used if available</span>`;
    }
  }

  // Edit profile form
  document.getElementById('editProfileForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('editProfileBtn') as HTMLButtonElement;
    const name = (document.getElementById('profileFullName') as HTMLInputElement)?.value.trim();
    const email = (document.getElementById('profileEmail') as HTMLInputElement)?.value.trim();
    if (!email) { setFeedback('editProfileFeedback', 'Email is required.', true); return; }

    btn.disabled = true;
    btn.textContent = 'Saving...';
    const result = await apiService.updateProfile(name, email);
    btn.disabled = false;
    btn.textContent = 'Save Changes';

    if (result.error) {
      setFeedback('editProfileFeedback', result.error, true);
      return;
    }
    // Update localStorage so sidebar reflects new name/email immediately
    const stored = JSON.parse(localStorage.getItem('current_user') || '{}');
    const updated = { ...stored, full_name: result.data?.full_name, email: result.data?.email };
    localStorage.setItem('current_user', JSON.stringify(updated));
    updateUserDisplay();
    setFeedback('editProfileFeedback', 'Profile updated!', false);
  });

  // Change password form
  document.getElementById('changePasswordForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('changePasswordBtn') as HTMLButtonElement;
    const current = (document.getElementById('currentPassword') as HTMLInputElement)?.value;
    const newPwd  = (document.getElementById('newPassword') as HTMLInputElement)?.value;
    const confirm = (document.getElementById('confirmNewPassword') as HTMLInputElement)?.value;

    if (!current || !newPwd || !confirm) { setFeedback('changePasswordFeedback', 'All fields are required.', true); return; }
    if (newPwd !== confirm) { setFeedback('changePasswordFeedback', 'New passwords do not match.', true); return; }
    if (newPwd.length < 8) { setFeedback('changePasswordFeedback', 'Password must be at least 8 characters.', true); return; }

    btn.disabled = true;
    btn.textContent = 'Updating...';
    const result = await apiService.changePassword(current, newPwd);
    btn.disabled = false;
    btn.textContent = 'Update Password';

    if (result.error) { setFeedback('changePasswordFeedback', result.error, true); return; }

    (document.getElementById('currentPassword') as HTMLInputElement).value = '';
    (document.getElementById('newPassword') as HTMLInputElement).value = '';
    (document.getElementById('confirmNewPassword') as HTMLInputElement).value = '';
    setFeedback('changePasswordFeedback', 'Password updated successfully!', false);
  });

  // Env vars form
  document.getElementById('envVarsForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('saveEnvVarsBtn') as HTMLButtonElement;
    const key = (document.getElementById('anthropicApiKey') as HTMLInputElement)?.value.trim();
    if (!key) { setFeedback('envVarsFeedback', 'Enter an API key to save.', true); return; }

    btn.disabled = true;
    btn.textContent = 'Saving...';
    const result = await apiService.updateEnvVars(key);
    btn.disabled = false;
    btn.textContent = 'Save Key';

    if (result.error) { setFeedback('envVarsFeedback', result.error, true); return; }

    (document.getElementById('anthropicApiKey') as HTMLInputElement).value = '';
    if (keyStatusEl && result.data) {
      keyStatusEl.innerHTML = `<span class="profile-key-active">Current key: ${result.data.anthropic_api_key_preview || '****'}</span>`;
    }
    setFeedback('envVarsFeedback', 'API key saved!', false);
  });

  // Clear Anthropic key
  document.getElementById('clearAnthropicKeyBtn')?.addEventListener('click', async () => {
    if (!confirm('Remove your Anthropic API key? The server default will be used instead.')) return;
    const result = await apiService.updateEnvVars(null);
    if (result.error) { setFeedback('envVarsFeedback', result.error, true); return; }
    if (keyStatusEl) {
      keyStatusEl.innerHTML = `<span class="profile-key-none">No key set — server default will be used if available</span>`;
    }
    setFeedback('envVarsFeedback', 'API key removed.', false);
  });
}
