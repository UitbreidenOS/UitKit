---
name: candidate-screener
description: Rapidly screens candidates against role fit, red flags, and must-have criteria. Returns screening-{role}-{date}.md with candidate rankings and interview recommendations.
allowed-tools: Read, Write, WebSearch
effort: low
---

## When to activate

Post-application screening. Quickly identify qualified candidates, surface concerns, and flag no-gos before phone screen scheduling.

## When NOT to use

Not for deep reference checks — that happens post-offer. Not for skill verification — that's the interview panel's role. Not as sole criterion for hiring decisions; this is rapid qualification only.

## Candidate Screening Checklist

Execute in order:

1. **Establish role context** — Must-haves (5–7), nice-to-haves, title precedent, seniority level
2. **Define red flags** — Gaps, misalignments, or concerning signals that warrant deeper investigation
3. **Screen resume** — Parse work history, company/team scope, roles, and timeline
4. **Check against must-haves** — For each candidate, mark present/absent/partial
5. **Assess resume quality** — Grammar, clarity, format signal preparation level (minor signal)
6. **Flag red flags** — Multiple short stints, significant gaps, title inflation, unclear scope
7. **Check cover letter** — If submitted: Does it signal genuine interest and understanding of role?
8. **LinkedIn validation** — Cross-check resume claims; look for gaps or inconsistencies
9. **Rank candidates** — Green (strong), Yellow (investigate further), Red (pass)

## Must-Have Definition

From job description, extract 5–7 must-haves:

**Example: Staff Backend Engineer**
1. 5+ years building distributed systems (Python, Go, Java, Rust)
2. Experience with database optimization (PostgreSQL, DynamoDB, or equivalent)
3. Message queue expertise (RabbitMQ, Kafka, SQS)
4. Track record owning system reliability; experience defining SLOs
5. Mentoring experience or demonstrated leadership

When screening:
- [ ] Present (candidate clearly has it)
- [ ] Partial (related experience; good transfer skills)
- [ ] Absent (no evidence; will require ramp)

---

## Resume Red Flags

### Timeline & Gaps

| Signal | Severity | What To Check | Action |
|--------|----------|---|---|
| 3+ jobs in 5 years | Yellow | Avg tenure <2 years. Ask about growth/context. May indicate flight risk if pattern. | Phone screen question: "Walk us through your moves — what drew you to each?" |
| 1+ year gap | Yellow | Medical, sabbatical, family care, burnout, layoff. | Ask directly in phone screen: "Tell us about the [gap]." |
| Very short tenure (<6 months) | Yellow–Red | Left quickly. Possible: bad cultural fit, role mismatch, or external factor. | Ask: "Why did you leave after 6 months?" Red if evasive. |
| Consistent 2–3 year tenure | Green | Shows stability + room for growth. Good pattern. | No action needed. |

### Title & Scope Mismatch

| Signal | Check | Action |
|--------|-------|--------|
| Job title inflation ("VP of Something" at 5-person startup) | Company size + role scope | Clarify actual scope in phone screen. Not disqualifying. |
| Scope unclear ("Responsible for XYZ") with no metrics | Ask for context | Phone screen: "Walk us through how you measured impact in that role?" |
| No management experience listed, but applying for manager role | Check for technical lead / mentoring | If absent, may be premature for manager hire (consider IC track or manager coaching). |

### Experience Relevance

| Signal | Check | Action |
|--------|-------|--------|
| 10 years experience but industry unrelated (e.g., marketing to engineering) | Transfer skills | Evaluate transfer skills. May require longer ramp. Consider as Yellow. |
| Candidate claims expertise in 15+ technologies on 1-page resume | Depth vs. breadth | Usually indicates shallow knowledge. Phone screen deep dives on 2–3 core skills. |
| No recent projects/technical work (all management) | If IC role sought | Assess if candidate has hands-on chops or has drifted into pure management. |

### Cover Letter (if submitted)

| Signal | Green | Red |
|--------|-------|-----|
| References specific team/product insight | "I've used [your product] and loved [specific feature]" | Generic: "I'm excited to join a tech company" |
| Shows understanding of role | "You're scaling recommendation systems — my work at [X] on real-time ranking aligns" | No reference to actual role or company |
| Personalized | Uses hiring manager name; researched company | "To the hiring team..." |
| Grammar/clarity | Well-written, clear | Multiple typos, unclear intent |

---

## Screening Grid Template

```markdown
# Candidate Screening — [Role] [Date]

**Role:** [Title, Level]
**Posting date:** [Date]
**Applications reviewed:** [N]

---

## Must-Have Checklist

| Must-Have | Definition | Green | Yellow | Red |
|-----------|---|---|---|---|
| 5+ years distributed systems | Python, Go, Java, Rust | Clear evidence in job descriptions | Adjacent (3 years, strong foundation) | Missing or very junior (<2 years) |
| Database optimization | PostgreSQL, DynamoDB, query tuning | Explicit experience listed | Related (some DB work, not optimization-focused) | No mention |
| Async/concurrency patterns | Message queues, RabbitMQ, Kafka, async/await | Multiple projects using | One mention or strong transfer | Absent |
| Reliability ownership | SLO definition, on-call, incident response | Led reliability initiatives | Participated in on-call rotation | No mention |
| Mentoring | Explicit mentoring or lead IC role | Mentored 2+ juniors, led design reviews | Technical lead or senior IC title | None |

---

## Candidates

### [Candidate 1] — STRONG (Green)

**Resume summary:**
- Staff Engineer at [Company], 6 years; led platform scaling project; 3 direct reports
- Previous: Senior Engineer at [Company], 4 years; built recommendation engine using Kafka, PostgreSQL
- Education: BS Computer Science, [University]

**Must-haves assessment:**
- 5+ distributed systems: ✓ (6 years at platform-heavy company, led scaling)
- Database optimization: ✓ (Built rec engine, explicit PostgreSQL optimization mentioned)
- Async patterns: ✓ (Kafka expertise in previous role)
- Reliability ownership: ✓ (On-call, defined SLOs for recommendation service)
- Mentoring: ✓ (3 direct reports as Staff Engineer)

**Red flags:** None noted.

**Cover letter:** Strong — references our product, specific feature, scaling challenge alignment.

**LinkedIn:** Matches resume; good engagement profile; published 2 technical blog posts on distributed systems.

**Recommendation:** PHONE SCREEN. Very strong candidate. Priority for scheduling.

---

### [Candidate 2] — INVESTIGATE (Yellow)

**Resume summary:**
- Senior Engineer at [Company], 2.5 years; worked on payment systems, Java backend
- Previous: Engineer at [Company], 2 years; full-stack (Node.js + React)
- Senior Engineer at [Company], 1.5 years; backend systems (Python)
- [1-year gap, 2022–2023]
- Education: Bootcamp graduate, 2019

**Must-haves assessment:**
- 5+ distributed systems: Partial (5 years total, but varied stack; not clear on scale)
- Database optimization: Partial (payment systems likely DB-heavy; no explicit mention)
- Async patterns: Partial (Java backend suggests some async; not explicit)
- Reliability ownership: Unclear (payment systems require it; not mentioned)
- Mentoring: None noted

**Red flags:**
- Multiple short tenures (2.5, 2, 1.5 years); pattern of ~2-year stays
- 1-year gap unexplained
- Bootcamp background (not a blocker; check coding fundamentals)
- No explicit async/message queue experience

**Cover letter:** None submitted.

**LinkedIn:** Matches resume; no technical writing or open-source contributions visible.

**Recommendation:** PHONE SCREEN, BUT WITH CAUTION. Ask about:
1. Why the pattern of 2-year tenures?
2. The 1-year gap?
3. Deep dive on database work at payments company
4. Async/concurrency experience (Java, Python)
5. On-call/reliability experience

Probe retention risk; assess fit for messaging-heavy architecture. Consider coding screen focused on async patterns.

---

### [Candidate 3] — PASS (Red)

**Resume summary:**
- Senior Engineer at [Company] (10 years); title VP of Engineering (role scope unclear)
- Previous: Staff Engineer at [Company], 5 years
- No other roles listed
- Education: BS, [University], 1999

**Must-haves assessment:**
- 5+ distributed systems: Unclear (10-year tenure but no project detail)
- Database: Not mentioned
- Async: Not mentioned
- Reliability: Not mentioned
- Mentoring: Implied (VP of Engineering) but no direct IC mentoring shown

**Red flags:**
- VP title after 10 years at one company; scope/team size unclear
- Very limited detail on technical contributions; reads as "moved into management then stayed"
- No evidence of hands-on IC work in past 5+ years
- Cover letter submitted but generic; no reference to specific role or product

**Additional concern:** Candidate may have drifted out of hands-on technical work. IC role requires current technical chops.

**Recommendation:** PASS. Not right fit for IC role. If manager role opens, revisit; may need technical refresh for IC return.

---

## Summary Stats

| Category | Count |
|----------|-------|
| **Green (phone screen)** | 3 |
| **Yellow (phone screen + probe)** | 5 |
| **Red (pass)** | 2 |

**Next action:** Schedule phone screens for 3 Green + 5 Yellow candidates (8 total). Aim for 3–4 interviews over next 2 weeks.

---


```

---

## Phone Screen Question Prompts

Once you've identified Green/Yellow candidates, use these prompts in phone screening:

### Timeline & Trajectory
- "Walk us through your moves over the past 5 years. What drew you to each role?"
- "How have your responsibilities grown? What's the biggest system you've owned?"

### Technical Depth
- "Tell us about the most complex distributed system you've built. What made it hard?"
- "Describe how you approach database optimization. Walk us through an example."

### Reliability & On-Call
- "What's your on-call experience? What incident sticks with you most?"
- "How do you think about defining SLOs for a service?"

### Scope & Leadership
- "Have you mentored or led engineers? Tell us about that."
- "Describe a technical decision you made that affected your team."

### Motivation
- "Why are you interested in this role? What's missing from your current situation?"
- "What matters most to you in your next role?"

---

## Bad Hires: Patterns to Catch Early

Candidates who seem good on paper but often underperform:
1. **All experience at 1 company:** May lack exposure to different approaches; may struggle with change.
2. **No failure or challenge mentioned:** Everyone has hard projects. Vague answers can indicate lack of depth or reflection.
3. **Overly focused on money/compensation:** Risk of leaving when competitor offers 10% more.
4. **Blame culture for departures:** "Company culture was bad," "managers were incompetent." May not own their growth.
5. **Rapid escalation without depth:** "Promoted to manager after 3 years." Assess if earned or just timeline.

---
