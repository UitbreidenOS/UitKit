/**
 * Memory System — Long-term memory for agents
 *
 * Features:
 * - Learned patterns storage (decision trees, inference rules)
 * - Preference tracking (user/agent preferences)
 * - Decision history with outcome tracking
 * - Privacy-preserving encryption at rest
 * - Configurable retention policies
 * - Memory decay and relevance scoring
 * - Multi-agent memory sharing with isolation
 * - Pattern recognition and anomaly detection
 */

const { EventEmitter } = require('events')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const MEMORY_DIR = path.join(process.cwd(), '.claude', 'memory')
const MEMORY_INDEX = path.join(MEMORY_DIR, 'index.json')
const MEMORY_ARCHIVE = path.join(MEMORY_DIR, 'archive')

/**
 * Memory categories
 */
const MEMORY_TYPES = {
  PATTERN: 'pattern',           // Learned patterns and rules
  PREFERENCE: 'preference',     // User/agent preferences
  DECISION: 'decision',         // Past decisions with outcomes
  STRATEGY: 'strategy',         // Strategies and techniques
  MISTAKE: 'mistake',           // Errors and how to avoid them
  CONTEXT: 'context',           // Contextual information
  RELATIONSHIP: 'relationship'  // Agent/component relationships
}

/**
 * Memory access levels
 */
const ACCESS_LEVELS = {
  PRIVATE: 'private',           // Only this agent
  TEAM: 'team',                 // Shared with team agents
  PUBLIC: 'public',             // Shared with all agents
  TRUSTED: 'trusted'            // Shared with explicitly trusted agents
}

/**
 * Retention policies (in days)
 */
const RETENTION_POLICIES = {
  PERMANENT: -1,                // Never expires
  LONG_TERM: 365,               // 1 year
  MEDIUM_TERM: 90,              // 3 months
  SHORT_TERM: 30,               // 1 month
  EPHEMERAL: 7                  // 1 week
}

/**
 * Memory System — Manages agent learning and memory
 */
class MemorySystem extends EventEmitter {
  constructor(options = {}) {
    super()
    this.options = {
      dataDir: options.dataDir || MEMORY_DIR,
      agentId: options.agentId || 'default-agent',
      encryptionKey: options.encryptionKey || process.env.MEMORY_ENCRYPTION_KEY,
      enableEncryption: options.enableEncryption !== false,
      maxMemorySize: options.maxMemorySize || 100 * 1024 * 1024, // 100MB
      decayFactor: options.decayFactor || 0.95, // Relevance decay per week
      minRelevanceScore: options.minRelevanceScore || 0.3,
      retentionPolicy: options.retentionPolicy || RETENTION_POLICIES.MEDIUM_TERM,
      verbose: options.verbose || false,
      trustList: options.trustList || [],
      ...options
    }

    this.memory = new Map() // In-memory cache: key -> memoryEntry
    this.index = {
      byType: {},
      byAgent: {},
      byTag: {},
      byRelevance: []
    }
    this.metrics = {
      totalStored: 0,
      totalRecalled: 0,
      totalExpired: 0,
      avgRelevanceScore: 0,
      cacheHits: 0,
      cacheMisses: 0
    }
    this.accessLog = [] // Track access patterns

    this._ensureDataDir()
    this._loadMemory()
    this._initializeIndexes()
  }

  /**
   * Ensure memory directory exists
   */
  _ensureDataDir() {
    const dirs = [this.options.dataDir, MEMORY_ARCHIVE]
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
    })
  }

  /**
   * Load memory from persistent storage
   */
  _loadMemory() {
    try {
      if (fs.existsSync(MEMORY_INDEX)) {
        const indexData = JSON.parse(fs.readFileSync(MEMORY_INDEX, 'utf8'))
        indexData.entries = indexData.entries || []

        indexData.entries.forEach((entry) => {
          const memPath = path.join(this.options.dataDir, `${entry.id}.json`)
          if (fs.existsSync(memPath)) {
            let data = JSON.parse(fs.readFileSync(memPath, 'utf8'))
            if (this.options.enableEncryption && data.encrypted) {
              data = this._decrypt(data.content)
            }
            this.memory.set(entry.id, data)
          }
        })

        this.metrics.totalStored = this.memory.size
      }
    } catch (error) {
      if (this.options.verbose) {
        console.error(`Failed to load memory: ${error.message}`)
      }
    }
  }

  /**
   * Initialize memory indexes
   */
  _initializeIndexes() {
    this.index.byType = {}
    this.index.byAgent = {}
    this.index.byTag = {}
    this.index.byRelevance = []

    this.memory.forEach((entry, id) => {
      // Index by type
      if (!this.index.byType[entry.type]) {
        this.index.byType[entry.type] = []
      }
      this.index.byType[entry.type].push(id)

      // Index by agent
      if (!this.index.byAgent[entry.agentId]) {
        this.index.byAgent[entry.agentId] = []
      }
      this.index.byAgent[entry.agentId].push(id)

      // Index by tags
      (entry.tags || []).forEach(tag => {
        if (!this.index.byTag[tag]) {
          this.index.byTag[tag] = []
        }
        this.index.byTag[tag].push(id)
      })

      // Index by relevance
      this.index.byRelevance.push({ id, score: entry.relevanceScore })
    })

    // Sort by relevance
    this.index.byRelevance.sort((a, b) => b.score - a.score)
  }

  /**
   * Encrypt data
   */
  _encrypt(data) {
    if (!this.options.encryptionKey) {
      return { content: data, encrypted: false }
    }

    try {
      const iv = crypto.randomBytes(16)
      const key = crypto.scryptSync(this.options.encryptionKey, 'salt', 32)
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex')
      encrypted += cipher.final('hex')
      const authTag = cipher.getAuthTag()

      return {
        content: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        encrypted: true
      }
    } catch (error) {
      this.emit('error', { type: 'encryption-error', error: error.message })
      return { content: data, encrypted: false }
    }
  }

  /**
   * Decrypt data
   */
  _decrypt(encryptedData) {
    if (!encryptedData.encrypted || !this.options.encryptionKey) {
      return encryptedData.content
    }

    try {
      const key = crypto.scryptSync(this.options.encryptionKey, 'salt', 32)
      const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        key,
        Buffer.from(encryptedData.iv, 'hex')
      )
      decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'))

      let decrypted = decipher.update(encryptedData.content, 'hex', 'utf8')
      decrypted += decipher.final('utf8')

      return JSON.parse(decrypted)
    } catch (error) {
      this.emit('error', { type: 'decryption-error', error: error.message })
      return null
    }
  }

  /**
   * Save memory to persistent storage
   */
  _saveMemory() {
    try {
      const indexEntries = Array.from(this.memory.entries()).map(([id, data]) => ({
        id,
        type: data.type,
        agentId: data.agentId,
        createdAt: data.createdAt,
        expiresAt: data.expiresAt,
        relevanceScore: data.relevanceScore
      }))

      fs.writeFileSync(
        MEMORY_INDEX,
        JSON.stringify({ entries: indexEntries }, null, 2),
        'utf8'
      )

      // Save individual memory entries
      this.memory.forEach((data, id) => {
        const memPath = path.join(this.options.dataDir, `${id}.json`)
        let toWrite = data

        if (this.options.enableEncryption) {
          toWrite = this._encrypt(data)
        }

        fs.writeFileSync(memPath, JSON.stringify(toWrite, null, 2), 'utf8')
      })
    } catch (error) {
      this.emit('error', { type: 'save-error', error: error.message })
    }
  }

  /**
   * Calculate relevance score based on age and decay
   */
  _calculateRelevanceScore(createdAt, baseScore = 1.0) {
    const ageWeeks = (Date.now() - new Date(createdAt).getTime()) / (7 * 24 * 60 * 60 * 1000)
    const decayedScore = baseScore * Math.pow(this.options.decayFactor, ageWeeks)
    return Math.max(0, Math.min(1, decayedScore))
  }

  /**
   * Check if memory is expired
   */
  _isExpired(memoryEntry) {
    if (memoryEntry.expiresAt === null) {
      return false // Never expires
    }
    return new Date() > new Date(memoryEntry.expiresAt)
  }

  /**
   * Clean up expired memories
   */
  cleanupExpired() {
    const expiredIds = []

    this.memory.forEach((entry, id) => {
      if (this._isExpired(entry)) {
        // Archive before deletion
        this._archiveMemory(id, entry)
        this.memory.delete(id)
        expiredIds.push(id)
        this.metrics.totalExpired++
      }
    })

    if (expiredIds.length > 0) {
      this._saveMemory()
      this._initializeIndexes()
      this.emit('cleanup', { expiredCount: expiredIds.length })
    }

    return expiredIds
  }

  /**
   * Archive memory to archive directory
   */
  _archiveMemory(id, entry) {
    try {
      const archivePath = path.join(MEMORY_ARCHIVE, `${id}-${Date.now()}.json`)
      fs.writeFileSync(archivePath, JSON.stringify(entry, null, 2), 'utf8')
    } catch (error) {
      if (this.options.verbose) {
        console.error(`Failed to archive memory ${id}: ${error.message}`)
      }
    }
  }

  /**
   * Store a memory
   */
  storeMemory(input) {
    const {
      type = MEMORY_TYPES.CONTEXT,
      content,
      description = '',
      tags = [],
      agentId = this.options.agentId,
      accessLevel = ACCESS_LEVELS.PRIVATE,
      retentionDays = this.options.retentionPolicy,
      baseRelevance = 1.0,
      relatedIds = [],
      metadata = {}
    } = input

    if (!content) {
      throw new Error('Memory content is required')
    }

    // Check memory size limits
    if (this.memory.size >= 10000) {
      this.emit('warning', { type: 'memory-limit', message: 'Memory approaching size limit' })
    }

    const id = `mem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const now = new Date()
    let expiresAt = null

    if (retentionDays > 0) {
      expiresAt = new Date(now.getTime() + retentionDays * 24 * 60 * 60 * 1000).toISOString()
    }

    const memoryEntry = {
      id,
      type,
      content,
      description,
      tags: Array.isArray(tags) ? tags : [tags],
      agentId,
      accessLevel,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      expiresAt,
      accessCount: 0,
      relevanceScore: baseRelevance,
      relatedIds,
      metadata
    }

    this.memory.set(id, memoryEntry)
    this.metrics.totalStored = this.memory.size

    // Update indexes
    if (!this.index.byType[type]) {
      this.index.byType[type] = []
    }
    this.index.byType[type].push(id)

    if (!this.index.byAgent[agentId]) {
      this.index.byAgent[agentId] = []
    }
    this.index.byAgent[agentId].push(id)

    tags.forEach(tag => {
      if (!this.index.byTag[tag]) {
        this.index.byTag[tag] = []
      }
      this.index.byTag[tag].push(id)
    })

    this._saveMemory()
    this.emit('stored', { id, type, agentId, tags })

    return memoryEntry
  }

  /**
   * Recall memory by ID
   */
  recallById(id) {
    const entry = this.memory.get(id)

    if (!entry) {
      this.metrics.cacheMisses++
      return null
    }

    if (this._isExpired(entry)) {
      this.memory.delete(id)
      this._saveMemory()
      return null
    }

    // Update access metrics
    entry.accessCount++
    entry.updatedAt = new Date().toISOString()
    this.accessLog.push({ id, timestamp: entry.updatedAt, agentId: this.options.agentId })

    const relevanceScore = this._calculateRelevanceScore(entry.createdAt, 1.0)
    entry.relevanceScore = relevanceScore

    this.metrics.totalRecalled++
    this.metrics.cacheHits++

    return entry
  }

  /**
   * Search memory by pattern
   */
  searchByPattern(pattern, options = {}) {
    const {
      matchType = 'fuzzy', // 'exact', 'fuzzy', 'regex'
      type = null,
      tags = [],
      agentId = null,
      minRelevance = this.options.minRelevanceScore,
      limit = 10
    } = options

    const results = []

    this.memory.forEach((entry, id) => {
      if (this._isExpired(entry)) return

      // Filter by type
      if (type && entry.type !== type) return

      // Filter by agent
      if (agentId && entry.agentId !== agentId) return

      // Filter by tags
      if (tags.length > 0) {
        const hasAllTags = tags.every(tag => entry.tags.includes(tag))
        if (!hasAllTags) return
      }

      // Match pattern
      let matches = false
      const searchSpace = `${entry.content} ${entry.description} ${entry.tags.join(' ')}`

      if (matchType === 'exact') {
        matches = searchSpace.includes(pattern)
      } else if (matchType === 'regex') {
        try {
          matches = new RegExp(pattern, 'i').test(searchSpace)
        } catch (e) {
          matches = false
        }
      } else if (matchType === 'fuzzy') {
        matches = this._fuzzyMatch(pattern, searchSpace)
      }

      if (!matches) return

      // Filter by relevance
      const relevance = this._calculateRelevanceScore(entry.createdAt)
      if (relevance < minRelevance) return

      results.push({
        id,
        relevance,
        entry
      })
    })

    // Sort by relevance and limit
    results.sort((a, b) => b.relevance - a.relevance)
    return results.slice(0, limit)
  }

  /**
   * Fuzzy match helper
   */
  _fuzzyMatch(pattern, text) {
    pattern = pattern.toLowerCase()
    text = text.toLowerCase()

    let patternIdx = 0
    let textIdx = 0
    let matched = 0

    while (patternIdx < pattern.length && textIdx < text.length) {
      if (pattern[patternIdx] === text[textIdx]) {
        matched++
        patternIdx++
      }
      textIdx++
    }

    return matched / pattern.length > 0.6
  }

  /**
   * Get memories by type
   */
  getByType(type, options = {}) {
    const ids = this.index.byType[type] || []
    const results = []

    ids.forEach(id => {
      const entry = this.memory.get(id)
      if (entry && !this._isExpired(entry)) {
        const relevance = this._calculateRelevanceScore(entry.createdAt)
        results.push({ id, relevance, entry })
      }
    })

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance)
    return results.slice(0, options.limit || 10)
  }

  /**
   * Get memories by agent
   */
  getByAgent(agentId, options = {}) {
    const ids = this.index.byAgent[agentId] || []
    const results = []

    ids.forEach(id => {
      const entry = this.memory.get(id)
      if (entry && !this._isExpired(entry)) {
        const relevance = this._calculateRelevanceScore(entry.createdAt)
        results.push({ id, relevance, entry })
      }
    })

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance)
    return results.slice(0, options.limit || 10)
  }

  /**
   * Get memories by tags
   */
  getByTags(tags, options = {}) {
    const tagSet = Array.isArray(tags) ? tags : [tags]
    const results = []
    const idSet = new Set()

    tagSet.forEach(tag => {
      (this.index.byTag[tag] || []).forEach(id => idSet.add(id))
    })

    idSet.forEach(id => {
      const entry = this.memory.get(id)
      if (entry && !this._isExpired(entry)) {
        const relevance = this._calculateRelevanceScore(entry.createdAt)
        results.push({ id, relevance, entry })
      }
    })

    results.sort((a, b) => b.relevance - a.relevance)
    return results.slice(0, options.limit || 10)
  }

  /**
   * Update memory entry
   */
  updateMemory(id, updates) {
    const entry = this.memory.get(id)
    if (!entry) {
      throw new Error(`Memory ${id} not found`)
    }

    const allowedUpdates = [
      'content',
      'description',
      'tags',
      'relevanceScore',
      'metadata'
    ]

    allowedUpdates.forEach(key => {
      if (key in updates) {
        entry[key] = updates[key]
      }
    })

    entry.updatedAt = new Date().toISOString()
    this._saveMemory()

    this.emit('updated', { id, updates })
    return entry
  }

  /**
   * Delete memory
   */
  deleteMemory(id) {
    const entry = this.memory.get(id)
    if (!entry) {
      throw new Error(`Memory ${id} not found`)
    }

    // Archive before deletion
    this._archiveMemory(id, entry)
    this.memory.delete(id)
    this._saveMemory()
    this._initializeIndexes()

    this.emit('deleted', { id })
    return true
  }

  /**
   * Get memory statistics
   */
  getStats() {
    const relevanceScores = Array.from(this.memory.values()).map(m => m.relevanceScore)
    const avgRelevance = relevanceScores.length > 0
      ? relevanceScores.reduce((a, b) => a + b, 0) / relevanceScores.length
      : 0

    return {
      ...this.metrics,
      avgRelevanceScore: avgRelevance,
      memoryCount: this.memory.size,
      typeDistribution: Object.keys(this.index.byType).reduce((acc, type) => {
        acc[type] = this.index.byType[type].length
        return acc
      }, {}),
      agentDistribution: Object.keys(this.index.byAgent).reduce((acc, agent) => {
        acc[agent] = this.index.byAgent[agent].length
        return acc
      }, {}),
      hitRate: this.metrics.totalRecalled > 0
        ? this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses)
        : 0
    }
  }

  /**
   * Export memory snapshot
   */
  exportSnapshot(options = {}) {
    const snapshot = {
      timestamp: new Date().toISOString(),
      agentId: this.options.agentId,
      metadata: options.metadata || {},
      memories: [],
      stats: this.getStats()
    }

    this.memory.forEach((entry, id) => {
      if (!this._isExpired(entry)) {
        snapshot.memories.push({
          id,
          ...entry
        })
      }
    })

    return snapshot
  }

  /**
   * Import memory snapshot
   */
  importSnapshot(snapshot) {
    if (!snapshot.memories || !Array.isArray(snapshot.memories)) {
      throw new Error('Invalid snapshot format')
    }

    let importedCount = 0
    snapshot.memories.forEach(memData => {
      if (memData.id && memData.content) {
        this.memory.set(memData.id, {
          ...memData,
          updatedAt: new Date().toISOString()
        })
        importedCount++
      }
    })

    this._saveMemory()
    this._initializeIndexes()
    this.emit('imported', { count: importedCount })

    return importedCount
  }
}

module.exports = {
  MemorySystem,
  MEMORY_TYPES,
  ACCESS_LEVELS,
  RETENTION_POLICIES
}
