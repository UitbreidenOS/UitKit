# HIPAA-Compliant System for Claudient

A production-ready, enterprise-grade HIPAA compliance framework for Claudient deployments in healthcare environments.

## What is This?

`hipaa-compliant-system.js` is a Node.js module that implements core HIPAA Security and Privacy Rule requirements for protecting Protected Health Information (PHI) when using Claude Code in healthcare settings.

## Key Features

### Security & Encryption
- **AES-256-GCM Encryption**: NIST-approved cipher for PHI at rest
- **Per-Record Encryption**: Each data element independently encrypted
- **Secure Key Management**: 256-bit master key with rotation
- **Authentication**: Galois/Counter Mode for integrity verification
- **Key Versioning**: Support for multiple key generations

### Access Control & Audit
- **Session Management**: Secure user authentication with expiration
- **Fine-grained Logging**: Complete audit trail of all PHI access
- **Context Tracking**: IP addresses, user agents, timestamps
- **Audit Trail Queries**: Filter by user, event type, date range
- **7-Year Retention**: HIPAA-compliant audit log persistence

### Data De-identification
Four HIPAA-compliant de-identification methods:
- **Generalization**: Replace values with ranges/categories
- **Suppression**: Remove direct identifiers entirely
- **Perturbation**: Add statistical noise to values
- **Safe Harbor**: HIPAA's 18-identifier standard method

### Compliance Monitoring
- **Automated Checks**: 8-point compliance assessment
- **Breach Tracking**: Severity classification and containment
- **Compliance Reports**: Executive summaries with recommendations
- **Metrics Dashboard**: Real-time encryption, session, audit statistics

### Business Associate Agreement (BAA)
- **BAA Enforcement**: System requires verified BAA before processing PHI
- **Policy Integration**: Audit logs include BAA verification status
- **Compliance Tracking**: BAA status in all reports

## Quick Start

### Installation

The module is included in Claudient. Import and initialize:

```javascript
const { System: HipaaCompliantSystem } = require('./lib/hipaa-compliant-system');

const system = new HipaaCompliantSystem({
  encryptionKeyPath: '/secure/keys/encryption.key',
  auditLogPath: '/secure/logs/audit.log',
  baaVerified: true,  // MUST be true for production
  complianceMode: 'standard'
});
```

### Encrypt Patient Data

```javascript
const patientRecord = {
  name: 'Jane Smith',
  ssn: '123-45-6789',
  diagnosis: 'Diabetes'
};

const encrypted = system.encryptPHI(patientRecord);
// Returns: { ciphertext, iv, authTag, algorithm, keyVersion, metadata... }
```

### Decrypt with Audit

```javascript
const session = system.createSession('dr.smith', {
  ipAddress: '192.168.1.100'
});

const decrypted = system.decryptPHI(encrypted, {
  sessionId: session.sessionId
});
// Automatically logged to audit trail
```

### De-identify for Research

```javascript
const deidentified = system.deidentify(patientData, 'safe_harbor');
// Removes all HIPAA identifiers per Safe Harbor method
```

### Check Compliance

```javascript
const check = system.runComplianceCheck();
console.log(check.overallStatus); // 'COMPLIANT', 'PARTIAL', 'NON_COMPLIANT'

const report = system.generateComplianceReport({
  organizationName: 'HealthTech Medical Center'
});
// Executive summary with recommendations
```

## Architecture

### Encryption Pipeline

```
Raw PHI Data
    ↓
[Classification] → Detect identifier types (DIRECT, QUASI, SENSITIVE)
    ↓
[Encryption] → AES-256-GCM with random IV
    ↓
[Auth Tag] → Galois/Counter Mode integrity
    ↓
Encrypted Output { ciphertext, iv, authTag, metadata }
```

### Audit Trail Flow

```
User Action (encrypt/decrypt/deidentify)
    ↓
[Context Capture] → sessionId, userId, ipAddress, timestamp
    ↓
[Event Logging] → JSON entry to audit.log
    ↓
[Audit Trail] → Queryable by user/event/date
    ↓
[Compliance] → Included in reports, retention enforced
```

### Access Control Model

```
User Request
    ↓
[Session Check] → Valid and not expired?
    ↓
[Context Verification] → IP, agent, permissions match?
    ↓
[Operation] → Encrypt/decrypt/de-identify PHI
    ↓
[Audit Log] → Record access with full context
```

## Configuration

### Minimal Production Config

```javascript
const config = {
  // Required
  encryptionKeyPath: '/secure/encryption.key',
  auditLogPath: '/secure/audit.log',
  
  // HIPAA-required
  baaVerified: true,
  complianceMode: 'standard',
  
  // Retention
  retentionDays: 2555,  // 7 years
  keyRotationDays: 90
};
```

### Compliance Modes

| Mode | Use Case | Performance | Security |
|------|----------|-------------|----------|
| **STRICT** | High-security networks | Lower | Maximum |
| **STANDARD** | Most healthcare deployments | Balanced | Balanced |
| **BASIC** | Development/testing | Maximum | Minimum |

## Real-World Examples

### Scenario 1: Patient Portal Login

```javascript
// User logs in
const session = system.createSession(userId, {
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  permissions: ['read_own_phi']
});

// Retrieve encrypted medical record
const record = database.getEncrypted(patientId);

// Decrypt only after auth + audit log
const phi = system.decryptPHI(record, {
  sessionId: session.sessionId,
  userId: userId
});

// Logged: decrypt_phi event with user, timestamp, IP
```

### Scenario 2: Research De-identification

```javascript
// Researcher requests dataset for study
const cohort = database.getPatients(criteria);

// De-identify using Safe Harbor
const deidentified = cohort.map(record => {
  return system.deidentify(JSON.stringify(record), 'safe_harbor');
});

// Logged: deidentify_safe_harbor with researcher ID, timestamp
// Ready for publication without PHI
```

### Scenario 3: Security Incident

```javascript
// Detect unauthorized access
const breach = system.reportBreach({
  discoveredAt: new Date().toISOString(),
  severity: 'high',
  phiAffected: ['ssn', 'diagnosis', 'treatment'],
  estimatedCount: 250,
  description: 'Unauthorized database query detected',
  cause: 'Compromised service account',
  containmentActions: [
    'Service account credentials rotated',
    'Database access logs reviewed',
    'Affected patients notified'
  ]
});

// Breach logged with full context
// Included in compliance reports
```

### Scenario 4: Key Rotation

```javascript
// Schedule monthly key rotation (90-day default)
if (system._shouldRotateKey()) {
  const result = system.rotateEncryptionKey();
  
  // Old key version: 5
  // New key version: 6
  // All new encryptions use key v6
  // Decryption works with all versions
  
  // Event logged to audit trail
  // Included in compliance metrics
}
```

## API Reference

### Core Classes & Methods

#### HipaaCompliantSystem Constructor

```javascript
new HipaaCompliantSystem({
  encryptionKeyPath: string,      // Required: path to master key
  auditLogPath: string,           // Required: path to audit log
  baaVerified: boolean,           // Default: false
  complianceMode: string,         // Default: 'standard'
  dataClassification: object,     // Default: {}
  retentionDays: number,          // Default: 2555
  keyRotationDays: number,        // Default: 90
  enableEncryption: boolean,      // Default: true
  enableAuditLog: boolean         // Default: true
})
```

#### Encryption Methods

```javascript
// Encrypt PHI with classification
encryptPHI(data, metadata = {})
  → { ciphertext, iv, authTag, algorithm, keyVersion, metadata }

// Decrypt PHI with audit logging
decryptPHI(encryptedData, context = {})
  → object or string (original data)
```

#### De-identification Methods

```javascript
// Four HIPAA-compliant methods
deidentify(data, method)
  method: 'generalization' | 'suppression' | 'perturbation' | 'safe_harbor'
  → deidentified data (string)
```

#### Session Management

```javascript
// Create authenticated session
createSession(userId, context = {})
  → { sessionId, userId, createdAt, expiresAt, permissions, accessLog }

// Validate session still active
validateSession(sessionId)
  → session object or throws error
```

#### Audit Operations

```javascript
// Retrieve audit trail for user
getAuditTrail(userId, options = {})
  options: { startDate, endDate, eventType, limit }
  → array of audit entries
```

#### Compliance & Reporting

```javascript
// Run 8-point compliance assessment
runComplianceCheck()
  → { overallStatus, criticalFailures, highFailures, results }

// Generate executive compliance report
generateComplianceReport(options = {})
  → { generatedAt, complianceCheck, breaches, recommendations }

// Get operational metrics
getSystemMetrics()
  → { encryption, sessions, auditLog, breaches, configuration }
```

#### Key Management

```javascript
// Rotate encryption key
rotateEncryptionKey()
  → { success, oldVersion, newVersion, rotatedAt }

// Check if rotation is due
_shouldRotateKey()
  → boolean
```

#### Breach Management

```javascript
// Report security incident
reportBreach(details)
  → breach object with id, timestamp, severity, status

// Retrieve all breaches
getBreachLog()
  → array of breach objects
```

## Compliance Features

### HIPAA Security Rule

✓ **Administrative Safeguards**
- Access control via sessions
- Audit controls via logging
- Integrity verification via auth tags

✓ **Technical Safeguards**
- Access controls (encryption)
- Audit controls (comprehensive logging)
- Integrity controls (Galois/Counter Mode)
- Transmission security (TLS recommended)

### Privacy Rule

✓ **De-identification** - Four HIPAA-compliant methods
✓ **Data Use Agreements** - BAA enforcement
✓ **Breach Notification** - Incident tracking and reporting

### Breach Notification Rule

✓ **Incident Reporting** - Severity classification
✓ **Notification Tracking** - Containment documentation
✓ **Audit Trail** - Complete event history

## Testing

Run the comprehensive test suite:

```bash
# All tests
node test/hipaa-compliant-system.test.js

# Expected: 36/36 tests pass ✓
# Coverage: Encryption, de-identification, sessions, audit, compliance
```

Run the full example:

```bash
# Demonstrates all major features
node examples/hipaa-compliant-example.js

# Shows: encryption, sessions, de-identification, breaches, 
# key rotation, compliance checks, reporting, metrics
```

## Security Best Practices

### Key Management
- Store keys on encrypted filesystem
- Restrict permissions to 0600 (read-only by owner)
- Rotate every 30-90 days
- Backup to secure vault (AWS KMS, HashiCorp Vault)
- Use HSM for enterprise deployments

### Access Control
- Implement role-based access control (RBAC)
- Require multi-factor authentication (MFA)
- Apply principle of least privilege
- Monitor privileged access
- Conduct quarterly access reviews

### Audit & Monitoring
- Monitor audit log growth
- Alert on access anomalies
- Perform regular audit reviews
- Automate compliance checks
- Maintain incident response procedures

### Network Security
- TLS 1.2+ for all communications
- VPN/private networks for sensitive operations
- Firewall rules for audit/key servers
- DDoS protection
- Intrusion detection

### Data Minimization
- Collect only necessary PHI
- De-identify when possible
- Delete after retention period
- Archive encrypted
- Document all retention decisions

## File Structure

```
lib/
  ├── hipaa-compliant-system.js       # Main module (900+ lines)
  ├── HIPAA_COMPLIANCE_GUIDE.md       # Detailed guide
  └── HIPAA_COMPLIANT_README.md       # This file

examples/
  └── hipaa-compliant-example.js      # Full usage examples

test/
  └── hipaa-compliant-system.test.js  # Comprehensive test suite (36 tests)
```

## Events

The system emits events for monitoring:

```javascript
system.on('initialized', (info) => {
  // System ready, compliance mode, BAA status
});

system.on('key_rotated', (event) => {
  // Old/new key versions, rotation time
});

system.on('breach', (breach) => {
  // Breach ID, severity, estimated count
});

system.on('warning', (warning) => {
  // Key rotation due, other alerts
});

system.on('error', (error) => {
  // Audit log failures, system errors
});
```

## Limitations & Disclaimers

### What This Provides
- ✓ PHI encryption at rest
- ✓ Access logging and audit trails
- ✓ De-identification utilities
- ✓ Compliance checking
- ✓ BAA enforcement

### What This Does NOT Provide
- ✗ Encryption in transit (use TLS separately)
- ✗ Physical security (facility controls)
- ✗ Disaster recovery (implement separately)
- ✗ Legal BAA (must execute with providers)
- ✗ Risk assessment (conduct your own)

### Requirements
- Node.js 18+
- Encrypted filesystem recommended
- HIPAA-compliant infrastructure
- Executed Business Associate Agreement
- Security policy and procedures
- Regular security assessments

## Compliance Checklist

Before production deployment:

- [ ] BAA executed with all cloud providers
- [ ] Encryption keys secured in vault
- [ ] Audit log retention configured
- [ ] Key rotation schedule established
- [ ] Access control policies defined
- [ ] Incident response plan documented
- [ ] Security assessments completed
- [ ] Staff training completed
- [ ] Audit log monitoring configured
- [ ] Backup and recovery tested
- [ ] Compliance reports reviewed
- [ ] Legal sign-off obtained

## Support

For questions, security issues, or compliance concerns:

- GitHub Issues: Report bugs and feature requests
- Security: security@claudient.dev
- Compliance: compliance@uitbreiden.com

## License

Part of Claudient. See LICENSE file for terms.

---

**Important**: This module is provided as-is. HIPAA compliance requires comprehensive organizational measures beyond code. Consult legal counsel and compliance experts before processing PHI.

Last Updated: 2026-06-22
Module Version: 1.0.0
