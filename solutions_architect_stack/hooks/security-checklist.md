# Security Checklist Hook

## What This Hook Does

Scans architecture and design documents for security and compliance considerations. Flags if auth/authz, encryption, compliance requirements, or audit logging are missing or vague. Fires after Claude writes any architecture file. Helps prevent shipping systems with security gaps.

## Settings.json Entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/security-checklist.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: security-checklist.sh

```bash
#!/bin/bash
# Security checklist for Solutions Architect Stack
# Warns if security/compliance sections are vague or missing
# Exit 0 (warning only) — doesn't block writes

FILE=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  exit 0
fi

# Only check architecture/design files
if ! grep -q "design\|architecture\|blueprint" <<< "$FILE"; then
  exit 0
fi

ISSUES=()

# Check for vague security language
if grep -iq "TODO\|FIXME\|TBD" "$FILE" | grep -iq "security\|auth\|encryption"; then
  ISSUES+=("Security/auth marked TODO or FIXME")
fi

# Check for generic "TBD" in critical sections
if grep -iq "security.*TBD\|TBD.*security\|auth.*TBD\|compliance.*TBD" "$FILE"; then
  ISSUES+=("Authentication/authorization not specified (marked TBD)")
fi

if grep -iq "encryption.*TBD\|TBD.*encryption" "$FILE"; then
  ISSUES+=("Encryption strategy not specified (marked TBD)")
fi

if grep -iq "compliance\|gdpr\|hipaa\|sox" -i "$FILE" | head -1 | grep -iq "unclear\|TBD\|TBD"; then
  ISSUES+=("Compliance requirements unclear or deferred")
fi

# Positive checks: has explicit auth?
if ! grep -iq "oauth\|jwt\|saml\|kerberos\|mTLS\|api key\|basic auth" "$FILE"; then
  ISSUES+=("No explicit authentication mechanism documented")
fi

# Positive checks: has encryption?
if ! grep -iq "encryption\|TLS\|HTTPS\|encrypted\|encrypted at rest\|AES" "$FILE"; then
  ISSUES+=("No encryption strategy documented (in transit or at rest)")
fi

# Positive checks: has audit logging?
if ! grep -iq "audit\|logging\|compliance\|track\|trace" "$FILE"; then
  ISSUES+=("No audit logging or compliance tracking mentioned")
fi

if [ ${#ISSUES[@]} -gt 0 ]; then
  echo "🔒 SECURITY GAPS: Review authentication, encryption, and compliance in $FILE"
  echo ""
  for issue in "${ISSUES[@]}"; do
    echo "  ⚠️  $issue"
  done
  echo ""
  echo "Recommendations:"
  echo "  • Document authentication mechanism (OAuth2, JWT, API key, etc.)"
  echo "  • Specify encryption in transit (TLS) and at rest (AES-256, etc.)"
  echo "  • Define audit logging for compliance (GDPR, HIPAA, SOC2, etc.)"
  echo "  • Add data residency and access control rules"
  echo ""
  exit 0  # Warning only, don't block
fi
```

## Behavior

**On security gaps:** Prints warning header with filename, lists security gaps (missing auth, encryption, audit logging, compliance), and recommends best practices. Does NOT block the write (exit code 0 — informational only).

**On pass:** Silent — no output, Write completes normally.

## Setup Instructions

1. Create `.claude/hooks/` directory in your project root (if it doesn't exist):
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script above as `.claude/hooks/security-checklist.sh`

3. Make the script executable:
   ```bash
   chmod +x .claude/hooks/security-checklist.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json` (or `.claude/settings.local.json` for local-only enforcement)

5. Restart Claude Code for the hook to take effect

## Notes

This is a **warning-only** hook — it doesn't block output, just alerts you to security gaps. The goal is to catch missing auth/encryption/compliance before they become production incidents.
