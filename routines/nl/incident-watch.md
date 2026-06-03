# Incident Watch Agent

## Wat het doet

Activeert wanneer een waarschuwing of webhook een mogelijk incident signaleert — een piek in fouten, een mislukte gezondheidscontrole, een PagerDuty-waarschuwing, of enig ander extern signaal dat naar het API-eindpunt van de routine wordt gestuurd. Binnen enkele seconden na ontvangst van het signaal verzamelt de agent gestructureerde context: recente foutlogboeken, de laatste paar implementaties, geopende PR's die in de afgelopen 24 uur zijn samengevoegd, en gerelateerde GitHub-issues. Vervolgens stelt het een beknopt incidentsamenvatting op en plaatst deze in een geconfigureerd Slack-kanaal of incident management tool. Het doel is om de eerste 5-10 minuten van frenetieke contextinzameling tijdens een incident in te korten.

## Trigger (schema / GitHub-event / API)

- Type: API-aanroep (webhook)
- Eindpunt: de routine stelt een POST-eindpunt beschikbaar; externe systemen roepen het aan om de agent te activeren
- Compatibele waarschuwingsbronnen (verstuur naar dit eindpunt):
  - PagerDuty webhooks (`event_type: incident.trigger`)
  - Datadog monitor alerts (webhook integratie)
  - AWS CloudWatch alarms (SNS → HTTP eindpunt)
  - Custom application webhooks (elke JSON payload met een `message` of `summary` veld)
- Payload schema (minimaal vereist):
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
- Kan ook handmatig via API worden geactiveerd voor oefeningen of retrospectieve analyses

## Setup

1. Registreer het API-eindpunt van de routine in uw waarschuwingsplatform als webhook bestemming.
2. GitHub token machtigingen:
   - Contents: read (om recente commit-berichten en logboeken op te halen als deze in repo zijn opgeslagen)
   - Pull requests: read (om recent samengevoegde PR's te vinden)
   - Issues: read and write (om gerelateerde issues te zoeken en optioneel een incident issue te openen)
3. Configureer log-brontoegangen — minstens één van:
   - `DATADOG_API_KEY` + `DATADOG_APP_KEY` (voor logquery's via Datadog API)
   - `CLOUDWATCH_LOG_GROUP` + AWS credentials (voor CloudWatch Logs Insights)
   - `LOG_FETCH_URL` — een generiek HTTP-eindpunt dat `?service=X&minutes=N` accepteert en recente logregels als JSON retourneert
4. Stel omgevingsvariabelen in:
   ```
   GITHUB_TOKEN=ghp_...
   GITHUB_REPO=owner/repo
   INCIDENT_SLACK_WEBHOOK=https://hooks.slack.com/services/...
   INCIDENT_CHANNEL=#incidents
   INCIDENT_OPEN_ISSUE=true    # "true" of "false" — of een GitHub issue moet worden geopend
   LOG_SOURCE=datadog           # "datadog", "cloudwatch", of "custom"
   DEPLOY_LOOKBACK_HOURS=24    # hoe ver terug te zoeken naar recente implementaties
   ```

## De routineprompt (de exacte prompt die de geplande agent uitvoert)

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

## Outputs & meldingen

- Slack-bericht: volledige incidentsamenvatting geplaatst in `#incidents` (of geconfigureerd kanaal) binnen ~30 seconden na waarschuwingsontvangst
- GitHub issue (optioneel): gestructureerde issue geopend voor tracking en post-mortem koppelingen
- Log: waarschuwing payload ontvangen, gegevensbronnen ondervraagd, HTTP-status voor Slack-post, issue URL
- Bij faling van logophaling: de samenvatting wordt nog steeds geplaatst met een opmerking dat loggegevens niet beschikbaar zijn — de routine blokkeert nooit op een mislukte gegevensbron
- Bij dubbele waarschuwing (dezelfde titel binnen 10 minuten): de routine detecteert dit en antwoordt in-thread op het bestaande Slack-bericht in plaats van een nieuw bericht te plaatsen

## Voorbeeld run

**Trigger:** PagerDuty webhook, 2026-06-10 02:47 UTC

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

**Recente implementaties gevonden:**
- 01:22 UTC — PR #318 "refactor: move Stripe client initialization" — @jsmith — payments-service — POTENTIEEL GERELATEERD

**Top fouten in logs:**
1. 47x — `StripeInvalidRequestError: No such customer: cus_undefined`
2. 12x — `TypeError: Cannot read properties of undefined (reading 'id')`
3. 3x — `Connection timeout: postgres payments-db:5432`

**Slack-bericht geplaatst in #incidents:**

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

**GitHub issue geopend:** #402 "Incident: payments-service error spike — 2026-06-10"
