# Claude for Technical Writers and Docs Engineers

Everything a Technical Writer or Docs Engineer needs to run AI-augmented documentation workflows — API docs, READMEs, runbooks, changelogs, ADRs, docs site architecture, style guides, and content audits.

---

## Who this is for

You are a technical writer, docs engineer, or developer advocate whose job is to make complex technical products understandable. You write API documentation, onboarding guides, runbooks, and changelogs. You review PRs for docs accuracy. You maintain a docs site. You fight to keep information current. Claude Code makes the mechanical parts of this job fast and consistent so you can focus on the writing and editorial judgement that actually requires expertise.

**Before Claude Code:** 4 hours to document an API endpoint from scratch. 30 minutes to write a changelog entry that will be read for 30 seconds. 2 hours to produce a runbook from an incident post-mortem. Waiting for an engineer to explain what a new feature does before you can start writing.

**After:** API endpoint documented in 10 minutes from the code or spec. Changelog from a git log in 5 minutes. Runbook from an incident timeline in 20 minutes. Docs site IA review in 30 minutes.

---

## 30-second install

```bash
# Install all Technical Writer skills
npx claudient add skills productivity

# Or cherry-pick:
npx claudient add skill productivity/readme-generator
npx claudient add skill productivity/runbook-generator
npx claudient add skill productivity/adr-writer
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/api-doc-writer
npx claudient add skill productivity/changelog-writer
npx claudient add agents roles/changelog-narrator
```

---

## Your Claude Code docs stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/readme-generator` | Complete README from code or description | New project, new open-source release |
| `/runbook-generator` | Operational runbook from incident or process description | After every incident, for each operational process |
| `/adr-writer` | Architecture Decision Record from a technical decision | When a significant architectural decision is made |
| `/doc-site-builder` | Docs site IA: nav structure, templates, content taxonomy, search strategy | Starting or restructuring a docs site |
| `/api-doc-writer` | API docs from OpenAPI spec or code: endpoints, examples, error codes, SDKs | API changes, new endpoints, migration guides |
| `/changelog-writer` | User-facing changelog from git log or PR list | Every release, weekly digest |

### Agents

| Agent | Model | When to spawn |
|---|---|---|
| `changelog-narrator` | Haiku | Batch changelog generation across multiple releases |

---

## Daily workflow

### Morning — Engineering standup output → documentation tasks

**Turn yesterday's PRs into docs tasks:**
```
/changelog-writer

These PRs merged yesterday. Classify each as: needs new doc / needs doc update /
needs changelog entry / internal only (no doc needed).

PR list:
[paste merged PR titles and descriptions]

For each that needs a doc or changelog entry: give me a 1-line brief on what to write.
```

**Quick API doc from a new endpoint:**
```
/api-doc-writer

Document this API endpoint from the code:

[paste the route handler code, OpenAPI snippet, or plain description]

Output: full endpoint reference doc with request/response tables, all parameters,
error codes, and code examples in curl, Python, and TypeScript.
```

---

### Content review cycle

**Audit a docs section for staleness:**
```
/doc-site-builder

Audit this section of our docs for content problems.

Pages (list title and last-updated date):
[list of pages]

Recent product changes that may have made these pages stale:
[list product changes from last 90 days — get from changelog or release notes]

Identify: pages that are likely stale / pages with missing content / pages that should be split or merged.
Output: prioritised content update backlog.
```

**Style review for a doc page:**
```
Review this documentation page for clarity, completeness, and style.

Page: [paste content]

Check against:
1. Is the user goal clear from the title alone?
2. Does the page start with what the user can accomplish, not what the feature is?
3. Are code examples runnable as-is (no placeholder values that break them)?
4. Are error messages explained with causes and fixes, not just listed?
5. Is it written in second person ("you") throughout?
6. Are there unnecessary sections that could be cut?

Output: specific line-level edits with explanation.
```

---

### Release cycle — Changelog writing

**Every release:**
```
/changelog-writer

Convert this git log into a user-facing changelog for v[X.Y.Z].

Audience: [end users / developers / admins]
Release date: [date]

git log:
[paste git log --oneline output for this release]

Filter out: dependency upgrades, internal refactors, test-only changes.
Group by: Breaking changes → New features → Improvements → Fixes.
Write for a [developer / non-technical user] audience.
Include links to docs for any new feature that has documentation.
```

---

### Incident documentation — Runbooks

**Post-incident: capture the response as a runbook:**
```
/runbook-generator

Create a runbook from this incident timeline.

Service: [service name]
Incident type: [what went wrong]
Incident timeline:
[paste from your incident tracking tool or Slack thread]

Produce a runbook covering:
- Symptoms and detection criteria
- Step-by-step diagnosis procedure
- Remediation steps (numbered, with exact commands)
- Escalation path
- Prevention checklist (what to check before this happens again)

Format: operational runbook that an on-call engineer who has never seen this incident can follow.
```

---

### Architecture decisions — ADRs

**Capture a technical decision before it gets lost:**
```
/adr-writer

Write an Architecture Decision Record for [decision].

Decision: [what was decided]
Context: [the situation that required a decision — why was it needed?]
Options considered: [list the alternatives that were evaluated]
Decision rationale: [why this option was chosen over the alternatives]
Consequences: [the trade-offs — what this decision makes easier and what it makes harder]
Status: [Accepted / Proposed / Deprecated / Superseded by ADR-N]

Use Nygard format. Include: title, date, status, context, decision, consequences.
```

---

### Docs site architecture

**Restructure a docs site:**
```
/doc-site-builder

Design the information architecture for our docs site.

Product: [name and description]
Audience: [developers / end users / admins / all]
Current state: [migrating from Notion / restructuring existing site / starting fresh]
Doc types needed: [getting started, API reference, how-to guides, conceptual docs, release notes]
Content volume: [approximate number of pages]
Platform: [Docusaurus / MkDocs / Mintlify / not yet chosen]

Produce:
- Top-level nav structure with rationale
- Diátaxis content classification (Tutorial / How-to / Reference / Explanation)
- Page templates for each content type
- Content gap analysis
- Launch readiness checklist
```

---

## 30-day ramp plan (new technical writers)

### Week 1 — Setup and docs audit
- Install all productivity skills: `npx claudient add skills productivity`
- Run `/doc-site-builder` Diátaxis classification on all existing docs — identify gaps and mixed-type pages
- Read every existing doc in your primary area — note anything outdated (compare against recent PRs)
- Shadow 2-3 engineering standups — hear what's shipping in the next sprint

### Week 2 — API docs and reference writing
- Pick 3 API endpoints without good documentation
- Use `/api-doc-writer` to draft each one from the code — review with the engineer who wrote it
- Measure time from draft to approved — track editing cycles to improve your prompts
- Set up the docs-as-code PR review process with engineering

### Week 3 — Changelog and release notes
- Get access to the git log or merged PR feed
- Write the next release changelog with `/changelog-writer` — compare to previous changelogs for tone and depth
- Write 3 runbooks for common on-call incidents that don't have documentation yet
- Review your ADR archive — are the decisions that have been made documented?

### Week 4 — Content strategy
- Run a full content audit: which docs have the highest pageviews? Highest exit rate? Most support ticket correlation?
- Use analytics to identify the top 5 pages users land on that fail them (high exit + low satisfaction)
- Propose a docs improvement sprint to engineering: 5 pages, measurable goal
- Present your content audit findings to the team

---

## Tool integrations

### GitHub / GitLab (docs-as-code)

Run CI checks on every docs PR:

```yaml
# .github/workflows/docs.yml
- name: Check broken links
  uses: lycheeverse/lychee-action@v1

- name: Spell check
  uses: streetsidesoftware/cspell-action@v2

- name: Lint markdown
  uses: DavidAnson/markdownlint-cli2-action@v9
```

Claude Code can help write prose — CI enforces consistency and catches broken links before they reach users.

### OpenAPI / Swagger (API specs)

If your team uses OpenAPI:
- Commit the spec to the same repo as the docs
- Use `/api-doc-writer` to generate human-readable docs from the spec
- Regenerate on every spec change — don't hand-maintain API reference that can be generated

```bash
# Generate docs from spec
npx claudient run api-doc-writer --input openapi.yaml --audience developers
```

### Mintlify / Docusaurus / MkDocs (docs platforms)

All of these support MDX or Markdown with frontmatter. Claude Code generates Markdown; you manage the platform config.

Recommended frontmatter pattern:
```yaml
---
title: "How to configure authentication"
description: "Set up OAuth 2.0, API key, or SSO authentication for your integration"
last_updated: "2026-06-02"
tags: [authentication, security, setup]
---
```

### Linear / Jira (docs backlog)

Track docs tasks as first-class engineering tickets. Label: `docs`, `docs-api`, `docs-runbook`.

Claude Code generates the draft — the ticket tracks review and publication. Don't skip the review cycle.

### Slack / Teams (engineering collaboration)

Set up a `#docs-updates` channel where:
- Merged PRs with user-visible changes trigger a notification
- Technical writers can ask engineers for context in a thread (searchable for future reference)
- Release changelogs are posted for review before publication

---

## Metrics to track

| Metric | Target |
|---|---|
| API endpoint documentation coverage | 100% of public endpoints documented |
| Changelog delivery time after release | Same day as release |
| ADR coverage | ADR exists for every significant architectural decision |
| Runbook coverage | Runbook exists for every P1 incident type |
| Broken links in production docs | 0 (enforced by CI) |
| Docs feedback score ("Was this helpful?") | >70% positive |
| Time from PR merge to docs published | <24 hours for minor changes, <72 hours for major features |
| Stale pages (not updated in >6 months vs. product changes) | <10% of docs |

---

## Common mistakes (and how Claude Code helps avoid them)

**Mistake 1: API docs written as if they're for you, not the integrator**
`/api-doc-writer` always writes from the integrator's perspective, includes working code examples in multiple languages, and explains error codes with causes and fixes — not just a table of status codes.

**Mistake 2: Changelogs that sound like commit messages**
`/changelog-writer` rewrites commit messages into user-facing benefits language, filters out internal churn, and groups by user impact.

**Mistake 3: Docs that mix tutorial, how-to, and reference content on one page**
`/doc-site-builder` runs Diátaxis classification and flags mixed-type pages. Split them before they become unmanageable.

**Mistake 4: Runbooks that are never used because they're out of date**
Write runbooks immediately after incidents with `/runbook-generator` while the context is fresh. Add a "last validated" date and validate them in game days.

**Mistake 5: ADRs that never get written**
ADR writing has to happen when the decision is made — not six months later. Use `/adr-writer` in the same PR where the architectural change lands.

---

## Resources

- [Getting started with Claude Code](../getting-started.md)
- [Docs sprint workflow](../workflows/docs-sprint.md)
- [Changelog narrator agent](../agents/roles/changelog-narrator.md)
- [ADR writer skill](../skills/productivity/adr-writer.md)
- [Runbook generator skill](../skills/productivity/runbook-generator.md)

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
