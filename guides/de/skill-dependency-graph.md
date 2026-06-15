# Anleitung zum Fähigkeits-Abhängigkeitsgraph

Diese Anleitung erklärt, wie man die Beziehungen zwischen Skills und Agenten in Claudient mithilfe der Abhängigkeitsgraph-Tools analysiert und visualisiert.

---

## Überblick

Das Claudient-Repository ist ein Netzwerk von Skills und Agenten. Im Laufe der Zeit verweisen Skills aufeinander — entweder nach Name, Funktionalität oder Kontext. Das Verständnis dieser Abhängigkeiten hilft Ihnen:

- **Cluster identifizieren**: Welche Skills funktionieren zusammen
- **Verwaiste identifizieren**: Skills, auf die niemand verweist (Kandidaten für Archivierung)
- **Brüchigkeit erkennen**: Skills mit zu vielen eingehenden Kanten (weit verbreitet abhängig, hohes Risiko bei Änderungen)
- **Refaktorierung planen**: Skills zusammenführen oder extrahieren, um Kopplung zu reduzieren

Die Abhängigkeitsgraph-Tools scannen alle `.md`-Dateien in den Verzeichnissen `skills/` und `agents/`, erkennen Querverweise durch Namenabgleich und produzieren drei Ausgabeformate: Mermaid-Diagramme, JSON-Adjazenzlisten und Zusammenfassungsstatistiken.

---

## Das Kernscript: `scripts/dependency-graph.js`

Dieses Node.js-Skript durchläuft die Verzeichnisse `skills/` und `agents/` und erstellt einen Graphen von Skill-zu-Skill- und Agent-zu-Agent-Verweisen.

### Wie es funktioniert

1. **Sammelt alle Namen**: Liest jede `.md`-Datei in `skills/` und `agents/` und extrahiert Dateinamen (kebab-case, in Kleinbuchstaben umgewandelt) als Knotenidentifikatoren.
2. **Findet Verweise**: Für jede Datei scannt ihr Inhalt (Groß-/Kleinschreibung ignoriert) auf Erwähnungen anderer Skills oder Agenten mit Wortgrenzabgleich durch Regex.
3. **Erstellt Adjazenzliste**: Ordnet jeden Skill/Agent den Skills/Agenten zu, auf die er verweist.
4. **Gibt aus**: Produziert Mermaid-Diagramm, JSON oder Statistiken je nach Flags.

### Verwendung

```bash
# Mermaid-Diagramm (Standard) — begrenzt auf die Top 50 Kanten
node scripts/dependency-graph.js

# JSON-Adjazenzliste — alle Kanten
node scripts/dependency-graph.js --json

# Nur Statistiken
node scripts/dependency-graph.js --stats
```

### Ausgabeformate

#### Mermaid-Diagramm-Ausgabe

```
graph LR
    agent_handoff["agent handoff"] --> session_handoff["session handoff"]
    skill_composition["skill composition"] --> agent_handoff["agent handoff"]
    ...
    %% ... zeigt Top 50 von 237 Kanten
```

Kopieren Sie dies in einen Markdown-Codeblock (verwenden Sie ` ```mermaid ... ``` `), um ein interaktives von-links-nach-rechts-Flussdiagramm in GitHub, Obsidian oder jedem Markdown-Viewer mit Mermaid-Unterstützung zu rendern.

**Hinweis**: Die Mermaid-Ausgabe ist auf 50 Kanten begrenzt, um überwältigende Diagramme zu vermeiden. Verwenden Sie `--json` für den vollständigen Graph.

#### JSON-Ausgabe

```json
{
  "agent-handoff": ["session-handoff", "agent-tracing"],
  "skill-composition": ["agent-handoff"],
  "rag-architect": ["prompt-caching", "llm-eval"],
  ...
}
```

Jeder Schlüssel ist ein Skill/Agent; der Wert ist ein sortiertes Array von Skills/Agenten, auf die verwiesen wird. Verwenden Sie dies für programmatische Analyse oder zur Eingabe in Visualisierungstools.

#### Statistik-Ausgabe

```
Dependency Graph Statistics:

  Total skills/agents: 427
  Knoten mit Verweisen: 189
  Gesamtkanten: 512
  Verwaiste Knoten (keine Verweise): 238

  Top 10 am meisten verbunden:
    prompt-engineering: 24 Verweise
    agent-handoff: 18 Verweise
    claude-api: 16 Verweise
    llm-eval: 14 Verweise
    ...
```

Bietet eine Zusammenfassungsansicht: Gesamtknoten, wie viele Abhängigkeiten haben, Kantenzahl, Waisen-Zahl und die Top 10 am meisten referenzierten Skills/Agenten.

---

## Mit dem interaktiven Visualizer arbeiten: `scripts/visualize-graph.js`

Für interaktive Erkundung verwenden Sie den D3.js force-directed Graph Visualizer.

### Verwendung

```bash
# JSON aus Abhängigkeitsgraph generieren, an Visualizer pipen
node scripts/dependency-graph.js --json | node scripts/visualize-graph.js

# Oder JSON zuerst speichern, dann visualisieren
node scripts/dependency-graph.js --json > /tmp/graph.json
node scripts/visualize-graph.js < /tmp/graph.json
```

Dies gibt eine in sich geschlossene HTML-Datei mit einem interaktiven D3.js force-directed Graph aus. Öffnen Sie sie in einem Webbrowser, um:

- **Knoten ziehen**, um das Netzwerk zu erkunden
- **Zoomen und verschieben**, um zu navigieren
- **Über Knoten fahren**, um Verbindungen hervorzuheben
- **Auf Knoten klicken**, um sie zu fixieren/zu lösen
- **Knotengrad sehen** (In-Grad und Aus-Grad) in Tooltips

Der HTML enthält alle Abhängigkeiten eingebettet (keine externen Anfragen) und eignet sich für Präsentationen oder zum Teilen mit Teamkollegen.

---

## Häufige Workflows

### Alle Skills finden, die von einem bestimmten Skill abhängen

Fragen Sie die JSON-Ausgabe ab:

```bash
node scripts/dependency-graph.js --json | jq 'to_entries[] | select(.value[] == "prompt-caching") | .key'
```

Dies gibt alle Skills zurück, die auf `prompt-caching` verweisen.

### Stark verbundene Knoten identifizieren (Hub-Skills)

```bash
node scripts/dependency-graph.js --json | jq 'to_entries | map({name: .key, count: (.value | length)}) | sort_by(.count) | reverse | .[0:10]'
```

Top 10 Skills nach ausgehenden Verweisen.

### Verwaiste Skills finden (keine Abhängigkeiten)

```bash
node scripts/dependency-graph.js --json | jq 'to_entries[] | select(.value | length == 0) | .key'
```

Dies können eigenständige Skills, domänenspezifische Skills oder Kandidaten für Archivierung sein, wenn sie nicht aktiv gewartet werden.

### Auf zirkuläre Abhängigkeiten überprüfen

Inspizieren Sie den Graph manuell oder verwenden Sie den interaktiven Visualizer, um Zyklen zu erkennen. Hinweis: Die aktuelle Implementierung erkennt nur direkte Verweise; echte zirkuläre Abhängigkeitserkennung (A → B → A) würde eine Graphdurchquerung erfordern.

---

## Ergebnisse interpretieren

### Hoher Ausgangsgrad (viele ausgehende Kanten)

Ein Skill, der auf viele andere verweist. Beispiele:
- `agent-handoff` (verweist auf `session-handoff`, `agent-tracing`, etc.) — ein Skill, der mehrere Konzepte kombiniert
- `skill-composition` — eine Anleitung oder Meta-Skill, die beschreibt, wie andere Skills kombiniert werden

**Maßnahme**: Überprüfen Sie, dass Verweise notwendig sind. Konsolidieren Sie bei Duplizierung.

### Hoher Eingangsgrad (viele eingehende Kanten)

Ein Skill, auf den viele andere verweisen. Beispiele:
- `prompt-engineering` (referenziert von vielen höherstufigen Skills)
- `claude-api` (Grundlage für SDK-Skills)

**Maßnahme**: Behandeln Sie als stabile Kerninfrastruktur. Änderungen hier haben breite Auswirkungen — überprüfen Sie sorgfältig.

### Isolierte Knoten (null Kanten)

Ein Skill ohne Querverweise zu anderen Skills. Beispiele:
- Domänenspezifische Skills (z. B. `photography-studio` in `skills/small-business/`)
- Neu hinzugefügte Skills, noch nicht integriert
- Eigenständige Tutorials

**Maßnahme**: Nicht unbedingt schlecht. Isolation kann Domänenspezialisierung anzeigen. Aber wenn es ein Utility-Skill ist, erwägen Sie, ob es an anderer Stelle referenziert werden sollte.

---

## Abhängigkeiten aktualisieren (Manuell)

Der Graph wird aus **Textverweisen** im Dateiinhalt erstellt. Wenn Sie:

1. **Eine Skill-Datei umbenennen** (z. B. `foo.md` → `bar.md`): Alle bestehenden Verweise auf "foo" brechen automatisch. Aktualisieren Sie alle Dateien, die "foo" erwähnen, um "bar" zu verwenden.
2. **Einen neuen Verweis hinzufügen**: Erwähnen Sie den anderen Skill nach Name im Dateiinhalt. Der nächste Graph-Build erkennt dies.
3. **Einen Verweis entfernen**: Löschen Sie die Erwähnung. Der nächste Graph-Build entfernt die Kante.

Kein explizites Abhängigkeitsmanifest erforderlich — der Graph wird aus dem Inhalt abgeleitet.

---

## Integration mit CI/CD

Fügen Sie eine Pre-Commit- oder CI-Überprüfung hinzu, um den Abhängigkeitsgraph zu validieren:

```bash
# Erkennen Sie zirkuläre Abhängigkeiten oder isolierte Skills
node scripts/dependency-graph.js --stats | grep "Orphan nodes"
```

Oder verwenden Sie den Workflow `/skill-audit` (siehe `workflows/skill-audit.md`), um eine vollständige Abhängigkeitsprüfung als Teil Ihres Überprüfungsprozesses durchzuführen.

---

## Beispiel: Skill-Komposition analysieren

Angenommen, Sie möchten die Struktur der Anleitung `skill-composition` verstehen:

```bash
node scripts/dependency-graph.js --json | jq '.["skill-composition"]'
```

Ausgabe:
```json
["agent-handoff", "agent-memory", "llm-eval", "prompt-engineering"]
```

Die Anleitung `skill-composition` referenziert vier Kern-Skills. Sie kennen jetzt den Lernpfad: Lesen Sie diese vier Skills, kehren Sie dann zu `skill-composition` zurück, um zu erfahren, wie Sie sie kombinieren.

---

## Fehlerbehebung

**Graph ist leer oder hat sehr wenige Kanten**: Stellen Sie sicher, dass Sie vom Repository-Root (`/Users/tushar/Desktop/Claudient`) aus laufen. Das Skript sucht nach `skills/` und `agents/` relativ zum Repository-Root.

**Falsch positive (falsch erkannte Verweise)**: Der Abgleich ist groß-/kleinschreibungsunabhängig und verwendet Wortgrenzen. Zeichenketten wie "agent" passen zu "agent-handoff" (korrekt), könnten aber auch zu "agent_supervisor" passen, wenn Sie nicht vorsichtig sind. Überprüfen Sie den tatsächlichen Dateiinhalt des Skills, um zu bestätigen, dass der Verweis beabsichtigt ist.

**Ein Skill fehlt im Graph**: Das Skript indexiert nur `.md`-Dateien in den Verzeichnissen `skills/` und `agents/`. Anleitungen, Workflows und andere Verzeichnisse werden nicht indexiert (dies ist beabsichtigt — der Graph konzentriert sich auf den Skill/Agent-Kern). Wenn ein Skill fehlt, überprüfen Sie, dass er im richtigen Verzeichnis ist.

---

## Nächste Schritte

- Führen Sie `/skill-discovery` aus (siehe `skills/ai-engineering/skill-discovery.md`), um verwandte Skills interaktiv zu finden.
- Führen Sie den Workflow `skill-audit` aus (`workflows/skill-audit.md`), um Abdeckungslücken und über-verbundene Knoten zu identifizieren.
- Verwenden Sie den interaktiven Visualizer (`scripts/visualize-graph.js`), um das Netzwerk in Echtzeit zu erkunden.
