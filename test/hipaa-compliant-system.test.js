#!/usr/bin/env node

/**
 * hipaa-compliant-system.test.js
 *
 * Test suite for HipaaCompliantSystem.
 *
 * Tests cover:
 *   - PHI encryption/decryption
 *   - Data classification
 *   - Audit logging
 *   - De-identification methods
 *   - Session management
 *   - Breach reporting
 *   - Compliance checks
 *   - Key rotation
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const os = require('os');
const {
  System: HipaaCompliantSystem,
  createTestSystem,
  COMPLIANCE_MODES,
  PHI_CLASSIFICATION_TYPES,
  BREACH_SEVERITY
} = require('../lib/hipaa-compliant-system');

// Test utilities
let testCount = 0;
let passCount = 0;
let failCount = 0;

function test(name, fn) {
  testCount++;
  try {
    fn();
    passCount++;
    console.log(`✓ ${name}`);
  } catch (err) {
    failCount++;
    console.log(`✗ ${name}`);
    console.log(`  ${err.message}`);
  }
}

function expect(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function expectTrue(value, message) {
  if (!value) {
    throw new Error(message || `Expected true, got ${value}`);
  }
}

function expectFalse(value, message) {
  if (value) {
    throw new Error(message || `Expected false, got ${value}`);
  }
}

function expectThrows(fn, message) {
  try {
    fn();
    throw new Error(message || 'Expected function to throw');
  } catch (err) {
    if (err.message.includes('Expected function to throw')) {
      throw err;
    }
    // Expected
  }
}

// ============ Test Suite ============

console.log('HIPAA-Compliant System Test Suite\n');

// Test 1: System Initialization
console.log('=== System Initialization ===');

test('Create system with valid configuration', () => {
  const tempDir = path.join(os.tmpdir(), `hipaa-test-${Date.now()}`);
  const system = createTestSystem(tempDir);
  expectTrue(system !== null);
});

test('System requires encryptionKeyPath', () => {
  expectThrows(() => {
    new HipaaCompliantSystem({ auditLogPath: '/tmp/audit.log' });
  });
});

test('System requires auditLogPath', () => {
  expectThrows(() => {
    new HipaaCompliantSystem({ encryptionKeyPath: '/tmp/key.json' });
  });
});

test('Master key is generated on first init', () => {
  const tempDir = path.join(os.tmpdir(), `hipaa-test-${Date.now()}`);
  const keyPath = path.join(tempDir, 'key.json');
  const auditPath = path.join(tempDir, 'audit.log');

  const system = new HipaaCompliantSystem({
    encryptionKeyPath: keyPath,
    auditLogPath: auditPath,
    baaVerified: false
  });

  expectTrue(fs.existsSync(keyPath), 'Key file should be created');
  expectTrue(system.masterKey !== null, 'Master key should be loaded');

  // Cleanup
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('Master key is loaded from existing file', () => {
  const tempDir = path.join(os.tmpdir(), `hipaa-test-${Date.now()}`);
  const keyPath = path.join(tempDir, 'key.json');
  const auditPath = path.join(tempDir, 'audit.log');

  // Create first system
  const system1 = new HipaaCompliantSystem({
    encryptionKeyPath: keyPath,
    auditLogPath: auditPath,
    baaVerified: false
  });
  const key1 = system1.masterKey.toString('hex');

  // Create second system with same paths
  const system2 = new HipaaCompliantSystem({
    encryptionKeyPath: keyPath,
    auditLogPath: auditPath,
    baaVerified: false
  });
  const key2 = system2.masterKey.toString('hex');

  expect(key1, key2, 'Master keys should match');

  // Cleanup
  fs.rmSync(tempDir, { recursive: true, force: true });
});

// Test 2: PHI Encryption
console.log('\n=== PHI Encryption ===');

test('Encrypt PHI returns encrypted object', () => {
  const system = createTestSystem(path.join(os.tmpdir(), `hipaa-test-${Date.now()}`));
  const data = { name: 'John Doe', ssn: '123-45-6789' };

  const encrypted = system.encryptPHI(data);

  expectTrue(encrypted.encrypted, 'Should be marked as encrypted');
  expectTrue(encrypted.ciphertext, 'Should have ciphertext');
  expectTrue(encrypted.iv, 'Should have IV');
  expectTrue(encrypted.authTag, 'Should have auth tag');
});

test('Encrypted data is different from plaintext', () => {
  const system = createTestSystem(path.join(os.tmpdir(), `hipaa-test-${Date.now()}`));
  const data = JSON.stringify({ name: 'John Doe', ssn: '123-45-6789' });

  const encrypted = system.encryptPHI(data);

  expectTrue(encrypted.ciphertext !== data, 'Ciphertext should differ from plaintext');
});

test('Decrypt PHI returns original data', () => {
  const system = createTestSystem(path.join(os.tmpdir(), `hipaa-test-${Date.now()}`));
  const originalData = { name: 'Jane Smith', ssn: '987-65-4321', age: 45 };

  const encrypted = system.encryptPHI(originalData);
  const decrypted = system.decryptPHI(encrypted, { sessionId: null });

  expect(decrypted.name, originalData.name, 'Name should match');
  expect(decrypted.ssn, originalData.ssn, 'SSN should match');
  expect(decrypted.age, originalData.age, 'Age should match');
});

test('Decryption fails with invalid authTag', () => {
  const system = createTestSystem(path.join(os.tmpdir(), `hipaa-test-${Date.now()}`));
  const data = { name: 'John Doe', ssn: '123-45-6789' };

  const encrypted = system.encryptPHI(data);
  encrypted.authTag = '0'.repeat(32); // Invalid tag

  expectThrows(() => {
    system.decryptPHI(encrypted, { sessionId: null });
  });
});

test('Can disable encryption in config', () => {
  const tempDir = path.join(os.tmpdir(), `hipaa-test-${Date.now()}`);
  const system = new HipaaCompliantSystem({
    encryptionKeyPath: path.join(tempDir, 'key.json'),
    auditLogPath: path.join(tempDir, 'audit.log'),
    enableEncryption: false,
    baaVerified: false
  });

  const data = { test: 'data' };
  const result = system.encryptPHI(data);

  expectFalse(result.encrypted, 'Should not be encrypted when disabled');
  expect(result.ciphertext, data, 'Should return original data');

  fs.rmSync(tempDir, { recursive: true, force: true });
});

// Test 3: Data Classification
console.log('\n=== Data Classification ===');

test('Classifies SSN as DIRECT identifier', () => {
  const system = createTestSystem(path.join(os.tmpdir(), `hipaa-test-${Date.now()}`));
  const data = 'SSN: 123-45-6789';

  const classification = system._classifyPHI(data);

  expect(classification.classification, PHI_CLASSIFICATION_TYPES.DIRECT);
});

test('Classifies age as QUASI identifier', () => {
  const system = createTestSystem(path.join(os.tmpdir(), `hipaa-test-${Date.now()}`));
  const data = 'Patient age: 45';

  const classification = system._classifyPHI(data);

  expect(classification.classification, PHI_CLASSIFICATION_TYPES.QUASI);
});

test('Classifies medical conditions as SENSITIVE', () => {
  const system = createTestSystem(path.join(os.tmpdir(), `hipaa-test-${Date.now()}`));
  const data = 'Patient diagnosed with cancer';

  const classification = system._classifyPHI(data);

  expect(classification.classification, PHI_CLASSIFICATION_TYPES.SENSITIVE);
});

// Test 4: De-identification
console.log('\n=== De-identification ===');

test('Generalization replaces SSN', () => {
  const system = createTestSystem(path.join(os.tmpdir(), `hipaa-test-${Date.now()}`));
  const data = 'SSN: 123-45-6789';

  const deidentified = system.deidentify(data, 'generalization');

  expectFalse(deidentified.includes('123-45-6789'), 'SSN should be replaced');
  expectTrue(deidentified.includes('XXX-XX-XXXX'), 'Should have mask');
});

test('Generalization generalizes dates to year', () => {
  const system = createTestSystem(path.join(os.tmpdir(), `hipaa-test-${Date.now()}`));
  const data = 'Visit date: 06/15/2024';

  const deidentified = system.deidentify(data, 'generalization');

  expectFalse(deidentified.includes('06/15/2024'), 'Full date should be replaced');
  expectTrue(deidentified.includes('2024'), 'Year should remain');
});

test('Suppression replaces identifiers with markers', () => {
  const system = createTestSystem(path.join(os.tmpdir(), `hipaa-test-${Date.now()}`));
  const data = 'John Smith SSN: 123-45-6789';

  const deidentified = system.deidentify(data, 'suppression');

  expectTrue(deidentified.includes('[SUPPRESSED_SSN]'), 'Should have suppression marker');
});

test('Safe Harbor removes HIPAA identifiers', () => {
  const system = createTestSystem(path.join(os.tmpdir(), `hipaa-test-${Date.now()}`));
  const data = 'Patient: john.doe@example.com, SSN: 123-45-6789, ZIP: 12345';

  const deidentified = system.deidentify(data, 'safe_harbor');

  expectFalse(deidentified.includes('john.doe@example.com'), 'Email should be removed');
  expectFalse(deidentified.includes('123-45-6789'), 'SSN should be removed');
  expectFalse(deidentified.includes('12345'), 'ZIP should be removed');
});

test('Invalid de-identification method throws error', () => {
  const system = createTestSystem(path.join(os.tmpdir(), `hipaa-test-${Date.now()}`));

  expectThrows(() => {
    system.deidentify('test data', 'invalid_method');
  });
});

// Test 5: Session Management
console.log('\n=== Session Management ===');

test('Create session generates sessionId', () => {
  const tempDir = path.join(os.tmpdir(), `hipaa-test-${Date.now()}`);
  const system = new HipaaCompliantSystem({
    encryptionKeyPath: path.join(tempDir, 'key.json'),
    auditLogPath: path.join(tempDir, 'audit.log'),
    baaVerified: true
  });
  const session = system.createSession('user123');

  expectTrue(session.sessionId, 'Session should have ID');
  expectTrue(session.sessionId.length === 32, 'Session ID should be 32 chars (hex)');

  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('Session contains user metadata', () => {
  const tempDir = path.join(os.tmpdir(), `hipaa-test-${Date.now()}`);
  const system = new HipaaCompliantSystem({
    encryptionKeyPath: path.join(tempDir, 'key.json'),
    auditLogPath: path.join(tempDir, 'audit.log'),
    baaVerified: true
  });
  const session = system.createSession('dr.smith', {
    ipAddress: '192.168.1.1',
    userAgent: 'TestAgent'
  });

  expect(session.userId, 'dr.smith');
  expect(session.ipAddress, '192.168.1.1');
  expect(session.userAgent, 'TestAgent');

  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('Validate session returns valid session', () => {
  const tempDir = path.join(os.tmpdir(), `hipaa-test-${Date.now()}`);
  const system = new HipaaCompliantSystem({
    encryptionKeyPath: path.join(tempDir, 'key.json'),
    auditLogPath: path.join(tempDir, 'audit.log'),
    baaVerified: true
  });
  const created = system.createSession('user123');

  const validated = system.validateSession(created.sessionId);

  expect(validated.userId, 'user123');

  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('Validate session throws on invalid sessionId', () => {
  const tempDir = path.join(os.tmpdir(), `hipaa-test-${Date.now()}`);
  const system = new HipaaCompliantSystem({
    encryptionKeyPath: path.join(tempDir, 'key.json'),
    auditLogPath: path.join(tempDir, 'audit.log'),
    baaVerified: true
  });

  expectThrows(() => {
    system.validateSession('invalid-session-id');
  });

  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('Sessions expire', () => {
  const tempDir = path.join(os.tmpdir(), `hipaa-test-${Date.now()}`);
  const system = new HipaaCompliantSystem({
    encryptionKeyPath: path.join(tempDir, 'key.json'),
    auditLogPath: path.join(tempDir, 'audit.log'),
    baaVerified: true
  });

  const session = system.createSession('user123');
  expectTrue(new Date(session.expiresAt) > new Date(), 'Session should be valid at creation');

  fs.rmSync(tempDir, { recursive: true, force: true });
});

// Test 6: Audit Logging
console.log('\n=== Audit Logging ===');

test('Audit log file is created', () => {
  const tempDir = path.join(os.tmpdir(), `hipaa-test-${Date.now()}`);
  const auditPath = path.join(tempDir, 'audit.log');

  const system = new HipaaCompliantSystem({
    encryptionKeyPath: path.join(tempDir, 'key.json'),
    auditLogPath: auditPath,
    enableAuditLog: true,
    baaVerified: false
  });

  system._logAuditEvent('test_event', { detail: 'test' });

  expectTrue(fs.existsSync(auditPath), 'Audit log should be created');

  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('Can disable audit logging', () => {
  const tempDir = path.join(os.tmpdir(), `hipaa-test-${Date.now()}`);
  const auditPath = path.join(tempDir, 'audit.log');

  const system = new HipaaCompliantSystem({
    encryptionKeyPath: path.join(tempDir, 'key.json'),
    auditLogPath: auditPath,
    enableAuditLog: false,
    baaVerified: false
  });

  system._logAuditEvent('test_event', { detail: 'test' });

  expectFalse(fs.existsSync(auditPath), 'Audit log should not be created');

  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('Retrieve audit trail for user', () => {
  const tempDir = path.join(os.tmpdir(), `hipaa-test-${Date.now()}`);
  const system = new HipaaCompliantSystem({
    encryptionKeyPath: path.join(tempDir, 'key.json'),
    auditLogPath: path.join(tempDir, 'audit.log'),
    enableAuditLog: true,
    baaVerified: false
  });

  system._logAuditEvent('event1', { userId: 'user1' });
  system._logAuditEvent('event2', { userId: 'user2' });
  system._logAuditEvent('event3', { userId: 'user1' });

  const trail = system.getAuditTrail('user1');

  expectTrue(trail.length >= 2, 'Should have at least 2 entries for user1');

  fs.rmSync(tempDir, { recursive: true, force: true });
});

// Test 7: Breach Reporting
console.log('\n=== Breach Reporting ===');

test('Report breach creates breach record', () => {
  const system = createTestSystem(path.join(os.tmpdir(), `hipaa-test-${Date.now()}`));

  const breach = system.reportBreach({
    severity: BREACH_SEVERITY.HIGH,
    estimatedCount: 100,
    description: 'Unauthorized access'
  });

  expectTrue(breach.id, 'Breach should have ID');
  expect(breach.severity, BREACH_SEVERITY.HIGH);
  expect(breach.estimatedCount, 100);
});

test('Retrieve breach log', () => {
  const system = createTestSystem(path.join(os.tmpdir(), `hipaa-test-${Date.now()}`));

  system.reportBreach({ estimatedCount: 50 });
  system.reportBreach({ estimatedCount: 100 });

  const breaches = system.getBreachLog();

  expectTrue(breaches.length === 2, 'Should have 2 breaches');
});

// Test 8: Compliance Checks
console.log('\n=== Compliance Checks ===');

test('Run compliance check returns results', () => {
  const system = createTestSystem(path.join(os.tmpdir(), `hipaa-test-${Date.now()}`));

  const check = system.runComplianceCheck();

  expectTrue(check.results, 'Should have results');
  expectTrue(check.overallStatus, 'Should have overall status');
  expectTrue(check.criticalFailures !== undefined, 'Should count critical failures');
});

test('BAA verified check reflects configuration', () => {
  const tempDir1 = path.join(os.tmpdir(), `hipaa-test-${Date.now()}`);
  const system1 = new HipaaCompliantSystem({
    encryptionKeyPath: path.join(tempDir1, 'key.json'),
    auditLogPath: path.join(tempDir1, 'audit.log'),
    baaVerified: true,
    baaVerified: false
  });

  const check1 = system1.runComplianceCheck();
  expectFalse(check1.results.baaVerified.passed, 'Should fail when BAA not verified');

  fs.rmSync(tempDir1, { recursive: true, force: true });
});

// Test 9: Key Rotation
console.log('\n=== Key Rotation ===');

test('Rotate encryption key succeeds', () => {
  const tempDir = path.join(os.tmpdir(), `hipaa-test-${Date.now()}`);
  const system = new HipaaCompliantSystem({
    encryptionKeyPath: path.join(tempDir, 'key.json'),
    auditLogPath: path.join(tempDir, 'audit.log'),
    baaVerified: false
  });

  const oldVersion = system.keyMetadata.version || 1;
  const result = system.rotateEncryptionKey();

  expectTrue(result.success, 'Rotation should succeed');
  expect(result.newVersion, oldVersion + 1);

  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('Key rotation creates audit log entry', () => {
  const tempDir = path.join(os.tmpdir(), `hipaa-test-${Date.now()}`);
  const system = new HipaaCompliantSystem({
    encryptionKeyPath: path.join(tempDir, 'key.json'),
    auditLogPath: path.join(tempDir, 'audit.log'),
    enableAuditLog: true,
    baaVerified: false
  });

  system.rotateEncryptionKey();

  const trail = system.getAuditTrail('system');
  const rotationEvent = trail.find(e => e.eventType === 'key_rotated');

  expectTrue(rotationEvent !== undefined, 'Should have key_rotated event');

  fs.rmSync(tempDir, { recursive: true, force: true });
});

// Test 10: Compliance Report
console.log('\n=== Compliance Report ===');

test('Generate compliance report', () => {
  const system = createTestSystem(path.join(os.tmpdir(), `hipaa-test-${Date.now()}`));

  const report = system.generateComplianceReport({
    organizationName: 'Test Hospital'
  });

  expect(report.organizationName, 'Test Hospital');
  expectTrue(report.complianceCheck, 'Should include compliance check');
  expectTrue(report.recommendations !== undefined, 'Should include recommendations');
});

test('Report includes encryption status', () => {
  const system = createTestSystem(path.join(os.tmpdir(), `hipaa-test-${Date.now()}`));

  const report = system.generateComplianceReport();

  expectTrue(report.encryptionStatus.enabled, 'Encryption should be enabled');
  expectTrue(report.encryptionStatus.algorithm, 'Should specify algorithm');
});

// Test 11: Strict Compliance Mode
console.log('\n=== Strict Compliance Mode ===');

test('Strict mode requires session for decryption', () => {
  const tempDir = path.join(os.tmpdir(), `hipaa-test-${Date.now()}`);
  const system = new HipaaCompliantSystem({
    encryptionKeyPath: path.join(tempDir, 'key.json'),
    auditLogPath: path.join(tempDir, 'audit.log'),
    complianceMode: COMPLIANCE_MODES.STRICT,
    baaVerified: false
  });

  const encrypted = system.encryptPHI({ test: 'data' });

  expectThrows(() => {
    system.decryptPHI(encrypted, {}); // No session
  });

  fs.rmSync(tempDir, { recursive: true, force: true });
});

// Test 12: System Metrics
console.log('\n=== System Metrics ===');

test('Get system metrics', () => {
  const system = createTestSystem(path.join(os.tmpdir(), `hipaa-test-${Date.now()}`));

  const metrics = system.getSystemMetrics();

  expectTrue(metrics.encryption, 'Should have encryption metrics');
  expectTrue(metrics.sessions, 'Should have session metrics');
  expectTrue(metrics.auditLog, 'Should have audit log metrics');
  expectTrue(metrics.breaches, 'Should have breach metrics');
});

// ============ Test Summary ============

console.log('\n' + '='.repeat(50));
console.log(`Test Results: ${passCount}/${testCount} passed`);
if (failCount > 0) {
  console.log(`Failed: ${failCount}`);
  process.exit(1);
} else {
  console.log('All tests passed! ✓');
  process.exit(0);
}
