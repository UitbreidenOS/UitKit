# Agent de Triage PR

## Ce qu'il fait

S'active immédiatement lorsqu'une nouvelle demande de fusion est ouverte dans le dépôt. Lit le diff de la PR, le titre, la description et les problèmes liés, puis : applique les étiquettes appropriées, écrit un commentaire structuré sur la PR, signale toute zone à risque (modifications rompantes, tests manquants, diff volumineux, touches chemins sensibles), et demande les relecteurs en fonction de la propriété des fichiers (CODEOWNERS ou un mappage configuré). L'objectif est d'éliminer les frais généraux manuels du triage initial des PR.

## Déclencheur (horaire / événement GitHub / API)

- Type : événement GitHub
- Événement : `pull_request.opened`
- S'active aussi sur : `pull_request.ready_for_review` (lorsqu'une PR brouillon est marquée comme prête)
- Ne s'active pas sur : les PR brouillon en cours de poussée (seulement lorsqu'explicitement marquées comme prêtes)

## Configuration

1. Créez une application GitHub ou un jeton à grain fin avec ces autorisations :
   - Demandes de fusion : lecture et écriture (pour publier des commentaires et appliquer des étiquettes)
   - Problèmes : lecture et écriture (pour lire les problèmes liés)
   - Contenus : lecture (pour récupérer le diff et CODEOWNERS)
   - Membres : lecture (pour résoudre les noms d'utilisateur des relecteurs)
2. Assurez-vous que ces étiquettes existent dans le dépôt avant la première exécution (la routine ne les créera pas) :
   `size/XS`, `size/S`, `size/M`, `size/L`, `size/XL`, `risk/breaking`, `risk/security`, `risk/db-migration`, `type/feature`, `type/fix`, `type/chore`, `type/docs`, `needs-tests`
3. Ajoutez un fichier `CODEOWNERS` ou un mappage `routines/pr-triage-owners.json` qui mappe les chemins aux noms d'utilisateur GitHub.
4. Définissez les variables d'environnement :
   ```
   GITHUB_TOKEN=ghp_...
   GITHUB_REPO=owner/repo
   ```
5. Enregistrez cette routine et liez-la aux événements webhook `pull_request.opened` et `pull_request.ready_for_review`.

## Le prompt de la routine (le prompt exact que l'agent planifié exécute)

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

## Résultats et notifications

- Commentaire GitHub PR : résumé du triage structuré publié en tant que premier commentaire
- Étiquettes GitHub : appliquées immédiatement après la publication du commentaire
- Demande de relecteur GitHub : envoyée à jusqu'à 3 propriétaires
- Journal : étiquettes appliquées, relecteurs demandés, codes d'état HTTP pour chaque appel API
- En cas d'échec : si un appel API échoue, enregistrez l'erreur avec le numéro de PR et la charge utile — n'appliquez pas partiellement (tentez toutes les opérations, enregistrez tous les échecs)

## Exemple d'exécution

**Déclencheur :** PR #312 ouverte — « feat: add Stripe webhook endpoint » par `@jsmith`

**Statistiques de diff :** 6 fichiers modifiés, 287 lignes ajoutées, 14 supprimées

**Analyse :**
- Taille : M (301 lignes au total)
- Type : type/feature (préfixe feat:, nouveau fichier de route ajouté)
- Risque : risk/security (touche `middleware/auth.ts`)
- Tests : needs-tests (nouveau gestionnaire ajouté, aucun fichier `*.test.ts` dans le diff)
- Relecteurs : `@alice` (propriétaire de `src/payments/`), `@bob` (propriétaire de `middleware/`)

**Étiquettes appliquées :** `size/M`, `type/feature`, `risk/security`, `needs-tests`

**Commentaire publié :**

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
