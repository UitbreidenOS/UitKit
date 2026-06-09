---
description: Empfehlen Sie Indizes für eine Tabelle oder Query-Workload basierend auf Schema und Zugriffsmuster
argument-hint: "[table name, query, or schema file]"
---
Analysieren Sie das Datenbankschema und die Zugriffsmuster für: $ARGUMENTS

Wenn $ARGUMENTS ein Tabellenname ist, lokalisieren Sie sein Schema in Migrationen, ORM-Modellen oder Schema-Dateien. Wenn es sich um eine Query handelt, analysieren Sie die Zugriffsmuster dieser Query. Wenn es sich um einen Dateipfad handelt, lesen Sie ihn.

Führen Sie diese Analyse durch:

1. Kartieren Sie die aktuellen Indizes:
   - Listen Sie alle vorhandenen Indizes auf (Primary Key, Unique, Composite, Partial, Expression-basiert).
   - Identifizieren Sie redundante Indizes (von einem anderen Index präfixabgedeckt).
   - Identifizieren Sie ungenutzte oder niedrig-selektive Indizes (z. B. Boolean-Spalten, niedrig-kardinalitäts-Enums).

2. Analysieren Sie die Query-Workload:
   - Falls Queries bereitgestellt oder im Codebase auffindbar sind (ORM Query Calls, Raw SQL), extrahieren Sie ihre WHERE-, JOIN-, ORDER BY- und GROUP BY-Muster.
   - Identifizieren Sie Spalten, die wiederholt in Filterprädikaten vorkommen.
   - Beachten Sie Range-Queries, die von B-tree Indizes profitieren, versus Equality-only Queries.

3. Empfehlen Sie neue Indizes:
   - Geben Sie für jede Empfehlung an:
     a. Die exakte CREATE INDEX Anweisung (verwenden Sie CONCURRENTLY für PostgreSQL wenn angemessen).
     b. Welche Queries oder Zugriffsmuster sie abdeckt.
     c. Geschätzte Selektivitätsauswirkung (hohe/mittlere/niedrige Kardinalität).
     d. Schreib-Overhead-Kosten - Indizes, die INSERT/UPDATE-Durchsatz beeinträchtigen, müssen gekennzeichnet werden.
   - Bevorzugen Sie Composite Indizes gegenüber mehreren Single-Column Indizes, wenn das Query-Muster es rechtfertigt.
   - Erwägen Sie Partial Indizes (WHERE-Klausel) für spärliche Bedingungen (z. B. Soft-Delete-Muster, Status-Filter mit dominanten Null/Inaktiv-Werten).
   - Erwägen Sie Covering Indizes (INCLUDE-Spalten), um Table-Heap-Fetches für Hot-Read-Paths zu eliminieren.

4. Markieren Sie Indizes zum Löschen:
   - Doppelte Indizes.
   - Indizes auf Spalten, die nie in Filtern oder Joins verwendet werden.
   - Indizes, die durch einen Composite Index ersetzt werden.

5. Geben Sie einen priorisierten Aktionsplan aus: HIGH (sofortiger Gewinn, niedriges Risiko) / MEDIUM (sinnvoll, minimaler Schreib-Overhead) / LOW (marginal, unter Last evaluieren).

Geben Sie die angenommene Datenbank-Engine aus Syntax oder Config-Kontext an.
