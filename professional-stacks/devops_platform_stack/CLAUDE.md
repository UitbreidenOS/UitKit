# DevOps/Platform Stack — Workspace Configuration

## Core Principles

- **Infrastructure as Code First**: All infrastructure changes must be version-controlled and reviewable before deployment
- **Observability by Default**: Every service deployed must include metrics, logs, and traces from day one
- **Safe Deployments**: Rollback capability and canary patterns required for production changes

## Model Guidance

- Kubernetes/infrastructure skills: Sonnet (complex multi-component reasoning)
- CI/CD automation: Haiku (straightforward pipeline logic)
- Monitoring/alerting: Haiku (pattern matching and rule application)

## When to Escalate

- Complex multi-region failover scenarios → Sonnet agent
- Security policy violations → Security specialist agent
- Performance incidents (>50% latency increase) → Platform engineer agent
