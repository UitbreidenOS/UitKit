---
name: dental-practice
description: - You run a solo or small group dental practice and the front desk is drowning in operational follow-up
updated: 2026-06-13
---

# Dental Practice

## When to activate
- You run a solo or small group dental practice and the front desk is drowning in operational follow-up
- Recall scheduling has fallen behind — patients who should be on a 6-month cadence are at 9+ months without booking
- Treatment plan acceptance is below 50% and you want a structured follow-up sequence for unaccepted plans
- Insurance verification eats 4-8 hours per week of front-desk time
- You're launching a new service (clear aligners, sleep dentistry, cosmetic) and need patient education and outreach copy

## When NOT to use
- You have a dedicated office manager or practice administrator who already owns these workflows efficiently
- Your PMS (Dentrix, Eaglesoft, Open Dental) already runs a robust automated recall and follow-up system that you trust
- The work touches clinical decisions — Claude is for the administrative wrapper around treatment, not for treatment itself

## Instructions

### Step 1: Set up your practice context

Say:

"I run a [solo / group] dental practice in [city]. We have [N] operatories and [N] hygienists. Our patient mix is [insurance-heavy / fee-for-service / mixed]. Our brand voice is [warm-and-clinical / family-friendly / premium / no-nonsense]. Our most common service mix is [routine recall, restorative, cosmetic, ortho, etc. — with rough percentages]. Our biggest service we're trying to grow is [name]."

### Step 2: Run recall outreach on the backlog

The single highest-ROI dental skill workflow is recall recovery. Most practices have 80-200 patients who are past due on their 6-month recall but haven't been actively pursued.

Say:

"Here are 50 patients past due on recall. For each, draft a personalized outreach message that references their last visit date, the service they had, the recommended next visit, and offers two specific appointment slots."

Claude produces 50 personalized messages. Your front desk sends them in batches, runs a 3-touch sequence (initial outreach, 1-week follow-up, 3-week final), and tracks bookings. Typical recovery: 25-40% of past-due patients schedule within 30 days.

### Step 3: Treatment plan follow-up

Treatment plans not accepted in the chair are usually lost forever unless followed up. Most practices don't have a structured follow-up flow.

Say:

"This patient was presented a $2,400 treatment plan for [crown / implant / quadrant restoration] on [date] but didn't schedule. They expressed concern about [cost / time / dental anxiety]. Draft a follow-up message that addresses the concern, offers financing options if relevant, and proposes a next step."

The skill works best when paired with a written treatment plan that includes the doctor's notes on the patient's objection. Personalized follow-up converts at 2-4x the rate of generic "let's schedule that treatment" reminders.

### Step 4: Insurance verification triage

Insurance verification is mechanical but consumes front-desk hours. Claude structures the work:

Say:

"For tomorrow's 8 new patients, here are the insurance details. Generate a structured verification checklist for each — what to confirm with the carrier, expected benefit categories, deductible status, and common gotchas for this carrier."

The verification calls still happen with the carrier (insurance APIs are spotty in dental). But your front desk arrives at each call with a structured checklist and writes the answer back into Claude for downstream use in treatment planning conversations.

### Step 5: New service launch

When the practice is launching a new service (clear aligners, sleep apnea, in-house membership plan):

Say:

"I'm launching [service] in [month]. The service is for patients who [persona / use case]. Pricing is [$X]. Draft: (1) the patient-education sheet, (2) the in-office announcement email to existing patients, (3) the website service-page copy, (4) the consultation script for the doctor and the consult coordinator."

You get a coordinated package. Review, run through your compliance review (any claims about outcomes need a doctor read), and deploy.

### Step 6: No-show and cancellation recovery

Same pattern as the salon recovery sequence, calibrated to a dental context. The economics are different — a same-day no-show in dental can be $200-500 in lost revenue, and the practice's chair time can't be resold the way a haircut can. The recovery sequence is more direct:

Touch 1 (same day): warm check-in.
Touch 2 (48 hours): a specific rebook offer with two open slots.
Touch 3 (7 days): direct ask plus the rationale for staying on the recall cadence.

## Example

You run a 3-operatory family practice. You have 1,400 active patients. About 220 are past due on their 6-month recall — meaning they're at 9+ months since last hygiene visit, and your front desk hasn't actively reached out in 60+ days.

You ask Claude to draft personalized outreach for the first 50 (sorted by last-visit recency — most-recent first). Each message references the patient's last visit date and offers two slots.

You send the first batch on a Tuesday morning. By Friday, 18 patients have replied. 12 schedule. That's $1,800-2,400 in recovered hygiene revenue (and the downstream treatment that comes from chair time you wouldn't have had).

You run a second batch the following Tuesday. Same pattern. Over four weeks, you recover roughly 35% of the past-due backlog — 78 patients scheduled who otherwise would have drifted further.

The recovered revenue in month one: $11-15K. The time investment: about 2 hours of front-desk review and outreach time spread across the month. The Claude skill paid for itself many times over in the first 30 days.

You then set this up as a permanent monthly rhythm. The backlog never grows past 40-50 patients again.
