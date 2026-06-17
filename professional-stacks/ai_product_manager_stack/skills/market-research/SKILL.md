# Market Research

## When to activate

You need to quantify a market opportunity (TAM/SAM/SOM), define addressable segments, identify trend vectors, or validate that a market is worth entering. Use this skill for new product launches, market entry decisions, pricing strategy, or GTM planning.

---

## When NOT to use

- For analyzing specific competitor products (use Competitive Analysis instead)
- When you need user-level insights (use User Research Synthesis instead)
- For go-to-market channel optimization (that's Sales/Marketing, not product research)
- If you're just hunting for hype or trend-spotting without rigor (invest in primary research first)

---

## Instructions

### Step 1: Define the Market Boundary

**Core questions:**
- What is the customer's **core job to be done**? (Not your solution, the underlying need)
- Who are the **personas** that need this job done?
- What **alternative solutions** exist today?
- In what **geographies** does this job exist?
- Is this a **new market**, an **existing market shift**, or a **wedge into existing market**?

**Example: AI Ops Platform**
```
Job: Reduce MTTR and operational complexity for ML/AI infrastructure teams
Personas: ML Ops engineers, platform engineers, SREs
Alternatives: Manual scripting, Datadog, New Relic, homegrown tools
Geography: Initial focus on North America; EU secondary
Market type: New tool category within DevOps (wedge)
```

### Step 2: Gather Market Data

**Primary sources** (weighted heavily):
- **Customer interviews** (5-10 customers, 30 min each)
  - "How do you solve this today?"
  - "What's broken about your current approach?"
  - "Would you pay for a solution? How much?"
  - "Who else in your org needs this?"
- **Sales/CS conversations** (if you have existing customers)
  - "How big are prospects?" (headcount, revenue)
  - "Which verticals show highest demand?"
  - "What's the typical buying process?"
  - "Who's the buyer (engineer, manager, VP)?"

**Secondary sources** (validate, supplement):
- **Analyst reports** (Gartner, IDC, Forrester quadrants)
- **Public filings** (annual reports of comparable companies)
- **Job postings** (infer company size, hiring intensity by role)
- **VC/M&A activity** (signal of investor confidence)
- **Industry surveys** (standard research from analyst firms)

**Example data table:**
```
| Source | Data Point | Value | Confidence |
|--------|-----------|-------|------------|
| Gartner | DevOps Tools Market | $8.2B (2025) | High |
| IDC | AI Ops segment growth | 28% CAGR 2025-2029 | Medium |
| Interviews | Avg budget per company | $80-150K/year | High (n=7) |
| Job postings | ML Ops hiring (LinkedIn) | 3,200 open roles (NA) | Medium |
| VC | Series A funding (AI Ops) | $20-40M average | High (recent) |
```

### Step 3: Size the TAM (Total Addressable Market)

**Formula:**
```
TAM = (Number of potential customers) × (Average selling price)
    OR
TAM = (Serviceable population) × (% who need solution) × (Willingness to pay)
```

**Method 1: Bottom-up (from customer data)**
```
TAM (Bottom-up):
  Potential customers: 50,000 ML/AI ops teams globally
  Average contract value: $100K/year
  TAM = 50,000 × $100K = $5B
  Confidence: Medium (limited sample size n=7)
```

**Method 2: Top-down (from analyst data)**
```
TAM (Top-down):
  DevOps Tools Market (Gartner 2025): $8.2B
  AI Ops subset (estimated 25-30% of DevOps): $2.0-2.5B
  Confidence: Medium (segment % is estimate)
```

**Method 3: Analogy (comparable markets)**
```
TAM (Analogy):
  Datadog's current market (observability): $5B+
  AI Ops is emerging subset: Conservative 15% of Datadog TAM
  TAM = $5B × 0.15 = $750M
  Confidence: Low (assumes Datadog-equivalent adoption)
```

**Triangulate and estimate range:**
```
TAM Estimate Range: $2-5B (geometric mean: ~$3B)
  Bottom-up: $5B
  Top-down: $2-2.5B
  Analogy: $0.75B

Best estimate: $3B
Confidence: Medium
Rationale: Bottom-up matches analyst trends; top-down is conservative
```

### Step 4: Size the SAM (Serviceable Addressable Market)

**SAM = What we can realistically capture given competition & channels**

**Constraints to model:**
- Geographic coverage (can we serve EU, APAC?)
- Vertical focus (are we going broad or vertical-specific?)
- Company size (SMB only, or enterprise too?)
- Sales motion (self-serve SaaS, direct sales, partnerships?)

**Example calculation:**
```
TAM: $3B (global)

Geographic constraint: North America first (50% of TAM)
  → $1.5B

Vertical constraint: Focused on AI/ML teams (not all DevOps)
  → 40% of DevOps (conservative)
  → $600M

Company size: Mid-market + Enterprise (exclude micro SMB)
  → 70% of target market
  → $420M

SAM Estimate: $400-500M (use $450M)
Confidence: Medium
```

### Step 5: Size the SOM (Serviceable Obtainable Market)

**SOM = What we can capture in Year 1 given our GTM, team, capital**

**Model: Top-down from market conversion**
```
Total addressable customers in SAM: 5,000 companies
Year 1 sales & marketing spend: $2M
Cost per acquisition: $15K (typical for B2B SaaS, sales cycle)
Theoretical new customers: 2M / 15K = 133 customers
Average contract value: $100K
SOM (Revenue): 133 × $100K = $13.3M

Realistic penetration: 133 / 5,000 = 2.7% of SAM
Conservative adjustment (realistic): 1-2% of SAM
SOM (Revenue): $450M × 0.015 = $6.75M
```

**Model: Bottom-up from capacity**
```
Sales team: 3 AEs
Sales cycle: 3-4 months
Deals per AE per year: ~4 deals
Total new customers: 3 AEs × 4 = 12 customers
Average contract value: $100K
SOM (Revenue): 12 × $100K = $1.2M

Upsell from existing: 8 customers × $20K = $160K
Total SOM Year 1: ~$1.4M (very conservative)
```

**Reconcile:**
```
Capacity-based (bottom-up): $1.4M
Market-based (top-down): $6.75M

Choose: $2-3M (realistic given execution risk & ramp)
Confidence: Medium-High (based on team capacity)

This assumes:
  - 3 AEs fully productive by Q2
  - $2M marketing spend generates 20-30 SQLs/month
  - 30% close rate
  - $100K ACV
```

### Step 6: Build Market Segments

**Segment the SAM by:]**
- **Firmographics** (company size, industry, geography)
- **Behavioral** (adoption speed, budget, purchase frequency)
- **Psychographic** (tech-savvy, willing to take risk)

**Example segmentation:**
```
Market Segment Analysis

Segment 1: Scale-ups (50-500 people)
  Size: 2,000 companies (NA, tech/SaaS focus)
  Pain: Rapid infrastructure growth, limited ops resources
  Budget: $50-100K/year
  Sales cycle: 6-8 weeks
  Adoption: Fast (scrappy culture)
  Segment TAM: 2,000 × $75K = $150M

Segment 2: Enterprise (1000+ people)
  Size: 500 companies (NA, multi-industry)
  Pain: Regulation, complex infrastructure, 99.99% SLA
  Budget: $200-500K/year
  Sales cycle: 4-6 months (RFP process)
  Adoption: Slow (change management)
  Segment TAM: 500 × $350K = $175M

Segment 3: Mid-market (200-1000 people)
  Size: 3,000 companies (NA, tech-focused)
  Pain: Scaling without hiring ops team
  Budget: $75-150K/year
  Sales cycle: 8-12 weeks
  Adoption: Moderate (balanced agility & process)
  Segment TAM: 3,000 × $112K = $336M

Total SAM: $150M + $175M + $336M = $661M (rough)
```

**Year 1 SOM by segment:**
```
Segment | Customers (Target) | ACV | Revenue | % of Year 1 |
---------|-------------------|-----|---------|-------------|
Scale-ups | 8 | $75K | $600K | 30% |
Enterprise | 2 | $350K | $700K | 35% |
Mid-market | 10 | $112K | $1.12M | 35% |
Total | 20 | — | $2.42M | 100% |

Note: Assumes sales ramp; Q1 low, Q4 high.
Confidence: Medium (model sensitivity to conversion assumptions)
```

### Step 7: Map Trends & Inflection Points

**Identify macro trends driving market growth:**

```
Trend 1: AI/ML Model Proliferation
  Signal: 3.2M open PRs on Hugging Face; 500+ new models/month
  Implication: Every company now has AI ops problem
  Timeline: Happening now (2026)
  Positive for us: YES (expands TAM)

Trend 2: Adoption of Multi-Model Strategies
  Signal: 78% of enterprises using 3+ LLMs (survey)
  Implication: Model ops becomes critical, not optional
  Timeline: 2026-2027
  Positive for us: YES (drives MTTR requirement)

Trend 3: Regulatory Tightening (EU AI Act, etc.)
  Signal: NIST AI RMF, EU regulatory pressure
  Implication: Companies need audit trails, observability
  Timeline: 2026+ (staggered by region)
  Positive for us: MAYBE (creates new use case: compliance)

Trend 4: LLM Cost Scaling (inference cost drops 50% annually)
  Signal: Claude 3.5 pricing, GPT-4 rate drops, open models improving
  Implication: Inference becomes cheap; ops becomes expensive (relative)
  Timeline: 2026+
  Positive for us: YES (ROI of optimization tools improves)
```

**Market inflection points (betting on these):**
```
If True: AI Ops becomes table-stakes → TAM grows 5x by 2028
If False: DevOps incumbents (Datadog) capture AI Ops → TAM compressed

Key metric to watch: Adoption rate of multi-model ops (industry surveys)
Decision point: If <10% adoption by Q4 2026, reduce SOM forecast
```

### Step 8: Create Market Research Deliverable

**Format: Market Report (5-10 pages)**

```markdown
# Market Research: AI Operations Intelligence Platform

## Executive Summary

**Opportunity:** $3B TAM; 2.7B SAM; $2.4M Year 1 SOM opportunity in AI Ops tooling.

**Market timing:** Inflection point driven by multi-model adoption (78% of enterprises), 
regulatory pressure (EU AI Act), and infrastructure complexity growth (>50% YoY).

**Confidence:** Medium-High on TAM (analyst consensus); Medium on SAM penetration 
(new market, execution-dependent).

**Recommendation:** Proceed with market entry; validate Segment 1 (scale-ups) in Q2 
with pilot customers. If 3+ pilots land in Q2, accelerate GTM in Q3.

---

## Market Size

### TAM (Total Addressable Market): $3B

Global market for AI infrastructure observability, optimization, and governance tools.

**Derivation:**
- Bottom-up (from interviews): 50K ML ops teams × $100K ACV = $5B
- Top-down (from analyst data): DevOps Tools ($8.2B) × 25% AI Ops = $2-2.5B
- Analogy (Datadog): $5B × 15% = $750M
- Triangulation: $3B (median of range)

**Confidence:** Medium (analyst consensus on DevOps market strong; AI Ops % is estimate)

### SAM (Serviceable Addressable Market): $450M

Realistic addressable market given our geography (NA-first), verticalization (AI/ML), 
and company size (mid-market+).

**Constraints:**
- Geography: NA only (50% of TAM) = $1.5B
- Verticals: Tech, AI-native companies (40% of DevOps) = $600M
- Company size: Mid-market+ (70% of target) = $420M
- **SAM: $400-500M (use $450M)**

### SOM (Serviceable Obtainable Market): $2.4M (Year 1)

Conservative estimate based on sales capacity, marketing investment, and realistic 
conversion rates for new market category.

**Model:** 20 customer acquisitions in Year 1 at $100K ACV = $2M
(Add: $400K from upsell, expansion) = $2.4M

**Confidence:** High (based on team capacity constraints, not market)

---

## Market Segments

| Segment | Size | Pain | Budget | Sales Cycle | Priority |
|---------|------|------|--------|-------------|----------|
| **Scale-ups (50-500 pp)** | 2,000 | Rapid growth + limited ops | $50-100K | 6-8 weeks | 1 |
| **Mid-market (200-1K pp)** | 3,000 | Scaling without hiring | $75-150K | 8-12 weeks | 2 |
| **Enterprise (1K+ pp)** | 500 | Regulation + complexity | $200-500K | 4-6 months | 3 |

**Year 1 focus:** Scale-ups (faster sales cycle, proven demand, reference customers).

---

## Market Trends & Growth Drivers

1. **Multi-Model Adoption (78% of enterprises)**
   - 78% of enterprises now use 3+ LLMs (survey, 2025)
   - Implication: Model ops complexity → demand for tooling
   - Timeline: Present; accelerating through 2027

2. **AI Regulation & Compliance (NIST RMF, EU AI Act)**
   - NIST AI Risk Management Framework (voluntary, 2024+)
   - EU AI Act enforcement begins (2026)
   - Implication: Audit trails, governance, monitoring become mandatory
   - Timeline: 2026+ (staggered by region)

3. **Infrastructure Cost Scaling**
   - Inference cost dropping ~50% annually (Claude 3.5, GPT-4 rate cuts)
   - Implication: Optimization & ops overhead become 40-60% of TCO
   - Timeline: Present; becoming critical in 2026-2027

4. **Rapid Model Innovation**
   - 500+ new open models/month; major releases every 2-4 weeks
   - Implication: Version management, A/B testing, model ops infrastructure needed
   - Timeline: Accelerating now

---

## Competitive Landscape

Current alternatives (no direct incumbent):
- **Observability platforms:** Datadog, New Relic (don't have AI Ops module yet)
- **LLM platforms:** OpenAI, Anthropic (tooling for their own models; not multi-model)
- **Homegrown/scripted:** 85% of enterprises (high switching cost if we're clearly better)

**Window of opportunity:** 18-24 months before incumbents add AI Ops modules. 
Focus on being indispensable to early adopters.

---

## Validation Plan (Next 90 days)

- [ ] 10 customer interviews (scale-ups, segment 1): JTBD, willingness to pay, buying process
- [ ] TAM refinement: Adjust based on interview findings (target: narrow confidence interval)
- [ ] 3 pilot customers (free or freemium): Validate product-market fit signals
- [ ] Sales motion prototype: Run 1 sales cycle (end-to-end) with one prospect
- [ ] Competitive monitoring: Any announcements from Datadog, New Relic, or AI startups?

**Go/No-Go decision point (90 days):**
- If 5+ of 10 interviews confirm strong pain + willingness to pay → PROCEED
- If pilots show 60%+ feature adoption, positive feedback → ACCELERATE
- If competitors announce AI Ops module → PIVOT (go deeper, be exceptional)

---

## Financial Forecast (Year 1-3)

| Year | Customers | ACV | Revenue | Gross Margin | CAC | CAC Payback |
|------|-----------|-----|---------|--------------|-----|-------------|
| 2026 | 20 | $100K | $2.0M | 65% | $25K | 5 months |
| 2027 | 65 | $110K | $7.2M | 70% | $20K | 4 months |
| 2028 | 150 | $120K | $18.0M | 72% | $18K | 3.5 months |

**Assumes:**
- Year 1: 3 AEs, heavy marketing investment, brand building
- Year 2-3: Sales team scales to 8+ AEs, marketing efficiency improves
- Retention: 90%+ net retention (land-and-expand model)

---

## Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Incumbent consolidation** | High | High | Differentiate on AI specialization; move fast (18-month window) |
| **Open-source tools capture market** | Medium | Medium | Focus on UX/ease-of-use; build community; offer managed version |
| **Regulatory delays (EU AI Act enforcement)** | Medium | Low | Don't depend on regulation-driven demand; lead on voluntary compliance |
| **Price elasticity (customers resist $100K+ ACV)** | Low | High | Validate pricing with 5+ customers; offer tiered model if needed |
| **Sales cycle longer than model (4-6 months vs. 8-12 weeks)** | Medium | High | Run 3 sales cycles in parallel; get early closes to reduce risk |

---

## Recommendation

**Proceed with market entry. Confidence Level: 7/10**

**Rationale:**
1. TAM is large ($3B) and growing (3x over 5 years)
2. Market inflection points align (multi-model adoption, regulation)
3. No direct incumbent (window of opportunity 18-24 months)
4. Customer demand signals are strong (from interviews)
5. Team can execute Year 1 SOM ($2.4M) with current capacity

**Conditions:**
- Validate 5+ customers in Q2 (strong JTBD signals)
- Achieve 60%+ feature adoption in 3 pilots
- No major competitive announcement in next 60 days
- Year 1 bookings hit $2M+ (proves model assumptions)

**Next gate: 90-day validation gate (mid-August). Reassess if conditions met.**

---

**Report prepared:** June 15, 2026  
**Data sources:** 7 customer interviews, Gartner DevOps Platform report, IDC AI Ops forecasts  
**Confidence interval (financial):** 70% (±$600K revenue range)  
**Review frequency:** Quarterly (update TAM, SOM, competitive landscape)
```

---

## Example

Real-world AI Ops platform market research (2026):
- TAM: $3B (derived from $8.2B DevOps market × 25-30% AI Ops penetration)
- SAM: $450M (after geography, vertical, company size filters)
- SOM: $2.4M Year 1 (20 customers at $100K ACV)
- Key segment: Scale-ups (50-500 people) due to faster sales cycle & higher pain
- Inflection point: Multi-model adoption (78% of enterprises by 2025) driving urgency
- Risk: Datadog/New Relic add AI Ops modules within 18-24 months; move fast

---

## Tools & Templates

**TAM Estimation Template:**
```
Method 1 (Bottom-up):
  Customers: [X]
  ACV: [Y]
  TAM = X × Y

Method 2 (Top-down):
  Total addressable market: [M]
  Your segment %: [P%]
  TAM = M × P%

Method 3 (Analogy):
  Comparable market size: [N]
  Your market / comparable: [Ratio]
  TAM = N × Ratio
```

**Segment prioritization matrix:**
```
Segment | Size | Growth | Margin | Pain | Sales Cycle | Priority |
---------|------|--------|--------|------|-------------|----------|
[Name] | [S] | [%] | [M%] | [H/M/L] | [Weeks] | [Rank] |
```

