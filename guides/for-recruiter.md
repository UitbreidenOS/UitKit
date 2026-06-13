# Claude for Recruiters and HR

Everything a Recruiter or HR professional needs to run AI-augmented hiring pipelines — from writing the job description to structuring interviews to generating offer letters — without losing the human judgment that makes great hiring decisions.

---

## Who this is for

You are a recruiter, talent acquisition specialist, or HR generalist responsible for filling roles fast and well. You manage multiple open positions, coordinate with hiring managers who have unclear requirements, and are expected to source, screen, assess, and close candidates — often without a full team.

**Before Claude Code:** 2-3 hours to write a complete JD and scorecard. 1 hour to build a sourcing search and outreach sequence. 30 minutes to document each interview debrief. Market research for comp benchmarking done manually from Glassdoor.

**After:** Complete JD in 15 minutes. Sourcing search + outreach messages in 20 minutes. Scorecard built for any role in 30 minutes. Comp benchmarks researched and structured in 10 minutes. You spend more time on candidate conversations and less on documentation.

---

## 30-second install

```bash
# Install the full recruiter stack
npx claudient add skill productivity/interview-scorecard
npx claudient add skill productivity/comp-benchmarker
npx claudient add skill productivity/candidate-sourcer
npx claudient add skill small-business/hiring-pipeline
npx claudient add skill small-business/job-description
npx claudient add skill productivity/team-onboarding
npx claudient add agent advisors/chro-advisor
```

---

## Your Claude Code recruiter stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/candidate-sourcer` | Boolean search strings, LinkedIn outreach messages, pipeline tracking | When you need to proactively source |
| `/interview-scorecard` | Competency-based questions, scoring rubric, panel design, debrief template | Every new role — before first interview |
| `/comp-benchmarker` | Salary bands, equity guidelines, offer letter generation | Before posting the role and before making an offer |
| `/job-description` | Role definition, requirements writing, tone calibration | Opening a new req |
| `/hiring-pipeline` | Pipeline stages, SLAs, reporting templates | Managing multiple open roles |
| `/team-onboarding` | 30-60-90 day onboarding plan for new hires | When an offer is accepted |

### Agents

| Agent | Model | When to spawn |
|---|---|---|
| `chro-advisor` | Opus | Org design, HR strategy, handling sensitive people issues |

---

## Daily workflow

### Morning (20-30 minutes)

**1. Pipeline review — Monday morning**
```
/hiring-pipeline

Weekly pipeline review — week of [DATE].

Open roles:
| Role | Dept | Stage | Candidates in pipeline | Goal date |
|---|---|---|---|---|
| [Title] | [Dept] | [Sourcing / Screening / Interviews / Offer] | [N] | [date] |
| [Title] | [Dept] | [stage] | [N] | [date] |

For each role:
- What's the bottleneck? (not enough candidates / candidates not advancing / offers declining)
- What actions are due this week?
- Any roles at risk of missing their goal date?

Give me a prioritised action list for this week.
```

**2. Candidate outreach — batch twice per week**
```
/candidate-sourcer

I'm sourcing for [Role] in [Location].

Must-have qualifications:
- [Qualification 1]
- [Qualification 2]

Target companies: [list 5-8 companies where I'd find this background]

Build:
1. LinkedIn Recruiter Boolean search string
2. Google X-Ray search variant
3. Outreach message template (personalised first line + role hook + CTA)
4. Follow-up message (for non-responders after 7 days)

I'm sending 20 messages this week — help me structure the outreach.
```

---

### Interview preparation

**3. Build scorecard for a new role**
```
/interview-scorecard

Build an interview scorecard for [Role].

Level: [Senior IC / Manager / Director]
Department: [Dept]
Key responsibilities:
- [Responsibility 1]
- [Responsibility 2]
- [Responsibility 3]

Must-have competencies:
- [Competency 1]
- [Competency 2]
- [Competency 3]

Deal-breakers:
- [Anything that disqualifies]

Build: 4-5 competencies with 2-3 questions each, scoring rubric (1-4),
interview panel design (who interviews for which competency),
and debrief template for the hiring manager.
```

**4. Candidate-specific prep (before a panel interview)**
```
/interview-scorecard

I'm interviewing [Candidate Name] for [Role] tomorrow.

Their background: [describe — current role, company, relevant experience from LinkedIn or CV]
The competency I'm evaluating: [which competency did I get assigned]
What I know about their strengths: [what stands out from their CV/screen]
What I'm uncertain about: [the gaps or things I want to probe on]

Give me:
- 3 tailored questions for this candidate (not generic — reference their background)
- What strong vs. weak answers look like for each question
- Follow-up probes if they give a high-level answer
- What I should flag for the debrief
```

---

### Offer management

**5. Compensation research and offer building**
```
/comp-benchmarker

Build a compensation offer for [Role] at [Company].

Role: [Title]
Level: [Senior IC / Manager]
Location: [City, Country]
Company stage: [Series A / B / public / enterprise]

Our current band for this role: $[X] - $[Y] base
Candidate's current comp: $[X] base, $[X] bonus, $[X] equity
Competing offer (if known): $[X] at [Company]

Build:
1. Market benchmark for this role and location (where does our band fall?)
2. Recommended offer within our band with rationale
3. Equity package (options or RSUs based on our stage)
4. Full offer package summary
5. Script for the verbal offer call
6. Objection responses if they counter
```

**6. Offer letter**
```
/comp-benchmarker

Generate an offer letter for [Candidate Full Name] for the [Role] position.

Company: [Name]
Start date: [date]
Base salary: $[X]
Bonus: [X% of base, paid annually]
Equity: [X shares, 4-year vest, 1-year cliff]
Benefits: [describe]
Location: [city or remote]
Reports to: [Manager Name, Title]
Offer expires: [date — give 5-7 business days]

Generate a professional offer letter with all components clearly stated.
Include note that equity is subject to board approval.
```

---

### Onboarding handoff

**7. Onboarding plan for new hire**
```
/team-onboarding

Build a 30-60-90 day onboarding plan for [New Hire Name] joining as [Role].

Start date: [date]
Manager: [name]
Team: [describe the team they're joining]
Key stakeholders to meet in first 30 days: [list]
Primary goals for first 90 days: [what does success look like?]
Tools and systems to set up: [list]
Any role-specific context: [nuances, current projects, challenges they inherit]

Produce: structured 30-60-90 plan with weekly milestones, stakeholder meeting schedule,
and success criteria for each phase.
```

---

## 30-day ramp plan (new recruiters or HR generalists)

### Week 1 — Role requirements and process design
- Install all skills via install commands above
- For every open role: run `/interview-scorecard` to document what you're hiring for before touching any candidates
- Run `/comp-benchmarker` for every open role — know your band before you source or screen
- Audit your current pipeline: which roles are stalled and why?

### Week 2 — Active sourcing
- Run `/candidate-sourcer` for your top 2 open roles — build search strings and outreach sequences
- Send 20+ outreach messages per role this week
- Use `/job-description` to audit or rewrite any JD that's been live > 30 days without quality applicants
- Establish your sourcing-to-screen conversion rate baseline

### Week 3 — Interview process
- Run every scheduled interview using the scorecard from week 1
- Run debrief using the structured debrief process — not open discussion
- Track: where are offers being declined? Compensation, role clarity, or process length?
- Share one sourcing and scoring process improvement with the hiring manager

### Week 4 — Offer and reporting
- Make your first offer using `/comp-benchmarker` data — defend the number with market research
- Run the weekly pipeline review and share metrics with leadership
- Build your first monthly recruiting report: time-to-fill per role, source quality, offer accept rate
- Identify: what's the #1 bottleneck in your hiring process right now?

---

## Tool integrations

### LinkedIn Recruiter

Use `/candidate-sourcer` to generate Boolean strings → run in LinkedIn Recruiter. Export profiles → build your outreach list in Recruiter → use Claude-generated templates for InMail.

### Greenhouse / Lever / Ashby (ATS)

Export candidate pipeline data as CSV → paste into Claude for analysis. Claude works with any ATS output. Use Claude to:
- Write structured interview feedback that goes into the ATS
- Generate offer letter text to paste into DocuSign
- Analyse pipeline drop-off by stage

### HubSpot or Notion for pipeline tracking

If you don't have a formal ATS, use the pipeline tracker structure from `/candidate-sourcer` in Notion or a spreadsheet. Claude can read your pipeline data and generate weekly status reports.

### Levels.fyi / Glassdoor (comp research)

Claude uses your pasted market data from these sources to calibrate recommendations in `/comp-benchmarker`. Pull the relevant data, paste it in, and Claude analyses it in context of your role and company stage.

---

## Metrics to track

| Metric | Definition | Green | Yellow | Red |
|---|---|---|---|---|
| Time to fill | Days from req open to offer accepted | < 30 days | 30-60 days | > 60 days |
| Offer accept rate | % of extended offers accepted | > 85% | 70-85% | < 70% |
| Sourcing response rate | % of outreach messages that get a reply | > 20% | 10-20% | < 10% |
| Funnel conversion (sourced → hired) | % of sourced profiles who become hires | > 3% | 1-3% | < 1% |
| Interview-to-offer ratio | # of interviews per hire | < 5:1 | 5-8:1 | > 8:1 |
| New hire 90-day retention | % of hires still employed at 90 days | > 90% | 80-90% | < 80% |
| Hiring manager satisfaction | Rated by hiring managers post-hire | > 4/5 | 3-4/5 | < 3/5 |

---

## Common recruiting mistakes (and how Claude Code helps avoid them)

**Mistake 1: Starting to source before knowing what you're hiring for**
`/interview-scorecard` forces competency definition before any outreach. If you can't write the scorecard, you don't know what you're hiring for yet.

**Mistake 2: Generic InMail messages**
`/candidate-sourcer` produces templates that require a personalised first line. No personal hook = don't send.

**Mistake 3: Compensation surprises at offer stage**
`/comp-benchmarker` builds the band before you start screening. Candidates whose expectations don't match your range should be qualified out in the first call, not at offer.

**Mistake 4: Debrief by consensus (HiPPO effect)**
The debrief structure in `/interview-scorecard` requires each interviewer to share scores before open discussion. This prevents the most senior person in the room from anchoring everyone's opinion.

**Mistake 5: No onboarding plan ready on Day 1**
`/team-onboarding` generates the 30-60-90 plan before the candidate starts — not the week they arrive. A bad first week is an avoidable early churn signal.

---

## Resources

- [Getting started with Claude Code](./getting-started.md)
- [Interview scorecard skill](../skills/productivity/interview-scorecard.md)
- [Comp benchmarker skill](../skills/productivity/comp-benchmarker.md)
- [Candidate sourcer skill](../skills/productivity/candidate-sourcer.md)
- [Recruiting pipeline workflow](../workflows/recruiting-pipeline.md)
- [Team onboarding skill](../skills/productivity/team-onboarding.md)

---
