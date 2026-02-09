export const NotFound = (): string => {
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
          <h1 class="login-title">404 - Page Not Found</h1>
          <p class="login-subtitle">The page you're looking for doesn't exist.</p>
          <a href="/" data-navigate="/" class="btn btn-primary btn-full" style="text-decoration: none; display: inline-block; text-align: center;">Go to Login</a>
        </div>
      </main>
    </div>
  `;
};

