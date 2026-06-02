# Technical Writer Workspace — Projektstruktur

> Für einen technischen Autor, der Entwicklerdokumentation, API-Referenzen, Tutorials und Versionshinweise mit einem Docs-as-Code-Workflow mit GitHub, Mintlify/Docusaurus und Notion erstellt.

## Stack

- **Docs-as-Code:** GitHub (PRs, Reviews, Branch Protection auf `main`)
- **Doc-Website:** Mintlify (bevorzugt) oder Docusaurus 3.x oder GitBook — eine pro Workspace
- **Planung & Briefe:** Notion (Content-Kalender, SME-Interview-Notizen, Doc-Anfragen)
- **Diagramme:** Figma mit FigJam für Architektur- und Flussdiagramme
- **API-Tests:** Postman (Validierung von Request/Response-Beispielen vor Veröffentlichung)
- **Video-Walkthroughs:** Loom (eingebettet in Tutorials für komplexe Abläufe)
- **Kommunikation:** Slack (`#docs`, `#dev-rel`, `#product-feedback` Kanäle)
- **Linting:** Vale (Prose-Linting gegen benutzerdefinierte Style-Regeln), markdownlint
- **Link-Überprüfung:** lychee (Dead-Link-Erkennung in CI)
- **Suche:** Algolia DocSearch (Mintlify) oder lokales lunr.js (Docusaurus)

## Verzeichnisbaum

```
technical-writer-workspace/
├── .claude/
│   ├── CLAUDE.md                           # Workspace-Anweisungen für Claude Code
│   ├── settings.json                       # MCP-Server, Hooks, Berechtigungen
│   └── commands/
│       ├── api-doc.md                      # /api-doc — Endpunkt-Doc aus OpenAPI-Spec generieren
│       ├── tutorial-draft.md               # /tutorial-draft — Schritt-für-Schritt-Tutorial scaffolden
│       ├── changelog-entry.md              # /changelog-entry — versionierten Versionshinweis schreiben
│       ├── doc-audit.md                    # /doc-audit — Doc-Seite auf Genauigkeit und Aktualität prüfen
│       ├── onboarding-guide.md             # /onboarding-guide — Entwickler-Onboarding-Doc generieren
│       ├── release-notes.md                # /release-notes — Release Notes aus Changelog-Einträgen kompilieren
│       └── style-check.md                  # /style-check — Prose gegen Style-Guide-Regeln linting
├── api-reference/
│   ├── _template.md                        # Kanonisches Endpunkt-Doc-Format (Source of Truth)
│   ├── authentication.md                   # Auth-Überblick: API-Schlüssel, OAuth 2.0, Token-Scopes
│   ├── errors.md                           # Fehlercodes, Statuscodes, Retry-Anleitung
│   ├── rate-limits.md                      # Rate-Limit-Ebenen, Header, Backoff-Strategie
│   ├── pagination.md                       # Cursor vs Offset Pagination, Seitengröße-Limits
│   ├── versioning.md                       # API-Versionierungsrichtlinie, Deprecation-Timeline
│   ├── users/
│   │   ├── list-users.md                   # GET /users — Parameter, Response-Schema, Beispiele
│   │   ├── get-user.md                     # GET /users/{id}
│   │   ├── create-user.md                  # POST /users — Request Body, Validierungsregeln
│   │   ├── update-user.md                  # PATCH /users/{id}
│   │   └── delete-user.md                  # DELETE /users/{id} — Soft-Delete-Verhalten
│   ├── auth/
│   │   ├── token-exchange.md               # POST /auth/token
│   │   ├── refresh-token.md                # POST /auth/refresh
│   │   └── revoke-token.md                 # POST /auth/revoke
│   ├── webhooks/
│   │   ├── overview.md                     # Webhook-Zustellung, Retries, Signature-Verifikation
│   │   ├── event-types.md                  # Alle Event-Schemas mit Beispiel-Payloads
│   │   └── register-endpoint.md            # POST /webhooks — Registrierung und Validierung
│   └── sdks/
│       ├── node.md                         # Node.js SDK: Installation, Init, Code-Beispiele pro Endpunkt
│       ├── python.md                       # Python SDK
│       └── go.md                           # Go SDK
├── guides/
│   ├── _template.md                        # Konzeptionelles Guide-Format: Überblick, Warum, Wie, Nächste Schritte
│   ├── getting-started.md                  # Erste Integration: Auth → erster API-Aufruf → Response
│   ├── authentication.md                   # Tiefgang: Auth-Methode wählen, Token-Lebenszyklus
│   ├── error-handling.md                   # Defensive Coding-Muster, Retry-Logik, Exponentieller Backoff
│   ├── security-best-practices.md          # Schlüsselrotation, Scope-Minimierung, Secret-Speicherung
│   ├── migrating-from-v1.md               # v1 → v2 Migration: Breaking Changes, Codemods
│   ├── idempotency.md                      # Idempotency Keys: Wann, Warum, Implementierung
│   └── testing-your-integration.md         # Sandbox-Umgebung, Testdaten, Postman-Collection-Link
├── tutorials/
│   ├── _template.md                        # Tutorial-Format: Ziel, Voraussetzungen, Schritte, Verifizieren, Nächste
│   ├── quickstart-5-minutes.md             # End-to-End: API-Schlüssel → erster erfolgreicher Aufruf
│   ├── build-a-webhook-receiver.md         # Node.js Express-Server, der Events verarbeitet
│   ├── sync-users-from-csv.md              # Batch-Import-Workflow mit Fehlerbehandlung
│   ├── oauth-integration-nextjs.md         # OAuth 2.0 PKCE-Flow in einer Next.js-App
│   ├── automate-user-provisioning.md       # SCIM 2.0 Provisioning-Tutorial
│   └── postman-collection-walkthrough.md   # Collection importieren, Variablen setzen, alle Aufrufe ausführen
├── changelogs/
│   ├── _template.md                        # Changelog-Eintrag-Format: Datum, Version, Abschnitte
│   ├── 2025-06-02-v3.1.0.md               # Neueste: hinzugefügt, geändert, veraltet, behoben, entfernt
│   ├── 2025-04-15-v3.0.0.md               # Hauptversion: Breaking Changes prominent zuerst
│   ├── 2025-02-10-v2.9.5.md
│   ├── 2025-01-08-v2.9.0.md
│   └── archive/
│       ├── 2024-changelogs.md              # Konsolidiertes Archiv für ältere Versionen
│       └── 2023-changelogs.md
├── architecture/
│   ├── system-overview.md                  # System-Überblicksdiagramm, Komponenten-Verantwortlichkeiten
│   ├── data-flow.md                        # Request-Lebenszyklus: Client → API Gateway → Service → DB
│   ├── authentication-flow.md              # OAuth 2.0 Sequenzdiagramm mit Mermaid
│   ├── webhook-delivery.md                 # Webhook-Pipeline: Event → Queue → Zustellung → Retry
│   ├── decisions/
│   │   ├── _template.md                    # ADR-Format: Status, Kontext, Entscheidung, Konsequenzen
│   │   ├── adr-001-api-versioning.md       # Entscheidungsbeleg: URL-Versionierung über Header-Versionierung
│   │   ├── adr-002-pagination-strategy.md  # Cursor-Pagination gegenüber Offset gewählt
│   │   └── adr-003-webhook-retry-policy.md # Exponentieller Backoff mit 72-Stunden-Fenster
│   └── openapi/
│       ├── openapi.yaml                    # Kanonische OpenAPI 3.1 Spec (Source of Truth)
│       └── postman-collection.json         # Exportierte Postman-Collection (aus Spec generiert)
├── style-guide/
│   ├── voice-and-tone.md                   # Aktive Stimme, zweite Person, Present-Tense-Regeln
│   ├── terminology.md                      # Genehmigte/verbotene Begriffsliste: API-Schlüssel vs Access-Token, etc.
│   ├── code-examples.md                    # Sprachstandards, Zeilenlänge, Kommentar-Regeln
│   ├── formatting.md                       # Überschriftenhierarchie, Admonitions, Table-Verwendung
│   ├── screenshots.md                      # Wann verwenden, Alt-Text-Anforderungen, Namenskonvention
│   ├── .vale.ini                           # Vale Prose Linter Konfiguration: aktivierte Rule Packages
│   └── vale-rules/
│       ├── Headings.yml                    # Benutzerdefinierte Vale-Regel: nur Satzfall
│       ├── AvoidPassive.yml                # Passive Stimme-Konstruktionen flaggen
│       └── BannedTerms.yml                 # Terminology.md über Vale durchsetzen
├── reviews/
│   ├── doc-review-checklist.md             # Pre-Publish-Checkliste: Genauigkeit, Links, Beispiele
│   ├── sme-interview-template.md           # SME-Interview-Fragen-Framework
│   ├── sme-feedback/
│   │   ├── 2025-05-auth-review.md          # SME-Feedback-Sitzung: Auth-Docs mit Eng-Team
│   │   └── 2025-04-webhooks-review.md
│   └── audits/
│       ├── 2025-q2-api-reference-audit.md  # Vierteljährliches Genauigkeit-Audit: veraltete Endpunkte, kaputte Beispiele
│       └── 2025-q1-tutorial-audit.md
├── .vale.ini                               # Root Vale Konfiguration (gilt für alle .md-Dateien)
├── .markdownlint.json                      # markdownlint Regeln: Zeilenlänge, Überschriftenstil
├── .lychee.toml                            # lychee Link Checker: Timeout, ausgeschlossene Domänen
├── mint.json                               # Mintlify Site Konfiguration: Nav, Farben, Anker, Analytics
└── .github/
    └── workflows/
        ├── vale-lint.yml                   # PR: Vale auf geänderten .md-Dateien ausführen, Anmerkungen posten
        ├── markdownlint.yml                # PR: markdownlint Check
        ├── link-check.yml                  # PR + wöchentlicher Plan: lychee Dead-Link-Erkennung
        └── openapi-diff.yml               # PR: Breaking Changes in openapi.yaml erkennen
```

## Schlüsseldateien erläutert

| Pfad | Zweck |
|---|---|
| `.claude/commands/api-doc.md` | Slash-Befehl, der einen OpenAPI-Endpunkt-Pfad nimmt, die Spec abruft und eine vollständige Endpunkt-Doc-Seite gemäß `api-reference/_template.md` Konventionen generiert |
| `.claude/commands/doc-audit.md` | Audits eine Doc-Seite gegen die Live-API: prüft, dass Request/Response-Beispiele der aktuellen Spec entsprechen, kennzeichnet veraltete Parameter und identifiziert fehlende Fehlercodes |
| `api-reference/_template.md` | Kanonisches Endpunkt-Doc-Format: Beschreibung, Base URL, Auth-Hinweis, Path/Query/Body-Parameter, Response-Schema, Code-Beispiele in drei Sprachen, Fehler-Tabelle |
| `architecture/openapi/openapi.yaml` | Single OpenAPI 3.1 Source of Truth — alle API-Referenz-Docs und die Postman-Collection werden von dieser Datei abgeleitet; Endpunkt-Docs nie ohne Spec-Überprüfung bearbeiten |
| `style-guide/terminology.md` | Genehmigte und verbotene Begriffsliste, die von Vale's `BannedTerms.yml` Regel verwendet wird — die einzige Autorität zu produktspezifischem Vokabular |
| `changelogs/_template.md` | Erzwungenes Changelog-Format: Datum, Semver und vier Abschnitte (Added, Changed, Deprecated, Fixed) gemäß Keep a Changelog Konventionen |
| `reviews/doc-review-checklist.md` | Pre-Publish-Gate: Genauigkeit mit Postman verifiziert, alle Code-Beispiele getestet, alle Links passen Lychee, Vale und markdownlint sauber, SME-Freigabe vermerkt |
| `style-guide/.vale.ini` | Vale Konfiguration: Google Style Package für Prose-Qualität aktiviert, Microsoft Style für Terminologie und benutzerdefinierte lokale Regeln in `vale-rules/` |

## Quick Scaffold

```bash
# Erstelle die vollständige Technical Writer Workspace Struktur
mkdir -p technical-writer-workspace
cd technical-writer-workspace

# Claude Code Konfiguration
mkdir -p .claude/commands

# Content-Verzeichnisse
mkdir -p api-reference/users api-reference/auth api-reference/webhooks api-reference/sdks
mkdir -p guides tutorials
mkdir -p changelogs/archive
mkdir -p architecture/decisions architecture/openapi
mkdir -p style-guide/vale-rules
mkdir -p reviews/sme-feedback reviews/audits
mkdir -p .github/workflows

# Template-Dateien scaffolden
touch api-reference/_template.md
touch guides/_template.md
touch tutorials/_template.md
touch changelogs/_template.md
touch architecture/decisions/_template.md
touch reviews/doc-review-checklist.md reviews/sme-interview-template.md

# Style Guide Dateien scaffolden
touch style-guide/voice-and-tone.md
touch style-guide/terminology.md
touch style-guide/code-examples.md
touch style-guide/formatting.md
touch style-guide/screenshots.md

# Vale Konfiguration
cat > .vale.ini << 'EOF'
StylesPath = style-guide/vale-rules
MinAlertLevel = suggestion

[*.md]
BasedOnStyles = Vale
EOF

cat > style-guide/.vale.ini << 'EOF'
StylesPath = vale-rules
MinAlertLevel = warning

[*.md]
BasedOnStyles = Vale, Google, Microsoft
EOF

# markdownlint Konfiguration
cat > .markdownlint.json << 'EOF'
{
  "default": true,
  "MD013": { "line_length": 120 },
  "MD033": false,
  "MD041": false
}
EOF

# Mintlify Konfiguration Stub
cat > mint.json << 'EOF'
{
  "name": "Product Docs",
  "logo": { "light": "/logo/light.svg", "dark": "/logo/dark.svg" },
  "favicon": "/favicon.svg",
  "colors": { "primary": "#0D9373" },
  "navigation": [
    { "group": "Get Started", "pages": ["guides/getting-started"] },
    { "group": "API Reference", "pages": ["api-reference/authentication"] }
  ],
  "analytics": { "posthog": { "apiKey": "" } }
}
EOF

# lychee Konfiguration
cat > .lychee.toml << 'EOF'
timeout = 20
max_retries = 3
exclude = ["localhost", "127.0.0.1", "example.com"]
exclude_path = ["changelogs/archive"]
EOF

# Skills installieren
npx claudient add skill productivity/api-doc-writer
npx claudient add skill productivity/readme-generator
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/runbook-generator
npx claudient add skill git/changelog-generator
npx claudient add skill productivity/lit-review

# Installierte Skills als Workspace-Befehle kopieren
cp ~/.claude/skills/productivity/api-doc-writer.md .claude/commands/api-doc.md
cp ~/.claude/skills/git/changelog-generator.md .claude/commands/changelog-entry.md
cp ~/.claude/skills/productivity/doc-site-builder.md .claude/commands/onboarding-guide.md

echo "Technical Writer Workspace scaffolded."
```

## CLAUDE.md Template

```markdown
# Technical Writer Workspace

Dieser Workspace verwaltet alle entwicklerorientierten Dokumentation: API-Referenz, konzeptionelle Guides,
Tutorials und Versionshinweise. Inhalte leben in der Versionskontrolle und veröffentlichen zu Mintlify.
Genauigkeit und Vollständigkeit sind die primären Qualitätsmetriken — jedes Code-Beispiel muss gegen
die Live-API getestet werden, bevor es veröffentlicht wird.

## Stack

- Doc-Website: Mintlify (Konfiguration: mint.json)
- API Spec: OpenAPI 3.1 (architecture/openapi/openapi.yaml — Source of Truth)
- Prose Linting: Vale + benutzerdefinierte Regeln in style-guide/vale-rules/
- Markdown Linting: markdownlint (.markdownlint.json)
- Link Überprüfung: lychee (.lychee.toml)
- API Testing: Postman (alle Beispiele vor Veröffentlichung validieren)
- Planung: Notion (Doc-Anfragen, Content-Kalender, SME-Interview-Notizen)
- Video: Loom (Walkthroughs in komplexe Tutorials einbetten)

## Verzeichniskonventionen

- `api-reference/` — eine Datei pro Endpunkt; genau api-reference/_template.md folgen
- `guides/` — konzeptionelle Tiefe; nicht Schritt-für-Schritt (das gehört in tutorials/)
- `tutorials/` — nummerierte Schritte; müssen vor "Nächste Schritte" einen "Verify it works" Abschnitt enthalten
- `changelogs/` — eine Datei pro Release; changelogs/_template.md und Keep a Changelog folgen
- `architecture/decisions/` — ein ADR pro bedeutsame Doc-System-Entscheidung
- `style-guide/` — einzige Source of Truth für Stimme, Terminologie und Formatierung
- `reviews/` — SME-Feedback nie löschen; es ist der Accuracy-Audit-Trail

## Häufige Aufgaben — verwende diese exakten Befehle

### API-Endpunkt-Dokumentation aus Spec generieren
/api-doc — füge das OpenAPI-Pfad-Objekt oder die Endpunkt-URL ein

### Neues Tutorial entwerfen
/tutorial-draft — beschreibe das Benutzerziel und die Ziel-Entwickler-Persona

### Changelog-Eintrag für ein Release schreiben
/changelog-entry — füge die PR-Liste oder Jira-Release-Notes ein

### Doc-Seite auf Genauigkeit auditen
/doc-audit — füge den Doc-Seite-Pfad und den relevanten OpenAPI-Abschnitt ein

### Entwickler-Onboarding-Guide generieren
/onboarding-guide — gebe das Produktbereich und die Ziel-Rolle an

### Release Notes aus Changelog-Einträgen kompilieren
/release-notes — gebe den Versionsbereich an (z.B. v3.0.0 zu v3.1.0)

### Prose gegen Style Guide überprüfen
/style-check — füge die Doc-Datei zum Linting ein oder referenziere sie

## API-Referenz-Konventionen

- Jede Endpunkt-Doc muss enthalten: ein cURL-Beispiel, ein Python-Beispiel, ein Node.js-Beispiel
- Response-Beispiele müssen die aktuelle Response von Postman zeigen — nie JSON erfinden
- Fehler-Tabelle muss alle HTTP-Status-Codes auflisten, die der Endpunkt tatsächlich zurückgibt (Spec überprüfen)
- Parameter-Tabelle: erforderlich vs optional markieren; Typ, Format und gültige Werte/Bereich einbeziehen
- Link zum relevanten Guide für konzeptionellen Hintergrund — Konzepte nicht inline erklären

## Changelog-Konventionen

- Keep a Changelog Format verwenden: Added, Changed, Deprecated, Fixed, Removed, Security
- Breaking Changes gehen an der Spitze unter einem "Breaking" Heading vor allen anderen Abschnitten
- Jeder Eintrag muss den API-Endpunkt oder Feature-Namen referenzieren — keine vagen "Verbesserungen"
- Veraltete Elemente müssen die Entfernung-Zielversion und Migrationspfad enthalten

## Style-Regeln (Kurzform — siehe style-guide/ für vollständige Regeln)

- Aktive Stimme: "Die API gibt ein Token zurück" nicht "Ein Token wird von der API zurückgegeben"
- Zweite Person: "Du kannst mit ... authentifizieren" nicht "Benutzer können mit ... authentifizieren"
- Present Tense für Verhalten: "Gibt 404 zurück" nicht "Wird 404 zurückgeben"
- Satzfall für alle Überschriften: "Create a user" nicht "Create a User"
- Genehmigte Begriffe: API key, access token, endpoint, payload, webhook event
- Verbotene Begriffe: simply, just, easy, straightforward — mit /style-check flaggen

## Pre-Publish-Checkliste

Vor dem Öffnen eines PR, verifiziere alle Elemente in reviews/doc-review-checklist.md:
1. Alle Code-Beispiele mit Postman gegen die aktuelle Sandbox-Umgebung getestet
2. Vale besteht mit null Fehlern (Warnungen akzeptabel mit Begründung)
3. markdownlint besteht mit null Fehlern
4. lychee zeigt keine kaputten Links
5. SME hat Genauigkeit für architektonische oder Verhaltens-Claims überprüft
6. mint.json Navigation aktualisiert, wenn neue Seite hinzugefügt

## Was nicht tun

- Erfinde API-Verhalten nicht — immer gegen openapi.yaml verifizieren oder in Postman testen
- Bearbeite openapi.yaml nicht direkt — diese Datei wird vom Engineering-Team gepflegt
- Merges Doc-PRs nicht ohne Vale bestanden — der CI Check ist obligatorisch
- Schreibe Tutorials nicht im guides/ Verzeichnis oder konzeptionellen Inhalt in tutorials/
- Verwende keine passive Stimme oder zweiter Ordnung Bedingungen ("würde sein", "könnte möglich sein")
```

## MCP-Server

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-notion"],
      "env": {
        "NOTION_API_TOKEN": "${NOTION_API_TOKEN}"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
    }
  }
}
```

## Empfohlene Hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_INPUT_FILE_PATH\" == *.md ]]; then npx markdownlint \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>&1 | head -20 || true; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_INPUT_FILE_PATH\" == *api-reference/* ]] && ! grep -q \"## Parameters\" \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>/dev/null; then echo \"[HOOK] API reference file is missing a Parameters section — check api-reference/_template.md\" >&2; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'changed=$(git -C \"$PWD\" diff --name-only 2>/dev/null | grep \"\\.md$\" | wc -l | tr -d \" \"); if [ \"$changed\" -gt 0 ]; then echo \"Reminder: $changed unsaved .md file(s) changed — run Vale and markdownlint before opening a PR.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Zu installierende Skills

```bash
npx claudient add skill productivity/api-doc-writer
npx claudient add skill productivity/readme-generator
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/runbook-generator
npx claudient add skill git/changelog-generator
npx claudient add skill productivity/lit-review
```

## Verwandt

- [Technical Writer Guide](../guides/for-technical-writer.md)
- [Changelog Writing Workflow](../workflows/changelog-writing.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
