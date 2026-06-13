---
description: Überholte oder aufgeblähte Snapshots überprüfen und Update vs. Rewrite entscheiden
argument-hint: "[Snapshot-Datei, Testdatei oder Verzeichnis]"
---
Überprüfe Snapshots in: $ARGUMENTS

Schritte:

1. Lokalisiere Snapshot-Dateien. Häufige Speicherorte:
   - Jest: `__snapshots__/*.snap` neben Testdateien
   - Vitest: gleiches Muster wie Jest
   - Storybook: `*.stories.snap`
   - Wenn das Argument auf eine Testdatei verweist, finde deren zugehörige `.snap`-Datei.

2. Für jeden Snapshot im Umfang bewerten:

   **Größe**
   - Zähle serialisierte Zeilen. Markiere jeden Snapshot mit mehr als 50 Zeilen als Kandidat für eine Ersetzung.
   - Große Snapshots verdecken oft die tatsächliche Assertion — die Intention ist verborgen.

   **Stabilität**
   - Identifiziere Inhalte, die sich bei jeder Ausführung ändern: Zeitstempel, generierte IDs, Speicheradressen, Zufallswerte, Build-Hashes.
   - Diese machen Snapshots unzuverlässig und sollten maskiert oder ersetzt werden.

   **Spezifität**
   - Bestimme, was der Test tatsächlich verifiziert. Wenn ein Snapshot eine komplette gerenderte Komponente erfasst, aber der Test "renders the submit button" heißt, ist der Snapshot über-spezifiziert.

   **Duplikation**
   - Markiere Snapshots über mehrere Tests hinweg, die dieselbe Substruktur mit geringen Abweichungen erfassen — sie könnten reduzierbar sein.

3. Für jeden markierten Snapshot, empfehle eines von:
   - **Update** — der Snapshot ist in der Struktur korrekt, aber veraltet; führe `--updateSnapshot` aus
   - **Replace** — ersetze den Snapshot durch gezielte Property-Assertions (zeige die Ersetzung)
   - **Mask** — behalte den Snapshot, aber füge Serializer-Transformationen oder `expect.any()` hinzu, um flüchtige Werte zu neutralisieren
   - **Delete** — der Snapshot dupliziert einen anderen Test oder bietet kein Signal; entferne ihn

4. Wende Ersetzungen und Löschungen an, die eindeutig sind. Aktualisiere nicht automatisch veraltete Snapshots — markiere sie für den Benutzer, um mit `--updateSnapshot` zu bestätigen.

5. Für jede Ersetzung, zeige:
   - Den ursprünglichen Snapshot (gekürzt, wenn >10 Zeilen)
   - Die neue Assertion(en), die ihn ersetzen
   - Warum dies wartbarer ist

6. Beende mit einer Zusammenfassung: X Snapshots überprüft, Y aktualisiert, Z durch Assertions ersetzt, W gelöscht, V gekennzeichnet für manuelle Überprüfung.
