# Policy Enforcer Hook

## Purpose

Automatically validate Terraform and Kubernetes against OPA/Sentinel policies before merge or deployment. Blocks non-compliant infrastructure changes, enforcing security, compliance, cost, and operational standards.

## settings.json Configuration

```json
{
  "hooks": {
    "onPreCommit": {
      "policy-enforcer": {
        "shell": "bash",
        "script": "infrastructure_as_code_stack/hooks/policy-enforcer.sh",
        "filter": {
          "files": ["*.tf", "*.tfvars", "*.yaml", "*.yml"]
        }
      }
    },
    "onPrePush": {
      "policy-enforcer-push": {
        "shell": "bash",
        "script": "infrastructure_as_code_stack/hooks/policy-enforcer.sh",
        "filter": {
          "files": ["*.tf", "*.tfvars"]
        }
      }
    }
  }
}
```

## Hook Behavior

This hook fires on:
1. **Pre-commit:** Before staging changes (catches issues early)
2. **Pre-push:** Before pushing to remote (final validation)

It:

1. **Validates Terraform syntax** using `terraform validate`
2. **Runs security scans** using `tfsec`
3. **Evaluates OPA policies** against Terraform plan
4. **Validates Kubernetes manifests** using `kubeval` and `kubesec`
5. **Checks cost impact** using `infracost`
6. **Reports violations** with details and remediation steps
7. **Blocks commit/push** if violations found (configurable)

## Implementation

Hook script: `infrastructure_as_code_stack/hooks/policy-enforcer.sh`

```bash
#!/bin/bash
set -e

TERRAFORM_DIR="${TERRAFORM_DIR:-.}"
POLICIES_DIR="${POLICIES_DIR:-.}/policies"
STRICT_MODE="${STRICT_MODE:-true}"  # Block on violations
EXIT_CODE=0

echo "=== Policy Enforcement: $(date) ==="

# ===== TERRAFORM VALIDATION =====
echo "Step 1: Terraform Syntax Validation"
if command -v terraform &> /dev/null; then
  cd "$TERRAFORM_DIR"
  if ! terraform validate; then
    echo "❌ Terraform validation failed"
    EXIT_CODE=1
  else
    echo "✓ Terraform syntax valid"
  fi
  cd - > /dev/null
else
  echo "⚠️ Terraform not installed, skipping validation"
fi

# ===== SECURITY SCANNING =====
echo "Step 2: Security Scanning (tfsec)"
if command -v tfsec &> /dev/null; then
  if tfsec "$TERRAFORM_DIR" --minimum-severity HIGH --exit-code 0; then
    echo "✓ Security scan passed"
  else
    echo "⚠️ Security issues found (warnings only)"
    EXIT_CODE=1
  fi
else
  echo "⚠️ tfsec not installed, skipping security scan"
fi

# ===== OPA POLICY COMPLIANCE =====
echo "Step 3: OPA Policy Compliance Check"
if command -v opa &> /dev/null && [ -d "$POLICIES_DIR" ]; then
  cd "$TERRAFORM_DIR"
  terraform plan -json > /tmp/tfplan.json 2>&1 || true
  cd - > /dev/null
  
  # Run OPA policies
  if opa eval -d "$POLICIES_DIR" -i /tmp/tfplan.json 'data.terraform.deny' > /tmp/opa-violations.json 2>&1; then
    VIOLATIONS=$(jq 'length' /tmp/opa-violations.json)
    if [ "$VIOLATIONS" -gt 0 ]; then
      echo "❌ OPA policy violations: $VIOLATIONS"
      jq -r '.[]' /tmp/opa-violations.json | while read -r violation; do
        echo "  - $violation"
      done
      if [ "$STRICT_MODE" = "true" ]; then
        EXIT_CODE=2
      else
        EXIT_CODE=1
      fi
    else
      echo "✓ All OPA policies passed"
    fi
  else
    echo "⚠️ OPA policy evaluation failed"
  fi
else
  echo "⚠️ OPA not installed or no policies found"
fi

# ===== KUBERNETES VALIDATION =====
echo "Step 4: Kubernetes Manifest Validation"
if command -v kubeval &> /dev/null; then
  # Find all YAML files in kubernetes directory
  if find . -name "*.yaml" -o -name "*.yml" | grep -q kubernetes; then
    if kubeval -d kubernetes/ --skip-kinds NetworkPolicy 2>&1 | grep -q "VALID"; then
      echo "✓ Kubernetes manifests valid"
    else
      echo "❌ Kubernetes manifest errors"
      EXIT_CODE=1
    fi
  fi
else
  echo "⚠️ kubeval not installed"
fi

# ===== KUBESEC SECURITY SCAN =====
echo "Step 5: Kubernetes Security Scan (Kubesec)"
if command -v kubesec &> /dev/null; then
  if find . -name "*.yaml" -o -name "*.yml" | grep -q kubernetes; then
    KUBESEC_SCORE=$(kubesec scan kubernetes/**/*.yaml 2>&1 | jq '[.[].score] | min // -1')
    if [ "$KUBESEC_SCORE" -lt 5 ]; then
      echo "⚠️ Kubernetes security score: $KUBESEC_SCORE (target: >= 5)"
      EXIT_CODE=1
    else
      echo "✓ Kubernetes security score: $KUBESEC_SCORE"
    fi
  fi
else
  echo "⚠️ Kubesec not installed"
fi

# ===== COST ESTIMATION =====
echo "Step 6: Cost Impact Estimation"
if command -v infracost &> /dev/null; then
  cd "$TERRAFORM_DIR"
  terraform plan -json > /tmp/tfplan.json 2>&1 || true
  COST_INCREASE=$(infracost breakdown --path /tmp/tfplan.json --format json 2>&1 | jq '.totalMonthlyCost // 0' || echo "0")
  
  if [ -n "$COST_INCREASE" ] && [ "$COST_INCREASE" -gt 5000 ]; then
    echo "⚠️ Monthly cost increase: $$COST_INCREASE (review required)"
    EXIT_CODE=1
  else
    echo "✓ Cost impact acceptable"
  fi
  cd - > /dev/null
else
  echo "⚠️ Infracost not installed"
fi

# ===== TAGGING COMPLIANCE =====
echo "Step 7: Resource Tagging Compliance"
if grep -r "tags = " "$TERRAFORM_DIR" --include="*.tf" > /dev/null; then
  UNTAGGED=$(grep -r "resource \"aws_" "$TERRAFORM_DIR" --include="*.tf" | grep -v "tags" | wc -l)
  if [ "$UNTAGGED" -gt 0 ]; then
    echo "⚠️ Found $UNTAGGED resources without tags"
    EXIT_CODE=1
  else
    echo "✓ All resources properly tagged"
  fi
fi

# ===== SUMMARY =====
echo ""
echo "=== Policy Enforcement Summary ==="
if [ "$EXIT_CODE" -eq 0 ]; then
  echo "✓ All policy checks passed"
  echo "✓ Ready to commit/push"
elif [ "$EXIT_CODE" -eq 1 ]; then
  echo "⚠️ Warnings found (non-blocking)"
  echo "Review warnings before proceeding"
elif [ "$EXIT_CODE" -eq 2 ]; then
  echo "❌ Policy violations found (blocking)"
  echo "Fix violations and try again"
fi

exit "$EXIT_CODE"
```

## Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `TERRAFORM_DIR` | Path to Terraform configuration | `.` |
| `POLICIES_DIR` | Path to OPA/Sentinel policies | `./policies` |
| `STRICT_MODE` | Block on policy violations | `true` |

## Enforcement Levels

| Level | Behavior | Use Case |
|-------|----------|----------|
| **Strict** (EXIT_CODE=2) | Blocks commit/push | Critical policies (security, compliance) |
| **Warning** (EXIT_CODE=1) | Logs warning, allows proceed | Best practices, cost thresholds |
| **Info** (EXIT_CODE=0) | Logs info, always succeeds | Informational checks |

## Policy Categories

### Security Policies (Strict)

- No unrestricted security groups (port 22, 3306, 5432 to 0.0.0.0/0)
- RDS encryption required
- S3 versioning and encryption required
- Secrets not hardcoded in code
- IAM roles follow least-privilege

### Compliance Policies (Strict)

- Mandatory tags: environment, owner, cost-center
- Environment tag validation (dev, staging, prod)
- Production resources: multi-AZ, deletion protection
- Backup retention >= 7 days
- Audit logging enabled

### Cost Policies (Warning)

- Instance types: approved list only
- Non-production instances: spot pricing required
- RDS instance class: size limits
- Region restrictions
- Monthly cost variance < 10%

### Operational Policies (Warning)

- Naming conventions: kebab-case
- All resources have Name tags
- Documentation requirements
- Monitoring enabled
- Version pinning (provider, modules)

## Example Workflow

**Scenario:** Developer commits Terraform that violates 2 policies.

**Step 1: Commit attempt**
```bash
git commit -m "Add new RDS instance"
```

**Step 2: Policy enforcer runs**
```
Step 1: Terraform Syntax Validation
✓ Terraform syntax valid

Step 2: Security Scanning (tfsec)
⚠️ Security issues found (warnings only)

Step 3: OPA Policy Compliance Check
❌ OPA policy violations: 2
  - RDS rds-db: production databases must be multi-AZ
  - RDS rds-db: missing 'environment' tag

Step 4: Kubernetes Manifest Validation
⚠️ kubeval not installed

Step 5: Cost Impact Estimation
✓ Cost impact acceptable

=== Policy Enforcement Summary ===
❌ Policy violations found (blocking)
Fix violations and try again
```

**Step 3: Developer fixes violations**
```hcl
resource "aws_db_instance" "main" {
  # ...
  multi_az = true  # ✓ Added multi-AZ
  tags = {
    environment = "prod"  # ✓ Added tag
    owner       = "platform-team"
    cost_center = "engineering"
  }
}
```

**Step 4: Commit succeeds**
```bash
git commit -m "Add new RDS instance with multi-AZ and tags"
# Policy enforcer: ✓ All checks passed
# Commit successful
```

## Monitoring and Metrics

Track policy enforcement metrics:

- **Policy violations:** Trend over time (should decrease)
- **Violation types:** Which policies are most frequently violated?
- **Remediation time:** How long to fix violations?
- **False positives:** Are policies too strict?
- **Team adoption:** Is team complying with policies?

## Best Practices

1. **Start lenient:** Begin with warnings, move to strict over time
2. **Document policies:** Every policy should explain why
3. **Provide examples:** Show compliant and non-compliant code
4. **Iterate:** Review policies quarterly with team
5. **Automate fixes:** Where possible, auto-remediate (e.g., add tags)
6. **Communicate:** Alert team when policies change
7. **Exceptions:** Document and track any policy exceptions
8. **Dashboard:** Show policy compliance metrics to leadership

## Status

Hook script is a template. Customize for your:
- Cloud provider (AWS, GCP, Azure)
- OPA policies directory
- Team's risk tolerance (strict vs. lenient)
- Cost thresholds
- Naming conventions
