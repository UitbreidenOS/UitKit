---
description: Generiere oder aktualisiere eine OpenAPI 3.1-Spezifikation aus bestehenden Routen oder einer Beschreibung
argument-hint: "[source-file-or-description]"
---
Generiere oder aktualisiere eine OpenAPI 3.1-Spezifikation basierend auf: $ARGUMENTS

Wenn $ARGUMENTS ein Dateipfad ist, lese die Routendefinitionen aus dieser Datei. Wenn es eine Beschreibung ist, gerüste eine Spezifikation von Grund auf auf. Wenn leer, scanne die Codebasis nach allen Routendefinitionen und generiere eine vollständige Spezifikation.

Anforderungen:
- Verwende OpenAPI 3.1.0 (nicht 3.0.x — verwende `type: "null"` nicht `nullable: true`)
- Jeder Pfad muss haben: summary, operationId (camelCase, eindeutig), tags, parameters, requestBody (falls zutreffend) und responses
- Definiere alle Schemata unter `components/schemas` — inline Schemata in Pfadelementen sind verboten
- Verwende `$ref` für jedes Schema, auf das mehr als einmal verwiesen wird
- Dokumentiere jeden möglichen Antwortstatus-Code, den der Code tatsächlich zurückgibt — erfinde keine zusätzlichen
- Erforderliche Felder müssen in `required`-Arrays stehen — keine stillen Optionals
- Enum-Werte müssen mit dem übereinstimmen, was der Code erzwingt
- Füge Sicherheitsschema-Definitionen hinzu, falls die API Auth verwendet (Bearer JWT, API Key, OAuth2, etc.)
- Füge `description`-Felder bei allen nicht offensichtlichen Eigenschaften hinzu
- Markiere veraltete Endpunkte mit `deprecated: true`, falls vorhanden

Formatierungsregeln:
- YAML-Ausgabe, 2-Leerzeichen-Einzug
- Halte `paths` alphabetisch nach Route sortiert
- Halte `components/schemas` alphabetisch sortiert

Gebe die vollständige `openapi.yaml`-Datei aus. Wenn du eine bestehende Spezifikation aktualisierst, zeige nur die geänderten Abschnitte mit ausreichend Kontext zum Platzieren, dann schreibe die vollständig aktualisierte Datei.

Wenn die Routenquelle mehrdeutig ist oder Framework-spezifische Dekoratoren nicht erkannt werden, liste auf, welche Routen übersprungen wurden und warum.
