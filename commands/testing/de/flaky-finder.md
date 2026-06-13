---
description: Quellen von Instabilität in vorhandenen Tests identifizieren und beheben
argument-hint: "[Test-Datei oder Verzeichnis]"
---
Analysiere Tests auf Fehleranfälligkeit in: $ARGUMENTS

Schritte:

1. Lese die Zieldatei oder alle Testdateien im Zielverzeichnis.

2. Durchsuche nach jedem der folgenden Fehleranfälligkeitsmuster und notiere jedes Vorkommen mit Dateipfad und Zeilennummer:

   **Timing-Probleme**
   - Feste `sleep`/`wait` Aufrufe statt bedingungsbasierter Waits
   - Assertions unmittelbar nach asynchronen Operationen ohne Awaiting
   - Hartcodierte Timeouts, die sich zwischen CI und lokalen Umgebungen unterscheiden können

   **Ausführungsreihenfolge-Abhängigkeit**
   - Tests, die gemeinsame Modul-Ebenen- oder globale Zustände ohne Cleanup verändern
   - `beforeAll` Setup, auf das spätere Tests angewiesen sind, ohne es zu deklarieren
   - Test-Dateien, die die Ausführungsreihenfolge innerhalb einer Suite annehmen

   **Nicht-Determinismus**
   - Verwendung von `Math.random()`, `Date.now()` oder `new Date()` in Assertions ohne Mocking
   - Netzwerkaufrufe zu echten Endpunkten (keine Interceptoren/Mocks)
   - Dateisystem-Lesevorgänge ohne Fixtures — Pfade, die sich je nach Umgebung unterscheiden

   **Ressourcen-Contention**
   - Parallele Tests, die in dieselben Datenbankzeilen oder Dateien schreiben
   - Port-Konflikte in Server-Start-Tests
   - Fehlende Transaction Rollbacks oder Teardown

   **Selektor-Fragilität (UI/E2E)**
   - CSS-Klassen-Selektoren, die visuellen Stil kodieren, nicht Semantik
   - XPath-Ausdrücke, die von DOM-Tiefe abhängig sind
   - Text-Inhalts-Matches, die bei i18n oder Copy-Änderungen fehlschlagen

3. Für jeden Fund bereitstellen:
   - Muster-Kategorie (von oben)
   - Genaue Position (Datei:Zeile)
   - Grundursache in einem Satz
   - Eine konkrete Lösung — zeige Code-Snippet vor/nach

4. Nach dem Katalogisieren, wende automatisch Fixes auf Probleme an, die eindeutig sicher zu ändern sind (z.B. `sleep(500)` durch einen korrekten Wait ersetzen, fehlenden `afterEach` Cleanup hinzufügen).

5. Für Fixes, die Designentscheidungen erfordern (z.B. Einführung einer Test-Datenbank, Hinzufügen eines Mock-Servers), beschreibe den Ansatz, aber implementiere nicht ohne Bestätigung.

6. Beende mit einer Anzahl: X Funde, Y automatisch behoben, Z erfordern manuelle Aktion.
