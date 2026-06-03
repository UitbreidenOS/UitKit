# Daily Standup Summarizer

## What it does

Loopt elke weekdag ochtend voor het standup-meeting van het team. Haalt alle overnight-activiteit op van GitHub — commits die in de main branch zijn samengevoegd, PRs die geopend of gesloten zijn, en issues die bijgewerkt zijn — en stelt vervolgens een beknopt standupbericht samen dat naar een geconfigureerd Slack-kanaal wordt verzonden. Het bericht is gestructureerd rond de drie standupvragen: wat is uitgerold, wat is in progress, en wat is geblokkeerd.

## Trigger (schedule / GitHub event / API)

- Type: schedule
- Cron: `0 8 * * 1-5` (08:00 lokale tijd, maandag tot vrijdag)
- Timezone: ingesteld in routine config (bijv. `America/New_York`)
- Geen GitHub event vereist; de routine peilt de API op elke uitvoering

## Setup

1. Maak een GitHub fine-grained token aan met leestoegang tot de doelbewaarplaats (contents, pull requests, issues).
2. Maak een Slack incomingwebhook-URL aan voor het doelkanaal (bijv. `#standup`).
3. Voeg beide toe aan uw Claude Code-omgeving:
   ```
   GITHUB_TOKEN=ghp_...
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
   GITHUB_REPO=owner/repo
   STANDUP_CHANNEL=#standup
   ```
4. Registreer dit routinebestand in uw Claude Code routine-config en stel het schema in.

## The routine prompt (the exact prompt the scheduled agent runs)

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

## Outputs & notifications

- Primaire output: een opgemaakt Slack-bericht geplaatst op het geconfigureerde kanaal
- Log: de routine registreert de GitHub API-responstallen en de uiteindelijke Slack HTTP-statuscode
- Bij mislukkingen: als de Slack-webhook een niet-200-waarde retourneert, voert de routine eenmaal opnieuw uit na 60 seconden, registreert vervolgens de fout en sluit af — geen gedeeltelijke posts

## Example run

**Trigger:** Monday 08:00 ET, 2026-06-08

**GitHub activity found:**
- 4 commits to `main` (feat: add billing webhook handler, fix: null check in user service, chore: bump eslint, chore: update lockfile)
- 2 PRs merged (#241 "Add billing webhook", #238 "Fix null check in user service")
- 1 PR open (#243 "Migrate auth to Clerk — WIP")
- 1 issue updated (#199 "Stripe webhook not firing") — closed by #241

**Slack post:**

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

**Routine log:** `Standup posted for 2026-06-08: 4 commits, 2 PRs, 1 issue. Slack HTTP 200.`
