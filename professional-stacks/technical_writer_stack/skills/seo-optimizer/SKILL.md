# SEO Optimizer

## When to activate
Before publishing documentation to public-facing site; when optimizing for search discovery.

## When NOT to use
Do not use during drafting. Apply only to final-draft docs.

## Instructions

1. Analyze page title, headers, and meta description.
2. Optimize for search keywords:
   - Primary keyword in title (within first 60 characters)
   - Primary keyword in first 100 words of body
   - Long-tail keywords in subheadings
3. Check header hierarchy (H1 → H2 → H3 only; no gaps).
4. Write/refine meta description (150–160 characters; action-oriented).
5. Validate internal link targets (at least 3 links to related docs).
6. Suggest related doc improvements.
7. Return SEO audit report with before/after.

## Example

**Input:** Page about webhook retries

**Output:**
```
# SEO Audit: Webhook Retries

## Title
❌ Current: "Retries"
✅ Recommended: "How to Handle Webhook Retries | [Product] Docs"
Reason: Adds primary keyword "webhook retries" + context

## Meta Description
❌ Current: None
✅ Recommended: "Learn how [Product] retries failed webhooks, configure retry policies, and monitor delivery status."
Reason: Action-oriented; includes primary keyword

## Headers
✅ Hierarchy: Good (H1 → H2 → H2 → H3)
Suggest: Add H2 "Retry Policies" with primary keyword

## Internal Links
Current: 1 link to [Auth doc]
Suggest: Add links to:
- [Webhook Events Reference]
- [Troubleshooting Failed Deliveries]
- [Monitoring Webhooks]

## Search Keywords
Primary: "webhook retries"
Long-tail: "configure webhook retry policy", "webhook retry backoff"

## Score
SEO Readiness: 6/10 → 9/10 (after recommendations applied)
```
