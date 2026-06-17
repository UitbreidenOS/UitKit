# Hook: Version Control

Prevents document overwrites. Maintains changelog on every document update.

---

## settings.json Entry

```json
{
  "hooks": {
    "versionControl": {
      "event": "PostToolUse",
      "script": "legal_operations_stack/hooks/version-control.sh"
    }
  }
}
```

---

## What It Does

- Detects document edits (write operations)
- Prevents direct overwrites of existing documents
- Increments version number (v1.0 → v1.1 → v2.0)
- Maintains changelog with all changes
- Preserves backup of previous version
- Requires changelog entry before saving new version

---

## Hook Script

```bash
#!/bin/bash

# Version Control Hook
# Fires on PostToolUse for document writes — prevents overwrites and tracks versions

LEGAL_OPS_DIR="${HOME}/.claude/legal_ops"
DOCUMENT="${FILE_PATH}"
CHANGES="${TOOL_PARAMS[changes]:-}"
EDITOR="${CLAUDE_USER:-system}"
TIMESTAMP=$(date -u +'%Y-%m-%dT%H:%M:%SZ')

# Ensure legal ops directory exists
mkdir -p "$LEGAL_OPS_DIR"

# Check if document already exists
if [ -f "$DOCUMENT" ]; then
  # Extract current version
  CURRENT_VERSION=$(grep -m1 "^## Version" "$DOCUMENT" | sed 's/^## Version //; s/ —.*//')
  MAJOR=$(echo $CURRENT_VERSION | cut -d. -f1)
  MINOR=$(echo $CURRENT_VERSION | cut -d. -f2)
  
  # Increment minor version
  NEW_MINOR=$((MINOR + 1))
  NEW_VERSION="${MAJOR}.${NEW_MINOR}"
  
  # Create backup of old version
  BACKUP_DIR="${LEGAL_OPS_DIR}/backups"
  mkdir -p "$BACKUP_DIR"
  cp "$DOCUMENT" "$BACKUP_DIR/$(basename $DOCUMENT).v${CURRENT_VERSION}.bak"
  
  echo "Version control: Backed up $(basename $DOCUMENT) as v${CURRENT_VERSION}"
  echo "New version: v${NEW_VERSION}"
  echo "Changes logged: $CHANGES"
else
  # New document
  NEW_VERSION="1.0"
  echo "Version control: New document created"
fi

# Update changelog in document (if applicable)
if [ -n "$CHANGES" ]; then
  CHANGELOG_ENTRY="## Version $NEW_VERSION — $TIMESTAMP — $EDITOR"$'\n'"$CHANGES"
  echo "$CHANGELOG_ENTRY added to changelog"
fi
```

---

## Changelog Format

Each document should include a changelog section:

```
## [Document Name]

### Changelog

## Version 2.0 — 2026-06-10T14:35:22Z — vendor-editor
- Changed: Payment schedule (quarterly → monthly, Section 4.1)
- Changed: SLA uptime target (99.9% → 99.5%, Section 11.2)
- Status: EXECUTED
- Signed: Jane Smith — 2026-06-10 14:35

## Version 1.1 — 2026-06-05T09:15:00Z — claude-user
- Changed: Liability cap (unlimited → 12 months annual fees, Section 8.2)
- Changed: Renewal notice period (90 days → 60 days, Section 9.1)
- Status: APPROVED
- Approved: Jane Smith — 2026-06-05 09:15

## Version 1.0 — 2026-06-01T16:42:00Z — claude-user
- Status: DRAFT
- Created from template
```

---

## Backup Strategy

- Backups stored in `~/.claude/legal_ops/backups/`
- Naming: `[document-name].v[version].bak`
- Retained for 7 years (per typical legal hold requirements)
- Accessible via git history or manual retrieval

---

## Key Properties

- **No Overwrites:** Document writes always create new version
- **Immutable History:** All previous versions preserved
- **Changelog Required:** Every version bump requires change description
- **Backup Automatic:** Previous version backed up before save
- **Audit Trail:** Version control logs all changes

---

## Related Hooks

- `document-audit-trail` — Log all document access
- `compliance-gate` — Block release until compliance passes
