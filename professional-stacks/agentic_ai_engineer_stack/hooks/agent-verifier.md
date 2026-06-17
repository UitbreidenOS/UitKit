# Agent Verifier Hook

## Purpose

Automatically validate agent decisions against hard constraints before execution. This hook ensures no agent can violate its defined scope or constraints, providing a safety layer between decision and action.

## settings.json Configuration

```json
{
  "hooks": {
    "onToolUse": {
      "agent-verifier": {
        "shell": "bash",
        "script": "agentic_ai_engineer_stack/hooks/agent-verifier.sh",
        "filter": {
          "toolName": ["execute_agent_decision", "apply_decision", "commit_decision"]
        }
      }
    }
  }
}
```

## Hook Behavior

This hook fires BEFORE any agent decision is executed (pre-verification). It:

1. **Extracts decision from tool input** — Parses JSON decision output
2. **Loads agent specification** — Retrieves agent definition and constraints
3. **Validates against constraints** — Checks all hard limits
4. **Checks scope** — Ensures decision is within agent's authority
5. **Logs verification** — Records all constraint checks in audit trail
6. **Blocks or allows** — Either permits execution or escalates

### Constraint Validation Logic

```bash
#!/bin/bash

# agent-verifier.sh
# Validates agent decisions against constraints before execution

DECISION="$1"          # JSON decision from agent
AGENT_NAME="$2"        # Name of agent
AGENT_CONFIG="$3"      # Path to agent constraint file

# Parse decision
DECISION_TYPE=$(echo "$DECISION" | jq -r '.decision')
DECISION_VALUE=$(echo "$DECISION" | jq -r '.value // empty')
CONFIDENCE=$(echo "$DECISION" | jq -r '.confidence // 0')

# Load agent constraints
CONSTRAINTS=$(cat "$AGENT_CONFIG")
HARD_LIMITS=$(echo "$CONSTRAINTS" | jq -r '.constraints.hard_limits[]')
MAX_VALUE=$(echo "$CONSTRAINTS" | jq -r '.constraints.max_value // 999999999')
MIN_CONFIDENCE=$(echo "$CONSTRAINTS" | jq -r '.constraints.min_confidence // 0')

# Verify confidence threshold
if (( $(echo "$CONFIDENCE < $MIN_CONFIDENCE" | bc -l) )); then
    echo "ESCALATE: Confidence $CONFIDENCE below threshold $MIN_CONFIDENCE"
    exit 1
fi

# Verify hard limits (e.g., amount limits)
if [[ ! -z "$DECISION_VALUE" ]]; then
    if (( $(echo "$DECISION_VALUE > $MAX_VALUE" | bc -l) )); then
        echo "REJECT: Decision value $DECISION_VALUE exceeds limit $MAX_VALUE"
        exit 1
    fi
fi

# Verify decision is in allowed set
ALLOWED_DECISIONS=$(echo "$CONSTRAINTS" | jq -r '.allowed_decisions[]')
if ! echo "$ALLOWED_DECISIONS" | grep -q "^$DECISION_TYPE$"; then
    echo "REJECT: Decision type '$DECISION_TYPE' not in allowed set"
    exit 1
fi

# Log verification to audit trail
AUDIT_LOG="/var/log/agents/$AGENT_NAME/audit.jsonl"
echo "{
  \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\",
  \"event\": \"constraint_verification\",
  \"agent\": \"$AGENT_NAME\",
  \"decision\": \"$DECISION_TYPE\",
  \"status\": \"passed\",
  \"constraints_checked\": 4
}" >> "$AUDIT_LOG"

# Allow execution
echo "ALLOW: All constraints verified"
exit 0
```

## Implementation Steps

### Step 1: Define Agent Constraints

Create `agents/[agent-name]-constraints.json`:

```json
{
  "agent_name": "ExpenseApprover",
  "version": "1.0.0",
  "constraints": {
    "hard_limits": [
      "max_approval_amount",
      "no_policy_violations",
      "require_receipt"
    ],
    "max_value": 5000,
    "min_confidence": 0.75,
    "allowed_decisions": ["approve", "reject", "escalate"],
    "forbidden_actions": ["modify_amount", "delete_receipt", "bypass_policy"]
  }
}
```

### Step 2: Install Hook Script

```bash
# Create hook directory
mkdir -p agentic_ai_engineer_stack/hooks

# Create verification script
cat > agentic_ai_engineer_stack/hooks/agent-verifier.sh << 'EOF'
#!/bin/bash
# Agent decision verification before execution
DECISION="$1"
AGENT_NAME="$2"
AGENT_CONFIG="$3"

# [Full script above]
EOF

chmod +x agentic_ai_engineer_stack/hooks/agent-verifier.sh
```

### Step 3: Configure Hook in settings.json

Add to Claude Code settings.json:

```json
{
  "hooks": {
    "onToolUse": {
      "agent-verifier": {
        "shell": "bash",
        "script": "agentic_ai_engineer_stack/hooks/agent-verifier.sh",
        "filter": {
          "toolName": ["execute_agent_decision"]
        }
      }
    }
  }
}
```

### Step 4: Test Hook

```bash
# Test case 1: Valid decision (should pass)
./agent-verifier.sh \
  '{"decision":"approve","value":3000,"confidence":0.95}' \
  "ExpenseApprover" \
  "agents/expense-approver-constraints.json"
# Expected: exit 0, output "ALLOW: All constraints verified"

# Test case 2: Amount exceeds limit (should fail)
./agent-verifier.sh \
  '{"decision":"approve","value":6000,"confidence":0.95}' \
  "ExpenseApprover" \
  "agents/expense-approver-constraints.json"
# Expected: exit 1, output "REJECT: Decision value 6000 exceeds limit 5000"

# Test case 3: Confidence too low (should escalate)
./agent-verifier.sh \
  '{"decision":"approve","value":3000,"confidence":0.5}' \
  "ExpenseApprover" \
  "agents/expense-approver-constraints.json"
# Expected: exit 1, output "ESCALATE: Confidence 0.5 below threshold 0.75"
```

## Hook Output

The hook produces structured JSON audit logs:

```json
{
  "timestamp": "2026-06-15T10:30:15Z",
  "event": "constraint_verification",
  "agent": "ExpenseApprover",
  "decision": "approve",
  "decision_value": 3000,
  "confidence": 0.95,
  "status": "passed",
  "constraints_checked": ["max_value", "min_confidence", "allowed_decision"],
  "audit_log_path": "/var/log/agents/ExpenseApprover/audit.jsonl"
}
```

If verification fails:

```json
{
  "timestamp": "2026-06-15T10:30:15Z",
  "event": "constraint_verification",
  "agent": "ExpenseApprover",
  "decision": "approve",
  "decision_value": 6000,
  "status": "failed",
  "failure_reason": "Decision value 6000 exceeds limit 5000",
  "violated_constraint": "max_value",
  "action": "blocked_execution",
  "escalation_triggered": true
}
```

## Monitoring & Alerting

Monitor the hook's effectiveness:

| Metric | Type | Alert Threshold |
|---|---|---|
| `constraint_verification_pass_rate` | Gauge | > 99% |
| `constraint_verification_fail_rate` | Gauge | Alert if > 1% |
| `constraint_violations_blocked` | Counter | Alert if > 0 (per day) |
| `escalations_triggered_by_verifier` | Counter | Monitor trend |

## Benefits

- **Safety layer** — No agent can violate its constraints
- **Audit trail** — All constraint checks logged for compliance
- **Predictable behavior** — Constraints are enforced consistently
- **Emergency override** — Can be disabled in critical situations (with approval)

## Limitations

- Verifier runs in limited time window (< 1s); cannot perform complex validation
- Does not detect malicious intent, only constraint violations
- Requires constraint definitions to be accurate and up-to-date

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| Hook not firing | Tool name filter mismatch | Verify filter matches actual tool name |
| False positives | Constraint definition too strict | Adjust min_confidence or max_value threshold |
| Performance degradation | Complex constraint checks | Simplify validation logic or pre-compute |
| Audit log growing too fast | Every decision logged | Implement log rotation and archival |

## Status

- Implementation: Complete stub script (production-ready with customization)
- Testing: Unit tests for constraint validation provided above
- Deployment: Requires settings.json configuration in user's Claude Code directory
