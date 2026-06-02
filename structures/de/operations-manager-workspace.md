# Operations Manager Workspace — Projektstruktur

> Für einen Operations Manager, der Geschäftsprozesse, Vendor-Management, Team-Operationen und funktionsübergreifende Koordination durchführt – mit Notion, Linear, Slack, Google Workspace, Zapier, Airtable und Monday.com als Operating Stack.

## Stack

- **Notion** oder **Confluence** — SOP-Bibliothek, Prozessdokumentation, internes Wiki, Runbooks
- **Linear** oder **Asana** — Projekt-Tracking, funktionsübergreifende Initiativen, Sprint-ähnliches Task-Management
- **Slack** — Team-Kommunikation, Ops-Kanal, Incident-Threads, Vendor-Escalation-Kanäle
- **Google Workspace** — Drive, Sheets (Metrik-Tracking), Docs (Berichte), Calendar (Meeting-Facilitation)
- **Zapier** oder **Make** — Workflow-Automatisierung, Form-to-Tracker-Pipelines, Slack-Benachrichtigungsregeln
- **Airtable** — Vendor-Registry, Vertragsmanagement, OKR-Dashboard, Approval-Workflows
- **Monday.com** — Team-übergreifende Projektsichtbarkeit, Kapazitätsplanung, Roadmap-Ansichten
- **Claude Code** — SOP-Entwürfe, Process-Mapping, Vendor-Reviews, OKR-Updates, wöchentliche Ops-Berichte, Meeting-Action-Extraktion

## Verzeichnisbaum

```
ops-workspace/
├── .claude/
│   ├── CLAUDE.md                                  # Workspace-Anweisungen (Template unten einfügen)
│   ├── settings.json                              # MCP-Server, Hooks, Berechtigungen
│   └── commands/
│       ├── sop-draft.md                           # /sop-draft — nimmt Prozessnamen, gibt vollständige SOP mit Rollen, Schritte, Ausnahmen aus
│       ├── process-map.md                         # /process-map — generiert Swimlane-Prozessmap in Markdown + Mermaid-Diagramm
│       ├── vendor-review.md                       # /vendor-review — strukturierte Vendor-Performance-Review gegen SLA-Kriterien
│       ├── okr-update.md                          # /okr-update — OKR-Progress-Narrative, Key-Result-Scoring, Confidence-Rating
│       ├── weekly-ops.md                          # /weekly-ops — wöchentlicher Ops-Bericht: Blockers, Wins, Metriken, Cross-Team-Flags
│       ├── incident-sop.md                        # /incident-sop — Incident-Response-SOP für einen benannten operativen Fehlertyp
│       └── meeting-actions.md                     # /meeting-actions — destilliert Raw-Meeting-Notizen zu Eigentümern, Aktionen, Deadlines
├── sops/
│   ├── _template/
│   │   └── sop-template.md                        # Kanonisches SOP-Format — Zweck, Scope, Rollen, Schritte, Ausnahmen, Eigentümer
│   ├── hr/
│   │   ├── onboarding-new-hire.md                 # End-to-End New-Hire-Onboarding-SOP mit IT-, HR- und Manager-Schritten
│   │   ├── offboarding-employee.md                # Mitarbeiter-Offboarding: Zugriff widerrufen, Asset-Rückgabe, Exit-Interview
│   │   └── performance-review-cycle.md            # Halbjährlicher Performance-Review-Prozess mit Timeline und Eigentümern
│   ├── finance/
│   │   ├── expense-approval.md                    # Ausgaben-Submission, Approval-Tiers, Reimbursement-SOP
│   │   ├── invoice-processing.md                  # Vendor-Invoice-Aufnahme, Approval-Routing, Payment-SOP
│   │   └── budget-request.md                      # Budget-Request-Prozess: Template, Review-Committee, Approval-Schwellwerte
│   ├── it/
│   │   ├── software-access-request.md             # Software-Zugriffs-Provision-SOP mit Approval-Workflow
│   │   ├── hardware-procurement.md                # Hardware-Kaufanfrage bis Lieferung SOP
│   │   └── security-incident-response.md          # IT-Sicherheits-Incident-Eskalation und Containment-SOP
│   ├── ops/
│   │   ├── weekly-ops-review.md                   # So führen Sie das wöchentliche Ops-Review-Meeting durch — Agenda, Cadence, Eigentümer
│   │   ├── vendor-onboarding.md                   # New-Vendor-Intake: Legal, Compliance, Airtable-Entry, Slack-Channel-Setup
│   │   ├── vendor-offboarding.md                  # Vendor-Kündigung: Vertrag schließen, Zugriff widerrufen, Final-Invoice
│   │   └── cross-functional-project-launch.md     # Ops-Checkliste zum Starten einer neuen funktionsübergreifenden Initiative
│   └── compliance/
│       ├── data-retention-policy.md               # Datenspeicher-Regeln nach Datinklassifizierung und Speicherort
│       └── audit-prep-checklist.md                # Pre-Audit-Dokumentation und Evidence-Collection-SOP
├── processes/
│   ├── _improvement-log.md                        # Laufendes Log von Process-Improvement-Initiativen — Datum, Prozess, Änderung, Ergebnis
│   ├── hire-to-retire.md                          # Vollständiger Employee-Lifecycle-Prozess-Map mit System-Touchpoints
│   ├── procure-to-pay.md                          # Procurement-to-Payment-Prozess-Map: Request → PO → Receipt → Payment
│   ├── incident-to-resolution.md                  # Operational-Incident-Prozess-Map: Detect → Escalate → Resolve → Postmortem
│   ├── request-to-fulfillment.md                  # Internal-Service-Request-Lifecycle — Intake, Triage, Fulfillment, Close
│   └── idea-to-initiative.md                      # New-Initiative-Prozess: Proposal → Prioritization → Kick-off → Tracking
├── vendors/
│   ├── vendor-registry.csv                        # Master-Vendor-Liste: Name, Kategorie, Eigentümer, Vertragsablaufdatum, Spend-Tier
│   ├── _review-schedule.md                        # Quarterly-Vendor-Review-Kalender mit zugewiesenen DRIs
│   ├── active/
│   │   ├── zapier/
│   │   │   ├── contract-summary.md                # Vertragsterm, Renewal-Datum, Pricing, Tier, Auto-Renew-Flag
│   │   │   ├── sla-terms.md                       # Uptime-SLA, Support-Response-Time, Escalation-Kontakte
│   │   │   └── review-2026-q2.md                  # Q2-Performance-Review: SLA-Adhärenz, Nutzung, Incidents, Renewal-Rec
│   │   ├── airtable/
│   │   │   ├── contract-summary.md
│   │   │   ├── sla-terms.md
│   │   │   └── review-2026-q2.md
│   │   ├── monday/
│   │   │   ├── contract-summary.md
│   │   │   ├── sla-terms.md
│   │   │   └── review-2026-q2.md
│   │   └── notion/
│   │       ├── contract-summary.md
│   │       ├── sla-terms.md
│   │       └── review-2026-q1.md
│   └── offboarded/
│       └── _archive-note.md                       # Offboarded Vendors — für Audit-Trail behalten, nicht löschen
├── okrs/
│   ├── _okr-format.md                             # OKR-Schreibstandards: Objective-Framing, KR-Struktur, Confidence-Scoring
│   ├── 2026/
│   │   ├── q1/
│   │   │   ├── company-okrs.md                    # Company-Level-OKRs für Q1 2026 — Objectives, Key Results, DRIs
│   │   │   ├── ops-team-okrs.md                   # Ops-Team-OKRs aligned to company-Zielen
│   │   │   └── retrospective.md                   # Q1-OKR-Retrospektive — Final-Scores, was funktioniert hat, was nicht
│   │   ├── q2/
│   │   │   ├── company-okrs.md
│   │   │   ├── ops-team-okrs.md
│   │   │   └── mid-quarter-check.md               # Mid-Quarter-OKR-Confidence-Review — Risiken und Adjustments
│   │   ├── q3/
│   │   │   ├── company-okrs.md                    # Entworfene Q3-OKRs für Planung
│   │   │   └── ops-team-okrs.md
│   │   └── q4/
│   │       └── planning-notes.md                  # Early-Q4-Planung-Notizen — Themen, Carryover-Risiken
├── projects/
│   ├── _project-brief-template.md                 # Standard-Projekt-Brief: Problem, Goal, Scope, Team, Milestones, Risiken
│   ├── active/
│   │   ├── vendor-consolidation-2026/
│   │   │   ├── project-brief.md                   # Scope: SaaS-Ausgaben reduzieren durch Konsolidierung von 3 überlappenden Tools
│   │   │   ├── status-update-2026-05-30.md        # Aktueller Status: Milestones, Blockers, benötigte Entscheidungen
│   │   │   └── stakeholder-map.md                 # Wer besitzt was, wer muss zustimmen, wer ist informiert
│   │   └── ops-handbook-launch/
│   │       ├── project-brief.md                   # Scope: Publish Company-Ops-Handbook in Notion
│   │       ├── content-tracker.md                 # Section-by-Section-Eigentümerschaft und Completion-Status
│   │       └── status-update-2026-06-01.md
│   └── completed/
│       └── _archive-note.md                       # Abgeschlossene Projekte — Briefs für Retrospektive-Referenz behalten
├── reports/
│   ├── weekly/
│   │   ├── ops-report-2026-05-26.md               # Wöchentlicher Ops-Bericht — Wins, Blockers, Metriken, Cross-Team-Flags
│   │   ├── ops-report-2026-06-02.md               # Aktueller Wochen-Ops-Bericht
│   │   └── _report-template.md                    # Template für wöchentlichen Ops-Bericht mit Standard-Sektionen
│   └── monthly/
│       ├── metrics-dashboard-2026-05.md            # Monatliche Metriken: SLA-Adhärenz, Process-Cycle-Zeiten, Vendor-Scores
│       ├── metrics-dashboard-2026-04.md
│       └── _dashboard-template.md                 # Template für monatliches Metriken-Dashboard
└── automation/
    ├── _automation-index.md                        # Index aller aktiven Automationen: Tool, Trigger, Action, Eigentümer, Last-Tested
    ├── zapier/
    │   ├── new-vendor-intake.md                    # Zap: Typeform → Airtable-Vendor-Registry → Slack-#ops-vendors-Notify
    │   ├── sop-update-notify.md                    # Zap: Notion-Seitenedit in /SOPs → Slack-#ops-team-Ankündigung
    │   ├── invoice-approval-routing.md             # Zap: Finance-Inbox-Email → Linear-Task → Approver-Slack-DM
    │   └── okr-checkin-reminder.md                 # Zap: Weekly-Slack-Reminder → OKR-Eigentümer zur Confidence-Score-Aktualisierung
    └── make/
        ├── weekly-report-aggregator.md             # Make-Szenario: Linear + Airtable-Daten ziehen → Draft-Weekly-Ops-Report-Doc
        └── vendor-sla-monitor.md                  # Make-Szenario: Vendor-Statuspages pingen → Log zu Airtable → Alert bei Breach
```

## Wichtige Dateien erklärt

| Pfad | Zweck |
|---|---|
| `.claude/commands/sop-draft.md` | Slash-Befehl, der einen Prozessnamen und Kontext akzeptiert und gibt eine vollständige SOP mit Zweck, Scope, RACI-Tabelle, Schritt-für-Schritt-Verfahren, Exception-Handling und Review-Cadence aus |
| `.claude/commands/vendor-review.md` | Slash-Befehl, der einen Vendor-Namen und Review-Zeitraum akzeptiert und gibt eine strukturierte Performance-Review gegen SLA-Terms mit Renewal-Empfehlung aus |
| `.claude/commands/okr-update.md` | Slash-Befehl, der aktuellen OKR-Status und Progress-Notizen akzeptiert und gibt ein formatiertes OKR-Status-Update mit Confidence-Scores und Risk-Flags pro Key-Result aus |
| `.claude/commands/weekly-ops.md` | Slash-Befehl zum Generieren des wöchentlichen Ops-Berichts — aggregiert Wins, Blockers, Cross-Team-Dependencies und offene Action-Items in ein teilbares Doc |
| `.claude/commands/meeting-actions.md` | Slash-Befehl, der Raw-Meeting-Notizen akzeptiert und gibt eine saubere Action-Item-Tabelle mit Eigentümern, Beschreibungen und Due-Dates aus |
| `sops/_template/sop-template.md` | Kanonische SOP-Struktur, der jedes Process-Dokument folgt — stellt Konsistenz über Abteilungen sicher und macht SOPs von Claude-Befehlen parsierbar |
| `vendors/vendor-registry.csv` | Single Source of Truth für alle aktiven Vendors — Name, Kategorie, Vertragsablaufdatum, Spend-Tier, DRI — treibt Quarterly-Review-Schedule an |
| `okrs/2026/q2/ops-team-okrs.md` | Current-Quarter-Ops-Team-OKRs — das Live-Dokument, das wöchentlich mit Confidence-Scores aktualisiert wird und beim Quarter-Fortschritt aktualisiert wird |
| `automation/_automation-index.md` | Master-Index jeder aktiven Zapier und Make-Automatisierung — verhindert Duplizierung, dokumentiert Eigentümer und kennzeichnet Automationen, die neu getestet werden müssen |
| `reports/weekly/_report-template.md` | Standard-Wöchentlicher-Ops-Report-Template — stellt sicher, dass jeder Bericht die gleichen Sektionen abdeckt, sodass Stakeholder wissen, wo sie finden, was sie brauchen |

## Quick Scaffold

```bash
# Create workspace root
mkdir -p ops-workspace

# Create .claude structure with command stubs
mkdir -p ops-workspace/.claude/commands

# Create SOP directories by department
mkdir -p ops-workspace/sops/_template
mkdir -p ops-workspace/sops/hr
mkdir -p ops-workspace/sops/finance
mkdir -p ops-workspace/sops/it
mkdir -p ops-workspace/sops/ops
mkdir -p ops-workspace/sops/compliance

# Create process documentation directory
mkdir -p ops-workspace/processes

# Create vendor directory structure
mkdir -p ops-workspace/vendors/active/zapier
mkdir -p ops-workspace/vendors/active/airtable
mkdir -p ops-workspace/vendors/active/monday
mkdir -p ops-workspace/vendors/active/notion
mkdir -p ops-workspace/vendors/offboarded

# Create OKR directory structure for 2026
mkdir -p ops-workspace/okrs/2026/q1
mkdir -p ops-workspace/okrs/2026/q2
mkdir -p ops-workspace/okrs/2026/q3
mkdir -p ops-workspace/okrs/2026/q4

# Create project tracking directories
mkdir -p ops-workspace/projects/active/vendor-consolidation-2026
mkdir -p ops-workspace/projects/active/ops-handbook-launch
mkdir -p ops-workspace/projects/completed

# Create report directories
mkdir -p ops-workspace/reports/weekly
mkdir -p ops-workspace/reports/monthly

# Create automation documentation directories
mkdir -p ops-workspace/automation/zapier
mkdir -p ops-workspace/automation/make

# Seed required placeholder and index files
touch ops-workspace/vendors/vendor-registry.csv
touch ops-workspace/automation/_automation-index.md
touch ops-workspace/processes/_improvement-log.md

# Install relevant skills
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/sop-writer
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/scrum-master
npx claudient add skill small-business/weekly-pulse
npx claudient add skill small-business/meeting-to-action

# Copy command stubs into .claude/commands/
npx claudient add skill productivity/sop-writer --output ops-workspace/.claude/commands/sop-draft.md
npx claudient add skill productivity/process-mapper --output ops-workspace/.claude/commands/process-map.md
npx claudient add skill productivity/vendor-evaluator --output ops-workspace/.claude/commands/vendor-review.md
npx claudient add skill small-business/weekly-pulse --output ops-workspace/.claude/commands/weekly-ops.md
npx claudient add skill small-business/meeting-to-action --output ops-workspace/.claude/commands/meeting-actions.md
```

## CLAUDE.md Template

```markdown
# Ops Manager Workspace — Claude Code Instructions

## What this is

This is the working directory for an operations manager. It contains all SOPs, process maps,
vendor records, OKRs, cross-functional project briefs, weekly reports, and automation docs.
Claude Code is used to draft SOPs, run vendor reviews, update OKR narratives, generate weekly
ops reports, and extract action items from meeting notes.

## Stack

- Notion — SOP library and internal wiki; SOPs here mirror Notion pages in sops/
- Linear — Cross-functional project and initiative tracking; statuses synced manually to projects/
- Slack — Ops channel (#ops-team), vendor channels (#ops-vendors), incident threads
- Google Workspace — Drive for shared docs, Sheets for metrics, Docs for formal reports
- Zapier — Automations documented in automation/zapier/ — do not modify without updating the index
- Make — Scenarios documented in automation/make/ — complex multi-step automations
- Airtable — Vendor registry (source of truth), OKR dashboard, approval workflows
- Monday.com — Cross-team project roadmap and capacity views

## Common tasks and exact commands

### Draft a new SOP
```
/sop-draft

Process name: [e.g., "Vendor Offboarding"]
Department: [HR / Finance / IT / Ops / Compliance]
Trigger: [what kicks off this process]
Key roles involved: [list of roles — not names]
Known steps: [bullet list of what you know — rough is fine]
Pain points with current process: [optional]
```

### Generate a process map
```
/process-map

Process: [name]
Start event: [what triggers the process]
End event: [what does done look like]
Systems involved: [Notion, Airtable, Linear, etc.]
Key decision points: [where does the process branch?]
Roles / swimlanes: [who owns each lane]
```

### Run a vendor review
```
/vendor-review

Vendor: [name]
Review period: [Q2 2026]
Contract terms: [paste from vendors/active/<vendor>/contract-summary.md]
SLA commitments: [paste from vendors/active/<vendor>/sla-terms.md]
Incidents this period: [list]
Usage or adoption notes: [current team usage vs. licensed capacity]
Renewal date: [date]
```

### Update OKR status
```
/okr-update

Quarter: Q[X] [YEAR]
OKRs: [paste current okrs/2026/q<X>/ops-team-okrs.md]
Progress since last update: [bullet list of what happened]
Risks: [what could prevent hitting key results]
Confidence change: [any KRs going up or down in confidence?]
```

### Generate the weekly ops report
```
/weekly-ops

Week ending: [YYYY-MM-DD]
Wins this week: [bullet list]
Blockers open: [bullet list with owners]
Cross-team flags: [anything other teams need to know or act on]
Metrics: [SLA adherence, open incidents, vendor issues, OKR confidence changes]
Next week priorities: [top 3]
```

### Extract actions from meeting notes
```
/meeting-actions

Meeting: [name and date]
Attendees: [list]
Notes: [paste raw notes verbatim]
```

### Write an incident SOP
```
/incident-sop

Incident type: [e.g., "Vendor SLA breach — Zapier automation failure"]
Detection method: [how is this typically caught]
Immediate response: [first 15 minutes]
Escalation path: [who gets notified, in what order]
Resolution steps: [what fixes it]
Postmortem: [what documentation is required after]
```

## Conventions to follow

- Every SOP in sops/ must use the structure in sops/_template/sop-template.md — no exceptions
- SOP filenames are kebab-case and describe the process, not the department (e.g., expense-approval.md not finance-sops.md)
- Vendor registry (vendors/vendor-registry.csv) is updated within 24h of any vendor change — add, offboard, or contract renewal
- All active automations are listed in automation/_automation-index.md — if you create or modify a Zap or Make scenario, update the index
- OKR documents use confidence scores from 0–100 on each key result — update weekly during active quarters
- Weekly ops reports are saved as reports/weekly/ops-report-YYYY-MM-DD.md using the Monday date of that week
- Process improvement changes are logged in processes/_improvement-log.md — date, process affected, change made, outcome
- Project status updates are added as new files (status-update-YYYY-MM-DD.md) — never overwrite the previous update
- Meeting action items extracted via /meeting-actions are saved in the relevant project folder or as a scratch note before filing
```

## MCP servers

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "OPENAPI_MCP_HEADERS": "{\"Authorization\": \"Bearer ntn_your_notion_integration_token\", \"Notion-Version\": \"2022-06-28\"}"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@slack/mcp-server"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-slack-bot-token",
        "SLACK_TEAM_ID": "T0XXXXXXXXX"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/your-username/ops-workspace"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"/sops/\"; then echo \"[hook] SOP written — verify it follows sops/_template/sop-template.md structure and update the relevant Notion page to match\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"/vendors/active/\" && echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"contract-summary.md\"; then echo \"[hook] Contract summary updated — check vendors/vendor-registry.csv has a matching entry with the correct renewal date\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'TODAY=$(date +%A); if [ \"$TODAY\" = \"Monday\" ]; then echo \"[reminder] Monday — start this week ops report at reports/weekly/ops-report-$(date +%Y-%m-%d).md using /weekly-ops\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
# Core operations skills
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/sop-writer
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/scrum-master

# Reporting and meeting skills
npx claudient add skill small-business/weekly-pulse
npx claudient add skill small-business/meeting-to-action

# Supporting productivity skills
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/engineering-strategy
```

## Related

- [Operations Manager guide](../guides/for-operations-manager.md)
- [Weekly ops workflow](../workflows/weekly-ops-review.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
