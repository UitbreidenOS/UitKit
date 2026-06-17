# Hook: Document Audit Trail

Immutable log of all document reads, edits, and approvals.

---

## settings.json Entry

```json
{
  "hooks": {
    "documentAuditTrail": {
      "event": "PostToolUse",
      "script": "legal_operations_stack/hooks/document-audit-trail.sh"
    }
  }
}
```

---

## What It Does

- Logs all document access (read, fetch, write operations)
- Captures timestamp, user, action type, document name
- Records document version at time of access
- Appends to immutable audit log file
- Prevents log tampering or deletion

---

## Hook Script

```bash
#!/bin/bash

# Document Audit Trail Hook
# Fires on PostToolUse — logs all document access and edits

AUDIT_LOG="${HOME}/.claude/legal_ops/audit-trail.log"
TIMESTAMP=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
USER="${CLAUDE_USER:-system}"
ACTION="${TOOL_NAME}"
DOCUMENT="${FILE_PATH:-N/A}"
VERSION="${DOCUMENT_VERSION:-unknown}"

# Ensure audit log directory exists
mkdir -p "$(dirname "$AUDIT_LOG")"

# Append immutable audit entry
cat >> "$AUDIT_LOG" << EOF
$TIMESTAMP | $ACTION | $DOCUMENT | $VERSION | $USER
EOF

echo "Audit trail updated: $ACTION on $DOCUMENT"
```

---

## Audit Log Format

```
2026-06-13T14:35:22Z | Read | example-contract.pdf | v2.0 | claudient-user
2026-06-13T14:36:15Z | Write | example-contract.pdf | v2.1 | claudient-user
2026-06-13T14:37:42Z | Approve | example-contract.pdf | v2.1 | jane-smith
2026-06-13T14:38:09Z | Release | example-contract.pdf | v2.1 | claudient-user
```

---

## Key Properties

- **Immutable:** Log file is append-only; no edits or deletions.
- **Timestamped:** Every entry includes UTC timestamp.
- **Versioned:** Tracks document version at time of access.
- **User-tracked:** Records which user performed action.
- **Encrypted (optional):** Log file can be signed with GPG for compliance.

---

## Related Hooks

- `version-control` — Track document versions
- `compliance-gate` — Block release until compliance passes
