# PostgreSQL MCP Server

Connects Claude Code to PostgreSQL databases for direct querying, schema inspection, and data management.

---

## Installation

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:password@localhost:5432/dbname"
      }
    }
  }
}
```

## Tools Provided

| Tool | Description |
|---|---|
| `query` | Execute SQL queries (SELECT, INSERT, UPDATE, DELETE) |
| `list_tables` | List all tables in the connected database |
| `describe_table` | Get schema for a specific table |

## Usage

```
> "Query the users table for all active users created this month"
> "What's the schema of the orders table?"
> "Find duplicate emails in the customers table"
```

## Security Notes

- Use a read-only database user for production connections
- Never expose DATABASE_URL in version control
- Consider using connection pooling (PgBouncer) for long-running sessions

---

Built with [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
