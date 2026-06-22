# Feature Audit CI Workflow

## Overview

The **Feature Audit** GitHub Actions workflow (`feature-audit.yml`) automatically validates the integrity of the Claudient feature catalog on every commit and pull request. It ensures that features are properly documented, all file references are valid, and the system maintains internal consistency.

## Workflow Jobs

### 1. Feature Presence Validation
**Validates:** `feature-presence.txt` structure and completeness

- Checks file exists and is not empty
- Validates pipe-separated format (minimum 4 fields)
- Ensures status values are valid (`PRESENT`, `MISSING`, `DEPRECATED`)
- Compares line counts between presence and inventory files
- Generates feature count consistency reports

### 2. JSON & Schema Validation
**Validates:** All JSON files and schema definitions

- Parses all `.json` files in the repository (excluding `node_modules`, `.git`, `site/`, `.kimchi/`)
- Validates `enterprise/audit-schema.json` as valid JSON Schema
- Reports malformed JSON files with line numbers
- Ensures schema files have required properties

### 3. Markdown Structure Check
**Validates:** File references and markdown format

- Validates skill/agent/hook frontmatter using existing validators
- Checks all file paths in `feature-presence.txt` exist
- Verifies markdown link integrity
- Reports broken file references with line numbers

### 4. Feature Integration Tests
**Validates:** Feature system integration

- Runs CLI smoke tests (`npm test`)
- Executes feature-specific validation tests
- Validates workspace stacks against features
- Checks that skills, agents, and hooks are properly registered

### 5. Feature Completeness Analysis
**Validates:** Feature coverage and categorization

- Analyzes feature counts by category
- Tracks `PRESENT`, `MISSING`, and `DEPRECATED` statuses
- Generates categorized statistics
- Warns about missing or deprecated features

### 6. Generate Audit Report
**Output:** Audit report and PR comments

- Creates `.github/feature-audit-report.md` with summary
- Posts results as PR comment for visibility
- Includes timestamp, commit SHA, and branch info
- Aggregates all validation results

## Trigger Events

The workflow runs automatically on:

- **Push** to `main` or `master` branches when these files change:
  - `feature-*.txt`
  - Files in `skills/`, `agents/`, `hooks/`, `workflows/`
  - Validation scripts in `scripts/validate-*.js`
  - Test files in `test/`

- **Pull Request** to `main` or `master` with the same path filters

## Local Testing

### Run Feature Validation
```bash
node scripts/validate-features.js
```

Output includes:
- Feature counts by status
- Category breakdown
- File reference validation
- Consistency checks

### Run Feature Integration Tests
```bash
npm test
node test/features/validate-features.js
```

Tests:
- Feature presence structure (≥50 features required)
- Skills registration
- Agents registration
- Hooks registration
- Workflows structure
- JSON validity
- Markdown format

### Full CI Simulation
```bash
npm run validate
npm run validate:catalog
npm run validate:stacks
npm test
```

## Feature File Format

### feature-presence.txt
Pipe-separated format with 5 columns:

```
ID | CATEGORY | NAME | STATUS | FILE_REFERENCES
1  | cost     | .claudeignore Templates | PRESENT | ./claudeignore-templates/node.claudeignore, ./claudeignore-templates/go.claudeignore
```

**Status Values:**
- `PRESENT` - Feature fully implemented and available
- `MISSING` - Feature documented but not yet implemented
- `DEPRECATED` - Feature marked for removal

**Fields:**
1. **ID** - Unique feature identifier (integer)
2. **CATEGORY** - Feature classification (cost, resilience, enterprise, etc.)
3. **NAME** - Human-readable feature name
4. **STATUS** - Implementation status
5. **FILE_REFERENCES** - Comma-separated paths to related files

### feature-inventory.txt
Simple status listing (auto-generated from presence file):

```
ID | CATEGORY | NAME | STATUS
1  | cost     | .claudeignore Templates | PRESENT
```

## CI Failure Handling

### When Validation Fails

1. **Check PR comment** - Audit results posted to PR
2. **Review error messages** in workflow logs
3. **Common issues:**
   - `Missing file references` - Check file paths are relative to repo root
   - `Invalid status` - Use only `PRESENT`, `MISSING`, `DEPRECATED`
   - `Line count mismatch` - Sync presence.txt and inventory.txt
   - `JSON parse errors` - Validate JSON syntax

### Fix and Rerun

```bash
# Fix issues locally
node scripts/validate-features.js

# Commit corrections
git add feature-presence.txt feature-inventory.txt
git commit -m "fix: correct feature file references"
git push
```

Workflow runs automatically on push.

## Schema Reference

### audit-schema.json

If present, must be valid JSON Schema with:
- `properties` object (defines schema fields)
- `type` property (typically "object")
- `required` array (list required properties)

Example:
```json
{
  "type": "object",
  "properties": {
    "featureId": { "type": "string" },
    "status": { "enum": ["PRESENT", "MISSING", "DEPRECATED"] }
  },
  "required": ["featureId", "status"]
}
```

## Permissions

Workflow requires:
- `contents: read` - Read repository files
- `pull-requests: write` - Post PR comments

## Artifacts

The workflow generates:
- **`.github/feature-audit-report.md`** - Timestamped audit summary
- **PR Comment** - Results posted to pull requests
- **Workflow Logs** - Full validation details in Actions tab

## Integration with CI Pipeline

This workflow complements existing validation:
- `validate.yml` - Markdown lint, link checks, freshness
- `claudient-ci.yml` - Core codebase validation, CLI tests

Together they provide comprehensive quality assurance for:
- Feature metadata accuracy
- File system integrity
- JSON/schema correctness
- Integration consistency
- System completeness

## Maintenance

### Adding New Features

1. Add entry to `feature-presence.txt`
2. Add entry to `feature-inventory.txt` (or regenerate)
3. Update file references to point to feature implementations
4. Push - workflow validates automatically

### Updating Feature Status

```
# Change status in feature-presence.txt
61 | ux | Offline GUI Desktop Dashboard | PRESENT → DEPRECATED

# Commit
git commit -m "feat: mark dashboard-launcher as deprecated"
git push
```

Workflow validates status change and reports deprecation.

### Regenerating Files

To regenerate presence/inventory files from source:

```bash
# If a regeneration script exists
node scripts/regenerate-features.js

# Or manually verify against CLI listing
node scripts/cli.js list > feature-audit.log
```

## Related Commands

```bash
# List all features
npm run list

# Validate frontmatter
npm run validate:frontmatter

# Validate manifests
npm run validate:manifests

# Check catalog
npm run validate:catalog

# Stack validation
npm run validate:stacks

# Run all validations
npm run validate
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `feature-presence.txt not found` | Create file with proper format |
| `Invalid status` | Use only `PRESENT`, `MISSING`, `DEPRECATED` |
| `Missing file references` | Update paths to be relative to repo root |
| `Line count mismatch` | Sync inventory with presence file |
| `JSON parse error` | Validate JSON syntax with `node -e "JSON.parse(...)"` |
| `Tests timeout` | Check for infinite loops in feature code |

## See Also

- [CLAUDE.md](../../CLAUDE.md) - Project conventions
- [Feature Presence Format](#feature-file-format)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
