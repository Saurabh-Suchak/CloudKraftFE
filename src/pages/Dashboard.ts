export const Dashboard = (): string => {
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
          <a href="/dashboard" data-navigate="/dashboard" class="nav-item active">
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
          <a href="/deployments" data-navigate="/deployments" class="nav-item">
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
      
      <main class="main-content">
        <div id="awsConnectionBanner" class="aws-connection-banner" style="display: none; background: rgba(35, 47, 62, 0.9); color: white; padding: 10px 20px; font-size: 14px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #FF9900;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#FF9900"/>
              <path d="M2 17L12 22L22 17" stroke="#FF9900" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#FF9900" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <strong>AWS Connection Active</strong>
          </div>
          <div>Region: <span id="awsConnectionRegion" style="color: #FF9900; font-weight: bold;"></span></div>
        </div>
        <header class="top-bar">
          <div class="search-bar">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input type="text" placeholder="Search projects..." class="search-input" />
          </div>
          <div class="top-bar-actions">
            <button class="icon-button">
              <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8A6 6 0 0 0 6 8C6 11 3 14 3 17H21C21 14 18 11 18 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="user-avatar-small">JD</div>
          </div>
        </header>
        
        <div class="content-area">
          <div class="page-header">
            <h1 class="page-title">Project Dashboard</h1>
            <button class="btn btn-primary" data-navigate="/workflow">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Create New Project
            </button>
          </div>
          
          <div class="table-container">
            <table class="projects-table">
              <thead>
                <tr>
                  <th>PROJECT NAME</th>
                  <th>LAST MODIFIED</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Production VPC</td>
                  <td>2 days ago</td>
                  <td>
                    <div class="action-links">
                      <a href="#" class="action-link">Edit</a>
                      <a href="#" class="action-link">Deploy</a>
                      <a href="#" class="action-link">Delete</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Staging Kubernetes Cluster</td>
                  <td>5 days ago</td>
                  <td>
                    <div class="action-links">
                      <a href="#" class="action-link">Edit</a>
                      <a href="#" class="action-link">Deploy</a>
                      <a href="#" class="action-link">Delete</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Analytics Data Pipeline</td>
                  <td>1 week ago</td>
                  <td>
                    <div class="action-links">
                      <a href="#" class="action-link">Edit</a>
                      <a href="#" class="action-link">Deploy</a>
                      <a href="#" class="action-link">Delete</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Shared Services Network</td>
                  <td>2 weeks ago</td>
                  <td>
                    <div class="action-links">
                      <a href="#" class="action-link">Edit</a>
                      <a href="#" class="action-link">Deploy</a>
                      <a href="#" class="action-link">Delete</a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="pagination">
            <button class="pagination-btn" disabled>
              <svg class="pagination-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button class="pagination-number active">1</button>
            <button class="pagination-number">2</button>
            <button class="pagination-number">3</button>
            <span class="pagination-ellipsis">...</span>
            <button class="pagination-number">10</button>
            <button class="pagination-btn">
              <svg class="pagination-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
    <script>
      setTimeout(() => {
        const isConnected = localStorage.getItem('aws_connected');
        const region = localStorage.getItem('aws_region');
        if (isConnected === 'true') {
          const banner = document.getElementById('awsConnectionBanner');
          const regionSpan = document.getElementById('awsConnectionRegion');
          if (banner && regionSpan) {
            banner.style.display = 'flex';
            regionSpan.textContent = region || 'Unknown';
          }
        }
      }, 50);
    </script>
  `;
};

