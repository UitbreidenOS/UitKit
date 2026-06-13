---
name: batch
description: "Parallel agent orchestration: decompose large tasks into independent units, spawn background agents in worktrees, each opens a PR"
---

> 🇪🇸 Versión en español. [Versión en inglés](../batch.md).

# Habilidad: Batch (Procesamiento por lotes)

## Cuándo activar
- Aplicar el mismo cambio en 10+ archivos (renombrar, refactoring, migración)
- Ejecutar una auditoría grande de la base de código (escaneo de seguridad, verificación de dependencias, cobertura de tests)
- Generar boilerplate para muchos módulos en paralelo
- Cualquier tarea donde el trabajo puede dividirse en unidades independientes y no superpuestas

## Cuándo NO usar
- Tareas con dependencias secuenciales (el paso B requiere la salida del paso A)
- Cambios en un solo archivo o un pequeño número de archivos relacionados
- Tareas que requieren contexto compartido entre todas las unidades (use un solo agente en su lugar)
- Cuando necesita revisar y aprobar cada cambio antes de que comience el siguiente

## Instrucciones

### El patrón batch

El Claude Code estándar funciona secuencialmente: una tarea → un agente → una sesión. El modo batch divide una tarea grande en N unidades independientes y las procesa en paralelo — cada unidad se ejecuta como un agente de fondo separado en un worktree git aislado, realiza sus cambios y abre un PR.

```
Tarea grande
    │
    ├── Unidad 1 → worktree-1 → branch-1 → PR #1
    ├── Unidad 2 → worktree-2 → branch-2 → PR #2
    ├── Unidad 3 → worktree-3 → branch-3 → PR #3
    └── Unidad N → worktree-N → branch-N → PR #N
```

### Prompt de activación

```
/batch

Task: [describe the full task]
Files/scope: [list files or glob patterns, or describe the scope]
```

Claude hará:
1. **Fase de investigación** — leer la base de código para entender los patrones y el alcance
2. **Descomposición** — dividir la tarea en 5–30 unidades independientes
3. **Revisión del plan** — presentar el desglose y esperar su aprobación
4. **Ejecución** — iniciar un agente de fondo por unidad en un worktree aislado
5. **PRs** — cada agente confirma sus cambios y abre un PR contra main

### Reglas de descomposición que sigue Claude
- Cada unidad debe ser **independiente** — sin estado compartido, sin dependencias entre unidades
- Cada unidad debe ser **completable en una sesión de agente** (~15–30 min de trabajo)
- Cada unidad debe tener un **criterio de éxito claro** (los tests pasan, el lint pasa)
- Las unidades se dimensionan para ser **revisables en un PR** (preferir PRs pequeños sobre grandes)

### Buenas tareas para batch

```bash
# Renombrar una función usada en toda la base de código
/batch
Task: Rename `getUserById` to `findUserById` everywhere it's used.
Scope: src/**/*.ts, tests/**/*.ts

# Añadir anotaciones de tipo a todos los módulos Python
/batch
Task: Add full type annotations (PEP 484) to all functions in the services layer.
Scope: src/services/*.py

# Migrar llamadas API al nuevo SDK
/batch
Task: Migrate all uses of the old `stripe.charges.create()` to `stripe.paymentIntents.create()`.
Scope: src/billing/**

# Auditoría de seguridad
/batch
Task: Audit every endpoint handler for missing authentication middleware.
Scope: routes/**/*.ts
Report findings per file — do not make changes.
```

### Monitorear el progreso

Mientras los agentes se ejecutan en segundo plano, monitoree con:
```bash
# Verificar el estado del worktree
git worktree list

# Verificar los PRs abiertos
gh pr list --label batch

# Ver qué agentes siguen ejecutándose
claude agents
```

### Fusionar los resultados

Una vez que los PRs estén abiertos:
1. Revisar cada PR de forma independiente — son pequeños por diseño
2. Fusionar en cualquier orden (son independientes)
3. Limpiar los worktrees después de que todos los PRs estén fusionados:
```bash
git worktree prune
```

### Cuando una unidad falla

Si el PR de un agente no pasa las pruebas:
- Los demás agentes continúan — los fallos no se propagan en cascada
- Revisar el PR que falla, corregir manualmente o volver a ejecutar esa unidad
- Usar `git worktree remove worktree-N` para limpiar y reiniciar

## Ejemplo

**Tarea:** Añadir comentarios JSDoc a todas las funciones exportadas en una biblioteca TypeScript de 40 archivos.

**Descomposición de Claude:**
```
Unit 1: src/auth/*.ts (6 files, ~15 functions)
Unit 2: src/billing/*.ts (5 files, ~12 functions)
Unit 3: src/api/users/*.ts (4 files, ~18 functions)
...
Unit 8: src/utils/*.ts (3 files, ~8 functions)
```

**Tras la aprobación:** 8 agentes de fondo arrancan en paralelo. Cada uno abre un PR con el título `docs(jsdoc): add JSDoc to [module name]`. Tiempo total: ~20 minutos en lugar de ~2,5 horas en secuencial.

---
