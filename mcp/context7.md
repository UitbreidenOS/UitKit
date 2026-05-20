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
