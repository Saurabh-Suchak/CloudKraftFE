export const AWSConnect = (): string => {
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
          <a href="/aws-connect" data-navigate="/aws-connect" class="nav-item active">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0M12 13v4M10 19h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>AWS Connect</span>
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

      <main class="aws-connect-main">
        <div class="aws-connect-card">

          <div class="aws-connect-header">
            <div class="aws-connect-logo">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 15" stroke="#FF9900" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0M12 13v4M10 19h4" stroke="#FF9900" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <h2 class="aws-connect-title">AWS Connection</h2>
              <p class="aws-connect-subtitle">Connect your AWS account to enable deployments</p>
            </div>
          </div>

          <!-- Dynamic status banner -->
          <div id="awsStatusBanner" class="aws-status-banner aws-status-loading">
            <span class="aws-status-dot"></span>
            <span id="awsStatusText">Checking connection...</span>
          </div>

          <!-- Method toggle -->
          <div class="aws-method-tabs">
            <button class="aws-method-tab active" id="tabAccessKey" data-method="access_key">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 2L19 4M15 8L6.5 16.5M11 11L13 13M9 17H7V19H5V21H2V18L7 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="17" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
              </svg>
              Access Keys
            </button>
            <button class="aws-method-tab" id="tabAssumeRole" data-method="assume_role">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 3H8C7.4 3 7 3.4 7 4V7H17V4C17 3.4 16.6 3 16 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="14" r="2" stroke="currentColor" stroke-width="2"/>
              </svg>
              IAM Role
            </button>
          </div>

          <form class="aws-connect-form" id="awsConnectForm">
            <input type="hidden" id="connectAuthMethod" value="access_key" />

            <!-- Access Key fields -->
            <div id="accessKeyFields">
              <div class="form-group">
                <label class="form-label" for="connectAccessKey">Access Key ID</label>
                <input type="text" id="connectAccessKey" class="form-input" placeholder="AKIAIOSFODNN7EXAMPLE" autocomplete="off" />
              </div>
              <div class="form-group">
                <label class="form-label" for="connectSecretKey">Secret Access Key</label>
                <div class="password-input-wrapper">
                  <input type="password" id="connectSecretKey" class="form-input" placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" autocomplete="off" />
                  <button type="button" class="password-toggle" id="connectSecretToggle">
                    <svg class="eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- IAM Role fields -->
            <div id="assumeRoleFields" style="display:none;">
              <div class="form-group">
                <label class="form-label" for="connectRoleArn">IAM Role ARN</label>
                <input type="text" id="connectRoleArn" class="form-input" placeholder="arn:aws:iam::123456789012:role/CloudKraftRole" />
              </div>
              <div class="form-group">
                <label class="form-label" for="connectExternalId">
                  External ID
                  <span class="form-hint-inline">(optional)</span>
                </label>
                <input type="text" id="connectExternalId" class="form-input" placeholder="my-external-id" />
              </div>
              <div class="aws-role-info">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                The backend must have its own AWS credentials to assume this role. Add <code>BACKEND_AWS_ACCESS_KEY</code> and <code>BACKEND_AWS_SECRET_KEY</code> to the server <code>.env</code>.
              </div>
            </div>

            <!-- Region (always shown) -->
            <div class="form-group">
              <label class="form-label" for="connectRegion">AWS Region</label>
              <select id="connectRegion" class="form-input">
                <option value="us-east-1">us-east-1 — N. Virginia</option>
                <option value="us-east-2">us-east-2 — Ohio</option>
                <option value="us-west-1">us-west-1 — N. California</option>
                <option value="us-west-2">us-west-2 — Oregon</option>
                <option value="ap-south-1">ap-south-1 — Mumbai</option>
                <option value="ap-northeast-1">ap-northeast-1 — Tokyo</option>
                <option value="ap-southeast-1">ap-southeast-1 — Singapore</option>
                <option value="ap-southeast-2">ap-southeast-2 — Sydney</option>
                <option value="eu-central-1">eu-central-1 — Frankfurt</option>
                <option value="eu-west-1">eu-west-1 — Ireland</option>
                <option value="eu-west-2">eu-west-2 — London</option>
                <option value="ca-central-1">ca-central-1 — Canada</option>
                <option value="sa-east-1">sa-east-1 — São Paulo</option>
              </select>
            </div>

            <div id="awsConnectFeedback" class="aws-connect-feedback" style="display:none;"></div>

            <button type="submit" class="btn btn-primary btn-full aws-connect-submit" id="awsConnectSubmit">
              Connect AWS Account
            </button>
          </form>

        </div>
      </main>
    </div>
  `;
};
