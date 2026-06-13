---
name: bun
description: "Runtime Bun : construire rapidement des APIs compatibles Node.js avec le serveur intégré Bun, bundler, test runner et gestionnaire de paquets — framework Elysia, SQLite et patterns optimisés pour edge"
---

# Bun Skill

## Quand activer
- Construire une nouvelle API ou service avec Bun comme runtime
- Utiliser le framework Elysia (l'équivalent Hono/Express pour Bun)
- Migrer une application Node.js vers Bun pour des gains de performance
- Utiliser le SQLite intégré Bun pour les bases de données edge ou intégrées
- Configurer le test runner intégré Bun (pas de Jest nécessaire)

## Quand ne PAS utiliser
- Cloudflare Workers — utiliser la compétence hono (Bun s'exécute sur des serveurs, pas sur l'edge Cloudflare)
- Les projets Next.js — Next.js utilise Node.js ; la compatibilité Bun s'améliore mais n'est pas complète
- Les projets avec des add-ons natifs Node.js qui ne supportent pas encore Bun

## Instructions

### Configuration du projet

```bash
# Installer Bun
curl -fsSL https://bun.sh/install | bash

# Créer un nouveau projet
mkdir my-api && cd my-api
bun init               # crée package.json, index.ts, tsconfig.json

# Ou construire avec Elysia
bun create elysia my-api
cd my-api && bun install

# Exécuter
bun run index.ts       # ou: bun index.ts
bun --watch index.ts   # rechargement à chaud

# Gestion de paquets (remplacement drop-in npm, 10-100x plus rapide)
bun install            # installer à partir de package.json
bun add express        # ajouter un paquet
bun remove express     # supprimer un paquet
bun update             # mettre à jour tous
```

### Serveur HTTP natif Bun

```typescript
Construire un serveur HTTP Bun pour [cas d'usage].

// index.ts — serveur intégré de Bun (aucun framework nécessaire pour les APIs simples)
const server = Bun.serve({
  port: 3000,
  hostname: '0.0.0.0',

  async fetch(req) {
    const url = new URL(req.url)

    // Gestion des routes
    if (url.pathname === '/health') {
      return Response.json({ status: 'ok', uptime: process.uptime() })
    }

    if (url.pathname === '/api/users' && req.method === 'GET') {
      const users = await getUsers()
      return Response.json(users)
    }

    if (url.pathname === '/api/users' && req.method === 'POST') {
      const body = await req.json()
      const user = await createUser(body)
      return Response.json(user, { status: 201 })
    }

    return new Response('Not Found', { status: 404 })
  },

  error(error) {
    console.error(error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  },
})

console.log(`Listening on http://localhost:${server.port}`)
```

### Framework Elysia

```typescript
Construire une API Elysia pour [service].

Elysia est le framework web idiomatique de Bun — type-safe, rapide, minimal.

npm install elysia @elysiajs/swagger

// app.ts
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
  .use(swagger())           // génère automatiquement l'interface Swagger à /swagger
  
  // Définir les routes avec la sécurité des types complète
  .get('/health', () => ({ status: 'ok' }))
  
  // Route avec paramètre de chemin
  .get('/users/:id', ({ params: { id } }) => {
    return getUserById(id)
  }, {
    params: t.Object({ id: t.String() }),
    response: t.Object({
      id: t.String(),
      name: t.String(),
      email: t.String(),
    })
  })
  
  // Route avec validation de corps
  .post('/users', async ({ body }) => {
    return createUser(body)
  }, {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      email: t.String({ format: 'email' }),
    })
  })
  
  // Middleware (appliquer à toutes les routes)
  .onBeforeHandle(({ request, set }) => {
    const auth = request.headers.get('Authorization')
    if (!auth?.startsWith('Bearer ')) {
      set.status = 401
      return { error: 'Unauthorized' }
    }
  })
  
  .listen(3000)

console.log(`Running at ${app.server?.hostname}:${app.server?.port}`)

Générer l'app Elysia pour mon service.
```

### SQLite intégré

```typescript
Utiliser le SQLite intégré de Bun pour [cas d'usage].

// Aucune installation nécessaire — SQLite est intégré dans Bun
import { Database } from 'bun:sqlite'

const db = new Database('myapp.db', { create: true })

// Créer des tables
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// Prepared statements (plus rapide, prévient l'injection SQL)
const insertUser = db.prepare(
  'INSERT INTO users (email, name) VALUES (?, ?) RETURNING *'
)

const getUser = db.prepare(
  'SELECT * FROM users WHERE id = ?'
)

const listUsers = db.prepare(
  'SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?'
)

// Exécuter
const newUser = insertUser.get('alice@example.com', 'Alice')
const user = getUser.get(1)
const users = listUsers.all(20, 0)

// Transactions (opérations atomiques)
const transferPoints = db.transaction((fromId: number, toId: number, points: number) => {
  db.run('UPDATE users SET points = points - ? WHERE id = ?', [points, fromId])
  db.run('UPDATE users SET points = points + ? WHERE id = ?', [points, toId])
})

transferPoints(1, 2, 100)  // atomique — tout ou rien

// Fermer quand terminé
db.close()
```

### Test runner Bun

```typescript
Écrire des tests pour [module] en utilisant le test runner intégré de Bun.

// Aucun Jest, Vitest ou Mocha nécessaire — Bun a un test runner intégré
// Exécuter: bun test

import { describe, it, expect, beforeAll, afterAll, mock } from 'bun:test'
import { createUser, getUser } from './users'

describe('User service', () => {
  describe('createUser', () => {
    it('creates a user and returns an ID', async () => {
      const user = await createUser({ name: 'Alice', email: 'alice@example.com' })
      expect(user.id).toBeString()
      expect(user.name).toBe('Alice')
    })

    it('throws on duplicate email', async () => {
      await createUser({ name: 'Bob', email: 'bob@example.com' })
      expect(
        createUser({ name: 'Bob 2', email: 'bob@example.com' })
      ).rejects.toThrow()
    })
  })
})

// Modules mock
const mockEmailService = mock(() => Promise.resolve({ id: 'email-123' }))

// Mode watch
// bun test --watch

// Couverture
// bun test --coverage

// Filtrer les tests
// bun test --testNamePattern "createUser"
```

### Benchmarks de performance

```bash
# Comparaison Bun vs Node.js pour les tâches courantes:
# Package install: bun install est ~10-30x plus rapide que npm install
# Exécution TypeScript: bun exécute .ts directement, aucune étape de compilation
# Temps de démarrage: ~3-5ms vs ~30-50ms pour Node.js
# Débit HTTP: généralement 2-3x plus req/s que Express sur Node.js

# Benchmarquer votre serveur Bun:
bun run bench.ts

// bench.ts
const results = await fetch('http://localhost:3000/api/users')
console.time('100 requests')
for (let i = 0; i < 100; i++) {
  await fetch('http://localhost:3000/api/users')
}
console.timeEnd('100 requests')
```

## Exemple

**User:** Je veux construire une API REST rapide pour un projet de fin de semaine. Devrais-je utiliser Bun + Elysia ou Node.js + Hono?

**Claude's comparison:**

Pour un projet de fin de semaine où vous voulez la vitesse de développement ET la performance d'exécution:

**Utiliser Bun + Elysia si :**
- Vous voulez un runtime pour tout (gestionnaire de paquets, bundler, test runner, TypeScript — aucune config)
- Vous êtes sur Mac ou Linux (Bun est entièrement supporté ; le support Windows s'améliore)
- Vous voulez le démarrage à froid et le débit les plus rapides possibles
- Vous aimez la sécurité des types end-to-end (l'inférence de type d'Elysia est excellente)

**Utiliser Hono + Cloudflare Workers si :**
- Vous voulez le déploiement global sur edge (Bun s'exécute sur VPS, pas sur Cloudflare)
- Vous avez besoin du KV, D1 ou R2 de Cloudflare
- Vous êtes déjà familier avec l'API d'Hono

**Pour un projet de fin de semaine: Bun + Elysia gagne** — `bun create elysia my-api` vous met à exécution en 30 secondes avec rechargement à chaud, Swagger intégré et routes type-safe. Aucun tweaking tsconfig, aucune config jest, aucun nodemon.

```bash
bun create elysia my-api && cd my-api && bun dev
# Running at http://localhost:3000 — c'est tout
```

---
