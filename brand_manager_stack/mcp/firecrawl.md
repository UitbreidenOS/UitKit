# Firecrawl

Full-page web rendering for JavaScript-heavy sites. Use when WebFetch returns empty or partial content. Essential for scraping pricing pages, feature comparison pages, and career pages.

## When to Use vs WebFetch

| Use Firecrawl | Use WebFetch |
|---|---|
| Competitor pricing pages (JS-rendered) | Static blog posts |
| Feature comparison pages | News articles |
| Career/hiring pages | LinkedIn public profiles |
| Company homepages (React/Vue) | GitHub READMEs |
| G2 / Capterra review pages | Plain HTML company pages |

## Tool Call

```
mcp__firecrawl__scrape({ "url": "https://company.com/pricing" })
```

## Brand Manager Use Cases

1. **Competitor pricing page** — infer pricing model, tiers, target segment
2. **Feature page** — identify product surface area and differentiation angles
3. **Careers page** — hiring surge signals growth, funding, expansion plans (outreach trigger)
4. **Company homepage** — extract value prop, messaging, positioning for analysis
5. **G2 reviews page** — customer sentiment on competitor, pain point themes, our opportunity
6. **Customer case study** — extract metrics, outcome, customer title/role, industry

## Tips

- Cache results locally — save to `competitive-intelligence/{company-slug}-scrape.md` to avoid re-scraping
- Use selectors if the page is noisy: `{ "url": "...", "selector": "main" }`
- Firecrawl respects robots.txt — some pages will be blocked by policy
- Rate limiting: free tier 500 pages/month; paid scales higher

## Rate Limits

- Free: 500 pages/month
- Pro: 5,000 pages/month
- Enterprise: custom

Save credits: only scrape pages WebFetch fails on.

---
