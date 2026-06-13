---
description: Überprüfe ein Datenbankschema auf Designfehler, Normalisierungsprobleme und Produktionsreife
argument-hint: "[Schema-Datei oder Tabellenname(n)]"
---
Du führst eine Produktionsreife-Überprüfung eines Datenbankschemas durch. Überprüfungsziel: $ARGUMENTS

Falls $ARGUMENTS ein Dateipfad ist, lies die Datei. Falls es ein Tabellenname oder eine Liste von Namen ist, suche nach Schemadefinitionen in der Codebasis (Migrationen, ORM-Modelle, schema.sql, schema.rb, prisma.schema, etc.).

Überprüfe das Schema über diese Dimensionen:

**Normalisierung und Datenintegrität**
- Identifiziere Verstöße gegen 1NF, 2NF, 3NF. Notiere Denormalisierungen, die absichtlich sind (für Leseleistung) vs. versehentlich.
- Erkenne Spalten, die mehrere Werte speichern (kommagetrennte Listen, JSON-Arrays, die als Relationen verwendet werden).
- Überprüfe, dass jede Tabelle einen klaren Primärschlüssel hat.
- Verifiziere, dass Fremdschlüssel deklariert sind und nicht nur durch Namenskonvention impliziert werden.
- Überprüfe auf fehlende UNIQUE-Einschränkungen für Spalten, die eindeutig sein sollten.
- Erkenne nullable Spalten, die basierend auf Business-Semantik NOT NULL sein sollten.

**Typ-Angemessenheit**
- Kennzeichne String-Spalten, die E-Mails, UUIDs, IP-Adressen, JSON, Geldbeträge oder Datetimes speichern — schlag angemessene Typen vor.
- Kennzeichne INT für Boolean (verwende BOOLEAN) oder FLOAT für Währung (verwende DECIMAL/NUMERIC).
- Überprüfe Zeitzonenbehandlung: TIMESTAMP vs TIMESTAMPTZ (PostgreSQL), DATETIME vs TIMESTAMP (MySQL).

**Benennung und Konsistenz**
- Überprüfe auf konsistente Namenskonventionen (snake_case vs camelCase, plural vs singular Tabellennamen).
- Identifiziere inkonsistente Spaltenbenennung für häufige Felder (created_at vs createdAt vs create_time).

**Skalierungsbedenken**
- Tabellen ohne Index auf Fremdschlüsselspalten.
- Tabellen ohne offensichtliche Partitionierungsstrategie, die wahrscheinlich 10M Zeilen überschreiten werden.
- Fehlendes Soft-Delete-Muster, bei dem Hard Deletes Audit-Anforderungen brechen würden.
- VARCHAR ohne angemessene Längenbegrenzung für Spalten, die wahrscheinlich indiziert werden.

**Sicherheit**
- Spalten, die sensible Daten zu speichern scheinen (password, ssn, card_number, secret) ohne Namenskonvention, die angibt, dass sie gehasht/verschlüsselt sind.

Gebe einen strukturierten Bericht mit Schweregradbewertungen (CRITICAL / WARNING / SUGGESTION) für jeden Fund aus, und einen konkreten Fix für jeden.
