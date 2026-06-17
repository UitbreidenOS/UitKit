# Output Reviewer Skill

## When to activate
Before sending any newsletter, or when user runs `/review-draft` to audit a complete newsletter for quality, brand fit, and engagement potential.

## When NOT to use
Do not use this skill to evaluate drafts that are still in early ideation—wait until a complete draft exists.

## Instructions

1. **Check engagement hooks**
   - Does the opening sentence intrigue or provoke?
   - Is it specific (not generic)?
   - Would a subscriber want to keep reading?
   - Flag if hook is weak or unclear

2. **Verify clarity and readability**
   - Each section has one clear idea
   - Sentences are short and active voice
   - No unexplained jargon or acronyms
   - Technical terms are defined
   - Flag any sections that feel unclear or redundant

3. **Scan for banned words and tone slips**
   - Search for: synergy, revolutionary, game-changer, delve, robust, leverage, holistic, ecosystem, disruptive, innovative, paradigm, seamlessly, unlock value, reach out, per my last email
   - Check tone is conversational, not corporate
   - Verify voice is knowledgeable, not patronizing
   - Flag tone issues with examples and fixes

4. **Validate structure and length**
   - Body is 300–800 words? Optimal is 500–600
   - Subject line is <50 characters?
   - Preview text is 40–80 characters?
   - CTA is single and clear?
   - No link sprawl?
   - Flag length or structure issues with specific counts

5. **Check brand consistency**
   - Does this align with the newsletter's voice and values?
   - Does it match prior newsletters in style and depth?
   - Appropriate for the audience?
   - Flag any misalignment with brand guidelines

6. **Verify all sources and claims**
   - Are data points attributed to a source?
   - Are expert quotes accurate and sourced?
   - Are any claims too broad or unsupported?
   - Flag unverified claims or missing attribution

7. **Validate links and CTAs**
   - Are all URLs properly formatted (http/https)?
   - Do they exist and are they relevant?
   - Is the CTA clear and actionable?
   - Flag broken, missing, or vague CTAs

8. **Generate audit report**
   - Pass/Fail decision (Ready to Send / Needs Edits)
   - Issues found (if any) with examples and fixes
   - Suggestions for improvement
   - Estimated impact on open rate and engagement

## Format

```
## REVIEW REPORT: [Newsletter Title]

**Status:** [PASS / NEEDS EDITS]

**Summary:** [1–2 sentences on overall quality and readiness]

### Engagement & Hook
[Analysis of opening, interest factor, specificity]
- [ ] Strong opening hook
- [x] Clear audience value
- [ ] Specific and data-backed

### Clarity & Readability
[Analysis of structure, jargon, flow]
- [x] Clear sections with single ideas
- [x] No unexplained jargon
- [x] Active voice throughout

### Tone & Brand Fit
[Analysis of voice, authority, brand alignment]
- [x] Conversational and expert
- [x] Consistent with prior newsletters
- [ ] Issue: Uses "ecosystem" once — suggest "context" instead

### Length & Structure
- Body: 487 words [✓ within 300–800 range]
- Subject line: "5 AI Trends..." [✓ 19 chars]
- Preview text: "Here's what actually..." [✓ 45 chars]
- CTA: Single, clear [✓]

### Sources & Accuracy
- [x] 2 data points with sources
- [x] 2 expert quotes with attribution
- [x] No unsupported claims

### Links & CTAs
- [x] 2 links tested and working
- [x] CTA is specific ("reply with your biggest blocker")

### Brand Alignment
[Analysis vs. audience and prior newsletters]
- [x] Appropriate depth for audience
- [x] Matches tone of prior editions
- [x] Clear value for subscriber

---

## ISSUES FOUND

**Minor (1):**
1. Line 3, "Enterprises stopped chasing every AI announcement" — add specific reason why (e.g., "after $X billion in failed pilots")

**None**

---

## RECOMMENDATION

**Status:** PASS — Ready to send with optional minor edit above.

**Estimated Open Rate:** 28–32% (strong hook, specific data, expert voices)
**Estimated CTR:** 5–7% (clear CTA, relevant resource)

**Next Steps:** Optional edit on Minor issue above. Subject line test: Use Option A ("5 AI Trends...") for highest predicted open rate vs. Options B and C.
```

---

**Tags:** #quality-assurance #content-review #editorial-checklist
