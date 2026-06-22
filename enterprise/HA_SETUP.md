# High Availability & Disaster Recovery

Enterprise deployments of Claudient require fault-tolerant architecture with active-active load balancing, circuit breakers, and graceful degradation strategies. This guide covers deployment topologies, health checking, failover procedures, and recovery automation.

## Deployment Architectures

### Architecture 1: Active-Active (Recommended)

Multiple Claudient instances serve traffic simultaneously across availability zones.

```
                             ┌─────────────────────┐
                             │   Health Monitor    │
                             │  (Prometheus + K8s) │
                             └──────────┬──────────┘
                                        │
                      ┌─────────────────┼─────────────────┐
                      │                 │                 │
                ┌─────▼──────┐   ┌─────▼──────┐   ┌─────▼──────┐
                │ Instance 1  │   │ Instance 2  │   │ Instance 3  │
                │ (us-east)   │   │ (us-west)   │   │ (eu-west)   │
                └─────┬──────┘   └─────┬──────┘   └─────┬──────┘
                      │                │                │
                      └────────────────┼────────────────┘
                                       │
                         ┌─────────────▼──────────────┐
                         │  L7 Load Balancer          │
                         │ (HAProxy / Nginx / ALB)    │
                         └────────────┬───────────────┘
                                      │
                         ┌────────────▼──────────────┐
                         │  Clients (API / WebUI)    │
                         └───────────────────────────┘
                                      │
        ┌─────────────────────────────┼──────────────────────────────┐
        │                             │                              │
    ┌───▼─────┐                  ┌───▼─────┐                    ┌───▼─────┐
    │  Consul  │                  │  etcd   │                    │  Redis  │
    │ (state)  │                  │ (leases)│                    │(cache)  │
    └──────────┘                  └─────────┘                    └─────────┘
```

**Benefits:**
- No single point of failure
- Request distribution across zones
- Zero-downtime updates (rolling restart)
- Automatic failover via health checks

**Requirements:**
- Stateless instances (no local session storage)
- Distributed cache (Redis/Memcached)
- Shared configuration backend (Consul/etcd)
- L7 load balancer with health check support

### Architecture 2: Active-Passive (for on-prem/air-gapped)

One primary instance, one or more standby replicas.

```
┌──────────────────┐                    ┌──────────────────┐
│   Primary Node   │                    │  Standby Node 1  │
│  (Active)        │  Replication       │  (Passive)       │
│  ┌────────────┐  │  ◄─────────►       │  ┌────────────┐  │
│  │ Database   │  │                    │  │ Database   │  │
│  │ (MySQL)    │  │                    │  │ (MySQL)    │  │
│  └────────────┘  │                    │  └────────────┘  │
└────────┬─────────┘                    └──────────────────┘
         │
    Client Traffic
         │
         ▼
   VIP (Virtual IP)
   10.0.0.100

[Heartbeat via: keepalived/corosync]
[When Primary fails → VIP moves to Standby 1]
```

**Benefits:**
- Simpler operational model
- Lower resource overhead
- Easier debugging (single primary)

**Trade-offs:**
- Brief failover window (10-30 seconds)
- Lower availability percentage (99.5% vs 99.99%)

## Load Balancing Strategy

### Health Check Configuration

Health checks must be **application-aware**, not just TCP probes.

#### Kubernetes (recommended)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: claudient-lb
spec:
  type: LoadBalancer
  selector:
    app: claudient
  ports:
    - name: http
      port: 80
      targetPort: 8080
    - name: grpc
      port: 50051
      targetPort: 50051
---
apiVersion: v1
kind: Pod
metadata:
  name: claudient-instance-1
spec:
  containers:
  - name: claudient
    image: claudient:latest
    ports:
      - containerPort: 8080
      - containerPort: 50051
    livenessProbe:
      httpGet:
        path: /health/live
        port: 8080
      initialDelaySeconds: 30
      periodSeconds: 10
      timeoutSeconds: 5
      failureThreshold: 3
    readinessProbe:
      httpGet:
        path: /health/ready
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5
      timeoutSeconds: 3
      failureThreshold: 1
    env:
      - name: INSTANCE_ID
        valueFrom:
          fieldRef:
            fieldPath: metadata.name
      - name: CLOUDENT_DB_REPLICA_LAG_MAX
        value: "5s"
```

#### HAProxy (on-prem)

```
global
  log stdout local0
  daemon

defaults
  log     global
  mode    http
  timeout connect 5000
  timeout client  50000
  timeout server  50000

frontend claudient_lb
  bind *:80
  mode http
  default_backend claudient_cluster

backend claudient_cluster
  mode http
  balance roundrobin
  option httplog
  option forwardfor
  option http-server-close
  
  # Health check endpoint
  option httpchk GET /health/ready HTTP/1.1\r\nHost:\ claudient.company.com
  
  server instance1 10.0.1.10:8080 check inter 5s fall 2 rise 2
  server instance2 10.0.1.11:8080 check inter 5s fall 2 rise 2
  server instance3 10.0.1.12:8080 check inter 5s fall 2 rise 2
  
  # Drain behavior for graceful shutdown
  timeout server 30s
  option tcp-smart-accept
  option tcp-smart-connect
```

### Health Check Endpoints

Services must expose these endpoints:

```
GET /health/live
  Response: 200 OK, JSON: {"status": "alive", "timestamp": "2026-06-22T10:30:00Z"}
  Purpose: Process-level check (is the service running?)
  Timeout: 3 seconds

GET /health/ready
  Response: 200 OK if ready, 503 if not
  JSON: {
    "status": "ready",
    "checks": {
      "database": "ok",
      "cache": "ok",
      "config_sync": "ok",
      "replication_lag": "2.5s"
    }
  }
  Purpose: Dependency check (can this instance accept traffic?)
  Timeout: 5 seconds
  Check frequency: 5-10 seconds
```

**Ready conditions:**
- Database connection alive + lag < 5s
- Cache (Redis) reachable
- Configuration synced from Consul/etcd
- gRPC server bound and listening
- Auth tokens rotated within 24h

## Circuit Breaker Pattern

Prevent cascading failures when dependencies degrade.

### Configuration (Go example)

```go
import "github.com/grpc-ecosystem/go-grpc-middleware/retry"

// Circuit breaker for database calls
var dbCircuitBreaker = &circuitbreaker.CircuitBreaker{
  Name:        "database",
  MaxRequests: 5,
  Interval:    30 * time.Second,
  Timeout:     10 * time.Second,
  ReadyToTrip: func(counts circuitbreaker.Counts) bool {
    failureRatio := float64(counts.TotalFailures) / float64(counts.Requests)
    return counts.Requests >= 3 && failureRatio >= 0.6
  },
}

// Circuit breaker for external APIs
var apiCircuitBreaker = &circuitbreaker.CircuitBreaker{
  Name:        "external_api",
  MaxRequests: 10,
  Interval:    1 * time.Minute,
  Timeout:     30 * time.Second,
  ReadyToTrip: func(counts circuitbreaker.Counts) bool {
    return counts.ConsecutiveFailures >= 5
  },
}

// Usage in handler
func FetchUserData(userID string) (*User, error) {
  result, err := dbCircuitBreaker.Execute(func() (interface{}, error) {
    return db.GetUser(userID)
  })
  if err != nil {
    if err == circuitbreaker.ErrOpenCircuit {
      return nil, errors.New("database unavailable, circuit open")
    }
    return nil, err
  }
  return result.(*User), nil
}
```

### Circuit Breaker States

| State | Behavior | Transition |
|-------|----------|------------|
| **CLOSED** | Requests pass through normally | Failure rate > 60% → OPEN |
| **OPEN** | Requests fail immediately (fast-fail) | Timeout elapsed → HALF_OPEN |
| **HALF_OPEN** | Limited requests allowed (test recovery) | Success → CLOSED, Failure → OPEN |

## Graceful Degradation

When services degrade, reduce functionality instead of failing completely.

### Degradation Stages

```
Stage 1: Cache Unavailable (Redis down)
├─ Use in-memory cache instead of Redis
├─ Reduce cache TTL (5min instead of 1h)
├─ Log: "WARN: Using fallback cache, Redis unhealthy"
├─ Still serve 100% of requests

Stage 2: Replica Database Lag > 10s
├─ Route read queries to primary only
├─ Reduce feature flags frequency check (from 1s to 10s)
├─ Log: "WARN: High replication lag (12s), using primary for reads"
├─ Still serve 100% of requests

Stage 3: Primary Database Degraded
├─ Enable read-only mode (disable writes)
├─ Circuit breaker OPEN for write operations
├─ Return HTTP 503 with "Service Temporarily Unavailable"
├─ Queue writes to local queue for later replay
├─ Serve read requests from cache/replica

Stage 4: Complete Loss of Service
├─ Return HTTP 500 to all requests
├─ Forward traffic to DR site (if available)
├─ Alert on-call team
```

### Configuration Example

```json
{
  "degradation": {
    "stages": [
      {
        "name": "cache_fallback",
        "trigger": "redis_unavailable",
        "actions": [
          "use_memory_cache",
          "reduce_ttl_multiplier: 0.1",
          "increase_log_level: debug"
        ]
      },
      {
        "name": "replica_lag",
        "trigger": "replication_lag_ms > 10000",
        "actions": [
          "read_from_primary_only",
          "disable_cache_writes",
          "alert_team"
        ]
      },
      {
        "name": "read_only_mode",
        "trigger": "primary_db_errors_per_sec > 5",
        "actions": [
          "set_mode: readonly",
          "circuit_breaker_writes: open",
          "queue_writes_local",
          "return_status_code: 503"
        ]
      },
      {
        "name": "failover_to_dr",
        "trigger": "primary_db_down",
        "actions": [
          "switch_dns_to_dr_site",
          "alert_incident_commander",
          "page_on_call_engineer"
        ]
      }
    ]
  }
}
```

## Failure Recovery Procedures

### Database Recovery (Primary Down)

**1. Detection** (automated, ~30 seconds)
```
Primary health check fails 3 times (5s × 3) → Degradation triggered
```

**2. Failover** (manual trigger or automated after 2 minutes)
```bash
# Option A: Automatic via Kubernetes StatefulSet
# K8s detects Pod failure, schedules new Pod on healthy node

# Option B: Manual promotion of replica
claudient-cli db promote-replica --replica=replica-us-west --force

# Replica becomes primary, starts accepting writes
# Old primary becomes standby when it recovers
```

**3. Verification**
```bash
# Check new primary is healthy
claudient-cli db health --primary

# Monitor replication from new primary → standbys
claudient-cli db replication-status

# Confirm write operations resuming
curl -X GET http://claudient-api/metrics | grep claudient_writes_total
```

**4. Post-incident**
- Investigate root cause (check logs from 10 minutes before failure)
- If old primary recovers, rebuild it from new primary backup
- Run consistency checks: `claudient-cli db verify-consistency`

### Cache Failure Recovery

**1. Detection**
```
Redis connection timeout (5 seconds) → Circuit breaker OPEN
All cache reads return cache miss (served from fallback)
```

**2. Recovery Options**

**Option A: Restart Service**
```bash
# Kill problematic Redis container, K8s restarts it
kubectl delete pod redis-0
kubectl wait --for=condition=Ready pod/redis-0 --timeout=60s

# Or manual restart
systemctl restart redis-server
```

**Option B: Flush and Rebuild**
```bash
# If Redis corrupted
redis-cli FLUSHALL

# Warm cache with hot data
claudient-cli cache warmup --profile=production
  ├─ Loads feature flags (50MB)
  ├─ Loads common user data (200MB)
  └─ Loads session index (100MB)
  └─ ETA: 45 seconds
```

### Configuration Sync Failure

**1. Detection**
```
Consul/etcd health check fails → Config stale (up to 5 min old)
```

**2. Recovery**
```bash
# Manually force sync from source of truth
claudient-cli config sync --force --source=git

# Or restart config watcher
systemctl restart claudient-config-sync

# Verify all instances picked up new config
claudient-cli config get-applied | jq '.version'
```

## Monitoring & Alerting

### Key Metrics to Track

```
Availability Metrics:
  - claude_uptime_percent (target: 99.95%)
  - service_requests_total (by status code)
  - request_latency_p95_ms (target: < 200ms)

Dependency Health:
  - database_connection_pool_active
  - database_replication_lag_seconds (alert if > 5s)
  - redis_connected_clients (alert if = 0)
  - config_sync_lag_seconds (alert if > 30s)

Degradation Indicators:
  - circuit_breaker_state (1=closed, 2=open, 3=half-open)
  - cache_fallback_hits_total (alert if > 10% of traffic)
  - write_queue_depth (alert if > 1000)
  - read_only_mode_active (alert immediately)

Error Rates:
  - db_query_errors_per_sec (alert if > 1)
  - auth_failures_total (alert if spike > 2x baseline)
  - cascading_failures_detected (alert immediately)
```

### Alerting Rules (Prometheus)

```yaml
groups:
  - name: claudient_ha
    rules:
      - alert: HighReplicationLag
        expr: db_replication_lag_seconds > 5
        for: 2m
        annotations:
          summary: "Database replication lag > 5s"
          action: "Check replica health, restart if needed"

      - alert: CircuitBreakerOpen
        expr: circuit_breaker_state{name!=""} == 2
        for: 30s
        annotations:
          summary: "Circuit breaker {{ $labels.name }} is OPEN"
          action: "Check dependency health, restart service if needed"

      - alert: CacheUnavailable
        expr: redis_connected_clients == 0
        for: 10s
        annotations:
          summary: "Redis unavailable, using memory fallback"
          action: "Restart Redis container immediately"

      - alert: InstanceUnhealthy
        expr: up{job="claudient"} == 0
        for: 30s
        annotations:
          summary: "Instance {{ $labels.instance }} is DOWN"
          action: "K8s will auto-restart; if not, check systemd/logs"

      - alert: ReadOnlyModeActive
        expr: claudient_read_only_mode == 1
        for: 0s
        annotations:
          summary: "Claudient in READ-ONLY mode (writes disabled)"
          action: "P1 incident - page incident commander immediately"
```

## Disaster Recovery (DR) Site

For mission-critical deployments, maintain a hot or warm DR site.

### Architecture: Active-Active (Preferred)

```
Production Site (us-east)      DR Site (us-west)
┌──────────────────────┐      ┌──────────────────────┐
│  Claudient Instance  │      │  Claudient Instance  │
│  + DB Primary        │      │  + DB Replica        │
└──────────┬───────────┘      └──────────┬───────────┘
           │                             │
        Replication (bidirectional, 5ms)
           ◄────────────────────────────►
           │                             │
           └────────┬────────────────────┘
                    │
            Global Load Balancer
            (Route53 / Cloudflare)
                    │
              Client requests
```

**Recovery Time**: ~10 seconds (just DNS failover)

### Architecture: Active-Passive (Lower Cost)

```
Production Site (us-east)      DR Site (us-west)
┌──────────────────────┐      ┌──────────────────────┐
│  Claudient Instance  │      │  Claudient Instance  │
│  + DB Primary        │      │  Powered OFF         │
└──────────┬───────────┘      └──────────────────────┘
           │
    Nightly backup to S3
           │
    [12 hours RPO]
```

**Recovery Time**: 10-15 minutes (provision and sync from backup)

### DR Failover Procedure

#### Automated Failover (if primary completely lost)

```bash
#!/bin/bash
# Triggered when primary health checks fail for 5 minutes

set -e

INCIDENT_ID=$(uuidgen)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "[$TIMESTAMP] DR Failover started - Incident ID: $INCIDENT_ID"

# 1. Verify DR site is ready
if ! curl -f https://dr.claudient.com/health/ready > /dev/null; then
  echo "ERROR: DR site not healthy, aborting failover"
  exit 1
fi

# 2. Promote DR database to primary
echo "Promoting DR database to primary..."
psql -U admin -h dr-db.internal -d claudient -c \
  "SELECT pg_promote();"

sleep 5

# 3. Verify DR database is accepting writes
if ! psql -U admin -h dr-db.internal -d claudient -c "SHOW server_version;" > /dev/null; then
  echo "ERROR: DR database not accepting connections, aborting"
  exit 1
fi

# 4. Update DNS to point to DR site (TTL 30s for quick rollback)
echo "Updating DNS..."
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "claudient.company.com",
        "Type": "CNAME",
        "TTL": 30,
        "ResourceRecords": [{"Value": "dr.claudient.com"}]
      }
    }]
  }'

# 5. Wait for DNS propagation
sleep 10

# 6. Verify traffic flowing to DR
REQUESTS_DR=$(curl -s https://dr.claudient.com/metrics | grep claudient_requests_total | awk '{print $2}')
sleep 5
REQUESTS_DR_NEW=$(curl -s https://dr.claudient.com/metrics | grep claudient_requests_total | awk '{print $2}')

if [ "$REQUESTS_DR" -eq "$REQUESTS_DR_NEW" ]; then
  echo "ERROR: No traffic flowing to DR site"
  exit 1
fi

# 7. Notify incident commander
curl -X POST https://slack.com/api/chat.postMessage \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  -d '{
    "channel": "#incidents",
    "text": "FAILOVER COMPLETE: Traffic now on DR site (us-west). Incident ID: '$INCIDENT_ID'. Production site: OFFLINE. Recovery ETA: TBD"
  }'

echo "[$TIMESTAMP] Failover complete, DR site is now primary"
exit 0
```

#### Manual Failover (for planned maintenance)

```bash
# 1. Enter maintenance mode on primary (stop accepting new requests)
claudient-cli maintenance enable --reason="Planned failover to DR"

# 2. Gracefully drain existing requests (up to 30 seconds)
# Load balancer stops sending new traffic, waits for in-flight requests
sleep 30

# 3. Flush any pending writes
psql -U admin -h prod-db.internal -d claudient -c \
  "SELECT * FROM write_queue WHERE status='pending';" \
  | xargs -I {} psql -U admin -h dr-db.internal -c "INSERT INTO claudient..."

# 4. Take final backup of primary DB
pg_dump -U admin -h prod-db.internal claudient | gzip > /backups/prod-final-$(date +%s).sql.gz

# 5. Promote DR and switch DNS (same as automated failover above)

# 6. Test DR site fully operational
claudient-cli health check --full

# 7. Disable maintenance mode on DR
claudient-cli maintenance disable
```

### Backup & Recovery

```bash
# Daily incremental backup to S3
0 3 * * * /usr/local/bin/claudient-backup.sh --type=incremental --dest=s3://claudient-backups/prod/

# Weekly full backup
0 2 * * 0 /usr/local/bin/claudient-backup.sh --type=full --dest=s3://claudient-backups/prod/ --retain=30days

# Test restore monthly (verify backups are valid)
0 4 1 * * /usr/local/bin/claudient-backup.sh --test-restore --backup-date=7days-ago --dest=/tmp/restore-test/
```

## Testing & Validation

### Chaos Engineering Tests

Run these monthly to validate HA setup:

```bash
# Test 1: Kill primary database
kubectl delete pod claudient-db-0
# Expected: Automatic failover to replica within 30s, zero data loss

# Test 2: Network partition (simulate high latency)
tc qdisc add dev eth0 root netem delay 500ms
sleep 300
tc qdisc del dev eth0 root
# Expected: Circuit breakers trip, requests degrade gracefully, recover when latency drops

# Test 3: Cascade failure (kill cache + primary DB)
kubectl delete pod redis-0 claudient-db-0
# Expected: Fallback to memory cache, read-only mode, zero cascading failures

# Test 4: Config sync outage
kubectl delete pod consul-0 consul-1 consul-2
# Expected: Continue with stale config for up to 5 min, resume syncing when restored

# Test 5: CPU exhaustion
stress-ng --cpu 32 --timeout 5m &
# Expected: Load balancer removes unhealthy instance, remaining instances handle load (with elevated latency p95)
```

### Post-Test Validation

```bash
# 1. Check for data loss
claudient-cli db consistency-check --compare=backup

# 2. Verify all metrics recorded
curl -s http://localhost:9090/api/v1/query?query=up | jq '.data.result | length'
# Should show all instances back online

# 3. Review logs for cascading failures
grep -E "ERROR|WARN|circuit.*open|cascading" /var/log/claudient/*.log | tail -20
```

## SLA & Targets

| Metric | Target | Enforcement |
|--------|--------|------------|
| **Availability** | 99.95% (22.3 min downtime/month) | Automatic credit if missed |
| **MTTR** (Mean Time To Recover) | < 5 minutes | Page on-call if > 10m |
| **RTO** (Recovery Time Objective) | 10 seconds (active-active), 15 min (active-passive) | Chaos tests monthly |
| **RPO** (Recovery Point Objective) | < 30 seconds data loss | Validate daily backups |
| **Replication Lag** | < 5 seconds (99th percentile) | Alert if > 5s for > 2 min |

---

**Last updated**: 2026-06-22  
**Related files**: `COMPLIANCE.md`, `AIR_GAP.md`, `AUDIT_TRAIL.md`  
**Maintenance contacts**: ops-team@company.com, incident-commander@company.com
