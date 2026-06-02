# UX-Designer-Arbeitsbereich — Projektstruktur

> Für UX-Designer, die End-to-End-Forschung, Interaktionsdesign, Prototyping und Developer-Handoff durchführen — optimiert für die gesamte Schleife von Nutzerinterviews bis zur ausgelieferten Spezifikation.

## Stack

- **Design + Prototyping + Handoff:** Figma (Desktop-App + Dev Mode)
- **Research-Repository:** Dovetail — Tagging, Synthesis, Insight-Tracking
- **Usability-Tests:** Maze (unmoderiert) oder UserTesting (moderiert)
- **Research-Docs + Projektnotizen:** Notion
- **Workshops + Journey Maps:** Miro
- **Design-System-Dokumentation:** Zeroheight
- **Kommunikation:** Slack
- **Versionskontrolle:** Git + GitHub (für diesen Arbeitsbereich, verknüpfte Specs und CLAUDE.md)

## Verzeichnisstruktur

```
my-ux-workspace/
├── .claude/
│   ├── commands/                          # slash commands available in this project
│   │   ├── ux-audit.md                    # /ux-audit <product-area> — heuristic + accessibility audit
│   │   ├── research-plan.md               # /research-plan — draft study plan, screener, discussion guide
│   │   ├── persona-update.md              # /persona-update — update persona from new research signals
│   │   ├── usability-test.md              # /usability-test — draft test script, tasks, success metrics
│   │   ├── design-critique.md             # /design-critique — structured critique against design principles
│   │   ├── accessibility-check.md         # /accessibility-check — WCAG 2.2 AA audit for a given flow
│   │   └── handoff-checklist.md           # /handoff-checklist — generate dev handoff checklist per feature
│   ├── settings.json                      # hooks, MCP server refs, permissions
│   └── mcp.json                           # MCP server configs (figma, notion, slack)
├── research/                              # all primary research, organised by round
│   ├── round-01-onboarding/               # naming: round-<NN>-<topic>
│   │   ├── screener.md                    # participant screener criteria and questions
│   │   ├── discussion-guide.md            # moderator guide with probes and tasks
│   │   ├── participants.md                # anonymised participant roster (P01–P08)
│   │   ├── sessions/
│   │   │   ├── P01-interview-notes.md     # raw notes per participant
│   │   │   ├── P02-interview-notes.md
│   │   │   ├── P03-interview-notes.md
│   │   │   └── P04-interview-notes.md
│   │   ├── survey-results.csv             # Maze or UserTesting export (if applicable)
│   │   └── synthesis/
│   │       ├── affinity-clusters.md       # tagged themes from Dovetail export
│   │       ├── key-findings.md            # top 5–8 findings with evidence quotes
│   │       └── opportunity-areas.md       # HMW statements derived from findings
│   ├── round-02-checkout-flow/
│   │   ├── screener.md
│   │   ├── discussion-guide.md
│   │   ├── participants.md
│   │   ├── sessions/
│   │   │   ├── P01-interview-notes.md
│   │   │   └── P02-interview-notes.md
│   │   └── synthesis/
│   │       ├── affinity-clusters.md
│   │       ├── key-findings.md
│   │       └── opportunity-areas.md
│   └── competitive/                       # competitor teardowns
│       ├── competitor-teardown-stripe.md  # structured teardown: flows, patterns, strengths, gaps
│       └── competitor-teardown-square.md
├── personas/                              # user personas and jobs-to-be-done
│   ├── persona-maya-growth-lead.md        # primary persona — updated as research accumulates
│   ├── persona-alex-ops-manager.md        # secondary persona
│   ├── persona-riley-end-user.md          # tertiary persona
│   ├── jobs-to-be-done.md                 # JTBD statements mapped to each persona
│   └── persona-changelog.md              # log of when and why each persona was revised
├── journey-maps/                          # experience maps — current and future state
│   ├── current-state/
│   │   ├── onboarding-journey-current.md  # current state map with pain points and moments of delight
│   │   ├── checkout-journey-current.md
│   │   └── settings-journey-current.md
│   └── future-state/
│       ├── onboarding-journey-future.md   # aspirational flow post-redesign
│       └── checkout-journey-future.md
├── wireframes/                            # Figma file links and annotation docs
│   ├── onboarding-flow/
│   │   ├── figma-link.md                  # canonical Figma URL + last-updated date
│   │   ├── annotations.md                 # screen-by-screen annotations for devs
│   │   └── design-decisions.md           # why key decisions were made (not just what)
│   ├── checkout-flow/
│   │   ├── figma-link.md
│   │   ├── annotations.md
│   │   └── design-decisions.md
│   ├── settings-redesign/
│   │   ├── figma-link.md
│   │   ├── annotations.md
│   │   └── design-decisions.md
│   └── explorations/                      # early-stage, unpolished concepts
│       ├── nav-restructure-v1.md
│       └── dashboard-widget-concepts.md
├── usability-tests/                       # moderated and unmoderated test artefacts
│   ├── 2026-05-onboarding-maze/
│   │   ├── test-plan.md                   # goals, methodology, participant criteria
│   │   ├── task-scripts.md                # exact task prompts given to participants
│   │   ├── session-notes/
│   │   │   ├── P01-session.md
│   │   │   └── P02-session.md
│   │   ├── maze-export.csv                # raw completion rates, click maps, time-on-task
│   │   └── findings-report.md            # findings ranked by severity, with design recommendations
│   ├── 2026-03-checkout-usertesting/
│   │   ├── test-plan.md
│   │   ├── task-scripts.md
│   │   ├── session-notes/
│   │   │   ├── P01-session.md
│   │   │   └── P02-session.md
│   │   └── findings-report.md
│   └── templates/
│       ├── test-plan-template.md          # reusable test plan scaffold
│       ├── task-script-template.md        # standard task prompt format
│       └── findings-report-template.md    # severity-ranked findings format
├── design-system/                         # component documentation and decision history
│   ├── components/
│   │   ├── button.md                      # usage rules, variants, do/don't examples, Figma link
│   │   ├── form-inputs.md
│   │   ├── modal.md
│   │   ├── navigation.md
│   │   ├── data-table.md
│   │   └── toast-notifications.md
│   ├── foundations/
│   │   ├── color.md                       # color tokens, contrast ratios, usage rules
│   │   ├── typography.md                  # type scale, usage guidance, accessibility notes
│   │   ├── spacing.md                     # spacing scale and when to deviate
│   │   ├── icons.md                       # icon library source, naming conventions
│   │   └── motion.md                      # animation principles, duration tokens, reduced motion
│   ├── patterns/
│   │   ├── empty-states.md               # when, what content, CTA guidance
│   │   ├── error-handling.md             # error types, message writing, recovery patterns
│   │   └── loading-states.md             # skeleton screens, spinners, progressive disclosure
│   ├── decision-log.md                    # ADR-style record of design system decisions
│   └── zeroheight-link.md                # canonical Zeroheight URL for published system docs
├── handoff/                               # per-feature dev handoff packages
│   ├── feature-onboarding-v2/
│   │   ├── figma-link.md                  # Dev Mode link to the specific Figma frame
│   │   ├── spec-annotations.md           # component specs, spacing, states, interactions
│   │   ├── edge-cases.md                 # empty states, errors, loading, permission edge cases
│   │   ├── acceptance-criteria.md        # testable criteria for QA and engineering sign-off
│   │   └── open-questions.md             # unresolved questions that need eng input
│   ├── feature-checkout-redesign/
│   │   ├── figma-link.md
│   │   ├── spec-annotations.md
│   │   ├── edge-cases.md
│   │   ├── acceptance-criteria.md
│   │   └── open-questions.md
│   └── templates/
│       ├── spec-annotations-template.md  # scaffold for new handoff packages
│       └── acceptance-criteria-template.md
├── .env.example                           # Figma token, Notion token — never commit .env
└── CLAUDE.md                              # project instructions for Claude Code
```

## Erläuterung der Schlüsseldateien

| Pfad | Zweck |
|---|---|
| `.claude/commands/ux-audit.md` | Slash-Befehl, der ein Produktbereich nimmt, eine heuristische Bewertung gegen Nielsens 10 und WCAG 2.2 AA durchführt und eine nach Schweregrad geordnete Fehlerlistenausgabe liefert |
| `.claude/commands/handoff-checklist.md` | Generiert eine pro-Feature-Checkliste, die Spec-Anmerkungen, Grenzfälle, Akzeptanzkriterien, Hinweise zu Barrierefreiheit und offene Fragen abdeckt |
| `research/round-<NN>-<topic>/synthesis/key-findings.md` | Primäres Lieferergebnis jeder Research-Runde — 5–8 Erkenntnisse mit Beleganführungen und Zuverlässigkeitsstufen |
| `personas/persona-changelog.md` | Nachvollziehbares Protokoll jeder Persona-Überarbeitung, welche Research-Runde sie ausgelöst hat und was sich geändert hat — verhindert Persona-Drift |
| `usability-tests/templates/findings-report-template.md` | Standard-Format für Erkenntnisberichte nach Schweregrad (Critical / Major / Minor / Observation) mit Spalte für Design-Empfehlungen |
| `design-system/decision-log.md` | ADR-ähnliches Protokoll, warum Design-System-Entscheidungen getroffen wurden — essentieller Kontext für zukünftige Komponenten-Änderungen |
| `handoff/feature-<name>/acceptance-criteria.md` | Testbare, eindeutige Kriterien für Engineering und QA — jedes Kriterium ordnet sich einer spezifischen Interaktion oder einem Status zu |
| `wireframes/<flow>/design-decisions.md` | Dokumentiert die Begründung hinter wichtigen Design-Entscheidungen — keine Beschreibung des Designs, sondern das Warum dahinter |

## Quick Scaffold

```bash
# Create the workspace directory and enter it
mkdir my-ux-workspace && cd my-ux-workspace
git init

# Create Claude Code config directories and command files
mkdir -p .claude/commands

# Touch all slash command files
touch .claude/commands/ux-audit.md
touch .claude/commands/research-plan.md
touch .claude/commands/persona-update.md
touch .claude/commands/usability-test.md
touch .claude/commands/design-critique.md
touch .claude/commands/accessibility-check.md
touch .claude/commands/handoff-checklist.md

# Research directory — first two rounds as scaffold
mkdir -p research/round-01-onboarding/sessions
mkdir -p research/round-01-onboarding/synthesis
mkdir -p research/round-02-checkout-flow/sessions
mkdir -p research/round-02-checkout-flow/synthesis
mkdir -p research/competitive
touch research/round-01-onboarding/{screener.md,discussion-guide.md,participants.md}
touch research/round-01-onboarding/synthesis/{affinity-clusters.md,key-findings.md,opportunity-areas.md}

# Personas
mkdir -p personas
touch personas/{persona-maya-growth-lead.md,persona-alex-ops-manager.md,jobs-to-be-done.md,persona-changelog.md}

# Journey maps
mkdir -p journey-maps/current-state journey-maps/future-state
touch journey-maps/current-state/onboarding-journey-current.md
touch journey-maps/future-state/onboarding-journey-future.md

# Wireframes
mkdir -p wireframes/{onboarding-flow,checkout-flow,settings-redesign,explorations}
for dir in wireframes/onboarding-flow wireframes/checkout-flow wireframes/settings-redesign; do
  touch "$dir"/{figma-link.md,annotations.md,design-decisions.md}
done

# Usability tests
mkdir -p usability-tests/2026-05-onboarding-maze/session-notes
mkdir -p usability-tests/templates
touch usability-tests/2026-05-onboarding-maze/{test-plan.md,task-scripts.md,findings-report.md}
touch usability-tests/templates/{test-plan-template.md,task-script-template.md,findings-report-template.md}

# Design system
mkdir -p design-system/{components,foundations,patterns}
touch design-system/components/{button.md,form-inputs.md,modal.md,navigation.md,data-table.md,toast-notifications.md}
touch design-system/foundations/{color.md,typography.md,spacing.md,icons.md,motion.md}
touch design-system/patterns/{empty-states.md,error-handling.md,loading-states.md}
touch design-system/{decision-log.md,zeroheight-link.md}

# Handoff
mkdir -p handoff/{feature-onboarding-v2,feature-checkout-redesign,templates}
for dir in handoff/feature-onboarding-v2 handoff/feature-checkout-redesign; do
  touch "$dir"/{figma-link.md,spec-annotations.md,edge-cases.md,acceptance-criteria.md,open-questions.md}
done
touch handoff/templates/{spec-annotations-template.md,acceptance-criteria-template.md}

# Env template
cat > .env.example <<'EOF'
FIGMA_ACCESS_TOKEN=your-figma-personal-access-token
FIGMA_TEAM_ID=your-figma-team-id
NOTION_API_KEY=secret_your-notion-integration-token
NOTION_RESEARCH_DB_ID=your-notion-database-id
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_TEAM_ID=T0XXXXXXXXX
EOF

# .gitignore
cat > .gitignore <<'EOF'
.env
.DS_Store
*.csv
!usability-tests/**/*.csv
EOF

# Install Claude Code skills
npx claudient add skill product/ux-audit
npx claudient add skill product/ux-researcher
npx claudient add skill product/usability-report
npx claudient add skill product/persona-builder
npx claudient add skill product/competitive-teardown

git add .
git commit -m "chore: initial ux designer workspace scaffold"
```

## CLAUDE.md-Vorlage

```markdown
# UX-Designer-Arbeitsbereich

Dies ist ein UX-Design-Arbeitsbereich, der die volle Schleife von Research bis zum Handoff abdeckt:
Nutzerinterviews, Persona-Verwaltung, Journey Mapping, Wireframe-Annotation,
Usability-Tests, Design-System-Dokumentation und Developer-Handoff.

Die kanonische Quelle der Wahrheit für jeden Artifact-Typ:
- Research-Synthese: `research/<round>/synthesis/key-findings.md`
- Personas: `personas/persona-<name>.md` (siehe Changelog für Revisionshistorie)
- Design-Entscheidungen: `wireframes/<flow>/design-decisions.md`
- Dev-Specs: `handoff/<feature>/spec-annotations.md`
- Design-System-Rationale: `design-system/decision-log.md`

---

## Stack

- Design + Prototyping: Figma (Dev Mode für Handoff)
- Research-Repository: Dovetail (Synthese, Tagging, Insight-Speicherung)
- Usability-Tests: Maze (unmoderiert), UserTesting (moderiert)
- Docs + Projektnotizen: Notion
- Workshops + Journey Maps: Miro
- Design-System-Docs: Zeroheight
- Kommunikation: Slack

---

## Häufige Aufgaben und genaue Befehle

| Aufgabe | Befehl |
|---|---|
| Einen Produktbereich für UX-Probleme prüfen | `/ux-audit <product-area>` |
| Einen Research-Studienplan entwerfen | `/research-plan` |
| Eine Persona anhand neuer Erkenntnisse aktualisieren | `/persona-update <persona-filename> — <summary of new findings>` |
| Ein Usability-Test-Skript schreiben | `/usability-test <flow-name>` |
| Eine Design-Kritik durchführen | `/design-critique <figma-link or flow-name>` |
| Einen Flow auf WCAG 2.2 AA-Konformität überprüfen | `/accessibility-check <flow-name>` |
| Eine Developer-Handoff-Checkliste generieren | `/handoff-checklist <feature-name>` |

---

## Research-Konventionen

- Round-Verzeichnisse: `research/round-<NN>-<topic>/` — nullgefüllt, kebab-case Thema
- Teilnehmer: immer anonymisiert als P01, P02, etc. — nie echte Namen in Dateien verwenden
- Session-Notizen: roh und unbearbeitet — Synthese passiert im `synthesis/` Unterverzeichnis
- Erkenntnisse sind nach Schweregrad geordnet: Critical / Major / Minor / Observation
- Jede Erkenntnis muss mindestens ein Teilnehmerzitat oder einen Datenpunkt als Beleg anführen
- Dovetail ist das Verwaltungssystem — Notizen hier sind die Arbeitskopie zum Lesen durch Claude

---

## Persona-Konventionen

- Persona-Dateien: `persona-<first-name>-<role-slug>.md` (z. B. `persona-maya-growth-lead.md`)
- Jede Aktualisierung muss in `persona-changelog.md` mit der auslösenden Research-Runde protokolliert werden
- Jobs-to-be-done-Aussagen leben in `jobs-to-be-done.md`, nicht in Persona-Dateien
- Neue Persona-Attribute nicht ohne Forschungsbeleg erfinden

---

## Wireframe- und Design-Entscheidungs-Konventionen

- `figma-link.md` muss enthalten: URL, Figma-Dateiname, Frame-Name, Zuletzt-aktualisiert-Datum
- `annotations.md`: Screen für Screen, mit Bezügen zu Komponentennamen aus dem Design-System
- `design-decisions.md`: geschrieben als "Wir wählten X über Y, weil Z" — keine Beschreibung der UI
- Design-Entscheidungen nie über Dateien duplizieren — zurück zu `design-decisions.md` verlinken

---

## Handoff-Konventionen

- Ein Verzeichnis pro Feature: `handoff/feature-<slug>/`
- `spec-annotations.md` muss abdecken: Spacing, States (default/hover/focus/disabled/error), Responsive-Verhalten
- `edge-cases.md` muss abdecken: Leer-Status, Fehler-Status, Lade-Status, Permission-beschränkter Status
- `acceptance-criteria.md`: jedes Kriterium beginnt mit "Given / When / Then" oder einer testbaren Aussage
- `open-questions.md`: jedes Item mit `[ENG]`, `[DESIGN]` oder `[PM]` taggen, um den Besitzer anzugeben

---

## Barrierefreiheitsstandards

- Mindeststandard: WCAG 2.2 Level AA für alle ausgelieferten Flows
- Farbkontrast: 4,5:1 für Normaltext, 3:1 für großen Text und UI-Komponenten
- Interaktive Elemente: müssen Fokus-Indikatoren haben, Tastatur-Bedienbarkeit und ARIA-Labels
- Motion: alle Animationen müssen `prefers-reduced-motion` beachten
- `/accessibility-check` vor jedem Handoff ausführen

---

## Design-System-Konventionen

- Komponenten-Docs leben in `design-system/components/<component>.md`
- Decision Log verwendet ADR-Format: Context / Decision / Consequences
- Niemals die Nutzungsregeln einer Komponente ohne einen Eintrag in `design-system/decision-log.md` ändern
- Zeroheight ist die veröffentlichte Quelle — `design-system/` ist der Arbeitsentwurf

---

## Nicht tun

- Teilnehmernamen nicht in einer Datei schreiben — P01, P02, etc. verwenden
- `.env` nicht committen — Figma und Notion Tokens sind sensitiv
- Keine Handoff-Pakete ohne `/accessibility-check` erstellen
- `personas/` nicht ohne Protokollierung der Änderung in `persona-changelog.md` ändern
- UI nicht in `design-decisions.md` beschreiben — das Reasoning erklären, nicht die Pixel
```

## MCP-Server

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@figma/mcp-server"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your-figma-personal-access-token",
        "FIGMA_TEAM_ID": "your-figma-team-id"
      }
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_API_KEY": "secret_your-notion-integration-token",
        "NOTION_RESEARCH_DB_ID": "your-notion-research-database-id"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token-here",
        "SLACK_TEAM_ID": "T0XXXXXXXXX"
      }
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
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_INPUT_FILE_PATH\" == */personas/*.md && \"$CLAUDE_TOOL_INPUT_FILE_PATH\" != */persona-changelog.md ]]; then echo \"[hook] Persona file updated — remember to log this change in persona-changelog.md\" >&2; fi'",
            "async": true
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_INPUT_FILE_PATH\" == */handoff/*/acceptance-criteria.md ]]; then echo \"[hook] Handoff criteria written — run /accessibility-check before marking this feature ready.\" >&2; fi'",
            "async": true
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_INPUT_FILE_PATH\" == */sessions/*-interview-notes.md ]]; then if grep -qiE \"\\b(full name|surname|[A-Z][a-z]+ [A-Z][a-z]+)\\b\" <<< \"$CLAUDE_TOOL_INPUT_NEW_STRING\" 2>/dev/null; then echo \"PII WARNING: possible real name detected in session notes. Use P01, P02, etc. instead.\" >&2; exit 1; fi; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills zu installieren

```bash
npx claudient add skill product/ux-audit
npx claudient add skill product/ux-researcher
npx claudient add skill product/usability-report
npx claudient add skill product/persona-builder
npx claudient add skill product/competitive-teardown
```

## Verwandt

- [Guide: Claude for UX Designers](../guides/for-ux-designer.md)
- [Workflow: Research to Handoff](../workflows/research-to-handoff.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
