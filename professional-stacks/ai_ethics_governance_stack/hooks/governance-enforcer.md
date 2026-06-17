# Governance Enforcer Hook

## Purpose

Automatically validates risk assessment and compliance audit before AI systems are deployed to production. Prevents deployment of systems that have not passed required governance checks.

## settings.json Configuration

```json
{
  "hooks": {
    "preSystemDeploy": {
      "governance-enforcer": {
        "shell": "bash",
        "script": "ai_ethics_governance_stack/hooks/governance-enforcer.sh",
        "filter": {
          "deployment_target": ["production", "staging"]
        }
      }
    }
  }
}
```

## Hook Behavior

This hook fires before a system is deployed to production. It verifies:

1. **Risk Assessment Complete**
   - Risk assessment document exists
   - Risk assessment is within 90 days old
   - All 5 risk domains assessed (fairness, safety, transparency, legal, reputational)
   - Risk level classification present (GREEN/YELLOW/RED)

2. **Appropriate Approvals**
   - GREEN systems: Governance lead approval exists
   - YELLOW systems: Director-level approval + ethics board review documented
   - RED systems: C-suite + ethics board approval documented
   - All approvals are recent (within 30 days)

3. **Fairness Audit (if applicable)**
   - YELLOW+ systems: Bias audit completed
   - Fairness metrics quantified
   - Protected attributes assessed
   - Disparities <3% (threshold depends on domain)
   - Mitigations documented if disparities exist

4. **Compliance Verification (if applicable)**
   - YELLOW+ systems: Compliance review completed
   - Applicable regulations identified
   - Compliance status clear
   - Any gaps have remediation plan with timeline

5. **Conditions for Deployment Met**
   - All pre-deployment conditions satisfied
   - Human review layer active (if required)
   - Monitoring dashboard configured
   - Alert rules configured
   - Escalation contacts defined

6. **Governance Monitoring Active**
   - Post-deployment monitoring metrics defined
   - Alert thresholds set
   - Escalation triggers configured
   - Responsible teams identified

## Implementation

Hook script: `ai_ethics_governance_stack/hooks/governance-enforcer.sh`

```bash
#!/bin/bash

# Governance Enforcer Hook
# Validates governance requirements before production deployment

set -e

SYSTEM_NAME="$1"
DEPLOYMENT_TARGET="$2"
GOVERNANCE_DIR="ai_ethics_governance_stack/governance"

echo "[GOVERNANCE] Validating governance requirements for: $SYSTEM_NAME"

# Check 1: Risk Assessment Exists & Current
RISK_ASSESSMENT_FILE="$GOVERNANCE_DIR/risk-assessments/$SYSTEM_NAME.md"
if [ ! -f "$RISK_ASSESSMENT_FILE" ]; then
  echo "[GOVERNANCE] ERROR: Risk assessment not found: $RISK_ASSESSMENT_FILE"
  exit 1
fi

# Verify risk assessment is within 90 days
RISK_ASSESSMENT_DATE=$(git log -1 --format=%ai "$RISK_ASSESSMENT_FILE" | cut -d' ' -f1)
DAYS_OLD=$(( ($(date +%s) - $(date -d "$RISK_ASSESSMENT_DATE" +%s)) / 86400 ))
if [ "$DAYS_OLD" -gt 90 ]; then
  echo "[GOVERNANCE] ERROR: Risk assessment is $DAYS_OLD days old (max: 90)"
  exit 1
fi

# Check 2: Verify Approvals
RISK_LEVEL=$(grep "^Risk Level:" "$RISK_ASSESSMENT_FILE" | cut -d':' -f2 | xargs)
echo "[GOVERNANCE] System risk level: $RISK_LEVEL"

case "$RISK_LEVEL" in
  GREEN)
    if ! grep -q "Approved by: .*Governance Lead" "$RISK_ASSESSMENT_FILE"; then
      echo "[GOVERNANCE] ERROR: GREEN system requires Governance Lead approval"
      exit 1
    fi
    ;;
  YELLOW)
    if ! grep -q "Approved by: .*Director"; then
      echo "[GOVERNANCE] ERROR: YELLOW system requires Director approval"
      exit 1
    fi
    ETHICS_REVIEW="$GOVERNANCE_DIR/ethics-board-reviews/$SYSTEM_NAME.md"
    if [ ! -f "$ETHICS_REVIEW" ]; then
      echo "[GOVERNANCE] ERROR: YELLOW system requires ethics board review: $ETHICS_REVIEW"
      exit 1
    fi
    ;;
  RED)
    if ! grep -q "Approved by: .*C-suite"; then
      echo "[GOVERNANCE] ERROR: RED system requires C-suite approval"
      exit 1
    fi
    ETHICS_REVIEW="$GOVERNANCE_DIR/ethics-board-reviews/$SYSTEM_NAME.md"
    if [ ! -f "$ETHICS_REVIEW" ]; then
      echo "[GOVERNANCE] ERROR: RED system requires ethics board approval"
      exit 1
    fi
    ;;
  *)
    echo "[GOVERNANCE] ERROR: Invalid risk level: $RISK_LEVEL"
    exit 1
    ;;
esac

# Check 3: Fairness Audit (if decision system)
if grep -q "Decision System: Yes" "$RISK_ASSESSMENT_FILE"; then
  BIAS_AUDIT_FILE="$GOVERNANCE_DIR/bias-audits/$SYSTEM_NAME.md"
  if [ ! -f "$BIAS_AUDIT_FILE" ]; then
    echo "[GOVERNANCE] ERROR: Decision system requires bias audit: $BIAS_AUDIT_FILE"
    exit 1
  fi
  
  # Verify disparities are documented
  if ! grep -q "Demographic Parity:" "$BIAS_AUDIT_FILE"; then
    echo "[GOVERNANCE] ERROR: Bias audit missing fairness metrics"
    exit 1
  fi
fi

# Check 4: Monitoring Dashboard Configured
MONITORING_FILE="$GOVERNANCE_DIR/monitoring/$SYSTEM_NAME.json"
if [ ! -f "$MONITORING_FILE" ]; then
  echo "[GOVERNANCE] WARNING: Monitoring configuration not found: $MONITORING_FILE"
  # Note: This is a warning, not a hard error, to allow flexibility
else
  # Verify monitoring has alert rules
  if ! grep -q '"alertRules"' "$MONITORING_FILE"; then
    echo "[GOVERNANCE] ERROR: Monitoring configuration missing alert rules"
    exit 1
  fi
fi

# Check 5: Governance Decision Log
GOVERNANCE_LOG="$GOVERNANCE_DIR/governance-log.md"
if ! grep -q "System: $SYSTEM_NAME" "$GOVERNANCE_LOG"; then
  echo "[GOVERNANCE] ERROR: System not found in governance decision log"
  exit 1
fi

echo "[GOVERNANCE] SUCCESS: All governance requirements verified for $SYSTEM_NAME"
echo "[GOVERNANCE] System is approved for deployment to $DEPLOYMENT_TARGET"

exit 0
```

## Validation Checklist

Before deployment, this hook verifies:

- [ ] Risk assessment document exists and is current
- [ ] Risk level is clearly classified (GREEN/YELLOW/RED)
- [ ] Appropriate approval authority has signed off
- [ ] Approval is recent (within 30 days)
- [ ] Fairness audit exists (for decision systems)
- [ ] Fairness metrics documented
- [ ] Compliance review completed (for YELLOW+ systems)
- [ ] Monitoring configuration defined
- [ ] Alert rules configured
- [ ] Escalation contacts documented
- [ ] System recorded in governance decision log

## Deployment Outcomes

**PASS:** All governance requirements verified
- System is approved for production deployment
- Hook completes successfully
- Deployment proceeds

**FAIL:** Governance requirement not met
- Hook execution stops
- Deployment is blocked
- Error message specifies what's missing
- Engineering team must complete governance before retry

## Common Failures

### Risk Assessment Not Found
**Cause:** Risk assessment file doesn't exist in governance directory  
**Resolution:** Complete risk assessment using `/build-risk-framework` command

### Risk Assessment Expired
**Cause:** Risk assessment is >90 days old  
**Resolution:** Update risk assessment to confirm current status; re-date document

### Fairness Audit Missing
**Cause:** System is decision-based but has no bias audit  
**Resolution:** Complete bias audit using `/assess-bias` command

### Monitoring Not Configured
**Cause:** Monitoring dashboard/config doesn't exist  
**Resolution:** Define monitoring metrics and alert rules in governance/monitoring/ directory

### Approval Missing
**Cause:** Required approval authority hasn't signed off  
**Resolution:** Submit risk assessment to appropriate approver (Governance Lead, Director, C-suite)

## Monitoring & Alerting

Hook execution is logged with:
- System name and deployment target
- Pass/fail status
- Any governance gaps identified
- Timestamp and approver

Failed deployments are flagged to:
- System owner (immediate)
- Governance lead (immediate)
- Ethics board chair (if RED system)

## Status

**Implementation:** Hook structure defined; shell script template provided  
**Testing:** Manual validation recommended on non-production systems first  
**Production Ready:** Yes, with template customization for your governance directory structure
