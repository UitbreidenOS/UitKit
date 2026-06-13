---
name: confluence-expert
description: "Confluence documentation: space architecture, page templates, macros, search optimisation, team handbook structure, and keeping docs from going stale"
updated: 2026-06-13
---

# Confluence Expert Skill

## When to activate
- Designing the structure of a new Confluence space
- Writing or improving a Confluence page (runbook, team handbook, decision record)
- Setting up macros and templates for consistent documentation
- Finding information in Confluence using advanced search
- Fixing a Confluence space that's grown unmaintainable
- Writing a Confluence-first documentation strategy for an engineering team

## When NOT to use
- Jira project management — use the jira-expert skill
- External documentation sites (Notion, GitBook) — different tools and conventions
- API documentation — use readme.io or a code-adjacent docs tool
- One-off documents — if it won't be maintained, Confluence isn't the right place

## Instructions

### Space architecture

```
Design the Confluence space structure for [team/company].

Team type: [engineering / product / company-wide / department]
Primary use: [runbooks / team handbook / project docs / decision records / all of the above]
Team size: [X people]
Expected pages: [X]

Recommended space structure:

ENGINEERING TEAM SPACE:
📁 Home (landing page with quick links)
📁 Team Handbook
  📄 Team norms and working agreements
  📄 Onboarding guide for new engineers
  📄 Meeting cadences
  📄 How we make decisions
📁 Architecture & Design
  📄 System overview
  📄 Architecture decision records (ADRs)
  📄 Data model
📁 Runbooks
  📄 Incident response runbook
  📄 Deployment runbook
  📄 [Service]-specific runbooks
📁 Projects
  📁 [Project name] — Q3 2026
    📄 Project brief
    📄 Technical design
    📄 Status updates
📁 How-To Guides
  📄 Local development setup
  📄 Database migrations
  📄 Releasing to production

COMPANY-WIDE KNOWLEDGE BASE:
📁 Home
📁 About [Company]
📁 Teams & People
📁 Policies & Processes
📁 Tools & Systems
📁 Projects & OKRs

Space hierarchy rules:
- Maximum 3 levels deep (page → child → grandchild) — deeper = hard to find
- Every space has a maintained home page with recent updates and quick links
- Use labels, not nested pages, for cross-cutting concerns

Design the space structure for my team with page templates for each section.
```

### Page templates

```
Create Confluence page templates for [team].

Templates needed: [runbook / project brief / ADR / meeting notes / post-mortem / team handbook page]

RUNBOOK TEMPLATE:
---
📋 [Service Name] Runbook — [Incident Type]
Owner: @[team] | Last updated: [date] | Severity: P1/P2/P3

## Quick summary
[1-2 sentences: what this runbook covers, when to use it]

## Prerequisites
- Access to: [tools, dashboards, CLI access needed]
- On-call Slack channel: [#channel]

## Triage (first 5 minutes)
1. [First action to take]
2. [Second action]
3. Is this a new deployment? → [Yes: follow rollback section | No: continue]

## Investigation steps
Step 1: [action] → Expected output: [X]
Step 2: [action] → Decision: [if Y, go to Section A / if Z, go to Section B]

## Mitigation
Option A (fastest): [action] → [what it does, risk]
Option B (proper fix): [action, requires deploy]

## Rollback procedure
[Exact commands or steps]
Rollback trigger: [when to use this vs. hotfix]

## Post-incident checklist
□ Incident resolved
□ Customer comms sent (if applicable)
□ Post-mortem scheduled (if P1/P2)
□ Runbook updated with new learnings

---

ADR TEMPLATE:
---
# ADR-[number]: [Decision title]
Date: [YYYY-MM-DD] | Status: Accepted / Proposed / Deprecated
Authors: @[names] | Reviewers: @[names]

## Context
[Why do we need to make this decision? What problem are we solving?]

## Decision
[What we decided, in one or two sentences]

## Rationale
[Why this option over alternatives?]

## Alternatives considered
| Option | Pros | Cons | Why rejected |
|---|---|---|---|
| [Option A] | ... | ... | ... |
| [Option B] | ... | ... | ... |

## Consequences
[What changes as a result of this decision?]
[What technical debt does this create or resolve?]

## Review date
[When should this decision be revisited?]
---

PROJECT BRIEF TEMPLATE:
---
# [Project Name]
Status: [Planning / In Progress / Complete] | Owner: @[name] | Target: [date]

## What and why
[2-3 sentences: what we're building and why it matters]

## Success criteria
□ [Measurable outcome 1]
□ [Measurable outcome 2]

## Out of scope
- [Thing we are explicitly not building]

## Timeline
| Milestone | Date | Owner |
|---|---|---|

## Open questions
- [ ] [Question to resolve]

## Links
- Jira epic: [link]
- Design: [Figma link]
- Slack: [#channel]
---

Generate the templates for my specific team and use cases.
```

### Confluence macros

```
Use Confluence macros to improve [page/space].

Page type: [runbook / project page / dashboard / knowledge base]
Goal: [better navigation / auto-updating content / richer formatting]

Most useful macros:

PAGE INDEX:
{children:page=Home}
Shows all child pages of a page — great for space home pages and section indexes.

TABLE OF CONTENTS:
{toc:minLevel=2|maxLevel=3}
Auto-generates TOC from headings — essential for long runbooks.

STATUS:
{status:colour=Green|title=Operational}
{status:colour=Red|title=Incident Active}
Use in runbook headers and service status pages.

INFO / WARNING / NOTE:
{info}This is informational content{info}
{warning}This step is irreversible{warning}
{note}Check Slack before proceeding{note}
Use for callouts in runbooks and guides.

EXPAND (collapsible sections):
{expand:title=Advanced configuration (click to expand)}
...detailed content...
{expand}
Use for optional detail that clutters the main flow.

JIRA ISSUES:
{jira:key=ENG-1234}
Embeds a Jira ticket inline. Use in project pages and status updates.

RECENTLY UPDATED:
{recently-updated:spaces=ENG|max=5}
Shows recent activity — useful on space home pages.

LIVE SEARCH:
{livesearch:spaceKey=ENG|labels=runbook}
Adds a search box scoped to specific content — useful for runbook landing pages.

INCLUDE (transclude another page):
{include:Page Title}
Pulls in another page's content — use for shared "contact lists" or "glossary" sections referenced in multiple runbooks.

Recommend macros for my specific page and generate the markup.
```

### Keeping docs fresh

```
Design a documentation maintenance strategy for [Confluence space].

Space: [describe]
Current problem: [outdated pages / hard to find / nobody updates / not trusted]
Team: [X people]
Docs types: [runbooks / handbook / project docs / ADRs]

Documentation rot causes:
1. No ownership — "team docs" are nobody's docs
2. No trigger — docs only get updated when someone finds an error (too late)
3. No visibility — nobody knows a page exists, so nobody updates it

Anti-rot strategies:

OWNERSHIP MODEL:
Every page has a named owner (a person, not a team).
Owner is responsible for reviewing the page every 6 months.
Use Confluence "Page Restrictions" or a footer template:
"Owner: @[person] | Review date: [date] | Last reviewed: [date]"

TRIGGERED UPDATES:
- Runbooks: updated after every incident that reveals a gap (part of post-mortem checklist)
- Onboarding guide: updated when a new engineer hits a blocker during onboarding
- API docs: updated as part of the PR that changes the API (not separately)
- ADRs: reviewed when the system they describe is significantly changed

ARCHIVING POLICY:
- Page with no updates in 12 months → add {status:colour=Yellow|title=Needs Review}
- Page with no updates in 18 months → move to "Archive" section
- Do not delete — archive. Audit trails matter.

DISCOVERABILITY:
- Every page has relevant labels applied (label taxonomy defined per space)
- Space home page has a "Recently updated" macro + search box
- Top-level section pages list all child pages with one-line descriptions
- Cross-link liberally: if you mention a runbook, link to it

TRUST SIGNALS:
- "Last verified by @[name] on [date]" footer on every runbook
- "This page is outdated — update it or it will be archived" banner macro for unreviewed pages
- Team norm: if you use a doc and find an error, fix it or raise it — docs are code

Build the maintenance strategy and page templates for my space.
```

## Example

**User:** Our Confluence is a graveyard — 400 pages, nobody knows what's current, engineers Google before they check Confluence. How do I fix it?

**Claude's recovery plan:**

This is a trust problem, not an information problem. Engineers stopped trusting Confluence because it was wrong too many times. Fixing that requires reducing the volume AND making the remaining content visibly trustworthy.

**Phase 1 — Triage (1 week, 1 person):**
Sort all 400 pages by "Last updated." Anything untouched > 2 years = archive immediately, no questions. That probably gets you to 150-200 pages.

**Phase 2 — Audit the survivors (2-3 weeks):**
For pages updated in the last 2 years, add one of three status labels:
- `verified-[date]` — a human confirmed this is accurate
- `needs-review` — nobody has verified this recently
- `archive-candidate` — outdated but historically relevant

Team policy: any page without a `verified-[date]` label in the last 12 months = treat with suspicion.

**Phase 3 — Build trust mechanics:**
Add to every runbook's footer:
> "Last verified by @[name] on [date]. If this is wrong, update it or @ the owner in #engineering."

This gives engineers a confidence signal AND a clear escalation path.

**Phase 4 — Fix the discovery problem:**
Build a space home page with:
- {recently-updated} macro showing last 10 changed pages
- Quick links to the 5 most-used runbooks
- {children} macro showing all top-level sections

**Most important rule going forward:**
Every runbook update is part of the post-incident checklist. If an engineer follows a runbook and it's wrong, they update it before the incident is closed. No exceptions. This single rule prevents >80% of future staleness.

---
