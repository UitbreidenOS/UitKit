# Design Replication

## Command Definition

`/design-replication`

## Trigger

When designing data replication strategies, consistency models, and read/write paths for distributed systems.

## Execution Context

Delegates to `/replication-architect` skill.

## Parameters

- **system_name** (required): Name of system (e.g., "Database cluster", "Cache layer")
- **topology** (optional): Replication topology (primary_backup, multi_leader, leaderless)
- **consistency_model** (optional): Consistency guarantee (strong, causal, eventual, session)
- **replication_factor** (optional): How many copies? (default: 3)
- **geographic_scope** (optional): Distribution scope (local, region, global)

## Output

Produces:
- Replication topology diagram with node roles
- Write path specification (who acks, when durable)
- Read path specification (consistency, latency tradeoff)
- Replication lag analysis (expected, under load, recovery)
- Consistency model specification with client examples
- Failover/switchover procedure
- Durability matrix (failures tolerated)
- Comparison to reference architectures

## Example Usage

```
/design-replication system_name="Document store" topology="multi_leader" consistency_model="causal" replication_factor=5 geographic_scope="global"
```

## Success Criteria

Replication design is complete when:
- [ ] Topology is clearly specified with node roles
- [ ] Write path is defined (who acks, when durable)
- [ ] Read path is defined (consistency level, latency)
- [ ] Replication lag is quantified
- [ ] Consistency model is formally specified
- [ ] Failover behavior is documented
- [ ] Durability matrix shows failures tolerated
- [ ] Design compared to production systems
