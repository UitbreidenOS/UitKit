---
name: forecast-builder
description: Erstellt eine 13-monatige rollierende Prognose mit drei Szenarien (best-case, commit, upside). Verfolgt Varianztrends, berücksichtigt historische Konversionsraten und zeigt Konfidenzlücken auf.
allowed-tools: Read, Write
effort: high
---

## Wann aktivieren

Wöchentlich vor dem Leadership-Sync oder monatlich für Board-Updates. Erfordert aktuelle Pipeline-Snapshot und historische Close-Raten nach Phase und Vertreter.

## Wann NICHT verwenden

Nicht für die jährliche strategische Planung (verwenden Sie den jährlichen Budget-Prozess). Nicht für einzelnes Deal-Coaching. Nicht ohne Pipeline-Datenaktualisierung in den letzten 24 Stunden.

## Prognose-Methodologie

**Drei Szenarien:**
- **Commit (60% Konfidenz):** Konservative Prognose; nur Deals mit >50% Wahrscheinlichkeit. Summe = erwarteter Close-Wert.
- **Best-Case (90% Konfidenz):** Alle Deals >30% Wahrscheinlichkeit. Obergrenze für Upside.
- **Upside:** Alles >10% Wahrscheinlichkeit. Stretch-Szenario für optimale Ausführung.

**Formel pro Szenario:**
- Für jeden offenen Deal: geschätzter Wert × Close-Wahrscheinlichkeit (nach Szenario-Schwelle) = gewichteter Wert
- Summe über alle Deals nach Phase und Vertreter
- Vergleich zum monatlichen Ziel; Varianz berechnen

**Trendverfolgung:**
- Aktuelle Prognose vs. Vorwoche vergleichen (Velocity)
- Vergleich zu YTD-Prognose (Genauigkeit)
- Varianz berechnen %: (Commit-Prognose - Vormonatlicher tatsächlicher Close) / Vormonatlicher tatsächlicher × 100

## Ausgabeformat