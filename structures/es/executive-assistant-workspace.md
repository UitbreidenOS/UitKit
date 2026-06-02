# Espacio de trabajo del asistente ejecutivo — Estructura del proyecto

> Para un asistente ejecutivo que apoya a un ejecutivo de nivel C: gestión de calendario, preparación de reuniones, seguimiento de acciones, preparación de juntas directivas, logística de viajes, comunicaciones con partes interesadas y gestión de gastos — todo desde un único espacio de trabajo de Claude Code.

## Stack

- Google Workspace — Gmail (correo electrónico), Google Calendar (programación), Google Drive (almacenamiento de documentos)
- Notion — documentos de briefing, procedimientos operativos estándar, notas de relaciones con partes interesadas
- Slack — comunicación asincrónica interna, monitoreo de canales ejecutivos
- Zoom — logística de reuniones, enlaces de grabaciones, gestión de claves de anfitrión
- Concur o Expensify — reservas de viajes y envío de informes de gastos
- DocuSign — enrutamiento de documentos para firma, seguimiento de estado
- MCP: google-drive, gmail, slack

## Árbol de directorios

```
ea-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Instrucciones de espacio de trabajo para Claude Code
│   ├── settings.json                          # Permisos, hooks, configuraciones de MCP
│   └── commands/
│       ├── meeting-brief.md                   # Toma asistentes + agenda → briefing completo previo a la reunión
│       ├── travel-plan.md                     # Toma destino + fechas → itinerario + lista de verificación de logística
│       ├── follow-up-tracker.md               # Extrae elementos de acción de notas de reunión → lista de seguimiento
│       ├── board-prep.md                      # Ensambla paquete de junta directiva de board/ → resumen ejecutivo + índice de materiales
│       ├── weekly-brief.md                    # Compila prioridades semanales, calendario y elementos abiertos para ejecutivo
│       ├── stakeholder-email.md               # Redacta correo electrónico específico para parte interesada desde templates/ + notas de relación
│       └── expense-report.md                 # Estructura detalles de gastos en formato de envío para Concur/Expensify
├── briefings/                                 # Briefings previos a reunión, organizados por fecha
│   ├── README.md                              # Índice de archivo de briefing — enlaces por mes
│   ├── briefing-template.md                   # Formato canónico de briefing (asistentes, agenda, contexto, solicitudes)
│   ├── 2026-06/
│   │   ├── 2026-06-03-board-strategy-sync.md  # Sincronización de estrategia de junta — asistentes, agenda, contexto ejecutivo
│   │   ├── 2026-06-05-investor-q-a.md         # Preparación de preguntas y respuestas con inversores — antecedentes de inversores, preguntas probables
│   │   ├── 2026-06-10-partnership-call.md     # Llamada de asociación — antecedentes de empresa, contexto del acuerdo
│   │   └── 2026-06-17-all-hands-prep.md       # Preparación de asamblea general — puntos de conversación, notas de revisión de diapositivas
│   └── 2026-05/
│       ├── 2026-05-20-ceo-peer-roundtable.md  # Mesa redonda de pares — biografías de asistentes, áreas de tema
│       └── 2026-05-28-qbr-prep.md            # Preparación de revisión trimestral de negocio — métricas, narrativa, solicitudes ejecutivas
├── board/                                     # Materiales de reunión de junta directiva y documentos de gobernanza
│   ├── README.md                              # Calendario de junta, lista de miembros, guía de clasificación de materiales
│   ├── members/
│   │   ├── board-member-profiles.md           # Biografía, rol, antigüedad, áreas de enfoque por miembro de junta
│   │   └── committee-assignments.md           # Asignaciones de comités de auditoría, compensación, nominación
│   ├── 2026-q2/
│   │   ├── agenda-2026-q2.md                  # Agenda de junta con asignaciones de tiempo y presentadores
│   │   ├── board-deck-outline-2026-q2.md      # Esquema de diapositivas antes de que se produzca la presentación final
│   │   ├── pre-read-packet-2026-q2.md         # Resumen ejecutivo + enlaces a todos los materiales de lectura previa
│   │   ├── minutes-2026-q2-draft.md           # Acta de borrador para revisión ejecutiva antes de distribución
│   │   └── action-items-2026-q2.md            # Elementos de acción abiertos de reunión de junta con propietarios y fechas de vencimiento
│   ├── 2026-q1/
│   │   ├── minutes-2026-q1-final.md           # Acta de junta aprobada y firmada
│   │   └── action-items-2026-q1-closed.md     # Elementos de acción del Q1 cerrados — archivados para registro de gobernanza
│   └── standing-materials/
│       ├── board-sop.md                       # Procedimiento operativo estándar — logística, lista de distribución, flujo de aprobación de actas
│       └── consent-calendar-template.md       # Plantilla para elementos de calendario de consentimiento
├── travel/                                    # Itinerarios, procedimientos operativos estándar de reserva, preferencias de viaje
│   ├── README.md                              # Guía de clasificación de viajes y flujo de trabajo de reserva
│   ├── exec-travel-preferences.md             # Preferencias del ejecutivo — aerolíneas, asientos, hoteles, números de programas de lealtad
│   ├── booking-sop.md                         # Procedimiento operativo estándar paso a paso para vuelos, hoteles, transporte terrestre
│   ├── visa-passport-tracker.md               # Pasaporte con vencimiento, validez de visa, estado ESTA/ETA por país
│   ├── active/
│   │   ├── 2026-06-18-london-trip.md          # Itinerario activo — vuelos, hotel, transporte terrestre, contactos
│   │   └── 2026-07-08-davos-trip.md           # Itinerario próximo — vuelos por confirmar, hotel confirmado
│   └── archive/
│       ├── 2026-05-nyc-roadshow.md            # Completado — archivado para referencia de reconciliación de gastos
│       └── 2026-04-sf-summit.md               # Completado — todos los gastos enviados y aprobados
├── stakeholders/                              # Contactos clave, notas de relación, historial de comunicación
│   ├── README.md                              # Guía de nivel de partes interesadas (Junta / Inversores / Socios / Medios)
│   ├── board-members/
│   │   ├── jane-doe-profile.md                # Biografía, estilo de comunicación, temas controvertidos, última interacción
│   │   └── john-smith-profile.md              # Biografía, método de contacto preferido, contexto de relación
│   ├── investors/
│   │   ├── series-b-lead.md                   # Perfil de inversor principal — empresa, socio, cadencia, última actualización enviada
│   │   └── strategic-investors.md             # Contactos de inversores estratégicos y registro de participación
│   ├── partners/
│   │   ├── key-partners.md                    # Top 5 socios estratégicos — contactos, estado de relación, próximo paso
│   │   └── partner-engagement-log.md          # Registro continuo de puntos de contacto, compromisos, seguimientos
│   └── media/
│       ├── press-contacts.md                  # Periodistas, medios, área de cobertura, nivel de relación
│       └── spokesperson-sop.md               # Procedimiento operativo estándar — lista de portavoces aprobados, proceso de autorización para citas
├── templates/                                 # Plantillas de correo electrónico por escenario, agendas de reunión, formatos de briefing
│   ├── email/
│   │   ├── meeting-request-external.md        # Plantilla — solicitud de reunión con una parte interesada externa
│   │   ├── meeting-request-internal.md        # Plantilla — programación de reuniones de liderazgo interno
│   │   ├── follow-up-post-meeting.md          # Plantilla — resumen posterior a la reunión y resumen de elementos de acción
│   │   ├── board-member-update.md             # Plantilla — alcance proactivo de miembros de junta entre reuniones
│   │   ├── investor-check-in.md               # Plantilla — toque trimestral o ad-hoc con inversores
│   │   ├── speaking-invitation-accept.md      # Plantilla — aceptación de invitación a conferencia o panel
│   │   ├── speaking-invitation-decline.md     # Plantilla — rechazo elegante con opción de referencia
│   │   ├── intro-request.md                   # Plantilla — solicitud de introducción cálida en nombre del ejecutivo
│   │   ├── intro-forwarder.md                 # Plantilla — reenvío de introducción con doble consentimiento
│   │   └── thank-you-post-event.md            # Plantilla — nota de agradecimiento posterior a evento o reunión
│   ├── agendas/
│   │   ├── 1-1-agenda.md                      # Agenda estándar de uno a uno — elementos fijos, temas, decisiones necesarias
│   │   ├── leadership-team-agenda.md          # Estructura de reunión semanal del equipo de liderazgo
│   │   ├── board-meeting-agenda.md            # Formato de agenda de reunión de junta con bloques de tiempo
│   │   └── offsite-agenda.md                  # Agenda de retiro de día completo con notas de facilitación
│   └── briefings/
│       ├── external-meeting-brief.md          # Formato de briefing para reuniones externas
│       └── internal-review-brief.md           # Formato de briefing para revisiones de negocio internas
├── reports/                                   # Resúmenes ejecutivos semanales y mensuales
│   ├── README.md                              # Cadencia de informe y lista de distribución
│   ├── weekly/
│   │   ├── 2026-W22-weekly-brief.md           # Semana del 2026-05-25 — prioridades, calendario, elementos abiertos
│   │   ├── 2026-W23-weekly-brief.md           # Semana del 2026-06-01 — semana actual
│   │   └── weekly-brief-template.md           # Plantilla — calendario, prioridades, decisiones, seguimientos
│   └── monthly/
│       ├── 2026-05-monthly-summary.md         # Mayo de 2026 — resultados clave, resumen de viajes, decisiones tomadas
│       └── monthly-summary-template.md        # Plantilla — aspectos destacados, puntos de contacto con partes interesadas, bucles abiertos
└── expenses/                                  # Seguimiento de gastos y registros de envío
    ├── README.md                              # Resumen de política de gastos, acceso a Concur/Expensify, cadena de aprobadores
    ├── 2026-06/
    │   ├── june-expenses-log.md               # Registro continuo de gastos este mes para revisión previa al envío
    │   └── receipts-checklist.md              # Rastreador de recibos faltantes antes del cierre mensual
    └── archive/
        ├── 2026-05-expense-report.md          # Informe de mayo enviado y aprobado
        └── 2026-04-expense-report.md          # Informe de abril enviado y aprobado
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `.claude/commands/meeting-brief.md` | Comando slash que toma nombres de asistentes y una agenda, extrae de `stakeholders/` y `briefings/briefing-template.md`, y produce un briefing estructurado previo a la reunión listo para enviar o guardar |
| `.claude/commands/board-prep.md` | Comando slash que lee materiales de `board/` para el próximo trimestre, compila el esquema del paquete de lectura previa, redacta la agenda y marca elementos de acción abiertos de la reunión anterior |
| `.claude/commands/follow-up-tracker.md` | Comando slash que ingiere notas de reunión sin procesar o una transcripción, extrae elementos de acción con propietarios y fechas de vencimiento, y los formatea como una lista de seguimiento rastreable |
| `.claude/commands/weekly-brief.md` | Comando slash que extrae el calendario de la semana actual, seguimientos abiertos y contexto de prioridad para producir el briefing del lunes por la mañana del ejecutivo |
| `briefings/briefing-template.md` | Formato canónico de briefing: asistentes con títulos, agenda con bloques de tiempo, contexto ejecutivo, preguntas probables, solicitudes sugeridas — usado como base para cada briefing de reunión |
| `stakeholders/board-members/` | Perfiles de cada miembro de junta con biografía, preferencias de comunicación e historial de interacción — extraído al redactar comunicaciones de junta o briefings de reunión |
| `travel/exec-travel-preferences.md` | Fuente única de verdad para preferencias de viaje del ejecutivo: aerolíneas preferidas, asiento (pasillo/ventana), nivel de hotel, números de programas de lealtad, restricciones dietéticas, preferencias de transporte terrestre |
| `templates/email/` | Plantillas de correo electrónico específicas del escenario — utilizadas por el comando `stakeholder-email.md` para redactar alcances contextualmente apropiados sin comenzar desde cero |
| `board/standing-materials/board-sop.md` | Procedimiento operativo estándar para el ciclo de vida completo de reunión de junta: redacción de agenda, plazos de distribución de materiales, cadena de aprobación de actas, enrutamiento de DocuSign para elementos de consentimiento |
| `reports/weekly/weekly-brief-template.md` | Plantilla para el briefing del lunes del ejecutivo: calendario de esta semana, prioridades clasificadas por impacto, decisiones abiertas necesarias, seguimientos vencidos esta semana |

## Andamiaje rápido

```bash
# Crear la raíz del espacio de trabajo
mkdir -p ea-workspace
cd ea-workspace

# Crear estructura de .claude
mkdir -p .claude/commands

# Crear directorios del espacio de trabajo
mkdir -p briefings/briefing-template
mkdir -p briefings/2026-06
mkdir -p briefings/2026-05
mkdir -p board/members
mkdir -p board/2026-q2
mkdir -p board/2026-q1
mkdir -p board/standing-materials
mkdir -p travel/active
mkdir -p travel/archive
mkdir -p stakeholders/board-members
mkdir -p stakeholders/investors
mkdir -p stakeholders/partners
mkdir -p stakeholders/media
mkdir -p templates/email
mkdir -p templates/agendas
mkdir -p templates/briefings
mkdir -p reports/weekly
mkdir -p reports/monthly
mkdir -p expenses/2026-06
mkdir -p expenses/archive

# Sembrar archivos clave
touch briefings/README.md briefings/briefing-template.md
touch board/README.md board/standing-materials/board-sop.md board/standing-materials/consent-calendar-template.md
touch board/members/board-member-profiles.md board/members/committee-assignments.md
touch travel/exec-travel-preferences.md travel/booking-sop.md travel/visa-passport-tracker.md travel/README.md
touch stakeholders/README.md
touch stakeholders/board-members/.gitkeep
touch stakeholders/investors/strategic-investors.md
touch stakeholders/partners/key-partners.md stakeholders/partners/partner-engagement-log.md
touch stakeholders/media/press-contacts.md stakeholders/media/spokesperson-sop.md
touch templates/email/meeting-request-external.md templates/email/meeting-request-internal.md
touch templates/email/follow-up-post-meeting.md templates/email/board-member-update.md
touch templates/email/investor-check-in.md templates/email/intro-request.md templates/email/intro-forwarder.md
touch templates/email/speaking-invitation-accept.md templates/email/speaking-invitation-decline.md
touch templates/email/thank-you-post-event.md
touch templates/agendas/1-1-agenda.md templates/agendas/leadership-team-agenda.md
touch templates/agendas/board-meeting-agenda.md templates/agendas/offsite-agenda.md
touch templates/briefings/external-meeting-brief.md templates/briefings/internal-review-brief.md
touch reports/README.md reports/weekly/weekly-brief-template.md reports/monthly/monthly-summary-template.md
touch expenses/README.md expenses/2026-06/june-expenses-log.md expenses/2026-06/receipts-checklist.md

# Instalar habilidades de Claude Code
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/meeting-to-action
npx claudient add skill small-business/monday-brief
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/vendor-evaluator

# Instalar comandos slash
npx claudient add command meeting-brief
npx claudient add command travel-plan
npx claudient add command follow-up-tracker
npx claudient add command board-prep
npx claudient add command weekly-brief
npx claudient add command stakeholder-email
npx claudient add command expense-report
```

## Plantilla CLAUDE.md

```markdown
# Espacio de trabajo del asistente ejecutivo

Este espacio de trabajo apoya a un asistente ejecutivo que gestiona el ritmo operativo completo de un ejecutivo de nivel C:
calendario, preparación de reuniones, gobernanza de junta, viajes, comunicaciones con partes interesadas y gastos.

---

## Qué es esto

Un espacio de trabajo estructurado de Claude Code para un asistente ejecutivo. Los directorios se asignan directamente a
funciones laborales. Claude Code lee estos archivos para producir resultados específicos de la organización — briefings,
correos electrónicos y listas de seguimiento que reflejan relaciones reales y contexto real, no formatos genéricos.

---

## Stack

- Google Workspace — Gmail y Google Calendar como capa de comunicación y programación principal (MCP: gmail, google-drive)
- Notion — documentos de briefing y procedimientos operativos estándar (accedidos vía MCP de Google Drive o API de Notion)
- Slack — asincronía interna y monitoreo de canal ejecutivo (MCP: slack)
- Zoom — logística de reunión y enlaces de grabación
- Concur o Expensify — reserva de viajes y envío de gastos
- DocuSign — enrutamiento de documentos y seguimiento de estado de firma

---

## Convenciones de directorio

- `briefings/` — Un archivo por reunión, nombrado `YYYY-MM-DD-short-description.md`. Archivado por mes.
- `board/` — Un subdirectorio por trimestre (por ejemplo, `2026-q2/`). Los materiales fijos permanecen en `standing-materials/`.
- `travel/` — Itinerarios activos en `travel/active/`, viajes completados en `travel/archive/`. Preferencias en `exec-travel-preferences.md`.
- `stakeholders/` — Un archivo por contacto de alta prioridad. Organizado por nivel: `board-members/`, `investors/`, `partners/`, `media/`.
- `templates/` — Plantillas de correo electrónico en `templates/email/`, agendas de reunión en `templates/agendas/`. Nunca edite una plantilla en línea — copie al contexto de trabajo primero.
- `reports/` — Briefings semanales en `reports/weekly/`, resúmenes mensuales en `reports/monthly/`. Formato de nombre: `YYYY-WNN-weekly-brief.md` o `YYYY-MM-monthly-summary.md`.
- `expenses/` — Un subdirectorio por mes. Registre gastos en `june-expenses-log.md` antes de enviar a Concur/Expensify.

---

## Tareas comunes — comandos exactos

### Preparación de reunión
```
/meeting-brief    — Proporcione asistentes y agenda. Claude extrae perfiles de partes interesadas de stakeholders/
                    y produce un briefing completo previo a la reunión usando briefings/briefing-template.md.
```

### Gobernanza de junta
```
/board-prep       — Produce el esquema del paquete de lectura previa de junta, borrador de agenda y marca
                    elementos de acción abiertos del trimestre anterior board/YYYY-QN/action-items-*.md.
```

### Seguimiento de seguimientos
```
/follow-up-tracker — Pegue notas de reunión o transcripción. Claude extrae elementos de acción con propietarios,
                     fechas de vencimiento, y los formatea como una lista rastreable lista para enviar o registrar.
```

### Briefing semanal
```
/weekly-brief     — Compila el calendario de esta semana, seguimientos abiertos y contexto de prioridad en
                    el briefing del lunes por la mañana del ejecutivo usando reports/weekly/weekly-brief-template.md.
```

### Comunicaciones con partes interesadas
```
/stakeholder-email — Especifique el destinatario y propósito. Claude carga su perfil de stakeholders/
                     y redacta de la plantilla apropiada en templates/email/.
```

### Logística de viaje
```
/travel-plan      — Proporcione destino y fechas. Claude aplica preferencias del ejecutivo de
                    travel/exec-travel-preferences.md y genera una lista de verificación de itinerario completo.
```

### Gestión de gastos
```
/expense-report   — Proporcione detalles de gastos o una lista de recibos. Claude formatea el envío
                    según la política en expenses/README.md, listo para entrada en Concur o Expensify.
```

---

## Convenciones que Claude debe seguir

- Nunca fabrique nombres de partes interesadas, títulos o contexto de relación. Lea primero de `stakeholders/`.
- Todos los briefings de reunión deben usar `briefings/briefing-template.md` como estructura base — no invente un nuevo formato.
- Al redactar correos electrónicos, siempre cargue el perfil del destinatario de `stakeholders/` antes de elegir una plantilla.
- Los itinerarios de viaje deben reflejar `travel/exec-travel-preferences.md` — preferencia de asiento, números de lealtad, nivel de hotel.
- Los minutos de junta y materiales en `board/` son confidenciales. No incluya contenido textual en salidas que serán enviadas por correo electrónico.
- Las entradas de gastos deben hacer referencia a la política en `expenses/README.md`. Marque cualquier cosa que exceda la asignación diaria o requiera un recibo faltante.
- Cuando se extrae un seguimiento de una reunión, verifique `board/standing-materials/board-sop.md` si la reunión involucró miembros de junta.
```

## Servidores MCP

```json
{
  "mcpServers": {
    "gmail": {
      "command": "npx",
      "args": ["-y", "@gptscript-ai/mcp-server-gmail"],
      "env": {
        "GMAIL_CLIENT_ID": "${GMAIL_CLIENT_ID}",
        "GMAIL_CLIENT_SECRET": "${GMAIL_CLIENT_SECRET}",
        "GMAIL_REFRESH_TOKEN": "${GMAIL_REFRESH_TOKEN}"
      }
    },
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gdrive"],
      "env": {
        "GDRIVE_CLIENT_ID": "${GDRIVE_CLIENT_ID}",
        "GDRIVE_CLIENT_SECRET": "${GDRIVE_CLIENT_SECRET}",
        "GDRIVE_REFRESH_TOKEN": "${GDRIVE_REFRESH_TOKEN}"
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
        "/Users/you/ea-workspace"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"briefings/\"; then echo \"[Briefing hook] Briefing guardado — confirme que ha sido compartido con el ejecutivo vía Slack o correo electrónico antes de la reunión.\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"board/\" && echo \"$CLAUDE_TOOL_INPUT\" | grep -q \"action-items\"; then echo \"[Board hook] Elementos de acción archivados — verifique que cada elemento tenga propietario y fecha de vencimiento antes de distribuir.\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"[Session end] Verifique cualquier correo electrónico redactado o seguimientos que aún necesiten ser enviados. Los elementos abiertos deben registrarse en el informe semanal actual bajo reports/weekly/.\"\n'"
          }
        ]
      }
    ]
  }
}
```

## Habilidades a instalar

```bash
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/meeting-to-action
npx claudient add skill small-business/monday-brief
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/lesson-planner
npx claudient add skill productivity/doc-site-builder
```

## Relacionado

- [Guide: Claude for Executive Assistants](../guides/for-executive-assistant.md)
- [Workflow: Board Meeting Cycle](../workflows/board-meeting-cycle.md)
- [Workflow: Executive Weekly](../workflows/executive-weekly.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
