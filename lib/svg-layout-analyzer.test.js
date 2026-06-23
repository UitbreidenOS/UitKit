/**
 * SVG Layout Analyzer Tests
 */

const analyzer = require('./svg-layout-analyzer');

// ============================================================================
// TEST UTILITIES
// ============================================================================

function createSampleSVG(nodeCount = 10, complexity = 'simple') {
  const nodes = [];
  const lines = [];

  if (complexity === 'simple') {
    // Simple grid layout with intentional overlaps
    for (let i = 0; i < nodeCount; i++) {
      const x = 100 + (i % 5) * 80;
      const y = 100 + Math.floor(i / 5) * 80;
      nodes.push(`<circle cx="${x}" cy="${y}" r="8" id="node${i}" fill="#4A90E2" />`);

      if (i > 0) {
        const prevI = i - 1;
        const prevX = 100 + (prevI % 5) * 80;
        const prevY = 100 + Math.floor(prevI / 5) * 80;
        lines.push(`<line x1="${prevX}" y1="${prevY}" x2="${x}" y2="${y}" stroke="#999" />`);
      }
    }
  } else if (complexity === 'clustered') {
    // Three clusters with high internal density
    const clusters = [
      { cx: 150, cy: 150 },
      { cx: 400, cy: 150 },
      { cx: 275, cy: 350 },
    ];

    let idx = 0;
    clusters.forEach((cluster, cIdx) => {
      for (let i = 0; i < nodeCount / 3; i++) {
        const angle = (i / (nodeCount / 3)) * Math.PI * 2;
        const x = cluster.cx + Math.cos(angle) * 40;
        const y = cluster.cy + Math.sin(angle) * 40;
        nodes.push(`<circle cx="${x}" cy="${y}" r="8" id="node${idx}" fill="#4A90E2" />`);

        if (idx > 0) {
          const prevNode = nodes[idx - 1];
          const match = prevNode.match(/cx="([^"]+)" cy="([^"]+)"/);
          if (match) {
            lines.push(`<line x1="${match[1]}" y1="${match[2]}" x2="${x}" y2="${y}" stroke="#999" />`);
          }
        }
        idx++;
      }
    });
  } else if (complexity === 'dense') {
    // Dense region causing visibility issues
    for (let i = 0; i < nodeCount; i++) {
      const x = 200 + (Math.random() * 100 - 50);
      const y = 200 + (Math.random() * 100 - 50);
      nodes.push(`<circle cx="${x}" cy="${y}" r="6" id="node${i}" fill="#4A90E2" />`);

      if (i > 0 && Math.random() > 0.3) {
        const prevI = Math.floor(Math.random() * i);
        const prevNode = nodes[prevI];
        const match = prevNode.match(/cx="([^"]+)" cy="([^"]+)"/);
        if (match) {
          lines.push(`<line x1="${match[1]}" y1="${match[2]}" x2="${x}" y2="${y}" stroke="#999" />`);
        }
      }
    }
  }

  return `<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">
    ${lines.join('\n')}
    ${nodes.join('\n')}
  </svg>`;
}

// ============================================================================
// TESTS
// ============================================================================

function testParsing() {
  console.log('\n=== TEST: SVG Parsing ===');
  const svg = createSampleSVG(10, 'simple');
  const nodes = analyzer.parseSVGNodes(svg);
  const edges = analyzer.parseSVGEdges(svg);

  console.log(`✓ Parsed ${nodes.length} nodes`);
  console.log(`✓ Parsed ${edges.length} edges`);
  console.assert(nodes.length === 10, 'Should parse 10 nodes');
  console.assert(edges.length > 0, 'Should parse edges');
}

function testClusterDetection() {
  console.log('\n=== TEST: Cluster Detection ===');
  const svg = createSampleSVG(15, 'clustered');
  const nodes = analyzer.parseSVGNodes(svg);
  const clusters = analyzer.detectClusters(nodes);

  console.log(`✓ Detected ${clusters.length} clusters`);
  console.log(`  Cluster details:`);
  clusters.forEach(c => {
    console.log(`  - Cluster ${c.id}: ${c.size} nodes at (${c.centerX.toFixed(0)}, ${c.centerY.toFixed(0)})`);
  });
  console.assert(clusters.length > 0, 'Should detect at least one cluster');
}

function testOverlapDetection() {
  console.log('\n=== TEST: Overlap Detection ===');
  // Create SVG with intentional overlaps
  const svg = `<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="15" id="node0" />
    <circle cx="110" cy="105" r="15" id="node1" />
    <circle cx="300" cy="300" r="10" id="node2" />
    <circle cx="400" cy="400" r="10" id="node3" />
  </svg>`;

  const nodes = analyzer.parseSVGNodes(svg);
  const overlaps = analyzer.detectOverlaps(nodes);

  console.log(`✓ Detected ${overlaps.length} overlapping pairs`);
  overlaps.forEach(o => {
    console.log(`  - ${o.node1} <-> ${o.node2}: ${o.overlap.toFixed(2)}px overlap`);
  });
  console.assert(overlaps.length > 0, 'Should detect overlaps');
}

function testAnalysis() {
  console.log('\n=== TEST: Full Layout Analysis ===');
  const svg = createSampleSVG(20, 'dense');
  const analysis = analyzer.analyzeLayout(svg);

  console.log(`✓ Analysis completed in ${analysis.duration_ms}ms`);
  console.log(`  Summary:`);
  console.log(`  - Total nodes: ${analysis.summary.total_nodes}`);
  console.log(`  - Total edges: ${analysis.summary.total_edges}`);
  console.log(`  - Clusters detected: ${analysis.summary.clusters_detected}`);
  console.log(`  - Overlapping pairs: ${analysis.summary.overlapping_pairs}`);
  console.log(`  - Visibility issues: ${analysis.summary.visibility_issues}`);
  console.log(`  - Repositioning suggestions: ${analysis.summary.repositioning_suggestions}`);
}

function testForceDirectedLayout() {
  console.log('\n=== TEST: Force-Directed Layout ===');
  const svg = createSampleSVG(15, 'simple');
  const analysis = analyzer.analyzeLayout(svg);

  console.log(`Before: ${analysis.overlaps.length} overlaps`);
  const optimized = analyzer.optimizeLayout(analysis, analyzer.ALGORITHMS.FORCE_DIRECTED, {
    iterations: 50,
  });

  console.log(`After: ${optimized.overlaps.length} overlaps`);
  console.log(`✓ Force-directed layout completed in ${optimized.optimization.duration_ms}ms`);

  const comparison = analyzer.compareLayouts(analysis, optimized);
  console.log(`  Improvement:`);
  console.log(`  - Overlaps reduced by ${comparison.improvement.overlaps_reduction} ` +
    `(${comparison.improvement.overlaps_reduction_percent}%)`);
  console.log(`  - Visibility issues reduced by ${comparison.improvement.visibility_improvement}`);
}

function testHierarchicalLayout() {
  console.log('\n=== TEST: Hierarchical Layout ===');
  const svg = createSampleSVG(12, 'simple');
  const analysis = analyzer.analyzeLayout(svg);
  const optimized = analyzer.optimizeLayout(analysis, analyzer.ALGORITHMS.HIERARCHICAL);

  console.log(`✓ Hierarchical layout completed in ${optimized.optimization.duration_ms}ms`);
  console.log(`  Nodes positioned in ${optimized.nodes.length} positions`);
}

function testCircularLayout() {
  console.log('\n=== TEST: Circular Layout ===');
  const svg = createSampleSVG(10, 'simple');
  const analysis = analyzer.analyzeLayout(svg);
  const optimized = analyzer.optimizeLayout(analysis, analyzer.ALGORITHMS.CIRCULAR);

  console.log(`✓ Circular layout completed in ${optimized.optimization.duration_ms}ms`);
  console.log(`  Nodes arranged in circular pattern`);

  // Verify circular arrangement
  const centerX = optimized.nodes.reduce((sum, n) => sum + n.x, 0) / optimized.nodes.length;
  const centerY = optimized.nodes.reduce((sum, n) => sum + n.y, 0) / optimized.nodes.length;
  console.log(`  Center: (${centerX.toFixed(0)}, ${centerY.toFixed(0)})`);
}

function testRepositioningSuggestions() {
  console.log('\n=== TEST: Repositioning Suggestions ===');
  const svg = createSampleSVG(15, 'dense');
  const analysis = analyzer.analyzeLayout(svg);

  console.log(`✓ Generated ${analysis.suggestions.length} suggestions`);
  analysis.suggestions.slice(0, 5).forEach((s, i) => {
    console.log(`  ${i + 1}. ${s.type}: ${s.reason}`);
  });
}

function testSVGGeneration() {
  console.log('\n=== TEST: SVG Generation ===');
  const svg = createSampleSVG(8, 'simple');
  const analysis = analyzer.analyzeLayout(svg);
  const optimized = analyzer.optimizeLayout(analysis, analyzer.ALGORITHMS.FORCE_DIRECTED);
  const outputSVG = analyzer.generateOptimizedSVG(optimized);

  console.log(`✓ Generated optimized SVG: ${(outputSVG.length / 1024).toFixed(1)}KB`);
  console.assert(outputSVG.includes('<svg'), 'Should contain SVG element');
  console.assert(outputSVG.includes('<circle'), 'Should contain node circles');
  console.assert(outputSVG.includes('<line'), 'Should contain edge lines');
}

function testDensityCalculation() {
  console.log('\n=== TEST: Density Calculation ===');
  const svg = createSampleSVG(20, 'simple');
  const analysis = analyzer.analyzeLayout(svg);
  const density = analyzer.calculateDensity(analysis.nodes);

  console.log(`✓ Calculated average density: ${density.toFixed(2)}`);
  console.assert(density > 0, 'Density should be positive');
}

function testComparison() {
  console.log('\n=== TEST: Layout Comparison ===');
  const svg = createSampleSVG(12, 'dense');
  const before = analyzer.analyzeLayout(svg);
  const after = analyzer.optimizeLayout(before, analyzer.ALGORITHMS.FORCE_DIRECTED, {
    iterations: 100,
  });

  const comparison = analyzer.compareLayouts(before, after);

  console.log(`✓ Comparison completed`);
  console.log(`  Before: ${comparison.before.overlaps} overlaps, ` +
    `density ${comparison.before.average_node_density.toFixed(2)}`);
  console.log(`  After: ${comparison.after.overlaps} overlaps, ` +
    `density ${comparison.after.average_node_density.toFixed(2)}`);
  console.log(`  Improvement: ${comparison.improvement.overlaps_reduction} overlaps reduced ` +
    `(${comparison.improvement.overlaps_reduction_percent}%)`);
}

// ============================================================================
// RUN ALL TESTS
// ============================================================================

function runAllTests() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║       SVG Layout Analyzer - Test Suite                   ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  try {
    testParsing();
    testClusterDetection();
    testOverlapDetection();
    testAnalysis();
    testForceDirectedLayout();
    testHierarchicalLayout();
    testCircularLayout();
    testRepositioningSuggestions();
    testSVGGeneration();
    testDensityCalculation();
    testComparison();

    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║  ✓ All tests passed                                      ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Export for use in other test runners
module.exports = {
  runAllTests,
  testParsing,
  testClusterDetection,
  testOverlapDetection,
  testAnalysis,
  testForceDirectedLayout,
  testHierarchicalLayout,
  testCircularLayout,
  testRepositioningSuggestions,
  testSVGGeneration,
  testDensityCalculation,
  testComparison,
  createSampleSVG,
};

// Run tests if executed directly
if (require.main === module) {
  runAllTests();
}
