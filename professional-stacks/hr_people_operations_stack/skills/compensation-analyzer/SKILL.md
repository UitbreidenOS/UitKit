---
name: compensation-analyzer
description: Benchmarks compensation (salary, bonus, equity) against market data. Returns salary range, equity benchmarks, total comp model, and cost impact. Outputs comp-analysis-{role}-{date}.md.
allowed-tools: Read, Write, WebSearch
effort: medium
---

## When to activate

Before finalizing any offer; during compensation market shifts; for equity grants; when evaluating internal promotion or retention packages.

## When NOT to use

Not for headcount forecasting — use hiring-plan-builder. Not for interview process design — use interview-architect. Not for legal/tax advice on equity structures (escalate to legal counsel).

## Compensation Analysis Checklist

Execute in order:

1. **Establish role context** — Title, level, team, location, scope (headcount managed, revenue owned)
2. **Define market data sources** — Levels.fyi, Radford, Salary.com, BLS, PayScale, company-specific peer group
3. **Pull benchmark data** — Salary 25th/50th/75th percentile; bonus range; equity package size
4. **Model total comp** — Salary + bonus + equity (annualized) + benefits; show 1-year, 4-year, and 10-year comp scenarios
5. **Assess internal equity** — Check for compression (new hire earning more than incumbent); flag if problematic
6. **Evaluate cost impact** — Calculate annual spend delta; assess headcount budget impact
7. **Build offer recommendation** — Position within market; justify vs. internal equity and budget constraints
8. **Document assumptions** — Data sources, market definitions, attrition/vesting assumptions

## Data Sources & Methodology

### Primary Sources

| Source | What It Covers | Best For | Limitations |
|--------|---|---|---|
| **Levels.fyi** | Tech company salaries by role, level, company, location | Private tech, real crowdsourced data | Self-reported; likely survivorship bias (happy people more likely to share) |
| **Radford (Aon)** | Enterprise peer benchmarking; public/private companies | Large-scale market analysis; peer group comparisons | Expensive; requires subscription; lags real-time by 6–12 months |
| **PayScale** | General market salary ranges; aggregated by role, experience | Cross-industry benchmarks | May include non-tech roles; less specific to tech |
| **Salary.com / Glassdoor** | Self-reported salary data | Trending; public understanding of ranges | Quality varies; historical data; aggregates across experience levels |
| **BLS (Bureau of Labor Statistics)** | Official government wage data | Legal/regulatory defensibility | Lags real-time by 1+ year; aggregates across industries |

### Market Definition

When benchmarking, define your peer group:
- **Stage:** Pre-seed, Series A/B, C+, late-stage, public
- **Industry:** Tech, Fintech, SaaS, etc.
- **Geography:** SF Bay, NYC, Austin, Seattle, Remote-first; adjust for cost-of-living
- **Headcount:** <50, 50–500, 500+

Example: "Comparable market is Series B/C SaaS companies, 100–300 employees, in tech hubs + remote-first"

## Compensation Framework by Level

### Individual Contributor (IC) Levels

| Level | Title | Market Role | Salary Benchmark | Bonus | Stock Grant | Total Comp |
|-------|-------|---|---|---|---|---|
| **L1** | Engineer, Associate | Entry-level (0–2 years post-college) | $120–150K | 10–15% | $40–60K/yr | $160–210K |
| **L2** | Senior Engineer | 3–6 years; leads small projects | $150–190K | 15–20% | $60–100K/yr | $210–280K |
| **L3** | Staff/Lead Engineer | 6–10 years; drives architecture; mentors | $190–240K | 20–25% | $100–150K/yr | $280–380K |
| **L4** | Principal/Distinguished | 10+ years; industry recognized; strategic | $240–300K | 25–30% | $150–250K/yr | $380–530K |

### Manager Levels

**Manager (5–8 direct reports):**
- Salary: 10–20% premium over IC at comparable level
- Bonus: 20–30% (tied to team outcomes + business goals)
- Stock: Similar to IC; vesting accelerates on promotion
- Total comp: $250–350K (Staff IC → Manager transition)

**Director (15–30 headcount):**
- Salary: $200–280K
- Bonus: 30–40%
- Stock: $150–250K/yr
- Total comp: $350–500K

**VP/Executive:**
- Salary: $250–400K+
- Bonus: 40–60%
- Stock: $250–500K+/yr
- Total comp: $500K–1M+

---

## Total Comp Modeling Framework

**Formula:** Salary + Bonus + Annualized Equity + Benefits

### Equity Assumptions

- **Vesting:** 4-year vest, 1-year cliff (standard)
- **Annual equity value:** Divide grant size by 4
- **Modeled scenarios:**
  - Conservative (50% of grant assumed to vest; assumes some unemployment)
  - Mid (75% of grant)
  - Optimistic (100% of grant; full tenure)

### Example: Staff Engineer Offer

**Offer components:**
- Salary: $210K/year
- Bonus: 20% = $42K/year (if company hits targets)
- Stock grant: $120K total ÷ 4 years = $30K/year annualized
- Health benefits: $24K/year (fully loaded: medical, dental, vision, 401k match)

**Total comp scenarios:**

| Scenario | Year 1 | Year 2 | Year 4 (full vesting) | Year 10 (10-year equity) |
|----------|--------|--------|--------|---------|
| **Conservative (50% vest)** | $270K | $276K | $282K | $312K |
| **Mid (75% vest)** | $282K | $294K | $306K | $366K |
| **Optimistic (100% vest)** | $294K | $312K | $330K | $420K |

*Note: Does not include pre-tax (401k match $6.3K) or bonus variance.*

---

## Internal Equity Audit Framework

### Compression Check

**Compression:** New hire earning more than incumbent for same level/role.

**Why it matters:** Damages morale; signals inequity; risks of retention problems in tenured team.

**Process:**
1. Pull current salary for incumbent at same level/team
2. Compare to new offer
3. If new offer > incumbent by >3%, flag as compression risk
4. Options: Adjust offer down (if possible), budget for raise for incumbent, document business justification

**Example:**
- Current: Senior Engineer on Team A earns $170K (hired 2 years ago)
- New offer: Senior Engineer for Team B at $190K
- Compression risk: +12% (likely problematic)
- Solution: Either offer $175K instead (justify with different location/scope), or budget to raise incumbent to $180K

### Market Position Analysis

Determine your company's positioning strategy:

- **50th percentile (market median):** Competitive; "standard" offer
- **75th percentile:** Premium offer for high-impact roles or talent shortage
- **25th percentile:** Below-market; use only if: early-stage (equity upside), unique culture fit, or role not in hot market

**Recommendation:** Aim for 50–60th percentile for most roles; 70th+ for critical/hard-to-hire roles.

---

## Cost Impact Calculation

### Annual Payroll Impact

**Formula:** (Salary + Bonus) × Fully Loaded Rate + Recruiting Cost + Ramp Loss

| Component | Formula | Example (Staff Engineer) |
|-----------|---------|---|
| Salary | Direct | $210K |
| Bonus | 20% of salary | $42K |
| Benefits (fully loaded) | ~20% of salary | $50.4K |
| Equity (annualized) | $120K ÷ 4 | $30K |
| Recruiting cost (amortized over 2 years) | $6K ÷ 2 | $3K |
| Ramp loss (productivity ramp to 100%) | Salary × (1 - productivity %) | $210K × 10% = $21K (90-day ramp) |
| **TOTAL FULLY LOADED (Year 1)** | | **$356.4K** |

**Note:** This is the true economic cost to the company. Salary alone is ~$252K (59% of total).

---

## Offer Recommendation Template

```markdown
# Compensation Analysis: [Role] — [Name/Candidate ID]

**Date:** [YYYY-MM-DD]
**Role:** [Title, Level]
**Location:** [City / Remote]

---

## Market Benchmarks

**Data sources:** Levels.fyi (n=45), Radford (n=120 comparable companies), Salary.com

**Market definition:** Series B/C SaaS, 100–300 employees, SF Bay + remote-first

**Salary 50th percentile:** $190–210K (range: $170–230K, 25th–75th)
**Bonus range:** 15–20%
**Equity (annualized):** $75–120K/year

---

## Recommendation

**Offer package:**
- Salary: $205K (50–55th percentile, within market)
- Bonus: 18% = $36.9K
- Stock: $100K over 4 years (1-year cliff)
- Start date: [Date]

**Justification:**
- Candidate is strong at technical skills but mid-level on leadership/scope
- Market for this role is tight; recommend slightly above 50th to secure
- Internal equity check: No compression vs. peers at same level

**Cost impact:**
- Fully loaded annual cost: $350K (including benefits, recruiting, ramp)
- Headcount budget: [% of allocated budget for this role]

---

## Scenarios

| Scenario | Salary | Equity/yr | Total Comp (Yr 1) |
|----------|--------|-----------|---|
| Conservative offer (45th %ile) | $190K | $70K | $320K |
| **Recommended (50th %ile)** | **$205K** | **$100K** | **$340K** |
| Competitive (60th %ile) | $220K | $120K | $360K |

---

## Approval Chain

- [ ] Finance: Budget confirmed
- [ ] Manager: Offer terms approved
- [ ] Legal: Equity terms reviewed (if >$1M)

---


```

---

## Market Data Deep Dive: Levels.fyi Example

```
Staff Engineer (L3–L4 equivalent)
Tech: Google, Meta, Apple, Microsoft, Amazon

Salary: $180K–$250K (median $215K)
Bonus: 15–30% (median 20%)
Equity: $100K–$300K (median $150K, 4-year vesting)

Total comp range: $295K–$500K+

By location:
- SF Bay: 25th: $280K, 50th: $350K, 75th: $400K
- NYC: 25th: $260K, 50th: $320K, 75th: $380K
- Remote: 25th: $250K, 50th: $300K, 75th: $350K
```

---

## Red Flags

- **Compression detected:** New hire earning >3% more than incumbent. Action: Adjust offer or budget for raise.
- **Below 25th percentile:** May signal budget constraint or role mismatch. Action: Re-evaluate role scope or recruit plan.
- **Equity cliff mismatch:** High equity with <2 year vesting can create retention cliff. Action: Review vesting terms or communication plan.
- **Geographic arbitrage risk:** Remote hire at same salary as SF-based peer earning 30% less elsewhere. Action: Document market justification or adjust offer.

---
