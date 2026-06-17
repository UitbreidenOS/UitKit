---
name: pricing-optimizer
description: Optimize product pricing using competitor analysis, elasticity modeling, and margin protection rules
allowed-tools: [Read, Write, Bash, Grep]
effort: high
---

## When to activate

- Reviewing product pricing against competitors
- Modeling price elasticity to find optimal price points
- Setting dynamic pricing rules based on inventory velocity
- Protecting margins during promotional periods
- Analyzing price change impact on revenue and units

## When NOT to use

- For one-off discount code creation
- For subscription pricing (different model)
- For marketplace fee calculations

## Instructions

1. **Gather competitor prices.** Scrape or import competitor pricing for top 50 SKUs; track weekly.
2. **Calculate price positioning.** Your price vs. competitor avg: premium (>110%), parity (90-110%), discount (<90%).
3. **Model elasticity.** Track unit sales before/after price changes; compute elasticity coefficient per category.
4. **Set pricing rules.** Floor = cost + min margin (10%). Ceiling = competitor avg + 15%. Auto-adjust within band.
5. **Simulate scenarios.** Model revenue impact of ±5%, ±10% price changes on top 20 products.
6. **Protect margins.** Block any price below cost + 10%; flag prices below cost + 15% for review.
7. **Report recommendations.** Output: SKU, current price, competitor avg, recommended price, projected revenue impact.

## Example

```
Pricing Analysis — SKU: WIDGET-BLUE-LG
Current Price: $29.99
Competitor Avg: $32.50 (range: $27.99 - $38.99)
Position: Discount (92% of avg)
Elasticity: -1.3 (10% price increase → 13% unit decrease)
Recommendation: Increase to $31.99 (6.7% increase)
Projected Impact: +$2.00 margin, -4.2% units, net +$1,240/mo revenue
```
