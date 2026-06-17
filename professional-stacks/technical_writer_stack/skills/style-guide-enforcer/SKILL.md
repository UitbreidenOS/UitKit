# Style Guide Enforcer

## When to activate
User runs doc review or asks for clarity/tone audit on existing documentation.

## When NOT to use
Do not use before the doc is written. Use this only on complete or near-complete drafts.

## Instructions

1. Scan document for violations of CLAUDE.md tone and style rules.
2. Flag each violation with:
   - Location (line/section)
   - Rule violated
   - Suggested fix
   - Severity (critical/high/low)
3. Check for:
   - Passive voice (target: 80%+ active voice)
   - Banned words (seamlessly, leverage, empower, etc.)
   - Sentence length (target: 15–20 words average)
   - Jargon without definition
   - Marketing language in technical content
4. Provide clarity score: 0–100 based on violations.
5. Return report with all violations and fixes.

## Example

**Input:** "Our seamlessly integrated solution empowers users to effortlessly leverage advanced analytics capabilities."

**Output:**
```
CLARITY REPORT: [Doc Title]
Score: 25/100

CRITICAL:
1. "seamlessly integrated solution" — Banned word; Violates: no marketing language
   Fix: "integrates with [system name]"

2. "empowers users" — Banned word; Violates: no marketing language
   Fix: "lets users" or "enables users"

3. "effortlessly leverage advanced analytics capabilities" — Multiple banned words; wordy
   Fix: "use advanced analytics"

SENTENCE LENGTH:
"Our seamlessly integrated solution empowers users to effortlessly leverage advanced analytics capabilities." — 15 words (okay, but fix word choice first)

SUGGESTIONS:
- Rewrite lead sentence to be direct: "This integration lets you analyze [data type]."
- Link to "what is analytics" on first mention
```
