/**
 * Memory System — Test Suite
 */

const { MemorySystem, MEMORY_TYPES, ACCESS_LEVELS, RETENTION_POLICIES } = require('./memory-system')
const path = require('path')
const fs = require('fs')
const os = require('os')

// Test helpers
const tempDir = path.join(os.tmpdir(), `memory-test-${Date.now()}`)

function setupTest() {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }
  return tempDir
}

function cleanupTest() {
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
}

// Tests
describe('MemorySystem', () => {
  let memory

  beforeEach(() => {
    setupTest()
    memory = new MemorySystem({
      dataDir: path.join(tempDir, '.claude', 'memory'),
      agentId: 'test-agent',
      verbose: false
    })
  })

  afterEach(() => {
    cleanupTest()
  })

  describe('Initialization', () => {
    test('should create memory system with default options', () => {
      expect(memory).toBeDefined()
      expect(memory.options.agentId).toBe('test-agent')
      expect(memory.memory).toBeInstanceOf(Map)
      expect(memory.metrics).toBeDefined()
    })

    test('should create necessary directories', () => {
      const memDir = path.join(tempDir, '.claude', 'memory')
      expect(fs.existsSync(memDir)).toBe(true)
    })

    test('should initialize with custom options', () => {
      const custom = new MemorySystem({
        dataDir: tempDir,
        agentId: 'custom-agent',
        maxMemorySize: 50 * 1024 * 1024,
        retentionPolicy: RETENTION_POLICIES.LONG_TERM
      })

      expect(custom.options.agentId).toBe('custom-agent')
      expect(custom.options.maxMemorySize).toBe(50 * 1024 * 1024)
      expect(custom.options.retentionPolicy).toBe(RETENTION_POLICIES.LONG_TERM)
    })
  })

  describe('Store Memory', () => {
    test('should store memory successfully', () => {
      const result = memory.storeMemory({
        type: MEMORY_TYPES.PATTERN,
        content: { rule: 'if X then Y', confidence: 0.95 },
        description: 'Test pattern rule',
        tags: ['learning', 'patterns'],
        agentId: 'test-agent'
      })

      expect(result).toBeDefined()
      expect(result.id).toMatch(/^mem-/)
      expect(result.content.rule).toBe('if X then Y')
      expect(result.tags).toContain('learning')
      expect(result.tags).toContain('patterns')
    })

    test('should require content', () => {
      expect(() => {
        memory.storeMemory({
          type: MEMORY_TYPES.PATTERN,
          description: 'Missing content'
        })
      }).toThrow('Memory content is required')
    })

    test('should set expiration based on retention policy', () => {
      const result = memory.storeMemory({
        type: MEMORY_TYPES.PREFERENCE,
        content: { theme: 'dark' },
        retentionDays: 7
      })

      expect(result.expiresAt).toBeDefined()
      const expiresDate = new Date(result.expiresAt)
      const createdDate = new Date(result.createdAt)
      const daysDiff = (expiresDate - createdDate) / (1000 * 60 * 60 * 24)
      expect(daysDiff).toBeCloseTo(7, 0)
    })

    test('should never expire with PERMANENT retention', () => {
      const result = memory.storeMemory({
        type: MEMORY_TYPES.STRATEGY,
        content: { importance: 'critical' },
        retentionDays: RETENTION_POLICIES.PERMANENT
      })

      expect(result.expiresAt).toBeNull()
    })

    test('should handle multiple tags', () => {
      const result = memory.storeMemory({
        type: MEMORY_TYPES.DECISION,
        content: { decision: 'test' },
        tags: ['urgent', 'critical', 'prod']
      })

      expect(result.tags).toContain('urgent')
      expect(result.tags).toContain('critical')
      expect(result.tags).toContain('prod')
    })

    test('should set default values', () => {
      const result = memory.storeMemory({
        content: { test: true }
      })

      expect(result.type).toBe(MEMORY_TYPES.CONTEXT)
      expect(result.accessLevel).toBe(ACCESS_LEVELS.PRIVATE)
      expect(result.accessCount).toBe(0)
      expect(result.relevanceScore).toBe(1.0)
    })
  })

  describe('Recall Memory', () => {
    test('should recall memory by ID', () => {
      const stored = memory.storeMemory({
        content: { data: 'test' },
        description: 'Test memory'
      })

      const recalled = memory.recallById(stored.id)

      expect(recalled).toBeDefined()
      expect(recalled.id).toBe(stored.id)
      expect(recalled.content.data).toBe('test')
    })

    test('should return null for non-existent memory', () => {
      const result = memory.recallById('non-existent-id')
      expect(result).toBeNull()
    })

    test('should update access count on recall', () => {
      const stored = memory.storeMemory({
        content: { data: 'test' }
      })

      const before = stored.accessCount
      memory.recallById(stored.id)
      const after = memory.memory.get(stored.id).accessCount

      expect(after).toBe(before + 1)
    })

    test('should track recall metrics', () => {
      memory.storeMemory({ content: { data: '1' } })
      memory.storeMemory({ content: { data: '2' } })

      const ids = Array.from(memory.memory.keys())
      memory.recallById(ids[0])
      memory.recallById(ids[1])
      memory.recallById('invalid')

      expect(memory.metrics.totalRecalled).toBe(2)
      expect(memory.metrics.cacheHits).toBe(2)
      expect(memory.metrics.cacheMisses).toBe(1)
    })
  })

  describe('Search by Pattern', () => {
    beforeEach(() => {
      memory.storeMemory({
        content: 'Pattern matching is important',
        type: MEMORY_TYPES.PATTERN,
        tags: ['search', 'test']
      })

      memory.storeMemory({
        content: 'Different content for testing',
        type: MEMORY_TYPES.DECISION,
        tags: ['search']
      })

      memory.storeMemory({
        content: 'Another pattern example',
        type: MEMORY_TYPES.PATTERN,
        tags: ['pattern', 'example']
      })
    })

    test('should search with exact match', () => {
      const results = memory.searchByPattern('Pattern', {
        matchType: 'exact'
      })

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].entry.content).toContain('Pattern')
    })

    test('should search with fuzzy match', () => {
      const results = memory.searchByPattern('patern', {
        matchType: 'fuzzy'
      })

      expect(results.length).toBeGreaterThan(0)
    })

    test('should filter search results by type', () => {
      const results = memory.searchByPattern('Pattern', {
        type: MEMORY_TYPES.PATTERN
      })

      expect(results.every(r => r.entry.type === MEMORY_TYPES.PATTERN)).toBe(true)
    })

    test('should filter search results by tags', () => {
      const results = memory.searchByPattern('', {
        tags: ['pattern', 'example']
      })

      expect(results.length).toBe(1)
      expect(results[0].entry.tags).toContain('pattern')
    })

    test('should respect limit in search results', () => {
      const results = memory.searchByPattern('test', {
        limit: 1
      })

      expect(results.length).toBeLessThanOrEqual(1)
    })

    test('should sort results by relevance', () => {
      const results = memory.searchByPattern('Pattern', {
        limit: 10
      })

      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].relevance).toBeGreaterThanOrEqual(results[i + 1].relevance)
      }
    })
  })

  describe('Get by Type', () => {
    beforeEach(() => {
      for (let i = 0; i < 3; i++) {
        memory.storeMemory({
          type: MEMORY_TYPES.PATTERN,
          content: { data: `pattern-${i}` }
        })
      }

      for (let i = 0; i < 2; i++) {
        memory.storeMemory({
          type: MEMORY_TYPES.DECISION,
          content: { data: `decision-${i}` }
        })
      }
    })

    test('should retrieve all memories of a type', () => {
      const results = memory.getByType(MEMORY_TYPES.PATTERN)

      expect(results.length).toBe(3)
      expect(results.every(r => r.entry.type === MEMORY_TYPES.PATTERN)).toBe(true)
    })

    test('should respect limit in getByType', () => {
      const results = memory.getByType(MEMORY_TYPES.PATTERN, { limit: 2 })

      expect(results.length).toBe(2)
    })

    test('should exclude expired memories', () => {
      const stored = memory.storeMemory({
        type: MEMORY_TYPES.PATTERN,
        content: { expired: true },
        retentionDays: -1 // Already expired
      })

      // Manually set as expired
      const entry = memory.memory.get(stored.id)
      entry.expiresAt = new Date(Date.now() - 1000).toISOString()

      const results = memory.getByType(MEMORY_TYPES.PATTERN)

      expect(results.every(r => r.id !== stored.id)).toBe(true)
    })
  })

  describe('Get by Agent', () => {
    beforeEach(() => {
      memory.storeMemory({
        content: { data: 'agent1' },
        agentId: 'agent-1'
      })

      memory.storeMemory({
        content: { data: 'agent2' },
        agentId: 'agent-2'
      })

      memory.storeMemory({
        content: { data: 'agent1-2' },
        agentId: 'agent-1'
      })
    })

    test('should retrieve memories by agent', () => {
      const results = memory.getByAgent('agent-1')

      expect(results.length).toBe(2)
      expect(results.every(r => r.entry.agentId === 'agent-1')).toBe(true)
    })

    test('should return empty for unknown agent', () => {
      const results = memory.getByAgent('unknown-agent')

      expect(results).toEqual([])
    })
  })

  describe('Get by Tags', () => {
    beforeEach(() => {
      memory.storeMemory({
        content: { data: '1' },
        tags: ['urgent', 'bug']
      })

      memory.storeMemory({
        content: { data: '2' },
        tags: ['urgent', 'feature']
      })

      memory.storeMemory({
        content: { data: '3' },
        tags: ['feature']
      })
    })

    test('should retrieve memories by single tag', () => {
      const results = memory.getByTags('urgent')

      expect(results.length).toBe(2)
      expect(results.every(r => r.entry.tags.includes('urgent'))).toBe(true)
    })

    test('should retrieve memories by multiple tags', () => {
      const results = memory.getByTags(['urgent', 'bug'])

      expect(results.length).toBe(1)
      expect(results[0].entry.tags).toContain('bug')
    })

    test('should return empty for unknown tag', () => {
      const results = memory.getByTags('unknown-tag')

      expect(results).toEqual([])
    })
  })

  describe('Update Memory', () => {
    test('should update memory content', () => {
      const stored = memory.storeMemory({
        content: { old: 'value' },
        description: 'Original description'
      })

      const updated = memory.updateMemory(stored.id, {
        content: { new: 'value' }
      })

      expect(updated.content.new).toBe('value')
    })

    test('should update memory tags', () => {
      const stored = memory.storeMemory({
        content: { data: 'test' },
        tags: ['old']
      })

      const updated = memory.updateMemory(stored.id, {
        tags: ['new', 'updated']
      })

      expect(updated.tags).toContain('new')
    })

    test('should update relevance score', () => {
      const stored = memory.storeMemory({
        content: { data: 'test' }
      })

      const updated = memory.updateMemory(stored.id, {
        relevanceScore: 0.5
      })

      expect(updated.relevanceScore).toBe(0.5)
    })

    test('should throw for non-existent memory', () => {
      expect(() => {
        memory.updateMemory('invalid-id', { content: { new: 'data' } })
      }).toThrow()
    })

    test('should update timestamp on modification', () => {
      const stored = memory.storeMemory({
        content: { data: 'test' }
      })

      const originalTime = stored.updatedAt
      memory.updateMemory(stored.id, { content: { new: 'data' } })
      const updated = memory.memory.get(stored.id)

      expect(new Date(updated.updatedAt) > new Date(originalTime)).toBe(true)
    })
  })

  describe('Delete Memory', () => {
    test('should delete memory', () => {
      const stored = memory.storeMemory({
        content: { data: 'test' }
      })

      const result = memory.deleteMemory(stored.id)

      expect(result).toBe(true)
      expect(memory.memory.has(stored.id)).toBe(false)
    })

    test('should throw for non-existent memory', () => {
      expect(() => {
        memory.deleteMemory('invalid-id')
      }).toThrow()
    })

    test('should archive before deletion', () => {
      const stored = memory.storeMemory({
        content: { data: 'test' }
      })

      memory.deleteMemory(stored.id)

      const archiveDir = path.join(memory.options.dataDir, '..', 'archive')
      const files = fs.readdirSync(archiveDir)

      expect(files.length).toBeGreaterThan(0)
    })
  })

  describe('Cleanup Expired', () => {
    test('should remove expired memories', () => {
      const stored = memory.storeMemory({
        content: { data: 'test' },
        retentionDays: RETENTION_POLICIES.EPHEMERAL
      })

      // Manually expire
      const entry = memory.memory.get(stored.id)
      entry.expiresAt = new Date(Date.now() - 1000).toISOString()

      const expiredIds = memory.cleanupExpired()

      expect(expiredIds).toContain(stored.id)
      expect(memory.memory.has(stored.id)).toBe(false)
    })

    test('should not remove permanent memories', () => {
      const stored = memory.storeMemory({
        content: { data: 'permanent' },
        retentionDays: RETENTION_POLICIES.PERMANENT
      })

      memory.cleanupExpired()

      expect(memory.memory.has(stored.id)).toBe(true)
    })

    test('should update metrics on cleanup', () => {
      const stored = memory.storeMemory({
        content: { data: 'test' },
        retentionDays: 1
      })

      // Manually expire
      const entry = memory.memory.get(stored.id)
      entry.expiresAt = new Date(Date.now() - 1000).toISOString()

      const beforeCount = memory.metrics.totalExpired
      memory.cleanupExpired()

      expect(memory.metrics.totalExpired).toBeGreaterThan(beforeCount)
    })
  })

  describe('Statistics', () => {
    beforeEach(() => {
      for (let i = 0; i < 3; i++) {
        memory.storeMemory({
          type: MEMORY_TYPES.PATTERN,
          content: { data: i },
          tags: ['stat-test']
        })
      }

      for (let i = 0; i < 2; i++) {
        memory.storeMemory({
          type: MEMORY_TYPES.DECISION,
          content: { data: i }
        })
      }
    })

    test('should calculate statistics', () => {
      const stats = memory.getStats()

      expect(stats.memoryCount).toBe(5)
      expect(stats.totalStored).toBe(5)
      expect(stats.typeDistribution[MEMORY_TYPES.PATTERN]).toBe(3)
      expect(stats.typeDistribution[MEMORY_TYPES.DECISION]).toBe(2)
    })

    test('should track agent distribution', () => {
      memory.storeMemory({
        content: { data: 'agent-specific' },
        agentId: 'agent-2'
      })

      const stats = memory.getStats()

      expect(stats.agentDistribution['test-agent']).toBeGreaterThan(0)
      expect(stats.agentDistribution['agent-2']).toBe(1)
    })

    test('should calculate hit rate', () => {
      const ids = Array.from(memory.memory.keys())
      memory.recallById(ids[0])
      memory.recallById(ids[0])
      memory.recallById('invalid')

      const stats = memory.getStats()

      expect(stats.hitRate).toBeCloseTo(0.67, 1)
    })
  })

  describe('Export/Import', () => {
    test('should export memory snapshot', () => {
      memory.storeMemory({
        content: { data: '1' },
        type: MEMORY_TYPES.PATTERN,
        tags: ['export-test']
      })

      const snapshot = memory.exportSnapshot()

      expect(snapshot.timestamp).toBeDefined()
      expect(snapshot.agentId).toBe('test-agent')
      expect(snapshot.memories).toBeDefined()
      expect(snapshot.memories.length).toBeGreaterThan(0)
      expect(snapshot.stats).toBeDefined()
    })

    test('should import memory snapshot', () => {
      memory.storeMemory({
        content: { data: 'before' }
      })

      const snapshot = memory.exportSnapshot()
      const newMemory = new MemorySystem({
        dataDir: path.join(tempDir, 'new', '.claude', 'memory')
      })

      const imported = newMemory.importSnapshot(snapshot)

      expect(imported).toBeGreaterThan(0)
      expect(newMemory.memory.size).toBe(imported)
    })

    test('should handle custom metadata in export', () => {
      const snapshot = memory.exportSnapshot({
        metadata: { version: '1.0', exported: true }
      })

      expect(snapshot.metadata.version).toBe('1.0')
      expect(snapshot.metadata.exported).toBe(true)
    })
  })

  describe('Events', () => {
    test('should emit stored event', (done) => {
      memory.on('stored', ({ id, type }) => {
        expect(id).toMatch(/^mem-/)
        expect(type).toBe(MEMORY_TYPES.PATTERN)
        done()
      })

      memory.storeMemory({
        type: MEMORY_TYPES.PATTERN,
        content: { data: 'test' }
      })
    })

    test('should emit updated event', (done) => {
      const stored = memory.storeMemory({
        content: { data: 'test' }
      })

      memory.on('updated', ({ id }) => {
        expect(id).toBe(stored.id)
        done()
      })

      memory.updateMemory(stored.id, { content: { new: 'data' } })
    })

    test('should emit deleted event', (done) => {
      const stored = memory.storeMemory({
        content: { data: 'test' }
      })

      memory.on('deleted', ({ id }) => {
        expect(id).toBe(stored.id)
        done()
      })

      memory.deleteMemory(stored.id)
    })

    test('should emit cleanup event', (done) => {
      const stored = memory.storeMemory({
        content: { data: 'test' },
        retentionDays: 1
      })

      const entry = memory.memory.get(stored.id)
      entry.expiresAt = new Date(Date.now() - 1000).toISOString()

      memory.on('cleanup', ({ expiredCount }) => {
        expect(expiredCount).toBeGreaterThan(0)
        done()
      })

      memory.cleanupExpired()
    })
  })

  describe('Relevance Decay', () => {
    test('should decay relevance score over time', () => {
      const stored = memory.storeMemory({
        content: { data: 'test' }
      })

      const entry = memory.memory.get(stored.id)
      entry.createdAt = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week ago

      const currentRelevance = memory._calculateRelevanceScore(entry.createdAt)

      expect(currentRelevance).toBeLessThan(1.0)
      expect(currentRelevance).toBeGreaterThan(0)
    })

    test('should filter by minimum relevance', () => {
      for (let i = 0; i < 3; i++) {
        const entry = memory.storeMemory({
          content: { data: `old-${i}` }
        })

        const mem = memory.memory.get(entry.id)
        mem.createdAt = new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString()
      }

      const results = memory.searchByPattern('old', {
        minRelevance: 0.7,
        limit: 10
      })

      expect(results.every(r => r.relevance >= 0.7)).toBe(true)
    })
  })

  describe('Persistence', () => {
    test('should persist and reload memory', () => {
      memory.storeMemory({
        content: { data: 'persist-test' },
        tags: ['persistent'],
        type: MEMORY_TYPES.STRATEGY
      })

      memory._saveMemory()

      const newMemory = new MemorySystem({
        dataDir: memory.options.dataDir,
        agentId: 'test-agent'
      })

      expect(newMemory.memory.size).toBeGreaterThan(0)
      const loaded = Array.from(newMemory.memory.values())[0]
      expect(loaded.content.data).toBe('persist-test')
      expect(loaded.tags).toContain('persistent')
    })
  })
})
