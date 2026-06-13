---
name: content-generator
description: Generates blog posts, social copy, email sequences, and case studies aligned to messaging pillars. Every piece flows from architecture. Returns draft copy ready for tone review and human approval.
allowed-tools: Read, Write
effort: medium
---

# Content Generator

## When to activate

After messaging architecture is defined. You have pillars, proof points, and content angles documented. This skill generates specific content pieces (blog, social, email, case study) that all reference your pillars and proof points. Every piece strengthens the narrative.

## When NOT to use

Not without a messaging architecture in place — this skill will be unfocused. Not for one-off content pieces disconnected from strategy. Not for tone audit — that's Tone Enforcer's job.

## Content Formats

**Blog Posts (800–2000 words)**
- Deep dive on one pillar or customer pain point
- Include data, customer quote or case study, and narrative arc
- Drive to CTA: "Get a free assessment" or "Read the related case study"

**Social Media Copy**
- LinkedIn: 150–300 words, conversational, one core insight per post
- Twitter: 140 characters, debate-friendly or insight-forward
- Format: hook → insight → proof → CTA

**Email Sequences (3–5 touches)**
- Touch 1: Lead with insight related to a pillar
- Touch 2: Add social proof or data
- Touch 3: Customer story or case study
- Touch 4: Objection handle or alternative angle
- Touch 5: Final soft CTA

**Case Studies (1500–2500 words)**
- Customer context (who they are, challenge they faced)
- Our solution (what we provided, why it mattered)
- Results (metrics, outcome, customer quote)
- Lessons learned (takeaway for readers)

**Whitepapers / Guides**
- Authoritative deep-dive on industry trend or methodology
- Data-driven, backed by research or customer examples
- Position your solution as the natural answer

## Content Checklist

Before drafting, confirm:
- [ ] Messaging pillar this content supports (name it)
- [ ] Target audience (who reads this?)
- [ ] Proof point(s) to include (data, quote, case study)
- [ ] Primary CTA (what action do we want?)
- [ ] Format (blog, social, email, case study, guide)

## Output Format

Return content with this metadata:

```
---
title: [Content Title]
format: [Blog / Social / Email / Case Study / Guide]
pillar: [Which pillar this supports]
audience: [Who reads this]
cta: [What action we want]
proof-point: [What we're using as proof]
---

# [Title]

[Content body — formatted for the medium]

---

**CTA:** [Call-to-action link or instruction]

**Next Step:** Review above. Approve to proceed to tone check and publication planning.
```

## Example: Blog Post

---

**title:** "Ship Faster With Enterprise Security Built In"
**format:** Blog Post
**pillar:** Ship Securely, Not Slowly
**audience:** VP Engineering, Tech Leaders at growing companies
**cta:** "Download the guide: 5 ways to eliminate security review delays"
**proof-point:** Customer quote from Sarah Chen + statistics on review bottlenecks

---

# Ship Faster With Enterprise Security Built In

Most engineering leaders face a painful choice: move fast or stay secure. The assumption is that you can't do both.

It's wrong.

Security doesn't slow you down. *Poor security architecture* slows you down—because it forces manual reviews, creates bottlenecks, and makes every release a negotiation with the security team.

At Acme, we redesigned our entire development process around this insight: security should be baked in, not bolted on.

## The Problem: Security Review as Bottleneck

Here's what most companies do:

1. Engineers ship a feature
2. Security team reviews it (2 weeks to 2 months, depending on complexity)
3. Engineers fix issues, push again
4. Security re-reviews

This cycle kills velocity. It's not because the security team is slow—it's because reviewing bolted-on security is inherently slow.

Sarah Chen, VP Engineering at TechCorp, described it best:

> "We were shipping features every two weeks, but getting security sign-off took twice as long. It felt like we were building a car and then bolting on safety features afterward. Everything took longer."

When they switched to a security-first architecture, their timeline flipped: security review went from the bottleneck to an afterthought.

> "Security review time dropped from two weeks to two days. Build the feature, it's secure by default. We ship with confidence."

## How Security-First Architecture Works

Instead of treating security as a gate after development, secure architecture embeds security principles into every layer:

- **Authentication & authorization:** Built-in, not added
- **Data encryption:** Default, not optional
- **Compliance controls:** Automated, not manual
- **Audit logging:** Continuous, not retrospective

This means developers code confidently knowing the foundation is secure. Security teams review design, not implementation details. Release cycles speed up.

## The Math

For a company shipping 100 features per quarter:
- Traditional model: 100 features × 2-week security review = 200 weeks of delay per quarter
- Security-first model: 100 features × 2-day review = 20 weeks of delay per quarter

That's a 90% reduction in security-driven delays.

## What's the Catch?

Building security-first architecture requires upfront investment. You can't retrofit it onto existing code. But the payoff compounds:

- Faster releases
- Fewer security incidents
- Reduced compliance costs
- Happier engineering teams
- Less security team burnout

## The Trend

We're seeing this across the industry. Companies like Stripe, Twilio, and GitHub have made security-first architecture a competitive advantage. It signals maturity to enterprise buyers and enables startup-like velocity.

The companies that figure this out first will dominate their markets. The rest will keep trading velocity for security, or security for velocity.

## What to Do Next

1. **Audit your current model.** Where are security reviews slowing you down?
2. **Identify quick wins.** Where can you embed security without rearchitecting?
3. **Plan for rearchitecture.** What would it take to move to security-first?

We put together a guide on this based on working with 50+ engineering teams. It covers assessment, planning, and execution.

---

**CTA:** [Download the guide: "5 Ways to Eliminate Security Review Delays"]

**Next Step:** Review above. Approve to proceed to tone check and publication planning.

---
