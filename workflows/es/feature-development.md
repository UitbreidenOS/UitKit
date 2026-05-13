> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../feature-development.md).

# Flujo de Trabajo de Desarrollo de Funcionalidades

Flujo de trabajo de extremo a extremo para llevar una funcionalidad desde la idea hasta el PR fusionado usando Claude Code.

---

## Cuándo usar este flujo de trabajo
- Construir una nueva funcionalidad que toca más de un archivo
- Implementar una especificación o ticket que necesita ser desglosado antes de codificar
- Cualquier funcionalidad donde quieras un proceso estructurado y revisable

---

## Paso 1 — Definir y validar el alcance

Antes de escribir código, establece exactamente qué estás construyendo.

**Prompt para Claude:**
```
I need to build: [describe the feature in one paragraph]

Read the relevant files first:
- [list key files: routes, models, services]
- CLAUDE.md and CONTEXT.md if present

Then tell me:
1. What files will need to change?
2. What new files will be created?
3. What are the edge cases I should handle?
4. What decisions do I need to make before we start?
5. Are there any risks or dependencies I'm missing?

Do not write code yet.
```

**Qué buscar en la respuesta:**
- Archivos que no habías considerado
- Casos límite que causarían bugs si se pasan por alto
- Decisiones que deberían ir en CLAUDE.md una vez tomadas

---

## Paso 2 — Planificar la implementación

Una vez que el alcance es claro, obtén un plan secuenciado.

**Prompt para Claude:**
```
Based on the scope we just defined, create a numbered implementation plan.

Each step must be:
- A concrete, bounded action (not "implement auth" — "add JWT validation middleware to src/middleware/auth.ts")
- Completable in a single session
- Independently testable

Include which files change in each step. Note dependencies between steps.
```

Revisa el plan. Si un paso es demasiado grande, pide a Claude que lo desglose más. Bloquea el plan antes de tocar el código.

---

## Paso 3 — Implementar paso a paso

Ejecuta un paso del plan a la vez. No te saltes pasos.

**Para cada paso:**
```
Implement step [N]: [paste the step description]

Rules:
- Only change what's needed for this step
- Write or update tests for this step's behavior
- Do not refactor code outside the scope of this step
- Tell me when this step is complete and what to verify
```

**Después de cada paso:**
- Ejecuta las pruebas: confirma que están en verde antes de pasar al siguiente paso
- Revisa el diff tú mismo: ¿es esto lo que pretendías?
- Si un paso revela nueva complejidad, actualiza el plan antes de continuar

---

## Paso 4 — Verificación de integración

Una vez que todos los pasos estén completos, verifica que la funcionalidad completa funcione de extremo a extremo.

**Prompt para Claude:**
```
All implementation steps are complete. Now:

1. Run the full test suite — report any failures
2. Check that all edge cases from Step 1 are handled — list each one and confirm
3. Check for any TODOs or incomplete error handling introduced during implementation
4. Verify the feature works with [specific test scenario relevant to this feature]
```

Soluciona cualquier problema encontrado antes de continuar.

---

## Paso 5 — Auto-revisión

Antes de crear un PR, revisa tus propios cambios.

**Prompt para Claude:**
```
Review the changes on this branch against main.

Focus on:
1. CRITICAL issues (bugs, security, data loss risks)
2. Missing tests for changed behavior
3. Convention violations vs this project's CLAUDE.md
4. Anything that would confuse a reader in 6 months

Format: CRITICAL / SUGGESTED / NITPICK
```

Corrige todos los problemas CRITICAL. Usa el juicio en los elementos SUGGESTED.

---

## Paso 6 — Descripción del PR

**Prompt para Claude:**
```
Write a PR description for these changes.

Include:
- What this PR does (one paragraph)
- Why it's needed (the problem it solves)
- How to test it (specific steps a reviewer can follow)
- Any decisions made and why (reference CLAUDE.md or ADRs if relevant)
- Screenshots or output if applicable

Do not include a list of files changed — the diff covers that.
```

---

## Lista de verificación antes de hacer merge

- [ ] Todas las pruebas pasan
- [ ] Auto-revisión completa, sin problemas CRITICAL
- [ ] Todos los casos límite del Paso 1 están manejados
- [ ] Descripción del PR escrita
- [ ] CLAUDE.md actualizado si se tomaron nuevas decisiones
- [ ] CONTEXT.md actualizado si se introdujeron nuevos términos del dominio

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores. [uitbreiden.com](https://uitbreiden.com/)
