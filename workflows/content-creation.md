# Content Creation Workflow

A repeatable end-to-end workflow for researching, briefing, writing, optimising, and distributing a piece of content — from keyword to published post with full distribution.

This workflow is designed for a content marketer working alone or with a small team. Use it for blog posts, guides, and long-form content. Adapt for other formats.

---

## Overview

```
Keyword research → Competitor analysis → Content brief → Draft → SEO review → Publish → Distribute → Measure
```

Total elapsed time per piece:
- Brief only: 30-45 minutes
- Brief + draft: 90-120 minutes (with Claude writing)
- Brief + human writer: 3-5 days (with editorial)
- Distribution: 30-45 minutes post-publish

---

## Step 1 — Keyword research and opportunity identification

**Goal:** Confirm the keyword is worth targeting before investing in a brief.

**Inputs:** Topic idea, target audience, business goals.

```
/seo-audit

Keyword research for: [topic idea]

Give me:
1. Primary keyword — best single target for this topic (volume + difficulty)
2. 5-8 secondary keywords (related, lower difficulty)
3. 3-5 question keywords ("People Also Ask" targets)
4. Search intent: what does someone searching this keyword want to accomplish?
5. Content format that currently ranks: listicle / how-to / opinion / guide / comparison
6. Is there a featured snippet? What format?
7. Traffic potential if we rank position 1: [estimated monthly sessions]
8. Verdict: worth writing or skip?
```

**Decision gate:**
- Traffic potential < 100 sessions/month: only write if high commercial intent or brand value
- Keyword difficulty > 70 AND DA < 40: likely won't rank; reconsider or build more authority first
- Search intent mismatch: if what ranks doesn't match what you want to write, reconsider the keyword

---

## Step 2 — Competitor analysis

**Goal:** Understand what you're up against and find the gap.

**Inputs:** Primary keyword, top 3-5 ranking URLs.

```
/content-brief

Run competitor analysis for: [primary keyword]

Top ranking URLs:
1. [URL]
2. [URL]
3. [URL]

For each URL:
- Word count and content depth
- Structure (H2s they use)
- What they do well (match or exceed)
- What they miss (your gap)
- Unique angles, data, or examples they use

Output:
- Differentiation matrix: 3 angles none of the top 3 cover
- Recommended word count to outperform the average
- One thing we should own in this piece
```

**Output:** A clear angle that makes this piece worth reading over what already ranks.

---

## Step 3 — Write the content brief

**Goal:** A brief so detailed a writer (human or Claude) produces first-draft publishable content on the first pass.

```
/content-brief

Generate a full content brief.

Target keyword: [keyword]
Secondary keywords: [list from Step 1]
Target audience: [specific person — job title, problem, awareness stage]
Content type: [how-to / listicle / comparison / guide]
Target word count: [from Step 2 competitor analysis]
Competing URLs to beat: [top 3]
Business CTA: [what we want the reader to do]
Tone: [brand voice]

Include:
- Full H2/H3 outline with word count targets per section
- Featured snippet targeting section
- Internal link plan (links from this piece + pages to update to link here)
- Meta title, description, URL slug
- On-page SEO checklist
- Writer notes for each section
```

**Output:** A complete brief document. Save to your content calendar system (Notion, Airtable, Google Sheets).

---

## Step 4 — Draft the content

### Option A — AI-assisted draft

```
/copywriting

Write this content based on the brief below.

[Paste complete brief from Step 3]

Guidelines:
- Open with a hook (stat, question, or bold claim) — not "In this article"
- Use the target keyword naturally in the first 100 words
- Follow the outline exactly — don't invent new sections
- Every section: specific, actionable, with a real example where indicated in the brief
- Conclusion: summarise 3 key takeaways, include the CTA
- Tone: [brand voice description]
```

**Then review:**
- Does it match the brief?
- Is the opening strong enough to keep readers past the first 200 words?
- Are there specific examples or data points, or is it generic advice?
- Does the featured snippet section answer the query directly in 40-60 words?

### Option B — Human writer with the brief

Send the brief to your writer with these instructions:
1. Read the top 3 competitor URLs before writing — understand what you need to beat
2. Every section must have a real example — no abstract advice
3. No "In this article we will" openings
4. Deliver with: draft text + all image placeholders labelled + metadata suggestions

**Editorial review checklist:**
- [ ] Fact-check all statistics — are they from authoritative sources, not secondary citations?
- [ ] Is the primary keyword in the first 100 words?
- [ ] Does each H2 advance the reader's understanding — no filler sections?
- [ ] Are there at least 3 internal links to existing content?
- [ ] Is the CTA clear and relevant to the content?

---

## Step 5 — SEO review before publishing

**Goal:** Catch everything before publish — it's 10x harder to fix after indexing.

```
/seo-audit

Review this draft before publishing:

[Paste full draft]

Primary keyword: [keyword]

Check and give me a publish checklist:
1. Title tag: keyword present, under 60 characters, compelling
2. Meta description: keyword, 155 chars, value proposition
3. H1: keyword, different wording from title tag
4. H2s: primary keyword in at least one, secondary keywords distributed
5. First 100 words: primary keyword present
6. Featured snippet: is there a direct answer to the query in 40-60 words?
7. Internal links: 3-5 to existing content with descriptive anchor text
8. Images: all have descriptive alt text
9. Schema opportunity: FAQ, HowTo, or Article schema
10. URL slug: short, keyword-containing, no stop words

Output: green (ready to publish) / amber (small fixes) / red (rewrite needed)
```

---

## Step 6 — Publish

**CMS publishing checklist:**

```
Before hitting publish:
- [ ] Title tag and meta description entered in SEO plugin (Yoast, RankMath, or equivalent)
- [ ] URL slug confirmed (no automatic /date/ or /category/ prefixes you don't want)
- [ ] Featured image uploaded with descriptive alt text and file name
- [ ] Canonical URL set (especially for content also published elsewhere)
- [ ] No-index is NOT checked (a common mistake)
- [ ] Internal links confirmed live (click through all links)
- [ ] Schema markup added if applicable
- [ ] Publish date set correctly
- [ ] Author set correctly
- [ ] Category and tags applied (consistent with your taxonomy)
```

**Immediately after publishing:**
- Submit URL to Google Search Console for indexing
- Update any existing pages that should link to this new piece (from your internal link plan)
- Note the publish date in your content calendar

---

## Step 7 — Distribution

**Goal:** Get the piece in front of your audience on every relevant channel within 48 hours of publishing.

### Within 2 hours of publishing

```
/social-media-manager

I just published: [URL]
Title: [title]
Core insight: [the most shareable idea in the piece — 1 sentence]
Audience: [who reads this]

Create:
1. LinkedIn post — native text post (not link preview) — lead with the insight, link in comments
2. X/Twitter thread — 5-7 tweets unpacking the key points
3. LinkedIn carousel concept — 5-7 slide outline with talking points

Keep each format native to the platform — don't just share the link.
```

### Within 24 hours

- Send to your email newsletter (either as featured story or P.S.)
- Post in 1-3 relevant communities (LinkedIn groups, Slack communities, Reddit subreddits) where it adds value — not just self-promotion
- Notify anyone quoted, mentioned, or whose data you cited — ask them to share if they find it useful

### Within 48 hours

- Convert the main insight into a short-form video script (60 seconds) for TikTok/Instagram/YouTube Shorts
- Pin to relevant social profiles if it's a cornerstone piece
- Add to your lead magnet or welcome email sequence if it's a high-value guide
- Syndicate to Medium, Substack Notes, or LinkedIn Articles (with canonical tag pointing to original)

---

## Step 8 — 30-day measurement

**Goal:** Know whether this piece is working — and what to do about it.

At 7 days:
```
/seo-audit

This piece was published 7 days ago: [URL]
GSC data: [impressions, clicks, average position if available]
Sessions from other sources: [social, email, direct]

Assessment: Is this piece getting any traction? Should I amplify with paid social
or build links to it?
```

At 30 days:
```
/seo-audit

30-day review for: [URL]
Traffic to date: [sessions]
Rankings: [position for primary keyword, secondary keywords]
Conversions: [email signups, demo requests, etc.]

Is this piece performing as expected?
- If ranking page 1-3: great — now optimise for CTR (title/meta)
- If ranking page 4-10: update the piece, add internal links, consider link building
- If not ranking at all: was the keyword too competitive? Does the piece match intent?

Next action recommendation:
```

---

## Full workflow checklist (copy this for every piece)

```markdown
# Content Piece Checklist: [TITLE]

**Keyword:** [primary keyword]
**Assigned to:** [writer]
**Target publish date:** [date]

## Research
- [ ] Keyword confirmed (volume, difficulty, intent)
- [ ] Top 3 competitors reviewed
- [ ] Differentiation angle identified

## Brief
- [ ] Full brief written with /content-brief
- [ ] Outline approved
- [ ] Internal link plan documented
- [ ] Metadata drafted (title, description, slug)

## Draft
- [ ] First draft received
- [ ] Editorial review complete
- [ ] Fact-check complete
- [ ] SEO review passed with /seo-audit

## Publish
- [ ] All metadata entered in CMS
- [ ] Internal links live
- [ ] Schema markup added
- [ ] Submitted to GSC for indexing

## Distribute
- [ ] LinkedIn post published
- [ ] X/Twitter thread published
- [ ] Newsletter mention
- [ ] Communities posted
- [ ] Link-back pages updated

## Measure
- [ ] 7-day check
- [ ] 30-day check and optimisation decision
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
