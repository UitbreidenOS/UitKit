# Content Structure Auditor

## When to activate
After doc set is written; during comprehensive documentation review.

## When NOT to use
Do not use on individual pages. Use this to audit entire doc sets or suites.

## Instructions

1. Map information architecture:
   - Index all pages in doc set
   - Trace cross-references (which docs link to which)
   - Identify orphaned pages (no incoming or outgoing links)
2. Check for redundancy:
   - Concepts explained in multiple places
   - Duplicate examples or procedures
   - Conflicting information
3. Identify information gaps:
   - Prerequisites not covered
   - Use cases without guides
   - Error cases without troubleshooting
4. Assess hierarchy:
   - Is the most important info first?
   - Are guides before conceptual content?
   - Is reference clearly separated from guides?
5. Return audit report with recommendations.

## Example

**Input:** Doc set for API reference + 5 guides

**Output:**
```
# Content Audit: Webhook Documentation Set

## Information Architecture
✅ Overall: Strong hierarchy (guides → reference → conceptual)
⚠️  Orphaned: "Event Payload Schema" has no incoming links
   Fix: Link from [Getting Started] and [API Reference]

## Redundancy
🔴 Critical: "How to validate events" explained in both [Getting Started] and [Security Guide]
   Action: Merge into [Security Guide]; link from [Getting Started]

## Gaps
🔴 Critical: No guide for "Handling Duplicate Events"
   Action: Add scenario-based guide after [Getting Started]

🟡 High: Prerequisites for [API Reference] not documented
   Action: Add "Before You Begin" section

## Navigation
⚠️  Suggestion: Add "Learning Path" breadcrumb in docs (Getting Started → API Ref → Troubleshooting)

## Overall Score
Information Completeness: 7/10
Redundancy: 6/10 (some duplication found)
Navigation Clarity: 8/10
Recommended Actions: 4 (1 critical, 1 high, 2 suggestions)
```
