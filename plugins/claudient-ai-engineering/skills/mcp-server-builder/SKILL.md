---
name: "mcp-server-builder"
description: "Build custom MCP servers: expose tools, resources, and prompts via stdio or HTTP/SSE transport — connect proprietary data to Claude Code"
---

# MCP Server Builder Skill

## When to activate
- Building a custom MCP server to expose internal data or APIs to Claude Code
- Wrapping a REST API as MCP tools so Claude can call it natively
- Creating an MCP server for a database, file system, or proprietary service
- Setting up MCP with stdio transport (local tools) or HTTP/SSE (remote servers)
- Adding MCP resources (read-only data) or prompts (reusable templates) alongside tools

## When NOT to use
- When an existing MCP server already does what you need (check mcp.so first)
- Simple Claude API integrations without tool exposure — use the Claude API skill
- When you just need to USE an MCP server, not build one — see `mcp/recommended-servers.md`

## Instructions

### Installation

```bash
npm install @modelcontextprotocol/sdk
```

### Minimal MCP server (stdio)

```typescript
// src/server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

const server = new Server(
  { name: 'my-mcp-server', version: '1.0.0' },
  { capabilities: { tools: {} } }
)

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_user',
      description: 'Retrieve a user by their ID from the internal database',
      inputSchema: {
        type: 'object',
        properties: {
          userId: { type: 'string', description: 'The user UUID' },
        },
        required: ['userId'],
      },
    },
    {
      name: 'list_orders',
      description: 'List recent orders for a user',
      inputSchema: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          limit:  { type: 'number', default: 10 },
        },
        required: ['userId'],
      },
    },
  ],
}))

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  switch (name) {
    case 'get_user': {
      const user = await db.users.findById(args.userId)
      if (!user) return { content: [{ type: 'text', text: 'User not found' }], isError: true }
      return { content: [{ type: 'text', text: JSON.stringify(user, null, 2) }] }
    }

    case 'list_orders': {
      const orders = await db.orders.findByUser(args.userId, args.limit ?? 10)
      return { content: [{ type: 'text', text: JSON.stringify(orders, null, 2) }] }
    }

    default:
      throw new Error(`Unknown tool: ${name}`)
  }
})

// Start server
const transport = new StdioServerTransport()
await server.connect(transport)
```

### Resources (read-only data Claude can access)

```typescript
import { ListResourcesRequestSchema, ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js'

const server = new Server(
  { name: 'my-server', version: '1.0.0' },
  { capabilities: { resources: {}, tools: {} } }
)

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: 'db://schema',
      name: 'Database Schema',
      description: 'Current database schema for all tables',
      mimeType: 'text/plain',
    },
    {
      uri: 'config://app',
      name: 'Application Config',
      description: 'Current application configuration (non-sensitive)',
      mimeType: 'application/json',
    },
  ],
}))

// Read a specific resource
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params

  if (uri === 'db://schema') {
    const schema = await getDbSchema()
    return { contents: [{ uri, mimeType: 'text/plain', text: schema }] }
  }

  if (uri === 'config://app') {
    return { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(safeConfig) }] }
  }

  throw new Error(`Unknown resource: ${uri}`)
})
```

### Prompts (reusable templates)

```typescript
import { ListPromptsRequestSchema, GetPromptRequestSchema } from '@modelcontextprotocol/sdk/types.js'

server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: [
    {
      name: 'analyze_user',
      description: 'Analyze a user account for suspicious activity',
      arguments: [
        { name: 'userId', description: 'The user ID to analyze', required: true },
      ],
    },
  ],
}))

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  if (name === 'analyze_user') {
    const user = await db.users.findById(args?.userId)
    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Analyze this user for suspicious activity:\n\n${JSON.stringify(user, null, 2)}\n\nCheck for: unusual login times, high-value transactions, account age vs activity ratio.`,
          },
        },
      ],
    }
  }
  throw new Error(`Unknown prompt: ${name}`)
})
```

### HTTP/SSE transport (remote server)

```typescript
// src/http-server.ts — for servers that run remotely (not local stdio)
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import express from 'express'

const app = express()
app.use(express.json())

const server = new Server({ name: 'remote-mcp', version: '1.0.0' }, { capabilities: { tools: {} } })
// ... add handlers ...

app.post('/mcp', async (req, res) => {
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: () => crypto.randomUUID() })
  await server.connect(transport)
  await transport.handleRequest(req, res, req.body)
})

app.listen(3001, () => console.log('MCP server on :3001'))
```

### Register in Claude Code settings

```json
// ~/.claude/settings.json (global) or .claude/settings.json (project)
{
  "mcpServers": {
    "my-internal-api": {
      "command": "node",
      "args": ["./dist/server.js"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}",
        "API_KEY": "${INTERNAL_API_KEY}"
      }
    },
    "remote-server": {
      "url": "https://my-mcp-server.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${MCP_TOKEN}"
      }
    }
  }
}
```

### Full example — wrapping a REST API

```typescript
// server.ts — expose a company's internal API as MCP tools
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'

const API_BASE = process.env.INTERNAL_API_URL!
const API_KEY = process.env.INTERNAL_API_KEY!

const headers = { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' }

async function apiCall(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`)
  return res.json()
}

const server = new Server({ name: 'internal-api', version: '1.0.0' }, { capabilities: { tools: {} } })

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'search_customers',
      description: 'Search customers by name, email, or company',
      inputSchema: {
        type: 'object',
        properties: {
          query:  { type: 'string' },
          status: { type: 'string', enum: ['active', 'churned', 'trial'] },
          limit:  { type: 'number', default: 10 },
        },
        required: ['query'],
      },
    },
    {
      name: 'get_customer_usage',
      description: 'Get usage metrics for a customer',
      inputSchema: {
        type: 'object',
        properties: {
          customerId: { type: 'string' },
          period:     { type: 'string', enum: ['7d', '30d', '90d'], default: '30d' },
        },
        required: ['customerId'],
      },
    },
    {
      name: 'create_support_ticket',
      description: 'Create a support ticket for a customer',
      inputSchema: {
        type: 'object',
        properties: {
          customerId: { type: 'string' },
          subject:    { type: 'string' },
          body:       { type: 'string' },
          priority:   { type: 'string', enum: ['low', 'medium', 'high'] },
        },
        required: ['customerId', 'subject', 'body'],
      },
    },
  ],
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  try {
    switch (name) {
      case 'search_customers': {
        const data = await apiCall(`/customers/search?q=${args.query}&status=${args.status ?? ''}&limit=${args.limit ?? 10}`)
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] }
      }
      case 'get_customer_usage': {
        const data = await apiCall(`/customers/${args.customerId}/usage?period=${args.period ?? '30d'}`)
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] }
      }
      case 'create_support_ticket': {
        const data = await apiCall('/tickets', {
          method: 'POST',
          body: JSON.stringify({ customerId: args.customerId, subject: args.subject, body: args.body, priority: args.priority ?? 'medium' }),
        })
        return { content: [{ type: 'text', text: `Ticket created: ${data.ticketId}` }] }
      }
      default:
        throw new Error(`Unknown tool: ${name}`)
    }
  } catch (err) {
    return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true }
  }
})

const transport = new StdioServerTransport()
await server.connect(transport)
```

```json
// package.json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "bin": {
    "internal-api-mcp": "./dist/server.js"
  }
}
```

## Example

**User:** Build an MCP server that wraps our Linear project management API — Claude should be able to list issues, create issues, and update issue status.

**Expected output:**
- `src/server.ts` — 3 tools: `list_issues`, `create_issue`, `update_issue_status`
- Each tool calls the Linear GraphQL API with Bearer token from env
- Error handling returns `isError: true` with descriptive message
- `settings.json` snippet to register as `linear` MCP server with `LINEAR_API_KEY` env var

---
