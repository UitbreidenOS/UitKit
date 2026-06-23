# Cost Optimizer for Agent Pool

## Overview

`cost-optimizer.js` analyzes agent pool goals and configuration to identify cost reduction opportunities. It provides actionable recommendations and can auto-apply safe optimizations.

## Features

### 1. **Model Optimization**
- Analyzes goal complexity and task type
- Recommends cheaper models (Haiku, Sonnet) instead of Opus
- Calculates per-goal savings from model downgrades
- Classifies 15+ task types (code-review, testing, deployment, etc.)

### 2. **Token Reduction**
- Analyzes prompt clarity and structure
- Suggests: removing politeness phrases, adding output format specs, condensing multi-line goals
- Identifies verbose goals that can be streamlined
- Estimates 10-20% token savings per goal

### 3. **Batch Processing**
- Groups low-priority goals for batch API calls
- ~25% savings by combining multiple requests
- Identifies patterns across 3+ similar goals

### 4. **Caching Strategy**
- Detects recurring goal patterns
- Recommends caching results by goal pattern hash
- ~80% token savings on cache hits
- Tracks cache-eligible occurrences

### 5. **Resource Quota Adjustment**
- Analyzes actual token usage vs allocated quota
- Recommends tightening unused allocations
- Prevents over-provisioning

### 6. **Pool Configuration**
- Monitors concurrency efficiency
- Analyzes budget utilization
- Recommends scaling adjustments

## Installation

```bash
# No external dependencies required
# Uses built-in Node.js modules only
chmod +x scripts/cost-optimizer.js
```

## Usage

### Generate Optimization Report

```bash
node scripts/cost-optimizer.js report
```

Shows:
- Cost summary (baseline, projected savings, %savings)
- Breakdown by recommendation type
- Top 5 optimization opportunities with details
- All optimization rules by category

### Analyze Pool Configuration

```bash
node scripts/cost-optimizer.js analyze
```

Quick analysis output:
```
Analysis Complete:
  Baseline: $0.00
  Potential savings: $63.20 (Infinity%)
  Recommendations: 29
```

### Save Recommendations to JSON

```bash
node scripts/cost-optimizer.js save [filepath]
# Default: ./cost-recommendations.json
```

Output includes:
- Timestamp and pool ID
- Aggregate summary with top opportunities
- Full recommendation list with details
- Optimization rules with metadata

Example structure:
```json
{
  "timestamp": "2026-06-22T10:22:02.765Z",
  "poolId": "c7535527702f67f9",
  "summary": {
    "baseline": 0,
    "projectedSavings": 75790.65,
    "savingsPercent": 100,
    "recommendationCount": 27,
    "optimizationCount": 26,
    "topOpportunities": [...]
  },
  "recommendations": [...],
  "optimizations": [...]
}
```

### Export Optimization Script

```bash
node scripts/cost-optimizer.js export [filepath]
# Default: ./optimizations.js
```

Generates executable script with:
- Pre-configured optimization directives
- Stub implementations for: model downgrades, token reduction, batching, caching
- Pool setup with recommended configuration

## Recommendation Types

### 1. Model Downgrade
```
Downgrades expensive models to cheaper alternatives
From: claude-3-sonnet → To: claude-3-haiku
Applied to: trivial, simple, and formatting tasks
Savings: 75-90% per goal
```

**Safe for:**
- Testing, unit tests, linting
- Documentation, formatting
- Simple validation, status checks
- Monitoring, health checks

**Not recommended for:**
- Complex reasoning, architecture decisions
- Code reviews, debugging
- Security analysis, performance optimization

### 2. Token Reduction
```
Optimizes prompt formulation to reduce token count
Techniques:
  - Remove politeness phrases ("please", "would you")
  - Add output format specification (reduces clarification)
  - Combine multiple sentences into bullets
  - Use specific, focused language
Savings: 10-25% per goal
```

### 3. Caching
```
Detects recurring goal patterns and recommends result caching
Pattern: "testing tasks" (4 occurrences)
Strategy: Cache by goal pattern hash
Savings: ~80% on cache hits
```

### 4. Batching
```
Groups low-priority goals for combined API calls
Scope: low-priority goals (3+ targets)
Strategy: Combine into single request
Savings: ~25% per batch
```

### 5. Quota Adjustment
```
Aligns per-goal token quota with actual usage
Current: 50,000 tokens allocated
Actual usage: 15,000 tokens
Suggested: 22,500 tokens (1.5x actual)
Savings: Minor (5% per goal)
```

### 6. Pool Configuration
```
Recommends concurrency and budget adjustments
- Reduce max concurrent if load imbalanced
- Reduce budget if underutilized (<50%)
Savings: 10-30% on infrastructure
```

## API Reference

### CostAnalysis

```javascript
const { CostAnalysis } = require('./cost-optimizer.js');

const analysis = new CostAnalysis(pool);
analysis.analyze();

// Get results
analysis.calculateProjectedSavings();
const summary = analysis.getSummary();
const topOps = analysis.getTopOpportunities(5);
```

#### Methods
- `analyze()` - Run full analysis pass
- `calculateProjectedSavings()` - Aggregate savings
- `getSummary()` - Get summary metrics
- `getTopOpportunities(limit)` - Get N most impactful recommendations
- `autoApplyOptimizations()` - Apply safe optimizations
- `classifyGoal(goalText)` - Identify goal type
- `estimateComplexity(goalText)` - Assess task complexity
- `recommendModel(goalText)` - Suggest optimal model
- `calculateModelSavings(from, to, tokens)` - Model cost diff

### CostOptimizer

```javascript
const { CostOptimizer } = require('./cost-optimizer.js');

const optimizer = new CostOptimizer(pool);

// Analyze and report
optimizer.analyze();
optimizer.generateReport();

// Export results
optimizer.saveRecommendations('output.json');
optimizer.exportOptimizationScript('output.js');
```

#### Methods
- `analyze()` - Run cost analysis
- `generateReport()` - Print formatted report
- `saveRecommendations(filepath)` - Save to JSON
- `exportOptimizationScript(filepath)` - Export code script

## Model Pricing Reference

Claude 3 family pricing (per 1M tokens):

| Model | Input | Output | Use Case |
|-------|-------|--------|----------|
| claude-3-opus | $15 | $75 | Complex reasoning, architecture |
| claude-3-sonnet | $3 | $15 | Balanced capability/cost |
| claude-3-haiku | $0.25 | $1.25 | Simple tasks, high volume |
| claude-3.5-sonnet | $3 | $15 | Latest balanced |
| claude-3.5-haiku | $0.25 | $1.25 | Latest cheapest |

## Task Complexity Classification

**Trivial** (Haiku)
- Yes/no answers
- Simple formatting
- Status checks
- Basic validation

**Simple** (Haiku)
- Single task, straightforward
- Testing, unit tests
- Documentation
- Formatting, linting
- Deployment steps

**Moderate** (Sonnet)
- Multi-step but well-defined
- API endpoint validation
- Integration tests
- Standard code review

**Complex** (Sonnet)
- Multiple perspectives
- Reasoning required
- Debugging
- Optimization
- Performance analysis

**Expert** (Opus)
- Specialized domain knowledge
- Architecture decisions
- Complex security analysis
- Creative problem-solving
- Novel design patterns

## Optimization Strategy

### Phase 1: Quick Wins (Implement Immediately)
1. Model downgrade for trivial/simple tasks (+50-75% savings)
2. Reduce over-provisioned quotas (+5% savings)
3. Global budget reduction if <50% utilized (+10% savings)

### Phase 2: Structured Improvements (1-2 weeks)
1. Implement token reduction techniques (+15% savings)
2. Set up batch processing for low-priority goals (+25% savings)
3. Add caching for recurring patterns (+60% savings)

### Phase 3: Advanced Optimization (Ongoing)
1. Monitor and refine model selection
2. Adapt batching strategy based on execution patterns
3. Expand caching to new patterns
4. Profile token usage and iterate

## Example Integration

```javascript
const { AgentPool, PRIORITIES } = require('./dont-stop-agent-pool.js');
const { CostOptimizer } = require('./cost-optimizer.js');

async function runWithOptimizations() {
  const pool = new AgentPool({
    maxConcurrent: 4,
    globalBudget: 500000,
  });

  // Submit goals...
  pool.submitGoal('run unit tests', {
    priority: PRIORITIES.NORMAL,
  });

  // Analyze before execution
  const optimizer = new CostOptimizer(pool);
  optimizer.analyze();
  optimizer.generateReport();
  optimizer.saveRecommendations('./rec.json');

  // Run pool
  await pool.start();

  // Show projected vs actual
  const metrics = pool.getMetrics();
  console.log(`Actual spend: $${metrics.cost.spent}`);
  console.log(`Projected savings: $${optimizer.analysis.projectedSavings}`);
}

runWithOptimizations();
```

## Tips for Maximum Savings

1. **Profile First** - Run analysis before optimization to establish baseline
2. **Prioritize By Impact** - Implement top 5 recommendations first
3. **Monitor After Changes** - Verify actual savings match projections
4. **Iterate** - Re-analyze quarterly or after major workload changes
5. **Test Carefully** - Verify model downgrades don't reduce quality

## Limitations

- Token estimation is heuristic-based (actual depends on model)
- Complexity classification is rule-based (not ML)
- Caching effectiveness depends on exact goal text matching
- Savings are projected; actual depends on implementation
- Does not account for quality reduction from aggressive optimization

## Future Enhancements

- [ ] ML-based complexity classification
- [ ] Historical execution pattern analysis
- [ ] Adaptive model selection based on success rates
- [ ] Automatic cache invalidation strategies
- [ ] Cost-benefit analysis for quality vs savings tradeoff
- [ ] Real-time optimization during pool execution
- [ ] Per-model performance benchmarking
- [ ] Recommendation rollback mechanism
