# Guide d'intégration MCP

Comment connecter des outils externes, des API et des bases de données à Claude Code en utilisant le protocole de contexte de modèle (MCP).

## Qu'est-ce que MCP?

MCP (Model Context Protocol) est une norme ouverte qui permet à Claude Code de communiquer avec les systèmes externes. Au lieu de coller les données dans la conversation, les serveurs MCP les exposent comme des outils que Claude peut appeler directement.

**Utilisez MCP quand vous voulez que Claude :**
- Interroger votre base de données sans exporter les données
- Lire à partir de vos API internes de l'entreprise
- Rechercher votre documentation en temps réel
- Se connecter à des outils SaaS (Jira, HubSpot, GitHub)

## Configurer un serveur MCP

### Option 1 : Utiliser un serveur MCP existant

De nombreux outils ont des serveurs MCP officiels ou communautaires :

```bash
# HubSpot (officiel)
npx @hubspot/mcp-server

# GitHub (officiel)
npx @modelcontextprotocol/server-github

# PostgreSQL (officiel)
npx @modelcontextprotocol/server-postgres postgres://localhost/mydb

# Système de fichiers (officiel)
npx @modelcontextprotocol/server-filesystem /path/to/directory
```

Configurez dans `~/.claude.json`:
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

### Option 2 : Créer un serveur MCP personnalisé

Utilisez la compétence `/mcp-server-builder` pour générer un nouveau serveur, ou utilisez ce modèle minimal :

```typescript
// server.ts — serveur MCP minimal
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

// Définir les outils disponibles
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'search_products',
      description: 'Rechercher le catalogue de produits par nom ou catégorie',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Terme de recherche' },
          category: { type: 'string', description: 'Filtre de catégorie de produit' },
        },
        required: ['query'],
      },
    },
  ],
}))

// Implémenter l'exécution des outils
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'search_products') {
    const { query, category } = request.params.arguments as {
      query: string
      category?: string
    }
    
    // Votre implémentation réelle ici
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
  
  throw new Error(`Outil inconnu : ${request.params.name}`)
})

// Démarrer le serveur
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

Configurez-le :
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

## Motifs populaires de serveur MCP

### Accès à la base de données

```typescript
// Outil : run_query
{
  name: 'run_query',
  description: 'Exécuter une requête SQL en lecture seule contre la base de données de production',
  inputSchema: {
    type: 'object',
    properties: {
      sql: { type: 'string', description: 'Déclaration SQL SELECT' },
    },
    required: ['sql'],
  },
}

// Implémentation
if (!sql.trim().toUpperCase().startsWith('SELECT')) {
  throw new Error('Seules les requêtes SELECT sont autorisées')
}
const result = await db.query(sql)
return { content: [{ type: 'text', text: JSON.stringify(result.rows) }] }
```

### Accès aux API internes

```typescript
// Outil : get_customer
{
  name: 'get_customer',
  description: 'Rechercher un client par e-mail ou ID à partir du CRM interne',
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

### Recherche de documentation

```typescript
// Outil : search_docs
{
  name: 'search_docs',
  description: 'Rechercher la documentation interne, les manuels opérationnels et les wikis',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string' },
      section: { type: 'string', description: 'Facultatif : limiter à une section' },
    },
    required: ['query'],
  },
}
```

## Meilleures pratiques de sécurité

- **Lecture seule par défaut** : les outils MCP qui interrogent les données ne doivent pas pouvoir les modifier
- **Aucune écriture de production à partir de Claude** : utiliser MCP pour les lectures ; acheminer les écritures via des PR examinées par l'homme
- **Portée du jeton** : donner au serveur MCP les permissions minimales dont il a besoin
- **Enregistrer les appels MCP** : auditer quels outils Claude appelle et avec quels arguments
- **Valider toutes les entrées** : traiter les arguments des outils MCP comme les entrées utilisateur (désinfecter avant utilisation)

## Débogage

```bash
# Tester que le serveur fonctionne avant de se connecter à Claude Code
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/server.js

# Activer la journalisation de débogage MCP de Claude Code
CLAUDE_MCP_DEBUG=1 claude
```

## Contenu connexe

- `/skills/ai-engineering/mcp-server-builder` — compétence complète pour créer des serveurs MCP
- `/mcp/` directory — configurations de serveur et recommandations pour les outils populaires

---
