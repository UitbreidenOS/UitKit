# Hook: Link Checker

## What It Does

Validates all URLs in newsletter drafts—checks that they are properly formatted, live, and accessible. Prevents broken links from reaching subscribers.

## Settings.json Entry

```json
{
  "hooks": {
    "newsletter-link-checker": {
      "event": "PostToolUse",
      "trigger": {
        "tools": ["write", "edit"]
      },
      "scriptPath": "hooks/link-checker.sh"
    }
  }
}
```

## Setup Instructions

1. Add the JSON entry above to your `.claude/settings.json` under `hooks`
2. Place the hook script at `.claude/hooks/link-checker.sh`
3. Restart Claude Code session
4. Hook will auto-trigger when you write or edit newsletter content

## What Gets Checked

### URL Format Validation

- **Requires:** `http://` or `https://` prefix
- **Flags:** Missing protocol, malformed URL structure
- **Example flagged:** `www.example.com` (should be `https://www.example.com`)

### Live/Accessible Check

- **Test:** Attempt to reach each URL with HTTP HEAD request
- **Flags:** 404 (not found), 403 (forbidden), timeout (>5 sec), DNS error
- **Passes:** 200–399 status codes (success, redirect)

### Link Anchor Text Quality

- **Flags:** Generic anchors ("click here," "link," "read more")
- **Recommends:** Descriptive anchors that hint at destination

### Duplicate Links

- **Detects:** Same URL appearing multiple times
- **Suggests:** Consolidate or remove redundant links

### Link Count

- **Flags if:** More than 3–4 main content links (exceeds recommended)
- **Note:** Footer links (unsubscribe, social) are counted separately

---

## Example Output

```
🔗 LINK CHECKER REPORT

**FILE:** Newsletter draft — "5 AI Trends"

---

### LINKS FOUND (3)

| # | Anchor Text | URL | Status |
|---|---|---|---|
| 1 | Full McKinsey report | https://www.mckinsey.com/articles/ai-trends-2026 | ✓ Live (200) |
| 2 | Expert commentary | https://example.com/expert-commentary-2026 | ⚠ Timeout (>5sec) |
| 3 | click here | https://substack.com/archive | ⚠ Generic anchor |

---

### ISSUES FOUND (2)

**Issue 1: Slow Link**
- URL: `https://example.com/expert-commentary-2026`
- Status: Timeout (taking >5 seconds to load)
- Action: Consider removing if not essential, or test again later. May indicate server issue.

**Issue 2: Weak Anchor Text**
- URL: `https://substack.com/archive`
- Current anchor: "click here"
- Recommended: "view past newsletters" or "archive"
- Why: "Click here" doesn't signal destination value to reader or email provider

---

### RECOMMENDATIONS

1. **Fix the timeout link:** Test again in 2 hours, or replace with alternative expert source
2. **Improve anchor text:** Change "click here" to "view past newsletters"
3. **Link count is good:** 3 links is appropriate for newsletter this length

---

### CHECKLIST

- [x] All URLs have http/https protocol
- [x] URLs are properly formatted
- [ ] All URLs are live and accessible (1 timeout issue)
- [ ] Anchor text is descriptive (1 generic anchor to fix)
- [x] No excessive duplicate links
- [x] Link count is appropriate (3 links for 487-word body)

**Status:** Fix 2 issues before send.

---

### FOOTER LINKS

| Link | Destination | Status |
|---|---|---|
| Unsubscribe | https://[your-platform]/unsubscribe | ✓ Live |
| Preferences | https://[your-platform]/preferences | ✓ Live |
| Twitter | https://twitter.com/[handle] | ✓ Live |
| LinkedIn | https://linkedin.com/in/[profile] | ✓ Live |

**Status:** All footer links live and working.
```

---

## How the Hook Works

1. **Trigger:** You write or edit newsletter content
2. **Extract:** Hook finds all `https://` or `http://` URLs
3. **Validate:** Each URL is checked for format, protocol, and live status
4. **Audit:** Anchor text and link count are reviewed
5. **Report:** Issues are flagged with recommendations

---

## Customization

To adjust link validation rules:

1. Edit `.claude/hooks/link-checker.sh`
2. Modify these variables:

```bash
TIMEOUT_THRESHOLD=5  # Seconds before timeout
MAX_LINK_COUNT=4     # Max allowed content links
HTTP_STATUS_SUCCESS="^[23][0-9]{2}$"  # Accept 200–299 status codes
```

3. Restart Claude Code

---

## Tips

- **Test links before send:** Run link checker 1–2 hours before scheduled send to catch temporary outages
- **Track link performance:** After send, note which links got the most clicks. Use this to inform future link placement.
- **Use UTM parameters:** For marketing links, add `?utm_source=newsletter&utm_medium=email&utm_campaign=[topic]` to track traffic in analytics
- **Be sparing:** 3–4 links is optimal. More than that dilutes click-through and feels promotional.

---

## Troubleshooting

**"Link times out but I know it's live"**
- The server may be slow or rate-limiting. Test again in 2 hours.
- Consider replacing with faster-loading alternative.

**"Generic anchor text warning, but I like 'click here'"**
- Generic anchors hurt open rates and feel dated.
- Specific anchors (e.g., "read the full analysis") are more engaging and accessible.

**"Too many links warning"**
- You can override if intentional, but consider: is every link valuable?
- Subscribers respond better to 2–3 high-value links than 5+ scattered links.

---
