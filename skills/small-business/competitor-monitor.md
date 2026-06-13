---
name: competitor-monitor
description: "Weekly competitive intelligence: track competitor pricing, positioning changes, news, and job postings as signals — synthesized into a 1-page digest"
updated: 2026-06-13
---

# Competitor Monitor

## When to activate
- You run a weekly or bi-weekly competitive review and want to turn raw findings into clear signals
- A competitor just made a major announcement and you need to understand what it means for your business
- You are preparing for a price change and want to know how you're positioned before you move
- You are losing deals and suspect a specific competitor is the reason

## When NOT to use
- Deep competitive research for a fundraising deck — that needs professional market research
- Legal or IP monitoring — use a specialist for trademark/patent watching
- Automated real-time tracking — this skill requires you to do the weekly check; it synthesizes what you find, it does not scrape automatically

## Instructions

### Set up your competitor list

Keep it to 3-5 competitors. More than that produces noise, not signal. For each one, give Claude:
- Their name and website
- Their main product or service and how it overlaps with yours
- Their public pricing (if available) — tier names, price points, what each tier includes
- What they are known for — their main differentiator or marketing angle
- Any recent news you already know about them

Do this once. Save it as your competitor context block and paste it at the start of each weekly session.

### Build your weekly checklist

Ask Claude to generate a 15-20 minute weekly checklist for your specific competitor set. Claude tailors it to your industry — a SaaS competitor checklist differs from a restaurant competitor checklist.

The standard checklist covers: pricing page (has anything changed?), product changelog or blog (new features or updates?), job board (what roles are they hiring for?), review sites (new reviews, rating trend?), LinkedIn and news (any announcements?), and your own sales data (did any lost deals cite this competitor?).

You do the checking. It takes 5 minutes per competitor. Then you paste the findings.

### Weekly digest

Paste your findings from the checklist. Claude synthesizes them into a structured 1-page digest:

**What changed this week** — factual summary of anything different from last week

**What it signals** — Claude interprets each change. A price decrease might signal they are under pressure, not that they are winning. A hiring surge in one function signals where they are investing next. New negative reviews signal support or quality issues you can use in sales conversations.

**Recommended action** — one concrete thing you should do, if any. Often the answer is "monitor — no action needed yet." Claude does not manufacture urgency.

### Job posting signals

Job postings are one of the most reliable public signals for competitor strategy. Claude reads job postings and tells you what they mean:

- Engineering hires in a specific area: they are building a feature they do not have yet
- Sales hires in a specific region: they are expanding there
- Customer success hires: they are growing or churning — depends on context
- C-suite replacement: leadership instability
- Data and analytics hires: they are about to make more data-driven decisions, possibly pricing-related

Paste the job posting title and description. Claude interprets it in context of what you already know about them.

### Pricing change response

If a competitor lowers their price, tell Claude:
- The change (old price, new price, which tier)
- Your current pricing relative to theirs
- Your win/loss situation in recent deals

Claude drafts talking points for your sales conversations — not a panic response, but a calm, factual answer to the question "why are you $50 more expensive?" that emphasizes the specific things you do better.

### Lost deal debrief

After losing a deal to a competitor, tell Claude:
- What the customer said was the reason
- What you know about your competitor's pitch
- The deal size and customer profile

Claude identifies whether this is a pattern or an outlier and suggests whether a pricing, messaging, or product response is warranted.

---

### Prompt template

```
Here is my competitor context (update this monthly):

Competitor A: [name]
- Website: [url]
- Main product: [description]
- Pricing: [tiers and prices]
- Known for: [differentiator]

[repeat for each competitor]

---

This week's findings:

Competitor A:
- [What I found on their pricing page]
- [What I found on their job board]
- [Any news or announcements]
- [New reviews or rating changes]

Competitor B:
- [findings]

Please give me:
1. What changed this week (factual)
2. What each change signals
3. One recommended action, if any
```

## Example

You run a B2B scheduling software company. You paste your weekly findings:

- Competitor A dropped their Starter plan from $79 to $49 per month
- Competitor B posted three "Data Engineering" roles on LinkedIn this week
- Competitor C received 4 new 1-star reviews this week, all citing slow support response times

Claude produces:

What changed: Competitor A reduced Starter pricing by 38%. Competitor B is actively building internal data infrastructure. Competitor C has a visible support quality issue this week (4 new 1-star reviews in 7 days is unusually concentrated).

What it signals: Competitor A's price drop likely reflects pressure on their entry-level acquisition numbers, not strength — companies with growing revenue usually raise prices or hold them. This is an opportunity to reframe your pricing as premium with faster onboarding. Competitor B building internal data engineering suggests they are moving toward reducing a third-party integration dependency — worth watching which integration they are replacing. Competitor C's support cluster is a sales asset: mention your SLA and average response time in your next three proposals.

Recommended action: Update your sales one-pager to add a response time comparison. If a prospect cites Competitor A's new $49 price, use this script: "Their Starter plan at $49 includes [X limitation]. Our base plan at $89 includes [Y and Z] and a dedicated onboarding call — most customers recover that $40 difference in the first week."

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
