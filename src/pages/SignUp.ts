export const SignUp = (): string => {
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
          <h1 class="login-title">Sign Up</h1>
          <p class="login-subtitle">Create your account to get started with CloudKraft.</p>
          
          <form class="login-form" id="signupForm">
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
              <label for="password" class="form-label">Password</label>
              <div class="password-input-wrapper">
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  class="form-input" 
                  placeholder="Create a password"
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
            
            <div class="form-group">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <div class="password-input-wrapper">
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  class="form-input" 
                  placeholder="Confirm your password"
                  required
                />
                <button type="button" class="password-toggle" id="confirmPasswordToggle">
                  <svg class="eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" id="terms" name="terms" required />
                <span>I agree to the <a href="#" class="link">Terms of Service</a> and <a href="#" class="link">Privacy Policy</a></span>
              </label>
            </div>
            
            <button type="submit" class="btn btn-primary btn-full">Sign Up</button>
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
            Sign up with AWS
          </button>
          
          <div class="signup-link">
            <span>Already have an account?</span>
            <a href="/login" data-navigate="/login" class="link">Sign In</a>
          </div>
        </div>
      </main>
    </div>
  `;
};

