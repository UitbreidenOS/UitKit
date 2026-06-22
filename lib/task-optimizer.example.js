/**
 * Task Optimizer - Usage Examples
 * Demonstrates ML-based adaptive task sequencing
 */

const TaskOptimizer = require('./task-optimizer');

// Initialize optimizer
const optimizer = new TaskOptimizer({
  storageKey: 'my-workflow-tasks',
  confidenceThreshold: 0.7,
  minSamples: 3,
});

// ============================================================================
// EXAMPLE 1: Basic task registration and execution tracking
// ============================================================================
console.log('\n=== EXAMPLE 1: Basic Task Tracking ===\n');

optimizer.registerTask('build-api', {
  name: 'Build REST API',
  category: 'backend',
  estimatedDuration: 300000, // 5 minutes in ms
  approaches: ['default', 'cached', 'incremental'],
});

optimizer.registerTask('run-tests', {
  name: 'Run Test Suite',
  category: 'testing',
  estimatedDuration: 180000, // 3 minutes
  approaches: ['default', 'watch-mode', 'parallel'],
});

optimizer.registerTask('deploy', {
  name: 'Deploy to Production',
  category: 'deployment',
  estimatedDuration: 600000, // 10 minutes
  approaches: ['blue-green', 'canary', 'rolling'],
});

// Record successful task execution
optimizer.recordResult('build-api', {
  success: true,
  duration: 280000,
  approach: 'default',
});

optimizer.recordResult('run-tests', {
  success: true,
  duration: 175000,
  approach: 'default',
});

console.log('Registered 3 tasks and recorded 2 successful runs\n');

// ============================================================================
// EXAMPLE 2: Get optimal sequence (ordered by confidence)
// ============================================================================
console.log('=== EXAMPLE 2: Optimal Task Sequence ===\n');

const sequence = optimizer.getOptimalSequence();
console.log('Tasks ordered by confidence (highest first):');
sequence.forEach((task, idx) => {
  console.log(
    `${idx + 1}. ${task.name} - confidence: ${(task.confidence * 100).toFixed(1)}%`
  );
});

// ============================================================================
// EXAMPLE 3: Failure scenarios and learning
// ============================================================================
console.log('\n=== EXAMPLE 3: Learning from Failures ===\n');

// Simulate failed attempts
optimizer.recordResult('build-api', {
  success: false,
  duration: 45000,
  approach: 'default',
  error: 'ENOENT: no such file or directory',
});

optimizer.recordResult('build-api', {
  success: true,
  duration: 270000,
  approach: 'cached', // tried different approach
});

optimizer.recordResult('build-api', {
  success: true,
  duration: 260000,
  approach: 'cached',
});

// Now check confidence and suggestions
const buildConfidence = optimizer.calculateConfidenceScore('build-api');
console.log(`build-api confidence score: ${(buildConfidence * 100).toFixed(1)}%`);

const suggestions = optimizer.suggestAlternativeApproach('build-api', 'default');
console.log('\nAlternative approaches for build-api:');
suggestions.forEach(s => {
  console.log(`  • ${s.approach}: ${(s.successRate * 100).toFixed(0)}% success rate`);
  console.log(`    Reason: ${s.reason}`);
});

// ============================================================================
// EXAMPLE 4: Estimate completion time
// ============================================================================
console.log('\n=== EXAMPLE 4: Completion Time Estimation ===\n');

// Record some durations for deploy task
optimizer.recordResult('deploy', {
  success: true,
  duration: 590000,
  approach: 'blue-green',
});

optimizer.recordResult('deploy', {
  success: true,
  duration: 610000,
  approach: 'blue-green',
});

const completion = optimizer.estimateCompletion(
  ['build-api', 'run-tests', 'deploy'],
  1 // sequential execution
);

console.log('Sequential execution estimate:');
console.log(`  Total time: ${(completion.sequential / 1000 / 60).toFixed(1)} minutes`);
console.log(`  Average confidence: ${(completion.avgConfidence * 100).toFixed(1)}%`);
console.log(`  Tasks: ${completion.taskCount}`);

console.log('\nTask breakdown:');
completion.breakdown.forEach(task => {
  console.log(
    `  ${task.name}: ~${(task.duration / 1000 / 60).toFixed(1)}m (${(task.confidence * 100).toFixed(0)}% confidence)`
  );
});

// ============================================================================
// EXAMPLE 5: Predict success probability
// ============================================================================
console.log('\n=== EXAMPLE 5: Success Prediction ===\n');

const prediction = optimizer.predictSuccess('build-api');
console.log(`Predicted success rate for build-api: ${(prediction.prediction * 100).toFixed(1)}%`);
console.log('Contributing factors:');
Object.entries(prediction.factors).forEach(([factor, weight]) => {
  console.log(`  ${factor}: ${(weight * 100).toFixed(1)}%`);
});

// ============================================================================
// EXAMPLE 6: Detailed analytics
// ============================================================================
console.log('\n=== EXAMPLE 6: Task Analytics ===\n');

const analytics = optimizer.getTaskAnalytics('build-api');
console.log(`Task: ${analytics.name}`);
console.log(`Statistics:`);
console.log(`  Attempts: ${analytics.statistics.totalAttempts}`);
console.log(`  Success rate: ${(analytics.statistics.successRate * 100).toFixed(1)}%`);
console.log(`  Avg duration: ${(analytics.statistics.avgDuration / 1000).toFixed(1)}s`);
console.log(`  Confidence: ${(analytics.confidence * 100).toFixed(1)}%`);

if (analytics.failurePatterns.length > 0) {
  console.log(`\nFailure patterns:`);
  analytics.failurePatterns.slice(0, 3).forEach(pattern => {
    console.log(`  • ${pattern.error} (${pattern.count}x with ${pattern.approach})`);
  });
}

// ============================================================================
// EXAMPLE 7: Real-world workflow scenario
// ============================================================================
console.log('\n=== EXAMPLE 7: Complete Workflow Scenario ===\n');

const workflow = new TaskOptimizer();

// Setup workflow tasks
const tasks = [
  { id: 'lint', name: 'Lint Code', category: 'quality', duration: 30000 },
  { id: 'test', name: 'Unit Tests', category: 'testing', duration: 120000 },
  { id: 'build', name: 'Build', category: 'build', duration: 60000 },
  { id: 'e2e', name: 'E2E Tests', category: 'testing', duration: 300000 },
];

tasks.forEach(t => {
  workflow.registerTask(t.id, {
    name: t.name,
    category: t.category,
    estimatedDuration: t.duration,
  });
});

// Simulate workflow runs with varying results
const runs = [
  { lint: true, test: true, build: true, e2e: true },
  { lint: true, test: false, build: false, e2e: false }, // test fails, cascades
  { lint: true, test: true, build: true, e2e: true },
  { lint: false, test: false, build: false, e2e: false }, // lint caught issues early
  { lint: true, test: true, build: true, e2e: true },
];

runs.forEach((run, runIdx) => {
  console.log(`\nRun ${runIdx + 1}:`);
  Object.entries(run).forEach(([taskId, success]) => {
    const duration = tasks.find(t => t.id === taskId).duration;
    workflow.recordResult(taskId, {
      success,
      duration: success ? duration : Math.random() * duration * 0.3,
      approach: 'default',
      error: !success ? `Task failed in run ${runIdx + 1}` : null,
    });
    console.log(`  ${taskId}: ${success ? 'PASS' : 'FAIL'}`);
  });
});

console.log('\n\nOptimal execution order (by confidence):');
const optimal = workflow.getOptimalSequence();
optimal.forEach((task, idx) => {
  console.log(
    `${idx + 1}. ${task.name} (${(task.confidence * 100).toFixed(0)}% confidence)`
  );
});

const workflowCompletion = workflow.estimateCompletion();
console.log(`\nExpected duration: ${(workflowCompletion.sequential / 1000).toFixed(0)}s`);
console.log(`Success confidence: ${(workflowCompletion.avgConfidence * 100).toFixed(1)}%`);

// ============================================================================
// EXAMPLE 8: Export model for analysis
// ============================================================================
console.log('\n=== EXAMPLE 8: Model Export ===\n');

const model = workflow.exportModel();
console.log(`Model version: ${model.version}`);
console.log(`Tasks tracked: ${model.tasks.length}`);
console.log(`History records: ${model.historySize}`);
console.log(`Last 5 records exported: ${model.historySnapshot.length}`);

console.log('\n=== Examples Complete ===\n');
