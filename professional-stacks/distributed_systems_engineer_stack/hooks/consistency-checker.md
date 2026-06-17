# Consistency Checker Hook

## Purpose

Automatically validates consistency model claims before design review, checking that linearizability, causal consistency, or eventual consistency guarantees are actually achievable with the specified design.

## settings.json Configuration

```json
{
  "hooks": {
    "preToolUse": {
      "consistency-checker": {
        "shell": "bash",
        "script": "distributed_systems_engineer_stack/hooks/consistency-checker.sh",
        "filter": {
          "command": ["design-consensus", "design-replication", "analyze-failures"]
        }
      }
    }
  }
}
```

## Hook Behavior

This hook fires before design commands execute, validating that consistency claims are realistic. It:

1. **Extracts consistency model claims**
   - Parse command: what consistency is claimed? (linearizable, causal, eventual, session)
   - Extract replication strategy: how is consensus achieved?
   - Check: does replication strategy actually guarantee the consistency model?

2. **Validates against known patterns**
   - Primary-backup + strong reads → linearizable ✓
   - Primary-backup + eventual reads → not linearizable ✗
   - Quorum reads/writes → linearizable ✓
   - Gossip replication → eventually consistent ✓
   - Multi-leader LWW → not linearizable ✗

3. **Flags inconsistencies**
   - If design claims linearizability but uses async replication: warn
   - If design claims strong consistency but reads from any replica: warn
   - If design claims no data loss but lacks replication: error

4. **Validates against failure scenarios**
   - Can consistency be maintained during network partition?
   - Can consistency survive the specified fault tolerance?
   - Are there edge cases where consistency breaks?

5. **Generates validation report**
   - Consistency claim: [stated requirement]
   - Replication design: [specified strategy]
   - Verdict: [valid / requires clarification / inconsistent]
   - Recommendations: [if valid, no action; if invalid, suggest fixes]

## Implementation

Hook script: `distributed_systems_engineer_stack/hooks/consistency-checker.sh`

Status: Ready for implementation

Example validation flow:

```bash
# Input: consensus protocol design
claim: "Linearizable consistency guaranteed"
replication: "Raft, quorum writes + quorum reads"
failures: "Tolerates 2/5 node failures"

# Validation
✓ Raft ensures unique leaders per term (prevents split-brain)
✓ Quorum writes ensure replication before commit
✓ Quorum reads ensure reads see committed writes
✓ 2/5 tolerance means majority always healthy
Verdict: VALID - Linearizability claim is sound
```

Another example:

```bash
# Input: replication design
claim: "Linearizable consistency guaranteed"
replication: "Primary-backup, primary acknowledges writes, backups replicate asynchronously"
failures: "Single node failure"

# Validation
✓ Primary acknowledges writes
✗ Backups replicate asynchronously (not before ack)
✗ If primary crashes before async replication completes, write is lost
✗ Client sees write acked, but write doesn't reach backup (violation of linearizability)
Verdict: INCONSISTENT - Async replication cannot guarantee linearizability
Recommendation: Either require replicas to ack before primary acks (sync), or weaken consistency to "eventual"
```

## Integration with Design Workflow

1. Engineer proposes design with consistency claims
2. Hook runs: automatically validates claims
3. If valid: design review proceeds
4. If invalid: engineer revisits design before review
5. Reduces time spent in review on invalid designs

## Manual Trigger

To validate consistency manually:

```bash
# Source the hook script and call directly
source distributed_systems_engineer_stack/hooks/consistency-checker.sh
validate_consistency "linearizable" "primary-backup" "async_replication" "2_node_tolerance"
```

## Configuration

Hook can be tuned via environment variables:

```bash
# Strictness level (strict = require formal proof, moderate = check against patterns)
CONSISTENCY_CHECK_LEVEL=strict  # or "moderate" (default) or "permissive"

# Enable detailed explanation (verbose output)
CONSISTENCY_CHECK_VERBOSE=true

# Fail on warning (vs. just flag for review)
CONSISTENCY_CHECK_FAIL_ON_WARNING=false
```

## Output Examples

**Valid Design (No Changes Needed):**
```
[✓] Consistency validation passed
Claim: Linearizable consistency
Strategy: Quorum-based replication (3/5 quorum for reads and writes)
Verdict: VALID
Reasoning: Quorum overlap ensures no stale reads; uniqueness of committed entries prevents reordering
Time to validate: 0.5s
```

**Invalid Design (Changes Required):**
```
[✗] Consistency validation FAILED
Claim: Linearizable consistency
Strategy: Primary-backup, async replication to backups
Verdict: INVALID
Issues found:
  1. Primary acks before replication to backups completes
  2. Primary crash after ack but before async replication = write lost
  3. Backup promotion = client sees write was lost (violates linearizability)
Recommendations:
  - Option A: Wait for at least 1 backup ack before primary acks (weaker fault tolerance)
  - Option B: Accept eventual consistency (allows async replication)
  - Option C: Use quorum-based replication instead of primary-backup
Time to validate: 0.8s
```

**Design Needs Clarification:**
```
[?] Consistency validation requires clarification
Claim: Causal consistency
Strategy: Multi-leader with vector clocks
Verdict: NEEDS DETAILS
Questions:
  1. What happens during network partition? (both leaders continue or one stops?)
  2. How are causality conflicts resolved? (application-level merge or system-level override?)
  3. Is a "happens-before" order required across leaders?
Recommendations:
  - Clarify partition behavior (affects causality guarantee)
  - Specify conflict resolution (affects if causality is preserved)
Time to validate: 1.2s
```
