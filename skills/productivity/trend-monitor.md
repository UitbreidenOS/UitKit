---
name: trend-monitor
description: "Trend monitoring and pulse research: track emerging topics, technology signals, competitive moves, and market shifts — structured research across Reddit, HN, news, and community sources"
---

# Trend Monitor Skill

## When to activate
- Monitoring what's trending in your industry or technology category
- Tracking competitor announcements and community reactions
- Identifying emerging topics before they become mainstream
- Building a weekly market intelligence brief for a team or leadership
- Finding what the community is actually talking about (not just what analysts say)

## When NOT to use
- Deep research on a specific topic — use the research-dossier skill
- Academic literature — use the lit-review skill
- Patent landscape — use the patent-analysis skill
- Real-time news monitoring (use a dedicated tool like Feedly, Mention, or Brand24)

## Instructions

### Technology trend scan

```
Scan for emerging trends in [technology area].

Area: [describe — AI/ML / frontend development / cloud / security / SaaS tooling / etc.]
Timeframe: [last 7 days / 30 days / quarter]
Depth: [quick pulse (top 5 signals) / full scan (comprehensive)]

Sources to check (in priority order):

1. HACKER NEWS (news.ycombinator.com/show, /newest, search):
   Search: [your topic] — filter by "Show HN" posts and comment volume
   What to look for: "Show HN" posts with > 100 comments = high community interest
   Rising signal: any technical announcement with > 50 points in < 6 hours

2. REDDIT:
   r/programming, r/webdev, r/MachineLearning, r/devops, r/[specific subreddit]
   Filter by: "Hot" and "New" in last week
   What to look for: high-engagement posts with strong opinion threads

3. GITHUB TRENDING:
   github.com/trending (by day/week/month)
   Filter by language if relevant
   What to look for: repos with > 500 stars in a week = community signal

4. TWITTER/X (tech community):
   Search: [topic] filter:links since:[date]
   Key accounts to check: major developers, framework authors, company CTOs

5. PRODUCT HUNT:
   producthunt.com — sort by recent, filter by category
   What to look for: products with > 500 upvotes in a day = real interest

Trend signal classification:
🔴 STRONG SIGNAL: Multiple top sources, > 500 engagements, > 3 days of coverage
🟡 EMERGING SIGNAL: 1-2 sources, 100-500 engagements, < 3 days old
🟢 WEAK SIGNAL: Single source, < 100 engagements — watch but don't act

Output: top 5 trends with signal strength, source, and strategic implication.
```

### Weekly market intelligence brief

```
Build a weekly market intelligence brief for [topic/company/industry].

Topic: [describe what you're monitoring]
Audience: [executive team / product team / sales team / investors]
Sections: [competitive / technology / community / news]

Weekly brief template:

---
MARKET INTELLIGENCE BRIEF
Week of [date]
Topic: [your topic]

🔴 THIS WEEK'S TOP SIGNAL:
[The single most important thing that happened]
Source: [where you found it]
Why it matters: [implication for us]

---

📊 COMPETITIVE MOVES:
1. [Competitor name]: [what they did — product launch / pricing change / hiring / fundraise]
   Community reaction: [positive / mixed / negative — with evidence]
   Implication for us: [brief note]

2. [Competitor name]: [...]

---

⚡ TECHNOLOGY SIGNALS:
Rising: [technology / framework / tool gaining traction with evidence]
Declining: [technology / tool losing relevance]
Watch: [emerging technology to monitor but not act on yet]

---

🗣️ COMMUNITY SENTIMENT:
Top discussion: [link to top Reddit/HN thread]
Sentiment on [our product/category]: [positive / neutral / negative]
Notable quote: "[verbatim quote from the community]"

Pain points mentioned frequently this week:
- [Pain point 1]
- [Pain point 2]

---

📰 NEWS DIGEST (top 3):
1. [Headline] — [source] — [1-line summary]
2. [Headline] — [source] — [1-line summary]
3. [Headline] — [source] — [1-line summary]

---

🎯 STRATEGIC IMPLICATIONS:
[2-3 bullet points about what this week's signals mean for product, sales, or marketing decisions]

---
Next week watch list:
- [Topic 1 to monitor]
- [Topic 2 to monitor]

Generate the brief for my specific topic and audience.
```

### Competitive signal tracking

```
Track competitor signals for [competitor list].

Competitors: [list]
Monitoring goal: [product updates / pricing changes / customer complaints / hiring signals / funding]

Signal types and where to find them:

PRODUCT UPDATES:
- Changelog: check competitor's changelog or release notes page weekly
- App store reviews: look for mentions of new features in recent reviews
- Twitter/LinkedIn: follow founder and product accounts
- GitHub: if open source, check commit activity and release notes

PRICING CHANGES:
- Product Hunt: new product listings often include pricing
- Reddit: users complain about pricing changes immediately in community subreddits
- G2/Capterra: reviews mention "price increase" in the text

CUSTOMER COMPLAINTS (what they're failing to do for their customers):
- Reddit: r/[competitor_name] or r/[category] — search competitor name in last 30 days
- G2/Capterra: filter reviews by 1-3 stars, sort by recent — this is what unhappy customers say
- Twitter/X: "[competitor name] + frustrating/broken/cancel/leaving" searches
- Hacker News: search competitor name in comments

HIRING SIGNALS:
- LinkedIn: new job postings reveal strategic priorities (hiring ML engineers = AI investment; hiring enterprise AEs = moving upmarket)
- Glassdoor: team size changes and review volume signal growth or decline

FUNDING / M&A:
- Crunchbase: set alert for competitor funding rounds
- Tech Crunch: search competitor name in last 90 days

Signal log format:
| Date | Competitor | Signal type | What happened | Source | Implication |
|---|---|---|---|---|---|

Generate the monitoring framework for my competitors.
```

### Opportunity identification from trends

```
Identify product or market opportunities from trend signals.

Trends observed: [paste or describe what you're seeing]
Our product: [describe]
Our current positioning: [where we play today]

Opportunity identification framework:

FOR EACH TREND:
1. Is this trend towards what we already do (tailwind)?
   → Accelerate: invest more in what's working, lead with this trend in messaging

2. Is this trend away from what we do (headwind)?
   → Adapt: can we pivot? Or accept this is a niche?

3. Is this trend adjacent — near us but not us?
   → Evaluate: does moving into this adjacency make sense given our capabilities?

4. Is this trend that creates a new customer segment?
   → Target: can we serve this new segment without abandoning our existing one?

Opportunity scoring:
| Trend | Direction | Market size | Time to act | Effort | Score |
|---|---|---|---|---|---|
| [Trend 1] | Tailwind | Large | 3-6 months | Medium | High |
| [Trend 2] | Headwind | N/A | Now | Low | — |
| [Trend 3] | Adjacent | Medium | 6-12 months | High | Medium |

Output: prioritised opportunity list with recommended actions and timeline.
```

## Example

**User:** I run a developer tools company. We're seeing a lot of buzz about Bun (JavaScript runtime) replacing Node.js. Is this a real signal worth acting on?

**Claude's trend assessment:**

**Signal strength: 🟡 EMERGING — real but premature to act.**

**Evidence for the signal:**
- GitHub: bun/bun has 74K+ stars, consistently in weekly trending
- HN: multiple "Show HN" posts and discussions about Bun performance benchmarks (> 200 comments each)
- Reddit r/javascript: Bun threads regularly hit front page
- npm downloads: Bun download growth ~300% YoY but still < 5% of Node.js volume

**What's actually happening:**
Bun is genuinely fast (startup time, package install speed) and has legitimate adoption in development tooling (bundling, testing). It's NOT replacing Node.js in production at meaningful scale — most organisations don't move runtimes based on benchmarks alone.

**The real opportunity for a developer tools company:**

Your users are likely asking "does your tool work with Bun?" If your tool doesn't work with Bun today, that's a support ticket waiting to happen. The action isn't "rebuild for Bun" — it's "validate compatibility and document it."

**Recommended actions (ordered by priority):**
1. Test your tool with Bun today (1 day of engineering). Does it work? Document it.
2. Monitor for 90 more days: if Bun hits 15% of your new user signups, then invest
3. Don't build Bun-specific features yet — wait for signal to strengthen

**What would change this assessment to "act now":** If Vercel, Cloudflare, or AWS announced first-class Bun support in their runtime infrastructure. That would accelerate enterprise adoption from years to months.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
