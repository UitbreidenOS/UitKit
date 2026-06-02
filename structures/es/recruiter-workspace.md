# Espacio de Trabajo de Reclutador / Adquisición de Talento — Estructura del Proyecto

> Sistema operativo diario para reclutadores internos y de agencias: redacción de descripciones de puestos, búsqueda de candidatos, selección, coordinación de entrevistas, gestión de ofertas y reportes de pipeline — todo impulsado por comandos slash de Claude Code conectados a Greenhouse/Lever/Ashby, LinkedIn Recruiter y Slack.

## Stack

- **Greenhouse / Lever / Ashby** — ATS de registro: publicaciones de empleo, pipeline de candidatos, seguimiento de etapas, gestión de ofertas
- **LinkedIn Recruiter** — Búsqueda booleana, alcance InMail, gestión de grupos de talento, análisis de abastecimiento
- **Slack** — Coordinación de gerentes de contratación, programación de sesiones de revisión, aprobaciones de ofertas, alertas de equipo
- **HireRight** — Solicitud de verificación de antecedentes, adjudicación, documentación de cumplimiento
- **Karat / CoderPad** — Asignaciones de selección técnica, entrevistas de codificación en vivo, resultados de evaluación
- **Calendly** — Programación de entrevistas, disponibilidad de paneles, enlaces de auto-programación de candidatos
- **Notion** — Guías de reclutamiento, guías de entrevista, incorporación de gerentes de contratación
- **Claude Code** — Comandos slash para cada flujo de trabajo de reclutamiento repetible

## Árbol de directorios

```
recruiter-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Instrucciones del espacio de trabajo para Claude
│   ├── settings.json                          # Servidores MCP, hooks, permisos
│   └── commands/
│       ├── job-description.md                 # Redacta JD a partir de resumen de rol (toma argumento $ROLE)
│       ├── sourcing-strategy.md               # Cadenas booleanas + canales para un tipo de rol
│       ├── screen-email.md                    # Escritor de plantilla de correo electrónico de selección o InMail
│       ├── interview-scorecard.md             # Crea tarjeta de puntuación estructurada para un rol
│       ├── offer-letter.md                    # Genera carta de oferta a partir de banda de compensación + entradas
│       ├── pipeline-report.md                 # Extrae datos de ATS → resumen de pipeline semanal
│       └── candidate-debrief.md              # Estructura notas de sesión de revisión post-entrevista de panel
├── roles/
│   ├── _template/                             # Copie esta carpeta para cada nuevo rol abierto
│   │   ├── job-description.md                 # JD final aprobada (obtenida de /job-description)
│   │   ├── role-brief.md                      # Formulario de entrada de HM: nivel, alcance, imprescindibles, agradables
│   │   ├── sourcing-log.md                    # Cadenas booleanas utilizadas, canales intentados, tasas de respuesta
│   │   ├── interview-guide.md                 # Estructura de entrevista etapa por etapa + bancos de preguntas
│   │   ├── scorecard.md                       # Rúbrica de evaluación con pesos de competencia
│   │   └── offers/
│   │       ├── offer-draft.md                 # Borrador de trabajo antes de la aprobación
│   │       └── offer-final.md                 # Oferta aprobada enviada al candidato
│   ├── senior-engineer-backend/
│   │   ├── job-description.md
│   │   ├── role-brief.md
│   │   ├── sourcing-log.md
│   │   ├── interview-guide.md
│   │   ├── scorecard.md
│   │   └── offers/
│   │       ├── offer-draft.md
│   │       └── offer-final.md
│   ├── product-manager-growth/
│   │   ├── job-description.md
│   │   ├── role-brief.md
│   │   ├── sourcing-log.md
│   │   ├── interview-guide.md
│   │   ├── scorecard.md
│   │   └── offers/
│   │       └── offer-draft.md
│   └── account-executive-mid-market/
│       ├── job-description.md
│       ├── role-brief.md
│       ├── sourcing-log.md
│       ├── interview-guide.md
│       ├── scorecard.md
│       └── offers/
│           └── offer-draft.md
├── candidates/
│   ├── pipeline-tracker.md                    # Candidatos activos en todos los roles: etapa, estado, propietario
│   ├── feedback-log.md                        # Comentarios de entrevista indexados por candidato + rol
│   ├── declined/
│   │   ├── declined-template.md               # Plantillas de correo electrónico de rechazo estándar por etapa
│   │   └── declined-log.md                    # Candidatos rechazados con códigos de razón para análisis
│   └── silver-medalists/
│       ├── silver-medalist-index.md           # Finalistas para reactivar cuando se abran nuevos roles
│       └── re-engagement-template.md          # Alcance cálido para finalistas
├── sourcing/
│   ├── boolean-strings/
│   │   ├── software-engineer.md               # Cadenas booleanas para búsqueda de SWE por stack
│   │   ├── product-manager.md                 # Cadenas booleanas para búsqueda de PM
│   │   ├── data-scientist.md                  # Cadenas booleanas para roles de DS/ML
│   │   ├── sales-ae-sdr.md                    # Cadenas booleanas para roles GTM
│   │   └── design-ux.md                       # Cadenas booleanas para roles de diseño
│   ├── sourcing-channels.md                   # Lista de canales con benchmarks de tasa de respuesta por tipo de rol
│   ├── talent-pools/
│   │   ├── engineering-pool.md                # Contactos de ingeniería cálidos para reactivar
│   │   ├── gtm-pool.md                        # Contactos GTM cálidos
│   │   └── leadership-pool.md                 # Candidatos pasivos a nivel VP/Director
│   └── linkedin-saved-searches.md             # Búsquedas nombradas de LinkedIn Recruiter para repetir mensualmente
├── offer-management/
│   ├── comp-bands.md                          # Bandas salariales por nivel y función (actualizado trimestralmente)
│   ├── offer-letter-templates/
│   │   ├── full-time-standard.md              # Plantilla de carta de oferta estándar de FTE
│   │   ├── full-time-executive.md             # Carta de oferta ejecutiva con lenguaje de acantilado de equidad
│   │   └── contract-to-hire.md                # Plantilla de carta de oferta de contratación bajo contrato
│   ├── equity-explainer.md                    # Preguntas frecuentes sobre equidad en lenguaje plano para candidatos
│   ├── negotiation-scripts.md                 # Scripts de respuesta de contra-oferta por escenario
│   └── approval-workflow.md                   # Cadena de aprobación de oferta: reclutador → HRBP → Finanzas → CEO
├── onboarding/
│   ├── day-1-checklist.md                     # TI, insignia, herramientas, reuniones introductorias
│   ├── first-week-schedule-template.md        # Cronograma día a día para la primera semana del nuevo empleado
│   ├── welcome-email-template.md              # Correo electrónico de bienvenida previo al inicio enviado 3 días antes del comienzo
│   ├── hiring-manager-checklist.md            # Tareas de HM antes y el día 1
│   └── new-hire-survey.md                     # Encuesta de experiencia del nuevo empleado a los 30 días
├── employer-brand/
│   ├── company-overview.md                    # Resumen de empresa de 2 páginas para candidatos
│   ├── culture-deck.md                        # Valores, estilo de trabajo, composición del equipo
│   ├── candidate-faq.md                       # Preguntas frecuentes comunes de candidatos con respuestas aprobadas
│   ├── glassdoor-response-templates.md        # Respuestas aprobadas a temas comunes de Glassdoor
│   └── job-board-descriptions/
│       ├── linkedin-company-bio.md            # Descripción de empresa de LinkedIn de 300 caracteres
│       └── greenhouse-about-us.md             # Bloque "Acerca de nosotros" de ATS para publicaciones de empleo
└── reports/
    ├── weekly-pipeline.md                     # Instantánea semanal: roles activos, etapas, velocidad
    ├── time-to-fill.md                        # Tiempo para cubrir por tipo de rol y trimestre
    ├── source-of-hire.md                      # Atribución de contratación por canal de abastecimiento
    ├── dei-metrics.md                         # Datos de diversidad de embudo por etapa y rol
    └── weekly/
        ├── 2026-W22.md                        # Informe de pipeline semanal archivado
        ├── 2026-W21.md
        └── 2026-W20.md
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `.claude/commands/job-description.md` | Toma un `role-brief.md` como contexto y redacta una JD completa con responsabilidades, requisitos, calificaciones preferidas y revisión de lenguaje inclusivo — lista para publicar en Greenhouse o LinkedIn |
| `.claude/commands/sourcing-strategy.md` | Genera cadenas de búsqueda booleana, recomienda canales de abastecimiento con estimaciones de tasa de respuesta y genera un plan de abastecimiento delimitado por el resumen de rol y grupo de talento |
| `.claude/commands/interview-scorecard.md` | Crea una tarjeta de puntuación estructurada a partir de un resumen de rol: lista de competencias, banco de preguntas conductuales y rúbrica numérica (escala 1-5 con anclas) para cada competencia |
| `.claude/commands/offer-letter.md` | Toma nombre de candidato, rol, nivel, fecha de inicio e insumos de compensación; extrae la plantilla apropiada de `offer-management/offer-letter-templates/`; genera un borrador completo para revisión |
| `.claude/commands/pipeline-report.md` | Consulta Greenhouse o Ashby para roles abiertos, candidatos activos por etapa y datos de tiempo en etapa; formatea un resumen de pipeline semanal con destacados de velocidad y obstáculos |
| `roles/_template/` | Estructura de carpeta canónica para cada nuevo rol abierto — copie este directorio cuando se abra una nueva req para garantizar documentación consistente en todo el ciclo de vida de reclutamiento |
| `offer-management/comp-bands.md` | Fuente única de verdad para bandas salariales por nivel y función — actualizado trimestralmente; referenciado por `/offer-letter` y `/comp-benchmarker` para mantener ofertas dentro de banda |
| `candidates/silver-medalists/silver-medalist-index.md` | Lista indexada de candidatos fuertes que no fueron contratados — reactivada cuando se abre un nuevo rol para reducir el tiempo del ciclo de abastecimiento |
| `sourcing/boolean-strings/` | Cadenas de búsqueda booleana pre-construidas organizadas por familia de roles — cargue el archivo relevante antes de cualquier sesión de LinkedIn Recruiter para evitar reconstruir cadenas desde cero |
| `reports/dei-metrics.md` | Rastrea la representación en cada etapa del embudo (solicitado, seleccionado, entrevistado, ofertado, contratado) para exponer puntos de abandono e informar la estrategia de canal de abastecimiento |

## Andamio rápido

```bash
# Crear el espacio de trabajo y todos los subdirectorios
mkdir -p recruiter-workspace/.claude/commands
mkdir -p recruiter-workspace/roles/_template/offers
mkdir -p recruiter-workspace/roles/senior-engineer-backend/offers
mkdir -p recruiter-workspace/roles/product-manager-growth/offers
mkdir -p recruiter-workspace/roles/account-executive-mid-market/offers
mkdir -p recruiter-workspace/candidates/declined
mkdir -p recruiter-workspace/candidates/silver-medalists
mkdir -p recruiter-workspace/sourcing/boolean-strings
mkdir -p recruiter-workspace/sourcing/talent-pools
mkdir -p recruiter-workspace/offer-management/offer-letter-templates
mkdir -p recruiter-workspace/onboarding
mkdir -p recruiter-workspace/employer-brand/job-board-descriptions
mkdir -p recruiter-workspace/reports/weekly

# Stub out Claude commands
touch recruiter-workspace/.claude/commands/job-description.md
touch recruiter-workspace/.claude/commands/sourcing-strategy.md
touch recruiter-workspace/.claude/commands/screen-email.md
touch recruiter-workspace/.claude/commands/interview-scorecard.md
touch recruiter-workspace/.claude/commands/offer-letter.md
touch recruiter-workspace/.claude/commands/pipeline-report.md
touch recruiter-workspace/.claude/commands/candidate-debrief.md

# Stub out role template
touch recruiter-workspace/roles/_template/job-description.md
touch recruiter-workspace/roles/_template/role-brief.md
touch recruiter-workspace/roles/_template/sourcing-log.md
touch recruiter-workspace/roles/_template/interview-guide.md
touch recruiter-workspace/roles/_template/scorecard.md
touch recruiter-workspace/roles/_template/offers/offer-draft.md

# Stub out sourcing files
touch recruiter-workspace/sourcing/boolean-strings/software-engineer.md
touch recruiter-workspace/sourcing/boolean-strings/product-manager.md
touch recruiter-workspace/sourcing/boolean-strings/data-scientist.md
touch recruiter-workspace/sourcing/boolean-strings/sales-ae-sdr.md
touch recruiter-workspace/sourcing/boolean-strings/design-ux.md
touch recruiter-workspace/sourcing/sourcing-channels.md
touch recruiter-workspace/sourcing/linkedin-saved-searches.md
touch recruiter-workspace/sourcing/talent-pools/engineering-pool.md
touch recruiter-workspace/sourcing/talent-pools/gtm-pool.md
touch recruiter-workspace/sourcing/talent-pools/leadership-pool.md

# Stub out offer management files
touch recruiter-workspace/offer-management/comp-bands.md
touch recruiter-workspace/offer-management/offer-letter-templates/full-time-standard.md
touch recruiter-workspace/offer-management/offer-letter-templates/full-time-executive.md
touch recruiter-workspace/offer-management/offer-letter-templates/contract-to-hire.md
touch recruiter-workspace/offer-management/equity-explainer.md
touch recruiter-workspace/offer-management/negotiation-scripts.md
touch recruiter-workspace/offer-management/approval-workflow.md

# Stub out onboarding files
touch recruiter-workspace/onboarding/day-1-checklist.md
touch recruiter-workspace/onboarding/first-week-schedule-template.md
touch recruiter-workspace/onboarding/welcome-email-template.md
touch recruiter-workspace/onboarding/hiring-manager-checklist.md
touch recruiter-workspace/onboarding/new-hire-survey.md

# Stub out employer brand files
touch recruiter-workspace/employer-brand/company-overview.md
touch recruiter-workspace/employer-brand/culture-deck.md
touch recruiter-workspace/employer-brand/candidate-faq.md
touch recruiter-workspace/employer-brand/glassdoor-response-templates.md
touch recruiter-workspace/employer-brand/job-board-descriptions/linkedin-company-bio.md
touch recruiter-workspace/employer-brand/job-board-descriptions/greenhouse-about-us.md

# Stub out candidate tracking
touch recruiter-workspace/candidates/pipeline-tracker.md
touch recruiter-workspace/candidates/feedback-log.md
touch recruiter-workspace/candidates/declined/declined-template.md
touch recruiter-workspace/candidates/declined/declined-log.md
touch recruiter-workspace/candidates/silver-medalists/silver-medalist-index.md
touch recruiter-workspace/candidates/silver-medalists/re-engagement-template.md

# Stub out report files
touch recruiter-workspace/reports/weekly-pipeline.md
touch recruiter-workspace/reports/time-to-fill.md
touch recruiter-workspace/reports/source-of-hire.md
touch recruiter-workspace/reports/dei-metrics.md
echo "# Weekly Pipeline — $(date +%Y-W%V)" > recruiter-workspace/reports/weekly/$(date +%Y-W%V).md

# Instale todas las habilidades de reclutador
npx claudient add skill productivity/candidate-sourcer
npx claudient add skill productivity/interview-scorecard
npx claudient add skill productivity/tech-interview-kit
npx claudient add skill productivity/comp-benchmarker
npx claudient add skill small-business/hiring-pipeline
npx claudient add skill small-business/job-description

echo "Andamio de espacio de trabajo de reclutador completado."
```

## Plantilla CLAUDE.md

```markdown
# Espacio de Trabajo de Reclutador — Instrucciones de Claude

## Qué es esto

Este es un espacio de trabajo operativo diario de adquisición de talento. Cada directorio y comando
aquí está optimizado para un resultado: llenar roles con grandes candidatos, más rápido. Claude
Code maneja redacción de JD, estrategia de abastecimiento, selección, generación de tarjeta de puntuación, cartas de oferta
y reportes de pipeline — usted maneja relaciones, decisiones de juicio y aprobaciones.

No agregue código de aplicación aquí. Este es un espacio de trabajo de contenido y flujo de trabajo.

## Stack

- Greenhouse / Ashby: ATS de registro — reqs, candidatos, etapas de pipeline, ofertas, reportes
- LinkedIn Recruiter: búsqueda booleana, InMail, búsquedas guardadas, gestión de grupo de talento
- Slack: comunicaciones de gerente de contratación, coordinación de sesión de revisión, hilos de aprobación de ofertas
- HireRight: solicitud de verificación de antecedentes y adjudicación
- Karat / CoderPad: entrega de evaluación técnica y acceso a resultados
- Calendly: programación de candidatos, coordinación de panel
- Notion: guías de reclutamiento, documentación de procesos

## Roles abiertos

- Todos los reqs activos viven en roles/ — un subdirectorio por rol abierto
- El resumen de rol (role-brief.md) debe completarse antes de ejecutar cualquier comando para ese rol
- La tarjeta de puntuación (scorecard.md) debe existir antes de que comiencen las entrevistas
- Las ofertas siempre requieren aprobación antes de enviar — vea offer-management/approval-workflow.md

## Tareas comunes — comandos exactos

### Redactar una descripción de puesto
/job-description
→ Lea primero el role-brief.md, luego redacte una JD completa. Confirme antes de escribir en
  el job-description.md del rol.

### Construir una estrategia de abastecimiento
/sourcing-strategy
→ Toma tipo de rol + nivel, genera cadenas booleanas y recomendaciones de canal con
  benchmarks estimados de tasa de respuesta.

### Redactar un correo electrónico de selección o InMail
/screen-email
→ Solicita rol, antecedentes del candidato y tipo de alcance (InMail frío vs. referencia cálida
  vs. seguimiento de solicitud); genera asunto + cuerpo.

### Construir una tarjeta de puntuación de entrevista
/interview-scorecard
→ Toma resumen de rol, genera lista de competencias con preguntas conductuales y una rúbrica 1-5
  con anclas de calificación para cada competencia.

### Generar una carta de oferta
/offer-letter
→ Toma nombre de candidato, rol, nivel, fecha de inicio e insumos de compensación base, equidad y bonificación de firma;
  extrae plantilla apropiada de offer-management/offer-letter-templates/;
  genera borrador para revisión. Nunca envíe sin aprobación de autorización.

### Extraer informe de pipeline semanal
/pipeline-report
→ Consulta ATS para roles abiertos, candidatos cuentan por etapa, tiempo en etapa y obstáculos;
  formatea y guarda en reports/weekly/YYYY-WNN.md.

### Estructura una sesión de revisión
/candidate-debrief
→ Toma notas brutas de entrevistador + tarjeta de puntuación, sintetiza una recomendación de contratación/sin contratación
  con evidencia de apoyo asignada a cada competencia.

## Convenciones

- Carpetas de rol: siempre copie roles/_template/ al abrir una nueva req — nunca crear ad hoc
- JDs: use lenguaje inclusivo; evite pronombres de género, "rockstar", "ninja", "ajuste cultural"
- Tarjetas de puntuación: todas las competencias puntuadas 1-5 con anclas — sin evaluaciones solo de forma libre
- Ofertas: la compensación debe caer dentro de la banda en offer-management/comp-bands.md antes de redactar
- Rastreador de pipeline: actualice candidates/pipeline-tracker.md después de cada cambio de etapa
- Finalistas de plata: registre cualquier fuerte sin contratación a candidates/silver-medalists/silver-medalist-index.md
  con rol, fecha, razón y sugerencia de fecha de reactivación
- Reportes: guardados en reports/weekly/YYYY-WNN.md — nunca sobrescriba reportes históricos
- Candidatos rechazados: registre en candidates/declined/declined-log.md con código de razón para análisis

## Qué Claude no debe hacer

- No envíe cartas de oferta sin confirmación de aprobación explícita del usuario
- No publique descripciones de puestos en LinkedIn o Greenhouse sin confirmación del usuario
- No ordene verificaciones de antecedentes (HireRight) — marque cuando sea apropiado, el usuario inicia
- No comparta detalles de banda de compensación en ningún borrador dirigido a candidatos
- No cree tarjetas de puntuación sin leer primero el role-brief.md para ese rol
- No recomiende rechazar un candidato basado en características protegidas
```

## Servidores MCP

```json
{
  "mcpServers": {
    "greenhouse": {
      "command": "npx",
      "args": ["-y", "@greenhouse/mcp-server"],
      "env": {
        "GREENHOUSE_API_KEY": "${GREENHOUSE_API_KEY}",
        "GREENHOUSE_ON_BEHALF_OF": "${GREENHOUSE_USER_ID}"
      }
    },
    "ashby": {
      "command": "npx",
      "args": ["-y", "@ashby-hq/mcp-server"],
      "env": {
        "ASHBY_API_KEY": "${ASHBY_API_KEY}"
      }
    },
    "linkedin": {
      "command": "npx",
      "args": ["-y", "@linkedin/mcp-server"],
      "env": {
        "LINKEDIN_ACCESS_TOKEN": "${LINKEDIN_ACCESS_TOKEN}",
        "LINKEDIN_ORGANIZATION_ID": "${LINKEDIN_ORGANIZATION_ID}"
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
        "/Users/$USER/recruiter-workspace"
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
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_RESULT_PATH\" == */offers/offer-draft.md ]]; then echo \"[hook] Borrador de oferta escrito. Recordatorio: obtener aprobación antes de enviar — vea offer-management/approval-workflow.md\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_RESULT_PATH\" == */reports/weekly/* ]]; then echo \"[hook] Informe de pipeline guardado: $CLAUDE_TOOL_RESULT_PATH\"; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "mcp__greenhouse__create_offer",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"[hook] Creación de oferta activada en Greenhouse — confirme que la cadena de aprobación en offer-management/approval-workflow.md está completa antes de proceder.\"'"
          }
        ]
      }
    ]
  }
}
```

## Habilidades a instalar

```bash
npx claudient add skill productivity/candidate-sourcer
npx claudient add skill productivity/interview-scorecard
npx claudient add skill productivity/tech-interview-kit
npx claudient add skill productivity/comp-benchmarker
npx claudient add skill small-business/hiring-pipeline
npx claudient add skill small-business/job-description
```

## Relacionado

- [Guía de reclutador — documentación de flujo de trabajo completo](../guides/for-recruiter.md)
- [Flujo de trabajo de pipeline de contratación — proceso de extremo a extremo](../workflows/hiring-pipeline.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
