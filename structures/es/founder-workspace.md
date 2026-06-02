# Espacio de Trabajo del Fundador / CEO — Estructura del Proyecto

> Para un fundador de startup que gestiona estrategia, recaudación de fondos, contratación y operaciones diarias — actualizaciones de inversores, preparación de junta directiva, decisiones de contratación, OKRs, pipeline de recaudación de fondos y salud financiera impulsados desde un único espacio de trabajo de Claude Code.

## Stack

- Notion — documentos de estrategia, wikis del equipo, OKRs, materiales de junta directiva
- Linear — hoja de ruta del producto, seguimiento de sprint, hitos de ingeniería
- HubSpot o Attio — CRM de inversores, etapas de pipeline, seguimiento de relaciones
- Gusto o Rippling — RRHH, nómina, cartas de oferta, registros de personal
- Mercury — banca empresarial, flujo de caja, seguimiento de gastos
- Carta — tabla de capitalización, asignación de acciones, valoraciones 409A, seguimiento de SAFE/nota
- Slack — comunicación del equipo, actualizaciones de inversores de forma asincrónica, canales de contratación
- Google Workspace — correo electrónico, documentos compartidos, sala de datos (Google Drive)

## Árbol de directorios

```
founder-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Instrucciones del espacio de trabajo para Claude Code
│   ├── settings.json                          # Permisos, hooks, configuración del servidor MCP
│   └── commands/
│       ├── investor-update.md                 # Redactar actualización de inversor semanal o mensual por correo electrónico
│       ├── board-prep.md                      # Compilar narrativa de junta directiva, agenda, pre-lecturas
│       ├── hiring-decision.md                 # Evaluar candidato, resumen de puntuación, recomendación contratar/no contratar
│       ├── okr-review.md                      # Calificar OKRs actuales, identificar bloqueadores, borrador del próximo trimestre
│       ├── weekly-brief.md                    # Breve semanal del CEO — logros, fallos, prioridades, solicitudes
│       ├── fundraising-status.md              # Snapshot del pipeline de recaudación de fondos, próximos pasos, salud de la ronda
│       └── competitive-pulse.md               # Actualización del panorama competitivo — triaje de señales, memo de respuesta
├── strategy/
│   ├── north-star-metric.md                   # Métrica de éxito primaria, definición, valor actual, objetivo
│   ├── company-okrs-2025.md                   # OKRs anuales — objetivos, resultados clave, propietarios, calificaciones
│   ├── company-okrs-q3-2025.md                # Conjunto de OKRs trimestral con notas de control a mitad de trimestre
│   ├── annual-plan-2025.md                    # Plan operativo anual — personal, presupuesto, hitos por departamento
│   ├── strategic-bets.md                      # 3–5 apuestas estratégicas con razonamiento y criterios de éxito
│   ├── competitive-landscape.md               # Matriz de competidores — posicionamiento, precios, fortalezas, riesgos
│   ├── market-map.md                          # Análisis TAM/SAM/SOM, desglose de segmentos, dimensionamiento del mercado
│   └── positioning-doc.md                     # ICP, propuestas de valor, diferenciación, pilares de mensajería
├── fundraising/
│   ├── round-tracker.md                       # Estado de la ronda actual — objetivo, recaudado, fecha de cierre, líder
│   ├── investor-pipeline.md                   # Lista completa de inversores — etapa, último contacto, próximo paso, notas
│   ├── term-sheet-tracker.md                  # Cartas de términos recibidas — términos clave, comparación, registro de decisiones
│   ├── pitch-deck-v7.md                       # Narrativa de la presentación actual (exportación de Notion o esquema)
│   ├── data-room/
│   │   ├── data-room-index.md                 # Índice de todos los documentos de sala de datos con registro de acceso
│   │   ├── cap-table-summary.md               # Snapshot de tabla de capitalización de Carta — propiedad %, modelo de dilución
│   │   ├── financial-model-q2-2025.xlsx       # Modelo financiero — P&L, tiempo de ejecución, economía unitaria
│   │   ├── corporate-docs-checklist.md        # Constitución, asignación de IP, 409A, auditorías — lista de estado
│   │   └── customer-references.md             # Clientes de referencia — contacto, nivel, NPS, disponibilidad
│   └── investor-crm/
│       ├── crm-export-2025-06.csv             # Exportación de pipeline de HubSpot/Attio — snapshot más reciente
│       ├── warm-intros-needed.md              # Inversores que requieren introducción cálida — quién puede hacerla
│       └── post-meeting-notes/
│           ├── a16z-partner-2025-05-14.md     # Notas posteriores a la reunión — sentimiento, preguntas, próximo paso
│           ├── sequoia-scout-2025-05-21.md    # Notas posteriores a la reunión
│           └── notable-capital-2025-06-01.md  # Notas posteriores a la reunión
├── hiring/
│   ├── headcount-plan-2025.md                 # Personal aprobado por la junta — función, equipo, trimestre, presupuesto
│   ├── open-roles.md                          # Requisiciones activas — estado de JD, reclutador, recuento de pipeline
│   ├── job-descriptions/
│   │   ├── head-of-growth.md                  # JD — Director de Crecimiento / VP de Marketing
│   │   ├── senior-engineer-fullstack.md       # JD — Ingeniero Senior Full-Stack
│   │   ├── chief-of-staff.md                  # JD — Jefe de Personal / Responsable de Operaciones
│   │   └── account-executive.md               # JD — Ejecutivo de Cuenta (SMB)
│   ├── scorecards/
│   │   ├── scorecard-template.md              # Plantilla de tarjeta de puntuación de entrevista canónica
│   │   ├── eng-scorecard.md                   # Tarjeta de puntuación — roles de ingeniería
│   │   ├── gtm-scorecard.md                   # Tarjeta de puntuación — roles de ventas y marketing
│   │   └── leadership-scorecard.md            # Tarjeta de puntuación — nivel director y VP
│   ├── offer-templates/
│   │   ├── offer-letter-template.md           # Plantilla de carta de oferta estándar
│   │   ├── equity-grant-explainer.md          # Explicación de acciones en lenguaje sencillo para candidatos
│   │   └── comp-bands-2025.md                 # Bandas de compensación por función y nivel
│   └── pipeline-notes/
│       ├── active-candidates.md               # Candidatos actuales — función, etapa, próximo paso, fecha de decisión
│       └── offers-log.md                      # Historial de ofertas — función, compensación, acciones, aceptadas/rechazadas
├── board/
│   ├── board-composition.md                   # Miembros actuales de la junta — firma, tipo de puesto, término, comités
│   ├── board-calendar-2025.md                 # Cronograma de reuniones, asistentes esperados, agenda recurrente
│   ├── materials/
│   │   ├── 2025-q1-board-deck.md              # Narrativa de junta directiva Q1 y métricas clave
│   │   ├── 2025-q2-board-deck.md              # Narrativa de junta directiva Q2 (actual)
│   │   └── ceo-letter-q2-2025.md              # Carta del CEO a la junta — contexto franco y solicitudes
│   ├── minutes/
│   │   ├── minutes-2025-03-15.md              # Actas de reunión de junta directiva — revisión Q1
│   │   └── minutes-2025-06-10.md              # Actas de reunión de junta directiva — revisión Q2
│   └── resolutions/
│       ├── resolution-option-grant-2025-05.md # Resolución de junta directiva — concesión de opciones
│       └── resolution-financing-2025-06.md    # Resolución de junta directiva — autorización de financiamiento
├── finance/
│   ├── runway-model.md                        # Análisis de tiempo de ejecución — tasa de quemado, meses de ejecución, escenarios
│   ├── cash-flow-forecast-q3-2025.md          # Previsión de flujo de caja de 13 semanas
│   ├── unit-economics.md                      # CAC, LTV, período de recuperación, margen bruto por segmento
│   ├── monthly-financials/
│   │   ├── p-and-l-2025-05.md                 # P&L de mayo — reales vs presupuesto
│   │   ├── p-and-l-2025-04.md                 # P&L de abril
│   │   └── balance-sheet-2025-05.md           # Snapshot de balance de mayo
│   ├── budget-2025.md                         # Presupuesto de año completo — gastos operativos, personal, capex por departamento
│   └── mercury-transactions-2025-06.csv       # Exportación bancaria de Mercury — transacciones del mes actual
├── product/
│   ├── product-roadmap-q3-2025.md             # Hoja de ruta trimestral — iniciativas, propietarios, hitos
│   ├── product-vision.md                      # Visión del producto a 2 años — hacia dónde vamos y por qué
│   ├── prds/
│   │   ├── prd-template.md                    # Plantilla PRD canónica
│   │   ├── prd-onboarding-revamp.md           # PRD — rediseño de flujo de incorporación
│   │   └── prd-api-v2.md                      # PRD — API pública v2
│   ├── launch-plans/
│   │   ├── launch-api-v2.md                   # Plan de lanzamiento — estrategia de comercialización de API v2
│   │   └── launch-mobile-app.md               # Plan de lanzamiento — versión beta de aplicación móvil
│   └── metrics/
│       ├── product-kpis.md                    # KPIs principales del producto — DAU, activación, retención, NPS
│       └── feature-adoption.md                # Datos de adopción a nivel de función e información
└── comms/
    ├── investor-updates/
    │   ├── update-template.md                 # Plantilla de actualización de inversor — logros, métricas, solicitudes
    │   ├── update-2025-05.md                  # Actualización de mayo (enviada)
    │   └── update-2025-06-draft.md            # Actualización de junio (borrador)
    ├── all-hands/
    │   ├── all-hands-template.md              # Plantilla de agenda y narrativa de reunión de todos
    │   ├── all-hands-2025-06-notes.md         # Notas de reunión de todos de junio y preguntas y respuestas
    │   └── all-hands-2025-03-notes.md         # Notas de reunión de todos de marzo
    └── external/
        ├── press-release-template.md          # Plantilla de comunicado de prensa para anuncios de financiamiento y lanzamientos
        └── founder-bio.md                     # Biografía actual del fundador — versiones larga y corta
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `.claude/commands/investor-update.md` | Comando de barra inclinada que lee `finance/runway-model.md`, `strategy/company-okrs-q3-2025.md` y `comms/investor-updates/update-template.md` para redactar una actualización completa de inversor con métricas, logros, fallos y solicitudes |
| `.claude/commands/board-prep.md` | Comando de barra inclinada que compila `finance/monthly-financials/`, `strategy/company-okrs-*.md` y `product/product-roadmap-*.md` en una narrativa de junta directiva y agenda |
| `.claude/commands/fundraising-status.md` | Comando de barra inclinada que lee `fundraising/investor-pipeline.md` y `fundraising/round-tracker.md` para producir un snapshot de salud de pipeline y acciones sugeridas |
| `fundraising/data-room/financial-model-q2-2025.xlsx` | Modelo financiero de fuente única de verdad — P&L, tiempo de ejecución, economía unitaria y plan de personal; referenciado en juntas directivas y debida diligencia |
| `strategy/company-okrs-2025.md` | Documento de OKR anual con desglose trimestral, propietarios de resultados clave y rúbrica de calificación — actualizado cada trimestre |
| `finance/runway-model.md` | Análisis de tiempo de ejecución actual con tasa de quemado actual, saldo de efectivo, escenarios de contratación y meses hasta cero en cada nivel de quemado |
| `hiring/comp-bands-2025.md` | Bandas de compensación internas por función y nivel — utilizado para validar ofertas e informar el presupuesto de personal |
| `board/materials/ceo-letter-q2-2025.md` | Carta franca del CEO a la junta — contexto detrás de las métricas, riesgos y solicitudes explícitas no incluidas en la presentación |
| `fundraising/investor-pipeline.md` | Lista completa de seguimiento de inversores con etapa, fecha de último contacto, propietario de relación, estado de introducción cálida y próxima acción |
| `comms/investor-updates/update-template.md` | Formato canónico de actualización de inversor — tabla de métricas, aspectos destacados comerciales, actualizaciones del equipo, información financiera y sección de solicitudes |

## Andamiaje rápido

```bash
# Crear la raíz del espacio de trabajo
mkdir -p founder-workspace
cd founder-workspace

# Crear estructura .claude
mkdir -p .claude/commands

# Crear todos los directorios del espacio de trabajo
mkdir -p strategy
mkdir -p fundraising/data-room
mkdir -p fundraising/investor-crm/post-meeting-notes
mkdir -p hiring/job-descriptions
mkdir -p hiring/scorecards
mkdir -p hiring/offer-templates
mkdir -p hiring/pipeline-notes
mkdir -p board/materials
mkdir -p board/minutes
mkdir -p board/resolutions
mkdir -p finance/monthly-financials
mkdir -p product/prds
mkdir -p product/launch-plans
mkdir -p product/metrics
mkdir -p comms/investor-updates
mkdir -p comms/all-hands
mkdir -p comms/external

# Sembrar archivos clave
touch strategy/north-star-metric.md
touch strategy/company-okrs-2025.md
touch strategy/competitive-landscape.md
touch fundraising/round-tracker.md
touch fundraising/investor-pipeline.md
touch fundraising/term-sheet-tracker.md
touch fundraising/data-room/data-room-index.md
touch hiring/headcount-plan-2025.md
touch hiring/open-roles.md
touch hiring/scorecards/scorecard-template.md
touch hiring/offer-templates/comp-bands-2025.md
touch hiring/pipeline-notes/active-candidates.md
touch board/board-composition.md
touch board/board-calendar-2025.md
touch finance/runway-model.md
touch finance/cash-flow-forecast-q3-2025.md
touch finance/unit-economics.md
touch finance/budget-2025.md
touch product/product-roadmap-q3-2025.md
touch product/product-vision.md
touch product/prds/prd-template.md
touch product/metrics/product-kpis.md
touch comms/investor-updates/update-template.md
touch comms/all-hands/all-hands-template.md

# Instalar habilidades de Claude Code
npx claudient add skill productivity/founder-weekly-review
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/engineering-strategy
npx claudient add skill finance/pitch-deck
npx claudient add skill finance/financial-plan
npx claudient add skill small-business/cash-flow-forecast
npx claudient add skill small-business/hiring-pipeline

# Instalar comandos de barra inclinada
npx claudient add command investor-update
npx claudient add command board-prep
npx claudient add command hiring-decision
npx claudient add command okr-review
npx claudient add command weekly-brief
npx claudient add command fundraising-status
npx claudient add command competitive-pulse
```

## Plantilla CLAUDE.md

```markdown
# Espacio de Trabajo del Fundador / CEO

Este espacio de trabajo apoya a un fundador de startup que gestiona estrategia, recaudación de fondos, contratación y operaciones diarias. Claude Code lee el contexto de archivos estructurados en este repositorio para producir resultados precisos y específicos de la empresa, no consejos genéricos para startups.

---

## Qué es esto

Un espacio de trabajo de Claude Code para un fundador o CEO. Cada directorio se asigna a una responsabilidad principal: pipeline de recaudación de fondos, gestión de junta directiva, contratación, salud financiera, hoja de ruta del producto y comunicaciones externas. Claude lee de estos archivos y escribe borradores, análisis y decisiones de vuelta en la misma estructura.

---

## Stack

- Notion — documentos de estrategia, wikis del equipo, OKRs (MCP: notion)
- Linear — hoja de ruta del producto y seguimiento de sprint (MCP: linear)
- HubSpot o Attio — CRM de inversores y pipeline de recaudación de fondos
- Gusto o Rippling — RRHH, nómina y gestión de ofertas
- Mercury — banca empresarial y flujo de caja
- Carta — tabla de capitalización, asignación de acciones y seguimiento de SAFE
- Slack — comunicación del equipo y actualizaciones de inversores de forma asincrónica (MCP: slack)
- Google Workspace — sala de datos (Drive), correo electrónico, documentos compartidos

---

## Convenciones de directorios

- `strategy/` — OKRs de la empresa, estrella del norte, plan anual, panorama competitivo. Los archivos de OKR se nombran por año y trimestre. Nunca elimines archivos de OKR antiguos — son el registro de calificación.
- `fundraising/` — Rastreador de ronda, pipeline de inversores y sala de datos. `investor-pipeline.md` es la fuente única de verdad para todas las relaciones con inversores. Las notas posteriores a las reuniones van en `investor-crm/post-meeting-notes/` nombradas `firm-YYYY-MM-DD.md`.
- `hiring/` — Todos los activos de contratación. Las bandas de compensación en `offer-templates/comp-bands-2025.md` son confidenciales — nunca incluyas en juntas directivas o actualizaciones de inversores.
- `board/` — Materiales, actas y resoluciones de junta directiva. Las actas se archivan después de cada reunión. Las resoluciones requieren la firma de un miembro de la junta antes de ser archivadas.
- `finance/` — Modelo de tiempo de ejecución, flujo de caja, P&L y presupuesto. `runway-model.md` se actualiza cada vez que cambia la tasa de quemado o el personal. Los archivos de P&L mensual se nombran `p-and-l-YYYY-MM.md`.
- `product/` — Hoja de ruta, PRDs y planes de lanzamiento. Una PRD por función. Los archivos de hoja de ruta se nombran por trimestre. `product-vision.md` es un documento estable de 2 años, no un plan de sprint.
- `comms/` — Actualizaciones de inversores y notas de reunión de todos. Las actualizaciones de inversores enviadas nunca se editan. Los borradores tienen el sufijo `-draft.md` hasta que se envíen.

---

## Tareas comunes — comandos exactos

### Recaudación de fondos
```
/investor-update       — Redactar actualización de inversor a partir de métricas, OKRs y aspectos destacados del mes pasado
/fundraising-status    — Snapshot de pipeline: etapas, acuerdos estancados, próximas acciones, salud de la ronda
```

### Gestión de junta directiva
```
/board-prep            — Compilar narrativa de junta directiva, agenda, carta del CEO y lista de pre-lecturas
```

### Contratación
```
/hiring-decision       — Evaluar un candidato: resumen de tarjeta de puntuación, recomendación contratar/no contratar
```

### Estrategia y OKRs
```
/okr-review            — Calificar OKRs actuales, identificar bloqueadores, redactar objetivos del próximo trimestre
/competitive-pulse     — Filtrar señales de competidor, actualizar documento de panorama, redactar memo de respuesta
```

### Ritmo semanal
```
/weekly-brief          — Breve semanal del CEO: logros, fallos, principales prioridades, bloqueadores, solicitudes
```

---

## Convenciones que Claude debe seguir

- Extrae cifras financieras de `finance/runway-model.md` y `finance/monthly-financials/` únicamente. No fabricar ni estimar números.
- Las etapas del pipeline de inversores en `fundraising/investor-pipeline.md` son la fuente única de verdad. No las contradijas en reportes de estado de recaudación de fondos.
- Las bandas de compensación en `hiring/offer-templates/comp-bands-2025.md` son confidenciales. Nunca las incluyas en actualizaciones de inversores, juntas directivas o cualquier documento que abandone el espacio de trabajo.
- Las calificaciones de OKR utilizan una escala de 0.0–1.0. 0.7 es un resultado sólido. 1.0 significa que el objetivo era demasiado bajo.
- Los materiales de junta directiva se redactan 5 días hábiles antes de cada fecha de reunión en `board/board-calendar-2025.md`.
- Las notas de inversores posteriores a las reuniones deben incluir: sentimiento (positivo/neutral/cauteloso), preguntas clave formuladas, objeciones planteadas y próximo paso explícito con propietario y fecha.
- Todas las actualizaciones de inversores siguen la plantilla en `comms/investor-updates/update-template.md`. No cambies el orden de secciones ni omitas la sección de solicitudes.
```

## Servidores MCP

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-notion"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
      }
    },
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "${LINEAR_API_KEY}"
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
        "/Users/you/founder-workspace"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"comms/investor-updates/\" && ! echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"draft\"; then echo \"[Investor update hook] Actualización de inversor archivada — confirma que ha sido enviada a tu lista de inversores y archivada.\"; fi'"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"hiring/offer-templates/comp-bands\"; then echo \"[Confidential hook] ADVERTENCIA: comp-bands-2025.md es confidencial. Confirma que este resultado no está destinado a un documento de inversor o junta directiva.\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"[Session end] Si actualizaste fundraising/investor-pipeline.md o finance/runway-model.md, confirma que los cambios se guardaron y reflejan la fecha actual.\"'"
          }
        ]
      }
    ]
  }
}
```

## Habilidades a instalar

```bash
npx claudient add skill productivity/founder-weekly-review
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/engineering-strategy
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/comp-benchmarker
npx claudient add skill finance/pitch-deck
npx claudient add skill finance/financial-plan
npx claudient add skill small-business/cash-flow-forecast
npx claudient add skill small-business/hiring-pipeline
```

## Relacionado

- [Guía: Claude para Fundadores y CEOs](../guides/for-founder.md)
- [Flujo de trabajo: Pipeline de Recaudación de Fondos](../workflows/fundraising-pipeline.md)
- [Flujo de trabajo: Preparación de Reunión de Junta Directiva](../workflows/board-meeting-prep.md)
- [Flujo de trabajo: Revisión Semanal del CEO](../workflows/founder-weekly-review.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
