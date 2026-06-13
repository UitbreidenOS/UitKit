---
name: product-discovery
description: "Descubrimiento de producto: entrevistas con clientes, validación de problemas, puntuación de oportunidades, marco Jobs-to-be-Done, definir qué construir a continuación y por qué"
---

# Competencia Descubrimiento de Producto

## Cuándo activar
- Decidir qué construir a continuación con poca evidencia
- Validar una idea de producto antes de invertir en desarrollo
- Realizar entrevistas con clientes y sintetizar insights
- Aplicar el marco Jobs-to-be-Done (JTBD) para entender las motivaciones del usuario
- Escribir una declaración de problema o resumen de oportunidad
- Puntuación y priorización de un cartera de características potenciales

## Cuándo NO usar
- Después de la decisión de construir — eso es especificación de producto y entrega
- Diseño UX/UI — use una herramienta de diseño o proceso de sprint de diseño
- Diseño de prueba A/B — use la competencia experiment-designer
- Dimensionamiento de mercado para inversores — eso es un modelo financiero, no descubrimiento

## Instrucciones

### Guía de entrevista con clientes

```
Escriba una guía de entrevista con clientes para [área de problema/producto].

Lo que intentamos aprender: [incertidumbre específica o hipótesis a validar]
Objetivo de la entrevista: [a quién entrevistar — rol, tipo de empresa, contexto]
Número de entrevistas planeadas: [X]

Estructura de la entrevista (45-60 minutos):

1. Calentamiento (5 min):
   - „Cuénteme sobre su rol y cómo se ve una [semana / proyecto] típica"
   - „¿Cuánto tiempo lleva haciendo esto?"
   - Objetivo: construir rapport, entender contexto — NO haga preguntas sobre el producto aún

2. Situación actual (10 min):
   - „Recorrer la última vez que tuvo que [hacer la cosa que resolvemos]"
   - „¿Cómo se ve ese proceso hoy?"
   - „¿Quién más está involucrado?"
   - Regla: haga preguntas sobre comportamiento pasado, no sobre comportamiento futuro hipotético

3. Dolor y fricción (15 min):
   - „¿Cuál es la parte más difícil de este proceso?"
   - „¿Cuánto tiempo toma? ¿Qué tan a menudo?"
   - „¿Qué ha intentado hacer para arreglar esto? ¿Qué pasó?"
   - „¿Cómo lo resuelve hoy? ¿Qué está mal con esa solución?"

4. Motivación y resultado (10 min):
   - „¿Por qué es importante para usted / su equipo / su empresa?"
   - „¿Qué sería diferente si esto estuviera completamente resuelto?"
   - „¿Cuál es el costo de no resolverlo?" (tiempo, dinero, riesgo, emoción)

5. Cierre (5 min):
   - „¿Hay algo que no haya preguntado que me ayudaría a entender esto mejor?"
   - „¿Con quién más debería hablar?"

Reglas:
- Nunca pregunte "¿Usaría usted X?" — las personas dicen que sí a todo lo hipotético
- Nunca muestre el producto o un prototipo antes de entender el problema
- Pregunte constantemente "Cuénteme más" y "¿Por qué"
- Tome notas sobre palabras exactas (el vocabulario importa para la mensajería)

Genere la guía para mi área de problema específica con preguntas personalizadas.
```

### Análisis Jobs-to-be-Done

```
Aplique el marco Jobs-to-be-Done para entender [producto/característica].

Contexto: [describe el producto y al usuario haciendo el trabajo]

Marco JTBD:

1. Defina el trabajo:
   Formato: Cuando [situación], quiero [motivación], para poder [resultado].
   
   Ejemplo: "Cuando integro a un nuevo ingeniero en la base de código, quiero que sea productivo rápidamente, para poder mantener la velocidad del equipo sin convertirme en un cuello de botella."
   
   Trabajo para mi contexto: [escriba la declaración de trabajo]

2. Descomponga el trabajo en pasos (mapa de trabajos):
   Paso 1 — Defina: ¿qué hace el usuario para enmarcar o delimitar la tarea?
   Paso 2 — Localice: ¿qué información o recursos necesita encontrar?
   Paso 3 — Prepare: ¿cómo se prepara para hacer el trabajo?
   Paso 4 — Ejecute: ¿cuál es la acción central del trabajo?
   Paso 5 — Monitoree: ¿cómo rastrea el progreso o la calidad?
   Paso 6 — Modifique: ¿qué ajusta cuando las cosas no salen según lo planeado?
   Paso 7 — Concluya: ¿cómo termina y entrega?

3. Identifique resultados (cómo el usuario mide el éxito):
   - Velocidad: ¿con qué rapidez puede hacer [paso X]?
   - Precisión: ¿con qué confiabilidad produce [paso X] el resultado correcto?
   - Esfuerzo: ¿cuánto esfuerzo cognitivo/físico requiere [paso X]?
   - Riesgo: ¿qué tan seguro está de que [paso X] no fallará?

4. Encuentre resultados desatendidos (la oportunidad):
   Califique cada resultado: importancia vs. satisfacción actual (escala 1-10)
   Puntuación de oportunidad = importancia + (importancia - satisfacción)
   Puntuación > 10: oportunidad fuerte para abordar

Aplique para: [usuario específico y trabajo en mi producto].
```

### Puntuación de oportunidades

```
Califique y priorice las oportunidades de producto.

Oportunidades a evaluar: [lista — pueden ser características, problemas a resolver o segmentos a servir]
Datos disponibles: [entrevistas con clientes / tickets de soporte / comentarios de NPS / analítica / ninguno]

Marco de puntuación de oportunidades (RICE o criterios ponderados):

Puntuación RICE:
Reach: ¿cuántos usuarios afectados por trimestre? [X]
Impact: ¿cuánto mejora su resultado? [masivo=3 / alto=2 / medio=1 / bajo=0.5]
Confidence: ¿qué tan seguros estamos del alcance e impacto? [alto=100% / medio=80% / bajo=50%]
Effort: ¿semanas de ingeniería para construir? [X]
RICE = (Reach × Impact × Confidence) / Effort

Alternativa: criterios ponderados (si desea incluir ajuste estratégico):
| Oportunidad | Dolor del Usuario (30%) | Ajuste Estratégico (20%) | Frecuencia (20%) | Esfuerzo (30%) | Total |
|---|---|---|---|---|---|
| [A] | 8 | 7 | 9 | 5 | 7.2 |
| [B] | 6 | 9 | 4 | 8 | 6.8 |

Qué incluir en la puntuación:
- Severidad del dolor del usuario: ¿qué tan malo es el problema hoy?
- Frecuencia: ¿con qué frecuencia el usuario se encuentra con esto?
- Alineación estratégica: ¿esto avanza nuestra tesis central?
- Viabilidad: ¿podemos realmente construirlo bien?
- Diferenciación del mercado: ¿un competidor ya hace esto bien?

Califique mis [X] oportunidades y produzca una lista priorizada con justificación.
```

### Resumen del Problema

```
Escriba un resumen del problema para [oportunidad].

Contexto: [lo que sabemos sobre este problema de la investigación]
Evidencia: [citas de entrevistas, volumen de tickets de soporte, datos de analítica]
Segmento afectado: [quién lo experimenta, cuántos usuarios]

Estructura del resumen del problema:

## El Problema
[2-3 oraciones describiendo la situación específica, fricción e impacto. Sin solución aún.]

## Quién lo experimenta
[Persona del usuario + cuantificación: „X% de nuestros usuarios [segmento] enfrentan esto cuando..."]

## Evidencia
- Insight de entrevista: „[Cita exacta de un usuario]" — [Rol, Empresa]
- Analítica: [punto de datos relevante]
- Soporte: [volumen o patrón del soporte]

## Soluciones actuales
[Cómo los usuarios resuelven esto hoy — y por qué esas soluciones son insuficientes]

## Por qué importa esto
[Caso comercial: impacto en retención, adquisición, ingresos o posición estratégica]

## Cómo se ve el éxito
[Resultado medible — no una característica, sino el comportamiento o resultado del usuario modificado]

## Qué esto NO es
[Restricciones y aclaraciones fuera del alcance — lo que no intentaremos resolver]

---
Preguntas abiertas antes de que construyamos:
- [Pregunta 1 — ¿qué aún no sabemos?]
- [Pregunta 2]
Propietario del descubrimiento: [nombre]
Próximo paso: [X más entrevistas / prueba de prototipo / construir?]

Escriba un resumen del problema para mi oportunidad usando la evidencia que proporciono.
```

## Ejemplo

**Usuario:** Somos una herramienta de gestión de proyectos para equipos de ingeniería. Continuamos escuchando "nuestros ingenieros no actualizan los tickets". ¿Deberíamos construir mejor sincronización de Jira, más recordatorios o aplicar actualizaciones de tickets? Primero descubrimiento.

**Plan de descubrimiento de Claude:**

No construya aún. „Los ingenieros no actualizan los tickets" es un síntoma con al menos 3 causas raíz diferentes — cada una requiere una solución diferente.

**3 hipótesis para probar en entrevistas:**
1. **Hipótesis de fricción:** Los ingenieros saben que deberían actualizar, pero el flujo de trabajo es demasiado lento (→ resolver con mejor UI, atajos de teclado, integración de Slack)
2. **Hipótesis de confianza:** Los ingenieros piensan que los datos de los tickets no importan porque los PM no los leen realmente (→ resolver con mejores herramientas de visibilidad para PM, no flujos de ingenieros)
3. **Hipótesis de irrelevancia:** Los tickets se vuelven obsoletos porque los requisitos cambian a mitad del sprint y nadie actualiza la fuente de verdad (→ resolver con flujo de replanificación ligera, no recordatorios)

**5 preguntas de entrevista para hacer (a ingenieros, no PM):**
1. "Repase el último ticket en el que trabajó — ¿cuándo lo vio primero, cuándo lo actualizó por última vez?"
2. "Cuando termina una tarea, ¿qué hace a continuación?" (Escuche: nunca mencionen tickets)
3. "¿Qué sucede si no actualiza su ticket?" (Escuche: nada / PM me pregunta / la revisión del sprint es confusa)
4. "¿Alguna vez actualizó un ticket y no pasó nada?" (Valida la hipótesis de confianza)
5. "¿Qué lo haría querer realmente actualizar tickets?" (Abierto, escuche sin proyectar)

Realice 5 entrevistas. Sabrá cuál hipótesis es verdadera — y probablemente ahorrará 2-3 meses construyendo lo incorrecto.

---
