import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiService } from '../services/api';

// Helper to create a mock Response
function mockResponse(body: unknown, status = 200) {
  return Promise.resolve(
    new Response(body === null ? null : JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  );
}

function mock204() {
  return Promise.resolve(new Response(null, { status: 204 }));
}

beforeEach(() => {
  localStorage.setItem('auth_token', 'test-jwt');
  vi.stubGlobal('fetch', vi.fn());
});

// ── chatCreateSession ─────────────────────────────────────────────────────────

describe('chatCreateSession()', () => {
  it('sends POST /api/chat/sessions with llm_provider and llm_model', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockReturnValueOnce(
      mockResponse({ id: 1, title: null, llm_provider: 'claude', llm_model: null, created_at: '' })
    );
    await apiService.chatCreateSession('claude', 'claude-sonnet-4-6');
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, opts] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/chat/sessions');
    expect(opts.method).toBe('POST');
    const body = JSON.parse(opts.body as string);
    expect(body.llm_provider).toBe('claude');
    expect(body.llm_model).toBe('claude-sonnet-4-6');
  });

  it('sends llm_model: null when model is undefined', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockReturnValueOnce(
      mockResponse({ id: 2, title: null, llm_provider: 'openai', llm_model: null, created_at: '' })
    );
    await apiService.chatCreateSession('openai');
    const [, opts] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(opts.body as string);
    expect(body.llm_model).toBeNull();
  });

  it('attaches Authorization Bearer token from localStorage', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockReturnValueOnce(
      mockResponse({ id: 3, title: null, llm_provider: 'gemini', llm_model: null, created_at: '' })
    );
    await apiService.chatCreateSession('gemini');
    const [, opts] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = opts.headers as Record<string, string>;
    expect(headers['Authorization']).toBe('Bearer test-jwt');
  });
});

// ── chatListSessions ──────────────────────────────────────────────────────────

describe('chatListSessions()', () => {
  it('sends GET /api/chat/sessions', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockReturnValueOnce(mockResponse([]));
    await apiService.chatListSessions();
    const [url, opts] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/chat/sessions');
    expect(opts.method).toBeUndefined(); // GET is default
  });

  it('attaches auth header', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockReturnValueOnce(mockResponse([]));
    await apiService.chatListSessions();
    const [, opts] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = opts.headers as Record<string, string>;
    expect(headers['Authorization']).toBe('Bearer test-jwt');
  });
});

// ── chatGetSession ────────────────────────────────────────────────────────────

describe('chatGetSession()', () => {
  it('sends GET /api/chat/sessions/42 for id=42', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockReturnValueOnce(mockResponse({ session: {}, messages: [] }));
    await apiService.chatGetSession(42);
    const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/chat/sessions/42');
  });

  it('returns { session, messages } shaped data', async () => {
    const fetchMock = vi.mocked(fetch);
    const payload = { session: { id: 42, llm_provider: 'claude' }, messages: [{ role: 'user', content: 'hi' }] };
    fetchMock.mockReturnValueOnce(mockResponse(payload));
    const result = await apiService.chatGetSession(42);
    expect(result.data).toMatchObject({ session: { id: 42 }, messages: expect.any(Array) });
  });
});

// ── chatDeleteSession ─────────────────────────────────────────────────────────

describe('chatDeleteSession()', () => {
  it('sends DELETE /api/chat/sessions/7 for id=7', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockReturnValueOnce(mock204());
    await apiService.chatDeleteSession(7);
    const [url, opts] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/chat/sessions/7');
    expect(opts.method).toBe('DELETE');
  });

  it('returns { data: undefined } on 204 (no body)', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockReturnValueOnce(mock204());
    const result = await apiService.chatDeleteSession(7);
    expect(result.error).toBeUndefined();
    expect(result.data).toBeUndefined();
  });
});

// ── Error cases ───────────────────────────────────────────────────────────────

describe('API error handling', () => {
  it('backend 401 returns { error } without throwing', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockReturnValueOnce(
      Promise.resolve(new Response(JSON.stringify({ detail: 'Unauthorized' }), { status: 401 }))
    );
    const result = await apiService.chatListSessions();
    expect(result.error).toBe('Unauthorized');
    expect(result.data).toBeUndefined();
  });

  it('network failure (fetch rejects) returns { error: "Network error" } without throwing', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockReturnValueOnce(Promise.reject(new Error('Failed to fetch')));
    const result = await apiService.chatListSessions();
    expect(result.error).toBe('Failed to fetch');
  });
});
