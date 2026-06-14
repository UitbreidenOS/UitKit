---
name: interview-architect
description: Designs interview process: rubric, panel composition, scoring framework, and interview loop format. Outputs interview-process-{role}.md with question bank and scoring guide.
allowed-tools: Read, Write
effort: medium
---

## When to activate

Before scheduling first round of interviews. Defines interview rubric, panel, format, and evaluation criteria for consistent, defensible hiring decisions.

## When NOT to use

Not for candidate evaluation — that happens during interviews. Not for individual interviewer feedback loops (use the rubric after interviews). Not for onboarding or post-hire assessment.

## Interview Architecture Checklist

Execute in order:

1. **Define evaluation dimensions** — 4–5 key competencies (technical, leadership, collaboration, etc.) needed for success in role
2. **Weight each dimension** — How much does each matter? (e.g., technical 40%, leadership 30%, collaboration 20%, communication 10%)
3. **Create rubric** — For each dimension, define 5-level scale (Needs Improvement, Below Expectations, Meets, Exceeds, Exceptional) with concrete examples
4. **Design interview loop** — Choose 4–5 interviews covering different dimensions (technical screen, system design, behavioral, etc.)
5. **Assign panel composition** — Who interviews (engineers, manager, etc.) and what they evaluate
6. **Write question bank** — 2–3 starter questions per dimension; include follow-ups and probes
7. **Define pass/fail criteria** — What constitutes "hire" vs. "no hire" decision
8. **Define scoring process** — How do interviewers record feedback; how is final decision made

## Evaluation Dimensions & Competency Definitions

### Technical Competency (40% weight for IC roles)

**Definition:** Demonstrated mastery of required technologies and problem-solving approach; ability to write correct, maintainable code; depth of understanding of trade-offs.

**5-level rubric:**

| Level | Descriptor | Example |
|-------|---|---|
| **1: Needs Improvement** | Struggles with basic concepts; makes logical errors; incomplete solutions | Can't design a solution; code has off-by-one errors or logic flaws |
| **2: Below Expectations** | Understands fundamentals; gets partial solution; misses edge cases or optimization | Correct basic approach but inefficient; doesn't consider trade-offs |
| **3: Meets Expectations** | Correct solution; handles main cases + most edge cases; aware of trade-offs | Working code with reasonable efficiency; explains approach clearly |
| **4: Exceeds Expectations** | Correct, optimized solution; anticipates edge cases; communicates trade-offs and alternatives | Clean code; efficient; asks clarifying questions; suggests alternatives |
| **5: Exceptional** | Expert-level: correct, optimized, edge cases; proactive improvements; teaches interviewer | Not just solves problem — finds elegant approach; mentors interviewer on approach |

### Leadership & Ownership (25% weight for Senior IC+)

**Definition:** Takes ownership; drives decisions; accountable for outcomes; influences without authority; learns from failures.

**5-level rubric:**

| Level | Descriptor | Example |
|-------|---|---|
| **1: Needs Improvement** | Waits for direction; blames others; reactive to problems | "I did what my manager asked" — no proactive contribution |
| **2: Below Expectations** | Accepts tasks; somewhat accountable; limited initiative | Completes assigned work; reactive to problems; limited follow-through |
| **3: Meets Expectations** | Owns project outcomes; drives some decisions; accountable; learns from setbacks | "I led the [project] and shipped it on time" — explains decisions and trade-offs |
| **4: Exceeds Expectations** | Proactive; influences others; takes calculated risks; resilient; drives improvement | "I identified the bottleneck, proposed solution, aligned team, shipped" |
| **5: Exceptional** | Strategic thinker; shapes roadmap; builds teams; handles ambiguity; inspires others | "I saw the architectural gap, evangelized the fix, built the team, shipped, mentored 2 juniors" |

### Collaboration & Communication (20%)

**Definition:** Works well with others; explains thinking clearly; listens; builds trust; navigates disagreement constructively.

**5-level rubric:**

| Level | Descriptor | Example |
|-------|---|---|
| **1: Needs Improvement** | Dismisses input; unclear communication; difficult to work with | Interrupts interviewer; defensive about feedback |
| **2: Below Expectations** | Communicates with effort; somewhat collaborative; conflicts not always resolved | Explains some decisions but vague; doesn't ask for input |
| **3: Meets Expectations** | Clear communication; solicits input; resolves conflicts constructively; builds trust | Explains reasoning; listens to interviewer; handles feedback well |
| **4: Exceeds Expectations** | Excellent communicator; seeks diverse input; bridges disagreements; strong influence | Articulate; asks good questions; turns conflict into alignment |
| **5: Exceptional** | Exceptional listener; bridges silos; creates psychological safety; influences through trust | Interviewer feels heard; asks insightful questions; collaborative energy |

### Learning Agility (15%)

**Definition:** Reflects on feedback; adapts; admits gaps; seeks growth; becomes competent quickly in new domains.

**5-level rubric:**

| Level | Descriptor | Example |
|-------|---|---|
| **1: Needs Improvement** | Defensive about feedback; repeats mistakes; no growth mindset | "I don't think that's an issue" when feedback given |
| **2: Below Expectations** | Accepts feedback intellectually; slow to adapt; limited reflection | "OK, I'll try that" but doesn't seem genuinely open |
| **3: Meets Expectations** | Reflects on feedback; applies lessons; seeks growth opportunities | "I learned from that failure" with specific example |
| **4: Exceeds Expectations** | Proactively seeks feedback; reflects deeply; adapts quickly; grows | "I was wrong about [X]; here's what I learned and changed" |
| **5: Exceptional** | Learns from every experience; deeply self-aware; rapidly masters new domains | Articulates growth trajectory with specific lessons and evolution |

---

## Interview Loop Design

### Standard 5-Interview Loop (Senior Engineer)

| Interview | Duration | Interviewer | Focus | Decision |
|-----------|----------|---|---|---|
| **1. Phone Screen** | 30 min | Recruiter + Engineer | Background, interest, baseline technical | Move forward or pass |
| **2. Technical Screen** | 90 min | 1 Engineer | Coding, problem-solving, trade-off analysis | Technical competency assessment |
| **3. System Design** | 90 min | 2 Senior Engineers | Architecture, scalability, trade-off decisions | Technical depth + leadership |
| **4. Behavioral** | 60 min | Manager | Collaboration, ownership, learning, motivation | Fit + culture + values |
| **5. Executive** (optional) | 45 min | Director or VP | Strategic thinking, vision, leadership potential | Final fit + future growth |

**Total time investment:** ~5.5 hours (including prep/feedback)

---

## Question Bank & Evaluation Guide

### Technical Screen Questions

**Problem 1: Coding Challenge** (60 min)
- **Starter:** "Design a rate limiter for an API. Constraint: handle 10K requests/sec with <10ms latency."
- **Dimensions evaluated:** Problem-solving, communication, optimization, edge cases
- **Probes:**
  - "What if we need to handle distributed systems?" (scales problem; tests system design thinking)
  - "What are trade-offs in your approach?" (tests trade-off awareness)
  - "How would you test this?" (tests quality mindset)

**Scorer evaluates:**
- Correct solution (baseline)
- Handles edge cases (duplicate requests, clock skew)
- Optimization (efficient data structure, time/space trade-offs)
- Communication (explains thinking, asks clarifying questions)

---

### System Design Questions

**Problem: Design Recommendation Engine**

**Starter:** "Design a real-time recommendation system for 1M daily active users. Requirements: personalized recommendations, <500ms latency, 99.9% uptime."

**Dimensions:** Architecture, trade-offs, scalability, reliability

**Interviewer probes:**
- "How would you handle 10x growth?" (scalability thinking)
- "What if one service goes down?" (reliability; disaster recovery)
- "How do you measure success?" (metrics; ownership mentality)

**Scoring:**
- 5: Proposes robust, scalable architecture; anticipates problems; explains trade-offs
- 4: Correct architecture; handles most challenges; good trade-off analysis
- 3: Reasonable design; misses some edge cases or optimization opportunities
- 2: Design has gaps; doesn't handle scale well; weak trade-off analysis
- 1: Fundamentally flawed or incomplete design

---

### Behavioral Questions

**Question 1: Ownership & Accountability**
- "Tell us about a project where you took full ownership. What made it successful? What did you learn?"
- **Follow-ups:**
  - "What if you had failed? What would have been your responsibility?"
  - "How did you handle stakeholders/disagreement?"
- **What to listen for:**
  - Specific example (not vague)
  - Clear ownership; not deflecting blame
  - Learning from experience; reflection

**Question 2: Collaboration & Conflict**
- "Tell us about a time you disagreed with someone (manager, peer). How did you handle it?"
- **Follow-ups:**
  - "Did you change your mind or stand firm? Why?"
  - "What did they say afterwards?"
- **What to listen for:**
  - Handled respectfully; not win/lose mentality
  - Open to input; willing to change mind
  - Resolution-focused

**Question 3: Learning Agility**
- "Tell us about something you were terrible at when you started your current role. How did you get good?"
- **Follow-ups:**
  - "Who helped you? What resources?"
  - "How long did it take?"
- **What to listen for:**
  - Honest self-assessment (shows self-awareness)
  - Specific growth trajectory
  - Sought help/feedback (learning mindset)

---

## Interview Score Template

```markdown
# Interview Feedback — [Candidate] — [Role]

**Interviewer:** [Name]
**Date:** [YYYY-MM-DD]
**Interview Type:** [Phone Screen / Technical / System Design / Behavioral]

---

## Evaluation Dimensions

### Technical Competency (IF APPLICABLE)
**Score:** [1–5]
**Evidence:** [Specific examples from interview]
**Notes:** [Strengths, gaps, red flags]

### Leadership & Ownership
**Score:** [1–5]
**Evidence:** [Story they told; how they framed accountability]
**Notes:** [Shown initiative? Owned outcomes?]

### Collaboration & Communication
**Score:** [1–5]
**Evidence:** [How they listened, asked questions, explained thinking]
**Notes:** [Clear communicator? Collaborative?]

### Learning Agility
**Score:** [1–5]
**Evidence:** [How they discussed growth, feedback, failures]
**Notes:** [Growth mindset? Receptive to feedback?]

---

## Overall Assessment

**Hire / No Hire / Maybe (discuss with team)**

**One-sentence summary:** [What stands out?]

**Concerns (if any):** [Gaps, risks, questions for next interviewer]

**Recommendation for next round:** [If advancing, what should next interviewer probe?]

---
```

---

## Final Hiring Decision Framework

### Calibration Meeting (after all interviews)

Interviewing team meets to align on candidate. Use this framework:

**Each interviewer scores:** 1–5 on each dimension (or Hire/No Hire)

**Aggregate:** Average score across interviewers

**Threshold:**
- **3.5+:** Strong hire candidate; move to offer
- **3.0–3.5:** Good candidate; discuss trade-offs
- **2.5–3.0:** Borderline; need more info or next-round interview
- **<2.5:** Pass; not right fit

**Override clause:** Any strong "No Hire" from manager should result in pass (not hire).

### Offer Decision

Once Hire threshold met:
1. Check internal compression (compensation-analyzer skill)
2. Reference check (if applicable)
3. Background check (if applicable)
4. Offer creation (compensation-analyzer skill)
5. Offer presentation and close

---

## Red Flags During Interviews

Stop interview early and escalate if you observe:

- **Discriminatory language:** Comments about age, race, gender, national origin, disability, etc. → Escalate to legal/HR immediately.
- **Dishonesty:** Resume claims that don't match; gaps in story → Document and discuss with hiring manager.
- **Hostility or unprofessionalism:** Aggressive, dismissive, rude behavior → Document; likely No Hire.
- **Inability to handle feedback:** Gets defensive when asked probing questions → Note; may struggle with feedback culture.

---
