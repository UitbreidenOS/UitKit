# Espacio de Trabajo de Educador / Profesor — Estructura del Proyecto

> Un espacio de trabajo de Claude Code para maestros de educación primaria y secundaria, e instructores universitarios que gestionan planificación diaria de lecciones, diseño curricular, instrucción diferenciada, creación de evaluaciones, retroalimentación estudiantil y comunicación con padres/administradores — todo impulsado por comandos de barra y contexto de nivel de curso.

## Stack

- **Google Classroom** o **Canvas LMS** — distribución de tareas, libro de calificaciones, seguimiento de envíos de estudiantes
- **Google Workspace** (Docs, Slides, Forms, Drive) — documentos de lecciones, presentaciones, cuestionarios, recursos compartidos
- **Notion** — tableros de planificación curricular, mapas de unidades, calendarios semestrales
- **Turnitin** — verificaciones de integridad académica en trabajos enviados
- **Kahoot** o **Pear Deck** — evaluaciones formativas interactivas y encuestas en vivo
- **Slack** o **Microsoft Teams** — comunicación del personal y departamento
- **Google Meet** o **Zoom** — conferencias con padres, instrucción remota, horarios de oficina

## Árbol de directorios

```
educator-workspace/
├── .claude/
│   ├── CLAUDE.md                                    # instrucciones del espacio de trabajo para Claude Code
│   ├── settings.json                                # servidores MCP, hooks, permisos
│   └── commands/
│       ├── lesson-plan.md                           # /lesson-plan <tema> <nivel-grado> — plan de lección completo con objetivos, actividades, comprobaciones
│       ├── assignment-builder.md                    # /assignment-builder — crea indicación de tarea con instrucciones y criterios de envío
│       ├── rubric-creator.md                        # /rubric-creator — genera rúbrica puntuada para cualquier tipo de tarea
│       ├── student-feedback.md                      # /student-feedback <id-estudiante> — genera retroalimentación escrita personalizada
│       ├── parent-email.md                          # /parent-email <id-estudiante> <tema> — redacta comunicación con padres por tono y contexto
│       ├── differentiation.md                       # /differentiation <archivo-lección> — produce versiones escalonadas de una lección para 3 niveles
│       └── quiz-builder.md                          # /quiz-builder <tema> <num-preguntas> — crea cuestionario con clave de respuestas y rúbrica
├── curriculum/
│   ├── sy2025-2026/                                 # raíz del año académico
│   │   ├── scope-and-sequence.md                   # mapa de unidades de todo el año con alineación de estándares y ritmo
│   │   ├── semester-1/
│   │   │   ├── unit-01-introduction/
│   │   │   │   ├── unit-overview.md                # preguntas esenciales, comprensiones duraderas, estándares (p. ej., CCSS.ELA-LITERACY.RI.6.1)
│   │   │   │   ├── pacing-guide.md                 # cronograma día a día, puntos de referencia de control
│   │   │   │   └── standards-alignment.md          # mapeado a estándares estatales/nacionales con enlaces de evidencia
│   │   │   ├── unit-02-narrative-writing/
│   │   │   │   ├── unit-overview.md
│   │   │   │   ├── pacing-guide.md
│   │   │   │   └── standards-alignment.md
│   │   │   └── unit-03-research-skills/
│   │   │       ├── unit-overview.md
│   │   │       ├── pacing-guide.md
│   │   │       └── standards-alignment.md
│   │   └── semester-2/
│   │       ├── unit-04-argumentative-writing/
│   │       │   ├── unit-overview.md
│   │       │   ├── pacing-guide.md
│   │       │   └── standards-alignment.md
│   │       └── unit-05-literature-circles/
│   │           ├── unit-overview.md
│   │           ├── pacing-guide.md
│   │           └── standards-alignment.md
├── lessons/
│   ├── _template/                                   # copiar esto al crear una nueva lección
│   │   ├── lesson-plan.md                           # objetivos de aprendizaje, materiales, procedimiento, comprobaciones de comprensión, cierre
│   │   ├── slides-outline.md                        # esquema de presentación de Google Slides (título, calentamiento, instrucción directa, práctica, ticket de salida)
│   │   └── differentiation-notes.md                 # andamios y extensiones por debajo del nivel de grado, a nivel de grado y por encima del nivel de grado
│   ├── 2026-09-08-intro-to-thesis-statements/
│   │   ├── lesson-plan.md                           # plan de bloque de 50 minutos; estándar CCSS.ELA-LITERACY.W.6.1a
│   │   ├── slides-outline.md
│   │   └── differentiation-notes.md                 # marcos de oración para estudiantes ELL, extensión de seminario socrático
│   ├── 2026-09-15-evidence-based-claims/
│   │   ├── lesson-plan.md
│   │   ├── slides-outline.md
│   │   └── differentiation-notes.md
│   └── 2026-10-01-peer-review-workshop/
│       ├── lesson-plan.md
│       ├── slides-outline.md
│       └── differentiation-notes.md
├── assessments/
│   ├── quizzes/
│   │   ├── unit-01-vocab-quiz.md                    # cuestionario de 15 preguntas con clave de respuestas y formato de importación de Kahoot
│   │   ├── unit-02-narrative-elements-quiz.md
│   │   └── unit-03-research-skills-check.md
│   ├── rubrics/
│   │   ├── narrative-essay-rubric.md                # rúbrica de 4 puntos: ideas, organización, voz, convenciones
│   │   ├── research-paper-rubric.md                 # rúbrica de 4 puntos: tesis, evidencia, citación, mecánica
│   │   ├── participation-rubric.md                  # guía de puntuación de participación en discusión y clase
│   │   └── presentation-rubric.md                  # criterios de presentación oral: contenido, entrega, elementos visuales
│   └── projects/
│       ├── semester-1-research-project.md           # indicación de proyecto de varias semanas con fechas de hitos y rúbrica
│       └── semester-2-argument-essay.md             # indicación de ensayo de culminación con instrucciones de envío de Turnitin
├── student-data/
│   ├── README.md                                    # nota: todos los IDs de estudiantes están anonimizados — no se almacenan nombres ni fechas de nacimiento aquí
│   ├── class-roster.md                              # IDs de estudiantes, período, marcas de IEP/504, estado ELL (sin PII)
│   ├── progress-tracker.md                          # tasas de finalización de tareas y bandas de calificación por ID de estudiante
│   ├── iep-accommodations.md                        # tipos de acomodación por ID de estudiante — utilizado por el comando /differentiation
│   └── intervention-log.md                          # registro fechado de intervenciones por ID de estudiante, estrategia utilizada, resultado
├── parent-comms/
│   ├── templates/
│   │   ├── positive-update-template.md              # comunicación cálida para desempeño fuerte o crecimiento
│   │   ├── concern-template.md                      # tono medido para preocupación académica o conductual
│   │   ├── conference-invite-template.md            # correo electrónico de invitación a conferencia de padres y maestros
│   │   └── missing-work-template.md                 # primer y segundo aviso de tareas faltantes
│   └── sent-log/
│       ├── 2026-09-log.md                           # lista fechada de comunicaciones enviadas con ID de estudiante y tema
│       └── 2026-10-log.md
├── resources/
│   ├── standards/
│   │   ├── ccss-ela-grade6.md                       # estándares de Núcleo Común relevantes extraídos para referencia rápida
│   │   └── state-standards-crosswalk.md             # estándares locales estatales mapeados contra CCSS
│   ├── media-links.md                               # enlaces curados de video, podcast y artículos por unidad
│   └── professional-development/
│       ├── pd-notes-2025-08-15.md                   # notas de la sesión de desarrollo profesional de verano
│       └── instructional-strategies.md              # referencia: UDL, seminario socrático, pensar-emparejar-compartir, jigsaw
└── feedback/
    ├── templates/
    │   ├── formative-feedback-template.md           # retroalimentación escrita de bajo riesgo para borradores y trabajo en clase
    │   ├── summative-feedback-template.md           # retroalimentación al final de la tarea alineada con categorías de rúbrica
    │   └── growth-mindset-feedback-template.md      # lenguaje centrado en el esfuerzo para estudiantes con dificultades
    └── sent/
        ├── 2026-09-narrative-essay-feedback.md      # registro de retroalimentación por lotes: ID de estudiante, banda de puntuación, retroalimentación enviada
        └── 2026-10-research-draft-feedback.md
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `.claude/commands/lesson-plan.md` | Comando de barra que acepta `$ARGUMENTS` como `<tema> <nivel-grado>`, lee la descripción general de la unidad relevante y la alineación de estándares, y genera un plan de lección completo de 50 minutos con objetivos, calentamiento, instrucción directa, práctica guiada y ticket de salida |
| `.claude/commands/differentiation.md` | Lee un archivo lesson-plan.md y las acomodaciones de IEP de estudiantes coincidentes, luego produce tres versiones escalonadas: por debajo del nivel de grado con marcos de oración, a nivel de grado según está escrito, por encima del nivel de grado con tareas de extensión |
| `.claude/commands/student-feedback.md` | Toma un ID de estudiante, lee su entrada de progress-tracker y la rúbrica relevante, y genera retroalimentación escrita específica con lenguaje del próximo paso — nunca elogios genéricos |
| `.claude/commands/parent-email.md` | Toma ID de estudiante y tipo de tema (positivo/preocupación/trabajo-faltante), lee el sent-log para evitar duplicación, selecciona la plantilla correcta y redacta un correo electrónico listo para enviar |
| `curriculum/sy2025-2026/scope-and-sequence.md` | Mapa de unidades de todo el año con alineación de estándares y ritmo — la fuente de verdad que todos los planes de lección y evaluaciones hacen referencia |
| `student-data/iep-accommodations.md` | Tipos de acomodación indexados por ID de estudiante — leído por el comando `/differentiation` para producir materiales correctamente andamiados sin exponer PII de estudiantes |
| `assessments/rubrics/` | Rúbricas puntuadas para todos los tipos de tareas principales — referenciadas por `/rubric-creator`, `/student-feedback` y `/quiz-builder` para asegurar que la retroalimentación esté alineada con la rúbrica |
| `parent-comms/sent-log/` | Registro mensual de todas las comunicaciones con padres con ID de estudiante y tema — previene comunicaciones duplicadas y proporciona registro de auditoría para revisión administrativa |

## Andamio rápido

```bash
# Crear raíz del espacio de trabajo y configuración de Claude
mkdir -p educator-workspace/.claude/commands

# Crear árbol curricular para el año escolar actual
mkdir -p educator-workspace/curriculum/sy2025-2026/semester-1/unit-01-introduction
mkdir -p educator-workspace/curriculum/sy2025-2026/semester-1/unit-02-narrative-writing
mkdir -p educator-workspace/curriculum/sy2025-2026/semester-1/unit-03-research-skills
mkdir -p educator-workspace/curriculum/sy2025-2026/semester-2/unit-04-argumentative-writing
mkdir -p educator-workspace/curriculum/sy2025-2026/semester-2/unit-05-literature-circles

# Crear directorio de lecciones con plantilla
mkdir -p educator-workspace/lessons/_template

# Crear directorios de evaluaciones
mkdir -p educator-workspace/assessments/quizzes
mkdir -p educator-workspace/assessments/rubrics
mkdir -p educator-workspace/assessments/projects

# Crear directorio de datos de estudiantes
mkdir -p educator-workspace/student-data

# Crear directorios de comunicaciones con padres
mkdir -p educator-workspace/parent-comms/templates
mkdir -p educator-workspace/parent-comms/sent-log

# Crear directorios de recursos
mkdir -p educator-workspace/resources/standards
mkdir -p educator-workspace/resources/professional-development

# Crear directorios de retroalimentación
mkdir -p educator-workspace/feedback/templates
mkdir -p educator-workspace/feedback/sent

# Crear archivos de comando de barra
touch educator-workspace/.claude/commands/lesson-plan.md
touch educator-workspace/.claude/commands/assignment-builder.md
touch educator-workspace/.claude/commands/rubric-creator.md
touch educator-workspace/.claude/commands/student-feedback.md
touch educator-workspace/.claude/commands/parent-email.md
touch educator-workspace/.claude/commands/differentiation.md
touch educator-workspace/.claude/commands/quiz-builder.md

# Crear archivos de plantilla de lección
touch educator-workspace/lessons/_template/lesson-plan.md
touch educator-workspace/lessons/_template/slides-outline.md
touch educator-workspace/lessons/_template/differentiation-notes.md

# Crear archivos de datos de estudiantes
touch educator-workspace/student-data/README.md
touch educator-workspace/student-data/class-roster.md
touch educator-workspace/student-data/progress-tracker.md
touch educator-workspace/student-data/iep-accommodations.md
touch educator-workspace/student-data/intervention-log.md

# Crear plantillas de comunicaciones con padres
touch educator-workspace/parent-comms/templates/positive-update-template.md
touch educator-workspace/parent-comms/templates/concern-template.md
touch educator-workspace/parent-comms/templates/conference-invite-template.md
touch educator-workspace/parent-comms/templates/missing-work-template.md

# Crear plantillas de retroalimentación
touch educator-workspace/feedback/templates/formative-feedback-template.md
touch educator-workspace/feedback/templates/summative-feedback-template.md
touch educator-workspace/feedback/templates/growth-mindset-feedback-template.md

# Crear archivos ancla curriculares
touch educator-workspace/curriculum/sy2025-2026/scope-and-sequence.md

# Instalar habilidades de educador
npx claudient add skill productivity/lesson-planner
npx claudient add skill productivity/student-feedback-analyzer
npx claudient add skill productivity/rubric-creator
npx claudient add skill productivity/assignment-builder
npx claudient add skill productivity/differentiation
npx claudient add skill productivity/parent-email
```

## Plantilla CLAUDE.md

```markdown
# Espacio de Trabajo de Educador — Instrucciones de Claude Code

## Qué es esto

Este es un espacio de trabajo para instructor de educación primaria/secundaria o universidad. Contiene planes curriculares, planes de lecciones individuales, evaluaciones, datos de progreso de estudiantes y plantillas de comunicación con padres.
Claude Code opera aquí como asistente de currículo e instrucción — leyendo contexto de curso para generar materiales educativos alineados con estándares, diferenciados y referenciados por rúbricas.

Todos los datos de estudiantes están anonimizados. Los IDs de estudiantes se utilizan en todo — nunca use nombres de estudiantes reales en contenido generado o archivos almacenados.

## Stack

- LMS: Google Classroom o Canvas — distribución de tareas, libro de calificaciones, envíos
- Documentos: Google Workspace (Docs, Slides, Forms) — materiales de lecciones, evaluaciones
- Planificación: Notion — tableros curriculares, calendarios de unidades, guías de ritmo
- Integridad académica: Turnitin — ensayos y artículos de investigación enviados
- Interactivo: Kahoot, Pear Deck — comprobaciones formativas y encuestas en vivo
- Comunicaciones del personal: Slack o Microsoft Teams — coordinación del departamento y administración
- Conferencias: Google Meet o Zoom — reuniones con padres y horarios de oficina remota

## Tareas comunes y comandos exactos

Crear un plan de lección:
  /lesson-plan <tema> <nivel-grado>
  → Lee descripción general de la unidad y alineación de estándares; genera plan de lección completo de 50 minutos

Construir una indicación de tarea:
  /assignment-builder
  → Solicita tipo de tarea, tema y nivel de grado; genera indicación orientada al estudiante

Crear una rúbrica de puntuación:
  /rubric-creator
  → Solicita tipo de tarea y criterios; genera rúbrica de 4 puntos lista para pegar en Google Classroom

Escribir retroalimentación de estudiantes:
  /student-feedback <id-estudiante>
  → Lee progress-tracker.md y la rúbrica relevante; escribe retroalimentación específica y alineada con la rúbrica

Redactar un correo electrónico para padres:
  /parent-email <id-estudiante> <tema>
  → el tema es uno de: positivo / preocupación / trabajo-faltante / invitación-conferencia
  → Lee sent-log para evitar comunicación duplicada; selecciona plantilla correcta; redacta el correo electrónico

Diferenciar una lección:
  /differentiation <ruta-a-lesson-plan.md>
  → Lee iep-accommodations.md; produce versiones por debajo del nivel de grado, a nivel de grado y por encima del nivel de grado

Construir un cuestionario:
  /quiz-builder <tema> <num-preguntas>
  → Genera cuestionario de opción múltiple o respuesta corta con clave de respuestas y formato de importación de Kahoot

## Convenciones del espacio de trabajo

- Todos los planes de lecciones viven en lessons/ nombrados AAAA-MM-DD-<slug>.md
- Todos los planes de lecciones se crean a partir de lessons/_template/ — nunca comience desde cero
- Las rúbricas viven en assessments/rubrics/ y se hace referencia por nombre en planes de lecciones e indicaciones de tareas
- Los archivos de datos de estudiantes utilizan solo IDs de estudiantes — sin nombres, fechas de nacimiento ni información de contacto
- Los correos electrónicos para padres se registran en parent-comms/sent-log/<AAAA-MM>-log.md después de ser enviados
- Los archivos curriculares hacen referencia a estándares por código (p. ej., CCSS.ELA-LITERACY.W.6.1a), no por paráfrasis

## Alineación de estándares

Conjunto de estándares predeterminado: Estándares Estatales Básicos Comunes (CCSS) ELA
Tabla de comparación estatal: resources/standards/state-standards-crosswalk.md
Al generar planes de lecciones o evaluaciones, siempre cite el código de estándar específico abordado.

## Niveles de diferenciación

Por debajo del nivel de grado: marcos de oración, bancos de palabras, organizadores gráficos, complejidad reducida
A nivel de grado: lección según está diseñada — sin modificación
Por encima del nivel de grado: tareas de extensión, preguntas de seminario socrático, opciones de investigación independiente
Acomodaciones de IEP/504: lea student-data/iep-accommodations.md antes de generar cualquier material diferenciado — las acomodaciones en ese archivo tienen prioridad sobre los valores predeterminados.

## No hacer

- No use nombres de estudiantes reales en ningún archivo generado — solo IDs de estudiantes
- No genere puntuaciones de rúbrica o calificaciones — Claude sugiere lenguaje; el maestro asigna puntuaciones
- No envíe correos electrónicos para padres sin revisión del maestro — /parent-email solo redacta
- No cree planes de lecciones sin hacer referencia al unit-overview.md relevante primero
- No confirme student-data/ en ningún repositorio git remoto
```

## Servidores MCP

```json
{
  "mcpServers": {
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@googleapis/mcp-server-drive"],
      "env": {
        "GOOGLE_CLIENT_ID": "${GOOGLE_CLIENT_ID}",
        "GOOGLE_CLIENT_SECRET": "${GOOGLE_CLIENT_SECRET}",
        "GOOGLE_REFRESH_TOKEN": "${GOOGLE_REFRESH_TOKEN}"
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
        "/Users/$USER/educator-workspace/curriculum",
        "/Users/$USER/educator-workspace/lessons",
        "/Users/$USER/educator-workspace/assessments",
        "/Users/$USER/educator-workspace/feedback"
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
            "command": "if echo \"$CLAUDE_TOOL_INPUT\" | python3 -c \"import sys,json; p=json.load(sys.stdin).get('path',''); print(p)\" 2>/dev/null | grep -q 'lessons/'; then echo '[educator-workspace] Lección escrita — confirme que el código de estándar está citado y que differentiation-notes.md existe junto a este archivo.'; fi"
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
            "command": "if echo \"$CLAUDE_TOOL_INPUT\" | python3 -c \"import sys,json; p=json.load(sys.stdin).get('path',''); print(p)\" 2>/dev/null | grep -q 'student-data/'; then echo '[educator-workspace] Escritura a student-data/ — verifique que no haya nombres de estudiantes o PII, solo IDs de estudiantes.'; fi"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '[educator-workspace] Sesión finalizada. Recordatorio: registre cualquier correo electrónico para padres enviado en esta sesión en parent-comms/sent-log/ y actualice progress-tracker.md si se calificaron evaluaciones.'"
          }
        ]
      }
    ]
  }
}
```

## Habilidades a instalar

```bash
npx claudient add skill productivity/lesson-planner
npx claudient add skill productivity/student-feedback-analyzer
npx claudient add skill productivity/rubric-creator
npx claudient add skill productivity/assignment-builder
npx claudient add skill productivity/differentiation
npx claudient add skill productivity/parent-email
npx claudient add skill productivity/quiz-builder
```

## Relacionado

- [Guía para Educador](../guides/for-educator.md)
- [Flujo de Trabajo de Planificación de Lecciones](../workflows/lesson-planning.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
