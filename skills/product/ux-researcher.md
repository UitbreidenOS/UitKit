---
name: ux-researcher
description: "UX research: user persona generation, journey mapping, usability test planning, research synthesis — translate user data into actionable design and product decisions"
updated: 2026-06-13
---

# UX Researcher Skill

## When to activate
- Creating data-backed user personas from research or analytics
- Building a customer journey map to identify experience gaps
- Planning a usability test (script, tasks, metrics, sample size)
- Synthesising findings from user interviews or surveys into themes
- Generating an empathy map or user needs framework

## When NOT to use
- Product roadmap decisions — use the product-discovery skill
- A/B test design — use the experiment-designer skill
- Quantitative analytics (funnel analysis, retention) — use the product-analytics skill
- Marketing persona for targeting — different goal from UX persona

## Instructions

### User persona generation

```
Generate a user persona from [data source].

Data source: [user interviews / survey results / analytics / support tickets / all]
Product: [describe]
Segment to model: [describe the user type — e.g. "power users who use core feature daily"]

Persona structure:

PERSONA NAME: [archetype name — descriptive, not a real name]
Tagline: [one sentence that captures their core frustration or goal]

DEMOGRAPHICS (keep broad, avoid stereotyping):
Role: [job title / function]
Company size: [SMB / mid-market / enterprise]
Technical proficiency: [low / moderate / high] in [relevant domain]

GOALS (what they're trying to accomplish):
Primary goal: [the main job they're trying to do]
Secondary goal: [supporting objective]
Success looks like: [observable outcome they care about]

FRUSTRATIONS (current pain with existing solutions):
1. [Specific frustration with evidence — quote from interview or stat from data]
2. [Specific frustration]
3. [Specific frustration]

BEHAVIOUR PATTERNS:
How they discover tools: [word of mouth / search / manager mandate / etc.]
How they evaluate: [trial first / peer review / demo / procurement process]
How they use the product: [daily / weekly / episodic / in a team / solo]

QUOTE (representative voice):
"[Verbatim or paraphrased quote that captures their worldview]"

WHAT THEY NEED FROM US:
- [Specific need 1]
- [Specific need 2]
- [Specific need 3]

DO NOT include: stock photo description, fictional backstory, irrelevant demographics (favourite coffee)
DO include: only what drives product decisions

Generate the persona for [segment] from the data I provide.
```

### Journey map

```
Create a customer journey map for [experience].

Experience: [describe the end-to-end experience — e.g. "first-time setup to first value moment"]
User persona: [which persona this map represents]
Touchpoints to cover: [channels — email, product, support, website]

Journey map format:

PHASES: [list the high-level phases — e.g. Awareness → Consideration → Onboarding → Activation → Habitual Use]

For each phase:

PHASE NAME: [label]
Entry trigger: [what moves the user into this phase?]
Duration: [typical time spent in this phase]

User actions:
- [What they do]
- [What they do]

Touchpoints:
- [Where they interact with your product/brand]

Thoughts (what they're thinking):
- "[Inner monologue at this moment]"

Feelings: [Frustrated / Curious / Confident / Anxious / Delighted] — with a 1-5 sentiment score

Pain points:
- 🔴 [Critical pain — blocks progress]
- 🟡 [Notable friction — slows down]

Opportunities:
- [Design or product improvement that addresses the pain]

OVERALL EXPERIENCE CURVE:
Plot sentiment (1=very negative, 5=very positive) for each phase:
[Phase 1]: X/5 → [Phase 2]: X/5 → [Phase 3]: X/5 → ...

Lowest point in the journey = highest priority design opportunity.

Generate the journey map for my experience and persona.
```

### Usability test plan

```
Plan a usability test for [product/feature].

What to test: [specific flow, feature, or design]
User type: [who to recruit]
Test format: [moderated remote / moderated in-person / unmoderated]
Number of participants: [typically 5-8 for qualitative; 20+ for quantitative]
Key questions: [what do you want to learn?]

Test plan:

OBJECTIVE:
[What specific question will this test answer?]
Success criteria: [how will you know the test was useful?]

PARTICIPANT CRITERIA:
Screener questions: [3-5 questions to qualify participants]
Must have: [requirement 1] + [requirement 2]
Must not have: [exclusion criteria]
Incentive: [$X gift card / free product credit / other]

TASK DESIGN (5-7 tasks per session):
Tasks should be:
- Scenario-based ("you want to do X...") not instructional ("click on Y")
- Observable — can you tell if they succeeded?
- Representative of real user goals

Task 1: [scenario]
Completion criteria: [what does success look like?]
Time limit: [X minutes]

Task 2: [scenario]
Completion criteria: [...]

METRICS:
Quantitative:
- Task completion rate: % who complete each task without assistance
- Time on task: median seconds per task
- Error rate: errors per task
- SUS score (System Usability Scale): 0-100 composite

Qualitative:
- Think-aloud observations: what do users say as they navigate?
- Confusion points: where do they pause, backtrack, or ask questions?
- Emotional signals: where do they express frustration or delight?

SESSION GUIDE:
Introduction (5 min): explain think-aloud, no right or wrong answers
Tasks (30-40 min): present each task, observe and take notes
Debrief (10 min): open questions about the experience overall

ANALYSIS FRAMEWORK:
After [N] sessions:
- Affinity map: group observations by theme
- Severity rating: Critical (blocks completion) / Major (frustrates) / Minor (cosmetic)
- Frequency: how many participants hit this issue?
- Priority score: Severity × Frequency

Generate the test plan for my specific feature and user type.
```

### Research synthesis

```
Synthesise user research findings from [source].

Research type: [user interviews / usability test / survey / support tickets / all]
Number of sessions/responses: [X]
Raw findings: [paste key observations, quotes, or themes]

Synthesis framework:

Step 1 — Observation clustering (affinity mapping):
Group individual observations into themes.
Do not group by research question — group by what users actually said and did.
Good theme: "Users couldn't find the filter functionality" (specific, observable)
Bad theme: "Navigation issues" (too vague)

Step 2 — Theme prioritisation:
For each theme:
| Theme | Frequency (X of N participants) | Severity | Evidence |
|---|---|---|---|
| [Theme 1] | [X/N] | Critical / Major / Minor | [quote or observation] |

Step 3 — Insight generation:
Insight = theme + implication (not just "users did X" but "users did X, which means we need to Y")

Format: "When [context], users [behaviour]. This suggests [product/design implication]."

Example: "When users first reach the dashboard, they look for a search bar before noticing the filter panel in the sidebar. This suggests the primary discovery mechanism should move to a more prominent location or that search should be added as the primary navigation mode."

Step 4 — Recommendations (ordered by impact):
🔴 P1 — Critical (fix before launch): [specific recommendation + evidence]
🟡 P2 — Important (fix soon): [specific recommendation + evidence]
🟢 P3 — Nice to have: [specific recommendation]

Step 5 — What we still don't know:
[Questions this research couldn't answer — design the next research to answer these]

Synthesise my research findings into prioritised insights and recommendations.
```

## Example

**User:** We did 6 user interviews about our project management tool. Main findings: users love the timeline view but can't figure out how to add dependencies between tasks. Three users gave up and said "I'll just use Notion." How do I turn this into action?

**Claude's synthesis:**

**Key insight:**
"When users want to connect related tasks, they cannot find the dependency-creation UI without assistance. This isn't a feature gap — the feature exists — it's a discoverability and interaction design problem."

Evidence: 3/6 users gave up; all 6 mentioned the timeline as the strongest part of the tool. No one suggested they needed a different feature — they needed the existing feature to be findable.

**Implications:**

🔴 P1 — Dependency creation UX is broken (fix before growth):
The entry point for adding dependencies is invisible. Users are looking for a drag-connect interaction (like Miro/Linear) or a right-click context menu. If your current flow requires a settings panel or a separate click-add-link button, that's the mismatch.

Recommendation: In the timeline view, add a visual affordance when hovering over a task (a connector handle or "add dependency" button on hover). Consider a right-click context menu with "Add dependency to..."

🟡 P2 — Empty state / onboarding for dependencies:
If users reach the timeline with no dependencies set, there's no cue that the feature exists. Add a tooltip or empty-state prompt: "Connect tasks by dragging from one to another" with a 3-second demo animation.

🟢 P3 — Help documentation:
"Task dependencies" is buried in docs. Move it to a "Getting started with timelines" guide that appears contextually when a user first opens the timeline.

**What this research didn't answer:**
- Do users want dependencies to cascade automatically (if A is delayed, does B shift)?
- Are there power users who have found and use dependencies today? What made them findable for them?

Run a 15-minute follow-up session with 3 users: show them where the dependency feature is, ask them to use it, observe — is the interaction itself clear once found?

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
