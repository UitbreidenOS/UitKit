# SVG Inspector Profiler - Integration Guide

## Quick Integration

### 1. ES6 Module Import
```javascript
import SVGInspectorProfiler from './svg-inspector-profiler.js';

const profiler = new SVGInspectorProfiler({ verbose: true });
profiler.start();
// ... operations ...
const report = profiler.stop();
```

### 2. CommonJS Require
```javascript
const SVGInspectorProfiler = require('./svg-inspector-profiler.js');

const profiler = new SVGInspectorProfiler();
profiler.start();
// ... operations ...
const report = profiler.stop();
```

### 3. Browser Global
```html
<script src="./svg-inspector-profiler.js"></script>
<script>
  const profiler = new SVGInspectorProfiler();
  profiler.start();
</script>
```

## Integration Patterns

### React Component
```javascript
import { useEffect, useState } from 'react';
import SVGInspectorProfiler from './profilers/svg-inspector-profiler.js';

export function GraphComponent({ data }) {
  const [metrics, setMetrics] = useState(null);
  const profilerRef = useRef(null);

  useEffect(() => {
    const profiler = new SVGInspectorProfiler({ 
      trackMemory: true,
      verbose: true,
    });
    profilerRef.current = profiler;

    profiler.start();
    return () => {
      const report = profiler.stop();
      setMetrics(report);
    };
  }, [data]);

  return (
    <div>
      <svg id="graph">{/* render data */}</svg>
      {metrics && (
        <div className="metrics">
          <p>DOM Ops: {metrics.domOperations.count}</p>
          <p>Reflows: {metrics.reflows.count}</p>
        </div>
      )}
    </div>
  );
}
```

### Vue Component
```vue
<template>
  <div>
    <svg ref="graph" id="graph"></svg>
    <div v-if="metrics" class="metrics">
      <p>DOM Operations: {{ metrics.domOperations.count }}</p>
      <p>Reflows: {{ metrics.reflows.count }}</p>
      <p>Layout Thrashing: {{ metrics.layoutThrashing.severity }}</p>
    </div>
  </div>
</template>

<script>
import SVGInspectorProfiler from './profilers/svg-inspector-profiler.js';

export default {
  data() {
    return {
      profiler: null,
      metrics: null,
    };
  },
  mounted() {
    this.profiler = new SVGInspectorProfiler({ trackMemory: true });
    this.profiler.start(this.$refs.graph);
  },
  beforeUnmount() {
    this.metrics = this.profiler.stop();
  },
};
</script>
```

### Angular Service
```typescript
import { Injectable } from '@angular/core';
import SVGInspectorProfiler from './svg-inspector-profiler.js';

@Injectable({ providedIn: 'root' })
export class PerformanceService {
  private profiler: SVGInspectorProfiler;

  startProfiling(selector?: string) {
    this.profiler = new SVGInspectorProfiler({ verbose: true });
    const element = selector ? document.querySelector(selector) : undefined;
    this.profiler.start(element);
  }

  stopProfiling() {
    return this.profiler.stop();
  }

  getReport() {
    return this.profiler.getReport();
  }
}
```

### Svelte Component
```svelte
<script>
  import SVGInspectorProfiler from './profilers/svg-inspector-profiler.js';

  let profiler;
  let metrics;

  onMount(() => {
    profiler = new SVGInspectorProfiler({ trackMemory: true });
    profiler.start();
  });

  onDestroy(() => {
    metrics = profiler.stop();
  });
</script>

<svg bind:this={svgElement}></svg>

{#if metrics}
  <div class="metrics">
    <p>DOM Ops: {metrics.domOperations.count}</p>
  </div>
{/if}
```

## Testing Integration

### Jest
```javascript
import SVGInspectorProfiler from './profilers/svg-inspector-profiler.js';

describe('Graph Performance', () => {
  let profiler;

  beforeEach(() => {
    profiler = new SVGInspectorProfiler();
  });

  test('renders 1000 nodes efficiently', () => {
    profiler.start();
    renderNodes(1000);
    const report = profiler.stop();

    expect(report.domOperations.count).toBeLessThan(5000);
    expect(report.layoutThrashing.detected).toBe(false);
  });

  test('no excessive reflows', () => {
    profiler.start();
    updatePositions();
    const report = profiler.stop();

    expect(report.reflows.exceeded).toBe(0);
  });
});
```

### Mocha/Chai
```javascript
describe('SVG Rendering', () => {
  let profiler;

  beforeEach(() => {
    profiler = new SVGInspectorProfiler();
  });

  it('should handle large datasets', () => {
    profiler.start();
    renderGraph(5000);
    const report = profiler.stop();

    expect(report.domOperations.count).to.be.below(10000);
    expect(report.layoutThrashing.severity).to.equal('none');
  });
});
```

### Puppeteer (E2E)
```javascript
const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.goto('http://localhost:3000');
await page.evaluate(() => {
  window.profiler = new SVGInspectorProfiler();
  window.profiler.start();
});

// Trigger operations
await page.click('#render-button');
await page.waitForTimeout(1000);

const report = await page.evaluate(() => window.profiler.stop());
console.log('Metrics:', report);
```

## CI/CD Integration

### GitHub Actions
```yaml
name: Performance Test
on: [push, pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - run: npm install
      - run: npm run test:performance
      
      - name: Comment PR with metrics
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('results/profile.json'));
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              body: `## Performance Metrics\n\n` +
                `- DOM Operations: ${report.domOperations.count}\n` +
                `- Reflows: ${report.reflows.count}\n` +
                `- Thrashing: ${report.layoutThrashing.severity}`
            });
```

### GitLab CI
```yaml
performance:
  stage: test
  script:
    - npm install
    - npm run test:performance
  artifacts:
    paths:
      - results/profile.json
    reports:
      performance: results/profile.json
```

## Performance Benchmarking

### Benchmark Script
```javascript
import SVGInspectorProfiler from './svg-inspector-profiler.js';

async function benchmarkGraphRendering() {
  const sizes = [100, 500, 1000, 5000];
  const results = {};

  for (const size of sizes) {
    const profiler = new SVGInspectorProfiler();
    profiler.start();
    
    renderGraph(size);
    
    const report = profiler.stop();
    results[size] = {
      duration: report.summary.totalDuration,
      domOps: report.domOperations.count,
      reflows: report.reflows.count,
      thrashing: report.layoutThrashing.detected,
    };
  }

  console.table(results);
  return results;
}

benchmarkGraphRendering();
```

### Load Testing
```javascript
async function loadTest() {
  const profilers = [];
  
  for (let i = 0; i < 10; i++) {
    const profiler = new SVGInspectorProfiler({ trackMemory: true });
    profiler.start();
    
    renderComplexGraph();
    
    const report = profiler.stop();
    profilers.push(report);
  }

  const avgDuration = profilers.reduce((sum, r) => sum + r.summary.totalDuration, 0) / profilers.length;
  const avgMemory = profilers.reduce((sum, r) => sum + (r.memory.heapGrowth || 0), 0) / profilers.length;

  console.log(`Average duration: ${avgDuration.toFixed(2)}ms`);
  console.log(`Average memory growth: ${(avgMemory / 1024 / 1024).toFixed(2)}MB`);
}
```

## Monitoring & Analytics

### Store Metrics for Trend Analysis
```javascript
import SVGInspectorProfiler from './svg-inspector-profiler.js';
import * as db from './database.js';

async function captureMetrics() {
  const profiler = new SVGInspectorProfiler();
  profiler.start();
  
  await renderGraph();
  
  const report = profiler.stop();
  
  // Store metrics
  await db.metrics.insert({
    timestamp: new Date(),
    branch: process.env.GIT_BRANCH,
    commit: process.env.GIT_COMMIT,
    duration: report.summary.totalDuration,
    domOps: report.domOperations.count,
    reflows: report.reflows.count,
    memory: report.memory.heapGrowth,
    recommendations: report.recommendations.length,
  });
}
```

### Trend Dashboard
```javascript
async function getTrends(branch, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const metrics = await db.metrics.find({
    branch,
    timestamp: { $gte: startDate },
  });

  return {
    avgDuration: metrics.reduce((s, m) => s + m.duration, 0) / metrics.length,
    maxDuration: Math.max(...metrics.map(m => m.duration)),
    avgReflows: metrics.reduce((s, m) => s + m.reflows, 0) / metrics.length,
    trendline: calculateTrendline(metrics),
  };
}
```

## Custom Configuration Presets

```javascript
// preset.high-sensitivity.js
export const highSensitivity = {
  reflowThreshold: 5,
  repaintThreshold: 5,
  eventHandlerThreshold: 2,
  trackMemory: true,
  maxSamples: 2000,
};

// preset.standard.js
export const standard = {
  reflowThreshold: 16.67,
  repaintThreshold: 16.67,
  eventHandlerThreshold: 10,
  trackMemory: true,
  maxSamples: 1000,
};

// preset.light.js
export const light = {
  reflowThreshold: 50,
  repaintThreshold: 50,
  eventHandlerThreshold: 30,
  trackMemory: false,
  maxSamples: 100,
};

// Usage
import { highSensitivity } from './presets.js';
const profiler = new SVGInspectorProfiler(highSensitivity);
```

## Troubleshooting Integration

### Issue: Profiler not capturing events
**Solution:** Ensure events are attached after profiler.start()

### Issue: High memory usage in CI
**Solution:** Reduce maxSamples or disable trackMemory
```javascript
const profiler = new SVGInspectorProfiler({
  maxSamples: 100,
  trackMemory: false, // Disable in CI
});
```

### Issue: Performance interference
**Solution:** Run profiler in separate worker thread or iframe
```javascript
// Use Web Worker
const worker = new Worker('profiler-worker.js');
worker.postMessage({ action: 'start' });
worker.postMessage({ action: 'stop' });
```

## Performance Tips

1. **Run profiler during non-interactive times** to minimize interference
2. **Increase thresholds in production** to reduce overhead
3. **Batch multiple profiling runs** for better trend data
4. **Use light preset** in performance-sensitive environments
5. **Export to analytics** for historical tracking
6. **Set up alerts** for critical metrics exceeding thresholds
