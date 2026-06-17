# Analyze Failures

## Command Definition

`/analyze-failures`

## Trigger

When systematically analyzing failure modes, resilience, and recovery procedures for distributed systems.

## Execution Context

Delegates to `/failure-mode-analyzer` skill.

## Parameters

- **system_name** (required): Name of system under analysis
- **scope** (optional): Failure scope (single_node, multi_node, partition, cascade, byzantine)
- **focus** (optional): Analysis focus (detection_time, recovery_procedure, data_loss, consistency)
- **rto_target** (optional): Target recovery time in seconds (e.g., 300 for 5 minutes)

## Output

Produces:
- Enumeration of all relevant failure modes
- Timeline diagram for each failure (detect → recover)
- Root cause analysis and propagation paths
- Client impact matrix (failure type × impact)
- Consistency implications per failure
- Detection mechanism specification
- Recovery procedure (script or runbook)
- Testing checklist with verification steps

## Example Usage

```
/analyze-failures system_name="Kafka cluster" scope="cascade" rto_target=60
```

## Success Criteria

Failure analysis is complete when:
- [ ] All relevant failure modes are enumerated
- [ ] Timeline is specified for each failure
- [ ] Root cause and propagation are modeled
- [ ] Client impact is quantified
- [ ] Consistency implications are explicit
- [ ] Detection mechanism is specified
- [ ] Recovery procedure is documented
- [ ] Testing checklist is provided
