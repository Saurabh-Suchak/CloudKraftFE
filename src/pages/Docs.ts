export const Docs = (): string => {
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
          <a href="/workflow" data-navigate="/workflow" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Designer</span>
          </a>
          <a href="/deployments" data-navigate="/deployments" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Deployments</span>
          </a>
          <a href="/docs" data-navigate="/docs" class="nav-item active">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Docs</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <a href="/profile" data-navigate="/profile" class="user-profile-link">
            <div class="user-profile">
              <div class="user-avatar" data-user-avatar>U</div>
              <div class="user-info">
                <div class="user-name" data-user-name>User</div>
                <div class="user-email" data-user-email></div>
              </div>
            </div>
          </a>
          <button class="btn-logout" id="logoutBtn">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 21.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 17L21 12L16 7M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Log out
          </button>
        </div>
      </aside>

      <main class="main-content" style="overflow-y:auto;">
        <div class="docs-container" style="max-width:860px;margin:0 auto;padding:40px 32px 80px;">

          <div style="margin-bottom:40px;">
            <h1 style="font-size:28px;font-weight:700;margin:0 0 10px;">Templates</h1>
            <p style="color:var(--text-secondary);font-size:15px;margin:0;">
              CloudKraft templates are pre-built AWS architectures. Pick one, click <strong>Use Template</strong> in the Designer, and deploy — no AWS expertise needed.
            </p>
          </div>

          <!-- Quick picker -->
          <div style="background:var(--surface-100);border:1px solid var(--border);border-radius:10px;padding:20px 24px;margin-bottom:40px;">
            <p style="font-weight:600;margin:0 0 14px;font-size:14px;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.05em;">Not sure which to pick?</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:14px;">
              <div style="padding:12px 14px;background:var(--surface-200);border-radius:7px;"><span style="font-weight:600;">Building a website or web app?</span><br><a href="#doc-3tier" class="doc-picker-link" onclick="event.preventDefault();document.getElementById('doc-3tier').scrollIntoView({behavior:'smooth',block:'start'})">→ 3-Tier Web Application</a></div>
              <div style="padding:12px 14px;background:var(--surface-200);border-radius:7px;"><span style="font-weight:600;">Building an API without managing servers?</span><br><a href="#doc-serverless" class="doc-picker-link" onclick="event.preventDefault();document.getElementById('doc-serverless').scrollIntoView({behavior:'smooth',block:'start'})">→ Serverless API</a></div>
              <div style="padding:12px 14px;background:var(--surface-200);border-radius:7px;"><span style="font-weight:600;">Hosting a static site or frontend?</span><br><a href="#doc-static-cdn" class="doc-picker-link" onclick="event.preventDefault();document.getElementById('doc-static-cdn').scrollIntoView({behavior:'smooth',block:'start'})">→ Static Website + CDN</a></div>
              <div style="padding:12px 14px;background:var(--surface-200);border-radius:7px;"><span style="font-weight:600;">Need your app to handle traffic spikes?</span><br><a href="#doc-autoscaling" class="doc-picker-link" onclick="event.preventDefault();document.getElementById('doc-autoscaling').scrollIntoView({behavior:'smooth',block:'start'})">→ Auto-Scaling Cluster</a></div>
              <div style="padding:12px 14px;background:var(--surface-200);border-radius:7px;"><span style="font-weight:600;">Processing uploaded files or data?</span><br><a href="#doc-data-pipeline" class="doc-picker-link" onclick="event.preventDefault();document.getElementById('doc-data-pipeline').scrollIntoView({behavior:'smooth',block:'start'})">→ S3 Data Processing Pipeline</a></div>
              <div style="padding:12px 14px;background:var(--surface-200);border-radius:7px;"><span style="font-weight:600;">Need secure access to private servers?</span><br><a href="#doc-bastion" class="doc-picker-link" onclick="event.preventDefault();document.getElementById('doc-bastion').scrollIntoView({behavior:'smooth',block:'start'})">→ Secure Bastion Host</a></div>
              <div style="padding:12px 14px;background:var(--surface-200);border-radius:7px;"><span style="font-weight:600;">Running background jobs or queues?</span><br><a href="#doc-queue-worker" class="doc-picker-link" onclick="event.preventDefault();document.getElementById('doc-queue-worker').scrollIntoView({behavior:'smooth',block:'start'})">→ Message Queue Worker</a></div>
              <div style="padding:12px 14px;background:var(--surface-200);border-radius:7px;"><span style="font-weight:600;">Starting fresh and need a solid network?</span><br><a href="#doc-vpc-foundation" class="doc-picker-link" onclick="event.preventDefault();document.getElementById('doc-vpc-foundation').scrollIntoView({behavior:'smooth',block:'start'})">→ VPC Network Foundation</a></div>
              <div style="padding:12px 14px;background:var(--surface-200);border-radius:7px;"><span style="font-weight:600;">Need one event to trigger multiple systems?</span><br><a href="#doc-event-driven" class="doc-picker-link" onclick="event.preventDefault();document.getElementById('doc-event-driven').scrollIntoView({behavior:'smooth',block:'start'})">→ Event-Driven Pipeline</a></div>
              <div style="padding:12px 14px;background:var(--surface-200);border-radius:7px;"><span style="font-weight:600;">Multiple servers that share the same files?</span><br><a href="#doc-shared-storage" class="doc-picker-link" onclick="event.preventDefault();document.getElementById('doc-shared-storage').scrollIntoView({behavior:'smooth',block:'start'})">→ Shared File Storage</a></div>
            </div>
          </div>

          <!-- Templates -->
          ${templateDoc({
            id: '3tier',
            name: '3-Tier Web Application',
            badge: 'Most Popular',
            badgeColor: '#2563eb',
            summary: 'A classic production web app architecture: load balancer in front, EC2 web servers in the middle, and a managed MySQL database at the back — all inside a private network.',
            whoIsItFor: 'You\'re building a traditional web application (e-commerce store, SaaS dashboard, internal tool) that needs a database and can expect moderate to high traffic.',
            whatItDeploys: [
              'VPC — isolated private network for all your resources',
              'Subnet — a section of the network where your servers live',
              'Security Group — firewall rules controlling who can talk to what',
              'EC2 (t2.micro) — your web server (runs Node.js, Python, PHP, etc.)',
              'RDS MySQL — fully managed relational database, automatic backups included',
              'Application Load Balancer — distributes incoming traffic across servers',
            ],
            howItWorks: 'Users hit the Load Balancer → it routes requests to your EC2 web server → the web server reads/writes to RDS. The Security Group ensures only the Load Balancer can reach your EC2, and only EC2 can reach your database.',
            estimatedCost: '~$50–$90/month',
          })}

          ${templateDoc({
            id: 'serverless',
            name: 'Serverless API',
            badge: 'No Servers',
            badgeColor: '#7c3aed',
            summary: 'Build and run an API without provisioning or managing any servers. AWS runs your code on demand and you only pay for actual requests.',
            whoIsItFor: 'You\'re building a REST API, a backend for a mobile app, or a microservice and you don\'t want to think about servers, scaling, or uptime.',
            whatItDeploys: [
              'IAM Role — gives your Lambda function permission to access other AWS services',
              'Lambda Function (Python 3.9) — your code, runs on demand, scales automatically',
              'DynamoDB — a fast NoSQL database, scales to any size, pay-per-request billing',
              'SQS Queue — a message queue for offloading async work from your API',
            ],
            howItWorks: 'An HTTP request (via API Gateway, or direct invocation) triggers Lambda. Lambda reads/writes data to DynamoDB and drops async tasks into SQS for background processing. Zero idle cost — you only pay when code runs.',
            estimatedCost: '~$0–$5/month at low traffic (free tier eligible)',
          })}

          ${templateDoc({
            id: 'static-cdn',
            name: 'Static Website + CDN',
            badge: 'Cheapest',
            badgeColor: '#059669',
            summary: 'Host your website\'s HTML, CSS, JavaScript, and images on S3 and serve them globally at high speed via CloudFront (AWS\'s content delivery network).',
            whoIsItFor: 'You have a React, Vue, or plain HTML/CSS website (or any frontend built with a bundler) and want fast global delivery at minimal cost.',
            whatItDeploys: [
              'S3 Bucket — stores your website files (HTML, CSS, JS, images)',
              'CloudFront Distribution — caches and serves your files from 400+ edge locations worldwide',
            ],
            howItWorks: 'You upload your built frontend files to S3. CloudFront sits in front of S3 and caches content at edge locations globally, so users anywhere in the world get fast load times. You get HTTPS automatically.',
            estimatedCost: '~$1–$5/month for most sites',
          })}

          ${templateDoc({
            id: 'autoscaling',
            name: 'Auto-Scaling Cluster',
            badge: 'High Availability',
            badgeColor: '#d97706',
            summary: 'A fleet of EC2 servers that automatically grows when traffic increases and shrinks when it drops, always sitting behind a load balancer.',
            whoIsItFor: 'Your app has unpredictable or spiky traffic — like a SaaS product, a game backend, or a news site that gets traffic bursts. You want to avoid both over-provisioning (wasted money) and under-provisioning (slow app).',
            whatItDeploys: [
              'VPC + Subnet — isolated network for your cluster',
              'Internet Gateway — connects your VPC to the internet',
              'NAT Gateway — lets private servers make outbound internet calls securely',
              'Auto Scaling Group — maintains 2–10 EC2 instances, scales based on CPU/load',
              'Application Load Balancer — routes traffic evenly across all running instances',
            ],
            howItWorks: 'Traffic hits the Load Balancer → distributed across healthy EC2 instances. If CPU spikes above a threshold, Auto Scaling launches more instances automatically. When traffic drops, it terminates them. You define min (2) and max (10) instance count.',
            estimatedCost: '~$80–$200/month depending on instance count',
          })}

          ${templateDoc({
            id: 'vpc-foundation',
            name: 'VPC Network Foundation',
            badge: 'Starting Point',
            badgeColor: '#6b7280',
            summary: 'A production-ready network foundation — public and private subnets, internet access, and NAT. The base layer you add other resources on top of.',
            whoIsItFor: 'You\'re starting a new AWS project from scratch and want a solid, secure network before placing any compute or database resources. Often used as the first step before other templates.',
            whatItDeploys: [
              'VPC (10.0.0.0/16) — your private cloud network',
              'Public Subnet — for resources that need to be internet-accessible (load balancers, bastion hosts)',
              'Private Subnet — for resources that should NOT be directly internet-accessible (databases, app servers)',
              'Internet Gateway — connects your public subnet to the internet',
              'NAT Gateway — lets private subnet resources call the internet (for updates, API calls) without being publicly reachable',
              'Route Table — controls routing rules for the public subnet',
            ],
            howItWorks: 'Public subnet → Internet Gateway → internet. Private subnet → NAT Gateway → internet (outbound only). Resources in the private subnet are unreachable from the internet but can still download packages or call external APIs.',
            estimatedCost: '~$30–$35/month (mostly NAT Gateway)',
          })}

          ${templateDoc({
            id: 'event-driven',
            name: 'Event-Driven Pipeline',
            badge: 'Decoupled',
            badgeColor: '#7c3aed',
            summary: 'Fan-out pattern: one event triggers multiple independent processing paths simultaneously. Built for systems where different teams or services need to react to the same event.',
            whoIsItFor: 'You need to process the same event in multiple ways — e.g. a new order should trigger both an inventory update AND an email notification, independently. Or you\'re building a microservices system where services must not depend on each other.',
            whatItDeploys: [
              'IAM Role — permissions for Lambda to access other services',
              'SNS Topic — receives events and broadcasts them to all subscribers simultaneously',
              'SQS Queue — buffers messages for reliable delivery to Lambda',
              '2× Lambda Functions — independent processors (orders processor + alerts processor)',
              'DynamoDB — stores processed results from both Lambda functions',
            ],
            howItWorks: 'An event is published to SNS → SNS fans it out to an SQS queue → Lambda picks up messages from the queue and processes them → results written to DynamoDB. The two Lambda functions run independently, so a failure in one doesn\'t affect the other.',
            estimatedCost: '~$0–$10/month at low volume (largely serverless)',
          })}

          ${templateDoc({
            id: 'data-pipeline',
            name: 'S3 Data Processing Pipeline',
            badge: 'Analytics',
            badgeColor: '#0891b2',
            summary: 'Automatically process files as soon as they\'re uploaded to S3 — the uploaded file triggers a Lambda function that processes it and stores results.',
            whoIsItFor: 'You receive files (CSV, JSON, images, logs) that need processing — e.g. parsing a CSV report, resizing an uploaded image, analyzing a log file, or ingesting sensor data. You want processing to start automatically the moment a file arrives.',
            whatItDeploys: [
              'S3 Bucket — where files are uploaded (raw data landing zone)',
              'SQS Queue — queues upload notifications for reliable Lambda delivery',
              'IAM Role — permissions for the processor Lambda',
              'Lambda Function (Python 3.9) — your file processing code runs here',
              'DynamoDB — stores processing results and metadata',
              'SNS Topic — sends notifications on completion (email, Slack, etc.)',
            ],
            howItWorks: 'File uploaded to S3 → S3 sends notification to SQS → Lambda polls SQS, picks up the notification → Lambda downloads and processes the file → writes results to DynamoDB → publishes completion notification to SNS.',
            estimatedCost: '~$1–$20/month depending on file volume',
          })}

          ${templateDoc({
            id: 'bastion',
            name: 'Secure Bastion Host',
            badge: 'Security',
            badgeColor: '#dc2626',
            summary: 'A secure "jump box" — the only way to SSH into your private application servers is through a dedicated bastion EC2 in a public subnet. Your app servers have no direct internet exposure.',
            whoIsItFor: 'You have EC2 servers running in a private subnet (no internet access) and you need to SSH into them for maintenance, debugging, or deployments. You don\'t want to expose those servers directly to the internet.',
            whatItDeploys: [
              'VPC with public + private subnets — network isolation',
              'Internet Gateway — internet access for the public subnet only',
              'Bastion Security Group — allows SSH (port 22) inbound from the internet',
              'Bastion EC2 (t2.micro) — the only SSH entry point, sits in public subnet',
              'App Server EC2 (t2.small) — your actual server, sits in private subnet, only accessible from the bastion',
            ],
            howItWorks: 'You SSH into the Bastion Host using its public IP. From the Bastion, you SSH into the private App Server using its private IP. The App Server has no public IP and no security group rule allowing internet SSH — it\'s only reachable from the Bastion.',
            estimatedCost: '~$15–$25/month',
          })}

          ${templateDoc({
            id: 'shared-storage',
            name: 'Shared File Storage Service',
            badge: 'Storage',
            badgeColor: '#0891b2',
            summary: 'Multiple EC2 servers share a single networked filesystem (EFS), so files written by one server are instantly visible to all others — plus S3 for backups and RDS for your database.',
            whoIsItFor: 'Your app runs on multiple servers and those servers need to share files — e.g. a CMS where uploaded images must be accessible from all web servers, or a legacy app that writes to disk and expects the files to persist.',
            whatItDeploys: [
              'VPC + Subnet + Security Group — isolated network',
              'Application Load Balancer — routes traffic across EC2 servers',
              'EC2 (t2.small) — your application server',
              'EFS (Elastic File System) — shared network drive mounted on all EC2 instances',
              'S3 Bucket — for file backups and static asset storage',
              'RDS MySQL — managed relational database',
            ],
            howItWorks: 'All EC2 instances mount the same EFS volume (like a shared network drive). When one server writes a file, all other servers see it immediately. S3 is used for backups and heavy static assets. RDS stores structured application data.',
            estimatedCost: '~$60–$110/month',
          })}

          ${templateDoc({
            id: 'queue-worker',
            name: 'Message Queue Worker',
            badge: 'Async Processing',
            badgeColor: '#d97706',
            summary: 'Reliable background job processing — tasks are placed into a queue and processed by Lambda workers, with DynamoDB tracking job state and SNS sending completion alerts.',
            whoIsItFor: 'You have work that shouldn\'t block the user — sending emails, resizing images, generating reports, calling slow third-party APIs, or any task that takes more than a second. Producers drop jobs into the queue and workers handle them asynchronously.',
            whatItDeploys: [
              'SQS Queue — the job queue; producers write here, Lambda reads from here',
              'IAM Role — permissions for the worker Lambda',
              'Lambda Function (Python 3.9) — your job processing logic',
              'DynamoDB — tracks job status (pending → running → complete)',
              'SNS Topic — sends alerts when jobs complete or fail',
            ],
            howItWorks: 'Your app (or any producer) sends a message to the SQS queue. Lambda is triggered by new messages, processes the job, writes the result to DynamoDB, and publishes a completion event to SNS. If Lambda fails, SQS automatically retries. Messages stay in the queue for up to 4 days.',
            estimatedCost: '~$0–$5/month at low volume (free tier eligible)',
          })}

          <div style="margin-top:48px;padding:20px 24px;background:var(--surface-100);border:1px solid var(--border);border-radius:10px;font-size:14px;color:var(--text-secondary);">
            <strong style="color:var(--text-primary);">Cost estimates</strong> are rough monthly ranges for typical low-to-medium usage in us-east-1. Actual costs depend on traffic, data transfer, storage, and instance uptime. All templates can be destroyed instantly from the Deployments page.
          </div>
        </div>
      </main>
    </div>
  `;
};

function templateDoc(opts: {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  summary: string;
  whoIsItFor: string;
  whatItDeploys: string[];
  howItWorks: string;
  estimatedCost: string;
}): string {
  return `
    <div id="doc-${opts.id}" style="margin-bottom:48px;border:1px solid var(--border);border-radius:12px;overflow:hidden;">
      <div style="padding:24px 28px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
        <h2 style="font-size:20px;font-weight:700;margin:0;flex:1;">${opts.name}</h2>
        <span style="padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;color:#fff;background:${opts.badgeColor};">${opts.badge}</span>
        <a href="/workflow" data-navigate="/workflow" data-template-id="${opts.id}" onclick="localStorage.setItem('pending_template', this.getAttribute('data-template-id'))" class="btn btn-primary" style="font-size:13px;padding:7px 16px;">Use Template →</a>
      </div>
      <div style="padding:24px 28px;display:grid;gap:20px;">
        <p style="margin:0;font-size:15px;line-height:1.6;">${opts.summary}</p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div style="background:var(--surface-100);border-radius:8px;padding:16px 18px;">
            <p style="font-weight:600;font-size:13px;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.04em;margin:0 0 8px;">Who is this for?</p>
            <p style="margin:0;font-size:14px;line-height:1.6;">${opts.whoIsItFor}</p>
          </div>
          <div style="background:var(--surface-100);border-radius:8px;padding:16px 18px;">
            <p style="font-weight:600;font-size:13px;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.04em;margin:0 0 8px;">How it works</p>
            <p style="margin:0;font-size:14px;line-height:1.6;">${opts.howItWorks}</p>
          </div>
        </div>

        <div style="background:var(--surface-100);border-radius:8px;padding:16px 18px;">
          <p style="font-weight:600;font-size:13px;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.04em;margin:0 0 10px;">What gets deployed</p>
          <ul style="margin:0;padding-left:18px;display:grid;grid-template-columns:1fr 1fr;gap:4px 20px;">
            ${opts.whatItDeploys.map(r => `<li style="font-size:14px;line-height:1.7;">${r}</li>`).join('')}
          </ul>
        </div>

        <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text-secondary);">
          <svg viewBox="0 0 24 24" fill="none" width="15" height="15" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Estimated cost: <strong style="color:var(--text-primary);">${opts.estimatedCost}</strong>
        </div>
      </div>
    </div>
  `;
}
