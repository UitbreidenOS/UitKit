# CLAUDE.md — Chrome Extension Manifest V3 (Annotated Example)
> Chrome Extension on Manifest V3 — shows how to constrain Claude to MV3's security model, service worker architecture, and the permission minimization philosophy required for Chrome Web Store review.

<!-- ANNOTATION: MV3 is a breaking change from MV2. Claude's training data contains vast amounts of MV2 extension code (background pages, persistent scripts). The first line explicitly kills those patterns before they appear. -->
This is a Chrome Extension using Manifest V3. Do not use Manifest V2 patterns — no background pages, no persistent background scripts, no `webRequestBlocking`. The service worker is the background context and is ephemeral.

## Extension Architecture

```
src/
  manifest.json           # MV3 manifest — source of truth for permissions
  background/
    service-worker.ts     # Ephemeral background logic
    message-handlers.ts   # chrome.runtime.onMessage handlers
  content/
    content-script.ts     # Injected into page context
    isolated-world.ts     # DOM access (isolated world)
  popup/
    index.html
    popup.ts
  options/
    index.html
    options.ts
  sidepanel/
    index.html
    sidepanel.ts
  shared/
    types.ts
    constants.ts
dist/                     # Built output — gitignored
```

## MV3 Service Worker Rules

<!-- ANNOTATION: The service worker's ephemerality is the most misunderstood constraint in MV3. It terminates after ~30 seconds of inactivity. Any in-memory state is lost. Claude must understand this to avoid suggesting patterns that silently break when the SW is restarted. -->
- The service worker is ephemeral — it can be terminated at any time after ~30 seconds of inactivity
- Never store state in module-level variables in the service worker — use `chrome.storage` instead
- Use `chrome.alarms` for recurring tasks — `setInterval` won't survive SW termination
- All message handlers must be registered synchronously at the top level of the SW (not inside async functions)
- For long-running operations, use `chrome.offscreen` documents (MV3 API)

## Permission Minimization

<!-- ANNOTATION: Chrome Web Store reviews reject extensions with overly broad permissions. Minimizing permissions is not just good practice — it is a submission requirement. Claude should not suggest broad permissions when narrow ones suffice. -->
The Chrome Web Store rejects extensions with unnecessary permissions. Only request what is needed:
- Use `activeTab` instead of `tabs` when only the current tab is needed
- Use `scripting` instead of `<all_urls>` host permissions for programmatic injection
- Use `host_permissions` with specific origins, not `*://*/*`
- Declare `optional_permissions` for features the user can choose to enable

Current permissions (from `manifest.json` — do not add without approval):
- `activeTab`, `storage`, `scripting`, `sidePanel`
- Host permission: `https://api.ourservice.com/*`

## Content Script Rules

<!-- ANNOTATION: Content scripts run in an isolated world but share the DOM. The boundary between isolated world and page context is a security boundary — Claude must not suggest `MAIN` world injection unless it's specifically required and documented. -->
- Content scripts run in the ISOLATED world by default — do not change `world: "ISOLATED"` unless the task requires accessing page-level JavaScript
- `MAIN` world injection can access page globals but is a security risk — document why it's needed
- Do not access `window.location` in content scripts for sensitive decisions — the page can spoof it
- Use `chrome.runtime.sendMessage` to communicate with the service worker — never share memory

## Storage

<!-- ANNOTATION: MV3 has multiple storage APIs with different semantics. Claude needs to know which to reach for — sync vs local vs session — and the quota limits that cause silent failures. -->
- `chrome.storage.sync`: user settings, small data — syncs across devices, 8KB item limit, 100KB total
- `chrome.storage.local`: larger data, non-synced — 10MB limit (can request unlimited)
- `chrome.storage.session`: ephemeral, cleared on browser restart — for transient SW state
- Do not use `localStorage` in the service worker — it is not accessible there
- All storage operations are async — always `await chrome.storage.*.get()`

## Messaging

All message passing uses typed message schemas defined in `src/shared/types.ts`:
```typescript
type Message =
  | { type: "OPEN_SIDEPANEL" }
  | { type: "FETCH_DATA"; url: string }
  | { type: "STORE_RESULT"; data: ResultData };
```
- Return `true` from `onMessage` listeners that respond asynchronously
- Do not use `chrome.tabs.sendMessage` to content scripts without checking the tab exists first

## Build

```bash
pnpm dev    # Watch mode — output to dist/
pnpm build  # Production build
pnpm pack   # Creates extension.zip for Web Store upload
```

Load unpacked: `chrome://extensions/` → Developer mode → Load unpacked → select `dist/`

## What Not To Do

<!-- ANNOTATION: These are all MV2 patterns that still appear in Stack Overflow answers and older tutorials. Claude must know to avoid them, not just know MV3 exists. -->
- Do not use `background.page` or `background.scripts` in manifest.json — use `background.service_worker`
- Do not use `webRequest` with blocking — use `declarativeNetRequest`
- Do not store state in service worker module-level variables
- Do not use `setInterval` in the service worker — use `chrome.alarms`
- Do not request `<all_urls>` when specific origins suffice
- Do not use `eval()` or inline scripts — CSP in MV3 disallows them
- Do not ship the `dist/` folder to source control — it is built output
