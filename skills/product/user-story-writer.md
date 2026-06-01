---
name: user-story-writer
description: "Convert rough feature ideas into well-structured user stories with acceptance criteria and edge cases"
---

# User Story Writer Skill

## When to activate
- Converting a rough feature request or idea into a structured user story
- Writing acceptance criteria for a story already in the backlog
- Identifying edge cases and error states that engineering needs to handle
- Breaking an epic down into sprint-sized stories
- Refining a vague stakeholder request into something a dev can build
- Writing the "definition of done" for a feature

## When NOT to use
- Full PRD writing — use `/code-to-prd` for converting existing code, or write it from scratch
- High-level roadmap decisions — use `/product-roadmap`
- Discovery before the feature is defined — use `/product-discovery` first
- API contract or technical spec — that's engineering, not PM

## Instructions

### Core story writing prompt

```
Write a user story for this feature idea: [DESCRIBE THE IDEA IN YOUR OWN WORDS]

Context:
- Product: [what product this is for]
- User type: [who the primary user is — role, context, technical level]
- Why this matters: [business or user outcome this enables]
- Related existing features: [what already exists that this connects to]
- Known constraints: [technical, design, legal, or business constraints to respect]

Produce the full user story:

## Story title
[Action-oriented, specific — not "Implement export" but "Export report data to CSV for analysis in Excel"]

## User story
As a [specific user type — not "user" but "enterprise admin" or "data analyst"],
I want to [specific action with enough detail to build],
So that [outcome — what they can now do that they couldn't before].

## Context and motivation
[2-4 sentences: why does this user have this need? What are they trying to accomplish? What breaks today without this?]

## Acceptance criteria
Format: Given [precondition] / When [action] / Then [result]

Write enough AC to fully specify the happy path AND the main error states.
Minimum 5, maximum 12 criteria. If you need more than 12, the story is too big — split it.

Happy path AC:
- Given [...]  / When [...] / Then [...]
- [...]

Error / edge case AC:
- Given [...]  / When [...] / Then [...]
- [...]

## Edge cases and error states
List explicitly (as bullets) the things that could go wrong:
- What if [state X]? Expected behaviour: [Y]
- What if the data is [empty / malformed / too large]? Expected: [Y]
- What happens if the user is [logged out / lacking permission / on mobile]?

## Out of scope (explicit)
What is NOT included in this story that someone might assume is:
- [Exclusion 1]
- [Exclusion 2]

## Definition of done
The story is done when:
- [ ] All acceptance criteria pass
- [ ] Unit tests cover happy path and top 2 error cases
- [ ] Design reviewed and signed off
- [ ] Works on [mobile / desktop / both] at [screen size]
- [ ] Accessibility: [keyboard navigable / screen reader tested / WCAG level]
- [ ] Product reviewed and signed off before merge

## Story size estimate
Complexity: [XS / S / M / L / XL]
Rough story points: [1 / 2 / 3 / 5 / 8 / 13]
Rationale: [why this size — what makes it complex or simple]
```

### Epic decomposition

```
Break this epic into sprint-sized user stories.

Epic: [describe the epic — high-level feature or initiative]
Epic goal: [what outcome does this epic achieve when fully done?]
Team sprint velocity: [X story points per sprint]
Target delivery: [date or sprint target]

Epic breakdown rules:
- Each story should be completable in a single sprint (≤ 5 story points ideally)
- Each story should be independently deliverable (can go to prod without the next one)
- Stories should follow the vertical slice pattern — thin end-to-end slices, not horizontal layers
  (don't make "backend API" and "frontend UI" separate stories — that's a technical split, not a user-value split)
- Order stories by value: which story alone delivers the most user value?

For each story in the epic:
1. Story title and user story format
2. 3-5 acceptance criteria (abbreviated — full AC comes when the story is in sprint planning)
3. Story points estimate
4. Dependencies on other stories (if any)
5. Can this story go to production without the next one? (Yes / No — if No, explain)

Produce the story map: [Epic] → [Stories in priority order]
Identify the MVP slice: the minimum set of stories that makes the epic usable.
```

### Acceptance criteria generator

```
Write acceptance criteria for this story: [PASTE EXISTING STORY]

Rules for good AC:
- Written in Given/When/Then format (Gherkin-compatible if using Cucumber)
- Tests one thing at a time — not "user can do X and Y and Z"
- Specific enough that two engineers would implement the same thing
- Covers: happy path, validation errors, empty states, permission edge cases, loading states
- Avoids implementation details: "the button turns green" is bad; "the user sees a success confirmation" is good

AC quality checklist — every AC should pass:
✅ Can a QA engineer write a test from this AC alone? If no, too vague.
✅ Is the expected outcome observable (visible, measurable, testable)? If no, rewrite.
✅ Does this AC capture a user behaviour, not an implementation choice? If no, rephrase.
✅ Could two engineers interpret this differently? If yes, add specificity.

Generate [N] acceptance criteria for my story, covering:
- Happy path (main success scenario)
- Input validation (bad data, missing required fields)
- Edge cases (empty state, maximum limits, concurrent actions)
- Error handling (what happens when the backend fails)
- Permission / auth states (if relevant)
```

### Story splitting techniques

```
This story is too large (estimated [X] points). Help me split it.

Story to split: [PASTE STORY]
Team constraint: stories should be ≤ [3 / 5] story points

Splitting approaches (pick the right one based on the story):

1. BY WORKFLOW STEP:
   If the story covers multiple steps in a flow, split by step.
   Example: "User can complete onboarding" →
   - Story 1: User can enter name and email (step 1)
   - Story 2: User can verify email address (step 2)
   - Story 3: User can select plan (step 3)

2. BY BUSINESS RULE:
   If the story has multiple rules or conditions, split by rule.
   Example: "Admin can filter users by multiple criteria" →
   - Story 1: Filter by status (active / inactive)
   - Story 2: Filter by role
   - Story 3: Filter by signup date range

3. BY HAPPY PATH FIRST:
   Build the happy path, skip error handling and edge cases.
   Example: "Export to CSV with full validation" →
   - Story 1: Export to CSV (happy path only, no validation)
   - Story 2: Add validation — what if no data? Too many rows? Export in progress?

4. BY DATA VARIATION:
   If the story works differently for different data types, split by type.
   Example: "User can upload a document" →
   - Story 1: Upload PDF
   - Story 2: Upload DOCX and XLSX
   - Story 3: Handle oversized files and format errors

5. BY CRUD OPERATIONS:
   Split Create / Read / Update / Delete into separate stories if large.
   Only do this if each operation has independent user value.

Recommend the best split for my story and produce the sub-stories.
```

### Story quality checker

```
Review this user story for quality. [PASTE STORY]

Run this checklist:

STORY FORMAT:
✅ Is there a clear "As a [user], I want [action], so that [outcome]" format?
✅ Is the user type specific (not just "user" or "admin")?
✅ Is the "so that" an outcome (not a feature)?

ACCEPTANCE CRITERIA:
✅ Are there at least 4 AC?
✅ Does each AC use Given/When/Then or an equivalent structured format?
✅ Are the AC testable and specific enough to write an automated test?
✅ Does at least one AC cover an error or edge case?
✅ Any AC that references UI implementation details that should be removed?

SIZE:
✅ Is the story ≤ 5 story points (2-3 days of work)?
✅ If > 5 points, is there a clear reason why it can't be split?

DEFINITION OF DONE:
✅ Is there an explicit definition of done?
✅ Does it include: tests, design review, accessibility, product sign-off?

INDEPENDENCE:
✅ Can this story be built and deployed without waiting for another story?
✅ If not, is the dependency explicitly called out?

OUT OF SCOPE:
✅ Is there an explicit "out of scope" or "not included" section?

Grade the story: [Ready for sprint / Needs refinement / Needs significant rework]
List the top 3 changes to make it sprint-ready.
```

## Example

**User:** We need a way for users to export their data. It's been requested a lot. Our users are mostly data analysts who want to crunch numbers in Excel.

**Output:**

```markdown
# Story: Export dashboard data to CSV for offline analysis

## User story
As a **data analyst** who uses the dashboard to track campaign performance,
I want to **export the current view's data to a CSV file**,
So that **I can load it into Excel or Google Sheets for custom analysis and stakeholder reports**.

## Context and motivation
Data analysts regularly need to share performance data with stakeholders who don't have dashboard access, or run analyses that require formulas and custom calculations that the dashboard doesn't support. Today they screenshot tables or manually copy data into spreadsheets — this is error-prone and time-consuming for large datasets.

## Acceptance criteria

**Happy path:**
- Given I am viewing a data table on the dashboard / When I click "Export to CSV" / Then a CSV file downloads to my computer within 3 seconds
- Given the exported CSV / When I open it in Excel or Google Sheets / Then all column names match the table headers, and all visible rows are present with correct data types (numbers as numbers, dates as dates, not strings)
- Given filters are applied to the table / When I export / Then only the filtered (visible) rows are exported, not the full dataset
- Given the table has column sorting applied / When I export / Then the CSV preserves the sort order shown in the UI

**Validation and edge cases:**
- Given the table is empty (no data matches the current filters) / When I click Export / Then I see a message: "No data to export — try adjusting your filters" and no file downloads
- Given the table has more than 50,000 rows / When I click Export / Then I see a warning: "This export contains 50,000+ rows and may take up to 30 seconds. Continue?" with Cancel and Export options
- Given I click Export on a table with 50,000+ rows and confirm / When the export is processing / Then I see a progress indicator and can continue using the dashboard while it prepares
- Given the export fails due to a server error / Then I see: "Export failed — please try again or contact support if this continues" and can retry without refreshing the page

**Permissions:**
- Given I am on a Free plan / When I attempt to export / Then I see an upgrade prompt: "CSV export is available on Pro and above" with a link to upgrade

## Out of scope
- Export to Excel (.xlsx) format — CSV only in this story
- Scheduled or automated exports — manual only
- Exporting charts or visualisations — data tables only
- Selecting specific columns to export — all visible columns are exported

## Definition of done
- [ ] All 8 acceptance criteria pass
- [ ] Unit tests cover happy path and "empty state" edge case
- [ ] E2E test covers download flow in Chrome and Firefox
- [ ] Design reviewed — export button placement approved
- [ ] Works on desktop (1280px+) — mobile not required for this story
- [ ] Product signed off before merge

## Story size: Medium — 3 story points
Rationale: Core export logic is straightforward; the 50,000+ row handling adds a meaningful async pattern that engineers will need to design carefully.
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
