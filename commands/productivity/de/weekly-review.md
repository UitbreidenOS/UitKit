---
description: Wöchentliche Zusammenfassung aus Git-Verlauf, Notizen oder freiem Text generieren
argument-hint: "[Wochenkontext, Notizen oder leer lassen für Git]"
---
Wöchentliche Zusammenfassung generieren basierend auf: $ARGUMENTS

Wenn $ARGUMENTS leer oder minimal ist, führe `git log --since="7 days ago" --oneline --author=$(git config user.email)` aus, um Erfolge aus Commits zu ermitteln.

Erstelle diese Abschnitte:

**Versendet / Abgeschlossen**  
Aufzählungsliste. Jeder Punkt ist ein konkretes Lieferergebnis oder Meilenstein, nicht eine Aufgabe. Gruppiere verwandte Commits zu einem Punkt. Maximal 8 Punkte.

**In Arbeit**  
Aufzählungsliste. Was aktiv in Bearbeitung ist und in den nächsten 1–2 Wochen abgeschlossen werden soll. Berücksichtige ungefähren Fertigstellungsfortschritt, falls erkennbar.

**Blockiert / Risiko**  
Aufzählungsliste. Jeder Punkt: Was ist blockiert, warum, und wer/was hebt die Blockierung auf. Weglassen, falls nichts blockiert ist.

**Erkenntnisse**  
2–4 Punkte. Beobachtungen zu Prozess, Werkzeugen, Ansatz oder Domain-Wissen, das diese Woche gewonnen wurde. Nicht eine Zusammenfassung von Taten — nur Erkenntnisse.

**Fokus nächste Woche**  
3–5 Punkte. Konkrete Prioritäten für die kommende Woche, geordnet nach Wichtigkeit.

Regeln:
- Schreibe in der Ich-Form.
- Kalibriere Details nach Signal-zu-Rauschen-Verhältnis: überspringe triviale Aufgaben und Abhängigkeitsaktualisierungen, es sei denn, sie waren schwierig.
- Keine Zeitschätzungen für nächste Woche, es sei denn, die Eingabe enthielt sie.
- Wenn Git-Verlauf nur automatisierte Commits zeigt (Bots, CI), notiere dies und frage nach manueller Eingabe.
- Halte jeden Punkt auf einen Satz, es sei denn, ein zweiter Satz fügt wesentlichen Kontext hinzu.
- Gesamte Ausgabe sollte in unter 2 Minuten überblickbar sein.

Nur die wöchentliche Zusammenfassung ausgeben.
