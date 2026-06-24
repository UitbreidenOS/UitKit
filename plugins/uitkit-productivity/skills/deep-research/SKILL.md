---
name: "deep-research"
description: "Deep research: multi-step research synthesis, source triangulation, confidence scoring, structured research reports, competitive analysis, and systematic literature review"
---

# Deep Research — Multi-Step Research Synthesis

## When to activate
- Investigating a topic that requires multiple sources and cross-referencing
- Competitive analysis requiring data from multiple companies and markets
- Technical evaluation comparing frameworks, tools, or architectural approaches
- Due diligence research for investment, partnership, or acquisition decisions
- Regulatory or compliance research across multiple jurisdictions
- When the user says "research this thoroughly" or "give me a deep dive on X"

## When NOT to use
- Simple factual questions with a single authoritative answer
- Tasks where the answer is already in the codebase or documentation
- Quick lookups that a single web search can resolve
- When the user needs an opinion rather than a research synthesis

## Instructions

### 1. Research Framework

```
Phase 1: Scope
  → Define the research question precisely
  → Identify what "complete" looks like (deliverables)
  → Set time and depth constraints

Phase 2: Gather
  → Search multiple source types (web, docs, code, data)
  → Collect raw findings with source attribution
  → Track search queries for reproducibility

Phase 3: Analyze
  → Cross-reference findings across sources
  → Identify consensus, contradictions, and gaps
  → Score confidence per finding

Phase 4: Synthesize
  → Structure findings into coherent narrative
  → Highlight actionable insights
  → Flag areas needing further investigation
```

### 2. Source Triangulation

For each key finding, require at least 2 independent sources:

```yaml
triangulation:
  levels:
    strong:
      sources: "3+ independent sources agree"
      confidence: "HIGH (90%+)"
      action: "Recommend with confidence"
      
    moderate:
      sources: "2 sources agree, or 1 authoritative source"
      confidence: "MEDIUM (60-89%)"
      action: "Recommend with caveats"
      
    weak:
      sources: "1 non-authoritative source, or conflicting data"
      confidence: "LOW (<60%)"
      action: "Flag as uncertain, suggest verification"
```

### 3. Confidence Scoring

Assign confidence to every claim in the research output:

| Confidence | Criteria | Example |
|---|---|---|
| **HIGH** | 3+ sources, primary data, recent (<6 months) | "PostgreSQL handles 10K concurrent connections (benchmarks: pgBench, HammerDB, internal)" |
| **MEDIUM** | 2 sources or 1 authoritative, 6-12 months old | "Company X revenue ~$50M ARR (Crunchbase + press release)" |
| **LOW** | 1 informal source, >12 months old, or inference | "Framework Y is gaining adoption (blog post from 2025)" |
| **UNVERIFIED** | Single claim, no corroborating source | "Reportedly planning Z launch (unconfirmed rumor)" |

### 4. Research Output Structure

```markdown
# Research Report: [Topic]
**Date:** 2026-06-13
**Researcher:** [Agent/Person]
**Scope:** [What was investigated and what was excluded]

## Executive Summary
[3-5 bullet points of key findings]

## Key Findings

### Finding 1: [Title] [CONFIDENCE: HIGH]
**Evidence:** [Data points, quotes, metrics]
**Sources:** [1, 2, 3]
**Implication:** [What this means for the decision]

### Finding 2: [Title] [CONFIDENCE: MEDIUM]
**Evidence:** [Data points]
**Sources:** [1, 2]
**Caveat:** [What could change this]

## Competitive Landscape
| Competitor | Strength | Weakness | Market Position |
|------------|----------|----------|-----------------|
| A | ... | ... | Leader |
| B | ... | ... | Challenger |

## Gaps & Unknowns
- [Question that couldn't be answered]
- [Area requiring expert consultation]
- [Data that's proprietary/unavailable]

## Recommendations
1. [Action item with confidence level]
2. [Action item with confidence level]

## Sources
| # | Source | Type | Date | Reliability |
|---|--------|------|------|-------------|
| 1 | [URL/name] | [primary/secondary] | [date] | [high/medium/low] |
```

### 5. Research Patterns by Domain

**Technical evaluation:**
```yaml
research_plan:
  sources:
    - official_documentation: "API docs, migration guides, benchmarks"
    - community: "GitHub stars, issue activity, Stack Overflow questions"
    - real_world: "Case studies, production usage reports, blog posts"
  compare_on:
    - performance: "benchmarks, latency, throughput"
    - developer_experience: "API design, documentation, error messages"
    - ecosystem: "plugins, integrations, community size"
    - maintenance: "release frequency, security patches, backwards compatibility"
```

**Competitive analysis:**
```yaml
research_plan:
  sources:
    - public_data: "Crunchbase, press releases, annual reports"
    - product: "feature comparison, pricing pages, documentation"
    - reviews: "G2, Capterra, TrustRadius, social media"
  analyze:
    - positioning: "target market, value proposition, pricing"
    - momentum: "hiring, funding, product velocity"
    - gaps: "missing features, common complaints, churn signals"
```

### 6. Search Strategy

```yaml
search_strategy:
  round_1_broad:
    query: "[topic] overview 2026"
    goal: "Understand landscape, identify key players"
    sources: ["web search", "Wikipedia", "industry reports"]
    
  round_2_focused:
    query: "[specific aspect] comparison benchmark"
    goal: "Deep dive into specific claims"
    sources: ["technical blogs", "GitHub repos", "academic papers"]
    
  round_3_validation:
    query: "[claim] evidence counter-example"
    goal: "Verify or refute key findings"
    sources: ["primary sources", "official data", "expert opinions"]
```

## Example

**Deep research on "Best database for real-time analytics at 100M+ rows":**

```
Round 1 (Broad): Search "real-time analytics database comparison 2026"
  → Candidates: ClickHouse, Apache Druid, StarRocks, DuckDB, Pinot

Round 2 (Focused): Search each candidate + "100 million rows benchmark"
  → ClickHouse: 0.5s p99 on 100M rows (official benchmark) [MEDIUM]
  → Druid: 1.2s p99 on similar workload (third-party bench) [MEDIUM]
  → StarRocks: claims 0.3s but only on their own benchmark [LOW]

Round 3 (Validation): Cross-reference with production case studies
  → Cloudflare uses ClickHouse at 100B+ rows/day [HIGH — primary source]
  → Uber uses Druid for real-time dashboards [HIGH — engineering blog]
  → StarRocks: no public production case study at this scale [LOW]

Final Report:
  Finding 1 [HIGH]: ClickHouse is the proven leader for this workload
  Finding 2 [MEDIUM]: Druid is strong for pre-aggregated dashboards
  Finding 3 [LOW]: StarRocks claims better performance but lacks independent validation
  Recommendation: ClickHouse for new projects, Druid if already invested in its ecosystem
```

## Anti-Patterns

- **Single-source research:** Drawing conclusions from one blog post — always triangulate with 2+ independent sources
- **Recency bias:** Only looking at the latest source — older foundational references may be more authoritative
- **Confirmation bias:** Searching only for evidence that supports a pre-existing belief — actively search for counter-evidence
- **No confidence scoring:** Presenting all findings as equally reliable — always label confidence per finding
- **Missing gaps section:** Not acknowledging what couldn't be determined — explicitly list unknowns and unanswerable questions
- **Source dumping:** Listing 50 sources without analyzing them — synthesize findings, don't just aggregate links
