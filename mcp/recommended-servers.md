# MCP Recommended Servers

A practical guide to MCP servers worth enabling in Claude Code. Organized by category with token cost estimates and clear guidance on when to use each.

---

## Token Budget Awareness

Every enabled MCP server contributes its tool descriptions to Claude's context window.

| MCP servers enabled | Approximate token cost |
|--------------------|----------------------|
| 3 servers (~10 tools) | ~10,000 tokens |
| 10 servers (~30 tools) | ~30,000 tokens |
| 20 servers (~60 tools) | ~60,000 tokens |

With a 200k token window, 10 active MCPs consume ~15% of your context before any conversation. Be selective. Disable servers you're not actively using.

---

## Filesystem & Search

### `@modelcontextprotocol/server-filesystem`
```bash
npx -y @modelcontextprotocol/server-filesystem /path/to/project
```
- **What it gives:** Read, write, list, and search files with configurable path restrictions
- **Token cost:** ~2,000 tokens
- **Use when:** You want Claude to explore a codebase directory beyond the current working dir
- **Avoid when:** Claude Code's built-in Read/Write tools already cover your project

### `@modelcontextprotocol/server-brave-search` or `tavily`
```bash
npx -y @modelcontextprotocol/server-brave-search
```
- **What it gives:** Web search from within Claude
- **Token cost:** ~1,500 tokens
- **Use when:** Agents need current information (docs, news, package versions) not in training data
- **Avoid when:** You only need code generation, no web lookups needed

---

## Databases

### `@modelcontextprotocol/server-postgres`
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
    }
  }
}
```
- **What it gives:** Query, inspect schema, list tables — direct DB access from Claude
- **Token cost:** ~3,000 tokens
- **Use when:** Schema exploration, writing complex queries, debugging data issues
- **Avoid when:** Production database — use a read-only replica or dev DB only
- **Security:** Never point at production DB. Use a read-only user at minimum.

### `@modelcontextprotocol/server-sqlite`
- **What it gives:** Same as postgres but for SQLite files
- **Token cost:** ~2,500 tokens
- **Use when:** Local development with SQLite, embedded databases

---

## APIs & Services

### `@modelcontextprotocol/server-github`
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "<token>" }
    }
  }
}
```
- **What it gives:** Read issues, PRs, commits, files from GitHub repos
- **Token cost:** ~4,000 tokens
- **Use when:** Reviewing PRs, triaging issues, fetching context from remote repos
- **Avoid when:** You only need local git context (git CLI is faster)

### `@modelcontextprotocol/server-linear`
- **What it gives:** Create, update, and query Linear issues and projects
- **Token cost:** ~3,000 tokens
- **Use when:** Issue tracking integrated into development workflow

### `stripe-mcp` (Stripe official)
```bash
npx -y @stripe/mcp --api-key sk_test_...
```
- **What it gives:** Create customers, products, prices, checkout sessions; query payments
- **Token cost:** ~5,000 tokens
- **Use when:** Building Stripe integrations, testing payment flows
- **Avoid when:** Production Stripe keys — use test mode only in development

---

## Browser & Testing

### `@modelcontextprotocol/server-puppeteer`
- **What it gives:** Launch a browser, navigate pages, click elements, take screenshots
- **Token cost:** ~3,500 tokens
- **Use when:** Testing web UIs, scraping, automating browser interactions
- **Avoid when:** API testing — overkill, use fetch/curl

### `@playwright/mcp`
```bash
npx -y @playwright/mcp@latest
```
- **What it gives:** Playwright automation — more reliable than Puppeteer for modern SPAs
- **Token cost:** ~4,000 tokens
- **Use when:** E2E test writing, UI verification, complex browser automation
- **Recommended over Puppeteer** for Next.js / React apps

---

## AI & Reasoning

### `@modelcontextprotocol/server-memory`
```bash
npx -y @modelcontextprotocol/server-memory
```
- **What it gives:** A knowledge graph that persists across sessions — entities, relations, observations
- **Token cost:** ~2,000 tokens
- **Use when:** Long-running projects where you want Claude to remember context between sessions
- **Avoid when:** Single-session tasks — overhead without benefit

### `@modelcontextprotocol/server-sequential-thinking`
- **What it gives:** Forces Claude through explicit reasoning steps before answering
- **Token cost:** ~1,500 tokens
- **Use when:** Complex multi-step problem solving, architectural decisions
- **Avoid when:** Simple queries — adds latency with no benefit

---

## Configuration Template

Add servers to `~/.claude/settings.json` (global) or `.claude/settings.json` (project):

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "${DATABASE_URL}"]
    }
  }
}
```

Use environment variable references (`${VAR}`) instead of hardcoded secrets.

---
