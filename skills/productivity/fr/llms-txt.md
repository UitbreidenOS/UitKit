---
name: llms-txt
description: "Standard llms.txt : créer des index de documentation lisibles par IA qui réduisent les hallucinations de 60%+ par rapport au remplissage de contexte — pour vos propres projets et bibliothèques"
---

# llms.txt Skill

## Quand activer
- Créer une documentation que les agents IA peuvent naviguer efficacement
- Configurer Claude Code pour utiliser la dernière documentation de votre projet sans halluciner les APIs
- Construire une bibliothèque ou un framework et vouloir le rendre lisible par IA
- Réduire l'utilisation de la fenêtre de contexte quand on travaille avec de grands ensembles de documentation
- Activer Claude pour récupérer uniquement les docs spécifiques dont il a besoin pour une tâche

## Quand ne PAS utiliser
- Les petits projets où coller directement les docs est acceptable (< 5 000 tokens)
- Quand aucune documentation n'existe encore — écrire d'abord les docs
- Les outils internes privés sans site de documentation externe

## Qu'est-ce que llms.txt

Le standard `llms.txt` (llmstxt.org) est un simple fichier markdown à la racine d'un site de documentation qui sert d'index lisible par machine. Au lieu d'entasser des centaines de milliers de tokens de documentation brute dans une invite (ce qui augmente le risque d'hallucination en créant de la confusion contextuelle), un agent lit l'index concis, raisonne sur les pages spécifiques dont il a besoin, et récupère seulement celles-ci.

**Sans llms.txt:** agent lit tout → context bloat → APIs mélangées → hallucinations  
**Avec llms.txt:** agent lit index → raisonne → récupère 3 pages spécifiques → génération précise

La recherche montre une réduction de 60%+ des erreurs d'hallucination d'API par rapport au remplissage de contexte brut.

## Instructions

### Format de base llms.txt

```markdown
<!-- /llms.txt — placer à la racine de votre site de documentation -->
# My Library

> TypeScript-first HTTP client for the Acme API

## Docs

- [Getting Started](/docs/getting-started): Installation, first request, authentication setup
- [API Reference](/docs/api-reference): Complete method signatures with parameters and return types
- [Authentication](/docs/auth): API key, OAuth2, JWT token patterns and refresh logic
- [Error Handling](/docs/errors): Error codes, retry logic, exception types
- [Pagination](/docs/pagination): Cursor and offset pagination, iterating large result sets
- [Rate Limiting](/docs/rate-limiting): Limits per tier, backoff strategies, header interpretation
- [Webhooks](/docs/webhooks): Signature verification, event types, retry behaviour
- [Examples](/docs/examples): Common patterns: CRUD, streaming, batch operations

## Optional

- [Migration Guide](/docs/migration): Breaking changes and upgrade paths between major versions
- [Changelog](/docs/changelog): Version history
```

**Règles de formatage:**
- `# Title` — nom de la bibliothèque (une ligne)
- `> Description` — une phrase sur ce qu'elle fait
- `## Docs` — pages requises (agent récupère celles-ci quand pertinent)
- `## Optional` — pages supplémentaires (agent récupère seulement si besoin)
- Chaque ligne: `- [Page Name](URL): description d'une phrase`
- Les descriptions doivent être sémantiques — l'agent correspond celles-ci aux demandes d'utilisateur

### Générer llms.txt pour votre projet

```bash
# Utiliser le CLI llms-txt pour générer à partir de docs existantes
npx llms-txt-generator --source ./docs --output ./public/llms.txt

# Ou générer à partir d'un site de docs en direct
npx llms-txt-generator --url https://docs.myproject.com --output ./llms.txt
```

### Écrire manuellement llms.txt pour votre projet CLAUDE.md

Pour les projets que vous construisez avec Claude Code, ajouter un `llms.txt` qui pointe vers la documentation externe que Claude devrait utiliser :

```markdown
<!-- llms.txt for a Next.js + Drizzle + Better Auth project -->
# Project Tech Stack

> SaaS app using Next.js 16, Drizzle ORM, Neon Postgres, Better Auth, shadcn/ui

## Framework Docs

- [Next.js App Router](https://nextjs.org/docs/app): Server Components, Server Actions, route handlers, middleware
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching): fetch patterns, caching, revalidation

## Database

- [Drizzle ORM Docs](https://orm.drizzle.team/docs): Schema definition, queries, migrations, relations
- [Neon Serverless](https://neon.tech/docs): Branching, connection pooling, pgvector

## Auth

- [Better Auth Docs](https://www.better-auth.com/docs): Setup, providers, session, plugins, 2FA

## UI

- [shadcn/ui Components](https://ui.shadcn.com/docs/components): Available components, usage, theming

## Optional

- [Drizzle Kit](https://orm.drizzle.team/docs/kit-overview): Migration CLI commands
- [Neon pgvector](https://neon.tech/docs/extensions/pgvector): Vector search setup and queries
```

### Connecter llms.txt à Claude Code via MCP

```json
// .claude/settings.json — ajouter un serveur MCP de chargement URL
{
  "mcpServers": {
    "docs": {
      "command": "npx",
      "args": [
        "-y",
        "@llmstxt/mcp-server",
        "--llms-txt", "https://docs.myproject.com/llms.txt"
      ]
    }
  }
}
```

Ou utiliser l'approche fetch simple dans un CLAUDE.md :

```markdown
<!-- CLAUDE.md — pointer Claude vers votre llms.txt -->
## Documentation

Quand vous avez besoin de référencer les docs de bibliothèque externe, d'abord chercher et lire:
https://docs.myproject.com/llms.txt

Puis utiliser les liens dans ce fichier pour chercher seulement les pages spécifiques pertinentes pour la tâche.
Ne PAS charger le site de documentation entier — utiliser l'index pour raisonner sur ce dont vous avez besoin.
```

### llms.txt pour une bibliothèque que vous publiez

Si vous publiez une bibliothèque et voulez que Claude (et d'autres agents) l'utilisent correctement :

```markdown
<!-- public/llms.txt on your docs site -->
# acme-client

> Official TypeScript SDK for the Acme REST API. Supports Node.js 18+ and Edge Runtime.

## Docs

- [Installation](https://docs.acme.com/sdk/install): npm install, env setup, first call
- [Authentication](https://docs.acme.com/sdk/auth): API keys, OAuth, token refresh
- [Customers](https://docs.acme.com/sdk/customers): CRUD operations, search, pagination
- [Payments](https://docs.acme.com/sdk/payments): Charge, refund, subscription management
- [Webhooks](https://docs.acme.com/sdk/webhooks): Signature verification, event types
- [Error Handling](https://docs.acme.com/sdk/errors): Error classes, retry logic, HTTP status codes
- [TypeScript Types](https://docs.acme.com/sdk/types): Full type definitions and interfaces

## Optional

- [Migration from v1](https://docs.acme.com/sdk/migration): Breaking changes in v2
- [Examples](https://docs.acme.com/sdk/examples): Common patterns and recipes
- [Changelog](https://docs.acme.com/sdk/changelog): Version history
```

**Soumettre votre llms.txt** au répertoire sur llmstxt.org pour que Claude et d'autres agents puissent le découvrir.

### Écrire de bonnes descriptions de page

La description d'une phrase par lien est critique — c'est ce que l'agent utilise pour décider s'il faut récupérer la page.

```markdown
# Mauvaises descriptions (trop vague — l'agent ne peut pas raisonner sur la pertinence)
- [Authentication](/auth): Auth docs
- [API Reference](/api): API reference

# Bonnes descriptions (sémantiques — l'agent peut correspondre à la demande de l'utilisateur)
- [Authentication](/auth): API key setup, OAuth2 PKCE flow, token refresh with retry logic
- [API Reference](/api): Complete method signatures for all endpoints with TypeScript types, parameters, return types, and error codes
```

### Vérifier que votre llms.txt fonctionne

```bash
# Test: Claude ne récupère-t-il que ce dont il a besoin?
# Prompt: « Montrez-moi comment implémenter la pagination en utilisant le modèle cursor »

# Good: Claude fetches only /docs/pagination
# Bad: Claude fetches all 20 documentation pages
```

## Exemple

**User:** Créer un `llms.txt` pour un projet utilisant Vercel AI SDK + Anthropic + Next.js pour que Claude Code ne hallucine pas les noms de méthode SDK.

**Expected output:**
```markdown
# AI Chat App

> Next.js 16 + Vercel AI SDK + Anthropic Claude — streaming chat with tool calls

## Docs

- [Vercel AI SDK: useChat](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat): Hook API, message format, streaming, tool invocations
- [Vercel AI SDK: streamText](https://sdk.vercel.ai/docs/reference/ai-sdk-core/stream-text): Server-side streaming, tool definitions, maxSteps
- [Anthropic Claude Models](https://platform.claude.com/docs/about-claude/models/overview.md): Current model IDs, context windows, pricing
- [Vercel AI SDK: generateObject](https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-object): Structured output with Zod schemas

## Optional

- [Vercel AI SDK: Providers](https://sdk.vercel.ai/docs/foundations/providers-and-models): Switching between Claude, OpenAI, Gemini
- [Anthropic Prompt Caching](https://platform.claude.com/docs/build-with-claude/prompt-caching.md): cache_control setup, token savings
```

---
