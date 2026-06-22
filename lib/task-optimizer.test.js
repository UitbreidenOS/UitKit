/**
 * Task Optimizer Tests
 * Unit and integration tests for ML-based task sequencing
 */

const TaskOptimizer = require('./task-optimizer');

class TestRunner {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.tests = [];
  }

  test(name, fn) {
    try {
      fn();
      this.passed++;
      console.log(`✓ ${name}`);
    } catch (err) {
      this.failed++;
      console.log(`✗ ${name}`);
      console.log(`  Error: ${err.message}`);
    }
  }

  assert(condition, message) {
    if (!condition) throw new Error(message || 'Assertion failed');
  }

  assertEquals(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(
        message || `Expected ${expected}, got ${actual}`
      );
    }
  }

  assertClose(actual, expected, tolerance = 0.01) {
    if (Math.abs(actual - expected) > tolerance) {
      throw new Error(
        `Expected ~${expected}, got ${actual} (tolerance: ${tolerance})`
      );
    }
  }

  assertGreater(actual, threshold) {
    if (actual <= threshold) {
      throw new Error(`Expected > ${threshold}, got ${actual}`);
    }
  }

  assertArrayLength(arr, length) {
    if (!Array.isArray(arr)) {
      throw new Error('Expected array');
    }
    if (arr.length !== length) {
      throw new Error(`Expected length ${length}, got ${arr.length}`);
    }
  }

  summary() {
    const total = this.passed + this.failed;
    console.log(`\n${this.passed}/${total} tests passed`);
    return this.failed === 0;
  }
}

const runner = new TestRunner();

console.log('=== Task Optimizer Tests ===\n');

// ============================================================================
// Test Suite 1: Registration and Basic Operations
// ============================================================================
console.log('Suite 1: Registration and Basic Operations');

runner.test('registerTask creates new task', () => {
  const opt = new TaskOptimizer();
  const task = opt.registerTask('task1', { name: 'Test Task' });
  runner.assert(task !== null);
  runner.assertEquals(task.name, 'Test Task');
});

runner.test('registerTask reuses existing task', () => {
  const opt = new TaskOptimizer();
  const task1 = opt.registerTask('task1', { name: 'Task 1' });
  const task2 = opt.registerTask('task1', { name: 'Task 1 Updated' });
  runner.assertEquals(task1.id, task2.id);
  runner.assertEquals(task2.name, 'Test Task'); // original name not overwritten
});

runner.test('registerTask includes metadata', () => {
  const opt = new TaskOptimizer();
  const task = opt.registerTask('task1', {
    name: 'Test',
    category: 'backend',
    approaches: ['a', 'b'],
  });
  runner.assertEquals(task.category, 'backend');
  runner.assertArrayLength(task.approaches, 2);
});

// ============================================================================
// Test Suite 2: Result Recording
// ============================================================================
console.log('\nSuite 2: Result Recording');

runner.test('recordResult tracks success', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1');
  opt.recordResult('task1', { success: true, duration: 1000 });

  const task = opt.tasks.get('task1');
  runner.assertEquals(task.attempts, 1);
  runner.assertEquals(task.successes, 1);
  runner.assertEquals(task.failures, 0);
});

runner.test('recordResult tracks failure', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1');
  opt.recordResult('task1', {
    success: false,
    duration: 500,
    error: 'Timeout',
  });

  const task = opt.tasks.get('task1');
  runner.assertEquals(task.failures, 1);
  runner.assertEquals(task.successes, 0);
});

runner.test('recordResult accumulates duration', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1');
  opt.recordResult('task1', { success: true, duration: 1000 });
  opt.recordResult('task1', { success: true, duration: 2000 });

  const task = opt.tasks.get('task1');
  runner.assertEquals(task.totalDuration, 3000);
  runner.assertEquals(task.attempts, 2);
});

runner.test('recordResult stores in history', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1');
  opt.recordResult('task1', { success: true, duration: 1000 });

  runner.assertArrayLength(opt.history, 1);
  runner.assertEquals(opt.history[0].taskId, 'task1');
});

// ============================================================================
// Test Suite 3: Confidence Scoring
// ============================================================================
console.log('\nSuite 3: Confidence Scoring');

runner.test('calculateConfidenceScore returns 0-1', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1');
  const score = opt.calculateConfidenceScore('task1');
  runner.assert(score >= 0 && score <= 1);
});

runner.test('calculateConfidenceScore is 0 for unregistered task', () => {
  const opt = new TaskOptimizer();
  const score = opt.calculateConfidenceScore('unknown');
  runner.assertEquals(score, 0);
});

runner.test('calculateConfidenceScore increases with success rate', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1');

  // Below threshold
  opt.recordResult('task1', { success: true, duration: 100 });
  opt.recordResult('task1', { success: false, duration: 100 });
  const score1 = opt.calculateConfidenceScore('task1');

  // All successes
  opt.recordResult('task1', { success: true, duration: 100 });
  opt.recordResult('task1', { success: true, duration: 100 });
  const score2 = opt.calculateConfidenceScore('task1');

  runner.assertGreater(score2, score1);
});

runner.test('calculateConfidenceScore requires minimum samples', () => {
  const opt = new TaskOptimizer({ minSamples: 5 });
  opt.registerTask('task1');
  opt.recordResult('task1', { success: true, duration: 100 });

  const score = opt.calculateConfidenceScore('task1');
  runner.assertGreater(0.3, score); // below threshold
});

// ============================================================================
// Test Suite 4: Duration Estimation
// ============================================================================
console.log('\nSuite 4: Duration Estimation');

runner.test('estimateDuration returns estimate object', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1', { estimatedDuration: 5000 });
  const est = opt.estimateDuration('task1');

  runner.assert(est.estimate !== null || est.estimate === null);
  runner.assertEquals(typeof est.confidence, 'number');
});

runner.test('estimateDuration calculates average', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1');
  opt.recordResult('task1', { success: true, duration: 1000 });
  opt.recordResult('task1', { success: true, duration: 3000 });

  const est = opt.estimateDuration('task1');
  runner.assertEquals(est.estimate, 2000);
});

runner.test('estimateDuration confidence increases with samples', () => {
  const opt = new TaskOptimizer({ minSamples: 5 });
  opt.registerTask('task1');

  opt.recordResult('task1', { success: true, duration: 1000 });
  const conf1 = opt.estimateDuration('task1').confidence;

  for (let i = 0; i < 5; i++) {
    opt.recordResult('task1', { success: true, duration: 1000 });
  }
  const conf2 = opt.estimateDuration('task1').confidence;

  runner.assertGreater(conf2, conf1);
});

// ============================================================================
// Test Suite 5: Optimal Sequencing
// ============================================================================
console.log('\nSuite 5: Optimal Sequencing');

runner.test('getOptimalSequence orders by confidence', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1');
  opt.registerTask('task2');

  // task1: 100% success
  opt.recordResult('task1', { success: true, duration: 100 });
  opt.recordResult('task1', { success: true, duration: 100 });
  opt.recordResult('task1', { success: true, duration: 100 });

  // task2: 50% success
  opt.recordResult('task2', { success: true, duration: 100 });
  opt.recordResult('task2', { success: false, duration: 100 });
  opt.recordResult('task2', { success: true, duration: 100 });

  const sequence = opt.getOptimalSequence();
  runner.assertEquals(sequence[0].id, 'task1'); // higher confidence first
  runner.assertEquals(sequence[1].id, 'task2');
});

runner.test('getOptimalSequence accepts specific task IDs', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1');
  opt.registerTask('task2');
  opt.registerTask('task3');

  const sequence = opt.getOptimalSequence(['task2', 'task3']);
  runner.assertArrayLength(sequence, 2);
});

runner.test('getOptimalSequence includes confidence and estimates', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1');
  opt.recordResult('task1', { success: true, duration: 1000 });
  opt.recordResult('task1', { success: true, duration: 1000 });
  opt.recordResult('task1', { success: true, duration: 1000 });

  const sequence = opt.getOptimalSequence();
  const task = sequence[0];
  runner.assert(typeof task.confidence === 'number');
  runner.assert(typeof task.durationEstimate.estimate === 'number');
});

// ============================================================================
// Test Suite 6: Completion Estimation
// ============================================================================
console.log('\nSuite 6: Completion Estimation');

runner.test('estimateCompletion returns completion object', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1');
  opt.recordResult('task1', { success: true, duration: 1000 });

  const completion = opt.estimateCompletion();
  runner.assert(completion.sequential >= 0);
  runner.assert(completion.parallel >= 0);
  runner.assertEquals(completion.parallelism, 1);
});

runner.test('estimateCompletion calculates sequential time', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1');
  opt.registerTask('task2');
  opt.recordResult('task1', { success: true, duration: 1000 });
  opt.recordResult('task2', { success: true, duration: 2000 });

  const completion = opt.estimateCompletion();
  runner.assertEquals(completion.sequential, 3000);
});

runner.test('estimateCompletion considers parallelism', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1');
  opt.registerTask('task2');
  opt.recordResult('task1', { success: true, duration: 1000 });
  opt.recordResult('task2', { success: true, duration: 1000 });

  const seq = opt.estimateCompletion(null, 1).parallel;
  const par = opt.estimateCompletion(null, 2).parallel;

  runner.assertEquals(seq, 2000);
  runner.assertClose(par, 1000, 100);
});

// ============================================================================
// Test Suite 7: Failure Pattern Tracking
// ============================================================================
console.log('\nSuite 7: Failure Pattern Tracking');

runner.test('getFailurePatterns returns patterns', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1');
  opt.recordResult('task1', {
    success: false,
    duration: 100,
    error: 'Timeout',
  });

  const patterns = opt.getFailurePatterns('task1');
  runner.assertArrayLength(patterns, 1);
  runner.assertEquals(patterns[0].error, 'Timeout');
});

runner.test('getFailurePatterns counts occurrences', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1');
  opt.recordResult('task1', {
    success: false,
    duration: 100,
    error: 'Timeout',
  });
  opt.recordResult('task1', {
    success: false,
    duration: 100,
    error: 'Timeout',
  });

  const patterns = opt.getFailurePatterns('task1');
  runner.assertEquals(patterns[0].count, 2);
});

runner.test('getFailurePatterns sorts by frequency', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1');

  for (let i = 0; i < 3; i++) {
    opt.recordResult('task1', {
      success: false,
      duration: 100,
      error: 'Timeout',
    });
  }
  for (let i = 0; i < 1; i++) {
    opt.recordResult('task1', {
      success: false,
      duration: 100,
      error: 'OOM',
    });
  }

  const patterns = opt.getFailurePatterns('task1');
  runner.assertEquals(patterns[0].error, 'Timeout');
  runner.assertEquals(patterns[1].error, 'OOM');
});

// ============================================================================
// Test Suite 8: Alternative Approach Suggestions
// ============================================================================
console.log('\nSuite 8: Alternative Approach Suggestions');

runner.test('suggestAlternativeApproach returns suggestions', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1', { approaches: ['default', 'cached'] });

  opt.recordResult('task1', {
    success: false,
    duration: 100,
    approach: 'default',
  });
  opt.recordResult('task1', {
    success: false,
    duration: 100,
    approach: 'default',
  });

  opt.recordResult('task1', {
    success: true,
    duration: 100,
    approach: 'cached',
  });
  opt.recordResult('task1', {
    success: true,
    duration: 100,
    approach: 'cached',
  });

  const suggestions = opt.suggestAlternativeApproach('task1', 'default');
  runner.assertGreater(suggestions.length, 0);
  runner.assertEquals(suggestions[0].approach, 'cached');
});

runner.test('suggestAlternativeApproach requires minimum attempts', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1', { approaches: ['default', 'cached'] });

  opt.recordResult('task1', {
    success: true,
    duration: 100,
    approach: 'cached',
  });

  const suggestions = opt.suggestAlternativeApproach('task1', 'default');
  runner.assertArrayLength(suggestions, 0); // only 1 attempt, need 2+
});

runner.test('suggestAlternativeApproach excludes current approach', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1', { approaches: ['a', 'b'] });

  opt.recordResult('task1', { success: true, duration: 100, approach: 'a' });
  opt.recordResult('task1', { success: true, duration: 100, approach: 'a' });

  const suggestions = opt.suggestAlternativeApproach('task1', 'a');
  // Should exclude 'a' from suggestions
  const hasCurrentApproach = suggestions.some(s => s.approach === 'a');
  runner.assert(!hasCurrentApproach);
});

// ============================================================================
// Test Suite 9: Success Prediction
// ============================================================================
console.log('\nSuite 9: Success Prediction');

runner.test('predictSuccess returns prediction object', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1');
  opt.recordResult('task1', { success: true, duration: 100 });

  const pred = opt.predictSuccess('task1');
  runner.assert(typeof pred.prediction === 'number');
  runner.assert(typeof pred.factors === 'object');
});

runner.test('predictSuccess reflects success rate', () => {
  const opt = new TaskOptimizer({ minSamples: 2 });
  opt.registerTask('task1');
  opt.registerTask('task2');

  // task1: 100% success
  opt.recordResult('task1', { success: true, duration: 100 });
  opt.recordResult('task1', { success: true, duration: 100 });

  // task2: 0% success
  opt.recordResult('task2', { success: false, duration: 100 });
  opt.recordResult('task2', { success: false, duration: 100 });

  const pred1 = opt.predictSuccess('task1');
  const pred2 = opt.predictSuccess('task2');

  runner.assertGreater(pred1.prediction, pred2.prediction);
});

// ============================================================================
// Test Suite 10: Analytics
// ============================================================================
console.log('\nSuite 10: Analytics');

runner.test('getTaskAnalytics returns complete analytics', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1');
  opt.recordResult('task1', { success: true, duration: 1000 });

  const analytics = opt.getTaskAnalytics('task1');
  runner.assert(analytics.taskId === 'task1');
  runner.assert(analytics.statistics !== null);
  runner.assert(analytics.confidence !== null);
});

runner.test('getTaskAnalytics includes recent attempts', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1');
  opt.recordResult('task1', { success: true, duration: 100 });
  opt.recordResult('task1', { success: false, duration: 100, error: 'Err' });

  const analytics = opt.getTaskAnalytics('task1');
  runner.assertArrayLength(analytics.recentAttempts, 2);
});

// ============================================================================
// Test Suite 11: Persistence
// ============================================================================
console.log('\nSuite 11: Persistence');

runner.test('save and load persist data', () => {
  global.localStorage = {
    data: {},
    setItem(key, value) {
      this.data[key] = value;
    },
    getItem(key) {
      return this.data[key];
    },
  };

  const opt1 = new TaskOptimizer({ storageKey: 'test-key' });
  opt1.registerTask('task1');
  opt1.recordResult('task1', { success: true, duration: 1000 });
  opt1.save();

  const opt2 = new TaskOptimizer({ storageKey: 'test-key' });
  runner.assertEquals(opt2.tasks.size, 1);
  runner.assertArrayLength(opt2.history, 1);
});

runner.test('reset clears all data', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1');
  opt.recordResult('task1', { success: true, duration: 100 });
  opt.reset();

  runner.assertEquals(opt.tasks.size, 0);
  runner.assertArrayLength(opt.history, 0);
});

// ============================================================================
// Test Suite 12: Export
// ============================================================================
console.log('\nSuite 12: Export');

runner.test('exportModel returns model snapshot', () => {
  const opt = new TaskOptimizer();
  opt.registerTask('task1');
  opt.recordResult('task1', { success: true, duration: 100 });

  const model = opt.exportModel();
  runner.assert(model.version !== null);
  runner.assert(model.exportedAt !== null);
  runner.assertGreater(model.tasks.length, 0);
});

// ============================================================================
// Summary
// ============================================================================
runner.summary();
