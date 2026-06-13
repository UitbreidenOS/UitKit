---
name: mcp-server-builder
description: "Construir servidores MCP personalizados: exponer herramientas, recursos y prompts mediante transporte stdio o HTTP/SSE — conectar datos propietarios a Claude Code"
---

> 🇪🇸 Versión en español. [Versión en inglés](../mcp-server-builder.md).

# Skill MCP Server Builder

## Cuándo activar
- Construir un servidor MCP personalizado para exponer datos internos o APIs a Claude Code
- Envolver una REST API como herramientas MCP para que Claude pueda llamarla nativamente
- Crear un servidor MCP para una base de datos, sistema de archivos o servicio propietario
- Configurar MCP con transporte stdio (herramientas locales) o HTTP/SSE (servidores remotos)
- Agregar recursos MCP (datos de solo lectura) o prompts (plantillas reutilizables) junto a las herramientas

## Cuándo NO usar
- Cuando un servidor MCP existente ya hace lo que se necesita (verificar mcp.so primero)
- Integraciones simples de la API Claude sin exposición de herramientas — usar la skill Claude API
- Cuando solo se quiere USAR un servidor MCP, no construir uno — ver `mcp/recommended-servers.md`

## Instrucciones

### Instalación

```bash
npm install @modelcontextprotocol/sdk
```

### Servidor MCP mínimo (stdio)

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

// Definir herramientas
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

// Manejar llamadas a herramientas
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

// Iniciar el servidor
const transport = new StdioServerTransport()
await server.connect(transport)
```

### Recursos (datos de solo lectura que Claude puede acceder)

```typescript
import { ListResourcesRequestSchema, ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js'

const server = new Server(
  { name: 'my-server', version: '1.0.0' },
  { capabilities: { resources: {}, tools: {} } }
)

// Listar recursos disponibles
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

// Leer un recurso específico
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

### Prompts (plantillas reutilizables)

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

### Transporte HTTP/SSE (servidor remoto)

```typescript
// src/http-server.ts — para servidores que se ejecutan de forma remota (no stdio local)
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import express from 'express'

const app = express()
app.use(express.json())

const server = new Server({ name: 'remote-mcp', version: '1.0.0' }, { capabilities: { tools: {} } })
// ... agregar manejadores ...

app.post('/mcp', async (req, res) => {
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: () => crypto.randomUUID() })
  await server.connect(transport)
  await transport.handleRequest(req, res, req.body)
})

app.listen(3001, () => console.log('MCP server on :3001'))
```

### Registrar en la configuración de Claude Code

```json
// ~/.claude/settings.json (global) o .claude/settings.json (proyecto)
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

### Ejemplo completo — envolviendo una REST API

```typescript
// server.ts — exponer la API interna de una empresa como herramientas MCP
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

## Ejemplo

**Usuario:** Construir un servidor MCP que envuelva nuestra API de gestión de proyectos Linear — Claude debería poder listar issues, crear issues y actualizar el estado de los issues.

**Resultado esperado:**
- `src/server.ts` — 3 herramientas: `list_issues`, `create_issue`, `update_issue_status`
- Cada herramienta llama a la API GraphQL de Linear con token Bearer desde la variable de entorno
- El manejo de errores devuelve `isError: true` con mensaje descriptivo
- Fragmento de `settings.json` para registrar como servidor MCP `linear` con variable de entorno `LINEAR_API_KEY`

---
