# AGENTS.md Guide

AGENTS.md is a companion to CLAUDE.md — it makes your project instructions portable across all AI coding assistants, not just Claude Code.

## What is AGENTS.md?

While `CLAUDE.md` is Claude Code-specific, `AGENTS.md` is a community convention for cross-agent compatibility. The same project can be used with:
- Claude Code (`CLAUDE.md`)
- Cursor (reads `AGENTS.md` or `cursor.md`)
- OpenAI Codex CLI
- Gemini CLI
- Any agent that follows the AGENTS.md convention

## CLAUDE.md vs AGENTS.md

| | CLAUDE.md | AGENTS.md |
|---|---|---|
| **Reads it** | Claude Code only | Claude Code + Cursor + Codex + others |
| **Location** | Project root | Project root |
| **Claude Code priority** | Primary | Secondary (CLAUDE.md takes precedence) |
| **Format** | Markdown | Markdown |
| **Purpose** | Claude-specific context | Universal agent context |

## Creating AGENTS.md

Keep it focused on what any AI coding assistant needs to be effective on your project — not Claude-specific features:

```markdown
# AGENTS.md

## Project Overview
[2-3 sentences: what this project does, who it serves]

## Tech Stack
- Language: [TypeScript 5.4]
- Framework: [Next.js 15, App Router]
- Database: [PostgreSQL via Drizzle ORM]
- Auth: [Better Auth]
- Deployment: [Railway]

## Commands
- Dev: `npm run dev`
- Tests: `npm test`
- Build: `npm run build`
- Lint: `npm run lint`
- DB migrate: `npx drizzle-kit migrate`

## Key Directories
- `src/app/` — Next.js App Router pages
- `src/components/` — Shared UI components
- `src/lib/` — Utilities and helpers
- `src/db/` — Database schema and queries

## Coding Conventions
- TypeScript strict mode — no `any`
- Server Components by default; `use client` only when needed
- Conventional commits: feat/fix/chore/docs/refactor
- Tests required for new business logic

## Do Not Modify
- `src/db/schema.ts` — coordinate schema changes with the team
- `.env.example` — update when adding new env vars
- `src/middleware.ts` — coordinate auth changes

## Common Tasks
- Adding an API route: create `src/app/api/[name]/route.ts`
- Adding a component: create in `src/components/[name].tsx`
- Database query: add to `src/db/queries/[entity].ts`
```

## What to include vs. exclude

**Include:**
- Build and test commands
- Directory structure and purpose
- Coding conventions that apply to all agents
- Files that must not be modified without coordination

**Exclude:**
- Claude Code-specific features (hooks, agents, `/skills`) → put in CLAUDE.md
- Secrets or credentials → never in any tracked file
- Things already obvious from the code

## Auto-generating AGENTS.md

Ask Claude Code to generate it:

```
"Read the project and generate an AGENTS.md file.
Focus on: tech stack, key directories, commands, conventions, and what not to touch.
Keep it under 80 lines — concise enough that any agent reads it fully."
```

## Keeping it in sync

AGENTS.md should be updated when:
- The tech stack changes (framework upgrade, new service)
- New developers or agents join the project
- Key directories are restructured
- Commands change (test runner, build process)

Add a reminder in your CLAUDE.md:
```markdown
## Maintenance
When changing tech stack or commands: update both CLAUDE.md and AGENTS.md
```

## Relationship to CLAUDE.md

A typical project has both:
- **AGENTS.md**: universal context (80 lines, focused on what any agent needs)
- **CLAUDE.md**: Claude-specific additions (hooks to load, agents to use, Claude Code-specific patterns)

CLAUDE.md can reference AGENTS.md:
```markdown
# CLAUDE.md

See AGENTS.md for project overview, stack, and commands.

## Claude Code Specific
- Load /skills/backend/nodejs/nextjs at session start
- Run /ship-gate before any production deploy
- Use /agents/advisors/cto-advisor for architecture questions
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
