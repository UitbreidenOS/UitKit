# Data Warehousing

## Wann aktivieren

Beim Entwerfen von Star Schemas, OLAP-Tabellen, Partitionierungsstrategien oder Kostenoptimierung.

## Wann NICHT verwenden

Nicht für OLTP-Design; konzentrieren Sie sich auf analytische Workloads.

## Anweisungen

1. Dimension- und Faktentabellen entwerfen
2. Partitionierung planen (Datum, Region, Kunde)
3. Speicher und Kosten schätzen
4. Aktualisierungshäufigkeit dokumentieren

## Beispiel

Eine Sales-Warehouse mit Dimension-Tabellen (Kunden, Produkte, Zeit) und einer Fact-Tabelle (Verkäufe). Partitionierung nach Monat, Indizes auf häufige Join-Spalten.
