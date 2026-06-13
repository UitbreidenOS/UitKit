---
name: ux-researcher
description: "Investigación de UX: generación de personas de usuario, mapeo de viajes, planificación de pruebas de usabilidad, síntesis de investigación — traduce datos de usuario en decisiones de diseño y producto accionables"
---

# Habilidad de Investigador UX

## Cuándo activar
- Creación de personas de usuario respaldadas por datos a partir de investigación o análisis
- Construcción de un mapa de viaje del cliente para identificar brechas de experiencia
- Planificación de una prueba de usabilidad (script, tareas, métricas, tamaño de muestra)
- Síntesis de hallazgos de entrevistas de usuario o encuestas en temas
- Generación de un mapa de empatía o marco de necesidades del usuario

## Cuándo NO usar
- Decisiones de hoja de ruta del producto — use la habilidad product-discovery
- Diseño de prueba A/B — use la habilidad experiment-designer
- Análisis cuantitativo (análisis de embudo, retención) — use la habilidad product-analytics
- Persona de marketing para dirigirse — objetivo diferente de la persona de UX

## Instrucciones

### Generación de personas de usuario

```
Genere una persona de usuario a partir de [fuente de datos].

Fuente de datos: [entrevistas de usuario / resultados de encuesta / análisis / entradas de soporte / todas]
Producto: [describir]
Segmento a modelar: [describir el tipo de usuario — p. ej., « usuarios avanzados que usan la función principal diariamente »]

Estructura de persona:

NOMBRE DE PERSONA: [nombre de arquetipo — descriptivo, no un nombre real]
Tagline: [una oración que captura su frustración u objetivo principal]

DEMOGRAFÍA (mantenerse amplio, evitar estereotipos):
Rol: [título del trabajo / función]
Tamaño de la empresa: [PYME / mercado intermedio / empresa]
Competencia técnica: [baja / moderada / alta] en [dominio relevante]

OBJETIVOS (lo que intentan lograr):
Objetivo principal: [el trabajo principal que intentan hacer]
Objetivo secundario: [objetivo de apoyo]
El éxito se ve como: [resultado observable que les importa]

FRUSTRACIONES (frustración actual con soluciones existentes):
1. [Frustración específica con prueba — cita de entrevista o estadística de datos]
2. [Frustración específica]
3. [Frustración específica]

PATRONES DE COMPORTAMIENTO:
Cómo descubren herramientas: [boca a boca / búsqueda / mandato del gerente / etc.]
Cómo evalúan: [intento primero / revisión de pares / demostración / proceso de adquisición]
Cómo utilizan el producto: [diariamente / semanalmente / episódico / en un equipo / en solitario]

CITA (voz representativa):
"[Cita literal o parafraseada que captura su visión del mundo]"

QUÉ NECESITAN DE NOSOTROS:
- [Necesidad específica 1]
- [Necesidad específica 2]
- [Necesidad específica 3]

NO INCLUYA: descripción de foto de stock, historia ficticia, demografía irrelevante (café favorito)
INCLUYA: solo lo que impulsa decisiones del producto

Genere la persona para [segmento] a partir de los datos que proporciona.
```

### Mapa de viaje

```
Cree un mapa de viaje del cliente para [experiencia].

Experiencia: [describa la experiencia de extremo a extremo — p. ej., « configuración por primera vez hasta el primer momento de valor »]
Persona de usuario: [qué persona representa este mapa]
Puntos de contacto a cubrir: [canales — correo electrónico, producto, soporte, sitio web]

Formato de mapa de viaje:

FASES: [enumere las fases de alto nivel — p. ej., Conciencia → Consideración → Incorporación → Activación → Uso habitual]

Para cada fase:

NOMBRE DE FASE: [etiqueta]
Disparador de entrada: [qué mueve al usuario a esta fase?]
Duración: [tiempo típico pasado en esta fase]

Acciones del usuario:
- [Lo que hacen]
- [Lo que hacen]

Puntos de contacto:
- [Dónde interactúan con su producto/marca]

Pensamientos (en qué están pensando):
- "[Monólogo interior en este momento]"

Sentimientos: [Frustrado / Curioso / Confiado / Ansioso / Encantado] — con puntuación de sentimiento 1-5

Puntos débiles:
- 🔴 [Dolor crítico — bloquea el progreso]
- 🟡 [Fricción notable — ralentiza]

Oportunidades:
- [Mejora de diseño o producto que aborda el dolor]

CURVA DE EXPERIENCIA GENERAL:
Trazar sentimiento (1 = muy negativo, 5 = muy positivo) para cada fase:
[Fase 1]: X/5 → [Fase 2]: X/5 → [Fase 3]: X/5 → ...

El punto más bajo del viaje = la oportunidad de diseño de mayor prioridad.

Genere el mapa de viaje para mi experiencia y persona.
```

### Plan de prueba de usabilidad

```
Planifique una prueba de usabilidad para [producto/función].

Qué probar: [flujo específico, función o diseño]
Tipo de usuario: [a quién reclutar]
Formato de prueba: [moderado remoto / moderado en persona / no moderado]
Número de participantes: [típicamente 5-8 para cualitativo; 20+ para cuantitativo]
Preguntas clave: [qué quiere aprender?]

Plan de prueba:

OBJETIVO:
[¿Qué pregunta específica responderá esta prueba?]
Criterios de éxito: [¿cómo sabrá que la prueba fue útil?]

CRITERIOS DE PARTICIPANTE:
Preguntas de selección: [3-5 preguntas para calificar participantes]
Debe tener: [requisito 1] + [requisito 2]
No debe tener: [criterios de exclusión]
Incentivo: [$X tarjeta de regalo / crédito de producto gratis / otro]

DISEÑO DE TAREA (5-7 tareas por sesión):
Las tareas deben ser:
- Basadas en escenarios (« quiere hacer X... ») no instructivas (« haga clic en Y »)
- Observable — ¿puede decir si tuvieron éxito?
- Representativo de objetivos de usuario reales

Tarea 1: [escenario]
Criterios de finalización: [¿cómo se ve el éxito?]
Límite de tiempo: [X minutos]

Tarea 2: [escenario]
Criterios de finalización: [...]

MÉTRICAS:
Cuantitativo:
- Tasa de finalización de tarea: % que completan cada tarea sin asistencia
- Tiempo por tarea: segundos mediano por tarea
- Tasa de error: errores por tarea
- Puntuación SUS (Escala de Usabilidad del Sistema): 0-100 compuesto

Cualitativo:
- Observaciones en voz alta: ¿qué dicen los usuarios mientras navegan?
- Puntos de confusión: ¿dónde se detienen, retroceden o hacen preguntas?
- Señales emocionales: ¿dónde expresan frustración o alegría?

GUÍA DE SESIÓN:
Introducción (5 min): explique el pensamiento en voz alta, no hay respuestas correctas o incorrectas
Tareas (30-40 min): presente cada tarea, observe y tome notas
Debriefing (10 min): preguntas abiertas sobre la experiencia general

MARCO DE ANÁLISIS:
Después de [N] sesiones:
- Mapa de afinidad: agrupe observaciones por tema
- Clasificación de gravedad: Crítico (bloquea la finalización) / Mayor (frustra) / Menor (cosmético)
- Frecuencia: ¿cuántos participantes encontraron este problema?
- Puntuación de prioridad: Gravedad × Frecuencia

Genere el plan de prueba para mi tipo de función y usuario específico.
```

### Síntesis de investigación

```
Sintetice los hallazgos de la investigación del usuario de [fuente].

Tipo de investigación: [entrevistas de usuario / prueba de usabilidad / encuesta / entradas de soporte / todas]
Número de sesiones/respuestas: [X]
Hallazgos brutos: [pegue observaciones, citas o temas clave]

Marco de síntesis:

Paso 1 — Agrupación de observaciones (mapeo de afinidad):
Agrupe observaciones individuales en temas.
No agrupe por pregunta de investigación — agrupe por lo que los usuarios realmente dijeron e hicieron.
Buen tema: "Los usuarios no encontraron la funcionalidad de filtro" (específico, observable)
Mal tema: "Problemas de navegación" (demasiado vago)

Paso 2 — Priorización de temas:
Para cada tema:
| Tema | Frecuencia (X de N participantes) | Gravedad | Prueba |
|---|---|---|---|
| [Tema 1] | [X/N] | Crítico / Mayor / Menor | [cita u observación] |

Paso 3 — Generación de insights:
Insight = tema + implicación (no solo « los usuarios hicieron X » sino « los usuarios hicieron X, lo que significa que necesitamos Y »)

Formato: "Cuando [contexto], los usuarios [comportamiento]. Esto sugiere [implicación de producto/diseño]."

Ejemplo: "Cuando los usuarios llegan al panel por primera vez, buscan una barra de búsqueda antes de notar el panel de filtros en la barra lateral. Esto sugiere que el mecanismo de descubrimiento principal debe moverse a un lugar más destacado o que la búsqueda debe agregarse como modo de navegación principal."

Paso 4 — Recomendaciones (ordenadas por impacto):
🔴 P1 — Crítico (reparar antes de lanzar): [recomendación específica + prueba]
🟡 P2 — Importante (reparar pronto): [recomendación específica + prueba]
🟢 P3 — Bueno tener: [recomendación específica]

Paso 5 — Lo que aún no sabemos:
[Preguntas que esta investigación no pudo responder — diseñe la próxima investigación para responder estas preguntas]

Sintetice mis hallazgos de investigación en insights y recomendaciones priorizadas.
```

## Ejemplo

**Usuario:** Hicimos 6 entrevistas de usuario sobre nuestra herramienta de gestión de proyectos. Hallazgos principales: a los usuarios les encanta la vista de cronología pero no pueden descubrir cómo agregar dependencias entre tareas. Tres usuarios se rindieron y dijeron « Solo usaré Notion ». ¿Cómo convierto esto en acción?

**Síntesis de Claude:**

**Insight clave:**
"Cuando los usuarios quieren conectar tareas relacionadas, no pueden encontrar la interfaz de usuario de creación de dependencia sin asistencia. Esta no es una brecha de características — la característica existe — es un problema de capacidad de descubrimiento y diseño de interacción."

Prueba: 3/6 usuarios se rindieron; los 6 mencionaron la cronología como la parte más fuerte de la herramienta. Nadie sugirió que necesitara una característica diferente — necesitaba que la característica existente fuera descubrible.

**Implicaciones:**

🔴 P1 — La experiencia de usuario de creación de dependencia es defectuosa (arregle antes del crecimiento):
El punto de entrada para agregar dependencias es invisible. Los usuarios buscan una interacción de arrastre-conexión (como Miro/Linear) o un menú contextual de clic derecho. Si su flujo actual requiere un panel de configuración o un botón agregar-enlace distinto, eso es la falta de coincidencia.

Recomendación: En la vista de cronología, agregue una asequibilidad visual al pasar el ratón sobre una tarea (un mango de conector o un botón "agregar dependencia" al pasar). Considere un menú contextual de clic derecho con "Agregar dependencia a..."

🟡 P2 — Estado vacío / incorporación de dependencias:
Si los usuarios llegan a la cronología sin dependencias establecidas, no hay pista de que la característica existe. Agregue una información sobre herramientas o aviso de estado vacío: "Conecte tareas arrastrando de una a otra" con una animación de demostración de 3 segundos.

🟢 P3 — Documentación de ayuda:
"Dependencias de tarea" está enterrado en los documentos. Muévalo a una guía "Comenzar con cronologías" que aparece contextualmente cuando un usuario abre la cronología por primera vez.

**Esta investigación no respondió:**
- ¿Desean los usuarios que las dependencias se cascade automáticamente (si A se retrasa, ¿B se desplaza)?
- ¿Hay usuarios avanzados que hayan encontrado y utilizado dependencias hoy? ¿Qué los hizo descubribles para ellos?

Ejecute una sesión de seguimiento de 15 minutos con 3 usuarios: muéstreles dónde está la característica de dependencia, pídales que la usen, observe — ¿es clara la interacción en sí una vez encontrada?

---
