import { router } from './router';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { SignUpAWS } from './pages/SignUpAWS';
import { Dashboard } from './pages/Dashboard';
import { WorkflowDesigner } from './pages/WorkflowDesigner';
import { CodeViewer } from './pages/CodeViewer';
import { DeploymentStatus } from './pages/DeploymentStatus';
import { NotFound } from './pages/NotFound';
import './styles/main.css';
import { reinitWorkflowDesigner } from './workflow';

// Register routes
router.addRoute('/', Login);
router.addRoute('/login', Login);
router.addRoute('/signup', SignUp);
router.addRoute('/signup-aws', SignUpAWS);
router.addRoute('/dashboard', Dashboard);
router.addRoute('/workflow', WorkflowDesigner);
router.addRoute('/code', CodeViewer);
router.addRoute('/deployment', DeploymentStatus);
router.addRoute('*', NotFound); // Fallback route for 404

// Initialize router after DOM is ready and routes are registered
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    router.init();
    // Initialize workflow designer after render
    setTimeout(() => reinitWorkflowDesigner(), 200);
  });
} else {
  router.init();
  // Initialize workflow designer after render
  setTimeout(() => reinitWorkflowDesigner(), 200);
}

// Re-initialize workflow designer after navigation
// Use MutationObserver to detect when canvas is added to DOM
const observer = new MutationObserver(() => {
  if (document.getElementById('workflowCanvas')) {
    reinitWorkflowDesigner();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Handle password toggle on login and signup pages
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  
  // Login page password toggle
  if (target.id === 'passwordToggle' || target.closest('#passwordToggle')) {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    }
  }
  
  // Signup page password toggles
  if (target.id === 'confirmPasswordToggle' || target.closest('#confirmPasswordToggle')) {
    const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;
    if (confirmPasswordInput) {
      confirmPasswordInput.type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
    }
  }
  
  // AWS signup page secret key toggle
  if (target.id === 'awsSecretToggle' || target.closest('#awsSecretToggle')) {
    const awsSecretInput = document.getElementById('awsSecretKey') as HTMLInputElement;
    if (awsSecretInput) {
      awsSecretInput.type = awsSecretInput.type === 'password' ? 'text' : 'password';
    }
  }
});

// Handle form submissions
document.addEventListener('submit', (e) => {
  const form = e.target as HTMLFormElement;
  if (form.id === 'loginForm') {
    e.preventDefault();
    // Navigate to dashboard on successful login
    router.navigate('/dashboard');
  } else if (form.id === 'signupForm') {
    e.preventDefault();
    // Validate password match
    const password = (form.querySelector('#password') as HTMLInputElement)?.value;
    const confirmPassword = (form.querySelector('#confirmPassword') as HTMLInputElement)?.value;
    
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Navigate to dashboard on successful signup
    router.navigate('/dashboard');
  } else if (form.id === 'awsSignupForm') {
    e.preventDefault();
    // Validate AWS credentials
    const accessKey = (form.querySelector('#awsAccessKey') as HTMLInputElement)?.value.trim();
    const secretKey = (form.querySelector('#awsSecretKey') as HTMLInputElement)?.value.trim();
    const region = (form.querySelector('#awsRegion') as HTMLSelectElement)?.value;
    
    if (!accessKey || !secretKey || !region) {
      alert('Please fill in all AWS credential fields.');
      return;
    }
    
    // Basic validation for AWS Access Key format (starts with AKIA)
    if (!accessKey.startsWith('AKIA') && accessKey.length < 16) {
      alert('Please enter a valid AWS Access Key ID.');
      return;
    }
    
    // Navigate to dashboard on successful AWS signup
    router.navigate('/dashboard');
  }
});