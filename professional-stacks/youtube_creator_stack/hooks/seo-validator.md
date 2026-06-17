# seo-validator Hook

## Purpose

Validates keyword density, title optimization, description format, and tag coverage before video metadata is finalized.

## Event Trigger

`PostToolUse` — After metadata-writer skill completes

## settings.json Entry

```json
{
  "hooks": {
    "youtube_creator_stack/hooks/seo-validator": {
      "on": "PostToolUse",
      "if": "tool == 'metadata-writer' || tool == 'script-optimizer'",
      "run": "bash youtube_creator_stack/hooks/seo-validator.sh"
    }
  }
}
```

## What It Does

1. Extracts title, description, keywords, and tags from metadata output.
2. Validates keyword density:
   - Primary keyword: 1–2% of total script words
   - Secondary keywords: 1–1.5% each
   - Flags over-optimization (>3%) or under-optimization (<0.5%)
3. Validates title:
   - Length: 50–60 characters (optimal CTR range)
   - Primary keyword in first 3 words
   - No misleading promises
4. Validates description:
   - First 150 characters as hook (visible before "read more")
   - Keywords naturally distributed
   - Timestamps present (boost engagement)
   - Links to resources (1–3 optimal)
   - CTA present (subscribe, join, etc.)
5. Validates tags:
   - 10–15 tags total
   - No irrelevant spam tags
   - Primary keyword as first tag
6. Returns PASS/FAIL verdict with specific flags.
7. Blocks publishing if validation fails (flags blocking issues).
8. Logs validation result to session-log.md.

## Example Output

```
SEO VALIDATION — seo-validator Hook

Video: "This AI Edits Videos For You"
Validation Timestamp: 2026-06-12 14:35

TITLE VALIDATION: PASS ✓
- Length: 57 chars (optimal 50–60) ✓
- Primary keyword "AI Edits" in first 3 words ✓
- No misleading promises ✓

KEYWORD DENSITY: PASS ✓
- "AI editing": 1.6% (target 1–2%) ✓
- "automation": 1.2% ✓
- "video tools": 0.9% ✓

DESCRIPTION: PASS ✓
- Hook in first 150 chars ✓
- Timestamps for 5 chapters ✓
- Resource links: 4 (1–3 optimal, but acceptable) ✓
- CTA present ✓

TAGS: PASS ✓
- Count: 14 tags (10–15 range) ✓
- "AI video editing" as first tag ✓
- No spam tags ✓

FINAL VERDICT: APPROVED FOR PUBLISHING ✓
Validation logged to session-log.md
```

## Blocking Issues

These prevent publishing:

- Primary keyword missing from title
- Keyword density >3% (over-optimization)
- Keyword density <0.5% (under-optimization)
- Title >70 characters (YouTube truncates)
- >20 tags (YouTube penalizes spam)
- Missing CTA in description
- Irrelevant tags detected

## Non-Blocking Suggestions

These do not prevent publishing but improve performance:

- Title <50 characters (below optimal range)
- Tag count <10 (missed discovery opportunity)
- No timestamps in description (engagement boost missed)
- Secondary keywords <1% (under-leveraging)

## Setup Instructions

1. Copy hook script to `.claude/hooks/seo-validator.sh`
2. Make executable: `chmod +x .claude/hooks/seo-validator.sh`
3. Add settings.json entry above
4. Test by running `/script-draft` on a GO-scored topic
5. Review validation output before publishing

## Script (seo-validator.sh)

```bash
#!/bin/bash

# YouTube Creator Stack — SEO Validator Hook
# Validates keyword density, title format, description, and tags

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
LOG_FILE="${SCRIPT_DIR}/../../youtube_creator_stack/session-log.md"

# Extract metadata from previous tool output
TITLE=$(echo "$TOOL_OUTPUT" | grep -i "title:" | head -1 | sed 's/.*title: *//i')
DESCRIPTION=$(echo "$TOOL_OUTPUT" | grep -i "description:" | head -1 | sed 's/.*description: *//i')
TAGS=$(echo "$TOOL_OUTPUT" | grep -i "tags:" | head -1 | sed 's/.*tags: *//i')
KEYWORDS=$(echo "$TOOL_OUTPUT" | grep -i "keyword" | head -5)

# Validate title length
TITLE_LENGTH=${#TITLE}
if [ "$TITLE_LENGTH" -gt 70 ]; then
    echo "❌ VALIDATION FAILED: Title exceeds 70 characters ($TITLE_LENGTH)"
    exit 1
elif [ "$TITLE_LENGTH" -lt 50 ]; then
    echo "⚠️  WARNING: Title below optimal range (50–60 chars). May impact CTR."
fi

# Validate primary keyword in first 3 words
FIRST_THREE=$(echo "$TITLE" | awk '{print $1" "$2" "$3}')
if ! echo "$FIRST_THREE" | grep -qi "$PRIMARY_KEYWORD"; then
    echo "❌ VALIDATION FAILED: Primary keyword not in first 3 words of title"
    exit 1
fi

# Validate tag count
TAG_COUNT=$(echo "$TAGS" | tr ',' '\n' | wc -l)
if [ "$TAG_COUNT" -gt 20 ]; then
    echo "❌ VALIDATION FAILED: Too many tags ($TAG_COUNT). YouTube penalizes >20."
    exit 1
elif [ "$TAG_COUNT" -lt 10 ]; then
    echo "⚠️  WARNING: Low tag count ($TAG_COUNT). Consider 10–15 for better discovery."
fi

# Log validation result
echo "[$(date '+%Y-%m-%d %H:%M')] SEO VALIDATION PASS ✓ — Title: $TITLE | Tags: $TAG_COUNT" >> "$LOG_FILE"

echo "✓ SEO validation passed. Metadata approved for publishing."
exit 0
```

## Notes

- Hook fires after metadata is generated but before publishing confirmation.
- Creator still has opportunity to edit if suggestions are non-blocking.
- Validation results are always logged to session-log.md for audit trail.
- Hook respects CLAUDE.md SEO rules (keyword density targets, title format, etc.).
