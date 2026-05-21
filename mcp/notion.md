# MCP: Notion

Read and write Notion pages, databases, and blocks from Claude Code — search your workspace, create and update content, and query structured databases without leaving the terminal.

## Why you need this

Notion is where a lot of product context lives: specs, meeting notes, decision logs, project databases. Without MCP, Claude has no access to any of it. With Notion MCP:
- Claude can search your entire workspace and pull relevant context into any coding session
- Database queries bring structured project data (tasks, sprints, decisions) directly into the workflow
- Creating and updating pages from Claude means documentation happens inside the session, not after it
- Cross-referencing code changes against Notion specs or ADRs becomes a single prompt

## Installation

```bash
npm install -g @notionhq/notion-mcp-server
```

## Configuration

Add to `~/.claude.json` or project `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "OPENAPI_MCP_HEADERS": "{\"Authorization\": \"Bearer your-notion-integration-token\", \"Notion-Version\": \"2022-06-28\"}"
      }
    }
  }
}
```

## Key tools / What it does

- `search` — full-text search across all pages and databases the integration can access
- `get_page` — retrieve a page and its properties by page ID
- `create_page` — create a new page inside a parent page or database
- `update_page` — update page properties (title, status, dates, selects, relations)
- `get_database` — retrieve a database schema and metadata
- `query_database` — query a database with filters, sorts, and pagination
- `create_database_item` — add a new row/item to a database
- `update_database_item` — update properties on an existing database item
- `append_block_children` — append content blocks (paragraphs, code, lists, callouts) to any page

## Usage examples

```
Query my project database and list all tasks with status "In Progress",
sorted by due date. Show the assignee and priority for each one.
```

```
Create a new page in my meeting notes database with today's date as the title,
and add an agenda section with these three topics: [list topics].
```

```
Search Notion for our API design decisions from Q1 and summarize
the key choices we made around authentication and versioning.
```

```
Update the status of task "ENG-Implement OAuth flow" to Done
and set the completion date to today.
```

```
Append a summary of this coding session to my dev log page —
include what we changed, what we deferred, and any open questions.
```

## Authentication

1. Go to **notion.so/my-integrations** and click **New integration**
2. Give it a name, select your workspace, and set the capabilities: **Read content**, **Update content**, **Insert content**
3. Copy the **Internal Integration Token** — it starts with `secret_`
4. Set it as the `Authorization` bearer value in the config block above
5. **For each page or database the integration needs to access:** open it in Notion, click the three-dot menu, go to **Connections**, and add your integration by name

The integration only sees pages explicitly shared with it. Sharing a parent page does not automatically share child pages — you must share each one, or share a top-level page and check **Include subpages**.

## Tips

**Find page IDs from URLs:** Notion page IDs are the 32-character hex string at the end of the URL. Use `search` to discover pages by name rather than hunting for IDs manually.

**Database queries support filters and sorts:** Use the `filter` parameter with compound conditions (and/or) to replicate the same views you have in the Notion UI. The filter schema mirrors Notion's filter API exactly.

**Rate limit is 3 requests per second:** For bulk operations (creating many items, querying large databases), add delays between calls or batch writes using `append_block_children` with multiple blocks in one call.

**Rich text vs plain text:** Most `create_page` and `update_page` fields expect Notion's rich text array format, not plain strings. When in doubt, wrap text as `[{"type": "text", "text": {"content": "your text"}}]`.

**Use search to bootstrap:** When you don't have IDs, always start with `search` using a descriptive title. It returns page IDs and database IDs you can use in subsequent calls.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
