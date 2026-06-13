---
description: Gerüst für End-to-End-Tests einer Seite, Route oder eines Benutzer-Workflows erstellen
argument-hint: "[Beschreibung der Seite oder des Workflows]"
---
Sie gerüsten End-to-End-Tests für Folgendes: $ARGUMENTS

Befolgen Sie diese Schritte:

1. Erkennen Sie das verwendete E2E-Framework durch Überprüfung von Konfigurationsdateien und Abhängigkeiten:
   - Playwright: `playwright.config.ts`, `@playwright/test`
   - Cypress: `cypress.config.ts`, `cypress/`
   - Puppeteer: `puppeteer` in package.json
   - Wenn keine gefunden wird, nehmen Sie standardmäßig Playwright an und notieren Sie diese Annahme.

2. Identifizieren Sie das Ziel — eine Seite, Route oder einen benannten Benutzer-Workflow — aus dem Argument. Falls mehrdeutig, leiten Sie es aus der Verzeichnisstruktur und bestehenden Testdateien ab.

3. Lesen Sie vorhandene E2E-Tests im Projekt, um Folgendes abzugleichen:
   - Dateiort-Konventionen (z. B. `e2e/`, `tests/`, `cypress/e2e/`)
   - Bereits verwendete Helper-/Fixture-Muster
   - Base-URL-Konfiguration und Auth-Setup, falls vorhanden

4. Gerüsten Sie eine Testdatei mit Folgendem:
   - Mindestens einen `describe`-Block mit dem Namen des Ziels
   - Einen Happy-Path-Test, der die primäre Aktion abdeckt (Laden, Absenden, Navigieren)
   - Einen Test für Fehler/Grenzfälle (ungültige Eingabe, 404, leerer Zustand)
   - Einen Test für alle kritischen interaktiven Elemente, die im Ziel sichtbar sind
   - Passendes `beforeEach`-Setup (Navigation zur Seite, Mock-Authentifizierung, falls erforderlich)

5. Verwenden Sie die idiomatischen Selektoren des Frameworks:
   - Playwright/Cypress: bevorzugen Sie `getByRole`, `getByLabel`, `getByTestId` gegenüber CSS-Selektoren
   - Puppeteer: verwenden Sie `waitForSelector` mit semantischen Attributen

6. Mocken Sie Netzwerkanfragen nicht, es sei denn, das Argument enthält explizit „mock" oder das Projekt verwendet bereits durchgängig Interceptoren.

7. Fügen Sie einen `// TODO:`-Kommentar für alle Assertions hinzu, die einen nur zur Laufzeit bekannten Wert erfordern (z. B. dynamische IDs, Zeitstempel).

8. Platzieren Sie die Datei im korrekten Verzeichnis. Erstellen Sie keine neuen Verzeichnisse, es sei denn, es existiert kein E2E-Verzeichnis.

9. Ausgabe:
   - Der erstellte Dateipfad
   - Eine kurze Auflistung, was jeder Test abdeckt
   - Alle getroffenen Annahmen (Framework-Auswahl, Base-URL, Authentifizierung)
