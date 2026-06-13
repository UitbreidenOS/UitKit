---
description: Creates personalized welcome sequence for new member. Generates welcome message, channel recommendations based on interests, and first engagement task. Draft for human review.
---

# /onboard-member

## What This Does

Runs the onboarding-flow skill for a newly joined community member. Generates a personalized welcome sequence, recommends channels based on their profile, identifies relevant peers, and suggests a first engagement task.

## Steps Claude Follows

1. Ask for: member email, name, job title, company, and stated interests (from signup form)
2. Run member-segmentation skill — baseline score and segment assignment
3. Run onboarding-flow skill — full sequence generation (welcome message, channel recommendations, peer connections, first task)
4. Save brief to accounts/{member-slug}-profile.md
5. Display the onboarding sequence with human approval prompt
6. Ask: Ready to send, or request changes?

## Next Action Logic

- **Advocate/Core member:** Hand-written tone, high personalization, offer mentorship.
- **Contributor member:** Warm and specific, recommend channels, suggest first post.
- **Lurker/New member:** Gentle encouragement, low-friction first task, offer peer support.
- **At-risk indicator:** Flag for closer monitoring; more frequent check-ins.

## Output Format

### Member Profile Summary

```
Name: [Full Name]
Title/Role: [Job Title]
Company: [Company]
Join Date: [Date]
Interests: [List of interests]
Segment: [Advocate / Core / Contributor / Lurker / Inactive]
ICP Fit: [GO / CAUTION / NO-GO]
```

### Channel Recommendations

```
1. #[channel-name] — [Why this channel for them]
2. #[channel-name] — [Why this channel for them]
3. #[channel-name] — [Why this channel for them]
```

### Onboarding Sequence

```
[Day 0 Welcome Message]

[Day 1 First Task]

[Day 3 Resource Bundle]

[Day 7 Check-in]
```

### Peer Recommendations

```
@[Peer 1] — [Why they should connect]
@[Peer 2] — [Why they should connect]
@[Peer 3] — [Why they should connect]
```

## When to Use

- Immediately after a new member joins
- Before any other CM action (research, engagement, etc.)
- To personalize at scale (each member gets custom sequence, not template)
- To identify peer mentors and connection opportunities

## Example

**New Member:** jane.doe@company.com
- Name: Jane Doe
- Title: VP Engineering
- Company: TechStartup (Series A)
- Interests: Scaling teams, remote work, hiring

**Output:**

```
NAME: Jane Doe
ROLE: VP Engineering
COMPANY: TechStartup
INTERESTS: Scaling teams, remote work, hiring
SEGMENT: CORE (Initial score: 55/100 — established role, early-stage company)

CHANNELS:
1. #leadership — Connect with other VPs/CTOs
2. #hiring — Your stated interest; active community
3. #career-advice — Career growth + team building
4. #engineering — Technical discussions

PEER INTRODUCTIONS:
@michael_torres — VP Eng at Series B, solved remote hiring at scale
@sarah_chen — Engineering director, 2 years ahead on your challenges
@alex_kumar — VP at similar-stage company, great mentorship track record

DAY 0 WELCOME:

Hi Jane,

Scaling engineering while building culture is one of the hardest problems in tech — and it sounds like you're in the middle of it right now.

This community is built for people exactly like you: experienced engineering leaders trying to grow sustainably. You'll find active discussions on team structure, hiring velocity, remote work trade-offs, and how to keep culture through hypergrowth.

Three channels I'd recommend:
1. #leadership — VPs/CTOs sharing their biggest challenges
2. #hiring — Concrete strategies for scale
3. #career-advice — Leadership growth while growing your team

Start by introducing yourself in #introductions. Tell us your biggest scaling challenge right now. You'll find people who've solved exactly what you're facing.

Looking forward to connecting.

---

Ready to send, or would you like me to adjust the tone/channels?
```

---
