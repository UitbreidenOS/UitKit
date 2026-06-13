# Guideline Enforcer Hook

## What This Hook Does

Scans all flagged content for potential guideline violations: profanity, links to known malicious sites, disrespectful tone, spam patterns. Surfaces content for moderator review before approval or removal. Prevents moderation misses and ensures consistency.

## Settings.json Entry

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write.*community|post.*create",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/guideline-enforcer.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: guideline-enforcer.sh

```bash
#!/bin/bash
# Guideline enforcer for Community Manager Stack
# Scans flagged content for profanity, spam, links, and tone
# Exit 0 to allow, exit 1 to flag for review

PROFANITY_LIST="(damn|hell|ass|b[*]tch|hell)"
SPAM_PATTERNS="(viagra|casino|crypto|lottery|weight loss)"
MALICIOUS_URLS="(bit\.ly|tinyurl|short\.link|goo\.gl)"

CONTENT=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('content',''))" 2>/dev/null)

if [ -z "$CONTENT" ]; then
  exit 0
fi

# Check for profanity
if echo "$CONTENT" | grep -iqE "$PROFANITY_LIST"; then
  echo "⚠️ GUIDELINE FLAG: Potential profanity detected"
  echo "Review for community standards compliance"
  exit 1
fi

# Check for spam keywords
if echo "$CONTENT" | grep -iqE "$SPAM_PATTERNS"; then
  echo "⚠️ GUIDELINE FLAG: Spam pattern detected"
  echo "Likely spam or commercial spam. Flag for removal."
  exit 1
fi

# Check for suspicious URL shorteners
if echo "$CONTENT" | grep -iE "$MALICIOUS_URLS"; then
  echo "⚠️ GUIDELINE FLAG: Suspicious URL shortener detected"
  echo "Review link before approval. Risk of phishing or malware."
  exit 1
fi

# Check for harassment patterns (basic)
if echo "$CONTENT" | grep -iqE "(you're.*stupid|you.*suck|i hate you|kill yourself)"; then
  echo "⚠️ GUIDELINE FLAG: Potential harassment detected"
  echo "Review for escalation to safety team."
  exit 1
fi

# Pass silently
exit 0
```

## Setup Instructions

1. Create `.claude/hooks/` directory (if it doesn't exist):
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script above as `.claude/hooks/guideline-enforcer.sh`

3. Make the script executable:
   ```bash
   chmod +x .claude/hooks/guideline-enforcer.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json`

5. Restart Claude Code

## Behavior

**On flag:** Prints warning with reason. Content is held for moderator review. Moderator manually approves or removes.

**On pass:** Silent. Content proceeds normally.

## Limitations

- Does not remove content automatically (preserves human review)
- Regex patterns are basic; context is evaluated by moderator
- False positives possible; moderator makes final call

---
