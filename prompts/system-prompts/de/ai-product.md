> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../ai-product.md).

# CLAUDE.md Starter — KI-Produkt

Dies in die `CLAUDE.md` des Projekts einfügen und die Abschnitte in eckigen Klammern ausfüllen.

---

```markdown
# [Projektname] — Claude Code Anweisungen

## Was das ist
[Ein Absatz: was das KI-Produkt tut, welches Modell es verwendet, wer die Benutzer sind]

## Stack
- Sprache: [TypeScript / Python]
- Framework: [Next.js / FastAPI]
- KI: [Claude API via Anthropic SDK / OpenAI / Gemini]
- Modell: [claude-sonnet-4-6 / claude-opus-4-7 / claude-haiku-4-5]
- Datenbank: [PostgreSQL / Supabase]
- Vektor-DB: [Pinecone / pgvector / Weaviate] (falls zutreffend)
- Deployment: [Vercel / AWS / Railway]

## Projektstruktur
src/
├── app/          ← Next.js App Router / FastAPI Routes
├── ai/           ← Gesamter KI-bezogener Code: Prompts, Chains, Tools
│   ├── prompts/  ← System-Prompts und Prompt-Templates
│   ├── tools/    ← Tool-Definitionen für Function Calling
│   └── agents/   ← Agentendefinitionen und Orchestrierung
├── db/           ← Datenbankabfragen und Migrationen
├── services/     ← Business-Logik
└── utils/        ← Reine Utilities

## KI-Konventionen
- Alle System-Prompts befinden sich in src/ai/prompts/ — niemals inline in Route-Handlern
- Immer die Modellversion pinnen — niemals "latest"-Alias verwenden
- Prompt Caching auf System-Prompts immer aktivieren (cache_control: ephemeral)
- Token-Nutzung pro Anfrage für Kostenverfolgung protokollieren
- Streaming-Antworten: SSE für Antworten > 1000 Tokens verwenden
- Niemals Benutzer-PII an das Modell übergeben, außer das Feature erfordert es explizit
- Tool-Definitionen befinden sich in src/ai/tools/ — eine Datei pro Tool

## Prompt Caching Setup
- System-Prompts müssen cache_control verwenden, um Caching zu aktivieren
- Cache-Lesen = $0.30/MTok vs. ungespeichert = $3/MTok — immer cachen
- Cache ungültig machen, wenn sich der System-Prompt ändert (automatisch bei Inhaltsänderung)

## Kostenkontrolle
- Standardmodell: [claude-haiku-4-5] für einfache Aufgaben, [claude-sonnet-4-6] für komplexe
- Max Tokens: explizites max_tokens bei jeder Anfrage setzen — niemals unbegrenzt
- Rate Limit: [X] Anfragen pro Benutzer pro Minute
- Budget-Alert: protokollieren, wenn eine einzelne Sitzung $[X] überschreitet

## Entscheidungen (nicht neu diskutieren)
- [Modellauswahl-Begründung]
- [Warum Streaming vs. Nicht-Streaming]
- [Kontextfenster-Strategie: Zusammenfassen bei N Tokens]
- [Tool Calling vs. direkte Generierung für strukturierte Ausgabe]

## Tests
- Unit-Tests für Prompt-Konstruktion und Ausgabe-Parsing
- Integrationstests mit aufgezeichneten API-Antworten (VCR / Fixtures)
- Niemals echte API-Aufrufe in Tests machen — kostet Geld und ist langsam
- Gegnerische Eingaben testen: Prompt Injection, Jailbreak-Versuche, Edge Cases

## Befehle
- [Dev-Befehl]
- [Test-Befehl]
- [Deploy-Befehl]

## Niemals tun
- Niemals System-Prompts inline in Route-Handlern
- Niemals ungebundene KI-Aufrufe ohne max_tokens
- Niemals vollständige KI-Antworten in der Produktion protokollieren (kann Benutzer-PII enthalten)
- Niemals API-Keys hardcoden — Umgebungsvariablen verwenden
- Niemals das KI-Modell direkt aus UI-Komponenten aufrufen
```

---

> **Mit uns arbeiten:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir bauen KI-Produkte und B2B-Lösungen mit Entwickler-Communities. [uitbreiden.com](https://uitbreiden.com/)
