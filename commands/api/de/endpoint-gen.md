---
description: Erzeuge einen vollständig typisierten REST-Endpunkt mit Validierung, Fehlerbehandlung und Tests
argument-hint: "[method] [path] [description]"
---
Generiere einen produktionsreifen REST-API-Endpunkt aus der Spezifikation: $ARGUMENTS

Analysiere die Eingabe als: HTTP-Methode, Pfad und eine kurze Beschreibung der Ressourcenoperation.

Regeln:
- Leite das Framework aus der bestehenden Codebasis ab (Express, FastAPI, Gin, Rails, etc.)
- Beachte die bestehende Dateistruktur, Namenskonventionen und Import-Stil des Projekts
- Definiere Request-/Response-Typen unter Verwendung des Typ-Systems des Projekts (TypeScript-Schnittstellen, Pydantic-Modelle, Go-Strukturen, etc.)
- Validiere alle Eingaben an der Grenze — lehne fehlerhafte Anfragen ab, bevor die Geschäftslogik ausgeführt wird
- Gib standard-HTTP-Statuscodes zurück: 200/201 Erfolg, 400 Fehlerhafte Anfrage, 401 Nicht authentifiziert, 403 Verboten, 404 Nicht gefunden, 409 Konflikt, 422 Nicht verarbeitbar, 500 Interner Fehler
- Gebe niemals Stack-Traces oder interne Fehlerdetails in Response-Body preis
- Extrahiere Geschäftslogik in eine Service-Schicht, halte den Controller schlank
- Füge Authentication-/Authorization-Checks hinzu, wenn das Projekt Middleware-Guards nutzt
- Schreibe mindestens drei Tests: Happy-Path, Validierungsfehler, Nicht-gefunden-Fall
- Befolge RESTful-Ressourcenkonventionen — verwende Substantive in Pfaden, keine Verben

Ausgabe:
1. Route/Controller-Datei (oder Ergänzung zu bestehendem Router)
2. Request/Response-Typ-Definitionen
3. Service-Funktion (Stub oder Implementierung, wenn die Logik einfach ist)
4. Test-Datei mit den drei erforderlichen Fällen
5. Eventuelle Migration oder Schema-Änderung, wenn der Endpunkt die Datenbank berührt

Falls $ARGUMENTS leer ist, frage nach: Methode, Pfad und was der Endpunkt macht.
