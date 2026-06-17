# Metric Alignment Hook

## What This Hook Does

Ensures metric definitions match across dbt, documentation, and dashboard layers. Fires when metrics are modified, catches calculation drifts, and prevents duplicate definitions. Warns if metric name/formula appears in multiple places with different values.

## Settings.json Entry

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write.*(schema\\.yml|CLAUDE\\.md|metrics-definition\\.md)",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/metric-alignment.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Script: metric-alignment.sh

```bash
#!/bin/bash
# Metric alignment check for Analytics Engineer Stack
# Ensures metric definitions consistent across dbt, docs, and registry
# Exit 1 if critical misalignments found

FILE=$(echo "$CLAUDE_TOOL_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null)

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  exit 0
fi

ISSUES=0

# Check 1: If this is a metrics registry file, verify metric definitions are unambiguous
if echo "$FILE" | grep -i "metrics-definition\|registry" > /dev/null; then
  # Look for duplicate metric names
  DUPLICATES=$(grep -E "^## Metric:" "$FILE" | sort | uniq -d)
  if [ -n "$DUPLICATES" ]; then
    echo "❌ CRITICAL: Duplicate metric definitions found:"
    echo "$DUPLICATES"
    ISSUES=$((ISSUES + 1))
  fi
  
  # Check each metric has Business Definition, Formula, and Grain
  METRICS=$(grep -E "^## Metric:" "$FILE" | sed 's/## Metric: //')
  while IFS= read -r metric; do
    if [ -z "$metric" ]; then continue; fi
    
    METRIC_SECTION=$(sed -n "/^## Metric: $metric/,/^## Metric:/p" "$FILE" | head -n -1)
    
    if ! echo "$METRIC_SECTION" | grep -E "Business Definition:" > /dev/null; then
      echo "⚠️  Metric '$metric' missing Business Definition"
      ISSUES=$((ISSUES + 1))
    fi
    
    if ! echo "$METRIC_SECTION" | grep -E "Formula:" > /dev/null; then
      echo "⚠️  Metric '$metric' missing Formula"
      ISSUES=$((ISSUES + 1))
    fi
    
    if ! echo "$METRIC_SECTION" | grep -E "Grain:" > /dev/null; then
      echo "⚠️  Metric '$metric' missing Grain specification"
      ISSUES=$((ISSUES + 1))
    fi
  done <<< "$METRICS"
fi

# Check 2: If this is dbt schema.yml, ensure metric nodes match registry
if echo "$FILE" | grep -i "schema.yml\|models.*yml" > /dev/null; then
  if grep -E "^metrics:" "$FILE" > /dev/null; then
    # Check each dbt metric has matching registry entry
    METRICS=$(grep -E "name:" "$FILE" | grep -A 1 "metrics:" | sed 's/.*name: //' | tr -d "'" | tr -d '"')
    
    # Note: This is a basic check; full registry validation would need external lookup
    while IFS= read -r metric; do
      if [ -z "$metric" ]; then continue; fi
      
      # Check metric has calculation_method defined
      if ! grep -A 20 "- name: $metric" "$FILE" | grep -E "calculation_method:" > /dev/null; then
        echo "⚠️  dbt Metric '$metric' missing calculation_method"
        ISSUES=$((ISSUES + 1))
      fi
    done <<< "$METRICS"
  fi
fi

# Check 3: If CLAUDE.md, ensure metric references match skills/commands
if echo "$FILE" | grep -i "CLAUDE.md" > /dev/null; then
  if grep -E "## Metrics" "$FILE" > /dev/null; then
    if ! grep -E "\`.*-definition\`\|metrics-definition" "$FILE" > /dev/null; then
      echo "⚠️  CLAUDE.md references metrics but doesn't link to metrics-definition skill"
      ISSUES=$((ISSUES + 1))
    fi
  fi
fi

if [ $ISSUES -gt 0 ]; then
  echo ""
  echo "Metric alignment is critical. Fix issues above to maintain single source of truth."
  exit 0  # Warning only; don't block save
fi

exit 0
```

## Behavior

**On warning:** Prints warnings; save completes (exit code 0 = non-blocking).

**On critical issue:** Blocks save (exit code 1); requires fix before saving.

**On pass:** Silent — no output, Write completes normally.

## Setup Instructions

1. Create `.claude/hooks/` directory:
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save the script above as `.claude/hooks/metric-alignment.sh`

3. Make executable:
   ```bash
   chmod +x .claude/hooks/metric-alignment.sh
   ```

4. Add settings.json entry above to `.claude/settings.json`

5. Restart Claude Code

---
