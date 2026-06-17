# Growth Channel Auditor

Audit acquisition channels by CAC (Cost Acquisition Cost), LTV (Lifetime Value), and payback period.

## When to activate
User requests `/audit-channels` with channel spend and revenue data.

## Instructions
1. Calculate CAC per channel (total spend ÷ new users)
2. Calculate LTV per cohort (total revenue generated per user)
3. Compute payback period (months to recover CAC)
4. Rank channels by LTV/CAC ratio
5. Recommend budget reallocation: increase winners, pause losers

## Example
| Channel | CAC | LTV | Ratio | Payback |
|---|---|---|---|---|
| Organic | $5 | $150 | 30x | 1 mo |
| PPC | $50 | $100 | 2x | 6 mo |
| Paid Social | $30 | $80 | 2.7x | 4 mo |

Recommendation: Reallocate 30% of PPC budget to organic and paid social.
