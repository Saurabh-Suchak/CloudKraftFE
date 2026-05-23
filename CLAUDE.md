# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server on :5173
npm run build    # Production build
npm run lint     # ESLint with TypeScript rules
npm test         # Vitest (jsdom); tests in src/__tests__/
```

Set `VITE_API_URL` to point at a different backend (defaults to `http://localhost:8001`). Production points to `https://cloudkraftbe.onrender.com` via `.env.production`.

## Architecture

**Vanilla TypeScript SPA — no component framework.** The router in [src/router.ts](src/router.ts) renders pages by setting `innerHTML` on `#app`. Navigation uses `data-navigate` attributes handled by event delegation on `document`.

### Page Pattern

Every page in [src/pages/](src/pages/) is a class with a method that returns an HTML string. `main.ts` uses a `MutationObserver` on `#app` to detect route changes and re-run page-specific initialization (attaching event listeners, fetching data). This is the primary pattern for wiring up interactivity after a page renders.

### State Management

There is no reactive state library. State lives in:
- **`localStorage`** — `auth_token`, `current_user`, `canvas_state`, `current_workflow_id`, `current_workflow_name`, `pending_workflow`, `deployment_workflow_name`, `deployment_node_count`, `generated_terraform_files`
- **Module-level variables** in the large files (`workflow.ts`, `codeviewer.ts`, `deployment.ts`)

### API Layer

`apiService` in [src/services/api.ts](src/services/api.ts) is a singleton `ApiService`. Every method returns `Promise<{ data?: T; error?: string }>`. Auth token is read from `localStorage` and sent as `Bearer` on every request. Login uses `application/x-www-form-urlencoded` (OAuth2 form); all other endpoints use JSON.

### Key Large Files

| File | Size | What it owns |
|---|---|---|
| [src/pages/WorkflowDesigner.ts](src/pages/WorkflowDesigner.ts) | ~108 KB | Main canvas UI, resource palette, properties panel, template menu |
| [src/workflow.ts](src/workflow.ts) | ~80 KB | Canvas state, drag-and-drop, node/connection CRUD, serialization, 30+ AWS resource types |
| [src/styles/main.css](src/styles/main.css) | ~56 KB | All styles — single file using CSS custom properties (`--bg-primary`, `--text-primary`, `--surface-100`, `--border`, etc.) |
| [src/main.ts](src/main.ts) | ~49 KB | App init, all global event wiring, route registration, MutationObserver |
| [src/codeviewer.ts](src/codeviewer.ts) | ~20 KB | Monaco editor with custom HCL syntax, file tabs, validation results, cost estimation |
| [src/deployment.ts](src/deployment.ts) | ~14 KB | Deployment lifecycle: plan → approve → poll logs every 2 s → destroy |

### Deployment Flow

The deploy path is two-phase: `POST /api/deploy/plan` → `POST /api/deploy/{id}/approve`. Logs are polled via `GET /api/deploy/{id}/logs?after_id=<lastId>` every 2 seconds. Terminal states: `succeeded`, `failed`, `destroyed`. Active polling states: `pending`, `running`, `destroying`.

### Routing

Public routes (no auth required): `/`, `/login`, `/signup`, `/signup-aws`. All others redirect to `/login` if `auth_token` is absent. Authenticated users visiting `/login` or `/signup` are redirected to `/dashboard`. `vercel.json` rewrites all paths to `/index.html` for SPA support.
