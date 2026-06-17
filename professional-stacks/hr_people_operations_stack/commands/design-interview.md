---
description: Designs interview process, rubric, panel, and scoring framework. Outputs interview-process-{role}.md with question bank and evaluation criteria.
---

# /design-interview

## What This Does

Builds a complete interview architecture for a role: defines evaluation dimensions, creates rubric, designs interview loop (phone screen → technical → system design → behavioral → executive), assigns interviewers, and provides question bank with scoring guidelines.

## Steps Claude Follows

1. **Ask for:** Role, level, team, critical competencies (technical, leadership, collaboration, etc.)
2. **Run interview-architect skill** — Full design checklist
3. **Define evaluation dimensions** — 4–5 key competencies; assign weights
4. **Create rubric** — 5-level scale (Needs Improvement to Exceptional) with concrete examples
5. **Design interview loop** — Structure (# of interviews, duration, format, order)
6. **Assign panel composition** — Who interviews; what each evaluates
7. **Build question bank** — 2–3 starter questions per dimension; follow-up probes
8. **Define pass/fail criteria** — What constitutes "hire" vs. "no hire" decision
9. **Output interview-process-{role}.md** with rubric, loop, questions, and scoring guide
10. **Summary recommendation** — "5-interview loop (phone screen → technical → system design → behavioral → exec). 4 weeks total. Hire threshold: 3.5/5 average across all dimensions."

## Output Format

### Interview Process Document
```
# Interview Process: [Role] — [Level]

## Evaluation Dimensions
[4–5 key competencies; weight each by importance]

## Rubric (5-level scale)
[For each dimension: Needs Improvement → Exceptional with examples]

## Interview Loop
[Format, duration, interviewer, focus for each round]

## Question Bank
[2–3 starter questions per dimension; probes; what to listen for]

## Scoring & Decision Framework
[How to score; how to aggregate; hire/no-hire threshold]
```

### Scoring Template
```
# Interview Feedback — [Candidate] — [Round]

Dimension: [Technical Competency / Leadership / etc.]
Score: [1–5]
Evidence: [Specific examples from interview]
Notes: [Strengths, gaps, concerns]

Overall: [Hire / No Hire / Need more info]
```

## Inputs You Provide

- Role title and level (e.g., "Senior Engineer," "Product Manager," "Engineering Manager")
- Team (Engineering, Product, Sales, etc.)
- Key competencies for success (which matter most for this role?)
- Interview preference (4 vs. 5 rounds? in-person vs. remote? asynchronous component?)
- Interviewer availability (who's on your panel?)

## Evaluation Dimensions (Standard Defaults)

**For Individual Contributor Roles:**
- Technical Competency (40%)
- Collaboration & Communication (25%)
- Learning Agility (20%)
- Ownership & Drive (15%)

**For Manager Roles:**
- Leadership & Ownership (30%)
- Team Building & Delegation (25%)
- Strategic Thinking (20%)
- Collaboration & Communication (15%)
- Technical Depth (10%)

**For Executive Roles:**
- Strategic Vision (30%)
- Leadership & Culture (25%)
- Business Acumen (20%)
- Executive Presence (15%)
- Learning Agility (10%)

---

## Interview Loop Formats

### Standard 4-Round Loop (IC roles)

1. **Phone Screen (30 min)** — Recruiter + IC engineer
   - Background, interest, baseline technical questions
   - Decision: Move forward or pass

2. **Technical Screen (90 min)** — 1 engineer
   - Coding challenge, problem-solving, trade-off analysis
   - Decision: Technical competency assessment

3. **Behavioral (60 min)** — Manager
   - Collaboration, ownership, learning, motivation
   - Decision: Fit + values alignment

4. **Decision Meeting** — Hiring team calibration
   - Aggregate scores, discuss trade-offs, make final hire/no-hire

### Standard 5-Round Loop (Senior IC / Manager)

Add **System Design** round between Technical and Behavioral (90 min, 2 senior engineers), evaluating architecture, scalability, trade-off thinking.

---

## Output Includes

- **Evaluation rubric** — 5-level scale for each dimension with concrete examples
- **Interview loop** — Format, duration, interviewer, focus
- **Question bank** — Starter questions + follow-up probes for each dimension
- **Scoring template** — How interviewers capture and rate feedback
- **Calibration guide** — How to aggregate scores; hire/no-hire threshold
- **Red flags checklist** — What stops an interview (discriminatory language, dishonesty, etc.)

---

## Example

```
Input: "Design interview for Senior Product Manager, tech company.
         Team: Product. Key competencies: Product thinking, cross-functional leadership,
         user empathy, execution."

Output:
# Interview Process: Senior Product Manager

## Evaluation Dimensions & Weights

1. Product Thinking (35%) — Ability to define strategy, analyze trade-offs, prioritize
2. Leadership & Influence (25%) — Driving alignment across teams without authority
3. User Empathy & Research (20%) — Understanding user problems; design thinking
4. Execution & Delivery (15%) — Shipping products; defining success metrics; iteration
5. Communication (5%) — Clarity in presenting ideas, listening to others

## Rubric Example: Product Thinking

5 (Exceptional): Proposes novel product direction backed by user research and data.
   Articulates clear competitive advantage. Identifies 3+ non-obvious trade-offs.
   Teaches interviewer new ways of thinking about problem.

4 (Exceeds): Strong product strategy; grounded in user insight.
   Clear trade-off analysis (competes on 2–3 dimensions).
   Asks probing questions about assumptions.

3 (Meets): Reasonable product strategy with some user evidence.
   Basic trade-off analysis (cost vs. speed, etc.).
   Needs some guidance on framing.

2 (Below Expectations): Product idea is underdeveloped; limited user validation.
   Weak trade-off analysis; doesn't consider alternatives.
   Struggles to articulate why this matters.

1 (Needs Improvement): Product thinking is surface-level; lacks rigor.
   No user understanding evident; doesn't ask clarifying questions.
   Proposal is vague or contradictory.

## Interview Loop

Round 1: Phone Screen (Recruiter + IC PM, 30 min)
- Background: "Walk us through your career. How did you become a PM?"
- Interest: "What attracted you to this role?"
- Decision: Move forward or pass

Round 2: Product Design (Senior PM, 90 min)
- Case: "Design a new feature for [our product]. Walk us through your approach."
- Scored on: Product thinking, user empathy, trade-off analysis
- Decision: Product competency assessment

Round 3: Cross-functional (Engineering Lead + Design Lead, 60 min)
- Scenario: "You've proposed a feature. Engineering says it takes 4 weeks; design says 2 weeks of research. Deadline is 3 weeks. How do you resolve?"
- Scored on: Leadership & influence, communication, execution pragmatism
- Decision: Cross-functional effectiveness

Round 4: Behavioral (VP Product or CEO, 60 min)
- Growth: "Tell us about a failure and what you learned."
- Motivation: "What are you looking for in your next role?"
- Scored on: Learning agility, communication, cultural fit
- Decision: Alignment + future potential

Round 5: Decision Calibration
- Hiring team meets; scores aggregated; hire/no-hire decision made
- Threshold: 3.5/5 average across all dimension = Hire

## Question Bank

### Product Thinking (Starter)
- "Tell us about a product you shipped. What was the most important decision you made?"
- Follow-up: "What if that decision went the other way? What would have happened?"
- Listen for: User insight, trade-off awareness, metric/data orientation

## Hiring Decision Framework

Aggregate scores from all interviews:

| Interviewer | Technical | Leadership | Empathy | Execution | Avg |
|---|---|---|---|---|---|
| PM | 4 | 4 | 4 | 4 | 4.0 |
| Eng Lead | 3 | 4 | 3 | 4 | 3.5 |
| Design Lead | 4 | 3 | 5 | 3 | 3.75 |
| VP Product | 4 | 4 | 4 | 4 | 4.0 |

Overall Average: 3.8 → **HIRE** (above 3.5 threshold)

## Next Steps

After interview design approval:
1. Share rubric with all interviewers (training alignment)
2. Create feedback forms aligned to scoring template
3. Schedule interviews on 2–3 week cadence
4. Conduct interviews; interviewers submit feedback within 24h
5. Calibration meeting to decide hire/no-hire
6. If hire: compensation benchmark + offer creation
```

## Customization Guide

**For startup/early-stage:** 3-round loop (reduce cost + speed)
- Phone screen → Skill assessment (compressed) → Behavioral/executive

**For highly technical role:** Add depth to technical rounds
- Add system design + coding challenge
- Consider take-home project (async skill assessment)

**For leadership role:** Add more cross-functional feedback
- CEO, peer manager, and skip-level feedback rounds

**For sales role:** Add customer-facing simulation
- Mock customer call or discovery scenario
