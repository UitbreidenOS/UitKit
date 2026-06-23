# Edge Computing Deployment Guide

Deploy dont-stop to edge locations (Cloudflare Workers, regional servers, CDNs) for <100ms global latency.

## Quick Start

### Local Development
```bash
# Start edge server on port 3000
node scripts/edge-computing.js server

# In another terminal, submit tasks
curl -X POST http://localhost:3000/submit \
  -H "Content-Type: application/json" \
  -d '{"goal":"Process data","region":"us-west"}'

# Get metrics
curl http://localhost:3000/metrics | jq
```

### Demo Mode
Run interactive demo with 3 edge nodes, 5 tasks, cloud sync:
```bash
node scripts/edge-computing.js demo
```

## Deployment Architectures

### Architecture 1: Local Development (Single Node)
For testing on a developer machine.

```
┌─────────────────────┐
│  Local Edge Server  │
│  (port 3000)        │
│  - 1 edge node      │
│  - Local sync       │
│  - HTTP API         │
└─────────────────────┘
      ↑       ↓
   Submit   Results
```

```bash
node scripts/edge-computing.js server --port=3000
```

### Architecture 2: Multi-Region Edge Deployment
Deploy regional edge servers with cloud sync.

```
                  Cloud API
                 (State Sync)
                      ↑
          ┌───────────┼───────────┐
          │           │           │
    ┌─────▼──┐  ┌─────▼──┐  ┌─────▼──┐
    │ US-West│  │ EU-West│  │ AP-SE   │
    │ Server │  │ Server │  │ Server  │
    └────▲───┘  └────▲───┘  └────▲───┘
         │           │           │
    ┌────┴───────────┴───────────┴────┐
    │     Client Requests (DNS)       │
    └─────────────────────────────────┘
```

**Deploy 3 edge servers:**

```bash
# US-West
node scripts/edge-computing.js server --port=3000 &

# EU-West (different machine)
node scripts/edge-computing.js server --port=3000 &

# AP-Southeast (different machine)
node scripts/edge-computing.js server --port=3000 &
```

DNS round-robin or geolocation routing to nearest server.

### Architecture 3: Cloudflare Workers (CDN Edge)
Deploy to Cloudflare's global edge network via Workers.

```
          User Request
                ↓
    ┌───────────────────────┐
    │  Cloudflare Workers   │
    │  (Global Edge)        │
    │  - Routing            │
    │  - Request forwarding │
    │  - Response caching   │
    └───────────────────────┘
                ↓
    ┌───────────────────────┐
    │  Origin Edge Servers  │
    │  (Regional)           │
    │  - Task execution     │
    │  - Cloud sync         │
    └───────────────────────┘
```

**Deploy to Cloudflare:**

```bash
# Generate worker script
node scripts/edge-computing.js worker > src/worker.js

# Generate wrangler config
node scripts/edge-computing.js wrangler > wrangler.toml

# Configure with your Cloudflare details
# Edit wrangler.toml: replace CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_ZONE_ID

# Deploy
wrangler publish

# Verify
curl https://claudient-edge.workers.dev/health
```

### Architecture 4: Hybrid (Workers + Regional Servers)
Best of both worlds: Workers route to regional servers.

```
              User in SF
                 ↓
         Cloudflare SFO PoP
                 ↓
    ┌──────────────────────┐
    │  Worker (CF SFO)     │
    │  - Detect region     │
    │  - Route to origin   │
    └──────────────────────┘
                ↓
         ┌──────────────────┐
         │  Origin Server   │
         │  (US-West)       │
         │  - Execute task  │
         │  - Sync to cloud │
         └──────────────────┘
```

**Setup:**

1. Deploy origin servers (regional)
2. Deploy Cloudflare Worker that routes to origins
3. Worker reads `cf-ipcountry` header for geolocation
4. Returns response with `X-Edge-Latency` header

## Step-by-Step Deployment

### Step 1: Prepare Edge Nodes

Create configuration for each region:

```javascript
// config/edge-nodes.json
{
  "nodes": [
    {
      "id": "edge-us-west-1",
      "region": "us-west",
      "hostname": "edge-us-west.claudient.com",
      "port": 3000,
      "cloudUrl": "https://api.claudient.com/sync"
    },
    {
      "id": "edge-eu-west-1",
      "region": "eu-west",
      "hostname": "edge-eu-west.claudient.com",
      "port": 3000,
      "cloudUrl": "https://api.claudient.com/sync"
    }
  ]
}
```

### Step 2: Start Edge Servers

**Option A: systemd (Linux)**

Create `/etc/systemd/system/edge-server.service`:
```ini
[Unit]
Description=Claudient Edge Server
After=network.target

[Service]
Type=simple
User=claudient
WorkingDirectory=/opt/claudient
ExecStart=/usr/bin/node scripts/edge-computing.js server --port=3000
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable edge-server
sudo systemctl start edge-server
sudo systemctl status edge-server
```

**Option B: Docker**

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY scripts/ /app/scripts/
EXPOSE 3000
CMD ["node", "scripts/edge-computing.js", "server", "--port=3000"]
```

Build and run:
```bash
docker build -t claudient-edge .

docker run -d \
  --name edge-us-west \
  -p 3000:3000 \
  -e REGION=us-west \
  -e CLOUD_URL=https://api.claudient.com/sync \
  claudient-edge

docker run -d \
  --name edge-eu-west \
  -p 3000:3000 \
  -e REGION=eu-west \
  -e CLOUD_URL=https://api.claudient.com/sync \
  claudient-edge
```

**Option C: Kubernetes**

Create `k8s/edge-deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: claudient-edge
spec:
  replicas: 3
  selector:
    matchLabels:
      app: claudient-edge
  template:
    metadata:
      labels:
        app: claudient-edge
    spec:
      containers:
      - name: edge
        image: claudient-edge:latest
        ports:
        - containerPort: 3000
        env:
        - name: REGION
          valueFrom:
            fieldRef:
              fieldPath: metadata.labels['region']
        - name: CLOUD_URL
          value: "https://api.claudient.com/sync"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 10
```

Deploy:
```bash
kubectl apply -f k8s/edge-deployment.yaml
kubectl get pods -l app=claudient-edge
```

### Step 3: Configure Load Balancing

**Option A: DNS Round-Robin**
```
edge.claudient.com
  ├─ 1.2.3.4 (US-West)
  ├─ 5.6.7.8 (EU-West)
  └─ 9.10.11.12 (AP-SE)
```

**Option B: Geolocation-based DNS (Route53, Cloudflare)**

Route53 (AWS):
```bash
aws route53 create-resource-record-set \
  --hosted-zone-id Z123456 \
  --resource-record-set \
  '{
    "Name": "edge.claudient.com",
    "Type": "A",
    "SetIdentifier": "US-West",
    "GeoLocation": {"CountryCode": "US"},
    "TTL": 300,
    "ResourceRecords": [{"Value": "1.2.3.4"}]
  }'
```

Cloudflare:
```
Domain: edge.claudient.com
Routing: Geo
  - Nearest to US-West → 1.2.3.4
  - Nearest to EU-West → 5.6.7.8
  - Nearest to AP-SE → 9.10.11.12
```

### Step 4: Configure Cloud Sync

Update `.env` or config:
```bash
# .env
CLOUD_API_URL=https://api.claudient.com
CLOUD_SYNC_INTERVAL=5000
CLOUD_SYNC_BATCH_SIZE=100
```

### Step 5: Deploy to Cloudflare Workers (Optional)

```bash
# Generate and deploy
node scripts/edge-computing.js worker > src/worker.js
node scripts/edge-computing.js wrangler > wrangler.toml

# Edit wrangler.toml with your Cloudflare credentials
nano wrangler.toml

# Deploy
wrangler publish

# Test
curl https://claudient-edge.workers.dev/health \
  -H "cf-ipcountry: US"
```

## Monitoring

### Health Checks

```bash
# All nodes health
curl http://edge-us-west.claudient.com:3000/health
curl http://edge-eu-west.claudient.com:3000/health
curl http://edge-ap-se.claudient.com:3000/health

# Response
{"status":"healthy","latency":5}
```

### Metrics Collection

```bash
# Collect metrics from each node
curl http://edge-us-west.claudient.com:3000/metrics > metrics-us-west.json
curl http://edge-eu-west.claudient.com:3000/metrics > metrics-eu-west.json

# Aggregate
jq -s 'map(.globalMetrics) | add' metrics-*.json
```

### Prometheus Integration

Create `prometheus.yml`:
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'edge-nodes'
    static_configs:
      - targets: ['edge-us-west.local:3000', 'edge-eu-west.local:3000']
    metrics_path: '/metrics'
```

### CloudWatch (AWS)

```javascript
// Log metrics to CloudWatch
const CloudWatch = require('aws-sdk').CloudWatch;
const cw = new CloudWatch();

const metrics = coordinator.getGlobalMetrics();

cw.putMetricData({
  Namespace: 'Claudient/Edge',
  MetricData: [
    {
      MetricName: 'AverageLatency',
      Value: metrics.globalMetrics.averageLatency,
      Unit: 'Milliseconds'
    },
    {
      MetricName: 'TasksCompleted',
      Value: metrics.globalMetrics.totalTasksCompleted,
      Unit: 'Count'
    }
  ]
}, (err) => {
  if (err) console.error(err);
});
```

## Performance Tuning

### Latency Optimization

```javascript
const coordinator = new EdgeCoordinator({
  syncInterval: 1000,        // Faster sync (default 5000)
  healthCheckInterval: 5000, // Faster health checks
});

// Results: p95 <50ms globally
```

### Throughput Optimization

```javascript
// Batch more tasks before sync
const node = new EdgeNode('edge-1', 'worker', {
  batchSize: 100,      // Sync every 100 tasks
  batchTimeout: 5000,  // Or every 5 seconds
});
```

### Cost Optimization

```javascript
// Increase sync interval to reduce bandwidth
syncInterval: 30000,  // Sync every 30 seconds

// Compression enabled by default (gzip)
// Saves ~70% bandwidth
```

## Troubleshooting

### High Latency

```bash
# Check node latency
curl http://edge-node:3000/metrics | jq '.nodes[].latency'

# Expected: p95 < 100ms, p99 < 200ms

# If high, check:
# - Network connectivity
# - Cloud sync endpoint reachability
# - Task execution complexity
```

### Nodes Unhealthy

```bash
# Check node status
curl http://edge-node:3000/health

# Check logs
tail -f /var/log/claudient/edge-server.log

# Verify process running
ps aux | grep edge-computing
```

### Tasks Not Syncing

```bash
# Check sync log
cat .claude/edge-computing/sync-log.json

# Test cloud endpoint
curl https://api.claudient.com/sync

# Manually trigger sync
# (via API or restart node)
```

## Migration Checklist

- [ ] Generate Cloudflare Worker script
- [ ] Configure wrangler.toml with credentials
- [ ] Deploy origin edge servers (3+ regions)
- [ ] Set up DNS/geolocation routing
- [ ] Deploy Cloudflare Worker
- [ ] Configure cloud sync endpoint
- [ ] Set up monitoring/metrics collection
- [ ] Run load tests
- [ ] Monitor latency (target: <100ms p95)
- [ ] Test failover (node down → reroute)
- [ ] Document runbooks
- [ ] Train ops team
- [ ] Plan rollback procedure

## Rollback Plan

If edge deployment fails:

1. Stop Cloudflare Worker (pause routing)
2. Health check edge nodes
3. If nodes down, revert to cloud-only routing
4. Investigate issues
5. Fix and redeploy

```bash
# Temporarily disable Worker
wrangler unpublish

# Revert to cloud-only
# Update DNS to point to origin API

# After fix, redeploy
wrangler publish
```

## See Also

- `edge-computing.js` - Main implementation
- `EDGE-COMPUTING-README.md` - API reference
- `edge-computing-example.js` - Usage examples
- `dont-stop-agent-pool.js` - Agent pool integration
