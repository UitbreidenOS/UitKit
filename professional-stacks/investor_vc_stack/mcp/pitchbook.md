# PitchBook MCP Server

VC-specific data for deal comps, pricing, and benchmarking.

---

## What PitchBook Provides

**Deal Data:**
- Transaction history (acquisitions, IPOs, private placements)
- Valuation and pricing data
- Series A/B/C benchmarks by stage and industry
- Investor profiles and investment patterns
- Term sheet data and preferences

**Perfect For:**
- Series A/B/C pricing benchmarks (typical equity %, valuation ranges)
- Comparable company analysis (comps)
- Investor pattern recognition (who invests in what, check sizes)
- Post-investment performance tracking

**Limitations:**
- Limited seed-stage deal data (most comprehensive for Series A+)
- Some deal terms are confidential and not available
- Requires PitchBook Pro subscription for API

---

## Getting Your API Key

1. Go to [pitchbook.com](https://pitchbook.com/)
2. Sign up or log in (Pro plan required)
3. Navigate to **API Access** in account settings
4. Request/activate API key
5. Copy and paste into settings.json

---

## Integration with VC Stack

**Used By:**
- `/dd-report` — Series benchmarks, comps, valuation guidance
- `/score-opportunity` — Market valuation context, investor patterns
- Term sheet recommendations — Typical equity targets by stage

**Example Query:**
```
PitchBook search: "B2B SaaS Series A"
Returns: 2024 median valuation $20M, median pre-money $12M, typical equity 15-20%, 
median check size $2-4M, top investors in category
```

---

## Using PitchBook for Pricing

**Series A Benchmarks:**
- Median pre-money valuation: $8–15M (depends on traction)
- Typical equity raised: 15–25%
- Check sizes: $1–3M from lead investors

**Series B Benchmarks:**
- Median pre-money valuation: $30–50M
- Typical equity raised: 15–20%
- Check sizes: $3–8M from lead investors

**Series C Benchmarks:**
- Median pre-money valuation: $80–150M
- Typical equity raised: 10–15%
- Check sizes: $5–15M from lead investors

---

## Tips for Best Results

1. **Use industry filters** — PitchBook data is most relevant by category (SaaS vs. Fintech vs. Climate Tech)
2. **Cross-reference with recent deals** — Published benchmarks may lag live market
3. **Check recency** — Use 2024–2026 comps, not 2020 data
4. **Note market conditions** — 2024–2026 market is tighter than 2021–2022 peak
5. **Validate investor patterns** — Look at which LPs invest in your sector

---

## Troubleshooting

**Valuation data seems outdated?**
- PitchBook has transaction delay (2–4 weeks typical)
- Use most recent published data and adjust for market conditions

**Comps not matching our company?**
- Look for 3–5 similar companies (same stage, geography, sector)
- Average the valuations; don't treat any single comp as gospel

**Limited seed-stage data?**
- PitchBook focuses on institutional rounds (Series A+)
- Use Crunchbase for seed financing research

**API rate limits?**
- Batch queries where possible
- Check PitchBook account for quota allocation
