---
name: lead-triager
updated: 2026-06-13
---

# Lead Triager

## When to activate
- New contacts came in from a form submission, event, or campaign and you need to know who to call first
- Weekly lead review — you want a prioritized call list before the week starts
- Preparing for a sales call blitz and your CRM is cluttered with unqualified contacts
- You want to stop guessing which leads are worth your time and start working a ranked list

## When NOT to use
- You already have a dedicated sales team with a formal lead scoring system in place — they should own this
- Your pipeline has fewer than 5 leads — at that volume, just call them all
- Leads require deep technical qualification that only a domain expert can assess

## Instructions

### Step 1: Define your Ideal Customer Profile once

Before scoring anything, tell Claude exactly who you are looking for. Do this once and save the output — you reuse it every week.

Say:

"My ideal customer is a company with 25-150 employees in the logistics or distribution industry. The decision-maker is usually a VP of Operations or COO. Pain signals are manual reporting, high staff turnover, or recent funding. Companies that are too small (under 10 employees) or consumer-facing are not a fit."

Claude will confirm the criteria back to you and flag any gaps. You now have your ICP template.

### Step 2: Feed Claude your unscored contacts

Paste from HubSpot, copy from a CSV, or just describe them. The minimum you need for each lead:

- Company name and website
- Contact name and role
- How they found you (webinar, referral, paid ad, cold outreach)
- Any form answers or notes they left

You do not need clean formatting. Messy is fine.

### Step 3: Get scores and explanations

Claude scores each lead 1-10 against your ICP criteria, explains the score in one sentence, and flags the top 3 as "prioritize now."

Example output from Claude:

- Acme Corp — 9/10. VP of Operations at a 50-person SaaS company. Mentioned "manual reporting" on the form. Strong ICP match. Prioritize now.
- Blue River Retail — 4/10. Retail-facing, 8 employees. Outside your ICP on size and industry. Nurture only.
- Meridian Logistics — 7/10. Right industry and size. Role is unclear — contact is "Office Manager," not a decision-maker. Enrich before calling.

### Step 4: Get enrichment summaries for hot leads

For any lead scored 7 or higher, ask Claude:

"Draft a 2-paragraph enrichment summary for Acme Corp — what they do, their likely pain point based on their form answer and website, and a suggested opening line for the first call."

Paste this summary directly into HubSpot Notes. You walk into the call already prepared.

### Step 5: Handle cold leads without wasting time

For leads scored 4 or below, ask Claude to draft a polite nurture email that moves them into a drip sequence. You are not closing them out — you are putting them somewhere useful.

### Weekly rhythm

Paste your full new leads list every Monday. Claude outputs your prioritized call list and notes in under 2 minutes. Combine with the Monday Brief skill for a complete weekly start.

### Integrations

- HubSpot: copy scores and summaries into Notes and Lead Score fields manually
- LinkedIn: give Claude the prospect's LinkedIn URL or describe their recent activity for richer enrichment
- Gmail: paste the drafted outreach emails directly into a new compose window

## Example

You paste 8 new leads from a webinar you ran last week on supply chain efficiency.

You say: "Here are my 8 new webinar leads. My ICP is 25-150 employee logistics and distribution companies, decision-maker is VP Operations or COO, pain signals are manual reporting and high turnover. Score them and flag the top 3."

Claude ranks all 8, explains each score, and flags the top 3:

1. Acme Corp — 9/10. 50-person SaaS company, VP of Operations, answered "we still do all reporting in spreadsheets" on the form. Exact ICP match. Claude drafts a 3-sentence personalized first email: "Your webinar answer about spreadsheet reporting caught my eye — that's exactly the problem we solve for ops teams your size. We helped a similar company cut their reporting time by 6 hours a week. Worth a 20-minute call to see if we can do the same for you?"

2. Harbor Freight Distribution — 8/10. Right industry, 90 employees, COO registered. No form answer — Claude suggests enriching via their LinkedIn job posts before calling.

3. Clearview Logistics — 7/10. Good fit on size and industry. Contact is a Senior Manager, not VP — Claude flags this and suggests confirming the decision-maker before spending time on the call.

Total time from paste to prioritized list: under 3 minutes.
