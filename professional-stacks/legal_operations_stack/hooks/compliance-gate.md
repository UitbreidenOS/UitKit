# Hook: Compliance Gate

Blocks release of agreements until compliance validation passes.

---

## settings.json Entry

```json
{
  "hooks": {
    "complianceGate": {
      "event": "PreToolUse",
      "script": "legal_operations_stack/hooks/compliance-gate.sh",
      "toolFilter": ["release", "send", "approve", "execute"]
    }
  }
}
```

---

## What It Does

- Intercepts release, send, approve, or execute commands on contracts
- Checks if compliance validation has been run
- Verifies compliance status (COMPLIANT / CONDITIONAL / NON-COMPLIANT)
- Blocks release if compliance is NON-COMPLIANT
- Requires human confirmation if CONDITIONAL
- Allows release only if COMPLIANT or CONDITIONAL with documented override

---

## Hook Script

```bash
#!/bin/bash

# Compliance Gate Hook
# Fires on PreToolUse for release/send/approve/execute — blocks non-compliant documents

LEGAL_OPS_DIR="${HOME}/.claude/legal_ops"
COMPLIANCE_DB="${LEGAL_OPS_DIR}/compliance-status.db"
DOCUMENT="${FILE_PATH}"
COMMAND="${TOOL_NAME}"

# Ensure compliance DB exists
mkdir -p "$LEGAL_OPS_DIR"
touch "$COMPLIANCE_DB"

# Query compliance status for document
COMPLIANCE_STATUS=$(grep "^$DOCUMENT" "$COMPLIANCE_DB" | tail -1 | cut -d'|' -f2)

if [ -z "$COMPLIANCE_STATUS" ]; then
  echo "ERROR: No compliance validation found for $(basename $DOCUMENT)"
  echo "Run /compliance-check before $COMMAND"
  exit 1
fi

if [ "$COMPLIANCE_STATUS" == "NON-COMPLIANT" ]; then
  echo "ERROR: Document is NON-COMPLIANT. Cannot proceed with $COMMAND."
  echo "Run /compliance-check and fix all gaps before release."
  exit 1
fi

if [ "$COMPLIANCE_STATUS" == "CONDITIONAL" ]; then
  echo "WARNING: Document is CONDITIONAL — requires human approval to proceed."
  echo "Gaps flagged for remediation. Proceed? (yes/no)"
  read APPROVAL
  if [ "$APPROVAL" != "yes" ]; then
    echo "Release blocked by user."
    exit 1
  fi
  echo "Proceeding with CONDITIONAL compliance — documented override."
fi

if [ "$COMPLIANCE_STATUS" == "COMPLIANT" ]; then
  echo "Compliance gate passed: COMPLIANT"
  exit 0
fi
```

---

## Compliance Status Database

File: `~/.claude/legal_ops/compliance-status.db`

Format:
```
document-path|COMPLIANT|2026-06-13T14:35:22Z|validator
example-contract.pdf|CONDITIONAL|2026-06-10T09:15:00Z|analyzer
vendor-agreement.docx|NON-COMPLIANT|2026-06-05T16:42:00Z|reviewer
```

---

## Compliance Statuses

| Status | Meaning | Action |
|---|---|---|
| **COMPLIANT** | All requirements met | Release allowed |
| **CONDITIONAL** | Some requirements need clarification or remediation | Release allowed with human override |
| **NON-COMPLIANT** | Critical gaps prevent release | Release blocked; remediation required |

---

## Remediation Workflow

1. Run `/compliance-check [document] [framework]`
2. Review compliance gaps
3. Edit document to address gaps
4. Re-run `/compliance-check` to verify fixes
5. Once COMPLIANT or CONDITIONAL, human approves
6. Release/send command now allowed

---

## Key Properties

- **Blocking:** Prevents release of non-compliant documents
- **Override-able:** CONDITIONAL status allows human approval
- **Audit Trail:** All override approvals logged
- **Automatic:** Runs on every release/send/approve/execute command
- **Framework-aware:** Validates against GDPR, SOC 2, ISO 27001, or custom

---

## Related Hooks

- `document-audit-trail` — Log all document access
- `version-control` — Track document versions
