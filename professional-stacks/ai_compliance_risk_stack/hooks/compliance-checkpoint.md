# Compliance Checkpoint Hook

## Purpose

Automatically validate compliance readiness before AI models are deployed to production. This hook ensures all mandatory compliance requirements are met before any model reaches production, preventing deployments that lack required documentation, risk assessments, or governance approvals.

## settings.json Configuration

```json
{
  "hooks": {
    "preCommandExecution": {
      "compliance-checkpoint": {
        "shell": "bash",
        "script": "ai_compliance_risk_stack/hooks/compliance-checkpoint.sh",
        "filter": {
          "command": ["deploy", "release", "promote"],
          "context": ["production", "prod"]
        }
      }
    }
  }
}
```

## Hook Behavior

This hook fires before deployment commands (deploy, release, promote) when targeting production. It:

1. **Validates Compliance Checklist Completion**
   - Checks for completed compliance checklist file
   - Verifies all checklist items marked complete
   - Identifies any incomplete items and blocks deployment

2. **Verifies Required Documentation**
   - Model card exists and contains all required sections
   - Risk register completed with all identified risks
   - Decision log created and populated
   - Data governance documentation present

3. **Confirms Risk Assessment & Mitigations**
   - Risk assessment conducted and documented
   - All high/critical risks have documented mitigations
   - Residual risk is within acceptable tolerance
   - Sign-offs obtained from Compliance Officer and Legal

4. **Validates Fairness Audit Results**
   - Bias audit completed for identified protected classes
   - Demographic disparities documented
   - Fairness metrics within acceptable thresholds
   - Mitigations in place for any disparities > 5%

5. **Checks Governance Readiness**
   - Access controls and change management procedures documented
   - Monitoring dashboard configured for production
   - Incident response plan documented and tested
   - Escalation procedures defined

6. **Blocks Non-Compliant Deployments**
   - If critical compliance gaps found, deployment blocked with detailed report
   - Report lists specific missing items, required owners, and remediation timeline
   - Suggests fast-track remediation for common missing items

## Implementation

Hook script: `ai_compliance_risk_stack/hooks/compliance-checkpoint.sh`

The script:
- Scans project for compliance documentation files
- Validates checklist completion status
- Verifies required approvals and sign-offs
- Generates compliance report
- Exits with error if blockers found; allows deployment if cleared

## Configuration in settings.json

```json
{
  "hooks": {
    "preCommandExecution": {
      "compliance-checkpoint": {
        "shell": "bash",
        "script": "ai_compliance_risk_stack/hooks/compliance-checkpoint.sh",
        "filter": {
          "command": ["deploy", "release", "promote", "push"],
          "context": ["production", "prod", "main"]
        },
        "env": {
          "COMPLIANCE_DIR": ".compliance",
          "REQUIRE_FAIRNESS_AUDIT": "true",
          "REQUIRE_LEGAL_SIGN_OFF": "true",
          "FAIRNESS_THRESHOLD": "0.05"
        }
      }
    }
  }
}
```

## Usage Example

**Scenario:** Team attempts to deploy Model X to production.

```bash
$ claude deploy model-x --target production
```

**Hook Executes:**
1. Checks for compliance/.model-x-checklist.md
2. Validates all checklist items marked [x]
3. Checks for risk-register.md with sign-offs
4. Verifies bias audit results
5. Confirms incident response plan

**If Checklist Incomplete:**
```
ERROR: Compliance checkpoint blocked deployment

Model: model-x
Status: Non-compliant (5 critical gaps)

Missing Items:
  [ ] Item 1: Fairness audit not completed
      Owner: Data Science Lead
      Required by: [Date]
      Fast-track: Run /audit-model command

  [ ] Item 2: Legal sign-off missing
      Owner: General Counsel
      Required by: [Date]
      Fast-track: Send for review

  [ ] Item 3: Incident response plan not documented
      Owner: Compliance Officer
      Required by: [Date]
      Fast-track: Use template in CLAUDE.md

To override (NOT RECOMMENDED): --skip-compliance-check

Deployment blocked. Address gaps and retry.
```

**If Compliant:**
```
✓ Compliance checkpoint passed
✓ All required documentation present
✓ Risk assessment completed
✓ Fairness audit passed (disparities < 5%)
✓ Required sign-offs obtained
✓ Incident response plan documented

Proceeding with deployment...
```

## Compliance Checklist Template

The hook validates against this checklist structure:

```markdown
# Compliance Checklist: [Model Name]

## Regulatory Mapping
- [x] Regulations identified and documented
- [x] Applicability assessment completed
- [ ] Regulatory gaps identified and risk tolerance approved

## Risk Assessment
- [x] Risk register completed
- [x] Residual risk approved by CRO
- [ ] Incident response plan documented

## Fairness & Bias
- [x] Demographic parity analysis completed
- [x] Known disparities documented
- [x] Fairness metrics baseline established
- [ ] Bias audit results reviewed

## Data Governance
- [x] Data lineage documented
- [x] Consent records available
- [x] PII handling procedures documented
- [ ] Data quality assessment completed

## Documentation
- [x] Model card completed
- [x] Decision log created
- [x] Audit trail access configured
- [ ] Incident response runbook prepared

## Sign-Offs
- [x] Compliance Officer: _____ Date: _____
- [ ] Legal Review: _____ Date: _____
- [ ] ML Owner: _____ Date: _____
```

## Exit Behavior

**Exit Code 0 (Success):** All compliance checks passed; deployment proceeds.

**Exit Code 1 (Failure):** Compliance gaps detected; deployment blocked. Report details specific gaps.

**Exit Code 2 (Critical):** Critical regulatory or security gap detected; deployment blocked with escalation recommendation.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Hook not firing | Verify filter settings match deployment command (e.g., "deploy", "release") and target (e.g., "production") |
| False positives (over-blocking) | Review REQUIRE_* environment variables; may be too strict for early-stage models |
| Legitimate override needed | Use `--skip-compliance-check` flag (logs override with timestamp) |
| Missing checklist | Point team to template in CLAUDE.md; generate checklist file |

## Integration with Other Hooks

**Incident Logger Hook:** If deployment succeeds, incident logger activates to track deployment event and compliance approvals in audit trail.

**Regulatory Change Monitor Hook:** Continuously monitors for regulatory changes that may affect deployed models; alerts if previously-passing model now fails compliance checks.

## Success Metrics

Track effectiveness of this hook:
- **Deployment Compliance Rate:** % of production models with completed compliance checklist (target: 100%)
- **Average Remediation Time:** Time from gap detection to remediation (target: < 14 days for medium-risk gaps)
- **Override Rate:** % of deployments using `--skip-compliance-check` (target: < 5%)
- **Incident Rate:** % of deployed models with post-deployment compliance issues (target: 0%)

---

## Related Documentation

- See CLAUDE.md for compliance framework and checklist template
- See skills/compliance-framework-designer/SKILL.md for governance structure
- See commands/design-compliance-framework.md for compliance framework design command
- See incident-logger.md for incident tracking hook
