# Member Privacy Gate Hook

## What This Hook Does

Prevents access to member personally identifiable information (PII) beyond aggregated metrics. Fires on Read attempts to member data files or API calls to fetch member email addresses, phone numbers, or sensitive engagement data. Requires explicit human override for direct member outreach.

## Settings.json Entry

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/member-privacy-gate.sh"
          }
        ]
      },
      {
        "matcher": "Airtable API",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/member-privacy-gate.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: member-privacy-gate.sh

```bash
#!/bin/bash
# Member privacy gate for Community Manager Stack
# Prevents access to member PII without explicit consent/override
# Exit 1 if access should be blocked, otherwise pass

FILE=$1
COMMAND=$2

# Allow aggregated data, block individual PII access
if [[ "$FILE" =~ member|profile|contact|email|phone ]]; then
  # Check if file is aggregated (health reports, segment summaries)
  if [[ "$FILE" =~ health-report|segment-summary|cohort-analysis ]]; then
    exit 0  # Aggregated data is OK
  fi

  # Check if this is an individual member profile access
  if [[ "$FILE" =~ accounts/.*-profile\.md|members/.*-details\.md ]]; then
    echo "🔒 PRIVACY GATE: Attempting to read individual member data"
    echo ""
    echo "Reason: Direct member PII access requires human consent"
    echo ""
    echo "ALLOWED ACCESS:"
    echo "  - Aggregated member statistics (health reports, segment analysis)"
    echo "  - Anonymized engagement trends"
    echo "  - Public member names/titles (from community activity)"
    echo ""
    echo "BLOCKED ACCESS:"
    echo "  - Email addresses (unless member has approved outreach)"
    echo "  - Phone numbers"
    echo "  - Personal information from signup forms"
    echo "  - Individual engagement profiles"
    echo ""
    echo "To access, confirm with human: 'I need member:jane.doe's profile for [reason].'"
    exit 1
  fi
fi

exit 0
```

## Behavior

**On attempted PII access:** Blocks the read/API call, displays what data is restricted and why, and prompts for human confirmation.

**On aggregated data access:** Allows read without friction (health reports, segment summaries, anonymized trends).

**On public data access:** Allows read (member names, titles, public post history).

## Setup Instructions

1. Create `.claude/hooks/` directory in your project root (if it doesn't exist):
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script above as `.claude/hooks/member-privacy-gate.sh`

3. Make the script executable:
   ```bash
   chmod +x .claude/hooks/member-privacy-gate.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json`

5. Restart Claude Code for the hook to take effect

## Privacy Policy

**Member data is private by default.** Only share aggregated insights unless the human explicitly approves direct member contact.

**DO NOT:** Access, read, or share email addresses, phone numbers, or personal details from member profiles without human approval.

**DO:** Use aggregated metrics (member growth, churn rate, engagement trends) freely in reports and analysis.

**DO:** Reference public member contributions (posts, comments, discussions) when relevant to community strategy.

**ESCALATE:** If a member asks to be contacted directly, confirm human approval before generating outreach message.

---
