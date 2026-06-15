# Audit Trail & Session Logging

Enterprise Edition capture une audit trail complète de toutes les actions Claude Code pour conformité, debugging, et forensiques. Ce document spécifie le schéma, setup, et patterns de requête.

## Overview

Chaque tool call, décision modèle, et session event est enregistré dans un fichier JSONL structuré (`.claude/logs/audit.log`) avec chiffrement au repos sur les déploiements Enterprise Cloud.

## Audit Log Schema

Chaque ligne est un objet JSON valide avec ces champs:

```json
{
  "timestamp": "2026-06-15T14:23:45.123456Z",
  "session_id": "sess_abc123def456",
  "user_id": "user@company.com",
  "session_cost_usd": 0.042,
  "event_type": "tool_call",
  "tool_name": "Bash",
  "tool_input": {
    "command": "git status"
  },
  "tool_output": {
    "exit_code": 0,
    "stdout": "On branch main"
  },
  "duration_ms": 145,
  "context": {
    "branch": "main",
    "working_dir": "/Users/tushar/Desktop/Claudient",
    "model": "claude-haiku-4-5-20251001",
    "temperature": 1.0,
    "max_tokens": 1024
  },
  "compliance_flags": {
    "pii_detected": false,
    "cost_limit_exceeded": false,
    "rbac_violation": false,
    "rate_limited": false
  },
  "metadata": {
    "task_id": "task_xyz",
    "workflow_name": "security-review"
  }
}
```

### Field Definitions

| Champ | Type | Description |
|-------|------|-------------|
| `timestamp` | ISO 8601 | Timestamp UTC du event |
| `session_id` | string | Unique par session Claude Code |
| `user_id` | string | Utilisateur connecté (git config ou $USER) |
| `session_cost_usd` | number | Coût session cumulatif en USD |
| `event_type` | enum | `tool_call`, `model_call`, `session_start`, `session_end`, `error` |
| `tool_name` | string | Tool invoqué: `Bash`, `Read`, `Write`, `Edit`, etc. |
| `tool_input` | object | Input sanitizé (secrets removés) |
| `tool_output` | object | Résumé output (premier 1KB, données sensibles masked) |
| `duration_ms` | number | Wall-clock time exécution tool |
| `context.branch` | string | Git branch courant |
| `context.working_dir` | string | Répertoire de travail absolu |
| `context.model` | string | Identifiant modèle Claude |
| `compliance_flags` | object | Flags booléens violations conformité |
| `metadata` | object | Task ID optionnel, workflow name, tags |

## Sanitization Rules

Pour prévenir accidental secret leakage:

1. **Secrets sont removés**: API keys, passwords, tokens matching `(password|secret|token|key|api_key)` sont redactés comme `[REDACTED]`
2. **PII est masked**: Emails, phone numbers, SSNs deviennent `[PII:EMAIL]`, `[PII:PHONE]`, etc.
3. **Command output est truncated**: Seulement premiers 1000 caractères loggés
4. **Filepaths sont preservés**: Chemins complets loggés pour accountability (utilise .gitignore pour exclure répertoires privés)

## Enabling Audit Logging

Ajoutez le hook audit-logger à votre `settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/audit-logger.sh",
            "async": true
          }
        ]
      }
    ]
  }
}
```

Configurez aussi la location du audit log (défaut: `.claude/logs/audit.log`):

```bash
mkdir -p .claude/logs
echo ".claude/logs/" >> .gitignore
chmod 600 .claude/logs/audit.log  # Restrict read permissions
```

## Session Reconstruction

Pour reconstruire une session depuis audit logs:

```bash
# Count tool calls
jq -s 'length' .claude/logs/audit.log

# Filter par tool type
jq 'select(.tool_name == "Bash")' .claude/logs/audit.log

# Export session timeline
jq '[.[] | {time: .timestamp, tool: .tool_name, cost: .session_cost_usd}]' .claude/logs/audit.log

# Find errors
jq 'select(.event_type == "error")' .claude/logs/audit.log

# Total session cost
jq '.[-1].session_cost_usd' .claude/logs/audit.log
```

## Compliance Queries

### GDPR Data Requests
Récupérez toutes actions d'un utilisateur dans une date range:
```bash
jq --arg user "user@company.com" --arg start "2026-06-01" --arg end "2026-06-30" \
  'select(.user_id == $user and .timestamp >= $start and .timestamp <= $end)' \
  .claude/logs/audit.log | jq -s > gdpr-request-$user.jsonl
```

### SOC 2 Type II Change Log
Export tous les file writes pour change management audit:
```bash
jq 'select(.tool_name == "Write" or .tool_name == "Edit") | 
    {timestamp, user_id, file_path: .tool_input.file_path, action: .tool_name}' \
  .claude/logs/audit.log > soc2-changes.jsonl
```

### Cost Attribution
Sum costs par utilisateur:
```bash
jq 'select(.event_type == "session_end") | {user_id, cost: .session_cost_usd}' \
  .claude/logs/audit.log | jq -s 'group_by(.user_id) | map({user: .[0].user_id, total_cost: map(.cost) | add})'
```

## Encryption (Enterprise Cloud)

Sur Claudient Cloud:
- Audit logs sont **chiffrés au repos** avec AES-256-GCM
- **En transit**: TLS 1.3, mutual authentication
- **Retention**: 7 ans (configurable par exigence conformité)
- **Access**: Role-based, audit trail d'audit log access lui-même

## Integration Points

### SIEM Integration
Export vers Splunk, DataDog, ou ELK:

```bash
# Ship à Splunk HTTP Event Collector
jq -Rs 'split("\n") | .[]' .claude/logs/audit.log | \
  while read line; do
    curl -X POST https://splunk.company.com:8088/services/collector \
      -H "Authorization: Splunk $SPLUNK_HEC_TOKEN" \
      -d "{\"event\": $line}"
  done
```

### Webhook Notifications
Post high-risk events (e.g., PII detected, cost exceeded) à Slack:

```bash
jq 'select(.compliance_flags.pii_detected == true or .compliance_flags.cost_limit_exceeded == true)' \
  .claude/logs/audit.log | \
  jq -Rs "curl -X POST $SLACK_WEBHOOK -H 'Content-Type: application/json' -d '{\"text\": \"Compliance alert: \(.)\"}'"
```

## Log Rotation

Pour long-running sessions, rotate quotidiennement:

```bash
# cron: 0 0 * * *
TIMESTAMP=$(date +%Y%m%d)
mv .claude/logs/audit.log .claude/logs/audit-${TIMESTAMP}.log.gz
gzip .claude/logs/audit-${TIMESTAMP}.log
# Archive à S3, Glacier, etc.
```

## Compliance Notes

- **HIPAA**: Audit logs satisfont "audit trail" exigence sous 45 CFR §164.312(b)
- **SOC 2 Type II**: Supporte CC6.1, CC7.1 (monitoring et logging controls)
- **GDPR**: Log retention aligne avec data retention policies
- **PCI-DSS**: 3.2.1 compliant (restrictive access, encryption)

---

**Last updated**: 2026-06-15  
**Related files**: `SSO_SETUP.md`, `COMPLIANCE.md`
