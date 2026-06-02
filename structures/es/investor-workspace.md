# Espacio de trabajo del inversor / VC — Estructura del proyecto

> Para un capital de riesgo o inversor ángel que gestione el flujo de transacciones, debida diligencia, monitoreo de cartera y relaciones con LP a través de una canalización estructurada de sourcing, notas de IC y reportes trimestrales.

## Stack

- **Notion** o **Airtable** — CRM de transacciones, kanban de canalización, rastreador de cartera, base de datos de empresas
- **Carta** — Gestión de tabla de capitalización, seguimiento de capital, derechos pro-rata, modelado del fondo de opciones
- **AngelList** o **Visible** — Reportes de LP, paneles de rendimiento del fondo, actualizaciones de inversores
- **QuickBooks** — Contabilidad del fondo, seguimiento de honorarios de gestión, cálculos de interés devengado
- **Pitchbook** o **Crunchbase** — Datos de mercado, conjuntos comparables, puntos de referencia de valuación, mapeo de sectores
- **Slack** — Canales de fundadores, hilos de coinversores, discusión asincrónica de IC, canales de sala de transacciones
- **Google Workspace** — Drive para documentos de debida diligencia, Sheets para seguimiento de KPI, Docs para notas
- **Claude Code** — Cribado de transacciones, redacción de notas de IC, monitoreo de cartera, generación de reportes de LP

## Árbol de directorios

```
investor-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Instrucciones del espacio de trabajo (pega la plantilla abajo)
│   ├── settings.json                          # Servidores MCP, hooks, permisos
│   └── commands/
│       ├── deal-screen.md                     # /deal-screen — toma URL de empresa o deck, genera triaje estructurado
│       ├── ic-memo.md                         # /ic-memo — notas completas de Comité de Inversión de notas de diligencia
│       ├── portfolio-update.md                # /portfolio-update — narrativa mensual de KPI de métricas brutas
│       ├── lp-report.md                       # /lp-report — carta trimestral de LP con resumen de rendimiento del fondo
│       ├── founder-update.md                  # /founder-update — respuesta estructurada a actualización mensual del fundador
│       ├── market-thesis.md                   # /market-thesis — documento de tesis de sector de insumos de investigación
│       └── due-diligence.md                   # /due-diligence — lista de verificación completa + síntesis de hallazgos
├── pipeline/
│   ├── sourcing/                              # Clientes potenciales entrantes y salientes aún no reunidos
│   │   ├── _template/
│   │   │   └── initial-screen.md              # Formulario de cribado en blanco — empresa, etapa, ajuste de tesis, fuente
│   │   ├── acme-ai/
│   │   │   └── initial-screen.md              # Cribado de primer paso: tracción, equipo, mercado, solicitud
│   │   ├── beta-biotech/
│   │   │   └── initial-screen.md
│   │   └── gamma-fintech/
│   │       └── initial-screen.md
│   ├── first-meeting/                         # Cribado aprobado — primera llamada con fundador programada o completada
│   │   ├── delta-robotics/
│   │   │   ├── initial-screen.md              # Notas de cribado llevadas del sourcing
│   │   │   └── first-meeting-notes.md         # Notas brutas de llamada — antecedentes del fundador, producto, solicitud, señales
│   │   └── epsilon-health/
│   │       ├── initial-screen.md
│   │       └── first-meeting-notes.md
│   ├── diligence/                             # Debida diligencia activa — verificaciones de referencias más profundas, financieras, técnicas
│   │   ├── zeta-infra/
│   │   │   ├── initial-screen.md
│   │   │   ├── first-meeting-notes.md
│   │   │   ├── diligence-tracker.md           # Elementos abiertos, propietarios, plazos en todos los flujos de trabajo
│   │   │   ├── financial-review.md            # Análisis del modelo de ingresos, economía unitaria, burn, análisis de runway
│   │   │   ├── tech-audit-notes.md            # Revisión de arquitectura, escalabilidad, postura de seguridad
│   │   │   ├── reference-checks/              # Transcripciones de verificación de referencias estructuradas
│   │   │   │   ├── ref-cto-john-doe.md
│   │   │   │   └── ref-customer-acme.md
│   │   │   └── data-room/                     # Reflejo de documentos compartidos por fundador
│   │   │       ├── .gitkeep
│   │   │       └── cap-table-summary.md       # Resumen de tabla de capitalización extraído de exportación de Carta
│   │   └── eta-saas/
│   │       ├── diligence-tracker.md
│   │       ├── financial-review.md
│   │       └── reference-checks/
│   │           └── .gitkeep
│   ├── ic/                                    # Nota de IC completa — pendiente de votación del Comité de Inversión
│   │   └── theta-marketplace/
│   │       ├── ic-memo.md                     # Nota final de IC — tesis de inversión, riesgos, términos, recomendación
│   │       ├── diligence-tracker.md
│   │       ├── financial-review.md
│   │       └── comps-analysis.md              # Empresas comparables públicas y privadas, puntos de referencia de valuación
│   ├── closed/                                # Inversiones realizadas — mover a portfolio/ después del cierre
│   │   └── iota-logistics/
│   │       ├── ic-memo.md
│   │       ├── closing-checklist.md           # Confirmación de transferencia, actualización de Carta, seguimiento pro-rata
│   │       └── post-close-intro.md            # Correo electrónico de introducción post-cierre a recursos de cartera
│   └── passed/                                # Transacciones rechazadas con justificación de rechazo para referencia futura
│       ├── kappa-crypto/
│       │   ├── initial-screen.md
│       │   └── pass-rationale.md              # Por qué nos negamos — desajuste de tesis, valuación, equipo, tiempo de mercado
│       └── lambda-hr-tech/
│           ├── initial-screen.md
│           └── pass-rationale.md
├── portfolio/                                 # Una carpeta por empresa activa de cartera
│   ├── _template/                             # Copiar esto al cerrar una nueva inversión
│   │   ├── memo.md                            # Nota de IC (copiada de pipeline/closed/)
│   │   ├── cap-table.md                       # Propiedad %, acciones, fondo de opciones, términos de última ronda
│   │   ├── kpis.md                            # Registro mensual de KPI — ARR, crecimiento, burn, headcount, NRR
│   │   ├── updates/                           # Actualizaciones mensuales del fundador, archivadas cronológicamente
│   │   │   └── .gitkeep
│   │   └── board-notes/                       # Preparación de junta directiva y notas posteriores a la junta
│   │       └── .gitkeep
│   ├── acme-series-a/                         # Empresa de cartera real (transacción cerrada, ahora activa)
│   │   ├── memo.md                            # Nota original de IC
│   │   ├── cap-table.md                       # Resumen de tabla de capitalización actual desde Carta
│   │   ├── kpis.md                            # Tabla de KPI en ejecución actualizada mensualmente
│   │   ├── updates/
│   │   │   ├── 2026-05-update.md              # Actualización de mayo de 2026 — anotada con aspectos destacados
│   │   │   └── 2026-04-update.md
│   │   └── board-notes/
│   │       ├── 2026-05-board-prep.md          # Esquema de deck de junta, agenda, preguntas a plantear
│   │       └── 2026-05-board-notes.md         # Elementos de acción posteriores a la junta y decisiones
│   └── beta-seed/
│       ├── memo.md
│       ├── cap-table.md
│       ├── kpis.md
│       ├── updates/
│       │   └── 2026-05-update.md
│       └── board-notes/
│           └── .gitkeep
├── memos/                                     # Todas las notas de inversión, notas de rechazo, notas de transacciones en un lugar
│   ├── ic-memos/                              # Notas del Comité de Inversión (transacciones aprobadas)
│   │   ├── 2026-05-acme-series-a.md
│   │   └── 2026-03-beta-seed.md
│   ├── deal-memos/                            # Resúmenes de transacciones más cortos para primera reunión o debida diligencia temprana
│   │   ├── 2026-06-zeta-infra-brief.md
│   │   └── 2026-05-eta-saas-brief.md
│   └── pass-memos/                            # Justificación de rechazo documentada — búsqueda para futura coincidencia de patrones
│       ├── 2026-05-kappa-crypto-pass.md
│       └── 2026-04-lambda-hr-tech-pass.md
├── lp/                                        # Materiales para LP y seguimiento del rendimiento del fondo
│   ├── quarterly-reports/
│   │   ├── 2026-q1-lp-report.md              # Carta LP de Q1 2026 — rendimiento del fondo, aspectos destacados de cartera
│   │   └── 2025-q4-lp-report.md
│   ├── annual-reports/
│   │   └── 2025-annual-report.md             # Resumen anual del fondo — TIR, DPI, RVPI, mejores rendimientos
│   ├── fund-performance/
│   │   ├── nav-tracker.md                     # Valor Neto de Activos por trimestre — valores de cartera marcados
│   │   └── cash-flow-log.md                  # Solicitudes de capital, distribuciones, extracciones de honorarios de gestión
│   └── lp-communications/
│       ├── capital-call-notice-template.md    # Aviso de solicitud de capital estándar con instrucciones de transferencia
│       └── distribution-notice-template.md   # Formato de aviso de distribución para salidas realizadas
├── thesis/                                    # Tesis de mercado e investigación de sectores
│   ├── ai-infrastructure-thesis.md           # Tesis completa de sector — mapa de mercado, tiempo, perfil objetivo
│   ├── climate-tech-thesis.md
│   ├── fintech-thesis.md
│   └── sector-notes/                          # Notas de investigación brutas que alimentan documentos de tesis
│       ├── ai-infra-market-data.md
│       └── climate-founding-team-patterns.md
├── diligence/                                 # Plantillas de debida diligencia reutilizables y listas de verificación
│   ├── reference-check-template.md           # Guía de entrevista de referencia estructurada — 12 preguntas estándar
│   ├── financial-review-checklist.md         # Lista de verificación de debida diligencia financiera — modelo, suposiciones, banderas rojas
│   ├── tech-audit-template.md                # Guía de debida diligencia técnica — arquitectura, seguridad, escalabilidad
│   ├── legal-review-checklist.md             # Debida diligencia legal — propiedad intelectual, empleo, contratos, litigio
│   └── founder-background-check.md           # Historial del fundador, referencias, verificación de LinkedIn
└── scratch/
    ├── weekly-deal-notes.md                  # Área de preparación informal para notas antes de archivar en canalización
    └── research-staging.md                   # Clips de investigación de mercado brutos antes de formatear en documentos de tesis
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `.claude/commands/deal-screen.md` | Comando Slash que acepta una URL de empresa, resumen de PDF de deck o perfil de AngelList y devuelve un triaje estructurado: ajuste de tesis, señal de equipo, tamaño de mercado, tracción, banderas rojas y siguiente paso recomendado |
| `.claude/commands/ic-memo.md` | Comando Slash que genera una nota completa del Comité de Inversión a partir de notas de debida diligencia — tesis de inversión, análisis de mercado, evaluación de equipo, riesgos y mitigantes, términos propuestos y recomendación |
| `.claude/commands/lp-report.md` | Comando Slash que toma datos de rendimiento del fondo y aspectos destacados de la cartera y produce una carta trimestral de LP en la voz del fondo — resumen de rendimiento, actualizaciones de cartera, nuevas inversiones, perspectiva |
| `.claude/commands/due-diligence.md` | Comando Slash que sintetiza transcripciones de verificación de referencias, notas de revisión financiera y notas de auditoría técnica en un documento de hallazgos estructurado con elementos abiertos y evaluación de preparación de IC |
| `pipeline/diligence/_template/diligence-tracker.md` | Rastreador maestro de todos los elementos de debida diligencia abiertos en todos los flujos de trabajo — propietario, plazo, estado — actualizado diariamente durante debida diligencia activa |
| `portfolio/_template/kpis.md` | Plantilla de registro mensual de KPI que cubre ARR, crecimiento mes a mes, tasa de burn, runway, headcount, NRR y margen bruto — utilizada para generar narrativas de actualización de cartera |
| `lp/fund-performance/nav-tracker.md` | NAV trimestral por empresa de cartera — valores marcados, propiedad %, retornos implícitos — se alimenta directamente en reportes de LP y resumen de fondo anual |
| `diligence/reference-check-template.md` | Guía de entrevista de referencia estructurada de 12 preguntas que cubre capacidades del fundador, estilo de trabajo, debilidades y preocupaciones específicas de la empresa — utilizada en cada proceso de debida diligencia |

## Andamiaje rápido

```bash
# Crear la raíz del espacio de trabajo
mkdir -p investor-workspace

# Crear estructura .claude
mkdir -p investor-workspace/.claude/commands

# Crear directorios de etapa de canalización con plantillas
mkdir -p investor-workspace/pipeline/sourcing/_template
mkdir -p investor-workspace/pipeline/first-meeting
mkdir -p investor-workspace/pipeline/diligence/_template/reference-checks
mkdir -p investor-workspace/pipeline/diligence/_template/data-room
mkdir -p investor-workspace/pipeline/ic
mkdir -p investor-workspace/pipeline/closed
mkdir -p investor-workspace/pipeline/passed

# Crear plantilla de cartera
mkdir -p investor-workspace/portfolio/_template/updates
mkdir -p investor-workspace/portfolio/_template/board-notes

# Crear categorías de notas
mkdir -p investor-workspace/memos/ic-memos
mkdir -p investor-workspace/memos/deal-memos
mkdir -p investor-workspace/memos/pass-memos

# Crear directorios de LP
mkdir -p investor-workspace/lp/quarterly-reports
mkdir -p investor-workspace/lp/annual-reports
mkdir -p investor-workspace/lp/fund-performance
mkdir -p investor-workspace/lp/lp-communications

# Crear directorios de tesis y debida diligencia
mkdir -p investor-workspace/thesis/sector-notes
mkdir -p investor-workspace/diligence
mkdir -p investor-workspace/scratch

# Sembrar marcadores de posición .gitkeep
touch investor-workspace/pipeline/diligence/_template/reference-checks/.gitkeep
touch investor-workspace/pipeline/diligence/_template/data-room/.gitkeep
touch investor-workspace/portfolio/_template/updates/.gitkeep
touch investor-workspace/portfolio/_template/board-notes/.gitkeep

# Instalar habilidades de finanzas
npx claudient add skill finance/deal-screening
npx claudient add skill finance/deal-memo
npx claudient add skill finance/ic-memo
npx claudient add skill finance/portfolio-monitor
npx claudient add skill finance/dcf-model
npx claudient add skill finance/comps-analysis

# Copiar stubs de comandos en .claude/commands/
npx claudient add skill finance/deal-screening --output investor-workspace/.claude/commands/deal-screen.md
npx claudient add skill finance/ic-memo --output investor-workspace/.claude/commands/ic-memo.md
npx claudient add skill finance/portfolio-monitor --output investor-workspace/.claude/commands/portfolio-update.md
npx claudient add skill finance/deal-memo --output investor-workspace/.claude/commands/lp-report.md
```

## Plantilla CLAUDE.md

```markdown
# Espacio de trabajo del inversor — Instrucciones de Claude Code

## Qué es esto

Este es el directorio de trabajo para un inversor de capital de riesgo o ángel que gestiona el flujo de transacciones,
debida diligencia, monitoreo de cartera y relaciones con LP. Las etapas de canalización viven en pipeline/,
inversiones activas en portfolio/, notas de IC en memos/, materiales de LP en lp/ e investigación de sectores
en thesis/. Todo el cribado de transacciones, redacción de notas y reportes se ejecuta a través de Claude Code.

## Stack

- Notion / Airtable — CRM de transacciones y base de datos de cartera; kanban de canalización por etapa
- Carta — Tabla de capitalización de registro; exportar resúmenes a portfolio/<company>/cap-table.md
- AngelList / Visible — Portal de reportes de LP; reportes trimestrales redactados en lp/quarterly-reports/
- QuickBooks — Contabilidad del fondo; honorarios de gestión, solicitudes de capital, distribuciones
- Pitchbook / Crunchbase — Datos de mercado y comparables; exportar datos a thesis/sector-notes/ y memos
- Slack — Canales de fundadores y salas de transacciones de coinversores; hilos relevantes pegados en carpetas de transacciones
- Google Workspace — Salas de datos de debida diligencia compartidas; reflejar documentos clave a pipeline/diligence/<co>/data-room/

## Tareas comunes y comandos exactos

### Cribar un trato entrante
```
/deal-screen

Company: [nombre]
URL: [sitio web o perfil de AngelList]
Stage: [seed / Series A / Series B]
Sector: [categoría]
Ask: $[cantidad] at $[valuación] cap
Source: [inbound / warm intro from X / outbound]
Deck summary or key metrics: [pegar o describir]
```

### Redactar una nota de IC
```
/ic-memo

Company: [nombre], Stage: [ronda], Sector: [categoría]
Ask: $[cantidad], Valuation: $[post-money]
Investment thesis: [1-2 oraciones sobre por qué ahora y por qué nosotros]
Market: [TAM, tasa de crecimiento, dinámicas clave]
Team: [antecedentes de fundadores, experiencia relevante]
Traction: [ARR, tasa de crecimiento, clientes clave, NRR]
Risks: [3 riesgos principales y mitigantes propuestos]
Comparable deals: [comparables con múltiplos de entrada]
Diligence notes: [pegar hallazgos clave de financial-review.md y reference-checks/]
```

### Sintetizar una actualización mensual de cartera
```
/portfolio-update

Company: [nombre]
Month: [Month YYYY]
Raw update from founder: [pegar correo electrónico de actualización mensual del fundador o notas]
Prior month KPIs: [pegar de portfolio/<company>/kpis.md]
Board notes context: [cualquier elemento abierto o preocupación]
```

### Redactar un reporte trimestral de LP
```
/lp-report

Quarter: Q[X] [YEAR]
Fund: [Nombre del fondo y vintage]
NAV this quarter: $[X]M (prior quarter: $[Y]M)
New investments: [empresa, cantidad, etapa]
Portfolio highlights: [2-3 ganancias principales — hitos de ingresos, rondas posteriores, asociaciones]
Write-downs or concerns: [cualquier marca a señalar]
Market outlook: [contexto macro relevante para tesis del fondo]
Fund performance: [TIR, DPI, RVPI si está disponible]
```

### Cribar una referencia para una empresa de cartera o debida diligencia
```
/due-diligence

Company: [nombre]
Diligence stage: [reference checks / financial review / tech audit / full synthesis]
Open items: [pegar de pipeline/diligence/<co>/diligence-tracker.md]
Findings to date: [pegar financial-review.md o transcripciones de reference-check]
IC date: [fecha objetivo para completar la nota]
```

### Construir una tesis de mercado
```
/market-thesis

Sector: [categoría]
Thesis question: [¿qué apuesta específica estamos haciendo?]
Market data: [pegar de exportación de Pitchbook/Crunchbase o sector-notes/]
Comparable funds and investments: [¿quién más está invirtiendo, cuáles son las señales?]
Target company profile: [etapa, geografía, tipo de fundador, rango de ingresos]
Thesis risks: [¿qué haría que esta tesis fuera incorrecta?]
```

### Responder a una actualización mensual del fundador
```
/founder-update

Company: [nombre]
Founder update: [pegar actualización completa]
Our ownership: [%], Investment date: [fecha], Last board: [fecha]
Open action items from last board: [lista]
Key concerns to address: [preocupaciones a nivel de junta directiva, si las hay]
```

## Convenciones a seguir

- Todos los tratos de canalización se mueven a través de etapas: sourcing → first-meeting → diligence → ic → closed o passed
- Cuando un trato se cierra, copiar la nota de IC a portfolio/<company>/memo.md y crear la carpeta de cartera completa
- La justificación de rechazo siempre se documenta en pipeline/passed/<company>/pass-rationale.md — nunca eliminar transacciones cribadas
- Las actualizaciones del fundador se almacenan en portfolio/<company>/updates/YYYY-MM-update.md — un archivo por mes
- Los KPI se agregan (nunca se sobrescriben) en portfolio/<company>/kpis.md — tabla corriente con filas fechadas
- Las transcripciones de verificación de referencias van en pipeline/diligence/<company>/reference-checks/ref-<name>.md
- Todas las notas de IC también se archivan en memos/ic-memos/YYYY-MM-<company>.md después de la votación de IC
- El rastreador de NAV en lp/fund-performance/nav-tracker.md se actualiza cada trimestre antes de enviar el reporte de LP
- Los rastreadores de debida diligencia permanecen abiertos hasta que se envía la nota de IC — cerrar elementos con fecha y resultado, no eliminación
```

## Servidores MCP

```json
{
  "mcpServers": {
    "crunchbase": {
      "command": "npx",
      "args": ["-y", "@crunchbase/mcp-server"],
      "env": {
        "CRUNCHBASE_API_KEY": "your-crunchbase-api-key"
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
        "/Users/your-username/investor-workspace"
      ]
    },
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@google/mcp-server-drive"],
      "env": {
        "GOOGLE_CLIENT_ID": "your-google-client-id",
        "GOOGLE_CLIENT_SECRET": "your-google-client-secret",
        "GOOGLE_REFRESH_TOKEN": "your-google-refresh-token"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"ic-memo.md\"; then echo \"[hook] IC memo written — file a copy to memos/ic-memos/ with YYYY-MM-<company> naming before the IC call\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"pass-rationale.md\"; then echo \"[hook] Pass memo saved — confirm the deal is moved from pipeline/diligence/ or pipeline/first-meeting/ to pipeline/passed/\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'DOM=$(date +%d); if [ \"$DOM\" = \"01\" ]; then echo \"[reminder] First of month — update portfolio KPI logs (portfolio/<company>/kpis.md) and prepare portfolio-update narratives for board visibility\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Habilidades a instalar

```bash
# Habilidades clave de inversor
npx claudient add skill finance/deal-screening
npx claudient add skill finance/deal-memo
npx claudient add skill finance/ic-memo
npx claudient add skill finance/portfolio-monitor
npx claudient add skill finance/dcf-model
npx claudient add skill finance/comps-analysis

# Habilidades de finanzas y investigación de apoyo
npx claudient add skill finance/lp-reporting
npx claudient add skill finance/cap-table-analysis
npx claudient add skill finance/reference-check-synthesizer
npx claudient add skill finance/market-sizing
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/stakeholder-comms

# Instalar todas las habilidades de finanzas a la vez
npx claudient add skills finance
```

## Relacionado

- [Guía de inversor](../guides/for-investor.md)
- [Flujo de trabajo de transacciones](../workflows/deal-flow.md)
- [Flujo de trabajo de notas de IC](../workflows/ic-memo-process.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
