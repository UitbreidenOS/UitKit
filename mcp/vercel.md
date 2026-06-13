# MCP: Vercel

Manage Vercel deployments, projects, domains, and environment variables from inside Claude Code — without opening the dashboard or copy-pasting deployment logs.

## Why you need this

Deployment debugging normally means: open Vercel dashboard, find the failed deployment, scroll through build logs, copy the error, paste into your editor. The Vercel MCP collapses that into a single request. Claude pulls the logs, reads the error, traces it to the source file, and suggests the fix — all in context.

## Installation

```bash
npm install -g @vercel/mcp-server
```

## Configuration

```json
{
  "mcpServers": {
    "vercel": {
      "command": "npx",
      "args": ["-y", "@vercel/mcp-server"],
      "env": {
        "VERCEL_TOKEN": "YOUR_VERCEL_TOKEN",
        "VERCEL_TEAM_ID": "YOUR_TEAM_ID"
      }
    }
  }
}
```

`VERCEL_TEAM_ID` is only required for team or organization deployments. Personal projects work with the token alone.

## Key tools

| Tool | What it does |
|---|---|
| `list_deployments` | List recent deployments for a project with status |
| `get_deployment` | Full deployment detail including build metadata |
| `create_deployment` | Trigger a new deployment from a branch or commit |
| `list_projects` | List all projects in the account or team |
| `get_project` | Project configuration and framework settings |
| `list_domains` | All custom domains attached to a project |
| `add_domain` | Attach a new custom domain |
| `list_env_vars` | List environment variables (values masked by default) |
| `upsert_env_var` | Add or update an environment variable (insert or overwrite) |
| `delete_env_var` | Remove an environment variable |
| `get_deployment_logs` | Stream build and runtime logs for a deployment |
| `rollback_deployment` | Instantly roll back to the previous production deployment |

## Usage examples

```
Show me the last 5 deployments for my-app and their status

What errors appeared in the last failed deployment of the checkout service?

Add the STRIPE_SECRET_KEY env var to production — value is sk_live_xxx

Roll back production to the previous deployment immediately

List all custom domains attached to the storefront project

Why did the build fail 20 minutes ago? Show me the full logs.
```

## Authentication

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click **Create Token** — name it something identifiable (e.g., `claude-mcp`)
3. Set scope to **Full Account** for personal projects, or select a specific team
4. Copy the token — it is displayed once
5. For team deployments: find your Team ID under **Team Settings → General**

## Tips

- `get_deployment_logs` is the primary reason to install this MCP — piping live logs into Claude's context is faster than any manual debugging workflow.
- `rollback_deployment` does not re-run the build — it promotes the previous immutable deployment to production instantly. Zero downtime.
- Combine with the GitHub MCP to build a full loop: PR merges → deployment triggers → logs confirm success → done.
- Environment variables added via `upsert_env_var` take effect on the next deployment — they are not hot-reloaded.
- Use `list_env_vars` to audit which env vars exist before upserting; `upsert_env_var` silently overwrites existing values.
- Preview deployments (from PRs) and production deployments are separate — specify the target environment when running env var operations.

---
