# Cursor + Claude Code Tandem-Workflow

## Wann aktivieren
Der Benutzer nutzt sowohl Cursor als auch Claude Code und fragt, wie man sie effektiv zusammen nutzt; der Benutzer erwähnt das Wechseln zwischen IDE und Terminal-KI; der Benutzer möchte wissen, welches Werkzeug für eine bestimmte Aufgabe zu verwenden ist, wenn beide verfügbar sind.

## Wann NICHT verwenden
Der Benutzer hat nur eines der beiden Werkzeuge; der Benutzer stellt Fragen zu einem Werkzeug isoliert ohne Bezug zum anderen; der Benutzer möchte einen Vergleich, um sich für den Kauf zu entscheiden.

## Anweisungen

**Werkzeugrollen — halten Sie sie unterschiedlich :**

- **Cursor** = intelligente IDE. Inline-Autovervollständigung, Multi-Datei-Chat, Codebase-Suche, schnelle Bearbeitungen, Komponentenschreiben, Diff-Überprüfung, Erkundung unbekannten Codes.
- **Claude Code** = autonomer Terminal-Agent. Führt Shell-Befehle aus, orchestriert Sub-Agenten, verwaltet mehrstufige Aufgaben über viele Dateien, erstellt Commits, richtet Infrastruktur ein.

**Task-Routing — welches Werkzeug für welche Arbeit :**

Gute Cursor-Aufgaben:
- Neue Komponenten oder Funktionen schreiben
- Einen Diff vor dem Commit überprüfen
- Eine unbekannte Codebase erkunden, um die Struktur zu verstehen
- Schnelle Umbenennungen und lokale Refaktorisierungen
- Inline-Dokumentation

Gute Claude Code-Aufgaben:
- Komplette Test-Suite ausführen, dann Fehler beheben
- Umfassende Refaktorisierungen über 20+ Dateien
- GitHub Actions, Dockerfiles oder CI/CD-Configs einrichten
- Datenbank-Migrationen
- Alles, das Shell-Befehle oder Sub-Agenten-Orchestrierung erfordert
- End-to-End-Feature-Generierung von Spec zu PR

**Gemeinsamer Kontext über CLAUDE.md :**
Beide Werkzeuge lesen `CLAUDE.md`. Schreiben Sie Ihre Konventionen, Benennungsregeln, architektonische Entscheidungen und Vorlieben einmal auf — beide Werkzeuge respektieren sie automatisch. Dies ist der wichtigste Integrationspunkt.

**Kritische Regel — lassen Sie nie beide gleichzeitig dieselbe Datei bearbeiten.** Dies verursacht Git-Konflikte, die keines der beiden Werkzeuge sauber auflösen kann. Beenden Sie die Claude Code-Aufgabe, committen Sie, öffnen Sie dann in Cursor.

**Übergabemuster :**
1. Claude Code führt die mehrstufige Aufgabe aus → committed das Ergebnis
2. Sie öffnen den Commit in Cursor zum Verfeinern, Code-Review oder Polieren
3. Cursor-Bearbeitungen gehen in einen Follow-up-Commit

**Paralleles Nutzungsmuster :**
Führen Sie Claude Code im Hintergrund bei einer langen Aufgabe (Test-Suite, Migration, Build) aus, während Sie in Cursor an nicht verwandten Dateien arbeiten. Claude Code meldet sich ab, wenn es fertig ist, ohne Ihren Editor-Workflow zu blockieren.

## Beispiel

"Ich nutze Cursor zum Schreiben von React-Komponenten und zum Erkunden der Codebase. Ich wechsle zum Claude Code-Terminal, wenn ich folgendes benötige: die komplette Test-Suite ausführen, über 30 Dateien refaktorisieren, GitHub Actions einrichten oder eine Datenbank-Migration durchführen. `CLAUDE.md` enthält unsere gemeinsamen Konventionen — beide Werkzeuge holen sie sich automatisch ohne zusätzliche Konfiguration."

---
