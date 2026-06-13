# MCP: Neon

Manage Neon Postgres databases directly from Claude Code — create projects, execute SQL, branch databases for safe migrations, and retrieve connection strings without leaving your editor.

## Why you need this

Database work during development has two failure modes: running migrations directly on production (dangerous) and maintaining a separate local Postgres instance (friction). Neon solves both. Its branching model lets you create an isolated copy of any database in ~2 seconds. With the Neon MCP, Claude can branch, migrate, validate, and clean up — all in one conversation.

## Installation

No installation required. Neon MCP is a remote server accessed via SSE transport.

## Configuration

```json
{
  "mcpServers": {
    "neon": {
      "transport": "sse",
      "url": "https://mcp.neon.tech/sse",
      "headers": {
        "Authorization": "Bearer YOUR_NEON_API_KEY"
      }
    }
  }
}
```

Replace `YOUR_NEON_API_KEY` with your key (see Authentication below).

## Key tools

| Tool | What it does |
|---|---|
| `create_project` | Create a new Neon project |
| `list_projects` | List all projects in your account |
| `get_project` | Fetch project detail including region, Postgres version, and settings |
| `execute_sql` | Run arbitrary SQL against any database or branch |
| `create_branch` | Branch a database from main, a named branch, or a timestamp |
| `list_branches` | List all branches for a project |
| `delete_branch` | Delete a branch when done |
| `get_connection_string` | Return the connection string for a project/branch, formatted for a given ORM |
| `run_migration` | Apply a migration file against a specified branch |
| `get_schema` | Introspect the full schema for a database or branch |

## Usage examples

```
Create a new Neon project called my-app with a database named app_db

Branch the production database for this migration test

Run this migration SQL on the feature-auth branch and show me the result

Compare the schema between the main branch and the feature-auth branch

Give me the Prisma connection string for the staging database

Delete the feature-auth branch — migration is merged
```

## Authentication

1. Log in to [console.neon.tech](https://console.neon.tech)
2. Go to **Account Settings → API Keys**
3. Generate a new API key — give it a descriptive name (e.g., `claude-mcp`)
4. Copy the key value immediately — it is not shown again
5. Add it to the `Authorization` header in the config block above

## Tips

- Branch creation takes approximately 2 seconds regardless of database size — use a branch for every migration test run, not just risky ones.
- Neon Remote MCP launched February 2026 as part of Neon's official developer tooling.
- `get_connection_string` auto-formats for Drizzle, Prisma, and psycopg2 — specify your ORM in the request.
- Branches are copy-on-write at the storage layer, so they use minimal disk space until writes diverge.
- Use `create_branch` with a timestamp argument to reproduce a bug that occurred at a specific point in time.
- After validating a migration on a branch, use `execute_sql` on main to apply it — or wire this into a deployment workflow with the GitHub MCP.
- Free tier includes 10 branches per project — more than enough for active development.

---
