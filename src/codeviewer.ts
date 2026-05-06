// Code Viewer functionality — Monaco Editor + validation + cost estimate
import { apiService } from './services/api';
import loader from '@monaco-editor/loader';

interface TerraformFile {
  filename: string;
  content: string;
}

// Files in the order we want tabs to appear
const FILE_ORDER = ['versions.tf', 'variables.tf', 'main.tf', 'outputs.tf', 'terraform.tfvars'];

let currentFiles: TerraformFile[] = [];
let activeFile = 'main.tf';
let monacoEditor: any = null;   // Monaco IStandaloneCodeEditor instance
let monacoInstance: any = null; // Monaco API (languages, editor namespace)
let isValidating = false;

// ------------------------------------------------------------------
// HCL language definition for Monaco
// ------------------------------------------------------------------
function registerHclLanguage(monaco: any): void {
  if (monaco.languages.getLanguages().some((l: any) => l.id === 'hcl')) return;

  monaco.languages.register({ id: 'hcl' });

  monaco.languages.setMonarchTokensProvider('hcl', {
    keywords: [
      'resource', 'variable', 'output', 'provider', 'terraform',
      'data', 'module', 'locals', 'true', 'false', 'null', 'for_each',
      'count', 'depends_on', 'lifecycle', 'dynamic',
    ],
    tokenizer: {
      root: [
        // Line comments
        [/#.*$/, 'comment'],
        // Block comments
        [/\/\*/, 'comment', '@blockComment'],
        // Heredoc
        [/<<-?\w+/, 'string'],
        // Strings
        [/"/, 'string', '@string'],
        // Numbers
        [/\b\d+(\.\d+)?\b/, 'number'],
        // Keywords
        [/\b(resource|variable|output|provider|terraform|data|module|locals|true|false|null|for_each|count|depends_on|lifecycle|dynamic)\b/, 'keyword'],
        // Built-in functions
        [/\b(jsonencode|jsondecode|toset|tolist|tomap|lookup|merge|concat|length|format|trimspace|file|templatefile)\b/, 'predefined'],
        // Resource references like aws_vpc.main.id
        [/[a-z_][a-z0-9_]*\.[a-z_][a-z0-9_]*\.[a-z_][a-z0-9_]*/, 'variable.name'],
        // Attribute names (before =)
        [/[a-z_][a-z0-9_-]*(?=\s*=)/, 'attribute.name'],
        // Block labels
        [/[a-z_][a-z0-9_]*/, 'identifier'],
        // Delimiters
        [/[{}[\]()]/, 'delimiter'],
        // Operators
        [/[=<>!?:+\-*\/]/, 'operator'],
      ],
      string: [
        [/\$\{/, 'string.escape', '@interpolation'],
        [/[^"$\\]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"/, 'string', '@pop'],
      ],
      interpolation: [
        [/\}/, 'string.escape', '@pop'],
        { include: 'root' },
      ],
      blockComment: [
        [/\*\//, 'comment', '@pop'],
        [/./, 'comment'],
      ],
    },
  });

  monaco.languages.setLanguageConfiguration('hcl', {
    comments: { lineComment: '#', blockComment: ['/*', '*/'] },
    brackets: [['{', '}'], ['[', ']'], ['(', ')']],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
    ],
    indentationRules: {
      increaseIndentPattern: /^.*\{[^}]*$/,
      decreaseIndentPattern: /^\s*\}/,
    },
  });

  // Dark theme matching CloudKraft's dark UI
  monaco.editor.defineTheme('cloudkraft-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword',        foreground: 'c792ea', fontStyle: 'bold' },
      { token: 'string',         foreground: 'c3e88d' },
      { token: 'string.escape',  foreground: 'f78c6c' },
      { token: 'comment',        foreground: '546e7a', fontStyle: 'italic' },
      { token: 'number',         foreground: 'f78c6c' },
      { token: 'variable.name',  foreground: '82aaff' },
      { token: 'attribute.name', foreground: 'b2ccd6' },
      { token: 'predefined',     foreground: '89ddff' },
      { token: 'operator',       foreground: '89ddff' },
      { token: 'delimiter',      foreground: 'a6accd' },
      { token: 'identifier',     foreground: 'eeffff' },
    ],
    colors: {
      'editor.background':           '#0f172a',
      'editor.foreground':           '#e2e8f0',
      'editorLineNumber.foreground': '#334155',
      'editorLineNumber.activeForeground': '#64748b',
      'editor.selectionBackground':  '#1e3a5f',
      'editor.lineHighlightBackground': '#1e293b',
      'editorCursor.foreground':     '#7c3aed',
      'editorIndentGuide.background1': '#1e293b',
      'editorWidget.background':     '#1e293b',
      'editorSuggestWidget.background': '#1e293b',
      'editorSuggestWidget.border':  '#334155',
    },
  });
}

// ------------------------------------------------------------------
// Initialise Monaco editor (runs once per page load)
// ------------------------------------------------------------------
async function initMonaco(): Promise<void> {
  const container = document.getElementById('monacoEditorContainer');
  if (!container) return;

  if (monacoEditor) {
    // Editor already exists — just resize it (container may have changed)
    monacoEditor.layout();
    return;
  }

  const monaco = await loader.init();
  monacoInstance = monaco;

  registerHclLanguage(monaco);

  monacoEditor = monaco.editor.create(container, {
    value: '',
    language: 'hcl',
    theme: 'cloudkraft-dark',
    readOnly: true,
    fontSize: 13,
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontLigatures: true,
    lineNumbers: 'on',
    minimap: { enabled: true, scale: 1 },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: 'off',
    renderWhitespace: 'selection',
    smoothScrolling: true,
    cursorBlinking: 'smooth',
    renderLineHighlight: 'line',
    scrollbar: {
      verticalScrollbarSize: 6,
      horizontalScrollbarSize: 6,
    },
  });
}

// ------------------------------------------------------------------
// Public entry point
// ------------------------------------------------------------------
export function initCodeViewer(): void {
  // Reset state — module-level variables persist across SPA navigations
  currentFiles = [];
  activeFile = 'main.tf';
  isValidating = false;
  monacoEditor = null;  // will be re-created for this page instance

  // Load generated files from localStorage
  const filesJson = localStorage.getItem('generated_terraform_files');
  const legacyCode = localStorage.getItem('generated_terraform');

  if (filesJson) {
    try {
      const parsed: TerraformFile[] = JSON.parse(filesJson);
      currentFiles = FILE_ORDER
        .map(name => parsed.find(f => f.filename === name))
        .filter((f): f is TerraformFile => !!f);
      parsed.forEach(f => {
        if (!FILE_ORDER.includes(f.filename)) currentFiles.push(f);
      });
    } catch {
      currentFiles = legacyCode ? [{ filename: 'main.tf', content: legacyCode }] : [];
    }
  } else if (legacyCode) {
    currentFiles = [{ filename: 'main.tf', content: legacyCode }];
  }

  if (currentFiles.length === 0) return;

  activeFile = currentFiles.find(f => f.filename === 'main.tf')?.filename
    ?? currentFiles[0].filename;

  renderTabs();

  // Init Monaco then show the active file
  initMonaco().then(() => {
    showFile(activeFile);

    // Validate on load
    const combinedForValidation = currentFiles
      .filter(f => ['versions.tf', 'variables.tf', 'main.tf'].includes(f.filename))
      .map(f => f.content)
      .join('\n');
    if (combinedForValidation.trim()) validateAndDisplayResults(combinedForValidation, currentFiles);
  });

  setupExportButton();
  setupValidateButton();
  setupDeployButton();
  setupBackButton();
  loadCostEstimate();
}

// ------------------------------------------------------------------
// Tab rendering & switching
// ------------------------------------------------------------------
function renderTabs(): void {
  const tabsContainer = document.getElementById('fileTabs');
  if (!tabsContainer) return;

  tabsContainer.innerHTML = currentFiles
    .map(f => `
      <button
        class="file-tab${f.filename === activeFile ? ' active' : ''}"
        data-file="${f.filename}"
      >${f.filename}</button>
    `)
    .join('');

  tabsContainer.querySelectorAll<HTMLButtonElement>('.file-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFile = btn.dataset.file!;
      renderTabs();
      showFile(activeFile);
    });
  });
}

function showFile(filename: string): void {
  const file = currentFiles.find(f => f.filename === filename);
  if (!file) return;

  if (monacoEditor && monacoInstance) {
    // Determine language from file extension
    const lang = filename.endsWith('.tfvars') ? 'hcl'
      : filename.endsWith('.tf') ? 'hcl'
      : filename.endsWith('.json') ? 'json'
      : 'plaintext';

    const currentModel = monacoEditor.getModel();
    if (currentModel) {
      monacoInstance.editor.setModelLanguage(currentModel, lang);
    }
    monacoEditor.setValue(file.content);
    monacoEditor.setScrollPosition({ scrollTop: 0 });
  }
}

// ------------------------------------------------------------------
// Export
// ------------------------------------------------------------------
function setupExportButton(): void {
  const exportBtn = document.getElementById('exportBtn');
  if (!exportBtn) return;
  const newBtn = exportBtn.cloneNode(true) as HTMLButtonElement;
  exportBtn.parentNode?.replaceChild(newBtn, exportBtn);

  newBtn.addEventListener('click', () => {
    currentFiles.forEach(file => {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      a.click();
      URL.revokeObjectURL(url);
    });
  });
}

// ------------------------------------------------------------------
// Validation
// ------------------------------------------------------------------
function setupValidateButton(): void {
  const validateBtn = document.querySelector('.code-viewer-header .btn-outline');
  if (!validateBtn) return;
  const newBtn = validateBtn.cloneNode(true) as HTMLButtonElement;
  validateBtn.parentNode?.replaceChild(newBtn, validateBtn);

  newBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const combined = currentFiles
      .filter(f => ['versions.tf', 'variables.tf', 'main.tf'].includes(f.filename))
      .map(f => f.content)
      .join('\n');
    if (combined.trim()) await validateAndDisplayResults(combined, currentFiles);
  });
}

function setupBackButton(): void {
  const btn = document.getElementById('backToDesignerBtn');
  if (!btn) return;
  const fresh = btn.cloneNode(true) as HTMLButtonElement;
  btn.replaceWith(fresh);
  fresh.addEventListener('click', async () => {
    const { router } = await import('./router');
    router.navigate('/workflow');
  });
}

function setupDeployButton(): void {
  const btn = document.getElementById('codeViewerDeployBtn');
  if (!btn) return;
  const fresh = btn.cloneNode(true) as HTMLButtonElement;
  btn.replaceWith(fresh);
  fresh.addEventListener('click', async () => {
    const { router } = await import('./router');
    router.navigate('/deployment');
  });
}

// ------------------------------------------------------------------
// Cost estimate
// ------------------------------------------------------------------
const RESOURCE_ICONS: Record<string, string> = {
  aws_instance:                 '🖥️',
  aws_lambda_function:          '⚡',
  aws_autoscaling_group:        '📈',
  aws_vpc:                      '🌐',
  aws_subnet:                   '🔲',
  aws_security_group:           '🛡️',
  aws_internet_gateway:         '🚪',
  aws_route_table:              '🗺️',
  aws_nat_gateway:              '🔀',
  aws_lb:                       '⚖️',
  aws_s3_bucket:                '🪣',
  aws_efs_file_system:          '📁',
  aws_ebs_volume:               '💾',
  aws_db_instance:              '🗄️',
  aws_dynamodb_table:           '⚡',
  aws_sns_topic:                '📣',
  aws_sqs_queue:                '📬',
  aws_iam_role:                 '🔑',
  aws_cloudfront_distribution:  '🌍',
};

async function loadCostEstimate(): Promise<void> {
  const panel = document.getElementById('costEstimatePanel');
  if (!panel) return;

  panel.innerHTML = `
    <div class="cost-skeleton">
      <div class="cost-skeleton-bar" style="width:100%"></div>
      <div class="cost-skeleton-bar" style="width:80%"></div>
      <div class="cost-skeleton-bar" style="width:90%"></div>
    </div>`;

  const canvasJson = localStorage.getItem('canvas_state');
  if (!canvasJson) {
    panel.innerHTML = '<div class="cost-empty">No workflow data — generate code first.</div>';
    return;
  }

  try {
    const workflow = JSON.parse(canvasJson);
    const result = await apiService.estimateCost(workflow);
    if (result.error || !result.data) {
      panel.innerHTML = '<div class="cost-empty">Estimate unavailable.</div>';
      return;
    }

    const { total_monthly_low, total_monthly_high, line_items, disclaimer } = result.data;
    const totalIsFree = total_monthly_low === 0 && total_monthly_high === 0;

    const rows = line_items.map(item => {
      const isFree = item.monthly_usd_low === 0 && item.monthly_usd_high === 0;
      const icon = RESOURCE_ICONS[item.resource_type] || '☁️';
      const costBadge = isFree
        ? `<span class="cost-badge cost-badge-free">Free</span>`
        : `<span class="cost-badge cost-badge-paid">$${item.monthly_usd_low.toFixed(0)}–$${item.monthly_usd_high.toFixed(0)}<span class="cost-per-mo">/mo</span></span>`;
      return `
        <div class="cost-row" title="${item.notes}">
          <div class="cost-row-icon">${icon}</div>
          <div class="cost-row-info">
            <span class="cost-row-name">${item.resource}</span>
            <span class="cost-row-type">${item.resource_type}</span>
          </div>
          ${costBadge}
        </div>`;
    }).join('');

    panel.innerHTML = `
      <div class="cost-header-card">
        <div class="cost-header-label">
          <svg viewBox="0 0 24 24" fill="none" width="14" height="14" style="margin-right:4px;vertical-align:-1px">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/>
          </svg>
          Est. Monthly Cost
        </div>
        <div class="cost-header-amount ${totalIsFree ? 'cost-header-free' : ''}">
          ${totalIsFree
            ? 'Free'
            : `$${total_monthly_low.toFixed(0)}<span class="cost-header-high">–$${total_monthly_high.toFixed(0)}</span>`
          }
        </div>
        <div class="cost-header-sub">${line_items.length} resource${line_items.length !== 1 ? 's' : ''} · us-east-1 on-demand</div>
      </div>
      <div class="cost-rows">${rows}</div>
      <div class="cost-footer">
        <svg viewBox="0 0 24 24" fill="none" width="11" height="11" style="flex-shrink:0;margin-top:1px">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="currentColor"/>
        </svg>
        ${disclaimer}
      </div>`;
  } catch {
    panel.innerHTML = '<div class="cost-empty">Estimate unavailable.</div>';
  }
}

// ------------------------------------------------------------------
// Validation results
// ------------------------------------------------------------------
async function validateAndDisplayResults(
  terraformCode: string,
  files?: TerraformFile[],
): Promise<void> {
  if (isValidating) return;
  if (!terraformCode?.trim()) return;

  isValidating = true;

  const validationListEl = document.querySelector('.validation-list');
  if (validationListEl) {
    validationListEl.innerHTML = `
      <div class="validation-item" style="justify-content:center;gap:0.5rem">
        <span class="validate-spinner"></span>
        <span style="color:var(--text-secondary);font-size:0.85rem">Running validation…</span>
      </div>`;
  }

  try {
    const result = await apiService.validateCode(terraformCode, files);
    if (result.error) {
      if (validationListEl) {
        validationListEl.innerHTML = `<div class="validation-item error" style="padding:0.75rem">
          <div class="validation-content"><div class="validation-message">${result.error}</div></div>
        </div>`;
      }
      return;
    }

    if (result.data) {
      const { valid, errors, warnings, method, validator_version } = result.data;

      const methodBadge = method === 'terraform'
        ? `<span class="validator-badge validator-badge-real">✓ Terraform${validator_version ? ` v${validator_version}` : ''}</span>`
        : `<span class="validator-badge validator-badge-static">⚠ Static analysis</span>`;

      const summary = document.querySelector('.validation-summary');
      if (summary) {
        summary.innerHTML = `
          ${errors.length} Error${errors.length !== 1 ? 's' : ''} Found,
          ${warnings.length} Warning${warnings.length !== 1 ? 's' : ''}
          <span class="validation-status">
            Validation ${valid ? 'Successful' : 'Failed'}
            (${errors.length + warnings.length} Total Issues)
          </span>
          ${methodBadge}
        `;
      }

      const validationList = document.querySelector('.validation-list');
      if (!validationList) return;

      let html = '';
      if (valid && errors.length === 0 && warnings.length === 0) {
        html = `
          <div class="validation-item success">
            <svg class="validation-icon success" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="validation-content">
              <div class="validation-title">All Checks Passed</div>
              <div class="validation-message">Your Terraform configuration is valid.</div>
            </div>
          </div>`;
      }

      errors.forEach(error => {
        html += `
          <div class="validation-item error">
            <svg class="validation-icon error" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <div class="validation-content">
              <div class="validation-title">${error.type.charAt(0).toUpperCase() + error.type.slice(1)} Error</div>
              <div class="validation-message">
                ${error.message}
                ${error.resource ? ` <span class="resource-badge">${error.resource}</span>` : ''}
                ${error.line ? ` — Line ${error.line}` : ''}
              </div>
            </div>
          </div>`;
      });

      warnings.forEach(warning => {
        html += `
          <div class="validation-item warning">
            <svg class="validation-icon warning" viewBox="0 0 24 24" fill="none">
              <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <div class="validation-content">
              <div class="validation-title">${warning.type.charAt(0).toUpperCase() + warning.type.slice(1)} Warning</div>
              <div class="validation-message">
                ${warning.message}
                ${warning.resource ? ` <span class="resource-badge">${warning.resource}</span>` : ''}
                ${warning.line ? ` — Line ${warning.line}` : ''}
              </div>
            </div>
          </div>`;
      });

      validationList.innerHTML = html;
    }
  } catch (error) {
    console.error('Error validating code:', error);
  } finally {
    isValidating = false;
  }
}
