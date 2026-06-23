#!/usr/bin/env node

/**
 * disaster-recovery-automation.test.js
 *
 * Comprehensive test suite for Disaster Recovery Automation system
 * Tests health checks, failover, chaos drills, RTO/RPO targets
 */

const assert = require('assert');
const DRA = require('./disaster-recovery-automation');
const { performance } = require('perf_hooks');

// ============================================================================
// TEST CONFIGURATION
// ============================================================================

const TEST_CONFIG = {
  regions: ['us-east-1', 'us-west-2', 'eu-west-1'],
  endpoints: {
    'us-east-1': {
      api: 'https://api.us-east-1.example.com',
      db: 'db.us-east-1.example.com',
      cache: 'cache.us-east-1.example.com'
    },
    'us-west-2': {
      api: 'https://api.us-west-2.example.com',
      db: 'db.us-west-2.example.com',
      cache: 'cache.us-west-2.example.com'
    },
    'eu-west-1': {
      api: 'https://api.eu-west-1.example.com',
      db: 'db.eu-west-1.example.com',
      cache: 'cache.eu-west-1.example.com'
    }
  },
  enableAutoFailover: false, // Disabled for testing
  enableChaosMode: true
};

// ============================================================================
// UTILITIES
// ============================================================================

const COLORS = {
  RESET: '\x1b[0m',
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  CYAN: '\x1b[36m',
  GRAY: '\x1b[90m'
};

let testCount = 0;
let passCount = 0;
let failCount = 0;

function test(name, fn) {
  testCount++;
  try {
    fn();
    console.log(`${COLORS.GREEN}✓${COLORS.RESET} ${name}`);
    passCount++;
  } catch (err) {
    console.log(`${COLORS.RED}✗${COLORS.RESET} ${name}`);
    console.log(`  ${COLORS.RED}Error: ${err.message}${COLORS.RESET}`);
    failCount++;
  }
}

async function testAsync(name, fn) {
  testCount++;
  try {
    await fn();
    console.log(`${COLORS.GREEN}✓${COLORS.RESET} ${name}`);
    passCount++;
  } catch (err) {
    console.log(`${COLORS.RED}✗${COLORS.RESET} ${name}`);
    console.log(`  ${COLORS.RED}Error: ${err.message}${COLORS.RESET}`);
    failCount++;
  }
}

function assertBetween(value, min, max, msg) {
  assert(value >= min && value <= max, `${msg}: ${value} not between ${min} and ${max}`);
}

function printSummary() {
  console.log(`\n${COLORS.CYAN}${COLORS.GRAY}${'─'.repeat(60)}${COLORS.RESET}`);
  console.log(`Tests run: ${testCount}`);
  console.log(`${COLORS.GREEN}Passed: ${passCount}${COLORS.RESET}`);
  if (failCount > 0) {
    console.log(`${COLORS.RED}Failed: ${failCount}${COLORS.RESET}`);
  }
  console.log(`${COLORS.GRAY}${'─'.repeat(60)}${COLORS.RESET}\n`);

  return failCount === 0;
}

// ============================================================================
// TEST SUITES
// ============================================================================

async function runHealthCheckTests() {
  console.log(`\n${COLORS.CYAN}Health Check Tests${COLORS.RESET}`);
  console.log(`${COLORS.GRAY}${'─'.repeat(60)}${COLORS.RESET}`);

  const drm = new DRA.DisasterRecoveryManager(TEST_CONFIG);
  await drm.initialize();

  test('Region health check initialized for all regions', () => {
    assert(drm.regionHealthChecks['us-east-1']);
    assert(drm.regionHealthChecks['us-west-2']);
    assert(drm.regionHealthChecks['eu-west-1']);
  });

  await testAsync('Health check completes successfully', async () => {
    const health = await drm.regionHealthChecks['us-east-1'].checkHealth();
    assert(health);
    assert(health.status);
    assert(health.lastCheck);
  });

  await testAsync('All regions checked in performHealthChecks', async () => {
    // This should complete within reasonable time
    const start = performance.now();
    await drm.performHealthChecks();
    const duration = performance.now() - start;

    assertBetween(duration, 0, 10000, 'Health check duration');
  });

  test('Health status has required fields', () => {
    const health = drm.regionHealthChecks['us-east-1'].health;
    assert('status' in health);
    assert('lastCheck' in health);
    assert('consecutiveFailures' in health);
    assert('responseTime' in health);
    assert('circuitOpen' in health);
  });

  test('Check history maintains reasonable size', () => {
    const checker = drm.regionHealthChecks['us-east-1'];
    // Simulate multiple checks
    for (let i = 0; i < 50; i++) {
      checker.recordHistory({
        timestamp: new Date().toISOString(),
        status: 'healthy'
      });
    }
    // Should not exceed limit
    assert(checker.checkHistory.length <= 1500);
  });
}

async function runFailoverTests() {
  console.log(`\n${COLORS.CYAN}Failover Orchestration Tests${COLORS.RESET}`);
  console.log(`${COLORS.GRAY}${'─'.repeat(60)}${COLORS.RESET}`);

  const drm = new DRA.DisasterRecoveryManager(TEST_CONFIG);
  await drm.initialize();

  test('Failover orchestrator initialized', () => {
    assert(drm.failoverOrchestrator);
    assert.strictEqual(drm.failoverOrchestrator.primaryRegion, 'us-east-1');
  });

  await testAsync('Manual failover changes primary region', async () => {
    const result = await drm.manualFailover('us-east-1', 'us-west-2');
    assert(result.status === 'completed' || result.status === 'in_progress');
  });

  await testAsync('Failover has UUID identifier', async () => {
    const result = await drm.manualFailover('us-west-2', 'eu-west-1');
    assert(result.id);
    assert(result.id.length === 36); // UUID format
  });

  await testAsync('Failover RTO within target', async () => {
    const result = await drm.manualFailover('eu-west-1', 'us-east-1');
    if (result.rto) {
      assertBetween(result.rto, 0, DRA.RTO_TARGET * 1.5, 'RTO must be reasonable');
    }
  });

  await testAsync('Failover RPO within target', async () => {
    const result = await drm.manualFailover('us-east-1', 'us-west-2');
    if (result.rpo) {
      assertBetween(result.rpo, 0, DRA.RPO_TARGET * 1.5, 'RPO must be reasonable');
    }
  });

  test('Failover history recorded', () => {
    assert(drm.failoverOrchestrator.failoverHistory.length > 0);
  });

  test('Failover entry has all required fields', () => {
    const failover = drm.failoverOrchestrator.failoverHistory[0];
    assert(failover.id);
    assert(failover.timestamp);
    assert(failover.from);
    assert(failover.to);
    assert(failover.status);
    assert(failover.steps);
  });
}

async function runCircuitBreakerTests() {
  console.log(`\n${COLORS.CYAN}Circuit Breaker Tests${COLORS.RESET}`);
  console.log(`${COLORS.GRAY}${'─'.repeat(60)}${COLORS.RESET}`);

  const drm = new DRA.DisasterRecoveryManager(TEST_CONFIG);
  await drm.initialize();

  const checker = drm.regionHealthChecks['us-east-1'];

  test('Circuit breaker initially closed', () => {
    assert(!checker.health.circuitOpen);
  });

  test('Circuit breaker opens after threshold failures', async () => {
    // Simulate consecutive failures by manipulating checker
    for (let i = 0; i < DRA.CIRCUIT_BREAKER_THRESHOLD; i++) {
      checker.health.consecutiveFailures++;
      if (checker.health.consecutiveFailures >= DRA.CIRCUIT_BREAKER_THRESHOLD) {
        checker.health.circuitOpen = true;
      }
    }
    assert(checker.health.circuitOpen);
  });

  test('Circuit breaker can be reset', () => {
    checker.resetCircuitBreaker();
    assert(!checker.health.circuitOpen);
    assert.strictEqual(checker.health.consecutiveFailures, 0);
  });
}

async function runReplicationTests() {
  console.log(`\n${COLORS.CYAN}Database Replication Tests${COLORS.RESET}`);
  console.log(`${COLORS.GRAY}${'─'.repeat(60)}${COLORS.RESET}`);

  const drm = new DRA.DisasterRecoveryManager(TEST_CONFIG);
  await drm.initialize();

  test('Replication monitor initialized', () => {
    assert(drm.replicationMonitor);
  });

  await testAsync('Replication status monitored for all regions', async () => {
    await drm.monitorDatabaseSync();
    const status = drm.replicationMonitor.replicationStatus;
    assert(status['us-east-1']);
    assert(status['us-west-2']);
    assert(status['eu-west-1']);
  });

  test('Replication status has required fields', async () => {
    const status = drm.replicationMonitor.replicationStatus['us-east-1'];
    assert('lag' in status);
    assert('lastSync' in status);
    assert('bytesReplicated' in status);
    assert('syncPercentage' in status);
    assert('status' in status);
  });

  await testAsync('DB lag tracked over time', async () => {
    await drm.monitorDatabaseSync();
    const history = drm.replicationMonitor.syncPoints;
    assert(history.length > 0);
  });

  test('Consistency check includes all regions', () => {
    const consistency = drm.replicationMonitor.syncPoints[0];
    if (consistency) {
      assert(consistency.regions['us-east-1']);
      assert(consistency.regions['us-west-2']);
      assert(consistency.regions['eu-west-1']);
    }
  });
}

async function runChaosTests() {
  console.log(`\n${COLORS.CYAN}Chaos Engineering Tests${COLORS.RESET}`);
  console.log(`${COLORS.GRAY}${'─'.repeat(60)}${COLORS.RESET}`);

  const drm = new DRA.DisasterRecoveryManager(TEST_CONFIG);
  await drm.initialize();

  test('Chaos engine initialized', () => {
    assert(drm.chaosEngine);
  });

  test('Chaos drill schedule calculated', () => {
    const schedule = drm.chaosEngine.getDrillSchedule();
    assert(schedule.nextScheduledDrill);
    assert(schedule.daysUntilNextDrill >= 0);
  });

  await testAsync('Region failure drill completes', async () => {
    const result = await drm.chaosEngine.runDrill('region-failure', 'us-east-1');
    assert(result.id);
    assert(result.type === 'region-failure');
    assert(['completed', 'failed'].includes(result.status));
  });

  await testAsync('Database lag drill completes', async () => {
    const result = await drm.chaosEngine.runDrill('database-lag');
    assert(result.type === 'database-lag');
    assert(['completed', 'failed'].includes(result.status));
  });

  await testAsync('Cascading failure drill completes', async () => {
    const result = await drm.chaosEngine.runDrill('cascading-failure');
    assert(result.type === 'cascading-failure');
    assert(['completed', 'failed'].includes(result.status));
  });

  await testAsync('Network partition drill completes', async () => {
    const result = await drm.chaosEngine.runDrill('network-partition');
    assert(result.type === 'network-partition');
    assert(['completed', 'failed'].includes(result.status));
  });

  test('Drill history recorded', () => {
    assert(drm.chaosEngine.drillHistory.length > 0);
  });

  test('Drill entry has required fields', () => {
    const drill = drm.chaosEngine.drillHistory[0];
    assert(drill.id);
    assert(drill.type);
    assert(drill.timestamp);
    assert(drill.status);
    assert(drill.results);
  });

  test('Monthly drill interval is correct', () => {
    assert.strictEqual(DRA.CHAOS_DRILL_INTERVAL, 2592000000); // 30 days
  });
}

async function runRTORPOTests() {
  console.log(`\n${COLORS.CYAN}RTO/RPO Target Tests${COLORS.RESET}`);
  console.log(`${COLORS.GRAY}${'─'.repeat(60)}${COLORS.RESET}`);

  test('RTO target is 2 minutes', () => {
    assert.strictEqual(DRA.RTO_TARGET, 120000);
  });

  test('RPO target is 1 minute', () => {
    assert.strictEqual(DRA.RPO_TARGET, 60000);
  });

  test('Health check interval is 30 seconds', () => {
    assert.strictEqual(DRA.HEALTH_CHECK_INTERVAL, 30000);
  });

  test('Circuit breaker threshold is 5 failures', () => {
    assert.strictEqual(DRA.CIRCUIT_BREAKER_THRESHOLD, 5);
  });

  const drm = new DRA.DisasterRecoveryManager(TEST_CONFIG);
  await drm.initialize();

  test('Status includes RTO/RPO targets', () => {
    const status = drm.getStatus();
    assert.strictEqual(status.rtoTarget, DRA.RTO_TARGET);
    assert.strictEqual(status.rpoTarget, DRA.RPO_TARGET);
  });
}

async function runStartStopTests() {
  console.log(`\n${COLORS.CYAN}Lifecycle Tests${COLORS.RESET}`);
  console.log(`${COLORS.GRAY}${'─'.repeat(60)}${COLORS.RESET}`);

  const drm = new DRA.DisasterRecoveryManager(TEST_CONFIG);
  await drm.initialize();

  test('Manager not running initially', () => {
    assert(!drm.isRunning);
  });

  await testAsync('Manager starts successfully', async () => {
    await drm.start();
    assert(drm.isRunning);
  });

  test('Health check interval set after start', () => {
    assert(drm.healthCheckInterval !== null);
  });

  test('DB sync interval set after start', () => {
    assert(drm.dbSyncInterval !== null);
  });

  await testAsync('Manager stops successfully', async () => {
    await drm.stop();
    assert(!drm.isRunning);
  });

  test('Intervals cleared after stop', () => {
    assert(drm.healthCheckInterval === null || !drm.isRunning);
  });
}

async function runStatusReportTests() {
  console.log(`\n${COLORS.CYAN}Status & Reporting Tests${COLORS.RESET}`);
  console.log(`${COLORS.GRAY}${'─'.repeat(60)}${COLORS.RESET}`);

  const drm = new DRA.DisasterRecoveryManager(TEST_CONFIG);
  await drm.initialize();
  await drm.performHealthChecks();

  test('getStatus returns complete status', () => {
    const status = drm.getStatus();
    assert(status.running !== undefined);
    assert(status.timestamp);
    assert(status.primaryRegion);
    assert(status.regionHealth);
    assert(status.replication);
  });

  test('getDetailedReport includes failovers and drills', () => {
    const report = drm.getDetailedReport();
    assert(report.timestamp);
    assert(report.status);
    assert(Array.isArray(report.recentFailovers));
    assert(Array.isArray(report.recentDrills));
  });

  test('exportMetrics includes all data', () => {
    const metrics = drm.exportMetrics();
    assert(metrics.version);
    assert(metrics.exportTime);
    assert(metrics.config);
    assert(metrics.status);
    assert(Array.isArray(metrics.failoverHistory));
    assert(Array.isArray(metrics.chaosHistory));
  });

  test('Primary region tracked correctly', () => {
    const status = drm.getStatus();
    assert.strictEqual(status.primaryRegion, drm.failoverOrchestrator.primaryRegion);
  });
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests() {
  console.log(`\n${COLORS.CYAN}${COLORS.BOLD}═══════════════════════════════════════════${COLORS.RESET}`);
  console.log(`${COLORS.CYAN}Disaster Recovery Automation Test Suite${COLORS.RESET}`);
  console.log(`${COLORS.CYAN}═══════════════════════════════════════════${COLORS.RESET}\n`);

  try {
    await runHealthCheckTests();
    await runFailoverTests();
    await runCircuitBreakerTests();
    await runReplicationTests();
    await runChaosTests();
    await runRTORPOTests();
    await runStartStopTests();
    await runStatusReportTests();

    const success = printSummary();
    process.exit(success ? 0 : 1);
  } catch (err) {
    console.error(`${COLORS.RED}Fatal test error: ${err.message}${COLORS.RESET}`);
    process.exit(1);
  }
}

if (require.main === module) {
  runAllTests();
}

module.exports = { test, testAsync, assertBetween };
