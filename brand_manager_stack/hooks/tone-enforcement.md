# Tone Enforcement Hook

## Purpose

Intercepts all content generation and identifies brand voice violations in real-time. Scans for banned words, corporate jargon, passive voice, hedging language, and off-brand tone before content is finalized. Non-blocking; flags for human review.

## Settings.json Entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          { "type": "command", "command": "bash .claude/hooks/tone-enforcement.sh" }
        ]
      }
    ]
  }
}
```

## Hook Script (tone-enforcement.sh)

```bash
#!/bin/bash
# Reads the tool output from CLAUDE_TOOL_OUTPUT (content just written)
# Scans for banned words, jargon, and tone violations
# Outputs warnings but does not block

CONTENT="$CLAUDE_TOOL_OUTPUT"

# Define banned words (case-insensitive)
BANNED_WORDS=(
  "synergy"
  "leverage"
  "disruptive"
  "revolutionary"
  "game-changer"
  "blockchain"
  "AI-powered"
  "cutting-edge"
  "best-in-class"
  "world-class"
  "industry-leading"
  "seamless"
  "robust"
  "pivot"
  "circle back"
  "reach out"
  "touch base"
  "low-hanging fruit"
  "deep dive"
  "paradigm"
)

VIOLATIONS_FOUND=0

# Check for banned words
for word in "${BANNED_WORDS[@]}"; do
  if echo "$CONTENT" | grep -qi "\b$word\b"; then
    echo "⚠️  TONE VIOLATION: Banned word found: '$word'" >&2
    VIOLATIONS_FOUND=$((VIOLATIONS_FOUND + 1))
  fi
done

# Check for corporate jargon
if echo "$CONTENT" | grep -qi "verticals\|ecosystem\|unlock value\|empower\|solution"; then
  echo "⚠️  TONE VIOLATION: Corporate jargon detected" >&2
  VIOLATIONS_FOUND=$((VIOLATIONS_FOUND + 1))
fi

# Check for passive voice patterns (basic heuristic)
if echo "$CONTENT" | grep -qi "should be\|is designed to\|can be"; then
  echo "⚠️  TONE VIOLATION: Possible passive voice detected — consider active voice" >&2
  VIOLATIONS_FOUND=$((VIOLATIONS_FOUND + 1))
fi

# Check for hedging language
if echo "$CONTENT" | grep -qi "we believe\|we think\|arguably\|it could be\|somewhat\|fairly\|relatively\|in some cases"; then
  echo "⚠️  TONE VIOLATION: Hedging language found — make claims declarative" >&2
  VIOLATIONS_FOUND=$((VIOLATIONS_FOUND + 1))
fi

# Summary
if [ $VIOLATIONS_FOUND -gt 0 ]; then
  echo "⚠️  TONE CHECK: $VIOLATIONS_FOUND violation(s) found. Review before publishing." >&2
else
  echo "✓ TONE CHECK: No violations detected." >&2
fi

exit 0
```

## Behavior

- **On violations found:** Prints warning messages to stderr with count and type of violations
- **On pass:** Prints green checkmark and "no violations" message
- **Blocking:** Does NOT block execution; warnings are informational only
- **Timing:** Fires immediately after content is written; allows human to review and fix

## Setup

1. Save script as `.claude/hooks/tone-enforcement.sh` and `chmod +x`
2. Add settings.json entry under `PostToolUse` hooks for `Write` tool
3. When content is written, hook automatically scans and reports violations to stderr

## Example Output

```
⚠️  TONE VIOLATION: Banned word found: 'leverage'
⚠️  TONE VIOLATION: Banned word found: 'paradigm'
⚠️  TONE VIOLATION: Corporate jargon detected
⚠️  TONE CHECK: 3 violation(s) found. Review before publishing.
```

## Extending

To add more banned words:
1. Edit the `BANNED_WORDS` array in the script
2. Add new jargon checks with `grep -qi` patterns
3. Save and re-run

For more sophisticated checks, integrate the tone-enforcer skill (which has higher fidelity) by invoking it explicitly before content publication.

---
