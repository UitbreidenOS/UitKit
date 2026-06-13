---
name: crm-logger
description: Writes a structured CRM activity log entry from a call note, email event, or meeting outcome. Before writing, checks for an existing entry with the same prospect + date + action hash to prevent duplicates. Returns the formatted log entry for the CRM update and appends to session-log.md.
allowed-tools: Read, Write, Bash
effort: low
---

# CRM Logger

## When to activate
After any sales action: email sent, call completed, meeting held, reply received, or sequence status changed. Use this before updating CRM manually — it generates the structured log entry and catches duplicates.

## When NOT to use
Do not use to log speculative or future activities — only log completed actions. Do not log the same activity twice; always check for existing entries first.

## Instructions

1. Accept the activity details: prospect name, company, action type, date/time, and notes.
2. Generate a unique activity key: `{prospect_email}:{action_type}:{date}` (e.g., `alex@stackline.com:email_sent:2026-06-12`).
3. Check `session-log.md` for an existing entry with this key. If found, return: "DUPLICATE — activity already logged" and stop.
4. Write the structured log entry (see Output Format).
5. Append the entry to `session-log.md`.
6. Return the entry with a CRM update summary.

## Output Format

```
## [YYYY-MM-DD HH:MM]

**Prospect:** [Name, Title, Company]
**ICP Score:** [score if known]
**Action:** [Email Sent / Call Completed / Meeting Held / Reply Received / Sequence Updated]
**Status:** [DRAFT / APPROVED / SENT / REPLIED / MEETING BOOKED / CLOSED-LOST / CLOSED-WON]
**Trigger Used:** [trigger referenced in outreach, if applicable]
**Notes:** [outcome summary, key quote, next step, risks]
**Activity Key:** [hash for duplicate check]
```

## Example

**Input:** "Logged a 25-minute discovery call with Maria Santos at Growfast. She's interested but needs to loop in her VP of Sales. Follow up in 5 days with case study."

```
## 2026-06-12 14:35

**Prospect:** Maria Santos, VP RevOps, Growfast
**ICP Score:** 90/100 — GO
**Action:** Call Completed
**Status:** MEETING HELD — warm
**Trigger Used:** Series B funding (8 weeks ago)
**Notes:** 25-min discovery. Interested; needs VP Sales alignment. Requested relevant case study. Follow up 2026-06-17 with customer story from similar RevOps context.
**Activity Key:** maria.santos@growfast.com:call_completed:2026-06-12
```

---
