---
name: mcp-client
description: "Client MCP : construire des applications qui se connectent aux serveurs MCP et consomment leurs outils, ressources et prompts par programme"
---

# MCP Client

## Quand activer
Construire une application qui se connecte à des serveurs MCP et consomme les outils par programme, ou quand l'utilisateur mentionne consommer les outils MCP par programme à partir de sa propre application.

## Quand ne PAS utiliser
- Construire un serveur MCP qui expose des outils — utiliser `mcp-server-builder` à la place
- Configurer Claude Code pour utiliser un serveur MCP existant — c'est la configuration `settings.json`, pas du code
- Utiliser les outils MCP au sein d'une session Claude Code — ceux-ci sont déjà disponibles via `/mcp`

## Instructions

### Distinction client vs serveur
- **Serveur MCP:** expose les outils, ressources et prompts que les modèles IA peuvent appeler
- **Client MCP:** se connecte aux serveurs, découvre les outils et les appelle — cette compétence couvre le côté client
- La plupart des applications qui utilisent MCP sont des clients ; la plupart des packages MCP publiés sont des serveurs

### Configuration du client TypeScript
```ts
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
```

**Serveur local (stdio transport):**
```ts
const transport = new StdioClientTransport({
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-filesystem', '/tmp'],
});
const client = new Client({ name: 'my-app', version: '1.0.0' }, { capabilities: {} });
await client.connect(transport);
```

**Serveur distant (SSE transport):**
```ts
const transport = new SSEClientTransport(new URL('https://mcp.example.com/sse'));
const client = new Client({ name: 'my-app', version: '1.0.0' }, { capabilities: {} });
await client.connect(transport);
```

### Cycle de vie du client
```ts
// 1. Connecter
await client.connect(transport);

// 2. Découvrir les outils (faire cela une fois ; mettre en cache le résultat)
const { tools } = await client.listTools();
// tools: Array<{ name, description, inputSchema }>

// 3. Appeler un outil
const result = await client.callTool({
  name: 'read_file',
  arguments: { path: '/tmp/data.json' },
});
// result.content: Array<{ type: 'text' | 'image' | 'resource', text?: string }>

// 4. Déconnecter quand terminé
await client.close();
```

### Découverte des outils et mise en cache
Les outils ne changent pas lors de l'exécution d'un serveur. Mettre en cache la liste des outils lors de la connexion — ne pas refaire la récupération par requête :
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

### Gestion des erreurs
```ts
try {
  const result = await client.callTool({ name: 'unknown_tool', arguments: {} });
} catch (err) {
  if (err instanceof McpError) {
    // err.code: ErrorCode enum (ToolNotFound, InvalidRequest, etc.)
    // err.message: description lisible par l'humain
  }
}
```
Gérer la déconnexion du serveur en attrapant les erreurs de transport et en se reconnectant avec backoff.

### Client multi-serveur
Se connecter à plusieurs serveurs MCP et fusionner leurs listes d'outils en une seule couche de routage :
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

### Modèle méta-MCP (agent utilisant les outils MCP)
Passer les outils découverts directement à Claude en tant que tableau d'outils — Claude les appellera, vous proxyez l'appel vers le serveur MCP :

```ts
const { tools } = await client.listTools();

// Convertir le schéma d'outil MCP au format d'outil Anthropic
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

// Quand Claude retourne un bloc tool_use, le proxyser vers MCP
for (const block of response.content) {
  if (block.type === 'tool_use') {
    const mcpResult = await client.callTool({ name: block.name, arguments: block.input });
    // Alimenter le résultat en retour à Claude comme tool_result
  }
}
```

## Exemple

Une application qui se connecte à trois serveurs MCP (filesystem, GitHub, Postgres), fusionne leurs outils et permet à Claude de les utiliser tous dans une seule boucle agentic :

1. Se connecter à tous les trois serveurs au démarrage, mettre en cache les listes d'outils
2. Construire le tableau d'outils fusionné — 23 outils total sur trois serveurs
3. Passer tous les 23 outils à Claude avec `defer_loading: true` pour les peu utilisés
4. Claude appelle `query_database` — le client route vers le serveur MCP Postgres
5. Claude appelle `create_pull_request` — le client route vers le serveur MCP GitHub
6. Le résultat de chaque outil retourné en tant que message `tool_result` à Claude
7. À l'arrêt, fermer proprement tous les trois transports

---
