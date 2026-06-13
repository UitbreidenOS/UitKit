---
name: "tech-debt-tracker"
description: "Technical debt management: catalogue, categorise, and prioritise tech debt — build a debt register, quantify impact, present to leadership, and create a paydown strategy"
---

# Tech Debt Tracker Skill

## When to activate
- Creating a tech debt register for the first time
- Prioritising which debt to pay down first
- Making the case to leadership for tech debt investment
- Categorising debt discovered during a sprint or codebase review
- Planning a refactoring sprint or debt paydown quarter
- Documenting the "why" behind technical decisions so future engineers understand

## When NOT to use
- Active bug fixing — that's the debug skill
- Performance profiling — use the performance-profiler skill
- Immediate security vulnerabilities — fix those now, don't add to a register
- Architecture design decisions — use an ADR (Architecture Decision Record) instead

## Instructions

### Tech debt register

```
Create a tech debt register for [codebase/system].

System: [describe]
Team: [X engineers]
Current pain points: [list what's slowing the team down]
Sources of debt: [past deadline pressure / changing requirements / outdated tech / missing tests]

Debt register format:

| ID | Name | Category | Location | Impact | Effort | Priority | Notes |
|---|---|---|---|---|---|---|---|
| TD-001 | [name] | [type] | [file/service] | [H/M/L] | [S/M/L/XL] | [score] | [context] |

Debt categories:
- CODE: duplication, complexity, bad naming, anti-patterns
- ARCHITECTURE: wrong abstractions, coupling, missing separation of concerns
- TEST: missing tests, brittle tests, test coverage gaps
- DEPENDENCY: outdated packages, deprecated libraries, security-vulnerable deps
- DOCUMENTATION: missing, outdated, or misleading docs
- DATA: schema inconsistency, missing indexes, migration backlog
- INFRASTRUCTURE: manual processes that should be automated, legacy config
- SECURITY: known vulnerabilities, insufficient access controls

For each debt item:
Name: [short, descriptive — "Authentication module uses MD5 hashing"]
Category: [from list above]
Location: [file path / service name / database table]
Description: [what the problem is — 1-3 sentences]
Root cause: [why this debt exists — deadline / changing requirements / originally reasonable decision]
Impact: [what it costs the team — slower development / higher bug rate / security risk / etc.]
Effort to fix: S (< 1 day) / M (1-3 days) / L (1-2 weeks) / XL (> 2 weeks)
Risk if not fixed: [what happens if we leave this — scale it, maintain it, never fix it]

Generate the debt register template and populate with items from my codebase description.
```

### Debt prioritisation

```
Prioritise our tech debt backlog.

Debt items: [paste register or list]
Team velocity: [X story points / sprint]
Current business pressure: [shipping features / reliability focus / growth / stability]

Prioritisation framework:

Score each item on 3 axes (1-10 each):

1. PAIN (how much it slows the team right now):
   10 = blocks daily work, causes regular bugs
   5 = noticed weekly, slows specific workflows
   1 = theoretical problem, not practically felt yet

2. RISK (what happens if we leave it):
   10 = security vulnerability or will cause outage
   5 = will become worse at scale, increasing future cost
   1 = cosmetic, manageable indefinitely

3. LEVERAGE (how much fixing it helps):
   10 = enables future features, reduces maintenance by 50%+
   5 = localised improvement, contained benefit
   1 = cosmetic or negligible improvement

Priority score = (Pain + Risk + Leverage) / 3

Effort multiplier:
S: score × 1.5 (quick win — high priority)
M: score × 1.0 (standard)
L: score × 0.7 (higher bar to justify)
XL: score × 0.4 (needs strong justification)

Quadrant view:
High pain + low effort = DO FIRST (quick wins)
High pain + high effort = PLAN (invest time, high ROI)
Low pain + low effort = BATCH (do in spare cycles)
Low pain + high effort = DEFER (unless risk is high)

Produce: prioritised debt backlog with top 5 items to address this quarter.
```

### Leadership presentation

```
Write a leadership presentation for [debt investment request].

Audience: [CTO / VP Engineering / CEO / Board]
Ask: [X engineer-weeks to address Y debt items]
Business context: [what business goal is debt blocking or slowing]
Current cost of debt: [describe in business terms — not just "code is messy"]

Framing for leadership:

WRONG framing: "We need to refactor the authentication module because the code is messy."
RIGHT framing: "Authentication bugs account for 23% of our P1 incidents this year. Fixing the root cause will reduce incident response time by 40% and let us ship the SSO feature 3 weeks earlier."

One-page structure:

SITUATION:
"Our [system/codebase] has accumulated [X years of] technical debt that is now measurably slowing our delivery velocity and increasing our incident rate."

IMPACT (quantify):
- Development velocity: "Features that take 2 days in a greenfield system take 5 days in our codebase due to [specific debt]."
- Incident rate: "X% of our incidents trace back to [specific module/pattern]."
- Engineer retention: "Our last exit interview cited codebase complexity as a reason for leaving." (if applicable)
- Customer impact: "[X] bugs this quarter were caused by [specific debt item]."

PROPOSED INVESTMENT:
"We propose allocating [X] engineer-weeks over [Y] months to address the highest-impact debt items."
[Table: debt item / engineer-weeks / expected outcome]

EXPECTED RETURN:
- [X%] reduction in bug rate in affected areas
- [X] weeks faster delivery on [upcoming feature]
- Enables [initiative] that was previously blocked

WHAT WE'RE NOT ASKING FOR:
"We are not asking to rewrite everything. This is a targeted, scoped paydown of the debt causing the most measurable pain."

Write the leadership brief for my specific ask.
```

### Debt paydown sprint

```
Plan a tech debt paydown sprint for [team].

Team: [X engineers]
Sprint length: [2 weeks]
Debt items to tackle: [list from prioritised register]
Constraint: [some feature work must continue / full debt sprint / mixed]

Sprint planning for debt:

Allocation (recommended):
- 70% debt / 30% features: full debt focus sprint
- 50/50: balanced sprint
- 20% debt / 80% features: ongoing hygiene (sustainable velocity approach)

Note: the best approach is rarely a big-bang "debt sprint." Sustainable: reserve 20% of every sprint permanently for debt. This prevents accumulation faster than periodic sprints.

For each debt item selected:
Task: [specific change]
Owner: [engineer]
Definition of done: [how do we know it's fixed?]
Test coverage required: [yes — debt fixes without tests create new debt]
Review requirement: [which engineer reviews this change?]

Risk management:
- All debt changes in feature branches
- No debt work in the same PR as feature work (keeps history clean)
- Run full test suite before merging any debt change
- Have a rollback plan for database or infrastructure changes

Retrospective question for after the sprint:
"Did we actually feel faster in the following sprint? Which debt items had the most noticeable impact?"

Sprint plan for my team and selected debt items.
```

## Example

**User:** Our Node.js monolith has 4 years of debt. Engineers complain about it constantly but we've never tackled it systematically. Where do I start?

**Claude's 30-day plan:**

Don't start with code. Start with cataloguing.

**Week 1 — Build the register:**
Run a "debt survey" — ask every engineer to spend 20 minutes writing down the 3 things that slow them down most. Use a simple Google Form:
- What's the problem?
- Where is it? (file/module)
- How often do you hit it?
- Rough fix time?

Aggregate responses → you'll get 15-30 items. Many will cluster around 3-5 root causes.

**Week 2 — Categorise and score:**
Take the clustered items and score each one:
- Pain: how often do engineers hit this?
- Risk: what's the worst case if we ignore it?
- Leverage: does fixing this unblock other things?

You'll likely find: 2-3 items score > 8 on all three dimensions. Those are your P1s.

**Common P1 patterns in 4-year Node.js monoliths:**
- Callback-hell async code (should be async/await) → causes bugs, confuses new engineers
- No type safety (plain JS → TypeScript migration needed) → hidden bugs in prod
- No integration tests → every deploy feels risky
- Circular dependencies between modules → can't extract or scale a service
- Single 3,000-line file everyone touches → merge conflicts every sprint

**Month 2 onwards — sustainable paydown:**
Add one debt ticket to every sprint worth ~20% of capacity. Don't do big-bang debt sprints — they're demoralising and rarely complete. Steady-state debt reduction compounds: 20% debt capacity for 6 months = 60% of a sprint of pure debt, but spread across 6 months of sustainable work.

Report to leadership monthly: "We closed X debt items, here's the measurable outcome."

---
