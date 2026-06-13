---
description: Runs the 5-check quality gate on any outreach or LinkedIn content. Paste content inline or reference a file path. Returns PASS or FAIL with line-level violation notes. Nothing goes live without PASS.
---

# /review-output

## What This Does
Audits any outbound content (cold email, LinkedIn post, sequence, battlecard) against 5 compliance checks: banned words, email length, insight-first lead, tone adherence, and ICP alignment. Returns PASS or FAIL with specific line-level violations.

## Steps Claude Follows
1. Accept input: paste content inline OR provide file path
2. Run all 5 checks:
   - **Check 1: Banned Words** — Scan for 15 forbidden words (synergy, revolutionary, game-changer, delve, robust, leverage, holistic, reach out, touch base, circle back, paradigm, disruptive, innovative, seamlessly, checking in, just following up, per my last email)
   - **Check 2: Email Length** — If email body: must be ≤120 words; flag if over
   - **Check 3: Insight-First Lead** — First sentence must not start with "I," "My name," or generic greeting; must lead with business truth or trigger about prospect
   - **Check 4: Tone Compliance** — Verify professional, concise, no corporate filler; no hedging language ("hope this finds," "just wanted to," "would appreciate")
   - **Check 5: ICP Alignment** — If prospect info available, validate tone and subject matter fit the ICP (SaaS/B2B, 10–500 employees, C-suite/VP/Director/Founder target)
3. On FAIL: list each violation with exact line number and recommended fix; offer to apply all fixes and re-run
4. On PASS: print "REVIEW: PASS ✓ — Ready for human approval before sending."

## Fix Loop
If user approves fixes:
1. Apply all fixes to content
2. Re-run all 5 checks
3. Display updated content with PASS confirmation and summary of changes

## What Gets Reviewed
- Cold email sequences (all touches)
- Individual outreach emails
- LinkedIn posts, comments, DMs
- Battlecards or call briefs with outbound messaging
- Any text intended for prospect/customer consumption

## What Does NOT Need Review
- Internal notes or session-log entries
- Research briefs or account data
- Call transcripts or summaries
- Strategy documents or planning notes

---
