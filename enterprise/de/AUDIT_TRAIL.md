# Audit Trail & Session Logging

Enterprise Edition erfasst eine vollständige Audit-Trail aller Claude Code Aktionen für Compliance, Debugging und Forensik. Dieses Dokument spezifiziert das Schema, die Einrichtung und Abfragemuster.

## Übersicht

Jeder Tool-Aufruf, Modellentscheidung und Session-Ereignis wird in einer strukturierten JSONL-Datei (`.claude/logs/audit.log`) mit Verschlüsselung im Ruhezustand auf Enterprise Cloud Bereitstellungen protokolliert.

## Audit Log Schema

Jede Zeile ist ein gültiges JSON-Objekt mit diesen Feldern:

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

### Felddefinitionen

| Feld | Typ | Beschreibung |
|-------|------|-------------|
| `timestamp` | ISO 8601 | UTC-Zeitstempel des Ereignisses |
| `session_id` | string | Eindeutig pro Claude Code Session |
| `user_id` | string | Angemeldeter Benutzer (aus Git Config oder $USER) |
| `session_cost_usd` | number | Kumulativer Session-Kostenwert in USD |
| `event_type` | enum | `tool_call`, `model_call`, `session_start`, `session_end`, `error` |
| `tool_name` | string | Aufgerufenes Tool: `Bash`, `Read`, `Write`, `Edit`, etc. |
| `tool_input` | object | Bereinigter Input (Geheimnisse entfernt) |
| `tool_output` | object | Output-Zusammenfassung (erste 1KB, sensible Daten maskiert) |
| `duration_ms` | number | Wall-Clock-Zeit für Tool-Ausführung |
| `context.branch` | string | Aktueller Git-Branch |
| `context.working_dir` | string | Absolutes Arbeitsverzeichnis |
| `context.model` | string | Claude-Modellkennung |
| `compliance_flags` | object | Boolesche Flags für Compliance-Verstöße |
| `metadata` | object | Optionale Task-ID, Workflow-Name, Tags |

## Bereinigungsregeln

Um versehentliche Secret-Lecks zu verhindern:

1. **Geheimnisse werden entfernt**: API-Schlüssel, Passwörter, Tokens, die `(password|secret|token|key|api_key)` entsprechen, werden als `[REDACTED]` redigiert
2. **PII wird maskiert**: E-Mail-Adressen, Telefonnummern, SSNs werden zu `[PII:EMAIL]`, `[PII:PHONE]`, etc.
3. **Befehlsausgabe wird gekürzt**: Nur erste 1000 Zeichen protokolliert
4. **Dateipfade werden beibehalten**: Vollständige Pfade protokolliert für Rechenschaftspflicht (verwenden Sie .gitignore zum Ausschluss privater Verzeichnisse)

## Audit Logging aktivieren

Fügen Sie den Audit-Logger-Hook zu Ihrer `settings.json` hinzu:

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

Konfigurieren Sie auch den Audit-Log-Speicherort (Standard: `.claude/logs/audit.log`):

```bash
mkdir -p .claude/logs
echo ".claude/logs/" >> .gitignore
chmod 600 .claude/logs/audit.log  # Restrict read permissions
```

## Session-Wiederherstellung

Um eine Session aus Audit-Logs zu rekonstruieren:

```bash
# Count tool calls
jq -s 'length' .claude/logs/audit.log

# Filter nach Tool-Typ
jq 'select(.tool_name == "Bash")' .claude/logs/audit.log

# Export Session-Zeitleiste
jq '[.[] | {time: .timestamp, tool: .tool_name, cost: .session_cost_usd}]' .claude/logs/audit.log

# Find errors
jq 'select(.event_type == "error")' .claude/logs/audit.log

# Total session cost
jq '.[-1].session_cost_usd' .claude/logs/audit.log
```

## Compliance-Abfragen

### GDPR Datenanfragen
Rufen Sie alle Aktionen eines Benutzers innerhalb eines Datumbereichs ab:
```bash
jq --arg user "user@company.com" --arg start "2026-06-01" --arg end "2026-06-30" \
  'select(.user_id == $user and .timestamp >= $start and .timestamp <= $end)' \
  .claude/logs/audit.log | jq -s > gdpr-request-$user.jsonl
```

### SOC 2 Type II Änderungsprotokoll
Exportieren Sie alle Dateischreib für das Änderungsmanagement-Audit:
```bash
jq 'select(.tool_name == "Write" or .tool_name == "Edit") | 
    {timestamp, user_id, file_path: .tool_input.file_path, action: .tool_name}' \
  .claude/logs/audit.log > soc2-changes.jsonl
```

### Kostenzuordnung
Kosten nach Benutzer summieren:
```bash
jq 'select(.event_type == "session_end") | {user_id, cost: .session_cost_usd}' \
  .claude/logs/audit.log | jq -s 'group_by(.user_id) | map({user: .[0].user_id, total_cost: map(.cost) | add})'
```

## Verschlüsselung (Enterprise Cloud)

Auf Claudient Cloud:
- Audit-Logs sind **verschlüsselt im Ruhezustand** mit AES-256-GCM
- **Während der Übertragung**: TLS 1.3, gegenseitige Authentifizierung
- **Aufbewahrung**: 7 Jahre (konfigurierbar je nach Compliance-Anforderung)
- **Zugriff**: Rollenbasiert, Audit-Trail des Audit-Log-Zugriffs selbst

## Integrationspunkte

### SIEM-Integration
Exportieren Sie zu Splunk, DataDog oder ELK:

```bash
# Ship zu Splunk HTTP Event Collector
jq -Rs 'split("\n") | .[]' .claude/logs/audit.log | \
  while read line; do
    curl -X POST https://splunk.company.com:8088/services/collector \
      -H "Authorization: Splunk $SPLUNK_HEC_TOKEN" \
      -d "{\"event\": $line}"
  done
```

### Webhook-Benachrichtigungen
Versenden Sie Hochrisiko-Ereignisse (z. B. PII erkannt, Kosten überschritten) an Slack:

```bash
jq 'select(.compliance_flags.pii_detected == true or .compliance_flags.cost_limit_exceeded == true)' \
  .claude/logs/audit.log | \
  jq -Rs "curl -X POST $SLACK_WEBHOOK -H 'Content-Type: application/json' -d '{\"text\": \"Compliance alert: \(.)\"}'"
```

## Log-Rotation

Für lange laufende Sessions täglich rotieren:

```bash
# cron: 0 0 * * *
TIMESTAMP=$(date +%Y%m%d)
mv .claude/logs/audit.log .claude/logs/audit-${TIMESTAMP}.log.gz
gzip .claude/logs/audit-${TIMESTAMP}.log
# Archive zu S3, Glacier, etc.
```

## Compliance-Notizen

- **HIPAA**: Audit-Logs erfüllen die „Audit-Trail"-Anforderung unter 45 CFR §164.312(b)
- **SOC 2 Type II**: Unterstützt CC6.1, CC7.1 (Überwachungs- und Logging-Steuerungen)
- **GDPR**: Log-Aufbewahrung stimmt mit Datenspeichern überein
- **PCI-DSS**: 3.2.1 konform (restriktiver Zugriff, Verschlüsselung)

---

**Last updated**: 2026-06-15  
**Related files**: `SSO_SETUP.md`, `COMPLIANCE.md`
