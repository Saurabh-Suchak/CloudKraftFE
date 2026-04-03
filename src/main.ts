import { router } from './router';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { SignUpAWS } from './pages/SignUpAWS';
import { Dashboard } from './pages/Dashboard';
import { WorkflowDesigner } from './pages/WorkflowDesigner';
import { CodeViewer } from './pages/CodeViewer';
import { DeploymentStatus } from './pages/DeploymentStatus';
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
router.addRoute('*', NotFound);

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

  tbody.innerHTML = '<tr><td colspan="3" class="table-loading">Loading projects...</td></tr>';

  const result = await apiService.getWorkflows();
  if (result.error) {
    tbody.innerHTML = `<tr><td colspan="3" class="table-empty">Could not load projects: ${escapeHtml(result.error)}</td></tr>`;
    return;
  }

  const workflows: any[] = result.data || [];
  workflowsCache = workflows;

  if (workflows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="table-empty">No projects yet. Click "New Project" to get started.</td></tr>';
    return;
  }

  tbody.innerHTML = workflows.map(wf => `
    <tr>
      <td>${escapeHtml(wf.name)}${wf.description ? `<div class="project-desc">${escapeHtml(wf.description)}</div>` : ''}</td>
      <td>${formatRelativeDate(wf.updated_at || wf.created_at)}</td>
      <td>
        <div class="action-links">
          <button class="action-link" data-action="open" data-id="${wf.id}">Open</button>
          <button class="action-link action-link-danger" data-action="delete" data-id="${wf.id}" data-name="${escapeHtml(wf.name)}">Delete</button>
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
      if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

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
      // Restore canvas state when navigating back from code/deployment view
      const canvasJson = localStorage.getItem('canvas_state');
      if (canvasJson) {
        try {
          const state = JSON.parse(canvasJson);
          if (state?.nodes?.length) {
            setTimeout(() => {
              loadWorkflowState(state);
              setDesignerTitle(localStorage.getItem('current_workflow_name'));
            }, 200);
          }
        } catch { /* ignore malformed data */ }
      }
    }
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
}

const appEl = document.getElementById('app');
if (appEl) {
  new MutationObserver(onRouteChange).observe(appEl, { childList: true });
}

// ─── Logout ───────────────────────────────────────────────────────────────────

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.closest('#logoutBtn')) {
    apiService.logout();
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
    const email     = (form.querySelector('#email')       as HTMLInputElement)?.value;
    const fullName  = (form.querySelector('#fullName')    as HTMLInputElement)?.value;
    const accessKey = (form.querySelector('#awsAccessKey') as HTMLInputElement)?.value.trim();
    const secretKey = (form.querySelector('#awsSecretKey') as HTMLInputElement)?.value.trim();
    const region    = (form.querySelector('#awsRegion')   as HTMLSelectElement)?.value;

    if (!accessKey || !secretKey || !region || !email || !fullName) {
      alert('Please fill in all fields.'); return;
    }
    if (!accessKey.startsWith('AKIA') && accessKey.length < 16) {
      alert('Please enter a valid AWS Access Key ID.'); return;
    }

    const result = await apiService.registerWithAWS(email, fullName, accessKey, secretKey, region);
    if (result.error) { alert(`Registration failed: ${result.error}`); return; }

    const userResult = await apiService.getCurrentUser();
    if (userResult.data) localStorage.setItem('current_user', JSON.stringify(userResult.data));

    router.navigate('/dashboard');
  }
});
