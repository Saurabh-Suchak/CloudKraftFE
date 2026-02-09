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
          <a href="/templates" data-navigate="/templates" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/>
              <rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Templates</span>
          </a>
          <a href="/deployments" data-navigate="/deployments" class="nav-item active">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Deployments</span>
          </a>
          <a href="/settings" data-navigate="/settings" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Settings</span>
          </a>
        </nav>
        
        <div class="sidebar-footer">
          <div class="user-profile">
            <div class="user-avatar">JD</div>
            <div class="user-info">
              <div class="user-name">John Doe</div>
              <div class="user-email">john.doe@email.com</div>
            </div>
          </div>
        </div>
      </aside>
      
      <main class="deployment-main">
        <header class="deployment-header">
          <div>
            <h2 class="page-title">6.3.5 Deployment Status</h2>
            <div class="deployment-info">
              <h3 class="deployment-name">Production VPC Deployment</h3>
              <div class="deployment-meta">
                <span class="status-badge warning">
                  <span class="status-dot"></span>
                  Deployment in Progress...
                </span>
                <span class="deployment-time">2023-10-27 10:00:00 UTC</span>
              </div>
            </div>
          </div>
          <div class="deployment-actions">
            <button class="btn btn-outline">Re-run Deployment</button>
            <button class="btn btn-outline">Download Logs</button>
            <button class="btn btn-primary">Apply Active</button>
          </div>
        </header>
        
        <div class="deployment-content">
          <div class="deployment-logs-panel">
            <div class="logs-header">Deployment Logs</div>
            <div class="logs-container">
              <div class="log-entry">
                <span class="log-time">[10:00:15]</span>
                <span class="log-message">Initializing Terraform...</span>
              </div>
              <div class="log-entry">
                <span class="log-time">[10:00:18]</span>
                <span class="log-message">Terraform plan completed. 12 to add, 0 to change, 0 to destroy.</span>
              </div>
              <div class="log-entry error">
                <span class="log-time">[10:01:05]</span>
                <span class="log-message">[ERROR] Error creating subnet: Subnet CIDR block overlaps with existing subnet.</span>
              </div>
              <div class="log-entry warning">
                <span class="log-time">[10:01:15]</span>
                <span class="log-message">[WARNING] Apply partially succeeded. Some resources failed to create.</span>
              </div>
            </div>
          </div>
          
          <div class="deployment-summary-panel">
            <h3 class="panel-title">Deployment Summary</h3>
            <div class="summary-content">
              <div class="summary-item">
                <div class="summary-label">Status</div>
                <div class="summary-value">
                  <span class="status-badge warning">
                    <span class="status-dot"></span>
                    Partially Succeeded
                  </span>
                </div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Duration</div>
                <div class="summary-value">1m 15s</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Triggered by</div>
                <div class="summary-value">jane.doe@example.com</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Resources Created</div>
                <div class="summary-value success">10</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Resources Updated</div>
                <div class="summary-value">0</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Resources Destroyed</div>
                <div class="summary-value">0</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Resources Failed</div>
                <div class="summary-value error">2</div>
              </div>
            </div>
            <button class="btn btn-outline btn-full">View in Console</button>
          </div>
        </div>
      </main>
    </div>
  `;
};

