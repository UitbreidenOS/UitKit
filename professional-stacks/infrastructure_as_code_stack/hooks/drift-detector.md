# Drift Detector Hook

## Purpose

Automatically detect infrastructure drift — changes made to cloud resources outside of IaC (via console, CLI, or API) — and alert the team to remediate. Maintains infrastructure consistency between desired state (code) and actual state (cloud).

## settings.json Configuration

```json
{
  "hooks": {
    "onSchedule": {
      "drift-detector": {
        "shell": "bash",
        "script": "infrastructure_as_code_stack/hooks/drift-detector.sh",
        "schedule": "0 * * * *",
        "timeout": 600000,
        "env": {
          "TERRAFORM_DIR": "terraform/",
          "ALERT_SLACK_WEBHOOK": "${SLACK_WEBHOOK_URL}",
          "ALERT_EMAIL": "infrastructure@example.com"
        }
      }
    }
  }
}
```

## Hook Behavior

This hook fires hourly (configurable). It:

1. **Runs terraform plan** in read-only mode against all Terraform configurations
2. **Compares desired state** (code) with actual state (cloud infrastructure)
3. **Detects drift** when actual state differs from desired state
4. **Generates drift report** with:
   - Resource address (what changed)
   - Previous value (actual state)
   - Desired value (code state)
   - Timestamp of detection
5. **Alerts team** via Slack and email if drift > 0
6. **Logs results** to CloudWatch for historical tracking

## Implementation

Hook script: `infrastructure_as_code_stack/hooks/drift-detector.sh`

```bash
#!/bin/bash
set -e

TERRAFORM_DIR="${TERRAFORM_DIR:-.}"
ALERT_SLACK_WEBHOOK="${ALERT_SLACK_WEBHOOK}"
ALERT_EMAIL="${ALERT_EMAIL}"
DRIFT_REPORT_FILE="/tmp/drift-report-$(date +%s).json"
DRIFT_THRESHOLD_HOURS=24

echo "=== Drift Detection: $(date) ==="

# Step 1: Refresh state (fetch current cloud state)
echo "Refreshing Terraform state..."
cd "$TERRAFORM_DIR"
terraform refresh -json > /tmp/refresh.json 2>&1 || true

# Step 2: Generate plan (compare desired vs actual)
echo "Generating Terraform plan..."
terraform plan -json > "$DRIFT_REPORT_FILE" 2>&1 || true

# Step 3: Parse plan for resource changes
echo "Analyzing drift..."
DRIFT_COUNT=$(jq '[.resource_changes[] | select(.change.before != .change.after)] | length' "$DRIFT_REPORT_FILE")

if [ "$DRIFT_COUNT" -gt 0 ]; then
  echo "DRIFT DETECTED: $DRIFT_COUNT resource(s) differ from code"
  
  # Step 4: Generate human-readable report
  DRIFT_DETAILS=$(jq -r '.resource_changes[] | select(.change.before != .change.after) | "\(.address): before=\(.change.before | @json) after=\(.change.after | @json)"' "$DRIFT_REPORT_FILE")
  
  # Step 5: Extract timestamps of drift
  DRIFT_AGE=$(jq -r '.timestamp // "unknown"' "$DRIFT_REPORT_FILE")
  
  # Step 6: Send Slack alert
  if [ -n "$ALERT_SLACK_WEBHOOK" ]; then
    curl -X POST "$ALERT_SLACK_WEBHOOK" \
      -H 'Content-Type: application/json' \
      -d @- <<EOF
{
  "text": "⚠️ Infrastructure Drift Detected",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Infrastructure Drift Alert*\n\n*Detected:* $DRIFT_COUNT resource(s) differ from code\n*Detected at:* $(date)\n*Age:* $DRIFT_AGE"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ">>> \`\`\`$DRIFT_DETAILS\`\`\`"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Action:*\n1. Review drift: \`terraform plan\`\n2. Option A: Update code to match actual state\n3. Option B: Run \`terraform apply\` to revert to desired state\n4. Document why drift occurred and prevent recurrence"
      }
    }
  ]
}
EOF
  fi
  
  # Step 7: Send email alert
  if [ -n "$ALERT_EMAIL" ]; then
    cat <<EOF | mail -s "ALERT: Infrastructure Drift Detected ($DRIFT_COUNT resources)" "$ALERT_EMAIL"
Infrastructure Drift Detected

Timestamp: $(date)
Resources with Drift: $DRIFT_COUNT

Details:
$DRIFT_DETAILS

Action Required:
1. Review the changes: terraform plan
2. Option A: Update code to match actual state (if changes were intentional)
3. Option B: Run terraform apply to revert to desired state (if changes were unintended)
4. Document why drift occurred and implement preventive measures

Report: $DRIFT_REPORT_FILE
EOF
  fi
  
  # Step 8: Log to CloudWatch
  if command -v aws &> /dev/null; then
    aws logs put-log-events \
      --log-group-name "/infrastructure/drift" \
      --log-stream-name "drift-detector" \
      --log-events "timestamp=$(date +%s000),message=Drift detected: $DRIFT_COUNT resources"
  fi
  
  exit 1
else
  echo "No drift detected. Infrastructure matches code."
  exit 0
fi
```

## Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `schedule` | Cron expression for detector frequency | `0 * * * *` (hourly) |
| `TERRAFORM_DIR` | Path to Terraform configuration directory | `terraform/` |
| `ALERT_SLACK_WEBHOOK` | Slack webhook URL for notifications | (optional) |
| `ALERT_EMAIL` | Email address to send alerts | (optional) |
| `DRIFT_THRESHOLD_HOURS` | Hours before drift becomes critical | `24` |

## Drift Remediation Workflow

When drift is detected:

1. **Investigate:** `terraform plan` to see what changed
2. **Determine root cause:**
   - Manual change via console (unintended)
   - API change from external system (semi-intentional)
   - Managed service update (external)
3. **Remediate:**
   - **Option A (preserve changes):** Update code, commit, push
   - **Option B (revert changes):** `terraform apply` (requires approval)
4. **Document:** Why did drift occur? How prevent recurrence?
5. **Prevent:** Add policy checks to prevent future drift

## Example: Drift Scenario

**Scenario:** Someone changes EC2 instance type from `t3.medium` to `t3.large` via console (unintended).

**Detection:**
```
Drift detected: 1 resource(s) differ from code
aws_instance.api-server:
  before: instance_type=t3.medium
  after: instance_type=t3.large
```

**Alert sent:** Slack notification to #infrastructure channel with details

**Remediation:**
```bash
# Option 1: Revert to desired state
terraform apply  # Changes instance back to t3.medium

# Option 2: Update code to match actual state
# Edit terraform/main.tf: change t3.medium → t3.large
terraform apply  # No changes needed

# Document and prevent:
# - Enable CloudTrail to audit API changes
# - Add IAM policy to restrict console access
# - Implement AWS Config to detect non-compliant changes
```

## Monitoring and Metrics

Track drift metrics:

- **Drift detection frequency:** How often is drift found?
- **Remediation time:** How long between detection and remediation?
- **Root cause analysis:** What causes most drift? (console changes, APIs, managed services)
- **Prevention effectiveness:** Are preventive measures reducing drift?

## Best Practices

1. **Run hourly:** Drift should be detected within 1 hour
2. **Alert promptly:** Notify team immediately via Slack
3. **Document drift:** Keep historical record in CloudWatch or S3
4. **Remediate quickly:** Target < 24 hours between detection and fix
5. **Prevent systematically:** Use IAM policies, AWS Config, Terraform Cloud policies
6. **Train team:** Emphasize: "All infrastructure changes go through code review and Git"

## Status

Hook script is a template. Customize for your:
- Slack webhook URL
- Email recipients
- Terraform directories
- Alert thresholds
- Cloud provider (AWS, GCP, Azure)
