---
description: Runs the full sequence pipeline: ICP qualify → account research → 5-touch sequence → output review. Returns a reviewed draft ready for human approval. Requires prospect name, title, and company.
---

# /write-sequence

## What This Does

Executes a complete cold email sequence generation pipeline for a prospect. Takes prospect details (name, title, company), validates them against your ICP, researches the target account, generates a 5-touch email sequence with specific triggers, and reviews the output for quality gates. Stops at each decision gate and requires final human approval before logging. Returns a reviewed draft with ICP score, trigger rationale, and reviewer certification.

## Steps Claude Follows

1. **Collect prospect inputs**: Ask for prospect first name, title, company name, company URL (optional), and any known context (recent funding, news, hiring signals).
2. **Run icp-qualifier**: Pass prospect attributes through ICP qualification model. If **NO-GO**, halt and explain which ICP dimension(s) failed. If **GO** or **CAUTION**, proceed.
3. **Run account-researcher**: Generate company brief with: headcount, funding stage, recent news, hiring signals, and pain points. Save output to `accounts/{company-slug}-brief.md`.
4. **Run cold-email-sequencer**: Use the account brief to generate 5-touch sequence. Sequencer picks the single strongest trigger (funding, hiring, news, event, competitor) and uses it as the angle for Touch 1. All five emails reference this trigger or build on it.
5. **Run output-reviewer**: Validate the complete sequence against quality gates: relevance (trigger matches ICP), personalization depth, call-to-action clarity, tone consistency, unsubscribe compliance. Return **PASS** or **FAIL** with specific violations.
6. **Loop if failed**: If reviewer returns FAIL, fix cited violations and re-run reviewer until PASS.
7. **Present final sequence**: Display ICP qualification score with reason, trigger used and why, all 5 touches with subject lines, and reviewer PASS verdict with timestamp.
8. **Require approval**: Print approval prompt: "Review the sequence above. Reply **APPROVE** to log it to sequences/{company-slug}-{date}.md, or provide specific edits to retry."

## Output Format

```
**ICP Qualification: [SCORE]/100 — [GO|CAUTION|NO-GO]**
Reason: [One sentence explaining the score]

**Trigger Selected: [TYPE]**
Rationale: [One sentence — why this trigger fits the prospect]

---

## 5-Touch Sequence for [Prospect Name] @ [Company]

**Touch 1: Email Subject**
[Email body]

**Touch 2: Email Subject**
[Email body]

**Touch 3: Email Subject**
[Email body]

**Touch 4: Email Subject**
[Email body]

**Touch 5: Email Subject**
[Email body]

---

**Reviewer Verdict: ✓ PASS**
Validated against: relevance, personalization, CTA clarity, tone, compliance
Timestamp: [ISO timestamp]

---

**Next step:** Review the sequence above. Reply **APPROVE** to log it, or provide specific edits to retry.
```

## Example Run

```
You: /write-sequence

Claude: I'll help you write a cold email sequence. Please provide:
- Prospect's first name?
- Title?
- Company name?
- Company URL (optional)?
- Any known context (recent funding, news, etc.)?

You: Sarah, VP Product, Acme SaaS, acme.io, $12M Series A 6 months ago

Claude: Researching Sarah at Acme SaaS...

**ICP Qualification: 72/100 — GO**
Reason: Series A, 20–100 headcount, product-focused buyer, B2B SaaS—all green. Geographic fit assumed US.

**Trigger Selected: Series A Funding**
Rationale: Recent $12M raise signals growth investments in product tooling.

---

## 5-Touch Sequence for Sarah @ Acme SaaS

**Touch 1: You're scaling post-Series A—thought on tooling?**
Sarah,

Just saw Acme closed $12M. Congrats—that's a big milestone.

Post-Series A, most VP Products rethink their tooling stack. Usually because:
- Manual processes don't scale past 20 people
- New hires need better onboarding
- Speed-to-market gets competitive fast

We work with companies like [similar company] who went through exactly this. They cut time-to-ship by 40%.

Worth a quick call to see if it fits? 
[Link]

Best,
[Your name]

**Touch 2: Series A post-mortem question**
[...]

**Touch 3: [VP Product best practice]**
[...]

**Touch 4: [Social proof angle]**
[...]

**Touch 5: [Final soft close]**
[...]

---

**Reviewer Verdict: ✓ PASS**
Validated against: relevance ✓, personalization ✓, CTA clarity ✓, tone ✓, compliance ✓
Timestamp: 2026-06-12T14:32:00Z

---

**Next step:** Review the sequence above. Reply **APPROVE** to log it to sequences/acme-saas-2026-06-12.md, or provide specific edits to retry.
```
