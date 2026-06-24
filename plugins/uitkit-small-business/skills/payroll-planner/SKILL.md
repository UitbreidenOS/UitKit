---
name: "payroll-planner"
description: "- You are 1-2 weeks out from payroll and want to confirm the money is there before it hits"
---

# Payroll Planner

## When to activate
- You are 1-2 weeks out from payroll and want to confirm the money is there before it hits
- Cash feels tight and you are not sure if you can cover both bills and payroll this cycle
- A new hire is joining and you need to recalculate your runway with the higher payroll amount
- End of quarter planning — you want a 90-day cash picture, not just the next 30 days

## When NOT to use
- You have a full-time CFO or bookkeeper managing cash flow — this is their job, not Claude's
- Your payroll amount changes every cycle in complex ways (commissions, variable pay) and you have not yet stabilized the numbers — get actual numbers first, then use this skill
- You need to make payroll processing decisions (tax withholding, benefits deductions) — use your payroll provider (Gusto, ADP, Paychex) for those, not Claude

## Instructions

### What to give Claude

You need five things. All of them you should know off the top of your head or in under 5 minutes from your bank and QuickBooks:

1. Current bank balance (checking account your payroll pulls from)
2. Next payroll date and the exact payroll amount
3. Open invoices: who owes you money, how much, and when you realistically expect each to arrive
4. Recurring bills due in the next 30 days: rent, software subscriptions, vendor payments — amounts and due dates
5. Any known irregular expenses coming up: equipment purchase, insurance renewal, tax payment

### Step 1: Build the 30-day cash timeline

Tell Claude all five numbers. Ask:

"Build me a 30-day cash view starting today. Show the balance going up when invoices arrive and going down when bills and payroll hit. Show me the lowest point."

Claude produces a day-by-day cash picture and marks the tightest day:

"Day 11 is your low point — $3,800 in the bank before the Peterson invoice clears on day 13. Payroll on day 15 is $18,500. You have $2,200 of cushion if Peterson pays on time. If they are 3 days late, you have a $14,300 gap."

### Step 2: Rank overdue invoices by urgency

If you have any invoices past due or at risk of delay, ask Claude to rank them. Say:

"I have three overdue invoices. Tell me the order I should chase them in and what I should say."

Claude ranks by dollar impact on the payroll gap, not just days overdue. A $9,000 invoice 5 days late matters more than a $400 invoice 45 days late if payroll is in 2 weeks.

Claude also drafts the outreach: a direct collection call script for your highest-priority invoice, and shorter email follow-ups for the rest.

### Step 3: Generate the payroll checklist

Ask Claude: "What do I need to do before payroll runs on the 15th?"

Claude generates a checklist matched to your payroll provider (Gusto, ADP, Paychex, QuickBooks Payroll). Typical items:

- Confirm employee hours submitted and approved
- Verify new hire information is entered (if applicable)
- Confirm bank account on file has sufficient funds by the processing cutoff
- Submit payroll by the provider's deadline (usually 2 business days before pay date)
- Download the payroll summary for your records

### Step 4: Handle a shortfall

If the timeline shows a gap, do not guess at solutions. Tell Claude exactly what the shortfall is and ask for options. Claude will suggest specific actions ranked by speed and cost:

- Which specific invoice to call on first and what to say to get it paid this week
- Which bills can be delayed without penalty (most vendors allow 5-7 days with a call)
- Whether a business line of credit draw makes sense for this specific gap and amount
- What discretionary spend to hold until after payroll clears

Claude will not tell you to "explore financing options" in the abstract — it will say "hold the $1,400 software renewal until the 16th and call Peterson today. That closes your gap."

### Monthly cadence

Run this skill once a month, the first Monday after the prior month closes. Takes 10 minutes and eliminates cash surprises. Combine with the Month-End Close skill for the full picture.

## Example

You say: "Payroll is $18,500 on the 15th. Bank balance today is $22,000. I have three invoices: $8,000 from Atlas Group due the 10th, $4,500 from Reyes Construction due the 20th, $6,000 from Johnson that is 30 days overdue and they have not responded. Bills this month: $2,200 rent on the 1st (already paid), $800 in software due the 8th, $1,100 insurance due the 18th."

Claude outputs:

Cash timeline:
- Today: $22,000
- Day 8: -$800 software → $21,200
- Day 10: +$8,000 Atlas Group → $29,200 (if on time)
- Day 15: -$18,500 payroll → $10,700
- Day 18: -$1,100 insurance → $9,600
- Day 20: +$4,500 Reyes → $14,100

Tightest point: Day 14, the day before payroll. If Atlas Group pays on time, you have $21,200 going into payroll — comfortable. If Atlas delays by 5+ days, you drop to $13,200 before payroll hits, which still clears but leaves $5,300 after payroll before any other income. Watch Atlas closely.

Johnson ($6,000 overdue): call today. Claude drafts a 3-sentence call script: "Hi, this is [name] from [company]. I'm calling about the $6,000 invoice from [date] that's 30 days past due. Can you confirm the status and give me a payment date I can put in my records?"

Payroll is safe as long as Atlas pays by the 13th. No shortfall risk today — but Johnson is the buffer. Collect Johnson before the 13th and you have $27,200 going into payroll.
