/**
 * failure-learner.js
 *
 * Learns from task failures and builds recovery strategies.
 * Categorizes failures, stores patterns, and suggests recovery approaches.
 */

class FailureLearner {
  constructor() {
    // failure_type → recovery_strategy mapping
    this.strategies = new Map();

    // failure patterns with context
    this.patterns = [];

    // init standard failure categories
    this.initializeStrategies();
  }

  /**
   * Initialize known failure categories and their recovery strategies
   */
  initializeStrategies() {
    // Timeout failures
    this.strategies.set('timeout', {
      category: 'timeout',
      weight: 1,
      recoveries: [
        { order: 1, strategy: 'retry_with_increased_timeout', params: { multiplier: 1.5 } },
        { order: 2, strategy: 'retry_with_backoff', params: { base_delay: 1000, max_retries: 3 } },
        { order: 3, strategy: 'break_into_subtasks', params: { split_factor: 2 } },
        { order: 4, strategy: 'escalate_to_larger_model', params: { model: 'sonnet' } }
      ]
    });

    // Validation failures
    this.strategies.set('validation_failed', {
      category: 'validation_failed',
      weight: 2,
      recoveries: [
        { order: 1, strategy: 'inspect_validation_error', params: { verbose: true } },
        { order: 2, strategy: 'retry_with_schema_hints', params: { add_format_guidance: true } },
        { order: 3, strategy: 'simplify_input', params: { reduce_complexity: true } },
        { order: 4, strategy: 'use_structured_output', params: { enforce_schema: true } }
      ]
    });

    // Agent refusal
    this.strategies.set('agent_refusal', {
      category: 'agent_refusal',
      weight: 2,
      recoveries: [
        { order: 1, strategy: 'clarify_request', params: { explain_intent: true } },
        { order: 2, strategy: 'add_safety_context', params: { acknowledge_risk: true } },
        { order: 3, strategy: 'break_into_smaller_chunks', params: {} },
        { order: 4, strategy: 'try_alternative_agent', params: {} }
      ]
    });

    // Resource limit (tokens, rate limits, memory)
    this.strategies.set('resource_limit', {
      category: 'resource_limit',
      weight: 3,
      recoveries: [
        { order: 1, strategy: 'prune_context', params: { target_reduction: 0.3 } },
        { order: 2, strategy: 'switch_to_smaller_model', params: { model: 'haiku' } },
        { order: 3, strategy: 'batch_requests', params: { batch_size: 5 } },
        { order: 4, strategy: 'add_delay_between_requests', params: { delay_ms: 500 } }
      ]
    });

    // OAuth/Auth failures
    this.strategies.set('auth_failed', {
      category: 'auth_failed',
      weight: 2,
      recoveries: [
        { order: 1, strategy: 'try_simpler_approach', params: { skip_auth: true } },
        { order: 2, strategy: 'refresh_credentials', params: {} },
        { order: 3, strategy: 'fallback_to_unauthenticated', params: {} },
        { order: 4, strategy: 'prompt_user_for_auth', params: {} }
      ]
    });

    // Input validation / format errors
    this.strategies.set('format_error', {
      category: 'format_error',
      weight: 1,
      recoveries: [
        { order: 1, strategy: 'normalize_input', params: { strict: false } },
        { order: 2, strategy: 'retry_with_hints', params: { add_examples: true } },
        { order: 3, strategy: 'auto_detect_format', params: {} },
        { order: 4, strategy: 'request_user_clarification', params: {} }
      ]
    });

    // Tool not available / missing dependency
    this.strategies.set('tool_unavailable', {
      category: 'tool_unavailable',
      weight: 2,
      recoveries: [
        { order: 1, strategy: 'check_tool_availability', params: {} },
        { order: 2, strategy: 'try_alternative_tool', params: {} },
        { order: 3, strategy: 'manual_workaround', params: { require_user: true } },
        { order: 4, strategy: 'skip_step', params: {} }
      ]
    });
  }

  /**
   * Record a failure and extract patterns
   * @param {Object} failure - { type, message, context, timestamp, taskId }
   * @returns {Object} - { learned: bool, suggestions: Array }
   */
  recordFailure(failure) {
    const {
      type,
      message,
      context = {},
      timestamp = new Date(),
      taskId = null
    } = failure;

    if (!this.strategies.has(type)) {
      return { learned: false, suggestions: [], reason: `Unknown failure type: ${type}` };
    }

    const pattern = {
      type,
      message,
      context,
      timestamp,
      taskId,
      recoveryAttempts: 0,
      resolved: false
    };

    this.patterns.push(pattern);

    const strategy = this.strategies.get(type);
    const suggestions = this.buildSuggestions(type, message, context);

    return {
      learned: true,
      patternId: this.patterns.length - 1,
      failureType: type,
      suggestions,
      strategyOrder: strategy.recoveries.map(r => r.strategy)
    };
  }

  /**
   * Build recovery suggestions based on failure type and context
   * @private
   */
  buildSuggestions(failureType, message, context) {
    const strategy = this.strategies.get(failureType);
    if (!strategy) return [];

    return strategy.recoveries.map(recovery => ({
      strategy: recovery.strategy,
      order: recovery.order,
      params: recovery.params,
      rationale: this.getRationale(failureType, recovery.strategy, message)
    }));
  }

  /**
   * Generate human-readable rationale for recovery strategy
   * @private
   */
  getRationale(failureType, strategy, message) {
    const rationales = {
      timeout: {
        retry_with_increased_timeout: 'Task needs more time; extending deadline',
        retry_with_backoff: 'Transient timeout; backing off before retry',
        break_into_subtasks: 'Single task too large; splitting into smaller chunks',
        escalate_to_larger_model: 'Task complexity requires Sonnet-level reasoning'
      },
      validation_failed: {
        inspect_validation_error: 'Understanding validation constraints with verbose output',
        retry_with_schema_hints: 'Providing explicit format guidance to model',
        simplify_input: 'Reducing input complexity to meet constraints',
        use_structured_output: 'Enforcing strict schema compliance'
      },
      agent_refusal: {
        clarify_request: 'Explaining intent to overcome safety concerns',
        add_safety_context: 'Acknowledging risks to build agent confidence',
        break_into_smaller_chunks: 'Decomposing into acceptable subtasks',
        try_alternative_agent: 'Delegating to specialized agent with different constraints'
      },
      resource_limit: {
        prune_context: 'Reducing token consumption by trimming context',
        switch_to_smaller_model: 'Using Haiku to save tokens',
        batch_requests: 'Grouping requests to hit rate limits less often',
        add_delay_between_requests: 'Spacing out requests to respect rate limits'
      },
      auth_failed: {
        try_simpler_approach: 'Attempting unauthenticated path first',
        refresh_credentials: 'Refreshing potentially expired tokens',
        fallback_to_unauthenticated: 'Using public/guest endpoints',
        prompt_user_for_auth: 'Requesting fresh credentials from user'
      },
      format_error: {
        normalize_input: 'Standardizing input format (lenient mode)',
        retry_with_hints: 'Providing examples to guide formatting',
        auto_detect_format: 'Inferring expected format from error',
        request_user_clarification: 'Asking user to clarify format'
      },
      tool_unavailable: {
        check_tool_availability: 'Verifying tool is installed/configured',
        try_alternative_tool: 'Using equivalent tool',
        manual_workaround: 'Implementing workaround or manual process',
        skip_step: 'Proceeding without this tool'
      }
    };

    return (rationales[failureType]?.[strategy]) || 'Attempting recovery strategy';
  }

  /**
   * Get next recovery step for a pattern
   * @param {number} patternId - ID returned by recordFailure
   * @returns {Object} - { strategy, params, rationale } or null if exhausted
   */
  getNextRecovery(patternId) {
    const pattern = this.patterns[patternId];
    if (!pattern) return null;

    const strategy = this.strategies.get(pattern.type);
    if (!strategy) return null;

    const nextIndex = pattern.recoveryAttempts;
    if (nextIndex >= strategy.recoveries.length) {
      return null; // exhausted all strategies
    }

    const recovery = strategy.recoveries[nextIndex];
    pattern.recoveryAttempts++;

    return {
      strategy: recovery.strategy,
      params: recovery.params,
      rationale: this.getRationale(pattern.type, recovery.strategy, pattern.message),
      attemptNumber: pattern.recoveryAttempts,
      totalStrategies: strategy.recoveries.length
    };
  }

  /**
   * Mark a pattern as resolved
   */
  resolvePattern(patternId, resolution) {
    const pattern = this.patterns[patternId];
    if (pattern) {
      pattern.resolved = true;
      pattern.resolution = resolution;
    }
  }

  /**
   * Query similar past failures
   * @param {string} failureType
   * @returns {Array} - similar patterns with resolutions
   */
  getSimilarFailures(failureType) {
    return this.patterns
      .filter(p => p.type === failureType && p.resolved)
      .map(p => ({
        message: p.message,
        context: p.context,
        recoveryAttempts: p.recoveryAttempts,
        resolution: p.resolution,
        timestamp: p.timestamp
      }))
      .slice(-5); // return last 5
  }

  /**
   * Get failure statistics
   */
  getStats() {
    const stats = {
      totalFailures: this.patterns.length,
      resolved: this.patterns.filter(p => p.resolved).length,
      byType: {}
    };

    for (const [type, strategy] of this.strategies) {
      const failures = this.patterns.filter(p => p.type === type);
      stats.byType[type] = {
        total: failures.length,
        resolved: failures.filter(p => p.resolved).length,
        avgRecoveryAttempts: failures.length > 0
          ? failures.reduce((sum, p) => sum + p.recoveryAttempts, 0) / failures.length
          : 0
      };
    }

    return stats;
  }

  /**
   * Surface learned insights as a message
   */
  getSurfacedInsight(patternId) {
    const pattern = this.patterns[patternId];
    if (!pattern) return null;

    const similar = this.getSimilarFailures(pattern.type);
    if (similar.length === 0) {
      return `First encounter with ${pattern.type}. Attempting recovery.`;
    }

    const resolvedCount = similar.filter(s => s.resolution).length;
    if (resolvedCount > 0) {
      const mostEffective = this.getMostEffectiveStrategy(pattern.type);
      return `I've seen this ${pattern.type} fail ${similar.length} times. ` +
             `Successfully recovered ${resolvedCount} times. ` +
             `Suggesting ${mostEffective} first.`;
    }

    return `Pattern recognized: ${pattern.type}. ` +
           `Attempting known recovery strategies.`;
  }

  /**
   * Get most effective strategy for a failure type
   * @private
   */
  getMostEffectiveStrategy(failureType) {
    const patterns = this.getSimilarFailures(failureType);
    if (patterns.length === 0) return 'standard_recovery';

    // Return strategy used by fastest resolution
    const fastest = patterns.reduce((min, p) =>
      p.recoveryAttempts < min.recoveryAttempts ? p : min
    );

    const strategy = this.strategies.get(failureType);
    return strategy?.recoveries[fastest.recoveryAttempts - 1]?.strategy || 'standard_recovery';
  }

  /**
   * Export patterns and strategies for persistence
   */
  export() {
    return {
      patterns: this.patterns,
      strategies: Object.fromEntries(this.strategies)
    };
  }

  /**
   * Import patterns and strategies
   */
  import(data) {
    this.patterns = data.patterns || [];
    // Preserve initialized strategies, merge imported ones
    for (const [type, strategy] of Object.entries(data.strategies || {})) {
      this.strategies.set(type, strategy);
    }
  }
}

module.exports = FailureLearner;
