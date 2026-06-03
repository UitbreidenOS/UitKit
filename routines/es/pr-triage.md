# Agente de Clasificación de RP

## Qué hace

Se activa inmediatamente cuando se abre una nueva solicitud de extracción en el repositorio. Lee el diff de RP, el título, la descripción y los problemas vinculados, luego: aplica etiquetas apropiadas, escribe un comentario de resumen estructurado en la RP, marca cualquier área de riesgo (cambios importantes, pruebas faltantes, diff grande, toca rutas sensibles) y solicita revisores en función de la propiedad del archivo (CODEOWNERS o una asignación configurada). El objetivo es eliminar la sobrecarga manual del triaje inicial de RP.

## Activador (horario / evento de GitHub / API)

- Tipo: evento de GitHub
- Evento: `pull_request.opened`
- También se activa en: `pull_request.ready_for_review` (cuando una RP en borrador se marca como lista)
- No se activa en: cambios en RPs en borrador (solo cuando se marca explícitamente como lista)

## Configuración

1. Crea una aplicación de GitHub o un token de grano fino con estos permisos:
   - Solicitudes de extracción: leer y escribir (para publicar comentarios y aplicar etiquetas)
   - Problemas: leer y escribir (para leer problemas vinculados)
   - Contenido: leer (para obtener el diff y CODEOWNERS)
   - Miembros: leer (para resolver nombres de usuario de revisores)
2. Asegúrate de que estas etiquetas existan en el repositorio antes de la primera ejecución (la rutina no las creará):
   `size/XS`, `size/S`, `size/M`, `size/L`, `size/XL`, `risk/breaking`, `risk/security`, `risk/db-migration`, `type/feature`, `type/fix`, `type/chore`, `type/docs`, `needs-tests`
3. Agrega un archivo `CODEOWNERS` o una asignación `routines/pr-triage-owners.json` que mapee rutas a nombres de usuario de GitHub.
4. Establece variables de entorno:
   ```
   GITHUB_TOKEN=ghp_...
   GITHUB_REPO=owner/repo
   ```
5. Registra esta rutina y vincúlala a los eventos webhook `pull_request.opened` y `pull_request.ready_for_review`.

## El indicador de rutina (el indicador exacto que ejecuta el agente programado)

```
You are a pull request triage agent. A new PR has just been opened.

PR context injected at runtime:
- PR number: $PR_NUMBER
- Title: $PR_TITLE
- Body: $PR_BODY
- Author: $PR_AUTHOR
- Base branch: $PR_BASE
- Head branch: $PR_HEAD
- Diff URL: $PR_DIFF_URL
- Files changed: $PR_FILES (JSON array with filename, additions, deletions, patch)
- Linked issue numbers (from body): extracted by parsing "Closes #N" / "Fixes #N" patterns

Steps:

1. SIZE — count total lines changed (additions + deletions across all files).
   Apply exactly one size label:
   XS = <10 lines, S = 10–99, M = 100–299, L = 300–999, XL = 1000+

2. TYPE — infer from the PR title prefix and changed files:
   - feat:/feature → type/feature
   - fix:/bugfix → type/fix
   - chore:/deps/ci/build → type/chore
   - docs/readme/changelog only → type/docs
   If ambiguous, pick the most prominent type.

3. RISK FLAGS — apply risk labels if ANY of the following are true:
   - risk/breaking: title contains "breaking" or "BREAKING CHANGE", or a public API surface file is modified
   - risk/security: files under auth/, middleware/, crypto/, secrets/, or .env patterns are touched
   - risk/db-migration: files ending in .sql or under migrations/ are present in the diff

4. TESTS — if the diff adds functions/classes but no corresponding test files are changed or added, apply the label `needs-tests`.

5. REVIEWERS — load CODEOWNERS or pr-triage-owners.json. For each changed file, find the matching owner. Collect the unique set of owners excluding the PR author. Request review from up to 3 owners (most files owned, descending). Use the GitHub API: POST /repos/{repo}/pulls/{number}/requested_reviewers.

6. COMMENT — post a single structured comment to the PR using the GitHub API. Use this exact template:

---
## PR Triage Summary

**Type:** {type} | **Size:** {size} ({N} lines changed across {F} files)

### What this PR does
{2–4 sentence plain-English summary of the diff — focus on intent, not mechanics}

### Files touched
| File | +/- | Notes |
|------|-----|-------|
{one row per file; flag sensitive paths with a [!] prefix}

### Risk flags
{bulleted list of applied risk labels with one-line explanation each, or "None detected."}

### Linked issues
{comma-separated list of linked issue numbers with their titles, or "None linked."}

### Reviewer assignment
Requested review from: {comma-separated @mentions}

---
*Triaged automatically. Labels and reviewers can be adjusted manually.*

7. Apply all labels collected in steps 1–4 via the GitHub API: POST /repos/{repo}/issues/{number}/labels.

8. Return a summary: "Triaged PR #{number}: labels={labels}, reviewers={reviewers}."
```

## Salidas y notificaciones

- Comentario de RP de GitHub: resumen de triaje estructurado publicado como el primer comentario
- Etiquetas de GitHub: aplicadas inmediatamente después de publicar el comentario
- Solicitud de revisor de GitHub: enviada a hasta 3 propietarios
- Registro: etiquetas aplicadas, revisores solicitados, códigos de estado HTTP para cada llamada de API
- En caso de falla: si alguna llamada de API falla, registra el error con el número de RP y la carga útil — no apliques parcialmente (intenta todas las operaciones, registra todos los errores)

## Ejecución de ejemplo

**Activador:** RP #312 abierta — "feat: add Stripe webhook endpoint" por `@jsmith`

**Estadísticas de diff:** 6 archivos cambiados, 287 líneas añadidas, 14 eliminadas

**Análisis:**
- Tamaño: M (301 líneas totales)
- Tipo: type/feature (prefijo feat:, archivo de ruta nueva agregado)
- Riesgo: risk/security (toca `middleware/auth.ts`)
- Pruebas: needs-tests (controlador nuevo agregado, sin archivos `*.test.ts` en diff)
- Revisores: `@alice` (propietaria de `src/payments/`), `@bob` (propietario de `middleware/`)

**Etiquetas aplicadas:** `size/M`, `type/feature`, `risk/security`, `needs-tests`

**Comentario publicado:**

```
## PR Triage Summary

**Type:** feature | **Size:** M (301 lines changed across 6 files)

### What this PR does
Adds a new POST /webhooks/stripe endpoint that verifies Stripe signatures,
parses event types, and dispatches billing lifecycle events to the internal
event bus. Includes an idempotency check using the Stripe event ID.

### Files touched
| File | +/- | Notes |
|------|-----|-------|
| src/payments/stripe-webhook.ts | +198/-0 | New handler |
| [!] middleware/auth.ts | +12/-3 | Auth bypass for webhook path |
| src/routes/index.ts | +4/-1 | Route registration |
| config/stripe.ts | +31/-0 | Stripe SDK init |
| types/events.ts | +28/-5 | New event types |
| package.json | +14/-5 | Stripe SDK added |

### Risk flags
- **risk/security** — middleware/auth.ts modified; verify the webhook bypass is scoped correctly

### Linked issues
Closes #288 (Stripe webhooks not handled)

### Reviewer assignment
Requested review from: @alice, @bob

---
*Triaged automatically. Labels and reviewers can be adjusted manually.*
```
