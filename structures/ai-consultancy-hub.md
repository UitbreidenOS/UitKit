# AI Consultancy Hub

A comprehensive Claude Code workspace structure for an AI Architect managing a global AI consultancy with multi-region deployments, complex proposal workflows, and enterprise client management.

---

## Workspace Overview

This structure supports:
- Multi-client project delivery with SLA tracking
- Proposal generation and deal management via Notion CRM
- Infrastructure-as-code provisioning (AWS/GCP multi-region)
- Knowledge base for solution reuse and lessons learned
- Thought leadership content generation and webinar operations
- Compliance monitoring (SOC 2, GDPR, ISO 27001)

---

## Directory Structure

```
ai-consultancy-hub/
├── client-delivery/
│   ├── proposal-generation.md
│   ├── deployment-orchestration.md
│   ├── client-onboarding.md
│   ├── sla-monitoring.md
│   └── config/
│       ├── sla-matrix.json
│       └── client-taxonomy.json
│
├── deployment-infrastructure/
│   ├── terraform-provisioning.md
│   ├── cicd-orchestration.md
│   ├── observability-stack.md
│   ├── compliance-automation.md
│   └── config/
│       ├── terraform/
│       │   ├── aws-multi-region.tf
│       │   ├── gcp-multi-region.tf
│       │   └── modules/
│       │       ├── vpc.tf
│       │       ├── k8s-cluster.tf
│       │       ├── rds-postgres.tf
│       │       └── redis-cache.tf
│       └── secrets-rotation.json
│
├── proposal-engine/
│   ├── scope-analysis.md
│   ├── cost-calculation.md
│   ├── deal-tracking-notion.md
│   └── config/
│       ├── pricing-matrix.json
│       ├── service-catalog.json
│       └── stripe-integration.json
│
├── knowledge-management/
│   ├── client-context-persistence.md
│   ├── solution-library.md
│   ├── tech-debt-ledger.md
│   ├── retrospectives.md
│   └── kb/
│       ├── reference-architectures/
│       ├── case-studies/
│       ├── lessons-learned/
│       └── solution-templates/
│
├── content-and-growth/
│   ├── thought-leadership.md
│   ├── webinar-operations.md
│   ├── referral-engine.md
│   └── config/
│       ├── content-calendar.json
│       └── speaker-schedule.json
│
├── integrations/
│   ├── notion-crm.json
│   ├── slack-webhooks.json
│   ├── stripe-api.json
│   └── github-sync.json
│
└── README.md
```

---

## Skill Definitions

### Client Delivery (4 skills)

#### 1. Proposal Generation
**Trigger**: When starting a new client engagement or responding to RFP
**Output**: Notion document with scope, architecture diagram, timeline, and cost breakdown
- Parse client requirements from email/Slack
- Generate SOW with milestones
- Create resource allocation plan
- Estimate delivery timeline
- Calculate cost using pricing matrix
- Export to Notion CRM for deal tracking
- Generate PDF for client review

**Config**: `config/sla-matrix.json`, `config/client-taxonomy.json`

#### 2. Deployment Orchestration
**Trigger**: Client approval of proposal and go-live date
**Output**: Fully provisioned multi-region infrastructure with monitoring dashboards
- Select cloud provider (AWS/GCP) and regions based on client geography
- Run Terraform provisioning via CI/CD pipeline
- Configure DNS failover and load balancing
- Set up observability (DataDog/New Relic)
- Create runbooks and incident escalation procedures
- Notify Slack #deployments channel with access details

**Config**: `deployment-infrastructure/config/terraform/`

#### 3. Client Onboarding
**Trigger**: After infrastructure deployment
**Output**: Knowledge base wiki, access credentials, training schedule
- Create client documentation site (Docusaurus/Sphinx)
- Schedule onboarding calls and training
- Share architecture diagrams and runbooks
- Provision API keys and webhook endpoints
- Set up monitoring dashboards for client teams
- Create Slack bridge for 24/7 support escalation

**Config**: `integrations/slack-webhooks.json`

#### 4. SLA Monitoring
**Trigger**: Continuous during client engagement
**Output**: Weekly SLA compliance report; alerts on breaches
- Track uptime metrics across regions
- Monitor API latency and error rates
- Calculate monthly availability percentage
- Generate SLA dashboard in Grafana
- Alert on threshold breaches (Slack, PagerDuty)
- Prepare monthly compliance reports
- Reconcile credits/penalties via Stripe

**Config**: `config/sla-matrix.json`

---

### Deployment Infrastructure (4 skills)

#### 1. Terraform Provisioning
**Trigger**: Before client go-live or infrastructure update
**Output**: Deployed VPCs, Kubernetes clusters, databases across multiple regions
- Parse requirements from Notion proposal
- Select appropriate AWS/GCP regions for latency/compliance
- Provision VPCs, subnets, NAT gateways
- Deploy managed Kubernetes (EKS/GKE)
- Configure RDS multi-AZ or Cloud SQL
- Set up Redis for caching
- Enable encryption at rest and in transit
- Plan and apply Terraform with approval gates

**Config**: `deployment-infrastructure/config/terraform/aws-multi-region.tf`, `gcp-multi-region.tf`

#### 2. CI/CD Orchestration
**Trigger**: Code push to GitHub; client deployment request
**Output**: Automated build, test, and deployment pipeline
- Define GitHub Actions / GitLab CI workflows
- Build Docker images and push to ECR/GCR
- Run security scans (SAST, DAST, container scanning)
- Execute automated tests (unit, integration, load)
- Deploy to staging environment for QA
- Require approval before production deployment
- Perform canary/blue-green deployments
- Rollback on health check failures

**Config**: `.github/workflows/` or `.gitlab-ci.yml`

#### 3. Observability Stack
**Trigger**: After infrastructure deployment; ongoing monitoring
**Output**: Integrated monitoring, logging, tracing, and alerting
- Deploy Prometheus + Grafana for metrics
- Set up centralized logging (ELK stack, Cloud Logging)
- Configure distributed tracing (Jaeger, DataDog)
- Create dashboards for client visibility
- Define alerting rules (high error rates, latency spikes)
- Set up on-call rotation and escalation policies
- Generate SLO reports and trends

**Config**: Prometheus scrape configs, Grafana dashboards JSON

#### 4. Compliance Automation
**Trigger**: Quarterly or on new feature release
**Output**: Compliance scan results, audit trail, remediation tasks
- Scan infrastructure for security misconfigurations (Prowler, Cloud Asset Inventory)
- Verify encryption status (TLS, at-rest encryption)
- Check IAM policies for least-privilege violations
- Validate GDPR data residency requirements
- Generate SOC 2 audit logs and attestation
- Track compliance debt in Notion
- Schedule remediation tasks with owners

**Config**: `config/secrets-rotation.json`

---

### Proposal Engine (3 skills)

#### 1. Scope Analysis
**Trigger**: New client inquiry or RFP received
**Output**: Structured scope document with acceptance criteria and deliverables
- Extract requirements from client brief or RFP
- Identify technical constraints and risks
- Map requirements to service offerings
- Define success metrics and acceptance criteria
- Flag scope creep risks
- Estimate effort in story points
- Create dependency matrix with other services

**Config**: `config/service-catalog.json`

#### 2. Cost Calculation
**Trigger**: After scope analysis is approved
**Output**: Detailed cost breakdown, pricing options, ROI analysis
- Estimate compute, storage, and data transfer costs
- Look up pricing from AWS/GCP pricing API
- Calculate team effort (engineering, architecture, ops)
- Apply margin and contingency
- Generate cost comparison table (cloud vs on-prem)
- Offer flexible pricing options (monthly, annual, usage-based)
- Calculate payback period for client
- Export to Stripe for invoicing setup

**Config**: `config/pricing-matrix.json`, `integrations/stripe-api.json`

#### 3. Deal Tracking (Notion CRM)
**Trigger**: After proposal sent; ongoing deal management
**Output**: Notion database entries synced across sales, delivery, and finance teams
- Create Notion database record with all proposal details
- Add client contact info, budget, and decision date
- Link to relevant reference architectures and case studies
- Track deal stages (Discovery → Proposal → Negotiation → Signed)
- Calculate win probability and revenue pipeline
- Trigger alerts for at-risk deals
- Sync with Stripe for invoice generation on signature
- Archive closed deals for retrospective analysis

**Config**: `integrations/notion-crm.json`

---

### Knowledge Management (4 skills)

#### 1. Client Context Persistence
**Trigger**: During ongoing engagement; before support tickets
**Output**: Searchable knowledge base with client-specific information
- Document client's business context and goals
- Maintain architecture diagrams (Miro, Figma)
- Store API documentation and integration points
- Keep runbooks for common troubleshooting scenarios
- Track custom configurations and deviations from standard
- Log support tickets and resolutions
- Create client-specific checklists and procedures
- Version control all documentation

**Config**: `kb/` directory structure

#### 2. Solution Library
**Trigger**: During proposal generation; after delivery completion
**Output**: Reusable solution templates and reference architectures
- Catalog proven architecture patterns (microservices, event-driven, data pipeline)
- Document technology stacks and trade-offs
- Create Terraform modules for rapid deployment
- Maintain Docker base images optimized for common workloads
- Store API gateway configurations and middleware patterns
- Build library of Lambda functions / Cloud Functions
- Track deployment times and resource usage per pattern
- Share across team and clients (with access controls)

**Config**: `kb/reference-architectures/`, `kb/solution-templates/`

#### 3. Tech Debt Ledger
**Trigger**: Post-deployment retrospectives; quarterly reviews
**Output**: Prioritized backlog of technical improvements
- Log known issues and limitation in production systems
- Estimate remediation effort and business impact
- Track dependency updates and security patch backlog
- Document architectural improvements needed
- Schedule tech debt sprints between client projects
- Monitor vulnerabilities (CVEs, dependency scanning)
- Calculate tech debt interest (cost of delaying fixes)
- Present options to client for addressing debt

**Config**: `kb/tech-debt-ledger/`

#### 4. Retrospectives
**Trigger**: End of engagement phase or quarterly
**Output**: Lessons learned document with action items
- Conduct post-mortem on successes and failures
- Document what went well and what could improve
- Capture cost overruns and timeline deviations
- Collect team and client feedback
- Update solution library with new patterns
- Generate training material from lessons learned
- Share insights in thought leadership content
- Update SLA matrix based on actual performance

**Config**: `kb/lessons-learned/`

---

### Content and Growth (3 skills)

#### 1. Thought Leadership
**Trigger**: Quarterly content planning; after significant engagement
**Output**: Blog posts, whitepapers, case studies for marketing and brand-building
- Identify trending topics in AI/cloud consulting
- Write technical deep-dives on architecture patterns
- Develop case studies from successful client engagements (anonymized)
- Create comparison guides (cloud providers, architectures, tools)
- Generate slide decks for conference talks
- Produce video content summaries
- Publish to company blog, LinkedIn, Medium
- Track engagement metrics and optimize topics
- Build thought leadership portfolio for team

**Config**: `config/content-calendar.json`

#### 2. Webinar Operations
**Trigger**: Monthly or quarterly; around product launches
**Output**: Scheduled webinars with promotion, slides, and follow-up campaigns
- Plan webinar topics and identify internal speakers
- Schedule speakers and technical rehearsals
- Create presentation decks and live demos
- Promote through email, LinkedIn, and Slack
- Manage registrations and attendee tracking
- Record webinars and create highlight clips
- Generate webinar recap blog post
- Track conversions from webinar to sales pipeline
- Maintain speaker schedule and rotation

**Config**: `config/speaker-schedule.json`

#### 3. Referral Engine
**Trigger**: After successful client engagement or when generating new leads
**Output**: Referral campaign with tracking and rewards
- Identify satisfied clients and partners for referrals
- Create referral incentive program (discounts, credits, rewards)
- Generate unique referral links and codes
- Track referral attribution in Notion CRM
- Send thank-you and commission payments via Stripe
- Nurture referral partners with educational content
- Analyze referral ROI and optimize targeting
- Scale most successful referral channels

**Config**: `integrations/stripe-api.json`

---

## Integration Points

### Notion CRM
- **File**: `integrations/notion-crm.json`
- **Use**: Deal tracking, proposal history, client records
- **Sync**: Triggered by proposal generation and SLA reports

### Slack Webhooks
- **File**: `integrations/slack-webhooks.json`
- **Use**: Incident escalation, deployment notifications, SLA alerts
- **Channels**: #deployments, #incidents, #sales, #support

### Stripe API
- **File**: `integrations/stripe-api.json`
- **Use**: Invoice generation, cost tracking, referral payouts
- **Workflow**: Triggered after contract signature and monthly for SLA credits

### GitHub Sync
- **File**: `integrations/github-sync.json`
- **Use**: Infrastructure-as-code version control, CI/CD workflows
- **Branches**: `main` (production), `staging`, `dev` per client

---

## Configuration Files

### SLA Matrix
**File**: `config/sla-matrix.json`
```json
{
  "service_levels": {
    "premium": {
      "uptime_slo": 99.99,
      "response_time_p99": 100,
      "support_hours": "24/7",
      "incident_resolution": "4h",
      "price_per_hour": 500
    },
    "standard": {
      "uptime_slo": 99.9,
      "response_time_p99": 500,
      "support_hours": "business",
      "incident_resolution": "8h",
      "price_per_hour": 250
    }
  }
}
```

### Pricing Matrix
**File**: `config/pricing-matrix.json`
- Per-region deployment costs (data transfer, compute, storage)
- Engineering hourly rates by seniority level
- Architecture and design time allocation
- Operational support (on-call, SLA credits)
- Managed services premium

### Service Catalog
**File**: `config/service-catalog.json`
- Available service tiers (small, medium, enterprise)
- Technology stack options (compute, database, messaging)
- Add-on services (monitoring, compliance, training)
- Delivery timeline estimates per service

### Client Taxonomy
**File**: `config/client-taxonomy.json`
- Industry classifications (fintech, healthtech, e-commerce, etc.)
- Company size categories (startup, SMB, enterprise)
- Deployment preferences (AWS, GCP, hybrid, on-prem)
- Compliance requirements (HIPAA, PCI-DSS, SOC 2, GDPR)

---

## Secrets Management

**File**: `config/secrets-rotation.json`

All credentials (API keys, database passwords, TLS certificates) are:
- Stored in AWS Secrets Manager / GCP Secret Manager per region
- Rotated automatically on a schedule
- Accessed via IAM roles (never committed to Git)
- Logged for audit trails
- Synced to client environments securely

---

## Monthly Workflows

1. **SLA Compliance Report**: Generate uptime, error rates, and cost summary
2. **Tech Debt Review**: Prioritize and schedule remediation
3. **Content Calendar Planning**: Plan thought leadership and webinars
4. **Referral Pipeline Analysis**: Track attribution and ROI
5. **Cost Optimization**: Review cloud spend and adjust reserved capacity
6. **Team Retrospective**: Lessons learned and process improvements

---

## How to Adapt This Structure

### For smaller consultancies:
- Combine `client-delivery/` and `deployment-infrastructure/` into single `operations/` folder
- Merge `proposal-engine/` with `knowledge-management/`
- Reduce to 1-2 thought leadership initiatives per quarter

### For product-focused consultancies:
- Add `product-development/` folder with version control and release management
- Emphasis on reusable components and IP licensing
- Separate `solution-marketplace/` for packaged offerings

### For managed services providers:
- Expand `observability-stack/` with 24/7 incident management
- Add `customer-success/` folder for onboarding and retention
- Emphasize SLA compliance and uptime metrics

---

## Getting Started

1. Clone the workspace template into your Claude Code project
2. Update `config/` files with your pricing, regions, and team structure
3. Configure Notion integration by adding API key to `integrations/notion-crm.json`
4. Set up Slack webhooks for incident and deployment channels
5. Create AWS/GCP service accounts and store credentials in Secrets Manager
6. Customize Terraform modules for your standard infrastructure patterns
7. Add your reference architectures and case studies to `kb/`
8. Schedule monthly retrospectives and tech debt reviews
9. Build your thought leadership content calendar
10. Enable GitHub Actions workflows for CI/CD automation

---

## References

- [AWS Best Practices](https://docs.aws.amazon.com/whitepapers/)
- [Google Cloud Architecture Framework](https://cloud.google.com/architecture/framework)
- [Terraform Best Practices](https://terraform.io/docs/configuration/best-practices.html)
- [Kubernetes Hardening Guide](https://kubernetes.io/docs/concepts/security/)
- [SOC 2 Compliance Checklist](https://www.aicpa.org/soc2)
