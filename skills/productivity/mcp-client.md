---
name: mcp-client
description: Building an application that connects to and consumes MCP servers, or when the user mentions consuming MCP tools programmatically from their own ap...
updated: 2026-06-13
---

# MCP Client

## When to activate
Building an application that connects to and consumes MCP servers, or when the user mentions consuming MCP tools programmatically from their own application.

## When NOT to use
- Building an MCP server that exposes tools — use `mcp-server-builder` instead
- Configuring Claude Code to use an existing MCP server — that is `settings.json` configuration, not code
- Using MCP tools from within a Claude Code session — those are already available via `/mcp`

## Instructions

### Client vs Server Distinction
- **MCP Server:** exposes tools, resources, and prompts that AI models can call
- **MCP Client:** connects to servers, discovers tools, and calls them — this skill covers the client side
- Most applications that use MCP are clients; most published MCP packages are servers

### TypeScript Client Setup
```ts
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
```

**Local server (stdio transport):**
```ts
const transport = new StdioClientTransport({
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-filesystem', '/tmp'],
});
const client = new Client({ name: 'my-app', version: '1.0.0' }, { capabilities: {} });
await client.connect(transport);
```

**Remote server (SSE transport):**
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

### Tool Discovery and Caching
Tools do not change while a server is running. Cache the tool list on connect — do not re-fetch per request:
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
Handle server disconnect by catching transport errors and reconnecting with backoff.

### Multi-Server Client
Connect to multiple MCP servers and merge their tool lists into a single routing layer:
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
Pass discovered tools directly to Claude as the tools array — Claude will call them, you proxy the call to the MCP server:

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

## Example

An application that connects to three MCP servers (filesystem, GitHub, Postgres), merges their tools, and lets Claude use all of them in a single agentic loop:

1. Connect to all three servers on startup, cache tool lists
2. Build merged tool array — 23 tools total across three servers
3. Pass all 23 tools to Claude with `defer_loading: true` for the rarely-used ones
4. Claude calls `query_database` — client routes to Postgres MCP server
5. Claude calls `create_pull_request` — client routes to GitHub MCP server
6. Result from each tool returned as `tool_result` message to Claude
7. On shutdown, close all three transports cleanly

---
