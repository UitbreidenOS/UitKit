---
name: agents-md
description: "Generate AGENTS.md for cross-agent portability (Claude Code, Cursor, Codex, Gemini CLI). Tool-agnostic repo context document, distinct from CLAUDE.md."
updated: 2026-06-13
---

# AGENTS.md Writer

## When to activate

- User wants the repo to work consistently across multiple AI coding tools (Claude Code, Cursor, Codex, Gemini CLI)
- Setting up a new repo for AI-assisted development and need a single shared context document
- CLAUDE.md exists but is Claude Code-specific and other tools are getting inconsistent results
- Team is standardizing on a tool-agnostic AI context convention
- After a CLAUDE.md audit when you want to extract the tool-agnostic subset

## When NOT to use

- The project only ever uses Claude Code — CLAUDE.md is the right document, not AGENTS.md
- The repo has an existing AGENTS.md that just needs updating (use the context-auditor prompt to trim CLAUDE.md and mirror changes)
- MCP configurations, hook scripts, or slash command definitions — these are Claude Code-specific and do not belong in AGENTS.md

## Instructions

### AGENTS.md vs CLAUDE.md

| CLAUDE.md | AGENTS.md |
|---|---|
| Claude Code-specific | Works with any AI coding tool |
| Can reference hooks, MCP, slash commands | Tool-agnostic — no Claude features |
| Can be verbose (loaded once per session) | Should be concise (<400 lines) |
| Project + Claude behavior rules | Project conventions + agent safety rules |
| Owned by Claude Code users | Owned by any AI-assisted team |

The two files can coexist. AGENTS.md is the superset of what all tools share; CLAUDE.md adds Claude Code-specific extensions on top.

### AGENTS.md structure

Every AGENTS.md must contain these sections in order:

**1. Project Overview**
Two to four sentences. What the project does, who it serves, what problem it solves. No marketing language.

**2. Tech Stack**
Bulleted list: language + version, framework + version, major libraries, database, hosting/infrastructure.
Only what is actually in the repo — no aspirational additions.

**3. Key Conventions**
The rules any developer (or AI agent) must follow to produce acceptable code. Pull from:
- Existing CLAUDE.md if present
- Linting configuration (`.eslintrc`, `pyproject.toml`, `rubocop.yml`)
- README
- Patterns observed in the existing codebase

Include: naming conventions, file organization, patterns to use, patterns to avoid.

**4. Agent Behavior Rules**
Instructions specifically for AI agents:
- Commands safe to run without asking: tests, linting, formatting, type checking
- Commands requiring human confirmation: deploy, migrate, publish, drop, truncate, restart
- File creation policy: ask before creating new files vs. edit-first
- Commit policy: ask before committing vs. autonomous commits allowed
- Scope discipline: what the agent should NOT do even if it seems helpful

**5. File Safety Map**
A table classifying paths by risk:

| Path / Pattern | Status | Notes |
|---|---|---|
| `src/`, `lib/`, `app/` | SAFE | Feature code — normal editing |
| `tests/`, `spec/`, `__tests__/` | SAFE | Tests — modify freely |
| `docs/` | SAFE | Documentation |
| `prisma/migrations/`, `db/migrate/` | CAUTION | Run only with approval |
| `src/auth/`, `src/payments/` | CAUTION | Security-sensitive — flag before changing |
| `.env`, `*.secret`, `credentials.*` | DANGEROUS | Never read or modify |
| `Dockerfile`, `.github/workflows/` | DANGEROUS | Infrastructure — approval required |
| `dist/`, `build/`, `.next/` | DANGEROUS | Generated — do not edit directly |

**6. Test Commands**
Exact commands copied from `package.json` scripts, Makefile, or CI config. No paraphrasing.

```
Test:    npm test
Lint:    npm run lint
Typecheck: npm run typecheck
Format:  npm run format
```

### What to exclude from AGENTS.md

- Claude Code hooks (`PreToolUse`, `PostToolUse`, `Stop`)
- MCP server configurations
- Claude slash command definitions
- Model guidance (Haiku vs Sonnet vs Opus)
- Instructions referencing Claude-specific features (Agent tool, /compact, memory files)
- Internal team names, Jira ticket numbers, personal preferences

These belong only in CLAUDE.md.

### Generating AGENTS.md

Use the `prompts/task-specific/agents-md-generator.md` prompt for a fully automated generation pass. The skill here covers the format; the prompt covers the invocation.

## Example

**Project:** Next.js 14 SaaS app with Prisma + PostgreSQL, deployed on Vercel.

Generated AGENTS.md excerpt:

```markdown
# AGENTS.md

## Project Overview
A multi-tenant SaaS dashboard for tracking software delivery metrics.
Built for engineering teams of 5–50 people. Core value: answering
"how fast are we shipping and where are we blocked" in under 30 seconds.

## Tech Stack
- TypeScript 5.4
- Next.js 14 (App Router)
- Prisma 5 + PostgreSQL 16
- Tailwind CSS 3.4
- Vercel (hosting + Edge Functions)
- Vitest (unit), Playwright (e2e)

## Key Conventions
- All components: PascalCase, one component per file
- All utilities: camelCase functions, kebab-case filenames
- No barrel exports (no index.ts re-exports)
- Server Components by default; add 'use client' only when necessary
- Database queries only in `src/lib/db/` — never in components or API routes directly
- No `any` types — use `unknown` + type guard if the shape is uncertain

## Agent Behavior Rules
Safe to run autonomously: `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm format`
Require confirmation: `prisma migrate deploy`, `vercel --prod`, any `DROP` SQL
Ask before creating new files in: `src/lib/db/`, `prisma/migrations/`
Do not commit autonomously — always present changes for review first

## File Safety Map
| Path | Status | Notes |
|---|---|---|
| `src/components/` | SAFE | |
| `src/app/` | SAFE | |
| `src/lib/` | CAUTION | Core business logic |
| `prisma/migrations/` | DANGEROUS | Never modify existing migrations |
| `.env*` | DANGEROUS | Never read or write |
| `.github/` | DANGEROUS | CI/CD — approval required |

## Test Commands
pnpm test          # Vitest unit tests
pnpm test:e2e      # Playwright end-to-end
pnpm lint          # ESLint
pnpm typecheck     # tsc --noEmit
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
