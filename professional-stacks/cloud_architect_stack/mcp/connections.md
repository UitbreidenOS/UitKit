# Cloud Architect Stack MCP Connections

MCP (Model Context Protocol) integrations for cloud platform access, infrastructure inspection, and cost analysis.

---

## AWS CLI Integration

### Prerequisites
- AWS account with IAM permissions
- AWS CLI v2 installed
- Credentials configured (IAM user or role)

### Setup

```bash
# Install AWS CLI (if not present)
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure credentials
aws configure
# Enter: Access Key ID
# Enter: Secret Access Key
# Enter: Default region (e.g., us-east-1)
# Enter: Default output format (json)

# Verify
aws sts get-caller-identity
```

### Add to Claude Code settings.json

```json
{
  "mcpServers": {
    "aws": {
      "command": "aws",
      "args": ["--output", "json"],
      "env": {
        "AWS_PROFILE": "default",
        "AWS_REGION": "us-east-1"
      }
    }
  }
}
```

### Available Commands

```bash
# EC2 (compute)
aws ec2 describe-instances --region us-east-1
aws ec2 describe-security-groups --region us-east-1

# RDS (database)
aws rds describe-db-instances --region us-east-1
aws rds describe-db-clusters --region us-east-1

# Cost Explorer
aws ce get-cost-and-usage --time-period StartDate=2026-01-01,EndDate=2026-06-30 \
  --granularity MONTHLY --metrics "UnblendedCost"

# CloudTrail (audit logs)
aws cloudtrail lookup-events --max-items 10

# VPC (networking)
aws ec2 describe-vpcs --region us-east-1
aws ec2 describe-subnets --region us-east-1
```

---

## Terraform Cloud Integration

### Prerequisites
- Terraform Cloud account (free tier available)
- Organization name
- API token

### Setup

```bash
# Generate API token
# https://app.terraform.io/app/settings/tokens

# Authenticate locally
terraform login
# Paste API token when prompted

# Verify connection
terraform cloud list-workspaces
```

### Add to Claude Code settings.json

```json
{
  "mcpServers": {
    "terraform-cloud": {
      "command": "terraform",
      "args": ["cloud"],
      "env": {
        "TF_CLOUD_TOKEN": "${TF_CLOUD_TOKEN}",
        "TF_CLOUD_ORGANIZATION": "your-org-name"
      }
    }
  }
}
```

### Available Commands

```bash
# List workspaces
terraform cloud list-workspaces --organization myorg

# Show workspace details
terraform cloud workspace show --organization myorg --workspace production

# View runs (deployments)
terraform cloud run list --organization myorg --workspace production

# View state
terraform cloud state show --organization myorg --workspace production
```

### Environment Variables

```bash
export TF_CLOUD_TOKEN="your-api-token"
export TF_CLOUD_ORGANIZATION="your-org-name"
```

---

## Azure CLI Integration

### Prerequisites
- Azure account with subscription
- Azure CLI installed
- Permissions to access resources

### Setup

```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login
az login

# Set default subscription
az account set --subscription "SUBSCRIPTION_ID"

# Verify
az account show
```

### Add to Claude Code settings.json

```json
{
  "mcpServers": {
    "azure": {
      "command": "az",
      "args": ["--output", "json"],
      "env": {
        "AZURE_SUBSCRIPTION_ID": "${AZURE_SUBSCRIPTION_ID}",
        "AZURE_TENANT_ID": "${AZURE_TENANT_ID}"
      }
    }
  }
}
```

### Available Commands

```bash
# Virtual Machines
az vm list --output json

# Kubernetes (AKS)
az aks list --output json

# Databases
az postgres server list --output json
az sql server list --output json

# Cost Management
az costmanagement query --time-period Start=2026-01-01 End=2026-06-30 \
  --dataset type=Usage aggregation=Total grouping=dimension
```

---

## GCP CLI Integration

### Prerequisites
- Google Cloud account
- gcloud CLI installed
- Service account key or user credentials

### Setup

```bash
# Install gcloud SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Authenticate
gcloud auth login

# Set default project
gcloud config set project PROJECT_ID

# Verify
gcloud config list
```

### Add to Claude Code settings.json

```json
{
  "mcpServers": {
    "gcp": {
      "command": "gcloud",
      "args": ["--format", "json"],
      "env": {
        "GOOGLE_CLOUD_PROJECT": "${GCP_PROJECT_ID}",
        "GCLOUD_QUIET": "true"
      }
    }
  }
}
```

### Available Commands

```bash
# Compute Instances
gcloud compute instances list --format=json

# Kubernetes (GKE)
gcloud container clusters list --format=json

# Databases
gcloud sql instances list --format=json

# Cost Analysis
gcloud billing accounts list
gcloud billing budget list --billing-account BILLING_ACCOUNT_ID
```

---

## Infracost Integration

Cost estimation for infrastructure code.

### Prerequisites
- Infracost CLI
- API key from infracost.io

### Setup

```bash
# Install Infracost
curl https://raw.githubusercontent.com/infracost/infracost/master/scripts/install.sh | sh

# Register for free API key
infracost auth login

# Verify
infracost --version
```

### Add to Claude Code settings.json

```json
{
  "mcpServers": {
    "infracost": {
      "command": "infracost",
      "args": ["--format", "json"],
      "env": {
        "INFRACOST_API_KEY": "${INFRACOST_API_KEY}"
      }
    }
  }
}
```

### Available Commands

```bash
# Estimate Terraform costs
infracost breakdown --path terraform/ --format json

# Show cost comparison
infracost diff --path terraform/ --compare-to main

# Export to HTML report
infracost output --format html > report.html
```

---

## Checkov Integration

Infrastructure security scanning.

### Prerequisites
- Checkov installed
- Optional: Checkov Cloud account

### Setup

```bash
# Install Checkov
pip install checkov

# Verify
checkov --version
```

### Add to Claude Code settings.json

```json
{
  "mcpServers": {
    "checkov": {
      "command": "checkov",
      "args": ["--output", "json", "--quiet"],
      "env": {
        "CKV_DISABLE_PROGRESS_BAR": "true"
      }
    }
  }
}
```

### Available Commands

```bash
# Scan Terraform files
checkov -d infrastructure/ --framework terraform --output json

# Scan CloudFormation
checkov -f template.yaml --framework cloudformation

# Scan Kubernetes manifests
checkov -d kubernetes/ --framework kubernetes

# Run specific checks
checkov -d infrastructure/ --check CKV_AWS_1,CKV_AWS_39
```

---

## TFLint Integration

Terraform static analysis and linting.

### Prerequisites
- TFLint installed

### Setup

```bash
# Install TFLint
curl https://raw.githubusercontent.com/terraform-linters/tflint/master/install_linux.sh | bash

# Initialize rules
tflint --init

# Verify
tflint --version
```

### Add to Claude Code settings.json

```json
{
  "mcpServers": {
    "tflint": {
      "command": "tflint",
      "args": ["--format", "json"],
      "env": {
        "TF_PLUGIN_CACHE_DIR": "~/.tflint.d/plugins"
      }
    }
  }
}
```

### Available Commands

```bash
# Lint Terraform
tflint --format json

# Lint specific directory
tflint --format json infrastructure/

# Run specific rule
tflint --only=terraform_naming_convention
```

---

## Testing Connections

```bash
# Test AWS
aws sts get-caller-identity

# Test Terraform Cloud
terraform cloud show --organization myorg

# Test Azure
az account show

# Test GCP
gcloud config list

# Test Infracost
infracost breakdown --path terraform/

# Test Checkov
checkov -d . --framework terraform --check CKV_AWS_1

# Test TFLint
tflint
```

---

## Environment Variables

Store these in `.env` or GitHub Secrets (for CI/CD):

```bash
# AWS
export AWS_PROFILE="default"
export AWS_REGION="us-east-1"
export AWS_ACCESS_KEY_ID="AKIA..."
export AWS_SECRET_ACCESS_KEY="..."

# Terraform Cloud
export TF_CLOUD_TOKEN="..."
export TF_CLOUD_ORGANIZATION="..."

# Azure
export AZURE_SUBSCRIPTION_ID="..."
export AZURE_TENANT_ID="..."
export AZURE_CLIENT_ID="..."
export AZURE_CLIENT_SECRET="..."

# GCP
export GOOGLE_CLOUD_PROJECT="..."
export GCLOUD_ACCOUNT="..."

# Infracost
export INFRACOST_API_KEY="..."

# GitHub Actions (in secrets)
AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
TF_CLOUD_TOKEN: ${{ secrets.TF_CLOUD_TOKEN }}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Access denied" | Check IAM permissions, renew credentials, verify API key |
| "Command not found" | Reinstall CLI tool, check PATH, verify installation |
| "Connection timeout" | Check firewall, internet connectivity, API endpoint status |
| "Invalid credentials" | Regenerate API key, check environment variables, re-authenticate |
| "Rate limit exceeded" | Wait 60 seconds, upgrade API tier, batch requests |

---

**Last updated:** 2026-06-15
