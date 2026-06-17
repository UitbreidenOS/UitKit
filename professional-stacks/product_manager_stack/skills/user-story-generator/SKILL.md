---
name: user-story-generator
description: Converts a PRD into acceptance-criteria-driven user stories. Each story has format: "As a [persona] I want [action] so that [outcome]." Includes acceptance criteria (testable) and a complexity estimate (S/M/L). Returns a ranked list with dependencies noted.
allowed-tools: Read, Write
effort: medium
---

# User Story Generator

## When to activate
After a PRD is final and ready for engineering handoff. Use this to break the PRD into granular, testable user stories.

## When NOT to use
Do not use before the PRD is final — the PRD defines the scope and criteria that the stories inherit. Do not use for bug fixes — bugs have a different format.

## Instructions

1. Read the final PRD. Extract: personas, use cases, acceptance criteria, and non-scope.
2. For each use case in the PRD, write one user story in the format: "As a [persona] I want [action] so that [outcome]."
3. Attach the relevant acceptance criteria from the PRD to each story.
4. Add a complexity estimate: S (1–2 days), M (3–5 days), L (6+ days) or XL (10+ days).
5. Note any dependencies: "Blocked by [Story X]" or "Requires [Design/API/Data]."
6. Rank by dependency order and business priority.
7. Return the story list.

## Output Format

```
# User Stories — [Feature Name]

## Priority Tier 1 (Critical Path)

**Story 1: [User Story Title]**
As a [persona] I want [action] so that [outcome].

Acceptance Criteria:
- [ ] Can [do X]
- [ ] Will show [Y]

Complexity: [S/M/L/XL]
Dependencies: None

---

**Story 2: [User Story Title]**
As a [persona] I want [action] so that [outcome].

Acceptance Criteria:
- [ ] [testable criterion]

Complexity: [M]
Dependencies: Blocked by Story 1

---

## Priority Tier 2 (Nice-to-Have)
[Same format]

## Notes
- Total estimated effort: [X] story points / weeks
- Critical path: [Story 1] → [Story 2] → [Story 3] (~3 weeks if sequential, ~2 weeks if parallel)
```

---
