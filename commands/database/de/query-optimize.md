---
description: Analysiere eine langsame oder problematische SQL-Abfrage und erstelle eine optimierte Version mit Erklärung
argument-hint: "[SQL-Abfrage oder Dateipfad]"
---
Du bist ein Experte für die Optimierung von Datenbankabfragen. Analysiere und optimiere die folgende Abfrage: $ARGUMENTS

Wenn $ARGUMENTS ein Dateipfad ist, lese die Datei. Wenn es rohes SQL ist, verwende es direkt.

Führe die folgende Analyse durch:

1. Analysiere die Abfragestruktur:
   - Identifiziere alle Tabellen, Joins, Subqueries, CTEs und Window Functions.
   - Ordne WHERE-, GROUP BY-, ORDER BY- und HAVING-Klauseln.
   - Beachte implizite Typkonvertierungen oder Funktionsaufrufe auf indizierten Spalten, die eine Indexnutzung verhindern würden.

2. Identifiziere Leistungsprobleme:
   - Vollständige Tabellendurchsätze (fehlender Index oder Index wird nicht verwendet aufgrund von Funktionsverhüllung).
   - Kartesische Produkte oder unbeabsichtigte Cross Joins.
   - N+1-Muster, ausgedrückt als korrelierte Subqueries.
   - Redundante Subqueries, die in CTEs oder JOINs hoisted werden können.
   - Aggregationen über große ungefilterte Mengen.
   - SELECT *, wenn bestimmte Spalten ausreichen.
   - Nicht-sargable Prädikate (z. B. `WHERE YEAR(created_at) = 2024` statt eines Bereichs).

3. Erstelle eine optimierte Abfrage:
   - Schreibe um, um sargable zu sein, wo Prädikate derzeit nicht-sargable sind.
   - Ersetze korrelierte Subqueries mit JOINs oder Window Functions, wo angemessen.
   - Verschiebe Filter so früh wie möglich (Predicate Pushdown).
   - Verwende Covering-Index-Hinweise in Kommentaren, wo ein Index einen Tabellenabruf eliminieren würde.
   - Bewahre exakte Semantik – das Ergebnis muss identisch sein.

4. Zeige einen Diff zwischen ursprünglicher und optimierter Version.

5. Erkläre jede Änderung in einer Aufzählungsliste, einschließlich der erwarteten Auswirkung (z. B. „eliminiert seq scan auf orders, geschätzter 10-100x Reduktion der untersuchten Zeilen").

6. Liste alle Indizes auf, die zur Unterstützung der optimierten Abfrage erstellt werden sollten, mit der genauen CREATE INDEX-Anweisung.

Gebe die angenommene Datenbank-Engine (PostgreSQL, MySQL, SQLite, MSSQL, etc.) basierend auf erkannter Syntax an. Passe Empfehlungen entsprechend an.
