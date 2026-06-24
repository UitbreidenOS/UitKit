---
name: "freshness-auditor"
description: "Run freshness audits and generate prioritized refresh lists for content maintenance"
---

# Freshness Auditor

## When to activate

- **Before certification renewal** — audit Claudient content to ensure all files are current and defensible
- **Before releasing a new version or major update** — verify documentation accuracy
- **Quarterly maintenance cycle** — identify stale content that needs refreshing (every 3 months)
- **After a major Claude model release** — flag potentially outdated guidance in skills and workflows
- **On-demand content audit** — when you want to assess overall content health without waiting for the quarterly sprint

## When NOT to use

- For real-time freshness monitoring (use CI checks with `check-freshness.js` instead)
- To validate specific external links (use a dedicated link checker tool)
- To rewrite content (use `/workflows/freshness-refresh` instead, which spawns review agents)
- To enforce style consistency (use linting rules and `code-review` skill)

## Instructions

### Step 1: Run the freshness audit

Execute the freshness check script:

```bash
node scripts/check-freshness.js
```

This scans all `skills/` and `agents/` directories for files with an `updated:` date in YAML frontmatter. It flags files older than 6 months as stale and files missing a date entirely.

Output includes:
- Count of fresh, stale, and undated files
- List of stale files with their last-updated date
- List of files missing an `updated:` field

### Step 2: Generate the detailed report

For a more detailed breakdown organized by category and priority:

```bash
node scripts/generate-refresh-report.js > FRESHNESS_REPORT.md
```

This produces a Markdown report with:
- Fresh vs stale counts by category (skills, agents, guides, workflows)
- Files sorted by age (oldest first)
- Estimated time to refresh each file
- Tier 1/2/3 categorization for prioritization

### Step 3: Categorize by impact

Read the freshness report and sort files into tiers:

**Tier 1 (Critical — refresh immediately):**
- Core debugging and testing skills
- Frequently-referenced guides (getting started, conceptual foundations)
- Essential agent definitions used in workflows
- Any file older than 12 months

These files are on critical paths; staleness could mislead users or break workflows.

**Tier 2 (Important — refresh within 2 weeks):**
- Domain-specific skills (frontend, backend, DevOps, etc.)
- Stack-specific guides and workflows
- Secondary agent definitions
- Files 6–12 months old in active domains

These are referenced regularly but less critical than Tier 1.

**Tier 3 (Optional — review, may keep as-is):**
- Archived or deprecated skills
- Rarely-used agent definitions
- Historical examples and case studies
- Evergreen conceptual guides unlikely to change

These may not need updating if content is still accurate.

### Step 4: Assess content accuracy (manual review)

For each Tier 1 file, do a quick accuracy check:

```markdown
File: [path]
Last updated: [date]
Age: [N months]

Quick accuracy check:
- [ ] All command examples still work in current Claude Code
- [ ] Tool names and features referenced still exist
- [ ] No references to deprecated features or old model versions
- [ ] External links (if any) are not 404
- [ ] Code syntax is current (not using obsolete APIs)

Status: [Fresh | Minor Updates Needed | Major Rewrite Needed]
```

If >30% of a file's content is inaccurate or outdated, mark it for a major refresh in the next quarterly cycle.

### Step 5: Produce the prioritized refresh list

Create a text file with your findings:

```markdown
# Freshness Audit Results — [DATE]

## Summary
- Total files scanned: X
- Fresh (< 6 months): X
- Stale (≥ 6 months): X
- Missing dates: X

## Tier 1 (Refresh immediately)
- [File path] — last updated [date], [N] months old
- ...

## Tier 2 (Refresh within 2 weeks)
- [File path] — last updated [date], [N] months old
- ...

## Tier 3 (Optional review)
- [File path] — last updated [date], [N] months old
- ...

## Files needing major rewrite
- [File path] — [reason: outdated examples, deprecated features, etc.]

## Next steps
1. Assign Tier 1 files to review agents
2. Schedule Tier 2 review for sprint backlog
3. Archive or deprecate Tier 3 files if no longer relevant
4. Run the full /workflows/freshness-refresh to coordinate updates
```

### Step 6: Decide on next action

Based on the audit results:

- **If <10% stale:** Content is healthy. Refresh normally on the quarterly cycle.
- **If 10–30% stale:** Schedule a focused refresh sprint for Tier 1 and 2 files within the next 2 weeks.
- **If >30% stale:** Critical health issue. Run `/workflows/freshness-refresh` immediately to get all agents updating content in parallel.
- **If any files are >12 months old:** Escalate for immediate review.

---

## Example

### Scenario: Pre-certification audit

Before certifying Claudient as a production tool, you want to ensure all content is current.

### Execution:

```bash
# Step 1: Run freshness check
node scripts/check-freshness.js

# Output:
# Freshness check: 847 files scanned (stale threshold: 6 months)
#   Fresh:  621
#   Stale:  156
#   No date: 70
```

156 stale files and 70 missing dates — time to remediate before certification.

```bash
# Step 2: Generate detailed report
node scripts/generate-refresh-report.js > FRESHNESS_REPORT.md

# Review the report and categorize:
# Tier 1 (Core skills): 32 files
# Tier 2 (Domain skills, workflows): 89 files
# Tier 3 (Archived, examples): 35 files
```

### Decision:

Based on the audit, the team decides:
- Tier 1 files (32) must be refreshed before certification sign-off — assign to 4 agents, 2 hours
- Tier 2 files (89) can be batched into 2-week sprints — 3 agents working in rotation
- Tier 3 files (35) are archived/deprecated — mark with "archived" tag in frontmatter, no refresh needed

### Next step:

Spawn a targeted refresh workflow for Tier 1 files only:

```bash
# (Uses the freshness-refresh workflow with --tier 1 flag)
```

This ensures certification readiness without blocking on the full backlog.

---

## Related content

- `/guides/content-freshness` — SLA, staleness thresholds, and what to check per content type
- `/workflows/freshness-refresh` — full quarterly maintenance sprint (uses this audit as input)
- `/scripts/check-freshness.js` — core freshness detection CLI
- `/scripts/generate-refresh-report.js` — generates the detailed freshness report

---
