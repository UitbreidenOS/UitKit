# MCP Client

## Wanneer activeren
Een applicatie bouwen die met MCP-servers verbindt en deze consumeert, of wanneer de gebruiker MCP-tools programmatisch van hun eigen applicatie consumeert noemt.

## Wanneer NIET gebruiken
- Een MCP-server bouwen die tools beschikbaar stelt — gebruik `mcp-server-builder` in plaats daarvan
- Claude Code configureren om een bestaande MCP-server te gebruiken — dat is `settings.json` configuratie, niet code
- MCP-tools gebruiken binnen een Claude Code-sessie — die zijn al beschikbaar via `/mcp`

## Instructies

### Client versus Server-onderscheid
- **MCP Server:** beschikbaar stelt tools, resources en prompts die AI-modellen kunnen oproepen
- **MCP Client:** verbindt met servers, ontdekt tools en roept deze op — deze skill behandelt de client-zijde
- De meeste toepassingen die MCP gebruiken zijn clients; de meeste gepubliceerde MCP-pakketten zijn servers

### TypeScript Client Setup
```ts
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
```

**Lokale server (stdio transport):**
```ts
const transport = new StdioClientTransport({
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-filesystem', '/tmp'],
});
const client = new Client({ name: 'my-app', version: '1.0.0' }, { capabilities: {} });
await client.connect(transport);
```

**Externe server (SSE transport):**
```ts
const transport = new SSEClientTransport(new URL('https://mcp.example.com/sse'));
const client = new Client({ name: 'my-app', version: '1.0.0' }, { capabilities: {} });
await client.connect(transport);
```

### Client Lifecycle
```ts
// 1. Connect
await client.connect(transport);

// 2. Discover tools (do this once; cache the result)
const { tools } = await client.listTools();
// tools: Array<{ name, description, inputSchema }>

// 3. Call a tool
const result = await client.callTool({
  name: 'read_file',
  arguments: { path: '/tmp/data.json' },
});
// result.content: Array<{ type: 'text' | 'image' | 'resource', text?: string }>

// 4. Disconnect when done
await client.close();
```

### Tool Discovery en Caching
Tools veranderen niet terwijl een server wordt uitgevoerd. Cache de tool-lijst bij verbinding — haul niet per verzoek opnieuw op:
```ts
class MCPClientWrapper {
  private toolCache: Tool[] | null = null;

  async getTools(): Promise<Tool[]> {
    if (!this.toolCache) {
      const { tools } = await this.client.listTools();
      this.toolCache = tools;
    }
    return this.toolCache;
  }
}
```

### Error Handling
```ts
try {
  const result = await client.callTool({ name: 'unknown_tool', arguments: {} });
} catch (err) {
  if (err instanceof McpError) {
    // err.code: ErrorCode enum (ToolNotFound, InvalidRequest, etc.)
    // err.message: human-readable description
  }
}
```
Verwerk server-verbreking door transport-fouten te vangen en opnieuw verbinding te maken met backoff.

### Multi-Server Client
Verbind met meerdere MCP-servers en voeg hun tool-lijsten samen in een enkele routing-laag:
```ts
const servers = [filesystemClient, githubClient, postgresClient];

async function callTool(name: string, args: unknown) {
  for (const server of servers) {
    const tools = await server.getTools();
    if (tools.find(t => t.name === name)) {
      return server.callTool({ name, arguments: args });
    }
  }
  throw new Error(`Tool not found: ${name}`);
}
```

### Meta-MCP Pattern (Agent Using MCP Tools)
Geef ontdekte tools rechtstreeks aan Claude als de tools array — Claude zal ze oproepen, u proxy's de oproep naar de MCP-server:

```ts
const { tools } = await client.listTools();

// Convert MCP tool schema to Anthropic tool format
const claudeTools = tools.map(t => ({
  name: t.name,
  description: t.description,
  input_schema: t.inputSchema,
}));

const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  tools: claudeTools,
  messages: [{ role: 'user', content: userMessage }],
});

// When Claude returns a tool_use block, proxy it to MCP
for (const block of response.content) {
  if (block.type === 'tool_use') {
    const mcpResult = await client.callTool({ name: block.name, arguments: block.input });
    // Feed result back to Claude as tool_result
  }
}
```

## Voorbeeld

Een applicatie die met drie MCP-servers verbindt (filesystem, GitHub, Postgres), hun tools voegt samen en laat Claude al deze gebruiken in een enkel agentic loop:

1. Verbind met alle drie servers op startup, cache tool-lijsten
2. Bouw merged tool array — 23 tools totaal over drie servers
3. Geef alle 23 tools aan Claude met `defer_loading: true` voor de zelden-gebruikte
4. Claude roept `query_database` op — client routes naar Postgres MCP-server
5. Claude roept `create_pull_request` op — client routes naar GitHub MCP-server
6. Resultaat van elk tool terugkeer als `tool_result` bericht aan Claude
7. Op afsluiten, sluit alle drie transports schoon af

---
