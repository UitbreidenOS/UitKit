---
name: stakeholder-mapper
description: Maps product decision-makers, stakeholders, and communication channels. Identifies approval paths, creates RACI matrix, and flags potential conflicts. Returns stakeholder map with roles, priorities, and influence flow.
allowed-tools: Read, Write
effort: medium
---

# Stakeholder Mapper

## When to activate

Before launching a feature, making a major product decision, or planning a release rollout. You have org chart or team roster data and need to understand approval dependencies, communication channels, and competing priorities. Activation requires clarity on the decision type (design, pricing, feature launch, policy change).

## When NOT to use

Not for general org charts—this focuses on *product decision-making* stakeholders only. Not for managing internal politics or personal conflicts. Not without sufficient organizational context. Not for documenting individual performance or team issues. Not for decisions where there is no formal approval process.

## Stakeholder Framework

**Core Roles:**
- **Decision-maker:** Has final approval authority; often Product Lead, CPO, VP Product
- **Influencer:** Strong input; customer success, engineering leadership, design lead
- **Executor:** Implements; engineering, design, marketing teams
- **Approver (Legal/Security):** Gating authority for compliance, data, regulatory concerns
- **Customer Voice:** Customer Advisory Board, support, sales feedback

**RACI Matrix:**
- **Responsible:** Does the work
- **Accountable:** Final authority/ownership
- **Consulted:** Provides input (two-way conversation)
- **Informed:** Kept in the loop (one-way notification)

## Analysis Steps

1. **Map decision type:** Feature launch? Design change? Pricing? Timing?
2. **Identify accountable:** Who has final sign-off?
3. **Identify responsible:** Which team executes?
4. **Identify consulted:** Who must have input before approval?
5. **Identify informed:** Who needs notification?
6. **Identify blockers:** Who has veto authority? (Legal, Security, Customer Success)
7. **Identify conflicts:** Competing priorities between stakeholders?
8. **Map communication:** How/when do approvals flow?

## Output Format

```markdown
# Stakeholder Map: [Feature/Decision Name]

## Decision Overview
**Type:** [Feature Launch / Pricing Change / Design / Policy / Timeline]
**Scope:** [What's being decided]
**Timeline:** [Decision deadline]

---

## RACI Matrix

| Role | Name | Responsible | Accountable | Consulted | Informed |
|---|---|---|---|---|---|
| VP Product | [Name] | | X | | |
| Product Manager | [Name] | X | | | |
| Engineering Lead | [Name] | X | X | | |
| Design Lead | [Name] | X | | X | |
| Customer Success | [Name] | | | X | |
| Sales Lead | [Name] | | | X | X |
| Finance | [Name] | | | X | |
| Legal | [Name] | | | X | |

---

## Approval Path

**1. Product Manager** → Drafts brief, gathers customer signals
**2. Design Lead** → Provides design feasibility, UX sign-off
**3. Engineering Lead** → Provides technical feasibility, resource estimate
**4. Customer Success** → Signals customer demand and support impact
**5. VP Product (Accountable)** → Makes final decision

**Timeline:** Brief ready [Date] → Design review [Date] → Engineering estimate [Date] → Executive decision [Date]

---

## Stakeholder Priorities

| Stakeholder | Primary Goal | Concern | Influence |
|---|---|---|---|
| [Name/Role] | [What do they care about?] | [What could block them?] | [How much can they block progress?] |

**Example:**
| VP Product | Align with Q3 OKRs, customer retention | Scope creep, timeline risk | HIGH — can reject or delay |
| Engineering Lead | Maintain velocity, avoid technical debt | Unrealistic timeline, unclear spec | HIGH — can flag unfeasible |
| Customer Success | Customer satisfaction, support burden | Unclear documentation, UX friction | MEDIUM — can flag adoption risk |

---

## Conflict Resolution

**Potential Conflicts:**
- [Stakeholder A priority] vs. [Stakeholder B priority] — *How to resolve:* [Recommendation]

**Decision-making principle:** [How to weight tradeoffs when conflicts arise]

---

## Communication & Approvals

**Approval Gate 1:** Product definition (PM + Design)
**Approval Gate 2:** Technical feasibility (Engineering)
**Approval Gate 3:** Customer impact (Customer Success)
**Final Gate:** Executive approval (VP Product)

**Communication Schedule:**
- [Date]: Stakeholder alignment meeting
- [Date]: Draft approval gates
- [Date]: Final approval
- [Date]: Launch communication to team

---

## Risk Flags

- **Missing stakeholder:** [If someone critical isn't represented, flag it]
- **Competing timelines:** [If approval paths have conflicting dates]
- **Undefined approval authority:** [If accountable role isn't clear]
- **Blocked by external dependency:** [If approval depends on outside team/legal/security]

---
```

## Example

# Stakeholder Map: Tiered Pricing Launch

## Decision Overview
**Type:** Pricing Change + Product Launch
**Scope:** Introduce 3-tier pricing model (Pro, Business, Enterprise) replacing flat-rate
**Timeline:** Decision by June 15; launch July 1

---

## RACI Matrix

| Role | Name | Responsible | Accountable | Consulted | Informed |
|---|---|---|---|---|---|
| VP Product | Alice Chen | | X | | |
| Product Manager | Bob Smith | X | | X | |
| Finance | Carol White | X | | X | |
| Engineering Lead | David Lee | X | | X | |
| Customer Success | Elena Garcia | | | X | |
| Sales Lead | Frank Brown | | | X | |

---

## Approval Path

**1. Finance** → Models revenue impact, churn risk by tier
**2. Product Manager** → Maps features to tiers, justifies positioning
**3. Engineering Lead** → Confirms feature gating and rollout feasibility
**4. Customer Success** → Flags at-risk accounts and migration needs
**5. VP Product (Accountable)** → Makes final tier/pricing decision

**Timeline:** Model ready [June 5] → Feature map [June 8] → Engineering feasibility [June 10] → CS impact assessment [June 12] → Executive decision [June 15]

---

## Stakeholder Priorities

| Stakeholder | Primary Goal | Concern | Influence |
|---|---|---|---|
| Alice (VP Product) | Increase ARPU 15%, retain enterprise | Churn risk in SMB segment | HIGH — final decision |
| Bob (PM) | Clear tier positioning, customer value | Complexity, support burden | MEDIUM — can flag UX risk |
| Carol (Finance) | Maximize revenue, <5% churn impact | Model conservatism, adoption risk | HIGH — can veto pricing |
| David (Engineering) | Clean feature gating, no tech debt | Timeline pressure, scope creep | MEDIUM — can delay launch |
| Elena (CS) | Smooth migration, zero support chaos | Customer confusion, migration burden | MEDIUM — can flag risk |
| Frank (Sales) | Clear messaging, competitive positioning | Pricing credibility, deal friction | LOW-MEDIUM — advisory |

---

## Conflict Resolution

**Conflict 1:** Finance wants aggressive pricing (14% churn projected) vs. CS concerned about SMB flight
- *Resolution:* Finance models retention incentive (3-month discount for Enterprise upgrades); CS owns outbound migration support

**Conflict 2:** Engineering flagged 4-week timeline vs. Product wants July 1 launch
- *Resolution:* Defer feature gating for "Starter" tier to August; launch with 2-tier (Pro, Enterprise) on July 1

**Decision-making principle:** Customer retention (zero unforced churn) takes priority over revenue optimization

---

**Risk Flags:**
- Legal compliance not mapped (check GDPR/SOC2 implications of pricing tiers)
- No customer advisory board input documented
- Migration communication plan undefined

---
