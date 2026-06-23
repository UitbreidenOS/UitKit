#!/usr/bin/env node

const { EventEmitter } = require('events');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CWD = process.cwd();
const CLAUDE_DIR = path.join(CWD, '.claude');
const STATE_DIR = path.join(CLAUDE_DIR, 'state-store');
const GLOBAL_STATE_PATH = path.join(STATE_DIR, 'global-state.json');
const STATE_HISTORY_PATH = path.join(STATE_DIR, 'state-history.jsonl');
const LOCKS_DIR = path.join(STATE_DIR, 'locks');

// ANSI Colors
const COLORS = {
  BOLD: '\x1b[1m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  CYAN: '\x1b[36m',
  MAGENTA: '\x1b[35m',
  BLUE: '\x1b[34m',
  WHITE: '\x1b[37m',
  RESET: '\x1b[0m',
  DIM: '\x1b[2m',
};

/**
 * State version - tracks state evolution with immutable snapshots
 */
class StateVersion {
  constructor(id, data, parentId = null, metadata = {}) {
    this.id = id;
    this.version = 1;
    this.data = data;
    this.parentId = parentId;
    this.metadata = metadata;
    this.timestamp = Date.now();
    this.checksum = this._computeChecksum();
    this.tags = [];
  }

  _computeChecksum() {
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(this.data));
    return hash.digest('hex').substring(0, 8);
  }

  update(data, metadata = {}) {
    this.data = { ...this.data, ...data };
    this.metadata = { ...this.metadata, ...metadata };
    this.checksum = this._computeChecksum();
    this.timestamp = Date.now();
  }

  tag(name) {
    if (!this.tags.includes(name)) {
      this.tags.push(name);
    }
  }

  toJSON() {
    return {
      id: this.id,
      version: this.version,
      data: this.data,
      parentId: this.parentId,
      metadata: this.metadata,
      timestamp: this.timestamp,
      checksum: this.checksum,
      tags: this.tags,
    };
  }
}

/**
 * Conflict resolver - handles concurrent state updates
 */
class ConflictResolver {
  static STRATEGIES = {
    LAST_WRITE_WINS: 'last_write_wins',
    FIRST_WRITE_WINS: 'first_write_wins',
    MERGE: 'merge',
    MANUAL: 'manual',
  };

  static resolve(current, incoming, strategy = this.STRATEGIES.LAST_WRITE_WINS) {
    const conflict = {
      current,
      incoming,
      strategy,
      resolved: false,
      result: null,
      error: null,
    };

    try {
      switch (strategy) {
        case this.STRATEGIES.LAST_WRITE_WINS:
          conflict.result = incoming.timestamp > current.timestamp ? incoming : current;
          conflict.resolved = true;
          break;

        case this.STRATEGIES.FIRST_WRITE_WINS:
          conflict.result = current.timestamp <= incoming.timestamp ? current : incoming;
          conflict.resolved = true;
          break;

        case this.STRATEGIES.MERGE:
          conflict.result = this._deepMerge(current, incoming);
          conflict.resolved = true;
          break;

        case this.STRATEGIES.MANUAL:
          conflict.resolved = false;
          conflict.error = 'Manual resolution required';
          break;

        default:
          throw new Error(`Unknown conflict resolution strategy: ${strategy}`);
      }
    } catch (error) {
      conflict.error = error.message;
    }

    return conflict;
  }

  static _deepMerge(v1, v2) {
    const merged = new StateVersion(v1.id + '_merged', {}, v1.parentId);
    const keys = new Set([
      ...Object.keys(v1.data || {}),
      ...Object.keys(v2.data || {}),
    ]);

    for (const key of keys) {
      const v1Val = v1.data?.[key];
      const v2Val = v2.data?.[key];

      if (typeof v1Val === 'object' && typeof v2Val === 'object') {
        merged.data[key] = this._deepMergeObjects(v1Val, v2Val);
      } else if (v2Val !== undefined) {
        merged.data[key] = v2Val;
      } else {
        merged.data[key] = v1Val;
      }
    }

    merged.metadata = { ...v1.metadata, ...v2.metadata, mergedFrom: [v1.id, v2.id] };
    merged.checksum = merged._computeChecksum();
    return merged;
  }

  static _deepMergeObjects(obj1, obj2) {
    const result = { ...obj1 };
    for (const key in obj2) {
      if (typeof obj2[key] === 'object' && obj1[key]) {
        result[key] = this._deepMergeObjects(obj1[key], obj2[key]);
      } else {
        result[key] = obj2[key];
      }
    }
    return result;
  }

  static detectConflict(version1, version2) {
    return version1.checksum !== version2.checksum && version1.parentId === version2.parentId;
  }
}

/**
 * State lock manager - prevents concurrent modifications
 */
class LockManager {
  constructor(stateId) {
    this.stateId = stateId;
    this.locks = new Map(); // lockId -> { agentId, timestamp, ttl }
  }

  acquireLock(agentId, ttlMs = 30000) {
    const lockId = crypto.randomBytes(8).toString('hex');
    const lock = {
      lockId,
      agentId,
      timestamp: Date.now(),
      ttl: ttlMs,
      expiresAt: Date.now() + ttlMs,
    };

    this.locks.set(lockId, lock);
    return lockId;
  }

  releaseLock(lockId) {
    return this.locks.delete(lockId);
  }

  isLocked() {
    // Cleanup expired locks
    for (const [id, lock] of this.locks.entries()) {
      if (Date.now() > lock.expiresAt) {
        this.locks.delete(id);
      }
    }
    return this.locks.size > 0;
  }

  getLockOwner() {
    for (const lock of this.locks.values()) {
      if (Date.now() <= lock.expiresAt) {
        return lock.agentId;
      }
    }
    return null;
  }

  getAllLocks() {
    return Array.from(this.locks.values());
  }

  renewLock(lockId, ttlMs = 30000) {
    const lock = this.locks.get(lockId);
    if (lock) {
      lock.expiresAt = Date.now() + ttlMs;
      return true;
    }
    return false;
  }
}

/**
 * Global state store - manages versioned state across agents/skills
 */
class GlobalStateStore extends EventEmitter {
  constructor(options = {}) {
    super();
    this.storeId = crypto.randomBytes(8).toString('hex');
    this.state = new Map(); // stateKey -> StateVersion
    this.history = new Map(); // stateKey -> StateVersion[]
    this.locks = new Map(); // stateKey -> LockManager
    this.conflictStrategy = options.conflictStrategy || ConflictResolver.STRATEGIES.MERGE;
    this.maxHistorySize = options.maxHistorySize || 100;
    this.autoSave = options.autoSave !== false;
    this.createdAt = Date.now();

    this.initDirs();
    this.loadState();
  }

  initDirs() {
    if (!fs.existsSync(STATE_DIR)) {
      fs.mkdirSync(STATE_DIR, { recursive: true });
    }
    if (!fs.existsSync(LOCKS_DIR)) {
      fs.mkdirSync(LOCKS_DIR, { recursive: true });
    }
  }

  /**
   * Get current state value
   */
  get(key) {
    const version = this.state.get(key);
    return version ? version.data : null;
  }

  /**
   * Get state version metadata
   */
  getVersion(key) {
    return this.state.get(key);
  }

  /**
   * Set state with versioning
   */
  set(key, data, metadata = {}) {
    const currentVersion = this.state.get(key);
    const versionId = `v_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const parentId = currentVersion ? currentVersion.id : null;

    const newVersion = new StateVersion(versionId, data, parentId, {
      ...metadata,
      operation: 'set',
    });

    this.state.set(key, newVersion);

    // Add to history
    if (!this.history.has(key)) {
      this.history.set(key, []);
    }
    this.history.get(key).push(newVersion);

    // Trim history to max size
    const hist = this.history.get(key);
    if (hist.length > this.maxHistorySize) {
      hist.splice(0, hist.length - this.maxHistorySize);
    }

    if (this.autoSave) {
      this.saveState();
    }

    this.emit('state-changed', {
      key,
      versionId,
      data,
      parentId,
      metadata,
    });

    return versionId;
  }

  /**
   * Merge state into existing value
   */
  merge(key, updates, metadata = {}) {
    const current = this.get(key) || {};
    const merged = { ...current, ...updates };
    return this.set(key, merged, { ...metadata, operation: 'merge' });
  }

  /**
   * Update with conflict detection
   */
  updateWithConflictDetection(key, data, metadata = {}) {
    const currentVersion = this.state.get(key);
    const versionId = `v_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const incomingVersion = new StateVersion(versionId, data, currentVersion?.parentId, metadata);

    if (!currentVersion) {
      this.state.set(key, incomingVersion);
      return { conflict: false, resolved: incomingVersion, versionId };
    }

    if (ConflictResolver.detectConflict(currentVersion, incomingVersion)) {
      const resolution = ConflictResolver.resolve(
        currentVersion,
        incomingVersion,
        this.conflictStrategy
      );

      if (resolution.resolved) {
        this.state.set(key, resolution.result);
        if (!this.history.has(key)) {
          this.history.set(key, []);
        }
        this.history.get(key).push(resolution.result);

        this.emit('conflict-resolved', {
          key,
          current: currentVersion.id,
          incoming: incomingVersion.id,
          resolved: resolution.result.id,
          strategy: this.conflictStrategy,
        });

        if (this.autoSave) {
          this.saveState();
        }

        return { conflict: true, resolved: resolution.result, versionId: resolution.result.id };
      }
    }

    this.state.set(key, incomingVersion);
    return { conflict: false, resolved: incomingVersion, versionId };
  }

  /**
   * Acquire lock for exclusive access
   */
  acquireLock(key, agentId, ttlMs = 30000) {
    if (!this.locks.has(key)) {
      this.locks.set(key, new LockManager(key));
    }

    const lockManager = this.locks.get(key);
    if (lockManager.isLocked() && lockManager.getLockOwner() !== agentId) {
      return null; // Lock held by other agent
    }

    const lockId = lockManager.acquireLock(agentId, ttlMs);
    this.emit('lock-acquired', { key, lockId, agentId, ttlMs });
    return lockId;
  }

  /**
   * Release lock
   */
  releaseLock(key, lockId) {
    const lockManager = this.locks.get(key);
    if (lockManager) {
      const released = lockManager.releaseLock(lockId);
      if (released) {
        this.emit('lock-released', { key, lockId });
      }
      return released;
    }
    return false;
  }

  /**
   * Renew lock TTL
   */
  renewLock(key, lockId, ttlMs = 30000) {
    const lockManager = this.locks.get(key);
    if (lockManager) {
      return lockManager.renewLock(lockId, ttlMs);
    }
    return false;
  }

  /**
   * Get state history for a key
   */
  getHistory(key, limit = 10) {
    const hist = this.history.get(key) || [];
    return hist.slice(-limit).map(v => v.toJSON());
  }

  /**
   * Rollback to previous version
   */
  rollback(key, versionId) {
    const hist = this.history.get(key) || [];
    const version = hist.find(v => v.id === versionId);

    if (!version) {
      throw new Error(`Version ${versionId} not found in history`);
    }

    const newVersion = new StateVersion(
      `v_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      version.data,
      version.id,
      { operation: 'rollback', rollbackFrom: versionId }
    );

    this.state.set(key, newVersion);
    hist.push(newVersion);

    this.emit('state-rollback', {
      key,
      fromVersion: versionId,
      toVersion: newVersion.id,
    });

    if (this.autoSave) {
      this.saveState();
    }

    return newVersion;
  }

  /**
   * Tag version for easy reference
   */
  tagVersion(key, versionId, tagName) {
    const version = this.state.get(key);
    if (version && version.id === versionId) {
      version.tag(tagName);
      return true;
    }

    const hist = this.history.get(key) || [];
    const histVersion = hist.find(v => v.id === versionId);
    if (histVersion) {
      histVersion.tag(tagName);
      return true;
    }

    return false;
  }

  /**
   * Get version by tag
   */
  getVersionByTag(key, tagName) {
    const current = this.state.get(key);
    if (current && current.tags.includes(tagName)) {
      return current;
    }

    const hist = this.history.get(key) || [];
    return hist.find(v => v.tags.includes(tagName));
  }

  /**
   * Compare two versions
   */
  compareVersions(key, versionId1, versionId2) {
    const getAllVersions = () => {
      const current = this.state.get(key);
      const currentArr = current ? [current] : [];
      const hist = this.history.get(key) || [];
      return [...hist, ...currentArr];
    };

    const all = getAllVersions();
    const v1 = all.find(v => v.id === versionId1);
    const v2 = all.find(v => v.id === versionId2);

    if (!v1 || !v2) {
      throw new Error('One or both versions not found');
    }

    return {
      version1: v1.toJSON(),
      version2: v2.toJSON(),
      checksumMatch: v1.checksum === v2.checksum,
      dataDiff: this._computeDiff(v1.data, v2.data),
    };
  }

  _computeDiff(obj1, obj2) {
    const diff = { added: {}, removed: {}, changed: {} };

    // Find changed/removed in obj1
    for (const key in obj1) {
      if (!(key in obj2)) {
        diff.removed[key] = obj1[key];
      } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
        diff.changed[key] = { from: obj1[key], to: obj2[key] };
      }
    }

    // Find added in obj2
    for (const key in obj2) {
      if (!(key in obj1)) {
        diff.added[key] = obj2[key];
      }
    }

    return diff;
  }

  /**
   * Delete state key
   */
  delete(key) {
    const hadValue = this.state.has(key);
    this.state.delete(key);
    return hadValue;
  }

  /**
   * Get all state keys
   */
  keys() {
    return Array.from(this.state.keys());
  }

  /**
   * Export entire state as snapshot
   */
  export() {
    const snapshot = {
      storeId: this.storeId,
      timestamp: Date.now(),
      state: {},
      history: {},
    };

    for (const [key, version] of this.state.entries()) {
      snapshot.state[key] = version.toJSON();
    }

    for (const [key, versions] of this.history.entries()) {
      snapshot.history[key] = versions.map(v => v.toJSON());
    }

    return snapshot;
  }

  /**
   * Save state to disk
   */
  saveState() {
    try {
      const snapshot = this.export();
      fs.writeFileSync(GLOBAL_STATE_PATH, JSON.stringify(snapshot, null, 2));

      // Also append to history log
      const logEntry = JSON.stringify({ timestamp: Date.now(), snapshot }) + '\n';
      fs.appendFileSync(STATE_HISTORY_PATH, logEntry);

      return true;
    } catch (error) {
      this.emit('error', { message: `Failed to save state: ${error.message}` });
      return false;
    }
  }

  /**
   * Load state from disk
   */
  loadState() {
    try {
      if (!fs.existsSync(GLOBAL_STATE_PATH)) {
        return false;
      }

      const data = fs.readFileSync(GLOBAL_STATE_PATH, 'utf-8');
      const snapshot = JSON.parse(data);

      // Restore state
      for (const [key, versionData] of Object.entries(snapshot.state)) {
        const version = new StateVersion(
          versionData.id,
          versionData.data,
          versionData.parentId,
          versionData.metadata
        );
        version.timestamp = versionData.timestamp;
        version.checksum = versionData.checksum;
        version.tags = versionData.tags || [];
        this.state.set(key, version);
      }

      // Restore history
      for (const [key, versionsData] of Object.entries(snapshot.history)) {
        const versions = versionsData.map(vData => {
          const v = new StateVersion(vData.id, vData.data, vData.parentId, vData.metadata);
          v.timestamp = vData.timestamp;
          v.checksum = vData.checksum;
          v.tags = vData.tags || [];
          return v;
        });
        this.history.set(key, versions);
      }

      return true;
    } catch (error) {
      this.emit('error', { message: `Failed to load state: ${error.message}` });
      return false;
    }
  }

  /**
   * Get metrics
   */
  getMetrics() {
    let totalHistorySize = 0;
    for (const versions of this.history.values()) {
      totalHistorySize += versions.length;
    }

    return {
      storeId: this.storeId,
      createdAt: this.createdAt,
      currentStateKeys: this.state.size,
      totalHistoryEntries: totalHistorySize,
      locks: Array.from(this.locks.entries()).map(([key, mgr]) => ({
        key,
        lockCount: mgr.locks.size,
        locks: mgr.getAllLocks(),
      })),
      maxHistorySize: this.maxHistorySize,
    };
  }
}

/**
 * CLI Demo and Testing
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
${COLORS.BOLD}state-management.js${COLORS.RESET} — Global state management with versioning & conflict resolution

${COLORS.BOLD}Usage:${COLORS.RESET}
  node state-management.js [command] [options]

${COLORS.BOLD}Commands:${COLORS.RESET}
  demo              Run interactive demo
  inspect           Inspect current state
  rollback          Rollback to previous version
  help              Show this help message

${COLORS.BOLD}Options:${COLORS.RESET}
  --conflict-strategy=STRATEGY   Conflict resolution: last_write_wins, merge (default: merge)
  --max-history=N                Max history entries per key (default: 100)

${COLORS.BOLD}Examples:${COLORS.RESET}
  node state-management.js demo
  node state-management.js inspect
    `);
    return;
  }

  if (args[0] === 'demo') {
    console.log(
      `\n${COLORS.BOLD}${COLORS.CYAN}╔════════════════════════════════════════════════════════════════╗${COLORS.RESET}`
    );
    console.log(
      `${COLORS.BOLD}${COLORS.CYAN}║${COLORS.RESET}  ${COLORS.BOLD}${COLORS.MAGENTA}GLOBAL STATE MANAGEMENT${COLORS.RESET}${COLORS.BOLD}${COLORS.CYAN}                           ║${COLORS.RESET}`
    );
    console.log(
      `${COLORS.BOLD}${COLORS.CYAN}║${COLORS.RESET}  Versioning, Conflict Resolution, Rollback${COLORS.BOLD}${COLORS.CYAN}                  ║${COLORS.RESET}`
    );
    console.log(
      `${COLORS.BOLD}${COLORS.CYAN}╚════════════════════════════════════════════════════════════════╝${COLORS.RESET}\n`
    );

    const store = new GlobalStateStore({ conflictStrategy: ConflictResolver.STRATEGIES.MERGE });

    // Set up event listeners
    store.on('state-changed', (event) => {
      console.log(
        `${COLORS.GREEN}[+]${COLORS.RESET} State changed: ${COLORS.CYAN}${event.key}${COLORS.RESET} v${event.versionId.substring(0, 8)}`
      );
    });

    store.on('conflict-resolved', (event) => {
      console.log(
        `${COLORS.YELLOW}[⚔]${COLORS.RESET} Conflict resolved (${event.strategy}): ${COLORS.YELLOW}${event.key}${COLORS.RESET}`
      );
    });

    store.on('lock-acquired', (event) => {
      console.log(
        `${COLORS.BLUE}[🔒]${COLORS.RESET} Lock acquired: ${event.key} by ${COLORS.MAGENTA}${event.agentId}${COLORS.RESET}`
      );
    });

    // Demo 1: Basic state operations
    console.log(`${COLORS.CYAN}[Demo 1]${COLORS.RESET} Basic state operations\n`);
    store.set('config', { debug: false, timeout: 5000 });
    store.merge('config', { debug: true });
    store.set('workflow', { status: 'pending', tasks: [] });

    // Demo 2: Conflict detection
    console.log(`\n${COLORS.CYAN}[Demo 2]${COLORS.RESET} Conflict detection & resolution\n`);
    const v1Id = store.set('agent_state', { agentId: 'A1', progress: 50, lastUpdate: Date.now() });
    store.tagVersion('agent_state', v1Id, 'checkpoint_1');

    // Simulate concurrent update
    store.updateWithConflictDetection('agent_state', {
      agentId: 'A1',
      progress: 75,
      lastUpdate: Date.now() + 100,
    });

    // Demo 3: Locking
    console.log(`\n${COLORS.CYAN}[Demo 3]${COLORS.RESET} Distributed locking\n`);
    const lockId1 = store.acquireLock('shared_resource', 'agent_1', 5000);
    console.log(
      `${COLORS.GREEN}✓${COLORS.RESET} Agent 1 acquired lock: ${COLORS.DIM}${lockId1}${COLORS.RESET}`
    );

    const lockId2 = store.acquireLock('shared_resource', 'agent_2', 5000);
    console.log(
      `${lockId2 ? COLORS.GREEN + '✓' : COLORS.RED + '✗'}${COLORS.RESET} Agent 2 ${
        lockId2 ? 'acquired' : 'denied'
      } lock`
    );

    store.releaseLock('shared_resource', lockId1);
    console.log(`${COLORS.GREEN}✓${COLORS.RESET} Agent 1 released lock`);

    // Demo 4: History & rollback
    console.log(`\n${COLORS.CYAN}[Demo 4]${COLORS.RESET} History & rollback\n`);
    const config1 = store.set('app_config', { version: '1.0.0', features: { auth: true } });
    const config2 = store.set('app_config', { version: '1.1.0', features: { auth: true, api: true } });
    const config3 = store.set('app_config', {
      version: '2.0.0',
      features: { auth: true, api: true, websocket: true },
    });

    console.log(`${COLORS.CYAN}History:${COLORS.RESET}`);
    store.getHistory('app_config').forEach((v, idx) => {
      console.log(`  ${idx + 1}. v${v.id.substring(0, 8)} - ${JSON.stringify(v.data)}`);
    });

    console.log(`\n${COLORS.YELLOW}Rolling back to v1...${COLORS.RESET}`);
    const config1Version = store.getHistory('app_config')[0];
    store.rollback('app_config', config1Version.id);
    console.log(`${COLORS.GREEN}✓${COLORS.RESET} Rolled back. Current:`, store.get('app_config'));

    // Demo 5: Comparison
    console.log(`\n${COLORS.CYAN}[Demo 5]${COLORS.RESET} Version comparison\n`);
    const config2Version = store.getHistory('app_config')[1];
    const comparison = store.compareVersions('app_config', config1Version.id, config2Version.id);
    console.log(`${COLORS.CYAN}Changes:${COLORS.RESET}`, JSON.stringify(comparison.dataDiff, null, 2));

    // Final report
    console.log(`\n${COLORS.BOLD}${COLORS.GREEN}═══ STATE MANAGEMENT DEMO COMPLETE ═══${COLORS.RESET}\n`);
    const metrics = store.getMetrics();
    console.log(`${COLORS.CYAN}Metrics:${COLORS.RESET}`);
    console.log(`  Store ID: ${COLORS.DIM}${metrics.storeId}${COLORS.RESET}`);
    console.log(`  Current state keys: ${metrics.currentStateKeys}`);
    console.log(`  Total history entries: ${metrics.totalHistoryEntries}`);
    console.log(`  Active locks: ${metrics.locks.reduce((sum, l) => sum + l.lockCount, 0)}`);

    store.saveState();
    console.log(`\n${COLORS.GREEN}✓${COLORS.RESET} State saved to ${COLORS.DIM}${GLOBAL_STATE_PATH}${COLORS.RESET}`);
  } else if (args[0] === 'inspect') {
    const store = new GlobalStateStore();
    const metrics = store.getMetrics();

    console.log(`\n${COLORS.BOLD}${COLORS.CYAN}State Store Inspection${COLORS.RESET}\n`);
    console.log(`Store ID: ${COLORS.DIM}${metrics.storeId}${COLORS.RESET}`);
    console.log(`State keys: ${metrics.currentStateKeys}`);
    console.log(`History entries: ${metrics.totalHistoryEntries}`);
    console.log(`Active locks: ${metrics.locks.length}`);

    console.log(`\n${COLORS.CYAN}State Keys:${COLORS.RESET}`);
    for (const key of store.keys()) {
      const version = store.getVersion(key);
      console.log(`  ${COLORS.MAGENTA}${key}${COLORS.RESET}: v${version.id.substring(0, 8)} (${version.tags.join(', ') || 'no tags'})`);
      console.log(`    Data: ${JSON.stringify(version.data)}`);
    }

    for (const lock of metrics.locks) {
      if (lock.lockCount > 0) {
        console.log(`\n${COLORS.CYAN}Locks for ${lock.key}:${COLORS.RESET}`);
        for (const l of lock.locks) {
          console.log(`  ${l.lockId} (${l.agentId}, expires ${new Date(l.expiresAt).toISOString()})`);
        }
      }
    }
  } else {
    process.argv.push('demo');
    main();
  }
}

module.exports = {
  GlobalStateStore,
  StateVersion,
  ConflictResolver,
  LockManager,
};

if (require.main === module) {
  main().catch((error) => {
    console.error(`${COLORS.RED}Error: ${error.message}${COLORS.RESET}`);
    process.exit(1);
  });
}
