---
name: product-strategist
description: "Product strategy: OKR cascade generation, quarterly planning, product vision documents, competitive landscape analysis, and team scaling proposals for Head of Product"
---

# Product Strategist Skill

## When to activate
- Creating a product strategy document or vision statement
- Building an OKR hierarchy from company goals down to team level
- Running quarterly strategic planning
- Writing a product thesis for a new market or segment
- Presenting a build-vs-buy-vs-partner decision
- Designing team structure for a scaling product organisation

## When NOT to use
- Sprint-level task prioritisation — use the product-roadmap skill
- Individual feature decisions — use the product-manager-toolkit skill
- Customer research — use the product-discovery skill
- Competitive intelligence only — use the competitive-teardown skill

## Instructions

### OKR cascade

```
Generate an OKR cascade for [company/quarter].

Company goal: [top-level objective]
Time period: [Q3 2026 / H2 2026 / FY2026]
Teams involved: [Engineering, Design, Data, Marketing, Sales]

OKR cascade structure:

COMPANY LEVEL (set by CEO/leadership):
Objective: [aspirational, qualitative]
KR1: [measurable outcome] — target: [X] by [date]
KR2: [measurable outcome] — target: [X] by [date]
KR3: [measurable outcome] — target: [X] by [date]

PRODUCT LEVEL (derived from company OKRs):
Objective: [product-specific phrasing of the company objective]
KR1: [product metric that moves the company KR]
KR2: [product metric]
KR3: [product metric]

ENGINEERING LEVEL:
Objective: [how engineering enables product outcomes]
KR1: [engineering metric — reliability, velocity, quality]
KR2: [feature delivery milestone that enables product KR]

DESIGN LEVEL:
Objective: [how design enables product outcomes]
KR1: [design quality or throughput metric]

DATA LEVEL:
Objective: [how data enables product decisions]
KR1: [analytics, data quality, or model metric]

Rules:
- KRs must be measurable with a specific number
- KRs should NOT be activities ("ship X feature") — they should be outcomes ("increase X metric by Y")
- Each team KR should trace to at least one company KR
- No more than 5 objectives per level, 3-4 KRs per objective

Generate the full OKR cascade for my company goals.
```

### Product vision document

```
Write a product vision document for [product/company].

Product: [describe]
Time horizon: [3 years / 5 years]
Current state: [where you are now]
Audience: [internal team / investors / board]

Vision document structure:

1. THE PROBLEM WE SOLVE (2-3 sentences)
[The specific frustration or gap in the world we're addressing]
[Who feels this most acutely?]
[What does the world look like without our solution?]

2. OUR VISION (1 sentence — the north star)
"In [X years], [who] will [do what differently] because of [product]."

3. THE CUSTOMER WE SERVE
Primary persona: [job title, key challenge, success criteria]
Secondary persona: [job title, key challenge, success criteria]
Not for: [explicit segment we are NOT building for]

4. WHAT WE BUILD (and what we don't)
In scope: [the problem space we own]
Adjacent but out of scope: [things we deliberately don't do]
Why those boundaries: [the reasoning behind the scope]

5. HOW WE WIN (our theory of differentiation)
Moat: [what will be hard to replicate — data, network, brand, technology]
GTM advantage: [why we can acquire customers others can't]
Why now: [what changed that makes this the right moment]

6. THE PRODUCT IN [YEAR]
[Concrete description of what the product looks like at the horizon — features, integrations, user journeys]

7. SUCCESS LOOKS LIKE
[3-5 measurable indicators that would confirm we achieved the vision]

Write the vision document for my product and horizon.
```

### Quarterly strategic planning

```
Run a quarterly strategy session for [product team].

Team: [size, composition]
Quarter: [Q3 2026]
Company OKRs this quarter: [paste]
Last quarter's results: [what was achieved vs. not]
Current challenges: [describe strategic tensions]

Quarterly planning framework:

RETROSPECTIVE (look back):
- Did we move our OKRs? By how much?
- What did we learn that changes our strategy?
- What did we deprioritise that we shouldn't have?
- What unexpected things happened?

CONTEXT SETTING (understand the landscape):
- What market signals changed this quarter?
- What did customers tell us that surprised us?
- What did competitors do that we need to respond to?
- What internal constraints changed (team size, tech debt, budget)?

STRATEGIC CHOICES (this quarter's bets):
For each OKR: what is the highest-leverage initiative?

Template:
OKR: [company KR we're contributing to]
Our bet: [the single most important initiative]
Why this: [the hypothesis — if we do X, Y will move]
Success signal: [how we'll know by end of quarter it's working]
Risk: [what could go wrong / make this not work]

CAPACITY ALLOCATION:
| Initiative | Engineer-weeks | Priority | OKR link |
|---|---|---|---|
| [A] | [X] | Must | [KR1] |
| [B] | [X] | Should | [KR2] |
| Buffer | 20% | — | — |

DECISIONS NEEDED:
- [Decision 1 — who decides, what information is needed, by when]

Run the planning session for my team and OKRs.
```

### Build vs buy vs partner

```
Analyse a build vs buy vs partner decision for [capability].

Capability: [describe what the team needs]
Context: [why this is being considered now]
Build capacity: [engineering weeks available / skills available]
Budget: [for buy/partner options]
Timeline: [when this is needed]

Decision framework:

BUILD when:
- Core to your differentiation (customers pay for this specifically)
- No good solution exists at your price/quality point
- You have the team capacity and skills
- The maintenance burden is acceptable long-term

BUY when:
- Commodity capability that's not your moat
- Time-to-market matters more than control
- The build cost exceeds the SaaS cost over 3 years
- The vendor has better expertise in this domain

PARTNER when:
- The capability requires a third-party relationship (e.g. data access)
- Co-marketing or distribution matters alongside the capability
- The partner completes the product story for customers
- Revenue share is better economics than licensing

Analysis output:

| Option | Cost (3yr) | Time to ship | Risk | Recommendation |
|---|---|---|---|---|
| Build | $[X] | [X months] | [High/Med/Low] | |
| Buy ([vendor]) | $[X] | [X weeks] | | |
| Partner ([name]) | $[X] | [X weeks] | | |

Recommendation: [choice] because [key reason]
Conditions: [what would change this recommendation]

Analyse my specific capability decision.
```

## Example

**User:** We're a $5M ARR B2B SaaS, 8-person product team. Board is pushing us to move upmarket to enterprise. Should we? What's the strategic trade-off?

**Claude's strategic analysis:**

This is a "should we change our ICP" decision — one of the highest-stakes product strategy calls. Don't answer it without data, and don't answer it fast.

**The core tension:**

SMB motion (current): high volume, self-serve, short sales cycle, high churn, lower ACV
Enterprise motion (new): low volume, sales-led, long sales cycle, low churn, high ACV

Moving upmarket is seductive because ACV goes up. It's risky because:
1. Your product almost certainly isn't enterprise-ready (SSO, audit logs, permissions, data residency, procurement process)
2. Your team isn't sales-ready (no enterprise AEs, SEs, CS)
3. Your cost structure changes dramatically (longer runway to close, higher CS cost per customer)

**Questions to answer before deciding:**

1. Are enterprise companies already using you? If 20%+ of ARR is from companies > 500 employees, you're already going upmarket and should formalize it. If it's < 5%, you're theorizing.

2. What's the ICP that's succeeding? Your best-retained, highest-NRR customers — what size are they? Build for more of those, not for a size you aspire to.

3. What's the NRR by segment? If SMB NRR is 90% and mid-market is 115%, the numbers are already telling you where to invest.

**My recommendation:** Move to mid-market (50-500 employees) first, not enterprise (500+). It's closer to what you have, requires less product investment, and de-risks the learning curve before you take on $100K+ deals with complex procurement.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
