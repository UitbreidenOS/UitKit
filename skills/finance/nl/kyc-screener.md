---
name: kyc-screener
description: "KYC/AML screening: documentenparsing, uittreksel begunstigden, regelgrid evaluatie, PEP/sanctionschecks, gapaanduiding en escalatieroutering"
---

# KYC Screener Vaardigheid

## Wanneer activeren

- Onboarding van nieuw bedrijfsklant en nodig KYC-voltooiing
- Analyse van entiteitsdocumenten (oprichtingsartikelen, trustdocumenten, aandeelhouderregister)
- Identificatie van begunstigden en controle tegen PEP/sanctieslijsten
- Evaluatie van KYC-pakket klant tegen uw compliancechecklist
- Routering van onvolledige of hoog-risicozaken voor uitgebreide due diligence

## Wanneer NIET gebruiken

- Vervanging van licentiegebonden complianceofficier-ondertekening op hoog-risicoklanten
- Realtime transactiemonitoring (AML) — benodigt gedediceerde software
- Formale sanctieconformiteit voor financiële instellingen — vereist gespecialiseerde juridische beoordeling

## ⚠️ Belangrijk

KYC-outputs moeten altijd beoordeeld en ondertekend worden door gekwalificeerde complianceofficier. Claude helpt proces structureren en versnellen — vervangt geen menselijk oordeel over witwasrisico. Alle outputs dragen `[VERIFY]`.

## Instructies

### Stap 1 — Documentinname en -parsing

```
Parse dit KYC-document en extraheer alle gestructureerde gegevens:

Documenttype: [Oprichtingsartikel / Trustdocument / Aandeelhouderregister / 
              Rekeningafschrift / Nutsfactuur / Paspoort / Rijbewijs]

Document: [plak tekst of beschrijf inhoud]

Extraheer:
- Entiteitsnaam (exact wettelijk naam)
- Registratienummer
- Jurisdictie van oprichting
- Geregistreerd adres
- Datum oprichting
- Bestuurders / functionarissen (namen, functies)
- Aandeelhouders / begunstigden (naam, % eigendom)
- Uiteindelijke begunstigden (UEO > 25% drempel, of lager per uw beleid)

Markeer inconsistenties of ontbrekende informatie.
[VERIFY] geëxtraheerde gegevens tegen origineel document.
```

### Stap 2 — Bouw eigendomsstructuur

```
Maak kaart van eigendomsstructuur vanuit verstrekte documenten:

Entiteiten en eigendom:
[plak wat u hebt geëxtraheerd]

Teken eigendomsketen:
- Wie is uiteindelijk eigenaar van deze entiteit?
- Zijn er tussenliggende holdingbedrijven?
- Wie overschrijdt UEO-drempel (typisch 25%)?
- Zijn er trusts, nominale bestuurders of complexe structuren?

Markeer structuren die:
- Dragerbewijzen gebruiken (hoog risico)
- Nominale bestuurders hebben (hoog risico)
- Meerdere lagen offshore-holding betreffen (verhoogd risico)
- Geen natuurlijke persoon als UEO kunnen identificeren (kritieke gaping)

[VERIFY] eigendomsketen is volledig en traceerbaar naar natuurlijke personen.
```

### Stap 3 — Pas KYC-regelgrid toe

```
Evalueer dit KYC-pakket tegen onze vereisten:

Klanttype: [persoon / bedrijf / trust / fonds]
Risiconiveau: [standaard / medium / hoog / PEP]
Ons KYC-beleid vereist: [beschrijf vereisten of plak beleid]

Ingediende documenten:
[lijst elk document met datum en uitgever]

Voor elk vereist document markeren: ✓ Ontvangen | ✗ Ontbrekend | ⚠ Moet vernieuwd (verlopen)

Algemene KYC-checklist bedrijf:
- Oprichtingsartikel ✓/✗
- Statuten en regelgeving ✓/✗
- Bestuurderregister ✓/✗
- Aandeelhouderregister / UEO-verklaring ✓/✗
- Bewijs geregistreerd adres ✓/✗
- Geverifieerde paspoortkopieën alle UEO > 25% ✓/✗
- Adresbewijs alle UEO (< 3 maanden oud) ✓/✗
- Verklaaring brongelden / vermogensoorsprong ✓/✗
- Meest recente gecontroleerde jaarrekeningen (indien beschikbaar) ✓/✗

Genereer gaprapport met alle ontbrekende items met prioriteit (blokkerend vs. niet-blokkerend).
[VERIFY] checklist overeenkomt met vereisten uw jurisdictie.
```

### Stap 4 — PEP- en sanctiecontrole

```
Screen deze namen/entiteiten tegen risicobases:

Naamten die gescreend moeten worden: [alle bestuurders, UEO en entiteit zelf opsoumen]
Jurisdicties: [landen van oprichting en vestiging]

Controleer tegen:
- VN-sanctieslijst
- OFAC SDN-lijst (VS)
- EU Geconsolideerde Sanctieslijst
- UK HM Treasury Sancties
- [Uw jurisdictie-lijst]
- PEP (Politiek Prominente Persoon) definitie: staatshoofd, hoge regeringsfunctionaris,
  gerechtsfunctionaris, senior bestuurder staatsbedrijf, hogere militair,
  onmiddellijke familie en bekende contacten

Voor elke hit: volledige naamovereenkomst / gedeeltelijke match / geen match
Markeer gedeeltelijke matches voor uitgebreide controle.

Opmerking: Realtimescreening vereist integratie met WorldCheck, Refinitiv, Dow Jones of soortgelijk.
Claude identificeert de naamten om te screenen; screening zelf moet geverifieerde databases gebruiken.
[VERIFY] alle naamten tegen live sanctiedatabases voor onboarding.
```

### Stap 5 — Risicobeoordeling en routering

```
Gebaseerd op bovenstaande KYC-beoordeling, beoordeelpel algeheel risico:

Aanwezige risicofactoren:
[opsommen wat u gevonden hebt — jurisdictierisico, PEP, complexe structuur, etc.]

Pas risicoscoring toe:
LAAG RISICO: Standaard binnenlands bedrijf, schone screening, volledige documentatie
GEMIDDELD RISICO: Één of meer verhoogde risicofactoren — routeer naar compliancemanager
HOOG RISICO: PEP, hoog-risico-jurisdictie, complexe structuur, ongunstig mediaberich — Uitgebreide Due Diligence vereist
GEWEIGERD: Verboden bij beleid (GAFI hoog-risicolanden, sanctiesslag, geen identificeerbare UEO)

Routeringsbesluit:
- LAAG: Relatiebeheerder kan doorgaan
- GEMIDDELD: Compliancemanager controle binnen [X] werkdagen
- HOOG: Goedkeuring Senior Compliance Officer + MLRO (Money Laundering Reporting Officer) vereist
- GEWEIGERD: Besluit documenteren, verwijzen naar MLRO voor Suspicious Activity Report

[VERIFY] routeringsbesluit met complianceofficier.
```

## Voorbeeld

**Gebruiker:** We onboarden een Britse Maagdeneilanden-holdingmaatschappij met drie eigendomslagen voordat individuele UEOs worden bereikt.

**Claudes analyse:**

**Structuurrisico:** HOOG — BVI-jurisdictie + meerdere holding-lagen + nominale bestuurderpatroon.

**Benodigde documenten (aanvullend op standaard):**
- Aandeelhouderregister voor elke tussenliggende entiteit
- Notarieel gewaarmerkte UEO-verklaring voor elke laag
- Bronnen vermogen voor UEO's die 10% drempel overschrijden (niet alleen 25%)
- Verklaring bedrijfsdoel voor BVI-holdingstructuur

**PEP/sancties:** Screen alle naamten tegen OFAC + EU + VN + UK + lijsten. BVI-structuur rechtvaardigt screening tegen FinCEN eigendomsdatabase.

**Routering:** Uitgebreide Due Diligence vereist voor onboarding. Senior Compliance Officer en MLRO goedkeuring nodig. [VERIFY] alle bevindingen.

---
