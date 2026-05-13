> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../refactor-safely.md).

# Flujo de Trabajo de Refactoring Seguro

Cómo refactorizar código con Claude Code sin romper el comportamiento — usando las pruebas como red de seguridad en todo momento.

---

## Cuándo usar este flujo de trabajo
- Extraer funciones de un método grande
- Renombrar y reorganizar módulos
- Reemplazar un patrón con uno mejor en múltiples archivos
- Reducir la duplicación en el codebase
- Mejorar la estructura de un módulo sin cambiar su comportamiento externo

---

## La regla de oro

**Nunca refactorices y cambies el comportamiento en el mismo commit.** Un refactoring preserva el comportamiento externo. Si las pruebas fallan, o cambiaste el comportamiento o las pruebas estaban probando detalles de implementación (también es un problema).

---

## Paso 1 — Establece una línea base de pruebas

Antes de cambiar cualquier cosa, confirma que tienes cobertura de pruebas adecuada.

**Prompt para Claude:**
```
I want to refactor: [describe what you're refactoring and why]

First, assess the current test coverage:
1. Read the relevant files: [list files]
2. What behaviors are currently tested?
3. What behaviors are NOT tested that could break during refactoring?
4. Write any missing tests now, before we touch production code

Do not change production code yet. Tests only.
```

**Haz commit de las adiciones de pruebas antes de refactorizar.** Esto deja claro qué pruebas existían antes vs. las que se agregaron como parte del refactoring.

---

## Paso 2 — Define el alcance del refactoring

**Prompt para Claude:**
```
Here is what I want to refactor: [describe the goal]

Read the relevant files: [list files]

Define the scope:
1. What will change structurally? (function signatures, file locations, module boundaries)
2. What will NOT change? (external behavior, API contracts, database schema)
3. What are the riskiest parts of this refactor?
4. What is the smallest first step that makes progress without risk?

Do not start the refactor yet.
```

---

## Paso 3 — Refactoriza en incrementos pequeños y verificables

Divide el refactoring en pasos lo suficientemente pequeños como para que las pruebas puedan verificar cada uno.

**Para cada incremento:**
```
Refactor step [N]: [describe the specific structural change]

Rules:
- Change only what's needed for this step
- Do not change any behavior
- After this change, all existing tests must still pass
- Tell me what to verify after this step
```

**Después de cada incremento:**
```bash
# Ejecuta las pruebas — deben estar en verde antes del siguiente paso
npm test  # o pytest, go test, etc.
```

Si las pruebas fallan después de un cambio puramente estructural: detente, entiende por qué, corrige antes de continuar. Una prueba que falla después de un refactoring significa que o el refactoring cambió el comportamiento o la prueba estaba probando la implementación (ambos son problemas a corregir ahora).

---

## Paso 4 — Verifica que el comportamiento externo no cambió

Después de todos los incrementos:

**Prompt para Claude:**
```
The refactor is structurally complete. Verify that external behavior is unchanged:

1. Run the full test suite
2. Check that all public APIs/interfaces are identical to before (same inputs, same outputs)
3. Check that database queries produce identical results
4. Check that error cases still produce the same errors
5. If there are integration tests or end-to-end tests, run them

Report any behavioral differences — even small ones.
```

---

## Paso 5 — Limpieza

**Prompt para Claude:**
```
Before committing, clean up:

1. Remove any debugging code or temporary comments added during refactoring
2. Remove any dead code that the refactor made unreachable
3. Update any documentation or comments that referenced the old structure
4. Check that import paths are clean (no unused imports)

Do not introduce new logic in this step.
```

---

## Paso 6 — Commit con un mensaje claro

Estructura los commits del refactoring para contar una historia clara:

```
refactor: extract payment processing into PaymentService

Moves payment logic out of OrderController into a dedicated service.
No behavior change — all existing tests pass.
Motivation: OrderController was 600 lines; this makes both units testable in isolation.
```

Nunca mezcles un commit de refactoring con un commit de funcionalidad o corrección de bug. Mantenlos separados.

---

## Anti-patrones de refactoring

- **"Ya que estoy aquí..."** — hacer un refactoring y una funcionalidad al mismo tiempo. Detente. Termina el refactoring primero.
- **Refactorizar sin pruebas** — romperás algo y no lo sabrás
- **Refactoring big-bang** — cambiar todo a la vez. Hazlo de forma incremental.
- **Renombrar como último paso** — renombra primero (mecánico, bajo riesgo), luego reestructura
- **Saltarse la línea base** — asumir que las pruebas son adecuadas sin verificar primero

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores. [uitbreiden.com](https://uitbreiden.com/)
