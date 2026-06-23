/**
 * profiles.config.js
 *
 * Pre-configured profiling scenarios for common use cases.
 * Use with custom profiler script or as reference.
 *
 * Example:
 *   const config = require('./profiles.config.js');
 *   const profile = config.scenarios.leakDetection;
 *   // { duration: 60000, sampleInterval: 100, threshold: {...} }
 */

module.exports = {
  // ========================================================================
  // PREDEFINED SCENARIOS
  // ========================================================================

  scenarios: {
    /**
     * Quick Sanity Check (5 minutes total)
     * Fast baseline for CI/CD gates
     */
    quickSanity: {
      name: 'Quick Sanity Check',
      duration: 60000, // 1 minute
      iterations: 3,
      sampleInterval: 1000,
      tests: ['fork', 'spawn'],
      description: 'Fast baseline for gating CI/CD'
    },

    /**
     * Comprehensive Profile (30 minutes total)
     * Full profiling suite for detailed analysis
     */
    comprehensive: {
      name: 'Comprehensive Profile',
      duration: 600000, // 10 minutes
      iterations: 10,
      sampleInterval: 500,
      tests: ['fork', 'spawn', 'ipc', 'concurrent', 'leaks'],
      description: 'Full suite for detailed analysis'
    },

    /**
     * Leak Detection (1 hour+)
     * Long-running stability check
     */
    leakDetection: {
      name: 'Leak Detection',
      duration: 1800000, // 30 minutes
      iterations: 1,
      sampleInterval: 100,
      tests: ['leaks'],
      memoryThreshold: {
        growthPerSec: 100000, // 100 KB/sec
        peakAllowed: 500000000 // 500 MB
      },
      fdThreshold: {
        leaksPerOp: 5,
        maxPeak: 1024
      },
      description: 'Long-running stability verification'
    },

    /**
     * Fork Performance Optimization
     * Focus on creation overhead
     */
    forkOptimization: {
      name: 'Fork Performance Optimization',
      duration: 120000, // 2 minutes
      iterations: 50,
      sampleInterval: 1000,
      tests: ['fork', 'ipc'],
      benchmarks: {
        forkTime: {
          target: 1.5, // ms
          maxAcceptable: 5 // ms
        },
        ipcLatency: {
          target: 20, // ms
          maxAcceptable: 50 // ms
        }
      },
      description: 'Optimize fork() and IPC latency'
    },

    /**
     * Cleanup & Resource Release
     * Verify graceful termination
     */
    cleanupValidation: {
      name: 'Cleanup & Resource Release',
      duration: 180000, // 3 minutes
      iterations: 100,
      sampleInterval: 1000,
      tests: ['cleanup', 'fds'],
      resourceTargets: {
        maxCleanupTime: 5, // ms
        maxFDLeak: 0,
        maxMemoryRetention: 100000 // 100 KB
      },
      description: 'Validate graceful cleanup'
    },

    /**
     * Concurrency Stress Test
     * Test under high load
     */
    concurrencyStress: {
      name: 'Concurrency Stress Test',
      duration: 300000, // 5 minutes
      concurrentForks: 50,
      iterations: 5,
      sampleInterval: 500,
      tests: ['concurrent'],
      loadProfile: {
        minConcurrent: 10,
        maxConcurrent: 100,
        step: 10 // increment by 10 each iteration
      },
      systemLimits: {
        maxMemory: 2000000000, // 2 GB
        maxFDs: 4096,
        maxProcesses: 512
      },
      description: 'Stress test concurrent spawning'
    },

    /**
     * Memory Fragmentation Analysis
     * Detect heap fragmentation issues
     */
    memoryFragmentation: {
      name: 'Memory Fragmentation Analysis',
      duration: 600000, // 10 minutes
      iterations: 100,
      sampleInterval: 100,
      tests: ['memory'],
      heapAnalysis: {
        snapshotInterval: 10000, // Take snapshot every 10s
        trackFragmentation: true,
        trackGCPauses: true,
        minFragmentationRatio: 0.7 // Flag if < 70% utilization
      },
      description: 'Analyze heap fragmentation patterns'
    },

    /**
     * IPC Throughput Test
     * Measure message passing performance
     */
    ipcThroughput: {
      name: 'IPC Throughput Test',
      duration: 120000, // 2 minutes
      messageCount: 10000,
      messageSizes: [64, 1024, 65536], // bytes
      iterations: 5,
      tests: ['ipc'],
      benchmarks: {
        messagesPerSecond: 50000,
        latencyP99: 10 // ms
      },
      description: 'Measure IPC throughput and latency'
    }
  },

  // ========================================================================
  // THRESHOLDS & ALERTS
  // ========================================================================

  thresholds: {
    // Fork operations
    forkTime: {
      good: { max: 1.5 }, // ms
      warning: { max: 5 },
      critical: { max: 20 }
    },

    // IPC operations
    ipcLatency: {
      good: { max: 20 }, // ms
      warning: { max: 50 },
      critical: { max: 100 }
    },

    // Cleanup operations
    cleanupTime: {
      good: { max: 5 }, // ms
      warning: { max: 10 },
      critical: { max: 50 }
    },

    // Memory growth
    memoryGrowth: {
      good: { perSecond: 50000 }, // bytes/sec (50 KB/sec)
      warning: { perSecond: 100000 }, // 100 KB/sec
      critical: { perSecond: 500000 } // 500 KB/sec (leak)
    },

    // File descriptors
    fileDescriptors: {
      good: { leaksPerOp: 0 },
      warning: { leaksPerOp: 2 },
      critical: { leaksPerOp: 5 }
    },

    // Heap usage
    heapUsage: {
      good: { growth: 1048576 }, // 1 MB per 100 ops
      warning: { growth: 5242880 }, // 5 MB
      critical: { growth: 10485760 } // 10 MB
    },

    // CPU time
    cpuUsage: {
      good: { perOp: 10 }, // ms CPU per fork
      warning: { perOp: 25 },
      critical: { perOp: 50 }
    }
  },

  // ========================================================================
  // REGRESSION DETECTION
  // ========================================================================

  regressionDetection: {
    enableComparison: true,
    baselineFile: 'profilers/results/baseline.json',

    // Alert if metric changes beyond tolerance
    tolerances: {
      forkTime: 0.15, // 15% increase
      ipcLatency: 0.20, // 20% increase
      memoryGrowth: 0.25, // 25% increase
      cleanupTime: 0.20 // 20% increase
    },

    // Require N successful runs before flagging regression
    minConsecutiveViolations: 2,

    // Store historical data for trend analysis
    trackHistory: true,
    historyRetention: 30 // days
  },

  // ========================================================================
  // REPORTING
  // ========================================================================

  reporting: {
    formats: ['text', 'json', 'csv', 'html'],

    outputDirectory: 'profilers/results',

    fileNameTemplate: 'profile-{scenario}-{timestamp}.{ext}',

    includeStats: {
      percentiles: [50, 75, 90, 95, 99],
      timeSeries: true,
      correlation: true
    },

    alerts: {
      enabled: true,
      channels: ['console', 'file'],
      severity: ['critical', 'warning']
    },

    export: {
      prometheus: false, // Export Prometheus metrics
      graphite: false, // Export to Graphite
      influxdb: false // Export to InfluxDB
    }
  },

  // ========================================================================
  // SYSTEM REQUIREMENTS CHECKER
  // ========================================================================

  systemChecks: {
    // Check before running profiles
    preFlightChecks: [
      {
        name: 'Node.js version',
        check: () => {
          const v = process.versions.node.split('.')[0];
          return parseInt(v) >= 12;
        },
        message: 'Requires Node.js 12+'
      },
      {
        name: 'GC expose flag',
        check: () => global.gc !== undefined,
        message: 'Run with --expose-gc for accurate memory profiling',
        severity: 'warning'
      },
      {
        name: 'Available FDs',
        check: () => {
          const maxFDs = require('os').constants.rlimit.NOFILE.soft;
          return maxFDs >= 2048;
        },
        message: 'Increase ulimit -n to at least 2048'
      },
      {
        name: 'Available memory',
        check: () => {
          const freeMem = require('os').freemem();
          return freeMem > 500000000; // 500 MB
        },
        message: 'Requires at least 500 MB free memory'
      }
    ]
  },

  // ========================================================================
  // UTILITY FUNCTIONS
  // ========================================================================

  /**
   * Get scenario configuration by name
   */
  getScenario: function(name) {
    return this.scenarios[name] || this.scenarios.quickSanity;
  },

  /**
   * Evaluate metric against thresholds
   */
  evaluateMetric: function(name, value) {
    const threshold = this.thresholds[name];
    if (!threshold) return 'unknown';

    if (value <= threshold.good.max) return 'good';
    if (value <= threshold.warning.max) return 'warning';
    return 'critical';
  },

  /**
   * Get alert for threshold violation
   */
  getAlert: function(metricName, currentValue, previousValue) {
    const tolerance = this.regressionDetection.tolerances[metricName];
    if (!tolerance || !previousValue) return null;

    const change = (currentValue - previousValue) / previousValue;
    if (Math.abs(change) > tolerance) {
      return {
        metric: metricName,
        change: (change * 100).toFixed(1),
        current: currentValue,
        previous: previousValue,
        severity: this.evaluateMetric(metricName, currentValue)
      };
    }
    return null;
  }
};
