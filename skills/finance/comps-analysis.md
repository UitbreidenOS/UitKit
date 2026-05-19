---
name: comps-analysis
description: "Trading and transaction comps: build a comparable company universe, spread EV/EBITDA and P/E multiples, apply to target, benchmark valuation"
---

# Comps Analysis Skill

## When to activate
- Valuing a company using market multiples (trading comps)
- Benchmarking a valuation against recent M&A transactions (transaction comps)
- Building the "football field" valuation range for a pitch or analysis
- Screening for undervalued or overvalued stocks vs. peers

## When NOT to use
- When the comparable universe is too small (< 4 companies) — DCF is more reliable
- Pre-revenue or early-stage companies — multiples are not meaningful
- Formal fairness opinions — require licensed valuation professional

## ⚠️ Important

All comps outputs must include `[VERIFY]` before use. Multiple selection and adjustment are judgment calls — explicitly document why you included or excluded each comp.

## Instructions

### Step 1 — Build the comparable universe

```
Build a comparable company universe for [target company].

Target description:
- Business: [what the company does]
- Revenue: $[X]M, EBITDA margin: [X]%
- Geography: [primary markets]
- Growth rate: [X]% YoY

Screen for comps using these criteria (start broad, then narrow):
1. Same industry/sub-sector (SIC code or GICS sector)
2. Similar size: revenue within 0.5x to 2x of target
3. Similar business model (SaaS vs. on-premise; B2B vs. B2C)
4. Similar growth profile (high-growth vs. mature)
5. Same geography or comparable market dynamics

Exclude:
- Companies in M&A processes (distorted multiples)
- Conglomerates with different business mix
- Companies with negative EBITDA (unless target is also pre-profit)

List 6-10 comparable companies with reasoning for inclusion/exclusion.
[VERIFY] each inclusion is defensible to a CFO or investment committee.
```

### Step 2 — Spread the multiples

```
For each comparable company, collect:
- Enterprise Value (EV) = Market Cap + Net Debt
- Revenue (LTM and NTM)
- EBITDA (LTM and NTM)
- Net Income / EPS (for P/E)
- Revenue growth rate

Calculate:
- EV / Revenue (LTM and NTM)
- EV / EBITDA (LTM and NTM)
- P/E (LTM and NTM)

Then summarise:
- Mean, Median, 25th percentile, 75th percentile for each multiple
- Flag any outliers (> 2 standard deviations from mean)
- Note which comps are most similar to the target

[VERIFY] all market data against live source (Bloomberg, FactSet, or company filings).
```

### Step 3 — Apply to target

```
Apply the comparable multiples to the target company:

Target metrics: Revenue $[X]M, EBITDA $[Y]M (LTM)

Implied EV ranges:
- Using median EV/Revenue ([X]x): EV = $[X]M × [X]x = $[result]M
- Using median EV/EBITDA ([X]x): EV = $[Y]M × [X]x = $[result]M

Implied equity value:
- Subtract net debt: EV - Net Debt = Equity Value
- Per share: Equity Value / Shares Outstanding

[VERIFY] implied valuation against DCF and any recent transaction benchmarks.
```

### Step 4 — Transaction comps (M&A precedents)

```
For recent M&A transactions in the same sector (last 3-5 years):

Search for deals where:
- Target was in [sector/industry]
- Deal size: $[X]M to $[Y]M EV
- Strategic acquirer or financial sponsor

For each transaction, collect:
- Announcement date
- Acquirer and target
- Deal value (EV)
- EV/Revenue and EV/EBITDA at announcement
- Deal rationale (strategic synergies, financial sponsor, distress)
- Control premium paid over trading price (if public target)

Transaction multiples typically trade at a 20-40% premium to trading comps
(the "control premium"). Apply this to get a "change of control" valuation.

[VERIFY] each transaction is truly comparable (not distressed, similar business mix).
```

### Football field (valuation summary)

```
Consolidate all valuation methodologies into a summary range:

                  Low      Mid      High
DCF:             $18.5    $21.8    $27.4   ← base case
Trading comps:   $17.2    $20.3    $24.8
Transaction comps: $22.0  $26.1    $31.5  ← typically highest (control premium)
52-week range:   $14.2    --       $23.5  ← market reference

Current stock price: $19.81 → sits near mid-range across methodologies

[VERIFY] all inputs before presenting to investment committee or client.
```

## Example

**User:** Build trading comps for a B2B SaaS company ($80M ARR, 110% NRR, 70% gross margin).

**Expected comps universe:** 6-8 mid-market B2B SaaS companies at similar ARR scale and growth profile. Multiples table with EV/ARR (LTM + NTM), EV/Gross Profit, NTM P/E where applicable. Implied valuation range. Note on premium comps deserve given 110% NRR.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
