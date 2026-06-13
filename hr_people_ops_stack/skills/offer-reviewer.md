---
name: offer-reviewer
description: Audits a draft offer for market competitiveness, equity fairness, legal compliance, and negotiation risk. Returns pass/fail verdict with specific fixes if needed.
allowed-tools: Read
effort: medium
---

# Offer Reviewer

## When to activate

Before any offer is sent to a candidate. Draft offer has been created (via offer-architect). You have access to company's offer band, candidate's prior compensation, market benchmarks, and equity grant framework.

## When NOT to use

Not for already-sent offers (offer-reviewer is prevention). Not for offers to internal promotions without adjusting equity review. Not without a complete, drafted offer document.

## Audit Dimensions

Review the offer on each dimension below. Each dimension is pass/fail. Overall verdict is PASS or FAIL.

### 1. Salary Competitiveness (Pass/Fail)

**Check:**
- Is the base salary within the company's published band for this role/level?
- Is it benchmarked to 2–3 market sources (Levels.fyi, PayScale, Blind, Salary.com)?
- Is it at least 10% above candidate's prior salary (if external hire)?
- Does it account for cost of living (SFBA vs. midwest)?
- Is it consistent with other offers to same level (no >15% variance without documented reason)?

**FAIL conditions:**
- Salary >120% of band max
- Salary 10% below candidate's prior (undercutting)
- No benchmarking data provided
- Pay equity gap >15% for same role/level

**PASS guidance:**
- Salary 70–90% of band (typical for experienced hires)
- Salary 40–60% of band (typical for junior/entry)
- Clear benchmarking with 2+ sources
- Documented reason for above/below standard (e.g., "Senior IC, hired from Meta; 85th percentile justified")

**Example PASS:**
"$155,000 for Senior Backend Engineer. Band: $140–160k. Candidate prior: $140k. Benchmarking: Levels.fyi $158k, Blind $152k, our internal $155k avg. PASS—strong hire, well-positioned in market."

**Example FAIL:**
"$180,000 for Senior Backend Engineer. Band: $140–160k. This is 112% of band max. No justification provided. FAIL—salary review required; out of band."

### 2. Equity Fairness (Pass/Fail)

**Check:**
- Is equity percentage consistent with level/role?
- Is vesting standard 4-year with 1-year cliff?
- Is equity clawback clause reasonable (if present)?
- Does equity amount pass "sniff test" (not 2–5x standard for level)?
- If refresh grant mentioned, is it in line with company policy?

**FAIL conditions:**
- Equity vest with 0-year cliff (immediate vesting; unusual and expensive)
- Equity percentage >2x standard for level
- Vesting <4 years (custom schedules require justification)
- Equity clawback >12 months or extends beyond 1-year cliff

**PASS guidance:**
- Standard 4-year vest, 1-year cliff (industry standard)
- Equity % aligned with level (e.g., IC3: 0.05–0.10%, Senior IC: 0.10–0.20%, Manager: 0.25–0.50%)
- No clawback or reasonable 12-month clawback
- Refresh grants follow company policy (annually, half of initial grant, typical)

**Example PASS:**
"0.05% equity, 4-year vest, 1-year cliff. Standard for Senior IC at this stage. PASS."

**Example FAIL:**
"0.15% equity, 2-year vest, 0-year cliff (immediate vesting). This is 3x standard for level and 2-year vest is below market. FAIL—requires director approval and likely equity committee review."

### 3. Sign-On Bonus (Pass/Fail)

**Check:**
- Is sign-on bonus <25% of base salary (if present)?
- Is there clear justification (e.g., "Forfeited RSU at prior company: $35k")?
- Is sign-on bonus only for external hires (not internal promotions)?
- If clawback present, is it reasonable (12 months, pro-rata)?

**FAIL conditions:**
- Sign-on bonus >25% of base (e.g., $50k base + $40k sign-on = 80% overpay)
- Sign-on bonus without documented justification
- Sign-on bonus to internal promotion (not standard)
- Clawback >12 months or non-pro-rata

**PASS guidance:**
- Sign-on 10–20% of base for strong external hires
- Justified with prior comp forfeiture or competitive pressure
- Only for external hires
- No clawback or pro-rata 12-month clawback (e.g., "100% if leaves <6mo, 50% if <12mo")

**Example PASS:**
"$25,000 sign-on (16% of $155k base). Candidate forfeited $35k bonus at Stripe. PASS—justified, reasonable amount."

**Example FAIL:**
"$40,000 sign-on (26% of $155k base). No justification provided. FAIL—exceeds 25% threshold; requires reduction or justification."

### 4. Benefits Package (Pass/Fail)

**Check:**
- Are all benefits listed explicitly (no "standard benefits" vagaries)?
- Is PTO compliant with state law (minimum 2–3 weeks for CA, 0 weeks for others)?
- Is health insurance contribution transparent (employer % vs. employee %)?
- Are parental leave, sick leave, professional development clear?
- Are remote/flexibility policies documented?

**FAIL conditions:**
- "Standard benefits package" with no detail
- PTO below state minimum (CA: 2 weeks minimum)
- Parental leave missing (flag for legal review)
- Health insurance split is vague (e.g., "Competitive health")

**PASS guidance:**
- Explicit PTO: "20 days/4 weeks per year"
- Explicit health: "Medical, dental, vision; 85% company, 15% employee"
- Explicit parental: "4 weeks paid (either parent)"
- Explicit dev budget: "$1,500/year"
- Explicit flexibility: "Remote-first; flexible hours within 10am–4pm overlap"

**Example PASS:**
"20 days PTO, medical/dental/vision 85/15 split, 4 weeks parental, $1,500 dev budget, remote-first. PASS—complete and transparent."

**Example FAIL:**
"Standard benefits per employee handbook. No parental leave mentioned." FAIL—benefits not specified; parental leave missing (legal flag)."

### 5. Legal Compliance (Pass/Fail)

**Check:**
- Is at-will employment clause present (both directions)?
- Are contingencies listed (background check, references, etc.)?
- Is offer duration clear (valid for X business days)?
- Is any non-compete/IP assignment language reasonable?
- Are no illegal questions or promises in offer?

**FAIL conditions:**
- No at-will clause
- Non-compete enforceable in candidate's state (often illegal in CA)
- Promises of "guaranteed promotion" or "guaranteed raises"
- Contingencies that are discriminatory (e.g., "Must pass sports fitness test")
- Missing contingencies (background, references should be standard)

**PASS guidance:**
- At-will clearly stated ("Both parties may terminate for any reason, without notice")
- Contingencies listed (background, references, education verification)
- Offer valid for standard 5–7 business days
- Non-compete only if candidate is state where enforceable (not CA, NY)
- IP assignment standard (all work product belongs to company)

**Example PASS:**
"At-will employment clause present. Contingencies: background check, references, degree verification. Offer valid 5 business days. No non-compete. PASS—legally sound."

**Example FAIL:**
"At-will clause missing. Non-compete clause states 'Candidate may not work for competitor for 2 years post-employment.' Offer has no expiration date." FAIL—legal issues; at-will missing, non-compete unenforceable in CA, no expiration date."

### 6. Negotiation Risk Assessment (Pass/Fail)

**Check:**
- Will candidate likely accept this offer (based on their expectations)?
- Are there known gaps between offer and candidate's stated expectations?
- Is there room to flex if candidate negotiates?
- Are hidden or unclear terms that invite renegotiation?

**FAIL conditions:**
- Candidate stated expectation $170k; offer is $155k with no acknowledgment of gap
- Equity or sign-on numbers create doubt (e.g., "$150k salary + $45k sign-on + 0.05%" might signal misaligned comp strategy)
- Offer has vague terms that will prompt clarifications

**PASS guidance:**
- Offer thoughtfully gaps candidate's stated expectation (e.g., candidate said "around $160k"; you're at $155k + $25k sign-on = $180k total first-year cash)
- Clear breakdown: salary, sign-on, equity, benefits (no surprises)
- If gaps exist, hiring manager has negotiation script ready

**Example PASS:**
"Candidate stated: '$160–170k range'. Offer: $155k salary + $25k sign-on = $180k first year. Clear breakdown. Hiring manager prepped for negotiation if needed. PASS—thoughtful positioning."

**Example FAIL:**
"Candidate stated: '$160–170k range'. Offer: $155k salary only. No sign-on. No discussion of gap. Candidate will likely counter. FAIL—gaps unaddressed; negotiation risk high."

## Output Format

Return audit result in this format:

```
## Offer Audit: [Candidate Name] for [Role]

**Overall Result:** [PASS / FAIL]

---

### Dimension Audit

**1. Salary Competitiveness:** [PASS / FAIL]
[Assessment of salary vs. band, benchmarking, consistency]
[If FAIL: "Salary $[X] is [X]% of band max. Requires reduction to $[X] or director approval."]

**2. Equity Fairness:** [PASS / FAIL]
[Assessment of equity %, vesting, cliff]
[If FAIL: "Equity [X]% is 2.5x standard for level. Requires reduction or VP approval."]

**3. Sign-On Bonus:** [PASS / FAIL]
[Assessment of sign-on % and justification]
[If FAIL: "$[X] is [X]% of base; exceeds 25% threshold. Reduce or justify."]

**4. Benefits Package:** [PASS / FAIL]
[Assessment of clarity and completeness]
[If FAIL: "PTO not specified; parental leave missing. Add: '[X] days PTO, [X] weeks parental leave.'"]

**5. Legal Compliance:** [PASS / FAIL]
[Assessment of at-will, contingencies, non-compete]
[If FAIL: "At-will clause missing. Non-compete unenforceable in CA. Add standard language."]

**6. Negotiation Risk:** [PASS / FAIL]
[Assessment of gap vs. candidate expectations, positioning]
[If FAIL: "Candidate expects $170k; offer is $155k. Gap not addressed. Add $20k sign-on or prep counter script."]

---

### Summary
[1–2 sentences: reason for PASS or FAIL. If FAIL, list action items.]

### Action Items (if FAIL)
- [ ] [Specific fix 1]
- [ ] [Specific fix 2]
- [ ] [Escalate to: name, role]

### Next Steps (if PASS)
- [ ] Hiring manager approves offer
- [ ] Send to candidate
- [ ] Track acceptance deadline
```

## Example Audit

```
## Offer Audit: Sarah Chen for Senior Backend Engineer

**Overall Result:** PASS

---

### Dimension Audit

**1. Salary Competitiveness:** PASS
Salary $155,000 is 96% of band max ($160k). Benchmarking: Levels.fyi $158k, Blind $152k, internal $155k avg. Candidate prior: $140k (10% increase). Consistent with other Senior IC offers. Well-positioned.

**2. Equity Fairness:** PASS
0.05% equity (5,000 shares), 4-year vest, 1-year cliff. Standard for Senior IC. No clawback. Aligned with company guidelines.

**3. Sign-On Bonus:** PASS
$25,000 (16% of base). Justified: Candidate forfeited $35k bonus at Stripe. Reasonable bridge. No clawback.

**4. Benefits Package:** PASS
Explicit on all fronts: 20 days PTO, medical/dental/vision 85/15 split, 4 weeks parental, $1,500 dev budget, remote-first. Compliant with CA requirements.

**5. Legal Compliance:** PASS
At-will clause present (both directions). Contingencies listed: background check, references, degree verification. Offer valid 5 business days. No non-compete. IP assignment standard.

**6. Negotiation Risk:** PASS
Candidate stated: "$155–165k range". Offer: $155k salary + $25k sign-on = $180k first year. Clear breakdown. First-year cash above candidate's range. Low negotiation risk.

---

### Summary
All dimensions PASS. Offer is market-competitive, legally sound, and thoughtfully positioned. Ready to send. No action items.

### Next Steps
- [ ] Hiring manager reviews and approves
- [ ] Send to Sarah by [date]
- [ ] Track 5-day acceptance deadline
```

---
