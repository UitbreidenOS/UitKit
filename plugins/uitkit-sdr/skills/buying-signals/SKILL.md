---
name: "buying-signals"
description: "When prospecting B2B SaaS, you are deciding whether and when to reach out to a target account. Activate this skill when you have:"
---

# Buying Signals

## When to activate

When prospecting B2B SaaS, you are deciding whether and when to reach out to a target account. Activate this skill when you have:
- An account identified as a fit (company size, industry, tech stack match)
- Access to signal detection tools (LinkedIn, Crunchbase, job boards, BuiltWith, G2, news APIs)
- Intent to maximize first-touch reply rate and conversion probability
- A multi-signal monitoring cadence (daily or weekly checks on warm accounts)

This skill is operationalised for SaaS, PaaS, B2B fintech, and enterprise software. Works best on accounts with 50+ employees (enough signals to detect, enough budget to close).

## When NOT to use

- Do not apply to B2C or single-founder businesses — signals are too sparse and buying committees don't exist
- Do not use if you lack the detection tools to verify signals reliably (LinkedIn Premium, BuiltWith, job board access)
- Do not apply to inside sales outreach where you already have warm intro or direct contact — use relationship-first, signal-second instead
- Do not treat this as deterministic — signals are probabilistic, not certainties; always validate with research
- Do not ignore signal decay; a funding round from 8 months ago has zero predictive value
- Do not trigger on single signals alone unless signal rank is 1 or 2; wait for stacking (2+ signals) for cold outreach on ranks 3–6

## Instructions

### The 6 Buying Signals Ranked by Purchase Correlation

**Signal 1: Former Customer Joined a New Company**
- **Rank:** 1 (highest correlation, ~35% reply rate vs. 3.4% baseline)
- **Why it matters:** They have proven product knowledge, understand ROI, and often have budget authority at their new company
- **Detection method:**
  - LinkedIn "People Also Viewed" on your customer contacts
  - LinkedIn Sales Navigator: job change alerts on past buyer profiles
  - Company exit tracking via Crunchbase (when employees move en masse)
  - Manual review: scan customer LinkedIn profiles monthly for "new company" activity
- **Decay window:** 90 days maximum. After 90 days, their initial authority and mandate fade; reprioritize by role change
- **Ideal first-touch timing:** Within 14 days of their job change (before they've already bought alternatives)
- **Verification:** Confirm they had buying influence at old company (job title, Salesforce role, budget owner flag)
- **Trigger message formula:**
  ```
  [Name the signal explicitly] "I saw you just joined [Company] as [Role]"
  [Why it matters] "When people move to a new org, the top thing they fix is [common department problem]"
  [One open question] "Are you looking at [tool category] to solve [specific pain] there, or is that not a priority yet?"
  ```
- **Reply rate uplift:** +35% vs. 3.4% baseline
- **Example trigger:** "I saw you just joined Acme as VP of Operations. When ops leaders move companies, they usually want to clean up their analytics stack. Are you thinking about replacing [current tool] or is that on the roadmap?"

---

**Signal 2: New C-Suite or VP Leadership Hired Within Last 90 Days**
- **Rank:** 2 (second-highest correlation, ~28% reply rate)
- **Why it matters:** New executives need to prove themselves quickly (100-day mandate); they're open to vendor conversations and have budget to support quick wins
- **Detection method:**
  - LinkedIn company page: check "Recent hires" section for C-level or VP-level roles
  - Crunchbase: track leadership changes via "People" tab
  - Company press releases (news API or manual check)
  - Job board API: filter for C-level/VP postings on target accounts
  - LinkedIn Sales Navigator: set alert on "[Company] has hired new [C-suite/VP]"
- **Decay window:** 90 days. After day 90, the mandate pressure softens; they're into steady state
- **Ideal first-touch timing:** Within 30 days of hire announcement (day 1–30 = highest urgency)
- **Verification:** Confirm role and reporting line (must be direct P&L owner or functional VP, not staff role)
- **Trigger message formula:**
  ```
  [Name the signal explicitly] "Congrats on [New VP/CRO] joining [Company]"
  [Why it matters] "[Role] leaders typically spend their first 90 days on [common initiative]; that usually requires [solution category]"
  [One open question] "Is [Company] building out [relevant capability] this quarter, or is that further down the roadmap?"
  ```
- **Reply rate uplift:** +28% vs. baseline
- **Example trigger:** "Congrats on bringing in a new VP of Sales. Most VPs of Sales move fast on their first 90 days—usually refactoring compensation and sales tooling. Is that on your plate, or is your playbook already locked in?"

---

**Signal 3: High-Intent Website Activity (Pricing Page, Demo Page, 3+ Visits in 7 Days)**
- **Rank:** 3 (active evaluation in progress, ~18% reply rate)
- **Why it matters:** They're actively comparing solutions; you're in their evaluation window right now
- **Detection method:**
  - Website analytics: HubSpot, Segment, or custom UTM tracking
  - Intent data platform: 6sense, ZoomInfo, Demandbase (most reliable for B2B SaaS)
  - Drift/Intercom on-site tracking: flag accounts hitting pricing or demo page
  - LinkedIn comment activity on your product posts (strong intent signal)
  - G2 review reads (if you have pixel-based tracking; most don't)
- **Decay window:** 7 days maximum. After 7 days without follow-up activity, assume they're in another vendor's pipeline
- **Ideal first-touch timing:** Within 24 hours of third visit or demo page view (same-day outreach doubles reply rate)
- **Verification:** Confirm account size and role of visitor (if available via intent tool); discard if visitor is freelancer or outside buying committee
- **Trigger message formula:**
  ```
  [Name the signal explicitly] "I noticed you were on our [pricing/demo] page this week"
  [Why it matters] "Usually that means you're in active evaluation. Most teams your size spend [X weeks] comparing—I can help compress that timeline"
  [One open question] "Are you comparing us to [known competitor], or are you looking at a few options in [category]?"
  ```
- **Reply rate uplift:** +18% vs. baseline
- **Example trigger:** "I saw you were on our pricing page three times this week. Usually that means you're actively evaluating—I want to make sure you're not missing anything. Are you comparing us to Competitor X, or still exploring what's out there?"

---

**Signal 4: Tech Stack Change Detected (Removed Competitor or Added Complementary Tool)**
- **Rank:** 4 (adoption momentum, ~16% reply rate)
- **Why it matters:** They're actively reshaping their tech stack; your product solves adjacent pain; timing matters
- **Detection method:**
  - BuiltWith: monitor target accounts for removed competitors, new tool adoption
  - Datanyze: track stack changes with API or manual weekly audits
  - G2 review reads and purchase signals (new vendors adding reviews = new adoption)
  - LinkedIn job postings mentioning new tool requirements
  - ZoomInfo tech stack module
- **Decay window:** 14 days. Stack changes require 1–2 weeks to stabilize; after 14 days, they've moved on
- **Ideal first-touch timing:** Within 7 days of stack change detection (catch them mid-evaluation)
- **Verification:** Confirm change is recent (within 30 days) and represents intentional adoption, not accidental removal
- **Trigger message formula:**
  ```
  [Name the signal explicitly] "I saw [Company] added [new tool] to your stack this month"
  [Why it matters] "[New tool] typically surfaces problems with [related process]. Teams usually find they need [your solution] within weeks"
  [One open question] "Are you planning to integrate that with [existing tool], or are you refactoring that workflow altogether?"
  ```
- **Reply rate uplift:** +16% vs. baseline
- **Example trigger:** "I noticed you just added Segment to your stack. Most companies who migrate to Segment also discover they need better downstream data governance—which is what we do. Are you thinking about that piece, or is that phase two?"

---

**Signal 5: Funding, Acquisition, New Market Entry, or Headcount Spike of 20%+**
- **Rank:** 5 (budget availability, ~12% reply rate)
- **Why it matters:** They have capital, growth mandate, and likely new budget to spend on tools to support expansion
- **Detection method:**
  - Crunchbase: funding announcements and acquisition tracking
  - LinkedIn company page: headcount change over 90-day window (compare to previous quarter)
  - LinkedIn job board API: spike in job postings (proxy for headcount growth)
  - News APIs: M&A, new market launches, IPO filings
  - 6sense or ZoomInfo: "High growth" account flags
- **Decay window:** 120 days. After 4 months, the growth capital is allocated; budgets are locked
- **Ideal first-touch timing:** Within 30 days of announcement (days 1–30: capital is uncommitted; days 31–90: budgets are being allocated)
- **Verification:** Confirm growth is real (not accounting reclass or one-time event); cross-check Crunchbase, LinkedIn, and news sources
- **Trigger message formula:**
  ```
  [Name the signal explicitly] "Congrats on the Series [X] / [X headcount growth] / acquisition of [Company]"
  [Why it matters] "That kind of growth usually triggers [common operational bottleneck]. Most teams your size solve that by [solution category]"
  [One open question] "Is your [relevant team] planning to expand headcount this quarter, or are you focusing on efficiency first?"
  ```
- **Reply rate uplift:** +12% vs. baseline
- **Example trigger:** "Congrats on the Series C. Usually that growth means you're scaling your engineering team. Most companies scaling eng at your pace run into CI/CD bottlenecks within 6 months—are you seeing that yet, or is infrastructure still stable?"

---

**Signal 6: Strategic Hiring Patterns (5+ Job Postings in Target Department Within 30 Days)**
- **Rank:** 6 (budget approved and underway, ~10% reply rate)
- **Why it matters:** Multiple open roles = approved budget + active hiring = tool spending is imminent for that department
- **Detection method:**
  - LinkedIn job board API: filter by company + department + date posted (last 30 days)
  - Indeed, Greenhouse, ATS board API: count open roles by department
  - Company careers page: manual audit of open roles
  - ZoomInfo hiring tracker
  - Persado: hiring intent signals
- **Decay window:** 45 days. After 6 weeks, roles are filled or hiring momentum stalls; budget window closes
- **Ideal first-touch timing:** Within 14 days of 5th role posting (when it's clear this is a real hiring push, not noise)
- **Verification:** Confirm 5+ roles are in the same department (not scattered across company); check job descriptions for seniority mix (indicates real investment)
- **Trigger message formula:**
  ```
  [Name the signal explicitly] "I saw [Company] has 5+ open roles in [department] this month"
  [Why it matters] "When teams are hiring that aggressively, they usually need [tool category] to onboard and support new hires fast"
  [One open question] "Is that hiring sprint driven by [known initiative], or are you expanding that team's scope?"
  ```
- **Reply rate uplift:** +10% vs. baseline
- **Example trigger:** "I saw you have 6 open roles in engineering this month. Usually when teams hire that aggressively, they face velocity issues within the first 30 days—they need better code review or CI tooling. Is that something your lead eng is thinking about?"

---

### Signal Stacking Logic

**Do not cold-outreach on a single signal (ranks 3–6) alone.** Wait for signal stacking.

**Signal stacking rules:**
- **2+ signals detected (any rank) = priority outreach within 24 hours**
  - Example: Signal 3 (website visit) + Signal 5 (funding) = high-urgency multi-touch
  - Example: Signal 4 (tech change) + Signal 6 (hiring) = schedule multi-touch
- **Signals 1 or 2 alone = immediate outreach (within 1 day)** — don't wait for stacking
- **Single signals 3–6 = add to nurture cadence, not priority outreach** — re-check weekly until signal stacks or decays
- **3+ signals = nuclear option** — executive outreach, personalized demo offer, 2-hour response SLA

**Stacking example:**
```
Monday: Signal 3 detected (website visit)
  → Add to nurture list, 1x/week check-in
Wednesday: Signal 6 detected (4 new job postings in sales)
  → NOW: 2+ signals. Trigger priority outreach within 24h
  → Message: "I noticed you're expanding sales AND exploring our platform this week"
Friday: Signal 5 detected (Crunchbase shows Series B)
  → 3 signals. Escalate: call from founder or head of sales
```

---

### Signal Monitoring Stack

**Daily checks (accounts in active evaluation):**
- LinkedIn Sales Navigator: job change alerts on target personas and warm leads
- Intent data dashboard (6sense, Demandbase): website activity, score threshold >60%
- Drift/Intercom: real-time notifications on pricing page or demo page views

**Weekly checks (accounts in pipeline or watchlist):**
- BuiltWith API: tech stack changes (Signals 4)
- Company news alerts (Crunchbase, Google News API): funding, M&A, executive hires (Signals 2, 5)
- LinkedIn company page: job postings count in target departments (Signal 6)
- Job board scraping: Indeed, Lever, Greenhouse for company hiring (Signal 6)
- G2 company profile: review activity spike = interest signal (proxy for Signal 3)

**Monthly audits (lookback and decay):**
- Spreadsheet or CRM: mark signal date, decay deadline, outreach status
- Prune decayed signals (older than 90 days for Signals 1–2, older than 14 days for Signal 3, older than 14 days for Signal 4, older than 120 days for Signal 5, older than 45 days for Signal 6)
- Score accounts by signal count and urgency tier

---

### 14-Day Decay Rule (Universal)

All signals decay. The industry standard is:
- **Signal 1 & 2:** Useful for 90 days, priority drops after day 30
- **Signal 3:** Useful for 7 days (website activity is time-bound), cold touch after day 7 is 60% less effective
- **Signal 4:** Useful for 14 days, stale after that
- **Signal 5:** Useful for 120 days, priority drops after day 30
- **Signal 6:** Useful for 45 days, momentum stalls after day 45

**Implementation:**
1. Tag each signal with detection date in CRM or spreadsheet
2. Calculate decay deadline (see windows above)
3. Automate with Zapier, Make, or in-house script: if (today > signal_date + decay_window), remove from priority list, move to nurture
4. Never cold-outreach on a decayed signal; re-check if new signal appears

---

### First-Touch Message Formula (Operationalised)

Every first-touch should follow this 3-part structure (max 3 sentences):

**[Part 1: Name the signal explicitly]**
- Makes the outreach credible and specific (not spray-and-pray)
- Example: "I saw you just joined Acme as VP of Ops" OR "I noticed you were on our demo page three times this week"

**[Part 2: Why it matters to them (not to you)]**
- Articulate the business problem they're likely facing *because* of that signal
- Example: "When ops leaders move to a new company, the first thing they usually address is supply chain visibility" (Signal 1)
- Example: "When you add a data warehouse, you usually discover data quality issues downstream" (Signal 4)

**[Part 3: One open question (not a pitch)]**
- Shows you're curious, not selling
- Makes response easier (binary/specific, not open-ended)
- Example: "Are you looking at [category] to solve that, or is visibility not a problem for you yet?"
- Example: "Is your team already thinking about data governance, or is that phase two?"

**Template:**
```
[Signal] "I noticed [specific signal]"
[Problem] "[Role/situation] usually means [business implication]"
[Question] "Are you thinking about [relevant solution area], or is that not on the roadmap?"
```

---

### Reply Rate Benchmarks (Baseline vs. Signal)

| Signal | Baseline | With Signal | Uplift |
|--------|----------|-------------|--------|
| No signal (cold email) | 3.4% | — | — |
| Signal 1 (former customer) | 3.4% | 35% | +10.3x |
| Signal 2 (new C-suite/VP) | 3.4% | 28% | +8.2x |
| Signal 3 (website activity) | 3.4% | 18% | +5.3x |
| Signal 4 (tech change) | 3.4% | 16% | +4.7x |
| Signal 5 (funding/growth) | 3.4% | 12% | +3.5x |
| Signal 6 (hiring) | 3.4% | 10% | +2.9x |
| 2+ signals (stacked) | 3.4% | 42–58% | +12–17x |

*Source: ColdIQ research (2024). Benchmarks assume B2B SaaS, 50–1000 employee accounts, senior/mid-market personas. YMMV.*

---

## Example

**Scenario: VP Sales at Acme Corp**

**Day 1 — Monday 9 AM**
- LinkedIn alert: Sarah Chen joins Acme Corp as VP of Sales (Signal 2)
- Verification: Check LinkedIn, confirm role is VP-level, reporting to CRO, company size = 350 employees, SaaS-adjacent
- Decision: Signal 2 alone = immediate outreach (rank 2, no stacking required)
- Decay window: 90 days, priority outreach day 1–30

**First-touch email (sent 9:15 AM same day):**
```
Subject: Congrats on the VP role at Acme

Sarah,

Congrats on joining Acme as VP of Sales—excited to see fresh leadership there.

Most VP of Sales spend their first 90 days on two things: comp restructuring and tools modernization. 
Usually by month 2, they're evaluating CRM workflows or sales engagement stacks to hit their ramp targets faster.

Is your playbook already locked in there, or are you still thinking through that piece?

Best,
[Name]
```

**Decay tracking:**
- Email sent: Day 0 (Monday)
- Follow-up 1: Day 3 (Thursday) if no reply
- Follow-up 2: Day 7 (following Monday) if no reply
- Follow-up 3: Day 14 if no reply
- Deprecate signal: Day 90 (if no reply by then, remove from active pipeline)

---

**Day 3 — Wednesday 10 AM**
- Intent data alert: Acme.com visited your demo page (Signal 3)
- Manual verification: Drift shows visit from [sarah.chen@acme.com](mailto:sarah.chen@acme.com) — same person
- Decision: 2+ signals now (Signal 2 + Signal 3) = escalate to priority outreach within 24h
- Immediate action: 

**Second-touch (priority call offer, sent 10:30 AM same day):**
```
Subject: Re: Congrats on the VP role at Acme—quick question

Sarah,

Saw you checked out our demo page this morning. Given your timing at Acme, I'm guessing you're in 
the evaluation phase on sales tools. 

Rather than another email, would 15 min of your time be better? Happy to walk you through how we 
typically solve the specific workflows Acme is probably facing.

Let me know your availability this week or next?

Best,
[Name]
```

**Outcome:** If Sarah replies to either email, move her to demo/conversation track. If no reply by day 14, re-evaluate: has Signal 3 (website activity) decayed? (Yes, 7 days max—Signal 3 is stale.) Re-check for new signals. If no new signals appear, continue nurture cadence, 1x/week, until day 90.

---

**Real-world decay example (what NOT to do):**
- Day 1: Signal 5 detected—Acme raises Series B (funding)
- Day 60: You send cold email about the funding
  - ❌ Wrong: 60 days is past the priority window (day 1–30); budget is already allocated
  - ✓ Right: Use it as soft context ("I saw Acme raised Series B earlier this spring"), but lead with a new, current signal

---

