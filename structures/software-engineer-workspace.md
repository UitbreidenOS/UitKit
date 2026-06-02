# Software Engineer Workspace — Project Structure

> For a software engineer doing daily feature development, code review, debugging, architecture decisions, and documentation — optimizing the full cycle from ticket to merged PR.

## Stack

- **Version control:** GitHub (code hosting, PRs, Actions CI)
- **Issue tracking:** Linear or Jira (ticket management, sprint planning)
- **IDE:** VS Code or Cursor with Claude Code extension
- **Containerisation:** Docker 25+ with Docker Compose for local dev environments
- **Observability:** Datadog (APM, logs, traces) or Sentry (error tracking, session replay)
- **Documentation:** Notion or Confluence (team wiki, runbooks, onboarding)
- **Communication:** Slack (async comms, GitHub/Linear integrations)
- **Runtime:** Node.js 20+ / Python 3.12+ / Go 1.22+ depending on service
- **Testing:** Jest / pytest / Go test with coverage reporting
- **Linting/formatting:** ESLint + Prettier / Ruff / gofmt enforced pre-commit

## Directory tree

```
software-engineer-workspace/
├── .claude/
│   ├── CLAUDE.md                           # Workspace instructions for Claude Code
│   ├── settings.json                       # MCP servers, hooks, permissions
│   └── commands/
│       ├── spec-to-code.md                 # /spec-to-code — takes a spec/ticket, scaffolds implementation plan
│       ├── code-review.md                  # /code-review — reviews current diff for bugs and cleanups
│       ├── debug.md                        # /debug — takes error message or unexpected behavior, traces root cause
│       ├── test-write.md                   # /test-write — generates unit and integration tests for changed code
│       ├── pr-description.md               # /pr-description — drafts PR title, summary, test plan from git diff
│       ├── refactor.md                     # /refactor — identifies and applies safe refactors without behavior change
│       └── arch-sketch.md                  # /arch-sketch — produces ADR draft or system design outline
├── specs/
│   ├── _template.md                        # Canonical spec format: goal, non-goals, API shape, edge cases
│   ├── 2025-06-user-notifications/
│   │   ├── spec.md                         # Feature spec before coding begins
│   │   ├── api-contract.md                 # OpenAPI or GraphQL schema draft
│   │   └── edge-cases.md                  # Identified edge cases and failure modes
│   ├── 2025-05-search-refactor/
│   │   ├── spec.md
│   │   └── migration-plan.md               # Step-by-step migration with rollback strategy
│   └── 2025-04-rate-limiting/
│       └── spec.md
├── decisions/
│   ├── _template.md                        # ADR format: context, decision, consequences, alternatives
│   ├── 001-database-choice.md              # ADR: why PostgreSQL over MongoDB
│   ├── 002-api-versioning-strategy.md      # ADR: URL versioning vs header versioning
│   ├── 003-caching-layer.md                # ADR: Redis vs in-process cache
│   ├── 004-auth-mechanism.md               # ADR: JWT vs opaque tokens, refresh strategy
│   └── 005-monorepo-vs-polyrepo.md         # ADR: current repository strategy rationale
├── debugging/
│   ├── _template.md                        # Debug session format: symptom, hypothesis, findings, fix
│   ├── 2025-06-01-memory-leak-api.md       # Complex bug session: Node.js heap growth in /api/search
│   ├── 2025-05-14-slow-query-orders.md     # Session: N+1 query traced via Datadog APM
│   └── 2025-04-22-race-condition-jobs.md   # Session: job deduplication race under load
├── learning/
│   ├── postgres-jsonb-indexing.md          # Notes: GIN vs GiST index performance for JSONB queries
│   ├── react-query-v5-migration.md         # Notes: breaking changes and new patterns from v4→v5
│   ├── opentelemetry-setup.md              # Notes: manual instrumentation patterns with OTEL SDK
│   ├── redis-lua-scripting.md              # Experiment results: atomic ops with Lua vs transactions
│   └── zod-schema-composition.md          # Pattern notes: discriminated unions, branded types
├── reviews/
│   ├── checklist-backend.md                # Review checklist: security, error handling, observability
│   ├── checklist-frontend.md               # Review checklist: accessibility, bundle size, error states
│   ├── checklist-database.md               # Review checklist: migrations, indexes, query plans
│   ├── standards.md                        # Team coding standards and naming conventions
│   └── common-feedback.md                  # Recurring PR feedback patterns to watch for
├── docs/
│   ├── onboarding.md                       # New engineer setup: repo clone, env setup, first PR
│   ├── local-dev-setup.md                  # Docker Compose services, seed data, env vars
│   ├── runbooks/
│   │   ├── deploy-process.md               # How to deploy: branch, CI, merge, monitor
│   │   ├── rollback.md                     # How to roll back a bad deploy safely
│   │   └── database-migrations.md          # How to write, test, and apply migrations safely
│   └── system-diagrams/
│       ├── service-map.md                  # Services, dependencies, external integrations
│       └── data-flow.md                    # Request lifecycle: client → API → DB → cache
├── .github/
│   └── workflows/
│       ├── ci.yml                          # PR checks: lint, type-check, test, coverage gate
│       ├── deploy-staging.yml              # Auto-deploy to staging on merge to main
│       └── codeql.yml                      # GitHub CodeQL security scanning on PRs
├── docker-compose.yml                      # Local dev: postgres, redis, kafka, localstack
├── docker-compose.override.yml            # Local overrides: volume mounts, debug ports
└── .env.example                            # All required env vars with descriptions, no real values
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/spec-to-code.md` | Reads the spec file for the current feature branch, generates an implementation plan with file stubs, function signatures, and test anchors before any code is written |
| `.claude/commands/debug.md` | Takes a pasted error, stack trace, or unexpected behavior description; traces through logs, code paths, and recent diffs to isolate root cause and propose a targeted fix |
| `.claude/commands/arch-sketch.md` | Produces an ADR draft or lightweight system design — surfaces trade-offs, alternative approaches, and open questions for async review before committing to an approach |
| `specs/_template.md` | Canonical spec format: problem statement, success criteria, API shape, edge cases, non-goals, open questions — ensures specs are complete before coding starts |
| `decisions/_template.md` | ADR format following the Nygard style: context, decision made, status, consequences, and rejected alternatives with rationale |
| `reviews/checklist-backend.md` | Backend PR checklist covering: input validation, auth enforcement, error response shape, DB query efficiency, observability hooks, and migration safety |
| `debugging/_template.md` | Session format: symptom, environment details, reproduction steps, hypotheses tried, root cause, fix applied, and prevention note — persistent knowledge base for complex bugs |
| `docs/runbooks/database-migrations.md` | Migration workflow: backward-compatible schema changes only, blue-green deploy awareness, rollback SQL, performance impact assessment for large tables |

## Quick scaffold

```bash
# Create the full software engineer workspace structure
mkdir -p software-engineer-workspace
cd software-engineer-workspace

# Claude Code config
mkdir -p .claude/commands

# Spec directories (add per-feature subdirs as needed)
mkdir -p specs

# Architecture decisions
mkdir -p decisions

# Debugging sessions
mkdir -p debugging

# Learning notes
mkdir -p learning

# Review materials
mkdir -p reviews

# Documentation
mkdir -p docs/runbooks docs/system-diagrams

# GitHub Actions
mkdir -p .github/workflows

# Scaffold template files
touch specs/_template.md
touch decisions/_template.md
touch debugging/_template.md
touch reviews/checklist-backend.md
touch reviews/checklist-frontend.md
touch reviews/checklist-database.md
touch reviews/standards.md
touch docs/onboarding.md
touch docs/local-dev-setup.md
touch docs/runbooks/deploy-process.md
touch docs/runbooks/rollback.md
touch docs/runbooks/database-migrations.md
touch docs/system-diagrams/service-map.md
touch .env.example

# Docker Compose for local dev services
cat > docker-compose.yml << 'EOF'
version: "3.9"
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: app_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
EOF

# Install skills
npx claudient add skill productivity/code-review
npx claudient add skill productivity/debug
npx claudient add skill productivity/refactor
npx claudient add skill productivity/test-generator
npx claudient add skill git/pr-description
npx claudient add skill productivity/security-audit
npx claudient add skill productivity/spec-driven-workflow
npx claudient add skill productivity/tech-debt-tracker

# Copy installed skills as workspace commands
cp ~/.claude/skills/productivity/code-review.md .claude/commands/code-review.md
cp ~/.claude/skills/productivity/debug.md .claude/commands/debug.md
cp ~/.claude/skills/productivity/refactor.md .claude/commands/refactor.md
cp ~/.claude/skills/productivity/test-generator.md .claude/commands/test-write.md
cp ~/.claude/skills/git/pr-description.md .claude/commands/pr-description.md
cp ~/.claude/skills/productivity/spec-driven-workflow.md .claude/commands/spec-to-code.md

echo "Software engineer workspace scaffolded."
```

## CLAUDE.md template

```markdown
# Software Engineer Workspace

This workspace spans the full software development lifecycle — from reading a ticket to
merging a reviewed, tested, and documented PR. Work here includes feature implementation,
code review, debugging production issues, architecture decisions, and keeping docs current.

## Stack

- Runtime: Node.js 20 (TypeScript 5.4) — adjust to your service's language
- Database: PostgreSQL 16 with Drizzle ORM (migrations in drizzle/migrations/)
- Cache: Redis 7 (ioredis client, keyspace: app:{env}:{resource}:{id})
- API: Express 4 with Zod validation on all request bodies and params
- Testing: Jest 29, Supertest for integration, test DB spun up per suite
- CI: GitHub Actions — ci.yml runs on every PR; deploy-staging.yml on merge to main
- Observability: Datadog APM (dd-trace auto-instrumentation) + Sentry for exceptions
- Containers: Docker Compose for local dev (postgres, redis); see docker-compose.yml

## Directory conventions

- `specs/` — one subdirectory per feature, created before coding begins; spec.md first
- `decisions/` — ADRs numbered sequentially; never delete, mark superseded ones [SUPERSEDED]
- `debugging/` — session notes for any bug that takes more than 30 minutes to resolve
- `learning/` — notes on new patterns, library upgrades, experiment results
- `reviews/` — checklists and standards; update when recurring PR feedback patterns emerge
- `docs/runbooks/` — operational docs for deploy, rollback, and migration procedures

## Common tasks — use these exact commands

### Start implementing from a ticket or spec
/spec-to-code — paste the Linear/Jira ticket or point to specs/<feature>/spec.md

### Review your own diff before opening a PR
/code-review

### Debug an error or unexpected behavior
/debug — paste the stack trace, error message, or describe the unexpected behavior

### Write tests for changed code
/test-write — runs against the current git diff

### Draft a PR description
/pr-description — reads git log and diff, outputs title + summary + test plan

### Refactor without changing behavior
/refactor — point at a file or function; produces safe, incremental cleanup

### Sketch an architecture or write an ADR
/arch-sketch — describe the problem; outputs design options and ADR draft

## Feature development workflow

1. Pull the ticket from Linear/Jira; read the acceptance criteria carefully
2. Create specs/<feature-name>/spec.md before writing any code
3. Run /spec-to-code to generate an implementation plan
4. Create a feature branch: git checkout -b feat/<linear-ticket-id>-short-description
5. Implement incrementally; run tests after each meaningful chunk
6. Run /code-review on your own diff before pushing
7. Run /pr-description to generate the PR description
8. Open PR; request review; address feedback same day if possible
9. After merge: check staging deploy, verify in Datadog, close ticket

## Code conventions

- All functions must have explicit return types (no implicit any)
- Error handling: never swallow errors silently; always log with context (request ID, user ID)
- Database queries: always include LIMIT on list endpoints; explain analyze for new queries
- API responses: consistent shape — { data, error, meta } — never raw objects
- Feature flags: new user-facing features behind a flag until QA sign-off
- Migrations: always backward-compatible; never drop columns in the same PR that removes usage

## Testing conventions

- Unit tests: colocated in __tests__/ next to the source file
- Integration tests: in tests/integration/; use real DB via testcontainers or test DB URL
- Coverage gate: 80% line coverage required; CI fails below threshold
- Test names: describe the behavior, not the implementation ("returns 404 when user not found")
- Never mock the database in integration tests — test against real queries

## Observability conventions

- Every API handler: log at entry and exit with request ID and duration
- Every background job: log start, completion, and item count processed
- Errors sent to Sentry: include user ID, request ID, and relevant input context
- New features: add a Datadog custom metric or dashboard panel before shipping

## What not to do

- Do not commit secrets or .env files — use .env.example with placeholder values
- Do not open a PR without a spec entry if the change is larger than a one-liner fix
- Do not merge without at least one approval and green CI
- Do not skip writing tests because "it's a small change" — small changes cause regressions
- Do not add a new dependency without checking bundle size impact and license
```

## MCP servers

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "${LINEAR_API_KEY}"
      }
    },
    "sentry": {
      "command": "npx",
      "args": ["-y", "@sentry/mcp-server"],
      "env": {
        "SENTRY_AUTH_TOKEN": "${SENTRY_AUTH_TOKEN}",
        "SENTRY_ORG": "${SENTRY_ORG}",
        "SENTRY_PROJECT": "${SENTRY_PROJECT}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/software-engineer-workspace"
      ]
    }
  }
}
```

## Recommended hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'EXT=\"${CLAUDE_TOOL_INPUT_FILE_PATH##*.}\"; if [[ \"$EXT\" == \"ts\" || \"$EXT\" == \"tsx\" || \"$EXT\" == \"js\" ]]; then npx prettier --write \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>/dev/null || true; elif [[ \"$EXT\" == \"py\" ]]; then ruff format \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>/dev/null || true; elif [[ \"$EXT\" == \"go\" ]]; then gofmt -w \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>/dev/null || true; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_COMMAND\" | grep -qE \"git (push|commit).*(main|master)\"; then echo \"[HOOK] Direct push/commit to main detected — use a feature branch and open a PR instead.\" >&2; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if git -C \"$PWD\" diff --name-only 2>/dev/null | grep -q .; then echo \"Reminder: uncommitted changes in working tree — stage, stash, or commit before ending session.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
npx claudient add skill productivity/code-review
npx claudient add skill productivity/debug
npx claudient add skill productivity/refactor
npx claudient add skill productivity/test-generator
npx claudient add skill git/pr-description
npx claudient add skill productivity/security-audit
npx claudient add skill productivity/spec-driven-workflow
npx claudient add skill productivity/tech-debt-tracker
```

## Related

- [Software Engineer Guide](../guides/for-software-engineer.md)
- [Feature Development Workflow](../workflows/feature-development.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
