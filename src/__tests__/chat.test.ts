import { describe, it, expect, vi, beforeEach } from 'vitest';
import { animate } from 'motion';
import { initChat, typingIndicatorHTML } from '../chat';
import { apiService } from '../services/api';

// ── MockWebSocket ─────────────────────────────────────────────────────────────

class MockWebSocket {
  static instances: MockWebSocket[] = [];
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;
  readyState = 0; // CONNECTING
  url: string;
  onopen:    ((e: Event) => void) | null = null;
  onmessage: ((e: MessageEvent) => void) | null = null;
  onclose:   ((e: CloseEvent) => void) | null = null;
  onerror:   ((e: Event) => void) | null = null;
  send  = vi.fn();
  close = vi.fn(() => { this.readyState = 3; });

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }

  open()              { this.readyState = 1; this.onopen?.(new Event('open')); }
  msg(d: object)      { this.onmessage?.(new MessageEvent('message', { data: JSON.stringify(d) })); }
  closeWith(code = 1000) { this.readyState = 3; this.onclose?.(new CloseEvent('close', { code })); }
  err()               { this.onerror?.(new Event('error')); }
}

// ── Minimal Chat page HTML ────────────────────────────────────────────────────

function renderChatPage() {
  document.body.innerHTML = `
    <div id="chatSessionsList">
      <div class="skeleton-session-item" aria-hidden="true">
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line skeleton-line--meta"></div>
      </div>
      <div class="skeleton-session-item" aria-hidden="true">
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line skeleton-line--meta"></div>
      </div>
      <div class="skeleton-session-item" aria-hidden="true">
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line skeleton-line--meta"></div>
      </div>
    </div>
    <button id="newChatBtn">+ New</button>
    <button id="newChatBtnEmpty">Start Chatting</button>

    <div id="chatEmptyState"></div>
    <div id="chatNewSessionForm" style="display:none">
      <select id="llmProviderSelect">
        <option value="claude">Claude</option>
        <option value="openai">GPT</option>
        <option value="gemini">Gemini</option>
      </select>
      <input id="llmModelInput" type="text" value="" />
      <button id="createSessionBtn">Create</button>
      <button id="cancelNewSessionBtn">Cancel</button>
    </div>

    <div id="chatActive" style="display:none">
      <span id="chatTitle"></span>
      <span id="chatProviderBadge"></span>
      <button id="deleteSessionBtn">Delete</button>
      <div id="chatMessages"></div>
      <textarea id="chatInput"></textarea>
      <button id="chatSendBtn" disabled></button>
      <div id="chatStatus"></div>
    </div>
  `;
}

// ── Shared setup ──────────────────────────────────────────────────────────────

const SESSION_1 = { id: 1, title: 'First chat', llm_provider: 'claude', llm_model: null, created_at: '' };
const SESSION_2 = { id: 2, title: 'Second chat', llm_provider: 'openai', llm_model: 'gpt-4o', created_at: '' };

beforeEach(() => {
  MockWebSocket.instances = [];
  vi.stubGlobal('WebSocket', MockWebSocket);
  localStorage.setItem('auth_token', 'test-token');
  renderChatPage();
});

// ── Skeleton (SK1–SK5) ────────────────────────────────────────────────────────

describe('Shimmer skeleton', () => {
  it('SK1: skeleton rows present before loadSessions resolves', () => {
    vi.spyOn(apiService, 'chatListSessions').mockReturnValue(new Promise(() => {})); // never resolves
    initChat();
    expect(document.querySelectorAll('.skeleton-session-item')).toHaveLength(3);
  });

  it('SK2: skeleton replaced by real session items after resolve', async () => {
    vi.spyOn(apiService, 'chatListSessions').mockResolvedValue({ data: [SESSION_1, SESSION_2] });
    initChat();
    await vi.waitFor(() => {
      expect(document.querySelectorAll('.chat-session-item').length).toBe(2);
    });
    expect(document.querySelectorAll('.skeleton-session-item')).toHaveLength(0);
  });

  it('SK3: skeleton replaced by empty hint for empty array', async () => {
    vi.spyOn(apiService, 'chatListSessions').mockResolvedValue({ data: [] });
    initChat();
    await vi.waitFor(() => {
      expect(document.querySelector('.chat-empty-hint')).not.toBeNull();
    });
    expect(document.querySelectorAll('.skeleton-session-item')).toHaveLength(0);
  });

  it('SK4: skeleton replaced by error message on API error', async () => {
    vi.spyOn(apiService, 'chatListSessions').mockResolvedValue({ error: 'Server error' });
    initChat();
    await vi.waitFor(() => {
      expect(document.querySelector('.chat-error')).not.toBeNull();
    });
  });

  it('SK5: animate not called when prefers-reduced-motion is set', async () => {
    vi.mocked(window.matchMedia).mockReturnValue({ matches: true } as MediaQueryList);
    vi.spyOn(apiService, 'chatListSessions').mockResolvedValue({ data: [SESSION_1] });
    initChat();
    await vi.waitFor(() => expect(document.querySelectorAll('.chat-session-item').length).toBe(1));
    expect(animate).not.toHaveBeenCalled();
  });
});

// ── Session List (SL1–SL5) ────────────────────────────────────────────────────

describe('Session list', () => {
  it('SL1: renders correct number of session items', async () => {
    vi.spyOn(apiService, 'chatListSessions').mockResolvedValue({ data: [SESSION_1, SESSION_2] });
    initChat();
    await vi.waitFor(() => expect(document.querySelectorAll('.chat-session-item').length).toBe(2));
  });

  it('SL2: provider badge HTML present inside each item', async () => {
    vi.spyOn(apiService, 'chatListSessions').mockResolvedValue({ data: [SESSION_1] });
    initChat();
    await vi.waitFor(() => expect(document.querySelector('.chat-session-item')).not.toBeNull());
    expect(document.querySelector('.provider-pill')).not.toBeNull();
  });

  it('SL3: clicking a session item calls chatGetSession with correct id', async () => {
    vi.spyOn(apiService, 'chatListSessions').mockResolvedValue({ data: [SESSION_1] });
    const getSpy = vi.spyOn(apiService, 'chatGetSession').mockResolvedValue({
      data: { session: SESSION_1, messages: [] },
    });
    initChat();
    await vi.waitFor(() => expect(document.querySelector('.chat-session-item')).not.toBeNull());
    (document.querySelector('.chat-session-item') as HTMLElement).click();
    await vi.waitFor(() => expect(getSpy).toHaveBeenCalledWith(SESSION_1.id));
  });

  it('SL4: session item has data-session-id attribute', async () => {
    vi.spyOn(apiService, 'chatListSessions').mockResolvedValue({ data: [SESSION_1] });
    initChat();
    await vi.waitFor(() => expect(document.querySelector('[data-session-id]')).not.toBeNull());
    expect(document.querySelector('[data-session-id="1"]')).not.toBeNull();
  });

  it('SL5: session items have chat-session-title with text', async () => {
    vi.spyOn(apiService, 'chatListSessions').mockResolvedValue({ data: [SESSION_1] });
    initChat();
    await vi.waitFor(() => expect(document.querySelector('.chat-session-title')).not.toBeNull());
    expect(document.querySelector('.chat-session-title')?.textContent).toContain('First chat');
  });
});

// ── Session Creation (CR1–CR7) ────────────────────────────────────────────────

describe('Session creation', () => {
  beforeEach(() => {
    vi.spyOn(apiService, 'chatListSessions').mockResolvedValue({ data: [] });
  });

  it('CR1: clicking #newChatBtn shows #chatNewSessionForm', () => {
    initChat();
    (document.getElementById('newChatBtn') as HTMLElement).click();
    expect(document.getElementById('chatNewSessionForm')!.style.display).not.toBe('none');
  });

  it('CR2: clicking #cancelNewSessionBtn hides the form and shows empty state', () => {
    initChat();
    (document.getElementById('newChatBtn') as HTMLElement).click();
    (document.getElementById('cancelNewSessionBtn') as HTMLElement).click();
    expect(document.getElementById('chatNewSessionForm')!.style.display).toBe('none');
    expect(document.getElementById('chatEmptyState')!.style.display).not.toBe('none');
  });

  it('CR3: clicking Create calls chatCreateSession with selected provider', async () => {
    const createSpy = vi.spyOn(apiService, 'chatCreateSession').mockResolvedValue({ data: SESSION_1 });
    vi.spyOn(apiService, 'chatGetSession').mockResolvedValue({ data: { session: SESSION_1, messages: [] } });
    initChat();
    (document.getElementById('newChatBtn') as HTMLElement).click();
    (document.getElementById('llmProviderSelect') as HTMLSelectElement).value = 'openai';
    (document.getElementById('createSessionBtn') as HTMLElement).click();
    await vi.waitFor(() => expect(createSpy).toHaveBeenCalledWith('openai', undefined));
  });

  it('CR4: empty model input sends empty string (no model)', async () => {
    const createSpy = vi.spyOn(apiService, 'chatCreateSession').mockResolvedValue({ data: SESSION_1 });
    vi.spyOn(apiService, 'chatGetSession').mockResolvedValue({ data: { session: SESSION_1, messages: [] } });
    initChat();
    (document.getElementById('newChatBtn') as HTMLElement).click();
    (document.getElementById('llmModelInput') as HTMLInputElement).value = '';
    (document.getElementById('createSessionBtn') as HTMLElement).click();
    await vi.waitFor(() => expect(createSpy).toHaveBeenCalled());
    expect(createSpy.mock.calls[0][1]).toBeUndefined();
  });

  it('CR5: model input value is forwarded to chatCreateSession', async () => {
    const createSpy = vi.spyOn(apiService, 'chatCreateSession').mockResolvedValue({ data: SESSION_1 });
    vi.spyOn(apiService, 'chatGetSession').mockResolvedValue({ data: { session: SESSION_1, messages: [] } });
    initChat();
    (document.getElementById('newChatBtn') as HTMLElement).click();
    (document.getElementById('llmModelInput') as HTMLInputElement).value = 'gpt-4o-mini';
    (document.getElementById('createSessionBtn') as HTMLElement).click();
    await vi.waitFor(() => expect(createSpy).toHaveBeenCalledWith(expect.any(String), 'gpt-4o-mini'));
  });

  it('CR6: on success, session list reloads and active panel opens', async () => {
    vi.spyOn(apiService, 'chatCreateSession').mockResolvedValue({ data: SESSION_1 });
    vi.spyOn(apiService, 'chatGetSession').mockResolvedValue({ data: { session: SESSION_1, messages: [] } });
    initChat();
    (document.getElementById('newChatBtn') as HTMLElement).click();
    (document.getElementById('createSessionBtn') as HTMLElement).click();
    await vi.waitFor(() => {
      expect(document.getElementById('chatActive')!.style.display).not.toBe('none');
    });
  });

  it('CR7: on API error, alert is shown', async () => {
    vi.spyOn(apiService, 'chatCreateSession').mockResolvedValue({ error: 'Bad request' });
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    initChat();
    (document.getElementById('newChatBtn') as HTMLElement).click();
    (document.getElementById('createSessionBtn') as HTMLElement).click();
    await vi.waitFor(() => expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Bad request')));
  });
});

// ── WebSocket Lifecycle (WS1–WS8) ─────────────────────────────────────────────

describe('WebSocket lifecycle', () => {
  beforeEach(() => {
    vi.spyOn(apiService, 'chatListSessions').mockResolvedValue({ data: [SESSION_1] });
    vi.spyOn(apiService, 'chatGetSession').mockResolvedValue({ data: { session: SESSION_1, messages: [] } });
  });

  async function openSession() {
    initChat();
    await vi.waitFor(() => expect(document.querySelector('.chat-session-item')).not.toBeNull());
    (document.querySelector('.chat-session-item') as HTMLElement).click();
    await vi.waitFor(() => expect(MockWebSocket.instances.length).toBe(1));
    return MockWebSocket.instances[0];
  }

  it('WS1: WS URL contains session id and auth token', async () => {
    const ws = await openSession();
    expect(ws.url).toContain('/api/chat/ws/1');
    expect(ws.url).toContain('token=test-token');
  });

  it('WS2: onopen enables send button and sets Connected status', async () => {
    const ws = await openSession();
    ws.open();
    expect((document.getElementById('chatSendBtn') as HTMLButtonElement).disabled).toBe(false);
    expect(document.getElementById('chatStatus')!.textContent).toContain('Connected');
  });

  it('WS3: calling initChat() again closes the previous WS', async () => {
    const ws = await openSession();
    initChat();
    expect(ws.close).toHaveBeenCalled();
  });

  it('WS4: close code 4001 shows auth error message', async () => {
    const ws = await openSession();
    ws.closeWith(4001);
    expect(document.getElementById('chatStatus')!.textContent).toContain('Auth error');
  });

  it('WS5: close code 4004 shows session not found message', async () => {
    const ws = await openSession();
    ws.closeWith(4004);
    expect(document.getElementById('chatStatus')!.textContent).toContain('Session not found');
  });

  it('WS6: other close code shows Disconnected message', async () => {
    const ws = await openSession();
    ws.closeWith(1006);
    expect(document.getElementById('chatStatus')!.textContent).toContain('Disconnected');
  });

  it('WS7: onerror shows connection error message', async () => {
    const ws = await openSession();
    ws.err();
    expect(document.getElementById('chatStatus')!.textContent).toContain('Connection error');
  });

  it('WS8: missing auth_token calls router.navigate("/login") and creates no WS', async () => {
    localStorage.removeItem('auth_token');
    const { router } = await import('../router');
    initChat();
    await vi.waitFor(() => expect(document.querySelector('.chat-session-item')).not.toBeNull());
    (document.querySelector('.chat-session-item') as HTMLElement).click();
    await vi.waitFor(() => expect(router.navigate).toHaveBeenCalledWith('/login'));
    expect(MockWebSocket.instances.length).toBe(0);
  });
});

// ── Streaming & Typing Indicator (TI1–TI8) ────────────────────────────────────

describe('Streaming and typing indicator', () => {
  async function openAndConnect() {
    vi.spyOn(apiService, 'chatListSessions').mockResolvedValue({ data: [SESSION_1] });
    vi.spyOn(apiService, 'chatGetSession').mockResolvedValue({ data: { session: SESSION_1, messages: [] } });
    initChat();
    await vi.waitFor(() => expect(document.querySelector('.chat-session-item')).not.toBeNull());
    (document.querySelector('.chat-session-item') as HTMLElement).click();
    await vi.waitFor(() => expect(MockWebSocket.instances.length).toBe(1));
    const ws = MockWebSocket.instances[0];
    ws.open();
    return ws;
  }

  it('TI1: send() injects typing indicator dots into #chatStatus', async () => {
    const ws = await openAndConnect();
    (document.getElementById('chatInput') as HTMLTextAreaElement).value = 'Hello';
    (document.getElementById('chatSendBtn') as HTMLElement).click();
    expect(ws.send).toHaveBeenCalled();
    expect(document.querySelectorAll('#chatStatus .typing-dot')).toHaveLength(3);
  });

  it('TI2: first token creates a new assistant bubble', async () => {
    const ws = await openAndConnect();
    (document.getElementById('chatInput') as HTMLTextAreaElement).value = 'Hi';
    (document.getElementById('chatSendBtn') as HTMLElement).click();
    ws.msg({ type: 'token', content: 'Hello' });
    expect(document.querySelectorAll('.chat-bubble-assistant')).toHaveLength(1);
  });

  it('TI3: subsequent tokens accumulate in the same bubble (no new bubble)', async () => {
    const ws = await openAndConnect();
    (document.getElementById('chatInput') as HTMLTextAreaElement).value = 'Hi';
    (document.getElementById('chatSendBtn') as HTMLElement).click();
    ws.msg({ type: 'token', content: 'Hello' });
    ws.msg({ type: 'token', content: ' world' });
    expect(document.querySelectorAll('.chat-bubble-assistant')).toHaveLength(1);
    expect(document.querySelector('.chat-bubble-assistant .chat-bubble-text')!.textContent).toBe('Hello world');
  });

  it('TI4: done message clears status and re-enables send button', async () => {
    const ws = await openAndConnect();
    (document.getElementById('chatInput') as HTMLTextAreaElement).value = 'Hi';
    (document.getElementById('chatSendBtn') as HTMLElement).click();
    ws.msg({ type: 'token', content: 'OK' });
    ws.msg({ type: 'done' });
    expect(document.getElementById('chatStatus')!.innerHTML).toBe('');
    expect((document.getElementById('chatSendBtn') as HTMLButtonElement).disabled).toBe(false);
  });

  it('TI5: error message shows error in status and re-enables send button', async () => {
    const ws = await openAndConnect();
    (document.getElementById('chatInput') as HTMLTextAreaElement).value = 'Hi';
    (document.getElementById('chatSendBtn') as HTMLElement).click();
    ws.msg({ type: 'error', detail: 'Rate limit' });
    expect(document.getElementById('chatStatus')!.textContent).toContain('Rate limit');
    expect((document.getElementById('chatSendBtn') as HTMLButtonElement).disabled).toBe(false);
  });

  it('TI6: XSS in streamed token is not executed (textContent used)', async () => {
    const ws = await openAndConnect();
    (document.getElementById('chatInput') as HTMLTextAreaElement).value = 'Hi';
    (document.getElementById('chatSendBtn') as HTMLElement).click();
    const xss = '<img src=x onerror=alert(1)>';
    ws.msg({ type: 'token', content: xss });
    const bubble = document.querySelector('.chat-bubble-assistant .chat-bubble-text');
    expect(bubble!.textContent).toBe(xss);         // raw text
    expect(bubble!.querySelector('img')).toBeNull(); // not parsed as HTML
  });

  it('TI7: malformed JSON from WebSocket is swallowed silently', async () => {
    const ws = await openAndConnect();
    expect(() => {
      ws.onmessage?.(new MessageEvent('message', { data: '{not json}' }));
    }).not.toThrow();
  });

  it('TI8: animate not called on typing dots when prefers-reduced-motion is set', async () => {
    vi.mocked(window.matchMedia).mockReturnValue({ matches: true } as MediaQueryList);
    const ws = await openAndConnect();
    vi.mocked(animate).mockClear();
    (document.getElementById('chatInput') as HTMLTextAreaElement).value = 'Hi';
    (document.getElementById('chatSendBtn') as HTMLElement).click();
    ws.send; // ws.send was called
    expect(animate).not.toHaveBeenCalled();
  });
});

// ── Message Bubbles (MB1–MB5) ─────────────────────────────────────────────────

describe('Message bubbles', () => {
  async function openAndConnect() {
    vi.spyOn(apiService, 'chatListSessions').mockResolvedValue({ data: [SESSION_1] });
    vi.spyOn(apiService, 'chatGetSession').mockResolvedValue({ data: { session: SESSION_1, messages: [] } });
    initChat();
    await vi.waitFor(() => expect(document.querySelector('.chat-session-item')).not.toBeNull());
    (document.querySelector('.chat-session-item') as HTMLElement).click();
    await vi.waitFor(() => expect(MockWebSocket.instances.length).toBe(1));
    MockWebSocket.instances[0].open();
    return MockWebSocket.instances[0];
  }

  it('MB1: user bubble has chat-bubble-user class and "You" avatar', async () => {
    const ws = await openAndConnect();
    (document.getElementById('chatInput') as HTMLTextAreaElement).value = 'Hello';
    (document.getElementById('chatSendBtn') as HTMLElement).click();
    ws; // just to avoid lint
    const bubble = document.querySelector('.chat-bubble-user');
    expect(bubble).not.toBeNull();
    expect(bubble!.querySelector('.chat-bubble-avatar')!.textContent).toBe('You');
  });

  it('MB2: assistant bubble has chat-bubble-assistant class and "AI" avatar', async () => {
    const ws = await openAndConnect();
    (document.getElementById('chatInput') as HTMLTextAreaElement).value = 'Hello';
    (document.getElementById('chatSendBtn') as HTMLElement).click();
    ws.msg({ type: 'token', content: 'Hi there' });
    const bubble = document.querySelector('.chat-bubble-assistant');
    expect(bubble).not.toBeNull();
    expect(bubble!.querySelector('.chat-bubble-avatar')!.textContent).toBe('AI');
  });

  it('MB3: user message text is HTML-escaped', async () => {
    await openAndConnect();
    (document.getElementById('chatInput') as HTMLTextAreaElement).value = '<b>bold</b>';
    (document.getElementById('chatSendBtn') as HTMLElement).click();
    const bubble = document.querySelector('.chat-bubble-user .chat-bubble-text');
    expect(bubble!.innerHTML).toContain('&lt;b&gt;');
    expect(bubble!.querySelector('b')).toBeNull();
  });

  it('MB4: historical messages are rendered on session open', async () => {
    vi.spyOn(apiService, 'chatGetSession').mockResolvedValue({
      data: {
        session: SESSION_1,
        messages: [
          { id: 1, role: 'user', content: 'Hey' },
          { id: 2, role: 'assistant', content: 'Hello!' },
        ],
      },
    });
    vi.spyOn(apiService, 'chatListSessions').mockResolvedValue({ data: [SESSION_1] });
    initChat();
    await vi.waitFor(() => expect(document.querySelector('.chat-session-item')).not.toBeNull());
    (document.querySelector('.chat-session-item') as HTMLElement).click();
    await vi.waitFor(() => expect(document.querySelectorAll('.chat-bubble').length).toBe(2));
  });

  it('MB5: both user and assistant bubbles are inserted into DOM', async () => {
    const ws = await openAndConnect();
    (document.getElementById('chatInput') as HTMLTextAreaElement).value = 'Hi';
    (document.getElementById('chatSendBtn') as HTMLElement).click();
    expect(document.querySelector('.chat-bubble-user')).not.toBeNull();
    ws.msg({ type: 'token', content: 'Hey' });
    expect(document.querySelector('.chat-bubble-assistant')).not.toBeNull();
  });
});

// ── Session Deletion (DEL1–DEL5) ──────────────────────────────────────────────

describe('Session deletion', () => {
  async function openSession() {
    vi.spyOn(apiService, 'chatListSessions').mockResolvedValue({ data: [SESSION_1] });
    vi.spyOn(apiService, 'chatGetSession').mockResolvedValue({ data: { session: SESSION_1, messages: [] } });
    initChat();
    await vi.waitFor(() => expect(document.querySelector('.chat-session-item')).not.toBeNull());
    (document.querySelector('.chat-session-item') as HTMLElement).click();
    await vi.waitFor(() => expect(MockWebSocket.instances.length).toBe(1));
    MockWebSocket.instances[0].open();
  }

  it('DEL1: clicking Delete triggers confirm dialog', async () => {
    await openSession();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    (document.getElementById('deleteSessionBtn') as HTMLElement).click();
    expect(confirmSpy).toHaveBeenCalled();
  });

  it('DEL2: confirming delete calls chatDeleteSession and shows empty state', async () => {
    await openSession();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const deleteSpy = vi.spyOn(apiService, 'chatDeleteSession').mockResolvedValue({ data: undefined });
    vi.spyOn(apiService, 'chatListSessions').mockResolvedValue({ data: [] });
    (document.getElementById('deleteSessionBtn') as HTMLElement).click();
    await vi.waitFor(() => expect(deleteSpy).toHaveBeenCalledWith(SESSION_1.id));
    await vi.waitFor(() => {
      expect(document.getElementById('chatActive')!.style.display).toBe('none');
    });
  });

  it('DEL3: cancelling confirm makes no API call', async () => {
    await openSession();
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const deleteSpy = vi.spyOn(apiService, 'chatDeleteSession').mockResolvedValue({ data: undefined });
    (document.getElementById('deleteSessionBtn') as HTMLElement).click();
    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it('DEL4: API error on delete shows alert and keeps panel open', async () => {
    await openSession();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(apiService, 'chatDeleteSession').mockResolvedValue({ error: 'Forbidden' });
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    (document.getElementById('deleteSessionBtn') as HTMLElement).click();
    await vi.waitFor(() => expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Forbidden')));
    expect(document.getElementById('chatActive')!.style.display).not.toBe('none');
  });

  it('DEL5: WS is closed on successful delete', async () => {
    await openSession();
    const ws = MockWebSocket.instances[0];
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(apiService, 'chatDeleteSession').mockResolvedValue({ data: undefined });
    vi.spyOn(apiService, 'chatListSessions').mockResolvedValue({ data: [] });
    (document.getElementById('deleteSessionBtn') as HTMLElement).click();
    await vi.waitFor(() => expect(ws.close).toHaveBeenCalled());
  });
});

// ── Error & Edge Cases (E1–E6) ────────────────────────────────────────────────

describe('Error and edge cases', () => {
  it('E1: loadSessions API error shows error div without throwing', async () => {
    vi.spyOn(apiService, 'chatListSessions').mockResolvedValue({ error: 'Internal Server Error' });
    initChat();
    await vi.waitFor(() => expect(document.querySelector('.chat-error')).not.toBeNull());
    expect(document.querySelector('.chat-error')!.textContent).toContain('Internal Server Error');
  });

  it('E2: send() with empty string does not call ws.send', async () => {
    vi.spyOn(apiService, 'chatListSessions').mockResolvedValue({ data: [SESSION_1] });
    vi.spyOn(apiService, 'chatGetSession').mockResolvedValue({ data: { session: SESSION_1, messages: [] } });
    initChat();
    await vi.waitFor(() => expect(document.querySelector('.chat-session-item')).not.toBeNull());
    (document.querySelector('.chat-session-item') as HTMLElement).click();
    await vi.waitFor(() => expect(MockWebSocket.instances.length).toBe(1));
    const ws = MockWebSocket.instances[0];
    ws.open();
    (document.getElementById('chatInput') as HTMLTextAreaElement).value = '   ';
    (document.getElementById('chatSendBtn') as HTMLElement).click();
    expect(ws.send).not.toHaveBeenCalled();
  });

  it('E3: send() while isStreaming does not call ws.send a second time', async () => {
    vi.spyOn(apiService, 'chatListSessions').mockResolvedValue({ data: [SESSION_1] });
    vi.spyOn(apiService, 'chatGetSession').mockResolvedValue({ data: { session: SESSION_1, messages: [] } });
    initChat();
    await vi.waitFor(() => expect(document.querySelector('.chat-session-item')).not.toBeNull());
    (document.querySelector('.chat-session-item') as HTMLElement).click();
    await vi.waitFor(() => expect(MockWebSocket.instances.length).toBe(1));
    const ws = MockWebSocket.instances[0];
    ws.open();
    (document.getElementById('chatInput') as HTMLTextAreaElement).value = 'First';
    (document.getElementById('chatSendBtn') as HTMLElement).click(); // starts streaming
    (document.getElementById('chatInput') as HTMLTextAreaElement).value = 'Second';
    (document.getElementById('chatSendBtn') as HTMLElement).click(); // should be blocked
    expect(ws.send).toHaveBeenCalledTimes(1);
  });

  it('E4: calling initChat() twice results in only one WS instance after opening a session', async () => {
    vi.spyOn(apiService, 'chatListSessions').mockResolvedValue({ data: [SESSION_1] });
    vi.spyOn(apiService, 'chatGetSession').mockResolvedValue({ data: { session: SESSION_1, messages: [] } });
    initChat();
    initChat(); // second call should destroy the first ChatManager
    await vi.waitFor(() => expect(document.querySelector('.chat-session-item')).not.toBeNull());
    (document.querySelector('.chat-session-item') as HTMLElement).click();
    await vi.waitFor(() => expect(MockWebSocket.instances.length).toBeGreaterThanOrEqual(1));
    const openInstances = MockWebSocket.instances.filter(ws => ws.readyState !== 3);
    expect(openInstances.length).toBe(1);
  });

  it('E5: missing DOM element does not crash setStatus', () => {
    document.getElementById('chatStatus')!.remove();
    expect(() => {
      initChat();
    }).not.toThrow();
  });

  it('E6: Enter key on textarea calls send without Shift', async () => {
    vi.spyOn(apiService, 'chatListSessions').mockResolvedValue({ data: [SESSION_1] });
    vi.spyOn(apiService, 'chatGetSession').mockResolvedValue({ data: { session: SESSION_1, messages: [] } });
    initChat();
    await vi.waitFor(() => expect(document.querySelector('.chat-session-item')).not.toBeNull());
    (document.querySelector('.chat-session-item') as HTMLElement).click();
    await vi.waitFor(() => expect(MockWebSocket.instances.length).toBe(1));
    const ws = MockWebSocket.instances[0];
    ws.open();
    const ta = document.getElementById('chatInput') as HTMLTextAreaElement;
    ta.value = 'Hello via Enter';
    ta.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: false, bubbles: true }));
    expect(ws.send).toHaveBeenCalled();
  });
});

// ── Accessibility (A1–A3) ─────────────────────────────────────────────────────

describe('Accessibility', () => {
  it('A1: typing indicator HTML has aria-label attribute', () => {
    const container = document.createElement('div');
    container.innerHTML = typingIndicatorHTML();
    expect(container.querySelector('[aria-label]')).not.toBeNull();
  });

  it('A2: skeleton rows have aria-hidden="true"', () => {
    vi.spyOn(apiService, 'chatListSessions').mockReturnValue(new Promise(() => {}));
    initChat();
    document.querySelectorAll('.skeleton-session-item').forEach(el => {
      expect(el.getAttribute('aria-hidden')).toBe('true');
    });
  });

  it('A3: provider badge always has visible text alongside color (not color-only)', async () => {
    vi.spyOn(apiService, 'chatListSessions').mockResolvedValue({ data: [SESSION_1, SESSION_2] });
    initChat();
    await vi.waitFor(() => expect(document.querySelectorAll('.provider-pill').length).toBeGreaterThan(0));
    document.querySelectorAll('.provider-pill').forEach(pill => {
      expect(pill.textContent!.trim().length).toBeGreaterThan(0);
    });
  });
});
