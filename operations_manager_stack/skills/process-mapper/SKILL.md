---
name: process-mapper
description: Document and optimize business processes with flowcharts, bottleneck analysis, and future-state design
allowed-tools: [Read, Write, Grep]
effort: medium
---

## When to activate

- Documenting current-state business processes
- Identifying bottlenecks, redundancies, and handoff delays
- Designing future-state optimized processes
- Creating process flowcharts and swimlane diagrams
- Conducting process audits for continuous improvement

## When NOT to use

- For software architecture design
- For project management plans
- For organizational restructuring

## Instructions

1. **Scope the process.** Define start/end points, stakeholders, and key inputs/outputs.
2. **Map current state.** List every step sequentially: who does what, what tools, what triggers, what's the output.
3. **Identify bottlenecks.** Flag steps with: long wait times, manual handoffs, approval gates, rework loops.
4. **Quantify impact.** Time per step, error rate, cost per cycle, and throughput.
5. **Design future state.** Eliminate, automate, or consolidate bottleneck steps. Target 20-40% cycle time reduction.
6. **Create swimlane diagram.** Visual map showing roles, steps, decision points, and handoffs.
7. **Build implementation plan.** Prioritized changes with effort/impact matrix and 30/60/90-day milestones.

## Example

```
Current State: Invoice Processing (5 days avg)
Step 1: Receive invoice via email → AP clerk (0.5 days)
Step 2: Manual data entry into ERP → AP clerk (0.5 days) ← BOTTLENECK
Step 3: Match to PO → AP clerk (1 day)
Step 4: Manager approval → Manager (2 days) ← WAIT
Step 5: Payment processing → Finance (1 day)

Future State: Invoice Processing (1.5 days target)
- Auto-capture via OCR (eliminates Step 2)
- Auto-match POs under $5K (eliminates Step 3 for 70% of invoices)
- Auto-approve under $1K (eliminates Step 4 for 40% of invoices)
```
