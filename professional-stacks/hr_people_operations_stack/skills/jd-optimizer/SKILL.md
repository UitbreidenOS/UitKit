---
name: jd-optimizer
description: Writes and optimizes job descriptions for clarity, keyword optimization, candidate filtering, and bias reduction. Outputs jd-{role}-{date}.md with compliance audit.
allowed-tools: Read, Write, WebSearch
effort: low
---

## When to activate

Before publishing any job posting. Takes existing JD (or starts from scratch) and optimizes for clarity, searchability, candidate qualification, and legal compliance.

## When NOT to use

Not for compensation benchmarking — use compensation-analyzer. Not for hiring process design — use interview-architect. Not for sourcing strategy; this focuses on job description clarity and filtering.

## JD Optimization Checklist

Execute in order:

1. **Establish role context** — Title, level, team, reporting line, location, remote/hybrid status, salary range (if public)
2. **Define "must-haves"** — Essential skills/experience for day-1 productivity (usually 5–7 items); separate from "nice-to-haves"
3. **Eliminate bias language** — Scan for age-coded words (digital native, energetic, rockstar), gender-coded language (aggressive, collaborative), and ableist language
4. **Write clear responsibilities** — Lead with measurable outcomes; use active verbs; avoid jargon
5. **Rewrite requirements** — Convert "X years of experience" to competency-based language where possible
6. **Add EEO statement** — Include standard EEO disclaimer and accommodation language
7. **Optimize for keywords** — Embed job board keywords (Python, Kubernetes, etc.) naturally for search visibility
8. **Add culture/values** — 2–3 sentences on team mission and company values (without clichés)
9. **Include logistics** — Application link, hiring process timeline, interview format (async, in-person, Zoom), expected response time
10. **Compliance audit** — Check for language that might discourage protected classes

## Responsibility Writing Framework

**Formula:** Action verb + Context + Measurable outcome

**Weak:** "Responsible for implementing cloud infrastructure"
**Strong:** "Design and deploy cloud infrastructure serving 50+ internal teams; reduce deployment time from 2h to <15m; maintain >99.9% uptime"

**Weak:** "Collaborate with design team"
**Strong:** "Partner with product designers to validate feature requirements; conduct usability testing on 3 major releases; collect user feedback to inform roadmap prioritization"

## Must-Have vs. Nice-to-Have Framework

**Must-haves (day-1 productivity):**
- Usually 5–7 core competencies
- Reflect what a mid-level performer needs to add value in first 90 days
- Example: "3+ years Python; async/await patterns; RESTful API design"

**Nice-to-haves (accelerators):**
- Past 90 days but valuable long-term
- Example: "FastAPI framework; GraphQL; AWS Lambda experience"

**Don't-overstate:** If you list 12 must-haves, you'll filter out 95% of qualified candidates.

## Bias Reduction Checklist

| Red Flag Language | Reason | Replacement |
|---|---|---|
| "Digital native," "tech-savvy," "native English speaker" | Age-coded or national-origin bias | "Proficient in [specific tool/language]" |
| "Aggressive," "go-getter," "rockstar," "ninja" | Gender-coded or ableist | "High-agency problem solver," "Self-directed," "Ownership mindset" |
| "Young, energetic, fun team culture" | Age-coded | "Collaborative team," "Fast-paced environment" |
| "Speak our language," "culture fit" | Homogeneity bias | "Shares our values of [specific principle]" |
| "Right-hand person to CEO" | Can discourage underrepresented groups from applying | "Lead cross-functional initiatives," "VP-level partnership" |
| "Willing to wear many hats" | Vague; may screen out disabled candidates | Specify actual roles/responsibilities |
| "Fluent in [language]" (unless required) | National-origin bias | "Proficiency in [language] helpful" or omit |

---

## JD Output Template

```markdown
# Job Description: [Role Title]

**Department:** [Team]
**Level:** [IC1, IC2, IC3, Manager, Director, etc.]
**Reporting to:** [Manager title]
**Location:** [City, State / Remote]
**Salary Range:** [If public; e.g., $140K–$180K + equity]
**Date Created:** [YYYY-MM-DD]

---

## About [Company Name]

[2–3 sentences: what company does, market position, growth stage. No clichés about "transforming industries" or "changing the world." Focus on business outcome.]

---

## About This Role

[2–3 sentences: what this person will do, who they'll work with, business impact. Answer: "Why does this role exist?"]

**Example:** "As a Staff Engineer on the Platform team, you'll architect the next generation of our data pipeline serving 100+ internal teams. You'll lead design reviews, mentor junior engineers, and own reliability SLOs for systems processing 10B+ events/day."

---

## Responsibilities

- [Action verb + context + measurable outcome]
- [Action verb + context + measurable outcome]
- [Action verb + context + measurable outcome]
- [Action verb + context + measurable outcome]
- [Action verb + context + measurable outcome]

**Example:**
- Design and implement microservices handling 50K+ requests/sec; achieve <100ms p99 latency and 99.95% uptime
- Lead architectural review process for Platform team; mentor 3 junior engineers on system design patterns
- Reduce database query time by 40% through indexing and query optimization; document performance improvements
- Participate in on-call rotation (1 week per 6 weeks); respond to production incidents within SLA
- Contribute to hiring and interviewing for Platform team (1–2 candidates per quarter)

---

## Must-Have Qualifications

- [Core skill/experience]
- [Core skill/experience]
- [Core skill/experience]
- [Core skill/experience]
- [Core skill/experience]

**Example:**
- 5+ years building production distributed systems (Java, Go, Python, or Rust)
- Deep experience with databases (PostgreSQL, DynamoDB, or equivalent); query optimization expertise
- Proficiency in async/concurrency patterns; experience with message queues (RabbitMQ, Kafka, SQS)
- Track record owning system reliability; experience defining and monitoring SLOs
- Strong communication skills; comfortable mentoring and presenting technical proposals

---

## Nice-to-Have Qualifications

- Experience with Kubernetes or container orchestration
- Familiarity with observability tools (DataDog, Prometheus, ELK stack)
- Background in financial systems, high-frequency trading, or payment processing
- Open-source contributions to systems tools

---

## What We Offer

- Competitive salary: $[X]–$[Y] based on experience
- Equity: [X shares] under [4-year vesting, 1-year cliff]
- Health benefits: Medical, dental, vision (100% employee, 80% dependent premium coverage)
- 401(k): 3% company match
- Flexible PTO: Unlimited vacation + 10 paid company holidays
- Professional development: $2K/year learning budget; conference attendance encouraged
- Remote flexibility: [Remote-first / Hybrid / 3 days in office, etc.]

---

## Hiring Process

1. **Application review:** We review applications on a rolling basis and respond within 5 business days
2. **Phone screen (30 min):** Conversation with recruiter on background and role fit
3. **Technical screen (90 min):** Interview with engineer on technical problem-solving
4. **System design (120 min):** Interview with 2 engineers on architectural thinking
5. **Behavioral (60 min):** Interview with manager on collaboration and leadership
6. **Offer:** We aim to make a decision within 1 week of final interview

**Timeline:** 4–6 weeks from application to offer (if progress well).

---

## Equal Opportunity Statement

[Company Name] is an equal opportunity employer. We do not discriminate based on race, color, national origin, religion, sex, gender identity, sexual orientation, disability, age, marital status, veteran status, or any other characteristic protected by law. We welcome applications from people of all backgrounds and encourage candidates from underrepresented groups in technology to apply.

**Accommodations:** If you require accommodations during the application or interview process, please let us know and we'll do our best to support you.

---

## How to Apply

[Application link or email address]

Questions? Contact [recruiter email or HR contact]

---


```

---

## Compliance Audit Checklist

Before publishing, verify:

- [ ] No age-coded language (digital native, energetic, young team)
- [ ] No gender-coded language (aggressive, nurturing, communicative stereotypes)
- [ ] No national-origin bias (native English speaker, culture fit)
- [ ] EEO statement included and accurate
- [ ] Accommodation language present
- [ ] Salary range included (if company policy / legal requirement in your state)
- [ ] No requirement for specific college (unless truly essential)
- [ ] No requirement for specific years of experience (unless really justified; consider competency instead)
- [ ] Remote/location flexibility clarified

---

## Examples

### Good JD: Staff Backend Engineer

**Responsibilities:**
- Design and scale backend systems handling 50K+ requests/sec; achieve <100ms latency and 99.95% uptime
- Lead quarterly architecture review process; mentor 3 junior engineers on system design
- Reduce deployment time from 45min to <10min through infrastructure improvements; document lessons learned
- Participate in on-call rotation (1 week per 6 weeks); respond to production incidents within 15-min SLA

**Must-haves:**
- 5+ years building distributed systems in Java, Go, Python, or Rust
- Strong database optimization skills (PostgreSQL, DynamoDB, or equivalent)
- Experience with async/concurrency patterns and message queues (RabbitMQ, Kafka)

---

### Weak JD: "Backend Engineer"

**Responsibilities:**
- Build backend services
- Work with the team on infrastructure
- Write good code
- Be a team player

**Must-haves:**
- 10 years software engineering
- "Rockstar" mindset
- Love startup culture
- Native English speaker

*(Too vague, age-coded, biased, and unrealistic expectations.)*

---
