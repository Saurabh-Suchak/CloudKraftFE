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
          </div>
        </div>
        
        <nav class="sidebar-nav">
          <a href="/dashboard" data-navigate="/dashboard" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Projects</span>
          </a>
          <a href="/templates" data-navigate="/templates" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/>
              <rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Templates</span>
          </a>
          <a href="/deployments" data-navigate="/deployments" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Deployments</span>
          </a>
          <a href="/settings" data-navigate="/settings" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Settings</span>
          </a>
        </nav>
        
        <div class="sidebar-footer">
          <div class="user-profile">
            <div class="user-avatar">JD</div>
            <div class="user-info">
              <div class="user-name">John Doe</div>
              <div class="user-email">john.doe@email.com</div>
            </div>
          </div>
        </div>
      </aside>
      
      <main class="workflow-main">
        <header class="workflow-header">
          <h2 class="workflow-title">6.3.3 Visual Workflow Designer</h2>
          <div class="workflow-actions">
            <button class="btn btn-outline">Validate</button>
            <button class="btn btn-outline">Generate Code</button>
            <button class="btn btn-outline">Import</button>
            <button class="btn btn-outline">Save</button>
            <button class="btn btn-primary">Deploy</button>
          </div>
        </header>
        
        <div class="workflow-content">
          <aside class="resources-panel">
            <h3 class="panel-title">Resources</h3>
            <p class="panel-subtitle">Drag to canvas</p>
            <div class="resources-list">
              <div class="resource-category">
                <h4 class="category-title">Compute</h4>
              </div>
              <div class="resource-item" draggable="true" data-resource="ec2">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M3 10H21M8 4V10M16 4V10" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>EC2 Instance</span>
              </div>
              <div class="resource-item" draggable="true" data-resource="lambda">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 21L12 17L16 21M8 3L12 7L16 3M3 8L7 12L3 16M21 8L17 12L21 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Lambda Function</span>
              </div>
              <div class="resource-item" draggable="true" data-resource="autoscaling">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Auto Scaling</span>
              </div>
              
              <div class="resource-category">
                <h4 class="category-title">Networking</h4>
              </div>
              <div class="resource-item" draggable="true" data-resource="vpc">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="12" r="2" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>VPC</span>
              </div>
              <div class="resource-item" draggable="true" data-resource="subnet">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M3 9H21M9 3V21" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>Subnet</span>
              </div>
              <div class="resource-item" draggable="true" data-resource="securitygroup">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C12 22 20 16 20 10V4L12 2L4 4V10C4 16 12 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 8V12M12 12V16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>Security Group</span>
              </div>
              <div class="resource-item" draggable="true" data-resource="internetgateway">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Internet Gateway</span>
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
              </div>
              <div class="resource-item" draggable="true" data-resource="natgateway">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M3 12H21M9 6V18M15 6V18" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>NAT Gateway</span>
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
              </div>
              
              <div class="resource-category">
                <h4 class="category-title">Storage</h4>
              </div>
              <div class="resource-item" draggable="true" data-resource="s3">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16V8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>S3 Bucket</span>
              </div>
              <div class="resource-item" draggable="true" data-resource="efs">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M8 8H16M8 12H16M8 16H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>EFS</span>
              </div>
              <div class="resource-item" draggable="true" data-resource="ebs">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M9 6H15M9 10H15M9 14H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>EBS Volume</span>
              </div>
              
              <div class="resource-category">
                <h4 class="category-title">Database</h4>
              </div>
              <div class="resource-item" draggable="true" data-resource="rds">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" stroke-width="2"/>
                  <path d="M21 12C21 12.6 16.97 14 12 14C7.03 14 3 12.6 3 12" stroke="currentColor" stroke-width="2"/>
                  <path d="M21 5V19C21 19.6 16.97 21 12 21C7.03 21 3 19.6 3 19V5" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>RDS Database</span>
              </div>
              <div class="resource-item" draggable="true" data-resource="dynamodb">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M3 9H21M9 3V21" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>DynamoDB</span>
              </div>
              
              <div class="resource-category">
                <h4 class="category-title">Messaging</h4>
              </div>
              <div class="resource-item" draggable="true" data-resource="sns">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>SNS Topic</span>
              </div>
              <div class="resource-item" draggable="true" data-resource="sqs">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M3 8H21M3 12H21M3 16H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>SQS Queue</span>
              </div>
              
              <div class="resource-category">
                <h4 class="category-title">Security & IAM</h4>
              </div>
              <div class="resource-item" draggable="true" data-resource="iamrole">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>IAM Role</span>
              </div>
              
              <div class="resource-category">
                <h4 class="category-title">CDN & Delivery</h4>
              </div>
              <div class="resource-item" draggable="true" data-resource="cloudfront">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="12" r="2" fill="currentColor"/>
                </svg>
                <span>CloudFront</span>
              </div>
            </div>
          </aside>
          
          <div class="canvas-container">
            <div class="workflow-canvas" id="workflowCanvas">
              <!-- Canvas grid background -->
              <svg class="canvas-grid" width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" stroke-width="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
              
              <!-- Nodes will be dynamically added here via drag and drop -->
            </div>
          </div>
          
          <aside class="config-panel" id="configPanel">
            <h3 class="panel-title">Resource Configuration</h3>
            <div class="config-form" id="configForm">
              <div class="empty-config">
                <p>Select a resource from the canvas to configure it.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  `;
};

