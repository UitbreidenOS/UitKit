# Prompt: AGENTS.md Generator

## Purpose

Generate a structured `AGENTS.md` file that makes a repository portable across AI coding tools — Claude Code, Cursor, Codex, and Gemini CLI all honor `AGENTS.md` as a shared context document.

## When to use

- Setting up a new repository that multiple AI tools will work in
- An existing repo works well with Claude Code but behaves inconsistently in Cursor or Codex
- Onboarding a team to AI-assisted development and you need a single source of truth
- After a CLAUDE.md exists and you want a tool-agnostic companion document

## The Prompt

```
Analyze this repository and generate a complete AGENTS.md file.

Read the following before generating:
- README.md (or README if no extension)
- CLAUDE.md or .cursorrules if present
- package.json / pyproject.toml / Cargo.toml / go.mod (whichever apply)
- The top-level directory structure (list dirs, not every file)
- Two or three representative source files to understand conventions

Then produce an AGENTS.md with exactly these sections:

## Project Overview
Two to four sentences: what the project does, who uses it, what problem it solves.

## Tech Stack
Bulleted list: language + version, framework + version, key libraries, database, infrastructure.
Only list what is actually present — no aspirational stack.

## Key Conventions
The rules a developer (or AI agent) must follow to produce acceptable code in this repo.
Include: naming conventions, file organization, preferred patterns, what NOT to do.
Pull these from CLAUDE.md, README, linting config, or existing code — never invent rules.

## Agent Behavior Rules
Instructions specific to AI agents working in this repo:
- Which commands are safe to run autonomously (tests, linting, formatting)
- Which commands require human confirmation (deploy, migrate, drop, publish)
- Whether the agent should ask before creating new files vs. editing existing
- Whether the agent should commit autonomously or always ask

## File Safety Map
A table with three columns: Path/Pattern | Safe to modify | Notes
Mark as SAFE: test files, docs, config examples
Mark as CAUTION: database migrations, auth logic, payment code, env files
Mark as DANGEROUS: production configs, secrets, CI/CD definitions, generated files

## Test Commands
Exact commands to run tests, linting, type checking, and formatting.
Copy from package.json scripts or Makefile — do not paraphrase.

---
Rules for generation:
- Every claim must come from something you read in the repo — no assumptions
- If a section has no relevant content, write "Not specified — defer to README" rather than inventing
- AGENTS.md must be tool-agnostic: no Claude Code-specific features (hooks, MCP, slash commands)
- Keep total length under 400 lines
- Output as a single markdown code block I can copy to AGENTS.md
```

## Variables

| Variable | Description |
|---|---|
| (none) | This prompt is self-directed — Claude reads the repo itself |

## Example

Invocation: paste the prompt above and run it on a Next.js + Prisma project.

Expected output structure:
- Project Overview: "A multi-tenant SaaS dashboard built with Next.js 14 and Prisma..."
- Tech Stack: Node 20, Next.js 14, TypeScript 5.4, Prisma 5, PostgreSQL, Vercel
- Key Conventions: `PascalCase` for components, `camelCase` for functions, no barrel exports
- Agent Behavior Rules: run `pnpm test` freely, never run `prisma migrate deploy` without approval
- File Safety Map: `prisma/migrations/` marked DANGEROUS, `src/components/` marked SAFE
- Test Commands: `pnpm test`, `pnpm lint`, `pnpm typecheck`

---
