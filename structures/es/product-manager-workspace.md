# Espacio de Trabajo del Gestor de Productos — Estructura del Proyecto

> Para un gestor de productos que posee descubrimiento, roadmap, entrega y lanzamientos — redacción de PRD, alineación de stakeholders, planificación de sprints, síntesis de investigación de usuarios, diseño de experimentos y análisis competitivo impulsados desde un único espacio de trabajo de Claude Code.

## Stack

- Linear — gestión de roadmap, seguimiento de sprints, refinamiento de backlog, informes de hitos
- Figma — revisión de diseño, enlaces de prototipos, referencias de especificaciones de diseño (MCP: figma)
- Notion o Confluence — PRDs, especificaciones de productos, wikis de equipo, registros de decisiones
- Amplitude o Mixpanel — análisis de productos, análisis de embudos, adopción de funciones, seguimiento de north star
- Dovetail — repositorio de investigación de usuarios, notas de entrevistas, etiquetado de insights, informes de usabilidad
- Jira — tableros de sprints empresariales, gestión de tickets, seguimiento de lanzamientos (cuando la organización lo requiere)
- Slack — async de stakeholders, coordinación de lanzamientos, comunicaciones multifuncionales (MCP: slack)
- Loom — grabaciones de demostración asincrónicas, recorridos de funciones, vídeos de revisión de sprints

## Árbol de directorios

```
product-manager-workspace/
├── .claude/
│   ├── CLAUDE.md                                  # Instrucciones del espacio de trabajo para Claude Code
│   ├── settings.json                              # Permisos, hooks, configuración del servidor MCP
│   └── commands/
│       ├── prd-draft.md                           # Redactar PRD a partir de idea de funcionalidad — lee plantillas, genera especificación completa
│       ├── user-story.md                          # Generar historias de usuario desde PRD o brief de funcionalidad
│       ├── experiment-design.md                   # Diseñar prueba A/B o multivariada — hipótesis, métricas, tamaño de muestra
│       ├── launch-plan.md                         # Construir lista de verificación de lanzamiento y plan de comunicaciones desde PRD
│       ├── competitive-teardown.md                # Análisis de producto competidor — UX, precios, brechas de posicionamiento
│       ├── sprint-review.md                       # Compilar narrativa de revisión de sprint desde tickets de Linear y métricas
│       └── discovery-interview.md                 # Generar guía de entrevista desde objetivo de investigación
├── roadmap/
│   ├── quarterly-roadmap-q3-2025.md              # Roadmap Q3 — iniciativas, propietarios, hitos, estado
│   ├── quarterly-roadmap-q4-2025.md              # Roadmap Q4 (draft — no comprometido)
│   ├── annual-themes-2025.md                     # Temas de productos anuales — apuestas estratégicas y justificación
│   ├── feature-backlog.md                        # Backlog de funcionalidades priorizado — todas las ideas en scope con puntuaciones
│   ├── prioritization-framework.md               # Reglas de puntuación RICE o ICE, ponderaciones, criterios de decisión
│   ├── now-next-later.md                         # Vista Now / Next / Later — instantánea del horizonte actual
│   └── deprioritized-log.md                      # Funcionalidades depriorizadas — razón, fecha, quién decidió
├── prds/
│   ├── _prd-template.md                          # Plantilla PRD canónica — secciones, propietarios, tabla de firma
│   ├── active/
│   │   ├── prd-onboarding-revamp.md              # PRD — rediseño de flujo de onboarding (en desarrollo)
│   │   ├── prd-bulk-export.md                    # PRD — funcionalidad de exportación masiva de datos (en revisión de especificación)
│   │   ├── prd-notification-center.md            # PRD — centro de notificaciones v2 (en diseño)
│   │   └── prd-api-rate-limiting.md              # PRD — limitación de velocidad de API y gestión de cuotas
│   ├── shipped/
│   │   ├── prd-search-v2.md                      # PRD — search v2 (lanzado 2025-04)
│   │   ├── prd-team-permissions.md               # PRD — permisos a nivel de equipo (lanzado 2025-02)
│   │   └── prd-csv-import.md                     # PRD — importación CSV (lanzado 2025-01)
│   └── archived/
│       ├── prd-mobile-app-v1.md                  # PRD — aplicación móvil v1 (cancelada — cambio de dirección a web-first)
│       └── prd-ai-assistant-spike.md             # PRD — spike de asistente de IA (fusionado en PRD de onboarding)
├── research/
│   ├── _interview-guide-template.md              # Plantilla de guía de entrevista de usuario canónica
│   ├── interviews/
│   │   ├── 2025-05-onboarding-study/
│   │   │   ├── research-plan.md                  # Objetivo de investigación, criterios de participantes, script
│   │   │   ├── participant-screener.md           # Preguntas de filtro para reclutamiento
│   │   │   ├── notes-p1-2025-05-12.md            # Notas de entrevista — participante 1
│   │   │   ├── notes-p2-2025-05-13.md            # Notas de entrevista — participante 2
│   │   │   ├── notes-p3-2025-05-14.md            # Notas de entrevista — participante 3
│   │   │   ├── notes-p4-2025-05-15.md            # Notas de entrevista — participante 4
│   │   │   ├── notes-p5-2025-05-16.md            # Notas de entrevista — participante 5
│   │   │   └── synthesis-report.md               # Insights sintetizados, temas, citas, recomendaciones
│   │   └── 2025-03-churn-investigation/
│   │       ├── research-plan.md                  # Plan de investigación — estudio de factores de abandono
│   │       ├── notes-p1-2025-03-04.md            # Notas de entrevista
│   │       └── synthesis-report.md               # Síntesis — top 5 temas de abandono, matriz de severidad
│   ├── surveys/
│   │   ├── nps-q2-2025-results.md                # Resultados de encuesta NPS — puntuación, verbatim, desglose por segmento
│   │   ├── onboarding-csat-2025-05.md            # Resultados de encuesta CSAT de onboarding y temas
│   │   └── feature-prioritization-survey.md      # Encuesta de priorización de funcionalidades clasificadas por usuarios (n=240)
│   ├── usability/
│   │   ├── usability-bulk-export-2025-05.md      # Prueba de usabilidad — flujo de exportación masiva (5 participantes)
│   │   └── usability-onboarding-2025-04.md       # Prueba de usabilidad — nuevo onboarding (7 participantes)
│   └── personas/
│       ├── persona-power-user.md                 # Persona usuario avanzado — objetivos, frustraciones, contexto, citas
│       ├── persona-occasional-user.md            # Persona usuario ocasional
│       └── persona-admin.md                      # Persona admin/comprador — criterios de evaluación, objeciones
├── experiments/
│   ├── _experiment-template.md                   # Documento de experimento canónico — hipótesis, métricas, diseño, resultados
│   ├── active/
│   │   ├── exp-042-onboarding-checklist.md       # Activo: prueba de lista de verificación de onboarding vs. estado vacío
│   │   └── exp-043-pricing-page-cta.md           # Activo: prueba de copia CTA de página de precios
│   ├── completed/
│   │   ├── exp-039-search-ranking.md             # Completado: prueba de algoritmo de clasificación de búsqueda — +12% P1 clic
│   │   ├── exp-040-email-nudge-timing.md         # Completado: prueba de tiempo de nudge de email — sin resultado significativo
│   │   └── exp-041-trial-length.md               # Completado: prueba de trial de 14 vs 30 días — 30 días gana (p=0.03)
│   └── hypothesis-backlog.md                     # Backlog de hipótesis sin probar — clasificadas por impacto esperado
├── launches/
│   ├── _launch-checklist-template.md             # Lista de verificación de lanzamiento canónica — ingeniería, diseño, comunicaciones, soporte
│   ├── active/
│   │   ├── launch-bulk-export/
│   │   │   ├── launch-plan.md                    # Plan de lanzamiento completo — cronograma, propietarios, riesgos, despliegue
│   │   │   ├── comms-plan.md                     # Plan de comunicaciones — notas de lanzamiento, blog, en-app, email, Slack
│   │   │   ├── support-brief.md                  # Brief de soporte — FAQs, casos extremos, limitaciones conocidas
│   │   │   └── go-nogo-checklist.md              # Lista de verificación de decisión Go/no-go para el día de lanzamiento
│   │   └── launch-notification-center/
│   │       ├── launch-plan.md                    # Plan de lanzamiento — centro de notificaciones v2
│   │       └── comms-plan.md                     # Plan de comunicaciones — centro de notificaciones v2
│   └── shipped/
│       ├── launch-search-v2-2025-04.md           # Retrospectiva de lanzamiento de Search v2 y métricas 30 días después
│       └── launch-team-permissions-2025-02.md    # Retrospectiva de lanzamiento de permisos de equipo
├── competitive/
│   ├── landscape-overview.md                     # Paisaje competitivo — matriz de posicionamiento, diferenciadores clave
│   ├── competitor-profiles/
│   │   ├── competitor-acme-corp.md               # Perfil competidor — Acme Corp (competidor principal)
│   │   ├── competitor-rival-io.md                # Perfil competidor — Rival.io (amenaza emergente)
│   │   └── competitor-legacy-enterprise.md       # Perfil competidor — Legacy Enterprise (competidor establecido)
│   ├── teardowns/
│   │   ├── teardown-acme-onboarding-2025-05.md   # Análisis UX — flujo de onboarding de Acme Corp
│   │   ├── teardown-rival-pricing-2025-04.md     # Análisis de precios — página de precios y tiers de Rival.io
│   │   └── teardown-legacy-api-2025-03.md        # Análisis API — experiencia de desarrollador de Legacy Enterprise
│   └── battlecards/
│       ├── battlecard-acme-corp.md               # Battlecard de ventas — objeciones, diferenciadores, trampas
│       └── battlecard-rival-io.md                # Battlecard de ventas — Rival.io
└── metrics/
    ├── north-star.md                             # Métrica north star — definición, valor actual, objetivo, propietario
    ├── product-health-dashboard.md               # Instantánea semanal de salud del producto — todos los KPIs principales
    ├── feature-success-metrics/
    │   ├── metrics-onboarding-revamp.md          # Métricas de éxito — rediseño de onboarding (tasa de activación, TTV)
    │   ├── metrics-bulk-export.md                # Métricas de éxito — exportación masiva (adopción, frecuencia de uso)
    │   └── metrics-notification-center.md        # Métricas de éxito — centro de notificaciones (tasa de apertura, CTR)
    ├── amplitude-queries/
    │   ├── query-activation-funnel.md            # Consulta guardada de Amplitude — pasos del embudo de activación
    │   ├── query-feature-adoption.md             # Consulta guardada de Amplitude — adopción de funcionalidades por cohorte
    │   └── query-retention-by-segment.md         # Consulta guardada de Amplitude — retención D1/D7/D30 por segmento
    └── retrospectives/
        ├── metrics-review-q2-2025.md             # Retrospectiva de métricas Q2 — éxitos, fallos, aprendizajes
        └── metrics-review-q1-2025.md             # Retrospectiva de métricas Q1
```

## Ficheros clave explicados

| Ruta | Propósito |
|---|---|
| `.claude/commands/prd-draft.md` | Comando slash que toma una idea de funcionalidad, lee `prds/_prd-template.md`, `roadmap/prioritization-framework.md` y ficheros de personas relevantes, luego genera un PRD completo con declaración de problema, objetivos, historias de usuario, requisitos, métricas de éxito y preguntas abiertas |
| `.claude/commands/experiment-design.md` | Comando slash que lee `experiments/_experiment-template.md` y el PRD relevante, luego genera un experimento completamente diseñado con hipótesis, definición de control/variante, métricas primarias y de salvaguardia, efecto detectable mínimo y tamaño de muestra estimado |
| `.claude/commands/launch-plan.md` | Comando slash que lee el PRD activo y `launches/_launch-checklist-template.md`, luego genera un plan de lanzamiento con cronograma, propietarios multifuncionales, plan de comunicaciones, brief de soporte y criterios go/no-go |
| `roadmap/prioritization-framework.md` | Reglas de puntuación y ponderaciones para RICE o ICE — utilizado por Claude para clasificar elementos de backlog o responder a preguntas "¿deberíamos construir esto?"; mantiene la puntuación consistente entre trimestres |
| `prds/active/` | Un fichero por funcionalidad en vuelo — los PRDs aquí son documentos activos actualizados a medida que las decisiones cambian; nunca eliminar, usar `archived/` para funcionalidades canceladas |
| `research/personas/persona-power-user.md` | Persona de verdad única referenciada en PRDs e hipótesis de experimentos — actualizada después de cada ronda de investigación importante |
| `experiments/hypothesis-backlog.md` | Hipótesis sin probar clasificadas por impacto esperado — Claude lee esto cuando se le pide priorizar el roadmap de experimentos |
| `metrics/north-star.md` | Definición única y autorizada de la métrica north star — Claude lee esto antes de cualquier análisis de métricas para asegurar un framing consistente |
| `competitive/landscape-overview.md` | Matriz de posicionamiento actual — Claude lee esto al redactar análisis competitivos o battlecards para evitar contradecir el posicionamiento existente |
| `launches/active/` | Un subdirectorio por lanzamiento en vuelo, cada uno conteniendo plan de lanzamiento, plan de comunicaciones, brief de soporte y lista de verificación go/no-go como ficheros separados |

## Andamiaje rápido

```bash
# Crear raíz del espacio de trabajo
mkdir -p product-manager-workspace
cd product-manager-workspace

# Crear estructura .claude
mkdir -p .claude/commands

# Crear todos los directorios del espacio de trabajo
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

# Semilla de ficheros de plantilla y anclaje clave
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

# Semilla de ficheros de comandos .claude
touch .claude/commands/prd-draft.md
touch .claude/commands/user-story.md
touch .claude/commands/experiment-design.md
touch .claude/commands/launch-plan.md
touch .claude/commands/competitive-teardown.md
touch .claude/commands/sprint-review.md
touch .claude/commands/discovery-interview.md

# Semilla del CLAUDE.md
touch .claude/CLAUDE.md
touch .claude/settings.json

# Instalar habilidades de Claude Code
npx claudient add skill product/product-roadmap
npx claudient add skill product/user-story-writer
npx claudient add skill product/product-discovery
npx claudient add skill product/experiment-designer
npx claudient add skill product/competitive-teardown
npx claudient add skill product/persona-builder
npx claudient add skill product/product-analytics
npx claudient add skill product/product-strategist
```

## Plantilla CLAUDE.md

```markdown
# Espacio de Trabajo del Gestor de Productos

Este espacio de trabajo es compatible con un gestor de productos que posee descubrimiento, roadmap, entrega y lanzamientos.
Claude Code lee contexto desde ficheros estructurados aquí para producir resultados precisos y específicos del producto — no
consejos genéricos de PM. Siempre lee los ficheros fuente referenciados antes de generar cualquier documento.

---

## Qué es esto

Un espacio de trabajo de Claude Code para un PM. Cada directorio corresponde a un flujo de trabajo PM principal: priorización de roadmap,
redacción de PRD, síntesis de investigación de usuarios, diseño de experimentos, coordinación de lanzamientos, análisis competitivo y
seguimiento de métricas. Claude lee desde estos ficheros y escribe borradores, análisis y salidas estructuradas de vuelta a la misma estructura.

---

## Stack

- Linear — seguimiento de roadmap y sprints (MCP: linear)
- Figma — revisión de diseño y referencias de especificaciones (MCP: figma)
- Notion o Confluence — PRDs y documentos del equipo
- Amplitude o Mixpanel — análisis de productos, embudos, retención
- Dovetail — repositorio de investigación de usuarios y etiquetado de insights
- Jira — tableros de sprints empresariales (cuando la organización lo requiere)
- Slack — comunicaciones de stakeholders y coordinación de lanzamientos (MCP: slack)
- Loom — grabaciones de demostración asincrónicas y revisiones de sprints

---

## Convenciones de directorios

- `roadmap/` — Los ficheros de roadmap se nombran por trimestre: `quarterly-roadmap-Q3-2025.md`.
  `prioritization-framework.md` es la fuente de verdad para decisiones de puntuación. Nunca eliminar
  elementos depriorizados — registrar en `deprioritized-log.md` con razón y fecha.
- `prds/` — Un fichero por funcionalidad. Los PRDs activos viven en `active/`, lanzados en `shipped/`,
  cancelados en `archived/`. Usar `_prd-template.md` para cada PRD nuevo. No omitir secciones.
- `research/` — Las notas de entrevistas van en `interviews/<study-name>/notes-p<n>-YYYY-MM-DD.md`.
  Cada estudio necesita un `research-plan.md` y un `synthesis-report.md` antes de cerrar.
- `experiments/` — Experimentos activos en `active/`, completados en `completed/`. Cada
  documento de experimento debe incluir hipótesis, métricas, justificación del tamaño de muestra y resultados.
  Los resultados nulos no son fallos — archivar apropiadamente en `completed/`.
- `launches/` — Cada lanzamiento obtiene su propio subdirectorio bajo `active/`. Un directorio de lanzamiento
  debe contener: `launch-plan.md`, `comms-plan.md`, `support-brief.md`, `go-nogo-checklist.md`.
  Mover a `shipped/` con una nota retrospectiva después del lanzamiento.
- `competitive/` — `landscape-overview.md` se actualiza trimestralmente. Los análisis son
  instantáneas puntuales — nombrarlas `teardown-<competitor>-<area>-YYYY-MM.md`.
- `metrics/` — `north-star.md` define la métrica north star única. Nunca contradecir esta
  definición en documentos de experimentos o secciones de métricas de éxito de PRD.

---

## Tareas comunes — comandos exactos

### PRD y especificaciones
```
/prd-draft                — Redactar PRD desde idea de funcionalidad usando plantilla canónica
/user-story               — Generar historias de usuario desde PRD o brief
```

### Investigación
```
/discovery-interview      — Generar guía de entrevista desde objetivo de investigación y persona
```

### Experimentos
```
/experiment-design        — Diseñar prueba A/B o multivariada con hipótesis y tamaño de muestra
```

### Lanzamientos
```
/launch-plan              — Construir lista de verificación de lanzamiento y plan de comunicaciones desde PRD activo
```

### Competitivo
```
/competitive-teardown     — Análisis de producto competidor — UX, precios, brechas de posicionamiento
```

### Ritmo de sprint
```
/sprint-review            — Compilar narrativa de revisión de sprint desde tickets de Linear y métricas
```

---

## Convenciones que Claude debe seguir

- Siempre leer `roadmap/prioritization-framework.md` antes de puntuar o clasificar cualquier funcionalidad.
  No inventar una metodología de puntuación.
- Siempre leer `metrics/north-star.md` antes de escribir métricas de éxito en cualquier PRD o experimento.
  Las métricas de éxito deben conectar con la north star.
- Los PRDs deben seguir `prds/_prd-template.md` exactamente — no omitir la sección de preguntas abiertas
  o la tabla de firma.
- Las hipótesis de experimentos deben seguir el formato: "Creemos que [cambio] resultará en [resultado] para
  [segmento de usuario], medido por [métrica], porque [justificación]."
- Los informes de síntesis de investigación deben distinguir citas directas de temas inferidos.
  Las citas usan comillas y un ID de participante (ej. P3). Los temas no usan comillas.
- Los análisis competitivos deben leer `competitive/landscape-overview.md` primero para evitar
  contradecir el posicionamiento existente.
- Los ficheros de personas en `research/personas/` son las descripciones de usuario canónicas. Referenciarse por
  nombre en PRDs e hipótesis de experimentos — no inventar nuevas personas inline.
- Nunca escribir una recomendación de go-live sin leer el `go-nogo-checklist.md` para ese lanzamiento.
```

## Servidores MCP

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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"prds/active/\" && echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"prd-\"; then echo \"[PRD hook] PRD escrito — confirmar que la tabla de firma está completada y las métricas de éxito hacen referencia a metrics/north-star.md.\"; fi'"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"experiments/completed/\"; then echo \"[Experiment hook] Experimento archivado como completado — confirmar que la sección de resultados incluye valor p o intervalo de confianza y una recomendación de ship/iterate/kill.\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"[Session end] Si actualizó roadmap/feature-backlog.md o metrics/north-star.md, confirmar que los cambios se alineen con el roadmap del trimestre actual y que los stakeholders han sido notificados.\"'"
          }
        ]
      }
    ]
  }
}
```

## Habilidades a instalar

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

## Relacionado

- [Guide: Claude for Product Managers](../guides/for-product-manager.md)
- [Workflow: PRD Writing](../workflows/prd-writing.md)
- [Workflow: Launch Coordination](../workflows/launch-coordination.md)
- [Workflow: User Research Synthesis](../workflows/user-research-synthesis.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
