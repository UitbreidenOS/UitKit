# Memory System — Long-Term Memory for Agents

Persistent memory system for Claude Code agents to learn patterns, track decisions, store preferences, and maintain context across sessions.

## Features

- **Learned Patterns**: Store decision trees, inference rules, and successful strategies
- **Preference Tracking**: Remember user/agent settings for consistency
- **Decision History**: Track decisions with outcomes for debugging and learning
- **Privacy-Preserving**: Optional encryption at rest, granular access controls
- **Configurable Retention**: Set expiration policies for different memory types
- **Memory Decay**: Relevance scores decrease over time (configurable)
- **Multi-Agent Sharing**: Selective memory sharing with access levels
- **Pattern Recognition**: Search with fuzzy matching, regex, exact match
- **Anomaly Detection**: Identify unusual patterns in decision history
- **Persistent Storage**: JSONL-based archiving with automatic cleanup

## Installation

```bash
npm install @claudient/memory-system
```

Or require directly:

```javascript
const { MemorySystem, MEMORY_TYPES, ACCESS_LEVELS, RETENTION_POLICIES } = require('./lib/memory-system')
```

## Quick Start

### Basic Setup

```javascript
const { MemorySystem, MEMORY_TYPES } = require('./lib/memory-system')

// Create a memory system for an agent
const memory = new MemorySystem({
  agentId: 'my-agent',
  enableEncryption: true,
  encryptionKey: process.env.MEMORY_ENCRYPTION_KEY
})

// Store a memory
const pattern = memory.storeMemory({
  type: MEMORY_TYPES.PATTERN,
  content: { rule: 'if X then Y', confidence: 0.95 },
  description: 'A learned pattern',
  tags: ['learning', 'high-confidence']
})

// Recall it
const recalled = memory.recallById(pattern.id)

// Search for similar memories
const results = memory.searchByPattern('pattern', {
  matchType: 'fuzzy',
  type: MEMORY_TYPES.PATTERN,
  limit: 10
})

console.log(memory.getStats())
```

## Memory Types

### PATTERN
Learned patterns and inference rules from successful executions.

```javascript
memory.storeMemory({
  type: MEMORY_TYPES.PATTERN,
  content: {
    rule: 'Always validate input before processing',
    applicableContexts: ['user-input', 'api-params'],
    examples: [{ situation: 'form data', solution: 'schema validation' }]
  },
  tags: ['validation', 'security'],
  baseRelevance: 0.9
})
```

### PREFERENCE
User or agent preferences for consistent behavior.

```javascript
memory.storeMemory({
  type: MEMORY_TYPES.PREFERENCE,
  content: { theme: 'dark', language: 'en' },
  accessLevel: ACCESS_LEVELS.TEAM,  // Share with team
  retentionDays: RETENTION_POLICIES.LONG_TERM
})
```

### DECISION
Past decisions with outcomes for learning and debugging.

```javascript
memory.storeMemory({
  type: MEMORY_TYPES.DECISION,
  content: {
    action: 'Deploy to staging',
    reasoning: 'Ready for QA testing',
    confidence: 0.85,
    outcome: 'success'
  },
  tags: ['deployment', `outcome-success`]
})
```

### STRATEGY
High-level strategies and techniques proven to work.

```javascript
memory.storeMemory({
  type: MEMORY_TYPES.STRATEGY,
  content: {
    name: 'Incremental Rollout',
    steps: ['Deploy to 10%', 'Monitor metrics', 'Increase to 50%', ...],
    successRate: 0.98
  }
})
```

### MISTAKE
Errors and how to avoid them.

```javascript
memory.storeMemory({
  type: MEMORY_TYPES.MISTAKE,
  content: {
    whatHappened: 'Race condition in cache invalidation',
    whyItHappened: 'Missing lock on shared resource',
    howToAvoid: 'Use distributed locking mechanism'
  },
  retentionDays: RETENTION_POLICIES.PERMANENT
})
```

### CONTEXT
Contextual information about domains, systems, or environments.

```javascript
memory.storeMemory({
  type: MEMORY_TYPES.CONTEXT,
  content: {
    domain: 'payment-processing',
    riskLevel: 'critical',
    slackChannel: '#payments'
  }
})
```

### RELATIONSHIP
Agent and component relationships and dependencies.

```javascript
memory.storeMemory({
  type: MEMORY_TYPES.RELATIONSHIP,
  content: {
    relatedAgents: ['payment-processor', 'fraud-detector'],
    dependencies: ['redis', 'postgres'],
    communicationProtocol: 'gRPC'
  }
})
```

## Access Levels

Control who can access shared memories:

```javascript
// Only this agent can access
memory.storeMemory({
  accessLevel: ACCESS_LEVELS.PRIVATE,
  content: { sensitive: 'data' }
})

// Share with team agents
memory.storeMemory({
  accessLevel: ACCESS_LEVELS.TEAM,
  content: { team: 'pattern' }
})

// Share with explicitly trusted agents
memory.storeMemory({
  accessLevel: ACCESS_LEVELS.TRUSTED,
  content: { data: 'shared' }
})

// Public to all agents
memory.storeMemory({
  accessLevel: ACCESS_LEVELS.PUBLIC,
  content: { public: 'knowledge' }
})
```

## Retention Policies

Configure automatic expiration:

```javascript
const { RETENTION_POLICIES } = require('./lib/memory-system')

// Never expires
memory.storeMemory({
  retentionDays: RETENTION_POLICIES.PERMANENT,  // -1
  content: { critical: 'knowledge' }
})

// 1 year
memory.storeMemory({
  retentionDays: RETENTION_POLICIES.LONG_TERM,  // 365
  content: { strategies: [] }
})

// 3 months
memory.storeMemory({
  retentionDays: RETENTION_POLICIES.MEDIUM_TERM,  // 90
  content: { decisions: [] }
})

// 1 month
memory.storeMemory({
  retentionDays: RETENTION_POLICIES.SHORT_TERM,  // 30
  content: { ephemeral: 'data' }
})

// 1 week
memory.storeMemory({
  retentionDays: RETENTION_POLICIES.EPHEMERAL,  // 7
  content: { temporary: 'cache' }
})

// Custom
memory.storeMemory({
  retentionDays: 180,  // 6 months
  content: { custom: 'ttl' }
})
```

## Search and Retrieval

### Search by Pattern

```javascript
// Exact match
const results = memory.searchByPattern('error handling', {
  matchType: 'exact'
})

// Fuzzy match (forgiving of typos)
const results = memory.searchByPattern('patern', {
  matchType: 'fuzzy'
})

// Regex match
const results = memory.searchByPattern('error|warning|fail', {
  matchType: 'regex'
})

// Combined filters
const results = memory.searchByPattern('deployment', {
  type: MEMORY_TYPES.DECISION,
  tags: ['production', 'critical'],
  minRelevance: 0.7,
  limit: 20
})
```

### Get by Type

```javascript
const patterns = memory.getByType(MEMORY_TYPES.PATTERN, { limit: 10 })
const decisions = memory.getByType(MEMORY_TYPES.DECISION)
```

### Get by Agent

```javascript
const agentMemories = memory.getByAgent('analyzer-agent', { limit: 5 })
```

### Get by Tags

```javascript
const urgent = memory.getByTags('urgent', { limit: 20 })
const multiple = memory.getByTags(['production', 'critical'])
```

### Recall by ID

```javascript
const memory = memory.recallById(memoryId)
if (memory) {
  console.log(memory.content)
}
```

## Memory Decay and Relevance

Memories become less relevant over time:

```javascript
// Relevance decay factor (default: 0.95 per week)
const memory = new MemorySystem({
  decayFactor: 0.95
})

// Search with minimum relevance threshold
const recent = memory.searchByPattern('test', {
  minRelevance: 0.8  // Only highly relevant results
})
```

## Update and Delete

```javascript
// Update content
memory.updateMemory(memoryId, {
  content: { updated: 'data' },
  tags: ['new-tag'],
  relevanceScore: 0.5
})

// Delete (archives before deletion)
memory.deleteMemory(memoryId)
```

## Cleanup and Maintenance

```javascript
// Remove expired memories
const expiredIds = memory.cleanupExpired()
console.log(`Removed ${expiredIds.length} expired memories`)

// Force cleanup periodically (e.g., daily)
setInterval(() => {
  memory.cleanupExpired()
}, 24 * 60 * 60 * 1000)
```

## Statistics and Monitoring

```javascript
const stats = memory.getStats()

console.log(stats)
// {
//   memoryCount: 150,
//   totalStored: 1500,
//   totalRecalled: 5000,
//   totalExpired: 200,
//   avgRelevanceScore: 0.72,
//   cacheHits: 4950,
//   cacheMisses: 50,
//   hitRate: 0.99,
//   typeDistribution: {
//     pattern: 45,
//     decision: 62,
//     preference: 30,
//     ...
//   },
//   agentDistribution: {
//     'agent-1': 80,
//     'agent-2': 70
//   }
// }
```

## Export and Import

Share or backup memories:

```javascript
// Export snapshot
const snapshot = memory.exportSnapshot({
  metadata: {
    version: '1.0',
    domain: 'backend'
  }
})

// Save to file
fs.writeFileSync('memory-backup.json', JSON.stringify(snapshot, null, 2))

// Import from snapshot
const count = memory.importSnapshot(snapshot)
console.log(`Imported ${count} memories`)
```

## Events

Listen to memory operations:

```javascript
memory.on('stored', ({ id, type, tags }) => {
  console.log(`Stored ${type} memory: ${id}`)
})

memory.on('updated', ({ id, updates }) => {
  console.log(`Updated memory: ${id}`)
})

memory.on('deleted', ({ id }) => {
  console.log(`Deleted memory: ${id}`)
})

memory.on('cleanup', ({ expiredCount }) => {
  console.log(`Cleaned up ${expiredCount} memories`)
})

memory.on('error', ({ type, error }) => {
  console.error(`Memory error (${type}): ${error}`)
})

memory.on('warning', ({ type, message }) => {
  console.warn(`Memory warning (${type}): ${message}`)
})
```

## Privacy and Security

### Encryption

Enable encryption to secure memories at rest:

```javascript
const memory = new MemorySystem({
  enableEncryption: true,
  encryptionKey: process.env.MEMORY_ENCRYPTION_KEY
})

// Memories are automatically encrypted on save
// and decrypted on recall
```

### Access Control

Use access levels to control sharing:

```javascript
// Sensitive data (private to agent)
memory.storeMemory({
  accessLevel: ACCESS_LEVELS.PRIVATE,
  content: { apiKey: 'secret' }
})

// Team-shared (auditable)
memory.storeMemory({
  accessLevel: ACCESS_LEVELS.TEAM,
  content: { shared: 'pattern' }
})

// Trusted agents only
memory.storeMemory({
  accessLevel: ACCESS_LEVELS.TRUSTED,
  trustList: ['agent-1', 'agent-2'],
  content: { data: 'restricted' }
})
```

## Configuration

```javascript
const memory = new MemorySystem({
  // Directory for memory storage
  dataDir: '/path/to/.claude/memory',

  // Agent identifier
  agentId: 'my-agent',

  // Encryption
  enableEncryption: true,
  encryptionKey: process.env.MEMORY_ENCRYPTION_KEY,

  // Storage limits
  maxMemorySize: 100 * 1024 * 1024,  // 100MB

  // Relevance decay
  decayFactor: 0.95,              // Per week
  minRelevanceScore: 0.3,         // Minimum to include in searches

  // Retention
  retentionPolicy: RETENTION_POLICIES.MEDIUM_TERM,

  // Access control
  trustList: ['trusted-agent-1', 'trusted-agent-2'],

  // Logging
  verbose: true
})
```

## Best Practices

### 1. Regular Cleanup
```javascript
// Schedule periodic cleanup
setInterval(() => {
  memory.cleanupExpired()
}, 24 * 60 * 60 * 1000)
```

### 2. Set Appropriate Retention
```javascript
// Critical knowledge: permanent
memory.storeMemory({
  content: { critical: true },
  retentionDays: RETENTION_POLICIES.PERMANENT
})

// Decisions: long-term
memory.storeMemory({
  content: { decision: true },
  type: MEMORY_TYPES.DECISION,
  retentionDays: RETENTION_POLICIES.LONG_TERM
})

// Temporary cache: short-term
memory.storeMemory({
  content: { cache: true },
  retentionDays: RETENTION_POLICIES.EPHEMERAL
})
```

### 3. Use Descriptive Tags
```javascript
memory.storeMemory({
  content: { data: true },
  tags: [
    'domain-payment',
    'severity-high',
    'category-security',
    'status-verified'
  ]
})
```

### 4. Track Decision Outcomes
```javascript
// Record decision
const decisionId = memory.storeMemory({
  type: MEMORY_TYPES.DECISION,
  content: { action: 'deploy' }
}).id

// Later, record outcome
memory.updateMemory(decisionId, {
  content: {
    action: 'deploy',
    outcome: 'success'
  }
})
```

### 5. Monitor Memory Health
```javascript
// Weekly health check
setInterval(() => {
  const stats = memory.getStats()
  if (stats.hitRate < 0.8) {
    console.warn('Low cache hit rate:', stats.hitRate)
  }
  if (stats.avgRelevanceScore < 0.5) {
    console.warn('Low average relevance')
  }
}, 7 * 24 * 60 * 60 * 1000)
```

## Directory Structure

```
.claude/
├── memory/
│   ├── index.json           # Memory index and metadata
│   ├── mem-*.json           # Individual memory entries
│   └── archive/
│       └── mem-*-*.json     # Archived (deleted) memories
```

## File Size Limits

- Default: 100MB per agent
- Configurable via `maxMemorySize` option
- Monitor via `getStats()` warnings

## Performance

- In-memory caching with Map for O(1) lookups
- Index by type, agent, tags for fast filtering
- Lazy loading on initialization
- Async save with optional batching

## Testing

```bash
npm test -- lib/memory-system.test.js
```

See `memory-system.test.js` for comprehensive test coverage.

## Integration Examples

See `memory-system-integration-example.js` for:
- Single agent learning and pattern storage
- Multi-agent collaboration with shared memory
- Decision learning loops
- Outcome tracking and analysis

## API Reference

### Constructor

```javascript
new MemorySystem(options)
```

### Methods

- `storeMemory(input)` - Store a new memory
- `recallById(id)` - Retrieve memory by ID
- `searchByPattern(pattern, options)` - Search memories
- `getByType(type, options)` - Get memories by type
- `getByAgent(agentId, options)` - Get memories by agent
- `getByTags(tags, options)` - Get memories by tags
- `updateMemory(id, updates)` - Update existing memory
- `deleteMemory(id)` - Delete memory (archived)
- `cleanupExpired()` - Remove expired memories
- `getStats()` - Get memory statistics
- `exportSnapshot(options)` - Export all memories
- `importSnapshot(snapshot)` - Import memories

## Limitations

- Single-process in-memory cache (not distributed)
- File-based storage (not database)
- No built-in compression (archives can grow)
- Encryption uses scrypt + AES-256-GCM

## Future Enhancements

- [ ] Distributed memory sharing via MCP
- [ ] Database backend support
- [ ] Memory compression
- [ ] Vector similarity search
- [ ] Automatic pattern extraction
- [ ] Anomaly detection in decisions
- [ ] Memory recommendation engine

## License

See main LICENSE file.
