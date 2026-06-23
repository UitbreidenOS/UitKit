# Cost Optimizer for Agent Pools

A comprehensive cost analysis and optimization engine for Claude agent pools. Analyzes goals and pool configuration to identify and auto-apply cost reduction strategies.

## Features

- **Model Selection Optimization** — Recommend cheaper models for simple tasks (Haiku vs. Sonnet vs. Opus)
- **Token Reduction Strategies** — Identify prompt optimization, verbosity removal, and output format improvements
- **Batch Processing** — Suggest combining low-priority goals into single API calls
- **Result Caching** — Detect duplicate or similar goals for cache hit optimization
- **Resource Quota Optimization** — Right-size token budgets to actual usage patterns
- **Auto-Apply Safe Optimizations** — Automatically apply trivial, risk-free improvements
- **Comprehensive Reporting** — Detailed cost analysis with savings projections
- **Export Capabilities** — Generate optimization scripts and JSON recommendations

## Installation

```bash
npm install # already included in Claudient
```

## Quick Start

### Generate Optimization Report

```bash
node scripts/cost-optimizer.js report
```

Shows comprehensive cost analysis with top 5 optimization opportunities.

### Auto-Apply Safe Optimizations

```bash
node scripts/cost-optimizer.js auto-optimize
```

Automatically applies optimizations marked as safe and trivial.

### Save Recommendations to File

```bash
node scripts/cost-optimizer.js save recommendations.json
```

Export detailed recommendations as JSON for integration into workflows.

### Export Optimization Script

```bash
node scripts/cost-optimizer.js export optimizations.js
```

Generate an executable script with auto-generated optimization directives.

## Usage Patterns

### Pattern 1: Integrated Analysis in Agent Pool

```javascript
const { AgentPool, PRIORITIES } = require('./dont-stop-agent-pool.js');
const { CostOptimizer } = require('./cost-optimizer.js');

const pool = new AgentPool({ maxConcurrent: 4, globalBudget: 500000 });

// Submit goals...
pool.submitGoal('review pull request', { priority: PRIORITIES.HIGH });
pool.submitGoal('format code', { priority: PRIORITIES.LOW });

// Analyze and optimize
const optimizer = new CostOptimizer(pool);
optimizer.analyze();
optimizer.generateReport();

// Auto-apply safe optimizations
await optimizer.autoOptimize();
```

### Pattern 2: Task Classification

```javascript
const { CostAnalysis } = require('./cost-optimizer.js');

const analysis = new CostAnalysis(pool);
const taskType = analysis.classifyGoal('review authentication code');
// Returns: 'code-review'

const complexity = analysis.estimateComplexity('validate JSON input');
// Returns: 'trivial'

const modelRec = analysis.recommendModel('format code');
// Returns: { recommended: 'claude-3-haiku', reasoning: '...' }
```

### Pattern 3: Model Cost Calculation

```javascript
const optimizer = new CostOptimizer(pool);
optimizer.analyze();

const savings = optimizer.analysis.calculateModelSavings(
  'claude-3-sonnet',      // current model
  'claude-3-haiku',       // target model
  20000                   // estimated tokens
);
// Returns: ~$0.045 savings
```

### Pattern 4: Caching Integration

```javascript
const { ResultCache } = require('./cost-optimizer.js');

const cache = new ResultCache(1000);
const cachedResult = cache.get('review pull request for auth module');

if (!cachedResult) {
  // Execute goal...
  const result = /* ... */;
  cache.set('review pull request for auth module', result);
}

console.log(cache.getStats());
// { size: 1, hits: 0, misses: 1, hitRate: 0 }
```

## Cost Optimization Strategies

### 1. Model Downgrade

Tasks are classified by complexity and automatically matched to appropriate models:

| Task Type | Complexity | Recommended Model | Example |
|-----------|-----------|-------------------|---------|
| Formatting | Trivial | claude-3-haiku | Format code, lint |
| Testing | Simple | claude-3-haiku | Run unit tests |
| Documentation | Simple | claude-3-haiku | Generate docs |
| Deployment | Simple | claude-3-haiku | Deploy to staging |
| Code Review | Complex | claude-3-sonnet | Audit auth system |
| Debugging | Complex | claude-3-sonnet | Trace memory leaks |
| Architecture | Expert | claude-3-opus | Design system |

**Potential Savings:** 10-50% per task

### 2. Token Reduction

Techniques for reducing token consumption:

- Remove politeness phrases ("please", "could you kindly")
- Summarize verbose descriptions
- Add explicit output format (reduces clarification rounds)
- Combine multiple sentences into bullet points
- Remove unnecessary context

**Potential Savings:** 10-20% per task

### 3. Result Caching

When 3+ similar goals are submitted:

- Hash goal text (SHA256)
- Store results in memory cache (LRU, max 1000 entries)
- Return cached result on exact match
- 80% savings on cached hits

**Trigger:** Goal pattern appears 3+ times

**Potential Savings:** 60-80% for repeated patterns

### 4. Batch Processing

Low-priority goals can be combined:

- Group similar low-priority tasks
- Submit as single API call with multiple requests
- Reduces overhead per-request

**Trigger:** 2+ low-priority goals in queue

**Potential Savings:** 20-30% for batched goals

### 5. Resource Quota Right-Sizing

When actual token usage is much less than allocated:

- Current quota: 50,000 tokens
- Actual usage: 15,000 tokens
- Suggested quota: 22,500 tokens (1.5x actual)

**Trigger:** Actual usage < 50% of quota

**Potential Savings:** 5-10% per task

### 6. Pool Configuration

Optimize concurrency and global budget:

- Reduce concurrent workers if average load < 1
- Adjust global budget if utilization < 50%

**Potential Savings:** 10-30% at pool level

## Optimization Rules

Each optimization is categorized by:

- **Category:** model-selection, token-optimization, caching, batching, resource-allocation, budget-management
- **Impact:** Percentage savings (5-100%)
- **Difficulty:** trivial, easy, moderate, hard
- **AutoApply:** Whether safe to apply without manual review

### Auto-Apply Rules (Difficulty: Trivial)

These are automatically applied when `auto-optimize` is called:

1. Reduce global budget allocation (if utilization < 50%)
2. Adjust individual goal quotas (if actual < 50% of budget)
3. Implement caching for repeated patterns
4. Enable batching for low-priority goals

## CLI Commands

```bash
# Show help
node cost-optimizer.js --help

# Analyze pool (default)
node cost-optimizer.js analyze

# Generate full report
node cost-optimizer.js report

# Auto-apply safe optimizations
node cost-optimizer.js auto-optimize

# Export optimization script
node cost-optimizer.js export ./optimizations.js

# Save recommendations JSON
node cost-optimizer.js save ./recommendations.json

# With options
node cost-optimizer.js report --verbose
node cost-optimizer.js auto-optimize --pool-config metrics.json
```

## API Reference

### CostOptimizer

Main analysis and optimization engine.

```javascript
const optimizer = new CostOptimizer(pool);

// Run analysis
optimizer.analyze();

// Get analysis results
const summary = optimizer.analysis.getSummary();
// {
//   baseline: 150000,
//   projectedSavings: 45000,
//   savingsPercent: 30,
//   recommendationCount: 8,
//   optimizationCount: 10,
//   topOpportunities: [...]
// }

// Generate report
optimizer.generateReport();

// Auto-apply optimizations
const result = await optimizer.autoOptimize();
// { applied: ['rule1', 'rule2'], failed: [] }

// Save recommendations
optimizer.saveRecommendations('./recommendations.json');

// Export script
optimizer.exportOptimizationScript('./optimizations.js');
```

### CostAnalysis

Detailed cost analysis engine.

```javascript
const analysis = new CostAnalysis(pool);
analysis.analyze();

// Task classification
const taskType = analysis.classifyGoal('debug memory leak');
const complexity = analysis.estimateComplexity('format code');
const modelRec = analysis.recommendModel('review code');

// Cost calculation
const savings = analysis.calculateModelSavings('claude-3-sonnet', 'claude-3-haiku', 20000);

// Recommendations
const topOps = analysis.getTopOpportunities(5);
const summary = analysis.getSummary();

// Projections
const projectedSavings = analysis.calculateProjectedSavings();
```

### OptimizationRule

Represents a single optimization opportunity.

```javascript
const rule = new OptimizationRule(
  'Downgrade goal_xyz to claude-3-haiku',
  'model-selection',
  25,        // 25% savings impact
  'easy',    // Difficulty
  false,     // Don't auto-apply
  executor   // Optional execution function
);

// Apply the rule
await rule.apply(pool);

// Check status
console.log(rule.applied);      // true if successful
console.log(rule.appliedAt);    // ISO timestamp
```

### ResultCache

In-memory cache for goal results.

```javascript
const cache = new ResultCache(1000);  // Max 1000 entries

// Get cached result
const result = cache.get('validate JSON input');

// Set cached result
cache.set('validate JSON input', { valid: true });

// Cache statistics
const stats = cache.getStats();
// { size: 1, hits: 2, misses: 5, hitRate: 28.57 }
```

## Model Pricing Reference

Pricing per 1M tokens (2026 rates):

```javascript
{
  'claude-3-opus': { input: 15, output: 75 },
  'claude-3-sonnet': { input: 3, output: 15 },
  'claude-3-haiku': { input: 0.25, output: 1.25 },
  'claude-3.5-sonnet': { input: 3, output: 15 },
  'claude-3.5-haiku': { input: 0.25, output: 1.25 },
}
```

## Task Complexity Levels

```
TRIVIAL   — Yes/no answers, simple formatting (< 10 words, no conditions)
SIMPLE    — Single task, straightforward (< 30 words, < 2 branches)
MODERATE  — Multi-step, well-defined (< 100 words, < 4 branches)
COMPLEX   — Multiple perspectives, reasoning (< 200 words)
EXPERT    — Specialized knowledge, creative (> 200 words)
```

## Examples

### Example 1: Basic Analysis

```bash
node scripts/cost-optimizer-example.js 1
```

Basic cost analysis with diverse goals showing baseline vs. projected savings.

### Example 2: Task Classification

```bash
node scripts/cost-optimizer-example.js 2
```

Demonstrates how different goals are classified and matched to optimal models.

### Example 3: Auto-Optimization

```bash
node scripts/cost-optimizer-example.js 3
```

Shows before/after state when safe optimizations are automatically applied.

### Example 4: Caching Strategy

```bash
node scripts/cost-optimizer-example.js 4
```

Identifies caching opportunities when similar goals are repeated.

### Example 5: Batching Strategy

```bash
node scripts/cost-optimizer-example.js 5
```

Shows how low-priority goals can be combined for efficiency.

### Example 6: Quota Optimization

```bash
node scripts/cost-optimizer-example.js 6
```

Right-sizes individual goal quotas based on actual usage patterns.

### Example 7: Token Reduction

```bash
node scripts/cost-optimizer-example.js 7
```

Suggests techniques for reducing token consumption in prompts.

### Example 8: Model Downgrade

```bash
node scripts/cost-optimizer-example.js 8
```

Recommends cheaper models for simple tasks.

### Run All Examples

```bash
node scripts/cost-optimizer-example.js all
```

## Integration with Dont-Stop Agent Pool

The cost optimizer integrates seamlessly with the agent pool:

```javascript
const { AgentPool, PRIORITIES } = require('./dont-stop-agent-pool.js');
const { CostOptimizer } = require('./cost-optimizer.js');

async function runOptimizedPool() {
  const pool = new AgentPool({
    maxConcurrent: 4,
    globalBudget: 500000,
  });

  // Submit goals
  pool.submitGoal('code review', { priority: PRIORITIES.HIGH });
  pool.submitGoal('run tests', { priority: PRIORITIES.NORMAL });
  pool.submitGoal('format code', { priority: PRIORITIES.LOW });

  // Analyze before execution
  const optimizer = new CostOptimizer(pool);
  optimizer.analyze();
  optimizer.generateReport();

  // Auto-optimize
  await optimizer.autoOptimize();

  // Now start pool with optimizations applied
  await pool.start();

  // Check final metrics
  console.log(pool.getMetrics());
}

runOptimizedPool();
```

## Performance Impact

- **Analysis Time:** ~50-100ms for 1000 goals
- **Memory Overhead:** ~1-2MB for analysis
- **Cache Overhead:** ~100KB per 1000 cached results (LRU)
- **Auto-Apply Time:** ~10-20ms for trivial optimizations

## Troubleshooting

### No recommendations found?

Ensure goals are diverse enough and pool has processed tasks:

```javascript
// Good - diverse goals
pool.submitGoal('code review', { priority: PRIORITIES.HIGH });
pool.submitGoal('format code', { priority: PRIORITIES.LOW });
pool.submitGoal('run tests', { priority: PRIORITIES.NORMAL });

// Poor - all identical
pool.submitGoal('test', { priority: PRIORITIES.NORMAL });
pool.submitGoal('test', { priority: PRIORITIES.NORMAL });
```

### Auto-optimization not applying expected rules?

Check rule criteria:

```javascript
// Only "trivial" + "autoApply: true" are auto-applied
optimizer.analysis.optimizations.forEach(opt => {
  console.log(`${opt.name} - difficulty: ${opt.difficulty}, autoApply: ${opt.autoApply}`);
});
```

### Cache hit rate low?

Ensure goal text matches exactly (SHA256 hash):

```javascript
const cache = new ResultCache();
cache.set('validate email', { valid: true });
cache.get('validate email');      // Hit
cache.get('validate  email');     // Miss (extra space)
cache.get('Validate email');      // Miss (capitalization)
```

## Contributing

To add new optimization strategies:

1. Create new method in `CostAnalysis` class
2. Add recommendation objects to `this.recommendations`
3. Create corresponding `OptimizationRule` with executor
4. Test with `cost-optimizer-example.js`

## License

AGPL-3.0-or-later

## See Also

- `dont-stop-agent-pool.js` — Core agent pool implementation
- `cost-optimizer-example.js` — Interactive examples
- `scripts/cli.js` — Main CLI entry point
