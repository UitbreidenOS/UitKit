# Task Optimizer & Resume Engine Library - Complete Index

ML-based adaptive task sequencing with confidence scoring, duration estimation, and failure pattern analysis. Smart resume logic for interrupted or failed runs.

## Files Overview

### Community Forum (New)

| File | Purpose |
|------|---------|
| `community-forum.js` | Main library (600+ lines) - Forum, posts, replies, gamification |
| `community-forum.test.js` | Comprehensive tests (29 test suites) |
| `community-forum-integration-example.js` | Express API, CLI, events, analytics |

### GCP Deployment (New)

| File | Purpose |
|------|---------|
| `gcp-deployment.js` | Main library (900+ lines) - Cloud Run, Compute Engine, Storage, Firestore, Vertex AI |
| `gcp-deployment.test.js` | Comprehensive tests (50+ test cases) |
| `gcp-deployment-integration-example.js` | Full deployment workflow examples |
| `gcp-deployment-cli.js` | Command-line interface for deployments |
| `gcp-deployment-terraform.tf.template` | Production-ready Terraform template |
| `GCP_DEPLOYMENT_README.md` | Complete API reference & guide |

### SVG Layout Analyzer (New)

| File | Purpose |
|------|---------|
| `svg-layout-analyzer.js` | Main library (600+ lines) - Layout optimization & clustering |
| `svg-layout-analyzer.test.js` | Comprehensive tests (11 test suites) |
| `svg-layout-analyzer-integration-example.js` | Express API, CLI, batch processing |
| `SVG_LAYOUT_ANALYZER_README.md` | Complete API reference & algorithms |

### Task Optimizer (Core)

| File | Purpose |
|------|---------|
| `task-optimizer.js` | Main library (600+ lines) |
| `task-optimizer.d.ts` | TypeScript type definitions |
| `task-optimizer.test.js` | Unit + integration tests (40+ tests) |
| `task-optimizer.example.js` | 8 detailed usage examples |

### Resume Engine (New)

| File | Purpose |
|------|---------|
| `resume-engine.js` | Smart resume logic (400+ lines) |
| `resume-engine.test.js` | Comprehensive tests (30+ tests) |
| `resume-engine-integration-example.js` | Integration patterns with state manager |
| `RESUME_ENGINE_README.md` | Complete API reference |
| `RESUME_ENGINE_QUICK_REFERENCE.md` | Quick snippets & decision tree |

### State Management & Execution

| File | Purpose |
|------|---------|
| `state-manager.js` | Checkpoint persistence |
| `task-executor.js` | Task type detection & routing |
| `failure-learner.js` | Failure pattern analysis |
| `task-splitter.js` | Task decomposition |
| `goal-parser.js` | Goal analysis & parsing |

### Documentation (Task Optimizer)

| File | Purpose |
|------|---------|
| `TASK_OPTIMIZER_README.md` | Complete API reference & guide |
| `INTEGRATION_EXAMPLES.md` | 10+ practical integration patterns |
| `INDEX.md` | This file |

## Quick Links

### GCP Deployment (NEW)
1. Start with [GCP_DEPLOYMENT_README.md](./GCP_DEPLOYMENT_README.md) - Overview & features
2. Run tests: `npm test -- lib/gcp-deployment.test.js`
3. CLI usage: `node lib/gcp-deployment-cli.js help`
4. Integration: See `gcp-deployment-integration-example.js` for complete workflow
5. Terraform: See `gcp-deployment-terraform.tf.template` for production configs

### SVG Layout Analyzer (NEW)
1. Start with [SVG_LAYOUT_ANALYZER_README.md](./SVG_LAYOUT_ANALYZER_README.md) - Overview & examples
2. Run tests: `node lib/svg-layout-analyzer.test.js`
3. CLI usage: `node lib/svg-layout-analyzer-integration-example.js analyze <file.svg> --verbose`
4. Key algorithms: Force-directed, Hierarchical, Circular layouts

### Resume Engine (NEW)
1. Start with [RESUME_ENGINE_QUICK_REFERENCE.md](./RESUME_ENGINE_QUICK_REFERENCE.md) for quick snippets
2. Full API: [RESUME_ENGINE_README.md](./RESUME_ENGINE_README.md)
3. Integration example: `resume-engine-integration-example.js` → `ResumableWorkflow` class
4. Run tests: `npm test -- lib/resume-engine.test.js`

### Task Optimizer
1. Start with [TASK_OPTIMIZER_README.md](./TASK_OPTIMIZER_README.md) - Quick Start section
2. Run examples: `node lib/task-optimizer.example.js`
3. Run tests: `node lib/task-optimizer.test.js`

### For Integration (Resume Engine)
1. Review [RESUME_ENGINE_README.md](./RESUME_ENGINE_README.md) - Integration Pattern section
2. Study `resume-engine-integration-example.js` → `ResumableWorkflow` class
3. Adapt pattern to your workflow (detector → validator → strategizer → executor)

### For Integration (Task Optimizer)
1. Review [INTEGRATION_EXAMPLES.md](./INTEGRATION_EXAMPLES.md) for your use case
2. Copy the appropriate pattern to your codebase
3. Adapt to your task definitions and execution logic

### For Deep Dive
1. Read [RESUME_ENGINE_README.md](./RESUME_ENGINE_README.md) - API Reference section
2. Read [TASK_OPTIMIZER_README.md](./TASK_OPTIMIZER_README.md) - API Reference section
3. Review source code comments in both files
4. Study integration examples

## Core Concepts

### Resume Engine

#### Execution State Detection
Determines what happened in previous run:
- **SUCCESS** - Exited cleanly (code 0)
- **FAILED** - Non-zero exit code
- **INTERRUPTED** - Killed by signal or incomplete checkpoint
- **UNKNOWN** - Cannot determine

#### Recovery Strategy Selection
Routes to optimal recovery path:
- **RESUME_FROM_CHECKPOINT** - Continue from saved point (safest)
- **RETRY_WITH_FALLBACK** - Retry with different approach
- **RESTART_FRESH** - Start over from beginning
- **MANUAL_INTERVENTION** - Requires human review (high risk)

#### Safety Verification
Three-layer validation before resuming:
1. **Goal Consistency** - Ensures original goal unchanged
2. **Repository State** - Detects branch switches, uncommitted files
3. **Conflict Detection** - Identifies high-risk scenarios

### Task Optimizer

#### Confidence Score (0-1)
Success likelihood for a task based on:
- Historical success rate
- Number of attempts (minimum threshold)
- Recency (exponential decay)

Higher confidence → attempt first

#### Duration Estimate
Task completion prediction:
- Average of historical durations
- Confidence in estimate increases with sample size
- Used for completion forecasting

#### Failure Patterns
Error tracking and grouping:
- Tracks which errors occur most frequently
- Associates errors with specific execution approaches
- Enables smart error recovery

#### Approach Suggestions
Recommends alternative execution strategies:
- Compares success rates across approaches
- Prioritizes by impact (success rate or duration improvement)
- Provides reasoning for each suggestion

## Core Methods

### Resume Engine
```
detectExecutionState(options)       - Determine what happened
verifyGoalConsistency(prev, curr)   - Check goal hasn't changed
detectConflictingChanges(options)   - Find repo conflicts
determineRecoveryStrategy(...)      - Choose recovery path
validateResumeSafety(...)           - Confirm safe to resume
createResumeSession(options)        - Audit trail descriptor
saveResumeMetadata(metadata)        - Persist resume state
loadResumeMetadata()                - Load previous state
generateResumeReport(options)       - Diagnostic report
clearResumeMetadata()               - Cleanup after success
```

### Task Optimizer

#### Registration & Recording
```
registerTask(taskId, metadata)    - Define task with metadata
recordResult(taskId, result)      - Log execution outcome
```

#### Analysis
```
calculateConfidenceScore(taskId)  - Get confidence (0-1)
estimateDuration(taskId)          - Predict task duration
predictSuccess(taskId)            - Forecast success probability
getTaskAnalytics(taskId)          - Complete task metrics
```

#### Sequencing & Forecasting
```
getOptimalSequence(taskIds)       - Order tasks by confidence
estimateCompletion(taskIds)       - Forecast total workflow time
```

#### Recovery & Suggestions
```
suggestAlternativeApproach()      - Recommend fallback strategies
getFailurePatterns(taskId)        - Get error history
```

#### Persistence
```
save()                            - Persist to localStorage
load()                            - Restore from localStorage
exportModel()                     - Export for analysis
```

## Usage Patterns

### Resume Engine Pattern

```javascript
const ResumeEngine = require('./resume-engine');
const StateManager = require('./state-manager');

// 1. Detect what happened in previous run
const executionState = ResumeEngine.detectExecutionState({
  previousExitCode: 1,
  hasCheckpoint: true,
  completedTasks: 3,
  totalTasks: 10
});

// 2. Verify goal unchanged and check repo state
const goalCheck = ResumeEngine.verifyGoalConsistency(prevGoal, currGoal);
const conflicts = ResumeEngine.detectConflictingChanges({...});

// 3. Determine recovery strategy
const strategy = ResumeEngine.determineRecoveryStrategy(
  executionState,
  goalCheck,
  conflicts
);

// 4. Apply strategy
switch (strategy.strategy) {
  case 'resume_from_checkpoint':
    const state = StateManager.resume();
    // Continue from state.currentTask
    break;
  case 'restart_fresh':
    ResumeEngine.clearResumeMetadata();
    // Start fresh workflow
    break;
  case 'manual_intervention':
    console.log(ResumeEngine.generateResumeReport({...}));
    throw new Error('Manual review needed');
}
```

### Task Optimizer Patterns

#### Pattern 1: Basic Workflow
```javascript
optimizer.registerTask('build');
await runBuild();
optimizer.recordResult('build', { success: true, duration: 1000 });
```

#### Pattern 2: Adaptive Sequencing
```javascript
const sequence = optimizer.getOptimalSequence(taskIds);
for (const task of sequence) {
  await executeTask(task.id);
}
```

#### Pattern 3: Failure Recovery
```javascript
try {
  await runTask();
} catch (error) {
  optimizer.recordResult(taskId, { success: false, error: error.message });
  const alternatives = optimizer.suggestAlternativeApproach(taskId);
  if (alternatives.length > 0) {
    await retryWithApproach(alternatives[0].approach);
  }
}
```

#### Pattern 4: Predictive Scheduling
```javascript
const completion = optimizer.estimateCompletion(taskIds, parallelism);
console.log(`ETA: ${completion.parallel}ms with ${(completion.avgConfidence * 100).toFixed(0)}% confidence`);
```

#### Pattern 5: Monitoring
```javascript
const analytics = optimizer.getTaskAnalytics(taskId);
if (analytics.confidence < 0.5) {
  alert(`Task confidence dropped: ${analytics.failurePatterns.map(p => p.error)}`);
}
```

## Configuration Options

```javascript
new TaskOptimizer({
  storageKey: 'my-tasks',           // localStorage key
  confidenceThreshold: 0.6,         // confidence cutoff
  decayFactor: 0.95,                // age decay rate
  minSamples: 3,                    // min attempts for scoring
})
```

## Performance Metrics

- **Memory**: O(n) where n = total history records
- **Scoring**: O(1) per task
- **Sequencing**: O(n log n) for sorting
- **Default storage**: localStorage (browser) or custom backend

## Integrations Included

- ✓ GitHub Actions CI/CD
- ✓ Docker multi-stage builds
- ✓ Node.js workflow managers
- ✓ Express.js dashboards
- ✓ Prometheus metrics export
- ✓ Circuit breaker pattern
- ✓ Adaptive retry strategies
- ✓ Distributed execution
- ✓ SLA monitoring
- ✓ Alert systems

## Test Coverage

45+ tests covering:
- Registration & result recording
- Confidence score calculation
- Duration estimation
- Sequencing algorithms
- Completion forecasting
- Failure pattern tracking
- Approach suggestions
- Success prediction
- Analytics aggregation
- Data persistence

Run tests: `node lib/task-optimizer.test.js`

## Examples Included

8 detailed examples:
1. Basic task tracking
2. Optimal sequencing
3. Learning from failures
4. Completion estimation
5. Success prediction
6. Task analytics
7. Real-world workflow scenario
8. Model export & analysis

Run examples: `node lib/task-optimizer.example.js`

## Key Algorithms

### Confidence Calculation
```
if attempts < minSamples:
  confidence = min(0.3, attempts / minSamples)
else:
  successRate = successes / attempts
  recencyDecay = decayFactor ^ ageInDays
  confidence = successRate * recencyDecay
```

### Completion Estimation
```
sequential = sum(avgDuration for each task)
parallel = sequential / parallelism
avgConfidence = sum(confidence) / taskCount
```

### Suggestion Ranking
```
For each alternative approach:
  score = successRate / currentSuccessRate
  if success rates similar:
    score = currentDuration / altDuration
  Return sorted by score descending
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Confidence not improving | Ensure minSamples threshold met, check task success/failure |
| Duration estimates inaccurate | Collect more samples (10+), check for outliers |
| No suggestions appear | Verify approaches registered, ensure 2+ attempts per approach |
| Data not persisting | Check localStorage enabled, provide custom storage backend |

## Related Documentation

- `TASK_OPTIMIZER_README.md` - API reference & detailed guide
- `INTEGRATION_EXAMPLES.md` - Practical integration patterns
- `task-optimizer.d.ts` - TypeScript type definitions
- `task-optimizer.test.js` - Working test examples
- `task-optimizer.example.js` - Usage examples

## Future Enhancements

Potential additions:
- Database backend for history storage
- Advanced ML models (regression, clustering)
- Task dependency graphs
- Resource allocation optimization
- Cost tracking (cloud execution costs)
- Multi-tenant support
- Web dashboard
- REST API wrapper

## License

MIT
