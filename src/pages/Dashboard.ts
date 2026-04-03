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

      <main class="main-content">
        <header class="top-bar">
          <div class="search-bar">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input type="text" placeholder="Search projects..." class="search-input" id="projectSearch" />
          </div>
          <div class="top-bar-actions">
            <div class="user-avatar-small" data-user-avatar>U</div>
          </div>
        </header>

        <div class="content-area">
          <div class="page-header">
            <h1 class="page-title">Projects</h1>
            <button class="btn btn-primary" id="newProjectBtn" data-navigate="/workflow">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              New Project
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
              <tbody id="workflowsTableBody">
                <tr>
                  <td colspan="3" class="table-loading">Loading projects...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  `;
};
