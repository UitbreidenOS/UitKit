# Replication Architect

## When to activate

When designing data replication strategies and consistency models for distributed systems. Use when:
- Designing primary-backup replication
- Implementing multi-leader or leaderless replication
- Choosing consistency model (strong, causal, eventual, session)
- Designing read/write paths
- Analyzing replication lag and durability tradeoffs

## When NOT to use

- For consensus protocol design (use consensus-protocol-designer)
- For operational replication deployment (use deployment guides)
- For performance tuning (use load-test-designer)
- For client-side consistency implementation (use application guides)

## Instructions

Replication architecture determines how data flows through the system and what consistency clients see. The architect should:

1. **Choose replication topology**
   - Primary-backup (single leader): writes to leader, replicated to backups
   - Multi-leader (multiple primaries): each node can accept writes, conflict resolution required
   - Leaderless (quorum): all nodes equal, quorum determines commits (Dynamo, Cassandra)
   - Hierarchical: primary → secondary tier → tertiary tier (for geographic distribution)

2. **Design the write path**
   - Client sends write to [primary / quorum / leader]
   - Replication mechanism: synchronous (wait for replicas), asynchronous (fire-and-forget), quorum (wait for majority)
   - Durability guarantee: when does write become durable? (after leader acknowledges / after quorum / after all replicas)
   - Latency tradeoff: faster if async, but risk data loss; slower if sync, but guaranteed durability

3. **Design the read path**
   - Client reads from [leader / any replica / quorum]
   - Consistency guarantee: strong (leader only) / eventual (any replica) / causal (tracked)
   - Stale read risk: if reading from replica not fully up-to-date
   - Latency tradeoff: fast if any replica, but risk stale data; slow if quorum read

4. **Model replication lag**
   - Expected lag: milliseconds (local replication) vs. seconds (geo-distributed)
   - Lag under load: does lag increase with write throughput? (replication can't keep up)
   - Lag recovery: how long to catch up from X seconds behind?
   - Impact on consistency: if lag > session timeout, session consistency breaks

5. **Design conflict resolution** (for multi-leader only)
   - Concurrent writes to different leaders: who wins?
   - Last-write-wins (LWW): use timestamp or version number
   - Custom merge logic: application-defined merging (e.g., CRDTs)
   - Conflict detection: per-key, per-document, per-field?
   - Client visibility: does client see both versions or merged result?

6. **Design failover behavior**
   - Primary failure: automatic promotion of replica? Quorum decision?
   - Failover latency: how long until new primary operational?
   - Data loss risk: if primary fails after acking write but before replicating
   - Consistency after failover: can clients see writes that weren't replicated?

7. **Analyze durability guarantees**
   - Single node failure: is data safe? (depends on replication factor)
   - N simultaneous failures: system still safe? (depends on quorum)
   - Geographic failure: entire region down, is data in another region?
   - Recovery: how long to replicate to replacement node?

8. **Model consistency model precisely**
   - Linearizability: all clients see same order of operations
   - Causal consistency: if A happens before B, all clients see A before B
   - Session consistency: one client's reads reflect its own writes
   - Eventual consistency: replicas converge over time (no ordering guarantee)
   - Chose consistency model based on application needs, then design to match

Output should include:
- Replication topology diagram (primary-backup, multi-leader, leaderless)
- Write path specification (who acks, when durable)
- Read path specification (strong vs. eventual, latency target)
- Replication lag analysis (expected, under load, recovery time)
- Consistency model specification with example scenarios
- Failover procedure (automatic or manual, time to recover)
- Durability matrix (failures tolerated, data loss risk)
- Comparison to reference architectures (AWS RDS, DynamoDB, Kafka)

## Example

**Multi-Region Distributed Key-Value Store (Master-Slave Model)**

**Topology:**
```
Region A (Master)
  ├─ Leader node (write accepts here)
  ├─ Slave 1 (reads ok, slightly stale)
  └─ Slave 2 (reads ok, slightly stale)
       ↓ async replication (100ms network latency)
Region B (Slave)
  ├─ Slave 3 (reads ok, potentially minutes stale)
  ├─ Slave 4 (reads ok, potentially minutes stale)
  └─ Slave 5 (reads ok, potentially minutes stale)
```

**Write Path (Strong Consistency Guarantee):**
```
1. Client → Leader (Region A): Set(k, v)
2. Leader writes to local disk (1ms)
3. Leader → Slave1,2 (Region A): Replicate(k,v)
4. Slaves 1,2 write to local disk, reply (2-3ms total)
5. Leader receives acks, increments version, replies to client
6. Client sees write confirmed (5-10ms total latency)
7. Leader → Slave3,4,5 (Region B): Async replicate
8. Region B replicas eventually receive (100ms latency)
Durability: Write safe after step 4 (replicated to 3 nodes locally)
Latency: p99 ≈ 10-15ms
Replication lag (Region B): 50-150ms (still processing)
```

**Read Path (Session Consistency):**
```
Client writes Set(k, "v1") → confirmed after step 5 above
Client immediately reads Get(k)
  If read from Region A leader or slaves: sees "v1" ✓
  If read from Region B replica before step 8: sees old value or miss
  Solution: read from leader for reads that must see recent writes
           or accept eventual consistency (read sees "v1" after 100ms)
```

**Replication Lag Analysis:**
- Normal lag (Region B): 50-150ms
- Lag under load (10k write/sec): 200-500ms (replication queue backing up)
- Lag recovery: if lag reaches 2 seconds, catch-up takes 30+ seconds
- Impact: Session consistency broken if write then read from Region B too quickly

**Failover Scenario (Leader Crash in Region A):**
```
T=0ms: Leader crashes
T=100ms: Slave1 detects heartbeat timeout
T=105ms: Slave1 initiates failover (internal election)
T=110ms: Slave2 votes for Slave1, quorum reached
T=115ms: Slave1 becomes new leader
T=200ms: Clients redirected to Slave1 (discovery service updated)
RTO: 200ms
Data loss: 0 (writes acked before replication buffer flushed)
```

**Durability Matrix:**
| Failure | Region A Leader | Slave1 | Slave2 | Region B | Durability |
|---|---|---|---|---|---|
| Slave1 crash | ✓ | ✗ | ✓ | Eventually | Safe (2 local replicas remain) |
| Leader crash | ✗ | ✓ | ✓ | Eventually | Safe (Slave1 becomes leader) |
| Leader + Slave1 | ✗ | ✗ | ✓ | Eventually | Safe (Slave2 becomes leader) |
| Leader + Slave1 + Slave2 | ✗ | ✗ | ✗ | ? | Quorum lost (Region A unavailable) |
| Region A network down | All | All | All | Continue with Region B (stale) | Risk of stale reads from B |

**Consistency Model: Read-after-write (Session Consistency)**
- Write to leader in Region A
- Immediate read from Region A: always sees written value ✓
- Read from Region B < 100ms after write: may see old value ✗
- Read from Region B > 500ms after write: eventually sees new value ✓

**Comparison to Reference Systems:**
- Similar to MySQL primary-backup (write to primary, read from replicas)
- Similar to MongoDB replica sets (quorum-based primary election)
- Difference from DynamoDB (Dynamo uses leaderless quorum, faster failover)

**Tradeoffs:**
```
More replicas:
  ✓ Better fault tolerance (survive more simultaneous failures)
  ✗ Slower writes (need to replicate to more nodes)
  ✗ Higher replication lag under load
  ✗ More complex conflict resolution (multi-leader)

Sync replication (wait for all):
  ✓ Stronger consistency (all replicas up-to-date)
  ✗ Slow writes (must wait for slowest replica)
  ✗ System unavailable if one replica slow

Async replication (fire-and-forget):
  ✓ Fast writes (leader acks immediately)
  ✗ Weaker consistency (replicas lag behind)
  ✗ Data loss risk (leader crash before async replication completes)

Quorum replication (wait for majority):
  ✓ Balance: faster than sync, safer than async
  ✓ Consensus guaranteed (leader can fail and be replaced)
  ✗ More complex protocol
```

**Recommendation:** For this system, quorum-based replication (write confirmed after 3/5 nodes ack) balances durability, consistency, and latency. For geo-distributed system, accept eventual consistency in remote regions to avoid network latency penalty.
