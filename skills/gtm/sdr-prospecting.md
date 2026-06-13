---
name: sdr-prospecting
updated: 2026-06-13
---

# SDR Prospecting

## When to activate
- Building a net-new account list from scratch (quarterly prospecting campaigns, market penetration)
- Pre-call research before a scheduled discovery call
- Planning a prospecting sprint (weekly cadence activation, pipeline fill)
- Scaling outbound motion across multiple buyer personas
- Refreshing stale account lists to surface new signals

## When NOT to use
- Closing deals — this is top-of-funnel account research and sequencing only
- Handling inbound leads — inbound qualification follows different logic
- Customer success workflows — post-sale account management is separate
- Sourcing candidates — this is not recruiting
- One-off opportunistic outreach — use this only for systematic campaigns

## Instructions

### Phase 1: ICP Definition & Firmographic Filtering

Start upstream. Your list is only as good as your ICP.

**Firmographic Layer (Non-Negotiable):**
- **Industry vertical:** Map to NAICS/SIC codes. If you sell to "SMB software teams," that's too broad. Get specific: "Series A/B SaaS companies in MarTech, PipeTech, or Sales Automation."
- **Headcount range:** Define precisely. Example: 20–150 employees (early product-market fit, still scrappy in ops). Use LinkedIn's headcount bands as primary filter.
- **ARR range:** If you sell upmarket, enforce floor (minimum $1M ARR). If downmarket, enforce ceiling ($10M ARR). Mix breaks your model.
- **Tech stack:** List your bullseye tools (Salesforce + Marketo + Workato) or avoid lists (companies on incumbent solution = lower intent). Use Apollo, Clay, or BuiltWith filters here.
- **Geography:** Default to English-speaking markets (US, UK, Canada, Australia) unless your GTM is global. Narrow by time zone to match your sales ops.

**Output of Phase 1:** A prospect seed list, not yet scored, typically 500–5k accounts depending on market size.

### Phase 2: Fit Scoring — Growth & Pain Proxies

Not all ICPs are equally ready to buy. Layer signals that predict buying readiness.

**Growth Indicators (Intent from expansion):**
- New funding round announced (<6 months) — strong hiring + spend signals
- Headcount growth >20% YoY — operational friction increases
- Product launches or major feature releases — new GTM motion = budget availability
- Expansion into new geographies/verticals — infrastructure investment underway
- Job postings in key roles (Sales Ops, Marketing Ops, Revenue Ops) — explicit pain area

**Pain Proxies (Friction signals):**
- Tech stack fragmentation — 8+ point solutions in a category they could consolidate into your platform
- Recent churned tool or vendor consolidation — budget already allocated, now available
- Executive changes in buyer's org — new leaders often mandate tooling refresh
- Regulatory changes affecting their industry — compliance spending = open budget window
- Competitor wins in their space — they're evaluating how to respond

**Scoring Formula (Simple):**
- Growth signals: +1 point each (max +5)
- Pain proxies: +1 point each (max +5)
- Tier 1 prospects: 7–10 points (research depth: 20 min)
- Tier 2 prospects: 5–6 points (research depth: 10 min)
- Tier 3 prospects: 1–4 points (research depth: 5 min + 1 personalization point)

**Output of Phase 2:** A ranked list with scores. Now you know where to invest research time.

### Phase 3: The 3-Contact Rule — Multi-Threading at Account Level

Never sequence a single contact. Dead ends kill momentum. Always build 3+ contact threads per account.

**Contact Archetypes to Target:**
1. **Economic Buyer** (holds budget, makes yes/no decision)
   - Title signals: CFO, VP Finance, VP Ops, VP Sales, Chief Revenue Officer, VP/Director of [buyer function]
   - Persona varies by product. If you're selling ops tooling: VP Ops or Chief Operations Officer. If sales enablement: CRO or VP Sales.
   - Research angle: recent hires = no relationships with incumbent vendor, blank slate

2. **Champion** (will evangelize internally, runs proof of concept, has peer credibility)
   - Title signals: Senior Manager, Director (below C-suite), Ops Lead, Program Manager
   - Often runs the process day-to-day, directly experiences pain
   - Research angle: promotions, job switches from other companies in your space (they understand your pitch already)

3. **Influencer** (technical gatekeeper, shapes selection criteria)
   - Title signals: Principal [function], Head of, Manager, Senior Specialist
   - Tech stack decisions often route through them
   - Research angle: speaks at industry events, publishes on pain topics relevant to your solution

**Finding These Contacts:**
- LinkedIn Sales Navigator: Company > Role filter + "Messaging" button. Note: limit to 1st-degree connections for higher response rates in first sequence.
- Hunter.io or RocketReach: Bulk export from target account list, then verify emails manually (false positives are expensive in your send limits).
- Clay: Set up a workflow: Clearbit (company research) → Hunter (email) → LinkedIn (enrich contact details) → manual review for role fit.
- Company website: Check /team, /leadership, LinkedIn company page, news/PR for job announcements.

**Sequence Logic:**
- Contact 1 (Economic Buyer): Day 1 outreach, 2-day follow-up, 5-day follow-up
- Contact 2 (Champion): Day 0 or 1 (offset slightly), same follow-up cadence
- Contact 3 (Influencer): Day 2, staggered, lower urgency tone (information/opinion, not a ask)
- Mix (don't send 3 identical emails on day 1 to the same account—looks robotic; offset by 1–2 days for pattern breaking)

### Phase 4: Research Depth Tiers — Allocate Time, Not Effort Equally

Your time is finite. Tier your research to match account fit.

**Tier 1 Accounts (Tier 1 Fit Score: 7–10)** — 20-minute research depth
- Full company research: website, recent news, funding/valuation, exec bios
- Buyer-specific research: LinkedIn profile history, published content, mentions on company blog or podcasts
- Pain mapping: Identify 2–3 specific problems they likely face based on stage + vertical
- Research document: Outreach brief with 3 personalized points per contact (pain correlation, recent event, common connection)
- Sequencing: Custom email per contact (not template), 3+ contact threads in parallel

**Tier 2 Accounts (Tier 2 Fit Score: 5–6)** — 10-minute research depth
- Company snapshot: Industry, size, funding, key buyer titles
- Buyer-specific: Quick LinkedIn scan (recent moves, seniority, one data point you can reference)
- Pain mapping: Generic pain for their vertical (skip account-specific deep dive)
- Research document: Lightweight outreach brief, 1 personalized point + 2 template points per contact
- Sequencing: Template email + light personalization (first line, company name, 1 detail), still 3+ contacts

**Tier 3 Accounts (Tier 3 Fit Score: 1–4)** — 5-minute research depth
- Company snapshot: Size, vertical only (skip deep research)
- Buyer-specific: Title + LinkedIn headline only (no deep profile read)
- Pain mapping: Vertical pain only (no account research)
- Research document: Template email with 1 insertion point (company name or vertical pain)
- Sequencing: Pure template with mail merge, still 3+ contacts (let volume carry)
- Triage: If no response after 3 sequences over 2 weeks, add to parking lot immediately (don't waste sequences)

**Time Budgeting:**
- Tier 1: 20 accounts → 6–8 hours
- Tier 2: 40 accounts → 6–7 hours
- Tier 3: 100+ accounts → 8–10 hours (mostly mail merge)
- Total: ~20–25 accounts per day (varies by tier mix)

### Phase 5: Clay / LinkedIn Sales Navigator Workflow for List Building at Scale

**Clay Workflow Setup (Recommended for 100+ accounts):**

1. **Source Layer:**
   - Input: Industry list from Clearbit, Crunchbase export, Apollo, or ZoomInfo
   - Filter 1: Headcount range (target range only)
   - Filter 2: ARR range (minimum threshold)
   - Filter 3: Tech stack (Clearbit: must include bullseye tools, exclude competitor tools)
   - Output: 200–1000 companies (adjust filters until size matches your weekly capacity)

2. **Enrichment Layer:**
   - Clearbit Enrichment: Company financials, funding, location, industry vertical, employee count
   - Hunter Email Finder: Bulk email lookup (CAUTION: Hunter hit rate drops on older/inactive employees; verify manually)
   - LinkedIn Scrape: Execute custom URL search per company to pull exec + founder profiles → email via Hunter
   - BuiltWith API: Secondary tech stack validation (for tech-stack-sensitive verticals)

3. **Scoring Layer:**
   - Add column: "Growth Signal" (true/false based on news/funding in last 6 months)
   - Add column: "Pain Proxy Match" (count of pain indicators present)
   - Formula: IF(growth=true, +2) + pain_proxy_count = Fit Score
   - Sort descending, assign Tier (1/2/3) based on score bands

4. **Contact Threading:**
   - Filter by contact role keywords: executive (CEO, CFO, CRO), director/VP (buyer role), manager (champion)
   - De-duplicate across same account (one economic buyer, one champion, one influencer per account)
   - Manual QA pass: 5–10% sample check for role fit (avoid job titles that don't match your buyer)
   - Output: Threaded list with columns [Account, Contact1_Name, Contact1_Email, Contact1_Role, Contact2_Name…] for import to email sequences

5. **LinkedIn Sales Navigator Integration:**
   - Parallel workflow (not replacement): Export target company list
   - Sales Navigator > Company search > Add target accounts to list
   - Note: Visit profiles (engagement signal to prospects), but rely on Hunter/Clay for email (Sales Navigator doesn't provide bulk email export)

**Output of Phase 5:** Clean, threaded list of 100–500 accounts with 3+ contacts per account, ready for sequencing.

### Phase 6: The Parking Lot Method — Capture Weak Signals Early

Not every account is ready to sequence today. But signals expire. Capture everything.

**What Goes in the Parking Lot:**
- Accounts with only 1–2 growth/pain signals (Tier 3 prospects with only 1 point)
- Companies you researched but contact details are incomplete (missing economic buyer or champion)
- Accounts with strong ICP fit but no current pain signal (strong vertical match, small headcount, but stable funding)
- One-off outreach targets from warm intros that aren't part of your core list

**Parking Lot Maintenance (Weekly):**
- Flag any new signals (job postings, funding, news mention) that move accounts from Tier 3 → Tier 2 or Tier 2 → Tier 1
- Promote high-signal accounts to active sequencing list
- Do not remove accounts; they stay in parking lot until:
  - Contacted 3+ times with no response (then: "no interest" tag, suppress)
  - Deal closed (then: "customer" tag)
  - Explicitly unfit (then: "out of ICP" tag)

**Tool Setup:**
- Google Sheet or Airtable: Columns [Company, ICP Fit Score, Latest Signal, Signal Date, Status (Active/Parking Lot/Suppressed), Last Outreach Date]
- Weekly script: Search news + job posting feeds + LinkedIn for parking lot companies, log new signals in Signal Date column
- Monthly promotion: Move any Tier 3 accounts with new signal to Tier 2 bucket, add to next week's sequence

**Why This Matters:**
- Parking lot accounts are warm-start prospects for next quarter's campaign
- First sequence lands when they're already considering change (signal appeared this week, you reach out next week = timing)
- Reduces waste: you don't re-research accounts you've already touched

### Phase 7: Daily Prospecting Rhythm — The 4-Hour Workday

**Hour 1: Research (9:00–10:00am)**
- Review overnight engagement (opens, clicks, replies from previous day)
- Research 20–30 accounts based on tier (mix Tier 1/2/3 to stay fresh)
- Fill outreach brief template for each account
- Time-box: 2–3 min per Tier 3, 5 min per Tier 2, 15–20 min per Tier 1

**Hour 2–3: Sequencing (10:00am–12:00pm)**
- Write or customize sequences based on research brief
- Send outreach sequences to 20–40 accounts (day 1 sequences for newly researched accounts)
- Execute follow-up sequences (day 2, day 5 sequences for accounts you've already contacted)
- Review deliverability: check for bounces, spam flags; swap emails if needed
- Time-box: 3 min per account for template sends, 8 min for custom (Tier 1)

**Hour 4: Follow-up & Pipeline Review (12:00–1:00pm)**
- Log all replies in CRM (don't let emails pile up in inbox)
- Respond to positive/engaged replies immediately (Tier 1 priority; Tier 2 secondary)
- Move objections to objection tracking (log pattern, don't respond yet; batch response later)
- Add new prospects to parking lot if weak signal captured
- Review metrics: Sent this week, Open rate by tier, Reply rate by sequence position, Conversion to meeting

**Why 4 Hours:**
- Deeper research (Tier 1 emphasis) → higher-quality conversations
- Batched sequencing → efficiency (not constant context switching)
- Reply handling same-day → trust building, faster pipeline velocity
- Metrics review → fast iteration (swap sequences if open rate <20%, pivot messaging if objection pattern emerges)

---

## Example

**Scenario: B2B SaaS Sales Enablement Platform, $3k–$8k MRR target, targeting US/UK mid-market**

**Phase 1: ICP Definition**
- Industry: SaaS (NAICS 5112xx), MarTech (content/analytics/engagement), PipeTech (CRM-adjacent)
- Headcount: 40–300 employees (not pre-seed, not enterprise-locked)
- ARR: $5M–$50M (sweet spot: $10M–$30M, minimum $5M)
- Tech stack: Salesforce + Slack + Outreach/Salesloft + Gong or Chorus (bullseye), no Showpad (incumbent)
- Geography: US and UK (English-speaking support)

**Phase 2: Fit Scoring Example Account**
```
Company: DataBox (Analytics SaaS, 80 employees, $15M ARR)
Growth signals:
  - Series B funding announced (2 months ago) → +1
  - Hired 3 sales ops roles (last month) → +1
  - Opened UK office (announced) → +1
Pain proxies:
  - 12+ tool stack (fragmented reporting) → +1
  - Currently uses Tableau + Looker (no single-platform sales analytics) → +1
Fit Score: 5 points (Tier 2)
```

**Phase 3: 3-Contact Thread**
```
Account: DataBox
Contact 1 (Economic Buyer):
  - Name: James Chen, VP Sales
  - LinkedIn: Recently promoted (6 months ago), previously Manager AE at Stripe
  - Outreach angle: "James — saw you scaled Stripe's Sales org; Databox just hired 3 ops roles. Sales enablement tools I've seen work best when..."
  
Contact 2 (Champion):
  - Name: Sarah Patel, Sales Operations Manager
  - LinkedIn: Recently hired (2 months ago), prior 4 years at HubSpot in similar role
  - Outreach angle: "Sarah — HubSpot folks I work with often face the same reporting chaos at early stage; we built [feature] specifically for..."
  
Contact 3 (Influencer):
  - Name: Marcus Rodriguez, Senior Product Manager (Sales)
  - LinkedIn: Active in SaaS Ops community, published on sales tech integration
  - Outreach angle: "Marcus — noticed your recent post on unified analytics. Curious your thoughts on [topic]—something we've been obsessing on with our customers..."
```

**Phase 4: Research Depth**
- Tier assignment: Fit Score 5 = Tier 2
- Research time: 10 minutes
  - Company snapshot (2 min): DataBox, Series B, 80 employees, $15M ARR, product is analytics dashboard
  - Buyer research (3 min): James promoted 6mo ago from Stripe; Sarah hired 2mo from HubSpot; Marcus active in community
  - Pain mapping (3 min): Sales orgs with fragmented tools + heavy growth = reporting gaps; single pane of glass for dashboards = their pain
  - Outreach brief (2 min): 3 custom hooks (growth signal, prior company experience, community signal)

**Phase 5: Clay Workflow Output**
```
Input (Crunchbase export): 500 SaaS companies, 40–300 HC, $5M–$50M ARR, US/UK
↓
Clearbit enrich (remove <$5M, >$50M, non-US/UK)
↓
Tech stack filter (Salesforce + exclude Showpad)
↓
Hunter email (bulk lookup for James Chen, Sarah Patel, Marcus Rodriguez profiles)
↓
Scoring formula: (Series funding in 6mo? +2) + (Sales ops hires? +1) + (0–5 pain proxy) = Fit Score
↓
Tier assignment + contact dedup
↓
Output: 120 accounts, 360 contacts, thread-ready list, 30 Tier 1 / 60 Tier 2 / 30 Tier 3
```

**Phase 6: Parking Lot Entries**
```
Company: TechCorp Inc.
- ICP Fit: 6/10 (Tier 2 borderline)
- Signal: No recent funding, but opened Sales ops role last week
- Status: Parking Lot
- Last checked: 2026-01-15
- Action: Monitor weekly; if they hire 2+ ops staff, promote to active sequence

Company: MidMarket SaaS Co.
- ICP Fit: 4/10 (Tier 3)
- Signal: Strong vertical fit (MarTech), but still on HubSpot (not Salesforce)
- Status: Parking Lot
- Last checked: 2026-01-15
- Action: Flag if they announce Salesforce migration or switch tools
```

**Phase 7: Daily Rhythm (Monday, Jan 20)**
```
9:00–10:00am Research:
- Researched 5 Tier 1 accounts from parking lot with new signals
- Researched 10 Tier 2 accounts from new list (Clay output)
- Researched 20 Tier 3 accounts (mail merge template)
- Output: 35 research briefs, ready to sequence

10:00am–12:00pm Sequencing:
- Sent Day 1 outreach: 35 accounts (5 custom, 30 templated with personalization)
- Executed Day 5 follow-ups: 12 accounts (people reached out last week, no reply yet)
- Executed Day 2 follow-ups: 8 accounts (light touch, second contact in thread)
- CRM status: 55 sequences sent this morning

12:00–1:00pm Follow-up & Review:
- Logged 3 replies in CRM (2 "interested in call," 1 "wrong person, forwarded to James")
- Scheduled 2 discovery calls for next week
- Identified pattern: 35% open rate on Tier 1, 18% on Tier 2, 4% on Tier 3 (on pace for targets)
- Added 5 parking lot accounts with new signals to this week's sequence queue
- Metrics snapshot: 90 sequences sent this week, 12 replies (13% reply rate), 2 meetings booked

Parking lot update:
- DataBox (from example above) moved from Parking Lot to Active (new signal: Series B)
- Added to this week's sequence queue (start Wednesday to avoid Monday pile-on)
```

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
