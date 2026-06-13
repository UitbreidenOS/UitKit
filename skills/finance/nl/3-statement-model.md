---
name: 3-statement-model
description: "Driegradenfinancieel model: inkomstenstaat, balans, kasstroomoverzicht — geïntegreerde modellen bouwen, statements koppelen, financiën projecteren en aannames op spanning testen"
---

# 3-Statement Model-vaardigheid

## Wanneer activeren
- Opbouw van een financieel model dat het inkomstenverklaring, balans en kasstroomverklaring integreert
- Koppeling van financiële staten zodat wijzigingen automatisch doorstromen
- Het projecteren van 3-5 jaar financiën voor planning of fundraising
- Opbouw van een werkkapitaal- en kasstroommodel
- Spanning testen van financiële aannames (bull/bear/base-scenario's)

## Wanneer NIET gebruiken
- DCF-waardering — gebruik de dcf-model-vaardigheid (die hier op voortbouwt)
- Financieel overzicht pitch deck — gebruik de pitch-deck-vaardigheid
- Maandelijkse boekhouden of reconciliatie — gebruik de quickbooks-workflow-vaardigheid
- Eenvoudige inkomstenprojecties zonder volledige balans — een eenvoudiger model volstaat

## Instructies

### Modelarchitectuur

```
Bouw een 3-statement financieel model voor [bedrijf].

Bedrijfstype: [SaaS / e-commerce / diensten / productie]
Periode: [3-jaars / 5-jaars projectie]
Beschikbare historische gegevens: [X jaar werkelijkheid of geen]
Doelstelling: [fundraising / raadsverslaglegging / interne planning / M&A]

Modelstructuur:

TABBLAD 1 — Aannames (alle invoer hier, niets hardgecodeerd in formules):
  Inkomstenrijders: [groeisnelheid / eenheidsvolume / prijs per eenheid / klantentellingen]
  Kostenrijders: [COGS%, personeelsplan, marketinguitgaven als % van inkomsten]
  Balanveronderstellingen: [DSO, DPO, voorrraaddagen, capex-schema]
  Belastingtarief: [X%]

TABBLAD 2 — Inkomstenverklaring (P&L):
  Inkomsten
    Minder: Kostprijs van verkochte goederen (COGS)
  = Brutowinst
    Minder: Bedrijfsuitgaven
      Verkoop en marketing
      Onderzoeks- en ontwikkelingsprogramma
      Algemeen en administratief
  = EBITDA
    Minder: Afschrijving en amortisatie
  = EBIT (Bedrijfsresultaat)
    Minder: Rentelasten
  = Inkomsten vóór belastingen (EBT)
    Minder: Belastingvoorziening
  = Nettowinst

TABBLAD 3 — Balans:
  Middelen:
    Huidig: Contant geld, Vorderingen, Voorraden, Vooruitbetaalde bedragen
    Niet-huidig: PP&E (netto van afschrijving), Immateriële vaste activa
  Schulden:
    Huidig: Schulden, Opgebouwde kosten, Uitgestelde inkomsten
    Niet-huidig: Langlopende schuld
  Eigen vermogen: Ingehouden winsten, Geplaatst kapitaal
  CONTROLE: Middelen = Schulden + Eigen vermogen (moet in evenwicht zijn)

TABBLAD 4 — Kasstroomverklaring:
  Bedrijfsactiviteiten (indirecte methode):
    Nettowinst
    + Afschrijving en amortisatie
    ± Veranderingen in werkkapitaal (vorderingen, schulden, voorraden)
  = Kasuitstroom uit activiteiten
  
  Investeringsactiviteiten:
    - Kapitaalsuitgaven
    ± Overnames / afstotingen
  = Kasuitstroom uit investeringen
  
  Financieringsactiviteiten:
    + Uitgifte / terugbetaling van schulden
    + Eigen vermogensuitgifte
    - Dividenden
  = Kasuitstroom uit financiering
  
  Netto verandering in contanten = Bedrijf + Investering + Financiering
  Eindkassa = Beginkassa + Netto verandering (moet kaswaarde op balans zijn)

Bouw deze modelstructuur met mijn specifieke invoer.
```

### Statementverbindingen

```
Leg uit en stel de kritieke verbindingen in het 3-statement-model in.

De 3 staten zijn geïntegreerd — een verandering in één propagatie naar alle drie.

Sleutelverbindingen om te implementeren:

P&L → Balans:
  Nettowinst → Ingehouden winsten (eigen vermogenssectie)
  Formule: Ingehouden winsten (einde) = Ingehouden winsten (start) + Nettowinst - Dividenden
  
  Afschrijving (P&L-uitgave) → PP&E-verlaging (balans)
  Formule: PP&E (einde) = PP&E (start) + Capex - Afschrijving

P&L → Kasinstroom:
  Nettowinst is het startpunt van de kasuitstroom uit bedrijfsactiviteiten
  Afschrijving toegevoegd (niet-kasbuitgave)
  
Balans → Kasinstroom (veranderingen werkkapitaal):
  Als vorderingen stijgen → gebruikt contant geld (Operating CF daalt)
  Als schulden stijgen → levert contant geld (Operating CF stijgt)
  Formule: ΔAR = AR(einde) - AR(start) → aftrekken van Operating CF
  Formule: ΔAP = AP(einde) - AP(start) → optellen bij Operating CF

Kasinstroom → Balans:
  Eindkassa op kasstroomverklaring = Contant geld op balans
  Dit is de « circulaire controle » — als ze niet overeenkomen, is het model verbroken

Capex-verbinding:
  Capex op kasinstroom → verhoogt PP&E op balans
  Afschrijving op P&L → verlaagt PP&E op balans

Balanseringcontroleformule:
  =ALS(Middelen = Schulden + Eigen vermogen, « IN EVENWICHT », « FOUT CONTROLEREN »)
  Voeg dit toe aan elke jaarkolom — als het ooit een fout toont, zoek het breekpunt.

Implementeer deze verbindingen voor mijn model in [Excel / Google Sheets].
```

### Werkkapitaalmodel

```
Bouw het werkkapitalgedeelte voor [bedrijf].

Werkkapitaal = Vlottende activa - Vlottende passiva
Sleutelrijders: DSO (vorderingen), DIO (voorraden), DPO (schulden)

Werkkapitalmetrische gegevens:
DSO (Days Sales Outstanding):
  Formule: (Vorderingen / Inkomsten) × 365
  Benchmark: SaaS: 30-45 dagen / B2B-diensten: 45-60 dagen / Onderneming: 60-90 dagen
  Model: Vorderingen = (DSO / 365) × Inkomsten

DIO (Days Inventory Outstanding) — alleen productie/e-commerce:
  Formule: (Voorraden / COGS) × 365
  Model: Voorraden = (DIO / 365) × COGS

DPO (Days Payable Outstanding):
  Formule: (Schulden / COGS) × 365
  Hoger DPO = betere kasgeldconversie (betaal leveranciers later)
  Model: Schulden = (DPO / 365) × COGS

Kasconversiecyclus = DSO + DIO - DPO
  Positief = contant geld gebonden in bewerkingen (heeft werkkapitalfinanciering nodig)
  Negatief = leveranciers financieren uw activiteiten (Amazon-stijl negatieve CCC)

Werkkapitalverandering (voor kasstroomverklaring):
  ΔWerkkapitaal = WK(einde) - WK(start)
  Toename WK = kasuitstroom (gebruikt contant geld)
  Afname WK = kasinflow (levert contant geld)

Bouw het werkkapitalschema met mijn branche-invoer.
```

### Scenarioanalyse

```
Bouw scenarioanalyse voor [financieel model].

Basisaannames: [huiidg model]
Scenario's om te modelleren: [bull / basis / bear] of [opwaarts / neerwaarts / spanning]

Scenario-ontwerpprincipes:
- Wijzig 1-3 sleutelaannames per scenario (niet alles)
- Anker op echte gebeurtenissen: « bear-case = recessie + 20% prijsdruk »
- Elk scenario moet intern consistent zijn (niet alleen inkomsten snijden)

Voor een SaaS-bedrijf:
Bull-case: 40% YoY-groei, 120% NRR, CAC blijft gelijk
  → Inkomsten: $Xm (bull) versus $Xm (basis)

Basis-case: 25% YoY-groei, 110% NRR
  → Inkomsten: $Xm

Bear-case: 15% YoY-groei, 100% NRR, CAC stijgt 20%
  → Inkomsten: $Xm, kasbreakeven vertraagd met X maanden

Spanning test: 0% groei gedurende 12 maanden (COVID-achtige schok)
  → Hoeveel maanden loopbaan tegen huiidiging branding?
  → Welke personeelsbesnoeiing is nodig om 18 maanden te overleven?

Modelstructuur met INDEX/MATCH-scenario's schakelen:
  Cel A1: Scenario-kiezer [Bull / Basis / Bear]
  Inkomstenformule: =INDEX(scenario_tabel, MATCH(A1, scenario_names, 0), MATCH(jaar, jaar_rij, 0))
  
Of gebruik benoemde bereiken in afzonderlijke scenariotabbladen en koppeling naar uitvoertabblad.

Bouw de scenario-analysestructuur voor mijn model.
```

## Voorbeeld

**Gebruiker:** Ik bouw een 3-jaarsmodel voor een B2B SaaS-bedrijf. Jaar 1 ARR: $800K, groeiend op 80% YoY. Brutowinst: 72%. Branding: $200K/maand. Hoe stel ik de P&L in?

**P&L-structuur van Claude:**

```
                    Jaar 1      Jaar 2      Jaar 3
Inkomsten (ARR)     $800K      $1,440K     $2,592K     [+80% elk jaar]
  MRR gemiddeld     $667K      $1,200K     $2,160K     [ARR ÷ 12, vereenvoudigd]

Inkomsten           $800K      $1,440K     $2,592K

COGS
  Infrastructuur    $96K       $158K       $259K       [12% van inkomsten]
  Klantensucces     $128K      $202K       $311K       [16% van inkomsten]
Total COGS          $224K      $360K       $570K       [28% van inkomsten]

Brutowinst          $576K      $1,080K     $2,022K     [72% brutowinst]

OpEx
  Verkoop en Mktg   $600K      $900K       $1,200K     [dalend als % van inkomsten]
  R&D               $480K      $600K       $720K       [personeelsgebaseerd]
  G&A               $240K      $288K       $346K       [30% groei, langzamer]
Total OpEx          $1,320K    $1,788K     $2,266K

EBITDA              ($744K)    ($708K)     ($244K)     [nadert breakeven jaar 3]

Impliciete maandelijkse branding: $62K/maand (Jaar 1), $59K/maand (Jaar 2), $20K/maand (Jaar 3)
Kontantuitputting tegen huidig tempo: [berekenen op basis van huidig kasgeldaldo]

Belangrijkste waarnemingen:
- U bereikt EBITDA-breakeven tussen jaar 3 en 4 tegen deze groeisnelheden
- Verkoop en marketing zijn uw grootste hefboom — modelleren zowel 50% als 75% van inkomstenscenarios
- Bouw personeelstabel → stuurt R&D en G&A nauwkeuriger als % van inkomsten
```

---
