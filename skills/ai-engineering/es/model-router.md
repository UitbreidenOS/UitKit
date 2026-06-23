---
name: model-router
updated: 2026-06-23
---

# Model Router — Enrutamiento de Mezcla de Expertos

## When to activate

- El usuario pregunta qué modelo de Claude usar para una tarea ("¿Debo usar Opus o Haiku?")
- Optimizar costos enrutando al tier de modelo más barato y capaz
- Construir un flujo de trabajo multi-agente y asignar tiers de modelo a subtareas
- El usuario menciona "MoE", "model routing", "tier selection", "optimización de costos", "selección inteligente de modelos"
- Depuración de un flujo de trabajo donde se seleccionó el modelo incorrecto para una tarea
- Comprender los límites de capacidad de Haiku/Sonnet/Opus y cuándo cambiar entre ellos
- La sesión tiene restricciones de presupuesto de tokens y necesita enrutamiento dinámico

## When NOT to use

- El modelo ya está especificado explícitamente por el usuario (no se requiere enrutamiento)
- Conversación interactiva única y corta donde el overhead supera el beneficio
- La tarea es claramente solo Opus (revisión de arquitectura de seguridad, modelado de amenazas) — omitir enrutamiento
- La calidad es la única preocupación y el costo es ilimitado — por defecto a Opus
- El usuario hace preguntas generales sobre las capacidades de Claude (no enrutamiento específico de tareas)

## Instructions

### Routing Mode 1: Tier Router (Task Classification)

Analiza el texto de la tarea en busca de señales de complejidad — palabras clave, número de palabras, pistas de dominio.

**Lógica de asignación de tier:**
- **Tier Opus** activado por palabras clave: architect, architecture, security, threat, exploit, vulnerability, design system, reasoning, planning, explore, critique, ambiguous, tradeoff, evaluate options, decide, strategy, complex decision, deep dive, analysis
- **Tier Haiku** activado por palabras clave: format, lint, rename, translate, classify, extract, boilerplate, generate stub, template, sort, list, summarize short, count, convert, reformat, cleanup, validation, parsing, simple task
- **Tier Sonnet** es el fallback predeterminado para trabajo de propósito general (codificación, refactorización, escritura, orquestación)

**Puntuación de confianza**: Mayor confianza (0.7+) cuando coinciden múltiples palabras clave. Menor confianza (0.4) cuando la descripción de la tarea es vaga o muy breve.

**Cuándo usar**: Selección de tier rápida y automática cuando necesita enrutar inmediatamente sin razonamiento complejo.

### Routing Mode 2: Cascade Escalator (Progressive Refinement)

Comienza con el modelo más barato y capaz, escala a tiers más altos solo cuando la confianza es insuficiente.

**Flujo:**
1. La clasificación inicial produce un tier + puntuación de confianza
2. Si confianza < umbral (predeterminado 0.65), escalar un tier hacia arriba (Haiku → Sonnet → Opus)
3. Detener en Opus o cuando se alcance el umbral de confianza
4. Las escaladas máximas por defecto a 2 (previene escalada sin control)

**Cuándo usar**: Límites de tareas inciertos donde preferiría comenzar barato y escalar según sea necesario. Equilibra costo con seguridad.

**Configuración:**
- `--confidence-threshold`: Reclasificar en tier más alto si está por debajo de esto (predeterminado 0.65)
- Escaladas máximas limitadas a 2

### Routing Mode 3: Parallel Expert Panel (Multi-Model Voting)

Ejecuta el mismo aviso de tarea contra los 3 tiers de modelo simultáneamente, agrega resultados mediante votación.

**Estrategias de votación:**
- **Majority**: El tier elegido por la mayoría de expertos gana (p. ej., 2/3 votan por Sonnet)
- **Confidence-weighted**: Puntuar cada tier por confianza promedio; el tier con mayor confianza gana
- **Synthesis**: Devolver los 3 resultados a un modelo juez externo (Sonnet) para sintetizar consenso

**Cuándo usar**: Decisiones críticas (diseños de seguridad, opciones de arquitectura) donde desea consenso de fuerzas de modelo diversas. Cuesta 3x más tokens al principio pero reduce riesgo de escalada/reintento.

### Routing Mode 4: Domain Expert Router (Path-Based Routing)

Enruta por rutas de archivo y dominio de tarea, sin inspeccionar profundamente el texto de la tarea.

**Reglas de dominio** (comprobadas en orden de prioridad):
| Patrón de ruta | Dominio | Tier | Razonamiento |
|---|---|---|---|
| `security/`, `auth`, `credentials`, `secrets`, `cors` | Security | **Opus** | Altas apuestas, adyacente a exploits |
| `architecture/`, `.yaml`, `.yml`, `.tf` | Infra/Arquitectura | **Opus** | Decisiones de diseño de sistemas |
| `data/`, `ml/`, `.py` | Data/ML | **Sonnet** | Complejo pero no arquitectónico |
| `.ts`, `.tsx`, `.js`, `.jsx` | Código fuente | **Sonnet** | Trabajo de codificación, razonamiento equilibrado |
| `.md`, `.txt` | Documentación | **Haiku** | Solo formateo de texto |
| (sin rutas proporcionadas) | Task classification | Per Tier Router | Vuelve al análisis de palabras clave |

**Cuándo usar**: Bases de código con estructura de dominio clara. Enrutamiento automático sin cero overhead de inspección. Ideal para pipelines de alto volumen.

### Routing Mode 5: Budget Governor (Token Ratio Thresholds)

Enruta dinámicamente basado en el presupuesto de tokens restante como porcentaje del presupuesto de sesión total.

**Umbrales:**
- Si `remaining / total < 15%`: Force Haiku (modo de conservación; preservar tokens para tareas críticas)
- Si `remaining / total >= 50%` Y la tarea se clasifica como Opus: Usar Opus (presupuesto permisivo)
- De lo contrario: Usar clasificación del Tier Router

**Umbrales de proporción de presupuesto:**
- Por debajo del 15%: "presupuesto crítico" → Solo Haiku
- 15–50%: "presupuesto moderado" → Sonnet o Haiku
- 50%+: "presupuesto saludable" → Cualquier tier permitido

**Cuándo usar**: Sesiones de larga duración con límites de tokens fijos. Asegura que no se quede sin tokens a mitad de sesión mediante degradación automática de complejidad bajo presión presupuestaria.

**Configuración:**
- `totalBudget`: Presupuesto de tokens de sesión (predeterminado 100000)
- `opusThreshold`: Usar Opus solo si >= 50% permanece (predeterminado 0.5)
- `haikuThreshold`: Force Haiku si < 15% permanece (predeterminado 0.15)

### Using the CLI

**Clasificar una tarea:**
```bash
claudient moe classify "Format the JSON output"
# → Tier: HAIKU, Confidence: 85%, Reasoning: 2 haiku keywords detected
```

**Mostrar ruta de escalada:**
```bash
claudient moe cascade "Design a distributed system" --confidence-threshold=0.7
# → Original Tier: SONNET, Escalations: 1, Final Tier: OPUS
```

**Obtener voto del panel de expertos:**
```bash
claudient moe panel "Review this code" --strategy=majority
# Muestra opiniones de Haiku, Sonnet, Opus + consenso de votación
```

**Enrutar por dominio de archivo:**
```bash
claudient moe domain "src/security/auth.ts,src/security/jwt.ts" "security audit"
# → Domain: security, Routed Tier: OPUS
```

**Enrutamiento consciente del presupuesto:**
```bash
claudient moe budget "write unit tests" --remaining 25000 --total 100000
# → Budget Ratio: 25%, Routed Tier: SONNET
```

**Estado del sistema:**
```bash
claudient moe status
# Imprime modos de enrutamiento activos, umbrales, costos de tier
```

### Programmatic Usage

```javascript
import MoeRouter, { classifyTask, routeByDomain, budgetGovernedRouter } from './lib/moe-router.js';

// Tier Router
const result = classifyTask('Design a microservices architecture');
console.log(result.tier, result.confidence);  // claude-opus-4-7, 0.85

// Domain Router
const domainRoute = routeByDomain(['src/security/auth.ts'], 'refactor');
console.log(domainRoute.tier);  // claude-opus-4-7

// Budget Governor
const governor = budgetGovernedRouter({ totalBudget: 50000 });
const budgetRoute = governor.route('write tests', 7500);  // 15% remaining
console.log(budgetRoute.tier);  // claude-haiku-4-5 (forced)
```

## Example

**Escenario**: La tarea es "Refactor the authentication module in `src/security/auth.ts`". La sesión tiene 60.000 tokens restantes de 100.000 en total.

**Tier Router analiza:** La palabra clave "refactor" sugiere Sonnet → confianza 0.62

**Domain Router comprueba:** La ruta de archivo contiene "security/" → candidato Opus → confianza alta

**Budget Governor ve:** 60% de presupuesto restante >= umbral 50% → Opus permitido

**Decisión:** La señal de dominio anula la señal de tier. Los archivos de seguridad siempre se enrutan a Opus para máximo escrutinio.

**Selección final:** `claude-opus-4-7`

**Comando CLI:**
```bash
claudient moe domain "src/security/auth.ts" "Refactor the authentication module"
# → Detected Domain: security
# → Routed Tier: OPUS
# → Reasoning: security-sensitive file detected
```

**Impacto presupuestario:** Con 60% de presupuesto restante, esta tarea Opus es aceptable. Si el presupuesto hubiera sido 12% restante, Budget Governor habría forzado Haiku a pesar del dominio de seguridad (modo de conservación).

---

## Tier Reference

| Modelo | Costo | Velocidad | Razonamiento | Cuándo usar |
|---|---|---|---|---|
| **Haiku** | 1x | Más rápido | Razonamiento limitado | Formateo, clasificación, templating, boilerplate, extracción simple |
| **Sonnet** | 12x | Rápido | Buen razonamiento | Codificación general, refactorización, documentación, orquestación, revisiones |
| **Opus** | 300x | Moderado | Razonamiento profundo | Arquitectura, seguridad, decisiones ambiguas, modelado de amenazas, planificación compleja |

**Nota de costo**: Elegir Haiku en lugar de Opus ahorra ~300x en tokens para tareas simples. Cascade Escalator evita pagar en exceso por trabajo fácil mientras protege contra subespecificación de problemas difíciles.
