---
name: churn-prevention
description: "Churn prevention: identify at-risk customers, intervention playbooks, save offer design, exit survey analysis, win-back campaigns"
updated: 2026-06-13
---

# Churn Prevention Skill

## When to activate
- Identifying customers who are at risk of cancelling
- Designing an intervention when a customer shows churn signals
- Analysing exit survey responses to find patterns
- Building a win-back campaign for recently churned customers
- Calculating and reducing your monthly churn rate

## When NOT to use
- Real-time churn prediction — needs a dedicated ML model or tool (ChurnZero, Gainsight)
- Customer success management for enterprise accounts — use dedicated CS platform

## Instructions

### Identify at-risk customers

```
Help me identify at-risk customers from this usage/engagement data:

[paste or describe signals you have access to]:
- Login frequency changes
- Feature usage decline
- Support ticket volume increase
- Billing issues / failed payments
- Unused key features (especially if they paid for them)
- Low NPS score (0-6 = detractors)
- Not responding to CS outreach

For each signal, tell me:
1. How strong an indicator of churn is this?
2. What intervention should I trigger?
3. How urgent is the outreach?
```

### Intervention playbook by signal

```
Design a churn intervention playbook.

My product: [SaaS / subscription service / marketplace]
Customer segment: [SMB / mid-market / enterprise]
Average contract value: $[X]/month
Churn rate: [X]% monthly

For each churn signal, what should I do?

Signal: Not logged in for 14 days
→ Trigger: [automated email / CS call / in-app message]
→ Message angle: [re-engagement / value reminder / offer help]
→ Escalation if no response: [after X days → do Y]

Signal: Submitted a negative NPS (0-6)
Signal: Contacted support 3+ times in 30 days
Signal: Cancelled 3 of 5 seats (partial cancellation)
Signal: Did not complete onboarding

Create the playbook with specific message templates for each trigger.
```

### Save offer design

```
Design a save offer for customers who have initiated cancellation.

When they click "Cancel", I want to offer:
My product price: $[X]/month
Churn reason (if asked): [price / not using it / competitor / missing feature / budget cut]

Design save offers for each reason:
- Price concern: [X]% discount for [X] months / downgrade option / pause option
- Not using it: free 1:1 onboarding session + usage coaching
- Competitor: [what makes us better / specific comparison]
- Missing feature: [feature roadmap / workaround / feedback capture]
- Budget cut: pause instead of cancel (retain relationship)

For each: write the save offer messaging (< 150 words, honest, not desperate).
```

### Exit survey analysis

```
Analyse these exit survey responses and identify patterns:

[paste responses, or describe the distribution]
Top reasons given: [list]
Verbatim comments: [paste a sample]

From this analysis:
1. What are the top 3 preventable churn reasons?
2. What product or process changes would address each?
3. Which churned customers are most likely to win back?
4. What should I change in my onboarding to prevent this churn from happening?
```

### Win-back campaign

```
Design a win-back email campaign for customers who churned [X] months ago.

Churn reason (if known): [describe]
What has changed since they left: [new features / price change / improvements]
Incentive I can offer: [discount / extended trial / new feature access]

Write a 3-email win-back sequence:
Email 1 (week 4 after churn): Check-in — "How are things going?"
Email 2 (week 8): "Here's what's new since you left"
Email 3 (month 6): Final win-back offer with incentive

Each email should feel personal and low-pressure.
```

### Churn rate analysis

```
Help me understand and reduce my churn rate.

Current metrics:
- Monthly churn rate: [X]%
- Average customer lifetime: [X] months
- Customer LTV: $[X]
- CAC: $[X]

If I reduce churn by 1%:
- New monthly churn rate: [X]%
- Impact on LTV: $[X] → $[X]
- Impact on revenue at [X] customers: $[X]/month improvement

What are the highest-leverage changes I can make to reduce churn by 1% in the next 90 days?
```

## Example

**User:** 8% monthly churn on a $49/month SaaS tool. Exit surveys show 42% say "not using it enough."

**Claude's analysis:**

Root cause: Activation failure, not product failure. "Not using it enough" = didn't get to value.

**Top 3 interventions:**

1. **Fix onboarding (highest leverage):** 42% churn due to non-activation is an onboarding problem. Add a mandatory "first value moment" before the free trial ends — make them complete one core action that shows the product's value. Target: reduce this segment to 20%.

2. **Usage-triggered outreach at day 7:** If a user hasn't completed the core action by day 7 of trial, send an automated "stuck?" email with a short Loom video or 15-minute setup call offer. Don't wait for them to stop using it.

3. **Pause option at cancellation:** "Not using it enough" often means busy, not disinterested. A 1-month pause (no charge, subscription on hold) converts 15-25% of would-be churners into retained customers.

**Projected impact:** These 3 changes could reduce the 42% "not using it" segment by half = ~1.6% reduction in total monthly churn rate.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
