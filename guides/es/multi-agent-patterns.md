# Guía de patrones multi-agente

Patrones de diseño para construir sistemas confiables de múltiples agentes con Claude Code.

## Cuándo usar patrones multi-agente

Utilice múltiples agentes cuando:
- Una tarea tiene subtareas genuinamente independientes que pueden ejecutarse en paralelo
- Diferentes subtareas requieren diferentes especialidades o contexto
- La tarea es demasiado grande para caber en una sola ventana de contexto
- Necesita controles redundantes (múltiples agentes revisar la misma salida)
- Diferentes partes de la tarea requieren diferentes niveles de acceso a herramientas

No use múltiples agentes cuando:
- Un único agente puede manejar la tarea — la sobrecarga de orquestación no es gratuita
- Las subtareas tienen dependencias complejas (mejor: indicaciones secuenciales)
- La tarea requiere estado compartido continuo (los agentes no pueden compartir memoria fácilmente)

## Patrón 1: Trabajadores paralelos

**Cuando:** Múltiples tareas independientes del mismo tipo.

```typescript
// Claude Code — generear agentes en paralelo para tareas independientes
// Ejemplo: traducir un archivo de habilidad a 4 idiomas simultáneamente

const translationTasks = ['fr', 'de', 'nl', 'es'].map(lang =>
  Agent({
    description: `Traducir a ${lang}`,
    model: 'haiku',  // usar modelo más pequeño para traducción
    prompt: `Traducir este archivo de habilidad a ${lang}: [contenido]`
  })
)

// Los 4 se ejecutan en paralelo — 4x más rápido que secuencial
const [fr, de, nl, es] = await Promise.all(translationTasks)
```

**Reglas:**
- Cada agente debe ser completamente autosuficiente (todo el contexto en la indicación)
- Ningún agente debe depender de la salida de otro
- Usar modelos más baratos para tareas más simples

## Patrón 2: Tubería (entrega secuencial)

**Cuando:** La salida de cada etapa es la entrada de la siguiente etapa.

```
Agente de investigación → Agente de análisis → Agente de redacción → Agente de revisión
```

```typescript
// Etapa 1: investigación
const research = await Agent({
  prompt: 'Investigue el panorama competitivo para [tema]. Resultados de salida estructurados.'
})

// Etapa 2: análisis (usa salida de etapa 1)
const analysis = await Agent({
  prompt: `Analizar estos hallazgos de investigación e identificar puntos clave estratégicos:
  ${research.output}`
})

// Etapa 3: escribir (usa salida de etapa 2)
const draft = await Agent({
  prompt: `Escribir un memorando estratégico basado en este análisis:
  ${analysis.output}`
})

// Etapa 4: revisar (comprobación independiente)
const reviewed = await Agent({
  prompt: `Revisar este memorando para precisión, claridad y lagunas estratégicas:
  ${draft.output}`
})
```

**Reglas:**
- Cada etapa valida la salida de la etapa anterior antes de continuar
- Incluir criterios de aprobado/reprobado explícitos en cada entrega
- Definir qué hacer si una etapa falla (reintenta, omitir, alerta)

## Patrón 3: Especialista + Generalista

**Cuando:** Una tarea general pero partes específicas requieren experiencia profunda.

```
Agente generalista (coordina)
├── Agente especialista en seguridad (código de autenticación)
├── Agente especialista en rendimiento (consultas de bases de datos)
└── Agente especialista en UX (copiar para el usuario)
```

```typescript
const [securityReview, perfReview, uxReview] = await Promise.all([
  Agent({
    description: 'Revisión de seguridad',
    prompt: `Revisar este código para vulnerabilidades de seguridad. Enfoque: auth, inyección, exposición de datos.
    Código: ${authCode}`
  }),
  Agent({
    description: 'Revisión de rendimiento', 
    prompt: `Revisar estas consultas de base de datos para problemas de rendimiento. Enfoque: N+1, índices faltantes.
    Código: ${dbCode}`
  }),
  Agent({
    description: 'Revisión de UX',
    prompt: `Revisar esta copia para claridad y conversión. Enfoque: texto CTA, mensajes de error.
    Copia: ${uiCopy}`
  })
])

// Sintetizar hallazgos
const synthesis = await Agent({
  prompt: `Combinar estas revisiones de especialistas en una lista de acciones priorizadas:
  Seguridad: ${securityReview}
  Rendimiento: ${perfReview}
  UX: ${uxReview}`
})
```

## Patrón 4: Verificación redundante

**Cuando:** La corrección es crítica y los errores son costosos.

```typescript
// Misma tarea, dos agentes independientes, comparar salidas
const [agent1Result, agent2Result] = await Promise.all([
  Agent({ prompt: reviewPrompt }),
  Agent({ prompt: reviewPrompt })
])

// Comparar acuerdo
if (agent1Result.verdict !== agent2Result.verdict) {
  // Desacuerdo — escalar a humano o usar tercer agente como árbitro
  const tiebreaker = await Agent({
    prompt: `Dos revisores no estuvieron de acuerdo. Reconciliar:
    Revisor 1: ${agent1Result}
    Revisor 2: ${agent2Result}
    Proporcione la conclusión correcta.`
  })
}
```

**Cuando usar:** Revisiones de seguridad, evaluaciones de riesgo legal, cálculos financieros, información médica.

## Patrón 5: Map-Reduce

**Cuando:** Procesar un conjunto de datos grande en paralelo, luego agregar.

```typescript
// Map: procesar cada fragmento independientemente
const chunks = splitIntoChunks(largeDocument, chunkSize)
const chunkResults = await Promise.all(
  chunks.map(chunk => Agent({
    model: 'haiku',
    prompt: `Extraer entidades y reclamos clave de esta sección: ${chunk}`
  }))
)

// Reduce: agregar todos los resultados del fragmento
const finalSummary = await Agent({
  model: 'sonnet',
  prompt: `Sintetizar estos análisis de sección en un resumen unificado:
  ${chunkResults.join('\n\n')}`
})
```

## Mejores prácticas de comunicación de agentes

**Diseñar para la falta de estado:**
- Cada agente recibe todo el contexto que necesita en la indicación
- Los agentes no comparten memoria o estado entre invocaciones
- La salida es el único canal de comunicación entre agentes

**Contratos de salida explícitos:**
```typescript
// Diga a los agentes exactamente qué formato producir
prompt: `
Analizar este código para errores.

Enviar SOLO JSON válido en este formato exacto:
{
  "bugs": [{"severity": "high|medium|low", "description": "string", "line": number}],
  "summary": "string"
}
`

// Luego validar la salida
const result = outputSchema.parse(JSON.parse(agentOutput))
```

**Manejo de errores:**
```typescript
try {
  const result = await Agent({ prompt })
  return parseOutput(result)
} catch (error) {
  // Agente falló — decidir: reintenta, fallback, o escala
  if (isRetryable(error)) {
    return await retryWithBackoff(() => Agent({ prompt }), 3)
  }
  throw new AgentError(`Agente falló para la tarea: ${taskDescription}`, { cause: error })
}
```

## Gestión de costos

- Usar Haiku para extracción, traducción, clasificación (alto volumen, tareas simples)
- Usar Sonnet para razonamiento, escritura, análisis (predeterminado para la mayoría de tareas)
- Usar Opus para decisiones críticas, revisión de código complejo (solo apuestas altas)
- Ejecutar agentes costosos solo una vez — cachear o almacenar sus salidas

---
