# Claude for UX Designers and Researchers

Everything a UX Designer or Researcher needs to run AI-augmented research synthesis, usability analysis, persona creation, and design critique in Claude Code.

---

## Who this is for

You are a UX designer, UX researcher, or product designer whose work spans user research synthesis, usability testing, persona creation, journey mapping, design critiques, accessibility reviews, and stakeholder communication. You spend too much time formatting research findings, writing reports no one reads, and recreating personas from scratch. Claude Code cuts that overhead so you can spend time on what actually requires human judgement: talking to users, making design decisions, and influencing the product.

**Before Claude Code:** 3-4 hours to write a usability report. 2 hours to build a persona from interview notes. Half a day to produce a UX audit for a feature handoff.

**After:** Full usability report in 30 minutes. Persona in 10 minutes from raw notes. UX audit in 45 minutes, prioritised by severity and effort.

---

## 30-second install

```bash
# Install all UX Designer skills
npx claudient add skills product

# Or cherry-pick what you need:
npx claudient add skill product/ux-researcher
npx claudient add skill product/usability-report
npx claudient add skill product/persona-builder
npx claudient add skill product/ux-audit
npx claudient add skill product/product-discovery
npx claudient add skill product/experiment-designer
npx claudient add agents roles/hypothesis-tester
```

---

## Your Claude Code UX stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/ux-researcher` | User personas, journey maps, usability test plans, research synthesis | Core research work |
| `/usability-report` | Full usability report: session summaries, severity ratings, recommendations | After every usability test round |
| `/persona-builder` | Data-backed user personas: goals, frustrations, behaviours, quotes | After research synthesis |
| `/ux-audit` | Heuristic evaluation against Nielsen's 10 heuristics, prioritised findings | Pre-launch, feature handoffs |
| `/product-discovery` | Discovery frameworks: problem definition, assumption mapping, opportunity sizing | Early-stage discovery |
| `/experiment-designer` | A/B test design, hypothesis framing, metric selection, sample size | Validating design decisions with data |

### Agents

| Agent | Model | When to spawn |
|---|---|---|
| `hypothesis-tester` | Sonnet | Validating design hypotheses with research or analytics data |

---

## Daily workflow

### Morning — Research synthesis sessions

**Turn raw notes into insights:**
```
/ux-researcher

Synthesise user research findings from these 5 interview notes.

Research type: user interviews
Number of sessions: 5
Raw findings: [paste your interview notes, one per session]

I need: clustered themes, prioritised insights in "When X, users Y — this means Z" format,
and P1/P2/P3 recommendations.
```

**Build a persona from the synthesis:**
```
/persona-builder

Build user personas from this research data.

Data sources: user interviews (5), support tickets (3 months), NPS verbatims
Product: [name]
User base: [who uses this product]

[paste synthesised findings from above]

I need 2 personas for a design sprint next week. Primary use: design decisions and scope discussions.
```

---

### After a usability test — report writing

**Turn session notes into a prioritised report:**
```
/usability-report

Write a usability test report for [feature name].

Product: [name]
Feature tested: [specific flow]
Test format: moderated remote
Participants: 6 — [screener criteria]
Sessions conducted: [date range]
Research questions:
1. [Primary question]
2. [Secondary question]

Raw findings:
[Paste observer notes, quotes, task completion records]
```

---

### Pre-launch — UX audit

**Before a feature ships:**
```
/ux-audit

Conduct a UX audit of [feature/flow].

Product: [name]
Scope: [screens or flow to audit]
Platform: web
User type: [persona name]

[Describe the UI — paste screenshot links, Figma links, or describe the interface]

Give me: Nielsen heuristic scores, all issues with severity ratings, and a prioritised fix list
sorted by impact × effort.
```

---

### Design critique facilitation

**Structured critique for your own work or a design review:**
```
/ux-researcher

Run a structured design critique of this design.

Design: [describe or share Figma link]
User goal: [what the user is trying to accomplish]
Context: [where this appears in the flow]
Constraints: [tech constraints, edge cases to consider]

Critique against:
1. Does it achieve the user goal without training?
2. Are there heuristic violations (Nielsen)?
3. What's the most likely user error?
4. What would make this fail for edge-case users?
5. What would a 10x better version look like (to challenge assumptions)?

Output: structured feedback with severity ratings and specific redesign suggestions.
```

---

### Stakeholder communication

**Translate research into a decision brief:**
```
/usability-report

Convert this usability report into a stakeholder decision brief.

Audience: VP Product and engineering lead — 10-minute read maximum
Goal: get approval to prioritise 3 critical fixes before launch

[paste usability report findings]

Format: executive summary → 3 critical issues → business impact → recommended action → effort estimate.
Do not include methodology details — they're in the appendix.
```

---

### Weekly — Journey mapping

**Map the current state experience:**
```
/ux-researcher

Create a customer journey map for [experience].

Experience: [end-to-end experience to map]
User persona: [which persona]
Touchpoints: [channels to cover — email, product, support, website]

Use the 5-phase format. For each phase: user actions, touchpoints, thoughts, feelings (1-5 score),
pain points (🔴 critical / 🟡 notable), and opportunities.

Include an overall experience curve plotting sentiment across phases.
Lowest sentiment point = highest priority design opportunity.

Evidence basis: [research data available — interviews / analytics / support tickets / assumption]
```

---

## 30-day ramp plan (new UX hires or career switchers)

### Week 1 — Setup and research tools
- Install all product skills: `npx claudient add skills product`
- Run `/persona-builder` on existing user research data — get familiar with the current user understanding
- Run `/ux-audit` on the product's most-used flow — baseline heuristic assessment
- Review existing usability test reports with `/usability-report` as a formatting reference

### Week 2 — Research practice
- Conduct your first user interviews — take raw notes
- Use `/ux-researcher` to synthesise immediately after each session (don't let notes go cold)
- Draft a research synthesis report and share with the team
- Practice `/ux-audit` on 3 competitor products — build your heuristic evaluation instinct

### Week 3 — Report and communication
- Run a full usability test on a current feature
- Write the report with `/usability-report` — share with PM and engineering
- Convert findings to a stakeholder brief using the format above
- Track which recommendations get accepted vs. deprioritised — and why

### Week 4 — Experiment and validate
- Use `/experiment-designer` to design a test for your top design hypothesis
- Use `/hypothesis-tester` agent to validate assumptions against existing analytics or research
- Run a heuristic walkthrough with an engineer using your `/ux-audit` output as the agenda

---

## Tool integrations

### Figma (design tool)
Claude Code doesn't read Figma files directly. Best practice:
- Export key screens as images and reference in your audit prompt
- Use the Figma "Share for presentation" link as a reference in your notes
- Describe the UI in structured terms if you can't share screenshots

### Dovetail / Notion (research repository)
Export interview notes as plain text → paste into `/ux-researcher` synthesis prompts.
For structured repositories, copy the raw notes or highlights — not the tagged/coded view.

### Maze / UserTesting.com (unmoderated testing)
Export session summaries and task completion metrics → paste into `/usability-report`.
Include the quantitative metrics (completion rate, time on task) and the qualitative highlights.

### Miro / FigJam (collaborative workshops)
Use Claude to generate the affinity map content → export to Miro for visual grouping.
The `/usability-report` synthesis step produces grouped themes you can translate directly to sticky notes.

### Linear / Jira (issue tracking)
Use the prioritised fix list from `/usability-report` and `/ux-audit` to generate issues directly.

```bash
# Ask Claude to format the fix list as Linear/Jira tickets
"Format the P1 and P2 findings as Linear issue descriptions with:
- Title (imperative)
- User story (as a [persona], I want to...)
- Acceptance criteria (3-5 bullet points)
- Labels: [ux] [bug] or [ux] [improvement]"
```

---

## Metrics to track

Use these to demonstrate research impact:

| Metric | Target |
|---|---|
| Research-to-recommendation cycle time | <2 days from last session to shared report |
| Recommendation adoption rate | >60% of P1/P2 findings addressed within 2 sprints |
| SUS score improvement (post-fix) | +5 SUS points per major heuristic fix cycle |
| Time to persona update after research | <1 week |
| Accessibility issues found pre-launch (vs. post-launch) | 100% caught pre-launch |
| Usability report delivery after test completion | <48 hours |

---

## Common mistakes (and how Claude Code helps avoid them)

**Mistake 1: Writing reports no one reads**
Stakeholders don't read 20-page reports. Use `/usability-report`'s executive summary format and the decision brief output. One page, three findings, a recommendation, and an effort estimate.

**Mistake 2: Personas with no data behind them**
`/persona-builder` flags every claim that lacks evidence and refuses to fabricate quotes. Feed it real data.

**Mistake 3: Auditing everything equally**
`/ux-audit` scores by severity × frequency and produces a forced-ranked list. Don't treat a cosmetic issue and a task-blocking issue as equivalent.

**Mistake 4: Research synthesis that takes a week**
Run `/ux-researcher` immediately after each session. Don't batch — synthesise as you go. Notes that are 3 days old lose their texture.

**Mistake 5: Skipping the "why it matters" translation**
Engineers and PMs need to understand the business impact, not just the UX problem. The `/usability-report` output always includes a "why it matters" section for each finding — don't skip it.

---

## Resources

- [Getting started with Claude Code](../getting-started.md)
- [UX research sprint workflow](../workflows/ux-research-sprint.md)
- [Experiment design skill](../skills/product/experiment-designer.md)
- [Product discovery skill](../skills/product/product-discovery.md)
- [Hypothesis tester agent](../agents/roles/hypothesis-tester.md)

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
