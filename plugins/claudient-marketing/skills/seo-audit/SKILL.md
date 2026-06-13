---
name: "seo-audit"
description: "SEO audit: technical issues, on-page factors, backlink profile, Core Web Vitals, structured data, prioritised fix list with estimated traffic impact"
---

# SEO Audit Skill

## When to activate
- Running a comprehensive SEO audit on a website
- Investigating why organic traffic dropped
- Identifying technical SEO issues blocking crawl or indexing
- Auditing a competitor's SEO strategy
- Prioritising SEO fixes by estimated traffic impact

## When NOT to use
- Real-time rank tracking — use Ahrefs, SEMrush, or Google Search Console
- Link building execution — requires outreach tools
- Paid search (Google Ads) — different channel entirely

## Instructions

### Technical SEO audit

```
Run a technical SEO audit. Provide:

Site URL: [URL]
Tools available: [Google Search Console / Screaming Frog / Ahrefs / SEMrush / PageSpeed Insights]

Check these technical factors:

CRAWL & INDEX
- Is the site indexable? Check robots.txt and meta robots tags
- Any noindex tags blocking important pages?
- XML sitemap: present, submitted to GSC, errors?
- Crawl errors in Google Search Console?
- Canonical tags: correct, no self-referencing issues?

TECHNICAL PERFORMANCE  
- Core Web Vitals (LCP, FID/INP, CLS): pass/fail?
- Page speed: mobile and desktop scores (PageSpeed Insights)
- Mobile-friendly: passes Google's mobile usability test?
- HTTPS: all pages, no mixed content?

SITE STRUCTURE
- URL structure: clean, descriptive, no duplicate parameters?
- Internal linking: orphan pages? Deep pages (> 3 clicks from home)?
- Pagination: rel prev/next or use of canonical?
- Site architecture: logical categories, appropriate breadcrumbs?

For each issue found:
- Severity: Critical / High / Medium / Low
- Estimated traffic impact
- Fix recommendation
- Implementation effort: Easy / Medium / Hard
```

### On-page SEO audit

```
Audit on-page SEO for [URL or page type]:

CONTENT
- Title tags: unique, under 60 chars, includes primary keyword?
- Meta descriptions: compelling, under 160 chars, unique?
- H1: one per page, includes keyword?
- Header structure: logical H1→H2→H3 hierarchy?
- Content depth: covers the topic comprehensively vs. top-ranking pages?
- Keyword usage: natural, no stuffing, LSI terms included?
- Content freshness: last updated date, stale content?

MEDIA
- Images: alt text present, descriptive, not keyword-stuffed?
- Image file sizes: compressed for performance?
- Videos: transcripts, schema markup?

STRUCTURED DATA
- Schema markup present? (Article, Product, FAQ, How-to, Review, LocalBusiness)
- Valid per Google's Rich Results Test?
- Any missing schema opportunities?

Provide a prioritised fix list.
```

### Competitor SEO analysis

```
Analyse [competitor URL] vs. my site [my URL]:

KEYWORD GAP
- What keywords do they rank for that I don't?
- What's their estimated organic traffic?
- Which of their top pages generate the most traffic?

CONTENT GAP
- What content do they have that I'm missing?
- Which topics in our space do they own?

BACKLINK GAP
- Domain authority comparison
- How many referring domains do they have vs. me?
- Their best backlink sources (for outreach research)

Prioritise: which gaps are most achievable for me to close in the next 90 days?
```

### Core Web Vitals fix priorities

```
My Core Web Vitals scores:
- LCP (Largest Contentful Paint): [Xs] — target < 2.5s
- INP (Interaction to Next Paint): [Xms] — target < 200ms
- CLS (Cumulative Layout Shift): [X] — target < 0.1

Site tech stack: [Next.js / WordPress / Shopify / other]

For each failing metric:
1. What is the most likely cause on my tech stack?
2. What are the top 3 fixes to implement first?
3. Estimated improvement from each fix?
```

### SEO audit report

```
Generate an SEO audit executive summary for [site].

Audit findings: [paste key issues found]

Format:
1. Overall SEO health score (1-10) with rationale
2. Critical issues (must fix — blocking traffic or indexing)
3. High-priority opportunities (biggest estimated traffic gains)
4. Quick wins (easy to implement, immediate impact)
5. 90-day SEO roadmap with priorities
```

## Example

**User:** My blog's traffic dropped 40% after Google's March 2026 core update. Run an audit.

**Claude's audit framework:**
1. Check Google Search Console for manual actions or coverage issues
2. Identify which pages lost rankings (position changes report)
3. Check if dropped pages have thin content, low E-E-A-T signals, or duplicate content
4. Analyse top-performing pages that survived — what do they have that dropped pages don't?
5. Review site-wide: overly SEO-optimised anchor text? Thin affiliate content? AI-generated without human expertise signals?
6. Generate prioritised fix list with estimated recovery timeline per fix category

---
