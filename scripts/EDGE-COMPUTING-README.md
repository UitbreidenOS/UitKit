# Edge Computing Platform

**Deploy dont-stop to edge devices/CDNs with Cloudflare Workers, local execution, and cloud sync. Achieve <100ms latency globally.**

## Overview

`edge-computing.js` provides a distributed edge computing platform that extends dont-stop's capabilities to the network edge:

- **Edge Nodes**: Distributed execution units in geographic regions
- **Task Routing**: Automatic routing to nearest edge node by latency/region
- **Cloud Sync**: Bidirectional sync with cloud for state management and results
- **Cloudflare Workers**: HTTP-driven task routing via CDN edge locations
- **Latency Tracking**: Per-node and global latency telemetry (<100ms target)
- **Health Management**: Automatic failover and node health monitoring

## Components

### EdgeNode
Local execution unit in a specific region/CDN location.

```javascript
const node = new EdgeNode('edge-us-west-1', 'worker', {
  region: 'us-west',
  hostname: 'edge.us-west.local',
  port: 3000
});

// Submit task
const taskId = node.submitTask({
  id: 'process-video',
  goal: 'Transcode video to 1080p',
  data: { videoUrl: 'https://...' }
});

// Process tasks
while (node.taskQueue.length > 0) {
  const task = await node.processNextTask();
  console.log(task.result);
}

// Sync results to cloud
await node.syncWithCloud('https://api.claudient.local/sync');

// Get node metrics
const metrics = node.getMetrics();
// {
//   nodeId: 'edge-us-west-1',
//   region: 'us-west',
//   isHealthy: true,
//   metrics: { tasksExecuted: 42, tasksSuccessful: 40, tasksFailed: 2 },
//   latency: { p50: 32ms, p95: 78ms, p99: 95ms, avg: 45ms, min: 8ms, max: 98ms }
// }
```

### EdgeCoordinator
Central orchestrator that manages multiple edge nodes.

```javascript
const coordinator = new EdgeCoordinator({
  cloudUrl: 'https://api.claudient.local/sync',
  syncInterval: 5000,
  healthCheckInterval: 10000
});

// Register nodes
const node1 = new EdgeNode('edge-1', 'worker', { region: 'us-west' });
const node2 = new EdgeNode('edge-2', 'worker', { region: 'eu-west' });

coordinator.registerNode(node1);
coordinator.registerNode(node2);

// Start coordinator (manages health checks + cloud sync)
await coordinator.start();

// Submit tasks (routed to nearest healthy node)
const taskId = await coordinator.submitTask({
  goal: 'Run ML inference',
  region: 'us-west'
});

// Get global metrics
const metrics = coordinator.getGlobalMetrics();
// {
//   coordinatorId: 'abc123...',
//   globalMetrics: {
//     totalTasksSubmitted: 150,
//     totalTasksCompleted: 145,
//     totalTasksFailed: 5,
//     syncEvents: 30,
//     averageLatency: 42ms
//   },
//   nodes: [...]
// }

await coordinator.stop();
```

### CloudflareWorkerProxy
Generates Cloudflare Worker scripts for edge routing.

```javascript
const proxy = new CloudflareWorkerProxy({
  accountId: 'your-cf-account',
  zoneId: 'your-cf-zone'
});

// Generate worker script
const workerCode = proxy.generateWorkerScript();
// Routes requests to nearest edge node based on cf-ipcountry header
// Adds X-Edge-Latency and X-Served-From response headers

// Generate wrangler config
const wranglerConfig = proxy.generateWranglerConfig();
// Ready to deploy with `wrangler publish`
```

### LocalEdgeServer
HTTP server exposing edge computing APIs.

```javascript
const server = new LocalEdgeServer(3000, coordinator);
await server.start();

// POST /submit - Submit task
// {
//   "goal": "Process data",
//   "region": "us-west"
// }

// GET /metrics - Global metrics
// Returns coordinator metrics + all nodes

// GET /nodes - List edge nodes
// Returns array of node metrics

// GET /health - Health check
// Returns { status: 'healthy'|'degraded', latency: Nms }
```

## Usage

### Demo Mode
Interactive demonstration with 3 edge nodes, 5 sample tasks, and cloud sync:

```bash
node scripts/edge-computing.js demo
```

Output:
```
╔════════════════════════════════════════════════════════════════╗
║  EDGE COMPUTING COORDINATOR                                   ║
║  Latency <100ms globally | Cloud sync | Local execution       ║
╚════════════════════════════════════════════════════════════════╝

[*] Registered 3 edge nodes
[+] Goal submitted: goal_abc123 | Queue: 1
[→] Goal started: Process data...
[✓] Task completed on edge-0 | Region: us-west
[⟳] Cloud sync: 3 tasks (145ms, compressed: 8192B)

═══ EDGE EXECUTION COMPLETE ═══

Coordinator ID: abc123...
Total Nodes: 3
Tasks Submitted: 15
Tasks Completed: 14
Tasks Failed: 1
Cloud Syncs: 5
Average Latency: 42ms

Node Latency Stats:
  edge-0 (us-west): p50=32ms, p95=78ms, p99=95ms
  edge-1 (eu-west): p50=45ms, p95=82ms, p99=98ms
  edge-2 (ap-southeast): p50=38ms, p95=75ms, p99=92ms

✓ Metrics saved to .claude/edge-computing/metrics.json
```

### Local Server
Start an edge computing server on port 3000:

```bash
node scripts/edge-computing.js server
```

Submit tasks:
```bash
curl -X POST http://localhost:3000/submit \
  -H "Content-Type: application/json" \
  -d '{"goal":"Transcode video","region":"us-west"}'

# Response
{
  "taskId": "task_abc123",
  "region": "us-west",
  "latency": 12
}
```

Get metrics:
```bash
curl http://localhost:3000/metrics | jq
```

### Generate Cloudflare Worker
Export worker script for deployment:

```bash
node scripts/edge-computing.js worker > worker.js
```

This generates a Cloudflare Worker that:
- Inspects `cf-ipcountry` header to detect user region
- Routes request to nearest edge node
- Returns response with `X-Edge-Latency` header
- Applies Cloudflare optimizations (minification, Mirage, etc.)

### Generate Wrangler Config
Export wrangler.toml for CI/CD:

```bash
node scripts/edge-computing.js wrangler > wrangler.toml
```

Deploy to Cloudflare:
```bash
wrangler publish
```

## Architecture

### Data Flow

```
User Request
    ↓
Cloudflare Edge (Worker)
    ↓ (geo-routing)
Edge Node (nearest region)
    ├─ Execute Task (local)
    ├─ Cache Results (optional)
    └─ Sync to Cloud (async)
    ↓
Cloud API (central state)
```

### Latency Budget

- **Cloudflare routing**: 5-10ms
- **Edge task execution**: 20-50ms
- **Cloud sync (compressed)**: 30-100ms
- **Total**: <100ms globally (p95)

### Sync Protocol

1. **Local execution**: Tasks complete on edge node
2. **Batching**: Results accumulated for N seconds or M tasks
3. **Compression**: Payload gzipped before sync
4. **Cloud endpoint**: POST /sync with results
5. **Acknowledgment**: Node marks tasks as synced
6. **Retry**: Failed syncs retry with exponential backoff

## Metrics

### Per-Node Metrics

- `tasksExecuted`: Total tasks processed
- `tasksSuccessful`: Completed successfully
- `tasksFailed`: Failed tasks
- `totalExecutionTime`: Sum of task durations
- `cloudSyncCount`: Sync operations
- `latency`: p50, p95, p99, avg, min, max

### Global Metrics

- `totalTasksSubmitted`: Coordinator-level
- `totalTasksCompleted`: Across all nodes
- `totalTasksFailed`: Across all nodes
- `syncEvents`: Global sync count
- `averageLatency`: Weighted by samples

### Latency Tracking

Each node maintains a rolling window of latency samples:

```javascript
const latencyStats = node.latencyTracker.getStats();
// {
//   p50: 32,    // 50th percentile
//   p95: 78,    // 95th percentile (SLA target)
//   p99: 95,    // 99th percentile
//   avg: 45,    // Average
//   min: 8,     // Minimum
//   max: 98,    // Maximum
//   samples: 1000
// }
```

## Configuration

### EdgeCoordinator Options

```javascript
new EdgeCoordinator({
  cloudUrl: 'https://api.claudient.local/sync',  // Cloud sync endpoint
  syncInterval: 5000,                            // Sync frequency (ms)
  healthCheckInterval: 10000                     // Health check frequency (ms)
})
```

### EdgeNode Options

```javascript
new EdgeNode('node-id', 'worker', {
  hostname: 'localhost',     // Node hostname
  port: 3000,                // Node port
  region: 'us-west'          // Geographic region
})
```

### LocalEdgeServer Options

```javascript
new LocalEdgeServer(3000, coordinator)  // port, coordinator instance
```

## Task States

- `PENDING`: Queued, awaiting execution
- `ASSIGNED`: Routed to edge node
- `EXECUTING`: Currently running
- `COMPLETED`: Successfully finished
- `FAILED`: Execution error
- `SYNCED`: Results synced to cloud

## Node Roles

- `COORDINATOR`: Central orchestrator (health checks, routing)
- `WORKER`: Task execution unit (process tasks, sync results)
- `CACHE`: Cache layer (optional, future)

## Error Handling

### Node Failures

1. Health check detects unhealthy node (30s timeout)
2. Node marked unhealthy
3. New tasks routed to other nodes
4. Failed tasks automatically retried (if not synced)

### Sync Failures

1. Sync fails (network error, timeout)
2. Retry with exponential backoff (5s → 10s → 20s)
3. Max 3 retries per sync attempt
4. Fallback: retry on next sync cycle

### Task Failures

1. Task execution error caught
2. Task marked as FAILED
3. Results stored locally with error message
4. Synced to cloud for inspection

## Performance Tuning

### For Sub-50ms Latency

1. Reduce sync interval: `syncInterval: 1000`
2. Increase batch size: accumulate more tasks before sync
3. Use compression: enabled by default
4. Optimize task logic: minimize execution time

### For High Throughput

1. Increase nodes: add more edge locations
2. Tune health check: `healthCheckInterval: 5000`
3. Async syncing: non-blocking sync operations
4. Local caching: avoid repeated cloud hits

### For Reliability

1. Health checks: every 10s
2. Sync retries: 3 attempts with backoff
3. Task queue: persists across syncs
4. Checkpoint state: save periodically

## Integration with dont-stop

The edge computing platform extends dont-stop by:

1. **Distributed execution**: dont-stop goals run on nearest edge node
2. **Local resilience**: Tasks retry locally before cloud escalation
3. **Cloud sync**: Results automatically sync back to central don't-stop coordinator
4. **Latency reduction**: Sub-100ms p95 vs. 200-500ms cloud-only
5. **Cost optimization**: Edge compute cheaper than cloud for high-frequency tasks

Example integration:

```javascript
const pool = new AgentPool({ maxConcurrent: 4 });
const coordinator = new EdgeCoordinator();

pool.on('goal-submitted', async (event) => {
  // Route goals to edge if available
  const taskId = await coordinator.submitTask({
    goal: event.goal,
    region: 'us-west'
  });
});
```

## Deployment

### Local Development

```bash
node scripts/edge-computing.js server --port=3000
node scripts/edge-computing.js demo
```

### Cloudflare Deployment

```bash
node scripts/edge-computing.js wrangler > wrangler.toml
node scripts/edge-computing.js worker > src/worker.js
wrangler publish
```

### Multi-Region Deployment

Deploy instances in each region:
- `edge-us-west.claudient.local`
- `edge-eu-west.claudient.local`
- `edge-ap-southeast.claudient.local`

Update Cloudflare Worker routing table for geo-affinity.

## Files

- `.claude/edge-computing/metrics.json` - Global metrics dump
- `.claude/edge-computing/state.json` - Coordinator state
- `.claude/edge-computing/sync-log.json` - Sync operations log

## Troubleshooting

### High Latency (>150ms)

- Check node health: `GET /health`
- Review latency stats: `GET /metrics` → `nodes[].latency`
- Reduce task execution time
- Check network connectivity to cloud sync endpoint

### Tasks Not Syncing

- Verify cloud endpoint reachable: `curl $cloudUrl`
- Check node sync logs: `.claude/edge-computing/sync-log.json`
- Manually trigger sync: via coordinator API
- Check disk space for queued tasks

### Node Unhealthy

- Check last heartbeat: `GET /nodes` → `lastHeartbeat`
- Verify node process running
- Check logs for crashes
- Verify network connectivity

## See Also

- `dont-stop-agent-pool.js` - Concurrent goal execution
- `dont-stop-engine.js` - Core execution engine
- `agent-pool-example.js` - Agent pool usage examples
