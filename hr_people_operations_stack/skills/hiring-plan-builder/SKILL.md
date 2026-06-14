---
name: hiring-plan-builder
description: Forecasts 6–12 month hiring needs based on current headcount, business growth targets, attrition forecast, and team structure. Outputs hiring-plan-{quarter}.md with cost modeling and timeline.
allowed-tools: Read, Write, WebSearch
effort: medium
---

## When to activate

Quarterly planning cycle (or on-demand when strategic headcount shifts occur). Requires current workforce data: headcount breakdown by team/level, headcount budget, retention rate, and business growth targets.

## When NOT to use

Not for individual role recruitment — use jd-optimizer and candidate-screener for that. Not for compensation modeling — use compensation-analyzer. Not as a substitute for board-level strategic planning; this skill focuses on operational hiring execution, not business strategy.

## Hiring Plan Checklist

Execute in order:

1. **Establish current state** — Total headcount, breakdown by team (Eng, Product, Sales, Ops, Finance, HR), and level distribution (IC, Manager, Director, Executive)
2. **Input growth targets** — Revenue/user growth percentage; revenue-per-employee assumption; headcount growth % implied
3. **Forecast attrition** — Apply industry benchmark or company historical rate (default: 12% annual voluntary attrition) to estimate replacement hires needed
4. **Identify key gaps** — Skill gaps, span-of-control issues, underleveled teams (too many ICs, not enough managers)
5. **Build hiring priority list** — Rank by business impact (revenue-generating roles first), timeline to productivity, and search difficulty
6. **Model hiring timeline** — Apply time-to-hire benchmark (45–60 days SaaS) to forecast when roles must be posted
7. **Cost modeling** — Calculate fully-loaded cost per hire (salary + benefits + recruiting); project annual payroll delta
8. **Identify hiring risks** — Highlight roles with long search timelines, compensation challenges, or market competition

## Key Metrics to Track

- **Headcount plan vs. actual:** Month-by-month comparison of planned hires vs. actual starts
- **Time-to-hire trend:** Running 3-month average; compare to team baseline and industry benchmark
- **Cost-per-hire:** Amortized recruiting cost (recruiter + tools + job boards); track efficiency
- **Offer-to-accept rate:** Percentage of offers accepted; flag if below 75% (hiring process may have problems)
- **Regrettable attrition:** Who left and why; separate avoidable departures from planned transitions

## Hiring Plan Output Template

```markdown
# Hiring Plan — [Quarter] [Year]

**Prepared:** [date]
**Planning Horizon:** [e.g., Q3 2026 – Q2 2027]
**Current Headcount:** [X]
**Projected Headcount (end of period):** [Y]
**Total New Hires:** [Y - X]

---

## Business Context

[2–3 sentences: revenue growth target, product launches, expansion plans, strategic initiatives that drive hiring]

---

## Current Headcount Snapshot

| Team | IC (L1/L2) | IC (L3+) | Manager | Director | VP | Total |
|------|-----------|----------|---------|----------|-----|-------|
| Engineering | 12 | 4 | 2 | 1 | 1 | 20 |
| Product | 3 | 2 | 1 | 0 | 0 | 6 |
| Sales | 0 | 0 | 0 | 1 | 1 | 2 |
| Marketing | 2 | 1 | 1 | 0 | 0 | 4 |
| Operations | 1 | 0 | 1 | 0 | 0 | 2 |
| Finance | 1 | 0 | 0 | 0 | 0 | 1 |
| **TOTAL** | **19** | **7** | **5** | **2** | **2** | **35** |

---

## Attrition Forecast

**Assumed annual attrition rate:** 12% (company historical; SaaS benchmark 13%)

**Replacement hires needed:** 35 × 12% = ~4 FTE over 12 months

**Regrettable vs. non-regrettable:**
- Expected departures: [Names/reasons if known — retirement, relocation, etc.]
- High-risk flight risk: [Teams or individuals showing early warning signs]

---

## Hiring Plan by Quarter

### [Q3 2026]

| Role | Team | Level | Priority | Reason | Target Start | Notes |
|------|------|-------|----------|--------|--------------|-------|
| Staff Engineer | Eng | L3 | P0 | Tech debt + scaling | Aug 2026 | High search difficulty; lead time 90 days |
| Product Manager | Product | L2 | P1 | Platform roadmap | Sept 2026 | Strong internal pipeline; may promote from IC |
| Solutions Engineer | Sales | L2 | P0 | Customer expansion | Aug 2026 | Support new sales hires |
| **Subtotal (Q3)** | | | | | | **3 hires** |

### [Q4 2026]

| Role | Team | Level | Priority | Reason | Target Start | Notes |
|------|------|-------|----------|--------|--------------|-------|
| Attrition replacement | [TBD] | L1–L2 | P1 | 12-month cycle | Oct 2026 | Watch for early departures signals |
| Sales Development Rep | Sales | L1 | P1 | Pipeline generation | Nov 2026 | High-volume hire; use sourcing partners |
| **Subtotal (Q4)** | | | | | | **2 hires** |

---

## Hiring Timeline

**Lead-time calculation** (for planning job posts):
- Roles with 90+ day searches: Post in [Month - 3]
- Roles with 60 day searches: Post in [Month - 2]
- Roles with 45 day searches: Post in [Month - 1.5]

| Role | Days to Hire (Benchmark) | Post Date | Target Start | Notes |
|------|------------------------|-----------|--------------|-------|
| Staff Engineer | 90 days | May 2026 | Aug 2026 | Rare skill set; expect 200+ applications |
| Product Manager | 60 days | July 2026 | Sept 2026 | Strong market candidates available |
| Solutions Engineer | 60 days | June 2026 | Aug 2026 | Sales-facing role; internal referral encouraged |

---

## Cost Modeling

**Assumptions:**
- Average salary (all roles, blended): $140K
- Average benefits cost: $28K (20% of salary)
- Average stock grant: $50K/year (assuming 4-year vesting)
- Recruiting cost per hire: $6K (recruiter salary amortized + tools + job boards)
- Ramp-to-productivity: 90 days (IC), 120 days (Manager)
- Replacement cycle cost: $35K fully loaded (salary + benefits + stock + recruiting)

**Projected annual payroll impact:**

| Category | Count | Unit Cost | Total |
|----------|-------|-----------|-------|
| New hires (5 FTE) | 5 | $218K | $1,090K |
| Attrition replacement (4 FTE) | 4 | $218K | $872K |
| Headcount growth (1 FTE net) | 1 | $218K | $218K |
| **Total Payroll Delta** | | | **$2,180K** |
| **Recruiting costs (total hires)** | 9 | $6K | $54K |
| **TOTAL FULLY LOADED** | | | **$2,234K** |

---

## Hiring Risk Assessment

### High-Risk Searches (90+ day timeline)

- **Staff Engineer** — Rare skill set; likely competitor-employed; expect 10–15 candidates to screen, 3–5 to interview. Mitigation: Start sourcing immediately; offer referral bonus.
- **Product Manager** — Internal promotion may be faster; evaluate internal candidates first.

### Span-of-Control Issues

- **Engineering:** 2 managers overseeing 16 ICs. Recommend promoting 1 senior IC to manager role (train internally) or hiring manager within 6 months.
- **Sales:** 1 VP managing 2 ICs + 1 SDR. Healthy 3:1 ratio; OK to scale to 6–8 ICs before manager hire.

### Compensation Risk

- **Staff Engineer:** Market rate $180–220K salary + $75–100K stock. May need to budget above company standard to compete. Recommend benchmarking before posting.

---

## Key Metrics & Monitoring

| Metric | Target | How to Track |
|--------|--------|--------------|
| **Time-to-hire** | 45–60 days | Calendar days from post to offer accepted |
| **Offer-to-accept rate** | >75% | Track offers made vs. accepted |
| **Quality of hire** | Retention >80% at 1 year; performance rating >3/5 | Monitor by cohort |
| **Cost-per-hire** | <$8K | Total recruiting spend ÷ hires |
| **Attrition vs. plan** | Within 2% of forecast | Monthly headcount tracking |

---

## Next Steps

- [ ] Share this plan with leadership for approval (budget, headcount green light)
- [ ] Post high-risk roles immediately (Staff Engineer, etc.)
- [ ] Identify internal promotion candidates (Product Manager, manager-track ICs)
- [ ] Set up ATS tracking for time-to-hire, applications, and conversion rate
- [ ] Quarterly review and reforecasting (actual attrition, hiring velocity vs. plan)

---
