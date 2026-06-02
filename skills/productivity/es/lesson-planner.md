---
name: lesson-planner
description: "Constructor de planes de lección: objetivos de aprendizaje, esquema de contenido, actividades, evaluaciones, lista de materiales y estrategias de diferenciación — para educación K-12, educación superior y formación corporativa"
---

# Habilidad de Planificador de Lecciones

## Cuándo activar
- Al planificar una lección, unidad o módulo desde cero
- Al adaptar una lección existente para una audiencia, nivel o formato diferente
- Al diseñar actividades interactivas que vayan más allá de la conferencia magistral
- Al redactar objetivos de aprendizaje claros y medibles (no metas vagas)
- Al planificar evaluaciones que realmente pongan a prueba lo que enseñaste
- Al diferenciar la instrucción para aulas o cohortes de habilidades mixtas

## Cuándo NO usar
- Diseño curricular completo que abarque un semestre o año — usa la habilidad `/online-course-creator` para eso
- Redactar el contenido real de la lección (diapositivas, folletos, lecturas) — esta habilidad planifica la lección, no crea todo el contenido
- Diseño de rúbricas de evaluación a escala — usa esto como punto de partida, luego refina con experiencia en el dominio

## Instrucciones

### Prompt de plan de lección completo

```
Build a lesson plan.

LESSON CONTEXT:
- Subject/Topic: [e.g., "Introduction to Linear Equations" / "Persuasive Writing" / "Python Loops" / "Project Management Fundamentals"]
- Course or program: [the broader course this lesson belongs to]
- Audience: [who are the learners — grade level / professional background / prior knowledge]
- Format: [in-person / online synchronous / asynchronous / blended]
- Duration: [X minutes / X hours]
- Class size: [N students]

PRIOR KNOWLEDGE:
What learners already know coming into this lesson: [describe]
What they've struggled with in prior sessions: [describe or "not applicable"]

LEARNING OBJECTIVES (what learners will be able to do after this lesson):
[If you have objectives, list them. If not, let Claude draft them based on the topic.]
After completing this lesson, students will be able to:
1. [Objective — use a Bloom's taxonomy verb: identify, analyze, construct, evaluate, etc.]
2. [Objective]
3. [Objective]

KEY CONCEPTS TO COVER:
[List the main ideas, terms, or skills this lesson must address]

TEACHING CONSTRAINTS:
- Technology available: [projector only / student devices / no tech / video platform]
- Materials: [whiteboard / printed handouts / shared doc / LMS]
- Accessibility considerations: [English language learners / reading levels / physical access]

LESSON STYLE PREFERENCE:
[Lecture-heavy / discussion-based / activity-heavy / flipped / Socratic / project-based]

Generate a complete lesson plan with:
1. Learning objectives (SMART format)
2. Materials and preparation checklist
3. Lesson structure with timing
4. Activity descriptions (with facilitation notes)
5. Assessment (how you'll know they learned it)
6. Differentiation strategies (for advanced and struggling learners)
7. Closure and homework (if applicable)
```

---

### Redactor de objetivos de aprendizaje

La base de cualquier lección. Úsalo de forma independiente:

```
Write learning objectives for a lesson on [topic].

AUDIENCE: [learners — who are they, what do they know]
COURSE CONTEXT: [where does this fit in the curriculum]
TIME AVAILABLE: [X minutes — objectives must be achievable in this time]

BLOOMS TAXONOMY LEVEL TARGET:
[Select the cognitive level appropriate for this lesson]
- Remember: recall facts, terms, definitions
- Understand: explain, summarize, classify
- Apply: use knowledge in a new situation, solve problems
- Analyze: break down, compare, differentiate
- Evaluate: judge, critique, justify
- Create: design, construct, develop

Draft 3 learning objectives. Each must be:
- Specific: exactly what the learner will do
- Measurable: you can observe or test it
- Achievable: possible in the time available
- Relevant: connected to the course/curriculum
- Time-bound: achievable within this lesson

Format: "By the end of this lesson, students will be able to [Bloom's verb] [specific content] [condition or criterion if applicable]."

Example: "By the end of this lesson, students will be able to construct a valid logical argument using evidence from two primary sources."
```

---

### Marco de diseño de actividades

```
Design learning activities for a lesson on [topic].

LEARNING OBJECTIVE TO ACHIEVE: [the objective this activity must deliver]
DURATION AVAILABLE: [X minutes for the activity]
AUDIENCE: [learners — background, level, preferences]
CLASS SIZE: [N]
FORMAT: [in-person / online / hybrid]

ACTIVITY TYPES TO CONSIDER:
[ ] Think-pair-share: individual reflection → pair discussion → class share
[ ] Jigsaw: groups become experts → regroup to teach each other
[ ] Case study: apply concepts to a real-world scenario
[ ] Role play or simulation: live the concept
[ ] Gallery walk: physical or digital stations with content/questions
[ ] Problem-based learning: tackle a real problem using the lesson content
[ ] Debate or structured controversy: argue both sides
[ ] Formative quiz: low-stakes check for understanding

For each activity you design:
1. Name and format
2. Step-by-step facilitation instructions (what the instructor does, minute by minute)
3. What learners do (instructions you'd give them)
4. Time breakdown
5. Materials needed
6. How to debrief it (what to discuss after the activity)
7. How to assess what they learned from it
```

---

### Diseño de evaluaciones

```
Design assessments for a lesson on [topic].

LEARNING OBJECTIVES: [list the objectives from the lesson]
ASSESSMENT PURPOSE: [formative (during learning) / summative (after learning) / both]
TIME AVAILABLE FOR ASSESSMENT: [X minutes within the lesson / homework / exam]

ASSESSMENT OPTIONS (generate appropriate ones for these objectives):

FORMATIVE (checking understanding during the lesson):
- Exit ticket: 1-3 questions answered on paper or digital form at lesson end
- Muddiest point: "What's still unclear?" — learner writes it, teacher collects
- Thumbs check: visual comprehension check during key moments
- Cold call with think time: pose a question → 30 seconds to think → random call
- Quick write: 2 minutes to explain the concept in their own words

SUMMATIVE (measuring learning after):
- Short answer questions (3-5 questions)
- Application problem (apply the concept to a new scenario)
- Reflection prompt (evaluate, justify, or synthesize)
- Product or demonstration (create something that shows learning)

Generate:
1. An exit ticket for this lesson (3 questions: one recall, one application, one metacognition)
2. A summative assessment option (matched to the highest Bloom's level objective)
3. A rubric or success criteria for the summative (what "excellent" looks like)
```

---

### Estrategias de diferenciación

```
Generate differentiation strategies for this lesson.

LESSON TOPIC: [topic]
LEARNING OBJECTIVES: [list]
MIXED ABILITY CONTEXT: [describe your classroom — what range of levels, any specific needs]

Generate three differentiation layers:

SCAFFOLDING (support for struggling learners):
- Pre-teach: [what vocabulary or concepts to introduce before the main lesson]
- Reduced complexity: [how to simplify the task without reducing the objective]
- Visual supports: [graphic organizers, sentence frames, diagrams]
- Partnering strategy: [pair with a stronger peer, strategic grouping]
- Extended time: [which activities can flex on time]

CORE (on-grade / on-level — the standard lesson):
[Describe the baseline lesson for the majority of learners]

EXTENSION (challenge for advanced learners):
- Deeper application: [a harder version of the core task]
- Synthesis: [connect this lesson to a bigger concept or question]
- Independent project: [open-ended extension that doesn't require teacher time]
- Peer teaching: [have them explain it to another learner — deepens their understanding]

ENGLISH LANGUAGE LEARNER SUPPORTS (if applicable):
- Key vocabulary with visual support
- Simplified written instructions alongside standard
- Sentence frames for discussion
- Allow home language brainstorming
```

---

### Visión general de la unidad (múltiples lecciones)

Para planificar una secuencia de lecciones:

```
Build a unit plan for [unit topic].

UNIT CONTEXT:
- Subject: [subject area]
- Audience: [grade / level / professional background]
- Duration: [X weeks / X sessions of X minutes]
- Big question or enduring understanding: [what should learners understand long after this unit ends?]

UNIT LEARNING GOALS:
By the end of this unit, learners will be able to:
[3-5 goals — higher-level than individual lesson objectives]

ASSESSMENT OF THE UNIT:
- Summative assessment (how you'll know they learned it): [project / exam / portfolio / presentation]
- Formative checkpoints (mid-unit): [describe how you'll gauge progress]

LESSONS IN THE UNIT:
Generate a lesson sequence with:
- Lesson #, title, and 1-sentence objective
- How each lesson builds on the prior
- Key activity type per lesson
- Which lessons are assessment checkpoints

PACING GUIDE:
[If there are specific dates or calendar constraints, note them]
```

---

### Formato de salida del plan de lección

```markdown
# Lesson Plan: [Lesson Title]
**Course:** [Course name] | **Grade/Level:** [Level] | **Duration:** [X min]
**Date:** [Date] | **Instructor:** [Name]

---

## Learning Objectives
By the end of this lesson, students will be able to:
1. [Objective — specific and measurable]
2. [Objective]
3. [Objective]

---

## Materials and Preparation
- [Material 1 — digital or physical]
- [Material 2]
- Prep: [anything the instructor must do before class]

---

## Lesson Structure

| Time | Phase | Activity | Instructor Role | Student Role |
|---|---|---|---|---|
| 0:00–0:05 | Warm-up | [Activating prior knowledge or hook] | [Facilitate] | [Do] |
| 0:05–0:15 | Direct instruction | [Core concept delivery] | [Present/model] | [Note/engage] |
| 0:15–0:35 | Guided practice | [Structured activity with support] | [Facilitate] | [Practice] |
| 0:35–0:50 | Independent/group practice | [Application activity] | [Circulate/support] | [Apply] |
| 0:50–0:55 | Assessment | [Exit ticket or formative check] | [Collect] | [Demonstrate] |
| 0:55–1:00 | Closure | [Summary, preview, bridge] | [Wrap up] | [Reflect] |

---

## Activity Details

### [Activity Name]
**Duration:** [X min]
**Setup:** [how to configure the room or online space]
**Instructions for learners:** [what you say/show to them]
**Facilitation notes:** [what to watch for, common misconceptions, how to debrief]

---

## Assessment

### Formative (in-class)
[Description of how you'll check understanding during the lesson]

### Exit Ticket
1. [Recall question]
2. [Application question]
3. [Metacognition: "What's still unclear?"]

---

## Differentiation

**For learners who need support:**
[Scaffolding strategies]

**For advanced learners:**
[Extension activities]

---

## Homework / Next Steps
[Optional — what extends the learning beyond today]
```

## Ejemplo

**Usuario:** Lección sobre "Introducción a la Economía Unitaria" para una cohorte de 25 fundadores de startups en etapa temprana. Sesión de 90 minutos, presencial. Entienden los ingresos y los costes conceptualmente, pero nunca han calculado CAC, LTV ni el período de recuperación. Mi objetivo: que al terminar sean capaces de calcular e interpretar estas tres métricas para sus propias empresas.

**Resultado esperado:** Tres objetivos de aprendizaje usando verbos de Bloom al nivel de aplicación/cálculo. Estructura de la lección: 10 minutos de enganche (por qué la economía unitaria hundió empresas que conoces), 20 minutos de instrucción directa sobre CAC/LTV/recuperación con fórmulas, 30 minutos de taller donde cada fundador calcula sus propias métricas usando una plantilla proporcionada, 15 minutos de intercambio por parejas y debate ("¿qué descubriste sobre tu propio negocio?"), 10 minutos de ticket de salida (calcular un escenario dado + responder "¿qué te dice esto sobre la salud del negocio?"). Extensión para fundadores cuyos números ya se ven sólidos: calcular análisis de sensibilidad — ¿qué pasa con el LTV/CAC si la deserción cae un 10%?

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
