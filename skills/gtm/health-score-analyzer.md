---
name: health-score-analyzer
description: "Customer health score analysis: usage signals, relationship signals, commercial signals, churn risk rating, and recommended CS intervention for each account"
---

# Health Score Analyzer Skill

## When to activate
- Running your weekly at-risk customer review and need a structured analysis
- You have raw product usage data and want to translate it into a health score
- A customer has gone quiet or shown unusual behaviour and you want a risk rating
- Building or recalibrating your health score model after a wave of unexpected churn
- Preparing your CS team's portfolio review for the week — which accounts need attention?
- You want to score an account before a renewal or expansion conversation

## When NOT to use
- Building the initial health score system from scratch — use `/customer-success` for the model design
- Deep product analytics for internal product decisions — different function
- Determining if a customer is ready to be a reference or case study — separate signal
- Sales qualification scoring for prospects — that's lead scoring territory

## Instructions

### Single account health analysis

```
Analyse the health of this customer account and give me a risk rating.

Customer: [Company name]
ARR: $[X]
Renewal: [date / X months away]
Contract type: [monthly / annual / multi-year]
CSM: [name]
Tenure: [X months / years as a customer]

USAGE SIGNALS — pull from your product analytics:
- Last login (team): [date — how many days ago?]
- Login frequency this month: [X logins] vs. last month: [X logins]
- Core feature usage: [what is their primary use case, and are they using it?]
  - Feature A: [X times this month / not used]
  - Feature B: [X times this month / not used]
- Active users: [N of N licensed seats] = [X%] seat utilisation
- Usage trend: [growing / flat / declining — over last 3 months]
- Last product action: [describe what they did most recently]

RELATIONSHIP SIGNALS:
- Last CSM touchpoint: [date — X days ago] [call / email / meeting]
- Champion status: [strong / weak / no champion identified / champion left]
- Executive sponsor: [engaged / disengaged / unknown]
- NPS score: [X — promoter / passive / detractor] [date of last survey]
- Support tickets last 90 days: [N tickets] — types: [describe]
- Any tickets about data export, API access, or competitor mentions? [yes/no]
- Response time to CSM outreach: [fast / slow / non-responsive]

COMMERCIAL SIGNALS:
- Invoice status: [current / X days overdue]
- Any discount applied: [X% — higher discount = lower switching cost]
- Contract growth trend: [expanded / flat / contracted since start]
- Stakeholder stability: [any key contacts left the company?]
- Budget signals: [any signs of budget pressure or reorganisation?]

COMPETITIVE SIGNALS (if known):
- Any competitor mentioned in support tickets or calls? [yes/no — which competitor]
- RFP or pricing comparison request? [yes/no]
- LinkedIn activity of champion: [still advocating for your product / quiet / left]

---

Produce:

HEALTH SCORE: [0-100]
Health tier: [GREEN 70-100 / YELLOW 40-69 / RED 0-39]
Churn probability: [LOW / MEDIUM / HIGH / CRITICAL]

Top 3 risk signals (most important first):
1. [Signal] — [severity] — [what it means]
2. [Signal] — [severity] — [what it means]
3. [Signal] — [severity] — [what it means]

Top 2 positive signals:
1. [Signal]
2. [Signal]

Recommended intervention:
- [Action 1 — who does it, by when]
- [Action 2 — who does it, by when]
- Escalation needed? [yes / no — and at what level]

Renewal forecast: [likely to renew / at risk / likely to churn]
Expansion potential: [none / possible in X months / ready to discuss now]
```

### Portfolio health review

```
Run a portfolio health review across my customer accounts.

CSM: [name]
Total accounts: [N]
Total ARR managed: $[X]

[Paste account data in this format, one row per customer:]

| Account | ARR | Renewal | Last Login | Active Seats | NPS | Last Touch | Issues |
|---|---|---|---|---|---|---|---|
| Company A | $24K | 2 months | 12 days ago | 8/10 | 42 | 8 days ago | None |
| Company B | $60K | 5 months | 45 days ago | 3/10 | 18 | 21 days ago | Support ticket open |
| Company C | $12K | 1 month | 3 days ago | 10/10 | 67 | 5 days ago | None |
[continue for all accounts]

Produce:

## Portfolio Health Summary
- Total ARR at risk (Red accounts): $[X] ([X%] of portfolio)
- Total ARR in yellow: $[X]
- Total ARR healthy (Green): $[X]
- Accounts needing immediate action: [N]

## Account Risk Tiers

RED — Immediate action required:
| Account | ARR | Renewal | Risk Signal | Action |
|---|---|---|---|---|
| [Company] | $[X] | [X months] | [main risk] | [specific action] |

YELLOW — Active monitoring:
[same table]

GREEN — Healthy / expansion ready:
[same table]

## This Week's CS Priority List
1. [Account] — [why urgent] — [specific action]
2. [Account] — [why urgent] — [specific action]
3. [Account] — [why urgent] — [specific action]

## Renewals in next 60 days — renewal readiness:
| Account | ARR | Renewal date | Health | Action needed |
|---|---|---|---|---|
[table]

## ARR at risk this quarter: $[X]
Conservative recovery estimate (if actions taken): $[X]
```

### Churn signal detection

```
Analyse these customer signals and tell me the churn risk.

Customer: [Company]
Contract: $[X] ARR, renews [date]

Signals to evaluate:
[Describe what you've observed — paste emails, support ticket summaries, usage data, or notes from calls]

Use this churn signal scoring framework:

USAGE DETERIORATION (most predictive):
- Logins dropped > 30% MoM: HIGH risk signal
- Core feature not used in > 30 days: HIGH risk signal  
- Seat utilisation dropped below 40%: MEDIUM risk signal
- No new users added in > 60 days: MEDIUM risk signal

ENGAGEMENT DETERIORATION:
- CSM outreach not responded to in > 7 days: HIGH risk signal
- Exec sponsor gone dark: HIGH risk signal
- Champion left the company: CRITICAL — treat as new deal
- Customer missing or cancelling scheduled calls: HIGH risk signal
- NPS dropped from Promoter to Passive or Passive to Detractor: MEDIUM risk signal

COMMERCIAL SIGNALS:
- Invoice > 30 days overdue: HIGH risk signal
- Asked about contract terms, cancellation process, or data export: CRITICAL
- Requested a discount without a stated expansion reason: MEDIUM risk signal
- Headcount reduction or budget freeze at their company: MEDIUM risk signal

COMPETITIVE SIGNALS:
- Mentioned a competitor by name: HIGH risk signal
- Requested pricing comparison or RFP: CRITICAL
- LinkedIn shows champion now using competitor product: CRITICAL

Score the signals and produce:
- Churn probability: [X%] — derived from number and severity of signals
- Time horizon: likely to churn in [30 / 60 / 90+ days]
- Root cause hypothesis: [why is this happening — product fit / support / business change / mis-sold]
- Save playbook: [specific sequence of actions for this specific risk profile]
- Escalation: [who else should be looped in and why]
```

### Health score model calibration

```
Help me calibrate my health score model based on recent churn data.

Context:
- Churned accounts last quarter: [N accounts, total $X ARR]
- What did the churned accounts have in common? [describe patterns you observed]
- What was their health score the month before they churned? [if you tracked it]
- Accounts that renewed unexpectedly despite low health: [any examples?]

Health score model to review:
Current weights:
- Usage signals: [X%]
- Relationship signals: [X%]
- Commercial signals: [X%]
- Outcomes signals: [X%]

Current signal definitions:
[describe what you measure for each]

Calibration analysis:

1. Which signals were leading indicators (appeared before churn)?
   The best health signals predict churn 60-90 days out — not 2 weeks before.

2. Which signals were lagging (only visible at churn, too late to act)?
   Invoice overdue and cancellation requests are lagging — by then it's crisis mode, not prevention.

3. False positives — accounts that scored red but renewed:
   What was different about them? Adjust weighting to reduce false alarm fatigue.

4. False negatives — accounts that scored green but churned:
   Which signal was you missing? Add it or increase its weight.

5. Recommended weight adjustment:
   Before: [current weights]
   After: [recommended weights based on predictive accuracy]
   Rationale: [why each change]

6. New signals to add:
   - [Signal] — data source: [where to get it] — leading/lagging: [type]

Produce updated health score model with recalibrated weights and signal definitions.
```

## Example

**User:** One of my $85K ARR accounts has gone quiet. The champion hasn't responded to two emails in 3 weeks. Usage looks OK on the surface (they're logging in) but it's just one person. They renew in 8 weeks. What do I do?

**Claude's health analysis:**

**Health Score: 34/100 — RED**
**Churn probability: HIGH — risk materialising now**

**What you're describing is a classic false-positive usage signal:**
One person logging in to keep the account "active" while the buying decision happens behind the scenes. Real adoption is 1 person, not a team. That's not a usage signal — that's a liability signal.

**Active risk signals:**
1. Champion non-responsive x 2 attempts (HIGH) — either they're no longer your champion, or the conversation has moved above their pay grade
2. Single-user adoption (HIGH) — product never achieved team adoption; no internal stakeholders with skin in the game
3. 8 weeks to renewal with no engagement (CRITICAL) — you're out of time for normal CS motions

**Recommended intervention — do this week, not next week:**

1. **Go around the champion.** Find their manager or the economic buyer on LinkedIn. Send a brief, direct email: "I've been trying to reach [Name] and haven't heard back. I want to make sure [Company] gets full value from your investment with us heading into renewal — can we connect for 20 minutes this month?"

2. **Use product data as the hook.** Email the champion (one more attempt): "I pulled your team's usage data ahead of your renewal and noticed we're heavily underutilising [feature] that typically drives [specific outcome] for teams like yours. I'd love to show you what other [industry] companies are doing — 15 minutes this week?"

3. **Brief your AE now.** Don't surprise them at 2 weeks to renewal. They may have a relationship at the executive level.

**If you get no response in 5 days:** Escalate internally. Have your VP send a direct email to whoever signed the original contract. Frame as a business review, not a renewal push.

**Expansion potential: None until health is restored.**

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
