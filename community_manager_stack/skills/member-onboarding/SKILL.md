---
name: member-onboarding
description: Creates personalized welcome sequence for new members. Gathers: stated interests, use case, industry, goals. Matches to channels, mentors, and content. Returns 3–5 email/DM sequence with low-barrier first post prompts.
allowed-tools: Read, Write
effort: medium
---

## When to activate

Immediately upon new member signup. Used by `/onboard-member` command. Input: member profile (interests, industry, role), community structure (channels, features). Output: personalized welcome sequence, resource guide, mentor assignment.

## When NOT to use

Not to spam members who unsubscribe from onboarding. Not to force members into paths that don't match their needs. Not to gatekeep community resources behind onboarding completion.

## Onboarding Workflow

Execute in order:

1. **Capture member profile** — Ask: "What brings you here? What are you hoping to learn/share? What's your role/industry?" (Optional, low-friction)
2. **Map to community structure** — Based on interests, identify 2–3 channels most relevant to them (e.g., if "marketing": #marketing, #growth, #content-strategy)
3. **Assign mentor (optional)** — If power user with matching interests exists, introduce in a low-key way ("Hey [new member], meet [power user] — they've been working on X too")
4. **Draft personalized welcome** — Reference their stated interest in message (not generic "welcome to community")
5. **Suggest first post** — Create low-barrier prompt tied to their interests (not: "Introduce yourself," but: "What's one challenge you're facing in [topic]?")
6. **Provide quick-start guide** — 2–3 bullet points on how to find answers, ask questions, and discover content relevant to them
7. **Schedule follow-up** — Check in at day 3, day 7 if no activity. Offer help, not pressure.
8. **Log to session** — Record in session-log.md: member_id, interests, channel_matches, mentor (if assigned), first_post_status

## Onboarding Sequence Template

```
**Day 1 (Join):** Welcome email

Hi [Name],

Welcome to [Community]! We're excited to have you.

From your profile, I see you're interested in [interest]. Great timing — we have a lot going on in that space right now.

Here's how to get started:
1. **Explore [Channel 1]** — Where [X community members] discuss [topic]
2. **Read [Landmark thread]** — A favorite: [link]. 50+ members have found it helpful.
3. **Join the [low-barrier first post prompt]** — See what [X members] are thinking about [topic]. Drop your take.

Want help? Reply to this email or DM me @[your name].

Looking forward to seeing you in the community!

---

**Day 3 (If no activity):** Check-in message

Hi [Name],

Just checking in — any questions about getting started? I'm here to help.

If you have a moment, jump into [low-barrier prompt]. The conversation is live and [X members] are weighing in.

Reach out anytime.

---

**Day 7 (If no activity):** Re-engagement message

Hi [Name],

We noticed you haven't posted yet — no pressure! Sometimes it takes a moment to find your groove.

A few things that might help:
- [Link to FAQ]
- [Link to how-to-post guide]
- [DM me directly] if you have questions or want an intro to [specific member]

You're welcome here. Come back when you're ready.

---

**Day 14 (If active):** Recognition

Hi [Name],

Great to see you jumping in! Your comment on [thread] added real value. That's exactly the kind of thinking we love here.

Stick around. There's more where that came from.
```

## First Post Prompts (Choose 1 Based on Interest)

| Interest | Low-Barrier Prompt |
|---|---|
| **Product/SaaS** | "What's one feature you wish your favorite tool had?" |
| **Marketing** | "What's your go-to channel for learning what's working in [industry]?" |
| **Business/Ops** | "What's one process your team tripled down on this year that actually worked?" |
| **Design** | "What design principle changed how you approach your work?" |
| **Learning/Career** | "What's one skill you're investing in learning right now?" |
| **General/Unsure** | "What's one thing you've been thinking about lately?" |

## Welcome Resource Guide Template

```markdown
# Getting Started in [Community]

Welcome! Here's your quick-start guide.

## How the Community Works

- **Channels:** Browse [link to channel directory]. Topics are organized by [structure].
- **Asking Questions:** Post in [#help] or topic-specific channel. Folks usually reply within [timeframe].
- **Sharing Ideas:** Start a thread or join ongoing conversations. No wrong answers.
- **Moderation:** We keep things respectful and on-topic. [Link to guidelines].

## Your First Steps

1. **Fill out your profile** — Add a photo and 1–2 sentence bio. People connect better when they know who's behind the message.
2. **Browse [2–3 top channels]** — Lurk for a bit. Get a feel for tone and norms.
3. **Reply to 1–2 existing threads** — Lower stakes than starting new. Join a conversation you find interesting.
4. **Start your own thread** — Once you're comfortable. [Link to how-to-start-a-thread guide].

## Answers to Common Questions

**Q: How often should I post?**
A: There's no rule. Some members post daily, others weekly or monthly. Contribute when you have something to add.

**Q: What if I ask a dumb question?**
A: There are no dumb questions here. People are kind. If something is unclear, someone will help clarify.

**Q: Can I promote my product/service?**
A: Low-key mentions are fine if relevant and helpful. Hard selling is not. [Link to self-promotion policy].

**Q: How do I find specific topics?**
A: Search [search link] or browse channels by topic [link to channel directory].

## Key People to Know

- **[Name]** (Moderator) — Keeps us sane. DM with questions or concerns.
- **[Name]** (Community Lead) — Runs content, events, strategy.
- **[Name]** (Your assigned mentor, if applicable) — Similar interests to you. Great person to DM with questions specific to [topic].

## Quick Links

- [Community Guidelines](link)
- [FAQ](link)
- [Event Calendar](link)
- [How to Get Unstuck](link)
- [Contact Us](link)
```

## Mentor Matching Criteria

Assign mentor if:
- Member explicitly requests or opts in
- Member interests align with power user
- Power user has capacity (track: mentor/mentee ratio <1:5)
- Mentor is known for being welcoming and responsive

Mentor role:
- Introduction message within 24h
- One check-in at day 7
- Available for DM questions
- Optional: invite to private mentor channel with other new members

---
