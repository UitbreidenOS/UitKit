# Platform Engineer Stack

A comprehensive collection of skills, tools, and workflows for infrastructure engineering, Kubernetes orchestration, CI/CD automation, and production reliability.

## Overview

This stack provides specialized tooling and guidance for:

- **Infrastructure as Code** — Terraform, CloudFormation, and environment design
- **Kubernetes Management** — Cluster design, Helm charts, and workload orchestration
- **CI/CD Pipelines** — Automated deployment, testing, and rollback strategies
- **Observability** — Metrics, dashboards, alerting, and SLO/SLI management
- **Incident Response** — Runbooks, playbooks, and disaster recovery procedures
- **Cost Optimization** — Cloud cost analysis and resource right-sizing
- **Security & Compliance** — RBAC, secrets management, and audit trails

## Directory Structure

```
platform_engineer_stack/
├── skills/                  # Platform engineering slash commands
│   ├── infrastructure-design/
│   ├── kubernetes-configuration/
│   ├── ci-cd-pipeline-builder/
│   ├── observability-stack-designer/
│   ├── runbook-generator/
│   └── (language subdirectories: fr/, de/, es/, nl/)
├── commands/                # Registered slash command definitions
│   ├── design-infrastructure.md
│   ├── build-cicd-pipeline.md
│   └── design-observability.md
├── hooks/                   # Event-triggered automations
│   ├── deployment-reviewer.md
│   └── infrastructure-cost-tracker.md
├── mcp/                     # MCP server configurations
│   ├── connections.md
│   └── kubernetes-integration.md
├── CLAUDE.md                # Stack identity and procedures
├── README.md                # This file
└── session-log.md           # Session template
```

## Key Components

### Skills

Focused tools for specific platform engineering tasks:

- **infrastructure-design** — Design cloud infrastructure: VPC topology, compute, storage, networking
- **kubernetes-configuration** — Create Kubernetes manifests, Helm charts, network policies, RBAC
- **ci-cd-pipeline-builder** — Design deployment pipelines: stages, gates, artifact management, rollback
- **observability-stack-designer** — Build observability: Prometheus/Grafana, dashboards, alerts, SLO definitions
- **runbook-generator** — Generate incident response runbooks with diagnosis and resolution steps
- **cost-optimizer** — Analyze infrastructure costs and identify optimization opportunities

### Commands

Ready-to-use slash commands for common platform engineering tasks:

- `/design-infrastructure` — Design scalable infrastructure architecture
- `/build-cicd-pipeline` — Build automated deployment pipelines
- `/design-observability` — Create monitoring and alerting systems
- `/configure-kubernetes` — Generate Kubernetes manifests and Helm charts
- `/generate-runbook` — Create incident response procedures
- `/optimize-costs` — Analyze and optimize infrastructure spending

### Hooks

Automated validations and tracking:

- **deployment-reviewer** — Validates infrastructure changes for security and cost before apply
- **infrastructure-cost-tracker** — Logs infrastructure costs and resource utilization
- **slo-monitor** — Validates SLO/SLI definitions before production deployment

### MCP Integrations

Connections to external platform engineering tools:

- **Kubernetes API** — Direct kubectl access, cluster management, workload inspection
- **Cloud Provider APIs** — AWS, GCP, Azure resource management and cost APIs
- **Monitoring Systems** — Prometheus, Grafana, Datadog API integrations
- **CI/CD Systems** — GitHub Actions, GitLab CI, Jenkins integration

## Key Patterns

### Infrastructure as Code

All infrastructure is defined in code, version-controlled, and reviewed:

```hcl
# Example: Terraform module
resource "aws_ec2_instance" "web" {
  ami           = var.ami_id
  instance_type = var.instance_type
  
  tags = {
    Name        = var.instance_name
    Environment = var.environment
    CostCenter  = var.cost_center
  }
}
```

### Kubernetes Manifests

Services are deployed via declarative Kubernetes manifests:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-service
  template:
    metadata:
      labels:
        app: api-service
    spec:
      containers:
      - name: api
        image: api:v1.2.3
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
```

### CI/CD Pipeline

Automated testing and deployment:

```yaml
# GitHub Actions example
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm test
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: docker build -t api:${{ github.sha }} .
      - run: docker push api:${{ github.sha }}
      - run: kubectl set image deployment/api api=api:${{ github.sha }}
```

### SLO Definition

Services have explicit reliability targets:

```yaml
# Service Level Objective
service: api-service
slo:
  availability: 99.95%          # 99.95% uptime over 30 days
  error_budget: 21.6_minutes    # ~3.5 minutes/week
  latency_p99: 500ms            # 99th percentile response time
  latency_p95: 200ms            # 95th percentile response time

alerts:
  - name: ErrorBudgetWarning
    condition: error_budget_remaining < 20%
    severity: warning
  - name: ErrorBudgetCritical
    condition: error_budget_remaining < 5%
    severity: critical
```

## Runbook Example

Every critical service has an incident response runbook:

```markdown
# Runbook: High API Latency

## Symptoms
- p99 latency > 500ms for > 5 minutes
- Alert: `api-latency-critical` firing
- Error rate remains < 1%

## Immediate Steps
1. Check CPU utilization: `kubectl top nodes`
2. Check memory pressure: `kubectl describe nodes`
3. Check pod status: `kubectl get pods -n production`
4. Check database connections: `SELECT count(*) FROM pg_stat_activity`

## Diagnosis
- If CPU high: scale up replicas
- If memory high: investigate memory leaks
- If database connection pool exhausted: increase pool size
- If specific pod slow: check logs for errors

## Mitigation
1. Scale to 5 replicas: `kubectl scale deployment api-service --replicas=5`
2. Verify latency recovers
3. If problem persists > 15 minutes: page on-call engineer

## Resolution
- Identify root cause
- Apply permanent fix
- Update alert thresholds if needed
```

## Integration with Claude Code

This stack integrates with Claude Code through:

- **Slash commands** — Activate skills with `/skill-name`
- **Agent delegation** — Spawn specialized agents with `@platform-engineer`
- **Hooks** — Automated triggers on deployment, cost changes, SLO violations
- **MCP servers** — Direct access to Kubernetes clusters and cloud provider APIs

## Translation

All skills and guides are available in:
- English (en/)
- French (fr/)
- German (de/)
- Spanish (es/)
- Dutch (nl/)

Each language subdirectory mirrors the English structure.

## Contributing

When adding new content to this stack:

1. **Follow naming conventions** — Files use `kebab-case.md`, directories use `kebab-case/`
2. **Include translations** — All non-hook files must be translated to fr/, de/, es/, nl/
3. **Match the established format** — Skills use the standard format; commands use command format
4. **Reference Claude Code features** — Use actual slash commands, agents, and MCP servers
5. **Write for senior engineers** — Assume infrastructure and Kubernetes knowledge; focus on patterns
6. **Include production examples** — Real code, real scenarios, real deployment patterns

## Common Workflows

### Deploy a New Service

1. Use `/design-infrastructure` to plan compute, networking, storage
2. Use `/configure-kubernetes` to generate Helm charts and manifests
3. Use `/build-cicd-pipeline` to set up automated testing and deployment
4. Use `/design-observability` to create dashboards and alerts
5. Use `/generate-runbook` to document incident response procedures

### Optimize Infrastructure Costs

1. Use `/optimize-costs` to analyze current spending
2. Identify high-cost resources (over-provisioned instances, unused storage)
3. Plan right-sizing: smaller instances, spot instances, reserved capacity
4. Implement changes gradually with A/B testing
5. Monitor cost impact via `/optimize-costs` again

### Set Up Observability

1. Use `/design-observability` to define what metrics matter
2. Define SLO targets (availability, latency, error rate)
3. Create dashboards for operators
4. Create alert rules with proper thresholds
5. Link alerts to runbooks

## Success Metrics

- **Deployment frequency:** Multiple deployments per week (weekly or faster)
- **Lead time for changes:** < 1 hour from commit to production
- **MTTR:** < 15 minutes for typical incidents
- **Change failure rate:** < 5% of deployments cause incidents
- **Error budget tracking:** Know how much error budget remains
- **Cost per unit:** < target cost per request/transaction
- **Runbook coverage:** 100% of critical paths documented

## Resources

- [CLAUDE.md](CLAUDE.md) — Stack identity and procedures
- [Kubernetes Documentation](https://kubernetes.io/docs/) — Official K8s docs
- [Terraform Registry](https://registry.terraform.io/) — Infrastructure modules
- [Prometheus Documentation](https://prometheus.io/docs/) — Metrics and alerting
- [Site Reliability Engineering](https://sre.google/books/) — Google SRE Book

## Status

This stack is actively maintained. Check individual files for last-updated dates and version information.

---

**Last updated:** 2026-06-15
