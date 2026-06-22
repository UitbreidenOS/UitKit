# SVG Map Inspector — Team Collaboration Guide

Team workflows for sharing, hosting, and managing SVG map data across organizations.

---

## Shared Map Generation

### Multi-Source Ingestion

**Input Pipeline**
- Accept GeoJSON, KML, OSM Overpass API responses
- Auto-convert to normalized SVG with consistent styling
- Deduplicate features by geometry + metadata hash
- Track provenance (source system, timestamp, contributor)

**Collaborative Authoring**
- Lock-free merge strategy: last-write-wins on property updates
- Geometry conflicts: preserve both versions, flag for manual resolution
- Metadata conflicts: field-level resolution (prefer latest timestamp)
- Auto-commit with contributor attribution to Git

**Version Control Integration**
```bash
svg-inspector map merge \
  --base maps/regional-network.svg \
  --incoming maps/regional-network-v2.svg \
  --contributor "jane@company.com" \
  --message "Add new distribution centers Q2 2026"
```

---

## Dashboard Hosting

### Self-Hosted Deployment

**Static Site Generation**
- Export SVG maps + metadata as JSON API
- Generate interactive HTML5 dashboard from templates
- Serve from any static host (S3, GitHub Pages, Vercel)
- Zero runtime dependencies — pure HTML + client-side JS

**Dashboard Structure**
```
dashboard/
├── index.html          # Entry point with map viewer + controls
├── api/
│   ├── maps.json       # Map inventory + metadata
│   ├── layers/
│   │   ├── network.json    # Feature collections
│   │   ├── regions.json
│   │   └── annotations.json
│   └── changelog.json  # Full edit history
├── maps/
│   ├── regional-network.svg
│   ├── supply-chain.svg
│   └── regulatory-zones.svg
└── styles/
    ├── base.css
    └── themes/
        ├── light.css
        ├── dark.css
        └── colorblind-safe.css
```

**CDN Caching**
- SVG files: cache for 7 days (bust on new version tag)
- JSON metadata: cache for 1 hour (refresh hourly)
- HTML dashboard: cache for 15 minutes or cache-bust via query param
- API responses include `ETag` + `Last-Modified` for conditional requests

**Performance Targets**
- Dashboard load: < 2 seconds (first paint)
- Interactive: < 5 seconds (all maps + UI ready)
- SVG pan/zoom: 60 FPS on Chrome/Firefox/Safari (2024+)

---

## Access Control

### Role-Based Permissions

| Role | Capabilities |
|---|---|
| **Viewer** | See published maps on dashboard; read-only access to JSON metadata |
| **Contributor** | Create/edit maps; propose changes; submit to review queue |
| **Reviewer** | Approve/reject map submissions; resolve geometry conflicts; publish versions |
| **Admin** | Manage team members; configure hosting; set collaboration rules; audit logs |
| **Operator** | Deploy to production; monitor dashboard uptime; manage backups |

### Map-Level Sharing

**Private Maps** (default)
- Restricted to specified team members
- Not listed in public dashboard API
- Shareable via signed URLs (24h expiry, read-only)

**Internal Maps**
- Visible to all authenticated team members
- Editable by contributors + reviewers only
- Appears in team dashboard inventory

**Public Maps**
- Listed in public dashboard + search
- Editable by contributors if authenticated
- Anonymous read access (no account required)

### Permission Enforcement

**Git-Based Access**
```bash
# .git/config
[access "maps/private/*"]
  allow = @admin,@team-leads
  
[access "maps/internal/*"]
  allow = @authenticated
  
[access "maps/public/*"]
  allow = @world
```

**API Token Scopes**
```
maps:read           # View map metadata
maps:write          # Edit maps (must own or be reviewer)
maps:review         # Approve/reject submissions
maps:admin          # Manage access + team
dashboard:admin     # Configure hosting
```

---

## Version History

### Immutable Audit Trail

**Commit Metadata**
```json
{
  "commit_hash": "a1b2c3d4e5f6",
  "timestamp": "2026-06-22T14:30:00Z",
  "contributor": {
    "name": "Jane Doe",
    "email": "jane@company.com",
    "team": "Supply Chain Analytics"
  },
  "message": "Add 3 new distribution centers in APAC",
  "changes": {
    "added_features": 3,
    "modified_features": 0,
    "deleted_features": 0,
    "geometry_changes": true,
    "property_changes": ["capacity", "operational_status"]
  },
  "review": {
    "reviewer": "john@company.com",
    "approved_at": "2026-06-22T14:45:00Z",
    "comments": "Verified coordinates against latest supplier data"
  }
}
```

**Rollback Capability**
```bash
# Revert to previous version
svg-inspector map rollback \
  --map supply-chain.svg \
  --to-commit a1b2c3d4e5f6 \
  --reason "Coordinates were incorrect in latest version"

# View diff between versions
svg-inspector diff \
  --map supply-chain.svg \
  --from a1b2c3d4e5f6 \
  --to b2c3d4e5f6a7 \
  --format html > changes.html
```

**Historical Queries**
```bash
# List all changes by contributor in date range
svg-inspector history \
  --map supply-chain.svg \
  --from "2026-01-01" \
  --to "2026-06-22" \
  --contributor "jane@company.com" \
  --format csv > audit-report.csv

# Export full lineage of a feature
svg-inspector lineage \
  --map supply-chain.svg \
  --feature-id "center-045" \
  --output lineage.json
```

---

## Collaboration Workflows

### Proposal & Review Cycle

**1. Create Proposal Branch**
```bash
git checkout -b maps/supply-chain/add-asia-hubs
svg-inspector map edit maps/supply-chain.svg --interactive
# User adds 3 new features, updates 5 properties
git add maps/supply-chain.svg
git commit -m "Add 3 new distribution hubs in Asia; update capacity data"
```

**2. Submit for Review**
```bash
svg-inspector review submit \
  --map maps/supply-chain.svg \
  --reviewers john@company.com,sarah@company.com \
  --priority high \
  --context "Q3 expansion into Singapore, Bangkok, Ho Chi Minh City"
```

**3. Reviewer Inspection**
```bash
# View changes in dashboard
# Dashboard shows side-by-side SVG diff with feature list
# Reviewer can:
#   - Approve (auto-merges to main)
#   - Request changes (blocks merge, adds comments)
#   - Reject (closes PR, optional explanation)

# CLI alternative
svg-inspector review show a1b2c3d4e5f6
svg-inspector review approve a1b2c3d4e5f6 --comment "Verified against Q3 plan"
```

**4. Auto-Merge to Main**
- Approval triggers merge to main branch
- Dashboard refreshes within 5 minutes
- Notification sent to contributors + team leads
- Previous version archived for audit trail

**5. Conflict Resolution**

If two contributors edit the same map simultaneously:

```bash
# Detect conflict
svg-inspector merge --base main --branch feature-1 --branch feature-2
# Output: Conflict in supply-chain.svg at feature IDs [45, 67, 89]

# Show conflict details
svg-inspector merge --show-conflicts
# Lists each conflicting feature with both versions

# Resolve manually or via CLI
svg-inspector merge --resolve-by version:latest \
  --feature-ids 45,67,89

# Or interactive mode
svg-inspector merge --interactive
# UI shows each conflict, user selects which version to keep
```

### Team Standup Integration

**Daily Digest**
```bash
svg-inspector digest --period daily --format slack > digest.json
# Sends to #maps-updates:
# "2 new maps approved, 3 pending review, 1 conflict in supply-chain.svg"

svg-inspector digest --period weekly --format email > digest.html
# Weekly report: change volume, top contributors, pending reviews
```

---

## Export Formats for Reporting

### Standard Report Exports

**Executive Summary (PDF)**
```bash
svg-inspector export \
  --map supply-chain.svg \
  --format pdf \
  --template executive-summary \
  --date-range "2026-Q2" \
  --include-stats \
  --output report-q2-2026.pdf
```

Output includes:
- Map thumbnail + metadata
- Summary statistics (feature counts, coverage, change volume)
- Key changes by category
- Contributor attribution
- Approval chain
- Generated timestamp + version hash

**Data Export (GeoJSON)**
```bash
svg-inspector export \
  --map supply-chain.svg \
  --format geojson \
  --include-metadata \
  --include-history \
  --output supply-chain-full.geojson

# Also exports:
# - Feature properties (capacity, status, contact, etc.)
# - Coordinate system + projection
# - Revision metadata (who changed what, when)
# - Review approvals + comments
```

**Audit Report (CSV/JSON)**
```bash
svg-inspector export \
  --map supply-chain.svg \
  --format audit \
  --from "2026-01-01" \
  --to "2026-06-22" \
  --groupby contributor,month \
  --output audit-2026-h1.csv

# Columns:
# - Contributor
# - Team
# - Month
# - Features Added
# - Features Modified
# - Features Deleted
# - Geometry Changes
# - Review Status
# - Approval Date
```

**Change Log (Markdown)**
```bash
svg-inspector export \
  --map supply-chain.svg \
  --format markdown \
  --from "2026-06-01" \
  --to "2026-06-22" \
  --group-by date \
  --output CHANGELOG.md

# Output:
# ## 2026-06-22
# ### Added by Jane Doe (Approved by John Smith)
# - New distribution center: Singapore (lat, long, capacity)
# ### Modified by Bob Lee (Approved by Sarah Chen)
# - Updated Bangkok hub capacity: 500 → 750 units
```

**Dashboard Snapshot (HTML)**
```bash
svg-inspector export \
  --map supply-chain.svg \
  --format html \
  --include-all-layers \
  --theme light \
  --output snapshot-2026-06-22.html

# Self-contained HTML file with embedded SVG, CSS, JS
# Can be shared via email, archived, or printed
```

**Custom Template Exports**

Define reusable templates:

```yaml
# exports/quarterly-review.yaml
template_name: "Quarterly Review"
maps:
  - supply-chain.svg
  - regulatory-zones.svg
  - risk-heatmap.svg
sections:
  - title: "Q2 Summary"
    type: stats
    metrics: [features_added, features_modified, review_time_avg]
  - title: "Changes by Region"
    type: grouped_changelog
    groupby: region
  - title: "Contributor Leaderboard"
    type: leaderboard
    groupby: contributor
  - title: "Maps"
    type: maps
    layout: grid
    include_layers: all
output:
  format: pdf
  filename_template: "quarterly-review-{quarter}-{year}.pdf"
```

```bash
svg-inspector export --template exports/quarterly-review.yaml \
  --quarter Q2 --year 2026 \
  --output report.pdf
```

---

## Backup & Disaster Recovery

### Automated Backups

**Daily Snapshots**
- Full clone of Git repo + all maps
- Stored in secondary location (different region/provider)
- Kept for 30 days, then rolled to archive storage
- Verified via checksum validation daily

**RTO/RPO Targets**
- Recovery Time Objective: 4 hours (full restore from backup)
- Recovery Point Objective: 24 hours (max data loss)

**Restore Procedure**
```bash
svg-inspector backup restore \
  --from-date "2026-06-22" \
  --to-directory maps-recovered/ \
  --verify-checksums
```

---

## Monitoring & Alerts

**Dashboard Health**
- Uptime monitoring (99.5% target)
- Response time tracking (p95: < 2s)
- API error rate alerts (> 1% triggers notification)

**Map Quality**
- Geometry validation on each commit (detects malformed SVG)
- Coordinate bounds checking (alerts on out-of-range values)
- Feature property validation (missing required fields)

**Collaboration Metrics**
- Review turnaround time (target: < 24h)
- Merge conflict frequency (tracked by map + date range)
- Contributor activity (maps, changes per week)

---

## Best Practices

1. **Semantic Commits** — One logical change per commit; include feature ID + summary
2. **Descriptive PRs** — Explain business context, link to tickets, note any risks
3. **Regular Reviews** — Don't let proposals sit > 48h; assign to specific reviewer
4. **Leverage History** — Always review full feature lineage before major changes
5. **Validate Coordinates** — Use third-party tool (Google Maps, OSM) to spot-check
6. **Team Sync** — Weekly standup on pending reviews + high-impact changes
7. **Archive Versions** — Tag release versions in Git; export & store for audit trail
