# State Management System - Complete Index

Comprehensive state management for dont-stop workflows with versioning, conflict resolution, and rollback capability.

## Files Overview

| File | Size | Purpose |
|------|------|---------|
| `state-management.js` | 24KB | Core state management implementation |
| `state-management-tests.js` | 13KB | Comprehensive test suite |
| `state-management-examples.js` | 12KB | Real-world usage examples |
| `STATE-MANAGEMENT-README.md` | 13KB | API reference and usage guide |
| `STATE-MANAGEMENT-ARCHITECTURE.md` | 18KB | Detailed architecture documentation |
| `STATE-MANAGEMENT-INTEGRATION.md` | 12KB | Integration patterns and recipes |

## Quick Navigation

### I want to...

#### Understand the System
1. Start with: **STATE-MANAGEMENT-README.md** - Overview and core concepts
2. Then read: **STATE-MANAGEMENT-ARCHITECTURE.md** - Deep technical details
3. Review: **state-management.js** - Actual implementation

#### Integrate into My Project
1. Read: **STATE-MANAGEMENT-INTEGRATION.md** - Quick start and patterns
2. Copy patterns from: **state-management-examples.js**
3. Reference: **STATE-MANAGEMENT-README.md** for API details

#### Run Tests & Examples
```bash
# Run tests
node scripts/state-management-tests.js

# Run examples
node scripts/state-management-examples.js

# CLI usage
node scripts/state-management.js help
```

#### Debug Issues
1. Check: **STATE-MANAGEMENT-README.md** - Error handling section
2. Use: CLI diagnostics (`node scripts/state-management.js status`)
3. Review: Conflict logs and version history

## Core Concepts

### Global State Manager
Centralized state coordination with versioning and rollback.

```javascript
const { GlobalStateManager } = require('./state-management');
const manager = new GlobalStateManager();

manager.setState({ key: 'value' });
manager.getState('key');
manager.rollbackToVersion(5);
```

**Key Features:**
- Version history with full rollback
- SHA256 checksums for integrity
- Concurrent read locks, exclusive write locks
- Event-driven subscriptions
- Automatic disk persistence
- Conflict resolution

### State Version
Immutable snapshot with metadata and hash.

```javascript
const version = manager.currentState;
// {
//   versionNumber: 42,
//   timestamp: "2024-01-15T10:30:00Z",
//   data: { /* state */ },
//   hash: "abc123...",
//   metadata: { author, description, tags }
// }
```

### Conflict Resolver
Pluggable strategies for concurrent updates.

```javascript
const { ConflictResolver, CONFLICT_STRATEGIES } = require('./state-management');

const resolver = new ConflictResolver(CONFLICT_STRATEGIES.MERGE);
const conflict = resolver.resolve(localState, incomingState);
```

**Strategies:**
- LAST_WRITE_WINS - Latest timestamp wins
- FIRST_WRITE_WINS - Earliest wins
- MERGE - Deep merge objects
- LATEST_VERSION - Highest version number
- CUSTOM - User-defined function
- MANUAL - Require manual intervention

### Shared Context Store
Multi-namespace context isolation.

```javascript
const { SharedContextStore } = require('./state-management');
const contextStore = new SharedContextStore(manager);

contextStore.setContextValue('agent-1', 'status', 'active');
contextStore.getContextValue('agent-1', 'status');
contextStore.mergeContextData('agent-1', { count: 5 });
```

## API Quick Reference

### GlobalStateManager

#### State Operations
```javascript
manager.getState()              // Get entire state
manager.getState('path.key')    // Get nested value
manager.setState(updates, meta) // Create new version
manager.mergeState(updates, meta) // Deep merge
manager.rollbackToVersion(5)    // Restore to version
```

#### History & Comparison
```javascript
manager.getVersionHistory({limit: 10, since: timestamp, tags: []})
manager.compareVersions(5, 10)  // Show differences
manager.exportSnapshot('json')  // Export state
```

#### Subscriptions & Events
```javascript
manager.subscribe('key', callback)     // Watch key changes
manager.on('state-changed', handler)   // Global changes
manager.on('state-merged', handler)    // Merge events
manager.on('state-rolled-back', handler) // Rollback events
```

#### Diagnostics
```javascript
manager.getDiagnostics()        // Get manager stats
manager._acquireLock('write')   // Manual locking
manager._releaseLock(lockId)    // Release lock
```

### ConflictResolver

```javascript
new ConflictResolver(strategy)
resolver.setCustomResolver(fn)
resolver.resolve(local, incoming, base)
resolver.getConflictLog()
resolver.clearConflictLog()
```

### SharedContextStore

```javascript
new SharedContextStore(manager)
contextStore.getContext(namespace)
contextStore.setContextValue(ns, key, value, meta)
contextStore.getContextValue(ns, key?)
contextStore.mergeContextData(ns, updates, meta)
contextStore.clearContext(ns)
contextStore.getAllContexts()
```

## Integration Checklist

- [ ] Require state-management module
- [ ] Create GlobalStateManager instance
- [ ] Initialize with setState()
- [ ] Create SharedContextStore for agents
- [ ] Add subscriptions for monitoring
- [ ] Implement error handling
- [ ] Add checkpoint/rollback logic
- [ ] Enable CLI access
- [ ] Set up monitoring/diagnostics
- [ ] Test with state-management-tests.js

## File Locations

```
.claude/
├── state/
│   ├── global-state.json       # Current state snapshot
│   ├── version-history.json    # All versions
│   └── changelog.md            # Human-readable changelog
```

## Common Patterns

### 1. Task Progress Tracking
See: STATE-MANAGEMENT-INTEGRATION.md - Pattern 1

### 2. Concurrent Agent Updates
See: STATE-MANAGEMENT-INTEGRATION.md - Pattern 2

### 3. Checkpoint & Recovery
See: STATE-MANAGEMENT-INTEGRATION.md - Pattern 3

### 4. Agent Context Isolation
See: STATE-MANAGEMENT-INTEGRATION.md - Pattern 4

## CLI Commands

```bash
# View state
node state-management.js get [path]
node state-management.js status

# Modify state
node state-management.js set <key> <json>
node state-management.js merge <json>

# Version management
node state-management.js history [limit]
node state-management.js compare <v1> <v2>
node state-management.js rollback <version>

# Export
node state-management.js export [json|yaml]

# Help
node state-management.js help
```

## Performance Profile

| Operation | Time | Complexity |
|-----------|------|-----------|
| getState() | ~0.1ms | O(n) path depth |
| setState() | ~1ms | O(1) + I/O |
| mergeState() | ~2ms | O(n*m) merge |
| rollback | ~1ms | O(1) |
| History query | ~0.5ms | O(k) items |

## Limitations & Considerations

### Current Limitations
- Single-machine only (no replication)
- Unbounded version history (requires cleanup)
- Full state snapshots (no delta encoding)
- Synchronous I/O (blocking operations)

### Scalability
- Suitable for: < 10MB state, < 10 concurrent agents
- Frequency: < 1000 changes/second
- Deployment: Single machine

### Future Enhancements
- Incremental snapshots
- Async persistence
- Distributed state sync
- Compression
- Query indexing

## Troubleshooting

### Lock Timeout
Check for contention, reduce timeout, or implement backoff.

### Corrupted State File
Remove `.claude/state/*.json`, application reinitializes.

### Version Explosion
Implement history cleanup/archival strategy.

### Conflict Errors
Review conflict log, adjust resolver strategy.

See: STATE-MANAGEMENT-INTEGRATION.md - Troubleshooting

## Examples

### Example 1: Multi-Agent Task Queue
See: state-management-examples.js - Example 1

### Example 2: Agent Context Isolation
See: state-management-examples.js - Example 2

### Example 3: Checkpoint & Recovery
See: state-management-examples.js - Example 3

### Example 4: Conflict Resolution
See: state-management-examples.js - Example 4

### Example 5: State Audit & Comparison
See: state-management-examples.js - Example 5

### Example 6: Diagnostics & Monitoring
See: state-management-examples.js - Example 6

## Testing

Run comprehensive test suite:
```bash
node scripts/state-management-tests.js
```

Test categories:
- StateVersion creation and hashing
- GlobalStateManager operations
- Versioning and rollback
- Conflict resolution strategies
- SharedContextStore isolation
- Persistence and recovery
- Diagnostics

## Architecture Overview

```
┌─────────────────────────────────────────┐
│    Application / Dont-Stop Workflows    │
├─────────────────────────────────────────┤
│  Agent 1  │  Agent 2  │  Agent 3        │
└─────┬──────────┬───────────┬────────────┘
      │          │           │
      └──────────┼───────────┘
               ↓
      ┌──────────────────────┐
      │ GlobalStateManager    │
      ├──────────────────────┤
      │ Current State v42     │
      │ Version History      │
      │ Conflict Resolver    │
      │ Locks & Subscribers  │
      └──────────┬───────────┘
               ↓
      ┌──────────────────────┐
      │ Persistence Layer    │
      ├──────────────────────┤
      │ global-state.json    │
      │ version-history.json │
      │ changelog.md         │
      └──────────────────────┘
```

## Key Features Summary

| Feature | Benefit |
|---------|---------|
| **Versioning** | Complete history, auditable changes |
| **Rollback** | Recover from failures, undo operations |
| **Conflict Resolution** | Safe concurrent updates |
| **Locking** | Prevent data corruption |
| **Subscriptions** | Real-time change notifications |
| **Persistence** | Automatic disk backup |
| **Context Isolation** | Agent-local state safety |
| **Diagnostics** | Monitor system health |

## Support Resources

- **Questions?** Check STATE-MANAGEMENT-README.md FAQ section
- **Integration issues?** See STATE-MANAGEMENT-INTEGRATION.md
- **Architecture details?** Read STATE-MANAGEMENT-ARCHITECTURE.md
- **Code reference?** Review source in state-management.js
- **Examples?** Run state-management-examples.js
- **Tests?** Run state-management-tests.js

## Related Documentation

- dont-stop-engine.js - Task DAG execution
- dont-stop-agent-pool.js - Agent pool management
- claudient-dont-stop.js - CLI interface

## Version History

- **v1.0** - Initial implementation with versioning, conflict resolution, locking
- **v1.0.1** - Added shared context store, improved persistence
- **v1.1** - Added diagnostics, CLI interface, comprehensive examples

## License & Attribution

Part of Claudient dont-stop workflows system.
Built for autonomous goal execution with distributed agent coordination.
