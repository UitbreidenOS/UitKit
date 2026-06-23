/**
 * Audit Automation Integration Examples
 *
 * Practical examples showing how to use the AuditEngine with various data sources
 * and compliance frameworks, including SOC2 Type II audits and financial data analysis.
 */

const {
  AuditEngine,
  COMPLIANCE_FRAMEWORKS,
  RISK_LEVELS,
} = require('./audit-automation');

// ============================================================================
// EXAMPLE 1: SOC2 Type II Financial Audit
// ============================================================================

async function example1_SOC2TypeIIFinancialAudit() {
  console.log('\n📊 EXAMPLE 1: SOC2 Type II Financial Audit\n');

  const engine = new AuditEngine({
    framework: COMPLIANCE_FRAMEWORKS.SOC2_TYPE_II,
    samplingRate: 0.15,
    enableAutomation: true,
  });

  // Set up event listeners for real-time monitoring
  engine.on('phase:start', ({ phase, auditId }) => {
    console.log(`  ▶ Starting ${phase.replace(/_/g, ' ').toUpperCase()}...`);
  });

  engine.on('phase:complete', ({ phase, duration }) => {
    console.log(`  ✓ ${phase.replace(/_/g, ' ')} completed in ${duration.toFixed(0)}ms`);
  });

  engine.on('collector:complete', ({ collector, itemsCount }) => {
    console.log(`    • ${collector}: ${itemsCount} items collected`);
  });

  // Financial data source configuration
  const financialDataSource = {
    type: 'database',
    domain: 'finance.company.com',
    tables: ['accounts', 'transactions', 'users', 'audit_logs', 'access_logs'],
    size: 1.5,
    complexity: 2.0,
    timeRange: {
      start: Date.now() - 90 * 24 * 60 * 60 * 1000, // 90 days
      end: Date.now(),
    },
  };

  try {
    // Run the audit
    const result = await engine.runAudit(financialDataSource, {
      owner: 'Security Team',
      auditType: 'annual',
    });

    console.log('\n📋 AUDIT RESULTS:');
    console.log(`  Audit ID: ${result.auditId}`);
    console.log(`  Status: ${result.status}`);
    console.log(`  Duration: ${(result.metrics.timeElapsed / 1000).toFixed(2)}s`);
    console.log(`  Evidence Collected: ${result.metrics.evidenceItems}`);
    console.log(`  Findings: ${result.findings.length}`);
    console.log(`  Risk Register Items: ${result.riskRegister.length}`);

    // Display findings summary
    if (result.findings.length > 0) {
      console.log('\n🚨 FINDINGS SUMMARY:');
      result.findings.slice(0, 5).forEach((finding, i) => {
        console.log(`  ${i + 1}. [${finding.severity || 'UNKNOWN'}] ${finding.type}`);
      });
      if (result.findings.length > 5) {
        console.log(`  ... and ${result.findings.length - 5} more findings`);
      }
    }

    // Display risk register
    if (result.riskRegister.length > 0) {
      console.log('\n⚠️  RISK REGISTER (Top 5):');
      result.riskRegister.slice(0, 5).forEach((risk) => {
        console.log(`  • [${risk.severity.toUpperCase()}] ${risk.finding}`);
        console.log(`    Score: ${risk.riskScore.toFixed(1)}/100 | Due: ${risk.dueDate.toLocaleDateString()}`);
      });
    }

    // Display compliance summary
    const compliance = result.report.compliance;
    console.log('\n✅ COMPLIANCE STATUS:');
    console.log(`  Framework: ${compliance.framework}`);
    console.log(`  Compliance Rate: ${compliance.compliancePercentage.toFixed(1)}%`);
    console.log(`  Compliant Controls: ${compliance.compliantControls}/${compliance.controls.length}`);

    return result;
  } catch (error) {
    console.error('❌ Audit failed:', error.message);
    throw error;
  }
}

// ============================================================================
// EXAMPLE 2: Continuous API Audit with Real-Time Monitoring
// ============================================================================

async function example2_ContinuousAPIAudit() {
  console.log('\n📡 EXAMPLE 2: Continuous API Audit with Real-Time Monitoring\n');

  const engine = new AuditEngine({
    framework: COMPLIANCE_FRAMEWORKS.SOC2_TYPE_II,
    samplingRate: 0.2,
    maxConcurrentCollectors: 10,
  });

  // API data source
  const apiDataSource = {
    type: 'api',
    domain: 'api.company.com',
    endpoints: ['/users', '/transactions', '/accounts', '/auth', '/admin'],
    size: 2.0,
    complexity: 1.5,
  };

  // Run audit with custom options
  try {
    const result = await engine.runAudit(apiDataSource, {
      owner: 'API Security Team',
      monitoring: true,
    });

    console.log(`✓ API Audit Complete: ${result.metrics.evidenceItems} items`);

    // Display metrics
    const metrics = result.report.metrics;
    console.log('\n📊 PERFORMANCE METRICS:');
    console.log(`  Audit Duration: ${metrics.auditMetrics.totalDuration}`);
    console.log(`  Collectors Executed: ${metrics.auditMetrics.collectorsExecuted}`);
    console.log(`  Automation Rate: ${metrics.auditMetrics.automationRate}`);
    console.log(`  Estimated Manual Time: ${metrics.timeReduction.estimatedManualTime}`);
    console.log(`  Time Saved: ${metrics.timeReduction.timeSaved}`);

    return result;
  } catch (error) {
    console.error('❌ API Audit failed:', error.message);
    throw error;
  }
}

// ============================================================================
// EXAMPLE 3: Log-Based Anomaly Detection Audit
// ============================================================================

async function example3_LogAnomalyAudit() {
  console.log('\n🔍 EXAMPLE 3: Log-Based Anomaly Detection Audit\n');

  const engine = new AuditEngine({
    framework: COMPLIANCE_FRAMEWORKS.SOC2_TYPE_II,
    confidenceThreshold: 0.80,
  });

  // Logs data source
  const logsDataSource = {
    type: 'logs',
    sources: ['system_logs', 'access_logs', 'database_logs', 'api_logs'],
    size: 3.0,
    complexity: 2.5,
    timeRange: {
      start: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days
      end: Date.now(),
    },
  };

  try {
    const result = await engine.runAudit(logsDataSource, {
      owner: 'Security Operations',
      anomalyDetection: true,
    });

    console.log(`✓ Anomaly Detection Complete`);

    // Analyze patterns
    const analysis = {
      anomalies: result.findings.filter((f) => f.type === 'anomaly'),
      patterns: result.findings.filter((f) => f.type === 'pattern'),
      deviations: result.findings.filter((f) => f.type === 'deviation'),
    };

    console.log('\n🎯 ANALYSIS RESULTS:');
    console.log(`  Anomalies Detected: ${analysis.anomalies.length}`);
    console.log(`  Patterns Identified: ${analysis.patterns.length}`);
    console.log(`  Compliance Deviations: ${analysis.deviations.length}`);

    // Display critical findings
    const criticalFindings = result.riskRegister.filter(
      (r) => r.severity === RISK_LEVELS.CRITICAL
    );

    if (criticalFindings.length > 0) {
      console.log('\n🚨 CRITICAL FINDINGS:');
      criticalFindings.forEach((finding) => {
        console.log(`  • ${finding.finding}`);
        console.log(`    Risk Score: ${finding.riskScore.toFixed(1)}/100`);
      });
    }

    return result;
  } catch (error) {
    console.error('❌ Anomaly detection audit failed:', error.message);
    throw error;
  }
}

// ============================================================================
// EXAMPLE 4: Custom Framework Integration (ISO 27001)
// ============================================================================

async function example4_ISO27001Audit() {
  console.log('\n🔐 EXAMPLE 4: ISO 27001 Compliance Audit\n');

  const engine = new AuditEngine({
    framework: COMPLIANCE_FRAMEWORKS.ISO27001,
    samplingRate: 0.12,
  });

  // Directory/file system source
  const dirDataSource = {
    type: 'directory',
    path: '/var/www/financial_app',
    size: 1.0,
    complexity: 1.5,
  };

  try {
    const result = await engine.runAudit(dirDataSource, {
      owner: 'Compliance Team',
      framework: COMPLIANCE_FRAMEWORKS.ISO27001,
    });

    console.log(`✓ ISO 27001 Audit Complete`);

    // Remediation planning
    const plan = result.report.remediation;
    console.log('\n📋 REMEDIATION PLAN:');
    console.log(`  Total Items: ${plan.totalItems}`);

    Object.keys(plan.byPriority).forEach((priority) => {
      const items = plan.byPriority[priority];
      console.log(`  ${priority.toUpperCase()}: ${items.count} items`);
    });

    // Timeline
    if (plan.timeline.length > 0) {
      console.log('\n📅 REMEDIATION TIMELINE:');
      plan.timeline.forEach((phase) => {
        const startDate = new Date(phase.startDate).toLocaleDateString();
        const dueDate = new Date(phase.dueDate).toLocaleDateString();
        console.log(`  ${phase.priority}: ${phase.count} items (${startDate} - ${dueDate})`);
      });
    }

    return result;
  } catch (error) {
    console.error('❌ ISO 27001 audit failed:', error.message);
    throw error;
  }
}

// ============================================================================
// EXAMPLE 5: Audit Report Export
// ============================================================================

async function example5_ReportExport() {
  console.log('\n📄 EXAMPLE 5: Audit Report Export\n');

  const engine = new AuditEngine({
    framework: COMPLIANCE_FRAMEWORKS.SOC2_TYPE_II,
  });

  const dataSource = {
    type: 'database',
    tables: ['users', 'transactions'],
    size: 1.0,
    complexity: 1.0,
  };

  try {
    const result = await engine.runAudit(dataSource);

    // Create exportable report
    const exportReport = {
      metadata: {
        auditId: result.auditId,
        timestamp: new Date().toISOString(),
        framework: result.report.framework,
        compliance: result.report.compliance.compliancePercentage,
      },
      executive_summary: result.report.executiveSummary,
      findings: result.report.findings.map((f) => ({
        id: f.id,
        type: f.type,
        severity: f.formattedSeverity,
        message: f.message || f.type,
        remediation: f.remediation,
      })),
      risk_register: result.report.riskRegister.map((r) => ({
        id: r.id,
        finding: r.finding,
        severity: r.severity,
        score: r.riskScore,
        status: r.status,
        owner: r.owner,
        dueDate: r.dueDate.toISOString(),
      })),
      remediation_plan: result.report.remediation,
      metrics: result.report.metrics,
    };

    console.log('📊 EXPORTABLE REPORT GENERATED:');
    console.log(`  Audit ID: ${exportReport.metadata.auditId}`);
    console.log(`  Framework: ${exportReport.metadata.framework}`);
    console.log(`  Compliance: ${exportReport.metadata.compliance.toFixed(1)}%`);
    console.log(`  Findings: ${exportReport.findings.length}`);
    console.log(`  Risk Items: ${exportReport.risk_register.length}`);

    // Show sample JSON export
    console.log('\n💾 SAMPLE JSON EXPORT (First Finding):');
    if (exportReport.findings.length > 0) {
      console.log(JSON.stringify(exportReport.findings[0], null, 2));
    }

    return exportReport;
  } catch (error) {
    console.error('❌ Report export failed:', error.message);
    throw error;
  }
}

// ============================================================================
// EXAMPLE 6: Real-Time Audit Monitoring
// ============================================================================

async function example6_RealTimeMonitoring() {
  console.log('\n⏱️  EXAMPLE 6: Real-Time Audit Monitoring\n');

  const engine = new AuditEngine({
    framework: COMPLIANCE_FRAMEWORKS.SOC2_TYPE_II,
  });

  // Comprehensive event tracking
  const eventLog = [];

  engine.on('audit:start', (data) => {
    console.log(`  ⏰ Audit started: ${data.auditId}`);
    eventLog.push({ timestamp: Date.now(), event: 'audit:start' });
  });

  engine.on('phase:start', ({ phase }) => {
    console.log(`  ▶ Phase: ${phase}`);
    eventLog.push({ timestamp: Date.now(), event: 'phase:start', phase });
  });

  engine.on('phase:complete', ({ phase, duration }) => {
    console.log(`  ✓ Phase complete: ${phase} (${duration.toFixed(0)}ms)`);
    eventLog.push({ timestamp: Date.now(), event: 'phase:complete', phase, duration });
  });

  engine.on('collector:complete', ({ collector, itemsCount }) => {
    console.log(`  📦 Collector: ${collector} → ${itemsCount} items`);
    eventLog.push({ timestamp: Date.now(), event: 'collector:complete', collector, itemsCount });
  });

  engine.on('evidence:collected', ({ count }) => {
    console.log(`  📊 Total evidence: ${count} items`);
    eventLog.push({ timestamp: Date.now(), event: 'evidence:collected', count });
  });

  engine.on('evidence:analyzed', ({ findingsCount }) => {
    console.log(`  🔍 Analysis complete: ${findingsCount} findings`);
    eventLog.push({ timestamp: Date.now(), event: 'evidence:analyzed', findingsCount });
  });

  engine.on('risks:scored', ({ count, overallRisk }) => {
    console.log(`  ⚠️  Risks scored: ${count} items (Overall risk: ${overallRisk.toFixed(1)})`);
    eventLog.push({ timestamp: Date.now(), event: 'risks:scored', count, overallRisk });
  });

  engine.on('report:generated', ({ auditId }) => {
    console.log(`  📄 Report generated for ${auditId}`);
    eventLog.push({ timestamp: Date.now(), event: 'report:generated' });
  });

  engine.on('audit:complete', ({ duration, findingsCount }) => {
    console.log(`  🏁 Audit complete: ${duration.toFixed(0)}ms, ${findingsCount} findings`);
    eventLog.push({ timestamp: Date.now(), event: 'audit:complete', duration, findingsCount });
  });

  const dataSource = {
    type: 'database',
    tables: ['users', 'transactions'],
    size: 1.0,
    complexity: 1.0,
  };

  try {
    const result = await engine.runAudit(dataSource);

    console.log('\n📋 EVENT LOG SUMMARY:');
    console.log(`  Total Events: ${eventLog.length}`);
    console.log(`  Total Duration: ${eventLog[eventLog.length - 1].timestamp - eventLog[0].timestamp}ms`);

    return { result, eventLog };
  } catch (error) {
    console.error('❌ Monitoring failed:', error.message);
    throw error;
  }
}

// ============================================================================
// RUN ALL EXAMPLES
// ============================================================================

async function runAllExamples() {
  console.log('='.repeat(80));
  console.log('AUDIT AUTOMATION INTEGRATION EXAMPLES');
  console.log('='.repeat(80));

  try {
    // Run examples sequentially
    await example1_SOC2TypeIIFinancialAudit();
    await example2_ContinuousAPIAudit();
    await example3_LogAnomalyAudit();
    await example4_ISO27001Audit();
    await example5_ReportExport();
    await example6_RealTimeMonitoring();

    console.log('\n' + '='.repeat(80));
    console.log('✅ ALL EXAMPLES COMPLETED SUCCESSFULLY');
    console.log('='.repeat(80) + '\n');
  } catch (error) {
    console.error('❌ Example failed:', error.message);
    process.exit(1);
  }
}

// Export individual examples and runner
module.exports = {
  example1_SOC2TypeIIFinancialAudit,
  example2_ContinuousAPIAudit,
  example3_LogAnomalyAudit,
  example4_ISO27001Audit,
  example5_ReportExport,
  example6_RealTimeMonitoring,
  runAllExamples,
};

// Run if executed directly
if (require.main === module) {
  runAllExamples().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
