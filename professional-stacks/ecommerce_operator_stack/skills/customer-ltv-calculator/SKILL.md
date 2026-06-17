---
name: customer-ltv-calculator
description: Calculate customer lifetime value using historical purchase data, cohort analysis, and predictive modeling
allowed-tools: [Read, Write, Bash, Grep]
effort: high
---

## When to activate

- Calculating customer LTV for marketing budget allocation
- Building cohort-based retention and revenue models
- Identifying high-value customer segments
- Forecasting recurring revenue from existing customers
- Evaluating CAC:LTV ratios for channel efficiency

## When NOT to use

- For one-time purchase analysis (use analytics-reporter)
- For real-time cart value calculations
- For subscription billing management

## Instructions

1. **Extract purchase history.** Pull order data: customer_id, order_date, order_value, product_category, channel.
2. **Build cohort table.** Group customers by first-purchase month; track retention and repeat purchase rates over 12 months.
3. **Calculate historical LTV.** Sum total revenue per customer; compute mean, median, and percentile distributions.
4. **Model predictive LTV.** Use RFM scoring (Recency, Frequency, Monetary) to project 12-month and 24-month LTV.
5. **Segment by LTV tier.** Classify: VIP (top 10%), High (10-30%), Medium (30-70%), Low (bottom 30%).
6. **Compute CAC:LTV ratio.** By acquisition channel — target minimum 3:1 LTV:CAC for sustainable growth.
7. **Output report.** Cohort heatmap, LTV distribution chart, segment counts, and channel efficiency matrix.

## Example

```
LTV Formula:
LTV = (Average Order Value × Purchase Frequency × Customer Lifespan) × Gross Margin %

Cohort LTV (6-month):
Jan 2026 cohort: $127 avg LTV, 34% retention at M6
Feb 2026 cohort: $142 avg LTV, 38% retention at M5
```
