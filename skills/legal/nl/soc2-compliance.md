---
name: soc2-compliance
description: "SOC 2-naleving: Trust Service Criteria mapping, controle matrix, gapanalyse, evidence collectie, Type I vs Type II gereedheid, en auditvoorbereiding voor SaaS bedrijven"
---

# SOC 2 Naleving Skill

## Wanneer activeren
- Voorbereiding op SOC 2 Type I of Type II audit
- Kaarten van controles naar Trust Service Criteria (Beveiliging, Beschikbaarheid, Vertrouwelijkheid, enz.)
- Uitvoering gapanalyse voordat auditor wordt ingehuurd
- Opbouw evidenceverzameling proces voor observatieperiode
- Bepaling welke Trust Service Criteria in uw bereik opnemen
- Reactie op ondernemingsklanten die vragen "hebben jullie SOC 2?"

## Wanneer NIET gebruiken
- GDPR of privacynaleving — gebruik gdpr-expert skill
- ISO 27001-certificering — ander raamwerk, ander auditproces
- HIPAA-naleving — vereist specialist
- Na auditafronding, hoeft u alleen controles onderhouden — dat is doorlopend GRC-werk

## Instructies

### SOC 2 gereedheidsbeoordeling

```
Beoordeel onze SOC 2-gereedheid voor [Type I / Type II].

Bedrijf: [SaaS / cloud-infrastructuur / beheerde service]
Doelauitdatum: [X maanden]
Geselecteerde Trust Service Criteria: [Beveiliging (verplicht) + welke optioneel: Beschikbaarheid / Vertrouwelijkheid / Verwerkingsintegriteit / Privacy]
Huidige beveiligingsrijpheid: [geen / basaal / middel / geavanceerd]

Type I vs Type II — kiezen gebaseerd op:
Type I: Controle-ontwerp op een moment
  - Beste voor: eerste SOC 2, snelle ondernemingsverkoop, 1-2 maand auditfase
  - Kosten: $20K-$50K auditorkosten
  - Bewijst NIET dat controles in de loop der tijd effectief werken

Type II: Ontwerp + operatieve doeltreffendheid gedurende observatievenster (min 6 maanden)
  - Beste voor: ondernemingsklanten die Type II verlangen, volwassen programma's
  - Kosten: $30K-$100K+ auditorkosten
  - Evidence moet volledige observatieperiode dekken

Gereedheidsgapanalyse per domein:

BEVEILIGING (CC1-CC9 — verplicht):

CC6 — Logische en fysieke toegang (meest mislukte criterium):
□ Multi-factor authenticatie op alle productiesystemen
□ Formeel proces voor toegangsverstrekking en ontvlechtingsproces (joiner/mover/leaver)
□ Driemaandelijks gecontroleerde toegangsbeoordelingen met evidence
□ Geen gedeelde inloggegevens in productie
□ Beheerderstoegang management (PAM) of gedocumenteerde rechtvaarding van privileges

CC7 — Systeembedrijf:
□ Vulnerabiliteitsscanning in plaats (minstens driemaandelijks)
□ Patch-beheersproces met gedocumenteerde SLA (kritisch: X dagen, hoog: Y dagen)
□ Indringerdetectie / anomaliewaarschuwing ingesteld
□ Gedocumenteerd en getest incident-responsplan

CC8 — Wijzigingsbeheer:
□ Alle productiewijzigingen gaan door gedocumenteerde goedkeuringsprocedure
□ Code review vereist voor implementatie
□ Arbeidsverdeling: ontwikkelaar kan niet zonder goedkeuring in productie implementeren
□ Gedocumenteerd noodstop-wijzigingsproces

CC9 — Risico- en leverancierbeheer:
□ Risicobeoordeling uitgevoerd en gedocumenteerd (minstens jaarlijks)
□ Leveranciersinventaris met beveiligingsindeling
□ Kritieke leveranciers hebben eigen SOC 2 of equivalent

BESCHIKBAARHEID (A1 — indien in bereik):
□ Uptime-bewaking met waarschuwing
□ Gedocumenteerd en getest rampenherstellingsplan (RTO/RPO gedefinieerd)
□ Back-upprocedures met geteste herstel
□ Capaciteitsplanningsproces

Beoordeel elke controle: ✅ In bedrijf / 🟡 Gedeeltelijk / 🔴 Gap

Resultaat: gapregister met prioriteitsclassificering en opschatveling inspanningen.
```

[Continuing with remaining sections in Dutch, matching structure...]

---
