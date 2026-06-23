# Performance Profilers

Collection of production-grade profilers for measuring and optimizing frontend performance.

## Profilers

### SVG Inspector Profiler

**Purpose:** Profile SVG rendering performance for large-scale graph visualizations.

**Measures:**
- DOM operations (appendChild, insertBefore, removeChild, setAttribute, removeAttribute)
- Reflow/repaint metrics with threshold detection
- Layout thrashing patterns (interleaved reads/writes)
- Event handler execution time by type
- Memory heap growth and snapshots
- Frame count and average frame times
- SVG-specific attribute changes (d, transform, cx, cy, r)

**Files:**
- `svg-inspector-profiler.js` - Core profiler implementation
- `svg-inspector-profiler.md` - Complete documentation and API reference
- `svg-inspector-profiler.test.js` - Comprehensive test suite
- `svg-inspector-example.html` - Interactive demo with UI

**Quick Start:**
```javascript
import SVGInspectorProfiler from './profilers/svg-inspector-profiler.js';

const profiler = new SVGInspectorProfiler({
  verbose: true,
  trackMemory: true,
});

profiler.start();
// ... render SVG operations ...
const report = profiler.stop();

console.log(report.recommendations);
```

## Core Capabilities

### 1. DOM Operation Tracking
Monitors and categorizes:
- `appendChild()` - Adding child nodes
- `insertBefore()` - Inserting nodes at specific positions
- `removeChild()` - Removing child nodes
- `setAttribute()` - Setting element attributes
- `removeAttribute()` - Removing attributes

### 2. Reflow/Repaint Detection
Measures:
- Layout recalculation duration
- Paint operation timing
- Threshold exceedance (configurable)
- Slowest operations ranking

### 3. Layout Thrashing Detection
Identifies:
- Interleaved DOM reads and writes
- Synchronous layout forcing patterns
- Severity levels (low/medium/high)
- Specific operation sequences

### 4. Event Handler Profiling
Tracks:
- Individual event handler timing
- Event type categorization
- Performance overhead measurement
- Handler duration ranking

### 5. Memory Analysis
Captures:
- JavaScript heap usage snapshots
- Memory growth over time
- Peak memory usage
- Growth percentage calculation

### 6. SVG-Specific Metrics
Focuses on critical attributes:
- `d` - SVG path data
- `transform` - Transformation matrices
- `cx`, `cy` - Circle centers
- `r` - Circle radius
- Changes frequency and impact

## Configuration Options

```javascript
new SVGInspectorProfiler({
  captureEnabled: true,              // Enable/disable capture
  sampleInterval: 16,                // Frame sampling interval (ms)
  maxSamples: 1000,                  // Max memory snapshots to keep
  trackMemory: true,                 // Enable memory profiling
  trackPaint: true,                  // Enable paint tracking
  verbose: false,                    // Log profiler events
  reflowThreshold: 16.67,            // Reflow threshold (ms, ~60fps)
  repaintThreshold: 16.67,           // Repaint threshold (ms)
  eventHandlerThreshold: 10,         // Event handler threshold (ms)
})
```

## Installation & Usage

```javascript
import SVGInspectorProfiler from './profilers/svg-inspector-profiler.js';

// Create profiler
const profiler = new SVGInspectorProfiler({
  verbose: true,
  trackMemory: true,
});

// Start monitoring
const svgElement = document.querySelector('svg');
profiler.start(svgElement);

// ... perform SVG operations ...

// Stop and get report
const report = profiler.stop();
```

## Report Structure

All profilers return a comprehensive report:

```javascript
{
  summary: {
    totalDuration,        // Total profiling duration (ms)
    frameCount,           // Number of frames monitored
    averageFrameTime,     // Average frame duration (ms)
  },
  domOperations: {
    count,                // Total DOM operations
    byType,               // Operations grouped by type
    rate,                 // Operations per second
    averageNodeCount,     // Avg nodes per operation
    peaks,                // Operation rate peaks
  },
  reflows: {
    count,                // Total reflows
    totalDuration,        // Combined duration
    averageDuration,      // Per-reflow duration
    exceeded,             // Count exceeding threshold
    exceedanceRate,       // Percentage over threshold
    slowestReflows,       // Top 5 slowest (with details)
  },
  repaints: {
    count,
    totalDuration,
    averageDuration,
    exceeded,
    exceedanceRate,
  },
  eventHandlers: {
    count,                // Total event handlers fired
    byType,               // Grouped by event type (mousemove, click, etc.)
    totalDuration,        // Combined handler time
    slowestHandlers,      // Top 5 slowest (with details)
  },
  attributeChanges: {
    count,                // Total attribute changes
    byAttribute,          // Grouped by attribute name
    criticalChanges,      // Count of critical SVG attrs
    criticalRate,         // Percentage that are critical
  },
  layoutThrashing: {
    detected,             // Whether thrashing pattern found
    instances,            // Number of detected instances
    severity,             // 'none', 'low', 'medium', 'high'
    peaks,                // Most severe instances
  },
  memory: {
    available,            // Whether performance.memory available
    initial,              // Initial heap size (bytes)
    final,                // Final heap size (bytes)
    heapGrowth,           // Absolute growth (bytes)
    heapGrowthPercent,    // Percentage growth
    peak,                 // Peak heap size (bytes)
    snapshots,            // Number of snapshots captured
  },
  recommendations: [
    {
      category,           // Performance category
      priority,           // 'high', 'medium', 'low'
      message,            // Issue description
      action,             // Suggested fix
    },
    // ...
  ]
}
```

## Export Formats

### JSON Export
```javascript
const json = profiler.exportJSON();
fs.writeFileSync('profile.json', json);
```

### CSV Export
```javascript
const csv = profiler.exportCSV();
fs.writeFileSync('profile.csv', csv);
```

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| MutationObserver | ✓ | ✓ | ✓ | ✓ |
| ResizeObserver | ✓ | ✓ | ✓ | ✓ |
| PerformanceObserver | ✓ | ✓ | ✓ | ✓ |
| performance.memory | ✓* | ✗ | ✗ | ✓* |

*Requires `--enable-precise-memory-info` flag

## Performance Overhead

- **Memory:** ~5-10MB for 1000 samples
- **CPU:** <2% monitoring overhead
- **Event Interception:** ~1-5% per event

## Troubleshooting

### Memory API Not Available
The `performance.memory` API is only available in Chromium-based browsers with specific flags:

```bash
google-chrome --enable-precise-memory-info
chromium-browser --enable-precise-memory-info
```

### Interceptors Cannot Be Restored
DOM method interceptors modify prototypes and cannot be fully restored. For clean profiling, create a new SVG context or iframe.

### High Frame Count
Unusual frame counts may indicate requestAnimationFrame throttling. The profiler respects browser frame rate limits.

## License

MIT
