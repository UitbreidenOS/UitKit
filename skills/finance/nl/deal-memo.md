---
name: deal-memo
description: "Investeringsdeal-memo: marktthese, bedrijfsanalyse, financiële prognoses, risicofactoren en aanbeveling — voor VC, groeikapitaal en vroegefase-investeringen"
---

# Vaardigheid: Deal-memo

## Wanneer activeren
- Een deal-memo schrijven na een eerste of tweede gesprek met een oprichter
- Due diligence-bevindingen samenvatten in een gestructureerde investeringsaanbeveling
- Een nieuwe deal voor het eerst presenteren aan je partners of IC
- De investeringsthese opbouwen vóór de IC-memo — de deal-memo is het eerdere, meer verkennende document
- Een VC-stijl deal-memo voorbereiden voor seed-, Series A- of groeironden

## Wanneer NIET gebruiken
- Formele IC-memo's die goedkeuring van het financieel model vereisen — gebruik `/ic-memo` daarvoor
- PE buyout-analyse — deal-memoformaat verschilt (gebruik PE-specifieke sjablonen)
- Investeringstheses voor publieke markten — ander formaat en regelgevingsvereisten
- Voorlopige dealscreening — gebruik `/deal-screening` voordat je tijd investeert in een memo

## Belangrijk

Deal-memo's bevatten investeringsaanbevelingen op basis van beperkte due diligence. Markeer alle niet-geverifieerde claims als `[NIET-GEVERIFIEERD]`. Financiële prognoses zijn door oprichters aangeleverd tenzij anders vermeld — geef altijd de bron aan.

## Instructies

### Volledige deal-memo prompt

```
Schrijf een deal-memo voor een investeringsmogelijkheid.

BEDRIJF:
- Naam: [bedrijfsnaam]
- Opgericht: [jaar]
- Fase: [pre-seed / seed / Series A / Series B / groei]
- Sector: [sector]
- Hoofdkantoor: [locatie]
- Teamgrootte: [X] medewerkers

BEDRIJFSACTIVITEIT:
- Wat ze doen (1 zin): [beschrijf]
- Bedrijfsmodel: [SaaS / marktplaats / transactioneel / hardware / overig]
- Inkomstenmodel: [abonnement / gebruik / eenmalig / hybride]
- Huidige tractie: [ARR/GMV/omzet, groeipercentage, sleutelklanten]
- Productvolwassenheid: [MVP / vroeg product / volwassen]

MARKT:
- TAM: $[X]B [bron of [NIET-GEVERIFIEERD]]
- Marktgroeipercentage: [X]% [bron]
- Waarom nu: [wat er is veranderd dat dit het juiste moment maakt]
- Sleutel-tailwinds: [technologie, regelgevende, consumentengedragsverschuivingen]

INVESTERINGSVOORWAARDEN:
- Rondegrootte: $[X]M
- Onze cheque: $[X]M
- Pre-money waardering: $[X]M
- Post-money eigendom: [X]%
- Lead: [wie de ronde leidt]
- Overige investeerders: [co-investeerders, indien bekend]

FINANCIËN (door oprichter aangeleverd):
- LTM-omzet: $[X]M
- ARR (bij SaaS): $[X]M
- JoJ-groei: [X]%
- Brutomarge: [X]%
- Verbrandingssnelheid: $[X]M/maand
- Looptijd: [X] maanden
- Pad naar winstgevendheid: [beschrijving of [NIET-GEVERIFIEERD]]

TEAM:
- CEO: [naam, achtergrond in 1 zin]
- CTO: [naam, achtergrond]
- Overige sleutelmanagers: [lijst]
- Teamsterkten: [domeinexpertise, eerdere exits, technische diepgang]
- Teamhiaten: [wat ontbreekt — financiën, enterprise-verkoop, enz.]

CONCURRENTIELANDSCHAP:
- Voornaamste concurrenten: [noem 3-5]
- Differentiatie: [waarom dit bedrijf wint]
- Verdedigbaarheid: [overstapkosten / netwerkeffecten / IP / datamoat]

MIJN THESE:
- Waarom investeren: [je investeringsthese in 2-3 zinnen]
- Waarom nu: [timingmotivatie]
- Waarom wij: [wat wij bijdragen naast kapitaal]

Genereer een gestructureerde deal-memo met:
1. Bedrijfsoverzicht en wat ze doen
2. Marktmogelijkheid en waarom nu
3. Bedrijfsmodel en eenheidseconomie
4. Teambeoordeeling
5. Concurrentieanalyse en moat
6. Financieel overzicht en kernstatistieken
7. Investeringsvoorwaarden en waardering
8. Risicofactoren (top 5)
9. Due diligence-checklist (wat te verifiëren vóór IC)
10. Voorlopige aanbeveling
```

---

### Sectie marktthese

```
Schrijf de sectie Marktmogelijkheid van een deal-memo.

Bedrijf: [naam]
Categorie: [welke ruimte ze bezetten]

Marktomvang:
- TAM: $[X]B — [hoe berekend: top-down / bottom-up / [NIET-GEVERIFIEERD]]
- SAM (adresseerbaar gezien productbereik): $[X]B
- SOM (realistisch kortetermijn aandeel): $[X]M

Waarom nu (selecteer van toepassing):
[ ] Technologische verschuiving: [AI / cloud / mobiel / API-ecosysteem]
[ ] Regelgevingswijziging: [beschrijf]
[ ] Consumentengedragsverschuiving: [beschrijf]
[ ] Incumbent faalt zich aan te passen: [beschrijf]
[ ] Nieuw distributiekanaal ontsloten: [beschrijf]

Sleutel-tailwinds: [noem 3]
Sleutelrisico's voor marktthese: [noem 2]

Schrijf een sectie Marktmogelijkheid van 200 woorden die beargumenteert waarom deze markt groot, groeiend en te winnen is — en waarom dit het juiste moment is om te investeren.
```

---

### Sectie teambeoordeling

```
Schrijf de sectie Team van een deal-memo.

Oprichters:
[Per oprichter: naam, rol, eerdere bedrijven, relevante expertise, opvallende prestaties]

Beoordeel op deze dimensies:
1. Domeinexpertise: kennen ze deze ruimte goed?
2. Technische bekwaamheid: kunnen ze het product bouwen?
3. Commerciële bekwaamheid: kunnen ze verkopen en het verhaal vertellen?
4. Eerdere oprichterservaring: eerste keer of herhalend?
5. Coachingssignalen (van referenties of gesprekken): [eventuele notities]
6. Teamvolledigheid: welke sleutelrollen ontbreken?

Schrijf een evenwichtige teambeoordeling — sterkten en hiaten. Geen overdrijving. VC's die elk team als "wereldklasse" presenteren verliezen geloofwaardigheid.
```

---

### Sectie eenheidseconomie en financiën

```
Schrijf de sectie Financieel Overzicht en Eenheidseconomie.

Door bedrijf aangeleverde statistieken ([NIET-GEVERIFIEERD] tenzij gecontroleerd):
- ARR: $[X]M, groeit [X]% JoJ
- MRR: $[X]M
- Brutomarge: [X]%
- CAC: $[X] (terugverdienperiode: X maanden)
- LTV: $[X] (LTV/CAC-verhouding: [X]x)
- Verloop: [X]% maandelijks / [X]% jaarlijks bruto verloop
- Netto omzetretentie: [X]%
- Verbrandingssnelheid: $[X]M/maand
- Huidige ARR per medewerker: $[X]K

Benchmarks ter vergelijking (SaaS, seed tot Series A):
- Goede brutomarge: >70%
- Goede LTV/CAC: >3x
- Gezonde netto omzetretentie: >100%
- Efficiënte verbranding: <18 maanden looptijd bij huidige snelheid

Schrijf de sectie financieel overzicht. Markeer statistieken die onder de benchmark liggen. Noteer welke cijfers niet-geverifieerd zijn en wat we tijdens due diligence moeten bevestigen.
```

---

### Sectie risicofactoren

```
Schrijf de sectie Risicofactoren voor deze deal.

Bedrijf: [naam], [fase], [sector]

Evalueer deze risicocategorieën:
1. Marktrisico: is de markt reëel en groot genoeg?
2. Productrisico: kunnen ze het bouwen / werkt het op schaal?
3. Teamrisico: oprichter-markt fit, afhankelijkheid van sleutelpersonen
4. Concurrentierisico: kunnen incumbents het repliceren of concurrenten overnemen?
5. Technologierisico: AI-verstoring, API-afhankelijkheid, platformrisico
6. Regelgevingsrisico: hangende regelgeving die het landschap kan veranderen?
7. Fondsenwervingsrisico: hoeveel looptijd hebben ze en wat triggert de volgende ronde?
8. Klantenconcentratie: vertegenwoordigt één klant >20% van de omzet?

Voor elk risico: [Risico] | [Kans: Hoog/Gem/Laag] | [Impact: Hoog/Gem/Laag] | [Mitigant of open vraag]

Prioriteer de top 5. Markeer welke risico's opgelost moeten worden vóór we kunnen investeren.
```

---

### Due diligence-checklist

```
Genereer een pre-IC due diligence-checklist voor een [fase]-investering in [sector].

Op basis van wat ik weet:
- Bekende hiaten: [noem alles wat je niet kon verifiëren uit oprichtergesprekken]
- Hoogrisicogebieden: [welke risico's uit de risicobeoordeeling nader onderzoek vereisen]
- Benodigde referenties: [klant-, vorige werkgever-, investeerdersreferenties]

Genereer een checklist inclusief:
[ ] Financiële due diligence: [wat bij het bedrijf op te vragen]
[ ] Klantdue diligence: [welke klanten te bellen, wat te vragen]
[ ] Technische due diligence: [codebeoordeling, architectuur, beveiliging]
[ ] Juridisch/corporate: [cap table, IP-overdracht, eerdere financieringsvoorwaarden]
[ ] Referentiegesprekken: [oprichterreferenties — eerdere werkgevers, mede-oprichters, investeerders]
[ ] Marktdue diligence: [expertgesprekken, brancherapporten op te halen]
[ ] Concurrentiële due diligence: [gesprekken met mensen die alternatieven hebben geëvalueerd]
```

---

### Sectie investeringsaanbeveling

```
Schrijf de sectie Aanbeveling van een deal-memo.

Samenvatting bevindingen:
- Investeringsthese (je 2 zinnen): [beschrijf]
- Sleutelsterkten: [top 3]
- Sleutelrisico's: [top 3]
- Waardering: $[X]M pre-money, [X]x ARR / omzetmultiplier vs. comps op [X]x
- Onze voorgestelde cheque: $[X]M voor [X]% eigendom

Aanbevelingsopties:
[ ] INVESTEER — ga door naar IC met de volgende voorwaarden: [lijst]
[ ] PAS — primaire reden: [geef duidelijk aan, niet diplomatisch]
[ ] INVESTEER ONDER VOORWAARDEN — investeer alleen als: [specifieke voorwaarden vervuld]
[ ] WACHT — herbeoordeeel op: [volgende mijlpaal of datum]

Schrijf een bondige aanbevelingssectie (max. 150 woorden). Verwoord je standpunt helder. Vermijd omslachtige taal. Als je passeert, zeg dan direct waarom zodat het team ervan leert.
```

---

### Uitvoerformaat deal-memo

```markdown
# Deal-memo: [Bedrijfsnaam]
**Datum:** [Datum] | **Fase:** [Fase] | **Analist:** [Naam]
**Ronde:** $[X]M | **Onze cheque:** $[X]M | **Post-money waardering:** $[X]M

---

## TL;DR
[3 opsommingspunten: wat ze doen, waarom de markt, waarom we zouden investeren of passen]

---

## 1. Bedrijfsoverzicht
[Wat ze doen, opgericht wanneer, waar, teamgrootte, fase]

## 2. Marktmogelijkheid
[TAM/SAM/SOM, waarom nu, tailwinds]

## 3. Bedrijfsmodel & Eenheidseconomie
[Inkomstenmodel, kernstatistieken, eenheidseconomie — met [NIET-GEVERIFIEERD]-markeringen]

## 4. Teambeoordeling
[Sterkten, hiaten, oprichter-markt fit]

## 5. Concurrentieanalyse
[Concurrentiekaart, differentiatie, moat]

## 6. Financieel Overzicht
[ARR, groei, verbranding, looptijd — alle cijfers gemarkeerd als door oprichter aangeleverd tenzij geverifieerd]

## 7. Investeringsvoorwaarden & Waardering
[Rondevoorwaarden, onze cheque, eigendom, waardering vs. comps]

## 8. Risicofactoren
[Top 5 risico's met kans, impact en mitigant]

## 9. Vereiste Due Diligence Vóór IC
[Checklist van wat geverifieerd moet worden]

## 10. Aanbeveling
[Investeer / Pas / Voorwaardelijk — duidelijk verwoord met motivatie]
```

## Voorbeeld

**Gebruiker:** Ik heb net een gesprek gehad met de oprichters van een seed-fase B2B AI-bedrijf dat juridische contractbeoordeling automatiseert. 2 mede-oprichters — één voormalig BigLaw-advocaat, één engineering lead van een groot juridisch tech-bedrijf. $400K ARR, groeit 30% MoM, 4 enterprise-pilots. Haalt $3M seed op bij $15M pre-money. 18 maanden looptijd.

**Verwachte uitvoer:** Een volledige deal-memo met markt (juridische tech $X0B, timing AI-verstoring), team (uitstekende domein/technische fit, ontbrekende enterprise-verkoopmanager), eenheidseconomie (vraag om LTV/CAC-verificatie), concurrentielandschap (Harvey, Ironclad, Kira als comps), risicofactoren (klantenconcentratie in pilots, regelgevend rondom AI in juridisch advies, enterprise-verkoop GTM) en een aanbevelingssectie die duidelijk instapt of passeert met heldere motivatie. Alle door oprichter aangeleverde financiële cijfers gemarkeerd [NIET-GEVERIFIEERD].

---
