# Platform Engineer Stack MCP Connections

## Kubernetes API

### Prerequisites

- kubectl configured and authenticated to Kubernetes cluster(s)
- Python 3.8+
- `kubernetes` Python client library installed

### Setup

1. Ensure kubectl can access your clusters:
```bash
kubectl cluster-info
kubectl get nodes
```

2. Add to Claude Code settings.json under `mcpServers`:
```json
{
  "kubernetes": {
    "command": "npx",
    "args": ["@kubernetes/mcp-server"],
    "env": {
      "KUBECONFIG": "${KUBECONFIG}"
    }
  }
}
```

3. Verify connection:
```bash
kubectl api-resources
kubectl get clusters
```

### Available Tools

- List and describe pods, deployments, services, nodes
- Get pod logs and events
- Apply manifests and Helm charts
- Scale deployments and stateful sets
- Execute commands in running pods
- Get resource metrics (CPU, memory)
- Describe cluster state and configurations

### Example Usage

```bash
# List all pods in production namespace
kubectl get pods -n production

# Get deployment details
kubectl describe deployment api-service -n production

# Stream logs from pod
kubectl logs -f pod/api-service-abc123 -n production

# Get resource usage
kubectl top nodes
kubectl top pods -n production

# Apply manifest
kubectl apply -f deployment.yaml

# Scale deployment
kubectl scale deployment api-service --replicas=5
```

---

## AWS API

### Prerequisites

- AWS account with appropriate IAM permissions
- AWS CLI v2 configured with credentials
- boto3 Python library

### Setup

1. Configure AWS credentials:
```bash
aws configure
# Or set environment variables:
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_DEFAULT_REGION="us-east-1"
```

2. Add to Claude Code settings.json under `mcpServers`:
```json
{
  "aws": {
    "command": "npx",
    "args": ["@aws/mcp-server"],
    "env": {
      "AWS_ACCESS_KEY_ID": "${AWS_ACCESS_KEY_ID}",
      "AWS_SECRET_ACCESS_KEY": "${AWS_SECRET_ACCESS_KEY}",
      "AWS_DEFAULT_REGION": "${AWS_DEFAULT_REGION}"
    }
  }
}
```

3. Verify connection:
```bash
aws sts get-caller-identity
aws ec2 describe-instances --max-results 1
```

### Available Tools

- Manage EC2 instances (list, start, stop, create)
- Query RDS databases, snapshots, backups
- View S3 buckets and objects
- Manage security groups and VPCs
- Access CloudWatch metrics and logs
- Query Lambda functions and API Gateway
- Manage Auto Scaling groups
- Access IAM policies and roles

### Example Usage

```bash
# List EC2 instances
aws ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId,State.Name,InstanceType]'

# Get RDS instance details
aws rds describe-db-instances --db-instance-identifier prod-db

# Check CloudWatch metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0 \
  --start-time 2026-06-14T00:00:00Z \
  --end-time 2026-06-15T00:00:00Z \
  --period 3600 \
  --statistics Average

# Query S3 buckets
aws s3 ls
aws s3 ls s3://my-bucket/ --recursive
```

---

## Prometheus API

### Prerequisites

- Prometheus server running and accessible
- Network access to Prometheus HTTP API
- Python requests library

### Setup

1. Ensure Prometheus is accessible:
```bash
curl http://prometheus.internal:9090/api/v1/status/config
```

2. Add to Claude Code settings.json under `mcpServers`:
```json
{
  "prometheus": {
    "command": "npx",
    "args": ["@prometheus/mcp-server"],
    "env": {
      "PROMETHEUS_URL": "http://prometheus.internal:9090"
    }
  }
}
```

3. Verify connection:
```bash
curl http://prometheus.internal:9090/api/v1/status/buildinfo
```

### Available Tools

- Query metrics using PromQL
- Get current and historical metric values
- List available metrics
- Query metric metadata
- Check alert rules and firing alerts
- Query alert history

### Example Usage

```
# Current error rate for api-service
rate(http_requests_total{status=~"5.."}[5m])

# P99 latency over last hour
histogram_quantile(0.99, http_request_duration_seconds)

# Memory usage trend
container_memory_usage_bytes{pod="api-service"}

# Pod restart count
kube_pod_container_status_restarts_total{pod_name="api-service"}

# Database connection pool utilization
pg_stat_activity_total / pg_settings_max_connections
```

---

## Grafana API

### Prerequisites

- Grafana instance running
- API token with dashboard view/edit permissions
- Network access to Grafana

### Setup

1. Create API token in Grafana:
   - Go to Grafana → Configuration → API Keys
   - Create new API token (give it Editor or Viewer role)

2. Add to Claude Code settings.json under `mcpServers`:
```json
{
  "grafana": {
    "command": "npx",
    "args": ["@grafana/mcp-server"],
    "env": {
      "GRAFANA_URL": "https://grafana.example.com",
      "GRAFANA_API_TOKEN": "${GRAFANA_API_TOKEN}"
    }
  }
}
```

3. Verify connection:
```bash
curl -H "Authorization: Bearer $GRAFANA_API_TOKEN" \
  https://grafana.example.com/api/health
```

### Available Tools

- List dashboards
- Get dashboard definitions and JSON
- Update dashboard panels
- Query dashboard data
- List data sources
- Manage alerts and alert rules
- Get annotation data

### Example Usage

```bash
# List all dashboards
curl -H "Authorization: Bearer token" \
  https://grafana.example.com/api/search

# Get dashboard by ID
curl -H "Authorization: Bearer token" \
  https://grafana.example.com/api/dashboards/db/api-service-health

# Get alert rules
curl -H "Authorization: Bearer token" \
  https://grafana.example.com/api/ruler/grafana/rules
```

---

## Datadog API (Alternative)

### Prerequisites

- Datadog account with API key
- Network access to Datadog API
- Python datadog library

### Setup

1. Get API key and application key from Datadog:
   - Organization Settings → API Keys

2. Add to Claude Code settings.json under `mcpServers`:
```json
{
  "datadog": {
    "command": "npx",
    "args": ["@datadog/mcp-server"],
    "env": {
      "DD_API_KEY": "${DD_API_KEY}",
      "DD_APP_KEY": "${DD_APP_KEY}"
    }
  }
}
```

### Available Tools

- Query metrics and time series data
- List monitors and alert rules
- Get logs using Datadog query syntax
- Query dashboards
- Manage synthetic monitors
- Get incident data

---

## Git Integration

### Prerequisites

- Git command-line tool
- SSH or HTTPS credentials configured
- Access to infrastructure repository

### Setup

Git is usually pre-configured. Verify:
```bash
git config user.email
git config user.name
git remote -v
```

### Available Tools

- Clone repositories
- Commit infrastructure changes with audit trail
- View diffs before applying
- Tag releases
- Create branches for experimental changes
- Check logs and history

### Example Workflow

```bash
# Clone infrastructure repo
git clone git@github.com:company/infrastructure.git

# Create branch for changes
git checkout -b add-new-service

# Make changes to Terraform
vim terraform/api-service.tf

# View diff before applying
git diff

# Commit with message
git commit -m "Add api-service Kubernetes deployment"

# Push to review
git push origin add-new-service

# After approval, merge to main
git merge --squash
git push origin main

# Tag release
git tag -a v1.2.3 -m "Release v1.2.3"
```

---

## Testing Connections

Test all MCP connections:

```bash
# Kubernetes
kubectl get nodes

# AWS
aws sts get-caller-identity

# Prometheus
curl http://prometheus.internal:9090/api/v1/status/config

# Grafana
curl -H "Authorization: Bearer $GRAFANA_API_TOKEN" \
  https://grafana.example.com/api/health

# Git
git remote -v
git log -1 --oneline
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Kubernetes auth fails | Verify KUBECONFIG env var; run `kubectl auth can-i list pods` |
| AWS permission denied | Check IAM role/user has required permissions (ec2:*, rds:*, etc.) |
| Prometheus timeout | Check network connectivity to Prometheus; verify no firewall blocking |
| Grafana auth fails | Verify API token is valid and not expired; check token permissions |
| Git pull/push fails | Verify SSH key setup or HTTPS credentials; check network connectivity |

---

## Environment Variables

Set in `~/.bash_profile` or `~/.zshrc`:

```bash
# Kubernetes
export KUBECONFIG="~/.kube/config"

# AWS
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_DEFAULT_REGION="us-east-1"

# Prometheus
export PROMETHEUS_URL="http://prometheus.internal:9090"

# Grafana
export GRAFANA_URL="https://grafana.example.com"
export GRAFANA_API_TOKEN="..."

# Datadog
export DD_API_KEY="..."
export DD_APP_KEY="..."
```

---
