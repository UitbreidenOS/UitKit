/**
 * SVG Inspector Load Test
 * Renders massive SVG maps (10K nodes, 50K edges) with concurrent pan/zoom operations
 * Measures latency percentiles, throughput, and memory usage
 */

const assert = require('assert');
const { performance } = require('perf_hooks');

// Constants - can be overridden via CLI arguments
let DATASET_CONFIG = {
  nodes: 5_000,
  edges: 25_000,
  viewportWidth: 1920,
  viewportHeight: 1080,
};

let LOAD_CONFIG = {
  concurrentOps: 100,
  operationsPerConcurrent: 10,
  totalOperations: 500,
};

const OPERATIONS = ['pan', 'zoom', 'pan-zoom-combo'];

// SVG Map Data Generator
class SVGMapDataGenerator {
  constructor(nodeCount, edgeCount) {
    this.nodeCount = nodeCount;
    this.edgeCount = edgeCount;
    this.nodes = [];
    this.edges = [];
  }

  generate() {
    this.generateNodes();
    this.generateEdges();
    return { nodes: this.nodes, edges: this.edges };
  }

  generateNodes() {
    const mapWidth = 10_000;
    const mapHeight = 10_000;

    for (let i = 0; i < this.nodeCount; i++) {
      this.nodes.push({
        id: `node-${i}`,
        x: Math.random() * mapWidth,
        y: Math.random() * mapHeight,
        radius: 2 + Math.random() * 8,
        color: this.getRandomColor(),
        data: {
          label: `Node ${i}`,
          cluster: Math.floor(Math.random() * 100),
        },
      });
    }
  }

  generateEdges() {
    const edgeSet = new Set();
    let created = 0;

    while (created < this.edgeCount) {
      const sourceIdx = Math.floor(Math.random() * this.nodeCount);
      const targetIdx = Math.floor(Math.random() * this.nodeCount);

      if (sourceIdx !== targetIdx) {
        const edgeKey = `${sourceIdx}-${targetIdx}`;
        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey);
          this.edges.push({
            id: `edge-${created}`,
            source: `node-${sourceIdx}`,
            target: `node-${targetIdx}`,
            weight: Math.random() * 100,
            stroke: this.getRandomColor(),
            opacity: 0.3 + Math.random() * 0.4,
          });
          created++;
        }
      }
    }
  }

  getRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

// SVG Renderer
class SVGRenderer {
  constructor(data, viewportWidth, viewportHeight) {
    this.data = data;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.transformMatrix = { translateX: 0, translateY: 0, scale: 1 };
    this.renderCache = null;
  }

  render() {
    // Optimize: build node map for O(1) lookup
    if (!this.nodeMap) {
      this.nodeMap = new Map(this.data.nodes.map(n => [n.id, n]));
    }

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.viewportWidth}" height="${this.viewportHeight}" viewBox="0 0 ${this.viewportWidth} ${this.viewportHeight}">`;
    svg += this.renderDefs();
    svg += `<g transform="translate(${this.transformMatrix.translateX},${this.transformMatrix.translateY}) scale(${this.transformMatrix.scale})">`;

    // Render edges first (background) - with optimized lookup
    for (let i = 0; i < this.data.edges.length; i++) {
      const edge = this.data.edges[i];
      const source = this.nodeMap.get(edge.source);
      const target = this.nodeMap.get(edge.target);

      if (source && target) {
        svg += `<line x1="${source.x.toFixed(1)}" y1="${source.y.toFixed(1)}" x2="${target.x.toFixed(1)}" y2="${target.y.toFixed(1)}" stroke="${edge.stroke}" stroke-width="0.5" opacity="${edge.opacity}" />`;
      }
    }

    // Render nodes (foreground)
    for (let i = 0; i < this.data.nodes.length; i++) {
      const node = this.data.nodes[i];
      svg += `<circle cx="${node.x.toFixed(1)}" cy="${node.y.toFixed(1)}" r="${node.radius}" fill="${node.color}" opacity="0.8" />`;
    }

    svg += '</g></svg>';
    return svg;
  }

  renderDefs() {
    return `<defs>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3" />
      </filter>
      <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
        <polygon points="0 0, 10 3, 0 6" fill="#999" />
      </marker>
    </defs>`;
  }

  pan(deltaX, deltaY) {
    this.transformMatrix.translateX += deltaX;
    this.transformMatrix.translateY += deltaY;
    this.renderCache = null;
  }

  zoom(factor, originX = 0, originY = 0) {
    const newScale = Math.max(0.1, Math.min(10, this.transformMatrix.scale * factor));
    const scaleDiff = newScale - this.transformMatrix.scale;

    this.transformMatrix.translateX -= originX * scaleDiff;
    this.transformMatrix.translateY -= originY * scaleDiff;
    this.transformMatrix.scale = newScale;
    this.renderCache = null;
  }

  panZoomCombo(deltaX, deltaY, zoomFactor) {
    this.pan(deltaX, deltaY);
    this.zoom(zoomFactor);
  }

  getMetrics() {
    return {
      scale: this.transformMatrix.scale,
      translateX: this.transformMatrix.translateX,
      translateY: this.transformMatrix.translateY,
    };
  }
}

// Load Test Executor
class SVGLoadTestExecutor {
  constructor(data, config) {
    this.data = data;
    this.config = config;
    this.renderer = new SVGRenderer(data, DATASET_CONFIG.viewportWidth, DATASET_CONFIG.viewportHeight);
    this.metrics = {
      latencies: [],
      operationCounts: { pan: 0, zoom: 0, panZoomCombo: 0 },
      errors: [],
      memorySnapshots: [],
    };
  }

  async run() {
    console.log(`\n📊 SVG Inspector Load Test`);
    console.log(`Dataset: ${DATASET_CONFIG.nodes.toLocaleString()} nodes, ${DATASET_CONFIG.edges.toLocaleString()} edges`);
    console.log(`Load: ${LOAD_CONFIG.concurrentOps} concurrent ops, ${LOAD_CONFIG.totalOperations} total operations\n`);

    const startTime = performance.now();
    const initialMemory = process.memoryUsage();

    await this.executeLoadTest();

    const endTime = performance.now();
    const finalMemory = process.memoryUsage();

    this.reportMetrics(startTime, endTime, initialMemory, finalMemory);
  }

  async executeLoadTest() {
    const batches = Math.ceil(LOAD_CONFIG.totalOperations / LOAD_CONFIG.concurrentOps);

    for (let batch = 0; batch < batches; batch++) {
      const batchSize = Math.min(LOAD_CONFIG.concurrentOps, LOAD_CONFIG.totalOperations - batch * LOAD_CONFIG.concurrentOps);
      const promises = [];

      for (let i = 0; i < batchSize; i++) {
        promises.push(this.executeOperation());
      }

      await Promise.all(promises);

      if ((batch + 1) % 10 === 0) {
        console.log(`✓ Completed ${(batch + 1) * LOAD_CONFIG.concurrentOps} operations...`);
      }
    }
  }

  async executeOperation() {
    return new Promise((resolve) => {
      setImmediate(() => {
        try {
          const operationType = OPERATIONS[Math.floor(Math.random() * OPERATIONS.length)];
          const startTime = performance.now();

          switch (operationType) {
            case 'pan':
              this.renderer.pan(Math.random() * 100 - 50, Math.random() * 100 - 50);
              this.metrics.operationCounts.pan++;
              break;

            case 'zoom':
              const zoomFactor = 0.9 + Math.random() * 0.2; // 0.9 - 1.1
              this.renderer.zoom(zoomFactor, Math.random() * DATASET_CONFIG.viewportWidth, Math.random() * DATASET_CONFIG.viewportHeight);
              this.metrics.operationCounts.zoom++;
              break;

            case 'pan-zoom-combo':
              this.renderer.panZoomCombo(
                Math.random() * 50 - 25,
                Math.random() * 50 - 25,
                0.95 + Math.random() * 0.1
              );
              this.metrics.operationCounts.panZoomCombo++;
              break;
          }

          // Render SVG
          const renderStart = performance.now();
          this.renderer.render();
          const renderTime = performance.now() - renderStart;

          const latency = performance.now() - startTime;
          this.metrics.latencies.push({
            operation: operationType,
            latency,
            renderTime,
            timestamp: Date.now(),
          });

          resolve();
        } catch (error) {
          this.metrics.errors.push({
            operation: operationType,
            error: error.message,
            timestamp: Date.now(),
          });
          resolve();
        }
      });
    });
  }

  reportMetrics(startTime, endTime, initialMemory, finalMemory) {
    const totalTime = endTime - startTime;
    const latencies = this.metrics.latencies.map(m => m.latency).sort((a, b) => a - b);
    const renderTimes = this.metrics.latencies.map(m => m.renderTime).sort((a, b) => a - b);

    console.log(`\n⏱️  Performance Metrics`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Total Duration: ${totalTime.toFixed(2)}ms`);
    console.log(`Operations/sec: ${(LOAD_CONFIG.totalOperations / (totalTime / 1000)).toFixed(2)}`);

    console.log(`\n📈 Latency Percentiles (Operation Latency)`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.printPercentiles(latencies);

    console.log(`\n🎨 Render Time Percentiles`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.printPercentiles(renderTimes);

    console.log(`\n📊 Operation Distribution`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Pan operations: ${this.metrics.operationCounts.pan}`);
    console.log(`Zoom operations: ${this.metrics.operationCounts.zoom}`);
    console.log(`Pan+Zoom combo: ${this.metrics.operationCounts.panZoomCombo}`);

    console.log(`\n💾 Memory Usage`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Initial RSS: ${(initialMemory.rss / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Final RSS: ${(finalMemory.rss / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Heap Used (Initial): ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Heap Used (Final): ${(finalMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Heap Growth: ${((finalMemory.heapUsed - initialMemory.heapUsed) / 1024 / 1024).toFixed(2)}MB`);

    if (this.metrics.errors.length > 0) {
      console.log(`\n⚠️  Errors Encountered: ${this.metrics.errors.length}`);
      this.metrics.errors.slice(0, 5).forEach(err => {
        console.log(`  - ${err.operation}: ${err.error}`);
      });
    }

    console.log(`\n✅ Test completed with ${this.metrics.latencies.length} successful operations\n`);
  }

  printPercentiles(sortedLatencies) {
    const percentiles = [50, 75, 90, 95, 99, 99.9];
    percentiles.forEach(p => {
      const index = Math.ceil((p / 100) * sortedLatencies.length) - 1;
      console.log(`  P${p.toFixed(1).padStart(4)}ms: ${sortedLatencies[Math.max(0, index)].toFixed(3)}ms`);
    });
    console.log(`  Min: ${sortedLatencies[0].toFixed(3)}ms`);
    console.log(`  Max: ${sortedLatencies[sortedLatencies.length - 1].toFixed(3)}ms`);
    console.log(`  Avg: ${(sortedLatencies.reduce((a, b) => a + b, 0) / sortedLatencies.length).toFixed(3)}ms`);
  }
}

// Validation & Assertions
class LoadTestValidator {
  static validateResults(executor) {
    const { latencies, errors, operationCounts } = executor.metrics;

    assert(latencies.length > 0, 'Should have recorded latencies');
    assert(errors.length === 0, `Should have no errors (got ${errors.length})`);

    const p95Latency = this.getPercentile(latencies.map(l => l.latency), 95);
    const p99Latency = this.getPercentile(latencies.map(l => l.latency), 99);

    // Performance assertions
    assert(p95Latency < 100, `P95 latency should be < 100ms (got ${p95Latency.toFixed(2)}ms)`);
    assert(p99Latency < 200, `P99 latency should be < 200ms (got ${p99Latency.toFixed(2)}ms)`);

    // Operation distribution
    const totalOps = Object.values(operationCounts).reduce((a, b) => a + b, 0);
    assert(totalOps === LOAD_CONFIG.totalOperations, `Should complete all ${LOAD_CONFIG.totalOperations} operations`);

    console.log('✓ All assertions passed');
  }

  static getPercentile(sorted, percentile) {
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }
}

// CLI argument parser
function parseArgs() {
  const args = process.argv.slice(2);

  args.forEach(arg => {
    if (arg.startsWith('--nodes=')) {
      DATASET_CONFIG.nodes = parseInt(arg.split('=')[1]);
    }
    if (arg.startsWith('--edges=')) {
      DATASET_CONFIG.edges = parseInt(arg.split('=')[1]);
    }
    if (arg.startsWith('--ops=')) {
      LOAD_CONFIG.totalOperations = parseInt(arg.split('=')[1]);
    }
    if (arg.startsWith('--concurrent=')) {
      LOAD_CONFIG.concurrentOps = parseInt(arg.split('=')[1]);
    }
    if (arg === '--full-scale') {
      DATASET_CONFIG.nodes = 10_000;
      DATASET_CONFIG.edges = 50_000;
      LOAD_CONFIG.totalOperations = 1_000;
    }
  });
}

// Main execution
async function main() {
  try {
    parseArgs();
    console.log('🚀 Initializing SVG Inspector Load Test...\n');

    // Generate dataset
    console.log('📦 Generating test dataset...');
    const generator = new SVGMapDataGenerator(DATASET_CONFIG.nodes, DATASET_CONFIG.edges);
    const data = generator.generate();
    console.log(`✓ Generated ${data.nodes.length} nodes and ${data.edges.length} edges\n`);

    // Run load test
    const executor = new SVGLoadTestExecutor(data, LOAD_CONFIG);
    await executor.run();

    // Validate results
    console.log('🔍 Validating results...');
    LoadTestValidator.validateResults(executor);

    process.exit(0);
  } catch (error) {
    console.error('❌ Load test failed:', error.message);
    process.exit(1);
  }
}

// Export for testing
module.exports = {
  SVGMapDataGenerator,
  SVGRenderer,
  SVGLoadTestExecutor,
  LoadTestValidator,
};

// Run if executed directly
if (require.main === module) {
  main();
}
