---
name: content-brief
description: "SEO-optimised content brief: keyword targeting, outline, competitor gaps, internal links, CTA"
updated: 2026-06-13
---

# Content Brief Skill

## When to activate
- Briefing a writer (human or AI) before producing a blog post, landing page, or guide
- Ensuring SEO fundamentals are baked in before writing starts, not after
- Identifying what competitor content is missing before choosing your angle
- Structuring long-form content so it earns featured snippets and ranks
- Standardising brief quality across a content team so every piece meets the same bar

## When NOT to use
- Short-form social posts — too lightweight to brief this way
- Internal documents, SOPs, or sales decks — different structure, not SEO-driven
- You are writing the content yourself without a brief — just start writing
- News-jacking / reactive content — speed matters more than brief depth here

## Instructions

### Core content brief prompt

```
Generate a full SEO content brief for this piece.

Target keyword: [primary keyword]
Secondary keywords: [list 3-5 related terms]
Target audience: [specific person — job title, context, problem they're trying to solve]
Content type: [how-to / listicle / comparison / case study / pillar / opinion]
Target word count: [based on competitor analysis — ask Claude to recommend if unsure]
Publication: [company blog / guest post / landing page]
Business CTA: [what we want the reader to do at the end]
Tone: [authoritative / conversational / technical / approachable]
Competing URLs to beat: [top 3-5 ranking pages for the primary keyword]

Produce:

## 1. Keyword strategy
- Primary keyword: [exact match, search volume estimate, difficulty]
- Semantic keywords to include: [LSI terms, question variants, entity mentions]
- Featured snippet opportunity: [yes/no, and what format it should target]
- Search intent: [informational / navigational / commercial / transactional]

## 2. Competitor gap analysis
For each competing URL:
- What they cover well (don't ignore it — match or exceed)
- What they miss (your differentiation angle)
- Word count and content depth
- Unique data, examples, or perspectives they lack

## 3. Recommended angle
One sentence: why this piece will rank AND get shared over the competitors.

## 4. Full content outline
With H2s and H3s, estimated word count per section, and notes for the writer.

## 5. Internal links
- 3-5 pages on our site that should link TO this piece
- 3-5 existing pieces this new piece should link TO

## 6. Meta title, meta description, and URL slug

## 7. On-page SEO checklist
```

### Keyword strategy framework

```typescript
interface ContentBrief {
  keyword: {
    primary: string
    volume: string            // monthly searches (approximate)
    difficulty: number        // 0-100 (Ahrefs KD equivalent)
    intent: 'informational' | 'commercial' | 'transactional' | 'navigational'
    featuredSnippetFormat: 'paragraph' | 'list' | 'table' | 'none'
  }
  semanticKeywords: string[]  // include naturally in the content
  entityKeywords: string[]    // people, tools, brands to mention for topical depth
  questionKeywords: string[]  // "People Also Ask" targets → answer in H2/H3s

  competitors: Array<{
    url: string
    wordCount: number
    strengths: string[]       // what they do well
    gaps: string[]            // what they miss
    differentiator: string    // how to beat this specific URL
  }>

  brief: {
    recommendedWordCount: number
    sections: Array<{
      heading: string         // H2 or H3
      level: 'H2' | 'H3'
      purpose: string         // what this section accomplishes
      wordCount: number       // target for this section
      writerNote: string      // specific guidance (include stat, example, table, etc.)
    }>
  }
}
```

### Competitor gap analysis prompt

```
Run a competitor content gap analysis for: [PRIMARY KEYWORD]

Top ranking URLs:
1. [URL 1]
2. [URL 2]
3. [URL 3]

For each URL, identify:
1. Main angle and thesis
2. Content depth (what topics are covered vs. glossed over)
3. Unique data, research, or examples they cite
4. Format choices (tables, lists, screenshots, video embeds)
5. Missing topics a reader would still want after reading this
6. Weakest sections (thin content, outdated info, generic advice)

Then produce:
- Our differentiation matrix: 3 angles that none of the top 3 cover
- The "one thing" we should own in this piece that competitors don't have
- Evidence types we should include (original data, expert quotes, case studies)
- Recommended word count to outperform the average of the top 3
```

### Content outline generator

```
Generate a detailed content outline.

Topic: [title or working title]
Primary keyword: [keyword]
Audience: [reader profile]
Goal of the piece: [what the reader achieves by reading end-to-end]

OUTLINE FORMAT:
For each section:
H2: [Section heading — keyword-aware but not stuffed]
  Purpose: [what this section accomplishes for the reader]
  Key points: [2-3 bullet points the writer must address]
  Format recommendation: [paragraph / list / table / example / screenshot]
  Word count: [target for this section]
  Writer note: [specific instruction — e.g. "include a real customer example here"]

Introduction requirements:
- Hook in the first sentence (stat, question, or bold claim)
- Establish the reader's problem in sentence 2-3
- Promise the outcome ("by the end of this you'll know...")
- NO "In this article we will..." openers
- Include primary keyword naturally in the first 100 words

Conclusion requirements:
- Summarise the 3 most important takeaways
- CTA: [specific — "download the template" / "book a demo" / "subscribe"]
- Related reading: [2 internal links]
```

### On-page SEO checklist

```
Before publishing, verify:

TITLE TAG (meta title):
- [ ] Contains primary keyword
- [ ] Under 60 characters
- [ ] Compelling — has a power word (Best, Complete, Ultimate, Guide, etc.)
- [ ] Does not duplicate another title on the site

META DESCRIPTION:
- [ ] 150-160 characters
- [ ] Contains primary keyword
- [ ] Has a clear value proposition or hook
- [ ] Ends with a soft CTA or open loop

URL SLUG:
- [ ] Short (2-4 words)
- [ ] Contains primary keyword
- [ ] All lowercase, hyphenated, no stop words

H1:
- [ ] Contains primary keyword
- [ ] Different wording from the title tag (OK to vary)
- [ ] One H1 only

H2s and H3s:
- [ ] 3-8 H2s (content roadmap for the reader)
- [ ] Primary keyword in at least one H2
- [ ] Secondary keywords and questions in H2/H3s
- [ ] No keyword stuffing — headings should be descriptive

BODY CONTENT:
- [ ] Primary keyword in first paragraph
- [ ] Keyword density 0.5-1.5% (natural, not forced)
- [ ] Semantic and LSI keywords distributed throughout
- [ ] At least one table, list, or structured element (snippet target)
- [ ] Every image has alt text (descriptive, keyword where natural)

INTERNAL LINKS:
- [ ] 3-5 links to existing content on the site
- [ ] Link text is descriptive (not "click here")
- [ ] At least one link from an existing high-authority page to this piece

EXTERNAL LINKS:
- [ ] Link to 2-4 authoritative sources (statistics, research, tools)
- [ ] Set external links to rel="noopener" (not nofollow unless paid/UGC)

SCHEMA MARKUP:
- [ ] Article schema (always)
- [ ] FAQ schema if you have a Q&A section
- [ ] HowTo schema if it's a tutorial/step-by-step
```

### Featured snippet targeting

```
Optimise this content to capture the featured snippet for: [KEYWORD]

Current snippet holder (if any): [URL and snippet text]

Featured snippet formats by keyword type:
- "How to [task]" → Step-by-step numbered list with an H2 that is the exact question
- "What is [term]" → 2-3 sentence definition paragraph under an H2 that mirrors the question
- "Best [tools/options]" → Table with name/feature/price columns, or ordered list
- "[Term] vs [Term]" → Comparison table, then prose explanation

Instructions for snippet-targeting structure:
1. Use the exact question as the H2 heading
2. Answer it directly and completely in the first 40-60 words under that heading
3. For list snippets: use <ol> or <ul> immediately after the heading
4. For table snippets: use a proper HTML table with headers
5. Then expand with detail paragraphs (Claude reads beyond the snippet)
6. Do NOT bury the answer — put it first, explain second

Write the optimised H2 heading and opening section:
```

### Brief template (copy-paste for writers)

```markdown
# Content Brief: [TITLE]

**Primary keyword:** [keyword] | Volume: [X/mo] | Difficulty: [X/100]
**Secondary keywords:** [list]
**Target word count:** [X words]
**Target publish date:** [date]
**Writer:** [name]
**Editor review by:** [date]

## Audience
[Job title], [company size], [specific problem they're solving with this search].
They are at [awareness stage: problem-aware / solution-aware / product-aware].

## Search intent
[What does the reader want to accomplish by searching this keyword? What format do they expect?]

## Recommended angle
[One sentence — why our piece will be better than the current top 3 results]

## Outline

### Introduction (~150 words)
Hook with: [stat / question / bold claim]
Establish problem: [what the reader is struggling with]
Promise outcome: [what they'll know by the end]

### H2: [Section 1 title] (~300 words)
[Key points the writer must cover]
[Format: paragraph/list/table]
[Writer note: specific instruction]

### H2: [Section 2 title] (~400 words)
...

### Conclusion (~200 words)
Summary: [3 key takeaways]
CTA: [specific action]
Related: [2 internal links]

## SEO requirements
- [ ] Primary keyword in first 100 words
- [ ] H2 that is a "People Also Ask" question
- [ ] One table or numbered list (snippet target)
- [ ] 4+ internal links
- [ ] All images with descriptive alt text

## Meta
**Title tag:** [60 chars max] [DRAFT]
**Meta description:** [155 chars max] [DRAFT]
**URL slug:** /[slug]

## Internal link plan
Link FROM this piece to:
- [URL 1] — anchor text: [text]
- [URL 2] — anchor text: [text]

Link TO this piece from:
- [URL 1] — update that page to add a link here
- [URL 2] — add contextual link
```

## Example

**User:** Write a content brief for "content marketing strategy" targeting B2B marketing managers.

**Output:**
```markdown
# Content Brief: The B2B Content Marketing Strategy Guide (2026)

**Primary keyword:** content marketing strategy | Volume: ~18,000/mo | Difficulty: 68/100
**Secondary keywords:** b2b content strategy, content marketing framework, content strategy template, how to build a content strategy
**Target word count:** 3,800 words (competitors avg 3,100 — go deeper on frameworks and templates)
**Search intent:** Informational — reader wants a step-by-step process to follow, with templates to adapt

## Audience
B2B Marketing Manager at a 50-500 person SaaS or services company. Just inherited ownership of content. Needs to present a strategy to their VP Marketing within 30 days. Searches at work, on desktop, during a planning cycle.

## Recommended angle
Most guides list tactics. This guide builds an actual strategy framework in a step-by-step sequence with a downloadable template — the reader finishes with a complete 90-day plan, not just inspiration.

## Outline

### Introduction (~200 words)
Hook: "Most content strategies fail in the first 90 days — not because the writing is bad, but because there was never a real strategy."
Problem: Teams produce content without audience research, keyword mapping, or distribution plans.
Promise: "By the end of this guide you'll have a 90-day content strategy you can present this week."

### H2: What a B2B Content Marketing Strategy Actually Is (~300 words)
[Featured snippet target — answer the "what is" in 50 words first]
Define: strategy vs. tactics vs. calendar
The 5 components of a real strategy: audience, goals, channel mix, production system, measurement

### H2: Step 1 — Define Your Content Goals (~400 words)
Business goals → content goals translation table
Traffic, leads, pipeline, brand: which metrics map to which goal
Writer note: Include a real B2B example showing how a SaaS company set content KPIs

### H2: Step 2 — Audience and Keyword Research (~500 words)
ICP → keyword intent mapping
Tools: Ahrefs, Semrush, Answer the Public, internal sales call notes
Writer note: Show the keyword research process as a step-by-step list (snippet target)

### H2: Step 3 — Build Your Topic Clusters (~400 words)
Pillar/spoke model with diagram description
How to choose pillars based on business goals, not just volume
Internal link: [/editorial-calendar blog post]

### H2: Step 4 — Choose Your Content Mix (~400 words)
Content type mix table: [Type | % | When to use | Example]
Early stage vs. mature company mix differs — show both

### H2: Step 5 — Build a Production System (~400 words)
Brief → draft → edit → publish → distribute workflow
Roles: who does what (even if it's one person)
Tools: Notion, Airtable, or a simple Google Sheet template

### H2: Step 6 — Measure and Iterate (~400 words)
Metrics by goal (traffic / leads / brand)
Monthly content review template
What "success" looks like at 30/60/90 days

### Conclusion (~200 words)
Takeaways: 3 things to do this week
CTA: Download the 90-day content strategy template
Related: Link to /seo-audit, /editorial-calendar

## Meta
**Title tag:** B2B Content Marketing Strategy: The 2026 Step-by-Step Guide
**Meta description:** Build a B2B content strategy that drives real pipeline. 6-step framework, templates, and a 90-day plan you can present this week.
**URL slug:** /content-marketing-strategy
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
