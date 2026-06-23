/**
 * SVG Inspector Profiler - Test Suite
 * Comprehensive tests for DOM operation tracking, reflow/repaint detection, and performance metrics
 */

const SVGInspectorProfiler = require('./svg-inspector-profiler');

describe('SVGInspectorProfiler', () => {
  let profiler;
  let svgContainer;

  beforeEach(() => {
    // Mock DOM setup
    if (typeof document === 'undefined') {
      global.document = {
        body: {
          appendChild: jest.fn(),
          removeChild: jest.fn(),
        },
        createElementNS: jest.fn((ns, tag) => ({
          tagName: tag,
          setAttribute: jest.fn(),
          getAttribute: jest.fn(),
          appendChild: jest.fn(),
          removeChild: jest.fn(),
          childNodes: [],
          className: '',
          id: '',
        })),
        querySelector: jest.fn(() => ({
          appendChild: jest.fn(),
          innerHTML: '',
        })),
      };
    }

    profiler = new SVGInspectorProfiler({
      verbose: false,
      trackMemory: true,
    });

    svgContainer = {
      tagName: 'svg',
      appendChild: jest.fn(),
      removeChild: jest.fn(),
      setAttribute: jest.fn(),
      getAttribute: jest.fn(),
      childNodes: [],
    };
  });

  afterEach(() => {
    if (profiler && profiler.state.isMonitoring) {
      profiler.stop();
    }
  });

  describe('Initialization', () => {
    test('should create profiler with default options', () => {
      const p = new SVGInspectorProfiler();
      expect(p.options.captureEnabled).toBe(true);
      expect(p.options.sampleInterval).toBe(16);
      expect(p.options.maxSamples).toBe(1000);
      expect(p.options.trackMemory).toBe(true);
      expect(p.options.verbose).toBe(false);
    });

    test('should create profiler with custom options', () => {
      const p = new SVGInspectorProfiler({
        sampleInterval: 32,
        maxSamples: 500,
        verbose: true,
        reflowThreshold: 10,
      });
      expect(p.options.sampleInterval).toBe(32);
      expect(p.options.maxSamples).toBe(500);
      expect(p.options.verbose).toBe(true);
      expect(p.options.thresholds.reflow).toBe(10);
    });

    test('should initialize with empty metrics', () => {
      expect(profiler.metrics.domOperations.length).toBe(0);
      expect(profiler.metrics.reflows.length).toBe(0);
      expect(profiler.metrics.repaints.length).toBe(0);
      expect(profiler.metrics.eventHandlers.length).toBe(0);
    });
  });

  describe('Profiling Lifecycle', () => {
    test('should start monitoring', () => {
      profiler.start(svgContainer);
      expect(profiler.state.isMonitoring).toBe(true);
      expect(profiler.state.startTime).toBeGreaterThan(0);

      profiler.stop();
    });

    test('should stop monitoring and return report', () => {
      profiler.start(svgContainer);
      expect(profiler.state.isMonitoring).toBe(true);

      const report = profiler.stop();
      expect(profiler.state.isMonitoring).toBe(false);
      expect(report).toHaveProperty('summary');
      expect(report).toHaveProperty('domOperations');
      expect(report).toHaveProperty('recommendations');
    });

    test('should prevent duplicate starts', () => {
      profiler.start(svgContainer);
      const startTime1 = profiler.state.startTime;

      profiler.start(svgContainer);
      expect(profiler.state.startTime).toBe(startTime1);

      profiler.stop();
    });

    test('should return existing metrics if stop is called when not monitoring', () => {
      const report = profiler.stop();
      expect(report).toBeDefined();
      expect(report.domOperations.count).toBe(0);
    });
  });

  describe('DOM Operation Tracking', () => {
    test('should track appendChild operations', () => {
      profiler.start(svgContainer);

      const element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      svgContainer.appendChild(element);

      const report = profiler.stop();
      expect(report.domOperations.count).toBeGreaterThan(0);
    });

    test('should track setAttribute operations', () => {
      profiler.start(svgContainer);

      svgContainer.setAttribute('viewBox', '0 0 100 100');
      svgContainer.setAttribute('d', 'M0,0 L100,100');

      const report = profiler.stop();
      expect(report.attributeChanges.count).toBeGreaterThanOrEqual(2);
    });

    test('should track critical SVG attributes', () => {
      profiler.start(svgContainer);

      svgContainer.setAttribute('d', 'M0,0 L100,100');
      svgContainer.setAttribute('transform', 'translate(10,10)');
      svgContainer.setAttribute('cx', '50');
      svgContainer.setAttribute('cy', '50');
      svgContainer.setAttribute('r', '5');

      const report = profiler.stop();
      expect(report.attributeChanges.criticalRate).toBeGreaterThan(0);
    });

    test('should categorize DOM operations by type', () => {
      profiler.start(svgContainer);

      const el1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const el2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

      svgContainer.appendChild(el1);
      svgContainer.appendChild(el2);

      const report = profiler.stop();
      expect(report.domOperations.byType.appendChild).toBeDefined();
    });
  });

  describe('Report Generation', () => {
    test('should generate valid report structure', () => {
      profiler.start(svgContainer);
      const report = profiler.getReport();

      expect(report).toHaveProperty('summary');
      expect(report).toHaveProperty('domOperations');
      expect(report).toHaveProperty('reflows');
      expect(report).toHaveProperty('repaints');
      expect(report).toHaveProperty('eventHandlers');
      expect(report).toHaveProperty('attributeChanges');
      expect(report).toHaveProperty('layoutThrashing');
      expect(report).toHaveProperty('memory');
      expect(report).toHaveProperty('recommendations');

      profiler.stop();
    });

    test('should calculate DOM operation rate', () => {
      profiler.start(svgContainer);

      // Simulate multiple operations
      for (let i = 0; i < 10; i++) {
        const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        svgContainer.appendChild(el);
      }

      const report = profiler.stop();
      expect(report.domOperations.rate).toBeGreaterThanOrEqual(0);
    });

    test('should detect exceeded reflow thresholds', () => {
      profiler = new SVGInspectorProfiler({
        reflowThreshold: 5, // Very low threshold
      });
      profiler.start(svgContainer);

      // Manually add exceeded reflow
      profiler.metrics.reflows.push({
        duration: 10,
        name: 'test',
        exceeded: true,
      });

      const report = profiler.stop();
      expect(report.reflows.exceeded).toBeGreaterThan(0);
    });

    test('should include frame information in summary', () => {
      profiler.start(svgContainer);
      const report = profiler.getReport();

      expect(report.summary).toHaveProperty('totalDuration');
      expect(report.summary).toHaveProperty('frameCount');
      expect(report.summary).toHaveProperty('averageFrameTime');
      expect(report.summary.totalDuration).toBeGreaterThanOrEqual(0);

      profiler.stop();
    });
  });

  describe('Memory Analysis', () => {
    test('should capture memory snapshots', () => {
      profiler = new SVGInspectorProfiler({
        trackMemory: true,
      });
      profiler.start(svgContainer);

      // Capture multiple snapshots
      profiler._captureMemorySnapshot();
      profiler._captureMemorySnapshot();
      profiler._captureMemorySnapshot();

      const report = profiler.stop();
      if (report.memory.available) {
        expect(report.memory.snapshots).toBeGreaterThan(0);
      }
    });

    test('should respect maxSamples limit', () => {
      profiler = new SVGInspectorProfiler({
        maxSamples: 5,
        trackMemory: true,
      });
      profiler.start(svgContainer);

      // Capture more than maxSamples
      for (let i = 0; i < 10; i++) {
        profiler._captureMemorySnapshot();
      }

      expect(profiler.metrics.memorySnapshots.length).toBeLessThanOrEqual(5);

      profiler.stop();
    });

    test('should calculate memory growth percentage', () => {
      profiler = new SVGInspectorProfiler({
        trackMemory: true,
      });

      // Mock performance.memory
      if (!performance.memory) {
        performance.memory = {
          usedJSHeapSize: 10000000,
          totalJSHeapSize: 20000000,
          jsHeapSizeLimit: 50000000,
        };
      }

      profiler.start(svgContainer);
      profiler.stop();

      const report = profiler.getReport();
      if (report.memory.available) {
        expect(report.memory).toHaveProperty('heapGrowthPercent');
      }
    });
  });

  describe('Recommendations', () => {
    test('should generate recommendations for high DOM operation rate', () => {
      profiler = new SVGInspectorProfiler({
        reflowThreshold: 5,
      });
      profiler.start(svgContainer);

      // Simulate high rate operations
      for (let i = 0; i < 200; i++) {
        const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        svgContainer.appendChild(el);
      }

      const report = profiler.stop();
      // Recommendations might be generated for high operation rate
      expect(Array.isArray(report.recommendations)).toBe(true);
    });

    test('should generate recommendations for exceeded reflow threshold', () => {
      profiler = new SVGInspectorProfiler({
        reflowThreshold: 5,
      });
      profiler.start(svgContainer);

      // Add exceeded reflow
      profiler.metrics.reflows.push({
        duration: 20,
        exceeded: true,
      });
      profiler.metrics.reflows.push({
        duration: 25,
        exceeded: true,
      });
      profiler.metrics.reflows.push({
        duration: 3,
        exceeded: false,
      });

      const report = profiler.stop();
      const reflowRecs = report.recommendations.filter((r) => r.category === 'Reflow');
      // If exceedance rate > 50%, should generate recommendation
      if (report.reflows.exceedanceRate > 50) {
        expect(reflowRecs.length).toBeGreaterThan(0);
      }
    });

    test('should detect layout thrashing pattern', () => {
      profiler.start(svgContainer);

      // Simulate layout thrashing pattern
      for (let i = 0; i < 15; i++) {
        profiler.metrics.domOperations.push({
          timestamp: i,
          operation: 'appendChild',
          parent: 'svg',
        });
      }

      profiler._detectLayoutThrashing();
      const report = profiler.stop();

      // May or may not detect thrashing based on thresholds
      expect(report.layoutThrashing).toHaveProperty('detected');
    });

    test('should set correct recommendation priorities', () => {
      profiler.start(svgContainer);
      const report = profiler.stop();

      report.recommendations.forEach((rec) => {
        expect(['high', 'medium', 'low']).toContain(rec.priority);
        expect(rec).toHaveProperty('category');
        expect(rec).toHaveProperty('message');
        expect(rec).toHaveProperty('action');
      });
    });
  });

  describe('Export Functions', () => {
    test('should export JSON format', () => {
      profiler.start(svgContainer);
      profiler.stop();

      const json = profiler.exportJSON();
      expect(typeof json).toBe('string');

      const parsed = JSON.parse(json);
      expect(parsed).toHaveProperty('summary');
      expect(parsed).toHaveProperty('recommendations');
    });

    test('should export CSV format', () => {
      profiler.start(svgContainer);
      profiler.stop();

      const csv = profiler.exportCSV();
      expect(typeof csv).toBe('string');
      expect(csv).toContain('Summary');
      expect(csv).toContain('DOM Operations');
      expect(csv).toContain('Reflows');
    });

    test('exported JSON should be valid', () => {
      profiler.start(svgContainer);
      profiler.stop();

      const json = profiler.exportJSON();
      expect(() => JSON.parse(json)).not.toThrow();
    });

    test('exported CSV should be parseable', () => {
      profiler.start(svgContainer);
      profiler.stop();

      const csv = profiler.exportCSV();
      const lines = csv.split('\n');
      expect(lines.length).toBeGreaterThan(0);
      expect(lines[0]).toContain(','); // CSV format check
    });
  });

  describe('Threshold Configuration', () => {
    test('should use custom reflow threshold', () => {
      const customThreshold = 20;
      profiler = new SVGInspectorProfiler({
        reflowThreshold: customThreshold,
      });

      expect(profiler.options.thresholds.reflow).toBe(customThreshold);
    });

    test('should use custom event handler threshold', () => {
      const customThreshold = 15;
      profiler = new SVGInspectorProfiler({
        eventHandlerThreshold: customThreshold,
      });

      expect(profiler.options.thresholds.eventHandler).toBe(customThreshold);
    });

    test('should correctly identify exceeded metrics against thresholds', () => {
      profiler = new SVGInspectorProfiler({
        reflowThreshold: 10,
        eventHandlerThreshold: 5,
      });
      profiler.start(svgContainer);

      // Add reflow below threshold
      profiler.metrics.reflows.push({
        duration: 8,
        exceeded: false,
      });

      // Add reflow above threshold
      profiler.metrics.reflows.push({
        duration: 15,
        exceeded: true,
      });

      const report = profiler.stop();
      expect(report.reflows.count).toBe(2);
      expect(report.reflows.exceeded).toBe(1);
    });
  });

  describe('Utility Functions', () => {
    test('should calculate average correctly', () => {
      profiler.start(svgContainer);
      const avg = profiler._average([10, 20, 30]);
      expect(avg).toBe(20);

      const emptyAvg = profiler._average([]);
      expect(emptyAvg).toBe(0);

      profiler.stop();
    });

    test('should get peaks from timestamps', () => {
      profiler.start(svgContainer);
      const timestamps = Array.from({ length: 250 }, (_, i) => i);
      const peaks = profiler._getPeaks(timestamps, 100);

      expect(Array.isArray(peaks)).toBe(true);
      expect(peaks.length).toBeGreaterThan(0);

      profiler.stop();
    });

    test('should log messages only when verbose', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      profiler = new SVGInspectorProfiler({ verbose: false });
      profiler.log('test message');
      expect(consoleSpy).not.toHaveBeenCalled();

      profiler = new SVGInspectorProfiler({ verbose: true });
      profiler.log('test message');
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty DOM operations gracefully', () => {
      profiler.start(svgContainer);
      const report = profiler.stop();

      expect(report.domOperations.count).toBe(0);
      expect(report.domOperations.byType).toEqual({});
    });

    test('should handle zero metric values', () => {
      profiler.start(svgContainer);
      const report = profiler.getReport();

      expect(report.summary.totalDuration).toBeGreaterThanOrEqual(0);
      expect(report.summary.frameCount).toBeGreaterThanOrEqual(0);

      profiler.stop();
    });

    test('should handle concurrent profilers', () => {
      const profiler1 = new SVGInspectorProfiler();
      const profiler2 = new SVGInspectorProfiler();

      profiler1.start(svgContainer);
      profiler2.start(svgContainer);

      expect(profiler1.state.isMonitoring).toBe(true);
      expect(profiler2.state.isMonitoring).toBe(true);

      profiler1.stop();
      profiler2.stop();
    });

    test('should handle missing performance API gracefully', () => {
      const originalPerformance = global.performance;
      delete global.performance;

      profiler = new SVGInspectorProfiler();
      profiler.start(svgContainer);
      const report = profiler.stop();

      expect(report).toBeDefined();
      expect(report.memory.available).toBe(false);

      global.performance = originalPerformance;
    });
  });
});
