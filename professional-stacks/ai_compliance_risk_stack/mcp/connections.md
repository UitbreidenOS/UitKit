# AI Compliance & Risk Stack - MCP Connections

## Overview

This section documents external service integrations (MCP servers) that support AI compliance and governance workflows.

---

## Audit Trail Integration (Splunk / ELK / Datadog)

### Purpose

Centralize and archive all AI system events (deployments, inferences, incidents, model changes) for regulatory inspection and forensic analysis.

### Prerequisites

- Splunk, ELK Stack, or Datadog account
- API key or authentication credentials
- Network connectivity to logging service
- Log forwarding agent installed (Splunk Universal Forwarder, Filebeat, etc.)

### Setup

1. **Generate API Key**
   - Splunk: Settings → Tokens → Data Inputs → HTTP Event Collector
   - Datadog: Organization Settings → API Keys
   - ELK: Kibana → Stack Management → API Keys

2. **Configure MCP Server in settings.json**

```json
{
  "mcpServers": {
    "audit-trail": {
      "command": "npx",
      "args": ["@audit-trail/mcp-server"],
      "env": {
        "AUDIT_TRAIL_URL": "https://splunk-instance.company.com:8088/services/collector",
        "AUDIT_TRAIL_TOKEN": "${AUDIT_TRAIL_API_KEY}",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

3. **Set Environment Variable**

```bash
export AUDIT_TRAIL_API_KEY="your_api_key_here"
```

4. **Test Connection**

```bash
# Verify audit trail is logging events
mcp test audit-trail --query "index=ai_compliance_audit source=model_deployments | stats count by status"
```

### Available Tools

- **log_event** — Log AI system event (deployment, inference, incident, change)
- **query_audit_trail** — Search audit logs (date range, model, event type, severity)
- **export_compliance_report** — Generate compliance report from audit trail
- **search_incident_history** — Find related incidents for a model or timeframe
- **verify_audit_integrity** — Verify audit logs have not been modified

### Example Usage

```python
# Log a model deployment event
mcp.log_event(
  event_type="model_deployment",
  model_name="loan-default-predictor",
  model_version="v2.3",
  deployment_target="production",
  timestamp="2026-06-15T14:32:00Z",
  deployed_by="alice@company.com",
  compliance_approved=True,
  risk_level="medium"
)

# Query for all fairness-related incidents in last 30 days
mcp.query_audit_trail(
  index="ai_compliance_audit",
  query="event_type=fairness_incident OR event_type=bias_alert",
  timerange="last_30_days",
  fields=["timestamp", "model", "severity", "description"]
)

# Export compliance report for GDPR audit
mcp.export_compliance_report(
  report_type="gdpr_audit",
  date_range="2026-01-01 to 2026-06-15",
  include_models=["all"],
  format="pdf"
)
```

---

## Regulatory Intelligence Feed

### Purpose

Monitor regulatory changes relevant to AI systems; receive alerts when new regulations or guidance affect compliance posture.

### Prerequisites

- Subscription to regulatory monitoring service (RegTech provider)
- Access to regulatory database (SEC, EU official journals, etc.)
- Integration API credentials
- Notifications delivery method (email, Slack, API webhook)

### Setup

1. **Configure Regulatory Intelligence in settings.json**

```json
{
  "mcpServers": {
    "regulatory-intelligence": {
      "command": "npx",
      "args": ["@regulatory-intelligence/mcp-server"],
      "env": {
        "REG_INTEL_API_KEY": "${REG_INTEL_API_KEY}",
        "JURISDICTION": "us,eu",
        "FOCUS_AREAS": "ai,fintech,healthcare,employment",
        "ALERT_EMAIL": "compliance@company.com",
        "SLACK_WEBHOOK": "${SLACK_REGULATORY_WEBHOOK}"
      }
    }
  }
}
```

2. **Set Environment Variable**

```bash
export REG_INTEL_API_KEY="your_api_key_here"
export SLACK_REGULATORY_WEBHOOK="https://hooks.slack.com/services/..."
```

3. **Configure Alert Preferences**
   - Monitor jurisdictions: US, EU, UK, Canada, Australia
   - Focus areas: AI, fintech, healthcare, employment, consumer protection
   - Alert severity: Critical (new rule enforcement), High (new guidance), Medium (proposed rules)
   - Frequency: Daily digest, immediate alerts for critical changes

### Available Tools

- **monitor_regulations** — Start monitoring regulations in specified jurisdiction/domain
- **search_regulation_database** — Search for regulations by keyword or topic
- **get_regulation_text** — Retrieve full text of specific regulation
- **map_regulation_to_requirements** — Identify specific requirements from regulation text
- **setup_compliance_alert** — Create alert for new regulations in domain
- **get_compliance_status** — Check current compliance status against latest regulations

### Example Usage

```python
# Monitor for new AI regulations in US and EU
mcp.monitor_regulations(
  jurisdictions=["us", "eu"],
  domains=["ai", "employment"],
  alert_severity=["critical", "high"],
  notification_method="slack"
)

# Search for GDPR requirements related to AI
mcp.search_regulation_database(
  query="GDPR artificial intelligence fairness",
  jurisdiction="eu",
  date_range="last_12_months"
)

# Get mapping of AI Act requirements for high-risk systems
mcp.map_regulation_to_requirements(
  regulation_id="EU-2024-1689",  # AI Act
  risk_level="high",
  output_format="mapping_table"
)

# Setup alert for new employment discrimination rules
mcp.setup_compliance_alert(
  domain="employment",
  regulation_type="discrimination_rules",
  trigger="new_proposed_rule OR new_enforcement_action",
  notify_to=["compliance@company.com", "legal@company.com"]
)
```

---

## Risk Management Platform Integration (ServiceNow / Alteryx)

### Purpose

Integrate AI risk assessments with enterprise risk management system; track risk mitigation progress; generate compliance reports.

### Prerequisites

- ServiceNow or Alteryx risk management module
- Admin access to configure integration
- API credentials (OAuth 2.0)
- Risk register structure aligned with platform

### Setup

1. **ServiceNow Integration**

```json
{
  "mcpServers": {
    "risk-management": {
      "command": "npx",
      "args": ["@risk-management/mcp-server"],
      "env": {
        "PLATFORM": "servicenow",
        "SERVICENOW_INSTANCE": "https://company.service-now.com",
        "SERVICENOW_CLIENT_ID": "${SERVICENOW_CLIENT_ID}",
        "SERVICENOW_CLIENT_SECRET": "${SERVICENOW_CLIENT_SECRET}",
        "RISK_TABLE": "risk_register",
        "MITIGATION_TABLE": "risk_mitigations"
      }
    }
  }
}
```

2. **Set Environment Variables**

```bash
export SERVICENOW_CLIENT_ID="your_client_id"
export SERVICENOW_CLIENT_SECRET="your_client_secret"
```

### Available Tools

- **create_risk** — Create new risk in risk management system
- **update_risk_status** — Update risk assessment, probability, impact
- **log_mitigation** — Log mitigation actions and evidence
- **get_risk_summary** — Retrieve risk summary for model/system
- **export_risk_report** — Generate risk report for stakeholders
- **query_risks** — Search risks by model, category, status
- **track_mitigation_progress** — Monitor mitigation completion

### Example Usage

```python
# Create risk in ServiceNow
mcp.create_risk(
  risk_id="R-2026-LOAN-001",
  risk_name="Fairness Gap in Loan Approval Model",
  category="fairness",
  probability="high",
  impact="high",
  risk_score=8,
  affected_system="loan-default-predictor",
  owner="data-science-lead",
  mitigation_plan="Rebalance training data; implement fairness constraints",
  target_completion="2026-07-15"
)

# Log mitigation action
mcp.log_mitigation(
  risk_id="R-2026-LOAN-001",
  mitigation_type="training_data_rebalancing",
  status="in_progress",
  completion_pct=60,
  evidence_url="https://confluence/rebalancing-report.pdf",
  notes="Training data rebalanced; ready for model retraining"
)

# Generate risk report
mcp.export_risk_report(
  model="loan-default-predictor",
  report_type="executive_summary",
  include_sections=["risk_summary", "mitigation_status", "residual_risk"],
  format="pdf"
)
```

---

## Fairness & Bias Monitoring Tools (Fiddler / WhyLabs)

### Purpose

Continuous monitoring of model fairness metrics in production; automated alerts when demographic disparities detected.

### Prerequisites

- Fiddler or WhyLabs account
- Model artifacts (training data, model weights)
- Production inference data pipeline
- Integration API key

### Setup

1. **Fiddler Integration**

```json
{
  "mcpServers": {
    "fairness-monitoring": {
      "command": "npx",
      "args": ["@fairness-monitoring/mcp-server"],
      "env": {
        "PLATFORM": "fiddler",
        "FIDDLER_API_KEY": "${FIDDLER_API_KEY}",
        "FIDDLER_ORG": "company-org",
        "FAIRNESS_METRICS": "demographic_parity,equalized_odds,calibration",
        "PROTECTED_CLASSES": "gender,age,race_ethnicity",
        "ALERT_THRESHOLD": "0.05"
      }
    }
  }
}
```

2. **Set Environment Variable**

```bash
export FIDDLER_API_KEY="your_api_key_here"
```

### Available Tools

- **register_model** — Register model for fairness monitoring
- **define_protected_classes** — Specify demographic groups to monitor
- **set_fairness_thresholds** — Set acceptable disparity thresholds
- **get_fairness_metrics** — Retrieve current fairness metrics by group
- **setup_fairness_alert** — Configure alert for disparity detection
- **generate_fairness_report** — Create audit report of fairness metrics
- **configure_mitigation** — Set fairness constraints or rebalancing

### Example Usage

```python
# Register model for fairness monitoring
mcp.register_model(
  model_id="loan-default-predictor-v2",
  model_type="gradient_boosted_trees",
  task="classification",
  prediction_column="default_probability"
)

# Define protected classes
mcp.define_protected_classes(
  classes=[
    {"name": "gender", "values": ["male", "female", "non-binary"]},
    {"name": "age_group", "values": ["18-30", "30-50", "50+"]},
    {"name": "race_ethnicity", "values": ["white", "black", "hispanic", "asian", "other"]}
  ]
)

# Set fairness thresholds
mcp.set_fairness_thresholds(
  metric="demographic_parity",
  protected_class="gender",
  acceptable_disparity=0.05,  # 5% disparity acceptable
  critical_threshold=0.15  # > 15% triggers critical alert
)

# Get current fairness metrics
mcp.get_fairness_metrics(
  model_id="loan-default-predictor-v2",
  metric_names=["demographic_parity", "equalized_odds", "calibration"],
  date_range="last_30_days"
)

# Setup fairness alert
mcp.setup_fairness_alert(
  model_id="loan-default-predictor-v2",
  trigger="disparity > acceptable_threshold",
  alert_recipients=["compliance@company.com"],
  notification_method="slack"
)
```

---

## Data Governance & Lineage (Collibra / Alation)

### Purpose

Track data lineage for training datasets; maintain data governance policies; audit PII handling and retention compliance.

### Prerequisites

- Collibra or Alation account
- Data catalog configured with business glossary
- Integration API credentials
- Data source connections configured

### Setup

```json
{
  "mcpServers": {
    "data-governance": {
      "command": "npx",
      "args": ["@data-governance/mcp-server"],
      "env": {
        "PLATFORM": "collibra",
        "COLLIBRA_API_KEY": "${COLLIBRA_API_KEY}",
        "COLLIBRA_DOMAIN": "https://company.collibra.com",
        "ASSET_TYPES": "dataset,table,column,model"
      }
    }
  }
}
```

### Available Tools

- **register_dataset** — Register training dataset in data catalog
- **document_lineage** — Document data source → feature store → model lineage
- **tag_pii** — Mark PII columns and retention requirements
- **verify_data_governance** — Audit dataset for compliance gaps
- **get_retention_policy** — Retrieve retention requirements for dataset
- **track_data_access** — Log who accessed what data when
- **audit_data_deletion** — Verify data was properly deleted per policy

### Example Usage

```python
# Register training dataset
mcp.register_dataset(
  dataset_id="customer-profiles-2026-q2",
  dataset_name="Customer Financial Profiles",
  description="Customer income, employment, debt data for loan approval",
  data_owner="data-engineering@company.com",
  retention_period="7_years",
  governed_by="GDPR,FCRA"
)

# Document lineage
mcp.document_lineage(
  source_dataset="customer-profiles-2026-q2",
  transformations=[
    "pii_encryption",
    "age_to_bracket",
    "income_to_bucket",
    "outlier_removal"
  ],
  destination_model="loan-default-predictor-v2",
  data_minimization_applied=True
)

# Tag PII columns
mcp.tag_pii(
  dataset="customer-profiles-2026-q2",
  pii_columns=[
    {"name": "customer_name", "type": "direct_pii", "retention": "3_years"},
    {"name": "ssn", "type": "critical_pii", "retention": "7_years"},
    {"name": "dob", "type": "quasi_pii", "retention": "0_days"}  # deleted after processing
  ]
)

# Verify data governance
mcp.verify_data_governance(
  dataset="customer-profiles-2026-q2",
  checks=["pii_classified", "retention_defined", "access_controlled", "lineage_documented"]
)
```

---

## Testing & Validation (Validata / Great Expectations)

### Purpose

Validate data quality and model behavior; run fairness, robustness, and performance tests; generate evidence for compliance audits.

### Prerequisites

- Great Expectations or similar validation framework
- Test data and expected behavior definitions
- Continuous validation pipeline
- Integration API access

### Setup

```json
{
  "mcpServers": {
    "validation": {
      "command": "npx",
      "args": ["@validation/mcp-server"],
      "env": {
        "VALIDATION_FRAMEWORK": "great_expectations",
        "CHECKPOINT_STORE": "s3://validation-checkpoints/",
        "TEST_SUITES": "fairness,performance,robustness,data_quality"
      }
    }
  }
}
```

### Available Tools

- **run_fairness_test** — Test model for demographic disparities
- **run_robustness_test** — Test model against adversarial inputs
- **validate_data_quality** — Check training data for completeness, accuracy
- **run_performance_test** — Validate model meets performance SLAs
- **generate_test_report** — Create evidence report for compliance audit

---

## Configuration Checklist

When setting up MCP integrations for compliance:

- [ ] Audit Trail: Splunk/ELK configured; all events logged; tested
- [ ] Regulatory Intelligence: Setup and monitoring active; alerts configured
- [ ] Risk Management: ServiceNow/Alteryx integrated; risk register synced
- [ ] Fairness Monitoring: Fiddler/WhyLabs setup; fairness metrics baseline established
- [ ] Data Governance: Collibra/Alation configured; lineage documented; PII tagged
- [ ] Testing: Validation framework integrated; test suites automated; reports generated

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Auth failures | Verify API keys valid and not expired; check credentials in environment variables |
| Connection timeout | Confirm network connectivity to external service; check firewall rules |
| Missing events | Verify log forwarding agent running; check log levels; test with manual event |
| Integration drift | Run quarterly validation; confirm API versions match; test after updates |

---

## See Also

- CLAUDE.md — Compliance framework and incident escalation procedures
- SKILL.md files — Skills that use these integrations
- hooks/ — Automated procedures that trigger external logging
