---
name: meeting-confirmator
description: Writes a meeting confirmation message for a booked discovery call. Includes agenda (3 items), dial-in details placeholder, pre-read link if available, and a 1-sentence prospect context reminder. Personalized to the prospect's trigger and company context. Under 100 words excluding logistics.
allowed-tools: Read, Write
effort: low
---

# Meeting Confirmator

## When to activate
After a discovery call is booked — either by calendar link acceptance or verbal confirmation in email. Use this to write the confirmation message that goes out 24 hours before the call.

## When NOT to use
Do not use before a meeting is confirmed. Do not use for internal meetings or recurring syncs.

## Instructions

1. Read the account research brief and the reply thread that led to the booking.
2. Write a confirmation message with:
   - Opening: acknowledge the confirmed meeting, date, and time.
   - Agenda: 3 specific items tailored to the prospect's context — not generic "intro + demo + Q&A."
   - Logistics: dial-in link placeholder, duration reminder.
   - Pre-read: include one relevant resource if available (case study, product overview).
   - Closing: one sentence reinforcing why this is worth their time — tied to their trigger.
3. Keep the body under 100 words (excluding logistics block).
4. Return as PENDING APPROVAL.

## Output Format

```
MEETING CONFIRMATION — [Prospect Name]
Status: PENDING APPROVAL

---
[Prospect first name] — confirmed for [day], [date] at [time] [timezone].

Agenda (25 min):
1. [Context-specific item 1]
2. [Context-specific item 2]
3. [Questions / next steps]

Dial-in: [CALENDAR LINK / ZOOM LINK — add before sending]
Duration: 25 minutes

[Optional: Pre-read — one sentence + link]

[Closing line tied to their trigger]

[Sender name]
---
```

## Example

```
MEETING CONFIRMATION — Alex Kim, CTO, Stackline
Status: PENDING APPROVAL

---
Alex — confirmed for Thursday, June 19 at 2pm PT.

Agenda (25 min):
1. Where you are in the API launch and current developer onboarding friction
2. How teams at your stage use interactive docs to cut support volume
3. Whether there's a fit and what a pilot would look like

Dial-in: [ADD ZOOM LINK]
Duration: 25 minutes

Pre-read: How Stripe reduced developer support tickets 52% post-launch (2 min read): [link]

Looking forward to it — good timing given the recent launch.

[Sender name]
---
```

---
