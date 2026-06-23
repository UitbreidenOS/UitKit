/**
 * SVG Layout Analyzer - Integration Example
 *
 * Shows how to integrate the layout analyzer with:
 * - Express.js endpoints
 * - SVG Inspector health checks
 * - Real-time optimization
 * - CLI utilities
 */

const layoutAnalyzer = require('./svg-layout-analyzer');
const fs = require('fs');
const path = require('path');

// ============================================================================
// EXPRESS INTEGRATION
// ============================================================================

/**
 * Create Express routes for layout analysis API
 */
function createLayoutAnalysisRoutes() {
  const express = require('express');
  const router = express.Router();

  /**
   * POST /api/analyze
   * Analyze an SVG layout and return detailed report
   *
   * Request body:
   *   {
   *     svg: "<svg>...</svg>",
   *     format: "detailed" | "summary"
   *   }
   */
  router.post('/analyze', (req, res) => {
    try {
      const { svg, format = 'detailed' } = req.body;

      if (!svg) {
        return res.status(400).json({ error: 'SVG data required' });
      }

      const analysis = layoutAnalyzer.analyzeLayout(svg);

      if (format === 'summary') {
        res.json({
          summary: analysis.summary,
          clusters: analysis.clusters,
          recommendations: analysis.suggestions.slice(0, 10),
        });
      } else {
        res.json(analysis);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * POST /api/optimize
   * Optimize an SVG layout using specified algorithm
   *
   * Request body:
   *   {
   *     svg: "<svg>...</svg>",
   *     algorithm: "force-directed" | "hierarchical" | "circular",
   *     iterations: 100,
   *     compareOriginal: true
   *   }
   */
  router.post('/optimize', (req, res) => {
    try {
      const {
        svg,
        algorithm = layoutAnalyzer.ALGORITHMS.FORCE_DIRECTED,
        iterations = 100,
        compareOriginal = false,
      } = req.body;

      if (!svg) {
        return res.status(400).json({ error: 'SVG data required' });
      }

      const original = layoutAnalyzer.analyzeLayout(svg);
      const optimized = layoutAnalyzer.optimizeLayout(original, algorithm, {
        iterations,
      });

      const response = {
        optimized,
        algorithm,
        iterations,
      };

      if (compareOriginal) {
        response.comparison = layoutAnalyzer.compareLayouts(original, optimized);
      }

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * POST /api/optimize/render
   * Optimize layout and return rendered SVG
   */
  router.post('/optimize/render', (req, res) => {
    try {
      const {
        svg,
        algorithm = layoutAnalyzer.ALGORITHMS.FORCE_DIRECTED,
        iterations = 100,
        svgOptions = {},
      } = req.body;

      if (!svg) {
        return res.status(400).json({ error: 'SVG data required' });
      }

      const analysis = layoutAnalyzer.analyzeLayout(svg);
      const optimized = layoutAnalyzer.optimizeLayout(analysis, algorithm, { iterations });
      const outputSVG = layoutAnalyzer.generateOptimizedSVG(optimized, svgOptions);

      res.set('Content-Type', 'image/svg+xml');
      res.send(outputSVG);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * POST /api/compare
   * Compare two different layout algorithms
   */
  router.post('/compare', (req, res) => {
    try {
      const { svg, iterations = 100 } = req.body;

      if (!svg) {
        return res.status(400).json({ error: 'SVG data required' });
      }

      const original = layoutAnalyzer.analyzeLayout(svg);
      const algorithms = [
        layoutAnalyzer.ALGORITHMS.FORCE_DIRECTED,
        layoutAnalyzer.ALGORITHMS.HIERARCHICAL,
        layoutAnalyzer.ALGORITHMS.CIRCULAR,
      ];

      const results = {};

      algorithms.forEach(algo => {
        const optimized = layoutAnalyzer.optimizeLayout(original, algo, { iterations });
        const comparison = layoutAnalyzer.compareLayouts(original, optimized);

        results[algo] = {
          analysis: optimized.summary,
          improvement: comparison.improvement,
          duration_ms: optimized.optimization.duration_ms,
        };
      });

      res.json({
        original_summary: original.summary,
        algorithms_comparison: results,
        recommended_algorithm: Object.entries(results).reduce((best, [algo, data]) => {
          if (!best || data.improvement.overlaps_reduction > results[best].improvement.overlaps_reduction) {
            return algo;
          }
          return best;
        }),
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/config
   * Get analyzer configuration
   */
  router.get('/config', (req, res) => {
    res.json({
      algorithms: Object.values(layoutAnalyzer.ALGORITHMS),
      config: layoutAnalyzer.CONFIG,
      supported_formats: ['svg', 'json'],
    });
  });

  return router;
}

// ============================================================================
// HEALTH CHECK INTEGRATION
// ============================================================================

/**
 * Extend SVG Inspector health checks with layout analysis metrics
 */
function createLayoutHealthCheck() {
  const metrics = {
    lastAnalysis: null,
    analysisCount: 0,
    totalAnalysisTime: 0,
    optimizationCount: 0,
    totalOptimizationTime: 0,
  };

  return {
    recordAnalysis(duration) {
      metrics.analysisCount++;
      metrics.totalAnalysisTime += duration;
    },

    recordOptimization(duration) {
      metrics.optimizationCount++;
      metrics.totalOptimizationTime += duration;
    },

    getMetrics() {
      return {
        analysis: {
          count: metrics.analysisCount,
          total_time_ms: metrics.totalAnalysisTime,
          avg_time_ms:
            metrics.analysisCount > 0
              ? (metrics.totalAnalysisTime / metrics.analysisCount).toFixed(2)
              : 0,
        },
        optimization: {
          count: metrics.optimizationCount,
          total_time_ms: metrics.totalOptimizationTime,
          avg_time_ms:
            metrics.optimizationCount > 0
              ? (metrics.totalOptimizationTime / metrics.optimizationCount).toFixed(2)
              : 0,
        },
        throughput: {
          analyses_per_second: (metrics.analysisCount / (metrics.totalAnalysisTime / 1000)).toFixed(1),
          optimizations_per_second: (metrics.optimizationCount / (metrics.totalOptimizationTime / 1000)).toFixed(1),
        },
      };
    },

    reset() {
      metrics.analysisCount = 0;
      metrics.totalAnalysisTime = 0;
      metrics.optimizationCount = 0;
      metrics.totalOptimizationTime = 0;
    },
  };
}

// ============================================================================
// CLI UTILITIES
// ============================================================================

/**
 * CLI tool for analyzing SVG files from command line
 */
function createCLIAnalyzer() {
  return {
    /**
     * Analyze SVG file and print results
     */
    analyzeFile(filePath, options = {}) {
      try {
        const svgData = fs.readFileSync(filePath, 'utf-8');
        const analysis = layoutAnalyzer.analyzeLayout(svgData);

        console.log(`\n╔══════════════════════════════════════════════════════════╗`);
        console.log(`║  SVG Layout Analysis: ${path.basename(filePath)}`);
        console.log(`╚══════════════════════════════════════════════════════════╝\n`);

        console.log(`Summary:`);
        console.log(`  Total nodes: ${analysis.summary.total_nodes}`);
        console.log(`  Total edges: ${analysis.summary.total_edges}`);
        console.log(`  Clusters detected: ${analysis.summary.clusters_detected}`);
        console.log(`  Overlapping pairs: ${analysis.summary.overlapping_pairs}`);
        console.log(`  Visibility issues: ${analysis.summary.visibility_issues}`);
        console.log(`  Repositioning suggestions: ${analysis.summary.repositioning_suggestions}`);
        console.log(`  Analysis time: ${analysis.duration_ms}ms\n`);

        if (options.verbose) {
          console.log(`Clusters:`);
          analysis.clusters.forEach(c => {
            console.log(
              `  ${c.id}: ${c.size} nodes at (${c.centerX.toFixed(0)}, ${c.centerY.toFixed(0)}), ` +
              `radius ${c.radius.toFixed(2)}`
            );
          });

          if (analysis.overlaps.length > 0) {
            console.log(`\nTop 5 Overlapping Pairs:`);
            analysis.overlaps.slice(0, 5).forEach(o => {
              console.log(`  ${o.node1} <-> ${o.node2}: ${o.overlap.toFixed(2)}px overlap`);
            });
          }

          if (analysis.suggestions.length > 0) {
            console.log(`\nTop 5 Repositioning Suggestions:`);
            analysis.suggestions.slice(0, 5).forEach((s, i) => {
              console.log(`  ${i + 1}. [${s.type}] ${s.node || s.cluster}: ${s.reason}`);
            });
          }
        }

        return analysis;
      } catch (error) {
        console.error(`Error analyzing ${filePath}:`, error.message);
        process.exit(1);
      }
    },

    /**
     * Optimize SVG file and save result
     */
    optimizeFile(inputPath, outputPath, algorithm = 'force-directed', options = {}) {
      try {
        const svgData = fs.readFileSync(inputPath, 'utf-8');
        const analysis = layoutAnalyzer.analyzeLayout(svgData);
        const optimized = layoutAnalyzer.optimizeLayout(
          analysis,
          algorithm,
          options
        );
        const outputSVG = layoutAnalyzer.generateOptimizedSVG(optimized, {
          width: 1000,
          height: 1000,
          nodeRadius: 8,
        });

        fs.writeFileSync(outputPath, outputSVG);

        console.log(`\n✓ Optimized SVG saved to ${outputPath}`);

        const comparison = layoutAnalyzer.compareLayouts(analysis, optimized);
        console.log(`\nImprovement metrics:`);
        console.log(`  Overlaps reduced: ${comparison.improvement.overlaps_reduction} ` +
          `(${comparison.improvement.overlaps_reduction_percent}%)`);
        console.log(`  Visibility issues reduced: ${comparison.improvement.visibility_improvement}`);
        console.log(`  Density reduction: ${comparison.improvement.density_reduction_percent}%\n`);

        return optimized;
      } catch (error) {
        console.error(`Error optimizing ${inputPath}:`, error.message);
        process.exit(1);
      }
    },

    /**
     * Compare algorithms for SVG file
     */
    compareAlgorithms(filePath, iterations = 100) {
      try {
        const svgData = fs.readFileSync(filePath, 'utf-8');
        const original = layoutAnalyzer.analyzeLayout(svgData);

        console.log(`\n╔══════════════════════════════════════════════════════════╗`);
        console.log(`║  Algorithm Comparison: ${path.basename(filePath)}`);
        console.log(`╚══════════════════════════════════════════════════════════╝\n`);

        const algorithms = [
          layoutAnalyzer.ALGORITHMS.FORCE_DIRECTED,
          layoutAnalyzer.ALGORITHMS.HIERARCHICAL,
          layoutAnalyzer.ALGORITHMS.CIRCULAR,
        ];

        const results = {};

        algorithms.forEach(algo => {
          console.log(`Testing ${algo}...`);
          const optimized = layoutAnalyzer.optimizeLayout(original, algo, { iterations });
          const comparison = layoutAnalyzer.compareLayouts(original, optimized);

          results[algo] = {
            overlaps: optimized.overlaps.length,
            visibility_issues: optimized.visibilityIssues.length,
            overlaps_reduction: comparison.improvement.overlaps_reduction,
            overlaps_reduction_percent: comparison.improvement.overlaps_reduction_percent,
            duration_ms: optimized.optimization.duration_ms,
          };
        });

        console.log('\nResults:\n');
        console.table(results);

        const best = Object.entries(results).reduce((best, [algo, data]) => {
          if (!best || data.overlaps_reduction > results[best].overlaps_reduction) {
            return algo;
          }
          return best;
        });

        console.log(`\n✓ Recommended algorithm: ${best}`);
        console.log(`  Reduces overlaps by ${results[best].overlaps_reduction_percent}%\n`);

        return results;
      } catch (error) {
        console.error(`Error comparing algorithms for ${filePath}:`, error.message);
        process.exit(1);
      }
    },
  };
}

// ============================================================================
// BATCH PROCESSING
// ============================================================================

/**
 * Process multiple SVG files in a directory
 */
function processSVGDirectory(dirPath, options = {}) {
  const {
    algorithm = layoutAnalyzer.ALGORITHMS.FORCE_DIRECTED,
    outputDir = path.join(dirPath, 'optimized'),
    iterations = 100,
  } = options;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.svg'));
  const results = [];

  console.log(`\nProcessing ${files.length} SVG files from ${dirPath}...\n`);

  files.forEach(file => {
    try {
      const inputPath = path.join(dirPath, file);
      const outputPath = path.join(outputDir, `optimized-${file}`);
      const svgData = fs.readFileSync(inputPath, 'utf-8');

      const analysis = layoutAnalyzer.analyzeLayout(svgData);
      const optimized = layoutAnalyzer.optimizeLayout(analysis, algorithm, { iterations });
      const outputSVG = layoutAnalyzer.generateOptimizedSVG(optimized);

      fs.writeFileSync(outputPath, outputSVG);

      const comparison = layoutAnalyzer.compareLayouts(analysis, optimized);

      results.push({
        file,
        nodes: analysis.summary.total_nodes,
        overlaps_before: analysis.overlaps.length,
        overlaps_after: optimized.overlaps.length,
        overlaps_reduction: comparison.improvement.overlaps_reduction,
        overlaps_reduction_percent: comparison.improvement.overlaps_reduction_percent,
        duration_ms: optimized.optimization.duration_ms,
      });

      console.log(`✓ ${file}`);
    } catch (error) {
      console.error(`✗ ${file}: ${error.message}`);
    }
  });

  console.log('\n Results:\n');
  console.table(results);

  const totalReduction = results.reduce((sum, r) => sum + parseInt(r.overlaps_reduction), 0);
  const avgReductionPercent = (
    results.reduce((sum, r) => sum + parseFloat(r.overlaps_reduction_percent), 0) /
    results.length
  ).toFixed(1);

  console.log(`Summary:`);
  console.log(`  Total overlaps reduced: ${totalReduction}`);
  console.log(`  Average reduction: ${avgReductionPercent}%`);
  console.log(`  Output saved to: ${outputDir}\n`);

  return results;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  createLayoutAnalysisRoutes,
  createLayoutHealthCheck,
  createCLIAnalyzer,
  processSVGDirectory,

  // Direct access to analyzer
  layoutAnalyzer,
};

// ============================================================================
// CLI EXECUTION
// ============================================================================

if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const cli = createCLIAnalyzer();

  switch (command) {
    case 'analyze':
      if (!args[1]) {
        console.error('Usage: node svg-layout-analyzer-integration-example.js analyze <file.svg> [--verbose]');
        process.exit(1);
      }
      cli.analyzeFile(args[1], { verbose: args.includes('--verbose') });
      break;

    case 'optimize':
      if (!args[1] || !args[2]) {
        console.error('Usage: node svg-layout-analyzer-integration-example.js optimize <input.svg> <output.svg> [algorithm] [--iterations 100]');
        process.exit(1);
      }
      const algo = args[3] || 'force-directed';
      const iterations = parseInt(args[args.indexOf('--iterations') + 1]) || 100;
      cli.optimizeFile(args[1], args[2], algo, { iterations });
      break;

    case 'compare':
      if (!args[1]) {
        console.error('Usage: node svg-layout-analyzer-integration-example.js compare <file.svg> [--iterations 100]');
        process.exit(1);
      }
      const compareIter = parseInt(args[args.indexOf('--iterations') + 1]) || 100;
      cli.compareAlgorithms(args[1], compareIter);
      break;

    case 'batch':
      if (!args[1]) {
        console.error('Usage: node svg-layout-analyzer-integration-example.js batch <directory> [algorithm] [--iterations 100]');
        process.exit(1);
      }
      const batchAlgo = args[2] || 'force-directed';
      const batchIterations = parseInt(args[args.indexOf('--iterations') + 1]) || 100;
      processSVGDirectory(args[1], { algorithm: batchAlgo, iterations: batchIterations });
      break;

    default:
      console.log(`SVG Layout Analyzer Integration\n`);
      console.log(`Commands:`);
      console.log(`  analyze <file.svg> [--verbose]`);
      console.log(`    Analyze SVG layout\n`);
      console.log(`  optimize <input.svg> <output.svg> [algorithm] [--iterations 100]`);
      console.log(`    Optimize SVG layout and save result\n`);
      console.log(`  compare <file.svg> [--iterations 100]`);
      console.log(`    Compare all layout algorithms\n`);
      console.log(`  batch <directory> [algorithm] [--iterations 100]`);
      console.log(`    Process multiple SVG files\n`);
      console.log(`Algorithms: force-directed, hierarchical, circular\n`);
  }
}
