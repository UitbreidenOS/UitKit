---
name: team-onboarding
updated: 2026-06-13
---

# Team Onboarding

## When to activate

- User runs `/team-onboarding`
- User asks to generate an onboarding document for a new team member or contractor
- User wants to capture project context for a developer who is joining the project
- User wants a "start here" document covering setup through first deployment
- Setting up AI-assisted onboarding for a team where new members use Claude Code

## When NOT to use

- The project already has an up-to-date `ONBOARDING.md` or equivalent — update the existing doc rather than regenerating
- The request is for general company HR onboarding — this skill covers technical project onboarding only
- The user wants a README — a README is public-facing; onboarding docs are internal, opinionated, and assume the reader has repo access

## Instructions

### What to Generate

The onboarding document covers everything a developer needs to go from zero to first commit. Sections:

1. **Project Overview** — What it does, who uses it, and why it exists (2–4 sentences max)
2. **Tech Stack** — Framework, language, runtime, database, cache, queue — with exact version numbers pulled from `package.json`, `pyproject.toml`, `go.mod`, or equivalent
3. **Local Setup** — Step-by-step commands to clone, install, configure env, seed data, and run the dev server; every command must be copy-pasteable
4. **Key File Locations** — Where the important things live: entry points, config, routes, db schema, tests, CI config
5. **Testing** — How to run tests (unit, integration, e2e), what the coverage threshold is, how to run a single test file
6. **Deployment** — How staging and production deploys work, who can trigger them, what the rollback procedure is
7. **Team Conventions** — Branch naming, commit format, PR process, who reviews what, code style enforcement
8. **Claude Code Config** — What skills are active in `.claude/skills/`, what agents are available, what MCP servers are configured, useful slash commands for this project

### How to Source Information

Read these files before generating:

```
README.md                  — project description, quick start
package.json / pyproject.toml / go.mod / Cargo.toml — versions, scripts, dependencies
CLAUDE.md                  — team conventions, Claude config
Makefile                   — available commands
docker-compose.yml         — services, ports, environment
.env.example               — required environment variables
.github/workflows/         — CI/CD pipeline, test commands, deploy triggers
src/ or app/               — entry points, top-level structure
```

Do not invent information. If a section's source file doesn't exist or doesn't contain the relevant info, write a placeholder like `[TODO: add deployment process]` rather than guessing.

### Output Format

Output: a single Markdown document. No HTML, no front matter.

Structure:
```markdown
# Project Name — Developer Onboarding

> One-sentence description of what the project does.

## Prerequisites
## Local Setup
## Tech Stack
## Key File Locations
## Running Tests
## Deployment
## Team Conventions
## Claude Code Config
## Getting Help
```

Keep it scannable. Use code blocks for every command. Use tables for tech stack and file locations. Target length: 2–4 pages when printed.

### Where to Save

Check in this order:
1. If `docs/` directory exists → save to `docs/onboarding.md`
2. If `ONBOARDING.md` already exists → update it in place
3. Default → save to `ONBOARDING.md` at the project root

After saving, tell the user the file path and suggest they add it to the new hire checklist or a pinned Slack/Notion link.

### Filling the Claude Code Config Section

Read `.claude/` to populate this section:

```bash
ls .claude/skills/     # list active skills → document slash commands
ls .claude/agents/     # list agents → document when to use each
cat .claude/settings.json  # MCP servers, hooks, auto-approvals
```

Format as a quick-reference table:

| Slash command | What it does |
|---|---|
| `/graphql-client` | Set up Apollo Client with codegen |
| `/db-specialist` | Delegate complex query optimization to the DB agent |
| `/pr-review` | Run automated PR review before merging |

## Example

Run `/team-onboarding` on a Next.js + Drizzle + Vercel project.

Claude reads: `package.json` (Next.js 15, Drizzle ORM 0.30, TypeScript 5.4), `docker-compose.yml` (PostgreSQL 16 on port 5432), `.env.example` (DATABASE_URL, NEXTAUTH_SECRET, RESEND_API_KEY), `Makefile` (dev, test, migrate, seed targets), `.github/workflows/deploy.yml` (Vercel preview on PR, production on merge to main), `CLAUDE.md` (squash merge policy, conventional commits, PR requires 1 approval).

Generated `docs/onboarding.md` includes:

```markdown
# Acme App — Developer Onboarding

> B2B SaaS for invoice management — Next.js 15 frontend, Drizzle ORM + PostgreSQL backend, deployed on Vercel.

## Prerequisites
- Node.js 20+
- Docker Desktop (for local PostgreSQL)
- Vercel CLI: `npm i -g vercel`

## Local Setup
\`\`\`bash
git clone git@github.com:org/acme-app.git
cd acme-app
npm install
cp .env.example .env.local        # fill in DATABASE_URL and NEXTAUTH_SECRET
docker compose up -d               # starts PostgreSQL on localhost:5432
npm run db:migrate                 # apply all migrations
npm run db:seed                    # load dev fixtures
npm run dev                        # http://localhost:3000
\`\`\`

## Tech Stack
| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15.1.0 |
| Language | TypeScript | 5.4.5 |
| ORM | Drizzle ORM | 0.30.9 |
| Database | PostgreSQL | 16 |
| Auth | NextAuth.js | 5.0.0-beta |
| Email | Resend | 3.2.0 |
| Deployment | Vercel | — |

...
```

The full document runs ~3 pages and covers everything from first clone to first merged PR.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
