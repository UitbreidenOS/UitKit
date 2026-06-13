---
description: Merge-Konflikte im aktuellen Arbeitsverzeichnis erklären und auflösen
argument-hint: "[file]"
---
Führen Sie `git diff --diff-filter=U --name-only` aus, um alle Dateien mit ungelösten Merge-Konflikten aufzulisten. Falls $ARGUMENTS angegeben ist, beschränken Sie die Analyse auf diese Datei.

Lesen Sie für jede Datei mit Konflikten (oder nur die angegebene) den Rohinhalten und suchen Sie jeden Konfliktmarker-Block:

```
<<<<<<< HEAD
... unsere Änderung ...
=======
... ihre Änderung ...
>>>>>>> branch-name
```

Für jeden Konfliktblock:
1. Identifizieren Sie die HEAD-Seite und die eingehende Seite durch Lesen des Kontexts (Funktionsname, Variablengültigkeitsbereich, Import-Block, Konfigurationsschlüssel usw.).
2. Beschreiben Sie in einem Satz, was jede Seite versucht zu tun.
3. Bestimmen Sie die korrekte Auflösung unter Verwendung dieser Prioritätsreihenfolge:
   - Wenn eine Seite eine Null-Operation relativ zur anderen ist (z. B. nur Leerzeichen oder ein Revert), bevorzugen Sie die aussagekräftige Änderung.
   - Wenn beide Seiten unterschiedliche Logik hinzufügen, führen Sie sie zusammen (die Reihenfolge ist wichtig – erklären Sie Ihre Sortierungswahl).
   - Wenn die beiden Seiten semantisch inkompatibel sind, teilen Sie dies mit und fragen Sie den Benutzer, welche Absicht behalten werden soll, bevor Sie eine Auflösung schreiben.
4. Schreiben Sie den aufgelösten Block – ohne Konfliktmarker, ohne willkürlich hinzugefügte Leerzeilen am Ende.

Nach der Auflösung aller Blöcke in einer Datei zeigen Sie die vollständige aufgelöste Version jedes konfligierenden Chunks (nicht die ganze Datei, es sei denn, sie ist kurz).

Geben Sie dann eine Zusammenfassungstabelle aus:

| Datei | Konflikte gelöst | Maßnahme ergriffen |
|-------|------------------|-------------------|
| ...   | N                | zusammengeführt / unsere gewählt / ihre gewählt / bedarf Entscheidung |

Führen Sie `git add` oder `git commit` nicht aus. Ändern Sie keine Dateien auf der Festplatte, es sei denn, der Benutzer bestätigt die vorgeschlagenen Lösungen.

Wenn sich ein Konflikt in einer Lock-Datei befindet (`package-lock.json`, `yarn.lock`, `Cargo.lock`, `poetry.lock`), raten Sie dem Benutzer, die Lock-Datei zu löschen und neu zu generieren, anstatt sie manuell zu beheben, und überspringen Sie diese Datei.
