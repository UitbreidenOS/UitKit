---
name: mcp-server-builder
description: "Aangepaste MCP-servers bouwen: tools, resources en prompts beschikbaar stellen via stdio of HTTP/SSE-transport — eigen data verbinden met Claude Code"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../mcp-server-builder.md).

# MCP Server Builder Skill

## Wanneer activeren
- Een aangepaste MCP-server bouwen om interne data of API's beschikbaar te stellen aan Claude Code
- Een REST API als MCP-tools verpakken zodat Claude deze native kan aanroepen
- Een MCP-server maken voor een database, bestandssysteem of eigen service
- MCP instellen met stdio-transport (lokale tools) of HTTP/SSE (externe servers)
- MCP-resources (alleen-lezen data) of prompts (herbruikbare templates) naast tools toevoegen

## Wanneer NIET gebruiken
- Wanneer een bestaande MCP-server al doet wat nodig is (controleer eerst mcp.so)
- Eenvoudige Claude API-integraties zonder tool-blootstelling — gebruik de Claude API skill
- Wanneer u alleen een MCP-server wilt GEBRUIKEN, niet bouwen — zie `mcp/recommended-servers.md`

## Instructies

### Installatie

```bash
npm install @modelcontextprotocol/sdk
```

### Minimale MCP-server (stdio)

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

// Tools definiëren
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

// Tool-aanroepen afhandelen
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

// Server starten
const transport = new StdioServerTransport()
await server.connect(transport)
```

### Resources (alleen-lezen data die Claude kan raadplegen)

```typescript
import { ListResourcesRequestSchema, ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js'

const server = new Server(
  { name: 'my-server', version: '1.0.0' },
  { capabilities: { resources: {}, tools: {} } }
)

// Beschikbare resources weergeven
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

// Een specifieke resource lezen
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

### Prompts (herbruikbare templates)

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

### HTTP/SSE-transport (externe server)

```typescript
// src/http-server.ts — voor servers die extern draaien (geen lokale stdio)
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import express from 'express'

const app = express()
app.use(express.json())

const server = new Server({ name: 'remote-mcp', version: '1.0.0' }, { capabilities: { tools: {} } })
// ... handlers toevoegen ...

app.post('/mcp', async (req, res) => {
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: () => crypto.randomUUID() })
  await server.connect(transport)
  await transport.handleRequest(req, res, req.body)
})

app.listen(3001, () => console.log('MCP server on :3001'))
```

### Registreren in Claude Code-instellingen

```json
// ~/.claude/settings.json (globaal) of .claude/settings.json (project)
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

### Volledig voorbeeld — een REST API verpakken

```typescript
// server.ts — de interne API van een bedrijf als MCP-tools beschikbaar stellen
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

## Voorbeeld

**Gebruiker:** Een MCP-server bouwen die onze Linear projectmanagement-API omhult — Claude moet issues kunnen weergeven, issues maken en de issuestatus bijwerken.

**Verwachte uitvoer:**
- `src/server.ts` — 3 tools: `list_issues`, `create_issue`, `update_issue_status`
- Elke tool roept de Linear GraphQL API aan met Bearer-token uit omgevingsvariabele
- Foutafhandeling geeft `isError: true` terug met beschrijvend bericht
- `settings.json`-fragment om te registreren als `linear` MCP-server met `LINEAR_API_KEY` omgevingsvariabele

---
