# Command: /deadline-tracker

Surface all contract renewal dates, key milestones, and upcoming deadlines. Automatically alert 60/30/14 days before critical dates.

---

## Syntax

```
/deadline-tracker [optional-filter: all|renewal|notice|milestone]
```

---

## What It Does

1. Scans all tracked contracts for renewal dates, notice periods, and key milestones
2. Calculates days remaining to each deadline
3. Surfaces alerts for dates within: 60 days, 30 days, 14 days
4. Returns prioritized list ordered by urgency
5. Logs action to session-log.md

---

## Output Format

```
## Contract Deadline Tracker

**Report Date:** [YYYY-MM-DD]
**Contracts Tracked:** [X]

### URGENT (within 14 days)
- [Contract Name] | Renewal: [YYYY-MM-DD] | Days Remaining: [X] | Action: [renew/notice/decision]
- [Contract Name] | Notice Deadline: [YYYY-MM-DD] | Days Remaining: [X] | Action: [send notice]

### DUE SOON (15–30 days)
- [Contract Name] | Renewal: [YYYY-MM-DD] | Days Remaining: [X] | Action: [schedule review]
- [Contract Name] | Milestone: [YYYY-MM-DD] | Days Remaining: [X] | Action: [prepare deliverable]

### COMING UP (31–60 days)
- [Contract Name] | Renewal: [YYYY-MM-DD] | Days Remaining: [X] | Action: [start negotiation]
- [Contract Name] | Notice Deadline: [YYYY-MM-DD] | Days Remaining: [X] | Action: [plan ahead]

### BEYOND 60 DAYS
- [Contract Name] | Renewal: [YYYY-MM-DD] | Days Remaining: [X] | Status: [on track]

### Key Dates Summary
- Total Renewals: [X]
- Notices Due: [X]
- Milestones Due: [X]
- Overdue Items: [X]
```

---

## Alert Schedule

- **60 days:** Planning stage — schedule internal review
- **30 days:** Active negotiation stage — engage counterparty
- **14 days:** Final decision stage — approve and execute
- **0 days (expired):** Escalate immediately

---

## Filters

- `all` — Show all tracked dates
- `renewal` — Show only contract renewals
- `notice` — Show only notice period deadlines
- `milestone` — Show only key milestones

---

## Example

```
/deadline-tracker renewal
```

Returns only contracts with upcoming renewal dates, sorted by urgency.

---

## Related Commands

- `/contract-review` — Analyze a contract for risks and obligations
- `/compliance-check` — Validate document against regulatory framework
