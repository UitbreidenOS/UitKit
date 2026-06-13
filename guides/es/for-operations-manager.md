# Claude para Gerentes de Operaciones y Directores de Operaciones (COO)

Todo lo que un Gerente de Operaciones o COO necesita para ejecutar operaciones potenciadas por IA — documentación de procesos, gestión de proveedores, seguimiento de OKRs, coordinación de equipos e informes semanales — en Claude Code.

---

## Para quién es esta guía

Eres un Gerente de Operaciones, VP de Operaciones o COO cuyo trabajo consiste en hacer que la empresa funcione. Eres responsable de los procesos, las herramientas, la coordinación interfuncional y las métricas operativas. Pasas demasiado tiempo en reuniones que no producen decisiones, en documentos que quedan obsoletos en el momento en que los publicas y en revisiones de proveedores que nunca tienen una recomendación clara.

**Antes de Claude Code:** 4 horas para redactar un SOP desde cero. Medio día construyendo una comparativa de proveedores. Una tarde completa convirtiendo notas de reuniones en tareas. Los informes semanales ocupan el lunes por la mañana.

**Después:** SOPs redactados en 30 minutos. Matrices de proveedores construidas a partir de notas en 20 minutos. Notas de reuniones convertidas en tickets de Jira en 5 minutos. El resumen semanal listo antes de que se enfríe el café.

---

## Instalación en 30 segundos

```bash
# Instala el stack de operaciones completo
npx claudient add skills small-business/sop-writer
npx claudient add skills small-business/weekly-pulse
npx claudient add skills small-business/meeting-to-action
npx claudient add skills gtm/revenue-operations
npx claudient add skills productivity/scrum-master
npx claudient add skills productivity/process-mapper
npx claudient add skills productivity/vendor-evaluator
npx claudient add agents advisors/coo-advisor
npx claudient add agents advisors/chief-of-staff
```

---

## Tu stack de operaciones en Claude Code

### Skills (comandos slash)

| Skill | Qué hace | Cuándo usar |
|---|---|---|
| `/sop-writer` | Redactar, formatear y versionar SOPs con RACI y tablas de decisiones | Siempre que un proceso necesite documentarse |
| `/process-mapper` | Mapear procesos existentes: diagrama de flujo, RACI, análisis de cuellos de botella, recomendaciones de mejora | Auditorías de procesos, preparación para automatización, traspasos entre equipos |
| `/vendor-evaluator` | Plantillas de RFP, rúbrica de puntuación, matriz comparativa, memo de recomendación | Cualquier decisión de proveedor > $10k/año |
| `/weekly-pulse` | Check-in semanal de OKRs, panel de métricas, resumen de bloqueos | Cada lunes por la mañana |
| `/meeting-to-action` | Convertir notas de reuniones o transcripciones en tareas estructuradas con responsables | Después de cada reunión significativa |
| `/revenue-operations` | Informes de RevOps, salud del pipeline, precisión de previsiones | Trabajo de GTM/RevOps |
| `/scrum-master` | Ceremonias de sprint, retrospectivas, coaching de velocidad | Ritmo operativo del equipo |

### Agentes

| Agente | Modelo | Cuándo invocar |
|---|---|---|
| `coo-advisor` | Sonnet | Decisiones operativas estratégicas, preguntas de diseño organizativo |
| `chief-of-staff` | Sonnet | Coordinación interfuncional, comunicación con partes interesadas, priorización |

---

## Flujo de trabajo diario

### Pulso OKR matutino (15 minutos)

**Comienza cada día sabiendo dónde estás en tus métricas clave.**

```
/weekly-pulse

Fecha de hoy: [fecha]
Semana: [semana de Q]

Estado de OKRs:
Objetivo 1: [nombre] → Resultado Clave: [métrica, valor actual vs. objetivo]
Objetivo 2: [nombre] → Resultado Clave: [métrica, valor actual vs. objetivo]

Eventos destacados de ayer: [decisiones tomadas, bloqueos detectados, hitos alcanzados o perdidos]

Lo que necesito de este check-in:
- Señales de alarma que requieren mi atención hoy
- Cualquier OKR que esté derivando (ámbar) y necesite intervención esta semana
- Una palanca operativa que pueda activar hoy para mover la aguja
```

---

### Documentación de procesos (30-60 minutos por proceso)

```
/process-mapper

Proceso: [nombre — p.ej., Onboarding de Clientes, Adquisición de Proveedores]
Disparador: [qué inicia este proceso]
Estado final: [cómo es cuando está terminado]
Participantes: [roles involucrados]
Herramientas: [sistemas utilizados]
Dolor actual: [qué ya sabes que está roto]

Produce: mapa paso a paso, matriz RACI, análisis de cuellos de botella, 3 principales recomendaciones de mejora.
```

Luego usa `/sop-writer` para convertir el mapa en un SOP formateado con historial de versiones:

```
/sop-writer

Nombre del proceso: [nombre]
Versión: 1.0
Responsable: [rol]
Última actualización: [fecha]
Frecuencia de revisión: [trimestral]

Basado en este mapa de proceso: [pega el resultado de process-mapper]

Redacta un SOP completo en nuestro formato estándar que incluya:
- Propósito y alcance
- Roles y responsabilidades (RACI)
- Instrucciones paso a paso
- Reglas de decisión (cuándo escalar)
- Métricas y criterios de éxito
- Registro de cambios
```

---

### Gestión de proveedores

**Antes de cualquier decisión significativa de proveedor:**

```
/vendor-evaluator

Necesito evaluar proveedores para: [categoría]
Presupuesto: [$X]
Cronograma: [cuándo necesitamos decidir]
Proveedores que estoy considerando: [nombres]
Requisitos imprescindibles: [lista]
Aspectos deseables: [lista]

Produce: rúbrica de puntuación, preguntas para el RFP, plantilla de matriz comparativa.
```

**Después de recopilar propuestas:**

```
/vendor-evaluator

Construye una matriz comparativa a partir de estas propuestas.

Notas del Proveedor A: [pega tus notas]
Notas del Proveedor B: [pega tus notas]
Notas del Proveedor C: [pega tus notas]

Criterios de puntuación acordados: [de la rúbrica]

Produce: tabla comparativa ponderada, estimación del TCO a 3 años, registro de riesgos, memo de recomendación para el equipo directivo.
```

---

### Gestión de reuniones

**Después de cada reunión significativa:**

```
/meeting-to-action

[Pega las notas de la reunión o la transcripción]

Tipo de reunión: [decisión / lluvia de ideas / estado / escalada]
Asistentes: [lista con roles]
Fecha: [fecha]
Contexto: [qué trataba de lograr esta reunión]

Extrae:
- Decisiones tomadas (lista cada una con quién la posee)
- Tareas (responsable, fecha límite, entregable — una línea cada una)
- Preguntas abiertas que requieren seguimiento
- Compromisos adquiridos de los que otros dependen
- Elementos en espera (planteados pero no resueltos)

Formatea el resultado como un resumen listo para Slack y una lista separada de tareas para Jira/Linear.
```

---

### Coordinación interfuncional

Usa el agente `chief-of-staff` para coordinación compleja:

```
@chief-of-staff

Necesito coordinar [iniciativa] entre [equipos].

Partes interesadas:
- [Equipo/Persona 1]: [qué poseen, qué necesitan de otros]
- [Equipo/Persona 2]: [qué poseen, qué necesitan de otros]

Bloqueos actuales: [lista]
Cronograma: [hitos clave]

Ayúdame a: [redactar el plan de coordinación / escribir la actualización para las partes interesadas / identificar el camino crítico]
```

---

## Ritmo semanal

### Lunes — Pulso de OKRs y planificación semanal

```
/weekly-pulse

Semana: [semana de Q]
Estado de OKRs para cada resultado clave: [valor actual / objetivo / tendencia]
Top 3 prioridades de esta semana: [lista]
Dependencias de otros equipos esta semana: [lista]
Reuniones de esta semana que necesitan preparación: [lista]

Resultado: un resumen semanal de una página que pueda compartir con mi CEO en el check-in del lunes.
```

### Miércoles — Revisión de mediados de semana

```
Revisión rápida de mediados de semana:
- ¿Qué prioridades están en marcha?
- ¿Qué está en riesgo de retrasarse esta semana?
- ¿Qué decisiones están pendientes y bloquean el progreso?
- ¿Necesito escalar algo?

Dame un mensaje de 5 puntos para Slack que enviar a mis subordinados directos.
```

### Viernes — Informe operativo semanal

```
/weekly-pulse

Informe operativo semanal para: [fecha de fin de semana]

Actualización de métricas:
[Pega datos de tus dashboards — o describe las métricas y sus valores]

Logros de esta semana: [lista]
Fallos de esta semana: [lista + causa raíz para cada uno]
Prioridades de la próxima semana: [top 3]
Decisiones que el liderazgo necesita tomar antes del lunes: [lista]

Formato: resumen ejecutivo (3 puntos clave) + sección detallada para el equipo de operaciones.
```

---

## Plan de incorporación de 30 días

### Semana 1 — Auditoría y línea base

- Instala todas las skills de operaciones y configura tus herramientas principales (MCP de Jira/Linear si lo usas)
- Ejecuta `/process-mapper` en tus 3 procesos más problemáticos
- Documenta qué procesos no tienen SOP (estas son tus áreas de riesgo)
- Configura tu plantilla de seguimiento de OKRs en `/weekly-pulse`
- Identifica tus 2 principales decisiones de proveedor en los próximos 90 días

### Semana 2 — Sprint de documentación

- Usa `/sop-writer` para redactar SOPs para los 3 procesos mapeados la semana pasada
- Ejecuta `/meeting-to-action` en tus 5 notas de reuniones más recientes (retroactivamente)
- Comienza a usar `/meeting-to-action` en cada reunión a partir de este momento
- Establece el pulso semanal como un ritual del lunes por la mañana

### Semana 3 — Trabajo con proveedores e interfuncional

- Lanza tu primera evaluación de proveedor con `/vendor-evaluator`
- Usa el agente `chief-of-staff` para redactar tu primer plan de coordinación interfuncional
- Ejecuta una retrospectiva en un equipo usando `/scrum-master`
- Identifica tu OKR de mayor riesgo y diseña una intervención

### Semana 4 — Informes y optimización

- Produce tu primer informe operativo semanal completo con `/weekly-pulse`
- Revisa tus mapas de procesos — ¿qué cuellos de botella puedes eliminar?
- Entrega el memo de recomendación de proveedor de la Semana 3
- Mide el tiempo ahorrado este mes frente a antes de Claude Code (objetivo: 8-12 horas/semana)

---

## Integraciones de herramientas

### Jira / Linear (seguimiento de proyectos)

```json
// Añade a ~/.claude/settings.json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Con esto conectado, `/meeting-to-action` puede crear tareas directamente en tu tablero de proyectos.

### Notion (documentación)

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notion/mcp-server"],
      "env": {
        "NOTION_TOKEN": "your-integration-token"
      }
    }
  }
}
```

Úsalo para: SOPs, mapas de procesos, matrices comparativas de proveedores, informes semanales.

### Slack (comunicación asíncrona)

Formatea todos los resultados de `/weekly-pulse` y `/meeting-to-action` para Slack añadiendo:
"Formatea esto como un mensaje de Slack — sin encabezados markdown, usa viñetas y negrita para énfasis."

### Google Sheets / Airtable (seguimiento de métricas)

Exporta datos de OKRs como CSV → pégalos en `/weekly-pulse` para análisis e informes de tendencias.

---

## Métricas a seguir

Usa Claude Code para analizar estas mensualmente:

| Métrica | Objetivo | Señal de alarma |
|---|---|---|
| Tasa de cumplimiento de OKRs (trimestral) | > 70% | < 50% |
| Cobertura de documentación de procesos | > 80% de procesos críticos | < 60% |
| Tasa de cumplimiento de tareas de reuniones | > 85% antes de la fecha límite | < 70% |
| Tiempo de ciclo de decisión de proveedores | < 30 días para decisiones importantes | > 60 días |
| Tiempo de informe semanal (minutos) | < 30 minutos | > 90 minutos |
| Tiempo de resolución de bloqueos entre equipos | < 3 días hábiles | > 7 días |

---

## Errores comunes y cómo Claude Code ayuda a evitarlos

**Error 1: SOPs que se ignoran**
Claude Code produce SOPs con responsables claros, reglas de decisión y fechas de revisión. Sin eso, los SOPs se convierten en documentos de estantería.

**Error 2: Decisiones de proveedores basadas en demos, no en datos**
`/vendor-evaluator` exige una rúbrica de puntuación antes de la demo, para que no estés comparando manzanas con manzanas con un discurso de ventas.

**Error 3: Reuniones que producen conversación, no decisiones**
`/meeting-to-action` es innegociable después de cualquier reunión de decisión. Ejecútalo en los 30 minutos posteriores o el contexto se desvanece.

**Error 4: OKRs seguidos trimestralmente en vez de semanalmente**
`/weekly-pulse` se ejecuta el lunes por la mañana. Los OKRs que derivan semanalmente mueren al final del trimestre.

**Error 5: Procesos no documentados = dependencias de personas clave**
Cuando la persona que "simplemente sabe cómo funciona" se va, no tienes ningún proceso. `/process-mapper` es cómo eliminas los puntos únicos de fallo.

---

## Recursos

- [Guía de documentación de procesos](./sop-writing-guide.md)
- [Playbook de evaluación de proveedores](../skills/productivity/vendor-evaluator.md)
- [Flujo de trabajo OKR semanal](../workflows/ops-weekly.md)
- [Agente asesor COO](../agents/advisors/coo-advisor.md)
- [Primeros pasos con Claude Code](./getting-started.md)

---
