# UX Research Sprint Workflow

A step-by-step workflow for running a full UX research sprint — from problem definition through research planning, execution, synthesis, reporting, and stakeholder handoff — using Claude Code skills throughout.

---

## When to run this workflow

- You're kicking off a research sprint for a specific design or product question
- You've identified a usability problem and want to validate and prioritise fixes
- You're starting a new feature area and need user understanding before design begins
- You're preparing for a design system or navigation overhaul that needs research backing

---

## Sprint overview

A standard UX research sprint is 2 weeks:

| Day | Activity |
|---|---|
| Day 1 | Problem definition and research planning |
| Day 2 | Participant recruitment and screener |
| Days 3-4 | Discussion guide and test plan |
| Days 5-9 | Research sessions |
| Day 10 | Synthesis and persona update |
| Day 11 | Report writing |
| Day 12 | Stakeholder presentation |

---

## Step 1 — Problem definition (Day 1, 1 hour)

Before any research, define the specific question the sprint will answer. Vague research produces vague insights.

**Prompt:**
```
/product-discovery

Help me define the research question for this sprint.

Context:
Product area: [which part of the product]
Business context: [what decision is riding on this research]
What we currently know: [existing data — support tickets, NPS themes, analytics patterns]
What we don't know: [the gap]
What decision will this research inform: [specific — e.g. "whether to redesign the navigation" or "what's blocking activation for the mid-market segment"]

Output:
1. A single, testable research question (not "learn about users" — something that can be answered)
2. The 3 most important sub-questions under it
3. The riskiest assumption this research needs to validate
4. What we would do differently if the research answer is X vs. Y (if the research won't change behaviour, cancel the sprint)
```

**Gate:** If you can't articulate what decision the research will inform, stop. Do not start a research sprint without a testable question.

---

## Step 2 — Research method selection (Day 1, 30 minutes)

Not all research questions need the same method. Choose the right tool.

| Question type | Method |
|---|---|
| "Why do users do X?" | Moderated user interviews |
| "Can users complete X task?" | Moderated usability test |
| "How often do users struggle with X?" | Unmoderated usability test (Maze, UserTesting) |
| "Which design performs better?" | A/B test (use `/experiment-designer`) |
| "What do users think about X?" | Survey |
| "What do our best users have in common?" | Analytics segmentation + 3-5 interviews |

For most research sprints, the answer is: 5-8 moderated interviews or usability sessions.

---

## Step 3 — Participant recruitment (Day 2)

**Screener prompt:**
```
/ux-researcher

Write a participant screener for this research sprint.

Research question: [from Step 1]
Participant profile needed: [who you need to talk to — role, company size, usage pattern, etc.]
Number of participants: [5-8 for qualitative; 20+ for unmoderated quantitative]
Recruitment channels: [your user base / Respondent.io / UserTesting.com / internal beta users]

Screener format:
- 5-7 screener questions (multiple choice and short answer)
- Clear inclusion/exclusion criteria
- Estimated completion time: under 3 minutes
- Incentive recommendation based on audience type
```

**Recruitment sources (ranked by quality):**
1. Your own users (most relevant, fastest to recruit if you have permission)
2. Customer success warm intros (highest quality conversations)
3. Respondent.io / User Interviews (fastest external panel)
4. UserTesting.com (fast, but lower engagement for complex tasks)

**Target:** Confirm all participants by Day 3.

---

## Step 4 — Discussion guide or test script (Days 3-4)

**For user interviews:**
```
/ux-researcher

Write a user interview discussion guide.

Research question: [from Step 1]
Session length: [45 / 60 minutes]
Interview type: [exploratory / evaluative — evaluative is focused on a specific design or flow]

Guide structure:
1. Opening (5 min): introduce think-aloud, set expectations, confirm recording consent
2. Warm-up (5-10 min): background questions — role, current tools, context
3. Core exploration (25-35 min): the research question — 5-7 open questions
4. Prototype/concept review (10-15 min, if applicable): show designs and gather reactions
5. Close (5 min): catch-all questions, rating scales (if using SUS), debrief

Produce: a complete interview guide with:
- Exact question wording (open-ended — no leading questions)
- Follow-up probes for each question ("Tell me more about that" alternatives)
- Timing guide per section
- Notes scaffold (what to capture in real time)
```

**For usability tests:**
```
/ux-researcher

Plan a usability test for [product/feature].

What to test: [specific flow — e.g. "the first-time onboarding flow from signup to first action"]
User type: [screened profile from Step 3]
Test format: moderated remote
Number of participants: 6
Key research questions: [from Step 1]

Include:
- 5-7 task scenarios (scenario-based, not instructional)
- Completion criteria for each task
- Quantitative metrics: task completion rate, time on task, SUS
- Qualitative: think-aloud prompts, confusion points to watch for
- Session structure with timing
```

---

## Step 5 — Session execution (Days 5-9)

**Before each session:**
- Send reminder + Zoom link 24 hours and 1 hour before
- Prepare your notes scaffold (copy from the guide)
- Test screen share, recording, and any prototype links
- Have a backup participant if someone cancels

**During each session:**
- Take notes in real time using the scaffold — capture verbatim quotes with " marks
- Note timestamps for key moments (confusion, delight, task failure)
- Don't interpret during the session — capture what you see, not what you think it means

**Immediately after each session (within 1 hour):**
```
/ux-researcher

I just completed a usability session. Synthesise my raw notes.

Session: Participant [N] — [date]
Task completion: Task 1: [pass/fail], Task 2: [pass/fail], Task 3: [pass/fail]
Raw notes: [paste your session notes]

Extract:
1. Top 2-3 observations from this session
2. Any quotes worth capturing verbatim
3. Which research questions were addressed and what evidence emerged
4. New questions this session raised

This is a per-session note — I'll do full synthesis after all sessions.
```

Do not wait until all sessions are done to review notes. Synthesis gets better when you track patterns as they emerge.

---

## Step 6 — Full synthesis (Day 10)

After all sessions, synthesise across the full dataset.

```
/ux-researcher

Synthesise user research findings from these [N] sessions.

Research type: [user interviews / usability test]
Number of sessions: [N]
Research question we were answering: [from Step 1]

Session notes (one per participant):
[paste all per-session notes from Step 5]

Synthesis output:
Step 1 — Affinity clustering: group observations by theme (not by research question)
Step 2 — Theme prioritisation: Frequency (X/N) + Severity (Critical / Major / Minor) table
Step 3 — Insight generation: "When X, users Y — this means Z" format for top 5 insights
Step 4 — Recommendations (P1 / P2 / P3)
Step 5 — What we still don't know (questions for the next sprint)
```

---

## Step 7 — Persona update (Day 10)

If the research revealed new information about your users, update your personas.

```
/persona-builder

Compare this new research to our existing personas and identify what needs to update.

Existing personas: [paste current persona documents]
New research findings: [paste synthesis from Step 6]

For each persona:
1. Which findings confirm existing persona attributes?
2. Which findings contradict or require updating?
3. Are there new attributes (frustrations, goals, behaviours) to add?
4. Does this research suggest a new persona segment we haven't captured?

Output: updated persona with [NEW] and [UPDATED] markers on changed fields.
```

---

## Step 8 — Report writing (Day 11)

```
/usability-report

Write a usability test report for [product/feature].

Product: [name]
Feature tested: [flow]
Research question: [from Step 1]
Participants: [N]
Sessions: [date range]

Synthesis input: [paste the synthesis from Step 6]
Quantitative metrics: [task completion rates, SUS scores, time on task data]

Produce:
- Executive summary (half page — what we tested, top 3 findings, recommended next steps)
- Methodology section
- Quantitative results table
- Prioritised findings (severity-sorted, with "why it matters" for each)
- Recommendations table (Priority / Finding / Effort / Owner)
- What we still don't know
```

---

## Step 9 — Stakeholder presentation (Day 12)

**Presentation structure (10 slides, 20 minutes):**

Slide 1: What we set out to learn (the research question)
Slide 2: Who we talked to (participant profile — not demographics fluff)
Slide 3: The headline — one sentence that captures the most important finding
Slide 4: Finding 1 — most critical (quote + screenshot + business implication)
Slide 5: Finding 2
Slide 6: Finding 3
Slide 7: Full prioritised issues table
Slide 8: What we recommend doing (with effort estimates)
Slide 9: What we're testing next / what we still don't know
Slide 10: Appendix — methodology, participant screener, full data

**Prep prompt:**
```
/usability-report

Convert this research report into a 10-slide stakeholder presentation.

Audience: [PM and engineering lead]
Time: 20-minute presentation
Goal: get approval to prioritise 3 P1 fixes in the next sprint

Report: [paste report from Step 8]

For each finding slide: one plain-language headline (not "Finding 4"), one participant quote,
what it means for the business (not just UX), and the specific recommendation.
Write slide titles and 3-5 bullet speaker notes per slide.
```

---

## Sprint output checklist

At the end of a research sprint, you should have:

- [ ] Answered the research question from Step 1 (or explained why it remains unanswered)
- [ ] A prioritised findings list with severity ratings
- [ ] Updated or validated personas
- [ ] A recommendations table with effort estimates and suggested owners
- [ ] A stakeholder presentation deck
- [ ] A list of follow-up questions for the next sprint
- [ ] All session notes stored in the research repository (Dovetail, Notion, or equivalent)

---

## Timebox rules

- Step 1 (problem definition): max 1 hour. If you can't define the question in 1 hour, the question isn't clear enough to research.
- Each research session: max 60 minutes. 45 is better.
- Per-session synthesis: within 1 hour of session ending — never the next day.
- Full report: 4 hours maximum. Use `/usability-report` to hit this. If it takes longer, the report is too long.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
