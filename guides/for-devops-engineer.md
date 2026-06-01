# Claude for DevOps and Platform Engineers

Everything a DevOps or platform engineer needs to run AI-augmented infrastructure operations — incident response, runbooks, IaC, CI/CD pipelines, capacity planning, SLO management, and the daily rhythms of keeping production healthy.

---

## Who this is for

You are a DevOps engineer, SRE, or platform engineer responsible for infrastructure reliability, deployment pipelines, and the operational health of production systems. You are on-call, you write Terraform and Kubernetes manifests, you own the CI/CD pipelines, and you are the first line of defence when things break.

**Before Claude Code:** 2 hours to write a runbook. 30 minutes to draft a postmortem. Half a day to design a new monitoring strategy. IaC changes reviewed slowly because it's hard to explain to non-infra stakeholders.

**After:** Runbook generated from incident history in 20 minutes. Postmortem structured in 10 minutes. Terraform modules drafted with sensible defaults in a session. Monitoring strategy designed with SLO context built in.

---

## 30-second install

```bash
# Install the full DevOps/platform stack
npx claudient add skill devops-infra/kubernetes
npx claudient add skill devops-infra/terraform
npx claudient add skill devops-infra/docker
npx claudient add skill devops-infra/github-actions
npx claudient add skill devops-infra/observability-designer
npx claudient add skill devops-infra/incident-response
npx claudient add skill devops-infra/aws-architect
npx claudient add skill devops-infra/slo-architect
npx claudient add skill devops-infra/oncall-runbook
npx claudient add skill devops-infra/capacity-planner
npx claudient add agents roles/sre-engineer
npx claudient add agents roles/incident-commander
npx claudient add agents roles/platform-engineer
npx claudient add agents roles/kubernetes-architect
```

---

## Your Claude Code DevOps stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/incident-response` | Structured incident response: triage, war room, postmortem | Any production incident |
| `/oncall-runbook` | Generate runbooks from incident history, audit existing ones | Before new services go on-call, after incidents |
| `/observability-designer` | Design metrics, logs, traces strategy — Datadog, Prometheus, OTel | New services, monitoring gaps |
| `/slo-architect` | Define SLOs, error budgets, alerting thresholds | New services, SLO reviews |
| `/capacity-planner` | Forecast resource needs, cost projections, scaling thresholds | Quarterly planning, pre-launch |
| `/kubernetes` | K8s manifests, HPA, resource limits, debugging, network policies | Any K8s work |
| `/terraform` | IaC modules, state management, import, plan review | Any infrastructure provisioning |
| `/docker` | Dockerfiles, multi-stage builds, image optimisation, compose | Container work |
| `/github-actions` | CI/CD pipeline design, optimisation, secrets, caching | Pipeline work |
| `/aws-architect` | AWS architecture design: VPC, IAM, ECS, RDS, CloudFront | AWS infrastructure |

### Agents

| Agent | Model | When to spawn |
|---|---|---|
| `sre-engineer` | Sonnet | Reliability analysis, SLO design, error budget decisions |
| `incident-commander` | Sonnet | Major incident coordination, war room structure |
| `platform-engineer` | Sonnet | Developer experience, internal tooling, platform design |
| `kubernetes-architect` | Opus | Complex K8s architecture, multi-cluster, service mesh |

---

## Daily workflow

### Morning infrastructure health check (15-20 minutes)

```
/observability-designer

Morning infrastructure review — [DATE]:

Services: [list your key services]
Timeframe: last 24 hours

Pull from your dashboards and paste or describe:
- Any P1 or P2 alerts that fired overnight?
- Current error rates for each service vs. SLO
- Any services with error budget burn rate > 1x (burning faster than allowed)?
- Deployment activity in last 24 hours: any rollouts in progress or recently completed?
- Database health: replication lag, connection count, slow queries
- Any cost anomalies (spike in cloud spend)?

Triage output:
- What requires action today?
- What is worth monitoring but not urgent?
- What can I close without action?
```

### Infrastructure change planning

```
/terraform (or /kubernetes or /aws-architect)

I'm planning this infrastructure change: [describe]

Before implementing:
1. What are the risks of this change?
2. What should I test in staging before applying to production?
3. Is there a safer way to make this change incrementally?
4. What's the rollback plan if this fails?
5. Who should review this before I apply it?
6. What monitoring should I watch immediately after the change?

Change: [paste the Terraform plan or kubectl diff or describe the change]
```

### CI/CD pipeline maintenance

```
/github-actions

Review and optimise my CI/CD pipeline.

Current pipeline: [paste workflow YAML or describe]
Pain points: [slow builds / flaky tests / secret management issues / cache misses]
Desired improvement: [faster / more reliable / better security / cheaper]

Analyse:
1. What's the critical path — which steps are slowing the pipeline most?
2. What can run in parallel that currently runs sequentially?
3. Are there caching opportunities being missed?
4. Any security anti-patterns (hardcoded secrets, overly permissive GITHUB_TOKEN, etc.)?
5. Optimised version of the pipeline with explanations

Generate the improved workflow YAML.
```

---

## Key workflows by scenario

### New service going to production

```
Step 1: SLO design
/slo-architect
Define SLOs for [service name]:
- Availability: what % uptime is acceptable?
- Latency: p50 / p95 / p99 targets
- Error rate: what error rate triggers an alert?
- Error budget: how much error budget per 30 days?

Step 2: Observability
/observability-designer
Design the monitoring stack for [service]:
- Key metrics to instrument (RED method: Rate, Errors, Duration)
- Log structure and retention
- Distributed tracing setup
- Dashboard layout for on-call engineers

Step 3: Runbook
/oncall-runbook
Generate the initial runbook for [service]:
- Service overview
- Known failure modes (even pre-launch — based on the architecture)
- Escalation path
- First-day alert responses

Step 4: Capacity baseline
/capacity-planner
Establish capacity baseline and scaling triggers:
- Expected launch traffic
- Auto-scaling configuration
- Cost forecast for first 3 months
```

### Incident response

```
/incident-response

Incident: [describe what's happening]
Severity: [P1 / P2 / P3]
Services affected: [list]
Customer impact: [describe]
Time of onset: [when did this start?]

Run structured incident response:
1. Initial assessment and severity confirmation
2. War room setup (who to page, communication channel)
3. Immediate mitigation options
4. Investigation path (what logs, metrics, and traces to look at first)
5. Stakeholder communication template
6. When to escalate vs. when to keep investigating
```

### Postmortem after an incident

```
/incident-response

Write the postmortem for [INCIDENT NAME] on [DATE].

Timeline (paste your incident channel history or notes):
[paste timeline]

Impact:
- Duration: [X minutes]
- Services affected: [list]
- Customers affected: [N or %]
- Revenue impact (if known): [$X]

Root cause (what you found):
[describe]

Contributing factors:
[describe]

What we did well:
[describe]

Generate: structured postmortem with timeline, root cause analysis, contributing factors, action items (with owners and due dates), and the one monitoring or alerting change that would have detected this faster.
```

### Terraform infrastructure review

```
/terraform

Review this Terraform plan before I apply it to production.

Environment: [production / staging]
Change type: [new resource / modification / destruction]

Plan output:
[paste terraform plan output]

Review for:
1. Any resource destructions that are unexpected or risky
2. Security misconfigurations (open security groups, public S3 buckets, IAM overpermission)
3. Missing tags or naming convention violations
4. Any state management concerns (sensitive data in state, state lock issues)
5. Cost impact estimate for the change

Also: what should I watch in the 30 minutes after applying this?
```

---

## 30-day ramp plan (DevOps engineer new to a team or system)

### Week 1 — Map the landscape
- Install all DevOps skills and agents
- Run `/oncall-runbook` audit on the 3 most critical services — identify gaps
- Map the current SLOs: do they exist? Are they measured? Use `/slo-architect` to assess
- Sit through one full incident cycle — even if there isn't one, review the last 3 postmortems

### Week 2 — Build operational confidence
- Use `/observability-designer` to build a monitoring gap analysis — what's being watched and what isn't
- Run `/capacity-planner` on the top 2 services — understand the cost and scaling model
- Set up a CLAUDE.md with infrastructure context (accounts, clusters, key services) so Claude always has context

### Week 3 — Improve the system
- Pick the worst runbook (most vague, most outdated) and rewrite it with `/oncall-runbook`
- Optimise one CI/CD pipeline that's causing the most pain with `/github-actions`
- Draft or review one Terraform module with `/terraform`

### Week 4 — Own a piece of it
- Take your first on-call shift with the runbooks you've improved
- Run a chaos game day simulation with `/incident-response` to test your runbooks
- Write your first capacity forecast for the coming quarter with `/capacity-planner`

---

## CLAUDE.md for DevOps engineers

Create a project-level `CLAUDE.md` so Claude has infrastructure context:

```markdown
# Infrastructure Context

Cloud provider: [AWS / GCP / Azure]
Primary region: [us-east-1 / europe-west1 / etc.]
Secondary region: [if applicable]

## Key services
- [service-name]: [what it does, language, cluster/namespace]
- [service-name]: [...]

## Kubernetes clusters
- Production: [cluster name, access method]
- Staging: [cluster name]
- Tools: [cluster name — for internal tooling]

## IaC
- Tool: [Terraform / Pulumi / CDK]
- State: [S3 bucket / Terraform Cloud / local]
- Module structure: [monorepo / per-service / shared module library]

## CI/CD
- Platform: [GitHub Actions / GitLab CI / CircleCI]
- Deployment method: [ArgoCD / Helm / raw kubectl / CDK pipelines]
- Environments: [dev / staging / production — how are they promoted?]

## Monitoring
- Metrics: [Datadog / Prometheus + Grafana / CloudWatch]
- Logs: [Datadog / ELK / Loki]
- Traces: [Datadog APM / Jaeger / Honeycomb]
- Alerting: [PagerDuty / OpsGenie]

## SLOs
- [service]: [SLO definition]
- [service]: [...]

## On-call rotation
- Schedule: [PagerDuty rotation name]
- Escalation: [engineering lead name, Slack, phone]
```

---

## Tool integrations

### PagerDuty

```json
{
  "mcpServers": {
    "pagerduty": {
      "command": "npx",
      "args": ["-y", "@pagerduty/mcp-server"],
      "env": {
        "PAGERDUTY_API_KEY": "your-key"
      }
    }
  }
}
```

With PagerDuty connected, Claude can pull incident history to generate runbooks, check current on-call schedules, and list recent alerts — without switching context.

### Datadog

Connect the Datadog MCP to let Claude query metrics and logs directly during incident response. Instead of copying dashboards, Claude can run live queries and interpret the results in context.

### AWS (via CLI or MCP)

Configure AWS credentials in your environment. Claude Code can then use the Bash tool to run `aws` CLI commands for live infrastructure state — `aws ec2 describe-instances`, `aws cloudwatch get-metric-statistics`, `aws rds describe-db-instances` — in context with your incident or capacity planning session.

### Terraform Cloud

Connect Terraform Cloud via the API to let Claude read plan outputs and recent run history. Combine with `/terraform` for pre-apply review sessions where Claude sees the actual plan, not a description of it.

---

## Metrics to track

### Reliability

| Metric | Target | Warning sign |
|---|---|---|
| Service availability | Per SLO (e.g., 99.9%) | Error budget burn rate > 2x |
| P99 latency | Per SLO (e.g., < 500ms) | Sustained breach for > 5 minutes |
| MTTR (mean time to resolve) | < 30 min for P1 | > 60 min: runbooks or detection gap |
| MTTD (mean time to detect) | < 5 min for P1 | > 15 min: alerting gap |
| Deployment frequency | Daily to weekly | < Monthly: delivery bottleneck |
| Change failure rate | < 5% | > 10%: testing or review problem |

### Infrastructure cost

| Metric | Target | Signal |
|---|---|---|
| Month-over-month cost growth | ≤ traffic growth % | Faster growth: waste |
| CPU utilisation across fleet | 40-70% average | < 30%: over-provisioned |
| Reserved instance coverage | > 60% for stable workloads | < 40%: overpaying on-demand |
| Cost per request | Declining over time | Rising: efficiency problem |

---

## Common DevOps mistakes Claude Code helps avoid

**Mistake 1: Runbooks that are out of date**
`/oncall-runbook` includes a freshness check — any runbook not updated in 90 days gets flagged. Use the audit mode before every on-call rotation handoff.

**Mistake 2: Capacity surprises**
`/capacity-planner` builds a 12-month forecast with scaling triggers. Set the CPU alert thresholds from the forecast, not from guessing.

**Mistake 3: SLOs without error budgets**
`/slo-architect` generates the full SLO definition including error budget math. Never define availability without defining what you'll do when the budget is burning.

**Mistake 4: Postmortems with no actionable output**
`/incident-response` generates postmortems with explicitly assigned action items, owners, and due dates. "We'll improve monitoring" is not an action item.

**Mistake 5: Terraform changes applied without review**
`/terraform` includes a risk analysis and rollback plan for every plan review. Run it before every production `terraform apply`.

---

## Resources

- [Getting started with Claude Code](getting-started.md)
- [DevOps incident workflow](../workflows/devops-incident.md)
- [On-call runbook skill](../skills/devops-infra/oncall-runbook.md)
- [Capacity planner skill](../skills/devops-infra/capacity-planner.md)
- [SLO architect skill](../skills/devops-infra/slo-architect.md)
- [SRE engineer agent](../agents/roles/sre-engineer.md)

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
