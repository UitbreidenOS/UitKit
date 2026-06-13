---
name: persona-builder
description: "Constructor de personas de usuario a partir de datos de investigación: demografía, objetivos, puntos de dolor, comportamientos, citas"
---

# Habilidad de Constructor de Personas

## Cuándo activar
- Tienes datos de investigación de usuarios (entrevistas, encuestas, tickets de soporte, analítica) y necesitas destilarlos en personas accionables
- Un equipo de diseño o producto está a punto de iniciar una nueva iniciativa y necesita comprensión compartida de para quién están construyendo
- Quieres cuestionar o validar suposiciones sobre tus usuarios con arquetipos respaldados por datos
- Necesitas crear personas para guiar la priorización del roadmap, el tono del texto o las decisiones de alcance de funcionalidades
- Incorporar a nuevos miembros del equipo que necesitan entender la base de usuarios rápidamente

## Cuándo NO usar
- No tienes datos reales de usuarios — haz la investigación primero; las personas sintéticas basadas en suposiciones son perjudiciales
- Necesitas una persona de marketing para segmentación/targeting — objetivo y estructura diferentes a una persona de UX
- Quieres hacer mapeo de recorrido — usa `/ux-researcher` para ese paso después de definir las personas
- Necesitas un perfil de comportamiento detallado para un usuario avanzado específico — eso es un arquetipo de usuario o una historia de trabajo, no una persona

## Instrucciones

### Generación completa de personas a partir de datos de investigación

```
Construye personas de usuario a partir de estos datos de investigación.

## Datos de entrada
Fuentes de datos disponibles: [entrevistas de usuario (N) / resultados de encuestas (N respuestas) / segmentos de analítica / tickets de soporte / sesiones de usabilidad / todos]
Producto: [nombre y descripción en 1 oración]
Base de usuarios: [quién usa este producto — sé específico sobre el rango de tipos de usuario]

## Datos en bruto para analizar
[Pega notas de entrevistas, temas de respuestas de encuestas, segmentos de analítica, citas clave, temas de tickets de soporte, o cualquier combinación]

## Requisitos de personas
Número de personas necesarias: [2-4 — rango recomendado; menos es mejor]
Uso principal: [decisiones de diseño de producto / priorización del roadmap / alcance de ingeniería / comunicación con partes interesadas]

## Para cada persona, produce:

---

### Persona [N]: [Nombre del Arquetipo]
[El nombre debe ser un descriptor de rol, no un nombre de pila ficticio — p. ej., "El Director de Ops Desbordado", "El Constructor de Automatizaciones Power User", "El Responsable de Compras Cauteloso"]

**Tagline:** [Una oración que capture su frustración o objetivo definitorio — esto es lo primero que leen los lectores y debe ser memorable]

---

#### Rol y contexto
- **Cargo / función:** [rango de cargos realistas — no solo uno]
- **Sector / tipo de empresa:** [dónde trabaja]
- **Tamaño de empresa:** [PYME / mediana empresa / gran empresa — y por qué eso importa para tu producto]
- **Competencia técnica:** [escala 1-5 con descripción en lenguaje llano]
- **Cómo usa tu producto:** [uso diario / ocasional / mandato del equipo / sustituto de otra cosa]
- **A quién influye o con quién trabaja:** [sus partes interesadas — relevante para productos B2B]

#### Objetivos (cómo se ve el éxito para ellos)
- **Objetivo principal:** [el trabajo que intenta hacer — usa el encuadre "Jobs to Be Done" donde sea posible]
- **Objetivo secundario:** [un objetivo de apoyo que a menudo compite con el principal]
- **Métrica de éxito que les importa:** [el número o resultado por el que se les mide — esto impulsa el comportamiento]

#### Frustraciones (con las soluciones actuales — respaldadas por evidencia)
Para cada frustración, incluye la evidencia (cita o dato que la puso de manifiesto):

1. **[Título de la frustración]:** [Descripción específica del dolor]
   Evidencia: "[Cita verbatim o paráfrasis cercana de la investigación]" — [fuente, p. ej. entrevista P3, o 34% de los encuestados]

2. **[Título de la frustración]:** [...]
   Evidencia: [...]

3. **[Título de la frustración]:** [...]
   Evidencia: [...]

#### Patrones de comportamiento
- **Cómo descubren herramientas:** [boca a boca / mandato del manager / prueba / investigación / recomendación de pares]
- **Proceso de evaluación:** [cómo deciden si adoptar — prueba, demo, revisión de pares, adquisición, etc.]
- **Patrón de uso:** [cómo usan realmente el producto en el día a día]
- **Soluciones alternativas que usan hoy:** [qué hacen cuando tu producto no resuelve el problema — fundamental para el diseño]
- **Estilo de comunicación:** [Slack / email / asíncrono / síncrono — relevante para la mensajería en la app]

#### La cita que define a esta persona
"[Una cita verbatim o casi verbatim de la investigación que captura la visión del mundo de esta persona. Esta debería ser la cita que pondrías en un póster.]"

#### Lo que necesitan del producto (necesidades que impulsan decisiones)
- [Necesidad 1 — lo suficientemente específica para impulsar una decisión de diseño]
- [Necesidad 2]
- [Necesidad 3]

#### Lo que les hará irse (factores de abandono)
- [Riesgo 1 — la condición bajo la cual esta persona abandona el producto]
- [Riesgo 2]

#### Implicaciones de diseño (traducción directa a decisiones de producto)
- [Implicación 1 — "Porque esta persona X, el producto debería Y"]
- [Implicación 2]
- [Implicación 3]

---

### Tabla comparativa de personas (tras todas las personas)

| Dimensión | Persona 1 | Persona 2 | Persona 3 |
|---|---|---|---|
| Competencia técnica | Baja | Alta | Media |
| Poder de decisión | Ninguno | Influenciador | Comprador |
| Dolor principal | [dolor] | [dolor] | [dolor] |
| Propuesta de valor que resuena | [prop] | [prop] | [prop] |
| Prioridad de funcionalidades | [funcionalidades] | [funcionalidades] | [funcionalidades] |
| Riesgo de abandono | Alto | Bajo | Medio |

### Priorización de personas
Para qué persona diseñar primero — y por qué:
[Recomendación explícita basada en impacto empresarial y encaje estratégico — no solo "usuario más común"]
```

### Esbozo rápido de persona (a partir de datos mínimos)

```
Crea un esbozo rápido de persona a partir de datos limitados.

Tengo: [qué datos tienes — p. ej. "5 tickets de soporte y los verbatim de nuestra encuesta NPS"]
Producto: [nombre]
Tipo de usuario que intento entender: [p. ej. "los usuarios que abandonan en los primeros 30 días"]

Genera una persona de hipótesis de trabajo — márcala claramente como HIPÓTESIS, no validada.

Formato:
- Nombre del arquetipo y tagline
- 3 características definitorias
- Frustración principal (con cualquier evidencia disponible)
- 2 implicaciones de diseño
- Las 3 preguntas que esta persona plantea y que necesitan investigación real para validar

Etiqueta cada suposición claramente. Una persona de hipótesis es un punto de partida para la investigación, no un sustituto de ella.
```

### Lista de verificación de validación de personas

```
Valida esta persona existente con nuevos datos.

Persona existente: [pega la persona]
Nuevos datos: [pega nuevas notas de entrevistas, resultados de encuestas o analítica]

Verifica:
1. ¿Los nuevos datos confirman o contradicen el objetivo principal? [Confirmado / Contradicho / Parcialmente respaldado]
2. ¿Las frustraciones declaradas siguen presentes? [Lista cuáles aparecen en los nuevos datos]
3. ¿Hay nuevas frustraciones no presentes en la persona actual? [Listarlas]
4. ¿Ha cambiado el patrón de comportamiento? [¿Qué es diferente?]
5. ¿Sigue siendo representativa la cita representativa, o hay una mejor en los nuevos datos?

Resultado: Persona actualizada con marcadores [NUEVO] en los campos modificados y un resumen de cambios.
```

### Detección de antipatrones

```
Revisa esta persona y señala antipatrones comunes.

[Pega la persona existente]

Verifica estos modos de fallo:
1. RELLENO DEMOGRÁFICO — ¿Hay detalles demográficos irrelevantes (edad, género, ubicación, aficiones) que no impulsan decisiones de producto? Señalar y recomendar eliminar.
2. SUPOSICIÓN SIN EVIDENCIA — ¿Se hacen afirmaciones sin citar datos de investigación? Señalar cada una.
3. ARQUETIPO DE USUARIO ÚNICO — ¿Representa esta persona múltiples tipos de usuarios distintos que necesitan personas separadas? Señalar si es así.
4. SESGO ASPIRACIONAL — ¿Describe la persona al usuario que el equipo desea que fuera, en lugar de quien realmente es? Busca lenguaje demasiado positivo o que contradiga patrones comunes de soporte.
5. CONFUSIÓN CON PERSONA DE MARKETING — ¿Describe esta persona comportamiento de compra en lugar de comportamiento de uso del producto? Sirven a propósitos diferentes.
6. ROLES MEZCLADOS — En productos B2B, ¿es esta persona una mezcla del Defensor (usuario diario) y el Comprador Económico? Deben ser separados.

Para cada antipatrón encontrado: explica por qué es un problema y recomienda una corrección específica.
```

## Ejemplo

**Usuario:** Entrevistamos a 8 usuarios de nuestra herramienta de gestión de proyectos. Estos son los temas: la mayoría son líderes de equipo en empresas de 50-200 personas. Les importa la visibilidad entre proyectos sin tener que pedir actualizaciones a su equipo. Están frustrados porque nuestros informes actuales son demasiado manuales — tienen que construir sus propios paneles. Tres dijeron que terminan haciendo capturas de pantalla de nuestra herramienta y pegándolas en diapositivas para su actualización ejecutiva del lunes. Dos dijeron que probaron nuestra función de informes y la abandonaron tras 15 minutos.

**Resultado:**

```markdown
### Persona 1: El Líder de Equipo Famélico de Visibilidad

**Tagline:** "Me paso la mitad del domingo construyendo el deck de diapositivas que debería construirse solo."

---

#### Rol y contexto
- **Cargo / función:** Líder de Equipo, Manager de Ingeniería, Manager de Operaciones, o rol de liderazgo de personas similar
- **Tamaño de empresa:** 50-200 empleados (mediana empresa; demasiado grande para rastrear todo de memoria, demasiado pequeña para tener un PMO dedicado)
- **Competencia técnica:** 3/5 — cómodo con las herramientas, pero sin dedicar tiempo a la configuración
- **Cómo usa tu producto:** Revisiones diarias de sus propias tareas, pero su necesidad real es una vista de estado entre equipos que pueda compartir hacia arriba
- **A quién influye:** Su equipo directo (5-15 personas) y su propio manager (el ejecutivo al que reporta semanalmente)

#### Objetivos
- **Objetivo principal:** Conocer el estado de todos los proyectos activos sin tener que interrumpir a su equipo para preguntar
- **Objetivo secundario:** Producir una diapositiva para el standup del lunes en menos de 10 minutos
- **Métrica de éxito que les importa:** Su manager dice "buena actualización" sin hacer preguntas de seguimiento

#### Frustraciones
1. **Los informes son manuales y con pérdida de información:** Tienen que construir paneles o exportaciones personalizadas, y para cuando está listo, ya está desactualizado.
   Evidencia: "Hago una captura de pantalla del tablero y la pego en diapositivas cada semana. Se siente ridículo." — Entrevista P3

2. **La función de informes es demasiado compleja de configurar:** La herramienta tiene capacidad de informes pero requiere demasiada configuración para alguien que solo necesita una vista de estado semanal.
   Evidencia: 2/8 participantes intentaron la función de informes; ambos la abandonaron en 15 minutos. Ningún participante tenía un informe funcionando en el momento de la entrevista.

3. **Sin exportación orientada al ejecutivo:** Los resultados están formateados para los trabajadores del proyecto, no para los ejecutivos que necesitan un resumen de 3 diapositivas.
   Evidencia: 3/8 participantes mencionaron explícitamente hacer capturas de pantalla para los standups ejecutivos.

#### La cita que define a esta persona
"Me paso la mitad del domingo construyendo el deck de diapositivas que debería construirse solo."

#### Lo que necesitan del producto
- Un resumen de estado semanal generado automáticamente que puedan compartir con su manager sin modificación
- Visibilidad entre proyectos desde una sola vista — no un tablero por proyecto
- Un formato de exportación que funcione en Google Slides o PowerPoint

#### Implicaciones de diseño
- Porque el flujo de trabajo principal de esta persona es la comunicación hacia arriba, el producto necesita una "vista del manager" que sea distinta de la vista del trabajador de tareas
- Porque hacen capturas de pantalla hoy, el camino de menor resistencia para la adopción es reemplazar esa captura de pantalla con una exportación con un solo clic
- Porque abandonaron la configuración de informes, cualquier solución de informes debe funcionar sin configuración para el caso común (estado semanal del proyecto)
```

---
