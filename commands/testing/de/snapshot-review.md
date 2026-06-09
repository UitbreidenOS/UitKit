---
description: Überprüfen Sie veraltete oder überladene Snapshots und entscheiden Sie, ob Sie aktualisiert oder neu geschrieben werden sollen
argument-hint: "[snapshot file, test file, or directory]"
---
Snapshots überprüfen in: $ARGUMENTS

Schritte:

1. Snapshot-Dateien finden. Häufige Standorte:
   - Jest: `__snapshots__/*.snap` neben Testdateien
   - Vitest: gleiche Struktur wie Jest
   - Storybook: `*.stories.snap`
   - Wenn das Argument auf eine Testdatei verweist, finden Sie die zugehörige `.snap`-Datei.

2. Für jeden Snapshot im Umfang bewerten:

   **Größe**
   - Zählen Sie serialisierte Zeilen. Markieren Sie alle Snapshots mit mehr als 50 Zeilen als Kandidaten für den Austausch.
   - Große Snapshots verschleiern oft die eigentliche Assertion — die Absicht ist versteckt.

   **Stabilität**
   - Identifizieren Sie Inhalte, die sich bei jedem Durchlauf ändern: Zeitstempel, generierte IDs, Speicheradressen, zufällige Werte, Build-Hashes.
   - Diese machen Snapshots unzuverlässig und sollten maskiert oder ersetzt werden.

   **Spezifität**
   - Bestimmen Sie, was der Test tatsächlich zu überprüfen versucht. Wenn ein Snapshot eine gesamte gerenderte Komponente erfasst, aber der Test „rendert den Schaltfläche Absenden" heißt, ist der Snapshot zu spezifisch.

   **Duplizierung**
   - Markieren Sie Snapshots über mehrere Tests hinweg, die denselben Subtree mit geringen Abweichungen erfassen — sie können möglicherweise zusammengefasst werden.

3. Für jeden markierten Snapshot empfehlen Sie eine der folgenden Optionen:
   - **Aktualisieren** — der Snapshot ist in der Struktur korrekt, aber veraltet; führen Sie `--updateSnapshot` aus
   - **Ersetzen** — ersetzen Sie den Snapshot durch gezielt Eigenschaften Assertions (zeigen Sie den Ersatz)
   - **Maskieren** — behalten Sie den Snapshot, aber fügen Sie Serializer-Transformationen oder `expect.any()` hinzu, um flüchtige Werte zu neutralisieren
   - **Löschen** — der Snapshot dupliziert einen anderen Test oder liefert kein Signal; entfernen Sie ihn

4. Wenden Sie Ersetzungen und Löschungen an, die eindeutig sind. Aktualisieren Sie veraltete Snapshots nicht automatisch — markieren Sie sie, damit der Benutzer sie mit `--updateSnapshot` bestätigen kann.

5. Für jeden Ersatz zeigen Sie:
   - Den ursprünglichen Snapshot (gekürzt, wenn >10 Zeilen)
   - Die neuen Assertion(s), die ihn ersetzen
   - Warum dies wartbarer ist

6. Mit einer Zusammenfassung abschließen: X Snapshots überprüft, Y aktualisiert, Z durch Assertions ersetzt, W gelöscht, V zur manuellen Überprüfung markiert.
