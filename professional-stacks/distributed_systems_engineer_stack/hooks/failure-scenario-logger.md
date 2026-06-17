# Failure Scenario Logger Hook

## Purpose

Automatically logs failure scenario simulations and recovery outcomes, capturing metadata about each failure test for analysis and compliance.

## settings.json Configuration

```json
{
  "hooks": {
    "onCommandComplete": {
      "failure-scenario-logger": {
        "shell": "bash",
        "script": "distributed_systems_engineer_stack/hooks/failure-scenario-logger.sh",
        "filter": {
          "command": ["analyze-failures", "design-load-test", "plan-disaster-recovery"]
        }
      }
    }
  }
}
```

## Hook Behavior

This hook fires after failure analysis or load test commands complete. It:

1. **Captures failure metadata**
   - System name, failure type, scenario description
   - Expected vs. actual detection time
   - Expected vs. actual recovery time
   - Data loss (if any)
   - Consistency violations (if any)

2. **Logs to central registry**
   - Creates entry in `distributed_systems_engineer_stack/failure-logs/` directory
   - Filename format: `{system_name}-{failure_type}-{timestamp}.json`
   - Captures all command parameters for reproducibility

3. **Generates summary report**
   - RTO/RPO achievement (met target or exceeded)
   - Recovery success rate across all scenarios
   - Trends over time (improving or degrading)

4. **Alerts on deviations**
   - If actual RTO exceeds target by > 20%, alert ops team
   - If data loss detected, escalate immediately
   - If consistency violation found, require investigation

## Implementation

Hook script: `distributed_systems_engineer_stack/hooks/failure-scenario-logger.sh`

Status: Ready for implementation

Example log entry structure:

```json
{
  "timestamp": "2026-06-15T14:30:00Z",
  "command": "analyze-failures",
  "system_name": "kafka-cluster",
  "failure_type": "single_node_crash",
  "failure_scenario": "Leader process killed, followers detect and elect new leader",
  "expected_rto_seconds": 5,
  "actual_rto_seconds": 4.2,
  "rto_met": true,
  "expected_rpo_seconds": 0,
  "actual_rpo_seconds": 0,
  "rpo_met": true,
  "detection_time_ms": 150,
  "election_time_ms": 50,
  "consistency_valid": true,
  "data_loss_detected": false,
  "notes": "Failover faster than expected due to adaptive timeout",
  "command_parameters": {
    "scope": "single_node",
    "rto_target": 300
  }
}
```

## Integration with Monitoring

The logged data feeds into:
- **Dashboard:** Trends in RTO/RPO achievement
- **Alerting:** Deviations from targets
- **Reporting:** Monthly compliance report (was system resilient?)
- **Learning:** Analysis of what works/doesn't work

## Manual Trigger

To log a failure scenario manually:

```bash
# Source the hook script and call directly
source distributed_systems_engineer_stack/hooks/failure-scenario-logger.sh
log_failure_scenario "kafka-cluster" "network_partition" "Majority/minority split for 10 seconds" 30 25 0 0
```
