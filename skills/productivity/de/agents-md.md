---
name: agents-md
description: "Erzeugen Sie AGENTS.md für agentübergreifende Portabilität (Claude Code, Cursor, Codex, Gemini CLI). Tool-agnostisches Repo-Kontextdokument, unterschiedlich von CLAUDE.md."
---

# AGENTS.md Writer

## Wann aktivieren

- Benutzer möchte, dass das Repo konsistent über mehrere KI-Codierungstools funktioniert (Claude Code, Cursor, Codex, Gemini CLI)
- Einrichtung eines neuen Repos für KI-gestützte Entwicklung und Bedarf eines einzelnen gemeinsamen Kontextdokuments
- CLAUDE.md existiert, ist aber Claude Code-spezifisch und andere Tools bekommen inkonsistente Ergebnisse
- Team standardisiert auf eine tool-agnostische KI-Kontextkonvention
- Nach einer CLAUDE.md-Überprüfung, wenn Sie die tool-agnostische Teilmenge extrahieren möchten

## Wann nicht verwenden

- Das Projekt verwendet nur Claude Code — CLAUDE.md ist das richtige Dokument, nicht AGENTS.md
- Das Repo hat ein vorhandenes AGENTS.md, das nur aktualisiert werden muss (verwenden Sie den context-auditor-Prompt, um CLAUDE.md zu trimmen und Änderungen zu spiegeln)
- MCP-Konfigurationen, Hook-Skripte oder Slash-Befehl-Definitionen — diese sind Claude Code-spezifisch und gehören nicht zu AGENTS.md

## Anweisungen

### AGENTS.md vs CLAUDE.md

| CLAUDE.md | AGENTS.md |
|---|---|
| Claude Code-spezifisch | Funktioniert mit jedem KI-Codierungstool |
| Kann Hooks, MCP, Slash Commands referenzieren | Tool-agnostisch — keine Claude-Funktionen |
| Kann ausführlich sein (einmal pro Sitzung geladen) | Sollte prägnant sein (<400 Zeilen) |
| Projektvorgaben + Claude-Verhalten | Projektkonventionen + Agent-Sicherheitsregeln |
| Von Claude Code-Benutzern betrieben | Von jedem KI-gestützten Team betrieben |

Die beiden Dateien können koexistieren. AGENTS.md ist die Obermenge dessen, was alle Tools gemeinsam haben; CLAUDE.md fügt Claude Code-spezifische Erweiterungen oben drauf.

### AGENTS.md-Struktur

Jede AGENTS.md muss diese Abschnitte in der Reihenfolge enthalten:

**1. Projektübersicht**
Zwei bis vier Sätze. Was das Projekt tut, wem es dient, welches Problem es löst. Keine Marketingsprache.

**2. Tech Stack**
Aufzählungsliste: Sprache + Version, Framework + Version, große Bibliotheken, Datenbank, Hosting/Infrastruktur.
Nur das, was tatsächlich im Repo ist — keine aspirativen Ergänzungen.

**3. Wichtigste Konventionen**
Die Regeln, die jeder Entwickler (oder KI-Agent) befolgen muss, um akzeptablen Code zu produzieren. Ziehen Sie aus:
- Existierende CLAUDE.md, falls vorhanden
- Linting-Konfiguration (`.eslintrc`, `pyproject.toml`, `rubocop.yml`)
- README
- Muster, die in der vorhandenen Codebasis beobachtet werden

Einbeziehen: Namenskonventionen, Dateiorganisation, zu verwendende Muster, zu vermeidende Muster.

**4. Agent-Verhaltensregeln**
Anweisungen speziell für KI-Agenten:
- Befehle, die sicher ohne zu fragen ausgeführt werden können: Tests, Linting, Formatierung, Typ-Überprüfung
- Befehle, die menschliche Bestätigung erfordern: Deploy, Migrate, Publish, Drop, Truncate, Restart
- Dateienerstellungsrichtlinie: vor Dateierstellung fragen vs. erst bearbeiten
- Commit-Richtlinie: vor dem Commit fragen vs. autonome Commits zulässig
- Bereichsdisziplin: was der Agent NICHT tun sollte, auch wenn es hilfreich erscheint

**5. Dateisicherheitskarte**
Eine Tabelle, die Pfade nach Risiko klassifiziert:

| Pfad / Muster | Status | Notizen |
|---|---|---|
| `src/`, `lib/`, `app/` | SICHER | Feature-Code — normales Bearbeiten |
| `tests/`, `spec/`, `__tests__/` | SICHER | Tests — frei ändern |
| `docs/` | SICHER | Dokumentation |
| `prisma/migrations/`, `db/migrate/` | VORSICHT | Nur mit Genehmigung ausführen |
| `src/auth/`, `src/payments/` | VORSICHT | Sicherheitsempfindlich — vor Änderungen kennzeichnen |
| `.env`, `*.secret`, `credentials.*` | GEFÄHRLICH | Niemals lesen oder ändern |
| `Dockerfile`, `.github/workflows/` | GEFÄHRLICH | Infrastruktur — Genehmigung erforderlich |
| `dist/`, `build/`, `.next/` | GEFÄHRLICH | Generiert — nicht direkt bearbeiten |

**6. Test-Befehle**
Genaue Befehle kopiert von `package.json`-Skripten, Makefile oder CI-Konfiguration. Keine Paraphrase.

```
Test:    npm test
Lint:    npm run lint
Typecheck: npm run typecheck
Format:  npm run format
```

### Was von AGENTS.md ausgeschlossen werden sollte

- Claude Code-Hooks (`PreToolUse`, `PostToolUse`, `Stop`)
- MCP-Serverkonfigurationen
- Claude-Slash-Befehl-Definitionen
- Modellführung (Haiku vs Sonnet vs Opus)
- Anweisungen, die auf Claude-spezifische Funktionen verweisen (Agent-Tool, /compact, Speicherdateien)
- Interne Teamnamen, Jira-Ticketnummern, persönliche Vorlieben

Diese gehören nur zu CLAUDE.md.

### AGENTS.md generieren

Verwenden Sie den Prompt `prompts/task-specific/agents-md-generator.md` für einen vollständig automatisierten Generierungsdurchgang. Die Fähigkeit hier deckt das Format ab; der Prompt deckt die Invokation ab.

## Beispiel

**Projekt:** Next.js 14 SaaS-App mit Prisma + PostgreSQL, auf Vercel bereitgestellt.

Generierter AGENTS.md-Auszug:

```markdown
# AGENTS.md

## Projektübersicht
Ein Multi-Tenant-SaaS-Dashboard zur Verfolgung von Softwareliefermetriken.
Entwickelt für Engineeringteams von 5–50 Personen. Kernwert: Beantwortung
"wie schnell versenden wir und wo sind wir blockiert" in unter 30 Sekunden.

## Tech Stack
- TypeScript 5.4
- Next.js 14 (App Router)
- Prisma 5 + PostgreSQL 16
- Tailwind CSS 3.4
- Vercel (Hosting + Edge Functions)
- Vitest (Einheit), Playwright (e2e)

## Wichtigste Konventionen
- Alle Komponenten: PascalCase, eine Komponente pro Datei
- Alle Utilitys: camelCase-Funktionen, kebab-case-Dateinamen
- Keine Barrel-Exporte (keine index.ts-Neuexporte)
- Server Components standardmäßig; 'use client' nur bei Bedarf hinzufügen
- Datenbankabfragen nur in `src/lib/db/` — nie direkt in Komponenten oder API-Routen
- Keine `any`-Typen — `unknown` + Type Guard verwenden, wenn die Form unsicher ist

## Agent-Verhaltensregeln
Sicher autonome Ausführung: `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm format`
Erfordert Bestätigung: `prisma migrate deploy`, `vercel --prod`, alle `DROP`-SQL
Vor Dateierstellung in fragen: `src/lib/db/`, `prisma/migrations/`
Nicht autonom committed — Änderungen immer zuerst zur Überprüfung präsentieren

## Dateisicherheitskarte
| Pfad | Status | Notizen |
|---|---|---|
| `src/components/` | SICHER | |
| `src/app/` | SICHER | |
| `src/lib/` | VORSICHT | Kerngeschäftslogik |
| `prisma/migrations/` | GEFÄHRLICH | Niemals vorhandene Migrationen ändern |
| `.env*` | GEFÄHRLICH | Niemals lesen oder schreiben |
| `.github/` | GEFÄHRLICH | CI/CD — Genehmigung erforderlich |

## Test-Befehle
pnpm test          # Vitest-Einheitstests
pnpm test:e2e      # Playwright End-to-End
pnpm lint          # ESLint
pnpm typecheck     # tsc --noEmit
```

---
