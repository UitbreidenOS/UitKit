# seo-audit Hook

**Trigger:** Before publish (custom hook, runs before final commit)

**What it does:** Validates SEO readiness:
- Page title includes primary keyword (within 60 chars)
- Meta description present and action-oriented (150–160 chars)
- Header hierarchy is correct (H1 → H2 → H3)
- At least 3 internal links to related docs
- Primary keyword in first 100 words of body

**Action:**
If any requirement unmet, blocks publication and lists required fixes.

**settings.json snippet:**
```json
{
  "hooks": {
    "seo-audit": {
      "trigger": "PreCommit",
      "condition": "branch === 'publish' || message.includes('publish')",
      "action": "run-script",
      "script": "hooks/seo-audit.py"
    }
  }
}
```

**Script behavior:**
1. Extracts page metadata (title, headers, links)
2. Checks keyword placement and density
3. Validates header hierarchy
4. Counts internal links
5. Reports pass/fail with required fixes

---

**Related Skills:**
- seo-optimizer
