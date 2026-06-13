# Einstellungs-Scope-Referenz — Global vs Projekt

Alles in Claude Code existiert entweder im **globalen** Scope (`~/.claude/`) oder im **Projekt** Scope (`.claude/`). Einige Funktionen sind nur global. Dieser Leitfaden ist die maßgebliche Referenz für den Aufenthaltsort der Dinge und deren Interaktion.

---

## Scope-Übersicht

| Feature | Global (`~/.claude/`) | Projekt (`.claude/`) | Notizen |
|---|---|---|---|
| `CLAUDE.md` | `~/.claude/CLAUDE.md` | `CLAUDE.md` (Repo-Wurzel) | Beide geladen; beim Start verkettet |
| `settings.json` | `~/.claude/settings.json` | `.claude/settings.json` | Zusammengeführt; Projekt überschreibt global |
| `settings.local.json` | `~/.claude/settings.local.json` | `.claude/settings.local.json` | Persönliche Overrides; gitignoriert |
| Kompetenzen | `~/.claude/skills/` | `.claude/skills/` | Beide gleichzeitig aktiv |
| Agenten | `~/.claude/agents/` | `.claude/agents/` | Beide gleichzeitig aktiv |
| Hooks | `~/.claude/settings.json` | `.claude/settings.json` | Beide aktivieren; Arrays werden verkettet |
| Regeln | `~/.claude/rules/` | `.claude/rules/` | Beide aktiv; abgeglichen nach `paths:` Frontmatter |
| MCP-Server | `~/.claude.json` | `.claude/mcp.json` | Beim Start zusammengeführt |
| Aufgaben | `~/.claude/tasks/` | — | Nur global |
| Agenten-Teams | `~/.claude/teams/` | — | Nur global |
| Keybindings | `~/.claude/keybindings.json` | — | Nur global |
| Memory-Dateien | `~/.claude/memory/` | — | Nur global |
| Credentials / Tokens | `~/.claude/` | — | Nur global; nie committen |

---

## `settings.local.json`

Beide Scopes unterstützen eine `.local.json` Variante für persönliche Overrides:

- `~/.claude/settings.local.json` — persönliche globale Overrides (nie committed)
- `.claude/settings.local.json` — persönliche Projekt-Overrides (standardmäßig gitignoriert)

Verwenden Sie `.local.json`, um von der Mannschaft committete Einstellungen zu überschreiben, ohne die gemeinsame Konfiguration zu berühren. Häufige Anwendungsfälle: Hook während des Debuggings deaktivieren, persönliche `ANTHROPIC_BASE_URL` setzen, Standard-Modell überschreiben.

Die Ladereihenfolge innerhalb jedes Scopes ist:

1. `settings.json` (Basis)
2. `settings.local.json` (Basis-Overrides)

---

## Merge-Verhalten

Wenn derselbe Schlüssel in beiden globalen und Projekt-Scopes vorhanden ist:

| Schlüsseltyp | Verhalten |
|---|---|
| Skalar (`model`, `effort`, String-Flags) | Projekt gewinnt — globaler Wert wird ignoriert |
| Arrays (`hooks`, `tools`, `permissions`) | Verkettet — beide Werte sind aktiv |
| Verschachtelte Objekte | Rekursiv zusammengeführt; Projekt-Schlüssel gewinnen bei Konflikt |

**Kritisch:** Hooks-Arrays werden verkettet, nicht ersetzt. Wenn Sie einen globalen `Stop` Hook und einen `Stop` Hook im Projekt definieren, **beide aktivieren**. Dies ist oft das beabsichtigte Verhalten (globale Hooks handhaben Audit-Logging; Projekt-Hooks handhaben projektspezifische Validierung), kann aber zu doppelter Ausführung führen, wenn derselbe Hook versehentlich in beiden Scopes definiert ist.

---

## CLAUDE.md Ladereihenfolge

Alles Folgende wird beim Sitzungsstart geladen und in den Kontext verkettet:

1. `~/.claude/CLAUDE.md` — globale Benutzeranweisungen
2. `CLAUDE.md` in der Repo-Wurzel — Projekt-Anweisungen
3. `CLAUDE.md` Dateien in übergeordneten Verzeichnissen zwischen der aktuellen Datei und der Repo-Wurzel (aufwärts gehen)
4. `.claude/rules/*.md` Dateien, deren `paths:` Frontmatter die aktuelle Datei abgleicht

Spätere Einträge überschreiben frühere nicht — alle Inhalte sind gleichzeitig aktiv. Wenn Einträge kollidieren, hat Projekt-Level-Inhalt praktische Vorrangstellung, weil er später im verketteten Prompt erscheint, aber es gibt keinen expliziten Override-Mechanismus zwischen CLAUDE.md-Dateien.

**Token-Budget:** Der kombinierte CLAUDE.md-Inhalt zählt gegen das Kontextfenster. Wenn alle Quellen das Budget überschreiten, werden ältere oder niedrigere Quellen gekürzt. Halten Sie globales CLAUDE.md prägnant — es lädt für jeden Projekt.

---

## Projekt-Scope Verzeichnis-Layout

Ein gut strukturierter Projekt-Scope sieht aus wie:

```
.claude/
  settings.json         # committed — Team-Konfiguration
  settings.local.json   # gitignoriert — persönliche Overrides
  mcp.json              # committed — Projekt-MCP-Server
  skills/
    feature-name.md     # projektspezifische Schrägstrich-Befehle
  agents/
    specialist.md       # projektspezifische Sub-Agenten
  rules/
    style.md            # immer-aktive Regeln (kein paths: = immer auf)
    tests.md            # paths: ["**/*.test.ts"] = Auto-Aktivierung
  hooks/
    validate.sh         # Hook-Skripte (referenziert aus settings.json)
  memory/               # Sitzungs-Memory (gitignoriert)
```

---

## Global-Scope Verzeichnis-Layout

```
~/.claude/
  CLAUDE.md             # globale Anweisungen, für jeden Projekt geladen
  settings.json         # globale Standard-Einstellungen
  settings.local.json   # persönliche globale Overrides
  skills/               # Kompetenzen in jedem Projekt aktiv
  agents/               # Agenten in jedem Projekt verfügbar
  rules/                # Regeln in jedem Projekt aktiv
  tasks/                # sitzungsübergreifende Aufgabenlisten
  teams/                # Agenten-Team-Definitionen
  keybindings.json      # Tastenneubelegung
  memory/               # Persistente Memory über Projekte hinweg
```

---

## Häufige Fallstricke

**`.local.json` Dateien committen.** Sie werden standardmäßig gitignoriert, aber wenn Sie sie force-add, geben Sie persönliche API-Schlüssel oder Endpunkt-Overrides dem Team bekannt. Fügen Sie explizit `settings.local.json` zu `.gitignore` hinzu, wenn es nicht bereits abgedeckt ist.

**Denselben Hook in beiden Scopes definieren.** Der Hook aktiviert zweimal. Dies ist besonders störend für Hooks, die Audit-Logs schreiben — Sie erhalten duplizierte Einträge. Einmal global auditieren; pro-Projekt validieren.

**Alles ins globale CLAUDE.md packen.** Globales CLAUDE.md lädt für jeden Projekt. Es mit projektspezifischen Anweisungen zu verstopfen verschwendet Token auf unabhängigen Sitzungen. Setzen Sie projektspezifische Anweisungen ins Projekt-`CLAUDE.md`.

**Annahme, dass Kompetenzen den Baum hochgehen.** Das tun sie nicht. CLAUDE.md-Dateien gehen hoch; Kompetenzen nicht. Eine Kompetenz in `/workspace/project/.claude/skills/` ist nicht sichtbar, wenn Claude in `/workspace/project/packages/api/` arbeitet. Jedes Sub-Paket benötigt sein eigenes `.claude/skills/` für paketspezifische Kompetenzen.

---
