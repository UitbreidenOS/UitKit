---
name: onboarding-builder
description: Creates 30-60-90 day onboarding plan with assigned mentors, learning resources, and productivity milestones. Outputs onboarding-{role}-{date}.md with accountability framework.
allowed-tools: Read, Write
effort: medium
---

## When to activate

Post-offer acceptance. Builds structured onboarding to accelerate time-to-productivity and retention.

## When NOT to use

Not for interview process — use interview-architect. Not for offer negotiation — use compensation-analyzer. Not for longer-term career development (that's 6-month+ planning).

## Onboarding Framework: 30-60-90

### The 30-60-90 Philosophy

**30 days:** Ramp-up phase. Learn company, culture, systems, and get oriented.
**60 days:** Contributes to team; starts owning smaller projects; building relationships.
**90 days:** Fully productive contributor. Owns projects independently; integrated with team.

**Milestones align to productivity curve:**
- Day 0–30: 0–40% productivity (learning)
- Day 30–60: 40–70% productivity (contributing with guidance)
- Day 60–90: 70–100% productivity (independent contributor)
- Day 90+: Full productivity + mentoring others

---

## Role-Specific Onboarding Tracks

### Individual Contributor (IC) Track

**Day 1–7: Orientation**
- [ ] Complete HR paperwork, tax forms, benefits enrollment
- [ ] Receive laptop, hardware, accounts (GitHub, Jira, Slack, etc.)
- [ ] Meet manager 1:1; establish communication norms
- [ ] Review org chart, team structure, project roadmap
- [ ] Attend company all-hands or recording

**Day 8–14: Team Onboarding**
- [ ] Meet team members 1:1 (manager assigns buddy for first week)
- [ ] Review codebase architecture; do first setup (local environment)
- [ ] Attend team standup; listen to weekly team meeting
- [ ] Pair with buddy on first small issue (documentation fix, test update)

**Day 15–30: Foundation & First Contribution**
- [ ] Complete product training (if applicable); demo of product
- [ ] Understand system architecture; read 2–3 design docs
- [ ] Complete first small task independently (bug fix, minor feature)
- [ ] Attend team retrospective; observe decision-making
- [ ] Day 30 check-in with manager: on track? blockers? adjust plan

**Day 31–60: Ownership & Integration**
- [ ] Own a small-to-medium project (timeline 2–3 weeks)
- [ ] Lead design review or architecture discussion
- [ ] Contribute to team discussion (standup, design, process improvement)
- [ ] Mentor 1 peer or help junior IC
- [ ] Day 60 check-in with manager: productivity assessment; feedback

**Day 61–90: Independent Contribution**
- [ ] Own 1–2 medium projects independently
- [ ] Participate in on-call rotation (if applicable)
- [ ] Improve or ship new feature with minimal guidance
- [ ] Contribute to team culture (suggest process improvement, help with recruiting)
- [ ] Day 90 review: formal feedback; alignment on next 6 months

---

## Onboarding Plan Template

```markdown
# Onboarding Plan: [Name] — [Role] — [Department]

**Start Date:** [Date]
**Manager:** [Name]
**Assigned Buddy:** [Name]
**Expected Productivity Ramp:** 0–40% (Day 1–30) → 40–70% (Day 31–60) → 70–100% (Day 61–90)

---

## Day 1: Welcome

**Owner: Manager**

**Activities:**
- [ ] Pickup from HR: desk, equipment, badge
- [ ] Welcome meeting with manager (30 min)
  - Set communication norms (1:1 cadence, Slack response time, availability)
  - Overview of first week (priorities, introductions)
  - Questions welcome (normalize asking)
- [ ] Lunch with team (buddy picks you up)
- [ ] Set up accounts: GitHub, Jira, Slack, internal wiki, email
- [ ] Review organizational structure and team roadmap

**Goal:** Feel welcomed; have basic access; know week 1 priorities.

---

## Week 1: Orientation

**Owner: Manager + Buddy**

**Activities:**
- [ ] Meet 1:1 with manager daily (10–15 min async check-in)
- [ ] Team meetings (standup, weekly sync) — listen, don't speak yet
- [ ] Buddy pairing (2–3 hours): walkthrough of codebase, system architecture
- [ ] Product demo (30 min with product manager or PM)
- [ ] Read: company mission, values, customer stories (30 min)
- [ ] Set up local development environment (buddy helps; document any blockers)

**Success metric:** Can navigate codebase; knows team members; systems working.

---

## Week 2–3: Foundation

**Owner: Manager + Technical Mentor**

**Activities:**
- [ ] Read architecture docs (2–3 critical design documents) — 2 hours total
- [ ] Pair on first ticket with buddy (1–2 days; mentor reviews code, not just approves)
- [ ] Attend team design discussion or architecture meeting
- [ ] Complete first small contribution independently (e.g., documentation fix, test update, minor bug)
- [ ] Weekly 1:1 with manager: progress check, blockers, questions

**First task criteria:**
- Scoped to <1 day of work
- Clear success criteria
- Buddy/mentor available for pairing
- Builds familiarity with codebase

**Success metric:** Shipped first task; understands core system; asking good questions.

---

## Week 4: First Meaningful Contribution

**Owner: Manager**

**Activities:**
- [ ] Complete second small-to-medium task (2–3 days) independently, with code review
- [ ] Participate in standup (one update: what you worked on, blockers)
- [ ] Pair with another team member (cross-team knowledge)
- [ ] Day 30 check-in with manager (30 min):
  - Progress on tasks
  - Productivity level (honest assessment; adjust if needed)
  - Blockers or concerns
  - Goal for next 30 days

**Success metric:** 30–40% productivity; owns small task; integrated with team.

---

## Week 5–8: Ownership Phase

**Owner: Manager**

**Activities:**
- [ ] Assigned a medium project (~2–3 weeks; scoped clearly)
- [ ] Lead a technical discussion or standup update
- [ ] Code reviews by 2–3 teammates (learn team standards)
- [ ] Attend one department or company meeting (broader context)
- [ ] Mentor another IC on pair session
- [ ] Weekly 1:1 with manager: project progress, feedback, learning

**Project success criteria:**
- Requires 2–3 weeks of work
- Clear acceptance criteria
- Manager and buddy available for design review / feedback
- Shipped by day 60 (or well underway)

**Success metric:** 50–70% productivity; owns medium project; contributing ideas.

---

## Week 9–12: Independent Contributor

**Owner: Manager**

**Activities:**
- [ ] Own 1–2 medium projects independently (~4 weeks total)
- [ ] Participate in on-call rotation (if applicable)
- [ ] Suggest 1 process improvement (small: documentation, test, tool)
- [ ] Help with team hiring (interview candidate or review resume)
- [ ] Mentor 1 junior IC or new hire (peer mentoring)
- [ ] Day 90 review meeting (60 min):
  - 90-day feedback from manager, skip-level (if applicable)
  - Productivity assessment; compare to expectations
  - Wins and growth areas
  - Alignment on next 6-month goals
  - Career development path discussion

**Success metric:** 80–100% productivity; independent contributor; integrated into team.

---

## Support Structure

### Assigned Buddy
**Name:** [Name]  
**Role:** [Title]  
**Responsibilities:** Pair programming, informal questions, culture integration, introduce to team

### Technical Mentor
**Name:** [Name]  
**Role:** [Title]  
**Responsibilities:** Code review, architecture questions, technical feedback, 2 weeks check-in

### Manager Check-ins
- **Cadence:** Weekly (30 min) for first 30 days; then bi-weekly
- **Topics:** Progress, blockers, learning, questions, morale
- **Feedback:** Continuous; formal feedback at 30, 60, 90 days

### Company Onboarding
- **HR orientation:** Day 1 (30 min; benefits, policies, company history)
- **Product training:** Week 1 (30 min; product demo, use cases)
- **Engineering induction:** Week 1–2 (4 hours; architecture, deployment, dev setup)

---

## Learning Resources

### Required Reading (3–5 hours)
- [ ] Company mission/values doc (30 min)
- [ ] Team handbook (1 hour)
- [ ] Architecture overview (1.5 hours)
- [ ] Customer stories / case study (1 hour)

### Technical Onboarding (8–10 hours)
- [ ] Dev environment setup (2 hours; buddy helps)
- [ ] Read codebase tour doc (1.5 hours)
- [ ] Understand CI/CD pipeline (1 hour)
- [ ] Deploy a change locally (2 hours; with buddy)
- [ ] Run test suite and understand failure modes (1 hour)
- [ ] Read 2–3 architecture docs (2 hours)

### Tools & Logins (Day 1)
- [ ] GitHub / GitLab
- [ ] Jira / Linear
- [ ] Slack
- [ ] Notion / Wiki (internal docs)
- [ ] Google Drive (team shared)
- [ ] Email + calendar

---

## 30-Day Checkpoint

**Manager conducts with new hire + optional buddy input.**

**Assess:**
- [ ] HR/admin all complete (benefits, tax forms, etc.)
- [ ] Systems access all working
- [ ] Completed 2–3 small tasks
- [ ] Met team and key stakeholders
- [ ] Understands team roadmap and priorities
- [ ] Productivity estimate: _____% (0–100%)
- [ ] Morale: strong / good / okay / concerning

**Adjustments:**
- If <30% productivity: Review onboarding plan; identify blockers (too difficult tasks, unclear guidance, personal issues)
- If >40% productivity: Increase task complexity; assign ownership sooner
- Any concerns: Document; offer support (mentoring, additional resources, etc.)

**Manager notes:**
```
[Strengths observed]
[Areas for development]
[Specific feedback for next 30 days]
[Any red flags or concerns]
```

---

## 60-Day Checkpoint

**Manager conducts with new hire.**

**Assess:**
- [ ] Completed medium project
- [ ] Actively contributing in standup, meetings
- [ ] Building team relationships
- [ ] Code quality: meets team standards
- [ ] Independence growing; needs less guidance
- [ ] Productivity estimate: _____% (40–80%)
- [ ] Morale: strong / good / okay / concerning

**Adjustments:**
- Increase project complexity and autonomy
- Assign mentorship or interview responsibilities
- If struggling: Add support (pairing, different project type, etc.)

**Manager notes:**
```
[Progress on medium project]
[Collaboration feedback from peers]
[Growth areas]
[Strengths showing]
[Next 30-day goals]
```

---

## 90-Day Review

**Formal review with manager + skip-level (optional) + peer feedback (optional).**

**Assess:**
- [ ] Shipped 2–3 medium projects independently
- [ ] Contributing ideas to team/process
- [ ] Built relationships and trust
- [ ] Productivity: 80%+ (target for day 90)
- [ ] Code quality, architecture thinking, reliability
- [ ] Alignment with team culture and values
- [ ] Ready for next growth opportunity

**Feedback from manager:**
```
[Overall assessment: Exceeded / Met / Below expectations]
[Key strengths]
[Growth areas / development plan]
[Career path discussion]
[Compensation review, if applicable]
[Next 6-month goals]
```

**New hire reflection:**
```
[What helped most in ramp-up?]
[What could have been better?]
[Do you feel productive/integrated?]
[Questions for manager?]
```

---

## Red Flags & Interventions

| Signal | Intervention |
|--------|---|
| Still unable to set up dev environment at day 10 | Pair with buddy; document setup process for future hires |
| Hasn't shipped any task by day 30 | Review task complexity; increase buddy pairing; check for hidden blockers |
| Withdrawn, not attending meetings | 1:1 check-in; may indicate cultural fit issue or personal situation; offer support |
| Code not meeting team standards | Pair review sessions; mentor on team conventions; may need longer ramp |
| Struggling with specific tech (async, distributed systems) | Pairing sessions; recommend courses or resources; adjust project assignments |
| Conflict with teammate or manager | Address early; mediate discussion; escalate if needed |

---

## Success Metrics (90-Day Outcome)

**Hire considered successful if:**
- ✓ Shipped 2–3 medium projects independently
- ✓ 80%+ productivity by day 90
- ✓ Code quality meets or exceeds team standards
- ✓ Integrated with team (positive relationships, active in meetings)
- ✓ Willing to stay and grow (retention)
- ✓ Manager and team rate as "hire again"

**Post-90 Day:**
- Quarterly feedback cycles begin
- Career development planning (6–12 month outlook)
- Onboarding completion; mentored new hire or paid it forward

---
