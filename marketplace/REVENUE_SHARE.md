# Marketplace Revenue Share Model

How Claudient creators earn from the marketplace.

---

## Overview

Claudient's marketplace is a distribution channel for open-source **and paid** stacks. Publishers earn revenue share on each subscription to their stack.

**Bottom line:** Build once, earn recurring revenue forever.

---

## Split Structure

### Free Stacks (AGPL / CC-BY-SA)

- **Revenue share:** None (open-source, no subscription)
- **Monetization:** Community reputation, referrals, opportunities
- **Best for:** building your personal brand, attracting clients, contributing to OSS

### Paid Stacks (Proprietary or commercial license)

#### Tier 1: New Publisher (First 6 months)
- **Revenue split:** 70% to publisher, 30% to Claudient
- **Subscription model:** Monthly or annual (your choice)
- **Minimum price:** $5/month or $50/year
- **Payment processing:** Stripe (Claudient covers fees)

#### Tier 2: Established Publisher (6+ months, $1K+ earned)
- **Revenue split:** 80% to publisher, 20% to Claudient
- **Same subscription model, pricing, and processing**
- **Auto-upgrade:** Apply after 6 months of Tier 1 status

#### Tier 3: Enterprise Publisher (Coming 2026)
- **Custom revenue splits and terms**
- **White-label stacks under your brand**
- **Private SLA and dedicated support**

---

## How It Works

### 1. Build & Submit
Create a stack locally:
```
my-stack/
  ├── skills/           (10+ .md files)
  ├── commands/         (optional, 2+ files)
  ├── hooks/            (optional, 1+ files)
  ├── README.md         (detailed overview)
  └── MANIFEST.json     (metadata)
```

### 2. Submit for Review
Email [stacks@claudient.ai](mailto:stacks@claudient.ai):
- Stack folder (zip)
- README describing the stack
- Target audience (who is this for?)
- Pricing model (free, $X/month, etc.)
- Your Stripe account (for payouts)

Review takes 1–2 weeks. Criteria:
- ✅ Quality (well-documented, tested, no bloat)
- ✅ Completeness (10+ skills, cohesive domain)
- ✅ Brand fit (aligns with Claudient values)
- ✅ No duplication (not a copy of existing stack)

### 3. Approval & Publishing
- We publish to marketplace
- You get a marketplace listing with your name, bio, links
- Listing appears in `claudient.ai/marketplace` search

### 4. Monetization
Users subscribe to your stack:
- **Free tier:** Install from npm/github anytime
- **Paid tier:** $5–100+/month (your choice) for priority updates, custom features, support

Monthly revenue: `subscriptions × price × split %`

---

## Payout & Accounting

### Payment Schedule
- **Monthly payouts:** Earnings paid via Stripe to your bank account on the 15th of each month
- **Minimum threshold:** $20 minimum balance to trigger payout (holds accrue until threshold)
- **Payout currency:** USD (Stripe handles currency conversion)

### Tax & Legal
- **1099 / Self-employed:** You're responsible for reporting income to tax authorities
- **No withholding:** Claudient does not withhold taxes (your responsibility)
- **Invoice:** Claudient provides monthly earnings statement

### Transparency
- **Real-time dashboard:** See subscriptions, churn, MRR, and earnings at `claudient.ai/publisher-dashboard`
- **Detailed reporting:** CSV exports available for accounting/taxes

---

## Certification & Quality

### Certified Badge (🏅)
Stacks passing our quality review earn a "Certified" badge:
- 3+ ⭐ average rating (from users)
- 0 critical bugs reported in 3 months
- Active maintenance (updates 2+ times per quarter)

**Benefits:**
- Higher listing placement in marketplace search
- Featured in "Trending" and "Recommended" sections
- Co-marketing in newsletters

### Losing Certification
Certification is revoked if:
- Rating drops below 3⭐
- 3+ critical bugs reported and unfixed for 2+ weeks
- No updates for 6+ months
- Negative user feedback (spam, malware, poor quality)

---

## Examples & Earnings

### Example 1: Healthcare Compliance Stack
- **Domain:** HIPAA/GDPR-ready ML deployments
- **Price:** $20/month
- **Subscribers:** 15 after 6 months
- **Monthly revenue:** 15 × $20 = $300
- **Your earnings:** $300 × 70% (Tier 1) = **$210/month**
- **After 6 months:** upgrade to 80% = **$240/month**
- **Annual run-rate:** $2,400–$2,880

### Example 2: Indie Game Dev Stack
- **Domain:** Unity + Claude Code automation
- **Price:** $10/month (lower entry, high volume)
- **Subscribers:** 50 after 1 year
- **Monthly revenue:** 50 × $10 = $500
- **Your earnings:** $500 × 70% (Tier 1) = **$350/month**
- **After 1 year:** upgrade to 80% = **$400/month**
- **Annual run-rate:** $4,200–$4,800

### Example 3: Free + Upsell
- **Tier 1:** Free "Starter Stack" (drive adoption)
- **Tier 2:** Paid "Pro Stack" — advanced skills ($25/month)
- **Conversion:** 5% of free users → 500 subscribers at $25 = $12,500/month
- **Your earnings (Tier 2):** $12,500 × 80% = **$10,000/month**

---

## Terms & Disputes

### Prohibited Content
You cannot publish stacks that:
- Violate copyright (use others' code without permission)
- Contain malware, security vulnerabilities, or harmful scripts
- Bypass Claude Code's limitations or terms of service
- Promote illegal activities
- Spam, misleading titles, or fake reviews

Violation = immediate removal + forfeiture of earnings.

### Refund Policy
- **User refunds:** 30-day money-back guarantee (you refund via Stripe, not Claudient)
- **Chargeback disputes:** Stripe arbitrates; Claudient holds your earnings pending resolution

### IP Ownership
- **Your stack:** You own all IP (code, design, docs)
- **Claudient's license:** You grant Claudient a perpetual license to host, display, and distribute your stack
- **Termination:** You can delist anytime; we continue selling existing subscriptions (you don't earn)

---

## Growth Tips

### Drive Subscribers
1. **Add free samples** — release a free "lite" version to build trust
2. **Publish case studies** — show what your stack enables (case studies get featured)
3. **Update regularly** — new skills every month keep subscribers engaged
4. **Engage with reviews** — respond to all feedback (positive and negative)
5. **Co-market** — we promote top stacks in newsletters (earn it with quality + engagement)

### Tier 2 Upgrade Checklist
- [ ] 6+ months published
- [ ] $1,000+ in total earnings
- [ ] 3.5+ average rating
- [ ] 2+ updates in last 6 months
- [ ] Zero critical bugs reported

Email [stacks@claudient.ai](mailto:stacks@claudient.ai) with your metrics.

---

## Questions?

- **Revenue share:** [stacks@claudient.ai](mailto:stacks@claudient.ai)
- **Payout issues:** [billing@claudient.ai](mailto:billing@claudient.ai)
- **Quality/certification:** [quality@claudient.ai](mailto:quality@claudient.ai)
