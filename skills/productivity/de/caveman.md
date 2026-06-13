> 🇩🇪 Deutsche Version. [Englische Version](../caveman.md).

# Caveman Mode Skill

## Wann aktivieren
- Du möchtest den Token-Verbrauch in einer langen Sitzung deutlich reduzieren
- Das Kontextfenster füllt sich und du musst die nutzbare Lebensdauer der Sitzung verlängern
- Du führst eine kostensensible Aufgabe aus (viele parallele Agents, Batch-Verarbeitung)
- Die Antworten von Claude sind ausführlich und du möchtest knappe, fragmentartige Ausgaben
- Du möchtest bestehende Memory- oder CLAUDE.md-Dateien komprimieren, um Input-Tokens zu reduzieren

## Wann NICHT verwenden
- Sicherheitswarnungen oder Bestätigungen für nicht umkehrbare Aktionen — diese benötigen vollständige Sätze
- Mehrstufige Abläufe, bei denen Fragmentmehrdeutigkeit zu Fehlinterpretationen führen kann
- Onboarding neuer Teammitglieder in eine Codebasis — hier überwiegt Klarheit gegenüber Kürze
- Schreiben von Dokumentation, die externe Personen lesen werden

## Anweisungen

Caveman Mode ist eine etablierte Token-Kompressionstechnik mit einer dedizierten Implementierung unter [github.com/JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman). Dieser Skill ist ein Verweis — verwende das originale Repository, dupliziere es nicht.

### Was es bewirkt

Caveman Mode weist Claude an, komprimierte, fragmentartige Prosa auszugeben:

| Stufe | Regel | Beispiel |
|-------|-------|---------|
| `lite` | Füllwörter und Abschwächungen weglassen, Artikel und vollständige Sätze beibehalten | "The function handles edge cases." |
| `full` | Artikel weglassen, Fragmente erlaubt, kurze Synonyme | "func handles edge cases" |
| `ultra` | Prosa-Wörter abkürzen, Konjunktionen entfernen, Pfeile für Kausalität | "fn→edge cases handled" |

Benchmark-Ergebnisse (März 2026, [arxiv.org/abs/2604.00025](https://arxiv.org/abs/2604.00025)):
- ~65 % Reduzierung der Output-Tokens
- 26 Punkte Verbesserung der Genauigkeit in Benchmarks (Kürze schärft das Denken)
- 100 % technische Genauigkeit beibehalten

### caveman-compress Sub-Skill
Schreibt `.md` Memory- und CLAUDE.md-Dateien in Caveman-Prosa um — ~46 % Einsparung bei Input-Tokens in jeder Sitzung, da komprimierte Dateien bei jedem Kontextladen neu eingelesen werden.

### cavecrew Subagents
Haiku-basierte Subagents, die im Caveman Mode laufen — ~60 % weniger Tokens als normale Agents für einfache Klassifizierungs-, Extraktions- und Routing-Aufgaben.

### caveman-shrink MCP Middleware
Komprimiert MCP-Tool-Beschreibungen, bevor sie in Claudes Kontext gelangen — reduziert den MCP-Overhead um ~30 % ohne das Verhalten der Tools zu verändern.

## Beispiel

**Caveman Mode in einer Sitzung aktivieren:**
```
Use caveman mode (full level) for this session. Drop articles, use fragments,
short synonyms. Auto-revert to normal prose for: security warnings,
irreversible action confirmations, multi-step sequences.
```

**caveman-compress auf einer Memory-Datei verwenden:**
```
/caveman-compress .claude/memory/project-context.md
```

**cavecrew für eine Klassifizierungsaufgabe verwenden:**
```
Spawn a cavecrew subagent (Haiku, caveman full) to classify these 200 support
tickets into 5 categories. Return only: ticket_id, category.
```

---

**Referenz:** [github.com/JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) — die maßgebliche Caveman-Implementierung. Claudient verweist auf diese Arbeit; sie wird hier nicht dupliziert.

---
