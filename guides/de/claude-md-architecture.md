> 🇩🇪 Deutsche Version. [Englische Version](../claude-md-architecture.md).

# CLAUDE.md-Architektur-Leitfaden

Wie man `CLAUDE.md` für Projekte jeder Größe strukturiert — von Solo-Repositories bis hin zu großen Monorepos mit mehreren Teams.

---

## Wofür CLAUDE.md ist

`CLAUDE.md` ist das Projektgedächtnis von Claude Code. Es wird automatisch in jede Sitzung geladen und teilt Claude mit:
- Was diese Codebasis ist und wie sie strukturiert ist
- Wie man sie ausführt, testet und deployt
- Regeln und Konventionen, die immer gelten müssen
- Was NICHT zu tun ist

Ein gutes `CLAUDE.md` eliminiert wiederholte Anweisungen. Ein schlechtes wird ignoriert, ist zu lang oder widerspricht dem, was Claude bereits weiß.

---

## Die drei Ebenen

Claude Code liest drei CLAUDE.md-Dateien, die in der Reihenfolge zusammengeführt werden (spätere überschreiben frühere):

```
~/.claude/CLAUDE.md           # User-level: your personal preferences across all projects
{project-root}/CLAUDE.md      # Project-level: checked into the repo, applies to everyone
{project-root}/.claude/       # Local-level (gitignored): your overrides for this project
```

**Benutzerebene** — Ihre persönlichen Regeln: bevorzugter Antwortstil, Tools, die Sie immer möchten, Formatierungseinstellungen. Nicht eingecheckt.

**Projektebene** — die gemeinsamen Regeln des Teams: wie das Projekt ausgeführt wird, Codierungskonventionen, gesperrte Bereiche. In git eingecheckt.

**Lokale Ebene** — Ihre persönlichen Überschreibungen für dieses spezifische Projekt: persönliche API-Schlüssel, In-Progress-Anweisungen, Dinge, die noch nicht bereit sind, mit dem Team geteilt zu werden.

---

## CLAUDE.md-Vorlage

Dies ist die Struktur, die für die meisten Projekte funktioniert. Kopieren und füllen Sie Ihre Details aus.

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

## Größenleitfaden

| Projektgröße | CLAUDE.md-Größe | Was einzuschließen ist |
|---|---|---|
| Solo, einfach | 20–50 Zeilen | Schlüsselbefehle, Hauptkonventionen, "nicht anfassen"-Liste |
| Team, einzelner Service | 50–150 Zeilen | Vollständige Vorlage oben |
| Multi-Service | 150–300 Zeilen | Architekturübersicht + Zeiger pro Service |
| Monorepo | 100–200 Zeilen im Root + CLAUDE.md pro Paket | Root = globale Regeln, Pakete = lokale Regeln |

**Feste Grenze:** CLAUDE.md unter 500 Zeilen halten. Darüber hinaus wird es zu Rauschen. Regeln, die nicht befolgt werden, helfen nicht.

---

## Monorepo-Struktur

Für Monorepos mehrere CLAUDE.md-Dateien verwenden — eine im Root und eine in jedem Paket mit eigenen Konventionen.

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

**Root-CLAUDE.md** deckt ab:
- Was das Monorepo enthält und wie Pakete zusammenhängen
- Workspace-Befehle (`npm run build --workspace=api`)
- Gemeinsame Konventionen (Commit-Format, Branch-Benennung, PR-Prozess)
- Paketübergreifende Abhängigkeiten und was erlaubt ist

**Paket-CLAUDE.md** deckt ab:
- Nur was sich vom Root unterscheidet
- Paketspezifische Muster und Anti-Muster
- Lokale Befehle und Teststrategie

---

## Regeln, die funktionieren

### Regeln als Einschränkungen formulieren, nicht als Anfragen
```markdown
# Bad (ignored)
Please try to use the service layer for database access.

# Good (followed)
Never call the database from a controller or route handler.
All DB access must go through a service in src/services/.
```

### Spezifisch sein, nicht generisch
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

### Das *Warum* für nicht offensichtliche Regeln erklären
```markdown
# Bad (mysterious)
Don't use the UserService from the AuthModule.

# Good (explains the constraint)
Don't import from AuthModule in other modules — it creates circular dependencies.
Use the shared UserRepository from @/shared/db instead.
```

### Die "nicht anfassen"-Liste ist tragendes Element
```markdown
## Do not modify
- `src/generated/` — auto-generated from the OpenAPI spec, run `npm run generate` to update
- `migrations/` — create new migrations with `npm run migration:create`, never edit existing ones
- `public/service-worker.js` — generated by the build, do not edit directly
```

---

## Anti-Muster

**Zu lang.** Wenn Ihr CLAUDE.md 500+ Zeilen hat, behandelt Claude die untere Hälfte als Kontext mit niedriger Priorität. Unnachsichtig kürzen — jede Zeile muss tragend sein.

**Duplikation von dem, was der Linter durchsetzt.** Keine Regeln dokumentieren, die ESLint oder Prettier bereits durchsetzen. Wenn das Tool es erkennt, muss Claude es nicht wissen.

**Generische Ratschläge.** "Schreiben Sie Tests für alle neuen Features" — Claude weiß das bereits. Regeln schreiben, die spezifisch für die Konventionen *Ihres* Projekts sind.

**Veraltete Anweisungen.** Ein veraltetes CLAUDE.md, das beschreibt, wie das Projekt *früher* funktioniert hat, ist schlimmer als kein CLAUDE.md. Bei größeren Refactorings überprüfen.

**Widersprüchliche Regeln.** "Immer TypeScript verwenden" im Root-CLAUDE.md und "Python bevorzugt" im Service-CLAUDE.md wird Claude verwirren. Die Hierarchie klar machen.

---

## CLAUDE.md aktualisieren

**Nach einem Refactoring:** den Abschnitt Verzeichnisstruktur und alle geänderten Anti-Muster aktualisieren.

**Nach der Einarbeitung eines neuen Teammitglieds:** fragen, was sie verwirrt hat. Ihre Verwirrungspunkte zeigen auf fehlendes CLAUDE.md-Inhalt.

**Nach einem wiederholten Fehler:** wenn Sie Claude zweimal für dasselbe korrigieren, eine Regel hinzufügen. Wenn eine Regel hinzugefügt wird und erneut verletzt wird, sie stärker machen — nach oben verschieben, als Einschränkung statt als Präferenz formulieren.

**Vierteljährliche Überprüfung:** die gesamte Datei lesen, alles Veraltete entfernen, alles aus aktuellen Sitzungen hinzufügen, das Sie immer wiederholen.

---

> **Arbeiten Sie mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
