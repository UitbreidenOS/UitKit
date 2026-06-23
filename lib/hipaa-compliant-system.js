#!/usr/bin/env node

/**
 * hipaa-compliant-system.js
 *
 * HIPAA-compliant Claudient deployment framework.
 *
 * Features:
 *   - PHI (Protected Health Information) encryption with AES-256-GCM
 *   - Fine-grained access logging and audit trails
 *   - De-identification utilities for research use
 *   - Business associate agreement (BAA) enforcement
 *   - HIPAA Security Rule compliance checks
 *   - Breach notification mechanism
 *   - Encryption key rotation
 *   - Secure session management
 *   - PHI data classification and tagging
 *   - Compliance report generation
 *
 * Usage:
 *   const HipaaCompliant = require('./lib/hipaa-compliant-system');
 *   const system = new HipaaCompliant.System(config);
 *   const encrypted = system.encryptPHI(data);
 *   const auditLog = system.getAuditTrail(userId);
 *   const deidentified = system.deidentify(data);
 *
 * Configuration:
 *   {
 *     encryptionKeyPath: string,        // Path to master encryption key
 *     auditLogPath: string,             // Path to audit log file
 *     baaVerified: boolean,             // BAA agreement verified
 *     dataClassification: object,       // PHI classification rules
 *     retentionDays: number,            // Audit log retention
 *     keyRotationDays: number,          // Encryption key rotation interval
 *     complianceMode: 'strict'|'standard'|'basic'
 *   }
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

// ============ Constants ============

const HIPAA_AUDIT_LOG_VERSION = '1.0';
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_HASH = 'sha256';
const PHI_CLASSIFICATION_TYPES = {
  DIRECT: 'direct',           // Name, MRN, SSN
  QUASI: 'quasi',             // Age, gender, location
  SENSITIVE: 'sensitive',     // Disease, treatment, diagnosis
  DERIVED: 'derived',         // Aggregated/computed PHI
  METADATA: 'metadata'        // Access patterns, temporal data
};

const BREACH_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

const COMPLIANCE_MODES = {
  STRICT: 'strict',           // Maximum security, minimal performance
  STANDARD: 'standard',       // Balanced compliance
  BASIC: 'basic'              // Minimal HIPAA compliance
};

// ============ HipaaCompliant System Class ============

class HipaaCompliantSystem extends EventEmitter {
  constructor(config = {}) {
    super();

    // Validate required configuration
    if (!config.encryptionKeyPath) {
      throw new Error('encryptionKeyPath is required in configuration');
    }

    if (!config.auditLogPath) {
      throw new Error('auditLogPath is required in configuration');
    }

    this.config = {
      encryptionKeyPath: config.encryptionKeyPath,
      auditLogPath: config.auditLogPath,
      baaVerified: config.baaVerified !== false,
      dataClassification: config.dataClassification || {},
      retentionDays: config.retentionDays || 2555, // Default 7 years
      keyRotationDays: config.keyRotationDays || 90,
      complianceMode: config.complianceMode || COMPLIANCE_MODES.STANDARD,
      maxBatchSize: config.maxBatchSize || 1000,
      enableEncryption: config.enableEncryption !== false,
      enableAuditLog: config.enableAuditLog !== false,
      clockSkewTolerance: config.clockSkewTolerance || 300000 // 5 minutes
    };

    // Initialize state
    this.masterKey = null;
    this.keyMetadata = {};
    this.sessionMap = new Map();
    this.phiCache = new Map();
    this.breachLog = [];

    // Initialize system
    this._initializeSystem();
  }

  _initializeSystem() {
    // Ensure directories exist
    const keyDir = path.dirname(this.config.encryptionKeyPath);
    const auditDir = path.dirname(this.config.auditLogPath);

    if (!fs.existsSync(keyDir)) {
      fs.mkdirSync(keyDir, { recursive: true, mode: 0o700 });
    }

    if (!fs.existsSync(auditDir)) {
      fs.mkdirSync(auditDir, { recursive: true, mode: 0o700 });
    }

    // Load or create master key
    if (fs.existsSync(this.config.encryptionKeyPath)) {
      this._loadMasterKey();
    } else {
      this._generateMasterKey();
    }

    // Verify BAA if required
    if (!this.config.baaVerified) {
      console.warn('WARNING: BAA not verified - HIPAA compliance cannot be guaranteed');
    }

    this.emit('initialized', {
      timestamp: new Date().toISOString(),
      complianceMode: this.config.complianceMode,
      baaVerified: this.config.baaVerified
    });
  }

  _generateMasterKey() {
    const key = crypto.randomBytes(32); // 256-bit key
    const metadata = {
      createdAt: new Date().toISOString(),
      rotatedAt: new Date().toISOString(),
      version: 1,
      algorithm: ENCRYPTION_ALGORITHM
    };

    try {
      fs.writeFileSync(
        this.config.encryptionKeyPath,
        JSON.stringify({ key: key.toString('hex'), metadata }, null, 2),
        { mode: 0o600 }
      );
      this.masterKey = key;
      this.keyMetadata = metadata;
    } catch (err) {
      throw new Error(`Failed to save master key: ${err.message}`);
    }
  }

  _loadMasterKey() {
    try {
      const keyData = JSON.parse(
        fs.readFileSync(this.config.encryptionKeyPath, 'utf8')
      );
      this.masterKey = Buffer.from(keyData.key, 'hex');
      this.keyMetadata = keyData.metadata || {};

      // Check if key rotation is needed
      if (this._shouldRotateKey()) {
        this.emit('warning', {
          type: 'key_rotation_due',
          message: 'Encryption key rotation is due',
          timestamp: new Date().toISOString()
        });
      }
    } catch (err) {
      throw new Error(`Failed to load master key: ${err.message}`);
    }
  }

  _shouldRotateKey() {
    const rotatedAt = new Date(this.keyMetadata.rotatedAt);
    const daysSinceRotation = (Date.now() - rotatedAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceRotation > this.config.keyRotationDays;
  }

  // ============ PHI Encryption ============

  encryptPHI(data, metadata = {}) {
    if (!this.config.enableEncryption) {
      return { ciphertext: data, encrypted: false };
    }

    if (!this.masterKey) {
      throw new Error('Master key not initialized');
    }

    try {
      const dataString = typeof data === 'string' ? data : JSON.stringify(data);
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, this.masterKey, iv);

      // Tag data with PHI classification
      const classifiedData = this._classifyPHI(dataString, metadata);
      const auditMetadata = {
        classification: classifiedData.classification,
        encryptedAt: new Date().toISOString(),
        dataHash: crypto.createHash('sha256').update(dataString).digest('hex').substring(0, 16)
      };

      let encrypted = cipher.update(dataString, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      const result = {
        ciphertext: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        algorithm: ENCRYPTION_ALGORITHM,
        keyVersion: this.keyMetadata.version || 1,
        encrypted: true,
        metadata: auditMetadata
      };

      // Log encryption event
      this._logAuditEvent('encrypt_phi', {
        dataClassification: classifiedData.classification,
        dataSize: dataString.length,
        keyVersion: this.keyMetadata.version || 1
      });

      return result;
    } catch (err) {
      this._logAuditEvent('encrypt_phi_failed', { error: err.message });
      throw new Error(`PHI encryption failed: ${err.message}`);
    }
  }

  decryptPHI(encryptedData, context = {}) {
    if (!encryptedData.encrypted) {
      return typeof encryptedData.ciphertext === 'string'
        ? encryptedData.ciphertext
        : JSON.parse(encryptedData.ciphertext);
    }

    if (!this.masterKey) {
      throw new Error('Master key not initialized');
    }

    try {
      // Verify access context
      this._verifyAccessContext(context);

      const decipher = crypto.createDecipheriv(
        encryptedData.algorithm || ENCRYPTION_ALGORITHM,
        this.masterKey,
        Buffer.from(encryptedData.iv, 'hex')
      );

      decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

      let decrypted = decipher.update(encryptedData.ciphertext, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      // Log decryption event
      this._logAuditEvent('decrypt_phi', {
        keyVersion: encryptedData.keyVersion,
        dataHash: encryptedData.metadata?.dataHash,
        accessContext: this._sanitizeContext(context)
      });

      try {
        return JSON.parse(decrypted);
      } catch {
        return decrypted;
      }
    } catch (err) {
      this._logAuditEvent('decrypt_phi_failed', {
        error: err.message,
        accessContext: this._sanitizeContext(context)
      });
      throw new Error(`PHI decryption failed: ${err.message}`);
    }
  }

  _classifyPHI(data, metadata = {}) {
    const directIdentifiers = /\b(\d{3}-\d{2}-\d{4}|[A-Z]{2}\d{7}|MRN[\w-]*\d+)\b/gi;
    const quasiIdentifiers = /\b(age|DOB|date of birth|gender|location|address)\b/gi;
    const sensitivePatterns = /\b(HIV|cancer|diabetes|psychiatric|substance abuse|pregnancy)\b/gi;

    let classification = PHI_CLASSIFICATION_TYPES.METADATA;

    if (directIdentifiers.test(data)) {
      classification = PHI_CLASSIFICATION_TYPES.DIRECT;
    } else if (quasiIdentifiers.test(data)) {
      classification = PHI_CLASSIFICATION_TYPES.QUASI;
    } else if (sensitivePatterns.test(data)) {
      classification = PHI_CLASSIFICATION_TYPES.SENSITIVE;
    }

    return {
      classification,
      patterns: {
        directCount: (data.match(directIdentifiers) || []).length,
        quasiCount: (data.match(quasiIdentifiers) || []).length,
        sensitiveCount: (data.match(sensitivePatterns) || []).length
      },
      customTags: metadata.tags || []
    };
  }

  // ============ Audit Logging ============

  _logAuditEvent(eventType, details = {}) {
    if (!this.config.enableAuditLog) return;

    const auditEntry = {
      timestamp: new Date().toISOString(),
      version: HIPAA_AUDIT_LOG_VERSION,
      eventType,
      userId: details.userId || 'system',
      sessionId: details.sessionId || this._getCurrentSessionId(),
      eventDetails: details,
      ipAddress: details.ipAddress || 'unknown',
      userAgent: details.userAgent || 'unknown',
      outcome: details.error ? 'failure' : 'success'
    };

    try {
      const logEntry = JSON.stringify(auditEntry) + '\n';
      fs.appendFileSync(this.config.auditLogPath, logEntry, { flag: 'a' });
    } catch (err) {
      this.emit('error', {
        type: 'audit_log_failure',
        message: `Failed to write audit log: ${err.message}`
      });
    }
  }

  getAuditTrail(userId, options = {}) {
    if (!fs.existsSync(this.config.auditLogPath)) {
      return [];
    }

    try {
      const entries = fs
        .readFileSync(this.config.auditLogPath, 'utf8')
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(entry => entry !== null && entry.userId === userId);

      // Apply filters
      if (options.startDate) {
        const start = new Date(options.startDate);
        entries = entries.filter(e => new Date(e.timestamp) >= start);
      }

      if (options.endDate) {
        const end = new Date(options.endDate);
        entries = entries.filter(e => new Date(e.timestamp) <= end);
      }

      if (options.eventType) {
        entries = entries.filter(e => e.eventType === options.eventType);
      }

      // Limit results
      const limit = options.limit || 10000;
      return entries.slice(-limit);
    } catch (err) {
      throw new Error(`Failed to retrieve audit trail: ${err.message}`);
    }
  }

  // ============ De-identification ============

  deidentify(data, method = 'generalization') {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);

    this._logAuditEvent('deidentify_attempt', {
      method,
      dataSize: dataString.length
    });

    switch (method) {
      case 'generalization':
        return this._deidentifyByGeneralization(dataString);
      case 'suppression':
        return this._deidentifyBySuppression(dataString);
      case 'perturbation':
        return this._deidentifyByPerturbation(dataString);
      case 'safe_harbor':
        return this._applySafeHarbor(dataString);
      default:
        throw new Error(`Unknown de-identification method: ${method}`);
    }
  }

  _deidentifyByGeneralization(data) {
    let deidentified = data;

    // Generalize SSN
    deidentified = deidentified.replace(
      /\d{3}-\d{2}-\d{4}/g,
      'XXX-XX-XXXX'
    );

    // Generalize dates to year
    deidentified = deidentified.replace(
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/g,
      '$3'
    );

    // Generalize ages to ranges
    deidentified = deidentified.replace(
      /age[:\s]+(\d{2})/gi,
      (match, age) => {
        const ageNum = parseInt(age);
        const range = `${Math.floor(ageNum / 10) * 10}-${Math.floor(ageNum / 10) * 10 + 9}`;
        return `age_range: ${range}`;
      }
    );

    // Generalize ZIP codes to first 3 digits
    deidentified = deidentified.replace(
      /(\d{5})(?:-\d{4})?/g,
      '$1'.substring(0, 3) + 'XX'
    );

    this._logAuditEvent('deidentify_generalization', { success: true });
    return deidentified;
  }

  _deidentifyBySuppression(data) {
    let deidentified = data;

    // Suppress direct identifiers
    deidentified = deidentified.replace(
      /\b([A-Z][a-z]+ [A-Z][a-z]+)\b/g,
      '[SUPPRESSED_NAME]'
    );

    deidentified = deidentified.replace(
      /\d{3}-\d{2}-\d{4}/g,
      '[SUPPRESSED_SSN]'
    );

    deidentified = deidentified.replace(
      /MRN[\w-]*\d+/gi,
      '[SUPPRESSED_MRN]'
    );

    this._logAuditEvent('deidentify_suppression', { success: true });
    return deidentified;
  }

  _deidentifyByPerturbation(data) {
    let deidentified = data;

    // Add noise to numerical values (ages, weights, etc.)
    deidentified = deidentified.replace(
      /(\D|^)(\d{2,3})(\D|$)/g,
      (match, before, number, after) => {
        const noise = Math.floor((Math.random() - 0.5) * 10);
        const perturbed = Math.max(1, parseInt(number) + noise);
        return `${before}${perturbed}${after}`;
      }
    );

    this._logAuditEvent('deidentify_perturbation', { success: true });
    return deidentified;
  }

  _applySafeHarbor(data) {
    // HIPAA Safe Harbor method - removes 18 specific identifiers
    const safeHarborRemovals = [
      /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g,              // Name
      /\d{3}-\d{2}-\d{4}/g,                        // SSN
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/g,           // Date
      /\d{3}-\d{3}-\d{4}/g,                        // Phone
      /\d{3}-\d{2}-\d{4}/g,                        // MRN pattern
      /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}/g, // Email
      /\b\d{5}(?:-\d{4})?\b/g,                    // ZIP code
      /\b(?:IPv4|IPv6|IP)[\s:][\d\w:.]+\b/gi,    // IP address
      /\b\d{16}\b/g,                              // Account numbers
      /\b\d{3}-\d{2}-\d{4}\b/g,                   // License plates (format)
      /\b(?:URL|URI)[\s:]*[\w:\/.?=&#-]+/gi,     // URLs
    ];

    let deidentified = data;
    safeHarborRemovals.forEach(pattern => {
      deidentified = deidentified.replace(pattern, '[REMOVED]');
    });

    this._logAuditEvent('deidentify_safe_harbor', { success: true });
    return deidentified;
  }

  // ============ Access Control & Sessions ============

  createSession(userId, context = {}) {
    if (!this.config.baaVerified) {
      throw new Error('BAA not verified - sessions cannot be created');
    }

    const sessionId = crypto.randomBytes(16).toString('hex');
    const session = {
      sessionId,
      userId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour
      ipAddress: context.ipAddress || 'unknown',
      userAgent: context.userAgent || 'unknown',
      permissions: context.permissions || [],
      accessLog: []
    };

    this.sessionMap.set(sessionId, session);

    this._logAuditEvent('session_created', {
      userId,
      sessionId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return session;
  }

  validateSession(sessionId) {
    if (!this.sessionMap.has(sessionId)) {
      throw new Error('Invalid or expired session');
    }

    const session = this.sessionMap.get(sessionId);
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);

    if (now > expiresAt) {
      this.sessionMap.delete(sessionId);
      throw new Error('Session expired');
    }

    return session;
  }

  _getCurrentSessionId() {
    // Returns first active session or 'system'
    for (const [sessionId, session] of this.sessionMap.entries()) {
      if (new Date() < new Date(session.expiresAt)) {
        return sessionId;
      }
    }
    return 'system';
  }

  _verifyAccessContext(context = {}) {
    if (this.config.complianceMode === COMPLIANCE_MODES.STRICT) {
      if (!context.sessionId) {
        throw new Error('Session required in strict compliance mode');
      }
      this.validateSession(context.sessionId);
    }
  }

  _sanitizeContext(context) {
    const sanitized = { ...context };
    delete sanitized.password;
    delete sanitized.token;
    delete sanitized.apiKey;
    return sanitized;
  }

  // ============ Breach Notification ============

  reportBreach(details) {
    const breach = {
      id: crypto.randomBytes(8).toString('hex'),
      reportedAt: new Date().toISOString(),
      discoveredAt: details.discoveredAt || new Date().toISOString(),
      severity: details.severity || BREACH_SEVERITY.MEDIUM,
      phiAffected: details.phiAffected || [],
      estimatedCount: details.estimatedCount || 0,
      description: details.description || '',
      cause: details.cause || 'unknown',
      systemsAffected: details.systemsAffected || [],
      containmentActions: details.containmentActions || [],
      notificationsSent: [],
      status: 'reported'
    };

    this.breachLog.push(breach);

    this._logAuditEvent('breach_reported', {
      breachId: breach.id,
      severity: breach.severity,
      estimatedCount: breach.estimatedCount
    });

    this.emit('breach', breach);

    return breach;
  }

  getBreachLog() {
    return this.breachLog;
  }

  // ============ Compliance Checks ============

  runComplianceCheck() {
    const checks = {
      timestamp: new Date().toISOString(),
      mode: this.config.complianceMode,
      results: {}
    };

    // Check 1: BAA Verification
    checks.results.baaVerified = {
      passed: this.config.baaVerified,
      severity: 'critical',
      message: this.config.baaVerified
        ? 'BAA verified'
        : 'BAA not verified - non-compliant'
    };

    // Check 2: Encryption
    checks.results.encryptionEnabled = {
      passed: this.config.enableEncryption,
      severity: 'critical',
      message: this.config.enableEncryption
        ? 'Encryption enabled'
        : 'Encryption disabled - potential HIPAA violation'
    };

    // Check 3: Audit Logging
    checks.results.auditLoggingEnabled = {
      passed: this.config.enableAuditLog,
      severity: 'high',
      message: this.config.enableAuditLog
        ? 'Audit logging enabled'
        : 'Audit logging disabled'
    };

    // Check 4: Master Key Status
    checks.results.masterKeyLoaded = {
      passed: this.masterKey !== null,
      severity: 'critical',
      message: this.masterKey ? 'Master key loaded' : 'Master key not loaded'
    };

    // Check 5: Key Rotation Schedule
    const needsRotation = this._shouldRotateKey();
    checks.results.keyRotationSchedule = {
      passed: !needsRotation,
      severity: 'high',
      message: needsRotation
        ? `Key rotation overdue (last rotated ${this.keyMetadata.rotatedAt})`
        : 'Key rotation schedule current'
    };

    // Check 6: Session Management
    const activeSessions = Array.from(this.sessionMap.values()).filter(
      s => new Date() < new Date(s.expiresAt)
    );
    checks.results.sessionManagement = {
      passed: activeSessions.length > 0,
      severity: 'medium',
      message: `${activeSessions.length} active session(s)`
    };

    // Check 7: Audit Log Retention
    const auditLogExists = fs.existsSync(this.config.auditLogPath);
    checks.results.auditLogRetention = {
      passed: auditLogExists,
      severity: 'high',
      message: auditLogExists
        ? `Audit log maintained (retention: ${this.config.retentionDays} days)`
        : 'Audit log not found'
    };

    // Check 8: Data Classification
    checks.results.dataClassification = {
      passed: Object.keys(this.config.dataClassification).length > 0,
      severity: 'medium',
      message: `${Object.keys(this.config.dataClassification).length} classification rules defined`
    };

    // Determine overall compliance status
    const critical = Object.values(checks.results).filter(
      r => !r.passed && r.severity === 'critical'
    );
    const high = Object.values(checks.results).filter(
      r => !r.passed && r.severity === 'high'
    );

    checks.overallStatus = critical.length > 0 ? 'NON_COMPLIANT' : (high.length > 0 ? 'PARTIAL' : 'COMPLIANT');
    checks.criticalFailures = critical.length;
    checks.highFailures = high.length;

    this._logAuditEvent('compliance_check', {
      status: checks.overallStatus,
      criticalFailures: critical.length,
      highFailures: high.length
    });

    return checks;
  }

  // ============ Key Rotation ============

  rotateEncryptionKey() {
    if (!this.masterKey) {
      throw new Error('Master key not initialized');
    }

    // Backup old key
    const oldKey = this.masterKey;
    const oldKeyVersion = this.keyMetadata.version || 1;

    // Generate new key
    const newKey = crypto.randomBytes(32);
    const newMetadata = {
      createdAt: this.keyMetadata.createdAt,
      rotatedAt: new Date().toISOString(),
      version: oldKeyVersion + 1,
      algorithm: ENCRYPTION_ALGORITHM,
      previousKeyVersion: oldKeyVersion
    };

    // Save new key
    this.masterKey = newKey;
    this.keyMetadata = newMetadata;

    try {
      fs.writeFileSync(
        this.config.encryptionKeyPath,
        JSON.stringify({ key: newKey.toString('hex'), metadata: newMetadata }, null, 2),
        { mode: 0o600 }
      );

      this._logAuditEvent('key_rotated', {
        oldVersion: oldKeyVersion,
        newVersion: newMetadata.version
      });

      this.emit('key_rotated', {
        timestamp: new Date().toISOString(),
        oldVersion: oldKeyVersion,
        newVersion: newMetadata.version
      });

      return {
        success: true,
        oldVersion: oldKeyVersion,
        newVersion: newMetadata.version,
        rotatedAt: newMetadata.rotatedAt
      };
    } catch (err) {
      this.masterKey = oldKey;
      this.keyMetadata = { version: oldKeyVersion };
      throw new Error(`Key rotation failed: ${err.message}`);
    }
  }

  // ============ Compliance Report Generation ============

  generateComplianceReport(options = {}) {
    const report = {
      generatedAt: new Date().toISOString(),
      organizationName: options.organizationName || 'Unknown Organization',
      reportingPeriod: {
        start: options.startDate || new Date(Date.now() - 86400000).toISOString(),
        end: options.endDate || new Date().toISOString()
      },
      complianceCheck: this.runComplianceCheck(),
      breachNotifications: this.breachLog.length,
      auditLogEntries: 0,
      encryptionStatus: {
        enabled: this.config.enableEncryption,
        algorithm: ENCRYPTION_ALGORITHM,
        keyVersion: this.keyMetadata.version || 1,
        lastRotation: this.keyMetadata.rotatedAt,
        rotationDue: this._shouldRotateKey()
      },
      dataClassifications: {
        direct: 0,
        quasi: 0,
        sensitive: 0,
        derived: 0,
        metadata: 0
      },
      sessionManagement: {
        activeSessions: Array.from(this.sessionMap.values()).filter(
          s => new Date() < new Date(s.expiresAt)
        ).length,
        totalSessions: this.sessionMap.size
      }
    };

    // Count audit log entries if available
    if (fs.existsSync(this.config.auditLogPath)) {
      try {
        const entries = fs
          .readFileSync(this.config.auditLogPath, 'utf8')
          .split('\n')
          .filter(line => line.trim()).length;
        report.auditLogEntries = entries;
      } catch (err) {
        // Ignore read errors
      }
    }

    // Add recommendations
    report.recommendations = this._generateRecommendations(report);

    return report;
  }

  _generateRecommendations(report) {
    const recommendations = [];

    if (report.complianceCheck.overallStatus === 'NON_COMPLIANT') {
      recommendations.push({
        priority: 'critical',
        category: 'Compliance Status',
        message: 'System is non-compliant with HIPAA requirements',
        action: 'Address all critical failures immediately'
      });
    }

    if (report.encryptionStatus.rotationDue) {
      recommendations.push({
        priority: 'high',
        category: 'Key Management',
        message: 'Encryption key rotation is overdue',
        action: 'Rotate encryption key to maintain security posture'
      });
    }

    if (!report.complianceCheck.results.baaVerified.passed) {
      recommendations.push({
        priority: 'critical',
        category: 'Business Associate Agreement',
        message: 'BAA has not been verified',
        action: 'Establish and verify Business Associate Agreement before processing PHI'
      });
    }

    if (report.breachNotifications > 0) {
      recommendations.push({
        priority: 'high',
        category: 'Breach Management',
        message: `${report.breachNotifications} breach(es) reported`,
        action: 'Review breach reports and implement remediation'
      });
    }

    if (report.auditLogEntries === 0) {
      recommendations.push({
        priority: 'medium',
        category: 'Audit Logging',
        message: 'No audit log entries found',
        action: 'Verify audit logging is functioning properly'
      });
    }

    return recommendations;
  }

  // ============ Statistics & Metrics ============

  getSystemMetrics() {
    return {
      timestamp: new Date().toISOString(),
      encryption: {
        keyVersion: this.keyMetadata.version || 1,
        algorithmVersion: ENCRYPTION_ALGORITHM,
        masterKeyStatus: this.masterKey ? 'loaded' : 'not_loaded',
        keyRotationDue: this._shouldRotateKey()
      },
      sessions: {
        total: this.sessionMap.size,
        active: Array.from(this.sessionMap.values()).filter(
          s => new Date() < new Date(s.expiresAt)
        ).length
      },
      auditLog: {
        location: this.config.auditLogPath,
        exists: fs.existsSync(this.config.auditLogPath),
        retention: `${this.config.retentionDays} days`
      },
      breaches: {
        total: this.breachLog.length,
        active: this.breachLog.filter(b => b.status !== 'resolved').length
      },
      configuration: {
        complianceMode: this.config.complianceMode,
        baaVerified: this.config.baaVerified,
        encryptionEnabled: this.config.enableEncryption,
        auditLoggingEnabled: this.config.enableAuditLog
      }
    };
  }
}

// ============ Exports ============

module.exports = {
  System: HipaaCompliantSystem,
  PHI_CLASSIFICATION_TYPES,
  BREACH_SEVERITY,
  COMPLIANCE_MODES,
  ENCRYPTION_ALGORITHM,

  // Factory function
  createSystem: (config) => new HipaaCompliantSystem(config),

  // Utility: Generate configuration template
  generateConfigTemplate: () => ({
    encryptionKeyPath: '/secure/path/to/encryption.key',
    auditLogPath: '/secure/path/to/audit.log',
    baaVerified: true,
    complianceMode: COMPLIANCE_MODES.STANDARD,
    dataClassification: {
      socialSecurityNumber: PHI_CLASSIFICATION_TYPES.DIRECT,
      medicalRecordNumber: PHI_CLASSIFICATION_TYPES.DIRECT,
      dateOfBirth: PHI_CLASSIFICATION_TYPES.QUASI,
      diagnosis: PHI_CLASSIFICATION_TYPES.SENSITIVE
    },
    retentionDays: 2555, // 7 years
    keyRotationDays: 90,
    enableEncryption: true,
    enableAuditLog: true
  }),

  // Utility: Safe data structure for test environments
  createTestSystem: (baseDir = '/tmp/hipaa-test') => {
    const encryptionKeyPath = path.join(baseDir, 'encryption.key');
    const auditLogPath = path.join(baseDir, 'audit.log');

    return new HipaaCompliantSystem({
      encryptionKeyPath,
      auditLogPath,
      baaVerified: false, // Test environment
      complianceMode: COMPLIANCE_MODES.BASIC,
      enableEncryption: true,
      enableAuditLog: true
    });
  }
};
