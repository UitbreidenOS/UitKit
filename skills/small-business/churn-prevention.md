---
name: churn-prevention
description: - You run a subscription business (SaaS, membership, recurring service, content subscription) and want to reduce customer churn
updated: 2026-06-13
---

# Churn Prevention

## When to activate
- You run a subscription business (SaaS, membership, recurring service, content subscription) and want to reduce customer churn
- Your churn rate is creeping up and you can't tell which segment is driving it
- You're seeing the same canceled customers come back to your competitors three months later — the relationship was salvageable
- You're launching a new feature, pricing tier, or program and want to design the rollout to minimize churn risk
- You want to systematize the at-risk customer identification and outreach instead of reacting to cancellations after they happen

## When NOT to use
- You run a transactional business (one-time purchases, ad-hoc services) — churn isn't the right framework
- Your churn is already excellent (under 1% monthly for B2B SaaS, under 3% for B2C subscriptions) — diminishing returns kick in fast
- The cancellations you're seeing are structural (product is wrong, pricing is wrong) — outreach won't fix it; product or pricing changes will

## Instructions

### Step 1: Set up your subscription context

Say:

"I run a [subscription type — SaaS, membership, content, recurring service] business. Average customer LTV is [$X]. Monthly churn rate is [Y%]. My typical customer journey from signup to cancellation is [describe pattern]. My biggest churn driver based on my read is [reason]. My brand voice is [adjective list]."

### Step 2: At-risk customer identification

Most churn happens after a period of declining engagement that's visible in your data. Pull the engagement signals.

Say:

"Here are signals from my customer base over the last 30 days: [paste data — login frequency, feature usage, support tickets, plan downgrades, etc.]. Identify the customers most at risk of churning in the next 30 days. For each, explain the specific signal pattern that triggered the flag and suggest a personalized outreach approach."

Claude is good at pattern detection on structured engagement data. Provide it the raw numbers, not your interpretation, and let it surface patterns you might have missed.

### Step 3: At-risk customer outreach

For each at-risk customer:

Say:

"Customer [name] at [company] is showing churn signals: [specific pattern]. They've been a customer for [X months]. Their use case is [use case]. Draft a personalized re-engagement outreach: (1) a warm check-in that references their specific use case, (2) a structured offer to help them get value (custom training, account review, feature walkthrough), (3) a soft listening prompt that gives them room to share if something's not working."

The personalization is what makes the difference. Generic "we noticed you haven't logged in lately" outreach is ignored. Personalized "I noticed you stopped running the weekly report after our v3 release — that pattern surfaced for a few customers and we shipped a fix two weeks ago, want a 10-min walkthrough?" gets responses.

### Step 4: Cancellation save flow

When a customer initiates cancellation:

Say:

"Customer [name] just submitted a cancellation request. They've been with us for [X months], paying [$Y/month]. Their stated reason is [reason]. Their use pattern over the last 90 days was [pattern]. Draft a cancellation save sequence: (1) an immediate response acknowledging the cancel and offering a 15-minute call before processing it, (2) talking points for the call covering the stated reason and the patterns we observed, (3) three save offers ranked by likelihood — pause, downgrade, free month + custom training."

The cancellation save call recovers 20-40% of cancellation requests in well-run subscription businesses. Most small businesses don't make the call at all; they just process the cancellation.

### Step 5: Post-cancellation winback

For customers who do cancel:

Say:

"Customer [name] canceled [X days ago]. Their stated reason was [reason]. Their LTV with us was [$Y]. Draft a winback sequence: (1) a 30-day post-cancel "checking in" email that doesn't push anything, (2) a 90-day "we shipped that thing you mentioned" email if there's something specific they raised that's now solved, (3) a 6-month "consider us again" email with a soft offer."

The 90-day "we fixed it" email is the highest-converting winback touch. Most subscription businesses cancel customers and forget about them forever.

### Step 6: Cohort-level churn analysis

Once a quarter:

Say:

"Here's my churn data over the last 12 months by signup cohort: [paste]. Identify cohort-level patterns: which months had unusually high or low retention, which acquisition channels produce higher LTV, which pricing tier has the most churn, which feature usage correlates with retention. Suggest 3-5 testable hypotheses for improving retention."

The cohort view surfaces patterns that monthly churn rate hides. Most subscription operators look at churn as a single number and miss that the new-customer cohorts are churning at 2x the legacy rate.

## Example

You run a small SaaS — a marketing automation tool for solo consultants and small agencies. 280 paying customers, average $89/month. Monthly churn rate has crept from 4% to 6.5% over the last 4 months. At your customer count, that's losing 7-12 customers per month vs the 11 you've been adding — net growth has stalled.

You set up the at-risk identification workflow. You pull last 30 days of engagement data: login frequency, feature usage, support tickets, plan downgrades. You drop the raw data into Claude with the customer list.

Claude flags 18 at-risk customers. The biggest cluster — 9 of the 18 — share a specific pattern: they stopped using the email automation feature in the last 30 days, even though they used it heavily before. The pattern points to a UI change you shipped 6 weeks ago.

You hadn't noticed because the support tickets came in slowly, one or two at a time, framed as different issues. The pattern in aggregate is clear.

You roll back the UI change for those 9 customers, send them a personalized email referencing the specific feature and explaining what you fixed, and offer a 30-min walkthrough. 6 of the 9 reply and re-engage. 2 cancel anyway (the underlying issue was different). 1 doesn't respond.

You then ship a refined version of the UI change with explicit migration help. Monthly churn drops back to 4.2% within two months. Net growth resumes.

The single Claude workflow surfaced a structural product issue that was hiding inside aggregate metrics. The customer-by-customer outreach saved roughly $35-45K of annualized recurring revenue. The product fix saved an estimated $100K+ over the next 12 months.

You make at-risk identification a monthly rhythm. By month 6, your churn rate stabilizes at 3.7% — below where it started. The compounding effect on growth is meaningful.
