---
name: "trigger-finder"
description: "Daily prospecting workflow when building event-triggered sequences, prioritizing who to contact in the next 24 hours, or operationalizing buying in..."
---

# Trigger Finder

## When to activate
Daily prospecting workflow when building event-triggered sequences, prioritizing who to contact in the next 24 hours, or operationalizing buying intent signals into a repeatable outreach cadence.

## When NOT to use
Cold outreach where no trigger exists — use Personalization skill instead for static ICP outreach. Do not use Trigger Finder for warm inbound leads (they already have intent) or account-based sales where relationships are pre-established.

## Instructions

### The 4 Trigger Categories

**1. Company Events** — direct organizational shifts that create budget and urgency
- Funding rounds (Series A/B/C, seed) — capital influx triggers hiring, tool expansion, infrastructure overhaul
- Hiring spree (job postings 3+ roles in 90 days) — new team = new tool budgets, skill gaps, process bottlenecks
- M&A activity (acquisition or being acquired) — integration challenges, system consolidation, legacy platform replacement
- Leadership change (new CTO, VP Engineering, CMO) — new executives bring fresh vendor relationships and mandate to improve under their watch

**2. Behavioural Signals** — intent-revealing activities that indicate active evaluation
- Content downloads (whitepapers, guides, ROI calculators) — self-education phase, comparing options
- Webinar/demo attendance (your competitors' events, industry conferences) — shopping mode, benchmark gathering
- Review site activity (G2, Capterra, Trustpilot — site visits, comparison views, demo requests) — late-stage evaluation
- Job postings mentioning skill gaps or new initiatives — hiring for capabilities they don't have in-house

**3. Tech Stack Changes** — platform adoption and churn that reveal spend and priority shifts
- New tool installs (via BuiltWith, LinkedIn job postings that mention "experience with X") — active stack expansion, budget allocated
- Competitor tool removal/discontinuation announcements — active replacement search underway
- Competitor adoption by their peers (case study visibility, social proof erosion) — FOMO, fear of being left behind
- Stack consolidation or modernization initiatives (gleaned from job postings, LinkedIn content, engineering blogs) — platform rationalization = RFP window

**4. External Events** — macro triggers that shift buying urgency at scale
- Regulatory change (GDPR, SOC2, data residency laws, AI compliance) — forced compliance spend
- Competitor failure or market contraction — trust loss, alternative-seeking behavior
- Market shift or industry disruption (AI, API-first, serverless adoption) — category creation, new category adoption

### Signal Sources: The Stack

**Free or low-cost sources:**
1. **LinkedIn** (free) — job postings, company updates, leadership changes, founder posts about funding
2. **G2/Capterra** (free) — competitor review activity, download counts, demo request spikes
3. **Crunchbase** (free tier, alerts via email) — funding announcements, hiring data, company news
4. **BuiltWith** (free/paid) — identify who uses specific tech, set up tracking for competitors or ICP profiles
5. **Google Alerts** (free) — set up alerts for companies, competitors, regulatory keywords, industry terms
6. **Job posting aggregators** (free: LinkedIn, Indeed, Ashby) — proxy for hiring velocity, pain points, budget direction
7. **Company careers page** (free) — active hiring sprees, new team formation
8. **Zapier/Make templates** (paid, $10–50/mo) — automate daily signal collection into your CRM

**Premium sources** (optional for at-scale operations):
- Apollo.io, Hunter.io, or ZoomInfo — trigger alerts, intent data overlays
- 6sense, Demandbase, Terminus — account-level intent signals

### Trigger Scoring Framework

Assign each signal a score that determines speed of response:

**High (Act within 24 hours)**
- Active funding announcement (within 7 days)
- Job posting explicitly mentioning your product category or competitive gap
- G2 competitor review (demo request, moving reviews, follow-up activity)
- Leadership change in target role (CTO, VP Eng, CMO)
- Company news about product pivot, expansion, or M&A (acquired or acquiring)

**Medium (Act within 1 week)**
- Content download from your site or competitor's site
- Webinar attendance (your own or competitor events)
- Hiring 2+ roles that suggest capability gaps
- Tech stack change indicating modernization initiative
- Regulatory announcement affecting their industry

**Low (Park for future sequence)**
- General job posting (not role-specific pain point)
- Quarterly earnings mention of strategic initiative
- Peer adoption (interesting but not direct intent)
- Industry trend (macro, not company-specific)
Score low signals and add to a nurture sequence; revisit if a higher-score trigger appears.

### The Trigger Message Formula

Your opening message must contain exactly three elements in this order:

1. **[Name the specific trigger]** — Be explicit about what you observed
   - ✓ "I saw your Series B announcement last Tuesday"
   - ✗ "I noticed you're growing"

2. **[Why it matters to them specifically]** — Connect the trigger to a concrete business impact
   - ✓ "Series B typically means 2–3 new hiring goals, and that's where onboarding friction kills velocity"
   - ✗ "Series B companies need to scale"

3. **[One question]** — Open-ended, not a yes/no, that invites them to share their specific challenge
   - ✓ "What's the biggest pain in onboarding your new hires right now?"
   - ✗ "Are you interested in better onboarding?"

**Example formula in action:**
> "Hi [Name], I saw that [Company] just closed your Series B — congrats. Most teams in your position struggle with onboarding new engineers quickly, which delays TTM. What's been the bottleneck for you?"

### Building Your Trigger Monitoring Stack

**Daily workflow:**
1. Each morning, run queries across your sources (or set up Zapier/Make automations to run overnight)
2. Collect signals into a single intake document or CRM view
3. Score each signal (high/medium/low)
4. Route high-score signals to your daily outreach list
5. Add medium and low signals to your CRM with a 7–14 day follow-up date

**Automation pattern (Zapier/Make):**
- Trigger: "New job posting matching keywords [your ICP]" OR "Funding announcement for [company list]" OR "G2 review posted on [competitor]"
- Action: Create a new row in your CRM (Salesforce, HubSpot, Pipedrive) with signal type, score, date, and link
- Frequency: Daily 8 AM your time
- Cost: ~$20–50/month for a 3–5 trigger automation

**Sample Zapier setup:**
1. LinkedIn job posting trigger → Filter for keywords ("hiring," "engineer," "full-stack") + company ICP
2. Crunchbase funding trigger → Add "Series A, B, C" filter
3. Action: Create/update deal in HubSpot with pipeline "Trigger Queue," set score tag
4. Notification: Slack daily digest of high-score signals for your team

### The 14-Day Decay Window

**Critical rule: Most triggers lose relevance after 14 days.**

- A funding announcement on Day 1 is fresh and urgent (budget is being allocated)
- By Day 14, procurement cycles have tightened; by Day 30, the window has closed
- Job postings peak in relevance during weeks 2–3 (active recruiting, unfilled positions = pain)
- Leadership changes are highest intent on days 1–7; after 30 days, they've settled into their role
- Regulatory announcements have a longer window (60–90 days) but stack with other signals

**Implications:**
- Do not sit on high-score triggers. Outreach on day 1 or 2
- Medium-score triggers can wait 3–5 days but not longer
- After 14 days, move a signal to "nurture" (lower cadence, add to email sequence)
- Track response rates by trigger age; you'll see sharp decline after day 10–14

### Operationalization: From Signal to Sequence

1. **Identify** — Run your daily sources, capture signal
2. **Score** — High/medium/low framework above
3. **Message** — Use the trigger formula; personalize in 2 minutes
4. **Time** — High = today, Medium = this week, Low = nurture
5. **Track** — Log trigger type, date, score, and response in CRM for predictive scoring
6. **Decay** — Archive or nurture after 14 days if no response

### Trigger Message Templates by Category

**Company Events:**
> "I saw [Company] hired [Name] as [Title] last month. Leaders in that role typically reshape the [function] stack. What's been the mandate from your leadership around [theme]?"

**Behavioral Signals:**
> "I noticed you downloaded our '[Resource]' guide last week. The teams using it most are tackling [specific pain]. Where are you most blocked right now?"

**Tech Stack Changes:**
> "I saw [Company] added [Tool] to your stack recently. A lot of teams do that when [business reason]. Are you rebuilding [system] this cycle?"

**External Events:**
> "With [regulation] coming into effect in [timeline], teams like you are reviewing [category] solutions. What's your priority—compliance or performance?"

## Example

**Scenario:** You're selling developer onboarding automation to engineering teams at Series A/B startups.

**Today's signal intake:**

| Company | Trigger | Score | Source | Today's Message | Response |
|---------|---------|-------|--------|-----------------|----------|
| TechCorp Labs | Series B, $25M round (announced 2 days ago) | High | Crunchbase | "Congrats on the Series B close. Most teams at this stage hire 5–8 new engineers in the next quarter, which breaks onboarding. What's your current TTM for a new hire?" | Read (2h later): "Ha, we're at 6 weeks. Agreed it sucks." |
| Aurora Systems | VP Engineering hired (LinkedIn post, 3 days ago) | High | LinkedIn | "Saw you brought on [Name] as VP Eng—strong hire. New leaders typically want to cut TTM in half. Are you looking at onboarding tools this cycle?" | Read (next day): "Actually yeah, we're evaluating now." |
| Vertex AI | 4 job postings for "Senior Backend Engineer" posted in 7 days | Medium | LinkedIn job search + Crunchbase | "I see you're hiring aggressively for backend. When you're scaling the eng team that fast, onboarding bottlenecks compound. Quick question—how are you scaling onboarding processes to keep up?" | No response yet (park for 5-day follow-up) |
| Momentum Inc | Downloaded your "Onboarding Metrics" guide (email tracked) | Medium | Email tracking | "Thanks for downloading the metrics guide. Most teams find their TTM is 40% of the way to industry best practice. What's your baseline right now?" | Read (same day): "Around 6 weeks, looking to cut to 3" |
| Scale Ventures | Closed Series A 8 weeks ago; no recent signal | Low | CRM history | [No outreach today; add to nurture email sequence] | — |

**Result of one morning's work:** 2 high-score conversations opened same day, 1 medium moved to follow-up, 1 warm inbound generated from email touch.

**Key observation:** The VP Engineering hire and Series B announcement moved the needle fastest because they signal fresh decision-maker + fresh budget. The onboarding guide download was lower velocity but indicated active evaluation. Job postings are lagging indicators (pain already existed; now they're hiring to fix it).

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
