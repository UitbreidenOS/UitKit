# Jepsen Testing & Consistency Verification MCP

## Overview

Jepsen is the gold standard for distributed systems testing. This MCP provides integration with Jepsen to systematically verify consistency claims through failure injection and invariant checking.

---

## What is Jepsen?

Jepsen is a tool for testing the correctness of distributed systems under failures. It:
- Generates operation histories (reads, writes, deletes)
- Injects failures (node crashes, network partitions, clock skew)
- Checks histories against consistency models (linearizability, causal, eventual)
- Reports violations with minimal example (smallest test case that breaks system)

Key insight: **A system might work in normal operation but fail under failures.** Jepsen tests exactly this edge case.

---

## Prerequisites

- Java 8+
- Jepsen repository cloned: `git clone https://github.com/jepsen-io/jepsen.git`
- Docker for container-based testing
- Target system deployable in test environment
- 30+ minutes per test run

### Installation

```bash
# Clone Jepsen
git clone https://github.com/jepsen-io/jepsen.git
cd jepsen

# Install Leiningen (Clojure dependency manager)
curl https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein > /usr/local/bin/lein
chmod +x /usr/local/bin/lein
lein version

# Create test workspace
mkdir -p ~/jepsen-tests && cd ~/jepsen-tests
```

---

## Setup: MCP Configuration

Add to Claude Code settings.json:

```json
{
  "jepsen": {
    "command": "node",
    "args": ["path/to/jepsen-mcp-server.js"],
    "env": {
      "JEPSEN_PATH": "${HOME}/jepsen",
      "JEPSEN_TESTS_PATH": "${HOME}/jepsen-tests",
      "JEPSEN_DOCKER_NETWORK": "jepsen-test",
      "JEPSEN_TIMEOUT": "1800"
    }
  }
}
```

---

## Available Tools

### 1. Design Test Scenario

Specify the system, operations, and consistency model to test.

```
Tool: design-jepsen-test
Input:
  system: "redis"
  operations: ["set", "get", "incr"]
  consistency_model: "linearizable"
  nodes: 5
  failure_types: ["crash", "partition"]
Output:
  test_plan: YAML specification of test
  operation_definitions: Clojure code for read/write operations
  checker_definition: Consistency checker for linearizability
```

### 2. Run Jepsen Test

Execute the test scenario against your system.

```
Tool: run-jepsen-test
Input:
  test_name: "redis-lin-2026-06-15"
  system_code: "path/to/redis-jepsen-test"
  duration_minutes: 30
  operation_rate: 1000
Output:
  test_results: Pass/Fail
  operation_history: JSON log of all operations
  violation_details: If failed, minimal example breaking system
```

### 3. Analyze Results

Examine test results and extract insights.

```
Tool: analyze-jepsen-results
Input:
  test_run_id: "redis-lin-2026-06-15"
Output:
  summary: "Test passed/failed, X operations, Y failures injected"
  violations: If any, specific example of broken consistency
  failure_modes: Which failure scenarios broke the system?
  recommendations: How to fix the system
```

### 4. Compare Systems

Run same test against multiple systems to compare robustness.

```
Tool: compare-jepsen-systems
Input:
  systems: ["kafka", "rabbitmq", "redis"]
  test_scenario: "message-ordering"
  consistency_model: "causal"
Output:
  comparison_table: Pass/Fail, violations, recovery time for each
  ranking: Which system most robust to failures?
  tradeoff_analysis: Which system best for your use case?
```

---

## Example: Redis Linearizability Test

### Step 1: Design Test

```clojure
; From Jepsen Redis test
(deftest linearizability-test
  (is (:valid? (:results (run! (assoc test
                                 :checker (checker/linearizable
                                           {:model (model/register)})))))))
```

### Step 2: Define Operations

```clojure
; Read operation
{:type  :invoke
 :f     :read
 :key   :x}

; Write operation
{:type  :invoke
 :f     :write
 :key   :x
 :value 42}
```

### Step 3: Failure Injection

```clojure
; Stop/start redis process
(nemesis/process-killer ["redis"])

; Partition network (isolate node)
(nemesis/partition-majorities)

; Introduce latency
(nemesis/net-timeout 0.5 1000) ; 50% packet loss, 1s timeout
```

### Step 4: Run Test

```bash
cd ~/jepsen-tests/redis
lein run test --nodes 5 --time 60 --rate 100
```

### Step 5: Analyze Results

```
{:valid? true
 :ops   1000
 :failures-injected 23
 :partitions 4
 :violations 0
 :mean-recovery-time-ms 120
 :consistency "LINEARIZABLE"}
```

---

## Test Patterns for Distributed Systems

### Pattern 1: Linearizability Check

**What:** Verify that all operations appear to execute in a total order. No stale reads, no time-travel writes.

```
Test: Write v1 to key X, then Read X → must see v1
      Write v1 to key X, then another client Reads X → must see v1
      
Under failure: Does system break this guarantee if node crashes during write?
```

### Pattern 2: Causal Consistency

**What:** If operation A happens-before operation B, all clients see A before B.

```
Test: Client A writes X=1, tells Client B
      Client B reads X (must see 1), then writes Y=2, tells Client C
      Client C reads Y (must see 2) and reads X (must see 1)
      
Under failure: Does causal order survive partition + merge?
```

### Pattern 3: Message Ordering

**What:** Messages sent to a queue arrive in order.

```
Test: Send messages [1,2,3,4,5] to queue
      Receive from queue → must be in order (no reordering)
      
Under failure: Do messages arrive out-of-order if broker crashes and recovers?
```

### Pattern 4: Snapshot Isolation

**What:** Transactions see consistent snapshot of data. No dirty reads.

```
Test: Transaction A writes X=1, Y=2
      Transaction B reads X, then reads Y (must see consistent snapshot)
      
Under failure: Can B see X=1 but Y=stale if node crashes mid-transaction?
```

---

## Common Violations Found

### 1. Lost Write

**Symptom:** Write is acked to client but data is lost when node crashes.

```
Operation history:
  T=0: Client A: Write(x=42) → ACK
  T=50: Broker crashes
  T=100: Client B: Read(x) → nil (not 42!)
  
Violation: Write was acked but lost.
Root cause: Async replication; broker acked before replicating to backup.
Fix: Require sync replication or quorum acknowledgment.
```

### 2. Stale Read

**Symptom:** Read returns old value after write.

```
Operation history:
  T=0: Client A: Write(x=new) → ACK
  T=50: Client B: Read(x) → old (not new!)
  
Violation: Read came after write but returned stale value.
Root cause: Reading from unreplicated replica; write not yet propagated.
Fix: Read from leader or ensure write is replicated before acking.
```

### 3. Split-Brain

**Symptom:** Two nodes both think they're the leader; they accept conflicting writes.

```
Operation history:
  T=0: Network partition occurs
  T=100: Node A (minority) becomes "leader", accepts write x=1
  T=105: Node B (majority) becomes "leader", accepts write x=2
  
Violation: Both nodes acked their write, but data is conflicting.
Root cause: Poor partition tolerance; both sides tried to be leader.
Fix: Use quorum-based leadership (minority partition can't elect leader).
```

### 4. Causality Violation

**Symptom:** Causal ordering is not preserved.

```
Operation history:
  T=0: Write(a=1) → ACK
  T=50: Write(b=a_value) → ACK
  T=100: Client reads: a=nil, b=a_value
  
Violation: Read b's dependency but b's dependency is not visible.
Root cause: Replication is independent per key; a and b replicate separately.
Fix: Ensure causal ordering in replication (use vector clocks or wait-for).
```

---

## Interpreting Jepsen Reports

### Report Structure

```
├── report.html              # Visual timeline of operations
├── results.edn              # Machine-readable test results
├── history.txt              # Human-readable operation history
├── violations               # Specific consistency violations (if any)
│   ├── linearization-error.txt
│   └── example-trace.txt
└── latencies.png            # Latency distribution graph
```

### Key Metrics

| Metric | Meaning |
|---|---|
| `valid?` | true = no violations, false = consistency broken |
| `ops` | Total number of operations executed |
| `failures-injected` | Count of failure events (node crashes, partitions) |
| `mean-recovery-time` | Average time from failure to system normal |
| `violations` | Count of consistency violations found |
| `error-count` | Operations that failed with errors |

### Reading Results

**All Green (Valid):**
```
{:valid? true
 :violations []
 :ops 5000
 :failures-injected 47
 :mean-recovery-time-ms 245}
```
→ Congratulations! System maintains consistency under these failure scenarios.

**With Violations (Invalid):**
```
{:valid? false
 :violations ["lost-write" "stale-read"]
 :ops 5000
 :failing-ops 3
 :minimal-failing-example [{...}]}
```
→ System breaks consistency. Review minimal example to understand root cause.

---

## Integration Workflow

Typical Jepsen testing workflow:

1. **Design** — Define consistency model and operations
2. **Implement** — Code operations for your system
3. **Run** — Execute test with failure injection
4. **Analyze** — Review results, identify violations
5. **Fix** — Update system to handle failure
6. **Validate** — Re-run test to confirm fix works
7. **Repeat** — Test more failure scenarios

Example timeline:
```
10:00 - Start test (30 min duration)
10:30 - Test completes, 2 linearizability violations found
10:45 - Analyze: "Lost write under network partition"
11:00 - Implement fix: add sync replication requirement
11:30 - Re-run test
12:00 - Test passes! Zero violations.
```

---

## Example Systems Tested by Jepsen

- **Cassandra** — Found issues with read repair under partition
- **RabbitMQ** — Identified ordering violations in queue replication
- **Kafka** — Verified linearizability under broker failure
- **PostgreSQL** — Tested multi-master replication consistency
- **Redis** — Checked sentinel failover behavior
- **MongoDB** — Analyzed replica set consistency

See [https://jepsen.io/analyses](https://jepsen.io/analyses) for full reports.

---

## MCP Tool Reference

```
Tool: design-jepsen-test
  Input: system, operations, consistency_model, nodes, failure_types
  Output: test_plan, operation_definitions, checker_definition

Tool: run-jepsen-test
  Input: test_name, system_code, duration_minutes, operation_rate
  Output: test_results, operation_history, violation_details (if any)

Tool: analyze-jepsen-results
  Input: test_run_id
  Output: summary, violations, failure_modes, recommendations

Tool: compare-jepsen-systems
  Input: systems[], test_scenario, consistency_model
  Output: comparison_table, ranking, tradeoff_analysis

Tool: generate-minimal-violation
  Input: test_run_id
  Output: smallest operation sequence that reproduces violation
```

---

## When to Use Jepsen

✓ **Use when:**
- You need proof that consistency is maintained under failures
- You're testing a consensus protocol or replication system
- You need to publish results (research, benchmarking)
- You want to verify fix actually works (regression testing)

✗ **Don't use when:**
- You're testing application logic (unit tests are better)
- System is stateless (no consistency issues)
- You need performance benchmarking (use other tools)
- Testing in production (Jepsen injects failures)

---

**Last updated:** 2026-06-15
