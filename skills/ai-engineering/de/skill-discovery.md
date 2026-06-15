---
name: skill-discovery
description: "Verwandte Fähigkeiten über Abhängigkeitsgraphanalyse entdecken, Lernpfade finden und Kompetenzclusters identifizieren"
updated: 2026-06-15
---

# Skill-Discovery-Kompetenz

## Wann zu aktivieren

- Nach Fähigkeiten zu einem Thema suchen (z. B. „Ich muss mit RAG arbeiten — welche Fähigkeiten sollte ich lesen?")
- Einen Lernpfad aufbauen (z. B. „Welche Fähigkeiten führen zu Agent-Teams?")
- Eine Kompetenz nach teilweiser Beschreibung finden
- Kompetenzcluster und verwandte Tools innerhalb einer Domäne identifizieren
- Multi-Skill-Workflows planen und Abhängigkeiten kennen
- Debugging: verstehen, warum eine Kompetenz eine andere referenziert

## Wann NICHT zu verwenden

- Nach Nicht-Skill-Ressourcen suchen (Guides, Workflows, Agents, Regeln)
- Triviale Einzelfragen
- Generische Fragen zu Claude oder LLMs, die nicht mit Claudient zusammenhängen

## Anweisungen

### Schritt 1 — Eine Kompetenz oder ein Thema anfordern

Formulieren Sie Ihre Anfrage als eine der folgenden Optionen:

- „Fähigkeiten im Zusammenhang mit [Thema] finden" → Gibt alle Fähigkeiten dieser Kategorie zurück
- „Was führt zu [Skill-Name]?" → Zeigt die Voraussetzungen
- „Was baut auf [Skill-Name] auf?" → Zeigt die nächsten Schritte
- „Zeige mir einen Lernpfad für [Ziel]" → Erstellt eine Sequenz
- „Ich brauche eine Kompetenz für [Beschreibung]" → Semantische Übereinstimmung
- „Verwaiste Skills finden" → Listet Skills ohne Querverweise auf
- „Welche sind die zentralsten Skills?" → Gibt Knoten mit hohem Grad zurück

### Schritt 2 — Abhängigkeitsgraph generieren oder abrufen

Führen Sie das Abhängigkeitsgraph-Skript aus:

```bash
node scripts/dependency-graph.js --json
```

Dies erzeugt eine Adjacency-Liste: `{ "skill-name": ["ref1", "ref2", ...], ... }`

Für Statistiken:

```bash
node scripts/dependency-graph.js --stats
```

### Schritt 3 — Graph für Ihre Anfrage analysieren

#### Für „verwandte Skills"-Anfragen:

1. Finden Sie die Kompetenz im Graph nach Name
2. Geben Sie alle Skills zurück, auf die sie verweist (ausgehende Kanten)
3. Finden Sie alle Skills, die auf sie verweisen (eingehende Kanten)
4. Gruppieren Sie nach Kategorie zur Klarheit

#### Für „Lernpfad"-Anfragen:

1. Beginnen Sie mit der Zielkompetenz
2. Folgen Sie rekursiv eingehenden Kanten (bis zu 3 Hops)
3. Ordnen Sie nach Abhängigkeit: Voraussetzungen zuerst, Ziel zuletzt
4. Fügen Sie kurze Beschreibungen ein

#### Für „verwaiste Skills"-Anfragen:

Vergleichen Sie die JSON-Graph-Ausgabe mit dem vollständigen Inventar

#### Für „zentralste Skills"-Anfragen:

1. Zählen Sie ausgehende Kanten pro Kompetenz
2. Zählen Sie eingehende Kanten pro Kompetenz
3. Geben Sie die Top 10–15 nach Zentralität zurück

### Schritt 4 — Ergebnisse mit Kontext präsentieren

Für jedes Ergebnis:

1. **Skill-Name** und **Beschreibung**
2. **Ort** (z. B. `skills/ai-engineering/`)
3. **Beziehungsrichtung**
4. **Kurze Zusammenfassung** der Beziehung
5. **Empfohlene Leseordnung**

### Schritt 5 — Interaktive Erkundung anbieten

Wenn der Benutzer tiefer graben möchte:
- Den vollständigen Graph mit dem D3.js-Visualisierungstool visualisieren
- Die Nachbarn einer Kompetenz im Detail erkunden
- Referenzmuster zwei Skills vergleichen
- Den vollständigen Audit-Workflow ausführen

---

## Beispiel

**Benutzeranfrage:** „Ich möchte mehr über Multi-Agent-Workflows erfahren. Wo sollte ich anfangen?"

**Ergebnis:**
```
Lernpfad für Multi-Agent-Workflows:

1. **session-handoff** — verstehen, wie Agents Zustand übertragen
2. **agent-handoff** — strukturierte Protokolle für Agent-zu-Agent-Transfer
3. **agent-tracing** — Multi-Agent-Ausführung beobachten
4. Wählen Sie einen:
   - **multi-agent-memory** (gemeinsamer Zustand zwischen Agents)
   - **agent-teams** (koordinierte Agent-Gruppen)

Geschätzte Lesezeit: 20–30 Minuten
```

---

## Integration mit dem Abhängigkeitsgraph

Diese Kompetenz basiert auf `scripts/dependency-graph.js` und sollte aufgerufen werden, wenn ein Benutzer eine Discovery-Frage stellt. Die Kompetenz macht den Graph in natürlicher Sprache abfragbar.

Für programmatische Nutzung siehe den Leitfaden unter `guides/skill-dependency-graph.md`.
