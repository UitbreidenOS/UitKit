# Swarm Profiler - Integration Guide

Complete integration guide for using SwarmProfiler in production CI/CD pipelines, monitoring systems, and local development.

## Table of Contents

1. [CI/CD Integration](#cicd-integration)
2. [GitHub Actions Workflow](#github-actions-workflow)
3. [Local Development](#local-development)
4. [Performance Monitoring](#performance-monitoring)
5. [Alerting & Thresholds](#alerting--thresholds)
6. [Trend Analysis](#trend-analysis)

## CI/CD Integration

### Basic Setup

Add to your repository:

1. **Create baseline profile**
   ```bash
   mkdir -p profilers/baselines
   node profilers/swarm-profiler.js \
     --agents=5 \
     --messages=5000 \
     --scenario=standard \
     --output=json > profilers/baselines/baseline-standard.json
   ```

2. **Run test to verify setup**
   ```bash
   node profilers/swarm-profiler.js --agents=2 --messages=100
   ```

3. **Commit baseline**
   ```bash
   git add profilers/baselines/
   git commit -m "docs: add swarm profiler baseline"
   ```

### Pre-Commit Hook

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
set -e

# Quick profiler check on commit
echo "Running swarm profiler sanity check..."

node profilers/swarm-profiler.js \
  --agents=3 \
  --messages=200 \
  --scenario=standard \
  --output=json > /tmp/swarm-check.json

# Parse results
THROUGHPUT=$(node -e "console.log(require('/tmp/swarm-check.json').summary.messagesPerSecond)")
ERROR_RATE=$(node -e "console.log(require('/tmp/swarm-check.json').summary.errorCount)")

if (( $(echo "$THROUGHPUT < 100" | bc -l) )); then
  echo "❌ Throughput too low: $THROUGHPUT msg/s"
  exit 1
fi

if [ "$ERROR_RATE" -gt 0 ]; then
  echo "❌ Errors detected: $ERROR_RATE"
  exit 1
fi

echo "✓ Swarm profiler check passed"
exit 0
```

## GitHub Actions Workflow

### Minimal PR Check

```yaml
# .github/workflows/swarm-profile.yml

name: Swarm Performance Check

on:
  pull_request:
    types: [opened, synchronize]
  push:
    branches: [main]

jobs:
  profile:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Run Swarm Profiler
        run: |
          node profilers/swarm-profiler.js \
            --agents=5 \
            --messages=1000 \
            --scenario=standard \
            --output=json | tee swarm-profile.json

      - name: Compare Against Baseline
        run: |
          node scripts/compare-swarm-baseline.js \
            swarm-profile.json \
            profilers/baselines/baseline-standard.json

      - name: Upload Results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: swarm-profile
          path: swarm-profile.json
          retention-days: 30
```

### Comprehensive Test Matrix

```yaml
# .github/workflows/swarm-comprehensive.yml

name: Swarm Comprehensive Testing

on:
  schedule:
    - cron: '0 2 * * *'  # Nightly at 2am UTC
  workflow_dispatch:

jobs:
  profile-matrix:
    runs-on: ubuntu-latest
    timeout-minutes: 60

    strategy:
      matrix:
        scenario: [standard, stress, latency, throughput, degradation]
        agents: [2, 5, 10]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Profile - ${{ matrix.scenario }} (${{ matrix.agents }} agents)
        run: |
          node profilers/swarm-profiler.js \
            --agents=${{ matrix.agents }} \
            --messages=2000 \
            --scenario=${{ matrix.scenario }} \
            --output=json \
            > profile-${{ matrix.scenario }}-${{ matrix.agents }}.json

      - name: Store Results
        run: |
          mkdir -p results
          mv profile-*.json results/
          
          # Add metadata
          node -e "
            const fs = require('fs');
            const files = fs.readdirSync('results');
            const data = {};
            files.forEach(f => {
              data[f] = require('./results/' + f);
            });
            fs.writeFileSync('results/matrix.json', JSON.stringify(data, null, 2));
          "

      - name: Upload Matrix Results
        uses: actions/upload-artifact@v4
        with:
          name: swarm-matrix-${{ matrix.scenario }}-${{ matrix.agents }}
          path: results/

      - name: Comment PR with Results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const results = require('./results/matrix.json');
            
            let comment = '### Swarm Profile Results\n\n';
            comment += '| Scenario | Agents | Throughput | Latency (p99) | Success |\n';
            comment += '|----------|--------|-----------|---------------|---------|\n';
            
            Object.entries(results).forEach(([file, data]) => {
              const s = data.summary;
              comment += `| ${data.scenario} | ${data.scenario} | ${s.messagesPerSecond} msg/s | ${data.performance.messageLatency.p99} ms | ${s.successRate} |\n`;
            });
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

## Local Development

### Development Script

Create `scripts/profile-dev.sh`:

```bash
#!/bin/bash

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         Swarm Profiler - Development Mode                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Parse arguments
AGENTS=${1:-5}
MESSAGES=${2:-1000}
SCENARIO=${3:-standard}

echo "Configuration:"
echo "  Agents: $AGENTS"
echo "  Messages: $MESSAGES"
echo "  Scenario: $SCENARIO"
echo ""

# Run profiler
echo "Running profiler..."
node profilers/swarm-profiler.js \
  --agents=$AGENTS \
  --messages=$MESSAGES \
  --scenario=$SCENARIO \
  --output=text

# Save results
TIMESTAMP=$(date +%s)
OUTPUT="profilers/results/profile-dev-${SCENARIO}-${TIMESTAMP}.json"

node profilers/swarm-profiler.js \
  --agents=$AGENTS \
  --messages=$MESSAGES \
  --scenario=$SCENARIO \
  --output=json > "$OUTPUT"

echo ""
echo "✓ Results saved to: $OUTPUT"
echo ""
echo "View results:"
echo "  cat $OUTPUT | jq '.'"
```

Usage:
```bash
chmod +x scripts/profile-dev.sh

# Run with defaults
./scripts/profile-dev.sh

# Custom configuration
./scripts/profile-dev.sh 10 5000 stress
```

### NPM Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "profile": "node profilers/swarm-profiler.js",
    "profile:stress": "node profilers/swarm-profiler.js --agents=10 --messages=5000 --scenario=stress",
    "profile:latency": "node profilers/swarm-profiler.js --agents=5 --messages=500 --scenario=latency",
    "profile:degradation": "node profilers/swarm-profiler.js --scenario=degradation",
    "profile:compare": "node scripts/compare-scenarios.js",
    "profile:test": "node profilers/swarm-profiler.test.js"
  }
}
```

Usage:
```bash
npm run profile
npm run profile:stress
npm run profile:test
```

## Performance Monitoring

### Create Comparison Script

Create `scripts/compare-swarm-baseline.js`:

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Thresholds for regression detection
const THRESHOLDS = {
  throughputDecrease: 0.15,      // 15% drop
  latencyIncrease: 0.20,         // 20% increase
  errorRateIncrease: 0.10,       // 1% -> 1.1%
  memoryGrowth: 0.25             // 25% growth
};

function compareMetrics(current, baseline) {
  const issues = [];

  // Throughput check
  const throughputDrop = 1 - (current.messagesPerSecond / baseline.messagesPerSecond);
  if (throughputDrop > THRESHOLDS.throughputDecrease) {
    issues.push({
      severity: 'high',
      metric: 'Throughput',
      current: current.messagesPerSecond.toFixed(0),
      baseline: baseline.messagesPerSecond.toFixed(0),
      change: (throughputDrop * 100).toFixed(1)
    });
  }

  // Latency check
  const latencyIncrease = (current.messageLatency.p99 - baseline.messageLatency.p99) / 
                          baseline.messageLatency.p99;
  if (latencyIncrease > THRESHOLDS.latencyIncrease) {
    issues.push({
      severity: 'high',
      metric: 'Latency (p99)',
      current: current.messageLatency.p99.toFixed(2),
      baseline: baseline.messageLatency.p99.toFixed(2),
      change: (latencyIncrease * 100).toFixed(1)
    });
  }

  // Error rate check
  const currentErrorRate = current.summary.errorCount / current.summary.messageCount;
  const baselineErrorRate = baseline.summary.errorCount / baseline.summary.messageCount;
  if (currentErrorRate > baselineErrorRate + THRESHOLDS.errorRateIncrease) {
    issues.push({
      severity: 'medium',
      metric: 'Error Rate',
      current: (currentErrorRate * 100).toFixed(2),
      baseline: (baselineErrorRate * 100).toFixed(2),
      change: ((currentErrorRate - baselineErrorRate) * 100).toFixed(2)
    });
  }

  // Memory growth
  const currentMemory = current.memory.delta.heapUsed / 1024 / 1024;
  const baselineMemory = baseline.memory.delta.heapUsed / 1024 / 1024;
  if (baselineMemory > 0) {
    const memoryIncrease = (currentMemory - baselineMemory) / baselineMemory;
    if (memoryIncrease > THRESHOLDS.memoryGrowth) {
      issues.push({
        severity: 'medium',
        metric: 'Memory Growth',
        current: currentMemory.toFixed(2),
        baseline: baselineMemory.toFixed(2),
        change: (memoryIncrease * 100).toFixed(1)
      });
    }
  }

  return issues;
}

async function main() {
  const currentFile = process.argv[2];
  const baselineFile = process.argv[3];

  if (!currentFile || !baselineFile) {
    console.error('Usage: compare-swarm-baseline.js <current.json> <baseline.json>');
    process.exit(1);
  }

  if (!fs.existsSync(currentFile)) {
    console.error(`Current results not found: ${currentFile}`);
    process.exit(1);
  }

  if (!fs.existsSync(baselineFile)) {
    console.error(`Baseline not found: ${baselineFile}`);
    process.exit(1);
  }

  const current = JSON.parse(fs.readFileSync(currentFile, 'utf8'));
  const baseline = JSON.parse(fs.readFileSync(baselineFile, 'utf8'));

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║         Swarm Profiler - Baseline Comparison              ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const issues = compareMetrics(current, baseline);

  if (issues.length === 0) {
    console.log('✓ All metrics within acceptable thresholds');
    process.exit(0);
  }

  console.log(`⚠️  Found ${issues.length} regression(s):\n`);
  console.log('Metric            | Current  | Baseline | Change');
  console.log('------------------|----------|----------|--------');

  for (const issue of issues) {
    const severity = issue.severity === 'high' ? '❌' : '⚠️ ';
    console.log(
      `${severity} ${issue.metric.padEnd(16)} | ${String(issue.current).padStart(8)} | ` +
      `${String(issue.baseline).padStart(8)} | ${issue.change}%`
    );
  }

  console.log('\n');
  process.exit(issues.some(i => i.severity === 'high') ? 1 : 0);
}

main();
```

## Alerting & Thresholds

### Create Alert Configuration

Create `profilers/alerts.json`:

```json
{
  "alerts": {
    "throughput": {
      "type": "threshold",
      "metric": "messagesPerSecond",
      "min": 500,
      "severity": "high",
      "message": "Throughput below minimum"
    },
    "latency_p99": {
      "type": "threshold",
      "metric": "messageLatency.p99",
      "max": 100,
      "severity": "high",
      "message": "P99 latency exceeds threshold"
    },
    "error_rate": {
      "type": "ratio",
      "numerator": "errors.count",
      "denominator": "messageCount",
      "max": 0.01,
      "severity": "high",
      "message": "Error rate exceeds 1%"
    },
    "memory_leak": {
      "type": "threshold",
      "metric": "memory.delta.heapUsed",
      "max": 104857600,
      "severity": "medium",
      "message": "Memory growth exceeds 100MB"
    },
    "startup_time": {
      "type": "threshold",
      "metric": "startupMetrics.mean",
      "max": 20,
      "severity": "medium",
      "message": "Agent startup time increasing"
    }
  },

  "notifications": {
    "slack": {
      "enabled": false,
      "webhook": "https://hooks.slack.com/...",
      "channel": "#performance",
      "severity": ["high"]
    },
    "email": {
      "enabled": false,
      "to": "team@example.com",
      "severity": ["high"]
    },
    "github": {
      "enabled": true,
      "createIssue": true,
      "severity": ["high"]
    }
  }
}
```

### Alert Handler Script

Create `scripts/check-swarm-alerts.js`:

```javascript
#!/usr/bin/env node

const fs = require('fs');
const alerts = require('../profilers/alerts.json');

function checkAlerts(results) {
  const violations = [];

  for (const [alertName, alert] of Object.entries(alerts.alerts)) {
    let value;

    if (alert.type === 'threshold') {
      value = getNestedValue(results, alert.metric);

      if (alert.max && value > alert.max) {
        violations.push({
          alert: alertName,
          severity: alert.severity,
          message: alert.message,
          value,
          threshold: alert.max,
          operator: 'max'
        });
      }

      if (alert.min && value < alert.min) {
        violations.push({
          alert: alertName,
          severity: alert.severity,
          message: alert.message,
          value,
          threshold: alert.min,
          operator: 'min'
        });
      }
    } else if (alert.type === 'ratio') {
      const num = getNestedValue(results, alert.numerator);
      const denom = getNestedValue(results, alert.denominator);
      value = num / denom;

      if (value > alert.max) {
        violations.push({
          alert: alertName,
          severity: alert.severity,
          message: alert.message,
          value: (value * 100).toFixed(2),
          threshold: (alert.max * 100).toFixed(2),
          operator: 'max'
        });
      }
    }
  }

  return violations;
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((val, key) => val?.[key], obj);
}

async function main() {
  const resultsFile = process.argv[2];

  if (!resultsFile || !fs.existsSync(resultsFile)) {
    console.error('Usage: check-swarm-alerts.js <results.json>');
    process.exit(1);
  }

  const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
  const violations = checkAlerts(results);

  if (violations.length === 0) {
    console.log('✓ No alert violations');
    process.exit(0);
  }

  console.log(`\n⚠️  ${violations.length} Alert Violation(s)\n`);

  for (const v of violations) {
    const severity = v.severity === 'high' ? '❌' : '⚠️ ';
    console.log(`${severity} ${v.alert}`);
    console.log(`   ${v.message}`);
    console.log(`   Value: ${v.value} | Threshold: ${v.threshold} (${v.operator})\n`);
  }

  process.exit(violations.some(v => v.severity === 'high') ? 1 : 0);
}

main();
```

## Trend Analysis

### Historical Data Collection

Create `scripts/collect-profile-history.js`:

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const HISTORY_FILE = 'profilers/results/history.jsonl';

function recordResult(resultsFile) {
  if (!fs.existsSync(resultsFile)) {
    console.error(`Results file not found: ${resultsFile}`);
    process.exit(1);
  }

  const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));

  const record = {
    timestamp: new Date().toISOString(),
    gitSha: process.env.GIT_SHA || 'unknown',
    branch: process.env.GIT_BRANCH || 'unknown',
    scenario: results.scenario,
    throughput: results.summary.messagesPerSecond,
    latency: {
      mean: results.performance.messageLatency.mean,
      p99: results.performance.messageLatency.p99
    },
    memory: results.memory.delta.heapUsed / 1024 / 1024,
    successRate: parseFloat(results.summary.successRate)
  };

  // Append to history
  fs.appendFileSync(HISTORY_FILE, JSON.stringify(record) + '\n');
  console.log(`✓ Recorded: ${record.timestamp}`);
}

if (require.main === module) {
  const resultsFile = process.argv[2];
  recordResult(resultsFile);
}

module.exports = recordResult;
```

### Trend Analysis Report

Create `scripts/analyze-trends.js`:

```javascript
#!/usr/bin/env node

const fs = require('fs');

const HISTORY_FILE = 'profilers/results/history.jsonl';

function analyzeTrends() {
  if (!fs.existsSync(HISTORY_FILE)) {
    console.error('No history file found');
    process.exit(1);
  }

  const lines = fs.readFileSync(HISTORY_FILE, 'utf8').trim().split('\n');
  const records = lines.map(l => JSON.parse(l));

  if (records.length < 2) {
    console.log('Need at least 2 records for trend analysis');
    return;
  }

  // Group by scenario
  const byScenario = {};
  records.forEach(r => {
    if (!byScenario[r.scenario]) byScenario[r.scenario] = [];
    byScenario[r.scenario].push(r);
  });

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║         Swarm Profiler - Trend Analysis                   ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  for (const [scenario, data] of Object.entries(byScenario)) {
    console.log(`\n${scenario.toUpperCase()}`);
    console.log(`Records: ${data.length}`);

    const throughputs = data.map(r => r.throughput);
    const latencies = data.map(r => r.latency.p99);

    const trend = calculateTrend(throughputs);
    console.log(`Throughput: ${trend} (avg ${(throughputs.reduce((a, b) => a + b) / throughputs.length).toFixed(0)} msg/s)`);

    const latencyTrend = calculateTrend(latencies);
    console.log(`Latency (p99): ${latencyTrend} (avg ${(latencies.reduce((a, b) => a + b) / latencies.length).toFixed(2)} ms)`);
  }
}

function calculateTrend(values) {
  if (values.length < 2) return '→';

  const first = values[0];
  const last = values[values.length - 1];
  const change = (last - first) / first;

  if (change > 0.05) return '📈 worsening';
  if (change < -0.05) return '📉 improving';
  return '→ stable';
}

if (require.main === module) {
  analyzeTrends();
}
```

## Production Setup Checklist

- [ ] Create baseline profiles for all scenarios
- [ ] Configure CI/CD workflow
- [ ] Set up pre-commit hooks
- [ ] Create alert thresholds
- [ ] Configure notifications (Slack, email, GitHub)
- [ ] Set up history collection
- [ ] Schedule nightly comprehensive tests
- [ ] Document performance expectations
- [ ] Train team on interpretation
- [ ] Set up monitoring dashboard

## See Also

- `SWARM-PROFILER.md` - Documentation
- `SWARM-PROFILER-EXAMPLES.md` - Usage examples
- `swarm-profiler.js` - Source code
