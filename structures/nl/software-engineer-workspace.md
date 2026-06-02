# Software Engineer Workspace — Projectstructuur

> Voor een software-engineer die dagelijks feature-ontwikkeling, code review, debugging, architectuurbeslissingen en documentatie doet — geoptimaliseerd voor de volledige cyclus van ticket tot samengevoegde PR.

## Stack

- **Versiebeheer:** GitHub (code hosting, PRs, Actions CI)
- **Issue tracking:** Linear of Jira (ticketbeheer, sprint planning)
- **IDE:** VS Code of Cursor met Claude Code-extensie
- **Containerisatie:** Docker 25+ met Docker Compose voor lokale dev-omgevingen
- **Observabiliteit:** Datadog (APM, logs, traces) of Sentry (error tracking, session replay)
- **Documentatie:** Notion of Confluence (team wiki, runbooks, onboarding)
- **Communicatie:** Slack (async comms, GitHub/Linear integraties)
- **Runtime:** Node.js 20+ / Python 3.12+ / Go 1.22+ afhankelijk van service
- **Testen:** Jest / pytest / Go test met coverage reporting
- **Linting/formatting:** ESLint + Prettier / Ruff / gofmt afgedwongen pre-commit

## Directoryboom

```
software-engineer-workspace/
├── .claude/
│   ├── CLAUDE.md                           # Werkruimte-instructies voor Claude Code
│   ├── settings.json                       # MCP servers, hooks, permissions
│   └── commands/
│       ├── spec-to-code.md                 # /spec-to-code — neemt een spec/ticket, scaffolds implementatieplan
│       ├── code-review.md                  # /code-review — controleert huidige diff op bugs en cleanups
│       ├── debug.md                        # /debug — neemt foutbericht of onverwacht gedrag, traceert root cause
│       ├── test-write.md                   # /test-write — genereert unit en integration tests voor gewijzigde code
│       ├── pr-description.md               # /pr-description — schrijft PR titel, summary, testplan uit git diff
│       ├── refactor.md                     # /refactor — identificeert en past veilige refactors toe zonder gedragsverandering
│       └── arch-sketch.md                  # /arch-sketch — produceert ADR-concept of system design-schets
├── specs/
│   ├── _template.md                        # Canonieke spec-format: goal, non-goals, API shape, edge cases
│   ├── 2025-06-user-notifications/
│   │   ├── spec.md                         # Feature spec voordat codering begint
│   │   ├── api-contract.md                 # OpenAPI of GraphQL schema-concept
│   │   └── edge-cases.md                  # Geïdentificeerde edge cases en failure modes
│   ├── 2025-05-search-refactor/
│   │   ├── spec.md
│   │   └── migration-plan.md               # Stap-voor-stap migratie met rollback-strategie
│   └── 2025-04-rate-limiting/
│       └── spec.md
├── decisions/
│   ├── _template.md                        # ADR-format: context, decision, consequences, alternatives
│   ├── 001-database-choice.md              # ADR: waarom PostgreSQL boven MongoDB
│   ├── 002-api-versioning-strategy.md      # ADR: URL versioning vs header versioning
│   ├── 003-caching-layer.md                # ADR: Redis vs in-process cache
│   ├── 004-auth-mechanism.md               # ADR: JWT vs opaque tokens, refresh strategy
│   └── 005-monorepo-vs-polyrepo.md         # ADR: huidige repository-strategie rationale
├── debugging/
│   ├── _template.md                        # Debug sessie-format: symptom, hypothesis, findings, fix
│   ├── 2025-06-01-memory-leak-api.md       # Complexe bug sessie: Node.js heap growth in /api/search
│   ├── 2025-05-14-slow-query-orders.md     # Sessie: N+1 query getraceerd via Datadog APM
│   └── 2025-04-22-race-condition-jobs.md   # Sessie: job deduplicatie race onder belasting
├── learning/
│   ├── postgres-jsonb-indexing.md          # Notities: GIN vs GiST index performance voor JSONB queries
│   ├── react-query-v5-migration.md         # Notities: breaking changes en nieuwe patterns van v4→v5
│   ├── opentelemetry-setup.md              # Notities: manual instrumentation patterns met OTEL SDK
│   ├── redis-lua-scripting.md              # Experiment resultaten: atomic ops met Lua vs transactions
│   └── zod-schema-composition.md          # Pattern notities: discriminated unions, branded types
├── reviews/
│   ├── checklist-backend.md                # Review checklist: security, error handling, observability
│   ├── checklist-frontend.md               # Review checklist: accessibility, bundle size, error states
│   ├── checklist-database.md               # Review checklist: migrations, indexes, query plans
│   ├── standards.md                        # Team coding standards en naming conventions
│   └── common-feedback.md                  # Terugkerende PR feedback patterns om op te letten
├── docs/
│   ├── onboarding.md                       # Nieuwe engineer setup: repo clone, env setup, first PR
│   ├── local-dev-setup.md                  # Docker Compose services, seed data, env vars
│   ├── runbooks/
│   │   ├── deploy-process.md               # Hoe te deployen: branch, CI, merge, monitor
│   │   ├── rollback.md                     # Hoe een slechte deploy veilig terugdraaien
│   │   └── database-migrations.md          # Hoe migraties veilig schrijven, testen en toepassen
│   └── system-diagrams/
│       ├── service-map.md                  # Services, dependencies, externe integraties
│       └── data-flow.md                    # Request lifecycle: client → API → DB → cache
├── .github/
│   └── workflows/
│       ├── ci.yml                          # PR checks: lint, type-check, test, coverage gate
│       ├── deploy-staging.yml              # Auto-deploy naar staging bij merge naar main
│       └── codeql.yml                      # GitHub CodeQL security scanning op PRs
├── docker-compose.yml                      # Lokale dev: postgres, redis, kafka, localstack
├── docker-compose.override.yml            # Lokale overrides: volume mounts, debug ports
└── .env.example                            # Alle vereiste env vars met beschrijvingen, geen echte waarden
```

## Sleutelbestanden uitgelegd

| Path | Doel |
|---|---|
| `.claude/commands/spec-to-code.md` | Leest het spec-bestand voor de huidige feature branch, genereert een implementatieplan met file stubs, function signatures, en test anchors voordat code wordt geschreven |
| `.claude/commands/debug.md` | Neemt een geplakt error, stack trace, of beschrijving van onverwacht gedrag; traceert door logs, codepaths, en recente diffs om root cause te isoleren en gerichte fix voor te stellen |
| `.claude/commands/arch-sketch.md` | Produceert een ADR-concept of lichte system design — oppervlakkige trade-offs, alternatieve benaderingen, en open vragen voor async review voordat een aanpak wordt vastgelegd |
| `specs/_template.md` | Canonieke spec-format: problem statement, success criteria, API shape, edge cases, non-goals, open questions — zorgt dat specs volledig zijn voordat codering begint |
| `decisions/_template.md` | ADR-format volgende Nygard stijl: context, decision made, status, consequences, en rejected alternatives met rationale |
| `reviews/checklist-backend.md` | Backend PR checklist afdekking: input validation, auth enforcement, error response shape, DB query efficiency, observability hooks, en migration safety |
| `debugging/_template.md` | Sessie-format: symptom, environment details, reproduction steps, hypotheses tried, root cause, fix applied, en prevention note — persistent knowledge base voor complexe bugs |
| `docs/runbooks/database-migrations.md` | Migration workflow: backward-compatible schema changes only, blue-green deploy awareness, rollback SQL, performance impact assessment voor grote tables |

## Snelle scaffold

```bash
# Creëer de volledige software engineer workspace structuur
mkdir -p software-engineer-workspace
cd software-engineer-workspace

# Claude Code config
mkdir -p .claude/commands

# Spec directories (voeg per-feature subdirs toe naar behoefte)
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

# Docker Compose voor lokale dev services
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

Deze werkruimte omvat de volledige software development lifecycle — van het lezen van een ticket tot
het samenvoegen van een gereviewde, geteste en gedocumenteerde PR. Werk hier omvat feature implementation,
code review, debugging production issues, architecture decisions, en het hudig houden van documentatie.

## Stack

- Runtime: Node.js 20 (TypeScript 5.4) — pas aan naar de taal van je service
- Database: PostgreSQL 16 met Drizzle ORM (migrations in drizzle/migrations/)
- Cache: Redis 7 (ioredis client, keyspace: app:{env}:{resource}:{id})
- API: Express 4 met Zod validation op alle request bodies en params
- Testing: Jest 29, Supertest voor integration, test DB spun up per suite
- CI: GitHub Actions — ci.yml runs op elke PR; deploy-staging.yml bij merge naar main
- Observability: Datadog APM (dd-trace auto-instrumentation) + Sentry voor exceptions
- Containers: Docker Compose voor lokale dev (postgres, redis); zie docker-compose.yml

## Directory conventies

- `specs/` — één subdirectory per feature, aangemaakt voordat codering begint; spec.md first
- `decisions/` — ADRs opeenvolgend genummerd; nooit verwijderen, mark superseded ones [SUPERSEDED]
- `debugging/` — session notes voor elke bug die meer dan 30 minuten duurt op te lossen
- `learning/` — notities op nieuwe patterns, library upgrades, experiment results
- `reviews/` — checklists en standards; update wanneer terugkerende PR feedback patterns ontstaan
- `docs/runbooks/` — operationele docs voor deploy, rollback, en migration procedures

## Veelgebruikte taken — gebruik deze exacte commandos

### Start implementatie vanuit een ticket of spec
/spec-to-code — plak het Linear/Jira ticket of verwijs naar specs/<feature>/spec.md

### Controleer je eigen diff voordat je een PR opent
/code-review

### Debug een error of onverwacht gedrag
/debug — plak de stack trace, error message, of beschrijf het onverwachte gedrag

### Schrijf tests voor gewijzigde code
/test-write — runs tegen de huidige git diff

### Schrijf een PR beschrijving
/pr-description — leest git log en diff, outputs titel + summary + test plan

### Refactor zonder gedrag te veranderen
/refactor — wijs naar een bestand of function; produces veilige, incrementele cleanup

### Schets een architectuur of schrijf een ADR
/arch-sketch — beschrijf het probleem; outputs design options en ADR-concept

## Feature development workflow

1. Trek het ticket uit Linear/Jira; lees de acceptatiecriteria zorgvuldig
2. Creëer specs/<feature-name>/spec.md voordat je code schrijft
3. Run /spec-to-code om een implementatieplan te genereren
4. Creëer een feature branch: git checkout -b feat/<linear-ticket-id>-short-description
5. Implementeer incrementeel; run tests na elk betekenisvol stuk
6. Run /code-review op je eigen diff voordat je pushed
7. Run /pr-description om de PR beschrijving te genereren
8. Open PR; request review; address feedback dezelfde dag indien mogelijk
9. Na merge: check staging deploy, verify in Datadog, close ticket

## Code conventies

- Alle functions moeten expliciet return types hebben (geen implicit any)
- Error handling: swallow errors nooit stilzwijgend; altijd loggen met context (request ID, user ID)
- Database queries: altijd LIMIT opnemen op list endpoints; explain analyze voor nieuwe queries
- API responses: consistent shape — { data, error, meta } — nooit raw objects
- Feature flags: nieuwe user-facing features achter een flag totdat QA sign-off
- Migrations: altijd backward-compatible; nooit columns droppen in dezelfde PR die usage verwijdert

## Testing conventies

- Unit tests: colocated in __tests__/ naast het source bestand
- Integration tests: in tests/integration/; gebruik echte DB via testcontainers of test DB URL
- Coverage gate: 80% line coverage vereist; CI faalt onder threshold
- Test names: beschrijf het gedrag, niet de implementatie ("returns 404 when user not found")
- Nooit de database mocken in integration tests — test tegen echte queries

## Observability conventies

- Elke API handler: log at entry en exit met request ID en duration
- Elke background job: log start, completion, en item count processed
- Errors sent naar Sentry: include user ID, request ID, en relevant input context
- Nieuwe features: voeg een Datadog custom metric of dashboard panel toe voordat je shipped

## Wat niet te doen

- Commit nooit secrets of .env files — gebruik .env.example met placeholder waarden
- Open geen PR zonder een spec entry als de verandering groter is dan een one-liner fix
- Merge niet zonder minstens één approval en groene CI
- Skip nooit tests schrijven omdat "it's a small change" — kleine veranderingen veroorzaken regressions
- Voeg geen nieuwe dependency toe zonder bundle size impact en license te controleren
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

## Aanbevolen hooks

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

## Skills om te installeren

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

## Gerelateerd

- [Software Engineer Guide](../guides/for-software-engineer.md)
- [Feature Development Workflow](../workflows/feature-development.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
