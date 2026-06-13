---
name: interview-scorecard
description: "Tarjeta de puntuación de entrevistas estructurada: preguntas basadas en competencias, rúbrica de evaluación y plantilla de sesión informativa para decisiones de contratación consistentes y resistentes a sesgos"
---

# Habilidad de Tarjeta de Puntuación de Entrevistas

## Cuándo activar
- Tienes un puesto vacante y necesitas un proceso de entrevista estructurado antes de la primera entrevista con un candidato
- Quieres reducir la subjetividad del entrevistador y las decisiones de contratación basadas en corazonadas
- Necesitas capacitar a nuevos entrevistadores sobre cómo evaluar un puesto para el que nunca han contratado
- Estás preparándote para una entrevista específica y quieres preguntas dirigidas basadas en el perfil del candidato
- Tu proceso de sesión informativa es inconsistente — la gente vota a favor o en contra sin evidencia
- Estás construyendo un proceso de contratación para un tipo de puesto que nunca has contratado (nueva función, nuevo nivel de antigüedad)

## Cuándo NO usar
- Solo necesitas una descripción de puesto — usa `/job-description` para eso
- Búsqueda de candidatos — usa `/candidate-sourcer`
- Evaluación comparativa de compensaciones — usa `/comp-benchmarker`
- Conversaciones de verificación de referencias — habilidad diferente
- Cuando ya entrevistaste al candidato y estás escribiendo una evaluación de memoria sin notas (reconstruye solo a partir de notas reales de la llamada)

## Instrucciones

### Constructor de tarjeta de puntuación

```
Build a structured interview scorecard for [role].

Role: [Job title]
Level: [IC / Manager / Director / VP / C-suite]
Department: [Engineering / Sales / Marketing / CS / Ops / Finance]
Key responsibilities: [top 3-5 things this person will own]
Must-have competencies: [3-5 non-negotiable skills or traits]
Nice-to-have: [2-3 differentiators that separate good from great]
Deal-breakers: [specific backgrounds, signals, or traits that disqualify]

Build a scorecard with:

## Competencies to evaluate (4-6 per role)
For each competency:
- Name: [e.g., "Analytical thinking" / "Executive communication" / "Ownership mentality"]
- Definition: [exactly what does strong look like for this role at this level?]
- Why it matters: [how does this competency directly impact success in the role?]
- 2-3 interview questions:
  Question 1: [behavioural — "Tell me about a time you..."]
  Question 2: [situational — "How would you approach..."]
  Question 3 (optional): [follow-up probe — "What would you do differently?"]
- Evidence to look for in answers:
  Strong signal: [specific language, examples, or behaviour patterns]
  Weak signal: [vague answers, can't give examples, deflects responsibility]
  Red flag: [specific answer patterns that disqualify]

## Scoring rubric (for each competency)
4 — Exceptional: [specific description — goes beyond role requirements]
3 — Strong: [meets and consistently exceeds expectations]
2 — Developing: [inconsistently meets expectations — coaching needed]
1 — Not a fit: [below bar for this role at this level]

## Overall recommendation
Based on scores:
Average ≥ 3.5 → Strong Hire
Average 3.0-3.4 → Hire with reservations (note them)
Average 2.5-2.9 → No Hire (gaps too significant)
Average < 2.5 → Clear No Hire

## Debrief template
After each interview, each interviewer completes:
- Competency assessed: [which of the 4-6 competencies were you evaluating?]
- Evidence collected: [specific examples the candidate gave — quote them]
- Score per competency: [1-4 for each]
- Overall score: [1-4]
- Overall recommendation: [Strong Hire / Hire / No Hire / Strong No Hire]
- Top reason for recommendation: [1-2 sentences, evidence-based]
- Questions for the panel: [anything you want other interviewers to probe on]

Generate the full scorecard for [role].
```

### Biblioteca de preguntas basadas en competencias

```
Generate competency-based interview questions for [competency].

Competency: [e.g., "Customer obsession" / "Data-driven decision making" / "Cross-functional influence"]
Role level: [IC / Manager / Senior IC / Director]
Function: [Sales / Engineering / Product / Marketing / Operations]

Question format: always behavioural STAR-format (Situation, Task, Action, Result)

Generate:
- 3 primary questions (open-ended, behavioural, specific to this competency)
- 2 follow-up probes (dig deeper when answers are vague or too high-level)
- 1 situational/hypothetical (for roles where candidates lack direct experience)

For each question, provide:
What you're testing: [the specific sub-skill within this competency]
Strong answer looks like: [concrete, specific, owns the outcome, quantifies if possible]
Weak answer looks like: [vague, says "we" not "I", no clear outcome, blame-shifts]
Red flag in this answer: [avoids the question, makes up a story, contradicts resume]

Common competencies for SaaS/tech roles:
- Problem-solving under ambiguity
- Stakeholder communication and influence
- Data-driven decision making
- Customer empathy and obsession
- Ownership and accountability
- Learning agility and growth mindset
- Collaboration and conflict resolution
- Execution and delivery under pressure
- Strategic thinking and prioritisation
- Building and developing teams (manager-level)

Generate the question library for [competency].
```

### Diseño del panel de entrevistas

```
Design the interview panel structure for [role].

Role: [title]
Total interview stages: [X] (recommend 3-5 stages — more than 5 loses candidates)
Interview format: [remote / in-person / hybrid]
Decision-maker: [hiring manager]
Time to fill target: [X weeks]

Recommended panel design:

STAGE 1 — Recruiter screen (20-30 min, phone)
Purpose: Qualify basics — compensation, availability, motivation, communication
Who: Recruiter
Evaluates: culture fit baseline, communication, deal-breakers

STAGE 2 — Hiring manager screen (30-45 min, video)
Purpose: Assess technical competency and role fit at a high level
Who: Hiring manager
Evaluates: [top 2 competencies for this role]
Outputs: decision to advance or pass — no ambiguous "maybes" without specifics

STAGE 3 — Technical / skills assessment (varies)
Purpose: Role-specific evaluation — presentation, case study, take-home, live exercise
Who: Hiring manager + 1-2 domain experts
Format: [choose — live case / take-home with debrief / work sample / portfolio review]
Rule: Make it realistic and relevant — no trick questions, nothing that takes > 2 hours

STAGE 4 — Panel interviews (60-90 min total, 2-3 interviews back-to-back)
Purpose: Assess breadth of competencies from multiple perspectives
Who: 2-3 team members from relevant functions
Each interviewer gets assigned 1-2 competencies to evaluate — no overlap
Interviewers do NOT share impressions before debrief

STAGE 5 — Executive / leadership interview (30-45 min, optional for senior roles)
Purpose: Culture, leadership values, strategic fit
Who: Hiring manager's manager or C-suite
Evaluates: Vision alignment, communication at executive level, ambition

DEBRIEF PROCESS:
- Each interviewer submits scorecard within 24 hours of interview
- Debrief meeting: 30-45 min with all panel members
- Structured: each person shares score + evidence before any discussion
- No one changes their score because of group pressure — note disagreements
- Decision: Hire / No Hire / Extend process

Design the interview panel for [role].
```

### Guía de facilitación de la sesión informativa

```
Facilitate the interview debrief for [candidate] for [role].

Candidate: [Name]
Role: [Title]
Interview panel:
- [Interviewer 1] — evaluated [competency A, B]
- [Interviewer 2] — evaluated [competency C, D]
- [Interviewer 3] — evaluated [competency E, F]

Debrief structure (follow this order — do NOT allow free-form discussion to start):

RULE: Scores and evidence before opinions. No one should influence others before sharing their own assessment.

1. Go around: each interviewer shares score per competency and overall recommendation
   - "My overall is [Strong Hire / Hire / No Hire / Strong No Hire] because [1 specific piece of evidence]"
   - No commentary from others until all scores are on the table

2. Note disagreements
   - If two interviewers differ by more than 1 point on the same competency: discuss
   - "You scored data-driven decision making a 4; I scored it a 2. Let's share what we observed."
   - Goal: reach evidence-based consensus, not averaging or deferring to seniority

3. Aggregate scores
   - Average per competency across all interviewers
   - Overall average
   - Hiring bar: [your threshold — e.g., 3.0+ overall]

4. Explicit decision discussion
   - If strong consensus → move to offer or rejection
   - If split panel → the hiring manager makes the call and documents the reason
   - Never leave debrief with "let me think about it" — commit to a decision

5. If hire: What onboarding needs does this candidate have?
   - Gaps to address in 30-60-90 plan
   - Who should be their early mentor or buddy?

6. If no hire: feedback to recruiter
   - Which competency was the disqualifier?
   - Is this candidate worth keeping in pipeline for a different role?
   - Was there a sourcing/screening issue upstream?

Produce debrief summary and hiring decision.
```

## Ejemplo

**Usuario:** Estoy contratando un Director de Éxito del Cliente. Gestionará 3 CSM y tendrá a su cargo un portafolio de $4M ARR. ¿Qué tarjeta de puntuación debo usar?

**Tarjeta de puntuación de Claude:**

**Director de Éxito del Cliente — Tarjeta de Puntuación de Entrevistas**

**Competencias a evaluar:**

**1. Perspicacia comercial (propiedad de la Retención Neta de Ingresos)**
Preguntas:
- "Cuéntame sobre una ocasión en que desarrollaste una estrategia de renovación para un cliente en riesgo. ¿Cuál fue el resultado?"
- "¿Cómo equilibras la salud del cliente con los objetivos de expansión, y cómo has gestionado esa tensión?"
Sonda de seguimiento: "¿Qué harías diferente si tuvieras que gestionar esa renovación de nuevo?"
Señal fuerte: Habla específicamente del NRR como métrica, demuestra que entiende la economía de expansión, no solo "hacer felices a los clientes"
Señal de alerta: Define el éxito del CS únicamente como satisfacción/NPS sin contribución a los ingresos

**2. Gestión y desarrollo del equipo**
Preguntas:
- "Cuéntame sobre un CSM que hayas desarrollado y que tenía bajo rendimiento. ¿Qué hiciste y qué ocurrió?"
- "¿Cómo estructuras las reuniones 1:1 y te aseguras de que tu equipo se desarrolle profesionalmente, no solo alcanzando sus cifras?"
Señal fuerte: Persona específica, acción de coaching específica, resultado antes/después. Demuestra que puede diferenciar el coaching de la gestión de salida.
Señal de alerta: "Establezco expectativas claras y hago que la gente rinda cuentas" — describe resultados, no su comportamiento real de gestión.

**3. Gestión de relaciones ejecutivas**
Preguntas:
- "Cuéntame sobre un ejecutivo de un cliente que estaba insatisfecho con tu producto. ¿Cómo lo manejaste?"
- "¿Cómo consigues y mantienes patrocinadores ejecutivos comprometidos en cuentas donde tu producto se usa operativamente pero no estratégicamente?"
Señal fuerte: Lo abordó de forma proactiva, fue dueño de la relación, escaló internamente cuando fue necesario, resultado claro.
Señal de alerta: Manejó todas las escalaciones a través del patrocinador en lugar de comprometerse directamente con el ejecutivo.

**4. Operaciones de CS basadas en datos**
Preguntas:
- "Describe el modelo de puntuación de salud que construiste o mejoraste. ¿Qué señales usaste y cómo lo validaste?"
- "¿Cómo priorizas el tiempo de tu equipo en un portafolio de 50+ cuentas?"
Señal fuerte: Puede nombrar señales específicas, explicar compensaciones, describir cómo midió la precisión predictiva.
Señal de alerta: La puntuación de salud es "intuición" + frecuencia de inicio de sesión únicamente. Sin mención de validación o iteración.

**5. Influencia interfuncional (Producto e Ingeniería)**
Pregunta: "Cuéntame sobre una ocasión en que abogaste internamente por una necesidad del cliente y ganaste o perdiste. ¿Cuál fue el proceso y qué harías diferente?"
Señal fuerte: Construyó un caso de negocio con datos de ingresos, se asoció con Producto en lugar de exigir, influyó sin autoridad.
Señal de alerta: Se queja de que "Producto nunca escucha al CS". No describe su propio papel en la dinámica.

**Nivel general: promedio de 3,0+ para contratar en este nivel.**

---
