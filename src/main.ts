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
  
  // Initialize AWS Signup form if it exists in DOM
  const awsForm = document.getElementById('awsSignupForm');
  if (awsForm && !awsForm.hasAttribute('data-initialized')) {
    initAwsSignupForm();
  }
});

// Helper function to initialize AWS Signup interactions
function initAwsSignupForm() {
  const awsForm = document.getElementById('awsSignupForm');
  if (!awsForm) return;
  awsForm.setAttribute('data-initialized', 'true');

  const authRadios = document.querySelectorAll('input[name="authMethod"]');
  const accessKeySection = document.getElementById('accessKeySection');
  const assumeRoleSection = document.getElementById('assumeRoleSection');
  const awsExternalIdInput = document.getElementById('awsExternalId') as HTMLInputElement;
  const displayExternalId = document.getElementById('displayExternalId');

  // Generate External ID if not already generated
  if (displayExternalId && awsExternalIdInput && !awsExternalIdInput.value) {
    const generatedId = crypto.randomUUID();
    awsExternalIdInput.value = generatedId;
    displayExternalId.textContent = generatedId;
  }
}

// Delegate radio toggle events to the document so they survive DOM re-renders by the router
document.addEventListener('change', (e) => {
  const target = e.target as HTMLInputElement;
  if (target.name === 'authMethod') {
    const accessKeySection = document.getElementById('accessKeySection');
    const assumeRoleSection = document.getElementById('assumeRoleSection');
    
    if (target.value === 'access_key') {
      if (accessKeySection) {
        accessKeySection.style.display = 'block';
        accessKeySection.classList.add('active');
      }
      if (assumeRoleSection) {
        assumeRoleSection.style.display = 'none';
        assumeRoleSection.classList.remove('active');
      }
    } else if (target.value === 'assume_role') {
      if (accessKeySection) {
        accessKeySection.style.display = 'none';
        accessKeySection.classList.remove('active');
      }
      if (assumeRoleSection) {
        assumeRoleSection.style.display = 'block';
        assumeRoleSection.classList.add('active');
      }
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Check periodically in case the router renders the form asynchronously
setInterval(() => {
  const awsForm = document.getElementById('awsSignupForm');
  if (awsForm && !awsForm.hasAttribute('data-initialized')) {
    initAwsSignupForm();
  }
}, 250);

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
    // Validate AWS credentials based on Auth Method
    const authMethodEl = form.querySelector('input[name="authMethod"]:checked') as HTMLInputElement;
    const authMethod = authMethodEl ? authMethodEl.value : 'access_key';
    
    let accessKey: string | undefined;
    let secretKey: string | undefined;
    let roleArn: string | undefined;
    let externalId: string | undefined;
    const region = (form.querySelector('#awsRegion') as HTMLSelectElement)?.value;

    if (authMethod === 'access_key') {
       accessKey = (form.querySelector('#awsAccessKey') as HTMLInputElement)?.value.trim();
       secretKey = (form.querySelector('#awsSecretKey') as HTMLInputElement)?.value.trim();
       
       if (!accessKey || !secretKey || !region) {
         alert('Please fill in all AWS Access Key fields.');
         return;
       }
       
       if (!accessKey.startsWith('AKIA') && accessKey.length < 16) {
         alert('Please enter a valid AWS Access Key ID.');
         return;
       }
    } else if (authMethod === 'assume_role') {
       roleArn = (form.querySelector('#awsRoleArn') as HTMLInputElement)?.value.trim();
       externalId = (form.querySelector('#awsExternalId') as HTMLInputElement)?.value.trim();
       
       if (!roleArn || !region) {
         alert('Please fill in your AWS Role ARN and Region.');
         return;
       }
       
       if (!roleArn.startsWith('arn:aws:iam::')) {
         alert('Please enter a valid IAM Role ARN.');
         return;
       }
    }
    
    // Mock API Connection Flow
    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalBtnContent = submitBtn.innerHTML;
    
    // Set loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="aws-icon animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-dasharray="31.4 31.4" stroke-linecap="round"/>
      </svg>
      Connecting...
    `;
    
    // Call actual FastAPI Backend
    const payload = {
      authMethod,
      accessKey: accessKey || null,
      secretKey: secretKey || null,
      roleArn: roleArn || null,
      externalId: externalId || null,
      region,
      email: (form.querySelector('#email') as HTMLInputElement)?.value.trim() || 'user@example.com',
      fullName: (form.querySelector('#fullName') as HTMLInputElement)?.value.trim() || 'User'
    };

    fetch('http://localhost:8000/api/aws/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
    .then(async (response) => {
      if (!response.ok) {
        let errMessage = 'Failed to connect to AWS';
        try {
          const err = await response.json();
          errMessage = err.detail || errMessage;
        } catch (e) {
          // If response is not JSON
        }
        throw new Error(errMessage);
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem('aws_connected', 'true');
      localStorage.setItem('aws_region', data.region);
      
      // Navigate to dashboard on successful AWS signup
      router.navigate('/dashboard');
    })
    .catch((error) => {
      // Remove any existing error messages
      const existingError = form.querySelector('.error-message');
      if (existingError) existingError.remove();

      // Show inline error message instead of blocking alert
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.style.color = '#ff4d4f';
      errorDiv.style.background = 'rgba(255, 77, 79, 0.1)';
      errorDiv.style.padding = '10px';
      errorDiv.style.borderRadius = '4px';
      errorDiv.style.marginBottom = '15px';
      errorDiv.style.border = '1px solid #ff4d4f';
      errorDiv.style.fontSize = '14px';
      errorDiv.innerText = error.message;
      
      // Insert before the submit button
      form.insertBefore(errorDiv, submitBtn);

      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
    });
  }
});