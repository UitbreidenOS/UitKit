# Résumé de standup quotidien

## Ce qu'il fait

S'exécute chaque matin en semaine avant la réunion de standup de l'équipe. Récupère toute l'activité de nuit à partir de GitHub — commits fusionnés dans la branche principale, PRs ouvertes ou fermées, et problèmes mis à jour — puis synthétise un message de standup concis et l'envoie à un canal Slack configuré. Le message est structuré autour des trois questions de standup : ce qui a été livré, ce qui est en cours, et ce qui est bloqué.

## Déclencheur (horaire / événement GitHub / API)

- Type : horaire
- Cron : `0 8 * * 1-5` (08:00 heure locale, lundi à vendredi)
- Fuseau horaire : défini dans la configuration de la routine (par exemple, `America/New_York`)
- Aucun événement GitHub requis ; la routine interroge l'API à chaque exécution

## Configuration

1. Créez un token GitHub à granularité fine avec accès en lecture au référentiel cible (contents, pull requests, issues).
2. Créez une URL de webhook entrant Slack pour le canal cible (par exemple, `#standup`).
3. Ajoutez les deux à votre environnement Claude Code :
   ```
   GITHUB_TOKEN=ghp_...
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
   GITHUB_REPO=owner/repo
   STANDUP_CHANNEL=#standup
   ```
4. Enregistrez ce fichier de routine dans votre configuration de routines Claude Code et définissez l'horaire.

## Invite de routine (l'invite exacte que l'agent planifié exécute)

```
You are a standup assistant for a software development team.

Context:
- Repo: $GITHUB_REPO
- Lookback window: the last 18 hours (captures overnight activity even with timezone variance)
- Today: $TODAY (weekday, local team time)

Steps:
1. Use the GitHub API to fetch:
   a. All commits pushed to the default branch in the last 18 hours. For each commit, note: SHA (short), author, message, timestamp.
   b. All pull requests opened, merged, or closed in the last 18 hours. For each PR, note: number, title, author, state, linked issues.
   c. All issues opened, commented on, or closed in the last 18 hours. Flag any labeled "blocked" or "needs-review".

2. Cluster the commits and PRs by logical theme if possible (e.g., feature area, service name). Use PR titles and commit message prefixes (feat:, fix:, chore:) as signals.

3. Write a standup post in this exact format:

---
*Daily Standup — {DAY}, {DATE}*

*Shipped overnight*
• [bullet per merged PR or significant commit cluster — one line each, plain English, no jargon]

*In progress*
• [bullet per open PR or active branch with commits in the window]

*Needs attention*
• [bullet per blocked issue, stale PR (no activity > 48h), or failed CI run if detectable]

*Stats*
Commits: N | PRs merged: N | Issues closed: N
---

4. If there is nothing to report in a section, write "Nothing to report." — do not omit the section.

5. Send the post to Slack via POST to $SLACK_WEBHOOK_URL with payload:
   {"text": "<the standup post above>", "channel": "$STANDUP_CHANNEL"}

6. Return a one-line confirmation: "Standup posted for {DATE}: N commits, N PRs, N issues."
```

## Résultats et notifications

- Résultat principal : un message Slack formaté publié sur le canal configuré
- Journal : la routine enregistre les comptes de réponse de l'API GitHub et le code d'état HTTP final de Slack
- En cas d'échec : si le webhook Slack retourne une valeur autre que 200, la routine réessaie une fois après 60 secondes, puis enregistre l'erreur et quitte — pas de messages partiels

## Exemple d'exécution

**Déclencheur :** lundi 08:00 ET, 2026-06-08

**Activité GitHub trouvée :**
- 4 commits vers `main` (feat: add billing webhook handler, fix: null check in user service, chore: bump eslint, chore: update lockfile)
- 2 PRs fusionnées (#241 "Add billing webhook", #238 "Fix null check in user service")
- 1 PR ouverte (#243 "Migrate auth to Clerk — WIP")
- 1 problème mis à jour (#199 "Stripe webhook not firing") — fermé par #241

**Message Slack :**

```
Daily Standup — Monday, June 8 2026

Shipped overnight
• Billing webhook handler added and wired to Stripe events (#241)
• Null pointer fix in user service — resolves crash on anonymous sessions (#238)

In progress
• Auth migration to Clerk underway — PR #243 open, not yet ready for review

Needs attention
• Nothing to report.

Stats
Commits: 4 | PRs merged: 2 | Issues closed: 1
```

**Journal de routine :** `Standup posted for 2026-06-08: 4 commits, 2 PRs, 1 issue. Slack HTTP 200.`
