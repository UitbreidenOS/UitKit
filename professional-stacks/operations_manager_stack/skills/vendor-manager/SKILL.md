---
name: vendor-manager
description: Track vendor relationships, monitor SLA compliance, manage contracts, and evaluate vendor performance
allowed-tools: [Read, Write, Bash, Grep]
effort: medium
---

## When to activate

- Reviewing vendor performance and SLA compliance
- Preparing for contract renewals or renegotiations
- Evaluating new vendor proposals
- Managing vendor risk and contingency plans
- Consolidating vendor spend for cost optimization

## When NOT to use

- For procurement/purchasing transactions
- For legal contract drafting (use legal team)
- For employee/vendor relationship disputes

## Instructions

1. **Catalog all vendors.** Name, category, contract value, renewal date, primary contact, and SLA terms.
2. **Score performance.** Rate each vendor quarterly: delivery quality, timeliness, responsiveness, cost competitiveness (1-5 scale).
3. **Track SLA compliance.** Monthly report: uptime, response time, resolution time vs. contractual targets.
4. **Flag risks.** Single-source dependencies, vendors with declining scores, contracts expiring within 90 days.
5. **Build renewal calendar.** 90-day advance notice for each contract renewal with recommendation: renew/renegotiate/replace.
6. **Conduct vendor reviews.** Quarterly business reviews for top-10 vendors by spend.
7. **Optimize spend.** Identify consolidation opportunities, negotiate volume discounts, benchmark against market rates.

## Example

```
Vendor Scorecard — Q2 2026:
| Vendor       | Category    | Spend   | Quality | Timeliness | Overall | Action         |
|-------------|-------------|---------|---------|------------|---------|----------------|
| CloudHost   | Infrastructure | $45K/mo | 4.5   | 4.2        | 4.3     | Renew          |
| OfficeMax   | Supplies    | $3K/mo  | 3.0     | 2.5        | 2.8     | Issue warning  |
| CleanCo     | Facilities  | $8K/mo  | 4.8     | 4.9        | 4.8     | Expand scope   |

Contracts expiring next 90 days: CloudHost (Aug 15), CleanCo (Sep 1)
```
