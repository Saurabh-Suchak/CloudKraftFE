export const Profile = (): string => {
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
          <a href="/deployments" data-navigate="/deployments" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Deployments</span>
          </a>
          <a href="/profile" data-navigate="/profile" class="nav-item active">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Profile</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <a href="/profile" data-navigate="/profile" class="user-profile-link">
            <div class="user-profile">
              <div class="user-avatar" data-user-avatar>U</div>
              <div class="user-info">
                <div class="user-name" data-user-name>User</div>
                <div class="user-email" data-user-email></div>
              </div>
            </div>
          </a>
          <button class="btn-logout" id="logoutBtn">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 17L21 12L16 7M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Log out
          </button>
        </div>
      </aside>

      <main class="profile-main">
        <header class="profile-header">
          <h2 class="page-title">Profile</h2>
          <div class="user-avatar-small" data-user-avatar>U</div>
        </header>

        <div class="profile-content">

          <!-- Account Info -->
          <div class="profile-card">
            <div class="profile-card-header">
              <div class="profile-avatar-large" data-user-avatar>U</div>
              <div class="profile-identity">
                <div class="profile-display-name" data-user-name>User</div>
                <div class="profile-display-email" data-user-email></div>
                <div class="profile-meta">
                  <span class="profile-meta-item">ID: <span id="profileUserId">—</span></span>
                  <span class="profile-meta-sep">·</span>
                  <span class="profile-meta-item">Member since <span id="profileMemberSince">—</span></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Edit Profile -->
          <div class="profile-card">
            <h3 class="profile-card-title">Edit Profile</h3>
            <form id="editProfileForm" class="profile-form">
              <div class="form-group">
                <label class="form-label" for="profileFullName">Full Name</label>
                <input type="text" id="profileFullName" class="form-input" placeholder="Your full name" />
              </div>
              <div class="form-group">
                <label class="form-label" for="profileEmail">Email Address</label>
                <input type="email" id="profileEmail" class="form-input" placeholder="your@email.com" />
              </div>
              <div class="profile-form-footer">
                <span class="profile-form-feedback" id="editProfileFeedback"></span>
                <button type="submit" class="btn btn-primary" id="editProfileBtn">Save Changes</button>
              </div>
            </form>
          </div>

          <!-- Change Password -->
          <div class="profile-card">
            <h3 class="profile-card-title">Change Password</h3>
            <form id="changePasswordForm" class="profile-form">
              <div class="form-group">
                <label class="form-label" for="currentPassword">Current Password</label>
                <div class="input-with-toggle">
                  <input type="password" id="currentPassword" class="form-input" placeholder="Enter current password" />
                  <button type="button" class="input-toggle-btn" data-toggle="currentPassword">
                    <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
                  </button>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="newPassword">New Password</label>
                <div class="input-with-toggle">
                  <input type="password" id="newPassword" class="form-input" placeholder="At least 8 characters" />
                  <button type="button" class="input-toggle-btn" data-toggle="newPassword">
                    <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
                  </button>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="confirmNewPassword">Confirm New Password</label>
                <div class="input-with-toggle">
                  <input type="password" id="confirmNewPassword" class="form-input" placeholder="Repeat new password" />
                  <button type="button" class="input-toggle-btn" data-toggle="confirmNewPassword">
                    <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
                  </button>
                </div>
              </div>
              <div class="profile-form-footer">
                <span class="profile-form-feedback" id="changePasswordFeedback"></span>
                <button type="submit" class="btn btn-primary" id="changePasswordBtn">Update Password</button>
              </div>
            </form>
          </div>

          <!-- AWS Credential Status -->
          <div class="profile-card">
            <h3 class="profile-card-title">AWS Connection</h3>
            <div id="profileAwsStatus" class="profile-aws-status">
              <div class="profile-loading">Loading AWS status...</div>
            </div>
            <div id="profileDisconnectSection" style="display:none; margin-top:1rem;">
              <button type="button" class="btn btn-outline btn-danger-outline" id="profileDisconnectBtn">Disconnect AWS Account</button>
            </div>
          </div>

          <!-- Environment Variables -->
          <div class="profile-card">
            <h3 class="profile-card-title">Environment Variables</h3>
            <p class="profile-card-desc">These keys are encrypted and stored securely. They override server-level defaults for your account.</p>
            <form id="envVarsForm" class="profile-form">
              <div class="form-group">
                <label class="form-label" for="anthropicApiKey">
                  Anthropic API Key
                  <span class="form-label-hint">Used for AI architecture generation</span>
                </label>
                <div class="input-with-toggle">
                  <input type="password" id="anthropicApiKey" class="form-input" placeholder="sk-ant-api03-..." />
                  <button type="button" class="input-toggle-btn" data-toggle="anthropicApiKey">
                    <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
                  </button>
                </div>
                <div class="profile-key-status" id="anthropicKeyStatus"></div>
              </div>
              <div class="profile-form-footer">
                <button type="button" class="btn btn-outline" id="clearAnthropicKeyBtn">Clear Key</button>
                <span class="profile-form-feedback" id="envVarsFeedback"></span>
                <button type="submit" class="btn btn-primary" id="saveEnvVarsBtn">Save Key</button>
              </div>
            </form>
          </div>

        </div>
      </main>
    </div>
  `;
};
