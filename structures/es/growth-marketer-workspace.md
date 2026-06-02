# Espacio de Trabajo del Especialista en Crecimiento — Estructura del Proyecto

> Para especialistas en crecimiento que ejecutan el ciclo completo de adquisición a retención — diseño de experimentos, gestión de canales pagados, CRO de embudo, análisis de cohortes e informes de crecimiento semanales — en un único espacio de trabajo de Claude Code.

## Stack

- **Análisis de producto:** Mixpanel (rastreo de eventos, embudos, cohortes, retención) o Amplitude (análisis de comportamiento, gráficos, notebooks)
- **CDP:** Segment (recopilación de eventos, resolución de identidad, sincronización de audiencias a plataformas publicitarias)
- **Adquisición pagada:** Google Ads (búsqueda, performance max, display) + Meta Ads (Facebook + Instagram, basado en audiencia)
- **Experimentación:** Optimizely (feature flags, experimentos web, motor de estadísticas) o GrowthBook (A/B de código abierto, feature flags, Bayesiano + frecuentista)
- **Automatización de marketing:** HubSpot (etapas de ciclo de vida, flujos de correo electrónico, puntuación de leads, atribución de campañas)
- **Análisis web:** Google Analytics 4 (fuentes de tráfico, eventos de conversión, exploración de embudos)
- **Diseño de landing pages:** Figma (wireframes, mockups de alta fidelidad, especificaciones de entrega para desarrollo o sin código)
- **Comunicación:** Slack (canal de crecimiento, alertas de experimentos, resumen semanal)
- **Habilidades de Claude Code:** marketing/experiment-tracker, marketing/growth-dashboard, marketing/paid-ads, marketing/page-cro, marketing/onboarding-cro, marketing/referral-program, marketing/pricing-strategy

## Árbol de directorios

```
growth-marketer-workspace/
├── .claude/
│   ├── CLAUDE.md                                  # Instrucciones del espacio de trabajo para Claude Code
│   ├── settings.json                              # Servidores MCP, hooks, permisos
│   └── commands/
│       ├── experiment-design.md                   # /experiment-design — toma una hipótesis, genera especificación de prueba completa
│       ├── funnel-analysis.md                     # /funnel-analysis — mapea abandono en cada etapa desde datos de Mixpanel
│       ├── ad-copy-test.md                        # /ad-copy-test — genera variantes de copia publicitaria para pruebas A/B
│       ├── cro-audit.md                           # /cro-audit — revisa landing page contra las mejores prácticas de CRO
│       ├── cohort-analysis.md                     # /cohort-analysis — analiza retención por cohorte de registro
│       ├── growth-report.md                       # /growth-report — informe semanal de métrica norte y resumen de canal
│       └── channel-review.md                      # /channel-review — revisión de ROI y eficiencia por canal pagado
├── experiments/
│   ├── _template/
│   │   ├── hypothesis.md                          # Formato de hipótesis: Si [acción] entonces [resultado] porque [razón]
│   │   ├── test-design.md                         # Especificación de control vs. variante, división de audiencia, métricas de éxito
│   │   └── results.md                             # Verificación de significancia estadística, porcentaje de mejora, intervalo de confianza, decisión
│   ├── 2026-06-checkout-cta-copy/
│   │   ├── hypothesis.md                          # Hipótesis: CTA direccional impulsa mayor CVR de checkout
│   │   ├── test-design.md                         # División 50/50, bandera de GrowthBook: checkout-cta-v2, n=4000
│   │   ├── results.md                             # Mejora +8.3%, IC 95%, enviado al 100%
│   │   └── segment-breakdown.md                   # Resultados segmentados por dispositivo, fuente de tráfico, tipo de plan
│   ├── 2026-06-pricing-page-layout/
│   │   ├── hypothesis.md
│   │   ├── test-design.md                         # Prueba de 3 variantes: actual, anual primero, tabla de características
│   │   ├── results.md
│   │   └── heatmap-notes.md                       # Observaciones de Hotjar / FullStory durante la prueba
│   ├── 2026-05-onboarding-email-sequence/
│   │   ├── hypothesis.md
│   │   ├── test-design.md
│   │   ├── results.md
│   │   └── cohort-comparison.md                   # Retención día-7 y día-30 para cohortes de prueba vs. control
│   └── backlog.md                                 # Cola de experimentos priorizada (puntuación ICE)
├── funnels/
│   ├── acquisition-funnel.md                      # Visitante → Prueba → Activación → Pagado — definiciones de etapa
│   ├── activation-funnel.md                       # Registro → Momento aha — secuencia de eventos y puntos de referencia
│   ├── conversion-benchmarks.md                   # CVRs actuales por etapa vs. puntos de referencia de industria
│   ├── drop-off-analysis/
│   │   ├── 2026-06-checkout-drop-off.md           # Análisis de punto de salida: dónde abandonan los usuarios el checkout
│   │   ├── 2026-05-onboarding-drop-off.md         # Embudo de finalización de incorporación paso a paso
│   │   └── 2026-04-trial-to-paid-drop-off.md      # Análisis de bloqueador de actualización — precio, tiempo, características
│   └── funnel-maps/
│       ├── top-of-funnel.md                       # Pagado + orgánico → landing page → registro de prueba
│       ├── mid-funnel.md                          # Prueba → eventos de activación → señales de intención de actualización
│       └── bottom-of-funnel.md                   # Disparadores de actualización, página de precios, flujo de checkout
├── paid/
│   ├── _briefs/
│   │   ├── brief-template.md                      # Resumen de campaña: objetivo, audiencia, presupuesto, especificaciones creativas
│   │   ├── 2026-06-google-search-trial.md         # Resumen: impulsar registros de prueba a través de búsqueda de marca y competidor
│   │   ├── 2026-06-meta-retargeting-q2.md         # Resumen: retargetar usuarios de prueba que no se convirtieron en 7 días
│   │   └── 2026-05-linkedin-icp-awareness.md      # Resumen: conciencia de marca hacia títulos ICP en industrias objetivo
│   ├── ad-copy/
│   │   ├── google-search/
│   │   │   ├── branded-variants.md                # Variantes de titular RSA + descripción para términos de marca
│   │   │   ├── competitor-variants.md             # Copia para campañas de conquista de competidor
│   │   │   └── generic-variants.md                # Copia de palabras clave sin marca (ej. "herramienta de análisis de crecimiento")
│   │   └── meta/
│   │       ├── awareness-copy.md                  # Copia creativa de parte superior del embudo: gancho, cuerpo, CTA
│   │       ├── retargeting-copy.md                # Copia de media funnel: manejo de objeciones, prueba social
│   │       └── conversion-copy.md                 # Parte inferior del embudo: dirigido por oferta, urgencia, respuesta directa
│   └── performance-logs/
│       ├── 2026-06-weekly.md                      # CPC, CTR, CVR, CPA, ROAS por campaña — foto semanal
│       ├── 2026-05-weekly.md
│       └── budget-tracker.md                      # Gasto mensual vs. presupuesto por canal y campaña
├── landing-pages/
│   ├── _briefs/
│   │   ├── page-brief-template.md                 # Resumen: objetivo, fuente de tráfico, audiencia, hipótesis, CTA
│   │   ├── 2026-06-trial-signup-v3.md             # Resumen para página de destino de prueba rediseñada
│   │   └── 2026-05-pricing-page-refresh.md        # Resumen: énfasis en plan anual, tabla de comparación de características
│   ├── cro-notes/
│   │   ├── trial-signup-cro-audit.md              # Auditoría CRO: puntos de fricción, señales de confianza, campos de formulario
│   │   ├── pricing-page-cro-audit.md              # Auditoría CRO: claridad del plan, manejo de objeciones, colocación de CTA
│   │   └── homepage-cro-audit.md                  # Auditoría CRO: claridad de propuesta de valor, análisis sobre la línea de flotación
│   └── test-results/
│       ├── trial-page-v2-vs-v3.md                 # Resultado A/B: V3 +12% CVR, enviado
│       ├── pricing-annual-vs-monthly.md            # Resultado A/B: layout de anual primero aumentó mezcla ARR en 9%
│       └── homepage-headline-test.md              # Prueba multivariante de título — inconcluyente, extendido
├── retention/
│   ├── churn-analysis/
│   │   ├── 2026-q2-churn-report.md                # Tasa de churn, códigos de razón, desglose de segmento
│   │   ├── 2026-q1-churn-report.md
│   │   └── churn-risk-signals.md                  # Señales de comportamiento correlacionadas con churn (Mixpanel)
│   ├── win-back/
│   │   ├── win-back-sequence.md                   # Secuencia de recuperación de 3 correos electrónicos: oferta de reenganche, testimonio, CTA final
│   │   ├── win-back-segment-rules.md              # Condiciones de activación del flujo de trabajo de HubSpot para inscripción de recuperación
│   │   └── win-back-results.md                    # Tasa de recuperación por razón de churn y tiempo desde churn
│   └── lifecycle-emails/
│       ├── day-3-activation-nudge.md              # Correo electrónico para usuarios que no han alcanzado evento de activación por día 3
│       ├── day-7-check-in.md                      # Correo electrónico de progreso + enlace de tutorial para usuarios con bajo engagement
│       └── day-30-upgrade-prompt.md               # Correo electrónico de actualización activado en hito de uso
├── reports/
│   ├── weekly-growth-dashboard/
│   │   ├── 2026-W22.md                            # Métrica norte, CAC de canal, MRR agregados, estado de experimento
│   │   ├── 2026-W21.md
│   │   └── _template.md                           # Plantilla para panel de crecimiento semanal
│   ├── channel-roi/
│   │   ├── 2026-q2-channel-roi.md                 # CAC, LTV:CAC, período de recuperación por canal
│   │   └── 2026-q1-channel-roi.md
│   └── north-star-tracking/
│       ├── north-star-definition.md               # Definición de métrica, por qué importa, cómo se mide
│       └── north-star-log.md                      # Valor de métrica norte semanal + varianza vs. objetivo
└── notes/
    ├── ice-scoring-rubric.md                      # Guía de puntuación ICE (Impacto / Confianza / Facilidad) para experimentos
    ├── growth-model.md                            # Modelo de crecimiento de abajo hacia arriba: insumos, palancas, sensibilidades
    └── competitor-intel.md                        # Movimientos de competidor observados, precios, actividad de canal
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `.claude/commands/experiment-design.md` | Toma una cadena de hipótesis y produce una especificación de prueba completa: definición de control vs. variante, métricas primarias + de guardia, efecto mínimo detectable, tamaño de muestra requerido, duración de prueba, nombre de bandera de GrowthBook u Optimizely, y criterios de decisión |
| `.claude/commands/funnel-analysis.md` | Lee datos de abandono de exportaciones de Mixpanel/Amplitude o capturas de pantalla de embudo pegadas, mapea tasas de conversión en cada etapa, identifica la fuga de mayor apalancamiento y propone experimentos para solucionarla |
| `.claude/commands/cro-audit.md` | Revisa una URL de landing page o especificación de Figma contra principios de CRO: propuesta de valor sobre la línea de flotación, claridad de CTA, fricción de formulario, señales de confianza, banderas de velocidad de página, usabilidad móvil — produce una auditoría puntuada con correcciones priorizadas |
| `.claude/commands/growth-report.md` | Genera un informe de crecimiento semanal que cubre tendencia de métrica norte, adiciones de MRR/ARR, CAC a nivel de canal, estado de experimento principal y riesgos — formateado para resumen de Slack o sincronización de liderazgo |
| `experiments/_template/` | Directorio de plantilla de experimento maestro — copiar a `experiments/<fecha>-<slug>/` antes de comenzar cualquier prueba; asegura que cada experimento tenga hipótesis, diseño y resultados documentados consistentemente |
| `experiments/backlog.md` | Cola de experimentos con puntuación ICE; la lista de priorización canónica consultada antes de comenzar cualquier nueva prueba |
| `retention/churn-analysis/churn-risk-signals.md` | Señales de comportamiento de Mixpanel correlacionadas con churn dentro de 30 días — usadas para activar correos electrónicos de ciclo de vida proactivos y marcar cuentas en riesgo para CS |
| `reports/north-star-tracking/north-star-definition.md` | Fuente única de verdad para qué es la métrica norte, cómo se calcula en Mixpanel/Amplitude y cuál es el objetivo semanal |

## Andamiaje rápido

```bash
# Crear raíz del espacio de trabajo
mkdir -p growth-marketer-workspace && cd growth-marketer-workspace

# Directorios de Claude Code
mkdir -p .claude/commands

# Experimentos
mkdir -p experiments/_template
mkdir -p experiments/2026-06-checkout-cta-copy
mkdir -p experiments/2026-06-pricing-page-layout

# Embudos
mkdir -p funnels/drop-off-analysis
mkdir -p funnels/funnel-maps

# Adquisición pagada
mkdir -p paid/_briefs
mkdir -p paid/ad-copy/google-search
mkdir -p paid/ad-copy/meta
mkdir -p paid/performance-logs

# Landing pages
mkdir -p landing-pages/_briefs
mkdir -p landing-pages/cro-notes
mkdir -p landing-pages/test-results

# Retención
mkdir -p retention/churn-analysis
mkdir -p retention/win-back
mkdir -p retention/lifecycle-emails

# Reportes
mkdir -p reports/weekly-growth-dashboard
mkdir -p reports/channel-roi
mkdir -p reports/north-star-tracking

# Notas
mkdir -p notes

# Inicializar archivos clave
touch .claude/CLAUDE.md
touch .claude/settings.json
touch experiments/_template/hypothesis.md
touch experiments/_template/test-design.md
touch experiments/_template/results.md
touch experiments/backlog.md
touch funnels/acquisition-funnel.md
touch funnels/conversion-benchmarks.md
touch paid/_briefs/brief-template.md
touch paid/performance-logs/budget-tracker.md
touch landing-pages/_briefs/page-brief-template.md
touch reports/weekly-growth-dashboard/_template.md
touch reports/north-star-tracking/north-star-definition.md
touch reports/north-star-tracking/north-star-log.md
touch notes/ice-scoring-rubric.md
touch notes/growth-model.md

# Instalar todas las habilidades de marketing de crecimiento
npx claudient add skill marketing/experiment-tracker
npx claudient add skill marketing/growth-dashboard
npx claudient add skill marketing/paid-ads
npx claudient add skill marketing/page-cro
npx claudient add skill marketing/onboarding-cro
npx claudient add skill marketing/referral-program
npx claudient add skill marketing/pricing-strategy

# Instalar comandos slash
npx claudient add command experiment-design
npx claudient add command funnel-analysis
npx claudient add command ad-copy-test
npx claudient add command cro-audit
npx claudient add command cohort-analysis
npx claudient add command growth-report
npx claudient add command channel-review

echo "Espacio de trabajo de especialista en crecimiento listo."
```

## Plantilla CLAUDE.md

```markdown
# Espacio de Trabajo del Especialista en Crecimiento — Instrucciones de Claude

## Qué es esto

Este espacio de trabajo gestiona el ciclo de crecimiento completo: diseño y rastreo de experimentos,
adquisición pagada (Google Ads + Meta), CRO de landing page, análisis de embudo,
análisis de cohortes y retención e informes de crecimiento semanales. La métrica norte
y todas las decisiones de experimento se poseen aquí.

## Stack

- Análisis de producto: Mixpanel — fuente primaria para embudos, cohortes, retención,
  comportamiento del usuario a nivel de evento
- CDP: Segment — enrutamiento de eventos, resolución de identidad, sincronización de audiencias a plataformas publicitarias
- Canales pagados: Google Ads (búsqueda + PMax) y Meta Ads (Facebook + Instagram)
- Experimentación: GrowthBook — feature flags, asignación de prueba A/B, motor de estadísticas bayesianas
- Automatización de marketing: HubSpot — etapas de ciclo de vida, flujos de correo electrónico, puntuación de leads
- Análisis web: Google Analytics 4 — atribución de tráfico, eventos de conversión macro
- Diseño: Figma — wireframes de landing page y especificaciones de alta fidelidad
- Comunicación: Slack canal #growth para alertas de experimentos y resumen semanal

## Convenciones de directorios

- experiments/<fecha>-<slug>/ — un directorio por experimento; siempre copiar _template/
- funnels/ — mapas de embudo y análisis de abandono viven aquí; nunca sobrescribir, agregar archivos con fecha
- paid/_briefs/ — resumen de campaña antes de lanzar cualquier campaña pagada
- paid/performance-logs/ — fotos semanales de CPC, CTR, CVR, CPA, ROAS por campaña
- landing-pages/cro-notes/ — un archivo por página; agregar hallazgos, nunca sobrescribir
- retention/churn-analysis/ — informes de churn trimestrales + documento de señal de riesgo permanente
- reports/weekly-growth-dashboard/ — un archivo por semana, nombrado YYYY-WWW

## Tareas comunes — comandos exactos

**Diseñar un nuevo experimento:**
/experiment-design hypothesis="Si [acción] entonces [métrica] será [dirección] porque [razón]" audience="[segmento]" metric="[métrica primaria en Mixpanel]"

**Analizar un abandono de embudo:**
/funnel-analysis funnel=funnels/acquisition-funnel.md data="[salida de Mixpanel pegada o ruta CSV]"

**Generar variantes de copia publicitaria:**
/ad-copy-test channel="[google-search|meta]" goal="[trial|awareness|retargeting]" offer="[oferta o propuesta de valor]" variants=5

**Auditar una landing page:**
/cro-audit url="[URL de landing page]" goal="[trial signup|demo request]" traffic-source="[paid search|organic|email]"

**Ejecutar análisis de cohortes:**
/cohort-analysis cohort-def="[rango de fecha de registro o segmento]" metric="[day-7 retention|trial-to-paid CVR]" data="[ruta de exportación Mixpanel/Amplitude]"

**Generar informe de crecimiento semanal:**
/growth-report week="[YYYY-WXX]" north-star="[valor actual]" target="[objetivo semanal]"

**Revisar un canal pagado:**
/channel-review channel="[google|meta|linkedin]" period="[2026-06]" data=paid/performance-logs/[archivo].md

## Convenciones de experimentos

- Todo experimento comienza con una hipótesis en formato experiments/_template/hypothesis.md
- Puntuar en ICE cada nueva idea de experimento en experiments/backlog.md antes de programar
- El tamaño de muestra mínimo debe calcularse antes del lanzamiento — sin tamaños de muestra intuitivos
- La métrica primaria debe ser un evento de Mixpanel; las métricas de guardia deben incluir al menos una
  métrica aguas abajo (ej. retención día-30 si primaria es prueba CVR)
- Umbral de significancia estadística: confianza 95%; tiempo de ejecución mínimo: 14 días
- Resultados documentados en results.md dentro de 48 horas de conclusión del experimento

## Convenciones de canales pagados

- Siempre escribir un resumen de campaña en paid/_briefs/ antes de que cualquier campaña salga en vivo
- Las variantes de copia publicitaria deben documentarse en paid/ad-copy/ antes de cargar en plataforma
- Registros de desempeño actualizados semanalmente cada lunes — CPC/CTR/CVR/CPA/ROAS de la semana anterior
- Rastreador de presupuesto actualizado siempre que el ritmo de gasto se desvíe más del 15% del plan

## Convenciones de CRO

- Sin cambios de landing page sin un resumen en landing-pages/_briefs/
- Auditoría CRO requerida antes de cualquier rediseño de página importante — archivarlo en landing-pages/cro-notes/
- Todos los resultados A/B documentados en landing-pages/test-results/ — incluir nivel de confianza y
  tamaño de muestra, no solo porcentaje de mejora

## Convenciones de reportes

- Informe de crecimiento semanal publicado en Slack #growth cada lunes a las 10am
- Métrica norte registrada en reports/north-star-tracking/north-star-log.md semanalmente
- Informe de ROI de canal producido trimestralmente — incluye CAC, ratio LTV:CAC, período de recuperación
```

## Servidores MCP

```json
{
  "mcpServers": {
    "mixpanel": {
      "command": "npx",
      "args": ["-y", "@mixpanel/mcp-server"],
      "env": {
        "MIXPANEL_SERVICE_ACCOUNT_USERNAME": "${MIXPANEL_SERVICE_ACCOUNT_USERNAME}",
        "MIXPANEL_SERVICE_ACCOUNT_SECRET": "${MIXPANEL_SERVICE_ACCOUNT_SECRET}",
        "MIXPANEL_PROJECT_ID": "${MIXPANEL_PROJECT_ID}"
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
        "@modelcontextprotocol/server-filesystem",
        "/Users/${USER}/growth-marketer-workspace"
      ]
    },
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "${HUBSPOT_ACCESS_TOKEN}"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_FILE_PATH\"; if [[ \"$FILE\" == */experiments/*/results.md ]]; then echo \"[hook] Resultados de experimento guardados: $FILE — actualizar experiments/backlog.md con resultado y reputación ICE si es aplicable\"; fi'"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$FILE\" == */experiments/*/test-design.md && ! -f \"$(dirname $FILE)/hypothesis.md\" ]]; then echo \"[hook] ADVERTENCIA: No se encontró hypothesis.md para este experimento — crear hypothesis.md antes de test-design.md\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR}\" && OPEN=$(find experiments/ -name \"test-design.md\" -not -newer experiments/ 2>/dev/null | xargs -I{} dirname {} | xargs -I{} sh -c \"[ ! -f {}/results.md ] && echo {}\" 2>/dev/null | wc -l | tr -d \" \"); [ \"$OPEN\" -gt 0 ] && echo \"[reminder] $OPEN experimento(s) tiene(n) un test-design.md pero sin results.md — verificar si alguna prueba ha concluido\" || true'"
          }
        ]
      }
    ]
  }
}
```

## Habilidades a instalar

```bash
npx claudient add skill marketing/experiment-tracker
npx claudient add skill marketing/growth-dashboard
npx claudient add skill marketing/paid-ads
npx claudient add skill marketing/page-cro
npx claudient add skill marketing/onboarding-cro
npx claudient add skill marketing/referral-program
npx claudient add skill marketing/pricing-strategy
```

## Relacionado

- [Guía: Claude para Especialistas en Crecimiento](../guides/for-growth-marketer.md)
- [Flujo de trabajo: Diseño de Experimento a Decisión](../workflows/experiment-lifecycle.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
