---
description: Audit any brand content (blog, social, email, ad copy) for tone compliance, banned words, message alignment, and brand fit. Returns pass/fail verdict with specific fixes. Checks proof density, passive voice, hedging, and voice consistency.
---

# /review-content

## What This Does

Executes a comprehensive content audit pipeline. Takes any brand asset you've drafted (blog post, social post, email, ad copy, case study, etc.). Validates against your brand guidelines: tone rules, banned words, message alignment, proof density, and voice consistency. Returns a detailed audit report with specific violations and suggested fixes. Stops at critical issues (banned words, false claims) and flags high-priority tone drift. Passes only when content is publication-ready.

## Steps Claude Follows

1. **Collect inputs**: Ask for content to review (paste or link to file). Ask for format type (blog, social, email, etc.) and which messaging pillar(s) it supports.
2. **Run tone-enforcer skill**: Audit for banned words, jargon, passive voice, hedging, proof density, and tone consistency. Generate violation list and suggestions.
3. **Check message alignment**: Does content clearly reference the supporting pillar? Does it lead with customer value or company value?
4. **Assess proof density**: Are claims backed by data, customer quotes, or case studies? Or are they unsupported assertions?
5. **Review brand voice**: Does tone match your brand voice guidelines? Formal vs. casual? Conversational vs. authoritative?
6. **Return verdict**: PASS (publication-ready), PASS WITH MINOR EDITS (fix 1–2 items), or NEEDS WORK (multiple violations require rework).
7. **Provide fixes**: For each violation, show current text and suggested replacement.
8. **Log to session**: Auto-log content review to session-log.md with verdict and any editor notes.

## Output Format

```
# Content Review Report

**Content:** [Title]
**Format:** [Blog / Social / Email / Ad / Case Study]
**Pillar:** [Which pillar this supports]
**Reviewer:** Claude
**Review Date:** [ISO date]

---

## Verdict: [PASS / PASS WITH MINOR EDITS / NEEDS WORK]

**Overall Score:** [0–100]  
**Critical Issues:** [Count of hard blockers]  
**High Priority:** [Count of significant issues]  
**Minor Issues:** [Count of style notes]

---

## Violations

### Critical (Hard Block)
- [Issue]: [Current text] → **Suggested:** [Fixed text]
- [Issue]: [Current text] → **Suggested:** [Fixed text]

### High Priority
- [Issue]: [Current text] → **Suggested:** [Fixed text]
- [Issue]: [Current text] → **Suggested:** [Fixed text]

### Medium Priority
- [Issue]: [Current text] → **Suggested:** [Fixed text]

### Low Priority
- [Style note]: [Suggestion]

---

## Proof Density Check

| Claim | Proof Type | Status |
|---|---|---|
| [Claim 1] | [Data / Quote / Case Study / None] | PASS / NEEDS PROOF |

---

## Brand Voice Assessment

**Tone Alignment:** [Score 0–100]
**Passive Voice:** [Percentage of sentences] — [Pass / Flag]
**Hedging Language:** [Count] — [Pass / Flag]
**Proof-First Lead:** [Pass / Flag]

---

## Next Steps

**If PASS:** Ready for publication.
**If PASS WITH MINOR EDITS:** Make [X] fixes above and reply with updated text for final check.
**If NEEDS WORK:** Rework per violations above and resubmit for full review.
```

## Example Run

```
You: /review-content

Claude: I'll review your content against brand guidelines. Please provide:
- Content to review (paste text)?
- Format type (blog, social, email)?
- Which pillar does it support?

You: [Pastes blog post about security reviews]
Blog post, supports "Ship Securely, Not Slowly" pillar

Claude: Reviewing your blog post...

---

# Content Review Report

**Content:** "Ship Faster With Enterprise Security Built In"
**Format:** Blog Post
**Pillar:** Ship Securely, Not Slowly
**Reviewer:** Claude
**Review Date:** 2026-06-12

---

## Verdict: ✓ PASS WITH MINOR EDITS

**Overall Score:** 92/100
**Critical Issues:** 0
**High Priority:** 2
**Minor Issues:** 1

---

## Violations

### Critical (Hard Block)
None.

### High Priority
- **Jargon**: "paradigm shift" (paragraph 2) → **Suggested:** "shift in how we think about security"
- **Passive voice**: "Security should be baked in" (intro) → **Suggested:** "We bake security in, not bolt it on"

### Medium Priority
None.

### Low Priority
- **Wordiness**: "This cycle kills velocity" — already strong, no change needed

---

## Proof Density Check

| Claim | Proof Type | Status |
|---|---|---|
| "Security reviews go from 2 weeks to 2 days" | Customer quote (Sarah Chen) | PASS |
| "90% reduction in security-driven delays" | Math calculation shown | PASS |
| "Stripe has made security-first a competitive advantage" | Reference only, no link | NEEDS PROOF |

---

## Brand Voice Assessment

**Tone Alignment:** 92/100 (excellent)
**Passive Voice:** 8% (target <10%) — **PASS**
**Hedging Language:** 1 instance ("It feels like") — **Flag for revision**
**Proof-First Lead:** Opening leads with customer problem, not company claim — **PASS**

---

## Next Steps

**Make these 2 fixes:**
1. Replace "paradigm shift" → "shift in how we think about security"
2. Replace "Security should be baked in" → "We bake security in, not bolt it on"
3. Add link/citation for Stripe claim

**Reply with updated text and I'll do final verification.**
```

## Quick Audit vs. Full Review

**Quick audit** (30 seconds): Check for banned words and critical violations only.
**Full review** (2–3 minutes): Complete tone, proof, voice, and alignment check. Recommended before publication.

Use `/review-content` for full reviews before publishing any campaign asset.
