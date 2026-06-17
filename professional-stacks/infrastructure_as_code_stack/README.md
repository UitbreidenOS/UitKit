# Infrastructure as Code Specialist Stack

A comprehensive collection of skills, agents, workflows, and templates designed for infrastructure engineers building declarative, auditable, production-grade infrastructure with Terraform, Kubernetes, and policy-as-code.

## Overview

This stack provides specialized tooling and guidance for:

- **Terraform design** — Modular HCL structure, variable taxonomy, state management, module composition
- **Kubernetes manifests** — Deployments, StatefulSets, Services, ConfigMaps, secrets management, RBAC
- **Cloud provisioning** — AWS/GCP/Azure IaC patterns, network design, security group management, database provisioning
- **Infrastructure testing** — Terraform validation, cost estimation, OPA policy compliance, security scanning
- **Policy-as-code** — OPA/Sentinel rules for compliance, cost controls, resource tagging, security baseline enforcement
- **Drift detection** — Automated state comparison, drift remediation, configuration change auditing
- **Disaster recovery** — RTO/RPO planning, backup/restore workflows, failover procedures, chaos engineering

## Directory Structure

```
infrastructure_as_code_stack/
├── skills/                      # IaC-specific slash commands
│   ├── terraform-design/        # Terraform module architecture
│   │   └── SKILL.md
│   ├── kubernetes-manifest/     # Kubernetes resource definitions
│   │   └── SKILL.md
│   ├── cloud-provisioning/      # Cloud infrastructure provisioning
│   │   └── SKILL.md
│   ├── infrastructure-testing/  # IaC validation and testing
│   │   └── SKILL.md
│   └── policy-as-code/          # OPA/Sentinel policy definition
│       └── SKILL.md
├── commands/                    # Custom slash commands
│   ├── design-terraform.md
│   ├── write-k8s-manifest.md
│   └── provision-cloud.md
├── hooks/                       # Event-triggered automations
│   ├── drift-detector.md
│   └── policy-enforcer.md
├── mcp/                         # MCP server connections
│   ├── connections.md
│   └── terraform-cloud.md
├── session-log.md              # Session documentation template
├── CLAUDE.md                   # Stack instructions and framework
└── README.md                   # This file
```

## Key Components

### Skills

Focused tools for specific IaC tasks:

- **terraform-design** — Designing modular Terraform projects: directory structure, variable conventions, output design, remote state configuration
- **kubernetes-manifest** — Writing production-grade Kubernetes manifests: deployment strategies, resource requests/limits, health checks, RBAC
- **cloud-provisioning** — Provisioning cloud infrastructure: VPCs, security groups, databases, compute resources with IaC
- **infrastructure-testing** — Testing IaC: Terraform validation, cost analysis, policy compliance checks, security scanning
- **policy-as-code** — Defining compliance policies: OPA rules, cost constraints, security baselines, resource naming standards

### Commands

- **/design-terraform** — Design a Terraform project structure with modules, variables, outputs, and state strategy
- **/write-k8s-manifest** — Generate Kubernetes manifests for Deployments, StatefulSets, Services, ConfigMaps with production best practices
- **/provision-cloud** — Provision cloud infrastructure (AWS/GCP/Azure) using declarative IaC patterns
- **/test-infrastructure** — Validate IaC: Terraform plan analysis, cost estimation, policy compliance, security scanning
- **/define-policy** — Define OPA/Sentinel policies for compliance, cost controls, and security enforcement

### Hooks

- **drift-detector** — Runs terraform plan on schedule; alerts when infrastructure drift is detected
- **policy-enforcer** — Validates Terraform and Kubernetes against OPA policies before merge or deployment

### MCP Connections

- **Terraform Cloud** — Remote state management, cost estimation, policy enforcement
- **AWS/GCP/Azure SDKs** — Cloud provider API access for resource discovery, cost analysis, compliance checking

## Common Workflows

### Design and Deploy a New Terraform Module

1. Run `/design-terraform` to establish module structure and variable taxonomy
2. Write the module code following the template in CLAUDE.md
3. Run `/test-infrastructure` to validate syntax and cost
4. Define OPA policies with `/define-policy`
5. Push to Git; pre-commit hooks validate policies
6. Merge and deploy through automated pipeline

### Deploy Kubernetes Application

1. Run `/write-k8s-manifest` to generate deployment manifests
2. Include resource requests/limits, health checks, and RBAC
3. Test manifests with `kubctl apply --dry-run`
4. Define namespace-level network policies
5. Deploy through GitOps pipeline (Flux/ArgoCD)
6. Monitor drift and policy compliance

### Detect and Remediate Infrastructure Drift

1. Drift detector hook runs terraform plan hourly
2. Detects changes made outside IaC (console, CLI, API)
3. Generates drift report with change details
4. Engineer reviews and either:
   - Applies changes to code and re-deploys
   - Reverts infrastructure to match code (terraform apply)
5. Documents why drift occurred and prevents recurrence

## Best Practices

### Terraform

- Use **modules** for reusability and composition
- Parameterize **everything**: VPC CIDR, instance types, database sizes, tags
- Use **remote state** with locking and versioning
- Pin **provider versions** to prevent breaking changes
- Validate **all inputs** with type constraints and custom validations
- Never **commit secrets**; use AWS Secrets Manager, Vault, or encrypted variables

### Kubernetes

- Set **resource requests and limits** for all containers
- Configure **health checks** (liveness and readiness probes)
- Use **namespace-level RBAC** to prevent privilege escalation
- Implement **network policies** to restrict traffic
- Store **secrets** in encrypted vaults, not ConfigMaps
- Use **init containers** to ensure dependencies are ready

### Policy-as-Code

- **Deny-by-default:** Write policies that block risky configurations
- **Cost controls:** Enforce instance size limits, prevent expensive regions
- **Compliance:** Enforce tagging, encryption, backup retention
- **Security:** Require HTTPS, disable public databases, enforce network policies
- **Test policies** with sample Terraform and JSON inputs before deployment

### Disaster Recovery

- **RTO/RPO targets:** Define for every critical resource
- **Test quarterly:** Actual failover drills, not just documentation
- **Backup automation:** Database snapshots, state backups, code repositories
- **Failover playbooks:** Step-by-step procedures, runbooks, contact lists
- **Communication:** Incident notification templates, escalation paths

## Translation

All skills, commands, guides, and documentation are available in:
- English (en/)
- French (fr/)
- German (de/)
- Spanish (es/)
- Dutch (nl/)

Each language subdirectory mirrors the English structure.

## Usage

### Activate a Skill

```bash
/terraform-design
```

### Run a Command

```bash
/design-terraform --module-name vpc --provider aws
```

### Check Compliance

```bash
/test-infrastructure --plan-file terraform.tfplan
```

### Deploy via GitOps

Push to the repository; automated pipeline runs Terraform plan, policy checks, cost estimation, then deploys after approval.

## Contributing

When adding new content to this stack:

1. **Follow naming conventions** — Files use `kebab-case.md`, directories use `kebab-case/`
2. **Include translations** — All non-hook files must be translated to fr/, de/, es/, nl/
3. **Match the established format** — Skills use the SKILL.md format
4. **Provide real examples** — Include production-grade code samples (HCL, YAML, Rego)
5. **Document trade-offs** — Explain architectural decisions and failure modes
6. **Write for practitioners** — Assume infrastructure expertise; focus on patterns and pitfalls

## Integration with Claude Code

This stack integrates with Claude Code through:

- **Slash commands** — Activate skills with `/skill-name`
- **Hooks** — Automated triggers on Git events (pre-commit, post-deploy)
- **MCP servers** — Access Terraform Cloud, AWS, GCP, Azure APIs
- **Session logging** — Document infrastructure changes and decisions

## Resources

- **[CLAUDE.md](CLAUDE.md)** — Stack instructions, IaC framework, templates
- **[Terraform Documentation](https://www.terraform.io/docs)** — Official Terraform reference
- **[Kubernetes Documentation](https://kubernetes.io/docs)** — Official Kubernetes docs
- **[OPA/Rego](https://www.openpolicyagent.org/)** — Policy-as-code language and runtime
- **[Terraform Best Practices](https://www.terraform.io/language/modules/develop/structure)** — Module design patterns

## Status

This stack is actively maintained. Check individual files for last-updated dates.

---

**Last updated:** 2026-06-15
