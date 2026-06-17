# Cloud Architect Stack

A comprehensive collection of skills, workflows, and operational procedures for designing, deploying, and maintaining enterprise cloud infrastructure across AWS, Azure, and GCP.

## Overview

This stack provides specialized tooling and guidance for:

- **Infrastructure-as-Code** — Terraform, CloudFormation, Bicep for reproducible, auditable infrastructure
- **Multi-cloud architecture** — Design patterns and decision frameworks for AWS, Azure, and GCP
- **Cost optimization** — Tagging strategies, reserved instances, spot instances, rightsizing recommendations
- **Disaster recovery** — RTO/RPO planning, backup strategies, failover testing, recovery runbooks
- **Kubernetes operations** — Cluster design, networking, autoscaling, observability, production patterns
- **Security & compliance** — Zero-trust architecture, IAM governance, encryption, SOC2/HIPAA/PCI audits
- **Operational excellence** — Monitoring, alerting, incident response, runbook automation

## Directory Structure

```
cloud_architect_stack/
├── CLAUDE.md                        # Stack identity, persona, and operating procedures
├── README.md                        # This file
├── session-log.md                   # Architecture session notes and decisions
├── skills/
│   ├── infrastructure-as-code/
│   │   └── SKILL.md                 # IaC design: modularity, state, drift detection
│   ├── cloud-cost-optimization/
│   │   └── SKILL.md                 # Cost auditing, reserved instances, rightsizing
│   ├── disaster-recovery/
│   │   └── SKILL.md                 # RTO/RPO planning, backup, failover, testing
│   ├── kubernetes-orchestration/
│   │   └── SKILL.md                 # K8s design: networking, scaling, observability
│   └── security-compliance/
│       └── SKILL.md                 # Security audit, IAM, encryption, compliance
├── commands/
│   ├── design-iac.md                # /design-iac: IaC strategy and implementation
│   ├── optimize-costs.md            # /optimize-costs: Cost audit and recommendations
│   └── plan-recovery.md             # /plan-recovery: Disaster recovery planning
├── hooks/
│   ├── cost-tracker.sh              # Auto-log architecture costs
│   └── compliance-validator.sh      # Validate security before deployment
├── mcp/
│   ├── connections.md               # Cloud platform MCP setup and credentials
│   └── terraform-cloud.md           # Terraform Cloud integration
└── README.md                        # This file
```

## Key Components

### Skills

Focused tools for specific cloud architecture tasks:

- **infrastructure-as-code** — Design IaC architecture: module structure, state backend, drift detection, CICD integration
- **cloud-cost-optimization** — Audit costs, plan reserved instances, rightsize compute, identify waste
- **disaster-recovery** — Plan RTO/RPO, design backup strategy, document failover procedure, schedule testing
- **kubernetes-orchestration** — Design production K8s clusters with networking, storage, autoscaling, monitoring
- **security-compliance** — Audit security posture, map compliance controls, document remediation

### Commands

- **/design-iac** — Architecture IaC approach, module design, state management, CI/CD pipeline
- **/optimize-costs** — Cost analysis, reserved instance planning, spot instance strategy, rightsizing
- **/plan-recovery** — RTO/RPO targets, backup strategy, failover runbook, recovery testing schedule

### Hooks

Automations that enforce architecture best practices:
- **cost-tracker** — Log estimated costs for every architecture design
- **compliance-validator** — Block deployment without security audit passing

### MCP Integrations

- **Terraform Cloud** — State management, cost estimation, run approvals
- **AWS / Azure / GCP CLIs** — Infrastructure inspection, cost analysis
- **Datadog / New Relic** — Monitoring data for optimization recommendations

## Core Principles

1. **Architecture is about tradeoffs.** Every design decision must articulate constraints, alternatives, and rationale.
2. **Assume failure is inevitable.** Design recovery, not just deployment. RTO/RPO is non-negotiable.
3. **Cost visibility.** Every architecture includes projected costs. Track actual vs. estimated monthly.
4. **Infrastructure-as-code, always.** No manual infrastructure. Terraform, CloudFormation, or Bicep.
5. **Security by default.** Zero-trust, least-privilege IAM, encryption in transit and at rest.
6. **Operational clarity.** Every system has a runbook for deploy, scale, and incident response.
7. **Multi-cloud awareness.** Evaluate platform tradeoffs. AWS ≠ Azure ≠ GCP.

## Architecture Design Process

1. **Gather requirements** — SLO, RTO/RPO, compliance, peak load
2. **Design topology** — Diagram: regions, zones, services, failover
3. **Model costs** — Compute, storage, data transfer, managed services
4. **Plan recovery** — Backup strategy, failover process, testing schedule
5. **Define security** — IAM, encryption, network segmentation, audit logging
6. **Document operations** — Deploy, scale, troubleshoot, incident response
7. **Review and audit** — Cost vs. projection, security checklist, compliance mapping

## Platform-Specific Guidance

### AWS
- EC2 for flexibility; Lambda for simplicity; EKS for orchestration
- S3 for data; RDS for relational; DynamoDB for operational
- CloudFront for CDN; ALB for load balancing; Route 53 for DNS
- CloudWatch for observability; CloudTrail for audit
- See: [AWS Architecture Patterns](./docs/aws-patterns.md)

### Azure
- VMs for control; App Service for simplicity; AKS for orchestration
- Blob for data; Managed Disk for block; SQL/Cosmos for database
- Application Gateway for load balancing; Traffic Manager for DNS
- Azure Monitor for observability; Azure Defender for security
- See: [Azure Architecture Patterns](./docs/azure-patterns.md)

### GCP
- Compute Engine for control; App Engine for simplicity; GKE for orchestration
- Cloud Storage for object; Persistent Disk for block; Cloud SQL/Firestore for database
- Cloud Load Balancing for edge; Cloud CDN for content delivery
- Cloud Monitoring for observability; Cloud Armor for security
- See: [GCP Architecture Patterns](./docs/gcp-patterns.md)

## Common Architecture Patterns

### High-Availability Web Application
[Diagram: Load balancer → multi-AZ compute → RDS with replication]

### Microservices on Kubernetes
[Diagram: Ingress → Service mesh → Stateless pods → Persistent volumes]

### Real-time Data Pipeline
[Diagram: Kafka/Kinesis → Stream processor → Data warehouse]

### Disaster Recovery (Active-Active)
[Diagram: Primary region ↔ Secondary region, DNS failover]

### Cost-Optimized Batch Processing
[Diagram: Spot instances + Reserved instances, autoscale by queue depth]

## Usage

### Activating a Skill
```bash
/infrastructure-as-code
```

### Running a Command
```bash
/design-iac
/optimize-costs
/plan-recovery
```

### Using MCP Integrations
```bash
# List Terraform Cloud workspaces
terraform cloud list

# Get AWS cost analysis
aws ce get-cost-and-usage --time-period StartDate=2026-01-01,EndDate=2026-06-30
```

## Contributing

When adding new content to this stack:

1. **Follow naming conventions** — Files use `kebab-case.md`, directories use `kebab-case/`
2. **Match established format** — Skills use the standard skill format; commands are self-contained
3. **Reference real patterns** — Use actual architecture diagrams, cost models, security checklists
4. **Write for architects** — Assume infrastructure knowledge; focus on tradeoffs and best practices
5. **Include examples** — Every command has a concrete example with actual cloud resources

## Integration with Claude Code

This stack integrates with Claude Code through:

- **Skills** — Activate with `/skill-name`
- **Commands** — Trigger with `/command-name`
- **Hooks** — Event-triggered validations and logging
- **MCP servers** — Access cloud platforms (AWS, Azure, GCP, Terraform Cloud)

## Resources

- [CLAUDE.md](./CLAUDE.md) — Stack identity, persona, and operating procedures
- [Architecture Decision Records](./docs/adrs/) — Rationale for key architecture decisions
- [Operational Runbooks](./docs/runbooks/) — Step-by-step procedures for common tasks
- [Cost Estimation Tools](./docs/cost-models/) — Spreadsheets and calculators
- [Terraform Modules](./terraform/) — Reusable infrastructure components
- [Compliance Checklists](./docs/compliance/) — SOC2, HIPAA, PCI-DSS templates

## Status

This stack is actively maintained and expanded. Check individual files for last-updated dates.

---

**Last updated:** 2026-06-15
