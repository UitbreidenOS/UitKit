---
name: email-personalizer
description: Writes one personalized cold email from a completed account research brief. References a specific trigger from the last 90 days in the first two sentences. Under 120 words. Ends with a low-friction question CTA. Returns the draft for human approval — never sends. Flags banned words before output.
allowed-tools: Read, Write
effort: medium
---

# Email Personalizer

## When to activate
After completing account research and confirming GO or CAUTION ICP score. Use this to generate the first-touch email in a sequence. Also use to rewrite a failed email after a human requests changes.

## When NOT to use
Do not use before running account research — there must be a research brief with a specific trigger to reference. Do not use for follow-up emails in an existing sequence (use follow-up-scheduler instead). Do not use if the prospect is on an opt-out list.

## Instructions

1. Read the account research brief for this prospect. Identify the strongest trigger from the last 90 days (funding, exec hire, product launch, press mention, job posting signal).
2. Identify the prospect's likely pain point based on their role, company stage, and tech stack.
3. Write the email following these rules:
   - **Subject line:** Specific to the trigger or their current context. Not "Quick question" or "Re: [Company]". Max 7 words.
   - **First sentence:** States a business observation tied to the trigger. Never "My name is" or "I hope you're well."
   - **Trigger reference:** Within first two sentences.
   - **Value prop:** One sentence. Result-focused, not feature-focused. With proof if available.
   - **CTA:** A specific low-friction question. "Worth a 20-minute call Thursday?" not "Let me know if you'd like to connect."
   - **Total length:** Under 120 words.
   - **Tone:** Direct, human, not salesy.
4. Check output against banned words list in CLAUDE.md. Flag any violations before returning.
5. Return draft with metadata header (see Output Format). Mark status as PENDING APPROVAL.

## Output Format

```
EMAIL DRAFT — PENDING APPROVAL
Prospect: [Name, Title, Company]
ICP Score: [X]/100
Trigger: [specific trigger referenced]
Word Count: [X]/120

---
Subject: [subject line]

[Email body]

[Sender name]
[Title]
[Company]
---

Banned word check: PASS / FAIL ([flagged words if any])
Next: Human review required before send.
```

## Example

**Input:** Alex Kim, CTO, Stackline (Series A, 85 employees, launched new API product 6 weeks ago, uses AWS + GitHub + Datadog + PagerDuty)

```
EMAIL DRAFT — PENDING APPROVAL
Prospect: Alex Kim, CTO, Stackline
ICP Score: 85/100 — GO
Trigger: New API product launch (6 weeks ago)
Word Count: 97/120

---
Subject: Stackline's API launch + developer onboarding

Six weeks after launching your new API, the #1 support volume spike is usually authentication edge cases and rate limit confusion.

We help API-first teams cut developer onboarding time by 40% with interactive docs and sandbox environments — Stripe and Twilio both used this pattern post-launch.

Worth a 20-minute call this week to see if it fits where you are?

[Sender name]
[Title]
[Company]
---

Banned word check: PASS
Next: Human review required before send.
```

---
