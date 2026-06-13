---
name: interview-prep
description: Generates interview guide, scoring rubric, behavioral questions, and red-flag signals for a candidate. Prepares hiring manager for structured conversation. Returns rubric and question bank ready for use in 48h.
allowed-tools: Read, WebSearch
effort: medium
---

# Interview Prep

## When to activate

48 hours before a scheduled interview. Candidate has passed screening and been approved for interview. You have access to their resume, screening summary, and the role description.

## When NOT to use

Not for rejected candidates. Not for internal transfers (use engagement-pulse). Not without a complete candidate profile and role description. Not for unstructured "coffee chat" screening (use candidate-screener instead).

## Interview Structure

A structured interview is 50 minutes: 5 min opening, 10 min background, 15 min behavioral, 10 min role-specific, 5 min culture fit, 5 min candidate questions.

### 1. Opening (5 min)

**What to say:**
"Hi [Name], thanks for making time. Today we'll spend about 50 minutes together. I'll start with a quick overview of the role and our team, then we'll walk through your background, talk about some specific situations you've handled, and I'll give you time to ask questions. Sound good?"

**Your job:** Set tone (collaborative, not adversarial), explain the process, get their buy-in.

### 2. Background (10 min)

**Key questions:**
1. "Walk me through your resume. I'm curious about your progression from [Role A] to [Role B]—what was that transition like?"
2. "At [Company], what were you responsible for? How big was your impact?" (Listen for ownership vs. task completion)
3. "Why are you interested in this role at [Our Company]?"

**What you're listening for:**
- Clear narrative (not fragmented)
- Ownership of outcomes (not blame of others)
- Reasons for moves (growth, lateral, retreat?)
- Alignment with this role/company

**Red flags:**
- Gaps in employment (>3 months unexplained)
- Job-hopping (<1 year tenure pattern)
- Vague answers ("I did stuff...")
- Blames previous managers/companies

### 3. Behavioral (15 min)

Use STAR format: Situation, Task, Action, Result. Ask 2–3 questions, let them talk. Take notes on their decision-making.

**Sample questions (pick 2–3 relevant to role):**

**For Engineering/IC roles:**
- "Tell me about a time you had to refactor code or redesign a system. What was the problem, and how did you decide the approach?"
- "Describe a situation where you disagreed with your manager's technical direction. How did you handle it?"

**For People/Leadership roles:**
- "Tell me about a time you had to deliver difficult feedback to someone. How did you approach it?"
- "Describe a situation where you had to make a decision with incomplete information. What did you do?"

**For Cross-functional roles:**
- "Tell me about a time you had to convince another team to adopt your idea. How did you do it?"
- "Describe a situation where something you owned shipped late or failed. What did you learn?"

**What you're listening for:**
- Clear problem definition (not rushing to solutions)
- Multiple options considered (not binary thinking)
- Learning orientation (what would they do differently?)
- Team collaboration (we vs. I language)
- Accountability (not blame externalization)

**Red flags:**
- All stories are about their success (no vulnerability)
- Blames others for failures
- Vague resolution (talks about problem, not result)
- Defensive when you ask clarifying questions

### 4. Role-Specific (10 min)

Create a mini work sample or scenario relevant to the role. Keep it real, solvable in <10 min.

**Examples:**

**For Engineering:**
"Imagine you're on our backend team. A customer reports that a critical API endpoint is timing out. It's affecting 5% of requests. Walk me through how you'd debug this."

**For Product:**
"We've noticed churn is up 10% this quarter. How would you approach understanding why?"

**For Design:**
"Here's a screenshot of our current dashboard. If you had 4 weeks to improve user engagement, what's the first thing you'd focus on and why?"

**What you're listening for:**
- Structured thinking (not random ideas)
- Asking clarifying questions (not assuming)
- Trade-off awareness (time/scope/quality balance)
- Data mindset (metrics, not gut feel)

### 5. Culture Fit (5 min)

Ask 1–2 questions. Keep it open-ended.

**Sample questions:**
- "What does success look like to you in a role?"
- "Describe your ideal working environment. What brings out your best?"
- "What matters most to you in a company culture?"

**What you're listening for:**
- Alignment with company values (autonomy, transparency, learning, collaboration)
- Self-awareness (knowing what they need to thrive)
- Flexibility (not rigid requirements)

**Red flags:**
- "I need stability" (if fast-paced startup)
- "Flat hierarchy" requirement (if you have clear hierarchy)
- Unwillingness to learn new tech/approach
- Unrealistic expectations (e.g., "No meetings ever")

### 6. Candidate Questions (5 min)

**Let them ask.** Good candidates will ask about:
- Team structure / reporting line
- Roadmap / priorities
- Technical stack / infrastructure
- Growth / learning opportunities
- Work-life balance / flexibility

**Red flag if they ask:**
- Nothing (suggests lack of real interest)
- Only about compensation (too early in process)
- Only about perks (signals misaligned priorities)

## Scoring Rubric

After the interview, score the candidate 0–5 on each dimension.

| Dimension | 5 | 4 | 3 | 2 | 1 | 0 |
|---|---|---|---|---|---|---|
| **Skills** | All 5+ core skills demonstrated; ready for day 1 | 4 core skills; minor gap | 3 core skills; gaps trainable in 3mo | 2 core skills; significant gaps | 1 core skill; major gaps | No core skills |
| **Communication** | Crystal clear; structured thinking; articulate | Generally clear; occasional rambling | Somewhat unclear; needs follow-up | Vague; hard to follow | Very unclear; confusing | Incoherent |
| **Problem-Solving** | Considers multiple options; trade-offs clear | Good problem definition; some options | Basic approach; limited options | Surface-level thinking | No problem-solving | Flawed reasoning |
| **Culture Fit** | Strong alignment with 4+ values | Alignment with 3 values | Alignment with 2 values | Slight misalignment | Misalignment on core value | Complete misalignment |
| **Leadership Potential** | Clear next-level ready; could expand scope | Could grow into broader responsibility | Content in current level; solid IC | Growth unclear | Limited potential | Not leadership material |

**Overall Interview Score:** Sum of (Skills + Communication + Problem-Solving + Culture Fit + Leadership) / 25 * 100 = percentage.

- **90–100:** Strong hire. Move to offer stage.
- **75–89:** Good hire. Discuss with hiring manager; may have minor gaps.
- **60–74:** Possible hire. Have hiring manager conduct second round or get another opinion.
- **<60:** Do not advance. Provide feedback to candidate.

## Red-Flag Signals to Surface

If you notice any of these during interview, flag immediately to hiring manager:

- **Unexplained employment gaps:** "What happened here?"
- **Frequent job-hopping:** Is this a pattern? Probing needed.
- **Vague storytelling:** Avoidance behavior? Embellishment risk?
- **Overqualified indicators:** Will they leave in 6 months?
- **Compensation misalignment:** "I need $200k minimum." (Your band: $140–160k)
- **Red-flag questions:** "How often will I be on camera?" (role requires video calls)
- **Values misalignment:** They value stability; you value shipping fast / risk-taking.
- **Technical debt language:** If engineering role: "I only write perfect code" (suggests rigidity).

## Output Format

Return interview guide in this format:

```
## Interview Guide: [Candidate Name] for [Role]

**Date:** [Interview date]
**Interviewer:** [Your name]
**Duration:** 50 minutes
**Format:** Phone / Video / In-person

---

### Pre-Interview Prep
- [ ] Review candidate's resume and screening summary
- [ ] Review CLAUDE.md for role-specific values and must-haves
- [ ] Prepare 2–3 behavioral questions specific to role
- [ ] Prepare role-specific mini work sample
- [ ] Quiet space, no interruptions scheduled

---

### Opening (5 min)
[Script provided above]

---

### Background (10 min)

**Questions:**
1. [Background question 1]
2. [Background question 2]
3. [Background question 3]

---

### Behavioral (15 min)

**Questions (pick 2–3):**
1. [Question 1] — What to listen for: [skill], [decision-making]
2. [Question 2] — What to listen for: [ownership], [learning]

---

### Role-Specific (10 min)

**Scenario:** [Mini work sample, 5–10 min]
[Describe scenario clearly]

---

### Culture Fit (5 min)

**Questions:**
1. [Culture question 1]

---

### Candidate Questions (5 min)

Let them ask. Note what they ask—it signals priorities.

---

### Scoring Rubric

[Scoring table with dimensions and point ranges]

### Post-Interview Actions
- [ ] Complete scoring rubric within 2h
- [ ] Surface any red flags to hiring manager
- [ ] If score >75, discuss next steps (offer, second round)
- [ ] If score 60–74, get another interviewer opinion
- [ ] If score <60, draft rejection feedback
```

## Example Interview Guide

```
## Interview Guide: Sarah Chen for Senior Backend Engineer

**Date:** June 15, 2026 @ 2pm PT
**Interviewer:** Alex (Engineering Manager)
**Duration:** 50 minutes
**Format:** Video

---

### Pre-Interview Prep
- [ ] Review Sarah's resume (4 years Senior Engineer at Stripe)
- [ ] Review CLAUDE.md: Role requires Python, async architecture, mentorship capability
- [ ] Prepare behavioral questions on: (1) Technical disagreement, (2) System failure + learning
- [ ] Prepare work sample: "API timeout debugging scenario"

---

### Opening (5 min)

Hi Sarah, thanks for making time today. We'll spend about 50 minutes together. I'll give you a quick overview of our backend team and this role, then we'll walk through your background, talk about some specific technical and leadership situations, and I'll save time for your questions. Sound good?

---

### Background (10 min)

1. "Walk me through your time at Stripe. What were your main areas of ownership, and how did you see your impact grow from Year 1 to Year 4?"
2. "I see you moved from Platform Engineer to Senior Engineer — what was that transition like?"
3. "What's drawing you to [Company] specifically?"

**Listen for:** Clear ownership narrative, growth mindset, specific impact metrics, alignment with company.

---

### Behavioral (15 min)

**Question 1 (Technical disagreement):**
"Tell me about a time you disagreed with a tech decision your team was making. Maybe you thought you should use async/await and they wanted synchronous. How did you handle it?"

*Listen for:* Problem-solving, not stubborn pushing. Did they present data? Escalate appropriately? Respect others' viewpoints?

**Question 2 (System failure):**
"Describe a time when you shipped code that caused an outage or major issue. Walk me through what happened and what you learned."

*Listen for:* Accountability (not blaming others). What systems/practices did they implement to prevent it next time? Growth mindset.

---

### Role-Specific (10 min)

**Scenario (5 min):**
"You're on our backend team. A customer reports our primary API endpoint is timing out—it's affecting 5% of requests globally. Walk me through how you'd approach debugging this. What tools would you use? What metrics would you check first?"

*Listen for:* Structured thinking (logs → metrics → hypothesis → test). Do they ask clarifying questions? Understand the trade-off between speed and accuracy in debugging?

---

### Culture Fit (5 min)

"What does an ideal working environment look like for you? When have you done your best work?"

*Listen for:* Alignment with high-agency, shipping-fast culture. Flexibility on process. Willingness to learn.

---

### Candidate Questions (5 min)

Let them ask. Note what signals: Are they asking about team? Roadmap? Growth? Or only compensation?

---

### Scoring Rubric

| Category | Sarah's Score | Evidence |
|---|---|---|
| Skills | 5/5 | 6 years async/Python; clearly demonstrated at Stripe |
| Communication | 4/5 | Clear, structured answers; one moment of rambling re: architecture |
| Problem-Solving | 5/5 | Systematic debugging approach; considers multiple hypotheses |
| Culture Fit | 4/5 | Aligns with shipping fast; slightly risk-averse on experiments |
| Leadership Potential | 5/5 | Mentored 2 junior engineers; seeking IC4 → Manager growth |

**Total Score:** (5 + 4 + 5 + 4 + 5) / 25 * 100 = **92%**

**Recommendation:** Strong hire. Move to offer stage. No red flags.

---

### Post-Interview Actions
- [ ] Email hiring manager within 2h: "Sarah is strong. 92%. Ready to discuss offer strategy."
- [ ] If offer approved, proceed to /offer-architect
```

---
