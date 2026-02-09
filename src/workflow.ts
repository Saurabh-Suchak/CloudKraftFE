// Workflow Designer Drag and Drop Functionality

interface ResourceType {
  type: string;
  label: string;
  terraformType: string;
  icon: string;
}

const resourceTypes: Record<string, ResourceType> = {
  // Compute
  ec2: {
    type: 'ec2',
    label: 'EC2 Instance',
    terraformType: 'aws_instance',
    icon: 'ec2'
  },
  lambda: {
    type: 'lambda',
    label: 'Lambda Function',
    terraformType: 'aws_lambda_function',
    icon: 'lambda'
  },
  autoscaling: {
    type: 'autoscaling',
    label: 'Auto Scaling Group',
    terraformType: 'aws_autoscaling_group',
    icon: 'autoscaling'
  },
  // Networking
  vpc: {
    type: 'vpc',
    label: 'VPC',
    terraformType: 'aws_vpc',
    icon: 'vpc'
  },
  subnet: {
    type: 'subnet',
    label: 'Subnet',
    terraformType: 'aws_subnet',
    icon: 'subnet'
  },
  securitygroup: {
    type: 'securitygroup',
    label: 'Security Group',
    terraformType: 'aws_security_group',
    icon: 'securitygroup'
  },
  internetgateway: {
    type: 'internetgateway',
    label: 'Internet Gateway',
    terraformType: 'aws_internet_gateway',
    icon: 'internetgateway'
  },
  routetable: {
    type: 'routetable',
    label: 'Route Table',
    terraformType: 'aws_route_table',
    icon: 'routetable'
  },
  natgateway: {
    type: 'natgateway',
    label: 'NAT Gateway',
    terraformType: 'aws_nat_gateway',
    icon: 'natgateway'
  },
  loadbalancer: {
    type: 'loadbalancer',
    label: 'Load Balancer',
    terraformType: 'aws_lb',
    icon: 'loadbalancer'
  },
  // Storage
  s3: {
    type: 's3',
    label: 'S3 Bucket',
    terraformType: 'aws_s3_bucket',
    icon: 's3'
  },
  efs: {
    type: 'efs',
    label: 'EFS',
    terraformType: 'aws_efs_file_system',
    icon: 'efs'
  },
  ebs: {
    type: 'ebs',
    label: 'EBS Volume',
    terraformType: 'aws_ebs_volume',
    icon: 'ebs'
  },
  // Database
  rds: {
    type: 'rds',
    label: 'RDS Database',
    terraformType: 'aws_db_instance',
    icon: 'rds'
  },
  dynamodb: {
    type: 'dynamodb',
    label: 'DynamoDB',
    terraformType: 'aws_dynamodb_table',
    icon: 'dynamodb'
  },
  // Messaging
  sns: {
    type: 'sns',
    label: 'SNS Topic',
    terraformType: 'aws_sns_topic',
    icon: 'sns'
  },
  sqs: {
    type: 'sqs',
    label: 'SQS Queue',
    terraformType: 'aws_sqs_queue',
    icon: 'sqs'
  },
  // Security & IAM
  iamrole: {
    type: 'iamrole',
    label: 'IAM Role',
    terraformType: 'aws_iam_role',
    icon: 'iamrole'
  },
  // CDN
  cloudfront: {
    type: 'cloudfront',
    label: 'CloudFront',
    terraformType: 'aws_cloudfront_distribution',
    icon: 'cloudfront'
  }
};

let nodeCounter = 0;
let selectedNode: HTMLElement | null = null;
let draggedNode: HTMLElement | null = null;
let offsetX = 0;
let offsetY = 0;

export function initWorkflowDesigner(): void {
  const canvas = document.getElementById('workflowCanvas');
  if (!canvas) return;

  // Set up drag and drop from resource panel
  setupResourceDrag();
  
  // Set up canvas drop zone
  setupCanvasDrop(canvas);
  
  // Set up node dragging on canvas
  setupNodeDragging(canvas);
  
  // Set up node selection
  setupNodeSelection();
}

function setupResourceDrag(): void {
  const resourceItems = document.querySelectorAll('.resource-item');
  
  resourceItems.forEach(item => {
    item.addEventListener('dragstart', (e: Event) => {
      const dragEvent = e as DragEvent;
      const resourceType = (item as HTMLElement).getAttribute('data-resource');
      if (dragEvent.dataTransfer && resourceType) {
        dragEvent.dataTransfer.setData('application/resource-type', resourceType);
        dragEvent.dataTransfer.effectAllowed = 'copy';
        item.classList.add('dragging');
      }
    });
    
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
    });
  });
}

function setupCanvasDrop(canvas: HTMLElement): void {
  canvas.addEventListener('dragover', (e: Event) => {
    e.preventDefault();
    const dragEvent = e as DragEvent;
    if (dragEvent.dataTransfer) {
      dragEvent.dataTransfer.dropEffect = 'copy';
    }
  });
  
  canvas.addEventListener('drop', (e: Event) => {
    e.preventDefault();
    const dragEvent = e as DragEvent;
    const resourceType = dragEvent.dataTransfer?.getData('application/resource-type');
    
    if (resourceType && resourceTypes[resourceType]) {
      const rect = canvas.getBoundingClientRect();
      const x = dragEvent.clientX - rect.left;
      const y = dragEvent.clientY - rect.top;
      
      createNode(resourceType, x, y);
    }
  });
}

function createNode(resourceType: string, x: number, y: number): void {
  const resource = resourceTypes[resourceType];
  if (!resource) return;
  
  nodeCounter++;
  const nodeId = `node-${nodeCounter}`;
  const nodeName = `${resource.type}-${nodeCounter}`;
  
  const node = document.createElement('div');
  node.className = 'canvas-node';
  node.id = nodeId;
  node.setAttribute('data-resource-type', resourceType);
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
  
  node.innerHTML = `
    <div class="node-header">
      <span class="node-type">${resource.terraformType}</span>
      <span class="node-name">${nodeName}</span>
    </div>
    <div class="node-output">output: ${resource.type}.id</div>
  `;
  
  const canvas = document.getElementById('workflowCanvas');
  if (canvas) {
    canvas.appendChild(node);
    
    // Make node draggable
    makeNodeDraggable(node);
    
    // Make node selectable
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      selectNode(node);
    });
  }
}

function makeNodeDraggable(node: HTMLElement): void {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialX = 0;
  let initialY = 0;
  
  node.addEventListener('mousedown', (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('.node-header, .node-output')) {
      isDragging = true;
      const rect = node.getBoundingClientRect();
      const canvas = document.getElementById('workflowCanvas');
      if (!canvas) return;
      
      const canvasRect = canvas.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      initialX = rect.left - canvasRect.left;
      initialY = rect.top - canvasRect.top;
      
      node.style.cursor = 'grabbing';
      node.style.zIndex = '1000';
      
      e.preventDefault();
    }
  });
  
  document.addEventListener('mousemove', (e: MouseEvent) => {
    if (!isDragging) return;
    
    const canvas = document.getElementById('workflowCanvas');
    if (!canvas) return;
    
    const canvasRect = canvas.getBoundingClientRect();
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    const newX = initialX + deltaX;
    const newY = initialY + deltaY;
    
    // Keep node within canvas bounds
    const maxX = canvasRect.width - node.offsetWidth;
    const maxY = canvasRect.height - node.offsetHeight;
    
    node.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
    node.style.top = `${Math.max(0, Math.min(newY, maxY))}px`;
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      node.style.cursor = 'move';
      node.style.zIndex = '1';
    }
  });
}

function setupNodeDragging(canvas: HTMLElement): void {
  // Additional setup if needed
}

function setupNodeSelection(): void {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const node = target.closest('.canvas-node') as HTMLElement;
    
    if (node) {
      selectNode(node);
    } else {
      // Click outside - deselect
      if (selectedNode) {
        selectedNode.classList.remove('selected');
        selectedNode = null;
        updateConfigPanel(null);
      }
    }
  });
}

function selectNode(node: HTMLElement): void {
  // Deselect previous node
  if (selectedNode && selectedNode !== node) {
    selectedNode.classList.remove('selected');
  }
  
  // Select new node
  selectedNode = node;
  node.classList.add('selected');
  
  // Update config panel
  const resourceType = node.getAttribute('data-resource-type');
  if (resourceType) {
    updateConfigPanel(resourceType);
  }
}

function updateConfigPanel(resourceType: string | null): void {
  const configForm = document.getElementById('configForm');
  const configPanel = document.getElementById('configPanel');
  
  if (!configForm || !configPanel) return;
  
  if (!resourceType) {
    configForm.innerHTML = `
      <div class="empty-config">
        <p>Select a resource from the canvas to configure it.</p>
      </div>
    `;
    const title = configPanel.querySelector('.panel-title');
    if (title) title.textContent = 'Resource Configuration';
    return;
  }
  
  const resource = resourceTypes[resourceType];
  if (!resource) return;
  
  const title = configPanel.querySelector('.panel-title');
  if (title) title.textContent = `${resource.label} Configuration`;
  
  // Generate form based on resource type
  let formHTML = '';
  
  switch (resourceType) {
    case 'ec2':
      formHTML = `
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" class="form-input" id="nodeName" placeholder="web-server-01" />
        </div>
        <div class="form-group">
          <label class="form-label">Region</label>
          <select class="form-input" id="nodeRegion">
            <option value="us-east-1">us-east-1</option>
            <option value="us-west-2">us-west-2</option>
            <option value="eu-west-1">eu-west-1</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Instance Type</label>
          <select class="form-input" id="nodeInstanceType">
            <option value="t2.micro">t2.micro</option>
            <option value="t2.small">t2.small</option>
            <option value="t2.medium">t2.medium</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">AMI ID</label>
          <input type="text" class="form-input" id="nodeAmiId" placeholder="ami-0abcdef1234567890" />
        </div>
        <div class="form-group">
          <label class="form-label">Security Groups</label>
          <input type="text" class="form-input" id="nodeSecurityGroups" placeholder="sg-0123456789abcdef0" />
        </div>
      `;
      break;
    case 'vpc':
      formHTML = `
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" class="form-input" id="nodeName" placeholder="prod-vpc" />
        </div>
        <div class="form-group">
          <label class="form-label">CIDR Block</label>
          <input type="text" class="form-input" id="nodeCidr" placeholder="10.0.0.0/16" />
        </div>
        <div class="form-group">
          <label class="form-label">Region</label>
          <select class="form-input" id="nodeRegion">
            <option value="us-east-1">us-east-1</option>
            <option value="us-west-2">us-west-2</option>
            <option value="eu-west-1">eu-west-1</option>
          </select>
        </div>
      `;
      break;
    case 's3':
      formHTML = `
        <div class="form-group">
          <label class="form-label">Bucket Name</label>
          <input type="text" class="form-input" id="nodeName" placeholder="my-bucket" />
        </div>
        <div class="form-group">
          <label class="form-label">Region</label>
          <select class="form-input" id="nodeRegion">
            <option value="us-east-1">us-east-1</option>
            <option value="us-west-2">us-west-2</option>
            <option value="eu-west-1">eu-west-1</option>
          </select>
        </div>
      `;
      break;
    case 'lambda':
      formHTML = `
        <div class="form-group">
          <label class="form-label">Function Name</label>
          <input type="text" class="form-input" id="nodeName" placeholder="my-function" />
        </div>
        <div class="form-group">
          <label class="form-label">Runtime</label>
          <select class="form-input" id="nodeRuntime">
            <option value="python3.9">Python 3.9</option>
            <option value="nodejs18.x">Node.js 18.x</option>
            <option value="java11">Java 11</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Handler</label>
          <input type="text" class="form-input" id="nodeHandler" placeholder="index.handler" />
        </div>
      `;
      break;
    case 'rds':
      formHTML = `
        <div class="form-group">
          <label class="form-label">Instance Name</label>
          <input type="text" class="form-input" id="nodeName" placeholder="prod-db" />
        </div>
        <div class="form-group">
          <label class="form-label">Engine</label>
          <select class="form-input" id="nodeEngine">
            <option value="mysql">MySQL</option>
            <option value="postgres">PostgreSQL</option>
            <option value="mariadb">MariaDB</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Instance Class</label>
          <select class="form-input" id="nodeInstanceClass">
            <option value="db.t2.micro">db.t2.micro</option>
            <option value="db.t2.small">db.t2.small</option>
            <option value="db.t2.medium">db.t2.medium</option>
          </select>
        </div>
      `;
      break;
    case 'subnet':
      formHTML = `
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" class="form-input" id="nodeName" placeholder="public-subnet" />
        </div>
        <div class="form-group">
          <label class="form-label">CIDR Block</label>
          <input type="text" class="form-input" id="nodeCidr" placeholder="10.0.1.0/24" />
        </div>
        <div class="form-group">
          <label class="form-label">Availability Zone</label>
          <select class="form-input" id="nodeAz">
            <option value="us-east-1a">us-east-1a</option>
            <option value="us-east-1b">us-east-1b</option>
            <option value="us-east-1c">us-east-1c</option>
          </select>
        </div>
      `;
      break;
    case 'securitygroup':
      formHTML = `
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" class="form-input" id="nodeName" placeholder="allow-ssh" />
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <input type="text" class="form-input" id="nodeDescription" placeholder="Allow SSH access" />
        </div>
      `;
      break;
    case 'internetgateway':
      formHTML = `
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" class="form-input" id="nodeName" placeholder="igw-main" />
        </div>
      `;
      break;
    case 'routetable':
      formHTML = `
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" class="form-input" id="nodeName" placeholder="public-rt" />
        </div>
      `;
      break;
    case 'natgateway':
      formHTML = `
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" class="form-input" id="nodeName" placeholder="nat-gw" />
        </div>
        <div class="form-group">
          <label class="form-label">Allocation ID</label>
          <input type="text" class="form-input" id="nodeAllocationId" placeholder="eip-xxxxx" />
        </div>
      `;
      break;
    case 'loadbalancer':
      formHTML = `
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" class="form-input" id="nodeName" placeholder="app-lb" />
        </div>
        <div class="form-group">
          <label class="form-label">Type</label>
          <select class="form-input" id="nodeLbType">
            <option value="application">Application Load Balancer</option>
            <option value="network">Network Load Balancer</option>
            <option value="classic">Classic Load Balancer</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Scheme</label>
          <select class="form-input" id="nodeScheme">
            <option value="internet-facing">Internet-facing</option>
            <option value="internal">Internal</option>
          </select>
        </div>
      `;
      break;
    case 'efs':
      formHTML = `
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" class="form-input" id="nodeName" placeholder="shared-storage" />
        </div>
        <div class="form-group">
          <label class="form-label">Performance Mode</label>
          <select class="form-input" id="nodePerformanceMode">
            <option value="generalPurpose">General Purpose</option>
            <option value="maxIO">Max I/O</option>
          </select>
        </div>
      `;
      break;
    case 'ebs':
      formHTML = `
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" class="form-input" id="nodeName" placeholder="data-volume" />
        </div>
        <div class="form-group">
          <label class="form-label">Size (GB)</label>
          <input type="number" class="form-input" id="nodeSize" placeholder="100" min="1" />
        </div>
        <div class="form-group">
          <label class="form-label">Volume Type</label>
          <select class="form-input" id="nodeVolumeType">
            <option value="gp3">gp3</option>
            <option value="gp2">gp2</option>
            <option value="io1">io1</option>
            <option value="st1">st1</option>
          </select>
        </div>
      `;
      break;
    case 'dynamodb':
      formHTML = `
        <div class="form-group">
          <label class="form-label">Table Name</label>
          <input type="text" class="form-input" id="nodeName" placeholder="user-table" />
        </div>
        <div class="form-group">
          <label class="form-label">Hash Key</label>
          <input type="text" class="form-input" id="nodeHashKey" placeholder="id" />
        </div>
        <div class="form-group">
          <label class="form-label">Billing Mode</label>
          <select class="form-input" id="nodeBillingMode">
            <option value="PAY_PER_REQUEST">Pay per request</option>
            <option value="PROVISIONED">Provisioned</option>
          </select>
        </div>
      `;
      break;
    case 'sns':
      formHTML = `
        <div class="form-group">
          <label class="form-label">Topic Name</label>
          <input type="text" class="form-input" id="nodeName" placeholder="notifications" />
        </div>
        <div class="form-group">
          <label class="form-label">Display Name</label>
          <input type="text" class="form-input" id="nodeDisplayName" placeholder="Notifications Topic" />
        </div>
      `;
      break;
    case 'sqs':
      formHTML = `
        <div class="form-group">
          <label class="form-label">Queue Name</label>
          <input type="text" class="form-input" id="nodeName" placeholder="task-queue" />
        </div>
        <div class="form-group">
          <label class="form-label">Visibility Timeout (seconds)</label>
          <input type="number" class="form-input" id="nodeVisibilityTimeout" placeholder="30" min="0" />
        </div>
        <div class="form-group">
          <label class="form-label">Message Retention (days)</label>
          <input type="number" class="form-input" id="nodeRetentionPeriod" placeholder="4" min="1" max="14" />
        </div>
      `;
      break;
    case 'iamrole':
      formHTML = `
        <div class="form-group">
          <label class="form-label">Role Name</label>
          <input type="text" class="form-input" id="nodeName" placeholder="lambda-execution-role" />
        </div>
        <div class="form-group">
          <label class="form-label">Assume Role Policy</label>
          <textarea class="form-input" id="nodeAssumeRolePolicy" rows="4" placeholder='{"Version":"2012-10-17",...}'></textarea>
        </div>
      `;
      break;
    case 'cloudfront':
      formHTML = `
        <div class="form-group">
          <label class="form-label">Distribution Name</label>
          <input type="text" class="form-input" id="nodeName" placeholder="cdn-distribution" />
        </div>
        <div class="form-group">
          <label class="form-label">Origin Domain</label>
          <input type="text" class="form-input" id="nodeOrigin" placeholder="example.com" />
        </div>
        <div class="form-group">
          <label class="form-label">Price Class</label>
          <select class="form-input" id="nodePriceClass">
            <option value="PriceClass_All">All Edge Locations</option>
            <option value="PriceClass_200">North America and Europe</option>
            <option value="PriceClass_100">North America Only</option>
          </select>
        </div>
      `;
      break;
    case 'autoscaling':
      formHTML = `
        <div class="form-group">
          <label class="form-label">Group Name</label>
          <input type="text" class="form-input" id="nodeName" placeholder="web-asg" />
        </div>
        <div class="form-group">
          <label class="form-label">Min Size</label>
          <input type="number" class="form-input" id="nodeMinSize" placeholder="1" min="0" />
        </div>
        <div class="form-group">
          <label class="form-label">Max Size</label>
          <input type="number" class="form-input" id="nodeMaxSize" placeholder="10" min="1" />
        </div>
        <div class="form-group">
          <label class="form-label">Desired Capacity</label>
          <input type="number" class="form-input" id="nodeDesiredCapacity" placeholder="2" min="0" />
        </div>
      `;
      break;
    default:
      formHTML = `
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" class="form-input" id="nodeName" placeholder="resource-name" />
        </div>
      `;
  }
  
  configForm.innerHTML = formHTML;
  
  // Add event listeners to form inputs to update node name
  const nameInput = configForm.querySelector('#nodeName') as HTMLInputElement;
  if (nameInput && selectedNode) {
    const nameSpan = selectedNode.querySelector('.node-name');
    nameInput.addEventListener('input', () => {
      if (nameSpan) {
        nameSpan.textContent = nameInput.value || resource.type + '-' + nodeCounter;
      }
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the workflow page
    if (document.getElementById('workflowCanvas')) {
      initWorkflowDesigner();
    }
  });
} else {
  // DOM already loaded
  if (document.getElementById('workflowCanvas')) {
    initWorkflowDesigner();
  }
}

// Re-initialize when route changes (for SPA)
export function reinitWorkflowDesigner(): void {
  setTimeout(() => {
    if (document.getElementById('workflowCanvas')) {
      initWorkflowDesigner();
    }
  }, 100);
}

