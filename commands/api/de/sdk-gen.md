---
description: Generiere einen typisierten Client-SDK aus einem OpenAPI-Spec oder vorhandenen API-Routes
argument-hint: "[language] [spec-file-or-base-url]"
---
Generiere einen Client-SDK für: $ARGUMENTS

Parse als: Zielsprache (TypeScript, Python, Go, etc.) und entweder einen Pfad zu einer OpenAPI-Spec-Datei oder eine Basis-URL. Wenn keine Spec-Datei existiert, generiere zuerst eine aus der Codebasis, bevor du den SDK generierst.

SDK-Anforderungen nach Sprache:

TypeScript:
- ESM + CommonJS Dual-Output via `package.json` `exports` Feld
- Vollständige generische Typen — kein `any`, keine Typ-Assertions ohne Begründung
- Verwende `fetch` nativ; akzeptiere eine optionale benutzerdefinierte Fetch-Implementierung für Test-Mocking
- Zod-Schemas für Runtime-Response-Validierung (optional, aber einschließen, wenn das Projekt Zod verwendet)
- Tree-shakeable: jede Ressource als benannte Export, nicht eine Klasse mit allem darin

Python:
- `httpx` für async, `requests` für sync — stelle beide bereit oder frag welche
- Pydantic-Modelle für alle Request/Response-Typen
- Type Hints durchgehend, `py.typed` Marker für PEP 561 Konformität
- Async-Client als primäre Schnittstelle, Sync als dünner Wrapper

Go:
- Idiomatisches Go: Methoden auf einem `Client` Struct, Context als erster Parameter, `(T, error)` Rückgabemuster
- Separates Types-Paket für generierte Modelle
- Keine externen Abhängigkeiten außer `net/http`, es sei denn, das Projekt verwendet bereits eine

Alle Sprachen:
- Eine Client-Klasse/Struct pro Ressourcengruppe (spiegelt die OpenAPI `tags`)
- Constructor akzeptiert: Basis-URL, Auth-Token/API-Schlüssel, optionaler HTTP-Client
- Alle Methoden entsprechen 1:1 mit OpenAPI `operationId` Werten
- Gib typisierte Response-Objekte zurück — niemals rohe Strings oder untypierte Maps
- Propagiere alle HTTP-Fehler als typisierte Error-Objekte mit `status`, `code` und `message`
- README mit Installation, Initialisierung und ein Beispiel pro Ressource

Gebe den SDK als Verzeichnisstruktur-Listing aus, dann die vollständigen Dateiinhalte für jede Datei. Wenn das Spec mehr als 20 Operationen hat, generiere die Kern-Client-Infrastruktur und die erste Ressourcengruppe, dann liste die verbleibenden Gruppen zur On-Demand-Generierung auf.
