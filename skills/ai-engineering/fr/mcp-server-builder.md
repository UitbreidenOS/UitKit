---
name: mcp-server-builder
description: "Construire des serveurs MCP personnalisés : exposer des outils, ressources et prompts via transport stdio ou HTTP/SSE — connecter des données propriétaires à Claude Code"
---

> 🇫🇷 Version française. [English version](../mcp-server-builder.md).

# Compétence MCP Server Builder

## Quand l'activer
- Construire un serveur MCP personnalisé pour exposer des données internes ou des APIs à Claude Code
- Encapsuler une REST API en outils MCP pour que Claude puisse l'appeler nativement
- Créer un serveur MCP pour une base de données, un système de fichiers ou un service propriétaire
- Configurer MCP avec le transport stdio (outils locaux) ou HTTP/SSE (serveurs distants)
- Ajouter des ressources MCP (données en lecture seule) ou des prompts (templates réutilisables) en plus des outils

## Quand NE PAS utiliser
- Quand un serveur MCP existant fait déjà ce dont vous avez besoin (vérifier mcp.so d'abord)
- Les intégrations simples de l'API Claude sans exposition d'outils — utiliser la compétence Claude API
- Quand vous avez juste besoin d'UTILISER un serveur MCP, pas d'en construire un — voir `mcp/recommended-servers.md`

## Instructions

### Installation

```bash
npm install @modelcontextprotocol/sdk
```

### Serveur MCP minimal (stdio)

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

// Définir les outils
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

// Gérer les appels d'outils
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

// Démarrer le serveur
const transport = new StdioServerTransport()
await server.connect(transport)
```

### Ressources (données en lecture seule accessibles par Claude)

```typescript
import { ListResourcesRequestSchema, ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js'

const server = new Server(
  { name: 'my-server', version: '1.0.0' },
  { capabilities: { resources: {}, tools: {} } }
)

// Lister les ressources disponibles
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

// Lire une ressource spécifique
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

### Prompts (templates réutilisables)

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

### Transport HTTP/SSE (serveur distant)

```typescript
// src/http-server.ts — pour les serveurs qui s'exécutent à distance (pas en stdio local)
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import express from 'express'

const app = express()
app.use(express.json())

const server = new Server({ name: 'remote-mcp', version: '1.0.0' }, { capabilities: { tools: {} } })
// ... ajouter les gestionnaires ...

app.post('/mcp', async (req, res) => {
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: () => crypto.randomUUID() })
  await server.connect(transport)
  await transport.handleRequest(req, res, req.body)
})

app.listen(3001, () => console.log('MCP server on :3001'))
```

### Enregistrer dans les paramètres Claude Code

```json
// ~/.claude/settings.json (global) ou .claude/settings.json (projet)
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

### Exemple complet — encapsuler une REST API

```typescript
// server.ts — exposer l'API interne d'une entreprise en tant qu'outils MCP
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

## Exemple

**Utilisateur :** Construire un serveur MCP qui encapsule notre API de gestion de projet Linear — Claude devrait pouvoir lister des tickets, créer des tickets et mettre à jour le statut des tickets.

**Résultat attendu :**
- `src/server.ts` — 3 outils : `list_issues`, `create_issue`, `update_issue_status`
- Chaque outil appelle l'API GraphQL de Linear avec un token Bearer depuis les variables d'environnement
- La gestion des erreurs retourne `isError: true` avec un message descriptif
- Extrait `settings.json` pour enregistrer comme serveur MCP `linear` avec la variable d'environnement `LINEAR_API_KEY`

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
