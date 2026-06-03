# PR Triage Agent

## Was es tut

Wird sofort ausgelöst, wenn ein neuer Pull Request im Repository geöffnet wird. Liest das PR-Diff, den Titel, die Beschreibung und verknüpfte Issues, dann: wendet angemessene Labels an, schreibt einen strukturierten Zusammenfassungskommentar zum PR, kennzeichnet Risikobereiche (Breaking Changes, fehlende Tests, großes Diff, berührt empfindliche Pfade) und fordert Reviewer basierend auf Dateieigentümerschaft (CODEOWNERS oder eine konfigurierte Zuordnung) an. Das Ziel ist es, den manuellen Aufwand für die erste PR-Triage zu eliminieren.

## Auslöser (Zeitplan / GitHub-Ereignis / API)

- Typ: GitHub-Ereignis
- Ereignis: `pull_request.opened`
- Auch ausgelöst bei: `pull_request.ready_for_review` (wenn ein Draft-PR als bereit gekennzeichnet wird)
- Wird nicht ausgelöst bei: Draft-PRs mit Push-Operationen (nur wenn explizit als bereit gekennzeichnet)

## Setup

1. Erstelle eine GitHub App oder ein feingranulares Token mit folgenden Berechtigungen:
   - Pull Requests: Lesen und Schreiben (zum Posten von Kommentaren und Anwenden von Labels)
   - Issues: Lesen und Schreiben (zum Lesen verknüpfter Issues)
   - Contents: Lesen (zum Abrufen des Diffs und CODEOWNERS)
   - Members: Lesen (zum Auflösen von Reviewer-Benutzernamen)
2. Stelle sicher, dass diese Labels im Repository vorhanden sind, bevor die erste Ausführung erfolgt (die Routine erstellt sie nicht):
   `size/XS`, `size/S`, `size/M`, `size/L`, `size/XL`, `risk/breaking`, `risk/security`, `risk/db-migration`, `type/feature`, `type/fix`, `type/chore`, `type/docs`, `needs-tests`
3. Füge eine `CODEOWNERS` Datei oder eine `routines/pr-triage-owners.json` Zuordnung hinzu, die Pfade GitHub-Benutzernamen zuordnet.
4. Setze Umgebungsvariablen:
   ```
   GITHUB_TOKEN=ghp_...
   GITHUB_REPO=owner/repo
   ```
5. Registriere diese Routine und binde sie an die `pull_request.opened` und `pull_request.ready_for_review` Webhook-Ereignisse.

## Der Routine-Prompt (der genaue Prompt, den der geplante Agent ausführt)

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

## Ausgaben und Benachrichtigungen

- GitHub PR-Kommentar: strukturierte Triage-Zusammenfassung wird als erster Kommentar gepostet
- GitHub-Labels: sofort nach dem Posten des Kommentars angewendet
- GitHub-Reviewer-Anfrage: an bis zu 3 Eigentümer gesendet
- Log: angewendete Labels, angeforderte Reviewer, HTTP-Statuscodes für jeden API-Aufruf
- Bei Fehler: Wenn ein API-Aufruf fehlschlägt, protokolliere den Fehler mit der PR-Nummer und Payload – wende nicht teilweise an (versuche alle Operationen, protokolliere alle Fehler)

## Beispielausführung

**Auslöser:** PR #312 geöffnet – "feat: add Stripe webhook endpoint" von `@jsmith`

**Diff-Statistiken:** 6 Dateien geändert, 287 Zeilen hinzugefügt, 14 gelöscht

**Analyse:**
- Größe: M (301 Zeilen insgesamt)
- Typ: type/feature (feat: Präfix, neue Route-Datei hinzugefügt)
- Risiko: risk/security (berührt `middleware/auth.ts`)
- Tests: needs-tests (neuer Handler hinzugefügt, keine `*.test.ts` Dateien im Diff)
- Reviewer: `@alice` (besitzt `src/payments/`), `@bob` (besitzt `middleware/`)

**Angewendete Labels:** `size/M`, `type/feature`, `risk/security`, `needs-tests`

**Geposteter Kommentar:**

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
