# Claude para Educadores y Creadores de Cursos

Todo lo que un docente, profesor, diseñador instruccional o creador de cursos necesita para ejecutar planificación de lecciones, desarrollo curricular, análisis de retroalimentación estudiantil, diseño de evaluaciones y creación de contenido asistidos por IA en Claude Code.

---

## Para quién es esto

Eres docente, conferencista, diseñador instruccional, profesional de aprendizaje y desarrollo, o creador independiente de cursos. Dedicas una cantidad enorme de tiempo a planificar lecciones, redactar evaluaciones, crear contenido e interpretar la retroalimentación estudiantil — trabajo que ocurre antes y después de clase, rara vez durante las horas remuneradas. Claude Code comprime el trabajo de preparación para que puedas dedicar más tiempo a lo que solo tú puedes hacer: la enseñanza real, la mentoría y la respuesta a los estudiantes en el momento.

**Antes de Claude Code:** 3 horas para planificar una lección bien estructurada desde cero. 2 horas para crear un cuestionario con preguntas de calidad. 90 minutos para interpretar 30 encuestas de retroalimentación abiertas.

**Después:** Plan de lección en 20 minutos. Cuestionario con clave de respuestas en 15 minutos. Síntesis de retroalimentación en 10 minutos.

---

## Instalación en 30 segundos

```bash
# Instalar habilidades para educadores
npx claudient add skill productivity/lesson-planner
npx claudient add skill productivity/student-feedback-analyzer
npx claudient add skill small-business/online-course-creator
npx claudient add skill small-business/newsletter-publisher
npx claudient add skill productivity/lit-review

# Instalar el agente investigador científico
npx claudient add agent roles/scientific-researcher
```

---

## Tu pila de Claude Code para educadores

### Habilidades (comandos de barra)

| Habilidad | Qué hace | Cuándo usarla |
|---|---|---|
| `/lesson-planner` | Plan de lección completo: objetivos, actividades, evaluaciones, diferenciación, materiales | Cualquier lección nueva o adaptación |
| `/student-feedback-analyzer` | Analiza resultados de encuestas y datos de evaluaciones: temas, brechas, mejoras | Después de recopilar retroalimentación, después de evaluaciones |
| `/online-course-creator` | Estructura completa del curso: módulos, rutas de aprendizaje, guiones de video, cuestionarios, texto de ventas | Construir un curso para una plataforma (Teachable, Thinkific, etc.) |
| `/newsletter-publisher` | Boletín del curso o secuencia de correos para estudiantes — contenido por goteo, participación | Construcción de comunidad, comunicación continua con estudiantes |
| `/lit-review` | Revisión de literatura e investigación para el contenido del curso — enseñanza basada en evidencia | Cursos académicos, currículo respaldado por investigación |

### Agente

| Agente | Modelo | Cuándo activarlo |
|---|---|---|
| `scientific-researcher` | Opus | Revisión profunda de literatura, desarrollo curricular basado en evidencia, investigación académica |

---

## Flujo de trabajo diario

### Antes de clase (20-30 minutos de preparación)

**1. Plan de lección — preparar una lección nueva**
```
/lesson-planner

Crea una lección sobre [tema] para [audiencia].

Duración: [X minutos]
Formato: [presencial / en línea / híbrido]
Conocimiento previo: [lo que ya saben]
Objetivos: [lo que podrán hacer después — o deja que Claude los redacte]
Restricciones clave: [tecnología disponible, tamaño de clase, necesidades de accesibilidad]

Genera el plan de lección completo con tiempos, actividades y un ticket de salida.
```

**2. Diseño de evaluación — para el cuestionario de mañana o el resumen del proyecto**
```
/lesson-planner

Diseña una evaluación para [tema de la lección].

Objetivos de aprendizaje: [lista del plan de lección]
Tipo de evaluación: [cuestionario / respuesta corta / proyecto / rúbrica de presentación]
Tiempo permitido: [X minutos / X días]
Nivel de Bloom: [recordar / aplicar / analizar / evaluar]

Genera preguntas con clave de respuestas y una rúbrica para los componentes de respuesta abierta.
```

---

### Después de clase / fin de unidad

**3. Análisis de retroalimentación — interpretar los datos de la encuesta**
```
/student-feedback-analyzer

Analiza la retroalimentación de [nombre del curso/lección].

Calificaciones cuantitativas: [pega los promedios de tu encuesta]
Respuestas abiertas (anonimizadas): [pega todas las respuestas]

¿Qué patrones hay? ¿Qué debo cambiar la próxima vez? ¿Qué funcionó?
```

**4. Informe de evaluación — lo que revelan los resultados**
```
/student-feedback-analyzer

Mi clase acaba de completar [nombre de la evaluación].

Promedio de la clase: [X]%
Distribución de puntajes: [pega]
Desglose pregunta por pregunta: [pega la tasa de aciertos por pregunta]
Objetivos evaluados: [lista]

¿Dónde están las brechas de aprendizaje? ¿Qué debo volver a enseñar? ¿Qué se dominó?
```

---

### Desarrollo de cursos (trabajo a largo plazo)

**5. Estructura del curso en línea**
```
/online-course-creator

Construye la estructura del curso sobre [tema].

Audiencia objetivo: [quiénes son, conocimiento previo]
Formato: [video autoguiado / basado en cohortes / bootcamp]
Duración: [X semanas / X horas de contenido]
Plataforma: [Teachable / Thinkific / Udemy / LMS interno]
Metas de aprendizaje: [transformación principal — ¿qué podrán hacer después?]

Genera: esquema de módulos, secuencia de lecciones, puntos de evaluación, actividades de finalización.
```

**6. Revisión de literatura para el contenido del curso**
```
/lit-review

Investiga la base de evidencia para [metodología de enseñanza / área temática].

Estoy diseñando un curso sobre [tema] y quiero asegurarme de que el currículo esté basado en evidencia.
¿Qué dice la investigación sobre [aspecto específico de tu currículo]?
¿Hay artículos clave o hallazgos de consenso que deba conocer?
```

---

### Comunidad y participación de estudiantes

**7. Secuencia de correos para estudiantes**
```
/newsletter-publisher

Escribe una secuencia de correos para los estudiantes matriculados en [nombre del curso].

Propósito de la secuencia: [incorporación / registro semanal / reactivación / celebración]
Tono: [alentador / profesional / conversacional]
Mensajes clave para [este correo o esta semana]: [describe]
Longitud: [corto — 150 palabras / completo — 300 palabras]
```

---

## Plan de 30 días (nuevos educadores o nuevo curso)

### Semana 1 — Fundamentos de planificación de lecciones
- Instala todas las habilidades para educadores: `npx claudient add skill productivity/[nombre]`
- Usa `/lesson-planner` para planificar tus próximas 3 lecciones — compara con lo que harías normalmente
- Ejecuta el escritor de objetivos de aprendizaje en cada lección — convierte metas vagas en resultados medibles
- Crea tu primer ticket de salida y úsalo en clase

### Semana 2 — Evaluación y retroalimentación
- Usa `/lesson-planner` para diseñar una evaluación — genera las preguntas y la rúbrica
- Después de la evaluación, pega los resultados en `/student-feedback-analyzer` — practica interpretar datos
- Analiza un ticket de salida — ¿qué deberías abordar al inicio de la próxima clase?

### Semana 3 — Retroalimentación y mejora
- Envía una encuesta de retroalimentación a mitad del curso (5 preguntas máximo)
- Usa `/student-feedback-analyzer` para analizar los resultados
- Realiza al menos un cambio visible basado en la retroalimentación — y díselo a los estudiantes (genera confianza y mejora las tasas de respuesta en encuestas futuras)

### Semana 4 — Desarrollo del curso
- Usa `/online-course-creator` si estás construyendo un curso, o usa `/lesson-planner` para trazar la próxima unidad
- Usa `/lit-review` para verificar que un enfoque de enseñanza principal en tu currículo esté basado en evidencia
- Registra el tiempo: ¿cuánto tiempo tarda ahora la planificación de lecciones vs. antes de Claude?

---

## Flujos de trabajo de creación de contenido

### Construir un cuestionario (de principio a fin)

```
/lesson-planner

Diseña un cuestionario para [tema de la lección/unidad].

Objetivos de aprendizaje evaluados:
1. [Objetivo]
2. [Objetivo]
3. [Objetivo]

Tipos de preguntas necesarios: [opción múltiple / respuesta corta / verdadero-falso / completar el espacio / basado en casos]
Nivel de dificultad: [introductorio / intermedio / avanzado]
Total de preguntas: [N]
Tiempo permitido: [X minutos]
Niveles de Bloom a cubrir: [recordar: X preguntas / aplicar: X preguntas / analizar: X preguntas]

Genera: el cuestionario con clave de respuestas, distractores para opción múltiple que apunten a conceptos erróneos comunes, y una rúbrica de calificación para preguntas abiertas.
```

### Construir una rúbrica

```
/lesson-planner

Diseña una rúbrica de calificación para [tipo de tarea: ensayo / proyecto / presentación / informe de laboratorio].

Objetivos de aprendizaje que evalúa: [lista]
Descripción de la tarea: [breve descripción de lo que los estudiantes entregan]
Escala de puntos: [4 puntos / porcentaje / nota con letra / basado en estándares]

Genera una rúbrica con:
- 4-5 dimensiones (criterios)
- 4 niveles de desempeño por dimensión (excelente / competente / en desarrollo / inicial)
- Descriptores conductuales claros para cada celda — sin lenguaje vago como "demuestra comprensión"
```

### Redactar puntos de conversación para presentaciones

```
Tengo una presentación sobre [tema] con estas diapositivas:

Diapositiva 1: [título y punto clave]
Diapositiva 2: [título y punto clave]
[Continúa]

Para cada diapositiva, escribe:
- 2-3 frases de puntos de conversación (qué decir, no lo que está en la diapositiva)
- Una pregunta de discusión para hacer a la clase después de esta diapositiva
- Un concepto erróneo común para abordar preventivamente
```

### Guía de facilitación de talleres

```
Escribe una guía de facilitación para un taller de [X horas] sobre [tema].

Audiencia: [quiénes son]
Meta: [qué deben poder hacer o pensar de manera diferente al salir]
Formato: [presencial / virtual / híbrido]
Tamaño del grupo: [N participantes]

Genera:
1. Trabajo previo a asignar (si aplica)
2. Instrucciones de configuración del espacio/plataforma
3. Actividad de apertura o rompehielos (conectada al tema del taller)
4. Actividades principales con notas de facilitación
5. Preguntas de discusión para cada segmento
6. Desafíos comunes de facilitación y cómo manejarlos
7. Reflexión de cierre y compromiso de acción
8. Correo posterior al taller para enviar a los participantes
```

---

## Integraciones de herramientas

### Google Classroom / Canvas / Blackboard
Claude genera planes de lección, preguntas de cuestionario, rúbricas y anuncios como texto → los pegas en tu LMS. Para preguntas de cuestionario específicamente, formatea el resultado de Claude como preguntas numeradas → importa usando la función de importación masiva de tu LMS.

### Google Forms / Microsoft Forms
Claude escribe las preguntas de tu encuesta de retroalimentación → las pegas en Forms → recopilas → exportas CSV → pegas las respuestas de vuelta en `/student-feedback-analyzer`. El ciclo completo tarda unos 15 minutos una vez recopilados los datos.

### Notion (para organización del curso)
Construye la estructura de tu curso en Notion — una página por lección. Claude genera el contenido del plan de lección → lo pegas en cada página. Usa la base de datos de Notion para rastrear qué lecciones tienen datos de ticket de salida y retroalimentación recopilada.

### Canva (para materiales visuales)
Claude escribe el contenido de diapositivas, folletos e infografías → tú diseñas en Canva. Usa Claude para escribir viñetas específicas y claras — Canva funciona mejor cuando el texto ya está bien definido.

### Zoom / Google Meet
Después de sesiones sincrónicas en línea, pega transcripciones del chat o notas de la sesión en `/meeting-to-action` para extraer puntos de discusión y preguntas sin respuesta para seguimiento.

---

## Métricas a rastrear

| Actividad | Tiempo manual | Con Claude |
|---|---|---|
| Plan de lección (tema nuevo) | 3 horas | 20-30 min |
| Cuestionario con clave de respuestas | 90 min | 15 min |
| Rúbrica de tarea | 45 min | 10 min |
| Análisis de encuesta de retroalimentación | 90 min | 15 min |
| Análisis de datos de evaluación | 60 min | 20 min |
| Guía de facilitación de taller | 3 horas | 30 min |

**Qué hacer con el tiempo ahorrado:** Más apoyo individual a estudiantes, retroalimentación más oportuna sobre el trabajo estudiantil, mayor personalización de lecciones, lectura y desarrollo profesional.

---

## Errores comunes (y cómo Claude Code los previene)

**Error 1: Objetivos de aprendizaje vagos**
`/lesson-planner` fuerza el uso de verbos de la taxonomía de Bloom — no más "entender" o "apreciar". Los objetivos se vuelven medibles.

**Error 2: Evaluaciones que examinan memorización cuando los objetivos requieren aplicación**
`/lesson-planner` mapea las preguntas de evaluación a los objetivos según el nivel de Bloom. La desalineación es visible.

**Error 3: Datos de retroalimentación que nunca generan cambios**
`/student-feedback-analyzer` concluye con recomendaciones accionables específicas. El resultado es una lista de tareas pendientes, no un informe.

**Error 4: Lecciones sin verificación de comprensión**
Cada plan de lección de `/lesson-planner` incluye un ticket de salida. Si la lección es muy corta, es una pregunta formativa integrada en la actividad.

**Error 5: Enseñar de la misma manera año tras año porque el rediseño toma demasiado tiempo**
Con Claude, una actualización de curso que antes tomaba una semana toma un día. La energía de activación para la mejora cae drásticamente.

---

## Recursos

- [Primeros pasos con Claude Code](getting-started.md)
- [Habilidad planificador de lecciones](../skills/productivity/lesson-planner.md)
- [Habilidad analizador de retroalimentación estudiantil](../skills/productivity/student-feedback-analyzer.md)
- [Habilidad creador de cursos en línea](../skills/small-business/online-course-creator.md)
- [Habilidad revisión de literatura](../skills/productivity/lit-review.md)

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
