# MCP: Context7 — Live Documentation

Give Claude Code access to up-to-date documentation for any library or framework. No more hallucinated APIs or outdated code examples.

## Why you need this

Claude's training data has a knowledge cutoff. For fast-moving libraries (Next.js 16, LangGraph 1.2, shadcn/ui), the docs Claude knows may be months or years out of date. Context7 solves this by fetching current documentation on demand.

## What it does

- Fetches live, version-specific documentation for any library
- Injects the relevant docs section into Claude's context
- Claude generates code against the actual current API, not a remembered version
- Covers: React, Next.js, Tailwind, shadcn/ui, Prisma, Drizzle, LangChain, LangGraph, and thousands more

## Configuration

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

No API key required for basic usage.

## How to use in sessions

```
# Explicitly request current docs
"Using context7, get the latest Next.js 16 App Router docs for data fetching"

# Claude will fetch and use them
"Build a server action using the current Next.js syntax"

# For version-specific questions
"What's the correct way to use useFormState in React 19?"
```

## Triggers

You can also just work normally — Context7 is triggered when Claude detects it needs to look up documentation. Or add this to your CLAUDE.md:

```markdown
## Libraries
When writing code with Next.js, React, Tailwind, or shadcn/ui:
- Use context7 MCP to fetch current documentation before generating code
- Always specify the version we're using (see package.json)
```

## Supported libraries

Covers most major npm packages and Python libraries. If a library isn't indexed, Context7 falls back to fetching the official docs page directly.

## vs. including docs in CLAUDE.md

CLAUDE.md docs go stale and consume context on every session. Context7 fetches only what's needed, when it's needed — zero overhead when you're not using a specific library.

## Why Context7 is Essential

Claude's training data has a hard cutoff — and fast-moving ecosystems (Next.js, Drizzle, shadcn/ui, LangGraph) ship breaking changes faster than any model can absorb. Without Context7, Claude might generate code using a deprecated API from six months ago: an `app/` directory pattern that changed, a hook that was renamed, a config key that was removed. The error only surfaces at runtime.

Context7 closes this gap at the point of use. When you ask Claude to write a Next.js 15 server action, Claude calls `resolve-library-id` → gets the Context7 canonical ID for Next.js → calls `get-library-docs` with the specific topic → receives the current API reference → writes code against it. The entire fetch happens in the same conversation turn, invisible to you.

This matters most for:

- **Frameworks with frequent major versions**: Next.js, React, SvelteKit, Astro
- **ORMs and query builders**: Drizzle, Prisma, Kysely — schema and migration APIs change between minor versions
- **AI SDKs**: Anthropic SDK, Vercel AI SDK, LangChain, LangGraph — these evolve weekly
- **UI component libraries**: shadcn/ui, Radix, Mantine — component prop APIs change without major version bumps

The pattern to make it reliable: mention Context7 and the specific feature explicitly in your prompt. `"Use context7 to look up the Next.js 15 server action + revalidatePath API before writing this."` is more effective than a generic `"use context7"` — the topic specificity determines which docs section gets fetched.

Context7 covers 1000+ libraries. For anything not indexed, it falls back to fetching the official documentation URL. Either way, Claude is working from current source material rather than a training snapshot.

---
