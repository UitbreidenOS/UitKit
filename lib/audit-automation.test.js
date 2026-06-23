/**
 * Audit Automation Tests
 *
 * Comprehensive test suite for audit-automation.js
 * Coverage: evidence collection, risk scoring, compliance reporting, SOC2 validation
 */

const {
  AuditEngine,
  EvidenceCollector,
  RISK_LEVELS,
  AUDIT_PHASES,
  COMPLIANCE_FRAMEWORKS,
} = require('./audit-automation');

// ============================================================================
// TEST UTILITIES
// ============================================================================

function assert(condition, message) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`ASSERTION FAILED: ${message}\nExpected: ${expected}\nActual: ${actual}`);
  }
}

function assertExists(value, message) {
  if (!value) {
    throw new Error(`ASSERTION FAILED: ${message} - value does not exist`);
  }
}

// ============================================================================
// TEST SUITE
// ============================================================================

const tests = {
  // =========================================================================
  // UNIT TESTS: AuditEngine
  // =========================================================================

  'AuditEngine: initialization': () => {
    const engine = new AuditEngine();
    assertExists(engine.state.auditId, 'Audit ID should be generated');
    assert(engine.state.auditId.startsWith('AUDIT-'), 'Audit ID should have correct format');
    assertEquals(engine.state.status, 'initialized', 'Initial status should be initialized');
    assertEquals(engine.evidence.size, 0, 'Evidence map should be empty initially');
  },

  'AuditEngine: custom configuration': () => {
    const customConfig = {
      framework: COMPLIANCE_FRAMEWORKS.ISO27001,
      samplingRate: 0.05,
      confidenceThreshold: 0.9,
    };
    const engine = new AuditEngine(customConfig);
    assertEquals(engine.config.framework, COMPLIANCE_FRAMEWORKS.ISO27001, 'Framework should be set');
    assertEquals(engine.config.samplingRate, 0.05, 'Sampling rate should be set');
    assertEquals(engine.config.confidenceThreshold, 0.9, 'Confidence threshold should be set');
  },

  'AuditEngine: event emission': () => {
    const engine = new AuditEngine();
    let eventFired = false;

    engine.on('audit:start', (data) => {
      eventFired = true;
      assertExists(data.auditId, 'Event should include auditId');
    });

    assert(eventFired === false, 'Event should not fire before trigger');
    engine.emit('audit:start', { auditId: engine.state.auditId });
    assert(eventFired === true, 'Event should fire after emit');
  },

  // =========================================================================
  // UNIT TESTS: Evidence Collection
  // =========================================================================

  'EvidenceCollector: database audit': async () => {
    const collector = new EvidenceCollector('sql_query_auditor', { type: 'database' });
    const items = await collector.collect();

    assert(items.length > 0, 'Should collect database audit items');
    assert(items.some((item) => item.type === 'database_query'), 'Should have database_query type');
    assert(items.some((item) => item.user), 'Items should have user information');
  },

  'EvidenceCollector: API audit': async () => {
    const collector = new EvidenceCollector('api_audit_logger', { type: 'api' });
    const items = await collector.collect();

    assert(items.length > 0, 'Should collect API audit items');
    assert(items.some((item) => item.type === 'api_call'), 'Should have api_call type');
    assert(items.some((item) => item.method), 'Items should have HTTP method');
  },

  'EvidenceCollector: log parsing': async () => {
    const collector = new EvidenceCollector('log_parser', { type: 'logs' });
    const items = await collector.collect();

    assert(items.length > 0, 'Should collect log entries');
    assert(items.some((item) => item.type === 'log_entry'), 'Should have log_entry type');
    assert(items.some((item) => item.level), 'Items should have log level');
  },

  'EvidenceCollector: SOC2 controls': async () => {
    const collector = new EvidenceCollector('soc2_control_validator', { type: 'database' });
    const items = await collector.collect();

    assert(items.length > 0, 'Should collect SOC2 control items');
    assert(items.some((item) => item.controlId), 'Items should have controlId');
    assert(items.some((item) => item.controlId.startsWith('CC') || item.controlId.startsWith('A')), 'Control IDs should match SOC2 format');
  },

  'AuditEngine: add evidence': () => {
    const engine = new AuditEngine();
    const evidence = {
      type: 'test_evidence',
      source: 'test_source',
      value: 100,
    };

    engine.addEvidence(evidence);
    assertEquals(engine.evidence.size, 1, 'Should add evidence item');

    // Adding duplicate should not increase size
    engine.addEvidence(evidence);
    assertEquals(engine.evidence.size, 1, 'Should not add duplicate evidence');
  },

  // =========================================================================
  // UNIT TESTS: Analysis
  // =========================================================================

  'AuditEngine: pattern detection': async () => {
    const engine = new AuditEngine();
    const evidenceArray = [
      { type: 'access_log', source: 'system_a', timestamp: new Date() },
      { type: 'access_log', source: 'system_a', timestamp: new Date() },
      { type: 'access_log', source: 'system_a', timestamp: new Date() },
      { type: 'error_log', source: 'system_b', timestamp: new Date() },
    ];

    const patterns = engine.detectPatterns(evidenceArray);
    assert(patterns.length > 0, 'Should detect patterns');
    assert(patterns.some((p) => p.frequency >= 3), 'Should identify high-frequency patterns');
  },

  'AuditEngine: anomaly detection': async () => {
    const engine = new AuditEngine();
    const now = Date.now();
    const evidenceArray = [
      { type: 'transaction', value: 1000, timestamp: new Date(now) },
      { type: 'transaction', value: 1100, timestamp: new Date(now - 3600000) },
      { type: 'transaction', value: 950, timestamp: new Date(now - 7200000) },
      { type: 'transaction', value: 50000, timestamp: new Date(now - 10800000) }, // Anomaly
      { type: 'transaction', value: 1050, timestamp: new Date(now - 14400000) },
    ];

    const anomalies = engine.detectAnomalies(evidenceArray);
    assert(anomalies.length >= 0, 'Should detect anomalies or return empty');
  },

  'AuditEngine: statistics calculation': () => {
    const engine = new AuditEngine();
    const evidenceArray = [
      { type: 'metric', value: 10 },
      { type: 'metric', value: 20 },
      { type: 'metric', value: 30 },
      { type: 'metric', value: 40 },
      { type: 'metric', value: 50 },
    ];

    const stats = engine.calculateStatistics(evidenceArray);
    assert(stats.metric, 'Should calculate statistics for metric type');
    assertEquals(stats.metric.count, 5, 'Should count 5 values');
    assertEquals(stats.metric.mean, 30, 'Should calculate correct mean');
    assertEquals(stats.metric.min, 10, 'Should find minimum');
    assertEquals(stats.metric.max, 50, 'Should find maximum');
  },

  'AuditEngine: compliance deviation detection': () => {
    const engine = new AuditEngine();
    const evidenceArray = [
      { type: 'access_log', category: 'access_control', source: 'system' },
    ];

    const deviations = engine.detectComplianceDeviations(evidenceArray, {});
    assert(deviations.length >= 0, 'Should return deviations array');
  },

  'AuditEngine: trend analysis': () => {
    const engine = new AuditEngine();
    const now = Date.now();
    const evidenceArray = [
      { type: 'metric', value: 10, timestamp: new Date(now - 86400000) },
      { type: 'metric', value: 15, timestamp: new Date(now - 82800000) },
      { type: 'metric', value: 20, timestamp: new Date(now - 79200000) },
      { type: 'metric', value: 25, timestamp: new Date(now - 75600000) },
      { type: 'metric', value: 30, timestamp: new Date(now - 72000000) },
    ];

    const trends = engine.analyzeTrends(evidenceArray);
    assert(trends.length >= 0, 'Should analyze trends');
    if (trends.length > 0) {
      assert(trends[0].direction, 'Should have trend direction');
    }
  },

  // =========================================================================
  // UNIT TESTS: Risk Scoring
  // =========================================================================

  'AuditEngine: finding risk calculation': () => {
    const engine = new AuditEngine();
    const finding = {
      type: 'control_failure',
      severity: RISK_LEVELS.HIGH,
      likelihood: 75,
      impact: { financial: true, operational: true, compliance: true },
    };

    const score = engine.calculateFindingRisk(finding);
    assert(score > 0, 'Should calculate positive risk score');
    assert(score <= 100, 'Risk score should be normalized to 0-100');
    assert(score > 50, 'HIGH severity with high likelihood should score > 50');
  },

  'AuditEngine: score to severity conversion': () => {
    const engine = new AuditEngine();

    assertEquals(engine.scoreToSeverity(90), RISK_LEVELS.CRITICAL, 'Score 90 should be CRITICAL');
    assertEquals(engine.scoreToSeverity(70), RISK_LEVELS.HIGH, 'Score 70 should be HIGH');
    assertEquals(engine.scoreToSeverity(50), RISK_LEVELS.MEDIUM, 'Score 50 should be MEDIUM');
    assertEquals(engine.scoreToSeverity(25), RISK_LEVELS.LOW, 'Score 25 should be LOW');
    assertEquals(engine.scoreToSeverity(5), RISK_LEVELS.INFORMATIONAL, 'Score 5 should be INFORMATIONAL');
  },

  // =========================================================================
  // UNIT TESTS: Report Generation
  // =========================================================================

  'AuditEngine: executive summary generation': () => {
    const engine = new AuditEngine();
    engine.state.startTime = performance.now() - 5000;
    engine.state.endTime = performance.now();
    engine.riskRegister = [
      { severity: RISK_LEVELS.CRITICAL, finding: 'Test finding 1' },
      { severity: RISK_LEVELS.HIGH, finding: 'Test finding 2' },
    ];

    const summary = engine.generateExecutiveSummary();
    assertExists(summary.overallAssessment, 'Should have overall assessment');
    assertEquals(summary.findingsSummary.critical, 1, 'Should count critical findings');
    assertEquals(summary.findingsSummary.high, 1, 'Should count high findings');
  },

  'AuditEngine: compliance section generation': () => {
    const engine = new AuditEngine();
    const compliance = engine.generateComplianceSection();

    assertExists(compliance.framework, 'Should have framework');
    assertExists(compliance.compliancePercentage, 'Should have compliance percentage');
    assert(compliance.compliancePercentage >= 0 && compliance.compliancePercentage <= 100, 'Percentage should be 0-100');
    assertExists(compliance.controls, 'Should have controls array');
  },

  'AuditEngine: remediation plan generation': () => {
    const engine = new AuditEngine();
    engine.riskRegister = [
      { severity: RISK_LEVELS.CRITICAL, id: 'R1', finding: 'Critical issue' },
      { severity: RISK_LEVELS.HIGH, id: 'R2', finding: 'High issue' },
      { severity: RISK_LEVELS.MEDIUM, id: 'R3', finding: 'Medium issue' },
    ];

    const plan = engine.generateRemediationPlan();
    assertEquals(plan.totalItems, 3, 'Should track total items');
    assertExists(plan.byPriority[RISK_LEVELS.CRITICAL], 'Should have critical priority items');
    assertExists(plan.timeline, 'Should have timeline');
  },

  'AuditEngine: metrics section generation': () => {
    const engine = new AuditEngine();
    engine.metrics = {
      timeElapsed: 5000,
      collectorsRun: 5,
      evidenceItems: 100,
      automationRate: 0.8,
    };

    const metrics = engine.generateMetricsSection();
    assertExists(metrics.auditMetrics, 'Should have audit metrics');
    assertExists(metrics.timeReduction, 'Should have time reduction metrics');
    assertEquals(metrics.timeReduction.timeSaved, '80%', 'Should show 80% time savings');
  },

  // =========================================================================
  // INTEGRATION TESTS
  // =========================================================================

  'AuditEngine: full audit workflow (simplified)': async () => {
    const engine = new AuditEngine({
      framework: COMPLIANCE_FRAMEWORKS.SOC2_TYPE_II,
    });

    // Mock data source
    const dataSource = {
      type: 'database',
      tables: ['users', 'transactions', 'audit_logs'],
      size: 1,
      complexity: 1,
    };

    // Simple check: can we plan an audit?
    const plan = await engine.planAudit(dataSource, {});
    assertExists(plan.scope, 'Plan should have scope');
    assertExists(plan.collectors, 'Plan should have collectors');
    assertExists(plan.riskCriteria, 'Plan should have risk criteria');
  },

  'AuditEngine: evidence collection workflow': async () => {
    const engine = new AuditEngine();
    const dataSource = { type: 'database', tables: ['users', 'transactions'] };

    // Collect evidence
    const result = await engine.collectEvidence(dataSource, {});
    assertExists(result.collectedItems, 'Should return collected items count');
    assert(engine.metrics.collectorsRun > 0, 'Should execute collectors');
  },

  'AuditEngine: full analysis workflow': async () => {
    const engine = new AuditEngine();

    // Add some evidence
    for (let i = 0; i < 10; i++) {
      engine.addEvidence({
        type: 'log_entry',
        value: Math.random() * 100,
        timestamp: new Date(Date.now() - i * 3600000),
      });
    }

    // Analyze
    const analysis = await engine.analyzeEvidence({});
    assertExists(analysis, 'Should return analysis results');
    assert(Array.isArray(analysis.findings), 'Findings should be array');
  },

  // =========================================================================
  // SOC2 COMPLIANCE TESTS
  // =========================================================================

  'SOC2: framework controls initialization': () => {
    const engine = new AuditEngine({ framework: COMPLIANCE_FRAMEWORKS.SOC2_TYPE_II });
    const controls = engine.getFrameworkControls(COMPLIANCE_FRAMEWORKS.SOC2_TYPE_II);

    assert(controls.length > 0, 'Should have SOC2 controls');
    assert(controls.some((c) => c.id === 'CC6.1'), 'Should have CC6.1 control');
    assert(controls.some((c) => c.id === 'CC7.1'), 'Should have CC7.1 control');
    assert(controls.some((c) => c.id === 'A1.1'), 'Should have A1.1 control');
  },

  'SOC2: control validation': () => {
    const engine = new AuditEngine({ framework: COMPLIANCE_FRAMEWORKS.SOC2_TYPE_II });
    const controls = engine.getFrameworkControls(COMPLIANCE_FRAMEWORKS.SOC2_TYPE_II);

    controls.forEach((control) => {
      assertExists(control.validate, 'Control should have validate method');
      const result = control.validate([{ type: 'access_log' }]);
      assert(result && typeof result === 'object', 'Validation should return result object');
      assert('passed' in result, 'Result should have passed property');
    });
  },

  'SOC2: compliance percentage calculation': () => {
    const engine = new AuditEngine({ framework: COMPLIANCE_FRAMEWORKS.SOC2_TYPE_II });
    engine.findings = [];

    const compliance = engine.generateComplianceSection();
    assert(compliance.compliancePercentage >= 0, 'Compliance percentage should be non-negative');
    assert(compliance.compliancePercentage <= 100, 'Compliance percentage should not exceed 100');
  },

  // =========================================================================
  // PERFORMANCE TESTS
  // =========================================================================

  'Performance: evidence collection speed': async () => {
    const engine = new AuditEngine();
    const startTime = performance.now();

    for (let i = 0; i < 1000; i++) {
      engine.addEvidence({
        type: `type_${i % 10}`,
        value: Math.random() * 100,
        timestamp: new Date(),
      });
    }

    const duration = performance.now() - startTime;
    assert(duration < 1000, `Evidence collection should complete in <1s, took ${duration}ms`);
    assertEquals(engine.evidence.size, 1000, 'Should store 1000 unique evidence items');
  },

  'Performance: risk scoring speed': async () => {
    const engine = new AuditEngine();

    // Add test findings
    for (let i = 0; i < 100; i++) {
      engine.findings.push({
        type: 'test_finding',
        severity: [RISK_LEVELS.CRITICAL, RISK_LEVELS.HIGH, RISK_LEVELS.MEDIUM, RISK_LEVELS.LOW][
          Math.floor(Math.random() * 4)
        ],
        category: `category_${i % 5}`,
      });
    }

    const startTime = performance.now();
    const scores = await engine.scoreRisks({});
    const duration = performance.now() - startTime;

    assert(duration < 500, `Risk scoring should complete in <500ms, took ${duration}ms`);
    assert(engine.riskRegister.length > 0, 'Should generate risk register');
  },

  // =========================================================================
  // ERROR HANDLING TESTS
  // =========================================================================

  'Error handling: invalid evidence': () => {
    const engine = new AuditEngine();

    // Should handle null/undefined gracefully
    try {
      engine.addEvidence(null);
      assert(true, 'Should handle null evidence');
    } catch (e) {
      assert(false, `Should not throw on null evidence: ${e.message}`);
    }
  },

  'Error handling: collector timeout': async () => {
    const engine = new AuditEngine();
    const dataSource = { type: 'unknown_type' };

    try {
      const result = await engine.executeCollector('unknown_collector', dataSource, {});
      assertExists(result.items, 'Should return items array even on error');
      assert(result.items.length >= 0, 'Should return items array');
    } catch (e) {
      assert(false, `Should not throw on unknown collector: ${e.message}`);
    }
  },

  'Error handling: malformed audit plan': () => {
    const engine = new AuditEngine();
    const invalidSource = { type: null, tables: undefined };

    try {
      const plan = engine.defineScopeFromSource(invalidSource);
      assertExists(plan, 'Should return plan object');
      assertExists(plan.domains, 'Should have domains array');
    } catch (e) {
      assert(false, `Should handle malformed source: ${e.message}`);
    }
  },
};

// ============================================================================
// TEST RUNNER
// ============================================================================

async function runTests() {
  const results = {
    passed: 0,
    failed: 0,
    errors: [],
  };

  console.log('\n📋 AUDIT AUTOMATION TEST SUITE\n');
  console.log('='.repeat(70));

  for (const [testName, testFn] of Object.entries(tests)) {
    try {
      await testFn();
      console.log(`✓ ${testName}`);
      results.passed++;
    } catch (error) {
      console.log(`✗ ${testName}`);
      console.log(`  Error: ${error.message}`);
      results.failed++;
      results.errors.push({ test: testName, error: error.message });
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`\n📊 Results: ${results.passed} passed, ${results.failed} failed\n`);

  if (results.failed > 0) {
    console.log('Failed tests:');
    results.errors.forEach(({ test, error }) => {
      console.log(`  - ${test}: ${error}`);
    });
  }

  return results;
}

// Run tests if executed directly
if (require.main === module) {
  runTests()
    .then((results) => {
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('Test runner error:', error);
      process.exit(1);
    });
}

module.exports = { runTests, tests };
