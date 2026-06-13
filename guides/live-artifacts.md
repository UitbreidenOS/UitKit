# Live Artifacts — Data-Connected Interactive Outputs

Live artifacts are Claude outputs that connect to live data sources and auto-refresh when opened. Unlike static artifacts — which are generated once and frozen — live artifacts pull from APIs, MCP servers, databases, and spreadsheets at view time to show current data.

---

## What Makes an Artifact Live

A live artifact differs from a static artifact in one fundamental way: it fetches data at open time, not at creation time.

- **Connects on open**: each time the artifact URL is opened, it queries the configured data sources
- **Auto-refreshes on view**: data is current as of the moment the artifact renders — not when it was first generated
- **Persists in Cowork sidebar**: live artifacts are saved and listed alongside other artifacts; static ones are ephemeral unless pinned
- **Shareable URL**: every live artifact gets a stable URL; access control is set per artifact
- **iframe embeddable**: paste the embed snippet into Notion, Confluence, or any tool that accepts iframes

---

## Data Source Types

| Source type | How Claude connects | Example |
|-------------|--------------------|---------| 
| MCP server | Any connected MCP tool is available as a data source | Postgres MCP → live query results |
| REST API | Describe the endpoint; Claude generates the fetch call | GitHub API → open PR count |
| Database (via MCP) | SQL query embedded in the artifact | Supabase → user metrics |
| Google Sheets / CSV | Attach via Google Drive connector (Cowork) | Budget tracker → live chart |
| GitHub | Repository data via GitHub API or MCP | Commit activity, issue counts |

The data source must remain accessible for the artifact to refresh. If an MCP server goes offline or an API key expires, the artifact shows the last cached result with a stale-data warning.

---

## Creating a Live Artifact

Describe the desired output and reference the data source explicitly in your prompt. Claude generates the artifact and wires the data connection.

**Single-source example:**

```
"Create a live artifact showing the current open issue count by label 
from our GitHub repo (owner: acme, repo: api-service). 
Show as a bar chart, refresh on every open."
```

**Multi-source dashboard example:**

```
"Create a live dashboard artifact with three panels:
1. Open PR count from GitHub (acme/api-service)
2. Current row count from the 'users' table via the Postgres MCP
3. Last 7 days of signups from the Google Sheet at [URL]

Refresh all three panels on open. Layout: horizontal, equal-width panels."
```

Claude generates the artifact, embeds the data-fetching logic, and registers the data source connections. The artifact appears in your sidebar immediately.

---

## Sharing and Embedding

**Share link:**

Every live artifact has a share button. Clicking it generates a public URL (or a workspace-restricted URL for private artifacts). Anyone with the link sees the artifact with live data when they open it — no Claude account required for public artifacts.

**Iframe embed:**

```html
<!-- Paste into Notion, Confluence, Linear, or any iframe-capable tool -->
<iframe
  src="https://claude.ai/artifacts/live/a1b2c3d4"
  width="100%"
  height="400"
  frameborder="0"
></iframe>
```

**Access control:**

| Access level | Who can view | Plan required |
|-------------|-------------|---------------|
| Public | Anyone with the link | Pro+ |
| Workspace | Members of your Claude team | Team or Enterprise |
| Private | Only you | Pro+ |

---

## Live Artifact vs. Static Artifact

| Property | Live artifact | Static artifact |
|----------|--------------|-----------------|
| Data freshness | Current at open time | Snapshot at creation time |
| Persistence | Saved to sidebar | Ephemeral unless pinned |
| Sharing | Stable URL, shareable | Copy/paste content only |
| Data sources | APIs, MCP, databases, sheets | None — generated content only |
| Plan required | Pro+ (live connections) | All plans |
| Refresh trigger | On open (+ optional interval) | N/A |

---

## Limitations

- The underlying data source must stay accessible — artifacts do not store a full data cache between views
- Complex multi-source dashboards with many live queries load slower than single-source artifacts
- Live data connections require a Pro or higher plan; free tier artifacts are always static
- Not a BI tool replacement — no drill-downs, saved filters, or access control per data field
- Iframe embedding requires the host tool to allow third-party iframes (Notion and Confluence do; some enterprise intranets block them)
- Google Sheets data source requires the Google Drive connector to be authorized in Cowork

---
