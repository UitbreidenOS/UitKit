---
description: Design complete brand campaign with messaging pillars, content calendar (blog, social, email), distribution strategy, and performance targets. Returns draft campaign plan and content outline ready for human approval.
---

# /create-campaign

## What This Does

Executes a complete brand campaign planning pipeline. Takes your campaign objective, target audience, and messaging pillars. Designs a 2–4 week campaign with specific content pieces (blog posts, social series, email sequence), posting schedule, distribution channels, and success metrics. Outputs a campaign brief ready for human review and approval. All content is drafted for review but not published.

## Steps Claude Follows

1. **Collect campaign inputs**: Ask for campaign name, objective, target audience, key messaging pillars, and success metrics.
2. **Run messaging-architect skill**: Confirm messaging pillars align to customer jobs and differentiators. Adjust if needed.
3. **Run content-generator skill**: Draft specific content pieces (blog, social, email, case study) aligned to pillars. Create 5–8 content items per campaign.
4. **Run social-strategist skill**: Design 30-day social calendar with posting schedule, engagement targets, and channel breakdown.
5. **Run tone-enforcer skill**: Audit all drafted content for brand voice consistency, banned words, and proof density.
6. **Loop if failed**: If tone check fails, fix cited violations and re-audit until all content passes.
7. **Present campaign brief**: Display campaign objective, messaging pillars, full content calendar, distribution plan, and success metrics.
8. **Require approval**: Print approval prompt: "Review the campaign above. Reply APPROVE to move to publication planning, or request edits."
9. **Log to session**: Auto-log campaign draft to session-log.md with status DRAFTED, pending human approval.

## Output Format

```
# Campaign Brief

**Campaign Name:** [Name]
**Objective:** [What this campaign aims to achieve]
**Duration:** [Start date → End date]
**Target Audience:** [Who we're reaching]
**Success Metrics:** [Traffic, engagement, leads, etc.]

---

## Messaging Strategy

**Core Positioning:** [One sentence positioning for this campaign]

**Messaging Pillars:**
1. [Pillar name] — [Customer job] → [Your claim] → [Proof]
2. [Pillar name] — [Customer job] → [Your claim] → [Proof]
3. [Pillar name] — [Customer job] → [Your claim] → [Proof]

---

## Content Calendar

| Date | Format | Title | Channel | Status | CTA |
|---|---|---|---|---|---|
| Week 1, Day 1 | Blog | [Title] | Website | DRAFT | [Action] |
| Week 1, Day 2 | LinkedIn | [Title] | LinkedIn | DRAFT | [Action] |
| Week 1, Day 3 | Email | [Title] | Email | DRAFT | [Action] |
| Week 2, Day 1 | Case Study | [Title] | Website | DRAFT | [Action] |

---

## Content Pieces (Drafts)

### 1. Blog Post: [Title]

[Full draft ready for review]

Status: DRAFT | Pillar: [Pillar] | Target: X visits

---

### 2. LinkedIn Series: [Title]

**Post 1:** [Draft]
**Post 2:** [Draft]
**Post 3:** [Draft]
**Post 4:** [Draft]

Status: DRAFT | Pillar: [Pillar] | Target: X impressions, Y% engagement

---

### 3. Email Sequence: [Title]

**Touch 1:** [Subject + body draft]
**Touch 2:** [Subject + body draft]
**Touch 3:** [Subject + body draft]

Status: DRAFT | Pillar: [Pillar] | Target: Z% open rate, A% CTR

---

## Distribution Plan

**Week 1:** Blog + LinkedIn series launch. Email sequence to existing audience.
**Week 2:** Case study launch. Social amplification continues.
**Week 3:** Retargeting and promotion of top-performing pieces.
**Week 4:** Final email touch; campaign winds down.

**Channel Allocation:**
- Website: Blog + case study (organic search, direct traffic)
- Social: LinkedIn posts + tweets (community and engagement)
- Email: 3-touch sequence (direct to audience)

---

## Performance Targets

- **Blog traffic:** X visits, Y% CTR to email signup
- **Social engagement:** X impressions, Y% engagement rate
- **Email performance:** Z% open rate, A% CTR, B leads
- **Total campaign:** C visits, D leads, E% cost per acquisition

---

## Reviewer Verdict: ✓ PASS

All content passes tone, proof, and brand alignment checks.

---

**Next Step:** Review campaign brief above. Reply APPROVE to move to publication planning, or request specific edits.
```

## Example Run

```
You: /create-campaign

Claude: I'll help you plan a brand campaign. Please provide:
- Campaign name?
- Objective (what do we want to achieve)?
- Target audience?
- Key messaging pillars (2–4)?
- Success metrics?

You: "Ship Securely, Not Slowly" campaign, Establish thought leadership on security-first architecture, VP Engineering and CTO at Series A/B companies, pillars: Ship Securely Not Slowly, Grow Without Rip-and-Replace, Transparent Pricing. Success metric: 5K blog visits, 35% open rate on email, 500 LinkedIn impressions.

Claude: Designing "Ship Securely, Not Slowly" campaign...

---

# Campaign Brief

**Campaign Name:** Ship Securely, Not Slowly
**Objective:** Establish thought leadership on security-first architecture; drive qualified leads from VP Engineering at growth-stage companies
**Duration:** June 13 → July 10, 2026
**Target Audience:** VP Engineering, CTO at Series A/B SaaS companies (50–200 engineers)
**Success Metrics:** 5K blog visits, 35% email open rate, 500 LinkedIn impressions, 25 qualified leads

---

## Messaging Strategy

**Core Positioning:** "Enterprise-grade security doesn't have to slow you down."

**Messaging Pillars:**
1. Ship Securely, Not Slowly — Engineering teams want both velocity and security, but current architecture makes them choose
2. Grow Without Rip-and-Replace — Companies want to scale without rewriting infrastructure
3. Transparent Pricing — Scaling shouldn't surprise you with hidden enterprise costs

---

## Content Calendar

| Date | Format | Title | Channel | Status | Target |
|---|---|---|---|---|---|
| June 13 | Blog | "Ship Faster With Enterprise Security Built In" | Website | DRAFT | 2K visits |
| June 14 | LinkedIn | "Security reviews kill your velocity" (post 1 of 4) | LinkedIn | DRAFT | 300 impressions |
| June 15 | Email | "Why your security reviews take 2 weeks" | Email | DRAFT | 35% open |
| June 18 | Case Study | "TechCorp: From 2 weeks to 2 days" | Website | DRAFT | 500 visits |
| June 21 | Blog | "How to architect security-first" | Website | DRAFT | 1.5K visits |

---

## Content Pieces (Drafts)

### 1. Blog Post: "Ship Faster With Enterprise Security Built In"

[Full 1,500-word blog draft with customer quote, data, and call-to-action]

Status: DRAFT | Pillar: Ship Securely, Not Slowly | Target: 2K visits

---

### 2. LinkedIn Series: "Security Architecture Deep-Dive"

**Post 1:** "Security reviews are killing your velocity. Your architecture, not your team, is the bottleneck."

**Post 2:** "Most teams add security after the fact. Here's why security-first changes everything."

**Post 3:** "One customer cut their review time from 2 weeks to 2 days. Here's how."

**Post 4:** "Ready to ship faster? Here's where to start."

Status: DRAFT | Pillar: Ship Securely, Not Slowly | Target: 500 impressions, 8% engagement

---

### 3. Email Sequence: "Security Review Delays Cost You 90 Days of Engineering"

**Touch 1 (June 15):** "Why security reviews are your biggest release bottleneck"
**Touch 2 (June 18):** "How one company cut review time by 90%"
**Touch 3 (June 22):** "Ready to ship faster? We can help."

Status: DRAFT | Pillar: Ship Securely, Not Slowly | Target: 35% open, 12% CTR

---

## Distribution Plan

**Week 1 (June 13–19):** Blog launch + LinkedIn series begins (4 posts across week). Email sequence starts (Touch 1).
**Week 2 (June 20–26):** Case study launch. LinkedIn amplification continues. Email sequence Touch 2 sends.
**Week 3 (June 27–July 3):** Blog retargeting, social amplification of top performers. Email Touch 3 sends.
**Week 4 (July 4–10):** Final wrap-up, organic search momentum.

---

## Performance Targets

- **Blog traffic:** 3.5K visits across 2 posts
- **Social engagement:** 500 impressions, 8% average engagement rate
- **Email:** 35% open rate, 12% CTR, 25 leads
- **Case study:** 500 visits, 15% conversion to demo request
- **Total campaign:** 4.5K visits, 35 qualified leads

---

## Reviewer Verdict: ✓ PASS

All content passes brand voice, proof density, and tone alignment checks.
- Blog: ✓ PASS (removed "paradigm shift," added 3 customer proof points)
- LinkedIn: ✓ PASS (4 posts, debate-friendly hooks, aligned to pillars)
- Email: ✓ PASS (35% open rate target achievable; CTA clear)
- Case study: ✓ PASS (strong metrics and customer narrative)

---

**Next Step:** Review campaign brief above. Reply APPROVE to move to publication planning and calendar setup, or request specific edits.

Session logged to session-log.md as DRAFTED.
```
