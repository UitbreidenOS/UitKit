# Design Consensus

## Command Definition

`/design-consensus`

## Trigger

When designing, modeling, or analyzing consensus protocols for distributed systems.

## Execution Context

Delegates to `/consensus-protocol-designer` skill.

## Parameters

- **system_name** (required): Name of system (e.g., "Kafka cluster", "Distributed KV store")
- **fault_model** (required): Fault tolerance requirement (crash, partition, Byzantine)
- **node_count** (optional): Expected cluster size (default: 5)
- **consistency_target** (optional): Consistency model (linearizable, causal, eventual)

## Output

Produces:
- Formal fault model specification
- State machine diagram with transitions
- Consensus protocol pseudocode (normal + failure recovery)
- Message complexity analysis
- Failure scenario traces
- Latency projections (p99, election time)
- Comparison to reference protocols
- Implementation checklist

## Example Usage

```
/design-consensus system_name="Distributed KV Store" fault_model="partition" node_count=7 consistency_target="linearizable"
```

## Success Criteria

Protocol design is complete when:
- [ ] Fault model is explicit (what failures tolerated)
- [ ] State machine is fully specified with all transitions
- [ ] Pseudocode traces through at least 3 failure scenarios
- [ ] Message complexity is quantified
- [ ] Latency projections are realistic
- [ ] Design is compared to existing protocols
- [ ] Implementation checklist is provided
