# Incident Logger Hook

## Purpose

Automatically log AI-related incidents (fairness alerts, performance degradation, security events, compliance gaps) to centralized audit trail with automatic escalation to compliance team. Ensures all incidents are documented, timestamped, and escalated according to severity level and regulatory requirements.

## settings.json Configuration

```json
{
  "hooks": {
    "onCommandComplete": {
      "incident-logger": {
        "shell": "bash",
        "script": "ai_compliance_risk_stack/hooks/incident-logger.sh",
        "filter": {
          "command": ["audit", "test", "deploy", "evaluate", "validate"],
          "keywords": ["incident", "alert", "error", "fairness", "drift", "security", "breach", "compliance"]
        }
      }
    }
  }
}
```

## Hook Behavior

This hook fires after commands complete when incidents or alerts are detected. It:

1. **Detects Incident Triggers**
   - Fairness metrics fall below threshold (demographic disparity > 10%)
   - Model accuracy degrades > 5% from baseline
   - Security alert or suspected attack detected
   - Compliance gap discovered during audit
   - User complaint or regulatory inquiry received
   - Data breach or unauthorized access detected

2. **Logs Incident Details**
   - Incident ID (auto-generated timestamp-based)
   - Incident type and severity (Critical/High/Medium/Low)
   - Timestamp of detection
   - Affected system/model
   - Initial description and supporting evidence
   - Detected by (user/automation)

3. **Escalates Based on Severity**
   
   | Severity | Action | Timeline | Escalation |
   |----------|--------|----------|-----------|
   | **Critical** | Page on-call | Immediate | CISO, CRO, CEO, General Counsel |
   | **High** | Create incident ticket; page Compliance | 1 hour | CRO, General Counsel, VP Engineering |
   | **Medium** | Create incident ticket; notify team | 4 hours | Compliance Officer, Model Owner |
   | **Low** | Log to incident register; review weekly | 24 hours | Team lead |

4. **Generates Incident Record**
   - Unique incident ID
   - Structured data for analysis
   - Audit trail entry (for regulatory inspection)
   - Assignee and follow-up date
   - Links to related artifacts (model card, risk register, etc.)

5. **Triggers Notification**
   - Email or Slack to escalation contacts
   - Includes incident summary, severity, immediate actions
   - Links to incident dashboard for details

## Implementation

Hook script: `ai_compliance_risk_stack/hooks/incident-logger.sh`

The script:
- Parses command output for incident keywords/alerts
- Determines severity level based on threshold and impact
- Logs to centralized incident register (JSON or CSV format)
- Sends notification to appropriate escalation contacts
- Creates ticket in tracking system (Jira, ServiceNow, etc.)
- Updates audit trail for regulatory compliance

## Configuration in settings.json

```json
{
  "hooks": {
    "onCommandComplete": {
      "incident-logger": {
        "shell": "bash",
        "script": "ai_compliance_risk_stack/hooks/incident-logger.sh",
        "filter": {
          "command": ["audit", "test", "deploy", "evaluate", "validate", "monitor"],
          "exitCode": [1, 2],
          "keywords": ["INCIDENT", "ALERT", "ERROR", "FAIRNESS_GAP", "DRIFT", "SECURITY", "BREACH"]
        },
        "env": {
          "INCIDENT_LOG_DIR": ".incidents",
          "ESCALATION_EMAIL": "compliance-team@company.com",
          "SLACK_WEBHOOK": "${SLACK_INCIDENT_WEBHOOK}",
          "TICKET_SYSTEM": "jira",
          "FAIRNESS_THRESHOLD": "0.10",
          "DRIFT_THRESHOLD": "0.05",
          "CRITICAL_THRESHOLD": "0.20"
        }
      }
    }
  }
}
```

## Usage Examples

### Example 1: Fairness Alert Triggers High-Severity Incident

**Scenario:** Bias audit completed on production model; discovers demographic disparity of 12% (exceeds 10% threshold).

**Hook Executes:**
1. Detects fairness gap > threshold in audit output
2. Classifies as High severity (disparity 10-20%)
3. Logs incident with ID INC-20260615-001
4. Sends notification to Compliance Officer and Model Owner
5. Creates Jira ticket for investigation and mitigation
6. Logs to audit trail

**Output:**
```
INCIDENT LOGGED: INC-20260615-001

Type: Fairness Gap
Severity: HIGH
Model: loan-default-predictor v2.3
Disparity: 12% (Female vs. Male recall)
Threshold: 10%
Detected: 2026-06-15 14:32:00 UTC

Escalation: Compliance Officer, CRO
Actions:
  [ ] Investigate root cause
  [ ] Prepare mitigation plan
  [ ] Update risk register
  [ ] Communicate with stakeholders

Follow-up Due: 2026-06-16 (24 hours)

Incident URL: https://jira.company.com/INC-20260615-001
```

### Example 2: Performance Drift Triggers Medium-Severity Incident

**Scenario:** Daily monitoring dashboard detects model accuracy dropped from 94% to 88% (6% degradation, exceeds 5% threshold).

**Hook Executes:**
1. Detects accuracy drift > threshold
2. Classifies as Medium severity (degradation 5-15%)
3. Logs incident INC-20260615-002
4. Notifies Model Owner and Data Science team
5. Creates follow-up task for retraining
6. Logs to incident register

**Output:**
```
INCIDENT LOGGED: INC-20260615-002

Type: Performance Drift
Severity: MEDIUM
Model: fraud-detection-model v3.1
Accuracy Drop: 94% → 88% (6% degradation)
Threshold: 5%
Detected: 2026-06-15 08:15:00 UTC

Escalation: Compliance Officer, Model Owner
Actions:
  [ ] Investigate root cause (data drift? distribution change?)
  [ ] Check for data quality issues
  [ ] Plan retraining
  [ ] Update monitoring thresholds if needed

Follow-up Due: 2026-06-15 12:00:00 (4 hours)

Incident URL: https://jira.company.com/INC-20260615-002
```

### Example 3: Security Alert Triggers Critical-Severity Incident

**Scenario:** Intrusion detection system alerts on suspected attempted model inversion attack (1000 requests in 10 minutes with systematic feature probing).

**Hook Executes:**
1. Detects security alert keyword in log
2. Classifies as Critical (potential attack)
3. Logs incident INC-20260615-003
4. Immediately pages CISO, CRO, CEO, General Counsel
5. Suspends model API access (automatic containment)
6. Triggers incident response procedures
7. Logs to audit trail

**Output:**
```
INCIDENT LOGGED: INC-20260615-003

Type: SECURITY_ALERT
Severity: CRITICAL
Model: credit-risk-model v4.2
Alert: Suspected model inversion / membership inference attack
Details: 1000 API requests in 10 minutes, systematic feature probing pattern
Detected: 2026-06-15 11:45:00 UTC

IMMEDIATE ACTIONS TAKEN:
  [x] Model API suspended (access cut off)
  [x] IP address 192.168.1.100 blacklisted
  [x] Traffic logs captured for forensic analysis

Escalation: CISO, CRO, CEO, General Counsel (PAGE ON-CALL)
Actions:
  [ ] Investigate attack source and intent
  [ ] Determine if training data was extracted
  [ ] Initiate HIPAA/GDPR breach assessment (if PII involved)
  [ ] Prepare incident response statement
  [ ] Determine notification requirements

Follow-up Due: Immediate (within 1 hour)

Incident URL: https://jira.company.com/INC-20260615-003
Incident Response Plan: /incidents/INC-20260615-003/response-plan.md
```

## Incident Log Format

Incidents logged in structured format (.incidents/incident-log.json):

```json
{
  "incident_id": "INC-20260615-001",
  "timestamp": "2026-06-15T14:32:00Z",
  "type": "fairness_gap",
  "severity": "high",
  "model": "loan-default-predictor",
  "model_version": "v2.3",
  "description": "Demographic disparity detected: 12% gap in recall between female and male applicants",
  "threshold": 0.10,
  "actual_value": 0.12,
  "metric": "recall_disparity",
  "affected_system": "loan-approval-system",
  "user": "system-automation",
  "escalation_contacts": ["compliance@company.com", "cro@company.com"],
  "escalation_level": "high",
  "actions_required": [
    "Investigate root cause",
    "Prepare mitigation plan",
    "Update risk register",
    "Communicate with stakeholders"
  ],
  "follow_up_due": "2026-06-16T14:32:00Z",
  "jira_ticket": "INC-20260615-001",
  "related_artifacts": [
    "models/loan-default-predictor/bias-audit-2026-06-15.md",
    "risk-register.md#risk-2-fairness-disparities",
    "CLAUDE.md#incident-escalation-procedures"
  ]
}
```

## Escalation Matrix

| Severity | Trigger | Response Time | Escalate To | Actions |
|----------|---------|---|---|---|
| **Critical** | Security breach, critical regulatory violation, major harm | Immediate (< 15 min) | CISO, CRO, CEO, Counsel, Board | Page on-call, suspend systems, prepare statement |
| **High** | Fairness gap > 15%, accuracy drop > 10%, regulatory audit finding | 1 hour | CRO, Counsel, VP Eng, Compliance | Create incident ticket, investigate, prepare mitigation |
| **Medium** | Fairness gap 10-15%, accuracy drop 5-10%, compliance gap | 4 hours | Compliance Officer, Model Owner | Log incident, plan mitigation, update risk register |
| **Low** | Fairness gap 5-10%, minor drift, documentation gap | 24 hours | Team lead | Log to incident register, plan improvement |

## Integration with Other Systems

**Incident Management System (Jira/ServiceNow):**
- Automatically create tickets for Medium+ severity incidents
- Link incident to model, risk register, audit trail
- Track remediation progress and closure

**Notification Channels:**
- Email to escalation contacts
- Slack to #security and #compliance channels
- SMS/page for critical incidents
- Incident dashboard for visualization

**Audit Trail & Compliance:**
- All incidents logged with immutable timestamps
- Evidence preserved for regulatory inspection
- Incident history used for trend analysis
- Compliance reports include incident summary

## Success Metrics

Track hook effectiveness:

- **Detection Rate:** % of actual incidents that trigger logging (target: > 95%)
- **Escalation Accuracy:** % of incidents escalated to correct level (target: > 99%)
- **Response Time:** Average time from incident detection to escalation (target: < 15 min for high severity)
- **False Positive Rate:** % of alerts that aren't actual incidents (target: < 10%)
- **Resolution Time:** Average time from incident detection to closure (target: < 7 days for high severity)
- **Regulatory Compliance:** % of incidents properly documented for audits (target: 100%)

---

## Related Documentation

- See CLAUDE.md for incident escalation procedures and response matrix
- See commands/conduct-risk-assessment.md for risk assessment and incident triggers
- See skills/model-auditor/SKILL.md for fairness audits that may trigger incidents
- See incident-response-playbook.md (future) for detailed response procedures by incident type
