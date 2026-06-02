---
name: stakeholder-comms
description: "Borradores de comunicación con partes interesadas: anuncios de la empresa, actualizaciones sensibles, preparación de reuniones generales, comunicaciones con el consejo y mensajes de crisis — para asistentes ejecutivos y jefes de gabinete que apoyan a ejecutivos"
---

# Habilidad de Comunicaciones con Partes Interesadas

## Cuándo activar
- Al redactar un anuncio para toda la empresa (reorganización, cambio de liderazgo, giro de producto, actualización de política)
- Al redactar comunicaciones sensibles que podrían malinterpretarse — despidos, malas noticias, cambios difíciles
- Al preparar al ejecutivo para una reunión general — guión, preparación de preguntas y respuestas, mensajes clave
- Al redactar comunicaciones con el consejo — resúmenes de reuniones, actualizaciones fuera de ciclo, solicitudes sensibles
- Al escribir a inversores, socios o medios de comunicación con precisión y cuidado
- En cualquier comunicación donde una palabra incorrecta en el lugar equivocado cause un problema real

## Cuándo NO usar
- Comunicaciones internas rutinarias que no conllevan riesgo — usa el correo electrónico estándar
- Presentaciones legales o envíos regulatorios — trabaja con asesores legales
- Comunicados de prensa públicos que requieren experiencia en relaciones con medios — coordina con tu equipo de relaciones públicas
- Comunicaciones de crisis en tiempo real — esta habilidad ayuda a redactar, no a gestionar la respuesta en tiempo real

## Importante

Las comunicaciones sensibles — especialmente sobre despidos, transiciones de liderazgo y rendimiento financiero — deben ser revisadas por asesoría legal y recursos humanos antes de su distribución. Claude ayuda a redactar de manera eficiente y a detectar problemas de tono, pero no reemplaza la revisión legal.

## Instrucciones

### Prompt de anuncio para toda la empresa

```
Draft a company-wide announcement from [executive name/title].

ANNOUNCEMENT TYPE: [reorg / leadership change / product change / policy update / milestone / acquisition / partnership]

WHAT IS HAPPENING:
[The factual change — be specific]

WHY IT IS HAPPENING:
[The business rationale — honest, not spin]

WHAT IT MEANS FOR EMPLOYEES:
[How this affects their day-to-day, their teams, their roles — be specific]

WHAT IS NOT CHANGING:
[Anchor employees in stability where possible]

TIMING:
- When this takes effect: [date]
- When employees will hear more: [follow-up communication plan]

SENSITIVE ELEMENTS:
[Anything that needs to be handled carefully — impacted individuals, legal constraints, uncertainty]

AUDIENCE: [all employees / specific team / specific level / global or single region]
TONE: [confident and clear / empathetic and direct / formal / conversational]
LENGTH: [brief — under 300 words / full announcement — 400-600 words]

Draft the announcement. Lead with the news, not the context. People read the first sentence and decide whether to keep reading.
```

---

### Anuncio de cambio de liderazgo

```
Draft a leadership change announcement.

CHANGE TYPE: [new hire / departure / promotion / interim appointment / retirement]
PERSON: [name, current/new title]
EFFECTIVE DATE: [date]

CONTEXT:
- Why this change is happening: [strategic hire / performance / personal decision / retirement / reorg]
- What the person is known for (if external hire): [brief background]
- Where a departing leader is going (if known and they've agreed to disclose): [next step]

MESSAGING GOALS:
- About the departing leader (if applicable): [acknowledge contributions, warm send-off]
- About the incoming leader (if applicable): [establish credibility, inspire confidence]
- About stability: [reassure the team that the business continues well]

INTERNAL VS. EXTERNAL:
- Internal announcement: [honest, warm, includes context]
- External announcement (LinkedIn, press): [brief, positive framing, less internal context]
- Customer communication (if leader had customer-facing role): [reassure on continuity]

Draft all three versions if needed, or specify which.
```

---

### Comunicación de despidos / reducción de plantilla

```
Draft layoff communications. This is among the most sensitive communication an executive sends.

CONTEXT:
- Number of employees affected: [N] ([X]% of workforce)
- Roles or teams affected: [describe or "company-wide / select roles"]
- Business reason: [honest, factual — e.g., "need to reduce spend to extend runway," "closing [division]"]
- Severance and benefits: [X weeks severance per year of service / benefits through X date / outplacement support]
- What's happening to impacted employees today: [meeting time, who informs them, how]

AUDIENCE OF THIS COMMUNICATION:
- All-company email: [goes to everyone simultaneously, after impacted employees have been personally notified]
- Manager talking points: [for people managers to use in 1:1 conversations]
- Survivor communication: [for those who are staying — often overlooked]

LEGAL REVIEW:
[Note whether legal has reviewed — this draft should be reviewed by legal/HR before sending]

PRINCIPLES FOR THIS DRAFT:
1. State the news clearly in the first sentence — do not bury it
2. Take responsibility — do not blame market conditions as though the company played no role
3. Be specific about support — severance, benefits, references, outplacement
4. Express genuine appreciation for the people leaving
5. Give the remaining team something to hold onto — why the company will succeed
6. Do not use corporate euphemisms ("parting ways," "letting go") — say "laid off"

Draft: all-company email and manager talking points. Flag any language that should be reviewed by legal.
```

---

### Preparación de reunión general

```
Prepare the executive for an all-hands meeting.

MEETING DATE: [date]
AUDIENCE: [all employees / department / region]
DURATION: [X minutes]
FORMAT: [in-person / virtual / hybrid]

CONTEXT:
- Why this all-hands is happening: [routine quarterly / post-announcement / crisis / milestone]
- What employees are feeling right now: [your read — anxious / excited / frustrated / uncertain]
- Key topics to cover: [list]

EXECUTIVE'S KEY MESSAGES (3-5 max — people remember 3 things):
1. [Most important thing you want them to walk away with]
2. [Second message]
3. [Third message]

TOUGH Q&A (questions the exec will likely face):
[List 5-8 difficult questions employees might ask — especially the ones no one wants to answer]

For each question:
- The honest answer (even if partial)
- If you can't answer: a genuine "here's what I can and can't share, and when you'll know more"
- Never: a non-answer that insults the audience's intelligence

Generate:
1. Opening script (2-3 minutes — how to start the all-hands)
2. Key messages talking points (not a full script — bullets to guide)
3. Closing (how to end — specific and motivating, not generic)
4. Q&A preparation (hard questions + honest answers)
5. Audience read: what does the team need to hear emotionally, not just factually?
```

---

### Comunicación con el consejo — actualización fuera de ciclo

```
Draft an off-cycle board communication from the executive.

COMMUNICATION TYPE: [bad news update / milestone announcement / request for approval / strategic change / financial reforecast]
BOARD MEMBERS: [N board members — [lead investor, independent directors]]

THE UPDATE:
- What is happening: [the situation]
- Why you're communicating off-cycle: [urgency or significance]
- What you need from the board: [information only / decision / vote / support]
- Timeline: [when decision is needed, if applicable]

FRAMING:
- Are you in control of the situation? [yes / mostly / no — calibrate tone accordingly]
- What's the business impact? [revenue / runway / legal / reputational]
- What's your plan? [describe your response or plan of action]

Board communications should be:
- Direct — state the news in the first sentence
- Brief — boards want facts and what's needed, not narrative
- Specific — include numbers where relevant
- Action-oriented — what do you need from them and when?

Draft the board update email. Under 400 words. Attach supporting materials if relevant.
```

---

### Resumen de reunión del consejo

```
Draft a post-board-meeting summary to distribute to the board.

BOARD MEETING DATE: [date]
ATTENDEES: [list]

DECISIONS MADE:
[List each decision with specifics — who approved what]

KEY DISCUSSIONS:
[Bullet points for major topics discussed — not a transcript, the substance]

ACTION ITEMS:
| Action | Owner | Due Date |
|---|---|---|
| [action 1] | [name] | [date] |
| [action 2] | [name] | [date] |

NEXT BOARD MEETING: [date, format, location]

MATERIALS DISTRIBUTED:
[List all materials shared at or before the meeting]

Draft the board meeting summary. Professional, factual. Under 300 words excluding the action items table.
```

---

### Comunicación sensible 1:1 — ejecutivo a subordinado directo

```
Draft a sensitive communication from an executive to a direct report.

SITUATION: [performance conversation / role change / compensation decision / difficult feedback / recognition]
EXECUTIVE: [name, title]
RECIPIENT: [name, title]
RELATIONSHIP: [long-tenured / new hire / high performer / performance managed]

THE MESSAGE:
- What needs to be communicated: [the substance]
- Tone: [supportive / firm / celebratory / corrective]
- What the person needs to hear: [the emotional reality — are they surprised? expecting this? resilient?]
- What the exec wants as an outcome: [behavior change / retention / clarity / acknowledgment]

CONSTRAINTS:
[Legal constraints, HR involvement, anything that must be included or excluded]

Draft the written version of this communication (email or talking points for a conversation). 
Do not make it clinical or cold. Do not make it so soft the message is unclear.
Strike the balance: direct, specific, professional, and human.
```

---

### Comunicación de crisis — interna

```
Draft internal crisis communication.

CRISIS TYPE: [data breach / product outage / legal action / regulatory action / reputational / financial]
SEVERITY: [1 = existential / 2 = significant but manageable / 3 = contained]
CURRENT STATUS: [what is known vs. unknown right now]

FACTS (only confirmed — mark anything uncertain):
- What happened: [confirmed facts]
- When: [timeline]
- Who is affected: [employees / customers / partners / public]
- Current status: [contained / ongoing / under investigation]
- What we are doing: [response actions underway]

WHAT WE DON'T KNOW YET:
[Be explicit — employees trust leaders who acknowledge uncertainty over those who fake certainty]

AUDIENCE: [all employees / leadership team / customer-facing teams]

FIRST COMMUNICATION GOALS:
1. Acknowledge the situation honestly
2. State what we know and don't know
3. Describe what we're doing
4. Tell people where to direct questions
5. Commit to a follow-up communication by [time]

Draft the initial internal communication. Under 300 words. Clear, calm, factual.
Draft talking points for managers who will receive questions from their teams.
```

## Ejemplo

**Usuario:** Nuestro CEO necesita anunciar que estamos cerrando la oficina de Londres y ofreciendo a los 12 empleados trabajo en remoto o baja voluntaria. La empresa es rentable, pero la oficina cuesta £40K/mes y el equipo ha trabajado principalmente en remoto desde COVID de todas formas. Necesitamos un correo para todos los empleados, puntos de conversación para el gerente de Londres y una nota para los 12 empleados afectados específicamente.

**Resultado esperado:** Tres documentos. Correo para todos los empleados: comienza con "estamos cerrando la oficina de Londres" en la primera oración, explica la justificación (eficiencia de costes, el equipo ya trabaja en remoto con éxito), indica la fecha de efecto, describe qué significa esto para los 12 afectados (paquete de baja voluntaria o acuerdos de trabajo en remoto formal) y qué cambia para todos los demás (nada — el negocio continúa con normalidad). Puntos de conversación para el gerente de Londres: qué decir si los miembros del equipo preguntan "¿por qué ahora?", cómo manejar las reacciones emocionales, cómo funciona el proceso de baja voluntaria. Nota directa a los 12 afectados: tono más cálido, específico sobre sus opciones, específico sobre el paquete de apoyo, expresa agradecimiento genuino, menciona el contacto de recursos humanos para preguntas.

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
