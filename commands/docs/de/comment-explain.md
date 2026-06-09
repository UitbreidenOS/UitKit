---
description: Erklärende Kommentare zu komplexen oder nicht offensichtlichen Codestellen hinzufügen
argument-hint: "[file or function]"
---
Füge erklärende Kommentare zum Code hinzu bei: $ARGUMENTS

Regeln:
- Kommentiere das WARUM, nicht das WAS. Wiederhole niemals, was der Code bereits sagt.
- Ein guter Kommentar erklärt: eine versteckte Einschränkung, eine nicht offensichtliche Algorithmuswahl, eine Eigenheit
  einer externen API, einen Performance-Kompromiss oder eine Invariante, die gelten muss.
- Schlechter Kommentar: `// increment i` — der Code sagt das bereits.
- Guter Kommentar: `// skip index 0 — the API returns a sentinel value there, not real data`.

Prozess:
1. Lese die Zieldatei oder Funktion vollständig durch, bevor du etwas schreibst.
2. Identifiziere jeden Block, der einen kompetenten Leser dazu bringt, innezuhalten und zu fragen „warum?".
3. Schreibe für jeden solchen Block einen einzeiligen Kommentar (oder maximal zwei Zeilen) darüber.
4. Wenn eine Funktion oder Methode einen nicht offensichtlichen Vertrag hat (Vorbedingungen, Nebenwirkungen, Reihenfolge-
   anforderung), füge einen kurzen Header-Kommentar hinzu, der nur erklärt, was nicht aus der Signatur offensichtlich ist.
5. Entferne alle vorhandenen Kommentare, die nur beschreiben, was der Code tut — sie addieren Rauschen hinzu.
6. Füge nicht zu jeder Funktion einen Kommentar hinzu. Nur wo echte Mehrdeutigkeit existiert.

Kommentar-Stil:
- Behalte den vorhandenen Kommentar-Stil in der Datei bei (Sprache, Formatierung, Großschreibung).
- Für JavaScript/TypeScript: `//` für inline, `/** */` nur für öffentliche API JSDoc.
- Für Python: `#` inline; Docstrings nur für öffentliche Funktionen/Klassen, eine Zeile wenn möglich.
- Keine Blockkommentare, die ganze Abschnitte erklären, es sei denn, der Abschnitt ist ein nicht-trivialer Algorithmus.

Nach dem Bearbeiten:
- Berichte jede Stelle, wo du einen Kommentar hinzugefügt oder entfernt hast, mit Datei:Zeile und einem Satz
  Grund für die Änderung.
- Formatiere keinen umgebenden Code neu. Nur chirurgische Änderungen.
- Wenn $ARGUMENTS auf ein ganzes Verzeichnis zeigt, verarbeite jede Datei, aber überspringe generierte Dateien,
  Vendor-Code und Test-Fixtures.
