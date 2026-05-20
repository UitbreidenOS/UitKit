---
name: ip-clearance
description: "IP clearance: trademark availability search, freedom-to-operate analysis for patents, open source licence compliance, and brand name risk assessment before launch"
---

# IP Clearance Skill

## When to activate
- Checking if a brand name, product name, or domain is available before launch
- Assessing freedom to operate (FTO) for a new product or feature
- Reviewing open source dependencies for licence compliance before commercial release
- Identifying trademark conflicts in new markets or geographies
- Conducting a pre-filing IP risk assessment

## When NOT to use
- Filing trademarks or patents — requires qualified IP attorney
- Litigation or enforcement strategy — use the brief-section-drafter skill
- Comprehensive patent prosecution — specialist patent counsel required
- FOSS contribution policy decisions — legal and policy decision, not clearance

## Instructions

### Brand name / trademark clearance

```
Conduct a trademark clearance search for [name].

Name to clear: [proposed brand name, product name, or tagline]
Goods/services class: [describe what you sell — maps to Nice Classification]
Geography: [US only / EU / UK / global launch / specific countries]
Proposed use date: [launch date]

Trademark clearance checklist:

Step 1 — Identical mark search (databases):
□ USPTO TESS (US): https://tmsearch.uspto.gov
   Search: exact match, then phonetic equivalents
   Classes to search: [identify correct Nice Classification — e.g. Class 42 for software]
□ EUIPO (EU): https://euipo.europa.eu/eSearch
□ UKIPO (UK): https://trademarks.ipo.gov.uk
□ WIPO Global Brand Database (international): https://branddb.wipo.int
□ Common law search: Google, domain registrars, LinkedIn, App Store

Step 2 — Confusingly similar marks:
□ Phonetic similarity (sounds like)
□ Visual similarity (looks like)
□ Conceptual similarity (same meaning or connotation)
□ Same goods/services class
Rule: a mark doesn't need to be identical to infringe — "likelihood of confusion" is the test

Step 3 — Domain availability:
□ [name].com / .io / .co available?
□ [name] on key social handles: Twitter, LinkedIn, Instagram, YouTube?
□ Similar domains that could cause confusion?

Step 4 — Risk assessment:

🔴 HIGH RISK — Do not proceed without legal opinion:
- Identical mark in same class, registered and in use
- Famous mark (even different class — dilution risk)
- Owner is litigious (check PACER/TTAB records)

🟡 MEDIUM RISK — Legal opinion recommended:
- Similar mark in related class
- Mark registered but possibly abandoned (no use for 3+ years)
- Common law use without registration

🟢 LOW RISK — Proceed with monitoring:
- No similar marks found in same class or related classes
- Prior marks in clearly different industries

Output: risk rating + specific marks found + recommendation.
Attorney review required before finalising the name or filing.
```

### Freedom to operate (FTO) analysis

```
Conduct a freedom-to-operate analysis for [product/feature].

Product description: [describe what the product does technically]
Technology involved: [key technical components — algorithms, methods, hardware]
Jurisdiction: [US / EU / global]
Launch timeline: [X months to launch]

FTO analysis process:

Step 1 — Define the product precisely:
[Describe the specific technical implementation, not the marketing description]
[List the key technical steps or components that might be patented by others]

Step 2 — Prior art search (to find relevant patents):
Search tools:
- Google Patents: patents.google.com
- USPTO Patent Full-Text: patents.uspto.gov
- Espacenet (EP/WO): worldwide.espacenet.com
- Lens.org (free, comprehensive)

Search terms to use:
- Technical terms describing the method/product
- Inventor names at key competitors
- Assignee names (competitor companies)
- CPC classification codes relevant to your technology

Step 3 — Claim analysis for relevant patents:
For each potentially relevant patent:
□ Is it in force? (check expiry — priority date + 20 years = max term)
□ Has it been assigned or licensed? (check USPTO assignments)
□ Read the independent claims: do they cover what we do?
□ File history (prosecution history): any claim limitations added to overcome prior art?

Step 4 — FTO conclusion:

Clear: No in-force patents with claims covering the product as designed
Design around: One or more patents with overlapping claims — modification may achieve FTO
Licence required: Patent covers the product, design-around not practical
Opinion needed: Uncertainty requires qualified patent counsel's written opinion

⚠️ FTO analysis does not guarantee freedom from suit — it assesses identified risk.
Unknown patents (unpublished applications) may exist for up to 18 months.

Summarise: identified patents, claim mapping, risk rating, recommended next steps.
ATTORNEY REVIEW REQUIRED before relying on any FTO conclusion.
```

### Open source licence compliance

```
Conduct an open source licence compliance review for [product].

Product type: [commercial SaaS / on-prem software / internal tool / open source project]
Distribution method: [SaaS (no binary distribution) / binary/app download / source release]
Known OSS dependencies: [list — or "identify from package manifest"]

Open source licence risk matrix:

PERMISSIVE (safe for commercial products):
- MIT, BSD-2, BSD-3, Apache 2.0, ISC, CC0
- Requirements: attribution in documentation (usually)
- Risk for SaaS: minimal
- Risk for binary distribution: include licence text

WEAK COPYLEFT (review required):
- LGPL 2.1, LGPL 3.0: safe if used as a library (not modified), dynamic linking preferred
- MPL 2.0: file-level copyleft — modified MPL files must be released, but you can combine with proprietary code
- EPL 2.0: similar to MPL, review carefully for plugins/modules
- Risk for SaaS: generally low (no distribution)
- Risk for binary distribution: static linking may trigger copyleft; legal review needed

STRONG COPYLEFT (red flag for commercial products):
- GPL 2.0, GPL 3.0: any distribution of software incorporating GPL code triggers copyleft
- AGPL 3.0: extends GPL to SaaS — if users access your SaaS, you may need to release source
- Risk for SaaS with AGPL: HIGH — most enterprise vendors prohibit AGPL use

COMMERCIAL LICENCES (verify individually):
- Business Source Licence (BUSL): converts to OSS after X years, commercial use may require licence
- Commons Clause: adds commercial use restriction to permissive base licence
- Server Side Public Licence (SSPL): MongoDB's AGPL-like licence, very broad

OSS licence audit steps:
□ Run npm audit / pip-licenses / cargo-license / go-licenses to list all dependencies + licences
□ Identify any GPL/AGPL/SSPL dependencies
□ For each: is it linked statically or dynamically? Is it modified?
□ Check if vendor offers a commercial licence (dual-licence model)
□ Document findings and obtain legal sign-off before launch

Output: licence inventory table + flagged high-risk dependencies + recommended actions.
```

### IP portfolio summary

```
Summarise the IP position for [company] for [purpose].

Purpose: [fundraising / M&A diligence / internal audit / licensing]
Assets to summarise: [trademarks / patents / copyrights / trade secrets / domain names]

IP portfolio table:

TRADEMARKS:
| Mark | Jurisdiction | Class | Registration # | Status | Expiry | Owner |
|---|---|---|---|---|---|---|
| [mark] | [US/EU/UK] | [class] | [#] | Registered/Pending | [date] | [entity] |

PATENTS:
| Title | Application # | Patent # | Priority Date | Expiry | Status | Assignee |
|---|---|---|---|---|---|---|
| [invention] | [#] | [#] | [date] | [date] | Granted/Pending | [entity] |

DOMAINS:
| Domain | Registrar | Expiry | Auto-renew |
|---|---|---|---|
| [domain] | [registrar] | [date] | Yes/No |

IP OWNERSHIP CHAIN:
□ All IP assigned to the operating entity (not held by founders personally)?
□ Founder IP assignment agreements executed?
□ Employee and contractor PIIAs in place?
□ Any IP licensed from third parties that is material to the business?

GAP ANALYSIS:
- Core brand registered in all operating jurisdictions? [YES / NO — [missing jurisdictions]]
- Core product methodology patented or patent-pending? [YES / NO]
- Trade secret protection programme in place? [YES / NO]

Generate the IP portfolio summary for my company.
```

## Example

**User:** We're launching a SaaS product called "Axiom." Is this name safe to use?

**Claude's clearance process:**

"Axiom" is a common English word, so there will be prior registrations — the question is whether any are in your product's class and geography.

**Immediate searches to run (takes 30 min):**

1. **USPTO TESS:** Search "AXIOM" in Class 42 (SaaS, software as a service) and Class 35 (business services). Also search Classes 9 (software), 38 (communications), 41 (education).

2. **What you'll find:** There are multiple AXIOM registrations in the USPTO. You'll see Axiom Data (data analytics), Axiom Law (legal services), Axiom Health, and others. The key question is: which ones overlap with your specific goods/services description?

3. **Key risk factors for "Axiom":**
   - If your product overlaps with any existing Class 42 registration → medium-high risk
   - If Axiom Law (legal SaaS) is in your space → risk (same class, similar buyer)
   - If your product is clearly in a different vertical (e.g. healthcare vs. developer tools) → lower risk

4. **Domain check:** axiom.com is taken. Check axiom.io, axiomhq.com (already taken by an analytics company), tryaxiom.com, getaxiom.io.

**Preliminary risk assessment (before legal search):**
🟡 MEDIUM — "Axiom" is a dictionary word with many existing marks. A qualified trademark attorney should conduct a full clearance search before you invest in branding. Cost: $500-1,500 for a professional clearance opinion.

**Alternative names to consider if Axiom has conflicts:**
Names that may have clearer trademark space: check availability of [name + your category] combinations, or coined words (like Axiomix, Axiora) which have stronger trademark protection.

*Attorney review required before finalising. Do not launch marketing campaigns until clearance is confirmed.*

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
