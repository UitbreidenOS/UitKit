---
name: offline-first
description: Design offline-first mobile apps with local caching, background sync, and conflict resolution strategies
allowed-tools: [Read, Write, Grep]
effort: high
---

## When to activate

- Building apps that must work without internet connectivity
- Designing data sync strategies between local and remote
- Implementing conflict resolution for concurrent edits
- Setting up local databases (SQLite, SwiftData, Room, MMKV)
- Optimizing app performance with aggressive caching

## When NOT to use

- For real-time-only applications (live trading, video calls)
- For apps with no local data needs
- For server-only caching strategies

## Instructions

1. **Define offline requirements.** Which screens need offline access? Read-only or read-write? How long offline (hours, days, weeks)?
2. **Choose storage strategy.** Hot data (current session): in-memory. Warm data (recent): SQLite/Room/SwiftData. Cold data (archive): server only.
3. **Implement cache-first reads.** Always show cached data immediately. Refresh from network in background. Show stale indicator with timestamp.
4. **Queue write operations.** When offline, queue mutations locally. Sync when connectivity returns. Use optimistic UI updates.
5. **Handle conflicts.** Last-write-wins (simple), server-wins (safe), CRDT (complex but correct). Choose based on data type.
6. **Background sync.** Use WorkManager (Android), BGTaskScheduler (iOS), or Background Fetch (Expo). Sync on connectivity change + periodic.
7. **Test offline.** Airplane mode testing, network throttling in DevTools, Charles Proxy for simulating slow/unreliable connections.

## Example

```
Sync Strategy: Note-taking app

Online: Create note locally → sync to server → confirm
Offline: Create note locally (queued) → show optimistic UI
Reconnect: Push queued mutations → pull server changes → resolve conflicts

Conflict Resolution: Last-write-wins for simple notes, merge for shared documents
Storage: SQLite with FTS5 for search, encrypted at rest
Sync: WorkManager every 15min + on connectivity change
```
