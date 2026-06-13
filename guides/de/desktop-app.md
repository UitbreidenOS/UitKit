# Claude Code Desktop-App

Vollständiger Leitfaden zum Panel-basierten Arbeitsbereich, der in Claude Code v1.2581.0 eingeführt wurde.

---

## Überblick

Die Claude Code Desktop-App ist nicht ein Chat-Fenster mit einer Seitenleiste. Sie ist ein vollständiger Panel-basierter Arbeitsbereich — mehrere unabhängig vergrößerbare Panels, die Claude und der Entwickler gleichzeitig teilen. Jeder Paneltyp erfüllt einen bestimmten Zweck und sie komponieren sich in Layouts, die pro Projekt gespeichert werden.

**Anforderungen:** Desktop v1.2581.0 oder später. Download von [claude.ai/code](https://claude.ai/code).

Der Kernwechsel von Terminal Claude Code: Sie wechseln nicht mehr den Kontext zwischen Ihrem Editor, Browser und Terminal. Der Arbeitsbereich hält alle und Claude kann die gleichen Panels wie Sie sehen und mit ihnen interagieren.

---

## Panel-System

### Panel-Typen

**Chat-Panel**
Die Hauptkonversationsschnittstelle. Immer vorhanden — sie kann nicht geschlossen werden. Alle Eingabeaufforderungen, Antworten und Werkzeugaufrufzusammenfassungen erscheinen hier.

**Diff-Panel** — `Cmd+Shift+D`
Interaktiver Diff-Viewer. Zeigt Diffs pro Turn, nicht nur den kummulativen Endzustand. Navigieren Sie rückwärts durch Turns, um genau zu sehen, was sich wann geändert hat. Pro-Datei-Aufschlüsselung mit erweiterbaren Abschnitten. Unterstützt Inline-Kommentare auf spezifischen Zeilen.

**Vorschau-Panel** — `Cmd+Shift+P`
Rendert HTML-Dateien live ohne Browser und öffnet PDFs, Bilder und Videos inline. Auto-Updates wenn sich die Datei auf der Festplatte ändert. Claude kann dieses Panel zur visuellen Überprüfung verwenden — Screenshots machen und das DOM inspizieren — ohne den Arbeitsbereich zu verlassen. Die Option `Sitzungen beibehalten` bewahrt Cookies und Auth-Status über Neustarts hinweg.

**Terminal-Panel** — `Ctrl+\``
Integriertes Terminal. Läuft innerhalb des Projektverzeichnisses. Nützlich zum Ausführen von Tests, Betrachten von Logs oder Ausführen von Befehlen parallel zu einer aktiven Claude-Sitzung ohne Fensterwechsel.

**Datei-Panel**
Öffnet, wenn Sie auf einen Dateipfad klicken, der im Chat oder im Diff-Viewer erwähnt wird. Bietet einen direkten Editor für gezielte Änderungen. Speichert sofort auf der Festplatte beim Speichern. Warnt, wenn sich die Datei auf der Festplatte seit dem Öffnen geändert hat. Nicht vollständige IDE — geeignet für fokussierte Änderungen, nicht für große strukturelle Refactors.

**Plan-Panel**
Sichtbar während Plan-Modus. Zeigt Claudes aktuellen Plan als strukturierte Liste. Updates, wenn Claude den Plan während einer Aufgabe überarbeitet.

**Aufgaben-Panel**
Aufgabenlistenansicht. Zeigt aktive und abgeschlossene Aufgaben über die aktuelle Sitzung.

**Subagent-Panel**
Zeigt laufende Subagenten und ihren aktuellen Status — welches Tool jeder ausführt, ob es auf Eingabe wartet und wann es sich vervollständigt. Nützlich zur Überwachung paralleler Agent-Arbeit ohne Chat-Abfragen.

### Panel-Kontrollen

| Aktion | Methode |
|---|---|
| Panel umpositionieren | Panel-Header ziehen |
| Panel umgröße | Panel-Kante ziehen |
| Fokussiertes Panel schließen | `Cmd+\` |
| Zusätzliche Panels öffnen | Ansichtmenü |

Layouts werden pro Projekt gespeichert. Das Neu öffnen eines Projekts stellt die zuletzt verwendete Panel-Anordnung wieder her.

---

## Parallele Sitzungen

Die Sessions-Seitenleiste auf der linken Seite listet alle aktiven Sessions für das aktuelle Fenster auf. Klicken Sie, um zwischen ihnen zu wechseln. Jede Sitzung hat unabhängigen Kontext — das Wechseln unterbricht nicht die andere Sitzung.

`Cmd+;` öffnet einen **Seiten-Chat**, der nicht die Hauptsitzungsgeschichte beeinflusst. Der Seiten-Chat sieht den vollständigen aktuellen Kontext, hinterlässt aber keine Spur im Gespräch, wenn er geschlossen wird. Verwenden Sie ihn für schnelle Fragen während einer Aufgabe — einen Wert überprüfen, nach einem Muster fragen — ohne die Sitzung mit explorativem Hin-und-Her zu verschmutzen.

Ziehen Sie Panel per Drag-and-Drop an, um parallele Ansichten über Sessions anzuordnen. Ein häufiges Layout: Hauptsitzungs-Chat auf der linken Seite, Subagenten-Panel auf der rechten Seite, Diff-Viewer unten.

---

## Vorschau-Panel

Das Vorschau-Panel ist das höchste Leverage-Panel für Frontend- und Dokumentarbeit.

- Öffnet HTML gerendert live — Änderungen an der Datei auf der Festplatte erscheinen sofort, kein Browserneuladung
- Öffnet PDFs, Bilder und Video-Dateien inline
- Claude kann einen Screenshot der Vorschau machen und als visuelle Überprüfung vor dem Festschreiben einer Änderung verwenden
- Claude kann das DOM durch das Vorschau-Panel inspizieren und Layout-Probleme ohne separate Browser-Devtools-Sitzung erfassen
- `Sitzungen beibehalten` behält Cookies und Authentifizierungsstatus über Neustarts — nützlich für die Vorschau authentifizierter UI-Zustände
- Das Panel aktualisiert sich automatisch beim Dateispeicher — keine manuelle Aktualisierung

Verwenden Sie dies anstelle eines Browsers zum Iterieren auf der Benutzeroberfläche. Halten Sie das Vorschau-Panel offen neben dem Chat-Panel bei der Arbeit an HTML-, CSS- oder Template-Datei.

---

## Datei-Editor-Panel

Klicken Sie auf einen Dateipfad in der Chat-Ausgabe oder im Diff-Viewer, um die Datei im Datei-Editor-Panel zu öffnen.

- Änderungen speichern auf der Festplatte sofort beim Speichern
- Das Panel warnt, wenn die Datei auf der Festplatte seit dem Öffnen geändert wurde
- Nützlich zum Überprüfen von Claudes Schreiben und zum direkten Vornehmen kleiner Korrektionen
- Nicht für große Refactors gedacht — öffnen Sie eine richtige IDE dafür

---

## Diff-Viewer

Der Diff-Viewer zeigt Pro-Turn-Diffs, nicht nur den endgültigen akkumulierten Zustand.

- Navigieren Sie Turn-by-Turn mit dem Turn-Selector oben im Panel
- Sehen Sie genau welche Zeilen in welcher Antwort sich geändert haben
- Pro-Datei-Aufschlüsselung mit erweiterbaren Abschnitten
- Fügen Sie Inline-Kommentare auf spezifischen Zeilen hinzu — Kommentare sind in nachfolgenden Turns für Claude sichtbar

Öffnen Sie mit `Cmd+Shift+D`. Nützlich beim Überprüfen einer langen Multi-Step-Aufgabe, um die Abfolge von Änderungen zu verstehen, nicht nur das Ergebnis.

---

## Auto-Archivierung

Sessions werden automatisch archiviert, wenn die verlinkte Pull-Anfrage zusammengeführt wird. Archivierte Sessions werden aus der aktiven Sessions-Seitenleiste entfernt, bleiben aber suchbar. Öffnen Sie jede archivierte Session aus der Archive-Registerkarte.

Manuelles Archivieren ist auch verfügbar: Klicken Sie mit rechts auf eine Session in der Seitenleiste, um sie sofort zu archivieren.

---

## Tastenkombinationen

| Aktion | Verknüpfung |
|---|---|
| Diff-Panel öffnen | `Cmd+Shift+D` |
| Vorschau-Panel öffnen | `Cmd+Shift+P` |
| Terminal-Panel öffnen | `Ctrl+\`` |
| Seiten-Chat öffnen | `Cmd+;` |
| Fokussiertes Panel schließen | `Cmd+\` |
| Neue Sitzung | `Cmd+N` |
| Auf Session 1–9 wechseln | `Cmd+[1-9]` |
| Eingabeaufforderung absenden | `Enter` |
| Neue Zeile in Eingabeaufforderung | `Shift+Enter` |

---

## Benutzerdefinierte Themen

Setzen Sie Helles, Dunkles oder System-Thema via `/config`. Für Power-User ist benutzerdefinierte CSS-Injektion verfügbar — injizieren Sie ein Stylesheet, um ein beliebiges visuelles Element im Arbeitsbereich zu überschreiben. Dies ist eine erweiterte Option ohne offizielle API-Stabilitätsgarantie.

---

## Tipps

- Halten Sie das Vorschau-Panel offen bei der Iteration auf einer beliebigen Benutzeroberfläche. Claude verwendet es für visuelle Überprüfung, bevor eine Aufgabe als erledigt erklärt wird.
- Verwenden Sie `Cmd+;` für Seiten-Chats während aktiver Aufgaben — stellen Sie eine schnelle Frage zur Codebasis, ohne dass sie im Sitzungskontext erscheint, den Claude voranbringt.
- Öffnen Sie ein Terminal-Panel neben Chat beim Ausführen von Tests. Führen Sie die Test-Suite direkt aus, ohne den Arbeitsbereich zu verlassen.
- Das Subagenten-Panel zeigt Echtzeit-Status für parallele Agenten — überprüfen Sie es statt Claude nach einer Statusaktualisierung zu fragen.
- Ziehen Sie Sessions in der Seitenleiste, um sie umzuordnen. Halten Sie die aktivsten Sessions oben.
- Die Pro-Turn-Navigation des Diff-Viewers ist der schnellste Weg zu überprüfen, was eine lange Agent-Aufgabe wirklich getan hat — verwenden Sie sie vor dem Zusammenführen.

---
