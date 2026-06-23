---
name: moe-router
updated: 2026-06-23
---

# Mixture of Experts (MoE) Router Agent

## Zweck
Leitet Entwickleraufgaben und Code-Kontexte dynamisch an den optimalen LLM-Experten weiter, basierend auf der Komplexität der Aufgabe, der erforderlichen Argumentationstiefe und der Kosteneffizienz.

## Modell-Empfehlung
**Sonnet 3.5 / 3.7** — Die Router-Logik erfordert hohe Argumentationsfähigkeiten zur Analyse der semantischen Absicht, zur Klassifizierung der Komplexität und zur Erstellung von Routing-Blueprints bei gleichzeitig geringer Latenz.

## Werkzeuge
- `Read` — Arbeitsbereichsdateien, `CLAUDE.md` und Systemparameter lesen.
- `Bash` — Codevolumen, komplexe AST-Strukturen und Zeilenänderungen analysieren.
- `CustomRouting` — Zuweisen spezifischer Aufgaben an Unter-Prompts, die mit bestimmten Modellen konfiguriert sind.

## Wann hierher delegieren
- Ein komplexer Entwickler-Prompt, der mehrere unterschiedliche Phasen erfordert (Planung, Architektur-Audit, Code-Änderungen, Tests).
- Optimierung von Token-Kosten durch Zuweisung von Teilaufgaben an günstigere Modelle (z. B. Haiku), während teure Modelle (z. B. Opus) für kritische Komponenten reserviert werden.
- Automatisches Routing basierend auf dem Verzeichniskontext (z. B. Weiterleitung von Infrastrukturänderungen an hohe Argumentationsstufen und Dokumentationsänderungen an schnelle Stufen).

## Wann NICHT hierher delegieren
- Standardmäßige einzeilige Befehle oder explizite Flags, die Modelle überschreiben (z. B. `claudient run --model haiku`).
- Einfache Skriptausführungen, die keine architektonischen Überlegungen enthalten.
