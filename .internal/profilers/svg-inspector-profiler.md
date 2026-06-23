# SVG Inspector Profiler

Production-grade performance profiler for SVG rendering, measuring DOM operations, layout thrashing, reflow/repaint metrics, and event handling overhead. Optimized for large-scale graph visualizations.

## Features

- **DOM Operation Tracking**: Monitors appendChild, insertBefore, removeChild, setAttribute, removeAttribute
- **Reflow/Repaint Analysis**: Captures layout recalculations and paint operations with threshold detection
- **Layout Thrashing Detection**: Identifies interleaved DOM reads/writes that force synchronous layouts
- **Event Handler Profiling**: Measures execution time of event listeners with categorization by type
- **Memory Profiling**: Tracks heap growth and memory snapshots over time
- **Frame Monitoring**: Captures frame count and average frame times
- **SVG-Specific Metrics**: Focuses on critical SVG attributes (d, transform, cx, cy, r)
- **Actionable Recommendations**: Generates optimization suggestions based on detected patterns

## Installation

```javascript
import SVGInspectorProfiler from './profilers/svg-inspector-profiler.js';
```

## Quick Start

```javascript
// Initialize profiler
const profiler = new SVGInspectorProfiler({
  verbose: true,
  trackMemory: true,
  trackPaint: true,
});

// Start profiling
const svgElement = document.querySelector('svg');
profiler.start(svgElement);

// ... perform SVG operations ...

// Stop and get report
const report = profiler.stop();
console.log(report);
```

## API Reference

### Constructor Options

```javascript
new SVGInspectorProfiler({
  captureEnabled: true,           // Enable/disable capture (default: true)
  sampleInterval: 16,              // Frame sampling interval in ms (default: 16)
  maxSamples: 1000,                // Max memory snapshots to keep (default: 1000)
  trackMemory: true,               // Enable memory profiling (default: true)
  trackPaint: true,                // Enable paint tracking (default: true)
  verbose: false,                  // Log profiler events (default: false)
  reflowThreshold: 16.67,          // Reflow threshold in ms (default: 60fps)
  repaintThreshold: 16.67,         // Repaint threshold in ms (default: 60fps)
  eventHandlerThreshold: 10,       // Event handler threshold in ms (default: 10)
})
```

### Methods

#### `start(svgElement)`
Begin profiling SVG operations.

**Parameters:**
- `svgElement` (HTMLElement, optional): Target SVG element. If not provided, monitors entire document.

**Example:**
```javascript
const svg = document.querySelector('#graph-container svg');
profiler.start(svg);
```

#### `stop()`
Stop profiling and return metrics.

**Returns:** Complete profiler report object

**Example:**
```javascript
const report = profiler.stop();
```

#### `getReport()`
Get the current profiler report without stopping.

**Returns:** Report object with all metrics and analysis

**Report Structure:**
```javascript
{
  summary: {
    totalDuration,     // Total profiling duration in ms
    frameCount,        // Number of frames captured
    averageFrameTime,  // Average frame time in ms
  },
  domOperations: {
    count,
    byType,           // Operations grouped by type
    rate,             // Operations per second
    averageNodeCount,
    peaks,
  },
  reflows: {
    count,
    totalDuration,
    averageDuration,
    exceeded,
    exceedanceRate,
    slowestReflows,   // Top 5 slowest reflows
  },
  repaints: {
    count,
    totalDuration,
    averageDuration,
    exceeded,
    exceedanceRate,
  },
  eventHandlers: {
    count,
    byType,           // Events grouped by type
    totalDuration,
    slowestHandlers,  // Top 5 slowest handlers
  },
  attributeChanges: {
    count,
    byAttribute,      // Changes grouped by attribute name
    criticalChanges,  // Count of critical SVG attributes
    criticalRate,     // Percentage of critical changes
  },
  layoutThrashing: {
    detected,
    instances,
    severity,         // 'none', 'low', 'medium', 'high'
    peaks,
  },
  memory: {
    available,
    initial,
    final,
    heapGrowth,
    heapGrowthPercent,
    peak,
    snapshots,
  },
  recommendations: [
    {
      category,       // Performance category
      priority,       // 'high', 'medium', 'low'
      message,        // Description
      action,         // Suggested fix
    },
    // ...
  ]
}
```

#### `exportJSON()`
Export profiler report as JSON string.

**Returns:** Stringified report object

```javascript
const jsonReport = profiler.exportJSON();
fs.writeFileSync('profile-report.json', jsonReport);
```

#### `exportCSV()`
Export profiler report as CSV format.

**Returns:** CSV string

```javascript
const csvReport = profiler.exportCSV();
fs.writeFileSync('profile-report.csv', csvReport);
```

## Usage Examples

### Basic Performance Profiling

```javascript
const profiler = new SVGInspectorProfiler({ verbose: true });
const svg = document.querySelector('svg');

profiler.start(svg);

// Simulate graph rendering
renderLargeGraph(svg, 10000);

const report = profiler.stop();

console.log(`DOM Operations: ${report.domOperations.count}`);
console.log(`Reflows: ${report.reflows.count}`);
console.log(`Event Handlers: ${report.eventHandlers.count}`);
console.log(`Recommendations: ${report.recommendations.length}`);
```

### Detecting Layout Thrashing

```javascript
const profiler = new SVGInspectorProfiler();
profiler.start();

// Bad pattern - interleaved reads/writes
for (let i = 0; i < 100; i++) {
  const width = element.offsetWidth;  // Read
  element.style.width = (width + 10) + 'px';  // Write
}

const report = profiler.stop();

if (report.layoutThrashing.detected) {
  console.warn(
    `LAYOUT THRASHING: ${report.layoutThrashing.severity} severity, ` +
    `${report.layoutThrashing.instances} instances detected`
  );
  
  report.recommendations.forEach(rec => {
    if (rec.category === 'Layout Thrashing') {
      console.log(`Action: ${rec.action}`);
    }
  });
}
```

### Continuous Monitoring with Thresholds

```javascript
const profiler = new SVGInspectorProfiler({
  reflowThreshold: 10,           // Alert if reflow > 10ms
  eventHandlerThreshold: 5,      // Alert if handler > 5ms
});

profiler.start();

// Perform operations
updateGraphNodes(nodes);

const report = profiler.stop();

// Check for exceeded thresholds
if (report.reflows.exceeded > 0) {
  console.warn(
    `${report.reflows.exceeded} reflows exceeded ${report.reflows.slowestReflows[0].duration.toFixed(2)}ms`
  );
}

if (report.eventHandlers.count > 0) {
  report.eventHandlers.slowestHandlers.forEach(handler => {
    if (handler.exceeded) {
      console.warn(`Event ${handler.eventType} took ${handler.duration.toFixed(2)}ms`);
    }
  });
}
```

### Memory Leak Detection

```javascript
const profiler = new SVGInspectorProfiler({ trackMemory: true });
profiler.start();

// Run potentially memory-intensive operations
for (let i = 0; i < 100; i++) {
  addAndRemoveNodes(svg, 1000);
}

const report = profiler.stop();

const memory = report.memory;
if (memory.heapGrowthPercent > 30) {
  console.warn(
    `MEMORY GROWTH: ${memory.heapGrowthPercent.toFixed(1)}% ` +
    `(${memory.heapGrowth / 1024 / 1024}MB)`
  );
}
```

### SVG Attribute Optimization

```javascript
const profiler = new SVGInspectorProfiler();
profiler.start();

// Update graph attributes
nodes.forEach(node => {
  node.setAttribute('d', newPath);
  node.setAttribute('transform', `translate(${x},${y})`);
});

const report = profiler.stop();
const attrs = report.attributeChanges;

console.log(`Critical SVG attribute changes: ${attrs.criticalRate.toFixed(1)}%`);
console.log(`Attributes by type:`, attrs.byAttribute);

// If critical rate is high, recommend using CSS transforms
if (attrs.criticalRate > 50) {
  console.log('Consider using CSS transforms instead of SVG transform attributes');
}
```

### Event Handler Optimization

```javascript
const profiler = new SVGInspectorProfiler();
profiler.start();

// Add event listeners to many elements
nodes.forEach(node => {
  node.addEventListener('mousemove', handleMouseMove);
  node.addEventListener('click', handleClick);
});

const report = profiler.stop();

// Analyze event performance
Object.entries(report.eventHandlers.byType).forEach(([type, stats]) => {
  const avgDuration = stats.totalDuration / stats.count;
  console.log(`${type}: avg ${avgDuration.toFixed(2)}ms, exceeded ${stats.exceeded} times`);
});
```

### Benchmarking DOM Batch Operations

```javascript
async function benchmarkDOMBatching() {
  // Test 1: Individual updates
  const profiler1 = new SVGInspectorProfiler();
  profiler1.start();
  
  for (let i = 0; i < 1000; i++) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    svg.appendChild(el);
  }
  
  const report1 = profiler1.stop();
  
  // Test 2: Batched updates with requestAnimationFrame
  const profiler2 = new SVGInspectorProfiler();
  profiler2.start();
  
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 1000; i++) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    fragment.appendChild(el);
  }
  svg.appendChild(fragment);
  
  const report2 = profiler2.stop();
  
  console.log(`Individual updates: ${report1.summary.totalDuration.toFixed(2)}ms`);
  console.log(`Batched updates: ${report2.summary.totalDuration.toFixed(2)}ms`);
  console.log(`Improvement: ${(((report1.summary.totalDuration - report2.summary.totalDuration) / report1.summary.totalDuration) * 100).toFixed(1)}%`);
}

benchmarkDOMBatching();
```

## Performance Optimization Patterns

Based on profiler recommendations, apply these patterns:

### 1. Batch DOM Updates

```javascript
// Bad: Forces multiple reflows
for (let i = 0; i < 100; i++) {
  svg.appendChild(createElement(i));
}

// Good: Single reflow
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  fragment.appendChild(createElement(i));
}
svg.appendChild(fragment);
```

### 2. Separate Reads and Writes

```javascript
// Bad: Layout thrashing
for (let i = 0; i < 100; i++) {
  element.style.width = element.offsetWidth + 10 + 'px';
}

// Good: Batch reads, then writes
const widths = [];
for (let i = 0; i < 100; i++) {
  widths.push(element.offsetWidth);
}
for (let i = 0; i < 100; i++) {
  element.style.width = widths[i] + 10 + 'px';
}
```

### 3. Use CSS Transforms Over SVG Transforms

```javascript
// Instead of:
element.setAttribute('transform', `translate(${x},${y})`);

// Use:
element.style.transform = `translate(${x}px,${y}px)`;
```

### 4. Debounce Event Handlers

```javascript
function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

svg.addEventListener('mousemove', debounce(handleMouseMove, 50));
```

### 5. Use Event Delegation

```javascript
// Instead of attaching listeners to many elements
svg.addEventListener('click', (e) => {
  if (e.target.matches('circle')) {
    handleCircleClick(e.target);
  }
});
```

## Integration with Test Frameworks

### Jest

```javascript
describe('SVG Rendering Performance', () => {
  let profiler;

  beforeEach(() => {
    profiler = new SVGInspectorProfiler();
  });

  test('renders 1000 nodes efficiently', () => {
    profiler.start();
    renderNodes(1000);
    const report = profiler.stop();

    expect(report.reflows.exceeded).toBe(0);
    expect(report.domOperations.count).toBeLessThan(5000);
  });

  test('no layout thrashing on update', () => {
    profiler.start();
    updateNodePositions();
    const report = profiler.stop();

    expect(report.layoutThrashing.detected).toBe(false);
  });
});
```

### Mocha/Chai

```javascript
describe('SVG Performance', function() {
  it('should handle 5000 DOM operations without thrashing', function() {
    const profiler = new SVGInspectorProfiler();
    profiler.start();

    for (let i = 0; i < 5000; i++) {
      appendNodeToGraph();
    }

    const report = profiler.stop();
    expect(report.layoutThrashing.detected).to.be.false;
  });
});
```

## Troubleshooting

### Memory Not Available
The profiler uses `performance.memory` which is only available in Chromium-based browsers with `--enable-precise-memory-info` flag.

```bash
google-chrome --enable-precise-memory-info
```

### High Frame Count
If frame count seems unusually high, check if requestAnimationFrame is being throttled. The profiler respects browser frame rate limits.

### PerformanceObserver Not Available
Older browsers don't support PerformanceObserver. The profiler gracefully falls back to other monitoring methods.

### Intercepted Methods Not Restored
The DOM interceptors cannot be fully restored once applied. Create a new SVG context for clean profiling.

## Performance Overhead

- **Memory**: ~5-10MB for 1000 samples
- **CPU**: <2% overhead for monitoring
- **Event Interception**: ~1-5% overhead per event

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| MutationObserver | ✓ | ✓ | ✓ | ✓ |
| ResizeObserver | ✓ | ✓ | ✓ | ✓ |
| PerformanceObserver | ✓ | ✓ | ✓ | ✓ |
| performance.memory | ✓ (with flag) | ✗ | ✗ | ✓ (with flag) |

## Contributing

Report issues or improvements to the profiler tracking system performance regressions.

## License

MIT
