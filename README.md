# CloudKraftFE

Frontend for CloudKraft — a visual AWS infrastructure designer that generates and deploys Terraform. Users drag AWS resources onto a canvas, connect them, and get valid HCL out the other side.

Backend repo: [CloudKraftBE](https://github.com/Preetam3620/CloudKraftBE)

---

## Architecture

Vanilla TypeScript SPA — no component framework. The router (`src/router.ts`) renders pages by setting `innerHTML` on `#app`. A `MutationObserver` in `main.ts` detects route changes and re-runs page-specific initialization (event listeners, data fetching). There is no reactive state library; state lives in module-level variables and `localStorage`.

### Key files

| File | What it owns |
|---|---|
| `src/pages/WorkflowDesigner.ts` | Canvas UI, resource palette, properties panel, AI agent panel |
| `src/workflow.ts` | All canvas state: node/connection CRUD, drag-and-drop, serialization |
| `src/styles/main.css` | All styles — single file, CSS custom properties throughout |
| `src/main.ts` | App init, global event wiring, route registration, MutationObserver |
| `src/codeviewer.ts` | Monaco editor with custom HCL syntax, file tabs, validation results, cost estimate |
| `src/deployment.ts` | Deploy lifecycle: plan → approve → poll logs every 2s → destroy |
| `src/services/api.ts` | All HTTP calls; every method returns `Promise<{ data?, error? }>` |
| `src/chat.ts` | Chat UI event wiring and WebSocket client |

### Canvas

`src/workflow.ts` (~80 KB) is the core of the app. Drag-and-drop, hit testing, node/connection state, and canvas serialization are all built from scratch — no React Flow, no D3. When you draw a connection between two nodes, the frontend sends the full workflow state to the backend, which resolves what Terraform attribute the edge represents based on the resource types at both ends.

### API layer

`apiService` in `src/services/api.ts` is a singleton. Auth token is read from `localStorage` and sent as `Bearer` on every request. Login uses `application/x-www-form-urlencoded` (OAuth2); all other endpoints use JSON.

### Chat

The chat UI (`src/chat.ts`, rendered by `src/pages/Chat.ts`) connects via WebSocket for real-time streaming. The `?token=` query param carries the auth token — the browser WebSocket API can't send custom headers. Sessions persist across page reloads; history is restored from the backend on reconnect.

### Deployment polling

The frontend polls `GET /api/deploy/{id}/logs?after_id=<lastId>` every 2 seconds during active deployments, advancing `after_id` each time to receive only new log entries. Terminal states (`succeeded`, `failed`, `destroyed`) stop the poll.

### Routing

Public routes (no auth): `/`, `/login`, `/signup`, `/signup-aws`. All others redirect to `/login` if `auth_token` is absent. `vercel.json` rewrites all paths to `/index.html` for SPA support.

---

## Setup

```bash
npm install
npm run dev      # Vite dev server on :5173
```

Set `VITE_API_URL` to point at a different backend instance (defaults to `http://localhost:8001`). Production points to `https://cloudkraftbe.onrender.com` via `.env.production`.

```bash
npm run build    # production build
npm run lint     # ESLint + TypeScript rules
npm test         # Vitest (jsdom); tests in src/__tests__/
```

---

## Branches

- `main` — stable, deployed to Vercel
- `develop` — integration branch; open PRs here, not to main
- Personal branches follow `dev-<name>` convention
