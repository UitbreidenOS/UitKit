---
name: programmatic-seo
description: "Programmatic SEO: build landing page templates at scale, identify data sources, design URL structures, avoid thin content penalties"
updated: 2026-06-13
---

# Programmatic SEO Skill

## When to activate
- Creating hundreds or thousands of location/category/comparison pages
- Building a database-driven content strategy (e.g. "[City] + [Service]" pages)
- Scaling content production with templates and data feeds
- Auditing existing programmatic SEO pages for quality issues
- Planning a programmatic SEO strategy before implementation

## When NOT to use
- Sites with fewer than 100 potential pages — manual SEO is better
- When you don't have a real data source — pure template spam gets penalised
- When user intent is too narrow to justify scale

## Instructions

### Identify programmatic SEO opportunities

```
Identify programmatic SEO opportunities for my business.

Business type: [describe]
Current site: [URL or description]
Products/services: [list]

Common programmatic patterns:
1. Location pages: "[Service] in [City]" — works for local businesses, marketplaces, B2B
2. Category × modifier: "[Category] for [Audience/Use Case]"
3. Comparison pages: "[Tool A] vs [Tool B]" — works for SaaS, tools
4. Integration pages: "[Product] + [Integration]" — Zapier style
5. Template pages: "[Role] resume template", "[Industry] invoice template"
6. Data pages: "[City] [Metric] statistics", "[Year] [Industry] report"

Which patterns apply to my business?
Estimate: how many pages could this generate?
What data source would power each?
```

### Design the template structure

```
Design a programmatic SEO template for [page type].

Example URL: /[city]/[service] (e.g. /london/web-design)
Target query: "[service] in [city]"
Data I have: [list fields — city name, population, local stats, etc.]

Template sections:
1. H1: [formula — e.g. "Web Design in {{city}}"]
2. Intro paragraph (unique by city — what varies?)
3. Core value proposition (static — same across all pages)
4. Local differentiation (what makes the city/category unique?)
5. Testimonials/case studies (filter by location if available)
6. FAQ (mix of static questions + dynamic city-specific)
7. CTA

Uniqueness strategy: what content differs between pages to avoid thin content?
Minimum content threshold: how many words of truly unique content per page?
```

### Data source planning

```
Plan the data architecture for programmatic SEO.

Page type: [describe]
Scale: [X] pages planned

Data sources to consider:
- Internal data (your product data, customer data, transactions)
- Public datasets (Census, Wikipedia, government open data)
- API sources (Google Places, Yelp, Weather, etc.)
- Scraped/aggregated data (directory listings, job boards)
- User-generated content (reviews, Q&A)

For my use case:
1. What data makes each page genuinely unique?
2. Where do I get that data?
3. How do I keep it fresh? (static vs. dynamic generation)
4. What's the minimum data per page to avoid thin content?

Output: data architecture plan with fields per page template.
```

### Thin content audit

```
Audit these programmatic pages for thin content risk.

Sample pages: [paste 3-5 URLs or describe the template]
Issue observed: [low traffic, manual action, poor rankings]

Check:
1. Unique content ratio: what % of each page is unique vs. template?
2. User value: does this page answer the search query better than a Google search?
3. Duplication: are pages too similar to each other?
4. Auto-generated signals: does it read like it was written for search engines, not humans?
5. Engagement data: bounce rate, time on page (if available)

Recommendations: consolidate / improve / remove / noindex.
```

### URL and site architecture

```
Design URL structure and internal linking for programmatic SEO at scale.

Page type: [location/category/comparison pages]
Scale: [X] pages

URL structure options:
- Flat: /[city]-[service] (simple, loses category hierarchy)
- Nested: /[service]/[city] (better for faceted hierarchy)
- Hybrid: /[category]/[modifier]-[location]

Internal linking strategy:
1. Hub pages: category-level pages that link to all location variants
2. Breadcrumbs: show hierarchy for user and crawlers
3. Related pages: same city, different services / same service, nearby cities
4. Pagination vs. infinite scroll vs. "load more"
5. XML sitemap segmentation (separate sitemap for programmatic pages)

Design the architecture for [X] pages.
```

## Example

**User:** I run a freelancer marketplace. I want to build "[Skill] freelancers in [City]" pages. I have 50 skills and 200 cities = 10,000 pages. How do I do this without getting penalised?

**Claude's plan:**

**Data uniqueness strategy:**
- City population + notable industries (Census + Wikipedia API)
- Average rates for the skill in that city (from your own marketplace data)
- Number of verified freelancers on your platform in that city/skill combo
- Featured freelancers (dynamic, from your DB)
- Recent projects completed in that city (from your transaction data)

**Thin content threshold:** Each page needs ≥ 3 truly unique data points (rate data + freelancer count + featured profiles). Pages with < 3 freelancers should be noindexed until populated.

**Launch sequence:** Start with top 20 cities × all 50 skills (1,000 pages). Validate indexing and performance before expanding to all 200 cities.

**Template H1:** "Find [Skill] Freelancers in [City] — [X] Verified Professionals"

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
