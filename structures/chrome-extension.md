# Chrome Extension — Project Structure

> For browser extension developers building Manifest v3 Chrome extensions with Plasmo + TypeScript + React, optimizing the full cycle from content script authoring to Chrome Web Store publish.

## Stack

- **Framework:** Plasmo 0.90+ (build tooling, hot reload, MV3 manifest generation)
- **Language:** TypeScript 5.4+
- **UI:** React 18 (popup, options, newtab pages)
- **Styling:** Tailwind CSS 3.4+ with `@plasmohq/ui` component library
- **Background:** Service Worker via `background.ts` (Manifest v3 compliant)
- **Content scripts:** `contents/` directory with URL-pattern-based auto-registration
- **Storage:** `@plasmohq/storage` (typed wrapper over `chrome.storage.sync/local`)
- **Messaging:** `@plasmohq/messaging` (type-safe popup ↔ background ↔ content RPC)
- **Testing:** Vitest 1.6+ with `@vitest/browser` for DOM testing
- **Linting:** ESLint 9 + `@typescript-eslint` + Prettier 3
- **CI:** GitHub Actions (build, test, Chrome Web Store publish via `tldraw/chrome-webstore-upload`)
- **Alternative build:** WXT 0.19+ (drop-in Plasmo alternative with better HMR)

## Directory tree

```
my-extension/
├── .claude/
│   ├── CLAUDE.md                             # Project instructions for Claude Code
│   └── settings.json                         # Hooks, MCP servers, permissions
├── .github/
│   └── workflows/
│       ├── ci.yml                            # Build + test on every PR
│       └── publish.yml                       # Auto-publish to Chrome Web Store on release tag
├── assets/
│   ├── icon.png                              # 512x512 source icon (Plasmo auto-resizes)
│   ├── icon16.png                            # 16x16 toolbar icon
│   ├── icon32.png                            # 32x32 toolbar icon
│   ├── icon48.png                            # 48x48 extensions page icon
│   └── icon128.png                           # 128x128 Chrome Web Store icon
├── components/
│   ├── Button.tsx                            # Shared UI button with Tailwind variants
│   ├── Toggle.tsx                            # On/off toggle for settings
│   ├── StatusBadge.tsx                       # Active/inactive extension state indicator
│   └── index.ts                              # Barrel export for all components
├── contents/
│   ├── github-enhancer.tsx                   # Content script: runs on github.com/* only
│   ├── youtube-overlay.tsx                   # Content script: runs on youtube.com/watch
│   ├── all-pages.ts                          # Content script: runs on <all_urls>
│   └── inline/
│       └── github-inline.ts                  # Inline world content script (no shadow DOM)
├── lib/
│   ├── storage.ts                            # Typed chrome.storage helpers via @plasmohq/storage
│   ├── messaging.ts                          # Message type definitions for all RPC channels
│   ├── constants.ts                          # Extension-wide constants (keys, URLs, defaults)
│   ├── permissions.ts                        # Runtime permission request helpers
│   └── utils.ts                              # Pure utility functions (URL parsing, throttle, etc.)
├── messages/
│   ├── getActiveTab.ts                       # Background message handler: returns active tab info
│   ├── toggleFeature.ts                      # Background message handler: toggle feature on/off
│   └── fetchData.ts                          # Background message handler: authenticated fetch
├── tabs/
│   └── settings.tsx                          # Full-page settings tab (opened via options_ui)
├── background.ts                             # Service worker entry — registers listeners, alarms
├── popup.tsx                                 # Browser action popup (320x480 UI)
├── options.tsx                               # Extension options page
├── newtab.tsx                                # New tab override page (optional)
├── package.json                              # Deps, scripts (dev/build/package)
├── tsconfig.json                             # TypeScript config extending Plasmo defaults
├── tailwind.config.ts                        # Tailwind config with content paths for all .tsx
├── postcss.config.js                         # PostCSS for Tailwind processing
├── .env.example                              # API keys template (never commit .env)
├── .env.development                          # Dev-only env vars (API base URL, debug flags)
├── .eslintrc.cjs                             # ESLint config with TypeScript and React rules
├── .prettierrc                               # Prettier config (single quotes, 2-space indent)
├── vitest.config.ts                          # Vitest config with chrome API mocks
├── vitest.setup.ts                           # Global mocks: chrome.storage, chrome.runtime
└── __tests__/
    ├── lib/
    │   ├── storage.test.ts                   # Unit tests for storage helpers
    │   ├── messaging.test.ts                 # Unit tests for message type guards
    │   └── utils.test.ts                     # Unit tests for pure utilities
    ├── components/
    │   └── Toggle.test.tsx                   # Component tests with @testing-library/react
    └── background.test.ts                    # Service worker logic tests with mocked chrome APIs
```

## Key files explained

| Path | Purpose |
|---|---|
| `background.ts` | Service worker: registers `chrome.runtime.onMessage` listeners, `chrome.alarms`, and `chrome.tabs` events. Must be stateless across activations — no in-memory globals. |
| `popup.tsx` | React root for the browser action popup. Uses `@plasmohq/messaging` `sendToBackground` to call background handlers. Mount point is auto-generated by Plasmo. |
| `contents/github-enhancer.tsx` | Content script scoped to `github.com/*` via Plasmo's `PlasmoCSConfig` export. Injects React UI into the DOM using `getInlineAnchor` or `getShadowHostId`. |
| `lib/storage.ts` | Typed storage layer using `Storage` from `@plasmohq/storage`. Exports typed getters/setters for every persisted key — never call `chrome.storage` directly. |
| `lib/messaging.ts` | Shared message type definitions. Both sender (`sendToBackground`) and handler (`onMessage`) import from here to guarantee type safety across contexts. |
| `messages/fetchData.ts` | Background-side handler for authenticated API calls. Background has no CORS restrictions — all external fetches go through here, never from content scripts. |
| `.github/workflows/publish.yml` | Zips the `build/chrome-mv3-prod/` artifact and uploads to Chrome Web Store via `chrome-webstore-upload-cli` using secrets `CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN`. |
| `vitest.setup.ts` | Mocks the entire `chrome.*` namespace using `vitest-chrome` so unit tests run in Node without a real browser. |

## Quick scaffold

```bash
# 1. Bootstrap with Plasmo
pnpm create plasmo my-extension --with-src
cd my-extension

# 2. Add core Plasmo packages
pnpm add @plasmohq/storage @plasmohq/messaging @plasmohq/ui

# 3. Add Tailwind CSS
pnpm add -D tailwindcss postcss autoprefixer
pnpx tailwindcss init -p

# 4. Add testing stack
pnpm add -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/user-event jsdom vitest-chrome

# 5. Create directory structure
mkdir -p contents lib messages components assets tabs __tests__/{lib,components} .github/workflows .claude

# 6. Create essential lib files
touch lib/storage.ts lib/messaging.ts lib/constants.ts lib/permissions.ts lib/utils.ts

# 7. Create message handlers
touch messages/getActiveTab.ts messages/toggleFeature.ts messages/fetchData.ts

# 8. Create GitHub Actions workflows
touch .github/workflows/ci.yml .github/workflows/publish.yml

# 9. Create env files
touch .env.example .env.development
echo "PLASMO_PUBLIC_API_URL=https://api.example.com" >> .env.example

# 10. Create Vitest config and setup
cat > vitest.config.ts << 'EOF'
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
})
EOF

cat > vitest.setup.ts << 'EOF'
import { vi } from "vitest"
import "vitest-chrome"
EOF

# 11. Add scripts to package.json (Plasmo sets dev/build, add these)
# "test": "vitest run"
# "test:watch": "vitest"
# "test:coverage": "vitest run --coverage"
# "lint": "eslint . --ext .ts,.tsx"
# "typecheck": "tsc --noEmit"

# 12. Initialize CLAUDE.md
touch .claude/CLAUDE.md
```

## CLAUDE.md template

```markdown
# Chrome Extension — CLAUDE.md

## What this is

A Manifest v3 Chrome extension built with Plasmo, TypeScript, React, and Tailwind CSS.
The extension enhances [describe target websites/use-case here].

## Stack

- Plasmo 0.90+ (build, manifest generation, hot reload)
- TypeScript 5.4 + React 18 + Tailwind CSS 3.4
- @plasmohq/storage (typed Chrome Storage wrapper)
- @plasmohq/messaging (type-safe cross-context RPC)
- Vitest 1.6 + vitest-chrome (unit tests)
- GitHub Actions (CI + Chrome Web Store publish)

## Running locally

```bash
pnpm dev              # Start Plasmo dev server with hot reload
# Load unpacked: chrome://extensions → Developer mode → Load unpacked → build/chrome-mv3-dev/
pnpm build            # Production build → build/chrome-mv3-prod/
pnpm package          # Zip build/chrome-mv3-prod/ for Web Store upload
pnpm test             # Run Vitest unit tests
pnpm typecheck        # tsc --noEmit (no output, checks types only)
pnpm lint             # ESLint across all .ts/.tsx files
```

## Adding a new content script

1. Create `contents/my-script.tsx` (React) or `contents/my-script.ts` (vanilla).
2. Export `PlasmoCSConfig` to declare URL match patterns:
   ```ts
   export const config: PlasmoCSConfig = {
     matches: ["https://example.com/*"],
     all_frames: false,
   }
   ```
3. Default-export your component (React) or run inline logic (vanilla).
4. Plasmo auto-registers the script — no manual manifest editing required.
5. For inline world scripts (access page's JS globals): set `world: "MAIN"` in config.

## Messaging between contexts

All cross-context communication uses @plasmohq/messaging. Types live in `lib/messaging.ts`.

Popup → Background (request/response):
```ts
// popup.tsx
import { sendToBackground } from "@plasmohq/messaging"
const result = await sendToBackground({ name: "fetchData", body: { url } })
```

Background handler (`messages/fetchData.ts`):
```ts
import type { PlasmoMessaging } from "@plasmohq/messaging"
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const data = await fetch(req.body.url).then(r => r.json())
  res.send({ data })
}
export default handler
```

Content → Background: use `sendToBackground` from `@plasmohq/messaging/background`.
Background → Content: use `chrome.tabs.sendMessage(tabId, payload)` — not Plasmo RPC.

## Chrome Storage patterns

Never call `chrome.storage` directly. Use `lib/storage.ts`:
```ts
import { Storage } from "@plasmohq/storage"
const storage = new Storage({ area: "sync" }) // or "local"
await storage.set("featureEnabled", true)
const val = await storage.get<boolean>("featureEnabled")
```

Use `sync` for user preferences (5 MB quota, syncs across devices).
Use `local` for large cached data (unlimited quota, device-only).

## Permission declaration process

1. Add the permission string to the `manifest` key in `package.json`:
   ```json
   "manifest": {
     "permissions": ["tabs", "storage", "scripting"],
     "host_permissions": ["https://example.com/*"]
   }
   ```
2. For optional permissions, use `chrome.permissions.request()` at runtime via `lib/permissions.ts`.
3. Run `pnpm build` and verify the generated `build/chrome-mv3-prod/manifest.json`.
4. Document why the permission is needed in a comment — Chrome Web Store review requires justification.
5. Minimise permissions — request only what the current feature needs, not future ones.

## Conventions

- All storage keys are string constants in `lib/constants.ts` — never inline key strings.
- All external fetches (to third-party APIs) go through a background message handler, not content scripts.
- Content scripts may not import Node.js modules — only browser-compatible code.
- Message handler files in `messages/` must export a single default handler — no named exports.
- Tailwind classes go directly in JSX — no CSS modules, no inline styles.
- All new features must have Vitest unit tests before merge.

## Publishing checklist

- [ ] Bump `version` in `package.json` (follows semver)
- [ ] Update store listing description in `.github/store-listing.md`
- [ ] Run `pnpm build` and smoke-test the packed extension locally
- [ ] Run `pnpm test` — all tests green
- [ ] Run `pnpm typecheck` — no type errors
- [ ] Tag release: `git tag v1.x.x && git push --tags`
- [ ] GitHub Actions `publish.yml` triggers automatically and uploads to Web Store
- [ ] Submit for review in Chrome Developer Dashboard if permissions changed
```

## MCP servers

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "/Users/you/my-extension"],
      "description": "Read/write extension source files"
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      },
      "description": "Open PRs, read CI logs, manage releases"
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"],
      "description": "Drive Chrome with the extension loaded for end-to-end verification"
    }
  }
}
```

## Recommended hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "cd /Users/you/my-extension && pnpm lint --fix --quiet 2>&1 | tail -5",
            "description": "Auto-fix lint errors after every file write"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "cd /Users/you/my-extension && pnpm typecheck 2>&1 | grep -E 'error TS' | head -10",
            "description": "Surface TypeScript errors immediately after file writes"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Reminder: never call chrome.storage directly — use lib/storage.ts'",
            "description": "Remind Claude to use the typed storage wrapper before any bash execution"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
npx claudient add skill devops-infra/github-actions-ci
npx claudient add skill frontend/react-component
npx claudient add skill frontend/tailwind-ui
npx claudient add skill devops-infra/release-management
npx claudient add workflow chrome-extension-publish
```

## Related

- [../guides/chrome-extension-messaging.md](../guides/chrome-extension-messaging.md)
- [../guides/plasmo-getting-started.md](../guides/plasmo-getting-started.md)
- [../workflows/chrome-extension-publish.md](../workflows/chrome-extension-publish.md)
- [../workflows/content-script-rollout.md](../workflows/content-script-rollout.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
