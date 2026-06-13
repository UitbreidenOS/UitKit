---
name: invoice-chaser
description: "Automate accounts receivable: draft overdue reminders, escalation sequences, late payment risk flags — for QuickBooks, Stripe, or any invoicing tool"
updated: 2026-06-13
---

# Invoice Chaser Skill

## When to activate
- You have overdue invoices and need to write follow-up messages
- Setting up a multi-touch reminder sequence for late payers
- Identifying which clients are at risk of not paying
- Drafting escalation emails when a client goes silent
- Summarising your outstanding AR position

## When NOT to use
- Invoices less than 7 days overdue — too early, damages relationships
- Disputes where the client has raised a valid issue — resolve first
- Legal/collections proceedings — this is for pre-legal outreach only

## Instructions

### Tell Claude your situation

Just describe it in plain English:

```
I have 3 overdue invoices:
- Acme Corp: $4,200 — 14 days overdue
- Smith & Co: $850 — 32 days overdue  
- Blue Sky Ltd: $12,000 — 45 days overdue, no response to last 2 emails

Draft appropriate follow-up messages for each.
```

Claude will:
- Write tone-appropriate messages (gentle reminder at 14 days, firmer at 32, formal notice at 45)
- Reference the specific amount and days overdue
- Include a clear call to action (pay now / confirm receipt / contact us)
- Suggest the right next step for each overdue level

### The escalation ladder

| Days overdue | Tone | Action |
|---|---|---|
| 1–14 | Friendly reminder | "Just checking in — did this get lost?" |
| 15–30 | Polite follow-up | "This is now X days overdue, please advise" |
| 31–60 | Firm notice | "Payment is required within 7 days to avoid late fees" |
| 60+ | Formal demand | "Notice of overdue payment — action required" |
| 90+ | Pre-collections | "Final notice before referral to collections" |

### Setting up a sequence

```
I want to set up an automatic 4-touch sequence for any invoice that goes unpaid:
- Day 3 after due: gentle reminder
- Day 14: follow-up with pay link
- Day 30: firm notice mentioning late fee policy
- Day 45: final notice before collections

Write templates for all 4 stages. My company is a web design studio, average invoice is $2,000–$8,000.
```

### Analysing your AR position

```
Here are my outstanding invoices from QuickBooks [paste or describe]:
- Client A: $X, due date, last contact
- Client B: $X, due date, last contact

Categorise by risk (low/medium/high), total outstanding, and recommend priority actions.
```

### Extracting from QuickBooks

```
I exported this from QuickBooks [paste the data].
Which invoices need immediate attention? 
Draft reminder emails for anything over 30 days.
```

## Example

**You say:**
```
Client: Johnson Consulting
Invoice: $6,500 for website redesign
Due: 28 days ago
Previous contact: Sent invoice, no response since
My tone: professional but firm
```

**Claude produces:**
```
Subject: Invoice #1042 — Payment Due ($6,500)

Hi [Name],

I hope this finds you well. I'm following up on Invoice #1042 for $6,500, 
which was due on [date] and is now 28 days overdue.

I understand things get busy — please let me know if you have any questions 
about the invoice or if there's an issue I can help resolve. 

If payment has already been sent, please disregard this message and share 
the reference number so I can update my records.

You can pay online here: [payment link]

Thank you for your prompt attention.
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
