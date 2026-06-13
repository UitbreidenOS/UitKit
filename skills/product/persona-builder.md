---
name: persona-builder
description: "User persona builder from research data: demographics, goals, pain points, behaviours, quotes"
updated: 2026-06-13
---

# Persona Builder Skill

## When to activate
- You have user research data (interviews, surveys, support tickets, analytics) and need to distil it into actionable personas
- A design or product team is about to start a new initiative and needs shared understanding of who they're building for
- You want to challenge or validate assumptions about your users with data-backed archetypes
- You need to create personas to guide roadmap prioritisation, copy tone, or feature scope decisions
- Onboarding new team members who need to understand the user base quickly

## When NOT to use
- You have no actual user data — do the research first; synthetic personas from assumptions are harmful
- You need a marketing persona for targeting/segmentation — different goal and structure than a UX persona
- You want to do journey mapping — use `/ux-researcher` for that step after personas are defined
- You need a detailed behavioural profile for a specific power user — that's a user archetype or job story, not a persona

## Instructions

### Full persona generation from research data

```
Build user personas from this research data.

## Input data
Data sources available: [user interviews (N) / survey results (N responses) / analytics segments / support tickets / usability sessions / all]
Product: [name and 1-sentence description]
User base: [who uses this product — be specific about the range of user types]

## Raw data to analyse
[Paste interview notes, survey response themes, analytics segments, key quotes, support ticket themes, or any combination]

## Persona requirements
Number of personas needed: [2-4 — recommended range; fewer is better]
Primary use: [product design decisions / roadmap prioritisation / engineering scoping / stakeholder communication]

## For each persona, produce:

---

### Persona [N]: [Archetype Name]
[The name should be a role descriptor, not a fictional first name — e.g. "The Overwhelmed Ops Manager", "The Power User Automation Builder", "The Cautious Procurement Lead"]

**Tagline:** [One sentence that captures their defining frustration or goal — this is the first thing readers see and should be memorable]

---

#### Role and context
- **Job title / function:** [realistic title range — not just one title]
- **Industry / company type:** [where they work]
- **Company size:** [SMB / mid-market / enterprise — and why that matters for your product]
- **Technical proficiency:** [1-5 scale with a plain-language description]
- **How they use your product:** [daily driver / occasional / team-mandated / workaround for something else]
- **Who they influence or work with:** [their stakeholders — relevant for B2B products]

#### Goals (what success looks like for them)
- **Primary goal:** [the job they're trying to do — use "Jobs to Be Done" framing where possible]
- **Secondary goal:** [a supporting objective that often competes with the primary]
- **Success metric they care about:** [what number or outcome they're measured on — this drives behaviour]

#### Frustrations (with current solutions — evidence-backed)
For each frustration, include the evidence (quote or data point that surfaced it):

1. **[Frustration title]:** [Specific description of the pain]
   Evidence: "[Verbatim or close-paraphrase quote from research]" — [source, e.g. P3 interview, or 34% of survey respondents]

2. **[Frustration title]:** [...]
   Evidence: [...]

3. **[Frustration title]:** [...]
   Evidence: [...]

#### Behaviour patterns
- **How they discover tools:** [word of mouth / manager mandate / trial / research / peer recommendation]
- **Evaluation process:** [how they decide whether to adopt — trial, demo, peer review, procurement, etc.]
- **Usage pattern:** [how they actually use the product day-to-day]
- **Workarounds they use today:** [what they do when your product doesn't solve the problem — critical for design]
- **Communication style:** [Slack / email / async / synchronous — relevant for in-app messaging]

#### The quote that defines this persona
"[A single verbatim or near-verbatim quote from research that captures this persona's worldview. This should be the quote you'd put on a poster.]"

#### What they need from the product (decision-driving needs)
- [Need 1 — specific enough to drive a design decision]
- [Need 2]
- [Need 3]

#### What will make them leave (churn drivers)
- [Risk 1 — the condition under which this persona abandons the product]
- [Risk 2]

#### Design implications (direct translation to product decisions)
- [Implication 1 — "Because this persona X, the product should Y"]
- [Implication 2]
- [Implication 3]

---

### Persona comparison table (after all personas)

| Dimension | Persona 1 | Persona 2 | Persona 3 |
|---|---|---|---|
| Technical proficiency | Low | High | Medium |
| Decision-making power | None | Influencer | Buyer |
| Primary pain | [pain] | [pain] | [pain] |
| Value prop that resonates | [prop] | [prop] | [prop] |
| Feature priority | [features] | [features] | [features] |
| Risk of churn | High | Low | Medium |

### Persona prioritisation
Which persona to design for first — and why:
[Explicit recommendation based on business impact and strategic fit — not just "most common user"]
```

### Rapid persona sketch (from minimal data)

```
Create a quick persona sketch from limited data.

I have: [what data you have — e.g. "5 support tickets and our NPS survey verbatims"]
Product: [name]
User type I'm trying to understand: [e.g. "the users who churn in the first 30 days"]

Generate a working hypothesis persona — clearly mark it as HYPOTHESIS, not validated.

Format:
- Archetype name and tagline
- 3 defining characteristics
- Primary frustration (with any evidence available)
- 2 design implications
- The 3 questions this persona raises that need real research to validate

Label every assumption clearly. A hypothesis persona is a starting point for research, not a substitute for it.
```

### Persona validation checklist

```
Validate this existing persona against new data.

Existing persona: [paste the persona]
New data: [paste new interview notes, survey results, or analytics]

Check:
1. Does the new data confirm or contradict the primary goal? [Confirmed / Contradicted / Partially supported]
2. Are the stated frustrations still present? [List which ones appear in new data]
3. Are there new frustrations not in the current persona? [List them]
4. Has the behaviour pattern changed? [What's different?]
5. Is the representative quote still representative, or is there a better one from new data?

Output: Updated persona with [NEW] markers on changed fields, and a change summary.
```

### Anti-pattern detection

```
Review this persona and flag common persona anti-patterns.

[Paste existing persona]

Check for these failure modes:
1. DEMOGRAPHIC FLUFF — Is there irrelevant demographic detail (age, gender, location, hobbies) that doesn't drive product decisions? Flag and recommend removing.
2. ASSUMPTION WITHOUT EVIDENCE — Are claims made without citing research data? Flag each one.
3. SINGLE USER ARCHETYPE — Does this persona represent multiple distinct user types that need separate personas? Flag if so.
4. ASPIRATIONAL BIAS — Does the persona describe who the team wishes the user was, rather than who they actually are? Look for language that's too positive or that contradicts common support patterns.
5. MARKETING PERSONA CONFUSION — Does this persona describe buying behaviour rather than product usage behaviour? They serve different purposes.
6. CONFLATED ROLES — In B2B products, is this persona a mix of the Champion (daily user) and the Economic Buyer? They need to be separate.

For each anti-pattern found: explain why it's a problem and recommend a specific fix.
```

## Example

**User:** We interviewed 8 users of our project management tool. Here are the themes: most are team leads at companies of 50-200 people. They care about visibility across projects without having to ask their team for updates. They're frustrated that our current reporting is too manual — they have to build their own dashboards. Three of them said they end up screenshotting our tool and pasting into slides for their Monday exec standup. Two said they tried our reporting feature and gave up after 15 minutes.

**Output:**

```markdown
### Persona 1: The Visibility-Starved Team Lead

**Tagline:** "I spend half my Sunday building the slide deck that should build itself."

---

#### Role and context
- **Job title / function:** Team Lead, Engineering Manager, Ops Manager, or similar people-lead role
- **Company size:** 50-200 employees (mid-market; too big to track everything by memory, too small for dedicated PMO)
- **Technical proficiency:** 3/5 — comfortable with tools, but not spending time on configuration
- **How they use your product:** Daily check-ins on their own tasks, but their real need is a cross-team status view they can share upward
- **Who they influence:** Their direct team (5-15 people) and their own manager (the exec they report to weekly)

#### Goals
- **Primary goal:** Know the status of all active projects without having to interrupt their team to ask
- **Secondary goal:** Produce a Monday standup slide in under 10 minutes
- **Success metric they care about:** Their manager says "great update" without asking follow-up questions

#### Frustrations
1. **Reporting is manual and lossy:** They have to build custom dashboards or exports, and by the time it's done, it's already stale.
   Evidence: "I screenshot the board and paste it into slides every single week. It feels ridiculous." — P3 interview

2. **Reporting feature is too complex to set up:** The tool has reporting capability but it requires too much configuration for someone who just needs a weekly status view.
   Evidence: 2/8 participants attempted the reporting feature; both abandoned it within 15 minutes. No participant had a working report at the time of interview.

3. **No executive-facing export:** Outputs are formatted for project workers, not for executives who need a 3-slide summary.
   Evidence: 3/8 participants explicitly mentioned screenshotting for exec standups.

#### The quote that defines this persona
"I spend half my Sunday building the slide deck that should build itself."

#### What they need from the product
- An auto-generated weekly status summary they can share with their manager without modification
- Cross-project visibility from a single view — not a per-project board
- An export format that works in Google Slides or PowerPoint

#### Design implications
- Because this persona's primary workflow is upward reporting, the product needs a "manager view" that is distinct from the task worker view
- Because they're screenshotting today, the path of least resistance for adoption is replacing that screenshot with a one-click export
- Because they gave up on reporting setup, any reporting solution must work without configuration for the common case (weekly project status)
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
