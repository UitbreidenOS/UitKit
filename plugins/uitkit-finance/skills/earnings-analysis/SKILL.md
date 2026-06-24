---
name: "earnings-analysis"
description: "Earnings review workflow: parse transcript + filings, update model estimates, flag guidance changes, draft morning note — equity research patterns"
---

# Earnings Analysis Skill

## When to activate
- A company you cover just reported earnings and you need to analyse quickly
- Updating your financial model after a quarterly earnings release
- Identifying the key surprises vs. consensus (beat/miss analysis)
- Drafting an earnings morning note or client update
- Preparing for an earnings call and building key questions

## When NOT to use
- Real-time earnings streaming — needs a live data feed
- Formal published research notes — require compliance review
- Trading decisions based on this analysis — regulated activity

## ⚠️ Important

All earnings analysis outputs are `[VERIFY]` — validate every figure against the actual filing or official transcript before using. Earnings analysis drives significant decisions; errors have real consequences.

## Instructions

### Step 1 — Parse the transcript

```
Parse this earnings call transcript and extract:

[paste transcript or key management quotes]

Extract:
1. Revenue actual vs. guidance vs. consensus estimate
2. Gross margin actual vs. guidance vs. prior year
3. EBITDA / operating income actual vs. consensus
4. EPS actual vs. consensus
5. Full-year guidance update (raised / lowered / maintained / withdrawn)
6. Key management commentary (what changed, what's the narrative)
7. Analyst questions that reveal areas of concern
8. Any one-time items or non-GAAP adjustments to flag

Summarise: beat/miss on revenue, margins, EPS. One-line verdict.
[VERIFY] all figures against the actual 10-Q or press release.
```

### Step 2 — Beat/miss analysis

```
Analyse the earnings results vs. expectations:

Actual results:
- Revenue: $[X]M (consensus: $[X]M, guidance: $[X]M)
- Gross margin: [X]% (consensus: [X]%, prior quarter: [X]%)
- EBITDA: $[X]M (consensus: $[X]M)
- EPS: $[X] (consensus: $[X])

Calculate:
- Revenue beat/miss: $[X]M ([X]% vs. consensus)
- Margin surprise: [X]pp vs. consensus
- EPS beat/miss: $[X] ([X]% vs. consensus)

Quality of the beat:
- Was it revenue-driven or cost-driven?
- Did margins expand or contract?
- Was guidance raised for the next quarter / full year?
- Any one-time items inflating the beat?

Overall assessment: Strong beat / Mixed / Miss / [nuanced take]
[VERIFY] consensus figures against FactSet / Bloomberg before finalising.
```

### Step 3 — Model update

```
Update my financial model based on these results:

Prior estimates:
- FY revenue: $[X]M, FY EBITDA: $[X]M, FY EPS: $[X]
- Q[X] specific: revenue $[X]M, EBITDA $[X]M

New guidance from company:
- Next quarter: revenue $[X]-$[X]M, EPS $[X]-$[X]
- Full year: revenue $[X]-$[X]M (was $[X]-$[X]M prior)
- Margin guidance: [X]%-[X]%

What should I change in my model?
- Q[X+1] estimate: revenue $[X]M → $[X]M (change: [X]%)
- FY estimate: revenue $[X]M → $[X]M (change: [X]%)
- Key driver of change: [volume / price / margin / cost / one-time]

[VERIFY] model changes against actual guidance language in the press release.
```

### Step 4 — Draft morning note

```
Draft an earnings morning note for clients.

Format: [Flash note (1-2 paragraphs) / Full note (structured)]
Audience: [institutional investors / portfolio managers / retail]
Rating: [Buy / Hold / Sell / Under Review]
Target price: $[X] (was $[X] — [raised/lowered/unchanged])

Key points to cover:
1. Headline: beat/miss, one-line verdict
2. Key positives (2-3)
3. Key concerns (1-2)
4. Guidance change and what it means for the year
5. Model changes (EPS estimate change)
6. Valuation: at [X]x FY[X] EV/EBITDA, stock trades at [premium/discount] to peers
7. Recommendation

Tone: direct, no hedging, state a view.
[VERIFY] all figures before sending to clients.
```

### Step 5 — Pre-earnings call preparation

```
I'm covering [company] earnings call on [date].
Consensus estimates: Revenue $[X]M, EPS $[X]
My estimates: Revenue $[X]M, EPS $[X] (vs. consensus because [reason])

Key topics I want to probe:
1. [Growth driver or risk you're watching]
2. [Margin question]
3. [Geographic or product mix]

Draft 5-7 analyst questions for the Q&A session.
Make them specific, non-softball, and designed to extract information management hasn't volunteered.
```

## Example

**User:** Analyse this earnings transcript excerpt from a SaaS company:
"Revenue came in at $142M, up 28% YoY, ahead of our guidance of $136-138M. ARR exited the quarter at $580M. Net Revenue Retention was 112%. We're guiding Q3 to $147-149M and raising full-year to $570-580M from $550-565M."

**Claude's analysis:**

Revenue beat: $142M vs. $137M midpoint guidance = $5M beat (3.6%)
NRR 112% strong — expansion outpacing churn
Full-year raised: midpoint $575M vs. prior $557M = $18M raise (+3.2%)

**One-line verdict:** Clean beat with guidance raise — execution solid, no signs of demand softness.

**Model changes [VERIFY]:** Full-year raised to $575M from $557M. Assuming similar beat cadence, realistic range is $580-590M for FY.

**Morning note lead:** "[Company] delivered a clean Q2 beat of $5M (3.6%) on the top line with 112% NRR signalling healthy expansion. Management raised full-year guidance by $18M at the midpoint — a credible raise given the Q2 beat. Maintain Buy, raising PT to $X on higher FY estimates."

---
