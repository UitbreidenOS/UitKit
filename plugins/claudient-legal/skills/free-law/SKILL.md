---
name: "Free Law Project (CourtListener) — Free US Legal Research"
description: "Researching US federal and state court decisions without a paid subscription; looking up PACER filings, docket numbers, or judge records; bulk case law lookups where a paid service would be cost-prohi"
---

# Free Law Project (CourtListener) — Free US Legal Research

## When to activate
Researching US federal and state court decisions without a paid subscription; looking up PACER filings, docket numbers, or judge records; bulk case law lookups where a paid service would be cost-prohibitive; open-access legal research for academic or public interest work.

## When NOT to use
Research requiring secondary sources (law review analysis, Practical Law guidance notes, Westlaw headnotes) — use Thomson Reuters MCP for those; research outside US federal courts where CourtListener coverage is sparse or absent; time-sensitive work requiring guaranteed same-day opinion coverage (some recent opinions have publication delays).

## Instructions

**What it is:**
Free Law Project runs CourtListener — the largest free, open-access US legal database. The MCP integration (May 2026) requires no subscription, no API key purchase, and no per-query billing.

**Coverage:**
- Federal circuit and district court opinions (comprehensive)
- US Supreme Court opinions (comprehensive)
- PACER filings and docket data (federal courts)
- Judge biographical records, recusal history, financial disclosures
- Oral argument audio recordings (where available)
- State court coverage varies significantly by state — verify before relying on state court completeness

**Rate limits:**
Free tier is rate-limited. Structure queries to be specific and targeted — avoid rapid-fire broad queries. Batch related lookups into single requests where possible.

**Query types:**

Case search by keyword:
```
Find 9th Circuit opinions from 2023-2026 involving AI-generated content
and copyright infringement. Return citations and a one-paragraph holding summary.
```

Citation lookup:
```
Retrieve the full text of Twitter, Inc. v. Taamneh, 598 U.S. 471 (2023).
```

Judge records:
```
What cases has Judge Jacqueline Scott Corley decided involving
Section 230 since 2021?
```

Docket lookup:
```
Find the current docket for FTC v. Meta Platforms in the Northern
District of California. List pending motions.
```

**Limitations — know before you query:**
- US federal courts are the primary strength; state court coverage is inconsistent
- No secondary sources, no law review articles, no Practical Law content
- Some recent opinions have a publication delay (days to weeks)
- Full PACER docket coverage requires a PACER account for some sealed or restricted filings

**Pair with Thomson Reuters MCP:**
CourtListener for free primary source volume + TR MCP for secondary source analysis and Westlaw depth. Example workflow: use CourtListener to identify relevant cases in bulk, then pull Westlaw analysis on the key ones via TR MCP.

**MANDATORY output warning — include on every research output:**
> For research purposes only — verify with licensed counsel before relying on any legal analysis.

**Citation format:** Always include full citation: case name, volume, reporter, first page, court, year. Example: `NetChoice, LLC v. Paxton, 49 F.4th 439 (5th Cir. 2022)`.

## Example

```
Find all 9th Circuit opinions from 2023-2026 involving AI-generated content
and copyright infringement. Return Bluebook citations and a one-paragraph
summary of each holding.
```

Claude queries CourtListener via MCP, returns a list of matching opinions with citations and holding summaries, notes which cases have pending cert petitions, and appends the mandatory research disclaimer.

---
