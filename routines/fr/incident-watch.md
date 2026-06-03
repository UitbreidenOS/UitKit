# Agent Incident Watch

## Ce qu'il fait

S'active quand une alerte ou un webhook signale un incident potentiel — un pic d'erreurs, un contrôle de santé défaillant, une alerte PagerDuty, ou tout signal externe acheminé vers le point de terminaison API de la routine. En quelques secondes après la réception du signal, l'agent rassemble un contexte structuré : les journaux d'erreurs récents, les derniers déploiements, les PR ouvertes fusionnées au cours des 24 dernières heures, et tous les problèmes GitHub connexes. Il rédige ensuite un résumé d'incident concis et le publie sur un canal Slack configuré ou un outil de gestion d'incidents. L'objectif est de réduire les 5-10 premières minutes de rassemblement frénétique de contexte lors d'un incident.

## Déclencheur (calendrier / événement GitHub / API)

- Type : Appel API (webhook)
- Point de terminaison : la routine expose un point de terminaison POST ; les systèmes externes l'appellent pour déclencher l'agent
- Sources d'alertes compatibles (envoyer à ce point de terminaison) :
  - Webhooks PagerDuty (`event_type: incident.trigger`)
  - Alertes de monitoring Datadog (intégration webhook)
  - Alarmes AWS CloudWatch (SNS → point de terminaison HTTP)
  - Webhooks d'application personnalisés (tout charge JSON avec un champ `message` ou `summary`)
- Schéma de charge (minimum requis) :
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
- Peut également être déclenché manuellement via l'API pour les simulations ou l'analyse rétrospective

## Installation

1. Enregistrez le point de terminaison API de la routine dans votre plateforme d'alertes en tant que destination webhook.
2. Autorisations du jeton GitHub :
   - Contenu : lecture (pour récupérer les messages de commit récents et les journaux s'ils sont stockés dans le référentiel)
   - Demandes de fusion : lecture (pour trouver les PR récemment fusionnées)
   - Problèmes : lecture et écriture (pour rechercher les problèmes connexes et éventuellement ouvrir un problème d'incident)
3. Configurez l'accès à la source des journaux — au moins une des options suivantes :
   - `DATADOG_API_KEY` + `DATADOG_APP_KEY` (pour les requêtes de journaux via l'API Datadog)
   - `CLOUDWATCH_LOG_GROUP` + identifiants AWS (pour CloudWatch Logs Insights)
   - `LOG_FETCH_URL` — un point de terminaison HTTP générique qui accepte `?service=X&minutes=N` et renvoie les lignes de journaux récentes au format JSON
4. Définissez les variables d'environnement :
   ```
   GITHUB_TOKEN=ghp_...
   GITHUB_REPO=owner/repo
   INCIDENT_SLACK_WEBHOOK=https://hooks.slack.com/services/...
   INCIDENT_CHANNEL=#incidents
   INCIDENT_OPEN_ISSUE=true    # "true" ou "false" — si on doit ouvrir un problème GitHub
   LOG_SOURCE=datadog           # "datadog", "cloudwatch", ou "custom"
   DEPLOY_LOOKBACK_HOURS=24    # jusqu'où rechercher les déploiements récents
   ```

## L'invite de routine (l'invite exacte que l'agent planifié exécute)

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

## Sorties et notifications

- Message Slack : résumé complet de l'incident affiché sur `#incidents` (ou canal configuré) dans ~30 secondes après la réception de l'alerte
- Problème GitHub (facultatif) : problème structuré ouvert pour le suivi et la liaison du post-mortem
- Journal : charge utile d'alerte reçue, sources de données interrogées, statut HTTP pour la publication Slack, URL du problème
- En cas d'échec de la récupération des journaux : le résumé est toujours affiché avec une note indiquant que les données des journaux ne sont pas disponibles — la routine ne bloque jamais sur une source de données défaillante
- En cas d'alerte en double (même titre dans les 10 minutes) : la routine le détecte et répond en fil sur le message Slack existant plutôt que d'en afficher un nouveau

## Exemple d'exécution

**Déclencheur :** Webhook PagerDuty, 2026-06-10 02:47 UTC

**Charge utile d'alerte :**
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

**Déploiements récents trouvés :**
- 01:22 UTC — PR #318 « refactor: move Stripe client initialization » — @jsmith — payments-service — POTENTIELLEMENT CONNEXE

**Principales erreurs dans les journaux :**
1. 47x — `StripeInvalidRequestError: No such customer: cus_undefined`
2. 12x — `TypeError: Cannot read properties of undefined (reading 'id')`
3. 3x — `Connection timeout: postgres payments-db:5432`

**Message Slack affiché sur #incidents :**

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

**Problème GitHub ouvert :** #402 « Incident: payments-service error spike — 2026-06-10 »
