# Sentiment Monitor Hook

## What This Hook Does

Monitors all posts and comments in real-time for sentiment shifts, crisis signals (harassment, misinformation), and emerging frustrations. Tracks positive vs. negative language. Alerts moderators if sentiment drops or crisis patterns detected.

## Settings.json Entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write.*post|Write.*comment",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/sentiment-monitor.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: sentiment-monitor.sh

```bash
#!/bin/bash
# Sentiment monitor for Community Manager Stack
# Flags crisis signals: misinformation, harassment, safety threats
# Exit 0 to pass, exit 1 to escalate

POSITIVE_WORDS="(love|great|awesome|helpful|brilliant|inspiring|thank|appreciate|excited)"
NEGATIVE_WORDS="(hate|terrible|broken|dumb|stupid|worst|useless|disgusted|angry)"
MISINFORMATION_PATTERNS="(fake news|hoax|conspiracy|don't trust|lies|fraudulent)"
HARASSMENT_PATTERNS="(attack|abuse|threat|doxx|harass|toxic|bully)"
SAFETY_THREATS="(kill|suicide|self-harm|violence|bomb|terrorist)"

CONTENT=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('content',''))" 2>/dev/null)

if [ -z "$CONTENT" ]; then
  exit 0
fi

# Check for safety threats (immediate escalation)
if echo "$CONTENT" | grep -iqE "$SAFETY_THREATS"; then
  echo "🚨 CRISIS ALERT: Safety threat detected"
  echo "Immediate escalation required. Do not ignore."
  exit 1
fi

# Check for harassment or targeted attacks
if echo "$CONTENT" | grep -iqE "$HARASSMENT_PATTERNS"; then
  INTENSITY=$(echo "$CONTENT" | grep -icoE "$NEGATIVE_WORDS")
  if [ "$INTENSITY" -gt 2 ]; then
    echo "⚠️ CRISIS ALERT: Potential harassment detected"
    echo "Escalate to moderation team for review."
    exit 1
  fi
fi

# Check for misinformation
if echo "$CONTENT" | grep -iqE "$MISINFORMATION_PATTERNS"; then
  echo "⚠️ SENTIMENT ALERT: Misinformation pattern detected"
  echo "Flag for fact-check review. Do not approve without verification."
  exit 1
fi

# Sentiment analysis (basic)
POS_COUNT=$(echo "$CONTENT" | grep -icoE "$POSITIVE_WORDS")
NEG_COUNT=$(echo "$CONTENT" | grep -icoE "$NEGATIVE_WORDS")

if [ "$NEG_COUNT" -gt "$POS_COUNT" ] && [ "$NEG_COUNT" -gt 3 ]; then
  echo "⚠️ SENTIMENT ALERT: Negative sentiment detected (ratio $(($NEG_COUNT / $POS_COUNT + 1)):1)"
  echo "Monitor for emerging frustration trend."
  exit 0  # Pass but log alert
fi

# Pass silently
exit 0
```

## Setup Instructions

1. Create `.claude/hooks/` directory:
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script as `.claude/hooks/sentiment-monitor.sh`

3. Make it executable:
   ```bash
   chmod +x .claude/hooks/sentiment-monitor.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json`

5. Restart Claude Code

## Behavior

**On crisis alert (exit 1):** Stops content approval. Escalates to moderator with reason.

**On sentiment alert (exit 0 after warning):** Logs alert. Content proceeds. Moderator reviews alert log daily.

**On pass:** Silent.

## Integration

- Logs feed daily sentiment report for community manager
- Tracks crisis alert frequency to identify patterns
- Monthly review: are alerts actionable or too noisy?

---
