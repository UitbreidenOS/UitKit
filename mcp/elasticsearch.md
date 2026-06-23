# Elasticsearch MCP Server

Connects Claude Code to Elasticsearch clusters for search queries, index management, and cluster health monitoring.

---

## Installation

```json
{
  "mcpServers": {
    "elasticsearch": {
      "command": "npx",
      "args": ["-y", "elasticsearch-mcp-server"],
      "env": {
        "ES_URL": "http://localhost:9200",
        "ES_USERNAME": "elastic",
        "ES_PASSWORD": "changeme"
      }
    }
  }
}
```

## Tools Provided

| Tool | Description |
|---|---|
| `search` | Execute search queries with full query DSL support |
| `list_indices` | List all indices with document counts and sizes |
| `index_mapping` | Get the mapping/schema for an index |
| `cluster_health` | Check cluster and node health status |
| `cat_indices` | Get index statistics in readable format |

## Usage

```
> "Search the products index for items matching 'wireless headphones'"
> "What's the cluster health status?"
> "Show me the mapping for the logs-2026 index"
> "Find the largest indices by storage size"
> "Run a term aggregation on the orders index by status field"
```

## Security Notes

- Use API keys with minimal permissions for production clusters
- Enable TLS/HTTPS for remote cluster connections
- Never store passwords in MCP config — use secrets management

---

Built with [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
