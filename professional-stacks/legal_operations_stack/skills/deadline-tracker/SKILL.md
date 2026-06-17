# Skill: Deadline Tracker

Track contract renewal dates, notice periods, and key milestones. Alert 60/30/14 days before critical dates.

---

## When to activate

When user runs `/deadline-tracker` or when contracts are uploaded for ongoing monitoring.

---

## When NOT to use

- Do not use for compliance audit scheduling or project timelines.
- Do not generate alerts for non-critical dates.

---

## Instructions

1. **Scan all tracked contracts** for:
   - Renewal dates
   - Notice period deadlines (before renewal date)
   - Key milestones (audit dates, payment milestones, etc.)
   - Expiration or termination dates

2. **Extract and standardize dates:**
   - Convert all dates to ISO 8601 format (YYYY-MM-DD)
   - Calculate days remaining to each deadline
   - Identify upcoming dates within 60 days

3. **Calculate alert thresholds:**
   - URGENT: 0–14 days remaining
   - DUE SOON: 15–30 days remaining
   - COMING UP: 31–60 days remaining
   - FUTURE: 60+ days remaining

4. **Prioritize by urgency:**
   - Sort all deadlines by days remaining (ascending)
   - Within each priority tier, sort by date

5. **Map actions to each deadline:**

| Deadline Type | Days Out | Action |
|---|---|---|
| Renewal | 60+ | Start negotiation/budget review |
| Notice Period | 31–60 | Plan for renewal or wind-down |
| Notice Period | 14–30 | Finalize decision (renew/exit) |
| Notice Period | 0–14 | Send notice if decided |
| Renewal Date | 0–14 | Ensure signature or transition |
| Milestone | 60+ | Prepare for upcoming requirement |
| Milestone | 14–30 | Execute on milestone requirement |
| Milestone | 0–14 | Complete and validate |

6. **Return prioritized list:**
   - Show URGENT first
   - Include contract name, deadline, days remaining, and recommended action
   - Highlight overdue items (negative days remaining)

7. **Flag high-risk deadlines:**
   - Contracts with <14 days to notice deadline
   - Contracts past their renewal date (overdue)
   - Contracts with multiple overlapping deadlines

8. **Log to session-log.md** with report timestamp and alert count.

---

## Example

Input: Scan all tracked contracts for upcoming deadlines

Output:
```
## Contract Deadline Tracker

**Report Date:** 2026-06-13
**Contracts Tracked:** 8

### URGENT (within 14 days)
- Vendor Agreement A | Notice Deadline: 2026-06-20 | Days Remaining: 7 | Action: **Send non-renewal notice TODAY**
- SaaS License B | Renewal: 2026-06-25 | Days Remaining: 12 | Action: Finalize decision and execute

### DUE SOON (15–30 days)
- Support Contract C | Notice Deadline: 2026-06-30 | Days Remaining: 17 | Action: Decide on renewal; notify vendor by 2026-06-20
- Maintenance D | Milestone (Audit): 2026-07-01 | Days Remaining: 18 | Action: Schedule SOC 2 audit

### COMING UP (31–60 days)
- Cloud Service E | Renewal: 2026-07-10 | Days Remaining: 27 | Action: Start renewal negotiation
- API License F | Notice Deadline: 2026-08-01 | Days Remaining: 49 | Action: Plan for renewal or replacement

### BEYOND 60 DAYS
- Licensing G | Renewal: 2026-10-15 | Days Remaining: 124 | Status: Monitor
- Hosting H | Renewal: 2026-12-31 | Days Remaining: 201 | Status: On track

### Key Dates Summary
- Total Contracts Tracked: 8
- Renewals Coming Up: 4
- Notices Due: 3
- Milestones Due: 1
- Overdue Items: 0

### Recommended Immediate Actions
1. Send non-renewal notice for Vendor Agreement A by EOD today
2. Schedule decision meeting for SaaS License B (must decide by 2026-06-18)
3. Book SOC 2 audit for Maintenance D (target: July 1)
```

---

## Related Skills

- `contract-reviewer` — Extract renewal dates from contracts
- `deadline-tracker` — Ongoing monitoring and alerts
- `document-controller` — Track amendments and version dates
