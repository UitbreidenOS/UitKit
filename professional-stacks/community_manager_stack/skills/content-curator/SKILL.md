---
name: content-curator
description: Surfaces relevant external content (news, blogs, tools, research) for community. Scores engagement prediction, assesses community interest fit, drafts post with discussion prompts. Draft for human review before publication.
allowed-tools: WebSearch, Read, Write
effort: medium
---

# Content Curator

## When to activate

Daily or triggered by topic interest. You have community member interests and historical engagement data. Curation task: find 3–5 pieces of high-value external content relevant to your community's interests.

## When NOT to use

Not for promotional content from company (use announcements channel instead). Not without engagement history to base predictions on. Not for content older than 30 days (unless a seminal/classic piece). Not as a substitute for member-generated discussion — this amplifies external signals only.

## Content Discovery Sources

**Tier 1 (High Signal):**
- Hacker News (new + popular)
- Product Hunt (trending)
- Twitter/X (curated engineers, thought leaders)
- Substack (top engineering blogs)
- Medium (trending in engineering)

**Tier 2 (Niche Signals):**
- ArXiv (research, AI/systems)
- GitHub Trending (tools, libraries)
- Dev.to (practice-focused)
- A16Z, Sequoia (company building)
- Industry analyst reports (Gartner, Forrester)

**Tier 3 (Evergreen):**
- Official docs (new releases)
- Company blogs (technical announcements)
- YouTube channels (video tutorials)
- Podcasts (long-form analysis)

**Avoid:**
- Paywalled content without summary
- Fluff / clickbait / low-substance
- Content >30 days old (unless canonical)
- Duplicate or conflicting pieces

## Content Scoring Matrix

Score each piece 0–100 for predicted community engagement.

| Criterion | High (25 pts) | Medium (15 pts) | Low (5 pts) |
|---|---|---|---|
| **Relevance** | Directly addresses member pain/interest | Adjacent to community interests | Tangential |
| **Novelty** | New technique, research, or framework | Updates on known topic | Recap of old ideas |
| **Actionability** | Immediately applicable, code/tool included | Requires thought to apply | Conceptual/theoretical |
| **Authority** | Industry luminary, peer-reviewed | Well-respected author | Unknown/unvetted |
| **Community Interest** | Matches 3+ member interest tags | Matches 1–2 member interests | Niche interest only |

**Threshold:** Score >70 for posting; 50–70 for selective audience; <50 for skip.

## Post Format

**Post Structure:**
1. Hook (1–2 sentences): What is this? Why does it matter?
2. Key Insight (3–5 bullet points): What are the main takeaways?
3. Community Angle (1–2 sentences): Why is this relevant to us?
4. Discussion Prompt (1 question): What should we discuss?
5. Link: [Title](URL)

**Word Count:** 80–150 words max. Skim-able in 30 seconds.

**Tone:** Editorial but warm. You're introducing friends to something worth their time.

## Discussion Prompt Design

The prompt should spark thinking without being prescriptive:

- **For technical content:** "What's your experience with [approach/tool]? Any gotchas?"
- **For research:** "Does this match what you've seen in production, or different?"
- **For commentary:** "What's your take on [claim]? Do you agree?"
- **For tools/libraries:** "Is anyone using this? What's the learning curve?"
- **For company/culture:** "How does this compare to how your team operates?"

## Output Format

```
## Content Curation — [Date]

### Piece [1/5]: [Title]

**Source:** [Author] — [Publication] — [Date]
**URL:** [link]

**Relevance Score:** [0–100] ([Reason: why this matters for community])

**Key Insights:**
- [Insight 1]
- [Insight 2]
- [Insight 3]

**Community Angle:**
[1–2 sentences: Why is this relevant to our members?]

---

### Draft Post

[Draft post: 80–150 words, with discussion prompt]

---

[Repeat for each piece]

---

## Publication Recommendation

**Tier 1 (Post Immediately):**
- Score 85+: Post to main feed + pin for 24h

**Tier 2 (Post with Selective Promotion):**
- Score 70–84: Post to main feed; tag relevant member segments

**Tier 3 (Post to Specific Channel):**
- Score 50–69: Post to interest-specific channel (#product-feedback, #engineering, etc.)

**Tier 4 (Share 1:1):**
- Score 40–49: Share with 2–3 members directly who flagged interest

**Tier 5 (Skip):**
- Score <40: Pass; not relevant enough
```

## Member Interest Tagging

Tag each piece with member interest categories (from CLAUDE.md):
- #engineering #architecture #design
- #career-advice #leadership #hiring
- #product-feedback #business #metrics
- #tools #startups #innovation

## Example

**Piece:** "The Art of the Long-Term Roadmap" by Sarah Chen (Stripe Blog)

**Relevance Score:** 82/100

**Reason:** Directly addresses product strategy, aligns with #product-feedback and #business segments (60+ members).

**Key Insights:**
- Long-term roadmaps need 18–24 month horizon, not quarterly
- Communicate trade-offs and why, not just what
- Involve 3+ functions (eng, product, design) early

**Community Angle:**
Many of our members are managing product roadmaps. Sarah's framework (from Stripe's scale) is directly applicable even at smaller teams.

---

### Draft Post

**The art of the long-term roadmap (and why 1-year horizons fail)**

Sarah Chen just shared how Stripe builds 18–24 month roadmaps without losing quarterly agility. Key insight: communicate trade-offs explicitly, not just features. Involves engineering, product, and design from the start.

This feels directly relevant to the roadmap challenges coming up in our #product-feedback thread this week.

[Full post: Sarah's framework + 3 key moves](link)

**Discussion:** What's your roadmap horizon? How do you balance long-term vision with quarterly execution?

---
