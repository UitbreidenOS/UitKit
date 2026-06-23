# Regulatory Navigator - CLI Usage Guide

Command-line interface for managing compliance requirements, controls, and monitoring.

---

## Installation

```bash
# Make CLI script executable
chmod +x lib/regulatory-navigator-cli.js

# Add to PATH or use directly
node lib/regulatory-navigator-cli.js [command] [options]
```

---

## Commands

### Initialization

#### Initialize Navigator

```bash
node lib/regulatory-navigator-cli.js init --jurisdiction US --verbose
```

Options:
- `--jurisdiction` [string] - Jurisdiction code (US, EU, GLOBAL)
- `--dataDir` [string] - Custom data directory
- `--verbose` - Enable verbose logging

### Regulation Management

#### Add Regulation

```bash
node lib/regulatory-navigator-cli.js add-regulation \
  --name GDPR \
  --domain gdpr \
  --jurisdiction EU \
  --version 2018 \
  --description "General Data Protection Regulation"
```

Options:
- `--name` [string] - Regulation name (required)
- `--domain` [string] - Domain (gdpr, ccpa, hipaa, soc2, iso27001, pci-dss, etc.)
- `--jurisdiction` [string] - Jurisdiction
- `--version` [string] - Version number
- `--description` [string] - Description
- `--source` [string] - Source URL

Output:
```json
{
  "id": "reg-1719047234567",
  "name": "GDPR",
  "domain": "gdpr",
  "jurisdiction": "EU",
  "status": "created"
}
```

#### List Regulations

```bash
node lib/regulatory-navigator-cli.js list-regulations
node lib/regulatory-navigator-cli.js list-regulations --domain gdpr
node lib/regulatory-navigator-cli.js list-regulations --jurisdiction EU
```

Options:
- `--domain` [string] - Filter by domain
- `--jurisdiction` [string] - Filter by jurisdiction
- `--format` [string] - Output format (json, table) [default: table]

Output (table):
```
ID                    Name              Domain        Jurisdiction   Version
─────────────────────────────────────────────────────────────────────────────
reg-1719047234567     GDPR              gdpr          EU            2018
reg-1719047234568     CCPA              ccpa          US            2020
```

#### View Regulation

```bash
node lib/regulatory-navigator-cli.js view-regulation --id reg-1719047234567
```

Options:
- `--id` [string] - Regulation ID (required)
- `--format` [string] - Output format (json, detail) [default: detail]

### Requirement Management

#### Add Requirement

```bash
node lib/regulatory-navigator-cli.js add-requirement \
  --regulation-id reg-123 \
  --clause "Article 32" \
  --text "Security of processing" \
  --priority critical
```

Options:
- `--regulation-id` [string] - Regulation ID (required)
- `--clause` [string] - Clause reference (required)
- `--text` [string] - Requirement text (required)
- `--priority` [string] - Priority (critical, high, medium, low, informational)
- `--applicability` [string] - Applicability scope
- `--notes` [string] - Additional notes

#### List Requirements

```bash
bash
node lib/regulatory-navigator-cli.js list-requirements
node lib/regulatory-navigator-cli.js list-requirements --status non-compliant
node lib/regulatory-navigator-cli.js list-requirements --priority critical
node lib/regulatory-navigator-cli.js list-requirements --regulation-id reg-123
```

Options:
- `--status` [string] - Filter by status (compliant, non-compliant, partial, pending-review, in-progress)
- `--priority` [string] - Filter by priority
- `--regulation-id` [string] - Filter by regulation
- `--format` [string] - Output format (json, table) [default: table]

#### Update Requirement

```bash
node lib/regulatory-navigator-cli.js update-requirement \
  --id req-123 \
  --status compliant \
  --notes "Verified complete"
```

Options:
- `--id` [string] - Requirement ID (required)
- `--status` [string] - New status
- `--notes` [string] - Update notes

### Control Management

#### Add Control

```bash
node lib/regulatory-navigator-cli.js add-control \
  --name "Encryption at Rest" \
  --type preventive \
  --owner security-team \
  --risk-level high \
  --frequency quarterly
```

Options:
- `--name` [string] - Control name (required)
- `--description` [string] - Description
- `--type` [string] - Control type (preventive, detective, corrective, compensating, directive)
- `--owner` [string] - Owner/team
- `--frequency` [string] - Testing frequency (daily, weekly, monthly, quarterly, annually)
- `--risk-level` [string] - Risk level (critical, high, medium, low)
- `--maturity-level` [number] - Maturity level (1-5)

#### List Controls

```bash
node lib/regulatory-navigator-cli.js list-controls
node lib/regulatory-navigator-cli.js list-controls --status non-compliant
node lib/regulatory-navigator-cli.js list-controls --owner security-team
node lib/regulatory-navigator-cli.js list-controls --risk-level critical
```

Options:
- `--status` [string] - Filter by status
- `--owner` [string] - Filter by owner
- `--type` [string] - Filter by type
- `--risk-level` [string] - Filter by risk level
- `--format` [string] - Output format (json, table) [default: table]

#### Test Control

```bash
node lib/regulatory-navigator-cli.js test-control \
  --id ctrl-123 \
  --result pass \
  --tested-by auditor@company.com \
  --notes "All checks passed"
```

Options:
- `--id` [string] - Control ID (required)
- `--result` [string] - Test result (pass, fail) (required)
- `--tested-by` [string] - Tester name
- `--notes` [string] - Test notes
- `--evidence` [string] - Path to evidence file

#### Map Controls to Requirement

```bash
node lib/regulatory-navigator-cli.js map-controls \
  --requirement-id req-123 \
  --control-ids ctrl-1,ctrl-2,ctrl-3
```

Options:
- `--requirement-id` [string] - Requirement ID (required)
- `--control-ids` [string] - Comma-separated control IDs (required)

### Checklist Management

#### Generate Checklist

```bash
node lib/regulatory-navigator-cli.js generate-checklist \
  --regulation-id reg-123 \
  --owner compliance-team \
  --due-date 2024-12-31
```

Options:
- `--regulation-id` [string] - Regulation ID (required)
- `--owner` [string] - Checklist owner
- `--assignee` [string] - Default assignee
- `--due-date` [string] - Due date (YYYY-MM-DD)

Output:
```json
{
  "id": "checklist-123",
  "regulationId": "reg-123",
  "name": "GDPR - Compliance Checklist",
  "totalItems": 5,
  "completedItems": 0,
  "progress": 0,
  "items": [
    {"id": "item-1", "requirementId": "req-1", "text": "...", "completed": false}
  ]
}
```

#### Update Checklist Item

```bash
node lib/regulatory-navigator-cli.js update-checklist-item \
  --checklist-id checklist-123 \
  --item-id item-1 \
  --completed \
  --notes "Verified implementation"
```

Options:
- `--checklist-id` [string] - Checklist ID (required)
- `--item-id` [string] - Item ID (required)
- `--completed` - Mark as complete
- `--notes` [string] - Item notes
- `--attachment` [string] - Path to evidence file

#### List Checklists

```bash
node lib/regulatory-navigator-cli.js list-checklists
node lib/regulatory-navigator-cli.js list-checklists --status in-progress
```

Options:
- `--status` [string] - Filter by status
- `--owner` [string] - Filter by owner
- `--format` [string] - Output format (json, table) [default: table]

### Analysis and Reporting

#### Gap Analysis

```bash
node lib/regulatory-navigator-cli.js gap-analysis --regulation-id reg-123
```

Options:
- `--regulation-id` [string] - Regulation ID (required)
- `--format` [string] - Output format (json, report) [default: report]
- `--output` [string] - Save to file

Output (report format):
```
GAP ANALYSIS REPORT
═══════════════════
Regulation: GDPR
Total Requirements: 25
Compliance Gaps: 5
Gap Percentage: 20%

IDENTIFIED GAPS:
─────────────────
1. Article 5: No controls mapped
   Severity: Critical
   Action: Create and map controls

2. Article 32: 1 mapped control not tested
   Severity: High
   Controls: ctrl-456
```

#### Compliance Status

```bash
node lib/regulatory-navigator-cli.js compliance-status --regulation-id reg-123
```

Options:
- `--regulation-id` [string] - Regulation ID (required)
- `--format` [string] - Output format (json, detail) [default: detail]

Output:
```
COMPLIANCE STATUS
═════════════════
Regulation: GDPR (EU)
Total Requirements: 25

Status Breakdown:
  ✓ Compliant:     15 (60%)
  ✗ Non-Compliant:  5 (20%)
  ⚠ Partial:        3 (12%)
  ⏳ In Progress:    2 (8%)

Overall Compliance: 60%
Status: PARTIAL
```

#### Metrics Report

```bash
node lib/regulatory-navigator-cli.js metrics
```

Options:
- `--format` [string] - Output format (json, table) [default: table]

Output:
```
COMPLIANCE METRICS
══════════════════
Total Regulations:     8
Total Requirements:   142
Total Controls:       85
Overall Compliance:   68%
Compliance Gaps:      24
Risk Score:           45
```

### Reporting

#### Export Compliance Report

```bash
node lib/regulatory-navigator-cli.js export-report \
  --regulation-id reg-123 \
  --format json \
  --output compliance-report.json
```

Options:
- `--regulation-id` [string] - Regulation ID (required)
- `--format` [string] - Export format (json, csv) [default: json]
- `--output` [string] - Output file path

#### Generate Dashboard

```bash
node lib/regulatory-navigator-cli.js generate-dashboard \
  --output compliance-dashboard.html
```

Options:
- `--output` [string] - Output file path (default: compliance-dashboard.html)
- `--refresh` [number] - Auto-refresh interval (seconds)

After generating, open in browser:
```bash
open compliance-dashboard.html  # macOS
xdg-open compliance-dashboard.html  # Linux
start compliance-dashboard.html  # Windows
```

### Audit and History

#### View Audit Trail

```bash
node lib/regulatory-navigator-cli.js audit-trail
node lib/regulatory-navigator-cli.js audit-trail --limit 50
node lib/regulatory-navigator-cli.js audit-trail --action add-requirement
```

Options:
- `--limit` [number] - Number of entries to show [default: 100]
- `--action` [string] - Filter by action type
- `--format` [string] - Output format (json, table) [default: table]

Output:
```
AUDIT TRAIL
═══════════
Timestamp              Action               Details
─────────────────────────────────────────────────────────────
2024-06-22T10:30:00Z   add-requirement      Requirement req-123 added
2024-06-22T10:25:15Z   test-control         Control ctrl-456 passed test
2024-06-22T10:20:45Z   update-checklist     Checklist item marked complete
```

#### Export Audit Trail

```bash
node lib/regulatory-navigator-cli.js export-audit \
  --format csv \
  --output audit-trail.csv
```

Options:
- `--format` [string] - Export format (json, csv) [default: csv]
- `--output` [string] - Output file path

---

## Batch Operations

### Batch Add Requirements

```bash
node lib/regulatory-navigator-cli.js batch-add-requirements \
  --regulation-id reg-123 \
  --input requirements.csv
```

CSV format:
```
clause,text,priority,applicability
Article 5,Data processing lawfully,critical,organizational
Article 7,Consent required,critical,organizational
```

### Batch Test Controls

```bash
node lib/regulatory-navigator-cli.js batch-test-controls \
  --input test-results.json \
  --tested-by auditor@company.com
```

JSON format:
```json
[
  {
    "controlId": "ctrl-1",
    "result": "pass",
    "notes": "Test completed"
  },
  {
    "controlId": "ctrl-2",
    "result": "fail",
    "notes": "Issue found"
  }
]
```

### Batch Map Controls

```bash
node lib/regulatory-navigator-cli.js batch-map-controls \
  --input mappings.json
```

JSON format:
```json
[
  {
    "requirementId": "req-1",
    "controlIds": ["ctrl-1", "ctrl-2"]
  }
]
```

---

## Data Management

### Backup Data

```bash
node lib/regulatory-navigator-cli.js backup --output ./backup-2024-06-22.tar.gz
```

Options:
- `--output` [string] - Backup file path (default: ./regulatory-backup-TIMESTAMP.tar.gz)

### Restore Data

```bash
node lib/regulatory-navigator-cli.js restore --input ./backup-2024-06-22.tar.gz
```

Options:
- `--input` [string] - Backup file path (required)
- `--force` - Overwrite existing data

### Clean Old Data

```bash
node lib/regulatory-navigator-cli.js cleanup \
  --older-than 90 \
  --dry-run
```

Options:
- `--older-than` [number] - Remove completed items older than N days
- `--dry-run` - Show what would be deleted without deleting

---

## Scripting

### Generate Full Compliance Report

```bash
#!/bin/bash

REGULATION_ID="reg-123"
DATE=$(date +%Y-%m-%d)

# Generate analysis
node lib/regulatory-navigator-cli.js gap-analysis \
  --regulation-id $REGULATION_ID \
  --output gap-analysis-$DATE.txt

# Generate compliance status
node lib/regulatory-navigator-cli.js compliance-status \
  --regulation-id $REGULATION_ID \
  --output compliance-status-$DATE.txt

# Export full report
node lib/regulatory-navigator-cli.js export-report \
  --regulation-id $REGULATION_ID \
  --output compliance-report-$DATE.json

# Generate dashboard
node lib/regulatory-navigator-cli.js generate-dashboard \
  --output compliance-dashboard-$DATE.html

echo "Reports generated for $DATE"
```

### Continuous Compliance Monitoring

```bash
#!/bin/bash

# Run daily compliance check
while true; do
  node lib/regulatory-navigator-cli.js metrics | \
    awk '/Overall Compliance/ {print $3}' | \
    while read compliance_rate; do
      if (( $(echo "$compliance_rate < 70" | bc -l) )); then
        echo "WARNING: Compliance rate dropped to $compliance_rate%" | \
          mail -s "Compliance Alert" compliance@company.com
      fi
    done
  
  sleep 86400  # Run daily
done
```

---

## Examples

### Example 1: Complete GDPR Setup via CLI

```bash
# Initialize
node lib/regulatory-navigator-cli.js init --jurisdiction EU

# Add GDPR regulation
GDPR_ID=$(node lib/regulatory-navigator-cli.js add-regulation \
  --name "GDPR" \
  --domain gdpr \
  --jurisdiction EU | jq -r '.id')

# Add key requirements
node lib/regulatory-navigator-cli.js add-requirement \
  --regulation-id $GDPR_ID \
  --clause "Article 5" \
  --text "Data processing lawfully" \
  --priority critical

# Generate checklist
node lib/regulatory-navigator-cli.js generate-checklist \
  --regulation-id $GDPR_ID \
  --owner compliance-team

# Get status
node lib/regulatory-navigator-cli.js compliance-status \
  --regulation-id $GDPR_ID
```

### Example 2: Test All Controls and Generate Report

```bash
# Get all non-compliant controls
CONTROLS=$(node lib/regulatory-navigator-cli.js list-controls \
  --status non-compliant \
  --format json | jq -r '.[].id')

# Test each
for CONTROL_ID in $CONTROLS; do
  node lib/regulatory-navigator-cli.js test-control \
    --id $CONTROL_ID \
    --result pass \
    --tested-by auditor@company.com
done

# Generate report
node lib/regulatory-navigator-cli.js export-report \
  --regulation-id reg-123 \
  --output final-report.json

# Show metrics
node lib/regulatory-navigator-cli.js metrics
```

### Example 3: Identify and Fix Gaps

```bash
# Analyze gaps
node lib/regulatory-navigator-cli.js gap-analysis \
  --regulation-id reg-123 \
  --output gaps.json

# For each gap, create control mapping
node lib/regulatory-navigator-cli.js batch-map-controls \
  --input remediation-plan.json

# Verify improvement
node lib/regulatory-navigator-cli.js gap-analysis \
  --regulation-id reg-123
```

---

## Exit Codes

- `0` - Success
- `1` - General error
- `2` - Invalid arguments
- `3` - Resource not found
- `4` - Validation error
- `5` - File operation error

---

## Configuration File

Store common options in `.claude/regulatory.config.json`:

```json
{
  "jurisdiction": "US",
  "defaultOwner": "compliance-team",
  "defaultDataDir": ".claude/regulatory",
  "outputFormat": "table",
  "verbose": false
}
```

Usage:
```bash
node lib/regulatory-navigator-cli.js --config-file .claude/regulatory.config.json list-regulations
```

---

## Troubleshooting

### Command Not Found

Ensure Node.js is installed:
```bash
node --version  # v14+ required
```

### Data Not Persisting

Check directory permissions:
```bash
ls -la .claude/regulatory/
chmod 755 .claude/regulatory
```

### Report Generation Fails

Verify regulation has requirements:
```bash
node lib/regulatory-navigator-cli.js view-regulation --id reg-123 | grep requirements
```
