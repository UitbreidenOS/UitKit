/**
 * Memory System — Integration Example
 *
 * Demonstrates:
 * - Agent using memory to learn from past decisions
 * - Pattern storage and recall
 * - Preference persistence across sessions
 * - Decision history for debugging
 * - Multi-agent memory sharing
 */

const { MemorySystem, MEMORY_TYPES, ACCESS_LEVELS, RETENTION_POLICIES } = require('./memory-system')

/**
 * Example 1: Learning Agent with Memory
 */
class LearningAgent {
  constructor(agentId) {
    this.agentId = agentId
    this.memory = new MemorySystem({
      agentId,
      verbose: true,
      retentionPolicy: RETENTION_POLICIES.LONG_TERM
    })

    this.setupMemoryListeners()
  }

  setupMemoryListeners() {
    this.memory.on('stored', ({ id, type, tags }) => {
      console.log(`[${this.agentId}] Stored memory: ${type}`, tags)
    })

    this.memory.on('error', ({ type, error }) => {
      console.error(`[${this.agentId}] Memory error: ${type}`, error)
    })
  }

  /**
   * Learn a pattern from successful execution
   */
  async learnPattern(pattern) {
    const { description, rule, confidence, examples = [] } = pattern

    const memory = this.memory.storeMemory({
      type: MEMORY_TYPES.PATTERN,
      content: {
        rule,
        confidence,
        examples,
        applicableContexts: pattern.contexts || []
      },
      description,
      tags: ['learned', 'pattern', `confidence-${Math.floor(confidence * 10)}`],
      baseRelevance: confidence,
      metadata: {
        source: pattern.source || 'execution',
        domain: pattern.domain
      }
    })

    console.log(`Pattern learned: ${memory.id}`)
    return memory
  }

  /**
   * Recall applicable patterns for a task
   */
  async findApplicablePatterns(taskDescription, domain) {
    const patterns = this.memory.getByTags(['pattern', `domain-${domain}`], { limit: 5 })

    if (patterns.length === 0) {
      const searchResults = this.memory.searchByPattern(taskDescription, {
        type: MEMORY_TYPES.PATTERN,
        limit: 5
      })
      return searchResults.map(r => r.entry)
    }

    return patterns.map(p => p.entry)
  }

  /**
   * Log a decision for future analysis
   */
  async recordDecision(decision) {
    const {
      description,
      action,
      reasoning,
      alternatives = [],
      confidence,
      outcome = null
    } = decision

    const memory = this.memory.storeMemory({
      type: MEMORY_TYPES.DECISION,
      content: {
        action,
        reasoning,
        alternatives,
        confidence,
        outcome
      },
      description,
      tags: ['decision', `outcome-${outcome || 'pending'}`],
      baseRelevance: confidence,
      retentionDays: RETENTION_POLICIES.LONG_TERM,
      metadata: {
        timestamp: new Date().toISOString()
      }
    })

    console.log(`Decision recorded: ${memory.id}`)
    return memory
  }

  /**
   * Update decision with outcome
   */
  async recordOutcome(decisionId, outcome) {
    const memory = this.memory.recallById(decisionId)

    if (memory) {
      this.memory.updateMemory(decisionId, {
        content: {
          ...memory.content,
          outcome
        }
      })

      console.log(`Outcome recorded for ${decisionId}: ${outcome}`)
    }
  }

  /**
   * Store user preferences for consistency
   */
  async rememberPreference(preference) {
    const { key, value, category, ttlDays = 90 } = preference

    const memory = this.memory.storeMemory({
      type: MEMORY_TYPES.PREFERENCE,
      content: { key, value },
      description: `User preference: ${key}`,
      tags: ['preference', `category-${category}`],
      accessLevel: ACCESS_LEVELS.TEAM, // Share with team agents
      retentionDays: ttlDays,
      metadata: {
        category,
        userSet: true
      }
    })

    console.log(`Preference stored: ${key} = ${value}`)
    return memory
  }

  /**
   * Retrieve preferences
   */
  async getPreferences(category) {
    const prefs = this.memory.getByTags(['preference', `category-${category}`])

    return prefs.reduce((acc, p) => {
      acc[p.entry.content.key] = p.entry.content.value
      return acc
    }, {})
  }

  /**
   * Record common mistakes to avoid
   */
  async recordMistake(mistake) {
    const { description, whatHappened, whyItHappened, howToAvoid } = mistake

    const memory = this.memory.storeMemory({
      type: MEMORY_TYPES.MISTAKE,
      content: {
        whatHappened,
        whyItHappened,
        howToAvoid
      },
      description,
      tags: ['mistake', 'learning'],
      baseRelevance: 0.8,
      retentionDays: RETENTION_POLICIES.PERMANENT,
      metadata: {
        severity: 'high'
      }
    })

    console.log(`Mistake recorded: ${memory.id}`)
    return memory
  }

  /**
   * Search for similar mistakes
   */
  async searchForMistakes(description) {
    return this.memory.searchByPattern(description, {
      type: MEMORY_TYPES.MISTAKE,
      tags: ['mistake'],
      limit: 10
    })
  }

  /**
   * Get memory statistics
   */
  getMemoryReport() {
    const stats = this.memory.getStats()

    console.log(`\n=== Memory Report for ${this.agentId} ===`)
    console.log(`Total memories: ${stats.memoryCount}`)
    console.log(`Total recalled: ${stats.totalRecalled}`)
    console.log(`Cache hit rate: ${(stats.hitRate * 100).toFixed(2)}%`)
    console.log(`Avg relevance: ${stats.avgRelevanceScore.toFixed(3)}`)
    console.log(`Type distribution:`, stats.typeDistribution)
    console.log(`Total expired: ${stats.totalExpired}`)

    return stats
  }

  /**
   * Cleanup old memories
   */
  async cleanup() {
    const expiredIds = this.memory.cleanupExpired()
    console.log(`Cleaned up ${expiredIds.length} expired memories`)
    return expiredIds
  }

  /**
   * Export memory for backup/sharing
   */
  async exportMemory() {
    return this.memory.exportSnapshot({
      metadata: {
        agentId: this.agentId,
        exportedAt: new Date().toISOString()
      }
    })
  }

  /**
   * Import learned memories
   */
  async importMemory(snapshot) {
    const count = this.memory.importSnapshot(snapshot)
    console.log(`Imported ${count} memories`)
    return count
  }
}

/**
 * Example 2: Multi-Agent Collaboration with Shared Memory
 */
class MultiAgentMemoryHub {
  constructor() {
    this.agents = new Map()
    this.sharedMemory = new MemorySystem({
      agentId: 'hub',
      verbose: true
    })
  }

  /**
   * Register an agent
   */
  registerAgent(agentId) {
    const agent = new LearningAgent(agentId)
    this.agents.set(agentId, agent)
    return agent
  }

  /**
   * Share learning between agents
   */
  async propagateLearning(sourceAgentId, memoryId) {
    const sourceAgent = this.agents.get(sourceAgentId)
    const memory = sourceAgent.memory.recallById(memoryId)

    if (memory && memory.accessLevel === ACCESS_LEVELS.TEAM) {
      // Share with all other agents
      this.agents.forEach((agent, agentId) => {
        if (agentId !== sourceAgentId) {
          agent.memory.storeMemory({
            ...memory,
            description: `[${sourceAgentId}] ${memory.description}`,
            metadata: {
              ...memory.metadata,
              sharedBy: sourceAgentId
            }
          })
        }
      })

      console.log(`Learning propagated from ${sourceAgentId}`)
    }
  }

  /**
   * Aggregate statistics from all agents
   */
  getAggregateStats() {
    const stats = {
      totalAgents: this.agents.size,
      totalMemories: 0,
      totalRecalls: 0,
      typeDistribution: {},
      agentStats: {}
    }

    this.agents.forEach((agent, agentId) => {
      const agentStats = agent.memory.getStats()
      stats.totalMemories += agentStats.memoryCount
      stats.totalRecalls += agentStats.totalRecalled
      stats.agentStats[agentId] = agentStats

      // Aggregate type distribution
      Object.entries(agentStats.typeDistribution).forEach(([type, count]) => {
        stats.typeDistribution[type] = (stats.typeDistribution[type] || 0) + count
      })
    })

    return stats
  }
}

/**
 * Example 3: Decision Learning Loop
 */
class DecisionLearner {
  constructor(agentId) {
    this.agentId = agentId
    this.memory = new MemorySystem({ agentId })
    this.decisions = new Map()
  }

  /**
   * Make a decision and track it
   */
  async makeDecision(context) {
    const { problem, options, criteria } = context

    // Recall similar past decisions
    const similarDecisions = this.memory.searchByPattern(problem, {
      type: MEMORY_TYPES.DECISION,
      limit: 5
    })

    console.log(`Found ${similarDecisions.length} similar past decisions`)

    // Evaluate based on criteria
    let selectedOption = null
    let maxScore = -Infinity

    for (const option of options) {
      let score = 0

      // Factor in criteria
      for (const [criterion, weight] of Object.entries(criteria)) {
        if (option[criterion] !== undefined) {
          score += option[criterion] * weight
        }
      }

      // Factor in historical outcomes
      for (const { entry } of similarDecisions) {
        if (entry.content.outcome === 'success') {
          score += 0.1 * entry.relevance
        } else if (entry.content.outcome === 'failure') {
          score -= 0.1 * entry.relevance
        }
      }

      if (score > maxScore) {
        maxScore = score
        selectedOption = option
      }
    }

    // Record the decision
    const decisionId = `decision-${Date.now()}`
    const decision = {
      id: decisionId,
      problem,
      selectedOption: selectedOption.name,
      confidence: Math.min(1, (maxScore + 1) / 2), // Normalize to [0, 1]
      reasoning: `Selected based on ${Object.keys(criteria).join(', ')}`,
      timestamp: new Date().toISOString()
    }

    this.decisions.set(decisionId, decision)
    this.memory.storeMemory({
      type: MEMORY_TYPES.DECISION,
      content: decision,
      description: `Decision: ${problem} -> ${selectedOption.name}`,
      tags: ['decision', `status-pending`],
      baseRelevance: decision.confidence
    })

    console.log(`Decision made: ${selectedOption.name} (confidence: ${decision.confidence.toFixed(2)})`)
    return decisionId
  }

  /**
   * Track outcome of a decision
   */
  async recordDecisionOutcome(decisionId, outcome, feedback = '') {
    const decision = this.decisions.get(decisionId)

    if (decision) {
      decision.outcome = outcome
      decision.feedback = feedback
      decision.completedAt = new Date().toISOString()

      // Update memory
      const memories = this.memory.searchByPattern(decision.problem, {
        type: MEMORY_TYPES.DECISION
      })

      for (const { id } of memories) {
        if (id === decisionId) {
          this.memory.updateMemory(id, {
            content: {
              ...decision,
              outcome
            }
          })
          break
        }
      }

      console.log(`Decision outcome recorded: ${outcome}`)
    }
  }

  /**
   * Learn from outcomes
   */
  async extractLearnings() {
    const learnings = {
      successful: [],
      failed: [],
      patterns: []
    }

    const allDecisions = this.memory.getByType(MEMORY_TYPES.DECISION, { limit: 100 })

    for (const { entry } of allDecisions) {
      if (entry.content.outcome === 'success') {
        learnings.successful.push(entry.content)
      } else if (entry.content.outcome === 'failure') {
        learnings.failed.push(entry.content)
      }
    }

    // Extract patterns
    const successOptions = learnings.successful.map(d => d.selectedOption)
    const failureOptions = learnings.failed.map(d => d.selectedOption)

    const optionScores = {}
    successOptions.forEach(opt => {
      optionScores[opt] = (optionScores[opt] || 0) + 1
    })
    failureOptions.forEach(opt => {
      optionScores[opt] = (optionScores[opt] || 0) - 1
    })

    learnings.patterns = Object.entries(optionScores)
      .sort((a, b) => b[1] - a[1])
      .map(([option, score]) => ({
        option,
        score,
        successRate: learnings.successful.filter(d => d.selectedOption === option).length /
                     (learnings.successful.filter(d => d.selectedOption === option).length +
                      learnings.failed.filter(d => d.selectedOption === option).length || 1)
      }))

    return learnings
  }
}

/**
 * Example 4: Real-world demonstration
 */
async function demonstrateMemorySystem() {
  console.log('=== Memory System Integration Example ===\n')

  // Example 1: Single agent learning
  console.log('--- Example 1: Single Agent Learning ---')
  const agent = new LearningAgent('analyzer-agent')

  // Learn a pattern
  await agent.learnPattern({
    description: 'Error handling in async operations',
    rule: 'Always wrap async operations in try-catch for database calls',
    confidence: 0.92,
    domain: 'backend',
    contexts: ['database', 'async'],
    examples: [
      { situation: 'db query', solution: 'try-catch block' },
      { situation: 'api call', solution: 'catch promise rejection' }
    ]
  })

  // Record a decision
  await agent.recordDecision({
    description: 'Chose async-await over promises',
    action: 'Refactored callback-based code to async-await',
    reasoning: 'Better readability and error handling',
    confidence: 0.85,
    alternatives: ['Promises with .catch()', 'Event emitters']
  })

  // Remember preferences
  await agent.rememberPreference({
    key: 'errorHandling',
    value: 'try-catch',
    category: 'backend',
    ttlDays: 180
  })

  // Record a mistake
  await agent.recordMistake({
    description: 'Forgot to await async operation',
    whatHappened: 'Code continued execution before async task completed',
    whyItHappened: 'Missed await keyword in refactoring',
    howToAvoid: 'Use linter to catch missing awaits'
  })

  // Search for patterns
  const patterns = await agent.findApplicablePatterns(
    'How should I handle database errors?',
    'backend'
  )
  console.log(`Found ${patterns.length} applicable patterns`)

  // Get report
  agent.getMemoryReport()

  // Example 2: Multi-agent system
  console.log('\n--- Example 2: Multi-Agent System ---')
  const hub = new MultiAgentMemoryHub()

  const agent1 = hub.registerAgent('agent-1')
  const agent2 = hub.registerAgent('agent-2')

  await agent1.learnPattern({
    description: 'API pagination pattern',
    rule: 'Use offset-limit pagination for REST APIs',
    confidence: 0.88,
    domain: 'api'
  })

  // Propagate learning
  const memories = Array.from(agent1.memory.memory.keys())
  if (memories.length > 0) {
    await hub.propagateLearning('agent-1', memories[0])
  }

  const stats = hub.getAggregateStats()
  console.log('Aggregate stats:', stats)

  // Example 3: Decision learning
  console.log('\n--- Example 3: Decision Learning Loop ---')
  const learner = new DecisionLearner('decision-maker')

  const decisionId = await learner.makeDecision({
    problem: 'Choose database technology',
    options: [
      { name: 'PostgreSQL', performance: 0.9, scalability: 0.85 },
      { name: 'MongoDB', performance: 0.8, scalability: 0.95 },
      { name: 'Redis', performance: 0.98, scalability: 0.7 }
    ],
    criteria: {
      performance: 0.6,
      scalability: 0.4
    }
  })

  // Simulate outcome
  await learner.recordDecisionOutcome(decisionId, 'success', 'Good choice for our scale')

  const learnings = await learner.extractLearnings()
  console.log('Decision learnings:', learnings)
}

// Run demonstration if executed directly
if (require.main === module) {
  demonstrateMemorySystem().catch(console.error)
}

module.exports = {
  LearningAgent,
  MultiAgentMemoryHub,
  DecisionLearner,
  demonstrateMemorySystem
}
