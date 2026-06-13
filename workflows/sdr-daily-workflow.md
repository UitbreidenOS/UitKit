# SDR Daily Workflow

## When to run
Every business day at 8:00 AM. Designed to fill a 4.5-hour structured day (8:00 AM–12:15 PM, resuming briefly at 4:45–5:00 PM). Trigger manually or via scheduled hook for daily automation.

## Inputs required
- **Tier 1 and Tier 2 account lists**: CRM export or spreadsheet with account names and key contacts
- **Previous day's sequence status**: active accounts, stage, and reply history
- **Signal sources**: recent LinkedIn updates, funding announcements, job postings, news feeds for target accounts
- **Email templates and frameworks**: Short Trigger template, multi-touch sequence templates
- **CRM connection**: access to update contact records and create follow-up tasks
- **Call notes** (if applicable): any overnight replies or voicemails requiring classification

## Steps

### Step 1: Morning Signal Review (30 min, 8:00–8:30 AM)

**Claude task:**
"Review my Tier 1 and Tier 2 account lists for new signals. Check for: new leadership hires, funding announcements, tech stack changes, LinkedIn activity from target contacts, job postings in target departments. Flag high-priority signals and recommend action per account."

**Input:** Account list (company names, target contacts), signal sources (LinkedIn, Crunchbase, internal news)

**Decision points:**
- Signal strength: Is this a strong trigger for outreach? (Yes = Tier 1 priority, Maybe = Tier 2, No = skip)
- Contact availability: Is the target decision-maker still the right person? Update if there's a new hire.

**Output:** Prioritised signal list (5–15 accounts) with:
- Account name
- Signal type (e.g., "New VP of Sales hired", "Series B funding announced")
- Target contact name + current role
- Recommended hook (e.g., "Congratulate on hire + mention relevant capability")
- Priority tier (High/Medium)

**Success criteria:** List contains only accounts with actionable signals; no stale leads.

---

### Step 2: Account Research Sprint (60 min, 8:30–9:30 AM)

**Claude task:**
"For each high-signal account from Step 1, research and generate a dossier. Format: company overview, decision-maker map (org chart focus), top 3 pain signals, recommended personalization hook. Use LinkedIn, company website, recent news, and job postings."

**Input:** Prioritised signal list from Step 1, company research tools (LinkedIn, Crunchbase, G2, company websites)

**Decision points:**
- Is the company a good fit for our solution? (Yes = proceed, No = deprioritize)
- Can you identify 2+ decision-makers or just the initial target? (Multiple = higher confidence)
- What's the strongest pain signal for this company? (Tech debt, scaling, competitive pressure, etc.)

**Output:** Company dossier per account (1–2 pages each):
```
[Company Name]

**Overview**
- Industry, size, funding stage, growth rate
- Current product/service focus
- Recent announcements or news

**Decision-Maker Map**
- CEO / Founder: [Name, LinkedIn]
- VP of [Relevant Function]: [Name, LinkedIn]
- [Other influencers]: [Names, roles]

**Top 3 Pain Signals**
1. [Pain signal + evidence from job posting / LinkedIn / news]
2. [Pain signal + evidence]
3. [Pain signal + evidence]

**Recommended Personalization Hook**
[Specific, concrete reason to reach out tied to signal + our solution]
```

**Success criteria:** Each dossier is 80% complete; you have clear next steps for outreach.

---

### Step 3: Outreach Batch (90 min, 9:30–11:00 AM)

**Claude task:**
"Write Email 1 (Subject + Body) for each target prospect using the Short Trigger framework. Keep it under 50 words in the body. Then, write sequence steps 2–4 for accounts already in active sequences (at days 3, 7, 12 cadence)."

**Input:** Company dossiers from Step 2, email templates, Short Trigger framework, active sequence list from CRM

**Decision points:**
- Is this a new outreach (Email 1) or a follow-up in an active sequence? (Paths differ)
- Has this prospect already replied? (Yes = skip sequencing, move to Step 4)
- Should we use a call, video, or email as step 2? (Depends on engagement signals)

**Output:**
1. **Email 1 (New Outreach)** for each target:
   - Subject line (under 10 words, reference the signal)
   - Body (under 50 words, Short Trigger framework: context + problem + call-to-action)
   - Attachment/asset recommendation (if any)

2. **Sequence Steps 2–4** for active sequences:
   - Day 3 follow-up: [Email or task type]
   - Day 7 follow-up: [Email, voice outreach, or LinkedIn engagement]
   - Day 12 follow-up: [Email or final touch, possibly pivot to new signal]

**Success criteria:** Emails are personalized, under 50 words, and reference the signal. Sequences follow cadence and escalation logic.

---

### Step 4: Follow-Up Block (45 min, 11:00–11:45 AM)

**Claude task:**
"Classify all overnight replies and voicemails. Bucket them: (1) Positive engagement, (2) Needs clarification, (3) Not interested, (4) Spam. Draft responses for high-priority replies. For each warm lead, decide: email, call today, or follow sequence?"

**Input:** Overnight email/Slack replies, voicemail transcripts, active prospect list from CRM

**Decision points:**
- Reply sentiment: Positive (reply to today), neutral (clarify + sequence), negative (log + move on)
- Call readiness: Is this prospect ready for a call? (Strong signals = yes)
- Sequence continuation: Should we continue the sequence or pivot to a different hook?

**Output:**
1. **Reply classification table:**
   - Prospect name | Company | Reply content | Bucket | Recommended action | Urgency
2. **Draft responses** for Buckets 1 & 2 (ready to send or customize)
3. **Call list** for today with talking points

**Success criteria:** All replies classified; warm leads get same-day attention; no leads fall through cracks.

---

### Step 5: CRM Update (30 min, 11:45 AM–12:15 PM)

**Claude task:**
"Convert call notes, email sends, and replies into structured CRM updates. For each contact: update last activity date, add call outcome (if applicable), create follow-up tasks with due dates, update opportunity stage, log signals."

**Input:** Call notes from Step 4, email send log from Step 3, reply classification from Step 4, current CRM records

**Decision points:**
- Should this lead move to a new opportunity stage? (Qualified → In Conversation, etc.)
- What's the next task, and when is it due? (Today, tomorrow, in 3 days?)
- Should we add a new contact or company to the database?

**Output:**
1. **CRM bulk update instructions** (ready to paste into your CRM):
   - Contact name | Activity type | Activity date | Outcome notes | Next task | Due date | Opportunity stage
2. **New contact/company additions** (if any)
3. **Follow-up task summary** (counts of tasks created per person)

**Success criteria:** All activity logged; no duplicate work; follow-up tasks are specific and due-dated.

---

### Step 6: End-of-Day Review (15 min, 4:45–5:00 PM)

**Claude task:**
"Summarize today's metrics and tomorrow's priorities. How many new accounts did I add? How many sequences are active? What signals do I need to review tomorrow? Do I need to adjust my target account list?"

**Input:** CRM dashboard snapshot, signal sources, active sequence count, today's workflow outputs

**Decision points:**
- Are we on pace for weekly/monthly targets? (Yes = maintain, No = escalate)
- Should we add or remove accounts from our Tier 1/2 lists? (Cold performance data)
- Do we have enough high-signal accounts for tomorrow, or do we need to hunt new accounts?

**Output:**
1. **Daily metrics:**
   - New accounts added
   - New sequences started
   - Replies received + reply rate %
   - Calls booked / meetings scheduled
   - Active sequences (running total)

2. **Tomorrow's priorities:**
   - Accounts to research
   - Sequences to follow up on
   - Signals to monitor
   - Any urgent calls or follow-ups

3. **Weekly trend** (if it's Friday):
   - Total accounts touched
   - Conversion rate (sequence → meeting)
   - Top-performing signals
   - Recommendations for next week

**Success criteria:** Metrics are accurate; priorities are clear; you can start tomorrow with zero ramp-up time.

---

## Output

A complete SDR daily execution that produces:

1. **Morning signal list** (Step 1): 5–15 prioritised accounts ready to research
2. **Company dossiers** (Step 2): Full research + decision-maker map + pain signals for each account
3. **Outreach emails** (Step 3): Email 1 + sequence steps 2–4, ready to queue
4. **Reply classification** (Step 4): All overnight replies sorted + warm leads with draft responses
5. **CRM updates** (Step 5): Bulk activity log + follow-up tasks, ready to upload
6. **Daily snapshot** (Step 6): Metrics + tomorrow's agenda

**Time allocation:**
- Block 1 (Signal review): 30 min
- Block 2 (Research): 60 min
- Block 3 (Outreach batch): 90 min
- Block 4 (Follow-up): 45 min
- Block 5 (CRM update): 30 min
- Block 6 (End-of-day): 15 min
- **Total: 4.5 hours** (8:00 AM–12:15 PM, + 15 min at 4:45–5:00 PM)

---

## Example

**Day: Monday, June 2, 2026**

### Step 1: Morning Signal Review (8:00–8:30 AM)

User provides:
- Tier 1 account list: Acme Corp, BuildCo, DataDrive Inc, TechScale Ltd
- Signal sources: LinkedIn feed, Crunchbase email, job board

**Claude identifies:**
1. **Acme Corp** — New VP of Sales hired (LinkedIn post, 2 days ago) → **HIGH**
2. **BuildCo** — Series B funding $15M announced → **HIGH**
3. **DataDrive Inc** — Hiring 3 data engineers (job postings on LinkedIn) → **MEDIUM**
4. **TechScale Ltd** — New product launch announced on their blog → **MEDIUM**

**Output:**
```
SIGNAL PRIORITY LIST — Monday, June 2

🔴 HIGH PRIORITY
1. Acme Corp | Signal: New VP of Sales (2 days) | Contact: TBD (research) | Hook: Congrats on hire + our sales efficiency platform
2. BuildCo | Signal: Series B $15M | Contact: Existing CEO contact | Hook: Help them scale sales ops post-funding

🟡 MEDIUM PRIORITY
3. DataDrive Inc | Signal: Hiring 3 data engineers | Contact: Hiring manager TBD | Hook: Data team scale = infrastructure challenges
4. TechScale Ltd | Signal: New product launch | Contact: Existing product lead | Hook: Analyze market response + sales strategy
```

---

### Step 2: Account Research Sprint (8:30–9:30 AM)

User provides: LinkedIn profiles, company websites, Crunchbase links

**Claude produces dossiers:**

```
ACME CORP

**Overview**
- Industry: B2B SaaS (sales enablement)
- Size: 150 employees
- Funding: Series A ($8M, 2023)
- Recent: New VP of Sales hired (May 30, 2026)

**Decision-Maker Map**
- CEO: Jane Smith (LinkedIn: /in/janesmith) — founded company
- VP of Sales: Michael Johnson (LinkedIn: /in/mjohnson) — NEW HIRE
- CRO role: TBD (likely creating VP Sales role for growth)

**Top 3 Pain Signals**
1. New sales leadership → expanding sales team, need infrastructure/tools
2. Series A funded 2+ years ago → likely planning Series B, need to scale revenue
3. 150 people → moving into scale-up phase, sales ops becoming critical

**Recommended Hook**
"Hi Michael, Saw you joined Acme as VP of Sales — congratulations! Sales ops is brutal during ramp. We help teams like you compress onboarding from 60 to 30 days. Quick call this week?"
```

```
BUILDCO

**Overview**
- Industry: DevOps infrastructure
- Size: 45 employees
- Funding: Series B ($15M, June 1, 2026) — JUST ANNOUNCED
- Growth rate: 3x YoY (per Crunchbase)

**Decision-Maker Map**
- CEO: Alex Chen (existing contact, engaged)
- VP of Product: Sarah Lee (LinkedIn: /in/sarahlee)
- VP of Sales: [Not yet hired — growth opportunity]

**Top 3 Pain Signals**
1. Series B funding → 3x headcount growth expected, sales will explode
2. 45 → ~150 people in 12 months → massive operational scaling challenge
3. Product-led growth likely → need sales infrastructure to convert inbound

**Recommended Hook**
"Alex, congrats on BuildCo's Series B close! With 3x growth ahead, your sales ops will be the constraint. Let's grab coffee and talk how to avoid common scaling mistakes."
```

---

### Step 3: Outreach Batch (9:30–11:00 AM)

User queues emails for sending

**Claude produces:**

```
EMAIL 1 — Acme Corp / Michael Johnson (NEW OUTREACH)

Subject: Sales ops for Acme's next phase

Body:
Hi Michael,

Congrats on the VP role. Sales teams scale fastest when ops keeps up.

We compress onboarding from 60 to 30 days. Worth a quick call?

Best,
[Name]
[Your Company]

---

EMAIL 1 — BuildCo / Alex Chen (NEW OUTREACH)

Subject: BuildCo's post-Series-B operations

Body:
Alex,

Saw the Series B close. Congrats. 3x growth ahead means sales ops is your constraint.

15 min this week?

Best,
[Name]
[Your Company]

---

SEQUENCE STEPS 2–4 (Example: DataDrive Inc prospect already in sequence, day 1 sent)

Day 3 Follow-up: Email
Subject: Quick thought on hiring

Body: "Hi [Name], Following up on my email Tuesday. As you scale your data team, sales becomes critical. Most teams fumble here. Let's make sure you don't. Quick call?"

Day 7 Follow-up: LinkedIn engagement
Action: Comment on their recent hiring post + send message: "Saw your team growth plans. Let's sync on operationalizing sales for data teams."

Day 12 Follow-up: Email (final touch)
Subject: Last thought

Body: "Hi [Name], I'll stay out of your inbox after this. But if you ever want to chat about scaling sales without the chaos, you know where to find me."
```

---

### Step 4: Follow-Up Block (11:00–11:45 AM)

User provides overnight replies (example):

**Claude classifies:**

```
OVERNIGHT REPLIES CLASSIFICATION

Prospect: John Doe (BuildCo)
Reply: "Hey, this looks interesting. Can you send over a demo link?"
Bucket: 1 — Positive engagement
Action: Send demo link + call today
Urgency: HIGH

Prospect: Sarah Chen (Acme Corp)
Reply: "Appreciate the note. We're not looking to change tools right now."
Bucket: 3 — Not interested
Action: Log, do not follow up; revisit in 90 days
Urgency: LOW

Prospect: Mike Peters (DataDrive Inc)
Reply: "What's your pricing?"
Bucket: 2 — Needs clarification
Action: Clarify pricing + value prop in email + offer call
Urgency: MEDIUM

---

DRAFT RESPONSE FOR HIGH-PRIORITY REPLIES

To: John Doe (BuildCo)
Subject: Re: Demo link

Hi John,

Here's the demo: [link]. It's a 15-minute walkthrough; most folks watch in 2x speed.

Free 30 min call this Wednesday or Thursday?

Best,
[Name]

---

CALL LIST TODAY
1. John Doe (BuildCo) — Demo sent, hot lead
   Talking points: His role, timeline for scaling sales, current tools pain
```

---

### Step 5: CRM Update (11:45 AM–12:15 PM)

**Claude produces bulk CRM update:**

```
CRM BULK UPDATE — Monday, June 2

Contact Name | Activity Type | Date | Notes | Next Task | Due Date | Opportunity Stage
John Doe | Email sent | 6/2 | Demo link sent | Call | 6/2 | In Conversation
Michael Johnson | Email sent | 6/2 | VP new hire outreach | Follow-up | 6/5 | Prospect
Alex Chen | Email sent | 6/2 | Series B congratulations | Call | 6/3 | Prospect
Sarah Chen | Email received | 6/2 | Not interested now | Revisit | 90 days | Not Qualified
Mike Peters | Email received | 6/2 | Pricing question | Clarify in email | 6/2 | In Conversation

---

NEW FOLLOW-UP TASKS CREATED
- John Doe: Call (today, 2:00 PM) — BuildCo demo followup
- Mike Peters: Send pricing email (today, 1:00 PM) — respond to inquiry
- Alex Chen: Call (Wednesday, 9:00 AM) — Series B debrief
- Michael Johnson: Email follow-up (Thursday, 8:00 AM) — check interest level
```

---

### Step 6: End-of-Day Review (4:45–5:00 PM)

**Claude produces:**

```
DAILY METRICS — Monday, June 2

✅ Accounts touched: 4
✅ New sequences started: 2 (Acme Corp, BuildCo)
✅ Replies received: 3 (reply rate: TBD, small sample)
✅ Calls booked: 1 (John Doe, 2:00 PM today)
✅ Active sequences running: 7

---

TOMORROW'S PRIORITIES (Tuesday, June 3)

🔴 TODAY'S URGENT TASKS
- Call John Doe at 2:00 PM today (demo follow-up)
- Email Mike Peters before EOD (pricing clarification)

🟡 TUESDAY AGENDA
- Research 3 new high-signal accounts (run signal review again)
- Follow up Day 7 on 2 existing sequences
- Call Alex Chen (Series B debrief) — 9:00 AM
- Monitor replies, respond same-day

🟢 WEEK'S OUTLOOK
- 15–20 new accounts to research
- 3–4 calls booked ideal
- 2–3 meetings scheduled by Friday
- Continue daily 8:00 AM start for consistency
```

---



📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
