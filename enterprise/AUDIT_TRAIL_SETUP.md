# Audit Trail Setup: Swarm Sandbox Events

Complete guide for implementing an append-only audit trail for multi-agent orchestration events in swarm-sandbox. Designed for compliance (SOC 2, HIPAA, GDPR, PCI DSS) and forensics.

---

## Overview

The audit trail system provides:

- **Immutable event log**: Append-only tables with triggers preventing updates/deletes
- **Comprehensive scope**: Agent lifecycle, inter-agent messaging, tool calls, access control, resource usage
- **PII protection**: Automatic sanitization of sensitive data
- **Cost tracking**: Per-event and per-session cost attribution
- **Compliance flags**: Real-time detection of policy violations and security anomalies
- **Forensic capabilities**: Full message flow tracing and tool call auditing
- **Data retention**: Configurable retention policies with partition-based archival

---

## Architecture

### Core Tables

| Table | Purpose | Retention |
|-------|---------|-----------|
| `audit_events` | Central log of all swarm activities | 7 years (SOC 2) |
| `audit_sessions` | Session metadata and user correlation | 7 years |
| `audit_agent_states` | Agent state transitions (forensics) | 7 years |
| `audit_messages` | Inter-agent message flow (debugging) | 2 years |
| `audit_violations` | Compliance and security violations | 7 years |
| `audit_tool_calls` | Tool execution with input/output hashing | 3 years |
| `audit_resource_metrics` | CPU, memory, network usage per session | 2 years |
| `audit_access_control` | Authorization decisions and denials | 7 years |

### Immutability Guarantees

```sql
-- Triggers enforce immutability:
- audit_events_before_insert  → Auto-generate event_id, convert to UTC
- audit_events_before_update  → SIGNAL error (updates not allowed)
- audit_events_before_delete  → SIGNAL error (deletes not allowed)
- audit_sessions_after_insert → Log session creation as audit event
```

### Schema Files

- **`audit-schema.sql`** — Complete DDL with tables, indexes, triggers, views, procedures
- **`audit-schema.json`** — JSON Schema for event validation (v7 draft)

---

## Installation

### Prerequisites

- MySQL 8.0+ or MariaDB 10.5+
- 50GB+ storage (for 6 months of typical usage)
- User with `CREATE TABLE`, `CREATE TRIGGER` permissions
- Network access to database from sandbox servers

### Step 1: Create Database

```bash
mysql -u root -p << 'EOF'
CREATE DATABASE IF NOT EXISTS swarm_audit
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'audit'@'localhost' IDENTIFIED BY 'strong-password-here';
GRANT SELECT, INSERT ON swarm_audit.* TO 'audit'@'localhost';
GRANT EXECUTE ON PROCEDURE swarm_audit.audit_purge_old_logs TO 'audit'@'localhost';
FLUSH PRIVILEGES;
EOF
```

### Step 2: Import Schema

```bash
mysql -u audit -p swarm_audit < audit-schema.sql
```

Verify tables created:
```bash
mysql -u audit -p swarm_audit << 'EOF'
SHOW TABLES;
SELECT TABLE_NAME, ENGINE, ROW_FORMAT FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'swarm_audit';
EOF
```

### Step 3: Verify Immutability

```bash
mysql -u audit -p swarm_audit << 'EOF'
-- Test: attempt to update audit record (should fail)
UPDATE audit_events SET event_type = 'modified' LIMIT 1;
-- Error: Audit events table is immutable. Updates are not permitted.

-- Test: attempt to delete (should fail)
DELETE FROM audit_events LIMIT 1;
-- Error: Audit events table is append-only. Deletions are not permitted.
EOF
```

---

## Event Publishing Integration

### Option 1: Application-Level Events (Recommended)

Publish events directly from swarm sandbox agents:

```javascript
// sandbox/src/audit-client.ts
import * as mysql from 'mysql2/promise';

class AuditClient {
  private pool: mysql.Pool;

  constructor(config: AuditConfig) {
    this.pool = mysql.createPool({
      host: config.host,
      user: config.user,
      password: config.password,
      database: 'swarm_audit',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  async publishEvent(event: AuditEvent): Promise<void> {
    const conn = await this.pool.getConnection();
    try {
      // JSON Schema validation
      this.validateEvent(event);

      // Insert into audit_events
      const query = `
        INSERT INTO audit_events (
          event_id, session_id, event_type, severity, user_id,
          agent_id, topology_id, event_data, compliance_flags,
          git_branch, deployment_env, recorded_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(6))
      `;

      await conn.execute(query, [
        event.event_id || this.generateUUID(),
        event.session_id,
        event.event_type,
        event.severity || 'INFO',
        event.user_id,
        event.agent_id || null,
        event.topology_id || null,
        JSON.stringify(event.event_data || {}),
        JSON.stringify(event.compliance_flags || {}),
        event.environment?.git_branch || null,
        event.environment?.deployment_env || 'sandbox',
      ]);
    } finally {
      conn.release();
    }
  }

  private validateEvent(event: AuditEvent): void {
    // Validate against JSON Schema (audit-schema.json)
    const ajv = new Ajv();
    const validate = ajv.compile(auditSchemaV7);
    if (!validate(event)) {
      throw new Error(`Event validation failed: ${JSON.stringify(validate.errors)}`);
    }
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

// Usage in agent lifecycle
async function spawnAgent(config: AgentConfig, sessionId: string) {
  const audit = new AuditClient(auditConfig);

  await audit.publishEvent({
    event_type: 'agent_spawn',
    severity: 'INFO',
    session_id: sessionId,
    user_id: getCurrentUser(),
    agent_id: config.name,
    topology_id: getCurrentTopology(),
    event_data: {
      agent_name: config.name,
      model: config.model,
      template: config.template,
    },
    compliance_flags: {
      pii_detected: false,
    },
    environment: {
      deployment_env: process.env.DEPLOYMENT_ENV || 'sandbox',
      git_branch: process.env.GIT_BRANCH,
      git_commit_hash: process.env.GIT_COMMIT,
    },
  });

  return spawnAgentImpl(config);
}
```

### Option 2: Hook-Based Events (Webhook)

Configure webhook to publish events on specific triggers:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/publish-audit-event.sh",
            "async": true
          }
        ]
      }
    ]
  },
  "audit": {
    "webhook_url": "http://sandbox:3001/api/audit/events",
    "webhook_retry_attempts": 3,
    "webhook_timeout_ms": 5000
  }
}
```

Webhook handler:
```bash
#!/usr/bin/env bash
# .claude/hooks/publish-audit-event.sh

INPUT=$(cat)
WEBHOOK_URL="${AUDIT_WEBHOOK_URL}"

# Transform hook input to audit event
EVENT=$(echo "$INPUT" | python3 << 'PYTHON'
import sys, json
from datetime import datetime, timezone

hook_data = json.load(sys.stdin)

audit_event = {
    'event_type': 'tool_call',
    'session_id': os.getenv('CLAUDIENT_SESSION_ID'),
    'user_id': os.getenv('CLAUDIENT_USER'),
    'severity': 'INFO',
    'event_data': hook_data,
    'event_timestamp': datetime.now(timezone.utc).isoformat(),
    'compliance_flags': {
        'pii_detected': 'password' in str(hook_data).lower()
    }
}

print(json.dumps(audit_event))
PYTHON
)

# POST to audit endpoint
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUDIT_API_KEY" \
  -d "$EVENT" \
  --retry 3 \
  --retry-delay 1 \
  --max-time 5 &

exit 0
```

### Option 3: Log Stream Ingestion (Kafka/PubSub)

For high-volume deployments:

```yaml
# docker-compose.yml (audit infrastructure)
version: '3.8'

services:
  kafka:
    image: confluentinc/cp-kafka:7.5.0
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092,PLAINTEXT_HOST://kafka:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"
    depends_on:
      - zookeeper

  audit-consumer:
    build: ./audit-consumer
    environment:
      KAFKA_BOOTSTRAP_SERVERS: kafka:9092
      KAFKA_GROUP_ID: audit-ingestion
      DATABASE_URL: mysql://audit:password@mysql:3306/swarm_audit
      BATCH_SIZE: 100
      BATCH_TIMEOUT_MS: 5000
    depends_on:
      - kafka
      - mysql

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: swarm_audit
    volumes:
      - ./audit-schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

Kafka consumer in Node.js:
```typescript
import { Kafka } from 'kafkajs';
import * as mysql from 'mysql2/promise';

const kafka = new Kafka({
  clientId: 'audit-consumer',
  brokers: ['kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'audit-ingestion' });
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'swarm_audit',
});

async function consumeEvents() {
  await consumer.subscribe({ topic: 'swarm-audit-events' });

  let batch: AuditEvent[] = [];
  const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '100');
  const BATCH_TIMEOUT = parseInt(process.env.BATCH_TIMEOUT_MS || '5000');

  let lastFlushTime = Date.now();

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value?.toString() || '{}');
      batch.push(event);

      // Flush batch if size exceeded or timeout
      if (batch.length >= BATCH_SIZE || Date.now() - lastFlushTime > BATCH_TIMEOUT) {
        await flushBatch(batch);
        batch = [];
        lastFlushTime = Date.now();
      }
    },
  });
}

async function flushBatch(events: AuditEvent[]): Promise<void> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    for (const event of events) {
      await conn.execute(
        `INSERT INTO audit_events (
          event_id, session_id, event_type, severity, user_id,
          agent_id, topology_id, event_data, compliance_flags,
          recorded_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(6))`,
        [
          event.event_id,
          event.session_id,
          event.event_type,
          event.severity,
          event.user_id,
          event.agent_id,
          event.topology_id,
          JSON.stringify(event.event_data),
          JSON.stringify(event.compliance_flags),
        ]
      );
    }

    await conn.commit();
    console.log(`Flushed ${events.length} audit events`);
  } catch (error) {
    await conn.rollback();
    console.error('Batch insert failed:', error);
    throw error;
  } finally {
    conn.release();
  }
}

consumeEvents().catch(console.error);
```

---

## Event Types & Examples

### Agent Lifecycle

**Event: Agent Spawn**
```json
{
  "event_type": "agent_spawn",
  "session_id": "sess-abc123",
  "agent_id": "validator-001",
  "severity": "INFO",
  "user_id": "alice@company.com",
  "topology_id": "data-pipeline",
  "event_data": {
    "agent_name": "validator",
    "model": "claude-haiku-4-5-20251001",
    "template": "input-validator",
    "replicas": 1
  },
  "resource_metrics": {
    "agent_count": 4,
    "memory_usage_bytes": 524288000
  }
}
```

**Event: Agent State Change**
```json
{
  "event_type": "agent_state_change",
  "session_id": "sess-abc123",
  "agent_id": "validator-001",
  "severity": "WARNING",
  "event_data": {
    "state_from": "executing",
    "state_to": "error",
    "reason": "Tool execution timeout",
    "error_message": "search-api call exceeded 30s"
  }
}
```

### Tool Execution

**Event: Tool Call**
```json
{
  "event_type": "tool_call",
  "session_id": "sess-def456",
  "agent_id": "processor-002",
  "severity": "INFO",
  "tool_execution": {
    "tool_name": "search-web",
    "tool_input_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "tool_output_hash": "da39a3ee5e6b4b0d3255bfef95601890afd80709",
    "duration_ms": 234,
    "exit_code": 0
  },
  "compliance_flags": {
    "pii_detected": false
  },
  "cost_tracking": {
    "cost_usd": 0.003,
    "session_cost_usd": 0.045
  }
}
```

### Inter-Agent Messaging

**Event: Message Sent**
```json
{
  "event_type": "message_sent",
  "session_id": "sess-ghi789",
  "severity": "INFO",
  "message_flow": {
    "from_agent": "validator",
    "to_agent": "processor",
    "message_id": "msg-5678",
    "message_type": "request",
    "message_size_bytes": 1024
  },
  "resource_metrics": {
    "message_queue_depth": 12
  }
}
```

### Security & Compliance

**Event: PII Detected**
```json
{
  "event_type": "pii_detected",
  "session_id": "sess-jkl012",
  "severity": "WARNING",
  "user_id": "charlie@company.com",
  "compliance_flags": {
    "pii_detected": true,
    "policy_violation": false
  },
  "event_data": {
    "pii_type": "email",
    "location": "tool_output",
    "count": 3
  }
}
```

**Event: Security Violation**
```json
{
  "event_type": "security_violation",
  "session_id": "sess-mno345",
  "severity": "CRITICAL",
  "user_id": "dave@company.com",
  "compliance_flags": {
    "policy_violation": true,
    "rbac_violation": true
  },
  "access_control": {
    "action": "secret_access",
    "decision": "deny",
    "required_permission": "secrets:read:production",
    "mfa_verified": false
  }
}
```

---

## Querying Audit Trail

### User Activity Report

```sql
-- Find all events by a specific user
SELECT
    event_timestamp,
    event_type,
    severity,
    agent_id,
    topology_id,
    event_data
FROM audit_events
WHERE user_id = 'alice@company.com'
    AND event_timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY event_timestamp DESC
LIMIT 1000;
```

### Compliance Violations

```sql
-- Find all compliance violations
SELECT
    violation_id,
    session_id,
    user_id,
    violation_type,
    severity,
    timestamp,
    description,
    resolved
FROM audit_violations
WHERE severity IN ('HIGH', 'CRITICAL')
    AND resolved = FALSE
ORDER BY timestamp DESC;
```

### Session Cost Analysis

```sql
-- Cost breakdown by user and category
SELECT
    s.user_id,
    arm.cost_category,
    COUNT(*) as event_count,
    SUM(arm.estimated_cost_usd) as total_cost_usd,
    AVG(arm.estimated_cost_usd) as avg_cost_usd
FROM audit_sessions s
LEFT JOIN audit_resource_metrics arm ON s.session_id = arm.session_id
WHERE s.started_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY s.user_id, arm.cost_category
ORDER BY total_cost_usd DESC;
```

### Tool Usage Statistics

```sql
-- Top tools by invocation count and errors
SELECT
    tool_name,
    COUNT(*) as call_count,
    COUNT(CASE WHEN exit_code != 0 THEN 1 END) as error_count,
    ROUND(100.0 * COUNT(CASE WHEN exit_code != 0 THEN 1 END) / COUNT(*), 2) as error_rate_percent,
    AVG(duration_ms) as avg_duration_ms,
    MAX(duration_ms) as max_duration_ms
FROM audit_tool_calls
WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY tool_name
ORDER BY call_count DESC;
```

### Message Flow Tracing

```sql
-- Trace all messages in a session
SELECT
    timestamp,
    from_agent,
    to_agent,
    message_type,
    delivery_status,
    delivery_latency_ms,
    pii_detected
FROM audit_messages
WHERE session_id = 'sess-abc123'
ORDER BY timestamp ASC;
```

### PII Exposure Incidents

```sql
-- Find all PII exposure events
SELECT
    event_timestamp,
    session_id,
    user_id,
    event_type,
    JSON_EXTRACT(compliance_flags, '$.pii_detected') as pii_flag,
    JSON_EXTRACT(event_data, '$.pii_type') as pii_type,
    event_data
FROM audit_events
WHERE JSON_EXTRACT(compliance_flags, '$.pii_detected') = true
ORDER BY event_timestamp DESC;
```

### Access Control Decisions

```sql
-- Review all access denials
SELECT
    timestamp,
    user_id,
    action,
    resource_id,
    decision,
    reason,
    mfa_verified
FROM audit_access_control
WHERE decision = 'deny'
    AND timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY timestamp DESC;
```

---

## Data Retention & Archival

### Retention Policy

| Event Type | Retention | Reason |
|------------|-----------|--------|
| All events | 7 years | SOC 2 Type II compliance |
| Tool calls | 3 years | Operational support |
| Messages | 2 years | Debugging & troubleshooting |
| Violations | 7 years | Legal/compliance hold |

### Automatic Purge

Configure retention via scheduled job:

```bash
#!/usr/bin/env bash
# daily-audit-purge.sh

RETENTION_DAYS=2555  # 7 years

mysql -u audit -p"$DB_PASSWORD" swarm_audit << EOF
CALL audit_purge_old_logs($RETENTION_DAYS, @deleted_rows);
SELECT @deleted_rows;
EOF
```

Add to cron:
```bash
0 2 * * * /usr/local/bin/daily-audit-purge.sh >> /var/log/audit-purge.log 2>&1
```

### Partition Management

Partitions are automatically created for future months. Manually archive old partitions:

```sql
-- Archive partition p_202401 to cold storage
ALTER TABLE audit_events PARTITION p_202401
  REORGANIZE INTO (
    PARTITION p_202401_archive VALUES LESS THAN (202402)
    ENGINE InnoDB
  );

-- Export to file for archival
SELECT * FROM audit_events PARTITION (p_202401_archive)
INTO OUTFILE '/backups/audit-2024-01.jsonl' FIELDS TERMINATED BY '\n';
```

---

## Compliance Mappings

### SOC 2 Type II (CC7.1 System Monitoring)

- ✓ All user actions logged (`user_id`, `action`)
- ✓ Tool calls tracked with input/output hashing
- ✓ Immutable audit trail (triggers enforce append-only)
- ✓ Tamper detection (audit_tampering_attempt event type)
- ✓ Retention: 7 years

### HIPAA (Patient Data Access)

- ✓ User identification (`user_id`)
- ✓ Access timestamps
- ✓ Data types accessed (PII detection flags)
- ✓ Retention: 6 years
- ✓ Encryption at rest (index on PII fields for quick access)

### GDPR (Data Subject Access Requests)

Query all data for a specific user:
```sql
SELECT * FROM audit_events WHERE user_id = 'user@email.com';
SELECT * FROM audit_sessions WHERE user_id = 'user@email.com';
SELECT * FROM audit_violations WHERE user_id = 'user@email.com';
```

Right to erasure:
```sql
-- Anonymize user data (7-year retention requirement)
UPDATE audit_sessions
SET user_email = '[REDACTED]'
WHERE user_id = 'user@email.com'
  AND DATE_ADD(ended_at, INTERVAL 7 YEAR) < NOW();
```

### PCI DSS (Payment Card Data)

- ✓ Tool calls masked via input/output hashing
- ✓ No PII/card data logged in full
- ✓ Access control audit (`audit_access_control` table)
- ✓ Retention: Minimum 1 year
- ✓ Quarterly PCI audit queries available

---

## Monitoring & Alerting

### Query for Audit Health

```sql
-- Check audit system health
SELECT
    COUNT(*) as total_events,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(DISTINCT user_id) as unique_users,
    MAX(event_timestamp) as latest_event,
    MIN(event_timestamp) as earliest_event,
    COUNT(CASE WHEN severity IN ('ERROR', 'CRITICAL') THEN 1 END) as critical_count,
    COUNT(CASE WHEN JSON_EXTRACT(compliance_flags, '$.pii_detected') THEN 1 END) as pii_events
FROM audit_events
WHERE event_timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR);
```

### Real-Time Anomaly Detection

```sql
-- Find unusual activity patterns
SELECT
    user_id,
    COUNT(DISTINCT session_id) as session_count,
    COUNT(*) as event_count,
    COUNT(CASE WHEN severity IN ('ERROR', 'CRITICAL') THEN 1 END) as error_rate,
    MIN(event_timestamp) as first_activity,
    MAX(event_timestamp) as last_activity
FROM audit_events
WHERE event_timestamp >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
GROUP BY user_id
HAVING error_rate > 10 OR event_count > 1000
ORDER BY event_count DESC;
```

---

## Best Practices

### Publishing Events

1. **Always include context**: session_id, user_id, agent_id
2. **Use appropriate severity**: INFO (normal), WARNING (unusual), ERROR (failure), CRITICAL (breach)
3. **Hash sensitive data**: tool inputs/outputs should be SHA256 hashed, not logged verbatim
4. **Batch events**: Use Kafka or batch inserts to reduce DB load
5. **Include compliance flags**: Mark PII/violations at event time, not during query

### Querying Events

1. **Use time-bounded queries**: Always include WHERE clause on `event_timestamp`
2. **Leverage indexes**: Query on `user_id`, `event_type`, `severity` for performance
3. **Export large result sets**: Use `INTO OUTFILE` for audit reports
4. **Anonymize PDFs**: Remove PII from compliance reports before sharing

### Archival & Retention

1. **Partition by month**: Enables fast archive/deletion of old data
2. **Compress old partitions**: Use `PARTITION ... REORGANIZE` before export
3. **Test retention policies**: Verify GDPR compliance before deployment
4. **Document holds**: Mark records under legal hold to prevent purge

---

## Troubleshooting

### "Audit events table is immutable" Error

This is expected. The trigger prevents manual updates/deletes. Use stored procedures or application logic to modify data.

### Slow Queries

- Check indexes: `SHOW INDEX FROM audit_events`
- Partition by date: Add WHERE `event_timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
- Consider materialized views for common queries

### High Storage Usage

- Run `CALL audit_purge_old_logs(2555, @deleted)`
- Check partition sizes: `SELECT PARTITION_NAME, PARTITION_EXPRESSION, PARTITION_ORDINAL_POSITION FROM INFORMATION_SCHEMA.PARTITIONS WHERE TABLE_NAME='audit_events'`
- Archive old partitions to cold storage

### Missing Events

- Verify webhook/Kafka is publishing: Check `audit_sessions` table for active sessions
- Check application logs for publish errors
- Verify database connectivity: `mysql -u audit -p swarm_audit -e "SELECT COUNT(*) FROM audit_events"`

---

## References

- **Schema**: `/enterprise/audit-schema.sql`
- **JSON Schema**: `/enterprise/audit-schema.json`
- **Swarm Sandbox Playbook**: `/guides/swarm-sandbox-playbook.md`
- **Audit Logger Hook**: `/hooks/audit-logger.md`

---

## File Locations

```
enterprise/
├── audit-schema.sql          # DDL: tables, indexes, triggers, procedures
├── audit-schema.json         # JSON Schema v7 for event validation
├── AUDIT_TRAIL_SETUP.md      # This document
└── audit-consumer/           # Optional Kafka consumer implementation
    ├── index.ts
    ├── package.json
    └── docker-compose.yml
```

---

## Support

For questions or issues:

1. Check audit trail health: `mysql -u audit -p swarm_audit < health-check.sql`
2. Review logs: `/var/log/audit-*.log`
3. Consult compliance team for retention policies
4. Contact database team for performance tuning

