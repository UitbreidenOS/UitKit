# Software Engineer Workspace — Projektstruktur

> Für einen Software-Ingenieur, der täglich an der Feature-Entwicklung, Code-Review, Debugging, Architekturentscheidungen und Dokumentation arbeitet — optimiert für den gesamten Zyklus von Ticket bis zum gemerktem PR.

## Stack

- **Versionskontrolle:** GitHub (Code-Hosting, PRs, Actions CI)
- **Issue-Tracking:** Linear oder Jira (Ticket-Verwaltung, Sprint-Planung)
- **IDE:** VS Code oder Cursor mit Claude Code-Erweiterung
- **Containerisierung:** Docker 25+ mit Docker Compose für lokale Entwicklungsumgebungen
- **Observability:** Datadog (APM, Logs, Traces) oder Sentry (Error-Tracking, Session Replay)
- **Dokumentation:** Notion oder Confluence (Team Wiki, Runbooks, Onboarding)
- **Kommunikation:** Slack (asynchrone Komms, GitHub/Linear-Integrationen)
- **Runtime:** Node.js 20+ / Python 3.12+ / Go 1.22+ je nach Service
- **Testing:** Jest / pytest / Go test mit Coverage-Reporting
- **Linting/Formatting:** ESLint + Prettier / Ruff / gofmt in Pre-Commit erzwungen

## Verzeichnisbaum

```
software-engineer-workspace/
├── .claude/
│   ├── CLAUDE.md                           # Workspace-Anweisungen für Claude Code
│   ├── settings.json                       # MCP-Server, Hooks, Berechtigungen
│   └── commands/
│       ├── spec-to-code.md                 # /spec-to-code — übernimmt eine Spezifikation/Ticket, erstellt Implementierungsplan
│       ├── code-review.md                  # /code-review — überprüft den aktuellen Diff auf Fehler und Aufräumarbeiten
│       ├── debug.md                        # /debug — übernimmt Fehlermeldung oder unerwartetes Verhalten, verfolgt Root Cause
│       ├── test-write.md                   # /test-write — generiert Unit- und Integrationstests für geänderten Code
│       ├── pr-description.md               # /pr-description — entwirft PR-Titel, Zusammenfassung, Testplan aus Git-Diff
│       ├── refactor.md                     # /refactor — identifiziert und wendet sichere Refactors ohne Verhaltensänderung an
│       └── arch-sketch.md                  # /arch-sketch — erstellt ADR-Entwurf oder System-Design-Übersicht
├── specs/
│   ├── _template.md                        # Kanonisches Spezifikationsformat: Ziel, Nicht-Ziele, API-Form, Edge Cases
│   ├── 2025-06-user-notifications/
│   │   ├── spec.md                         # Feature-Spezifikation vor Codierungsbeginn
│   │   ├── api-contract.md                 # OpenAPI- oder GraphQL-Schema-Entwurf
│   │   └── edge-cases.md                  # Identifizierte Edge Cases und Fehlermodi
│   ├── 2025-05-search-refactor/
│   │   ├── spec.md
│   │   └── migration-plan.md               # Schritt-für-Schritt-Migration mit Rollback-Strategie
│   └── 2025-04-rate-limiting/
│       └── spec.md
├── decisions/
│   ├── _template.md                        # ADR-Format: Kontext, Entscheidung, Konsequenzen, Alternativen
│   ├── 001-database-choice.md              # ADR: Warum PostgreSQL statt MongoDB
│   ├── 002-api-versioning-strategy.md      # ADR: URL-Versionierung vs. Header-Versionierung
│   ├── 003-caching-layer.md                # ADR: Redis vs. In-Process-Cache
│   ├── 004-auth-mechanism.md               # ADR: JWT vs. opaque Tokens, Refresh-Strategie
│   └── 005-monorepo-vs-polyrepo.md         # ADR: Begründung der aktuellen Repository-Strategie
├── debugging/
│   ├── _template.md                        # Debug-Sitzungsformat: Symptom, Hypothese, Ergebnisse, Behebung
│   ├── 2025-06-01-memory-leak-api.md       # Komplexe Bug-Sitzung: Node.js Heap-Wachstum in /api/search
│   ├── 2025-05-14-slow-query-orders.md     # Sitzung: N+1-Abfrage über Datadog APM verfolgt
│   └── 2025-04-22-race-condition-jobs.md   # Sitzung: Job-Deduplizierungsrennen unter Last
├── learning/
│   ├── postgres-jsonb-indexing.md          # Notizen: GIN vs. GiST Index-Performance für JSONB-Abfragen
│   ├── react-query-v5-migration.md         # Notizen: Breaking Changes und neue Muster von v4→v5
│   ├── opentelemetry-setup.md              # Notizen: Manuelle Instrumentation mit OTEL SDK
│   ├── redis-lua-scripting.md              # Experiment-Ergebnisse: atomare Ops mit Lua vs. Transaktionen
│   └── zod-schema-composition.md          # Pattern-Notizen: diskriminierte Unions, branded Types
├── reviews/
│   ├── checklist-backend.md                # Review-Checkliste: Sicherheit, Fehlerbehandlung, Observability
│   ├── checklist-frontend.md               # Review-Checkliste: Zugänglichkeit, Bundle-Größe, Error States
│   ├── checklist-database.md               # Review-Checkliste: Migrationen, Indizes, Query Plans
│   ├── standards.md                        # Team-Coding-Standards und Namenskonventionen
│   └── common-feedback.md                  # Wiederkehrende PR-Feedback-Muster zum Beobachten
├── docs/
│   ├── onboarding.md                       # Setup für neue Ingenieure: Repo klonen, Env konfigurieren, erster PR
│   ├── local-dev-setup.md                  # Docker Compose-Services, Seed-Daten, Env-Variablen
│   ├── runbooks/
│   │   ├── deploy-process.md               # Wie wird deployt: Branch, CI, Merge, Monitor
│   │   ├── rollback.md                     # Wie wird ein fehlgeschlagenes Deploy sicher zurückgerollt
│   │   └── database-migrations.md          # Wie werden Migrationen geschrieben, getestet und angewendet
│   └── system-diagrams/
│       ├── service-map.md                  # Services, Abhängigkeiten, externe Integrationen
│       └── data-flow.md                    # Request-Lebenszyklus: Client → API → DB → Cache
├── .github/
│   └── workflows/
│       ├── ci.yml                          # PR-Checks: Lint, Type-Check, Test, Coverage Gate
│       ├── deploy-staging.yml              # Auto-Deploy zu Staging bei Merge zu Main
│       └── codeql.yml                      # GitHub CodeQL Security Scanning auf PRs
├── docker-compose.yml                      # Lokale Dev: postgres, redis, kafka, localstack
├── docker-compose.override.yml            # Lokale Overrides: Volume Mounts, Debug Ports
└── .env.example                            # Alle erforderlichen Env-Variablen mit Beschreibungen, keine echten Werte
```

## Erklärung wichtiger Dateien

| Pfad | Zweck |
|---|---|
| `.claude/commands/spec-to-code.md` | Liest die Spec-Datei für den aktuellen Feature-Branch, generiert einen Implementierungsplan mit Datei-Stubs, Funktionssignaturen und Test-Ankern, bevor Code geschrieben wird |
| `.claude/commands/debug.md` | Übernimmt einen eingefügten Fehler, Stack Trace oder Beschreibung unerwarteten Verhaltens; verfolgt Logs, Code-Pfade und aktuelle Diffs, um Root Cause zu isolieren und eine gezielten Fix vorzuschlagen |
| `.claude/commands/arch-sketch.md` | Erstellt einen ADR-Entwurf oder leichtes System-Design — hebt Trade-offs, Alternative Ansätze und offene Fragen für asynchrone Review hervor, bevor eine Strategie festgelegt wird |
| `specs/_template.md` | Kanonisches Spezifikationsformat: Problemstellung, Erfolgskriterien, API-Form, Edge Cases, Nicht-Ziele, offene Fragen — stellt sicher, dass Spezifikationen komplett sind, bevor Code geschrieben wird |
| `decisions/_template.md` | ADR-Format im Nygard-Stil: Kontext, getroffene Entscheidung, Status, Konsequenzen und abgelehnte Alternativen mit Begründung |
| `reviews/checklist-backend.md` | Backend-PR-Checkliste mit: Input-Validierung, Auth-Durchsetzung, Error-Response-Form, DB-Abfrage-Effizienz, Observability-Hooks und Migration-Sicherheit |
| `debugging/_template.md` | Sitzungsformat: Symptom, Umgebungsdetails, Reproduktionsschritte, versuchte Hypothesen, Root Cause, angewendeter Fix und Präventionsnotiz — persistente Wissensdatenbank für komplexe Bugs |
| `docs/runbooks/database-migrations.md` | Migrations-Workflow: nur rückwärts-kompatible Schemaänderungen, Blue-Green-Deploy-Bewusstsein, Rollback-SQL, Performance-Impact-Bewertung für große Tabellen |

## Schnelles Scaffold

```bash
# Erstelle die vollständige Software Engineer Workspace-Struktur
mkdir -p software-engineer-workspace
cd software-engineer-workspace

# Claude Code-Konfiguration
mkdir -p .claude/commands

# Spezifikations-Verzeichnisse (Pro-Feature-Unterverzeichnisse nach Bedarf hinzufügen)
mkdir -p specs

# Architektur-Entscheidungen
mkdir -p decisions

# Debugging-Sitzungen
mkdir -p debugging

# Lern-Notizen
mkdir -p learning

# Review-Materialien
mkdir -p reviews

# Dokumentation
mkdir -p docs/runbooks docs/system-diagrams

# GitHub Actions
mkdir -p .github/workflows

# Scaffold-Template-Dateien
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

# Docker Compose für lokale Dev-Services
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

# Installiere Skills
npx claudient add skill productivity/code-review
npx claudient add skill productivity/debug
npx claudient add skill productivity/refactor
npx claudient add skill productivity/test-generator
npx claudient add skill git/pr-description
npx claudient add skill productivity/security-audit
npx claudient add skill productivity/spec-driven-workflow
npx claudient add skill productivity/tech-debt-tracker

# Kopiere installierte Skills als Workspace-Commands
cp ~/.claude/skills/productivity/code-review.md .claude/commands/code-review.md
cp ~/.claude/skills/productivity/debug.md .claude/commands/debug.md
cp ~/.claude/skills/productivity/refactor.md .claude/commands/refactor.md
cp ~/.claude/skills/productivity/test-generator.md .claude/commands/test-write.md
cp ~/.claude/skills/git/pr-description.md .claude/commands/pr-description.md
cp ~/.claude/skills/productivity/spec-driven-workflow.md .claude/commands/spec-to-code.md

echo "Software Engineer Workspace aufgebaut."
```

## CLAUDE.md-Vorlage

```markdown
# Software Engineer Workspace

Dieser Workspace umfasst den gesamten Software-Entwicklungslebenszyklus — vom Lesen eines Tickets bis zum Review, Test und dokumentierten PR-Merge. Die Arbeit hier umfasst Feature-Implementierung, Code-Review, Debugging von Production-Problemen, Architekturentscheidungen und aktuelle Dokumentation.

## Stack

- Runtime: Node.js 20 (TypeScript 5.4) — angepasst an die Sprache deines Service
- Database: PostgreSQL 16 mit Drizzle ORM (Migrationen in drizzle/migrations/)
- Cache: Redis 7 (ioredis Client, Keyspace: app:{env}:{resource}:{id})
- API: Express 4 mit Zod-Validierung auf allen Request Bodies und Params
- Testing: Jest 29, Supertest für Integration, Test DB pro Suite
- CI: GitHub Actions — ci.yml läuft auf jedem PR; deploy-staging.yml bei Merge zu Main
- Observability: Datadog APM (dd-trace Auto-Instrumentation) + Sentry für Exceptions
- Container: Docker Compose für lokale Dev (postgres, redis); siehe docker-compose.yml

## Verzeichnis-Konventionen

- `specs/` — ein Unterverzeichnis pro Feature, vor dem Coding erstellt; spec.md zuerst
- `decisions/` — ADRs sequenziell nummeriert; nie löschen, supersedierte als [SUPERSEDED] markieren
- `debugging/` — Sitzungsnotizen für jeden Bug, der länger als 30 Minuten dauert
- `learning/` — Notizen zu neuen Patterns, Library-Updates, Experiment-Ergebnissen
- `reviews/` — Checklisten und Standards; aktualisieren, wenn neue PR-Feedback-Muster auftauchen
- `docs/runbooks/` — Operational Docs für Deploy, Rollback und Migration-Verfahren

## Häufige Aufgaben — nutze diese exakten Commands

### Starte die Implementierung von einem Ticket oder einer Spezifikation
/spec-to-code — füge das Linear/Jira-Ticket ein oder verweise auf specs/<feature>/spec.md

### Überprüfe deinen eigenen Diff vor dem Öffnen eines PRs
/code-review

### Debug einen Fehler oder unerwartetes Verhalten
/debug — füge den Stack Trace, die Fehlermeldung ein oder beschreibe das unerwartete Verhalten

### Schreibe Tests für geänderten Code
/test-write — läuft gegen den aktuellen Git-Diff

### Entwurf einer PR-Beschreibung
/pr-description — liest Git-Log und Diff, gibt Titel + Zusammenfassung + Testplan aus

### Refactor ohne Verhaltensänderung
/refactor — verweise auf eine Datei oder Funktion; erstellt sichere, inkrementelle Aufräumarbeiten

### Skizziere eine Architektur oder schreibe einen ADR
/arch-sketch — beschreibe das Problem; gibt Design-Optionen und ADR-Entwurf aus

## Feature-Entwicklungs-Workflow

1. Hole das Ticket von Linear/Jira; lies die Akzeptanzkriterien sorgfältig
2. Erstelle specs/<feature-name>/spec.md, bevor du Code schreibst
3. Führe /spec-to-code aus, um einen Implementierungsplan zu generieren
4. Erstelle einen Feature-Branch: git checkout -b feat/<linear-ticket-id>-short-description
5. Implementiere schrittweise; führe Tests nach jedem sinnvollen Chunk aus
6. Führe /code-review auf deinem eigenen Diff aus, bevor du pushst
7. Führe /pr-description aus, um die PR-Beschreibung zu generieren
8. Öffne PR; fordere Review an; adressiere Feedback am selben Tag wenn möglich
9. Nach Merge: überprüfe Staging-Deploy, verifiziere in Datadog, schließe Ticket

## Code-Konventionen

- Alle Funktionen müssen explizite Return-Types haben (kein implizites any)
- Fehlerbehandlung: fehler nie stillschweigend schlucken; immer mit Kontext loggen (Request ID, User ID)
- Database-Abfragen: immer LIMIT auf List-Endpoints; Explain Analyze für neue Abfragen
- API-Responses: konsistente Form — { data, error, meta } — nie Raw-Objekte
- Feature Flags: neue User-Facing-Features hinter ein Flag bis QA-Freigabe
- Migrations: immer rückwärts-kompatibel; nie Spalten in demselben PR löschen, der Verwendung entfernt

## Testing-Konventionen

- Unit Tests: colocated in __tests__/ neben der Source-Datei
- Integration Tests: in tests/integration/; nutze echte DB via Testcontainers oder Test-DB-URL
- Coverage Gate: 80% Line Coverage erforderlich; CI schlägt unter der Schwelle fehl
- Test-Namen: beschreiben das Verhalten, nicht die Implementierung ("returns 404 when user not found")
- Mocke die Datenbank nie in Integration Tests — teste gegen echte Abfragen

## Observability-Konventionen

- Jeder API Handler: logge beim Entry und Exit mit Request ID und Duration
- Jeder Background Job: logge Start, Completion und Item-Count verarbeitet
- Fehler an Sentry gesendet: füge User ID, Request ID und relevantem Input-Kontext hinzu
- Neue Features: füge Custom Metric oder Dashboard Panel hinzu, bevor du shipped

## Was nicht zu tun ist

- Committe keine Secrets oder .env-Dateien — nutze .env.example mit Platzhalter-Werten
- Öffne keinen PR ohne Spec-Eintrag, wenn die Änderung größer als eine Ein-Zeiler-Fix ist
- Mergen nicht ohne mindestens eine Genehmigung und grünes CI
- Überspringe nicht das Schreiben von Tests, weil "es eine kleine Änderung ist" — kleine Änderungen verursachen Regressions
- Füge keine neue Abhängigkeit ohne Überprüfung von Bundle-Größen-Impact und Lizenz hinzu
```

## MCP-Server

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

## Empfohlene Hooks

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

## Skills zum Installieren

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

## Verwandt

- [Software Engineer Guide](../guides/for-software-engineer.md)
- [Feature Development Workflow](../workflows/feature-development.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
