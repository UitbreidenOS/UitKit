# Claude Cowork — GUI Agentic AI für Non-Technical Teams

Claude Cowork ist die GUI-basierte Version von Claudes agentic Fähigkeiten — kein Terminal, kein Code, keine Konfiguration erforderlich. Es ist für PMs, Vermarkter, Finance-Teams und kleine Geschäftsinhaber gebaut, die autonome KI-Unterstützung ohne Entwickler-Setup benötigen. Während Claude Code in einem Terminal arbeitet, funktioniert Cowork über eine Point-and-Click-Desktop- und Web-Schnittstelle, die von der gleichen zugrunde liegenden Agent-Fähigkeit unterstützt wird.

---

## Was Cowork ist vs. Claude Code

| Feature | Claude Cowork | Claude Code |
|---------|---|---|
| Schnittstelle | Web + Desktop GUI | Terminal CLI |
| Technische Anforderung | Keine | Vertraut mit Terminal |
| Dateizugriff | Vom Benutzer ausgewählter Ordner (GUI-Picker) | Aktuelles Verzeichnisbaum |
| Connectors | Google Drive, Gmail, Docusign, FactSet | MCP-Server (manuelle Konfiguration) |
| Slash Commands | Strukturierte Formulare (Felder ausfüllen) | Rohe Text-Befehle |
| Automatisierung | Click-to-Configure Workflows | Hooks + settings.json |
| Zielgruppe | Non-Technical Teams | Entwickler |
| Agent-Delegation | Visuelle Agent Cards | Subagents via CLAUDE.md |

Beide verwenden die gleichen Claude-Modelle. Cowork ist die Bedienererfahrung; Claude Code ist die Entwicklererfahrung.

---

## Connectors einrichten

Cowork verbindet sich mit externen Tools über Connectors — OAuth-basierte Integrationen, die einmal vom Cowork-Einstellungsfenster konfiguriert werden. Keine API-Schlüssel, keine Konfigurationsdateien.

| Connector | Was Claude tun kann |
|-----------|---|
| Google Drive | Dateien und Ordner lesen/schreiben, nach Inhalt suchen |
| Gmail | Emails lesen, Antworten entwurfen, mit Genehmigung versenden |
| Google Calendar | Events anzeigen und erstellen, Verfügbarkeit finden |
| Google Sheets | Tabellenkalkulationsdaten lesen und aktualisieren |
| Docusign | Dokumente zur Signatur versenden, Status verfolgen |
| FactSet | Finanzdata-Abfragen, Marktdaten-Abruf |
| Slack (Plugin) | Nachrichten posten, Kanäle lesen, Chronik durchsuchen |
| Linear (Plugin) | Issues erstellen, Status aktualisieren, Projekt-Boards lesen |

Jeder Connector erfordert eine einmalige OAuth-Autorisierung. Claude liest oder schreibt nur, wenn ein Workflow explizit diese Aktion auslöst — er fragt Connectors nicht im Hintergrund ab.

---

## Slash Commands mit strukturierten Formularen

Anders als Claude Codes kostenlose Text-Befehle öffnen Cowork Slash Commands strukturierte Formulare, die Fehler verhindern und Automatisierung ohne Prompt Engineering-Kenntnisse zugänglich machen.

```
/generate-report
  ├── Report type:   [Weekly Summary] [Monthly P&L] [Custom]
  ├── Date range:    [from ____] [to ____]
  ├── Include:       [x] Charts  [x] Raw data  [ ] Executive summary
  └── Output format: [PDF] [Google Slides] [Email]

/email-triage
  ├── Inbox:         [Primary] [All labels] [Specific label: ____]
  ├── Action:        [Summarize] [Draft replies] [Categorize + tag]
  └── Approval:      [Auto-send] [Review before send]

/meeting-prep
  ├── Meeting:       [pull from calendar ▼]
  ├── Context docs:  [attach from Drive]
  └── Output:        [Briefing doc] [Talking points] [Both]
```

Benutzerdefinierte Befehle können als benannte Workflows gespeichert und mit Teamkollegen geteilt werden.

---

## Common Cowork Workflows

### Wöchentliche Berichterstellung
Ziehen Sie Daten aus Google Drive und FactSet, generieren Sie ein formatiertes PDF und versenden Sie es an eine Verteilerliste — zeitgesteuert oder manuell ausgelöst.

### Email Triage
Lesen Sie den Posteingang, kategorisieren Sie nach Thema oder Priorität, erstellen Sie Antworten für hochprioritäre Threads und zeigen Sie sie zur One-Click-Genehmigung vor dem Versenden an.

### Dokument-Workflows
Lesen Sie Verträge in Google Drive, extrahieren Sie wichtige Klauseln und Daten, kennzeichnen Sie Anomalien und leiten Sie zu Docusign zur Signatur mit vorausgefüllten Feldern.

### Meeting-Vorbereitung
Lesen Sie den Kalender des nächsten Tages, ziehen Sie relevante Dokumente für jedes Meeting aus Drive und generieren Sie ein einseiteriges Briefing, das Kontext, Teilnehmende und offene Punkte abdeckt.

### Standup-Zusammenfassungen
Lesen Sie Slack-Aktivität und Linear-Ticket-Updates aus den letzten 24 Stunden, generieren Sie eine Standup-Zusammenfassung nach Teamkollege und posten Sie zum Standup-Kanal.

### Finanzielle Übersicht
Fragen Sie FactSet nach Portfolio-Daten ab, ziehen Sie Istdaten aus einem Google Sheet und produzieren Sie einen einseitigen P&L-Vergleich als Google Slides-Deck.

---

## Plugins

Cowork unterstützt Plugins — installierbare Workflow-Pakete, die neue Slash Commands und Connectors hinzufügen. Durchsuchen Sie verfügbare Plugins in der Cowork-Plugin-Galerie.

Plugin installieren:
1. Öffnen Sie Cowork-Einstellungen → Plugins
2. Durchsuchen Sie die Galerie oder fügen Sie eine Plugin-URL ein
3. Autorisieren Sie alle neuen Connectors, die das Plugin benötigt
4. Neue Slash Commands erscheinen sofort in der Befehlspalette

Plugins sind auf den Arbeitsbereich beschränkt — Installieren für Ihr Konto beeinflusst Teamkollegen nicht, es sei denn, sie installieren separat oder ein Admin zwingt es dem ganzen Arbeitsbereich auf.

---

## Automatisierung: Click-to-Configure vs. Hooks

Cowork-Automatisierung wird über einen visuellen Workflow-Builder konfiguriert — nein `settings.json`, keine Shell-Skripte.

| Trigger-Typ | Cowork | Claude Code-Äquivalent |
|---|---|---|
| Zeitgesteuert (Cron) | Time Picker im Workflow Builder | Cron-Job mit `claude` |
| Dateienänderung | Watch Folder Selector | `PostToolUse` Hook auf Write |
| Email empfangen | Gmail Connector Trigger | Kein direktes Äquivalent |
| Formular absenden | Webhook-Eingabe | Custom MCP-Tool |
| Manuell | Run-Schaltfläche | Direkte CLI-Invokation |

Für Teams, die Cowork-Automatisierung neben Claude Code-Automatisierung ausführen möchten: Cowork-Workflows können Webhook-URLs aufrufen, was es möglich macht, Claude Code-Pipelines von Cowork-Events aus auszulösen.

---

## Wann Cowork vs. Claude Code verwenden

**Cowork verwenden für:**
- Dokument-intensive Workflows (Verträge, Berichte, Decks)
- Email- und Kalender-Automatisierung
- Non-Technical Team-Mitglieder, die autonome KI-Unterstützung benötigen
- Business Operations-Arbeit, die in Google Workspace und ähnliche SaaS lebt
- No-Code Automation, die sonst Zapier oder Make erfordern würde

**Claude Code verwenden für:**
- Schreiben, Bearbeiten oder Debuggen von Code
- Terminal-Befehle und Shell-Skripte
- Komplexe mehrstufige technische Aufgaben mit konditionaler Logik
- Benutzerdefinierte Automatisierung mit Hooks und feingranularer Kontrolle
- Arbeit in einem Git-Repository

---
