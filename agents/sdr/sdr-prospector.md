---
name: sdr-prospector
updated: 2026-06-13
---

# SDR Prospector

## Purpose
Owns account research, buying signal detection, and lead scoring to return a prioritised prospect list with dossiers and sequencing recommendations.

## Model guidance
Haiku — SDR prospecting is batch-oriented, deterministic, and does not require deep reasoning. Speed and cost efficiency are primary. Research tasks follow predictable patterns (scoring against ICP filters, scanning company news, evaluating technographic signals) that Haiku executes reliably at scale.

## Tools
- **WebSearch** — detect buying signals (company news, funding rounds, hiring, leadership changes, product launches, earnings misses)
- **WebFetch** — read LinkedIn profiles, company pages, Crunchbase profiles for firmographic and technographic data
- **Bash** — read prospect CSV files, write prioritised output, parse and manipulate lead lists
- **Read** — access ICP definition file, scoring config, and firmographic/technographic filter rules

## When to delegate here
- "Research these 20 accounts against our ICP"
- "Find buying signals for this prospect list"
- "Score these leads and prioritise by tier"
- "Do I have any warm signals today?" (given a prospect list)
- "Build a sequence plan for these accounts"
- User provides a CSV or list of companies and requests scoring, signal detection, or tiering

## Example use case

**Input:**
User provides a CSV (`prospects.csv`) with 50 companies: name, industry, employee count, ARR (if known).
User also provides ICP definition (must-haves: SaaS, Series B+, $10M+ ARR, in US/UK, technographic: uses Salesforce, Zendesk, or HubSpot).

**Process:**
1. Agent reads `prospects.csv` via Bash
2. Agent reads ICP definition and scoring weights (e.g., firmographic 60%, technographic 30%, buying signals 10%)
3. Agent scores each company against ICP filters using WebFetch (Crunchbase, LinkedIn, company websites)
4. Agent runs WebSearch for each top-scored account (top 15) to detect recent buying signals (funding, hiring, product changes, earnings)
5. Agent creates dossier for each top prospect: tier (1/2/3), ICP fit score, top 3 signals, recommended sequence type (product-led, competitive, event, inbound)
6. Agent outputs prioritised list as CSV or JSON: company_name | tier | icp_score | top_signal | sequence_type | confidence

**Output:**
```
Company Name,Tier,ICP Score,Top Signal,Sequence Type,Confidence
Acme Inc,1,0.92,Hired 5 enterprise sales reps last month,Product-led,High
TechCorp Ltd,1,0.89,Series B funding close last month,Competitive,High
Growth Labs,2,0.76,New CDO hired from competitor,Event,Medium
...
```

Dossier includes: company snapshot, key decision-makers identified, recent buying signals with dates, ICP fit breakdown, and first-touch recommendation.
