---
description: Zyklomatische Komplexität und Verschachtelungstiefe in einer Funktion oder Datei reduzieren
argument-hint: "[file] [function name or line number, optional]"
---
Reduzieren Sie die Komplexität des Codes in $ARGUMENTS.

1. Lesen Sie das Ziel. Falls eine bestimmte Funktion oder Zeilennummer angegeben ist, konzentrieren Sie sich dort. Andernfalls identifizieren Sie die Regionen mit der höchsten Komplexität: tiefe verschachtelte Bedingungen, lange Funktionen mit vielen Verzweigungen, Guard-Ketten, die den erfolgreichsten Pfad verschleiern.

2. Messen Sie Komplexitätssignale:
   - Verschachtelungstiefe > 3 Ebenen
   - Funktionslänge > 40 Zeilen mit mehreren Verantwortlichkeiten
   - Zyklomatische Komplexität > 10 (zählen Sie: `if`, `else if`, `for`, `while`, `case`, `catch`, `&&`, `||` Verzweigungen)
   - Boolesche Ausdrücke mit > 3 Operanden
   - Lange if-else-Ketten, die tabellengesteuert oder polymorph sein könnten

3. Wenden Sie gezielte Reduzierungen an:

   Early Returns / Guard Clauses:
   - Invertieren Sie Bedingungen, um am Anfang der Funktion schnell zu scheitern und die Notwendigkeit tieferer else-Zweige zu eliminieren

   Extrahieren Sie Unterfunktionen:
   - Heben Sie komplexe Bedingungen in benannte Prädikatfunktionen (`isEligible()`, `hasPermission()`)
   - Heben Sie Schleifenkörper in benannte Funktionen heraus, wenn der Körper > 5 Zeilen ist

   Ersetzen Sie Bedingungen durch Daten:
   - Falls eine if/else- oder switch-Kette Eingabewerte auf Ausgabewerte abbildet, ersetzen Sie durch eine Nachschlagetabelle / Map

   Vereinfachen Sie verschachtelte Schleifen:
   - Verwenden Sie `.flatMap()`, Generatoren oder Hilfsfunktionen, um dreifach verschachtelte Schleifen zu vermeiden
   - Wenn die Sprache dies unterstützt, erwägen Sie strukturierte Nebenläufigkeit oder Pipeline-Muster

   Vereinfachen Sie Boolesche Logik:
   - Wenden Sie De Morgans Gesetze an, um negierte zusammengesetzte Ausdrücke zu eliminieren
   - Extrahieren Sie benannte Boolesche Werte für komplexe Bedingungen (`const isExpired = date < now && !renewed`)

4. Reduzieren Sie Komplexität nicht durch Verbergung (z. B. durch Verschieben eines komplexen Zweigs in ein Lambda, das sofort aufgerufen wird). Das Ziel ist echte Vereinfachung, nicht Umsiedlung.

5. Erhalten Sie alle Verhaltensweisen genau bei. Führen Sie einen mentalen Diff durch: Jede Eingabe, die Output X produzierte, muss immer noch Output X produzieren.

6. Ausgabe: ursprüngliche Komplexitätsschätzung, neue Schätzung und eine Zusammenfassung jeder angewendeten Transformation.
