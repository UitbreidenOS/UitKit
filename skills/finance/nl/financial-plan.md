---
name: financial-plan
description: "Vermogensbeheer financiële planning: cashflow-analyse, pensioenprognoses, onderwijsfinanciering, erfplandoelen — voor individuen en gezinnen"
---

# Financiële Planningsvaardigheid

## Wanneer activeren
- Een uitgebreide financieel plan samenstellen voor een klant of jezelf
- Een spaarprognose voor pensioen uitvoeren (hoeveel is genoeg?)
- Onderwijsfinanciering modelleren (529-plannen, doelbedragen)
- Hiaten in verzekeringsdekking controleren
- Een checklist voor erfgoedplanning maken
- Een financieel plan stresstesten tegen marktdalingen of banenverlies

## Wanneer NIET gebruiken
- Specifieke investeringsaanbevelingen — vereist een geregistreerde financieel adviseur
- Aangiften en belastingadvies — raadpleeg een CPA of belastingjurist
- Juridische documenten (testamenten, trusts) — vereist een erfgoedadvocaat

## ⚠️ Belangrijk

Financiële prognoses zijn gebaseerd op aannames over rendementen, inflatie en levensgebeurtenissen. Alle prognoses dragen materiële onzekerheid. `[VERIFIËREN]` alle uitkomsten met een geregistreerde financieel planner. Claude helpt de analyse te structureren — het geeft geen gereglementeerd financieel advies.

## Instructies

### Stap 1 — Financieel overzicht

```
Financieel overzicht samenstellen voor:

Huidige situatie:
- Leeftijd: [X], doelpensioenleeftijd: [X]
- Huidig inkomen: $[X]/jaar bruto, $[X]/jaar netto
- Inkomsten partner (indien van toepassing): $[X]
- Huidige spaargeld:
  - 401(k)/IRA: $[X]
  - Belastbaar beleggingsrekening: $[X]
  - Contant geld/noodfonds: $[X]
  - Overig: $[X]
- Maandelijkse uitgaven: $[X] (of vermeld de voornaamste categoriëen)
- Maandelijks spaarpercentage: $[X]
- Huidge schuld: hypotheek $[X], studieleningen $[X], overige $[X]
- Eigenwaarde woning: $[X]

Doelstellingen:
- Pensionering op leeftijd [X]
- Financiering universiteit kinderen: [X] kinderen, leeftijden [X, X]
- Grote aankopen: [vermeld]
- Overige doelstellingen: [beschrijf]
```

### Stap 2 — Pensioenprognose

```
Pensioengereedheid projecteren.

Invoer:
- Huiidge leeftijd: [X], pensioenleeftijd: [X] = [X] jaren tot pensioen
- Huidig pensioenspaargeld: $[X]
- Maandelijkse bijdragen: $[X]
- Verwacht jaarrendement: [X]% (conservatief 6-7% gebruiken voor langetermijnvermogensportefeuille)
- Verwachte inflatie: 3%
- Geschatte sociale zekerheid bij pensionering: $[X]/maand (controleer SSA.gov)
- Verwachte pensioenuitgaven: $[X]/maand in dollars van vandaag

Projectie:
1. Toekomstige waarde van huidiig spaargeld bij pensionering
2. Toekomstige waarde van voortgaande bijdragen
3. Totale pensioenactiva op [pensioenleeftijd]
4. Duurzame opnamepercentage (4%-regel: activa × 4% = jaarlijks inkomen)
5. Vergelijking met doel: tekort of overschot?
6. Monte Carlo: met welke waarschijnlijkheid raken mij de middelen niet op?

[VERIFIËREN] de prognoses met een geregistreerde financieel planner.
```

### Stap 3 — Onderwijsfinanciering

```
Onderwijsfinanciering voor [X] kinderen modelleren.

Kind 1: Leeftijd [X], geschatte start hogeronderwijs: [jaar]
Doel: [openbare universiteit in-state / privé / Ivy League]
Huidge kosten (in dollars van vandaag): [in-state ~$25-30K/jaar, privé ~$60-80K/jaar, Ivy ~$85K+/jaar]
4-jaars totaal (in dollars van vandaag): $[X]
Onderwijsinflatiepercentage: ~5% per jaar

Huidig 529-saldo: $[X]
Maandelijkse bijdragen aan 529: $[X]
Verwacht rendement in 529: [X]% (typisch 6-8% aandeel-zwaar wanneer kind jong is)

Bereken:
1. Verwachte 4-jaars kosten wanneer kind aan hogeronderwijs begint
2. Verwacht 529-saldo bij start hogeronderwijs
3. Financieringsgat (indien aanwezig)
4. Maandelijkse bijdrage nodig om volledig te financieren

[VERIFIËREN] prognoses met een specialist in collegeplanning.
```

### Stap 4 — Analyse verzekeringsgaten

```
Controleer mijn verzekeringsdekking op gaten:

Huidiige dekking:
- Levensverzekering: $[X] (looptijd / heellevensverzekering, looptijd eindigt [jaar])
- Arbeidsongeschiktheidsverzekering: [X]% inkomensvervanging, [X]-daags wachttijd
- Ziektekostenverzekering: [franchize], [maximale eigen betaling]
- Woningeigenaar/huurdersverzekering: $[X] dekking
- Paraplu-verzekering: $[X] of geen
- Langetermijnverzekering: ja / nee

Profiel:
- Onderhoudsplichtigen: [X]
- Inkomen: $[X]
- Schulden: $[X]
- Activa: $[X]

Identificeren:
1. Adequaatheid levensverzekering (vuistregel: 10-12x inkomen)
2. Arbeidsongeschiktheidsdekking (heb ik genoeg?)
3. Behoefte langetermijnzorg (typisch relevant op 50+)
4. Behoefte paraplu-dekking (typisch: als nettovermogen > $500K of risico beroepsaansprakelijkheid)
```

### Stap 5 — Erfgoedplanningschecklist

```
Controleer mijn erfgoedplanningsstatus:

Huidiige documenten:
- Testament: [ja/nee/verouderd]
- Levende trust: [ja/nee]
- Volmacht: [ja/nee]
- Directief gezondheidstoestand / levenstestament: [ja/nee]
- Begunstigden aanwezig: [ja/nee, laatst bijgewerkt: jaar]
- Levensverzekering betaalbaar aan: [erfgoed / trust / benoemde begunstigde]

Gezinssituatie:
- Getrouwd: [ja/nee], echtgenoot is US-burger: [ja/nee]
- Minderjarige kinderen: [ja/nee]
- Gemengd gezin / stiefkinderen: [ja/nee]
- Onderhoudsplichtigen met speciale behoeften: [ja/nee]
- Geschat erfgoed: $[X]

Vlaggen:
1. Wat ontbreekt en waarom het belangrijk is
2. Erfbelastingrisico (federaal: erfgoeden > ~$13M; sommige staten lager)
3. Of een trust gerechtvaardigd is
4. Verkeerde begunstigdaanduidingen

[VERIFIËREN] met een erfgoedplanningsadvocaat.
```

## Voorbeeld

**Gebruiker:** Leeftijd 38, getrouwd, twee kinderen (6 en 4), huishoudinkomen $180K, $250K in 401(k), $0 in 529, hypotheek $400K, wil op 62-jarige leeftijd pensionering.

**Analyse van Claude:**

**Pensioen (24 jaar):**
$250K groeit op 7% + $1.500/maand bijdragen → ~$2,1M op 62 [VERIFIËREN]
4%-regel → $84K/jaar + sociale zekerheid → waarschijnlijk voldoende voor $120K doeluitgaven

**Onderwijs (12 en 14 jaar):**
2 kinderen × $400K (verwachte privéuniversiteit) = $800K nodig [VERIFIËREN]
$0 in 529 + 12-14 jaar → behoefte ~$1.400/maand in 529 voor beide kinderen
Of: $700/maand per kind vanaf nu

**Prioriteit pensioen vs. onderwijs:**
Beide zijn bereikbaar op huidiig inkomen. Prioriteit: eerst werkgeversgrenswaarde 401(k), dan 529, dan aanvullend pensioensparen.

**Directe acties:**
1. Deze week 529's openen voor beide kinderen
2. Levensverzekering controleren (huidig: onbekend — controleer of 10x inkomen = $1,8M is gedekt)
3. Testament en volmacht opstellen (geen document vermeld — kritisch met minderjarige kinderen)

---
