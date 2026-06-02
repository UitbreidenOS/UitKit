# Documentation Site (Astro + Starlight) — Project Structure

> For developer documentation teams shipping MDX-based reference docs on Astro 4 + Starlight, optimizing the write-preview-deploy workflow with full-text search and automated link verification.

## Stack

- **Framework:** Astro 4.x with Starlight 0.23+ (documentation theme)
- **Language:** TypeScript 5.4+
- **Content format:** MDX (`.mdx`) with Astro content collections
- **Search:** Algolia DocSearch (crawler-based, free for public docs)
- **Package manager:** npm 10+ (or pnpm 9+)
- **Deployment:** Vercel (static site output, edge CDN)
- **CI/CD:** GitHub Actions (`build-check.yml`, `broken-links.yml`)
- **Link verification:** Playwright 1.44+ (crawls rendered site for 404s)
- **Component library:** Custom MDX components — `Callout`, `CodeTabs`, `Steps`, `ApiRef`
- **Syntax highlighting:** Shiki (built into Starlight) with custom theme
- **Sitemap:** `@astrojs/sitemap` (auto-generated, consumed by Algolia crawler)

## Directory tree

```
docs-site/                                    # Astro + Starlight documentation root
├── .claude/
│   ├── CLAUDE.md                             # Repo-level instructions for Claude Code
│   ├── settings.json                         # MCP servers, hooks, permissions
│   └── commands/
│       ├── new-doc.md                        # /new-doc — scaffold a new MDX page with frontmatter
│       ├── add-callout.md                    # /add-callout — insert typed callout block at cursor
│       ├── check-links.md                    # /check-links — run Playwright link checker locally
│       ├── rebuild-index.md                  # /rebuild-index — trigger Algolia crawler via API
│       └── update-sidebar.md                 # /update-sidebar — add nav entry to astro.config.mjs
├── .github/
│   └── workflows/
│       ├── build-check.yml                   # Build Astro site on every PR; fails on TS errors
│       └── broken-links.yml                  # Playwright crawl of preview URL; blocks merge on 404s
├── src/
│   ├── content/
│   │   ├── config.ts                         # Astro content collection schema definitions
│   │   └── docs/                             # All documentation pages live here
│   │       ├── getting-started/
│   │       │   ├── index.mdx                 # Landing: what the product is + quickstart
│   │       │   ├── installation.mdx          # Install steps with CodeTabs for npm/pnpm/yarn
│   │       │   ├── authentication.mdx        # Auth setup — API keys, OAuth, environment vars
│   │       │   └── first-request.mdx         # End-to-end hello-world with runnable snippet
│   │       ├── guides/
│   │       │   ├── index.mdx                 # Guides landing with card grid
│   │       │   ├── error-handling.mdx
│   │       │   ├── pagination.mdx
│   │       │   ├── rate-limiting.mdx
│   │       │   ├── webhooks.mdx
│   │       │   └── sdk-migration.mdx         # Upgrading between SDK major versions
│   │       ├── api-reference/
│   │       │   ├── index.mdx                 # API overview: base URL, versioning, auth header
│   │       │   ├── endpoints/
│   │       │   │   ├── users.mdx             # /users — CRUD operations with request/response tabs
│   │       │   │   ├── organizations.mdx
│   │       │   │   ├── webhooks.mdx
│   │       │   │   └── events.mdx
│   │       │   ├── objects/
│   │       │   │   ├── user-object.mdx       # Full field-by-field reference with types
│   │       │   │   ├── error-object.mdx
│   │       │   │   └── pagination-object.mdx
│   │       │   └── errors.mdx                # Complete HTTP error codes table
│   │       └── tutorials/
│   │           ├── index.mdx                 # Tutorials landing
│   │           ├── build-a-dashboard.mdx     # Multi-step with Steps component
│   │           ├── sync-with-webhook.mdx
│   │           └── migrate-from-v1.mdx       # Migration guide with diff-style code blocks
│   ├── components/
│   │   ├── Callout.astro                     # Typed callout: note | warning | danger | tip
│   │   ├── CodeTabs.astro                    # Language-switcher code block (npm/pnpm/curl etc.)
│   │   ├── Steps.astro                       # Numbered step list with automatic counter
│   │   ├── ApiRef.astro                      # Endpoint signature block: method badge + URL
│   │   ├── ParamTable.astro                  # Request/response parameter table with types
│   │   └── VersionBadge.astro                # "Added in v2.3" badge component
│   ├── assets/
│   │   ├── diagrams/
│   │   │   ├── auth-flow.svg                 # Auth sequence diagram (editable in Excalidraw)
│   │   │   ├── webhook-lifecycle.svg
│   │   │   └── data-model.svg
│   │   └── screenshots/
│   │       ├── dashboard-overview.png
│   │       └── api-key-screen.png
│   └── styles/
│       └── custom.css                        # CSS custom properties overriding Starlight theme
├── public/
│   ├── favicon.svg
│   ├── robots.txt                            # Allow all; points to sitemap.xml
│   └── og-image.png                          # OpenGraph image for social sharing
├── tests/
│   └── links/
│       ├── broken-links.spec.ts              # Playwright: crawl sitemap, assert no 404/500
│       └── playwright.config.ts              # baseURL from PLAYWRIGHT_BASE_URL env var
├── scripts/
│   └── trigger-algolia-crawl.ts             # Hits Algolia Crawler API to reindex; run post-deploy
├── astro.config.mjs                          # Starlight config: sidebar, Algolia, social links, i18n
├── tsconfig.json                             # Strict TypeScript; path alias @components, @assets
├── package.json                              # Scripts: dev, build, preview, typecheck, test:links
├── .env.example                              # ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX_NAME
└── .env.local                                # Local overrides (gitignored)
```

## Key files explained

| Path | Purpose |
|---|---|
| `astro.config.mjs` | Single source of truth for Starlight: sidebar tree, Algolia DocSearch config keys, social links, favicon, default locale; sidebar entries must match filenames in `src/content/docs/` |
| `src/content/config.ts` | Defines the `docs` content collection schema using `docsSchema()` from `@astrojs/starlight/schema`; extend here to add custom frontmatter fields like `version`, `status`, or `apiMethod` |
| `src/components/Callout.astro` | Renders styled callout blocks; accepts `type` prop (`note` | `warning` | `danger` | `tip`); used in MDX as `<Callout type="warning">text</Callout>` |
| `src/components/CodeTabs.astro` | Tab-switching code block; accepts array of `{ label, lang, code }` objects; persists tab selection to localStorage via `data-persist-tab` attribute |
| `src/components/Steps.astro` | Ordered list with CSS counter reset; children are plain slot content; avoids manual numbering in MDX |
| `tests/links/broken-links.spec.ts` | Fetches `sitemap.xml`, extracts all `<loc>` URLs, visits each with Playwright, asserts `response.status() < 400`; run against Vercel preview URL in CI |
| `scripts/trigger-algolia-crawl.ts` | POSTs to `https://crawler.algolia.com/api/1/crawlers/{crawlerId}/reindex` with Basic auth using `ALGOLIA_APP_ID` + `ALGOLIA_API_KEY`; run after every production deploy |
| `.github/workflows/broken-links.yml` | Triggered on `pull_request`; deploys to Vercel preview via `vercel deploy --prebuilt`, sets `PLAYWRIGHT_BASE_URL`, runs `npm run test:links`; posts results as PR check |

## Quick scaffold

```bash
# Prerequisites: Node 20+, npm 10+

# Create Astro + Starlight project
npm create astro@latest docs-site -- --template starlight
cd docs-site

# Install Playwright for link checking
npm install --save-dev @playwright/test
npx playwright install chromium

# Install Algolia search (Starlight plugin)
npm install @astrojs/starlight

# Install sitemap integration (needed for Algolia crawler and Playwright)
npm install @astrojs/sitemap

# Create content directory structure
mkdir -p src/content/docs/getting-started
mkdir -p src/content/docs/guides
mkdir -p src/content/docs/api-reference/endpoints
mkdir -p src/content/docs/api-reference/objects
mkdir -p src/content/docs/tutorials

# Create component files
mkdir -p src/components src/assets/diagrams src/assets/screenshots src/styles

touch src/components/Callout.astro
touch src/components/CodeTabs.astro
touch src/components/Steps.astro
touch src/components/ApiRef.astro
touch src/components/ParamTable.astro
touch src/components/VersionBadge.astro
touch src/styles/custom.css

# Create Playwright test structure
mkdir -p tests/links
touch tests/links/broken-links.spec.ts
touch tests/links/playwright.config.ts

# Create post-deploy scripts
mkdir -p scripts
touch scripts/trigger-algolia-crawl.ts

# Create GitHub Actions workflows
mkdir -p .github/workflows
touch .github/workflows/build-check.yml
touch .github/workflows/broken-links.yml

# Create public assets
touch public/robots.txt public/og-image.png

# Create Claude Code config
mkdir -p .claude/commands
touch .claude/CLAUDE.md .claude/settings.json
touch .claude/commands/new-doc.md
touch .claude/commands/add-callout.md
touch .claude/commands/check-links.md
touch .claude/commands/rebuild-index.md
touch .claude/commands/update-sidebar.md

# Create env files
touch .env.example .env.local

# Install Claudient skills
npx claudient add skill productivity/doc-site-builder
npx claudient add skill devops-infra/cicd
npx claudient add skill devops-infra/vercel

echo "Astro + Starlight docs site scaffolded. Run: npm run dev"
```

## CLAUDE.md template

```markdown
# Documentation Site

Astro 4 + Starlight developer documentation site. Content lives in src/content/docs/
as MDX files. Sidebar navigation is defined in astro.config.mjs. Search is powered by
Algolia DocSearch (crawler-based). Deployed to Vercel from the main branch via GitHub Actions.

## Stack

- Astro 4.x + Starlight 0.23+ (documentation theme)
- TypeScript 5.4 (strict mode)
- MDX content with Astro content collections
- Custom Astro components: Callout, CodeTabs, Steps, ApiRef, ParamTable, VersionBadge
- Algolia DocSearch (index rebuilt via crawler API post-deploy)
- Vercel (static output, preview deploys per PR)
- GitHub Actions: build-check.yml (TS + Astro build), broken-links.yml (Playwright)
- Playwright 1.44+ for link verification against preview URLs

## Adding a new documentation page — exact steps

1. Create the MDX file in the correct topic folder under src/content/docs/:
   - Getting started concepts → getting-started/
   - How-to guides → guides/
   - Endpoint and object reference → api-reference/endpoints/ or api-reference/objects/
   - Step-by-step walkthroughs → tutorials/
2. Add required frontmatter: title, description, sidebar.order (if order matters)
3. Add a sidebar entry in astro.config.mjs under starlight > sidebar > items
4. Use the /new-doc slash command to scaffold frontmatter and section structure
5. Run npm run dev and verify page renders at the expected URL path
6. Run npm run typecheck to catch any TypeScript errors in MDX components

## MDX component library

All components are imported at the top of the MDX file:
  import Callout from '@components/Callout.astro'
  import CodeTabs from '@components/CodeTabs.astro'
  import Steps from '@components/Steps.astro'

Callout types: note | warning | danger | tip
  <Callout type="warning">This breaks in v2 — migrate before upgrading.</Callout>

CodeTabs — language-labeled tabs for multi-language snippets:
  <CodeTabs tabs={[
    { label: "npm", lang: "bash", code: "npm install @acme/sdk" },
    { label: "pnpm", lang: "bash", code: "pnpm add @acme/sdk" },
    { label: "curl", lang: "bash", code: "curl https://api.acme.com/v1/users" }
  ]} />

Steps — auto-numbered ordered list:
  <Steps>
    <p>Install the SDK.</p>
    <p>Set your API key in the environment.</p>
    <p>Make your first request.</p>
  </Steps>

ApiRef — endpoint signature header:
  <ApiRef method="POST" path="/v1/users" />

Do NOT use raw HTML ordered lists for step sequences — use Steps.
Do NOT write <div class="callout"> manually — use Callout.

## Sidebar navigation config

Sidebar is configured in astro.config.mjs inside the starlight() plugin:

  starlight({
    sidebar: [
      {
        label: 'Getting Started',
        items: [
          { label: 'Overview', link: '/getting-started/' },
          { label: 'Installation', link: '/getting-started/installation/' },
        ],
      },
      {
        label: 'API Reference',
        autogenerate: { directory: 'api-reference' },
      },
    ],
  })

Use autogenerate for large sections (api-reference, tutorials).
Use explicit items[] for sections where order matters (getting-started, guides).
sidebar.order frontmatter field controls autogenerate sort order.

## Running commands

# Local dev server with hot reload
npm run dev

# Full production build (catches broken imports and TS errors)
npm run build

# Preview production build locally
npm run preview

# Type-check without building
npm run typecheck

# Run Playwright broken-link checker against local preview
PLAYWRIGHT_BASE_URL=http://localhost:4321 npm run test:links

# Trigger Algolia reindex (requires ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_CRAWLER_ID)
npx tsx scripts/trigger-algolia-crawl.ts

## Algolia index rebuild

The Algolia DocSearch index is rebuilt via the Algolia Crawler API, not the JavaScript client.
Trigger conditions:
- Automatically: scripts/trigger-algolia-crawl.ts runs in broken-links.yml after production deploy
- Manually: run the /rebuild-index slash command or invoke the script directly
- Do NOT push content directly to the Algolia index — let the crawler do it from the live site

Required env vars for the script:
  ALGOLIA_APP_ID=xxx
  ALGOLIA_API_KEY=xxx          # Crawler API key, NOT the search-only frontend key
  ALGOLIA_CRAWLER_ID=xxx       # Found in the Algolia Crawler dashboard
  ALGOLIA_INDEX_NAME=docs

## Deployment

- Every push to main triggers Vercel production deploy automatically
- Every PR gets a Vercel preview deploy URL
- broken-links.yml waits for the preview deploy, then runs Playwright against it
- Do not merge a PR if broken-links.yml is failing
- Production URL is set in PLAYWRIGHT_BASE_URL in the broken-links.yml workflow

## Frontmatter conventions

Every page must have:
  ---
  title: "Title as it appears in sidebar and <h1>"
  description: "One sentence — shown in search results and OG meta"
  ---

Optional:
  sidebar:
    order: 2                   # Controls position in autogenerate groups
    label: "Short Sidebar Name"  # If different from title
  version: "2.1"               # API version this page documents

## What not to do

- Do not add sidebar entries that don't have a matching MDX file — Starlight throws at build
- Do not write raw HTML tables for parameter docs — use ParamTable component
- Do not put images in src/content/ — put them in src/assets/ and import them in MDX
- Do not commit .env.local or any file containing real Algolia API keys
- Do not manually edit the Algolia index — only the crawler should write to it
```

## MCP servers

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/docs-site/src"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"]
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
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'f=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$f\" == *.mdx || \"$f\" == *.md ]]; then npx prettier --write --parser mdx \"$f\" 2>/dev/null || true; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'f=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$f\" == */astro.config.mjs ]]; then echo \"[HOOK] astro.config.mjs changed — verify sidebar matches files in src/content/docs/ and run: npm run build\" >&2; fi'"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_COMMAND\" | grep -q \"trigger-algolia-crawl\"; then echo \"[HOOK] Algolia reindex triggered — ensure the site is deployed and ALGOLIA_CRAWLER_ID is set\" >&2; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
npx claudient add skill productivity/doc-site-builder
npx claudient add skill devops-infra/cicd
npx claudient add skill devops-infra/vercel
npx claudient add skill testing/playwright
```

## Related

- [Technical Writing Guide](../guides/technical-writing.md)
- [Documentation Workflow](../workflows/doc-publishing.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
