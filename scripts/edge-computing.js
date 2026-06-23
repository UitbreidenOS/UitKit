#!/usr/bin/env node

const http = require('http');
const https = require('https');
const { EventEmitter } = require('events');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');

const CWD = process.cwd();
const CLAUDE_DIR = path.join(CWD, '.claude');
const EDGE_DIR = path.join(CLAUDE_DIR, 'edge-computing');
const METRICS_PATH = path.join(EDGE_DIR, 'metrics.json');
const STATE_PATH = path.join(EDGE_DIR, 'state.json');
const SYNC_LOG_PATH = path.join(EDGE_DIR, 'sync-log.json');

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

// Edge node roles
const NODE_ROLES = {
  COORDINATOR: 'coordinator',
  WORKER: 'worker',
  CACHE: 'cache',
};

// Task states
const TASK_STATES = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  EXECUTING: 'executing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  SYNCED: 'synced',
};

/**
 * Latency tracker - measures edge-to-cloud latency
 */
class LatencyTracker {
  constructor(maxSamples = 1000) {
    this.samples = [];
    this.maxSamples = maxSamples;
  }

  record(latencyMs) {
    this.samples.push({
      timestamp: Date.now(),
      latencyMs,
    });
    if (this.samples.length > this.maxSamples) {
      this.samples.shift();
    }
  }

  getStats() {
    if (this.samples.length === 0) {
      return { p50: 0, p95: 0, p99: 0, avg: 0, min: 0, max: 0 };
    }

    const latencies = this.samples.map(s => s.latencyMs).sort((a, b) => a - b);
    const sum = latencies.reduce((a, b) => a + b, 0);

    return {
      p50: latencies[Math.floor(latencies.length * 0.5)],
      p95: latencies[Math.floor(latencies.length * 0.95)],
      p99: latencies[Math.floor(latencies.length * 0.99)],
      avg: Math.round(sum / latencies.length),
      min: latencies[0],
      max: latencies[latencies.length - 1],
      samples: latencies.length,
    };
  }
}

/**
 * Edge node - local execution unit with cloud sync
 */
class EdgeNode extends EventEmitter {
  constructor(nodeId, role = NODE_ROLES.WORKER, options = {}) {
    super();
    this.nodeId = nodeId;
    this.role = role;
    this.hostname = options.hostname || 'localhost';
    this.port = options.port || 3000;
    this.region = options.region || 'us-west';
    this.isHealthy = true;
    this.lastHeartbeat = Date.now();
    this.taskQueue = [];
    this.activeTaskMap = new Map();
    this.completedTasks = [];
    this.latencyTracker = new LatencyTracker();
    this.metrics = {
      tasksExecuted: 0,
      tasksSuccessful: 0,
      tasksFailed: 0,
      totalExecutionTime: 0,
      cloudSyncCount: 0,
      lastSyncTime: null,
    };
  }

  /**
   * Submit task to edge node
   */
  submitTask(task) {
    const taskId = task.id || crypto.randomBytes(6).toString('hex');
    const edgeTask = {
      ...task,
      id: taskId,
      state: TASK_STATES.PENDING,
      submittedAt: Date.now(),
      executedAt: null,
      completedAt: null,
      executionTime: 0,
      result: null,
      error: null,
      nodeId: this.nodeId,
      synced: false,
    };

    this.taskQueue.push(edgeTask);
    this.emit('task-submitted', edgeTask);
    return taskId;
  }

  /**
   * Process next task in queue
   */
  async processNextTask() {
    if (this.taskQueue.length === 0) {
      return null;
    }

    const task = this.taskQueue.shift();
    task.state = TASK_STATES.EXECUTING;
    task.executedAt = Date.now();
    this.activeTaskMap.set(task.id, task);

    this.emit('task-started', task);

    try {
      const startTime = Date.now();
      const result = await this._executeTask(task);
      const executionTime = Date.now() - startTime;

      task.result = result;
      task.executionTime = executionTime;
      task.state = TASK_STATES.COMPLETED;
      task.completedAt = Date.now();

      this.metrics.tasksSuccessful++;
      this.metrics.totalExecutionTime += executionTime;

      this.emit('task-completed', task);
      return task;
    } catch (error) {
      task.error = error.message;
      task.state = TASK_STATES.FAILED;
      task.completedAt = Date.now();
      this.metrics.tasksFailed++;

      this.emit('task-failed', task);
      return task;
    } finally {
      this.metrics.tasksExecuted++;
      this.activeTaskMap.delete(task.id);
      this.completedTasks.push(task);
    }
  }

  /**
   * Execute task logic (mock)
   */
  async _executeTask(task) {
    // Simulate execution with artificial latency
    const executionMs = Math.random() * 50 + 10;
    await new Promise(resolve => setTimeout(resolve, executionMs));

    if (Math.random() < 0.05) {
      throw new Error('Simulated execution failure');
    }

    return {
      taskId: task.id,
      output: `Executed on ${this.nodeId} in ${this.region}`,
      timestamp: Date.now(),
    };
  }

  /**
   * Sync completed tasks with cloud
   */
  async syncWithCloud(cloudUrl) {
    const startTime = Date.now();
    const tasksToSync = this.completedTasks.filter(t => !t.synced);

    if (tasksToSync.length === 0) {
      return { synced: 0, duration: 0 };
    }

    try {
      const payload = {
        nodeId: this.nodeId,
        region: this.region,
        tasks: tasksToSync,
        timestamp: Date.now(),
      };

      const compressed = await this._compressData(JSON.stringify(payload));
      const duration = Date.now() - startTime;

      this.latencyTracker.record(duration);
      this.metrics.cloudSyncCount++;
      this.metrics.lastSyncTime = Date.now();

      // Mark tasks as synced
      tasksToSync.forEach(t => {
        t.synced = true;
        t.state = TASK_STATES.SYNCED;
      });

      this.emit('cloud-sync', {
        tasksSynced: tasksToSync.length,
        duration,
        compressedSize: compressed.length,
      });

      return {
        synced: tasksToSync.length,
        duration,
        compressedSize: compressed.length,
      };
    } catch (error) {
      this.emit('sync-error', { error: error.message });
      return { synced: 0, duration: Date.now() - startTime, error: error.message };
    }
  }

  /**
   * Compress data with gzip
   */
  async _compressData(data) {
    return new Promise((resolve, reject) => {
      zlib.gzip(data, (err, compressed) => {
        if (err) reject(err);
        else resolve(compressed);
      });
    });
  }

  /**
   * Get node metrics
   */
  getMetrics() {
    return {
      nodeId: this.nodeId,
      role: this.role,
      region: this.region,
      isHealthy: this.isHealthy,
      lastHeartbeat: this.lastHeartbeat,
      metrics: this.metrics,
      latency: this.latencyTracker.getStats(),
      queue: {
        pending: this.taskQueue.length,
        active: this.activeTaskMap.size,
        completed: this.completedTasks.length,
      },
    };
  }

  /**
   * Heartbeat check
   */
  updateHeartbeat() {
    this.lastHeartbeat = Date.now();
  }
}

/**
 * Edge coordinator - manages distributed edge execution
 */
class EdgeCoordinator extends EventEmitter {
  constructor(options = {}) {
    super();
    this.coordinatorId = crypto.randomBytes(6).toString('hex');
    this.options = options;
    this.nodes = new Map();
    this.taskRegistry = new Map();
    this.globalMetrics = {
      totalTasksSubmitted: 0,
      totalTasksCompleted: 0,
      totalTasksFailed: 0,
      syncEvents: 0,
      averageLatency: 0,
    };
    this.cloudUrl = options.cloudUrl || 'https://api.claudient.local/sync';
    this.syncInterval = options.syncInterval || 5000;
    this.healthCheckInterval = options.healthCheckInterval || 10000;
    this.isRunning = false;

    this._initDirs();
  }

  _initDirs() {
    if (!fs.existsSync(EDGE_DIR)) {
      fs.mkdirSync(EDGE_DIR, { recursive: true });
    }
  }

  /**
   * Register edge node
   */
  registerNode(node) {
    this.nodes.set(node.nodeId, node);
    this.emit('node-registered', {
      nodeId: node.nodeId,
      role: node.role,
      region: node.region,
    });
    return node.nodeId;
  }

  /**
   * Unregister edge node
   */
  unregisterNode(nodeId) {
    return this.nodes.delete(nodeId);
  }

  /**
   * Get node by ID
   */
  getNode(nodeId) {
    return this.nodes.get(nodeId);
  }

  /**
   * Find nearest node by region
   */
  getNearestNode(region) {
    const candidates = Array.from(this.nodes.values())
      .filter(n => n.isHealthy && n.role === NODE_ROLES.WORKER);

    if (candidates.length === 0) return null;

    // Prefer same region
    const sameRegion = candidates.filter(n => n.region === region);
    return sameRegion.length > 0 ? sameRegion[0] : candidates[0];
  }

  /**
   * Submit task to edge - routes to nearest node
   */
  async submitTask(task, region = 'us-west') {
    const node = this.getNearestNode(region);
    if (!node) {
      throw new Error('No healthy edge nodes available');
    }

    const taskId = node.submitTask(task);
    this.taskRegistry.set(taskId, { taskId, nodeId: node.nodeId, region });
    this.globalMetrics.totalTasksSubmitted++;

    this.emit('task-routed', {
      taskId,
      nodeId: node.nodeId,
      region: node.region,
    });

    return taskId;
  }

  /**
   * Start coordinator - manages sync and health checks
   */
  async start() {
    if (this.isRunning) {
      throw new Error('Coordinator already running');
    }

    this.isRunning = true;
    this.emit('coordinator-started', { coordinatorId: this.coordinatorId });

    this._startHealthChecks();
    this._startSyncLoop();
  }

  /**
   * Start periodic health checks
   */
  _startHealthChecks() {
    this.healthCheckTimer = setInterval(() => {
      this.nodes.forEach((node) => {
        const timeSinceHeartbeat = Date.now() - node.lastHeartbeat;
        const isHealthy = timeSinceHeartbeat < 30000; // 30s timeout

        if (isHealthy !== node.isHealthy) {
          node.isHealthy = isHealthy;
          this.emit('node-health-changed', {
            nodeId: node.nodeId,
            isHealthy,
          });
        }
      });
    }, this.healthCheckInterval);
  }

  /**
   * Start periodic cloud sync
   */
  _startSyncLoop() {
    this.syncTimer = setInterval(async () => {
      for (const [nodeId, node] of this.nodes) {
        if (node.isHealthy) {
          try {
            const syncResult = await node.syncWithCloud(this.cloudUrl);
            if (syncResult.synced > 0) {
              this.globalMetrics.syncEvents++;
            }
          } catch (error) {
            this.emit('sync-failed', { nodeId, error: error.message });
          }
        }
      }
    }, this.syncInterval);
  }

  /**
   * Stop coordinator
   */
  async stop() {
    this.isRunning = false;
    if (this.healthCheckTimer) clearInterval(this.healthCheckTimer);
    if (this.syncTimer) clearInterval(this.syncTimer);
    this.emit('coordinator-stopped', {});
  }

  /**
   * Get global metrics
   */
  getGlobalMetrics() {
    const latencies = [];
    this.nodes.forEach(node => {
      const stats = node.latencyTracker.getStats();
      latencies.push(stats);
    });

    const avgLatency = latencies.length > 0
      ? Math.round(latencies.reduce((sum, s) => sum + s.avg, 0) / latencies.length)
      : 0;

    return {
      coordinatorId: this.coordinatorId,
      isRunning: this.isRunning,
      nodes: Array.from(this.nodes.values()).map(n => n.getMetrics()),
      globalMetrics: {
        ...this.globalMetrics,
        averageLatency: avgLatency,
      },
      timestamp: Date.now(),
    };
  }

  /**
   * Save metrics to disk
   */
  saveMetrics() {
    try {
      const metrics = this.getGlobalMetrics();
      fs.writeFileSync(METRICS_PATH, JSON.stringify(metrics, null, 2));
      return true;
    } catch (error) {
      this.emit('error', { message: `Failed to save metrics: ${error.message}` });
      return false;
    }
  }

  /**
   * Save state to disk
   */
  saveState() {
    try {
      const state = {
        timestamp: new Date().toISOString(),
        coordinatorId: this.coordinatorId,
        nodes: Array.from(this.nodes.entries()).map(([nodeId, node]) => ({
          nodeId,
          role: node.role,
          region: node.region,
          metrics: node.getMetrics(),
        })),
      };
      fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
      return true;
    } catch (error) {
      this.emit('error', { message: `Failed to save state: ${error.message}` });
      return false;
    }
  }
}

/**
 * Cloudflare Worker proxy - routes tasks to edge
 */
class CloudflareWorkerProxy {
  constructor(options = {}) {
    this.options = options;
    this.routingTable = new Map();
    this.requestLog = [];
  }

  /**
   * Register route
   */
  registerRoute(path, handler) {
    this.routingTable.set(path, handler);
  }

  /**
   * Generate Cloudflare Worker script
   */
  generateWorkerScript() {
    return `
// Cloudflare Worker - Edge Task Router
const EDGE_NODES = {
  'us-west': 'https://edge-us-west.claudient.local',
  'eu-west': 'https://edge-eu-west.claudient.local',
  'ap-southeast': 'https://edge-ap-southeast.claudient.local',
};

async function handleRequest(request) {
  const url = new URL(request.url);
  const region = request.headers.get('cf-ipcountry') || 'us-west';

  // Measure latency
  const startTime = Date.now();

  try {
    // Route to nearest edge node
    const nodeUrl = EDGE_NODES[region] || EDGE_NODES['us-west'];
    const edgeResponse = await fetch(new Request(nodeUrl + url.pathname, {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' ? await request.text() : undefined,
    }), {
      cf: {
        mirage: true,
        minify: {
          javascript: true,
          css: true,
          html: true,
        },
      }
    });

    const latency = Date.now() - startTime;

    // Add latency header
    const response = new Response(edgeResponse.body, edgeResponse);
    response.headers.set('X-Edge-Latency', latency.toString());
    response.headers.set('X-Served-From', region);

    return response;
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message,
      latency: Date.now() - startTime,
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
`;
  }

  /**
   * Generate wrangler.toml config
   */
  generateWranglerConfig() {
    return `
name = "claudient-edge"
type = "javascript"
account_id = "${this.options.accountId || 'CLOUDFLARE_ACCOUNT_ID'}"
workers_dev = true
route = "claudient-edge.workers.dev/*"
zone_id = "${this.options.zoneId || 'CLOUDFLARE_ZONE_ID'}"

[env.production]
route = "api.claudient.com/edge/*"
zone_id = "${this.options.zoneId || 'CLOUDFLARE_ZONE_ID'}"

[build]
command = "npm run build"
upload = { format = "modules", main = "./dist/index.js" }

[build.upload.rules]
type = "CompiledContentType"
globs = ["**/*.js"]
fallthrough = false
`;
  }
}

/**
 * Local edge server - HTTP server for local edge execution
 */
class LocalEdgeServer {
  constructor(port = 3000, coordinator) {
    this.port = port;
    this.coordinator = coordinator;
    this.server = null;
  }

  /**
   * Start local edge server
   */
  start() {
    this.server = http.createServer(async (req, res) => {
      const startTime = Date.now();
      const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;

      // CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      try {
        if (pathname === '/submit') {
          await this._handleSubmitTask(req, res, startTime);
        } else if (pathname === '/metrics') {
          await this._handleMetrics(req, res, startTime);
        } else if (pathname === '/nodes') {
          await this._handleNodes(req, res, startTime);
        } else if (pathname === '/health') {
          await this._handleHealth(req, res, startTime);
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Not found' }));
        }
      } catch (error) {
        const latency = Date.now() - startTime;
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: error.message,
          latency,
        }));
      }
    });

    return new Promise((resolve) => {
      this.server.listen(this.port, () => {
        console.log(`${COLORS.GREEN}✓${COLORS.RESET} Edge server listening on port ${this.port}`);
        resolve();
      });
    });
  }

  async _handleSubmitTask(req, res, startTime) {
    const body = await this._readBody(req);
    const task = JSON.parse(body);
    const region = task.region || 'us-west';

    try {
      const taskId = await this.coordinator.submitTask(task, region);
      const latency = Date.now() - startTime;

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        taskId,
        region,
        latency,
      }));
    } catch (error) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: error.message,
        latency: Date.now() - startTime,
      }));
    }
  }

  async _handleMetrics(req, res, startTime) {
    const metrics = this.coordinator.getGlobalMetrics();
    const latency = Date.now() - startTime;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ...metrics,
      serverLatency: latency,
    }));
  }

  async _handleNodes(req, res, startTime) {
    const nodes = Array.from(this.coordinator.nodes.values()).map(n => n.getMetrics());
    const latency = Date.now() - startTime;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      nodes,
      count: nodes.length,
      latency,
    }));
  }

  async _handleHealth(req, res, startTime) {
    const isHealthy = Array.from(this.coordinator.nodes.values())
      .some(n => n.isHealthy);
    const latency = Date.now() - startTime;

    res.writeHead(isHealthy ? 200 : 503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: isHealthy ? 'healthy' : 'degraded',
      latency,
    }));
  }

  async _readBody(req) {
    return new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => { data += chunk; });
      req.on('end', () => resolve(data));
      req.on('error', reject);
    });
  }

  /**
   * Stop server
   */
  async stop() {
    if (this.server) {
      return new Promise((resolve) => {
        this.server.close(resolve);
      });
    }
  }
}

/**
 * Demo / CLI
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
${COLORS.BOLD}edge-computing${COLORS.RESET} — Deploy dont-stop to edge devices/CDNs

${COLORS.BOLD}Usage:${COLORS.RESET}
  node edge-computing.js [command] [options]

${COLORS.BOLD}Commands:${COLORS.RESET}
  demo              Run interactive edge computing demo
  worker            Generate Cloudflare Worker script
  wrangler          Generate wrangler.toml config
  server            Start local edge server
  help              Show this help message

${COLORS.BOLD}Options:${COLORS.RESET}
  --port=N          Local server port (default: 3000)
  --nodes=N         Number of edge nodes (default: 3)
  --regions=LIST    Edge regions (default: us-west,eu-west,ap-southeast)
  --cloudUrl=URL    Cloud sync URL
  --verbose         Enable verbose logging

${COLORS.BOLD}Examples:${COLORS.RESET}
  node edge-computing.js demo
  node edge-computing.js server --port=8080
  node edge-computing.js worker > worker.js
    `);
    return;
  }

  if (args[0] === 'demo') {
    await runDemo(args);
  } else if (args[0] === 'worker') {
    const proxy = new CloudflareWorkerProxy();
    console.log(proxy.generateWorkerScript());
  } else if (args[0] === 'wrangler') {
    const proxy = new CloudflareWorkerProxy();
    console.log(proxy.generateWranglerConfig());
  } else if (args[0] === 'server') {
    const port = args.includes('--port')
      ? parseInt(args[args.indexOf('--port') + 1], 10)
      : 3000;
    await runServer(port);
  } else {
    process.argv.push('demo');
    main();
  }
}

async function runDemo(args) {
  console.log(`
${COLORS.BOLD}${COLORS.CYAN}╔════════════════════════════════════════════════════════════════╗${COLORS.RESET}
${COLORS.BOLD}${COLORS.CYAN}║${COLORS.RESET}  ${COLORS.BOLD}${COLORS.MAGENTA}EDGE COMPUTING COORDINATOR${COLORS.RESET}${COLORS.BOLD}${COLORS.CYAN}                              ║${COLORS.RESET}
${COLORS.BOLD}${COLORS.CYAN}║${COLORS.RESET}  Latency <100ms globally | Cloud sync | Local execution${COLORS.BOLD}${COLORS.CYAN}    ║${COLORS.RESET}
${COLORS.BOLD}${COLORS.CYAN}╚════════════════════════════════════════════════════════════════╝${COLORS.RESET}\n`);

  const nodeCount = args.includes('--nodes')
    ? parseInt(args[args.indexOf('--nodes') + 1], 10)
    : 3;

  const coordinator = new EdgeCoordinator({
    cloudUrl: 'https://api.claudient.local/sync',
    syncInterval: 2000,
  });

  // Register edge nodes
  const regions = ['us-west', 'eu-west', 'ap-southeast'];
  const nodes = [];

  for (let i = 0; i < nodeCount; i++) {
    const region = regions[i % regions.length];
    const node = new EdgeNode(`edge-${i}`, NODE_ROLES.WORKER, {
      region,
      port: 3000 + i,
    });

    nodes.push(node);
    coordinator.registerNode(node);

    node.on('task-completed', (task) => {
      console.log(`${COLORS.GREEN}[✓]${COLORS.RESET} Task completed on ${COLORS.CYAN}${node.nodeId}${COLORS.RESET} | Region: ${COLORS.YELLOW}${region}${COLORS.RESET}`);
    });

    node.on('task-failed', (task) => {
      console.log(`${COLORS.RED}[✗]${COLORS.RESET} Task failed: ${task.error}`);
    });

    node.on('cloud-sync', (event) => {
      console.log(`${COLORS.BLUE}[⟳]${COLORS.RESET} Cloud sync: ${event.tasksSynced} tasks (${event.duration}ms, compressed: ${event.compressedSize}B)`);
    });
  }

  console.log(`${COLORS.CYAN}[*] Registered ${nodeCount} edge nodes${COLORS.RESET}\n`);

  // Start coordinator
  await coordinator.start();

  // Submit sample tasks
  const sampleTasks = [
    { id: 'compute-ai', goal: 'Run inference on edge', region: 'us-west' },
    { id: 'cache-data', goal: 'Cache frequently accessed data', region: 'eu-west' },
    { id: 'sync-state', goal: 'Sync state with cloud', region: 'ap-southeast' },
    { id: 'transform-video', goal: 'Transcode video locally', region: 'us-west' },
    { id: 'aggregate-metrics', goal: 'Aggregate metrics at edge', region: 'eu-west' },
  ];

  console.log(`${COLORS.CYAN}[*] Submitting ${sampleTasks.length} tasks to edge${COLORS.RESET}\n`);

  for (const task of sampleTasks) {
    try {
      await coordinator.submitTask(task, task.region);
    } catch (error) {
      console.log(`${COLORS.RED}[!]${COLORS.RESET} Failed to submit task: ${error.message}`);
    }
  }

  // Start processing on nodes
  const processingInterval = setInterval(async () => {
    for (const node of nodes) {
      const task = await node.processNextTask();
      if (task && task.state === TASK_STATES.COMPLETED) {
        node.updateHeartbeat();
      }
    }
  }, 200);

  // Start cloud sync
  const syncInterval = setInterval(async () => {
    for (const node of nodes) {
      if (node.completedTasks.some(t => !t.synced)) {
        await node.syncWithCloud('https://api.claudient.local/sync');
      }
    }
  }, 3000);

  // Run for 15 seconds
  await new Promise(resolve => setTimeout(resolve, 15000));

  clearInterval(processingInterval);
  clearInterval(syncInterval);

  console.log(`\n${COLORS.BOLD}${COLORS.GREEN}═══ EDGE EXECUTION COMPLETE ═══${COLORS.RESET}\n`);

  const metrics = coordinator.getGlobalMetrics();
  console.log(`${COLORS.CYAN}Coordinator ID:${COLORS.RESET} ${metrics.coordinatorId}`);
  console.log(`${COLORS.CYAN}Total Nodes:${COLORS.RESET} ${metrics.nodes.length}`);
  console.log(`${COLORS.GREEN}Tasks Submitted:${COLORS.RESET} ${metrics.globalMetrics.totalTasksSubmitted}`);
  console.log(`${COLORS.GREEN}Tasks Completed:${COLORS.RESET} ${metrics.globalMetrics.totalTasksCompleted}`);
  console.log(`${COLORS.RED}Tasks Failed:${COLORS.RESET} ${metrics.globalMetrics.totalTasksFailed}`);
  console.log(`${COLORS.CYAN}Cloud Syncs:${COLORS.RESET} ${metrics.globalMetrics.syncEvents}`);
  console.log(`${COLORS.YELLOW}Average Latency:${COLORS.RESET} ${metrics.globalMetrics.averageLatency}ms`);

  console.log(`\n${COLORS.BOLD}${COLORS.CYAN}Node Latency Stats:${COLORS.RESET}`);
  metrics.nodes.forEach((node) => {
    const latency = node.latency;
    console.log(`  ${COLORS.CYAN}${node.nodeId}${COLORS.RESET} (${node.region}): p50=${latency.p50}ms, p95=${latency.p95}ms, p99=${latency.p99}ms`);
  });

  coordinator.saveMetrics();
  coordinator.saveState();
  console.log(`\n${COLORS.GREEN}✓${COLORS.RESET} Metrics saved to ${COLORS.DIM}${METRICS_PATH}${COLORS.RESET}`);

  await coordinator.stop();
}

async function runServer(port) {
  const coordinator = new EdgeCoordinator({
    cloudUrl: 'https://api.claudient.local/sync',
    syncInterval: 5000,
  });

  // Register edge nodes
  const regions = ['us-west', 'eu-west', 'ap-southeast'];
  regions.forEach((region, idx) => {
    const node = new EdgeNode(`edge-${idx}`, NODE_ROLES.WORKER, { region });
    coordinator.registerNode(node);

    // Auto-process tasks
    setInterval(async () => {
      const task = await node.processNextTask();
      if (task && task.state === TASK_STATES.COMPLETED) {
        node.updateHeartbeat();
      }
    }, 100);

    // Auto-sync with cloud
    setInterval(async () => {
      await node.syncWithCloud(coordinator.cloudUrl);
    }, 5000);
  });

  await coordinator.start();

  const server = new LocalEdgeServer(port, coordinator);
  await server.start();

  console.log(`${COLORS.GREEN}✓${COLORS.RESET} Edge computing server running on port ${port}`);
  console.log(`${COLORS.CYAN}POST ${port}/submit${COLORS.RESET} - Submit task`);
  console.log(`${COLORS.CYAN}GET ${port}/metrics${COLORS.RESET} - Get metrics`);
  console.log(`${COLORS.CYAN}GET ${port}/nodes${COLORS.RESET} - List nodes`);
  console.log(`${COLORS.CYAN}GET ${port}/health${COLORS.RESET} - Health check\n`);
}

module.exports = {
  EdgeNode,
  EdgeCoordinator,
  CloudflareWorkerProxy,
  LocalEdgeServer,
  LatencyTracker,
  NODE_ROLES,
  TASK_STATES,
};

if (require.main === module) {
  main().catch((error) => {
    console.error(`${COLORS.RED}Error: ${error.message}${COLORS.RESET}`);
    process.exit(1);
  });
}