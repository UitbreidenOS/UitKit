---
name: order-fulfillment-tracker
description: Track order fulfillment pipeline from placement to delivery with SLA monitoring and exception handling
allowed-tools: [Read, Write, Bash, Grep]
effort: medium
---

## When to activate

- Monitoring order fulfillment status across channels
- Tracking SLA compliance (same-day/next-day processing)
- Identifying stuck or delayed orders
- Generating fulfillment performance reports
- Coordinating with shipping carriers for delivery issues

## When NOT to use

- For order placement and validation (use order-processor)
- For return/refund processing
- For inventory reservation logic

## Instructions

1. **Pull order pipeline.** Query orders by status: pending → processing → packed → shipped → delivered.
2. **Calculate processing time.** Hours from order placement to "shipped" status; flag orders exceeding SLA.
3. **Track carrier updates.** Monitor tracking number status; flag "no movement" >48h after label creation.
4. **Identify exceptions.** Orders with: address issues, payment hold, partial shipment, or carrier damage.
5. **Compute SLA metrics.** % same-day processed, % next-day processed, average time-to-ship, on-time delivery rate.
6. **Generate daily report.** Orders by status, SLA compliance, exception count, carrier performance.
7. **Escalate stuck orders.** Auto-flag orders not shipped within 24h to fulfillment team with root cause.

## Example

```
Daily Fulfillment Report — 2026-06-13:
Total Orders: 342
Pending: 12 | Processing: 28 | Packed: 45 | Shipped: 198 | Delivered: 59
SLA Compliance: 96.2% same-day, 99.1% next-day
Exceptions: 3 (2 address issues, 1 payment hold)
Avg Time-to-Ship: 4.2 hours
```
