---
description: Erklärende Kommentare zu komplexen oder nicht-offensichtlichen Code-Abschnitten hinzufügen
argument-hint: "[Datei oder Funktion]"
---
Fügen Sie erklärende Kommentare zum Code hinzu bei: $ARGUMENTS

Regeln:
- Kommentieren Sie das WARUM, nicht das WAS. Wiederholen Sie nie, was der Code bereits aussagt.
- Ein guter Kommentar erklärt: eine verborgene Einschränkung, eine nicht-offensichtliche Algorithmus-Wahl, eine Eigenheit
  einer externen API, einen Performance-Tradeoff oder eine Invariante, die gelten muss.
- Schlechter Kommentar: `// i erhöhen` — der Code sagt das bereits.
- Guter Kommentar: `// Index 0 überspringen — die API gibt dort einen Sentinel-Wert zurück, keine echten Daten`.

Prozess:
1. Lesen Sie die Zieldatei oder Funktion vollständig, bevor Sie etwas schreiben.
2. Identifizieren Sie jeden Block, bei dem ein kompetenter Leser innehalten und „warum?" fragen würde.
3. Schreiben Sie für jeden solchen Block einen einzeiligen Kommentar (maximal zwei Zeilen) darüber.
4. Wenn eine Funktion oder Methode einen nicht-offensichtlichen Vertrag hat (Vorbedingungen, Nebenwirkungen, Reihenfolge-
   anforderung), fügen Sie einen kurzen Header-Kommentar hinzu, der nur angibt, was aus der Signatur nicht offensichtlich ist.
5. Entfernen Sie vorhandene Kommentare, die nur beschreiben, was der Code tut — sie erzeugen Lärm.
6. Fügen Sie nicht zu jeder Funktion einen Kommentar hinzu. Nur wo echte Mehrdeutigkeit existiert.

Kommentar-Stil:
- Entsprechen Sie dem existierenden Kommentar-Stil in der Datei (Sprache, Formatierung, Kapitalisierung).
- Für JavaScript/TypeScript: `//` für inline, `/** */` nur für öffentliche API JSDoc.
- Für Python: `#` inline; Docstrings nur für öffentliche Funktionen/Klassen, eine Zeile wenn möglich.
- Keine Block-Kommentare, die ganze Abschnitte erklären, es sei denn, der Abschnitt ist ein nicht-trivialer Algorithmus.

Nach dem Bearbeiten:
- Geben Sie jeden Ort an, an dem Sie einen Kommentar hinzugefügt oder entfernt haben, mit Datei:Zeile und einem Satz
  Grund für die Änderung.
- Formatieren Sie keinen umgebenden Code neu. Nur chirurgische Änderungen.
- Wenn $ARGUMENTS auf ein ganzes Verzeichnis zeigt, verarbeiten Sie jede Datei, aber überspringen Sie generierte Dateien,
  Vendor-Code und Test-Fixtures.
