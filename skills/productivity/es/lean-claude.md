---
name: lean-claude
description: "Activate token-efficient mode: caveman output, right model selection, MCP discipline, compaction strategy, cavecrew agents — all in one"
---

> 🇪🇸 Versión en español. [Versión en inglés](../lean-claude.md).

# Skill Lean Claude

## Cuándo activar
- Al iniciar cualquier sesión donde el costo o la velocidad importan
- En sesiones largas donde el contexto se está inflando
- Al ejecutar múltiples agents en paralelo o cargas de trabajo por lotes
- Al trabajar con un presupuesto de tokens ajustado
- Antes de una tarea compleja en varios pasos que consumirá mucho contexto

## Cuándo NO usar
- Al escribir documentación externa — la brevedad puede perjudicar la claridad
- Decisiones de seguridad, acciones irreversibles o secuencias de varios pasos donde malinterpretar un fragmento causa daño
- Al incorporar a un nuevo miembro del equipo a una base de código

## Instrucciones

Pegue este prompt de activación al inicio de cualquier sesión para habilitar todas las optimizaciones lean de una vez:

```
Activate lean mode for this session:

OUTPUT: caveman full — drop articles, use fragments, short synonyms.
Auto-revert to full prose for: security warnings, irreversible actions,
multi-step sequences where fragment ambiguity is risky.

MODEL: use Haiku 4.5 for any task where output is constrained and verifiable
(linting, formatting, simple renames, single-function edits, classification).
Stay on Sonnet 4.6 for multi-file reasoning. Only escalate to Opus for deep
architectural decisions or complex security analysis.

CONTEXT: do not read full files when a line range will do. Prefer targeted
reads over whole-file reads. Tell me before reading any file >500 lines.

AGENTS: for repetitive or isolated tasks, spawn a Haiku subagent rather than
doing the work in the main session. Each subagent gets a fresh context window.
```

---

### 1. Selección de modelo — la palanca más importante

| Tarea | Modelo | Ahorro |
|-------|--------|--------|
| Linting, formateo, renombrados simples | Haiku 4.5 | ~60 % vs Sonnet |
| Ediciones de funciones simples, generación de boilerplate | Haiku 4.5 | ~60 % |
| Cambios en múltiples archivos, depuración, revisión de código | Sonnet 4.6 | referencia |
| Decisiones de arquitectura, análisis de seguridad | Opus 4.7 | — (vale la pena) |
| Clasificación, enrutamiento, extracción a escala | Haiku 4.5 | ~60 % |

**Regla:** Usar Sonnet 4.6 por defecto. Cambiar a Haiku cuando la salida sea limitada y verificable. Solo escalar a Opus cuando realmente se necesite razonamiento profundo.

---

### 2. Compresión de salida caveman

Indica a Claude que responda en prosa fragmentada y concisa. Con una medición de ~65 % de reducción de tokens de salida manteniendo el 100 % de precisión técnica.

**Niveles de compresión:**

| Nivel | Regla | Ejemplo |
|-------|-------|---------|
| `lite` | Eliminar relleno, mantener oraciones completas | "The function handles edge cases." |
| `full` (predeterminado) | Eliminar artículos, fragmentos permitidos | "func handles edge cases" |
| `ultra` | Abreviar, eliminar conjunciones, flechas | "fn→edge cases handled" |

**Activar:** añada `caveman full` a su prompt de sesión (ya incluido en el prompt de activación anterior).

**Comprima sus archivos de memoria** — los archivos que Claude relee cada sesión se convierten en tokens de entrada:
```
/caveman-compress .claude/memory/project-context.md
```
~46 % de ahorro en tokens de entrada por sesión en archivos comprimidos. Implementación completa: [github.com/JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)

---

### 3. Disciplina MCP — 30.000 tokens antes de escribir una palabra

Cada servidor MCP habilitado carga todas sus definiciones de herramientas en el contexto al inicio de la sesión. 10 servidores MCP ≈ 80 herramientas ≈ **30.000 tokens consumidos antes de escribir una palabra**.

**Audite sus MCP activos:**
```bash
# Check what's enabled
cat ~/.claude/settings.json | grep -A2 mcpServers
cat .claude/settings.json | grep -A2 mcpServers 2>/dev/null
```

**Deshabilite cualquier servidor que no vaya a usar en esta sesión.** Deshabilitar 5 servidores MCP no utilizados ahorra ~15.000 tokens — más de lo que la mayoría de los archivos CLAUDE.md consumen.

---

### 4. Gestión del contexto

**CLAUDE.md:**
- Mantenga el CLAUDE.md del proyecto por debajo de 300 líneas
- Elimine las reglas que ya no aplican
- Nunca duplicar reglas de nivel de usuario en el CLAUDE.md del proyecto

**Lecturas de archivos:**
- Pida rangos de líneas específicos: "read auth.py lines 45–90" no "read auth.py"
- Evite leer el mismo archivo grande dos veces
- Use subagents para tareas que requieran leer muchos archivos que la sesión principal no necesita

**Compactación — actívela pronto, no al 95 %:**
```
/compact
```
Compacte antes de cambiar a una nueva tarea principal, después de una larga sesión de depuración, o antes de comenzar trabajo que requiera leer muchos archivos grandes. No espere a la compactación automática.

---

### 5. Cavecrew — agents baratos para tareas baratas

Lance subagents basados en Haiku para tareas delimitadas en lugar de consumir contexto de Sonnet:

| Rol | Modelo | Usar para |
|-----|--------|-----------|
| Investigador | Haiku 4.5 | Localizar archivos, buscar en la base de código, tareas de solo lectura |
| Constructor | Sonnet 4.6 | Cambios quirúrgicos en 1–3 archivos |
| Revisor | Haiku 4.5 | Revisar un diff o archivo en busca de problemas |
| Orquestador | Opus 4.7 | Solo coordinación compleja en varios pasos |

**~60 % de ahorro en tokens** vs usar Sonnet para cada subagent. Use Haiku para todo donde la tarea sea limitada y la salida sea verificable.

---

### 6. Eficiencia de prompts

| En lugar de | Use |
|------------|-----|
| "Fix the authentication" | "Fix JWT expiry check in auth/middleware.py:45 — not rejecting expired tokens" |
| Cinco "add a test for X" separados | "Add tests for all five functions in utils.py" |
| "Explain this codebase" | "Explain how auth flows from login to session creation, max 3 paragraphs" |
| Larga ida y vuelta | Agrupar tareas relacionadas en un solo prompt |

Prompts vagos → exploración → más llamadas a herramientas → más contexto consumido.
Prompts específicos → respuestas enfocadas → menos tokens.

---

### 7. Seguimiento del costo de sesión

Use el hook `cost-tracker` para ver el uso de tokens por llamada a herramienta:
```bash
npx claudient add hooks
# Then add hooks/lifecycle/cost-tracker.sh to .claude/settings.json
```

Le proporciona un registro continuo de tokens de entrada/salida + costo estimado por sesión. Úselo para identificar qué tareas consumen más — luego optimice esas primero.

---

## Tarjeta de referencia rápida

| Situación | Acción |
|-----------|--------|
| Inicio de cualquier sesión | Pegar el prompt de activación anterior |
| Edición simple, lint, formateo | Cambiar a Haiku 4.5 |
| Los archivos de memoria son grandes | Ejecutar caveman-compress sobre ellos |
| El contexto se está volviendo lento | `/compact` ahora, no espere |
| MCP no utilizados habilitados | Deshabilitarlos en settings.json |
| Tarea repetitiva en varios archivos | Subagent de Haiku, no la sesión principal |
| Solicitud vaga, respuesta larga | Reescribir como prompt específico y delimitado |
| Decisión de arquitectura / seguridad | Escalar a Opus — vale la pena el costo |

---
