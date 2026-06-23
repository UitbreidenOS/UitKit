# State Management Architecture

Comprehensive architectural documentation for the dont-stop workflows global state management system.

## System Overview

The State Management system is a distributed state coordination layer enabling:

1. **Centralized State** - Single source of truth for workflow state
2. **Versioning** - Complete history with rollback capability
3. **Conflict Resolution** - Pluggable strategies for concurrent updates
4. **Concurrency Control** - Read-write locks for safe multi-agent access
5. **Persistence** - Automatic disk storage and recovery
6. **Context Isolation** - Namespace-based agent-local storage
7. **Observability** - Subscriptions, events, and diagnostics

```
┌─────────────────────────────────────────────────────────┐
│          Dont-Stop Workflow Orchestration               │
├─────────────────────────────────────────────────────────┤
│  Agent 1   │  Agent 2   │  Agent 3   │  Skill Handler  │
│  (Consumer)│(Processor) │(Validator) │  (Dispatcher)   │
└──────┬──────────────┬──────────────┬───────────────┬────┘
       │              │              │               │
       └──────────────┴──────────────┴───────────────┘
              Global State Manager
         (Versioning + Conflict Resolution)
              ↓       ↓       ↓      ↓
        History  Locks  Events  Persistence
```

## Component Architecture

### 1. StateVersion

Immutable representation of a single state snapshot.

```
StateVersion
├── versionNumber: number       # Monotonic version ID
├── timestamp: ISO8601          # Creation time
├── data: object                # State content
├── hash: SHA256                # Integrity checksum
├── metadata: object            # Author, tags, description
└── computeHash(): void         # Calculate integrity hash
```

**Key Properties:**
- Immutable after creation (except via computed hash)
- Complete metadata trail
- SHA256 hash for verification
- Backward compatible serialization

### 2. ConflictResolver

Handles concurrent state conflicts with pluggable strategies.

```
ConflictResolver
├── strategy: CONFLICT_STRATEGIES
├── customResolver?: Function
├── conflictLog: Conflict[]
│
├── resolve(local, incoming, base): Conflict
├── setCustomResolver(fn): void
├── getConflictLog(): Conflict[]
└── clearConflictLog(): void
```

**Strategies:**

| Strategy | Behavior | Use Case |
|----------|----------|----------|
| LAST_WRITE_WINS | Latest timestamp wins | Simple updates |
| FIRST_WRITE_WINS | Earliest timestamp wins | Initialization protection |
| MERGE | Deep object merge | Nested state updates |
| LATEST_VERSION | Highest version number | Version-based ordering |
| CUSTOM | User-defined function | Complex business logic |
| MANUAL | Requires intervention | Critical decisions |

**Conflict Resolution Flow:**

```
Concurrent Updates
├─ Update A (timestamp T1, version V1)
└─ Update B (timestamp T2, version V2)
         ↓
    Conflict Detected
         ↓
    Apply Strategy
    ├─ Compute differences
    ├─ Apply merge logic
    └─ Generate resolved version
         ↓
    Conflict Resolution Event
    └─ Log result
```

### 3. GlobalStateManager

Central state coordination with versioning and rollback.

```
GlobalStateManager extends EventEmitter
│
├── State Storage
│   ├── currentState: StateVersion
│   ├── versionHistory: StateVersion[]
│   └── changeLog: Change[]
│
├── Concurrency Control
│   ├── locks: Map<lockId, Lock>
│   ├── _acquireLock(): string|null
│   └── _releaseLock(): void
│
├── Operations
│   ├── getState(): object
│   ├── setState(): StateVersion
│   ├── mergeState(): StateVersion
│   └── rollbackToVersion(): StateVersion
│
├── Query
│   ├── getVersionHistory(): StateVersion[]
│   ├── compareVersions(): Comparison
│   └── exportSnapshot(): string
│
├── Observability
│   ├── subscribe(): unsubscribe function
│   ├── on('state-changed'): void
│   ├── on('state-merged'): void
│   ├── on('state-rolled-back'): void
│   └── getDiagnostics(): Diagnostics
│
└── Persistence
    ├── _saveState(): void
    ├── _loadState(): void
    ├── _writeChangelog(): void
    └── [state-files on disk]
```

**State Transition Diagram:**

```
┌─────────────┐
│   Initial   │
└──────┬──────┘
       │ setState()
       ↓
┌──────────────────┐
│  StateVersion 1  │──→ History
└──────┬───────────┘
       │ setState()
       ↓
┌──────────────────┐
│  StateVersion 2  │──→ History
└──────┬───────────┘
       │ setState() / mergeState()
       ↓
┌──────────────────┐
│  StateVersion N  │──→ History
└──────┬───────────┘
       │
       ├─→ rollbackToVersion(M)
       │
       ↓
┌──────────────────┐
│  StateVersion N+1│  (New version at M's data)
└──────────────────┘
```

### 4. SharedContextStore

Namespace-based context isolation for agents.

```
SharedContextStore
├── manager: GlobalStateManager
├── contexts: Map<namespace, Context>
│
├── getContext(namespace): Context
├── setContextValue(namespace, key, value): void
├── getContextValue(namespace, key?): any
├── mergeContextData(namespace, updates): void
├── clearContext(namespace): void
└── getAllContexts(): object
```

**Context Structure:**

```
Context
├── namespace: string           # Agent or skill identifier
├── createdAt: ISO8601         # Creation timestamp
├── data: object               # Key-value storage
└── metadata: object           # Per-key metadata
    └── [key]: {
        lastUpdated: ISO8601,
        ...custom metadata
    }
```

**Multi-Agent Flow:**

```
Agent 1                Agent 2               Agent 3
    │                      │                     │
    └──→ context: agent-1 ←┘                     │
         (isolated data)                         │
                           └──→ context: agent-2
                                (isolated data)
                                            └──→ context: agent-3
                                                 (isolated data)

All contexts sync to GlobalStateManager
            ↓
     Unified state snapshot
     (available to all agents)
```

## Data Flow Patterns

### Pattern 1: Simple State Update

```
Agent calls: manager.setState({key: value})
                    ↓
        Acquire write lock
                    ↓
        Create StateVersion(N+1)
                    ↓
        Record to versionHistory
                    ↓
        Compute SHA256 hash
                    ↓
        Log change
                    ↓
        Notify subscribers
                    ↓
        Persist to disk
                    ↓
        Emit 'state-changed' event
                    ↓
        Release lock
                    ↓
        Return new StateVersion
```

### Pattern 2: Concurrent Merge

```
Agent A: setState({a: 1})          Agent B: setState({b: 2})
         ↓                                    ↓
    Acquire lock (success)         Await lock acquisition
         ↓                                    ↓
    Apply A's changes                    Acquire lock
         ↓                                    ↓
    Release lock                      Merge B with current state
         ↓                                    ↓
         └────────→ Detect conflict?
                         │
                   Yes: Apply conflict resolver
                         │
                   No: Apply B's changes
                         ↓
                    Release lock
```

### Pattern 3: Rollback & Recovery

```
Checkpoint: v5 saved
       ↓
Execute risky workflow
       ├─ setState() → v6
       ├─ setState() → v7
       ├─ ERROR!
       ↓
rollbackToVersion(5)
       ├─ Load v5's data
       ├─ Create new StateVersion v8
       ├─ Copy v5's data into v8
       ├─ Add rollback metadata
       ├─ Emit 'state-rolled-back'
       └─ Persist to disk
```

## Concurrency Model

### Lock Hierarchy

```
┌─────────────────────────────┐
│   GlobalStateManager        │
├─────────────────────────────┤
│   Locks Map                 │
│   ├─ Read Lock 1            │ ← Multiple readers OK
│   ├─ Read Lock 2            │
│   ├─ Read Lock 3            │
│   └─ [Write Lock blocked]   │ ← Blocks on read locks
│                             │
│   Once writes acquire:      │
│   ├─ [New readers blocked]  │
│   └─ Write Lock 1           │ ← Exclusive access
└─────────────────────────────┘
```

### Lock Semantics

- **Read Lock**: Shared access, multiple simultaneous reads allowed
- **Write Lock**: Exclusive access, blocks all other operations
- **Timeout**: 5000ms per lock acquisition
- **Deadlock Prevention**: Single-threaded Node.js model prevents cyclic waits
- **Fairness**: FIFO order (implementation-dependent)

**Lock State Machine:**

```
Free
├─ Read request → Grant read lock, increment readers
├─ Write request → Grant write lock, set writer
└─ All locks released → State: Free

With Read Locks
├─ Write request → Queue, await all reads
├─ Read request → Grant immediately
└─ Last reader releases → Grant queued write

With Write Lock
├─ Any request → Queue until write completes
└─ Writer releases → Grant next queued operation
```

## Persistence Strategy

### File Layout

```
.claude/state/
├── global-state.json
│   └── {
│       "currentVersion": 42,
│       "timestamp": "2024-01-15T10:30:00Z",
│       "data": {...},
│       "metadata": {...},
│       "hash": "abc123..."
│     }
│
├── version-history.json
│   └── {
│       "totalVersions": 42,
│       "versions": [
│         {"versionNumber": 1, "timestamp": "...", "hash": "..."},
│         ...
│       ]
│     }
│
└── changelog.md
    └── # Markdown audit log
        v1 | 2024-01-15T10:00:00Z | Initialize
        v2 | 2024-01-15T10:05:00Z | Add task
        ...
```

### Persistence Guarantees

- **Atomicity**: Each save is atomic (single file write)
- **Durability**: Synchronous writes (fs.writeFileSync)
- **Consistency**: Hash verification on load
- **Isolation**: No partial state reads during writes

### Recovery Process

```
Application Startup
        ↓
  Load global-state.json
        ├─ If not found → Initialize empty state
        ├─ If corrupt → Log error, use empty state
        └─ If valid → Restore version number, data, hash
        ↓
  Load version-history.json
        ├─ If not found → Rebuild from checkpoint
        ├─ If corrupt → Log error, continue with empty history
        └─ If valid → Restore all versions
        ↓
  Verify Integrity
        ├─ Compute hash of loaded data
        ├─ Compare with stored hash
        └─ Log mismatch warnings
        ↓
  Ready for Operations
```

## Event System

### Event Types

| Event | Emitted When | Data |
|-------|--------------|------|
| `state-changed` | setState() completes | `{version, changes}` |
| `state-merged` | mergeState() completes | `{version}` |
| `state-rolled-back` | rollbackToVersion() completes | `{from, to, newVersion}` |

### Subscription Pattern

```
manager.subscribe('key', callback)
        ↓
    Return unsubscribe function
        ↓
    On state change to 'key'
        ↓
    Invoke all callbacks
        ├─ Error handling per callback
        └─ Continue to next
        ↓
    unsubscribe() removes callback
```

### Event Flow Example

```
User Code
    │
    ├─ manager.setState({count: 1})
    │          ↓
    │    [Internal processing]
    │          ↓
    │    Notify subscribers('count')
    │    Notify subscribers(all keys)
    │          ↓
    │    Emit 'state-changed'
    │          ↓
    │    Return to user
    │
    └─ Callback triggered
       (synchronous in this implementation)
```

## Diagnostics & Observability

### Available Diagnostics

```javascript
manager.getDiagnostics()
// Returns:
{
  currentVersion: 42,        // Current version number
  totalVersions: 42,         // Versions in history
  totalChanges: 127,         // Changes recorded
  activeLocks: 0,            // Current locks held
  subscriptions: 5,          // Active subscriptions
  storageSize: 8192,         // Bytes on disk
  lastModified: "2024-01-15T10:30:00Z"
}
```

### Conflict Log Diagnostics

```javascript
resolver.getConflictLog()
// Returns array of:
{
  timestamp: "2024-01-15T10:30:00Z",
  localVersion: 5,
  incomingVersion: 6,
  strategy: "merge",
  result: StateVersion,
  needsManualResolution: false,
  error?: string
}
```

### Change Log Entry

```javascript
{
  timestamp: "2024-01-15T10:30:00Z",
  version: 42,
  updates: ["key1", "key2"],  // Keys that changed
  hash: "abc123..."           // Hash of new state
}
```

## Performance Characteristics

### Time Complexity

| Operation | Complexity | Notes |
|-----------|------------|-------|
| getState() | O(n) | Path traversal depth |
| setState() | O(1) | Plus: hash O(m), save I/O |
| mergeState() | O(n*m) | Object merge depth |
| rollbackToVersion() | O(1) | History lookup + copy |
| getVersionHistory() | O(k) | k = returned items |
| compareVersions() | O(n) | n = keys in state |

### Space Complexity

| Component | Complexity | Limit |
|-----------|-----------|-------|
| versionHistory | O(v) | v = total versions (unbounded) |
| changeLog | O(c) | c = total changes (unbounded) |
| Locks | O(p) | p = concurrent operations (typically 1-10) |
| Subscriptions | O(s) | s = subscribers per key |

### I/O Performance

- **Write**: ~1-5ms (fs.writeFileSync on SSD)
- **Read**: ~0.5-2ms (fs.readFileSync on SSD)
- **Lock acquisition**: ~0.1ms typical, ~5000ms timeout
- **Hash computation**: O(state size), typically < 1ms

## Scalability Considerations

### Suitable For

- Small to medium state sizes (< 10MB)
- Workflows with < 10 concurrent agents
- State change frequency < 1000/second
- Single-machine deployments

### Limitations

- Single-machine state (no replication)
- Unbounded version history (cleanup needed)
- Full state snapshots (no delta encoding)
- Synchronous I/O (blocking operations)

### Optimization Opportunities

1. **Incremental Snapshots**: Store diffs instead of full state
2. **Async Persistence**: Non-blocking I/O with flush detection
3. **History Cleanup**: Automated archiving of old versions
4. **Compression**: State compression for large payloads
5. **Distributed Mode**: Multi-node state sync (future)

## Error Handling & Recovery

### Common Errors

| Error | Cause | Recovery |
|-------|-------|----------|
| Lock timeout | Contention | Retry or fail gracefully |
| Version not found | Invalid rollback | Check history before rolling back |
| Corrupt state file | Disk corruption | Use empty state, log error |
| Conflict resolution failed | Custom resolver error | Fall back to default strategy |

### Error Propagation

```
Exception in operation
        ↓
Release lock (in finally)
        ↓
Propagate error to caller
        ↓
Caller catches and handles
        ├─ Retry
        ├─ Rollback
        └─ Log & continue
```

## Security Considerations

### Threat Model

| Threat | Mitigation |
|--------|-----------|
| State tampering | Hash verification on load |
| Concurrent corruption | Write locks + atomic saves |
| Lost updates | Version history + rollback |
| Unauthorized access | File system permissions |
| Replay attacks | Timestamps + version numbers |

### Best Practices

1. **Validate on Load**: Check hash integrity
2. **Use Locks**: Always acquire before write
3. **Log Changes**: Metadata for audit trail
4. **Secure Metadata**: Include author/source info
5. **File Permissions**: Restrict .claude/ directory access

## Integration Points

### With Dont-Stop Engine

```
AutonomousExecutor
        ↓
  Execute task DAG
        ↓
  Update task status
        ↓
  manager.setState()
        ↓
  StateVersion created + persisted
        ↓
  On resume: Load checkpoint
```

### With Agent Pool

```
Agent Pool Manager
        ↓
  Create agent contexts
        ↓
  contextStore.getContext(agentId)
        ↓
  Update context values
        ↓
  contextStore.setContextValue()
        ↓
  Global state sync
```

### With Skills

```
Skill Execution
        ↓
  Needs shared data
        ↓
  manager.getState('skill-namespace')
        ↓
  Update result
        ↓
  manager.setState() or mergeState()
        ↓
  Next skill reads updated state
```

## Future Enhancements

1. **Transaction Support**: Multi-operation atomic updates
2. **Time Travel**: Query state at any point
3. **Replication**: Multi-machine state sync
4. **Compression**: Built-in state compression
5. **Caching**: LRU cache for hot state paths
6. **Async I/O**: Non-blocking persistence
7. **Garbage Collection**: Automatic history cleanup
8. **Hooks**: Custom serialization/deserialization
