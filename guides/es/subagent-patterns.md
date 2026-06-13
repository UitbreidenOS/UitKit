# Patrones de diseño de subagentes

Cómo estructurar tareas Claude Code de múltiples agentes para paralelismo, exactitud y eficiencia de costo. Cada patrón abajo tiene un perfil de caso de uso, un diagrama textual, orientación de implementación y errores comunes a evitar.

---

## Entendiendo subagentes en Claude Code

Cuando Claude Code genera un subagente, usa la herramienta `Agent` para lanzar una instancia Claude separada con su propia ventana de contexto. El agente padre continúa ejecutándose (o espera, dependiendo del patrón). Los subagentes pueden usar herramientas, leer archivos, escribir archivos y devolver resultados al padre.

Restricciones clave:
- Cada subagente tiene su propio presupuesto de token — el fan-out multiplica costo linealmente
- Los subagentes no pueden compartir memoria directamente — se comunican a través de archivos o valores de retorno
- El spawning es asincrónico de forma predeterminada; el padre puede esperar resultados o continuar
- Los permisos de herramientas aplican a cada subagente de forma independiente

---

## Patrón 1: Fan-Out

**Envía N agentes simultáneamente, agrega resultados.**

```
Parent
  ├── Agent A (maneja shard 1)
  ├── Agent B (maneja shard 2)
  ├── Agent C (maneja shard 3)
  └── [espera por todos]
        └── Parent agrega resultados
```

**Cuándo usar:**
- Unidades de trabajo independientes que no comparten estado
- Procesar una lista (archivos, repos, endpoints, casos de prueba) donde cada elemento es auto-contenido
- Cualquier tarea donde ejecución secuencial tomaría N× más tiempo sin beneficio de calidad

**Cuándo NO usar:**
- Tareas con estado mutable compartido (escrituras de archivo concurrentes causan conflictos)
- Cuando los resultados de shard dependen uno del otro
- Cuando costo de token es una preocupación y calidad-por-token importa más que velocidad

**Implementación:**
```
Spawna 4 agentes en paralelo. Cada agente maneja un directorio de servicio:
  - Agent 1: audita /services/auth/
  - Agent 2: audita /services/payments/
  - Agent 3: audita /services/notifications/
  - Agent 4: audita /services/reporting/

Cada agente escribe hallazgos a /tmp/audit-[service].json.
Después de que los 4 completen, lee los cuatro archivos y produce un informe consolidado.
```

**Errores comunes:**
- No dar a cada agente una ruta de salida única (se sobrescriben uno al otro)
- Spawnear más agentes que unidades de trabajo significativas (un archivo de 3 líneas no necesita su propio agente)
- Agregar antes de que todos los agentes terminen (verifica que todos los archivos de salida existan antes de consolidar)

---

## Patrón 2: Cadena de validación

**Agente A → puerta → Agente B → puerta → Agente C. Cada agente puede bloquear progresión.**

```
Input → Agent A → [GATE: pass/fail?] → Agent B → [GATE: pass/fail?] → Agent C → Output
                        │                               │
                      STOP                            STOP
                  (fix required)                 (fix required)
```

**Cuándo usar:**
- Tuberías de enforcement de calidad (escribir → revisar → aprobar)
- Flujos de trabajo sensibles a seguridad donde un paso sin control es peor que ningún paso
- Cuando cada etapa produce un artefacto transformado que la siguiente etapa necesita
- El flujo de trabajo `workflows/pre-human-review.md` usa este patrón

**Cuándo NO usar:**
- Cuando etapas son independientes y podrían ejecutarse en paralelo (usa fan-out en su lugar)
- Cuando todos los agentes probablemente pasen (revisar tres agentes un cambio de dos líneas es sobre-ingenierizado)
- Cuando el costo de la cadena completa excede el costo de un agente único cuidadoso

**Implementación:**
```
Cadena: simplificador → revisor de seguridad → revisor de código

Después de cada agente, verifica su salida para una señal PASS/FAIL antes de spawnear el siguiente.
Si algún agente devuelve FAIL, detén la cadena y superficializa los problemas.
Solo spawna el siguiente agente después de PASS explícito.

Nunca agrupe la cadena en una llamada de agente único — la lógica de puerta debe ser enforced por el padre.
```

**Errores comunes:**
- Definir puertas muy libremente (cada agente pasa, la cadena no proporciona valor)
- Definir puertas muy estrictamente (una advertencia menor detiene todo)
- Dejar agentes saber qué viene después (deben evaluar independientemente, no calibrar a la siguiente etapa)

---

## Patrón 3: Enrutamiento especialista

**Clasifica la tarea, enruta al agente experto correcto.**

```
Input → Classifier → router decision
                          ├── [type: security] → Security Specialist
                          ├── [type: database] → DB Specialist
                          ├── [type: frontend] → UI Specialist
                          └── [type: unknown]  → General Agent
```

**Cuándo usar:**
- Una cola heterogénea de tareas que requieren diferentes especialidades
- Evitar un agente propósito general que es mediocre en todo
- Cuando agentes especialistas llevan instrucciones específicas del dominio que el agente general no debería cargar

**Cuándo NO usar:**
- Tareas que son claramente un tipo — sin necesidad de clasificar lo que ya sabes
- Cuando el clasificador mismo es costoso (clasificar una corrección de una línea con una llamada Sonnet desperdicia tokens)

**Implementación:**
```
Paso 1 — Clasifica (usa Haiku para costo):
  "Lee esta descripción de tarea y devuelve una palabra: security | database | frontend | backend | unknown"

Paso 2 — Enruta basado en clasificación:
  if security → spawna agents/security-reviewer.md
  if database → spawna agents/db-specialist.md
  if frontend → spawna agents/ui-reviewer.md
  else        → spawna agente general

Paso 3 — Devuelve resultado del especialista al usuario.
```

**Errores comunes:**
- Usar Sonnet u Opus para clasificación — Haiku clasifica igual de precisamente por una fracción del costo
- Enrutando a especialista pero no dándole el contexto completo desde el clasificador
- Sobre-segmentar (10 agentes especialistas para una app que solo necesita 2)

---

## Patrón 4: Watchdog

**Un agente monitor observa e puede intervenir en un agente trabajador de larga ejecución.**

```
Worker Agent ──── progress updates ───→ Watchdog Agent
     │                                        │
     │                                  [monitors for]
     │                                  - stuck loops
     └── [watchdog puede señal halt] ←── - dangerous actions
                                        - quality degradation
```

**Cuándo usar:**
- Sesiones autónomas largas donde ir fuera-de-raíles es costoso
- Cuando agente trabajador usa herramientas con efectos secundarios del mundo real (escrituras de archivo, llamadas API, deploys)
- Ejecuciones nocturnas o desatendidas donde necesitas un interruptor de circuito

**Cuándo NO usar:**
- Tareas cortas (< 5 minutos) — la sobrecarga del watchdog no vale la pena
- Tareas de exploración solo-lectura donde el peor resultado es una respuesta equivocada

**Implementación:**
```
Spawna watchdog con estos disparadores:
  HALT if: trabajador intenta escribir a /etc/, ejecutar rm -rf o acceder archivos .env
  WARN if: trabajador ha hecho la misma llamada de herramienta 3+ veces sin progreso
  WARN if: tamaño de salida del trabajador excede 50k tokens (probablemente haciendo bucles)
  REPORT at: finalización de tarea o halt

El watchdog no puede anular al trabajador directamente — señala al padre, que decide si detiene.
```

**Errores comunes:**
- Hacer el watchdog demasiado sensible (detiene en el primer reintento, derrotando el propósito)
- Hacer el watchdog demasiado permisivo (nunca se dispara, proporciona seguridad falsa)
- Watchdog ejecutándose en el mismo modelo que el trabajador (usa Haiku para watchdog — está observando, no razonando)

---

## Patrón 5: Investigación paralela

**Múltiples agentes prueban diferentes hipótesis simultáneamente; primer resultado correcto gana (o todos se comparan).**

```
Hypothesis 1 → Agent A ─────┐
Hypothesis 2 → Agent B ─────┼──→ Parent compara resultados → mejor respuesta
Hypothesis 3 → Agent C ─────┘
```

**Cuándo usar:**
- Depuración donde la causa raíz es incierta y múltiples teorías son plausibles
- Tareas de investigación donde diferentes estrategias de búsqueda podrían producir hallazgos diferentes
- Cualquier tarea donde el mejor enfoque es genuinamente incierto al inicio

**Cuándo NO usar:**
- Tareas donde hay un enfoque obviamente correcto
- Situaciones sensibles a costo — este patrón es el más costoso por respuesta correcta
- Cuando hipótesis no son independientes (el resultado del Agente A cambia si Hipótesis B es válida)

**Implementación:**
```
Spawna 3 agentes con diferentes hipótesis para por qué la base de datos es lenta:
  - Agent A: investiga planes de consulta e índices faltantes
  - Agent B: investiga agotamiento de fondo de conexión
  - Agent C: investiga contención de bloqueo

Cada agente escribe hallazgos y nivel de confianza a /tmp/hypothesis-[A/B/C].md.
Después de que todos completen, compara hallazgos y devuelve la causa raíz más probable con evidencia.
```

**Errores comunes:**
- Enmarcar hipótesis tan similarmente que agentes producen resultados casi idénticos
- No incluir puntuación de confianza — sin ella, no puedes elegir entre hallazgos conflictivos
- Ejecutar demasiadas hipótesis (3-4 es usualmente correcto; más allá, el costo supera beneficio marginal de otra teoría)

---

## Comparación de costo de token

| Patrón | Costo relativo | Mejor eficiencia de costo |
|---|---|---|
| Fan-out (N agentes) | N × agente único | Cuando N tareas son totalmente paralelizables |
| Cadena de validación (3 agentes) | 3× si todos pasan, menos si halt temprano | Cuando halt temprano es común |
| Enrutamiento especialista | ~1× (clasificador es Haiku) | Casi siempre más barato que general + corrección post-hoc |
| Watchdog | ~1.05–1.1× (watchdog Haiku) | Sesiones autónomas largas |
| Investigación paralela | N× sin terminación temprana | Solo cuando incertidumbre es alta y errores son costosos |

**Orientación de costo:**
- Usa Haiku para: clasificadores, watchdogs, agentes de traducción, cualquier agente haciendo transformación mecánica
- Usa Sonnet para: especialistas, revisores, agentes que necesitan criterio
- Usa Opus para: decisiones de alto riesgo, análisis de arquitectura compleja — no para roles de soporte

---
