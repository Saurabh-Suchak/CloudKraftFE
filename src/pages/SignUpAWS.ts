export const SignUpAWS = (): string => {
  return `
    <div class="login-container">
      <header class="login-header">
        <div class="logo">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="logo-text">CloudKraft</span>
        </div>
      </header>
      
      <main class="login-main">
        <div class="login-card">
          <div class="aws-header">
            <svg class="aws-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#FF9900"/>
            </svg>
            <h1 class="login-title">Sign Up with AWS</h1>
          </div>
          <p class="login-subtitle">Connect your AWS account to get started with CloudKraft.</p>
          
          <form class="login-form" id="awsSignupForm">
            <div class="form-group">
              <label for="awsAccessKey" class="form-label">AWS Access Key ID</label>
              <input 
                type="text" 
                id="awsAccessKey" 
                name="awsAccessKey" 
                class="form-input" 
                placeholder="AKIAIOSFODNN7EXAMPLE"
                required
              />
              <small class="form-hint">Your AWS Access Key ID</small>
            </div>
            
            <div class="form-group">
              <label for="awsSecretKey" class="form-label">AWS Secret Access Key</label>
              <div class="password-input-wrapper">
                <input 
                  type="password" 
                  id="awsSecretKey" 
                  name="awsSecretKey" 
                  class="form-input" 
                  placeholder="Enter your AWS Secret Key"
                  required
                />
                <button type="button" class="password-toggle" id="awsSecretToggle">
                  <svg class="eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
              </div>
              <small class="form-hint">Your AWS Secret Access Key (keep this secure)</small>
            </div>
            
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
            
            <div class="form-group">
              <label for="fullName" class="form-label">Full Name</label>
              <input 
                type="text" 
                id="fullName" 
                name="fullName" 
                class="form-input" 
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                class="form-input" 
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" id="awsTerms" name="awsTerms" required />
                <span>I agree to the <a href="#" class="link">Terms of Service</a> and <a href="#" class="link">Privacy Policy</a></span>
              </label>
            </div>
            
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" id="awsPermissions" name="awsPermissions" required />
                <span>I authorize CloudKraft to access my AWS resources for cloud management</span>
              </label>
            </div>
            
            <button type="submit" class="btn btn-primary btn-full">
              <svg class="aws-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
              </svg>
              Connect AWS Account
            </button>
          </form>
          
          <div class="divider">
            <span class="divider-line"></span>
            <span class="divider-text">or</span>
            <span class="divider-line"></span>
          </div>
          
          <div class="alternative-options">
            <button class="btn btn-secondary btn-full" data-navigate="/signup">
              Sign Up with Email Instead
            </button>
          </div>
          
          <div class="signup-link">
            <span>Already have an account?</span>
            <a href="/login" data-navigate="/login" class="link">Sign In</a>
          </div>
          
          <div class="aws-info-box">
            <h4 class="info-title">About AWS Integration</h4>
            <ul class="info-list">
              <li>Your AWS credentials are encrypted and stored securely</li>
              <li>CloudKraft uses IAM roles and policies for secure access</li>
              <li>You can revoke access at any time from your AWS console</li>
              <li>We recommend using IAM users with limited permissions</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  `;
};

