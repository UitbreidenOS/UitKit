---
name: llms-txt
description: "llms.txt standard: create AI-readable documentation indexes that reduce hallucinations by 60%+ vs context stuffing — for your own projects and libraries"
---

# llms.txt Skill

## Wanneer activeren
- Documentatie maken die AI-agenten efficiënt kunnen navigeren
- Claude Code instellen om de nieuwste docs van uw project te gebruiken zonder API's te hallucineren
- Een bibliotheek of framework bouwen en deze AI-leesbaar willen maken
- Context window-gebruik verminderen bij het werken met grote documentatie-sets
- Claude inschakelen om alleen de specifieke docs op te halen die het voor een taak nodig heeft

## Wanneer NIET gebruiken
- Kleine projecten waar de docs rechtstreeks plakken prima is (< 5.000 tokens)
- Wanneer geen documentatie bestaat nog — schrijf eerst de docs
- Privé interne tools zonder externe documentatie site

## Wat is llms.txt

De `llms.txt` standaard (llmstxt.org) is een eenvoudig markdown-bestand in de root van een documentatie site dat als machine-readable index dient. In plaats van honderdduizenden tokens ruwe documentatie in een prompt in te stoppen (wat hallucinatie risico verhoogt door context verwarring te creëren), leest een agent de beknopte index, redeneert welke specifieke pagina's het nodig heeft, en haalt alleen die op.

**Zonder llms.txt:** agent leest alles → context bloat → gemengde API's → hallucinaties  
**Met llms.txt:** agent leest index → redeneert → haalt 3 specifieke pagina's op → nauwkeurige generatie

Onderzoek toont 60%+ vermindering in API hallucinatie-fouten versus ruwe context stuffing aan.

## Instructies

### Basis llms.txt formaat

```markdown
<!-- /llms.txt — place at your docs site root -->
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

**Formatregels:**
- `# Title` — bibliotheek naam (één regel)
- `> Description` — één zin over wat het doet
- `## Docs` — vereiste pagina's (agent haalt deze op wanneer relevant)
- `## Optional` — aanvullende pagina's (agent haalt deze alleen op indien nodig)
- Elk regel: `- [Page Name](URL): one-sentence description`
- Beschrijvingen moeten semantisch zijn — de agent matcht deze met gebruikersverzoeken

### Genereer llms.txt voor uw project

```bash
# Use the llms-txt CLI to generate from existing docs
npx llms-txt-generator --source ./docs --output ./public/llms.txt

# Or generate from a live docs site
npx llms-txt-generator --url https://docs.myproject.com --output ./llms.txt
```

### Handmatig schrijf llms.txt voor uw CLAUDE.md project

Voor projecten die u met Claude Code bouwt, voeg een `llms.txt` toe die verwijst naar de externe documentatie die Claude zou moeten gebruiken:

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

### Verbind llms.txt met Claude Code via MCP

```json
// .claude/settings.json — add a URL-loading MCP server
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

Of gebruik de eenvoudige fetch-benadering in een CLAUDE.md:

```markdown
<!-- CLAUDE.md — point Claude to your llms.txt -->
## Documentation

When you need to reference external library docs, first fetch and read:
https://docs.myproject.com/llms.txt

Then use the links in that file to fetch only the specific pages relevant to the task.
Do NOT load the entire documentation site — use the index to reason about what you need.
```

### llms.txt voor een bibliotheek die u publiceert

Als u een bibliotheek publiceert en wilt dat Claude (en andere agenten) deze correct gebruiken:

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

**Dien uw llms.txt in** bij de gids op llmstxt.org zodat Claude en andere agenten het kunnen ontdekken.

### Schrijven goede pagina-beschrijvingen

De one-sentence beschrijving per link is kritiek — het is wat de agent gebruikt om te bepalen of de pagina moet worden opgehaald.

```markdown
# Bad descriptions (too vague — agent can't reason about relevance)
- [Authentication](/auth): Auth docs
- [API Reference](/api): API reference

# Good descriptions (semantic — agent can match to user request)
- [Authentication](/auth): API key setup, OAuth2 PKCE flow, token refresh with retry logic
- [API Reference](/api): Complete method signatures for all endpoints with TypeScript types, parameters, return types, and error codes
```

### Verifieer uw llms.txt werkt

```bash
# Test: does Claude fetch only what it needs?
# Prompt: "Show me how to implement pagination using the cursor pattern"

# Good: Claude fetches only /docs/pagination
# Bad: Claude fetches all 20 documentation pages
```

## Voorbeeld

**Gebruiker:** Maak een `llms.txt` voor een project met Vercel AI SDK + Anthropic + Next.js zodat Claude Code geen SDK-methodenamen hallucineerd.

**Verwachte output:**
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
