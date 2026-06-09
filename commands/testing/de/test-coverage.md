---
description: Testabdeckungslücken analysieren und Tests zur Schließung generieren
argument-hint: "[file-or-directory]"
---
Testabdeckung analysieren und verbessern für: $ARGUMENTS

Schritt 1 — Aktuelle Abdeckung messen.
Führen Sie das Abdeckungstool des Projekts aus (Jest --coverage, pytest --cov, go test -cover, usw.) mit dem Bereich $ARGUMENTS. Analysieren Sie die Ausgabe und identifizieren Sie:
- Zeilen/Branches ohne Abdeckung
- Funktionen, die vollständig ungetestet sind
- Branches (if/else, switch, ternary), bei denen nur ein Pfad ausgeübt wird

Schritt 2 — Lücken nach Risiko priorisieren.
Ordnen Sie unabgedeckten Code nach:
1. Geschäftskritische Pfade (Zahlung, Authentifizierung, Datenmutation)
2. Fehlerbehandlung und Fallback-Branches
3. Komplexe bedingte Logik (zyklomatische Komplexität > 3)
4. Öffentliche API-Oberfläche vs. interne Hilfsfunktionen

Schritt 3 — Schreiben Sie für jede hochpriorisierte Lücke einen gezielten Test.
- Benennen Sie den Test nach dem genauen Szenario, das er abdeckt ("throws AuthError when token is expired")
- Halten Sie das Setup minimal — nur das, was zum Erreichen des unabgedeckten Branches erforderlich ist
- Assertieren Sie das spezifische Verhalten, nicht nur dass keine Ausnahme ausgelöst wurde

Schritt 4 — Führen Sie die Abdeckung nach dem Hinzufügen von Tests erneut aus und bestätigen Sie, dass die Lücke geschlossen ist. Bericht:
- Abdeckung vorher: X%
- Abdeckung nachher: Y%
- Verbleibende Lücken und Gründe, warum sie akzeptabel zu hinterlassen sind (z. B. toter Code, plattformspezifische Branches)

Generieren Sie keine Tests, die Abdeckungsmetriken auffüllen, ohne echtes Verhalten zu assertieren (z. B. eine Funktion aufrufen und `toBeTruthy()` assertieren). Qualität vor Quantität.
