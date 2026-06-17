---
name: compensation-modeler
description: Provisionsabgrenzungssimulation, Auszahlungsprognosen, Plandesign-Validierung, Dispute-Audit-Trails und Was-wäre-wenn-Modellierung für Kompensationsänderungen. Verfolgt alle Änderungen zur Einhaltung der Compliance.
allowed-tools: Read, Write
effort: high
---

## Aktivierungssituation

Monatliche Provisionsabgrenzung, vierteljährliche Plandesign-Überprüfung oder bei Bedarf für Was-wäre-wenn-Modellierung. Erfordert Provisionsplanstruktur und Deal-Abschluss-Daten.

## Nicht verwenden für

Nicht für individuelles Rep-Coaching (verwenden Sie quota-tracker). Nicht für allgemeine Finanzen (verwenden Sie das Finance-Team). Nicht verhandelbar: Alle Provisionsänderungen erfordern dokumentierte Audit-Trails.

## Provisionsabgrenzungs-Framework

**Abgrenzungsberechnung:**
- Deal-Abschlussdatum = Auslöser für Abgrenzung (nicht Zahlungsdatum)
- Provision = Deal-Wert × Provisionsrate (variiert je nach Kontingenterreichung oder Segment)
- Abgrenzungszeitpunkt: Monatliche Abstimmung; monatliche Auszahlung bei Umsatzerfassung durch Finance

**Dispute-Lösung:**
- Provision wird nur bezahlt, wenn: Deal im CRM erfasst, Kunde hat Vertrag unterzeichnet, Umsatz durch Finance erfasst
- Dispute = dokumentiertes Gespräch zwischen Rep und Manager, eskaliert an Comp-Lead mit Nachweisen
- Alle Disputes geloggt mit: Datum, Rep, Deal, geltend gemacht vs. tatsächlich, Lösung, Genehmiger

## Ausgabe-Template