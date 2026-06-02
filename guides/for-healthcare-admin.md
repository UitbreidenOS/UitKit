# Claude for Healthcare Administrators

Everything a Healthcare Administrator or Practice Manager needs to run AI-augmented patient communications, SOPs, compliance tracking, staff scheduling, and billing administration in Claude Code.

---

## Who this is for

You are a practice manager, clinic administrator, or medical office coordinator. Your job is to keep the practice running — patient scheduling, staff rostering, billing, compliance documentation, supplier communications — while clinical staff focus on care. You have too many open loops and not enough hours.

**Before Claude Code:** 45 minutes to draft a patient communication policy. 30 minutes per SOP update. Manual follow-up on outstanding invoices. Compliance checklists managed in spreadsheets. Job descriptions written from scratch each hire.

**After:** Patient communication templates in 2 minutes. SOP first drafts in 5 minutes. Billing follow-up emails drafted in 30 seconds. Compliance gap analysis from a policy document in under a minute. Job descriptions with all required disclosures in 3 minutes.

---

## Important disclaimer — read before you start

Claude Code assists with **administrative work only**.

- Do not use Claude Code to make, inform, or suggest clinical decisions of any kind
- Do not paste identifiable patient data into any prompt — names, dates of birth, NHS/insurance numbers, addresses, contact details, or any combination that could identify a real individual
- Use placeholder names (e.g., Patient A, Mr. X) and anonymised references in all examples
- All outputs must be reviewed by a qualified human before being sent to patients or used in regulated processes
- Nothing in this guide constitutes legal, clinical, or regulatory advice

Claude Code is not a HIPAA-covered entity and should not be treated as part of your compliant data infrastructure. If you handle data subject to HIPAA, GDPR, or equivalent frameworks, review your organisation's data governance policy before using any AI tooling. When in doubt, consult your Data Protection Officer or legal counsel.

---

## 30-second install

```bash
# Install all healthcare admin skills and agents
npx claudient add skill ops/dental-practice
npx claudient add skill ops/sop-writer
npx claudient add skill hr/hiring-pipeline
npx claudient add skill hr/job-description
npx claudient add skill compliance/gdpr-expert
npx claudient add skill compliance/privacy-pia

# Or install the full ops, compliance, and HR bundles:
npx claudient add skills ops
npx claudient add skills compliance
npx claudient add skills hr
```

---

## Your Claude Code healthcare admin stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/dental-practice` | Practice operations templates — appointment reminders, recall letters, consent form language, front-desk scripts | Day-to-day patient communication admin |
| `/sop-writer` | First-draft SOPs from bullet points — formatted, versioned, review-ready | Updating or creating clinical admin procedures |
| `/hiring-pipeline` | End-to-end hiring workflow — job post, screening, interview questions, offer | Recruiting admin, reception, or clinical support staff |
| `/job-description` | Compliant job descriptions with required disclosures for healthcare roles | Any new hire requisition |
| `/gdpr-expert` | GDPR compliance Q&A, data subject request drafts, retention schedule review | Data governance, patient data requests, policy review |
| `/privacy-pia` | Privacy Impact Assessment scaffolding for new systems or process changes | Before onboarding any new software or data flow |
| `/invoice-chaser` | Draft overdue invoice follow-up emails with escalating tone | Chasing outstanding payments from insurers or suppliers |
| `/expense-audit` | Flag anomalies, categorise spend, flag policy exceptions | Monthly expense and procurement review |
| `/customer-inquiry` | Patient inquiry response templates — appointment questions, service info, complaints | Drafting replies to patient inquiries (anonymised) |
| `/review-response` | Draft professional responses to online patient reviews | Google, NHS Choices, or Trustpilot review management |

### Agents

| Agent | Model | When to spawn |
|---|---|---|
| `roles/healthcare-admin` | Sonnet | Full administrative sessions — scheduling, comms, billing coordination |
| `advisors/general-counsel` | Opus | Compliance questions, contract language, data governance, regulatory interpretation |
| `advisors/chro-advisor` | Sonnet | Staff HR — hiring, disciplinary process, contracts, absence management |

---

## Daily workflow

### Morning — patient schedule review (15-20 minutes)

**1. Day preparation — what needs attention today**
```
/dental-practice

Today's admin priorities:
- We have [N] appointments. Flag any that need pre-appointment confirmation calls.
- Draft a same-day reminder message for afternoon appointments (anonymised template).
- Any recall letters due this week — draft the template for [recall type].

Use placeholder patient names throughout.
```

**2. Patient inquiry triage**
```
/customer-inquiry

Draft responses to the following inquiry types received this morning:
1. Patient asking to reschedule — wants earliest available slot
2. Patient asking about [service type] and cost
3. Patient complaint about wait times at last visit

Keep all responses professional, warm, and under 150 words each.
Do not include any real patient details — I will add names manually before sending.
```

---

### Midday — billing and admin (20-30 minutes)

**3. Invoice follow-up**
```
/invoice-chaser

Draft follow-up emails for the following outstanding invoices:
- Invoice [ref]: [Supplier/Insurer name], due [N] days ago, amount [X]
- Invoice [ref]: [Supplier/Insurer name], due [N] days ago, amount [X]

Tone for 15 days overdue: polite reminder.
Tone for 30+ days overdue: firm, with reference to payment terms.
Do not include real patient data in any invoice references.
```

**4. Expense review**
```
/expense-audit

Here is this month's expense summary by category:
[Paste anonymised spend data — no patient identifiers]

Flag anything that looks unusual, over budget, or outside policy.
Summarise for the practice manager's monthly report.
```

---

### Afternoon — compliance and documentation (20-30 minutes)

**5. SOP update**
```
/sop-writer

I need a first draft of an SOP for:
[Topic — e.g., "handling patient data subject access requests"]

Key steps I know it must cover:
- [Step 1]
- [Step 2]
- [Step 3]

Format: numbered steps, owner for each step, review frequency, version box at the top.
Flag any gaps where I need to consult our DPO or legal team.
```

**6. Compliance check**
```
/gdpr-expert

We are planning to onboard a new [software/process] that will handle [type of data].
Walk me through the questions I need to answer before sign-off:
- Do we need a PIA?
- What data processing agreements do we need?
- What should the retention schedule look like?

No real patient data — this is a planning exercise.
```

---

### Staff coordination (as needed)

**7. Hiring — new role**
```
/job-description

Role: [title — e.g., Receptionist / Practice Coordinator / Medical Secretary]
Setting: [GP surgery / dental practice / specialist clinic]
Hours: [full-time / part-time]
Key responsibilities: [bullet list]
Required qualifications: [list]
Required disclosures: DBS check required, right-to-work verification

Draft a compliant job description and a short job advert for NHS Jobs / Indeed.
```

**8. Interview process**
```
/hiring-pipeline

We are hiring a [role]. We have [N] candidates at screening stage.

Draft:
1. A structured interview question set (8-10 questions, competency-based)
2. A scoring rubric for each question
3. A standard rejection email template
4. An offer letter outline (I will add specific terms before sending)
```

---

### Weekly — review and reporting (Friday, 30 minutes)

**9. Online review response**
```
/review-response

We received the following online review:
[Paste review — remove any details that could identify the patient]

Draft a professional response that:
- Thanks the reviewer
- Acknowledges the concern without admitting liability
- Invites them to contact the practice directly
- Stays under 100 words
```

**10. Weekly admin summary**
```
/dental-practice

Draft a weekly admin summary for the practice principal:
- Appointments this week: [N]
- Complaints received: [N]
- Outstanding invoices: [N], total [X]
- SOPs updated: [list]
- Compliance actions open: [list]
- Staffing issues: [description]

One-page format. Flag any items needing principal sign-off.
```

---

## 30-day ramp plan (administrators new to Claude Code)

### Week 1 — Setup and orientation
- Install all skills via `npx claudient add skills ops compliance hr`
- Read the disclaimer section in full — brief your team on what not to paste into prompts
- Run `/sop-writer` on your three most-used procedures — get familiar with the output quality before relying on it
- Use `/gdpr-expert` to audit one existing data process you own
- Draft your first patient communication template with `/dental-practice` — compare against your current templates
- Read your organisation's data governance policy before using Claude Code on any live administrative task

### Week 2 — Communications and billing
- Use `/customer-inquiry` to build a library of 10 standard patient inquiry response templates
- Draft all overdue invoice follow-ups with `/invoice-chaser` — compare response rate to the previous month
- Run `/expense-audit` on last month's spend — present findings to your manager
- Start tracking time spent on communications admin vs. your baseline before Claude Code

### Week 3 — Compliance and documentation
- Run `/privacy-pia` on the next system or process change in your pipeline
- Use `/gdpr-expert` to answer one outstanding compliance question your team has been deferring
- Update at least two SOPs using `/sop-writer` — send both for clinical or management review
- Identify your highest-volume recurring admin task and build a reusable template for it

### Week 4 — Staff and reporting
- Use `/hiring-pipeline` and `/job-description` on your next open role — measure time saved vs. your previous hire
- Run `/review-response` on your last five unanswered online reviews
- Produce your monthly admin report using Claude Code — compare time taken to previous months
- Present one process improvement to your practice principal, backed by time-saving data

---

## HIPAA awareness and data handling

If your practice is subject to HIPAA (US), GDPR (UK/EU), or equivalent frameworks, follow these rules without exception:

- **Never paste a real patient name, date of birth, address, phone number, email, or insurance/NHS number into any prompt**
- Use placeholders: "Patient A", "Mr. X", "DOB: [redacted]", "Claim ref: [ref]"
- Treat Claude Code as you would any third-party SaaS tool — do not share data you would not share with an external vendor without a signed data processing agreement
- Keep a log of which administrative processes you use Claude Code for — your DPO may need this for a processing record
- If you receive a data subject access request (DSAR), use `/gdpr-expert` to draft the process checklist, but handle the actual patient data entirely outside Claude Code

When in doubt, build and test your template using a fictional example, then apply it manually to real data in your practice management system.

---

## Benchmarks

Track these monthly to demonstrate value to your practice principal:

| Metric | Before Claude Code | Target with Claude Code |
|---|---|---|
| Admin hours saved per week | Baseline | 4-8 hours |
| Time to draft patient communication template | 30-45 min | Under 5 min |
| Time to first-draft an SOP | 45-60 min | Under 10 min |
| Response time to patient inquiries | 24-48 hours | Same day |
| Outstanding invoice resolution time | 14+ days | 7-10 days |
| Job description drafting time | 60-90 min | Under 15 min |
| Online review response rate | Variable | 100% within 5 days |
| Compliance tasks completed on time | Track manually | Improve by 30% |

Run a baseline measurement in Week 1 before using Claude Code at scale. Review at 30 and 90 days.

---

## Resources

- [Getting started with Claude Code](../getting-started.md)
- [SOP writer skill](../skills/ops/sop-writer.md)
- [GDPR expert skill](../skills/compliance/gdpr-expert.md)
- [Privacy PIA skill](../skills/compliance/privacy-pia.md)
- [Hiring pipeline skill](../skills/hr/hiring-pipeline.md)
- [Invoice chaser skill](../skills/finance/invoice-chaser.md)

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
