# Compliance APIs & Regulatory Database Integration

MCP integration with compliance monitoring platforms, regulatory databases, and AI governance tools.

---

## Regulatory Compliance APIs

### GDPR Compliance API

**Purpose:** Track compliance with GDPR requirements  
**Data Points:** Article 22 compliance, right-to-explanation, data protection assessment

```json
{
  "endpoint": "https://gdpr-compliance.api/v1/",
  "authentication": "Bearer ${GDPR_API_TOKEN}",
  "operations": {
    "assess_article_22": {
      "method": "POST",
      "path": "/systems/{system_id}/article-22",
      "description": "Assess automated decision-making compliance",
      "required_params": ["system_id", "has_human_review", "has_explanation", "has_appeal_process"],
      "response": {
        "compliant": true|false,
        "gaps": ["list of compliance gaps"],
        "remediation_required": true|false,
        "deadline": "ISO8601 date"
      }
    },
    "check_transparency": {
      "method": "GET",
      "path": "/systems/{system_id}/transparency",
      "description": "Verify user notification and explanation",
      "response": {
        "user_notified": true|false,
        "explanation_available": true|false,
        "appeal_process": true|false,
        "compliance_level": "full|partial|none"
      }
    }
  }
}
```

### HIPAA Compliance API

**Purpose:** Track healthcare AI compliance  
**Data Points:** Privacy Rule, Security Rule, Breach Notification

```json
{
  "endpoint": "https://hipaa-compliance.api/v1/",
  "authentication": "mTLS certificate",
  "operations": {
    "audit_data_protection": {
      "method": "POST",
      "path": "/systems/{system_id}/data-protection",
      "description": "Audit health data protection measures",
      "required_params": ["system_id", "data_types", "access_controls", "encryption"],
      "response": {
        "compliant": true|false,
        "gaps": ["list"],
        "risk_level": "low|medium|high",
        "action_items": [{
          "action": "description",
          "deadline": "date",
          "owner": "team"
        }]
      }
    },
    "check_breach_notification": {
      "method": "GET",
      "path": "/systems/{system_id}/breach-readiness",
      "description": "Verify breach notification procedures",
      "response": {
        "notification_process": "documented|not_documented",
        "notification_timeline": "60 days",
        "readiness": true|false
      }
    }
  }
}
```

### Fair Lending Compliance API

**Purpose:** Track Fair Lending Act and FCRA compliance  
**Data Points:** Disparate impact, adverse action notice, credit scoring

```json
{
  "endpoint": "https://fair-lending.api/v1/",
  "authentication": "API Key",
  "operations": {
    "calculate_adverse_impact": {
      "method": "POST",
      "path": "/systems/{system_id}/adverse-impact",
      "description": "Calculate 4/5 rule (disparate impact ratio)",
      "required_params": ["system_id", "approval_data_by_group"],
      "response": {
        "adverse_impact_ratios": {
          "protected_group_1": 0.85,
          "protected_group_2": 0.78
        },
        "passes_4_5_rule": true|false,
        "gaps": ["which groups fail the 4/5 rule"],
        "remediation_urgency": "low|medium|high|critical"
      }
    },
    "verify_adverse_action_notice": {
      "method": "GET",
      "path": "/systems/{system_id}/adverse-action",
      "description": "Verify adverse action notices are issued",
      "response": {
        "notice_template_approved": true|false,
        "notice_rate": "percentage sent",
        "compliant": true|false
      }
    }
  }
}
```

### State AI Law Compliance API

**Purpose:** Track state-specific AI governance laws  
**Data Points:** Transparency requirements, bias audit requirements, state-specific rules

```json
{
  "endpoint": "https://state-ai-laws.api/v1/",
  "authentication": "API Key",
  "operations": {
    "check_state_requirements": {
      "method": "POST",
      "path": "/systems/{system_id}/state-compliance",
      "description": "Check compliance with state AI laws",
      "required_params": ["system_id", "states", "decision_domain"],
      "response": {
        "compliance_by_state": {
          "california": {
            "law": "California AI Transparency Act",
            "requirements": ["transparency_requirement"],
            "compliant": true|false,
            "gaps": []
          },
          "colorado": {
            "law": "Colorado AI Bias Law",
            "requirements": ["bias_audit_required"],
            "compliant": false,
            "gaps": ["No bias audit conducted"]
          }
        },
        "critical_gaps": []
      }
    }
  }
}
```

---

## Fairness & Bias Auditing APIs

### AI Fairness API

**Purpose:** Integrated fairness assessment and metric calculation  
**Data Points:** Demographic parity, equalized odds, calibration, disparate impact

```json
{
  "endpoint": "https://fairness-api.company.com/v1/",
  "authentication": "Bearer ${FAIRNESS_API_TOKEN}",
  "operations": {
    "calculate_fairness_metrics": {
      "method": "POST",
      "path": "/audit/metrics",
      "description": "Calculate all fairness metrics",
      "request_body": {
        "system_id": "credit-approval-v2.1",
        "predictions": "gs://bucket/predictions.csv",
        "actuals": "gs://bucket/actuals.csv",
        "protected_attributes": ["race", "gender", "age"],
        "metrics": ["demographic_parity", "equalized_odds", "calibration"]
      },
      "response": {
        "audit_id": "AUDIT-2024-001",
        "metrics": {
          "demographic_parity": {
            "groups": {
              "white": 0.65,
              "black": 0.59,
              "hispanic": 0.62
            },
            "disparities": {
              "white_vs_black": 0.06,
              "white_vs_hispanic": 0.03
            },
            "passes_threshold": false,
            "status": "FAIL"
          },
          "equalized_odds_tpr": {
            "groups": {
              "white": 0.71,
              "black": 0.68,
              "hispanic": 0.70
            },
            "disparities": {
              "white_vs_black": 0.03,
              "white_vs_hispanic": 0.01
            },
            "passes_threshold": true,
            "status": "PASS"
          }
        },
        "overall_fairness_status": "REQUIRES_MITIGATION",
        "mitigations": [
          {
            "mitigation_type": "threshold_adjustment",
            "description": "Lower decision threshold for Black applicants",
            "expected_impact": "Reduce disparity from 6% to 2%",
            "implementation_effort": "low",
            "accuracy_impact": "0.2% reduction"
          }
        ]
      }
    },
    "monitor_fairness_drift": {
      "method": "POST",
      "path": "/monitor/drift-detection",
      "description": "Monitor for fairness drift in production",
      "request_body": {
        "system_id": "credit-approval-v2.1",
        "baseline_metrics": {"demographic_parity": {"white": 0.65, "black": 0.63}},
        "current_metrics": {"demographic_parity": {"white": 0.65, "black": 0.59}},
        "alert_threshold": 0.03
      },
      "response": {
        "drift_detected": true,
        "metric": "demographic_parity",
        "baseline_disparity": 0.02,
        "current_disparity": 0.06,
        "drift_magnitude": 0.04,
        "alert_severity": "high",
        "alert_message": "Demographic parity disparity increased by 4%"
      }
    }
  }
}
```

---

## Risk Management API Integration

### Enterprise Risk Management API

**Purpose:** Track AI systems in central risk registry  
**Data Points:** Risk scores, mitigations, monitoring status, escalations

```json
{
  "endpoint": "https://erm-platform.company.com/api/",
  "authentication": "OAuth 2.0",
  "operations": {
    "register_ai_risk": {
      "method": "POST",
      "path": "/risks/create",
      "description": "Register new AI system risk",
      "request_body": {
        "risk_name": "Credit Approval AI - Fairness Risk",
        "risk_category": "ai_governance",
        "system_name": "credit-approval-v2.1",
        "risk_description": "Potential demographic disparities in credit approval decisions",
        "likelihood": "medium",
        "impact": "high",
        "risk_score": 75,
        "status": "active",
        "mitigations": [
          {
            "mitigation_type": "fairness_audit",
            "description": "Quarterly fairness audits with <3% disparity threshold",
            "status": "implemented",
            "effectiveness": "high"
          },
          {
            "mitigation_type": "monitoring",
            "description": "Daily demographic parity tracking with alerts",
            "status": "implemented",
            "effectiveness": "high"
          }
        ]
      },
      "response": {
        "risk_id": "RISK-2024-001",
        "status": "created",
        "risk_owner": "governance-lead@company.com",
        "review_schedule": "quarterly"
      }
    },
    "update_risk_status": {
      "method": "PATCH",
      "path": "/risks/{risk_id}/status",
      "description": "Update risk status based on monitoring",
      "request_body": {
        "risk_id": "RISK-2024-001",
        "current_disparity": 0.06,
        "threshold": 0.03,
        "status": "escalation_triggered",
        "alert_level": "high"
      },
      "response": {
        "status": "escalated",
        "escalation_to": "ethics_board",
        "escalation_timestamp": "2024-01-15T10:30:00Z"
      }
    }
  }
}
```

---

## Audit Trail & Governance Logging API

### Immutable Audit Log API

**Purpose:** Maintain tamper-proof governance decision logs  
**Data Points:** All governance decisions, approvals, escalations

```json
{
  "endpoint": "https://audit-log.company.com/api/",
  "authentication": "mTLS certificate",
  "operations": {
    "log_governance_decision": {
      "method": "POST",
      "path": "/events/log",
      "description": "Log governance decision to immutable audit trail",
      "request_body": {
        "event_type": "risk_assessment_approval",
        "system_id": "credit-approval-v2.1",
        "decision": "approved",
        "decision_maker": "governance-lead@company.com",
        "decision_date": "2024-01-15T10:00:00Z",
        "reasoning": "System meets fairness thresholds; monitoring in place",
        "conditions": ["Monitor fairness daily", "Alert if disparity exceeds 3%"],
        "audit_trail_required": true,
        "retention_period": "7_years"
      },
      "response": {
        "event_id": "EVT-2024-001",
        "timestamp": "2024-01-15T10:00:00Z",
        "hash": "sha256_hash_of_event",
        "immutable": true,
        "audit_log_entry_created": true
      }
    },
    "query_audit_trail": {
      "method": "GET",
      "path": "/events/query",
      "description": "Query audit trail for system events",
      "query_params": {
        "system_id": "credit-approval-v2.1",
        "event_types": ["risk_assessment", "approval", "escalation"],
        "date_range": "2024-01-01:2024-01-31"
      },
      "response": {
        "total_events": 47,
        "events": [
          {
            "event_id": "EVT-2024-001",
            "timestamp": "2024-01-15T10:00:00Z",
            "event_type": "risk_assessment_approval",
            "actor": "governance-lead@company.com",
            "action": "approved",
            "details": {}
          }
        ]
      }
    }
  }
}
```

---

## Integration Examples

### Example 1: Full Governance Decision Workflow

```bash
# 1. Calculate fairness metrics using Fairness API
POST /fairness-api/audit/metrics
{
  "system_id": "credit-approval-v2.1",
  "protected_attributes": ["race", "gender"]
}

# Response: Metrics show 6% demographic parity disparity (FAIL)

# 2. Log finding to risk management
POST /erm-platform/risks/create
{
  "system_name": "credit-approval-v2.1",
  "risk_description": "Demographic parity disparity 6%",
  "mitigation_type": "threshold_adjustment"
}

# Response: Risk registered as RISK-2024-001

# 3. Check regulatory requirements
POST /gdpr-compliance/systems/{system_id}/article-22
{
  "has_human_review": true,
  "has_explanation": true,
  "has_appeal_process": true
}

# Response: GDPR compliant

# 4. Make governance decision and log
POST /audit-log/events/log
{
  "event_type": "risk_assessment_approval",
  "system_id": "credit-approval-v2.1",
  "decision": "conditional_approval",
  "conditions": ["Fix demographic parity disparity to <3%"]
}

# Response: Decision logged to immutable audit trail
```

### Example 2: Daily Fairness Monitoring

```bash
# Scheduled daily at 2 AM UTC
POST /fairness-api/monitor/drift-detection
{
  "system_id": "credit-approval-v2.1",
  "baseline_metrics": {...},
  "current_metrics": {...}
}

# If drift detected:
# 1. Alert governance team
# 2. Log to audit trail
# 3. Escalate to risk management
# 4. Trigger ethics board notification
```

---

## Setting Up API Integrations

### Step 1: Configure Credentials

```bash
# In claude-code/settings.json
{
  "env": {
    "GDPR_API_TOKEN": "${GDPR_API_TOKEN}",
    "FAIRNESS_API_TOKEN": "${FAIRNESS_API_TOKEN}",
    "ERM_API_KEY": "${ERM_API_KEY}",
    "AUDIT_LOG_CERT": "/path/to/cert.pem"
  }
}
```

### Step 2: Test API Connectivity

```bash
# Test each API endpoint
/mcp compliance-apis health-check --service gdpr
/mcp compliance-apis health-check --service fairness
/mcp compliance-apis health-check --service erm
```

### Step 3: Integrate into Governance Workflows

Link API calls into governance commands:
- `/build-risk-framework` → calls fairness API, risk API
- `/audit-governance` → calls compliance APIs
- `/track-compliance` → calls compliance and audit log APIs

---

## Error Handling & Retries

All API integrations include:
- Automatic retry with exponential backoff
- Circuit breaker for failing services
- Fallback to cached data if API unavailable
- Alert escalation if API down >30 minutes

---

## Data Privacy & Security

All API integrations:
- Use encrypted transport (TLS 1.3)
- Authenticate with mTLS or OAuth 2.0
- Minimize data transmission (only necessary fields)
- Comply with data residency requirements
- Maintain audit trail of all API access

---

Built with [Claudient](https://github.com/Claudients/Claudient)
