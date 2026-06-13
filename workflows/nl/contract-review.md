# Contract Review Workflow

Een herhaalbare workflow voor het beoordelen, prioriteren en verwerken van inkomende contracten — van ontvangst tot ondertekend of roodgelijnde versie, met volledige audittrail. Omvat NDA's, leveranciersovereenkomsten, klantcontracten en arbeidsaanbiedingen.

Deze workflow is ontworpen voor een intern juridisch team (één persoon tot een klein team). Pas drempelwaarden en escalatieregels aan voor de risicobereidheid en het dealvolume van jouw organisatie.

---

## Overzicht

```
Receipt → Triage → Risk classification → Review → Redline / negotiate → Escalate if needed → Sign-off → File
```

Totale doorlooptijd per contracttype:
- NDA (standaard): 10-15 minuten
- NDA (niet-standaard): 30-45 minuten
- Leveranciers-MSA (lage complexiteit): 45-60 minuten
- Leveranciers-MSA (hoge complexiteit): 2-4 uur + externe adviseur
- Klantcontract (standaardsjabloon): 20-30 minuten
- Klantcontract (onderhandeld): 1-2 uur + commerciële review

---

## Stap 1 — Ontvangst en intake

**Doel:** Elk contract is gelogd, toegewezen en heeft een deadline voordat er werk aan begint.

**Intakechecklist:**

```markdown
New Contract Intake — [CONTRACT NAME]

Received from: [name, company, email]
Received date: [date]
Contract type: [NDA / MSA / SOW / employment / lease / other]
Direction: [we are the customer / we are the vendor / mutual]
Commercial context: [deal size, relationship importance, what business decision depends on this]
Signing deadline: [date stated or implied]
Assigned to: [legal team member]
Review deadline: [signing deadline minus 2 days for internal review]
```

**Triageregel:**
- Ondertekeningsdeadline vandaag → alles neerleggen
- Ondertekeningsdeadline binnen 3 dagen → vandaag beoordelen
- Geen deadline vermeld → ga uit van 5 werkdagen; bevestig bij aanvrager
- Externe adviseur nodig → markeer en initieer onmiddellijk; wacht niet op volledige interne review

---

## Stap 2 — Snelle triage (5 minuten)

**Doel:** Bepaal hoeveel aandacht dit contract nodig heeft vóór een volledige review.

```
/nda-review

Fast triage for: [CONTRACT TYPE]
[Paste contract text]

Give me in 60 seconds:
1. Contract type: [standard template / custom / unusual]
2. Overall complexity: [low / medium / high]
3. Any immediate red flags visible without a full read: [yes / no — describe]
4. Recommended review depth: [5 min skim / 30 min review / full review + counsel]
5. Does this need external counsel? [yes / no / maybe — reason]
```

**Beslissingspoorten:**
- Eenvoudige NDA, herkenbaar standaard (CDA, MNDA)? → 10-minuten review via Stap 3A
- Complexe overeenkomst met aangepaste commerciële voorwaarden? → Volledige review via Stap 3B
- Gereguleerde overeenkomst (financiële diensten, gezondheidszorg, gereguleerde data)? → Externe adviseur onmiddellijk

---

## Stap 3A — NDA-review (snelspoor)

**Doel:** De NDA in minder dan 15 minuten beoordelen. De meeste NDA's slagen of hebben één herstelbaar probleem.

```
/nda-review

Review this NDA fully.

[Paste NDA text]

Our role: [disclosing / receiving / mutual]
Context: [why we're signing — sales conversation / vendor assessment / partnership / M&A]

Produce:
1. NDA type: mutual / one-way (which direction)
2. Term: [duration of confidentiality obligation]
3. Scope: is the definition of Confidential Information too broad? Too narrow?
4. Standard exclusions present: public information, prior knowledge, independent development, compelled disclosure — yes/no for each
5. Red flags: any unusual provisions, overly broad restrictions, perpetual obligations, non-standard remedies
6. Non-compete or non-solicitation buried in the NDA: yes/no
7. Governing law: where? Is it acceptable?
8. Recommendation: sign as-is / request one change / redline / reject / send to counsel
```

**Standaard NDA-problemen om op te letten:**
- Definitie van vertrouwelijke informatie omvat "alle gedeelde informatie" zonder uitzonderingen
- Geen standaarduitzonderingen (publiek domein, voorkennis, onafhankelijke ontwikkeling)
- Eeuwigdurende geheimhoudingsplicht (marktstandaard is 3-5 jaar)
- Beperkt ons in het aannemen van hun werknemers zonder wederkerigheid
- Jurisdictie in een staat/land waar geschillen onpraktisch voor ons zouden zijn
- Eenzijdige NDA waar wederzijds geschikter zou zijn

---

## Stap 3B — Volledige contractreview

**Doel:** Systematische dekking van alle materiële bepalingen met RED/YELLOW/GREEN-classificatie.

```
/contract-review

Full contract review for: [CONTRACT TYPE]
[Paste full contract text]

Our role: [customer / vendor / licensor / licensee]
Our concerns: [IP protection / data security / payment terms / liability / termination]
Our company: [size, stage, industry — for context on market standards]
Deal value: $[X] over [term]

Produce a structured review:

RED (blocking — must fix before signing):
For each: [clause name] | [section] | [exact clause language] | [issue] | [impact] | [suggested fix]

YELLOW (negotiate — push back but not a dealbreaker):
For each: [same format]

GREEN (acceptable — standard market terms):
[Brief summary — "payment terms, IP ownership, and governing law are all market standard"]

MISSING CLAUSES:
[List clauses that should be present but are absent]

OVERALL RISK: [HIGH / MEDIUM / LOW]
RECOMMENDATION: [sign / redline and return / reject / send to counsel]
```

**Universele checklist — controleer elk contract hierop:**

```typescript
const UNIVERSAL_CONTRACT_CHECKS = [
  // LIABILITY
  'Is liability capped? At what amount? Is the cap adequate for the deal size?',
  'Are consequential damages excluded? Any carve-outs (IP breach, data breach, fraud)?',
  'Is indemnification mutual? Capped? Any uncapped indemnification obligations?',

  // IP
  'Who owns IP created under this agreement? Work for hire?',
  'Are input materials (our data, tools, content) protected?',
  'Any IP license granted? Scope — exclusive/non-exclusive, perpetual, irrevocable?',

  // TERMINATION
  'Can either party terminate for convenience? Notice period?',
  'What happens to our data on termination? Export window? Deletion timeline?',
  'Any termination fees or lock-in beyond notice period?',

  // DATA AND PRIVACY
  'Is personal data involved? Is there a DPA or data processing annex?',
  'Sub-processor restrictions: can they use our data with third parties?',
  'Data breach notification: do they commit to notifying us? Timeframe?',

  // PAYMENT
  'Payment terms: net-30, net-60, or other?',
  'Late payment penalties: interest rate, suspension of service?',
  'Price change provisions: unilateral right to increase pricing?',
  'Auto-renewal: notice period to cancel? Sufficient lead time?',

  // GOVERNING LAW AND DISPUTE RESOLUTION
  'Governing law jurisdiction: is it acceptable? Is it the same for both parties?',
  'Dispute resolution: litigation, arbitration, or mediation first?',
  'Any class action waiver or limitation on remedies?',
]
```

---

## Stap 4 — Roodlijnen produceren

**Doel:** Een duidelijk gemarkeerde roodgelijnde versie die de wederpartij kan beoordelen en beantwoorden.

```
/contract-review

Produce a redline for this contract based on these required changes:

RED issues to fix:
[List each RED issue with the proposed replacement language]

YELLOW issues — proposed positions:
[For each YELLOW: our preferred position, acceptable fallback, walk-away point]

Additional missing clauses to add:
[List each missing clause with proposed draft language]

Format output as:
For each change:
- Section reference
- Original language: [exact quote]
- Redlined to: [replacement language]
- Rationale (1 sentence): [why we need this]

This rationale is for internal use — do not include in the document sent to the counterparty.
```

**Onderhandelingshouding per probleemtype:**

| Probleemtype | Ons verzoek | Acceptabele terugvaloptie | Opstapmoment |
|---|---|---|---|
| Onbeperkte vrijwaring | Maximum op 12 maanden vergoedingen | Maximum op dealwaarde | Geen maximum — moet worden opgelost |
| Toepasselijk recht (verkeerde jurisdictie) | Onze jurisdictie | Wederzijdse jurisdictie (bijv. Engeland) | Jurisdictie van wederpartij als ongunstig |
| IP-eigendom over onze invoer | Expliciete uitsluiting van onze data | "Behalve materialen die wij aanleveren" | Overdracht van ons IP — moet worden opgelost |
| Gegevensverwijdering bij beëindiging | 30-dagenvenster + certificering | 60-dagenvenster | Geen verwijderingsrecht — vereist DPA-aanvulling |
| Opzegtermijn automatische verlenging | 60 dagen | 30 dagen | < 14 dagen (onvoldoende opzegging) |

---

## Stap 5 — Escalatie en externe adviseur

**Escaleer naar externe adviseur wanneer:**
- Elk contract met een waarde van > $[jouw drempel, bijv. $250K] per jaar
- Elke overeenkomst met betrekking tot gereguleerde activiteiten (financiële diensten, gezondheidszorg, data als dienst)
- Aanwezig litigatierisico (vrijwaringsclaims, IP-geschil)
- Onbekende jurisdictie (buiten de expertise van je team)
- Schikkings-, fusie/overname- of financieringsdocumenten
- Elke bepaling waarover je na gebruik van Claude onzeker bent — escaleer altijd onzekerheid

**Briefing voor externe adviseur:**

```
External counsel brief for: [CONTRACT NAME]

Business context:
- What we are trying to do: [deal description]
- Why this is important: [commercial importance]
- Signing deadline: [date]
- Our preferred outcome: [sign / negotiate specific points / walk away]

What we've done:
- RED issues identified: [list]
- YELLOW issues identified: [list]
- Our proposed positions: [list]

What we need from counsel:
- [Specific legal questions — e.g. "Is this indemnification clause enforceable in California?"]
- [Risk assessment: "How much exposure does the uncapped indemnification create?"]
- [Redline review: "Are our proposed redlines market standard and reasonable?"]

Budget: [X hours at $Y/hour]
Deadline: [when we need the advice]
```

---

## Stap 6 — Goedkeuring en uitvoering

**Checklist vóór ondertekening:**

```
Before any contract is signed:
- [ ] All RED issues resolved (either fixed or signed off by authorised person with documented reason)
- [ ] YELLOW issues: either negotiated to acceptable position, or business sponsor accepted the risk in writing
- [ ] Governing law confirmed acceptable
- [ ] Signatories confirmed: do we and the counterparty have the right people signing?
  - Check signatory authority limits (who can bind the company at what dollar amount)
  - Board approval required? (check your authorisation matrix)
- [ ] Execution method: DocuSign / wet ink / notarised — confirmed correct for this jurisdiction and contract type
- [ ] Final version confirmed — no version control confusion
- [ ] Date of signing confirmed — any deferred effective date?
```

**Ondertekeningsbevoegdheidsmatrix (sjabloon — aanpassen aan jouw bedrijf):**

| Contractwaarde | Wie kan ondertekenen |
|---|---|
| < $10.000 | Afdelingshoofd |
| $10.000 - $50.000 | VP / Directeur |
| $50.000 - $250.000 | CFO of CEO |
| > $250.000 | CEO + bestuursgoed-keuring |
| Elke IP-overdracht of exclusiviteit | CEO + juridische review |
| Arbeidscontracten | HR-directeur + CEO |

---

## Stap 7 — Archiveren en bijhouden

**Doel:** Elk ondertekend contract is gearchiveerd, doorzoekbaar en heeft bijgehouden verlengings-/beëindigingsdatums.

```
Contract filing record:

Contract name: [company — contract type — date]
Counterparty: [company name, registered address, contact]
Type: [NDA / MSA / SOW / employment / other]
Effective date: [date]
Term: [X years / until terminated]
Auto-renewal: [yes / no — if yes, notice period and next renewal date]
Termination date / notice by: [date]
Value: $[X] [one-time / annual / monthly]
Governing law: [jurisdiction]
Key obligations on us: [2-3 bullets]
Key rights for us: [2-3 bullets]
Filed in: [contract management system / Notion / Google Drive — exact path]
Reviewed by: [legal team member]
```

**Verlengingsbijhouding:**
- Stel een kalenderherinnering in 90 dagen vóór elke automatische verlengingsopzegtermijn
- Stel een kalenderherinnering in 30 dagen vóór contractvervaldatum voor heronderhandeling
- Elk contract met een verlenging in de komende 6 maanden: review huidige voorwaarden en commerciële behoefte vóór verlengingsdatum

---

## Snelle referentie per contracttype

### NDA's
- Snelspoor: Stap 3A
- Doelreviewtijd: 10-15 minuten
- Meest voorkomend probleem: eeuwigdurende geheimhouding + geen standaarduitzonderingen
- Wanneer externe adviseur: als het non-concurrentiebeding, niet-wervingsbepaling of IP-bepalingen bevat die ongebruikelijk zijn voor een NDA

### Leveranciers-MSA's (SaaS, diensten, professionele diensten)
- Volledige review: Stappen 3B + 4
- Doelreviewtijd: 45-90 minuten
- Meest voorkomende problemen: gegevensverwerking (geen DPA), automatische verlenging, onbeperkte vrijwaring
- Externe adviseur: contracten > $[drempel] of gereguleerde dienst

### Klantcontracten (wij zijn de leverancier/aanbieder)
- Variantreview: vergelijken met ons standaardsjabloon
- Doelreviewtijd: 20-30 minuten voor dicht bij sjabloon; langer voor roodgelijnde versies
- Meest voorkomende problemen: klanten die zware SLA's toevoegen, IP-eigendom over ons platform, verzoeken om dataportabiliteit
- Externe adviseur: enterprise-contracten > $[drempel] of publieke sector

### Arbeidscontracten
- Beoordeel aan de hand van lokale arbeidswettelijke vereisten
- Meest voorkomende problemen: afdwingbaarheid van non-concurrentiebedingen varieert per staat/land, omvang IP-overdracht, opzegtermijnen
- Externe adviseur: altijd voor senior aanstellingen; minstens steekproef voor junior aanstellingen in nieuwe jurisdicties

---

## Hoofdchecklist contractreview

```markdown
# Contract Review: [CONTRACT NAME — DATE]

**Received:** [date]
**Deadline:** [date]
**Assigned:** [legal team member]
**Status:** [ ] Received | [ ] Triaged | [ ] Reviewed | [ ] Redlined | [ ] Negotiated | [ ] Signed | [ ] Filed

## Triage
- [ ] Contract type identified
- [ ] Signing deadline confirmed
- [ ] External counsel needed: yes / no / TBD
- [ ] Business sponsor identified and briefed

## Review
- [ ] Full /contract-review run
- [ ] RED issues: [number] identified
- [ ] YELLOW issues: [number] identified
- [ ] Missing clauses: [list]

## Redline
- [ ] RED issues: all proposed fixes drafted
- [ ] YELLOW issues: positions documented (ask / fallback / walk-away)
- [ ] Redlined version sent to counterparty
- [ ] Counterparty response received and reviewed

## Sign-off
- [ ] All RED issues resolved or accepted risk documented
- [ ] Signatory authority confirmed
- [ ] Final version confirmed — no further changes
- [ ] Signed by authorised person on our side
- [ ] Countersigned received and confirmed authentic

## Filing
- [ ] Signed copy filed in [location]
- [ ] Contract record created in tracker
- [ ] Renewal/termination calendar reminders set
- [ ] Business team notified of key obligations
```

---
