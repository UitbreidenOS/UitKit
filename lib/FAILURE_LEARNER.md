# FailureLearner — Pattern Extraction & Recovery Strategy

## Overview

`FailureLearner` is a module that learns from task failures by categorizing them, storing recovery patterns, and suggesting increasingly sophisticated recovery strategies. It enables Claude Code to surface insights like: **"I've seen this fail before, suggesting X instead."**

## Architecture

### Core Concepts

1. **Failure Categorization**: Seven standardized failure types
2. **Recovery Strategy Stack**: Ordered recovery approaches per failure type
3. **Pattern Persistence**: Storing failures with context for later analysis
4. **Learning Loop**: Record → Categorize → Suggest → Resolve → Learn

### Failure Categories

| Type | Weight | Example | First Recovery |
|------|--------|---------|-----------------|
| `timeout` | 1 | Task exceeded deadline | Retry with 1.5x timeout |
| `validation_failed` | 2 | Output doesn't match schema | Inspect error verbosely |
| `agent_refusal` | 2 | Agent declined unsafe request | Clarify intent |
| `resource_limit` | 3 | Token/rate limit hit | Prune context (30% reduction) |
| `auth_failed` | 2 | OAuth token expired | Try simpler approach first |
| `format_error` | 1 | Malformed JSON/XML | Normalize input (lenient) |
| `tool_unavailable` | 2 | Tool not installed | Check availability |

### Recovery Strategy Flow

Each failure type has 3–4 escalating recovery strategies:

```
timeout:
  1. Retry with increased timeout (1.5x)
  2. Retry with exponential backoff
  3. Break into smaller subtasks
  4. Escalate to larger model (Sonnet)

auth_failed:
  1. Try simpler approach (unauthenticated)      ← "OAuth fails? Try no-auth first"
  2. Refresh credentials
  3. Fallback to unauthenticated endpoint
  4. Prompt user for auth

resource_limit:
  1. Prune context (30% reduction)
  2. Switch to smaller model (Haiku)
  3. Batch requests
  4. Add delay between requests
```

## API

### Constructor

```javascript
const FailureLearner = require('./failure-learner');
const learner = new FailureLearner();
```

### recordFailure(failure)

Records a failure and returns recovery suggestions.

**Parameters:**
```javascript
{
  type: string,           // Required: 'timeout', 'validation_failed', etc.
  message: string,        // Error message from task
  context: object,        // Optional: { taskId, model, tokens, ... }
  timestamp: Date,        // Optional: defaults to now
  taskId: string          // Optional: task identifier
}
```

**Returns:**
```javascript
{
  learned: boolean,
  patternId: number,                    // Index into patterns array
  failureType: string,
  suggestions: Array<{
    strategy: string,
    order: number,
    params: object,
    rationale: string
  }>,
  strategyOrder: Array<string>          // All strategies in order
}
```

**Example:**
```javascript
const result = learner.recordFailure({
  type: 'auth_failed',
  message: 'OAuth token expired',
  context: { service: 'github', tokenAge: 3600 }
});

console.log(result.suggestions[0]);
// {
//   strategy: 'try_simpler_approach',
//   order: 1,
//   params: { skip_auth: true },
//   rationale: 'Attempting unauthenticated path first'
// }
```

### getNextRecovery(patternId)

Retrieves the next recovery strategy for a pattern.

**Returns:**
```javascript
{
  strategy: string,
  params: object,
  rationale: string,
  attemptNumber: number,
  totalStrategies: number
} | null  // null when all strategies exhausted
```

**Example:**
```javascript
let recovery = learner.getNextRecovery(patternId);
while (recovery) {
  console.log(`Attempt ${recovery.attemptNumber}: ${recovery.strategy}`);
  
  try {
    // Execute recovery strategy with recovery.params
  } catch (e) {
    recovery = learner.getNextRecovery(patternId);  // Next strategy
  }
}
```

### resolvePattern(patternId, resolution)

Marks a pattern as resolved and stores the resolution data.

**Parameters:**
```javascript
patternId: number,
resolution: {
  strategy: string,
  success: boolean,
  attemptNumber: number,
  notes?: string
}
```

**Example:**
```javascript
learner.resolvePattern(patternId, {
  strategy: 'try_simpler_approach',
  success: true,
  attemptNumber: 1
});
```

### getSimilarFailures(failureType)

Queries past failures of the same type that were resolved.

**Returns:** Array of last 5 similar resolved patterns with their resolutions.

**Example:**
```javascript
const similar = learner.getSimilarFailures('auth_failed');
if (similar.length > 0) {
  console.log(`This auth failure was resolved ${similar.length} times before`);
}
```

### getSurfacedInsight(patternId)

Generates a human-readable insight message.

**Returns:** String like:
- First time: `"First encounter with timeout. Attempting recovery."`
- Seen before: `"I've seen this timeout fail 3 times. Successfully recovered 2 times. Suggesting retry_with_backoff first."`

**Example:**
```javascript
console.log(learner.getSurfacedInsight(patternId));
// "I've seen this auth_failed fail 3 times. Successfully recovered 2 times. Suggesting try_simpler_approach first."
```

### getStats()

Returns aggregated failure statistics.

**Returns:**
```javascript
{
  totalFailures: number,
  resolved: number,
  byType: {
    [type: string]: {
      total: number,
      resolved: number,
      avgRecoveryAttempts: number
    }
  }
}
```

**Example:**
```javascript
const stats = learner.getStats();
console.log(stats);
// {
//   totalFailures: 12,
//   resolved: 8,
//   byType: {
//     timeout: { total: 3, resolved: 2, avgRecoveryAttempts: 1.5 },
//     auth_failed: { total: 5, resolved: 4, avgRecoveryAttempts: 1.25 },
//     ...
//   }
// }
```

### export() / import(data)

Persists and restores learner state.

**Example:**
```javascript
// Save
const backup = learner.export();
fs.writeFileSync('learner.json', JSON.stringify(backup));

// Load
const restored = new FailureLearner();
const backup = JSON.parse(fs.readFileSync('learner.json'));
restored.import(backup);
```

## Usage Patterns

### Pattern 1: Record & Iterate Recovery

```javascript
const learner = new FailureLearner();

// Task fails
const result = learner.recordFailure({
  type: 'auth_failed',
  message: error.message,
  context: { service: 'github' }
});

console.log(learner.getSurfacedInsight(result.patternId));

// Try recovery strategies in order
let recovery;
while ((recovery = learner.getNextRecovery(result.patternId))) {
  try {
    await executeRecovery(recovery.strategy, recovery.params);
    learner.resolvePattern(result.patternId, {
      strategy: recovery.strategy,
      success: true,
      attemptNumber: recovery.attemptNumber
    });
    break;
  } catch (e) {
    // Continue to next strategy
  }
}
```

### Pattern 2: Decision Tree Integration

```javascript
function shouldRetryWithSimplerApproach(failure) {
  const learner = new FailureLearner();
  const result = learner.recordFailure(failure);
  
  const similar = learner.getSimilarFailures(failure.type);
  if (similar.length > 2) {
    // Seen this before, have high confidence
    const firstStrategy = result.suggestions[0];
    return firstStrategy.strategy === 'try_simpler_approach';
  }
  
  return false;
}
```

### Pattern 3: Learning Agent Surfacing

```javascript
const agent = {
  name: 'failure-recovery-agent',
  
  async execute(task) {
    const learner = new FailureLearner();
    
    try {
      return await runTask(task);
    } catch (error) {
      const result = learner.recordFailure({
        type: categorizeError(error),
        message: error.message,
        context: { taskId: task.id, model: task.model }
      });
      
      // Surface insight to user
      console.log(learner.getSurfacedInsight(result.patternId));
      
      // Attempt recovery
      let recovery;
      while ((recovery = learner.getNextRecovery(result.patternId))) {
        try {
          return await retryTask(task, recovery.strategy, recovery.params);
        } catch (e) {
          // Next strategy
        }
      }
      
      throw new Error('All recovery strategies exhausted');
    }
  }
};
```

### Pattern 4: Persistent Learning

```javascript
// Start of session
const learner = new FailureLearner();
if (fs.existsSync('learner-state.json')) {
  const state = JSON.parse(fs.readFileSync('learner-state.json'));
  learner.import(state);
}

// ... use learner throughout session ...

// End of session
fs.writeFileSync('learner-state.json', JSON.stringify(learner.export()));
```

## Integration Points

### With Agent Framework

```javascript
// agents/failure-recovery.md
---
name: Failure Recovery Agent
model: haiku
tools: [tool:bash, tool:readFile]
---

When a task fails:
1. Use learner.recordFailure(error) to categorize
2. Check learner.getSimilarFailures() for past patterns
3. Execute learner.getNextRecovery() strategies
4. Report learner.getSurfacedInsight() to user
```

### With Task System

```javascript
// Track failures per task
task.failures = [];

try {
  await executeTask();
} catch (error) {
  const result = learner.recordFailure({ type, message, context: { taskId: task.id } });
  task.failures.push(result.patternId);
}
```

### With Logging

```javascript
// Log failure patterns for analysis
logger.info({
  event: 'failure_recorded',
  failureType: result.failureType,
  patternId: result.patternId,
  insight: learner.getSurfacedInsight(result.patternId)
});
```

## Testing

Run the test suite:

```bash
node lib/failure-learner.test.js
```

Output:
```
================================
FailureLearner Test Suite
================================

=== Test: Timeout Failure ===
Recorded failure: { learned: true, patternId: 0, ... }
Insight: First encounter with timeout. Attempting recovery.

Attempt 1/4
Strategy: retry_with_increased_timeout
Rationale: Task needs more time; extending deadline
Params: { multiplier: 1.5 }
✓ Strategy succeeded (simulated)

=== Test: OAuth Auth Failure ===
...
```

## Implementation Notes

### Why This Matters for Claude Code

1. **Reduced Token Waste**: Recognizes futile retry patterns early
2. **Better UX**: Surfaces "I've seen this" messages
3. **Graceful Degradation**: OAuth fails? Try simpler approach
4. **Adaptive Recovery**: Learns which strategies work for which failures
5. **Observability**: Export statistics to monitor failure patterns

### Future Enhancements

- **ML Integration**: Weight recovery strategies based on success rate
- **Timebound Learning**: Forget old patterns after N days
- **Cross-Task Generalization**: Share patterns across concurrent tasks
- **Telemetry Export**: Send anonymized patterns to analytics
- **Custom Categories**: Allow users to extend failure types

## Related Modules

- `task-orchestrator.js`: Uses FailureLearner for task recovery
- `agent-framework.js`: Delegates to failure-recovery agent
- `observability.js`: Logs failure patterns for analysis

## Files

- `lib/failure-learner.js` — Main module
- `lib/failure-learner.test.js` — Test suite and examples
- `lib/FAILURE_LEARNER.md` — This documentation
