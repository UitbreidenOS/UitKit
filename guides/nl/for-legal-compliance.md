# Claude voor Juridische en Compliance Officers

Alles wat een interne jurist, General Counsel of Compliance Officer nodig heeft om AI-versterkte contractreview, regelgevende compliance, privacyprogramma's en juridisch onderzoek uit te voeren in Claude Code.

---

## Voor wie is dit

Je bent interne juridisch adviseur, compliance officer, DPO of GC wiens taak het is om het bedrijf te beschermen tegen juridische risico's, operaties compliant te houden met regelgeving en stakeholders snel en nauwkeurig te adviseren. Je bent voortdurend onderbezet ten opzichte van het volume juridisch werk, en je besteedt te veel tijd aan contracttriage, bewijsverzameling en onderzoek dat versneld zou kunnen worden.

**Voor Claude Code:** 60-90 minuten om een standaard NDA te reviewen. Een halve dag om een compliance-gapanalyse te produceren. Dagen om een nieuwe juridische vraag in meerdere rechtsgebieden te onderzoeken. Maanden om voor te bereiden op een SOC2-audit.

**Daarna:** Eerste NDA-review in 5 minuten. Compliance-verplichtingenregister in 20 minuten. Onderzoeksmemo over meerdere rechtsgebieden in 30 minuten. SOC2-bewijs-checklist en gapanalyse in 45 minuten.

**Wat Claude niet vervangt:** Juridisch oordeel, gelicenseerd juridisch advies, gerechtelijke stukken en elk document dat ondertekend en extern verzonden wordt zonder menselijke review.

---

## Installatie in 30 seconden

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

## Jouw Claude Code juridische stack

### Skills (slash-commando's)

| Skill | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/contract-review` | ROOD/GEEL/GROEN-contractanalyse: risicomarkeringen, ontbrekende clausules, verbeteringsuggesties | Elk contract voor ondertekening |
| `/nda-review` | NDA-triage: type, reikwijdte, rode vlaggen, juridische-review-markering | NDA-wachtrij triage |
| `/gdpr-expert` | AVG-compliance: Artikel-voor-Artikel analyse, rechtsgrondslag, AVG-verwerkersovereenkomst-vereisten | Elke AVG-vraag of nieuwe verwerkingsactiviteit |
| `/soc2-compliance` | SOC2 Type II: beheersingsmaatregelen-mapping, beweisvereisten, gapanalyse | SOC2-auditvoorbereiding |
| `/privacy-pia` | Privacy Impact Assessment: risicoscoring, mitigatie, DPIA-uitvoer | Nieuwe producten of hoog-risico verwerking |
| `/eu-ai-act` | EU AI Act: risicoklassificatie, verboden toepassingen, compliance-verplichtingen | Elk AI-systeem ingezet in de EU |
| `/iso27001` | ISO 27001:2022 gapanalyse en implementatiebegeleiding | ISO-certificeringsvoorbereiding |
| `/dsar-response` | Reactie op Verzoek van Betrokkene: triage, redactie-begeleiding, antwoordconcepten | Inkomende DSAR's |
| `/compliance-tracker` | Verplichtingenregister, bewijs-checklist, deadlinetracker voor AVG/SOC2/ISO27001 | Doorlopend compliance-beheer |
| `/legal-research` | Juridische onderzoeksmemo's, jurisprudentiesamenvattingen, jurisdictievergelijkingen | Onderzoeksvragen |

### Agenten

| Agent | Model | Wanneer in te zetten |
|---|---|---|
| `general-counsel` | Opus | Complexe juridische analyse, strategisch juridisch advies, nieuwe juridische vragen |
| `ciso-advisor` | Opus | Beveiligingsgerelateerde juridische vragen: leveranciersbeveiliging, incidentrespons, interpretatie penetratietesten |

---

## Dagelijkse workflow

### Ochtend — Contractwachtrij-review (30-60 minuten)

**1. Contracttriage**
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

**2. NDA-sneltrack**
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

### Compliance-bewaking (15-30 minuten, dagelijks)

**3. Regelgevingsradar**
```
/compliance-tracker

Daily compliance check:
- Any DSARs received yesterday? Deadline tracking status?
- Any breach notification windows open?
- Any certification deadlines within 30 days?
- Any regulatory changes I should be aware of this week?
[Paste any new communications or regulatory alerts]
```

**4. DSAR-responsbeheer**
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

### Beleidsontwikkeling (variabel — 1-3 uur)

**5. Beleid aanmaken of bijwerken**
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

### Juridisch onderzoek (variabel)

**6. Onderzoeksvraag**
```
/legal-research

Research question: [plain language question]
Jurisdiction(s): [list]
Context: [why we need to know — business decision at stake]
Depth: [quick brief / standard memo / deep research]

Produce a research memo with citations. Flag [VERIFY] on every specific legal citation.
```

---

### Stakeholdersbegeleiding (op aanvraag)

**7. Snelle juridische begeleiding voor bedrijfsteams**
```
/general-counsel

A business stakeholder is asking: [describe the business question]

They need to know: [what they're trying to do]
Risk they're worried about: [what they're concerned about]

Give me a plain-English answer I can forward to them within 10 minutes.
Escalation flag: does this need a full legal memo or external counsel?
```

---

## Contractreview-workflow (dagelijkse wachtrij)

Zie voor gedetailleerde stappen [workflows/contract-review.md](../workflows/contract-review.md).

**Snelreferentie:**

```
Prioriteit 1 (zelfde dag reviewen):
- Overeenkomsten met ondertekeningsdeadline vandaag of morgen
- Elk contract met onbeperkte vrijwaring
- Elke gegevensverwerkingsovereenkomst (AVG-verwerkersovereenkomst) voor een nieuwe leverancier
- NDA met niet-standaard reikwijdtedefinities

Prioriteit 2 (binnen 3 dagen reviewen):
- Standaard leverancier-MSA's onder € 50K jaarwaarde
- Klantcontracten van een nieuw logo (sjablooncheck)
- Arbeidsaanbiedingsbrieven

Prioriteit 3 (deze week reviewen):
- Verlengingen van bestaande leveranciersovereenkomsten (vergelijk met eerdere voorwaarden)
- Partnerovereenkomsten (laag commercieel risico)
- Intern beleid of procedures

Delegeren aan externe raadsman:
- Elk contract boven € 250K (of jouw materialiteitsdrempel)
- Processtukken, schikkingsovereenkomsten
- Gereguleerde financiële of zorgovereenkomsten
- IP-overdrachten, technologieoverdrachten, exclusiviteitsovereenkomsten
```

---

## 30-dagenplan (nieuwe juridische / compliance-medewerker)

### Week 1 — Ken je verplichtingenlandschap
- Installeer alle juridische skills: `npx claudient add skills legal`
- Voer `/compliance-tracker` uit — bouw je verplichtingenregister voor elk toepasselijk kader
- Bekijk alle bestaande contracten in je standaardsjablonen — identificeer wat marktstandaard is versus maatwerk
- Identificeer openstaande DSAR's, inbreuknotificaties of auditvraagstukken — kom direct bovenop deadlines
- Lees je huidige privacybeleid en gegevensretentieplanning — kloppen ze met de werkelijke praktijk?

### Week 2 — Bouw de compliance-basislijn
- Voer `/gdpr-expert` uit op je huidige verwerkingsactiviteiten — produceer of update je RoPA (Verwerkingsactiviteitenregister)
- Voer `/soc2-compliance` of `/iso27001` uit — produceer een gapanalyse voor je doelkaders
- Breng in kaart welke leveranciers gegevensverwerkers zijn (AVG-verwerkersovereenkomst nodig) versus verwerkingsverantwoordelijken (afzonderlijke analyse)
- Produceer een risicoregister: wat zijn de top 5 juridische risico's voor dit bedrijf op dit moment?

### Week 3 — Operationaliseer
- Stel je DSAR-responsworkflow in met `/dsar-response`
- Bouw contractplaybooks voor je 3 meest voorkomende contracttypen (leverancier-MSA, klant-MSA, NDA)
- Stel je compliance-deadlinetracker in met `/compliance-tracker`
- Brief bedrijfsstakeholders over wat ze wel en niet kunnen doen zonder juridische review

### Week 4 — Proactief risicobeheer
- Produceer je eerste juridisch risicorapport voor de CEO en het bestuur
- Voer `/privacy-pia` uit op nieuwe productfeatures in ontwikkeling
- Plan kwartaalmatige toegangsreviews (in samenwerking met IT/Beveiliging)
- Stel je terugkerende compliance-agenda in: maandelijkse, kwartaalmatige, jaarlijkse deadlines

---

## Tool-integraties

### Thomson Reuters / Westlaw / LexisNexis

```
Gebruik primaire juridische databases voor onderzoeksvalidatie.
Workflow:
1. Gebruik /legal-research om de juridische vraag en het onderzoekspad te identificeren
2. Valideer specifieke citaten in Westlaw of LexisNexis
3. Plak geverifieerde jurisprudentie-uitspraken terug in Claude voor analyse en memoconcepten
4. Gebruik Claude om de memo te schrijven; gebruik Westlaw om te verzekeren dat citaten actueel zijn

Vertrouw NIET op Claude-citaten als gezaghebbend zonder verificatie in een primaire database.
```

### Contractbeheersystemen (Ironclad / DocuSign / Juro)

```
Workflow voor contractreview met een CLM:
1. Nieuw contract arriveert in je CLM
2. Exporteer als PDF/tekst
3. Voer /contract-review uit — ontvang ROOD/GEEL/GROEN-analyse
4. Voeg reviewnotities en redlines rechtstreeks toe in het CLM
5. Gebruik Claude om redline-verklaringen te genereren voor de wederpartij

Voor bulkreview (Ironclad data-export):
1. Exporteer contractmetadata als CSV
2. /contract-review: "Review this batch of contracts for expired DPAs or missing GDPR clauses"
```

### GRC-platformen (Vanta / Drata / Secureframe)

```
Gebruik Claude naast je GRC-platform, niet in plaats ervan:

Claude-sterktes: beleidsdocumentatie schrijven, vereisten uitleggen, gapanalyse, managementcommentaar
GRC-platform-sterktes: geautomatiseerde bewijsverzameling, continue bewaking, auditorportal

Workflow:
1. GRC-platform signaleert een beheersingskloof
2. /compliance-tracker: leg de beheersingsvereiste uit en suggereer een remediatiebenadering
3. /gdpr-expert of /soc2-compliance: ontwerp het beleid of de procedure om de kloof te dichten
4. Upload beleid naar GRC-platform als bewijs
```

### Notion / Confluence (juridische kennisbank)

```
Bouw je juridische kennisbank in Notion of Confluence:
1. Gebruik /legal-research om onderzoeksmemo's te produceren
2. Sla memo's op in Notion met tags: [rechtsgebied] [onderwerp] [datum]
3. Elke memo bevat: vraag, antwoord, belangrijkste citaten, [VERIFY]-markers en reviewdatum

Stel een kwartaalherinnering in om veelgebruikte memo's te reviewen en bij te werken.
Na verloop van tijd wordt dit de precedentbibliotheek van je organisatie.
```

### Slack (juridische aanvraag-intake)

```
Stel een #legal-requests Slack-kanaal in.
Claude Code kan bewaken en triageren via een webhook:

Inkomende aanvraag → Claude leest het bericht → classificeert:
  - Snelle begeleiding (< 5 min antwoord): reageer direct
  - Standaardreview (contract, NDA): stuur naar juridische wachtrij
  - Complex / nieuw: markeer voor GC-aandacht
  - Urgent (inbreuk, rechtszaak): onmiddellijke escalatie

Gebruik n8n of Make om de routing te automatiseren.
```

---

## Te volgen benchmarks

| Metriek | Doel |
|---|---|
| NDA eerste-pass reviewtijd | <10 minuten |
| Standaard contractreviewtijd (MSA) | <45 minuten |
| DSAR-bevestiging | Zelfde dag van ontvangst |
| DSAR-respons | Binnen 25 dagen (laat 5 dagen buffer voor de 30-dagendeadline) |
| Gereedheid inbreuknotificatie | Voorgebouwd sjabloon, klaar om te verzenden binnen 2 uur |
| Openstaande compliance-gaps (kritiek) | 0 |
| Openstaande compliance-gaps (niet-kritiek) | <5, allemaal met eigenaar + deadline |
| AVG-verwerkersovereenkomstdekking leveranciers | 100% van gegevensverwerkers |
| Beleidscyclus | Jaarlijks (alle beleidsregels beoordeeld en goedgekeurd) |
| Juridisch risicorapport bestuur | Kwartaalmatig |

---

## Veelgemaakte fouten (en hoe Claude Code helpt ze te vermijden)

**Fout 1: Alle contracten als even risicovol behandelen**
`/contract-review` geeft direct een algemeen risicoscore (HOOG / GEMIDDELD / LAAG). Triageer eerst, bekijk proportioneel.

**Fout 2: Compliancekaders als eenmalige projecten**
`/compliance-tracker` maakt van compliance een doorlopend verplichtingenregister met deadlines — geen eenmalige audit.

**Fout 3: Juridisch onderzoek zonder citatievalidatie**
Elke `/legal-research`-uitvoer bevat `[VERIFY]`-markers. Dit zijn aansporingen om de primaire bron te controleren — niet optioneel.

**Fout 4: Geen audittrail voor DSAR-responses**
`/dsar-response` genereert een bewijsspoor voor elk verzoek: ontvangstdatum, deadline, verzamelde data, gemaakte redacties.

**Fout 5: Begeleiding geven zonder te documenteren**
Gebruik Claude om juridische memo's te ontwerpen, zelfs voor snelle begeleidingsvragen. Een mondeling antwoord van 2 zinnen is niet vindbaar. Een korte memo wel.

---

## Bronnen

- [Aan de slag met Claude Code](../getting-started.md)
- [Contractreview-workflow](../workflows/contract-review.md)
- [AVG-expert skill](../skills/legal/gdpr-expert.md)
- [Contractreview skill](../skills/legal/contract-review.md)
- [Compliance tracker skill](../skills/legal/compliance-tracker.md)
- [Juridisch onderzoek skill](../skills/legal/legal-research.md)
- [DSAR-respons skill](../skills/legal/dsar-response.md)

---
