---
name: comps-analysis
description: "Comps-analyse: bouw universum van vergelijkbare bedrijven, verdeel EV/EBITDA en P/E multiples, pas toe op doelwit, benchmarkwaardering"
---

# Comps-analyse Vaardigheid

## Wanneer activeren

- Waardering van een bedrijf met behulp van marktmultiples (trading comps)
- Benchmarking van waardering tegen recente M&A-transacties (transaction comps)
- Bouw van "football field" waarderingsbereik voor pitch of analyse
- Screenen op ondergewaardeerde of overgewaardeerde aandelen vs. peers

## Wanneer NIET gebruiken

- Wanneer het vergelijkbare universum te klein is (< 4 bedrijven) — DCF is betrouwbaarder
- Pre-inkomsten of vroegstadium bedrijven — multiples zijn niet zinvol
- Formele fairness opinions — vereisen erkende waarde-professional

## ⚠️ Belangrijk

Alle comps-outputs moeten vóór gebruik voorzien zijn van `[VERIFY]`. Multiple-selectie en aanpassing zijn oordelen — documenteer altijd expliciet waarom u elk comp hebt opgenomen of uitgesloten.

## Instructies

### Stap 1 — Bouw universum van vergelijkbare bedrijven

```
Bouw vergelijkbaar universum voor [doelbedrijf].

Doelomschrijving:
- Bedrijf: [wat het bedrijf doet]
- Inkomsten: $[X]M, EBITDA-marge: [X]%
- Geografie: [primaire markten]
- Groeipercentage: [X]% YoY

Screen naar comps met behulp van deze criteria (breed beginnen, dan verfijnen):
1. Dezelfde industrie/subsector (SIC-code of GICS-sector)
2. Vergelijkbare grootte: inkomsten binnen 0,5x tot 2x van doelgrootte
3. Vergelijkbaar bedrijfsmodel (SaaS vs. on-premise; B2B vs. B2C)
4. Vergelijkbaar groeiprofiel (hoge groei vs. volwassen)
5. Dezelfde geografie of vergelijkbare marktdynamica

Sluit uit:
- Bedrijven in M&A-processen (vervormde multiples)
- Conglomeraten met ander bedrijfsmix
- Bedrijven met negatieve EBITDA (tenzij doelwit ook)

Lijst 6-10 vergelijkbare bedrijven met motivering opname/uitsluiting.
[VERIFY] elke opname is verdedigbaar voor een CFO of investment committee.
```

### Stap 2 — Verdeel de multiples

```
Verzamel voor elk vergelijkbaar bedrijf:
- Ondernemingswaarde (EV) = Marktkapitalisatie + Netto schuld
- Inkomsten (LTM en NTM)
- EBITDA (LTM en NTM)
- Netto inkomsten / EPS (voor P/E)
- Inkomstengroeipercentage

Bereken:
- EV / Inkomsten (LTM en NTM)
- EV / EBITDA (LTM en NTM)
- P/E (LTM en NTM)

Resumeer vervolgens:
- Gemiddelde, mediaan, 25e percentiel, 75e percentiel voor elk multiple
- Markeer uitbijters (> 2 standaarddeviaties van gemiddelde)
- Noteer welke comps het meest vergelijkbaar zijn met doelwit

[VERIFY] alle marktgegevens tegen live bron (Bloomberg, FactSet, of bedrijfsdocumenten).
```

### Stap 3 — Pas toe op doelwit

```
Pas vergelijkbare multiples toe op doelbedrijf:

Doelstatistieken: Inkomsten $[X]M, EBITDA $[Y]M (LTM)

Geïmpliceerde EV-bereiken:
- Met mediaan EV/Inkomsten ([X]x): EV = $[X]M × [X]x = $[resultaat]M
- Met mediaan EV/EBITDA ([X]x): EV = $[Y]M × [X]x = $[resultaat]M

Geïmpliceerde eigenkapitaalwaarde:
- Trek netto schuld af: EV - Netto schuld = Eigenkapitaalwaarde
- Per aandeel: Eigenkapitaalwaarde / Aandelen in omloop

[VERIFY] geïmpliceerde waardering tegen DCF en alle recente transactie-benchmarks.
```

### Stap 4 — Transaction comps (M&A precedenten)

```
Voor recente M&A-transacties in dezelfde sector (afgelopen 3-5 jaar):

Zoek naar deals waar:
- Doelwit in [sector/industrie] was
- Deal grootte: $[X]M tot $[Y]M EV
- Strategische koper of financiële sponsor

Verzamel voor elke transactie:
- Aankondigingsdatum
- Koper en doelwit
- Dealwaarde (EV)
- EV/Inkomsten en EV/EBITDA bij aankondiging
- Deal-rationale (strategische synergieën, financiële sponsor, nood)
- Controlleprémie betaald boven handelskoers (als openbaar doelwit)

Transaction-multiples handelen typisch op 20-40% premie op trading comps
(de "controlleprémie"). Pas dit toe om een "change of control" waardering te krijgen.

[VERIFY] elke transactie is werkelijk vergelijkbaar (niet in nood, vergelijkbaar bedrijfsmix).
```

### Football field (waarderingssamenvatting)

```
Consolideer alle waarderingsmethodologieën in een samenvattingsbereik:

                  Laag      Midden    Hoog
DCF:              $18,5     $21,8     $27,4    ← basisgeval
Trading comps:    $17,2     $20,3     $24,8
Transaction comps: $22,0    $26,1     $31,5   ← meestal hoogste (controlleprémie)
52-weekenbereik:  $14,2     --        $23,5   ← markreference

Huidge aandelenkoers: $19,81 → zit dicht bij midden over alle methoden

[VERIFY] alle inputs vóór presentatie aan investment committee of klant.
```

## Voorbeeld

**Gebruiker:** Trading comps voor B2B SaaS-bedrijf opbouwen ($80M ARR, 110% NRR, 70% bruto marge).

**Verwacht comps-universum:** 6-8 mid-market B2B SaaS-bedrijven op vergelijkbare ARR-schaal en groeiprofiel. Multiples-tabel met EV/ARR (LTM + NTM), EV/Bruto winst, NTM P/E indien van toepassing. Geïmpliceerde waarderingsbereik. Opmerking over premie welke comps verdienen gegeven 110% NRR.

---
