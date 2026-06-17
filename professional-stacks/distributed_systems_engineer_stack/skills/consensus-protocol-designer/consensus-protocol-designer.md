# Consensus Protocol Designer

## When to activate

When designing, modeling, or validating consensus protocols for distributed systems. Use when:
- Building a new consensus mechanism from scratch
- Comparing consensus algorithms (Raft vs. Paxos vs. Zookeeper)
- Modeling byzantine fault tolerance
- Analyzing message complexity and round count
- Designing failure detection and recovery mechanisms

## When NOT to use

- For operational consensus questions (how to deploy Etcd) — use operational guides instead
- For performance tuning of existing protocols — use load-test-designer
- For troubleshooting production consensus issues — use debugging procedures
- For application-level consistency (use replication-architect for read/write paths)

## Instructions

Consensus protocol design requires formal modeling and failure scenario analysis. The designer should:

1. **Define the fault model explicitly**
   - Process crash faults: how many simultaneous failures tolerate?
   - Network partitions: partition tolerance required (CAP theorem)?
   - Byzantine faults: need arbitrary/malicious failure tolerance?
   - Timing assumptions: synchronous, asynchronous, or partial synchrony?

2. **Model the protocol state machine**
   - Document node states (Follower, Candidate, Leader for Raft; Proposer, Acceptor, Learner for Paxos)
   - Specify state transitions and conditions for each
   - Include failure-induced transitions (e.g., heartbeat timeout → become Candidate)

3. **Design leader election**
   - How are leaders chosen? (highest term number, randomized backoff, designation)
   - What prevents split-brain? (quorum-based voting, monotonic term numbers)
   - How long does election take? (timeout + message round-trips)
   - Can election fail? Under what conditions?

4. **Design log replication**
   - Message structure: (term, log_index, entry_value, leader_commit_index)
   - Acknowledgment protocol: quorum size, timing
   - How do slow followers catch up? (log transfer, snapshots)
   - Safety check: ensure no conflicting entries in log

5. **Design commit rule**
   - When is an entry considered "committed" (durable)?
   - Does leader alone decide, or require quorum acknowledgment?
   - How do non-leaders know what's committed?
   - Ensure: committed entry = replicated to majority, not lost even if leader crashes

6. **Design failure recovery**
   - Single node crash: who notices? Timeline?
   - Node restart: can it lose committed entries?
   - Network partition: majority vs. minority partition behavior
   - Leader failure + simultaneous replica failure: system still safe?

7. **Trace through failure scenarios**
   - Write pseudocode for: normal write, leader failure, network partition, Byzantine attack
   - Count message rounds for each scenario
   - Measure: failure detection time, election time, recovery time

8. **Validate against known protocols**
   - Compare with Raft, Paxos, or Zookeeper papers
   - Identify deviations and justify why
   - Check: does this solve a problem that existing protocols don't?

Output should include:
- Formal fault model specification
- State machine diagrams with all transitions
- Pseudocode for normal operation and failure recovery
- Failure scenario traces (minimum 3 scenarios)
- Message complexity analysis (O(n) per round, etc.)
- Latency analysis (p99 commit latency, election latency)
- Comparison to existing protocols
- Implementation checklist

## Example

**Raft Consensus Protocol**

**Fault Model:** Tolerates f simultaneous crash failures in 2f+1 nodes. No Byzantine. Partial synchrony (message delivery bounded but unpredictable).

**State Machine:**
```
Follower ─(timeout)→ Candidate ─(win election)→ Leader
Leader ─(higher term)→ Follower
Candidate ─(higher term)→ Follower
  or (receive AppendEntries from leader)→ Follower
  or (timeout)→ new Candidate (new term)
```

**Normal Write (Leader receives append request):**
```
1. Client → Leader: AppendEntry(value="x")
2. Leader → All Followers: AppendEntries(term=3, log_index=42, entry="x", leader_commit=41)
3. Followers → Leader: AppendEntries_ACK(term=3, success=true)
4. Leader receives ACK from majority (3/5 nodes) → increments commit_index
5. Leader → Client: Write confirmed
Latency: 1 round-trip (2 network hops) = ~2ms (local) to 100ms (geo-distributed)
```

**Leader Failure Scenario:**
```
Setup: Leader L crashes after replicating to 2/5 followers
Timeline:
  T=0ms: Leader L crashes
  T=150ms: Follower detects timeout (heartbeat missing)
  T=150ms: Follower increments term, becomes Candidate, votes for self
  T=155ms: Candidate broadcasts RequestVote to all peers
  T=160ms: Other followers receive RequestVote, grant vote if term is higher
  T=165ms: Candidate receives votes from majority, becomes Leader
Total: 165ms from crash to new leader operational
Commit safety: Entries replicated to ≥3 nodes safe from loss
```

**Network Partition (3 vs 2):**
```
Partition at T=100ms: Nodes {A,B,C} isolated from {D,E}
Majority partition {A,B,C}:
  - Continues normal operation
  - Replicates to 3 nodes, commits
  - Clients in majority partition: normal service

Minority partition {D,E}:
  - Cannot form quorum (need 3/5)
  - Becomes unavailable (cannot commit writes)
  - Followers timeout, increment terms, attempt election (but no majority)
  - Clients in minority: errors or timeouts

Partition healing at T=200ms:
  - Minority partition joins majority
  - Minority nodes in follower state, receive new leader's entries
  - Replicated log converges
  - All clients see consistent state
```

**Message Complexity:** O(n) per AppendEntry broadcast (leader → all followers). O(n²) during election (all candidates broadcast RequestVote).

**Key Invariants:**
1. Leader for term T is unique (quorum voting prevents split-brain)
2. Once committed, entry never lost (replicated to majority before commit)
3. Log entries are monotonic (AppendEntry includes previous entry index)
4. Followers only apply committed entries (prevents dirty reads)
