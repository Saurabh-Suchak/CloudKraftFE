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

// ─── Zoom / Pan ───────────────────────────────────────────────────────────────
let zoom = 1;
let panX = 0;
let panY = 0;
let spaceDown = false;

// ─── Undo / Redo ──────────────────────────────────────────────────────────────

const MAX_HISTORY = 50;
let historyStack: any[] = [];
let historyPointer = -1;
let _restoringHistory = false;

function saveSnapshot(): void {
  if (_restoringHistory) return;
  const state = getWorkflowState();
  // Discard any redo future when a new action is taken
  historyStack = historyStack.slice(0, historyPointer + 1);
  historyStack.push(state);
  if (historyStack.length > MAX_HISTORY) historyStack.shift();
  historyPointer = historyStack.length - 1;
  updateUndoRedoButtons();
}

function applySnapshot(state: any): void {
  // Keep _restoringHistory = true until loadWorkflowState's async timeout completes.
  // loadWorkflowState is responsible for resetting it.
  _restoringHistory = true;
  loadWorkflowState(state);
  // Update buttons immediately for visual feedback (pointer is already correct)
  updateUndoRedoButtons();
}

export function undo(): void {
  if (historyPointer <= 0) return;
  historyPointer--;
  applySnapshot(historyStack[historyPointer]);
}

export function redo(): void {
  if (historyPointer >= historyStack.length - 1) return;
  historyPointer++;
  applySnapshot(historyStack[historyPointer]);
}

function updateUndoRedoButtons(): void {
  const undoBtn = document.getElementById('undoBtn') as HTMLButtonElement | null;
  const redoBtn = document.getElementById('redoBtn') as HTMLButtonElement | null;
  if (undoBtn) undoBtn.disabled = historyPointer <= 0;
  if (redoBtn) redoBtn.disabled = historyPointer >= historyStack.length - 1;
}

function applyTransform(): void {
  const canvas = document.getElementById('workflowCanvas');
  if (canvas) canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
  const levelEl = document.getElementById('zoomLevel');
  if (levelEl) levelEl.textContent = `${Math.round(zoom * 100)}%`;
}

function zoomAt(screenX: number, screenY: number, factor: number): void {
  const viewport = document.getElementById('canvasViewport');
  if (!viewport) return;
  const rect = viewport.getBoundingClientRect();
  const newZoom = Math.max(0.2, Math.min(4, zoom * factor));
  // Keep the canvas point under the cursor fixed
  const cx = (screenX - rect.left - panX) / zoom;
  const cy = (screenY - rect.top - panY) / zoom;
  panX = screenX - rect.left - cx * newZoom;
  panY = screenY - rect.top - cy * newZoom;
  zoom = newZoom;
  applyTransform();
  renderConnections();
}

function setupZoomPan(): void {
  const viewport = document.getElementById('canvasViewport');
  if (!viewport) return;

  // Zoom control buttons
  document.getElementById('zoomInBtn')?.addEventListener('click', () => {
    const r = viewport.getBoundingClientRect();
    zoomAt(r.left + r.width / 2, r.top + r.height / 2, 1.25);
  });
  document.getElementById('zoomOutBtn')?.addEventListener('click', () => {
    const r = viewport.getBoundingClientRect();
    zoomAt(r.left + r.width / 2, r.top + r.height / 2, 0.8);
  });
  document.getElementById('zoomResetBtn')?.addEventListener('click', () => {
    zoom = 1; panX = 0; panY = 0;
    applyTransform();
    renderConnections();
  });

  // Mouse wheel → zoom towards cursor
  viewport.addEventListener('wheel', (e: WheelEvent) => {
    e.preventDefault();
    zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.1 : 0.9);
  }, { passive: false });

  // Pan — Space+drag or middle-mouse drag
  let isPanning = false;
  let panStartX = 0;
  let panStartY = 0;
  let panStartPanX = 0;
  let panStartPanY = 0;

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.code === 'Space' && !spaceDown) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      spaceDown = true;
      viewport.classList.add('space-pan');
      e.preventDefault();
    }
  });

  document.addEventListener('keyup', (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      spaceDown = false;
      if (!isPanning) viewport.classList.remove('space-pan');
    }
  });

  viewport.addEventListener('mousedown', (e: MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && spaceDown)) {
      isPanning = true;
      panStartX = e.clientX;
      panStartY = e.clientY;
      panStartPanX = panX;
      panStartPanY = panY;
      viewport.classList.add('panning');
      viewport.classList.remove('space-pan');
      e.preventDefault();
      e.stopPropagation();
    }
  });

  document.addEventListener('mousemove', (e: MouseEvent) => {
    if (!isPanning) return;
    panX = panStartPanX + (e.clientX - panStartX);
    panY = panStartPanY + (e.clientY - panStartY);
    applyTransform();
    renderConnections();
  });

  document.addEventListener('mouseup', (e: MouseEvent) => {
    if (isPanning) {
      isPanning = false;
      viewport.classList.remove('panning');
      if (spaceDown) viewport.classList.add('space-pan');
    }
  });

  // Ctrl+= / Ctrl+- keyboard zoom
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    if (e.key === '=' || e.key === '+') {
      e.preventDefault();
      const r = viewport.getBoundingClientRect();
      zoomAt(r.left + r.width / 2, r.top + r.height / 2, 1.25);
    }
    if (e.key === '-') {
      e.preventDefault();
      const r = viewport.getBoundingClientRect();
      zoomAt(r.left + r.width / 2, r.top + r.height / 2, 0.8);
    }
    if (e.key === '0') {
      e.preventDefault();
      zoom = 1; panX = 0; panY = 0;
      applyTransform();
      renderConnections();
    }
  });
}

export function initWorkflowDesigner(): void {
  const canvas = document.getElementById('workflowCanvas');
  if (!canvas) return;

  // Reset zoom/pan on every init (module vars persist across SPA navigations)
  zoom = 1; panX = 0; panY = 0; spaceDown = false;
  applyTransform();

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

  // Resource search
  setupResourceSearch();

  // Zoom / pan
  setupZoomPan();

  // Keyboard shortcuts
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    const inInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

    // Delete / Backspace — remove selected connection
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedConnectionId && !inInput) {
      deleteSelectedConnection();
    }

    // Ctrl/Cmd+Z — undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undo();
    }

    // Ctrl/Cmd+Y or Ctrl/Cmd+Shift+Z — redo
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault();
      redo();
    }
  });

  // Save empty baseline snapshot
  saveSnapshot();
}

function setupResourceSearch(): void {
  const input = document.getElementById('resourceSearch') as HTMLInputElement | null;
  if (!input) return;

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    const list = document.querySelector('.resources-list');
    if (!list) return;

    // Show/hide each resource item based on match
    list.querySelectorAll<HTMLElement>('.resource-item').forEach(item => {
      const label = item.querySelector('span')?.textContent?.toLowerCase() ?? '';
      const resourceType = item.dataset.resource?.toLowerCase() ?? '';
      const matches = !query || label.includes(query) || resourceType.includes(query);
      item.style.display = matches ? '' : 'none';
    });

    // Hide category headers when all their items are hidden
    list.querySelectorAll<HTMLElement>('.resource-category').forEach(category => {
      let next = category.nextElementSibling as HTMLElement | null;
      let hasVisible = false;
      while (next && !next.classList.contains('resource-category')) {
        if (next.classList.contains('resource-item') && next.style.display !== 'none') {
          hasVisible = true;
          break;
        }
        next = next.nextElementSibling as HTMLElement | null;
      }
      category.style.display = hasVisible ? '' : 'none';
    });
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
      // Convert screen position → content space
      const viewport = document.getElementById('canvasViewport');
      const rect = (viewport ?? canvas).getBoundingClientRect();
      const x = (dragEvent.clientX - rect.left - panX) / zoom;
      const y = (dragEvent.clientY - rect.top - panY) / zoom;
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

    saveSnapshot();
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
  saveSnapshot();
}

function makeNodeDraggable(node: HTMLElement): void {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialX = 0;
  let initialY = 0;

  node.addEventListener('mousedown', (e: MouseEvent) => {
    // Skip if space-pan mode is active
    if (spaceDown) return;
    if ((e.target as HTMLElement).closest('.node-header, .node-output')) {
      isDragging = true;
      // Initial position is already in content space (style.left/top set in content space)
      startX = e.clientX;
      startY = e.clientY;
      initialX = parseFloat(node.style.left) || 0;
      initialY = parseFloat(node.style.top) || 0;

      node.style.cursor = 'grabbing';
      node.style.zIndex = '1000';
      e.preventDefault();
    }
  });

  document.addEventListener('mousemove', (e: MouseEvent) => {
    if (!isDragging) return;
    // Convert screen-space delta → content-space delta by dividing by zoom
    const newX = initialX + (e.clientX - startX) / zoom;
    const newY = initialY + (e.clientY - startY) / zoom;
    node.style.left = `${Math.max(0, newX)}px`;
    node.style.top = `${Math.max(0, newY)}px`;
    renderConnections();
  });

  document.addEventListener('mouseup', (e: MouseEvent) => {
    if (!isDragging) return;
    isDragging = false;
    node.style.cursor = 'move';
    node.style.zIndex = '1';
    if (Math.abs(e.clientX - startX) > 2 || Math.abs(e.clientY - startY) > 2) {
      saveSnapshot();
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
  // Only reset undo history when NOT restoring (i.e., user clears canvas or loads new workflow)
  if (!_restoringHistory) {
    historyStack = [];
    historyPointer = -1;
    updateUndoRedoButtons();
    // Reset zoom/pan to default
    zoom = 1; panX = 0; panY = 0;
    applyTransform();
  }
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
    setTimeout(() => {
      renderConnections();
      if (_restoringHistory) {
        // Called from applySnapshot — clear flag, update buttons, don't save
        _restoringHistory = false;
        updateUndoRedoButtons();
      } else {
        // Called externally (e.g. load workflow from dashboard) — save as initial entry
        saveSnapshot();
      }
    }, 50);
  } else {
    if (_restoringHistory) {
      _restoringHistory = false;
      updateUndoRedoButtons();
    } else {
      saveSnapshot();
    }
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
  const viewport = document.getElementById('canvasViewport');
  const node = document.getElementById(nodeId);
  if (!viewport || !node) return null;
  const viewportRect = viewport.getBoundingClientRect();
  const portEl = node.querySelector(port === 'out' ? '.node-port-out' : '.node-port-in') as HTMLElement | null;
  if (!portEl) return null;
  const portRect = portEl.getBoundingClientRect();
  // Convert screen position → canvas content space
  return {
    x: (portRect.left + portRect.width / 2 - viewportRect.left - panX) / zoom,
    y: (portRect.top + portRect.height / 2 - viewportRect.top - panY) / zoom,
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
  saveSnapshot();
}

function setupPortDrag(): void {
  let draggingFrom: { nodeId: string } | null = null;
  let ghostPath: SVGPathElement | null = null;

  document.addEventListener('mousedown', (e: MouseEvent) => {
    if (spaceDown) return;  // pan mode takes priority
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
    const viewport = document.getElementById('canvasViewport');
    if (!viewport) return;
    const viewportRect = viewport.getBoundingClientRect();
    const fromPos = getPortPos(draggingFrom.nodeId, 'out');
    if (!fromPos) return;
    // Convert mouse screen position → canvas content space
    const toX = (e.clientX - viewportRect.left - panX) / zoom;
    const toY = (e.clientY - viewportRect.top - panY) / zoom;
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
          if (ghostPath) { ghostPath.remove(); ghostPath = null; }
          draggingFrom = null;
          renderConnections();
          saveSnapshot();
          return;
        }
      }
    }

    if (ghostPath) { ghostPath.remove(); ghostPath = null; }
    draggingFrom = null;
    renderConnections();
  });
}

// Export the workflow canvas as a PNG file
async function exportCanvasPng(): Promise<void> {
  const canvas = document.getElementById('workflowCanvas');
  if (!canvas) return;

  const nodes = canvas.querySelectorAll('.canvas-node');
  if (nodes.length === 0) {
    alert('Add at least one resource to the canvas before exporting.');
    return;
  }

  const btn = document.getElementById('exportPngBtn') as HTMLButtonElement | null;
  if (btn) { btn.disabled = true; btn.textContent = 'Exporting…'; }

  try {
    const { default: html2canvas } = await import('html2canvas');

    // Temporarily hide port handles and ghost elements so they don't appear in the export
    canvas.querySelectorAll<HTMLElement>('.node-port').forEach(p => p.style.visibility = 'hidden');

    const canvasEl = await html2canvas(canvas as HTMLElement, {
      backgroundColor: '#ffffff',
      scale: 2,             // retina quality
      useCORS: true,
      logging: false,
      // Capture only the area with content + a small margin
    });

    // Restore ports
    canvas.querySelectorAll<HTMLElement>('.node-port').forEach(p => p.style.visibility = '');

    const workflowName = localStorage.getItem('current_workflow_name') || 'workflow';
    const filename = `${workflowName.replace(/\s+/g, '-').toLowerCase()}-diagram.png`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvasEl.toDataURL('image/png');
    link.click();
  } catch (err) {
    console.error('PNG export failed:', err);
    alert('Export failed. Please try again.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" width="14" height="14" style="margin-right:4px;vertical-align:-1px">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg> Export PNG`;
    }
  }
}

// ─── Architecture Templates ───────────────────────────────────────────────────

interface Template {
  id: string;
  name: string;
  description: string;
  tags: string[];
  state: any;
}

const TEMPLATES: Template[] = [
  {
    id: '3tier',
    name: '3-Tier Web Application',
    description: 'VPC + public subnet + security group + EC2 web tier + RDS database + Application Load Balancer',
    tags: ['Web', 'Database', 'Networking'],
    state: {
      nodes: [
        { id: 'node-1', type: 'vpc',           position: { x: 340, y: 40  }, config: { nodeName: 'prod-vpc',        nodeCidr: '10.0.0.0/16'  }, connections: ['node-2','node-3'] },
        { id: 'node-2', type: 'subnet',        position: { x: 100, y: 180 }, config: { nodeName: 'public-subnet',   nodeCidr: '10.0.1.0/24'  }, connections: ['node-1','node-4'] },
        { id: 'node-3', type: 'securitygroup', position: { x: 580, y: 180 }, config: { nodeName: 'web-sg',          nodeDescription: 'Web tier SG' }, connections: ['node-1','node-4'] },
        { id: 'node-4', type: 'ec2',           position: { x: 340, y: 340 }, config: { nodeName: 'web-server',      nodeInstanceType: 't2.micro' }, connections: ['node-2','node-3','node-5','node-6'] },
        { id: 'node-5', type: 'rds',           position: { x: 100, y: 500 }, config: { nodeName: 'prod-db',         nodeEngine: 'mysql'         }, connections: ['node-4'] },
        { id: 'node-6', type: 'loadbalancer',  position: { x: 580, y: 500 }, config: { nodeName: 'app-lb',          nodeLbType: 'application'   }, connections: ['node-4'] },
      ],
      connections: [
        { id: 'conn-1', fromNodeId: 'node-1', toNodeId: 'node-2' },
        { id: 'conn-2', fromNodeId: 'node-1', toNodeId: 'node-3' },
        { id: 'conn-3', fromNodeId: 'node-2', toNodeId: 'node-4' },
        { id: 'conn-4', fromNodeId: 'node-3', toNodeId: 'node-4' },
        { id: 'conn-5', fromNodeId: 'node-4', toNodeId: 'node-5' },
        { id: 'conn-6', fromNodeId: 'node-4', toNodeId: 'node-6' },
      ],
      metadata: { created_at: new Date().toISOString() },
    },
  },
  {
    id: 'serverless',
    name: 'Serverless API',
    description: 'Lambda function + DynamoDB table + SQS queue + IAM execution role',
    tags: ['Serverless', 'Database', 'Messaging'],
    state: {
      nodes: [
        { id: 'node-1', type: 'iamrole',   position: { x: 80,  y: 80  }, config: { nodeName: 'lambda-exec-role' }, connections: ['node-2'] },
        { id: 'node-2', type: 'lambda',    position: { x: 340, y: 80  }, config: { nodeName: 'api-handler', nodeRuntime: 'python3.9', nodeHandler: 'index.handler' }, connections: ['node-1','node-3','node-4'] },
        { id: 'node-3', type: 'dynamodb',  position: { x: 160, y: 280 }, config: { nodeName: 'data-table',  nodeHashKey: 'id', nodeBillingMode: 'PAY_PER_REQUEST' }, connections: ['node-2'] },
        { id: 'node-4', type: 'sqs',       position: { x: 560, y: 280 }, config: { nodeName: 'task-queue'  }, connections: ['node-2'] },
      ],
      connections: [
        { id: 'conn-1', fromNodeId: 'node-1', toNodeId: 'node-2' },
        { id: 'conn-2', fromNodeId: 'node-2', toNodeId: 'node-3' },
        { id: 'conn-3', fromNodeId: 'node-2', toNodeId: 'node-4' },
      ],
      metadata: { created_at: new Date().toISOString() },
    },
  },
  {
    id: 'static-cdn',
    name: 'Static Website + CDN',
    description: 'S3 bucket for static assets served globally via CloudFront distribution',
    tags: ['Storage', 'CDN', 'Frontend'],
    state: {
      nodes: [
        { id: 'node-1', type: 's3',         position: { x: 180, y: 180 }, config: { nodeName: 'static-assets' }, connections: ['node-2'] },
        { id: 'node-2', type: 'cloudfront', position: { x: 520, y: 180 }, config: { nodeName: 'cdn-dist', nodePriceClass: 'PriceClass_All' }, connections: ['node-1'] },
      ],
      connections: [
        { id: 'conn-1', fromNodeId: 'node-1', toNodeId: 'node-2' },
      ],
      metadata: { created_at: new Date().toISOString() },
    },
  },
  {
    id: 'autoscaling',
    name: 'Auto-Scaling Cluster',
    description: 'VPC + subnet + NAT gateway + internet gateway + auto scaling group + load balancer',
    tags: ['Compute', 'Networking', 'Scaling'],
    state: {
      nodes: [
        { id: 'node-1', type: 'vpc',             position: { x: 340, y: 30  }, config: { nodeName: 'cluster-vpc',    nodeCidr: '10.0.0.0/16'  }, connections: ['node-2','node-3','node-4'] },
        { id: 'node-2', type: 'internetgateway', position: { x: 80,  y: 180 }, config: { nodeName: 'main-igw'        }, connections: ['node-1'] },
        { id: 'node-3', type: 'subnet',          position: { x: 340, y: 180 }, config: { nodeName: 'public-subnet',  nodeCidr: '10.0.1.0/24'  }, connections: ['node-1','node-4','node-5'] },
        { id: 'node-4', type: 'natgateway',      position: { x: 600, y: 180 }, config: { nodeName: 'nat-gw'          }, connections: ['node-1'] },
        { id: 'node-5', type: 'autoscaling',     position: { x: 200, y: 360 }, config: { nodeName: 'web-asg', nodeMinSize: '2', nodeMaxSize: '10', nodeDesiredCapacity: '3' }, connections: ['node-3','node-6'] },
        { id: 'node-6', type: 'loadbalancer',    position: { x: 520, y: 360 }, config: { nodeName: 'cluster-alb',    nodeLbType: 'application'  }, connections: ['node-5'] },
      ],
      connections: [
        { id: 'conn-1', fromNodeId: 'node-1', toNodeId: 'node-2' },
        { id: 'conn-2', fromNodeId: 'node-1', toNodeId: 'node-3' },
        { id: 'conn-3', fromNodeId: 'node-1', toNodeId: 'node-4' },
        { id: 'conn-4', fromNodeId: 'node-3', toNodeId: 'node-5' },
        { id: 'conn-5', fromNodeId: 'node-5', toNodeId: 'node-6' },
      ],
      metadata: { created_at: new Date().toISOString() },
    },
  },

  // ── Template 5: VPC Network Foundation ─────────────────────────────────────
  {
    id: 'vpc-foundation',
    name: 'VPC Network Foundation',
    description: 'Production-ready VPC with public & private subnets, internet gateway, NAT gateway and route table. The starting point for any AWS deployment.',
    tags: ['Networking', 'Foundation', 'VPC'],
    state: {
      nodes: [
        { id: 'node-1', type: 'vpc',             position: { x: 300, y: 30  }, config: { nodeName: 'main-vpc',        nodeCidr: '10.0.0.0/16'  }, connections: ['node-2','node-3','node-4'] },
        { id: 'node-2', type: 'internetgateway', position: { x: 60,  y: 200 }, config: { nodeName: 'main-igw'         }, connections: ['node-1','node-3'] },
        { id: 'node-3', type: 'subnet',          position: { x: 300, y: 200 }, config: { nodeName: 'public-subnet',   nodeCidr: '10.0.1.0/24'  }, connections: ['node-1','node-2','node-5','node-6'] },
        { id: 'node-4', type: 'subnet',          position: { x: 560, y: 200 }, config: { nodeName: 'private-subnet',  nodeCidr: '10.0.2.0/24'  }, connections: ['node-1','node-5'] },
        { id: 'node-5', type: 'natgateway',      position: { x: 300, y: 380 }, config: { nodeName: 'nat-gw'           }, connections: ['node-3','node-4'] },
        { id: 'node-6', type: 'routetable',      position: { x: 60,  y: 380 }, config: { nodeName: 'public-rt'        }, connections: ['node-3'] },
      ],
      connections: [
        { id: 'conn-1', fromNodeId: 'node-1', toNodeId: 'node-2' },
        { id: 'conn-2', fromNodeId: 'node-1', toNodeId: 'node-3' },
        { id: 'conn-3', fromNodeId: 'node-1', toNodeId: 'node-4' },
        { id: 'conn-4', fromNodeId: 'node-2', toNodeId: 'node-3' },
        { id: 'conn-5', fromNodeId: 'node-3', toNodeId: 'node-5' },
        { id: 'conn-6', fromNodeId: 'node-4', toNodeId: 'node-5' },
        { id: 'conn-7', fromNodeId: 'node-3', toNodeId: 'node-6' },
      ],
      metadata: { created_at: new Date().toISOString() },
    },
  },

  // ── Template 6: Event-Driven Pipeline (SNS Fan-out) ────────────────────────
  {
    id: 'event-driven',
    name: 'Event-Driven Pipeline',
    description: 'SNS topic fans out to two SQS queues, each consumed by a Lambda function that writes results to DynamoDB. Classic decoupled async pattern.',
    tags: ['Serverless', 'Messaging', 'Event-Driven'],
    state: {
      nodes: [
        { id: 'node-1', type: 'iamrole',   position: { x: 580, y: 40  }, config: { nodeName: 'lambda-exec-role'  }, connections: ['node-4','node-5'] },
        { id: 'node-2', type: 'sns',        position: { x: 300, y: 40  }, config: { nodeName: 'events-topic'      }, connections: ['node-3','node-4'] },
        { id: 'node-3', type: 'sqs',        position: { x: 80,  y: 200 }, config: { nodeName: 'orders-queue'      }, connections: ['node-2','node-4'] },
        { id: 'node-4', type: 'lambda',     position: { x: 80,  y: 380 }, config: { nodeName: 'orders-processor',  nodeRuntime: 'python3.9', nodeHandler: 'index.handler' }, connections: ['node-1','node-2','node-3','node-6'] },
        { id: 'node-5', type: 'lambda',     position: { x: 520, y: 380 }, config: { nodeName: 'alerts-processor',  nodeRuntime: 'python3.9', nodeHandler: 'index.handler' }, connections: ['node-1','node-6'] },
        { id: 'node-6', type: 'dynamodb',   position: { x: 300, y: 540 }, config: { nodeName: 'events-table',     nodeHashKey: 'id', nodeBillingMode: 'PAY_PER_REQUEST' }, connections: ['node-4','node-5'] },
      ],
      connections: [
        { id: 'conn-1', fromNodeId: 'node-1', toNodeId: 'node-4' },
        { id: 'conn-2', fromNodeId: 'node-1', toNodeId: 'node-5' },
        { id: 'conn-3', fromNodeId: 'node-2', toNodeId: 'node-3' },
        { id: 'conn-4', fromNodeId: 'node-2', toNodeId: 'node-4' },
        { id: 'conn-5', fromNodeId: 'node-3', toNodeId: 'node-4' },
        { id: 'conn-6', fromNodeId: 'node-4', toNodeId: 'node-6' },
        { id: 'conn-7', fromNodeId: 'node-5', toNodeId: 'node-6' },
      ],
      metadata: { created_at: new Date().toISOString() },
    },
  },

  // ── Template 7: S3 Data Processing Pipeline ────────────────────────────────
  {
    id: 'data-pipeline',
    name: 'S3 Data Processing Pipeline',
    description: 'S3 upload triggers a Lambda function (via SQS) that processes the file, stores results in DynamoDB, and sends notifications via SNS.',
    tags: ['Serverless', 'Storage', 'Analytics'],
    state: {
      nodes: [
        { id: 'node-1', type: 's3',       position: { x: 60,  y: 200 }, config: { nodeName: 'raw-data-bucket'    }, connections: ['node-3'] },
        { id: 'node-2', type: 'iamrole',  position: { x: 580, y: 40  }, config: { nodeName: 'processor-role'     }, connections: ['node-4'] },
        { id: 'node-3', type: 'sqs',      position: { x: 300, y: 40  }, config: { nodeName: 'upload-queue'       }, connections: ['node-1','node-4'] },
        { id: 'node-4', type: 'lambda',   position: { x: 300, y: 200 }, config: { nodeName: 'file-processor',    nodeRuntime: 'python3.9', nodeHandler: 'handler.process' }, connections: ['node-2','node-3','node-5','node-6'] },
        { id: 'node-5', type: 'dynamodb', position: { x: 100, y: 400 }, config: { nodeName: 'results-table',     nodeHashKey: 'file_id', nodeBillingMode: 'PAY_PER_REQUEST' }, connections: ['node-4'] },
        { id: 'node-6', type: 'sns',      position: { x: 520, y: 400 }, config: { nodeName: 'notify-topic'       }, connections: ['node-4'] },
      ],
      connections: [
        { id: 'conn-1', fromNodeId: 'node-1', toNodeId: 'node-3' },
        { id: 'conn-2', fromNodeId: 'node-2', toNodeId: 'node-4' },
        { id: 'conn-3', fromNodeId: 'node-3', toNodeId: 'node-4' },
        { id: 'conn-4', fromNodeId: 'node-4', toNodeId: 'node-5' },
        { id: 'conn-5', fromNodeId: 'node-4', toNodeId: 'node-6' },
      ],
      metadata: { created_at: new Date().toISOString() },
    },
  },

  // ── Template 8: Secure Bastion Host ────────────────────────────────────────
  {
    id: 'bastion',
    name: 'Secure Bastion Host',
    description: 'Jump-box pattern: public EC2 bastion in a public subnet acts as the only SSH entry point to private EC2 application servers. Security groups enforce least privilege.',
    tags: ['Security', 'Networking', 'EC2'],
    state: {
      nodes: [
        { id: 'node-1', type: 'vpc',             position: { x: 300, y: 30  }, config: { nodeName: 'secure-vpc',       nodeCidr: '10.0.0.0/16'   }, connections: ['node-2','node-3','node-4'] },
        { id: 'node-2', type: 'internetgateway', position: { x: 60,  y: 30  }, config: { nodeName: 'main-igw'          }, connections: ['node-1','node-3'] },
        { id: 'node-3', type: 'subnet',          position: { x: 100, y: 200 }, config: { nodeName: 'public-subnet',    nodeCidr: '10.0.1.0/24'   }, connections: ['node-1','node-2','node-5','node-6'] },
        { id: 'node-4', type: 'subnet',          position: { x: 520, y: 200 }, config: { nodeName: 'private-subnet',   nodeCidr: '10.0.2.0/24'   }, connections: ['node-1','node-7'] },
        { id: 'node-5', type: 'securitygroup',   position: { x: 60,  y: 380 }, config: { nodeName: 'bastion-sg',       nodeDescription: 'Allow SSH from internet' }, connections: ['node-3','node-6'] },
        { id: 'node-6', type: 'ec2',             position: { x: 200, y: 380 }, config: { nodeName: 'bastion-host',     nodeInstanceType: 't2.micro' }, connections: ['node-3','node-5','node-7'] },
        { id: 'node-7', type: 'ec2',             position: { x: 520, y: 380 }, config: { nodeName: 'app-server',       nodeInstanceType: 't2.small' }, connections: ['node-4','node-6'] },
      ],
      connections: [
        { id: 'conn-1', fromNodeId: 'node-1', toNodeId: 'node-2' },
        { id: 'conn-2', fromNodeId: 'node-1', toNodeId: 'node-3' },
        { id: 'conn-3', fromNodeId: 'node-1', toNodeId: 'node-4' },
        { id: 'conn-4', fromNodeId: 'node-2', toNodeId: 'node-3' },
        { id: 'conn-5', fromNodeId: 'node-3', toNodeId: 'node-5' },
        { id: 'conn-6', fromNodeId: 'node-5', toNodeId: 'node-6' },
        { id: 'conn-7', fromNodeId: 'node-6', toNodeId: 'node-7' },
        { id: 'conn-8', fromNodeId: 'node-4', toNodeId: 'node-7' },
      ],
      metadata: { created_at: new Date().toISOString() },
    },
  },

  // ── Template 9: Shared File Storage Service ─────────────────────────────────
  {
    id: 'shared-storage',
    name: 'Shared File Storage Service',
    description: 'EC2 instances behind a load balancer share a common EFS filesystem. S3 is used for backups and static assets. RDS handles relational data.',
    tags: ['Storage', 'Compute', 'Database'],
    state: {
      nodes: [
        { id: 'node-1', type: 'vpc',          position: { x: 320, y: 30  }, config: { nodeName: 'app-vpc',        nodeCidr: '10.0.0.0/16' }, connections: ['node-2','node-3'] },
        { id: 'node-2', type: 'subnet',       position: { x: 120, y: 180 }, config: { nodeName: 'app-subnet',     nodeCidr: '10.0.1.0/24' }, connections: ['node-1','node-4','node-5'] },
        { id: 'node-3', type: 'securitygroup',position: { x: 540, y: 180 }, config: { nodeName: 'app-sg',         nodeDescription: 'App security group' }, connections: ['node-1','node-4','node-5'] },
        { id: 'node-4', type: 'loadbalancer', position: { x: 120, y: 340 }, config: { nodeName: 'app-alb',        nodeLbType: 'application' }, connections: ['node-2','node-3','node-5'] },
        { id: 'node-5', type: 'ec2',          position: { x: 320, y: 340 }, config: { nodeName: 'app-server',     nodeInstanceType: 't2.small' }, connections: ['node-2','node-3','node-4','node-6','node-7','node-8'] },
        { id: 'node-6', type: 'efs',          position: { x: 540, y: 340 }, config: { nodeName: 'shared-fs',      nodePerformanceMode: 'generalPurpose' }, connections: ['node-5'] },
        { id: 'node-7', type: 's3',           position: { x: 160, y: 510 }, config: { nodeName: 'backup-bucket'  }, connections: ['node-5'] },
        { id: 'node-8', type: 'rds',          position: { x: 480, y: 510 }, config: { nodeName: 'app-db',         nodeEngine: 'mysql'      }, connections: ['node-5'] },
      ],
      connections: [
        { id: 'conn-1', fromNodeId: 'node-1', toNodeId: 'node-2' },
        { id: 'conn-2', fromNodeId: 'node-1', toNodeId: 'node-3' },
        { id: 'conn-3', fromNodeId: 'node-2', toNodeId: 'node-4' },
        { id: 'conn-4', fromNodeId: 'node-2', toNodeId: 'node-5' },
        { id: 'conn-5', fromNodeId: 'node-3', toNodeId: 'node-5' },
        { id: 'conn-6', fromNodeId: 'node-4', toNodeId: 'node-5' },
        { id: 'conn-7', fromNodeId: 'node-5', toNodeId: 'node-6' },
        { id: 'conn-8', fromNodeId: 'node-5', toNodeId: 'node-7' },
        { id: 'conn-9', fromNodeId: 'node-5', toNodeId: 'node-8' },
      ],
      metadata: { created_at: new Date().toISOString() },
    },
  },

  // ── Template 10: Message Queue Worker ──────────────────────────────────────
  {
    id: 'queue-worker',
    name: 'Message Queue Worker',
    description: 'Reliable async job processing: producers send jobs to an SQS queue, Lambda workers consume and process them, persisting results to DynamoDB with SNS alerts on completion.',
    tags: ['Serverless', 'Messaging', 'Queue'],
    state: {
      nodes: [
        { id: 'node-1', type: 'iamrole',   position: { x: 580, y: 30  }, config: { nodeName: 'worker-role'       }, connections: ['node-3'] },
        { id: 'node-2', type: 'sqs',        position: { x: 80,  y: 30  }, config: { nodeName: 'jobs-queue',       nodeVisibilityTimeout: '30', nodeRetentionPeriod: '4' }, connections: ['node-3'] },
        { id: 'node-3', type: 'lambda',     position: { x: 330, y: 30  }, config: { nodeName: 'job-worker',       nodeRuntime: 'python3.9', nodeHandler: 'worker.handle' }, connections: ['node-1','node-2','node-4','node-5'] },
        { id: 'node-4', type: 'dynamodb',   position: { x: 140, y: 240 }, config: { nodeName: 'jobs-table',       nodeHashKey: 'job_id', nodeBillingMode: 'PAY_PER_REQUEST' }, connections: ['node-3'] },
        { id: 'node-5', type: 'sns',        position: { x: 520, y: 240 }, config: { nodeName: 'completion-topic', nodeDisplayName: 'Job Completion Alerts' }, connections: ['node-3'] },
      ],
      connections: [
        { id: 'conn-1', fromNodeId: 'node-1', toNodeId: 'node-3' },
        { id: 'conn-2', fromNodeId: 'node-2', toNodeId: 'node-3' },
        { id: 'conn-3', fromNodeId: 'node-3', toNodeId: 'node-4' },
        { id: 'conn-4', fromNodeId: 'node-3', toNodeId: 'node-5' },
      ],
      metadata: { created_at: new Date().toISOString() },
    },
  },
];

function setupTemplates(): void {
  const btn = document.getElementById('templatesBtn');
  const modal = document.getElementById('templatesModal');
  const closeBtn = document.getElementById('templatesModalClose');
  const grid = document.getElementById('templatesGrid');
  if (!btn || !modal || !closeBtn || !grid) return;

  // Render template cards
  grid.innerHTML = TEMPLATES.map(t => `
    <div class="template-card" data-template="${t.id}">
      <div class="template-name">${t.name}</div>
      <div class="template-desc">${t.description}</div>
      <div class="template-tags">
        ${t.tags.map(tag => `<span class="template-tag">${tag}</span>`).join('')}
      </div>
      <button class="btn btn-primary template-use-btn" data-template="${t.id}">Use Template</button>
    </div>
  `).join('');

  btn.addEventListener('click', () => { modal.style.display = 'flex'; });
  closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  grid.addEventListener('click', (e) => {
    const useBtn = (e.target as HTMLElement).closest('[data-template]') as HTMLElement | null;
    if (!(e.target as HTMLElement).classList.contains('template-use-btn')) return;
    const templateId = (e.target as HTMLElement).dataset.template;
    const template = TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    // Confirm if canvas has nodes
    const canvas = document.getElementById('workflowCanvas');
    const hasNodes = canvas && canvas.querySelectorAll('.canvas-node').length > 0;
    if (hasNodes && !confirm(`Load "${template.name}"? This will replace the current canvas.`)) return;

    // Reset zoom/pan then load
    zoom = 1; panX = 0; panY = 0;
    applyTransform();
    loadWorkflowState(template.state);

    modal.style.display = 'none';
  });
}

function setupAiGenerate(): void {
  const btn = document.getElementById('aiGenerateBtn');
  const modal = document.getElementById('aiModal');
  const closeBtn = document.getElementById('aiModalClose');
  const cancelBtn = document.getElementById('aiModalCancel');
  const submitBtn = document.getElementById('aiGenerateSubmit') as HTMLButtonElement | null;
  const input = document.getElementById('aiPromptInput') as HTMLTextAreaElement | null;
  const statusEl = document.getElementById('aiStatus');
  if (!btn || !modal || !closeBtn || !cancelBtn || !submitBtn || !input) return;

  const openModal = () => { modal.style.display = 'flex'; input.focus(); };
  const closeModal = () => { modal.style.display = 'none'; if (statusEl) statusEl.textContent = ''; };

  btn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  // Example chips fill the textarea
  modal.querySelectorAll<HTMLButtonElement>('.ai-example-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.prompt || '';
      input.focus();
    });
  });

  submitBtn.addEventListener('click', async () => {
    const prompt = input.value.trim();
    if (!prompt) { input.focus(); return; }

    submitBtn.disabled = true;
    if (statusEl) {
      statusEl.innerHTML = '<span class="validate-spinner" style="width:12px;height:12px;border-width:2px"></span> Generating…';
    }

    try {
      const { apiService } = await import('./services/api');
      const result = await apiService.generateFromPrompt(prompt);

      if (result.error) {
        if (statusEl) statusEl.textContent = `Error: ${result.error}`;
        return;
      }

      if (result.data?.workflow_state) {
        const canvas = document.getElementById('workflowCanvas');
        const hasNodes = canvas && canvas.querySelectorAll('.canvas-node').length > 0;
        if (hasNodes && !confirm('Load AI-generated architecture? This will replace the current canvas.')) return;

        zoom = 1; panX = 0; panY = 0;
        applyTransform();
        loadWorkflowState(result.data.workflow_state);
        closeModal();
      }
    } catch (err) {
      if (statusEl) statusEl.textContent = 'Generation failed — please try again.';
    } finally {
      submitBtn.disabled = false;
    }
  });

  // Ctrl+Enter submits
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submitBtn.click();
  });
}

// Setup workflow action buttons
function setupWorkflowActions(): void {
  import('./router').then(({ router }) => {
    // Undo / Redo buttons
    document.getElementById('undoBtn')?.addEventListener('click', () => undo());
    document.getElementById('redoBtn')?.addEventListener('click', () => redo());

    // Templates
    setupTemplates();

    // AI Generate
    setupAiGenerate();

    // Export PNG
    document.getElementById('exportPngBtn')?.addEventListener('click', () => exportCanvasPng());

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
      const validateResult = await apiService.validateCode(combined || genResult.data.terraform_code, files);
      if (validateResult.error) { alert(`Validation failed: ${validateResult.error}`); return; }
      if (validateResult.data) {
        const { valid, errors, warnings, method, validator_version } = validateResult.data;
        const methodLabel = method === 'terraform'
          ? `Validator: Terraform${validator_version ? ` v${validator_version}` : ''}`
          : 'Validator: Static analysis';
        const msg = `Validation ${valid ? 'passed ✓' : 'failed ✗'}  [${methodLabel}]\n\n` +
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

