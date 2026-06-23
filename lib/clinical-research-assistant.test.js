#!/usr/bin/env node

/**
 * Clinical Research Assistant - Test Suite
 * Comprehensive tests for all components and FDA compliance
 */

const assert = require('assert');
const ClinicalResearchAssistant = require('./clinical-research-assistant');
const {
  AuditTrail,
  LiteratureReviewAgent,
  ProtocolAnalysisAgent,
  DataValidationAgent,
  AdverseEventAgent,
  StatisticalAnalysisAgent,
} = require('./clinical-research-assistant');

// ============================================================================
// Test Utilities
// ============================================================================

let passedTests = 0;
let failedTests = 0;

function assert_equal(actual, expected, message) {
  try {
    assert.strictEqual(actual, expected);
    console.log(`  ✓ ${message}`);
    passedTests++;
  } catch (error) {
    console.error(`  ✗ ${message}`);
    console.error(`    Expected: ${expected}, Got: ${actual}`);
    failedTests++;
  }
}

function assert_true(condition, message) {
  try {
    assert(condition, message);
    console.log(`  ✓ ${message}`);
    passedTests++;
  } catch (error) {
    console.error(`  ✗ ${message}`);
    failedTests++;
  }
}

function assert_exists(value, message) {
  try {
    assert(value !== null && value !== undefined, message);
    console.log(`  ✓ ${message}`);
    passedTests++;
  } catch (error) {
    console.error(`  ✗ ${message}`);
    failedTests++;
  }
}

// ============================================================================
// Audit Trail Tests
// ============================================================================

function test_audit_trail() {
  console.log('\n[AUDIT TRAIL TESTS]');
  console.log('==================\n');

  const auditTrail = new AuditTrail();

  // Test: Record action
  const record = auditTrail.recordAction('TEST_ACTION', 'test_actor', {
    detail: 'test detail',
  });

  assert_exists(record.id, 'Record should have ID');
  assert_equal(record.action, 'TEST_ACTION', 'Record should have action');
  assert_equal(record.actor, 'test_actor', 'Record should have actor');
  assert_exists(record.signature, 'Record should have signature');

  // Test: Verify signature
  const isValid = auditTrail.verify(record);
  assert_true(isValid, 'Signature should be valid');

  // Test: Detect tampered records
  record.details.detail = 'tampered';
  const isTampered = !auditTrail.verify(record);
  assert_true(isTampered, 'Tampered records should be detected');

  // Test: Export to JSON
  const jsonExport = auditTrail.export('json');
  assert_true(jsonExport.includes('TEST_ACTION'), 'JSON export should contain action');

  // Test: Export to CSV
  const csvExport = auditTrail.export('csv');
  assert_true(csvExport.includes('TEST_ACTION'), 'CSV export should contain action');
  assert_true(csvExport.includes('test_actor'), 'CSV export should contain actor');
}

// ============================================================================
// Literature Review Agent Tests
// ============================================================================

async function test_literature_review_agent() {
  console.log('\n[LITERATURE REVIEW AGENT TESTS]');
  console.log('================================\n');

  const auditTrail = new AuditTrail();
  const agent = new LiteratureReviewAgent({ auditTrail });

  // Test: Search literature
  const results = await agent.searchLiterature('BRAF inhibitor melanoma');

  assert_true(Array.isArray(results), 'Results should be array');
  assert_true(results.length > 0, 'Should return results');
  assert_exists(results[0].title, 'Results should have title');
  assert_exists(results[0].doi, 'Results should have DOI');
  assert_true(results[0].relevance > 0, 'Results should have relevance score');

  // Test: Summarize literature
  const summary = await agent.summarizeLiterature(results);

  assert_equal(summary.totalResults, results.length, 'Summary should count results');
  assert_true(summary.summary.length > 0, 'Summary should have text');
  assert_true(Array.isArray(summary.keyFindings), 'Summary should have key findings');
  assert_true(Array.isArray(summary.recommendations), 'Summary should have recommendations');

  // Test: Agent state
  const state = agent.getState();
  assert_equal(state.agent, 'literature-review-agent', 'State should have agent name');
  assert_equal(state.state, 'idle', 'State should be idle after search');

  // Test: Audit trail recorded
  assert_true(auditTrail.records.length > 0, 'Audit trail should record searches');
}

// ============================================================================
// Protocol Analysis Agent Tests
// ============================================================================

async function test_protocol_analysis_agent() {
  console.log('\n[PROTOCOL ANALYSIS AGENT TESTS]');
  console.log('================================\n');

  const auditTrail = new AuditTrail();
  const agent = new ProtocolAnalysisAgent({ auditTrail });

  const protocolText = `
    PROTOCOL: Phase II Study
    PRIMARY OBJECTIVE: Evaluate efficacy
    SECONDARY OBJECTIVES: Safety
    INCLUSION CRITERIA: Age 18+
    SAMPLE SIZE: 100 patients
  `;

  // Test: Analyze protocol
  const analysis = await agent.analyzeProtocol(protocolText);

  assert_exists(analysis.protocolId, 'Analysis should have protocol ID');
  assert_exists(analysis.status, 'Analysis should have status');
  assert_exists(analysis.sections, 'Analysis should have sections');
  assert_exists(analysis.complianceChecks, 'Analysis should have compliance checks');

  // Test: Compliance checks
  assert_exists(analysis.complianceChecks.fdaCFRPart11, 'Should check FDA compliance');
  assert_exists(analysis.complianceChecks.ichGcp, 'Should check ICH-GCP compliance');

  // Test: Recommendations
  assert_true(Array.isArray(analysis.recommendations), 'Should have recommendations');

  // Test: Sample size validation
  assert_exists(analysis.sections.sampleSize, 'Should analyze sample size');
  assert_true(
    analysis.sections.sampleSize.reported <= analysis.sections.sampleSize.calculated,
    'Calculated N should be >= reported N'
  );

  // Test: Audit trail recorded
  assert_true(auditTrail.records.length > 0, 'Audit trail should record analysis');
}

// ============================================================================
// Data Validation Agent Tests
// ============================================================================

async function test_data_validation_agent() {
  console.log('\n[DATA VALIDATION AGENT TESTS]');
  console.log('=============================\n');

  const auditTrail = new AuditTrail();
  const agent = new DataValidationAgent({ auditTrail });

  const testData = [
    {
      id: 'PT001',
      age: 65,
      labs: { hemoglobin: 12.5, creatinine: 0.9 },
      visitDate: new Date().toISOString(),
      diagnosis: 'Melanoma',
      performanceStatus: 1,
    },
    {
      id: 'PT002',
      age: 45,
      labs: { hemoglobin: 13.8, creatinine: 0.85 },
      visitDate: new Date().toISOString(),
      diagnosis: 'Melanoma',
      performanceStatus: 0,
    },
  ];

  // Test: Validate data
  const results = await agent.validateData(testData);

  assert_equal(results.totalRecords, 2, 'Should validate all records');
  assert_true(results.passedRecords > 0, 'Should pass valid records');
  assert_exists(results.summary, 'Should have validation summary');

  // Test: Validation rules
  assert_true(agent.validateAge(65), 'Should validate age 65');
  assert_true(!agent.validateAge(10), 'Should reject age 10');

  // Test: Lab value validation
  assert_true(agent.validateLabValues({ hemoglobin: 12.5 }), 'Should validate normal hemoglobin');
  assert_true(!agent.validateLabValues({ hemoglobin: 25 }), 'Should reject high hemoglobin');

  // Test: Audit trail recorded
  assert_true(auditTrail.records.length > 0, 'Audit trail should record validation');
}

// ============================================================================
// Adverse Event Agent Tests
// ============================================================================

async function test_adverse_event_agent() {
  console.log('\n[ADVERSE EVENT AGENT TESTS]');
  console.log('===========================\n');

  const auditTrail = new AuditTrail();
  const agent = new AdverseEventAgent({ auditTrail });

  // Test: Report non-serious event
  const nonSaeEvent = {
    type: 'Rash',
    severity: 2,
    causality: 'possible',
    description: 'Mild rash on forearms',
  };

  const report1 = await agent.reportAdverseEvent(nonSaeEvent);

  assert_exists(report1.id, 'Report should have ID');
  assert_equal(report1.status, 'reported', 'Report should be marked reported');
  assert_equal(report1.escalated, false, 'Mild event should not escalate');

  // Test: Report serious event
  const saeEvent = {
    type: 'Hospitalization',
    severity: 4,
    causality: 'probable',
    description: 'Hospitalized for fever',
    hospitalization: true,
  };

  const report2 = await agent.reportAdverseEvent(saeEvent);

  assert_equal(report2.escalated, true, 'Serious event should escalate');

  // Test: Generate safety report
  const safetyReport = await agent.generateSafetyReport();

  assert_exists(safetyReport.reportId, 'Safety report should have ID');
  assert_true(safetyReport.totalEvents >= 2, 'Should track all events');
  assert_true(safetyReport.seriousAdverseEvents >= 1, 'Should count SAEs');
  assert_exists(safetyReport.safetyProfile, 'Should assess safety profile');

  // Test: Safety profile assessment
  assert_true(['expected', 'notable', 'concerning'].includes(safetyReport.safetyProfile),
    'Safety profile should be expected, notable, or concerning');

  // Test: Audit trail recorded
  assert_true(auditTrail.records.length >= 2, 'Audit trail should record each AE');
}

// ============================================================================
// Statistical Analysis Agent Tests
// ============================================================================

async function test_statistical_analysis_agent() {
  console.log('\n[STATISTICAL ANALYSIS AGENT TESTS]');
  console.log('===================================\n');

  const auditTrail = new AuditTrail();
  const agent = new StatisticalAnalysisAgent({ auditTrail });

  const testData = Array.from({ length: 30 }, (_, i) => ({
    id: `pt_${i}`,
    value: 50 + Math.random() * 20, // Values 50-70
  }));

  // Test: Analyze data
  const analysis = await agent.analyzeData(testData, { type: 'ttest' });

  assert_exists(analysis.analysisId, 'Analysis should have ID');
  assert_exists(analysis.descriptiveStatistics, 'Should have descriptive stats');
  assert_exists(analysis.inferentialStatistics, 'Should have inferential stats');

  // Test: Descriptive statistics
  const desc = analysis.descriptiveStatistics;
  assert_equal(desc.n, 30, 'N should match input');
  assert_true(parseFloat(desc.mean) > 0, 'Mean should be positive');
  assert_true(parseFloat(desc.std) > 0, 'Std should be positive');
  assert_true(parseFloat(desc.q1) <= parseFloat(desc.q3), 'Q1 should be <= Q3');

  // Test: Inferential statistics
  const inf = analysis.inferentialStatistics;
  assert_equal(inf.testType, 'ttest', 'Should have test type');
  assert_true(parseFloat(inf.pValue) >= 0 && parseFloat(inf.pValue) <= 1, 'P-value should be 0-1');
  assert_exists(inf.ci95, '95% CI should exist');
  assert_true(inf.statisticalPower >= 0 && inf.statisticalPower <= 1, 'Power should be 0-1');

  // Test: Conclusions
  assert_exists(analysis.conclusions, 'Should have conclusions');
  assert_true(analysis.conclusions.primary.length > 0, 'Should have primary conclusion');

  // Test: Assumptions
  assert_exists(analysis.assumptions, 'Should assess assumptions');

  // Test: Audit trail recorded
  assert_true(auditTrail.records.length > 0, 'Audit trail should record analysis');
}

// ============================================================================
// Clinical Research Assistant Orchestrator Tests
// ============================================================================

async function test_clinical_research_assistant() {
  console.log('\n[CLINICAL RESEARCH ASSISTANT TESTS]');
  console.log('====================================\n');

  const assistant = new ClinicalResearchAssistant({
    projectName: 'Test Trial',
    trialPhase: 'Phase II',
  });

  // Test: Literature review
  const litReview = await assistant.conductLiteratureReview('BRAF inhibitor');
  assert_true(Array.isArray(litReview.results), 'Should return literature results');
  assert_exists(litReview.summary, 'Should return summary');

  // Test: Protocol analysis
  const protocolAnalysis = await assistant.analyzeProtocol('PROTOCOL: Test');
  assert_exists(protocolAnalysis.status, 'Should analyze protocol');

  // Test: Data validation
  const dataValidation = await assistant.validateClinicalData([
    {
      id: 'PT001',
      age: 60,
      performanceStatus: 1,
      diagnosis: 'Test',
      labs: { hemoglobin: 12.5 },
      visitDate: new Date().toISOString(),
    },
  ]);
  assert_true(dataValidation.passedRecords >= 0, 'Should validate data');

  // Test: Adverse event tracking
  const aeReport = await assistant.trackAdverseEvent({
    type: 'Test AE',
    severity: 1,
    causality: 'possible',
  });
  assert_exists(aeReport.id, 'Should create AE report');

  // Test: Statistical analysis
  const statsAnalysis = await assistant.performStatisticalAnalysis(
    Array.from({ length: 20 }, (_, i) => ({ value: 50 + i })),
    { type: 'ttest' }
  );
  assert_exists(statsAnalysis.analysisId, 'Should perform statistics');

  // Test: Compliance report
  const complianceReport = await assistant.generateComplianceReport();
  assert_exists(complianceReport.reportId, 'Should generate compliance report');
  assert_equal(complianceReport.projectName, 'Test Trial', 'Should have project name');

  // Test: Event listeners
  let eventFired = false;
  assistant.on('log', () => {
    eventFired = true;
  });

  // Trigger an event
  assistant.emit('log', { level: 'INFO', message: 'test' });
  assert_true(eventFired, 'Should fire events');
}

// ============================================================================
// Integration Tests
// ============================================================================

async function test_complete_workflow() {
  console.log('\n[COMPLETE WORKFLOW TESTS]');
  console.log('=========================\n');

  const assistant = new ClinicalResearchAssistant({
    projectName: 'Integration Test Trial',
    trialPhase: 'Phase II',
  });

  const trialData = {
    researchQuestion: 'Test efficacy',
    protocolText: 'PROTOCOL: Integration Test',
    patientData: [
      {
        id: 'PT001',
        age: 65,
        performanceStatus: 1,
        diagnosis: 'Test Disease',
        labs: { hemoglobin: 12.5, creatinine: 0.9, ast: 30, alt: 25 },
        visitDate: new Date().toISOString(),
      },
    ],
    adverseEvents: [
      {
        type: 'Test AE',
        severity: 2,
        causality: 'possible',
        description: 'Test event',
      },
    ],
    analysisData: Array.from({ length: 10 }, (_, i) => ({
      id: `pt_${i}`,
      value: 50 + i,
    })),
  };

  try {
    const results = await assistant.runCompleteTrialWorkflow(trialData);

    assert_exists(results.literatureReview, 'Should complete literature review');
    assert_exists(results.protocolAnalysis, 'Should complete protocol analysis');
    assert_exists(results.dataValidation, 'Should complete data validation');
    assert_exists(results.safetyReport, 'Should generate safety report');
    assert_exists(results.statsAnalysis, 'Should generate stats analysis');
    assert_exists(results.complianceReport, 'Should generate compliance report');
    assert_exists(results.auditTrail, 'Should export audit trail');

    console.log(`  ✓ Workflow completed successfully`);
    passedTests++;
  } catch (error) {
    console.error(`  ✗ Workflow failed: ${error.message}`);
    failedTests++;
  }
}

// ============================================================================
// FDA Compliance Tests
// ============================================================================

function test_fda_compliance() {
  console.log('\n[FDA 21 CFR PART 11 COMPLIANCE TESTS]');
  console.log('=====================================\n');

  const auditTrail = new AuditTrail();

  // Test 1: Electronic Records with Signatures
  const record1 = auditTrail.recordAction('ACTION_1', 'user_1', { data: 'test' });
  assert_exists(record1.signature, 'Records must have electronic signatures');
  assert_true(auditTrail.verify(record1), 'Signatures must be verifiable');

  // Test 2: Audit Trail with Timestamps
  const record2 = auditTrail.recordAction('ACTION_2', 'user_2', { data: 'test2' });
  assert_true(record2.timestamp > record1.timestamp, 'Records must have precise timestamps');

  // Test 3: Non-repudiation
  const record3 = auditTrail.recordAction('ACTION_3', 'user_3', { data: 'test3' });
  assert_equal(record3.actor, 'user_3', 'Records must identify the actor (non-repudiation)');

  // Test 4: Data Integrity Protection
  const testRecord = auditTrail.recordAction('TEST_INTEGRITY', 'tester', { value: 100 });
  const originalSig = testRecord.signature;
  testRecord.details.value = 200;
  const newSig = auditTrail.sign(testRecord);
  assert_true(originalSig !== newSig, 'Changes must be detectable');

  // Test 5: Multiple Audit Records
  const initialCount = auditTrail.records.length;
  auditTrail.recordAction('ACTION_4', 'user_4', { data: 'test4' });
  auditTrail.recordAction('ACTION_5', 'user_5', { data: 'test5' });
  assert_equal(
    auditTrail.records.length,
    initialCount + 2,
    'All actions must be recorded in audit trail'
  );

  // Test 6: Export Formats
  const jsonExport = auditTrail.export('json');
  const csvExport = auditTrail.export('csv');
  assert_true(jsonExport.length > 0, 'JSON export must be available');
  assert_true(csvExport.length > 0, 'CSV export must be available');
}

// ============================================================================
// Run All Tests
// ============================================================================

async function runAllTests() {
  console.log('\n' + '='.repeat(70));
  console.log('CLINICAL RESEARCH ASSISTANT - TEST SUITE');
  console.log('='.repeat(70));

  try {
    // Synchronous tests
    test_audit_trail();
    test_fda_compliance();

    // Asynchronous tests
    await test_literature_review_agent();
    await test_protocol_analysis_agent();
    await test_data_validation_agent();
    await test_adverse_event_agent();
    await test_statistical_analysis_agent();
    await test_clinical_research_assistant();
    await test_complete_workflow();

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('TEST SUMMARY');
    console.log('='.repeat(70));
    console.log(`Total Tests: ${passedTests + failedTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
    console.log('='.repeat(70) + '\n');

    return failedTests === 0;
  } catch (error) {
    console.error('\nFatal test error:', error);
    return false;
  }
}

// Run tests if executed directly
if (require.main === module) {
  runAllTests()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((err) => {
      console.error('Test runner error:', err);
      process.exit(1);
    });
}

module.exports = runAllTests;
