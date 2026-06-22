/**
 * failure-learner.test.js
 *
 * Tests and usage examples for FailureLearner
 */

const FailureLearner = require('./failure-learner');

// Test suite
const tests = {
  testTimeoutFailure() {
    console.log('\n=== Test: Timeout Failure ===');
    const learner = new FailureLearner();

    const result = learner.recordFailure({
      type: 'timeout',
      message: 'Task execution exceeded 30000ms',
      context: { taskId: 'task-001', model: 'haiku', tokens: 8000 }
    });

    console.log('Recorded failure:', result);
    console.log('Insight:', learner.getSurfacedInsight(result.patternId));

    // Simulate recovery attempts
    let recovery = learner.getNextRecovery(result.patternId);
    while (recovery) {
      console.log(`\nAttempt ${recovery.attemptNumber}/${recovery.totalStrategies}`);
      console.log(`Strategy: ${recovery.strategy}`);
      console.log(`Rationale: ${recovery.rationale}`);
      console.log(`Params:`, recovery.params);

      if (recovery.attemptNumber === 2) {
        console.log('✓ Strategy succeeded (simulated)');
        learner.resolvePattern(result.patternId, {
          strategy: recovery.strategy,
          success: true,
          attemptNumber: recovery.attemptNumber
        });
        break;
      }

      recovery = learner.getNextRecovery(result.patternId);
    }
  },

  testValidationFailure() {
    console.log('\n=== Test: Validation Failure ===');
    const learner = new FailureLearner();

    const result = learner.recordFailure({
      type: 'validation_failed',
      message: 'Output does not match schema: missing required fields',
      context: { expectedSchema: 'json', received: 'malformed' }
    });

    console.log('Recorded failure:', result);
    console.log('Suggestions:');
    result.suggestions.forEach((s, i) => {
      console.log(`  ${i + 1}. ${s.strategy}: ${s.rationale}`);
    });
  },

  testAuthFailure() {
    console.log('\n=== Test: OAuth Auth Failure ===');
    const learner = new FailureLearner();

    const result = learner.recordFailure({
      type: 'auth_failed',
      message: 'OAuth token expired',
      context: { service: 'github', tokenAge: 3600 }
    });

    console.log('Recorded failure:', result);
    console.log('Insight:', learner.getSurfacedInsight(result.patternId));
    console.log('\nRecovery strategies (in order):');
    result.suggestions.forEach((s, i) => {
      console.log(`  ${i + 1}. ${s.strategy}`);
    });
  },

  testResourceLimitFailure() {
    console.log('\n=== Test: Resource Limit (Token) Failure ===');
    const learner = new FailureLearner();

    const result = learner.recordFailure({
      type: 'resource_limit',
      message: 'Exceeded token limit: 100000 / 100000',
      context: { limit: 100000, used: 100000, model: 'sonnet' }
    });

    console.log('Recorded failure:', result);

    const recovery = learner.getNextRecovery(result.patternId);
    console.log('\nFirst recovery strategy:');
    console.log(`  Strategy: ${recovery.strategy}`);
    console.log(`  Rationale: ${recovery.rationale}`);
    console.log(`  Params:`, recovery.params);
  },

  testAgentRefusal() {
    console.log('\n=== Test: Agent Refusal ===');
    const learner = new FailureLearner();

    const result = learner.recordFailure({
      type: 'agent_refusal',
      message: 'Agent declined task: request appears unsafe',
      context: { reason: 'potential_security_risk', suggestion: 'clarify_intent' }
    });

    console.log('Recorded failure:', result);
    console.log('Suggested first recovery:', result.suggestions[0].strategy);
    console.log('Rationale:', result.suggestions[0].rationale);
  },

  testFormatError() {
    console.log('\n=== Test: Format Error ===');
    const learner = new FailureLearner();

    const result = learner.recordFailure({
      type: 'format_error',
      message: 'Invalid JSON: unexpected token at position 42',
      context: { input: '{"key": undefined}', expected: 'valid JSON' }
    });

    console.log('Recorded failure:', result);

    let recovery = learner.getNextRecovery(result.patternId);
    console.log('\nFirst recovery:', recovery.strategy);
    recovery = learner.getNextRecovery(result.patternId);
    console.log('Second recovery:', recovery.strategy);
  },

  testToolUnavailable() {
    console.log('\n=== Test: Tool Unavailable ===');
    const learner = new FailureLearner();

    const result = learner.recordFailure({
      type: 'tool_unavailable',
      message: 'Tool not found: git-diff',
      context: { tool: 'git-diff', available: ['git', 'npm'] }
    });

    console.log('Recorded failure:', result);
    console.log('Available alternatives:', result.suggestions.map(s => s.strategy).join(', '));
  },

  testMultipleFailures() {
    console.log('\n=== Test: Multiple Failures & Statistics ===');
    const learner = new FailureLearner();

    // Record multiple failures
    learner.recordFailure({
      type: 'timeout',
      message: 'First timeout',
      context: { attempt: 1 }
    });

    learner.recordFailure({
      type: 'timeout',
      message: 'Second timeout',
      context: { attempt: 2 }
    });

    learner.recordFailure({
      type: 'auth_failed',
      message: 'Auth failure',
      context: {}
    });

    learner.recordFailure({
      type: 'resource_limit',
      message: 'Token limit',
      context: {}
    });

    const stats = learner.getStats();
    console.log('Failure Statistics:');
    console.log(`  Total failures: ${stats.totalFailures}`);
    console.log(`  Resolved: ${stats.resolved}`);
    console.log('\nBy type:');
    for (const [type, data] of Object.entries(stats.byType)) {
      if (data.total > 0) {
        console.log(`  ${type}: ${data.total} (resolved: ${data.resolved}, avg attempts: ${data.avgRecoveryAttempts.toFixed(2)})`);
      }
    }
  },

  testSimilarFailuresLearning() {
    console.log('\n=== Test: Learning from Similar Failures ===');
    const learner = new FailureLearner();

    // Record and resolve auth failures
    const f1 = learner.recordFailure({
      type: 'auth_failed',
      message: 'Token expired'
    });

    let recovery = learner.getNextRecovery(f1.patternId);
    learner.resolvePattern(f1.patternId, { strategy: recovery.strategy, success: true });

    const f2 = learner.recordFailure({
      type: 'auth_failed',
      message: 'Token expired again'
    });

    console.log('Insight on second auth failure:');
    console.log(learner.getSurfacedInsight(f2.patternId));

    const similar = learner.getSimilarFailures('auth_failed');
    console.log(`\nFound ${similar.length} similar resolved failures`);
  },

  testExportImport() {
    console.log('\n=== Test: Export/Import State ===');
    const learner1 = new FailureLearner();

    learner1.recordFailure({
      type: 'timeout',
      message: 'Test timeout'
    });

    const exported = learner1.export();
    console.log('Exported state keys:', Object.keys(exported));
    console.log('Patterns count:', exported.patterns.length);

    const learner2 = new FailureLearner();
    learner2.import(exported);
    console.log('Imported patterns:', learner2.patterns.length);
    console.log('Strategies preserved:', learner2.strategies.size);
  }
};

// Run all tests
function runTests() {
  console.log('================================');
  console.log('FailureLearner Test Suite');
  console.log('================================');

  for (const [testName, testFn] of Object.entries(tests)) {
    try {
      testFn();
    } catch (error) {
      console.error(`\n✗ ${testName} failed:`, error.message);
    }
  }

  console.log('\n================================');
  console.log('All tests completed');
  console.log('================================\n');
}

// Run if called directly
if (require.main === module) {
  runTests();
}

module.exports = tests;
