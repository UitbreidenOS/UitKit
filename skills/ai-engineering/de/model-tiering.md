---
name: model-tiering
description: "Automatisches Routing und Tiering von Entwickler-Prompts über Opus, Sonnet und Haiku basierend auf Aufgabenmerkmalen"
updated: 2026-06-23
---

# Automatische Modell-Tiering-Kompetenz

## Wann aktivieren

- Optimierung der Token-Kosten während der Ausführung eines mehrstufigen Coding-Agents.
- Dynamische Zuweisung von Modellgewichten bei großen Refactoring-Läufen.
- Lösen komplexer Planungsaufgaben vor dem Generieren von Implementierungscode.
- Auslösen von Fallback-Konfigurationen, wenn komplexe Aufgaben auf kleineren Modellen fehlschlagen.

## Wann NICHT verwenden

- Schnelle interaktive Chats, bei denen das Wechseln der Modelle spürbare Latenzzeiten verursacht.
- Explizite Modellüberschreibungen durch den Entwickler (z. B. `--model sonnet`).

## Anweisungen

Klassifizieren Sie Entwicklerabfragen in eine der folgenden drei Stufen, um Aufgaben dynamisch weiterzuleiten:

### 1. Die Argumentationsstufe (Opus / Denkmodell)
- **Umfang**: Große architektonische Änderungen, Sicherheitsaudits, komplexe Algorithmenentwürfe, übergreifende Anliegen.
- **Kriterien**: Hohes strukturelles Risiko, erfordert Argumentation über große Kontextfenster.

### 2. Die Planungsstufe (Sonnet)
- **Umfang**: Mittlere APIs, Refactoring lokaler Funktionen, Layout-Entwürfe und Erstellung von Schritt-für-Schritt-Implementierungsaufgaben.
- **Kriterien**: Mittlere Komplexität, folgt vorhandenen Architekturmustern.

### 3. Die Kodierungsstufe (Haiku)
- **Umfang**: Schreiben von Standardcode (Boilerplate), Dokumentation, einfache Unit-Tests, Skriptänderungen.
- **Kriterien**: Änderungen an einer einzelnen Datei, geringe architektonische Komplexität, wiederholbare Codemuster.
