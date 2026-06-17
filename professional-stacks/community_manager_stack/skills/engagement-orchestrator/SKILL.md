---
name: engagement-orchestrator
description: Identifies at-risk and inactive members. Generates personalized re-engagement messages tailored to their segment and churn indicators. Tracks follow-up and flags escalation. Draft for human review before sending.
allowed-tools: Airtable API, Write, Read
effort: high
---

# Engagement Orchestrator

## When to activate

Triggered when member meets inactivity criteria (14+ days no activity, declining engagement trend, stopped engaging in favorite channels, no response to mentions). You have member engagement history: post/comment count by week, last activity date, channel preferences, sentiment trends.

## When NOT to use

Not for healthy members with normal engagement patterns. Not without 30+ days of engagement history to establish baseline. Not as a mass email without personalization. Not to pressure or guilt members into engagement.

## Inactivity & Churn Triggers

**Tier 1 (Immediate Review):**
- Advocate/Core member with 0 activity in 21+ days
- Negative sentiment trend (declining % positive over 4 weeks)
- Unfollowed all community channels in past 7 days

**Tier 2 (1-Week Watch):**
- Core/Contributor member with 0 activity in 14+ days
- Engagement rate dropped >50% week-over-week
- No response to 2+ mentions from respected members

**Tier 3 (Monthly Check):**
- Contributor/Lurker with 0 activity in 30+ days
- Engagement rate dropped but trending stable
- Seasonal inactivity (expected for their profile)

## Member Segment-Specific Approaches

**For Advocates (score 85+):**
- Personal, hand-written tone
- Acknowledge their contributions explicitly
- Offer: mentorship role, speaker opportunity, advisory board
- Highest touch; might indicate bigger issue (burnout, job change)

**For Core (score 60–84):**
- Warm and specific
- Reference their recent posts/comments
- Offer: event invitation, feedback opportunity, collaboration
- Standard re-engagement

**For Contributors (score 40–59):**
- Gentle and low-pressure
- Suggest specific channels/threads to join
- Offer: answer to common question, introduction to peer
- Light touch; don't over-invest if low engagement baseline

**For Lurkers (score 10–39):**
- Encourage first post without pressure
- Suggest easy entry point (poll, reaction, short comment)
- Offer: help drafting first post, guaranteed positive response
- Minimal touch; many lurkers are observers by design

**For Inactive (<10):**
- Win-back message or archive
- Decide: is this churn risk worth reclaiming, or graceful exit?
- Offer: digest of top discussions, option to return

## Message Design by Churn Indicator

| Churn Indicator | Message Strategy | Specific Ask |
|---|---|---|
| Long inactivity (14+ days) | "Miss you" + value reminder | "What would bring you back?" |
| Declining engagement trend | "Noticed you've been quiet" + specific recent interest | "Thoughts on [recent thread]?" |
| Negative sentiment trend | Empathy + resource/help | "How can we better support you?" |
| Unfollowed channels | "Noticed you left [channel]" + alternative | "Any channels you'd rather be in?" |
| No response to mentions | Gentle check-in + new low-friction ask | "[Easy topic] — curious what you think?" |

## Output Format

```
## [Member Name] — Re-Engagement Campaign

**Member Profile:**
- Segment: [Advocate / Core / Contributor / Lurker / Inactive]
- Tenure: [X months]
- Last Activity: [date] ([X days ago])
- Peak Engagement: [when, what channels]

**Churn Indicators:**
1. [Indicator 1]: [Evidence]
2. [Indicator 2]: [Evidence]
3. [Indicator 3]: [Evidence]

**Churn Risk Level:** [LOW / MEDIUM / HIGH / CRITICAL]

---

## Personalized Re-Engagement Sequence

### Day 0 — Initial Outreach

[Direct message or email: 100–120 words]

**Message Strategy:** [What you're doing and why]

---

### Day 4 — Follow-Up (if no response)

[Follow-up message: 70–100 words, lighter touch]

**If Still No Response:** 
- Mark for human review
- Consider: job change? Moved communities? Burnout?

---

## Specific Re-Engagement Ask

**Primary Ask:** [What specific action are you asking them to take?]

**Backup Ask:** [Lower-friction alternative]

**Intro Offer:** [Specific member or resource to introduce]

---

## Success Metrics

- **Response Rate:** Target >40% within 7 days
- **Return Rate:** Target >60% return to 1+ activity within 14 days
- **Segment Retention:** Advocates (85%+), Core (70%+), Contributors (50%+)

---

## Example

**Member:** michael.torres@company.com (VP Engineering at Series B startup)
- Segment: CORE (Score: 78/100)
- Join Date: 2025-10-20 (7m 23d)
- Last Activity: 2026-06-03 (9 days ago)
- Peak Activity: 2–3 posts/week during May (discussion about scaling teams)
- Recent Channels: #engineering, #leadership, #hiring

**Churn Indicators:**
1. No activity in 9 days (broke 3x/week pattern)
2. Hasn't engaged in #leadership (favorite channel) in 16 days
3. Didn't respond to @mention 5 days ago ("Thoughts on remote hiring?")

**Churn Risk Level:** MEDIUM

---

### Day 0 — Initial Outreach

Hi Michael,

Noticed you've been quiet the last week or so — miss your perspective in #leadership. Your framework on "hiring senior engineers at series B" was exactly what the team needed when you shared it last month.

A few folks have been discussing scaling remote teams (your old pain point). Thought you might have thoughts, especially since you've probably cracked some of that by now.

What's been keeping you busy? And if now's not a good time for community engagement, totally understand — just wanted to check in.

---

### Day 4 — Follow-Up (if no response)

Quick note: saw the new job posting from your company (nice timing on the Series B). Bet hiring is consuming everything. If community is on the back-burner right now, that's totally fair.

Just wanted to surface: the team's been asking for exactly the lessons you learned — maybe when things settle? Or I can pull together a quick summary of the big discussions you've missed.

---

## Escalation Logic

**If member responds:** Resume normal engagement; note in history if they shared info (job change, busy season, etc.).

**If no response after 2 touches:** Archive from active list; send monthly digest instead; mark for quarterly check-in.

**If churn confirmed (unfollowed all channels, deleted account, etc.):** Log departure; request feedback if possible; update cohort analysis.

---
