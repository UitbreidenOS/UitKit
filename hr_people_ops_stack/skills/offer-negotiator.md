---
name: offer-negotiator
description: Analyzes a candidate's counteroffer on salary, equity, or benefits. Compares to company offer, flags red flags, and provides negotiation recommendations. Returns assessment and suggested counter-response.
allowed-tools: Read
effort: low
---

# Offer Negotiator

## When to activate

When a candidate counters your offer. They have received the initial offer and responded with requested changes to salary, equity, sign-on bonus, benefits, or start date.

## When NOT to use

Not for candidates who accept offer outright (skip to onboarding-workflow). Not before you have the candidate's counteroffer in writing or verbally. Not without a clear understanding of your company's negotiation ranges.

## Negotiation Dimensions

Review the counteroffer on each dimension below. Each is pass/fail. Overall assessment is ACCEPT/COUNTER/WALK-AWAY.

### 1. Salary Counter Analysis (Pass/Fail)

**Check:**
- What's the requested salary vs. your offer and band max?
- What's their justification (prior comp, competing offer, etc.)?
- Is the request within 10% of band max (reasonable)?
- Can you flex without creating pay equity issues?

**PASS conditions (reasonable):**
- Request is within band (≤band max)
- Request is ≤10% above band max (slight overage, discussable)
- Justification is credible (prior comp, competing offer, relocation)
- No pattern of anchoring high and repeatedly negotiating

**FAIL conditions (unreasonable):**
- Request is >20% above band max (dealbreaker)
- Justification is vague ("I think I'm worth more")
- Pattern of escalating demands ("Now I want $180k, plus sign-on, plus...")
- Requests that create >15% pay gap with peers in same role

**Assessment framework:**

| Gap | Assessment | Recommendation |
|---|---|---|
| <5% above band max | Acceptable; approve or counter with total comp play | ACCEPT salary increase or COUNTER with equity/sign-on |
| 5–10% above band max | Discussable; flag to director/CFO | COUNTER: ask what makes this justified |
| 10–20% above band max | Stretching; requires strong case | COUNTER: negotiate down to band, offer other comp |
| >20% above band max | Out of scope | WALK-AWAY: offer no change, set deadline |

**Example PASS:**
"Candidate: '$165k → $165k' (no change). Assessment: ACCEPT. No negotiation needed."

**Example PASS:**
"Candidate: '$155k → $162k' (+4.5%). Band: $140–160k. Justification: 'Prior comp at Stripe was $160k.' Assessment: PASS—within 5% overage. COUNTER: 'Can offer $160k if you accept 0.04% equity (reduced from 0.05%) or delay start date 2 weeks.'"

**Example FAIL:**
"Candidate: '$155k → $185k' (+19%). Band: $140–160k. No justification. Assessment: FAIL. WALK-AWAY: 'Our band is $140–160k. $160k is max. Not flexible above that.'"

### 2. Equity Counter Analysis (Pass/Fail)

**Check:**
- What's the requested equity vs. your offer?
- Is the request >1.5x your standard for their level (red flag)?
- Is vesting schedule reasonable (4-year standard)?
- Is there room to flex equity if you're holding on salary?

**PASS conditions (reasonable):**
- Request is ≤1.5x your offer (e.g., you offered 0.05%, they want 0.07%)
- Justification is credible ("I forfeited unvested equity at my last company")
- Vesting remains 4-year, 1-year cliff (standard)
- They're trading off salary for equity (conscious tradeoff)

**FAIL conditions (unreasonable):**
- Request is >2x your offer (e.g., you offered 0.05%, they want 0.10%+)
- Request changes vesting schedule (e.g., 2-year vest or 0-year cliff)
- No justification ("I should get more equity")
- Escalating demands combined with salary push

**Assessment framework:**

| Multiplier | Assessment | Recommendation |
|---|---|---|
| <1.2x | Acceptable; small overage | ACCEPT or COUNTER: slight increase |
| 1.2–1.5x | Discussable; shows equity-mindset | COUNTER: split difference or tie to salary reduction |
| 1.5–2x | Stretching; requires strong case | COUNTER: explain standard per level, negotiate down |
| >2x | Out of scope | WALK-AWAY: hold line or walk |

**Example PASS:**
"Candidate: 0.05% → 0.06% (+20%). Justification: 'I forfeited 0.03% unvested at Stripe.' Assessment: PASS. COUNTER: 'Can offer 0.055% (split difference) if you hold salary at $155k.'"

**Example FAIL:**
"Candidate: 0.05% → 0.12% (+140%). No justification. Assessment: FAIL. WALK-AWAY: 'Our standard for Senior IC is 0.05–0.10%. 0.12% is above band. Can't move there.'"

### 3. Sign-On Bonus Counter Analysis (Pass/Fail)

**Check:**
- Did they ask for sign-on (and you didn't offer)?
- What's their justification (forfeited bonus/equity)?
- Is the request reasonable relative to their prior compensation?
- Is it <25% of your salary offer (or would combined be <25% overage)?

**PASS conditions (reasonable):**
- Justification is credible (forfeited bonus/RSU at prior company with documentation)
- Request is proportional to prior comp (e.g., "I forfeited $40k bonus" = ask for $30–40k sign-on)
- Combined salary + sign-on is still within your total comp budget
- They're not double-dipping (asking for higher salary AND sign-on AND equity)

**FAIL conditions (unreasonable):**
- No justification ("I want a sign-on bonus")
- Request is wildly higher than stated forfeiture ("I forfeited $20k, but want $60k sign-on")
- Stacking all increases (higher salary + sign-on + higher equity + benefits changes)

**Assessment framework:**

| Forfeiture | Proposed Sign-On | Assessment | Recommendation |
|---|---|---|---|
| <$10k | Asking for $15k+ | FAIL | WALK-AWAY or minimal offer |
| $15–25k | Asking for $20–30k | PASS | ACCEPT or slight counter |
| $30–50k | Asking for $25–40k | PASS | ACCEPT or slight counter |
| >$50k | Asking for >$40k | PASS but FLAG | Counter: explain ceiling, offer payment plan |

**Example PASS:**
"Candidate: 'I forfeited $35k bonus at Stripe.' Asking: '$25k sign-on.' Assessment: PASS. ACCEPT. Justification tracks, amount reasonable."

**Example FAIL:**
"Candidate: 'I want a $50k sign-on.' No forfeiture mentioned. Assessment: FAIL. COUNTER: 'Sign-on is typically tied to forfeited comp. What are you leaving behind?'"

### 4. Benefits Counter Analysis (Pass/Fail)

**Check:**
- Are they asking for changes to standard benefits (PTO, parental, etc.)?
- Are requests compliant with state law and company policy?
- Is there room to flex (e.g., extra PTO, flexible start time)?
- Are they asking for discriminatory accommodations (escalate to legal)?

**PASS conditions (reasonable):**
- Request is within your policy (e.g., "5 weeks PTO instead of 4" if your policy allows)
- Request is non-discriminatory (flexible hours, extra remote days)
- Request doesn't create company liability (e.g., not asking to skip background check)
- Request is tied to legitimate need (e.g., "Relocation in 2 months, need 6-week start delay")

**FAIL conditions (unreasonable):**
- Request violates state law (e.g., "No paid parental leave" when state mandates)
- Request is discriminatory (asking for disability accommodation as condition, not request)
- Request is company-breaking (e.g., "Unlimited PTO with no minimum", asking to opt out of benefits)
- Request is illegal (e.g., "Don't want to sign arbitration clause")

**Assessment framework:**

| Request Type | Assessment | Recommendation |
|---|---|---|
| Flexible hours / remote days | Usually PASS | Likely ACCEPT if team can support |
| Extra PTO (1–2 weeks) | Discussable | COUNTER: offer 1 extra week, revisit after 1 year |
| Parental leave extension | Usually PASS | Likely ACCEPT (legal requirement in many states) |
| Different health insurance plan | Discussable | COUNTER: depends on plan options available |
| Delayed start date | Usually PASS | Likely ACCEPT (reasonable notice period) |
| Opt out of 401(k) / benefits | FAIL | WALK-AWAY: benefits are standard, non-negotiable |
| Disability accommodation | ESCALATE | Flag to HR/Legal immediately |

**Example PASS:**
"Candidate: 'Can I start July 15 instead of July 1? Current company requires 2-week notice.' Assessment: PASS. ACCEPT. Reasonable request, doesn't harm onboarding."

**Example FAIL:**
"Candidate: 'I want unlimited PTO and no health insurance.' Assessment: FAIL. WALK-AWAY: 'PTO and health insurance are standard. Not negotiable.'"

### 5. Red Flag Assessment (Pass/Fail)

**Check:**
- Is this counteroffer reasonable, or a dealbreaker?
- Pattern of behavior: Are they negotiating in good faith or constantly escalating?
- Is there a competing offer or external pressure driving this?
- Do they seem like they'll accept if you meet them partway?

**PASS conditions (good faith negotiation):**
- Single round of negotiation (not escalating demands)
- Clear justification (prior comp, competing offer, specific need)
- Reasonable requests (within 10–20% of offer)
- Signal of genuine interest ("Love the role, want to make sure comp is fair")

**FAIL conditions (bad faith or dealbreaker):**
- Escalating demands ("First wanted $160k, now $175k")
- Vague justifications ("I'm worth more")
- Unreasonable requests (>30% above offer)
- Constant new demands ("OK, now I want...")
- No signal of genuine interest ("Only coming for the money")
- Competing offer with unrealistic deadline ("Decide today")

**Red flags to surface to hiring manager:**
- Candidate is over-negotiating (suggesting culture misalignment or desperation)
- Multiple rounds without convergence (signal they won't accept any offer)
- Demands that signal they don't understand company stage (e.g., asking for mega-corp benefits at Series B startup)
- Vague responses to questions (lack of transparency)

**Example PASS:**
"Candidate negotiated once: +$5k salary, justified by prior comp at Stripe. Single ask, clear reason. Good faith signal. Recommend accept or small counter."

**Example FAIL:**
"Candidate escalated twice: First wanted $165k, now $175k. Also asking for extra equity, sign-on, earlier start. No clear justification. Pattern suggests dissatisfaction or unrealistic expectations. Recommend: Make final counter, set hard deadline, or walk."

## Output Format

Return negotiation assessment in this format:

```
## Offer Negotiation Analysis: [Candidate Name]

**Counteroffer Summary:**
- Salary: $[X] (was $[Y]; +$Z, +X%)
- Equity: [X]% (was [Y]%; +X%)
- Sign-On: $[X] (was $[Y])
- Other: [Any other changes requested]

---

### Dimension Audit

**1. Salary Counter:** [PASS / FAIL]
[Assessment and reasoning]

**2. Equity Counter:** [PASS / FAIL]
[Assessment and reasoning]

**3. Sign-On Bonus Counter:** [PASS / FAIL]
[Assessment and reasoning]

**4. Benefits Counter:** [PASS / FAIL]
[Assessment and reasoning]

**5. Red Flag Assessment:** [PASS / FAIL]
[Assessment: good faith or dealbreaker? Signals?]

---

### Overall Recommendation

**Decision:** [ACCEPT / COUNTER / WALK-AWAY]

[1–2 sentence summary of recommendation and rationale]

### Suggested Response Script

[If ACCEPT:]
"Great! We can do [accepted changes]. Here's the updated offer letter. Welcome to the team!"

[If COUNTER:]
"Thanks for sharing what you need. Here's what we can do: [Counter on specific dimensions]. Does this work?"

[If WALK-AWAY:]
"Our offer is our best, at $[X] salary, [Y]% equity. This is the ceiling for this role/level. Do you want to accept by [date], or shall we move on?"

### Next Steps
- [ ] Hiring manager reviews recommendation
- [ ] Send response to candidate by [date]
- [ ] Set deadline for acceptance if WALK-AWAY
- [ ] If accepted, proceed to onboarding-workflow
```

## Example Assessment

```
## Offer Negotiation Analysis: Sarah Chen

**Counteroffer Summary:**
- Salary: $160k (was $155k; +$5k, +3.2%)
- Equity: 0.06% (was 0.05%; +0.01%)
- Sign-On: $30k (was $25k; +$5k)
- Other: 5-week PTO (was 4 weeks)

---

### Dimension Audit

**1. Salary Counter:** PASS
$160k is within band max ($140–160k). Exact band max. Justification: "Prior comp at Stripe was $160k." Credible, data-backed. Assessment: Reasonable ask. Can accept or counter with minimal salary increase + other comp.

**2. Equity Counter:** PASS
0.06% is 1.2x our offer (0.05%). Within reasonable negotiation range. Justification: "Forfeited 0.02% unvested at Stripe." Credible. Assessment: Slight overage but justified. Can accept or offer 0.055% (split difference).

**3. Sign-On Bonus Counter:** PASS
$30k requested vs. $25k offered (+$5k). Forfeited $35k bonus at Stripe. Justification tracks: asking for ~86% of forfeited amount. Reasonable. Assessment: Can accept without concern.

**4. Benefits Counter:** PASS
5-week PTO vs. 4 weeks offered. Standard policy at most post-Series B companies. Reasonable request. Assessment: Can accept (align with company policy).

**5. Red Flag Assessment:** PASS
Single round of negotiation. Clear, credible justifications (prior comp, forfeited equity/bonus). Signal of good faith ("Excited about role, want to get comp right"). No escalation, no pattern. Assessment: Good faith negotiator, reasonable counter.

---

### Overall Recommendation

**Decision:** ACCEPT

Sarah's counteroffer is reasonable and credible. All asks are justified by prior compensation. Single round of negotiation signals good-faith process. Recommend accepting her counter: $160k salary (band max), 0.06% equity, $30k sign-on, 5-week PTO. Total first-year comp: $190k + benefits. Competitive and fair.

### Suggested Response Script

"Sarah, thanks for sharing what you need. Your prior comp at Stripe is solid justification. We can do all of it: $160k salary, 0.06% equity, $30k sign-on, and 5 weeks PTO. Here's the updated offer letter. Welcome to the team! We're excited to have you start July 1."

### Next Steps
- [ ] Prepare updated offer letter with Sarah's terms
- [ ] Send to Sarah with warm welcome message
- [ ] Set acceptance deadline (standard: 5 business days)
- [ ] If accepted, proceed to onboarding-workflow
- [ ] Brief hiring manager on final offer before sending
```

---
