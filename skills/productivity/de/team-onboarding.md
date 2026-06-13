# Team Onboarding

## Wann aktivieren

- Benutzer führt `/team-onboarding` aus
- Benutzer fordert an, ein Onboarding-Dokument für ein neues Teamkollegen oder einen Auftragnehmer zu generieren
- Benutzer möchte den Projektkontext für einen Entwickler erfassen, der zum Projekt beitritt
- Benutzer möchte ein "Start hier"-Dokument, das Setup bis zur ersten Bereitstellung abdeckt
- KI-gestütztes Onboarding für ein Team einrichten, bei dem neue Mitglieder Claude Code verwenden

## Wann nicht verwenden

- Das Projekt hat bereits ein aktuelles `ONBOARDING.md` oder Äquivalent — das bestehende Dokument aktualisieren, anstatt es neu zu generieren
- Die Anfrage betrifft allgemeines HR-Onboarding des Unternehmens — diese Fähigkeit deckt nur technisches Projekt-Onboarding ab
- Der Benutzer möchte ein README — ein README ist öffentlich ; Onboarding-Dokumente sind intern, subjektiv, und gehen davon aus, dass der Leser Repo-Zugriff hat

## Anweisungen

### Was zu generieren ist

Das Onboarding-Dokument deckt alles ab, was ein Entwickler wissen muss, um von null zum ersten Commit zu gelangen. Abschnitte:

1. **Projektübersicht** — Was es tut, wer es verwendet und warum es existiert (2–4 Sätze max)
2. **Tech Stack** — Framework, Sprache, Runtime, Datenbank, Cache, Queue — mit exakten Versionsnummern aus `package.json`, `pyproject.toml`, `go.mod` oder Äquivalent
3. **Lokales Setup** — Schritt-für-Schritt-Befehle zum Klonen, Installieren, Env-Konfiguration, Datenseeding und Dev-Server-Ausführung ; jeder Befehl muss kopiert werden können
4. **Wichtige Dateispeicherorte** — Wo sich die wichtigen Dinge befinden: Einstiegspunkte, Konfiguration, Routen, DB-Schema, Tests, CI-Konfiguration
5. **Test** — Wie Tests ausgeführt werden (Einheit, Integration, E2E), wie hoch der Abdeckungsschwellenwert ist, wie eine einzelne Testdatei ausgeführt wird
6. **Bereitstellung** — Wie Staging- und Produktionsbereitstellungen funktionieren, wer sie auslösen kann, was das Rollback-Verfahren ist
7. **Teamkonventionen** — Branch-Naming, Commit-Format, PR-Prozess, wer was überprüft, Code-Stil-Durchsetzung
8. **Claude Code-Konfiguration** — Welche Fähigkeiten in `.claude/skills/` aktiv sind, welche Agenten verfügbar sind, welche MCP-Server konfiguriert sind, nützliche Slash Commands für dieses Projekt

### Wie Informationen beschafft werden

Diese Dateien vor der Generierung lesen:

```
README.md                  — Projektbeschreibung, Schnellstart
package.json / pyproject.toml / go.mod / Cargo.toml — Versionen, Scripts, Abhängigkeiten
CLAUDE.md                  — Teamkonventionen, Claude-Konfiguration
Makefile                   — verfügbare Befehle
docker-compose.yml         — Services, Ports, Umgebung
.env.example               — erforderliche Umgebungsvariablen
.github/workflows/         — CI/CD-Pipeline, Test-Befehle, Deploy-Auslöser
src/ oder app/             — Einstiegspunkte, Struktur auf Top-Ebene
```

Keine Informationen erfinden. Wenn die Quelldatei eines Abschnitts nicht existiert oder die relevanten Informationen nicht enthält, einen Platzhalter wie `[TODO: Bereitstellungsprozess hinzufügen]` schreiben, anstatt zu raten.

### Ausgabeformat

Ausgabe: ein einzelnes Markdown-Dokument. Kein HTML, kein Front Matter.

Struktur:
```markdown
# Projektname — Entwickler-Onboarding

> Ein-Satz-Beschreibung, was das Projekt tut.

## Voraussetzungen
## Lokales Setup
## Tech Stack
## Wichtige Dateispeicherorte
## Tests ausführen
## Bereitstellung
## Teamkonventionen
## Claude Code-Konfiguration
## Hilfe erhalten
```

Scannerbar halten. Code-Blöcke für jeden Befehl verwenden. Tabellen für Tech Stack und Dateispeicherorte verwenden. Zieldauer: 2–4 Seiten beim Drucken.

### Wo zu speichern ist

In dieser Reihenfolge prüfen:
1. Wenn `docs/`-Verzeichnis existiert → in `docs/onboarding.md` speichern
2. Wenn `ONBOARDING.md` bereits existiert → vor Ort aktualisieren
3. Standard → in `ONBOARDING.md` an der Projektaußenseite speichern

Nach dem Speichern den Benutzer über den Dateipfad informieren und vorschlagen, ihn zur Checkliste der neuen Einstellung oder zu einem angehefteten Slack/Notion-Link hinzuzufügen.

### Füllung des Claude Code-Konfigurationsabschnitts

`.claude/` lesen, um diesen Abschnitt zu füllen:

```bash
ls .claude/skills/     # aktive Fähigkeiten auflisten → Slash Commands dokumentieren
ls .claude/agents/     # Agents auflisten → dokumentieren, wann jeder Agent verwendet wird
cat .claude/settings.json  # MCP-Server, Hooks, automatische Genehmigungen
```

Als schnelle Referenztabelle formatieren:

| Slash-Befehl | Was es tut |
|---|---|
| `/graphql-client` | Apollo Client mit Codegen einrichten |
| `/db-specialist` | Komplexe Query-Optimierung an DB-Agent delegieren |
| `/pr-review` | Automatisierte PR-Überprüfung vor Zusammenführen ausführen |

## Beispiel

`/team-onboarding` auf einem Next.js + Drizzle + Vercel-Projekt ausführen.

Claude liest: `package.json` (Next.js 15, Drizzle ORM 0.30, TypeScript 5.4), `docker-compose.yml` (PostgreSQL 16 auf Port 5432), `.env.example` (DATABASE_URL, NEXTAUTH_SECRET, RESEND_API_KEY), `Makefile` (Dev-, Test-, Migrate-, Seed-Ziele), `.github/workflows/deploy.yml` (Vercel-Vorschau auf PR, Produktion beim Zusammenführen zu main), `CLAUDE.md` (Squash-Merge-Richtlinie, konventionelle Commits, PR erfordert 1 Genehmigung).

Generierte `docs/onboarding.md` enthält:

```markdown
# Acme App — Entwickler-Onboarding

> B2B SaaS für Rechnungsverwaltung — Next.js 15 Frontend, Drizzle ORM + PostgreSQL Backend, auf Vercel bereitgestellt.

## Voraussetzungen
- Node.js 20+
- Docker Desktop (für lokales PostgreSQL)
- Vercel CLI: `npm i -g vercel`

## Lokales Setup
\`\`\`bash
git clone git@github.com:org/acme-app.git
cd acme-app
npm install
cp .env.example .env.local        # DATABASE_URL und NEXTAUTH_SECRET ausfüllen
docker compose up -d               # startet PostgreSQL auf localhost:5432
npm run db:migrate                 # alle Migrationen anwenden
npm run db:seed                    # Dev-Fixtures laden
npm run dev                        # http://localhost:3000
\`\`\`

## Tech Stack
| Ebene | Technologie | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15.1.0 |
| Sprache | TypeScript | 5.4.5 |
| ORM | Drizzle ORM | 0.30.9 |
| Datenbank | PostgreSQL | 16 |
| Auth | NextAuth.js | 5.0.0-beta |
| Email | Resend | 3.2.0 |
| Bereitstellung | Vercel | — |

...
```

Das vollständige Dokument umfasst etwa 3 Seiten und behandelt alles vom ersten Clone bis zum ersten zusammengeführten PR.

---
