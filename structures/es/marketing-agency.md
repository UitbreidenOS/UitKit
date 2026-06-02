# Operaciones de Agencia de Marketing — Estructura de Proyecto

> Para agencias de marketing que gestionan múltiples campañas de clientes — desde incorporación y captura de requisitos hasta producción de contenido, medios pagados, reportes mensuales y facturación de retainer — en un único espacio de trabajo de Claude Code.

## Stack

- **Gestión de proyectos:** Asana (Projects, Timelines, Portfolios) o Monday.com (Boards, Automations, Dashboards)
- **CRM + seguimiento de campañas:** HubSpot CRM (contacts, deals, campaign performance, email sequences)
- **Documentos + colaboración:** Google Workspace (Docs, Sheets, Slides, Drive)
- **Creatividad:** Figma (brand design, ad creative, landing page mockups, presentation decks)
- **SEO:** Semrush (Keyword Magic, Position Tracking, Site Audit, Backlink Analytics)
- **Búsqueda pagada:** Google Ads (Search, Display, Performance Max, Demand Gen campaigns)
- **Redes sociales pagadas:** Meta Business Suite (Facebook + Instagram Ads Manager, Audience Insights)
- **Comunicación:** Slack (client channels, internal channels, campaign alerts)
- **Seguimiento de tiempo:** Harvest (project-level time tracking, budget burn, team capacity)
- **Facturación:** FreshBooks (retainer invoices, project billing, expense tracking, reports)
- **Analytics:** Google Analytics 4, Looker Studio (cross-channel dashboards)

## Árbol de directorios

```
marketing-agency/
├── .claude/
│   ├── CLAUDE.md                                     # Workspace instructions for Claude Code
│   ├── settings.json                                 # MCP servers, hooks, permissions
│   └── commands/
│       ├── new-client.md                             # /new-client — scaffold full client directory from template
│       ├── campaign-brief.md                         # /campaign-brief — generate campaign brief from intake notes
│       ├── monthly-report.md                         # /monthly-report — pull metrics and write client report
│       ├── retainer-check.md                         # /retainer-check — compare hours logged vs retainer scope
│       ├── proposal.md                               # /proposal — draft new-business proposal from brief
│       ├── ad-copy.md                                # /ad-copy — generate Google Ads and Meta ad copy variants
│       ├── seo-audit.md                              # /seo-audit — run Semrush site audit summary for client
│       └── scope-change.md                           # /scope-change — draft scope change order with billing impact
├── clients/
│   ├── _template/                                    # Master template — copy to clients/<client-name>/ on intake
│   │   ├── brief/
│   │   │   ├── client-intake.md                     # Intake questionnaire responses
│   │   │   └── discovery-notes.md                   # Notes from kickoff call
│   │   ├── strategy/
│   │   │   ├── marketing-strategy.md                # Overall channel strategy and 90-day roadmap
│   │   │   ├── target-audience.md                   # ICP, personas, pain points
│   │   │   └── competitor-analysis.md               # Competitive landscape, gaps, opportunities
│   │   ├── campaigns/
│   │   │   └── _campaign-template/
│   │   │       ├── campaign-brief.md                # Goals, audience, messaging, budget, timeline
│   │   │       ├── ad-copy.md                       # All ad copy variants by channel
│   │   │       ├── creative-brief.md                # Figma brief for design team
│   │   │       └── results/
│   │   │           └── campaign-report.md           # Post-campaign results writeup
│   │   ├── assets/
│   │   │   ├── brand-guidelines.md                  # Brand colors, fonts, tone of voice
│   │   │   ├── logo/                                # Approved logo files (SVG, PNG)
│   │   │   └── approved-copy/                       # Approved headlines, taglines, boilerplate
│   │   ├── reports/
│   │   │   ├── onboarding-report.md                 # Baseline audit delivered at kickoff
│   │   │   └── _monthly-template.md                 # Copy this for each monthly report
│   │   └── contracts/
│   │       ├── sow.md                               # Statement of Work with deliverables and scope
│   │       ├── retainer-agreement.md                # Monthly retainer terms and hours
│   │       └── amendments/                          # Signed scope change orders
│   ├── acme-corp/
│   │   ├── brief/
│   │   │   ├── client-intake.md
│   │   │   └── discovery-notes.md
│   │   ├── strategy/
│   │   │   ├── marketing-strategy.md
│   │   │   ├── target-audience.md
│   │   │   └── competitor-analysis.md
│   │   ├── campaigns/
│   │   │   ├── 2026-q2-brand-awareness/
│   │   │   │   ├── campaign-brief.md
│   │   │   │   ├── ad-copy.md
│   │   │   │   ├── creative-brief.md
│   │   │   │   └── results/
│   │   │   │       └── campaign-report.md
│   │   │   └── 2026-q3-lead-gen/
│   │   │       ├── campaign-brief.md
│   │   │       ├── ad-copy.md
│   │   │       └── creative-brief.md
│   │   ├── assets/
│   │   │   ├── brand-guidelines.md
│   │   │   ├── logo/
│   │   │   └── approved-copy/
│   │   ├── reports/
│   │   │   ├── onboarding-report.md
│   │   │   ├── 2026-04-monthly-report.md
│   │   │   ├── 2026-05-monthly-report.md
│   │   │   └── _monthly-template.md
│   │   └── contracts/
│   │       ├── sow.md
│   │       ├── retainer-agreement.md
│   │       └── amendments/
│   │           └── 2026-05-scope-change-01.md
│   └── blueprint-health/
│       ├── brief/
│       ├── strategy/
│       ├── campaigns/
│       ├── assets/
│       ├── reports/
│       └── contracts/
├── templates/
│   ├── campaign-brief.md                            # Blank campaign brief — goals, audience, budget, channels
│   ├── monthly-report.md                            # Monthly report structure — exec summary, KPIs, channel breakdown
│   ├── proposal.md                                  # New-business proposal — situation, approach, team, investment
│   ├── sow.md                                       # Statement of Work — deliverables, timelines, scope, exclusions
│   ├── creative-brief.md                            # Creative brief for Figma — context, deliverables, specs, do-nots
│   └── scope-change-order.md                        # Scope change order — description, hours, revised billing
├── campaigns/
│   └── active/
│       ├── acme-corp--q3-lead-gen/                  # Symlink or copy of active campaign dir for quick access
│       └── blueprint-health--seo-sprint/
├── new-business/
│   ├── prospect-list.md                             # CRM-style prospect tracking with stage, contact, notes
│   ├── proposals/
│   │   ├── greenfield-retail-2026-05.md             # Sent proposals archived here
│   │   └── northstar-saas-2026-06.md
│   └── pitch-decks/
│       ├── agency-capabilities-2026.md              # Master capabilities doc (pull from this for decks)
│       └── greenfield-retail-deck-outline.md        # Deck outline before moving to Slides/Figma
├── operations/
│   ├── sops/
│   │   ├── client-onboarding.md                    # Step-by-step new client onboarding checklist
│   │   ├── campaign-launch.md                      # Pre-launch checklist for paid campaigns
│   │   ├── monthly-reporting.md                    # Reporting workflow — data pull, draft, review, send
│   │   ├── offboarding.md                          # Client offboarding — asset handoff, access revocation
│   │   └── retainer-renewal.md                     # Renewal process — review, upsell, revised SOW
│   ├── onboarding/
│   │   ├── new-hire-checklist.md                   # Tools access, Slack channels, Harvest setup
│   │   └── client-onboarding-checklist.md          # Parallel checklist for client-facing setup steps
│   ├── offboarding/
│   │   └── client-offboarding-checklist.md
│   └── rate-card.md                                 # Current hourly rates and retainer tier pricing
└── resources/
    ├── brand-guidelines/
    │   └── agency-brand.md                          # Agency's own brand guide for pitches and proposals
    ├── media-kits/
    │   └── agency-media-kit-2026.md                 # Agency overview, client roster, results highlights
    └── case-studies/
        ├── acme-corp-brand-awareness.md             # Structured case study — challenge, approach, results
        └── blueprint-health-seo.md
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `.claude/commands/new-client.md` | Comando slash que crea el árbol de directorios completo `clients/<slug>/` a partir de `clients/_template/`, prepopula el formulario de captura y crea un SOW y acuerdo de retainer en borrador |
| `.claude/commands/campaign-brief.md` | Toma una semilla de cliente, objetivo de campaña, presupuesto y canales como entrada; produce un brief de campaña completamente estructurado alineado con las directrices de marca y estrategia existentes del cliente |
| `.claude/commands/monthly-report.md` | Lee métricas de canales (GA4, Google Ads, Meta, Semrush) de un archivo de datos estructurado y escribe el reporte del cliente mensual usando `templates/monthly-report.md` |
| `.claude/commands/retainer-check.md` | Compara las horas registradas en Harvest contra el alcance de retainer del cliente en `contracts/retainer-agreement.md` y señala excedentes o presupuesto disponible |
| `.claude/commands/scope-change.md` | Elabora una orden de cambio de alcance con horas, justificación y facturación revisada usando `templates/scope-change-order.md`; guarda en `clients/<slug>/contracts/amendments/` |
| `clients/_template/` | Directorio maestro de andamiaje — copia esta carpeta completa al incorporar un nuevo cliente para garantizar que todas las carpetas y archivos existan antes del lanzamiento |
| `operations/sops/monthly-reporting.md` | SOP canónico para el proceso de reporte mensual — define quién extrae datos, cuál es el ciclo de revisión y cuándo se envían los reportes a los clientes |
| `templates/campaign-brief.md` | Brief de campaña estándar de la agencia con secciones para objetivo empresarial, métricas de éxito, audiencia, pilares de mensajería, plan de canales, presupuesto y línea de tiempo |

## Andamiaje rápido

```bash
# Create workspace root
mkdir -p marketing-agency && cd marketing-agency

# Claude Code config
mkdir -p .claude/commands

# Client _template directory (full depth)
mkdir -p clients/_template/brief
mkdir -p clients/_template/strategy
mkdir -p clients/_template/campaigns/_campaign-template/results
mkdir -p clients/_template/assets/logo
mkdir -p clients/_template/assets/approved-copy
mkdir -p clients/_template/reports
mkdir -p clients/_template/contracts/amendments

# Example client directories
mkdir -p clients/acme-corp/brief
mkdir -p clients/acme-corp/strategy
mkdir -p clients/acme-corp/campaigns/2026-q2-brand-awareness/results
mkdir -p clients/acme-corp/campaigns/2026-q3-lead-gen
mkdir -p clients/acme-corp/assets/logo
mkdir -p clients/acme-corp/assets/approved-copy
mkdir -p clients/acme-corp/reports
mkdir -p clients/acme-corp/contracts/amendments

mkdir -p clients/blueprint-health/brief
mkdir -p clients/blueprint-health/strategy
mkdir -p clients/blueprint-health/campaigns
mkdir -p clients/blueprint-health/assets
mkdir -p clients/blueprint-health/reports
mkdir -p clients/blueprint-health/contracts/amendments

# Templates
mkdir -p templates

# Active campaigns shortcut
mkdir -p campaigns/active

# New business
mkdir -p new-business/proposals
mkdir -p new-business/pitch-decks

# Operations
mkdir -p operations/sops
mkdir -p operations/onboarding
mkdir -p operations/offboarding

# Resources
mkdir -p resources/brand-guidelines
mkdir -p resources/media-kits
mkdir -p resources/case-studies

# Initialize config files
touch .claude/CLAUDE.md
touch .claude/settings.json

# Create placeholder template files
touch clients/_template/brief/client-intake.md
touch clients/_template/brief/discovery-notes.md
touch clients/_template/strategy/marketing-strategy.md
touch clients/_template/strategy/target-audience.md
touch clients/_template/strategy/competitor-analysis.md
touch clients/_template/campaigns/_campaign-template/campaign-brief.md
touch clients/_template/campaigns/_campaign-template/ad-copy.md
touch clients/_template/campaigns/_campaign-template/creative-brief.md
touch clients/_template/reports/_monthly-template.md
touch clients/_template/contracts/sow.md
touch clients/_template/contracts/retainer-agreement.md
touch templates/campaign-brief.md
touch templates/monthly-report.md
touch templates/proposal.md
touch templates/sow.md
touch templates/creative-brief.md
touch templates/scope-change-order.md
touch new-business/prospect-list.md
touch operations/sops/client-onboarding.md
touch operations/sops/campaign-launch.md
touch operations/sops/monthly-reporting.md
touch operations/sops/offboarding.md
touch operations/sops/retainer-renewal.md
touch operations/rate-card.md

# Install all relevant skills
npx claudient add skill marketing/campaign-brief
npx claudient add skill marketing/ad-copy-generator
npx claudient add skill marketing/monthly-report
npx claudient add skill marketing/seo-audit
npx claudient add skill marketing/content-strategy
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/exec-briefing
npx claudient add skill data-ml/stakeholder-report

# Install slash commands
npx claudient add command new-client
npx claudient add command campaign-brief
npx claudient add command monthly-report
npx claudient add command retainer-check
npx claudient add command proposal
npx claudient add command ad-copy
npx claudient add command seo-audit
npx claudient add command scope-change

echo "Marketing agency workspace ready."
```

## Plantilla CLAUDE.md

```markdown
# Operaciones de Agencia de Marketing — Instrucciones de Claude

## Qué es esto

Este espacio de trabajo gestiona operaciones de agencias de marketing multicliente: incorporación de clientes,
desarrollo de briefs de campaña, medios pagados (Google Ads + Meta), SEO (Semrush), reportes mensuales,
seguimiento de alcance de retainer y desarrollo de propuestas de nuevo negocio. Cada cliente tiene
un directorio aislado bajo clients/. Todas las plantillas están en templates/.

## Stack

- Gestión de proyectos: Asana (one project per client, campaign tasks, timelines)
- CRM: HubSpot (contact and deal records, campaign tracking, email sequences)
- Documentos: Google Workspace (Docs for deliverables, Sheets for media plans, Slides for decks)
- Creatividad: Figma (ad creative, landing pages, presentation decks)
- SEO: Semrush (keyword research, position tracking, site audit, backlink analysis)
- Búsqueda pagada: Google Ads (Search, Display, Performance Max)
- Redes sociales pagadas: Meta Business Suite (Facebook + Instagram Ads Manager)
- Seguimiento de tiempo: Harvest (project-level, billable vs non-billable per client)
- Facturación: FreshBooks (retainer invoices, project billing, expense reconciliation)
- Comunicación: Slack (#client-<name> per client, #campaigns, #new-business, #ops)
- Analytics: Google Analytics 4, Looker Studio dashboards

## Convenciones de directorios

- clients/<client-slug>/ — todos los entregables del cliente; nunca mezcles activos de clientes en diferentes carpetas
- clients/<client-slug>/campaigns/<YYYY-qN-campaign-name>/ — un directorio por campaña
- clients/<client-slug>/reports/<YYYY-MM>-monthly-report.md — reportes mensuales nombrados por período
- clients/<client-slug>/contracts/amendments/ — cada cambio de alcance obtiene un archivo numerado
- templates/ — fuente de verdad para todas las estructuras de documentos; nunca elabores sin copiar una plantilla
- new-business/ — solo seguimiento de prospectos, propuestas y esquemas de pitch decks
- operations/sops/ — documentación de procesos canónica; actualiza estos cuando los procesos cambian

## Incorporación de un nuevo cliente

1. Copia clients/_template/ a clients/<new-client-slug>/:
   cp -r clients/_template clients/<new-client-slug>
2. Ejecuta /new-client client="<Name>" slug="<slug>" retainer="<monthly-hours>"
3. Completa clients/<slug>/brief/client-intake.md antes de la llamada de lanzamiento
4. Después del lanzamiento, completa clients/<slug>/strategy/marketing-strategy.md
5. Elabora SOW usando templates/sow.md; guarda en clients/<slug>/contracts/sow.md
6. Crea proyecto de Asana y vincula ID de proyecto en clients/<slug>/brief/discovery-notes.md
7. Abre registro de deal de HubSpot y vincula ID de deal en discovery-notes.md
8. Abre proyecto de Harvest para el cliente usando la tarjeta de tarifas en operations/rate-card.md

## Flujo de trabajo de brief de campaña

1. Ejecuta /campaign-brief client="<slug>" goal="<objective>" budget="<amount>" channels="<list>"
2. Revisa y refina clients/<slug>/campaigns/<campaign-dir>/campaign-brief.md
3. Ejecuta /ad-copy brief=clients/<slug>/campaigns/<campaign-dir>/campaign-brief.md
4. Envía creative-brief.md a Figma — consulta brand-guidelines.md para restricciones de especificaciones
5. En el lanzamiento, ejecuta /seo-audit client="<slug>" para campañas orgánicas; verifica línea de base de posición de Semrush
6. Registra la fecha de inicio de campaña en Harvest como una nota de hito

## Proceso de reportes mensuales

1. Exporta datos de canales (GA4, Google Ads, Meta, seguimiento de posición de Semrush) a un CSV o archivo .md estructurado
2. Coloca datos exportados en clients/<slug>/reports/raw-data-<YYYY-MM>.md
3. Ejecuta /monthly-report client="<slug>" period="<YYYY-MM>" data=clients/<slug>/reports/raw-data-<YYYY-MM>.md
4. Revisa borrador en clients/<slug>/reports/<YYYY-MM>-monthly-report.md
5. Revisión interna vía Slack #campaigns antes de enviar al cliente
6. Después de la aprobación del cliente, archiva en Google Drive y marca como enviado en Asana

## Gestión del alcance de retainer

- Ejecuta /retainer-check client="<slug>" month="<YYYY-MM>" después de cada exportación de Harvest
- Horas por encima del alcance: elabora orden de cambio de alcance antes de registrar tiempo adicional
  /scope-change client="<slug>" hours="<overage>" reason="<description>"
- Guarda salida en clients/<slug>/contracts/amendments/YYYY-MM-scope-change-NN.md
- Renovaciones de retainer: sigue operations/sops/retainer-renewal.md 30 días antes de la fecha de finalización

## Convenciones de copia de anuncios

- Titulares de Google Ads: máximo 30 caracteres; escribe 10+ variantes por campaña
- Descripciones de Google Ads: máximo 90 caracteres; comienza con beneficio, termina con CTA
- Texto principal de Meta: 125 caracteres visibles antes del truncamiento; engancha en los primeros 80 caracteres
- Titular de Meta: máximo 40 caracteres; impulsado por beneficio, sin clickbait
- Toda la copia debe aprobarse contra las directrices de marca del cliente antes de cargar

## Convenciones de facturación

- Registra tiempo en Harvest inmediatamente después de cada tarea — no hagas lotes al final de la semana
- Códigos facturables: strategy, content, paid-media, reporting, account-management, design
- No facturables: internal training, tooling setup, admin
- Factura el 1 de cada mes a través de FreshBooks; referencia el reporte de Harvest para desglose de horas
```

## Servidores MCP

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/${USER}/marketing-agency"
      ]
    },
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "${HUBSPOT_ACCESS_TOKEN}"
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
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@google-labs/google-drive-mcp"],
      "env": {
        "GOOGLE_CLIENT_ID": "${GOOGLE_CLIENT_ID}",
        "GOOGLE_CLIENT_SECRET": "${GOOGLE_CLIENT_SECRET}",
        "GOOGLE_REFRESH_TOKEN": "${GOOGLE_REFRESH_TOKEN}"
      }
    },
    "asana": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-asana"],
      "env": {
        "ASANA_ACCESS_TOKEN": "${ASANA_ACCESS_TOKEN}"
      }
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_FILE_PATH\"; if [[ \"$FILE\" == */campaigns/*/campaign-brief.md ]]; then echo \"[hook] Campaign brief saved: $FILE — run /ad-copy and /creative-brief next\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_FILE_PATH\"; if [[ \"$FILE\" == */contracts/amendments/*.md ]]; then echo \"[hook] Scope change order saved: $FILE — update Harvest budget and send to client for signature\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR}\" && MISSING=$(find clients/ -mindepth 1 -maxdepth 1 -type d ! -name _template | while read CLIENT; do [ ! -f \"$CLIENT/contracts/retainer-agreement.md\" ] && echo \"$CLIENT\"; done | wc -l | tr -d \" \"); [ \"$MISSING\" -gt 0 ] && echo \"[reminder] $MISSING client(s) missing retainer-agreement.md — check contracts/ directories\" || true'"
          }
        ]
      }
    ]
  }
}
```

## Skills a instalar

```bash
npx claudient add skill marketing/campaign-brief
npx claudient add skill marketing/ad-copy-generator
npx claudient add skill marketing/monthly-report
npx claudient add skill marketing/seo-audit
npx claudient add skill marketing/content-strategy
npx claudient add skill marketing/social-media-manager
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill productivity/investor-update
```

## Relacionado

- [Guide: Claude for Marketing Teams](../guides/for-content-marketer.md)
- [Workflow: Campaign Launch end-to-end](../workflows/campaign-launch.md)
- [Workflow: Monthly Client Reporting](../workflows/monthly-reporting.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
