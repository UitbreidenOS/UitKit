---
name: dcf-model
description: "DCF valuation: gather inputs from filings, build WACC, project FCF, terminal value, sensitivity table — patterns from Anthropic financial-services"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../dcf-model.md).

# Skill: DCF-model

## Wanneer activeren
- Bouwen van een Discounted Cash Flow (DCF)-waardering voor een bedrijf
- Berekenen van de WACC vanuit kosten van eigen vermogen en kosten van vreemd vermogen
- Projecteren van vrije kasstroom vanuit winst-en-verliesrekening en balansgegevens
- Uitvoeren van gevoeligheidsanalyse op kernveronderstellingen
- Beoordelen of controleren van een bestaand DCF-model

## Wanneer NIET gebruiken
- Snelle ruwe schattingen (gebruik in plaats daarvan EV/EBITDA-vergelijkingsmultiples)
- Micro-cap of pre-omzetbedrijven (DCF onbetrouwbaar zonder stabiele kasstromen)
- Formele indieningen bij kredietverstrekkers of rechtbanken — deze vereisen een erkend waarderingsprofessional

## Belangrijke waarschuwing

Alle modeluitkomsten moeten een `[VERIFY]`-markering dragen vóór gebruik. DCF-uitkomsten zijn sterk gevoelig voor veronderstellingen — een wijziging van 0,5% in de WACC kan de waardering met 20-30% veranderen. Vermeld uw veronderstellingen altijd expliciet en laat ze door een senior-analist controleren.

## Instructies

### Stap 1 — Invoergegevens verzamelen

```
Vóór het bouwen van de DCF, verzamel deze gegevens:

WINST-EN-VERLIESREKENING (laatste 3-5 jaar + analistenschattingen):
- Omzet
- EBITDA-marge
- D&A (afschrijvingen en amortisaties)
- Kapitaaluitgaven (CapEx)
- Wijzigingen in werkkapitaal
- Belastingtarief

BALANS:
- Totale schulden
- Liquide middelen en equivalenten
- Uitstaande aandelen

MARKTGEGEVENS:
- Huidige aandelenkoers
- Beurskapitalisatie
- Bèta (5 jaar maandelijks, vs. S&P 500)
- Risicovrije rente (rendement 10-jaars staatsobligatie)
- Aandelenrisicopremie (ERP) (gebruik Damodaran's huidige schatting: ~5,5%)
- Kosten van vreemd vermogen (gewogen gemiddelde rente op bestaande schulden)

Bronnen: 10-K/10-Q-ingediende documenten, Bloomberg, FactSet of investor relations van het bedrijf.
```

### Stap 2 — WACC berekenen

```
WACC-formule:
WACC = (E/V × Ke) + (D/V × Kd × (1 - Belastingtarief))

Waarbij:
- E = marktwaarde van eigen vermogen
- D = marktwaarde van schulden
- V = E + D (totaal kapitaal)
- Ke = kosten van eigen vermogen (CAPM: Rf + β × ERP)
- Kd = kosten van vreemd vermogen vóór belasting
- Belastingtarief = marginaal belastingtarief

Voorbeeldberekening:
- Rf (risicovrij): 4,3% (huidige 10-jaars Treasury)
- β (bèta): 1,2
- ERP (aandelenrisicopremie): 5,5%
- Ke = 4,3% + (1,2 × 5,5%) = 10,9%
- Kd (vóór belasting): 5,2%, Belastingtarief: 25%
- Kd na belasting = 5,2% × (1 - 0,25) = 3,9%
- Kapitaalstructuur: 80% eigen vermogen, 20% schulden
- WACC = (0,80 × 10,9%) + (0,20 × 3,9%) = 9,5%

[VERIFY] WACC vóór gebruik in projecties.
```

### Stap 3 — Vrije kasstroom projecteren (5 jaar)

```
VKS = EBIT × (1 - Belastingtarief) + D&A - CapEx - ΔWerkkapitaal

Jaar 1-3: Basisscenario (analietenconsensus of managementrichtlijnen)
Jaar 4-5: Conservatieve afvlakking naar langetermijngroeipercentage

Voorbeeld VKS-overloop:
Omzet: €1.000M → €1.080M → €1.160M → €1.230M → €1.290M
EBIT-marge: 18% → 18,5% → 19% → 19% → 19%
EBIT: €180M → €200M → €220M → €234M → €245M
Belasting (25%): €45M → €50M → €55M → €58,5M → €61M
NOPAT: €135M → €150M → €165M → €175M → €184M
+ D&A: €40M → €42M → €44M → €45M → €46M
- CapEx: €60M → €65M → €70M → €72M → €74M
- ΔWerkkapitaal: €8M → €9M → €10M → €10M → €10M
= VKS: €107M → €118M → €129M → €138M → €146M

[VERIFY] de VKS van elk jaar vóór verdergaan.
```

### Stap 4 — Eindwaarde

```
Eindwaarde (Gordon Growth Model):
EW = VKS_jaar5 × (1 + g) / (WACC - g)

Waarbij g = langetermijngroeipercentage (gebruik BBP-groei: 2-3% voor volwassen bedrijven)

Voorbeeld:
EW = €146M × (1 + 2,5%) / (9,5% - 2,5%)
EW = €149,65M / 7%
EW = €2.138M

[VERIFY] de eindwaarde vertegenwoordigt een redelijk veelvoud van de VKS jaar 5
(typisch 15-25x voor volwassen bedrijven).
```

### Stap 5 — Verdisconteren naar huidige waarde

```
NCW van elk VKS-jaar:
Jaar 1: €107M / (1,095)^1 = €97,7M
Jaar 2: €118M / (1,095)^2 = €98,4M
Jaar 3: €129M / (1,095)^3 = €98,1M
Jaar 4: €138M / (1,095)^4 = €95,6M
Jaar 5: €146M / (1,095)^5 = €92,2M
NCW van VKS's: €482M

NCW van eindwaarde: €2.138M / (1,095)^5 = €1.352M

Ondernemingswaarde (EV): €482M + €1.352M = €1.834M

Aandeelhouderswaarde = EV - Nettoschuld (Schulden - Kassen)
Nettoschuld = €300M - €150M = €150M
Aandeelhouderswaarde = €1.834M - €150M = €1.684M

Per aandeel = €1.684M / 85M aandelen = €19,81

[VERIFY] impliciet EV/EBITDA-veelvoud (moet binnen de range van vergelijkbare bedrijven liggen).
```

### Stap 6 — Gevoeligheidstabel

```
WACC × terminale groeipercentage gevoeligheidsanalyse:

          g=1,5%  g=2,0%  g=2,5%  g=3,0%  g=3,5%
WACC=8,5% €22,4   €24,1   €26,2   €28,9   €32,6
WACC=9,0% €20,8   €22,3   €24,0   €26,2   €29,2
WACC=9,5% €19,4   €20,7   €21,8*  €23,4   €25,8  ← basisscenario
WACC=10,0% €18,1  €19,2   €20,4   €21,7   €23,5
WACC=10,5% €17,0  €18,0   €19,0   €20,1   €21,6

[VERIFY] huidige aandelenkoers vs. impliciete waarderingsrange.
```

## Voorbeeld

**Gebruiker:** Een DCF bouwen voor een SaaS-bedrijf: €200M ARR, 75% brutomarge, 25% YoY-groei, positieve kasstroom.

**Verwachte output:**
- Verzamelde invoer: ARR, churn, expansion MRR, brutomarge, S&M als % van omzet
- WACC-berekening: aangepaste bèta voor SaaS (typisch 1,1-1,4), hogere ERP voor groeifase
- VKS-projectie: ARR × netto omzetretentie, Rule of 40-controle, uitbreidingspad FCF-marge
- Eindwaarde: lagere terminale groei (2%) vanwege marktvolwassenheid
- Gevoeligheid: WACC 9-13% × groei 1,5-3,5%
- Output duidelijk gemarkeerd met `[VERIFY]` en kernveronderstellingen vermeld

---
