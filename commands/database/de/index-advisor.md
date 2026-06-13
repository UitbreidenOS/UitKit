---
description: Indexes für eine Tabelle oder Query-Workload basierend auf Schema und Zugriffsmuster empfehlen
argument-hint: "[Tabellenname, Query oder Schema-Datei]"
---
Analysiere das Datenbankschema und Zugriffsmuster für: $ARGUMENTS

Falls $ARGUMENTS ein Tabellenname ist, lokalisiere sein Schema in Migrationen, ORM-Modellen oder Schema-Dateien. Falls es eine Query ist, analysiere die Zugriffsmuster dieser Query. Falls es ein Dateipfad ist, lese ihn.

Führe diese Analyse durch:

1. Mögliche Indizes erfassen:
   - Liste alle bestehenden Indizes auf (Primary Key, Unique, Composite, Partial, Expression-basiert).
   - Identifiziere redundante Indizes (Präfix-abgedeckt durch einen anderen Index).
   - Identifiziere ungenutzte oder niedrig-selektive Indizes (z.B. Boolean-Spalten, niedrig-Kardinalität Enums).

2. Analysiere die Query-Workload:
   - Falls Queries vorhanden sind oder im Codebase auffindbar sind (ORM Query-Aufrufe, Raw SQL), extrahiere ihre WHERE, JOIN, ORDER BY und GROUP BY Muster.
   - Identifiziere Spalten, die wiederholt in Filter-Prädikaten erscheinen.
   - Beachte Range-Queries, die von B-Tree-Indizes profitieren, vs. Gleichheits-only Queries.

3. Empfehle neue Indizes:
   - Für jede Empfehlung gib an:
     a. Das genaue CREATE INDEX Statement (nutze CONCURRENTLY für PostgreSQL falls angebracht).
     b. Welche Queries oder Zugriffsmuster es abdeckt.
     c. Geschätzte Selektivitäts-Auswirkung (hohe/mittlere/niedrige Kardinalität).
     d. Write Overhead-Kosten — Indizes, die INSERT/UPDATE Durchsatz beeinträchtigen, müssen gekennzeichnet werden.
   - Bevorzuge Composite-Indizes über mehrere Single-Column-Indizes, wenn das Query-Muster es rechtfertigt.
   - Erwäge Partial Indexes (WHERE Klausel) für sparse Bedingungen (z.B. Soft-Delete-Muster, Status-Filter mit dominanten Null/Inaktiv-Werten).
   - Erwäge Covering Indexes (INCLUDE Spalten), um Table Heap Fetches für Hot Read Paths zu eliminieren.

4. Kennzeichne Indizes zum Löschen:
   - Doppelte Indizes.
   - Indizes auf Spalten, die nie in Filtern oder Joins verwendet werden.
   - Indizes, die von einem Composite Index ersetzt werden.

5. Gebe einen priorisierten Aktionsplan aus: HIGH (sofortiger Gewinn, niedriges Risiko) / MEDIUM (nützlich, geringer Write Overhead) / LOW (marginal, unter Last evaluieren).

Gebe die angenommene Datenbank-Engine basierend auf Syntax- oder Config-Kontext an.
