---
name: comps-analysis
description: "Vergleichsanalyse: Aufbau eines Vergleichsunternehmen-Universums, Verteilung EV/EBITDA und P/E Multiples, Anwendung auf Ziel, Bewertungs-Benchmarking"
---

# Vergleichsanalyse Kompetenz

## Wann aktivieren

- Bewertung eines Unternehmens mit Marktmultiplen (Handelscomps)
- Benchmarking einer Bewertung gegen kürzliche M&A-Transaktionen (Transaktionscomps)
- Aufbau des "Football Field" Bewertungsbereichs für ein Pitch oder eine Analyse
- Suche nach unter- oder überbewerteten Aktien im Vergleich zu Peers

## Wann NICHT verwenden

- Wenn das vergleichbare Universum zu klein ist (< 4 Unternehmen) — DCF ist zuverlässiger
- Pre-Revenue oder Early-Stage Unternehmen — Multiples sind nicht aussagekräftig
- Formale Fairness-Bewertungen — benötigen zertifizierten Bewertungsfachmann

## ⚠️ Wichtig

Alle Comps-Ausgaben müssen `[VERIFY]` vor der Verwendung tragen. Die Auswahl und Anpassung von Multiples sind Ermessensfragen — dokumentieren Sie immer explizit, warum Sie jedes Comp eingeschlossen oder ausgeschlossen haben.

## Anleitung

### Schritt 1 — Vergleichbar-Universum aufbauen

```
Bauen Sie ein Vergleichbar-Universum für [Zielunternehmen] auf.

Zielbeschreibung:
- Geschäft: [was das Unternehmen tut]
- Umsatz: $[X]M, EBITDA-Marge: [X]%
- Geografie: [Primärmärkte]
- Wachstumsrate: [X]% YoY

Screenen Sie nach Comps mit diesen Kriterien (breit starten, dann eingrenzen):
1. Gleiche Industrie/Untersektoren (SIC-Code oder GICS-Sektor)
2. Ähnliche Größe: Umsatz innerhalb 0,5x bis 2x der Zielgröße
3. Ähnliches Geschäftsmodell (SaaS vs. On-Premise; B2B vs. B2C)
4. Ähnliches Wachstumsprofil (Hochwachstum vs. ausgereift)
5. Gleiche Geografie oder vergleichbare Marktdynamik

Ausschließen:
- Unternehmen in M&A-Prozessen (verzerrte Multiples)
- Konglomerate mit verschiedenem Geschäftsmix
- Unternehmen mit negativem EBITDA (sofern nicht auch Zielunternehmen)

Listen Sie 6-10 vergleichbare Unternehmen mit Begründung für Einschluss/Ausschluss auf.
[VERIFY] dass jeder Einschluss für einen CFO oder Investment Committee verteidigbar ist.
```

### Schritt 2 — Multiples verteilen

```
Für jedes vergleichbare Unternehmen sammeln:
- Unternehmenswert (EV) = Marktkapitalisierung + Netto-Schulden
- Umsatz (LTM und NTM)
- EBITDA (LTM und NTM)
- Nettoeinkommen / EPS (für P/E)
- Umsatzwachstumssatz

Berechnen:
- EV / Umsatz (LTM und NTM)
- EV / EBITDA (LTM und NTM)
- P/E (LTM und NTM)

Dann zusammenfassen:
- Mittelwert, Median, 25. Perzentil, 75. Perzentil für jedes Multiple
- Flaggen Sie Ausreißer (> 2 Standardabweichungen vom Mittelwert)
- Notieren Sie, welche Comps dem Ziel am ähnlichsten sind

[VERIFY] alle Marktdaten gegenüber einer Live-Quelle (Bloomberg, FactSet oder Unternehmensunterlagen).
```

### Schritt 3 — Auf Ziel anwenden

```
Wenden Sie die vergleichbaren Multiples auf das Zielunternehmen an:

Zielmetriken: Umsatz $[X]M, EBITDA $[Y]M (LTM)

Implizierte EV-Bereiche:
- Mit Median EV/Umsatz ([X]x): EV = $[X]M × [X]x = $[Ergebnis]M
- Mit Median EV/EBITDA ([X]x): EV = $[Y]M × [X]x = $[Ergebnis]M

Implizierter Eigenkapitalwert:
- Netto-Schulden abziehen: EV - Netto-Schulden = Eigenkapitalwert
- Pro Aktie: Eigenkapitalwert / Aktien im Umlauf

[VERIFY] implizierte Bewertung gegen DCF und alle jüngsten Transaktions-Benchmarks.
```

### Schritt 4 — Transaktionscomps (M&A Präzedenzfälle)

```
Für kürzliche M&A-Transaktionen im gleichen Sektor (letzte 3-5 Jahre):

Suchen Sie nach Deals, bei denen:
- Das Zielunternehmen in [Sektor/Industrie] war
- Dealgrößé: $[X]M bis $[Y]M EV
- Strategischer Käufer oder Finanzinvestor

Für jede Transaktion sammeln:
- Ankündigungsdatum
- Käufer und Ziel
- Dealwert (EV)
- EV/Umsatz und EV/EBITDA bei Ankündigung
- Deal-Begründung (strategische Synergien, Finanzinvestor, Notlage)
- Kontrollprämie über Handelspreis gezahlt (wenn öffentliches Ziel)

Transaktions-Multiples handeln typischerweise 20-40% über Trading Comps
(die "Kontrollprämie"). Nutzen Sie dies, um eine "Change of Control" Bewertung zu erhalten.

[VERIFY] dass jede Transaktion wirklich vergleichbar ist (nicht in Not, ähnlicher Geschäftsmix).
```

### Football Field (Bewertungszusammenfassung)

```
Konsolidieren Sie alle Bewertungsmethodologien in eine zusammenfassende Spanne:

                  Niedrig   Mitte     Hoch
DCF:              $18,5     $21,8     $27,4    ← Basisfall
Trading Comps:    $17,2     $20,3     $24,8
Transaktions-Comps: $22,0   $26,1     $31,5   ← typischerweise höchste (Kontrollprämie)
52-Wochen-Spanne: $14,2     --        $23,5   ← Markt-Referenz

Aktueller Aktienkurs: $19,81 → sitzt nahe Mittelpunkt über alle Methoden

[VERIFY] alle Eingaben vor Präsentation an Investment Committee oder Client.
```

## Beispiel

**Benutzer:** Trading Comps für ein B2B SaaS-Unternehmen aufbauen ($80M ARR, 110% NRR, 70% Bruttomarge).

**Erwartetes Comps-Universum:** 6-8 Mid-Market B2B SaaS-Unternehmen mit ähnlicher ARR-Skalierung und Wachstumsprofil. Multiples-Tabelle mit EV/ARR (LTM + NTM), EV/Bruttoprofit, NTM P/E falls zutreffend. Implizierte Bewertungsspanne. Anmerkung zur Prämie, die Comps verdienen, angesichts 110% NRR.

---
