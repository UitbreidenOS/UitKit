# AGENTS.md-Leitfaden

AGENTS.md ist ein Begleiter zu CLAUDE.md — es macht Ihre Projektanweisungen auf alle KI-Codierungsassistenten portabel, nicht nur Claude Code.

## Was ist AGENTS.md?

Während `CLAUDE.md` Claude Code-spezifisch ist, ist `AGENTS.md` eine Community-Konvention für agentenübergreifende Kompatibilität. Das gleiche Projekt kann verwendet werden mit:
- Claude Code (`CLAUDE.md`)
- Cursor (liest `AGENTS.md` oder `cursor.md`)
- OpenAI Codex CLI
- Gemini CLI
- Jeder Agent, der der AGENTS.md-Konvention folgt

## CLAUDE.md vs AGENTS.md

| | CLAUDE.md | AGENTS.md |
|---|---|---|
| **Liest es** | Nur Claude Code | Claude Code + Cursor + Codex + andere |
| **Ort** | Projektwurzel | Projektwurzel |
| **Claude Code-Priorität** | Primär | Sekundär (CLAUDE.md hat Vorrang) |
| **Format** | Markdown | Markdown |
| **Zweck** | Claude-spezifischer Kontext | Universeller Agent-Kontext |

## Erstellen von AGENTS.md

Halten Sie es fokussiert auf das, was jeder KI-Codierungsassistent benötigt, um bei Ihrem Projekt effektiv zu sein — nicht Claude-spezifische Funktionen:

```markdown
# AGENTS.md

## Projektübersicht
[2-3 Sätze: was dieses Projekt tut, wer es bedient]

## Tech Stack
- Sprache: [TypeScript 5.4]
- Framework: [Next.js 15, App Router]
- Datenbank: [PostgreSQL via Drizzle ORM]
- Auth: [Better Auth]
- Bereitstellung: [Railway]

## Befehle
- Dev: `npm run dev`
- Tests: `npm test`
- Build: `npm run build`
- Lint: `npm run lint`
- DB migrieren: `npx drizzle-kit migrate`

## Wichtige Verzeichnisse
- `src/app/` — Next.js App Router-Seiten
- `src/components/` — Shared UI-Komponenten
- `src/lib/` — Dienstprogramme und Helfer
- `src/db/` — Datenbankschema und Abfragen

## Codierungskonventionen
- TypeScript im strengen Modus — kein `any`
- Serverkomponenten standardmäßig; `use client` nur wenn nötig
- Konventionelle Commits: feat/fix/chore/docs/refactor
- Tests erforderlich für neue Geschäftslogik

## Nicht ändern
- `src/db/schema.ts` — Schemaänderungen mit dem Team koordinieren
- `.env.example` — aktualisieren, wenn neue Env-Vars hinzugefügt werden
- `src/middleware.ts` — Auth-Änderungen koordinieren

## Häufige Aufgaben
- Hinzufügen einer API-Route: erstellen Sie `src/app/api/[name]/route.ts`
- Hinzufügen einer Komponente: erstellen Sie in `src/components/[name].tsx`
- Datenbankabfrage: hinzufügen zu `src/db/queries/[entity].ts`
```

## Was man einbeziehen vs. ausschließen sollte

**Einbeziehen:**
- Build- und Testbefehle
- Verzeichnisstruktur und Zweck
- Codierungskonventionen, die auf alle Agents zutreffen
- Dateien, die ohne Koordination nicht geändert werden dürfen

**Ausschließen:**
- Claude Code-spezifische Funktionen (Hooks, Agents, `/skills`) → in CLAUDE.md einbeziehen
- Geheimnisse oder Anmeldedaten → niemals in einer verfolgten Datei
- Dinge, die bereits aus dem Code ersichtlich sind

## Auto-Generieren von AGENTS.md

Bitten Sie Claude Code, es zu generieren:

```
"Lesen Sie das Projekt und generieren Sie eine AGENTS.md-Datei.
Konzentrieren Sie sich auf: Tech-Stack, wichtige Verzeichnisse, Befehle, Konventionen und was nicht zu berühren ist.
Halten Sie es unter 80 Zeilen — prägnant genug, dass jeder Agent es vollständig liest."
```

## Es synchron halten

AGENTS.md sollte aktualisiert werden, wenn:
- Der Tech-Stack ändert sich (Framework-Upgrade, neuer Service)
- Neue Entwickler oder Agents treten dem Projekt bei
- Wichtige Verzeichnisse werden umstrukturiert
- Befehle ändern sich (Test-Runner, Build-Prozess)

Fügen Sie eine Erinnerung in Ihre CLAUDE.md ein:
```markdown
## Wartung
Beim Ändern von Tech-Stack oder Befehlen: Aktualisieren Sie sowohl CLAUDE.md als auch AGENTS.md
```

## Beziehung zu CLAUDE.md

Ein typisches Projekt hat beide:
- **AGENTS.md**: universeller Kontext (80 Zeilen, fokussiert auf das, was jeder Agent benötigt)
- **CLAUDE.md**: Claude-spezifische Ergänzungen (zu ladende Hooks, zu verwendende Agents, Claude Code-spezifische Muster)

CLAUDE.md kann auf AGENTS.md verweisen:
```markdown
# CLAUDE.md

Siehe AGENTS.md für Projektübersicht, Stack und Befehle.

## Claude Code-spezifisch
- Laden Sie /skills/backend/nodejs/nextjs beim Sessionstart
- Führen Sie /ship-gate vor jedem Production-Deploy aus
- Verwenden Sie /agents/advisors/cto-advisor für Architektur-Fragen
```

---
