---
name: engagement-pulse
description: Summarizes employee engagement signals quarterly — feedback survey scores, retention risk flags, promotion readiness, flight risk. Returns engagement scorecard and recommendations for manager follow-up.
allowed-tools: Read
effort: low
---

# Engagement Pulse

## When to activate

Quarterly engagement review (e.g., end of Q1, Q2, Q3, Q4). You have access to employee feedback survey responses, 1:1 notes from manager, performance reviews, tenure data, and compensation history.

## When NOT to use

Not for performance reviews (separate process). Not for compensation discussions (use offer-negotiator + offer-architect framework). Not for onboarding pulse (use onboarding-workflow for first-month check-ins). Not for offboarding (use off-boarder).

## Engagement Dimensions

Score each employee on dimensions below. Each is 0–10. Total engagement score is average across all dimensions. Surface any dimension <6 as a risk flag.

### 1. Role Satisfaction (0–10)

**10:** "Loves the role, clear impact, growth opportunities, wants to stay."
**7–9:** "Happy with role, engaged, minor frustrations but manageable."
**5–6:** "OK with role, but some misalignment or stagnation concerns."
**3–4:** "Dissatisfied; role doesn't match interests or skills."
**0–2:** "Very unhappy; likely to leave soon."

**Signals to check:**
- Manager notes: "Employee says they're excited" (high) vs. "Quiet, not speaking up" (low)
- Feedback survey: Positive language about role fit and learning
- Performance: Engaged work, takes initiative (high) vs. bare minimum effort (low)
- Questions in 1:1s: Asking about growth and projects (high) vs. complaining about hours (low)

### 2. Manager Relationship (0–10)

**10:** "Excellent relationship, trusts manager, regular feedback, feels heard."
**7–9:** "Good relationship, generally aligned, occasional friction."
**5–6:** "Neutral; basic check-ins but limited connection."
**3–4:** "Strained; employee doesn't trust manager or feel supported."
**0–2:** "Broken; relationship is blocker to engagement."

**Signals to check:**
- Manager notes: Positive 1:1s, employee asking for feedback (high) vs. defensive or silent (low)
- Feedback survey: "Manager listens" / "Manager cares about my growth" (high) vs. complaints about feedback (low)
- Tenure: How long since employee joined? Is manager new? (Can affect score)

### 3. Team Belonging (0–10)

**10:** "Close relationships with teammates, included in social/technical decisions, feels part of the group."
**7–9:** "Comfortable with team, collaborates well, some distance from inner circle."
**5–6:** "Professional relationships, but doesn't feel strongly connected."
**3–4:** "Isolated; doesn't feel like part of the team."
**0–2:** "Strongly isolated; social issues or language barrier."

**Signals to check:**
- Manager notes: "Gets invited to team events" (high) vs. "Sits alone" (low)
- Feedback survey: "Team is collaborative" / "I feel included" (high) vs. isolation comments (low)
- Project work: Paired with teammates, cross-team collaboration (high) vs. siloed (low)

### 4. Career Growth Clarity (0–10)

**10:** "Clear growth path, employee knows next step, getting development."
**7–9:** "Generally clear career direction, minor uncertainty."
**5–6:** "Some clarity, but employee unsure of progression or timeline."
**3–4:** "Unclear; employee doesn't know how to grow here."
**0–2:** "No growth seen; employee feels stuck."

**Signals to check:**
- Manager notes: Discusses promotion/growth plans (high) vs. no growth conversations (low)
- Feedback survey: "I see a future here" (high) vs. "No room for growth" (low)
- Promotion history: When was their last promotion/level-up? (>2 years with no growth = risk)
- Tenure: Longer tenure without growth trajectory = higher risk

### 5. Compensation Satisfaction (0–10)

**10:** "Feels fairly paid relative to market and peers, no complaints."
**7–9:** "Generally satisfied, minor questions."
**5–6:** "Some concern; not sure if fair."
**3–4:** "Dissatisfied; feels underpaid relative to market."
**0–2:** "Very unhappy about comp; likely to job-hunt."

**Signals to check:**
- Manager notes: "Never mentions compensation" (good sign) vs. complaints about salary (red flag)
- Feedback survey: "Fair compensation" or "Competitive comp" (high) vs. complaints (low)
- External data: Compare to Levels.fyi, Blind, PayScale for role/level (is employee in band?)
- Tenure + no raise: If >2 years and no raise, score lower (inflation erodes value)

### 6. Work-Life Balance (0–10)

**10:** "Healthy hours, rarely overworking, takes PTO, sustainable pace."
**7–9:** "Generally balanced, occasional crunch."
**5–6:** "Some concern; working extra hours but manageable."
**3–4:** "Frequently overworking, burning out."
**0–2:** "Severe overwork; risk of burnout and departure."

**Signals to check:**
- Manager notes: "Takes PTO regularly" (high) vs. "Never takes time off" (low)
- Feedback survey: "Sustainable hours" (high) vs. "Too much work" (low)
- Availability: After-hours Slack activity, weekends, vacation interruption (high activity = risk)
- Project load: Is employee on 2+ projects simultaneously? (High load = risk)

## Retention Risk Score

Combine engagement dimensions to surface flight risk.

**Retention Risk Scoring:**
- **Low Risk (Green):** 5 of 6 dimensions 7+, average score >7. Likely to stay 1+ years.
- **Moderate Risk (Yellow):** 3–4 dimensions 7+, average score 6–7. May job-hunt if better opportunity.
- **High Risk (Red):** 2+ dimensions <5, average score <6. Likely to leave within 6 months.
- **Critical Risk (Red X):** Any dimension 0–2 + average <5. Likely to leave immediately.

## Promotion Readiness Assessment

For employees with >2 years tenure at current level, assess promotion readiness.

**High Readiness (Ready to Promote):**
- Consistently exceeds performance expectations
- Technical skill depth in role + learning new areas
- Leadership signals: mentors others, takes initiative, thinks strategically
- No major gaps (communication, collaboration, execution)
- Manager recommends promotion

**Medium Readiness (Developing, 6–12 months):**
- Meets expectations in current role; some exceeds
- Growth in specific area (depth or breadth)
- Developing leadership skills but not yet consistent
- One or two growth areas to address before promotion

**Low Readiness (Not Ready, >12 months or needs lateral move):**
- Meets or barely meets expectations in current role
- No clear growth trajectory; may need career reset
- Significant gaps in skills, communication, or judgment
- Consider lateral move to better fit role

## Output Format

Return engagement assessment in this format:

```
## Engagement Pulse: [Employee Name]

**Review Period:** Q[X] 2026  
**Role:** [Job Title]  
**Team:** [Team]  
**Tenure:** [X months / years]  
**Last Review:** [Date of last performance review]

---

### Engagement Scorecard

| Dimension | Score | Signal | Recommendation |
|---|---|---|---|
| Role Satisfaction | [0–10] | [Key quote/signal] | [Action if <7] |
| Manager Relationship | [0–10] | [Key quote/signal] | [Action if <7] |
| Team Belonging | [0–10] | [Key quote/signal] | [Action if <7] |
| Career Growth Clarity | [0–10] | [Key quote/signal] | [Action if <7] |
| Compensation Satisfaction | [0–10] | [Key quote/signal] | [Action if <7] |
| Work-Life Balance | [0–10] | [Key quote/signal] | [Action if <7] |

**Overall Engagement Score:** [Average, 0–10]  
**Retention Risk:** [LOW / MODERATE / HIGH / CRITICAL]

---

### Insights & Flags

[1–3 key insights from engagement data. Flag any risks.]

### Promotion Readiness (if applicable)

[Promotion readiness: READY / DEVELOPING / NOT READY]  
[Details: strengths, growth areas, timeline if applicable]

### Manager Conversation Agenda

- [ ] Acknowledge strengths: [Key strengths from scorecard]
- [ ] Discuss engagement signals: [Specific signals: career growth, comp, team fit]
- [ ] Growth plan: [If MODERATE/HIGH risk or promotion-ready]
- [ ] Next check-in: [Set date for follow-up]

### Next Steps
- [ ] Manager has 1:1 with employee
- [ ] Manager documents discussion + action items
- [ ] Schedule follow-up in [X months]
- [ ] If HIGH RISK, escalate to HR for retention plan
```

## Example Assessment

```
## Engagement Pulse: Jamie Chen

**Review Period:** Q2 2026  
**Role:** Backend Engineer (Level IC3)  
**Team:** Infrastructure  
**Tenure:** 2 years 3 months  
**Last Review:** January 2026 (performed well)

---

### Engagement Scorecard

| Dimension | Score | Signal | Recommendation |
|---|---|---|---|
| Role Satisfaction | 8/10 | "Loves working on infrastructure problems; proud of API redesign" | Continue investing in challenging projects |
| Manager Relationship | 7/10 | "Manager gives good feedback, but doesn't make time for growth planning" | Schedule monthly growth-focused 1:1s |
| Team Belonging | 8/10 | "Close with team; organized team lunch, included in key decisions" | Maintain strong team dynamics |
| Career Growth Clarity | 5/10 | "Unsure about path to IC4; no clear next step discussed" | Define IC4 growth plan + mentorship |
| Compensation Satisfaction | 6/10 | "Hasn't had raise in 2 years; concerned about market competitiveness" | Benchmark against Levels.fyi; consider adjustment |
| Work-Life Balance | 7/10 | "Sometimes works weekends, but takes PTO. Sustainable mostly." | Monitor for overload; watch for crunch signals |

**Overall Engagement Score:** 6.8/10  
**Retention Risk:** MODERATE

---

### Insights & Flags

Jamie is a solid performer with strong technical skills and team presence. However, two engagement gaps are emerging: (1) Compensation hasn't adjusted in 2 years (inflation eroding salary perception), and (2) Career growth path to IC4 is unclear (risk of job-hunting for clearer progression). Jamie is in moderate flight-risk range. Recommend proactive manager conversation + compensation review + IC4 growth plan.

### Promotion Readiness

**Assessment:** DEVELOPING (6–12 months)

Jamie consistently exceeds expectations on technical execution and mentors junior engineers. Core strengths: systems thinking, code quality, reliability focus. Growth areas: (1) Strategic thinking—can improve by leading roadmap planning, (2) Communication—sometimes skips documenting decisions, (3) Cross-team influence—opportunity to shape infrastructure decisions across company.

**Promotion Plan (next 6 months):**
- Lead one major infrastructure project with cross-team impact
- Improve decision documentation (RFC process)
- Mentor IC2 engineer (formal)
- Re-evaluate for IC4 promotion at Q4 review

### Manager Conversation Agenda

- [ ] Acknowledge strengths: "Your API redesign was excellent; team respects your judgment"
- [ ] Surface engagement flags: Career clarity, compensation concerns
- [ ] IC4 growth plan: "Here's what IC4 looks like; here's how we get you there"
- [ ] Compensation review: "Let's revisit your salary; 2 years without adjustment"
- [ ] Work-life balance check: "How are you feeling on workload? Any burnout signals?"
- [ ] Next 1:1: Monthly growth-focused check-ins starting next week

### Next Steps
- [ ] Manager has 1:1 with Jamie this week
- [ ] Benchmark Jamie's salary against Levels.fyi, PayScale, Blind
- [ ] Define IC4 growth plan + milestones + timeline
- [ ] If compensation review warranted, prepare offer before discussion
- [ ] Follow-up engagement pulse in Q3 (3 months)
```

---
