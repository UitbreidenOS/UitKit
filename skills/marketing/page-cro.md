---
name: page-cro
description: "Landing page conversion rate optimisation: above-the-fold audit, CTA analysis, trust signals, A/B test hypotheses, heatmap interpretation"
updated: 2026-06-13
---

# Page CRO Skill

## When to activate
- Auditing a landing page for conversion rate issues
- Generating A/B test hypotheses to improve sign-ups or purchases
- Interpreting heatmap / session recording data
- Reviewing your homepage, pricing page, or product page
- Understanding why traffic is high but conversions are low

## When NOT to use
- Email campaign optimisation — different channel
- Paid ad copy — use the campaign-brief skill
- UX research from scratch — CRO builds on existing data

## Instructions

### Full landing page audit

```
Audit this landing page for conversion issues.

URL or description: [describe or paste key sections]
Goal: [sign-up / purchase / demo request / download]
Current conversion rate: [X]% (if known)
Traffic source: [paid / organic / email / referral]

Evaluate:

ABOVE THE FOLD (first screen, no scroll)
- Is the value proposition clear in < 5 seconds?
- Does the headline address the visitor's problem or desire?
- Is there a single, obvious CTA?
- Does the hero image/video support the message or distract?
- Is there any friction (too many fields, forced account creation)?

TRUST AND CREDIBILITY
- Social proof present? (reviews, testimonials, logos, case studies)
- Is social proof specific and believable (not generic "5 stars")?
- Security badges / guarantees near purchase/sign-up?
- Who built this? (About/team section or founder story)

VALUE PROPOSITION
- Is the benefit (outcome for user) clear vs. just features?
- Is there a clear differentiation from alternatives?
- Is pricing visible or is there anxiety about hidden costs?
- Is there a risk reversal? (free trial, money-back guarantee, no credit card)

CTA ANALYSIS
- How many CTAs on the page? (1-2 is ideal for focused landing pages)
- CTA copy: is it specific ("Start free trial") or generic ("Submit")?
- CTA placement: visible without scrolling? Repeated at natural stopping points?
- CTA contrast: does it stand out visually?

FRICTION POINTS
- Form length: fewer fields = higher conversion (ask only what's essential)
- Load speed: slow pages kill conversions (each second delay = ~7% drop)
- Mobile experience: optimised for thumb scrolling?
- Distractions: navigation links, social feeds pulling people away?

Output: ranked list of issues with A/B test hypotheses for each.
```

### A/B test hypothesis generator

```
Generate A/B test hypotheses for this page.

Current page: [describe headline, CTA, layout]
Biggest friction points identified: [list]
Current conversion rate: [X]%

For each hypothesis:
- Element to test: [what to change]
- Control: [current version]
- Variant: [proposed change]
- Expected impact: [why this should improve conversion]
- How to measure: [primary metric, secondary metrics]
- Minimum sample size needed: [estimated]
- Priority: [High / Medium / Low]
```

### Heatmap interpretation

```
Interpret these heatmap / scroll map findings:

Click data: [describe where people are clicking]
Scroll depth: [X]% of visitors reach [section], [X]% reach the CTA
Rage clicks: [any elements getting repeated frustrated clicks?]
Dead clicks: [non-clickable elements being clicked?]

Diagnose:
1. What does the scroll data tell us about interest/drop-off?
2. Are people clicking where we want them to?
3. What confused or frustrated users (rage clicks)?
4. What's being ignored that shouldn't be?
5. Top 3 changes to make based on this data
```

### Pricing page audit

```
Audit this pricing page:

[describe tiers, pricing, features, CTAs]

Target customer: [who is this for]
Biggest objection at this stage: [price / value / risk / complexity]

Check:
- Is the recommended plan clear? (highlight, badge, "Most popular")
- Are features described in terms of outcomes, not just checkboxes?
- Is there a free trial or freemium entry point?
- Is annual vs. monthly pricing presented clearly?
- Is there a comparison table vs. competitors or DIY alternatives?
- FAQ section: does it address the real objections?
- What happens when I click the CTA? (friction in next step?)
```

## Example

**User:** My SaaS pricing page has a 2.1% conversion rate. 82% of visitors leave without clicking any CTA.

**Claude's CRO audit:**

Key issues by priority:
1. **Hero — no clear recommendation:** 3 equally-weighted tiers with no "start here" signal → decision paralysis. Fix: Add "Most Popular" badge to middle tier, dim the Enterprise tier for SMB traffic.
2. **CTAs say "Get Started":** Generic — no differentiation between tiers. Fix: Test "Start Free Trial" (Starter) vs. "Schedule Demo" (Pro) vs. "Contact Sales" (Enterprise).
3. **Annual/monthly toggle default is Annual:** Visitors see higher price first = sticker shock. Fix: A/B test defaulting to Monthly pricing.
4. **No risk reversal:** No trial mention above the fold. Fix: Add "14-day free trial, no credit card" line directly under CTAs.
5. **FAQ doesn't address price objection:** "Is this worth it?" isn't answered. Fix: Add "How does this compare to [main alternative]?" and ROI calculator.

**Top A/B test to run first:** Change CTA copy from "Get Started" to "Start Free Trial — No Credit Card" → estimated 20-35% lift based on similar SaaS data.

---
