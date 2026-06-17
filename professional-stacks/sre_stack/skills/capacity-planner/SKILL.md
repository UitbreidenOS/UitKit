---
name: capacity-planner
description: Forecast infrastructure capacity — growth modeling, headroom analysis, and scaling triggers
allowed-tools: [Read, Write, Grep]
effort: high
---

## When to activate

- Forecast infrastructure capacity — growth modeling, headroom analysis, and scaling triggers
- SRE and reliability engineering workflows

## When NOT to use

- For application development tasks
- For security auditing

## Instructions

1. **Define objectives.** What reliability target or improvement are we aiming for?
2. **Measure current state.** Establish baseline metrics and identify gaps.
3. **Design approach.** Choose strategy, tools, and implementation plan.
4. **Implement.** Deploy monitoring, automation, or process changes.
5. **Validate.** Verify the change improves reliability without regressions.
6. **Document.** Create runbooks, playbooks, and knowledge base entries.

## Example

```
SRE Initiative: capacity-planner
Current state: Baseline metrics established
Target: 99.9% availability / 50% toil reduction
Implementation: 4-week rollout
Result: SLO met for 30 consecutive days
```
