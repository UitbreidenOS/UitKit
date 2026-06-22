#!/bin/bash
# Audit search script for feature inventory

INVENTORY="feature-inventory.txt"
OUTPUT="feature-presence.txt"
INDEX="index.json"

# Clear output
> "$OUTPUT"

while IFS='|' read -r id category name; do
    # Trim whitespace
    id=$(echo "$id" | xargs)
    category=$(echo "$category" | xargs)
    name=$(echo "$name" | xargs)

    # Clean name for searching (remove special chars)
    clean_name=$(echo "$name" | sed 's/[^a-zA-Z0-9 ]//g' | xargs)
    # First word for keyword search
    keyword=$(echo "$clean_name" | awk '{print $1}' | tr '[:upper:]' '[:lower:]')

    matches=""
    status="MISSING"

    # Search in index.json
    if grep -qi "\"$id\"" "$INDEX" 2>/dev/null || grep -qi "$id" "$INDEX" 2>/dev/null; then
        matches="${matches}index.json,"
    fi

    # Search in skills/
    if grep -riq "$id" skills/ 2>/dev/null; then
        # Find specific files
        found=$(grep -ril "$id" skills/ 2>/dev/null | head -3 | tr '\n' ',')
        matches="${matches}${found}"
    elif grep -riq "$keyword" skills/ 2>/dev/null; then
        found=$(grep -ril "$keyword" skills/ 2>/dev/null | head -3 | tr '\n' ',')
        matches="${matches}${found}"
    fi

    # Search in agents/
    if grep -riq "$id" agents/ 2>/dev/null; then
        found=$(grep -ril "$id" agents/ 2>/dev/null | head -3 | tr '\n' ',')
        matches="${matches}${found}"
    elif grep -riq "$keyword" agents/ 2>/dev/null; then
        found=$(grep -ril "$keyword" agents/ 2>/dev/null | head -3 | tr '\n' ',')
        matches="${matches}${found}"
    fi

    # Search in hooks/
    if grep -riq "$id" hooks/ 2>/dev/null; then
        found=$(grep -ril "$id" hooks/ 2>/dev/null | head -3 | tr '\n' ',')
        matches="${matches}${found}"
    elif grep -riq "$keyword" hooks/ 2>/dev/null; then
        found=$(grep -ril "$keyword" hooks/ 2>/dev/null | head -3 | tr '\n' ',')
        matches="${matches}${found}"
    fi

    # Search in rules/
    if grep -riq "$id" rules/ 2>/dev/null; then
        found=$(grep -ril "$id" rules/ 2>/dev/null | head -3 | tr '\n' ',')
        matches="${matches}${found}"
    elif grep -riq "$keyword" rules/ 2>/dev/null; then
        found=$(grep -ril "$keyword" rules/ 2>/dev/null | head -3 | tr '\n' ',')
        matches="${matches}${found}"
    fi

    # Search in workflows/
    if grep -riq "$id" workflows/ 2>/dev/null; then
        found=$(grep -ril "$id" workflows/ 2>/dev/null | head -3 | tr '\n' ',')
        matches="${matches}${found}"
    elif grep -riq "$keyword" workflows/ 2>/dev/null; then
        found=$(grep -ril "$keyword" workflows/ 2>/dev/null | head -3 | tr '\n' ',')
        matches="${matches}${found}"
    fi

    # Search in commands/
    if grep -riq "$id" commands/ 2>/dev/null; then
        found=$(grep -ril "$id" commands/ 2>/dev/null | head -3 | tr '\n' ',')
        matches="${matches}${found}"
    elif grep -riq "$keyword" commands/ 2>/dev/null; then
        found=$(grep -ril "$keyword" commands/ 2>/dev/null | head -3 | tr '\n' ',')
        matches="${matches}${found}"
    fi

    # Search in mcp/
    if grep -riq "$id" mcp/ 2>/dev/null; then
        found=$(grep -ril "$id" mcp/ 2>/dev/null | head -3 | tr '\n' ',')
        matches="${matches}${found}"
    elif grep -riq "$keyword" mcp/ 2>/dev/null; then
        found=$(grep -ril "$keyword" mcp/ 2>/dev/null | head -3 | tr '\n' ',')
        matches="${matches}${found}"
    fi

    # Determine status
    if [ -n "$matches" ]; then
        status="PRESENT"
    fi

    # Also check for exact filename matches in skills/
    if find skills/ -iname "*$id*" 2>/dev/null | grep -q .; then
        found=$(find skills/ -iname "*$id*" 2>/dev/null | head -3 | tr '\n' ',')
        if [ -n "$found" ]; then
            matches="${matches}${found}"
            status="PRESENT"
        fi
    fi

    # Clean trailing comma
    matches=$(echo "$matches" | sed 's/,$//')

    if [ -z "$matches" ]; then
        matches="none"
    fi

    echo "$id | $category | $name | $status | $matches" >> "$OUTPUT"

done < "$INVENTORY"

echo "Done. Lines in output:"
wc -l "$OUTPUT"
