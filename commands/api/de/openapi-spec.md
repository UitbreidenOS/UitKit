---
description: OpenAPI 3.1 Spezifikation aus vorhandenen Routen oder einer Beschreibung generieren oder aktualisieren
argument-hint: "[Quelldatei-oder-Beschreibung]"
---
Generiere oder aktualisiere eine OpenAPI 3.1 Spezifikation basierend auf: $ARGUMENTS

Wenn $ARGUMENTS ein Dateipfad ist, lese die Routendefinitionen aus dieser Datei. Wenn es eine Beschreibung ist, erstelle eine Spezifikation von Grund auf. Wenn leer, scanne die Codebasis nach allen Routendefinitionen und generiere eine vollständige Spezifikation.

Anforderungen:
- Verwende OpenAPI 3.1.0 (nicht 3.0.x — verwende `type: "null"` nicht `nullable: true`)
- Jeder Pfad muss folgende Eigenschaften haben: summary, operationId (camelCase, eindeutig), tags, parameters, requestBody (falls vorhanden) und responses
- Definiere alle Schemas unter `components/schemas` — Inline-Schemas in Path-Elementen sind nicht erlaubt
- Verwende `$ref` für jeden Schema, auf den mehr als einmal verwiesen wird
- Dokumentiere jeden möglichen Response-Statuscode, den der Code tatsächlich zurückgibt — erfinde keine zusätzlichen Codes
- Erforderliche Felder müssen in `required` Arrays vorhanden sein — keine stillschweigend optionalen Felder
- Enum-Werte müssen mit dem übereinstimmen, was der Code erzwingt
- Füge Sicherheitsschema-Definitionen hinzu, falls die API Authentifizierung verwendet (Bearer JWT, API-Schlüssel, OAuth2, etc.)
- Füge `description` Felder zu allen nicht offensichtlichen Eigenschaften hinzu
- Markiere veraltete Endpoints mit `deprecated: true` falls vorhanden

Formatierungsregeln:
- YAML-Ausgabe, 2-Leerzeichen Einrückung
- Halte `paths` alphabetisch nach Route sortiert
- Halte `components/schemas` alphabetisch sortiert

Gebe die vollständige `openapi.yaml` Datei aus. Wenn eine vorhandene Spezifikation aktualisiert wird, zeige nur die geänderten Abschnitte mit ausreichendem Kontext, um sie zu positionieren, und schreibe dann die vollständige aktualisierte Datei.

Wenn die Routenquelle mehrdeutig ist oder Framework-spezifische Dekoratoren nicht erkannt werden, liste auf, welche Routen übersprungen wurden und warum.
