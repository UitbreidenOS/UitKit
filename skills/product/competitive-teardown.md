---
name: competitive-teardown
description: "Competitive analysis: structured teardown of competitor products, positioning, pricing, and go-to-market — identify gaps, differentiation levers, and strategic positioning"
updated: 2026-06-13
---

# Competitive Teardown Skill

## When to activate
- Analysing a specific competitor before a product decision
- Identifying your category's competitive landscape from scratch
- Building a battle card for sales
- Finding underserved positioning white space in a crowded market
- Evaluating a new market before entering
- Preparing for a board or investor presentation on competition

## When NOT to use
- Pricing research only — use the pricing-strategy skill
- Customer win/loss analysis (need real deal data) — this is qualitative competitive intelligence
- Legal competitive benchmarking — use the legal skill
- Real-time monitoring of competitor activity — use web search directly

## Instructions

### Full competitor teardown

```
Do a structured teardown of [competitor].

Competitor: [name + URL]
Our product: [name + URL]
Why this competitor matters: [direct competitor / adjacent / aspirational]

Teardown dimensions:

1. Positioning and messaging:
   - What do they claim on their homepage hero?
   - Who do they say they're for (explicit ICP)?
   - What category do they position in?
   - What's their key differentiator claim?
   - What emotion do they lead with (fear / aspiration / trust / efficiency)?

2. Product:
   - Core functionality (what it does)
   - Key features visible from public product + docs
   - Missing obvious features (what they don't do)
   - Integration ecosystem (what they connect to)
   - Mobile app? Desktop app? API-only?

3. Pricing:
   - Model (flat / per-seat / usage-based / freemium / enterprise-only)
   - Tiers and prices (if public)
   - Free trial or freemium available?
   - What's behind the paywall?

4. Go-to-market:
   - Primary acquisition channel (SEO / paid / PLG / sales-led / community)
   - Content strategy (blog topics, YouTube presence, podcast)
   - Partnerships and integrations as distribution
   - Sales model (self-serve / inside sales / field sales)
   - Target company size (SMB / mid-market / enterprise)

5. Strengths and weaknesses:
   - 3-5 things they do better than us
   - 3-5 things they do worse or don't do at all
   - Their positioning vulnerability (where they can't credibly compete)

6. Customer sentiment (from review sites — G2, Capterra, Reddit):
   - Top complaints (what customers don't like)
   - Top praise (what customers love most)
   - Common switching reasons (why customers leave them)

Output: teardown summary + 3 strategic implications for our product or positioning.
```

### Competitive landscape map

```
Map the competitive landscape for [category].

Category: [describe the problem space — e.g. "project management for engineering teams"]
Our product: [name]
Known competitors: [list — or "identify them"]

Landscape mapping:

Step 1 — Identify all competitors:
- Direct: solve the same problem for the same customer
- Indirect: solve the same problem differently (e.g. Excel as a competitor to any SaaS)
- Adjacent: solve a related problem that overlaps with ours
- Emerging: new entrants or category creators

Step 2 — Position on two axes (choose the most strategic dimensions):
   Axis 1: [e.g. Simple ← → Powerful]
   Axis 2: [e.g. SMB-focused ← → Enterprise-focused]
   
   Place each competitor on this 2x2.
   Find: where is the whitespace? Where is our positioning?

Step 3 — Category dynamics:
   - Who is the category leader (most awareness)?
   - Who is growing fastest?
   - Who is declining?
   - Is the category consolidating or fragmenting?

Step 4 — Strategic implications:
   - Can we own a segment the leader ignores?
   - Is there an underserved persona?
   - Is there a feature combination nobody does well together?

Produce: landscape map description + 3 positioning opportunities we could own.
```

### Battle card

```
Build a sales battle card against [competitor].

Competitor: [name]
Our most common competitive scenario: [where we win / where we lose]
Target user: [who we're selling to, their role]
Key objection from this competitor: ["Why not just use [competitor]?"]

Battle card structure:

1. ONE-LINE DIFFERENTIATOR (for the rep to say in < 10 seconds):
   "[Our product] does X, [competitor] doesn't because [structural reason]."

2. WHERE WE WIN (3 bullets — concrete, not generic):
   □ [Specific feature or capability they lack] → customer benefit
   □ [Pricing or model advantage] → what customer saves or avoids
   □ [Integration or workflow advantage] → specific workflow they care about

3. WHERE THEY WIN (be honest — 2 bullets):
   □ [Thing they do better] — "If this is their top priority, they may be right to choose [competitor]"
   □ [Strength we don't have] — acknowledge it, then redirect

4. HOW TO FLIP IT:
   For each competitor strength, the redirect:
   "[Competitor] has [strength], but the cost is [trade-off they pay]. Our customers find that [our approach] is better because [specific reason]."

5. PROOF POINTS:
   - Customer quote: "[Exact quote about why they chose us over competitor]" — [Role, Company]
   - Win story: [2-sentence story of a deal we won against them]
   - Data point: [stat that shows our advantage — speed, NPS, retention, whatever]

6. LANDMINES TO PLANT:
   Questions the rep should ask to surface competitor weaknesses:
   - "How important is [our strength] to you?"
   - "Have you ever experienced [competitor's weakness]?"
   - "What happens when you need [thing they don't do]?"

Write the battle card for my specific competitor.
```

### Win/loss analysis

```
Design a win/loss analysis process for [company].

Current state: [no win/loss tracking / ad-hoc / systematic]
Sales cycle: [self-serve / inside sales / enterprise]
Deal volume: [X deals/month]

Win/loss framework:

1. Who to interview:
   - Won deals: interview 30-60 days after close (honeymoon is over, real reasons surface)
   - Lost deals: interview within 2 weeks (memory fades, competitors move in)
   - Interview the actual buyer, not the champion — the economic buyer's rationale differs

2. Win interview questions:
   - "What made you choose us over the alternatives?"
   - "What almost made you choose someone else?"
   - "What would have made you NOT choose us?"
   - "What feature or moment confirmed we were right?"
   - "What do you tell colleagues when you recommend us?"

3. Loss interview questions:
   - "What made you choose [competitor / nothing] instead?"
   - "What did we do well in the process?"
   - "Was it product, pricing, process, or timing?"
   - "What would have needed to be different for you to choose us?"
   - "Is the door open in the future? What would need to change?"

4. Analysis cadence:
   - Monthly: win/loss rate by competitor, by segment, by deal size
   - Quarterly: theme synthesis → product gaps, positioning adjustments
   - Annual: full landscape review

5. Output format:
   - Win reasons (top 3) + % frequency
   - Loss reasons (top 3) + % frequency
   - Competitor-specific patterns
   - Product gap heat map (what customers wanted that we didn't have)

Set up this process for my sales motion and team size.
```

## Example

**User:** We build internal developer tools. Notion just launched developer docs. Should we be worried? Do a teardown.

**Claude's strategic framing:**

Notion entering your space is a threat to the low end (small teams, low budget) but creates an opportunity at the high end (where Notion will always be "good enough" rather than purpose-built).

**Notion's structural constraints (things they can't change):**
1. Horizontal product — can't go deep on developer-specific features (code review, PR integration, deployment docs) without alienating their non-dev users
2. Block-based editor — great for structured docs, poor for API reference or auto-generated docs from code
3. No native code indexing — they can't pull from your codebase and keep docs in sync automatically
4. Enterprise developer tooling requires SSO/SCIM, audit logs, git integration — Notion's enterprise is designed for HR and ops, not platform teams

**Where you should immediately differentiate:**
- Auto-sync with code (docs that update when code changes — Notion can't do this without breaking their model)
- Developer-native formats: OpenAPI rendering, code playground, changelog from git commits
- IDE integration (VS Code, JetBrains — Notion has no play here)

**Your messaging response:**
Don't mention Notion by name. Instead:
Hero: "Documentation that stays in sync with your code — automatically."
This is the thing Notion structurally cannot offer, framed as a benefit (not a comparison).

**Verdict:** Worry about Notion taking the SMB segment you were going to acquire. Don't worry about them taking your existing enterprise or mid-market customers who need depth.

---
