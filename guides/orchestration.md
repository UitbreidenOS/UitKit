# Orchestration Protocol

A lightweight pattern for coordinating personas, agents, and skills on complex multi-domain work.

No framework required. No dependencies. Just structured prompting.

---

## Core Concept

Most real work crosses domain boundaries. A product launch needs engineering, marketing, and strategy. An architecture review needs security, cost analysis, and team assessment.

Orchestration connects the right expertise to each phase of work:

- **Agents** define *who* is thinking — identity, judgment, communication style
- **Skills** define *how* to execute — steps, templates, examples, patterns
- **Phases** define *when* to switch — as the work moves from one domain to another

You combine them. The pattern is always the same.

---

## The Pattern

### 1. Define the objective

State what you want to accomplish, not how to accomplish it.

```
Objective: Launch a new SaaS product for small accounting firms.
Constraints: 2-person team, $5K budget, 6-week timeline.
Success criteria: 50 paying customers in first 30 days.
```

### 2. Select the right agent

Pick the agent whose judgment fits the current phase. Agents carry opinions, priorities, and decision-making frameworks.

| Situation | Agent | Why |
|---|---|---|
| Architecture decisions, tech stack, build-vs-buy | `cto-advisor` | Engineering judgment |
| Launch strategy, growth channels, content | `cmo-advisor` | GTM and channel expertise |
| Financial model, unit economics, fundraising | `cfo-advisor` | Numbers-first decisions |
| Product roadmap, prioritisation, user research | `cpo-advisor` | User-outcome focus |
| Operations, process, team structure | `coo-advisor` | Execution-first |
| Everything at once, alone | `ceo-advisor` | Cross-domain prioritisation |

**Activation:**
```
/agents/advisors/cto-advisor
```

### 3. Load skills for execution

Agents know *what* to do. Skills know *how* to do it with precision. Load the skills your current phase needs.

```
/skills/devops-infra/aws-architect       — infrastructure pattern
/skills/backend/nodejs/nextjs            — frontend framework
/skills/devops-infra/cicd               — deployment pipeline
```

The agent drives decisions. The skills provide structured steps, templates, and concrete patterns.

### 4. Work in phases

Break the objective into phases. Each phase can use different agents and skills.

```
Phase 1: Technical Foundation (Week 1-2)
  Agent: cto-advisor
  Skills: aws-architect, codebase-onboarding, cicd
  Output: Architecture doc, deployed skeleton, CI pipeline

Phase 2: Launch Preparation (Week 3-4)
  Agent: cmo-advisor
  Skills: copywriting, content-strategy, seo-audit
  Output: Landing page, content calendar, launch plan

Phase 3: Go-to-Market (Week 5-6)
  Agent: ceo-advisor
  Skills: email-sequence, analytics-tracking, pricing-strategy
  Output: Launched product, tracking, first customers
```

### 5. Hand off between phases

When switching phases, always summarise what was decided and what's open:

```
Phase 1 complete.
Decisions made: AWS serverless (Lambda + DynamoDB), Next.js frontend, GitHub Actions CI
Artifacts created: architecture-doc.md, deployed to staging
Open questions: pricing model (Phase 3 decision)

Switching to Phase 2. Loading cmo-advisor + copywriting + content-strategy skills.
```

---

## Common Orchestration Patterns

### Pattern A: Solo Sprint

One person, one objective, multiple domains. Switch agents as you move through phases.

```
Week 1: cto-advisor + engineering skills → Build the product
Week 2: cmo-advisor + marketing skills  → Prepare the launch
Week 3: ceo-advisor + GTM skills        → Ship and iterate
```

Best for: side projects, MVPs, solo founders, single-person startups.

### Pattern B: Domain Deep-Dive

One domain, maximum depth. Single agent, multiple skills stacked.

```
Agent: cto-advisor
Skills loaded simultaneously:
  - aws-architect       → infrastructure design
  - cloud-security      → security posture
  - slo-architect       → reliability targets
  - chaos-engineering   → failure mode testing

Task: Full production-readiness review
```

Best for: architecture reviews, compliance audits, pre-launch technical deep-dives.

### Pattern C: Multi-Agent Review

Different agents review the same problem from different lenses.

```
Step 1: cto-advisor designs the technical architecture
Step 2: cfo-advisor reviews the build-vs-buy cost model
Step 3: ceo-advisor makes the final trade-off call
```

Best for: high-stakes decisions, investor prep, board-level recommendations, major pivots.

### Pattern D: Skill Chain

No agent needed. Chain skills sequentially for procedural work.

```
1. /product-discovery    → Identify the problem and validate it
2. /experiment-designer  → Design the test
3. /analytics-tracking   → Set up measurement
4. /product-analytics    → Interpret results
```

Best for: repeatable workflows, content pipelines, compliance checklists, research processes.

---

## Example: Full Product Launch (6 Weeks)

**Setup:**
```
Objective: Launch a B2B invoicing tool for freelancers
Team: 1 developer + 1 marketer
Timeline: 6 weeks
Budget: $5K
```

**Week 1-2: Build**
```
Agent: cto-advisor
Skills: aws-architect, nextjs, postgresql, stripe

Deliverables:
- Architecture decision (serverless: Lambda + DynamoDB + Stripe)
- Deployed MVP: auth, invoicing, payment collection
- CI/CD pipeline (GitHub Actions → AWS)
```

**Week 3-4: Prepare Launch**
```
Agent: cmo-advisor
Skills: copywriting, seo-audit, content-strategy, email-sequence

Deliverables:
- Landing page live (hero, pricing, social proof)
- 3 blog posts scheduled (SEO-targeted)
- Welcome email sequence configured (5 emails, 14-day drip)
- Launch day checklist
```

**Week 5: Launch**
```
Agent: ceo-advisor
Skills: pricing-strategy, analytics-tracking, onboarding-cro

Deliverables:
- Pricing finalised (3-tier: Solo $19 / Pro $49 / Team $99)
- Analytics tracking verified end-to-end
- Product Hunt submission prepared
- Onboarding checklist activated (5-step in-app)
```

**Week 6: Iterate**
```
Agent: ceo-advisor
Skills: product-analytics, experiment-designer, customer-success

Deliverables:
- Week 1 metrics: signups, activation rate, first payment
- Top friction point identified (onboarding step 3)
- Experiment designed and launched
- Month 2 roadmap sketched
```

---

## Rules

1. **One agent at a time.** Switching is fine, but don't blend two agents in the same conversation turn.
2. **Skills stack freely.** Load as many skills as the task needs. They don't conflict.
3. **Agents are optional.** For procedural work, skill chains alone are sufficient.
4. **Context carries forward.** When switching phases, always summarise decisions and artifacts first.
5. **You decide.** Orchestration is a suggestion. Override any phase, agent, or skill at any point.

---

## Quick Reference

**Agent activation:**
```
/agents/advisors/cto-advisor
/agents/advisors/cmo-advisor
/agents/advisors/cfo-advisor
/agents/advisors/cpo-advisor
/agents/advisors/coo-advisor
/agents/advisors/ceo-advisor
/agents/advisors/general-counsel
/agents/roles/incident-commander
/agents/roles/senior-backend
/agents/roles/senior-frontend
/agents/roles/red-team
```

**Skill activation:**
```
/skills/devops-infra/aws-architect
/skills/marketing/content-strategy
/skills/product/product-discovery
[see skills/ directory for full catalog]
```

**Phase handoff template:**
```
Phase [N] complete.
Decisions: [list key decisions made]
Artifacts: [list files or docs created]
Open items: [what the next phase needs to resolve]
Switching to: [agent] + [skills]
```

---
