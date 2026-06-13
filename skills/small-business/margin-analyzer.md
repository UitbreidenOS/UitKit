---
name: margin-analyzer
description: "Compute gross margin by product line, customer segment, and channel; flag thin-margin items; find where you actually make money"
updated: 2026-06-13
---

# Margin Analyzer

## When to activate
- You're considering a price change and want to know the impact before you commit
- You're deciding which products to promote in a campaign and want to push the most profitable ones
- Quarterly business review and you suspect some products or customer types are losing you money
- Your revenue is growing but profit is not — you need to find the leak

## When NOT to use
- Full P&L analysis including overhead allocation — use your accountant for that
- Multi-year financial projections for investors or lenders
- Tracking margins over time automatically — this is a point-in-time analysis, not a live dashboard

## Instructions

### What to give Claude

For each product or service, provide three numbers:
1. Sale price (what you charge the customer)
2. Cost to deliver (everything it takes to produce or fulfill that one unit)
3. Volume (how many you sell per month)

Cost to deliver must be specific to be useful. Include: materials, packaging, supplier cost, per-unit labor (hours × your labor cost per hour), platform or marketplace fees, payment processing fees, shipping if you absorb it. If you sell a service, estimate the hours per engagement × your blended hourly cost.

If you sell through multiple channels — your own website, Amazon, a wholesale account — give Claude the price and cost per channel separately. Platform fees and shipping vary enough that channel margin is often very different from your headline margin.

### What Claude computes

Gross margin per product: (sale price minus cost to deliver) divided by sale price, expressed as a percentage.

Claude ranks every product from highest to lowest margin and flags anything below the floor you set. If you do not set a floor, Claude uses 20% as the default minimum — below that, most businesses are not covering overhead contribution.

Claude also produces:
- Your revenue-weighted average margin (not just the simple average — weighted by how much you actually sell of each item)
- Which products are generating the most gross profit in dollar terms, not just percentage terms (a 70% margin product you sell 5 of is worth less than a 35% margin product you sell 200 of)
- Where pricing has not kept pace with cost increases (if you tell Claude what your costs were a year ago versus now)

### Customer segment analysis

If you have different customer types — individual vs. business, small vs. enterprise, one-time vs. recurring — tell Claude the revenue and cost to serve per segment. Cost to serve includes: time spent on support, onboarding, account management, returns or revisions.

Small customers often cost more per dollar of revenue than large ones. Claude will show you where this is happening and quantify the difference.

### Channel analysis

Paste your per-channel numbers. Claude shows you what you net after platform fees on each channel:

- Direct sales (your website): no marketplace fee, but you pay for traffic
- Marketplace (Amazon, Etsy, eBay): 8-15% fee off the top plus fulfillment
- Wholesale: 40-50% discount from retail, but no customer service cost
- App stores: 15-30% platform fee

The channel that generates the most revenue is often not the most profitable channel. Claude makes this visible.

### Pricing gap check

Tell Claude your current costs and your current price. Then tell Claude what those costs were 12 months ago. Claude calculates how much margin you've lost to cost inflation and what price increase would restore it — expressed as a dollar amount, not just a percentage, so you can see whether it's a defensible price change.

---

### Prompt template

```
Please analyze my margins. Here are my products/services:

Product 1: [name]
- Sale price: $[X]
- Cost to deliver: $[Y] (breakdown: [materials $X, labor $X, platform fee $X])
- Monthly volume: [units]

Product 2: [name]
- Sale price: $[X]
- Cost to deliver: $[Y]
- Monthly volume: [units]

[repeat for each product]

My margin floor is [X]% — flag anything below this.

Also: I sell through [channels]. Here are the channel-specific numbers: [details]

Questions:
1. Which product should I prioritize in my next marketing campaign?
2. Which products are candidates for a price increase?
3. What is my revenue-weighted average margin?
```

## Example

You run a Shopify store with three product lines. You give Claude prices, costs (including the 2.9% + $0.30 Shopify payment fee per transaction), and monthly sales volume.

Claude outputs:

| Product | Sale Price | COGS | Gross Margin | Monthly Units | Monthly Gross Profit |
|---|---|---|---|---|---|
| Handmade candles | $42 | $13.50 | 68% | 90 units | $2,565 |
| White-label diffusers | $65 | $46.80 | 28% | 140 units | $2,548 |
| Digital scent guides | $12 | $1.05 | 91% | 55 units | $598 |

Revenue-weighted average margin: 51%

Claude flags: White-label diffusers are above the 20% floor but well below your handmade candle margin. At 140 units per month they generate nearly the same gross profit as your 68% margin product — but they tie up inventory capital and require fulfillment labor. If supplier costs increase by 5%, diffusers drop to 22% margin and one more cost increase puts them below floor.

Recommendation: Shift paid ad spend to handmade candles (highest margin %) and digital guides (highest margin %, no fulfillment). Review diffuser pricing — a $7 price increase brings margin to 37% and is unlikely to reduce volume significantly given your current price position.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
