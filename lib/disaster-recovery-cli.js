#!/usr/bin/env node

/**
 * disaster-recovery-cli.js
 *
 * Command-line interface for Disaster Recovery Automation management
 * Provides commands for monitoring, failover, drills, and reporting
 *
 * Usage:
 *   node disaster-recovery-cli.js status
 *   node disaster-recovery-cli.js failover --from us-east-1 --to us-west-2
 *   node disaster-recovery-cli.js drill --type region-failure --region us-east-1
 *   node disaster-recovery-cli.js monitor
 *   node disaster-recovery-cli.js report
 */

const DRA = require('./disaster-recovery-automation');
const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_CONFIG_PATH = path.join(process.cwd(), '.dr-config.json');

const DEFAULT_CONFIG = {
  regions: ['us-east-1', 'us-west-2', 'eu-west-1'],
  endpoints: {
    'us-east-1': {
      api: 'https://api.us-east-1.example.com',
      db: 'db.us-east-1.example.com',
      cache: 'cache.us-east-1.example.com'
    },
    'us-west-2': {
      api: 'https://api.us-west-2.example.com',
      db: 'db.us-west-2.example.com',
      cache: 'cache.us-west-2.example.com'
    },
    'eu-west-1': {
      api: 'https://api.eu-west-1.example.com',
      db: 'db.eu-west-1.example.com',
      cache: 'cache.eu-west-1.example.com'
    }
  },
  enableAutoFailover: true,
  enableChaosMode: true
};

// ============================================================================
// COLORS
// ============================================================================

const COLORS = {
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
  DIM: '\x1b[2m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
  MAGENTA: '\x1b[35m',
  GRAY: '\x1b[90m'
};

// ============================================================================
// UTILITIES
// ============================================================================

function log(msg, color = 'RESET') {
  console.log(`${COLORS[color]}${msg}${COLORS.RESET}`);
}

function title(text) {
  log(`\n${'═'.repeat(70)}`, 'CYAN');
  log(`  ${text}`, 'CYAN');
  log(`${'═'.repeat(70)}\n`, 'CYAN');
}

function section(text) {
  log(`\n─ ${text} ${COLORS.GRAY}${'─'.repeat(60 - text.length)}${COLORS.RESET}`);
}

function success(msg) { log(`✓ ${msg}`, 'GREEN'); }
function error(msg) { log(`✗ ${msg}`, 'RED'); }
function warn(msg) { log(`! ${msg}`, 'YELLOW'); }
function info(msg) { log(`ℹ ${msg}`, 'BLUE'); }

function loadConfig() {
  if (fs.existsSync(DEFAULT_CONFIG_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(DEFAULT_CONFIG_PATH, 'utf8'));
    } catch (err) {
      warn(`Failed to load config: ${err.message}`);
      return DEFAULT_CONFIG;
    }
  }
  return DEFAULT_CONFIG;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = { command: args[0] || 'help', flags: {} };

  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const [key, value] = args[i].substring(2).split('=');
      parsed.flags[key] = value || true;
    }
  }

  return parsed;
}

// ============================================================================
// COMMANDS
// ============================================================================

async function cmdStatus(drm) {
  title('Disaster Recovery System Status');

  const status = drm.getStatus();

  section('System Information');
  console.log(`  Status: ${status.running ? COLORS.GREEN + 'RUNNING' : COLORS.RED + 'STOPPED'}${COLORS.RESET}`);
  console.log(`  Timestamp: ${status.timestamp}`);
  console.log(`  Primary Region: ${COLORS.MAGENTA}${status.primaryRegion}${COLORS.RESET}`);
  console.log(`  Failover Count: ${status.failoverCount}`);

  section('Regional Health');
  for (const [region, health] of Object.entries(status.regionHealth)) {
    const statusIcon = health.status === 'healthy' ? `${COLORS.GREEN}✓` : `${COLORS.RED}✗`;
    const circuitStatus = health.circuitOpen ? ` ${COLORS.RED}[CIRCUIT OPEN]` : '';
    console.log(`  ${statusIcon}${COLORS.RESET} ${region.padEnd(20)} ${health.status.padEnd(12)} Latency: ${health.responseTime.toFixed(0)}ms${circuitStatus}${COLORS.RESET}`);
  }

  section('Database Replication');
  for (const [region, repl] of Object.entries(status.replication)) {
    const syncColor = repl.syncPercentage > 99.5 ? COLORS.GREEN : COLORS.YELLOW;
    console.log(`  ${region.padEnd(20)} Sync: ${syncColor}${repl.syncPercentage.toFixed(2)}%${COLORS.RESET} Lag: ${repl.lag.toFixed(0)}ms`);
  }

  section('Objectives');
  console.log(`  RTO Target: ${COLORS.CYAN}${status.rtoTarget}ms${COLORS.RESET} (2 minutes)`);
  console.log(`  RPO Target: ${COLORS.CYAN}${status.rpoTarget}ms${COLORS.RESET} (1 minute)`);

  section('Chaos Engineering');
  const schedule = status.chaosSchedule;
  console.log(`  Last Drill: ${schedule.lastDrill || 'Never'}`);
  console.log(`  Next Scheduled: ${schedule.nextScheduledDrill}`);
  console.log(`  Days Until Next: ${COLORS.MAGENTA}${schedule.daysUntilNextDrill}${COLORS.RESET}`);
}

async function cmdStart(drm) {
  title('Starting Disaster Recovery Manager');

  if (drm.isRunning) {
    warn('Already running');
    return;
  }

  await drm.start();
  success('Disaster Recovery Manager started');
  info('Health checks running every 30 seconds');
  info('Database sync checks running every 45 seconds');
}

async function cmdStop(drm) {
  title('Stopping Disaster Recovery Manager');

  if (!drm.isRunning) {
    warn('Not running');
    return;
  }

  await drm.stop();
  success('Disaster Recovery Manager stopped');
}

async function cmdFailover(drm, flags) {
  const fromRegion = flags.from;
  const toRegion = flags.to;

  if (!fromRegion || !toRegion) {
    error('Usage: failover --from <region> --to <region>');
    return;
  }

  title(`Manual Failover: ${fromRegion} → ${toRegion}`);

  warn('INITIATING MANUAL FAILOVER');
  console.log(`  From: ${COLORS.YELLOW}${fromRegion}${COLORS.RESET}`);
  console.log(`  To: ${COLORS.GREEN}${toRegion}${COLORS.RESET}\n`);

  const result = await drm.manualFailover(fromRegion, toRegion);

  section('Failover Result');
  console.log(`  ID: ${result.id}`);
  console.log(`  Status: ${result.status === 'completed' ? COLORS.GREEN + 'COMPLETED' : COLORS.RED + 'FAILED'}${COLORS.RESET}`);
  console.log(`  Duration: ${result.startTime ? Date.now() - result.startTime : 'N/A'}ms`);

  if (result.rto) {
    const rtoStatus = result.rto > DRA.RTO_TARGET ? COLORS.RED : COLORS.GREEN;
    console.log(`  RTO: ${rtoStatus}${result.rto}ms${COLORS.RESET} (target: ${DRA.RTO_TARGET}ms)`);
  }

  if (result.rpo) {
    const rpoStatus = result.rpo > DRA.RPO_TARGET ? COLORS.RED : COLORS.GREEN;
    console.log(`  RPO: ${rpoStatus}${result.rpo}ms${COLORS.RESET} (target: ${DRA.RPO_TARGET}ms)`);
  }

  if (result.steps && result.steps.length > 0) {
    section('Failover Steps');
    for (const step of result.steps) {
      const icon = step.status === 'completed' ? `${COLORS.GREEN}✓` : `${COLORS.RED}✗`;
      console.log(`  ${icon}${COLORS.RESET} ${step.step.padEnd(25)} ${step.duration.toFixed(0)}ms`);
    }
  }
}

async function cmdDrill(drm, flags) {
  const drillType = flags.type || 'region-failure';
  const targetRegion = flags.region;

  title(`Chaos Engineering Drill: ${drillType}`);

  info(`Running ${drillType} chaos drill...`);
  const result = await drm.runChaosDrill(drillType, targetRegion);

  section('Drill Result');
  console.log(`  ID: ${result.id}`);
  console.log(`  Type: ${result.type}`);
  console.log(`  Status: ${result.status === 'completed' ? COLORS.GREEN + 'COMPLETED' : COLORS.RED + 'FAILED'}${COLORS.RESET}`);
  console.log(`  Duration: ${result.duration.toFixed(0)}ms`);

  if (result.results) {
    section('Simulation Results');
    for (const [key, value] of Object.entries(result.results)) {
      console.log(`  ${key}: ${JSON.stringify(value)}`);
    }
  }

  if (result.metrics.rtoAchieved) {
    const rtoStatus = result.metrics.rtoAchieved > DRA.RTO_TARGET ? COLORS.RED : COLORS.GREEN;
    console.log(`  RTO Achieved: ${rtoStatus}${result.metrics.rtoAchieved}ms${COLORS.RESET}`);
  }
}

async function cmdReport(drm) {
  title('Detailed System Report');

  const report = drm.getDetailedReport();

  section('Recent Failovers');
  if (report.recentFailovers.length === 0) {
    console.log('  No recent failovers');
  } else {
    for (const failover of report.recentFailovers.slice(-5)) {
      const icon = failover.status === 'completed' ? COLORS.GREEN + '✓' : COLORS.RED + '✗';
      console.log(`  ${icon}${COLORS.RESET} ${failover.from} → ${failover.to} (${failover.rto}ms RTO)`);
      console.log(`    ${COLORS.GRAY}${failover.timestamp}${COLORS.RESET}`);
    }
  }

  section('Recent Chaos Drills');
  if (report.recentDrills.length === 0) {
    console.log('  No recent drills');
  } else {
    for (const drill of report.recentDrills.slice(-5)) {
      const icon = drill.status === 'completed' ? COLORS.GREEN + '✓' : COLORS.RED + '✗';
      console.log(`  ${icon}${COLORS.RESET} ${drill.type} (${drill.duration.toFixed(0)}ms)`);
      console.log(`    ${COLORS.GRAY}${drill.timestamp}${COLORS.RESET}`);
    }
  }

  section('Health Check History');
  for (const regionHistory of report.healthCheckHistory) {
    const recentChecks = regionHistory.recentChecks.slice(-3);
    if (recentChecks.length > 0) {
      const lastCheck = recentChecks[recentChecks.length - 1];
      const icon = lastCheck.status === 'healthy' ? COLORS.GREEN + '✓' : COLORS.RED + '✗';
      console.log(`  ${icon}${COLORS.RESET} ${regionHistory.region.padEnd(20)} ${lastCheck.status}`);
    }
  }
}

async function cmdMonitor(drm) {
  title('Live Monitoring (Press Ctrl+C to stop)');

  await drm.start();
  success('Monitoring started');

  const updateInterval = setInterval(async () => {
    const status = drm.getStatus();

    console.clear();
    log(`╔════════════════════════════════════════════════════════════════╗`, 'CYAN');
    log(`║        Disaster Recovery Live Monitor                        ║`, 'CYAN');
    log(`║  ${new Date().toISOString()}  ║`, 'CYAN');
    log(`╚════════════════════════════════════════════════════════════════╝\n`, 'CYAN');

    log(`Primary: ${COLORS.MAGENTA}${status.primaryRegion}${COLORS.RESET} | Status: ${status.running ? COLORS.GREEN + 'RUNNING' : COLORS.RED + 'STOPPED'}${COLORS.RESET}\n`, 'BLUE');

    let healthyCount = 0;
    for (const [region, health] of Object.entries(status.regionHealth)) {
      const icon = health.status === 'healthy' ? COLORS.GREEN + '✓' : COLORS.RED + '✗';
      if (health.status === 'healthy') healthyCount++;
      console.log(`${icon}${COLORS.RESET} ${region.padEnd(20)} ${health.status.padEnd(12)} Latency: ${health.responseTime.toFixed(0)}ms`);
    }

    log(`\n${healthyCount}/${Object.keys(status.regionHealth).length} regions healthy`, healthyCount === Object.keys(status.regionHealth).length ? 'GREEN' : 'YELLOW');
  }, 5000);

  // Graceful shutdown on Ctrl+C
  process.on('SIGINT', async () => {
    clearInterval(updateInterval);
    log('\nMonitoring stopped', 'BLUE');
    await drm.stop();
    process.exit(0);
  });
}

async function cmdExport(drm, flags) {
  title('Exporting Metrics');

  const filename = flags.output || 'dr-metrics.json';
  const metrics = drm.exportMetrics();
  const filepath = path.resolve(filename);

  fs.writeFileSync(filepath, JSON.stringify(metrics, null, 2));
  success(`Metrics exported to ${filepath}`);

  info(`Total failovers: ${metrics.failoverHistory.length}`);
  info(`Total chaos drills: ${metrics.chaosHistory.length}`);
}

function cmdHelp() {
  title('Disaster Recovery Automation CLI');

  console.log(`${COLORS.BOLD}COMMANDS:${COLORS.RESET}\n`);

  const commands = [
    {
      name: 'status',
      desc: 'Show current system status',
      usage: 'node disaster-recovery-cli.js status'
    },
    {
      name: 'start',
      desc: 'Start the Disaster Recovery Manager',
      usage: 'node disaster-recovery-cli.js start'
    },
    {
      name: 'stop',
      desc: 'Stop the Disaster Recovery Manager',
      usage: 'node disaster-recovery-cli.js stop'
    },
    {
      name: 'failover',
      desc: 'Trigger manual failover between regions',
      usage: 'node disaster-recovery-cli.js failover --from us-east-1 --to us-west-2'
    },
    {
      name: 'drill',
      desc: 'Run chaos engineering drill',
      usage: 'node disaster-recovery-cli.js drill --type region-failure [--region us-east-1]'
    },
    {
      name: 'report',
      desc: 'Generate detailed system report',
      usage: 'node disaster-recovery-cli.js report'
    },
    {
      name: 'monitor',
      desc: 'Live monitoring dashboard',
      usage: 'node disaster-recovery-cli.js monitor'
    },
    {
      name: 'export',
      desc: 'Export metrics to JSON',
      usage: 'node disaster-recovery-cli.js export [--output file.json]'
    },
    {
      name: 'help',
      desc: 'Show this help message',
      usage: 'node disaster-recovery-cli.js help'
    }
  ];

  for (const cmd of commands) {
    log(`${cmd.name.padEnd(12)} ${cmd.desc}`, 'GREEN');
    log(`${' '.repeat(12)} ${COLORS.GRAY}${cmd.usage}${COLORS.RESET}`);
    console.log();
  }

  log(`DRILL TYPES:`, 'CYAN');
  const drillTypes = [
    'region-failure      - Simulate primary region going down',
    'database-lag        - Test high replication lag handling',
    'cascading-failure   - Multiple regions failing sequentially',
    'network-partition   - Split-brain scenario detection'
  ];
  for (const drillType of drillTypes) {
    console.log(`  ${drillType}`);
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const parsed = parseArgs();
  const config = loadConfig();
  const drm = new DRA.DisasterRecoveryManager(config);
  await drm.initialize();

  switch (parsed.command) {
    case 'status':
      await cmdStatus(drm);
      break;
    case 'start':
      await cmdStart(drm);
      break;
    case 'stop':
      await cmdStop(drm);
      break;
    case 'failover':
      await cmdFailover(drm, parsed.flags);
      break;
    case 'drill':
      await cmdDrill(drm, parsed.flags);
      break;
    case 'report':
      await cmdReport(drm);
      break;
    case 'monitor':
      await cmdMonitor(drm);
      break;
    case 'export':
      await cmdExport(drm, parsed.flags);
      break;
    case 'help':
      cmdHelp();
      break;
    default:
      error(`Unknown command: ${parsed.command}`);
      cmdHelp();
  }

  process.exit(0);
}

if (require.main === module) {
  main().catch(err => {
    error(err.message);
    process.exit(1);
  });
}

module.exports = { cmdStatus, cmdFailover, cmdDrill, cmdReport };
