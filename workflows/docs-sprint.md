# Docs Sprint Workflow

A step-by-step workflow for a focused documentation sprint — from content audit through writing, review, and publication — using Claude Code skills throughout.

---

## When to run this workflow

- A new product or feature ships and needs documentation before the announcement
- You've identified a docs gap from analytics (high exit rates, failed searches, support ticket correlation)
- Quarterly: planned docs improvement sprint to reduce support load
- Migration: moving from a wiki to a dedicated docs site

---

## Sprint overview

A standard docs sprint is 1 week for a focused scope (5-10 pages):

| Day | Activity |
|---|---|
| Day 1 | Content audit and scope definition |
| Day 2 | Architecture and templates |
| Days 3-4 | Writing sprint |
| Day 5 | Review, publish, and feedback setup |

For larger scope (20+ pages), run this as a 2-week sprint with the same structure.

---

## Step 1 — Content audit (Day 1, morning)

Before writing anything, understand the state of what exists.

**Audit prompt:**
```
/doc-site-builder

Run a content audit for our docs site.

Product: [name]
Current doc inventory (paste page titles and URLs or descriptions):
[list all existing pages]

Product changes in the last [90 days / 6 months]:
[paste recent release notes, changelog, or feature announcements]

Analytics data (if available):
- Top 10 pages by pageviews: [paste]
- Top 10 search queries with 0 results: [paste — this is your content gap list]
- Pages with highest exit rate: [paste]

Classify each existing page by Diátaxis type: Tutorial / How-to / Reference / Explanation.
Flag mixed-type pages (pages that try to be two types at once — split these).
Flag stale pages (content that likely changed with recent product updates).
Flag missing content (topics that should exist based on the product and user needs but don't).

Output: prioritised content backlog for this sprint.
```

**Scope decision:** From the audit output, select 5-10 pages to write or update in this sprint. Be ruthless about scope — 5 excellent pages are worth more than 15 mediocre ones.

---

## Step 2 — Sprint scope and prioritisation (Day 1, afternoon)

**Prioritise the backlog:**

| Priority | Content type | When to write first |
|---|---|---|
| P1 | Missing Getting Started / Quick Start | Users are failing at their first touchpoint |
| P1 | Broken or stale reference content | Wrong docs are worse than no docs |
| P2 | Missing how-to guides for common tasks | High-volume support questions |
| P2 | New feature documentation | Feature shipped without docs |
| P3 | Conceptual / explanation docs | Users need mental model, not just instructions |
| P3 | Cosmetic improvements | Low impact — don't sprint on these |

**Sprint backlog format:**

```markdown
## Docs Sprint — [Date] — Backlog

| Priority | Page | Type | Current state | Why now |
|---|---|---|---|---|
| P1 | Getting Started / Quick Start | Tutorial | Missing | First-touch drop-off |
| P1 | Authentication guide | How-to | Stale (v1 → v2 migration broke it) | Support ticket volume |
| P2 | POST /v1/events endpoint | Reference | Incomplete (no examples) | New endpoint shipped |
| P2 | How to set up webhooks | How-to | Missing | Top failed search query |
| P3 | What is [core concept] | Explanation | Missing | Users ask this in support |
```

---

## Step 3 — Architecture alignment (Day 2, morning)

If this sprint changes the nav structure or adds new sections, align on IA before writing.

```
/doc-site-builder

Propose an updated navigation structure for these new pages.

Existing nav: [paste current nav structure]
New pages to add: [list from sprint backlog]

Constraints:
- Maximum nav depth: 2 levels (don't create new top-level sections unless necessary)
- Platform: [Docusaurus / MkDocs / Mintlify]
- Audience: [developers / end users / admins]

Recommendation: where to place each new page, whether to create any new sections,
and whether any existing pages should be moved.

Include: a before/after nav comparison.
```

---

## Step 4 — Template selection (Day 2, afternoon)

Use the right template for each Diátaxis content type. Pull from `/doc-site-builder` or use these:

**Tutorial (Getting Started):**
- Opening: what you'll build / achieve — the end state, 1-2 sentences
- Prerequisites: numbered list — be explicit about versions
- Steps: numbered, each one producing a visible outcome
- Verify it worked: the command or check that confirms success at each step
- What just happened: 1-2 sentences explaining what the tutorial accomplished
- Next steps: 3 links max — where to go from here

**How-to guide:**
- Title: "How to [accomplish task]" — must be actionable
- Opening: 1 sentence — who this is for and what it accomplishes
- Prerequisites
- Steps: imperative voice ("Run the command", not "The user should run")
- Troubleshooting: the 2-3 errors most likely to occur and their fixes
- Related: 2-3 links to related how-tos and reference

**Reference page:**
- What this is (1 sentence)
- Syntax / signature
- All parameters / options in a table
- Minimal working example
- Notes / edge cases
- See also

**Explanation / Concept:**
- What this is and why it exists
- How it works (mental model, diagram if helpful)
- When to use it vs. alternatives
- Common misconceptions
- Related reference

---

## Step 5 — Writing sprint (Days 3-4)

**For API documentation:**
```
/api-doc-writer

Document this API endpoint.

[paste the route handler code, OpenAPI snippet, or endpoint description]

Output: full reference doc with:
- Request parameters table (path, query, body)
- Response fields table
- All error codes with explanation
- Code examples in curl, Python, TypeScript
- Gotchas and edge cases (if any are known)
```

**For README or Getting Started:**
```
/readme-generator

Write a Getting Started guide for [product/library].

Product: [name and 1-sentence description]
User type: [developers / non-technical users]
Starting point: [what they have when they begin]
End state: [what they have when this guide is complete — the value moment]

Include: prerequisites, installation, first working example, common configuration,
and 3 links to next steps.

Language: [TypeScript / Python / any — match the primary SDK]
```

**For operational runbooks:**
```
/runbook-generator

Write a runbook for [process or incident type].

Process / incident type: [describe]
Audience: on-call engineer who may never have seen this before
Trigger: [what condition causes this runbook to be needed]

Include:
- Symptoms and detection
- Diagnosis steps (ordered — start with the most likely cause)
- Remediation steps (exact commands, with expected output)
- Escalation: who to page if this doesn't resolve in X minutes
- Prevention: what to check to avoid this next time
```

**For changelogs:**
```
/changelog-writer

Write the changelog for [version / release name].

git log:
[paste git log --oneline for this release]

Audience: [developers / end users]
Filter out: internal changes, dependency upgrades, test-only changes.
Group: Breaking changes → New → Improvements → Fixes.
Include: links to docs for each new feature if docs exist.
```

---

## Step 6 — Engineering review (Day 4, afternoon)

Every technical docs page must be reviewed by an engineer before publication. The review catches:
- Incorrect technical details (wrong parameter names, outdated syntax)
- Missing steps (something the writer assumed was obvious but isn't)
- Code examples that don't run (the most common and damaging docs error)

**Review request template:**

```markdown
Hi [engineer name], 

I've drafted documentation for [feature/endpoint]. Can you review for technical accuracy?

Specifically:
1. Are all parameter names and types correct?
2. Do the code examples actually work? (If you can run them, please do — they should produce the documented output.)
3. Am I missing any important error cases or edge cases?
4. Is the described behaviour accurate for the current version?

[Link to draft or paste draft here]

ETA needed: [date]. This is blocking publication.
```

Target: 24-hour turnaround from engineers. If a page needs more than 2 rounds of technical review, schedule a 30-minute call instead.

---

## Step 7 — Style review (Day 5, morning)

```
Review this docs page for style and clarity.

Page: [paste content]

Check:
1. Is the title actionable / descriptive — does it match what a user would search for?
2. Does it start with user benefit, not product description?
3. Are all code examples runnable (no placeholder values that break them)?
4. Is it written in second person ("you") — no "the user" or passive voice?
5. Are sentences under 25 words on average?
6. Is there anything that could be cut without losing meaning?
7. Are error messages explained with cause + fix?

Output: specific line-level edits. No general feedback — specific changes only.
```

---

## Step 8 — Publication and feedback setup (Day 5, afternoon)

**Pre-publication checklist:**
- [ ] Technical review approved by engineer
- [ ] All code examples tested and produce the documented output
- [ ] All internal links verified (no 404s)
- [ ] Frontmatter complete: title, description, last_updated, tags
- [ ] Page appears correctly in nav
- [ ] Search index updated (rebuild if using Algolia, pagefind, or similar)

**Feedback instrumentation:**

Add a "Was this helpful?" widget to every new page. The minimal implementation:

```html
<!-- Minimal feedback widget — bottom of every page -->
<div class="feedback">
  <p>Was this page helpful?</p>
  <button onclick="sendFeedback('yes')">Yes</button>
  <button onclick="sendFeedback('no')">No</button>
</div>
```

Track: positive rate per page. Target: >70% positive. Pages below 50% need investigation.

---

## Step 9 — Sprint retrospective (End of Day 5)

```
Review this docs sprint and identify improvements for next time.

Pages written: [list]
Pages not completed: [list with reason]
Review cycles per page: [average]
Blocking issues: [list — e.g. "waited 2 days for API spec", "no staging environment to verify examples"]
Time per page type: [Tutorial: Xh, How-to: Xh, Reference: Xh]

Questions to answer:
1. Which pages took longer than expected — why?
2. Which review bottlenecks can be eliminated with process changes?
3. What content should have been in scope but wasn't?
4. What's the highest-impact next sprint?
```

---

## Timebox rules

- Content audit: 3 hours maximum. Use the analytics data to prioritise — don't audition every page.
- Per-page writing (with Claude Code): Tutorial: 90 min | How-to: 45 min | Reference: 60 min | Explanation: 60 min
- Engineering review: 24-hour SLA from engineers. If it slips, escalate or schedule a sync call.
- Code example testing: non-negotiable. Every code example must be executed before publication.
- Sprint scope: 5-10 pages per week. Anything more means scope is too wide.

---

## Docs-as-code CI setup

Add these to your repo to enforce quality on every PR:

```yaml
# .github/workflows/docs-quality.yml
name: Docs Quality

on: [pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Markdown lint
        uses: DavidAnson/markdownlint-cli2-action@v14
        
      - name: Spell check
        uses: streetsidesoftware/cspell-action@v6
        
      - name: Check broken links
        uses: lycheeverse/lychee-action@v1
        with:
          args: --verbose --no-progress './docs/**/*.md'
          
      - name: Check frontmatter
        run: |
          # Verify all .md files have required frontmatter: title, description, last_updated
          python scripts/check_frontmatter.py docs/
```

This enforces consistency without requiring a style guide review for every PR.

---
