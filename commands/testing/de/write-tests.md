---
description: Generiere gründliche Unit-Tests für die angegebene Datei oder Funktion
argument-hint: "[file-or-function]"
---
Sie schreiben Unit-Tests für: $ARGUMENTS

Befolgen Sie diese Schritte:

1. Lesen Sie die Zieldatei oder lokalisieren Sie die benannte Funktion in der Codebasis. Verstehen Sie ihre öffentliche Schnittstelle, Nebenwirkungen und Abhängigkeiten.

2. Identifizieren Sie alle erforderlichen Testfälle:
   - Happy Path (typische gültige Eingaben)
   - Grenzfälle (leer, Null, Maximum, Minimum, einzelnes Element)
   - Fehlerpfade (ungültige Eingabe, fehlende Abhängigkeiten, geworfene Ausnahmen)
   - Edge Cases spezifisch für die Domänenlogik

3. Erkennen Sie das existierende Test-Framework und die Konventionen in diesem Projekt (Jest, Pytest, Go testing, Vitest, RSpec, usw.). Entsprechen Sie dem Stil genau – gleiche describe/it-Verschachtelungstiefe, gleicher Assertion-Stil, gleiche bereits verwendete Mock/Stub-Muster.

4. Schreiben Sie Tests, die:
   - Isoliert sind: kein gemeinsamer veränderlicher Zustand zwischen Tests
   - Beschreibende Namen haben, die als Spezifikationen lesbar sind („gibt null zurück, wenn Benutzer nicht gefunden wird", nicht „Testfall 1")
   - Ein logisches Konzept pro Test überprüfen
   - Arrange-Act-Assert-Struktur verwenden
   - Nur das mocken, was eine echte Grenze überschreitet (Netzwerk, Dateisystem, DB, Zeit, Zufälligkeit)

5. Mocken Sie NICHT die zu testende Einheit selbst. Schreiben Sie NICHT Tests, die nur das Mock testen.

6. Platzieren Sie die Testdatei neben der Quelldatei nach Projektkonventionen (z.B. `__tests__/`, `.test.ts`, `_test.go`).

7. Nach dem Schreiben führen Sie die Tests aus und bestätigen Sie, dass sie bestanden werden. Wenn welche fehlschlagen, beheben Sie entweder den Test (wenn die Erwartung falsch war) oder zeigen Sie den Fehler in der Implementierung deutlich auf.

Schreiben Sie keine Platzhaltertests. Hinterlassen Sie keine `TODO`-Kommentare. Jeder Test muss vollständig und aussagekräftig sein.
