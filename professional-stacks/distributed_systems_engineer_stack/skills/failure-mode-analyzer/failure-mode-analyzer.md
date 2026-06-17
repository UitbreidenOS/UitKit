# Failure Mode Analyzer

## When to activate

When systematically analyzing failure modes and resilience of distributed systems. Use when:
- Building resilience into system design
- Analyzing cascade failure risk
- Designing failure detection mechanisms
- Planning operational recovery procedures
- Validating fault tolerance claims

## When NOT to use

- For consensus protocol modeling (use consensus-protocol-designer)
- For load testing and chaos engineering (use load-test-designer)
- For application-level error handling (use general debugging)
- For security threat modeling (use security-review)

## Instructions

Failure mode analysis identifies what can go wrong, how fast it propagates, and how to detect/recover. The analyzer should:

1. **Enumerate all possible failures**
   - Process failures: node crash, OOM kill, disk full, CPU throttle
   - Network failures: packet loss, latency spikes, partition, connection resets
   - Cascading: one failure triggering others (load shedding causing cascade)
   - Byzantine: if threat model requires (malicious/arbitrary failures)

2. **For each failure, model the timeline**
   - When does failure occur?
   - How long until detection? (heartbeat timeout, explicit health check, client timeout)
   - What happens during detection window? (stale data served, write loss, client errors)
   - Recovery time after detection
   - Time to full system recovery

3. **Analyze propagation**
   - Does failure affect other nodes? (load redistribution, overload)
   - Does failure cascade? (node A crashes → load on B → B overloaded → B crashes)
   - What's the chain reaction? (circuit breaker opens → circuit breaker on upstream → upstream unavailable)
   - Mitigation: bulkheads, graceful degradation, circuit breakers

4. **Analyze client impact**
   - What do clients see? (error, timeout, stale data, hang)
   - How long until recovery visible to clients?
   - Can clients recover automatically or require manual intervention?
   - What's the error budget impact?

5. **Model consistency implications**
   - Does failure violate consistency guarantee? (split-brain, stale reads)
   - How do nodes reconcile after failure?
   - Data loss possible? (unacked writes, partial replication)
   - Recovery from inconsistent state automatic or manual?

6. **Design detection mechanisms**
   - Explicit health checks: heartbeat interval, timeout value
   - Implicit detection: client timeouts, connection failures
   - Gossip-based detection: peer notification of failure
   - Can you detect without false positives? (adaptive timeout)

7. **Design recovery procedures**
   - Automatic: script-driven (restart process, trigger failover)
   - Manual: operator runbook (check logs, verify data integrity, manual failover)
   - Communication: how are operators notified? escalation chain?

8. **Validate failure handling**
   - Test scenario: does system actually detect failure?
   - Test scenario: does recovery actually restore service?
   - Test scenario: is no data loss under failure + recovery?

Output should include:
- Enumeration of all failure modes
- Timeline diagram for each failure (detect → recover)
- Cascade analysis (which failures cause other failures)
- Client impact matrix (failure type × impact type)
- Consistency implications for each failure
- Detection mechanism specification (timeout values, checks)
- Recovery procedure for each failure (script or runbook)
- Testing checklist (verify each failure path)

## Example

**Distributed Key-Value Store Failure Analysis**

**Failure Mode 1: Single Replica Crash**

Timeline:
```
T=0ms: Replica R3 crashes (process killed)
T=100ms: Leader detects heartbeat timeout from R3
T=105ms: Leader removes R3 from replication set (quorum = 3/4 instead of 3/5)
T=110ms: New write confirmed to leader + 2 followers (not R3)
T=300ms: Operator notified via alert (disk space, OOM, segfault?)
T=400-600ms: Operator restarts R3 (manual runbook)
T=610ms: R3 rejoins, leader initiates log catch-up
T=650ms: R3 caught up, replication factor back to 5
```

Client Impact:
- Reads: unaffected (replicated to 3/4 remaining nodes)
- Writes: latency +0ms (already requires only majority)
- Error rate: 0% (no quorum loss)
- Detection: automatic (operator notified for manual recovery)

Consistency:
- Write durability: maintained (leader requires quorum ≥3)
- Committed entries: never lost (replicated before commit)
- Stale reads: not possible (read from any replica, all have same committed log)

**Failure Mode 2: Network Partition (3 vs 2 replicas)**

Timeline:
```
T=0ms: Network partition splits {R1,R2,R3} from {R4,R5}
T=150ms: Minority partition {R4,R5} notice majority unreachable
T=155ms: R4,R5 attempt leader election (but only 2 nodes, need 3)
T=160ms: R4,R5 become unavailable (cannot commit quorum)
T=300ms: Majority partition {R1,R2,R3} notice minority unreachable
T=305ms: Majority continues normal operation (has quorum)
T=500ms: Operator detects partition via metrics, investigates network
T=600ms: Network healed
T=610ms: R4,R5 rejoin, catch up with leader's log
T=650ms: Replication complete, system normal
```

Majority Partition Impact:
- Reads/Writes: normal (operates as 3/5 quorum)
- Error rate: 0%
- Latency: unaffected

Minority Partition Impact:
- Reads: can serve stale data (if configured)
- Writes: 100% error rate (cannot get quorum)
- Client timeouts: after 5-10 seconds
- Error rate: 100% during partition

Consistency:
- Split-brain prevention: quorum voting prevents majority+minority both claiming leadership
- Write safety: only majority partition can commit writes
- Stale reads possible: minority partition clients see committed entries from before partition

**Failure Mode 3: Cascading Overload (Slow Replica)**

Timeline:
```
T=0ms: Replica R3 becomes slow (disk I/O spike, GC pause)
T=5ms: R3 takes >100ms to replicate entry (normally <5ms)
T=10ms: Leader waits for R3 ACK (default 5s timeout)
T=100ms: More writes arrive, leader's send buffer fills
T=200ms: Leader becomes backpressured, client writes timeout (blocking replication)
T=500ms: Client connections timeout, circuit breaker opens on upstream
T=600ms: Upstream service sees downstream unavailable, sheds load
T=700ms: R3 recovers from GC pause
T=710ms: Leader sends all pending entries to R3 at once
T=900ms: R3 catch-up completes
T=950ms: Leader can accept new writes
T=1200ms: Upstream circuit breaker closes, traffic resumes
```

Cascade Chain: R3 slow → leader backpressured → client timeouts → circuit breaker → upstream unavailable

Prevention:
- **Bulkhead:** Limit replication threads, use timeouts instead of blocking
- **Adaptive timeout:** Increase timeout dynamically if nodes are slow but not dead
- **Load shedding:** Drop write requests if leader queue exceeds threshold
- **Circuit breaker:** Upstream detects downstream latency, fails fast instead of retrying

Impact:
- Write latency: p99 increases 10× (100ms → 1000ms)
- Error rate: 0% if properly drained, but clients see timeouts
- Data loss: 0% (no quorum loss, just latency)

Recovery:
- Manual: trigger load shedding, reduce replication factor, rebuild slow node
- Automatic: adaptive replication timeout + gradual load rebalancing

---

**Mitigation Strategies Summary**

| Failure | Detection | Recovery | RTO | RPO |
|---|---|---|---|---|
| Single crash | Heartbeat timeout (100ms) | Leader removes + failover (105ms) | <200ms | 0s |
| Network partition | Leader unreachable (150ms) | Minority unavailable / majority continues | <300ms | 0s |
| Cascading slowness | Client timeout (5000ms) | Circuit breaker / load shedding | 5-10s | 0s |
| Byzantine replica | Consensus mismatch detected | Manual investigation required | 1-5m | depends |

**Testing Checklist**
- [ ] Simulate each failure mode
- [ ] Verify detection time (automated alerting)
- [ ] Verify recovery time (RTO met)
- [ ] Verify no data loss (RPO = 0)
- [ ] Verify consistency (clients see correct data)
- [ ] Verify no split-brain (only one leader)
- [ ] Verify cascade prevention (bulkheads working)
- [ ] Verify operator runbooks work (human follow-through)
