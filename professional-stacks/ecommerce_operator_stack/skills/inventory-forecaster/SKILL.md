---
name: inventory-forecaster
description: Forecast inventory needs using sales velocity, seasonality, and lead time to prevent stockouts and overstock
allowed-tools: [Read, Write, Bash, Grep]
effort: high
---

## When to activate

- Planning reorder quantities and timing
- Preparing for seasonal demand shifts
- Analyzing sales velocity trends per SKU
- Evaluating supplier lead times and reliability
- Building safety stock calculations

## When NOT to use

- For real-time stock level checks (use inventory-manager)
- For dead stock identification
- For warehouse layout optimization

## Instructions

1. **Calculate sales velocity.** Units sold per day over 30/60/90-day windows per SKU.
2. **Detect seasonality.** Compare current velocity to same period last year; flag seasonal uplift or decline.
3. **Compute reorder point.** ROP = (avg daily sales × lead time days) + safety stock.
4. **Calculate safety stock.** SS = Z-score × std_dev(daily sales) × sqrt(lead time days) for desired service level.
5. **Forecast demand.** 90-day rolling forecast using weighted moving average (recent weeks weighted higher).
6. **Flag risks.** SKUs with lead time >14 days, high velocity variance, or single-supplier dependency.
7. **Generate reorder report.** SKU, current stock, velocity, ROP, recommended order qty, supplier, lead time.

## Example

```
SKU: WIDGET-BLUE-LG
Velocity: 12 units/day (30d avg)
Lead Time: 7 days
Safety Stock (95% service): 25 units
Reorder Point: (12 × 7) + 25 = 109 units
Current Stock: 87 units → REORDER NOW
Recommended Qty: 200 units (EOQ based on order cost + holding cost)
```
