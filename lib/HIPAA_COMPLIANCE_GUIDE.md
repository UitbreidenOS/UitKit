# HIPAA-Compliant Claudient Deployment Guide

## Overview

The `hipaa-compliant-system.js` module provides enterprise-grade HIPAA compliance for Claudient deployments. It implements core requirements for protected health information (PHI) handling in healthcare environments.

## Features

### 1. PHI Encryption
- **Algorithm**: AES-256-GCM (NIST-approved)
- **Key Management**: Secure key storage and rotation
- **Authentication**: Galois/Counter Mode for integrity verification
- **Per-Record Encryption**: Each PHI entry encrypted independently

### 2. Access Control & Audit Trails
- **Session Management**: User authentication and session tracking
- **Fine-grained Logging**: All PHI access recorded with timestamps
- **Context Tracking**: IP address, user agent, and session IDs logged
- **Audit Trail Retrieval**: Filter and search by user, event type, date range

### 3. Data De-identification
Four methods for removing PHI from data for research use:
- **Generalization**: Replace specific values with ranges/categories
- **Suppression**: Remove direct identifiers entirely
- **Perturbation**: Add noise to numerical values
- **Safe Harbor**: HIPAA standard 18-identifier removal

### 4. Breach Notification
- **Breach Reporting**: Log and track security incidents
- **Severity Levels**: Critical, High, Medium, Low classification
- **Containment Tracking**: Document remediation actions
- **Audit Integration**: Automatic breach event logging

### 5. Business Associate Agreement (BAA)
- **Verification**: System enforces BAA requirement before processing
- **Policy Enforcement**: Operations blocked without BAA verification
- **Documentation**: BAA status included in compliance reports

### 6. Compliance Reporting
- **Automated Checks**: 8-point compliance assessment
- **Report Generation**: Executive summaries with recommendations
- **Metrics**: Encryption, session, audit, and breach statistics
- **Exportable**: JSON format for audit trail documentation

## Installation & Setup

### Prerequisites
- Node.js >= 18
- Secure filesystem (encrypted partition recommended)
- HIPAA-compliant infrastructure

### Basic Setup

```javascript
const HipaaCompliant = require('./lib/hipaa-compliant-system');

const config = {
  encryptionKeyPath: '/secure/path/to/encryption.key',
  auditLogPath: '/secure/path/to/audit.log',
  baaVerified: true,  // Must be true for production
  complianceMode: 'standard',
  dataClassification: {
    socialSecurityNumber: 'direct',
    medicalRecordNumber: 'direct',
    diagnosis: 'sensitive'
  },
  retentionDays: 2555, // 7 years
  keyRotationDays: 90
};

const system = new HipaaCompliant.System(config);
```

### Secure Key Management

**Generate Master Key**:
The system automatically generates a 256-bit master key on first initialization:
```bash
# Key is stored with 0600 permissions
ls -la /secure/path/to/encryption.key
# -rw------- 1 user group 256 Jun 22 10:00 encryption.key
```

**Key Rotation**:
```javascript
const result = system.rotateEncryptionKey();
console.log(`Key v${result.oldVersion} → v${result.newVersion}`);
// Logged automatically to audit trail
```

**Key Storage Best Practices**:
- Store on encrypted filesystem
- Restrict permissions (0600 minimum)
- Backup in secure vault
- Never commit to version control
- Use environment variables for paths in production

## Configuration

### Required Options

| Option | Type | Description |
|--------|------|-------------|
| `encryptionKeyPath` | string | Path to master encryption key file |
| `auditLogPath` | string | Path to audit log file |

### Optional Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baaVerified` | boolean | false | BAA verification status (must be true for production) |
| `complianceMode` | string | 'standard' | Compliance level: 'strict', 'standard', 'basic' |
| `dataClassification` | object | {} | PHI classification rules |
| `retentionDays` | number | 2555 | Audit log retention (7 years default) |
| `keyRotationDays` | number | 90 | Key rotation interval |
| `enableEncryption` | boolean | true | Enable PHI encryption |
| `enableAuditLog` | boolean | true | Enable audit logging |
| `maxBatchSize` | number | 1000 | Max records per batch operation |
| `clockSkewTolerance` | number | 300000 | Session time tolerance (5min default) |

### Compliance Modes

**STRICT** (`'strict'`):
- Session required for all operations
- Mandatory audit logging
- Enhanced validation
- No performance optimization
- Recommended: High-security healthcare networks

**STANDARD** (`'standard'`):
- Session required for PHI access
- Audit logging with filters
- Balanced performance/security
- Recommended: Most healthcare deployments

**BASIC** (`'basic'`):
- Minimal session requirements
- Log-as-available approach
- Maximum performance
- Recommended: Non-PHI or test environments

## Usage Examples

### Encrypting Patient Data

```javascript
const patientRecord = {
  name: 'Jane Smith',
  ssn: '123-45-6789',
  mrn: 'MRN-2024-001',
  diagnosis: 'Type 2 Diabetes',
  treatment: 'Metformin 500mg daily'
};

// Encrypt with classification
const encrypted = system.encryptPHI(patientRecord, {
  tags: ['patient_record', 'sensitive']
});

// Result:
{
  ciphertext: '...',
  iv: '...',
  authTag: '...',
  algorithm: 'aes-256-gcm',
  keyVersion: 1,
  encrypted: true,
  metadata: {
    classification: 'direct',  // Auto-detected
    encryptedAt: '2026-06-22T10:00:00Z',
    dataHash: 'abc123...'
  }
}
```

### Decrypting with Session Context

```javascript
// Create authenticated session
const session = system.createSession('dr.smith', {
  ipAddress: '192.168.1.100',
  userAgent: 'Claudient-Client/1.0',
  permissions: ['read_phi', 'write_audit']
});

// Decrypt with access logging
const decrypted = system.decryptPHI(encrypted, {
  sessionId: session.sessionId,
  userId: 'dr.smith'
});
// Access logged to audit trail automatically
```

### De-identification for Research

```javascript
const researchData = JSON.stringify({
  patient: {
    name: 'John Doe',
    age: 47,
    ssn: '987-65-4321',
    diagnosis: 'Cancer',
    dateOfDiagnosis: '03/15/2024'
  }
});

// Method 1: Generalization (keep some detail)
const generalized = system.deidentify(researchData, 'generalization');
// Result: name removed, age→range, SSN→XXX-XX-XXXX, date→year only

// Method 2: Suppression (remove completely)
const suppressed = system.deidentify(researchData, 'suppression');
// Result: [SUPPRESSED_NAME], [SUPPRESSED_SSN], [SUPPRESSED_MRN]

// Method 3: Safe Harbor (HIPAA standard)
const safeHarbor = system.deidentify(researchData, 'safe_harbor');
// Result: Removes 18 HIPAA identifiers per Safe Harbor method
```

### Audit Trail Access

```javascript
// Get all access by a user
const userTrail = system.getAuditTrail('dr.smith', {
  limit: 100,
  startDate: '2026-06-01T00:00:00Z',
  endDate: '2026-06-30T23:59:59Z'
});

// Filter by event type
const encryptionEvents = system.getAuditTrail('dr.smith', {
  eventType: 'decrypt_phi'
});

// Result:
[
  {
    timestamp: '2026-06-22T10:30:45Z',
    eventType: 'decrypt_phi',
    userId: 'dr.smith',
    sessionId: 'abc123...',
    outcome: 'success',
    eventDetails: {
      keyVersion: 1,
      dataHash: 'def456...'
    }
  }
]
```

### Breach Notification

```javascript
// Report a security incident
const breach = system.reportBreach({
  discoveredAt: new Date(Date.now() - 3600000).toISOString(),
  severity: 'high',
  phiAffected: ['ssn', 'diagnosis', 'treatment'],
  estimatedCount: 150,
  description: 'Unauthorized database access detected',
  cause: 'Compromised credentials',
  systemsAffected: ['ehr_database', 'backup_server'],
  containmentActions: [
    'System access revoked for compromised account',
    'Database backup isolated from network',
    'Affected patients notified'
  ]
});

// Result:
{
  id: '5f8c9d2e1a3b4c5d',
  reportedAt: '2026-06-22T10:35:00Z',
  discoveredAt: '2026-06-22T09:35:00Z',
  severity: 'high',
  estimatedCount: 150,
  status: 'reported'
}

// Track breaches
const allBreaches = system.getBreachLog();
```

### Compliance Checks

```javascript
// Run full compliance assessment
const check = system.runComplianceCheck();

console.log(check.overallStatus); // 'COMPLIANT', 'PARTIAL', 'NON_COMPLIANT'

// Check individual components
check.results.baaVerified;      // {passed: true, severity: 'critical'}
check.results.encryptionEnabled; // {passed: true, severity: 'critical'}
check.results.auditLoggingEnabled; // {passed: true, severity: 'high'}
check.results.keyRotationSchedule; // {passed: false, severity: 'high'}

// Get summary
console.log(`Critical: ${check.criticalFailures}, High: ${check.highFailures}`);
```

### Compliance Reporting

```javascript
// Generate executive report
const report = system.generateComplianceReport({
  organizationName: 'HealthTech Medical Center',
  startDate: '2026-05-22T00:00:00Z',
  endDate: '2026-06-22T23:59:59Z'
});

// Result includes:
{
  generatedAt: '2026-06-22T10:45:00Z',
  organizationName: 'HealthTech Medical Center',
  complianceCheck: {...},
  breachNotifications: 2,
  auditLogEntries: 5432,
  encryptionStatus: {
    enabled: true,
    algorithm: 'aes-256-gcm',
    keyVersion: 3,
    lastRotation: '2026-03-15T00:00:00Z',
    rotationDue: false
  },
  recommendations: [
    {
      priority: 'high',
      category: 'Encryption',
      message: 'Key version 3 is 3 months old',
      action: 'Schedule key rotation within 30 days'
    }
  ]
}
```

### System Metrics

```javascript
// Get operational metrics
const metrics = system.getSystemMetrics();

console.log(`Active Sessions: ${metrics.sessions.active}/${metrics.sessions.total}`);
console.log(`Audit Entries: ${metrics.auditLog.retention} day retention`);
console.log(`Breaches Tracked: ${metrics.breaches.total} total, ${metrics.breaches.active} active`);
console.log(`Compliance Mode: ${metrics.configuration.complianceMode}`);
```

## Data Classification

The system automatically detects PHI types:

```javascript
// DIRECT: Name, SSN, MRN, Email, Account numbers
// QUASI: Age, ZIP code, Gender, Location
// SENSITIVE: Diagnosis, Treatment, Medication, Prognosis
// DERIVED: Aggregated/computed PHI
// METADATA: Access patterns, timestamps
```

Custom classification rules can be added:

```javascript
const config = {
  dataClassification: {
    socialSecurityNumber: 'direct',
    dateOfBirth: 'quasi',
    geneticInformation: 'sensitive',
    viralLoadCount: 'sensitive'
  }
};
```

## Session Management

### Creating Sessions

```javascript
const session = system.createSession('user@hospital.org', {
  ipAddress: '192.168.1.100',
  userAgent: 'Claudient-Client/1.0',
  permissions: ['read_phi', 'write_phi', 'audit_access']
});

// Returns:
{
  sessionId: 'f8d9e2a1b3c4d5e6...',
  userId: 'user@hospital.org',
  createdAt: '2026-06-22T10:50:00Z',
  expiresAt: '2026-06-22T11:50:00Z',
  ipAddress: '192.168.1.100',
  userAgent: 'Claudient-Client/1.0',
  permissions: ['read_phi', 'write_phi', 'audit_access'],
  accessLog: []
}
```

### Session Validation

```javascript
// Validate active session
try {
  const session = system.validateSession(sessionId);
  console.log(`Session valid for ${session.userId}`);
} catch (err) {
  console.log(`Session expired or invalid`);
}
```

### Session Expiration

Sessions automatically expire after 1 hour by default. To customize:

```javascript
// Modify session expiration in code (advanced)
const session = system.createSession(userId);
session.expiresAt = new Date(Date.now() + 8*3600000); // 8 hours
```

## Audit Logging

### Log Format

Each audit entry contains:
```json
{
  "timestamp": "2026-06-22T10:55:30Z",
  "version": "1.0",
  "eventType": "decrypt_phi",
  "userId": "dr.smith",
  "sessionId": "abc123...",
  "outcome": "success|failure",
  "ipAddress": "192.168.1.100",
  "userAgent": "Claudient-Client/1.0",
  "eventDetails": {
    "keyVersion": 1,
    "dataHash": "def456...",
    "dataClassification": "sensitive"
  }
}
```

### Event Types

| Event | Trigger |
|-------|---------|
| `encrypt_phi` | PHI encryption requested |
| `decrypt_phi` | PHI decryption requested |
| `decrypt_phi_failed` | PHI decryption failed |
| `session_created` | New user session |
| `deidentify_*` | De-identification method used |
| `breach_reported` | Security incident reported |
| `key_rotated` | Encryption key rotated |
| `compliance_check` | Compliance assessment run |

### Retention & Archival

HIPAA requires 6-year minimum audit retention (7 years default):

```javascript
const config = {
  retentionDays: 2555 // ~7 years
};
```

Archive strategy:
```bash
# Monthly archival
tar czf audit-2026-05.tar.gz /var/audit/audit.log
mv audit-2026-05.tar.gz /secure/archive/
truncate -s 0 /var/audit/audit.log
```

## Key Rotation

### Automatic Rotation Due Dates

```javascript
// Check if rotation is due
if (system._shouldRotateKey()) {
  system.rotateEncryptionKey();
}

// 90-day default interval
// Recommended: Monthly rotation for high-risk environments
const config = {
  keyRotationDays: 30
};
```

### Manual Rotation

```javascript
const result = system.rotateEncryptionKey();
console.log(`✓ Rotated v${result.oldVersion} → v${result.newVersion}`);
// Old key backed up, new key active immediately
// All new encryptions use new key
// Decryption works with all key versions
```

### Key Backup

Implement external key backup:
```bash
# Backup current key to secure vault
openssl enc -aes-256-cbc -in /secure/path/encryption.key -out key-backup.enc
# Store encrypted backup in secure vault (e.g., AWS KMS, HashiCorp Vault)
```

## HIPAA Security Rule Compliance

### Administrative Safeguards
✓ Access control (session management)
✓ Audit controls (comprehensive logging)
✓ Integrity controls (encryption auth tag)
✓ Transmission security (TLS for network)

### Physical Safeguards
- Implement facility access controls
- Encrypt storage devices
- Secure disposal procedures

### Technical Safeguards
✓ Access controls (AES-256-GCM)
✓ Audit controls (event logging)
✓ Integrity controls (Galois/Counter Mode)
✓ Transmission security (encryption at rest)

### Organizational Safeguards
- Define security policies
- Designate privacy officer
- Conduct risk assessment
- Document configuration

## Business Associate Agreements

### BAA Verification

```javascript
// BAA must be verified before production use
const config = {
  baaVerified: true  // Legal requirement
};

// If not verified:
const session = system.createSession('user');
// Throws: Error: BAA not verified - sessions cannot be created
```

### BAA Checklist

- [ ] Execute BAA with cloud providers
- [ ] Document data processing terms
- [ ] Establish incident response procedures
- [ ] Include audit trail requirements
- [ ] Define breach notification process
- [ ] Document subcontractor requirements
- [ ] Obtain organization sign-off

### Compliance Report

```javascript
const report = system.generateComplianceReport();

if (!report.complianceCheck.results.baaVerified.passed) {
  // ALERT: System non-compliant
  // Cannot process PHI until BAA verified
}
```

## Testing & Validation

### Unit Tests

```bash
node test/hipaa-compliant-system.test.js
```

All tests include:
- Encryption/decryption correctness
- De-identification verification
- Session management
- Audit logging
- Compliance checks
- Key rotation

### Integration Testing

```javascript
// Full workflow test
const system = createTestSystem('/tmp/hipaa-test');

const data = { ssn: '123-45-6789', diagnosis: 'HIV' };
const encrypted = system.encryptPHI(data);
const decrypted = system.decryptPHI(encrypted, { sessionId: null });

// Verify
assert(decrypted.ssn === data.ssn);

// De-identify
const deidentified = system.deidentify(JSON.stringify(data), 'safe_harbor');
assert(!deidentified.includes('123-45-6789'));

// Check compliance
const check = system.runComplianceCheck();
assert(check.results.encryptionEnabled.passed);
```

### Performance Baseline

```javascript
// Encryption throughput
console.time('1000 encryptions');
for (let i = 0; i < 1000; i++) {
  system.encryptPHI({ data: `record-${i}` });
}
console.timeEnd('1000 encryptions');
// Expected: ~500-1000ms on modern hardware
```

## Security Best Practices

### 1. Key Management
- Never log keys or passphrases
- Use environment variables for key paths
- Rotate keys every 30-90 days
- Maintain offline backup of keys
- Use HSM (Hardware Security Module) for enterprise

### 2. Access Control
- Implement role-based access control (RBAC)
- Use multi-factor authentication (MFA)
- Enforce principle of least privilege
- Monitor privileged access
- Regular access reviews

### 3. Audit & Monitoring
- Monitor audit log growth
- Alert on access anomalies
- Regular audit log review
- Automated compliance reporting
- Incident response procedures

### 4. Network Security
- TLS 1.2+ for all transmissions
- VPN/private networks for sensitive operations
- Firewall rules for audit/key servers
- DDoS protection
- Intrusion detection

### 5. Data Minimization
- Collect only necessary PHI
- De-identify when possible
- Delete PHI when no longer needed
- Archive historical data securely
- Document retention periods

### 6. Incident Response
- Maintain incident response plan
- Test breach notification procedures
- Document all incidents
- Regular security assessments
- Third-party penetration testing

## Troubleshooting

### Common Issues

**Issue**: "Master key not initialized"
```javascript
// Solution: Check key file exists and is readable
fs.accessSync(config.encryptionKeyPath);
// Check permissions
fs.statSync(config.encryptionKeyPath).mode; // Should be 0o100600
```

**Issue**: "PHI decryption failed"
```javascript
// Solution: Verify encryption key matches
// - Check keyVersion in encrypted object
// - Ensure key hasn't been corrupted
// - Validate authTag integrity
```

**Issue**: "Session expired"
```javascript
// Solution: Create new session
const session = system.createSession(userId);
// Default expiration: 1 hour
// Increase if needed in config
```

**Issue**: "BAA not verified"
```javascript
// Solution: Set baaVerified in configuration AFTER legal review
const config = {
  baaVerified: true // Only after BAA executed
};
```

## Support & Compliance

### Audit Trail
- All operations logged with timestamps
- Exportable for compliance audits
- Retention: 7 years (configurable)
- Read-only after 90 days (archive)

### Compliance Reports
- Auto-generated compliance assessments
- Executive summaries
- Actionable recommendations
- Exportable as JSON

### Update & Patch Management
- Regular dependency updates
- Security vulnerability patches
- Backward compatibility for key rotation
- Version tracking in audit logs

## License & Attribution

This HIPAA-compliant module is part of Claudient. See LICENSE file for terms.

For questions, security issues, or compliance concerns, contact: compliance@uitbreiden.com
