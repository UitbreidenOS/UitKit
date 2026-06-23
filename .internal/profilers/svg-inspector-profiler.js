/**
 * SVG Inspector Profiler
 * Measures DOM operations, reflow/repaint, and event handling overhead for SVG rendering
 * Optimized for large graphs with detailed performance metrics
 */

class SVGInspectorProfiler {
  constructor(options = {}) {
    this.options = {
      captureEnabled: options.captureEnabled !== false,
      sampleInterval: options.sampleInterval || 16, // ~60fps
      maxSamples: options.maxSamples || 1000,
      trackMemory: options.trackMemory !== false,
      trackPaint: options.trackPaint !== false,
      verbose: options.verbose || false,
      thresholds: {
        reflow: options.reflowThreshold || 16.67, // 60fps baseline
        repaint: options.repaintThreshold || 16.67,
        eventHandler: options.eventHandlerThreshold || 10,
      },
    };

    this.metrics = {
      domOperations: [],
      reflows: [],
      repaints: [],
      eventHandlers: [],
      styleChanges: [],
      attributeChanges: [],
      layoutThrasher: [],
      memorySnapshots: [],
    };

    this.state = {
      isMonitoring: false,
      startTime: 0,
      lastFrameTime: 0,
      frameCount: 0,
      pendingDOMOps: 0,
    };

    this.observers = {
      mutationObserver: null,
      performanceObserver: null,
      resizeObserver: null,
    };

    this.hooks = {
      domHooks: [],
      reflowHooks: [],
      eventHooks: [],
    };

    this.interceptors = new Map();
  }

  /**
   * Start profiling SVG operations
   */
  start(svgElement = null) {
    if (this.state.isMonitoring) return;

    this.state.isMonitoring = true;
    this.state.startTime = performance.now();
    this.state.lastFrameTime = this.state.startTime;
    this.state.frameCount = 0;

    this._setupMutationObserver(svgElement);
    this._setupPerformanceObserver();
    this._setupResizeObserver(svgElement);
    this._setupDOMInterceptors();
    this._setupEventInterceptors(svgElement);
    this._captureBaselineMemory();
    this._startFrameMonitoring();

    this.log('[PROFILER] SVG inspection started');
  }

  /**
   * Stop profiling and return metrics
   */
  stop() {
    if (!this.state.isMonitoring) return this.metrics;

    this.state.isMonitoring = false;

    this._cleanupObservers();
    this._cleanupInterceptors();
    this._stopFrameMonitoring();

    const elapsed = performance.now() - this.state.startTime;
    this.log(`[PROFILER] SVG inspection stopped (${elapsed.toFixed(2)}ms)`);

    return this.getReport();
  }

  /**
   * Setup MutationObserver to track DOM changes
   */
  _setupMutationObserver(svgElement) {
    const targetElement = svgElement || document.body;

    const config = {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true,
      characterData: false,
      attributeFilter: [
        'd',
        'transform',
        'cx',
        'cy',
        'r',
        'x',
        'y',
        'width',
        'height',
        'viewBox',
        'class',
        'style',
      ],
    };

    this.observers.mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const timestamp = performance.now() - this.state.startTime;

        if (mutation.type === 'childList') {
          this.metrics.domOperations.push({
            timestamp,
            type: 'childList',
            addedNodes: mutation.addedNodes.length,
            removedNodes: mutation.removedNodes.length,
            target: mutation.target.tagName,
            targetClass: mutation.target.className,
          });
        } else if (mutation.type === 'attributes') {
          this.metrics.attributeChanges.push({
            timestamp,
            attribute: mutation.attributeName,
            oldValue: mutation.oldValue,
            newValue: mutation.target.getAttribute(mutation.attributeName),
            target: mutation.target.tagName,
            targetId: mutation.target.id,
          });
        }
      });
    });

    this.observers.mutationObserver.observe(targetElement, config);
  }

  /**
   * Setup PerformanceObserver to track reflow/repaint
   */
  _setupPerformanceObserver() {
    if (!window.PerformanceObserver) return;

    try {
      this.observers.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        entries.forEach((entry) => {
          const timestamp = entry.startTime - this.state.startTime;
          const duration = entry.duration;

          if (entry.entryType === 'measure') {
            if (
              entry.name.includes('layout') ||
              entry.name.includes('reflow')
            ) {
              this.metrics.reflows.push({
                timestamp,
                duration,
                name: entry.name,
                exceeded: duration > this.options.thresholds.reflow,
              });
            } else if (
              entry.name.includes('paint') ||
              entry.name.includes('repaint')
            ) {
              this.metrics.repaints.push({
                timestamp,
                duration,
                name: entry.name,
                exceeded: duration > this.options.thresholds.repaint,
              });
            }
          }
        });
      });

      this.observers.performanceObserver.observe({
        entryTypes: ['measure', 'mark'],
        buffered: true,
      });
    } catch (e) {
      this.log(`[WARN] PerformanceObserver not fully supported: ${e.message}`);
    }
  }

  /**
   * Setup ResizeObserver to track layout shifts
   */
  _setupResizeObserver(svgElement) {
    if (!window.ResizeObserver) return;

    const targetElement = svgElement || document.body;

    this.observers.resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const timestamp = performance.now() - this.state.startTime;

        this.metrics.reflows.push({
          timestamp,
          type: 'resize',
          width: entry.contentRect.width,
          height: entry.contentRect.height,
          target: entry.target.tagName,
        });
      });
    });

    this.observers.resizeObserver.observe(targetElement);
  }

  /**
   * Intercept DOM methods to track operations
   */
  _setupDOMInterceptors() {
    const originalInsertBefore = Element.prototype.insertBefore;
    const originalAppendChild = Element.prototype.appendChild;
    const originalRemoveChild = Element.prototype.removeChild;
    const originalSetAttribute = Element.prototype.setAttribute;
    const originalRemoveAttribute = Element.prototype.removeAttribute;

    const self = this;

    Element.prototype.insertBefore = function (newNode, refNode) {
      const timestamp = performance.now() - self.state.startTime;
      self.metrics.domOperations.push({
        timestamp,
        operation: 'insertBefore',
        parent: this.tagName,
        node: newNode.tagName,
        nodeCount: this.childNodes.length,
      });
      return originalInsertBefore.call(this, newNode, refNode);
    };

    Element.prototype.appendChild = function (newNode) {
      const timestamp = performance.now() - self.state.startTime;
      self.metrics.domOperations.push({
        timestamp,
        operation: 'appendChild',
        parent: this.tagName,
        node: newNode.tagName,
        nodeCount: this.childNodes.length,
      });
      return originalAppendChild.call(this, newNode);
    };

    Element.prototype.removeChild = function (node) {
      const timestamp = performance.now() - self.state.startTime;
      self.metrics.domOperations.push({
        timestamp,
        operation: 'removeChild',
        parent: this.tagName,
        node: node.tagName,
      });
      return originalRemoveChild.call(this, node);
    };

    Element.prototype.setAttribute = function (name, value) {
      const timestamp = performance.now() - self.state.startTime;
      const isCritical = ['d', 'transform', 'cx', 'cy', 'r'].includes(name);

      self.metrics.attributeChanges.push({
        timestamp,
        operation: 'setAttribute',
        attribute: name,
        value,
        target: this.tagName,
        isCritical,
      });
      return originalSetAttribute.call(this, name, value);
    };

    Element.prototype.removeAttribute = function (name) {
      const timestamp = performance.now() - self.state.startTime;
      self.metrics.attributeChanges.push({
        timestamp,
        operation: 'removeAttribute',
        attribute: name,
        target: this.tagName,
      });
      return originalRemoveAttribute.call(this, name);
    };

    this.interceptors.set('DOM', {
      insertBefore: originalInsertBefore,
      appendChild: originalAppendChild,
      removeChild: originalRemoveChild,
      setAttribute: originalSetAttribute,
      removeAttribute: originalRemoveAttribute,
    });
  }

  /**
   * Intercept event handlers to measure overhead
   */
  _setupEventInterceptors(svgElement) {
    const targetElement = svgElement || document.body;
    const self = this;

    const eventTypes = [
      'click',
      'mousedown',
      'mouseup',
      'mousemove',
      'wheel',
      'touchstart',
      'touchend',
      'touchmove',
    ];

    const originalAddEventListener = EventTarget.prototype.addEventListener;

    EventTarget.prototype.addEventListener = function (
      type,
      listener,
      options
    ) {
      if (eventTypes.includes(type)) {
        const wrappedListener = function (...args) {
          const eventStart = performance.now();
          const result = listener.apply(this, args);
          const eventDuration = performance.now() - eventStart;

          self.metrics.eventHandlers.push({
            timestamp: eventStart - self.state.startTime,
            duration: eventDuration,
            eventType: type,
            target: this.tagName,
            exceeded:
              eventDuration > self.options.thresholds.eventHandler,
          });

          return result;
        };

        return originalAddEventListener.call(
          this,
          type,
          wrappedListener,
          options
        );
      }

      return originalAddEventListener.call(this, type, listener, options);
    };

    this.interceptors.set('EventListener', { addEventListener: originalAddEventListener });
  }

  /**
   * Start frame monitoring for layout thrashing detection
   */
  _startFrameMonitoring() {
    const self = this;

    const monitorFrame = () => {
      if (!self.state.isMonitoring) return;

      const currentTime = performance.now();
      const frameDelta = currentTime - self.state.lastFrameTime;

      self.state.lastFrameTime = currentTime;
      self.state.frameCount++;

      // Detect layout thrashing patterns
      if (
        self.metrics.domOperations.length > 0 ||
        self.metrics.attributeChanges.length > 0
      ) {
        self._detectLayoutThrashing();
      }

      if (self.state.frameCount % 10 === 0) {
        self._captureMemorySnapshot();
      }

      requestAnimationFrame(monitorFrame);
    };

    this.state.frameMonitorId = requestAnimationFrame(monitorFrame);
  }

  /**
   * Detect layout thrashing (interleaved reads and writes)
   */
  _detectLayoutThrashing() {
    const recentOps = this.metrics.domOperations.slice(-20);
    const recentAttrs = this.metrics.attributeChanges.slice(-20);

    let readCount = 0;
    let writeCount = 0;

    recentOps.forEach((op) => {
      if (['appendChild', 'insertBefore', 'removeChild'].includes(op.operation)) {
        writeCount++;
      }
    });

    recentAttrs.forEach((attr) => {
      if (attr.operation === 'setAttribute' && attr.isCritical) {
        writeCount++;
      }
    });

    if (readCount > 0 && writeCount > 0 && recentOps.length > 10) {
      this.metrics.layoutThrasher.push({
        timestamp: performance.now() - this.state.startTime,
        readCount,
        writeCount,
        totalOps: recentOps.length,
        severity: writeCount / recentOps.length,
      });
    }
  }

  /**
   * Capture memory snapshot
   */
  _captureMemorySnapshot() {
    if (!this.options.trackMemory || !performance.memory) return;

    this.metrics.memorySnapshots.push({
      timestamp: performance.now() - this.state.startTime,
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
    });

    if (this.metrics.memorySnapshots.length > this.options.maxSamples) {
      this.metrics.memorySnapshots.shift();
    }
  }

  /**
   * Capture baseline memory
   */
  _captureBaselineMemory() {
    if (performance.memory) {
      this._captureMemorySnapshot();
    }
  }

  /**
   * Stop frame monitoring
   */
  _stopFrameMonitoring() {
    if (this.state.frameMonitorId) {
      cancelAnimationFrame(this.state.frameMonitorId);
    }
  }

  /**
   * Cleanup all observers
   */
  _cleanupObservers() {
    Object.values(this.observers).forEach((observer) => {
      if (observer) {
        observer.disconnect();
      }
    });
  }

  /**
   * Cleanup all interceptors
   */
  _cleanupInterceptors() {
    // Note: Cannot fully restore intercepted methods, but flag is set
    this.interceptors.clear();
  }

  /**
   * Get comprehensive report
   */
  getReport() {
    const elapsed = performance.now() - this.state.startTime;

    return {
      summary: {
        totalDuration: elapsed,
        frameCount: this.state.frameCount,
        averageFrameTime: elapsed / Math.max(this.state.frameCount, 1),
      },
      domOperations: this._analyzeDOMOperations(),
      reflows: this._analyzeReflows(),
      repaints: this._analyzeRepaints(),
      eventHandlers: this._analyzeEventHandlers(),
      styleChanges: this._analyzeStyleChanges(),
      attributeChanges: this._analyzeAttributeChanges(),
      layoutThrashing: this._analyzeLayoutThrashing(),
      memory: this._analyzeMemory(),
      recommendations: this._generateRecommendations(),
    };
  }

  /**
   * Analyze DOM operations
   */
  _analyzeDOMOperations() {
    if (this.metrics.domOperations.length === 0) {
      return { count: 0, byType: {}, rate: 0 };
    }

    const byType = {};
    this.metrics.domOperations.forEach((op) => {
      byType[op.operation] = (byType[op.operation] || 0) + 1;
    });

    const duration = performance.now() - this.state.startTime;

    return {
      count: this.metrics.domOperations.length,
      byType,
      rate: this.metrics.domOperations.length / (duration / 1000),
      averageNodeCount: this._average(
        this.metrics.domOperations.map((op) => op.nodeCount || 0)
      ),
      peaks: this._getPeaks(
        this.metrics.domOperations.map((op) => op.timestamp)
      ),
    };
  }

  /**
   * Analyze reflows
   */
  _analyzeReflows() {
    if (this.metrics.reflows.length === 0) {
      return { count: 0, totalDuration: 0, exceeded: 0 };
    }

    const exceeded = this.metrics.reflows.filter((r) => r.exceeded).length;
    const totalDuration = this.metrics.reflows.reduce(
      (sum, r) => sum + (r.duration || 0),
      0
    );

    return {
      count: this.metrics.reflows.length,
      totalDuration,
      averageDuration: totalDuration / this.metrics.reflows.length,
      exceeded,
      exceedanceRate: (exceeded / this.metrics.reflows.length) * 100,
      slowestReflows: this.metrics.reflows
        .sort((a, b) => (b.duration || 0) - (a.duration || 0))
        .slice(0, 5),
    };
  }

  /**
   * Analyze repaints
   */
  _analyzeRepaints() {
    if (this.metrics.repaints.length === 0) {
      return { count: 0, totalDuration: 0, exceeded: 0 };
    }

    const exceeded = this.metrics.repaints.filter((r) => r.exceeded).length;
    const totalDuration = this.metrics.repaints.reduce(
      (sum, r) => sum + (r.duration || 0),
      0
    );

    return {
      count: this.metrics.repaints.length,
      totalDuration,
      averageDuration: totalDuration / this.metrics.repaints.length,
      exceeded,
      exceedanceRate: (exceeded / this.metrics.repaints.length) * 100,
    };
  }

  /**
   * Analyze event handlers
   */
  _analyzeEventHandlers() {
    if (this.metrics.eventHandlers.length === 0) {
      return { count: 0, byType: {}, slowestHandlers: [] };
    }

    const byType = {};
    this.metrics.eventHandlers.forEach((handler) => {
      if (!byType[handler.eventType]) {
        byType[handler.eventType] = { count: 0, totalDuration: 0, exceeded: 0 };
      }
      byType[handler.eventType].count++;
      byType[handler.eventType].totalDuration += handler.duration;
      if (handler.exceeded) byType[handler.eventType].exceeded++;
    });

    return {
      count: this.metrics.eventHandlers.length,
      byType,
      totalDuration: this.metrics.eventHandlers.reduce(
        (sum, h) => sum + h.duration,
        0
      ),
      slowestHandlers: this.metrics.eventHandlers
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 5),
    };
  }

  /**
   * Analyze style changes
   */
  _analyzeStyleChanges() {
    if (this.metrics.styleChanges.length === 0) {
      return { count: 0, byProperty: {} };
    }

    const byProperty = {};
    this.metrics.styleChanges.forEach((change) => {
      byProperty[change.property] = (byProperty[change.property] || 0) + 1;
    });

    return {
      count: this.metrics.styleChanges.length,
      byProperty,
    };
  }

  /**
   * Analyze attribute changes
   */
  _analyzeAttributeChanges() {
    if (this.metrics.attributeChanges.length === 0) {
      return { count: 0, byAttribute: {}, criticalChanges: 0 };
    }

    const byAttribute = {};
    let criticalChanges = 0;

    this.metrics.attributeChanges.forEach((change) => {
      byAttribute[change.attribute] = (byAttribute[change.attribute] || 0) + 1;
      if (change.isCritical) criticalChanges++;
    });

    return {
      count: this.metrics.attributeChanges.length,
      byAttribute,
      criticalChanges,
      criticalRate: (criticalChanges / this.metrics.attributeChanges.length) * 100,
    };
  }

  /**
   * Analyze layout thrashing
   */
  _analyzeLayoutThrashing() {
    if (this.metrics.layoutThrasher.length === 0) {
      return { detected: false, instances: 0, severity: 'none' };
    }

    const avgSeverity = this._average(
      this.metrics.layoutThrasher.map((t) => t.severity)
    );
    const severity =
      avgSeverity > 0.5 ? 'high' : avgSeverity > 0.3 ? 'medium' : 'low';

    return {
      detected: true,
      instances: this.metrics.layoutThrasher.length,
      averageSeverity: avgSeverity,
      severity,
      peaks: this.metrics.layoutThrasher.slice(0, 5),
    };
  }

  /**
   * Analyze memory usage
   */
  _analyzeMemory() {
    if (this.metrics.memorySnapshots.length === 0) {
      return { available: false };
    }

    const snapshots = this.metrics.memorySnapshots;
    const first = snapshots[0];
    const last = snapshots[snapshots.length - 1];

    const heapGrowth = last.usedJSHeapSize - first.usedJSHeapSize;
    const heapGrowthPercent = (heapGrowth / first.usedJSHeapSize) * 100;

    return {
      available: true,
      initial: first.usedJSHeapSize,
      final: last.usedJSHeapSize,
      heapGrowth,
      heapGrowthPercent,
      peak: Math.max(...snapshots.map((s) => s.usedJSHeapSize)),
      snapshots: snapshots.length,
    };
  }

  /**
   * Generate optimization recommendations
   */
  _generateRecommendations() {
    const recommendations = [];

    // DOM operations
    const domOps = this._analyzeDOMOperations();
    if (domOps.rate > 100) {
      recommendations.push({
        category: 'DOM Operations',
        priority: 'high',
        message:
          'High rate of DOM operations detected. Consider batching updates.',
        action: 'Use requestAnimationFrame to batch DOM changes',
      });
    }

    // Reflow analysis
    const reflows = this._analyzeReflows();
    if (reflows.exceedanceRate > 50) {
      recommendations.push({
        category: 'Reflow',
        priority: 'high',
        message: `${reflows.exceedanceRate.toFixed(0)}% of reflows exceed 16.67ms threshold`,
        action: 'Optimize layout calculations or defer non-critical updates',
      });
    }

    // Event handling
    const events = this._analyzeEventHandlers();
    if (events.count > 0) {
      const slowEvents = events.slowestHandlers.filter(
        (e) => e.duration > this.options.thresholds.eventHandler
      );
      if (slowEvents.length > 0) {
        recommendations.push({
          category: 'Event Handlers',
          priority: 'medium',
          message: `${slowEvents.length} event handlers exceed ${this.options.thresholds.eventHandler}ms`,
          action: 'Optimize event handler performance or use event delegation',
        });
      }
    }

    // Layout thrashing
    const thrashing = this._analyzeLayoutThrashing();
    if (thrashing.detected && thrashing.severity !== 'low') {
      recommendations.push({
        category: 'Layout Thrashing',
        priority: 'high',
        message: `${thrashing.severity.toUpperCase()} layout thrashing detected (${thrashing.instances} instances)`,
        action:
          'Separate DOM reads and writes using requestAnimationFrame or FastDOM pattern',
      });
    }

    // Attribute changes
    const attrs = this._analyzeAttributeChanges();
    if (attrs.criticalRate > 50) {
      recommendations.push({
        category: 'SVG Attributes',
        priority: 'medium',
        message: `${attrs.criticalRate.toFixed(0)}% of attribute changes are critical (d, transform, cx, cy, r)`,
        action: 'Consider using CSS transforms or CSS custom properties where possible',
      });
    }

    // Memory
    const memory = this._analyzeMemory();
    if (memory.available && memory.heapGrowthPercent > 50) {
      recommendations.push({
        category: 'Memory',
        priority: 'medium',
        message: `Memory usage increased by ${memory.heapGrowthPercent.toFixed(0)}%`,
        action: 'Check for memory leaks or accumulating references',
      });
    }

    return recommendations;
  }

  /**
   * Utility: Calculate average
   */
  _average(values) {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Utility: Get peak values with timestamps
   */
  _getPeaks(timestamps, windowSize = 100) {
    const peaks = [];
    for (let i = 0; i < timestamps.length; i += windowSize) {
      const window = timestamps.slice(i, i + windowSize);
      if (window.length > 0) {
        peaks.push(window.length);
      }
    }
    return peaks;
  }

  /**
   * Log message
   */
  log(message) {
    if (this.options.verbose) {
      console.log(message);
    }
  }

  /**
   * Export metrics as JSON
   */
  exportJSON() {
    return JSON.stringify(this.getReport(), null, 2);
  }

  /**
   * Export metrics as CSV
   */
  exportCSV() {
    const report = this.getReport();
    const lines = [];

    // Summary
    lines.push('Summary');
    lines.push(`Total Duration (ms),${report.summary.totalDuration}`);
    lines.push(`Frame Count,${report.summary.frameCount}`);
    lines.push(`Average Frame Time (ms),${report.summary.averageFrameTime}`);
    lines.push('');

    // DOM Operations
    lines.push('DOM Operations');
    lines.push(`Count,${report.domOperations.count}`);
    lines.push(`Rate (ops/sec),${report.domOperations.rate}`);
    lines.push('');

    // Reflows
    lines.push('Reflows');
    lines.push(`Count,${report.reflows.count}`);
    lines.push(`Total Duration (ms),${report.reflows.totalDuration}`);
    lines.push(`Exceeded Threshold,${report.reflows.exceeded}`);
    lines.push('');

    // Event Handlers
    lines.push('Event Handlers');
    lines.push(`Count,${report.eventHandlers.count}`);
    lines.push(`Total Duration (ms),${report.eventHandlers.totalDuration}`);
    lines.push('');

    // Recommendations
    lines.push('Recommendations');
    report.recommendations.forEach((rec) => {
      lines.push(`"${rec.priority.toUpperCase()}","${rec.category}","${rec.message}"`);
    });

    return lines.join('\n');
  }
}

// Export for use in both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SVGInspectorProfiler;
}
