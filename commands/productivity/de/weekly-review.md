---
description: Erstelle eine Wochenübersicht aus Git-Verlauf, Notizen oder freier Eingabe
argument-hint: "[week context, notes, or leave blank for git]"
---
Generiere eine Wochenübersicht basierend auf: $ARGUMENTS

Wenn $ARGUMENTS leer oder minimal ist, führe `git log --since="7 days ago" --oneline --author=$(git config user.email)` aus, um Erfolge aus Commits abzuleiten.

Erstelle diese Abschnitte:

**Versendet / Abgeschlossen**  
Aufzählung. Jedes Element ist ein konkretes Ergebnis oder Meilenstein, keine Aufgabe. Fasse verwandte Commits in einem Element zusammen. Nicht mehr als 8 Punkte.

**In Arbeit**  
Aufzählung. Was gerade läuft und in den nächsten 1–2 Wochen abgeschlossen sein soll. Füge ungefähren Fortschritt hinzu, wenn erkennbar.

**Blockiert / Gefährdet**  
Aufzählung. Jedes Element: Was ist blockiert, warum, und wer/was hebt die Blockierung auf. Weglassen, falls nichts blockiert ist.

**Erkenntnisse**  
2–4 Punkte. Beobachtungen zu Prozess, Werkzeugen, Ansätzen oder Domänenwissen, das diese Woche gewonnen wurde. Keine Zusammenfassung dessen, was getan wurde – nur Erkenntnisse.

**Fokus nächste Woche**  
3–5 Punkte. Konkrete Prioritäten für die kommende Woche, geordnet nach Wichtigkeit.

Regeln:
- Schreibe in der ersten Person.
- Kalibriere Details auf Signal-zu-Rauschen-Verhältnis: Überspringe banale Aufgaben und Dependency-Updates, es sei denn, sie waren schwierig.
- Füge keine Zeitschätzungen für nächste Woche hinzu, es sei denn, die Eingabe enthielt sie.
- Wenn Git-Verlauf nur automatisierte Commits zeigt (Bots, CI), merke das an und frage nach manuellem Input.
- Halte jede Aufzählung auf einen Satz, es sei denn, ein zweiter Satz fügt wesentlichen Kontext hinzu.
- Gesamtausgabe sollte in unter 2 Minuten scanbar sein.

Geben nur die Wochenübersicht aus.
