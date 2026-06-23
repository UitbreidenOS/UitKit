#!/usr/bin/env node

const {
  ExecutionRecorder,
  ExecutionReplayer,
  ExecutionTrace,
} = require('./execution-replay');

const assert = require('assert');

// Test suite
const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

test('ExecutionTrace creation', () => {
  const trace = new ExecutionTrace('goal_123', 'pool_456');
  assert.strictEqual(trace.goalId, 'goal_123');
  assert.strictEqual(trace.poolId, 'pool_456');
  assert.strictEqual(trace.status, 'recording');
  assert.strictEqual(trace.frames.length, 0);
});

test('ExecutionTrace frame addition', () => {
  const trace = new ExecutionTrace('goal_123');
  const frame = trace.addFrame('decision', { decision: 'check_cpu' });

  assert.strictEqual(trace.frames.length, 1);
  assert.strictEqual(frame.type, 'decision');
  assert.strictEqual(frame.data.decision, 'check_cpu');
  assert.ok(frame.timestamp);
});

test('ExecutionTrace decision filtering', () => {
  const trace = new ExecutionTrace('goal_123');
  trace.addFrame('decision', { decision: 'check_cpu' });
  trace.addFrame('metric', { metricName: 'usage', value: 50 });
  trace.addFrame('decision', { decision: 'allocate_memory' });

  const decisions = trace.getDecisionPoints();
  assert.strictEqual(decisions.length, 2);
  assert.strictEqual(decisions[0].data.decision, 'check_cpu');
  assert.strictEqual(decisions[1].data.decision, 'allocate_memory');
});

test('ExecutionTrace error filtering', () => {
  const trace = new ExecutionTrace('goal_123');
  trace.addFrame('decision', { decision: 'check_cpu' });
  trace.addFrame('error', {
    errorMessage: 'CPU limit exceeded',
    errorStack: 'stack trace',
  });

  const errors = trace.getErrors();
  assert.strictEqual(errors.length, 1);
  assert.strictEqual(errors[0].data.errorMessage, 'CPU limit exceeded');
});

test('ExecutionTrace state tracking', () => {
  const trace = new ExecutionTrace('goal_123');
  assert.strictEqual(trace.status, 'recording');

  trace.endTime = Date.now();
  trace.status = 'completed';
  const json = trace.toJSON();

  assert.strictEqual(json.status, 'completed');
  assert.ok(json.duration >= 0);
});

test('ExecutionRecorder trace creation', () => {
  const recorder = new ExecutionRecorder();
  const trace = recorder.startTrace('goal_123', 'pool_456');

  assert.ok(trace);
  assert.strictEqual(trace.goalId, 'goal_123');
  assert.strictEqual(recorder.activeTrace, trace);
});

test('ExecutionRecorder decision recording', () => {
  const recorder = new ExecutionRecorder();
  const trace = recorder.startTrace('goal_123');

  const frame = recorder.recordDecision(
    'allocate_resources',
    { cpu: 1.0, memory: 512 },
    'success'
  );

  assert.strictEqual(trace.frames.length, 1);
  assert.strictEqual(frame.type, 'decision');
  assert.strictEqual(frame.data.result, 'success');
});

test('ExecutionRecorder state change tracking', () => {
  const recorder = new ExecutionRecorder();
  const trace = recorder.startTrace('goal_123');

  recorder.recordStateChange('queued', 'active');
  recorder.recordStateChange('active', 'completed');

  const stateChanges = trace.getStateChanges();
  assert.strictEqual(stateChanges.length, 2);
  assert.strictEqual(stateChanges[0].data.oldState, 'queued');
  assert.strictEqual(stateChanges[1].data.newState, 'completed');
});

test('ExecutionRecorder error recording', () => {
  const recorder = new ExecutionRecorder();
  const trace = recorder.startTrace('goal_123');

  const error = new Error('Test error');
  recorder.recordError(error, { context: 'during_execution' });

  const errors = trace.getErrors();
  assert.strictEqual(errors.length, 1);
  assert.strictEqual(errors[0].data.errorMessage, 'Test error');
});

test('ExecutionRecorder metric recording', () => {
  const recorder = new ExecutionRecorder();
  const trace = recorder.startTrace('goal_123');

  recorder.recordMetric('tokens_used', 1500);
  recorder.recordMetric('latency_ms', 250);

  const metrics = trace.getMetrics();
  assert.strictEqual(metrics.length, 2);
  assert.strictEqual(metrics[0].data.metricName, 'tokens_used');
  assert.strictEqual(metrics[0].data.value, 1500);
});

test('ExecutionRecorder resource check', () => {
  const recorder = new ExecutionRecorder();
  const trace = recorder.startTrace('goal_123');

  recorder.recordResourceCheck('tokens', 1500, 50000);
  recorder.recordResourceCheck('memory', 256, 1024);

  assert.strictEqual(trace.frames.length, 2);
  assert.strictEqual(
    trace.frames[0].data.percentUsed,
    Math.round((1500 / 50000) * 100)
  );
});

test('ExecutionRecorder trace completion', () => {
  const recorder = new ExecutionRecorder();
  const trace = recorder.startTrace('goal_123');

  recorder.recordDecision('execute', {});
  const result = recorder.endTrace('completed', { output: 'success' });

  assert.strictEqual(result.status, 'completed');
  assert.strictEqual(result.result.output, 'success');
  assert.strictEqual(recorder.activeTrace, null);
});

test('ExecutionReplayer current frame', () => {
  const trace = new ExecutionTrace('goal_123');
  trace.addFrame('decision', { decision: 'check' });
  trace.addFrame('metric', { metricName: 'usage', value: 50 });

  const replayer = new ExecutionReplayer(trace);
  const frame = replayer.getCurrentFrame();

  assert.strictEqual(frame.type, 'decision');
});

test('ExecutionReplayer step forward', () => {
  const trace = new ExecutionTrace('goal_123');
  trace.addFrame('decision', { decision: 'check' });
  trace.addFrame('metric', { metricName: 'usage', value: 50 });
  trace.addFrame('decision', { decision: 'execute' });

  const replayer = new ExecutionReplayer(trace);
  assert.strictEqual(replayer.currentFrameIndex, 0);

  replayer.step();
  assert.strictEqual(replayer.currentFrameIndex, 1);

  replayer.step();
  assert.strictEqual(replayer.currentFrameIndex, 2);

  // Try stepping past end
  const result = replayer.step();
  assert.strictEqual(result, false);
});

test('ExecutionReplayer step backward', () => {
  const trace = new ExecutionTrace('goal_123');
  trace.addFrame('decision', { decision: 'check' });
  trace.addFrame('metric', { metricName: 'usage', value: 50 });
  trace.addFrame('decision', { decision: 'execute' });

  const replayer = new ExecutionReplayer(trace);
  replayer.step();
  replayer.step();

  assert.strictEqual(replayer.currentFrameIndex, 2);

  const result1 = replayer.stepBack();
  assert.strictEqual(result1, true);
  assert.strictEqual(replayer.currentFrameIndex, 1);

  const result2 = replayer.stepBack();
  assert.strictEqual(result2, true);
  assert.strictEqual(replayer.currentFrameIndex, 0);

  const result3 = replayer.stepBack();
  assert.strictEqual(result3, false);
});

test('ExecutionReplayer jump to frame', () => {
  const trace = new ExecutionTrace('goal_123');
  for (let i = 0; i < 5; i++) {
    trace.addFrame('metric', { metricName: `metric_${i}`, value: i });
  }

  const replayer = new ExecutionReplayer(trace);
  const result = replayer.jumpToFrame(3);

  assert.strictEqual(result, true);
  assert.strictEqual(replayer.currentFrameIndex, 3);
});

test('ExecutionReplayer jump to error', () => {
  const trace = new ExecutionTrace('goal_123');
  trace.addFrame('decision', { decision: 'check' });
  trace.addFrame('metric', { metricName: 'usage', value: 50 });
  trace.addFrame('error', { errorMessage: 'Test error' });
  trace.addFrame('decision', { decision: 'retry' });

  const replayer = new ExecutionReplayer(trace);
  const result = replayer.jumpToError();

  assert.strictEqual(result, true);
  assert.strictEqual(replayer.getCurrentFrame().type, 'error');
});

test('ExecutionReplayer breakpoints', () => {
  const trace = new ExecutionTrace('goal_123');
  for (let i = 0; i < 5; i++) {
    trace.addFrame('decision', { decision: `decision_${i}` });
  }

  const replayer = new ExecutionReplayer(trace);
  replayer.setBreakpoint(2);
  replayer.setBreakpoint(4);

  const breakpoints = replayer.getBreakpoints();
  assert.deepStrictEqual(breakpoints, [2, 4]);

  replayer.clearBreakpoint(2);
  const updated = replayer.getBreakpoints();
  assert.deepStrictEqual(updated, [4]);

  replayer.clearAllBreakpoints();
  assert.strictEqual(replayer.getBreakpoints().length, 0);
});

test('ExecutionReplayer watches', () => {
  const trace = new ExecutionTrace('goal_123');
  const replayer = new ExecutionReplayer(trace);

  replayer.setWatch('cpu_usage', 0.8);
  replayer.setWatch('memory_used', 512);

  const watches = replayer.getWatches();
  assert.strictEqual(watches.cpu_usage, 0.8);
  assert.strictEqual(watches.memory_used, 512);

  replayer.removeWatch('cpu_usage');
  const updated = replayer.getWatches();
  assert.ok(!('cpu_usage' in updated));
  assert.strictEqual(updated.memory_used, 512);
});

test('ExecutionReplayer decision path', () => {
  const trace = new ExecutionTrace('goal_123');
  trace.addFrame('decision', { decision: 'check_cpu', result: 'ok' });
  trace.addFrame('metric', { metricName: 'usage', value: 50 });
  trace.addFrame('decision', { decision: 'allocate', result: 'success' });

  const replayer = new ExecutionReplayer(trace);
  const path = replayer.getDecisionPath();

  assert.strictEqual(path.length, 2);
  assert.strictEqual(path[0].decision, 'check_cpu');
  assert.strictEqual(path[1].decision, 'allocate');
});

test('ExecutionReplayer error trace', () => {
  const trace = new ExecutionTrace('goal_123');
  trace.addFrame('decision', { decision: 'check' });
  trace.addFrame('error', { errorMessage: 'Error 1', errorStack: 'stack1' });
  trace.addFrame('decision', { decision: 'retry' });
  trace.addFrame('error', { errorMessage: 'Error 2', errorStack: 'stack2' });

  const replayer = new ExecutionReplayer(trace);
  const errorTrace = replayer.getErrorTrace();

  assert.strictEqual(errorTrace.length, 2);
  assert.strictEqual(errorTrace[0].error, 'Error 1');
  assert.strictEqual(errorTrace[1].error, 'Error 2');
});

test('ExecutionReplayer frame context', () => {
  const trace = new ExecutionTrace('goal_123');
  for (let i = 0; i < 10; i++) {
    trace.addFrame('metric', { metricName: `m${i}` });
  }

  const replayer = new ExecutionReplayer(trace);
  replayer.jumpToFrame(5);

  const ctx = replayer.getFrameContext();
  assert.strictEqual(ctx.frameIndex, 5);
  assert.strictEqual(ctx.totalFrames, 10);
  assert.strictEqual(ctx.progress, 50);
  assert.ok(ctx.nextFrame);
  assert.ok(ctx.previousFrame);
});

test('ExecutionReplayer frame range', () => {
  const trace = new ExecutionTrace('goal_123');
  for (let i = 0; i < 10; i++) {
    trace.addFrame('metric', { metricName: `m${i}`, value: i });
  }

  const replayer = new ExecutionReplayer(trace);
  const range = replayer.getFrameRange(2, 5);

  assert.strictEqual(range.length, 3);
  assert.strictEqual(range[0].index, 2);
  assert.strictEqual(range[2].index, 4);
});

test('ExecutionRecorder list traces', () => {
  const recorder = new ExecutionRecorder();

  const trace1 = recorder.startTrace('goal_1');
  recorder.endTrace('completed');
  recorder.saveTrace(trace1.traceId);

  const trace2 = recorder.startTrace('goal_2');
  recorder.endTrace('completed');
  recorder.saveTrace(trace2.traceId);

  const traces = recorder.listTraces();
  assert.ok(traces.length >= 2);
  assert.ok(traces.includes(trace1.traceId));
  assert.ok(traces.includes(trace2.traceId));
});

// Run all tests
async function runTests() {
  const COLORS = {
    RESET: '\x1b[0m',
    GREEN: '\x1b[32m',
    RED: '\x1b[31m',
    CYAN: '\x1b[36m',
    BOLD: '\x1b[1m',
    DIM: '\x1b[2m',
  };

  console.log(`${COLORS.BOLD}${COLORS.CYAN}execution-replay Test Suite${COLORS.RESET}\n`);

  let passed = 0;
  let failed = 0;

  for (const { name, fn } of tests) {
    try {
      fn();
      console.log(`${COLORS.GREEN}✓${COLORS.RESET} ${name}`);
      passed++;
    } catch (error) {
      console.log(`${COLORS.RED}✗${COLORS.RESET} ${name}`);
      console.log(`  ${error.message}`);
      failed++;
    }
  }

  console.log(`\n${COLORS.DIM}${passed} passed, ${failed} failed${COLORS.RESET}`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Test suite error:', error);
  process.exit(1);
});
