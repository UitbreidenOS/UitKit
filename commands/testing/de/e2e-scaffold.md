---
description: End-to-End-Tests für eine Seite, Route oder Benutzerflow erstellen
argument-hint: "[page or flow description]"
---
Sie erstellen End-to-End-Tests für: $ARGUMENTS

Folgen Sie diesen Schritten:

1. Erkennen Sie das verwendete E2E-Framework, indem Sie nach Konfigurationsdateien und Abhängigkeiten suchen:
   - Playwright: `playwright.config.ts`, `@playwright/test`
   - Cypress: `cypress.config.ts`, `cypress/`
   - Puppeteer: `puppeteer` in package.json
   - Wenn nichts gefunden wird, verwenden Sie standardmäßig Playwright und vermerken Sie diese Annahme.

2. Identifizieren Sie das Ziel — eine Seite, Route oder einen benannten Benutzerflow — aus dem Argument. Falls mehrdeutig, leiten Sie aus der Verzeichnisstruktur und bestehenden Testdateien ab.

3. Lesen Sie vorhandene E2E-Tests im Projekt, um Folgendes zu überprüfen:
   - Dateinamenskonventionen (z. B. `e2e/`, `tests/`, `cypress/e2e/`)
   - Helper-/Fixture-Muster, die bereits verwendet werden
   - Base-URL-Konfiguration und Authentifizierungssetup, falls vorhanden

4. Erstellen Sie eine Testdatei mit:
   - Mindestens einem `describe`-Block, benannt nach dem Ziel
   - Ein Happy-Path-Test, der die primäre Aktion abdeckt (laden, absenden, navigieren)
   - Ein Fehler-/Edge-Case-Test (ungültige Eingabe, 404, leerer Zustand)
   - Ein Test für beliebige kritische interaktive Elemente, die im Ziel sichtbar sind
   - Geeignetes `beforeEach`-Setup (zu Seite navigieren, Authentifizierung mock falls nötig)

5. Verwenden Sie die idiomatischen Selektoren des Frameworks:
   - Playwright/Cypress: bevorzugen Sie `getByRole`, `getByLabel`, `getByTestId` gegenüber CSS-Selektoren
   - Puppeteer: verwenden Sie `waitForSelector` mit semantischen Attributen

6. Mocken Sie Netzwerkanfragen nicht, es sei denn, das Argument enthält ausdrücklich "mock" oder das Projekt nutzt bereits Interceptoren umfassend.

7. Fügen Sie einen `// TODO:`-Kommentar für Assertions hinzu, die einen Wert erfordern, der nur zur Laufzeit bekannt ist (z. B. dynamische IDs, Zeitstempel).

8. Platzieren Sie die Datei im korrekten Verzeichnis. Erstellen Sie keine neuen Verzeichnisse, wenn bereits ein E2E-Verzeichnis vorhanden ist.

9. Ausgabe:
   - Der erstellte Dateipfad
   - Eine kurze Liste, was jeder Test abdeckt
   - Alle getroffenen Annahmen (Framework-Wahl, Base-URL, Authentifizierung)
