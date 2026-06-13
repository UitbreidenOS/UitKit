---
description: Analyzes feature requirements and generates a comprehensive test plan with test cases, coverage goals, and acceptance criteria. Returns plan for human review and approval before test execution begins.
---

# /plan-tests

## What This Does

Runs the test-planner skill to analyze feature requirements and generate a detailed test plan. Identifies critical paths, coverage goals, risk areas, and acceptance criteria. Outputs structured plan saved to test-plans/{feature-slug}-plan.md.

## Steps Claude Follows

1. Ask for: feature name, requirements document (or reference), acceptance criteria
2. Run test-planner skill — full analysis (scope, risks, critical paths, coverage targets)
3. Generate test case outlines for each category (positive, negative, edge cases, integration)
4. Define coverage goals by module and set acceptance criteria
5. Assess risk areas requiring intensive testing
6. Save plan to test-plans/{feature-slug}-plan.md
7. Display the plan with a summary line: coverage targets + risk level + estimated effort

## Next Action Logic

- **Low Risk + Clear Requirements:** "Ready for /generate-tests"
- **Medium Risk:** "Review risky areas before test generation"
- **High Risk + Complex:** "Escalate for human review before proceeding"
- **Requirements Missing:** "Need more details on acceptance criteria before planning"

## Output Format

### Test Plan Summary
```
# Test Plan: [Feature Name]

**Risk Level:** [Low / Medium / High / Critical]
**Coverage Target:** [Unit: X%, Integration: X%, E2E: X%]
**Estimated Effort:** [X hours]

**Key Risk Areas:**
- [Risk 1] — [Mitigation]
- [Risk 2] — [Mitigation]

**Critical Test Paths:**
1. [Path 1]
2. [Path 2]
3. [Path 3]

**Acceptance Criteria:**
- [ ] Coverage targets met
- [ ] All P1/P2 bugs fixed
- [ ] No regressions detected
- [ ] Performance baselines achieved

[Full plan details below...]
```

### Test Plan Details
[Complete test plan with all sections from test-planner skill]

---
