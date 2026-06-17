---
name: onboarding-flow
description: Generates personalized welcome sequence for new community members. Creates welcome message, channel recommendations based on interests, and first engagement task. Draft for human review before sending.
allowed-tools: Write, Airtable API
effort: medium
---

# Onboarding Flow

## When to activate

Upon new member signup. You have member profile data: email, name, job title, company, interests (from signup form or survey), and location. Activation requires at minimum: email, name, and one declared interest.

## When NOT to use

Not for bulk onboarding >50 members without segmentation. Not without member interest data (re-ask if not provided). Not for re-engagement of inactive members (use engagement-orchestrator instead). Not as a mass email template — this is 1:1 personalization.

## Onboarding Sequence Structure

**Message 1 (Immediate):** Welcome + channel orientation. Introduce yourself as Community Manager; acknowledge their interests; recommend top 3 channels to join based on profile; highlight first action (introduce self in #introductions).

**Message 2 (Day 1):** First task + peer connection. Suggest a specific question to ask or observation to share in recommended channel; tag 2–3 relevant members by name who share similar interests (potential peers/mentors).

**Message 3 (Day 3):** Resource bundle. Send curated list of top posts/discussions in their interest areas; invite to participate in next community event; offer calendar invite or reminder.

**Message 4 (Day 7):** Check-in + offer. Ask how their first week went; offer 1:1 pairing with mentor if they're interested; suggest next engagement step (comment on a thread, ask a question, join a discussion).

## Channel Recommendation Logic

Map member interests to channels:

| Member Interest | Recommended Channels (priority order) |
|---|---|
| Engineering / Architecture | #engineering, #architecture, #tech-deep-dive |
| Career Growth / Leadership | #career-advice, #leadership, #mentorship |
| Product & Feedback | #product-feedback, #feature-requests, #product-strategy |
| Hiring & Team Building | #hiring, #team-building, #job-postings |
| Fundraising / Business | #business, #fundraising, #metrics |
| Events / Meetups | #events, #announcements, #meetups |
| General | #introductions, #general, #off-topic |

**Rule:** Always recommend #introductions + #general + 3 interest-matched channels. Max 5 recommendations to avoid overwhelm.

## First Task Design

First task is low-friction and role-specific:

- **For Engineers:** "Share your tech stack or favorite tool in #engineering"
- **For Founders:** "Drop a win from this week in #business"
- **For Managers:** "Ask one leadership question you're facing in #career-advice"
- **For Designers:** "Share a design critique or case study in #design"

**Pattern:** [Verb] [specific action] [in #channel]

## Welcome Message Rules

Max 150 words. Lead with personalization (their name, title, interest). Never "Hi [Name], Welcome to our community!" — instead start with a specific insight about why they'll fit. Include exactly 1 call-to-action (join these channels + introduce yourself). Close with your name and availability for questions.

## Output Format

```
## [Member Name] — Onboarding Brief

**Profile:**
- Email: [email]
- Title/Role: [title]
- Company: [company]
- Interests: [list of 3–5 stated interests]
- Join Date: [date]

## Recommended Channels
1. #introductions (required)
2. [Channel 1] — [brief reason why]
3. [Channel 2] — [brief reason why]
4. [Channel 3] — [brief reason why]
5. #general (catch-all)

## Personalized Onboarding Sequence

### Day 0 — Welcome Message

[Welcome message: 120–150 words, personalized]

### Day 1 — First Task

[First task: specific action, channel, example prompt]

**Peer Recommendations:**
- [@member-1](name) — [1 line: why they should talk]
- [@member-2](name) — [1 line: why they should talk]
- [@member-3](name) — [1 line: why they should talk]

### Day 3 — Resource Bundle

**Top Discussions in Your Interest Area:**
- [Thread Title] — [link, 1-line note on why relevant]
- [Thread Title] — [link, 1-line note on why relevant]
- [Thread Title] — [link, 1-line note on why relevant]

**Upcoming Events:**
- [Event Name] — [date/time, brief desc]

### Day 7 — Check-In + Next Steps

[Check-in message: ask about first week, offer mentorship pairing, suggest next action]
```

## Personalization Checklist

- [ ] Use member's actual name (not placeholder)
- [ ] Reference their stated interests specifically
- [ ] Mention 2–3 peers with shared interests by name
- [ ] Recommend channels directly related to their role/goals
- [ ] First task matches their experience level (not too hard/easy)
- [ ] Tone matches community voice (warm, inclusive, actionable)
- [ ] No banned phrases (synergy, leverage, disruptive, etc.)

## Example

**Member:** Alex Chen, VP Engineering at TechStartup (joined 2026-06-12)
- Interests: Scaling engineering teams, remote work best practices, hiring

### Day 0 — Welcome Message

Hi Alex,

Scaling a remote engineering team is one of the hardest problems in tech right now — and you're not alone in facing it. This community is built exactly for people like you: engineering leaders trying to scale without losing culture.

Three channels I'd recommend:
1. **#leadership** — Where VPs and directors share their biggest challenges (today's thread: "remote hiring at scale")
2. **#hiring** — Hiring strategies from teams that've scaled to 50+ engineers
3. **#career-advice** — How to develop your team while growing yourself

Start by introducing yourself in **#introductions** — tell us your biggest engineering challenge right now. Some great people are in this community who've solved exactly what you're facing.

Looking forward to connecting.

---
