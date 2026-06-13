---
name: referral-program
description: "Referral program design: incentive structure, referral mechanics, tracking setup, email/in-app prompts, fraud prevention — for SaaS, ecommerce, and consumer products"
updated: 2026-06-13
---

# Referral Program Skill

## When to activate
- Designing a referral or word-of-mouth program from scratch
- Improving conversion or participation in an existing referral program
- Choosing between referral incentive models (give/get, one-sided, cash, credits)
- Writing referral email invites and landing page copy
- Setting up referral tracking and fraud prevention

## When NOT to use
- Affiliate marketing (partner channel, commission-based) — different mechanics and contracts
- Influencer campaigns — use the brand-guidelines or social-media-manager skill
- Partner/reseller programs — channel sales, not referrals

## Instructions

### Referral program design

```
Design a referral program for [product].

Product type: [SaaS / ecommerce / consumer app / marketplace]
Business model: [subscription / one-time purchase / freemium]
Average customer LTV: $[X]
Current CAC (cost to acquire): $[X]
Primary acquisition goal: [new signups / first purchases / paid conversions]

Design framework:

1. Who to ask for referrals:
   - Timing: ask after the aha moment, not at signup
   - Best triggers: after first success moment / after positive review / at upgrade
   - Segment: power users refer more than average users; filter for engaged cohort

2. Incentive structure (choose based on product economics):
   a. Give/Get (both sides win):
      Referrer gets: [X credit / X months free / cash]
      Referee gets: [X credit / extended trial / discount]
      Best for: SaaS, subscription products
   
   b. One-sided (referrer only):
      Referrer gets: cash commission or credit per conversion
      Best for: high-margin products, affiliate-like models
   
   c. Charity donation:
      Referrer chooses a charity; you donate $X per referral
      Best for: B2B, where cash feels transactional

3. Incentive calibration:
   - Cap referral cost at 20-30% of LTV for viability
   - If LTV = $[X], max referral cost = $[X × 0.25]
   - Trigger payout only on paid conversion, not signup (fraud prevention)

4. Referral mechanics:
   - Unique referral link per user (not just a code — links track better)
   - Email + social sharing templates pre-written
   - Dashboard: referrer can see who they've invited and status

Recommended program design for my product with specific incentive numbers.
```

### Referral email templates

```
Write referral program emails for [product].

Product: [describe]
Incentive: [referrer gets X, referee gets Y]
Referral link placeholder: [REFERRAL_URL]
Brand tone: [professional / casual / playful]

Email 1 — Referral invite (from referrer to referee):
Subject: [personal-feeling, not corporate — from the referrer's perspective]
Preview: [what they'll get]
Body:
- Personal opener (written as if from the referrer, not the company)
- 1-sentence product description using social proof language
- The offer: "Get [X] when you sign up with my link"
- [REFERRAL_URL]
- Keep under 100 words

Email 2 — Referral program announcement (to existing users):
Subject: [Give [X], Get [X] — share [product] with your team]
Goal: drive participation from current user base
Body:
- Lead with their reward (not the product's benefit)
- Simple explanation of how it works (3 steps max)
- CTA: "Get my referral link" → link to dashboard
- Social sharing buttons pre-configured

Email 3 — Reminder to non-participants (14 days after launch):
Subject: [You haven't tried our referral program yet]
Goal: convert non-participants with social proof
Body:
- "[X] users have already earned [reward] this month"
- Friction-removal: "It takes 30 seconds to get your link"
- CTA: same as Email 2

Email 4 — Referral received notification (to referrer):
Subject: [[First name] just signed up with your link]
Goal: reinforce participation, drive second referral
Body:
- Confirmation: "[Name] signed up! You'll get [reward] when they [convert]."
- Progress if applicable: "You've referred [X] — [Y more] until [bonus tier]"
- "Know someone else?" — secondary CTA

Write all 4 emails for my product.
```

### Referral landing page

```
Write referral landing page copy for [product].

Page URL: /invite or /referral
Visitor context: arrived via referral link from a friend/colleague
Their awareness of the product: zero to low
The offer they received: [X]
Product benefit in one line: [describe]

Page structure:

Hero:
- Headline: "[Friend's name] invited you to [product]" (personalised via URL param)
- Sub-headline: what the product does in plain English
- The offer: "[X] for free when you sign up today"
- CTA: "Claim [X] and get started" (action-first button text)

Social proof (below fold):
- [X] customers / [X] teams / [X] in revenue tracked
- 1-2 short testimonials

How it works (3 steps):
1. Create your account (30 seconds)
2. [First key action] to get started
3. [Aha moment] — [reward unlocked]

FAQ (2-3 questions):
- "What do I get for free?" → answer specifically
- "Do I need a credit card?" → answer
- "What happens after [trial/reward period]?" → answer

CTA (repeated at bottom): same as hero

Write full page copy with all sections.
```

### Fraud prevention

```
Design fraud prevention for a referral program.

Reward type: [account credit / cash payout / free months]
Payout trigger: [on signup / on first purchase / on paid conversion after 30 days]
Risk level: [low-value reward / high-value reward]

Common fraud patterns:
1. Self-referral: user creates a second account to refer themselves
2. Fake signups: referrer creates dummy accounts to collect rewards
3. Chargeback fraud: complete purchase → collect referral reward → chargeback
4. Bulk account creation: scripts creating hundreds of accounts

Prevention measures:

Identity checks:
□ Email domain deduplication (block same-domain variations: user+1@, user+2@)
□ IP address: flag multiple signups from same IP within 24h (don't block — flag for review)
□ Device fingerprinting: flag same device signing up multiple times
□ Phone verification for reward thresholds above $[X]

Payout delay:
□ Delay reward credit by [30-60 days] — past the chargeback window
□ Don't pay out until referred user has been active [X days] or made [X] actions

Self-referral:
□ Block same email domain on both accounts
□ Flag if billing address matches existing customer

Payout caps:
□ Maximum [X] referrals rewarded per user per month
□ Manual review required above [X] referrals/month

Implement these controls ranked by effort vs. fraud risk for my program.
```

## Example

**User:** Our SaaS ($49/month, average 18-month LTV = $882) has no referral program. Customers frequently tell us they recommend us to colleagues. We're leaving money on the table. Design one.

**Claude's recommendation:**

With $882 LTV, you can afford up to $220 in referral cost (25% of LTV) and still be ahead of most paid channels.

**Program design:**

**Give/Get: $50 credit for referrer + $50 credit for referee**

Why credits, not cash:
- Credits have ~0 cost to you (they're applied to future subscription)
- Users stay engaged to redeem them
- Cash at $50 per conversion is real P&L impact

**Mechanics:**
- Referral link (not a code) — generates on the Account Settings page
- Payout trigger: referee stays on paid plan for 30 days (prevents chargeback fraud)
- Dashboard: "You've referred X people → $Y earned"
- Cap: 10 rewarded referrals per user per quarter

**When to ask:**
Don't ask at signup. Ask:
1. After they export their first report (aha moment)
2. After their first NPS score ≥ 9
3. After month 3 of active use (loyalty signal)

**Projected math:**
If 5% of your user base refers 1 person and 40% of those convert → cost per acquired customer = $125 (well below your current CAC). This typically returns 15-25% of new growth in mature referral programs.

**Launch sequence:**
1. Build referral link generation (1 developer sprint)
2. Email existing customers announcing the program
3. Add in-app prompt at the 3 trigger moments above
4. Measure participation rate weekly; iterate the incentive if < 5% participate

---
