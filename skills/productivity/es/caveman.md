> 🇪🇸 Versión en español. [Versión en inglés](../caveman.md).

# Skill Modo Caveman

## Cuándo activar
- Quieres reducir drásticamente el uso de tokens en una sesión larga
- La ventana de contexto se está llenando y necesitas extender la vida útil de la sesión
- Estás ejecutando una carga de trabajo sensible al costo (muchos agentes en paralelo, procesamiento por lotes)
- Las respuestas de Claude son verbosas y quieres una salida concisa, estilo fragmento
- Quieres comprimir archivos de memoria o CLAUDE.md existentes para reducir los tokens de entrada

## Cuándo NO usar
- Advertencias de seguridad o confirmaciones de acciones irreversibles — estas necesitan oraciones completas
- Secuencias de varios pasos donde la ambigüedad de fragmentos podría causar lecturas erróneas
- Incorporación de nuevos miembros del equipo a una base de código — la claridad supera a la brevedad aquí
- Escritura de documentación que leerán personas externas

## Instrucciones

El modo Caveman es una técnica de compresión de tokens consolidada con una implementación dedicada en [github.com/JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman). Este skill es un apuntador — usa el repositorio original, no lo dupliques aquí.

### Qué hace

El modo Caveman instruye a Claude a generar prosa comprimida, estilo fragmento:

| Nivel | Regla | Ejemplo |
|-------|-------|---------|
| `lite` | Elimina relleno y matices, conserva artículos y oraciones completas | "The function handles edge cases." |
| `full` | Elimina artículos, fragmentos permitidos, sinónimos cortos | "func handles edge cases" |
| `ultra` | Abrevia palabras en prosa, elimina conjunciones, flechas para causalidad | "fn→edge cases handled" |

Resultados medidos (marzo 2026, [arxiv.org/abs/2604.00025](https://arxiv.org/abs/2604.00025)):
- ~65% de reducción en tokens de salida
- Mejora de 26 puntos en benchmarks (la brevedad agudiza el razonamiento)
- 100% de precisión técnica mantenida

### Sub-skill caveman-compress
Reescribe archivos de memoria `.md` y CLAUDE.md a prosa caveman — ~46% de ahorro en tokens de entrada en cada sesión, ya que los archivos comprimidos se vuelven a leer en cada carga de contexto.

### Subagentes cavecrew
Subagentes basados en Haiku ejecutándose en modo caveman — ~60% menos tokens que agentes estándar para tareas simples de clasificación, extracción y enrutamiento.

### Middleware MCP caveman-shrink
Comprime las descripciones de herramientas MCP antes de que entren al contexto de Claude — reduce la sobrecarga de MCP en ~30% sin cambiar el comportamiento de las herramientas.

## Ejemplo

**Activar el modo caveman en una sesión:**
```
Use caveman mode (full level) for this session. Drop articles, use fragments,
short synonyms. Auto-revert to normal prose for: security warnings,
irreversible action confirmations, multi-step sequences.
```

**Usar caveman-compress en un archivo de memoria:**
```
/caveman-compress .claude/memory/project-context.md
```

**Usar cavecrew para una tarea de clasificación:**
```
Spawn a cavecrew subagent (Haiku, caveman full) to classify these 200 support
tickets into 5 categories. Return only: ticket_id, category.
```

---

**Referencia:** [github.com/JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) — la implementación caveman de referencia. Claudient hace referencia a este trabajo; no se duplica aquí.

---
