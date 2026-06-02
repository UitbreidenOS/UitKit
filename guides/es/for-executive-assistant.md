# Claude para Asistentes Ejecutivos y Jefes de Gabinete

Todo lo que un EA, EA Senior o Jefe de Gabinete necesita para ejecutar soporte ejecutivo asistido por IA — briefings, gestión de reuniones, comunicaciones con partes interesadas, preparación para el consejo de administración y seguimiento de proyectos en Claude Code.

---

## Para quién es esto

Eres un Asistente Ejecutivo o Jefe de Gabinete que apoya a un ejecutivo de nivel C. Tu trabajo es hacer que tu ejecutivo sea más efectivo controlando lo que le llega, preparándolo para lo que importa y gestionando todo lo que no requiere su atención directa. Pasas los días en un estado permanente de cambio de contexto — preparación para el consejo, comunicaciones con partes interesadas, briefings, logística, y cualquier cosa que se escape por las grietas.

Claude Code se convierte en tu motor de preparación: briefings redactados en minutos, comunicaciones sensibles revisadas antes de llegar al escritorio de tu ejecutivo, y presentaciones para el consejo estructuradas antes de que el ejecutivo las toque.

**Antes de Claude Code:** 90 minutos para preparar un briefing ejecutivo sólido. 45 minutos para redactar un comunicado sensible para toda la empresa. 2 horas para construir un documento de preparación para el consejo desde cero.

**Después:** Briefing ejecutivo en 20 minutos. Borrador de comunicado en 15 minutos. Preparación para el consejo en 30 minutos.

---

## Instalación en 30 segundos

```bash
# Instalar habilidades para EA y JG
npx claudient add skill small-business/meeting-to-action
npx claudient add skill small-business/monday-brief
npx claudient add skill productivity/board-deck-builder
npx claudient add skill productivity/confluence-expert
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/stakeholder-comms

# Instalar el agente jefe de gabinete
npx claudient add agent advisors/chief-of-staff
```

---

## Tu pila de Claude Code para EA y JG

### Habilidades (comandos de barra)

| Habilidad | Qué hace | Cuándo usarla |
|---|---|---|
| `/exec-briefing` | Briefing previo a la reunión: perfiles de asistentes, puntos de conversación, agenda, resultados deseados, a qué NO comprometerse | Cualquier reunión de alto impacto |
| `/stakeholder-comms` | Anuncios de empresa, actualizaciones sensibles, preparación de reuniones generales, comunicaciones del consejo, mensajes de crisis | Cualquier borrador de comunicación significativa |
| `/meeting-to-action` | Transcripción o notas → elementos de acción, decisiones, responsables, plazos | Después de cada reunión importante |
| `/monday-brief` | Documento de briefing semanal para el ejecutivo — prioridades, reuniones clave, lista de seguimiento | Cada lunes por la mañana |
| `/board-deck-builder` | Estructura de la presentación del consejo, narrativa y preparación de contenido | Reuniones del consejo mensuales o trimestrales |
| `/confluence-expert` | Gestión de documentos, estructura del wiki, base de conocimiento del equipo | Documentación y gestión del conocimiento |

### Agente

| Agente | Modelo | Cuándo activarlo |
|---|---|---|
| `chief-of-staff` | Sonnet | Planificación estratégica compleja, coordinación de múltiples partes interesadas, diseño del ritmo operativo |

---

## Flujo de trabajo diario

### Mañana (30 minutos)

**1. Brief del lunes — lo que tu ejecutivo necesita saber esta semana**

Ejecutar cada lunes por la mañana antes de que el ejecutivo comience su día:

```
/monday-brief

Brief semanal para [nombre del ejecutivo] — semana del [rango de fechas].

REUNIONES CLAVE ESTA SEMANA:
- [Día, hora]: [Nombre de reunión] — [contexto breve — quién, qué está en juego]
- [Día, hora]: [Nombre de reunión] — [contexto breve]
- [Día, hora]: [Nombre de reunión] — [contexto]

ENTREGABLES DEL EJECUTIVO ESTA SEMANA:
- [Elemento] — vence [fecha] — [quién lo necesita]
- [Elemento]

COSAS QUE NECESITAN SABER (pero probablemente aún no saben):
- [Desarrollo importante — noticias de competidores, situación del equipo, sentimiento de partes interesadas]
- [Elemento]

DECISIONES PENDIENTES (el ejecutivo debe tomar esta semana):
- [Decisión] — contexto: [breve] — plazo: [fecha]

QUÉ VIGILAR:
[Cualquier cosa en desarrollo que aún no se ha vuelto urgente pero lo hará si no se gestiona]

Formato: máximo 1 página. Viñetas. Sin relleno. El ejecutivo lee esto en 3 minutos.
```

**2. Briefings previos a reunión — preparación del mismo día**

Para cualquier reunión de alto impacto de hoy:

```
/exec-briefing

[Ejecutivo] tiene una reunión con [asistente(s)] a las [hora].

Propósito de la reunión: [de qué trata esta reunión]
Asistentes: [nombre, título, empresa — datos clave de cada uno]
Lo que queremos de esta reunión: [resultado]
Lo que ellos quieren de nosotros: [su objetivo]
Historial: [cualquier antecedente relevante]
A qué NO comprometerse: [cualquier restricción]

Genera el briefing. Lo necesito para las [hora — 1-2 horas antes de la reunión].
```

---

### Post-reunión (15 minutos después de reuniones importantes)

**3. Reunión a elementos de acción**

```
/meeting-to-action

Extrae elementos de acción de esta reunión.

Reunión: [nombre]
Fecha: [fecha]
Asistentes: [lista]

[Pega notas, transcripción o tu resumen]

Extrae:
- Decisiones tomadas
- Elementos de acción (quién es responsable de qué y para cuándo)
- Preguntas abiertas (sin decisión tomada, necesita seguimiento)
- Comunicaciones de seguimiento necesarias
```

---

### Redacción de comunicaciones (a demanda)

**4. Comunicación sensible de empresa**

```
/stakeholder-comms

Borrador: [tipo de comunicación]
De: [nombre y cargo del ejecutivo]
Para: [audiencia]

La noticia: [qué está pasando]
Por qué está pasando: [justificación]
Qué significa para la audiencia: [impacto]
Tono: [empático / directo / festivo / cuidadoso]
Restricciones: [cualquier cosa que legal/RRHH haya dicho que no podemos incluir]

Revisar por: tono, claridad, cualquier cosa que pueda malinterpretarse, qué falta.
```

**5. Comunicación al consejo**

```
/stakeholder-comms

[Tipo de comunicación al consejo: resumen de reunión / actualización fuera de ciclo / solicitud / anuncio de hito].

Qué pasó o qué está pasando: [hechos]
Qué necesita hacer o saber el consejo: [acción o información]
Cronograma: [cuándo se necesita la decisión o cuándo habrá más información]

Menos de 400 palabras. Directo. Los hechos primero.
```

---

### Preparación para el consejo de administración (mensual o trimestral)

**6. Preparación de la presentación del consejo**

```
/board-deck-builder

Construye la estructura de la presentación del consejo para [nombre de empresa] — [T? Mes] [Año].

Fecha de la reunión del consejo: [fecha]
Composición del consejo: [lista de miembros clave]
Temas clave de este trimestre: [lista de puntos de la agenda]
Aspectos positivos del rendimiento a destacar: [métricas e hitos]
Desafíos a presentar con honestidad: [qué no salió como se planeó]
Decisiones necesarias del consejo: [lista]

Genera: esquema de la presentación, estructura de contenido diapositiva por diapositiva, puntos de conversación por sección, preguntas anticipadas del consejo.
```

---

### Cierre semanal (viernes)

**7. Resumen de fin de semana**

```
/monday-brief

Resumen de fin de semana para [ejecutivo].

LO QUE SE HIZO ESTA SEMANA:
[Lista de elementos importantes completados]

ELEMENTOS ABIERTOS QUE SE TRASLADAN A LA PRÓXIMA SEMANA:
[Lista]

LO QUE NECESITA ATENCIÓN DEL EJECUTIVO ANTES DEL LUNES:
[Cualquier elemento urgente para manejar antes de que cierre la semana]

VISTA PREVIA DE LA PRÓXIMA SEMANA:
[Reuniones clave, entregables y situaciones a vigilar]
```

---

## Plan de 30 días (nuevo EA o JG)

### Semana 1 — Mapear el panorama
- Instala todas las habilidades de EA/JG: `npx claudient add skill productivity/[nombre]`
- Conoce el calendario del ejecutivo: qué reuniones se repiten, cuáles son de alto impacto, cuáles temen
- Presenta el formato del brief del lunes al ejecutivo — ¿quieren más o menos detalle? ¿distinto enfoque?
- Identifica a las 5 partes interesadas más importantes en el mundo del ejecutivo y construye perfiles usando `/exec-briefing`

### Semana 2 — Flujo de trabajo de comunicaciones
- Redacta la próxima actualización del consejo o anuncio significativo usando `/stakeholder-comms`
- Muestra al ejecutivo el borrador antes y después — permite que vean el ahorro de tiempo y la calidad
- Establece el proceso de revisión de comunicaciones: ¿quién revisa los borradores sensibles antes de enviarlos?
- Usa `/meeting-to-action` en cada reunión durante una semana — rastrea qué se hace vs. qué no

### Semana 3 — Preparación para el consejo y partes interesadas
- Usa `/exec-briefing` para preparar al ejecutivo para su próxima reunión externa significativa
- Usa `/board-deck-builder` para la próxima reunión del consejo
- Revisa el resultado con el ejecutivo — calibra el nivel de detalle y qué agregar del conocimiento interno

### Semana 4 — Sistemas y automatización
- Documenta tu cadencia semanal — qué habilidades de Claude ejecutas en qué días
- Construye una biblioteca de prompts reutilizables para tus tareas más frecuentes
- Identifica en qué aún estás gastando demasiado tiempo — probablemente haya un flujo de trabajo en Claude para eso
- Establece puntos de referencia: ¿cuánto tiempo tarda cada tarea? Rastrea la mejora en los próximos 90 días

---

## Principios de comunicación de alto impacto

Estos se aplican a todo lo que redactas para tu ejecutivo:

**1. Lidera con la noticia, no con el contexto**
"Estamos cerrando la oficina de Londres a partir del 1 de marzo." No "Mientras continuamos evaluando nuestra huella inmobiliaria en el contexto de nuestra estrategia de trabajo híbrido en evolución..."

**2. Di lo difícil con claridad**
Los eufemismos no suavizan las malas noticias — señalan que el liderazgo no confía en la audiencia con honestidad, lo que destruye más confianza que la noticia misma.

**3. Tres cosas como máximo**
La gente recuerda tres cosas de cualquier comunicación. Si tienes siete puntos, elige tres. El resto va al apéndice o en el seguimiento.

**4. Diles qué sucede a continuación**
Cada anuncio significativo debe terminar con un paso siguiente específico — una reunión de seguimiento, una persona a contactar, una fecha para más información.

**5. La revisión legal no es opcional para comunicaciones sensibles**
Claude redacta de manera eficiente y detecta problemas de tono. No reemplaza la revisión de RRHH y legal para: despidos, acciones de rendimiento, asuntos regulatorios, cambios materiales de negocio.

---

## Integraciones de herramientas

### Google Calendar
Claude no puede leer el calendario de tu ejecutivo directamente (a menos que uses un MCP de calendario), pero puedes pegar las reuniones de la semana como texto. Usa este formato:
```
Lunes 9am: [título de la reunión] — [asistentes] — [duración] — [objetivo]
Lunes 11am: [reunión] ...
```
Luego ejecuta `/monday-brief` con eso como contexto.

### Slack / Teams
Redacta mensajes o anuncios sensibles en Claude → revisa → pega en Slack. Para resúmenes recurrentes de reuniones generales, pega los puntos de `/meeting-to-action` en tu canal del equipo.

### Notion / Confluence
Usa `/confluence-expert` para estructurar páginas de documentación. Claude redacta el contenido — lo pegas en tu wiki. Para documentos recurrentes (actualizaciones del consejo, briefs semanales), construye plantillas en Notion y complétalas con los resultados de Claude.

### Portal del consejo (Diligent, Boardvantage)
Claude genera las comunicaciones del consejo como texto → formatea y sube a tu portal del consejo. Para el contenido de la presentación, Claude proporciona la estructura y los puntos de conversación — tu diseñador construye la versión visual.

---

## Métricas a rastrear

| Actividad | Tiempo antes de Claude | Tiempo con Claude |
|---|---|---|
| Documento de briefing ejecutivo | 90 min | 20 min |
| Borrador de comunicado para toda la empresa | 45 min | 15 min |
| Preparación para reunión del consejo | 3 horas | 45 min |
| Elementos de acción de reunión | 30 min | 8 min |
| Brief del lunes | 30 min | 10 min |
| Borrador de comunicación sensible | 60 min | 20 min |

---

## Errores comunes (y cómo Claude Code los previene)

**Error 1: Briefings demasiado largos**
`/exec-briefing` está estructurado para producir documentos concisos y fáciles de escanear. Los ejecutivos no leen briefs largos — obtienen un resumen tanto si lo escribes como si no. Hazlo intencional.

**Error 2: Anuncios que entierran la noticia**
`/stakeholder-comms` está indicado para liderar con la noticia en la primera oración. Si Claude la entierra, márcalo y pide una reescritura con la noticia en la oración 1.

**Error 3: Elementos de acción de reuniones que no se realizan**
`/meeting-to-action` estructura los elementos de acción con responsable, fecha límite y métrica de éxito. Las acciones ambiguas no se realizan. Las específicas sí.

**Error 4: Comunicaciones sensibles que fallan en el registro emocional**
Claude verifica la claridad y los problemas de tono, pero tú conoces a tu ejecutivo y a tu cultura. Revisa cada comunicación sensible antes de que salga de tu escritorio — Claude es el primer editor, no el último.

**Error 5: Materiales del consejo que informan en lugar de orientar**
`/board-deck-builder` está diseñado para estructurar los materiales en torno a decisiones, no solo datos. Los consejos necesitan decidir cosas. Hazlo fácil para ellos.

---

## Recursos

- [Primeros pasos con Claude Code](getting-started.md)
- [Habilidad de briefing ejecutivo](../skills/productivity/exec-briefing.md)
- [Habilidad de comunicaciones con partes interesadas](../skills/productivity/stakeholder-comms.md)
- [Habilidad de reunión a acción](../skills/small-business/meeting-to-action.md)
- [Habilidad constructor de presentaciones para el consejo](../skills/productivity/board-deck-builder.md)

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
