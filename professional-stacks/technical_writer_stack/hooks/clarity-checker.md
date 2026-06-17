# clarity-checker Hook

**Trigger:** PostToolUse (after any Write operation on documentation)

**What it does:** Automatically scans newly written or updated documentation sections for:
- Passive voice constructions
- Wordy phrases (e.g., "in order to," "at the end of the day")
- Undefined jargon
- Sentence length > 25 words
- Banned words from CLAUDE.md

**Action:**
If violations found, suggests inline corrections without blocking publication.

**settings.json snippet:**
```json
{
  "hooks": {
    "clarity-checker": {
      "trigger": "PostToolUse",
      "condition": "tool === 'Write' && file.includes('.md')",
      "action": "run-script",
      "script": "hooks/clarity-checker.py"
    }
  }
}
```

**Script behavior:**
1. Extracts text from written doc
2. Checks against banned words, readability metrics
3. Flags issues with line numbers
4. Returns suggestions as comment (non-blocking)

---

**Related Skills:**
- style-guide-enforcer
