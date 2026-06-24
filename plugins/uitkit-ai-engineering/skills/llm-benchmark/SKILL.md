---
name: "llm-benchmark"
description: "LLM benchmarking: design benchmark suites, establish baselines, run A/B model comparisons, detect regressions, track production quality metrics, and create leaderboards for model selection"
---

# LLM Benchmarking Skill

## When to activate
- Comparing two or more LLM models for a production use case
- Detecting quality regressions after prompt changes or model updates
- Establishing performance baselines before shipping an LLM feature
- Creating internal leaderboards for model selection
- Measuring latency, cost, and quality tradeoffs across model tiers
- Running canary tests before rolling out a new model version

## When NOT to use
- One-off prompt experiments (use llm-eval instead)
- Training/fine-tuning model evaluation (different workflow)
- Simple unit testing of deterministic code paths
- When you need evaluation dataset design (use llm-eval)

## Instructions

### 1. Benchmark Suite Design

Structure benchmarks by capability dimension:

```yaml
benchmark_suite:
  name: "customer-support-quality"
  version: "1.2.0"
  
  dimensions:
    - name: accuracy
      weight: 0.30
      description: "Correctness of information provided"
      metric: llm_as_judge
      grader: gpt-4  # independent judge model
      
    - name: helpfulness
      weight: 0.25
      description: "Actionability and completeness"
      metric: llm_as_judge
      grader: gpt-4
      
    - name: safety
      weight: 0.20
      description: "No harmful, biased, or hallucinated content"
      metric: rubric_check
      rubric: safety-rubric-v2
      
    - name: latency_p95
      weight: 0.15
      description: "Response time under load"
      metric: timing
      threshold_ms: 3000
      
    - name: cost_per_query
      weight: 0.10
      description: "Token cost per query"
      metric: token_cost
      threshold_usd: 0.02

  test_cases:
    count: 200
    distribution:
      - simple_queries: 40%
      - complex_reasoning: 30%
      - edge_cases: 20%
      - adversarial: 10%
```

### 2. Baseline Establishment

Before comparing models, establish a stable baseline:

```python
class BenchmarkBaseline:
    """Store and compare against historical baselines."""
    
    def establish(self, model: str, suite: BenchmarkSuite) -> Baseline:
        """Run benchmark 3x and average for stable baseline."""
        runs = [suite.run(model) for _ in range(3)]
        
        baseline = Baseline(
            model=model,
            suite=suite.name,
            timestamp=datetime.now(),
            scores={
                dim.name: {
                    "mean": np.mean([r.scores[dim.name] for r in runs]),
                    "std": np.std([r.scores[dim.name] for r in runs]),
                    "p5": np.percentile([r.scores[dim.name] for r in runs], 5),
                    "p95": np.percentile([r.scores[dim.name] for r in runs], 95),
                }
                for dim in suite.dimensions
            },
            latency_p50=np.percentile(all_latencies, 50),
            latency_p95=np.percentile(all_latencies, 95),
            cost_per_query=np.mean(costs),
        )
        
        # Save as the canonical baseline
        store.save(baseline, tag=f"baseline-{suite.name}-v{suite.version}")
        return baseline
```

### 3. A/B Model Comparison

```python
def compare_models(
    baseline: Baseline,
    challenger: str,
    suite: BenchmarkSuite,
    significance: float = 0.05,
) -> ComparisonReport:
    """Compare challenger against baseline with statistical rigor."""
    
    # Run challenger multiple times for variance estimation
    challenger_runs = [suite.run(challenger) for _ in range(5)]
    
    report = ComparisonReport(baseline=baseline, challenger=challenger)
    
    for dim in suite.dimensions:
        baseline_scores = [baseline.scores[dim.name]["mean"]]
        challenger_scores = [r.scores[dim.name] for r in challenger_runs]
        
        # Statistical test (bootstrap for non-normal distributions)
        t_stat, p_value = ttest_ind(baseline_scores, challenger_scores)
        
        # Effect size (Cohen's d)
        effect = cohens_d(challenger_scores, baseline_scores)
        
        report.add_dimension(
            name=dim.name,
            baseline=baseline.scores[dim.name]["mean"],
            challenger=np.mean(challenger_scores),
            delta=np.mean(challenger_scores) - baseline.scores[dim.name]["mean"],
            p_value=p_value,
            significant=p_value < significance,
            effect_size=effect,
            verdict="WIN" if p_value < significance and effect > 0.2
                    else "LOSS" if p_value < significance and effect < -0.2
                    else "TIE",
        )
    
    return report
```

### 4. Regression Detection

```python
def detect_regression(
    current: BenchmarkResult,
    baseline: Baseline,
    thresholds: dict = None,
) -> list[Regression]:
    """Detect quality regressions against baseline."""
    
    regressions = []
    for dim in current.suite.dimensions:
        current_score = current.scores[dim.name]
        baseline_mean = baseline.scores[dim.name]["mean"]
        baseline_std = baseline.scores[dim.name]["std"]
        
        # Regression if score drops below baseline - 2σ
        threshold = thresholds.get(dim.name, 2.0)
        lower_bound = baseline_mean - threshold * baseline_std
        
        if current_score < lower_bound:
            regressions.append(Regression(
                dimension=dim.name,
                severity="CRITICAL" if current_score < baseline_mean - 3 * baseline_std
                         else "WARNING",
                current=current_score,
                baseline=baseline_mean,
                drop=baseline_mean - current_score,
                drop_pct=(baseline_mean - current_score) / baseline_mean * 100,
            ))
    
    return regressions
```

### 5. Production Monitoring Dashboard

Track these metrics continuously:

```
┌─────────────────────────────────────────────────────┐
│ LLM BENCHMARK DASHBOARD                              │
├─────────────────────────────────────────────────────┤
│                                                      │
│ QUALITY SCORES (daily)                               │
│ ┌──────────┬────────┬────────┬──────────┐           │
│ │ Metric   │ Today  │ 7-day  │ Baseline │           │
│ ├──────────┼────────┼────────┼──────────┤           │
│ │ Accuracy │ 0.87   │ 0.85   │ 0.83     │ ✅ +4.8%  │
│ │ Helpful  │ 0.79   │ 0.81   │ 0.82     │ ⚠️ -1.2%  │
│ │ Safety   │ 0.98   │ 0.97   │ 0.96     │ ✅ +2.1%  │
│ └──────────┴────────┴────────┴──────────┘           │
│                                                      │
│ PERFORMANCE                                          │
│ Latency P50: 1.2s | P95: 2.8s | P99: 4.1s          │
│ Cost/query: $0.018 | Daily spend: $432               │
│                                                      │
│ ALERTS                                               │
│ ⚠️ Helpfulness trending down 3 days — investigate    │
│ ✅ Accuracy improved after prompt v2.3 deploy        │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 6. Leaderboard Generation

```
MODEL LEADERBOARD: customer-support-quality v1.2
Benchmark date: 2026-06-13 | Test cases: 200

| Rank | Model              | Overall | Accuracy | Helpful | Safety | Lat P95 | $/query |
|------|--------------------|---------|----------|---------|--------|---------|---------|
| 1    | claude-sonnet-4      | 0.91    | 0.93     | 0.89    | 0.99   | 2.1s    | $0.015  |
| 2    | gpt-4o               | 0.89    | 0.91     | 0.88    | 0.97   | 1.8s    | $0.018  |
| 3    | claude-haiku-3.5     | 0.84    | 0.85     | 0.82    | 0.96   | 0.8s    | $0.003  |
| 4    | gemini-2.5-flash     | 0.82    | 0.84     | 0.79    | 0.95   | 1.1s    | $0.004  |
| 5    | llama-3.1-405b       | 0.78    | 0.80     | 0.76    | 0.92   | 3.2s    | $0.008  |

Selection recommendation: claude-sonnet-4 (best overall, acceptable latency)
Budget option: claude-haiku-3.5 (92% of top quality at 20% cost)
```

## Example

**Comparing model upgrade for production chatbot:**

```
BENCHMARK REPORT: Customer Support Bot v2.3 → v2.4
Suite: customer-support-quality v1.2 | 200 test cases | 5 runs

BASELINE: claude-sonnet-4 + prompt v2.3
CHALLENGER: claude-sonnet-4 + prompt v2.4

DIMENSION COMPARISON:
| Dimension  | Baseline | Challenger | Delta  | p-value | Effect | Verdict |
|------------|----------|------------|--------|---------|--------|---------|
| Accuracy   | 0.89     | 0.93       | +0.04  | 0.003   | 0.67   | ✅ WIN   |
| Helpfulness| 0.82     | 0.81       | -0.01  | 0.42    | 0.12   | TIE     |
| Safety     | 0.97     | 0.98       | +0.01  | 0.31    | 0.15   | TIE     |
| Latency P95| 2.3s     | 2.1s       | -0.2s  | 0.01    | 0.45   | ✅ WIN   |
| Cost/query | $0.019   | $0.015     | -$0.004| <0.001  | 0.89   | ✅ WIN   |

RECOMMENDATION: Ship v2.4 — accuracy improved 4.5% with faster latency and lower cost.
No regression detected. Helpfulness unchanged (TIE, not regression).
```

## Anti-Patterns

- **Single-run comparison:** Always run 3-5 times minimum — LLM outputs are stochastic
- **Ignoring variance:** A "win" within noise bounds is not a real win
- **Benchmark gaming:** Optimizing for benchmark metrics at the expense of real-world quality
- **Stale baselines:** Re-establish baselines quarterly as model landscape evolves
- **Cost-blind comparison:** The best model is not always the most accurate — consider cost/quality tradeoff
- **No adversarial tests:** Only testing happy paths misses failure modes
