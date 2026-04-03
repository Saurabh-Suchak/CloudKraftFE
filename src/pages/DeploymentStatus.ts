export const DeploymentStatus = (): string => {
  return `
    <div class="app-container">
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="logo">
            <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="logo-text">CloudKraft</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <a href="/dashboard" data-navigate="/dashboard" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Projects</span>
          </a>
          <a href="/workflow" data-navigate="/workflow" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Designer</span>
          </a>
          <a href="/deployment" data-navigate="/deployment" class="nav-item active">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Deployment</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="user-profile">
            <div class="user-avatar" data-user-avatar>U</div>
            <div class="user-info">
              <div class="user-name" data-user-name>User</div>
              <div class="user-email" data-user-email></div>
            </div>
          </div>
          <button class="btn-logout" id="logoutBtn">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 17L21 12L16 7M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Log out
          </button>
        </div>
      </aside>

      <main class="deployment-main">
        <header class="deployment-header">
          <div>
            <h2 class="page-title">Deployment</h2>
            <div class="deployment-info">
              <h3 class="deployment-name" id="deploymentWorkflowName">—</h3>
              <div class="deployment-meta">
                <span class="status-badge" id="deploymentStatusBadge">
                  <span class="status-dot"></span>
                  <span id="deploymentStatusText">Ready</span>
                </span>
                <span class="deployment-time" id="deploymentTime"></span>
              </div>
            </div>
          </div>
          <div class="deployment-actions">
            <button class="btn btn-outline" id="backToCodeBtn">Back to Code</button>
            <button class="btn btn-primary" id="startDeployBtn">Run Deployment</button>
          </div>
        </header>

        <div class="deployment-content">
          <div class="deployment-logs-panel">
            <div class="logs-header">Deployment Logs</div>
            <div class="logs-container" id="deploymentLogs">
              <div class="log-entry">
                <span class="log-message log-info">Waiting to start deployment...</span>
              </div>
            </div>
          </div>

          <div class="deployment-summary-panel">
            <h3 class="panel-title">Summary</h3>
            <div class="summary-content">
              <div class="summary-item">
                <div class="summary-label">Status</div>
                <div class="summary-value" id="summaryStatus">—</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Resources</div>
                <div class="summary-value" id="summaryNodeCount">—</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Files Generated</div>
                <div class="summary-value" id="summaryFileCount">—</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Triggered by</div>
                <div class="summary-value" data-user-name>—</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Started at</div>
                <div class="summary-value" id="summaryStartedAt">—</div>
              </div>
            </div>

            <div class="deployment-files" id="deploymentFiles"></div>
          </div>
        </div>
      </main>
    </div>
  `;
};
