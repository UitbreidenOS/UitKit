---
name: resource-allocator
description: Plan and optimize team/resource allocation across projects with capacity modeling and priority-based assignment
allowed-tools: [Read, Write, Bash, Grep]
effort: high
---

## When to activate

- Planning resource allocation for upcoming quarter
- Resolving resource conflicts across projects
- Modeling capacity for hiring decisions
- Optimizing utilization across teams
- Creating resource heat maps to identify overallocation

## When NOT to use

- For individual task assignment
- For project scheduling (use project management tools)
- For budget allocation (use budget-tracker)

## Instructions

1. **Inventory resources.** List all team members with skills, availability (FTE), and current assignments.
2. **Catalog projects.** Active and planned projects with resource needs, priority, and timeline.
3. **Build capacity model.** Available hours per person per week × utilization target (80%). Flag anyone over 85%.
4. **Match skills to needs.** Assign resources based on skill fit, development goals, and availability.
5. **Identify gaps.** Projects without sufficient resources — recommend hiring, contracting, or re-prioritization.
6. **Create allocation plan.** Week-by-week view showing each person's project assignments and utilization %.
7. **Monitor and rebalance.** Bi-weekly review: adjust for project delays, scope changes, and PTO.

## Example

```
Resource Allocation — Q3 2026

Team Member      | Current Util | Projects                    | Risk
Alice (Sr Eng)   | 95%          | Project A (60%), B (35%)     | OVERALLOCATED
Bob (Eng)        | 70%          | Project C (70%)              | Available
Carol (Designer) | 110%         | Project A (50%), D (60%)     | CRITICAL

Action: Move 20% of Carol's Project D work to contractor. Rebalance Alice to 80%.
```
