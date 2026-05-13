> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../debugging-session.md).

# Flujo de Trabajo de Sesión de Depuración

Flujo de trabajo sistemático para diagnosticar y corregir bugs con Claude Code — sin perseguir síntomas.

---

## Cuándo usar este flujo de trabajo
- Un bug que no es inmediatamente obvio al leer el código
- Una prueba fallida donde la causa no está clara
- Error de producción que no puedes reproducir localmente
- Fallos intermitentes

---

## Paso 1 — Construye un ciclo de retroalimentación primero

Antes de investigar, crea una forma de reproducir el bug de forma fiable. No te saltes esto.

**Prompt para Claude:**
```
I have a bug: [describe the symptom exactly — error message, unexpected behavior, what you expected]

Before we investigate, help me build a reliable way to reproduce it.

Options to consider:
- A failing test that captures the bug
- A curl command or script that triggers it
- A minimal code snippet that demonstrates it
- Steps to reproduce via the UI

Which is most appropriate here, and write it now.
```

**No procedas hasta tener una reproducción fiable.** Depurar sin una reproducción es adivinar.

---

## Paso 2 — Aísla el radio de explosión

Entiende dónde puede estar el bug antes de leer cualquier código.

**Prompt para Claude:**
```
Here is the reproduction: [paste the reproduction from Step 1]

Without looking at code yet, answer:
1. What is the earliest point in the call stack where this could go wrong?
2. What external systems are involved (DB, cache, third-party API, queue)?
3. What changed recently that could have introduced this? (check git log)
4. What is the smallest unit of code that, if wrong, would cause this symptom?

List the files most likely to contain the bug, ranked by probability.
```

---

## Paso 3 — Genera hipótesis

**Prompt para Claude:**
```
Based on the reproduction and the candidate files, generate 3–5 falsifiable hypotheses.

For each hypothesis:
- State it as a specific claim: "The bug occurs because [X] when [Y]"
- Describe how to test it: what would we observe if this hypothesis is true?
- Describe how to disprove it: what would we observe if it's false?

Do not start testing yet. List all hypotheses first.
```

Revisa las hipótesis. Agrega cualquiera que hayas pensado y que Claude haya omitido. Ordénalas por probabilidad.

---

## Paso 4 — Prueba las hipótesis, empezando por la de mayor probabilidad

**Para cada hipótesis:**
```
Test hypothesis [N]: "[paste the hypothesis]"

Add the minimal instrumentation needed to confirm or rule this out:
- A log statement at the right point
- A debug assertion
- A targeted test with a specific input

Do not add instrumentation for other hypotheses yet.
```

Después de cada prueba:
- Si se confirma: pasa al Paso 5
- Si se descarta: pasa a la siguiente hipótesis
- Si es inconclusa: refina la hipótesis y vuelve a probar

---

## Paso 5 — Corrige y verifica

Una vez confirmada la causa raíz:

**Prompt para Claude:**
```
Root cause confirmed: [describe what you found]

Now:
1. Apply the minimal fix — change only what's needed to fix this specific bug
2. Do not refactor surrounding code
3. Update the reproduction from Step 1 to be a regression test
4. Run the full test suite — confirm nothing else broke

Explain in one sentence why this fix works.
```

---

## Paso 6 — Post-mortem (para bugs graves)

Para bugs que causaron impacto en usuarios, pérdida de datos, o tardaron más de 2 horas en encontrarse:

**Prompt para Claude:**
```
Write a brief post-mortem for this bug:

1. What was the bug? (one sentence)
2. What was the root cause?
3. How long did it take to find and why?
4. What would have caught this earlier? (missing test, missing monitoring, code review gap)
5. What should we add/change to prevent this class of bug?

Keep it under 200 words. No blame, no fluff.
```

---

## Anti-patrones a evitar

- **Corregir el síntoma, no la causa** — si no entiendes el por qué, no lo has corregido
- **Cambiar múltiples cosas a la vez** — no sabrás qué cambio lo corrigió
- **Depurar sin una reproducción** — estás adivinando
- **Agregar instrumentación en todas partes** — apunta a hipótesis específicas
- **Saltarse la prueba de regresión** — el bug volverá

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores. [uitbreiden.com](https://uitbreiden.com/)
