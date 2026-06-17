# Analytics Tracker Skill

## When to activate
After a newsletter is sent, to log performance data (opens, clicks, unsubscribes, engagement metrics) and extract insights for future editions.

## When NOT to use
Do not use this skill before send date. Only activate once performance data is available (24–48 hours post-send minimum for reliable data).

## Instructions

1. **Collect performance metrics**
   - Total recipients sent
   - Opens (count and %)
   - Clicks (count and % of opens)
   - Unsubscribes (count and % of recipients)
   - Bounce rate (if applicable)
   - Device/client opens (if data available)

2. **Analyze by subject line variant** (if A/B tested)
   - Which variant had highest open rate?
   - Did predicted open rate match actual?
   - Any differences in click-through by variant?
   - Log winning variant for future reference

3. **Benchmark against priors**
   - How does this newsletter compare to last 3 sends?
   - Are opens trending up/down?
   - Is engagement (CTR) improving?
   - Flag any significant changes (>10% variance)

4. **Analyze engagement depth**
   - Which sections/CTAs got the most clicks?
   - Did readers click through or just open?
   - Are there patterns in what content drives engagement?
   - Identify strongest and weakest sections

5. **Extract subscriber feedback** (if available)
   - Replies received (if applicable)
   - Unsubscribe reasons (if collected)
   - Social engagement (shares, retweets)
   - Surveys or feedback forms

6. **Identify trends and learnings**
   - What subject line type won?
   - What topic resonated most?
   - What length/format works best?
   - Patterns in unsubscribe reasons

7. **Update session log**
   - Log newsletter name, metrics, insights, next-step recommendations
   - Flag high-performing content for reuse or expansion

8. **Generate recommendations**
   - For next newsletter: topic, structure, length, subject line strategy
   - Content to avoid or double down on
   - List segment trends (if data available)

## Format

```
## PERFORMANCE REPORT: "5 AI Trends Reshaping Enterprise Tech"

**Send Date:** 2026-06-13 | **Send Time:** 09:00 UTC  
**Recipients:** 12,400  

---

### Engagement Metrics

| Metric | Count | % |
|---|---|---|
| **Opens** | 3,658 | 29.5% |
| **Clicks** | 215 | 5.9% of opens |
| **Unsubscribes** | 8 | 0.06% |
| **Bounces** | 12 | 0.1% |
| **Replies** | 14 | 0.11% |

**Open Rate:** 29.5% (Predicted: 28–32% ✓ Within expected range)  
**CTR:** 5.9% (Strong engagement)  
**Unsubscribe Rate:** 0.06% (Excellent; well below 0.5% target)  

---

### Subject Line A/B Test Results

| Variant | Recipients | Opens | Open Rate | Clicks | CTR |
|---|---|---|---|---|---|
| **A: "5 AI Trends..." [Primary]** | 8,680 | 2,638 | 30.4% | 165 | 6.3% |
| **C: "Why Most Enterprise AI..." [Urgency]** | 2,480 | 705 | 28.4% | 38 | 5.4% |
| **B: "Consolidation Is Here..." [Control]** | 1,240 | 315 | 25.4% | 12 | 3.8% |

**Winner:** Variant A (30.4% open rate). Data-driven approach with number + urgency slightly outperformed pure urgency angle.

---

### Content Performance (Link Clicks)

| Section/CTA | Clicks | % of Total |
|---|---|---|
| **CTA: Reply with blockers** | 112 | 52% |
| **Link: Full McKinsey report** | 68 | 32% |
| **Link: Expert commentary** | 25 | 12% |
| **Other** | 10 | 4% |

**Insight:** The "reply with blockers" CTA was strongest—suggests audience wants to engage directly, not just consume. Consider adding more reply-based CTAs.

---

### Benchmark vs. Prior Sends

| Edition | Open Rate | CTR | Unsubscribe % |
|---|---|---|---|
| **Current (Trends)** | 29.5% | 5.9% | 0.06% |
| **2 weeks ago (Q2 Report)** | 27.2% | 4.8% | 0.08% |
| **4 weeks ago (Consolidation)** | 26.1% | 3.9% | 0.12% |
| **8 weeks ago (Platform Wars)** | 24.8% | 3.2% | 0.15% |

**Trend:** Trending up. Open rate +18% vs. 8 weeks ago. Engagement and unsubscribe health both improving.

**Hypothesis:** Including specific data points and expert quotes (vs. general commentary) drives higher opens and clicks.

---

### Subscriber Feedback

**Replies (14 total):**
- 8 responses to "blockers" CTA with specific use case challenges
- 3 requests for follow-up deep dives on agentic workflows
- 2 disagreements with "consolidation" thesis (want counter-argument)
- 1 subscription inquiry

**Unsubscribe Reasons (8 total):**
- 4 "Too frequent" (sending every week; suggest bi-weekly)
- 2 "Not relevant to my role" (sales ops, not tech ops)
- 2 No reason given

---

### Key Insights & Learnings

1. **Data-driven + timely = higher opens.** Subject line A outperformed urgency/contrarian approach. Combination of number + recency is the strongest opener.

2. **Direct engagement beats passive consumption.** Reply-based CTA (52% of clicks) dominated over link CTAs. Readers want to contribute, not just read.

3. **Reply velocity is strong.** 14 replies in 48 hours suggests engaged, responsive audience. Consider building more two-way dialogue.

4. **Frequency feedback emerging.** Unsubscribe reasons signal list fatigue with weekly cadence. Consider testing bi-weekly send.

5. **Topic/depth resonating.** Open rate improvement trend suggests longer-form, data-backed content is outperforming shorter takes.

---

### Recommendations for Next Newsletter

1. **Continue weekly cadence for now, but A/B test bi-weekly** with subset of list in next 4 weeks
2. **Lead with data/numbers + timely angles** in subject lines (Variant A approach)
3. **Increase reply-based CTAs** — experiment with 2 in next newsletter vs. 1
4. **Address the counter-argument:** Next week, include contrarian take on consolidation (from feedback)
5. **Topic selection:** Agentic workflows is clear follow-up (3 explicit requests). Schedule for week after next.

---

**Next Action:** Log feedback, update topic roadmap, schedule agentic workflows deep dive, plan bi-weekly A/B test.
```

---

**Tags:** #analytics #performance-tracking #engagement-analysis
