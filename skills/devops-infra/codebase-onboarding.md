---
name: codebase-onboarding
description: "Codebase onboarding: generate architecture overviews, create onboarding checklists, document service boundaries, write getting-started guides for new engineers"
updated: 2026-06-13
---

# Codebase Onboarding Skill

## When to activate
- A new engineer is joining the team and needs to get productive fast
- Writing an architecture overview document for an undocumented codebase
- Creating a "Day 1" guide for setting up a local development environment
- Mapping service boundaries and data flows in a microservices system
- Helping an existing engineer onboard to an unfamiliar part of the codebase
- Generating context for Claude to understand an existing codebase deeply

## When NOT to use
- Writing API documentation for external consumers — that's technical writing
- Security onboarding or access provisioning — separate process
- Onboarding non-engineers (product managers, designers) — different scope

## Instructions

### Architecture overview

```
Generate an architecture overview for this codebase.

Codebase: [describe — monolith / microservices / serverless / monorepo]
Tech stack: [languages, frameworks, databases, infra]
Team size: [X engineers]
Audience: [new engineer joining the team]

Architecture overview sections:

1. What this system does (2-3 sentences):
   [Plain English — what problem does this codebase solve, who uses it?]

2. High-level architecture:
   [Describe the major components and how they relate]
   [If microservices: list services + one-line purpose for each]
   [If monolith: list major modules/domains]

3. Tech stack summary:
   | Layer | Technology | Why |
   |---|---|---|
   | Frontend | [X] | [brief reason] |
   | API | [X] | [brief reason] |
   | Database | [X] | [brief reason] |
   | Queue | [X] | [brief reason] |
   | Cache | [X] | [brief reason] |
   | Infra | [X] | [brief reason] |

4. Data flow for the most important user journey:
   [Step-by-step: user does X → system does Y → data lands in Z]

5. Key directories and what they contain:
   [Top-level directory map with one-line purpose for each]

6. Things that are non-obvious:
   [Hidden dependencies, gotchas, legacy decisions with known debt]

7. Where NOT to touch without a senior review:
   [Core payment flows / auth / database migrations / etc.]

Generate the overview by reading the codebase structure I provide.
```

### Day 1 onboarding guide

```
Write a Day 1 onboarding guide for a new engineer.

Tech stack: [languages, tools, package managers]
OS support: [Mac / Linux / both]
Required accounts/access: [list — GitHub, AWS, internal tools]
Local setup complexity: [simple (3 commands) / moderate / complex (DB, services)]

Guide sections:

## Prerequisites (before your first day)
□ [Account 1] — request from [contact]
□ [Account 2] — request from [contact]
□ Install: Homebrew / nvm / pyenv / etc.

## Clone and install (15 minutes)
[Exact commands, copy-pasteable]
git clone [repo]
cd [project]
[install dependencies — exact commands]
[environment setup — .env.example → .env]
[database setup if needed]

## Run it locally (5 minutes)
[Commands to start all services]
[What to expect — URLs, ports]
[Common first-run errors and fixes]

## Verify it works
□ [Health check URL] → should return [X]
□ [Key feature test] → should do [Y]
□ [Database connection test]

## First task (Day 1 afternoon)
[Small, safe, self-contained task for the new engineer to complete]
[Guides them through the PR process]
[Should take 1-2 hours maximum]

## Who to ask for what
| Domain | Go-to person |
|---|---|
| [Frontend] | [Name] |
| [Backend/API] | [Name] |
| [Infrastructure] | [Name] |
| [Product questions] | [Name] |

## Useful commands
[Cheatsheet of common dev commands for this repo]

## Things to read in the first week
[3-5 most important docs, ADRs, or design docs — not everything]

Generate for my tech stack with exact commands.
```

### Service boundary map

```
Document service boundaries for a microservices codebase.

Services: [list all services]
Communication patterns: [REST / gRPC / message queue / events]
Shared infrastructure: [databases, caches, queues shared across services]

For each service, document:

Service: [name]
Purpose: [one sentence — what does this service own?]
Owns this data: [which domain entities / database tables]
Exposes: [API endpoints / events published / queues consumed]
Depends on: [other services it calls + why]
Failure mode: [what happens to the system if this service goes down?]
SLO: [uptime target — if known]
Team ownership: [which team/engineer]

Inter-service communication map:
[Service A] → [Service B]: [what data flows, why, and how]
[Service B] → [Service C]: [...]

Shared resources and contention risks:
[Database X is shared by Services A, B, C — risk: schema migration coordination]
[Queue Y is produced by A and consumed by B, C — risk: schema changes]

Anti-corruption layers:
[Where does the system have explicit boundary enforcement? Where is it implicit?]

Generate the service boundary map for my architecture.
```

### Codebase context for Claude

```
Generate a context document so Claude can understand this codebase efficiently.

Purpose: I want to load this into Claude's context before working on a task, 
so Claude understands our architecture without reading every file.

Format for maximum Claude usefulness:

## Project summary
[2-3 sentences — what it does, who uses it, tech stack]

## Key conventions
- [Naming: e.g. camelCase for JS, snake_case for Python]
- [File structure: where to find [X type of file]]
- [Error handling: how errors are thrown and caught]
- [Testing: test file location, test runner, mocking approach]
- [Auth: how authentication works at a high level]

## Critical files
- Entry point: [file path] — [why it matters]
- Config: [file path]
- Database models/schema: [file path or directory]
- API routes: [file path or directory]
- Tests: [file path or directory]

## Do not modify without senior review
- [file/directory] — [why it's sensitive]

## Known technical debt
- [Thing 1] — [why it exists, don't be surprised by it]
- [Thing 2]

## Common tasks and how to do them
- Add a new API endpoint: [brief steps]
- Add a new database model: [brief steps]
- Run the test suite: [command]
- Deploy to staging: [command or process]

Generate this context document by reading my repo structure.
```

## Example

**User:** New backend engineer starting Monday. We have a Node.js + PostgreSQL API (Express), React frontend, and Redis for caching. Help me write the Day 1 guide.

**Claude's output:**

```markdown
# Day 1 — Backend Engineer Onboarding

## Before you start
□ GitHub access — ask [TechLead] to add you to the org
□ AWS account — IT will send credentials
□ 1Password — your manager will invite you

## Set up your machine (20 min)

### Install prerequisites
brew install node@20 postgresql redis
npm install -g pnpm

### Clone and install
git clone git@github.com:[org]/[repo].git
cd [repo]
cp .env.example .env          # ask a teammate for the actual values
pnpm install

### Start the database (first time only)
createdb appdb_local
pnpm db:migrate               # runs all migrations
pnpm db:seed                  # adds test data

### Start all services
pnpm dev                      # starts API on :3001 + starts Redis

## Verify it works
- API health: http://localhost:3001/health → should return {"status":"ok"}
- Auth test: POST /auth/login with test@example.com / password123

## Your first task (this afternoon)
Add a new field `updated_at` to the `/users/:id` GET response.
- File to edit: `src/routes/users.ts`
- Migration if needed: `pnpm db:migration:new add_updated_at_to_users`
- Test: `pnpm test src/routes/users.test.ts`
- Open a PR when done — tag @[senior] for review

## Who to ask
| Question | Person |
|---|---|
| API/backend | @senior-backend |
| Database/migrations | @dba |
| Frontend | @frontend-lead |
| Deploys | @devops |

## Quick commands
pnpm dev          # Start dev server
pnpm test         # Run all tests
pnpm test:watch   # Watch mode
pnpm db:migrate   # Run pending migrations
pnpm lint         # Check linting
```

---
