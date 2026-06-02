# Operations Manager Workspace — Estructura del Proyecto

> Para un gerente de operaciones que ejecuta procesos empresariales, gestión de proveedores, operaciones de equipo y coordinación entre funciones — con Notion, Linear, Slack, Google Workspace, Zapier, Airtable y Monday.com como pila operativa.

## Stack

- **Notion** o **Confluence** — Biblioteca de procedimientos operativos, documentación de procesos, wiki interno, runbooks
- **Linear** o **Asana** — Seguimiento de proyectos, iniciativas entre funciones, gestión de tareas estilo sprint
- **Slack** — Comunicaciones del equipo, canal de operaciones, hilos de incidentes, canales de escalada de proveedores
- **Google Workspace** — Drive, Sheets (seguimiento de métricas), Docs (informes), Calendar (facilitación de reuniones)
- **Zapier** o **Make** — Automatización de flujos de trabajo, canalizaciones formulario-a-rastreador, reglas de notificación Slack
- **Airtable** — Registro de proveedores, seguimiento de contratos, panel de control OKR, flujos de trabajo de aprobación
- **Monday.com** — Visibilidad de proyectos entre equipos, planificación de capacidad, vistas de roadmap
- **Claude Code** — Borrador de procedimientos operativos, mapeo de procesos, revisiones de proveedores, actualizaciones de OKR, informes operativos semanales, destilación de acciones de reuniones

## Árbol de directorios

```
ops-workspace/
├── .claude/
│   ├── CLAUDE.md                                  # Workspace instructions (paste the template below)
│   ├── settings.json                              # MCP servers, hooks, permissions
│   └── commands/
│       ├── sop-draft.md                           # /sop-draft — takes process name, outputs full SOP with roles, steps, exceptions
│       ├── process-map.md                         # /process-map — generates swimlane process map in Markdown + Mermaid diagram
│       ├── vendor-review.md                       # /vendor-review — structured vendor performance review against SLA criteria
│       ├── okr-update.md                          # /okr-update — OKR progress narrative, key result scoring, confidence rating
│       ├── weekly-ops.md                          # /weekly-ops — weekly ops report: blockers, wins, metrics, cross-team flags
│       ├── incident-sop.md                        # /incident-sop — incident response SOP for a named operational failure type
│       └── meeting-actions.md                     # /meeting-actions — distills raw meeting notes into owners, actions, deadlines
├── sops/
│   ├── _template/
│   │   └── sop-template.md                        # Canonical SOP format — purpose, scope, roles, steps, exceptions, owner
│   ├── hr/
│   │   ├── onboarding-new-hire.md                 # End-to-end new hire onboarding SOP with IT, HR, and manager steps
│   │   ├── offboarding-employee.md                # Employee offboarding: access revocation, asset return, exit interview
│   │   └── performance-review-cycle.md            # Semi-annual performance review process with timeline and owners
│   ├── finance/
│   │   ├── expense-approval.md                    # Expense submission, approval tiers, reimbursement SOP
│   │   ├── invoice-processing.md                  # Vendor invoice intake, approval routing, payment SOP
│   │   └── budget-request.md                      # Budget request process: template, review committee, approval thresholds
│   ├── it/
│   │   ├── software-access-request.md             # Software access provisioning SOP with approval workflow
│   │   ├── hardware-procurement.md                # Hardware purchase request to delivery SOP
│   │   └── security-incident-response.md          # IT security incident escalation and containment SOP
│   ├── ops/
│   │   ├── weekly-ops-review.md                   # How to run the weekly ops review meeting — agenda, cadence, owners
│   │   ├── vendor-onboarding.md                   # New vendor intake: legal, compliance, Airtable entry, Slack channel setup
│   │   ├── vendor-offboarding.md                  # Vendor termination: contract close, access revoke, final invoice
│   │   └── cross-functional-project-launch.md     # Ops checklist for launching a new cross-functional initiative
│   └── compliance/
│       ├── data-retention-policy.md               # Data retention rules by data class and storage location
│       └── audit-prep-checklist.md                # Pre-audit documentation and evidence collection SOP
├── processes/
│   ├── _improvement-log.md                        # Running log of process improvement initiatives — date, process, change, outcome
│   ├── hire-to-retire.md                          # Full employee lifecycle process map with system touchpoints
│   ├── procure-to-pay.md                          # Procurement to payment process map: request → PO → receipt → payment
│   ├── incident-to-resolution.md                  # Operational incident process map: detect → escalate → resolve → postmortem
│   ├── request-to-fulfillment.md                  # Internal service request lifecycle — intake, triage, fulfillment, close
│   └── idea-to-initiative.md                      # New initiative process: proposal → prioritization → kick-off → tracking
├── vendors/
│   ├── vendor-registry.csv                        # Master vendor list: name, category, owner, contract end date, spend tier
│   ├── _review-schedule.md                        # Quarterly vendor review calendar with assigned DRIs
│   ├── active/
│   │   ├── zapier/
│   │   │   ├── contract-summary.md                # Contract term, renewal date, pricing, tier, auto-renew flag
│   │   │   ├── sla-terms.md                       # Uptime SLA, support response time, escalation contacts
│   │   │   └── review-2026-q2.md                  # Q2 performance review: SLA adherence, usage, incidents, renewal rec
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
│       └── _archive-note.md                       # Offboarded vendors — retain for audit trail, do not delete
├── okrs/
│   ├── _okr-format.md                             # OKR writing standards: objective framing, KR structure, confidence scoring
│   ├── 2026/
│   │   ├── q1/
│   │   │   ├── company-okrs.md                    # Company-level OKRs for Q1 2026 — objectives, key results, DRIs
│   │   │   ├── ops-team-okrs.md                   # Ops team OKRs aligned to company objectives
│   │   │   └── retrospective.md                   # Q1 OKR retrospective — final scores, what worked, what didn't
│   │   ├── q2/
│   │   │   ├── company-okrs.md
│   │   │   ├── ops-team-okrs.md
│   │   │   └── mid-quarter-check.md               # Mid-quarter OKR confidence review — risks and adjustments
│   │   ├── q3/
│   │   │   ├── company-okrs.md                    # Drafted Q3 OKRs for planning
│   │   │   └── ops-team-okrs.md
│   │   └── q4/
│   │       └── planning-notes.md                  # Early Q4 planning notes — themes, carryover risks
├── projects/
│   ├── _project-brief-template.md                 # Standard project brief: problem, goal, scope, team, milestones, risks
│   ├── active/
│   │   ├── vendor-consolidation-2026/
│   │   │   ├── project-brief.md                   # Scope: reduce SaaS spend by consolidating 3 overlapping tools
│   │   │   ├── status-update-2026-05-30.md        # Latest status: milestones, blockers, decisions needed
│   │   │   └── stakeholder-map.md                 # Who owns what, who needs to approve, who is informed
│   │   └── ops-handbook-launch/
│   │       ├── project-brief.md                   # Scope: publish company ops handbook in Notion
│   │       ├── content-tracker.md                 # Section-by-section ownership and completion status
│   │       └── status-update-2026-06-01.md
│   └── completed/
│       └── _archive-note.md                       # Completed projects — retain briefs for retrospective reference
├── reports/
│   ├── weekly/
│   │   ├── ops-report-2026-05-26.md               # Weekly ops report — wins, blockers, metrics, cross-team flags
│   │   ├── ops-report-2026-06-02.md               # Current week ops report
│   │   └── _report-template.md                    # Template for weekly ops report with standard sections
│   └── monthly/
│       ├── metrics-dashboard-2026-05.md            # Monthly metrics: SLA adherence, process cycle times, vendor scores
│       ├── metrics-dashboard-2026-04.md
│       └── _dashboard-template.md                 # Template for monthly metrics dashboard
└── automation/
    ├── _automation-index.md                        # Index of all active automations: tool, trigger, action, owner, last tested
    ├── zapier/
    │   ├── new-vendor-intake.md                    # Zap: Typeform → Airtable vendor registry → Slack #ops-vendors notify
    │   ├── sop-update-notify.md                    # Zap: Notion page edit in /SOPs → Slack #ops-team announcement
    │   ├── invoice-approval-routing.md             # Zap: Finance inbox email → Linear task → approver Slack DM
    │   └── okr-checkin-reminder.md                 # Zap: Weekly Slack reminder → OKR owners to update confidence scores
    └── make/
        ├── weekly-report-aggregator.md             # Make scenario: pull Linear + Airtable data → draft weekly ops report doc
        └── vendor-sla-monitor.md                  # Make scenario: ping vendor status pages → log to Airtable → alert on breach
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `.claude/commands/sop-draft.md` | Comando slash que toma el nombre de un proceso y contexto, genera un procedimiento operativo completo con propósito, alcance, tabla RACI, procedimiento paso a paso, manejo de excepciones y cadencia de revisión |
| `.claude/commands/vendor-review.md` | Comando slash que toma el nombre del proveedor y período de revisión, genera una revisión de desempeño estructurada contra los términos SLA con recomendación de renovación |
| `.claude/commands/okr-update.md` | Comando slash que toma el estado actual de OKR y notas de progreso, genera una actualización de estado OKR formateada con puntuaciones de confianza y banderas de riesgo por resultado clave |
| `.claude/commands/weekly-ops.md` | Comando slash para generar el informe operativo semanal — agrega victorias, bloqueadores, dependencias entre equipos y artículos de acción abiertos en un documento compartible |
| `.claude/commands/meeting-actions.md` | Comando slash que toma notas de reunión sin procesar y genera una tabla de artículos de acción limpia con propietarios, descripciones y fechas de vencimiento |
| `sops/_template/sop-template.md` | Estructura canónica de procedimientos operativos que sigue cada documento de proceso — garantiza consistencia entre departamentos y hace que los procedimientos operativos sean parseables por comandos de Claude |
| `vendors/vendor-registry.csv` | Fuente única de verdad para todos los proveedores activos — nombre, categoría, fecha de vencimiento del contrato, nivel de gasto, DRI — impulsa el cronograma de revisión trimestral |
| `okrs/2026/q2/ops-team-okrs.md` | OKRs actuales del equipo de operaciones — el documento activo actualizado semanalmente con puntuaciones de confianza y actualizado a medida que avanza el trimestre |
| `automation/_automation-index.md` | Índice maestro de cada automatización activa de Zapier y Make — previene duplicación, documenta propietarios e identifica automatizaciones que necesitan re-prueba |
| `reports/weekly/_report-template.md` | Plantilla estándar de informe operativo semanal — garantiza que cada informe cubra las mismas secciones para que los stakeholders sepan dónde encontrar lo que necesitan |

## Andamio rápido

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

## Plantilla CLAUDE.md

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
```

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
