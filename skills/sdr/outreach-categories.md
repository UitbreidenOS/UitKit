---
name: outreach-categories
updated: 2026-06-13
---

# Outreach Categories

## When to activate

When you need to determine which messaging strategy to deploy for a given prospect or lead cohort. Use this framework to:
- Classify inbound, postbound, bridgebound, or outbound lead sources
- Set reply rate expectations before a campaign launches
- Plan sequence length and touch count based on intent signal strength
- Adjust messaging tone and personalization depth accordingly
- Assign CRM tags for reporting and follow-up logic

Activate this skill at the moment you're about to write your first outreach message or plan a multi-touch sequence.

## When NOT to use

Do not use this framework to:
- Justify blanket messaging that ignores category differences (e.g., using cold outbound copy for inbound leads)
- Override a prospect's stated preference or opt-out signal with more aggressive sequences
- Skip verification of category assignment (e.g., assuming a "contact download" is inbound without checking the source)
- Apply benchmarks to sequences that lack proper list quality or landing page tracking
- Mix categories in a single sequence without resegmenting

## Instructions

### The ColdIQ Framework: Four Lead Source Categories

#### 1. INBOUND — Active intent signal

**Definition:** Prospect initiated contact. They filled a form (demo request, trial signup, content gated download), scheduled a call, or reached out directly.

**Characteristics:**
- Highest intent
- They self-selected into your funnel
- You have clear context for their request (e.g., job title, company size, feature interest)
- No cold introduction needed

**Reply rate expectations:** 25–40%

**Messaging strategy:**
- Acknowledge their action: "Thanks for signing up for the trial" or "I saw you registered for the demo"
- Confirm their pain or use case: "I'm guessing you're looking to [specific problem they likely have]"
- Propose a next step (call, onboarding, product setup): "I want to make sure you get the most out of this. Can we hop on a 15-min call Tuesday?"
- Tone: warm, responsive, assumptive (they're ready)

**Sequence length:** 2–touch maximum
- Touch 1: Within 5 minutes (automation or human)
- Touch 2: 24–48 hours if no response (light re-engagement, not sales pitch)

**CRM tagging convention:**
```
Source: Inbound | Category: {Demo Request | Trial Signup | Content Download | Referral (inbound)}
Intent Level: High
Response SLA: 5 minutes
```

**ATL vs. BTL note:** Inbound leads are earned through top-of-funnel investment (content, paid ads, organic SEO, brand). Once they land, BTL (1-on-1) follow-up is appropriate and expected. Budget accordingly: high ATL spend justifies high-touch sales response.

---

#### 2. POSTBOUND — Engaged with your content

**Definition:** Prospect demonstrated engagement with your owned media or campaigns without directly requesting contact. They watched a webinar, read a blog post, clicked a tracked link in an email, downloaded a report, or attended your event.

**Characteristics:**
- Warm signal, but not yet a request for contact
- You know what content triggered engagement
- They've shown interest in a specific topic or pain area
- Lower intent than inbound, but much higher than cold outbound

**Reply rate expectations:** 8–15%

**Messaging strategy:**
- Reference the specific content they engaged with: "I noticed you watched our 'Scaling Sales Ops' webinar last week"
- Bridge their engagement to their likely situation: "Most folks in your role watch that because [common reason]. Is that you?"
- Soft CTA, not a demo pitch: "Would it be worth 15 minutes to explore what we're seeing in your industry?"
- Tone: informed, conversational, permission-based (you're not cold; you're following up on a signal)

**Sequence length:** 3–touch
- Touch 1: Within 48 hours of engagement detection (while warm)
- Touch 2: 5–7 days later (alternative angle or new content)
- Touch 3: 10–14 days (final "no pressure" check-in)

**CRM tagging convention:**
```
Source: Postbound | Category: {Webinar | Blog | Email Click | Event | Report Download}
Engagement Date: {timestamp}
Content Consumed: {title}
Intent Level: Medium
```

**ATL vs. BTL note:** Postbound leads are outcomes of demand gen campaigns. You've already invested in the content asset; the follow-up sequence is lower-cost than cold outbound but should still be targeted and respectful of timing.

---

#### 3. BRIDGEBOUND — Third-party signal

**Definition:** A neutral third party (not the prospect, not you directly) created a connection point. Examples: G2 review site visitor, current customer or partner referral, competitor product reviewer, conference attendee list, LinkedIn connection, mutual network.

**Characteristics:**
- Medium intent: signal exists, but prospect did not self-select into your funnel
- You can name the bridge explicitly, creating credibility
- Relevance must be established, not assumed
- Strong social proof potential

**Reply rate expectations:** 5–12%

**Messaging strategy:**
- Name the bridge explicitly in your first line: "I noticed you left a review on G2 for [competitor]" or "Sarah Chen referred you to me" or "I saw you in the attendees list for SaaS North"
- Establish relevance without overselling: "Because you're evaluating [product category], I thought it made sense to reach out"
- Propose a specific, low-friction value exchange: "I've worked with [X similar company], and they faced [specific blocker]. Happy to share what worked"
- Tone: credible, specific, value-first (not pushy)

**Sequence length:** 3–touch
- Touch 1: Within 24 hours (bridge is freshest)
- Touch 2: 6–8 days later (new angle or industry insight)
- Touch 3: 12–15 days (final soft check-in)

**CRM tagging convention:**
```
Source: Bridgebound | Category: {G2 Reviewer | Referral | Competitor's Customer | Conference | LinkedIn}
Bridge Source: {name or company}
Credibility Level: {name of mutual connection or third party}
Intent Level: Medium
```

**ATL vs. BTL note:** Bridgebound leads often come from no paid spend (referrals, organic reviews, conferences already budgeted). The follow-up is high-ROI because you're leveraging existing social proof. Invest in personalization here.

---

#### 4. OUTBOUND — Purely proactive, no prior signal

**Definition:** You initiated contact with no prior engagement, signal, or referral. Cold email, cold call, cold LinkedIn message.

**Characteristics:**
- Lowest intent: prospect had no reason to expect or want your message
- Highest friction to overcome
- Requires trigger-based personalization or pain-first framing
- Lowest reply rates; highest effort per response

**Reply rate expectations:** 2–5%

**Messaging strategy:**
- Lead with trigger or pain, not your product: "I noticed you just launched a product in [category]. That usually means [pain point]" or "Role-based trigger: most Director of Sales hires face [specific 30-day blocker]"
- Avoid generic openers ("I came across your profile"); use specificity: "You recently [specific company action], which tells me you're probably…"
- Propose a micro-value first, not a demo: "I put together a 2-min breakdown of how [similar company] solved [your blocker]. Want to see it?"
- Tone: direct, relevant, humble about the cold nature ("I know this is out of the blue, but…")

**Sequence length:** 4–touch (cold sequences require more repetition)
- Touch 1: Initial hook (Day 1)
- Touch 2: Alternative angle or social proof (Day 4–5)
- Touch 3: Different format or new insight (Day 8–10)
- Touch 4: Final "no pressure" + alternative CTA (Day 14–16)
- Effort multiplier: 3x more effort per message than inbound (expect to spend 10–15 min per outbound message vs. 3–5 min for inbound)

**CRM tagging convention:**
```
Source: Outbound | Category: {Cold Email | Cold Call | LinkedIn Outreach}
Trigger Used: {specific trigger or pain point}
Sequence: {1 of 4, 2 of 4, etc.}
Intent Level: Low
```

**ATL vs. BTL note:** Outbound is pure BTL. You're not leveraging any ATL spend or inbound pull. This means:
- ROI is dependent on list quality, trigger accuracy, and copy skill
- Scale is limited by your ability to personalize and maintain deliverability
- Consider volume only after testing holds 3–5% reply rate on a 100-person segment
- Blended cost-per-pipeline-dollar often exceeds inbound or postbound; use strategically

---

### Decision Tree: Classifying Your Lead

```
Does the prospect have a clear request or action tied to your brand?
├─ YES → Is it a direct request (form, call, message)?
│  ├─ YES → INBOUND [25-40% reply rate, 2-touch, 5 min SLA]
│  └─ NO → Did they engage with your content first?
│     └─ YES → POSTBOUND [8-15% reply rate, 3-touch, 48 hr follow-up]
└─ NO → Did a third party refer them or create a connection point?
   ├─ YES → Can you name the bridge credibly?
   │  └─ YES → BRIDGEBOUND [5-12% reply rate, 3-touch, 24 hr follow-up]
   └─ NO → OUTBOUND [2-5% reply rate, 4-touch, trigger-based]
```

---

### CRM Tagging Convention (Unified)

For analytics and sequence routing, use this structure:

**Primary tag:** `Source: {Inbound | Postbound | Bridgebound | Outbound}`

**Secondary tags (category sub-type):**
- Inbound: `Demo Request` | `Trial Signup` | `Content Download (gated)` | `Inbound Referral`
- Postbound: `Webinar` | `Blog` | `Email Click` | `Event` | `Report Download` | `Product Trial`
- Bridgebound: `G2 Reviewer` | `Paid Referral` | `Organic Referral` | `Competitor's Customer` | `Conference` | `LinkedIn` | `Industry List`
- Outbound: `Cold Email` | `Cold Call` | `LinkedIn Outreach` | `Paid List` | `Account-based Outreach`

**Tertiary tag (intent level):**
- `Intent: High` (Inbound)
- `Intent: Medium` (Postbound, Bridgebound)
- `Intent: Low` (Outbound)

**Sequence stage tag:**
- `Sequence: 1 of {2|3|4}` (for tracking touch count and automation routing)

---

### Benchmarking Your Campaign

Before launching, set expectations:

| Category | Reply Rate | Avg. Response Time | Sequence Length | Cost per Response | Notes |
|----------|------------|-------------------|-----------------|-------------------|-------|
| Inbound | 25–40% | <1 hour | 2 | $0–5 (fulfillment only) | Fastest conversion, highest intent |
| Postbound | 8–15% | 24–48 hours | 3 | $5–15 (content + follow-up) | Content already paid for |
| Bridgebound | 5–12% | 24–72 hours | 3 | $10–20 (personalization + research) | Bridge credibility is key |
| Outbound | 2–5% | 48–168 hours | 4 | $20–50 (high effort + list cost) | Requires 3x more personalization effort |

---

### Messaging Template Prompts by Category

#### Inbound template prompt:
```
Write a follow-up message to a prospect who {specific action: demo request, trial signup, etc.}.
Context: {why they likely requested this, their job title, company size}.
Goal: Confirm their pain, propose a 15-min call.
Tone: warm, responsive, assumptive that they're ready to talk.
Length: 2–3 sentences max.
```

#### Postbound template prompt:
```
Write an outreach message to a prospect who {consumed content type: watched webinar, read blog post, etc.}.
Content title: {title}.
Engagement indicator: {view time, download, link click}.
Goal: Bridge their engagement to their likely situation; propose a conversation.
Avoid: Pitching the product. Instead, ask if the content resonated.
Tone: informed, conversational, permission-based.
Length: 4–5 sentences.
```

#### Bridgebound template prompt:
```
Write an outreach message to a prospect you found via {bridge source: G2 review, referral from X, conference attendee}.
How they're relevant: {specific reason they match your ICP}.
The bridge: {name the bridge explicitly in the first sentence}.
Goal: Establish credibility, propose a 15-min value conversation.
Tone: credible, specific, not pushy.
Length: 5–6 sentences.
```

#### Outbound template prompt:
```
Write a cold outreach message to a prospect at {company}.
Their trigger: {specific company action, role-based pain, or industry trend}.
Your unique angle: {why you, not a competitor}.
Goal: Lead with pain or trigger, propose a micro-value exchange (1-min insight, 2-min breakdown, etc.).
Avoid: "I came across your profile." Use specificity instead.
Tone: direct, humble about being cold, value-first.
Length: 6–8 sentences. Effort: high personalization required.
```

---

### Adjustment Matrix: ATL (Above-the-Line) vs. BTL (Below-the-Line)

Use this matrix to allocate your sales and marketing budget:

| Category | ATL Investment | BTL Investment | Blended Approach |
|----------|---|---|---|
| **Inbound** | High (paid ads, content, SEO) | Medium (1:1 follow-up, sales support) | Pull strategy: invest heavily in ATL, scale BTL to match volume |
| **Postbound** | Medium (owned content, email, events) | Medium (targeted follow-up sequences) | Nurture strategy: use demand gen to warm leads, then light-touch sales |
| **Bridgebound** | Low to Medium (partner, events, reviews) | Medium (personalized outreach, relationship building) | Leverage strategy: free or organic bridges get mid-level sales effort |
| **Outbound** | None (purely sales-driven) | High (personalization, research, dialing) | Push strategy: all investment is sales time and list cost |

---

## Example

### Scenario: B2B SaaS Sales Ops Platform, Quarterly Campaign Planning

**Your product:** Sales operations automation platform targeting VP/Directors of Sales.

**Campaign goal:** Generate 20 new opportunities in Q3.

**Lead source breakdown:**
- 40 inbound leads (demo requests)
- 150 postbound leads (webinar watchers from your "Scale Sales Ops" 3-part series)
- 30 bridgebound leads (G2 reviewers of your competitor)
- 200 outbound leads (cold email to Directors of Sales at Series A–C funded companies)

---

### Execution by Category:

**INBOUND (40 leads):**
- Expected replies: 40 × 30% (conservative) = **12 replies**
- Sequence: 2-touch
  - Touch 1 (automated): Within 5 minutes of form submission. "Thanks for requesting the demo. Here's your scheduled time: [link]. I'll save you a seat."
  - Touch 2 (human, if no-show): 24 hours before scheduled call. "Looking forward to chatting tomorrow. Here's a quick 2-min video on what we'll cover."
- CRM tags: `Source: Inbound | Category: Demo Request | Intent: High | Sequence: 1 of 2`
- Cost: $0 (fulfillment labor only, ~5 min per lead)
- Pipeline contribution: 12 qualified conversations (highest conversion path)

---

**POSTBOUND (150 leads):**
- Expected replies: 150 × 12% (mid-range) = **18 replies**
- Sequence: 3-touch, staggered
  - Touch 1 (Day 0): "I saw you watched Part 2 of our 'Scale Sales Ops' series on automating forecasting. That's the part most ops teams struggle with. Should we do a quick 15-min call to see if [solution] fits?"
  - Touch 2 (Day 6): "If you're still thinking through this, here's a 1-pager on how [similar company] cut their forecast cycle time by 60%."
  - Touch 3 (Day 13): "Last check-in — no pressure if this isn't the right time. But if you want to explore, I'm around this week."
- CRM tags: `Source: Postbound | Category: Webinar | Content: Scale Sales Ops Pt. 2 | Sequence: 1 of 3`
- Cost: $5–10 per lead (webinar content already paid for; follow-up labor ~7 min per lead)
- Pipeline contribution: 18 qualified conversations (warm path, high ROI on content spend)

---

**BRIDGEBOUND (30 leads):**
- Expected replies: 30 × 8% (conservative) = **2–3 replies**
- Sequence: 3-touch, bridge-first
  - Touch 1 (Day 0): "I noticed you left a review on G2 for [competitor platform]. Because you've evaluated that space, I thought you'd want to see how [our solution] is different. Worth 15 minutes?"
  - Touch 2 (Day 7): "I saw [similar company, also a reviewer] switched to us last month because [specific feature]. Curious if [same problem] is on your radar."
  - Touch 3 (Day 14): "One last thing — I've got some benchmark data from your industry that might be useful. Let me know if you'd like to see it."
- CRM tags: `Source: Bridgebound | Category: G2 Reviewer | Credibility: G2 Review | Sequence: 1 of 3`
- Cost: $10–15 per lead (research + personalization, ~10 min per lead)
- Pipeline contribution: 2–3 qualified conversations (credible path, good ROI for effort)

---

**OUTBOUND (200 leads):**
- Expected replies: 200 × 3.5% (mid-range for well-executed cold email) = **7 replies**
- Sequence: 4-touch, trigger-based
  - Touch 1 (Day 0): "I saw [company name] just hired a VP of Sales last month. That usually means forecasting and pipeline management are top priorities in the first 90 days. We help ops teams streamline exactly that. Worth 15 minutes to explore?"
  - Touch 2 (Day 5): "[Social proof angle] Directors of Sales at [similar company] told us their biggest challenge in the first 90 days was getting forecasting right. Is that resonating?"
  - Touch 3 (Day 10): "[Alternative value prop] Different angle: most VP hires inherit broken ops processes. Here's a 2-min breakdown of how [company] fixed theirs in 30 days. Relevant?"
  - Touch 4 (Day 16): "[No pressure close] I know this is out of the blue, but I've got 15 min Thursday if it's useful to chat. If not, no worries."
- CRM tags: `Source: Outbound | Category: Cold Email | Trigger: VP Sales Hire | Sequence: 1 of 4`
- Cost: $15–25 per lead (research + list + high personalization labor, ~15 min per lead)
- Pipeline contribution: 7 qualified conversations (lowest intent, highest effort)

---

### Blended Campaign Results:

| Category | Leads | Reply Rate | Expected Replies | Effort (hrs) | Cost | Replies per Hour | Pipeline Contribution |
|----------|-------|------------|------------------|---|---|---|---|
| Inbound | 40 | 30% | 12 | 3 | $0 | 4.0 | 12 high-intent calls |
| Postbound | 150 | 12% | 18 | 17.5 | $1,050 | 1.0 | 18 warm calls |
| Bridgebound | 30 | 8% | 2–3 | 5 | $375 | 0.5 | 2–3 credible calls |
| Outbound | 200 | 3.5% | 7 | 50 | $4,000 | 0.14 | 7 cold calls |
| **TOTAL** | **420** | — | **39–40** | **75.5** | **$5,425** | **0.52** | **39–40 total pipeline**|

---

### Key Insights from This Example:

1. **Inbound is your highest ROI by far.** 40 leads / 3 hours of work = 4 replies per hour. Invest aggressively in ATL to generate more inbound demand.

2. **Postbound scales demand gen spend.** The webinar was already paid for; the follow-up sequences are leverage. At 1 reply per hour, it's still solid ROI.

3. **Bridgebound is credibility leverage.** Low volume (30 leads), but high-quality conversations. Don't ignore G2, referrals, and event lists.

4. **Outbound is your volume play, not your efficiency play.** At 0.14 replies per hour, it's expensive. But if you have the sales team capacity and need to fill pipeline gaps, it's necessary. Scale only after proving 3%+ reply rate on a pilot.

5. **Blended campaign delivers ~40 pipeline conversations from 420 leads in Q3.** That's a 9.5% pipeline conversion from outreach. If your deal size is $50K and close rate is 20%, you're looking at $400K in potential revenue from 75.5 hours of combined sales and fulfillment effort.

---

### What Changed in Messaging Across Categories:

**Same company, different message:**

- **Inbound:** "Thanks for signing up. Let's get you set up for success. Are you free Tuesday at 2?"
- **Postbound:** "I saw you watched Part 2 of our webinar on automating forecasting. That's the blocker we're solving. Worth 15 minutes?"
- **Bridgebound:** "I noticed you reviewed [competitor] on G2. Because you've evaluated this space, I thought you'd want to see what makes us different."
- **Outbound:** "I saw [company] just hired a VP of Sales. Forecasting usually becomes a priority in the first 90 days. We help ops teams get that right. Worth a quick call?"

Each message acknowledges the category-specific signal and removes cold friction where possible.

---

done:outreach-categories.md
