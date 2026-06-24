---
name: "thomson-reuters"
description: "Legal research requiring case law, statutes, regulations, or Westlaw/Practical Law content; user is a lawyer or legal researcher using Claude Code ..."
---

# Thomson Reuters Legal Research via MCP

## When to activate
Legal research requiring case law, statutes, regulations, or Westlaw/Practical Law content; user is a lawyer or legal researcher using Claude Code with an active Thomson Reuters API subscription; tasks requiring authoritative citations from primary and secondary legal sources.

## When NOT to use
Users without a Thomson Reuters API subscription — this MCP is enterprise-only, not freely available; tasks not requiring authoritative legal research; anything requiring legal advice (this MCP provides research, not advice — always flag this distinction).

## Instructions

**What it is:**
Thomson Reuters launched an official MCP integration (May 2026) connecting Claude directly to Westlaw, Practical Law, and other TR databases. Queries go through your TR API key to live legal databases.

**Setup:**
Add to your MCP config with your TR API key pointing to the TR MCP endpoint. Requires an active Thomson Reuters enterprise API subscription — contact your TR account representative for access.

**Available data:**
- Case law with full citations (federal and state courts, all levels)
- Federal and state statutes, current and historical
- Federal and state regulations (CFR, state admin codes)
- Secondary sources via Practical Law: guidance notes, standard documents, negotiating tips, jurisdiction comparisons
- Legal forms and templates

**Query patterns that work well:**

Case law:
```
Find cases interpreting force majeure clauses in software contracts from 2020-2026.
Return citations in Bluebook format and a two-sentence holding summary for each.
```

Statute lookup:
```
What is the current text of 17 U.S.C. § 107 (fair use)?
Note any amendments since 2020.
```

Regulatory:
```
Summarize the latest FTC rule on AI-generated content disclosures.
Include the CFR citation and effective date.
```

Practical Law secondary source:
```
What is the standard negotiating position on limitation of liability caps
in SaaS agreements? Reference the relevant Practical Law guidance note.
```

**MANDATORY output warning — include on every research output:**
> For research purposes only — verify with licensed counsel before relying on any legal analysis.

**Citation format:** Always request Bluebook format. Verify all citations independently before filing — MCP-retrieved citations can contain formatting errors and should not go directly into court documents.

**Privilege note:** Confirm whether research is for a specific client matter (attorney-client privilege may attach) or general background research. This distinction affects how the output should be stored and shared.

**Combine with CourtListener:** For comprehensive coverage, pair Thomson Reuters (secondary sources, Westlaw analysis) with the Free Law Project MCP (free primary sources for bulk lookups). TR for depth; CourtListener for breadth and volume.

## Example

```
Find all circuit court cases from 2022-2026 interpreting the CFAA's
"exceeds authorized access" provision. Summarize the circuit split
and the Supreme Court's current position after Van Buren v. United States.
Return Bluebook citations for each case.
```

Claude queries Westlaw via the TR MCP, returns a structured circuit split analysis with citations, flags areas of ongoing disagreement, and appends the mandatory research disclaimer.

---
