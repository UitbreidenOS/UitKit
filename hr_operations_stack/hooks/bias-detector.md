# Bias Detector Hook

## What This Hook Does
Analyzes job descriptions, interview questions, and performance feedback for potentially discriminatory or biased language. Flags age-related language, gendered terms, ableist language, and subjective bias. Recommends inclusive alternatives.

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
            "command": "bash .claude/hooks/bias-detector.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: bias-detector.sh

```bash
#!/bin/bash
# Bias detector for HR Operations Stack
# Scans job descriptions, interview questions, and feedback for discriminatory language
# Warns if potential bias detected; recommends inclusive alternatives

BIAS_PATTERNS="digital native|young and dynamic|recent graduate|native speaker|energetic|passionate|guru|rockstar|ninja|fast-paced|aggressive|motherly|fatherly|girls|boys|ladies|gentlemen|crazy|insane|lame|stupid|handicapped|crippled|retarded"

FILE=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  exit 0
fi

# Check if file is HR-related (job description, interview, feedback, performance)
if [[ "$FILE" =~ (job|jd|interview|feedback|performance|review|description) ]]; then
  MATCH=$(grep -inoE "$BIAS_PATTERNS" "$FILE" | head -5)
  
  if [ -n "$MATCH" ]; then
    echo "⚠️  BIAS DETECTOR: Potentially biased language detected"
    echo ""
    echo "$MATCH"
    echo ""
    echo "Recommendations:"
    echo "  - 'digital native' → 'proficiency with modern tools' or 'technical background'"
    echo "  - 'young and dynamic' → 'collaborative' or 'innovative'"
    echo "  - 'native speaker' → 'fluent in [language]'"
    echo "  - 'rockstar/ninja' → 'expert' or 'skilled professional'"
    echo "  - 'fast-paced' → 'dynamic' or 'high-priority projects'"
    echo "  - 'motherly/fatherly' → specific behaviors (supportive, mentoring, etc.)"
    echo "  - 'handicapped/crippled' → 'person with disability' or 'accessibility needs'"
    echo ""
    echo "Review and revise before posting externally."
  fi
fi

exit 0
```

## Behavior

**On bias detected:** Prints bias detector header, shows matching flagged language, and provides inclusive alternative suggestions. Does NOT block output; allows revision.

**On pass:** Silent — no output, Write completes normally.

## Setup Instructions

1. Create `.claude/hooks/` directory:
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script as `.claude/hooks/bias-detector.sh`

3. Make executable:
   ```bash
   chmod +x .claude/hooks/bias-detector.sh
   ```

4. Add settings.json entry to `.claude/settings.json` or `.claude/settings.local.json`

5. Restart Claude Code

---
