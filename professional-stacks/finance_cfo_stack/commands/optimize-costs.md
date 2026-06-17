# Command: /optimize-costs

## Trigger
User runs `/optimize-costs` with optional [target_reduction %] parameter.

## What it does
Audits cost structure; identifies reduction opportunities or benchmarking against industry peers.

## Instructions
1. Prompt user for: cost data source (file/GL export), company size/vertical for benchmarking.
2. Parse costs by category; compute as % of revenue.
3. Benchmark against industry median for similar-sized SaaS/vertical.
4. Identify categories >5% above peer median; flag for optimization review.
5. Invoke `cost-optimizer` skill.
6. Model 5–20% reduction scenarios; identify non-core or redundant spend.
7. Prioritize opportunities (quick wins, strategic changes).
8. Log to `session-log.md`: categories audited, top opportunities, potential savings, phasing.

## Example
`/optimize-costs 10` → Identifies cost categories 10%+ above industry median; prioritizes 5–10% reduction opportunities with phasing plan.

## Output format
Cost audit summary, benchmark comparison chart, opportunity scorecard (impact, effort, timeline), and phased savings roadmap.
