---
description: Erstelle umfangreiche Unit Tests für die angegebene Datei oder Funktion
argument-hint: "[file-or-function]"
---
Du schreibst Unit Tests für: $ARGUMENTS

Befolge diese Schritte:

1. Lies die Zieldatei oder lokalisiere die benannte Funktion in der Codebasis. Verstehe ihre öffentliche Schnittstelle, Nebenwirkungen und Abhängigkeiten.

2. Identifiziere alle erforderlichen Testfälle:
   - Happy Path (typische gültige Eingaben)
   - Grenzwertbedingungen (leer, null, max, min, einzelnes Element)
   - Fehlerpfade (ungültige Eingabe, fehlende Abhängigkeiten, geworfene Ausnahmen)
   - Spezifische Edge Cases der Domain-Logik

3. Erkenne das bestehende Test-Framework und die Konventionen in diesem Projekt (Jest, Pytest, Go testing, Vitest, RSpec, etc.). Entspreche dem Stil genau — gleiche describe/it Verschachtelungstiefe, gleicher Assertion-Stil, gleiche Mock-/Stub-Muster, die bereits verwendet werden.

4. Schreibe Tests, die:
   - Isoliert sind: keine gemeinsamen veränderbaren Zustände zwischen Tests
   - Aussagekräftige Namen haben, die sich als Spezifikationen lesen ("gibt null zurück, wenn Benutzer nicht gefunden wird", nicht "Testfall 1")
   - Ein logisches Konzept pro Test überprüfen
   - eine Arrange-Act-Assert-Struktur verwenden
   - Nur das mocken, das eine echte Grenze überschreitet (Netzwerk, Dateisystem, Datenbank, Zeit, Zufälligkeit)

5. Mocke NICHT die zu testende Einheit selbst. Schreibe KEINE Tests, die nur das Mock testen.

6. Platziere die Testdatei neben der Quelldatei und befolge dabei die Projektkonventionen (z.B. `__tests__/`, `.test.ts`, `_test.go`).

7. Führe die Tests nach dem Schreiben aus und bestätige, dass sie bestanden werden. Falls welche fehlschlagen, behebe entweder den Test (wenn die Erwartung falsch war) oder mache den Fehler in der Implementierung deutlich.

Schreibe keine Placeholder-Tests. Hinterlasse keine `TODO`-Kommentare. Jeder Test muss vollständig und aussagekräftig sein.
