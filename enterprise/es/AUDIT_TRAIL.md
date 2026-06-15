# Audit Trail & Session Logging

Enterprise Edition captura un audit trail completo de todas las acciones de Claude Code para cumplimiento, depuración y análisis forense. Este documento especifica el esquema, configuración y patrones de consulta.

## Descripción general

Cada llamada de herramienta, decisión de modelo y evento de sesión se registra en un archivo JSONL estructurado (`.claude/logs/audit.log`) con encriptación en reposo en despliegues Enterprise Cloud.

## Esquema del Audit Log

Cada línea es un objeto JSON válido con estos campos:

```json
{
  "timestamp": "2026-06-15T14:23:45.123456Z",
  "session_id": "sess_abc123def456",
  "user_id": "user@company.com",
  "session_cost_usd": 0.042,
  "event_type": "tool_call",
  "tool_name": "Bash",
  "tool_input": {"command": "git status"},
  "tool_output": {"exit_code": 0, "stdout": "On branch main"},
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

### Definiciones de campo

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `timestamp` | ISO 8601 | Timestamp UTC del evento |
| `session_id` | string | Único por sesión de Claude Code |
| `user_id` | string | Usuario conectado (desde git config o $USER) |
| `session_cost_usd` | number | Costo acumulativo de sesión en USD |
| `event_type` | enum | `tool_call`, `model_call`, `session_start`, `session_end`, `error` |
| `tool_name` | string | Herramienta invocada: `Bash`, `Read`, `Write`, `Edit`, etc. |
| `tool_input` | object | Entrada sanitizada (secretos eliminados) |
| `tool_output` | object | Resumen de salida (primeros 1KB, datos sensibles enmascarados) |
| `duration_ms` | number | Tiempo de pared para ejecución de herramienta |
| `context.branch` | string | Rama git actual |
| `context.working_dir` | string | Directorio de trabajo absoluto |
| `context.model` | string | Identificador de modelo Claude |
| `compliance_flags` | object | Flags booleanos para violaciones de cumplimiento |
| `metadata` | object | ID de tarea opcional, nombre de flujo de trabajo, etiquetas |

## Reglas de sanitización

Para prevenir fugas accidentales de secretos:

1. **Los secretos se eliminan**: Claves API, contraseñas, tokens que coinciden con `(password|secret|token|key|api_key)` se redactan como `[REDACTED]`
2. **PII se enmascara**: Direcciones de correo, números de teléfono, SSN se convierten en `[PII:EMAIL]`, `[PII:PHONE]`, etc.
3. **La salida del comando se trunca**: Solo se registran los primeros 1000 caracteres
4. **Las rutas de archivo se preservan**: Se registran rutas completas para responsabilidad (use .gitignore para excluir directorios privados)

## Habilitar Audit Logging

Agregue el hook del auditor a su `settings.json`:

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

También configure la ubicación del registro de auditoría (predeterminado: `.claude/logs/audit.log`):

```bash
mkdir -p .claude/logs
echo ".claude/logs/" >> .gitignore
chmod 600 .claude/logs/audit.log  # Restrict read permissions
```

## Reconstrucción de sesión

Para reconstruir una sesión desde registros de auditoría:

```bash
# Contar llamadas de herramientas
jq -s 'length' .claude/logs/audit.log

# Filtrar por tipo de herramienta
jq 'select(.tool_name == "Bash")' .claude/logs/audit.log

# Exportar cronología de sesión
jq '[.[] | {time: .timestamp, tool: .tool_name, cost: .session_cost_usd}]' .claude/logs/audit.log

# Buscar errores
jq 'select(.event_type == "error")' .claude/logs/audit.log

# Costo total de sesión
jq '.[-1].session_cost_usd' .claude/logs/audit.log
```

## Consultas de cumplimiento

### Solicitudes de datos GDPR
Recupere todas las acciones de un usuario dentro de un rango de fechas:
```bash
jq --arg user "user@company.com" --arg start "2026-06-01" --arg end "2026-06-30" \
  'select(.user_id == $user and .timestamp >= $start and .timestamp <= $end)' \
  .claude/logs/audit.log | jq -s > gdpr-request-$user.jsonl
```

### Registro de cambios SOC 2 Type II
Exporte todas las escrituras de archivo para auditoría de gestión de cambios:
```bash
jq 'select(.tool_name == "Write" or .tool_name == "Edit") | 
    {timestamp, user_id, file_path: .tool_input.file_path, action: .tool_name}' \
  .claude/logs/audit.log > soc2-changes.jsonl
```

### Atribución de costos
Suma costos por usuario:
```bash
jq 'select(.event_type == "session_end") | {user_id, cost: .session_cost_usd}' \
  .claude/logs/audit.log | jq -s 'group_by(.user_id) | map({user: .[0].user_id, total_cost: map(.cost) | add})'
```

## Encriptación (Enterprise Cloud)

En Claudient Cloud:
- Los registros de auditoría están **encriptados en reposo** con AES-256-GCM
- **En tránsito**: TLS 1.3, autenticación mutua
- **Retención**: 7 años (configurable según requisito de cumplimiento)
- **Acceso**: Basado en rol, audit trail de acceso al registro de auditoría en sí

## Puntos de integración

### Integración SIEM
Exportar a Splunk, DataDog o ELK:

```bash
# Enviar a Splunk HTTP Event Collector
jq -Rs 'split("\n") | .[]' .claude/logs/audit.log | \
  while read line; do
    curl -X POST https://splunk.company.com:8088/services/collector \
      -H "Authorization: Splunk $SPLUNK_HEC_TOKEN" \
      -d "{\"event\": $line}"
  done
```

### Notificaciones Webhook
Publique eventos de alto riesgo (por ejemplo, PII detectado, costo excedido) a Slack:

```bash
jq 'select(.compliance_flags.pii_detected == true or .compliance_flags.cost_limit_exceeded == true)' \
  .claude/logs/audit.log | \
  jq -Rs "curl -X POST $SLACK_WEBHOOK -H 'Content-Type: application/json' -d '{\"text\": \"Compliance alert: \(.)\"}'"
```

## Rotación de registro

Para sesiones de larga duración, rotar diariamente:

```bash
# cron: 0 0 * * *
TIMESTAMP=$(date +%Y%m%d)
mv .claude/logs/audit.log .claude/logs/audit-${TIMESTAMP}.log.gz
gzip .claude/logs/audit-${TIMESTAMP}.log
# Archiver a S3, Glacier, etc.
```

## Notas de cumplimiento

- **HIPAA**: Los registros de auditoría satisfacen el requisito de "audit trail" bajo 45 CFR §164.312(b)
- **SOC 2 Type II**: Apoya CC6.1, CC7.1 (controles de monitoreo y registro)
- **GDPR**: La retención de registros se alinea con las políticas de retención de datos
- **PCI-DSS**: Cumplimiento 3.2.1 (acceso restrictivo, encriptación)

---

**Last updated**: 2026-06-15  
**Related files**: `SSO_SETUP.md`, `COMPLIANCE.md`
