# Claude para Diseñadores e Investigadores de UX

Todo lo que un Diseñador o Investigador de UX necesita para ejecutar síntesis de investigación, análisis de usabilidad, creación de personas y crítica de diseño aumentados por IA en Claude Code.

---

## Para quién es esta guía

Eres un diseñador de UX, investigador de UX o diseñador de producto cuyo trabajo abarca síntesis de investigación de usuarios, pruebas de usabilidad, creación de personas, mapeo de recorridos, críticas de diseño, revisiones de accesibilidad y comunicación con partes interesadas. Pasas demasiado tiempo formateando hallazgos de investigación, escribiendo informes que nadie lee y recreando personas desde cero. Claude Code elimina esa sobrecarga para que puedas dedicar tiempo a lo que realmente requiere juicio humano: hablar con los usuarios, tomar decisiones de diseño e influir en el producto.

**Antes de Claude Code:** 3-4 horas para escribir un informe de usabilidad. 2 horas para crear una persona a partir de notas de entrevistas. Medio día para producir una auditoría de UX para la entrega de una función.

**Después:** Informe de usabilidad completo en 30 minutos. Persona en 10 minutos a partir de notas sin procesar. Auditoría de UX en 45 minutos, priorizada por gravedad y esfuerzo.

---

## Instalación en 30 segundos

```bash
# Instalar todas las habilidades de Diseñador de UX
npx claudient add skills product

# O seleccionar lo que necesitas:
npx claudient add skill product/ux-researcher
npx claudient add skill product/usability-report
npx claudient add skill product/persona-builder
npx claudient add skill product/ux-audit
npx claudient add skill product/product-discovery
npx claudient add skill product/experiment-designer
npx claudient add agents roles/hypothesis-tester
```

---

## Tu stack de UX con Claude Code

### Habilidades (comandos slash)

| Habilidad | Qué hace | Cuándo usarla |
|---|---|---|
| `/ux-researcher` | Personas de usuario, mapas de recorrido, planes de prueba de usabilidad, síntesis de investigación | Trabajo de investigación central |
| `/usability-report` | Informe completo de usabilidad: resúmenes de sesiones, calificaciones de gravedad, recomendaciones | Después de cada ronda de pruebas de usabilidad |
| `/persona-builder` | Personas de usuario respaldadas por datos: objetivos, frustraciones, comportamientos, citas | Después de la síntesis de investigación |
| `/ux-audit` | Evaluación heurística según las 10 heurísticas de Nielsen, hallazgos priorizados | Pre-lanzamiento, entregas de funciones |
| `/product-discovery` | Marcos de descubrimiento: definición del problema, mapeo de suposiciones, dimensionamiento de oportunidades | Descubrimiento en etapa temprana |
| `/experiment-designer` | Diseño de pruebas A/B, formulación de hipótesis, selección de métricas, tamaño de muestra | Validar decisiones de diseño con datos |

### Agentes

| Agente | Modelo | Cuándo activarlo |
|---|---|---|
| `hypothesis-tester` | Sonnet | Validar hipótesis de diseño con datos de investigación o analítica |

---

## Flujo de trabajo diario

### Por la mañana — sesiones de síntesis de investigación

**Convertir notas sin procesar en insights:**
```
/ux-researcher

Sintetiza los hallazgos de investigación de usuario a partir de estas 5 notas de entrevista.

Tipo de investigación: entrevistas con usuarios
Número de sesiones: 5
Hallazgos sin procesar: [pega tus notas de entrevista, una por sesión]

Necesito: temas agrupados, insights priorizados en formato "Cuando X, los usuarios Y — esto significa Z",
y recomendaciones P1/P2/P3.
```

**Crear una persona a partir de la síntesis:**
```
/persona-builder

Crea personas de usuario a partir de estos datos de investigación.

Fuentes de datos: entrevistas con usuarios (5), tickets de soporte (3 meses), verbatims de NPS
Producto: [nombre]
Base de usuarios: [quién usa este producto]

[pega los hallazgos sintetizados del paso anterior]

Necesito 2 personas para un sprint de diseño la próxima semana. Uso principal: decisiones de diseño y debates sobre alcance.
```

---

### Después de una prueba de usabilidad — redacción de informes

**Convertir notas de sesión en un informe priorizado:**
```
/usability-report

Escribe un informe de prueba de usabilidad para [nombre de la función].

Producto: [nombre]
Función probada: [flujo específico]
Formato de prueba: moderado remoto
Participantes: 6 — [criterios del filtro]
Sesiones realizadas: [rango de fechas]
Preguntas de investigación:
1. [Pregunta principal]
2. [Pregunta secundaria]

Hallazgos sin procesar:
[Pega notas de observadores, citas, registros de completitud de tareas]
```

---

### Pre-lanzamiento — Auditoría de UX

**Antes de que se lance una función:**
```
/ux-audit

Realiza una auditoría de UX de [función/flujo].

Producto: [nombre]
Alcance: [pantallas o flujo a auditar]
Plataforma: web
Tipo de usuario: [nombre de persona]

[Describe la interfaz de usuario — pega enlaces de capturas de pantalla, enlaces de Figma o describe la interfaz]

Dame: puntuaciones heurísticas de Nielsen, todos los problemas con calificaciones de gravedad y una lista de correcciones priorizadas
ordenada por impacto × esfuerzo.
```

---

### Facilitación de crítica de diseño

**Crítica estructurada para tu propio trabajo o una revisión de diseño:**
```
/ux-researcher

Realiza una crítica de diseño estructurada de este diseño.

Diseño: [describe o comparte el enlace de Figma]
Objetivo del usuario: [qué intenta lograr el usuario]
Contexto: [dónde aparece esto en el flujo]
Restricciones: [restricciones técnicas, casos límite a considerar]

Crítica basada en:
1. ¿Logra el objetivo del usuario sin necesidad de entrenamiento?
2. ¿Hay violaciones heurísticas (Nielsen)?
3. ¿Cuál es el error más probable del usuario?
4. ¿Qué haría que esto fallara para usuarios en casos límite?
5. ¿Cómo sería una versión 10 veces mejor (para cuestionar suposiciones)?

Resultado: retroalimentación estructurada con calificaciones de gravedad y sugerencias específicas de rediseño.
```

---

### Comunicación con partes interesadas

**Traducir la investigación en un resumen de decisión:**
```
/usability-report

Convierte este informe de usabilidad en un resumen de decisión para las partes interesadas.

Audiencia: VP de Producto y líder de ingeniería — lectura máxima de 10 minutos
Objetivo: obtener aprobación para priorizar 3 correcciones críticas antes del lanzamiento

[pega los hallazgos del informe de usabilidad]

Formato: resumen ejecutivo → 3 problemas críticos → impacto empresarial → acción recomendada → estimación de esfuerzo.
No incluyas detalles metodológicos — están en el apéndice.
```

---

### Semanal — Mapeo de recorridos

**Mapear la experiencia actual:**
```
/ux-researcher

Crea un mapa del recorrido del cliente para [experiencia].

Experiencia: [experiencia de extremo a extremo a mapear]
Persona de usuario: [qué persona]
Puntos de contacto: [canales a cubrir — correo electrónico, producto, soporte, sitio web]

Usa el formato de 5 fases. Para cada fase: acciones del usuario, puntos de contacto, pensamientos, sentimientos (puntuación 1-5),
puntos de dolor (🔴 crítico / 🟡 notable) y oportunidades.

Incluye una curva de experiencia general que trace el sentimiento a lo largo de las fases.
El punto de menor sentimiento = la oportunidad de diseño de mayor prioridad.

Base de evidencia: [datos de investigación disponibles — entrevistas / analítica / tickets de soporte / suposición]
```

---

## Plan de incorporación de 30 días (nuevas contrataciones de UX o reconvertidos profesionales)

### Semana 1 — Configuración y herramientas de investigación
- Instalar todas las habilidades de producto: `npx claudient add skills product`
- Ejecutar `/persona-builder` con datos de investigación de usuarios existentes — familiarizarse con la comprensión actual de los usuarios
- Ejecutar `/ux-audit` en el flujo más utilizado del producto — evaluación heurística de referencia
- Revisar los informes de pruebas de usabilidad existentes con `/usability-report` como referencia de formato

### Semana 2 — Práctica de investigación
- Realizar tus primeras entrevistas con usuarios — tomar notas sin procesar
- Usar `/ux-researcher` para sintetizar inmediatamente después de cada sesión (no dejes que las notas se enfríen)
- Redactar un informe de síntesis de investigación y compartirlo con el equipo
- Practicar `/ux-audit` en 3 productos de la competencia — desarrollar tu instinto de evaluación heurística

### Semana 3 — Informes y comunicación
- Realizar una prueba de usabilidad completa en una función actual
- Escribir el informe con `/usability-report` — compartir con el PM y el equipo de ingeniería
- Convertir los hallazgos en un resumen para las partes interesadas usando el formato anterior
- Rastrear qué recomendaciones se aceptan vs. se desplazan — y por qué

### Semana 4 — Experimentar y validar
- Usar `/experiment-designer` para diseñar una prueba para tu principal hipótesis de diseño
- Usar el agente `/hypothesis-tester` para validar suposiciones contra analítica o investigación existente
- Realizar un recorrido heurístico con un ingeniero usando la salida de `/ux-audit` como agenda

---

## Integraciones de herramientas

### Figma (herramienta de diseño)
Claude Code no lee archivos de Figma directamente. Mejores prácticas:
- Exportar pantallas clave como imágenes y referenciarlas en el prompt de auditoría
- Usar el enlace "Compartir para presentación" de Figma como referencia en tus notas
- Describir la interfaz de usuario en términos estructurados si no puedes compartir capturas de pantalla

### Dovetail / Notion (repositorio de investigación)
Exportar notas de entrevistas como texto plano → pegarlas en los prompts de síntesis de `/ux-researcher`.
Para repositorios estructurados, copiar las notas sin procesar o los aspectos destacados — no la vista etiquetada/codificada.

### Maze / UserTesting.com (pruebas no moderadas)
Exportar resúmenes de sesiones y métricas de completitud de tareas → pegarlos en `/usability-report`.
Incluir las métricas cuantitativas (tasa de completitud, tiempo en la tarea) y los aspectos cualitativos destacados.

### Miro / FigJam (talleres colaborativos)
Usar Claude para generar el contenido del mapa de afinidad → exportar a Miro para la agrupación visual.
El paso de síntesis de `/usability-report` produce temas agrupados que puedes traducir directamente a notas adhesivas.

### Linear / Jira (seguimiento de problemas)
Usar la lista de correcciones priorizadas de `/usability-report` y `/ux-audit` para generar problemas directamente.

```bash
# Pedir a Claude que formatee la lista de correcciones como tickets de Linear/Jira
"Formatea los hallazgos P1 y P2 como descripciones de problemas de Linear con:
- Título (imperativo)
- Historia de usuario (como [persona], quiero...)
- Criterios de aceptación (3-5 puntos)
- Etiquetas: [ux] [bug] o [ux] [improvement]"
```

---

## Métricas a rastrear

Usa estas para demostrar el impacto de la investigación:

| Métrica | Objetivo |
|---|---|
| Tiempo del ciclo de investigación a recomendación | <2 días desde la última sesión hasta el informe compartido |
| Tasa de adopción de recomendaciones | >60% de los hallazgos P1/P2 abordados en 2 sprints |
| Mejora de la puntuación SUS (post-corrección) | +5 puntos SUS por ciclo de corrección heurística principal |
| Tiempo para actualizar personas después de la investigación | <1 semana |
| Problemas de accesibilidad encontrados antes del lanzamiento (vs. post-lanzamiento) | 100% detectados antes del lanzamiento |
| Entrega del informe de usabilidad después de completar las pruebas | <48 horas |

---

## Errores comunes (y cómo Claude Code ayuda a evitarlos)

**Error 1: Escribir informes que nadie lee**
Las partes interesadas no leen informes de 20 páginas. Usa el formato de resumen ejecutivo de `/usability-report` y la salida del resumen de decisión. Una página, tres hallazgos, una recomendación y una estimación de esfuerzo.

**Error 2: Personas sin datos detrás de ellas**
`/persona-builder` marca cada afirmación que carece de evidencia y se niega a fabricar citas. Aliméntalo con datos reales.

**Error 3: Auditar todo por igual**
`/ux-audit` puntúa por gravedad × frecuencia y produce una lista de clasificación forzada. No trates un problema cosmético y un problema que bloquea una tarea como equivalentes.

**Error 4: Síntesis de investigación que tarda una semana**
Ejecuta `/ux-researcher` inmediatamente después de cada sesión. No acumules — sintetiza sobre la marcha. Las notas de 3 días de antigüedad pierden su textura.

**Error 5: Omitir la traducción del "por qué es importante"**
Los ingenieros y los PMs necesitan entender el impacto empresarial, no solo el problema de UX. La salida de `/usability-report` siempre incluye una sección de "por qué es importante" para cada hallazgo — no la omitas.

---

## Recursos

- [Primeros pasos con Claude Code](../getting-started.md)
- [Flujo de trabajo del sprint de investigación de UX](../workflows/ux-research-sprint.md)
- [Habilidad de diseño de experimentos](../skills/product/experiment-designer.md)
- [Habilidad de descubrimiento de producto](../skills/product/product-discovery.md)
- [Agente probador de hipótesis](../agents/roles/hypothesis-tester.md)

---

> **Trabaja con nosotros:** Claudient cuenta con el respaldo de [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
