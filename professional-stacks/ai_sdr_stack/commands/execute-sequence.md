---
description: Stage the next email in a prospect's sequence for human review and approval. Shows the full draft with trigger reference, ICP score, and word count. Nothing sends until human approves.
---

# /execute-sequence

## What This Does
Generates the next outbound email for a prospect based on where they are in the sequence (initial, Day 3, Day 7, or Day 14). Runs the appropriate skill (email-personalizer or follow-up-scheduler), applies the output-review checklist, and presents the draft for human approval.

## Steps Claude Follows
1. Ask for: prospect name, company, and current sequence position (initial / day-3 / day-7 / day-14).
2. Confirm the prospect is NOT on an opt-out list (check session-log.md for unsubscribe flag).
3. Read the account research brief and previous email history from session-log.md.
4. Run the appropriate skill:
   - Initial → email-personalizer
   - Day 3/7/14 → follow-up-scheduler
5. Run internal review: check banned words, word count (<120 for initial, <80 for follow-ups), trigger specificity, CTA format.
6. Present the draft with metadata (see Output Format).
7. Wait for human: APPROVE, EDIT, or REJECT.
8. On APPROVE: log to session-log.md with APPROVED status. Human sends via their own client.
9. On EDIT: apply human edits, re-run review, re-present for approval.
10. On REJECT: log reason, do not send, ask if sequence should be paused.

## Output Format

```
SEQUENCE EMAIL — PENDING APPROVAL
Prospect: [Name, Title, Company]
Sequence position: [Initial / Day 3 / Day 7 / Day 14]
ICP Score: [X]/100 — [GO/CAUTION]
Trigger: [specific trigger referenced]
Word count: [X]/[limit]
Banned word check: PASS/FAIL

---
Subject: [subject line]

[Email body]

[Sender signature]
---

Review checklist:
[✓/✗] Trigger referenced in first 2 sentences
[✓/✗] Word count under limit
[✓/✗] CTA is specific and low-friction
[✓/✗] No banned words

APPROVE / EDIT / REJECT?
```

## Notes
- This command will not proceed if the prospect has replied to any previous touch.
- The human sends via their own client. Claude never sends directly.
- Every approval is logged with timestamp to session-log.md.
