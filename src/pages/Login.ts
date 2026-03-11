export const Login = (): string => {
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
          <h1 class="login-title">Sign In</h1>
          <p class="login-subtitle">Welcome back! Please enter your details.</p>
          
          <form class="login-form" id="loginForm">
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
              <label for="password" class="form-label">Password</label>
              <div class="password-input-wrapper">
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  class="form-input" 
                  placeholder="Enter your password"
                  required
                />
                <button type="button" class="password-toggle" id="passwordToggle">
                  <svg class="eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="form-footer">
              <a href="#" class="forgot-password">Forgot Password?</a>
            </div>
            
            <button type="submit" class="btn btn-primary btn-full">Sign In</button>
          </form>
          
          <div class="divider">
            <span class="divider-line"></span>
            <span class="divider-text">or</span>
            <span class="divider-line"></span>
          </div>
          
          <button class="btn btn-secondary btn-full" data-navigate="/signup-aws">
            <svg class="aws-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#FF9900"/>
            </svg>
            Sign in with AWS
          </button>
          
          <div class="signup-link">
            <span>Don't have an account?</span>
            <a href="/signup" data-navigate="/signup" class="link">Sign Up</a>
          </div>
        </div>
      </main>
    </div>
  `;
};

