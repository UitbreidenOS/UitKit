---
name: output-reviewer
description: 5-check quality gate that runs before any outreach or content ships. Checks: banned words, ICP fit reference, trigger specificity, word count compliance, CTA format. Returns PASS or FAIL with line-level notes. Nothing goes live without a PASS.
allowed-tools: Read
effort: low
---

# Output Reviewer

## When to activate

Always — before any Write of outreach content, before any LinkedIn post is finalized, when `/review-output` is called. Self-invoked by cold-email-sequencer after drafting. Run this on every email, LinkedIn message, or sales asset before it leaves the workspace.

## When NOT to use

Internal notes, session-log updates, research briefs, battlecards, product documentation, internal Slack messages, or any content that won't be sent to a prospect or posted publicly.

## The 5 Checks

### Check 1: Banned Word Scan
**PASS:** None of the 15 banned words appear anywhere in the output.  
**FAIL:** Any of these words found: *synergy*, *revolutionary*, *game-changer*, *delve*, *robust*, *leverage*, *holistic*, *reach out*, *touch base*, *circle back*, *paradigm*, *disruptive*, *innovative*, *seamlessly*, *checking in*, *just following up*, *per my last email*.

**Why:** These words signal generic outreach and erode trust with GTM buyers. They've seen them 1,000 times.

---

### Check 2: ICP Fit Reference
**PASS:** Something specific about THIS company or person is mentioned — a concrete detail that couldn't apply to anyone else.  
**FAIL:** Generic reference ("I noticed your company is growing") or no company/person detail at all.

**Why:** Specificity is the first signal of real homework and intent. Generic = deleted.

---

### Check 3: Trigger Specificity
**PASS:** A named, recent, verifiable event is referenced — funding round, hiring announcement, product launch, news mention, org change.  
**FAIL:** Vague statements ("I noticed you're scaling") without a named event or date anchor.

**Why:** A good trigger is action-forcing. "Your Series A in March" creates urgency; "you're growing" is noise.

---

### Check 4: Word Count
**PASS:** Email body ≤120 words; subject line ≤8 words.  
**FAIL:** Email body >120 words; subject line >8 words.

**Why:** Long emails get ignored. Subject lines that ramble get marked spam. Brevity is respect.

---

### Check 5: CTA Format
**PASS:** Ends with a question mark and specifies a day/time or a concrete, single next action.  
**FAIL:** Ends without a question, or CTA is vague ("let me know what you think").

**Why:** A closed-ended CTA gets a closed-ended response. Specific asks convert.

---

## FAIL Output Format

When any check fails, return:

```
REVIEW: FAIL
Check 1 (Banned words): FAIL — "leverage" found in paragraph 2
Check 2 (ICP reference): PASS
Check 3 (Trigger specificity): FAIL — "I noticed you're growing" is not a named trigger
Check 4 (Word count): PASS — 94 words
Check 5 (CTA): PASS

2 violations found. Fix before using.
```

Include line numbers or quotes for failed checks so the user knows exactly what to edit.

---

## PASS Output Format

When all checks pass, return:

```
REVIEW: PASS ✓
All 5 checks passed. Ready for human approval before sending.
```

---

## Example

### Initial Draft (FAILS Checks 1 & 3)

**To:** alex@growthco.io  
**Subject:** Scaling Revenue with Seamless Systems

Hi Alex,

I noticed you're scaling and wanted to reach out. Our solution helps companies leverage innovative approaches to circle back with prospects more effectively. We're seeing paradigm shifts in how leading teams approach GTM, and I think you should delve deeper into how we've helped similar companies achieve robust growth.

Let me know what you think.

Best,
Jamie

---

### Review Output

```
REVIEW: FAIL
Check 1 (Banned words): FAIL — "seamless" (subject), "leverage," "innovative," "circle back," "paradigm," "delve," "robust" found
Check 2 (ICP reference): PASS — Growth Co is named
Check 3 (Trigger specificity): FAIL — "you're scaling" is vague; no trigger event
Check 4 (Word count): PASS — 72 words
Check 5 (CTA): FAIL — ends with "Let me know what you think" (not a question)

3 violations. Fix before using.
```

---

### Fixes Applied

1. Remove banned words; replace with plain language
2. Add a specific trigger (e.g., recent fundraise, new hire in GTM)
3. Change CTA to a question with specificity

### Revised Email

**To:** alex@growthco.io  
**Subject:** Quick thought on your new VP Demand Gen role

Hi Alex,

Congrats on joining Growth Co as VP Demand Gen. I saw your announcement last week and thought of a pattern we're working with other B2B SaaS teams in the Series A→B phase: most waste 30% of pipeline on leads that should have been nurtured longer.

Given your mandate to scale pipeline, would a quick 15-minute call Tuesday or Wednesday help clarify if that's a fit?

Best,
Jamie

---

### Re-run Review

```
REVIEW: PASS ✓
All 5 checks passed. Ready for human approval before sending.
```

---
