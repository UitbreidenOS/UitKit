---
name: doc-site-builder
description: "Documentation site architecture: information hierarchy, nav structure, content templates, search strategy"
updated: 2026-06-13
---

# Doc Site Builder Skill

## When to activate
- Starting a new documentation site from scratch and need an information architecture
- Migrating docs from a wiki (Notion, Confluence) or README files to a dedicated docs site
- An existing docs site has outgrown its structure and needs a IA redesign
- You need to define content templates so multiple contributors produce consistent pages
- Planning a docs-as-code workflow where engineers and writers collaborate in the same repo

## When NOT to use
- You need to write individual docs pages — use `/api-doc-writer` or `/readme-generator` for specific content
- You're choosing a docs platform (Docusaurus vs MkDocs vs Mintlify vs GitBook) — this skill covers architecture, not platform selection; make that decision first
- You want to audit existing docs quality — this is a structural and architecture skill, not an audit tool
- You need to set up the technical build pipeline — this skill produces the architecture; implementation is an engineering task

## Instructions

### Full docs site architecture

```
Design the information architecture for a documentation site.

## Context
Product: [name and 1-sentence description]
Audience: [who reads these docs — end users / developers / admins / all three]
Doc types needed: [getting started / API reference / how-to guides / conceptual guides / release notes / troubleshooting / all]
Current state: [new from scratch / migrating from [source] / restructuring existing site]
Content volume: [approximate number of pages — rough estimate is fine]
Team: [who writes: [N] technical writers / engineers write their own / mixed]
Platform chosen: [Docusaurus / MkDocs / Mintlify / GitBook / Notion / custom / not yet chosen]

## Produce:

### 1. Information architecture overview
Top-level navigation structure with rationale for each section:

```
/ (Home)
├── Getting Started/
│   ├── Introduction
│   ├── Quick Start
│   └── Installation
├── Guides/
│   ├── [Topic 1]
│   └── [Topic 2]
├── Reference/
│   ├── API Reference
│   ├── Configuration
│   └── CLI Reference
├── Concepts/
│   └── [Core concept explanations]
└── Changelog/
```

For each top-level section: explain the user intent it serves and the content it contains.

### 2. Content taxonomy
Define the four Diátaxis content types for this product:

**Tutorials** (learning-oriented, guided experience):
- When to write a tutorial vs a how-to guide
- Template for tutorials in this product context
- Example tutorial titles for this product

**How-to Guides** (task-oriented, problem-solving):
- When to write a how-to vs a tutorial
- Template for how-to guides
- Example how-to titles for this product

**Reference** (information-oriented, look-up):
- What belongs in reference (API endpoints, config keys, CLI flags, data models)
- Template for reference pages
- How reference is auto-generated vs hand-written for this product

**Explanation / Conceptual** (understanding-oriented):
- What concepts need explanation docs for this product
- Template for concept pages
- Example concept topics for this product

### 3. Page templates
Provide fill-in-the-blank templates for:

**Getting Started / Quick Start template:**
```markdown
# Getting Started with [Product]

## What you'll build
[1-2 sentences — the outcome the reader achieves]

## Prerequisites
- [requirement 1]
- [requirement 2]

## Step 1: [First action]
[instruction]

```[language]
[code example]
```

Expected output:
```
[what they see when it works]
```

## Step 2: [Next action]
[instruction]

## What just happened
[Brief explanation of what the quick start code does — builds mental model]

## Next steps
- [Link to next tutorial]
- [Link to relevant how-to]
- [Link to reference]
```

**How-to Guide template:**
```markdown
# How to [accomplish specific task]

[One sentence: who this is for and what it achieves]

## Prerequisites
- [What they need before starting]

## Steps

### 1. [First step]
[instruction — imperative voice, second person]

```[language]
[code]
```

### 2. [Second step]
[instruction]

## Troubleshooting
**[Common problem]:** [Solution]
**[Common error message]:** [What it means and how to fix it]

## Related
- [How-to guide that often pairs with this one]
- [Reference page for the main config/API used here]
```

**Reference page template:**
```markdown
# [Configuration key / API endpoint / CLI command name]

[One sentence describing what this does]

## Syntax / Signature
```
[exact syntax]
```

## Parameters / Options
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `name` | string | Yes | — | [what it does] |
| `timeout` | number | No | 30 | [what it does] |

## Example
```[language]
[minimal working example]
```

## Notes
[Edge cases, gotchas, version constraints]

## See also
[Related reference items]
```

### 4. Navigation design rules
Principles for this docs site's navigation:

- Maximum depth: [2 / 3 levels — pick one; deeper is almost always worse]
- Sidebar: [always visible / collapsed on mobile / section-scoped]
- Breadcrumbs: [yes / no — yes for deep hierarchies]
- Page length: [max recommended length and when to split into sub-pages]
- Versioning: [does the site need to version docs? Strategy for how]

### 5. Search strategy
- Search tool: [Algolia DocSearch / built-in full-text / pagefind / none]
- Search optimisation: what metadata to add to every page (title, description, tags)
- Faceting / filtering: does the audience need to filter by role, product tier, or version?

### 6. Contributor workflow
How engineers and writers collaborate:

- File naming convention: [kebab-case.md / topic/subtopic.md]
- PR review process: [writer reviews all PRs touching docs / engineer self-merges with review from writer]
- Freshness signal: last_updated frontmatter on every page
- Broken link checking: [CI step — use which tool]
- Style guide location: [link or embed]

### 7. Launch readiness checklist
- [ ] Home page has clear paths to the 3 most common user intents
- [ ] Every page has a title, description, and last_updated
- [ ] All code examples are tested and runnable
- [ ] Search is configured and indexed
- [ ] 404 page has useful navigation back to content
- [ ] Analytics configured (pageviews, search queries, 404s)
- [ ] Feedback widget on each page ("Was this helpful?")
- [ ] Broken link check passes in CI
```

### Diátaxis content classification

```
Classify this content by Diátaxis type and tell me what's missing.

I have the following docs pages (list titles and 1-line description):
[list your existing pages]

For each page:
1. Classify as: Tutorial / How-to / Reference / Explanation / Unclear / Mixed (flag mixed as a problem)
2. Flag pages that are "mixed" type — they need to be split
3. Identify which Diátaxis quadrants have content gaps for this product

Gap analysis output:
| Diátaxis type | Coverage | Missing topics |
|---|---|---|
| Tutorial | Good / Thin / None | [what's missing] |
| How-to | Good / Thin / None | [what's missing] |
| Reference | Good / Thin / None | [what's missing] |
| Explanation | Good / Thin / None | [what's missing] |

Recommended priority: [which type to write more of first, and why]
```

### Docs site analytics interpretation

```
Interpret docs site analytics and surface content problems.

Analytics source: [Google Analytics / Plausible / Posthog / custom]

Data available:
- Top 10 pages by pageviews: [paste]
- Top 10 search queries: [paste]
- Pages with highest exit rate: [paste]
- 404 errors (top broken paths): [paste]

Analyse:
1. SEARCH QUERIES THAT FIND NOTHING: queries in the search log with 0 results = content gap. List them.
2. HIGH-EXIT PAGES: pages with very high exit rate may be failing to answer the user's question. Diagnose the top 3.
3. MISSING PAGES (404s): list broken paths — which of these represent real content that should exist?
4. UNDERPERFORMING PAGES: pages that should be high-traffic but aren't. What might explain the gap?

Output: prioritised content backlog based on analytics evidence.
```

## Example

**User:** I'm building docs for a developer-facing webhook integration library. Users are engineers integrating our API. I need to go from 3 README files to a proper docs site on Docusaurus. Expected: ~40 pages total.

**Output (excerpt):**

```markdown
## Information Architecture: Webhook Library Docs

### Top-level navigation

```
/ (Home)
├── Getting Started/
│   ├── Introduction (what the library does; 2-minute read)
│   ├── Quick Start (working webhook in 5 minutes)
│   └── Installation (all package managers)
├── Guides/
│   ├── Receiving webhooks
│   ├── Validating signatures
│   ├── Handling retries and idempotency
│   ├── Testing webhooks locally
│   └── Migrating from direct HTTP handling
├── Reference/
│   ├── Client options
│   ├── Event types
│   ├── Error codes
│   └── Changelog
└── Concepts/
    ├── How webhook delivery works
    ├── Signature verification deep dive
    └── Retry and ordering guarantees
```

### Content gap analysis
Your 3 README files likely cover: installation, basic usage, and some API reference.

Missing (high priority):
- Tutorial: "Receive your first webhook in 5 minutes" — this is the entry point for all new users
- How-to: "Test webhooks locally with ngrok or Cloudflare Tunnel" — most common friction point for developers
- Concept: "Retry and ordering guarantees" — engineers will need this before using in production
- Reference: Event types catalogue — should be auto-generated from your schema, not hand-written
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
