# Claude for Legal and Compliance Officers

Everything an in-house lawyer, General Counsel, or Compliance Officer needs to run AI-augmented contract review, regulatory compliance, privacy programmes, and legal research in Claude Code.

---

## Who this is for

You are in-house legal counsel, a compliance officer, a DPO, or a GC whose job is to protect the business from legal risk, keep operations compliant with regulations, and advise stakeholders quickly and accurately. You are perpetually understaffed relative to the volume of legal work, and you spend too much time on contract triage, evidence collection, and research that could be accelerated.

**Before Claude Code:** 60-90 minutes to review a standard NDA. Half a day to produce a compliance gap analysis. Days to research a novel legal question across multiple jurisdictions. Months to prepare for a SOC2 audit.

**After:** First-pass NDA review in 5 minutes. Compliance obligation register in 20 minutes. Multi-jurisdiction research memo in 30 minutes. SOC2 evidence checklist and gap analysis in 45 minutes.

**What Claude does not replace:** Legal judgement, licensed legal advice, court filings, and any document that is signed and sent externally without human review.

---

## 30-second install

```bash
# Install the full legal and compliance stack
npx claudient add skills legal

# Or cherry-pick:
npx claudient add skill legal/contract-review
npx claudient add skill legal/nda-review
npx claudient add skill legal/gdpr-expert
npx claudient add skill legal/soc2-compliance
npx claudient add skill legal/privacy-pia
npx claudient add skill legal/eu-ai-act
npx claudient add skill legal/iso27001
npx claudient add skill legal/dsar-response
npx claudient add skill legal/compliance-tracker
npx claudient add skill legal/legal-research
npx claudient add agents advisors/general-counsel
npx claudient add agents advisors/ciso-advisor
```

---

## Your Claude Code legal stack

### Skills (slash commands)

| Skill | What it does | When to use |
|---|---|---|
| `/contract-review` | RED/YELLOW/GREEN contract analysis: risk flags, missing clauses, fix suggestions | Every contract before signing |
| `/nda-review` | NDA triage: type, scope, red flags, lawyer-review flag | NDA queue triage |
| `/gdpr-expert` | GDPR compliance: Article-by-Article analysis, lawful basis, DPA requirements | Any GDPR question or new processing activity |
| `/soc2-compliance` | SOC2 Type II: controls mapping, evidence requirements, gap analysis | SOC2 audit preparation |
| `/privacy-pia` | Privacy Impact Assessment: risk scoring, mitigation, DPIA output | New products or high-risk processing |
| `/eu-ai-act` | EU AI Act: risk classification, prohibited uses, compliance obligations | Any AI system deployed in the EU |
| `/iso27001` | ISO 27001:2022 gap analysis and implementation guidance | ISO certification preparation |
| `/dsar-response` | Data Subject Access Request response: triage, redaction guidance, response drafts | Incoming DSARs |
| `/compliance-tracker` | Obligation register, evidence checklist, deadline tracker for GDPR/SOC2/ISO27001 | Ongoing compliance management |
| `/legal-research` | Legal research memos, case law summaries, jurisdiction comparisons | Research questions |

### Agents

| Agent | Model | When to spawn |
|---|---|---|
| `general-counsel` | Opus | Complex legal analysis, strategic legal advice, novel legal questions |
| `ciso-advisor` | Opus | Security-adjacent legal questions: vendor security, breach response, pen test interpretation |

---

## Daily workflow

### Morning — Contract queue review (30-60 minutes)

**1. Contract triage**
```
/contract-review

Triage today's contract queue:
[Paste contract text or describe each contract]

For each:
- Overall risk level (HIGH / MEDIUM / LOW)
- Number of RED issues
- Whether it needs external counsel
- Recommended action: approve / redline / escalate / reject

Sort by priority — RED issues first.
```

**2. NDA fast-track**
```
/nda-review

Review this NDA — standard first-pass:
[Paste NDA text]

Output:
- Type (mutual / one-way)
- Term
- Any non-standard provisions
- Do I need to read this fully or is it market standard?
- Send to lawyer: yes / no
```

---

### Compliance monitoring (15-30 minutes, daily)

**3. Regulatory radar**
```
/compliance-tracker

Daily compliance check:
- Any DSARs received yesterday? Deadline tracking status?
- Any breach notification windows open?
- Any certification deadlines within 30 days?
- Any regulatory changes I should be aware of this week?
[Paste any new communications or regulatory alerts]
```

**4. DSAR response management**
```
/dsar-response

New DSAR received from: [name]
Received: [date] — response due: [date + 30 days, or 45 days for CCPA]
Request: [describe what they're asking for]

Produce:
- Acknowledgement letter template
- Internal data collection checklist (which systems to query)
- Redaction guidance (what must be removed before disclosure)
- Response timeline and milestones
```

---

### Policy drafting (variable — 1-3 hours)

**5. Policy creation or update**
```
/gdpr-expert

Draft / update our [policy type] to comply with GDPR.

Company context:
- Processing activities: [describe]
- Jurisdiction: [EU / UK / both]
- Last updated: [date]
- What changed that requires an update: [reason]

Produce: full policy draft with Article citations. Flag every provision that requires legal review before finalisation.
```

---

### Legal research (variable)

**6. Research question**
```
/legal-research

Research question: [plain language question]
Jurisdiction(s): [list]
Context: [why we need to know — business decision at stake]
Depth: [quick brief / standard memo / deep research]

Produce a research memo with citations. Flag [VERIFY] on every specific legal citation.
```

---

### Stakeholder guidance (on demand)

**7. Quick legal guidance for business teams**
```
/general-counsel

A business stakeholder is asking: [describe the business question]

They need to know: [what they're trying to do]
Risk they're worried about: [what they're concerned about]

Give me a plain-English answer I can forward to them within 10 minutes.
Escalation flag: does this need a full legal memo or external counsel?
```

---

## Contract review workflow (daily queue)

For detailed step-by-step, see [workflows/contract-review.md](../workflows/contract-review.md).

**Quick reference:**

```
Priority 1 (review same day):
- Agreements with signing deadline today or tomorrow
- Any contract with unlimited indemnification
- Any data processing agreement (DPA) for a new vendor
- NDA with non-standard scope definitions

Priority 2 (review within 3 days):
- Standard vendor MSAs under $50K annual value
- Customer contracts from a new logo (template check)
- Employment offer letters

Priority 3 (review this week):
- Renewals on existing vendor agreements (compare to prior terms)
- Partner agreements (low commercial risk)
- Internal policies or procedures

Delegate to external counsel:
- Any contract over $250K (or your materiality threshold)
- Litigation documents, settlement agreements
- Regulated financial or healthcare agreements
- IP assignments, technology transfer, exclusivity agreements
```

---

## 30-day ramp plan (new legal / compliance hire)

### Week 1 — Know your obligation landscape
- Install all legal skills: `npx claudient add skills legal`
- Run `/compliance-tracker` — build your obligation register for every applicable framework
- Review all existing contracts in your standard templates — identify what's market standard vs. custom
- Identify open DSARs, breach notifications, or audit requests — get on top of deadlines immediately
- Read your current privacy policy and data retention schedule — do they match actual practice?

### Week 2 — Build the compliance baseline
- Run `/gdpr-expert` on your current processing activities — produce or update your RoPA (Records of Processing Activities)
- Run `/soc2-compliance` or `/iso27001` — produce a gap analysis for your target frameworks
- Map which vendors are data processors (need DPAs) vs. controllers (separate analysis)
- Produce a risk register: what are the top 5 legal risks facing this business right now?

### Week 3 — Operationalise
- Set up your DSAR response workflow using `/dsar-response`
- Build contract playbooks for your 3 most common contract types (vendor MSA, customer MSA, NDA)
- Set up your compliance deadline tracker with `/compliance-tracker`
- Brief business stakeholders on what they can and cannot do without legal review

### Week 4 — Proactive risk management
- Produce your first legal risk report for the CEO and board
- Run `/privacy-pia` on any new product features under development
- Schedule quarterly access reviews (working with IT/Security)
- Set up your recurring compliance calendar: monthly, quarterly, annual deadlines

---

## Tool integrations

### Thomson Reuters / Westlaw / LexisNexis

```
Use primary legal databases for research validation.
Workflow:
1. Use /legal-research to identify the legal question and research path
2. Validate specific citations in Westlaw or LexisNexis
3. Paste verified case holdings back into Claude for analysis and memo drafting
4. Use Claude to write the memo; use Westlaw to ensure citations are current

Do NOT rely on Claude citations as authoritative without primary database verification.
```

### Contract management systems (Ironclad / DocuSign / Juro)

```
Workflow for contract review with a CLM:
1. New contract arrives in your CLM
2. Export as PDF/text
3. Run /contract-review — get RED/YELLOW/GREEN analysis
4. Add review notes and redlines directly in the CLM
5. Use Claude to generate redline explanations for counterparty

For bulk review (Ironclad data export):
1. Export contract metadata as CSV
2. /contract-review: "Review this batch of contracts for expired DPAs or missing GDPR clauses"
```

### GRC platforms (Vanta / Drata / Secureframe)

```
Use Claude alongside your GRC platform, not instead of it:

Claude strengths: writing policy documentation, explaining requirements, gap analysis, management commentary
GRC platform strengths: automated evidence collection, continuous monitoring, auditor portal

Workflow:
1. GRC platform flags a control gap
2. /compliance-tracker: explain the control requirement and suggest a remediation approach
3. /gdpr-expert or /soc2-compliance: draft the policy or procedure to close the gap
4. Upload policy to GRC platform as evidence
```

### Notion / Confluence (legal knowledge base)

```
Build your legal knowledge base in Notion or Confluence:
1. Use /legal-research to produce research memos
2. Save memos in Notion with tags: [jurisdiction] [topic] [date]
3. Each memo includes: question, answer, key citations, [VERIFY] markers, and review date

Set a quarterly reminder to review and update high-traffic memos.
Over time, this becomes your firm's precedent library.
```

### Slack (legal request intake)

```
Set up a #legal-requests Slack channel.
Claude Code can monitor and triage via a webhook:

Incoming request → Claude reads the message → classifies:
  - Quick guidance (< 5 min answer): reply immediately
  - Standard review (contract, NDA): route to legal queue
  - Complex / novel: flag for GC attention
  - Urgent (breach, litigation): immediate escalation

Use n8n or Make to automate the routing.
```

---

## Benchmarks to track

| Metric | Target |
|---|---|
| NDA first-pass review time | <10 minutes |
| Standard contract review time (MSA) | <45 minutes |
| DSAR acknowledgement | Same day of receipt |
| DSAR response | Within 25 days (leave 5 days buffer before 30-day deadline) |
| Breach notification readiness | Pre-built template, ready to send within 2 hours |
| Open compliance gaps (critical) | 0 |
| Open compliance gaps (non-critical) | <5, all with owner + deadline |
| Vendor DPA coverage | 100% of data processors |
| Policy review cycle | Annual (all policies reviewed and signed off) |
| Board legal risk report | Quarterly |

---

## Common mistakes (and how Claude Code helps avoid them)

**Mistake 1: Treating all contracts as equally risky**
`/contract-review` gives an overall risk score (HIGH / MEDIUM / LOW) instantly. Triage first, review proportionally.

**Mistake 2: Compliance frameworks as one-time projects**
`/compliance-tracker` turns compliance into an ongoing obligation register with deadlines — not a one-time audit.

**Mistake 3: Legal research without citation validation**
Every `/legal-research` output includes `[VERIFY]` markers. These are prompts to check the primary source — not optional.

**Mistake 4: No audit trail for DSAR responses**
`/dsar-response` generates an evidence trail for every request: receipt date, deadline, data collected, redactions made.

**Mistake 5: Giving guidance without documenting it**
Use Claude to draft legal memos even for quick guidance questions. A 2-sentence verbal answer is not discoverable. A brief memo is.

---

## Resources

- [Getting started with Claude Code](../getting-started.md)
- [Contract review workflow](../workflows/contract-review.md)
- [GDPR expert skill](../skills/legal/gdpr-expert.md)
- [Contract review skill](../skills/legal/contract-review.md)
- [Compliance tracker skill](../skills/legal/compliance-tracker.md)
- [Legal research skill](../skills/legal/legal-research.md)
- [DSAR response skill](../skills/legal/dsar-response.md)

---
