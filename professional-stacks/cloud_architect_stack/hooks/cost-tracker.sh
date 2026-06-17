#!/bin/bash
# cost-tracker.sh
# Auto-log architecture cost estimates when /design-iac or /optimize-costs is completed
# This hook fires on PostToolUse when architecture decisions are made

set -e

# Configuration
COST_LOG_FILE="${PWD}/cost-estimates.log"
COST_TRACKING_DIR="${PWD}/.claude/cost-tracking"

# Create tracking directory if not exists
mkdir -p "${COST_TRACKING_DIR}"

# Timestamp
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
DATE=$(date -u +"%Y-%m-%d")

# Extract cost data from latest tool output (set by hook environment)
if [[ -n "${TOOL_OUTPUT}" && "${TOOL_OUTPUT}" == *"Monthly Cost"* ]]; then

  # Parse cost estimate from output
  # Look for patterns like "$X,XXX/month" or "Total: $X"
  ESTIMATED_COST=$(echo "${TOOL_OUTPUT}" | grep -oP '\$[0-9,]+(?=/month|/mo)' | head -1 || echo "UNKNOWN")

  # Extract system name if provided
  SYSTEM_NAME=$(echo "${TOOL_OUTPUT}" | grep -oP '(?:System|Project):\s*\K[^,\n]+' | head -1 || echo "UNNAMED")

  # Extract architecture type
  ARCH_TYPE=$(echo "${TOOL_OUTPUT}" | grep -oP '(?:architecture|pattern):\s*\K[^,\n]+' | head -1 || echo "GENERAL")

  # Log entry
  LOG_ENTRY="${TIMESTAMP} | ${SYSTEM_NAME} | ${ARCH_TYPE} | ${ESTIMATED_COST}"

  # Append to cost estimates log
  echo "${LOG_ENTRY}" >> "${COST_LOG_FILE}"

  # Also save detailed JSON for tracking
  cat > "${COST_TRACKING_DIR}/${DATE}-${SYSTEM_NAME// /_}.json" <<EOF
{
  "timestamp": "${TIMESTAMP}",
  "system_name": "${SYSTEM_NAME}",
  "architecture_type": "${ARCH_TYPE}",
  "estimated_monthly_cost": "${ESTIMATED_COST}",
  "logged_by": "${USER}",
  "project_dir": "${PWD}"
}
EOF

  echo "[COST-TRACKER] Logged cost estimate: ${SYSTEM_NAME} = ${ESTIMATED_COST}/month"

fi

# Summary message
if [[ -f "${COST_LOG_FILE}" ]]; then
  LINE_COUNT=$(wc -l < "${COST_LOG_FILE}")
  echo "[COST-TRACKER] Total architectures tracked: ${LINE_COUNT}"
fi
