---
name: dcf-model
description: "DCF valuation: gather inputs from filings, build WACC, project FCF, terminal value, sensitivity table — patterns from Anthropic financial-services"
---

> 🇩🇪 Deutsche Version. [Englische Version](../dcf-model.md).

# Skill: DCF-Modell

## Wann aktivieren
- Erstellen einer Discounted-Cash-Flow-(DCF)-Bewertung für ein Unternehmen
- Berechnung des WACC aus Eigenkapitalkosten und Fremdkapitalkosten
- Projektion des Free Cash Flows aus GuV- und Bilanzdaten
- Sensitivitätsanalyse zu Schlüsselannahmen
- Überprüfung oder Prüfung eines bestehenden DCF-Modells

## Wann NICHT verwenden
- Schnelle Back-of-the-Envelope-Bewertungen (stattdessen EV/EBITDA-Vergleichsmultiplikatoren verwenden)
- Micro-Cap- oder Pre-Revenue-Unternehmen (DCF ohne stabile Cash Flows unzuverlässig)
- Formelle Kreditgeber- oder Gerichtseinreichungen — diese erfordern einen zugelassenen Bewertungsfachmann

## Wichtiger Hinweis

Alle Modellergebnisse müssen vor der Verwendung mit einem `[VERIFY]`-Marker versehen sein. DCF-Ergebnisse sind sehr empfindlich gegenüber Annahmen — eine Änderung des WACC um 0,5% kann die Bewertung um 20-30% verändern. Formulieren Sie Ihre Annahmen immer explizit und lassen Sie sie von einem Senior-Analysten prüfen.

## Anweisungen

### Schritt 1 — Eingabedaten erfassen

```
Vor dem Erstellen des DCF diese Eingaben sammeln:

GEWINN- UND VERLUSTRECHNUNG (letzte 3-5 Jahre + Analystenprognosen):
- Umsatz
- EBITDA-Marge
- D&A (Abschreibungen)
- Investitionsausgaben (CapEx)
- Veränderungen des Betriebskapitals
- Steuersatz

BILANZ:
- Gesamtverschuldung
- Zahlungsmittel und Zahlungsmitteläquivalente
- Ausstehende Aktien

MARKTDATEN:
- Aktueller Aktienkurs
- Marktkapitalisierung
- Beta (5 Jahre monatlich, vs. S&P 500)
- Risikofreier Zinssatz (10-jährige Staatsanleiherendite)
- Eigenkapital-Risikoprämie (ERP) (aktuelle Schätzung von Damodaran verwenden: ~5,5%)
- Fremdkapitalkosten (gewichteter Durchschnittszinssatz auf bestehende Schulden)

Quellen: 10-K/10-Q-Einreichungen, Bloomberg, FactSet oder Investor Relations des Unternehmens.
```

### Schritt 2 — WACC berechnen

```
WACC-Formel:
WACC = (E/V × Ke) + (D/V × Kd × (1 - Steuersatz))

Wobei:
- E = Marktwert des Eigenkapitals
- D = Marktwert der Schulden
- V = E + D (Gesamtkapital)
- Ke = Eigenkapitalkosten (CAPM: Rf + β × ERP)
- Kd = Fremdkapitalkosten vor Steuern
- Steuersatz = Grenzsteuersatz

Beispielberechnung:
- Rf (risikofreis): 4,3% (aktueller 10J-Treasury)
- β (Beta): 1,2
- ERP (Eigenkapital-Risikoprämie): 5,5%
- Ke = 4,3% + (1,2 × 5,5%) = 10,9%
- Kd (vor Steuern): 5,2%, Steuersatz: 25%
- Kd nach Steuern = 5,2% × (1 - 0,25) = 3,9%
- Kapitalstruktur: 80% Eigenkapital, 20% Schulden
- WACC = (0,80 × 10,9%) + (0,20 × 3,9%) = 9,5%

[VERIFY] WACC vor Verwendung in Projektionen.
```

### Schritt 3 — Free Cash Flow projizieren (5 Jahre)

```
FCF = EBIT × (1 - Steuersatz) + D&A - CapEx - ΔBetriebskapital

Jahr 1-3: Basisfall (Analystenkonzens oder Unternehmensführung)
Jahr 4-5: Konservatives Abklingen Richtung langfristigem Wachstumstempo

Beispiel FCF-Überleitung:
Umsatz: 1.000M$ → 1.080M$ → 1.160M$ → 1.230M$ → 1.290M$
EBIT-Marge: 18% → 18,5% → 19% → 19% → 19%
EBIT: 180M$ → 200M$ → 220M$ → 234M$ → 245M$
Steuern (25%): 45M$ → 50M$ → 55M$ → 58,5M$ → 61M$
NOPAT: 135M$ → 150M$ → 165M$ → 175M$ → 184M$
+ D&A: 40M$ → 42M$ → 44M$ → 45M$ → 46M$
- CapEx: 60M$ → 65M$ → 70M$ → 72M$ → 74M$
- ΔBetriebskapital: 8M$ → 9M$ → 10M$ → 10M$ → 10M$
= FCF: 107M$ → 118M$ → 129M$ → 138M$ → 146M$

[VERIFY] den FCF jedes Jahres vor dem Weitermachen.
```

### Schritt 4 — Terminalwert

```
Terminalwert (Gordon-Wachstumsmodell):
TV = FCF_Jahr5 × (1 + g) / (WACC - g)

Wobei g = langfristige Wachstumsrate (BIP-Wachstum verwenden: 2-3% für reife Unternehmen)

Beispiel:
TV = 146M$ × (1 + 2,5%) / (9,5% - 2,5%)
TV = 149,65M$ / 7%
TV = 2.138M$

[VERIFY] der Terminalwert repräsentiert ein angemessenes Vielfaches des FCF Jahr 5
(typischerweise 15-25x für reife Unternehmen).
```

### Schritt 5 — Auf Barwert abzinsen

```
Barwert jedes FCF-Jahres:
Jahr 1: 107M$ / (1,095)^1 = 97,7M$
Jahr 2: 118M$ / (1,095)^2 = 98,4M$
Jahr 3: 129M$ / (1,095)^3 = 98,1M$
Jahr 4: 138M$ / (1,095)^4 = 95,6M$
Jahr 5: 146M$ / (1,095)^5 = 92,2M$
Barwert der FCFs: 482M$

Barwert des Terminalwerts: 2.138M$ / (1,095)^5 = 1.352M$

Enterprise Value (EV): 482M$ + 1.352M$ = 1.834M$

Eigenkapitalwert = EV - Nettoverschuldung (Schulden - Kasse)
Nettoverschuldung = 300M$ - 150M$ = 150M$
Eigenkapitalwert = 1.834M$ - 150M$ = 1.684M$

Pro Aktie = 1.684M$ / 85M Aktien = 19,81$

[VERIFY] implizites EV/EBITDA-Vielfaches (sollte im Bereich der vergleichbaren Unternehmen liegen).
```

### Schritt 6 — Sensitivitätstabelle

```
WACC × terminale Wachstumsrate Sensitivitätsanalyse:

          g=1,5%  g=2,0%  g=2,5%  g=3,0%  g=3,5%
WACC=8,5% 22,4$   24,1$   26,2$   28,9$   32,6$
WACC=9,0% 20,8$   22,3$   24,0$   26,2$   29,2$
WACC=9,5% 19,4$   20,7$   21,8$*  23,4$   25,8$  ← Basisfall
WACC=10,0% 18,1$  19,2$   20,4$   21,7$   23,5$
WACC=10,5% 17,0$  18,0$   19,0$   20,1$   21,6$

[VERIFY] aktueller Aktienkurs vs. implizierte Bewertungsspanne.
```

## Beispiel

**Benutzer:** DCF für ein SaaS-Unternehmen erstellen: 200M$ ARR, 75% Bruttomarge, 25% YoY-Wachstum, positiver Cash Flow.

**Erwartete Ausgabe:**
- Gesammelte Eingaben: ARR, Churn, Expansion MRR, Bruttomarge, S&M als % des Umsatzes
- WACC-Berechnung: angepasstes Beta für SaaS (typischerweise 1,1-1,4), höhere ERP für Wachstumsphase
- FCF-Projektion: ARR × netto Umsatzbindungsrate, Rule-of-40-Prüfung, FCF-Margenexpansionspfad
- Terminalwert: niedrigeres terminales Wachstum (2%) wegen Marktreife
- Sensitivität: WACC 9-13% × Wachstum 1,5-3,5%
- Ausgabe klar mit `[VERIFY]` markiert und wichtige Annahmen offengelegt

---
