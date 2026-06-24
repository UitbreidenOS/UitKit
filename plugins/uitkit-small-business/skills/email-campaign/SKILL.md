---
name: "email-campaign"
description: "Email marketing for small businesses: campaign structure, subject lines, copy variants by segment, A/B test setup, re-engagement sequences, and performance analysis"
---

# Email Campaign

## When to activate
- Planning a promotional campaign and need to reach different customer segments with different messages
- Your email open rates are below 20% and you want to understand why and fix it
- You have a list of inactive subscribers and need a re-engagement sequence before your next campaign
- You want to set up an A/B test but are not sure what to test or how to read the results

## When NOT to use
- Email platform configuration, automation setup, or template design — use your ESP (Klaviyo, Mailchimp, ActiveCampaign) documentation for that
- List growth strategy — this skill handles what to send, not how to grow the list
- Transactional emails (order confirmations, password resets) — those have different compliance requirements and belong in your platform's flow builder

## Instructions

### Campaign planning

Before writing a single word, define the campaign structure. Tell Claude:
- The offer or news you want to communicate (be specific — "20% off all footwear this weekend" is usable; "we have a sale" is not)
- Your list segments (new subscribers, recent purchasers, lapsed customers, VIPs, etc.)
- The campaign goal — one goal, not three (drive purchases, book appointments, get RSVPs, announce news)
- Your timeline (launch date, end date if it is a sale)
- How many emails you are willing to send for this campaign (most small business campaigns are 2-3 emails)

Claude builds the campaign map: which emails go to which segments, what each email's job is, suggested send times based on your audience type, and the sequence logic (e.g., "email 2 goes only to openers of email 1, or to everyone?").

---

### Subject lines

Subject lines determine open rate more than any other factor. Tell Claude:
- The content of the email
- The audience segment
- The campaign goal
- Your brand tone (playful, direct, warm, professional)

Claude generates 8 subject line options across four styles:
- 2 direct: plain statement of the offer or news
- 2 curiosity-driven: open a loop the email closes
- 2 urgency-based: deadline or scarcity framing (only use these if the urgency is real)
- 2 benefit-focused: lead with what the reader gains

Claude flags which two to A/B test. Usually the most straightforward direct option versus the strongest curiosity or benefit option. Do not test two similar styles — test genuinely different approaches to learn something useful.

Benchmarks: open rates above 20% are healthy for most small businesses. Above 28% is strong. Below 15% means your subject lines or sender reputation needs work. If your list has not been cleaned in over 12 months, low open rates may be a deliverability problem, not a copy problem.

---

### Email copy

One email, one job. Tell Claude:
- The subject line you chose
- The audience segment and what they know about you
- The offer or message
- The single call to action (one link or button, not three)

Claude writes three sections:

**Hook** — the first 1-2 sentences of the email body. This is what appears in the preview pane next to the subject line. It must earn the click. Claude writes it to continue the subject line's momentum, not repeat it.

**Body** — 3-4 short paragraphs. Most small business emails are read in under 30 seconds. Claude writes for scanners: short paragraphs, concrete language, no filler.

**CTA** — one clear action with specific button or link text. "Shop the sale" is better than "Click here." "Book your free call" is better than "Learn more."

Segment variants: loyal customers get appreciation framing ("You've been with us since the beginning, so you get early access..."). New subscribers get benefit framing ("Here's what we promised when you signed up..."). Lapsed customers get honest re-engagement framing ("It's been a while. Here's what's changed.").

---

### A/B test setup

Tell Claude what you want to test. One variable per test — testing subject line versus CTA in the same test tells you nothing.

Good things to test for small business email lists:
- Subject line (most impactful, affects open rate)
- CTA text (affects click rate)
- Email length — short (150 words) versus medium (350 words)
- Send time — Tuesday morning versus Thursday afternoon

Claude writes both variants and tells you: what is different between them, what metric to watch, what sample size you need to see a meaningful result, and how long to run the test before reading it.

After the test: paste your results (Variant A open rate X%, Variant B open rate Y%, send size Z). Claude tells you what the results mean, whether the difference is meaningful or noise, and what to do next.

---

### Re-engagement sequences

For subscribers who have not opened in 90 or more days.

Tell Claude: your list size, how many are inactive (90+ days no open), what you last sent them, and what your business offers now that is worth re-engaging for.

Claude writes a 3-email sequence:

**Email 1 — "Still there?"** Acknowledge the silence, offer something genuinely useful (a free resource, early access, a relevant update). No guilt, no manipulation.

**Email 2 — Value reminder.** What they signed up for and why it is still worth being on your list. One concrete proof point: a recent customer result, a popular piece of content, a product they might have missed.

**Email 3 — Final opt-out offer.** Honest framing: "If this isn't relevant anymore, no hard feelings — unsubscribe below. If you'd like to stay, you don't need to do anything." This is the sunset step.

After the sequence: tell Claude how many re-engaged (opened or clicked any of the 3 emails). Claude drafts the final message for everyone who did not — a clean unsubscribe confirmation. Removing inactive subscribers improves deliverability for everyone else.

---

### Performance analysis

After a campaign, paste your stats: send size, open rate, click rate, unsubscribe rate, revenue generated (if trackable). Tell Claude what you expected.

Claude tells you:
- Whether each metric is above or below benchmark for your industry and list size
- What the pattern means (high open, low click = subject line working but email not delivering; low open, high click among openers = subject line problem, not copy problem)
- One specific thing to change in your next campaign based on the data

---

### Prompt template — campaign

```
Please plan a [X]-email campaign.

Offer: [specific offer, with dates if applicable]
Goal: [one goal]
Segments:
- [Segment 1]: [size, relationship to your business]
- [Segment 2]: [size]

Timeline: [launch date] to [end date]
Brand tone: [playful/direct/warm/professional]

Please give me:
1. Campaign map (which email goes to which segment, in what order)
2. 8 subject line options for the first email (2 direct, 2 curiosity, 2 urgency, 2 benefit)
3. Flag which 2 to A/B test
4. First email draft for [primary segment]
```

## Example

A women's boutique runs a 3-day summer sale. The owner tells Claude the offer (25% off all summer dresses), the list (2,400 total: 800 purchased in last 60 days, 1,100 purchased 61-180 days ago, 500 inactive 180+ days), and the goal (drive purchases before the sale ends Sunday).

Claude builds:

Campaign map: Email 1 (Thursday, full list) — sale announcement, all segments. Email 2 (Friday, openers of email 1 only) — highlight best sellers with social proof. Email 3 (Sunday morning, non-purchasers who opened either email) — last chance, end-of-day urgency.

Subject lines for Email 1 (direct): "25% off summer dresses — this weekend only." (Curiosity): "Your closet is missing something." (Urgency): "3 days. 25% off. No code needed." (Benefit): "The dress you've been watching just got cheaper."

A/B test recommendation: "25% off summer dresses — this weekend only" versus "The dress you've been watching just got cheaper" — direct versus benefit framing.

Results after running the campaign: 31% open rate on Email 1, 8.2% click rate, $4,100 in revenue tracked to the campaign. Previous campaigns averaged 19% open and 4.1% click. Claude analysis: the benefit-framing subject line outperformed the direct version by 4 percentage points in open rate — use benefit framing as the default for promotional campaigns going forward.

---
