# Migration zu Claude Opus 4.7

Claude Opus 4.7 führt Breaking Changes in der Messages API neben neuen Funktionen ein. Drei Parameter, die zuvor nicht standardmäßige Werte akzeptierten, geben nun HTTP 400 zurück. Bevor Sie Ihre Modell-ID auf `claude-opus-4-7` aktualisieren, überprüfen Sie Ihren vorhandenen Code auf diese Muster.

---

## Breaking Changes

### 1. Erweitertes Denk-Budget entfernt

Opus 4.7 akzeptiert nicht länger `budget_tokens` in der Denk-Konfiguration. Das Modell verwaltet sein eigenes Denk-Budget adaptiv.

**Alt (gibt 400 auf Opus 4.7 zurück) :**
```python
response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 8000},
    messages=[{"role": "user", "content": "..."}]
)
```

**Neu :**
```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},
    messages=[{"role": "user", "content": "..."}]
)
```

`effort` akzeptiert `"low"`, `"medium"` oder `"high"`. Verwenden Sie `"high"` für komplexe Denkaufgaben, bei denen Sie zuvor ein großes `budget_tokens` gesetzt haben. Das Modell entscheidet, wie viel es denken soll — der `effort` Hinweis beeinflusst diese Entscheidung.

---

### 2. Abtast-Parameter entfernt

`temperature`, `top_p` und `top_k` müssen weggelassen oder auf ihre Standardwerte gesetzt werden. Nicht standardmäßige Werte geben HTTP 400 zurück.

**Alt (gibt 400 auf Opus 4.7 zurück) :**
```python
response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=4096,
    temperature=0.7,
    top_p=0.9,
    messages=[{"role": "user", "content": "..."}]
)
```

**Neu — Parameter vollständig entfernen :**
```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}]
)
```

Es gibt keine Umgehung dafür. Opus 4.7 stellt keine Abtast-Regler bereit. Wenn Ihr Anwendungsfall explizite Temperaturkontrolle erfordert, bleiben Sie bei Opus 4.6 oder verwenden Sie ein anderes Modell der 4.7 Familie.

---

### 3. Denk-Inhalt wird standardmäßig ausgelassen

Denk-Blöcke werden immer noch ausgeführt und gestreamt, aber das `thinking` Feld in der Antwort ist standardmäßig leer. Dies ist eine Änderung gegenüber dem Opus 4.6 Verhalten.

**Um Denk-Zusammenfassungen zu sehen :**
```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=16000,
    thinking={"type": "adaptive", "display": "summarized"},
    messages=[{"role": "user", "content": "..."}]
)

for block in response.content:
    if block.type == "thinking":
        print("Thinking summary:", block.thinking)
    elif block.type == "text":
        print("Response:", block.text)
```

`"display": "full"` gibt die vollständige Denk-Ausgabe zurück. `"display": "summarized"` gibt eine kondensierte Version zurück. `"display": "none"` (Standard) lässt es weg. Verwenden Sie `"summarized"` zum Debuggen; verwenden Sie `"none"` in der Produktion, um die Antwortgröße zu reduzieren.

---

## Neue Funktionen

### Adaptives Denken

Der einzige unterstützte Denk-Modus auf Opus 4.7. Standardmäßig deaktiviert — aktivieren Sie ihn für Aufgaben, die von erweitertem Denken profitieren:

```python
# Aktivieren — das Modell entscheidet, wie viel es denkt
thinking={"type": "adaptive"}

# Mit Effort-Hinweis aktivieren
thinking={"type": "adaptive"}
output_config={"effort": "high"}

# Deaktiviert (Standard)
# Den thinking Parameter ganz weglassen
```

Adaptives Denken aktiviert sich automatisch bei komplexen mehrstufigen Problemen, wenn aktiviert. Bei einfachen Prompts kann es wenig oder gar kein erweitertes Denken verwenden, auch mit `effort: "high"` — das Modell kalibriert sich auf die Aufgabe.

---

### Task-Budgets (Beta)

Ein empfohlenes plattformübergreifendes Token-Budget. Das Modell verwendet es als Richtlinie — es ist keine harte Grenze, aber das Modell wird versuchen, die Aufgabe innerhalb des Budgets abzuschließen.

**Beta-Header erforderlich :** `task-budgets-2026-03-13`

```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=32000,
    output_config={
        "task_budget": {
            "type": "tokens",
            "total": 128000
        }
    },
    extra_headers={"anthropic-beta": "task-budgets-2026-03-13"},
    messages=[{"role": "user", "content": "..."}]
)
```

**Minimum :** 20.000 Tokens. Budgets unter 20k werden abgelehnt. Das Budget ist empfohlisch — wenn die Aufgabe wirklich mehr Tokens benötigt, kann das Modell es überschreiten, anstatt eine unvollständige Antwort zu geben.

Verwenden Sie Task-Budgets bei der Orchestrierung von mehrstufigen Agenten, bei denen unkontrollierter Token-Verbrauch ein Problem ist. Verwenden Sie sie nicht als Abrechnungskontrollmechanismus — sie sind ein Verhaltenshinweis, keine Durchsetzungsgrenze.

---

### Unterstützung für hochauflösende Bilder

Opus 4.7 akzeptiert Bilder bis zu 2.576 px auf der längsten Seite, mit einem Maximum von 3,75 Megapixeln. Dies ist eine Steigerung gegenüber 1.568 px / 1,15 MP auf älteren Modellen.

```python
# Computer-Use-Aufgaben profitieren von der höheren Auflösung
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/png",
                    "data": screenshot_b64
                }
            },
            {"type": "text", "text": "Click the 'Submit' button."}
        ]
    }]
)
```

Das neue Größenlimit ermöglicht 1:1 Pixel-Koordinaten für Computer-Use-Aufgaben — Sie können genaue Bildschirmpositionen referenzieren, ohne Skalierungsberechnungen.

Wenn Sie Bilder größer als 2.576 px übergeben, werden sie serverseitig neu skaliert. Skalieren Sie sie vorher auf dem Client, um den Overhead zu vermeiden.

---

### Neuer Tokenizer

Opus 4.7 verwendet einen neuen Tokenizer, der für äquivalenten Inhalt 1x–1,35x mehr Tokens als Opus 4.6 produziert. Der gleiche Eingabetext kostet mehr Tokens und der gleiche Output kostet mehr Tokens.

**Auswirkung auf `max_tokens` :** Wenn Ihr vorhandener Code `max_tokens` basierend auf erwarteter Ausgabelänge setzt, erhöhen Sie ihn um 35 % als Startpunkt. Antworten, die zuvor in 4.000 Tokens passten, können jetzt bis zu 5.400 erfordern.

```python
# Alt — kann auf 4.7 abgeschnitten werden, wenn die Ausgabe Token-intensiv ist
max_tokens=4096

# Neu — ~35% Spielraum hinzufügen
max_tokens=5600
```

Führen Sie Ihre Eval-Suite für eine Stichprobe echter Prompts aus und vergleichen Sie die Token-Zählungen der Ausgabe, bevor Sie alle Ihre `max_tokens` Werte aktualisieren.

---

## Verhaltensänderungen (nicht Breaking)

Dies sind keine API-Fehler, wirken sich aber auf die Ausgabequalität aus, wenn Ihre Prompts auf vorherigem Verhalten basierten.

**Wörtlichere Anweisung-Befolgung.** Opus 4.7 interpretiert Prompts präziser. Vage Anweisungen, die zuvor funktionierten, können unerwartete Ergebnisse liefern. Seien Sie explizit: Schreiben Sie statt „räume diesen Code auf" lieber „entferne ungenutzte Variablen und füge Typ-Annotationen zu allen Funktionssignaturen hinzu".

**Weniger Tool-Aufrufe und Sub-Agenten standardmäßig.** Das Modell ist konservativer beim Starten von Sub-Agenten und Aufrufen von Tools. Wenn Ihr Workflow darauf angewiesen ist, dass das Modell automatisch Tools nutzt, müssen Sie es möglicherweise explizit anweisen.

**Antwortlänge kalibriert sich auf Task-Komplexität.** Kurze Fragen bekommen kurze Antworten. Wenn Sie eine detaillierte Antwort auf eine einfache Frage benötigen, weisen Sie das Modell an, gründlich zu sein, anstatt zu vermuten, dass es es sein wird.

---

## Migrations-Checkliste

- [ ] `budget_tokens` aus allen `thinking` Konfigurationen entfernen — durch `thinking: {type: "adaptive"}` ersetzen
- [ ] `temperature`, `top_p`, `top_k` entfernen, wenn auf nicht standardmäßige Werte gesetzt
- [ ] `"display": "summarized"` zur Denk-Konfiguration hinzufügen, wenn Sie Denk-Blöcke in Ihrer Anwendung lesen
- [ ] `max_tokens` um ~35 % erhöhen, um den neuen Tokenizer zu berücksichtigen
- [ ] Bild-Eingaben testen: Überprüfen Sie, dass Abmessungen innerhalb von 2.576 px / 3,75 MP liegen, aktualisieren Sie alle Koordinatenberechnungen
- [ ] Modell-ID-Strings aktualisieren: `claude-opus-4-7`
- [ ] Prompts auf vage Anweisungen überprüfen — Opus 4.7 ist wörtlicher
- [ ] Überprüfen Sie jede Orchestrierung, die auf automatische Tool-Verwendung angewiesen ist — kann explizite Anweisung benötigen

---

## Claude Code Benutzer

Claude Code verwaltet die API-Schicht für Sie. Es gibt keine API-level Breaking Changes zu verarbeiten — aktualisieren Sie das Modell in Ihren Einstellungen und Claude Code kümmert sich um den Rest.

Was möglicherweise Anpassungen erfordert, ist Ihr Prompt-Stil. Opus 4.7s wörtlichere Interpretation und konservativere Tool-Nutzung können komplexe mehrstufige Sessions beeinflussen. Wenn Claude Code Sessions nach der Modell-Aktualisierung weniger autonom werden, fügen Sie explizite Anweisungen zu Ihrer CLAUDE.md hinzu: Spezifizieren Sie, welche Tools proaktiv verwendet werden sollen, definieren Sie, was „gründlich" für Ihre Codebasis bedeutet, und entfernen Sie mehrdeutige Standing Instructions, die sich darauf verlassen haben, dass das Modell Absicht ableitet.

---
