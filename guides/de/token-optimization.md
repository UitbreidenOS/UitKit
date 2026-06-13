# Token-Optimierungsleitfaden

Wie Sie Claude Code-Kosten reduzieren und die Antwortgeschwindigkeit verbessern, ohne die Ausgabequalität zu opfern.

---

## Das Grundprinzip

Jeder Token im Kontextfenster von Claude Code kostet Geld und verlangsamt Antworten. Das Ziel ist, das Kontextfenster schlank zu halten — nur das, was Claude braucht, um die aktuelle Aufgabe gut zu erledigen.

Es gibt vier Hebel:
1. **Modellauswahl** — die richtige Modell-Aufgaben-Zuordnung
2. **Kontextverwaltung** — Kontrolle über den Fensterinhalt
3. **MCP-Disziplin** — Begrenzung des Tool-Overheads
4. **Komprimierungsstrategie** — wann und wie der Verlauf komprimiert wird

---

## 1. Modellauswahl

Claude Code unterstützt mehrere Modelle. Das falsche Modell für eine Aufgabe zu wählen ist der teuerste einzelne Fehler.

| Modell | Am besten für | Relative Kosten |
|---|---|---|
| Claude Haiku 4.5 | Einfache Bearbeitungen, Einzeldatei-Aufgaben, repetitive Operationen, Zusammenfassung | Niedrigste |
| Claude Sonnet 4.6 | Die meiste Entwicklungsarbeit — Multi-Datei-Änderungen, Debugging, Code-Review | Mittel |
| Claude Opus 4.7 | Komplexe Architekturentscheidungen, Sicherheitsanalyse, Multi-Agent-Orchestrierung | Höchste |

**Faustregeln:**
- Standard: Sonnet 4.6 für allgemeine Entwicklung
- Wechseln Sie zu Haiku 4.5 für: Linting-Korrekturen, Formatierung, einfache Umbenennungen, Einzelfunktions-Bearbeitungen, Boilerplate-Generierung aus einer Vorlage
- Eskalieren Sie zu Opus 4.7 nur wenn: das Problem tiefes Reasoning über viele Dateien erfordert, Sicherheitsentscheidungen involviert sind, oder Sie mehrere Sub-Agenten orchestrieren

**Haiku spart ~60 % gegenüber Sonnet bei geeigneten Aufgaben.**

---

## 2. Kontextfensterverwaltung

Das Kontextfenster von Claude Code ist groß (bis zu 1M Tokens bei Opus 4.7 und Sonnet 4.6), aber das **nutzbare** Fenster ist kleiner, sobald der Overhead berücksichtigt wird.

### Was Kontext verbraucht

| Quelle | Ungefähre Kosten |
|---|---|
| MCP-Tools (10 aktiviert) | ~30k Tokens |
| CLAUDE.md (Projekt + Benutzer) | 1k–10k Tokens |
| Konversationsverlauf | Wächst mit jedem Turn |
| Dateiinhalte im Kontext | Variiert — oft der größte Faktor |
| System-Prompt | ~5k–10k Tokens |

### Kontext schlank halten

**CLAUDE.md:**
- Halten Sie Projekt-CLAUDE.md unter 500 Zeilen
- Entfernen Sie Regeln, die nicht mehr für den aktuellen Projektzustand gelten
- Duplizieren Sie keine Inhalte aus Benutzer-CLAUDE.md in Projekt-CLAUDE.md

**Dateilesungen:**
- Bitten Sie Claude, spezifische Zeilenbereiche statt vollständiger Dateien zu lesen
- Vermeiden Sie es, dieselbe große Datei mehrmals in einer Sitzung zu lesen
- Verwenden Sie Sub-Agenten für isolierte Aufgaben — sie erhalten ein frisches Kontextfenster

**Konversationsverlauf:**
- Lange Sitzungen sammeln toten Kontext an
- Lösen Sie die Komprimierung proaktiv aus, anstatt auf den automatischen Schwellenwert zu warten

---

## 3. MCP-Disziplin

Jeder aktivierte MCP-Server lädt seine Tool-Definitionen beim Sitzungsstart in den Kontext. Mit 10 MCP-Servern und ~8 Tools pro Server verbrauchen Sie ~80 Tool-Slots — etwa 30k Tokens, bevor Sie ein Wort getippt haben.

**Auditieren Sie Ihre aktiven MCPs:**
- Aktivieren Sie nur MCPs, die Sie im aktuellen Projekt verwenden
- Deaktivieren Sie domänenspezifische MCPs (z.B. Datenbank, Cloud), wenn Sie nicht in diesem Bereich arbeiten
- Überprüfen Sie `.claude/settings.json` und `~/.claude/settings.json` auf aktivierte Server

---

## 4. Komprimierungsstrategie

Claude Code komprimiert den Konversationsverlauf automatisch, wenn der Kontext seine Grenze erreicht. Der Standardschwellenwert ist spät — er wird bei ~95 % Kapazität ausgelöst.

### Komprimierung früher auslösen

Verwenden Sie den Befehl `/compact` manuell, bevor Sie eine neue größere Aufgabe beginnen.

**Wann manuell komprimieren:**
- Vor dem Wechsel von einer großen Aufgabe zu einer anderen in derselben Sitzung
- Nach einer langen Debugging-Sitzung mit vielen fehlgeschlagenen Versuchen im Verlauf
- Vor dem Start einer Aufgabe, die das Lesen vieler großer Dateien erfordert

### Was Komprimierung bewirkt

Die Komprimierung fasst den Konversationsverlauf zusammen und ersetzt ihn durch eine komprimierte Darstellung. Sie verlieren den genauen turn-by-turn Verlauf, behalten aber Entscheidungen, geschriebenen Code und Schlüsselkontext.

**Pre-Compact-Hook:** Verwenden Sie einen `PreCompact`-Hook, um kritischen Sitzungszustand in eine Datei zu speichern, bevor die Komprimierung ausgelöst wird.

---

## 5. Prompt-Effizienz

**Seien Sie spezifisch bezüglich des Umfangs:**

Statt: "Behebe die Authentifizierung"
Verwenden Sie: "Behebe die JWT-Ablaufprüfung in `auth/middleware.py:45` — sie lehnt keine Tokens mit `exp` in der Vergangenheit ab"

**Begrenzen Sie die Antwortlänge wenn angemessen:**

Für Aufgaben, bei denen Sie eine Code-Änderung, aber keine Erklärung benötigen: "Nehmen Sie die Änderung vor, keine Erklärung nötig."

**Bündeln Sie verwandte Anfragen:**

Statt fünf separater "füge einen Test für X hinzu"-Anfragen sagen Sie: "Füge Tests für alle fünf Funktionen in `utils.py` hinzu."

---

## 6. Sub-Agent-Kontextisolierung

Sub-Agenten erhalten ein frisches Kontextfenster. Dies ist eine der am meisten unterschätzten Optimierungstechniken.

**Verwenden Sie Sub-Agenten wenn:**
- Eine Aufgabe in sich abgeschlossen ist (klare Eingaben, klare Ausgaben)
- Die Aufgabe das Lesen vieler Dateien erfordert, die für den Rest der Sitzung nicht relevant sind
- Sie etwas Repetitives über mehrere Dateien hinweg tun

---

## 7. Kostenverfolgung

Verwenden Sie einen `PostToolUse`-Hook, um Tool-Nutzung zu protokollieren und Kosten pro Sitzung zu schätzen.

Siehe `hooks/lifecycle/cost-tracker.sh` für eine fertige Implementierung.

---

## Schnellreferenz

| Situation | Aktion |
|---|---|
| Einfache Einzeldatei-Bearbeitung | Zu Haiku 4.5 wechseln |
| Lange Sitzung wird langsam | Manuell komprimieren (`/compact`) |
| Neue große Aufgabe beginnen | Zuerst komprimieren, dann beginnen |
| Arbeit in einem Bereich, den Sie nicht anfassen werden | Domain-MCPs deaktivieren |
| Aufgabe ist in sich abgeschlossen | Sub-Agent verwenden |
| Vage Anfrage produziert lange Antworten | Als spezifischen, abgegrenzten Prompt neu schreiben |
| CLAUDE.md über 500 Zeilen | Auditieren und veraltete Regeln entfernen |

---

## Arbeiten Sie mit uns
