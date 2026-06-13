---
name: tone-enforcer
description: Scans content drafts for banned words, corporate jargon, passive voice, hedging language, and off-brand tone. Returns specific violations and suggested fixes. High-signal, low false-positive auditor.
allowed-tools: Read
effort: low
---

# Tone Enforcer

## When to activate

Before any content piece is approved for publication. You have brand guidelines, tone rules, and a banned-word list in place. This skill audits any draft (blog, social, email, case study) and surfaces violations with specific fixes. Not a style guide — focused on brand integrity and tone consistency.

## When NOT to use

Not for grammar or copyediting — use a professional editor for that. Not for messaging validation — use Messaging Architect. Not for broader content strategy — use Content Generator.

## Audit Dimensions

**1. Banned Words (Hardblock)**
Specific words your brand never uses. Examples: synergy, leverage, disruptive, game-changer, best-in-class, robust, cutting-edge, seamless, etc.

Return violations as a list: [word] found on line X. Suggested replacement: [alternative].

**2. Jargon & Corporate Speak**
Avoid: "verticals," "solution," "ecosystem," "unlock value," "empower," "paradigm shift," "market penetration," "synergize," "operationalize."

Flag and suggest plain-English replacement.

**3. Passive Voice (Target <10% of sentences)**
Prefer active: "We help customers" over "Customers are helped by us."

Count passive sentences and flag if >10% of total. Mark high-priority violations only.

**4. Hedging Language**
Avoid: "we believe," "we think," "arguably," "it could be," "in some cases," "somewhat," "fairly," "relatively."

Make claims declaratively. Back with proof. Flag hedging as tone drift.

**5. Tone Consistency**
Is this piece consistent with your brand voice? Too formal? Too casual? Too salesy? Too academic?

Rate consistency 0–100. Flag tone mismatches.

**6. Proof Density**
Does this claim back itself up? Are metrics included? Customer quotes? Data? Or is it unsupported assertion?

Mark unsupported claims for review.

## Output Format

Return tone audit as:

```
# Tone Audit Report

**Content:** [Title]
**Format:** [Blog / Social / Email / Case Study]
**Overall Tone Score:** [0–100]
**Status:** ✓ PASS / NEEDS WORK

---

## Violations

### Critical (Blocked)
- [Banned word]: "X" (line Y) — Suggested replacement: "Y"
- [False claim]: "X" (line Y) — Needs proof point

### High Priority
- [Jargon]: "X" (line Y) — Suggested replacement: "Y"
- [Passive voice]: "X" (line Y) — Suggested active: "Y"

### Medium Priority
- [Tone shift]: Paragraph starting "X" feels [too formal/too casual/too salesy]
- [Hedging]: "X" (line Y) — Make claim declarative: "Y"

### Low Priority
- [Style note]: "X" (line Y) — Consider "Y" for brevity

---

## Proof Density Check

| Claim | Proof Provided | Status |
|---|---|---|
| [Claim 1] | [Proof type] | PASS / NEEDS PROOF |
| [Claim 2] | [Proof type] | PASS / NEEDS PROOF |

---

## Tone Summary

**Brand Voice Alignment:** [Score 0–100]
**Hedging Language:** [0–5 instances] — [Pass / Flag]
**Proof Strength:** [Metric claims backed] — [Pass / Needs work]

---

## Recommendations

1. [First fix: critical violation]
2. [Second fix: high priority]
3. [Third fix: medium priority]

---

**Status:** [PASS: No changes needed] / [NEEDS WORK: Fix cited violations and re-submit]
```

## Example

**Tone Audit Report**

**Content:** "Ship Faster With Enterprise Security Built In"
**Format:** Blog Post
**Overall Tone Score:** 87/100
**Status:** ✓ PASS (with minor fixes)

---

## Violations

### Critical (Blocked)
None.

### High Priority
- **Jargon:** "paradigm shift" (line 42) — Suggested replacement: "shift in how we think about security"
- **Passive voice:** "Security should be baked in, not bolted on" (line 5) — Better active form: "We bake security in, not bolt it on"

### Medium Priority
- **Hedging:** "It feels like" (line 28) — Make declarative: "What's happening is"
- **Tone shift:** Paragraph starting "When they switched..." feels conversational but headline is formal. Consider tightening tone to match.

### Low Priority
- **Wordiness:** "This cycle kills velocity" (line 22) — Keep as is; strong voice. No change needed.

---

## Proof Density Check

| Claim | Proof Provided | Status |
|---|---|---|
| "Security review went from 2 weeks to 2 days" | Customer quote from Sarah Chen | PASS |
| "90% reduction in security-driven delays" | Math calculation shown | PASS |
| "Companies like Stripe have made security-first a competitive advantage" | No specific proof | NEEDS PROOF |

---

## Tone Summary

**Brand Voice Alignment:** 87/100 (mostly on-brand, minor hedging slips)
**Hedging Language:** 2 instances — Flag for revision
**Proof Strength:** 2/3 claims backed; 1 needs citation

---

## Recommendations

1. Replace "paradigm shift" with "shift in how we think about security"
2. Add citation for Stripe claim (link to their security blog or news)
3. Tighten hedging language in customer quote section

---

**Status:** PASS (Fix 3 items above and re-submit for final approval)

---
