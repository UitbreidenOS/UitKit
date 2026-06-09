---
description: Audite die API und erstelle eine Versionierungsstrategie mit Migrationspfaden für Breaking Changes
argument-hint: "[current-version] [target-version]"
---
Erstelle einen API-Versionierungsplan für: $ARGUMENTS

Analysiere als: aktuelle Version (z.B. v1) und Zielversion (z.B. v2). Falls weggelassen, analysiere die vorhandene API und empfehle, ob Versionierung überhaupt erforderlich ist.

Analysephase — lies die Codebasis und identifiziere:
1. Alle öffentlichen Endpunkte (Pfad, Methode, Request-Shape, Response-Shape)
2. Welche Änderungen sind Breaking vs. Non-Breaking:
   - Breaking: Entfernen eines Feldes, Ändern eines Feldtyps, Umbenennen eines Feldes, Ändern von Status-Code-Semantik, Entfernen eines Endpunkts, Ändern von Authentifizierungsanforderungen
   - Non-Breaking: Hinzufügen eines optionalen Feldes, Hinzufügen eines neuen Endpunkts, Hinzufügen eines neuen Enum-Werts (mit Vorsicht), Lockern von Validierung
3. Alle existierenden Clients oder SDK-Consumer, die betroffen wären

Versionierungsstrategie-Auswahl:
- URL-Pfad-Versionierung (`/v2/`) — empfohlener Standard; explizit, cachebar, einfach zu routen
- Header-Versionierung (`API-Version: 2`) — sauberer URLs, aber schwieriger im Browser zu testen; nur verwenden, wenn das Projekt dies bereits macht
- Query-Parameter-Versionierung — vermeiden; nicht RESTful und bricht Caching

Implementierungsplan:
- Definiere das Versions-Präfix an einer Stelle (Router-Konfiguration, Base-URL-Konstante) — nicht verstreut in jedem Route
- Alte Versions-Routes müssen während eines Deprecation-Fensters funktionsfähig bleiben (empfohlen: mindestens 6 Monate für externe APIs, 1 Major-Release für interne)
- Füge `Deprecation` und `Sunset` Header zu v1-Responses hinzu, wenn v2 veröffentlicht wird
- Versioniere nur die Routes mit Breaking Changes — identische Routes können Handler über Versionen hinweg teilen
- Definiere ein Migrationsleitfaden-Dokument, das alle Breaking Changes mit Vorher/Nachher-Beispielen auflistet

Ausgabe:
1. Liste der gefundenen Breaking Changes (oder "keine gefunden", falls sauber)
2. Empfohlene Versionierungsstrategie mit Begründung
3. Routing-Struktur, die zeigt, wie v1 und v2 koexistieren
4. Code-Änderungen, die für die Versions-Aufteilung erforderlich sind
5. Deprecation-Timeline-Empfehlung
6. Migrationsleitfaden-Skelett für API-Consumer
