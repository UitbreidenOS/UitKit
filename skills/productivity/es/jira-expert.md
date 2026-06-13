---
name: jira-expert
description: "Gestión de proyectos Jira: configuración de tablero, jerarquía de problemas, diseño de flujo de trabajo, consultas JQL, planificación de sprints, informes y mejores prácticas de Jira para equipos de ingeniería"
---

# Habilidad Jira Expert

## Cuándo activar
- Configurar un nuevo proyecto Jira o reestructurar uno existente
- Escribir consultas JQL para encontrar problemas específicos
- Diseñar un flujo de trabajo que se ajuste a su proceso de desarrollo
- Configurar sprints, épicas y jerarquía de historias
- Crear informes y dashboards de Jira
- Depuración de por qué los tableros o automatizaciones de Jira no funcionan como se espera

## Cuándo NO usar
- Planificación de hoja de ruta de productos — esa es una conversación de habilidad product-roadmap
- Retrospectivas de sprint — utilice un proceso real de facilitación de equipo
- Migración fuera de Jira — evalúe herramientas primero, luego migre

## Instrucciones

### Configuración del proyecto

```
Configura un proyecto Jira para [equipo/producto].

Equipo: [X ingenieros, Scrum / Kanban / mixto]
Metodología: [Scrum (sprints con límite de tiempo) / Kanban (flujo continuo) / Scrumban]
Tipo de proyecto: [Software / Empresarial / Gestión de servicios]
Necesidades de integración: [GitHub / GitLab / Confluence / Slack]

Configuración recomendada:

Tipo de proyecto: [Software] — te da sprints, backlog y reporting de velocidad

Jerarquía de problemas:
Épica → Historia → Sub-tarea (estándar)
o
Iniciativa → Épica → Historia → Sub-tarea (para programas más grandes)

Diseño de flujo de trabajo:
Simple (recomendado para la mayoría de equipos):
  Por hacer → En progreso → En revisión → Hecho

Con más granularidad:
  Backlog → Seleccionado para Dev → En progreso → En revisión → En QA → Hecho

Estados a evitar:
- "Esperando" sin claridad sobre quién espera qué
- Demasiados estados — cada estado es un entrega que necesita un ritual

Puntos de historia vs. estimaciones de tiempo:
- Usar puntos de historia para estimación relativa de complejidad (Fibonacci: 1,2,3,5,8,13)
- Nunca usar horas — precisión falsa que consume tiempo de discusión

Componentes: usar para agrupar por área técnica (Frontend, Backend, Infrastructure, Mobile)
Etiquetas: usar para preocupaciones transversales (rendimiento, seguridad, deuda)

Configura este proyecto y establece el tablero inicial.
```

### Consultas JQL

```
Escribe consultas JQL para [caso de uso].

Necesito encontrar: [describe lo que buscas]
Proyecto: [clave de proyecto — p. ej. ENG, BACKEND]

Patrones JQL comunes:

Todos los problemas abiertos asignados a mí:
  assignee = currentUser() AND resolution = Unresolved

Problemas añadidos al sprint actual después de que comenzó (scope creep):
  sprint = "Sprint 23" AND created > startOfSprint()

Todos los errores de alta prioridad abiertos por más de 7 días:
  issuetype = Bug AND priority in (High, Critical) AND created <= -7d AND resolution = Unresolved

Problemas en revisión sin comentarios en 2+ días (PRs obsoletas):
  status = "In Review" AND updated <= -2d AND issuetype = Story

Todos los problemas en una épica:
  "Epic Link" = ENG-123
  o (Próxima generación): parentEpic = ENG-123

Bloqueadores de velocidad (en progreso más tiempo que el promedio del sprint):
  status = "In Progress" AND updated <= -5d AND sprint in openSprints()

Problemas resueltos esta semana (para standup / notas de lanzamiento):
  status = Done AND resolved >= startOfWeek()

Todos los problemas sin asignación en el backlog:
  assignee is EMPTY AND status = "To Do" AND sprint is EMPTY

Escribe una consulta JQL para mi caso de uso específico. Incluye una descripción de lo que devuelve.
```

### Planificación del sprint

```
Ayúdame a ejecutar la planificación del sprint para [equipo].

Equipo: [X ingenieros]
Duración del sprint: [1 semana / 2 semanas]
Velocidad del equipo: [X puntos de historia promedio de los últimos 3 sprints]
Objetivo del sprint para este sprint: [lo que queremos lograr]
Estado del backlog: [mantenido / necesita mantenimiento]

Lista de verificación de planificación del sprint:

Pre-planificación (día antes):
□ Backlog mantenido: top 20 items estimados y comprendidos
□ Objetivo del sprint redactado (1 frase — a qué se parece el éxito)
□ Capacidad confirmada: ¿quién está fuera? (PTO, on-call, entrevistas)
□ Capacidad ajustada: [velocidad del equipo × disponibilidad %]

Durante la planificación (sesión de 2 horas para sprint de 2 semanas):

Parte 1 — Alineación de objetivos (15 min):
- PO presenta el objetivo del sprint
- El equipo confirma que es alcanzable y valioso
- ¿Hay algún bloqueador para iniciar el sprint?

Parte 2 — Refinamiento del backlog (45 min, si no se ha hecho):
- Recorre los mejores items del backlog
- El equipo hace preguntas aclaratorias → agrega criterios de aceptación
- Re-estima si la comprensión cambió

Parte 3 — Compromiso (45 min):
- El equipo tira historias de la parte superior del backlog hasta que se alcanza la velocidad
- Los ingenieros desglosan historias en sub-tareas (ayuda a revelar complejidad oculta)
- Llama la atención sobre las dependencias entre items
- Últimos 10 min: relê el sprint — ¿está todos de acuerdo?

Parte 4 — Sprint iniciado (15 min):
- Inicia el sprint en Jira
- Mueve la primera tarea de cada persona a "En progreso"

JQL para verificación de capacidad:
  sprint = "Sprint [X]" AND assignee = [ingeniero] ORDER BY priority

Resultado: plantilla de agenda de planificación del sprint + consultas JQL para la sesión.
```

### Informes y dashboards de Jira

```
Construye un dashboard de Jira para [audiencia].

Audiencia: [equipo de ingeniería / gerente de producto / ejecutivo]
Métricas necesarias: [velocidad / tasa de errores / salud del sprint / progreso OKR]

Gadgets de dashboard para equipos de ingeniería:
- Salud del sprint: problemas hechos vs. comprometidos (burndown)
- Gráfico de velocidad: últimos 6-8 sprints — ¿tendencia arriba/abajo/plana?
- Creados vs. Resueltos: ¿resolvemos errores más rápido de lo que se crean?
- Tiempo de ciclo: tiempo promedio de "En progreso" a "Hecho" por tipo de problema

Dashboard para gerentes de producto:
- Progreso de épicas: % completo para cada épica en vuelo
- Burndown de lanzamiento: puntos de historia restantes hacia el objetivo de lanzamiento
- Problemas sin estimaciones: marcar brechas de planificación
- Hecho este sprint: lo que se envió (usar en revisión semanal)

Dashboard ejecutivo:
- Salud de OKR: [personalizado — vincula épicas a OKR a través de etiquetas o campo personalizado]
- Tendencia de velocidad del equipo: [¿nos estamos volviendo más rápidos o más lentos?]
- Conteo de errores por gravedad: [¿cuántos errores críticos/altos abiertos?]
- Cadencia de lanzamiento: [fechas de los últimos 5 lanzamientos]

JQL para gadgets de dashboard comunes:
Tasa de errores (errores creados en los últimos 30 días):
  issuetype = Bug AND created >= -30d

Tiempo de ciclo (resuelto este sprint):
  status = Done AND sprint in closedSprints() ORDER BY resolved DESC

Backlog sin estimar:
  story_points is EMPTY AND status = "To Do" AND sprint is EMPTY

Construye la configuración de gadget de dashboard para mi audiencia.
```

### Recetas de automatización

```
Configura automatización de Jira para [flujo de trabajo].

Caso de uso: [describe lo que quieres automatizar]

Recetas comunes de automatización de Jira:

Asignación automática al cambio de estado:
  Disparador: Problema transicionó a "En revisión"
  Condición: El asignado es [ingeniero]
  Acción: Asignar a [revisor] + Agregar comentario "Listo para revisión"

Cierre automático de errores obsoletos:
  Disparador: Programado (semanalmente)
  Condición: status = "To Do" AND updated <= -90d AND priority = Low
  Acción: Transicionado a "Won't Fix" + Comentario "Auto-cerrado después de 90 días de inactividad"

Notificar Slack sobre error crítico:
  Disparador: Problema creado
  Condición: issuetype = Bug AND priority = Critical
  Acción: Enviar mensaje Slack a #engineering-alerts con enlace del problema

Sincronizar PRs de GitHub con Jira:
  Disparador: PR de GitHub abierto (a través de integración de GitHub)
  Acción: Transicionado problema vinculado a "En revisión"

Auto-transición al hacer merge de PR:
  Disparador: PR de GitHub hecho merge
  Acción: Transicionado problema Jira vinculado a "Hecho"

Advertencia de velocidad del sprint:
  Disparador: Programado (diariamente, durante el sprint)
  Condición: Sprint % completo > 70% AND puntos hechos / puntos comprometidos < 0.5
  Acción: Notificar PO a través de comentario en tablero del sprint

Escribe las reglas de automatización para mi caso de uso específico.
```

## Ejemplo

**Usuario:** Nuestro tablero de Jira es un desastre — 200+ problemas en el backlog, la mitad sin estimaciones, sin objetivos de sprint claros, y la velocidad ha caído de 45 a 28 en 3 meses. ¿Por dónde empiezo?

**Plan de recuperación de Claude:**

Caída de velocidad de 45→28 en 3 meses = decline de 38%. No es un problema de Jira — Jira está exponiendo un problema del equipo. No reconfigures Jira sin entender la causa real.

**Paso 1 — Diagnostica antes de reparar (esta semana):**

JQL: ¿qué se hizo en cada uno de los últimos 3 sprints?
```
sprint in closedSprints() AND status = Done ORDER BY resolved DESC
```
¿Aparecen repetidamente los mismos tipos de problemas? Si es así: errores recurrentes o deuda técnica no resuelta comiendo velocidad.

JQL: ¿cuántos errores se crearon en los últimos 90 días?
```
issuetype = Bug AND created >= -90d
```
Si el volumen de errores está aumentando, la caída de velocidad es causada por trabajo no planificado, no disfunción de planificación.

**Paso 2 — Cirugía del backlog (1 sesión de equipo, 90 min):**
- Ordenar por "Last Updated" ascendente
- Cualquier problema sin tocar > 3 meses sin sprint asignado → archivar (no lo hará o no lo hará)
- No los estimes — simplemente elimina el ruido
- Objetivo: backlog bajo 80 items antes del próximo sprint

**Paso 3 — Restaura la higiene del sprint:**
- Objetivo del sprint: una frase, acordado antes de que inicie el sprint
- No agregar items a mitad del sprint sin quitar algo de tamaño equivalente
- Retrospectiva: ejecutar un "¿qué nos ralentizó este sprint?" al final de cada sprint durante 4 sprints

**Paso 4 — Rastra tiempo de ciclo, no solo velocidad:**
Agrega un gadget "Cycle Time" a tu tablero. Si el tiempo de ciclo aumenta (las historias toman más tiempo en completarse), el problema es el límite WIP — demasiadas cosas en progreso a la vez.

---
