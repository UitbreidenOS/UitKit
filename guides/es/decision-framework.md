# Comando vs. Agente vs. Habilidad — Cuándo usar cada uno

Claude Code tiene tres primitivos para extender su comportamiento: habilidades, agentes y comandos de barra diagonal. Se superponen en el área de superficie, por lo que esta es la fuente más común de confusión al construir un sistema de conocimientos de Claude Code. Esta guía resuelve la ambigüedad con un marco de decisión preciso.

---

## Los tres primitivos

### Habilidad (auto-invocada)

- Vive en `.claude/skills/` como un archivo `.md` con frontmatter YAML
- Claude la carga automáticamente cuando la tarea actual coincide semánticamente con la descripción de habilidad — no se requiere entrada del usuario
- Se ejecuta en línea en la conversación actual — no se crea una ventana de contexto separada
- El primitivo más ligero: comparte el historial de conversación completo, contexto inmediato y todos los archivos abiertos
- Mejor para: experiencia de dominio, patrones recurrentes, convenciones de codificación, guías de estilo, idiomas de API, conocimiento específico del proyecto
- Evitar para: tareas que necesitan aislamiento, procesos largos de múltiples pasos, cualquier cosa que deba activarse conscientemente

Una habilidad es esencialmente experiencia persistente inyectada en el razonamiento de Claude en el momento en que se necesita. Cuando Claude te ve trabajando en una ruta FastAPI, la habilidad `fastapi-crud` se carga automáticamente y moldea la salida. No se requiere invocación.

### Agente (subagente generado)

- Vive en `agents/` como un archivo `.md` con frontmatter YAML
- Explícitamente generado por la sesión padre de Claude a través de `Agent(subagent_type="name", prompt="...")`
- Se ejecuta en una ventana de contexto separada — completamente aislado de la conversación padre
- Puede ejecutarse en paralelo — múltiples agentes se ejecutan simultáneamente mientras el padre espera o continúa
- Tiene sus propias restricciones de herramientas, selección de modelo y nivel de esfuerzo
- Mejor para: trabajo especializado que necesita aislamiento, ejecución paralela, tareas donde el ruido intermedio no contaminó el contexto principal, análisis de larga duración
- Evitar para: tareas que necesitan el historial de conversación completo del padre (los agentes reciben solo el aviso que se les pasa)

Un agente es un contratista: le entregas un resumen y trabajan independientemente. No pueden leer su historial de conversación a menos que lo incluya explícitamente en el aviso.

### Comando de barra diagonal (explícitamente invocado)

- Vive en `.claude/commands/` como un archivo `.md`
- El usuario escribe `/command-name` para invocar — nunca auto-invocado
- Se ejecuta en línea en la conversación actual, como una habilidad, pero requiere un activador explícito
- Puede codificar flujos de trabajo complejos de múltiples pasos como avisos estructurados
- Mejor para: flujos de trabajo definidos que los usuarios activan conscientemente — `/code-review`, `/deploy`, `/db-migrate`, `/release-notes`
- Evitar para: capacidades que deben activarse automáticamente; cualquier cosa que los usuarios olvidarán invocar

Un comando de barra diagonal es una macro: un flujo de trabajo predefinido que puede llamar por nombre cuando lo necesite. El usuario siempre está en control.

---

## Árbol de decisión

Trabaje a través de estas preguntas en orden. Deténgase en la primera coincidencia.

```
1. ¿Debería activarse automáticamente sin que el usuario escriba nada?
   SÍ → Habilidad

2. ¿Necesita aislamiento del contexto padre, o debería ejecutarse en paralelo
   con otro trabajo?
   SÍ → Agente

3. ¿Necesita un modelo diferente (Haiku por costo, Opus por profundidad de razonamiento)
   o acceso restringido a herramientas?
   SÍ → Agente

4. ¿Es un flujo de trabajo definido que el usuario activa conscientemente por nombre?
   SÍ → Comando de barra diagonal

5. ¿Es pura experiencia o un patrón (sin ejecución, sin aislamiento necesario)?
   SÍ → Habilidad (en línea)

TODAVÍA INSEGURO → por defecto a Habilidad, escalar a Comando de barra diagonal, escalar a Agente
                   solo cuando el aislamiento es realmente requerido
```

---

## Reglas de auto-invocación

### Cómo se activan las habilidades

Claude lee el frontmatter de habilidad en el inicio de sesión. El campo `description` (hasta ~1.536 caracteres) siempre está en memoria. Cuando una tarea coincide semánticamente, Claude carga el cuerpo completo de habilidad.

```yaml
---
description: "Use for FastAPI route handlers, dependency injection, and Pydantic model definitions. Activates when writing Python web API code."
paths:
  - "**/*.py"
when_to_use: "Python web API development with FastAPI"
---
```

- `description` — señal de coincidencia primaria; manténgalo específico, no genérico
- `paths` — filtro de glob de archivo; la habilidad solo se activa cuando los archivos coincidentes están en contexto
- `when_to_use` — pista de coincidencia secundaria para el enrutador

Las habilidades con descripciones genéricas (`"Use this for Python"`) coinciden demasiado ampliamente y se cargan innecesariamente. Sea preciso.

### Cómo se invocan los agentes

Los agentes siempre se generan explícitamente. La sesión padre los llama.

```python
# Invocación básica
Agent(
  subagent_type="security-auditor",
  description="Audit the authentication module for OWASP Top 10 issues",
  prompt="Review /src/auth/ for injection risks, session fixation, and token exposure. Report findings."
)

# Con anulación de modelo
Agent(
  subagent_type="doc-formatter",
  model="haiku",
  prompt="Reformat all docstrings in /src/utils/ to Google style."
)
```

Pase `background: true` en frontmatter (o establézcalo en el momento de la llamada) para ejecutar el agente sin bloquear la sesión padre.

---

## Reglas de aislamiento de contexto

| Primitivo | ¿Ve conversación padre? | ¿Tiene ventana de contexto propia? | ¿Puede ejecutarse en paralelo? |
|-----------|--------------------------|------------------------|---------------------|
| Habilidad | Sí — historial completo | No | No |
| Agente | No — solo aviso | Sí | Sí |
| Comando de barra diagonal | Sí — historial completo | No | No |

La columna de aislamiento es el diferenciador crítico. Si su tarea necesita acceso al historial de conversación completo, use una habilidad o comando de barra diagonal. Si no debería contaminarse por el contexto padre (o debería ejecutarse junto con otras tareas), use un agente.

---

## Orden de resolución más ligero

Cuando esté inseguro, use por defecto la opción más ligera:

**Habilidad → Comando de barra diagonal → Agente**

Comience con una habilidad. Si la capacidad no se puede auto-invocar de manera confiable (demasiado dependiente del contexto, demasiado explícito), pase a un comando de barra diagonal. Solo escale a un agente cuando el aislamiento o el paralelismo realmente importe. Los agentes cuestan una ventana de contexto adicional y requieren pasar contexto explícitamente — son más costosos en tokens y complejidad.

---

## Ejemplos prácticos

### Ejemplo 1: Convenciones de nomenclatura de API REST

> "Quiero que Claude siempre siga nuestros estándares internos de nomenclatura de puntos finales REST al escribir rutas."

**Respuesta: Habilidad**

Esta es pura experiencia. Debería activarse automáticamente siempre que Claude escriba manejadores de rutas. No se requiere activador de usuario, no se requiere aislamiento. Cree `.claude/skills/rest-conventions.md` con sus reglas de nomenclatura y glob de archivo `paths: ["**/*.py", "**/*.ts"]`.

### Ejemplo 2: Auditoría de seguridad paralela durante el desarrollo

> "Quiero ejecutar una auditoría de seguridad completa del módulo de autenticación mientras continúo trabajando en la función."

**Respuesta: Agente**

La auditoría es una tarea especializada y de larga duración. No debería generar ruido en la conversación principal. Puede ejecutarse en paralelo mientras el desarrollador continúa. Establezca `background: true` y `model: opus` en el frontmatter del agente. Pase el alcance de auditoría en el aviso.

### Ejemplo 3: Flujo de trabajo de implementación

> "Quiero un comando que ejecute pruebas, construya la imagen de Docker e impulse al registro."

**Respuesta: Comando de barra diagonal**

Este es un flujo de trabajo deliberado y conscientemente activado. El desarrollador quiere escribir `/deploy` cuando está listo — no tenerlo auto-activar. Cree `.claude/commands/deploy.md` con el flujo de trabajo completo de múltiples pasos codificado como instrucciones estructuradas.

---

## Comparación de costos de token

Comprender el costo de inicio lo ayuda a decidir si usar una habilidad agresivamente o con moderación.

| Primitivo | Costo de inicio | Costo de coincidencia | Notas |
|-----------|-------------|---------------|-------|
| Descripción de habilidad | ~50–100 tokens | Siempre en contexto | Mantenga las descripciones cortas y específicas |
| Cuerpo completo de habilidad | ~200–2.000 tokens | Cargado en coincidencia semántica | Solo carga cuando es necesario |
| Agente | 0 al inicio | Pagado cuando se genera | Ventana de contexto separada |
| Comando de barra diagonal | 0 al inicio | Pagado cuando se invoca | Cargado en `/command` |

Las habilidades incurren en un costo de inicio pequeño pero constante para cada sesión. Si tiene 40 habilidades con descripciones de 100 tokens, eso es 4.000 tokens de sobrecarga antes del primer mensaje del usuario. Audite sus descripciones de habilidad y manténgalas apretadas. Los agentes y comandos de barra diagonal no cuesta nada hasta su uso explícito.

---
