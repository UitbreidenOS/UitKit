---
name: ux-audit
description: "UX audit against heuristics: identify usability issues, prioritise by impact, recommend fixes"
updated: 2026-06-13
---

# UX Audit Skill

## When to activate
- You're evaluating an existing product or feature for usability problems without running user sessions
- Pre-launch: you want an expert review before investing in user testing
- Post-launch: a feature is underperforming and you need to diagnose why without waiting for a research round
- You've inherited a product and need a systematic baseline assessment
- You want to produce a prioritised fix list for a design or engineering sprint

## When NOT to use
- You need actual user data — a UX audit is expert evaluation, not user research; for user-validated findings, use `/usability-report`
- You're evaluating a brand-new prototype with no interface to review — write the spec first
- You need to assess visual design quality (brand, aesthetics) — heuristic evaluation covers functional usability, not brand design
- You want to check accessibility specifically — run a dedicated WCAG 2.2 accessibility audit (the `/ux-audit` heuristics overlap but don't replace a full a11y audit)

## Instructions

### Full heuristic UX audit (Nielsen's 10 Heuristics)

```
Conduct a UX audit of [product / feature / screen].

## What to audit
Product: [name]
Scope: [specific screens, flows, or the full product — be precise]
Platform: [web / mobile iOS / mobile Android / desktop app / all]
User type being evaluated for: [which persona this audit focuses on]

## Screenshots / recordings / access
[Describe what you can share — screenshots, Figma link, staging URL, video walkthrough, or text description of the interface]

## Audit framework: Nielsen's 10 Usability Heuristics

For each heuristic, score the product: Pass / At Risk / Fail
Then list specific issues found under each.

---

### H1 — Visibility of System Status
The product should always keep users informed about what's going on through appropriate feedback within a reasonable time.

Evaluation criteria:
- Do loading states exist and communicate progress?
- Are success/error states clearly shown after user actions?
- Does the user always know where they are in a multi-step process?
- Are background operations (sync, autosave) surfaced appropriately?

Score: [ Pass / At Risk / Fail ]
Issues found:
- [Issue 1 — specific, observable, with location reference]
- [Issue 2]
Recommendation: [specific fix]

---

### H2 — Match Between System and Real World
The product should speak the user's language — words, phrases, and concepts familiar to them, not system-oriented jargon.

Evaluation criteria:
- Is terminology consistent with how users describe the domain (check sales calls, support tickets, user interviews for actual language users use)?
- Are icons universally understood without a label?
- Do metaphors map to the real-world object or concept they represent?

Score: [ Pass / At Risk / Fail ]
Issues:
- [Issue with exact label or terminology that is wrong]
Recommendation: [specific wording or icon change]

---

### H3 — User Control and Freedom
Users should be able to undo/redo actions and easily exit unwanted states.

Evaluation criteria:
- Is there an undo for destructive actions (delete, archive, overwrite)?
- Can users exit modals and flows without being forced to complete them?
- Are breadcrumbs or back navigation available in multi-step flows?
- Are confirmation dialogs used for irreversible actions?

Score: [ Pass / At Risk / Fail ]
Issues:
- [Issue]
Recommendation: [specific fix]

---

### H4 — Consistency and Standards
Users should not have to wonder whether different words, situations, or actions mean the same thing.

Evaluation criteria:
- Are similar actions labelled and styled consistently throughout the product?
- Does the product follow platform conventions (OS, browser, device)?
- Are CTA labels consistent (e.g. "Save" vs "Update" vs "Confirm" — pick one)?
- Is component use consistent (e.g. dropdown vs radio vs toggle for similar choices)?

Score: [ Pass / At Risk / Fail ]
Issues:
- [List inconsistencies with exact screen locations]
Recommendation: [specific fix or component audit needed]

---

### H5 — Error Prevention
Better than good error messages is a careful design that prevents problems from occurring in the first place.

Evaluation criteria:
- Are dangerous actions protected by confirmation steps or clear warnings?
- Does form validation happen inline (before submit) or only after?
- Are irreversible actions clearly labelled as such before the user commits?
- Are error-prone inputs constrained (e.g. date pickers instead of free text)?

Score: [ Pass / At Risk / Fail ]
Issues:
- [Issue]
Recommendation: [specific fix]

---

### H6 — Recognition Over Recall
Minimise the user's memory load — options, actions, and objects should be visible or easily retrievable.

Evaluation criteria:
- Are the available actions on each screen visible without digging into menus?
- Are recently accessed items, previous search terms, or saved states surfaced?
- Does the interface show context for decision-making (e.g. showing current plan limits when upgrading)?
- Are form fields pre-filled where possible with known user data?

Score: [ Pass / At Risk / Fail ]
Issues:
- [Issue]
Recommendation: [specific fix]

---

### H7 — Flexibility and Efficiency of Use
Accelerators — unseen by novice users — should speed up interaction for expert users.

Evaluation criteria:
- Are keyboard shortcuts available for power users?
- Can bulk actions be performed?
- Are repeat tasks automatable or templatable?
- Is there a search-first navigation path for users who know what they want?

Score: [ Pass / At Risk / Fail ]
Issues:
- [Issue — note: this heuristic is often a nice-to-have; flag severity accordingly]
Recommendation: [specific fix]

---

### H8 — Aesthetic and Minimalist Design
Dialogues should not contain irrelevant or rarely needed information.

Evaluation criteria:
- Is every element on screen necessary for the task at hand?
- Is the primary action clearly more prominent than secondary actions?
- Is there visual noise (decorative elements, redundant text, over-crowded layouts) that competes for attention?

Score: [ Pass / At Risk / Fail ]
Issues:
- [Issue with specific screen location]
Recommendation: [specific de-cluttering or hierarchy fix]

---

### H9 — Help Users Recognise, Diagnose, and Recover from Errors
Error messages should be expressed in plain language, precisely indicate the problem, and constructively suggest a solution.

Evaluation criteria:
- Are error messages written in plain language (not error codes)?
- Do they explain what went wrong AND what to do about it?
- Are error messages visible and proximate to the point of failure (not generic toast at top of page)?
- Are errors caused by system issues distinguished from user errors?

Score: [ Pass / At Risk / Fail ]
Issues:
- [Issue — paste the actual error message if it's bad]
Recommendation: [rewritten error message]

---

### H10 — Help and Documentation
Even though it is better if the system can be used without documentation, help should be available.

Evaluation criteria:
- Is there contextual help available (tooltips, inline hints, empty states with guidance)?
- Is the help documentation searchable?
- Are onboarding flows present for new users?
- Is there a quick-reference path for "how do I do X" questions?

Score: [ Pass / At Risk / Fail ]
Issues:
- [Issue]
Recommendation: [specific fix]

---

## Audit Summary

### Heuristic scorecard
| Heuristic | Score | Issues found |
|---|---|---|
| H1 — System Status | Pass/At Risk/Fail | N issues |
| H2 — Real World Match | Pass/At Risk/Fail | N issues |
| H3 — User Control | Pass/At Risk/Fail | N issues |
| H4 — Consistency | Pass/At Risk/Fail | N issues |
| H5 — Error Prevention | Pass/At Risk/Fail | N issues |
| H6 — Recognition | Pass/At Risk/Fail | N issues |
| H7 — Flexibility | Pass/At Risk/Fail | N issues |
| H8 — Minimalism | Pass/At Risk/Fail | N issues |
| H9 — Error Recovery | Pass/At Risk/Fail | N issues |
| H10 — Help | Pass/At Risk/Fail | N issues |

### Prioritised fix list
| Priority | Issue | Heuristic | Severity | Effort | Recommendation |
|---|---|---|---|---|---|
| P1 | [issue title] | H[N] | Critical | Low | [fix] |
| P2 | [issue title] | H[N] | High | Medium | [fix] |
| P3 | [issue title] | H[N] | Medium | High | [fix] |

Overall UX quality score: [Poor / Needs Work / Acceptable / Good / Excellent]
Rationale: [2-3 sentence summary of the product's main UX strengths and weaknesses]
```

### Quick-scan audit (single flow, 5 minutes)

```
Quick UX scan of [specific screen or flow].

I'll paste a description / screenshot. Identify the top 5 usability issues using Nielsen's heuristics.

For each issue:
- Which heuristic it violates
- Severity: Critical / High / Medium / Low
- One-sentence fix

Do not exceed 5 issues — prioritise ruthlessly. This is a quick scan, not a full audit.

Screen / flow description:
[describe the UI or paste screenshot]
```

### Accessibility fast-check (WCAG quick scan, alongside heuristics)

```
Alongside the heuristic audit, run a quick accessibility scan of [product / feature].

Focus areas:
1. Colour contrast: do text/background combinations meet WCAG 2.2 AA (4.5:1 for body, 3:1 for large text)?
2. Target size: are interactive elements at least 24×24px (WCAG 2.2 criterion 2.5.8)?
3. Keyboard navigation: can all interactions be completed without a mouse?
4. Focus indicators: are focused elements visibly highlighted?
5. Form labels: are all form inputs labelled (not just placeholder text)?
6. Error identification: are errors identified in text, not just colour?
7. Alt text: do images have meaningful alt attributes?
8. Heading hierarchy: is heading structure logical (H1 → H2 → H3, no skips)?

For each criterion: Pass / Fail / Cannot assess without code review
If Fail: specific location of the issue and the fix.

Note: this is a fast expert scan, not a full WCAG conformance audit. Use automated tools (Axe, WAVE) and assistive technology testing for full compliance assessment.
```

## Example

**User:** Audit the onboarding flow for a B2B SaaS analytics tool. The flow is: signup form → email verification → welcome screen with "invite your team" → dashboard with empty state → first data connection wizard. Users are dropping off at the empty state dashboard.

**Output (excerpt):**

```markdown
## UX Audit: Onboarding Flow — Analytics Tool

### H1 — Visibility of System Status: AT RISK

Issue 1: Email verification — no indication of status after form submission
The signup form submits and the user sees a generic "check your email" message with no indication
of whether the email was sent, to which address, or what to do if it doesn't arrive.
Severity: High | Location: Post-signup confirmation screen
Fix: Show the exact email address the verification was sent to. Add "Resend email" with a 30-second
cooldown timer. Show "Check your spam folder" tip after 60 seconds on the page.

---

### H6 — Recognition Over Recall: FAIL (root cause of empty-state drop-off)

Issue: Empty state dashboard provides no recognition cues for next action
After completing onboarding, users arrive at a dashboard that shows empty charts with no data.
The call to action is a small grey link in the top right: "Connect a data source."
Users who drop off here are not confused about the product — they don't see a clear next step.

Evidence: The invite-your-team screen (Step 2) is the last highly visible step. After that,
the product goes quiet. The "connect data" entry point is not prominent enough for a user
who has just completed an onboarding and expects to be guided.

Severity: Critical | Location: Empty state dashboard
Fix 1: Add a persistent "Start here" setup checklist visible until first data connection is made.
Fix 2: Replace empty chart placeholders with sample data and a "Replace with your data" CTA.
Fix 3: Move "Connect a data source" to a full-width hero CTA in the empty state, not a top-right link.

Effort: Medium

---

### Priority Fix List
| P | Issue | Severity | Effort |
|---|---|---|---|
| 1 | Empty state no guidance | Critical | Medium |
| 2 | Email verification no address shown | High | Low |
| 3 | "Invite team" step before product value | High | Low |
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
