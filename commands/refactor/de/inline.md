---
description: Eine Funktion, Variable oder Konstante inline einbinden, die nur Umleitung ohne Wert hinzufügt
argument-hint: "[symbol-name] [file]"
---
Binden Sie das in $ARGUMENTS angegebene Symbol inline ein — Format: `<symbol-name> <file>`.

1. Lesen Sie die Datei. Lokalisieren Sie die Deklaration des benannten Symbols und jeden Aufrufort oder jede Verwendung.

2. Bestimmen Sie, ob das Inlining angebracht ist. Das Inlining ist angebracht, wenn:
   - Das Symbol wird an nur einer oder zwei Stellen aufgerufen
   - Der Text des Symbols ist einfacher oder klarer als sein Name andeutet (der Name fügt keine Informationen hinzu)
   - Das Symbol ist ein Wrapper mit einem einzigen Ausdruck ohne Wiederverwendungswert
   - Eine Variable oder Konstante wird einmal zugewiesen und einmal verwendet, und der Zwischennamen unterstützt die Lesbarkeit nicht

   Das Inlining ist NICHT angebracht, wenn:
   - Das Symbol wird an 3 oder mehr Stellen verwendet (Inlining würde Duplikation erneut einführen)
   - Der Name ist wirklich informativ und sein Entfernen würde die Absicht verdunkeln
   - Das Symbol hat Nebenwirkungen, die zur Deklarationszeit ausgeführt werden (Inlining könnte die Ausführungsreihenfolge ändern)
   - Das Symbol wird exportiert oder ist Teil einer öffentlichen API

3. Für jeden Aufrufort:
   - Ersetzen Sie den Textkörper des Symbols direkt, wobei alle Parameterbindungen korrekt ersetzt werden
   - Falls der Text auf Variablen aus seinem ursprünglichen Geltungsbereich verweist, die am Aufrufort nicht verfügbar sind, stoppen Sie und melden Sie — das Inlining ist nicht sicher
   - Stellen Sie sicher, dass die Operatorvorrangigkeit nach der Ersetzung korrekt ist (fügen Sie bei Bedarf Klammern hinzu)

4. Nach dem Inlining aller Aufrufstellen löschen Sie die ursprüngliche Deklaration.

5. Entfernen Sie alle Importe, die nur zur Unterstützung des jetzt gelöschten Symbols vorhanden waren.

6. Überprüfen Sie, dass das Ergebnis syntaktisch und semantisch korrekt ist:
   - Keine hängenden Verweise
   - Keine geänderte Evaluierungsreihenfolge für Ausdrücke mit Nebenwirkungen
   - Typen prüfen sich immer noch, wenn die Sprache typisiert ist

7. Ausgabe: Symbolname, Anzahl der inline gebundenen Stellen, ursprüngliche Deklarationslocation und Bestätigung, dass sie gelöscht wurde.
