---
name: culture-auditor
description: Runs culture health assessment, measures eNPS and engagement, identifies belonging gaps, flags flight risks. Outputs culture-audit-{date}.md with recommendations.
allowed-tools: Read, Write, WebSearch
effort: high
---

## When to activate

Quarterly (or semi-annually for smaller companies). Assesses employee engagement, belonging, psychological safety, and cultural health.

## When NOT to use

Not for performance reviews or individual feedback. Not for disciplinary action. Not as substitute for 1:1 conversations; this is population-level data.

## Culture Audit Framework

### What is Culture Health?

Culture health encompasses:
- **Belonging:** Do people feel included, respected, and valued?
- **Psychological safety:** Can people take risks, admit mistakes, speak up?
- **Alignment:** Do people understand company mission and how their work connects?
- **Growth:** Do people see career development and learning opportunities?
- **Engagement:** Are people energized and motivated to do their best work?
- **Retention:** Do people want to stay and build with us?

---

## eNPS (Employee Net Promoter Score)

**Question:** "How likely are you to recommend this company as a great place to work to a friend? (0–10)"

**Calculation:**
- Promoters (9–10): Enthusiastic; likely to stay and recruit friends
- Passives (7–8): Satisfied but not enthusiastic; flight risk if better opportunity
- Detractors (0–6): Unhappy; flight risk; risk of negative word-of-mouth

**Formula:** eNPS = (% Promoters) − (% Detractors)

**Example:** 50 employees surveyed
- Promoters: 20 (40%)
- Passives: 20 (40%)
- Detractors: 10 (20%)
- **eNPS = 40% − 20% = +20**

**Benchmark:**
- eNPS +40+: Excellent (Google, top tech companies)
- eNPS +20 to +40: Good (healthy, engaged company)
- eNPS 0 to +20: Fair (some engagement gaps)
- eNPS <0: Concerning (more detractors than promoters)

**Follow-up question:** "What's the primary reason for your score?"
(This gives qualitative context: comp, growth, management, culture, flexibility, etc.)

---

## Culture Dimensions Assessment

Measure on 1–5 scale (strongly disagree to strongly agree):

### 1. Belonging & Inclusion

**Questions:**
- "I feel included and valued by my team and manager" (1–5)
- "I feel psychologically safe speaking up with ideas or concerns" (1–5)
- "People here respect different perspectives and backgrounds" (1–5)

**Target:** Average 4.0+ (majority agree/strongly agree)

**Red flags:** <3.5 average = belonging problem; investigate by demographic if possible.

### 2. Alignment & Mission

**Questions:**
- "I understand our company mission and how my work contributes" (1–5)
- "Our company values guide decisions and actions" (1–5)
- "I believe in what we're building" (1–5)

**Target:** 4.0+

**Red flags:** <3.5 = misalignment on mission or values aren't lived.

### 3. Growth & Development

**Questions:**
- "I have opportunities to grow and develop my skills" (1–5)
- "My manager provides clear feedback and coaching" (1–5)
- "There's a clear path to the next level in my role" (1–5)

**Target:** 4.0+

**Red flags:** <3.5 = growth ceiling or weak management feedback.

### 4. Work-Life Balance & Flexibility

**Questions:**
- "I'm able to maintain a healthy work-life balance" (1–5)
- "My work schedule is flexible to meet my needs" (1–5)
- "I'm not regularly burnt out or overworked" (1–5)

**Target:** 3.8+

**Red flags:** <3.0 = burnout risk; assess workload, on-call, flexibility policy.

### 5. Team & Management Quality

**Questions:**
- "My direct manager is effective and supportive" (1–5)
- "My team collaborates well and supports each other" (1–5)
- "I trust leadership to make good decisions" (1–5)

**Target:** 4.0+

**Red flags:** <3.5 = management or team dynamic issue.

### 6. Compensation & Benefits

**Questions:**
- "My compensation is fair for my role and market" (1–5)
- "Company benefits (health, retirement, etc.) are competitive" (1–5)
- "Equity/bonus program is transparent and achievable" (1–5)

**Target:** 3.5+

**Red flags:** <3.0 = market misalignment; flight risk.

---

## Culture Audit Output Template

```markdown
# Culture Audit — [Quarter] [Year]

**Prepared:** [YYYY-MM-DD]
**Survey period:** [Dates]
**Respondents:** [N] of [Total] ([X]% response rate)
**Confidentiality:** All responses anonymous; aggregated by team/level only

---

## Executive Summary

**Overall eNPS:** +25 (Good; target 20–40)
**Engagement:** 7.2/10 (Good; target 7.0+)
**Belonging:** 4.0/5 (Good; target 4.0+)
**Attrition risk:** 15% of workforce flagged as detractors (flight risk)

**Key findings:**
1. Engineering satisfaction above average; strong team cohesion
2. New hire cohort (Q1 2025) showing signs of disconnection; onboarding issue
3. Workload concerns in Operations team; on-call rotation unsustainable
4. Compensation perceived as below-market by mid-level ICs

---

## eNPS Results

| Category | Count | Percentage |
|----------|-------|-----------|
| Promoters (9–10) | 20 | 40% |
| Passives (7–8) | 20 | 40% |
| Detractors (0–6) | 10 | 20% |
| **eNPS** | | **+20** |

**Benchmark:** SaaS industry average = +15 to +25; we're in good range.

### eNPS by Team

| Team | eNPS | Count | Insight |
|------|------|-------|---------|
| Engineering | +35 | 20 | Excellent; team bonding strong |
| Product | +20 | 8 | Good; some growth concerns |
| Sales | +15 | 10 | Fair; comp/quota concerns |
| Operations | −5 | 6 | Concerning; workload/burnout signals |
| Marketing | +25 | 6 | Good |

**Action items:**
- Operations team: Review workload, prioritize, or add headcount
- Sales team: Compensation review and quota alignment discussion

---

## Dimension Results

| Dimension | Average Score | Target | Status | Insight |
|-----------|--------|---------|--------|---------|
| **Belonging & Inclusion** | 3.9 | 4.0 | Yellow | Slightly below target; check onboarding cohort |
| **Alignment & Mission** | 4.1 | 4.0 | Green | Strong; mission resonates |
| **Growth & Development** | 3.7 | 4.0 | Yellow | Growth path concerns; manager feedback gaps |
| **Work-Life Balance** | 3.4 | 3.8 | Yellow | Burnout signals; particularly Operations |
| **Team & Management** | 4.0 | 4.0 | Green | Strong manager quality overall |
| **Compensation & Benefits** | 3.2 | 3.5 | Yellow | Below-market perception; mid-level IC concern |

---

## Belonging & Inclusion Deep Dive

**Questions:**
- "I feel included and valued": 4.1/5 ✓ Good
- "I feel safe speaking up": 3.8/5 ⚠️ Below target; some inhibition
- "People respect different perspectives": 4.0/5 ✓ Good

**Comments (sample):**
- "Feels like a boys' club in engineering; hard to speak up in certain meetings"
- "New folks take time to integrate; could improve onboarding buddy system"
- "Leadership listens when I raise concerns; appreciate that"

**Segment breakdown (by demographics, if collected):**
- Women/non-binary: 3.7/5 (vs. men 4.2/5) ← gap; investigate
- New hires (<6 months): 3.5/5 (vs. tenured 4.1/5) ← onboarding issue
- Remote employees: 3.8/5 (vs. office 4.1/5) ← remote connection gap

**Recommendations:**
1. Improve meeting dynamics training (psychological safety in meetings)
2. Strengthen onboarding buddy system; dedicated mentor for first 90 days
3. Remote connection: add team rituals (virtual coffee, async updates)

---

## Growth & Development Deep Dive

**Questions:**
- "Opportunities to grow": 3.6/5 ⚠️ Below target
- "Manager feedback & coaching": 3.8/5 ⚠️ Below target
- "Clear path to next level": 3.5/5 ⚠️ Below target

**Comments (sample):**
- "No clear promotion criteria; feels arbitrary"
- "My manager rarely gives me feedback; not sure where I stand"
- "Love learning; wish there were more internal mobility opportunities"

**By level:**
- L1 (junior): 3.8/5 (good; happy to grow in role)
- L2 (senior): 3.4/5 (below target; ready for next step but path unclear)
- L3+ (staff+): 4.1/5 (satisfied; leadership roles visible)

**Recommendations:**
1. Publish promotion rubrics and timelines (transparency)
2. Manager training on giving feedback (quarterly conversations)
3. Internal mobility program: identify opportunities for lateral moves

---

## Work-Life Balance & Burnout Assessment

**Questions:**
- "Healthy work-life balance": 3.4/5 ⚠️ Concerning
- "Flexible schedule": 3.6/5 ⚠️ Below target
- "Not burnt out": 3.2/5 ⚠️ Red flag

**Comments (sample):**
- "On-call rotation for Operations is unsustainable; 1 week per 6 weeks + urgent pages"
- "Engineering crunch before customer releases; no control over hours"
- "Remote flexibility helps; can't complain"

**By team:**
- Operations: 2.8/5 (burnout risk)
- Engineering: 3.5/5 (high workload but manageable)
- Sales: 3.3/5 (quota pressure)
- Marketing: 4.1/5 (healthy balance)

**Recommendations:**
1. Operations: Review on-call scheduling; consider hiring or tooling to reduce load
2. Engineering: Project scoping; prevent crunch culture
3. Company-wide: Normalize boundaries; manager training on workload assessment

---

## Compensation & Benefits Perception

**Questions:**
- "Compensation is fair": 3.1/5 ⚠️ Below target
- "Benefits competitive": 3.4/5 ⚠️ Borderline
- "Equity transparent & achievable": 3.2/5 ⚠️ Below target

**Comments (sample):**
- "Saw new hires getting more than tenured staff for same role"
- "Compensation hasn't moved in 2 years despite growth"
- "Don't fully understand equity vesting or value"

**By level:**
- L1: 3.5/5 (entry-level; acceptable)
- L2: 2.9/5 (below-market perception; flight risk)
- L3+: 3.4/5 (acceptable; less price-sensitive)

**Recommendations:**
1. Compensation review: benchmark L2 salaries vs. market (Levels.fyi data)
2. Equity education: publish vesting schedules, equity value modeling
3. Transparency: share compensation philosophy and ranges (optional)

---

## Flight Risk & Detractor Analysis

**10 detractors (20% of workforce) identified as flight risk.**

| Risk Level | Count | Characteristics |
|---|---|---|
| **High risk** (0–4 score) | 3 | Operations team; burnout; low compensation satisfaction; likely exploring |
| **Medium risk** (5–6 score) | 7 | Mix of low growth satisfaction, management concerns, compensation |

**Detractor breakdown by reason:**
- Burnout/workload: 3 (Operations)
- Growth ceiling: 2 (L2 ICs with no promotion path)
- Management: 2 (weak feedback, lack of support)
- Compensation: 2 (below-market perception)
- Culture/team: 1 (doesn't fit with team dynamic)

**Immediate actions:**
- [ ] Manager or HR 1:1 with high-risk employees (Operations team)
- [ ] Understand specific concerns (anonymous follow-up survey or stay interviews)
- [ ] Operations workload assessment and action plan

---

## New Hire Cohort (Q1 2025) Disconnection

**Cohort size:** 8 hired
**Cohort satisfaction:** 3.6/5 (below company avg 3.9/5)
**Retention so far:** 67% (2 left by 6-month mark; problematic)

**Issues identified:**
- "Didn't feel welcomed initially; long time to meet team"
- "Unclear expectations; ramped faster than felt ready"
- "Still don't know many people outside my small team"

**Recommendation:** Strengthen onboarding
1. Assign dedicated buddy for first 90 days (not just informal pairing)
2. Structured new hire orientation (first 2 weeks)
3. Welcome rituals (team lunch, meet-and-greet with leadership)
4. Check-in at 30 days; adjust if struggling

---

## Manager Quality Assessment

**Question:** "My direct manager is effective and supportive" = 4.0/5 ✓ Good

**By manager (if collected):**
- Manager A: 4.4/5 (excellent; strong rapport)
- Manager B: 3.9/5 (good; minor feedback gaps)
- Manager C: 3.5/5 (borderline; hands-off style not suiting team)

**Comments on management:**
- "My manager is very hands-off; good for autonomy but hard to get feedback"
- "Regular 1:1s and clear expectations; feels supported"
- "Doesn't give real feedback; unclear how I'm doing"

**Recommendations:**
1. Manager training: feedback delivery, 1:1 structure, coaching
2. 360 feedback for managers (to understand others' perspectives)
3. Skip-level checks (team can give feedback on manager directly)

---

## Values Alignment & Culture

**Statement:** "Our values guide decisions and actions" = 4.1/5 ✓ Good

**But comments reveal disconnect:**
- "We say we value work-life balance but expect long hours"
- "Diversity & inclusion is a value but doesn't feel lived"
- "Communication is valued; leadership doesn't always follow through"

**Gap:** Values are stated but not all consistently modeled by leadership.

**Recommendations:**
1. Leadership audit on values alignment (where do we fall short?)
2. Values reinforcement in hiring, onboarding, and decision-making
3. Regular communication on how values guide decisions

---

## Recommendations Summary

### Immediate (This month)

- [ ] Manager 1:1s with high-risk detractors (Operations team; burnout focus)
- [ ] Operations workload assessment; emergency action plan if needed
- [ ] Manager training on feedback delivery (1 session; practical)

### Short-term (Next quarter)

- [ ] Compensation benchmarking for L2 ICs (market data collection)
- [ ] Promotion rubrics published (transparency on career path)
- [ ] Onboarding overhaul (buddy assignment, structured orientation)
- [ ] New hire cohort check-in (exit interviews with those who left)

### Ongoing (6+ months)

- [ ] Manager feedback loops (360 reviews; skip-level assessments)
- [ ] Quarterly eNPS pulse survey (track trends)
- [ ] Culture initiatives: team connection events, remote inclusion, values reinforcement
- [ ] Annual deep-dive culture audit (this survey annual baseline)

---

## Next Culture Audit

**Scheduled:** [Q3 2026 or 6 months from this survey]

**Focus areas to track:**
- Has Operations burnout improved?
- New hire cohort retention and satisfaction?
- L2 IC growth satisfaction after rubric publication?
- Overall eNPS trend?

---
