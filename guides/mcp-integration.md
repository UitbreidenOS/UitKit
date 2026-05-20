# MCP Integration Guide

How to connect external tools, APIs, and databases to Claude Code using the Model Context Protocol (MCP).

## What is MCP?

MCP (Model Context Protocol) is an open standard that lets Claude Code communicate with external systems. Instead of pasting data into the conversation, MCP servers expose it as tools Claude can call directly.

**Use MCP when you want Claude to:**
- Query your database without exporting data
- Read from your company's internal APIs
- Search your documentation in real-time
- Connect to SaaS tools (Jira, HubSpot, GitHub)

## Setting up an MCP server

### Option 1: Use an existing MCP server

Many tools have official or community MCP servers:

```bash
# HubSpot (official)
npx @hubspot/mcp-server

# GitHub (official)
npx @modelcontextprotocol/server-github

# PostgreSQL (official)
npx @modelcontextprotocol/server-postgres postgres://localhost/mydb

# Filesystem (official)
npx @modelcontextprotocol/server-filesystem /path/to/directory
```

Configure in `~/.claude.json`:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<your-token>"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres", "postgres://localhost/mydb"]
    }
  }
}
```

### Option 2: Build a custom MCP server

Use the `/mcp-server-builder` skill to scaffold a new server, or use this minimal template:

```typescript
// server.ts — minimal MCP server
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

const server = new Server(
  { name: 'my-server', version: '1.0.0' },
  { capabilities: { tools: {} } }
)

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'search_products',
      description: 'Search the product catalogue by name or category',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search term' },
          category: { type: 'string', description: 'Product category filter' },
        },
        required: ['query'],
      },
    },
  ],
}))

// Implement tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'search_products') {
    const { query, category } = request.params.arguments as {
      query: string
      category?: string
    }
    
    // Your actual implementation here
    const results = await searchProductsInDB(query, category)
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(results, null, 2),
        },
      ],
    }
  }
  
  throw new Error(`Unknown tool: ${request.params.name}`)
})

// Start the server
const transport = new StdioServerTransport()
await server.connect(transport)
```

```bash
npm install @modelcontextprotocol/sdk
```

```json
// package.json
{
  "scripts": {
    "start": "node dist/server.js"
  }
}
```

Configure it:
```json
// ~/.claude.json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/path/to/my-server/dist/server.js"],
      "env": {
        "DATABASE_URL": "postgres://localhost/mydb"
      }
    }
  }
}
```

## Popular MCP server patterns

### Database access

```typescript
// Tool: run_query
{
  name: 'run_query',
  description: 'Run a read-only SQL query against the production database',
  inputSchema: {
    type: 'object',
    properties: {
      sql: { type: 'string', description: 'SQL SELECT statement' },
    },
    required: ['sql'],
  },
}

// Implementation
if (!sql.trim().toUpperCase().startsWith('SELECT')) {
  throw new Error('Only SELECT queries are allowed')
}
const result = await db.query(sql)
return { content: [{ type: 'text', text: JSON.stringify(result.rows) }] }
```

### Internal API access

```typescript
// Tool: get_customer
{
  name: 'get_customer',
  description: 'Look up a customer by email or ID from the internal CRM',
  inputSchema: {
    type: 'object',
    properties: {
      identifier: { type: 'string' },
      type: { type: 'string', enum: ['email', 'id'] },
    },
    required: ['identifier', 'type'],
  },
}
```

### Document search

```typescript
// Tool: search_docs
{
  name: 'search_docs',
  description: 'Search internal documentation, runbooks, and wikis',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string' },
      section: { type: 'string', description: 'Optional: limit to a section' },
    },
    required: ['query'],
  },
}
```

## Security best practices

- **Read-only by default**: MCP tools that query data should not be able to modify it
- **No production writes from Claude**: use MCP for reads; route writes through human-reviewed PRs
- **Scope the token**: give the MCP server the minimum permissions it needs
- **Log MCP calls**: audit which tools Claude calls and with what arguments
- **Validate all inputs**: treat MCP tool arguments like user input (sanitise before use)

## Debugging

```bash
# Test the server works before connecting to Claude Code
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/server.js

# Enable Claude Code MCP debug logging
CLAUDE_MCP_DEBUG=1 claude
```

## Related content

- `/skills/ai-engineering/mcp-server-builder` — full skill for building MCP servers
- `/mcp/` directory — server configs and recommendations for popular tools

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
