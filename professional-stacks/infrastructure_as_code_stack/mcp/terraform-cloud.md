# Terraform Cloud MCP Integration

Deep integration with HashiCorp Terraform Cloud for remote state, cost estimation, policy enforcement, and team collaboration.

---

## Overview

Terraform Cloud provides:
- **Remote State:** Encrypted, versioned, locked state storage
- **Cost Estimation:** Automatic cost analysis for planned changes
- **Policy Enforcement:** Sentinel policy evaluation before deployment
- **Team Collaboration:** Workspace sharing, run approvals, audit logs
- **VCS Integration:** Automatic runs on Git push
- **Notifications:** Slack, webhooks for run updates

---

## Setup

### 1. Create Terraform Cloud Account

Visit [terraform.io/cloud](https://www.terraform.io/cloud) and sign up.

### 2. Create Organization

In Terraform Cloud UI:
- Organization name (e.g., `my-company`)
- Email for billing and support

### 3. Create Workspaces

For each environment (dev, staging, prod):

```bash
# Via Terraform CLI
terraform cloud workspace create -name production

# Via API
curl -X POST \
  https://app.terraform.io/api/v2/organizations/my-org/workspaces \
  -H "Authorization: Bearer $TF_CLOUD_TOKEN" \
  -H "Content-Type: application/vnd.api+json" \
  -d '{
    "data": {
      "type": "workspaces",
      "attributes": {
        "name": "production",
        "auto-apply": false,
        "terraform-version": "1.5.0"
      }
    }
  }'
```

### 4. Generate API Token

In Terraform Cloud UI:
- User menu → Account settings → Tokens
- Generate API token
- Copy token to safe location (only shown once)

### 5. Configure Claude Code

Add to `.claude/settings.json`:

```json
{
  "mcpServers": {
    "terraform-cloud": {
      "command": "npx",
      "args": ["@terraform-cloud/mcp-server"],
      "env": {
        "TF_CLOUD_TOKEN": "${TF_CLOUD_TOKEN}",
        "TF_CLOUD_ORGANIZATION": "my-org",
        "TF_CLOUD_HOSTNAME": "app.terraform.io"
      }
    }
  }
}
```

Set environment variable:

```bash
export TF_CLOUD_TOKEN="your_api_token_here"
export TF_CLOUD_ORGANIZATION="my-organization"
```

### 6. Configure Local Terraform

In `terraform/main.tf` or `terraform/backend.tf`:

```hcl
terraform {
  cloud {
    organization = "my-org"
    
    workspaces {
      name = "production"
    }
  }
  
  required_version = ">= 1.5"
}
```

Or use environment variables:

```bash
export TF_CLOUD_HOSTNAME="app.terraform.io"
export TF_CLOUD_TOKEN="your_api_token_here"
export TF_CLOUD_ORGANIZATION="my-organization"
```

---

## Available Tools

### Query Workspaces

```bash
# List all workspaces
claude code eval "terraform-cloud: list workspaces in organization my-org"

# Get workspace details
claude code eval "terraform-cloud: describe workspace production"

# Get current state
claude code eval "terraform-cloud: get current state for workspace production"
```

### Trigger Runs

```bash
# Trigger a run
claude code eval "terraform-cloud: trigger run in workspace production"

# Trigger with specific commit
claude code eval "terraform-cloud: trigger run for commit abc123 in workspace production"

# Trigger with variables
claude code eval "terraform-cloud: trigger run with variables in workspace production"
```

### Monitor Runs

```bash
# List recent runs
claude code eval "terraform-cloud: list recent runs in workspace production"

# Get run details
claude code eval "terraform-cloud: describe run run-abc123 in workspace production"

# Get run status
claude code eval "terraform-cloud: get status of run run-abc123"
```

### Cost Estimation

```bash
# Get cost estimate for plan
claude code eval "terraform-cloud: get cost estimate for plan plan-xyz789"

# Compare cost estimates
claude code eval "terraform-cloud: get cost estimate delta between baseline and plan-xyz789"

# Resource cost breakdown
claude code eval "terraform-cloud: get resource costs for plan plan-xyz789"
```

### Policy Enforcement

```bash
# List policy sets
claude code eval "terraform-cloud: list policy sets in organization my-org"

# Get policy check results
claude code eval "terraform-cloud: get policy check results for run run-abc123"

# List policy failures
claude code eval "terraform-cloud: list policy violations for run run-abc123"
```

### State Versions

```bash
# List state versions
claude code eval "terraform-cloud: list state versions for workspace production"

# Get specific state version
claude code eval "terraform-cloud: get state version sv-abc123"

# Rollback to previous state
claude code eval "terraform-cloud: rollback workspace production to state version sv-abc123"
```

### Variables

```bash
# List workspace variables
claude code eval "terraform-cloud: list variables in workspace production"

# Get variable
claude code eval "terraform-cloud: get variable aws_region in workspace production"

# Set variable
claude code eval "terraform-cloud: set variable environment=prod in workspace production"

# List variable sets
claude code eval "terraform-cloud: list variable sets in organization my-org"
```

---

## Workflow Integration

### Automated Workflow (GitOps)

```
Developer pushes code
    ↓
VCS webhook to Terraform Cloud
    ↓
Terraform Cloud triggers plan
    ↓
Plan generated, cost estimate shown
    ↓
Policy checks run (Sentinel policies)
    ↓
Slack/email notification to team
    ↓
Team reviews plan in UI
    ↓
Approval required (manual gate)
    ↓
terraform apply runs
    ↓
State updated, notification sent
```

### Manual Workflow (CLI)

```bash
# Step 1: Make infrastructure changes
vim terraform/main.tf

# Step 2: Format and validate
terraform fmt -recursive
terraform validate

# Step 3: Push to Git
git add terraform/
git commit -m "feat: add new RDS instance"
git push origin feature/rds-instance

# Step 4: Trigger Terraform Cloud run
claude code eval "terraform-cloud: trigger run in workspace production"

# Step 5: Monitor run
claude code eval "terraform-cloud: list recent runs in workspace production"

# Step 6: Review cost estimate
claude code eval "terraform-cloud: get cost estimate for plan plan-xyz789"

# Step 7: Approve run (in UI or via API)
curl -X POST \
  https://app.terraform.io/api/v2/runs/run-abc123/actions/approve \
  -H "Authorization: Bearer $TF_CLOUD_TOKEN"

# Step 8: Confirm apply completed
claude code eval "terraform-cloud: get status of run run-abc123"
```

---

## Cost Estimation Examples

### Example 1: New RDS Instance

**Code Change:**
```hcl
resource "aws_db_instance" "main" {
  instance_class = "db.t3.large"
  allocated_storage = 100
  multi_az = true
}
```

**Cost Estimate (from Terraform Cloud):**
```
aws_db_instance.main: $220/month
  - Instance: $140/month (t3.large, multi-AZ)
  - Storage: $80/month (100 GB gp3)

Estimated monthly delta: +$220
```

### Example 2: Removing Resources

**Code Change:** Delete old RDS instance

**Cost Estimate:**
```
aws_db_instance.old: -$180/month

Estimated monthly delta: -$180
```

---

## Policy Enforcement Examples

### Example 1: Security Policy Failure

**Sentinel Policy:**
```hcl
# Databases must be multi-AZ
main = rule {
  all aws_db_instance as db {
    db.multi_az is true
  }
}
```

**Run Results:**
```
Plan: 3 to add, 0 to change, 0 to destroy
Policy Check: FAILED

Violations:
- aws_db_instance.backup: Database not multi-AZ
  Policy: require-multi-az-databases
  Severity: mandatory
```

### Example 2: Compliance Policy Pass

**Sentinel Policy:**
```hcl
# All resources must have required tags
main = rule {
  all resources as r {
    r.tags["environment"] is defined and
    r.tags["owner"] is defined and
    r.tags["cost_center"] is defined
  }
}
```

**Run Results:**
```
Policy Check: PASSED (all 3 checks)
✓ Tagging Policy
✓ Security Policy
✓ Compliance Policy
```

---

## Sentinel Policy Examples

```hcl
# policies/require-encryption.sentinel

# Require encryption on all S3 buckets
main = rule {
  all aws_s3_bucket as bucket {
    bucket.server_side_encryption_configuration is defined and
    length(bucket.server_side_encryption_configuration) > 0
  }
}

# Prevent public S3 buckets
deny_public_s3 = rule {
  all aws_s3_bucket_acl as acl {
    acl.acl != "public-read" and
    acl.acl != "public-read-write"
  }
}

# Require encryption on RDS databases
require_rds_encryption = rule {
  all aws_db_instance as db {
    db.storage_encrypted is true
  }
}

# Enforce instance size limits
limit_instance_size = rule {
  all aws_instance as instance {
    instance.instance_type in [
      "t3.small",
      "t3.medium",
      "t3.large",
      "m5.large",
      "m5.xlarge"
    ]
  }
}
```

---

## Rollback Procedures

### Scenario: Deployment Goes Wrong

```bash
# Step 1: Identify the bad state version
claude code eval "terraform-cloud: list state versions for workspace production"

# Output:
# sv-xyz789: created 30 minutes ago (BAD - current)
# sv-abc456: created 2 hours ago (GOOD - previous)

# Step 2: Rollback to previous state
claude code eval "terraform-cloud: rollback workspace production to state version sv-abc456"

# Step 3: Verify rollback
claude code eval "terraform-cloud: get current state for workspace production"

# Step 4: Update code to match previous state
# Edit terraform files to reflect the good state

# Step 5: Push and re-deploy
git add terraform/
git commit -m "revert: rollback to previous infrastructure state"
git push origin main
```

---

## Monitoring and Notifications

### Slack Integration

In Terraform Cloud UI:
1. Go to Workspace → Notifications
2. Add Slack notification
3. Select events: Plan, Policy Check, Apply

### Email Notifications

In Terraform Cloud UI:
1. Account settings → Email preferences
2. Enable run notifications
3. Configure email digest frequency

### Custom Webhooks

```bash
# Create webhook for run events
curl -X POST \
  https://app.terraform.io/api/v2/workspaces/ws-abc123/notification-configurations \
  -H "Authorization: Bearer $TF_CLOUD_TOKEN" \
  -H "Content-Type: application/vnd.api+json" \
  -d '{
    "data": {
      "type": "notification-configurations",
      "attributes": {
        "destination_type": "generic",
        "delivery_triggers": ["run:created", "run:planning", "run:completed"],
        "url": "https://my-service.example.com/terraform-webhook"
      }
    }
  }'
```

---

## Best Practices

1. **Separate workspaces per environment** (dev, staging, prod)
2. **Require plan review before apply** (manual approval gates)
3. **Enforce Sentinel policies** for security and compliance
4. **Enable VCS integration** for GitOps workflows
5. **Monitor cost estimates** (alert on large deltas)
6. **Keep audit logs** (Terraform Cloud maintains all activity)
7. **Rotate API tokens** quarterly
8. **Use variable sets** for shared variables across workspaces
9. **Enable state versioning** (default: 100 versions retained)
10. **Document workspaces** (purpose, team, contact info)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Authentication failed | Verify API token is valid and not expired |
| Workspace not found | Check workspace name and organization spelling |
| Cost estimation missing | Enable cost estimation in workspace settings |
| Policy not enforcing | Verify policy set is attached to workspace |
| Run timeout | Increase timeout in workspace settings (default: 1 hour) |
| State lock stuck | Force unlock via API (use with caution) |

---

**Last updated:** 2026-06-15
