# Newsletter Business — Estructura de Proyecto

> Para un creador o empresa de medios que ejecuta un boletín informativo — gestionar la redacción de problemas, planificación editorial, acuerdos de patrocinio, crecimiento de la lista y análisis de rendimiento en un único espacio de trabajo de Claude Code.

## Stack

- **ESP + Publicación:** Beehiiv (preferido para monetización), Substack (nativo para creadores), o ConvertKit (automatización primero)
- **Distribución social:** Typefully (programación de hilos de Twitter/X, análisis) o Hypefury (retuit automático, colas de contenido perenne)
- **Planificación editorial:** Notion (base de datos de calendario de contenidos, cartera de ideas, vistas de pipeline)
- **Visuales:** Canva (imágenes de encabezado de problemas, banners de patrocinadores, tarjetas sociales — 1200x630px y 1080x1080px)
- **Facturación de patrocinio:** Sponsy (reserva, facturación, flujo de trabajo de copia de anuncios) o Stripe (facturación manual a través de Stripe Invoices)
- **Análisis:** Google Analytics 4 (tráfico web/archivo), análisis nativos de Beehiiv/Substack (tasa de apertura, CTR, crecimiento de suscriptores)
- **Comunicación:** Slack (alertas editoriales, comunicaciones de patrocinadores, canal de experimentos de crecimiento)
- **Habilidades de Claude Code:** productivity/newsletter-writer, productivity/stakeholder-comms, data-ml/stakeholder-report, productivity/vendor-evaluator

## Árbol de directorios

```
newsletter-business/
├── .claude/
│   ├── CLAUDE.md                              # Instrucciones de espacio de trabajo para Claude Code
│   ├── settings.json                          # Servidores MCP, hooks, permisos
│   └── commands/
│       ├── write-issue.md                     # /write-issue — redactar un problema completo a partir del tema + esquema
│       ├── edit-issue.md                      # /edit-issue — revisar, apretar, aplicar guía de estilo
│       ├── sponsorship-brief.md               # /sponsorship-brief — generar copia de anuncio a partir de entrada de patrocinador
│       ├── growth-experiment.md               # /growth-experiment — diseñar prueba A/B para canal de adquisición
│       ├── performance-report.md              # /performance-report — extraer métricas semanales de apertura/CTR/crecimiento
│       ├── social-promo.md                    # /social-promo — generar promoción de Twitter/X + LinkedIn para el problema
│       └── list-health-check.md               # /list-health-check — señalar señales de rotación, activadores de reactivación
├── issues/
│   ├── _template/
│   │   ├── draft.md                           # Borrador de problema en blanco (copiar antes de escribir cada problema)
│   │   └── performance-metrics.md             # Hoja de métricas en blanco (completar a 7/30/60 días después del envío)
│   ├── 2026-06-02-issue-001/
│   │   ├── draft.md                           # Borrador de trabajo — en progreso
│   │   ├── final.md                           # Copia bloqueada enviada a ESP
│   │   └── performance-metrics.md             # Tasa de apertura, CTR, respuestas, cancelaciones de suscripción — completado después del envío
│   ├── 2026-05-26-issue-000/
│   │   ├── draft.md
│   │   ├── final.md
│   │   └── performance-metrics.md             # Métricas históricas para comparación
│   └── 2026-05-19-issue-999/
│       ├── draft.md
│       ├── final.md
│       └── performance-metrics.md
├── editorial/
│   ├── content-calendar.md                    # Plan de problema mensual: fecha, tema, espacio de patrocinador, estado
│   ├── idea-backlog.md                        # Lista de ideas de historias con fuente y prioridad
│   ├── topic-clusters.md                      # Temas recurrentes y cómo los problemas se asignan a ellos
│   └── style-guide.md                         # Voz, tono, frases prohibidas, reglas de formato
├── sponsorships/
│   ├── media-kit.md                           # Estadísticas de audiencia, tarifa, especificaciones de formato de anuncio — enviar a patrocinadores
│   ├── sponsor-tracker.md                     # Pipeline: prospecto, negociando, confirmado, facturado, pagado
│   ├── ad-copy-templates.md                   # Estructuras de copia de anuncio reutilizables (primaria, secundaria, clasificada)
│   └── invoice-log.md                         # Facturas emitidas: patrocinador, cantidad, fecha del problema, fecha de pago
├── growth/
│   ├── referral-program.md                    # Reglas de programa de referencia de Beehiiv/SparkLoop, niveles, cumplimiento de recompensas
│   ├── acquisition-channels.md                # Desglose de canales: orgánico, promociones cruzadas, pagado, archivo SEO
│   └── experiment-log.md                      # Pruebas A/B: hipótesis, variante, resultado, decisión
├── templates/
│   ├── issue-format.md                        # Esqueleto de problema estándar (gancho, secciones del cuerpo, espacio de patrocinador, CTA)
│   ├── welcome-email.md                       # Secuencia de bienvenida automatizada — problemas 1 y 2
│   ├── re-engagement.md                       # Correo electrónico de recuperación para inactivos de 90 días
│   └── social-promo.md                        # Plantilla de hilo de Twitter/X + plantilla de publicación de LinkedIn
└── analytics/
    ├── weekly-dashboard.md                    # Instantánea semanal: suscriptores, tasa de apertura, CTR, ingresos
    └── cohort-benchmarks.md                   # Retención de cohorte de suscriptores a 30/60/90/180 días
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `issues/<date-slug>/draft.md` | Copia de trabajo para cada problema — escrito aquí, editado aquí, luego bloqueado a final.md antes de programar en ESP |
| `issues/<date-slug>/final.md` | Copia inmutable posterior al envío — nunca se edita después del envío; se utiliza para archivo y reutilización |
| `issues/<date-slug>/performance-metrics.md` | Tasa de apertura, CTR, enlaces principales, cancelaciones de suscripción, respuestas — completado a 7, 30 y 60 días después del envío |
| `editorial/content-calendar.md` | Fuente única de verdad para problemas próximos: fecha de publicación, tema, espacio de patrocinador confirmado o abierto, estado de borrador |
| `editorial/style-guide.md` | Reglas de voz y formato aplicadas por Claude en cada edición — límites de longitud de oración, frases de relleno prohibidas, orden de sección |
| `sponsorships/sponsor-tracker.md` | Pipeline completo de patrocinio de prospecto a pagado; cada fila es un acuerdo con espacio de problema, tarifa, plazo de copia y estado de pago |
| `sponsorships/media-kit.md` | Tamaño de audiencia, tasa de apertura, demografía, especificaciones de formato de anuncio y precios — documento enviado a prospectos de patrocinador entrante y saliente |
| `analytics/weekly-dashboard.md` | Tabla semanal continua de métricas clave — se utiliza como contexto cuando Claude escribe informes de rendimiento o recomendaciones de crecimiento |

## Andamio rápido

```bash
# Crear raíz del espacio de trabajo
mkdir -p newsletter-business && cd newsletter-business

# Directorios de Claude Code
mkdir -p .claude/commands

# Directorios de problemas — plantilla + dos problemas recientes
mkdir -p issues/_template
mkdir -p issues/2026-06-02-issue-001
mkdir -p issues/2026-05-26-issue-000

# Editorial
mkdir -p editorial

# Patrocinios
mkdir -p sponsorships

# Crecimiento
mkdir -p growth

# Plantillas
mkdir -p templates

# Análisis
mkdir -p analytics

# Archivos de plantilla de semilla
touch issues/_template/draft.md
touch issues/_template/performance-metrics.md

# Archivos editoriales de semilla
touch editorial/content-calendar.md
touch editorial/idea-backlog.md
touch editorial/topic-clusters.md
touch editorial/style-guide.md

# Archivos de patrocinio de semilla
touch sponsorships/media-kit.md
touch sponsorships/sponsor-tracker.md
touch sponsorships/ad-copy-templates.md
touch sponsorships/invoice-log.md

# Archivos de crecimiento de semilla
touch growth/referral-program.md
touch growth/acquisition-channels.md
touch growth/experiment-log.md

# Archivos de plantilla de semilla
touch templates/issue-format.md
touch templates/welcome-email.md
touch templates/re-engagement.md
touch templates/social-promo.md

# Archivos de análisis de semilla
touch analytics/weekly-dashboard.md
touch analytics/cohort-benchmarks.md

# Inicializar configuración de Claude Code
touch .claude/CLAUDE.md
touch .claude/settings.json

# Instalar habilidades
npx claudient add skill productivity/newsletter-writer
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/process-mapper

# Instalar comandos de barra diagonal
npx claudient add command write-issue
npx claudient add command edit-issue
npx claudient add command sponsorship-brief
npx claudient add command growth-experiment
npx claudient add command performance-report
npx claudient add command social-promo
npx claudient add command list-health-check

echo "Espacio de trabajo de negocio del boletín listo."
```

## Plantilla CLAUDE.md

```markdown
# Newsletter Business — Instrucciones de Claude

## Qué es esto

Este espacio de trabajo gestiona una publicación de boletín de extremo a extremo: redacción y edición de problemas,
programación editorial, ventas y cumplimiento de patrocinio, experimentos de crecimiento de listas y
análisis de rendimiento. El boletín se publica en una cadencia fija (semanal o quincenal).
Todo el contenido se escribe para una audiencia de nicho específica — ver editorial/style-guide.md.

## Stack

- ESP + Publicación: Beehiiv (principal) — los problemas se redactan aquí y se programan en Beehiiv
- Distribución social: Typefully — hilos de Twitter/X y publicaciones de LinkedIn programadas después del envío
- Planificación editorial: Notion (calendario editorial canónico, reflejado en editorial/content-calendar.md)
- Visuales: Canva — imágenes de encabezado a 1200x630px, banners de patrocinador a 600x200px
- Facturación de patrocinio: Sponsy (reserva y facturación) + Stripe (procesamiento de pagos)
- Análisis: Análisis nativos de Beehiiv + Google Analytics 4 (tráfico de la página de archivo)
- Comunicación: Slack #newsletter-ops para alertas de envío y confirmaciones de patrocinador

## Convenciones de directorio

- issues/<YYYY-MM-DD-issue-NNN>/ — un directorio por problema; siempre use nomenclatura de slug de fecha
- issues/<slug>/draft.md — copia de trabajo activa; editado hasta el día de envío
- issues/<slug>/final.md — copia bloqueada; pegue exactamente lo que se envió a ESP
- issues/<slug>/performance-metrics.md — completar a 7, 30 y 60 días después del envío
- editorial/ — documentos de planificación; content-calendar.md es la fuente de verdad para el horario
- sponsorships/ — todos los archivos relacionados con el patrocinador; sponsor-tracker.md es la fuente de verdad del pipeline
- growth/ — registro de experimentos y seguimiento de canales; una fila por experimento en experiment-log.md
- analytics/ — paneles agregados; weekly-dashboard.md actualizado cada lunes

## Flujo de trabajo de redacción de problemas

1. Verifique editorial/content-calendar.md para el próximo tema de problema programado
2. Crear directorio issues/<YYYY-MM-DD-issue-NNN>/; copiar issues/_template/draft.md en él
3. Ejecutar /write-issue topic="[topic]" audience="[reader persona]" sponsor="[sponsor name or none]"
4. Revisar draft.md; ejecutar /edit-issue draft=issues/<slug>/draft.md para apretar y verificar el estilo
5. Verifique sponsorships/sponsor-tracker.md — si un patrocinador está confirmado para este espacio, ejecute
   /sponsorship-brief sponsor="[name]" product="[product]" cta="[URL]" words=75
6. Pegue la copia de anuncio final en draft.md en el espacio de patrocinador designado
7. Revise la copia final; copie a issues/<slug>/final.md; programe en Beehiiv
8. Actualizar estado de editorial/content-calendar.md a "scheduled"
9. Después del envío: ejecutar /social-promo source=issues/<slug>/final.md; programar en Typefully
10. A los 7 días: completar issues/<slug>/performance-metrics.md desde el panel de análisis de Beehiiv
11. A los 30 días: actualizar analytics/weekly-dashboard.md con datos de retención de cohortes

## Cadencia de patrocinio

- El pipeline de patrocinador vive en sponsorships/sponsor-tracker.md — actualizar después de cada punto de contacto de patrocinador
- El plazo de copia de anuncio es 5 días hábiles antes de la fecha de envío del problema — aplicar esto a los patrocinadores
- Todos los borradores de copia de anuncio nueva pasan por /sponsorship-brief antes de enviar al patrocinador para su aprobación
- Una vez que el patrocinador aprueba la copia, marque "copy approved" en sponsor-tracker.md
- Facturar a través de Sponsy inmediatamente después del envío del problema; registrar en sponsorships/invoice-log.md
- Seguimiento de facturas no pagadas a 14 días; escalar a 30 días

## Monitoreo de salud de listas

- Ejecutar /list-health-check semanalmente — lee analytics/weekly-dashboard.md y marca:
    - Caída de tasa de apertura >3pp semana a semana (señal de entrega o contenido)
    - Tasa de cancelación de suscripción >0.3% en cualquier problema individual (señal de ajuste de contenido/audiencia)
    - Crecimiento neto de suscriptores por debajo del objetivo semanal (señal de adquisición)
- Si la cohorte inactiva de 90 días supera el 15% de la lista: activar secuencia de reactivación
  (use templates/re-engagement.md como base; ejecutar /edit-issue para personalizar)
- Los datos de segmento viven en Beehiiv — hacer referencia cruzada con analytics/cohort-benchmarks.md

## Tareas comunes — comandos exactos

**Escriba un borrador de problema nuevo:**
/write-issue topic="[topic]" audience="[persona]" sponsor="[name or none]" length=800

**Editar y verificar el estilo de un borrador:**
/edit-issue draft=issues/[slug]/draft.md style=editorial/style-guide.md

**Generar copia de anuncio de patrocinador:**
/sponsorship-brief sponsor="[company]" product="[product description]" cta="[URL]" words=75

**Generar publicaciones de promoción social:**
/social-promo source=issues/[slug]/final.md channels="twitter,linkedin"

**Informe de rendimiento semanal:**
/performance-report dashboard=analytics/weekly-dashboard.md period=7d

**Diseñe un experimento de crecimiento:**
/growth-experiment channel="[channel]" hypothesis="[hypothesis]" log=growth/experiment-log.md

**Comprobación de salud de lista:**
/list-health-check dashboard=analytics/weekly-dashboard.md benchmarks=analytics/cohort-benchmarks.md

## Convenciones de estilo (de editorial/style-guide.md)

- Líneas de asunto: máximo 9 palabras, sin clickbait, poner el tema en primer plano
- Primera oración: máximo 20 palabras, indicar el punto inmediatamente
- Párrafos: máximo 4 oraciones; nunca use aperturas de relleno ("En el problema de hoy...")
- Espacios de patrocinador: claramente delimitados, divulgación honesta ("Este problema está patrocinado por...")
- CTA: una CTA principal por problema; coloque después del cuerpo principal, antes del cierre
- Tono: directo, informado, conversacional — sin cobertura corporativa, sin signos de exclamación
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
        "/Users/${USER}/newsletter-business"
      ]
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/mcp-server-notion"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
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
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp-server-stripe"],
      "env": {
        "STRIPE_SECRET_KEY": "${STRIPE_SECRET_KEY}"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_FILE_PATH\"; if [[ \"$FILE\" == */issues/*/draft.md ]]; then echo \"[hook] Borrador guardado — ejecutar /edit-issue para aplicar guía de estilo antes de finalizar\"; fi'"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$FILE\" == */issues/*/final.md ]]; then echo \"[hook] Escribir en final.md — confirmar que es la copia exacta enviada a Beehiiv/Substack antes de bloquear\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR}\" 2>/dev/null || exit 0; UNFILLED=$(find issues/ -name \"performance-metrics.md\" -empty 2>/dev/null | grep -v _template | wc -l | tr -d \" \"); [ \"$UNFILLED\" -gt 0 ] && echo \"[reminder] $UNFILLED problema(s) con performance-metrics.md vacío — completar desde panel de análisis de Beehiiv\" || true'"
          }
        ]
      }
    ]
  }
}
```

## Habilidades a instalar

```bash
npx claudient add skill productivity/newsletter-writer
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/founder-weekly-review
```

## Relacionado

- [Guide: Claude for Content Creators](../guides/for-content-creator.md)
- [Workflow: Issue Production end-to-end](../workflows/newsletter-issue-production.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
