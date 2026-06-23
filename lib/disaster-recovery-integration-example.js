#!/usr/bin/env node

/**
 * disaster-recovery-integration-example.js
 *
 * Complete integration example showing real-world usage patterns
 * Demonstrates monitoring, alerting, dashboards, and recovery procedures
 */

const DRA = require('./disaster-recovery-automation');
const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const PRODUCTION_CONFIG = {
  regions: ['us-east-1', 'us-west-2', 'eu-west-1'],
  endpoints: {
    'us-east-1': {
      api: 'https://api-prod.us-east-1.acme.com',
      db: 'db-primary.us-east-1.acme.com',
      cache: 'cache.us-east-1.acme.com'
    },
    'us-west-2': {
      api: 'https://api-prod.us-west-2.acme.com',
      db: 'db-standby.us-west-2.acme.com',
      cache: 'cache.us-west-2.acme.com'
    },
    'eu-west-1': {
      api: 'https://api-prod.eu-west-1.acme.com',
      db: 'db-standby.eu-west-1.acme.com',
      cache: 'cache.eu-west-1.acme.com'
    }
  },
  enableAutoFailover: true,
  enableChaosMode: true
};

// ============================================================================
// ALERTING SYSTEM
// ============================================================================

class AlertManager {
  constructor(drm) {
    this.drm = drm;
    this.alerts = [];
    this.thresholds = {
      highLatency: 100, // ms
      rpoBreachRatio: 1.1, // 10% above target
      rtoBreachRatio: 1.15, // 15% above target
      dbLagThreshold: 500, // ms
      consecutiveFailuresThreshold: 3
    };
  }

  async monitor() {
    this.drm.on('health-check', (status) => this.checkHealth(status));
    this.drm.on('failover-completed', (failover) => this.alertFailover(failover));
    this.drm.on('replication-status', (consistency) => this.checkReplication(consistency));
  }

  checkHealth(status) {
    for (const [region, health] of Object.entries(status.details)) {
      // High latency alert
      if (health.responseTime > this.thresholds.highLatency) {
        this.createAlert('HIGH_LATENCY', `${region} latency: ${health.responseTime.toFixed(2)}ms`, 'WARN');
      }

      // Circuit breaker alert
      if (health.circuitOpen) {
        this.createAlert('CIRCUIT_OPEN', `${region} circuit breaker opened`, 'CRITICAL');
      }

      // Consecutive failures alert
      if (health.consecutiveFailures >= this.thresholds.consecutiveFailuresThreshold) {
        this.createAlert('HEALTH_DEGRADATION', `${region} ${health.consecutiveFailures} consecutive failures`, 'WARN');
      }
    }
  }

  checkReplication(consistency) {
    for (const [region, status] of Object.entries(consistency.regions)) {
      if (status.lag > this.thresholds.dbLagThreshold) {
        this.createAlert('DB_LAG_HIGH', `${region} DB lag: ${status.lag.toFixed(0)}ms`, 'WARN');
      }

      if (status.syncPercentage < 99.5) {
        this.createAlert('SYNC_LAGGING', `${region} sync: ${status.syncPercentage.toFixed(2)}%`, 'WARN');
      }
    }
  }

  alertFailover(failover) {
    const message = `Failover ${failover.status}: ${failover.from} -> ${failover.to} (RTO: ${failover.rto}ms, RPO: ${failover.rpo}ms)`;
    const severity = failover.status === 'completed' ? 'INFO' : 'CRITICAL';
    this.createAlert('FAILOVER', message, severity);

    // Check if RTO/RPO exceeded targets
    if (failover.rto > DRA.RTO_TARGET) {
      this.createAlert('RTO_BREACH', `RTO exceeded: ${failover.rto}ms > ${DRA.RTO_TARGET}ms`, 'WARN');
    }
    if (failover.rpo > DRA.RPO_TARGET) {
      this.createAlert('RPO_BREACH', `RPO exceeded: ${failover.rpo}ms > ${DRA.RPO_TARGET}ms`, 'WARN');
    }
  }

  createAlert(type, message, severity) {
    const alert = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      type,
      message,
      severity,
      resolved: false
    };

    this.alerts.push(alert);

    // Keep last 1000 alerts
    if (this.alerts.length > 1000) {
      this.alerts.shift();
    }

    // In production: send to PagerDuty, Slack, etc.
    console.log(`[${alert.severity}] ${alert.type}: ${alert.message}`);
  }

  getActiveAlerts() {
    return this.alerts.filter(a => !a.resolved).slice(-50);
  }

  getAlertStats() {
    const stats = {};
    for (const alert of this.alerts) {
      stats[alert.type] = (stats[alert.type] || 0) + 1;
    }
    return stats;
  }
}

// ============================================================================
// DASHBOARD
// ============================================================================

class Dashboard {
  constructor(drm, alertManager) {
    this.drm = drm;
    this.alertManager = alertManager;
    this.refreshInterval = null;
  }

  start(intervalMs = 10000) {
    this.refreshInterval = setInterval(() => {
      this.render();
    }, intervalMs);

    // Initial render
    this.render();
  }

  stop() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  render() {
    console.clear();

    const status = this.drm.getStatus();
    const time = new Date().toISOString();

    console.log(`╔════════════════════════════════════════════════════════════════╗`);
    console.log(`║          Disaster Recovery Automation Dashboard              ║`);
    console.log(`║  ${time}  ║`);
    console.log(`╚════════════════════════════════════════════════════════════════╝`);

    // System Status
    console.log(`\n┌─ System Status ────────────────────────────────────────────────┐`);
    console.log(`│ Primary Region: ${status.primaryRegion}`);
    console.log(`│ Running: ${status.running ? 'YES' : 'NO'}`);
    console.log(`│ Failovers (total): ${status.failoverCount}`);
    console.log(`└────────────────────────────────────────────────────────────────┘`);

    // Regional Health
    console.log(`\n┌─ Regional Health ──────────────────────────────────────────────┐`);
    for (const [region, health] of Object.entries(status.regionHealth)) {
      const icon = health.status === 'healthy' ? '✓' : '✗';
      const circuit = health.circuitOpen ? ' [CIRCUIT]' : '';
      console.log(`│ ${icon} ${region.padEnd(15)} ${health.status.padEnd(12)} Latency: ${health.responseTime.toFixed(0)}ms${circuit}`);
    }
    console.log(`└────────────────────────────────────────────────────────────────┘`);

    // Database Replication
    console.log(`\n┌─ Database Replication ─────────────────────────────────────────┐`);
    for (const [region, repl] of Object.entries(status.replication)) {
      const bar = this.progressBar(repl.syncPercentage, 20);
      console.log(`│ ${region.padEnd(15)} ${bar} ${repl.syncPercentage.toFixed(1)}% Lag: ${repl.lag.toFixed(0)}ms`);
    }
    console.log(`└────────────────────────────────────────────────────────────────┘`);

    // RTO/RPO Targets
    console.log(`\n┌─ Objectives ───────────────────────────────────────────────────┐`);
    console.log(`│ RTO Target: ${status.rtoTarget}ms (2 minutes)`);
    console.log(`│ RPO Target: ${status.rpoTarget}ms (1 minute)`);
    console.log(`│ Health Check Interval: ${DRA.HEALTH_CHECK_INTERVAL}ms (30 seconds)`);
    console.log(`└────────────────────────────────────────────────────────────────┘`);

    // Chaos Drills
    console.log(`\n┌─ Chaos Engineering ───────────────────────────────────────────┐`);
    const schedule = status.chaosSchedule;
    console.log(`│ Last Drill: ${schedule.lastDrill || 'Never'}`);
    console.log(`│ Next Drill: ${schedule.nextScheduledDrill}`);
    console.log(`│ Days Until Next: ${schedule.daysUntilNextDrill}`);
    console.log(`└────────────────────────────────────────────────────────────────┘`);

    // Active Alerts
    const alerts = this.alertManager.getActiveAlerts();
    console.log(`\n┌─ Recent Alerts (${alerts.length}) ────────────────────────────────────────┐`);
    if (alerts.length === 0) {
      console.log(`│ No active alerts`);
    } else {
      for (const alert of alerts.slice(-5)) {
        const sev = alert.severity.padEnd(8);
        console.log(`│ [${sev}] ${alert.type.padEnd(20)} ${alert.message.substring(0, 28)}`);
      }
    }
    console.log(`└────────────────────────────────────────────────────────────────┘\n`);
  }

  progressBar(percentage, width = 20) {
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
  }
}

// ============================================================================
// RECOVERY PROCEDURES
// ============================================================================

class RecoveryProcedures {
  constructor(drm) {
    this.drm = drm;
  }

  async executeManualFailover(fromRegion, toRegion) {
    console.log(`\n[PROCEDURE] Manual Failover: ${fromRegion} -> ${toRegion}`);
    console.log('Step 1: Validate target region...');
    const status = this.drm.getStatus();
    if (status.regionHealth[toRegion].status !== 'healthy') {
      console.error(`ERROR: Target region ${toRegion} not healthy!`);
      return false;
    }

    console.log('Step 2: Initiating failover...');
    const result = await this.drm.manualFailover(fromRegion, toRegion);

    console.log(`Step 3: Failover result: ${result.status}`);
    console.log(`  - ID: ${result.id}`);
    console.log(`  - RTO: ${result.rto}ms (target: ${DRA.RTO_TARGET}ms)`);
    console.log(`  - RPO: ${result.rpo}ms (target: ${DRA.RPO_TARGET}ms)`);

    if (result.rto > DRA.RTO_TARGET) {
      console.warn(`  - WARNING: RTO exceeded by ${(result.rto - DRA.RTO_TARGET).toFixed(0)}ms`);
    }
    if (result.rpo > DRA.RPO_TARGET) {
      console.warn(`  - WARNING: RPO exceeded by ${(result.rpo - DRA.RPO_TARGET).toFixed(0)}ms`);
    }

    return result.status === 'completed';
  }

  async runChaosValidation() {
    console.log(`\n[PROCEDURE] Chaos Engineering Validation`);

    const drills = [
      { type: 'region-failure', region: 'us-east-1' },
      { type: 'database-lag', region: null },
      { type: 'network-partition', region: null }
    ];

    for (const drill of drills) {
      console.log(`\nRunning: ${drill.type}`);
      const result = await this.drm.runChaosDrill(drill.type, drill.region);
      console.log(`  Status: ${result.status}`);
      console.log(`  Duration: ${result.duration.toFixed(0)}ms`);
      if (result.metrics.rtoAchieved) {
        console.log(`  RTO: ${result.metrics.rtoAchieved}ms`);
      }
    }
  }

  async validateReplicationConsistency() {
    console.log(`\n[PROCEDURE] Validate Database Replication Consistency`);

    await this.drm.monitorDatabaseSync();
    const replication = this.drm.replicationMonitor.replicationStatus;

    let allHealthy = true;
    for (const [region, status] of Object.entries(replication)) {
      const healthy = status.lag < DRA.RPO_TARGET && status.syncPercentage > 99.9;
      const icon = healthy ? '✓' : '✗';
      console.log(`${icon} ${region}: lag=${status.lag.toFixed(0)}ms sync=${status.syncPercentage.toFixed(2)}%`);
      if (!healthy) allHealthy = false;
    }

    return allHealthy;
  }
}

// ============================================================================
// METRICS EXPORT
// ============================================================================

function exportMetricsToFile(drm, filename = 'dr-metrics-export.json') {
  const metrics = drm.exportMetrics();
  const filepath = path.join(process.cwd(), filename);

  fs.writeFileSync(filepath, JSON.stringify(metrics, null, 2));
  console.log(`Metrics exported to: ${filepath}`);

  return filepath;
}

// ============================================================================
// MAIN EXAMPLE
// ============================================================================

async function main() {
  console.log('Initializing Disaster Recovery Automation...\n');

  const drm = new DRA.DisasterRecoveryManager(PRODUCTION_CONFIG);
  await drm.initialize();

  // Set up alert management
  const alertManager = new AlertManager(drm);
  await alertManager.monitor();

  // Set up dashboard
  const dashboard = new Dashboard(drm, alertManager);

  // Set up recovery procedures
  const procedures = new RecoveryProcedures(drm);

  // Start the DRA system
  await drm.start();
  console.log('Disaster Recovery Manager started\n');

  // Start monitoring
  console.log('Starting health monitoring...');
  await new Promise(r => setTimeout(r, 2000));

  // Show current status
  const status = drm.getStatus();
  console.log(`\nCurrent Status:`);
  console.log(`- Primary Region: ${status.primaryRegion}`);
  console.log(`- Healthy Regions: ${status.regionHealth ? Object.values(status.regionHealth).filter(h => h.status === 'healthy').length : 0}`);

  // Example: Run a chaos drill
  console.log(`\nRunning example chaos drill (database-lag)...`);
  const drillResult = await drm.runChaosDrill('database-lag');
  console.log(`Drill completed: ${drillResult.status}`);

  // Example: Export metrics
  console.log(`\nExporting metrics...`);
  exportMetricsToFile(drm);

  // Show detailed report
  console.log(`\nDetailed Report:`);
  const report = drm.getDetailedReport();
  console.log(`- Recent Failovers: ${report.recentFailovers.length}`);
  console.log(`- Recent Drills: ${report.recentDrills.length}`);

  // Cleanup
  console.log(`\nShutting down...`);
  await drm.stop();
  console.log('Disaster Recovery Manager stopped');
}

if (require.main === module) {
  main().catch(err => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
}

module.exports = {
  AlertManager,
  Dashboard,
  RecoveryProcedures,
  PRODUCTION_CONFIG,
  exportMetricsToFile
};
