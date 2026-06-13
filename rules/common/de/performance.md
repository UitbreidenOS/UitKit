> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../performance.md).

# Performance-Regeln

Relevante Abschnitte in die `CLAUDE.md` des Projekts kopieren.

---

## Datenbank

- Niemals Abfragen in Schleifen ausführen — mit `IN (...)` batch-verarbeiten oder einen Join verwenden
- Abfragen, die unbegrenzte Ergebnisse zurückgeben können, immer paginieren — kein `SELECT *` ohne `LIMIT`
- Indizes hinzufügen, bevor die Abfrage in der Produktion langsam wird, nicht danach — Abfrage-Pläne während der Entwicklung analysieren
- Nur die benötigten Spalten auswählen — `SELECT *` ruft ungenutzte Daten ab und verhindert Index-Only-Scans
- Aggregation auf Datenbankebene verwenden (`COUNT`, `SUM`, `GROUP BY`) — keine Zeilen in den Speicher laden, um sie zu zählen

## API und Netzwerk

- Antworten cachen, die aufwändig zu berechnen sind und sich selten ändern — explizite TTLs setzen
- Listen-Endpunkte paginieren — maximal N Elemente pro Anfrage mit einem Cursor oder Offset zurückgeben
- Keine N+1-Abfragen — verwandte Daten mit DataLoader, `include` oder einem Join batchen
- Synchrone Aufrufe zu externen Diensten in Request-Handlern vermeiden — Queues für nicht-kritische Arbeit verwenden
- Timeouts für alle externen HTTP-Aufrufe setzen — niemals eine langsame Abhängigkeit den Server hängen lassen

## Speicher

- Keine großen Datensätze in den Speicher laden, um sie zu verarbeiten — streamen oder paginieren
- Referenzen freigeben, wenn fertig — versehentliche Closures vermeiden, die Garbage Collection verhindern
- Generatoren/Iteratoren für große Sequenzen verwenden, anstatt vollständige Listen im Speicher aufzubauen

## Messung

- Vor der Optimierung profilieren — niemals raten, wo der Engpass liegt
- Unter produktionsähnlichen Bedingungen messen — lokale Benchmarks sind irreführend
- Baseline vor Änderungen festlegen — ohne Baseline kann keine Verbesserung bestätigt werden
- Performance-Tests gehören in CI — Regressionen, die Code-Review bestehen, aber das Performance-Budget verletzen, müssen automatisch erkannt werden

---
