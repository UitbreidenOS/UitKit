/**
 * SVG Layout Analyzer
 *
 * Analyzes SVG maps for layout optimization using clustering detection,
 * node repositioning suggestions, and auto-layout algorithms:
 * - Force-directed layout (simulates physics-based forces)
 * - Hierarchical layout (layered graph visualization)
 * - Circular layout (radial positioning)
 *
 * Usage:
 *   const analyzer = require('./svg-layout-analyzer');
 *   const analysis = analyzer.analyzeLayout(svgData);
 *   const optimized = analyzer.optimizeLayout(analysis, 'force-directed');
 */

const { performance } = require('perf_hooks');

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

const ALGORITHMS = {
  FORCE_DIRECTED: 'force-directed',
  HIERARCHICAL: 'hierarchical',
  CIRCULAR: 'circular',
};

const CONFIG = {
  CLUSTER_DISTANCE_THRESHOLD: 50, // pixels
  CLUSTER_MIN_NODES: 3,
  OVERLAP_THRESHOLD: 5, // pixels
  OPTIMIZATION_ITERATIONS: 100,
  FORCE_REPULSION: 100,
  FORCE_ATTRACTION: 0.1,
  SPRING_LENGTH: 80,
  DAMPING: 0.95,
  VELOCITY_LIMIT: 5,
  HIERARCHY_LAYER_HEIGHT: 150,
};

// ============================================================================
// NODE & EDGE PARSING
// ============================================================================

/**
 * Parse SVG elements and extract node positions
 */
function parseSVGNodes(svgData) {
  const nodes = [];

  // Match various SVG element types that represent nodes
  const nodePatterns = [
    /<circle[^>]*cx="?([^"\s>]+)"?[^>]*cy="?([^"\s>]+)"?[^>]*r="?([^"\s>]+)"?[^>]*id="?([^"\s>]+)"?/gi,
    /<ellipse[^>]*cx="?([^"\s>]+)"?[^>]*cy="?([^"\s>]+)"?[^>]*rx="?([^"\s>]+)"?[^>]*id="?([^"\s>]+)"?/gi,
    /<rect[^>]*x="?([^"\s>]+)"?[^>]*y="?([^"\s>]+)"?[^>]*width="?([^"\s>]+)"?[^>]*id="?([^"\s>]+)"?/gi,
    /<g[^>]*id="?([^"\s>]+)"?[^>]*.*?<circle[^>]*cx="?([^"\s>]+)"?[^>]*cy="?([^"\s>]+)"?[^>]*r="?([^"\s>]+)"?/gi,
  ];

  const nodeSet = new Map();

  nodePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(svgData)) !== null) {
      const id = match[4] || match[1] || `node_${nodes.length}`;
      if (!nodeSet.has(id)) {
        const x = parseFloat(match[1]) || parseFloat(match[2]);
        const y = parseFloat(match[2]) || parseFloat(match[3]);
        const radius = parseFloat(match[3]) || parseFloat(match[4]) || 10;

        if (!isNaN(x) && !isNaN(y)) {
          nodeSet.set(id, {
            id,
            x,
            y,
            radius,
            vx: 0, // velocity for force-directed
            vy: 0,
            fixed: false,
          });
        }
      }
    }
  });

  return Array.from(nodeSet.values());
}

/**
 * Parse SVG edges/connections
 */
function parseSVGEdges(svgData) {
  const edges = [];

  // Match line and path elements
  const linePattern = /<line[^>]*x1="?([^"\s>]+)"?[^>]*y1="?([^"\s>]+)"?[^>]*x2="?([^"\s>]+)"?[^>]*y2="?([^"\s>]+)"?/gi;
  const pathPattern = /<path[^>]*d="M\s*([^,\s]+)\s*([^,\s]+).*?L\s*([^,\s]+)\s*([^,\s]+)/gi;

  let match;
  while ((match = linePattern.exec(svgData)) !== null) {
    edges.push({
      x1: parseFloat(match[1]),
      y1: parseFloat(match[2]),
      x2: parseFloat(match[3]),
      y2: parseFloat(match[4]),
      weight: 1,
    });
  }

  while ((match = pathPattern.exec(svgData)) !== null) {
    edges.push({
      x1: parseFloat(match[1]),
      y1: parseFloat(match[2]),
      x2: parseFloat(match[3]),
      y2: parseFloat(match[4]),
      weight: 1,
    });
  }

  return edges;
}

// ============================================================================
// CLUSTERING DETECTION
// ============================================================================

/**
 * Detect clusters of nodes using density-based approach
 */
function detectClusters(nodes) {
  const clusters = [];
  const visited = new Set();
  const threshold = CONFIG.CLUSTER_DISTANCE_THRESHOLD;
  const minNodes = CONFIG.CLUSTER_MIN_NODES;

  function distance(n1, n2) {
    const dx = n1.x - n2.x;
    const dy = n1.y - n2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function getNeighbors(nodeId) {
    return nodes.filter(n =>
      n.id !== nodeId &&
      distance(nodes.find(x => x.id === nodeId), n) < threshold
    );
  }

  nodes.forEach(node => {
    if (visited.has(node.id)) return;

    const cluster = [node.id];
    const queue = [node.id];
    visited.add(node.id);

    while (queue.length > 0) {
      const current = queue.shift();
      const neighbors = getNeighbors(current);

      neighbors.forEach(neighbor => {
        if (!visited.has(neighbor.id)) {
          visited.add(neighbor.id);
          cluster.push(neighbor.id);
          queue.push(neighbor.id);
        }
      });
    }

    if (cluster.length >= minNodes) {
      const clusterNodes = cluster.map(id => nodes.find(n => n.id === id));
      const centerX = clusterNodes.reduce((sum, n) => sum + n.x, 0) / clusterNodes.length;
      const centerY = clusterNodes.reduce((sum, n) => sum + n.y, 0) / clusterNodes.length;
      const radius = Math.max(...clusterNodes.map(n => distance(n, { x: centerX, y: centerY })));

      clusters.push({
        id: `cluster_${clusters.length}`,
        nodes: cluster,
        centerX,
        centerY,
        radius,
        size: cluster.length,
      });
    }
  });

  return clusters;
}

/**
 * Detect overlapping nodes
 */
function detectOverlaps(nodes) {
  const overlaps = [];
  const threshold = CONFIG.OVERLAP_THRESHOLD;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const n1 = nodes[i];
      const n2 = nodes[j];
      const dx = n1.x - n2.x;
      const dy = n1.y - n2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = n1.radius + n2.radius + threshold;

      if (distance < minDistance) {
        overlaps.push({
          node1: n1.id,
          node2: n2.id,
          distance,
          minDistance,
          overlap: minDistance - distance,
        });
      }
    }
  }

  return overlaps;
}

/**
 * Analyze visibility issues
 */
function analyzeVisibility(nodes, edges) {
  const issues = [];

  // Detect edge-node intersections
  edges.forEach(edge => {
    nodes.forEach(node => {
      if (isPointNearSegment(node, edge)) {
        issues.push({
          type: 'edge_node_intersection',
          node: node.id,
          edge: `${edge.x1},${edge.y1} -> ${edge.x2},${edge.y2}`,
        });
      }
    });
  });

  // Detect dense regions
  nodes.forEach(node => {
    const nearby = nodes.filter(n =>
      n.id !== node.id &&
      distance(node, n) < CONFIG.CLUSTER_DISTANCE_THRESHOLD * 2
    );
    if (nearby.length > 5) {
      issues.push({
        type: 'dense_region',
        node: node.id,
        nearby_count: nearby.length,
      });
    }
  });

  return issues;
}

function isPointNearSegment(point, segment, threshold = 10) {
  const { x, y } = point;
  const { x1, y1, x2, y2 } = segment;

  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) param = dot / lenSq;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return dist < threshold;
}

function distance(n1, n2) {
  const dx = n1.x - n2.x;
  const dy = n1.y - n2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// ============================================================================
// LAYOUT ALGORITHMS
// ============================================================================

/**
 * Force-Directed Layout (Fruchterman-Reingold)
 */
function forceDirectedLayout(nodes, edges, iterations = CONFIG.OPTIMIZATION_ITERATIONS) {
  const layout = nodes.map(n => ({ ...n }));
  const repulsion = CONFIG.FORCE_REPULSION;
  const attraction = CONFIG.FORCE_ATTRACTION;
  const springLength = CONFIG.SPRING_LENGTH;
  const damping = CONFIG.DAMPING;
  const velocityLimit = CONFIG.VELOCITY_LIMIT;

  // Create node lookup
  const nodeMap = new Map(layout.map(n => [n.id, n]));

  for (let iter = 0; iter < iterations; iter++) {
    // Reset forces
    layout.forEach(node => {
      node.fx = 0;
      node.fy = 0;
    });

    // Repulsive forces (all nodes repel each other)
    for (let i = 0; i < layout.length; i++) {
      for (let j = i + 1; j < layout.length; j++) {
        const n1 = layout[i];
        const n2 = layout[j];
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const force = repulsion / (dist * dist);

        const fx = (force * dx) / dist;
        const fy = (force * dy) / dist;

        n1.fx -= fx;
        n1.fy -= fy;
        n2.fx += fx;
        n2.fy += fy;
      }
    }

    // Attractive forces (connected nodes attract)
    edges.forEach(edge => {
      const n1 = layout.find(n => Math.abs(n.x - edge.x1) < 5 && Math.abs(n.y - edge.y1) < 5);
      const n2 = layout.find(n => Math.abs(n.x - edge.x2) < 5 && Math.abs(n.y - edge.y2) < 5);

      if (n1 && n2) {
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const force = attraction * (dist - springLength);

        const fx = (force * dx) / dist;
        const fy = (force * dy) / dist;

        n1.fx += fx;
        n1.fy += fy;
        n2.fx -= fx;
        n2.fy -= fy;
      }
    });

    // Update positions
    layout.forEach(node => {
      if (!node.fixed) {
        node.vx = (node.vx + node.fx) * damping;
        node.vy = (node.vy + node.fy) * damping;

        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > velocityLimit) {
          node.vx = (node.vx / speed) * velocityLimit;
          node.vy = (node.vy / speed) * velocityLimit;
        }

        node.x += node.vx;
        node.y += node.vy;
      }
    });
  }

  return layout;
}

/**
 * Hierarchical Layout (Sugiyama)
 */
function hierarchicalLayout(nodes, edges) {
  const layout = nodes.map(n => ({ ...n }));

  // Assign layers based on edge direction
  const layers = new Map();
  const visited = new Set();

  function assignLayer(nodeId, layer = 0) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    if (!layers.has(layer)) {
      layers.set(layer, []);
    }
    layers.get(layer).push(nodeId);

    // Find connected nodes
    edges.forEach(edge => {
      if (Math.abs(edge.x1 - nodes.find(n => n.id === nodeId).x) < 5) {
        const targetNode = nodes.find(n =>
          Math.abs(n.x - edge.x2) < 5 && Math.abs(n.y - edge.y2) < 5
        );
        if (targetNode) {
          assignLayer(targetNode.id, layer + 1);
        }
      }
    });
  }

  // Assign layers starting from root nodes
  nodes.forEach(node => {
    if (!visited.has(node.id)) {
      assignLayer(node.id, 0);
    }
  });

  // Position nodes
  let yOffset = 0;
  layers.forEach((nodeIds, layer) => {
    const layerHeight = CONFIG.HIERARCHY_LAYER_HEIGHT;
    let xOffset = 0;
    const spacing = 100;

    nodeIds.forEach(nodeId => {
      const node = layout.find(n => n.id === nodeId);
      node.x = xOffset;
      node.y = layer * layerHeight + yOffset;
      xOffset += spacing;
    });
  });

  return layout;
}

/**
 * Circular Layout
 */
function circularLayout(nodes) {
  const layout = nodes.map(n => ({ ...n }));
  const center = { x: 500, y: 500 };
  const radius = 300;

  layout.forEach((node, index) => {
    const angle = (index / layout.length) * Math.PI * 2;
    node.x = center.x + radius * Math.cos(angle);
    node.y = center.y + radius * Math.sin(angle);
  });

  return layout;
}

// ============================================================================
// REPOSITIONING SUGGESTIONS
// ============================================================================

/**
 * Generate repositioning suggestions to improve visibility
 */
function generateRepositioningSuggestions(nodes, clusters, overlaps, visibilityIssues) {
  const suggestions = [];

  // Suggest moving overlapping nodes
  overlaps.forEach(overlap => {
    const n1 = nodes.find(n => n.id === overlap.node1);
    const n2 = nodes.find(n => n.id === overlap.node2);

    if (n1 && n2) {
      const dx = n2.x - n1.x;
      const dy = n2.y - n1.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const offset = (overlap.overlap + 10) / dist;

      suggestions.push({
        type: 'resolve_overlap',
        node: overlap.node2,
        reason: `Overlaps with ${overlap.node1} by ${overlap.overlap.toFixed(2)}px`,
        suggestion: {
          from: { x: n2.x, y: n2.y },
          to: {
            x: n2.x + (dx / dist) * offset,
            y: n2.y + (dy / dist) * offset,
          },
          priority: overlap.overlap,
        },
      });
    }
  });

  // Suggest spreading clusters
  clusters.forEach(cluster => {
    if (cluster.size > 5) {
      suggestions.push({
        type: 'spread_cluster',
        cluster: cluster.id,
        reason: `Dense cluster with ${cluster.size} nodes`,
        suggestion: {
          action: 'expand_cluster',
          radius: cluster.radius * 1.5,
          priority: cluster.size,
        },
      });
    }
  });

  // Suggest addressing dense regions
  visibilityIssues
    .filter(i => i.type === 'dense_region')
    .forEach(issue => {
      suggestions.push({
        type: 'reduce_density',
        node: issue.node,
        reason: `${issue.nearby_count} nodes nearby causing congestion`,
        priority: issue.nearby_count,
      });
    });

  // Sort by priority (descending)
  suggestions.sort((a, b) =>
    (b.suggestion?.priority || 0) - (a.suggestion?.priority || 0)
  );

  return suggestions;
}

// ============================================================================
// MAIN ANALYSIS FUNCTION
// ============================================================================

/**
 * Analyze SVG layout and return detailed report
 */
function analyzeLayout(svgData) {
  const startTime = performance.now();

  // Parse SVG structure
  const nodes = parseSVGNodes(svgData);
  const edges = parseSVGEdges(svgData);

  // Detect problems
  const clusters = detectClusters(nodes);
  const overlaps = detectOverlaps(nodes);
  const visibilityIssues = analyzeVisibility(nodes, edges);

  // Generate suggestions
  const suggestions = generateRepositioningSuggestions(nodes, clusters, overlaps, visibilityIssues);

  const duration = performance.now() - startTime;

  return {
    timestamp: new Date().toISOString(),
    duration_ms: parseFloat(duration.toFixed(2)),
    summary: {
      total_nodes: nodes.length,
      total_edges: edges.length,
      clusters_detected: clusters.length,
      overlapping_pairs: overlaps.length,
      visibility_issues: visibilityIssues.length,
      repositioning_suggestions: suggestions.length,
    },
    nodes,
    edges,
    clusters,
    overlaps,
    visibilityIssues,
    suggestions,
  };
}

/**
 * Optimize layout using specified algorithm
 */
function optimizeLayout(analysis, algorithm = ALGORITHMS.FORCE_DIRECTED, options = {}) {
  const startTime = performance.now();

  const { nodes, edges } = analysis;
  const iterations = options.iterations || CONFIG.OPTIMIZATION_ITERATIONS;

  let optimizedNodes;

  switch (algorithm) {
    case ALGORITHMS.FORCE_DIRECTED:
      optimizedNodes = forceDirectedLayout(nodes, edges, iterations);
      break;
    case ALGORITHMS.HIERARCHICAL:
      optimizedNodes = hierarchicalLayout(nodes, edges);
      break;
    case ALGORITHMS.CIRCULAR:
      optimizedNodes = circularLayout(nodes);
      break;
    default:
      throw new Error(`Unknown layout algorithm: ${algorithm}`);
  }

  const duration = performance.now() - startTime;

  // Re-analyze with new layout
  const newAnalysis = {
    ...analysis,
    nodes: optimizedNodes,
    timestamp: new Date().toISOString(),
    optimization: {
      algorithm,
      iterations,
      duration_ms: parseFloat(duration.toFixed(2)),
    },
  };

  // Recalculate clusters and overlaps
  const newClusters = detectClusters(optimizedNodes);
  const newOverlaps = detectOverlaps(optimizedNodes);
  const newVisibilityIssues = analyzeVisibility(optimizedNodes, edges);
  const newSuggestions = generateRepositioningSuggestions(
    optimizedNodes,
    newClusters,
    newOverlaps,
    newVisibilityIssues
  );

  newAnalysis.clusters = newClusters;
  newAnalysis.overlaps = newOverlaps;
  newAnalysis.visibilityIssues = newVisibilityIssues;
  newAnalysis.suggestions = newSuggestions;

  newAnalysis.summary = {
    ...newAnalysis.summary,
    clusters_detected: newClusters.length,
    overlapping_pairs: newOverlaps.length,
    visibility_issues: newVisibilityIssues.length,
    repositioning_suggestions: newSuggestions.length,
    improvement: {
      overlaps_reduced: analysis.overlaps.length - newOverlaps.length,
      visibility_improved: analysis.visibilityIssues.length - newVisibilityIssues.length,
    },
  };

  return newAnalysis;
}

/**
 * Generate SVG from optimized layout
 */
function generateOptimizedSVG(analysis, options = {}) {
  const { nodes, edges } = analysis;
  const width = options.width || 1000;
  const height = options.height || 1000;
  const nodeRadius = options.nodeRadius || 8;
  const strokeWidth = options.strokeWidth || 1;

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">\n`;
  svg += `  <defs>\n`;
  svg += `    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">\n`;
  svg += `      <polygon points="0 0, 10 3, 0 6" fill="#999" />\n`;
  svg += `    </marker>\n`;
  svg += `  </defs>\n`;

  // Draw edges
  edges.forEach(edge => {
    svg += `  <line x1="${edge.x1}" y1="${edge.y1}" x2="${edge.x2}" y2="${edge.y2}" `;
    svg += `stroke="#999" stroke-width="${strokeWidth}" marker-end="url(#arrowhead)" />\n`;
  });

  // Draw nodes
  nodes.forEach(node => {
    svg += `  <circle cx="${node.x}" cy="${node.y}" r="${nodeRadius}" fill="#4A90E2" `;
    svg += `stroke="#2E5C8A" stroke-width="1" />\n`;
    svg += `  <text x="${node.x}" y="${node.y + 4}" text-anchor="middle" `;
    svg += `font-size="10" fill="white">${node.id.substring(0, 3)}</text>\n`;
  });

  svg += `</svg>`;
  return svg;
}

/**
 * Compare two layouts
 */
function compareLayouts(before, after) {
  const metrics = {
    before: {
      overlaps: before.overlaps.length,
      visibility_issues: before.visibilityIssues.length,
      average_node_density: calculateDensity(before.nodes),
    },
    after: {
      overlaps: after.overlaps.length,
      visibility_issues: after.visibilityIssues.length,
      average_node_density: calculateDensity(after.nodes),
    },
  };

  metrics.improvement = {
    overlaps_reduction: metrics.before.overlaps - metrics.after.overlaps,
    overlaps_reduction_percent:
      ((metrics.before.overlaps - metrics.after.overlaps) / (metrics.before.overlaps || 1) * 100).toFixed(1),
    visibility_improvement: metrics.before.visibility_issues - metrics.after.visibility_issues,
    density_reduction_percent:
      ((metrics.before.average_node_density - metrics.after.average_node_density) /
       (metrics.before.average_node_density || 1) * 100).toFixed(1),
  };

  return metrics;
}

function calculateDensity(nodes) {
  if (nodes.length < 2) return 0;
  let totalDistance = 0;
  let count = 0;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < Math.min(i + 10, nodes.length); j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      totalDistance += Math.sqrt(dx * dx + dy * dy);
      count++;
    }
  }

  return totalDistance / count || 0;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  analyzeLayout,
  optimizeLayout,
  generateOptimizedSVG,
  compareLayouts,

  // Algorithms
  ALGORITHMS,
  forceDirectedLayout,
  hierarchicalLayout,
  circularLayout,

  // Detection
  detectClusters,
  detectOverlaps,
  analyzeVisibility,
  generateRepositioningSuggestions,

  // Utilities
  parseSVGNodes,
  parseSVGEdges,
  distance,
  calculateDensity,
  CONFIG,
};
