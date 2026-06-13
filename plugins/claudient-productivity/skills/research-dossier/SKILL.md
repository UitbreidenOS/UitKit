---
name: "research-dossier"
description: "Decision-grade entity research: build a comprehensive dossier on a company, person, market, or technology — structured for strategic decisions, not just background reading"
---

# Research Dossier Skill

## When to activate
- Building a research dossier on a company before a partnership, acquisition, or investment
- Researching a person before a board meeting, hiring decision, or negotiation
- Mapping a competitive landscape before entering a market
- Deep-diving a technology or framework before a build-vs-buy decision
- Preparing for a high-stakes meeting where you need full context fast

## When NOT to use
- Quick background check (Google suffices for surface-level)
- Academic literature review — use the lit-review skill
- Patent landscape — use the patent-analysis skill
- Real-time news monitoring — use a dedicated news aggregator

## Instructions

### Company dossier

```
Build a company dossier on [company name].

Purpose: [acquisition target / partnership evaluation / competitive intelligence / investor prep]
Depth: [executive summary (1 page) / full dossier (10-15 pages)]
Audience: [CEO / board / investment committee / deal team]

Dossier structure:

1. COMPANY SNAPSHOT (always include):
   Founded: [year] | HQ: [location] | Stage: [private/public, funding stage]
   Employees: [range] | ARR/Revenue: [if known] | Last funding: [$X, date, lead investor]

2. BUSINESS MODEL:
   What they sell: [product / service description in 2 sentences]
   Who buys it: [customer profile — size, industry, role]
   How they make money: [subscription / usage / transaction / services]
   Key metrics: [ARR growth rate / NRR / CAC / LTV — if available from public sources]

3. PRODUCT:
   Core product capabilities: [what it does]
   Tech stack signals: [from job postings, open source, engineering blog]
   Differentiators claimed: [from their marketing, case studies]
   Known limitations: [from customer reviews, community, analyst reports]

4. MARKET POSITION:
   Category: [how they define the market]
   Main competitors: [list with brief differentiation]
   Market share estimates: [analyst reports, community signal]
   Positioning: [where they sit on simple/powerful, SMB/enterprise axes]

5. LEADERSHIP AND TEAM:
   CEO: [background, previous companies, years in role]
   CTO: [background, technical credibility signals]
   Key investors and board members: [with their track record]
   Team signals: [hiring patterns, LinkedIn activity, notable hires/departures]

6. CUSTOMER AND MARKET SIGNALS:
   Customer reviews: [G2, Capterra, Reddit, Hacker News sentiment]
   Notable customers (public): [logos if available]
   Community health: [Slack/Discord size, GitHub stars if applicable]
   Press sentiment: [recent coverage, controversies]

7. FINANCIAL HEALTH SIGNALS (for private companies):
   Funding runway: [estimated from last round + known burn rate]
   Revenue signals: [headcount growth, office expansion, pricing changes]
   Fundraising signals: [LinkedIn job postings for finance roles, pitch signals]
   Distress signals: [layoffs, leadership departures, pricing retreat]

8. STRATEGIC ASSESSMENT:
   Why this company matters: [strategic significance for the stated purpose]
   Key risks: [competitive, regulatory, financial, product]
   Key opportunities: [what they could become, where they're going]
   Our decision: [proceed / investigate further / pass — and the 2-3 deciding factors]

Research sources to use:
Primary: company website, investor page, product docs, engineering blog
Secondary: Crunchbase, LinkedIn, G2/Capterra, GitHub, job postings, press releases
Community: Hacker News, Reddit (r/[relevant subreddits]), Twitter/X mentions
Analyst: Gartner, Forrester, IDC (if available), CB Insights
```

### Person dossier

```
Build a person dossier on [person name] for [purpose].

Purpose: [board candidate / executive hire / negotiation counterpart / speaker / advisor]
Scope: [professional background / reputation / public work / red flags]

Note: This dossier covers publicly available professional information only. Do not attempt to access private information, personal accounts, or conduct surveillance.

Dossier structure:

1. PROFESSIONAL BACKGROUND:
   Current role: [title, company, since when]
   Previous roles: [chronological, focus on relevant ones]
   Education: [degrees, institutions — if publicly listed]
   Time in current role: [X years — is this a builder or short-tenured?]

2. TRACK RECORD:
   Notable achievements: [companies built, products shipped, funds raised, outcomes]
   Public metrics: [if a founder — company exits, ARR achieved, team size built]
   Failures: [public company failures, departures — context matters]
   Pattern: [serial entrepreneur? operator? investor? advisor?]

3. THOUGHT LEADERSHIP:
   Published writing: [blog, Substack, Medium — what topics, what perspective]
   Speaking: [conferences, podcasts — what they talk about]
   Online presence: [LinkedIn follower signal, Twitter/X engagement, GitHub activity]
   Reputation in community: [how they're referenced by peers]

4. NETWORK AND REFERENCES:
   Board memberships: [what companies, what role]
   Investment portfolio: [if investor — what they backed, any exits]
   Known co-founders or close collaborators: [pattern of working relationships]
   Mutual connections: [LinkedIn mutual connections who can provide context]

5. RED FLAGS (if any):
   Legal: [public litigation, regulatory actions — from PACER, SEC EDGAR]
   Reputation: [public controversies, community complaints, Glassdoor if founder/exec]
   Pattern: [multiple short tenures, frequent pivots without clear narrative]

6. ASSESSMENT FOR [PURPOSE]:
   Strengths for this role: [specific to why you're researching them]
   Concerns: [what to probe in conversation]
   Reference check priority: [who to talk to, what to ask]
   Recommendation: [proceed / proceed with caution / pass]
```

### Market landscape dossier

```
Map the competitive landscape for [market].

Market definition: [describe the problem space]
My company's position: [where we play or want to play]
Purpose: [entering the market / expanding / acquisition strategy / investor pitch]

Landscape structure:

1. MARKET DEFINITION:
   The problem being solved: [in 2-3 sentences, from the buyer's perspective]
   Who has this problem: [buyer profile — size, industry, role]
   Current solutions: [how buyers solve this today without dedicated software/service]

2. MARKET SIZE:
   TAM estimate: $[X] (source + methodology)
   SAM (serviceable): $[X]
   Growth rate: [X% CAGR — source]
   Stage: [emerging / growing / mature / declining]

3. PLAYER MAPPING:

   Category leaders (> $X ARR or notable):
   | Company | Founded | ARR/Funding | Target | Differentiator |
   |---|---|---|---|---|

   Challengers (growing, notable):
   [Same format]

   Niche specialists (strong in specific segments):
   [Same format]

   Adjacent players (may expand into this space):
   [Name + why they're a threat]

4. COMPETITIVE DYNAMICS:
   Who is taking market share and why?
   Who is losing and why?
   Is the category consolidating or fragmenting?
   What's the VC/investor activity signal? (hot = crowded and validated; cold = opportunity or dying)

5. WHITE SPACE ANALYSIS:
   Underserved segments: [who isn't being well-served?]
   Feature gaps: [what do buyers universally complain about that nobody does well?]
   Geographic gaps: [markets where no strong player exists]
   Go-to-market gaps: [channels or motions nobody is doing well]

6. POSITIONING OPPORTUNITY:
   Where could we own a position others can't credibly take?
   What's the 2x2 with the most whitespace?
   Which player, if we beat them, becomes our main narrative?
```

### Technology dossier

```
Research [technology / framework / platform] for a build-vs-buy or adoption decision.

Technology: [name]
Decision context: [evaluate for adoption / compare vs. alternatives / assess maturity]

Technology dossier:

1. WHAT IT IS:
   Core purpose: [what problem it solves, in 2 sentences]
   Category: [database / framework / platform / protocol / tool]
   License: [MIT / Apache / proprietary / AGPL — business implications]
   Current version and release cadence: [how actively maintained?]

2. ADOPTION AND COMMUNITY:
   GitHub stars: [X stars, X recent commits, X contributors]
   Downloads: [npm/PyPI/Docker Hub weekly downloads]
   Community size: [Discord/Slack members, Stack Overflow question volume]
   Major adopters: [notable companies using it publicly]
   Trajectory: [growing / stable / declining — check star history]

3. TECHNICAL ASSESSMENT:
   Core strengths: [what it does better than alternatives]
   Known limitations: [scaling limits, missing features, known issues]
   Documentation quality: [excellent / good / sparse / outdated]
   Production readiness: [battle-tested / maturing / experimental]
   Security posture: [CVE history, dependency audit, security disclosure policy]

4. ECOSYSTEM:
   Integrations: [what tools and platforms it connects with natively]
   Managed/hosted options: [if self-hostable — are there managed offerings?]
   Support options: [community-only / commercial support / enterprise tier]
   Training and resources: [courses, tutorials, books]

5. ALTERNATIVES COMPARISON:
   | Alternative | Strengths | Weaknesses | When to choose it instead |
   |---|---|---|---|

6. RECOMMENDATION:
   Adopt / Evaluate / Hold / Avoid
   Rationale: [1-2 key reasons]
   Conditions for adoption: [what would need to be true for us to use this?]
   Migration risk: [low / medium / high — if we adopt and then want to switch]
```

## Example

**User:** We're evaluating acquiring a $3M ARR B2B SaaS company in the legal tech space. I need a company dossier to present to our board next week.

**Claude's dossier outline for a legal tech acquisition target:**

Given the acquisition context, here's what the board will care about most — I'll structure the dossier to answer the three questions an acquisition committee always asks:

**Question 1: Is this a business worth buying?**
→ Section 3 (Business Model), Section 5 (Financial Health), Section 6 (Customer Signals)

- Revenue quality: Is the $3M ARR recurring, or is it a mix of one-time implementation fees? What's the NRR? (> 100% = expansion; < 85% = churn problem)
- Customer concentration: Top 5 customers = what % of ARR? (> 40% = concentration risk)
- Contract structure: Annual / multi-year? What's the weighted average remaining contract term?

**Question 2: Can we integrate it without breaking it?**
→ Section 4 (Product), Section 2 (Leadership — key person risk)

- Is there a technical founder who will leave at acquisition? If yes, knowledge transfer risk is high.
- How is the product built? (Tech stack from job postings and GitHub)
- Are there any IP encumbrances? (OSS licences in the code base)

**Question 3: Is it priced correctly?**
→ Comparable transaction multiples for legal SaaS at $3M ARR (typically 5-8x ARR for high NRR, 3-4x for average)

I'll find this information from:
- Crunchbase (funding, investors, founding team)
- G2 / Capterra (customer sentiment, competitor comparisons)
- LinkedIn (team size, hiring patterns, leadership backgrounds, departures)
- GitHub (if any open source components)
- Court records check (PACER) for any litigation involving the company or founders
- Job postings (technology stack, growth plans, financial signals)

---
