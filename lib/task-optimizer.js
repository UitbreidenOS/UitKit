/**
 * Task Optimizer - Adaptive task sequencing with ML-based task learning
 * Learns task success rates, durations, failure patterns
 * Reorders tasks by confidence, estimates completion time
 * Suggests alternative approaches based on historical failure data
 */

class TaskOptimizer {
  constructor(options = {}) {
    this.tasks = new Map();
    this.history = [];
    this.modelVersion = '1.0';
    this.config = {
      storageKey: options.storageKey || 'task-optimizer-data',
      confidenceThreshold: options.confidenceThreshold || 0.6,
      decayFactor: options.decayFactor || 0.95, // exponential decay for old data
      minSamples: options.minSamples || 3, // min attempts before confidence estimation
      ...options,
    };
    this.load();
  }

  /**
   * Register a task with initial metadata
   */
  registerTask(taskId, metadata = {}) {
    if (!this.tasks.has(taskId)) {
      this.tasks.set(taskId, {
        id: taskId,
        name: metadata.name || taskId,
        category: metadata.category || 'general',
        estimatedDuration: metadata.estimatedDuration || null,
        approaches: metadata.approaches || ['default'],
        attempts: 0,
        successes: 0,
        failures: 0,
        totalDuration: 0,
        lastAttempt: null,
        failurePatterns: [],
        createdAt: Date.now(),
        metadata,
      });
    }
    return this.tasks.get(taskId);
  }

  /**
   * Record task execution result
   */
  recordResult(taskId, result) {
    const task = this.registerTask(taskId);
    const record = {
      taskId,
      timestamp: Date.now(),
      success: result.success,
      duration: result.duration || 0,
      approach: result.approach || 'default',
      error: result.error || null,
      metadata: result.metadata || {},
    };

    this.history.push(record);
    task.attempts++;
    task.lastAttempt = Date.now();
    task.totalDuration += record.duration;

    if (result.success) {
      task.successes++;
    } else {
      task.failures++;
      if (result.error) {
        this._recordFailurePattern(taskId, result.error, result.approach);
      }
    }

    this.save();
    return record;
  }

  /**
   * Calculate confidence score for a task (0-1)
   * Based on: success rate, sample size, recency
   */
  calculateConfidenceScore(taskId) {
    const task = this.tasks.get(taskId);
    if (!task) return 0;

    if (task.attempts < this.config.minSamples) {
      return Math.min(0.3, task.attempts / this.config.minSamples);
    }

    const successRate = task.successes / task.attempts;
    const ageInDays = (Date.now() - task.lastAttempt) / (1000 * 60 * 60 * 24);
    const recencyDecay = Math.pow(this.config.decayFactor, ageInDays);

    return Math.max(0, Math.min(1, successRate * recencyDecay));
  }

  /**
   * Estimate duration for a task
   * Returns: { estimate, confidence, breakdown }
   */
  estimateDuration(taskId) {
    const task = this.tasks.get(taskId);
    if (!task || task.attempts === 0) {
      return {
        estimate: task?.estimatedDuration || null,
        confidence: 0,
        breakdown: { avgDuration: null, samples: 0 },
      };
    }

    const avgDuration = task.totalDuration / task.attempts;
    const confidence = Math.min(
      1,
      task.attempts / (this.config.minSamples * 2)
    );

    return {
      estimate: avgDuration,
      confidence,
      breakdown: {
        avgDuration,
        samples: task.attempts,
        total: task.totalDuration,
      },
    };
  }

  /**
   * Get all tasks ordered by confidence (descending)
   * Higher confidence = more likely to succeed, attempt first
   */
  getOptimalSequence(taskIds = null) {
    const tasks = taskIds
      ? taskIds.map(id => this.tasks.get(id)).filter(Boolean)
      : Array.from(this.tasks.values());

    return tasks
      .map(task => ({
        ...task,
        confidence: this.calculateConfidenceScore(task.id),
        durationEstimate: this.estimateDuration(task.id),
      }))
      .sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Estimate total completion time for remaining tasks
   */
  estimateCompletion(taskIds = null, parallelism = 1) {
    const sequence = this.getOptimalSequence(taskIds);

    if (sequence.length === 0) return null;

    const totalDuration = sequence.reduce(
      (sum, task) => sum + (task.durationEstimate.estimate || 0),
      0
    );

    const parallelDuration = Math.ceil(totalDuration / parallelism);
    const avgConfidence =
      sequence.reduce((sum, t) => sum + t.confidence, 0) / sequence.length;

    return {
      sequential: totalDuration,
      parallel: parallelDuration,
      parallelism,
      avgConfidence,
      taskCount: sequence.length,
      breakdown: sequence.map(t => ({
        id: t.id,
        name: t.name,
        duration: t.durationEstimate.estimate,
        confidence: t.confidence,
      })),
    };
  }

  /**
   * Suggest alternative approaches based on failure history
   * Returns array of { approach, reason, successRate } sorted by likelihood
   */
  suggestAlternativeApproach(taskId, currentApproach = 'default') {
    const task = this.tasks.get(taskId);
    if (!task || task.approaches.length <= 1) {
      return [];
    }

    const approachStats = new Map();

    // Aggregate stats per approach
    this.history
      .filter(record => record.taskId === taskId)
      .forEach(record => {
        const approach = record.approach || 'default';
        if (!approachStats.has(approach)) {
          approachStats.set(approach, {
            approach,
            attempts: 0,
            successes: 0,
            failures: 0,
            durations: [],
          });
        }

        const stats = approachStats.get(approach);
        stats.attempts++;
        if (record.success) {
          stats.successes++;
        } else {
          stats.failures++;
        }
        stats.durations.push(record.duration);
      });

    // Calculate metrics and filter
    return Array.from(approachStats.values())
      .filter(stat => stat.approach !== currentApproach && stat.attempts >= 2)
      .map(stat => ({
        approach: stat.approach,
        successRate: stat.successes / stat.attempts,
        avgDuration: stat.durations.reduce((a, b) => a + b, 0) / stat.durations.length,
        attempts: stat.attempts,
        confidence: Math.min(1, stat.attempts / (this.config.minSamples * 2)),
        reason: this._generateSuggestionReason(
          taskId,
          currentApproach,
          stat.approach,
          stat
        ),
      }))
      .sort((a, b) => b.successRate - a.successRate);
  }

  /**
   * Get failure patterns for a task
   */
  getFailurePatterns(taskId) {
    const task = this.tasks.get(taskId);
    if (!task) return [];

    return task.failurePatterns.sort((a, b) => b.count - a.count);
  }

  /**
   * Get detailed task analytics
   */
  getTaskAnalytics(taskId) {
    const task = this.tasks.get(taskId);
    if (!task) return null;

    const taskHistory = this.history.filter(r => r.taskId === taskId);
    const recentAttempts = taskHistory.slice(-10);
    const successRate = task.successes / (task.attempts || 1);

    return {
      taskId,
      name: task.name,
      category: task.category,
      statistics: {
        totalAttempts: task.attempts,
        successes: task.successes,
        failures: task.failures,
        successRate,
        avgDuration: task.totalDuration / (task.attempts || 1),
        lastAttempt: task.lastAttempt,
      },
      confidence: this.calculateConfidenceScore(taskId),
      durationEstimate: this.estimateDuration(taskId),
      failurePatterns: this.getFailurePatterns(taskId),
      recentAttempts: recentAttempts.map(r => ({
        timestamp: r.timestamp,
        success: r.success,
        duration: r.duration,
        approach: r.approach,
        error: r.error,
      })),
      suggestedApproaches: this.suggestAlternativeApproach(taskId),
    };
  }

  /**
   * Predict likelihood of success for a task
   */
  predictSuccess(taskId, context = {}) {
    const task = this.tasks.get(taskId);
    if (!task || task.attempts === 0) {
      return { prediction: 0.5, factors: {} };
    }

    const baseSuccessRate = task.successes / task.attempts;
    const confidence = this.calculateConfidenceScore(taskId);
    const recentPerformance = this._getRecentPerformance(taskId);
    const categoryPerformance = this._getCategoryPerformance(task.category);

    const factors = {
      baseSuccessRate: baseSuccessRate * 0.4,
      recentPerformance: recentPerformance * 0.3,
      categoryPerformance: categoryPerformance * 0.15,
      confidence: confidence * 0.15,
    };

    const prediction = Object.values(factors).reduce((a, b) => a + b, 0);

    return { prediction: Math.min(1, prediction), factors };
  }

  /**
   * Export model for analysis/versioning
   */
  exportModel() {
    return {
      version: this.modelVersion,
      exportedAt: Date.now(),
      config: this.config,
      tasks: Array.from(this.tasks.values()),
      historySize: this.history.length,
      historySnapshot: this.history.slice(-100), // last 100 records
    };
  }

  /**
   * Persist data to storage
   */
  save() {
    try {
      const data = {
        tasks: Array.from(this.tasks.entries()),
        history: this.history,
        modelVersion: this.modelVersion,
      };
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.config.storageKey, JSON.stringify(data));
      }
    } catch (e) {
      console.warn('TaskOptimizer: Failed to save data', e);
    }
  }

  /**
   * Load data from storage
   */
  load() {
    try {
      if (typeof localStorage === 'undefined') return;
      const data = JSON.parse(localStorage.getItem(this.config.storageKey));
      if (!data) return;

      this.tasks = new Map(data.tasks || []);
      this.history = data.history || [];
      this.modelVersion = data.modelVersion || '1.0';
    } catch (e) {
      console.warn('TaskOptimizer: Failed to load data', e);
    }
  }

  /**
   * Reset all data
   */
  reset() {
    this.tasks.clear();
    this.history = [];
    this.save();
  }

  // Private helpers

  _recordFailurePattern(taskId, error, approach) {
    const task = this.tasks.get(taskId);
    const pattern = task.failurePatterns.find(p => p.error === error && p.approach === approach);

    if (pattern) {
      pattern.count++;
      pattern.lastOccurrence = Date.now();
    } else {
      task.failurePatterns.push({
        error,
        approach,
        count: 1,
        firstOccurrence: Date.now(),
        lastOccurrence: Date.now(),
      });
    }
  }

  _getRecentPerformance(taskId, lookback = 5) {
    const recent = this.history
      .filter(r => r.taskId === taskId)
      .slice(-lookback);

    if (recent.length === 0) return 0.5;
    return recent.filter(r => r.success).length / recent.length;
  }

  _getCategoryPerformance(category) {
    const categoryTasks = Array.from(this.tasks.values()).filter(
      t => t.category === category
    );

    if (categoryTasks.length === 0) return 0.5;

    const totalSuccesses = categoryTasks.reduce((sum, t) => sum + t.successes, 0);
    const totalAttempts = categoryTasks.reduce((sum, t) => sum + t.attempts, 0);

    return totalAttempts === 0 ? 0.5 : totalSuccesses / totalAttempts;
  }

  _generateSuggestionReason(taskId, currentApproach, suggestedApproach, stats) {
    const task = this.tasks.get(taskId);
    const currentStats = this._getApproachStats(taskId, currentApproach);
    const improvement = stats.successes / stats.attempts - (currentStats?.successRate || 0);

    if (improvement > 0.2) {
      return `${suggestedApproach} has ${(improvement * 100).toFixed(0)}% higher success rate`;
    } else if (stats.durations.length > 0) {
      const currentAvg = currentStats?.avgDuration || Infinity;
      const suggestedAvg = stats.durations.reduce((a, b) => a + b, 0) / stats.durations.length;
      if (suggestedAvg < currentAvg) {
        return `${suggestedApproach} is ${((currentAvg - suggestedAvg) / currentAvg * 100).toFixed(0)}% faster`;
      }
    }

    return `${suggestedApproach} has ${(stats.successes / stats.attempts * 100).toFixed(0)}% success rate`;
  }

  _getApproachStats(taskId, approach) {
    const records = this.history.filter(
      r => r.taskId === taskId && r.approach === approach
    );

    if (records.length === 0) return null;

    const successes = records.filter(r => r.success).length;
    return {
      successRate: successes / records.length,
      avgDuration: records.reduce((sum, r) => sum + r.duration, 0) / records.length,
      attempts: records.length,
    };
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TaskOptimizer;
}
if (typeof exports !== 'undefined') {
  exports.TaskOptimizer = TaskOptimizer;
}
