# Exa

Neural/semantic search — finds trigger signals better than keyword search. Use for account research and competitive intelligence.

## When to Use vs WebSearch
| Use Exa | Use WebSearch |
|---|---|
| Finding funding announcements | Looking up a company URL |
| Exec hire news | Checking if a domain exists |
| Product launch signals | Finding a specific article by title |
| Semantic: "companies expanding into EU" | Direct lookup |

## Tool Call
```
mcp__exa__search({ "query": "Acme SaaS Series A funding 2025", "numResults": 5 })
```

## GTM Signal Queries (run these for every account)
```
"[company] funding 2025"
"[company] [exec name] joins as"
"[company] launches new"
"[company] expands to [market]"
"[company] partnership with"
"[company] hiring [VP/Head of] [Sales/Marketing]"
"[company] acquires"
"[company] [pain area] problem challenge"
```

## Date Filtering
```
mcp__exa__search({ "query": "...", "startPublishedDate": "2025-03-01" })
```
Filter to last 90 days for fresh triggers. Older signals are weaker — use with caution.

## Signal Scoring
| Signal Strength | Criteria |
|---|---|
| Strong | Named event + specific date + credible source (TechCrunch, PR Newswire, company blog) |
| Medium | Mentioned in passing, no date, or secondary source |
| Weak | General mention, no specifics, blog roundup |

Use only Strong or Medium signals as email triggers.

## API Key
Get at exa.ai → Sign up → API Keys. Free tier: 1,000 searches/month.

---
