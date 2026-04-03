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

// Stores the config form values for every node on the canvas, keyed by node ID.
// Updated on every form input change so getWorkflowState() captures all nodes,
// not just the currently selected one.
let nodeConfigStore: Record<string, Record<string, string>> = {};
let workflowDesignerInitialized = false;

// ─── Connections ──────────────────────────────────────────────────────────────

interface Connection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
}
let connections: Connection[] = [];
let selectedConnectionId: string | null = null;
let connectionCounter = 0;

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

  // Set up port drag (for drawing connections)
  setupPortDrag();

  // Delete selected connection with Delete/Backspace key
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedConnectionId) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        deleteSelectedConnection();
      }
    }
  });
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
    <div class="node-port node-port-in" data-port="in"></div>
    <div class="node-header">
      <span class="node-type">${resource.terraformType}</span>
      <span class="node-name">${nodeName}</span>
    </div>
    <div class="node-output">output: ${resource.type}.id</div>
    <div class="node-port node-port-out" data-port="out"></div>
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


function deleteNode(node: HTMLElement): void {
  const nodeId = node.id;
  delete nodeConfigStore[nodeId];
  // Remove all connections involving this node
  connections = connections.filter(c => c.fromNodeId !== nodeId && c.toNodeId !== nodeId);
  if (selectedConnectionId && !connections.some(c => c.id === selectedConnectionId)) {
    selectedConnectionId = null;
  }
  renderConnections();
  if (selectedNode === node) {
    selectedNode = null;
    updateConfigPanel(null);
  }
  const deleteBtn = document.getElementById('deleteResourceBtn') as HTMLButtonElement | null;
  if (deleteBtn) deleteBtn.style.display = 'none';
  node.remove();
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

    const maxX = canvasRect.width - node.offsetWidth;
    const maxY = canvasRect.height - node.offsetHeight;

    node.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
    node.style.top = `${Math.max(0, Math.min(newY, maxY))}px`;
    renderConnections();
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    node.style.cursor = 'move';
    node.style.zIndex = '1';
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
      // Deselect any active connection
      if (selectedConnectionId) {
        selectedConnectionId = null;
        renderConnections();
      }
      selectNode(node);
    } else if (!target.closest('#configPanel') && !target.closest('#configForm')) {
      if (selectedNode) {
        selectedNode.classList.remove('selected');
        selectedNode = null;
        updateConfigPanel(null);
        const deleteBtn = document.getElementById('deleteResourceBtn') as HTMLButtonElement | null;
        if (deleteBtn) deleteBtn.style.display = 'none';
      }
      // Deselect connection when clicking on empty canvas
      if (selectedConnectionId && target.closest('#workflowCanvas') && !target.closest('.connection-path')) {
        selectedConnectionId = null;
        renderConnections();
      }
    }
  });
}

function selectNode(node: HTMLElement): void {
  if (selectedNode && selectedNode !== node) {
    selectedNode.classList.remove('selected');
  }

  selectedNode = node;
  node.classList.add('selected');

  const resourceType = node.getAttribute('data-resource-type');
  if (resourceType) {
    updateConfigPanel(resourceType);
  }

  const deleteBtn = document.getElementById('deleteResourceBtn') as HTMLButtonElement | null;
  if (deleteBtn) {
    deleteBtn.style.display = 'flex';
    // Replace listener to avoid stacking
    const fresh = deleteBtn.cloneNode(true) as HTMLButtonElement;
    deleteBtn.replaceWith(fresh);
    fresh.addEventListener('click', () => deleteNode(node));
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

  const nodeId = selectedNode?.id;

  // Restore previously saved values from the config store
  if (nodeId) {
    if (!nodeConfigStore[nodeId]) nodeConfigStore[nodeId] = {};
    const saved = nodeConfigStore[nodeId];
    configForm.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      'input, select, textarea'
    ).forEach(input => {
      if (input.id && saved[input.id] !== undefined) {
        input.value = saved[input.id];
      }
    });
    // Sync canvas node name label with stored value
    if (saved.nodeName && selectedNode) {
      const nameSpan = selectedNode.querySelector('.node-name');
      if (nameSpan) nameSpan.textContent = saved.nodeName;
    }
  }

  // Persist every form change into the config store
  if (nodeId) {
    configForm.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      'input, select, textarea'
    ).forEach(input => {
      input.addEventListener('input', () => {
        if (!nodeConfigStore[nodeId]) nodeConfigStore[nodeId] = {};
        nodeConfigStore[nodeId][input.id] = input.value;

        // Live-update the node name label on canvas
        if (input.id === 'nodeName' && selectedNode) {
          const nameSpan = selectedNode.querySelector('.node-name');
          if (nameSpan) nameSpan.textContent = input.value || `${resource.type}-${nodeCounter}`;
        }
      });
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

export function resetWorkflowDesignerInit(): void {
  workflowDesignerInitialized = false;
}

// Re-initialize when route changes (for SPA)
export function reinitWorkflowDesigner(): void {
  if (workflowDesignerInitialized) return;
  workflowDesignerInitialized = true;
  setTimeout(() => {
    if (document.getElementById('workflowCanvas')) {
      initWorkflowDesigner();
      setupWorkflowActions();
    } else {
      workflowDesignerInitialized = false;
    }
  }, 100);
}

// Remove all nodes from the canvas and reset state.
// Pass resetProject=true only when the user explicitly starts fresh
// (Clear button, New Project). loadWorkflowState() calls this internally
// without resetting the project so the workflow ID is preserved.
export function clearCanvas(resetProject = false): void {
  const canvas = document.getElementById('workflowCanvas');
  if (canvas) {
    canvas.querySelectorAll('.canvas-node').forEach(n => n.remove());
  }
  nodeCounter = 0;
  selectedNode = null;
  nodeConfigStore = {};
  connections = [];
  selectedConnectionId = null;
  connectionCounter = 0;
  const svg = document.getElementById('connectionsLayer') as SVGSVGElement | null;
  if (svg) svg.querySelectorAll('path').forEach(p => p.remove());
  localStorage.removeItem('canvas_state');
  if (resetProject) {
    localStorage.removeItem('current_workflow_id');
    localStorage.removeItem('current_workflow_name');
    const titleEl = document.querySelector('.workflow-title');
    if (titleEl) titleEl.textContent = 'Workflow Designer';
  }
  updateConfigPanel(null);
}

// Restore a saved workflow state onto the canvas
export function loadWorkflowState(state: any): void {
  if (!state?.nodes?.length) return;

  clearCanvas();

  const canvas = document.getElementById('workflowCanvas');
  if (!canvas) return;

  // Set nodeCounter so new nodes don't clash with loaded IDs
  state.nodes.forEach((nodeData: any) => {
    const match = String(nodeData.id).match(/node-(\d+)/);
    if (match) nodeCounter = Math.max(nodeCounter, parseInt(match[1]));
  });

  state.nodes.forEach((nodeData: any) => {
    const { id, type, position, config } = nodeData;
    const resource = resourceTypes[type];
    if (!resource) return;

    const name = config?.nodeName || id;

    const node = document.createElement('div');
    node.className = 'canvas-node';
    node.id = id;
    node.setAttribute('data-resource-type', type);
    node.style.left = `${position.x}px`;
    node.style.top = `${position.y}px`;

    node.innerHTML = `
      <div class="node-port node-port-in" data-port="in"></div>
      <div class="node-header">
        <span class="node-type">${resource.terraformType}</span>
        <span class="node-name">${name}</span>
      </div>
      <div class="node-output">output: ${resource.type}.id</div>
      <div class="node-port node-port-out" data-port="out"></div>
    `;

    canvas.appendChild(node);
    makeNodeDraggable(node);
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      selectNode(node);
    });

    // Restore config into store
    if (config) nodeConfigStore[id] = { ...config };
  });

  // Restore connections
  if (state.connections?.length) {
    connections = state.connections.map((c: any) => ({ ...c }));
    connectionCounter = connections.reduce((max: number, c: Connection) => {
      const m = String(c.id).match(/conn-(\d+)/);
      return m ? Math.max(max, parseInt(m[1])) : max;
    }, 0);
    setTimeout(() => renderConnections(), 50);
  }
}

// Collect current workflow state from canvas
export function getWorkflowState(): any {
  const canvas = document.getElementById('workflowCanvas');
  if (!canvas) return { nodes: [], metadata: {} };

  const nodes: any[] = [];
  const canvasNodes = canvas.querySelectorAll('.canvas-node');

  canvasNodes.forEach((nodeElement) => {
    const node = nodeElement as HTMLElement;
    const nodeId = node.id;
    const resourceType = node.getAttribute('data-resource-type') || '';
    const style = window.getComputedStyle(node);
    const left = parseInt(style.left) || 0;
    const top = parseInt(style.top) || 0;

    // Get node name from header
    const nameElement = node.querySelector('.node-name');
    const nodeName = nameElement?.textContent || nodeId;

    // Merge stored config (covers all nodes, not just the selected one)
    const config: any = { nodeName, ...(nodeConfigStore[nodeId] || {}) };

    // Populate bidirectional per-node connections so the backend resolver
    // can match direct connections with priority over any-node fallback.
    const nodeConnectionIds = connections
      .filter(c => c.fromNodeId === nodeId || c.toNodeId === nodeId)
      .map(c => c.fromNodeId === nodeId ? c.toNodeId : c.fromNodeId);

    nodes.push({
      id: nodeId,
      type: resourceType,
      position: { x: left, y: top },
      config: config,
      connections: nodeConnectionIds,
    });
  });

  return {
    nodes: nodes,
    connections: connections.map(c => ({ ...c })),
    metadata: {
      created_at: new Date().toISOString(),
    },
  };
}

// ─── Connection rendering helpers ────────────────────────────────────────────

function getPortPos(nodeId: string, port: 'in' | 'out'): { x: number; y: number } | null {
  const canvas = document.getElementById('workflowCanvas');
  const node = document.getElementById(nodeId);
  if (!canvas || !node) return null;
  const canvasRect = canvas.getBoundingClientRect();
  const portEl = node.querySelector(port === 'out' ? '.node-port-out' : '.node-port-in') as HTMLElement | null;
  if (!portEl) return null;
  const portRect = portEl.getBoundingClientRect();
  return {
    x: portRect.left + portRect.width / 2 - canvasRect.left,
    y: portRect.top + portRect.height / 2 - canvasRect.top,
  };
}

function makeBezierPath(x1: number, y1: number, x2: number, y2: number): string {
  const cp = Math.max(60, Math.abs(x2 - x1) * 0.5);
  return `M ${x1},${y1} C ${x1 + cp},${y1} ${x2 - cp},${y2} ${x2},${y2}`;
}

function renderConnections(): void {
  const svg = document.getElementById('connectionsLayer') as SVGSVGElement | null;
  if (!svg) return;
  svg.querySelectorAll('path').forEach(p => p.remove());

  connections.forEach(conn => {
    const fromPos = getPortPos(conn.fromNodeId, 'out');
    const toPos = getPortPos(conn.toNodeId, 'in');
    if (!fromPos || !toPos) return;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', makeBezierPath(fromPos.x, fromPos.y, toPos.x, toPos.y));
    path.setAttribute('data-connection-id', conn.id);
    path.setAttribute('pointer-events', 'visibleStroke');
    path.classList.add('connection-path');
    if (conn.id === selectedConnectionId) path.classList.add('connection-selected');

    path.addEventListener('click', (e) => {
      e.stopPropagation();
      selectConnection(conn.id);
    });

    svg.appendChild(path);
  });
}

function selectConnection(id: string): void {
  selectedConnectionId = id;
  // Deselect any selected node
  if (selectedNode) {
    selectedNode.classList.remove('selected');
    selectedNode = null;
    updateConfigPanel(null);
    const deleteBtn = document.getElementById('deleteResourceBtn') as HTMLButtonElement | null;
    if (deleteBtn) deleteBtn.style.display = 'none';
  }
  renderConnections();
}

function deleteSelectedConnection(): void {
  if (!selectedConnectionId) return;
  connections = connections.filter(c => c.id !== selectedConnectionId);
  selectedConnectionId = null;
  renderConnections();
}

function setupPortDrag(): void {
  let draggingFrom: { nodeId: string } | null = null;
  let ghostPath: SVGPathElement | null = null;

  document.addEventListener('mousedown', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const portOut = target.closest('.node-port-out') as HTMLElement | null;
    if (!portOut) return;

    const node = portOut.closest('.canvas-node') as HTMLElement | null;
    if (!node) return;

    draggingFrom = { nodeId: node.id };
    e.stopPropagation();
    e.preventDefault();

    const svg = document.getElementById('connectionsLayer') as SVGSVGElement | null;
    if (svg) {
      ghostPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      ghostPath.classList.add('connection-ghost');
      svg.appendChild(ghostPath);
    }
  });

  document.addEventListener('mousemove', (e: MouseEvent) => {
    if (!draggingFrom || !ghostPath) return;
    const canvas = document.getElementById('workflowCanvas');
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();
    const fromPos = getPortPos(draggingFrom.nodeId, 'out');
    if (!fromPos) return;
    const toX = e.clientX - canvasRect.left;
    const toY = e.clientY - canvasRect.top;
    ghostPath.setAttribute('d', makeBezierPath(fromPos.x, fromPos.y, toX, toY));
  });

  document.addEventListener('mouseup', (e: MouseEvent) => {
    if (!draggingFrom) return;

    const target = e.target as HTMLElement;
    const portIn = target.closest('.node-port-in') as HTMLElement | null;

    if (portIn) {
      const toNode = portIn.closest('.canvas-node') as HTMLElement | null;
      if (toNode && toNode.id !== draggingFrom.nodeId) {
        const exists = connections.some(
          c => c.fromNodeId === draggingFrom!.nodeId && c.toNodeId === toNode.id
        );
        if (!exists) {
          connectionCounter++;
          connections.push({
            id: `conn-${connectionCounter}`,
            fromNodeId: draggingFrom.nodeId,
            toNodeId: toNode.id,
          });
        }
      }
    }

    if (ghostPath) { ghostPath.remove(); ghostPath = null; }
    draggingFrom = null;
    renderConnections();
  });
}

// Setup workflow action buttons
function setupWorkflowActions(): void {
  import('./router').then(({ router }) => {
    // Clear
    document.getElementById('clearCanvasBtn')?.addEventListener('click', () => {
      if (confirm('Remove all resources from the canvas?')) clearCanvas(true);
    });

    // Validate
    document.getElementById('validateBtn')?.addEventListener('click', async () => {
      const workflowState = getWorkflowState();
      if (workflowState.nodes.length === 0) {
        alert('Please add at least one resource to the canvas before validating.');
        return;
      }
      const { apiService } = await import('./services/api');
      const genResult = await apiService.generateCode(undefined, workflowState);
      if (genResult.error || !genResult.data) {
        alert(`Code generation failed: ${genResult.error || 'Unknown error'}`);
        return;
      }
      // Combine versions + variables + main so the provider block is included
      const files: { filename: string; content: string }[] = genResult.data.files || [];
      const combined = ['versions.tf', 'variables.tf', 'main.tf']
        .map(name => files.find(f => f.filename === name)?.content ?? '')
        .join('\n');
      const validateResult = await apiService.validateCode(combined || genResult.data.terraform_code);
      if (validateResult.error) { alert(`Validation failed: ${validateResult.error}`); return; }
      if (validateResult.data) {
        const { valid, errors, warnings } = validateResult.data;
        const msg = `Validation ${valid ? 'passed ✓' : 'failed ✗'}\n\n` +
          `Errors: ${errors.length}   Warnings: ${warnings.length}\n\n` +
          (errors.length   > 0 ? `Errors:\n${errors.map(e => `• ${e.message}`).join('\n')}\n\n` : '') +
          (warnings.length > 0 ? `Warnings:\n${warnings.map(w => `• ${w.message}`).join('\n')}` : '');
        alert(msg);
      }
    });

    // Generate Code
    document.getElementById('generateCodeBtn')?.addEventListener('click', async () => {
      const workflowState = getWorkflowState();
      if (workflowState.nodes.length === 0) {
        alert('Please add at least one resource to the canvas before generating code.');
        return;
      }
      const { apiService } = await import('./services/api');
      const result = await apiService.generateCode(undefined, workflowState);
      if (result.error) { alert(`Code generation failed: ${result.error}`); return; }
      if (result.data) {
        // Persist canvas state so it survives navigation back to /workflow
        localStorage.setItem('canvas_state', JSON.stringify(workflowState));
        localStorage.setItem('generated_terraform', result.data.terraform_code);
        localStorage.setItem('generated_terraform_files', JSON.stringify(result.data.files));
        router.navigate('/code');
      }
    });

    // Save — updates existing workflow if one is open, otherwise creates new
    document.getElementById('saveBtn')?.addEventListener('click', async () => {
      const workflowState = getWorkflowState();
      if (workflowState.nodes.length === 0) {
        alert('Please add at least one resource to the canvas before saving.');
        return;
      }
      const { apiService } = await import('./services/api');
      const existingId = localStorage.getItem('current_workflow_id');
      if (existingId) {
        const result = await apiService.updateWorkflow(parseInt(existingId), { workflow_state: workflowState });
        if (result.error) { alert(`Save failed: ${result.error}`); return; }
        alert('Workflow updated successfully!');
      } else {
        const name = prompt('Enter workflow name:');
        if (!name) return;
        const description = prompt('Enter workflow description (optional):') || '';
        const result = await apiService.createWorkflow(name, description, workflowState);
        if (result.error) { alert(`Save failed: ${result.error}`); return; }
        if (result.data) {
          localStorage.setItem('current_workflow_id', String(result.data.id));
          localStorage.setItem('current_workflow_name', name);
          const titleEl = document.querySelector('.workflow-title');
          if (titleEl) titleEl.textContent = name;
        }
        alert('Workflow saved successfully!');
      }
    });

    // Deploy — generate code, store deployment info, navigate to deployment page
    document.getElementById('deployBtn')?.addEventListener('click', async () => {
      const workflowState = getWorkflowState();
      if (workflowState.nodes.length === 0) {
        alert('Please add at least one resource to the canvas before deploying.');
        return;
      }
      const { apiService } = await import('./services/api');
      const result = await apiService.generateCode(undefined, workflowState);
      if (result.error) { alert(`Code generation failed: ${result.error}`); return; }
      if (result.data) {
        localStorage.setItem('canvas_state', JSON.stringify(workflowState));
        localStorage.setItem('generated_terraform', result.data.terraform_code);
        localStorage.setItem('generated_terraform_files', JSON.stringify(result.data.files));
        localStorage.setItem('deployment_workflow_name', workflowState.metadata?.name || 'Unnamed Workflow');
        localStorage.setItem('deployment_node_count', String(workflowState.nodes.length));
        router.navigate('/deployment');
      }
    });
  });
}

