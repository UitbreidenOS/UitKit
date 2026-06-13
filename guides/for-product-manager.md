# Claude for Product Managers

Everything a product manager needs to run AI-augmented discovery, roadmap planning, sprint delivery, stakeholder alignment, and data-driven decisions — using Claude Code.

---

## Who this is for

You are a PM at a startup or scale-up managing a product with real customers, an engineering team that depends on you for clear specs, and stakeholders who need alignment. You spend too much time writing documents, preparing meetings, and chasing decisions. Claude Code cuts that overhead so you can spend more time with customers and thinking about the product.

**Before Claude Code:** 4 hours to write a PRD. 2 hours to prep discovery interviews. 1 hour to write sprint stories. Half a day to build a competitive teardown.

**After:** PRD drafted in 45 minutes. Interview guide in 10 minutes. Sprint backlog refined in 30 minutes. Competitive teardown in an hour.

---

## 30-second install

```bash
# Install the full PM stack
npx claudient add skill product/product-discovery
npx claudient add skill product/product-roadmap
npx claudient add skill product/experiment-designer
npx claudient add skill product/product-analytics
npx claudient add skill product/competitive-teardown
npx claudient add skill product/ux-researcher
npx claudient add skill product/code-to-prd
npx claudient add skill product/product-manager-toolkit
npx claudient add skill product/pm-sprint-review
npx claudient add skill product/user-story-writer
npx claudient add agents advisors/cpo-advisor
npx claudient add agents roles/competitive-analyst
```

---

## Your Claude Code PM stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/product-discovery` | Customer interview guides, JTBD analysis, opportunity scoring, problem briefs | Before committing to build anything |
| `/user-story-writer` | Convert rough ideas to structured stories with AC and edge cases | Backlog grooming, sprint planning |
| `/code-to-prd` | Reverse-engineer a PRD from existing code — or generate a PRD from a brief | Feature documentation, stakeholder alignment |
| `/product-roadmap` | Build and communicate a prioritised roadmap with rationale | Quarterly planning, stakeholder reviews |
| `/pm-sprint-review` | Sprint velocity, shipped vs planned, retro, next sprint priorities | End of every sprint |
| `/experiment-designer` | A/B test design, hypothesis framing, sample size, success metrics | Growth experiments, feature flags |
| `/product-analytics` | Funnel analysis, cohort retention, event schema, metrics interpretation | Weekly data review, post-launch |
| `/ux-researcher` | Usability test scripts, interview synthesis, persona building | Design validation |
| `/competitive-teardown` | Full competitor analysis: positioning, features, pricing, SWOT | Quarterly, before planning cycles |
| `/product-manager-toolkit` | Prioritisation frameworks (RICE, ICE, MoSCoW), stakeholder maps, decision docs | Day-to-day PM craft |

### Agents

| Agent | Model | When to spawn |
|---|---|---|
| `cpo-advisor` | Opus | Strategic product decisions, roadmap trade-offs, org design |
| `competitive-analyst` | Sonnet | Detailed competitor intelligence, feature benchmarking |

---

## Daily workflow

### Morning standup prep (10 minutes)

```
/pm-sprint-review

Quick standup summary for Sprint [N] — Day [X]:

Team: [N engineers, N designers]
Sprint goal: [state it]

Yesterday's updates (pull from Linear/Jira):
- [Ticket] completed by [person]
- [Ticket] in review
- [Ticket] blocked — [reason]

Today's plan:
- [Ticket] — [engineer name]
- [Ticket] — [designer name]

Blockers needing PM attention:
- [Blocker 1 — what do I need to resolve today?]

Summarise as a 2-minute standup briefing I can read aloud or post in Slack.
```

### Backlog grooming (as needed)

```
/user-story-writer

Groom these rough items from the backlog:

1. "[Rough idea or stakeholder request]"
   Context: [any additional detail you have]

2. "[Rough idea]"
   Context: [...]

For each: write a full user story with AC, edge cases, definition of done, and story point estimate. Flag if any need more discovery before writing.
```

### Stakeholder comms

```
/product-manager-toolkit

Write a stakeholder update for [audience — exec team / CEO / sales / customer success]:

Sprint [N] outcome: [shipped / missed / partial]
Key deliverable: [what shipped that they care about]
Impact: [what does this enable — customer value or business metric]
What's next: [Sprint N+1 top item]
Any risks or decisions needed from them: [list]

Keep it to a Slack message or short email. No bullet soup.
```

---

## Key workflows by scenario

### New feature request from a customer or stakeholder

```
Step 1: Is this real?
/product-discovery

Customer request: "[paste the request or feature ask]"
Source: [enterprise customer / 15 separate support tickets / CEO / one power user]

Analyse:
- Is this a symptom or the real job to be done?
- How many customers have this problem?
- What are they doing today as a workaround?
- Does solving this align with our product thesis?
- What would we need to believe for this to be in the top 5 priorities?

Step 2: If real — write the story
/user-story-writer

Feature brief: [paste what you learned from step 1]
Write the user story ready for sprint planning.

Step 3: Size and prioritise
/product-manager-toolkit

Add this story to my prioritisation matrix.
Current candidates: [list existing backlog items]
RICE scores: [Reach, Impact, Confidence, Effort]
Where does this new story land in priority order?
```

### PRD for a significant feature

```
/code-to-prd

Write a PRD for: [FEATURE NAME]

Problem: [what problem this solves and for whom]
Evidence: [customer research, support data, analytics showing the gap]
Scope: [what's in and what's explicitly not in this release]
Success metric: [the one metric that proves this feature succeeded]
Timeline: [target sprint or date]
Dependencies: [other teams, APIs, design work needed]

Generate the full PRD: problem statement, goals and non-goals, user stories, success metrics, open questions, out of scope.
```

### Quarterly roadmap planning

```
/product-roadmap

Build the product roadmap for [QUARTER/YEAR].

Input themes (from customer research, business goals, technical debt):
Theme 1: [description] — strategic importance: [why this matters now]
Theme 2: [description]
Theme 3: [description]

Constraints:
- Engineering capacity: [N engineer-weeks]
- Design capacity: [N designer-weeks]
- Hard deadlines: [any commitments already made]
- Non-negotiables: [anything that must ship regardless of prioritisation]

Produce: a NOW / NEXT / LATER roadmap with rationale per item, dependencies, and risks.
```

### Post-launch analysis

```
/product-analytics

Analyse the performance of [FEATURE] launched on [DATE].

Metrics available:
- Adoption: [X% of users triggered the feature in first 2 weeks]
- Retention impact: [D14 retention for feature users vs. control: X% vs. Y%]
- Funnel: [X users saw it, Y activated, Z completed the core flow]
- Support tickets: [N tickets related to this feature since launch]
- NPS comments mentioning it: [paste any relevant comments]

Tell me:
1. Is this feature working? (strong signal / weak signal / too early to tell)
2. What does the data suggest we do next? (iterate, expand, retire, or wait)
3. What's the one metric I should track weekly to know if it's improving?
```

---

## 30-day ramp plan (PM joining a new team or product)

### Week 1 — Context and discovery
- Install all PM skills via the commands above
- Run `/product-discovery` on the top 3 customer pain points you've heard
- Talk to 5 customers — use the interview guide from `/product-discovery`
- Map the existing product with `/competitive-teardown` (your own product, not a competitor) — understand what you have

### Week 2 — Backlog and sprint rhythm
- Run `/pm-sprint-review` on the last 3 sprints — understand velocity and recurring blockers
- Go through the top 20 backlog items with `/user-story-writer` — assess quality and refine the worst stories
- Sit in on all sprint rituals — don't run them yet, just observe

### Week 3 — Roadmap and stakeholders
- Use `/product-roadmap` to map what exists and what's been committed
- Use `/product-manager-toolkit` to build a stakeholder map — who has influence over roadmap decisions?
- Draft your first stakeholder update with `/product-manager-toolkit`

### Week 4 — Own it
- Run your first full sprint review with `/pm-sprint-review`
- Write your first user stories for the next sprint with `/user-story-writer`
- Share your 30-60-90 day product thesis with the CPO — use `/cpo-advisor` to pressure-test it

---

## Tool integrations

### Linear (recommended for sprint management)

```json
// Add to ~/.claude/settings.json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-key-here"
      }
    }
  }
}
```

With Linear connected, Claude can read sprint status, ticket details, and cycle history — powering sprint reviews without manual copy-paste.

### Notion (for PRDs and roadmaps)

Connect the Notion MCP to let Claude read and update your PRD database, roadmap view, and discovery notes — keeping documentation in sync with decisions.

### Amplitude / Mixpanel

Export event data as CSV or paste query results into `/product-analytics`. For real-time analysis, the Amplitude API can be connected via MCP for live metric queries during planning sessions.

### Figma

For design-PM collaboration, Claude can read Figma links and reference visual context when writing acceptance criteria. Combine with `/user-story-writer` to write AC that references specific design states.

---

## Metrics to track

### Sprint health

| Metric | Target | Warning sign |
|---|---|---|
| Sprint goal hit rate | >70% | <50%: planning or scope problem |
| Velocity predictability | ±20% of average | Wild swings: estimation or unplanned work problem |
| Unplanned work | <20% of sprint capacity | >30%: reactive team, not proactive |
| Story point accuracy | ±1 point average | Consistent over-estimates: safety buffering |

### Product health

| Metric | Target (varies by product) | Why it matters |
|---|---|---|
| Feature adoption (D14) | >30% of active users | Is anyone using what you shipped? |
| Time-to-value | Decreasing | Is onboarding improving? |
| Support ticket rate per feature | Declining | Is quality improving? |
| NPS impact of new features | Neutral to positive | Are you building things users love? |
| Experiment win rate | >30% | Are your hypotheses calibrated? |

---

## Common PM mistakes Claude Code helps avoid

**Mistake 1: Building before validating**
`/product-discovery` forces you to frame the problem and gather evidence before writing a word of spec. No discovery → no story.

**Mistake 2: Stories too big to finish in one sprint**
`/user-story-writer` includes a size check and splitting guide. Anything estimated at > 5 points gets split before going to sprint planning.

**Mistake 3: Acceptance criteria that can't be tested**
The AC quality checker in `/user-story-writer` flags criteria that are too vague for a QA engineer to test. Every AC must be observable and specific.

**Mistake 4: Retrospectives with no action**
`/pm-sprint-review` enforces a maximum of 2 retro action items per sprint. More than 2 means none get done.

**Mistake 5: Roadmap with no rationale**
`/product-roadmap` generates rationale for every item in the roadmap. If you can't explain why something is on the roadmap, it shouldn't be there.

---

## Resources

- [Getting started with Claude Code](getting-started.md)
- [PM sprint workflow](../workflows/pm-sprint.md)
- [Product discovery skill](../skills/product/product-discovery.md)
- [User story writer skill](../skills/product/user-story-writer.md)
- [Sprint review skill](../skills/product/pm-sprint-review.md)
- [CPO advisor agent](../agents/advisors/cpo-advisor.md)

---
