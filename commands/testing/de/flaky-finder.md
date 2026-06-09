---
description: Fehlerquellen in bestehenden Tests identifizieren und beheben
argument-hint: "[test file or directory]"
---
Analysiere Tests auf Fehleranfälligkeit in: $ARGUMENTS

Schritte:

1. Lese die Zieldatei oder alle Testdateien im Zielverzeichnis.

2. Durchsuche nach jedem der folgenden Fehleranfälligkeitsmuster und notiere jedes Vorkommen mit Dateipfad und Zeilennummer:

   **Timing-Probleme**
   - Feste `sleep`/`wait` Aufrufe statt bedingungsbasierter Waits
   - Assertions unmittelbar nach asynchronen Operationen ohne Awaiting
   - Hartcodierte Timeouts, die sich zwischen CI und lokalen Umgebungen unterscheiden können

   **Reihenfolgeabhängigkeit**
   - Tests, die Zustand auf Modulebene oder globaler Ebene mutieren ohne Cleanup
   - `beforeAll` Setup, das spätere Tests benötigen, aber nicht deklarieren
   - Testdateien, die Ausführungsreihenfolge innerhalb einer Suite voraussetzen

   **Nicht-Determinismus**
   - Verwendung von `Math.random()`, `Date.now()` oder `new Date()` in Assertions ohne Mocking
   - Netzwerkaufrufe zu echten Endpunkten (keine Interceptoren/Mocks)
   - Dateisystem-Lesevorgänge ohne Fixtures — Pfade, die sich je nach Umgebung unterscheiden

   **Ressourcenkonflikte**
   - Parallele Tests, die in die gleichen Datenbankzeilen oder Dateien schreiben
   - Port-Konflikte in Server-Start-Tests
   - Fehlende Transaction-Rollbacks oder Teardown

   **Selector-Fragilität (UI/E2E)**
   - CSS-Klassenselektoren, die visuellen Stil kodieren, nicht Semantik
   - XPath-Ausdrücke abhängig von DOM-Tiefe
   - Text-Content-Treffer, die bei i18n oder Copy-Änderungen fehlschlagen

3. Für jeden Fund bereitstellen:
   - Musterkategorie (von oben)
   - Genaue Position (Datei:Zeile)
   - Grundursache in einem Satz
   - Eine konkrete Korrektur — zeige das Before/After-Code-Snippet

4. Nach dem Katalogisieren, wende Fixes auf Probleme an, die eindeutig sicher zu ändern sind (z.B. `sleep(500)` gegen einen richtigen Wait austauschen, fehlende `afterEach` Cleanup hinzufügen).

5. Für Fixes, die Designentscheidungen erfordern (z.B. Einführung einer Test-Datenbank, Hinzufügen eines Mock-Servers), beschreibe den Ansatz, aber implementiere nicht ohne Bestätigung.

6. Beende mit einer Anzahl: X Funde, Y automatisch korrigiert, Z erfordern manuelle Aktion.
