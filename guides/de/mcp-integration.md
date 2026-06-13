# MCP-Integrationsleitfaden

So verbinden Sie externe Tools, APIs und Datenbanken mit Claude Code über das Model Context Protocol (MCP).

## Was ist MCP?

MCP (Model Context Protocol) ist ein offener Standard, der Claude Code die Kommunikation mit externen Systemen ermöglicht. Anstatt Daten in das Gespräch einzufügen, stellen MCP-Server sie als Tools zur Verfügung, die Claude direkt aufrufen kann.

**Verwenden Sie MCP, wenn Claude:**
- Ihre Datenbank abfragen soll, ohne Daten zu exportieren
- Aus Ihren internen APIs des Unternehmens lesen soll
- Ihre Dokumentation in Echtzeit durchsuchen soll
- Sich mit SaaS-Tools verbinden soll (Jira, HubSpot, GitHub)

## Einen MCP-Server einrichten

### Option 1: Existierenden MCP-Server verwenden

Viele Tools haben offizielle oder Community MCP-Server:

```bash
# HubSpot (offiziell)
npx @hubspot/mcp-server

# GitHub (offiziell)
npx @modelcontextprotocol/server-github

# PostgreSQL (offiziell)
npx @modelcontextprotocol/server-postgres postgres://localhost/mydb

# Dateisystem (offiziell)
npx @modelcontextprotocol/server-filesystem /path/to/directory
```

Konfigurieren Sie in `~/.claude.json`:
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

### Option 2: Benutzerdefinierten MCP-Server erstellen

Verwenden Sie die `/mcp-server-builder`-Fähigkeit zum Scaffolding eines neuen Servers oder verwenden Sie diese Minimalvorlage:

```typescript
// server.ts — minimaler MCP-Server
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

// Verfügbare Tools definieren
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'search_products',
      description: 'Produktkatalog nach Name oder Kategorie durchsuchen',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Suchbegriff' },
          category: { type: 'string', description: 'Produktkategorie-Filter' },
        },
        required: ['query'],
      },
    },
  ],
}))

// Tool-Ausführung implementieren
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'search_products') {
    const { query, category } = request.params.arguments as {
      query: string
      category?: string
    }
    
    // Ihre eigentliche Implementierung hier
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
  
  throw new Error(`Unbekanntes Tool: ${request.params.name}`)
})

// Server starten
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

Konfigurieren Sie es:
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

## Beliebte MCP-Server-Muster

### Datenbankzugriff

```typescript
// Tool: run_query
{
  name: 'run_query',
  description: 'Führen Sie eine schreibgeschützte SQL-Abfrage für die Produktionsdatenbank aus',
  inputSchema: {
    type: 'object',
    properties: {
      sql: { type: 'string', description: 'SQL SELECT-Anweisung' },
    },
    required: ['sql'],
  },
}

// Implementierung
if (!sql.trim().toUpperCase().startsWith('SELECT')) {
  throw new Error('Nur SELECT-Abfragen sind zulässig')
}
const result = await db.query(sql)
return { content: [{ type: 'text', text: JSON.stringify(result.rows) }] }
```

### Interner API-Zugriff

```typescript
// Tool: get_customer
{
  name: 'get_customer',
  description: 'Suchen Sie einen Kunden per E-Mail oder ID aus dem internen CRM',
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

### Dokumentensuche

```typescript
// Tool: search_docs
{
  name: 'search_docs',
  description: 'Durchsuchen Sie interne Dokumentation, Runbooks und Wikis',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string' },
      section: { type: 'string', description: 'Optional: auf Abschnitt begrenzen' },
    },
    required: ['query'],
  },
}
```

## Sicherheitsbest Practices

- **Schreibgeschützt standardmäßig**: MCP-Tools, die Daten abfragen, sollten diese nicht ändern können
- **Keine Production-Schreibvorgänge von Claude**: MCP für Lesevorgänge verwenden; Schreibvorgänge über von Menschen überprüfte PRs leiten
- **Token-Bereich**: Geben Sie dem MCP-Server die minimalen Berechtigungen
- **MCP-Aufrufe protokollieren**: Audits welche Tools Claude mit welchen Argumenten aufruft
- **Alle Eingaben validieren**: Behandeln Sie MCP-Tool-Argumente wie Benutzereingaben (bereinigen vor Verwendung)

## Debugging

```bash
# Testen Sie, ob der Server funktioniert, bevor Sie sich mit Claude Code verbinden
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/server.js

# Claude Code MCP Debug-Logging aktivieren
CLAUDE_MCP_DEBUG=1 claude
```

## Verwandtes Material

- `/skills/ai-engineering/mcp-server-builder` — vollständige Fähigkeit zum Erstellen von MCP-Servern
- `/mcp/` directory — Serverkonfigurationen und Empfehlungen für beliebte Tools

---
