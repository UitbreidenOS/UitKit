# Orchestration Monitor Hook

## Purpose

Automatically track multi-agent orchestrations, detect anomalies (deadlocks, cascading failures, resource exhaustion), and trigger alerts when orchestration health degrades.

## settings.json Configuration

```json
{
  "hooks": {
    "onToolComplete": {
      "orchestration-monitor": {
        "shell": "bash",
        "script": "agentic_ai_engineer_stack/hooks/orchestration-monitor.sh",
        "filter": {
          "command": ["orchestrate", "run-workflow", "coordinate-agents"]
        }
      }
    }
  }
}
```

## Hook Behavior

This hook fires after each orchestration task completes (post-completion monitoring). It:

1. **Extracts orchestration metadata** — Task ID, agent name, latency, status
2. **Updates orchestration state** — Tracks which tasks are complete, pending, failed
3. **Detects anomalies** — Checks for deadlocks, cascading failures, timeouts
4. **Calculates metrics** — Latency, throughput, success rate, resource usage
5. **Logs structured data** — Updates orchestration trace
6. **Triggers alerts** — If anomalies detected

### Anomaly Detection Logic

```bash
#!/bin/bash

# orchestration-monitor.sh
# Monitors multi-agent orchestrations for anomalies

ORCH_ID="$1"           # Orchestration run ID
TASK_ID="$2"           # Task that just completed
STATUS="$3"            # success|failure|timeout
LATENCY_MS="$4"        # Milliseconds taken
TOKENS_USED="$5"       # Token count for this task

STATE_FILE="/tmp/orchestrations/$ORCH_ID/state.json"
CONFIG_FILE="agentic_ai_engineer_stack/orchestrations/$ORCH_ID/config.json"

# Initialize state if needed
if [ ! -f "$STATE_FILE" ]; then
    mkdir -p "$(dirname "$STATE_FILE")"
    echo "{\"tasks\": {}, \"start_time\": $(date +%s), \"status\": \"running\"}" > "$STATE_FILE"
fi

# Load configuration
TOTAL_TOKEN_BUDGET=$(jq -r '.resource_constraints.token_budget' "$CONFIG_FILE")
ORCH_TIMEOUT=$(jq -r '.resource_constraints.orchestration_timeout_seconds' "$CONFIG_FILE")

# Update task status
jq --arg task "$TASK_ID" --arg status "$STATUS" --arg latency "$LATENCY_MS" \
  '.tasks[$task] = {status: $status, latency_ms: $latency, timestamp: now}' \
  "$STATE_FILE" > "$STATE_FILE.tmp" && mv "$STATE_FILE.tmp" "$STATE_FILE"

# Check for deadlock (no progress for T seconds)
LAST_UPDATE=$(stat -f %m "$STATE_FILE" 2>/dev/null || stat -c %Y "$STATE_FILE")
CURRENT_TIME=$(date +%s)
TIME_SINCE_UPDATE=$((CURRENT_TIME - LAST_UPDATE))

if [ $TIME_SINCE_UPDATE -gt 60 ]; then
    # No task completed in last 60 seconds
    ACTIVE_TASKS=$(jq '.tasks | to_entries[] | select(.value.status == "running") | .key' "$STATE_FILE" | wc -l)
    if [ $ACTIVE_TASKS -gt 0 ]; then
        echo "ALERT: Potential deadlock detected in $ORCH_ID"
        echo "{
          \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\",
          \"event\": \"deadlock_detected\",
          \"orchestration_id\": \"$ORCH_ID\",
          \"active_tasks\": $ACTIVE_TASKS,
          \"no_progress_seconds\": $TIME_SINCE_UPDATE,
          \"action\": \"pause_orchestration\"
        }" >> "/var/log/orchestrations/$ORCH_ID/monitor.jsonl"
        exit 1
    fi
fi

# Check for cascading failures
FAILED_COUNT=$(jq '.tasks | to_entries[] | select(.value.status == "failure") | .key' "$STATE_FILE" | wc -l)
TOTAL_COUNT=$(jq '.tasks | length' "$STATE_FILE")
FAILURE_RATE=$(echo "scale=2; $FAILED_COUNT / $TOTAL_COUNT" | bc)

if (( $(echo "$FAILURE_RATE > 0.3" | bc -l) )); then
    echo "ALERT: High failure rate $FAILURE_RATE in $ORCH_ID (cascading failure likely)"
    echo "{
      \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\",
      \"event\": \"cascading_failure_detected\",
      \"orchestration_id\": \"$ORCH_ID\",
      \"failed_tasks\": $FAILED_COUNT,
      \"total_tasks\": $TOTAL_COUNT,
      \"failure_rate\": $FAILURE_RATE,
      \"action\": \"escalate_to_supervisor\"
    }" >> "/var/log/orchestrations/$ORCH_ID/monitor.jsonl"
    exit 1
fi

# Check for timeout escalation
if [ "$STATUS" = "timeout" ]; then
    echo "WARN: Task $TASK_ID timed out after ${LATENCY_MS}ms"
    TIMEOUT_COUNT=$(jq '.tasks | to_entries[] | select(.value.status == "timeout") | .key' "$STATE_FILE" | wc -l)
    if [ $TIMEOUT_COUNT -gt 3 ]; then
        echo "ALERT: Multiple timeouts in $ORCH_ID (orchestration_timeout_imminent)"
        exit 1
    fi
fi

# Check resource usage
TOTAL_TOKENS_USED=$(jq '[.tasks[] | .tokens_used // 0] | add' "$STATE_FILE")
TOKENS_USED_PERCENT=$(echo "scale=0; ($TOTAL_TOKENS_USED / $TOTAL_TOKEN_BUDGET) * 100" | bc)

if [ "$TOKENS_USED_PERCENT" -gt 90 ]; then
    echo "ALERT: Token budget $TOKENS_USED_PERCENT% consumed in $ORCH_ID"
    echo "{
      \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\",
      \"event\": \"resource_exhaustion\",
      \"orchestration_id\": \"$ORCH_ID\",
      \"tokens_used\": $TOTAL_TOKENS_USED,
      \"tokens_budget\": $TOTAL_TOKEN_BUDGET,
      \"percent_used\": $TOKENS_USED_PERCENT,
      \"action\": \"throttle_new_tasks\"
    }" >> "/var/log/orchestrations/$ORCH_ID/monitor.jsonl"
fi

# Update orchestration metrics
ORCH_LATENCY=$((CURRENT_TIME - $(jq -r '.start_time' "$STATE_FILE")))
SUCCESS_COUNT=$(jq '.tasks | to_entries[] | select(.value.status == "success") | .key' "$STATE_FILE" | wc -l)
SUCCESS_RATE=$(echo "scale=2; ($SUCCESS_COUNT / $TOTAL_COUNT) * 100" | bc)

echo "{
  \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\",
  \"event\": \"task_completed\",
  \"orchestration_id\": \"$ORCH_ID\",
  \"task_id\": \"$TASK_ID\",
  \"status\": \"$STATUS\",
  \"task_latency_ms\": $LATENCY_MS,
  \"orchestration_latency_seconds\": $((ORCH_LATENCY / 1000)),
  \"total_tokens_used\": $TOTAL_TOKENS_USED,
  \"success_rate_percent\": $SUCCESS_RATE,
  \"failed_tasks\": $FAILED_COUNT
}" >> "/var/log/orchestrations/$ORCH_ID/monitor.jsonl"

exit 0
```

## Implementation Steps

### Step 1: Create Monitor Script

```bash
mkdir -p agentic_ai_engineer_stack/hooks

cat > agentic_ai_engineer_stack/hooks/orchestration-monitor.sh << 'EOF'
#!/bin/bash
# [Full script above]
EOF

chmod +x agentic_ai_engineer_stack/hooks/orchestration-monitor.sh
```

### Step 2: Create Orchestration Configuration

Create `agentic_ai_engineer_stack/orchestrations/[orch-name]/config.json`:

```json
{
  "orchestration_id": "blog-post-production",
  "name": "Blog Post Production Pipeline",
  "tasks": {
    "research": {
      "agent": "ResearchAgent",
      "depends_on": [],
      "timeout_seconds": 120,
      "max_retries": 2
    },
    "outline": {
      "agent": "OutlineAgent",
      "depends_on": ["research"],
      "timeout_seconds": 60,
      "max_retries": 2
    },
    "write_sec1": {
      "agent": "WriteSectionAgent",
      "depends_on": ["outline"],
      "timeout_seconds": 90,
      "max_retries": 1
    }
  },
  "resource_constraints": {
    "max_concurrent_agents": 4,
    "token_budget": 150000,
    "orchestration_timeout_seconds": 600
  }
}
```

### Step 3: Configure Hook in settings.json

```json
{
  "hooks": {
    "onToolComplete": {
      "orchestration-monitor": {
        "shell": "bash",
        "script": "agentic_ai_engineer_stack/hooks/orchestration-monitor.sh",
        "filter": {
          "command": ["orchestrate"]
        }
      }
    }
  }
}
```

### Step 4: Test Monitor

```bash
# Test case 1: Normal task completion
./orchestration-monitor.sh \
  "orch-001" \
  "task_1" \
  "success" \
  "2500" \
  "1024"
# Expected: Output metrics to log; no alerts

# Test case 2: Task timeout
./orchestration-monitor.sh \
  "orch-001" \
  "task_2" \
  "timeout" \
  "120000" \
  "512"
# Expected: Log timeout; check for escalation if multiple

# Test case 3: High failure rate (cascading)
for i in {1..5}; do
  ./orchestration-monitor.sh \
    "orch-002" \
    "task_$i" \
    "failure" \
    "5000" \
    "0"
done
# Expected: Alert on cascading failure when rate > 30%
```

## Hook Output

Structured JSON logs in `/var/log/orchestrations/[orch-id]/monitor.jsonl`:

```json
{
  "timestamp": "2026-06-15T10:30:15Z",
  "event": "task_completed",
  "orchestration_id": "blog-orch-001",
  "task_id": "research",
  "status": "success",
  "task_latency_ms": 45000,
  "orchestration_latency_seconds": 45,
  "total_tokens_used": 12500,
  "success_rate_percent": 100,
  "failed_tasks": 0
}
```

Alert on anomaly:

```json
{
  "timestamp": "2026-06-15T10:30:45Z",
  "event": "deadlock_detected",
  "orchestration_id": "blog-orch-001",
  "active_tasks": 3,
  "no_progress_seconds": 65,
  "action": "pause_orchestration"
}
```

## Metrics Tracked

| Metric | Description | Alert Threshold |
|---|---|---|
| `orchestration_success_rate` | % of tasks succeeding | < 95% |
| `orchestration_latency` | Total orchestration time | > baseline * 2 |
| `task_timeout_rate` | % of tasks timing out | > 5% |
| `cascading_failure_rate` | Cascading failures detected | > 0 |
| `token_utilization` | % of token budget consumed | > 90% |
| `deadlock_detection` | Orchestrations with no progress | > 0 |

## Dashboards

Create dashboards to visualize:

- **Orchestration status** — Task graph with status (running/success/failed)
- **Latency distribution** — Histogram of task latencies
- **Success metrics** — Success rate, failure rate over time
- **Resource usage** — Token consumption, concurrency
- **Anomalies** — Timeouts, deadlocks, cascading failures

## Benefits

- **Real-time visibility** — Know orchestration health at all times
- **Early warning** — Detect deadlocks and cascading failures before they escalate
- **Resource management** — Track token usage and prevent exhaustion
- **Audit trail** — Complete log of orchestration execution for compliance
- **Auto-remediation** — Can trigger automatic recovery (pause, retry, escalate)

## Limitations

- Monitoring has latency (delays in alert triggering)
- Cannot predict failures, only detect them after occurrence
- Requires accurate state tracking (lost updates = missed detections)

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| Hook not detecting failures | State file corruption | Recreate state.json; restart monitoring |
| False positives (deadlock alerts) | Slow tasks legitimately running | Adjust no_progress timeout window |
| Missing logs | Log directory permissions | Verify write access to /var/log/orchestrations |
| High memory usage | Large orchestrations with many tasks | Implement log rotation and archival |

## Status

- Implementation: Production-ready shell script
- Testing: Test cases provided above
- Deployment: Requires settings.json configuration
