---
name: product-strategist
description: "Product strategy: OKR cascade generation, quarterly planning, product vision documents, competitive landscape analysis, and team scaling proposals for Head of Product"
---

# Product Strategist Skill

## Wanneer activeren
- Een productstrategie document of vision statement maken
- Een OKR-hiërarchie bouwen van bedrijfsdoelen tot team-niveau
- Driemaandelijks strategisch plannen uitvoeren
- Een productstelling schrijven voor een nieuw markt of segment
- Een build-vs-buy-vs-partner-beslissing presenteren
- Teamstructuur ontwerpen voor een schaalbare productorganisatie

## Wanneer NIET gebruiken
- Sprint-level taakpriorisering — gebruik de product-roadmap skill
- Individuele feature-besluiten — gebruik de product-manager-toolkit skill
- Klantonderzoek — gebruik de product-discovery skill
- Alleen competitieve intelligentie — gebruik de competitive-teardown skill

## Instructies

### OKR-cascade

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

### Productvisie document

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

### Driemaandelijks strategisch plannen

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

### Bouwen vs kopen vs partner

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

## Voorbeeld

**Gebruiker:** We zijn $5M ARR B2B SaaS, 8-persoons productteam. Board duwt ons om upmarket naar enterprise te gaan. Moeten we? Wat is het strategische trade-off?

**Claude's strategische analyse:**

Dit is een "moeten we ons ICP veranderen"-beslissing — een van de risicovollste productstrategie-oproepen. Antwoord niet zonder gegevens, en antwoord niet snel.

**De kernspanning:**

SMB-beweging (huidige): groot volume, self-serve, korte sales cycle, hoge churn, lagere ACV
Enterprise-beweging (nieuw): laag volume, sales-led, lange sales cycle, lage churn, hoge ACV

Upmarket gaan is verleidelijk omdat ACV omhooggaat. Het is risicovol omdat:
1. Uw product is bijna zeker niet enterprise-ready (SSO, audit logs, permissions, data residency, procurementproces)
2. Uw team is niet sales-ready (geen enterprise AE's, SE's, CS)
3. Uw kostenstructuur verandert drastisch (langer runway naar sluiten, hogere CS-kosten per klant)

**Vragen die u moet beantwoorden voordat u beslist:**

1. Gebruiken enterprise-bedrijven u al? Als 20%+ van ARR afkomstig is van bedrijven > 500 werknemers, gaat u al upmarket en moet u dit formaliseren. Als het < 5% is, theoretiseert u.

2. Wat is de ICP die succesvol is? Uw best-retained, highest-NRR-klanten — hoe groot zijn ze? Bouw meer van die, niet voor een grootte waar u naar wilt.

3. Wat is de NRR per segment? Als SMB NRR 90% is en mid-market 115%, vertellen de nummers u al waar u in moet investeren.

**Mijn aanbeveling:** Ga eerst naar mid-market (50-500 werknemers), niet enterprise (500+). Het is dichterbij wat u hebt, vereist minder productinvestering en ontriskeert de leercurve voordat u $100K+ deals met complexe procuring op u neemt.

---
