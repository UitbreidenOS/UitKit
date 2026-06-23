# Airtable MCP Server

Connects Claude Code to Airtable bases for record management, data queries, and automation triggers.

---

## Installation

```json
{
  "mcpServers": {
    "airtable": {
      "command": "npx",
      "args": ["-y", "airtable-mcp-server"],
      "env": {
        "AIRTABLE_API_KEY": "patXXXXXXXXXXXXXXXX"
      }
    }
  }
}
```

## Tools Provided

| Tool | Description |
|---|---|
| `list_bases` | List all accessible Airtable bases |
| `list_tables` | List tables in a base |
| `query_records` | Query records with filters and sorting |
| `create_record` | Create new records in a table |
| `update_record` | Update existing records |

## Usage

```
> "Show all open deals in the Sales Pipeline base"
> "Create a new task record: 'Fix login bug', Priority: High"
> "Find all contacts in the 'Enterprise' segment"
> "Update the status of ticket #1234 to 'In Review'"
```

## Security Notes

- Use Personal Access Tokens (PAT) over legacy API keys
- Scope tokens to specific bases for least-privilege access
- Airtable rate limits: 5 requests/second per base

---

Built with [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
