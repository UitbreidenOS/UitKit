# Ultraplan — Deep Planning Mode

Ultraplan ist ein erweiterter Planungsmodus, der Claude anweist, erschöpfend zu denken, bevor er handelt. Er liest die Codebase, mappt Abhängigkeiten, identifiziert Risiken und erzeugt einen umfassenden Plan, bevor er Code anfasst. Das Ziel ist, den Plan beim ersten Mal richtig zu machen, bei Arbeit, wo ein falscher Plan teuer ist, rückgängig zu machen.

---

## Wie man es aktiviert

**Slash Command:**
```
/ultraplan
```

Beschreiben Sie dann die Task. Ultraplan übernimmt für die Planungsphase.

**CLI Flag:**
```bash
claude --ultraplan "Add multi-tenant support to the billing module"
```

**Kombiniert mit effort:**
```bash
claude --ultraplan --effort xhigh "Migrate auth from JWT to session-based"
```

---

## Was Ultraplan anders macht als `/plan`

| | `/plan` | `/ultraplan` |
|---|---|---|
| **Datei-Reads** | Nur referenzierte Dateien | Alle Dateien im betroffenen Pfad + ihre Abhängigkeiten |
| **Pattern Check** | Keine | Liest vorhandene Patterns vor dem Vorschlag neuer |
| **Dependency Mapping** | Implizit | Explizites Dependency Graph in der Ausgabe |
| **Risk Assessment** | Keine | Dedicated Risk-Sektion mit Mitigations |
| **Rollback Plan** | Keine | Explizite Rollback-Schritte für jede Phase |
| **Token-Kosten** | ~1× | ~3–5× |
| **Output-Länge** | Kurz | Lang (umfassend) |

Ultraplans Forschungsphase rechtfertigt die Kosten. Es liest die echte Codebase vor der Planung — nicht nur die von Ihnen erwähnten Dateien, sondern die Dateien, die diese importieren, die Tests, die sie abdecken, die Migrationshistorie, falls relevant, und die vorhandenen Patterns, die es abgleichen sollte.

---

## Ultraplan-Ausgabestruktur

Ein abgeschlossener Ultraplan produziert ein Dokument mit diesen Sektionen in Ordnung:

**1. Context Summary**
Was Ultraplan während seiner Forschungsphase gefunden hat — Schlüsseldateien, vorhandene Patterns, relevante frühere Entscheidungen.

**2. Risk Assessment**
Risiken nach Schweregrad gerankt. Jedes Risiko hat: Beschreibung, Wahrscheinlichkeit, Auswirkung und vorgeschlagene Mitigation.

**3. Dependency Map**
Welche Komponenten von was abhängen. Hebt zirkuläre Abhängigkeiten, gemeinsamen State und externe Integrationen hervor, die die Änderung berührt.

**4. Ordered Steps**
Der Implementierungsplan in Sequenz. Jeder Schritt spezifiziert: was ändert, welche Dateien, was nach diesem Schritt zu testen ist, und ob ein Partial-Commit hier angemessen ist.

**5. Rollback Plan**
Wie man jede Phase rückgängig macht, wenn etwas schiefgeht — spezifische Git-Befehle, Feature Flag Toggles oder Migration Reversals.

---

## Wann zu verwenden

- **Komplexe Features über mehrere Dateien** — besonders wenn Sie nicht sicher sind, was von was abhängt
- **Unfamiläre Codebases** — vor Anfassung von Code, den Sie nicht gelesen haben, baut Ultraplans Forschungsphase den Kontext auf, den Sie manuell Stunden aufbauen würden
- **High-Stakes Changes** — Auth-System-Umschreibungen, Datenbank-Schema-Migrationen, öffentliche API-Änderungen, alles wo ein falscher Ansatz bedeutendes Overhaul bedeutet
- **Features geschätzt auf mehr als einen Tag** — die Planungsinvestition zahlt sich schneller aus, je länger die Implementierung

---

## Wann NICHT zu verwenden

- **Einfache Tasks** — ein Single-Function Bug Fix braucht keine Dependency Map
- **Hotfixes** — Sie wissen schon, was kaputt ist; Plan-Overhead verlangsamt Sie
- **Exploratory / Spike Work** — wenn Sie zum Lernen prototypieren, wollen Sie schnell iterieren, nicht exhaustiv planen
- **Gut verstandene Changes** — wenn Sie diese Art von Änderung zehnmal in dieser Codebase gemacht haben, brauchen Sie Ultraplans Forschungsphase nicht
- **Kostenempfindliche Sessions** — bei 3–5× Token-Kosten verschwendet Ultraplan auf triviale Tasks Budget

---

## Effort-Integration

`--effort` kontrolliert, wie tief Claude in jedem Turn denkt. Ultraplan + Effort verbinden sich:

```bash
# Maximale Tiefe: Ultraplans breite Forschung + maximales per-Turn Nachdenken
claude --ultraplan --effort xhigh "Refactor the payment processing module"
```

| Kombination | Verwenden für |
|---|---|
| `--ultraplan` allein | Standard komplexe Features |
| `--ultraplan --effort high` | Architecture Decisions, unfamiläre Codebases |
| `--ultraplan --effort xhigh` | Migration Planning, Security-Critical Changes |

Vermeiden Sie `--ultraplan --effort low` — Sie handeln die Forschungstiefe, die Ultraplan wertvoll macht.

---

## Kostenabgleich

Ultraplan gibt Tokens für Forschung im Voraus aus. Der Break-Even Point ist ungefähr:

- Wenn der Plan 1 Stunde Debugging oder Rework spart: Break-Even bei ~$2–5 extra Tokens
- Wenn der Plan eine falsche Architecture-Entscheidung verhindert: Break-Even bei ~$10–50 extra Tokens

Für Features geschätzt auf mehr als einen Tag Arbeit ist Ultraplan fast immer wert. Für Half-Day Tasks kommt es darauf an, wie gut Sie die Codebase kennen.

---

## Ultraplan mit RIPER kombinieren

Das RIPER Framework (Research → Implement → Probe → Evaluate → Reflect) mappt sauber zu Ultraplan:

- **Research** → Ultraplans Forschungsphase (Datei-Lesen, Pattern-Identifikation)
- **Implement** → Führen Sie die Ordered Steps aus der Ultraplan-Ausgabe aus
- **Probe** → Führen Sie Tests nach jedem Schritt aus, wie im Plan spezifiziert
- **Evaluate** → Prüfen Sie gegen Ultraplans Risk Assessment — materialisierten sich vorhergesagte Risiken?
- **Reflect** → Überprüfen Sie den Rollback Plan; aktualisieren Sie, wenn Implementierung vom Plan abwich

Führen Sie Ultraplan vor RIPERs Implement Phase aus. Die Ultraplan-Ausgabe wird zum Implement-Phase Brief.

```
/ultraplan
[describe the feature]

[review the plan]

/riper implement
[execute the plan step by step]
```

---
