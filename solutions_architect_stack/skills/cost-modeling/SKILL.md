---
name: cost-modeling
description: Model solution costs — cloud infrastructure, licensing, personnel, and total cost of ownership analysis
allowed-tools: [Read, Write, Grep]
effort: medium
---

## When to activate

- Estimating total cost of ownership (TCO) for proposed solutions
- Comparing build vs buy costs for architectural decisions
- Creating cloud cost projections for solution proposals
- Optimizing existing solution costs through right-sizing

## When NOT to use

- For personal financial planning
- For simple pricing page calculations
- For procurement negotiations

## Instructions

1. **Inventory components.** List all infrastructure, services, licenses, and personnel needed.
2. **Estimate usage.** Project traffic, storage, compute requirements at launch and at scale.
3. **Model costs.** Use provider pricing calculators. Include data transfer, API calls, support tiers.
4. **Compare options.** Build vs buy, different providers, different architectures.
5. **Present TCO.** 3-year projection with growth assumptions. Include hidden costs (migration, training, maintenance).
6. **Optimize.** Identify reserved instances, spot opportunities, right-sizing candidates.

## Example

```
Solution Cost Model: Microservices migration

Year 1:
  Compute (EKS):     $8,400/mo → $100,800/yr
  Database (RDS):    $3,200/mo → $38,400/yr
  Storage (S3):      $800/mo → $9,600/yr
  Data transfer:     $1,200/mo → $14,400/yr
  Monitoring:        $600/mo → $7,200/yr
  Personnel (0.5 SRE): $90,000/yr
  Total Year 1: $260,400

Year 3 (at 5x scale):
  Total: $580,000/yr (with reserved instances: $490,000/yr)

vs Monolith (current): $180,000/yr (hitting scaling limits at ~10x)
```
