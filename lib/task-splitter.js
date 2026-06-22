/**
 * Task Splitter — Break complex tasks into independent sub-tasks
 *
 * Capabilities:
 * - Analyze task complexity and estimate execution time
 * - Suggest splits for large tasks (>30min ETA)
 * - Auto-split and retry on failure
 * - Identify and execute independent sub-tasks in parallel
 */

const EventEmitter = require('events')

/**
 * TaskSplitter — Main orchestrator for task decomposition and parallel execution
 */
class TaskSplitter extends EventEmitter {
  constructor(options = {}) {
    super()
    this.timeoutMs = options.timeoutMs || 30 * 60 * 1000 // 30 min default
    this.maxRetries = options.maxRetries || 3
    this.concurrency = options.concurrency || 4
    this.verbose = options.verbose || false
  }

  /**
   * Analyze task complexity based on heuristics
   * Returns: { complexity: 'low'|'medium'|'high', estimatedMinutes: number, reason: string }
   */
  analyzeTask(task) {
    let minutes = 0
    let factors = []

    // Heuristics for time estimation
    if (task.description) {
      const desc = task.description.toLowerCase()

      // Check for complexity indicators
      if (desc.match(/\b(parallel|concurrent|async|streaming)\b/i)) {
        minutes += 15
        factors.push('concurrent operations')
      }
      if (desc.match(/\b(network|http|api|request|fetch)\b/i)) {
        minutes += 10
        factors.push('network I/O')
      }
      if (desc.match(/\b(database|db|query|transaction)\b/i)) {
        minutes += 8
        factors.push('database operations')
      }
      if (desc.match(/\b(file|disk|storage|read|write)\b/i)) {
        minutes += 5
        factors.push('disk I/O')
      }
      if (desc.match(/\b(transform|convert|encode|parse)\b/i)) {
        minutes += 3
        factors.push('data transformation')
      }
      if (desc.match(/\b(test|validate|verify|check)\b/i)) {
        minutes += 5
        factors.push('validation/testing')
      }
      if (desc.match(/\b(error|retry|recovery|fallback)\b/i)) {
        minutes += 4
        factors.push('error handling')
      }

      // Scale by description length (longer = more complex)
      if (desc.length > 500) {
        minutes += 10
        factors.push('large task scope')
      }
    }

    // Size estimation
    if (task.subtasks && Array.isArray(task.subtasks)) {
      minutes += task.subtasks.length * 2
      factors.push(`${task.subtasks.length} sub-tasks`)
    }

    if (task.files && Array.isArray(task.files) && task.files.length > 10) {
      minutes += 5
      factors.push(`${task.files.length} files`)
    }

    // Default minimum
    if (minutes === 0) {
      minutes = 1
      factors.push('simple task')
    }

    const complexity =
      minutes > 30 ? 'high' : minutes > 15 ? 'medium' : 'low'

    return {
      complexity,
      estimatedMinutes: minutes,
      reason: factors.join(', '),
    }
  }

  /**
   * Suggest splits for large tasks
   * Returns: { shouldSplit: boolean, suggestions: string[], rationale: string }
   */
  suggestSplits(task) {
    const analysis = this.analyzeTask(task)
    const shouldSplit = analysis.estimatedMinutes > 30

    const suggestions = []
    const desc = (task.description || '').toLowerCase()

    if (!shouldSplit) {
      return { shouldSplit: false, suggestions: [], rationale: 'Task is small enough (<30min)' }
    }

    // Pattern-based split suggestions
    if (desc.match(/\b(multiple|several|many)\b/i)) {
      suggestions.push('Split by item: create one sub-task per item')
    }

    if (desc.match(/\b(and|plus|also)\b/i)) {
      suggestions.push('Split by operation: separate each logical operation')
    }

    if (desc.match(/\b(first|then|next|after)\b/i)) {
      suggestions.push('Split by sequence: create staged sub-tasks with dependencies')
    }

    if (desc.match(/\b(for each|for all|every)\b/i)) {
      suggestions.push('Split by batch: process in smaller groups')
    }

    if (desc.match(/\b(different|various|mixed)\b/i)) {
      suggestions.push('Split by type: group similar items together')
    }

    if (task.subtasks && Array.isArray(task.subtasks) && task.subtasks.length > 5) {
      suggestions.push(
        `Batch sub-tasks: group ${task.subtasks.length} tasks into ${Math.ceil(task.subtasks.length / 5)} batches`
      )
    }

    if (!suggestions.length) {
      suggestions.push('Review task scope and consider breaking into logical phases')
    }

    return {
      shouldSplit: true,
      suggestions,
      rationale: `Task estimated at ${analysis.estimatedMinutes}min (threshold: 30min). Factors: ${analysis.reason}`,
    }
}

  /**
   * Auto-split task into sub-tasks
   * Returns: { subtasks: Task[], strategy: string, parallelizable: number }
   */
  autoSplit(task) {
    const strategy = this._inferStrategy(task)
    const subtasks = []

    switch (strategy) {
      case 'items':
        subtasks.push(
          ...this._splitByItems(task)
        )
        break
      case 'batch':
        subtasks.push(
          ...this._splitByBatch(task)
        )
        break
      case 'sequence':
        subtasks.push(
          ...this._splitBySequence(task)
        )
        break
      case 'type':
        subtasks.push(
          ...this._splitByType(task)
        )
        break
      default:
        subtasks.push(
          ...this._splitBySubtasks(task)
        )
    }

    const parallelizable = this._countParallelizable(subtasks)

    return { subtasks, strategy, parallelizable }
  }

  /**
   * Execute task with auto-retry on failure
   * Splits and retries failed components independently
   * Returns: { success: boolean, results: any[], failures: Error[], retried: number }
   */
  async executeWithRetry(task, executor) {
    this._log(`Executing task: ${task.id || task.name}`)

    const analysis = this.analyzeTask(task)
    this._log(`Analysis: ${analysis.complexity} complexity, ~${analysis.estimatedMinutes}min`)

    try {
      // First attempt: try as-is
      const result = await Promise.race([
        executor(task),
        this._timeout(this.timeoutMs),
      ])
      this._log(`Task completed successfully`)
      return { success: true, results: [result], failures: [], retried: 0 }
    } catch (err) {
      this._log(`Task failed: ${err.message}`)
      return this._retryWithSplit(task, executor, 0)
    }
  }

  /**
   * Execute independent sub-tasks in parallel
   * Returns: { completed: number, failed: number, results: Map<taskId, any> }
   */
  async executeParallel(subtasks, executor) {
    this._log(`Executing ${subtasks.length} tasks in parallel (concurrency: ${this.concurrency})`)

    const results = new Map()
    const queue = [...subtasks]
    const active = new Set()
    const failures = []

    while (queue.length > 0 || active.size > 0) {
      // Fill concurrency slots
      while (active.size < this.concurrency && queue.length > 0) {
        const task = queue.shift()
        const promise = this._executeTask(task, executor)
          .then(result => {
            active.delete(promise)
            results.set(task.id || task.name, result)
            this._log(`✓ Completed: ${task.id || task.name}`)
            return result
          })
          .catch(err => {
            active.delete(promise)
            failures.push({ task: task.id || task.name, error: err })
            this._log(`✗ Failed: ${task.id || task.name} — ${err.message}`)
            return null
          })

        active.add(promise)
      }

      // Wait for at least one to complete
      if (active.size > 0) {
        await Promise.race(active)
      }
    }

    return {
      completed: results.size - failures.length,
      failed: failures.length,
      results,
      failures,
    }
  }

  /**
   * Identify independent sub-tasks (can run in parallel)
   * Returns: { independent: Task[], dependent: Task[], graph: Map }
   */
  analyzeDependencies(tasks) {
    const graph = new Map()
    const independent = []
    const dependent = []

    // Build dependency graph
    for (const task of tasks) {
      const deps = this._extractDependencies(task)
      graph.set(task.id || task.name, { task, deps })

      if (deps.length === 0) {
        independent.push(task)
      } else {
        dependent.push(task)
      }
    }

    return { independent, dependent, graph }
  }

  // ═════════════════════════════════════════════════════════════════
  // Private helpers
  // ═════════════════════════════════════════════════════════════════

  _inferStrategy(task) {
    const desc = (task.description || '').toLowerCase()

    if (task.subtasks && Array.isArray(task.subtasks)) {
      return 'subtasks'
    }
    if (desc.match(/\b(each|every|for all)\b/i)) {
      return 'items'
    }
    if (desc.match(/\b(first|then|next|after|order)\b/i)) {
      return 'sequence'
    }
    if (desc.match(/\b(type|kind|category|group)\b/i)) {
      return 'type'
    }
    return 'batch'
  }

  _splitByItems(task) {
    // Extract items from description (e.g., "Process A, B, C")
    const pattern = /(?:process|handle|create|update|delete)\s+([A-Z0-9]+(?:\s*,\s*[A-Z0-9]+)*)/i
    const match = task.description?.match(pattern)

    if (match && match[1]) {
      const items = match[1].split(',').map(s => s.trim())
      return items.map((item, idx) => ({
        id: `${task.id}-item-${idx}`,
        name: `${task.name} - ${item}`,
        description: task.description.replace(/[A-Z0-9]+/g, item),
        parent: task.id,
      }))
    }
    return [task]
  }

  _splitByBatch(task) {
    if (!task.subtasks || !Array.isArray(task.subtasks)) {
      return [task]
    }

    const batchSize = Math.ceil(task.subtasks.length / Math.ceil(task.subtasks.length / 5))
    const batches = []

    for (let i = 0; i < task.subtasks.length; i += batchSize) {
      const batch = task.subtasks.slice(i, i + batchSize)
      batches.push({
        id: `${task.id}-batch-${batches.length}`,
        name: `${task.name} - Batch ${batches.length + 1}/${Math.ceil(task.subtasks.length / batchSize)}`,
        subtasks: batch,
        parent: task.id,
      })
    }

    return batches
  }

  _splitBySequence(task) {
    if (!task.subtasks || !Array.isArray(task.subtasks)) {
      return [task]
    }

    return task.subtasks.map((st, idx) => ({
      ...st,
      id: `${task.id}-step-${idx}`,
      name: `${task.name} - Step ${idx + 1}`,
      parent: task.id,
      order: idx,
    }))
  }

  _splitByType(task) {
    if (!task.subtasks || !Array.isArray(task.subtasks)) {
      return [task]
    }

    const byType = new Map()
    for (const st of task.subtasks) {
      const type = st.type || 'default'
      if (!byType.has(type)) byType.set(type, [])
      byType.get(type).push(st)
    }

    const result = []
    for (const [type, items] of byType.entries()) {
      result.push({
        id: `${task.id}-type-${type}`,
        name: `${task.name} - ${type}`,
        type,
        subtasks: items,
        parent: task.id,
      })
    }

    return result
  }

  _splitBySubtasks(task) {
    if (!task.subtasks || !Array.isArray(task.subtasks)) {
      return [task]
    }

    return task.subtasks.map((st, idx) => ({
      ...st,
      id: st.id || `${task.id}-sub-${idx}`,
      parent: task.id,
    }))
  }

  _countParallelizable(tasks) {
    let count = 0
    for (const task of tasks) {
      if (!task.dependencies || task.dependencies.length === 0) {
        count++
      }
    }
    return count
  }

  async _retryWithSplit(task, executor, attempt) {
    if (attempt >= this.maxRetries) {
      return { success: false, results: [], failures: [new Error(`Max retries exceeded`)], retried: attempt }
    }

    this._log(`Retry ${attempt + 1}/${this.maxRetries}: splitting task...`)

    const split = this.autoSplit(task)
    this._log(`Split into ${split.subtasks.length} sub-tasks (${split.parallelizable} parallelizable)`)

    const execution = await this.executeParallel(split.subtasks, executor)

    if (execution.failed === 0) {
      return {
        success: true,
        results: Array.from(execution.results.values()),
        failures: [],
        retried: attempt + 1,
      }
    }

    // Retry failed tasks individually
    for (const failure of execution.failures) {
      this._log(`Retrying failed: ${failure.task}`)
      try {
        const result = await Promise.race([
          executor(failure.task),
          this._timeout(this.timeoutMs),
        ])
        execution.results.set(failure.task, result)
        execution.failed--
      } catch (err) {
        this._log(`Retry failed: ${err.message}`)
      }
    }

    return {
      success: execution.failed === 0,
      results: Array.from(execution.results.values()),
      failures: execution.failures,
      retried: attempt + 1,
    }
  }

  async _executeTask(task, executor) {
    return Promise.race([
      executor(task),
      this._timeout(this.timeoutMs),
    ])
  }

  _timeout(ms) {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    )
  }

  _extractDependencies(task) {
    if (task.dependencies && Array.isArray(task.dependencies)) {
      return task.dependencies
    }
    if (task.dependsOn && Array.isArray(task.dependsOn)) {
      return task.dependsOn
    }
    if (task.order !== undefined && task.order > 0) {
      return [`order-${task.order - 1}`]
    }
    return []
  }

  _log(msg) {
    if (this.verbose) {
      console.log(`[TaskSplitter] ${msg}`)
    }
    this.emit('log', msg)
  }
}

// Export
module.exports = { TaskSplitter }
