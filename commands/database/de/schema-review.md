---
description: Überprüfung eines Datenbankschemas auf Designfehler, Normalisierungsprobleme und Produktionsreife
argument-hint: "[schema file or table name(s)]"
---
Sie führen eine Produktionsreife-Überprüfung eines Datenbankschemas durch. Überprüfungsziel: $ARGUMENTS

Falls $ARGUMENTS ein Dateipfad ist, lesen Sie die Datei. Falls es ein Tabellenname oder eine Liste von Namen ist, suchen Sie nach Schemadefinitionen in der Codebasis (Migrationen, ORM-Modelle, schema.sql, schema.rb, prisma.schema, usw.).

Überprüfen Sie das Schema über diese Dimensionen:

**Normalisierung und Datenintegrität**
- Identifizieren Sie Verstöße gegen 1NF, 2NF, 3NF. Beachten Sie Denormalisierungen, die absichtlich sind (für Leseleistung) im Vergleich zu versehentlichen.
- Erkennen Sie Spalten, die mehrere Werte speichern (kommagetrennte Listen, JSON-Arrays, die als Relationen verwendet werden).
- Überprüfen Sie, dass jede Tabelle einen eindeutigen Primärschlüssel hat.
- Überprüfen Sie, dass Fremdschlüssel deklariert sind und nicht nur durch Benennungskonvention impliziert werden.
- Überprüfen Sie fehlende UNIQUE-Constraints für Spalten, die eindeutig sein sollten.
- Erkennen Sie nullable Spalten, die NOT NULL sein sollten, basierend auf geschäftlicher Semantik.

**Typangemessenheit**
- Flaggen Sie Zeichenketten-Spalten, die E-Mail-Adressen, UUIDs, IP-Adressen, JSON, Geldbeträge oder Datumszeiten speichern — schlagen Sie angemessene Typen vor.
- Flaggen Sie INT, das für Boolean verwendet wird (verwenden Sie BOOLEAN), oder FLOAT, das für Währung verwendet wird (verwenden Sie DECIMAL/NUMERIC).
- Überprüfen Sie die Zeitzonen-Behandlung: TIMESTAMP vs TIMESTAMPTZ (PostgreSQL), DATETIME vs TIMESTAMP (MySQL).

**Benennung und Konsistenz**
- Überprüfen Sie konsistente Benennungskonventionen (snake_case vs camelCase, Plural vs Singular-Tabellennamen).
- Identifizieren Sie inkonsistente Spalten-Benennungsmuster für häufige Felder (created_at vs createdAt vs create_time).

**Skalierungsbedenken**
- Tabellen, bei denen ein Index auf Fremdschlüsselspalten fehlt.
- Tabellen ohne offensichtliche Partitionierungsstrategie, die wahrscheinlich 10 Millionen Zeilen überschreiten werden.
- Fehlendes Soft-Delete-Muster, bei dem harte Löschungen Audit-Anforderungen brechen würden.
- VARCHAR ohne vernünftige Längenbegrenzung auf Spalten, die wahrscheinlich indiziert werden.

**Sicherheit**
- Spalten, die sensible Daten (Passwort, ssn, card_number, secret) zu speichern scheinen, ohne eine Benennungskonvention, die anzeigt, dass sie gehasht/verschlüsselt sind.

Geben Sie einen strukturierten Bericht mit Schweregradbewertungen (CRITICAL / WARNING / SUGGESTION) für jeden Befund und eine konkrete Behebung aus.
