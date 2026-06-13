# Top 100 MCP Servers for Indie Builders

The most useful MCP servers in 2026 — with installation commands, what each does, and curated starter bundles. Based on monthly search volume (170K+ combined), GitHub stars, and real production usage.

**Start here:** Get 80% of value from 5 servers. For indie builders: **GitHub + Memory + Playwright + PostgreSQL/Supabase + Stripe**. Everything else is additive.

---

## How to install any MCP server

Add to `~/.claude.json` (global) or `.claude/mcp.json` (project):

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@scope/package-name@latest"],
      "env": {
        "API_KEY": "your-key-here"
      }
    }
  }
}
```

For Python servers use: `"command": "uvx"` or `"command": "python"` with `"-m"` arg.
Restart Claude Code after adding servers.

---

## 🏆 TIER 1 — Essential (Every Indie Builder)

### 1. GitHub (82K monthly searches · Official)
Read PRs, search code, create issues, manage branches, review diffs.

```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..." }
}
```
Token: github.com/settings/tokens → `repo, read:org` scopes

---

### 2. Memory (Knowledge Graph Persistence)
Remembers facts, decisions, and context across Claude Code sessions. Most-requested capability.

```json
"memory": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-memory"],
  "env": {
    "MEMORY_FILE_PATH": "/Users/you/.claude/memory/knowledge.json"
  }
}
```

---

### 3. Playwright (82K searches · Microsoft Official)
Control a real browser — navigate, click, fill forms, screenshots, scrape JS-rendered pages. Uses accessibility tree for reliable automation.

```json
"playwright": {
  "command": "npx",
  "args": ["-y", "@playwright/mcp@latest"],
  "env": { "BROWSER": "chromium" }
}
```

---

### 4. PostgreSQL (Official)
Run SQL queries, explore schemas, answer business questions without exporting data.

```json
"postgres": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
}
```
Use a read-only connection string for safety.

---

### 5. Stripe (Official)
Customer lookup, payment queries, subscription management, invoice generation.

```json
"stripe": {
  "command": "npx",
  "args": ["-y", "@stripe/agent-toolkit"],
  "env": { "STRIPE_SECRET_KEY": "sk_test_..." }
}
```
docs.stripe.com/mcp for full setup.

---

### 6. Filesystem (Official)
Read, write, and search files outside the current project directory.

```json
"filesystem": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/projects"]
}
```

---

### 7. Fetch (Official)
Make HTTP requests to any URL, fetch web pages, call REST APIs.

```json
"fetch": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-fetch"]
}
```

---

## 💻 TIER 2 — Developer Stack

### 8. Context7 (32K searches)
Fetches current, version-specific library documentation. Prevents Claude from using outdated APIs.

```json
"context7": {
  "command": "npx",
  "args": ["-y", "@upstash/context7-mcp@latest"]
}
```

---

### 9. Supabase (26K searches · Official)
Full Supabase control — database, auth, storage, edge functions, RLS policies.

```json
"supabase": {
  "command": "npx",
  "args": ["-y", "@supabase/mcp-server-supabase@latest"],
  "env": {
    "SUPABASE_ACCESS_TOKEN": "sbp_...",
    "SUPABASE_PROJECT_REF": "your-project-ref"
  }
}
```

---

### 10. Git (Official)
Local repo access — branches, commits, diffs, log, blame.

```json
"git": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "."]
}
```

---

### 11. GitLab (Official)
MRs, issues, pipelines, CI/CD management.

```json
"gitlab": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-gitlab"],
  "env": {
    "GITLAB_PERSONAL_ACCESS_TOKEN": "glpat-...",
    "GITLAB_API_URL": "https://gitlab.com/api/v4"
  }
}
```

---

### 12. Sentry (4.7K searches · Official)
Query errors, create issues, view stack traces and performance data.

```json
"sentry": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-sentry"],
  "env": {
    "SENTRY_AUTH_TOKEN": "sntrys_...",
    "SENTRY_ORGANIZATION": "your-org-slug"
  }
}
```

---

### 13. Desktop Commander
Terminal access, process management, file system control, ripgrep search.

```json
"desktop-commander": {
  "command": "npx",
  "args": ["-y", "@wonderwhy-er/desktop-commander"]
}
```

---

### 14. Docker (10.3K searches)
Manage containers, images, volumes, networks.

```json
"docker": {
  "command": "npx",
  "args": ["-y", "mcp-server-docker"]
}
```

---

### 15. MySQL (4.2K searches)
Query MySQL databases, schema exploration, SQL execution.

```json
"mysql": {
  "command": "npx",
  "args": ["-y", "@benborla29/mcp-server-mysql"],
  "env": {
    "MYSQL_HOST": "localhost",
    "MYSQL_PORT": "3306",
    "MYSQL_USER": "root",
    "MYSQL_PASSWORD": "password",
    "MYSQL_DATABASE": "mydb"
  }
}
```

---

### 16. Redis (1.4K searches)
Read/write Redis keys, inspect data, manage cache.

```json
"redis": {
  "command": "npx",
  "args": ["-y", "mcp-server-redis"],
  "env": { "REDIS_URL": "redis://localhost:6379" }
}
```

---

### 17. Prisma (Official)
Query Prisma Postgres, manage schema migrations.

```json
"prisma": {
  "command": "npx",
  "args": ["prisma", "mcp"]
}
```

---

### 18. MongoDB
Document data access, schema inspection, JSON querying.

```json
"mongodb": {
  "command": "npx",
  "args": ["-y", "@mongodb-js/mongodb-mcp-server"],
  "env": { "MDB_MCP_CONNECTION_STRING": "mongodb://localhost:27017" }
}
```

---

### 19. Neon (Serverless Postgres)
Neon's serverless PostgreSQL with branching — directly manage your Neon project.

```json
"neon": {
  "command": "npx",
  "args": ["-y", "@neondatabase/mcp-server-neon"],
  "env": { "NEON_API_KEY": "..." }
}
```

---

### 20. E2B (Sandboxed Code Execution)
Secure cloud environment to run Python/JS, execute shell commands safely.

```json
"e2b": {
  "command": "npx",
  "args": ["-y", "@e2b/mcp-server"],
  "env": { "E2B_API_KEY": "e2b_..." }
}
```

---

### 21. Semgrep
Static analysis for security vulnerabilities and code quality.

```json
"semgrep": {
  "command": "semgrep",
  "args": ["mcp"]
}
```

---

## 🔍 TIER 3 — Search & Research

### 22. Brave Search (4.3K searches)
Web search without tracking. Free tier: 2,000 queries/month.

```json
"brave-search": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-brave-search"],
  "env": { "BRAVE_API_KEY": "BSA..." }
}
```

---

### 23. Firecrawl (7.2K searches)
Convert any URL to clean Markdown — handles JS-rendered pages.

```json
"firecrawl": {
  "command": "npx",
  "args": ["-y", "firecrawl-mcp"],
  "env": { "FIRECRAWL_API_KEY": "fc-..." }
}
```

---

### 24. Exa (3.5K searches)
Neural semantic search over the web.

```json
"exa": {
  "command": "npx",
  "args": ["-y", "exa-mcp-server"],
  "env": { "EXA_API_KEY": "..." }
}
```

---

### 25. Tavily (2.9K searches)
AI-optimised search for RAG and AI agents.

```json
"tavily": {
  "command": "npx",
  "args": ["-y", "tavily-mcp"],
  "env": { "TAVILY_API_KEY": "tvly-..." }
}
```

---

### 26. Jina Reader
Converts URLs to clean Markdown — great for documentation scraping.

```json
"jina": {
  "command": "npx",
  "args": ["-y", "@jina-ai/mcp-server-jina-reader"],
  "env": { "JINA_API_KEY": "jina_..." }
}
```

---

### 27. Perplexity
Semantic search + real-time web research with citations.

```json
"perplexity": {
  "command": "npx",
  "args": ["-y", "mcp-server-perplexity"],
  "env": { "PERPLEXITY_API_KEY": "pplx-..." }
}
```

---

### 28. GPT Researcher
Deep-research agent that plans, executes, and writes citation-backed reports.

```json
"gpt-researcher": {
  "command": "uvx",
  "args": ["gptr-mcp"],
  "env": { "OPENAI_API_KEY": "sk-..." }
}
```

---

## 📊 TIER 4 — Analytics & Monitoring

### 29. Grafana (6.1K searches)
Query metrics, explore dashboards, investigate alerts.

```json
"grafana": {
  "command": "npx",
  "args": ["-y", "@grafana/mcp-grafana"],
  "env": {
    "GRAFANA_URL": "http://localhost:3000",
    "GRAFANA_API_KEY": "glsa_..."
  }
}
```

---

### 30. Datadog (6.9K searches · Official)
Query metrics, logs, traces for diagnostics.

```json
"datadog": {
  "command": "npx",
  "args": ["-y", "@datadog/mcp-server"],
  "env": {
    "DD_API_KEY": "...",
    "DD_APP_KEY": "...",
    "DD_SITE": "datadoghq.com"
  }
}
```

---

### 31. PostHog
Product analytics, feature flags, session recordings.

```json
"posthog": {
  "command": "npx",
  "args": ["-y", "posthog-mcp-server"],
  "env": {
    "POSTHOG_API_KEY": "phx_...",
    "POSTHOG_HOST": "https://app.posthog.com"
  }
}
```

---

## 📋 TIER 5 — Project Management

### 32. Linear (10.6K searches · Official)
Create issues, update status, query projects, manage cycles.

```json
"linear": {
  "command": "npx",
  "args": ["-y", "@linear/mcp-server"],
  "env": { "LINEAR_API_KEY": "lin_api_..." }
}
```

---

### 33. Notion (23K searches)
Read/write pages, query databases, search workspace.

```json
"notion": {
  "command": "npx",
  "args": ["-y", "@notionhq/notion-mcp-server"],
  "env": { "NOTION_API_KEY": "secret_..." }
}
```

---

### 34. Jira / Atlassian (40K searches · Official)
Issues, sprints, Confluence docs.

```json
"atlassian": {
  "command": "npx",
  "args": ["-y", "@sooperset/mcp-atlassian"],
  "env": {
    "JIRA_URL": "https://your-domain.atlassian.net",
    "JIRA_USERNAME": "you@email.com",
    "JIRA_API_TOKEN": "...",
    "CONFLUENCE_URL": "https://your-domain.atlassian.net/wiki",
    "CONFLUENCE_USERNAME": "you@email.com",
    "CONFLUENCE_API_TOKEN": "..."
  }
}
```

---

### 35. Asana (2.8K searches)
Task, project, and team management.

```json
"asana": {
  "command": "npx",
  "args": ["-y", "asana-mcp-server"],
  "env": { "ASANA_ACCESS_TOKEN": "..." }
}
```

---

### 36. Task Master
Turns PRDs into structured task lists with dependencies.

```json
"taskmaster": {
  "command": "npx",
  "args": ["-y", "task-master-ai"],
  "env": { "ANTHROPIC_API_KEY": "sk-ant-..." }
}
```

---

## 💬 TIER 6 — Communication

### 37. Slack (17.7K searches · Official)
Read channels, search messages, post updates.

```json
"slack": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": {
    "SLACK_BOT_TOKEN": "xoxb-...",
    "SLACK_TEAM_ID": "T..."
  }
}
```

---

### 38. Gmail (5.6K searches)
Search, read, send, and reply to emails.

```json
"gmail": {
  "command": "npx",
  "args": ["-y", "gmail-mcp-server"],
  "env": {
    "GMAIL_CLIENT_ID": "...",
    "GMAIL_CLIENT_SECRET": "...",
    "GMAIL_REFRESH_TOKEN": "..."
  }
}
```

---

## ☁️ TIER 7 — Cloud & Infrastructure

### 39. AWS (16K searches · Official)
Query and manage AWS services — full suite.

```json
"aws": {
  "command": "npx",
  "args": ["-y", "@aws/aws-mcp-server"],
  "env": {
    "AWS_ACCESS_KEY_ID": "AKIA...",
    "AWS_SECRET_ACCESS_KEY": "...",
    "AWS_DEFAULT_REGION": "us-east-1"
  }
}
```

---

### 40. Azure (13K searches · Official)
Azure resource management.

```json
"azure": {
  "command": "npx",
  "args": ["-y", "@azure/mcp"],
  "env": {
    "AZURE_SUBSCRIPTION_ID": "...",
    "AZURE_TENANT_ID": "...",
    "AZURE_CLIENT_ID": "...",
    "AZURE_CLIENT_SECRET": "..."
  }
}
```

---

### 41. Cloudflare (2.3K searches · Official)
Workers, KV, D1, R2, DNS, Pages management.

```json
"cloudflare": {
  "command": "npx",
  "args": ["-y", "@cloudflare/mcp-server-cloudflare"],
  "env": { "CLOUDFLARE_API_TOKEN": "..." }
}
```

---

### 42. Vercel (3.1K searches · Official)
Deploy, manage domains, view logs, control environments.

```json
"vercel": {
  "command": "npx",
  "args": ["-y", "@vercel/mcp"],
  "env": { "VERCEL_TOKEN": "..." }
}
```

---

### 43. Netlify (Official)
Site management, build hooks, environment variables.

```json
"netlify": {
  "command": "npx",
  "args": ["-y", "@netlify/mcp"],
  "env": { "NETLIFY_AUTH_TOKEN": "..." }
}
```

---

### 44. Kubernetes (2.1K searches)
Manage pods, deployments, services, namespaces.

```json
"kubernetes": {
  "command": "npx",
  "args": ["-y", "mcp-server-kubernetes"]
}
```
Uses your `~/.kube/config`.

---

### 45. Terraform (3.2K searches)
Run plans, applies, manage state.

```json
"terraform": {
  "command": "npx",
  "args": ["-y", "terraform-mcp-server"]
}
```

---

## 🛒 TIER 8 — E-commerce & Payments

### 46. Shopify (5.4K searches · Official)
Products, orders, inventory, customers.

```json
"shopify": {
  "command": "npx",
  "args": ["-y", "@shopify/dev-mcp"],
  "env": {
    "SHOPIFY_ACCESS_TOKEN": "shpat_...",
    "MYSHOPIFY_DOMAIN": "your-store.myshopify.com"
  }
}
```

---

## 📁 TIER 9 — Productivity & Content

### 47. Google Drive (5.9K searches · Official)
Search, read, create Google Drive files.

```json
"gdrive": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-gdrive"],
  "env": { "GDRIVE_CREDENTIALS_PATH": "/path/to/credentials.json" }
}
```

---

### 48. Google Sheets (2.1K searches)
Read/write Sheets — reporting, data pipelines.

```json
"gsheets": {
  "command": "npx",
  "args": ["-y", "google-sheets-mcp"],
  "env": { "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/creds.json" }
}
```

---

### 49. Google Calendar (3.5K searches)
Read and create calendar events.

```json
"gcal": {
  "command": "npx",
  "args": ["-y", "google-calendar-mcp"],
  "env": { "GOOGLE_CREDENTIALS": "/path/to/credentials.json" }
}
```

---

### 50. Airtable (2.2K searches)
Read/write Airtable — lightweight database or CMS.

```json
"airtable": {
  "command": "npx",
  "args": ["-y", "airtable-mcp-server"],
  "env": { "AIRTABLE_API_KEY": "pat..." }
}
```

---

### 51. Obsidian (8.1K searches)
Read and write your Obsidian vault notes.

```json
"obsidian": {
  "command": "npx",
  "args": ["-y", "mcp-obsidian"],
  "env": { "OBSIDIAN_VAULT_PATH": "/path/to/vault" }
}
```

---

### 52. WordPress (3.5K searches)
Create posts, manage pages, handle media.

```json
"wordpress": {
  "command": "npx",
  "args": ["-y", "wordpress-mcp"],
  "env": {
    "WORDPRESS_URL": "https://yoursite.com",
    "WORDPRESS_USERNAME": "admin",
    "WORDPRESS_APP_PASSWORD": "..."
  }
}
```

---

## 🎨 TIER 10 — Design

### 53. Figma (74K searches · Official Dev Mode)
Live design structure, layers, variants for code generation.

```json
"figma": {
  "command": "npx",
  "args": ["-y", "figma-developer-mcp"],
  "env": { "FIGMA_API_KEY": "figd_..." }
}
```
Requires Figma Dev Mode (paid plan).

---

### 54. Magic UI
React + Tailwind component library for AI-assisted UI generation.

```json
"magicui": {
  "command": "npx",
  "args": ["-y", "@magicui/mcp"]
}
```

---

## 🔔 TIER 11 — Notifications & Automation

### 55. ntfy (Mobile Push)
Phone push notifications from agent flows.

```json
"ntfy": {
  "command": "npx",
  "args": ["-y", "ntfy-mcp-server"],
  "env": {
    "NTFY_TOPIC": "your-unique-topic",
    "NTFY_SERVER": "https://ntfy.sh"
  }
}
```

---

### 56. Zapier (10.8K searches)
Trigger 7,000+ automations from Claude Code.

```json
"zapier": {
  "command": "npx",
  "args": ["-y", "@zapier/mcp"],
  "env": { "ZAPIER_MCP_API_KEY": "..." }
}
```

---

### 57. n8n
Multi-step low-code workflow automation.

```json
"n8n": {
  "command": "npx",
  "args": ["-y", "n8n-mcp-server"],
  "env": {
    "N8N_BASE_URL": "http://localhost:5678",
    "N8N_API_KEY": "..."
  }
}
```

---

### 58. Pipedream
Trigger serverless code across 2,500 APIs.

```json
"pipedream": {
  "command": "npx",
  "args": ["-y", "@pipedream/mcp"],
  "env": { "PIPEDREAM_ACCESS_TOKEN": "..." }
}
```

---

## 🧠 TIER 12 — AI & Memory

### 59. Sequential Thinking (13K searches)
Forces explicit step-by-step reasoning before answering.

```json
"sequential-thinking": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
}
```

---

### 60. Chroma (Vector DB)
Semantic document retrieval for RAG.

```json
"chroma": {
  "command": "uvx",
  "args": ["chroma-mcp"],
  "env": { "CHROMA_HOST": "localhost", "CHROMA_PORT": "8000" }
}
```

---

### 61. MindsDB (39K stars)
Federated query engine across multiple databases and SaaS.

```json
"mindsdb": {
  "command": "npx",
  "args": ["-y", "@mindsdb/mcp-server-mindsdb"],
  "env": { "MINDSDB_HOST": "cloud.mindsdb.com", "MINDSDB_API_KEY": "..." }
}
```

---

## 📈 TIER 13 — Data & Analytics

### 62. HubSpot (3.8K searches · Official)
CRM automation — contacts, companies, deals, tickets.

```json
"hubspot": {
  "command": "npx",
  "args": ["-y", "@hubspot/mcp-server"],
  "env": { "HUBSPOT_ACCESS_TOKEN": "pat-..." }
}
```

---

### 63. Snowflake (3.6K searches)
Query Snowflake data warehouse.

```json
"snowflake": {
  "command": "npx",
  "args": ["-y", "snowflake-mcp"],
  "env": {
    "SNOWFLAKE_ACCOUNT": "your-account",
    "SNOWFLAKE_USER": "username",
    "SNOWFLAKE_PASSWORD": "password",
    "SNOWFLAKE_DATABASE": "MY_DB",
    "SNOWFLAKE_WAREHOUSE": "COMPUTE_WH"
  }
}
```

---

### 64. dbt (1.9K searches)
Run dbt models, tests, explore documentation.

```json
"dbt": {
  "command": "npx",
  "args": ["-y", "dbt-mcp"],
  "env": { "DBT_PROJECT_DIR": "/path/to/dbt/project" }
}
```

---

## 🧪 TIER 14 — Testing & QA

### 65. BrowserStack
Cross-browser and device testing in the cloud.

```json
"browserstack": {
  "command": "npx",
  "args": ["-y", "@browserstack/mcp-server"],
  "env": {
    "BROWSERSTACK_USERNAME": "...",
    "BROWSERSTACK_ACCESS_KEY": "..."
  }
}
```

---

### 66. Puppeteer (7.3K searches · Official)
Browser automation alternative to Playwright.

```json
"puppeteer": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-puppeteer"],
  "env": { "PUPPETEER_HEADLESS": "true" }
}
```

---

## 🎨 TIER 15 — Media & Creative

### 67. Excalidraw
Generate architecture diagrams and sketches.

```json
"excalidraw": {
  "command": "npx",
  "args": ["-y", "excalidraw-mcp-server"]
}
```

---

### 68. Spotify
Search, queue, and switch playlists from your editor.

```json
"spotify": {
  "command": "npx",
  "args": ["-y", "spotify-mcp"],
  "env": {
    "SPOTIFY_CLIENT_ID": "...",
    "SPOTIFY_CLIENT_SECRET": "...",
    "SPOTIFY_REDIRECT_URI": "http://localhost:8080"
  }
}
```

---

## 🔐 TIER 16 — Security & Compliance

### 69. Snyk
Real-time CVE scanning for dependencies.

```json
"snyk": {
  "command": "npx",
  "args": ["-y", "snyk-mcp"],
  "env": { "SNYK_TOKEN": "..." }
}
```

---

### 70. Salesforce (6.5K searches)
CRM, opportunities, leads, accounts.

```json
"salesforce": {
  "command": "npx",
  "args": ["-y", "salesforce-mcp"],
  "env": {
    "SF_CLIENT_ID": "...",
    "SF_CLIENT_SECRET": "...",
    "SF_USERNAME": "...",
    "SF_PASSWORD": "..."
  }
}
```

---

## Additional Servers (71–100)

| # | Server | Install | What it does |
|---|---|---|---|
| 71 | **Google Maps** | `npx mcp-server-google-maps` | Location data, POIs |
| 72 | **Convex** | `npx convex-mcp` | Full-stack BaaS |
| 73 | **Milvus** | `npx mcp-server-milvus` | Vector DB |
| 74 | **SQLite** | `npx @modelcontextprotocol/server-sqlite` | Embedded SQL |
| 75 | **Serena** | `npx serena-mcp` | Symbolic code understanding (24K stars) |
| 76 | **Skyvern** | `pip install skyvern` | Browser automation with computer vision |
| 77 | **Last9** | `npx last9-mcp-server` | Reliability engineering |
| 78 | **Weaviate** | `npx mcp-server-weaviate` | Semantic vector search |
| 79 | **Cognee** | `uvx cognee-mcp` | Graph-RAG knowledge |
| 80 | **Google Search Console** | `npx google-search-console-mcp` | SEO organic data |
| 81 | **Ahrefs** | `npx ahrefs-mcp` | SEO research |
| 82 | **Resend** | `npx resend-mcp` | Transactional email API |
| 83 | **Algolia** | `npx algolia-mcp` | Search infrastructure |
| 84 | **Pinecone** | `npx pinecone-mcp` | Vector DB |
| 85 | **Upstash** | `npx upstash-mcp` | Redis serverless |
| 86 | **Liveblocks** | `npx liveblocks-mcp` | Real-time collaboration |
| 87 | **Cloudinary** | `npx cloudinary-mcp` | Media management |
| 88 | **Webflow** | `npx webflow-mcp` | Website CMS |
| 89 | **Framer** | `npx framer-mcp` | Design-to-code |
| 90 | **PlanetScale** | `npx planetscale-mcp` | MySQL-compatible DB |
| 91 | **Turso** | `npx turso-mcp` | Edge SQLite |
| 92 | **Supabase Realtime** | via Supabase MCP | Realtime subscriptions |
| 93 | **Neon** | `npx @neondatabase/mcp-server-neon` | (see #19) |
| 94 | **MindsDB** | (see #61) | — |
| 95 | **BrowserStack** | (see #65) | — |
| 96 | **Task Master** | (see #36) | — |
| 97 | **Pipedream** | (see #58) | — |
| 98 | **Chrome DevTools** | `npx chrome-devtools-mcp` | Console, Network, Perf |
| 99 | **Magic UI** | (see #54) | — |
| 100 | **Jina Reader** | (see #26) | — |

---

## Quick-Start Bundles

### Indie SaaS Builder (Start here — 5 servers)
```json
{
  "mcpServers": {
    "github": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-github"], "env": {"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."} },
    "memory": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-memory"] },
    "postgres": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"] },
    "stripe": { "command": "npx", "args": ["-y", "@stripe/agent-toolkit"], "env": {"STRIPE_SECRET_KEY": "sk_test_..."} },
    "context7": { "command": "npx", "args": ["-y", "@upstash/context7-mcp@latest"] }
  }
}
```

### Full-Stack Developer (10 servers)
Add to Indie SaaS: `playwright`, `sentry`, `linear`, `slack`, `sequential-thinking`

### Data & Analytics
`postgres` + `snowflake` + `grafana` + `firecrawl` + `fetch` + `dbt`

### Content & Marketing
`notion` + `wordpress` + `gmail` + `google-sheets` + `brave-search` + `firecrawl`

### DevOps & Infrastructure
`github` + `kubernetes` + `terraform` + `aws` + `datadog` + `docker`

### Research & Knowledge
`memory` + `context7` + `brave-search` + `firecrawl` + `sequential-thinking` + `obsidian`

---

## Security Best Practices

- Use **read-only database connections** unless write access is explicitly needed
- Store API keys as environment variables, never hardcode in config files
- Use project-level `.claude/mcp.json` for project-specific servers
- Start with minimum GitHub token scopes (`read:org`) — expand only if needed
- For production databases: create a dedicated read-only MCP user

---
