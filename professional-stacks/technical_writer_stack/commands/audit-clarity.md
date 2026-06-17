# /audit-clarity

**What it does:** Scan documentation for tone violations, clarity issues, passive voice, and jargon; return a report with fixes.

**Trigger:** Slash command in Claude Code

**Usage:**
```
/audit-clarity [paste doc text]
```

**Output:**
- Clarity score (0–100)
- List of violations with locations
- Suggested rewrites for each violation
- Severity breakdown (critical/high/low)
- Readability metrics (sentence length, active voice %, jargon count)
- Action items to improve score

**Example:**
```
/audit-clarity [paste section of documentation]
```

**Calls:** style-guide-enforcer skill
