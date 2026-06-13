# MCP: Auth0

Connect Claude Code to Auth0 for identity and access management — query users, manage roles, inspect login logs, and take remediation actions without leaving your terminal.

## Why you need this

User access issues — locked accounts, suspicious login patterns, role mismatches — require constant context switching between your code and the Auth0 Management Dashboard. The Auth0 MCP brings that data into Claude, so you can investigate an incident, block a compromised account, or audit role assignments in one conversation.

## Prerequisites

- Auth0 account (any plan; Management API access is available on all plans including free)
- A **Machine-to-Machine (M2M) application** registered in your Auth0 tenant, authorized to call the Auth0 Management API
- The M2M application's **Client ID** and **Client Secret**
- Your Auth0 **domain** (e.g., `your-tenant.us.auth0.com`)

## Installation

Install the official Auth0 MCP server via npx — no global install required.

```bash
npx @auth0/auth0-mcp-server --version
```

## Configuration

Add the following to your `~/.claude/settings.json` (user-level) or `.claude/settings.json` (project-level):

```json
{
  "mcpServers": {
    "auth0": {
      "command": "npx",
      "args": ["-y", "@auth0/auth0-mcp-server"],
      "env": {
        "AUTH0_DOMAIN": "your-tenant.us.auth0.com",
        "AUTH0_CLIENT_ID": "YOUR_M2M_CLIENT_ID",
        "AUTH0_CLIENT_SECRET": "YOUR_M2M_CLIENT_SECRET"
      }
    }
  }
}
```

Replace `your-tenant.us.auth0.com` with your actual Auth0 domain — visible in the Auth0 Dashboard under **Applications → your M2M app → Domain**.

## Key tools

| Tool | Description | Key parameters |
|---|---|---|
| `list_users` | Search and list users in the tenant | `q` (Lucene query), `per_page`, `page`, `sort` |
| `get_user` | Fetch full profile for a single user | `id` (Auth0 user ID, e.g., `auth0|abc123`) |
| `create_user` | Create a new user in a database connection | `email`, `password`, `connection`, `name` |
| `assign_roles` | Assign one or more roles to a user | `id`, `roles` (array of role IDs) |
| `list_applications` | List all applications registered in the tenant | `per_page`, `page` |
| `get_logs` | Retrieve tenant log events with filter support | `q` (event type, user, IP), `per_page`, `from`, `take` |
| `block_user` | Block a user account (prevents login) | `id` |

## Usage examples

```
List all users who signed up in the last 7 days

Block the account for user email@example.com immediately

Show all failed login attempts from the last 24 hours

Assign the "admin" role to user auth0|64a1f2b3c4d5e6f7a8b9c0d1

List all applications registered in this Auth0 tenant
```

## Authentication — creating the M2M application

1. Log in to the Auth0 Dashboard and go to **Applications → Create Application**
2. Choose **Machine to Machine Applications** and name it (e.g., `claude-code-mcp`)
3. On the next screen, select **Auth0 Management API** as the authorized API
4. Grant the scopes your use case requires (see Scopes below) and click **Authorize**
5. Go to the **Settings** tab of your new M2M app and copy the **Domain**, **Client ID**, and **Client Secret**
6. Paste all three into the `env` block in settings.json

**Minimum required scopes by operation:**

| Operation | Required scope |
|---|---|
| Read users | `read:users` |
| Create users | `create:users` |
| Block/unblock users | `update:users` |
| Assign roles | `update:users`, `read:roles` |
| Read logs | `read:logs` |
| List applications | `read:clients` |

Grant only the scopes you need. Avoid `read:client_keys` — it exposes client secrets for all applications.

## Tips

- Auth0 user IDs follow the format `provider|id` — for database connections it is `auth0|hex_id`. Use `list_users` with `q:email:user@example.com` to find the ID before running single-user operations.
- `get_logs` supports Auth0's event type codes in the query: `q=type:f` returns all failed logins; `q=type:s` returns successes. Full event type reference is in the Auth0 docs under Log Event Type Codes.
- `block_user` is reversible — use `update_user` with `blocked: false` (or the equivalent MCP tool if exposed) to unblock. Blocking does not invalidate existing sessions — pair it with a call to revoke active sessions if immediate lockout is required.
- The Management API has a rate limit of 2 requests/second per tenant on free plans, and higher limits on paid plans. Avoid looping `get_user` calls in tight sequences.
- M2M tokens issued by Auth0 expire after 24 hours by default. The MCP server handles token refresh automatically — no manual rotation needed.
- For multi-tenant architectures (one Auth0 tenant per customer), you will need a separate MCP config per tenant. Consider using project-level settings.json scoped to each project.

## Cost notes

Auth0 Management API calls are included in all Auth0 plans — there are no per-call fees. However, free plans cap at 1,000 active users and enforce Management API rate limits. Production tenants on paid plans have higher rate limits and user capacity. Check your plan's Management API quota under **Settings → Tenant Settings** in the Auth0 Dashboard.

---
