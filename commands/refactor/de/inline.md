---
description: Eine Funktion, Variable oder Konstante inlinen, die Indirektion ohne Wert hinzufügt
argument-hint: "[symbol-name] [file]"
---
Das in $ARGUMENTS angegebene Symbol inlinen — Format: `<symbol-name> <file>`.

1. Lesen Sie die Datei. Suchen Sie die Deklaration des benannten Symbols und jede Aufrufstelle oder Verwendung.

2. Bestimmen Sie, ob das Inlinen angemessen ist. Das Inlinen ist angemessen, wenn:
   - Das Symbol wird nur an ein oder zwei Stellen aufgerufen
   - Der Rumpf des Symbols ist einfacher oder klarer als sein Name vermuten lässt (der Name bietet keine Informationen)
   - Das Symbol ist ein Single-Expression-Wrapper ohne Wiederverwendungswert
   - Eine Variable oder Konstante wird einmal zugewiesen und einmal verwendet, und der Zwischenname unterstützt die Lesbarkeit nicht

   Inlinen Sie NICHT, wenn:
   - Das Symbol an 3 oder mehr Stellen verwendet wird (Inlinen würde Duplikation reintroduzieren)
   - Der Name ist wirklich informativ und sein Entfernen würde die Absicht verschleiern
   - Das Symbol hat Nebenwirkungen, die zur Deklarationszeit ausgeführt werden (Inlinen könnte die Ausführungsreihenfolge ändern)
   - Das Symbol wird exportiert oder ist Teil einer öffentlichen API

3. Für jede Aufrufstelle:
   - Ersetzen Sie den Rumpf des Symbols direkt mit allen korrekt ersetzten Parameterbindungen
   - Wenn der Rumpf auf Variablen aus seinem ursprünglichen Bereich verweist, die an der Aufrufstelle nicht verfügbar sind, stoppen Sie und berichten Sie — das Inlinen ist nicht sicher
   - Stellen Sie sicher, dass die Operatorpriorität nach der Substitution korrekt ist (fügen Sie bei Bedarf Klammern hinzu)

4. Nach dem Inlinen aller Stellen löschen Sie die ursprüngliche Deklaration.

5. Entfernen Sie alle Importe, die nur zur Unterstützung des jetzt gelöschten Symbols vorhanden waren.

6. Überprüfen Sie, dass das Ergebnis syntaktisch und semantisch korrekt ist:
   - Keine hängenden Verweise
   - Keine geänderte Evaluationsreihenfolge für Ausdrücke mit Nebenwirkungen
   - Typen prüfen sich immer noch, wenn die Sprache typisiert ist

7. Ausgabe: Symbolname, Anzahl der ingelinen Stellen, Speicherort der ursprünglichen Deklaration und Bestätigung, dass sie gelöscht wurde.
