# MCP-integratiegids

Hoe u externe tools, API's en databases verbindt met Claude Code met behulp van Model Context Protocol (MCP).

## Wat is MCP?

MCP (Model Context Protocol) is een open standaard waarmee Claude Code kan communiceren met externe systemen. In plaats van gegevens in het gesprek te plakken, stellen MCP-servers deze bloot als tools die Claude direct kan aanroepen.

**Gebruik MCP wanneer u Claude wilt laten:**
- Uw database bevragen zonder gegevens te exporteren
- Lezen uit uw interne bedrijfs-API's
- Uw documentatie in real-time doorzoeken
- Verbinding maken met SaaS-tools (Jira, HubSpot, GitHub)

## Een MCP-server instellen

### Optie 1: Bestaande MCP-server gebruiken

Veel tools hebben officiële of community MCP-servers:

```bash
# HubSpot (officieel)
npx @hubspot/mcp-server

# GitHub (officieel)
npx @modelcontextprotocol/server-github

# PostgreSQL (officieel)
npx @modelcontextprotocol/server-postgres postgres://localhost/mydb

# Bestandssysteem (officieel)
npx @modelcontextprotocol/server-filesystem /path/to/directory
```

Configureer in `~/.claude.json`:
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

### Optie 2: Aangepaste MCP-server bouwen

Gebruik de `/mcp-server-builder`-vaardigheid om een nieuwe server op te stellen of gebruik deze minimale sjabloon:

```typescript
// server.ts — minimale MCP-server
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

// Beschikbare tools definiëren
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'search_products',
      description: 'Zoek productcatalogus op naam of categorie',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Zoekterm' },
          category: { type: 'string', description: 'Filter productcategorie' },
        },
        required: ['query'],
      },
    },
  ],
}))

// Tool-uitvoering implementeren
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'search_products') {
    const { query, category } = request.params.arguments as {
      query: string
      category?: string
    }
    
    // Uw werkelijke implementatie hier
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
  
  throw new Error(`Onbekend tool: ${request.params.name}`)
})

// Start de server
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

Configureer het:
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

## Populaire MCP-serverpatronen

### Database-toegang

```typescript
// Tool: run_query
{
  name: 'run_query',
  description: 'Voer een alleen-lezen SQL-query uit op de productiedatabase',
  inputSchema: {
    type: 'object',
    properties: {
      sql: { type: 'string', description: 'SQL SELECT-instructie' },
    },
    required: ['sql'],
  },
}

// Implementatie
if (!sql.trim().toUpperCase().startsWith('SELECT')) {
  throw new Error('Alleen SELECT-query\'s zijn toegestaan')
}
const result = await db.query(sql)
return { content: [{ type: 'text', text: JSON.stringify(result.rows) }] }
```

### Interne API-toegang

```typescript
// Tool: get_customer
{
  name: 'get_customer',
  description: 'Zoek een klant op e-mail of ID uit de interne CRM',
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

### Documentzoeken

```typescript
// Tool: search_docs
{
  name: 'search_docs',
  description: 'Zoek interne documentatie, handboeken en wiki\'s',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string' },
      section: { type: 'string', description: 'Optioneel: beperken tot een sectie' },
    },
    required: ['query'],
  },
}
```

## Beveiligingsbest practices

- **Alleen-lezen standaard**: MCP-tools die gegevens opvragen, mogen deze niet wijzigen
- **Geen productie-schrijfbewerkingen van Claude**: MCP voor lezen gebruiken; schrijfbewerkingen via door mensen beoordeelde PR's leiden
- **Token-bereik**: Geef de MCP-server de minimaal benodigde machtigingen
- **Log MCP-oproepen**: Audits welke tools Claude aanroept en met welke argumenten
- **Valideer alle invoer**: Behandel MCP-tool-argumenten als gebruikersinvoer (desinfecteer voor gebruik)

## Debugging

```bash
# Test of server werkt voor aansluiting op Claude Code
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/server.js

# Claude Code MCP debug-logging inschakelen
CLAUDE_MCP_DEBUG=1 claude
```

## Gerelateerde inhoud

- `/skills/ai-engineering/mcp-server-builder` — volledige vaardigheid voor het bouwen van MCP-servers
- `/mcp/` directory — serverconfiguraties en aanbevelingen voor populaire tools

---
