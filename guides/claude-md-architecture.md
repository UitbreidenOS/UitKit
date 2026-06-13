# CLAUDE.md Architecture Guide

How to structure `CLAUDE.md` for projects of any size — from solo repositories to large monorepos with multiple teams.

---

## What CLAUDE.md is for

`CLAUDE.md` is Claude Code's project memory. It loads into every session automatically and tells Claude:
- What this codebase is and how it's structured
- How to run, test, and deploy it
- Rules and conventions that must always apply
- What NOT to do

A good `CLAUDE.md` eliminates repeated instructions. A bad one is ignored, too long, or contradicts what Claude already knows.

---

## The three levels

Claude Code reads three CLAUDE.md files, merged in order (later overrides earlier):

```
~/.claude/CLAUDE.md           # User-level: your personal preferences across all projects
{project-root}/CLAUDE.md      # Project-level: checked into the repo, applies to everyone
{project-root}/.claude/       # Local-level (gitignored): your overrides for this project
```

**User-level** — your personal rules: preferred response style, tools you always want, formatting preferences. Not checked in.

**Project-level** — the team's shared rules: how to run the project, coding conventions, what areas are off-limits. Checked into git.

**Local-level** — your personal overrides for this specific project: personal API keys, work-in-progress instructions, things not ready to share with the team.

---

## CLAUDE.md template

This is the structure that works for most projects. Copy and fill in your details.

```markdown
# {Project Name}

{One sentence describing what this project does and who it's for.}

---

## Architecture

{Describe the high-level architecture in 3–5 sentences. What are the main components? How do they interact?}

### Directory structure
{Show the important directories and what lives there. Skip boilerplate.}

---

## Key commands

{The commands developers run every day. Be exact — copy-paste ready.}

\`\`\`bash
{dev-start}   # Start development server
{test}        # Run the test suite
{lint}        # Run linter
{build}       # Production build
\`\`\`

---

## Conventions

### Code style
{Describe the style conventions that aren't enforced by the linter — naming patterns, file organisation, patterns to follow.}

### Patterns to use
{Describe the architectural patterns in use. E.g., "Use the repository pattern for all data access" or "Server Components by default, Client Components only when interactive."}

### Patterns to avoid
{Describe common mistakes or anti-patterns that apply to this specific codebase. E.g., "Never call the DB from a route handler — use a service layer."}

---

## What not to touch

{List files, directories, or systems Claude should not modify without explicit instruction.}

- `migrations/` — never edit migration files; create new ones with the migration CLI
- `public/vendor/` — third-party files, don't edit

---

## Testing

{Describe how tests are organised and what kind of coverage is expected.}

\`\`\`bash
{test-unit}          # Run unit tests
{test-integration}   # Run integration tests
{test-e2e}           # Run end-to-end tests
\`\`\`

Test files live next to source files: `foo.ts` → `foo.test.ts`.

---

## Environment

{List required env vars and how to get them.}

\`\`\`bash
DATABASE_URL=...   # PostgreSQL connection string — see 1Password > {vault name}
API_KEY=...        # {service name} API key — see .env.example
\`\`\`

Start local services: \`docker compose up -d\`
```

---

## Sizing guide

| Project size | CLAUDE.md size | What to include |
|---|---|---|
| Solo, simple | 20–50 lines | Key commands, main conventions, "don't touch" list |
| Team, single service | 50–150 lines | Full template above |
| Multi-service | 150–300 lines | Architecture overview + per-service pointers |
| Monorepo | 100–200 lines at root + per-package CLAUDE.md | Root = global rules, packages = local rules |

**Hard limit:** Keep CLAUDE.md under 500 lines. Above that, it becomes noise. Rules that aren't followed don't help.

---

## Monorepo structure

For monorepos, use multiple CLAUDE.md files — one at the root and one in each package that has its own conventions.

```
repo/
├── CLAUDE.md                 # Global: shared conventions, monorepo tooling, workspace commands
├── packages/
│   ├── api/
│   │   └── CLAUDE.md         # API-specific: FastAPI patterns, DB access, auth
│   ├── web/
│   │   └── CLAUDE.md         # Frontend-specific: Next.js patterns, component rules
│   └── shared/
│       └── CLAUDE.md         # Shared lib: what this exports, how to add to it
└── infra/
    └── CLAUDE.md             # Infra-specific: Terraform conventions, cloud setup
```

**Root CLAUDE.md** covers:
- What the monorepo contains and how packages relate
- Workspace commands (`npm run build --workspace=api`)
- Shared conventions (commit format, branch naming, PR process)
- Cross-package dependencies and what's allowed

**Package CLAUDE.md** covers:
- Only what's different from the root
- Package-specific patterns and anti-patterns
- Local commands and test strategy

---

## Rules that work

### Write rules as constraints, not requests
```markdown
# Bad (ignored)
Please try to use the service layer for database access.

# Good (followed)
Never call the database from a controller or route handler.
All DB access must go through a service in src/services/.
```

### Be specific, not generic
```markdown
# Bad (Claude already knows this)
Write clean, readable code.
Follow best practices.
Use meaningful variable names.

# Good (project-specific)
Use snake_case for Python, camelCase for TypeScript.
All public functions must have type annotations.
Never use `Any` — use `Unknown` or define the type.
```

### Explain the *why* for non-obvious rules
```markdown
# Bad (mysterious)
Don't use the UserService from the AuthModule.

# Good (explains the constraint)
Don't import from AuthModule in other modules — it creates circular dependencies.
Use the shared UserRepository from @/shared/db instead.
```

### The "don't touch" list is load-bearing
```markdown
## Do not modify
- `src/generated/` — auto-generated from the OpenAPI spec, run `npm run generate` to update
- `migrations/` — create new migrations with `npm run migration:create`, never edit existing ones
- `public/service-worker.js` — generated by the build, do not edit directly
```

---

## Anti-patterns

**Too long.** If your CLAUDE.md is 500+ lines, Claude treats the bottom half as low-priority context. Trim ruthlessly — every line should be load-bearing.

**Duplicating what the linter enforces.** Don't document rules that ESLint or Prettier already enforce. If the tool catches it, Claude doesn't need to know.

**Generic advice.** "Write tests for all new features" — Claude already knows this. Write rules that are specific to *your* project's conventions.

**Outdated instructions.** A stale CLAUDE.md that describes how the project *used to* work is worse than no CLAUDE.md. Review it when you do major refactors.

**Contradictory rules.** "Always use TypeScript" in the root CLAUDE.md and "Python preferred" in the service CLAUDE.md will confuse Claude. Make the hierarchy clear.

---

## Updating CLAUDE.md

**After a refactor:** update the directory structure section and any anti-patterns that changed.

**After onboarding a new team member:** ask them what confused them. Their confusion points to missing CLAUDE.md content.

**After a repeated mistake:** if you correct Claude for the same thing twice, add a rule. If you add a rule and it's violated again, make it stronger — move it to the top, make it a constraint not a preference.

**Quarterly review:** read the whole file, remove anything that's stale, add anything from recent sessions that you keep repeating.

---
