---
description: Write a complete product requirements document (PRD) from a feature brief. Outputs a full PRD with problem statement, solution, user personas, use cases, acceptance criteria, success metrics, dependencies, risks, competitive context, and non-scope.
---

# /write-prd

## What This Does
Runs the prd-outliner skill to generate a complete, stakeholder-ready PRD from a feature concept.

## Steps Claude Follows
1. Ask for the feature brief: problem statement, customer segment, rough solution idea, and any available data on impact.
2. Run competitive-mapper skill to research how competitors solve this. (Optional: if competitive research is already done, skip.)
3. Run prd-outliner skill to draft the full PRD.
4. Run requirements-analyzer on the acceptance criteria to catch vagueness.
5. Run success-metrics-definer on the success metrics to ensure they're measurable.
6. Present the final PRD and ask: "Ready to review with stakeholders? Or refine further?"

## Output Format

```
# [Feature Name] — PRD

[Full PRD content with all required sections]

---

## Quality Checklist
- [ ] Problem statement is clear and data-backed
- [ ] Acceptance criteria are testable (not vague)
- [ ] Success metrics have baselines and targets
- [ ] Dependencies are listed and realistic
- [ ] Competitive positioning is clear
- [ ] Non-scope prevents creep

Status: [Ready for stakeholder review / Needs refinement]
```

## Notes
- This command is the gateway to the product pipeline. Every feature must have a PRD before work starts.
- The PRD is living documentation — you'll update it as you learn, but the core acceptance criteria and success metrics should not change.
