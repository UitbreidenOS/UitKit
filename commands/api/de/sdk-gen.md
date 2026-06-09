---
description: Generiere ein typisiertes Client-SDK aus einem OpenAPI-Spec oder bestehenden API-Routes
argument-hint: "[language] [spec-file-or-base-url]"
---
Generiere ein Client-SDK für: $ARGUMENTS

Analysiere als: Zielsprache (TypeScript, Python, Go, etc.) und entweder einen Pfad zu einer OpenAPI-Spec-Datei oder eine Basis-URL. Falls keine Spec-Datei existiert, generiere zunächst eine aus der Codebasis, bevor du das SDK generierst.

SDK-Anforderungen nach Sprache:

TypeScript:
- ESM + CommonJS Dualausgabe über `package.json` `exports` Feld
- Vollständige generische Typen — kein `any`, keine Typ-Assertions ohne Begründung
- Nutze `fetch` nativ; akzeptiere eine optionale benutzerdefinierte fetch-Implementierung für Test-Mocking
- Zod-Schemas für Laufzeit-Response-Validierung (optional, aber einbeziehen, wenn das Projekt Zod nutzt)
- Tree-shakeable: jede Ressource als benannte Export, nicht eine Klasse mit allem darauf

Python:
- `httpx` für async, `requests` für sync — bereitgestellen beide oder frage, welche
- Pydantic-Modelle für alle Request/Response-Typen
- Typ-Hints durchgehend, `py.typed` Marker für PEP 561 Compliance
- Async-Client als Hauptschnittstelle, Sync als dünne Wrapper

Go:
- Idiomatisches Go: Methoden auf einer `Client` Struct, Kontext als erstes Parameter, `(T, error)` Return-Pattern
- Separate Types Package für generierte Modelle
- Keine externen Abhängigkeiten jenseits von `net/http`, es sei denn, das Projekt nutzt bereits eine

Alle Sprachen:
- Eine Client-Klasse/Struct pro Ressourcentruppe (spiegelt OpenAPI `tags`)
- Konstruktor akzeptiert: Basis-URL, Auth-Token/API-Schlüssel, optionaler HTTP-Client
- Alle Methoden entsprechen 1:1 mit OpenAPI `operationId` Werten
- Rückgabe typisierter Response-Objekte — niemals rohe Strings oder untyppisierte Maps
- Propagiere alle HTTP-Fehler als typisierte Fehler-Objekte mit `status`, `code`, und `message`
- README mit Installation, Initialisierung und einem Beispiel pro Ressource

Geben Sie die SDK als Verzeichnisstruktur-Listing aus, dann die vollständigen Datei-Inhalte für jede Datei. Falls das Spec mehr als 20 Operationen hat, generiere die Kern-Client-Infrastruktur und die erste Ressourcentruppe, dann liste die verbleibenden Gruppen zur Erzeugung auf Abruf auf.
