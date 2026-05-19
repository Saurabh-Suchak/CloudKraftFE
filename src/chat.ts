import { animate, stagger } from 'motion';
import { apiService } from './services/api';
import { router } from './router';

const WS_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8001')
  .replace(/^https/, 'wss')
  .replace(/^http/, 'ws');

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;


// ── Types ─────────────────────────────────────────────────────────────────────

interface Session {
  id: number;
  title: string | null;
  llm_provider: string;
  llm_model: string | null;
  created_at: string;
}

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}


// ── 21st.dev component helpers ────────────────────────────────────────────────

export function typingIndicatorHTML(): string {
  return `<span class="typing-indicator" aria-label="AI is typing" role="status">
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
  </span>`;
}

export function providerBadgeHTML(provider: string): string {
  const map: Record<string, { label: string; cls: string }> = {
    claude: { label: 'Claude', cls: 'provider-pill--claude' },
    openai: { label: 'GPT',    cls: 'provider-pill--openai' },
    gemini: { label: 'Gemini', cls: 'provider-pill--gemini' },
  };
  const { label, cls } = map[provider] ?? { label: esc(provider), cls: 'provider-pill--default' };
  return `<span class="provider-pill ${cls}">${label}</span>`;
}

function startTypingAnimation(): void {
  const dots = document.querySelectorAll<HTMLElement>('#chatStatus .typing-dot');
  if (!dots.length || reducedMotion()) return;
  animate(dots, { y: [0, -6, 0] }, { duration: 0.6, repeat: Infinity, delay: stagger(0.2), easing: 'ease-in-out' });
}


// ── ChatManager ───────────────────────────────────────────────────────────────

class ChatManager {
  private ws: WebSocket | null = null;
  private activeSessionId: number | null = null;
  private isStreaming = false;
  private pendingBubble: HTMLElement | null = null;
  private pendingBubbleText: HTMLElement | null = null;
  private activeSession: Session | null = null;


  // ── Session list ─────────────────────────────────────────────────────────────

  async loadSessions(): Promise<void> {
    const list = document.getElementById('chatSessionsList');
    if (!list) return;

    const { data, error } = await apiService.chatListSessions();

    const skeletons = list.querySelectorAll<HTMLElement>('.skeleton-session-item');
    if (skeletons.length && !reducedMotion()) {
      await animate(skeletons, { opacity: [1, 0] }, { duration: 0.15, easing: 'ease-in' }).finished;
    }

    if (error) {
      list.innerHTML = `<div class="chat-error">Failed to load: ${esc(error)}</div>`;
      return;
    }

    const sessions: Session[] = data || [];
    if (!sessions.length) {
      list.innerHTML = `<div class="chat-empty-hint">No conversations yet</div>`;
      return;
    }

    list.innerHTML = sessions
      .map(s => `
        <div class="chat-session-item ${s.id === this.activeSessionId ? 'active' : ''}"
             data-session-id="${s.id}">
          <div class="chat-session-title">${esc(s.title || 'New Conversation')}</div>
          <div class="chat-session-meta">
            ${providerBadgeHTML(s.llm_provider)}
          </div>
        </div>
      `)
      .join('');

    const items = list.querySelectorAll<HTMLElement>('.chat-session-item');
    if (items.length && !reducedMotion()) {
      animate(items, { opacity: [0, 1], x: [-12, 0] }, { duration: 0.25, delay: stagger(0.06), easing: 'ease-out' });
    }

    items.forEach(item => {
      item.addEventListener('click', () => {
        const id = parseInt(item.dataset.sessionId || '0', 10);
        if (id) this.openSession(id);
      });
    });
  }


  // ── Open session ──────────────────────────────────────────────────────────────

  async openSession(id: number): Promise<void> {
    this.closeWS();
    this.activeSessionId = id;
    showPanel('active');

    const { data, error } = await apiService.chatGetSession(id);
    if (error) { setStatus(`Error: ${error}`, true); return; }

    const { session, messages } = data as { session: Session; messages: Message[] };
    this.activeSession = session;

    el('chatTitle')!.textContent = session.title || 'Conversation';

    const badgeEl = el('chatProviderBadge')!;
    badgeEl.innerHTML = providerBadgeHTML(session.llm_provider);
    if (!reducedMotion()) {
      animate(badgeEl, { opacity: [0, 1], scale: [0.85, 1] }, { duration: 0.18, easing: 'ease-out' });
    }

    const box = el('chatMessages')!;
    box.innerHTML = '';
    messages.forEach(m => appendBubble(m.role, m.content));
    box.scrollTop = box.scrollHeight;

    this.connectWS(id);
    await this.loadSessions();
  }


  // ── WebSocket lifecycle ───────────────────────────────────────────────────────

  private connectWS(sessionId: number): void {
    const token = localStorage.getItem('auth_token');
    if (!token) { router.navigate('/login'); return; }

    const url = `${WS_BASE}/api/chat/ws/${sessionId}?token=${encodeURIComponent(token)}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      setStatus('Connected', false);
      (el('chatSendBtn') as HTMLButtonElement).disabled = false;
    };

    this.ws.onmessage = (evt) => {
      try { this.handleMsg(JSON.parse(evt.data)); } catch { /* malformed */ }
    };

    this.ws.onclose = (evt) => {
      const msg = evt.code === 4001 ? 'Auth error — please log in again'
                : evt.code === 4004 ? 'Session not found'
                : 'Disconnected';
      setStatus(msg, true);
      (el('chatSendBtn') as HTMLButtonElement).disabled = true;
      this.isStreaming = false;
    };

    this.ws.onerror = () => setStatus('Connection error', true);
  }

  private handleMsg(msg: { type: string; content?: string; detail?: string }): void {
    if (msg.type === 'token') {
      if (!this.pendingBubble) {
        this.pendingBubble = appendBubble('assistant', '');
        this.pendingBubbleText = this.pendingBubble.querySelector('.chat-bubble-text');
      }
      this.pendingBubbleText!.textContent += msg.content ?? '';
      const box = el('chatMessages')!;
      box.scrollTop = box.scrollHeight;

    } else if (msg.type === 'done') {
      this.pendingBubble = null;
      this.pendingBubbleText = null;
      this.isStreaming = false;
      (el('chatSendBtn') as HTMLButtonElement).disabled = false;
      const statusEl = el('chatStatus');
      if (statusEl) statusEl.innerHTML = '';
      this.loadSessions();

    } else if (msg.type === 'error') {
      setStatus(`Error: ${msg.detail}`, true);
      this.isStreaming = false;
      this.pendingBubble = null;
      this.pendingBubbleText = null;
      (el('chatSendBtn') as HTMLButtonElement).disabled = false;
    }
  }

  private closeWS(): void {
    this.ws?.close();
    this.ws = null;
    this.pendingBubble = null;
    this.isStreaming = false;
  }


  // ── Send ──────────────────────────────────────────────────────────────────────

  send(text: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || this.isStreaming || !text.trim()) return;
    appendBubble('user', text);
    const box = el('chatMessages')!;
    box.scrollTop = box.scrollHeight;
    this.isStreaming = true;
    (el('chatSendBtn') as HTMLButtonElement).disabled = true;

    const statusEl = el('chatStatus');
    if (statusEl) {
      statusEl.innerHTML = typingIndicatorHTML();
      startTypingAnimation();
    }

    this.ws.send(JSON.stringify({
      message: text,
      llm_provider: this.activeSession?.llm_provider,
      llm_model:    this.activeSession?.llm_model ?? undefined,
    }));
  }


  // ── Create / delete session ───────────────────────────────────────────────────

  async createSession(provider: string, model: string): Promise<void> {
    const { data, error } = await apiService.chatCreateSession(provider, model || undefined);
    if (error) { alert(`Failed: ${error}`); return; }
    await this.openSession((data as Session).id);
  }

  async deleteActive(): Promise<void> {
    if (!this.activeSessionId) return;
    if (!confirm('Delete this conversation? This cannot be undone.')) return;
    const { error } = await apiService.chatDeleteSession(this.activeSessionId);
    if (error) { alert(`Delete failed: ${error}`); return; }
    this.closeWS();
    this.activeSessionId = null;
    showPanel('empty');
    await this.loadSessions();
  }

  destroy(): void { this.closeWS(); }
}


// ── Init ──────────────────────────────────────────────────────────────────────

let _mgr: ChatManager | null = null;

export function initChat(): void {
  _mgr?.destroy();
  _mgr = new ChatManager();
  const mgr = _mgr;

  el('newChatBtn')?.addEventListener('click', () => showPanel('new-session'));
  el('newChatBtnEmpty')?.addEventListener('click', () => showPanel('new-session'));
  el('cancelNewSessionBtn')?.addEventListener('click', () => showPanel('empty'));

  el('createSessionBtn')?.addEventListener('click', async () => {
    const provider = (el('llmProviderSelect') as HTMLSelectElement).value;
    const model    = (el('llmModelInput') as HTMLInputElement).value.trim();
    await mgr.createSession(provider, model);
  });

  el('deleteSessionBtn')?.addEventListener('click', () => mgr.deleteActive());

  el('chatSendBtn')?.addEventListener('click', () => {
    const ta = el('chatInput') as HTMLTextAreaElement;
    const text = ta.value.trim();
    if (text) { ta.value = ''; resetTA(ta); mgr.send(text); }
  });

  el('chatInput')?.addEventListener('keydown', (e: Event) => {
    const ke = e as KeyboardEvent;
    if (ke.key === 'Enter' && !ke.shiftKey) {
      ke.preventDefault();
      const ta = ke.target as HTMLTextAreaElement;
      const text = ta.value.trim();
      if (text) { ta.value = ''; resetTA(ta); mgr.send(text); }
    }
  });

  el('chatInput')?.addEventListener('input', (e: Event) => {
    const ta = e.target as HTMLTextAreaElement;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
  });

  mgr.loadSessions();
}


// ── DOM helpers ───────────────────────────────────────────────────────────────

function el(id: string): HTMLElement | null {
  return document.getElementById(id);
}

function showPanel(which: 'empty' | 'new-session' | 'active'): void {
  const map: Record<string, string> = {
    empty:          'chatEmptyState',
    'new-session':  'chatNewSessionForm',
    active:         'chatActive',
  };
  ['chatEmptyState', 'chatNewSessionForm', 'chatActive'].forEach(id => {
    const node = el(id);
    if (!node) return;
    node.style.display = id === map[which] ? '' : 'none';
  });

  if (!reducedMotion()) {
    if (which === 'new-session') {
      const form = el('chatNewSessionForm');
      if (form) animate(form, { opacity: [0, 1], y: [10, 0] }, { duration: 0.18, easing: 'ease-out' });
    }
    if (which === 'active') {
      const active = el('chatActive');
      if (active) animate(active, { opacity: [0, 1], scale: [0.98, 1] }, { duration: 0.2, easing: 'ease-out' });
    }
  }
}

function appendBubble(role: 'user' | 'assistant', content: string): HTMLElement {
  const box = el('chatMessages')!;
  const div = document.createElement('div');
  div.className = `chat-bubble chat-bubble-${role}`;
  div.innerHTML = `
    <div class="chat-bubble-avatar">${role === 'user' ? 'You' : 'AI'}</div>
    <div class="chat-bubble-body">
      <div class="chat-bubble-text">${esc(content)}</div>
    </div>`;
  box.appendChild(div);

  if (!reducedMotion()) {
    animate(div, { opacity: [0, 1], y: [8, 0] }, { duration: 0.2, easing: 'ease-out' });
  }

  return div;
}

function setStatus(msg: string, isError: boolean): void {
  const node = el('chatStatus');
  if (!node) return;
  node.innerHTML = '';
  node.textContent = msg;
  node.style.color = isError ? 'var(--error)' : 'var(--text-secondary)';
}

export function esc(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function resetTA(ta: HTMLTextAreaElement): void {
  ta.style.height = 'auto';
}
