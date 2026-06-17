# ICP Filter Hook

## Purpose
Intercepts WebSearch and WebFetch calls and checks whether the target company meets ICP criteria before research begins.

## Settings.json Entry
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "WebSearch|WebFetch",
        "hooks": [
          { "type": "command", "command": "bash .claude/hooks/icp-filter.sh" }
        ]
      }
    ]
  }
}
```

## Hook Script (icp-filter.sh)
```bash
#!/bin/bash
# Reads the tool input from CLAUDE_TOOL_INPUT
# Checks if a disqualified company is being researched
# For a full implementation, integrate with your CRM opt-out list

INPUT=$(echo "$CLAUDE_TOOL_INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(list(d.values())[0] if d else '')" 2>/dev/null)

# Check opt-out list (companies/people who asked not to be contacted)
OPTOUT_FILE=".claude/optout-list.txt"
if [ -f "$OPTOUT_FILE" ]; then
  while IFS= read -r line; do
    if echo "$INPUT" | grep -qi "$line"; then
      echo "ICP BLOCK: $line is on the opt-out list. Research blocked."
      exit 1
    fi
  done < "$OPTOUT_FILE"
fi

# Unknown — allow through with notice
echo "ICP FILTER: Proceeding with research. Qualify this account before sequencing." >&2
```

## Behavior
- **On block (opt-out list match):** Prints block message, exit 1 prevents the tool call.
- **On pass:** Prints a low-visibility reminder to qualify after research.

## Setup
1. Save script as `.claude/hooks/icp-filter.sh` and `chmod +x`
2. Create `.claude/optout-list.txt` with one company/person per line (anyone who asked not to be contacted)
3. Add settings.json entry

## Extending
For full ICP scoring before research, integrate the icp-qualifier skill into this hook or run it manually first.
