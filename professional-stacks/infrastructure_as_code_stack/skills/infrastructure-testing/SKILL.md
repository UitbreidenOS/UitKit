# Infrastructure Testing Skill

## When to activate

When validating Terraform configurations, testing Kubernetes manifests, conducting security and cost analysis, or implementing compliance checks before deployment.

## When NOT to use

For manual infrastructure testing via cloud console; all testing must be automated and version-controlled.

## Instructions

### Terraform Validation

Start with syntax and structural validation:

```bash
# Format check
terraform fmt -check -recursive .

# Syntax validation
terraform validate

# Security scanning with tfsec
tfsec . --format json

# Policy compliance with Terraform Cloud
terraform apply -json | jq .resource_changes[]
```

**Validation checklist:**
- [ ] Module outputs match inputs in parent modules
- [ ] Variable types match usage (no string to number coercion)
- [ ] No hardcoded sensitive data (passwords, keys)
- [ ] Resource names follow naming convention (kebab-case)
- [ ] All variables have descriptions and defaults where appropriate

### Cost Estimation

Estimate infrastructure costs before deployment:

```bash
# Generate cost estimate
terraform plan -out=tfplan
terraform show -json tfplan | infracost breakdown --path /dev/stdin

# Expected cost changes
Costs will increase by $500/month:
  - AWS EC2 (t3.large): +$50/month
  - RDS (db.t3.medium, Multi-AZ): +$300/month
  - NAT Gateway (3x): +$150/month
```

**Cost thresholds:**
- Deviation > 10% from baseline: review and justify
- New costs > $5000/month: requires approval
- Unused resources: immediate remediation

### Policy Compliance with OPA

Define policies in Rego and validate before deployment:

```rego
# policies/terraform_rules.rego

package terraform

# Deny unrestricted inbound on security groups
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_security_group"
    rule := resource.change.after.ingress[_]
    rule.cidr_blocks[_] == "0.0.0.0/0"
    msg := sprintf("Security group %s allows unrestricted inbound traffic", [resource.address])
}

# Deny publicly accessible databases
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_db_instance"
    resource.change.after.publicly_accessible == true
    msg := sprintf("Database %s is publicly accessible", [resource.address])
}

# Require encryption for S3 buckets
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    resource.change.after.server_side_encryption_configuration == null
    msg := sprintf("S3 bucket %s missing encryption", [resource.address])
}

# Enforce tagging on all resources
deny[msg] {
    resource := input.resource_changes[_]
    resource.type in ["aws_instance", "aws_db_instance", "aws_s3_bucket"]
    tags := resource.change.after.tags
    not tags.environment
    msg := sprintf("%s missing 'environment' tag", [resource.address])
}

# Limit instance types to approved list
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_instance"
    instance_type := resource.change.after.instance_type
    allowed := ["t3.small", "t3.medium", "t3.large", "m5.large"]
    not contains(allowed, instance_type)
    msg := sprintf("Instance type %s not approved; use: %v", [instance_type, allowed])
}
```

**Validate Terraform against OPA:**

```bash
# Generate Terraform JSON plan
terraform plan -json | jq -s > tfplan.json

# Run OPA policy check
opa eval -d policies/terraform_rules.rego -i tfplan.json 'data.terraform.deny'

# Expected output (if violations):
[
  "Security group sg-12345 allows unrestricted inbound traffic",
  "Database rds-12345 is publicly accessible"
]
```

### Kubernetes Manifest Validation

Validate Kubernetes YAML before deployment:

```bash
# Syntax validation
kubeval -d kubernetes/manifests/ --skip-kinds NetworkPolicy

# Policy compliance with Kyverno
kubectl apply -f kyverno-policies.yaml
kubectl apply -f kubernetes/manifests/ --dry-run=client

# Security scanning with Kubesec
kubesec scan kubernetes/manifests/deployment.yaml
# Output:
# [
#   {
#     "object": "Deployment/api-service",
#     "score": 7,
#     "scoring": {
#       "critical": [],
#       "advise": [
#         {
#           "selector": "containers[] | securityContext.runAsNonRoot == true",
#           "reason": "Force the container to run as a non-root user"
#         }
#       ]
#     }
#   }
# ]

# Image scanning for vulnerabilities
trivy image --severity CRITICAL,HIGH registry.example.com/api-service:1.0.0
```

**Kubernetes validation checklist:**
- [ ] Resource requests/limits set for all containers
- [ ] Liveness and readiness probes configured
- [ ] Security context: runAsNonRoot, readOnlyFilesystem
- [ ] No secrets hardcoded in manifests
- [ ] ImagePullPolicy: IfNotPresent or Always (never blank)
- [ ] Pod security policies enforced (namespace-level)

### Drift Detection

Detect infrastructure changes outside of IaC:

```bash
# Generate current state
terraform refresh

# Compare desired vs actual
terraform plan -out=drift.plan

# Human-readable diff
terraform show drift.plan

# If drift detected:
#   Option 1: Update code to match actual state
#   Option 2: Run terraform apply to revert to desired state

# Automated drift detection (run hourly)
terraform plan -json | jq '.resource_changes[] | select(.change.before != .change.after)'
```

### Security Scanning

Scan infrastructure for security vulnerabilities:

```bash
# Scan Terraform
tfsec . --minimum-severity HIGH

# Scan Kubernetes manifests
kubesec scan kubernetes/manifests/deployment.yaml | jq '.[] | select(.score < 5)'

# Scan container images
trivy image --severity HIGH,CRITICAL my-registry/api:v1.0.0

# Scan dependencies
snyk infrastructure test kubernetes/manifests/
```

### Example: Complete Testing Pipeline

```bash
#!/bin/bash
set -e

echo "Step 1: Terraform Format Check"
terraform fmt -check -recursive .

echo "Step 2: Terraform Validation"
terraform validate

echo "Step 3: Security Scanning (tfsec)"
tfsec . --format json --exit-code 1

echo "Step 4: Generate Plan"
terraform plan -out=tfplan

echo "Step 5: OPA Policy Compliance"
terraform show -json tfplan > tfplan.json
opa eval -d policies/terraform_rules.rego -i tfplan.json 'data.terraform.deny' | jq 'if length > 0 then error("Policy violations") else . end'

echo "Step 6: Cost Estimation"
infracost breakdown --path tfplan --format json

echo "Step 7: Kubernetes Manifests"
kubeval -d kubernetes/manifests/
kubesec scan kubernetes/manifests/deployment.yaml | jq '.[] | select(.score < 5)' && echo "Security issues found" || echo "Kubesec passed"

echo "Step 8: Drift Detection"
terraform plan -json | jq '.resource_changes[] | select(.change.before != .change.after)' || echo "No drift detected"

echo "All checks passed! Ready for deployment."
```

## Example

**Scenario:** Validate a Terraform deployment for a production Kubernetes cluster with RDS database.

**Testing steps:**

1. **Format and syntax:** terraform fmt, terraform validate
2. **Security scan:** tfsec finds 3 critical issues
   - Security group allows unrestricted SSH (22)
   - RDS publicly accessible
   - S3 bucket missing encryption
3. **Fix issues:** Update code, re-validate, all checks pass
4. **Cost estimation:** Infrastructure costs $8,500/month (within budget)
5. **OPA policies:** Run 10 compliance rules; 2 violations (untagged resources)
6. **Tag resources:** Update Terraform, re-run OPA, all policies pass
7. **Kubernetes validation:** kubeval and Kubesec validate manifests
8. **Image scan:** trivy scans base images, finds no critical vulnerabilities
9. **Drift detection:** No drift; infrastructure matches code
10. **Approval:** All checks pass, ready for production deployment

This ensures infrastructure is:
- Syntactically correct
- Secure (no open ports, encrypted data, private databases)
- Compliant (policies enforced, tags present)
- Cost-aware (no surprises)
- Reproducible (no drift)
