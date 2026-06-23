# Disaster Recovery Automation - Quick Reference

## Quick Start (30 seconds)

```javascript
const DRA = require('./lib/disaster-recovery-automation');

const drm = new DRA.DisasterRecoveryManager({
  regions: ['us-east-1', 'us-west-2', 'eu-west-1'],
  endpoints: { /* ... */ },
  enableAutoFailover: true
});

await drm.initialize();
await drm.start();

// Listen for events
drm.on('failover-completed', (fo) => console.log(`Failover: ${fo.rto}ms RTO`));
```

## Key Metrics

| Metric | Value |
|--------|-------|
| Health Check Interval | **30 seconds** |
| RTO Target | **< 2 minutes** |
| RPO Target | **< 1 minute** |
| Circuit Breaker Threshold | **5 failures** |
| Chaos Drill Frequency | **Monthly** |
| DB Sync Interval | **45 seconds** |

## Main Classes

### DisasterRecoveryManager
Main orchestrator - initialize, start, stop, query status.

```javascript
await drm.initialize()                    // Setup
await drm.start()                         // Begin monitoring
await drm.stop()                          // Shutdown
drm.getStatus()                           // Current status
drm.getDetailedReport()                   // Historical data
drm.exportMetrics()                       // JSON export
```

### RegionHealthCheck
Per-region health monitoring.

```javascript
drm.regionHealthChecks['us-east-1']
  .checkHealth()                          // Single check
  .resetCircuitBreaker()                  // Manual reset
```

### FailoverOrchestrator
Manages failover operations.

```javascript
await drm.manualFailover(from, to)        // Manual failover
.failoverOrchestrator.getFailoverHistory()// Recent failovers
```

### ChaosDrill
Chaos engineering framework.

```javascript
await drm.runChaosDrill('region-failure')
await drm.runChaosDrill('database-lag')
await drm.runChaosDrill('cascading-failure')
await drm.runChaosDrill('network-partition')
```

### ReplicationMonitor
Database replication tracking.

```javascript
await drm.monitorDatabaseSync()
drm.replicationMonitor.replicationStatus  // Current lag
drm.replicationMonitor.syncPoints         // History
```

## Events

```javascript
drm.on('health-check', (status) => {})          // Every 30s
drm.on('failover-completed', (result) => {})    // On success
drm.on('failover-failed', (result) => {})       // On failure
drm.on('replication-status', (status) => {})    // Every 45s
drm.on('drill-completed', (result) => {})       // After drills
drm.on('started', () => {})                     // On start
drm.on('stopped', () => {})                     // On stop
```

## CLI Commands

```bash
# Status & Information
node lib/disaster-recovery-cli.js status                          # System status
node lib/disaster-recovery-cli.js report                          # Historical report

# Control
node lib/disaster-recovery-cli.js start                           # Start monitoring
node lib/disaster-recovery-cli.js stop                            # Stop monitoring
node lib/disaster-recovery-cli.js monitor                         # Live dashboard

# Failover
node lib/disaster-recovery-cli.js failover --from X --to Y        # Manual failover

# Chaos Drills
node lib/disaster-recovery-cli.js drill --type region-failure     # Region failure
node lib/disaster-recovery-cli.js drill --type database-lag       # DB lag test
node lib/disaster-recovery-cli.js drill --type cascading-failure  # Multi-region
node lib/disaster-recovery-cli.js drill --type network-partition  # Split-brain

# Export
node lib/disaster-recovery-cli.js export --output metrics.json    # Export data
```

## Health Check Object

```javascript
{
  status: 'healthy' | 'degraded' | 'unhealthy',
  lastCheck: timestamp,
  consecutiveFailures: number,
  responseTime: ms,
  dbLag: ms,
  circuitOpen: boolean,
  errors: [{ timestamp, error }]
}
```

## Failover Result Object

```javascript
{
  id: 'UUID',
  timestamp: 'ISO',
  from: 'us-east-1',
  to: 'us-west-2',
  status: 'completed',
  rto: 1850,                              // actual milliseconds
  rpo: 450,                               // actual milliseconds
  steps: [
    { step: 'validate_target', status: 'completed', duration: 500 },
    { step: 'drain_connections', status: 'completed', duration: 1000 },
    // ...
  ]
}
```

## Testing

```bash
# Run full test suite
node lib/disaster-recovery-automation.test.js

# Expected output:
# ✓ Region health check initialized for all regions
# ✓ Health check completes successfully
# ✓ All regions checked in performHealthChecks
# [... 37 more tests ...]
# Tests run: 40
# Passed: 40
# Failed: 0
```

## Common Patterns

### Monitor Specific Region
```javascript
const checker = drm.regionHealthChecks['us-east-1'];
const health = checker.health;
console.log(health.status);
console.log(checker.checkHistory.slice(-10));
```

### Trigger Failover Only on Severe Outage
```javascript
drm.on('health-check', async (status) => {
  const unhealthy = status.details['us-east-1'];
  if (unhealthy.consecutiveFailures >= 10) {
    await drm.manualFailover('us-east-1', 'us-west-2');
  }
});
```

### Monitor RTO/RPO Compliance
```javascript
drm.on('failover-completed', (fo) => {
  if (fo.rto > DRA.RTO_TARGET) {
    console.warn(`RTO breached: ${fo.rto}ms`);
    // Alert ops team
  }
  if (fo.rpo > DRA.RPO_TARGET) {
    console.warn(`RPO breached: ${fo.rpo}ms`);
    // Alert ops team
  }
});
```

### Monthly Drill Automation
```javascript
// Automatic - drills run monthly automatically
// Or schedule your own:
setInterval(async () => {
  const drill = await drm.runChaosDrill('region-failure');
  console.log(`Drill ${drill.id}: ${drill.status}`);
  // Send metrics to monitoring system
}, 30 * 24 * 60 * 60 * 1000);
```

### Export Daily Metrics
```javascript
setInterval(() => {
  const metrics = drm.exportMetrics();
  fs.writeFileSync(`metrics-${new Date().toISOString().split('T')[0]}.json`, 
    JSON.stringify(metrics, null, 2));
}, 24 * 60 * 60 * 1000);
```

## Logging

All logs written to `.dr-logs/` directory with daily rotation:
```
.dr-logs/
├── dr-automation-2025-06-22.log
├── dr-automation-2025-06-21.log
└── ...
```

Log format:
```
[2025-06-22T14:30:45.123Z] [INFO] Health check passed
[2025-06-22T14:31:00.456Z] [CRITICAL] FAILOVER INITIATED: us-east-1 -> us-west-2
[2025-06-22T14:31:05.789Z] [SUCCESS] Failover completed: RTO=1850ms, RPO=450ms
```

## Constants Reference

```javascript
const DRA = require('./lib/disaster-recovery-automation');

DRA.HEALTH_CHECK_INTERVAL           // 30,000 ms
DRA.RTO_TARGET                      // 120,000 ms
DRA.RPO_TARGET                      // 60,000 ms
DRA.CIRCUIT_BREAKER_THRESHOLD       // 5
DRA.CIRCUIT_BREAKER_TIMEOUT         // 300,000 ms
DRA.CHAOS_DRILL_INTERVAL            // 2,592,000,000 ms (30 days)
```

## Integration with Alert Systems

### PagerDuty
```javascript
drm.on('failover-completed', async (fo) => {
  if (fo.status === 'failed') {
    const pagerduty = require('pagerduty');
    await pagerduty.trigger({
      description: `Failover failed: ${fo.error}`,
      severity: 'critical',
      service_key: process.env.PAGERDUTY_KEY
    });
  }
});
```

### Slack
```javascript
const slack = require('slack');

drm.on('drill-completed', async (drill) => {
  await slack.post('dr-channel', {
    text: `Chaos drill completed: ${drill.type} in ${drill.duration}ms`,
    color: drill.status === 'completed' ? 'good' : 'danger'
  });
});
```

### DataDog
```javascript
const dd = require('node-dogstatsd').StatsD;
const client = new dd();

drm.on('health-check', (status) => {
  client.gauge('dr.healthy_regions', status.healthy);
  client.gauge('dr.unhealthy_regions', status.unhealthy);
});

drm.on('failover-completed', (fo) => {
  client.timing('dr.failover_rto', fo.rto);
  client.timing('dr.failover_rpo', fo.rpo);
});
```

## File Structure

```
lib/
├── disaster-recovery-automation.js           (1000+ lines, core)
├── disaster-recovery-automation.test.js      (400+ lines, tests)
├── disaster-recovery-integration-example.js  (300+ lines, examples)
├── disaster-recovery-cli.js                  (400+ lines, CLI)
├── DISASTER_RECOVERY_README.md               (comprehensive guide)
├── DISASTER_RECOVERY_IMPLEMENTATION.md       (technical deep-dive)
└── DISASTER_RECOVERY_QUICK_REFERENCE.md      (this file)
```

## Production Deployment

1. **Copy files to your project**
   ```bash
   cp lib/disaster-recovery-*.js /path/to/your/project/
   ```

2. **Install in your app**
   ```javascript
   const DRA = require('./disaster-recovery-automation');
   ```

3. **Configure regions**
   ```javascript
   const config = { regions: [...], endpoints: {...} };
   ```

4. **Initialize and start**
   ```javascript
   const drm = new DRA.DisasterRecoveryManager(config);
   await drm.initialize();
   await drm.start();
   ```

5. **Set up monitoring**
   - Wire up event handlers
   - Configure alert destinations
   - Schedule chaos drills

6. **Run tests**
   ```bash
   npm test -- lib/disaster-recovery-automation.test.js
   ```

## Troubleshooting Checklist

- [ ] All regions reachable and healthy?
- [ ] Database replication working (lag < 1min)?
- [ ] Network latency acceptable between regions?
- [ ] Failover tested successfully?
- [ ] RTO < 2 minutes achieved?
- [ ] RPO < 1 minute achieved?
- [ ] Chaos drills passing?
- [ ] Logs being written to `.dr-logs/`?
- [ ] Events being emitted correctly?
- [ ] Alert integrations configured?

## Support

See **DISASTER_RECOVERY_README.md** for complete documentation.
See **DISASTER_RECOVERY_IMPLEMENTATION.md** for technical deep-dive.
