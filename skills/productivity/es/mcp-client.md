# Cliente MCP

## Cuándo activar
Construyendo una aplicación que se conecta a y consume servidores MCP, o cuando el usuario menciona consumir herramientas MCP mediante programación desde su propia aplicación.

## Cuándo NO usar
- Construyendo un servidor MCP que expone herramientas — usar `mcp-server-builder` en su lugar
- Configurar Claude Code para usar un servidor MCP existente — eso es configuración `settings.json`, no código
- Usar herramientas MCP desde dentro de una sesión de Claude Code — aquellas ya están disponibles vía `/mcp`

## Instrucciones

### Distinción Cliente vs Servidor
- **Servidor MCP:** expone herramientas, recursos y prompts que modelos de IA pueden llamar
- **Cliente MCP:** se conecta a servidores, descubre herramientas y las llama — esta habilidad cubre el lado del cliente
- La mayoría de aplicaciones que usan MCP son clientes; la mayoría de paquetes MCP publicados son servidores

### Configuración de Cliente TypeScript
```ts
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
```

**Servidor local (transporte stdio):**
```ts
const transport = new StdioClientTransport({
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-filesystem', '/tmp'],
});
const client = new Client({ name: 'my-app', version: '1.0.0' }, { capabilities: {} });
await client.connect(transport);
```

**Servidor remoto (transporte SSE):**
```ts
const transport = new SSEClientTransport(new URL('https://mcp.example.com/sse'));
const client = new Client({ name: 'my-app', version: '1.0.0' }, { capabilities: {} });
await client.connect(transport);
```

### Ciclo de Vida del Cliente
```ts
// 1. Conectar
await client.connect(transport);

// 2. Descubrir herramientas (hacer esto una vez; almacenar en caché el resultado)
const { tools } = await client.listTools();
// tools: Array<{ name, description, inputSchema }>

// 3. Llamar a una herramienta
const result = await client.callTool({
  name: 'read_file',
  arguments: { path: '/tmp/data.json' },
});
// result.content: Array<{ type: 'text' | 'image' | 'resource', text?: string }>

// 4. Desconectar cuando se termine
await client.close();
```

### Descubrimiento de Herramientas y Almacenamiento en Caché
Las herramientas no cambian mientras un servidor está ejecutándose. Almacenar en caché la lista de herramientas al conectar — no refetizar por solicitud:
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

### Manejo de Errores
```ts
try {
  const result = await client.callTool({ name: 'unknown_tool', arguments: {} });
} catch (err) {
  if (err instanceof McpError) {
    // err.code: enum ErrorCode (ToolNotFound, InvalidRequest, etc.)
    // err.message: descripción legible por humanos
  }
}
```
Manejar desconexión de servidor atrapando errores de transporte y reconectando con backoff.

### Cliente Multi-Servidor
Conectar a múltiples servidores MCP y fusionar sus listas de herramientas en una sola capa de enrutamiento:
```ts
const servers = [filesystemClient, githubClient, postgresClient];

async function callTool(name: string, args: unknown) {
  for (const server of servers) {
    const tools = await server.getTools();
    if (tools.find(t => t.name === name)) {
      return server.callTool({ name, arguments: args });
    }
  }
  throw new Error(`Herramienta no encontrada: ${name}`);
}
```

### Patrón Meta-MCP (Agente Usando Herramientas MCP)
Pasar herramientas descubiertas directamente a Claude como el array de herramientas — Claude las llamará, tú proxeas la llamada al servidor MCP:

```ts
const { tools } = await client.listTools();

// Convertir esquema de herramienta MCP a formato de herramienta Anthropic
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

// Cuando Claude devuelve un bloque tool_use, proxearlo a MCP
for (const block of response.content) {
  if (block.type === 'tool_use') {
    const mcpResult = await client.callTool({ name: block.name, arguments: block.input });
    // Alimentar resultado de vuelta a Claude como tool_result
  }
}
```

## Ejemplo

Una aplicación que se conecta a tres servidores MCP (sistema de archivos, GitHub, Postgres), fusiona sus herramientas, y deja que Claude use todas ellas en un único bucle de agente:

1. Conectar a los tres servidores en startup, almacenar en caché listas de herramientas
2. Construir array de herramienta fusionada — 23 herramientas totales en tres servidores
3. Pasar las 23 herramientas a Claude con `defer_loading: true` para las poco usadas
4. Claude llama `query_database` — cliente enruta a servidor MCP de Postgres
5. Claude llama `create_pull_request` — cliente enruta a servidor MCP de GitHub
6. Resultado de cada herramienta devuelto como mensaje `tool_result` a Claude
7. Al apagarse, cerrar los tres transportes limpiamente

---
