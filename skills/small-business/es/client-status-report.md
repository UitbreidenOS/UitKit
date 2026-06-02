---
name: client-status-report
description: "Informe de estado semanal para clientes: progreso vs. plan, trabajo completado, bloqueos, decisiones pendientes, vista previa de la próxima semana — genera confianza y elimina las llamadas de seguimiento"
---

# Habilidad: Informe de Estado para Clientes

## Cuándo activar
- Le debes a un cliente una actualización semanal o quincenal y quieres que sea profesional y consistente
- Un proyecto es complejo y quieres un registro escrito de lo que se entregó cada semana
- Un cliente está quedando en silencio y quieres retomarlo con sustancia, no con un simple recordatorio
- Quieres anticipar bloqueos proactivamente antes de que se conviertan en quejas
- Al final de un período de facturación — ¿qué recibieron por su dinero?

## Cuándo NO usar
- Proyectos únicos simples con una sola entrega — usa las notas de factura en su lugar
- Actualizaciones de gestión de proyectos en tiempo real (usa Asana, Linear o Notion para eso)
- Gestión de proyectos orientada al cliente donde necesitan acceso en vivo al estado de tareas — usa un tablero de proyecto compartido

## Instrucciones

### Prompt de informe de estado semanal

```
Write a weekly client status report for my consulting/freelance engagement.

PROJECT: [project name]
CLIENT: [company name — first name or company, your preference]
REPORTING PERIOD: Week of [date range]
BILLING PERIOD: [if relevant — e.g., "Billed this week: X hours / $X"]

STATUS OVERALL: [Green / Yellow / Red]
- Green: on track, no blockers
- Yellow: minor issues, manageable, client should be aware
- Red: requires client decision or action to stay on track

WORK COMPLETED THIS WEEK:
[List what you actually delivered — be specific, not vague]
1. [Task or deliverable — e.g., "Completed homepage redesign mockups (3 variants) — shared via Figma link"]
2. [Task — e.g., "Led client discovery session with 2 stakeholders — notes attached"]
3. [Task — e.g., "Drafted and delivered Week 2 content calendar (12 posts, awaiting approval)"]

WORK IN PROGRESS:
[What you're currently working on that carries into next week]
1. [WIP item — what it is, current status, when it will be done]
2. [WIP item]

BLOCKERS / WAITING ON CLIENT:
[What you need from them to keep the project moving — be explicit]
1. [Blocker — e.g., "Waiting on brand guidelines PDF — needed to finalize visual direction by Wednesday"]
2. [Blocker — e.g., "Need sign-off on content calendar before scheduling begins"]
3. [None — if nothing is blocked]

DECISIONS NEEDED:
[Decisions the client needs to make — not requests, decisions]
1. [Decision — e.g., "Choose between Homepage Variant A or B by EOD Wednesday (Variant A was preferred in feedback)"]
2. [None — if no decisions needed]

NEXT WEEK PLAN:
[What you'll work on next week]
1. [Next week task]
2. [Next week task]
3. [Next week task]

NOTES OR CONTEXT:
[Anything the client should know — timeline changes, risks, positive developments]

Write a professional, client-facing status report. Tone: competent and collaborative, not defensive or corporate. Under 400 words. Lead with the status color and the headline for the week.
```

---

### Informe de escalación (estado Amarillo o Rojo)

Cuando algo ha salido mal o está en riesgo:

```
Write a client status report for a project that is at risk (Yellow / Red status).

PROJECT: [name]
CLIENT: [name]
SITUATION: [brief description of what's wrong]

The issue:
- What happened: [specific, factual description]
- When it was discovered: [date]
- Impact on timeline: [X days / X weeks delayed / on track if action taken by X date]
- Impact on budget: [none / X additional hours / X additional cost]

Root cause (if known):
[Why did this happen? Be honest — blame-shifting destroys client trust faster than the problem does]

What you're doing about it:
1. [Action 1 — already taken]
2. [Action 2 — in progress]
3. [Action 3 — planned]

What you need from the client:
[Specific decision or input needed, with a deadline]

Options for the client:
Option A: [approach] — timeline: [X], cost: [X], tradeoff: [X]
Option B: [approach] — timeline: [X], cost: [X], tradeoff: [X]

Write the escalation version of the status report. Take ownership, show a plan, ask for what you need. Do not over-apologize. Do not make the client feel panicked.
```

---

### Informe de cierre de proyecto

```
Write a project completion summary report for the client.

PROJECT: [name]
CLIENT: [name]
PROJECT DURATION: [start date] to [end date]
TOTAL BILLED: $[X] ([X] hours / flat fee)

WHAT WAS DELIVERED:
[Complete list of deliverables — numbered, specific]
1. [Deliverable — link or description]
2. [Deliverable]
...

WHAT WAS ACHIEVED (outcomes where possible):
[If you know any results — traffic, conversions, launch metrics, client feedback — include them]
- [Outcome or result]

WHAT'S OUTSTANDING (if anything):
[Any open items, ongoing responsibilities, or things requiring client follow-through]

HANDOVER NOTES:
[Logins, file locations, documentation, ongoing maintenance notes]

WHAT'S NEXT:
[Your recommendation for next steps — even if you're not the one to execute them. Shows strategic thinking.]

TESTIMONIAL / REFERENCE REQUEST (optional section):
[Soft ask for a testimonial or reference — professional, not pushy]

Write the project completion report. Professional, confident, value-focused. Under 500 words.
```

---

### Informe de cliente en modalidad retainer (compromiso continuo)

Para clientes con un contrato mensual de retención:

```
Write a monthly retainer status report.

CLIENT: [name]
RETAINER: $[X]/month for [description of scope]
REPORTING MONTH: [month year]

HOURS USED THIS MONTH: [X] hours of [X] contracted
HOURS ROLLED OVER (if applicable): [X] hours / [none]

WORK COMPLETED THIS MONTH:
[Full list with time estimates if helpful]

HIGHLIGHTS (most impactful work this month):
[1-3 things where your work clearly created value]

ONGOING PRIORITIES (what we're working on):
[Items that continue into next month]

UPCOMING NEXT MONTH:
[What you'll focus on next month — shows proactive planning]

RETAINER HEALTH:
- Utilization: [X]% of retainer hours used
- Scope drift check: [are we still doing what the retainer was set up for, or has scope shifted?]
- Recommended adjustments: [increase hours / add a scope item / no changes]

Write the monthly retainer report. Position yourself as a strategic partner, not an hourly worker. Make it easy for them to renew.
```

---

### Plantillas de informe por tipo de proyecto

**Proyecto de software / desarrollo:**
```
STATUS: [Green/Yellow/Red]
Sprint [N] — Week [N] of [total]

Completed:
- [Feature or task] — [deployed to staging / in review / shipped to production]

Testing status:
- [X] of [Y] acceptance criteria passing
- Open issues: [list or "none"]

Blockers:
- [Waiting on API credentials] / [None]

Next sprint: [what you're building next]

Demo: [link to staging environment]
```

**Proyecto de diseño:**
```
STATUS: [Green/Yellow/Red]
Project: [name] — Week [N] of [total]

Delivered for review:
- [Figma link: Homepage — 3 variants]
- [Asset exported and shared via [location]]

Awaiting client input on:
- [Which homepage variant to proceed with]
- [Brand color preference between options A/C]

Working on:
- [About page layout — 60% complete]

Next week: [what's next]
```

**Proyecto de contenido / redacción:**
```
STATUS: [Green/Yellow/Red]
Content retainer — [Month]

Published this week:
- [Title] — [URL] — [published date]
- [Title] — [URL]

In draft / review:
- [Title] — [status: drafting / client review / revisions in progress]

In planning:
- [Topic] — scheduled for [date]

Calendar for next 2 weeks: [Google Doc link or inline table]
```

---

### Correo electrónico de envío del informe

```
Write a brief email to send the weekly status report.

CLIENT FIRST NAME: [name]
REPORT PERIOD: [date range]
OVERALL STATUS: [Green / Yellow / Red]
KEY HEADLINE: [the most important thing this week — one sentence]
NEXT ACTION FROM CLIENT (if any): [what you need from them]

Write an email under 4 sentences:
1. Greeting + status color in natural language
2. One-sentence headline
3. Report is attached/below
4. Any specific ask or note

Not formal. Not a form letter. Should sound like a professional colleague who respects their time.
```

## Ejemplo

**Usuario:** Soy estratega de contenido freelance. Cliente: una startup SaaS llamada Alora (el contacto es Priya, Jefa de Marketing). Semana 3 de un compromiso de estrategia de contenido de 12 semanas. Completé esta semana: terminé el cuaderno de investigación de palabras clave (compartido en Notion), realicé el taller de voz de marca (asistieron 3 personas), redacté el calendario editorial para el tercer trimestre. Bloqueado en: no he recibido su hoja de ruta de producto para alinear el contenido con los lanzamientos. Necesito de ellos: aprobación del calendario editorial para poder comenzar a escribir los briefs la próxima semana.

**Resultado esperado:** Un informe de estado profesional con el encabezado "Semana 3 — Verde", tres elementos completados listados específicamente (cuaderno de palabras clave, taller de voz de marca, borrador del calendario editorial del T3), un bloqueo explícito (hoja de ruta del producto), una decisión necesaria (aprobación del calendario antes del miércoles), y vista previa de la próxima semana (escritura de briefs para las primeras 4 piezas de contenido, asumiendo aprobación recibida). Correo electrónico de envío: "La semana 3 está lista — Verde en todos los frentes..." en menos de 4 oraciones, con el informe adjunto o en línea.

---

> **Trabaja con nosotros:** Claudient cuenta con el respaldo de [Uitbreiden](https://uitbreiden.com/) — desarrollamos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
