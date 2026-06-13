# MCP: Atlassian

Connect Claude Code to Jira and Confluence. Read tickets, update issue status, write documentation, run JQL queries, and link commits to issues — without opening a browser or leaving your development workflow.

## Why you need this

Project management and documentation live in Atlassian, but context-switching between Jira, Confluence, and your editor kills flow. With Atlassian MCP:
- Sprint planning, ticket triage, and status updates happen inside the same session as your code changes
- Claude can link what it just built directly to the Jira ticket that asked for it
- Confluence documentation stays in sync with implementation because Claude can write both at once
- JQL queries let you slice sprint data, find blockers, or audit workload without loading the board UI
- Release notes, retro summaries, and architecture docs get generated from real ticket data, not memory

## Installation

Install via Atlassian's official MCP package from the Atlassian developer portal or npm:

```bash
npm install -g @atlassian/mcp
```

If the package is available via direct download from the Atlassian developer portal, follow the platform-specific installer and note the binary path for the config block below.

## Configuration

Add to `~/.claude.json` or project `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "atlassian": {
      "command": "npx",
      "args": ["-y", "@atlassian/mcp"],
      "env": {
        "ATLASSIAN_API_TOKEN": "your-atlassian-api-token",
        "ATLASSIAN_EMAIL": "you@yourcompany.com",
        "ATLASSIAN_BASE_URL": "https://your-org.atlassian.net"
      }
    }
  }
}
```

Replace `your-org` with your actual Atlassian subdomain.

## Key tools

**Jira**

- `get_issue` — fetch a Jira issue with full details: description, comments, status, assignee, linked issues
- `create_issue` — create a new ticket with type, summary, description, assignee, labels, and priority
- `update_issue` — update any field on an existing issue
- `search_issues` — run a JQL query and return matching issues
- `get_project` — fetch project metadata and board configuration
- `add_comment` — add a comment to any issue
- `transition_issue` — move an issue through the workflow (e.g., To Do → In Progress → Done)
- `get_sprint` — get all issues in the current or a specified sprint

**Confluence**

- `get_page` — fetch a Confluence page by ID or title with full body content
- `create_page` — create a new page in a specified space
- `update_page` — update the content of an existing page
- `search_content` — full-text search across all Confluence spaces

## Usage examples

```
Find all tickets in the current sprint assigned to me and summarize
what's left to do, grouped by status.
```

```
I just fixed PROJ-123 — transition it to Done and add a comment
with a link to PR #456 and a one-sentence summary of the fix.
```

```
Search Confluence for our authentication architecture documentation
and summarize the key design decisions and open questions.
```

```
Search the codebase for all TODO comments, then create a Jira ticket
for each one in the TECH project, assigned to me, with the file path
and line number in the description.
```

```
Generate release notes from all tickets transitioned to Done in the
last sprint and create a new Confluence page in the Engineering space
titled "Release Notes — Sprint 42".
```

## Authentication

1. Log in to your Atlassian account and go to **Account settings → Security → API tokens**
2. Click **Create API token**, give it a label, and copy the value immediately (it won't be shown again)
3. Set the three required env vars:
   - `ATLASSIAN_API_TOKEN` — the token you just copied
   - `ATLASSIAN_EMAIL` — the email address on your Atlassian account
   - `ATLASSIAN_BASE_URL` — your instance URL, e.g. `https://acme.atlassian.net`
4. The token uses HTTP Basic auth: email as username, token as password

**OAuth vs API token:** API tokens are simpler and sufficient for personal or small-team use. Use Atlassian OAuth 2.0 (3-legged) if you are building a server-side integration that acts on behalf of multiple users.

## Tips

**JQL syntax:** `search_issues` accepts any valid JQL. Useful patterns:
- Current sprint: `sprint in openSprints() AND assignee = currentUser()`
- Blockers: `issueType = Bug AND priority = Highest AND status != Done`
- Recent changes: `updated >= -7d AND project = PROJ ORDER BY updated DESC`

**Pagination:** Large JQL result sets are paginated. If you need all results, tell Claude to fetch subsequent pages using the `startAt` offset until the total is exhausted.

**Confluence page IDs:** The page ID appears in the Confluence URL as `/pages/123456789/`. Use this when calling `get_page` or `update_page` for precision — title-based lookups can be ambiguous in large spaces.

**Combining Jira and Confluence:** The most powerful workflows involve both. Fetch sprint tickets with `search_issues`, summarize the work, and write the output to a Confluence page with `create_page` — all in one prompt.

**Do not commit credentials:** Keep `ATLASSIAN_API_TOKEN` in your global `~/.claude.json`, not a project-level `.claude/mcp.json` that might be committed to version control.

---
