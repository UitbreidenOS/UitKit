# HIPAA Integration Guide for Claudient

Step-by-step guide for integrating HIPAA compliance into your Claudient deployment.

## Step 1: Legal & Governance Setup

### 1.1 Business Associate Agreement (BAA)

Before any PHI processing:

```
1. Identify all cloud providers handling PHI
   - Claude API provider (Anthropic)
   - Infrastructure (AWS, GCP, Azure)
   - Backup services
   - Log aggregation services

2. Execute BAA with each provider
   - Include: data processing terms
   - Include: security incident procedures
   - Include: audit trail requirements
   - Include: breach notification obligations

3. Document BAA completion
   - Store agreements in secure location
   - Track expiration dates
   - Maintain version history

4. Verify BAA in code
   const config = { baaVerified: true };
```

### 1.2 Privacy Officer Designation

```
- Designate HIPAA Privacy Officer
- Designate HIPAA Security Officer
- Document responsibilities
- Establish escalation procedures
```

### 1.3 Security Policy Documentation

Required documents:
- Security policy overview
- Access control policy
- Encryption policy
- Incident response plan
- Audit logging procedures
- Data retention policy
- Breach notification procedures

## Step 2: Infrastructure Setup

### 2.1 Secure Key Storage

```bash
# Create secure directory structure
mkdir -p /var/claudient/{keys,logs,backups}

# Set restrictive permissions
chmod 700 /var/claudient/keys
chmod 700 /var/claudient/logs
chmod 700 /var/claudient/backups

# Encrypt the partition (recommended)
# Use full-disk encryption on filesystem
# Or: Use encryption at volume level

# For cloud: Use Key Management Service
# AWS: AWS KMS
# GCP: Google Cloud KMS
# Azure: Azure Key Vault
```

### 2.2 Audit Log Storage

```bash
# Create audit log location
mkdir -p /var/claudient/logs
chmod 700 /var/claudient/logs

# Configure log rotation
cat > /etc/logrotate.d/claudient-audit << EOF
/var/claudient/logs/audit.log {
    daily
    rotate 2555                 # ~7 years
    compress
    delaycompress
    notifempty
    create 0600 nobody nobody
    sharedscripts
    postrotate
        chown nobody:nobody /var/claudient/logs/audit.log*
        chmod 0600 /var/claudient/logs/audit.log*
    endscript
}
EOF
```

### 2.3 Backup Strategy

```bash
# Backup encryption keys monthly
0 2 1 * * /usr/local/bin/backup-keys.sh

# Backup audit logs monthly
0 3 1 * * /usr/local/bin/backup-audit.sh

# Backup script example:
#!/bin/bash
DATE=$(date +%Y-%m-%d)
tar czf /secure/vault/keys-$DATE.tar.gz /var/claudient/keys/
# Encrypt with passphrase or AWS KMS
# Copy to secure offsite location
```

## Step 3: Application Integration

### 3.1 Initialize System at Startup

```javascript
// app.js or server.js
const HipaaCompliant = require('./lib/hipaa-compliant-system');

const hipaaSystem = new HipaaCompliant.System({
  encryptionKeyPath: process.env.HIPAA_KEY_PATH,
  auditLogPath: process.env.HIPAA_AUDIT_PATH,
  baaVerified: process.env.BAA_VERIFIED === 'true',
  complianceMode: process.env.COMPLIANCE_MODE || 'standard',
  dataClassification: loadClassificationRules(),
  retentionDays: 2555,
  keyRotationDays: 90
});

// Verify initialization
hipaaSystem.on('initialized', (info) => {
  console.log('✓ HIPAA system ready');
  console.log(`  Mode: ${info.complianceMode}`);
  console.log(`  BAA: ${info.baaVerified ? 'verified' : 'NOT VERIFIED'}`);
});

hipaaSystem.on('error', (err) => {
  console.error('HIPAA system error:', err);
  // Alert operations team immediately
  alertOps(err);
});

module.exports = hipaaSystem;
```

### 3.2 Environment Variables

```bash
# .env or .env.production
HIPAA_KEY_PATH=/var/claudient/keys/encryption.key
HIPAA_AUDIT_PATH=/var/claudient/logs/audit.log
BAA_VERIFIED=true
COMPLIANCE_MODE=standard
LOG_LEVEL=info
```

### 3.3 Authentication Middleware

```javascript
// middleware/authenticate.js
const hipaaSystem = require('../hipaa-system');

async function authenticate(req, res, next) {
  try {
    // Verify JWT/session
    const userId = verifyAuth(req);
    
    // Create HIPAA session
    const hipaaSession = hipaaSystem.createSession(userId, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      permissions: req.user.hipaaPermissions || []
    });
    
    // Attach to request
    req.hipaaSession = hipaaSession;
    req.hipaaSystem = hipaaSystem;
    
    next();
  } catch (err) {
    res.status(401).json({ error: 'Authentication required' });
  }
}

module.exports = authenticate;
```

### 3.4 PHI Encryption Middleware

```javascript
// middleware/encrypt-phi.js
async function encryptPHI(req, res, next) {
  const originalJson = res.json;
  
  res.json = function(data) {
    try {
      // Check if response contains PHI
      if (data && containsPHI(data)) {
        // Encrypt response
        const encrypted = req.hipaaSystem.encryptPHI(data, {
          tags: ['api_response', req.path]
        });
        
        // Log encryption
        return originalJson.call(this, {
          data: encrypted,
          encrypted: true
        });
      }
      
      return originalJson.call(this, data);
    } catch (err) {
      console.error('PHI encryption failed:', err);
      res.status(500).json({ error: 'Encryption error' });
    }
  };
  
  next();
}

function containsPHI(data) {
  const phiPatterns = [
    /\d{3}-\d{2}-\d{4}/,      // SSN
    /MRN[\w-]*\d+/i,          // MRN
    /\b\d{5}(?:-\d{4})?\b/    // ZIP
  ];
  
  const dataStr = JSON.stringify(data);
  return phiPatterns.some(pattern => pattern.test(dataStr));
}
```

### 3.5 PHI Decryption with Audit

```javascript
// api/patient/[id].js - Example endpoint
router.get('/patient/:id', authenticate, async (req, res) => {
  const { hipaaSession, hipaaSystem } = req;
  const patientId = req.params.id;
  
  try {
    // Fetch encrypted record
    const encryptedRecord = await db.getPatient(patientId);
    
    // Verify access
    if (!canAccess(req.user, patientId)) {
      throw new Error('Access denied');
    }
    
    // Decrypt with audit logging
    const phi = hipaaSystem.decryptPHI(encryptedRecord, {
      sessionId: hipaaSession.sessionId,
      userId: req.user.id,
      action: 'view_record',
      purpose: 'clinical_review'
    });
    
    res.json(phi);
    
  } catch (err) {
    console.error('PHI access error:', err);
    res.status(500).json({ error: 'Error retrieving record' });
  }
});
```

## Step 4: Data Handling Procedures

### 4.1 Patient Data Workflow

```
Patient Registration
  ↓
[Capture minimal PHI]
  ↓
[Validate/normalize]
  ↓
[Encrypt with system.encryptPHI()]
  ↓
[Store in database]
  ↓
[Log to audit trail]
```

### 4.2 De-identification for Research

```javascript
// scripts/prepare-research-dataset.js
const hipaaSystem = require('../hipaa-system');
const fs = require('fs');

// Fetch patient cohort
const patients = await db.queryPatients(researchCriteria);

// De-identify each record
const deidentifiedCohort = patients.map(patient => {
  const encrypted = patient.data; // Already encrypted in DB
  const decrypted = hipaaSystem.decryptPHI(encrypted);
  const deidentified = hipaaSystem.deidentify(
    JSON.stringify(decrypted),
    'safe_harbor'
  );
  
  return JSON.parse(deidentified);
});

// Export for research
fs.writeFileSync('research_dataset.json', JSON.stringify(deidentifiedCohort));
console.log(`✓ Exported ${deidentifiedCohort.length} de-identified records`);
```

### 4.3 Breach Incident Response

```javascript
// utils/breach-response.js
async function handleBreach(details) {
  const hipaaSystem = require('../hipaa-system');
  
  // Report to system
  const breach = hipaaSystem.reportBreach({
    discoveredAt: new Date().toISOString(),
    severity: details.severity,
    phiAffected: details.fields,
    estimatedCount: details.count,
    description: details.description,
    cause: details.cause,
    systemsAffected: details.systems,
    containmentActions: [
      'Service access revoked',
      'Database backup isolated',
      'Security audit initiated'
    ]
  });
  
  // Alert security team
  await alertSecurityTeam({
    breachId: breach.id,
    severity: breach.severity,
    affectedRecords: breach.estimatedCount,
    contactsNeeded: breach.estimatedCount > 60
  });
  
  // Start notification process
  const contactsToNotify = await identifyAffectedIndividuals(breach);
  await notifyIndividuals(contactsToNotify);
  
  // Log to compliance system
  await logBreachForCompliance(breach);
  
  return breach;
}
```

## Step 5: Operational Monitoring

### 5.1 Scheduled Compliance Checks

```javascript
// scripts/daily-compliance-check.js
const schedule = require('node-schedule');
const hipaaSystem = require('../hipaa-system');

// Run daily at 2 AM
schedule.scheduleJob('0 2 * * *', async () => {
  const check = hipaaSystem.runComplianceCheck();
  
  if (check.overallStatus !== 'COMPLIANT') {
    alertOps({
      type: 'compliance_failure',
      status: check.overallStatus,
      failures: check.results
    });
  }
  
  // Log metrics
  logMetrics(hipaaSystem.getSystemMetrics());
});
```

### 5.2 Monthly Compliance Reporting

```javascript
// scripts/monthly-compliance-report.js
const hipaaSystem = require('../hipaa-system');
const fs = require('fs');

async function generateMonthlyReport() {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const report = hipaaSystem.generateComplianceReport({
    organizationName: process.env.ORG_NAME,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  });
  
  // Save report
  const reportFile = `compliance_report_${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}.json`;
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  
  // Email to compliance officer
  await emailComplianceOfficer({
    subject: `HIPAA Compliance Report - ${now.toLocaleDateString()}`,
    report: report,
    attachment: reportFile
  });
  
  // Archive
  await archiveReport(reportFile);
}
```

### 5.3 Key Rotation Schedule

```javascript
// scripts/check-key-rotation.js
const hipaaSystem = require('../hipaa-system');
const schedule = require('node-schedule');

// Check rotation status weekly
schedule.scheduleJob('0 3 * * 0', async () => {
  if (hipaaSystem._shouldRotateKey()) {
    console.log('Key rotation due - scheduling');
    await scheduleKeyRotation();
  }
});

async function scheduleKeyRotation() {
  // Schedule maintenance window
  await notifyOps('Key rotation scheduled for this weekend');
  
  // At maintenance window:
  const result = hipaaSystem.rotateEncryptionKey();
  console.log(`✓ Key rotated: v${result.oldVersion} → v${result.newVersion}`);
  
  // Verify system still operational
  const check = hipaaSystem.runComplianceCheck();
  if (check.overallStatus === 'COMPLIANT') {
    console.log('✓ Post-rotation compliance verified');
  }
}
```

### 5.4 Audit Log Monitoring

```javascript
// scripts/monitor-audit-logs.js
const hipaaSystem = require('../hipaa-system');

async function monitorAuditLogs() {
  const yesterday = new Date(Date.now() - 24*60*60*1000);
  
  // Get all access from yesterday
  const allAccess = await hipaaSystem.getAuditTrail('*', {
    startDate: yesterday.toISOString(),
    limit: 100000
  });
  
  // Detect anomalies
  const anomalies = detectAnomalies(allAccess);
  
  if (anomalies.length > 0) {
    console.log(`⚠ ${anomalies.length} anomalies detected:`);
    anomalies.forEach(a => {
      console.log(`  - ${a.type}: ${a.description}`);
      alertSecurityTeam(a);
    });
  }
}

function detectAnomalies(accessLog) {
  const anomalies = [];
  
  // Detect: Large data downloads
  const largeDownloads = accessLog.filter(
    e => e.eventType === 'decrypt_phi' && e.eventDetails.dataSize > 100000
  );
  
  // Detect: Access outside business hours
  const offHours = accessLog.filter(e => {
    const hour = new Date(e.timestamp).getHours();
    return hour < 8 || hour > 18;
  });
  
  // Detect: Failed access attempts
  const failures = accessLog.filter(e => e.outcome === 'failure');
  
  if (largeDownloads.length > 0) {
    anomalies.push({
      type: 'large_download',
      description: `${largeDownloads.length} large PHI downloads`,
      severity: 'high'
    });
  }
  
  if (failures.length > 10) {
    anomalies.push({
      type: 'access_failures',
      description: `${failures.length} failed access attempts`,
      severity: 'high'
    });
  }
  
  return anomalies;
}
```

## Step 6: Testing & Validation

### 6.1 Unit Tests

```bash
# Run module tests
node test/hipaa-compliant-system.test.js

# Verify all 36 tests pass
```

### 6.2 Integration Tests

```javascript
// test/integration-hipaa.test.js
describe('HIPAA Integration', () => {
  let app, hipaaSystem;
  
  before(async () => {
    hipaaSystem = new HipaaCompliant.System({
      encryptionKeyPath: '/tmp/test.key',
      auditLogPath: '/tmp/test.log',
      baaVerified: true,
      baaVerified: false
    });
    app = startTestServer(hipaaSystem);
  });
  
  it('should encrypt PHI on request', async () => {
    const res = await request(app)
      .get('/api/patient/123')
      .expect(200);
    
    assert(res.body.encrypted);
    assert(res.body.data.ciphertext);
  });
  
  it('should log all PHI access', async () => {
    await request(app).get('/api/patient/123');
    
    const trail = hipaaSystem.getAuditTrail('test-user');
    assert(trail.length > 0);
    assert(trail[0].eventType === 'decrypt_phi');
  });
});
```

### 6.3 Compliance Validation

```bash
# Verify compliance
node -e "
const HipaaCompliant = require('./lib/hipaa-compliant-system');
const system = new HipaaCompliant.System({
  encryptionKeyPath: '/tmp/key.json',
  auditLogPath: '/tmp/audit.log',
  baaVerified: true
});
const check = system.runComplianceCheck();
console.log('Status:', check.overallStatus);
console.log('Critical:', check.criticalFailures);
console.log('High:', check.highFailures);
process.exit(check.overallStatus === 'COMPLIANT' ? 0 : 1);
"
```

## Step 7: Deployment

### 7.1 Production Checklist

- [ ] BAA executed and verified
- [ ] Encryption key secured in KMS
- [ ] Audit log storage configured
- [ ] Log rotation established
- [ ] Backup procedures tested
- [ ] Monitoring configured
- [ ] Incident response plan ready
- [ ] Staff trained
- [ ] Security assessments complete
- [ ] Compliance approved

### 7.2 Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY . .

# Security: Run as non-root
RUN addgroup -g 1000 claudient && \
    adduser -D -u 1000 -G claudient claudient

# Secure directories
RUN mkdir -p /var/claudient/{keys,logs} && \
    chown -R claudient:claudient /var/claudient && \
    chmod 700 /var/claudient/keys /var/claudient/logs

USER claudient

CMD ["node", "app.js"]
```

### 7.3 Kubernetes Deployment

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: hipaa-config
data:
  COMPLIANCE_MODE: standard
  BAA_VERIFIED: "true"

---
apiVersion: v1
kind: Secret
metadata:
  name: hipaa-secrets
type: Opaque
stringData:
  HIPAA_KEY_PATH: /var/secrets/hipaa/key.json
  HIPAA_AUDIT_PATH: /var/logs/hipaa/audit.log

---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: hipaa-keys
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: encrypted

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: claudient-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: claudient
  template:
    metadata:
      labels:
        app: claudient
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
      containers:
      - name: claudient
        image: claudient:latest
        envFrom:
        - configMapRef:
            name: hipaa-config
        - secretRef:
            name: hipaa-secrets
        volumeMounts:
        - name: hipaa-keys
          mountPath: /var/secrets/hipaa
          readOnly: true
      volumes:
      - name: hipaa-keys
        secret:
          secretName: hipaa-encryption-key
          defaultMode: 0600
```

## Step 8: Audit & Governance

### 8.1 Quarterly Compliance Review

```javascript
// scripts/quarterly-review.js
async function quarterlyComplianceReview() {
  const results = {
    timestamp: new Date().toISOString(),
    complianceStatus: null,
    breaches: [],
    auditSummary: null,
    recommendations: []
  };
  
  // Generate compliance report
  const report = hipaaSystem.generateComplianceReport({
    organizationName: process.env.ORG_NAME,
    startDate: getQuarterStart(),
    endDate: getQuarterEnd()
  });
  
  results.complianceStatus = report.complianceCheck.overallStatus;
  results.breaches = hipaaSystem.getBreachLog();
  results.recommendations = report.recommendations;
  
  // Present to compliance committee
  await presentToCompliance(results);
  
  // Archive review
  fs.writeFileSync(
    `compliance_review_Q${getCurrentQuarter()}.json`,
    JSON.stringify(results, null, 2)
  );
}
```

### 8.2 Annual Security Assessment

Conduct independent assessment:
- Penetration testing
- Code review
- Configuration audit
- Access control review
- Incident response drill

## Troubleshooting

### Common Issues

**Issue**: BAA not verified error
```javascript
// Solution: Set baaVerified only after legal approval
const config = { baaVerified: true };
```

**Issue**: Audit log growing too fast
```bash
# Check rotation configuration
# Implement filtering for less critical events
# Compress and archive older entries
```

**Issue**: Key rotation failures
```javascript
// Ensure: File permissions correct, disk space available
// Backup key before rotation
// Test rotation in staging first
```

## Maintenance Schedule

```
Daily:
  - Monitor error logs
  - Check system health

Weekly:
  - Verify audit logs
  - Check key rotation status

Monthly:
  - Generate compliance report
  - Review access logs for anomalies
  - Backup key and audit logs

Quarterly:
  - Full compliance review
  - Incident analysis
  - Policy updates

Annually:
  - Security assessment
  - BAA renewal check
  - Training updates
```

---

For detailed API documentation, see: `HIPAA_COMPLIANCE_GUIDE.md`
For quick start examples, see: `HIPAA_COMPLIANT_README.md`
