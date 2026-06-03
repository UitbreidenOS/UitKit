# Incident Watch Agent

## Was es tut

Wird ausgelöst, wenn ein Alert oder Webhook ein potenzielles Incident signalisiert — ein Anstieg von Fehlern, ein fehlgeschlagener Health Check, ein PagerDuty Alert oder ein anderes externes Signal, das an den API-Endpunkt der Routine weitergeleitet wird. Innerhalb von Sekunden nach Empfang des Signals sammelt der Agent strukturierten Kontext: aktuelle Fehlerprotokolle, die letzten Deployments, offene Pull Requests, die in den letzten 24 Stunden zusammengeführt wurden, und alle zugehörigen GitHub Issues. Anschließend erstellt er eine prägnante Incident-Zusammenfassung und postet sie an einen konfigurierten Slack-Kanal oder ein Incident-Management-Tool. Das Ziel ist es, die ersten 5–10 Minuten des hektischen Kontextsammelns während eines Incidents zu sparen.

## Auslöser (Schedule / GitHub Event / API)

- Type: API call (webhook)
- Endpoint: the routine exposes a POST endpoint; external systems call it to fire the agent
- Compatible alert sources (send to this endpoint):
  - PagerDuty webhooks (`event_type: incident.trigger`)
  - Datadog monitor alerts (webhook integration)
  - AWS CloudWatch alarms (SNS → HTTP endpoint)
  - Custom application webhooks (any JSON payload with a `message` or `summary` field)
- Payload schema (minimum required):
  ```json
  {
    "source": "pagerduty | datadog | cloudwatch | custom",
    "severity": "critical | high | warning",
    "title": "Human-readable alert title",
    "message": "Alert body / description",
    "service": "Name of affected service (optional)",
    "timestamp": "ISO 8601"
  }
  ```
- Kann auch manuell über API für Drills oder rückwirkende Analysen ausgelöst werden

## Einrichtung

1. Registrieren Sie den API-Endpunkt der Routine in Ihrer Alarmierungsplattform als Webhook-Ziel.
2. GitHub Token Berechtigungen:
   - Contents: read (to fetch recent commit messages and logs if stored in repo)
   - Pull requests: read (to find recently merged PRs)
   - Issues: read and write (to search related issues and optionally open an incident issue)
3. Konfigurieren Sie Zugriff auf die Protokollquelle — mindestens eine davon:
   - `DATADOG_API_KEY` + `DATADOG_APP_KEY` (for log queries via Datadog API)
   - `CLOUDWATCH_LOG_GROUP` + AWS credentials (for CloudWatch Logs Insights)
   - `LOG_FETCH_URL` — a generic HTTP endpoint that accepts `?service=X&minutes=N` and returns recent log lines as JSON
4. Legen Sie Umgebungsvariablen fest:
   ```
   GITHUB_TOKEN=ghp_...
   GITHUB_REPO=owner/repo
   INCIDENT_SLACK_WEBHOOK=https://hooks.slack.com/services/...
   INCIDENT_CHANNEL=#incidents
   INCIDENT_OPEN_ISSUE=true    # "true" or "false" — whether to open a GitHub issue
   LOG_SOURCE=datadog           # "datadog", "cloudwatch", or "custom"
   DEPLOY_LOOKBACK_HOURS=24    # how far back to scan for recent deploys
   ```

## Der Routine Prompt (der genaue Prompt, den der geplante Agent ausführt)

```
You are an incident response context agent. An alert has just fired. Your job is to gather context fast and produce a structured incident summary. You do not diagnose the root cause — you surface the signals that help the on-call engineer do that.

Alert payload injected at runtime:
- Source: $ALERT_SOURCE
- Severity: $ALERT_SEVERITY
- Title: $ALERT_TITLE
- Message: $ALERT_MESSAGE
- Affected service: $ALERT_SERVICE (may be empty — infer from alert title if possible)
- Alert timestamp: $ALERT_TIMESTAMP

Steps:

1. RECENT DEPLOYS — query the last $DEPLOY_LOOKBACK_HOURS hours of deployment activity:
   a. GitHub: fetch merged PRs to the default branch in the lookback window. For each, record: PR number, title, author, merge time, files changed (summary).
   b. If a deployment log API is configured, query it for deploy events in the same window. Record: deploy ID, service, version, deployer, timestamp, status.
   Flag any deploys that touch the affected service as "potentially related".

2. ERROR LOGS — fetch the last 15 minutes of logs for the affected service using $LOG_SOURCE:
   - Datadog: query `service:$ALERT_SERVICE status:error` for the past 15 minutes, return up to 20 log lines
   - CloudWatch: run a Logs Insights query on $CLOUDWATCH_LOG_GROUP filtering for ERROR/FATAL in the past 15 minutes
   - Custom: GET $LOG_FETCH_URL?service=$ALERT_SERVICE&minutes=15
   Extract: the top 5 most-frequent error messages (with occurrence count), any stack traces present, any correlation IDs.

3. RELATED ISSUES — search GitHub issues in $GITHUB_REPO for open issues mentioning the service name or key error terms from the logs. Return up to 5 most relevant (by recency and keyword overlap). Also check for any issues labeled "incident" opened in the last 7 days.

4. SYSTEM CONTEXT — if available, note:
   - Current deploy version / git SHA of the affected service
   - Time since last successful deploy
   - Whether the alert has fired before in the past 7 days (check alert history if accessible)

5. DRAFT INCIDENT SUMMARY — compose the following document:

---
## Incident Alert — {SEVERITY} — {TITLE}
**Time:** {ALERT_TIMESTAMP} | **Source:** {ALERT_SOURCE} | **Service:** {SERVICE}

### Alert details
{ALERT_MESSAGE — verbatim, trimmed to 500 chars if longer}

### Recent deploys (last {DEPLOY_LOOKBACK_HOURS}h)
{table: time | PR/deploy | author | service | potentially related?}
{If none: "No deploys in the lookback window."}

### Top errors in logs (last 15 min)
{numbered list: N occurrences — "error message excerpt"}
{If no logs available: "Log fetch failed or no errors found. Check $LOG_SOURCE manually."}

### Stack trace excerpt
{first stack trace found, trimmed to 20 lines, or "None found."}

### Related open issues
{bulleted list: #N — title (opened DATE), or "None found."}

### Recommended starting points
{3–5 numbered, concrete hypotheses or investigation steps based on the evidence above — ordered by likelihood given the data, not generically}

---
*Context gathered automatically at {NOW}. Verify before acting — logs and deploy data may be incomplete.*

6. POST TO SLACK — send the incident summary to $INCIDENT_SLACK_WEBHOOK:
   {"text": "<the summary above>", "channel": "$INCIDENT_CHANNEL"}
   Use Slack's block kit if the payload supports it, to render the table clearly.

7. OPEN GITHUB ISSUE (if $INCIDENT_OPEN_ISSUE=true):
   Open an issue titled "Incident: {TITLE} — {DATE}" with the full summary as the body. Apply labels: `incident`, `{severity}`. Return the issue URL.

8. Return: "Incident context gathered for '{TITLE}'. Posted to Slack. Issue: {URL or 'not opened'}."
```

## Ausgaben & Benachrichtigungen

- Slack message: full incident summary posted to `#incidents` (or configured channel) within ~30 seconds of alert receipt
- GitHub issue (optional): structured issue opened for tracking and post-mortem linkage
- Log: alert payload received, data sources queried, HTTP status for Slack post, issue URL
- Bei fehlgeschlagenem Protokollabruf: Die Zusammenfassung wird weiterhin gepostet mit einem Hinweis, dass Protokolldaten nicht verfügbar sind — die Routine blockiert niemals bei einer fehlgeschlagenen Datenquelle
- Bei doppeltem Alert (gleicher Titel innerhalb von 10 Minuten): Die Routine erkennt dies und antwortet im Thread in der bestehenden Slack-Nachricht, anstatt eine neue zu posten

## Beispiel-Ablauf

**Auslöser:** PagerDuty webhook, 2026-06-10 02:47 UTC

**Alert payload:**
```json
{
  "source": "pagerduty",
  "severity": "critical",
  "title": "payments-service: error rate > 5% (was 0.2%)",
  "message": "Error rate on /api/v2/charge spiked to 8.3% over the past 5 minutes. P99 latency 4200ms.",
  "service": "payments-service",
  "timestamp": "2026-06-10T02:47:00Z"
}
```

**Gefundene jüngste Deployments:**
- 01:22 UTC — PR #318 "refactor: move Stripe client initialization" — @jsmith — payments-service — POTENTIALLY RELATED

**Top-Fehler in Protokollen:**
1. 47x — `StripeInvalidRequestError: No such customer: cus_undefined`
2. 12x — `TypeError: Cannot read properties of undefined (reading 'id')`
3. 3x — `Connection timeout: postgres payments-db:5432`

**Slack-Nachricht an #incidents gepostet:**

```
## Incident Alert — CRITICAL — payments-service: error rate > 5%
Time: 2026-06-10 02:47 UTC | Source: PagerDuty | Service: payments-service

### Alert details
Error rate on /api/v2/charge spiked to 8.3% over the past 5 minutes. P99 latency 4200ms.

### Recent deploys (last 24h)
| Time | PR/Deploy | Author | Service | Related? |
|------|-----------|--------|---------|----------|
| 01:22 UTC | #318 — refactor: move Stripe client init | @jsmith | payments-service | YES |

### Top errors in logs (last 15 min)
1. 47x — StripeInvalidRequestError: No such customer: cus_undefined
2. 12x — TypeError: Cannot read properties of undefined (reading 'id')
3. 3x — Connection timeout: postgres payments-db:5432

### Recommended starting points
1. Review PR #318 — Stripe client refactor deployed 85 min before the spike; customer ID may be undefined after the change
2. Check if cus_undefined is a regression in how the customer object is passed to the charge handler
3. Verify postgres connection pool is healthy — 3 timeout errors may be unrelated but worth ruling out
4. Check Stripe dashboard for API errors in the same window
5. Consider reverting #318 if investigation takes > 15 min
```

**GitHub Issue geöffnet:** #402 "Incident: payments-service error spike — 2026-06-10"
