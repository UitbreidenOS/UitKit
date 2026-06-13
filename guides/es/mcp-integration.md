# Guía de integración de MCP

Cómo conectar herramientas externas, API y bases de datos a Claude Code utilizando el Protocolo de contexto de modelo (MCP).

## ¿Qué es MCP?

MCP (Model Context Protocol) es un estándar abierto que permite a Claude Code comunicarse con sistemas externos. En lugar de pegar datos en la conversación, los servidores MCP los exponen como herramientas que Claude puede llamar directamente.

**Utilice MCP cuando desee que Claude:**
- Consulte su base de datos sin exportar datos
- Lea de sus API internas de la empresa
- Busque su documentación en tiempo real
- Conéctese a herramientas SaaS (Jira, HubSpot, GitHub)

## Configuración de un servidor MCP

### Opción 1: Usar servidor MCP existente

Muchas herramientas tienen servidores MCP oficiales o comunitarios:

```bash
# HubSpot (oficial)
npx @hubspot/mcp-server

# GitHub (oficial)
npx @modelcontextprotocol/server-github

# PostgreSQL (oficial)
npx @modelcontextprotocol/server-postgres postgres://localhost/mydb

# Sistema de archivos (oficial)
npx @modelcontextprotocol/server-filesystem /path/to/directory
```

Configure en `~/.claude.json`:
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

### Opción 2: Crear servidor MCP personalizado

Utilice la habilidad `/mcp-server-builder` para generar un nuevo servidor o use esta plantilla mínima:

```typescript
// server.ts — servidor MCP mínimo
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

// Definir herramientas disponibles
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'search_products',
      description: 'Buscar catálogo de productos por nombre o categoría',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Término de búsqueda' },
          category: { type: 'string', description: 'Filtro de categoría de producto' },
        },
        required: ['query'],
      },
    },
  ],
}))

// Implementar ejecución de herramientas
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'search_products') {
    const { query, category } = request.params.arguments as {
      query: string
      category?: string
    }
    
    // Su implementación real aquí
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
  
  throw new Error(`Herramienta desconocida: ${request.params.name}`)
})

// Iniciar servidor
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

Configúrelo:
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

## Patrones populares de servidor MCP

### Acceso a base de datos

```typescript
// Herramienta: run_query
{
  name: 'run_query',
  description: 'Ejecutar una consulta SQL de solo lectura contra la base de datos de producción',
  inputSchema: {
    type: 'object',
    properties: {
      sql: { type: 'string', description: 'Sentencia SQL SELECT' },
    },
    required: ['sql'],
  },
}

// Implementación
if (!sql.trim().toUpperCase().startsWith('SELECT')) {
  throw new Error('Solo se permiten consultas SELECT')
}
const result = await db.query(sql)
return { content: [{ type: 'text', text: JSON.stringify(result.rows) }] }
```

### Acceso a API interna

```typescript
// Herramienta: get_customer
{
  name: 'get_customer',
  description: 'Buscar un cliente por correo electrónico o ID del CRM interno',
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

### Búsqueda de documentos

```typescript
// Herramienta: search_docs
{
  name: 'search_docs',
  description: 'Buscar documentación interna, manuales y wiki',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string' },
      section: { type: 'string', description: 'Opcional: limitar a una sección' },
    },
    required: ['query'],
  },
}
```

## Mejores prácticas de seguridad

- **Solo lectura por defecto**: las herramientas MCP que consultan datos no deben poder modificarlos
- **Sin escrituras de producción desde Claude**: usar MCP para lecturas; enrutar escrituras a través de PR revisadas por humanos
- **Alcance del token**: dar al servidor MCP los permisos mínimos que necesita
- **Registrar llamadas MCP**: auditar qué herramientas llama Claude y con qué argumentos
- **Validar todas las entradas**: tratar los argumentos de herramientas MCP como entradas de usuario (desinfectar antes de usar)

## Depuración

```bash
# Pruebe que el servidor funciona antes de conectarse a Claude Code
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/server.js

# Habilitar registro de depuración de MCP de Claude Code
CLAUDE_MCP_DEBUG=1 claude
```

## Contenido relacionado

- `/skills/ai-engineering/mcp-server-builder` — habilidad completa para crear servidores MCP
- `/mcp/` directory — configuraciones de servidor y recomendaciones para herramientas populares

---
