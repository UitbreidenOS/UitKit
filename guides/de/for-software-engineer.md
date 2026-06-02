# Claude für Software Engineers

Alles, was ein Software Engineer oder Full-Stack Developer benötigt, um KI-gestützte Feature-Entwicklung, Code-Reviews, Debugging, Architekturdokumentation und technische Entscheidungsfindung in Claude Code durchzuführen.

---

## Für wen dieser Leitfaden gedacht ist

Du bist Software Engineer, Full-Stack Developer oder Technical Lead, dessen Aufgabe es ist, zuverlässigen Code zu liefern — Systeme entwerfen, Features schreiben, PRs reviewen, Bugs beheben und technische Schulden davon abhalten, sich anzuhäufen. Du verbringst zu viel Zeit damit, zwischen Tools zu wechseln, Boilerplate zu schreiben und Dokumentation manuell zu generieren. Claude Code reduziert diesen Overhead um 20-40x.

**Vor Claude Code:** 45 Minuten, um einen komplexen PR zu reviewen. 2 Stunden, um ein Produktionsproblem ohne offensichtlichen Stack-Trace zu debuggen. Architekturentscheidungen Wochen später dokumentiert, wenn überhaupt. Das Onboarding eines neuen Teammitglieds dauert eine ganze Woche.

**Danach:** PR mit Inline-Kommentaren in unter 5 Minuten reviewt. Ursache in einer Debug-Session identifiziert. ADRs werden zum Zeitpunkt der Entscheidung geschrieben. Onboarding-Doku in 30 Sekunden aus der Codebase generiert.

---

## 30-Sekunden-Installation

```bash
# Skill-Sets nach Disziplin installieren
npx claudient add skills backend
npx claudient add skills devops-infra
npx claudient add skills ai-engineering
npx claudient add skills database
npx claudient add skills productivity

# Oder gezielt auswählen:
npx claudient add skill backend/next-js
npx claudient add skill backend/fastapi
npx claudient add skill devops-infra/docker
npx claudient add skill devops-infra/kubernetes
npx claudient add skill devops-infra/terraform
npx claudient add skill productivity/code-review
npx claudient add skill productivity/debug
npx claudient add skill productivity/refactor
npx claudient add skill productivity/pr-review
npx claudient add skill productivity/adr-writer
npx claudient add skill productivity/ship-gate
npx claudient add skill productivity/tech-debt-tracker
npx claudient add skill ai-engineering/claude-api
npx claudient add skill ai-engineering/rag-architect
npx claudient add skill ai-engineering/mcp-server-builder
npx claudient add skill database/drizzle
npx claudient add skill database/postgres
```

---

## Dein Claude Code Engineering-Stack

### Skills (Slash-Befehle)

| Skill | Was er macht | Wann verwenden |
|---|---|---|
| `/next-js` | Next.js App Router Scaffolding, RSC-Patterns, Routing, API Routes, Server Actions | Next.js-Apps erstellen oder erweitern |
| `/fastapi` | FastAPI Endpunkt-Generierung, Pydantic-Schemas, Dependency Injection, Background Tasks | Python-API-Entwicklung |
| `/docker` | Dockerfile-Erstellung, Multi-Stage-Builds, Compose-Dateien, Image-Optimierung | Services containerisieren |
| `/kubernetes` | Manifest-Generierung, Deployment-Strategien, Helm-Chart-Review, Ressourcenlimits | K8s-Konfiguration und Deployment-Reviews |
| `/terraform` | Infrastructure-as-Code-Module, Plan-Review, State-Management-Anleitung | Cloud-Infrastruktur-Bereitstellung |
| `/code-review` | Tiefes Korrektheitsprüfung: Bugs, Logikfehler, Edge Cases, Sicherheitsprobleme | Eigenen Code vor dem Pushen überprüfen |
| `/debug` | Systematische Ursachenanalyse — Stack Traces, Logs, Hypothesen, Reproduktionsschritte | Jeder Bug, der in 10 Minuten nicht offensichtlich ist |
| `/refactor` | Strukturiertes Refactoring mit Vorher/Nachher-Diff und Test-Impact-Analyse | Code bereinigen ohne das Verhalten zu brechen |
| `/pr-review` | PR-Zusammenfassung, Risikobewertung, Inline-Kommentar-Generierung, Merge-Empfehlung | Eingehende PRs reviewen |
| `/adr-writer` | Architecture Decision Record aus einem Kontext und einer Entscheidung generieren | Architekturentscheidungen zum Zeitpunkt der Entscheidung dokumentieren |
| `/ship-gate` | Pre-Merge-Checkliste: Tests, Abdeckung, Sicherheit, Performance, Docs | Letzter Check vor dem Merge zu main |
| `/tech-debt-tracker` | Technische Schulden in einer Codebase identifizieren, kategorisieren und priorisieren | Quartalsweise Schulden-Planungssessions |
| `/claude-api` | Claude API und Anthropic SDK Integration mit Prompt-Caching, Tool Use, Streaming | Features auf Basis von Claude entwickeln |
| `/rag-architect` | RAG-Pipeline-Design: Chunking, Embeddings, Retrieval, Reranking | Knowledge-Retrieval-Features entwickeln |
| `/mcp-server-builder` | Model Context Protocol Server scaffolden und verdrahten | Claude mit benutzerdefinierten Tools erweitern |
| `/drizzle` | Drizzle ORM Schema-Design, Migrationen, Query-Generierung, Relationen | TypeScript-Datenbankarbeit |
| `/postgres` | Query-Optimierung, Schema-Design, Indexierungsstrategie, EXPLAIN-Analyse | PostgreSQL-Datenbankarbeit |

### Agents

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `core/architect` | Opus | System-Design-Entscheidungen, service-übergreifende Architektur, große Refactorings |
| `core/code-reviewer` | Sonnet | Tiefes PR-Review, Korrektheitsprüfungen, Logik-Verifikation |
| `core/security-reviewer` | Sonnet | Sicherheitsaudits, Dependency-Review, Threat Modelling |
| `core/planner` | Sonnet | Epics in Aufgaben aufteilen, Sprint-Planung, Schätzung |
| `roles/senior-backend` | Sonnet | Backend-Implementierung, API-Design, Performance-Tuning |
| `roles/senior-frontend` | Sonnet | UI/UX-Implementierung, Komponentenarchitektur, Accessibility |
| `roles/fullstack-developer` | Sonnet | Features, die Frontend und Backend mit gemeinsamen Typen umfassen |
| `build-resolvers/typescript-resolver` | Haiku | TypeScript-Kompilierungsfehler, Type-Inference-Fehler, tsconfig-Probleme |
| `build-resolvers/python-resolver` | Haiku | Python-Import-Fehler, Dependency-Konflikte, Virtual-Environment-Probleme |

---

## Täglicher Workflow

### Morgens — Kontext laden (10-15 Minuten)

**1. Orientierung über nächtliche Änderungen**
```
/pr-review

Liste alle offenen PRs auf main auf. Für jeden:
- Einzeilige Zusammenfassung, was er macht
- Risikobewertung (niedrig / mittel / hoch)
- Ob er heute mein Review benötigt
```

**2. Kontext für den aktuellen Feature-Branch laden**
```
/adr-writer

Ich nehme die Arbeit an [Feature-Name] wieder auf.
Hier ist der Branch-Diff: [git diff einfügen oder den Stand beschreiben]

Fasse zusammen, was entschieden wurde, was noch offen ist,
und markiere Entscheidungen, die ich treffen muss, bevor ich mehr Code schreibe.
```

---

### Feature-Entwicklung (fortlaufend)

**3. Einen neuen Endpunkt oder eine Komponente scaffolden**
```
/fastapi

Füge einen POST /api/v1/documents/ingest Endpunkt hinzu:
- Auth: Bearer Token, gegen users-Tabelle validieren
- Body: { source_url: str, metadata: dict }
- Background Task: Inhalt abrufen, chunken, einbetten, in pgvector speichern
- Response: { job_id: uuid, status: "queued" }

Das bestehende Dependency-Injection-Muster in app/dependencies.py verwenden.
```

**4. Eigenen Code vor dem Pushen reviewen**
```
/code-review

[Diff einfügen oder die Datei beschreiben]

Prüfe auf:
- Korrektheitsfehler und Edge Cases
- SQL-Injection oder Auth-Bypass-Risiken
- N+1-Queries oder fehlende Indizes
- Fehlende Fehlerbehandlung
- Jede Logik, die unter Nebenläufigkeit bricht
```

---

### PR-Review (5-10 Minuten pro PR)

**5. Einen eingehenden PR reviewen**
```
/pr-review

PR: [Titel oder Link]
Autor: [Name]
Diff:
[Diff einfügen]

Gib mir:
- Was dieser PR in 2-3 Sätzen macht
- Risikobewertung und warum
- Alle Bugs oder Korrektheitsprobleme
- Inline-Kommentare, die ich posten soll
- Merge-Empfehlung
```

---

### Debugging (bei Bedarf)

**6. Einen Bug systematisch diagnostizieren**
```
/debug

Fehler:
[Stack Trace einfügen oder das Symptom beschreiben]

Kontext:
- Umgebung: [Produktion / Staging / lokal]
- Wann es begann: [Deployment, Konfigurationsänderung, Datenereignis]
- Häufigkeit: [jede Anfrage / intermittierend / unter Last]
- Was ich bereits geprüft habe: [Liste]

Führe mich Schritt für Schritt durch die Ursachenanalyse.
```

---

### Architektur und Dokumentation

**7. Eine Entscheidung im Moment des Treffens dokumentieren**
```
/adr-writer

Entscheidung: Von REST zu tRPC für interne Service-Kommunikation wechseln
Kontext: Wir haben 4 Services, die TypeScript-Typen teilen. REST verursacht Drift.
Betrachtete Alternativen: GraphQL, gRPC, plain REST mit geteiltem Typen-Paket
Entscheidung: tRPC — gleiche Sprache, kein Schema-Drift, Typsicherheit end-to-end
Konsequenzen: Frontend-Team muss aktualisieren, alle bestehenden REST-Clients werden abgekündigt

ADR im Standardformat schreiben.
```

**8. Wöchentliche Tech-Debt-Session**
```
/tech-debt-tracker

Die folgenden Dateien/Verzeichnisse auf technische Schulden scannen:
[Dateiliste einfügen oder den Bereich beschreiben]

Kategorisieren nach:
- Korrektheitrisiko (wird das brechen?)
- Velocity-Drag (verlangsamt das die Entwicklung?)
- Sicherheitsexposition
- Wartungskosten

Für jedes Element einen priorisierten Backlog-Eintrag ausgeben.
```

---

## 30-Tage-Einarbeitungsplan (Engineers, die Claude Code neu kennenlernen)

### Woche 1 — Installation und erste Erfolge
- Alle Skill-Sets installieren: `npx claudient add skills backend devops-infra productivity`
- GitHub MCP konfigurieren (siehe Tool-Integrationen unten)
- `/pr-review` auf die letzten 5 gemergten PRs im Repo ausführen — auf die Muster der Codebase kalibrieren
- `/debug` auf den letzten manuell gelösten Bug anwenden — sehen, was es schneller gefunden hätte
- `/code-review` auf den nächsten PR vor dem Pushen anwenden — mindestens ein Problem finden, das übersehen worden wäre

### Woche 2 — Integration in den täglichen Workflow
- Jeden Morgen mit einem PR-Queue-Scan mit `/pr-review` beginnen
- `/fastapi` oder `/next-js` für jedes neue Endpunkt- oder Seiten-Scaffolding verwenden — kein Blank-Page-Syndrom
- Ersten ADR mit `/adr-writer` schreiben — jede diese Woche getroffene Entscheidung qualifiziert
- `/ship-gate` auf den nächsten PR vor dem Review-Request ausführen

### Woche 3 — Tiefere Automatisierung
- Sentry-Hook einrichten (siehe Tool-Integrationen unten), damit Bug-Kontext automatisch in Claude ankommt
- `/tech-debt-tracker` auf dem eigenen Bereich der Codebase ausführen
- `core/architect` für jede Design-Entscheidung mit mehr als 2 Services verwenden
- `build-resolvers/typescript-resolver` für den nächsten TypeScript-Build-Fehler einsetzen — roten Text nicht mehr manuell lesen

### Woche 4 — Team-Hebelwirkung
- `/pr-review` auf jeden PR vor der Genehmigung ausführen — von Claude generierte Inline-Kommentare direkt posten
- `core/planner` verwenden, um das nächste Epic in eine Sprint-große Aufgabenliste aufzuteilen
- Eine vierteljährliche Tech-Debt-Session mit `/tech-debt-tracker` über das gesamte Repo planen
- Messen: PR-Review-Zeit, Bug-Auflösungszeit und Doku-Abdeckung vor und nach vergleichen

---

## Tool-Integrationen

### GitHub MCP (empfohlen)

```json
// Zu ~/.claude/settings.json hinzufügen
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

Damit verbunden kann Claude:
- PR-Diffs, Kommentare und Review-Threads lesen ohne Kopieren/Einfügen
- Inline-Review-Kommentare direkt auf GitHub posten
- Issue-Beschreibungen lesen und mit Code-Änderungen verknüpfen
- CI-Status prüfen und fehlgeschlagene Test-Ausgaben anzeigen

### Jira / Linear MCP

```json
// Linear — zu ~/.claude/settings.json hinzufügen
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "your-key-here"
      }
    }
  }
}
```

Damit verbunden kann Claude:
- Ticket-Beschreibungen bei der Implementierungsplanung lesen
- Ticket-Status aktualisieren und Engineering-Notizen hinzufügen
- PRs während `/pr-review`-Sessions automatisch mit Issues verknüpfen
- Sprint-Zusammenfassungen aus abgeschlossenen Tickets generieren

### Sentry-Hook (automatisierter Bug-Kontext)

Einen Hook einrichten, der Sentry-Alert-Kontext automatisch in Claude leitet, bevor eine `/debug`-Session beginnt:

```json
// Zu .claude/settings.json hinzufügen
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "sentry",
        "command": "python .claude/hooks/sentry-context.py"
      }
    ]
  }
}
```

Der Hook ruft das vollständige Sentry-Event ab — Stack Trace, Breadcrumbs, Tags, betroffene Benutzer — und stellt es der `/debug`-Session automatisch voran. Kein manuelles Kopieren aus dem Sentry-Dashboard.

---

## Benchmarks

Dies sind beobachtete Ergebnisse von Engineering-Teams, die den vollständigen Claudient-Stack verwenden. Individuelle Ergebnisse variieren je nach Codebase-Komplexität und Workflow-Adoption.

| Kennzahl | Vor Claude Code | Nach Claude Code |
|---|---|---|
| PR-Review-Zeit (Durchschnitt) | 35-50 Min. | 5-8 Min. |
| Bug-Auflösungszeit (P2) | 2-4 Stunden | 25-45 Min. |
| ADR-Abdeckung (dokumentierte Entscheidungen) | 20-30% | 85-95% |
| Zeit zum Scaffolden eines neuen Endpunkts | 20-30 Min. | 3-5 Min. |
| Onboarding-Zeit (neuer Engineer bis erster PR) | 5-7 Tage | 2-3 Tage |
| Identifizierte Tech-Debt-Backlog-Items/Quartal | 10-20 (manuell) | 60-100 (automatischer Scan) |
| Build-Fehler-Auflösungszeit | 15-30 Min. | 3-8 Min. |

---

## Ressourcen

- [Getting started with Claude Code](./getting-started.md)
- [GitHub MCP setup](../mcp/github.md)
- [Jira MCP setup](../mcp/jira.md)
- [Code review workflow](../workflows/code-review.md)
- [ADR writer skill](../skills/productivity/adr-writer.md)
- [RAG architecture skill](../skills/ai-engineering/rag-architect.md)
- [MCP server builder skill](../skills/ai-engineering/mcp-server-builder.md)

---

> **Arbeite mit uns:** Claudient wird unterstützt von [Uitbreiden](https://uitbreiden.com/) — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
