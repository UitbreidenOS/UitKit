# Subject Line Optimizer Skill

## When to activate
Before sending any newsletter to test subject line variations and predict open rate performance. Can also be run during drafting to iterate on hooks.

## When NOT to use
Do not use this skill if you have only one subject line variation—the point is to test multiple approaches and select the strongest performer.

## Instructions

1. **Generate 3 subject line variations** (if not already provided)
   - Variation A: Curiosity/question-based (opens with intrigue, not benefit)
   - Variation B: Data/number-based (leads with specific stat or percentage)
   - Variation C: Urgency/newsworthiness-based (implies timeliness or consequence)

2. **Validate each against constraints**
   - All must be <50 characters
   - All must be clear and free of jargon
   - All must accurately represent the newsletter content
   - No misleading or clickbait tactics

3. **Score each variation**
   - Predicted open rate (0–100%)
   - Engagement likelihood (1–5 stars)
   - Clarity/specificity (1–5)
   - Brand alignment (1–5)

4. **Provide reasoning for scores**
   - Why might A outperform B?
   - Which variation speaks to which segment of the list?
   - Are there any liabilities in the strongest performer?

5. **Recommend test approach**
   - Primary subject line (highest predicted open rate)
   - Backup lines if primary underperforms
   - Note on audience factors (industry, company size, list quality)

6. **Log to session**
   - Winning subject line, predicted open rate, reason selected

## Format

```
## SUBJECT LINE TEST: [Newsletter Topic]

**Winning Line:** [Selected subject line]
**Predicted Open Rate:** [X%]

---

### Variation A: Curiosity-Based
**Subject:** "5 AI Trends Reshaping Enterprise Tech (Q2 2026)"
**Characters:** 19
**Predicted Open Rate:** 28–32%
**Stars:** ★★★★☆ (4/5 engagement)
**Clarity:** ★★★★★ (5/5 — specific, timely)

**Reasoning:** Leads with number (proven open rate booster), includes time frame (newsworthiness), speaks to enterprise focus. Risk: "Trends" is slightly overused, but specificity mitigates.

---

### Variation B: Data-Driven
**Subject:** "Enterprise AI Consolidation Is Here (New Data)"
**Characters:** 22
**Predicted Open Rate:** 26–30%
**Stars:** ★★★★ (4/5 engagement)
**Clarity:** ★★★★ (4/5 — specific but less timely feel)

**Reasoning:** Direct claim backed by data signal. Speaks to skeptical/pragmatic segment. Slightly lower predicted open rate because "consolidation" is less emotionally resonant than "reshaping."

---

### Variation C: Urgency-Based
**Subject:** "Why Most Enterprise AI Projects Will Fail"
**Characters:** 20
**Predicted Open Rate:** 29–33%
**Stars:** ★★★★★ (5/5 engagement)
**Clarity:** ★★★ (3/5 — contrarian but less clear on topic)

**Reasoning:** High urgency and emotion drive opens. Contrarian angle attracts click-throughs. Risk: May attract misaligned audience interested in failure stories rather than solutions. Strong for technical/skeptical lists; weaker for optimistic/early-adopter lists.

---

## RECOMMENDATION

**Primary:** Variation A — "5 AI Trends Reshaping Enterprise Tech (Q2 2026)"
**Backup 1:** Variation C (if primary underperforms—test with smaller segment first)
**Backup 2:** Variation B (lower risk, solid performer)

**Testing Strategy:**
- Send Variation A to 70% of list
- Send Variation C to 20% (test higher engagement segment)
- Send Variation B to 10% (control)
- Report opens, clicks, unsubscribes by variant

**Audience Factor:** If list skews toward CTOs/engineers, Variation C may outperform. If list is mixed buyer/influencer, Variation A is safest bet.
```

---

**Tags:** #email-marketing #subject-line #a-b-testing
