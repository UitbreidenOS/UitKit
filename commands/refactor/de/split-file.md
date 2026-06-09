---
description: Teilen Sie eine zu große oder mit gemischten Anliegen behaftete Datei in fokussierte Module auf
argument-hint: "[file]"
---
Teilen Sie $ARGUMENTS in kleinere, einfach strukturierte Dateien auf.

1. Lesen Sie die gesamte Datei. Identifizieren Sie logische Cluster von Symbolen:
   - Gruppieren Sie nach Domänenbedenken (z. B. Authentifizierungslogik, DB-Abfragen, HTTP-Handler, Utility-Helfer)
   - Gruppieren Sie nach Typ (z. B. alle Typen/Interfaces zusammen, alle Konstanten zusammen), falls dies der Konvention des Projekts entspricht
   - Schauen Sie sich vorhandene Geschwisterdateien im selben Verzeichnis an, um das etablierte Aufteilungsmuster zu entsprechen

2. Schlagen Sie einen Aufteilungsplan vor, bevor Sie Änderungen vornehmen:
   - Listen Sie jeden neuen Dateinamen und die Symbole auf, die er enthalten wird
   - Identifizieren Sie alle Abhängigkeiten zwischen Dateien, die die Aufteilung erzeugt (Importe, die vorher nicht vorhanden waren)
   - Geben Sie an, welche Datei, falls vorhanden, zum Re-Export-Barrel wird (index.ts, __init__.py, mod.rs usw.)

3. Führen Sie die Aufteilung aus:
   - Erstellen Sie jede neue Datei nur mit den ihr zugewiesenen Symbolen
   - Fügen Sie alle notwendigen Import-Anweisungen hinzu — sowohl innerhalb der neuen Dateien als auch aus Dateien, die zuvor die Originaldatei importiert haben
   - Aktualisieren Sie die Originaldatei, um aus den neuen Modulen erneut zu exportieren, wenn Rückwärtskompatibilität erforderlich ist; andernfalls löschen Sie die Originaldatei
   - Entfernen Sie alle nun überflüssigen Importe innerhalb der neuen Dateien

4. Überprüfen Sie, dass jedes Symbol, das von außerhalb der Originaldatei erreichbar war, noch über denselben Importpfad erreichbar ist, oder dokumentieren Sie die Pfadänderung explizit.

5. Benennen Sie keine Symbole um, ändern Sie keine Logik und formatieren Sie Code nicht während der Aufteilung neu.

6. Ausgabe: Liste der neu erstellten Dateien, Symbole, die zu jeder verschoben werden, und alle Importpfade, die externe Aufrufer aktualisieren müssen.

Einschränkungen:
- Teilen Sie niemals mehr als 5 Dateien in einem Durchgang auf — wenn die Datei mehr erfordert, erklären Sie dies und stoppen Sie nach 5.
- Erstellen Sie keine Dateien, die kleiner als ca. 20 aussagekräftige Zeilen sind, es sei denn, die Domänengrenze ist außergewöhnlich klar.
- Passen Sie die neuen Dateinamen an die bestehende Benennungskonvention des Projekts an.
