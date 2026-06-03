# Resumidor de Daily Standup

## Qué hace

Se ejecuta cada mañana entre semana antes de la reunión de standup del equipo. Extrae toda la actividad nocturna de GitHub — commits fusionados con la rama principal, PRs abiertos o cerrados, e issues actualizadas — luego sintetiza un post de standup conciso y lo envía a un canal de Slack configurado. El post se estructura alrededor de las tres preguntas de standup: qué se entregó, qué está en progreso y qué está bloqueado.

## Trigger (cronograma / evento de GitHub / API)

- Type: schedule
- Cron: `0 8 * * 1-5` (08:00 hora local, de lunes a viernes)
- Timezone: establecido en la configuración de la rutina (por ejemplo, `America/New_York`)
- No se requiere evento de GitHub; la rutina consulta la API en cada ejecución

## Configuración

1. Crea un token de GitHub de grano fino con acceso de lectura al repositorio objetivo (contents, pull requests, issues).
2. Crea una URL de webhook entrante de Slack para el canal objetivo (por ejemplo, `#standup`).
3. Agrega ambos a tu entorno de Claude Code:
   ```
   GITHUB_TOKEN=ghp_...
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
   GITHUB_REPO=owner/repo
   STANDUP_CHANNEL=#standup
   ```
4. Registra este archivo de rutina en tu configuración de rutinas de Claude Code y establece el cronograma.

## El prompt de rutina (el prompt exacto que ejecuta el agente programado)

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

## Salidas y notificaciones

- Salida principal: un mensaje de Slack formateado publicado en el canal configurado
- Registro: la rutina registra los recuentos de respuesta de la API de GitHub y el código de estado HTTP final de Slack
- En caso de fallo: si el webhook de Slack devuelve algo que no sea 200, la rutina reinenta una vez después de 60 segundos, luego registra el error y sale — sin publicaciones parciales

## Ejemplo de ejecución

**Trigger:** Lunes 08:00 ET, 2026-06-08

**Actividad de GitHub encontrada:**
- 4 commits a `main` (feat: add billing webhook handler, fix: null check in user service, chore: bump eslint, chore: update lockfile)
- 2 PRs fusionados (#241 "Add billing webhook", #238 "Fix null check in user service")
- 1 PR abierto (#243 "Migrate auth to Clerk — WIP")
- 1 issue actualizado (#199 "Stripe webhook not firing") — cerrado por #241

**Post de Slack:**

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

**Registro de rutina:** `Standup posted for 2026-06-08: 4 commits, 2 PRs, 1 issue. Slack HTTP 200.`
