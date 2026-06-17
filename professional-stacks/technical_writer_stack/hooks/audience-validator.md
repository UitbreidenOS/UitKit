# audience-validator Hook

**Trigger:** PostToolUse (after defining or updating audience profile)

**What it does:** Validates that:
- Audience is clearly defined (role, expertise level, prior knowledge)
- Writing level matches intended audience
- Terminology guidelines are present
- Related docs are linked
- No assumptions about reader knowledge without introduction

**Action:**
If incomplete, flags missing elements and suggests additions.

**settings.json snippet:**
```json
{
  "hooks": {
    "audience-validator": {
      "trigger": "PostToolUse",
      "condition": "tool === 'Write' && file.includes('audience') || file.includes('profile')",
      "action": "run-script",
      "script": "hooks/audience-validator.py"
    }
  }
}
```

**Script behavior:**
1. Checks if audience profile is complete
2. Validates terminology matches audience expertise
3. Ensures docs reference the correct audience
4. Flags if writing level mismatches audience

---

**Related Skills:**
- audience-mapper
