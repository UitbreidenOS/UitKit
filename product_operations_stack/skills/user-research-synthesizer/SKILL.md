---
name: user-research-synthesizer
description: Synthesizes user research findings from interviews, usability tests, and observational studies. Maps user jobs-to-be-done, friction points, and mental models. Returns personas, journey maps, and actionable research insights.
allowed-tools: Read, Write
effort: high
---

# User Research Synthesizer

## When to activate

After conducting user research (interviews, usability testing, diary studies, or ethnographic observation). You have raw or semi-processed research data: interview transcripts, observation notes, video recordings summaries, or test recordings. Activation requires at least 8–12 research sessions and clarity on research objectives (user validation, pain point discovery, feature validation, etc.).

## When NOT to use

Not for market research or competitive analysis (use stakeholder-mapper for competitive context). Not for individual user support. Not without sufficient research data (fewer than 8 sessions risks biased conclusions). Not for predicting future behavior beyond stated needs and observed patterns. Not for building marketing personas (this is user-centric product research).

## User Research Framework

**Research Methods to Synthesize:**
- Moderated user interviews (1-on-1)
- Unmoderated user tests (observational)
- Usability testing (task-based)
- Diary studies or contextual inquiry
- Session recordings / video analysis
- Support conversation analysis

**Key Concepts:**
- **Jobs to be done (JTBD):** Functional, emotional, and social jobs users hire products to do
- **User mental model:** How users think about the problem; their assumptions and frameworks
- **Friction:** Moments where users struggle, workaround, or abandon tasks
- **Context:** Environment, constraints, and conditions when users need the product
- **Motivation:** Why users care about solving this problem; emotional drivers

## Synthesis Steps

1. **Code research data** — Manually annotate transcripts/notes for themes, quotes, behaviors
2. **Identify JTBD** — What is the user fundamentally trying to accomplish?
3. **Map user context** — When/where/why do users need this? What's their workflow?
4. **Extract pain points** — Where do users struggle, workaround, or give up?
5. **Document mental models** — How do users conceptualize the problem? What are their assumptions?
6. **Build provisional personas** — Cluster users by job, context, and needs (NOT by demographics)
7. **Validate patterns** — Do 3+ users describe the same friction or mental model?
8. **Identify design implications** — What does this mean for product design or messaging?

## Output Format

```markdown
# User Research Synthesis

**Research Period:** [Start Date]–[End Date]
**Research Type:** [Interview / Usability Test / Diary Study / Observational]
**Participants:** [X users; details: industry, role, experience level]
**Objectives:** [What did you set out to learn?]

---

## Executive Summary

**Key Finding:** [Top insight that emerged]
**User JTBD:** [The core job users are trying to do]
**Primary Friction:** [Top pain point across users]
**Opportunity:** [Design or messaging implication]

---

## Jobs to Be Done (JTBD)

### Functional Job
[The task or outcome the user is trying to accomplish]
**Context:** When do users need this? Under what conditions?
**Current approach:** How do users currently try to accomplish this?
**Workarounds:** What shortcuts or hacks do they use?

### Emotional Job
[How do they want to feel while doing the job?]
**Example:** Confident, in control, supported, fast

### Social Job
[What social outcome do they want? How do they want to be perceived?]
**Example:** Be seen as competent, organized, innovative

---

## User Mental Models

**How users think about [problem domain]:**
- [Assumption or framework user holds]
- [How does this shape their expectations?]
- [Where does this conflict with product reality?]

**Example:**
- **User assumption:** "I can [action] in the same way as [comparison product]"
- **Reality:** Product works differently; requires different mental model
- **Implication:** Onboarding must address this expectation mismatch

---

## Friction Points (Ranked by Severity)

| Friction | Frequency | Severity | Context | Workaround |
|---|---|---|---|---|
| [User struggle point] | [X of Y users mentioned] | [HIGH / MEDIUM / LOW] | When does this happen? | How do users workaround? |

**Insight:** [Top friction and recommendation]

---

## User Personas (Research-Based, Not Demographic)

### Persona 1: [JTBD-Based Name, e.g., "The Compliance-First Operator"]

**Who:** [Role, company type, experience level]
**JTBD:** [What they're trying to accomplish]
**Context:** [When/where they work; constraints]
**Frustrations:** [Top 3 pain points]
**Mental Model:** [How they think about the problem]
**Needs:** [What would help them succeed?]
**Quote:** "Direct user quote that captures this persona"

---

### Persona 2: [JTBD-Based Name]
[Repeat structure]

---

## User Journey Map: [Core Task or Workflow]

**Stage 1: [Pre-engagement]**
- What does the user need to know?
- What are they trying to accomplish?
- Pain point: [Where do they struggle?]
- Emotion: [How do they feel?]

**Stage 2: [Initial interaction]**
- What's their first action?
- Pain point: [Where do they get stuck?]
- Emotion: [Frustration? Confidence?]

**Stage 3: [Core task / Primary workflow]**
- What are they doing?
- Pain point: [Where do they struggle?]
- Emotion: [Engaged? Confused?]

**Stage 4: [Completion / Outcome]**
- How do they know they've succeeded?
- Pain point: [Is success clear?]
- Emotion: [Satisfied? Uncertain?]

---

## Design Implications

**Based on research, product should:**

1. **Address mental model gap:** [How should messaging or UI address user expectations?]
2. **Reduce top friction:** [Specific design recommendation to reduce friction]
3. **Clarify context:** [How should product acknowledge user context / constraints?]
4. **Enable JTBD:** [How should product make the job easier?]
5. **Validate with users:** [What should we test with users before building?]

---

## Validation & Confidence

**High Confidence (3+ users described this):**
- [Pattern 1]
- [Pattern 2]

**Medium Confidence (2 users):**
- [Pattern 3]

**Exploratory (1 user):**
- [Pattern 4] — Revisit in next research round

**Open Questions (Research gaps):**
- [Question 1 — recommended for follow-up research]

---

## Recommended Research Follow-Ups

- [Specific question to answer with more data]
- [Assumption to validate with users before building]
- [Scenario to explore with additional user segment]

---
```

## Example

# User Research Synthesis: Product Roadmap Collaboration

**Research Period:** April 1–30, 2026
**Research Type:** Moderated user interviews + usability test
**Participants:** 10 product managers and ops leads at SaaS companies (50–500 employees)
**Objectives:** Understand how product teams currently manage roadmap input and prioritization

---

## Executive Summary

**Key Finding:** Product leaders spend 40% of their time managing and consolidating feedback from stakeholders, but lack a single source of truth for input.

**User JTBD:** Make a data-driven roadmap decision by collecting input from multiple stakeholders, weighing competing priorities, and communicating the decision.

**Primary Friction:** No centralized way to gather, score, and validate customer requests; spreadsheets and emails lead to duplicates and lost feedback.

**Opportunity:** Build a tool that centralizes feedback collection and applies transparent prioritization logic.

---

## Jobs to Be Done (JTBD)

### Functional Job
Gather and synthesize product feedback (feature requests, pain points, bug reports) from customers, support, sales, and internal teams; apply consistent prioritization criteria; communicate decisions clearly.

**Context:** Quarterly roadmap planning; happens over 2–3 weeks, involves 5–8 stakeholders, each with competing priorities.

**Current approach:** Email chains, Slack threads, spreadsheets, occasional Zoom calls to align.

**Workarounds:** Product manager manually consolidates Excel sheets; creates custom scoring formulas; updates key stakeholders via email.

### Emotional Job
Feel confident that they've considered all input and made the right call, despite imperfect information and conflicting priorities.

### Social Job
Be seen by their team and leadership as data-driven, collaborative, and receptive to feedback; communicate roadmap decisions that stakeholders understand and accept.

---

## User Mental Models

**Model 1: "Loudest voice wins"**
- User assumption: Whoever asks most frequently or with most pressure will get their feature prioritized.
- Reality: [Product] should apply transparent, objective criteria (impact, effort, alignment)
- Implication: Messaging must emphasize "objective prioritization" and "all input considered fairly"

**Model 2: "Prioritization is a gut decision"**
- User assumption: Product leaders make prioritization calls based on intuition and experience; process is subjective
- Reality: Users want to *see* the process and criteria applied
- Implication: Tool must make prioritization logic visible and editable

**Model 3: "Customer requests = feature requests"**
- User assumption: All customer feedback should become a feature
- Reality: Must validate that request is widespread and aligned with strategy before committing
- Implication: Tool must show request frequency and strategic alignment clearly

---

## Friction Points (Ranked by Severity)

| Friction | Frequency | Severity | Context | Workaround |
|---|---|---|---|---|
| No centralized place to store all requests | 10/10 | HIGH | Requests come in via email, Slack, Calendly, LinkedIn | Copy into master Excel; manually de-dupe |
| Can't easily see which customers requested what | 9/10 | HIGH | Support sees requests; PMs don't have visibility | Ask support team; support forwards emails manually |
| Scoring criteria vary per person | 8/10 | HIGH | Sales weights revenue, CS weights retention, eng weights effort | Create master scoring rubric; manually score; debate scores |
| No way to communicate "why we said no" | 7/10 | MEDIUM | Customers/stakeholders get rejected without explanation | Personal emails to key stakeholders; feels messy |
| Duplicate requests not consolidated | 7/10 | MEDIUM | Same feature requested by multiple customers | Manual deduplication; still uncertain if count is accurate |
| No clear prioritization framework | 6/10 | MEDIUM | No shared understanding of decision criteria | PMs learn over time; new team members confused |

**Top Insight:** Lack of centralization is the core friction; leads to duplicate effort, missed signals, and perception of unfair prioritization.

---

## User Personas (Research-Based)

### Persona 1: "The Consensus Builder"

**Who:** VP Product or Director of Product at 50–200 person SaaS (3–5 years in role)

**JTBD:** Synthesize competing input (sales wants ARR, CS wants retention, eng wants tech debt reduction) into a single roadmap that feels fair and strategic.

**Context:** Managing 2–3 product managers, 20–50 customer feedback inputs per quarter, quarterly planning cycle.

**Frustrations:**
- Spends 3–4 hours/week in meetings debating what to build vs. actually planning
- Gets blamed for "ignoring sales" or "ignoring customers" when deprioritizing requests
- Has no artifact to show *why* decisions were made

**Mental Model:** "Prioritization is consensus + data, but I need a framework to get everyone aligned"

**Needs:** Clear, transparent prioritization criteria that sales, CS, and engineering all trust

**Quote:** "I need a way to show my team and stakeholders that we considered everything and made an intentional call. Right now it feels arbitrary."

---

### Persona 2: "The Data-Driven Operator"

**Who:** Senior Product Manager or Head of Product Operations at 100–500 person SaaS (5+ years)

**JTBD:** Codify and automate prioritization logic so roadmap decisions are repeatable and defensible.

**Context:** Working with multiple product lines or geographies; high stakeholder complexity; needs scalable process.

**Frustrations:**
- No audit trail of why decisions were made; hard to justify in retrospect
- Can't easily reprioritize when new info emerges
- New team members don't understand decision frameworks

**Mental Model:** "Prioritization can be a system; we should standardize the criteria and apply them transparently"

**Needs:** Transparent, repeatable prioritization process; ability to see all inputs and logic

**Quote:** "We need a single source of truth where I can see every customer request, every bit of data, and why we ranked it where we did."

---

## Design Implications

1. **Centralize feedback collection:** Build a single inbox for feature requests, bugs, and feedback from all sources (customers, support, sales, LinkedIn, etc.)

2. **Make prioritization logic transparent:** Show scoring criteria (impact, effort, alignment) explicitly; let users see how each item was scored and *why*.

3. **Reduce manual scoring burden:** Suggest scores based on customer frequency, revenue impact, and strategic alignment; let users override if needed.

4. **Enable easy communication:** Generate automated explanations of *why* items were prioritized or deprioritized; make it easy to share with stakeholders.

5. **Support iteration:** Allow users to re-score, re-rank, and re-prioritize; show how changes affect roadmap; version the roadmap over time.

---

## Validation & Confidence

**High Confidence (8–10 users mentioned):**
- Lack of centralization is the #1 pain point
- Stakeholders need transparent scoring to buy in
- Communication of decisions is hard (email chains, conversations get lost)

**Medium Confidence (5–7 users):**
- Users want to see which *customers* requested each feature
- Automated scoring suggestions would save time

**Exploratory (1–2 users):**
- Interest in competitive intelligence (what are competitors shipping?)
- Need for integration with customer data platforms (Segment, Intercom)

---
