# MCP: GitHub

Interagiere mit GitHub direkt von Claude Code aus. Lese Issues, öffne PRs, überprüfe Code, durchsuche Repositories und verwalte Releases — alles ohne Terminal zu verlassen oder zu einem Browser zu wechseln.

## Warum du das brauchst

Die `gh`-CLI deckt die meisten lokalen Git-Operationen ab, aber GitHubs API-Oberfläche ist viel größer. Mit GitHub MCP:
- Claude kann Code über deine ganze Organisation hinweg durchsuchen, nicht nur das aktuelle Repo
- Issue-Triage, Labeling und Kommentare finden in derselben Session wie deine Code-Änderungen statt
- PR-Erstellung und Review sind Teil des Workflows, keine separate Browser-Aufgabe
- Repository-Metadaten, Commit-Verlauf und Datei-Inhalte aus jedem Branch sind abfragbar
- Cross-Repo-Aufgaben (Dependency-Audits, Org-weite Suchen) werden zu einzelnen Prompts

## Installation

```bash
npm install -g @modelcontextprotocol/server-github
```

## Konfiguration

Füge zu `~/.claude.json` oder project `.claude/mcp.json` hinzu:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-github-pat-here"
      }
    }
  }
}
```

## Schlüssel-Tools

- `create_or_update_file` — erstelle oder aktualisiere eine Datei in einem Repository
- `search_repositories` — durchsuche GitHub nach Repositories nach Keyword oder Topic
- `create_repository` — erstelle ein neues Repository unter deinem Konto oder deiner Organisation
- `get_file_contents` — lese eine Datei aus jedem Branch eines beliebigen zugänglichen Repos
- `push_files` — pushe mehrere Datei-Änderungen als einen einzelnen Commit
- `create_issue` — öffne ein neues Issue mit Titel, Body, Labels und Assignees
- `create_pull_request` — öffne einen PR mit Titel, Body, Base und Head-Branch
- `fork_repository` — forke ein Repo auf dein Konto
- `create_branch` — erstelle einen neuen Branch von einem beliebigen Ref
- `list_commits` — hole den Commit-Verlauf für einen Branch oder Datei-Pfad
- `list_issues` / `get_issue` — frage Issues nach State, Label, Assignee oder Milestone ab
- `add_issue_comment` — füge einen Kommentar zu jedem Issue oder PR hinzu
- `search_code` — durchsuche Code über GitHub mit der Code-Such-Syntax
- `search_issues` — durchsuche Issues und PRs mit GitHubs kompletter Abfrage-Syntax

## Verwendungsbeispiele

```
Liste alle offenen Issues in diesem Repo mit dem Label 'bug' auf, sortiert nach Kommentar-Anzahl,
und gib mir eine Prioritäts-geordnete Zusammenfassung, was zuerst behoben werden muss.
```

```
Lese die PR-Beschreibung für #123 und schreibe einen detaillierten Code-Review-Kommentar
über die Authentifizierungs-Änderungen — konzentriere dich auf Sicherheit und Edge Cases.
```

```
Durchsuche alle TODO und FIXME Kommentare über die Codebase mit search_code,
erstelle dann ein GitHub-Issue für jeden im TECH-Projekt,
mir zugeordnet mit dem Label 'tech-debt'.
```

```
Erstelle einen Release-Branch namens release/2.4.0 von main, öffne dann einen PR
zurück zu main mit dem Changelog für alles, das in den letzten zwei Wochen gemergt wurde.
```

```
Durchsuche alle Repos in unserer Organisation nach package.json-Dateien, die
Lodash-Version 4.17.20 oder früher abhängen, und liste die betroffenen Repositories auf.
```

## Authentifizierung

1. Gehe zu **GitHub → Settings → Developer settings → Personal access tokens**
2. Wähle **Fine-grained tokens** (empfohlen) oder **Tokens (classic)**
3. Für Classic-Tokens, wähle diese Scopes: `repo`, `read:org`, `read:user`
4. Für Fine-grained Tokens, erteile **Contents**, **Issues**, **Pull requests** und **Metadata**-Berechtigungen auf den Repos, die du brauchst
5. Kopiere das Token und setze es als `GITHUB_PERSONAL_ACCESS_TOKEN` im Konfig-Block oben

## Tipps

**Verwende Fine-grained Tokens:** Beschränke das Token auf bestimmte Repositories statt deines ganzen Kontos. Wenn das Token durchsickert, ist der Schaden begrenzt.

**Rate Limits:** Die GitHub API erlaubt 5.000 Requests pro Stunde für authentifizierte Requests. Org-weite Code-Suchen zählen gegen ein separates Search-Rate-Limit (30 Requests pro Minute) — cache Ergebnisse bei Bulk-Operationen.

**Kombiniere mit lokalem Git:** GitHub MCP handhabt die Remote-API-Oberfläche; verwende deine lokalen `git`-Befehle zum Staging, Committen und Pushen. Die zwei ergänzen sich in derselben Session.

**Code-Such-Syntax:** `search_code` unterstützt GitHubs komplette Abfrage-Syntax — `language:typescript repo:myorg/myrepo "TODO"` funktioniert genau wie in der GitHub-UI. Verwende es für gezielte Abfragen, statt ganze Dateien zu holen.

**PR-Body-Qualität:** Wenn du `create_pull_request` verwendest, gebe Claude den Diff und den Issue-Kontext und bitte es, den PR-Body zu schreiben. Das Ergebnis wird nützlicher sein als ein Template-gefüllter Platzhalter.

---
