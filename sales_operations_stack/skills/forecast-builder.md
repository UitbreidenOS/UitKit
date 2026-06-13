---
name: forecast-builder
description: Generates 13-month rolling forecast with three scenarios (best-case, commit, upside). Tracks variance trending, inputs historical conversion rates, and surfaces confidence gaps.
allowed-tools: Read, Write
effort: high
---

## When to activate

Weekly before leadership sync, or monthly for board updates. Requires current pipeline snapshot and historical close rates by stage and rep.

## When NOT to use

Not for annual strategic planning (use annual budget process). Not for individual deal coaching. Not without pipeline data refresh within 24 hours.

## Forecast Methodology

**Three Scenarios:**
- **Commit (60% confidence):** Conservative forecast; deals with >50% probability only. Sum = expected close value.
- **Best-Case (90% confidence):** All deals >30% probability. Upper bound for upside.
- **Upside:** Everything >10% probability. Stretch scenario for best execution.

**Formula per scenario:**
- For each open deal: estimated value × close probability (by scenario threshold) = weighted value
- Sum across all deals by stage and rep
- Compare to monthly target; calculate variance

**Trending:**
- Compare current forecast vs. prior week (velocity)
- Compare vs. YTD forecast (accuracy)
- Calculate variance %: (Commit forecast - Prior month actual close) / Prior month actual × 100

## Output Format

```markdown
# 13-Month Rolling Forecast — {Date}

**Data Refresh:** {Timestamp}
**Confidence Level:** {High / Medium / Low} based on pipeline age

---

## Forecast Summary (13 Months)

| Month | Commit | Best-Case | Upside | Target | Var % |
|---|---|---|---|---|---|
| Month 1 | ${} | ${} | ${} | ${} | {%} |
| ...
| **Total** | **${}** | **${}** | **${}** | **${}** | **{%}** |

---

## Month-by-Month Commit Breakdown (Next 3 Months)

| Stage | Count | Value | Prob | Weighted | % of Close |
|---|---|---|---|---|---|
| Negotiation | {N} | ${} | {%} | ${} | {%} |
| Proposal | {N} | ${} | {%} | ${} | {%} |
| Qualification | {N} | ${} | {%} | ${} | {%} |
| **Total** | **{N}** | **${}** | — | **${}** | **100%** |

---

## Rep-by-Rep Forecast (Month 1)

| Rep | Commit | Target | Var % | Status | Risk |
|---|---|---|---|---|---|
| {Name} | ${} | ${} | {%} | {Green/Yellow/Red} | {Note if trending miss} |

---

## Variance Trending

| Period | Forecast | Actual | Variance | Status |
|---|---|---|---|---|
| Month -1 | ${} | ${} | {%} | {Green/Yellow/Red} |
| Month -2 | ${} | ${} | {%} | {Green/Yellow/Red} |

---

## Confidence Assessment

**High-confidence deals** (>75% probability): ${} ({%} of forecast)  
**Medium-confidence deals** (50–75% probability): ${} ({%} of forecast)  
**Low-confidence deals** (<50% probability): ${} ({%} of forecast)

**Risk:** {X} deals heavily dependent on single stakeholder or competitive threat.

---

## Recommended Actions

- {Action if variance >10%}
- {Action if low-confidence concentration >40%}
```

## Example

# 13-Month Rolling Forecast — 2026-06-10

**Data Refresh:** 2026-06-10 09:00 UTC  
**Confidence Level:** Medium (73% of forecast is >50% probability)

---

## Forecast Summary (13 Months)

| Month | Commit | Best-Case | Upside | Target | Var % |
|---|---|---|---|---|---|
| Jun | $920K | $1.1M | $1.3M | $1.1M | -16% |
| Jul | $1.05M | $1.25M | $1.4M | $1.1M | -5% |
| Aug | $980K | $1.15M | $1.35M | $1.1M | -11% |
| Sep | $1.12M | $1.3M | $1.5M | $1.1M | +2% |
| **Q3 Total** | **$4.07M** | **$4.8M** | **$5.55M** | **$3.3M** | **+23%** |

---

## Month-by-Month Commit Breakdown (June)

| Stage | Count | Value | Prob | Weighted | % of Close |
|---|---|---|---|---|---|
| Negotiation | 8 | $600K | 72% | $432K | 47% |
| Proposal | 16 | $1.1M | 41% | $451K | 49% |
| Qualification | 22 | $900K | 8% | $72K | 8% |
| **Total** | **46** | **$2.6M** | — | **$955K** | **100%** |

---

## Rep-by-Rep Forecast (June)

| Rep | Commit | Target | Var % | Status | Risk |
|---|---|---|---|---|---|
| Sarah Chen | $320K | $366K | -12% | Yellow | Dependent on 2 large deals (>$100K) |
| James Rodriguez | $185K | $183K | +1% | Green | On track |
| Maria Garcia | $220K | $183K | +20% | Green | Strong Negotiation pipeline |
| David Kim | $195K | $183K | +7% | Green | On track |

---

## Variance Trending

| Period | Forecast | Actual | Variance | Status |
|---|---|---|---|---|
| May | $1.08M | $1.05M | -3% | Green |
| Apr | $1.05M | $980K | -7% | Yellow |
| Mar | $1.2M | $1.15M | -4% | Green |

**Trend:** Commit forecast trending conservative (actual beating forecast by 3–7%). Confidence increasing.

---

## Confidence Assessment

**High-confidence deals** (>75% probability): $580K (60% of forecast)  
**Medium-confidence deals** (50–75% probability): $280K (30% of forecast)  
**Low-confidence deals** (<50% probability): $95K (10% of forecast)

**Risk:** Two large deals (OPP-2847 Acme, OPP-2903 TechFlow) represent $320K (35% of month close). Delay impacts variance >15%.

---

## Recommended Actions

- Monitor Acme deal closely; schedule stakeholder check-in by June 13 to confirm close date
- TechFlow decision timeline slipping; obtain written commitment on close date or move to July forecast
- Sales team showing strong execution (actual beat forecast); maintain coaching on Qualification stage conversion

---
