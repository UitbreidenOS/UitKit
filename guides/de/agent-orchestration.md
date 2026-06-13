# Leitfaden zur Agentenorchestrierung

Wie man Arbeit mit dem Unter-Agenten-System von Claude Code delegiert, parallelisiert und spezialisiert.

---

## Was Unter-Agenten sind

Ein Unter-Agent ist eine separate Claude-Instanz, die von der Elternsitzung gestartet wird, um eine spezifische, begrenzte Aufgabe zu erledigen. Er erhält:
- Ein frisches Kontextfenster (kein Sitzungsverlauf)
- Einen spezifischen Tool-Subset (wenn konfiguriert)
- Eine Modellauswahl (kann vom Elternteil abweichen)
- Einen Prompt, den Sie explizit schreiben

Unter-Agenten sind keine Magie — sie sind ein spezifisches Werkzeug für spezifische Probleme.

---

## Wann einen Unter-Agenten verwenden

Verwenden Sie einen Unter-Agenten, wenn die Aufgabe **klare Eingaben** und **klare Ausgaben** hat und **unabhängig vom aktuellen Sitzungszustand** ist.

**Gute Kandidaten:**
- 10 Dateien auf Sicherheitsprobleme überprüfen
- Eine spezifische Suche in der Codebasis durchführen
- Boilerplate für ein neues Modul generieren
- Eine Logdatei analysieren und eine Zusammenfassung zurückgeben

**Schlechte Kandidaten:**
- Aufgaben, die den vollständigen Sitzungskontext erfordern
- Aufgaben, die Hin-und-Her erfordern — Unter-Agenten sind einmalig
- Aufgaben, bei denen der Start-Overhead die Arbeit übersteigt

---

## 1. Delegationsmuster

Die Elternsitzung identifiziert eine begrenzte Aufgabe und übergibt sie.

**Schlüsselregel:** Der Unter-Agenten-Prompt muss eigenständig sein. Er hat keinen Zugang dazu, was die Elternsitzung getan hat. Briefen Sie ihn wie einen Kollegen, der gerade den Raum betreten hat.

**Was in den Unter-Agenten-Prompt einzuschließen ist:**
- Was Sie zu erreichen versuchen und warum
- Die spezifischen Dateien oder Verzeichnisse
- Das gewünschte Ergebnisformat
- Bereits getroffene Entscheidungen

---

## 2. Parallelisierungsmuster

Mehrere Unter-Agenten laufen gleichzeitig an unabhängigen Aufgaben.

**Wann parallelisieren:**
- Dieselbe Operation auf viele Dateien/Module angewendet werden soll
- Zwei wirklich unabhängige Aufgaben beide abgeschlossen werden müssen
- Forschungsaufgaben verschiedene Bereiche abdecken

**Git-Worktrees für parallele Code-Änderungen:**
```bash
git worktree add ../feature-branch-a feature-a
git worktree add ../feature-branch-b feature-b
```

**Parallelisierungs-Anti-Muster:**
- Parallelisieren von Aufgaben, die Zustand teilen (Schreibkonflikte)
- Parallele Aufgaben, bei denen eine von der Ausgabe der anderen abhängt

---

## 3. Spezialisierungsmuster (cavecrew)

Passen Sie Modell und Tools des Unter-Agenten an die Natur der Aufgabe an. Inspiriert vom **cavecrew**-Muster (Quelle: [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)) — spart ~60% Tokens im Vergleich zur Verwendung von Opus für jeden Unter-Agenten.

| Rolle | Modell | Tools | Verwenden wenn |
|---|---|---|---|
| Ermittler | Haiku 4.5 | Read, Bash (nur grep/find) | Dinge in der Codebasis lokalisieren — nur lesen, schnell |
| Ersteller | Sonnet 4.6 | Read, Edit, Write, Bash | Chirurgische 1–2 Datei-Änderungen |
| Prüfer | Haiku 4.5 | Read | Einen Diff oder eine Dateigruppe prüfen |
| Orchestrator | Opus 4.7 | Alle | Komplexe mehrstufige Koordination, Architekturentscheidungen |

---

## 4. Kontextübergabemuster

Wenn eine Sitzung bedeutenden Kontext angesammelt hat und Sie die Arbeit an einen neuen Agenten übergeben müssen.

**Struktur des Übergabe-Prompts:**
```
## Context
[Was dieses Projekt macht, kurz]
[Woran wir gearbeitet haben]
[In dieser Sitzung getroffene Entscheidungen]

## Files modified
[Liste mit kurzem Grund für jede Änderung]

## Current state
[Was erledigt, was nicht, was blockiert]

## Your task
[Spezifische, begrenzte Aufgabe für den neuen Agenten]

## Constraints
[Getroffene Entscheidungen, die nicht neu diskutiert werden sollen]
```

---

## 5. Harte vs. weiche Abhängigkeiten

**Harte Abhängigkeit:** Die nachgelagerte Aufgabe schlägt ohne die vorgelagerte Einrichtung explizit fehl.
- Signalisieren Sie dies explizit: "Diese Skill erfordert Einrichtung — führen Sie zuerst `/setup` aus."

**Weiche Abhängigkeit:** Die Aufgabe funktioniert, produziert aber ohne Einrichtung eine Ausgabe geringerer Qualität.
- Nicht anhalten. Elegant degradieren und die Lücke notieren.

---

## 6. Umfangskontrolle für Unter-Agenten

Jeder Unter-Agent sollte ein explizites Umfangslimit haben.

**In jeden Unter-Agenten-Prompt einschließen:**
```
## Scope
- Read: yes
- Write/Edit: [nur spezifische Dateien ODER nein]
- Shell commands: [spezifische erlaubte Befehle ODER keine]
- Network: [ja/nein]

## Do not
- Do not modify files outside [directory]
- Do not make git commits
- Do not install packages
```

---

## 7. Ergebnisse von Unter-Agenten zurückgeben

**Dateien bevorzugen für:**
- Ergebnislisten, über die der Elternteil iterieren wird
- Generierten Code, den der Elternteil prüfen wird
- Mehrfach referenzierte Berichte

**Rückgabemeldungen bevorzugen für:**
- Einfache Ja/Nein-Antworten
- Kurze strukturierte Daten
- Statusberichte

---

## Schnellreferenz

| Ziel | Muster |
|---|---|
| Begrenzte, eigenständige Aufgabe | Delegation |
| Gleiche Aufgabe auf vielen Dateien | Parallelisierung |
| Schreibgeschützte Suche/Lokalisierung | Ermittler (Haiku) |
| Chirurgische Code-Änderung | Ersteller (Sonnet) |
| Diff/Datei-Prüfung | Prüfer (Haiku) |
| Komplexe mehrstufige Koordination | Orchestrator (Opus) |
| Sitzungsübergabe | Kontextübergabemuster |
| Große Unter-Agenten-Ausgabe | In Datei schreiben, Elternteil liest |
| Kurzes strukturiertes Ergebnis | Rückgabemeldung |

---

## Arbeiten Sie mit uns
