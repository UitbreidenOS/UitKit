# seo-validator

## When to activate

PostToolUse: After script optimization and before publishing. Validates keyword density, title format, description, and tag optimization.

## When NOT to use

- Before script is finalized (validator checks completed work only).
- On drafts without keywords (run topic-analyzer first for keyword list).
- For non-video content (skill is YouTube-specific).

## Instructions

1. **Input:** Script, title, description, tags, keywords.
2. **Validate keyword density:**
   - Primary keyword: 1–2% of total words (ideal 1.5%)
   - Secondary keywords: 1–1.5% each
   - Flag if >3% (over-optimization signals spam)
   - Flag if <0.5% (under-optimization misses discovery)
3. **Validate title:**
   - Length: 50–60 characters (optimal for CTR)
   - Flag if <40 or >70 chars
   - Primary keyword in first 3 words (boosts ranking)
   - No clickbait (promise must match content)
   - Flag misleading promises
4. **Validate description:**
   - First 150 characters hook (visible before "read more")
   - Keywords naturally distributed (not forced)
   - Timestamps for chapters (increases engagement)
   - Links to resources (1–3 maximum, all relevant)
   - CTA present (subscribe, join, visit)
5. **Validate tags:**
   - 10–15 tags total
   - Ranked by search volume
   - Primary keyword as first tag
   - No irrelevant tags (YouTube penalizes)
6. **Output:** Validation report with PASS/FAIL per category, specific flags, and recommendations.

## Example

**Input:**
- Title: "This AI Edits Videos For You (I Was Wrong)"
- Keywords: AI editing (primary), video editing software, automation
- Description: [12-min YouTube description with timestamps]
- Tags: [15 tags]
- Script: [12-min script with keywords]

**Output:**

**VALIDATION REPORT**

**Title (57 chars):** PASS ✓
- Length: optimal (50–60 range)
- Primary keyword "AI Edits" in first 3 words ✓
- No clickbait; promise matches content ✓

**Keyword Density:** PASS ✓
- "AI editing": 1.6% (ideal) ✓
- "video editing software": 1.2% (ideal) ✓
- "automation": 0.8% (acceptable) ✓
- Overall density: healthy (no over-optimization)

**Description:** PASS ✓
- Hook in first 150 chars: strong ✓
- Timestamps for 6 chapters: present ✓
- Resource links: 4 (within acceptable range) ✓
- CTA present: "Subscribe + Join community" ✓

**Tags:** PASS ✓
- Count: 14 tags (10–15 range) ✓
- Primary keyword "AI video editing" as first tag ✓
- All tags relevant to content ✓
- No irrelevant spam tags ✓

**FINAL VERDICT:** APPROVED FOR PUBLISHING ✓

**Minor suggestions (not blocking):**
- Consider adding "free AI tools" tag if budget-conscious audience is target
- Reorder secondary tags to group by relevance (editing tools, automation tools, creator tools)

---

**Output:** PASS/FAIL verdict, validation details per category, blocking issues, non-blocking recommendations.
