---
description: Testabdeckungslücken analysieren und Tests zum Schließen erstellen
argument-hint: "[file-or-directory]"
---
Testabdeckung für folgende Elemente analysieren und verbessern: $ARGUMENTS

Schritt 1 — Aktuelle Abdeckung messen.
Führen Sie das Abdeckungstool des Projekts aus (Jest --coverage, pytest --cov, go test -cover, usw.) im Bereich $ARGUMENTS. Analysieren Sie die Ausgabe und identifizieren Sie:
- Zeilen/Branches mit null Abdeckung
- Funktionen, die vollständig ungetestet sind
- Branches (if/else, switch, ternary), bei denen nur ein Pfad ausgeführt wird

Schritt 2 — Lücken nach Risiko priorisieren.
Klassifizieren Sie ungecoverte Code nach:
1. Geschäftskritische Pfade (Zahlung, Authentifizierung, Datenmutation)
2. Fehlerbehandlung und Fallback-Branches
3. Komplexe bedingte Logik (zyklomatische Komplexität > 3)
4. Öffentliche API-Oberfläche vs. interne Helper

Schritt 3 — Für jede hochpriorisierte Lücke einen gezielten Test schreiben.
- Benennen Sie den Test nach dem genauen Szenario, das er abdeckt ("throws AuthError when token is expired")
- Halten Sie das Setup minimal — nur was nötig ist, um die ungecoverte Branche zu erreichen
- Behaupten Sie das spezifische Verhalten, nicht nur dass keine Ausnahme ausgelöst wurde

Schritt 4 — Nach dem Hinzufügen von Tests erneut Abdeckung ausführen und bestätigen, dass die Lücke geschlossen ist. Bericht:
- Abdeckung vorher: X%
- Abdeckung nachher: Y%
- Verbleibende Lücken und warum es akzeptabel ist, diese zu hinterlassen (z. B. toter Code, plattformspezifische Branches)

Generieren Sie keine Tests, die Abdeckungsmetriken erhöhen, ohne echtes Verhalten zu behaupten (z. B. eine Funktion aufrufen und `toBeTruthy()` behaupten). Qualität über Quantität.
