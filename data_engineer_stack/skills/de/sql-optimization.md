# SQL-Optimierung

## Wann aktivieren

Benutzer meldet langsame Abfragen oder fordert Anleitung zur Abfrage-Optimierung an.

## Wann NICHT verwenden

Optimieren Sie nicht voreilig, ohne die Baseline-Leistung zu profilieren.

## Anweisungen

1. Analysieren Sie den Abfrage-Ausführungsplan
2. Identifizieren Sie fehlende Indizes oder Scans
3. Überprüfen Sie die Join-Reihenfolge und Kardinalitätsschätzungen
4. Empfehlen Sie Umschreibungsmuster

## Beispiel

Abfrage mit 3 Tables dauert 120 Sekunden. Ausführungsplan zeigt Full Table Scan auf „orders". Index auf (customer_id, order_date) hinzufügen. Join-Reihenfolge umordnen: kleine Tabelle zuerst. Neue Zeit: 2 Sekunden.
