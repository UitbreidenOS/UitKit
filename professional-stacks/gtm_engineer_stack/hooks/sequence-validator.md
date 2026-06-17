# Sequence Validator Hook

## Purpose
Validates cold email sequences after they are written. Runs structural checks on sequence files to ensure they meet GTM standards: 5 touches minimum, question-based CTAs, and specific trigger references (not generic messaging).

## When It Fires
After a file is written via the Write tool, if the filename contains "sequence" or "cold-email", the hook validates the structure and reports pass/fail.

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
            "command": "bash .claude/hooks/sequence-validator.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script (sequence-validator.sh)

```bash
#!/bin/bash
FILE=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

# Only run on sequence files
if [[ "$FILE" != *"sequence"* ]] && [[ "$FILE" != *"cold-email"* ]]; then
  exit 0
fi

if [ ! -f "$FILE" ]; then
  exit 0
fi

CONTENT=$(cat "$FILE")
FAILS=0

# Check 1: Touch count (should have 5)
TOUCHES=$(echo "$CONTENT" | grep -ciE "touch [1-5]|email [1-5]|follow.up [1-5]")
if [ "$TOUCHES" -lt 5 ]; then
  echo "FAIL: Less than 5 touches found ($TOUCHES)"
  FAILS=$((FAILS+1))
fi

# Check 2: CTA is a question
QUESTIONS=$(echo "$CONTENT" | grep -c "?$")
if [ "$QUESTIONS" -lt 1 ]; then
  echo "FAIL: No question CTA found"
  FAILS=$((FAILS+1))
fi

# Check 3: Has a trigger reference (not generic)
if ! echo "$CONTENT" | grep -qiE "series [a-z]|raised|launched|hired|expanded|announced"; then
  echo "FAIL: No specific trigger reference found"
  FAILS=$((FAILS+1))
fi

if [ "$FAILS" -gt 0 ]; then
  echo "SEQUENCE INVALID: $FAILS check(s) failed. Fix before using."
  exit 1
fi

echo "SEQUENCE VALID ✓"
```

## Validation Checks

1. **Five Touches**: Detects at least 5 distinct touches (email 1-5, follow-up 1-5, or touch 1-5 references)
2. **Question CTA**: Ensures the final call-to-action ends with a question mark (not a statement or imperative)
3. **Specific Trigger**: Confirms the sequence references a named trigger (raised, launched, hired, expanded, announced, or series label)

## Setup

1. Save the script as `.claude/hooks/sequence-validator.sh` in the project root
2. Make it executable: `chmod +x .claude/hooks/sequence-validator.sh`
3. Add the `PostToolUse` hook entry to `settings.json` (or `.claude/settings.json`)
4. The hook will run automatically after any Write tool call that targets a file with "sequence" or "cold-email" in the name

## Exit Codes

- **0**: Sequence passed all checks
- **1**: One or more validation checks failed; message indicates which checks failed
