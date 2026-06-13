# Sentiment Threshold Hook

## What This Hook Does

Auto-flags posts scoring <-0.6 (very negative) on the sentiment analyzer. Blocks publication and triggers manual moderation review before a response is sent. Protects community from escalating negative sentiment or toxic discussions.

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
            "command": "bash .claude/hooks/sentiment-threshold.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: sentiment-threshold.sh

```bash
#!/bin/bash
# Sentiment threshold for Community Manager Stack
# Flags very negative posts (score <-0.6) for moderation review
# Exit 1 if high-risk sentiment detected, otherwise pass

FILE=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  exit 0
fi

# Check if file contains sentiment analysis
if ! grep -q "Sentiment.*:.*-0\.[6-9]\|Sentiment.*:.*-1\.0\|Very Negative\|Toxicity.*: [0-9]\.\\([6-9]\\|[1][0-0]\\)" "$FILE"; then
  exit 0  # Not a sentiment analysis or sentiment is acceptable
fi

# Extract sentiment score if present
SENTIMENT=$(grep -i "Polarity.*:" "$FILE" | head -1 | grep -oE "\-0\.[6-9]|\-1\.0" | head -1)

if [ -z "$SENTIMENT" ]; then
  exit 0  # No sentiment score found
fi

# Check if toxicity score is high
TOXICITY=$(grep -i "Toxicity.*:" "$FILE" | head -1 | grep -oE "0\.[6-9]|1\.0" | head -1)

if [ -n "$TOXICITY" ] || [ "$SENTIMENT" == "-1.0" ]; then
  echo "⚠️  SENTIMENT ALERT: Very negative post flagged for review"
  echo ""
  echo "Sentiment Score: $SENTIMENT (Threshold: <-0.6)"
  echo "Toxicity Level: $TOXICITY (Threshold: >0.5)"
  echo ""
  echo "This post requires human moderation review before response is sent."
  echo ""
  echo "REVIEW GUIDELINES:"
  echo "  ✓ Valid frustration or constructive criticism? → Respond with empathy + resources"
  echo "  ✓ Toxic or abusive language? → Warn and educate on community standards"
  echo "  ✓ Misinformation or false claim? → Correct factually, offer alternative view"
  echo ""
  echo "Save the moderation response to a separate file for human review."
  exit 1
fi

exit 0
```

## Behavior

**On high negative sentiment (score <-0.6):** Blocks the response from being saved, displays sentiment alert, and prompts for human review before proceeding.

**On high toxicity (>0.5):** Same behavior — requires human moderation.

**On acceptable sentiment:** Allows write to proceed normally.

## Setup Instructions

1. Create `.claude/hooks/` directory in your project root (if it doesn't exist):
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script above as `.claude/hooks/sentiment-threshold.sh`

3. Make the script executable:
   ```bash
   chmod +x .claude/hooks/sentiment-threshold.sh
   ```

4. Add the settings.json entry above to `.claude/settings.json`

5. Restart Claude Code for the hook to take effect

## When It Triggers

- When analyzing a very negative post (score <-0.6)
- When a post has high toxicity indicators (personal attacks, slurs, dismissiveness)
- When responding to hostile or contentious discussions
- When flagging a post for escalation

## Moderation Response Framework

**For Valid Frustration (Low Toxicity, High Negativity):**
> I hear the frustration here, and this is a real challenge we're working on. [Acknowledge specific issue]. Here's what we're doing: [action]. In the meantime, [resource or workaround]. Thanks for flagging this.

**For Toxic Language (High Toxicity, High Negativity):**
> We value passionate discussion, but [specific example] doesn't fit our community standards. We ask that all members keep conversations respectful and professional. If you'd like to discuss your underlying concern, I'm here to help.

**For Misinformation (High Negativity, False Claim):**
> I understand the concern, but [fact]. Here's the accurate picture: [correct information]. [Additional context or resource]. Happy to discuss further if this doesn't clarify.

## Sentiment Thresholds

| Polarity Score | Toxicity Score | Action |
|---|---|---|
| -1.0 to -0.8 | >0.3 | BLOCK — Requires immediate moderation review |
| -0.8 to -0.6 | >0.5 | BLOCK — Flag for human review |
| -0.6 to -0.3 | >0.7 | WARN — Notify CM, allow response after review |
| -0.6 to -0.3 | <0.3 | ALLOW — Valid criticism, no tone issue |

---
