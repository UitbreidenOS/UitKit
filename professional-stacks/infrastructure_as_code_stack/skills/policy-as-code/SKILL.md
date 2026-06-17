# Policy-as-Code Skill

## When to activate

When defining compliance policies, enforcing security baselines, controlling infrastructure costs, ensuring resource naming standards, or managing policy-driven deployments with OPA/Sentinel.

## When NOT to use

For temporary, ad-hoc constraints; policies are governance tools and should be permanent and collaborative.

## Instructions

### Policy Design Framework

Every organization needs policies across these dimensions:

1. **Security:** Prevent misconfigurations that expose data or systems
   - Encrypted storage and transit
   - Private databases and endpoints
   - No hardcoded secrets
   - Minimal IAM permissions

2. **Compliance:** Meet regulatory or contractual requirements
   - Data residency restrictions
   - Backup and retention requirements
   - Audit logging and encryption
   - PII handling rules

3. **Cost Control:** Prevent wasteful spending
   - Instance size limits
   - Region restrictions
   - Auto-shutdown policies
   - Unused resource cleanup

4. **Operations:** Standardize resource management
   - Mandatory tagging (environment, owner, cost-center)
   - Naming conventions
   - Version pinning (provider versions)
   - Documentation requirements

5. **Architecture:** Enforce design patterns
   - High availability (multi-AZ)
   - Load balancing requirements
   - Network isolation
   - Monitoring and alerting

### OPA/Rego Policies

```rego
# policies/terraform_rules.rego

package terraform

# ===== SECURITY POLICIES =====

# Deny unrestricted inbound traffic on security groups
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_security_group"
    rule := resource.change.after.ingress[_]
    rule.from_port < rule.to_port  # Port range
    rule.cidr_blocks[_] == "0.0.0.0/0"
    msg := sprintf("SG %s: port range %d-%d open to world", [
        resource.address,
        rule.from_port,
        rule.to_port
    ])
}

# Deny unrestricted individual ports
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_security_group"
    rule := resource.change.after.ingress[_]
    rule.from_port == rule.to_port
    rule.cidr_blocks[_] == "0.0.0.0/0"
    port := rule.from_port
    restricted_ports := [22, 3389, 3306, 5432, 27017]
    port in restricted_ports
    msg := sprintf("SG %s: port %d open to world (restricted port)", [resource.address, port])
}

# Require encryption on RDS instances
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_db_instance"
    resource.change.after.storage_encrypted != true
    msg := sprintf("RDS %s: storage encryption required", [resource.address])
}

# Deny publicly accessible databases
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_db_instance"
    resource.change.after.publicly_accessible == true
    msg := sprintf("RDS %s: must not be publicly accessible", [resource.address])
}

# Require backup retention on databases
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_db_instance"
    retention := resource.change.after.backup_retention_period
    retention < 7
    msg := sprintf("RDS %s: backup retention must be >= 7 days (was %d)", [resource.address, retention])
}

# Require encryption on S3 buckets
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    resource.change.after.server_side_encryption_configuration == null
    msg := sprintf("S3 %s: server-side encryption required", [resource.address])
}

# Require versioning on S3 buckets
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    resource.change.after.versioning[_].enabled != true
    msg := sprintf("S3 %s: versioning required", [resource.address])
}

# Require IAM encryption key for sensitive resources
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    kms_key := resource.change.after.server_side_encryption_configuration[_].rule[_].apply_server_side_encryption_by_default[_].kms_master_key_id
    kms_key == null or kms_key == ""
    msg := sprintf("S3 %s: must use customer-managed KMS key", [resource.address])
}

# ===== COMPLIANCE POLICIES =====

# Require mandatory tags on all resources
deny[msg] {
    resource := input.resource_changes[_]
    resource.type in ["aws_instance", "aws_db_instance", "aws_s3_bucket", "aws_rds_cluster"]
    tags := resource.change.after.tags
    required_tags := ["environment", "owner", "cost_center"]
    missing := [tag | tag := required_tags[_]; not tags[tag]]
    length(missing) > 0
    msg := sprintf("%s missing tags: %v", [resource.address, missing])
}

# Enforce environment tag values
deny[msg] {
    resource := input.resource_changes[_]
    tags := resource.change.after.tags
    env := tags.environment
    valid_envs := ["dev", "staging", "prod"]
    not env in valid_envs
    msg := sprintf("%s: environment must be one of %v (was %q)", [resource.address, valid_envs, env])
}

# Require multi-AZ for production RDS
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_db_instance"
    tags := resource.change.after.tags
    tags.environment == "prod"
    resource.change.after.multi_az != true
    msg := sprintf("RDS %s: production databases must be multi-AZ", [resource.address])
}

# ===== COST CONTROL POLICIES =====

# Limit instance types to approved list
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_instance"
    instance_type := resource.change.after.instance_type
    allowed_types := ["t3.small", "t3.medium", "t3.large", "m5.large", "m5.xlarge"]
    not instance_type in allowed_types
    msg := sprintf("EC2 %s: instance type %q not approved", [resource.address, instance_type])
}

# Require spot instances for non-production
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_instance"
    tags := resource.change.after.tags
    tags.environment != "prod"
    resource.change.after.instance_market_options == null
    msg := sprintf("EC2 %s: non-production instances should use spot pricing", [resource.address])
}

# Prevent expensive RDS instance types
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_db_instance"
    instance_class := resource.change.after.instance_class
    expensive := ["db.r5.4xlarge", "db.r5.24xlarge", "db.x1.32xlarge"]
    instance_class in expensive
    msg := sprintf("RDS %s: instance type %q too expensive; requires approval", [resource.address, instance_class])
}

# Enforce region restrictions
deny[msg] {
    resource := input.resource_changes[_]
    provider := resource.provider
    region := resource.change.after.region
    allowed_regions := ["us-east-1", "us-west-2", "eu-west-1"]
    not region in allowed_regions
    msg := sprintf("%s: region %q not approved (use: %v)", [resource.address, region, allowed_regions])
}

# ===== OPERATIONAL POLICIES =====

# Require name tags matching resource address
deny[msg] {
    resource := input.resource_changes[_]
    resource.type in ["aws_instance", "aws_security_group", "aws_vpc"]
    tags := resource.change.after.tags
    name_tag := tags.Name
    name_tag == null or name_tag == ""
    msg := sprintf("%s missing 'Name' tag", [resource.address])
}

# Enforce naming conventions (kebab-case)
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_instance"
    name := resource.change.after.tags.Name
    not regex.match("^[a-z0-9]([a-z0-9-]*[a-z0-9])?$", name)
    msg := sprintf("EC2 %s: name %q must be lowercase with hyphens only", [resource.address, name])
}

# Require deletion protection on critical resources
deny[msg] {
    resource := input.resource_changes[_]
    resource.type in ["aws_db_instance", "aws_rds_cluster"]
    tags := resource.change.after.tags
    tags.environment == "prod"
    resource.change.after.deletion_protection != true
    msg := sprintf("%s: production databases must have deletion protection", [resource.address])
}

# ===== WARNINGS (warn but don't block) =====

warn[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_instance"
    resource.change.after.monitoring == false
    msg := sprintf("EC2 %s: detailed monitoring disabled (recommended: enabled)", [resource.address])
}

warn[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_db_instance"
    resource.change.after.backup_retention_period < 14
    msg := sprintf("RDS %s: backup retention < 14 days (recommended: 30)", [resource.address])
}
```

### Terraform Cloud Sentinel Policies

```hcl
# policies/sentinel/require_encryption.sentinel

import "tfplan/v2" as tfplan
import "tfplan/v2" as tfstate

# Require encryption on all S3 buckets

main = rule {
    all_s3_buckets = tfplan.resources.aws_s3_bucket else {}
    
    all(all_s3_buckets) as _, bucket {
        bucket.change.after.server_side_encryption_configuration != null
    }
}
```

### Kyverno Policies (Kubernetes)

```yaml
# kyverno-policies.yaml

---
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-resource-limits
spec:
  validationFailureAction: enforce
  rules:
  - name: validate-resources
    match:
      resources:
        kinds:
        - Pod
    validate:
      message: "CPU and memory limits required"
      pattern:
        spec:
          containers:
          - resources:
              limits:
                memory: "?*"
                cpu: "?*"

---
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-image-pull-policy
spec:
  validationFailureAction: enforce
  rules:
  - name: validate-image-pull-policy
    match:
      resources:
        kinds:
        - Pod
    validate:
      message: "imagePullPolicy must be IfNotPresent or Always"
      pattern:
        spec:
          containers:
          - imagePullPolicy: "IfNotPresent | Always"

---
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-security-context
spec:
  validationFailureAction: enforce
  rules:
  - name: validate-runAsNonRoot
    match:
      resources:
        kinds:
        - Pod
    validate:
      message: "runAsNonRoot required"
      pattern:
        spec:
          containers:
          - securityContext:
              runAsNonRoot: true
```

## Example

**Scenario:** Enforce security and compliance policies on a production Terraform deployment.

**Policies implemented:**

1. **Security:**
   - Security groups deny unrestricted SSH (port 22)
   - RDS instances require encryption and multi-AZ
   - S3 buckets require versioning and KMS encryption

2. **Compliance:**
   - All resources tagged with environment, owner, cost_center
   - Production resources require deletion protection
   - RDS backup retention >= 7 days

3. **Cost Control:**
   - EC2 instances limited to t3.medium, m5.large
   - Non-production instances use spot pricing
   - RDS limited to db.t3.medium, db.r5.large

4. **Operations:**
   - Resource names follow kebab-case
   - All resources have Name tags
   - Monitoring enabled on production instances

**Validation workflow:**

```bash
terraform plan -json > tfplan.json
opa eval -d policies/terraform_rules.rego -i tfplan.json 'data.terraform.deny'

# Output (if violations):
[
  "SG sg-12345: port 22 open to world (restricted port)",
  "RDS rds-db: production databases must be multi-AZ",
  "EC2 i-12345: instance type t4g.nano not approved"
]

# Fix violations in code, re-validate, all policies pass
# Deploy with confidence
```

This ensures:
- Security: Encrypted, isolated, auditable infrastructure
- Compliance: Tagged, backed-up, retention-compliant resources
- Cost: Right-sized, spot-enabled, region-restricted infrastructure
- Operations: Consistent naming, monitoring, deletion protection
