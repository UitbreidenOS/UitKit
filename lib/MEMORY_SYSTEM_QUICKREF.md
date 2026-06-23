# Memory System — Quick Reference

## Installation

```javascript
const { MemorySystem, MEMORY_TYPES, ACCESS_LEVELS, RETENTION_POLICIES } = require('./lib/memory-system')
```

## Initialize

```javascript
const memory = new MemorySystem({
  agentId: 'my-agent',
  encryptionKey: process.env.MEMORY_KEY,
  retentionPolicy: RETENTION_POLICIES.MEDIUM_TERM
})
```

## Store

```javascript
memory.storeMemory({
  type: MEMORY_TYPES.PATTERN,              // pattern|preference|decision|strategy|mistake|context|relationship
  content: { rule: 'if X then Y' },        // Any data
  description: 'A learned pattern',        // Human text
  tags: ['learning', 'high-confidence'],   // Search tags
  baseRelevance: 0.95,                     // 0-1 score
  retentionDays: 365,                      // or use RETENTION_POLICIES
  accessLevel: ACCESS_LEVELS.PRIVATE,      // private|team|trusted|public
  metadata: { source: 'execution' }        // Custom data
})
```

## Recall

```javascript
const memory = memory.recallById(memoryId)
```

## Search

```javascript
const results = memory.searchByPattern('error handling', {
  matchType: 'fuzzy',                  // exact|fuzzy|regex
  type: MEMORY_TYPES.DECISION,         // Filter by type
  tags: ['production'],                // Filter by tags
  minRelevance: 0.7,                   // Only relevant results
  limit: 10                            // Result count
})
// Returns: [{ id, relevance, entry }, ...]
```

## Retrieve by Type

```javascript
memory.getByType(MEMORY_TYPES.PATTERN, { limit: 10 })
memory.getByAgent('agent-id', { limit: 10 })
memory.getByTags(['urgent', 'prod'], { limit: 10 })
```

## Update

```javascript
memory.updateMemory(memoryId, {
  content: { updated: 'data' },
  tags: ['new-tag'],
  relevanceScore: 0.5
})
```

## Delete

```javascript
memory.deleteMemory(memoryId)  // Archives before deletion
```

## Maintain

```javascript
memory.cleanupExpired()        // Remove old memories
memory.getStats()              // View statistics
```

## Export/Import

```javascript
// Backup
const snapshot = memory.exportSnapshot()
fs.writeFileSync('backup.json', JSON.stringify(snapshot))

// Restore
const snapshot = JSON.parse(fs.readFileSync('backup.json'))
memory.importSnapshot(snapshot)
```

## Events

```javascript
memory.on('stored', ({ id, type, tags }) => {})
memory.on('updated', ({ id, updates }) => {})
memory.on('deleted', ({ id }) => {})
memory.on('cleanup', ({ expiredCount }) => {})
memory.on('error', ({ type, error }) => {})
```

## Memory Types

| Type | Purpose | Example |
|------|---------|---------|
| PATTERN | Learned rules | `{ rule: 'validate input', confidence: 0.95 }` |
| PREFERENCE | User settings | `{ theme: 'dark', language: 'en' }` |
| DECISION | Past decisions | `{ action: 'deploy', outcome: 'success' }` |
| STRATEGY | Techniques | `{ name: 'Blue-Green Deploy', steps: [...] }` |
| MISTAKE | Error lessons | `{ issue: 'race condition', solution: 'mutex' }` |
| CONTEXT | Domain info | `{ domain: 'payment', riskLevel: 'critical' }` |
| RELATIONSHIP | Dependencies | `{ related: ['agent-1', 'agent-2'] }` |

## Access Levels

| Level | Usage |
|-------|-------|
| PRIVATE | Agent-only (default) |
| TEAM | Share with team agents |
| TRUSTED | Restricted list |
| PUBLIC | All agents |

## Retention Policies

| Policy | Days | Use Case |
|--------|------|----------|
| PERMANENT | -1 | Critical knowledge |
| LONG_TERM | 365 | Patterns, strategies |
| MEDIUM_TERM | 90 | Decisions (default) |
| SHORT_TERM | 30 | Preferences |
| EPHEMERAL | 7 | Temporary cache |

## CLI Examples

```bash
# Store
node lib/memory-system-cli.js store \
  --type pattern \
  --content '{"rule":"validate"}' \
  --tags learning

# Search
node lib/memory-system-cli.js search --pattern validation --limit 20

# List
node lib/memory-system-cli.js list --type pattern --limit 50

# Stats
node lib/memory-system-cli.js stats

# Export
node lib/memory-system-cli.js export --output backup.json

# Import
node lib/memory-system-cli.js import --input backup.json

# Cleanup
node lib/memory-system-cli.js cleanup
```

## Common Patterns

### Learn from Success

```javascript
const pattern = memory.storeMemory({
  type: MEMORY_TYPES.PATTERN,
  content: pattern,
  tags: ['success', 'learned'],
  baseRelevance: confidence
})
```

### Track Decisions

```javascript
const decision = memory.storeMemory({
  type: MEMORY_TYPES.DECISION,
  content: { action, reasoning, confidence },
  tags: [`status-pending`]
})

// Later
memory.updateMemory(decision.id, {
  content: { ...decision.content, outcome: 'success' }
})
```

### Remember Preferences

```javascript
memory.storeMemory({
  type: MEMORY_TYPES.PREFERENCE,
  content: { key: 'value' },
  accessLevel: ACCESS_LEVELS.TEAM,
  retentionDays: 180
})
```

### Record Mistakes

```javascript
memory.storeMemory({
  type: MEMORY_TYPES.MISTAKE,
  content: {
    issue: 'description',
    cause: 'why',
    solution: 'how to fix'
  },
  retentionDays: RETENTION_POLICIES.PERMANENT
})
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Memory not persisting | Check disk permissions, verify dataDir path |
| No search results | Try different matchType, lower minRelevance |
| High memory usage | Increase cleanup frequency, reduce retention |
| Encryption errors | Verify encryptionKey, check key format |
| Slow searches | Add more tags, use exact match |

## Best Practices

1. **Set appropriate retention** — Use PERMANENT for critical, EPHEMERAL for cache
2. **Use descriptive tags** — Enable better search and filtering
3. **Track outcomes** — Update decisions with results for learning
4. **Regular cleanup** — Schedule cleanupExpired() daily
5. **Monitor health** — Check getStats() weekly
6. **Encrypt sensitive** — Use enableEncryption for private data
7. **Version snapshots** — Export regularly for backup
8. **Archive old** — Reviewed archived memories periodically

## Performance Tips

- Use exact match for known patterns
- Add more tags to narrow searches
- Increase cleanup frequency if reaching size limits
- Monitor hitRate in stats for cache efficiency
- Batch related memories with consistent tags

## Files

| File | Purpose |
|------|---------|
| `memory-system.js` | Core implementation |
| `memory-system.test.js` | Test suite (43 tests) |
| `memory-system-cli.js` | CLI tool |
| `memory-system-integration-example.js` | Usage examples |
| `MEMORY_SYSTEM_README.md` | Full documentation |
| `MEMORY_SYSTEM_DELIVERABLES.md` | Technical details |
| `MEMORY_SYSTEM_QUICKREF.md` | This file |

## More Info

- API Reference: See `MEMORY_SYSTEM_DELIVERABLES.md`
- Integration Guide: See `MEMORY_SYSTEM_INTEGRATION_EXAMPLE.js`
- Configuration Options: See `MEMORY_SYSTEM_README.md`
- Tests: Run `npm test -- lib/memory-system.test.js`
- Examples: Run `node lib/memory-system-integration-example.js`
