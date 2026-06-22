# Task Optimizer - ML-Based Adaptive Task Sequencing

Intelligent task sequencing library that learns from execution history to optimize workflow efficiency.

## Features

- **Confidence Scoring**: ML model calculates success likelihood (0-1) per task based on historical data
- **Adaptive Sequencing**: Automatically reorders tasks to run high-confidence tasks first
- **Duration Estimation**: Predicts task completion time with confidence intervals
- **Failure Analysis**: Tracks error patterns and suggests alternative approaches
- **Success Prediction**: Probabilistic forecasting of task outcomes
- **Completion Forecasting**: Estimates total workflow duration (sequential/parallel)
- **Persistent Learning**: Saves execution history for continuous model improvement

## Installation

```javascript
const TaskOptimizer = require('./lib/task-optimizer');
```

## Quick Start

```javascript
const optimizer = new TaskOptimizer({
  storageKey: 'my-workflow-tasks',
  minSamples: 3,                    // min attempts before confidence estimation
  confidenceThreshold: 0.6,         // cutoff for "ready to run"
  decayFactor: 0.95,                // exponential decay for old data (0-1)
});

// Register tasks
optimizer.registerTask('build', {
  name: 'Build Application',
  category: 'build',
  approaches: ['default', 'cached', 'incremental'],
  estimatedDuration: 300000, // milliseconds
});

// Record execution results
optimizer.recordResult('build', {
  success: true,
  duration: 280000,
  approach: 'default',
});

// Get optimal execution order
const sequence = optimizer.getOptimalSequence();
// Returns: [{ id, name, confidence, durationEstimate, ... }]

// Estimate completion time
const estimate = optimizer.estimateCompletion(
  ['build', 'test', 'deploy'],
  1  // parallelism (1 = sequential)
);
// { sequential: 600000, parallel: 200000, avgConfidence: 0.85, ... }
```

## API Reference

### Constructor

```javascript
new TaskOptimizer(options)
```

**Options:**
- `storageKey` (string): localStorage key for persistence. Default: `'task-optimizer-data'`
- `confidenceThreshold` (number): 0-1 confidence cutoff. Default: `0.6`
- `decayFactor` (number): 0-1 exponential decay for age. Default: `0.95`
- `minSamples` (number): Minimum attempts before confidence estimation. Default: `3`

---

### registerTask(taskId, metadata)

Register a new task or retrieve existing task.

**Parameters:**
- `taskId` (string): Unique task identifier
- `metadata` (object, optional):
  - `name` (string): Human-readable task name
  - `category` (string): Task category for grouping
  - `approaches` (array): Available execution strategies
  - `estimatedDuration` (number): Expected duration in milliseconds

**Returns:** Task object with stats

```javascript
optimizer.registerTask('build-api', {
  name: 'Build REST API',
  category: 'backend',
  approaches: ['incremental', 'cached', 'full'],
  estimatedDuration: 300000,
});
```

---

### recordResult(taskId, result)

Log task execution outcome and duration.

**Parameters:**
- `taskId` (string): Task identifier
- `result` (object):
  - `success` (boolean): Whether task succeeded
  - `duration` (number): Execution time in milliseconds
  - `approach` (string, optional): Which approach was used
  - `error` (string, optional): Error message if failed
  - `metadata` (object, optional): Custom execution metadata

**Returns:** Result record

```javascript
optimizer.recordResult('build-api', {
  success: true,
  duration: 280000,
  approach: 'cached',
  metadata: { cached: true, filesChanged: 5 },
});

optimizer.recordResult('build-api', {
  success: false,
  duration: 45000,
  approach: 'incremental',
  error: 'ENOENT: source file not found',
});
```

---

### calculateConfidenceScore(taskId)

Get confidence score (0-1) based on historical success rate and recency.

**Parameters:**
- `taskId` (string): Task identifier

**Returns:** Number 0-1 (0=unknown/untrusted, 1=highly confident)

**Factors:**
- Success rate (primary)
- Number of attempts (minimum samples)
- Recency (exponential decay for old data)

```javascript
const confidence = optimizer.calculateConfidenceScore('build-api');
console.log(`${(confidence * 100).toFixed(1)}% confident`);
// Output: 85.3% confident
```

---

### estimateDuration(taskId)

Predict task duration based on historical execution times.

**Parameters:**
- `taskId` (string): Task identifier

**Returns:** Object
- `estimate` (number|null): Estimated duration in milliseconds
- `confidence` (number): Confidence in estimate (0-1)
- `breakdown` (object): { avgDuration, samples, total }

```javascript
const est = optimizer.estimateDuration('build-api');
// {
//   estimate: 285000,
//   confidence: 0.72,
//   breakdown: {
//     avgDuration: 285000,
//     samples: 5,
//     total: 1425000
//   }
// }
```

---

### getOptimalSequence(taskIds)

Get all tasks ordered by confidence score (highest first).

**Parameters:**
- `taskIds` (array, optional): Specific task IDs to sequence. If omitted, sequences all.

**Returns:** Array of tasks sorted by descending confidence

```javascript
const sequence = optimizer.getOptimalSequence(['task1', 'task2', 'task3']);

sequence.forEach(task => {
  console.log(`${task.name} (${(task.confidence * 100).toFixed(0)}% confidence)`);
});
// Output:
// Build API (95% confidence)
// Run Tests (82% confidence)
// Deploy (61% confidence)
```

---

### estimateCompletion(taskIds, parallelism)

Forecast workflow completion time.

**Parameters:**
- `taskIds` (array, optional): Tasks to estimate. Defaults to all tasks.
- `parallelism` (number): How many tasks can run in parallel. Default: `1`

**Returns:** Object
- `sequential` (number): Total duration if run one-by-one (milliseconds)
- `parallel` (number): Duration with parallelism (milliseconds)
- `parallelism` (number): Parallelism level used
- `avgConfidence` (number): Average confidence across all tasks
- `taskCount` (number): Number of tasks included
- `breakdown` (array): Per-task estimates

```javascript
const completion = optimizer.estimateCompletion(
  ['build', 'test', 'deploy'],
  2  // 2 parallel workers
);

console.log(`Sequential: ${completion.sequential / 1000 / 60} minutes`);
console.log(`Parallel: ${completion.parallel / 1000 / 60} minutes`);
console.log(`Confidence: ${(completion.avgConfidence * 100).toFixed(0)}%`);
```

---

### suggestAlternativeApproach(taskId, currentApproach)

Recommend alternative execution strategy based on failure history.

**Parameters:**
- `taskId` (string): Task identifier
- `currentApproach` (string, optional): Current approach to compare against. Default: `'default'`

**Returns:** Array of suggestions sorted by success rate
- `approach` (string): Approach name
- `successRate` (number): Historical success rate (0-1)
- `avgDuration` (number): Average duration
- `attempts` (number): Number of times tried
- `confidence` (number): Confidence in recommendation (0-1)
- `reason` (string): Explanation for suggestion

```javascript
const suggestions = optimizer.suggestAlternativeApproach('build', 'default');

suggestions.forEach(s => {
  console.log(`${s.approach}: ${(s.successRate * 100).toFixed(0)}% success`);
  console.log(`  Reason: ${s.reason}`);
});
// Output:
// cached: 92% success
//   Reason: cached has 18% higher success rate
// incremental: 78% success
//   Reason: incremental is 35% faster
```

---

### getFailurePatterns(taskId)

Get error patterns sorted by frequency.

**Parameters:**
- `taskId` (string): Task identifier

**Returns:** Array of failure patterns
- `error` (string): Error message/type
- `approach` (string): Which approach produced this error
- `count` (number): How many times occurred
- `firstOccurrence` (number): Timestamp
- `lastOccurrence` (number): Timestamp

```javascript
const patterns = optimizer.getFailurePatterns('build');

patterns.slice(0, 3).forEach(p => {
  console.log(`${p.error} (${p.count}x with ${p.approach})`);
  console.log(`  Last: ${new Date(p.lastOccurrence).toISOString()}`);
});
```

---

### predictSuccess(taskId, context)

Probabilistic forecast of task success.

**Parameters:**
- `taskId` (string): Task identifier
- `context` (object, optional): Additional context

**Returns:** Object
- `prediction` (number): Success probability (0-1)
- `factors` (object): Weighted contribution of each factor

```javascript
const pred = optimizer.predictSuccess('deploy');
console.log(`Predicted success: ${(pred.prediction * 100).toFixed(1)}%`);

Object.entries(pred.factors).forEach(([factor, weight]) => {
  console.log(`  ${factor}: ${(weight * 100).toFixed(1)}%`);
});
```

---

### getTaskAnalytics(taskId)

Get comprehensive task metrics and history.

**Parameters:**
- `taskId` (string): Task identifier

**Returns:** Object
- `taskId` (string): Task ID
- `name` (string): Task name
- `category` (string): Task category
- `statistics` (object): Attempts, successes, failures, rates, durations
- `confidence` (number): Confidence score
- `durationEstimate` (object): Duration estimate
- `failurePatterns` (array): Top failure patterns
- `recentAttempts` (array): Last 10 execution records
- `suggestedApproaches` (array): Recommended alternatives

```javascript
const analytics = optimizer.getTaskAnalytics('build');

console.log(`Success rate: ${(analytics.statistics.successRate * 100).toFixed(1)}%`);
console.log(`Avg duration: ${(analytics.statistics.avgDuration / 1000).toFixed(1)}s`);
console.log(`Top error: ${analytics.failurePatterns[0].error}`);
```

---

### exportModel()

Export model for analysis, versioning, or transfer.

**Returns:** Object
- `version` (string): Model version
- `exportedAt` (number): Export timestamp
- `config` (object): Model configuration
- `tasks` (array): All task records
- `historySize` (number): Total history records
- `historySnapshot` (array): Last 100 records

```javascript
const model = optimizer.exportModel();
console.log(`Tasks tracked: ${model.tasks.length}`);
console.log(`History records: ${model.historySize}`);

// Save for analysis
fs.writeFileSync('model.json', JSON.stringify(model, null, 2));
```

---

### save() / load() / reset()

Persistence control.

```javascript
// Auto-save on every record (called automatically)
optimizer.save();

// Load from storage (called in constructor)
optimizer.load();

// Clear all data
optimizer.reset();
```

---

## Usage Patterns

### Pattern 1: Workflow Optimization

Order tasks by confidence to minimize cascading failures:

```javascript
const optimizer = new TaskOptimizer();

// Register workflow tasks
['lint', 'test', 'build', 'deploy'].forEach(taskId => {
  optimizer.registerTask(taskId, { name: taskId });
});

// Get optimal order
const sequence = optimizer.getOptimalSequence();
for (const task of sequence) {
  await executeTask(task.id);
}
```

### Pattern 2: Failure Recovery

When a task fails, get alternative approaches:

```javascript
try {
  await runTask('build', { approach: 'incremental' });
} catch (error) {
  optimizer.recordResult('build', {
    success: false,
    duration: elapsed,
    error: error.message,
    approach: 'incremental',
  });

  // Suggest alternative
  const alternatives = optimizer.suggestAlternativeApproach('build', 'incremental');
  if (alternatives.length > 0) {
    const nextApproach = alternatives[0].approach;
    console.log(`Trying alternative: ${nextApproach}`);
    await runTask('build', { approach: nextApproach });
  }
}
```

### Pattern 3: Predictive Scheduling

Forecast completion to estimate delivery:

```javascript
const upcoming = ['build', 'test', 'deploy'];
const completion = optimizer.estimateCompletion(upcoming, 2); // 2 workers

console.log(`Estimated completion: ${new Date(
  Date.now() + completion.parallel
).toISOString()}`);

completion.breakdown.forEach(task => {
  console.log(
    `${task.name}: ~${(task.duration / 1000).toFixed(1)}s ` +
    `(${(task.confidence * 100).toFixed(0)}% confident)`
  );
});
```

### Pattern 4: Adaptive Retry Strategy

Retry with backoff based on failure patterns:

```javascript
async function runWithAdaptiveRetry(taskId, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const start = Date.now();
      const result = await executeTask(taskId);
      optimizer.recordResult(taskId, {
        success: true,
        duration: Date.now() - start,
        approach: 'default',
      });
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      optimizer.recordResult(taskId, {
        success: false,
        duration,
        error: error.message,
        approach: 'default',
      });

      if (attempt < maxRetries) {
        // Get suggestion for next attempt
        const suggestions = optimizer.suggestAlternativeApproach(taskId, 'default');
        if (suggestions.length > 0) {
          const nextApproach = suggestions[0].approach;
          console.log(`Retry ${attempt}: trying ${nextApproach}`);
          // Retry with suggested approach...
        }
      }
    }
  }
}
```

### Pattern 5: ML-Driven Monitoring

Track system health over time:

```javascript
setInterval(() => {
  const analytics = optimizer.getTaskAnalytics('deploy');

  // Alert if confidence drops
  if (analytics.confidence < 0.5) {
    console.warn(`⚠ Deploy confidence dropped to ${(analytics.confidence * 100).toFixed(0)}%`);
    console.warn(`Recent errors: ${analytics.failurePatterns.map(p => p.error).join(', ')}`);
  }

  // Log trends
  console.log(`Deploy: ${(analytics.statistics.successRate * 100).toFixed(0)}% success rate`);
}, 3600000); // hourly
```

## Internals

### Confidence Score Calculation

```
confidence = successRate * recencyDecay
where:
  successRate = successes / attempts
  recencyDecay = decayFactor ^ (ageInDays)
  if attempts < minSamples: confidence = min(0.3, attempts / minSamples)
```

### Duration Estimation Confidence

```
confidenceInEstimate = min(1, attempts / (minSamples * 2))
```

### Success Prediction Factors

- Base success rate: 40%
- Recent performance (last 5 runs): 30%
- Category performance: 15%
- Overall confidence: 15%

### History Decay

Older execution records have exponentially less weight in confidence calculation:

```
weight = decayFactor ^ (days_old)
```

Default `decayFactor = 0.95` means data loses ~5% influence per day.

## Performance Considerations

- History is unbounded; for long-running systems, consider periodic snapshots
- localStorage is used by default; provide custom storage via hooks
- Calculation time is O(n) where n = history size
- Sorting is O(n log n) per sequence call

## Testing

Run tests:

```bash
node lib/task-optimizer.test.js
```

Run examples:

```bash
node lib/task-optimizer.example.js
```

## License

MIT
