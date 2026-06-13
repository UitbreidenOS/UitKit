# Claude para Reclutadores y Recursos Humanos

Todo lo que un Reclutador o profesional de RR.HH. necesita para gestionar pipelines de contratación potenciados por IA — desde escribir la descripción del puesto hasta estructurar entrevistas y generar cartas de oferta — sin perder el juicio humano que hace las grandes decisiones de contratación.

---

## Para quién es esto

Eres reclutador, especialista en adquisición de talento o generalista de RR.HH. responsable de cubrir puestos rápida y correctamente. Gestionas múltiples posiciones abiertas, coordinas con gerentes de contratación que tienen requisitos poco claros, y se espera que encuentres, filtres, evalúes y cierres candidatos — a menudo sin un equipo completo.

**Antes de Claude Code:** 2-3 horas para escribir una descripción del puesto completa y una tarjeta de puntuación. 1 hora para construir una búsqueda de candidatos y una secuencia de contacto. 30 minutos para documentar cada debrief de entrevista. Investigación de mercado para benchmarking de compensación realizada manualmente desde Glassdoor.

**Después:** Descripción del puesto completa en 15 minutos. Búsqueda de candidatos + mensajes de contacto en 20 minutos. Tarjeta de puntuación construida para cualquier puesto en 30 minutos. Benchmarks de compensación investigados y estructurados en 10 minutos. Pasas más tiempo en conversaciones con candidatos y menos en documentación.

---

## Instalación en 30 segundos

```bash
# Instalar el stack completo para reclutadores
npx claudient add skill productivity/interview-scorecard
npx claudient add skill productivity/comp-benchmarker
npx claudient add skill productivity/candidate-sourcer
npx claudient add skill small-business/hiring-pipeline
npx claudient add skill small-business/job-description
npx claudient add skill productivity/team-onboarding
npx claudient add agent advisors/chro-advisor
```

---

## Tu stack de Claude Code para reclutadores

### Habilidades (comandos de barra)

| Habilidad | Qué hace | Cuándo usarla |
|---|---|---|
| `/candidate-sourcer` | Cadenas de búsqueda booleana, mensajes de contacto en LinkedIn, seguimiento del pipeline | Cuando necesites buscar candidatos proactivamente |
| `/interview-scorecard` | Preguntas basadas en competencias, rúbrica de puntuación, diseño de panel, plantilla de debrief | Cada nuevo puesto — antes de la primera entrevista |
| `/comp-benchmarker` | Bandas salariales, directrices de equity, generación de carta de oferta | Antes de publicar el puesto y antes de hacer una oferta |
| `/job-description` | Definición del rol, redacción de requisitos, calibración del tono | Al abrir una nueva solicitud |
| `/hiring-pipeline` | Etapas del pipeline, SLAs, plantillas de informes | Gestión de múltiples puestos abiertos |
| `/team-onboarding` | Plan de incorporación de 30-60-90 días para nuevas contrataciones | Cuando se acepta una oferta |

### Agentes

| Agente | Modelo | Cuándo activarlo |
|---|---|---|
| `chro-advisor` | Opus | Diseño organizacional, estrategia de RR.HH., manejo de asuntos sensibles de personas |

---

## Flujo de trabajo diario

### Mañana (20-30 minutos)

**1. Revisión del pipeline — lunes por la mañana**
```
/hiring-pipeline

Revisión semanal del pipeline — semana del [FECHA].

Puestos abiertos:
| Puesto | Depto. | Etapa | Candidatos en pipeline | Fecha objetivo |
|---|---|---|---|---|
| [Título] | [Depto.] | [Búsqueda / Filtro / Entrevistas / Oferta] | [N] | [fecha] |
| [Título] | [Depto.] | [etapa] | [N] | [fecha] |

Para cada puesto:
- ¿Cuál es el cuello de botella? (no hay suficientes candidatos / los candidatos no avanzan / las ofertas se rechazan)
- ¿Qué acciones están pendientes esta semana?
- ¿Algún puesto en riesgo de no cumplir su fecha objetivo?

Dame una lista de acciones priorizadas para esta semana.
```

**2. Contacto con candidatos — dos veces por semana en lotes**
```
/candidate-sourcer

Estoy buscando candidatos para [Puesto] en [Ubicación].

Calificaciones indispensables:
- [Calificación 1]
- [Calificación 2]

Empresas objetivo: [lista 5-8 empresas donde encontraría este perfil]

Construye:
1. Cadena de búsqueda booleana para LinkedIn Recruiter
2. Variante de búsqueda X-Ray en Google
3. Plantilla de mensaje de contacto (primera línea personalizada + gancho del puesto + CTA)
4. Mensaje de seguimiento (para los que no responden después de 7 días)

Estoy enviando 20 mensajes esta semana — ayúdame a estructurar el contacto.
```

---

### Preparación de entrevistas

**3. Construir tarjeta de puntuación para un nuevo puesto**
```
/interview-scorecard

Construye una tarjeta de puntuación de entrevista para [Puesto].

Nivel: [IC Senior / Gerente / Director]
Departamento: [Depto.]
Responsabilidades clave:
- [Responsabilidad 1]
- [Responsabilidad 2]
- [Responsabilidad 3]

Competencias indispensables:
- [Competencia 1]
- [Competencia 2]
- [Competencia 3]

Descalificadores:
- [Cualquier cosa que descalifique]

Construye: 4-5 competencias con 2-3 preguntas cada una, rúbrica de puntuación (1-4),
diseño del panel de entrevista (quién entrevista qué competencia),
y plantilla de debrief para el gerente de contratación.
```

**4. Preparación específica del candidato (antes de una entrevista de panel)**
```
/interview-scorecard

Mañana entrevisto a [Nombre del Candidato] para [Puesto].

Su perfil: [describir — puesto actual, empresa, experiencia relevante de LinkedIn o CV]
La competencia que estoy evaluando: [qué competencia me asignaron]
Lo que sé sobre sus fortalezas: [lo que destaca de su CV/filtro]
Lo que me genera incertidumbre: [las brechas o cosas que quiero explorar]

Dame:
- 3 preguntas adaptadas para este candidato (no genéricas — referencia su perfil)
- Cómo se ven respuestas fuertes vs. débiles para cada pregunta
- Sondeos de seguimiento si dan una respuesta de alto nivel
- Lo que debería señalar para el debrief
```

---

### Gestión de ofertas

**5. Investigación de compensación y construcción de oferta**
```
/comp-benchmarker

Construye una oferta de compensación para [Puesto] en [Empresa].

Puesto: [Título]
Nivel: [IC Senior / Gerente]
Ubicación: [Ciudad, País]
Etapa de la empresa: [Serie A / B / pública / empresarial]

Nuestra banda actual para este puesto: $[X] - $[Y] base
Compensación actual del candidato: $[X] base, $[X] bono, $[X] equity
Oferta competidora (si se conoce): $[X] en [Empresa]

Construye:
1. Benchmark del mercado para este puesto y ubicación (¿dónde cae nuestra banda?)
2. Oferta recomendada dentro de nuestra banda con justificación
3. Paquete de equity (opciones o RSUs según nuestra etapa)
4. Resumen completo del paquete de oferta
5. Guión para la llamada verbal de oferta
6. Respuestas a objeciones si contraoferten
```

**6. Carta de oferta**
```
/comp-benchmarker

Genera una carta de oferta para [Nombre Completo del Candidato] para el puesto de [Puesto].

Empresa: [Nombre]
Fecha de inicio: [fecha]
Salario base: $[X]
Bono: [X% del base, pagado anualmente]
Equity: [X acciones, 4 años de adquisición, 1 año de cliff]
Beneficios: [describir]
Ubicación: [ciudad o remoto]
Reporta a: [Nombre del Gerente, Título]
La oferta vence: [fecha — dar 5-7 días hábiles]

Genera una carta de oferta profesional con todos los componentes claramente indicados.
Incluye nota de que el equity está sujeto a aprobación del directorio.
```

---

### Traspaso de incorporación

**7. Plan de incorporación para nueva contratación**
```
/team-onboarding

Construye un plan de incorporación de 30-60-90 días para [Nombre del Nuevo Empleado] que se une como [Puesto].

Fecha de inicio: [fecha]
Gerente: [nombre]
Equipo: [describir el equipo al que se une]
Partes interesadas clave a reunirse en los primeros 30 días: [lista]
Objetivos principales para los primeros 90 días: [¿cómo se ve el éxito?]
Herramientas y sistemas a configurar: [lista]
Contexto específico del rol: [matices, proyectos actuales, desafíos que hereda]

Produce: plan estructurado de 30-60-90 días con hitos semanales, calendario de reuniones con partes interesadas,
y criterios de éxito para cada fase.
```

---

## Plan de incorporación de 30 días (nuevos reclutadores o generalistas de RR.HH.)

### Semana 1 — Requisitos del puesto y diseño del proceso
- Instala todas las habilidades mediante los comandos de instalación anteriores
- Para cada puesto abierto: ejecuta `/interview-scorecard` para documentar qué estás contratando antes de tocar ningún candidato
- Ejecuta `/comp-benchmarker` para cada puesto abierto — conoce tu banda antes de buscar o filtrar
- Audita tu pipeline actual: ¿qué puestos están estancados y por qué?

### Semana 2 — Búsqueda activa
- Ejecuta `/candidate-sourcer` para tus 2 puestos abiertos principales — construye cadenas de búsqueda y secuencias de contacto
- Envía 20+ mensajes de contacto por puesto esta semana
- Usa `/job-description` para auditar o reescribir cualquier descripción de puesto que lleve más de 30 días publicada sin candidatos de calidad
- Establece tu tasa de conversión de búsqueda a filtro como línea base

### Semana 3 — Proceso de entrevistas
- Ejecuta cada entrevista programada usando la tarjeta de puntuación de la semana 1
- Ejecuta el debrief usando el proceso estructurado de debrief — no discusión abierta
- Rastrea: ¿dónde se están rechazando las ofertas? ¿Compensación, claridad del rol o duración del proceso?
- Comparte una mejora del proceso de búsqueda y puntuación con el gerente de contratación

### Semana 4 — Oferta e informes
- Haz tu primera oferta usando datos de `/comp-benchmarker` — defiende el número con investigación de mercado
- Ejecuta la revisión semanal del pipeline y comparte métricas con el liderazgo
- Construye tu primer informe mensual de reclutamiento: tiempo para cubrir por puesto, calidad de la fuente, tasa de aceptación de ofertas
- Identifica: ¿cuál es el cuello de botella #1 en tu proceso de contratación ahora mismo?

---

## Integraciones de herramientas

### LinkedIn Recruiter

Usa `/candidate-sourcer` para generar cadenas booleanas → ejecuta en LinkedIn Recruiter. Exporta perfiles → construye tu lista de contacto en Recruiter → usa plantillas generadas por Claude para InMail.

### Greenhouse / Lever / Ashby (ATS)

Exporta datos del pipeline de candidatos como CSV → pega en Claude para análisis. Claude funciona con cualquier salida de ATS. Usa Claude para:
- Escribir comentarios estructurados de entrevistas que van al ATS
- Generar texto de carta de oferta para pegar en DocuSign
- Analizar la deserción del pipeline por etapa

### HubSpot o Notion para seguimiento del pipeline

Si no tienes un ATS formal, usa la estructura del seguidor de pipeline de `/candidate-sourcer` en Notion o una hoja de cálculo. Claude puede leer tus datos del pipeline y generar informes de estado semanales.

### Levels.fyi / Glassdoor (investigación de compensación)

Claude usa tus datos de mercado pegados de estas fuentes para calibrar las recomendaciones en `/comp-benchmarker`. Extrae los datos relevantes, pégalos y Claude los analiza en el contexto de tu puesto y etapa de la empresa.

---

## Métricas a rastrear

| Métrica | Definición | Verde | Amarillo | Rojo |
|---|---|---|---|---|
| Tiempo para cubrir | Días desde que se abre la solicitud hasta que se acepta la oferta | < 30 días | 30-60 días | > 60 días |
| Tasa de aceptación de ofertas | % de ofertas extendidas que se aceptan | > 85% | 70-85% | < 70% |
| Tasa de respuesta a la búsqueda | % de mensajes de contacto que obtienen respuesta | > 20% | 10-20% | < 10% |
| Conversión del embudo (buscado → contratado) | % de perfiles buscados que se convierten en contrataciones | > 3% | 1-3% | < 1% |
| Ratio de entrevista a oferta | # de entrevistas por contratación | < 5:1 | 5-8:1 | > 8:1 |
| Retención de nuevas contrataciones a los 90 días | % de contrataciones que siguen empleadas a los 90 días | > 90% | 80-90% | < 80% |
| Satisfacción del gerente de contratación | Evaluado por gerentes de contratación post-contratación | > 4/5 | 3-4/5 | < 3/5 |

---

## Errores comunes de reclutamiento (y cómo Claude Code ayuda a evitarlos)

**Error 1: Comenzar a buscar antes de saber para qué contratas**
`/interview-scorecard` fuerza la definición de competencias antes de cualquier contacto. Si no puedes escribir la tarjeta de puntuación, aún no sabes para qué contratas.

**Error 2: Mensajes de InMail genéricos**
`/candidate-sourcer` produce plantillas que requieren una primera línea personalizada. Sin gancho personal = no envíes.

**Error 3: Sorpresas de compensación en la etapa de oferta**
`/comp-benchmarker` construye la banda antes de empezar a filtrar. Los candidatos cuyas expectativas no coincidan con tu rango deben ser descalificados en la primera llamada, no en la oferta.

**Error 4: Debrief por consenso (efecto HiPPO)**
La estructura de debrief en `/interview-scorecard` requiere que cada entrevistador comparta puntuaciones antes de la discusión abierta. Esto evita que la persona más senior de la sala ancle la opinión de todos.

**Error 5: Sin plan de incorporación listo el Día 1**
`/team-onboarding` genera el plan de 30-60-90 días antes de que el candidato empiece — no la semana que llega. Una mala primera semana es una señal evitable de abandono temprano.

---

## Recursos

- [Primeros pasos con Claude Code](./getting-started.md)
- [Habilidad de tarjeta de puntuación de entrevista](../skills/productivity/interview-scorecard.md)
- [Habilidad de benchmark de compensación](../skills/productivity/comp-benchmarker.md)
- [Habilidad de búsqueda de candidatos](../skills/productivity/candidate-sourcer.md)
- [Flujo de trabajo del pipeline de reclutamiento](../workflows/recruiting-pipeline.md)
- [Habilidad de incorporación de equipo](../skills/productivity/team-onboarding.md)

---
