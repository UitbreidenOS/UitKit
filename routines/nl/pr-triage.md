# PR Triage Agent

## What it does

Wordt onmiddellijk geactiveerd wanneer een nieuwe pull request in de repository wordt geopend. Leest de PR diff, titel, beschrijving en gekoppelde issues, en voert vervolgens het volgende uit: past passende labels toe, schrijft een gestructureerde samenvattingsopmerking op de PR, vlaggt risicogebieden (brekende wijzigingen, ontbrekende tests, grote diff, aanraaking van gevoelige paden) en vraagt reviewers aan op basis van bestandseigenaarschap (CODEOWNERS of een geconfigureerde toewijzing). Het doel is om de handmatige overhead van initiële PR triage te elimineren.

## Trigger (schedule / GitHub event / API)

- Type: GitHub event
- Event: `pull_request.opened`
- Wordt ook geactiveerd door: `pull_request.ready_for_review` (wanneer een concept PR als gereed wordt gemarkeerd)
- Wordt niet geactiveerd door: concept PRs waaraan wordt gewerkt (alleen wanneer expliciet als gereed wordt gemarkeerd)

## Setup

1. Maak een GitHub App of fijnmazig token aan met deze machtigingen:
   - Pull requests: lezen en schrijven (om opmerkingen te plaatsen en labels toe te passen)
   - Issues: lezen en schrijven (om gekoppelde issues te lezen)
   - Contents: lezen (om de diff en CODEOWNERS op te halen)
   - Members: lezen (om revieuwernamen op te lossen)
2. Zorg ervoor dat deze labels bestaan in de repo vóór de eerste uitvoering (de routine zal ze niet aanmaken):
   `size/XS`, `size/S`, `size/M`, `size/L`, `size/XL`, `risk/breaking`, `risk/security`, `risk/db-migration`, `type/feature`, `type/fix`, `type/chore`, `type/docs`, `needs-tests`
3. Voeg een `CODEOWNERS` bestand of een `routines/pr-triage-owners.json` toewijzing toe die paden aan GitHub gebruikersnamen toewijst.
4. Stel omgevingsvariabelen in:
   ```
   GITHUB_TOKEN=ghp_...
   GITHUB_REPO=owner/repo
   ```
5. Registreer deze routine en bind deze aan de `pull_request.opened` en `pull_request.ready_for_review` webhook events.

## The routine prompt (the exact prompt the scheduled agent runs)

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

## Outputs & notifications

- GitHub PR comment: gestructureerde triage samenvatting geplaatst als de eerste opmerking
- GitHub labels: onmiddellijk toegepast na het plaatsen van de opmerking
- GitHub reviewer request: verzonden naar maximaal 3 eigenaren
- Log: labels toegepast, reviewers aangevraagd, HTTP-statuscodes voor elke API-aanroep
- Bij fout: als een API-aanroep mislukt, log de fout met het PR-nummer en payload — pas niet gedeeltelijk toe (probeer alle bewerkingen, log alle fouten)

## Example run

**Trigger:** PR #312 geopend — "feat: add Stripe webhook endpoint" door `@jsmith`

**Diff stats:** 6 bestanden gewijzigd, 287 regels toegevoegd, 14 verwijderd

**Analysis:**
- Size: M (301 regels totaal)
- Type: type/feature (feat: prefix, nieuw route bestand toegevoegd)
- Risk: risk/security (raakt `middleware/auth.ts`)
- Tests: needs-tests (nieuwe handler toegevoegd, geen `*.test.ts` bestanden in diff)
- Reviewers: `@alice` (eigenaar van `src/payments/`), `@bob` (eigenaar van `middleware/`)

**Labels applied:** `size/M`, `type/feature`, `risk/security`, `needs-tests`

**Comment posted:**

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
