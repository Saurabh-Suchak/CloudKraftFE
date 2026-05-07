export const WorkflowDesigner = (): string => {
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
          <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
        <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
        
        <nav class="sidebar-nav">
          <a href="/dashboard" data-navigate="/dashboard" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Projects</span>
          </a>
          <a href="/aws-connect" data-navigate="/aws-connect" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0M12 13v4M10 19h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>AWS Connect</span>
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
            <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
          <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
          <button class="btn-logout" id="logoutBtn">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 17L21 12L16 7M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Log out
          </button>
        <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
      </aside>

      <main class="workflow-main">
        <header class="workflow-header">
          <h2 class="workflow-title" contenteditable="true" spellcheck="false" data-placeholder="Workflow name"></h2>
          <div class="workflow-actions">
            <div class="undo-redo-group">
              <button class="btn btn-undo-redo" id="undoBtn" title="Undo (Ctrl+Z)" disabled>
                ↩ Undo
              </button>
              <button class="btn btn-undo-redo" id="redoBtn" title="Redo (Ctrl+Y)" disabled>
                Redo ↪
              </button>
            <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
            <button class="btn btn-outline" id="validateBtn">Validate</button>
            <button class="btn btn-outline" id="generateCodeBtn">Generate Code</button>
            <button class="btn btn-outline" id="exportPngBtn">
              <svg viewBox="0 0 24 24" fill="none" width="14" height="14" style="margin-right:4px;vertical-align:-1px">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Export PNG
            </button>
            <button class="btn btn-outline" id="templatesBtn">⊞ Templates</button>
            <button class="btn btn-ai" id="aiGenerateBtn">✨ AI Generate</button>
            <button class="btn btn-outline" id="clearCanvasBtn">Clear</button>
            <button class="btn btn-outline" id="saveBtn">Save</button>
            <button class="btn btn-primary" id="deployBtn">Deploy</button>
          <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
        </header>
        
        <div class="workflow-content">
          <aside class="resources-panel">
            <h3 class="panel-title">Resources</h3>
            <div class="resource-search-wrap">
              <svg class="resource-search-icon" viewBox="0 0 24 24" fill="none" width="14" height="14">
                <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <input
                type="text"
                id="resourceSearch"
                class="resource-search-input"
                placeholder="Search resources…"
                autocomplete="off"
              />
            <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
            <div class="resources-list">
              <div class="resource-category">
                <h4 class="category-title">Compute</h4>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              <div class="resource-item" draggable="true" data-resource="ec2">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M3 10H21M8 4V10M16 4V10" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>EC2 Instance</span>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              <div class="resource-item" draggable="true" data-resource="lambda">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 21L12 17L16 21M8 3L12 7L16 3M3 8L7 12L3 16M21 8L17 12L21 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Lambda Function</span>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              <div class="resource-item" draggable="true" data-resource="autoscaling">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Auto Scaling</span>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              
              <div class="resource-category">
                <h4 class="category-title">Networking</h4>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              <div class="resource-item" draggable="true" data-resource="vpc">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="12" r="2" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>VPC</span>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              <div class="resource-item" draggable="true" data-resource="subnet">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M3 9H21M9 3V21" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>Subnet</span>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              <div class="resource-item" draggable="true" data-resource="securitygroup">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C12 22 20 16 20 10V4L12 2L4 4V10C4 16 12 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 8V12M12 12V16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>Security Group</span>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              <div class="resource-item" draggable="true" data-resource="internetgateway">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Internet Gateway</span>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              <div class="resource-item" draggable="true" data-resource="routetable">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M3 9H21M9 3V21" stroke="currentColor" stroke-width="2"/>
                  <circle cx="7" cy="7" r="1" fill="currentColor"/>
                  <circle cx="17" cy="7" r="1" fill="currentColor"/>
                  <circle cx="7" cy="17" r="1" fill="currentColor"/>
                  <circle cx="17" cy="17" r="1" fill="currentColor"/>
                </svg>
                <span>Route Table</span>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              <div class="resource-item" draggable="true" data-resource="natgateway">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M3 12H21M9 6V18M15 6V18" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>NAT Gateway</span>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              <div class="resource-item" draggable="true" data-resource="loadbalancer">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M6 10H18M6 14H18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <circle cx="8" cy="12" r="1" fill="currentColor"/>
                  <circle cx="12" cy="12" r="1" fill="currentColor"/>
                  <circle cx="16" cy="12" r="1" fill="currentColor"/>
                </svg>
                <span>Load Balancer</span>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              
              <div class="resource-category">
                <h4 class="category-title">Storage</h4>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              <div class="resource-item" draggable="true" data-resource="s3">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16V8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>S3 Bucket</span>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              <div class="resource-item" draggable="true" data-resource="efs">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M8 8H16M8 12H16M8 16H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>EFS</span>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              <div class="resource-item" draggable="true" data-resource="ebs">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M9 6H15M9 10H15M9 14H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>EBS Volume</span>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              
              <div class="resource-category">
                <h4 class="category-title">Database</h4>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              <div class="resource-item" draggable="true" data-resource="rds">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" stroke-width="2"/>
                  <path d="M21 12C21 12.6 16.97 14 12 14C7.03 14 3 12.6 3 12" stroke="currentColor" stroke-width="2"/>
                  <path d="M21 5V19C21 19.6 16.97 21 12 21C7.03 21 3 19.6 3 19V5" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>RDS Database</span>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              <div class="resource-item" draggable="true" data-resource="dynamodb">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M3 9H21M9 3V21" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>DynamoDB</span>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              
              <div class="resource-category">
                <h4 class="category-title">Messaging</h4>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              <div class="resource-item" draggable="true" data-resource="sns">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>SNS Topic</span>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              <div class="resource-item" draggable="true" data-resource="sqs">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M3 8H21M3 12H21M3 16H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>SQS Queue</span>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              
              <div class="resource-category">
                <h4 class="category-title">Security & IAM</h4>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              <div class="resource-item" draggable="true" data-resource="iamrole">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>IAM Role</span>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              
              <div class="resource-category">
                <h4 class="category-title">CDN & Delivery</h4>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
              <div class="resource-item" draggable="true" data-resource="cloudfront">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="12" r="2" fill="currentColor"/>
                </svg>
                <span>CloudFront</span>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
            <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
          </aside>

          <div class="canvas-container">
            <div class="canvas-viewport" id="canvasViewport">
              <div class="workflow-canvas" id="workflowCanvas">
                <!-- Canvas grid background -->
                <svg class="canvas-grid" width="3000" height="2000">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" stroke-width="1"/>
                    </pattern>
                  </defs>
                  <rect width="3000" height="2000" fill="url(#grid)" />
                </svg>

                <!-- SVG layer for node connections -->
                <svg class="connections-layer" id="connectionsLayer">
                  <defs>
                    <marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                      <polygon points="0 0, 8 3, 0 6" fill="#3b82f6"/>
                    </marker>
                    <marker id="arrow-selected" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                      <polygon points="0 0, 8 3, 0 6" fill="#f59e0b"/>
                    </marker>
                  </defs>
                </svg>

                <!-- Nodes will be dynamically added here via drag and drop -->
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>

              <!-- Zoom controls overlay -->
              <div class="zoom-controls" id="zoomControls">
                <button class="zoom-btn" id="zoomOutBtn" title="Zoom out">−</button>
                <span class="zoom-level" id="zoomLevel">100%</span>
                <button class="zoom-btn" id="zoomInBtn" title="Zoom in">+</button>
                <button class="zoom-btn zoom-reset-btn" id="zoomResetBtn" title="Reset view">⊡</button>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
            <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
          <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
          
          <aside class="config-panel" id="configPanel">
            <h3 class="panel-title">Resource Configuration</h3>
            <div class="config-form" id="configForm">
              <div class="empty-config">
                <p>Select a resource from the canvas to configure it.</p>
              <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
            <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
            <button class="btn-delete-resource" id="deleteResourceBtn" style="display:none">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Delete Resource
            </button>
          </aside>
        <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
      </main>
    <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>

    <!-- Templates modal -->
    <div class="modal-overlay" id="templatesModal" style="display:none">
      <div class="modal-box">
        <div class="modal-header">
          <h3 class="modal-title">Architecture Templates</h3>
          <button class="modal-close" id="templatesModalClose">✕</button>
        <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
        <p class="modal-subtitle">Start from a pre-built architecture. It will replace the current canvas.</p>
        <div class="templates-grid" id="templatesGrid"></div>
      <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
    <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
  <!-- AI Generate modal -->
    <div class="modal-overlay" id="aiModal" style="display:none">
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title">✨ AI Architecture Generator</h3>
          <button class="modal-close" id="aiModalClose">✕</button>
        </div>
        <p class="modal-subtitle">Describe your infrastructure in plain English and CloudKraft will build it on the canvas.</p>
        <div class="ai-prompt-wrap">
          <textarea id="aiPromptInput" class="ai-prompt-input" rows="4"
            placeholder="e.g. A serverless REST API with Lambda, DynamoDB, an IAM role and an API Gateway..."></textarea>
          <div class="ai-examples">
            <span class="ai-examples-label">Try:</span>
            <button class="ai-example-chip" data-prompt="A 3-tier web app with VPC, public subnet, EC2, RDS MySQL and an Application Load Balancer">3-Tier Web App</button>
            <button class="ai-example-chip" data-prompt="A serverless event pipeline with SNS, two SQS queues, Lambda functions and DynamoDB">Event Pipeline</button>
            <button class="ai-example-chip" data-prompt="A static website hosted on S3 with CloudFront CDN and an IAM role">Static CDN</button>
            <button class="ai-example-chip" data-prompt="A secure VPC with public and private subnets, internet gateway, NAT gateway, and a bastion EC2 host">Secure VPC</button>
          </div>
        </div>
        <div class="ai-modal-footer">
          <span class="ai-status" id="aiStatus"></span>
          <button class="btn btn-outline" id="aiModalCancel">Cancel</button>
          <button class="btn btn-primary" id="aiGenerateSubmit">Generate Architecture</button>
        </div>
      </div>
    </div>
  </div>
  `;
};

