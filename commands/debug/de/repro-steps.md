---
description: Einen minimalen Reproduktionsfall aus einer Fehlerbeschreibung oder einem fehlgeschlagenen Test generieren
argument-hint: "[Fehlerbeschreibung oder Testname]"
---
Gegeben: $ARGUMENTS

Deine Aufgabe ist es, einen minimalen, in sich geschlossenen Reproduktionsfall für diesen Fehler zu erstellen.

Schritte:

1. Identifiziere die Fehleroberfläche — ist dies ein Unit-, Integrations- oder Runtime-Fehler? Welche Schicht ist dafür zuständig?

2. Reduziere die Reproduktion auf die kleinste Form:
   - Entferne alle nicht verwandten Setups, Fixtures und Daten
   - Eliminiere nach Möglichkeit Netzwerk-/Dateisystem-Aufrufe — mocke oder stubme sie
   - Die Reproduktion muss deterministisch fehlschlagen, nicht zufällig

3. Benenne die erforderlichen Umgebungsbedingungen:
   - Runtime-Version, OS-Einschränkungen falls relevant
   - Erforderliche Umgebungsvariablen oder Konfigurationswerte
   - Alle Seed-Daten oder Vorbedingungen

4. Schreibe die Reproduktion als ausführbaren Code (Test oder Skript). Füge ein:
   - Imports und Setup
   - Die minimale Aufrufreihenfolge, die den Fehler auslöst
   - Eine Assertion oder einen Error-Print, die den Fehler deutlich markiert

5. Füge am oberen Ende einen Kommentarblock hinzu:
   ```
   // BUG: <Einzeilige Beschreibung>
   // EXPECTED: <was passieren sollte>
   // ACTUAL: <was tatsächlich passiert>
   // SCOPE: <kleinste bekannte Einheit, die es reproduziert>
   ```

6. Wenn der Fehler nicht-deterministisch ist, dokumentiere die beobachtete Häufigkeit und alle Bedingungen, die die Reproduzierbarkeit erhöhen (z. B. Concurrency-Level, Datengröße, Timing).

7. Überprüfe, dass die Reproduktion tatsächlich fehlschlägt, bevor du sie präsentierst. Falls du sie ausführen kannst, tue dies.

Output: Der Inhalt der Reproduktionsdatei, bereit zum Einfügen in eine neue Datei, gefolgt von einer einzeiligen Zusammenfassung des zugrundeliegenden Fehlermechanismus, falls du ihn aus der Reproduktion allein identifizieren kannst.
