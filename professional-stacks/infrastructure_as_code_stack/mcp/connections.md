# Infrastructure as Code Stack MCP Connections

This document describes MCP server integrations for IaC workflows: cloud provider APIs, infrastructure discovery, cost analysis, and policy enforcement.

---

## Terraform Cloud

Provides remote state management, cost estimation, policy enforcement, and team collaboration.

### Prerequisites

- Terraform Cloud account
- Organization and workspace created
- API token generated

### Setup

1. Authenticate with Terraform Cloud:
```bash
terraform login
# Enter API token when prompted
```

2. Add to Claude Code settings.json under `mcpServers`:
```json
{
  "terraform-cloud": {
    "command": "npx",
    "args": ["@terraform-cloud/mcp-server"],
    "env": {
      "TF_CLOUD_TOKEN": "${TF_CLOUD_TOKEN}",
      "TF_CLOUD_ORGANIZATION": "my-org"
    }
  }
}
```

3. Set environment variables:
```bash
export TF_CLOUD_TOKEN="your_api_token_here"
export TF_CLOUD_ORGANIZATION="my-organization"
```

### Available Tools

- Query workspace state and runs
- Trigger Terraform Cloud runs
- Access state versions
- Fetch cost estimates
- Query policy check results
- Access variable sets
- Manage workspace variables

### Usage Examples

```bash
# Trigger a run
claude code eval "terraform-cloud: trigger run in workspace production"

# Get cost estimate
claude code eval "terraform-cloud: get cost estimate for plan 123"

# Check policy compliance
claude code eval "terraform-cloud: get policy check results for run 456"

# Fetch workspace variables
claude code eval "terraform-cloud: list variables in workspace prod"
```

---

## AWS (CloudFormation, EC2, RDS, S3)

Direct access to AWS services for infrastructure discovery, cost analysis, and compliance checking.

### Prerequisites

- AWS account with appropriate IAM permissions
- AWS CLI v2 installed
- AWS credentials configured

### Setup

1. Configure AWS credentials:
```bash
aws configure
# Enter Access Key ID, Secret Access Key, region, output format
```

2. Add to Claude Code settings.json under `mcpServers`:
```json
{
  "aws": {
    "command": "npx",
    "args": ["@aws-mcp/mcp-server"],
    "env": {
      "AWS_PROFILE": "default",
      "AWS_REGION": "us-east-1"
    }
  }
}
```

3. Verify IAM permissions include:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:Describe*",
        "rds:Describe*",
        "s3:List*",
        "s3:Get*",
        "cloudformation:Describe*",
        "cloudformation:List*",
        "ce:Get*"
      ],
      "Resource": "*"
    }
  ]
}
```

### Available Tools

- **EC2:** Describe instances, security groups, VPCs, subnets
- **RDS:** List databases, snapshots, parameter groups
- **S3:** List buckets, objects, lifecycle policies
- **CloudFormation:** List stacks, resources, outputs
- **Cost Explorer:** Get cost and usage data

### Usage Examples

```bash
# Discover VPCs
claude code eval "aws: describe VPCs in region us-east-1"

# List RDS instances
claude code eval "aws: list RDS instances with their configurations"

# Get cost data
claude code eval "aws: get cost and usage for last 30 days grouped by service"

# Find security groups
claude code eval "aws: list security groups allowing unrestricted SSH (port 22)"
```

---

## Google Cloud (Cloud Resource Manager, Compute, SQL)

Access GCP services for resource discovery and infrastructure management.

### Prerequisites

- GCP project
- Service account with appropriate roles
- gcloud CLI installed

### Setup

1. Create service account:
```bash
gcloud iam service-accounts create mcp-server \
  --display-name="MCP Server"
```

2. Grant roles:
```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:mcp-server@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/compute.viewer" \
  --role="roles/cloudsql.viewer" \
  --role="roles/storage.objectViewer"
```

3. Create and download key:
```bash
gcloud iam service-accounts keys create ~/gcp-key.json \
  --iam-account=mcp-server@PROJECT_ID.iam.gserviceaccount.com
```

4. Add to Claude Code settings.json:
```json
{
  "gcp": {
    "command": "npx",
    "args": ["@gcp-mcp/mcp-server"],
    "env": {
      "GOOGLE_APPLICATION_CREDENTIALS": "${HOME}/gcp-key.json",
      "GCP_PROJECT": "my-project-id"
    }
  }
}
```

### Available Tools

- **Compute Engine:** Describe instances, networks, firewalls
- **Cloud SQL:** List databases, instances, backups
- **Cloud Storage:** List buckets, objects, lifecycle rules
- **Cloud Resource Manager:** List projects, resources, quotas
- **Billing:** Get cost and usage data

---

## Azure (Resource Manager, App Service, SQL)

Access Azure resources for infrastructure discovery and management.

### Prerequisites

- Azure subscription
- Azure CLI installed
- Service principal created

### Setup

1. Create service principal:
```bash
az ad sp create-for-rbac --name MCP-Server
```

2. Add to Claude Code settings.json:
```json
{
  "azure": {
    "command": "npx",
    "args": ["@azure-mcp/mcp-server"],
    "env": {
      "AZURE_TENANT_ID": "${AZURE_TENANT_ID}",
      "AZURE_CLIENT_ID": "${AZURE_CLIENT_ID}",
      "AZURE_CLIENT_SECRET": "${AZURE_CLIENT_SECRET}",
      "AZURE_SUBSCRIPTION_ID": "${AZURE_SUBSCRIPTION_ID}"
    }
  }
}
```

### Available Tools

- **Resource Groups:** Describe resource groups
- **Virtual Machines:** List VMs, networking configuration
- **App Service:** List web apps, configurations
- **SQL Database:** List databases, server configurations
- **Storage:** List storage accounts, containers

---

## OPA (Open Policy Agent)

Policy evaluation and enforcement for infrastructure-as-code.

### Prerequisites

- OPA CLI installed
- Policy files (.rego) written
- Terraform/Kubernetes data in JSON format

### Setup

1. Install OPA:
```bash
# macOS
brew install opa

# Linux
curl https://openpolicyagent.org/downloads/v0.55.0/opa_linux_amd64 -o opa
chmod +x opa
```

2. Create policy directory:
```bash
mkdir -p policies/rego
```

3. Write policies (see SKILL.md for templates)

4. Evaluate policies:
```bash
# Test policy against Terraform plan
terraform plan -json | jq > tfplan.json
opa eval -d policies/ -i tfplan.json 'data.terraform.deny'
```

### Integration with Claude Code

OPA is invoked directly by hooks and skills; no MCP server needed.

---

## Infracost

Cost estimation and analysis for infrastructure changes.

### Prerequisites

- Infracost CLI installed
- API key (free or paid tier)

### Setup

1. Install Infracost:
```bash
# macOS
brew install infracost

# Linux
curl https://www.infracost.io/downloads/linux/infracost -o infracost
chmod +x infracost
```

2. Register for free API key:
```bash
infracost auth login
```

3. Use in Terraform workflows:
```bash
# Generate cost estimate
terraform plan -json | jq > tfplan.json
infracost breakdown --path tfplan.json --format json
```

### Integration Examples

```bash
# Estimate cost of changes
infracost diff --path . --format json

# Set budget threshold
infracost breakdown --path . --format json | jq '.totalMonthlyCost' | \
  awk '{if ($1 > 5000) exit 1; else exit 0}'
```

---

## Kubernetes (kubectl, Helm)

Access to Kubernetes cluster for manifest deployment and management.

### Prerequisites

- kubectl installed and configured
- kubeconfig file with cluster credentials
- Helm installed (optional)

### Setup

1. Configure kubeconfig:
```bash
# Copy cluster credentials to ~/.kube/config
aws eks update-kubeconfig --name my-cluster --region us-east-1
# or
gcloud container clusters get-credentials my-cluster --zone us-central1-a
```

2. Verify access:
```bash
kubectl cluster-info
kubectl get nodes
```

3. Test manifest deployment:
```bash
kubectl apply -f manifests/deployment.yaml --dry-run=client
```

### Common Operations

```bash
# Deploy manifests
kubectl apply -f manifests/

# Monitor rollout
kubectl rollout status deployment/api-service -n production

# Check pod status
kubectl get pods -n production -l app=api-service

# View logs
kubectl logs -f deployment/api-service -n production

# Scale deployment
kubectl scale deployment/api-service --replicas=5 -n production
```

---

## VCS Integration (GitHub, GitLab)

Trigger IaC workflows from version control events.

### Prerequisites

- Repository with Terraform/Kubernetes code
- GitHub/GitLab actions configured
- Webhook to CI/CD system

### Setup

Example GitHub Actions workflow:

```yaml
name: Terraform Apply

on:
  push:
    branches:
      - main
    paths:
      - 'terraform/**'

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v2
      with:
        terraform_version: 1.5.0
    
    - name: Terraform Format
      run: terraform fmt -check -recursive terraform/
    
    - name: Terraform Validate
      run: terraform validate
      working-directory: terraform/
    
    - name: Terraform Plan
      run: terraform plan -out=tfplan
      working-directory: terraform/
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    
    - name: Terraform Apply
      run: terraform apply -auto-approve tfplan
      working-directory: terraform/
      if: github.ref == 'refs/heads/main'
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

---

## Testing Connections

Verify all MCP connections are working:

```bash
# Test Terraform Cloud
claude code eval "terraform-cloud: describe my workspaces"

# Test AWS
claude code eval "aws: list all VPCs in region us-east-1"

# Test GCP
claude code eval "gcp: list all Compute Engine instances"

# Test Azure
claude code eval "azure: list all resource groups"

# Test Kubernetes
kubectl get nodes
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Auth failures | Verify API keys, credentials, tokens are valid and unexpired |
| Connection timeout | Check firewall rules; ensure MCPs are properly installed |
| Missing tools | Update MCP server packages; verify versions match config |
| Rate limiting | Implement backoff; check API quotas |
| Permission denied | Review IAM roles, service account permissions, kubeconfig RBAC |

---

## Security Considerations

1. **Never hardcode credentials** — Use environment variables, vaults, or credential managers
2. **Limit permissions** — Use least-privilege IAM roles and policies
3. **Rotate credentials** — Regularly rotate API keys, tokens, and passwords
4. **Encrypt at rest** — Use KMS for sensitive data in S3, Terraform state, etc.
5. **Encrypt in transit** — Enforce TLS for all API calls
6. **Audit access** — Enable CloudTrail, Cloud Audit Logs, Activity Log
7. **Separate environments** — Use different credentials for dev/staging/prod

---

**Last updated:** 2026-06-15
