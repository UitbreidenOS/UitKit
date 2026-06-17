# MCP Connections

## Overview

MCP (Model Context Protocol) server configurations and connection settings for the fullstack developer stack.

## Standard Connections

### Local Development

Configure local MCP servers that enhance Claude's capabilities during fullstack development.

```json
{
  "mcpServers": {
    "local-dev": {
      "command": "node",
      "args": ["path/to/mcp-server.js"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

## Production Connections

Configure MCP servers for production deployments.

```json
{
  "mcpServers": {
    "production": {
      "command": "node",
      "args": ["path/to/mcp-server.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

## Database Connections

MCP servers for database operations and migrations.

- SQLite
- PostgreSQL
- MongoDB

## API Connections

External API integrations via MCP.

- REST endpoints
- GraphQL servers
- WebSocket servers

## Authentication

Configure credentials and auth tokens for MCP connections.

- API keys
- OAuth tokens
- Database credentials

## Troubleshooting

Common connection issues and resolution steps.

---

**Last updated:** 2026-06-13
