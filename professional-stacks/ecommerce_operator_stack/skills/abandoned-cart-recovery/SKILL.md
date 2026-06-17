---
name: abandoned-cart-recovery
description: Design and execute abandoned cart recovery campaigns with email sequences, incentives, and analytics
allowed-tools: [Read, Write, Bash, Grep]
effort: medium
---

## When to activate

- Setting up abandoned cart email sequences
- Analyzing cart abandonment rates and patterns
- Designing recovery incentives (discounts, free shipping)
- A/B testing recovery campaign effectiveness
- Integrating with Shopify/WooCommerce cart APIs

## When NOT to use

- For general email marketing campaigns
- For post-purchase follow-ups
- For loyalty program design

## Instructions

1. **Measure abandonment rate.** Calculate cart abandonment % = (carts created - purchases completed) / carts created over 30 days.
2. **Segment abandoned carts.** Group by cart value, product category, traffic source, and device type.
3. **Design recovery sequence.** Create 3-email flow: reminder (1h), incentive (24h), urgency (72h).
4. **Set incentive rules.** Offer tiered discounts based on cart value — 5% for <$50, 10% for $50-$150, free shipping for >$150.
5. **Implement tracking.** Tag recovery emails with UTM parameters; track recovery rate, revenue recovered, and ROI.
6. **A/B test subject lines and CTAs.** Run 50/50 splits on email variants; measure open rate, click rate, and conversion.
7. **Report weekly.** Dashboard: abandonment rate, recovery rate, revenue recovered, top abandoned products.

## Example

```
Recovery Email #1 (1 hour after abandonment):
Subject: "You left something behind — [Product Name] is waiting"
CTA: "Complete your order"
Incentive: None (reminder only)

Recovery Email #2 (24 hours):
Subject: "10% off your cart — just for you"
CTA: "Claim your discount"
Incentive: 10% off, expires in 48h
```
