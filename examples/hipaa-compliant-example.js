#!/usr/bin/env node

/**
 * hipaa-compliant-example.js
 *
 * Example usage of HipaaCompliantSystem for Claudient deployments.
 *
 * Demonstrates:
 *   - System initialization with configuration
 *   - PHI encryption and decryption
 *   - User session management
 *   - Audit trail generation
 *   - De-identification for research
 *   - Breach reporting
 *   - Compliance checks
 *   - Report generation
 */

const path = require('path');
const {
  System: HipaaCompliantSystem,
  COMPLIANCE_MODES,
  PHI_CLASSIFICATION_TYPES,
  BREACH_SEVERITY,
  createSystem,
  generateConfigTemplate
} = require('../lib/hipaa-compliant-system');

// ============ Example 1: System Initialization ============

console.log('=== HIPAA-Compliant System Initialization ===\n');

// Configuration for a healthcare provider using Claudient
const config = {
  encryptionKeyPath: path.join('/tmp/claudient', 'encryption.key'),
  auditLogPath: path.join('/tmp/claudient', 'audit.log'),
  baaVerified: true,
  complianceMode: COMPLIANCE_MODES.STANDARD,
  dataClassification: {
    socialSecurityNumber: PHI_CLASSIFICATION_TYPES.DIRECT,
    medicalRecordNumber: PHI_CLASSIFICATION_TYPES.DIRECT,
    patientName: PHI_CLASSIFICATION_TYPES.DIRECT,
    dateOfBirth: PHI_CLASSIFICATION_TYPES.QUASI,
    zipCode: PHI_CLASSIFICATION_TYPES.QUASI,
    diagnosis: PHI_CLASSIFICATION_TYPES.SENSITIVE,
    treatment: PHI_CLASSIFICATION_TYPES.SENSITIVE,
    medication: PHI_CLASSIFICATION_TYPES.SENSITIVE,
    allergies: PHI_CLASSIFICATION_TYPES.SENSITIVE
  },
  retentionDays: 2555, // 7 years per HIPAA
  keyRotationDays: 90,
  enableEncryption: true,
  enableAuditLog: true
};

// Create system instance
const system = createSystem(config);

// Listen for events
system.on('initialized', (info) => {
  console.log('✓ System initialized');
  console.log(`  Mode: ${info.complianceMode}`);
  console.log(`  BAA Verified: ${info.baaVerified}\n`);
});

system.on('key_rotated', (event) => {
  console.log(`✓ Encryption key rotated`);
  console.log(`  Version: ${event.oldVersion} → ${event.newVersion}\n`);
});

system.on('breach', (breach) => {
  console.log(`⚠ Breach reported: ${breach.id}`);
  console.log(`  Severity: ${breach.severity}`);
  console.log(`  Affected: ${breach.estimatedCount} records\n`);
});

// ============ Example 2: PHI Encryption ============

console.log('=== PHI Encryption and Decryption ===\n');

const patientData = {
  name: 'John Smith',
  ssn: '123-45-6789',
  mrn: 'MRN-2024-001',
  dateOfBirth: '06/15/1980',
  diagnosis: 'Type 2 Diabetes',
  medications: ['Metformin', 'Lisinopril'],
  allergies: ['Penicillin'],
  visitDate: '06/22/2026'
};

console.log('Original patient data:');
console.log(JSON.stringify(patientData, null, 2));

// Encrypt PHI
const encrypted = system.encryptPHI(patientData, {
  tags: ['patient_record', 'sensitive']
});

console.log('\nEncrypted PHI:');
console.log(`  Algorithm: ${encrypted.algorithm}`);
console.log(`  Encrypted: ${encrypted.encrypted}`);
console.log(`  Key Version: ${encrypted.keyVersion}`);
console.log(`  Classification: ${encrypted.metadata.classification}`);
console.log(`  Data Hash: ${encrypted.metadata.dataHash}`);

// Create authenticated session
const session = system.createSession('dr.jane.doe', {
  ipAddress: '192.168.1.100',
  userAgent: 'Claudient/1.0',
  permissions: ['read_phi', 'write_audit']
});

console.log(`\n✓ Session created: ${session.sessionId}`);

// Decrypt PHI with session context
const decrypted = system.decryptPHI(encrypted, {
  sessionId: session.sessionId,
  userId: 'dr.jane.doe'
});

console.log('\nDecrypted PHI:');
console.log(JSON.stringify(decrypted, null, 2));

// ============ Example 3: Audit Trail ============

console.log('\n=== Audit Trail ===\n');

const auditTrail = system.getAuditTrail('dr.jane.doe', {
  limit: 10
});

if (auditTrail.length > 0) {
  console.log(`Found ${auditTrail.length} audit entries:`);
  auditTrail.forEach((entry, index) => {
    console.log(`  ${index + 1}. ${entry.eventType} (${entry.outcome})`);
    console.log(`     Time: ${entry.timestamp}`);
  });
} else {
  console.log('No audit entries found.');
}

// ============ Example 4: De-identification for Research ============

console.log('\n=== De-identification for Research ===\n');

const researchData = JSON.stringify({
  patient: {
    name: 'Jane Doe',
    ssn: '987-65-4321',
    age: 47,
    zipCode: '94105',
    diagnosis: 'Breast Cancer, Stage 2',
    dateOfDiagnosis: '03/15/2024'
  }
});

console.log('Original research data:');
console.log(researchData);

// Apply de-identification methods
const methods = ['generalization', 'suppression', 'safe_harbor'];

methods.forEach(method => {
  console.log(`\n${method.toUpperCase()} Method:`);
  try {
    const deidentified = system.deidentify(researchData, method);
    console.log(deidentified);
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
});

// ============ Example 5: Compliance Checks ============

console.log('\n=== Compliance Checks ===\n');

const complianceCheck = system.runComplianceCheck();

console.log(`Overall Status: ${complianceCheck.overallStatus}`);
console.log(`Critical Failures: ${complianceCheck.criticalFailures}`);
console.log(`High Failures: ${complianceCheck.highFailures}\n`);

console.log('Check Results:');
Object.entries(complianceCheck.results).forEach(([key, result]) => {
  const status = result.passed ? '✓' : '✗';
  console.log(`  ${status} ${key}`);
  console.log(`     ${result.message}`);
});

// ============ Example 6: Breach Reporting ============

console.log('\n=== Breach Reporting ===\n');

const breach = system.reportBreach({
  discoveredAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  severity: BREACH_SEVERITY.HIGH,
  phiAffected: ['ssn', 'dateOfBirth', 'diagnosis'],
  estimatedCount: 50,
  description: 'Unauthorized access to patient database detected',
  cause: 'Compromised credentials',
  systemsAffected: ['ehr_db', 'backup_server'],
  containmentActions: [
    'System access revoked',
    'Database backup isolated',
    'Affected users notified'
  ]
});

console.log(`✓ Breach reported with ID: ${breach.id}`);
console.log(`  Severity: ${breach.severity}`);
console.log(`  Discovered: ${breach.discoveredAt}`);
console.log(`  Estimated PHI records: ${breach.estimatedCount}`);

// ============ Example 7: Key Rotation ============

console.log('\n=== Key Rotation ===\n');

try {
  const rotationResult = system.rotateEncryptionKey();
  console.log('✓ Key rotation completed successfully');
  console.log(`  Old Version: ${rotationResult.oldVersion}`);
  console.log(`  New Version: ${rotationResult.newVersion}`);
  console.log(`  Rotated At: ${rotationResult.rotatedAt}`);
} catch (err) {
  console.log(`✗ Key rotation failed: ${err.message}`);
}

// ============ Example 8: Compliance Report ============

console.log('\n=== Compliance Report Generation ===\n');

const complianceReport = system.generateComplianceReport({
  organizationName: 'HealthTech Medical Center',
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  endDate: new Date().toISOString()
});

console.log(`Report Generated: ${complianceReport.generatedAt}`);
console.log(`Organization: ${complianceReport.organizationName}`);
console.log(`Period: ${complianceReport.reportingPeriod.start} to ${complianceReport.reportingPeriod.end}`);
console.log(`\nCompliance Status: ${complianceReport.complianceCheck.overallStatus}`);
console.log(`Breaches Reported: ${complianceReport.breachNotifications}`);
console.log(`Active Sessions: ${complianceReport.sessionManagement.activeSessions}`);
console.log(`Audit Log Entries: ${complianceReport.auditLogEntries}`);

console.log('\nRecommendations:');
if (complianceReport.recommendations.length > 0) {
  complianceReport.recommendations.forEach(rec => {
    console.log(`  [${rec.priority.toUpperCase()}] ${rec.category}`);
    console.log(`    ${rec.message}`);
    console.log(`    Action: ${rec.action}`);
  });
} else {
  console.log('  No recommendations.');
}

// ============ Example 9: System Metrics ============

console.log('\n=== System Metrics ===\n');

const metrics = system.getSystemMetrics();

console.log('Encryption Status:');
console.log(`  Algorithm: ${metrics.encryption.algorithmVersion}`);
console.log(`  Key Version: ${metrics.encryption.keyVersion}`);
console.log(`  Master Key: ${metrics.encryption.masterKeyStatus}`);
console.log(`  Rotation Due: ${metrics.encryption.keyRotationDue}`);

console.log('\nSession Management:');
console.log(`  Total Sessions: ${metrics.sessions.total}`);
console.log(`  Active Sessions: ${metrics.sessions.active}`);

console.log('\nAudit Logging:');
console.log(`  Location: ${metrics.auditLog.location}`);
console.log(`  Exists: ${metrics.auditLog.exists}`);
console.log(`  Retention: ${metrics.auditLog.retention}`);

console.log('\nBreach Management:');
console.log(`  Total Breaches Reported: ${metrics.breaches.total}`);
console.log(`  Active Breaches: ${metrics.breaches.active}`);

// ============ Example 10: Multi-User Access Scenario ============

console.log('\n=== Multi-User Access Scenario ===\n');

// Create sessions for different users
const users = [
  { username: 'dr.smith', role: 'physician', permissions: ['read_phi', 'write_phi'] },
  { username: 'nurse.jones', role: 'nurse', permissions: ['read_phi'] },
  { username: 'admin.lee', role: 'administrator', permissions: ['audit_access', 'key_management'] }
];

const sessions = {};

users.forEach(user => {
  const session = system.createSession(user.username, {
    ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
    userAgent: 'Claudient-Client/1.0',
    permissions: user.permissions
  });

  sessions[user.username] = session;

  console.log(`${user.role} (${user.username})`);
  console.log(`  Session: ${session.sessionId}`);
  console.log(`  Permissions: ${session.permissions.join(', ')}`);
  console.log(`  Expires: ${session.expiresAt}\n`);
});

// Demonstrate access with different permissions
const sensitiveData = {
  diagnosis: 'Stage 2 Cancer',
  treatment: 'Chemotherapy',
  prognosis: 'Favorable'
};

console.log('Access Control Demo:');
console.log('PHI Access Attempt by different users:\n');

Object.entries(sessions).forEach(([username, session]) => {
  console.log(`${username}:`);

  // Check if user has read_phi permission
  if (session.permissions.includes('read_phi')) {
    try {
      const enc = system.encryptPHI(sensitiveData);
      const dec = system.decryptPHI(enc, {
        sessionId: session.sessionId,
        userId: username
      });
      console.log(`  ✓ Can access PHI`);
      console.log(`  Diagnosis: ${dec.diagnosis}`);
    } catch (err) {
      console.log(`  ✗ Access denied: ${err.message}`);
    }
  } else {
    console.log(`  ✗ Lacks read_phi permission`);
  }

  console.log();
});

// ============ Summary ============

console.log('=== Configuration Template ===\n');
const template = generateConfigTemplate();
console.log(JSON.stringify(template, null, 2));

console.log('\n✓ HIPAA-Compliant System Example Complete');
