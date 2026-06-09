---
description: Erstellen Sie einen minimalen Reproduktionsfall aus einer Fehlerbeschreibung oder einem fehlgeschlagenen Test
argument-hint: "[bug description or test name]"
---
Given: $ARGUMENTS

Ihre Aufgabe ist es, einen minimalen, in sich geschlossenen Reproduktionsfall für diesen Fehler zu erstellen.

Schritte:

1. Identifizieren Sie die Fehleroberfläche — ist dies ein Unit-, Integrations- oder Laufzeitfehler? Welche Schicht ist dafür verantwortlich?

2. Reduzieren Sie die Reproduktion auf ihre kleinste Form:
   - Entfernen Sie alle nicht zusammenhängenden Setups, Fixtures und Daten
   - Eliminieren Sie Network- und Filesystem-Aufrufe, wo möglich — mocken oder stubben Sie diese
   - Die Reproduktion muss deterministisch scheitern, nicht flüchtig

3. Geben Sie die genauen erforderlichen Umgebungsbedingungen an:
   - Laufzeitversion, OS-Einschränkungen, wenn relevant
   - Erforderliche Umgebungsvariablen oder Konfigurationswerte
   - Alle Seed-Daten oder Vorbedingungen

4. Schreiben Sie die Reproduktion als ausführbarer Code (Test oder Skript). Einschließlich:
   - Importe und Setup
   - Die minimale Aufruffolge, die den Fehler auslöst
   - Eine Assertion oder Fehlerausgabe, die das Scheitern deutlich kennzeichnet

5. Fügen Sie einen Kommentarblock oben hinzu:
   ```
   // BUG: <one-line description>
   // EXPECTED: <what should happen>
   // ACTUAL: <what actually happens>
   // SCOPE: <smallest known unit that reproduces it>
   ```

6. Wenn der Fehler nicht deterministisch ist, dokumentieren Sie die beobachtete Häufigkeit und alle Bedingungen, die die Reproduzierbarkeit verbessern (z. B. Parallelität, Datengröße, Timing).

7. Überprüfen Sie, ob die Reproduktion tatsächlich scheitert, bevor Sie sie präsentieren. Wenn Sie es ausführen können, tun Sie dies.

Output: die Inhalte der Reproduktionsdatei, die Sie in eine neue Datei einfügen können, gefolgt von einer einzeiligen Zusammenfassung des Grundfehlermechanismus, falls Sie ihn aus der Reproduktion allein identifizieren können.
