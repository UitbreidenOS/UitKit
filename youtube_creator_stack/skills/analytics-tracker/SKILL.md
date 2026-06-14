# analytics-tracker

## When to activate

Daily (24–48 hours after video publishes). Tracks views, watch time %, CTR, audience retention, and engagement metrics.

## When NOT to use

- Before video is published (YouTube needs 24 hours to generate meaningful data).
- On unlisted or private videos (no public analytics data).
- Without YouTube API access (skill requires real-time metrics).

## Instructions

1. **Input:** Video ID, publish date, target metrics (views, watch time, CTR, retention).
2. **Fetch YouTube Analytics data:**
   - Views (total and daily breakdown)
   - Watch time % (average watch duration / video length)
   - Click-through rate % (clicks to video / impressions)
   - Audience retention (per-minute drop-off)
   - Likes, comments, shares
   - Subscriber gain from video
3. **Compare to channel benchmarks:**
   - Average CTR for channel
   - Average watch time % for channel
   - Average viewer retention pattern
4. **Identify performance signals:**
   - If CTR >5%, title/thumbnail is strong
   - If watch time >50%, content hooks and pacing work
   - If retention drops >50% at 3 min mark, hook is weak
   - If subscriber gain >1% of views, content resonates
5. **Output:** Performance dashboard with metrics, benchmarks, and actionable insights.

## Example

**Input:**
- Video: "This AI Edits Videos For You (I Was Wrong)"
- Publish date: 2026-06-10
- Data window: 72 hours post-publish
- Channel avg CTR: 4.2%; avg watch time: 48%

**Output:**

**PERFORMANCE DASHBOARD — 72 Hours**

**Traffic Metrics:**
- Views: 2,840
- Impressions: 68,500
- CTR: 4.1% (benchmark: 4.2%) — On par
- Clicks: 2,808

**Engagement Metrics:**
- Watch time (total): 1,847 minutes
- Avg watch duration: 5:18 (of 12:00 video)
- Watch time %: 44% (benchmark: 48%) — 4 pts below target
- Likes: 142 (5% engagement rate)
- Comments: 28 (engaging audience)
- Shares: 12 (high quality signal)

**Audience Retention:**
- 0:00–0:15: 100% (hook effective)
- 1:00: 94% (maintained attention)
- 3:00: 78% (slight drop; section transition may need tighter pacing)
- 6:00: 68% (mid-video drop; typical for 12-min videos)
- 10:00: 52% (outro section; acceptable)
- End-card: 18% (normal drop-off)

**Subscriber Impact:**
- New subscribers from video: 47
- Subscriber gain %: 1.66% of views (excellent signal)

**KEY INSIGHTS:**

**Strengths:**
- CTR is on benchmark (title and thumbnail working)
- Subscriber conversion is strong (1.66% exceeds typical 0.5–1%)
- Comment count is healthy (engaged audience)

**Opportunities:**
- Watch time is 4 pts below benchmark (44% vs 48%)
- Retention dip at 3:00 mark suggests pacing issue in transition
- Consider adding B-roll or visual change at 3:00 for next video

**Recommendations:**
- Keep this title/thumbnail format (CTR performing)
- Review section transitions for tighter pacing
- Consider 10–11 min video length for future videos (48% watch time target easier to hit)
- Replicate subscriber-conversion hook structure in next video

**Performance Grade: B+ (strong CTR, excellent subscriber conversion, watch time below target)**

---

**Output:** Views, CTR, watch time %, retention curve, subscriber gain, benchmarks, and actionable insights.
