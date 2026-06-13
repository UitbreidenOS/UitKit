---
name: engineering-strategy
description: "Engineering strategy document: tech vision, build vs buy decisions, team topology, 12-month roadmap"
updated: 2026-06-13
---

# Engineering Strategy Skill

## When to activate
- Writing the engineering strategy doc for a new CTO role or at the start of a planning cycle
- Presenting engineering direction to the board, CEO, or investors
- Deciding whether to build, buy, or partner on a major technical capability
- Redesigning team topology after significant growth, a reorg, or a product pivot
- Setting a 12-month roadmap that balances product delivery with platform health
- Documenting the technical vision after major architectural decisions

## When NOT to use
- Individual architecture decisions — use `/adr-writer` for those
- Sprint-level planning — use your project management tool
- Hiring individual roles — use a job description and hiring rubric instead
- Post-incident reviews — that's a specific operational artifact, not a strategy doc

## Instructions

### Full engineering strategy document

```
Write an engineering strategy document for [COMPANY].

Context:
- Company stage: [seed / series A / series B / growth / enterprise]
- Current engineering team size: [X engineers]
- Current architecture: [monolith / microservices / serverless / hybrid]
- Primary tech stack: [languages, frameworks, cloud provider]
- Current biggest technical pain: [e.g., deployment velocity, reliability, scaling, tech debt]
- Business context: [what the company is trying to achieve in the next 12 months]
- Top 3 product priorities from CEO/CPO: [list them]

Produce a strategy document covering:

## 1. Engineering Vision (12 months)
One paragraph: What does our engineering organisation look like in 12 months?
Specifically address:
- Deployment frequency (target)
- System reliability (uptime / error rate target)
- Team structure (how many teams, what model)
- Developer experience (how fast can a new engineer ship their first feature?)

## 2. Current State Assessment
Honest diagnosis — what's working, what's broken:
- Architecture: [current state and key limitations]
- Tech debt: [quantify if possible — % of dev time lost to it]
- Deployment velocity: [current deploys/day or week]
- Reliability: [current uptime, incident rate]
- Team structure: [current topology and where it breaks down]

## 3. Strategic Priorities (ranked)
Top 3-5 engineering bets for the next 12 months.
For each priority:
- What it is
- Why it matters (business impact, not technical elegance)
- What success looks like (measurable)
- Rough investment required (engineering weeks / headcount)

## 4. Build vs. Buy vs. Partner
For each major technical capability we need:
| Capability | Build | Buy | Partner | Recommendation | Rationale |
Use criteria:
- Core differentiator? → Build
- Commodity/solved problem? → Buy
- Need reach/network? → Partner
- Time to market critical? → Lean toward Buy

## 5. Team Topology
Current → Target structure over 12 months.
Team models to choose from:
- Stream-aligned teams (product-feature ownership)
- Platform/enabling teams (developer experience, infra)
- Complicated subsystem teams (ML, search, data pipeline)
Use Team Topologies vocabulary: stream-aligned, platform, enabling, complicated subsystem.
For each team: mission, size, tech ownership, interfaces to other teams.

## 6. Technology Bets
What are we committing to over the next 2-3 years?
- Core languages and frameworks (what we're standardising on)
- Cloud provider and key managed services
- What we're moving away from (sunset plan)
- What we're watching but not committing to yet

## 7. Engineering Health Metrics
How will we measure if the strategy is working?
| Metric | Current | 6-month target | 12-month target |
Include: DORA metrics (deployment frequency, lead time, MTTR, change failure rate), availability, developer NPS, tech debt ratio.

## 8. Risks and Mitigations
Top 3 risks to this strategy:
- Risk, likelihood, impact, mitigation

## 9. Investment Ask
What do we need to execute this strategy?
- Headcount: [X engineers to hire in next 12 months]
- Tooling budget: [$X for build-vs-buy decisions]
- Infrastructure: [expected infra cost change]
```

### Build vs. Buy decision framework

```
Help me decide whether to build or buy [CAPABILITY].

Capability description: [what we need it to do]
Our current approach: [how we handle it today, if at all]
Timeline pressure: [when we need it]
Engineering cost to build: [estimate in eng-weeks, or ask Claude to estimate]
Buy options I've identified: [vendor names, pricing if known]
Our team's expertise in this area: [strong / weak / none]

Evaluate against these criteria:

1. Core differentiator test
Is this capability part of our unique value proposition?
- YES → Strong signal to build (owning it = competitive moat)
- NO → Strong signal to buy (it's commodity infrastructure)

2. Complexity vs. expertise
- High complexity + low team expertise → Buy (build risk is high)
- High complexity + strong team expertise → Build (if differentiated)
- Low complexity + any expertise → Build (unless off-the-shelf is trivial)

3. Time to market
- Need in < 3 months → Buy almost always wins
- 3-12 months → depends on strategic importance
- 12+ months → build if differentiating

4. Total cost of ownership (3-year horizon)
Build: engineering cost + maintenance overhead + opportunity cost
Buy: licence fees + integration + lock-in premium

5. Vendor risk
- Startup vendor: lock-in risk, acquisition risk
- Established vendor: pricing power risk, slow roadmap risk
- Open source: maintenance burden, community risk

Output:
- Recommendation: Build / Buy / Hybrid / Delay
- 3 strongest reasons for the recommendation
- What would change your mind
- If Buy: vendor shortlist and next step
- If Build: rough architecture and team assignment
```

### Team topology design

```
Design the team topology for our engineering organisation.

Current state:
- Total engineers: [X]
- Current teams: [list them and what they do]
- Biggest coordination problems: [where do handoffs break or slow things down?]
- Product areas: [list the major product domains]
- Platform/infra maturity: [strong / weak / non-existent]

Target state:
- Engineers in 12 months: [X (including hiring plan)]
- Primary business priority: [ship product features / scale infrastructure / reduce incidents]

Design the target topology using these team types:
1. Stream-aligned teams: Own a product domain end-to-end, fast flow, empowered
2. Platform team: Internal product — CI/CD, observability, developer tooling, infra
3. Enabling team: Temporary, coaches other teams through transitions (migration, new tech)
4. Complicated subsystem team: Deep expertise required — ML, search, payment processing

For each team in the target design:
- Team name and mission
- Team size (target and interim)
- What they own (services, features, infra)
- What they depend on (from platform team or external)
- How they interact with adjacent teams (API, shared service, consultation)
- Success metric for this team

Interaction modes between teams:
- Collaboration: works closely, frequent communication (temporary, for transitions)
- X-as-a-Service: consumer/provider relationship with defined interface
- Facilitating: one team helps another build capability (time-boxed)

Output: org chart + team charters + interaction model diagram (text-based)
```

### 12-month engineering roadmap

```
Build a 12-month engineering roadmap.

Business priorities from leadership:
Q1: [what the company needs to ship / achieve]
Q2: [what the company needs to ship / achieve]
Q3: [what the company needs to ship / achieve]
Q4: [what the company needs to ship / achieve]

Engineering constraints:
- Current team capacity: [X engineers × 10 productive days/sprint]
- Planned hiring: [when and what roles]
- Known tech debt obligations: [what must be addressed]
- Planned migrations: [e.g., moving to microservices, upgrading infra]

Roadmap format:

## Q1 — [Theme]
Product deliverables: [list]
Platform / infra work: [list]
Tech debt addressed: [list]
Hiring: [roles]
Risk: [what could derail this quarter]

[repeat for Q2, Q3, Q4]

## Investment split (target)
- New product features: [X]%
- Platform and infrastructure: [X]%
- Tech debt reduction: [X]%
- Reliability and on-call: [X]%

Target ratio for healthy engineering orgs:
- Early stage: 70/15/10/5 (ship fast, worry about debt later)
- Growth stage: 60/20/15/5 (start investing in platform)
- Scale stage: 50/25/20/5 (debt and reliability become existential)

## Dependencies and blockers
What must happen outside engineering for this roadmap to succeed?
- Product decisions needed by [date]
- Design resources needed in [quarter]
- Data / legal / compliance approvals needed for [feature]
```

### DORA metrics baseline

```typescript
interface DORAMetrics {
  // Deployment Frequency: how often you deploy to production
  deploymentFrequency: 'multiple_per_day' | 'daily' | 'weekly' | 'monthly' | 'less_than_monthly'

  // Lead Time for Changes: time from commit to production
  leadTimeHours: number

  // Change Failure Rate: % of deployments causing incidents
  changeFailureRate: number  // 0.0 to 1.0

  // Mean Time to Restore: average time to recover from an incident
  mttrHours: number
}

// Elite performer benchmarks (DORA State of DevOps report)
const DORA_ELITE: DORAMetrics = {
  deploymentFrequency: 'multiple_per_day',
  leadTimeHours: 1,
  changeFailureRate: 0.05,   // < 5%
  mttrHours: 1,
}

// High performer benchmarks
const DORA_HIGH: DORAMetrics = {
  deploymentFrequency: 'daily',
  leadTimeHours: 24,
  changeFailureRate: 0.10,   // < 10%
  mttrHours: 8,
}

// Use these to benchmark current state and set targets in engineering strategy
```

## Example

**User:** I'm a new CTO at a Series B startup (120 employees, 18 engineers). We have a Rails monolith that's 6 years old, 4 undifferentiated teams, 1 deploy per week, and 97% uptime. Board wants to 3x our product delivery in 12 months.

**Output excerpt:**

```
## Engineering Vision (12 months)
A 25-person engineering organisation shipping to production 10x per day with 99.5% uptime,
structured into 4 stream-aligned product teams and 1 platform team. A new engineer ships
to production in their first week.

## Current State Assessment
Architecture: Rails 6 monolith, 6 years of debt. Main limitation: feature flags don't exist,
so every deploy is all-or-nothing — this is why weekly deploys feel necessary.
Deployment velocity: 1 deploy/week = DORA "medium" performer. Target: daily minimum, multiple/day by Q4.
Reliability: 97% uptime = ~260 hours/year of downtime. Target: 99.5% = < 44 hours/year.
Team structure: 4 undifferentiated teams = everyone depends on everyone. Coordination overhead
explains why 18 engineers feel like they're moving slowly.

## Strategic Priorities
1. Feature flag infrastructure (Q1): Enable safe continuous deployment. Without this, velocity can't improve.
2. Platform team formation (Q1): 3 engineers off product work, full-time on CI/CD, observability, deployment
3. Team domain ownership (Q2): Assign clear product domain boundaries — stop the cross-team dependency web
4. Service extraction (Q3-Q4): Extract 2-3 highest-value bounded contexts from the monolith

## Build vs. Buy
| Capability | Recommendation | Rationale |
|---|---|---|
| Feature flags | Buy (LaunchDarkly) | Not a differentiator. $20k/year saves 8 eng-weeks |
| Observability | Buy (Datadog or Honeycomb) | Commodity. Buy now, build data pipeline later |
| CI/CD pipeline | Build on GitHub Actions | Already owned, team has expertise |
| Incident management | Buy (PagerDuty) | Solved problem, critical path |
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
