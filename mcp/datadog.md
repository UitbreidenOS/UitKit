# MCP: Datadog

Connect Claude Code to Datadog for real-time observability — query metrics, search logs, inspect APM traces, and manage monitors without leaving your terminal.

## Why you need this

Debugging a latency spike or production incident means jumping between Datadog dashboards, copying metric queries, pasting results into Claude, and losing momentum. The Datadog MCP eliminates that context switch — Claude queries your live metrics, logs, and traces in-context and helps you diagnose and act immediately.

## Prerequisites

- Datadog account with API access (any paid plan)
- An **API Key** — found under **Organization Settings → API Keys**
- An **Application Key** — found under **Organization Settings → Application Keys** (application keys are user-scoped; use a service account for shared use)
- For EU or GovCloud deployments, your `DD_SITE` value (see Configuration below)

## Installation

Install the official Datadog MCP server via npx — no global install required.

```bash
npx @datadog/mcp-datadog --version
```

If the package resolves without error, you are ready to configure.

## Configuration

Add the following to your `~/.claude/settings.json` (user-level) or `.claude/settings.json` (project-level):

```json
{
  "mcpServers": {
    "datadog": {
      "command": "npx",
      "args": ["-y", "@datadog/mcp-datadog"],
      "env": {
        "DD_API_KEY": "YOUR_DD_API_KEY",
        "DD_APP_KEY": "YOUR_DD_APP_KEY",
        "DD_SITE": "datadoghq.com"
      }
    }
  }
}
```

**`DD_SITE` values by region:**

| Region | Value |
|---|---|
| US1 (default) | `datadoghq.com` |
| US3 | `us3.datadoghq.com` |
| US5 | `us5.datadoghq.com` |
| EU1 | `datadoghq.eu` |
| GovCloud | `ddog-gov.com` |

Leave `DD_SITE` unset if you are on the default US1 region.

## Key tools

| Tool | Description | Key parameters |
|---|---|---|
| `query_metrics` | Run a Datadog metrics query over a time window | `query` (DDog query string), `from`, `to` |
| `search_logs` | Search log events with filter syntax | `query`, `from`, `to`, `limit` |
| `list_dashboards` | List all dashboards in the org | `filter_name` |
| `get_monitors` | Retrieve monitors with optional status filter | `status` (`Alert`, `Warn`, `OK`, `No Data`), `tags` |
| `create_incident` | Open a new incident in Datadog Incident Management | `title`, `severity`, `customer_impacted` |
| `query_apm_traces` | Search APM traces by service, operation, or resource | `service`, `operation`, `resource`, `from`, `to`, `limit` |

## Usage examples

```
Show p99 latency for /api/checkout over the last 1 hour

Find all ERROR-level log entries in payment-service from the last 30 minutes

List all monitors currently in ALERT state

What APM traces are slowest for the orders service in the last 15 minutes?

Create a Sev-2 incident titled "Elevated error rate on checkout service"
```

## Authentication

1. Log in to Datadog and go to **Organization Settings → API Keys**
2. Create a new API key — note the key value (shown only once)
3. Go to **Organization Settings → Application Keys**
4. Create an application key scoped to your user or a service account
5. Add both values to the `env` block in your settings.json as shown above

Minimum permissions for the application key: `metrics_read`, `logs_read`, `monitors_read`, `apm_read`. Add `incidents_write` if you want `create_incident` to work.

## Tips

- Datadog metric queries use the same syntax as the Metrics Explorer: `avg:system.cpu.user{service:checkout}`. Copy directly from the UI.
- The `from` and `to` parameters accept Unix timestamps or relative strings like `now-1h`.
- `search_logs` uses Datadog log query syntax — facet filters like `service:payment-service @http.status_code:500` work as expected.
- `get_monitors` with `status:Alert` is the fastest way to get a snapshot of active firing conditions during an incident.
- For high-cardinality APM queries, set a `limit` (default is usually 100) to avoid slow responses.
- Application keys are user-scoped by default — if multiple team members use this MCP, create a shared service account application key to avoid permission drift when someone leaves.
- Launched March 2026 as part of Datadog's official MCP program.

## Cost notes

All MCP calls consume Datadog API quota. Metrics queries and log searches count against your plan's API rate limits. Avoid running high-frequency automated queries (e.g., via hooks) without reviewing your plan's limits — Datadog enforces per-second and per-hour API caps at the organization level.

---
