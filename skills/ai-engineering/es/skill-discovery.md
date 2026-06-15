---
name: skill-discovery
description: "Descubrir habilidades relacionadas mediante análisis de gráficos de dependencia, encontrar caminos de aprendizaje e identificar clústeres de habilidades"
updated: 2026-06-15
---

# Habilidad de Descubrimiento de Habilidades

## Cuándo activar

- Buscar habilidades relacionadas con un tema (por ejemplo, «Necesito trabajar con RAG — ¿qué habilidades debería leer?»)
- Construir un camino de aprendizaje (por ejemplo, «¿Qué habilidades conducen a equipos de agentes?»)
- Encontrar una habilidad por descripción parcial
- Identificar clústeres de habilidades y herramientas relacionadas dentro de un dominio
- Planificar flujos de trabajo de múltiples habilidades y conocer dependencias
- Depuración: entender por qué una habilidad hace referencia a otra

## Cuándo NO usar

- Buscar recursos que no sean habilidades (guías, flujos de trabajo, agentes, reglas)
- Preguntas triviales puntuales
- Preguntas genéricas sobre Claude o LLMs no relacionadas con Claudient

## Instrucciones

### Paso 1 — Solicitar una habilidad o tema

Formule su consulta como una de las siguientes opciones:

- «Encontrar habilidades relacionadas con [tema]» → Devuelve todas las habilidades de esa categoría
- «¿Qué lleva a [nombre de habilidad]?» → Muestra los requisitos previos
- «¿Qué se basa en [nombre de habilidad]?» → Muestra los próximos pasos
- «Muéstrame un camino de aprendizaje para [objetivo]» → Construye una secuencia
- «Necesito una habilidad para [descripción]» → Coincidencia semántica
- «Encontrar habilidades huérfanas» → Lista habilidades sin referencias cruzadas
- «¿Cuáles son las habilidades más centrales?» → Devuelve nodos de alto grado

### Paso 2 — Generar o recuperar el gráfico de dependencias

Ejecute el script del gráfico de dependencias:

```bash
node scripts/dependency-graph.js --json
```

Esto produce una lista de adyacencia: `{ "skill-name": ["ref1", "ref2", ...], ... }`

Para estadísticas:

```bash
node scripts/dependency-graph.js --stats
```

### Paso 3 — Analizar el gráfico para su consulta

#### Para consultas de «habilidades relacionadas»:

1. Encuentre la habilidad en el gráfico por nombre
2. Devuelva todas las habilidades que referencia (bordes salientes)
3. Encuentre todas las habilidades que la referencian (bordes entrantes)
4. Agrupe por categoría para mayor claridad

#### Para consultas de «camino de aprendizaje»:

1. Comience con la habilidad de destino
2. Siga recursivamente bordes entrantes (hasta 3 saltos)
3. Ordene por dependencia: requisitos previos primero, destino al final
4. Incluya descripciones breves

#### Para consultas de «habilidades huérfanas»:

Compare la salida del gráfico JSON con el inventario completo

#### Para consultas de «habilidades más centrales»:

1. Cuente bordes salientes por habilidad
2. Cuente bordes entrantes por habilidad
3. Devuelva los 10–15 principales por centralidad

### Paso 4 — Presentar resultados con contexto

Para cada resultado, proporcione:

1. **Nombre de habilidad** y **descripción**
2. **Ubicación** (por ejemplo, `skills/ai-engineering/`)
3. **Dirección de relación**
4. **Resumen breve** de la relación
5. **Orden de lectura sugerido**

### Paso 5 — Ofrecer exploración interactiva

Si el usuario desea profundizar:
- Visualizar el gráfico completo con la herramienta de visualización D3.js
- Explorar los vecinos de una habilidad específica en detalle
- Comparar patrones de referencia de dos habilidades
- Ejecutar el flujo de trabajo de auditoría completo

---

## Ejemplo

**Consulta del usuario:** «Quiero aprender más sobre flujos de trabajo multiagente. ¿Por dónde empiezo?»

**Resultado:**
```
Camino de aprendizaje para flujos de trabajo multiagente:

1. **session-handoff** — entender cómo los agentes transfieren estado
2. **agent-handoff** — protocolos estructurados para transferencia de agente a agente
3. **agent-tracing** — observar ejecución multiagente
4. Elija uno:
   - **multi-agent-memory** (estado compartido entre agentes)
   - **agent-teams** (grupos de agentes coordinados)

Tiempo de lectura estimado: 20–30 minutos
```

---

## Integración con el Gráfico de Dependencias

Esta habilidad depende de `scripts/dependency-graph.js` y debe invocarse cada vez que un usuario formule una pregunta de descubrimiento. La habilidad hace que el gráfico sea consultable en lenguaje natural.

Para uso programático, consulte la guía en `guides/skill-dependency-graph.md`.
