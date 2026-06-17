# Load Test Designer

## When to activate

When designing realistic load tests for distributed systems, especially with failure injection and chaos engineering. Use when:
- Validating system performance under realistic load
- Stress-testing consensus protocols
- Injecting failures (node failures, network partitions, slowness)
- Measuring latency p99, throughput, recovery time
- Designing chaos engineering scenarios
- Validating consistency under adversity (Jepsen testing)

## When NOT to use

- For unit testing or code correctness (use standard testing frameworks)
- For benchmarking individual components (use microbenchmarks)
- For production deployment testing (use canary deployments)
- For theoretical analysis (use consensus-protocol-designer)

## Instructions

Load tests reveal how systems behave under real conditions: high throughput, latency spikes, and failures. The designer should:

1. **Define baseline load profile**
   - Request rate: throughput in req/sec
   - Request mix: percentage reads vs. writes, operation types
   - Request size: payload size (impacts network, storage)
   - Duration: how long test runs (minimum 15 minutes for settling, 30+ for realistic)
   - Ramp-up: instant peak load or gradual increase?

2. **Define latency targets**
   - Acceptable p50, p99, p99.9 latencies
   - Measured end-to-end (client perspective, not server-side)
   - Include network round-trip, not just processing time
   - Ensure targets are realistic for deployment (e.g., p99 < 100ms assumes local network)

3. **Plan failure injection**
   - Failure type: process crash, network partition, slowness, Byzantine
   - Failure timing: when in test (after 5m baseline, etc.)
   - Failure duration: transient (10s) or sustained (until manual recovery)
   - Failure scope: single node, multiple simultaneous, cascading
   - Measure impact: latency spike, error rate, recovery time

4. **Design chaos engineering scenarios**
   - Random node kills: crash random node every N minutes
   - Packet loss injection: introduce X% packet loss for Y seconds
   - Network latency injection: add Z ms to all packets
   - Disk full simulation: fill disk to trigger behavior
   - Memory pressure: trigger OOM behavior
   - CPU throttle: simulate CPU-constrained node

5. **Design consistency validation**
   - Operation history: record all operations with timestamps
   - Consistency checker: verify final state matches expected (Jepsen)
   - Invariant checking: validate consistency properties (linearizability, causal, etc.)
   - Split-brain detection: ensure only one leader
   - Data loss detection: verify no committed writes lost

6. **Specify metrics to collect**
   - Latency: p50, p99, p99.9 (not just average)
   - Throughput: sustained req/sec (not burst)
   - Error rate: percentage of failed requests
   - Replication lag: max lag between leader and replicas
   - Consensus latency: time to reach agreement
   - Failover time: time from failure to new leader
   - Recovery time: time to restore full system functionality

7. **Plan monitoring and alerting**
   - Real-time dashboards: latency, throughput, error rate
   - Anomaly detection: alert if p99 latency spikes
   - Log aggregation: collect logs from all nodes
   - Distributed tracing: track requests through system
   - Health checks: per-node and per-cluster

8. **Validate against SLAs**
   - Availability: 99.9%, 99.99%, 99.999%?
   - RTO (recovery time): how long to recover from failure?
   - RPO (recovery point): how much data can be lost?
   - Error budget: how much downtime/errors allowed per month?

Output should include:
- Load profile specification (traffic patterns, payload sizes)
- Latency targets and acceptance criteria
- Failure injection plan (scenarios, timing, expected behavior)
- Chaos engineering test cases (10+ scenarios)
- Consistency validation procedure
- Metrics specification (what to measure, how to measure)
- Monitoring and alerting setup
- Test execution checklist
- Success/failure criteria

## Example

**Distributed Key-Value Store Load Test**

**Baseline Load Profile (No Failures):**
```
Duration: 30 minutes
Ramp-up: 1 minute (0 → 5000 req/sec)
Sustained load: 5000 req/sec for 25 minutes
Ramp-down: 4 minutes (5000 → 0 req/sec)
Request mix: 80% reads, 20% writes
Payload: ~1KB per request
Latency targets:
  p50: 5ms
  p99: 50ms
  p99.9: 200ms
Availability: 100% (no errors)
Throughput: sustained 5000 req/sec
```

**Failure Injection: Single Node Crash (at T=5m)**
```
Action: Kill leader process (SIGKILL)
Expected behavior:
  T=0-5m: Normal load, baseline metrics
  T=5m+0s: Leader process killed
  T=5m+100ms: Followers detect heartbeat timeout
  T=5m+150ms: New leader elected
  T=5m+200ms: Writes resume on new leader
Measured outcome:
  Error spike: 100% errors for 100-150ms
  Latency spike: p99 = 2000ms during failure
  Latency recovery: back to p99 = 50ms after 200ms
  Data loss: ZERO (no committed writes lost)
  Consistency: VALID (no stale reads, no split-brain)
```

**Failure Injection: Network Partition (at T=10m)**
```
Action: Isolate minority partition (2/5 nodes) from majority (3/5)
Expected behavior (Majority partition):
  Continues normal operation (has quorum)
  All writes succeed
  Latency unchanged
Expected behavior (Minority partition):
  Cannot achieve quorum
  All writes fail with "quorum unavailable" error
  Clients in minority see 100% error rate
Timeline:
  T=10m+100ms: Partition detected by monitoring
  T=10m+150ms: Minority partition stops accepting writes
  T=10m+200ms: Majority continues normal operation
  T=10m+300s: Network healed (manual operator action)
  T=10m+305s: Minority partition rejoins, catches up with leader
  T=10m+400s: Replication complete, system back to normal
Measured outcome:
  Majority partition: 0% errors, p99 = 50ms (unaffected)
  Minority partition: 100% errors for 600 seconds
  Data loss: ZERO (no data on minority partition lost)
  Consistency: VALID (quorum prevents split-brain)
  Recovery time: 100 seconds to fully replicate and stabilize
```

**Chaos Engineering: Random Failures Every 2 Minutes**
```
Duration: 15 minutes of chaos
Scenario every 2m: Kill random node (SIGKILL)
Other nodes: Observe and adapt
Expected steady-state (under chaos):
  Latency p99: may increase 2-3× (unavoidable during failures)
  Error rate: spikes to 30% during failure window, recovers to 0% after 200ms
  Throughput: drops during failure, recovers after 200ms
  No unrecovered errors (all operations eventually succeed or fail cleanly)
Measurement:
  Failure count: 7 failures in 15m = 1 failure per ~130 seconds
  Average recovery time: 150ms ± 50ms
  Error rate: 0.5% overall (7 failures × 0.3 error rate × 200ms / 900s)
  Data loss: ZERO across all failures
  Consistency: VALID (all checks pass)
```

**Consistency Validation: Jepsen-Style Test**
```
Operation set:
  Write(key, value) → acked or error
  Read(key) → value or null or error
  Delete(key) → acked or error

Test execution:
  - Record all operations with (start_time, end_time, result)
  - During chaos inject node failures, network partitions
  - After test, verify consistency invariant:
    If Write(k, v) at t1 is acked,
    and Read(k) at t2 (where t2 > t1 + partition_recovery),
    then Read must return v (or error, not old value)

Expected result: ALL reads consistent (no stale data after recovery)
Failure = inconsistency detected
```

**Metrics Collection:**
```
Real-time dashboard:
  - Latency percentiles (p50, p99, p99.9) updated every 10s
  - Throughput (req/sec) updated every 10s
  - Error rate (%) updated every 10s
  - Replication lag (milliseconds) per node
  - Leader status (online / offline)

Logs to collect:
  - Consensus events (election, commit)
  - Replication events (catch-up, lag)
  - Client errors (with reason code)
  - Recovery events (node restart, partition healing)

Alerts (fire during test if):
  - p99 latency > 500ms (2× target)
  - Error rate > 5%
  - Replication lag > 1000ms
  - Node offline > 60 seconds
  - Data inconsistency detected
```

**Success Criteria (All must pass):**
- [ ] No unhandled errors under baseline load (100% success)
- [ ] p99 latency meets target under baseline load (≤ 50ms)
- [ ] Single node failure: RTO < 300ms, RPO = 0
- [ ] Network partition: majority continues normal service, minority unavailable
- [ ] Chaos test: consistent recovery, zero data loss
- [ ] Jepsen consistency check: all operations linearizable or causally consistent
- [ ] No split-brain condition at any point
- [ ] Recovery procedures (manual runbooks) all work without ambiguity

**Failure Criteria (Test fails if):**
- [ ] Data loss detected (committed write not recovered)
- [ ] Stale read observed (client sees old value after new write)
- [ ] Split-brain (two leaders accepting writes simultaneously)
- [ ] Unrecoverable error (operation times out without resolution)
- [ ] Cascade failure (one failure triggers multiple others)
- [ ] Latency unbounded (p99 continues rising, doesn't recover)

**Test Execution Checklist:**
- [ ] Load generator: configured and validated
- [ ] Monitoring: all metrics being collected
- [ ] Logging: all nodes shipping logs to central system
- [ ] Consistency checker: ready to verify invariants
- [ ] Chaos tools: configured to inject failures as planned
- [ ] Notification: alerts configured for SLA violations
- [ ] Runbook: operator on-call ready with recovery procedures
- [ ] Rollback plan: know how to stop test and restore system
