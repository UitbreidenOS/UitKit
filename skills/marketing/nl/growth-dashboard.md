---
name: growth-dashboard
description: "Wekelijks groeidashboard: acquisitie-, activerings-, retentie-, omzet- en verwijzingsmetrieken met trendanalyse en commentaar voor groeiteams"
---

# Vaardigheid: Groeidashboard

## Wanneer te activeren
- Het wekelijkse groeiverslag bouwen voor de directie of het team
- AARRR-metrieken samenbrengen over acquisitie, activering, retentie, omzet en verwijzing
- Diagnosticeren welke groeihefboom deze week versus vorige week defect is
- Het narratieve commentaar schrijven bij je metrieken — niet alleen de cijfers
- Een nieuw groeidashboard ontwerpen in Looker Studio, Metabase of Notion
- De gezondheid van het experimentportfolio bijhouden naast bedrijfsmetrieken

## Wanneer NIET te gebruiken
- Diepgaande analyse van één metriek — dit is een synthese-vaardigheid, geen foutopsporingsvaardigheid
- Analytics-infrastructuur opzetten — gebruik `/analytics-tracking`
- Individuele experimenten ontwerpen — gebruik `/experiment-tracker`
- Financieel modelleren voor investeerders — gebruik de financieel-model-workflow

## Instructies

### Prompt voor wekelijks groeidashboard

```
Bouw mijn wekelijkse groeidashboard voor de week van [DATUM].

Product: [beschrijf — SaaS / marktplaats / mobiele app / e-commerce]
Fase: [pre-PMF / post-PMF / schalen]
North Star Metriek: [het ene getal dat de bedrijfsgezondheid weergeeft]

Data van deze week:

ACQUISITIE
- Nieuwe bezoekers: [N] (vs. [N] vorige week, [N] deze tijd vorige maand)
- Nieuwe aanmeldingen / leads: [N] (vs. [N] vw)
- Aanmeldingsratio (bezoekers → aanmeldingen): [X%]
- CAC per kanaal deze week: [Google: $X | Meta: $X | Organisch: $X | Verwijzing: $X]
- Betaalde uitgaven: $[X] (vs. $[X] vw)

ACTIVERING
- Nieuwe gebruikers die activeringsevent hebben voltooid: [N] / [N] nieuwe aanmeldingen = [X%] activeringsratio
- Activeringsdefinitie: [wat telt als geactiveerd — bijv. "eerste project aangemaakt"]
- Tijd tot activering (mediaan): [X uur/dagen]

RETENTIE
- DAU / WAU / MAU: [N] / [N] / [N]
- DAU/MAU-ratio (kleverigheid): [X%]
- 7-daags retentie (van cohorten van 7 dagen geleden): [X%]
- 30-daags retentie: [X%]
- Churn deze week: [N] klanten / $[X] MRR

OMZET
- MRR: $[X] (vs. $[X] vorige week)
- Nieuwe MRR: $[X]
- Expansie-MRR: $[X]
- Verloren MRR (churn): $[X]
- Netto nieuwe MRR: $[X]
- LTV:CAC-ratio: [X:1]
- Terugverdienperiode: [X maanden]

VERWIJZING
- Verwijzingsaanmeldingen deze week: [N]
- Verwijzingsratio: [verwijzingsaanmeldingen / totale aanmeldingen]: [X%]
- NPS (indien gemeten deze week): [X]

LOPENDE EXPERIMENTEN
[Vermeld actieve A/B-tests, lopende dagen, huidige lift versus controle]

---

Lever het wekelijkse groeidashboard op met:
1. Kopgetallen (deze week vs. vorige week vs. 4-weken gemiddelde)
2. Verkeerslicht-status per metriek (groen / geel / rood vs. doelstellingen)
3. Top 3 observaties — wat materieel veranderde en waarom
4. Één hypothese per negatieve trend
5. Aanbevolen acties voor volgende week
6. Experimentportfolio: welke tests afronden, welke verlengen
```

### Bouwer voor AARRR-raamwerk

```
Ontwerp een compleet AARRR-metriekenraamwerk voor [product].

Productfase: [pre-lancering / vroeg / groei / schaal]
Bedrijfsmodel: [abonnement / transactioneel / gebruik-gebaseerd / freemium]
Primair kanaal: [content / betaald / PLG / verkoop]

Bouw metrieken voor elke fase:

ACQUISITIE — Hoe vinden mensen ons?
Primaire metrieken:
- Totale nieuwe bezoekers / leads / aanmeldingen per kanaal
- CAC per kanaal (uitgaven / nieuwe klanten van dat kanaal)
- Organisch vs. betaald aandeel
- Kanaalefficiëntiescore: [conversieratio × gemiddelde LTV / CAC]

Benchmarks:
- Goede CAC-terugverdienperiode: < 12 maanden voor MKB, < 18 maanden voor mid-market
- Organisch aandeel moet in de loop der tijd groeien (niet vlak of krimpend)

ACTIVERING — Halen nieuwe gebruikers waarde?
Primaire metrieken:
- Activeringsratio: % aanmeldingen dat [aha-moment-event] voltooit
- Tijd tot activering (mediaan in dagen)
- Voltooiing aha-moment per acquisitiekanaal (organische gebruikers activeren anders dan betaalde)

Benchmarks:
- < 20% activeringsratio: groot onboardingprobleem
- 20-40%: verbeteringsmogelijkheid
- 40-60%: gezond voor complexe producten
- > 60%: sterk voor eenvoudige tools

RETENTIE — Komen gebruikers terug?
Primaire metrieken:
- D1 / D7 / D30 retentie (% gebruikers dat op die dag terugkeert)
- Wekelijkse / maandelijkse cohortretentiecurves
- DAU/MAU-kleverigheidsratio
- Functiediepte-adoptie (gebruikers die 1 functie vs. 3+ functies gebruiken)

Benchmarks:
- D7 retentie > 25%: levensvatbaar (B2C), > 40%: levensvatbaar (B2B SaaS)
- D30 > 15% (B2C), > 35% (B2B)
- DAU/MAU > 20%: betrokken product

OMZET — Monetiseren we effectief?
Primaire metrieken:
- MRR / ARR en groeipercentage (WoW, MoM)
- ARPU / ARPA (per gebruiker / per account)
- LTV (gemiddeld contract × brutomargepercentage / churnpercentage)
- LTV:CAC-ratio
- Terugverdienperiode
- Net Revenue Retention (NRR): [expansie - churn] / begin-MRR

Benchmarks:
- LTV:CAC > 3:1: gezond
- Terugverdienperiode < 12 maanden: goed, < 18 maanden: acceptabel
- NRR > 100%: expansie compenseert churn (best-in-class > 120%)

VERWIJZING — Vertellen gebruikers het aan anderen?
Primaire metrieken:
- Virale coëfficiënt: nieuwe gebruikers per bestaande gebruiker per periode
- Verwijzingsratio: % aanmeldingen via verwijzing
- NPS en promotor-percentage
- Gegenereerde recensies / casestudies

Benchmarks:
- Virale coëfficiënt > 0,5: zinvol mond-tot-mond
- > 1,0: viraliteit (zeldzaam, vaak kortdurend)
- NPS > 40: promotor-gedomineerde basis

Lever een dashboardsjabloon op voor [product] met alle 15 kernmetrieken, doelstellingen en gegevensbronnen.
```

### Generator voor groeinarratief

```
Schrijf het groeiverslag voor mijn wekelijks/maandelijks rapport.

Publiek: [CEO / board / groeiteam / volledig bedrijf]
Toon: [analytisch / managementsamenvatting / conversationeel]

Prestaties van deze periode:
- [Sleutelmetriek]: [resultaat vs. doelstelling — was het boven/onder/op doelstelling?]
- [Sleutelmetriek]: [resultaat]
- [Sleutelmetriek]: [resultaat]

Context om te verweven:
- Welke externe factoren hadden invloed op de resultaten? [seizoensgebondenheid / concurrerende actie / macro]
- Welke interne wijzigingen vonden plaats? [gelanceerde campagnes / productwijzigingen / prijswijzigingen]
- Welke experimenten zijn afgerond? [resultaten]
- Wat gaat goed? [1-2 dingen die werken]
- Wat is het risico? [1 ding dat zorgen baart]
- Focus volgende week: [de ene hefboom waaraan je trekt]

Schrijf een narratief van 200-300 woorden dat:
1. Begint met de beweging van de North Star Metriek — positief of negatief, benoem het
2. De beweging toeschrijft aan 1-2 specifieke oorzaken (niet vaag — "betaalde CAC steeg 18% omdat iOS 18-wijzigingen de Meta-signaalkwaliteit verminderden")
3. De ene metriek identificeert die er het meest toe doet deze week en waarom
4. Een concrete actie geeft — niet "we zullen monitoren" maar "we zullen X doen vóór vrijdag"
5. Eindigt met de vooruitzichten: liggen we op koers voor de maand?

Schrijf niet: "We zagen gemengde resultaten." Benoem de resultaten en neem verantwoordelijkheid.
```

### Cohortomzetanalyse

```
Analyseer mijn omzetcohorten om LTV en terugverdientijd te begrijpen.

Product: [abonnements-SaaS / transactioneel]
Cohortdefinitie: [maand van eerste betaling]
Beschikbare data: [maanden geschiedenis]

Format cohorttabel:
Maand | Begin-MRR | Maand 1 MRR | Maand 3 | Maand 6 | Maand 12 | LTV-schatting

Lever data op voor elk cohort: [plak CSV of tabel]

Analyseer:
1. Retentie per cohort — welke cohorten behouden het best en waarom?
   (Vraag: wat veranderde er in acquisitie, activering of product rond de startdatum van dat cohort?)

2. Expansieomzet — breiden overlevende klanten uit?
   NRR = (begin-MRR + expansie - churn - krimp) / begin-MRR
   NRR > 100%: elk cohort is na verloop van tijd meer waard (best-in-class: 120-140%)

3. LTV-berekening:
   Gemiddelde maandelijkse omzet per klant: $[X]
   Gemiddelde klantenlevensduur: 1 / maandelijks churnpercentage = [X maanden]
   LTV = gemiddelde maandomzet × gemiddelde levensduur × brutomarge%
   LTV = $[X] × [X] × [X%] = $[X]

4. Terugverdienperiode:
   CAC / (ARPU × brutomarge%) = [X maanden]
   Vergelijk met je gemiddelde klantenlevensduur — als terugverdientijd > levensduur, verlies je geld

5. Welk kanaal produceert de hoogste LTV-klanten?
   Verdeel LTV per acquisitiekanaal: [betaald / organisch / verwijzing / verkoop]
   Dit vertelt je waar je CAC-investering moet worden verdubbeld

Lever op: LTV per cohortgrafiek, terugverdienanalyse en vergelijkingstabel voor kanaal-LTV.
```

### Optimalisatie van kanaalmix

```
Optimaliseer mijn marketingkanaalmix voor groei.

Huidige kanaalprestaties:
| Kanaal | Uitgaven | Nieuwe klanten | CAC | Gemiddelde LTV | LTV:CAC | Terugverdientijd |
|---|---|---|---|---|---|---|
| Google Ads | $[X] | [N] | $[X] | $[X] | [X:1] | [X mnd] |
| Meta Ads | $[X] | [N] | $[X] | $[X] | [X:1] | [X mnd] |
| Content/SEO | $[X] | [N] | $[X] | $[X] | [X:1] | [X mnd] |
| Verwijzing | $[X] | [N] | $[X] | $[X] | [X:1] | [X mnd] |
| Outbound verkoop | $[X] | [N] | $[X] | $[X] | [X:1] | [X mnd] |

Totaal budget: $[X]/maand
Groeidoelstelling: [X nieuwe klanten/maand of $X nieuwe MRR]

Analyse:
1. Rangschik kanalen op LTV:CAC — wijs meer toe aan kanalen met ratio > 3:1
2. Identificeer verzadigde kanalen — als CAC maand-over-maand stijgt op een kanaal, bereik je het schaalplek
3. Identificeer ondergeïnvesteerde kanalen — organisch/verwijzing heeft vaak de beste LTV maar de laagste investering
4. Marginale economie: bij 2x uitgaven op [kanaal], wat gebeurt er met CAC? (stijgt doorgaans)
5. Minimale levensvatbare uitgaven — sommige kanalen (bijv. SEO, community) vereisen drempelinvestering om resultaten te produceren

Aanbeveling voor budgetherverdeling:
- Verhoog: [kanaal] — hoogste LTV:CAC, nog niet verzadigd
- Handhaaf: [kanaal] — presteert op doelstelling, stabiele CAC
- Verlaag: [kanaal] — stijgende CAC, LTV:CAC onder 2:1
- Experimenteer: [kanaal] — ongetest, lage kosten om te valideren

Nieuwe budgetverdeling: [tabel met voor vs. na]
Verwachte impact: [X meer klanten/maand bij huidige conversieratio's]
```

## Voorbeeld

**Gebruiker:** Hier zijn onze wekelijkse cijfers. Vertel me wat er gebeurt en wat ik moet doen. Aanmeldingen: 342 (daalde van 410 vorige week). Activering: 31% (daalde van 35%). MRR: $48.200 (gestegen met $1.100 t.o.v. vorige week). Churn: 2 klanten ($400 MRR). Betaalde uitgaven: $12.000.

**Groeidashboarduitvoer van Claude:**

**Week van [DATUM] — Groeidashboard**

**North Star: MRR $48.200 (+$1.100 WoW) — op koers**

| Metriek | Deze week | Vorige week | Trend |
|---|---|---|---|
| Aanmeldingen | 342 | 410 | -17% |
| Activeringsratio | 31% | 35% | -4pp |
| Nieuwe MRR | $1.500 | $1.800 | -17% |
| Verloren MRR | $400 | $300 | +33% |
| Netto nieuwe MRR | $1.100 | $1.500 | -27% |
| CAC (gemengd) | $35 | $29 | +21% |

**Top 3 observaties:**

1. Aanmeldingsvolume daalde 17% — met gelijkblijvende uitgaven van $12K steeg CAC van $29 naar $35. Dit is een signaalprobleem met betaalde acquisitie, geen budgetprobleem. Controleer je Google Ads-zoektermenrapporten en Meta-advertentiefrequentie — waarschijnlijk treffen we doelgroepuitputting.

2. Activering daalde 4 punten — 342 aanmeldingen × 4pp daling = ~14 minder activeringen dan verwacht. Bij onze typische conversie van activering naar betaald, is dat ~$700 at risk in de komende 30 dagen. Er is iets veranderd of kapotgegaan in de onboardingflow deze week — controleer of er UI/productwijzigingen zijn uitgerold.

3. MRR is nog steeds positief omdat expansie standhield — klanten die upgraden compenseren de vertraging van nieuwe klanten. Dit is fragiel; expansie kan het bedrijf niet dragen als de toestroom van nieuwe gebruikers blijft dalen.

**Acties voor volgende week:**
- Betaald: haal Meta-frequentierapport op; als frequentie > 4 per persoon, lanceer nieuwe creatieve set
- Activering: bekijk sessie-opnames op aanmeld → aha-moment-pad (Hotjar/FullStory) — vind de uitval
- Churn: bel de 2 churned klanten deze week; begrijp of het product, prijs of concurrent is

---
