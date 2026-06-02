# Product Manager Workspace — Projektstruktur

> Für einen Produktmanager, der Discovery, Roadmap, Delivery und Launches leitet — PRD-Schreiben, Stakeholder-Ausrichtung, Sprint-Planung, Benutzerforschungs-Synthese, Experiment-Design und Wettbewerbsanalyse aus einem einzigen Claude Code Workspace.

## Stack

- Linear — Roadmap-Verwaltung, Sprint-Tracking, Backlog-Grooming, Meilenstein-Berichte
- Figma — Design-Review, Prototyp-Links, Design-Spez-Referenzen (MCP: figma)
- Notion oder Confluence — PRDs, Produktspezifikationen, Team-Wikis, Entscheidungsprotokolle
- Amplitude oder Mixpanel — Produktanalysen, Funnel-Analyse, Feature-Adoption, North-Star-Tracking
- Dovetail — Benutzerforschungs-Repository, Interview-Notizen, Insight-Tagging, Usability-Reports
- Jira — Enterprise-Sprint-Boards, Ticket-Verwaltung, Release-Tracking (wenn die Organisation es benötigt)
- Slack — Stakeholder Async, Launch-Koordination, Cross-Functional-Kommunikation (MCP: slack)
- Loom — Asynchrone Demo-Aufzeichnungen, Feature-Walkthroughs, Sprint-Review-Videos

## Verzeichnisbaum

```
product-manager-workspace/
├── .claude/
│   ├── CLAUDE.md                                  # Workspace-Anweisungen für Claude Code
│   ├── settings.json                              # Berechtigungen, Hooks, MCP-Server-Konfiguration
│   └── commands/
│       ├── prd-draft.md                           # Entwurf PRD aus Feature-Idee — liest Templates, gibt vollständige Spezifikation aus
│       ├── user-story.md                          # Generiere User Stories aus PRD oder Feature-Brief
│       ├── experiment-design.md                   # Entwerfe A/B- oder multivariates Test — Hypothese, Metriken, Stichprobengröße
│       ├── launch-plan.md                         # Erstelle Launch-Checkliste und Kommunikationsplan aus PRD
│       ├── competitive-teardown.md                # Teardown eines konkurrierenden Produkts — UX, Preisgestaltung, Positionierungslücken
│       ├── sprint-review.md                       # Kompiliere Sprint-Review-Narrativ aus Linear-Tickets und Metriken
│       └── discovery-interview.md                 # Generiere Interview-Leitfaden aus Forschungsziel
├── roadmap/
│   ├── quarterly-roadmap-q3-2025.md              # Q3-Roadmap — Initiativen, Besitzer, Meilensteine, Status
│   ├── quarterly-roadmap-q4-2025.md              # Q4-Roadmap (Entwurf — nicht committed)
│   ├── annual-themes-2025.md                     # Jährliche Produktthemen — strategische Wetten und Begründung
│   ├── feature-backlog.md                        # Priorisiertes Feature-Backlog — alle im Scope stehenden Ideen mit Scores
│   ├── prioritization-framework.md               # RICE- oder ICE-Scoring-Regeln, Gewichtungen, Entscheidungskriterien
│   ├── now-next-later.md                         # Now / Next / Later Ansicht — aktueller Horizont-Snapshot
│   └── deprioritized-log.md                      # Deprioritierte Features — Grund, Datum, wer entschieden hat
├── prds/
│   ├── _prd-template.md                          # Kanonische PRD-Vorlage — Abschnitte, Besitzer, Genehmigungstabelle
│   ├── active/
│   │   ├── prd-onboarding-revamp.md              # PRD — Redesign des Onboarding-Flows (in Entwicklung)
│   │   ├── prd-bulk-export.md                    # PRD — Massen-Datenexport-Feature (in Spec-Review)
│   │   ├── prd-notification-center.md            # PRD — Notification Center v2 (in Design)
│   │   └── prd-api-rate-limiting.md              # PRD — API-Ratenbegrenzung und Quota-Verwaltung
│   ├── shipped/
│   │   ├── prd-search-v2.md                      # PRD — Search v2 (ausgeliefert 2025-04)
│   │   ├── prd-team-permissions.md               # PRD — Team-Level-Berechtigungen (ausgeliefert 2025-02)
│   │   └── prd-csv-import.md                     # PRD — CSV-Import (ausgeliefert 2025-01)
│   └── archived/
│       ├── prd-mobile-app-v1.md                  # PRD — Mobile App v1 (abgebrochen — Pivot zu Web-First)
│       └── prd-ai-assistant-spike.md             # PRD — AI-Assistent-Spike (in Onboarding-PRD zusammengeführt)
├── research/
│   ├── _interview-guide-template.md              # Kanonische Benutzer-Interview-Leitfaden-Vorlage
│   ├── interviews/
│   │   ├── 2025-05-onboarding-study/
│   │   │   ├── research-plan.md                  # Forschungsziel, Teilnehmerkriterien, Skript
│   │   │   ├── participant-screener.md           # Screener-Fragen für die Rekrutierung
│   │   │   ├── notes-p1-2025-05-12.md            # Interview-Notizen — Teilnehmer 1
│   │   │   ├── notes-p2-2025-05-13.md            # Interview-Notizen — Teilnehmer 2
│   │   │   ├── notes-p3-2025-05-14.md            # Interview-Notizen — Teilnehmer 3
│   │   │   ├── notes-p4-2025-05-15.md            # Interview-Notizen — Teilnehmer 4
│   │   │   ├── notes-p5-2025-05-16.md            # Interview-Notizen — Teilnehmer 5
│   │   │   └── synthesis-report.md               # Synthetisierte Insights, Themen, Zitate, Empfehlungen
│   │   └── 2025-03-churn-investigation/
│   │       ├── research-plan.md                  # Forschungsplan — Churn-Treiber-Studie
│   │       ├── notes-p1-2025-03-04.md            # Interview-Notizen
│   │       └── synthesis-report.md               # Synthese — Top 5 Churn-Themen, Severity-Matrix
│   ├── surveys/
│   │   ├── nps-q2-2025-results.md                # NPS-Umfrage-Ergebnisse — Score, Verbatims, Segment-Breakdown
│   │   ├── onboarding-csat-2025-05.md            # Onboarding-CSAT-Umfrage-Ergebnisse und Themen
│   │   └── feature-prioritization-survey.md      # Von Benutzern rangierte Feature-Prioritäts-Umfrage (n=240)
│   ├── usability/
│   │   ├── usability-bulk-export-2025-05.md      # Usability-Test — Massen-Export-Flow (5 Teilnehmer)
│   │   └── usability-onboarding-2025-04.md       # Usability-Test — neues Onboarding (7 Teilnehmer)
│   └── personas/
│       ├── persona-power-user.md                 # Power-User-Persona — Ziele, Frustrationen, Kontext, Zitate
│       ├── persona-occasional-user.md            # Gelegenheitsnutzer-Persona
│       └── persona-admin.md                      # Admin/Buyer-Persona — Bewertungskriterien, Einwände
├── experiments/
│   ├── _experiment-template.md                   # Kanonisches Experiment-Dokument — Hypothese, Metriken, Design, Ergebnisse
│   ├── active/
│   │   ├── exp-042-onboarding-checklist.md       # Aktiv: Onboarding-Checklisten- vs. leerer State-Test
│   │   └── exp-043-pricing-page-cta.md           # Aktiv: Pricing-Page-CTA-Text-Test
│   ├── completed/
│   │   ├── exp-039-search-ranking.md             # Abgeschlossen: Such-Ranking-Algorithmus-Test — +12% P1 Click
│   │   ├── exp-040-email-nudge-timing.md         # Abgeschlossen: Email-Nudge-Timing-Test — kein signifikantes Ergebnis
│   │   └── exp-041-trial-length.md               # Abgeschlossen: 14 vs 30-Tage-Trial — 30-Tage gewinnt (p=0.03)
│   └── hypothesis-backlog.md                     # Ungetestete Hypothesen — nach erwartetem Einfluss rangiert
├── launches/
│   ├── _launch-checklist-template.md             # Kanonische Launch-Checkliste — Engineering, Design, Kommunikation, Support
│   ├── active/
│   │   ├── launch-bulk-export/
│   │   │   ├── launch-plan.md                    # Vollständiger Launch-Plan — Zeitplan, Besitzer, Risiken, Rollout
│   │   │   ├── comms-plan.md                     # Kommunikationsplan — Release Notes, Blog, In-App, Email, Slack
│   │   │   ├── support-brief.md                  # Support-Brief — FAQs, Edge Cases, bekannte Einschränkungen
│   │   │   └── go-nogo-checklist.md              # Go/No-Go-Entscheidungs-Checkliste für Launch-Tag
│   │   └── launch-notification-center/
│   │       ├── launch-plan.md                    # Launch-Plan — Notification Center v2
│   │       └── comms-plan.md                     # Kommunikationsplan — Notification Center v2
│   └── shipped/
│       ├── launch-search-v2-2025-04.md           # Search v2 Launch-Retrospektive und Metriken 30 Tage danach
│       └── launch-team-permissions-2025-02.md    # Team-Berechtigungen Launch-Retrospektive
├── competitive/
│   ├── landscape-overview.md                     # Wettbewerbslandschaft — Positionierungsmatrix, Schlüsseldifferenziatoren
│   ├── competitor-profiles/
│   │   ├── competitor-acme-corp.md               # Wettbewerberprofil — Acme Corp (Hauptkonkurrent)
│   │   ├── competitor-rival-io.md                # Wettbewerberprofil — Rival.io (entstehende Bedrohung)
│   │   └── competitor-legacy-enterprise.md       # Wettbewerberprofil — Legacy Enterprise (etablierter Anbieter)
│   ├── teardowns/
│   │   ├── teardown-acme-onboarding-2025-05.md   # UX-Teardown — Acme Corp Onboarding-Flow
│   │   ├── teardown-rival-pricing-2025-04.md     # Preisgestaltungs-Teardown — Rival.io Preisseite und Tiers
│   │   └── teardown-legacy-api-2025-03.md        # API-Teardown — Legacy Enterprise Entwickler-Erlebnis
│   └── battlecards/
│       ├── battlecard-acme-corp.md               # Sales-Battlecard — Einwände, Differenziatoren, Fallstricke
│       └── battlecard-rival-io.md                # Sales-Battlecard — Rival.io
└── metrics/
    ├── north-star.md                             # North-Star-Metrik — Definition, aktueller Wert, Ziel, Besitzer
    ├── product-health-dashboard.md               # Wöchentliche Produktgesundheits-Snapshot — alle Kern-KPIs
    ├── feature-success-metrics/
    │   ├── metrics-onboarding-revamp.md          # Erfolgskriterien — Onboarding-Überarbeitung (Aktivierungsrate, TTV)
    │   ├── metrics-bulk-export.md                # Erfolgskriterien — Massen-Export (Adoption, Nutzungshäufigkeit)
    │   └── metrics-notification-center.md        # Erfolgskriterien — Notification Center (Open-Rate, CTR)
    ├── amplitude-queries/
    │   ├── query-activation-funnel.md            # Gespeicherte Amplitude-Query — Aktivierungs-Funnel-Schritte
    │   ├── query-feature-adoption.md             # Gespeicherte Amplitude-Query — Feature-Adoption nach Kohorte
    │   └── query-retention-by-segment.md         # Gespeicherte Amplitude-Query — D1/D7/D30-Retention nach Segment
    └── retrospectives/
        ├── metrics-review-q2-2025.md             # Q2-Metriken-Retrospektive — Siege, Misserfolge, Learnings
        └── metrics-review-q1-2025.md             # Q1-Metriken-Retrospektive
```

## Wichtige Dateien erklärt

| Pfad | Zweck |
|---|---|
| `.claude/commands/prd-draft.md` | Slash-Befehl, der eine Feature-Idee nimmt, `prds/_prd-template.md`, `roadmap/prioritization-framework.md` und relevante Persona-Dateien liest und dann eine vollständige PRD mit Problemdarstellung, Zielen, User Stories, Anforderungen, Erfolgskriterien und offenen Fragen ausgibt |
| `.claude/commands/experiment-design.md` | Slash-Befehl, der `experiments/_experiment-template.md` und die relevante PRD liest und dann ein vollständig gestaltetes Experiment mit Hypothese, Kontroll-/Varianten-Definition, primären und Guardrail-Metriken, minimalem erkennbarem Effekt und geschätzter Stichprobengröße ausgibt |
| `.claude/commands/launch-plan.md` | Slash-Befehl, der die aktive PRD und `launches/_launch-checklist-template.md` liest und dann einen Launch-Plan mit Zeitplan, cross-funktionalen Besitzern, Kommunikationsplan, Support-Brief und Go/No-Go-Kriterien generiert |
| `roadmap/prioritization-framework.md` | Scoring-Regeln und Gewichtungen für RICE oder ICE — wird von Claude verwendet, wenn Backlog-Elemente oder "sollten wir das bauen?"-Fragen bewertet werden; hält das Scoring über Quartale hinweg konsistent |
| `prds/active/` | Eine Datei pro In-Flight-Feature — PRDs hier sind Live-Dokumente, die aktualisiert werden, wenn sich Entscheidungen ändern; niemals löschen, verwende `archived/` für abgebrochene Features |
| `research/personas/persona-power-user.md` | Source-of-Truth-Persona, auf die in PRDs und Experiment-Hypothesen verwiesen wird — wird nach jeder großen Forschungsrunde aktualisiert |
| `experiments/hypothesis-backlog.md` | Ungetestete Hypothesen, nach erwarteter Auswirkung geordnet — Claude liest dies, wenn gefragt wird, das Experiment-Roadmap zu priorisieren |
| `metrics/north-star.md` | Einzelne autoritative Definition der North-Star-Metrik — Claude liest dies vor jeder Metrik-Analyse, um konsistente Framing sicherzustellen |
| `competitive/landscape-overview.md` | Aktuelle Positionierungsmatrix — Claude liest dies, wenn Wettbewerbs-Teardowns oder Battlecards entworfen werden, um sich nicht selbst zu widersprechen |
| `launches/active/` | Ein Unterverzeichnis pro In-Flight-Launch, die jeweils Launch-Plan, Kommunikationsplan, Support-Brief und Go/No-Go-Checkliste als separate Dateien enthalten |

## Schnelle Grundgerüst

```bash
# Erstelle Workspace-Root
mkdir -p product-manager-workspace
cd product-manager-workspace

# Erstelle .claude-Struktur
mkdir -p .claude/commands

# Erstelle alle Workspace-Verzeichnisse
mkdir -p roadmap
mkdir -p prds/active
mkdir -p prds/shipped
mkdir -p prds/archived
mkdir -p research/interviews
mkdir -p research/surveys
mkdir -p research/usability
mkdir -p research/personas
mkdir -p experiments/active
mkdir -p experiments/completed
mkdir -p launches/active
mkdir -p launches/shipped
mkdir -p competitive/competitor-profiles
mkdir -p competitive/teardowns
mkdir -p competitive/battlecards
mkdir -p metrics/feature-success-metrics
mkdir -p metrics/amplitude-queries
mkdir -p metrics/retrospectives

# Seed wichtige Template- und Ankerdateien
touch prds/_prd-template.md
touch research/_interview-guide-template.md
touch experiments/_experiment-template.md
touch launches/_launch-checklist-template.md
touch roadmap/prioritization-framework.md
touch roadmap/feature-backlog.md
touch roadmap/now-next-later.md
touch roadmap/deprioritized-log.md
touch metrics/north-star.md
touch metrics/product-health-dashboard.md
touch competitive/landscape-overview.md

# Seed .claude-Befehlsdateien
touch .claude/commands/prd-draft.md
touch .claude/commands/user-story.md
touch .claude/commands/experiment-design.md
touch .claude/commands/launch-plan.md
touch .claude/commands/competitive-teardown.md
touch .claude/commands/sprint-review.md
touch .claude/commands/discovery-interview.md

# Seed die CLAUDE.md
touch .claude/CLAUDE.md
touch .claude/settings.json

# Installiere Claude Code Skills
npx claudient add skill product/product-roadmap
npx claudient add skill product/user-story-writer
npx claudient add skill product/product-discovery
npx claudient add skill product/experiment-designer
npx claudient add skill product/competitive-teardown
npx claudient add skill product/persona-builder
npx claudient add skill product/product-analytics
npx claudient add skill product/product-strategist
```

## CLAUDE.md-Vorlage

```markdown
# Product Manager Workspace

Dieser Workspace unterstützt einen Produktmanager, der Discovery, Roadmap, Delivery und Launches leitet.
Claude Code liest Kontext aus strukturierten Dateien hier, um genaue, produktspezifische
Outputs zu produzieren — nicht generische PM-Ratschläge. Lesen Sie immer die referenzierten Quelldateien,
bevor Sie ein Dokument generieren.

---

## Was ist das

Ein Claude Code Workspace für einen PM. Jedes Verzeichnis entspricht einem Kern-PM-Workflow: Roadmap
Priorisierung, PRD-Schreiben, Benutzerforschungs-Synthese, Experiment-Design, Launch-Koordination,
Wettbewerbsanalyse und Metriken-Tracking. Claude liest aus diesen Dateien und schreibt Entwürfe,
Analysen und strukturierte Outputs zurück in die gleiche Struktur.

---

## Stack

- Linear — Roadmap- und Sprint-Tracking (MCP: linear)
- Figma — Design-Review und Spec-Referenzen (MCP: figma)
- Notion oder Confluence — PRDs und Team-Dokumente
- Amplitude oder Mixpanel — Produktanalysen, Funnels, Retention
- Dovetail — Benutzerforschungs-Repository und Insight-Tagging
- Jira — Enterprise-Sprint-Boards (wenn von der Organisation erforderlich)
- Slack — Stakeholder-Kommunikation und Launch-Koordination (MCP: slack)
- Loom — Asynchrone Demo-Aufzeichnungen und Sprint-Reviews

---

## Verzeichnis-Konventionen

- `roadmap/` — Roadmap-Dateien werden nach Quartal benannt: `quarterly-roadmap-Q3-2025.md`.
  `prioritization-framework.md` ist die Source of Truth für Scoring-Entscheidungen. Niemals deprioritierte Elemente entfernen —
  sie in `deprioritized-log.md` mit Grund und Datum protokollieren.
- `prds/` — Eine Datei pro Feature. Aktive PRDs leben in `active/`, ausgeliefert in `shipped/`,
  abgebrochen in `archived/`. Verwenden Sie `_prd-template.md` für jede neue PRD. Überspringen Sie keine Abschnitte.
- `research/` — Interview-Notizen gehen in `interviews/<study-name>/notes-p<n>-YYYY-MM-DD.md`.
  Jede Studie benötigt eine `research-plan.md` und eine `synthesis-report.md` vor dem Abschluss.
- `experiments/` — Aktive Experimente in `active/`, abgeschlossene in `completed/`. Jedes
  Experiment-Dokument muss Hypothese, Metriken, Stichprobe-Größe-Begründung und Ergebnisse enthalten.
  Nullergebnisse sind keine Misserfolge — archivieren Sie sie ordnungsgemäß in `completed/`.
- `launches/` — Jeder Launch erhält sein eigenes Unterverzeichnis unter `active/`. Ein Launch-Verzeichnis
  muss enthalten: `launch-plan.md`, `comms-plan.md`, `support-brief.md`, `go-nogo-checklist.md`.
  Verschieben Sie es nach `shipped/` mit einer Retrospektiv-Notiz nach dem Launch.
- `competitive/` — `landscape-overview.md` wird vierteljährlich aktualisiert. Teardowns sind Point-in-Time-
  Snapshots — benennen Sie sie `teardown-<competitor>-<area>-YYYY-MM.md`.
- `metrics/` — `north-star.md` definiert die einzelne North-Star-Metrik. Widersprechen Sie dieser
  Definition niemals in Experiment-Dokumenten oder PRD-Erfolgskriterien-Abschnitten.

---

## Allgemeine Aufgaben — genaue Befehle

### PRD und Spezifikationen
```
/prd-draft                — Entwurf PRD aus Feature-Idee mit kanonischer Vorlage
/user-story               — Generiere User Stories aus PRD oder Brief
```

### Forschung
```
/discovery-interview      — Generiere Interview-Leitfaden aus Forschungsziel und Persona
```

### Experimente
```
/experiment-design        — Entwerfe A/B- oder multivariates Test mit Hypothese und Stichprobengröße
```

### Launches
```
/launch-plan              — Erstelle Launch-Checkliste und Kommunikationsplan aus aktiver PRD
```

### Wettbewerb
```
/competitive-teardown     — Teardown eines konkurrierenden Produkts — UX, Preisgestaltung, Positionierungslücken
```

### Sprint-Rhythmus
```
/sprint-review            — Kompiliere Sprint-Review-Narrativ aus Linear-Tickets und Metriken
```

---

## Konventionen, denen Claude folgen muss

- Lesen Sie immer `roadmap/prioritization-framework.md`, bevor Sie Funktionen bewerten oder ordnen.
  Erfinden Sie keine Scoring-Methodologie.
- Lesen Sie immer `metrics/north-star.md`, bevor Sie Erfolgskriterien in einer PRD oder Experiment schreiben.
  Erfolgskriterien müssen zur North Star führen.
- PRDs müssen `prds/_prd-template.md` genau folgen — überspringen Sie nicht den Abschnitt "offene Fragen"
  oder die Genehmigungstabelle.
- Experiment-Hypothesen müssen dem Format folgen: "Wir glauben, dass [Änderung] [Ergebnis] für
  [Benutzer-Segment] führt, gemessen an [Metrik], weil [Begründung]."
- Research-Syntheseberichte müssen direkte Zitate von abgeleiteten Themen unterscheiden.
  Zitate verwenden Anführungszeichen und eine Teilnehmer-ID (z. B. P3). Themen verwenden keine Zitate.
- Wettbewerbs-Teardowns müssen `competitive/landscape-overview.md` zuerst lesen, um vorhandene Positionierung nicht zu widersprechen.
- Persona-Dateien in `research/personas/` sind die kanonischen Benutzerbeschreibungen. Verweisen Sie auf sie
  nach Name in PRDs und Experiment-Hypothesen — erfinden Sie nicht neue Personas inline.
- Schreiben Sie niemals eine Go-Live-Empfehlung, ohne `go-nogo-checklist.md` für diesen Launch zu lesen.
```

## MCP-Server

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "${LINEAR_API_KEY}"
      }
    },
    "figma": {
      "command": "npx",
      "args": ["-y", "@figma/mcp-server"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/you/product-manager-workspace"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"prds/active/\" && echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"prd-\"; then echo \"[PRD hook] PRD geschrieben — bestätigen Sie, dass die Genehmigungstabelle gefüllt ist und Erfolgskriterien metrics/north-star.md referenzieren.\"; fi'"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"experiments/completed/\"; then echo \"[Experiment hook] Experiment als abgeschlossen archiviert — bestätigen Sie, dass der Ergebnisabschnitt einen p-Wert oder ein Konfidenzintervall und eine Ship/Iterate/Kill-Empfehlung enthält.\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"[Session-Ende] Wenn Sie roadmap/feature-backlog.md oder metrics/north-star.md aktualisiert haben, bestätigen Sie, dass Änderungen mit der aktuellen Quartals-Roadmap übereinstimmen und Stakeholder benachrichtigt wurden.\"'"
          }
        ]
      }
    ]
  }
}
```

## Zu installierende Skills

```bash
npx claudient add skill product/product-roadmap
npx claudient add skill product/user-story-writer
npx claudient add skill product/product-discovery
npx claudient add skill product/experiment-designer
npx claudient add skill product/competitive-teardown
npx claudient add skill product/persona-builder
npx claudient add skill product/product-analytics
npx claudient add skill product/product-strategist
```

## Verwandt

- [Leitfaden: Claude für Product Manager](../guides/for-product-manager.md)
- [Workflow: PRD-Schreiben](../workflows/prd-writing.md)
- [Workflow: Launch-Koordination](../workflows/launch-coordination.md)
- [Workflow: Benutzerforschungs-Synthese](../workflows/user-research-synthesis.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
