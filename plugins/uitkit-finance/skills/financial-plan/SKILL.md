---
name: "financial-plan"
description: "Wealth management financial planning: cash flow analysis, retirement projections, education funding, estate checklist — for individuals and families"
---

# Financial Plan Skill

## When to activate
- Building a comprehensive financial plan for a client or yourself
- Running a retirement savings projection (how much is enough?)
- Modelling education funding (529 plan, target amounts)
- Reviewing insurance coverage gaps
- Creating an estate planning checklist
- Stress-testing a financial plan against market downturns or job loss

## When NOT to use
- Specific investment recommendations — requires a licensed financial advisor
- Tax filing or tax advice — consult a CPA or tax attorney
- Legal documents (wills, trusts) — requires an estate attorney

## ⚠️ Important

Financial planning projections are based on assumptions about returns, inflation, and life events. All projections carry material uncertainty. `[VERIFY]` all outputs with a licensed financial planner. Claude helps structure the analysis — it does not give regulated financial advice.

## Instructions

### Step 1 — Financial snapshot

```
Build a financial snapshot for:

Current situation:
- Age: [X], target retirement age: [X]
- Current income: $[X]/year gross, $[X]/year take-home
- Partner income (if applicable): $[X]
- Current savings: 
  - 401(k)/IRA: $[X]
  - Taxable brokerage: $[X]
  - Cash/emergency fund: $[X]
  - Other: $[X]
- Monthly expenses: $[X] (or list major categories)
- Monthly savings rate: $[X]
- Current debt: mortgage $[X], student loans $[X], other $[X]
- Home equity: $[X]

Goals:
- Retirement at age [X]
- Children's college funding: [X] children, ages [X, X]
- Major purchases: [list]
- Other goals: [describe]
```

### Step 2 — Retirement projection

```
Project retirement readiness.

Inputs:
- Current age: [X], retirement age: [X] = [X] years to retirement
- Current retirement savings: $[X]
- Monthly contributions: $[X]
- Expected annual return: [X]% (use conservative 6-7% for long-term equity portfolio)
- Expected inflation: 3%
- Estimated Social Security at retirement: $[X]/month (check SSA.gov)
- Expected retirement expenses: $[X]/month in today's dollars

Project:
1. Future value of current savings at retirement
2. Future value of ongoing contributions
3. Total retirement assets at [retirement age]
4. Sustainable withdrawal rate (4% rule: assets × 4% = annual income)
5. Comparison to target: gap or surplus?
6. Monte Carlo: at what probability do I not run out of money?

[VERIFY] projections with a licensed financial planner.
```

### Step 3 — Education funding

```
Model education funding for [X] children.

Child 1: Age [X], estimated college start: [year]
Target: [in-state public / private / Ivy League]
Current costs (today's dollars): [in-state ~$25-30K/year, private ~$60-80K/year, Ivy ~$85K+/year]
4-year total (today's dollars): $[X]
Education inflation rate: ~5% per year

Current 529 balance: $[X]
Monthly contributions to 529: $[X]
Assumed return in 529: [X]% (typically 6-8% equity-heavy when child is young)

Calculate:
1. Projected 4-year cost when child starts college
2. Projected 529 balance at college start
3. Funding gap (if any)
4. Monthly contribution needed to fully fund

[VERIFY] projections with a college planning specialist.
```

### Step 4 — Insurance gap analysis

```
Review my insurance coverage for gaps:

Current coverage:
- Life insurance: $[X] (term / whole life, term ends [year])
- Disability insurance: [X]% income replacement, [X]-day elimination period
- Health insurance: [deductible], [out-of-pocket max]
- Homeowner's/renter's insurance: $[X] coverage
- Umbrella policy: $[X] or none
- Long-term care insurance: yes / no

Profile:
- Dependents: [X]
- Income: $[X]
- Debts: $[X]
- Assets: $[X]

Identify:
1. Life insurance adequacy (rule of thumb: 10-12x income)
2. Disability coverage (do I have enough?)
3. Long-term care need (typically relevant at 50+)
4. Umbrella policy need (typically: if net worth > $500K or professional liability risk)
```

### Step 5 — Estate planning checklist

```
Review my estate planning status:

Current documents:
- Will: [yes/no/outdated]
- Living trust: [yes/no]
- Power of attorney: [yes/no]
- Healthcare directive / living will: [yes/no]
- Beneficiary designations reviewed: [yes/no, last updated: year]
- Life insurance payable to: [estate / trust / named beneficiary]

Family situation:
- Married: [yes/no], spouse is US citizen: [yes/no]
- Minor children: [yes/no]
- Blended family / step-children: [yes/no]
- Special needs dependents: [yes/no]
- Estimated estate value: $[X]

Flag:
1. What's missing and why it matters
2. Estate tax exposure (federal: estates > ~$13M; some states lower)
3. Whether a trust is warranted
4. Beneficiary designation misalignments

[VERIFY] with an estate planning attorney.
```

## Example

**User:** Age 38, married, two kids (6 and 4), $180K household income, $250K in 401(k), $0 in 529, mortgage $400K, want to retire at 62.

**Claude's analysis:**

**Retirement (24 years):**
$250K growing at 7% + $1,500/month contributions → ~$2.1M at 62 [VERIFY]
4% rule → $84K/year + Social Security → likely sufficient for $120K target spend

**Education (12 and 14 years):**
2 kids × $400K (private college, projected) = $800K needed [VERIFY]
$0 in 529 + 12-14 years → need ~$1,400/month in 529 for both children
Or: $700/month per child starting now

**Retirement vs. education priority:**
Both are achievable at current income. Priority: max 401(k) to employer match first, then 529, then additional retirement.

**Immediate actions:**
1. Open 529 for both children this week
2. Review life insurance (current: unknown — check if 10x income = $1.8M covered)
3. Draft will and healthcare directive (no document mentioned — critical with minor children)

---
