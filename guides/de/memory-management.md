# Leitfaden zur Speicherverwaltung

Wie Sie Kontext sitzungsübergreifend persistieren, Komprimierung überleben und Claudes Arbeitsgedächtnis scharf halten.

---

## Das Speicherproblem

Claude Code hat standardmäßig kein persistentes Gedächtnis zwischen Sitzungen. Jede neue Sitzung beginnt von vorne. Innerhalb einer Sitzung wächst der Kontext, bis die Komprimierung ausgelöst wird — dann wird der Konversationsverlauf komprimiert und Details gehen verloren.

Speicherverwaltung ist die Praxis, explizit zu kontrollieren, was Claude weiß, wann es das weiß, und wie dieses Wissen Sitzungsgrenzen überlebt.

---

## Die vier Speicherschichten

| Schicht | Wo | Sitzungsübergreifend persistent | Überlebt Komprimierung |
|---|---|---|---|
| **CLAUDE.md** | Projektstamm | Ja | Ja |
| **Sitzungsdateien** | `.claude/memory/` oder `.tmp/` | Ja (wenn gespeichert) | Ja (wenn vor Compact gespeichert) |
| **Kontextfenster** | Nur sitzungsintern | Nein | Nein (komprimiert) |
| **Sub-Agent-Kontext** | Pro Sub-Agent | Nein | Nein |

---

## 1. CLAUDE.md als permanentes Gedächtnis

`CLAUDE.md` wird zu Beginn jeder Sitzung gelesen. Es ist die zuverlässigste Speicherschicht.

**Was in CLAUDE.md gehört:**
- Projektarchitektur-Übersicht (ein Absatz, nicht erschöpfend)
- Konventionen, bei denen Claude ohne Anleitung falsch liegen würde
- Bereits getroffene Entscheidungen, die nicht neu diskutiert werden sollen
- Was Claude in diesem Projekt nie tun sollte

**Was NICHT in CLAUDE.md gehört:**
- Laufende Arbeit oder Aufgabenstatus (ändert sich zu schnell, veraltet)
- Lange Erklärungen, wie Technologien funktionieren
- Alles — CLAUDE.md über 500 Zeilen kostet mehr als es bringt

---

## 2. Sitzungsdateien für das Arbeitsgedächtnis

Für laufenden Kontext, der nicht dauerhaft in CLAUDE.md gehört, verwenden Sie Sitzungsdateien.

**Muster:**
```
.claude/
└── memory/
    ├── current-task.md       ← woran Sie gerade arbeiten
    ├── decisions.md          ← diese Woche getroffene Entscheidungen
    └── context-dump.md       ← Hintergrund für eine lange Aufgabe
```

**Komprimieren von Sitzungsdateien:** Verwenden Sie das caveman-compress-Muster — das Umschreiben von Sitzungsspeicherdateien spart ~46% Input-Tokens pro Sitzung.

---

## 3. Pre-Compact-Hook zum Überleben

Wenn die Komprimierung automatisch auslöst, geht jeder Arbeitskontext in der Sitzung, der nicht in einer Datei gespeichert wurde, verloren. Ein `PreCompact`-Hook läuft vor der Komprimierung.

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/pre-compact-save.sh"
          }
        ]
      }
    ]
  }
}
```

**Was `pre-compact-save.sh` tun sollte:**
1. Claude bitten zusammenzufassen: aktueller Aufgabenstatus, offene Entscheidungen, geänderte Dateien, nächste Schritte
2. Diese Zusammenfassung mit Zeitstempel in `.claude/memory/session-state.md` schreiben

---

## 4. Sub-Agent-Speicherisolierung

Sub-Agenten erhalten ein sauberes Kontextfenster — sie haben standardmäßig kein Gedächtnis an die Elternsitzung.

**Gedächtnis an Sub-Agenten übergeben:**
- Relevante CLAUDE.md-Abschnitte explizit in den Sub-Agent-Prompt einschließen
- Spezifische Dateipfade und Entscheidungen übergeben, die der Sub-Agent braucht

**Gedächtnis von Sub-Agenten zurückgeben:**
- Sub-Agent seine Ergebnisse in eine Datei schreiben lassen
- Diese Datei in der Elternsitzung zurücklesen

---

## 5. CONTEXT.md für Domänensprache

Komplexe Projekte profitieren von einer `CONTEXT.md` — einem Glossar domänenspezifischer Begriffe.

**Struktur:**
```markdown
# Projektkontext

## Language
**Order**: Kaufabsicht eines Kunden für ein oder mehrere Produkte.
**Cart**: Temporärer Vor-Bestellungsstatus. Verschieden von Order — nicht verwechseln.

## Relationships
- Eine Order enthält eine oder mehrere OrderLines
- Ein Cart gehört zu genau einem User

## Decisions
- "Basket" wurde im frühen Code verwendet — aufgelöst: immer "Cart" verwenden
```

---

## 6. Komprimierungsstrategie

**Proaktive Komprimierung schlägt reaktive Komprimierung.**

**Wann manuell komprimieren (`/compact`):**
- Vor dem Beginn einer neuen großen Aufgabe in derselben Sitzung
- Nach einer langen Debugging-Sitzung
- Wenn Claude anfängt, Fragen zu wiederholen oder den Überblick über Entscheidungen zu verlieren

---

## Schnellreferenz

| Situation | Aktion |
|---|---|
| Unveränderliche Entscheidungen | In CLAUDE.md eintragen |
| Aktueller Aufgabenstatus | `.claude/memory/current-task.md` |
| Domänenterminologie | `CONTEXT.md` im Projektstamm |
| Komprimierung überleben | `PreCompact`-Hook → session-state.md |
| Neue Hauptaufgabe beginnen | Erst `/compact`, dann beginnen |
| Kontext an Sub-Agent übergeben | Explizit in den Prompt einschließen |
| Claude stellt bereits beantwortete Fragen | Antwort in CLAUDE.md eintragen |

---

## Arbeiten Sie mit uns
