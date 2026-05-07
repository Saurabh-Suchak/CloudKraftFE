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

          <div class="aws-header">
            <svg class="aws-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#FF9900"/>
            </svg>
            <h1 class="login-title">Connect AWS Account</h1>
          </div>
          <p class="login-subtitle">Link your AWS account to enable deployments from CloudKraft.</p>

          <!-- Dynamic status banner -->
          <div id="awsStatusBanner" class="aws-status-banner aws-status-loading">
            <span class="aws-status-dot"></span>
            <span id="awsStatusText">Checking connection...</span>
          </div>

          <form class="login-form" id="awsConnectForm">

            <div class="auth-method-selector">
              <label class="radio-card">
                <input type="radio" name="authMethod" value="access_key">
                <div class="radio-card-content">
                  <span class="radio-title">Using Access Keys</span>
                </div>
              </label>
              <label class="radio-card">
                <input type="radio" name="authMethod" value="assume_role" checked>
                <div class="radio-card-content">
                  <span class="radio-title" style="white-space: nowrap;">Using Assume Role</span>
                </div>
              </label>
            </div>

            <!-- Access Key Section -->
            <div id="accessKeySection" class="auth-section" style="display: none;">
              <div class="instructions-box">
                <h4>Step 1: Ensure your IAM user has the required permissions</h4>
                <p>The IAM user whose credentials you're providing must have sufficient permissions to create and manage AWS resources. Go to <strong>IAM → Users → your user → Add permissions → Attach policies</strong> and attach:</p>
                <div class="info-block" style="background: var(--surface-100); padding: 12px; border-radius: 6px;">
                  <p style="margin-bottom: 8px; font-size: 13px;"><strong>Option A — Easiest (recommended for dev/test):</strong></p>
                  <p style="margin-bottom: 12px; font-size: 13px;">Attach <code class="code-span">AdministratorAccess</code></p>
                  <p style="margin-bottom: 8px; font-size: 13px;"><strong>Option B — Least privilege (production):</strong></p>
                  <ul style="margin: 8px 0 0 0; padding-left: 18px; font-size: 13px; color: var(--text-secondary); line-height: 1.8;">
                    <li><code class="code-span">AmazonEC2FullAccess</code></li>
                    <li><code class="code-span">AmazonS3FullAccess</code></li>
                    <li><code class="code-span">AmazonDynamoDBFullAccess</code></li>
                    <li><code class="code-span">AmazonSQSFullAccess</code></li>
                    <li><code class="code-span">AWSLambda_FullAccess</code></li>
                    <li><code class="code-span">IAMFullAccess</code></li>
                  </ul>
                </div>
              </div>
              <div class="form-group margin-top-1rem">
                <h4>Step 2: Enter your credentials</h4>
                <label for="awsAccessKey" class="form-label">AWS Access Key ID</label>
                <input type="text" id="awsAccessKey" name="awsAccessKey" class="form-input" placeholder="AKIAIOSFODNN7EXAMPLE" autocomplete="off" />
                <small class="form-hint">Your AWS Access Key ID</small>
              </div>
              <div class="form-group">
                <label for="awsSecretKey" class="form-label">AWS Secret Access Key</label>
                <div class="password-input-wrapper">
                  <input type="password" id="awsSecretKey" name="awsSecretKey" class="form-input" placeholder="Enter your AWS Secret Key" autocomplete="off" />
                  <button type="button" class="password-toggle" id="awsSecretToggle">
                    <svg class="eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                </div>
                <small class="form-hint">Your AWS Secret Access Key (keep this secure)</small>
              </div>
            </div>

            <!-- Assume Role Section -->
            <div id="assumeRoleSection" class="auth-section active">
              <div class="instructions-box">
                <h4>Step 1: Create an IAM Role for CloudKraft</h4>
                <p>Create an IAM Role in your AWS account to enable CloudKraft to perform actions on your behalf.</p>
                <div class="info-block" style="background: var(--surface-100); padding: 12px; border-radius: 6px; position: relative;">
                  <p style="margin-bottom: 12px;"><strong>Enable Require external ID with:</strong> <span id="displayExternalId" class="code-span">Generating...</span></p>
                  <p style="margin-bottom: 8px; font-size: 13px;"><strong>Custom Trust Policy:</strong></p>
                  <pre style="margin: 0; font-family: monospace; font-size: 12px; color: var(--text-600); white-space: pre-wrap; word-break: break-all; background: var(--surface-200); padding: 10px; border-radius: 4px;">
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::059801127401:user/cloudkraft"
            },
            "Action": "sts:AssumeRole",
            "Condition": {
                "StringEquals": {
                    "sts:ExternalId": "PUT THE EXTERNAL ID"
                }
            }
        }
    ]
}</pre>
                </div>
              </div>

              <div class="instructions-box margin-top-1rem">
                <h4>Step 2: Attach Permissions to the Role</h4>
                <p>The role needs permissions to create and manage AWS resources on your behalf. In the role you just created, go to <strong>Add permissions → Attach policies</strong> and attach the following:</p>
                <div class="info-block" style="background: var(--surface-100); padding: 12px; border-radius: 6px;">
                  <p style="margin-bottom: 8px; font-size: 13px;"><strong>Option A — Easiest (recommended for dev/test):</strong></p>
                  <p style="margin-bottom: 12px; font-size: 13px;">Attach <code class="code-span">AdministratorAccess</code></p>
                  <p style="margin-bottom: 8px; font-size: 13px;"><strong>Option B — Least privilege (production):</strong></p>
                  <p style="margin: 0; font-size: 13px;">Attach each policy you need:</p>
                  <ul style="margin: 8px 0 0 0; padding-left: 18px; font-size: 13px; color: var(--text-secondary); line-height: 1.8;">
                    <li><code class="code-span">AmazonEC2FullAccess</code></li>
                    <li><code class="code-span">AmazonS3FullAccess</code></li>
                    <li><code class="code-span">AmazonDynamoDBFullAccess</code></li>
                    <li><code class="code-span">AmazonSQSFullAccess</code></li>
                    <li><code class="code-span">AWSLambda_FullAccess</code></li>
                    <li><code class="code-span">IAMFullAccess</code></li>
                  </ul>
                </div>
              </div>

              <div class="form-group margin-top-1rem">
                <h4>Step 3: Enter Role ARN</h4>
                <p class="instructions-text">Open the role you just created, copy the ARN and paste below.</p>
                <label for="awsRoleArn" class="form-label">Role ARN</label>
                <input type="text" id="awsRoleArn" name="awsRoleArn" class="form-input" placeholder="arn:aws:iam::123456789012:role/CloudKraftRole" />
                <input type="hidden" id="awsExternalId" name="awsExternalId" />
              </div>
            </div>

            <!-- Region -->
            <div class="form-group">
              <label for="awsRegion" class="form-label">AWS Region</label>
              <select id="awsRegion" name="awsRegion" class="form-input" required>
                <option value="">Select a region</option>
                <option value="us-east-1">US East (N. Virginia) - us-east-1</option>
                <option value="us-east-2">US East (Ohio) - us-east-2</option>
                <option value="us-west-1">US West (N. California) - us-west-1</option>
                <option value="us-west-2">US West (Oregon) - us-west-2</option>
                <option value="eu-west-1">Europe (Ireland) - eu-west-1</option>
                <option value="eu-west-2">Europe (London) - eu-west-2</option>
                <option value="eu-central-1">Europe (Frankfurt) - eu-central-1</option>
                <option value="ap-southeast-1">Asia Pacific (Singapore) - ap-southeast-1</option>
                <option value="ap-southeast-2">Asia Pacific (Sydney) - ap-southeast-2</option>
                <option value="ap-northeast-1">Asia Pacific (Tokyo) - ap-northeast-1</option>
              </select>
            </div>

            <div id="awsConnectFeedback" class="aws-connect-feedback" style="display:none;"></div>

            <button type="submit" class="btn btn-primary btn-full" id="awsConnectSubmit">
              <svg class="aws-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
              </svg>
              Connect AWS Account
            </button>
          </form>

          <div class="aws-info-box">
            <h4 class="info-title">About AWS Integration</h4>
            <ul class="info-list">
              <li>Your AWS credentials are encrypted and stored securely</li>
              <li>CloudKraft uses IAM roles and policies for secure access</li>
              <li>You can revoke access at any time from your AWS console</li>
              <li>We recommend using IAM roles with limited permissions</li>
            </ul>
          </div>

        </div>
      </main>
    </div>
  `;
};
