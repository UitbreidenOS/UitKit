---
name: requirements-analyzer
description: Reviews a PRD's acceptance criteria and flags vague or untestable criteria. Suggests measurable alternatives. Ensures criteria are outcome-focused ("can do X") not effort-focused ("should improve Y"). Returns a critique report with specific suggestions for refinement.
allowed-tools: Read
effort: low
---

# Requirements Analyzer

## When to activate
After the PRD is drafted, before it goes to engineering for review. Use this to catch ambiguous acceptance criteria before they cause rework.

## When NOT to use
Do not use on PRDs that haven't been drafted yet. Do not use on approved PRDs — this is a pre-approval quality gate.

## Instructions

1. Read the PRD. Extract all acceptance criteria.
2. For each criterion, ask: "Could I write an automated test for this?" If no, it's too vague.
3. Look for these red flags:
   - Effort-focused language: "should improve," "make faster," "optimize," "enhance"
   - Vague metrics: "good performance," "intuitive," "user-friendly," "robust"
   - Passive voice: "is optimized," "should be added"
4. Suggest a more testable alternative for each vague criterion.
5. Rate the overall quality: "Ready for eng" or "Needs revision" + list of specific fixes.

## Output Format

```
# PRD Requirements Review — [Feature Name]

## Flagged Criteria (Needs Revision)

**Original:** "Users can improve their workflow efficiency"
**Issue:** Vague metric ("efficiency"); effort-focused
**Suggested:** "Users can complete [task X] in under [Y seconds]" with baseline measurement

---

**Original:** "Performance should be optimized"
**Issue:** Untestable; no metric defined
**Suggested:** "API response time is under 500ms for 95th percentile requests" with baseline measure

---

## Approved Criteria (Ready for Eng)
- [Criterion 1]: Testable, outcome-focused ✓
- [Criterion 2]: Measurable, has baseline ✓

## Overall Assessment
[Ready for eng / Needs revision on X items]

Estimated revision time: [15 min / 1 hour / etc]
```

---
