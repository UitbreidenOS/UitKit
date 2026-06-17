# Audit Trail Integration Guide

## Overview

Comprehensive guide for integrating AI compliance and governance events into centralized audit trail systems for regulatory inspection, forensic analysis, and incident investigation.

---

## Why Audit Trails Matter for AI Compliance

**Regulatory Requirements:**
- **GDPR Article 5(1)(f):** "integrity and confidentiality... processed in a manner that ensures appropriate security"
- **GDPR Article 32:** "log records of access to personal data"
- **HIPAA § 164.312(b):** "log and monitor user access"
- **AI Act:** "documented record-keeping" for high-risk systems; 3-year retention
- **FCRA:** Fair lending decisions logged and auditable

**Compliance Benefits:**
- **Evidence for Audits:** Regulators inspect audit trails; inability to produce = automatic compliance violation
- **Incident Investigation:** When model fails, review audit trail to determine cause
- **Accountability:** Know who made what decision when; trace back to approvers and authorizers
- **Pattern Detection:** Spot suspicious behavior (repeated model retraining, unusual API access patterns)

**Legal Protection:**
- Demonstrates good-faith compliance effort
- Shows controls were in place (reduces fines if incident occurs)
- Proves timely incident response

---

## Events to Log

### Model Lifecycle Events

| Event | Trigger | Data to Log |
|-------|---------|------------|
| **Model Registered** | New model added to governance | Model ID, owner, purpose, version, architecture |
| **Model Trained** | Training job completes | Model ID, training data version, hyperparameters, seed, results, trainer |
| **Model Evaluated** | Evaluation/testing completes | Model ID, test dataset, metrics (accuracy, fairness, security), evaluator |
| **Model Reviewed** | Compliance/audit review | Model ID, reviewer, findings, pass/fail, required actions |
| **Model Approved** | Approved for deployment | Model ID, approver role, approval timestamp, conditions |
| **Model Deployed** | Deployed to production | Model ID, version, environment, deployment_by, timestamp |
| **Model Updated** | Model weights/config changed | Model ID, version, change description, change_by, impact analysis |
| **Model Retired** | Removed from production | Model ID, retirement_date, reason, data deletion confirmation |

### Fairness & Bias Events

| Event | Trigger | Data to Log |
|-------|---------|------------|
| **Fairness Audit Completed** | Bias audit executed | Model ID, protected classes, fairness metrics, disparities, audit_date |
| **Disparity Detected** | Fairness metric exceeds threshold | Model ID, protected class, metric name, threshold, actual value, severity |
| **Mitigation Implemented** | Fairness gap addressed | Model ID, mitigation type (data rebalancing, fairness constraints, etc.), completion date |
| **Fairness Monitoring Alert** | Real-time fairness alert triggered | Model ID, metric, value, threshold, timestamp, severity |

### Data Governance Events

| Event | Trigger | Data to Log |
|-------|---------|------------|
| **Consent Record Created** | User consents to data processing | User ID (hashed/encrypted), purpose, timestamp, consent method |
| **Consent Withdrawn** | User withdraws consent | User ID (hashed), withdrawal_timestamp, reason |
| **Data Access Logged** | Authorized access to data | Accessor (role/user), data accessed, access_purpose, timestamp, duration |
| **Data Deletion Executed** | Data deleted per retention policy | Data ID, deletion_reason (retention expiry, user request, etc.), deletion_timestamp, verified_by |
| **Lineage Documented** | Data flow recorded | Source → transformation → destination, timestamp, verified_by |

### Regulatory & Compliance Events

| Event | Trigger | Data to Log |
|-------|---------|------------|
| **Compliance Checklist Completed** | Pre-deployment checklist signed off | Model ID, checklist items, signoff by (names/roles), timestamp |
| **Risk Assessment Completed** | Risk register finalized | Model ID, risks identified, risk scores, mitigations, approval by |
| **Regulatory Mapping Done** | Regulations mapped to controls | Model ID, regulations identified, requirements mapped, gaps identified, owner |
| **Incident Detected** | AI incident occurs | Incident ID, type (fairness, security, performance, regulatory), severity, detection_timestamp |
| **Incident Escalated** | Incident escalated to management | Incident ID, escalation level, escalated_to (roles), escalation_timestamp, actions taken |
| **Regulatory Inquiry Received** | Regulator requests information | Inquiry date, regulator, inquiry topic, documents provided, response_date |

### Security & Access Control Events

| Event | Trigger | Data to Log |
|-------|---------|------------|
| **Access Granted** | User granted access to model/data | User, resource, access_level, granted_by, timestamp, justification |
| **Access Revoked** | User access removed | User, resource, revoked_by, timestamp, reason |
| **Unauthorized Access Attempt** | Failed or suspicious access | User/IP, resource, attempt_timestamp, reason (auth failed, permission denied) |
| **API Key Rotated** | Authentication credentials updated | Key ID, rotation_timestamp, rotated_by, services affected |
| **Security Patch Applied** | System vulnerability patched | Service, CVE ID, patch_date, applied_by, systems affected |

---

## Log Entry Format

### Standard JSON Schema

All audit log entries should follow this structure:

```json
{
  "log_entry_id": "AUD-20260615-001234",
  "timestamp": "2026-06-15T14:32:00.000Z",
  "event_type": "model_deployed",
  "severity": "info",
  "actor": {
    "user_id": "alice@company.com",
    "role": "ml-engineer",
    "department": "data-science"
  },
  "resource": {
    "type": "model",
    "id": "loan-default-predictor",
    "version": "v2.3"
  },
  "action": {
    "type": "deploy",
    "status": "success",
    "environment": "production",
    "change_summary": "Deployed v2.3 with fairness mitigations"
  },
  "context": {
    "request_id": "REQ-20260615-5678",
    "ip_address": "192.168.1.100",
    "session_id": "SESSION-abc123",
    "related_incidents": ["INC-20260615-001"],
    "compliance_status": "approved",
    "approvers": ["bob@company.com", "carol@company.com"]
  },
  "details": {
    "model_metrics": {
      "accuracy": 0.94,
      "fairness_gap": 0.05
    },
    "risk_level": "medium",
    "compliance_checklist_passed": true
  },
  "tags": ["production", "high-stakes", "compliance-critical"]
}
```

### Minimal Log Entry (for high-volume events)

```json
{
  "timestamp": "2026-06-15T14:32:00Z",
  "event": "data_access",
  "actor": "data-scientist-1",
  "resource": "customer_profiles_dataset",
  "action": "query",
  "result": "success"
}
```

---

## Integration Patterns

### Pattern 1: Real-Time Event Streaming (Recommended)

Events streamed immediately to audit system as they occur.

```python
# Python example using Splunk HTTP Event Collector
import json
import requests
from datetime import datetime

class AuditLogger:
    def __init__(self, splunk_hec_url, hec_token):
        self.url = splunk_hec_url
        self.headers = {
            "Authorization": f"Splunk {hec_token}",
            "Content-Type": "application/json"
        }
    
    def log_event(self, event_type, actor, resource, action, details=None, severity="info"):
        event = {
            "timestamp": datetime.utcnow().isoformat(),
            "event_type": event_type,
            "actor": actor,
            "resource": resource,
            "action": action,
            "details": details or {},
            "severity": severity
        }
        
        payload = {
            "event": event,
            "source": "ai_compliance_system",
            "sourcetype": "ai_audit"
        }
        
        response = requests.post(
            self.url,
            headers=self.headers,
            json=payload
        )
        
        if response.status_code != 200:
            raise Exception(f"Audit logging failed: {response.text}")

# Usage
logger = AuditLogger(
    splunk_hec_url="https://splunk-instance.company.com:8088/services/collector",
    hec_token="your_hec_token"
)

# Log model deployment
logger.log_event(
    event_type="model_deployed",
    actor="alice@company.com",
    resource={"type": "model", "id": "loan-default-predictor", "version": "v2.3"},
    action={"type": "deploy", "target": "production", "status": "success"},
    details={
        "compliance_approved": True,
        "fairness_gap": 0.05,
        "risk_level": "medium"
    },
    severity="info"
)
```

### Pattern 2: Batch Event Collection (for lower-latency systems)

Events buffered and sent in batches every N seconds/events.

```python
import json
from collections import deque
import threading
import time

class BatchAuditLogger:
    def __init__(self, backend_url, batch_size=100, flush_interval=30):
        self.backend_url = backend_url
        self.batch_size = batch_size
        self.flush_interval = flush_interval
        self.buffer = deque()
        self.lock = threading.Lock()
        
        # Start background flush thread
        self.flush_thread = threading.Thread(target=self._periodic_flush, daemon=True)
        self.flush_thread.start()
    
    def log_event(self, event):
        with self.lock:
            self.buffer.append(event)
            
            # Flush if batch size reached
            if len(self.buffer) >= self.batch_size:
                self._flush()
    
    def _flush(self):
        if len(self.buffer) == 0:
            return
        
        events = list(self.buffer)
        self.buffer.clear()
        
        payload = {"events": events, "batch_size": len(events)}
        
        try:
            requests.post(
                f"{self.backend_url}/audit/events",
                json=payload,
                timeout=5
            )
        except Exception as e:
            # Log failure; do not block application
            print(f"Audit batch submission failed: {e}")
            # Optionally: re-add events to buffer for retry
    
    def _periodic_flush(self):
        while True:
            time.sleep(self.flush_interval)
            with self.lock:
                self._flush()
```

### Pattern 3: Database-Backed Audit Trail (for on-premises)

Events written to immutable database table.

```python
import sqlite3
import json
from datetime import datetime

class DatabaseAuditLogger:
    def __init__(self, db_path):
        self.db_path = db_path
        self._init_db()
    
    def _init_db(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS audit_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                event_type TEXT NOT NULL,
                actor TEXT NOT NULL,
                resource TEXT NOT NULL,
                action TEXT NOT NULL,
                details TEXT,
                severity TEXT DEFAULT 'info',
                UNIQUE(timestamp, event_type, actor)  -- Prevent exact duplicates
            )
        """)
        conn.commit()
        conn.close()
    
    def log_event(self, event):
        conn = sqlite3.connect(self.db_path)
        try:
            conn.execute("""
                INSERT INTO audit_log 
                (timestamp, event_type, actor, resource, action, details, severity)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                datetime.utcnow().isoformat(),
                event["event_type"],
                event["actor"],
                json.dumps(event["resource"]),
                json.dumps(event["action"]),
                json.dumps(event.get("details", {})),
                event.get("severity", "info")
            ))
            conn.commit()
        finally:
            conn.close()
```

---

## Retention & Archival

### Retention Periods by Event Type

| Event Type | Retention Period | Justification |
|---|---|---|
| Model deployment, approval | 3+ years | AI Act requires 3-year record-keeping |
| Fairness audit results | 3+ years | Regulatory proof of compliance |
| Data deletion events | 7 years | GDPR/HIPAA requirements |
| Access logs | 1-3 years | Security audit trail; most incidents resolved within 1 year |
| Incident logs | Indefinite | Legal defense; may be needed in litigation |
| Performance metrics | 2+ years | Trend analysis; identify historical issues |

### Archival Strategy

```
Production Audit Trail (Hot)
├── Last 90 days: Searchable, real-time queries
├── Last 1 year: Archived but searchable (slower)
└── 1-7 years: Cold storage (encrypted, access-restricted)
   └── Deleted: Verified and logged deletion
```

### Example Archival Policy

```python
class AuditTrailArchival:
    """Manage archival and retention of audit logs"""
    
    def archive_old_logs(self):
        """Move logs older than 90 days to archive storage"""
        cutoff_date = datetime.now() - timedelta(days=90)
        
        # Query logs before cutoff date
        old_logs = self.db.query(f"timestamp < '{cutoff_date.isoformat()}'")
        
        # Compress and encrypt
        archive_file = self.encrypt_and_compress(old_logs)
        
        # Upload to cold storage (S3 Glacier, Azure Archive)
        self.upload_to_cold_storage(archive_file)
        
        # Delete from hot storage
        self.db.delete(f"timestamp < '{cutoff_date.isoformat()}'")
        
        # Log the archival action (meta-audit)
        self.log_event({
            "event_type": "audit_log_archived",
            "details": {"logs_archived": len(old_logs), "archive_location": "s3://..."}
        })
    
    def delete_expired_logs(self):
        """Delete logs that have exceeded retention period"""
        retention_period = timedelta(days=365)
        expiry_date = datetime.now() - retention_period
        
        # Verify no active incidents or litigation involving these logs
        if self.has_active_holds(expiry_date):
            return  # Do not delete
        
        # Delete with verification
        deleted_count = self.db.delete(f"timestamp < '{expiry_date.isoformat()}'")
        
        # Log deletion (for regulatory proof)
        self.log_event({
            "event_type": "audit_log_deleted",
            "details": {
                "count": deleted_count,
                "reason": "retention_period_expired",
                "verified_by": "automated_process"
            },
            "severity": "high"  # High severity ensures it's preserved
        })
```

---

## Querying & Analysis

### Common Queries

```sql
-- Find all model deployments in last 30 days
SELECT * FROM audit_log
WHERE event_type = 'model_deployed'
  AND timestamp >= datetime('now', '-30 days')
ORDER BY timestamp DESC;

-- Find all fairness incidents
SELECT * FROM audit_log
WHERE event_type LIKE 'fairness_%' OR event_type LIKE 'disparity_%'
  AND severity IN ('high', 'critical')
ORDER BY timestamp DESC;

-- Find access by specific user
SELECT * FROM audit_log
WHERE actor = 'alice@company.com'
  AND timestamp >= datetime('now', '-90 days')
ORDER BY timestamp DESC;

-- Find data deletion requests and confirmations
SELECT * FROM audit_log
WHERE event_type = 'data_deletion'
  AND action = 'delete'
  AND status = 'completed'
ORDER BY timestamp DESC;

-- Timeline of incident investigation
SELECT * FROM audit_log
WHERE tags CONTAINS 'INC-20260615-001'
ORDER BY timestamp ASC;
```

### Example Analysis: Fairness Audit Trail

```python
# Find all fairness events for a model in Q2 2026
def get_fairness_timeline(model_id, quarter="Q2", year=2026):
    q2_start = f"2026-04-01T00:00:00Z"
    q2_end = f"2026-06-30T23:59:59Z"
    
    events = db.query(f"""
        SELECT timestamp, event_type, details
        FROM audit_log
        WHERE resource_id = '{model_id}'
          AND event_type IN ('fairness_audit_completed', 'disparity_detected', 'mitigation_implemented')
          AND timestamp BETWEEN '{q2_start}' AND '{q2_end}'
        ORDER BY timestamp ASC
    """)
    
    # Analyze progression
    for event in events:
        print(f"{event['timestamp']}: {event['event_type']}")
        print(f"  Details: {event['details']}")
    
    # Summarize
    audits = [e for e in events if e['event_type'] == 'fairness_audit_completed']
    disparities = [e for e in events if e['event_type'] == 'disparity_detected']
    mitigations = [e for e in events if e['event_type'] == 'mitigation_implemented']
    
    print(f"\nSummary Q2 2026:")
    print(f"  Fairness audits: {len(audits)}")
    print(f"  Disparities detected: {len(disparities)}")
    print(f"  Mitigations implemented: {len(mitigations)}")
```

---

## Compliance Reporting from Audit Trail

### Generating Compliance Reports

```python
class ComplianceReporter:
    """Generate compliance evidence from audit trail"""
    
    def generate_gdpr_compliance_report(self, date_range):
        """Generate GDPR compliance report"""
        return {
            "period": date_range,
            "consent_records": self._count_events("consent_record_created"),
            "consent_withdrawals": self._count_events("consent_withdrawn"),
            "data_deletions": self._count_events("data_deletion"),
            "data_access_logs": self._count_events("data_access_logged"),
            "dpia_assessments": self._count_events("dpia_completed"),
            "incidents": self._get_incidents_by_severity()
        }
    
    def generate_ai_act_compliance_report(self, date_range):
        """Generate EU AI Act compliance report"""
        return {
            "period": date_range,
            "risk_assessments": self._count_events("risk_assessment_completed"),
            "compliance_checklists": self._count_events("compliance_checklist_completed"),
            "fairness_audits": self._count_events("fairness_audit_completed"),
            "documentation_created": self._count_events("model_card_created"),
            "incidents_tracked": self._count_events("incident_detected")
        }
    
    def generate_incident_timeline(self, incident_id):
        """Generate timeline of incident detection, escalation, resolution"""
        return self.db.query(f"""
            SELECT timestamp, event_type, actor, action, details
            FROM audit_log
            WHERE tags CONTAINS '{incident_id}'
            ORDER BY timestamp ASC
        """)
```

---

## Security & Integrity

### Ensure Audit Trail Cannot Be Tampered

1. **Write-Once Storage:** Audit logs are write-once; cannot be deleted or modified
2. **Encryption:** All audit data encrypted at rest (AES-256) and in transit (TLS 1.3)
3. **Access Control:** Only authorized personnel (Compliance Officer, CISO) can access audit logs
4. **Checksums:** Hash each log entry; verify integrity during queries
5. **Replication:** Audit logs replicated to separate, secure storage (immutable append-only)
6. **Monitoring:** Monitor access to audit logs; alert if unauthorized access attempted

### Example: Checksummed Audit Entry

```python
import hashlib

def create_verified_log_entry(event, previous_hash):
    """Create audit entry with cryptographic chain"""
    
    # Create entry
    entry = {
        "sequence_number": get_next_sequence_number(),
        "timestamp": datetime.utcnow().isoformat(),
        "event": event,
        "previous_hash": previous_hash,
    }
    
    # Create hash of this entry
    entry_json = json.dumps(entry, sort_keys=True)
    entry_hash = hashlib.sha256(entry_json.encode()).hexdigest()
    entry["entry_hash"] = entry_hash
    
    # Store
    store_immutable_log(entry)
    
    return entry_hash

def verify_audit_trail():
    """Verify no logs have been tampered with"""
    logs = retrieve_all_logs()
    
    previous_hash = None
    for log in logs:
        # Verify chain
        if log["previous_hash"] != previous_hash:
            raise SecurityError(f"Audit trail broken at {log['sequence_number']}")
        
        # Verify hash
        log_copy = log.copy()
        del log_copy["entry_hash"]
        computed_hash = hashlib.sha256(json.dumps(log_copy, sort_keys=True).encode()).hexdigest()
        
        if computed_hash != log["entry_hash"]:
            raise SecurityError(f"Log entry hash mismatch at {log['sequence_number']}")
        
        previous_hash = log["entry_hash"]
    
    print("✓ Audit trail verified: no tampering detected")
```

---

## Best Practices

1. **Log at the right level:** Log deployment decisions, fairness audits, regulatory events. Do not log every inference (too much data).
2. **Include context:** Log who did what, when, and why. Include approval/decision reference.
3. **Use consistent timestamps:** UTC, ISO 8601 format. Avoid timezone confusion.
4. **Encrypt sensitive data:** PII, health data, financial data should be encrypted in logs.
5. **Immutable storage:** Use write-once databases or append-only object storage.
6. **Regular audits:** Quarterly review audit logs for completeness and integrity.
7. **Retention policy:** Document why logs are retained for specified period; delete when no longer needed.
8. **Regulatory alignment:** Ensure audit log schema supports GDPR, AI Act, HIPAA, FCRA compliance questions.

---

## References

- GDPR Article 5(1)(f), Article 32 — Logging and monitoring requirements
- HIPAA § 164.312(b) — Audit controls
- EU AI Act Article 10 — Record-keeping for high-risk systems
- NIST CSF — Security function (Detect, Respond)
