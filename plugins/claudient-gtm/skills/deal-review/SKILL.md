---
name: "deal-review"
description: "Deal review prep: MEDDPICC scoring, risk flags, competitive positioning, next steps, forecast category"
---

# Deal Review Skill

## When to activate
- Preparing for a weekly pipeline review or forecast call with your manager
- An opportunity has been stuck in a stage for too long and you need to diagnose why
- You've just had a key discovery or demo call and want to score deal health before advancing
- End of quarter: auditing forecast accuracy and identifying deals at risk
- A deal is late-stage and you need to build a close plan before the final push

## When NOT to use
- You're building a mutual success plan with the buyer — use `/mutual-success-plan`
- You're working on champion strategy — use `/champion-builder`
- You need to structure deal terms and economics — use `/deal-desk`
- You're doing territory or pipeline forecasting across multiple deals — use `/commercial-forecaster`

## Instructions

### Full MEDDPICC deal review

```
Run a MEDDPICC deal review for [opportunity name].

## Deal context
Company: [name]
Deal size: $[ACV] / $[TCV]
Stage: [Discovery / Demo / Evaluation / Proposal / Negotiation / Verbal / Closed Won]
Forecast category: [Pipeline / Best Case / Commit / Closed]
Expected close date: [date]
Deal age: [days since opportunity created]

## MEDDPICC scoring

Score each dimension: Strong (2) / Present (1) / Weak (0) / Missing (–1)
Total: /16. Use for health signal, not as a strict gatekeeping tool.

---

### M — Metrics
What measurable business outcome does the buyer expect from our solution?

Documented metrics: [paste what you know, or write "unknown"]
Required: The buyer must state a specific, quantified outcome they are trying to achieve.

Score: [2/1/0/-1]
Evidence: [quote from discovery call, or note this is missing]
Risk if missing: Without clear metrics, you cannot demonstrate ROI, the buyer can't justify the investment internally, and you lose to "do nothing."
Action if missing: Book a metrics workshop or send a business case template — do not advance to proposal without this.

---

### E — Economic Buyer
Who controls the budget? Have you spoken to them?

Economic buyer identified: [Name / Title / Unknown]
Have you met them? [Yes / No / Intro only]
Do they know the deal size? [Yes / No]
Do they have budget authority? [Yes — confirmed / Assumed / Unknown]

Score: [2/1/0/-1]
Risk: If the economic buyer doesn't know this deal exists, you don't have a deal — you have a champion with a wish.
Action if missing: Get an intro from your champion. Do not close a deal without economic buyer buy-in.

---

### D — Decision Criteria
What criteria will the buyer use to make their final decision?

Stated decision criteria: [list what you know]
Unstated/assumed criteria: [what you suspect but haven't confirmed]
Do your strengths map to their top criteria? [Yes / Mostly / No]
Have you helped shape the criteria? [Yes / No]

Score: [2/1/0/-1]
Risk: Unconfirmed or unshaped criteria is a red flag — competitors may be defining the criteria to your disadvantage.
Action: Send a "decision criteria alignment" document to your champion. Ask them to confirm and add any you missed.

---

### D — Decision Process
How will the buying team make the decision? What steps remain before they sign?

Decision process documented: [steps they described]
Stakeholders in the process: [roles involved]
Legal/security/procurement review: [Yes / Not yet / Not needed]
Paper process: [who drafts, who signs, how long does legal review take]
Timeline they've described: [their stated timeline vs your expected close date]

Score: [2/1/0/-1]
Risk: Every unknown step in the process is potential delay. "We just need to get legal involved" is a 4-8 week warning.
Action: Ask directly: "Walk me through every step between today and a signed contract." Map it to calendar dates.

---

### P — Paper Process / Identify Pain
(Dual use — choose interpretation based on your sales methodology)

**Option A — Paper Process:**
Contract vehicle: [their paper / your paper / MSA already in place]
Signature authority: [who signs — at what dollar threshold does it escalate?]
Legal review time: [estimated — ask your champion, not their lawyer]
Finance approval: [required / not required]
Procurement: [involved / not involved / to be determined]

**Option B — Identify Pain (Implicate Pain):**
Stated pain: [what the champion says]
Implicated pain: [what happens if they don't solve this — do they know?]
Pain urgency: [has a deadline or event created urgency, or is this a nice-to-have?]
Compelling event: [what changes on [date] that makes solving this urgent?]

Score: [2/1/0/-1]

---

### I — Identify Champion
Is there someone inside the account who will fight for this deal when you're not in the room?

Champion name and title: [Name / Unknown]
Champion tests passed:
- [ ] They've given you access to the economic buyer
- [ ] They've shared confidential information (org chart, competitive evaluation, internal politics)
- [ ] They've advocated for you in meetings you weren't in (evidence?)
- [ ] They're responsive and proactive — not just politely engaged

Champion strength: [Strong / Passive / Weak / None]

Score: [2/1/0/-1]
Risk: A passive or weak champion means your deal is stuck at the middle of the org. Deals without strong champions don't close.
Action: See `/champion-builder` for a full champion development strategy.

---

### C — Competition
Who are we competing against and what is the competitive dynamic?

Competitors in this deal: [named / "evaluating alternatives" / unknown]
Our win rate vs each competitor: [X%]
Buyer's perception of our differentiators: [what they've said we do better]
Buyer's perception of gaps: [what they've said competitors do better]
Have we reframed the criteria to favour our strengths? [Yes / Partially / No]

Score: [2/1/0/-1]
Risk: If you don't know who you're competing against, you can't position. "No competition" is usually wrong.
Action: Ask directly: "Are you evaluating other solutions? Who else is in the mix?"

---

## Deal health summary

MEDDPICC total: [X]/16

| Dimension | Score | Key risk |
|---|---|---|
| Metrics | X/2 | [risk] |
| Economic Buyer | X/2 | [risk] |
| Decision Criteria | X/2 | [risk] |
| Decision Process | X/2 | [risk] |
| Paper Process/Pain | X/2 | [risk] |
| Champion | X/2 | [risk] |
| Competition | X/2 | [risk] |

**Overall deal health:** [Strong (12-16) / Medium (8-11) / At Risk (4-7) / Stuck (0-3)]

**Top 3 risks to this deal closing:**
1. [Most critical — with specific action to address it]
2. [Second risk]
3. [Third risk]

**Forecast category recommendation:**
Based on MEDDPICC score and close date proximity:
- [ ] Closed Won
- [ ] Commit (≥80% confidence, clear path to signature)
- [ ] Best Case (50-80% confidence, risk present but manageable)
- [ ] Pipeline (<50% confidence, multiple unknowns)
- [ ] At Risk (flag for manager review)

**Next 3 actions (specific, with dates):**
1. [Action] by [date] — owned by [AE / champion / buyer]
2. [Action] by [date]
3. [Action] by [date]
```

### Quick deal health check (5 minutes pre-call)

```
Quick MEDDPICC gut check on [deal name] before my [manager review / QBR / customer call].

Deal: [deal name, size, stage, close date]

In 5 bullets, tell me:
1. Strongest MEDDPICC dimension (what we know)
2. Weakest MEDDPICC dimension (biggest gap)
3. Whether the close date is realistic based on what I've described
4. The single most important thing to accomplish in the next 7 days
5. Whether this belongs in Commit or Best Case — and why

Context:
[paste whatever you know about the deal — discovery notes, email threads, meeting notes]
```

### Deal stuck diagnosis

```
This deal has been in [stage] for [N] days without movement. Diagnose why and give me a plan.

Deal: [name, size, stage, original close date]
What's happened: [summary of recent activity]
Last meaningful buyer action: [date and what they did]
My last action: [date and what I did]
Champion status: [engaged / gone quiet / left the company]

Diagnosis framework:
1. PROCESS STALL: Did we get lost in procurement/legal/IT? → What's the specific document or step blocking us?
2. CHAMPION GONE QUIET: Is the champion avoiding us because they lost internal support? → How to re-engage?
3. ECONOMIC BUYER NEVER ENGAGED: Did we never get above the champion? → How to get an intro now?
4. COMPELLING EVENT DISAPPEARED: Did something change (budget freeze, reorg, new priorities)? → How to find a new compelling event?
5. COMPETITOR GETTING THE DEAL: Are they evaluating someone else? → How to reopen the competitive conversation?
6. OUR OWN PROCESS: Did we miss a follow-up, fail to send a document, or leave a question unanswered?

For the most likely cause: give me a specific re-engagement script (email or call opening).
```

## Example

**User:** Deal review: Acme Corp, $85K ACV, in Evaluation stage for 45 days. Champion is the VP Operations. We haven't met the CFO. They told us they're evaluating one competitor (ServiceMax). Close date is end of this month. I have a good product fit.

**Output:**

```markdown
## Deal Review: Acme Corp — $85K ACV

### MEDDPICC Summary

| Dimension | Score | Status |
|---|---|---|
| Metrics | 1/2 | Present — need to quantify the ROI claim |
| Economic Buyer (CFO) | 0/2 | Missing — never met; this is the #1 risk |
| Decision Criteria | 1/2 | Partially known — need to confirm in writing |
| Decision Process | 0/2 | Unknown — 45 days in evaluation with no close plan |
| Pain | 2/2 | Strong — VP Ops has a clear problem |
| Champion (VP Ops) | 1/2 | Passive — has not introduced you to CFO |
| Competition (ServiceMax) | 1/2 | Known competitor, no competitive positioning documented |

**Total: 6/16 — At Risk**

### Top 3 risks

1. **CFO never engaged (Critical):** At $85K, the CFO almost certainly owns budget sign-off.
   You have a champion but no deal. If the CFO hears about this deal for the first time when
   they're asked to sign, the deal will stall or die.
   Action: Email your champion today: "To make sure we can hit your end-of-month timeline, I'd
   like to schedule 20 minutes with [CFO name] to walk through the business case. Can you make
   an intro this week?"

2. **No close plan with 30 days remaining (Critical):** 45 days in evaluation with no documented
   next steps or paper process means there is no path from here to signature this month.
   Action: Send a Mutual Success Plan to your champion today. (See `/mutual-success-plan`)

3. **ServiceMax positioning undefined (High):** You know they're in the deal but have no
   documented competitive positioning. They may be shaping the evaluation criteria to
   disadvantage you.
   Action: Ask your champion directly: "What are you hearing from ServiceMax? What do they
   emphasise that we haven't covered?" Then neutralise it.

**Forecast category: Best Case (not Commit)**
Close this month is possible but not probable until CFO is engaged and a close plan is signed.
```

---
