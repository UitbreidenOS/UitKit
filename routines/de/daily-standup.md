# Daily Standup Summarizer

## Was es macht

Läuft jeden Wochentag morgens vor dem täglichen Stand-up-Treffen des Teams. Bezieht alle Aktivitäten über Nacht von GitHub — zusammengeführte Commits im Hauptbranch, geöffnete oder geschlossene Pull Requests und aktualisierte Issues — und erstellt dann einen prägnanten Stand-up-Beitrag, den es an einen konfigurierten Slack-Channel sendet. Der Beitrag ist um die drei Stand-up-Fragen strukturiert: Was wurde ausgeliefert, was läuft gerade und was ist blockiert.

## Auslöser (Zeitplan / GitHub-Ereignis / API)

- Typ: Zeitplan
- Cron: `0 8 * * 1-5` (08:00 lokale Zeit, Montag bis Freitag)
- Zeitzone: in der Routine-Konfiguration festgelegt (z.B. `America/New_York`)
- Kein GitHub-Ereignis erforderlich; die Routine fragt die API bei jedem Lauf ab

## Einrichtung

1. Erstellen Sie ein GitHub-Token mit feiner Granularität mit Lesezugriff auf das Ziel-Repository (contents, pull requests, issues).
2. Erstellen Sie eine Slack-Eingangs-Webhook-URL für den Zielkanal (z.B. `#standup`).
3. Fügen Sie beide zu Ihrer Claude Code-Umgebung hinzu:
   ```
   GITHUB_TOKEN=ghp_...
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
   GITHUB_REPO=owner/repo
   STANDUP_CHANNEL=#standup
   ```
4. Registrieren Sie diese Routine-Datei in Ihrer Claude Code-Routine-Konfiguration und legen Sie den Zeitplan fest.

## Der Routine-Prompt (der genaue Prompt, den der geplante Agent ausführt)

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

## Ausgaben & Benachrichtigungen

- Primäre Ausgabe: eine formatierte Slack-Nachricht, die an den konfigurierten Channel gepostet wird
- Protokoll: die Routine protokolliert die GitHub-API-Antwortzahlen und den endgültigen Slack-HTTP-Statuscode
- Bei Fehler: Wenn der Slack-Webhook nicht 200 zurückgibt, versucht die Routine einmal nach 60 Sekunden erneut, protokolliert dann den Fehler und beendet sich — keine teilweisen Posts

## Beispiel für einen Lauf

**Auslöser:** Montag 08:00 ET, 2026-06-08

**Gefundene GitHub-Aktivität:**
- 4 Commits zu `main` (feat: add billing webhook handler, fix: null check in user service, chore: bump eslint, chore: update lockfile)
- 2 zusammengeführte PRs (#241 "Add billing webhook", #238 "Fix null check in user service")
- 1 offener PR (#243 "Migrate auth to Clerk — WIP")
- 1 aktualisiertes Issue (#199 "Stripe webhook not firing") — geschlossen durch #241

**Slack-Beitrag:**

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

**Routine-Protokoll:** `Standup posted for 2026-06-08: 4 commits, 2 PRs, 1 issue. Slack HTTP 200.`
