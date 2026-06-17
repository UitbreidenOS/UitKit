# Firecrawl

Full-page web rendering for JavaScript-heavy sites. Use when WebFetch returns empty or partial content.

## When to Use vs WebFetch

| Use Firecrawl | Use WebFetch |
|---|---|
| app.company.com subdomains | Static blog posts |
| Pricing pages (JS-rendered) | News articles |
| Feature comparison pages | Plain HTML company pages |
| Crunchbase company profiles | LinkedIn public profiles |
| G2 / Capterra review pages | GitHub READMEs |

## Tool Call

```
mcp__firecrawl__scrape({ "url": "https://company.com/pricing" })
```

## GTM Use Cases

1. **Pricing page** — infer budget range and plan tier as ICP signal
2. **Feature page** — identify tech stack and product surface area
3. **Careers page** — hiring surge = growth signal = outreach trigger
4. **Company homepage** — get value prop for tailoring your angle
5. **G2 reviews page** — competitor weaknesses for battlecard

## Tips

- Cache results locally — save to accounts/{slug}-scrape.md to avoid re-scraping
- Use selectors if the page is noisy: `{ "url": "...", "selector": "main" }`
- Firecrawl respects robots.txt — some pages will be blocked by policy

## Rate Limits

- Free tier: 500 pages/month
- Save credits: only scrape pages WebFetch fails on

---
