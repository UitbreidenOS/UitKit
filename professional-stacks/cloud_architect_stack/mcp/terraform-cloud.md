# Terraform Cloud Integration

Terraform Cloud provides remote state management, cost estimation, run management, and VCS integration for infrastructure-as-code workflows.

---

## Overview

Terraform Cloud benefits:
- **Remote state management** — Centralized .tfstate, no local files in Git
- **State locking** — Prevents concurrent applies, eliminates conflicts
- **Cost estimation** — Shows cost delta before apply
- **Run approvals** — Require human approval before destroy
- **Audit logs** — Track all infrastructure changes with who/when/why
- **VCS integration** — Plan on PR, apply on merge to main

---

## Setup

### Step 1: Create Terraform Cloud Account

1. Visit https://app.terraform.io
2. Sign up (free tier available)
3. Create organization (e.g., "mycompany")
4. Note organization name

### Step 2: Generate API Token

```bash
# In Terraform Cloud:
# https://app.terraform.io/app/settings/tokens → Create an API Token

# Store token securely
export TF_CLOUD_TOKEN="tfc_XXXXXXXXXXXXX"
```

### Step 3: Authenticate Locally

```bash
terraform login

# When prompted, paste API token
# Verify: ~/.terraform.d/credentials.tfrc.json created
```

### Step 4: Configure Backend

```hcl
# terraform.tf
terraform {
  cloud {
    organization = "mycompany"
    
    workspaces {
      name = terraform.workspace  # Use workspace name from env var
    }
  }
}

provider "aws" {
  region = var.aws_region
}
```

### Step 5: Create Workspaces

```bash
# Create workspaces in Terraform Cloud
# https://app.terraform.io/app/organizations/mycompany/workspaces

# Or via CLI (if using Terraform Cloud API)
curl -X POST \
  https://app.terraform.io/api/v2/organizations/mycompany/workspaces \
  -H "Authorization: Bearer $TF_CLOUD_TOKEN" \
  -H "Content-Type: application/vnd.api+json" \
  -d '{
    "data": {
      "attributes": {
        "name": "production"
      },
      "type": "workspaces"
    }
  }'
```

---

## Configuration

### Workspace Variables

```hcl
# Set variables in Terraform Cloud (do not commit to Git)
# https://app.terraform.io/app/organizations/mycompany/workspaces/production/variables

# Terraform variables (applied to all runs)
aws_region              = "us-east-1"
instance_count          = 5
database_class          = "db.r6g.2xlarge"
environment             = "prod"

# Environment variables (for hooks, providers)
TF_VAR_db_password      = "secret"  # Mark as sensitive!
AWS_ACCESS_KEY_ID       = "AKIA..."
AWS_SECRET_ACCESS_KEY   = "..."
```

### Workspace Settings

**Auto-apply** (deploy on merge to main):
```
https://app.terraform.io/app/organizations/mycompany/workspaces/production/settings/general
→ Auto-apply runs enabled
```

**Cost estimation:**
```
https://app.terraform.io/app/organizations/mycompany/workspaces/production/settings/general
→ Cost estimation enabled
```

**Run approvals** (require approval before apply):
```
https://app.terraform.io/app/organizations/mycompany/workspaces/production/settings/general
→ Requires approval: checked
```

---

## VCS Integration

### GitHub Integration

**Step 1: Authorize Terraform Cloud in GitHub**

```
https://app.terraform.io/app/settings/vcs
→ Connect to GitHub
→ Authorize Terraform Cloud
→ Select repositories
```

**Step 2: Link VCS to Workspace**

```
https://app.terraform.io/app/organizations/mycompany/workspaces/production/settings/vcs
→ VCS Connection: GitHub
→ Repository: your-org/infrastructure
→ VCS Branch: main
```

**Step 3: Automatic Plan on PR**

When you push to a PR:
1. GitHub webhook notifies Terraform Cloud
2. Terraform Cloud runs `terraform plan`
3. Plan output posted as PR comment
4. Cost estimation shown
5. Requires approval to merge

**Step 4: Automatic Apply on Merge**

When you merge PR to main:
1. GitHub webhook notifies Terraform Cloud
2. Terraform Cloud runs `terraform apply` (if auto-apply enabled)
3. Infrastructure deployed automatically
4. Status posted to commit

### Example Workflow

```
Developer: git checkout -b add-database
Developer: Edit infrastructure/
Developer: git push

GitHub: Create PR
Terraform Cloud: Plan triggered
  → terraform plan -var-file=environments/prod.tfvars
  → Cost estimation: +$5,000/month
  → Posted to PR as comment

Reviewer: Review plan and cost
Reviewer: Approve PR ("Looks good")

GitHub: Merge to main
Terraform Cloud: Apply triggered
  → terraform apply (confirmed)
  → Resources created
  → Status: "Applied successfully"

Deployment complete! ✓
```

---

## CLI Commands

```bash
# List workspaces
terraform cloud list-workspaces --organization mycompany

# Show workspace status
terraform cloud workspace show \
  --organization mycompany \
  --workspace production

# View recent runs
terraform cloud run list \
  --organization mycompany \
  --workspace production \
  --limit 10

# Show run details
terraform cloud run show \
  --organization mycompany \
  --run-id run_XXXXXXXXXXXXX

# Trigger manual run
terraform cloud run trigger \
  --organization mycompany \
  --workspace production \
  --message "Manual cost optimization run"

# View state
terraform cloud state show \
  --organization mycompany \
  --workspace production

# Delete workspace (destructive!)
terraform cloud workspace delete \
  --organization mycompany \
  --workspace development \
  --force
```

---

## Cost Estimation

### How It Works

Terraform Cloud integrates with cloud provider APIs to estimate cost changes:

1. **Before apply:** Estimates cost of proposed resources
2. **Compares:** Current state vs. proposed state
3. **Shows delta:** Cost increase/decrease
4. **Posts to PR:** Reviewers see cost impact

### Example Output

```
Terraform Cloud Cost Estimation

- Current monthly cost: $12,500/month
- Proposed cost: $15,200/month
- Delta: +$2,700/month (+21.6%)

Resources with highest cost:
1. aws_rds_cluster.prod: +$1,500/month (upgrade to r6g.4xlarge)
2. aws_ec2_spot_fleet.app: +$800/month (10 additional spot instances)
3. aws_ebs_volume.backup: +$400/month (new backup volumes)
```

### Enable Cost Estimation

```
Workspace settings → Cost estimation: Enabled
```

---

## State Management

### Remote State Benefits

```
Before (local state):
├─ terraform.tfstate in Git (SECRET!)
├─ Risk: Credentials exposed
├─ Risk: Concurrent applies conflict
└─ Risk: Manual state recovery needed

After (remote state):
├─ State in Terraform Cloud (encrypted)
├─ Locking: Only one apply at a time
├─ Versioning: History of all changes
├─ Backup: Automatic snapshots
└─ Security: Access control via IAM
```

### State Versioning

```bash
# View state history
terraform cloud state list-versions \
  --organization mycompany \
  --workspace production

# Restore to previous state (if needed)
terraform cloud state rollback \
  --organization mycompany \
  --workspace production \
  --version 42
```

### Lock State

```bash
# View current lock
terraform cloud state lock-info \
  --organization mycompany \
  --workspace production

# Force unlock (dangerous!)
terraform cloud state force-unlock \
  --organization mycompany \
  --workspace production
```

---

## Run Management

### Monitoring Runs

```bash
# List all runs
terraform cloud run list --organization mycompany

# Filter by status
terraform cloud run list --status planned   # Awaiting approval
terraform cloud run list --status applied   # Successfully applied
terraform cloud run list --status discarded # Discarded

# Watch run in real-time
terraform cloud run watch \
  --organization mycompany \
  --run-id run_XXXXXXXXXXXXX
```

### Approve/Discard Runs

Via API:
```bash
# Approve run (requires API token)
curl -X POST \
  https://app.terraform.io/api/v2/runs/run_XXXXX/actions/approve \
  -H "Authorization: Bearer $TF_CLOUD_TOKEN"

# Discard run
curl -X POST \
  https://app.terraform.io/api/v2/runs/run_XXXXX/actions/discard \
  -H "Authorization: Bearer $TF_CLOUD_TOKEN"
```

Via UI:
```
https://app.terraform.io/app/organizations/mycompany/runs/run_XXXXX
→ "Approve & Apply" button
```

---

## Policies

### Sentinel Policy as Code

Enforce governance rules across all runs:

```hcl
# policies/require-tags.sentinel
import "tfplan"

main = rule {
  all tfplan.resource_changes as _, rc {
    rc.change.after.tags is not empty
  }
}
```

Apply policy:
```
https://app.terraform.io/app/organizations/mycompany/policies
→ Create new policy
→ Attach to workspace
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid API token" | Regenerate token, check permissions |
| "Workspace not found" | Create workspace in Terraform Cloud first |
| "State lock timeout" | Check for stuck runs, force unlock if needed |
| "Cost estimation failed" | Verify provider credentials, check resource count |
| "VCS connection failed" | Re-authorize GitHub, check repository access |

---

## Security Best Practices

1. **Store sensitive values as variables** (mark as sensitive)
2. **Use workspace-level access control** (restrict who can approve)
3. **Enable run approvals** for production workspaces
4. **Rotate API tokens** regularly
5. **Audit runs** (view who deployed what, when)
6. **Use Sentinel policies** to enforce compliance

---

**Last updated:** 2026-06-15
