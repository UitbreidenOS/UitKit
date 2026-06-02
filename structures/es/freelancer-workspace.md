# Espacio de trabajo de Freelancer / Consultor independiente — Estructura del proyecto

> Para un freelancer independiente o consultor ejecutando entrega a clientes, gestión de propuestas y administración empresarial desde un único espacio de trabajo — con Notion, FreshBooks, Cal.com, Loom, DocuSign y Stripe como stack operativo.

## Stack

- **Notion** — Gestión de proyectos, base de conocimiento de clientes, seguimiento de entregables, wiki interno
- **FreshBooks** o **Wave** — Facturación, seguimiento de gastos, estimaciones fiscales, reconciliación de pagos
- **Cal.com** o **Calendly** — Programación de clientes, reserva de llamadas de descubrimiento, gestión de búferes
- **Loom** — Actualizaciones asincrónicas de clientes, grabaciones de tutoriales, entrega de entregables
- **DocuSign** — Ejecución de contratos, aprobación de SOW, enrutamiento de NDA, seguimiento de sobres
- **Stripe** — Procesamiento de pagos, facturación de retención recurrente, seguimiento de pagos
- **Gmail** — Comunicación con clientes, entrega de contratos, seguimiento de facturas, alcance de nuevos negocios
- **Claude Code** — Redacción de propuestas, generación de SOW, correos de seguimiento de facturas, informes de estado, secuencias de alcance

## Árbol de directorios

```
freelancer-workspace/
├── .claude/
│   ├── CLAUDE.md                            # Workspace instructions (paste the template below)
│   ├── settings.json                        # MCP servers, hooks, permissions
│   └── commands/
│       ├── proposal-draft.md                # /proposal-draft — full proposal from client brief
│       ├── scope-of-work.md                 # /scope-of-work — SOW with deliverables, timeline, payment
│       ├── invoice-chase.md                 # /invoice-chase — follow-up email sequence for overdue invoices
│       ├── status-report.md                 # /status-report — weekly or milestone client update
│       ├── client-onboard.md                # /client-onboard — onboarding checklist + welcome comms
│       ├── new-business.md                  # /new-business — cold outreach or warm follow-up sequence
│       └── weekly-wrap.md                   # /weekly-wrap — personal end-of-week review + next week plan
├── clients/
│   ├── _template/                           # Copy this folder when a new client is signed
│   │   ├── brief.md                         # Initial client brief — goals, timeline, budget, contacts
│   │   ├── contract.md                      # Contract summary — key terms, payment schedule, termination
│   │   ├── sow.md                           # Scope of work — deliverables, milestones, acceptance criteria
│   │   ├── onboarding-checklist.md          # Access granted, tools set up, kickoff done, assets received
│   │   ├── status-log.md                    # Running log of weekly/milestone status reports sent
│   │   ├── comms-log.md                     # Email threads, calls, decisions — notable exchanges only
│   │   ├── deliverables/                    # All work product delivered to this client
│   │   │   └── .gitkeep
│   │   └── invoices/                        # Invoice records for this client
│   │       └── .gitkeep
│   ├── acme-redesign/                       # Active client: Acme Corp website redesign
│   │   ├── brief.md
│   │   ├── contract.md
│   │   ├── sow.md
│   │   ├── onboarding-checklist.md
│   │   ├── status-log.md
│   │   ├── comms-log.md
│   │   ├── deliverables/
│   │   │   ├── 2026-04-15-wireframes-v1.pdf
│   │   │   ├── 2026-05-01-wireframes-v2-revised.pdf
│   │   │   └── 2026-06-01-final-handoff.zip
│   │   └── invoices/
│   │       ├── inv-001-deposit.md           # Invoice record: number, amount, date sent, date paid
│   │       ├── inv-002-milestone-1.md
│   │       └── inv-003-final.md
│   ├── beta-corp-strategy/                  # Active client: Beta Corp fractional strategy engagement
│   │   ├── brief.md
│   │   ├── contract.md
│   │   ├── sow.md
│   │   ├── status-log.md
│   │   ├── comms-log.md
│   │   ├── deliverables/
│   │   │   ├── 2026-05-10-market-analysis.md
│   │   │   └── 2026-06-01-go-to-market-plan.md
│   │   └── invoices/
│   │       ├── inv-001-may-retainer.md
│   │       └── inv-002-jun-retainer.md
│   └── gamma-startup/                       # Closed client — archive for reference
│       ├── brief.md
│       ├── contract.md
│       ├── sow.md
│       ├── status-log.md
│       ├── comms-log.md
│       ├── deliverables/
│       │   └── 2026-03-20-final-report.md
│       └── invoices/
│           ├── inv-001-deposit.md
│           └── inv-002-completion.md
├── proposals/
│   ├── active/                              # Proposals sent but not yet signed or rejected
│   │   ├── 2026-05-28-delta-inc-brand-refresh.md
│   │   └── 2026-06-01-epsilon-co-growth-strategy.md
│   ├── won/                                 # Signed proposals — move here when contract is executed
│   │   ├── 2026-04-01-acme-redesign.md
│   │   └── 2026-03-10-beta-corp-strategy.md
│   └── lost/                               # Rejected or no-response proposals — keep for pattern analysis
│       ├── 2026-02-14-zeta-app-proposal.md
│       └── 2026-01-20-eta-audit-proposal.md
├── templates/
│   ├── proposal-template.md                 # Reusable proposal: problem statement, approach, deliverables, pricing
│   ├── sow-template.md                      # SOW: scope, timeline, milestones, payment schedule, exclusions
│   ├── contract-template.md                 # Master services agreement: IP, confidentiality, payment, termination
│   ├── invoice-template.md                  # Invoice format: line items, payment terms, bank/Stripe details
│   ├── nda-template.md                      # Mutual NDA for pre-proposal discussions
│   ├── onboarding-welcome-email.md          # First email to new client after contract signature
│   └── status-report-template.md           # Weekly status: done this week, next week, blockers, decisions needed
├── business-dev/
│   ├── prospect-list.md                     # Company name, contact, source, status, last touch, next action
│   ├── outreach-log.md                      # Date, prospect, message type, response, follow-up date
│   ├── referral-partners.md                 # People who refer work — relationship notes, last thank-you sent
│   └── positioning-notes.md                 # ICP definition, niche, key differentiators, proof points
├── finance/
│   ├── income-tracker.md                    # Monthly: invoiced, collected, outstanding — per client
│   ├── expense-log.md                       # Date, vendor, category, amount — for tax deduction tracking
│   ├── tax-estimate.md                      # Quarterly estimated tax calculation and payment log
│   ├── rate-card.md                         # Current rates: hourly, project, retainer — with last-updated date
│   └── cash-flow-forecast.md               # 90-day forward view: expected inflows, known expenses, buffer
└── ops/
    ├── onboarding-sop.md                    # Step-by-step process to onboard a new client from signed to kickoff
    ├── tools-and-access.md                  # Every tool used, login, plan tier, monthly cost, renewal date
    ├── subcontractors.md                    # Trusted subcons: name, specialty, rate, availability, past work
    └── working-hours-policy.md             # Response SLAs, out-of-office policy, emergency contact rules
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `.claude/commands/proposal-draft.md` | Comando slash que toma un resumen del cliente y produce una propuesta completa — declaración del problema, enfoque propuesto, lista de entregables, cronograma y opciones de precios |
| `.claude/commands/scope-of-work.md` | Comando slash que convierte una propuesta acordada en un SOW estructurado legalmente con hitos, criterios de aceptación, disparadores de pago y exclusiones explícitas |
| `.claude/commands/invoice-chase.md` | Comando slash que genera una secuencia de seguimiento de correos electrónicos en capas (recordatorio amistoso, solicitud firme, escalada) para facturas vencidas — toma el número de factura, monto y días de atraso |
| `.claude/commands/status-report.md` | Comando slash que produce un informe de estado de cliente conciso a partir de una lista de tareas completadas, obstáculos y próximos pasos — formatea para correo electrónico o Notion |
| `.claude/commands/client-onboard.md` | Comando slash que genera una lista de verificación de incorporación y redacta el correo electrónico de bienvenida, agenda de inicio y lista de solicitud de acceso para un cliente recién firmado |
| `clients/_template/` | Estructura de carpeta en blanco para copiar cuando comienza cualquier nuevo compromiso con cliente — impone documentación consistente en todo el trabajo del cliente |
| `finance/income-tracker.md` | Libro mayor mensual de facturado versus cobrado por cliente — la única fuente de verdad para ingresos y AR pendiente |
| `ops/onboarding-sop.md` | Proceso repeatable paso a paso desde contrato firmado hasta llamada de inicio — asegura que no se pierda ningún paso de acceso, credencial o comunicación |

## Andamiaje rápido

```bash
# Create the workspace root
mkdir -p freelancer-workspace

# Create .claude structure
mkdir -p freelancer-workspace/.claude/commands

# Create client template
mkdir -p freelancer-workspace/clients/_template/deliverables
mkdir -p freelancer-workspace/clients/_template/invoices
touch freelancer-workspace/clients/_template/deliverables/.gitkeep
touch freelancer-workspace/clients/_template/invoices/.gitkeep
touch freelancer-workspace/clients/_template/brief.md
touch freelancer-workspace/clients/_template/contract.md
touch freelancer-workspace/clients/_template/sow.md
touch freelancer-workspace/clients/_template/onboarding-checklist.md
touch freelancer-workspace/clients/_template/status-log.md
touch freelancer-workspace/clients/_template/comms-log.md

# Create active client directories
mkdir -p freelancer-workspace/clients/acme-redesign/deliverables
mkdir -p freelancer-workspace/clients/acme-redesign/invoices
mkdir -p freelancer-workspace/clients/beta-corp-strategy/deliverables
mkdir -p freelancer-workspace/clients/beta-corp-strategy/invoices

# Create proposal directories
mkdir -p freelancer-workspace/proposals/active
mkdir -p freelancer-workspace/proposals/won
mkdir -p freelancer-workspace/proposals/lost

# Create templates directory
mkdir -p freelancer-workspace/templates

# Create business-dev, finance, and ops directories
mkdir -p freelancer-workspace/business-dev
mkdir -p freelancer-workspace/finance
mkdir -p freelancer-workspace/ops

# Seed key files
touch freelancer-workspace/finance/income-tracker.md
touch freelancer-workspace/finance/expense-log.md
touch freelancer-workspace/finance/tax-estimate.md
touch freelancer-workspace/finance/rate-card.md
touch freelancer-workspace/finance/cash-flow-forecast.md
touch freelancer-workspace/business-dev/prospect-list.md
touch freelancer-workspace/business-dev/outreach-log.md
touch freelancer-workspace/ops/onboarding-sop.md
touch freelancer-workspace/ops/tools-and-access.md

# Install freelancer/small-business skills
npx claudient add skill small-business/freelancer-proposal
npx claudient add skill small-business/scope-of-work
npx claudient add skill small-business/invoice-chaser
npx claudient add skill small-business/client-status-report
npx claudient add skill small-business/cold-outreach

# Copy command stubs into .claude/commands/
npx claudient add skill small-business/freelancer-proposal --output freelancer-workspace/.claude/commands/proposal-draft.md
npx claudient add skill small-business/scope-of-work --output freelancer-workspace/.claude/commands/scope-of-work.md
npx claudient add skill small-business/invoice-chaser --output freelancer-workspace/.claude/commands/invoice-chase.md
npx claudient add skill small-business/client-status-report --output freelancer-workspace/.claude/commands/status-report.md
npx claudient add skill small-business/cold-outreach --output freelancer-workspace/.claude/commands/new-business.md
```

## Plantilla CLAUDE.md

```markdown
# Espacio de trabajo de Freelancer — Instrucciones de Claude Code

## Qué es esto

Este es el directorio de trabajo para un consultor independiente que gestiona compromisos con clientes, propuestas,
facturación y desarrollo de negocios. El trabajo del cliente vive en clients/, propuestas abiertas en proposals/active/,
documentos reutilizables en templates/, y registros financieros en finance/. Todo el borrador de propuestas, generación de SOW,
seguimiento de facturas, informes de estado y alcance se ejecuta a través de comandos slash de Claude Code.

## Stack

- Notion — Seguimiento de proyectos por cliente; enlaza URL de página de Notion en clients/<name>/brief.md
- FreshBooks / Wave — Facturación y contabilidad; registra números de factura y fechas de pago en clients/<name>/invoices/
- Cal.com / Calendly — Programación; pega enlace de reserva en onboarding-welcome-email.md y propuestas
- Loom — Actualizaciones asincrónicas; incrusta URLs de Loom en informes de estado enviados a clientes
- DocuSign — Aprobación de contrato y SOW; registra IDs de sobre en clients/<name>/contract.md
- Stripe — Procesamiento de pagos; registra IDs de pago de Stripe en archivos clients/<name>/invoices/
- Gmail — Todas las comunicaciones del cliente; decisiones y acuerdos notables registrados en clients/<name>/comms-log.md

## Tareas comunes y comandos exactos

### Redactar una propuesta a partir de un resumen del cliente
```
/proposal-draft

Client: [company name]
Contact: [name, title, email]
Brief: [paste the brief or describe the request in detail]
Budget range: [$X–$Y or "TBD"]
Timeline: [target start date and duration]
My angle: [what I bring that's different from a generalist]
```

### Generar un alcance de trabajo a partir de una propuesta firmada
```
/scope-of-work

Client: [company name]
Project: [project name]
Agreed deliverables: [list exactly what was agreed]
Timeline: [start date, milestone dates, end date]
Payment schedule: [deposit %, milestone %, completion %]
Exclusions: [anything explicitly out of scope]
```

### Escribir un seguimiento de factura
```
/invoice-chase

Client: [company name]
Invoice number: [INV-XXX]
Amount: [$X]
Due date: [date]
Days overdue: [N]
Prior contact: [have I followed up before? when?]
Tone: [friendly / firm / final notice]
```

### Enviar un informe de estado de cliente
```
/status-report

Client: [company name]
Period: [week of / milestone: X]
Completed this period: [bullet list]
In progress: [what is underway]
Blockers: [anything I need from them]
Next period plan: [what happens next]
Format: [email / Notion update / Loom script]
```

### Incorporar un nuevo cliente
```
/client-onboard

Client: [company name]
Contact: [name, title]
Project: [project name]
Start date: [date]
Tools to grant access: [Notion, Slack, Figma, Drive — list what applies]
First deliverable due: [date and what it is]
```

### Escribir alcance para un nuevo prospecto
```
/new-business

Prospect: [company name and description]
Contact: [name, title]
Source: [how I know them or found them]
Angle: [why I'm reaching out now — trigger event, referral, content]
Ask: [discovery call, reply, intro — keep it one thing]
Tone: [warm / cold / follow-up on prior touch]
```

### Ejecutar un resumen semanal
```
/weekly-wrap

Week of: [date]
Client work done: [list by client]
Proposals sent: [list]
Invoices sent / collected: [list]
Business dev actions: [outreach sent, calls taken]
Next week priorities: [top 3]
Blockers or concerns: [anything weighing on you]
```

## Convenciones a seguir

- Cada nuevo cliente debe tener una carpeta creada bajo clients/ antes de la llamada de inicio — copia _template/
- Los archivos SOW en clients/<name>/sow.md son la fuente de verdad del contrato — nunca describes el alcance de memoria
- Los registros de factura en clients/<name>/invoices/ deben incluir: número de factura, monto, fecha enviada, fecha pagada (o "pendiente")
- Las propuestas van a proposals/active/ cuando se envían — muévelas a won/ o lost/ dentro de 48 horas del resultado
- Todos los intentos de alcance se registran en business-dev/outreach-log.md el mismo día que se envían
- finance/income-tracker.md se actualiza el último viernes de cada mes — sin excepciones
- finance/expense-log.md se actualiza semanalmente — registra todo lo que supere $20 para propósitos fiscales
- La tarjeta de tarifas en finance/rate-card.md siempre muestra la fecha de última actualización — revisa trimestralmente
```

## Servidores MCP

```json
{
  "mcpServers": {
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@googleapis/mcp-server-google-drive"],
      "env": {
        "GOOGLE_CLIENT_ID": "your-google-oauth-client-id",
        "GOOGLE_CLIENT_SECRET": "your-google-oauth-client-secret",
        "GOOGLE_REFRESH_TOKEN": "your-google-refresh-token"
      }
    },
    "gmail": {
      "command": "npx",
      "args": ["-y", "@googleapis/mcp-server-gmail"],
      "env": {
        "GOOGLE_CLIENT_ID": "your-google-oauth-client-id",
        "GOOGLE_CLIENT_SECRET": "your-google-oauth-client-secret",
        "GOOGLE_REFRESH_TOKEN": "your-google-refresh-token"
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
        "/Users/your-username/freelancer-workspace"
      ]
    }
  }
}
```

## Hooks recomendados

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"proposals/active/\"; then echo \"[hook] Proposal saved to active/ — log it in business-dev/outreach-log.md with the date sent and prospect contact\"; fi'"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"clients/.*/sow.md\"; then echo \"[hook] Writing SOW — confirm client folder has brief.md and contract.md before finalising scope\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'TODAY=$(date +%A); if [ \"$TODAY\" = \"Friday\" ]; then echo \"[reminder] Friday — run /weekly-wrap and check finance/income-tracker.md for any outstanding invoices\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Habilidades a instalar

```bash
# Core freelancer skills
npx claudient add skill small-business/freelancer-proposal
npx claudient add skill small-business/scope-of-work
npx claudient add skill small-business/invoice-chaser
npx claudient add skill small-business/client-status-report
npx claudient add skill small-business/cold-outreach

# Supporting productivity skills
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/vendor-evaluator

# Install all small-business skills at once
npx claudient add skills small-business
```

## Relacionado

- [Freelancer guide](../guides/for-freelancer.md)
- [Client onboarding workflow](../workflows/client-onboarding.md)
- [Proposal-to-contract workflow](../workflows/proposal-to-contract.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
