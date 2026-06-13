---
name: interview-scorecard
description: "Structured interview scorecard: competency-based questions, evaluation rubric, and debrief template for consistent, bias-resistant hiring decisions"
updated: 2026-06-13
---

# Interview Scorecard Skill

## When to activate
- You have an open role and need a structured interview process before the first candidate interview
- You want to reduce interviewer subjectivity and gut-feel hiring decisions
- You need to train new interviewers on how to evaluate a role they haven't hired for before
- You're preparing for a specific candidate interview and want targeted questions based on their background
- Your debrief process is inconsistent — people vote thumbs up/down without evidence
- You're building a hiring process for a role type you've never hired (new function, new seniority level)

## When NOT to use
- You just need a job description — use `/job-description` for that
- Sourcing candidates — use `/candidate-sourcer`
- Compensation benchmarking — use `/comp-benchmarker`
- Reference check conversations — different skill
- When you've already interviewed the candidate and are writing an evaluation from memory without notes (reconstruct from actual call notes only)

## Instructions

### Scorecard builder

```
Build a structured interview scorecard for [role].

Role: [Job title]
Level: [IC / Manager / Director / VP / C-suite]
Department: [Engineering / Sales / Marketing / CS / Ops / Finance]
Key responsibilities: [top 3-5 things this person will own]
Must-have competencies: [3-5 non-negotiable skills or traits]
Nice-to-have: [2-3 differentiators that separate good from great]
Deal-breakers: [specific backgrounds, signals, or traits that disqualify]

Build a scorecard with:

## Competencies to evaluate (4-6 per role)
For each competency:
- Name: [e.g., "Analytical thinking" / "Executive communication" / "Ownership mentality"]
- Definition: [exactly what does strong look like for this role at this level?]
- Why it matters: [how does this competency directly impact success in the role?]
- 2-3 interview questions:
  Question 1: [behavioural — "Tell me about a time you..."]
  Question 2: [situational — "How would you approach..."]
  Question 3 (optional): [follow-up probe — "What would you do differently?"]
- Evidence to look for in answers:
  Strong signal: [specific language, examples, or behaviour patterns]
  Weak signal: [vague answers, can't give examples, deflects responsibility]
  Red flag: [specific answer patterns that disqualify]

## Scoring rubric (for each competency)
4 — Exceptional: [specific description — goes beyond role requirements]
3 — Strong: [meets and consistently exceeds expectations]
2 — Developing: [inconsistently meets expectations — coaching needed]
1 — Not a fit: [below bar for this role at this level]

## Overall recommendation
Based on scores:
Average ≥ 3.5 → Strong Hire
Average 3.0-3.4 → Hire with reservations (note them)
Average 2.5-2.9 → No Hire (gaps too significant)
Average < 2.5 → Clear No Hire

## Debrief template
After each interview, each interviewer completes:
- Competency assessed: [which of the 4-6 competencies were you evaluating?]
- Evidence collected: [specific examples the candidate gave — quote them]
- Score per competency: [1-4 for each]
- Overall score: [1-4]
- Overall recommendation: [Strong Hire / Hire / No Hire / Strong No Hire]
- Top reason for recommendation: [1-2 sentences, evidence-based]
- Questions for the panel: [anything you want other interviewers to probe on]

Generate the full scorecard for [role].
```

### Competency-based question library

```
Generate competency-based interview questions for [competency].

Competency: [e.g., "Customer obsession" / "Data-driven decision making" / "Cross-functional influence"]
Role level: [IC / Manager / Senior IC / Director]
Function: [Sales / Engineering / Product / Marketing / Operations]

Question format: always behavioural STAR-format (Situation, Task, Action, Result)

Generate:
- 3 primary questions (open-ended, behavioural, specific to this competency)
- 2 follow-up probes (dig deeper when answers are vague or too high-level)
- 1 situational/hypothetical (for roles where candidates lack direct experience)

For each question, provide:
What you're testing: [the specific sub-skill within this competency]
Strong answer looks like: [concrete, specific, owns the outcome, quantifies if possible]
Weak answer looks like: [vague, says "we" not "I", no clear outcome, blame-shifts]
Red flag in this answer: [avoids the question, makes up a story, contradicts resume]

Common competencies for SaaS/tech roles:
- Problem-solving under ambiguity
- Stakeholder communication and influence
- Data-driven decision making
- Customer empathy and obsession
- Ownership and accountability
- Learning agility and growth mindset
- Collaboration and conflict resolution
- Execution and delivery under pressure
- Strategic thinking and prioritisation
- Building and developing teams (manager-level)

Generate the question library for [competency].
```

### Interview panel design

```
Design the interview panel structure for [role].

Role: [title]
Total interview stages: [X] (recommend 3-5 stages — more than 5 loses candidates)
Interview format: [remote / in-person / hybrid]
Decision-maker: [hiring manager]
Time to fill target: [X weeks]

Recommended panel design:

STAGE 1 — Recruiter screen (20-30 min, phone)
Purpose: Qualify basics — compensation, availability, motivation, communication
Who: Recruiter
Evaluates: culture fit baseline, communication, deal-breakers

STAGE 2 — Hiring manager screen (30-45 min, video)
Purpose: Assess technical competency and role fit at a high level
Who: Hiring manager
Evaluates: [top 2 competencies for this role]
Outputs: decision to advance or pass — no ambiguous "maybes" without specifics

STAGE 3 — Technical / skills assessment (varies)
Purpose: Role-specific evaluation — presentation, case study, take-home, live exercise
Who: Hiring manager + 1-2 domain experts
Format: [choose — live case / take-home with debrief / work sample / portfolio review]
Rule: Make it realistic and relevant — no trick questions, nothing that takes > 2 hours

STAGE 4 — Panel interviews (60-90 min total, 2-3 interviews back-to-back)
Purpose: Assess breadth of competencies from multiple perspectives
Who: 2-3 team members from relevant functions
Each interviewer gets assigned 1-2 competencies to evaluate — no overlap
Interviewers do NOT share impressions before debrief

STAGE 5 — Executive / leadership interview (30-45 min, optional for senior roles)
Purpose: Culture, leadership values, strategic fit
Who: Hiring manager's manager or C-suite
Evaluates: Vision alignment, communication at executive level, ambition

DEBRIEF PROCESS:
- Each interviewer submits scorecard within 24 hours of interview
- Debrief meeting: 30-45 min with all panel members
- Structured: each person shares score + evidence before any discussion
- No one changes their score because of group pressure — note disagreements
- Decision: Hire / No Hire / Extend process

Design the interview panel for [role].
```

### Debrief facilitation guide

```
Facilitate the interview debrief for [candidate] for [role].

Candidate: [Name]
Role: [Title]
Interview panel:
- [Interviewer 1] — evaluated [competency A, B]
- [Interviewer 2] — evaluated [competency C, D]
- [Interviewer 3] — evaluated [competency E, F]

Debrief structure (follow this order — do NOT allow free-form discussion to start):

RULE: Scores and evidence before opinions. No one should influence others before sharing their own assessment.

1. Go around: each interviewer shares score per competency and overall recommendation
   - "My overall is [Strong Hire / Hire / No Hire / Strong No Hire] because [1 specific piece of evidence]"
   - No commentary from others until all scores are on the table

2. Note disagreements
   - If two interviewers differ by more than 1 point on the same competency: discuss
   - "You scored data-driven decision making a 4; I scored it a 2. Let's share what we observed."
   - Goal: reach evidence-based consensus, not averaging or deferring to seniority

3. Aggregate scores
   - Average per competency across all interviewers
   - Overall average
   - Hiring bar: [your threshold — e.g., 3.0+ overall]

4. Explicit decision discussion
   - If strong consensus → move to offer or rejection
   - If split panel → the hiring manager makes the call and documents the reason
   - Never leave debrief with "let me think about it" — commit to a decision

5. If hire: What onboarding needs does this candidate have?
   - Gaps to address in 30-60-90 plan
   - Who should be their early mentor or buddy?

6. If no hire: feedback to recruiter
   - Which competency was the disqualifier?
   - Is this candidate worth keeping in pipeline for a different role?
   - Was there a sourcing/screening issue upstream?

Produce debrief summary and hiring decision.
```

## Example

**User:** I'm hiring a Head of Customer Success. They'll manage 3 CSMs and own a $4M ARR portfolio. What scorecard should I use?

**Claude's scorecard:**

**Head of Customer Success — Interview Scorecard**

**Competencies to evaluate:**

**1. Commercial acumen (Net Revenue Retention ownership)**
Questions:
- "Tell me about a time you developed a renewal strategy for a customer who was at risk. What was the outcome?"
- "How do you think about balancing customer health with expansion targets — and how have you managed that tension?"
Follow-up probe: "What would you do differently if you had to run that renewal again?"
Strong: Speaks specifically to NRR as a metric, shows they understand expansion economics, not just "making customers happy"
Red flag: Defines CS success purely as satisfaction/NPS without revenue contribution

**2. Manager and team development**
Questions:
- "Tell me about a CSM you've developed who was underperforming. What did you do and what happened?"
- "How do you structure 1:1s and ensure your team is developing professionally, not just hitting their numbers?"
Strong: Specific person, specific coaching action, before/after outcome. Shows they can differentiate coaching from managing out.
Red flag: "I set clear expectations and hold people accountable" — describes outputs, not their actual management behaviour.

**3. Executive relationship management**
Questions:
- "Tell me about an executive at a customer who was dissatisfied with your product. How did you handle it?"
- "How do you get and keep exec sponsors engaged at accounts where your product is used operationally but not strategically?"
Strong: Approached it proactively, owned the relationship, escalated internally when needed, clear outcome.
Red flag: Handled all escalations through the champion rather than directly engaging the exec.

**4. Data-driven CS operations**
Questions:
- "Describe the health score model you built or improved. What signals did you use and how did you validate it?"
- "How do you prioritise your team's time across a portfolio of 50+ accounts?"
Strong: Can name specific signals, explain trade-offs, describe how they measured predictive accuracy.
Red flag: Health score is "vibes" + login frequency only. No mention of validation or iteration.

**5. Cross-functional influence (Product and Engineering)**
Question: "Tell me about a time you advocated for a customer need internally and either won or lost. What was the process and what would you do differently?"
Strong: Built a business case with revenue data, partnered with Product rather than demanded, influenced without authority.
Red flag: Complains that "Product never listens to CS." Doesn't describe their own role in the dynamic.

**Overall bar: 3.0+ average to hire at this level.**

---
