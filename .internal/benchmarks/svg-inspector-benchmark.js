#!/usr/bin/env node

/**
 * SVG Inspector Benchmark Suite
 *
 * Measures performance across:
 * - SVG rendering time (1K, 10K, 100K nodes)
 * - Pan/zoom performance
 * - Memory usage
 * - Click detection latency
 * - JSON-to-SVG conversion time
 *
 * Usage:
 *   node benchmarks/svg-inspector-benchmark.js [--suite all|rendering|pan|memory|click]
 *   node benchmarks/svg-inspector-benchmark.js --output results.json
 */

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');
const vm = require('vm');

// ============================================================================
// BENCHMARK CONFIG
// ============================================================================

const BENCHMARK_CONFIG = {
  runs: 5,           // Number of test runs per benchmark
  warmup: 2,         // Warm-up runs before measuring
  nodeSizes: [1000, 10000, 100000],
  panZoomIterations: 100,
  memoryCheckInterval: 10,
};

// ============================================================================
// TEST DATA GENERATORS
// ============================================================================

function generateSvgMap(elementCount, type = 'mixed') {
  const elements = [];
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  for (let i = 0; i < elementCount; i++) {
    const elementType = type === 'mixed' ?
      ['rect', 'circle', 'line', 'polygon'][i % 4] :
      type;

    const baseProps = {
      id: `elem-${i}`,
      fill: colors[i % colors.length],
      stroke: colors[(i + 1) % colors.length],
      'stroke-width': 1 + (i % 3),
      opacity: 0.7 + (Math.random() * 0.3),
    };

    switch (elementType) {
      case 'rect':
        elements.push({
          type: 'rect',
          x: (i * 5) % 800,
          y: (i * 7) % 600,
          width: 20 + (i % 40),
          height: 20 + ((i * 3) % 40),
          ...baseProps,
        });
        break;

      case 'circle':
        elements.push({
          type: 'circle',
          cx: (i * 11) % 800,
          cy: (i * 13) % 600,
          r: 5 + (i % 15),
          ...baseProps,
        });
        break;

      case 'line':
        elements.push({
          type: 'line',
          x1: (i * 3) % 800,
          y1: (i * 5) % 600,
          x2: ((i + 50) * 3) % 800,
          y2: ((i + 50) * 5) % 600,
          ...baseProps,
        });
        break;

      case 'polygon':
        const points = [];
        for (let j = 0; j < 5; j++) {
          const angle = (j / 5) * Math.PI * 2;
          const x = ((i * 7) % 800) + Math.cos(angle) * (10 + (i % 20));
          const y = ((i * 11) % 600) + Math.sin(angle) * (10 + (i % 20));
          points.push(`${x},${y}`);
        }
        elements.push({
          type: 'polygon',
          points: points.join(' '),
          ...baseProps,
        });
        break;
    }
  }

  return {
    type: 'svg-map',
    version: '1.0',
    width: 800,
    height: 600,
    viewBox: '0 0 800 600',
    title: `Test Map - ${elementCount} elements`,
    metadata: {
      generator: 'benchmark-suite',
      timestamp: new Date().toISOString(),
      elementCount,
    },
    elements,
  };
}

// ============================================================================
// BENCHMARK SUITE
// ============================================================================

class SvgInspectorBenchmark {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      platform: {
        node: process.version,
        platform: process.platform,
        arch: process.arch,
        cpus: require('os').cpus().length,
      },
      suites: {},
    };
  }

  async run(suiteName = 'all') {
    console.log('\n========================================');
    console.log('  SVG Inspector Benchmark Suite');
    console.log('========================================\n');

    const suites = {
      rendering: () => this.benchmarkRendering(),
      pan_zoom: () => this.benchmarkPanZoom(),
      memory: () => this.benchmarkMemory(),
      click_detection: () => this.benchmarkClickDetection(),
      json_conversion: () => this.benchmarkJsonConversion(),
    };

    if (suiteName === 'all') {
      for (const [name, fn] of Object.entries(suites)) {
        try {
          console.log(`Running ${name} benchmarks...`);
          this.results.suites[name] = await fn();
          console.log(`✓ ${name} complete\n`);
        } catch (err) {
          console.error(`✗ ${name} failed:`, err.message);
          this.results.suites[name] = { error: err.message };
        }
      }
    } else if (suites[suiteName]) {
      console.log(`Running ${suiteName} benchmarks...`);
      this.results.suites[suiteName] = await suites[suiteName]();
      console.log(`✓ ${suiteName} complete\n`);
    } else {
      console.error(`Unknown suite: ${suiteName}`);
      process.exit(1);
    }

    return this.results;
  }

  benchmarkRendering() {
    const results = {
      name: 'SVG Rendering Performance',
      tests: [],
    };

    for (const nodeCount of BENCHMARK_CONFIG.nodeSizes) {
      const times = [];
      const mapData = generateSvgMap(nodeCount);

      console.log(`  Testing ${nodeCount} nodes...`);

      // Warm-up
      for (let i = 0; i < BENCHMARK_CONFIG.warmup; i++) {
        this.jsonToSvgSimple(mapData);
      }

      // Measure
      for (let run = 0; run < BENCHMARK_CONFIG.runs; run++) {
        const start = performance.now();
        const svg = this.jsonToSvgSimple(mapData);
        const end = performance.now();
        times.push(end - start);
      }

      const stats = this.calculateStats(times);
      const sizeKb = (JSON.stringify(mapData).length / 1024).toFixed(2);

      results.tests.push({
        name: `Render ${nodeCount} nodes`,
        nodeCount,
        inputSizeKb: parseFloat(sizeKb),
        ...stats,
      });

      console.log(`    Mean: ${stats.mean.toFixed(2)}ms | Median: ${stats.median.toFixed(2)}ms | Stdev: ${stats.stdev.toFixed(2)}ms`);
    }

    return results;
  }

  benchmarkPanZoom() {
    const results = {
      name: 'Pan/Zoom Performance',
      tests: [],
    };

    // Test with different SVG sizes
    const testConfigs = [
      { nodeCount: 1000, operations: 100 },
      { nodeCount: 10000, operations: 100 },
      { nodeCount: 100000, operations: 50 },
    ];

    for (const config of testConfigs) {
      const mapData = generateSvgMap(config.nodeCount);
      const svg = this.jsonToSvgSimple(mapData);
      const times = [];

      console.log(`  Testing pan/zoom with ${config.nodeCount} nodes...`);

      // Warm-up
      for (let i = 0; i < BENCHMARK_CONFIG.warmup; i++) {
        this.simulatePanZoomOps(svg, 10);
      }

      // Measure
      for (let run = 0; run < BENCHMARK_CONFIG.runs; run++) {
        const start = performance.now();
        this.simulatePanZoomOps(svg, config.operations);
        const end = performance.now();
        times.push(end - start);
      }

      const stats = this.calculateStats(times);
      const opsPerMs = (config.operations / stats.mean).toFixed(1);

      results.tests.push({
        name: `Pan/Zoom ${config.nodeCount} nodes (${config.operations} ops)`,
        nodeCount: config.nodeCount,
        operationCount: config.operations,
        opsPerSecond: opsPerMs * 1000,
        ...stats,
      });

      console.log(`    Mean: ${stats.mean.toFixed(2)}ms | Ops/sec: ${(opsPerMs * 1000).toFixed(0)}`);
    }

    return results;
  }

  benchmarkMemory() {
    const results = {
      name: 'Memory Usage',
      tests: [],
    };

    for (const nodeCount of BENCHMARK_CONFIG.nodeSizes) {
      console.log(`  Measuring memory for ${nodeCount} nodes...`);

      // Force garbage collection if available
      if (global.gc) global.gc();

      const beforeMem = process.memoryUsage();
      const mapData = generateSvgMap(nodeCount);
      const svg = this.jsonToSvgSimple(mapData);

      // Create multiple instances to measure total memory
      const instances = [];
      for (let i = 0; i < 5; i++) {
        instances.push({
          map: JSON.parse(JSON.stringify(mapData)),
          svg: svg,
        });
      }

      const afterMem = process.memoryUsage();

      results.tests.push({
        name: `Memory ${nodeCount} nodes (5 instances)`,
        nodeCount,
        heapUsedMb: ((afterMem.heapUsed - beforeMem.heapUsed) / 1024 / 1024).toFixed(2),
        externalMemMb: ((afterMem.external - beforeMem.external) / 1024 / 1024).toFixed(2),
        rssChangeMb: ((afterMem.rss - beforeMem.rss) / 1024 / 1024).toFixed(2),
        jsonSizeKb: (JSON.stringify(mapData).length / 1024).toFixed(2),
        svgSizeKb: (svg.length / 1024).toFixed(2),
      });

      console.log(`    Heap: ${results.tests[results.tests.length - 1].heapUsedMb}MB | JSON: ${results.tests[results.tests.length - 1].jsonSizeKb}KB | SVG: ${results.tests[results.tests.length - 1].svgSizeKb}KB`);
    }

    return results;
  }

  benchmarkClickDetection() {
    const results = {
      name: 'Click Detection Latency',
      tests: [],
    };

    const testConfigs = [
      { nodeCount: 1000, clicks: 100 },
      { nodeCount: 10000, clicks: 100 },
      { nodeCount: 100000, clicks: 50 },
    ];

    for (const config of testConfigs) {
      const mapData = generateSvgMap(config.nodeCount);
      const times = [];

      console.log(`  Testing click detection with ${config.nodeCount} nodes...`);

      // Warm-up
      for (let i = 0; i < BENCHMARK_CONFIG.warmup; i++) {
        this.simulateClickDetection(mapData, 10);
      }

      // Measure
      for (let run = 0; run < BENCHMARK_CONFIG.runs; run++) {
        const start = performance.now();
        this.simulateClickDetection(mapData, config.clicks);
        const end = performance.now();
        times.push(end - start);
      }

      const stats = this.calculateStats(times);
      const latencyPerClick = stats.mean / config.clicks;

      results.tests.push({
        name: `Click Detection ${config.nodeCount} nodes (${config.clicks} clicks)`,
        nodeCount: config.nodeCount,
        clickCount: config.clicks,
        latencyPerClickMs: latencyPerClick.toFixed(4),
        ...stats,
      });

      console.log(`    Mean: ${stats.mean.toFixed(2)}ms | Per-click: ${latencyPerClick.toFixed(4)}ms`);
    }

    return results;
  }

  benchmarkJsonConversion() {
    const results = {
      name: 'JSON to SVG Conversion',
      tests: [],
    };

    for (const nodeCount of BENCHMARK_CONFIG.nodeSizes) {
      const mapData = generateSvgMap(nodeCount);
      const times = [];

      console.log(`  Testing JSON→SVG conversion with ${nodeCount} nodes...`);

      // Warm-up
      for (let i = 0; i < BENCHMARK_CONFIG.warmup; i++) {
        this.jsonToSvgSimple(mapData);
      }

      // Measure
      for (let run = 0; run < BENCHMARK_CONFIG.runs; run++) {
        const start = performance.now();
        const svg = this.jsonToSvgSimple(mapData);
        const end = performance.now();
        times.push(end - start);
      }

      const stats = this.calculateStats(times);
      const compressionRatio = (JSON.stringify(mapData).length / stats.mean).toFixed(1);

      results.tests.push({
        name: `JSON→SVG ${nodeCount} nodes`,
        nodeCount,
        ...stats,
        nodesPerMs: (nodeCount / stats.mean).toFixed(1),
      });

      console.log(`    Mean: ${stats.mean.toFixed(2)}ms | Nodes/ms: ${(nodeCount / stats.mean).toFixed(1)}`);
    }

    return results;
  }

  // ========================================================================
  // HELPER FUNCTIONS
  // ========================================================================

  jsonToSvgSimple(data) {
    const width = data.width || 800;
    const height = data.height || 600;

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

    if (Array.isArray(data.elements)) {
      data.elements.forEach((el, i) => {
        switch (el.type) {
          case 'rect':
            svg += `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="${el.fill}" stroke="${el.stroke}" data-id="${i}"/>`;
            break;
          case 'circle':
            svg += `<circle cx="${el.cx}" cy="${el.cy}" r="${el.r}" fill="${el.fill}" stroke="${el.stroke}" data-id="${i}"/>`;
            break;
          case 'line':
            svg += `<line x1="${el.x1}" y1="${el.y1}" x2="${el.x2}" y2="${el.y2}" stroke="${el.stroke}" data-id="${i}"/>`;
            break;
          case 'polygon':
            svg += `<polygon points="${el.points}" fill="${el.fill}" stroke="${el.stroke}" data-id="${i}"/>`;
            break;
        }
      });
    }

    svg += '</svg>';
    return svg;
  }

  simulatePanZoomOps(svg, operations) {
    // Simulate pan/zoom by extracting and parsing SVG dimensions
    let zoomLevel = 1;
    let panX = 0;
    let panY = 0;

    for (let i = 0; i < operations; i++) {
      // Zoom operation
      if (i % 2 === 0) {
        zoomLevel = Math.max(0.5, Math.min(5, zoomLevel + (Math.random() * 0.4 - 0.2)));
      } else {
        // Pan operation
        panX += (Math.random() * 100 - 50);
        panY += (Math.random() * 100 - 50);
      }

      // Simulate viewport recalculation
      const viewportWidth = 800 / zoomLevel;
      const viewportHeight = 600 / zoomLevel;
    }
  }

  simulateClickDetection(mapData, clickCount) {
    // Simulate click detection by searching for element at random coordinates
    for (let i = 0; i < clickCount; i++) {
      const x = Math.random() * 800;
      const y = Math.random() * 600;

      // Linear search to find element (simulates click detection)
      for (const el of mapData.elements) {
        let hit = false;
        switch (el.type) {
          case 'rect':
            hit = x >= el.x && x <= el.x + el.width &&
                  y >= el.y && y <= el.y + el.height;
            break;
          case 'circle':
            const dx = x - el.cx;
            const dy = y - el.cy;
            hit = Math.sqrt(dx * dx + dy * dy) <= el.r;
            break;
          case 'line':
            // Simple bounding box check for lines
            hit = x >= Math.min(el.x1, el.x2) - 5 &&
                  x <= Math.max(el.x1, el.x2) + 5 &&
                  y >= Math.min(el.y1, el.y2) - 5 &&
                  y <= Math.max(el.y1, el.y2) + 5;
            break;
        }
        if (hit) break;
      }
    }
  }

  calculateStats(times) {
    const sorted = [...times].sort((a, b) => a - b);
    const mean = times.reduce((a, b) => a + b, 0) / times.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const stdev = Math.sqrt(
      times.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / times.length
    );

    return {
      mean: parseFloat(mean.toFixed(2)),
      median: parseFloat(median.toFixed(2)),
      stdev: parseFloat(stdev.toFixed(2)),
      min: parseFloat(min.toFixed(2)),
      max: parseFloat(max.toFixed(2)),
    };
  }

  printReport() {
    console.log('\n========================================');
    console.log('  BENCHMARK REPORT');
    console.log('========================================\n');

    console.log(`Platform: ${this.results.platform.platform} | Node ${this.results.platform.node}`);
    console.log(`CPUs: ${this.results.platform.cpus} | Arch: ${this.results.platform.arch}\n`);

    for (const [suiteName, suite] of Object.entries(this.results.suites)) {
      if (suite.error) {
        console.log(`❌ ${suiteName}: ${suite.error}`);
        continue;
      }

      console.log(`📊 ${suite.name}`);
      console.log('-'.repeat(60));

      for (const test of suite.tests) {
        const name = test.name.padEnd(45);

        // Handle different test types (memory tests don't have mean/median)
        if (suiteName === 'memory') {
          const heap = `${test.heapUsedMb}MB`.padStart(10);
          const json = `${test.jsonSizeKb}KB`.padStart(10);
          const svg = `${test.svgSizeKb}KB`.padStart(10);
          console.log(`  ${name} | Heap: ${heap} | JSON: ${json} | SVG: ${svg}`);
        } else {
          const mean = test.mean ? `${test.mean.toFixed(2)}ms`.padStart(10) : '—'.padStart(10);
          const median = test.median ? `${test.median.toFixed(2)}ms`.padStart(10) : '—'.padStart(10);
          console.log(`  ${name} | ${mean} | ${median}`);
        }
      }
      console.log();
    }
  }

  async saveReport(outputPath) {
    const fullPath = path.resolve(outputPath);
    fs.writeFileSync(fullPath, JSON.stringify(this.results, null, 2));
    console.log(`\n✓ Report saved to ${path.relative(process.cwd(), fullPath)}`);
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const suiteName = args.includes('--all') ? 'all' :
                    args.find(a => a.startsWith('--suite='))?.split('=')[1] || 'all';
  const outputFile = args.find(a => a.startsWith('--output='))?.split('=')[1];

  const benchmark = new SvgInspectorBenchmark();
  await benchmark.run(suiteName);

  benchmark.printReport();

  if (outputFile) {
    await benchmark.saveReport(outputFile);
  } else {
    // Save to default location
    const defaultPath = path.join(__dirname, 'svg-inspector-results.json');
    await benchmark.saveReport(defaultPath);
  }
}

main().catch(err => {
  console.error('Benchmark failed:', err);
  process.exit(1);
});

module.exports = { SvgInspectorBenchmark, generateSvgMap };
