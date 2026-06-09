---
description: Merge-Konflikte im aktuellen Arbeitsverzeichnis erklären und auflösen
argument-hint: "[file]"
---
Führen Sie `git diff --diff-filter=U --name-only` aus, um alle Dateien mit ungelösten Merge-Konflikten aufzulisten. Falls $ARGUMENTS angegeben ist, beschränken Sie die Analyse auf diese Datei.

Für jede Datei mit Konflikten (oder nur die angegebene), lesen Sie den unverarbeiteten Inhalt und lokalisieren Sie jeden Konfliktmarker-Block:

```
<<<<<<< HEAD
... ours ...
=======
... theirs ...
>>>>>>> branch-name
```

Für jeden Konfliktblock:
1. Identifizieren Sie die HEAD-Seite und die eingehende Seite, indem Sie den umgebenden Kontext lesen (Funktionsname, Variablengeltungsbereich, Importblock, Konfigurationsschlüssel usw.).
2. Geben Sie in einem Satz an, was jede Seite zu tun versucht.
3. Bestimmen Sie die korrekte Auflösung mit dieser Prioritätsreihenfolge:
   - Wenn eine Seite eine Null-Operation relativ zur anderen ist (z. B. nur Whitespace oder ein Revert), bevorzugen Sie die substanzielle Änderung.
   - Wenn beide Seiten unterschiedliche Logik hinzufügen, führen Sie sie zusammen (die Reihenfolge ist wichtig – erklären Sie Ihre Reihenfolgenentscheidung).
   - Wenn die beiden Seiten semantisch inkompatibel sind, teilen Sie dies mit und fragen Sie den Benutzer, welche Absicht behalten werden soll, bevor Sie eine Auflösung schreiben.
4. Schreiben Sie den aufgelösten Block – keine Konfliktmarker, keine zusätzlichen leeren Zeilen.

Nach dem Auflösen aller Blöcke in einer Datei zeigen Sie die vollständige aufgelöste Version jedes Konfliktblocks (nicht die ganze Datei, es sei denn, sie ist kurz).

Geben Sie dann eine Zusammenfassungstabelle aus:

| Datei | Konflikte aufgelöst | Durchgeführte Aktion |
|-------|---------------------|----------------------|
| ...   | N                   | zusammengeführt / unsere gewählt / ihre gewählt / benötigt Entscheidung |

Führen Sie nicht `git add` oder `git commit` aus. Ändern Sie keine Dateien auf der Festplatte, es sei denn, der Benutzer bestätigt die vorgeschlagenen Auflösungen.

Wenn sich ein Konflikt in einer Lock-Datei befindet (`package-lock.json`, `yarn.lock`, `Cargo.lock`, `poetry.lock`), empfehlen Sie dem Benutzer, die Lock-Datei zu löschen und neu zu generieren, anstatt sie manuell aufzulösen, und überspringen Sie diese Datei.
