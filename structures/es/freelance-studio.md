# Estudio Freelance / Consultoría — Estructura de Proyecto

> Para un freelancer independiente o pequeño estudio que gestiona proyectos de clientes, desarrollo comercial y operaciones a través de Notion, HoneyBook, Cal.com, Loom, Figma, Stripe, Gmail y Slack.

## Stack

- **Notion** — Gestión de proyectos, CRM, base de conocimientos de clientes, seguimiento de entregables, wiki interno
- **FreshBooks** o **HoneyBook** — Facturación, contratos, cobranza, seguimiento de gastos, facturación de retainer
- **Cal.com** — Programación de clientes, reserva de llamadas de descubrimiento, enrutamiento de formularios de entrada, gestión de búfer
- **Loom** — Grabaciones de actualizaciones de clientes asincrónicas, walkthroughs de entregables, videos de solicitud de retroalimentación
- **Figma** — Entregables UI/UX, wireframes, librerías de componentes, handoffs de diseño
- **Framer** — Prototipos interactivos, entregables de sitios sin código, previsualizaciones listas para el cliente
- **Stripe** — Procesamiento de pagos, cargos de retainer recurrentes, honorarios únicos de proyecto, seguimiento de pagos
- **Gmail** — Comunicación con clientes, entrega de contratos, seguimiento de facturas, alcance comercial nuevo
- **Slack** — Canales de proyecto activos por cliente, preguntas y respuestas asincrónicas, intercambio de archivos, enlaces de Loom
- **Claude Code** — Borrador de propuestas, generación de SOW, reportes de estado, emails de seguimiento de facturas, secuencias de alcance

## Árbol de directorios

```
freelance-studio/
├── .claude/
│   ├── CLAUDE.md                                    # Instrucciones del workspace (pega la plantilla debajo)
│   ├── settings.json                                # Servidores MCP, hooks, permisos
│   └── commands/
│       ├── new-client-onboard.md                    # /new-client-onboard — lista de verificación de incorporación completa + email de bienvenida + agenda de kickoff
│       ├── proposal-draft.md                        # /proposal-draft — propuesta desde brief: problema, enfoque, entregables, opciones de precios
│       ├── scope-of-work.md                         # /scope-of-work — SOW estructurado con hitos, criterios de aceptación, activadores de pago
│       ├── invoice-chase.md                         # /invoice-chase — email de seguimiento escalonado (amigable / firme / final) para facturas vencidas
│       ├── client-status-update.md                  # /client-status-update — actualización semanal o de hito para email o script de Loom
│       ├── feedback-request.md                      # /feedback-request — solicitud de retroalimentación estructurada después de entrega de hito
│       ├── project-closeout.md                      # /project-closeout — lista de verificación de offboarding, solicitud de factura final, solicitud de testimonial
│       └── weekly-wrap.md                           # /weekly-wrap — revisión personal de fin de semana: ingresos, pipeline, plan de próxima semana
├── clients/
│   ├── _template/                                   # Copia esta carpeta completa cuando se firma un nuevo cliente
│   │   ├── brief.md                                 # Brief inicial del cliente: objetivos, cronograma, presupuesto, contactos clave, criterios de éxito
│   │   ├── contract.md                              # Resumen del contrato: términos clave, calendario de pagos, propiedad intelectual, cláusula de terminación
│   │   ├── sow.md                                   # Alcance del trabajo: entregables, hitos, criterios de aceptación, exclusiones
│   │   ├── communication-log.md                     # Emails, llamadas, decisiones notables — registra la sustancia, no las cortesías
│   │   ├── invoices/
│   │   │   └── .gitkeep
│   │   └── deliverables/
│   │       └── .gitkeep
│   ├── acme-corp-brand-2026/                        # Cliente activo: proyecto de identidad de marca Acme Corp
│   │   ├── brief.md
│   │   ├── contract.md                              # ID de contrato HoneyBook: HB-2026-0041
│   │   ├── sow.md
│   │   ├── communication-log.md
│   │   ├── invoices/
│   │   │   ├── inv-001-deposit-2026-04-01.md        # Registro de factura: número, monto, fecha de envío, fecha de pago, ID de cargo Stripe
│   │   │   ├── inv-002-milestone-1-2026-05-01.md
│   │   │   └── inv-003-final-2026-06-15.md
│   │   └── deliverables/
│   │       ├── 2026-04-20-moodboard-v1.fig          # Enlace de archivo Figma o PDF exportado
│   │       ├── 2026-05-05-brand-guidelines-v1.pdf
│   │       ├── 2026-05-18-brand-guidelines-v2-revised.pdf
│   │       └── 2026-06-10-final-handoff-package.zip
│   ├── betaworks-site-redesign/                     # Cliente activo: reconstrucción de sitio Betaworks Framer
│   │   ├── brief.md
│   │   ├── contract.md
│   │   ├── sow.md
│   │   ├── communication-log.md
│   │   ├── invoices/
│   │   │   ├── inv-001-deposit-2026-05-01.md
│   │   │   └── inv-002-milestone-1-2026-06-01.md
│   │   └── deliverables/
│   │       ├── 2026-05-15-wireframes-v1.fig
│   │       ├── 2026-05-28-wireframes-v2-approved.fig
│   │       └── 2026-06-05-framer-staging-link.md    # URL de vista previa de Framer + credenciales
│   ├── gamma-dao-strategy/                          # Cliente cerrado — archivado como referencia y caso de estudio
│   │   ├── brief.md
│   │   ├── contract.md
│   │   ├── sow.md
│   │   ├── communication-log.md
│   │   ├── invoices/
│   │   │   ├── inv-001-deposit-2026-01-15.md
│   │   │   └── inv-002-completion-2026-03-01.md
│   │   └── deliverables/
│   │       └── 2026-03-01-strategy-deck-final.pdf
│   └── delta-fintech-ux/                            # En espera — esperando aprobación de presupuesto del cliente
│       ├── brief.md
│       └── communication-log.md
├── pipeline/
│   ├── prospects.md                                 # Empresa, contacto, fuente, puntuación de ajuste ICP, último contacto, siguiente acción, valor estimado
│   ├── proposals-sent.md                            # Rastreador de propuestas: cliente, fecha de envío, valor, estado, fecha de seguimiento, resultado
│   └── follow-up-schedule.md                       # Cola de seguimiento semanal: quién contactar, por qué, qué decir, canal (email / Slack / LinkedIn)
├── templates/
│   ├── proposal-template.md                         # Propuesta completa: resumen ejecutivo, problema, enfoque, entregables, cronograma, niveles de precios, próximos pasos
│   ├── sow-template.md                              # SOW: alcance, fuera de alcance, hitos con fechas, criterios de aceptación, calendario de pagos, política de revisión
│   ├── contract-template.md                         # MSA: asignación de IP, confidencialidad, términos de pago, tarifa de rescisión, terminación, ley aplicable
│   ├── invoice-template.md                          # Formato de factura: elementos de línea, términos de pago (Net 7/14/30), datos bancarios, enlace de pago Stripe
│   ├── nda-template.md                              # NDA mutuo para discusiones de descubrimiento previas a la propuesta
│   ├── status-update-template.md                    # Actualización semanal: hecho este período, en progreso, bloqueadores, necesidades del cliente, plan del próximo período
│   ├── project-brief-template.md                    # Formulario de descubrimiento para enviar a prospectos antes de scoping: objetivos, presupuesto, cronograma, stakeholders
│   └── feedback-request-template.md                 # Retroalimentación post-hito: preguntas específicas sobre calidad del entregable, alineación, revisiones necesarias
├── ops/
│   ├── rate-card.md                                 # Tarifas actuales: por hora, día, mínimos de proyecto, niveles de retainer — última revisión: 2026-Q2
│   ├── service-packages.md                          # Paquetes productizados: Brand Sprint, Site in a Week, UX Audit — alcance, precio, cronograma, inclusiones
│   ├── onboarding-checklist.md                      # Pasos desde contrato firmado hasta kickoff: acceso, herramientas, canal de Slack, llamada de kickoff, activos recibidos
│   ├── offboarding-checklist.md                     # Pasos al cierre de proyecto: entrega final, factura, solicitud de testimonial, derechos de portafolio, archivo de carpeta
│   ├── tools-and-access.md                          # Cada herramienta SaaS: nivel de plan, costo mensual, fecha de renovación, método de inicio de sesión
│   └── subcontractors.md                            # Subcontratistas de confianza: nombre, especialidad, tarifa, disponibilidad, estado de NDA, proyectos anteriores
├── finance/
│   ├── income-log.md                                # Mensual: cliente, número de factura, monto facturado, monto cobrado, pendiente, método
│   ├── expense-log.md                               # Fecha, proveedor, categoría (software / viaje / equipamiento), monto — para seguimiento de deducción fiscal
│   └── quarterly-tax-estimate.md                    # Cálculo de impuestos estimados Q1–Q4: ingresos brutos, gastos deducibles, impuesto de trabajo autónomo, fechas de pago, montos pagados
└── marketing/
    ├── case-studies/
    │   ├── acme-corp-brand-identity.md              # Problema, enfoque, resultado, métricas, cita de cliente — fuente para sitio web y propuestas
    │   ├── betaworks-site-redesign.md
    │   └── _case-study-template.md                  # Formato reutilizable: contexto, desafío, solución, resultado, testimonial
    ├── portfolio/
    │   ├── portfolio-index.md                        # Lista de proyectos seleccionados: cliente (anonimizado si NDA), tipo de entregable, enlace Figma/Framer, fecha
    │   └── selected-works/
    │       ├── brand-acme-2026.pdf                  # Entregable exportado para PDF de portafolio
    │       └── site-betaworks-2026.pdf
    └── testimonials/
        ├── testimonials-log.md                      # Nombre del cliente, cita, fecha, permiso para publicar, publicado en (sitio web / LinkedIn / propuesta)
        └── raw-feedback/
            ├── acme-corp-feedback-2026-06.md        # Email o respuesta de formulario de retroalimentación — material de origen para testimoniales
            └── gamma-dao-feedback-2026-03.md
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `.claude/commands/new-client-onboard.md` | Comando de barra inclinada que genera una lista de verificación de incorporación completa, redacta el email de bienvenida y construye una agenda de llamada de kickoff desde el brief del cliente firmado — ejecutar inmediatamente después de que se ejecute el contrato de HoneyBook |
| `.claude/commands/invoice-chase.md` | Comando de barra inclinada que produce una secuencia de seguimiento escalonada (recordatorio amigable en día 3, solicitud firme en día 7, aviso final con tarifa morosa en día 14) — requiere número de factura, monto y días vencidos |
| `.claude/commands/project-closeout.md` | Comando de barra inclinada que produce la lista de verificación de offboarding, redacta la factura final y escribe un email de solicitud de testimonial — ejecutar cuando se aprueba el entregable final |
| `clients/_template/` | Estructura de carpeta en blanco copiada para cada nuevo compromiso — garantiza documentación consistente en todo el trabajo del cliente; copiar con `cp -r clients/_template clients/<new-client-name>` |
| `templates/sow-template.md` | Formato SOW maestro incluyendo política de revisión, cláusula de tarifa de rescisión y lista explícita de fuera de alcance — la fuente de verdad para todas las conversaciones de alcance de proyecto |
| `pipeline/prospects.md` | Reemplazo de CRM para leads en fase temprana: empresa, contacto, puntuación de ajuste ICP (1–5), valor de acuerdo estimado, fecha de último contacto, siguiente acción — revisado cada lunes |
| `ops/rate-card.md` | Tarifas actuales con una fecha de última revisión — controla qué números aparecen en todas las propuestas redactadas por Claude; debe actualizarse antes de ejecutar `/proposal-draft` |
| `finance/quarterly-tax-estimate.md` | Cálculo de impuesto de trabajo autónomo actualizado al final de cada trimestre: ingresos brutos, gastos deducibles de SaaS y equipamiento, pago federal + estatal estimado debido, confirmación de pago enviado |

## Andamiaje rápido

```bash
# Crear la raíz del workspace
mkdir -p freelance-studio

# Estructura .claude
mkdir -p freelance-studio/.claude/commands

# Plantilla de cliente
mkdir -p freelance-studio/clients/_template/deliverables
mkdir -p freelance-studio/clients/_template/invoices
touch freelance-studio/clients/_template/deliverables/.gitkeep
touch freelance-studio/clients/_template/invoices/.gitkeep
touch freelance-studio/clients/_template/brief.md
touch freelance-studio/clients/_template/contract.md
touch freelance-studio/clients/_template/sow.md
touch freelance-studio/clients/_template/communication-log.md

# Pipeline
mkdir -p freelance-studio/pipeline
touch freelance-studio/pipeline/prospects.md
touch freelance-studio/pipeline/proposals-sent.md
touch freelance-studio/pipeline/follow-up-schedule.md

# Plantillas
mkdir -p freelance-studio/templates
touch freelance-studio/templates/proposal-template.md
touch freelance-studio/templates/sow-template.md
touch freelance-studio/templates/contract-template.md
touch freelance-studio/templates/invoice-template.md
touch freelance-studio/templates/nda-template.md
touch freelance-studio/templates/status-update-template.md
touch freelance-studio/templates/project-brief-template.md
touch freelance-studio/templates/feedback-request-template.md

# Ops
mkdir -p freelance-studio/ops
touch freelance-studio/ops/rate-card.md
touch freelance-studio/ops/service-packages.md
touch freelance-studio/ops/onboarding-checklist.md
touch freelance-studio/ops/offboarding-checklist.md
touch freelance-studio/ops/tools-and-access.md
touch freelance-studio/ops/subcontractors.md

# Finance
mkdir -p freelance-studio/finance
touch freelance-studio/finance/income-log.md
touch freelance-studio/finance/expense-log.md
touch freelance-studio/finance/quarterly-tax-estimate.md

# Marketing
mkdir -p freelance-studio/marketing/case-studies
mkdir -p freelance-studio/marketing/portfolio/selected-works
mkdir -p freelance-studio/marketing/testimonials/raw-feedback
touch freelance-studio/marketing/case-studies/_case-study-template.md
touch freelance-studio/marketing/portfolio/portfolio-index.md
touch freelance-studio/marketing/testimonials/testimonials-log.md

# Instalar skills
npx claudient add skill small-business/freelancer-proposal
npx claudient add skill small-business/scope-of-work
npx claudient add skill small-business/invoice-chaser
npx claudient add skill small-business/client-status-report
npx claudient add skill small-business/cold-outreach
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/vendor-evaluator

# Andamiaje de stubs de comando en .claude/commands/
npx claudient add skill small-business/freelancer-proposal --output freelance-studio/.claude/commands/proposal-draft.md
npx claudient add skill small-business/scope-of-work --output freelance-studio/.claude/commands/scope-of-work.md
npx claudient add skill small-business/invoice-chaser --output freelance-studio/.claude/commands/invoice-chase.md
npx claudient add skill small-business/client-status-report --output freelance-studio/.claude/commands/client-status-update.md
npx claudient add skill small-business/client-onboarding --output freelance-studio/.claude/commands/new-client-onboard.md
```

## Plantilla CLAUDE.md

```markdown
# Estudio Freelance — Instrucciones de Claude Code

## Qué es esto

Directorio de trabajo para un estudio freelance independiente que gestiona compromisos de diseño y estrategia con clientes,
pipeline de desarrollo comercial, facturación y operaciones. El trabajo del cliente vive en clients/ (una carpeta
por compromiso), prospectos abiertos y propuestas en pipeline/, documentos reutilizables en templates/,
registros financieros en finance/, y activos de portafolio y caso de estudio en marketing/. Todo el redacción,
generación de SOW, seguimiento de facturas, reportes de estado y alcance se ejecuta a través de comandos de barra inclinada en
.claude/commands/.

## Stack

- Notion — Seguimiento de proyectos por cliente; pega la URL de la página de Notion en clients/<name>/brief.md
- HoneyBook — Contratos e facturación; registra IDs de contrato de HoneyBook en clients/<name>/contract.md
- FreshBooks — Seguimiento de gastos y reconciliación fiscal; referencia cruzada con finance/income-log.md
- Cal.com — Programación; inserta enlace de reserva en templates/proposal-template.md y emails de bienvenida
- Loom — Walkthroughs de entregables asincrónicas; pega URLs de Loom en client-status-update y handoffs de SOW
- Figma — Entregables de diseño; comparte enlaces de solo lectura en archivos clients/<name>/deliverables/
- Framer — Entregas de prototipo y sitio sin código; registra URLs de staging en archivos clients/<name>/deliverables/
- Stripe — Procesamiento de pagos; registra IDs de cargo de Stripe en registros clients/<name>/invoices/
- Gmail — Comunicaciones principales con clientes; registra decisiones y acuerdos en clients/<name>/communication-log.md
- Slack — Canales de proyecto activos; cada cliente firmado obtiene un canal dedicado

## Flujo de incorporación de nuevo cliente

Ejecutar inmediatamente después de que se ejecute el contrato de HoneyBook y se reciba el depósito:

```
/new-client-onboard

Client: [nombre de empresa]
Contact: [nombre, título, email]
Project: [nombre de proyecto de SOW]
Start date: [fecha]
Slack channel: [#client-name-project]
Tools to grant access: [Notion, Figma, Framer staging — lista lo que aplica]
Cal.com link: [tu URL de reserva]
First deliverable: [nombre y fecha de entrega]
```

Esto produce: email de bienvenida, agenda de llamada de kickoff, lista de verificación de solicitud de acceso, y los
elementos ops/onboarding-checklist.md para marcar antes del primer día.

## Flujo de entrega de proyecto

1. Crear clients/<name>/ copiando clients/_template/ antes de la llamada de kickoff
2. Completar brief.md desde las notas de la llamada de descubrimiento; pega la URL del proyecto de Notion en la parte superior
3. Ejecutar /scope-of-work para generar sow.md — revisar antes de enviar al cliente
4. Los entregables van en clients/<name>/deliverables/ con nombres de archivo con prefijo de fecha (YYYY-MM-DD-name.ext)
5. Después de cada hito, ejecutar /client-status-update y registrar la URL de Loom en communication-log.md
6. Ejecutar /feedback-request después de cada entrega de hito — registrar respuestas en communication-log.md

## Proceso de factura y pago

- Todos los registros de factura van en clients/<name>/invoices/ como inv-NNN-description-YYYY-MM-DD.md
- Cada registro debe incluir: número de factura de HoneyBook o FreshBooks, monto, fecha de envío, fecha de vencimiento,
  ID de cargo de Stripe (una vez pagado), y fecha de pago (o "pendiente")
- Ejecutar /invoice-chase si el pago no se recibe dentro de 3 días de la fecha de vencimiento
- Registrar todos los ingresos cobrados en finance/income-log.md el mismo día que se despeja el pago de Stripe
- Actualizar finance/quarterly-tax-estimate.md al final de cada trimestre

## Seguimiento de tiempo y facturación

- La tarifa de tarjeta está en ops/rate-card.md — revisar trimestralmente y actualizar la fecha de última revisión
- Trabajo por hora: registra el tiempo en clients/<name>/communication-log.md como una tabla en ejecución (fecha, tarea, horas)
- Trabajo de proyecto: facturar contra los hitos definidos en clients/<name>/sow.md — nunca facturar antes de la entrega
- Clientes con retainer: emitir la factura de retainer el 1º de cada mes a través de HoneyBook
- Tarifa de rescisión: 25% del valor de proyecto restante si el cliente cancela después del kickoff — indicado en contract-template.md

## Tareas comunes y comandos exactos

### Redactar una propuesta desde un brief del cliente
```
/proposal-draft

Client: [nombre de empresa]
Contact: [nombre, título]
Brief: [pega notas de descubrimiento o brief completo]
Budget: [$X–$Y o "TBD"]
Timeline: [fecha de inicio objetivo y duración]
Deliverables requested: [lista lo que pidieron]
My angle: [por qué soy el ajuste correcto — sé específico]
Pricing preference: [tarifa fija / retainer / híbrido]
```

### Generar un SOW desde una propuesta firmada
```
/scope-of-work

Client: [nombre de empresa]
Project: [nombre de proyecto]
Agreed deliverables: [lista exacta — copiar de propuesta aprobada]
Timeline: [inicio, fechas de hito, fecha de fin]
Payment schedule: [50% depósito / 25% hito 1 / 25% completación]
Revision rounds: [cuántas rondas por entregable]
Exclusions: [elementos explícitos fuera de alcance]
```

### Escribir un seguimiento de factura
```
/invoice-chase

Client: [nombre de empresa]
Invoice number: [INV-XXX]
Amount: [$X]
Due date: [YYYY-MM-DD]
Days overdue: [N]
Prior contact: [ninguno / sí — fecha del último seguimiento]
Tone: [amigable / firme / aviso final]
```

### Enviar una actualización de estado del cliente
```
/client-status-update

Client: [nombre de empresa]
Period: [semana de YYYY-MM-DD / hito: X]
Completed: [lista de viñetas de lo que se envió]
In progress: [qué está en camino]
Blockers: [qué necesito del cliente]
Next period plan: [qué sucede después]
Format: [email / script de Loom / actualización de Notion]
```

### Cerrar un proyecto
```
/project-closeout

Client: [nombre de empresa]
Final deliverable: [nombre y fecha de entrega]
Outstanding invoices: [números de factura y montos]
Portfolio rights: [confirmado en contrato? sí/no]
Testimonial: [ha acordado el cliente proporcionar uno? sí/no/ask]
```

## Convenciones

- Cada nuevo cliente obtiene una carpeta bajo clients/ antes de la llamada de kickoff — siempre copiar _template/
- Nombres de archivo de entregables: YYYY-MM-DD-description-vN.ext (p.ej., 2026-06-01-wireframes-v2.fig)
- proposals-sent.md en pipeline/ se actualiza el mismo día que se envía una propuesta
- Mover propuestas ganadas: crear clients/<name>/ y archivar el archivo de propuesta allí
- finance/income-log.md se actualiza el último día hábil de cada mes — sin excepciones
- finance/expense-log.md se actualiza semanalmente — registra todo más de $15 para propósitos fiscales
- ops/rate-card.md siempre muestra una fecha de última revisión — actualizar antes de usar /proposal-draft
- marketing/testimonials/testimonials-log.md se actualiza dentro de una semana de recibir cualquier retroalimentación
```

## Servidores MCP

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/your-username/freelance-studio"
      ]
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
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@googleapis/mcp-server-google-drive"],
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
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/mcp-server-notion"],
      "env": {
        "NOTION_API_KEY": "secret_your-notion-integration-token"
      }
    },
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp-server-stripe"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_live_your-stripe-secret-key",
        "STRIPE_WEBHOOK_SECRET": "whsec_your-webhook-secret"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -qE \"clients/.+/deliverables/\"; then echo \"[hook] Deliverable saved — update clients/<name>/communication-log.md with the delivery date and share the Loom walkthrough link\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"pipeline/proposals-sent.md\"; then echo \"[hook] Proposal tracker updated — set a Cal.com follow-up reminder 5 business days out and log next action in follow-up-schedule.md\"; fi'"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -qE \"clients/.+/sow.md\"; then echo \"[hook] Writing SOW — confirm clients/<name>/brief.md and contract.md exist and ops/rate-card.md has a current last-reviewed date before finalising scope\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'TODAY=$(date +%A); if [ \"$TODAY\" = \"Friday\" ]; then echo \"[reminder] Friday — run /weekly-wrap, check finance/income-log.md for outstanding invoices, and review pipeline/follow-up-schedule.md for Monday outreach\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills para instalar

```bash
# Skills principales del estudio
npx claudient add skill small-business/freelancer-proposal
npx claudient add skill small-business/scope-of-work
npx claudient add skill small-business/invoice-chaser
npx claudient add skill small-business/client-status-report
npx claudient add skill small-business/cold-outreach

# Skills de productividad y comunicación
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/exec-briefing

# Instalar todos los skills small-business de una vez
npx claudient add skills small-business
```

## Relacionado

- [Guía para freelancer](../guides/for-freelancer.md)
- [Flujo de trabajo de incorporación de cliente](../workflows/client-onboarding.md)
- [Flujo de trabajo propuesta a contrato](../workflows/proposal-to-contract.md)
- [Flujo de trabajo de factura y facturación](../workflows/invoice-and-billing.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
