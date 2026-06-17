# /script-draft

## Summary

Generate SEO-optimized script with chapters, keywords, CTAs, and 3 thumbnail concepts for creator review and approval.

## Syntax

```
/script-draft [topic] [length] [audience]
```

## Parameters

- `topic` (required): Video topic (e.g., "AI video editing tools comparison")
- `length` (optional, default "12 min"): Video length (range "8–20 min")
- `audience` (optional): Target audience descriptor (e.g., "content creators, entrepreneurs")

## What It Does

1. Validates topic viability (runs /analyze-topic; GO score ≥60 required).
2. Analyzes top competitors (runs competitor-analyzer).
3. Extracts primary and secondary keywords.
4. Generates full script with:
   - Hook (first 15 seconds)
   - Problem statement
   - 3–5 main sections with pacing
   - Real examples or case studies
   - CTAs (max 2 per video)
   - Estimated word count and read time
5. Runs SEO validation (keyword density, title optimization).
6. Generates 3 distinct thumbnail concepts with design rationale.
7. Generates metadata: title, description, tags, chapters.
8. Presents for creator review before approval.
9. Logs to session-log.md (DRAFT status).

## Output

- **Full script** with timestamps and chapter breaks
- **SEO analysis** (keyword density report, title score)
- **3 thumbnail concepts** with color codes, text specs, and hooks
- **Metadata bundle:**
  - Optimized title (50–60 chars)
  - Full description with timestamps and links
  - 10–15 ranked tags
  - Chapter markers
- **Production checklist** (hook approval, pacing review, CTA placement)
- **Status:** DRAFT — Ready for creator review

## Example

```
/script-draft "This AI Edits Videos For You" "12 min" "content creators"

SCRIPT GENERATION — DRAFT STATUS

Topic: This AI Edits Videos For You
Viability: 85 (GO) ✓
Length: 12 minutes (~1,800 words)
Status: DRAFT (pending creator approval)

---

SCRIPT

[0:00] HOOK (15 sec)
"In the last 90 days, 7 major AI video editors launched. I tested all of them. 
Here's which one actually saved me 20 hours per month."

[0:15] PROBLEM (30 sec)
"If you're a content creator, you know the grind: shoot, edit, export, upload. 
Video editing consumes 60% of your production time. That's where most creators fail."

[1:00] SECTION 1: Which AI Editors Exist (2 min)
- Runway AI: cloud-based, team collaboration
- Adobe Firefly: integrated with Creative Cloud
- Descript: AI editing for podcasts and video
[Keywords: "automated video editing", "AI tools for creators"]

[3:00] SECTION 2: Testing Methodology (1 min)
Real example: 1-hour raw footage, same editing brief across 3 tools, 30-min deadline

[4:00] SECTION 3: Top Performer (2 min)
Deep dive: Descript demo with full editing workflow
[Keywords: "video editing automation", "AI editing software"]

[6:00] SECTION 4: ROI Analysis (2 min)
Time saved, cost breakdown, learning curve comparison

[8:00] SECTION 5: Getting Started (2 min)
Setup guide, integration with Premiere/DaVinci

[10:00] CTA + Call-to-Action (1 min)
"Hit subscribe for more creator automation breakdowns. Join the community for exclusive tutorials."

[11:00] Outro (1 min)

TOTAL: 12 minutes

---

SEO ANALYSIS

Title: "This AI Edits Videos For You (I Was Wrong)" — 57 chars
- Primary keyword in first 3 words: ✓
- Length optimal: ✓ (50–60 range)
- Click-worthy: ✓

Keyword Density:
- "AI editing": 1.6% (target 1–2%) ✓
- "automation": 1.2% ✓
- "video tools": 0.9% ✓

Description: 
- Hook in first 150 chars: strong ✓
- Timestamps for 5 chapters: ✓
- 4 resource links (all relevant): ✓
- CTA present: ✓

Tags (10 recommended):
1. AI video editing
2. video editing software
3. AI automation
4. content creator tools
5. Descript review
6. AI tools
7. video editor
8. editing tutorial
9. automation tools
10. creator productivity

SEO VERDICT: APPROVED FOR PUBLISHING ✓

---

THUMBNAIL CONCEPTS

Concept A — Shock + Surprise
Colors: Bright red + white + black
Text: "AI DOES IT FOR YOU" (white, bold)
Element: Shocked creator face
Rationale: High CTR (face presence drives 30% higher engagement)

Concept B — Data + Authority
Colors: Dark blue + gold + white
Text: "AI EDITING RANKED" (white)
Element: Bar chart showing time saved
Rationale: Appeals to analytical audience; credibility signal

Concept C — Curiosity
Colors: Cyan + purple + white
Text: "I WAS WRONG" (white outline, large)
Element: Split-screen (human editing vs AI)
Rationale: Curiosity hook + contrast shows value

A/B TESTING: Start with Concept A. Test B and C after 500 views.

---

PRODUCTION CHECKLIST

✓ Hook: Specific promise (20 hours saved)
✓ Trigger: Real example (7 tools tested, specific workflow)
✓ Structure: Clear sections with pacing
✓ Examples: Descript demo walkthrough
✓ SEO: Keywords naturally distributed
✓ CTAs: Actionable and limited (2 max)
✓ Thumbnails: 3 distinct concepts with rationale
✓ Metadata: Title, description, tags, chapters complete

NEXT STEPS:
1. Creator reviews script, thumbnails, and metadata
2. Creator requests edits (if needed) OR approves
3. On approval: Script moves to APPROVED status
4. After publication: Analytics tracking begins

STATUS: AWAITING CREATOR APPROVAL ⏳
```

## When to Use

- After topic viability is confirmed (score ≥60)
- When batch planning is complete
- Before committing production time

## When NOT to Use

- On topics with viability score <60 (validate demand first)
- Without competitor analysis (context needed for differentiation)
- Before creator has reviewed high-level plan

## Approval Gate

**Creator must approve before publishing.** Script moves from DRAFT → APPROVED → PUBLISHED only after creator sign-off on:
- Hook and opening promise
- Keyword integration (not forced)
- Example quality and relevance
- CTA placement and messaging
- Thumbnail concepts
- Title and metadata
