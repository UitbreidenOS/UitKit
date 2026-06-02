# Negocio de Cursos en Línea — Estructura del Proyecto

> Un espacio de trabajo para creadores de cursos o educadores para diseñar currículos, lanzar productos de conocimiento, gestionar comunidades de estudiantes y rastrear ingresos de inscripción — impulsado por comandos de barra inclinada y contexto por curso.

## Stack

- **Teachable** / **Kajabi** / **Thinkific** — alojamiento de cursos, contenido de goteo, seguimiento del progreso del estudiante, certificados
- **ConvertKit** / **ActiveCampaign** — secuencias de correo electrónico, etiquetado de suscriptores, campañas de transmisión, reglas de automatización
- **Loom** / **Descript** — grabación de video asincrónico, captura de pantalla, edición de transcripciones, correcciones de overdub
- **Circle** / **Skool** — comunidad de estudiantes, espacios de cohorte, hilos de discusión, hitos de miembros
- **Stripe** — procesamiento de pagos, facturación de suscripción, códigos de cupón, gestión de reembolsos
- **Canva** — gráficos de cursos, maquetas de páginas de ventas, activos de redes sociales, plantillas de certificados
- **Notion** — tableros de planificación curricular, scripting de lecciones, calendarios de lanzamiento, procedimientos operativos
- **Calendly** — reservas de llamadas de coaching 1:1, programación de horario de oficina, llamadas de incorporación
- **Zapier** — automatizaciones entre plataformas (nueva compra → correo de bienvenida, invitación comunitaria, etiqueta en ConvertKit)

## Árbol de directorios

```
online-course-business/
├── .claude/
│   ├── CLAUDE.md                                        # workspace instructions for Claude Code
│   ├── settings.json                                    # MCP servers, hooks, permissions
│   └── commands/
│       ├── new-course.md                                # /new-course <title> — scaffolds full courses/ subdirectory
│       ├── lesson-script.md                             # /lesson-script <module> <lesson-title> — writes full lesson script with intro hook, teaching points, CTA
│       ├── email-sequence.md                            # /email-sequence <sequence-name> <num-emails> — drafts nurture or launch sequence
│       ├── launch-plan.md                               # /launch-plan <course-slug> <launch-date> — full pre/during/post launch calendar
│       ├── sales-page.md                                # /sales-page <course-slug> — drafts long-form sales page copy from curriculum outline
│       ├── support-reply.md                             # /support-reply <ticket-summary> — drafts empathetic, policy-aligned support response
│       ├── weekly-prompt.md                             # /weekly-prompt <community-platform> — generates this week's community engagement prompt
│       └── revenue-snapshot.md                         # /revenue-snapshot — reads analytics files and summarizes enrollment + revenue trends
├── courses/
│   ├── _template/                                       # copy this directory when creating a new course
│   │   ├── curriculum-outline.md                        # module and lesson map with learning objectives per lesson
│   │   ├── student-guide.md                             # student-facing welcome doc: what to expect, how to navigate, next steps
│   │   ├── assessment-rubric.md                         # grading criteria for any assignments or project submissions
│   │   ├── lesson-scripts/
│   │   │   └── m01-l01-template.md                      # lesson script template: hook, teach, demonstrate, practice, CTA
│   │   └── slides-notes/
│   │       └── m01-l01-slides-notes.md                  # slide-by-slide speaker notes keyed to lesson script
│   ├── accelerate-with-ai/                              # example course: "Accelerate With AI"
│   │   ├── curriculum-outline.md                        # 6-module map: setup → prompting → automation → content → ops → scale
│   │   ├── student-guide.md                             # onboarding doc linked from welcome email
│   │   ├── assessment-rubric.md                         # capstone project rubric: use case clarity, prompt quality, output value
│   │   ├── lesson-scripts/
│   │   │   ├── m01-l01-what-is-ai-for-business.md       # hook: "You're already behind" → context → Claude demo → assignment
│   │   │   ├── m01-l02-setting-up-claude-code.md
│   │   │   ├── m02-l01-prompt-fundamentals.md
│   │   │   ├── m02-l02-chain-of-thought-prompting.md
│   │   │   ├── m02-l03-prompt-templates.md
│   │   │   ├── m03-l01-zapier-ai-automations.md
│   │   │   ├── m03-l02-make-scenarios.md
│   │   │   ├── m04-l01-content-at-scale.md
│   │   │   ├── m04-l02-social-repurposing.md
│   │   │   ├── m05-l01-ai-for-ops.md
│   │   │   └── m06-l01-building-your-ai-stack.md
│   │   └── slides-notes/
│   │       ├── m01-l01-slides-notes.md
│   │       ├── m01-l02-slides-notes.md
│   │       ├── m02-l01-slides-notes.md
│   │       ├── m02-l02-slides-notes.md
│   │       └── m02-l03-slides-notes.md
│   └── freelance-to-agency/                             # second course: "Freelance to Agency"
│       ├── curriculum-outline.md                        # 5-module map: positioning → offers → hiring → systems → scale
│       ├── student-guide.md
│       ├── assessment-rubric.md
│       ├── lesson-scripts/
│       │   ├── m01-l01-positioning-statement.md
│       │   ├── m01-l02-niche-selection-framework.md
│       │   ├── m02-l01-packaging-your-offer.md
│       │   ├── m02-l02-pricing-strategy.md
│       │   ├── m03-l01-your-first-hire.md
│       │   └── m04-l01-client-delivery-sop.md
│       └── slides-notes/
│           ├── m01-l01-slides-notes.md
│           └── m01-l02-slides-notes.md
├── marketing/
│   ├── launch-plan.md                                   # master launch calendar: pre-launch → cart open → cart close → post-launch
│   ├── sales-page-copy.md                               # long-form sales page: headline, VSL script, benefits, FAQs, guarantee, CTAs
│   ├── social-calendar.md                               # 30-day content grid: platform, post type, copy angle, asset needed
│   ├── email-sequences/
│   │   ├── welcome-sequence.md                          # 5-email welcome: day 0 login, day 1 quick win, day 3 module 1, day 7 check-in, day 14 milestone
│   │   ├── pre-launch-waitlist.md                       # 7-email waitlist build: problem agitation → solution teasing → social proof → early-bird CTA
│   │   ├── launch-sequence.md                           # 10-email cart-open sequence: open → value → faq → close → last-chance
│   │   ├── post-purchase-nurture.md                     # 4-email post-buy sequence: confirm → access → first win → upsell to coaching
│   │   ├── re-engagement.md                             # 3-email win-back for subscribers inactive 90+ days
│   │   └── affiliate-onboarding.md                      # 4-email sequence for new affiliates: assets → swipe copy → tracking links → bonus structure
│   └── webinar-scripts/
│       ├── masterclass-free.md                          # free training script: 60-min value-heavy presentation with pitch at minute 45
│       └── sales-webinar.md                             # live launch webinar: backstory → framework → case studies → offer → Q&A
├── community/
│   ├── onboarding-message.md                            # pinned welcome post for Circle/Skool: rules, how to navigate, first post prompt
│   ├── weekly-prompts.md                                # 52-week log of community engagement prompts — one per week
│   ├── member-milestones.md                             # milestone celebration templates: module 1 complete, halfway, graduation, testimonial ask
│   └── moderation-guidelines.md                        # community rules, violation tiers, ban criteria, escalation path
├── operations/
│   ├── student-support-templates.md                     # canned responses: login issues, refund requests, billing questions, access extensions
│   ├── refund-policy.md                                 # 30-day satisfaction guarantee terms, how to request, processing timeline
│   ├── affiliate-program.md                             # commission structure (30%), cookie window, payout schedule, prohibited promo methods
│   ├── pricing-strategy.md                              # tier logic, payment plans, coupon strategy, evergreen vs launch pricing
│   ├── onboarding-sop.md                                # step-by-step: new student → Teachable access → Circle invite → ConvertKit tag → Calendly link
│   └── zapier-automations.md                            # documented Zap inventory: trigger → filter → action for each live automation
├── analytics/
│   ├── enrollment-tracker.md                            # monthly enrollment counts by course, channel, campaign source
│   ├── completion-rates.md                              # module-by-module completion % and drop-off points by cohort
│   ├── revenue-dashboard.md                             # MRR, LTV, refund rate, affiliate payouts — updated monthly
│   └── email-metrics.md                                 # open rates, CTRs, unsubscribes by sequence and broadcast — tracked weekly
└── assets/
    ├── canva-templates.md                               # links to shared Canva library: thumbnails, social posts, certificate, sales-page graphics
    ├── brand-guide.md                                   # hex colors, fonts, logo usage, tone of voice, do/don't examples
    └── loom-recordings-log.md                           # inventory of Loom links by module and lesson with recording date and status
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `.claude/commands/lesson-script.md` | Comando de barra inclinada que lee el `curriculum-outline.md` del curso y el objetivo de aprendizaje del módulo objetivo, luego escribe un script de lección completo con un gancho que interrumpe el patrón, tres puntos de enseñanza, un segmento de demostración, un ejercicio de práctica y una CTA clara — listo para grabar en Loom o Descript |
| `.claude/commands/email-sequence.md` | Acepta un nombre de secuencia y un número de correos electrónicos, lee el esquema `courses/` correspondiente para obtener contexto y redacta cada correo electrónico con línea de asunto, texto de vista previa, cuerpo y CTA — formato listo para ConvertKit |
| `.claude/commands/sales-page.md` | Lee el `curriculum-outline.md`, `student-guide.md` y `assessment-rubric.md` de un curso, luego redacta una página de ventas de forma larga con script VSL, viñetas de beneficios, desglose módulo por módulo, preguntas frecuentes, bloque de garantía y múltiples CTAs |
| `.claude/commands/support-reply.md` | Toma un resumen de ticket, lee `operations/refund-policy.md` y `operations/student-support-templates.md`, y redacta una respuesta alineada con la política y empática — marca casos extremos que necesitan escalada humana |
| `courses/<slug>/curriculum-outline.md` | Fuente de verdad para cada curso: títulos de módulos, títulos de lecciones y un objetivo de aprendizaje de una línea por lección — todos los demás comandos leen este archivo primero |
| `marketing/launch-plan.md` | Calendario de lanzamiento maestro con fases previa al lanzamiento (30 días), carrito abierto (7 días) y posterior al lanzamiento (14 días) — cada día tiene un canal, tarea y ángulo de copia |
| `operations/zapier-automations.md` | Inventario vivo de cada Zap activo: evento desencadenante, filtros y pasos de acción — previene automatizaciones duplicadas y acelera la depuración |
| `analytics/revenue-dashboard.md` | Instantánea de ingresos mensuales: ingresos brutos, reembolsos, neto, MRR por curso, LTV por canal de adquisición — el comando `/revenue-snapshot` lee y resume esto |

## Andamiaje rápido

```bash
# Create workspace root and Claude config
mkdir -p online-course-business/.claude/commands

# Create course template
mkdir -p online-course-business/courses/_template/lesson-scripts
mkdir -p online-course-business/courses/_template/slides-notes

# Create example course directories
mkdir -p online-course-business/courses/accelerate-with-ai/lesson-scripts
mkdir -p online-course-business/courses/accelerate-with-ai/slides-notes
mkdir -p online-course-business/courses/freelance-to-agency/lesson-scripts
mkdir -p online-course-business/courses/freelance-to-agency/slides-notes

# Create marketing directories
mkdir -p online-course-business/marketing/email-sequences
mkdir -p online-course-business/marketing/webinar-scripts

# Create community, operations, analytics, and assets directories
mkdir -p online-course-business/community
mkdir -p online-course-business/operations
mkdir -p online-course-business/analytics
mkdir -p online-course-business/assets

# Stub out slash commands
touch online-course-business/.claude/commands/new-course.md
touch online-course-business/.claude/commands/lesson-script.md
touch online-course-business/.claude/commands/email-sequence.md
touch online-course-business/.claude/commands/launch-plan.md
touch online-course-business/.claude/commands/sales-page.md
touch online-course-business/.claude/commands/support-reply.md
touch online-course-business/.claude/commands/weekly-prompt.md
touch online-course-business/.claude/commands/revenue-snapshot.md

# Stub out course template files
touch online-course-business/courses/_template/curriculum-outline.md
touch online-course-business/courses/_template/student-guide.md
touch online-course-business/courses/_template/assessment-rubric.md
touch online-course-business/courses/_template/lesson-scripts/m01-l01-template.md
touch online-course-business/courses/_template/slides-notes/m01-l01-slides-notes.md

# Stub out marketing files
touch online-course-business/marketing/launch-plan.md
touch online-course-business/marketing/sales-page-copy.md
touch online-course-business/marketing/social-calendar.md
touch online-course-business/marketing/email-sequences/welcome-sequence.md
touch online-course-business/marketing/email-sequences/pre-launch-waitlist.md
touch online-course-business/marketing/email-sequences/launch-sequence.md
touch online-course-business/marketing/email-sequences/post-purchase-nurture.md
touch online-course-business/marketing/email-sequences/re-engagement.md
touch online-course-business/marketing/email-sequences/affiliate-onboarding.md
touch online-course-business/marketing/webinar-scripts/masterclass-free.md
touch online-course-business/marketing/webinar-scripts/sales-webinar.md

# Stub out community files
touch online-course-business/community/onboarding-message.md
touch online-course-business/community/weekly-prompts.md
touch online-course-business/community/member-milestones.md
touch online-course-business/community/moderation-guidelines.md

# Stub out operations files
touch online-course-business/operations/student-support-templates.md
touch online-course-business/operations/refund-policy.md
touch online-course-business/operations/affiliate-program.md
touch online-course-business/operations/pricing-strategy.md
touch online-course-business/operations/onboarding-sop.md
touch online-course-business/operations/zapier-automations.md

# Stub out analytics files
touch online-course-business/analytics/enrollment-tracker.md
touch online-course-business/analytics/completion-rates.md
touch online-course-business/analytics/revenue-dashboard.md
touch online-course-business/analytics/email-metrics.md

# Stub out assets files
touch online-course-business/assets/canva-templates.md
touch online-course-business/assets/brand-guide.md
touch online-course-business/assets/loom-recordings-log.md

# Install relevant skills
npx claudient add skill productivity/lesson-planner
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/exec-briefing
npx claudient add skill data-ml/de/stakeholder-report
```

## Plantilla CLAUDE.md

```markdown
# Negocio de Cursos en Línea — Instrucciones de Claude Code

## Qué es esto

Este es un espacio de trabajo para creadores de cursos. Contiene currículos para múltiples cursos, copias de marketing y secuencias de correo electrónico, contenido de gestión comunitaria, operaciones de soporte estudiantil y análisis de ingresos. Claude Code opera aquí como escritor curricular, redactor de lanzamiento, redactor de soporte y resumidor de análisis — siempre leyendo contexto por curso antes de generar cualquier resultado.

Nunca inventes estructura curricular. Siempre lee el curriculum-outline.md relevante primero.

## Stack

- Plataforma de cursos: Teachable / Kajabi / Thinkific — alojamiento, goteo, seguimiento de progreso
- Correo electrónico: ConvertKit / ActiveCampaign — secuencias, transmisiones, etiquetado de suscriptores
- Video: Loom / Descript — grabación de lecciones, edición de transcripciones, overdub
- Comunidad: Circle / Skool — discusiones, espacios de cohorte, hitos
- Pagos: Stripe — pagos únicos, planes de pago, suscripciones, reembolsos
- Gráficos: Canva — miniaturas, activos de ventas, certificados
- Planificación: Notion — tableros curriculares, calendarios de lanzamiento, procedimientos operativos
- Programación: Calendly — llamadas de coaching, horario de oficina, llamadas de incorporación
- Automatización: Zapier — activadores entre plataformas (compra → acceso → correo → comunidad)

## Tareas comunes y comandos exactos

Andamiar un nuevo curso:
  /new-course <title>
  → Crea courses/<slug>/ con curriculum-outline.md, student-guide.md, assessment-rubric.md,
    lesson-scripts/ y slides-notes/ desde el directorio _template

Escribe un script de lección:
  /lesson-script <course-slug> <module-number> <lesson-title>
  → Lee courses/<slug>/curriculum-outline.md para el objetivo de la lección, luego escribe un script completo:
    gancho de interrupción de patrón, tres puntos de enseñanza, demostración, ejercicio de práctica, CTA

Redacta una secuencia de correo electrónico:
  /email-sequence <sequence-name> <num-emails>
  → Lee el esquema de curso relevante para obtener contexto; redacta cada correo electrónico con asunto, texto de vista previa,
    cuerpo y CTA en formato compatible con ConvertKit

Escribe un plan de lanzamiento:
  /launch-plan <course-slug> <launch-date>
  → Lee marketing/launch-plan.md para la estructura; genera un calendario fechado previa al lanzamiento/carrito abierto/
    post-lanzamiento con tarea, canal y ángulo de copia para cada día

Redacta una página de ventas:
  /sales-page <course-slug>
  → Lee curriculum-outline.md, student-guide.md; escribe copia de forma larga con script VSL,
    viñetas de beneficios, desglose de módulos, preguntas frecuentes, bloque de garantía y CTAs

Responde a un ticket de soporte:
  /support-reply <ticket-summary>
  → Lee operations/refund-policy.md y operations/student-support-templates.md; redacta una respuesta
    alineada con la política y empática; marca activadores de escalada

Genera un aviso comunitario:
  /weekly-prompt <platform>
  → la plataforma es una de: circle / skool / slack
  → Escribe el aviso de compromiso de esta semana haciendo referencia a la fase de curso actual de la comunidad

Resumen de ingresos:
  /revenue-snapshot
  → Lee analytics/revenue-dashboard.md, analytics/enrollment-tracker.md; genera un resumen limpio
    de MRR/inscripción/reembolso con llamadas de tendencia

## Flujo de trabajo de diseño curricular

1. Redacta curriculum-outline.md — módulos, lecciones, objetivo de una línea por lección
2. Escribe lesson-scripts/ en orden — usa /lesson-script para cada lección
3. Añade slides-notes/ alineados con el script de lección línea por línea
4. Escribe student-guide.md — navegación, expectativas, primer paso de victoria rápida
5. Escribe assessment-rubric.md — criterios y pesos de puntos para cualquier asignación
6. Graba en Loom o Descript — registra el enlace en assets/loom-recordings-log.md

## Orden de secuencia de lanzamiento

1. marketing/email-sequences/pre-launch-waitlist.md — activa 30 días antes de abrir carrito
2. marketing/webinar-scripts/masterclass-free.md — ejecuta 7 días antes de abrir carrito
3. marketing/sales-page-copy.md — publica en el día de apertura del carrito
4. marketing/email-sequences/launch-sequence.md — activa en apertura de carrito
5. marketing/launch-plan.md — ejecución de tareas diarias hasta cierre de carrito
6. marketing/email-sequences/post-purchase-nurture.md — activa en activador de compra en Stripe/Zapier

## Triaje de soporte estudiantil

Nivel 1 — autoservicio (usa /support-reply): problemas de inicio de sesión, retrasos de acceso, recibos de facturación,
  preguntas sobre cómo navegar → coincide con respuesta enlatada en operations/student-support-templates.md

Nivel 2 — requiere criterio (redacta + marca para revisión): solicitudes de reembolso dentro de la ventana de 30 días,
  solicitudes de extensión de acceso, problemas técnicos de reproducción → lee refund-policy.md antes de redactar

Nivel 3 — escala inmediatamente (no redactes): contracargos, denuncias legales, reportes de acoso,
  fraude de afiliados → nota en ticket y ruta a humano

## Convenciones del espacio de trabajo

- Los directorios de cursos se nombran con slugs en kebab-case que coinciden con el slug URL de Teachable/Kajabi
- Los scripts de lecciones se nombran m<module-number>-l<lesson-number>-<slug>.md (p. ej., m02-l03-prompt-templates.md)
- Las notas de diapositivas se nombran idénticamente a los scripts de lecciones con sufijo -slides-notes
- Las secuencias de correo electrónico usan prefijos numerados cuando el orden importa: 01-day0-welcome.md, 02-day1-quick-win.md
- Todas las fechas de lanzamiento en marketing/ usan ISO 8601 (YYYY-MM-DD) — sin formatos de fecha ambiguos
- Registra cada nueva automatización de Zapier en operations/zapier-automations.md el día que se activó

## No hagas

- No escribas scripts de lecciones sin leer primero el curriculum-outline.md de ese curso
- No redactes una página de ventas sin leer lo que realmente enseña el curso — sin afirmaciones fabricadas
- No apruebes reembolsos ni otorgues extensiones de acceso — /support-reply solo borradores, el humano envía
- No almacenes direcciones de correo electrónico de estudiantes, IDs de cliente de Stripe o datos de pago en ningún archivo del espacio de trabajo
- No confirmes archivos analytics/ que contengan registros individuales de estudiantes en ningún repositorio remoto
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
        "/Users/$USER/online-course-business/courses",
        "/Users/$USER/online-course-business/marketing",
        "/Users/$USER/online-course-business/operations",
        "/Users/$USER/online-course-business/analytics"
      ]
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/mcp-server-notion"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
      }
    },
    "convertkit": {
      "command": "npx",
      "args": ["-y", "@convertkit/mcp-server"],
      "env": {
        "CONVERTKIT_API_KEY": "${CONVERTKIT_API_KEY}",
        "CONVERTKIT_API_SECRET": "${CONVERTKIT_API_SECRET}"
      }
    },
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp-server"],
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
            "command": "if echo \"$CLAUDE_TOOL_INPUT\" | python3 -c \"import sys,json; p=json.load(sys.stdin).get('path',''); print(p)\" 2>/dev/null | grep -q 'lesson-scripts/'; then echo '[course-business] Lesson script written — confirm a matching slides-notes/ file exists and the Loom recording is logged in assets/loom-recordings-log.md.'; fi"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$CLAUDE_TOOL_INPUT\" | python3 -c \"import sys,json; p=json.load(sys.stdin).get('path',''); print(p)\" 2>/dev/null | grep -q 'email-sequences/'; then echo '[course-business] Email sequence written — verify subject lines are under 50 characters and each email has a single clear CTA before loading into ConvertKit.'; fi"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '[course-business] Session ended. Reminder: update analytics/enrollment-tracker.md if any new enrollments were processed, and log any new Zapier automations in operations/zapier-automations.md.'"
          }
        ]
      }
    ]
  }
}
```

## Habilidades para instalar

```bash
npx claudient add skill productivity/lesson-planner
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/doc-site-builder
npx claudient add skill data-ml/stakeholder-report
```

## Relacionado

- [Course Creator Guide](../guides/for-course-creator.md)
- [Course Launch Workflow](../workflows/course-launch.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
