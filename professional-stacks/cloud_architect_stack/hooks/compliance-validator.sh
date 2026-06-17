#!/bin/bash
# compliance-validator.sh
# Validate security requirements before infrastructure deployment
# This hook fires on PreToolUse when infrastructure commands are executed

set -e

# Configuration
REQUIRED_CHECKS=(
  "encryption_at_rest"
  "encryption_in_transit"
  "iam_least_privilege"
  "audit_logging"
  "network_segmentation"
)

COMPLIANCE_CHECKLIST="${PWD}/.claude/compliance-checklist.json"
VALIDATION_LOG="${PWD}/.claude/compliance-validation.log"

# Create checklist if not exists
if [[ ! -f "${COMPLIANCE_CHECKLIST}" ]]; then
  cat > "${COMPLIANCE_CHECKLIST}" <<'EOF'
{
  "encryption_at_rest": {
    "status": "pending",
    "description": "Data encrypted at rest using customer-managed keys (CMK)",
    "requirements": [
      "KMS key configured",
      "Database encryption enabled",
      "EBS volume encryption enabled",
      "S3 default encryption enabled"
    ]
  },
  "encryption_in_transit": {
    "status": "pending",
    "description": "All data encrypted in transit using TLS 1.3+",
    "requirements": [
      "ALB/NLB uses TLS 1.3",
      "Service-to-service uses mTLS or TLS",
      "Database connections use TLS",
      "No unencrypted protocols (HTTP, telnet, etc.)"
    ]
  },
  "iam_least_privilege": {
    "status": "pending",
    "description": "IAM roles follow least-privilege principle",
    "requirements": [
      "No wildcards (*) in Actions",
      "No admin/root roles in production",
      "Resource-scoped policies",
      "Condition clauses where applicable"
    ]
  },
  "audit_logging": {
    "status": "pending",
    "description": "Audit logging enabled for all critical resources",
    "requirements": [
      "CloudTrail enabled (multi-region)",
      "VPC Flow Logs enabled",
      "Database audit logs enabled",
      "Application logs in CloudWatch/ELK"
    ]
  },
  "network_segmentation": {
    "status": "pending",
    "description": "Network segmented by security zone",
    "requirements": [
      "Public/private subnet separation",
      "Security groups for least-privilege access",
      "Network ACLs if needed",
      "No public database endpoints"
    ]
  }
}
EOF
fi

# Parse compliance checklist
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Function to check compliance requirement
check_compliance() {
  local requirement="$1"
  local tool_output="$2"

  case "${requirement}" in
    "encryption_at_rest")
      if echo "${tool_output}" | grep -qiE "(kms|encryption.*key|encryptionatrest|encrypted.*true)"; then
        echo "PASS"
      else
        echo "FAIL"
      fi
      ;;
    "encryption_in_transit")
      if echo "${tool_output}" | grep -qiE "(tls|mtls|https|encrypted.*transit)"; then
        echo "PASS"
      else
        echo "FAIL"
      fi
      ;;
    "iam_least_privilege")
      if echo "${tool_output}" | grep -qiE "(least.?priv|condition|resource.*arn)" && \
         ! echo "${tool_output}" | grep -qE '\*\*|\"\*\"'; then
        echo "PASS"
      else
        echo "FAIL"
      fi
      ;;
    "audit_logging")
      if echo "${tool_output}" | grep -qiE "(cloudtrail|audit.*log|logging|logs)"; then
        echo "PASS"
      else
        echo "FAIL"
      fi
      ;;
    "network_segmentation")
      if echo "${tool_output}" | grep -qiE "(vpc|subnet|security.*group|network.*policy)"; then
        echo "PASS"
      else
        echo "FAIL"
      fi
      ;;
    *)
      echo "UNKNOWN"
      ;;
  esac
}

# Validate architecture
echo "[COMPLIANCE-VALIDATOR] Starting pre-deployment security check..."

PASSED=0
FAILED=0
UNKNOWN=0

# Extract tool output (set by hook environment)
TOOL_OUTPUT="${TOOL_OUTPUT:-}"

if [[ -z "${TOOL_OUTPUT}" ]]; then
  echo "[COMPLIANCE-VALIDATOR] No tool output provided, skipping validation"
  exit 0
fi

# Check each requirement
for check in "${REQUIRED_CHECKS[@]}"; do
  result=$(check_compliance "${check}" "${TOOL_OUTPUT}")

  if [[ "${result}" == "PASS" ]]; then
    echo "[COMPLIANCE-VALIDATOR] ✓ ${check}"
    ((PASSED++))
  elif [[ "${result}" == "FAIL" ]]; then
    echo "[COMPLIANCE-VALIDATOR] ✗ ${check} - MISSING"
    ((FAILED++))
  else
    echo "[COMPLIANCE-VALIDATOR] ? ${check} - UNKNOWN"
    ((UNKNOWN++))
  fi
done

# Log validation result
cat >> "${VALIDATION_LOG}" <<EOF
${TIMESTAMP} | Total: ${#REQUIRED_CHECKS[@]} | Passed: ${PASSED} | Failed: ${FAILED} | Unknown: ${UNKNOWN}
EOF

# Determine if deployment should proceed
if [[ ${FAILED} -gt 0 ]]; then
  echo ""
  echo "[COMPLIANCE-VALIDATOR] WARNING: Deployment has ${FAILED} security check(s) failing"
  echo "[COMPLIANCE-VALIDATOR] Review above findings and address before production deployment"
  echo "[COMPLIANCE-VALIDATOR] Critical failures:"
  echo "  - Encryption at rest: Required for all databases and sensitive storage"
  echo "  - IAM least privilege: Required for all roles and policies"
  echo "  - Audit logging: Required for compliance (SOC2, HIPAA, PCI)"
  echo ""
  echo "[COMPLIANCE-VALIDATOR] Proceeding with caution. Manual review required."
fi

# Summary
echo ""
echo "[COMPLIANCE-VALIDATOR] Summary: ${PASSED}/${#REQUIRED_CHECKS[@]} checks passed"
echo "[COMPLIANCE-VALIDATOR] Checklist: ${COMPLIANCE_CHECKLIST}"

exit 0
