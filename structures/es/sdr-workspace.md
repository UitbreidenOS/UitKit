# Espacio de Trabajo SDR / BDR — Estructura del Proyecto

> Sistema operativo diario para Representantes de Desarrollo de Ventas: gestión de territorio, investigación de cuentas, alcance personalizado, clasificación de bandeja de entrada, preparación de llamadas e informes de cartera — todo impulsado por comandos slash de Claude Code conectados a HubSpot, Apollo.io, Gong y Slack.

## Stack

- **HubSpot** — CRM, registros de contactos/empresas, inscripción en secuencias, creación de acuerdos
- **Apollo.io** — Base de datos de prospectos, enriquecimiento de correo electrónico, señales de intención
- **Outreach / Salesloft** — Ejecución de secuencias, gestión de cadencias, seguimiento de pasos
- **Gong** — Grabación de llamadas, acceso a transcripciones, análisis de tiempo de conversación
- **Clay** — Flujos de enriquecimiento, extracción de datos en cascada, creación de listas
- **Slack** — Reunión de equipo, alertas de acuerdos, notificaciones de entrega a AE
- **Claude Code** — Comandos slash para cada flujo de trabajo SDR repetible

## Árbol de directorios

```
sdr-workspace/
├── .claude/
│   ├── CLAUDE.md                        # Instrucciones de espacio de trabajo para Claude
│   ├── settings.json                    # Servidores MCP, hooks, permisos
│   └── commands/
│       ├── morning-brief.md             # Extraer alertas de territorio + priorizar cuentas
│       ├── research.md                  # Resumen de cuenta profunda (toma argumento $COMPANY)
│       ├── draft-email.md               # Escritor de correo electrónico personalizado en frío/seguimiento
│       ├── triage-inbox.md              # Clasificar respuestas + redactar respuestas + registrar CRM
│       ├── call-prep.md                 # Talk track + preguntas de descubrimiento + scripts de objeción
│       ├── log-call.md                  # Nota post-llamada estructurada → actividad HubSpot
│       └── weekly-review.md             # Métricas de cartera + resumen de actividad + siguiente enfoque
├── icp/
│   ├── icp-definition.md                # Criterios de ajuste firmográfico + tecnográfico
│   ├── persona-vp-sales.md              # VP Sales / CRO persona de comprador
│   ├── persona-head-of-revops.md        # Persona de comprador RevOps
│   ├── persona-sales-enablement.md      # Persona de comprador de Habilitación
│   ├── negative-icp.md                  # Descalificadores explícitos (tamaño, vertical, etapa)
│   └── scoring-rubric.md                # Pesos de puntuación de leads 0-100 por tipo de señal
├── sequences/
│   ├── cold/
│   │   ├── saas-outbound-7step.md       # Secuencia fría de 7 toques para objetivos SaaS
│   │   ├── enterprise-12step.md         # Secuencia empresarial de 12 toques (60 días)
│   │   └── smb-3step.md                 # Rápida 3 toques para cuentas SMB
│   ├── inbound/
│   │   ├── demo-request-followup.md     # Secuencia de respuesta de solicitud de demostración de entrada
│   │   └── content-download-nurture.md  # Nutrición para descargadores de contenido cerrado
│   └── reactivation/
│       ├── cold-lead-reactivation.md    # Oportunidades obsoletas (90+ días silencioso)
│       └── former-customer-winback.md   # Enfoque de reactivación de clientes perdidos
├── territory/
│   ├── account-list.csv                 # Territorio completo — todas las cuentas asignadas
│   ├── tier-1-priority.csv              # Top 25 cuentas para trabajar este trimestre
│   ├── whitespace-analysis.md           # Segmentos no cubiertos + oportunidades de expansión
│   ├── territory-map.md                 # Desglose geográfico / vertical
│   └── account-notes/
│       ├── acme-corp.md                 # Notas de investigación por cuenta + historial
│       ├── initech-llc.md
│       └── globodyne-inc.md
├── intel/
│   ├── battlecards/
│   │   ├── vs-competitor-a.md           # Comparación cara a cara + talk tracks
│   │   ├── vs-competitor-b.md
│   │   └── vs-competitor-c.md
│   ├── value-props/
│   │   ├── roi-calculator.md            # Puntos de conversación ROI por caso de uso
│   │   ├── feature-differentiators.md   # Top 5 diferenciadores con pruebas
│   │   └── customer-stories.md          # Clientes de referencia por vertical
│   └── objection-library.md             # Mapa de objeción indexada → respuesta
├── logs/
│   └── weekly/
│       ├── 2026-W22.md                  # Revisión semanal: actividades, cartera, aprendizajes
│       ├── 2026-W21.md
│       └── 2026-W20.md
└── README.md                            # Inicio rápido para este espacio de trabajo
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `.claude/commands/morning-brief.md` | Obtiene tareas abiertas de HubSpot, muestra cuentas con señales de intención recientes de Apollo.io y genera una lista de llamadas priorizada para el día |
| `.claude/commands/research.md` | Toma un nombre de empresa, extrae datos firmográficos, noticias recientes, pila de tecnología de Apollo.io y Clay, puntúa contra la rúbrica de ICP, genera un resumen de cuenta estructurado |
| `.claude/commands/triage-inbox.md` | Lee la cola de respuestas de correo electrónico/Outreach, clasifica cada una como Interesado/No por ahora/Objeción/Rebote/Respuesta automática, redacta respuestas, marca respuestas calientes para acción inmediata |
| `.claude/commands/call-prep.md` | Toma contacto + empresa, genera un documento de preparación de 3 partes: banco de preguntas de descubrimiento, scripts de objeción clasificados por rol y script de cierre suave |
| `.claude/commands/log-call.md` | Toma notas de llamadas sin procesar o enlace de transcripción de Gong, extrae próximos pasos, actualiza registro de actividad de HubSpot y establece tarea de seguimiento con fecha de vencimiento |
| `icp/scoring-rubric.md` | Define los pesos de puntuación 0-100 utilizados por `/sdr-lead-scorer` — editar cuando ICP cambia para mantener la puntuación calibrada |
| `intel/objection-library.md` | Índice de objeción maestro utilizado por `/sdr-objection-handler` — agregar nuevas objeciones después de llamadas para mantenerlo fresco |
| `logs/weekly/` | Registros de revisión semanal persistentes utilizados por `/weekly-review` para tendencias de métricas en el tiempo y oportunidades de coaching de superficie |

## Andamio rápido

```bash
# Crear el directorio del espacio de trabajo y todos los subdirectorios
mkdir -p sdr-workspace/.claude/commands
mkdir -p sdr-workspace/icp
mkdir -p sdr-workspace/sequences/cold
mkdir -p sdr-workspace/sequences/inbound
mkdir -p sdr-workspace/sequences/reactivation
mkdir -p sdr-workspace/territory/account-notes
mkdir -p sdr-workspace/intel/battlecards
mkdir -p sdr-workspace/intel/value-props
mkdir -p sdr-workspace/logs/weekly

# Crear archivos de comando
touch sdr-workspace/.claude/commands/morning-brief.md
touch sdr-workspace/.claude/commands/research.md
touch sdr-workspace/.claude/commands/draft-email.md
touch sdr-workspace/.claude/commands/triage-inbox.md
touch sdr-workspace/.claude/commands/call-prep.md
touch sdr-workspace/.claude/commands/log-call.md
touch sdr-workspace/.claude/commands/weekly-review.md

# Crear archivos ICP
touch sdr-workspace/icp/icp-definition.md
touch sdr-workspace/icp/negative-icp.md
touch sdr-workspace/icp/scoring-rubric.md

# Crear archivos intel
touch sdr-workspace/intel/objection-library.md
touch sdr-workspace/intel/value-props/roi-calculator.md
touch sdr-workspace/intel/value-props/feature-differentiators.md
touch sdr-workspace/intel/value-props/customer-stories.md

# Crear archivo de registro de esta semana
echo "# Revisión Semanal — $(date +%Y-W%V)" > sdr-workspace/logs/weekly/$(date +%Y-W%V).md

# Instalar todas las habilidades de SDR
npx claudient add skill gtm/sdr-research-brief
npx claudient add skill gtm/sdr-reply-classifier
npx claudient add skill gtm/sdr-call-prep
npx claudient add skill gtm/sdr-call-analysis
npx claudient add skill gtm/sdr-objection-handler
npx claudient add skill gtm/sdr-territory-mapper
npx claudient add skill gtm/sdr-lead-scorer
npx claudient add skill gtm/email-automation
npx claudient add skill gtm/lead-enrichment
npx claudient add skill gtm/crm-hygiene
npx claudient add skill gtm/hubspot

echo "Andamio de espacio de trabajo SDR completado."
```

## Plantilla CLAUDE.md

```markdown
# Espacio de Trabajo SDR — Instrucciones de Claude

## Qué es esto

Este es un espacio de trabajo operativo diario SDR/BDR. Cada directorio y comando aquí está
optimizado para un resultado: reuniones reservadas. Claude Code ejecuta investigación, redacción,
clasificación, preparación de llamadas y registros — usted maneja relaciones y decisiones de juicio.

No agregue código de aplicación aquí. Este es un espacio de trabajo de contenido y flujo de trabajo.

## Stack

- HubSpot: CRM de registro — contactos, empresas, actividades, secuencias, acuerdos
- Apollo.io: base de datos de prospección, enriquecimiento, señales de intención
- Outreach: ejecución de cadencia de secuencia (o Salesloft — verificar cuál está activo)
- Gong: transcripciones de llamadas, datos de tiempo de conversación, detección de momentos
- Clay: flujos de trabajo de cascada de enriquecimiento, creación de listas
- Slack: comunicaciones de equipo, alertas de acuerdos (canales #sdr-wins, #ae-handoffs)

## Territorio

- Definición de ICP en icp/icp-definition.md — léalo antes de puntuar cualquier cuenta
- Rúbrica de puntuación en icp/scoring-rubric.md — use estos pesos cuando ejecute /sdr-lead-scorer
- Cuentas de nivel 1 en territory/tier-1-priority.csv — estas se trabajan primero, todos los días
- Notas por cuenta en territory/account-notes/ — un archivo por cuenta, actualizar después de cada toque

## Tareas comunes — comandos exactos

### Comenzar el día
/morning-brief
→ Genera lista de llamadas priorizada, marca respuestas de entrada calientes, superficies señales de intención

### Investigar una cuenta antes del alcance
/research [nombre de empresa]
→ Resumen completo de la cuenta: firmografía, pila de tecnología, puntuación ICP, eventos desencadenantes, mapa de stakeholders

### Escribir un correo electrónico en frío personalizado
/draft-email
→ Solicita resumen de cuenta + persona, genera asunto + cuerpo con tokens de personalización

### Clasificar su bandeja de entrada
/triage-inbox
→ Lee cola de respuestas, clasifica cada respuesta, redacta respuestas, marca leads calientes

### Prepararse para una llamada
/call-prep
→ Toma nombre de contacto + empresa, genera preguntas de descubrimiento, scripts de objeción, cierre suave

### Registrar una llamada en HubSpot
/log-call
→ Pegue notas sin procesar o enlace de transcripción de Gong — Claude extrae próximos pasos y actualiza CRM

### Revisión de fin de semana
/weekly-review
→ Extrae métricas de actividad, progresión de cartera, libros vs objetivo y áreas de enfoque de la próxima semana

## Convenciones

- Notas de cuenta: siempre incluir fecha del Último contacto, Último resultado y Siguiente paso en la parte superior
- Líneas de asunto: máximo 6 palabras, sin MAYÚSCULAS, sin signos de exclamación
- Registros de llamadas: siempre incluir un Siguiente paso con una fecha específica — sin seguimientos abiertos
- Registros semanales: guardados en logs/weekly/YYYY-WNN.md — nunca elimine registros históricos
- Selección de secuencias: cold/ para nuevo neto, inbound/ para solicitudes de demostración, reactivation/ para 90+ días oscuro
- Battlecards: actualizar vs-competitor-*.md cada vez que un prospecto plantee una nueva objeción o el competidor lance una nueva función

## Lo que Claude no debe hacer

- No envíe correos electrónicos ni inscriba secuencias sin confirmación explícita
- No cree acuerdos de HubSpot sin confirmar que la puntuación de ICP es superior a 60
- No registre llamadas con campos de Siguiente paso vacíos
- No redacte alcance sin leer primero la nota de cuenta si existe una
```

## Servidores MCP

```json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "${HUBSPOT_ACCESS_TOKEN}"
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
        "/Users/$USER/sdr-workspace"
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
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_RESULT_PATH\" == */logs/weekly/* ]]; then echo \"[hook] Weekly log updated: $CLAUDE_TOOL_RESULT_PATH\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"[$(date +%H:%M)] Session ended. Run /morning-brief tomorrow to reprioritize.\" >> /tmp/sdr-session.log'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "mcp__hubspot__create_deal",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"[hook] Deal creation triggered — confirm ICP score >= 60 before proceeding.\"'"
          }
        ]
      }
    ]
  }
}
```

## Habilidades a instalar

```bash
npx claudient add skill gtm/sdr-research-brief
npx claudient add skill gtm/sdr-reply-classifier
npx claudient add skill gtm/sdr-call-prep
npx claudient add skill gtm/sdr-call-analysis
npx claudient add skill gtm/sdr-objection-handler
npx claudient add skill gtm/sdr-territory-mapper
npx claudient add skill gtm/sdr-lead-scorer
npx claudient add skill gtm/email-automation
npx claudient add skill gtm/lead-enrichment
npx claudient add skill gtm/crm-hygiene
npx claudient add skill gtm/hubspot
```

## Relacionado

- [Guía SDR — documentación completa de flujo de trabajo](../guides/for-sdr.md)
- [Flujo de trabajo diario SDR — proceso de extremo a extremo](../workflows/sdr-daily.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
