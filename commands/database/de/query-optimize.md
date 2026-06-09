---
description: Analysieren Sie eine langsame oder problematische SQL-Abfrage und erstellen Sie eine optimierte Version mit Erklärung
argument-hint: "[SQL query or file path]"
---
Sie sind ein Experte für die Optimierung von Datenbankabfragen. Analysieren und optimieren Sie die folgende Abfrage: $ARGUMENTS

Wenn $ARGUMENTS ein Dateipfad ist, lesen Sie die Datei. Wenn es reines SQL ist, verwenden Sie es direkt.

Führen Sie die folgende Analyse durch:

1. Parse der Abfragestruktur:
   - Identifizieren Sie alle Tabellen, Joins, Subqueries, CTEs und Window Functions.
   - Erstellen Sie eine Zuordnung von WHERE-, GROUP BY-, ORDER BY- und HAVING-Klauseln.
   - Beachten Sie alle impliziten Typkonvertierungen oder Funktionsaufrufe auf indizierten Spalten, die die Indexnutzung verhindern würden.

2. Identifizieren Sie Leistungsprobleme:
   - Vollständige Tabellendurchsuchungen (fehlender Index oder Index nicht verwendet aufgrund von Funktionsverpackung).
   - Kartesische Produkte oder unbeabsichtigte Cross Joins.
   - N+1-Muster, die als korrelierte Subqueries ausgedrückt sind.
   - Redundante Subqueries, die zu CTEs oder JOINs hochgestuft werden können.
   - Aggregationen über große ungefilterte Mengen.
   - SELECT * wenn spezifische Spalten ausreichen.
   - Nicht-Sargable-Prädikate (z. B. `WHERE YEAR(created_at) = 2024` statt eines Bereichs).

3. Erstellen Sie eine optimierte Abfrage:
   - Umschreiben, um Sargable zu sein, wo Prädikate derzeit nicht Sargable sind.
   - Ersetzen Sie korrelierte Subqueries durch JOINs oder Window Functions, wo angemessen.
   - Verschieben Sie Filter so früh wie möglich (Predicate Pushdown).
   - Verwenden Sie Covering Index Hinweise in Kommentaren, wo ein Index einen Tabellenabruf überflüssig machen würde.
   - Bewahren Sie die exakte Semantik - die Ergebnismenge muss identisch sein.

4. Zeigen Sie einen Diff zwischen Original- und optimierter Version.

5. Erklären Sie jede Änderung in einer Aufzählungsliste, einschließlich der erwarteten Auswirkungen (z. B. "beseitigt seq scan auf orders, geschätzte 10-100x Reduktion der untersuchten Zeilen").

6. Listet auf, welche Indizes erstellt werden sollten, um die optimierte Abfrage zu unterstützen, mit der exakten CREATE INDEX-Anweisung.

Geben Sie die angenommene Datenbank-Engine (PostgreSQL, MySQL, SQLite, MSSQL usw.) basierend auf der erkannten Syntax an. Passen Sie die Empfehlungen entsprechend an.
