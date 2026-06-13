---
name: off-boarder
description: Generates comprehensive offboarding checklist on employee departure — exit interviews, knowledge transfer, system access removal, final payments, alumni network outreach. Returns structured exit plan ready for execution.
allowed-tools: Read, Write
effort: medium
---

# Off-Boarder

## When to activate

Immediately upon notice of departure. Employee has resigned or been terminated. You have access to employee's role, tenure, team, system access, and any exit interview feedback.

## When NOT to use

Not for onboarding (use onboarding-workflow). Not for mid-flight performance issues without offboarding context. Not without clear departure date and reason.

## Offboarding Goals

- **Week 1 (Notice):** Secure data, begin knowledge transfer, communicate to team, plan transition.
- **Final week:** Complete knowledge transfer, remove access, archive files, final administrative items.
- **Post-departure:** Alumni outreach, references, feedback collection, lessons learned.
- **All phases:** Maintain respect and professionalism (exiting employee is a reference and potential brand ambassador).

## Offboarding Dimensions

### 1. Exit Communication (Immediate)

**What to do:**
- [ ] Manager has exit conversation with employee (same-day if possible)
- [ ] Verify departure date and reason (resignation, layoff, termination)
- [ ] HR documents departure in HRIS (BambooHR, Workday, etc.)
- [ ] Manager schedules exit interview with HR or People Ops
- [ ] Team is notified (timing: immediately for resignation, company-wide for layoff)
- [ ] Customers/external partners are notified (if applicable, by manager)
- [ ] References documented (ask employee: "Are you open to being a reference for future candidates?")

**Key message to team:**
"[Name] is moving on to [new role / next chapter]. We're grateful for [specific contribution]. [Name] will be here through [date], and we'll have [transition plan]. Please celebrate their work and help with handoff."

### 2. Knowledge Transfer Planning (Days 1–3)

**What to do:**
- [ ] Identify critical responsibilities (what will person own until departure?)
- [ ] Create transition document: "What I do and why" (1-page per area)
- [ ] Schedule knowledge transfer sessions with successor or team (2–3 sessions, 1h each)
- [ ] Document processes: checklists, templates, decision trees (anything that requires their context)
- [ ] Record knowledge transfer videos if applicable (for async/future reference)
- [ ] Create RACI (Responsible, Accountable, Consulted, Informed) for areas they owned
- [ ] Identify who owns what after they leave (assign explicit ownership, not "TBD")

**Example knowledge transfer doc:**
```
# Jamie's Knowledge Transfer

## Area 1: API Redesign Project (ongoing)
- **Owner after:** Alex (Backend Lead)
- **Status:** 70% complete; blocking issue with rate-limiting
- **Key decision:** Rate-limit by IP or by user? (Jamie recommends: by user)
- **Next milestone:** Code review + deploy to staging (end of week)
- **Handoff:** 1h meeting with Alex + full source docs in GitHub

## Area 2: On-Call Rotation
- **Owner after:** Jamie's on-call partner (Sat Zhang)
- **Runbook:** [Link to GitHub/Notion]
- **Common issues:** [List 3–5 recent incidents, solutions]
- **Escalation contacts:** [CEO, VP Eng, etc.]
- **Handoff:** 2h meeting on Thursday to walk through recent incidents

## Area 3: Vendor Management (AWS, Datadog)
- **Owner after:** Finance + Engineering Manager
- **Contracts:** AWS renews July 2026 (Jamie: negotiate volume discount)
- **Datadog:** Consider cheaper monitoring tool (Jamie has notes)
- **Key contacts:** AWS TAM = [Name], Datadog = [Name]
```

### 3. System Access Removal (Final Day)

**What to do:**
- [ ] Disable email account (keep forwarding active for 30 days)
- [ ] Revoke GitHub / repository access
- [ ] Revoke AWS / cloud environment access
- [ ] Revoke Slack account (archive messages first)
- [ ] Revoke VPN access
- [ ] Revoke hardware access (badge, building keys)
- [ ] Revoke financial access (credit cards, Expensify, etc.)
- [ ] Revoke third-party SaaS (Notion, Figma, monitoring tools, etc.)
- [ ] Collect company hardware: laptop, monitors, badge, etc.
- [ ] Disable phone (transfer number if applicable)

**Timing:**
- **Resign notice:** Remove access after final day (don't pre-emptively cut off)
- **Layoff:** Remove access immediately after notification (security protocol)
- **Termination for cause:** Remove access immediately

**Checklist:**
```
System Access Removal Checklist for [Name]

Email:
- [ ] Disable account
- [ ] Forward email to [Manager] or [Team email]
- [ ] Export calendar, contacts if requested
- [ ] Delete from mailing lists

Code/Dev:
- [ ] Remove from GitHub orgs
- [ ] Remove from AWS accounts
- [ ] Remove from JIRA / Linear
- [ ] Remove from CI/CD access
- [ ] Remove from Datadog / monitoring tools

Communication:
- [ ] Disable Slack account
- [ ] Archive all messages (export if needed)
- [ ] Remove from channels

Productivity:
- [ ] Remove from Notion
- [ ] Remove from Google Drive
- [ ] Remove from Figma
- [ ] Remove from Asana / project tools

Admin:
- [ ] Disable building badge / access
- [ ] Collect physical keys, hardware
- [ ] Cancel corporate credit card
- [ ] Revoke Expensify access
- [ ] Remove from insurance portals

Hardware Return:
- [ ] Laptop
- [ ] Monitors
- [ ] Keyboard, mouse, cables
- [ ] Phone (if company phone)
- [ ] Badge, keys
- [ ] Check for outstanding equipment (home setup, etc.)
```

### 4. Final Administrative Items (Before Departure)

**What to do:**
- [ ] Verify final paycheck (last day pay, accrued PTO, bonus if applicable)
- [ ] Document final expense reimbursement (if any pending)
- [ ] Confirm benefits termination date (health, 401k, etc.)
- [ ] Provide benefits continuation info (COBRA, if applicable)
- [ ] Provide final tax documents (W2 to be mailed, access to tax portal)
- [ ] Confirm equity documentation (option agreement, tax implications, exercise window)
- [ ] Provide reference letter (if requested, offer to provide one if they left in good standing)
- [ ] Exit survey: ask for feedback on company, role, manager (brief, 5–10 questions)
- [ ] Off-boarding gift (optional, thank you note minimum)

**Example exit survey:**
```
1. What did you enjoy most about working here? [open]
2. What could we improve? [open]
3. How would you rate your manager's support? [1–5]
4. Would you recommend this company as a workplace? [Yes/No/Maybe]
5. If you had one suggestion for the company, what would it be? [open]
6. Are you open to being contacted for references? [Yes/No]
```

### 5. Alumni Network & References (Post-Departure)

**What to do:**
- [ ] Add to alumni Slack or newsletter (if you have one)
- [ ] Document as reference (with permission; update in internal database)
- [ ] Stay in touch: invite to company events if appropriate (annual event, etc.)
- [ ] Feedback collection: ping manager + teammates for feedback on person's strengths/growth areas (documentation)
- [ ] Case study (if applicable): if person made exceptional contribution, document for internal case studies
- [ ] Lessons learned: team retro on person's tenure (what went well, what to improve in onboarding/management)

**Reference protocol:**
- Store reference details in secure system (never share contact without permission)
- When contacted for reference: confirm person is willing, provide factual, balanced feedback
- Template for reference call: "What are your overall impressions of [person]?" → "Can you speak to their technical skills?" → "Teamwork?" → "Areas for growth?"

### 6. Knowledge Preservation (Post-Departure)

**What to do:**
- [ ] Archive all person's documents (keep 7 years for legal/tax)
- [ ] Archive Slack messages (search for decision records, not gossip)
- [ ] Document key decisions they made (decision log, if available)
- [ ] Preserve any IP/code they created (ensure company owns it)
- [ ] Update internal wiki with any unique processes they owned
- [ ] Update org chart and role descriptions
- [ ] Review onboarding for gaps they exposed (how was knowledge not documented? What do we change?)

## Output Format

Return offboarding plan in this format:

```
## Offboarding Plan: [Employee Name]

**Role:** [Job Title]  
**Team:** [Team]  
**Departure Reason:** [Resignation / Layoff / Termination]  
**Final Day:** [Date]  
**Notice Period:** [X weeks]

---

### Exit Communication Checklist

- [ ] Exit conversation with manager (completed: [date])
- [ ] HR documentation in HRIS
- [ ] Team notification sent
- [ ] Customer/partner notification (if applicable)
- [ ] Exit interview scheduled

---

### Knowledge Transfer Plan

**Critical Responsibilities:**
| Area | Owned | New Owner | Transfer Method | Complete by |
|---|---|---|---|---|
| [Project 1] | [Name] | [New owner] | 1h video + doc | [Date] |
| [Process 1] | [Name] | [Team/Person] | Knowledge transfer session | [Date] |

**Knowledge Transfer Sessions:**
- [ ] Session 1: [Area 1] — [Date], [Time] — [Participants]
- [ ] Session 2: [Area 2] — [Date], [Time] — [Participants]
- [ ] Session 3: [Area 3] — [Date], [Time] — [Participants]

**Documentation Completed:**
- [ ] Transition document: [Link]
- [ ] Runbook/process docs: [Link]
- [ ] Video walkthroughs: [Link]

---

### System Access Removal

**Scheduled for:** [Final day], end of business

- [ ] Email disabled, forwarding active
- [ ] GitHub/code access revoked
- [ ] AWS/cloud access revoked
- [ ] Slack disabled
- [ ] VPN access revoked
- [ ] Building badge disabled
- [ ] Hardware collected

---

### Final Administrative Items

- [ ] Final paycheck processed: $[X] (last day pay + accrued PTO)
- [ ] Benefits termination documented
- [ ] COBRA notice sent (if applicable)
- [ ] Tax documents prepared (W2, access provided)
- [ ] Equity documentation provided
- [ ] Exit survey completed
- [ ] Reference letter provided (if applicable)

---

### Alumni & References

- [ ] Added to alumni network
- [ ] Reference documented (with permission)
- [ ] Feedback collected from manager + teammates
- [ ] Post-departure follow-up: [Date]

---

### Lessons Learned

[Document any improvements to onboarding, management, or processes exposed by this departure]

---

### Next Steps
- [ ] Manager conducts exit interview
- [ ] Hardware is collected and audited
- [ ] Access removal completed on final day
- [ ] Team schedule post-departure (who covers responsibilities?)
- [ ] Follow-up with new owner in 1 week to ensure smooth transition
```

## Example Offboarding Plan

```
## Offboarding Plan: Jamie Chen

**Role:** Senior Backend Engineer  
**Team:** Infrastructure  
**Departure Reason:** Resignation (Accepted offer at Stripe)  
**Final Day:** June 30, 2026  
**Notice Period:** 2 weeks

---

### Exit Communication Checklist

- [x] Exit conversation with manager (Alex) — June 17
- [x] HR documentation in BambooHR — June 17
- [x] Team notification sent — June 18
- [x] Customer notification: key AWS contact notified — June 18
- [ ] Exit interview scheduled — June 28, 2pm with HR

---

### Knowledge Transfer Plan

**Critical Responsibilities:**
| Area | Owned | New Owner | Transfer Method | Complete by |
|---|---|---|---|---|
| API Redesign (70% done) | Jamie | Alex (Backend Lead) | 2h walkthrough + GitHub docs | June 26 |
| On-Call Rotation | Jamie | Sat Zhang | 2h incident runbook review | June 26 |
| Vendor Management (AWS, Datadog) | Jamie | Alex + Finance | 1h contract review | June 27 |
| Team Mentoring (IC2 engineer) | Jamie | Alex (ownership transfer) | Handoff meeting with mentee | June 30 |

**Knowledge Transfer Sessions:**
- [x] Session 1: API Redesign — June 24, 2pm — Jamie, Alex, Backend team
- [ ] Session 2: On-Call Runbook — June 25, 2pm — Jamie, Sat, Alex
- [ ] Session 3: Vendor/Contracts — June 27, 10am — Jamie, Alex, CFO

**Documentation Completed:**
- [x] Transition doc: [GitHub/Notion Link]
- [x] API Redesign status + blockers: [GitHub issue]
- [x] On-Call runbook + contact list: [Notion doc]
- [ ] Vendor contracts summary: [Due June 26]

---

### System Access Removal

**Scheduled for:** June 30, 2026, 4:00 PM (end of day)

- [ ] Email disabled (forwarding to alex@company.com active for 30 days)
- [ ] GitHub access revoked (repos archived)
- [ ] AWS access revoked (preserved IAM history for audit)
- [ ] Slack disabled (messages archived in [Slack backup link])
- [ ] VPN access revoked
- [ ] Building badge disabled
- [ ] Hardware collected: laptop, 2x monitors, mechanical keyboard, USB-C dock

---

### Final Administrative Items

- [x] Final paycheck processed: $8,900 (2 weeks salary @ $155k/26, + 5 days accrued PTO @ 20 days/year = $3k)
- [x] Benefits termination documented (health/dental/vision terminate 6/30)
- [x] COBRA notice mailed (18-month continuation available)
- [x] Tax documents prepared (W2 will be mailed by 1/31/2027)
- [x] Equity documentation provided (option agreement, vesting schedule, exercise window: 10 years from grant date)
- [ ] Exit survey emailed — June 28 (completion: June 30)
- [ ] Reference letter offered (Jamie accepted; letter will be provided)

---

### Alumni & References

- [x] Added to alumni Slack channel
- [x] Reference documented: "Jamie Chen — Senior Backend Engineer — Exceptional technical depth, systems thinker, great team player. Available for references with permission."
- [ ] Feedback collected from Alex (manager) + team — Due June 30
- [ ] Post-departure follow-up: July 15 (invite to company happy hour in August)

---

### Lessons Learned

**What went well:**
- Jamie gave 2 weeks notice; smooth transition possible
- Clear, documented technical work; minimized knowledge loss risk
- Strong relationship with team; morale impact minimal

**What to improve:**
- Earlier documentation of critical processes (Jamie's on-call runbook was not documented; would have been useful pre-departure)
- IC3 → IC4 growth path unclear (Jamie didn't see clear progression; might have influenced departure decision)
- Recommend: Formalize IC4 growth plan for remaining ICs + document all critical runbooks annually

---

### Next Steps
- [x] Manager has conducted exit conversation
- [ ] Complete knowledge transfer sessions (by June 27)
- [ ] Collect hardware at end of day June 30
- [ ] Remove system access 4pm June 30
- [ ] Execute access removal checklist
- [ ] Conduct exit interview June 28
- [ ] Alex meets with Sat Zhang June 30 to confirm on-call transition
- [ ] Alex schedules post-departure team retro (July 1)
- [ ] Follow-up with Sat + team July 7 to ensure smooth on-call coverage
```

---
