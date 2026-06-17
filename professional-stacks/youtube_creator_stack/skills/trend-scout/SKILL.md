# trend-scout

## When to activate

Daily. Surface emerging topics in creator's niche; rank by growth velocity, search volume, and competitive gap.

## When NOT to use

- For validation of known topics (use topic-analyzer instead).
- On niche topics requiring deep creator expertise (coordinate with competitor-analyzer).
- Without Exa access (trends require real-time data).

## Instructions

1. **Input:** Creator niche, target audience, preferred content pillars.
2. **Run Exa trending search:**
   - Last 30 days of growth data
   - Filter by creator's niche/industry
   - Exclude declining topics
3. **Score each trending topic:**
   - Growth rate: +50%+ = 25 pts; +25–50% = 15 pts; <25% = 5 pts
   - Search volume: 100K+ = 25 pts; 10K–100K = 15 pts; <10K = 5 pts
   - Competitive gap: <5 competitors = 25 pts; 5–15 = 15 pts; >15 = 5 pts
   - Creator relevance: Direct fit = 25 pts; related = 15 pts; stretch = 5 pts
4. **Rank by viability score.** Top 3–5 trending topics with action items.
5. **Output:** Ranked list of 5 trending topics with growth %, search volume, competitor count, and recommended next action (analyze with topic-analyzer, research with competitor-analyzer, or skip).

## Example

**Input:** Niche: AI/productivity tools; Audience: Entrepreneurs, developers

**Output:**

**Today's Trending Topics (Ranked by Viability)**

**#1: AI Code Review Tools**
- Growth: +78% (last 30 days)
- Search volume: 32K/month
- Competitors: 4 major players
- Score: 85 — **GO**
- Action: Run /analyze-topic immediately

**#2: Prompt Engineering for Customer Support**
- Growth: +65%
- Search volume: 28K/month
- Competitors: 7 players
- Score: 78 — **GO**
- Action: Run /analyze-topic

**#3: AI PDF Analyzers & Document Processing**
- Growth: +52%
- Search volume: 18K/month
- Competitors: 12 players
- Score: 70 — **GO**
- Action: Run /analyze-topic after competitor research

**#4: Open-source LLMs for Business**
- Growth: +48%
- Search volume: 9K/month
- Competitors: 3 niche players
- Score: 65 — **CAUTION**
- Action: Validate audience demand before committing

**#5: AI Email Automation**
- Growth: +31%
- Search volume: 22K/month
- Competitors: 18+ major brands
- Score: 52 — **CAUTION**
- Action: Check competitor gap before investment

**Next steps:** Run /analyze-topic on #1–3. Schedule /script-draft for highest-scoring topic if score ≥60.

---

**Output:** Top 5 trending topics with growth %, search volume, competitor count, viability score, and recommended action.
