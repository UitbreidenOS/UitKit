# SQL-Regeln

Wenden Sie diese Regeln an, wenn Sie Queries, Schemas oder gespeicherte Prozeduren schreiben.

## Query-Hygiene

- Verwenden Sie immer parametrisierte Queries — interpolieren Sie niemals Benutzereingaben direkt in SQL
- Qualifizieren Sie Spaltennamen bei Joins mehrerer Tabellen: `u.id` nicht `id`
- Vermeiden Sie `SELECT *` in Production Queries; nennen Sie explizit jede benötigte Spalte
- Verwenden Sie `EXPLAIN ANALYZE` vor dem Mergen jeder Query, die große Tabellen berührt
- Halten Sie Queries lesbar: eine Klausel pro Zeile für alles, was über ein triviales SELECT hinausgeht

## Indexierung

- Jeder Foreign Key muss einen Index haben — die Datenbank fügt dies nicht automatisch hinzu
- Indexieren Sie Spalten, die in `WHERE`, `JOIN ON` oder `ORDER BY` auf kritischen Pfaden vorkommen
- Zusammengesetzte Indizes: Die Spaltenreihenfolge ist wichtig — setzen Sie zuerst den Filter mit der höchsten Kardinalität oder Gleichheit
- Über-Indexieren Sie nicht schreibintensive Tabellen; jeder Index verlangsamt `INSERT`/`UPDATE`/`DELETE`
- Verwenden Sie Partial Indexes für gefilterte Queries: `CREATE INDEX … WHERE deleted_at IS NULL`

## Schema-Design

- Verwenden Sie `NOT NULL` als Standard; nullable nur, wenn die Abwesenheit eine distinct Bedeutung gegenüber null/leer hat
- Speichern Sie Timestamps als `TIMESTAMPTZ` (UTC) — niemals `TIMESTAMP WITHOUT TIME ZONE`
- Verwenden Sie `BIGINT` oder `UUID` für Primary Keys; `SERIAL`/`INT` läuft auf hochvolumigen Tabellen aus
- Soft-Delete mit `deleted_at TIMESTAMPTZ`, wenn Row-History wichtig ist; andernfalls Hard-Delete
- Geldbeträge: speichern Sie als Integer-Cents (`BIGINT`) oder `NUMERIC(19,4)` — niemals `FLOAT`/`DOUBLE`

## Transaktionen

- Wickeln Sie Multi-Statement Mutations in eine Transaktion ein; lassen Sie niemals partielle Writes zu
- Halten Sie Transaktionen kurz — gehaltene Locks = Latenz für jeden konkurrierenden Schreiber
- Verwenden Sie `SELECT … FOR UPDATE`, um Rows zu sperren, die Sie modifizieren werden, nicht danach
- Vermeiden Sie Transaktionen, die einen HTTP-Request-Response-Zyklus spannen

## Migrationen

- Migrationen sind append-only; bearbeiten Sie niemals eine Migration, die in irgendeiner Umgebung gelaufen ist
- Bevorzugen Sie additive Änderungen (Spalte hinzufügen, Tabelle hinzufügen) vor dem Entfernen alter Spalten
- Fügen Sie neue Non-Nullable Spalten mit einem `DEFAULT` oder in zwei Schritten hinzu: nullable hinzufügen → backfill → Constraint hinzufügen
- Testen Sie Rollback: jede Migration sollte einen reversiblen `down` Schritt haben

## Anti-Patterns

- Keine Logik in Application Queries, die in Constraints gehört: verwenden Sie `CHECK`, `UNIQUE`, `FK`
- Kein `NOT IN (subquery)` mit nullable Spalten — es gibt stillschweigend null Rows bei NULL zurück
- Keine korrelierten Subqueries innerhalb von Loops — batch oder verwenden Sie stattdessen einen `JOIN`/`CTE`
- Kein `OFFSET` Pagination auf großen Tabellen — verwenden Sie cursor-basiert (`WHERE id > :cursor`)
