#!/usr/bin/env node

/**
 * Matrix Theme Profile Analyzer
 * Parses profiler output and generates actionable analysis
 */

const fs = require('fs');
const path = require('path');

class MatrixProfileAnalyzer {
  constructor(profilePath) {
    this.profilePath = profilePath;
    this.profile = null;
  }

  /**
   * Load profiler JSON report
   */
  load() {
    if (!fs.existsSync(this.profilePath)) {
      throw new Error(`Profile not found: ${this.profilePath}`);
    }

    this.profile = JSON.parse(fs.readFileSync(this.profilePath, 'utf-8'));
  }

  /**
   * Analyze CPU profile for hotspots
   */
  analyzeCpuHotspots() {
    const functions = this.profile.cpu.topFunctions;
    const totalTime = this.profile.cpu.totalTime;

    return functions.map((fn, idx) => {
      const percentage = (fn.totalTime / totalTime * 100).toFixed(1);
      const variance = fn.stdDev / fn.avgTime; // Coefficient of variation

      return {
        rank: idx + 1,
        name: fn.name,
        totalTime: fn.totalTime.toFixed(3),
        avgTime: fn.avgTime.toFixed(3),
        callCount: fn.callCount,
        minTime: fn.minTime?.toFixed(3) || 'N/A',
        maxTime: fn.maxTime?.toFixed(3) || 'N/A',
        stdDev: fn.stdDev?.toFixed(3) || 'N/A',
        percentage,
        variance: variance?.toFixed(2) || 'N/A',
        consistency: variance < 0.2 ? 'high' : variance < 0.5 ? 'medium' : 'low'
      };
    });
  }

  /**
   * Analyze memory allocation patterns
   */
  analyzeMemoryPatterns() {
    const memory = this.profile.memory;
    const snapshots = memory.snapshots;

    const transitions = [];
    for (let i = 1; i < snapshots.length; i++) {
      const prev = snapshots[i - 1];
      const curr = snapshots[i];
      const delta = curr.heapUsed - prev.heapUsed;
      const deltaPercent = (delta / prev.heapUsed * 100).toFixed(1);

      transitions.push({
        from: prev.label,
        to: curr.label,
        deltaMB: (delta / 1024 / 1024).toFixed(2),
        deltaPercent,
        trend: delta > 0 ? 'grow' : 'shrink'
      });
    }

    return {
      snapshots: snapshots.map(s => ({
        label: s.label,
        heapMB: parseFloat(s.heapUsedMB),
        rssMB: parseFloat(s.rssMB || '0')
      })),
      transitions,
      stats: memory.stats
    };
  }

  /**
   * Analyze I/O efficiency
   */
  analyzeIoEfficiency() {
    const io = this.profile.io;
    const operations = io.topOperations || [];

    const totalIoTime = operations.reduce((sum, op) => sum + (op.durationMs || 0), 0);
    const avgOpTime = operations.length > 0 ? totalIoTime / operations.length : 0;

    return {
      summary: {
        totalReads: io.stats.reads,
        totalWrites: io.stats.writes,
        totalIoOps: io.stats.reads + io.stats.writes,
        bytesRead: io.bytesReadMB,
        bytesWritten: io.bytesWrittenMB,
        totalBytesIO: (parseFloat(io.bytesReadMB) + parseFloat(io.bytesWrittenMB)).toFixed(2),
        totalIoTime: totalIoTime.toFixed(2),
        avgOpTime: avgOpTime.toFixed(2)
      },
      operations: operations.map((op, idx) => ({
        rank: idx + 1,
        operation: op.operation,
        durationMs: op.durationMs?.toFixed(2) || 'N/A',
        bytes: op.bytes,
        throughputMbps: op.bytes && op.durationMs
          ? ((op.bytes / 1024 / 1024) / (op.durationMs / 1000)).toFixed(2)
          : 'N/A'
      }))
    };
  }

  /**
   * Identify optimization opportunities
   */
  identifyOptimizations() {
    const opportunities = [];

    // CPU optimization opportunities
    const cpuTop = this.profile.cpu.topFunctions[0];
    if (cpuTop.totalTime > 1) {
      opportunities.push({
        priority: 'high',
        category: 'CPU',
        function: cpuTop.name,
        issue: `${cpuTop.name} consuming ${(cpuTop.totalTime).toFixed(2)}ms of total ${(this.profile.cpu.totalTime).toFixed(2)}ms`,
        recommendation: 'Consider caching, memoization, or algorithmic optimization',
        impact: 'Could reduce CPU time by 20-50%'
      });
    }

    // Memory optimization opportunities
    const memGrowth = parseFloat(this.profile.memory.stats.heapGrowth);
    if (memGrowth > 1) {
      opportunities.push({
        priority: 'medium',
        category: 'Memory',
        issue: `Heap growth of ${memGrowth.toFixed(2)}MB suggests potential retention`,
        recommendation: 'Review snapshot transition pattern for unexpected allocations',
        impact: 'Reduce GC pressure, improve consistency'
      });
    }

    // I/O optimization opportunities
    const slowIO = this.profile.io.topOperations
      ?.filter(op => op.durationMs > 50)
      .slice(0, 1)[0];

    if (slowIO) {
      opportunities.push({
        priority: 'medium',
        category: 'I/O',
        operation: slowIO.operation,
        issue: `${slowIO.operation} taking ${slowIO.durationMs.toFixed(2)}ms`,
        recommendation: 'Batch I/O operations, use async patterns, or implement caching',
        impact: 'Could reduce I/O overhead by 30-60%'
      });
    }

    // Function consistency issues
    const inconsistentFunctions = this.profile.cpu.topFunctions
      .filter(f => f.stdDev && (f.stdDev / f.avgTime) > 0.5)
      .slice(0, 1);

    if (inconsistentFunctions.length > 0) {
      const fn = inconsistentFunctions[0];
      opportunities.push({
        priority: 'low',
        category: 'Consistency',
        function: fn.name,
        issue: `${fn.name} has high variance (${fn.stdDev.toFixed(3)}ms stdDev)`,
        recommendation: 'Investigate what causes performance fluctuation',
        impact: 'Improve predictability and stability'
      });
    }

    return opportunities.sort((a, b) => {
      const priorityMap = { high: 0, medium: 1, low: 2 };
      return priorityMap[a.priority] - priorityMap[b.priority];
    });
  }

  /**
   * Compare with baseline
   */
  compareWithBaseline() {
    const baseline = {
      cpuTime: 3.5,
      maxHeap: 4.47,
      minHeap: 3.92,
      avgHeap: 4.26,
      ioReads: 1,
      ioWrites: 3
    };

    const current = {
      cpuTime: this.profile.cpu.totalTime,
      maxHeap: parseFloat(this.profile.memory.stats.maxHeapMB),
      minHeap: parseFloat(this.profile.memory.stats.minHeapMB),
      avgHeap: parseFloat(this.profile.memory.stats.avgHeapMB),
      ioReads: this.profile.io.stats.reads,
      ioWrites: this.profile.io.stats.writes
    };

    return {
      cpuTime: {
        baseline: baseline.cpuTime.toFixed(2),
        current: current.cpuTime.toFixed(2),
        delta: (current.cpuTime - baseline.cpuTime).toFixed(2),
        deltaPercent: (((current.cpuTime - baseline.cpuTime) / baseline.cpuTime) * 100).toFixed(1),
        status: current.cpuTime > baseline.cpuTime * 1.2 ? 'REGRESSION' : 'OK'
      },
      maxHeap: {
        baseline: baseline.maxHeap.toFixed(2),
        current: current.maxHeap.toFixed(2),
        delta: (current.maxHeap - baseline.maxHeap).toFixed(2),
        deltaPercent: (((current.maxHeap - baseline.maxHeap) / baseline.maxHeap) * 100).toFixed(1),
        status: current.maxHeap > baseline.maxHeap * 1.2 ? 'REGRESSION' : 'OK'
      },
      ioOperations: {
        baselineTotal: baseline.ioReads + baseline.ioWrites,
        currentTotal: current.ioReads + current.ioWrites,
        reads: current.ioReads,
        writes: current.ioWrites,
        status: current.ioReads > baseline.ioReads || current.ioWrites > baseline.ioWrites ? 'CHECK' : 'OK'
      }
    };
  }

  /**
   * Generate comprehensive report
   */
  generateReport() {
    this.load();

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║          Matrix Theme Profile Analysis Report                  ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    // CPU Analysis
    console.log('▶ CPU HOTSPOTS ANALYSIS');
    console.log('─'.repeat(70));
    const cpuHotspots = this.analyzeCpuHotspots().slice(0, 10);
    console.log(`Total CPU Time: ${this.profile.cpu.totalTime.toFixed(2)} ms\n`);
    cpuHotspots.forEach(fn => {
      console.log(`  ${fn.rank}. ${fn.name.padEnd(30)} | ${fn.totalTime.padStart(8)} ms | ${fn.percentage.padStart(5)}% | Calls: ${fn.callCount}`);
      console.log(`     Avg: ${fn.avgTime} ms | Range: ${fn.minTime}-${fn.maxTime} | Consistency: ${fn.consistency}`);
    });

    // Memory Analysis
    console.log('\n▶ MEMORY ALLOCATION PATTERNS');
    console.log('─'.repeat(70));
    const memAnalysis = this.analyzeMemoryPatterns();
    console.log(`\nSnapshots:\n`);
    memAnalysis.snapshots.forEach(snap => {
      console.log(`  ${snap.label.padEnd(25)} | Heap: ${String(snap.heapMB).padStart(6)} MB`);
    });
    console.log(`\nTransitions:\n`);
    memAnalysis.transitions.forEach(trans => {
      const arrow = trans.trend === 'grow' ? '→' : '←';
      console.log(`  ${trans.from.padEnd(20)} ${arrow} ${trans.to.padEnd(20)} | ${trans.deltaPercent.padStart(6)}% (${trans.deltaMB} MB)`);
    });
    console.log(`\nMemory Stats:`);
    console.log(`  Max:  ${memAnalysis.stats.maxHeapMB} MB`);
    console.log(`  Min:  ${memAnalysis.stats.minHeapMB} MB`);
    console.log(`  Avg:  ${memAnalysis.stats.avgHeapMB} MB`);
    console.log(`  Growth: ${memAnalysis.stats.heapGrowth} MB`);

    // I/O Analysis
    console.log('\n▶ I/O EFFICIENCY ANALYSIS');
    console.log('─'.repeat(70));
    const ioAnalysis = this.analyzeIoEfficiency();
    console.log(`Summary: ${ioAnalysis.summary.totalReads} reads | ${ioAnalysis.summary.totalWrites} writes | ${ioAnalysis.summary.totalBytesIO} MB total`);
    if (ioAnalysis.operations.length > 0) {
      console.log('\nSlowest Operations:\n');
      ioAnalysis.operations.slice(0, 5).forEach(op => {
        console.log(`  ${op.rank}. ${op.operation.padEnd(20)} | ${op.durationMs.padStart(8)} ms | ${op.bytes} bytes`);
      });
    }

    // Optimization Opportunities
    console.log('\n▶ OPTIMIZATION OPPORTUNITIES');
    console.log('─'.repeat(70));
    const opportunities = this.identifyOptimizations();
    if (opportunities.length === 0) {
      console.log('✓ No major optimization opportunities detected');
    } else {
      opportunities.forEach((opp, idx) => {
        console.log(`\n  ${idx + 1}. [${opp.priority.toUpperCase()}] ${opp.category}`);
        console.log(`     Issue: ${opp.function || opp.operation || opp.issue}`);
        console.log(`     Problem: ${opp.issue}`);
        console.log(`     Recommendation: ${opp.recommendation}`);
        console.log(`     Expected Impact: ${opp.impact}`);
      });
    }

    // Baseline Comparison
    console.log('\n▶ BASELINE COMPARISON');
    console.log('─'.repeat(70));
    const comparison = this.compareWithBaseline();
    console.log(`\nCPU Time:       ${comparison.cpuTime.current} ms (baseline: ${comparison.cpuTime.baseline} ms) [${comparison.cpuTime.status}]`);
    if (parseFloat(comparison.cpuTime.delta) !== 0) {
      console.log(`                ${comparison.cpuTime.deltaPercent}% change`);
    }
    console.log(`\nMax Heap:       ${comparison.maxHeap.current} MB (baseline: ${comparison.maxHeap.baseline} MB) [${comparison.maxHeap.status}]`);
    if (parseFloat(comparison.maxHeap.delta) !== 0) {
      console.log(`                ${comparison.maxHeap.deltaPercent}% change`);
    }
    console.log(`\nI/O Operations: ${comparison.ioOperations.currentTotal} total (${comparison.ioOperations.reads}R / ${comparison.ioOperations.writes}W) [${comparison.ioOperations.status}]`);

    // Bottlenecks Summary
    console.log('\n▶ DETECTED BOTTLENECKS');
    console.log('─'.repeat(70));
    if (this.profile.bottlenecks && this.profile.bottlenecks.length > 0) {
      this.profile.bottlenecks.slice(0, 5).forEach((bn, idx) => {
        console.log(`\n  ${idx + 1}. [${bn.severity.toUpperCase()}] ${bn.type.toUpperCase()} - ${bn.function || bn.operation}`);
        if (bn.avgTime) console.log(`     Avg Time: ${bn.avgTime.toFixed(2)} ms`);
        if (bn.maxTime) console.log(`     Max Time: ${bn.maxTime.toFixed(2)} ms`);
        if (bn.duration) console.log(`     Duration: ${bn.duration.toFixed(2)} ms`);
      });
    } else {
      console.log('✓ No significant bottlenecks detected');
    }

    console.log('\n' + '═'.repeat(70) + '\n');
  }
}

// Main execution
function main() {
  const outputDir = path.resolve(__dirname, 'output');
  const latestProfile = fs.readdirSync(outputDir)
    .filter(f => f.startsWith('matrix-profile-') && f.endsWith('.json'))
    .sort()
    .pop();

  if (!latestProfile) {
    console.error('No profiler output found. Run: node profilers/matrix-theme-profiler.js');
    process.exit(1);
  }

  const profilePath = path.join(outputDir, latestProfile);
  console.log(`Analyzing: ${latestProfile}\n`);

  const analyzer = new MatrixProfileAnalyzer(profilePath);
  try {
    analyzer.generateReport();
  } catch (error) {
    console.error('Analysis error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = MatrixProfileAnalyzer;
