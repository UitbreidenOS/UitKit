---
name: schema-markup
description: "Schema.org structured data: generate JSON-LD for rich results, validate markup, choose the right schema type, implement across common page types"
updated: 2026-06-13
---

# Schema Markup Skill

## When to activate
- Adding structured data to improve rich results in Google Search
- Generating JSON-LD for articles, products, FAQs, how-tos, reviews, local businesses
- Validating schema markup before deployment
- Choosing the right schema type for a page
- Debugging why rich results aren't appearing

## When NOT to use
- Schema alone won't rank you — it enhances existing good content
- Fake reviews or misleading data — Google will penalise
- For every page on your site — prioritise high-value pages first

## Instructions

### Choose the right schema type

```
What schema markup should I use for this page?

Page type/content: [describe what the page contains]
Goal: [rich snippets / knowledge panel / local pack / voice search]

Common schema types:
- Article / BlogPosting: news, blog posts, editorial content
- Product: ecommerce product pages with price, availability, reviews
- LocalBusiness: physical locations (includes opening hours, address)
- FAQPage: pages with Q&A sections (appears as expandable in SERPs)
- HowTo: step-by-step instructions
- Recipe: cooking content with ingredients, steps, nutrition
- Event: conferences, concerts, webinars
- JobPosting: job listings
- Course: online learning content
- SoftwareApplication: apps and software tools
- Review / AggregateRating: user or expert reviews
- BreadcrumbList: site navigation hierarchy
- Organization: company information, social profiles
- Person: author, speaker, professional profiles

Which types apply? Can multiple types be combined?
```

### Generate JSON-LD (paste-ready)

**Article / Blog Post:**
```
Generate Article schema for:
Title: [title]
Author: [name, URL]
Published: [date]
Modified: [date]
Image: [URL]
Publisher: [company name, logo URL]
URL: [page URL]
Description: [meta description]
```

**LocalBusiness:**
```
Generate LocalBusiness schema for:
Business name: [name]
Type: [Restaurant / MedicalClinic / LegalService / Store / etc.]
Address: [full address]
Phone: [number]
Website: [URL]
Hours: [Mon-Fri 9-5, Sat 10-3, etc.]
Price range: [$$ / $$$]
Latitude/Longitude: [if known]
```

**FAQPage:**
```
Generate FAQPage schema for these Q&As:
Q1: [question]
A1: [answer]
Q2: [question]
A2: [answer]
[add as many as needed — 5-10 is ideal]
Page URL: [URL]
```

**Product:**
```
Generate Product schema for:
Name: [product name]
Description: [description]
Image: [URL]
Brand: [brand name]
SKU: [SKU if available]
Price: [amount]
Currency: [USD/GBP/EUR]
Availability: InStock / OutOfStock / PreOrder
Rating: [average score] from [count] reviews
```

**HowTo:**
```
Generate HowTo schema for this tutorial:
Title: [how-to title]
Description: [what this teaches]
Total time: [PT30M = 30 minutes]
Steps:
1. [step name] — [step description]
2. [step name] — [step description]
[continue for all steps]
```

### Validate and debug

```
Validate this schema markup:

[paste JSON-LD code]

Check:
1. Valid JSON syntax?
2. Required fields present for this schema type?
3. Recommended fields missing (that would enable rich results)?
4. Any deprecated properties?
5. Testing URL: https://search.google.com/test/rich-results

Also check: is this schema type eligible for rich results?
(Not all schema types generate visual enhancements — some just help understanding)
```

### Implementation across page types

```
Create a schema markup implementation plan for my site.

Site type: [blog / ecommerce / local business / SaaS / marketplace]
Main page types: [list: homepage, product pages, blog posts, category pages, etc.]

For each page type:
1. Recommended schema type(s)
2. Data fields to include
3. Which fields are dynamic (from CMS/DB) vs. static
4. Priority: [high — rich result eligible / medium / low]
5. Implementation method: [HTML head / CMS plugin / via GTM / server-rendered]

Output: priority-ordered implementation checklist.
```

## Example

**User:** I have a SaaS review blog. Each post reviews a tool. I want rich snippets in Google.

**Claude generates:**

For a review post, use `SoftwareApplication` + `Review` combined:

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Notion",
  "applicationCategory": "ProductivityApplication",
  "operatingSystem": "Web, iOS, Android, macOS, Windows",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free tier available"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "reviewCount": "1",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": {
    "@type": "Review",
    "author": { "@type": "Person", "name": "Your Name" },
    "datePublished": "2026-05-20",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "4.6",
      "bestRating": "5"
    },
    "reviewBody": "First sentence of your review summary..."
  }
}
```

Rich result eligibility: ✅ Product rich snippets (star ratings in SERPs)

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
