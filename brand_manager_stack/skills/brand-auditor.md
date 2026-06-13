---
name: brand-auditor
description: Audits brand presence across web; checks tone consistency, message alignment, visual identity adherence, and brand voice. Returns audit report with pass/fail on each dimension and specific recommendations.
allowed-tools: Read, WebFetch, WebSearch
effort: medium
---

# Brand Auditor

## When to activate

Before launching any major brand campaign or content. You have a brand identity, messaging pillars, and tone guidelines in place. This skill audits your current web presence (website, social, blog, press) against those guidelines and surfaces inconsistencies or drift.

## When NOT to use

Not for competitive analysis — use Competitor Analyst for that. Not for real-time monitoring — use Brand Monitor for ongoing surveillance. Not for individual content pieces — use Tone Enforcer for that. Not without a defined brand identity and messaging framework already established.

## Audit Dimensions

**1. Tone Consistency**
Scans website copy, blog posts, social posts, and emails. Check for banned words, corporate jargon, passive voice, hedging language. Mark pass/fail with specific examples.

**2. Message Alignment**
Does copy on each channel reflect your core value proposition and messaging pillars? Or is it drifting toward competitor positioning or generic product language? Return score 0–100.

**3. Visual Identity**
Logo usage, color palette, typography, imagery style. Are all assets aligned to brand guidelines? Any off-brand visuals or outdated assets?

**4. Content Quality**
Blog posts, guides, whitepapers. Are they backed by data and customer examples? Or is it fluffy marketing speak? Rate proof density and specificity.

**5. Channel Coherence**
Compare messaging across website, LinkedIn, Twitter, email, blog. Is the narrative consistent or fragmented? Do channels have a unified voice or are they siloed?

## Output Format

Return audit report in this format:

```
# Brand Audit Report

**Date:** [ISO date]
**Brand:** [Your company name]
**Audit Scope:** [Website, blog, social, email, etc.]

---

## Summary

**Overall Score:** [0–100]
**Key Findings:** [Top 3 issues]
**Recommendations:** [Top 3 actions]

---

## Dimension Scores

| Dimension | Score | Status | Notes |
|---|---|---|---|
| Tone Consistency | X/100 | PASS / NEEDS WORK | [Example violations] |
| Message Alignment | X/100 | PASS / NEEDS WORK | [Drift examples] |
| Visual Identity | X/100 | PASS / NEEDS WORK | [Inconsistencies] |
| Content Quality | X/100 | PASS / NEEDS WORK | [Proof gaps] |
| Channel Coherence | X/100 | PASS / NEEDS WORK | [Fragmentation] |

---

## Detailed Findings

### Tone Consistency
[List specific examples of banned words, jargon, passive voice found in your content]

### Message Alignment
[Show examples where messaging drifts from core pillars, and where it's on-brand]

### Visual Identity
[List inconsistencies in logo usage, color, typography, or imagery]

### Content Quality
[Assess proof density, customer evidence, data backing claims]

### Channel Coherence
[Compare messaging across channels; flag silos or inconsistent narratives]

---

## Recommendations (Priority Order)

1. [First action to improve audit score]
2. [Second action]
3. [Third action]

---

**Next Step:** Present findings to human for review. Human approves actions or prioritizes differently.
```

## Example

**Brand Audit Report**

**Date:** 2026-06-12
**Brand:** Acme SaaS
**Audit Scope:** Website, blog, LinkedIn, Twitter

---

## Summary

**Overall Score:** 62/100
**Key Findings:**
- Website copy uses "robust," "world-class," and "leverage" (all banned)
- LinkedIn has conversational voice; website is corporate
- Blog posts lack customer quotes and proof points

**Recommendations:**
1. Rewrite website homepage and feature pages (remove 8 banned words)
2. Update LinkedIn strategy to match website tone (or vice versa)
3. Add customer quotes and case metrics to 5 recent blog posts

---

## Dimension Scores

| Dimension | Score | Status | Notes |
|---|---|---|---|
| Tone Consistency | 55/100 | NEEDS WORK | Found "robust," "leverage," "disruptive" on pricing page |
| Message Alignment | 75/100 | PASS | Website clearly shows value prop, but email is generic |
| Visual Identity | 85/100 | PASS | Logo and colors consistent; 1 outdated screenshot on blog |
| Content Quality | 50/100 | NEEDS WORK | Most blog posts lack customer examples; heavy on features, light on outcomes |
| Channel Coherence | 65/100 | NEEDS WORK | Website = corporate, LinkedIn = conversational, Twitter = casual. Fragmented. |

---
