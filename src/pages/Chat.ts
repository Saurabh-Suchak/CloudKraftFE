export const Chat = (): string => `
  <div class="app-container">

    <!-- ── Sidebar ───────────────────────────────────────────────────────── -->
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
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>Projects</span>
        </a>
        <a href="/workflow" data-navigate="/workflow" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>Designer</span>
        </a>
        <a href="/deployments" data-navigate="/deployments" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none"><polygon points="12 2 2 7 12 12 22 7 12 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="2 17 12 22 22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="2 12 12 17 22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>Deployments</span>
        </a>
        <a href="/chat" data-navigate="/chat" class="nav-item active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>AI Chat</span>
        </a>
        <a href="/docs" data-navigate="/docs" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
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
        <button class="btn-logout" id="logoutBtn" title="Logout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </aside>

    <!-- ── Main ──────────────────────────────────────────────────────────── -->
    <main class="chat-main">

      <!-- Left: session list -->
      <div class="chat-sessions-panel">
        <div class="chat-sessions-header">
          <span class="chat-sessions-title">Conversations</span>
          <button class="btn btn-primary btn-sm" id="newChatBtn">+ New</button>
        </div>
        <div class="chat-sessions-list" id="chatSessionsList">
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
      </div>

      <!-- Right: dynamic panel -->
      <div class="chat-content-panel">

        <!-- State 1: nothing selected -->
        <div class="chat-empty-state" id="chatEmptyState">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <p>Select a conversation or start a new one</p>
          <button class="btn btn-primary" id="newChatBtnEmpty">Start Chatting</button>
        </div>

        <!-- State 2: new session form -->
        <div class="chat-new-session-form" id="chatNewSessionForm" style="display:none">
          <h2>New Conversation</h2>
          <label for="llmProviderSelect">LLM Provider</label>
          <select id="llmProviderSelect" class="form-input">
          <option value="openai">GPT (OpenAI)</option>
            <option value="claude">Claude (Anthropic)</option>
            <option value="gemini">Gemini (Google)</option>
          </select>
          <label for="llmModelInput">Model <span class="label-hint">(optional — leave blank for default)</span></label>
          <input id="llmModelInput" type="text" class="form-input"
                 placeholder="e.g. claude-sonnet-4-6, gpt-4o-mini, gemini-2.0-flash" />
          <div class="form-actions">
            <button class="btn btn-primary" id="createSessionBtn">Create</button>
            <button class="btn btn-outline" id="cancelNewSessionBtn">Cancel</button>
          </div>
        </div>

        <!-- State 3: active chat -->
        <div class="chat-active" id="chatActive" style="display:none">
          <div class="chat-header">
            <div class="chat-header-info">
              <span class="chat-title" id="chatTitle">Conversation</span>
              <span class="chat-provider-badge" id="chatProviderBadge"></span>
            </div>
            <button class="btn btn-outline btn-sm btn-danger" id="deleteSessionBtn">Delete</button>
          </div>

          <div class="chat-messages" id="chatMessages"></div>

          <div class="chat-input-area">
            <div class="chat-input-wrapper">
              <textarea
                id="chatInput"
                class="chat-textarea"
                placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
                rows="1"
              ></textarea>
              <button class="chat-send-btn" id="chatSendBtn" disabled>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <div class="chat-status" id="chatStatus"></div>
          </div>
        </div>

      </div><!-- .chat-content-panel -->
    </main>
  </div>
`;
