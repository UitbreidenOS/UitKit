---
name: llms-txt
description: "llms.txt standard: create AI-readable documentation indexes that reduce hallucinations by 60%+ vs context stuffing — for your own projects and libraries"
updated: 2026-06-13
---

# llms.txt Skill

## When to activate
- Creating documentation that AI agents can navigate efficiently
- Setting up Claude Code to use your project's latest docs without hallucinating APIs
- Building a library or framework and wanting to make it AI-legible
- Reducing context window usage when working with large documentation sets
- Enabling Claude to retrieve only the specific docs it needs for a task

## When NOT to use
- Small projects where pasting the docs directly is fine (< 5,000 tokens)
- When no documentation exists yet — write the docs first
- Private internal tools with no external documentation site

## What is llms.txt

The `llms.txt` standard (llmstxt.org) is a simple markdown file at the root of a documentation site that serves as a machine-readable index. Instead of stuffing hundreds of thousands of tokens of raw documentation into a prompt (which increases hallucination risk by creating context confusion), an agent reads the concise index, reasons about which specific pages it needs, and fetches only those.

**Without llms.txt:** agent reads everything → context bloat → mixed-up APIs → hallucinations  
**With llms.txt:** agent reads index → reasons → fetches 3 specific pages → accurate generation

Research shows 60%+ reduction in API hallucination errors vs raw context stuffing.

## Instructions

### Basic llms.txt format

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

**Format rules:**
- `# Title` — library name (one line)
- `> Description` — one sentence about what it does
- `## Docs` — required pages (agent fetches these when relevant)
- `## Optional` — supplementary pages (agent fetches only if needed)
- Each line: `- [Page Name](URL): one-sentence description`
- Descriptions must be semantic — the agent matches these to user requests

### Generate llms.txt for your project

```bash
# Use the llms-txt CLI to generate from existing docs
npx llms-txt-generator --source ./docs --output ./public/llms.txt

# Or generate from a live docs site
npx llms-txt-generator --url https://docs.myproject.com --output ./llms.txt
```

### Manually write llms.txt for your CLAUDE.md project

For projects you're building with Claude Code, add an `llms.txt` that points to the external documentation Claude should use:

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

### Connect llms.txt to Claude Code via MCP

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

Or use the simple fetch approach in a CLAUDE.md:

```markdown
<!-- CLAUDE.md — point Claude to your llms.txt -->
## Documentation

When you need to reference external library docs, first fetch and read:
https://docs.myproject.com/llms.txt

Then use the links in that file to fetch only the specific pages relevant to the task.
Do NOT load the entire documentation site — use the index to reason about what you need.
```

### llms.txt for a library you're publishing

If you're publishing a library and want Claude (and other agents) to use it correctly:

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

**Submit your llms.txt** to the directory at llmstxt.org so Claude and other agents can discover it.

### Writing good page descriptions

The one-sentence description per link is critical — it's what the agent uses to decide whether to fetch the page.

```markdown
# Bad descriptions (too vague — agent can't reason about relevance)
- [Authentication](/auth): Auth docs
- [API Reference](/api): API reference

# Good descriptions (semantic — agent can match to user request)
- [Authentication](/auth): API key setup, OAuth2 PKCE flow, token refresh with retry logic
- [API Reference](/api): Complete method signatures for all endpoints with TypeScript types, parameters, return types, and error codes
```

### Verify your llms.txt works

```bash
# Test: does Claude fetch only what it needs?
# Prompt: "Show me how to implement pagination using the cursor pattern"

# Good: Claude fetches only /docs/pagination
# Bad: Claude fetches all 20 documentation pages
```

## Example

**User:** Create an `llms.txt` for a project using Vercel AI SDK + Anthropic + Next.js so Claude Code doesn't hallucinate SDK method names.

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
