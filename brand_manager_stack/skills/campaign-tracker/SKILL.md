---
name: campaign-tracker
description: Logs all brand campaign activities to session-log.md with timestamp, status, approvals, and performance metrics. Maintains searchable history of campaigns, competitive moves, and content decisions.
allowed-tools: Read, Write
effort: low
---

# Campaign Tracker

## When to activate

Automatically, after each major action: campaign creation, content draft completion, approvals, publication, performance review. You have a session-log.md file tracking campaign activities. This skill ensures every action is logged with timestamp, owner, status, and key metrics.

## When NOT to use

Not for real-time social listening. Not for individual post tracking (aggregate at campaign level). Not without a session-log.md file ready.

## Logging Dimensions

**Campaign Metadata**
- Name, objective, launch date, duration
- Messaging pillars leveraged
- Target audience and segments
- Success metrics (traffic, leads, conversions, engagement)

**Content Inventory**
- Format (blog, social, email, case study, whitepaper)
- Title, pillar, channel, publish date
- Status (draft, approved, published, archived)
- Performance (views, clicks, shares, comments)

**Approval Workflow**
- Submitted by: [Author]
- Reviewed by: [Reviewer]
- Status: [DRAFT / APPROVED / PUBLISHED / REJECTED]
- Timestamp: [ISO date-time]
- Notes: [Human feedback or rationale]

**Competitive Intelligence**
- Competitor move detected: [Move type: pricing, messaging, product launch, hiring]
- Our response: [Action taken or planned]
- Impact: [How this affects our positioning]
- Timestamp: [When detected]

**Performance Tracking**
- Campaign name, channel, date range
- Metrics: traffic, engagement, conversions, revenue
- Variance vs. target (over/under)
- Analysis: what worked, what didn't

## Log Format

Update session-log.md with this format after each action:

```
## [YYYY-MM-DD HH:MM]

**Campaign:** [Campaign Name]  
**Objective:** [What this campaign aims to achieve]  
**Action:** [Campaign Created / Content Approved / Published / Performance Review / Competitive Move Detected]  
**Status:** [IN PROGRESS / DRAFTED / APPROVED / PUBLISHED / COMPLETED]  
**Content Pieces:**
- [Format]: [Title] — [Status: DRAFT/APPROVED/PUBLISHED]
- [Format]: [Title] — [Status: DRAFT/APPROVED/PUBLISHED]

**Competitive Insights:** [Any competitor moves or market shifts detected]  
**Performance Target:** [KPI targets: X visits, Y engagement rate, Z leads]  
**Performance Actual:** [If completed: A visits, B engagement, Z leads]  
**Approval Gate:** [Who approved, when, any notes]  
**Notes:** [Key decision, blockers, next steps]
```

## Logging Triggers

**Log immediately after:**

1. **Campaign Created** — Objective, messaging pillars, content plan, timeline
2. **Content Approved** — Type, title, pillar, reviewer, timestamp
3. **Content Published** — Channel, date, time, link, initial performance target
4. **Weekly Performance Review** — Aggregate metrics across all active campaigns
5. **Competitive Move Detected** — Type of move, impact assessment, our response
6. **Month-End Retrospective** — Campaign performance vs. targets, lessons learned

## Example Log Entry

---

## 2026-06-12 14:32

**Campaign:** Ship Securely, Not Slowly  
**Objective:** Establish thought leadership on security-first architecture; drive leads from VP Engineering and CTO titles at growth-stage companies

**Action:** Content Approved

**Status:** APPROVED

**Content Pieces:**
- Blog: "Ship Faster With Enterprise Security Built In" — APPROVED
- LinkedIn series (4 posts): Security architecture deep-dive — APPROVED
- Email sequence (3 touches): Security review delays ROI — APPROVED
- Case study: TechCorp security-first migration — APPROVED

**Competitive Insights:** 
- Competitor A posted "Enterprise Security for Startups" on June 11 — positioning themselves in our white space
- Customer sentiment: comments mention "their security is overkill for our stage" — positioning opportunity

**Performance Target:**
- Blog: 2K views, 5% CTR
- LinkedIn posts: 500 impressions, 8% engagement
- Email: 25% open rate, 12% CTR
- Case study: 300 views, 20% conversion to demo

**Approval Gate:** Approved by Sarah (Head of Marketing) at 2026-06-12 14:30

**Notes:** 
- Competitor A move is concerning but validates our positioning
- Slight tone adjustment made to blog (removed 1 instance of "paradigm shift")
- Ready for publication June 13 per planned calendar
- Schedule social posts 8:00 AM, 12:00 PM, 4:00 PM

---

## Monthly Retrospective Template

```
## 2026-06-30 — Monthly Retrospective

**Campaigns This Month:**
- Campaign 1 (launched June 3): Target 5K visits, achieved 6.2K (124% of target)
- Campaign 2 (launched June 17): Target 3K visits, achieved 2.1K (70% of target)

**Content Published:**
- 4 blog posts (avg. 1.5K views per post)
- 12 LinkedIn posts (avg. 350 impressions, 7.2% engagement)
- 1 email campaign (35% open rate, 14% CTR)
- 1 case study (180 views, 18% MQL conversion)

**Competitive Moves:**
- [Competitor A]: Launched new pricing page (June 8) — emphasizes cost advantage
- [Competitor B]: Hired Chief Marketing Officer (June 15) — signals growth investment
- Industry news: New regulatory change impacts compliance messaging (June 22)

**Performance vs. Target:**
- Blog traffic: 6.8K visits (113% of monthly target of 6K)
- Email engagement: 35% open rate (target 30%) ✓
- Social engagement: 7% avg (target 7%) ✓
- Lead volume: 148 (target 150) — 99% of target

**Key Learnings:**
1. Blog posts with customer quotes outperform by 40% (avg. 1.8K views vs. 1.2K without quotes)
2. LinkedIn posts scheduled for Tuesday 8:00 AM outperform afternoon posts by 25%
3. Email sequences with subject line hook (vs. generic "update") have 12% higher open rate

**Next Month Actions:**
- [ ] Prioritize blog posts with customer validation
- [ ] Shift LinkedIn posting to morning times
- [ ] A/B test email subject lines in campaign 2
- [ ] Monitor Competitor A pricing changes and adjust messaging if needed
- [ ] Research regulatory changes impact on messaging pillars
```

---
