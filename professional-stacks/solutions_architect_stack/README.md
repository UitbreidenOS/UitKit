# Solutions Architect Stack

> The complete Claude Code workspace for enterprise solution design — requirements discovery, system architecture, design review, technical debt assessment, API contracts, capacity planning, and migration planning. Move from vague customer needs to production-ready, scalable system designs in hours.

---

## Quick Start

1. **Copy this folder** into your Claude Code workspace or project.
2. **Add MCP servers** — Configure Firecrawl for web scraping and documentation research (optional, see `mcp/connections.md`).
3. **Run `/discover-requirements [customer]`** — Structure customer needs into a prioritized Requirements Matrix (MoSCoW).
4. **Run `/design-system [name]`** — Generate a complete system architecture with components, data model, APIs, and deployment strategy.
5. **Run `/design-review [name]`** — Validate the architecture for gaps, risks, feasibility, scalability, and security.

---

## What's Inside

| File/Folder | Type | Purpose |
|---|---|---|
| `CLAUDE.md` | Config | Workspace rules, principles, skills, hooks, and reference architectures. Start here. |
| `session-log.md` | Log | Auto-updated with every session: systems designed, reviews completed, migrations planned. |
| `skills/` | Directory | 8 reusable skills for all phases of architecture work. |
| `commands/` | Directory | 3 slash commands for discovering requirements, designing systems, and reviewing designs. |
| `hooks/` | Directory | 3 automation hooks: architecture validator, security checklist, session tracker. |
| `mcp/` | Directory | MCP configuration guide for research tools (Firecrawl, Exa, etc.). |

---

## Skills (8)

| Skill | Trigger | Purpose |
|---|---|---|
| `requirements-discovery` | When customer needs are unstructured | Interview customers and structure requirements into MoSCoW matrix |
| `solution-architect` | After requirements approved | Design complete system architecture with components, APIs, data model, scalability plan |
| `design-review` | Before development kicks off | Validate architecture for completeness, correctness, feasibility, security, operations |
| `technical-debt-assessment` | When taking over legacy system | Audit codebase for code smells, architectural anti-patterns, scalability risks |
| `migration-planning` | When replacing/upgrading systems | Plan safe, phased migration with cutover strategy, rollback plan, data migration |
| `api-contract-design` | During architecture phase | Design REST/GraphQL APIs with clear versioning, error handling, backward compatibility |
| `capacity-planning` | After architecture approved | Forecast infrastructure needs, cost projections, and scaling roadmap (1–3 years) |
| [8th skill reserved for expansion] | — | — |

---

## Commands (3)

| Command | What It Does |
|---|---|
| `/discover-requirements [customer]` | Interview or parse customer input into a Requirements Matrix (Must/Should/Could/Won't). Saves to `requirements/{name}-matrix.md`. |
| `/design-system [name]` | Generate architecture document with components, data model, APIs, deployment, scalability, security, monitoring, DR, roadmap. Saves to `designs/{name}-architecture.md`. |
| `/design-review [name]` | Validate architecture for gaps, risks, feasibility, security, scalability, operations. Outputs structured review. Saves to `reviews/{name}-review.md`. |

---

## Hooks (3)

| Hook | Event | What It Does |
|---|---|---|
| `architecture-validator` | After Writing architecture files | Checks for completeness (all key sections present). Warns if overview, components, data model, APIs, deployment, scalability, security, monitoring, DR, or roadmap missing. |
| `security-checklist` | After Writing architecture files | Flags if auth/authz, encryption, compliance, or audit logging are missing or vague. Prevents security debt. |
| `session-tracker` | On session Stop | Auto-logs all architecture work to `session-log.md` (systems designed, reviews completed, requirements created, capacity plans, migrations planned). |

---

## MCP Setup

See `mcp/connections.md` for complete guide.

### Firecrawl (Recommended)

Get your API key at [firecrawl.dev](https://www.firecrawl.dev/). Add to `settings.json`:

```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["@firecrawl/mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "your-key-here"
      }
    }
  }
}
```

**Use for:** Competitor product analysis, API documentation scraping, technical blog research, integration discovery.

### Web Search (Built-in, No Setup)

Used for: Technology trends, benchmarking, industry research, real-time news.

---

## How It Works

### 1. Discover Requirements
Customer has needs but no formal spec. You run `/discover-requirements`:
- Interview customer (problem, users, scale, constraints, timeline, budget)
- Or parse existing docs (RFP, meeting notes, Slack thread)
- Extract functional, non-functional, technical, business requirements
- Create Requirements Matrix with MoSCoW prioritization
- Flag gaps, risks, assumptions

**Outcome:** Formal Requirements Matrix signed off by customer.

---

### 2. Design System Architecture
Requirements approved. You run `/design-system`:
- Create system overview diagram (components, flows)
- Define component responsibilities and tech stack
- Design data model (ER diagram, schema)
- Specify API contracts (OpenAPI, request/response examples)
- Plan deployment topology (environments, containers, CI/CD)
- Map scalability strategy (bottlenecks, caching, async)
- Define security/compliance controls (auth, encryption, audit)
- Plan monitoring and observability (metrics, logs, traces)
- Document disaster recovery (RTO/RPO, backup, failover)
- Create implementation roadmap (phases, timeline)

**Outcome:** Complete architecture document ready for team review and development planning.

---

### 3. Review & Validate Architecture
Design complete. You run `/design-review`:
- Check completeness (all sections present?)
- Check correctness (requirements met? no contradictions?)
- Check feasibility (tech stack viable? budget realistic? team capable?)
- Check scalability (bottlenecks identified? mitigation clear?)
- Check security (auth/authz in place? data protected? compliance checked?)
- Check operations (monitoring defined? deployment automated? runbooks ready?)
- Extract critical findings (must fix before code starts)
- Extract warnings (important but not blocking)
- Extract best practice recommendations

**Outcome:** Design approval (APPROVED / APPROVED WITH CONDITIONS / NEEDS REVISION) with clear next steps.

---

### 4. Plan Migration (if replacing legacy)
New system designed, old system exists. You use `migration-planning` skill:
- Assess current system (data, users, integrations)
- Validate new system is ready (load tested, monitored)
- Define cutover strategy (big bang or phased)
- Plan data migration (extraction, transformation, validation, sync)
- Update integration endpoints
- Test rollback procedure
- Define success criteria
- Build risk register

**Outcome:** Migration playbook with timeline, rollback plan, validation checklist.

---

### 5. Plan Capacity & Growth
Architecture approved, now forecast costs and infrastructure. You use `capacity-planning` skill:
- Estimate load at key milestones (6mo, 1yr, 3yr)
- Size servers, databases, cache, network
- Project costs (compute, storage, network, licensing)
- Identify bottlenecks and scaling strategy
- Calculate cost-per-user efficiency

**Outcome:** Capacity roadmap with cost projections, spending milestones, contingency plans.

---

### 6. Assess Technical Debt (optional, for existing systems)
Taking over a legacy system. You use `technical-debt-assessment` skill:
- Audit code quality (duplication, long methods, god classes, test coverage)
- Assess architecture (coupling, modularity, dependencies)
- Review data/database (indexes, queries, schema)
- Check operations (logging, monitoring, deployment, runbooks)
- Scan for security/compliance gaps
- Inventory dependencies (outdated, vulnerable, unused)

**Outcome:** Technical debt registry with prioritized refactoring roadmap.

---

## Workflow Example: Order Management System

```
Customer: "We want a new order management system to replace our legacy system.
It's slow, hard to integrate with our ERP, and we need real-time reporting."

You: /discover-requirements acme

Claude: [Runs interview or parses meeting notes]
Outputs: requirements/acme-matrix.md (MoSCoW prioritization)

Customer: [Reviews and approves requirements]

You: /design-system acme-orders

Claude: [Designs architecture: REST APIs, microservices, PostgreSQL + Redis, async processing]
Outputs: designs/acme-orders-architecture.md

Team/Architect: Let me review this...

You: /design-review acme-orders

Claude: [Validates architecture]
Outputs: reviews/acme-orders-review.md (APPROVED WITH CONDITIONS)
Finding: "No disaster recovery plan — add RTO/RPO targets and backup strategy"

You: [Update architecture with DR plan]

You: [Run capacity-planning skill]
Claude: Outputs: capacity/acme-orders-roadmap.md
"Forecast: $8K/mo now, scaling to $65K/mo by year 2 (at 50K users)"

Customer: "Timeline is 6 months. Let's start development."

Team: [Develops using architecture as blueprint]
```

---

## Principles

**API-First Design**
- Define APIs before building services
- Contracts are the team's interface language
- Versioning and backward compatibility built-in

**Scalability Assumed**
- Bottlenecks identified before code starts
- Stateless services, async patterns, caching strategy
- Capacity plan covers 3-year growth

**Security by Default**
- Auth/authz, encryption, audit logging in every architecture
- Compliance requirements identified early
- No "we'll add security later" — hooks warn against it

**Operational Readiness**
- Monitoring, alerting, logging, runbooks designed upfront
- Deployment automation and rollback procedure planned
- Disaster recovery strategy before launch

**Customer Alignment**
- Requirements signed off before architecture
- Design review before development
- Clear success criteria and acceptance gates

---

## Success Metrics

Track and report on:
- **Requirements adherence:** % of approved requirements met in design
- **Design review score:** % of critical findings resolved before code
- **Architecture quality:** Bottleneck identification before launch (vs. post-launch incidents)
- **Time to design:** Hours from requirements to approved architecture (target: <16h)
- **Rework ratio:** Architecture changes post-approval (target: <10%)
- **On-time delivery:** Projects tracking to approved timeline (target: >85%)

---

## Key Constraints

- **Customer sign-off:** Never design without approved requirements matrix.
- **Review before code:** Always run design-review before handing off to dev team.
- **Security non-negotiable:** Every architecture must have auth/authz, encryption, audit logging.
- **Documentation mandatory:** All architecture decisions must be documented (why, not just what).
- **Scalability planned:** Every system must have a capacity roadmap and identified bottlenecks.

---

## Stats

**8 skills** · **3 commands** · **3 hooks** · **2 optional MCP servers** (Firecrawl + Exa) · **Full architecture audit trail** via session logging

---

## Folder Structure

```
solutions_architect_stack/
├── CLAUDE.md                 (this file's configuration)
├── README.md                 (this file)
├── session-log.md            (auto-updated with session activity)
│
├── skills/
│   ├── requirements-discovery.md
│   ├── solution-architect.md
│   ├── design-review.md
│   ├── technical-debt-assessment.md
│   ├── migration-planning.md
│   ├── api-contract-design.md
│   ├── capacity-planning.md
│   └── [expansion slot]
│
├── commands/
│   ├── discover-requirements.md
│   ├── design-system.md
│   └── design-review.md
│
├── hooks/
│   ├── architecture-validator.md
│   ├── security-checklist.md
│   └── session-tracker.md
│
└── mcp/
    └── connections.md
```

---

Built by [tushar2704](https://uitbreiden.com/) · [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
