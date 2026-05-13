> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../code-review.md).

# Flujo de Trabajo de Revisión de Código

Cómo ejecutar una revisión de código estructurada y automatizada usando Claude Code antes o junto con la revisión humana.

---

## Cuándo usar este flujo de trabajo
- Auto-revisión de tus propios cambios antes de hacer push
- Pre-filtrado de un PR antes de solicitar revisión humana
- Revisión de código generado por IA antes de aceptarlo
- Revisión de incorporación: entender qué cambió en un PR desconocido

---

## Paso 1 — Preparar el contexto

Dale a Claude todo lo que necesita para revisar de forma significativa.

**Prompt para Claude:**
```
I need you to review the following changes.

Project context:
- Stack: [language, framework, key libraries]
- Testing approach: [unit/integration, mocking policy]
- Key conventions: [paste relevant CLAUDE.md sections]

Changed files:
[paste git diff output OR list files and ask Claude to read them]

This PR: [one sentence on what it's supposed to do]
```

---

## Paso 2 — Revisión de corrección

**Prompt para Claude:**
```
Review these changes for correctness only.

Check:
1. Does the code do what the PR description says it does?
2. Are there edge cases not handled? (null inputs, empty collections, concurrent access, large inputs)
3. Are there off-by-one errors, wrong comparisons, or logic inversions?
4. Are error paths handled — can this panic, throw, or silently fail?
5. Are there race conditions if this code runs concurrently?

Format: [FILE:LINE] — [issue description] — [suggested fix]
Only report real issues. Do not nitpick style.
```

---

## Paso 3 — Revisión de seguridad

**Prompt para Claude:**
```
Review these changes for security issues.

Check:
1. Is any user input used in SQL, shell commands, file paths, or HTML without sanitization?
2. Are there missing authentication or authorization checks?
3. Are secrets, tokens, or credentials exposed in logs, errors, or responses?
4. Are there insecure direct object references (IDOR)?
5. Are there missing rate limits on sensitive endpoints?

Severity: CRITICAL / HIGH / MEDIUM / LOW
Format: [SEVERITY] [FILE:LINE] — [vulnerability] — [fix]
```

---

## Paso 4 — Verificación de cobertura de pruebas

**Prompt para Claude:**
```
Review the test coverage for these changes.

Check:
1. Is every new function or method covered by at least one test?
2. Is the happy path tested?
3. Is at least one error/edge case tested?
4. Do the tests actually assert meaningful behavior, or just that the function runs?
5. Are there behaviors changed by this PR that existing tests don't cover?

List: [what is tested] and [what is missing]
```

---

## Paso 5 — Revisión de mantenibilidad

**Prompt para Claude:**
```
Review these changes for maintainability.

Check:
1. Will a developer unfamiliar with this code understand it in 6 months?
2. Are function names and variable names clear and accurate?
3. Is there duplicated logic that should be extracted?
4. Are there magic numbers or strings that should be named constants?
5. Does this introduce unnecessary coupling between modules?

Only flag real maintainability issues — not style preferences.
```

---

## Paso 6 — Consolidar hallazgos

**Prompt para Claude:**
```
Consolidate all findings from the review into a final report.

Format:
## CRITICAL (must fix before merge)
[list]

## HIGH (strongly recommended)
[list]

## SUGGESTED (worth doing)
[list]

## NITPICK (optional)
[list]

## VERDICT
[ ] Approved — no blockers
[ ] Approved with suggestions — merge after addressing CRITICAL
[ ] Changes requested — must address before merge
```

---

## Usar el agente Revisor de Código

Para PRs más grandes, delega al agente Revisor de Código en lugar de ejecutarlo de forma inline:

```
Spawn a Code Reviewer agent (Sonnet 4.6) to review [list of files].
Give it the project context from CLAUDE.md and the PR description.
Have it return a structured CRITICAL/SUGGESTED/NITPICK report.
```

Ver `agents/core/code-reviewer.md` para la definición completa del agente.

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores. [uitbreiden.com](https://uitbreiden.com/)
