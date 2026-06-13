# MCP: PagerDuty

Connect Claude Code to PagerDuty for incident management — list active incidents, check on-call schedules, acknowledge and resolve alerts, and create new incidents without leaving your terminal.

## Why you need this

During an incident, switching to the PagerDuty UI breaks focus. The PagerDuty MCP lets Claude query live incident state, identify who is on call, and take acknowledge/resolve actions directly — keeping you in your editor while you work the problem.

## Prerequisites

- PagerDuty account (any plan with REST API access)
- A **REST API Key** — found under **User Settings → API Access Keys** (user token) or **Integrations → API Access Keys** (account-level token; requires Admin)
- Your email address associated with the PagerDuty account (required for write operations)

## Installation

The PagerDuty MCP server is available as an npx package. No global install required.

```bash
npx @pagerduty/mcp --version
```

Alternatively, PagerDuty supports an SSE remote endpoint for teams that prefer not to run a local process. See Configuration below for both options.

## Configuration

**Option A — npx (recommended for local use):**

```json
{
  "mcpServers": {
    "pagerduty": {
      "command": "npx",
      "args": ["-y", "@pagerduty/mcp"],
      "env": {
        "PD_API_TOKEN": "YOUR_PAGERDUTY_REST_API_KEY",
        "PD_USER_EMAIL": "you@yourcompany.com"
      }
    }
  }
}
```

**Option B — SSE remote endpoint:**

```json
{
  "mcpServers": {
    "pagerduty": {
      "transport": "sse",
      "url": "https://mcp.pagerduty.com/sse",
      "headers": {
        "Authorization": "Token token=YOUR_PAGERDUTY_REST_API_KEY"
      }
    }
  }
}
```

Use Option B if your team wants a shared, centrally managed connection without distributing API tokens to individual developer machines.

## Key tools

| Tool | Description | Key parameters |
|---|---|---|
| `list_incidents` | List incidents with status and urgency filters | `status` (`triggered`, `acknowledged`, `resolved`), `urgency` (`high`, `low`), `service_ids`, `limit` |
| `get_incident` | Fetch full detail for a single incident | `incident_id` |
| `acknowledge_incident` | Acknowledge an incident (stops escalation) | `incident_id` |
| `resolve_incident` | Resolve an incident | `incident_id`, `resolution_note` |
| `list_services` | List all PagerDuty services in the account | `query` (name filter) |
| `get_on_call` | Get the current on-call user(s) for a schedule or escalation policy | `schedule_ids`, `escalation_policy_ids`, `since`, `until` |
| `create_incident` | Open a new incident on a service | `title`, `service_id`, `urgency`, `body` |

## Usage examples

```
Who is on call right now for the payments service?

List all open P1 incidents across the organization

Acknowledge incident INC-123456 and leave a note that I'm investigating

Resolve INC-789012 with resolution note "Rolled back deploy v2.4.1"

Create a high-urgency incident on the checkout service titled "Database connection pool exhausted"
```

## Authentication

**User API token (read + write for your own user):**
1. Log in to PagerDuty and go to **User Icon → My Profile → User Settings → Create API User Token**
2. Copy the token value — it is shown only once
3. Paste into `PD_API_TOKEN` in your settings.json

**Account-level API token (full account access, requires Admin role):**
1. Go to **Integrations → API Access Keys → Create New API Key**
2. Label it clearly (e.g., `claude-code-mcp`) and copy the value

Acknowledge and resolve operations require `PD_USER_EMAIL` to be set to the email of the user associated with the token. Write operations performed via an account-level token also require the email field for audit log attribution.

## Tips

- `list_incidents` with `status:triggered` gives you all unacknowledged firing incidents — the fastest way to assess blast radius during an outage.
- `get_on_call` accepts a time window (`since`, `until`) so you can check future on-call rotations, not just the current moment.
- PagerDuty incident IDs in the API are numeric (e.g., `P1234AB`) — you can find them in the URL of any incident detail page.
- `create_incident` requires a valid `service_id`. Use `list_services` first if you don't have the ID memorized.
- Resolving incidents via MCP still triggers PagerDuty's normal post-incident notification flow — stakeholders will be notified as configured.
- For accounts on PagerDuty's AIOps or Event Intelligence plan, incident merging and alert correlation data is available via additional tools not listed here — check the package changelog for newly added tools.

## Cost notes

The PagerDuty MCP uses PagerDuty's REST API v2, which is included in all paid plans. There are no per-call fees. Rate limits are enforced at 960 requests/minute per API token for most endpoints — well above interactive use, but relevant for automated workflows.

---
