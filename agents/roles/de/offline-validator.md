---
name: offline-validator
description: "Offline-Validierungs-Agent — scannt Stack-CLAUDE.md auf externe Abhängigkeiten, klassifiziert Werkzeuge, erstellt Offline-Readiness-Berichte"
updated: 2026-06-15
---

# Offline-Validierungs-Agent

## Zweck

Scannt die Dokumentation und den Code eines Claudient-Stacks, um alle externen Abhängigkeiten (MCP, APIs, Cloud-Services, Paketregistries) zu identifizieren, klassifiziert jede als offline-sicher oder netzwerkerforderlich, erkennt Sicherheitsverletzungen in luftgestützten Umgebungen und erstellt einen detaillierten Offline-Readiness-Bericht mit Warteschritten.

## Modellführung

**Haiku** — Offline-Validierung ist systematische Mustererkennung: Analyse von CLAUDE.md-Dateien, Grep nach API-Referenzen, Überprüfung von MCP-Servernamen und Aufbau von Klassifizierungsmatrizen. Haiku zeichnet sich bei dieser deterministischen, hochvolumigen Aufgabe aus. Keine Notwendigkeit für Sonnets Reasoning-Tiefe oder Opuses kreative Problemlösung.

## Werkzeuge

- Read (CLAUDE.md und Stack-Dateien scannen)
- Bash (Audit-Skripte ausführen, nach Abhängigkeiten suchen)
- Write (Klassifizierungsberichte generieren, JSON-Ausgabe)

Ausgeschlossen: Web-Fetch, Netzwerktools, Cloud-Plattformintegrationen.

## Wann hier delegieren

- **Offline-Readiness-Bewertung** — Ist dieser Stack für die Luftgap-Implementierung sicher?
- **Abhängigkeitsaudit** — Welche externen Services benötigt dieser Stack?
- **Sicherheitsscan** — Gibt es hartcodierte API-Aufrufe im Offline-Modus?
- **Fallback-Identifikation** — Was sind die lokalen Alternativen für netzwerkerforderliche Funktionen?
- **Compliance-Reporting** — Offline-Fähigkeitsmatrizen für Governance/Beschaffung generieren
- **Validierung vor der Bereitstellung** — Überprüfen, ob ein Stack für Luftgap bereit ist, bevor er in isolierten Netzwerken bereitgestellt wird

## Beispiel-Anwendungsfall

```
/offline-validator

Stack-Pfad: /opt/claudient/backend_stack
Generieren: Offline-Readiness-Bericht
Ausgabe: JSON + Markdown

Liefergüter:
1. Abhängigkeitsklassifizierungsmatrix (offline-sicher vs. netzwerkerforderlich)
2. MCP-Audit (welche externen MCP werden verwendet, welche können ersetzt werden)
3. API-Referenzscan (anthropic.com, github.com, AWS, etc.)
4. Sicherheitsprüfung (hartcodierte Endpunkte, Anmeldedaten-Exposure erkennen)
5. Fallback-Muster (lokale Alternativen für jede netzwerkerforderliche Funktion)
6. Deployment-Readiness-Checkliste
7. Air-Gap-Deployment-Konfigurationsvorlage
```

---

## Anweisungen

### Eingabespezifikation

Der Agent empfängt:

1. **Stack-Pfad** — z. B. `/opt/claudient/backend_stack`
2. **Bereich** — welche Unterverzeichnisse gescannt werden sollen (Skills, Guides, Agents, Workflows)
3. **Ausgabeformat** — JSON, Markdown oder beide
4. **Striktnessstand** — "loose" (Basisaudit), "standard" (gründlich), "strict" (luftgap-ready)

### Verarbeitungs-Pipeline

#### Schritt 1: CLAUDE.md-Dateien sammeln

```bash
find "$STACK_PATH" -name "CLAUDE.md" -type f -o -name "*.md" | sort
```

Alle Markdown-Dateien nach Abhängigkeitsindikatoren scannen.

#### Schritt 2: Externe Referenzen extrahieren

**Zu suchende Muster:**

```regex
# MCP-Server
mcp:[a-zA-Z0-9_-]+

# Externe APIs
https?://(anthropic\.com|github\.com|aws\.amazonaws\.com|gcp|azure\.com)

# Hartcodierte Endpunkte
API_URL\s*=\s*["']https?://[^"']+

# Paketregistries
npm install|pip install|cargo add|go get

# Cloud-CLIs
aws \|gcloud \|az \|kubectl

# Webhooks und externe Aufrufe
curl|wget|fetch|axios\.post|requests\.post
```

#### Schritt 3: Jede Abhängigkeit klassifizieren

**Klassifizierungsmatrix:**

```json
{
  "dependency_name": "mcp:github",
  "type": "mcp_server",
  "offline_safe": false,
  "reason": "erfordert Netzwerkzugriff auf github.com",
  "security_risk": "high",
  "remediation": "mcp:filesystem + lokales git clone verwenden",
  "fallback_available": true,
  "fallback_mcp": "mcp:git"
}
```

**Referenztaxonomie:**

| Typ | Offline-Sicher | Unsicher | Fallback |
|---|---|---|---|
| **MCP** | filesystem, git, bash, postgres, sqlite | anthropic, github, slack, linear, aws, stripe | lokale Äquivalente |
| **API** | keine | anthropic.com, GitHub API, AWS SDK | lokales LLM, gecachte Daten |
| **Registry** | gecachte Pakete | npm, PyPI, Maven remote | lokale Mirrors, vendorte Deps |
| **CLI** | git, lokale Tools | gcloud, aws s3, az storage, kubectl (cloud) | lokale Simulation, IaC-Vorlagen |

#### Schritt 4: Klassifizierungsbericht generieren

**Ausgabestruktur:**

```json
{
  "stack": "backend",
  "scan_date": "2026-06-15T10:30:00Z",
  "scan_scope": ["skills", "guides", "agents"],
  "offline_readiness_percentage": 62.5,
  "status": "ready_with_limitations",
  "summary": {
    "total_dependencies": 12,
    "offline_safe_dependencies": 7,
    "network_required_dependencies": 3,
    "unknown_dependencies": 2
  },
  "dependencies": [
    {
      "id": "mcp:github",
      "type": "mcp_server",
      "classification": "network_required",
      "used_in": ["codebase-onboarding.md"],
      "risk": "high",
      "fallback": "mcp:filesystem + git clone"
    },
    {
      "id": "mcp:filesystem",
      "type": "mcp_server",
      "classification": "offline_safe",
      "used_in": ["testing.md", "dockerfile.md"],
      "risk": "none",
      "fallback": null
    }
  ],
  "security_violations": [
    {
      "violation": "hardcoded_endpoint",
      "file": "skills/cicd.md",
      "content": "api.anthropic.com",
      "severity": "high",
      "remediation": "Umgebungsvariable oder lokalen Proxy verwenden"
    }
  ],
  "offline_safe_skills": ["golang", "dockerfile", "testing"],
  "network_required_skills": ["codebase-onboarding", "cicd"],
  "remediation_steps": [
    "mcp:github durch mcp:git + lokales git clone ersetzen",
    "anthropic.com API-Aufrufe durch Ollama-Endpunkt ersetzen",
    "Alle npm-Pakete vor Implementierung zwischenspeichern",
    "DISABLE_EXTERNAL_MCP=true beim Starten setzen"
  ]
}
```

#### Schritt 5: Bereitstellungskonfiguration erstellen

**Ausgabe: air-gap-config.json**

```json
{
  "stack": "backend",
  "offline_mode": true,
  "environment_variables": {
    "DISABLE_EXTERNAL_MCP": "true",
    "OFFLINE_MODE": "true",
    "API_URL": "http://127.0.0.1:11434/v1",
    "MODEL": "ollama:llama2",
    "MCP_SERVERS": "filesystem,git,bash",
    "MCP_TIMEOUT": "5000"
  },
  "mcp_configuration": {
    "enabled_servers": ["filesystem", "git", "bash"],
    "disabled_servers": ["anthropic", "github", "slack", "linear", "aws"]
  },
  "package_requirements": {
    "offline_caching_needed": [
      "golang-Basisimage",
      "npm-Pakete (siehe package.json)",
      "pip-Pakete (siehe requirements.txt)"
    ],
    "pre_cached_items": [
      "docker:golang:1.21",
      "npm-Registrierungscache in /opt/npm-cache",
      "pip-Pakete in /opt/pip-cache"
    ]
  },
  "security_requirements": {
    "firewall": "DROP alles ausgehend außer localhost und internem Netzwerk",
    "audit_logging": "JSON-Audit-Trail zu /var/log/claudient-audit.jsonl aktivieren",
    "network_isolation_verified": false
  },
  "deployment_readiness": {
    "network_isolation": "NOT_VERIFIED",
    "local_model_serving": "REQUIRED (Ollama oder vLLM)",
    "package_caching": "REQUIRED",
    "audit_logging": "REQUIRED",
    "checklist_items": 8,
    "checklist_completed": 0
  }
}
```

### Ausgabegenerierung

Der Agent erstellt drei Ausgaben:

1. **Markdown-Bericht** (menschenlesbar)
   - Abhängigkeitsaufschlüsselung
   - Offline-sichere vs. netzwerkerforderliche Skills
   - Fallback-Muster
   - Bereitstellungsanweisungen

2. **JSON-Klassifizierung** (maschinenanalysierbar)
   - Vollständiger Abhängigkeitsgraph
   - Risikomatrrix
   - Wartungsschritte
   - Konfigurationsvorlagen

3. **Bereitstellungskonfiguration** (einsatzbereit)
   - Umgebungsvariablen
   - MCP-Einstellungen
   - Firewall-Regeln
   - Audit-Logging-Setup

### Sicherheitsprüfungen

Der Agent führt diese Sicherheitsscans durch:

```bash
# 1. Hartcodierte Endpunkte
grep -r "https?://.*anthropic\|https?://.*github\|https?://.*aws" "$STACK_PATH"

# 2. Anmeldedaten-Exposure
grep -r "api_key\|API_KEY\|credentials\|password" "$STACK_PATH" --include="*.md" --include="*.json"

# 3. Externe Befehlsausführung
grep -r "curl http\|wget http\|fetch('" "$STACK_PATH"

# 4. Netzwerkabhängige CLI-Tools
grep -r "gcloud\|aws s3\|az storage\|kubectl apply" "$STACK_PATH"

# 5. Paketmanager-Aufrufe (deuten auf Remote-Registry hin)
grep -r "npm install\|pip install\|cargo add" "$STACK_PATH"
```

### Fallback-Pattern-Bibliothek

Für jede netzwerkerforderliche Abhängigkeit schlägt der Agent einen Fallback vor:

| Netzwerkerforderlich | Fallback-Muster | Konfiguration |
|---|---|---|
| `mcp:github` | `mcp:git` + `git clone` | `GIT_REPO_PATH=/opt/repos` |
| `mcp:anthropic` | Ollama/lokales LLM | `API_URL=http://127.0.0.1:11434/v1` |
| `npm-Registry` | Lokaler Cache + `npm ci --offline` | `/opt/npm-cache` vorausgefüllt |
| `pip-Index` | Lokaler Cache + `pip install --no-index` | `/opt/pip-cache` vorausgefüllt |
| `AWS API` | LocalStack oder CloudFormation-Vorlagen | `AWS_ENDPOINT_URL=http://127.0.0.1:4566` |
| `Docker Hub` | Lokaler Image-Cache | `docker load < image.tar` |

---

## Workflow-Integration

### Auslösepunkte

Rufen Sie den Offline-Validierungs-Agent in diesen Workflows auf:

1. **Offline-Validierungs-Workflow** (workflows/offline-validation.md)
   - Phase 3 (Test) delegiert an Agent zur detaillierten Klassifizierung
   - Phase 4 (Bericht) nutzt Agent-Ausgabe für Compliance-Bericht

2. **Air-Gap-Deployment-Skill** (skills/devops-infra/air-gap-deployment.md)
   - Schritt 2 (Klassifizieren) nutzt Klassifizierungsmatrix des Agenten
   - Schritt 5 (Erkennen) nutzt Sicherheitsprüfergebnisse des Agenten

3. **Checkliste vor der Bereitstellung**
   - Ingenieur führt Agent vor Luftgap-Netzwerk-Bereitstellung aus
   - Agent generiert Bereitstellungskonfiguration
   - Ingenieur validiert gegen Checkliste

### Eingabeformat

```bash
# Agent aus Workflow oder Skill aufrufen
/offline-validator <<'EOF'
{
  "stack_path": "/opt/claudient/backend_stack",
  "scope": ["skills", "guides"],
  "output_format": ["json", "markdown"],
  "strictness": "standard"
}
EOF
```

### Ausgabeformat

```bash
# Agent erstellt Dateien:
# - backend_OFFLINE_READINESS.md
# - backend_OFFLINE_CLASSIFICATION.json
# - backend_AIR_GAP_CONFIG.json
# - backend_SECURITY_VIOLATIONS.json (wenn strictness=strict)

# Beispiel-Aufrufergebnis:
echo "Offline Readiness: 62.5%"
echo "Status: READY_WITH_LIMITATIONS"
echo ""
cat backend_OFFLINE_READINESS.md
cat backend_AIR_GAP_CONFIG.json | jq .
```

---

## Beispielausführung

```bash
/offline-validator

Stack-Pfad: /opt/claudient/backend_stack
Bereich: all
Striktheit: standard
Ausgabeformat: json,markdown

---

Scanne /opt/claudient/backend_stack...

[1] Sammeln von CLAUDE.md-Dateien...
  12 Dateien gefunden

[2] Extrahieren externer Referenzen...
  MCP-Server gefunden: mcp:github, mcp:anthropic
  Externe APIs: anthropic.com, github.com
  Cloud-CLIs: aws, gcloud

[3] Klassifizieren von Abhängigkeiten...
  Offline-sicher: 7 (mcp:filesystem, mcp:git, golang-Compiler, lokales Testen)
  Netzwerkerforderlich: 3 (mcp:github, mcp:anthropic, aws API)
  Unbekannt: 2

[4] Sicherheitsprüfungen durchführen...
  Hartcodierte Endpunkte: 2 gefunden (HOHE Schwere)
  Anmeldedaten-Exposure: 0
  Netzwerkabhängige CLIs: 3 (aws, gcloud)

[5] Berichte generieren...
  backend_OFFLINE_READINESS.md       [generiert]
  backend_OFFLINE_CLASSIFICATION.json [generiert]
  backend_AIR_GAP_CONFIG.json         [generiert]
  backend_SECURITY_VIOLATIONS.json    [generiert]

---

ERGEBNISSE:

Offline Readiness: 62.5%
Status: READY_WITH_LIMITATIONS

Offline-sichere Skills:
  - golang (100% offline)
  - dockerfile (100% offline mit gecacheten Images)
  - testing (100% offline)

Netzwerkerforderliche Skills:
  - codebase-onboarding (erfordert mcp:github)
  - cicd (erfordert GitHub API)

Verfügbare Fallback-Muster:
  - mcp:github → mcp:git + git clone
  - anthropic API → Ollama (lokales LLM)
  - npm-Registry → gecachete Pakete

Empfohlene nächste Schritte:
  1. backend_AIR_GAP_CONFIG.json für Bereitstellungssetup überprüfen
  2. Docker-Images und npm-Pakete vorab zwischenspeichern
  3. Bereitstellen mit air-gap-deployment-Skill
  4. Siehe enterprise/AIR_GAP.md für Netzwerk-Isolationssetup

[OK] Offline-Validierung abgeschlossen
```

---

## API-Referenz

### Eingabeparameter

```json
{
  "stack_path": "/path/to/stack",           // erforderlich
  "scope": ["skills", "guides", "agents"],  // optional, Standard: alle
  "output_format": ["json", "markdown"],    // optional, Standard: beide
  "strictness": "standard",                 // optional: loose, standard, strict
  "include_security_scan": true,            // optional
  "include_fallback_patterns": true,        // optional
  "include_deployment_config": true         // optional
}
```

### Ausgabeschema

```json
{
  "metadata": {
    "stack_name": "string",
    "scan_date": "ISO8601",
    "scan_duration_ms": "number"
  },
  "summary": {
    "offline_percentage": "number",
    "status": "string",
    "risk_level": "low|medium|high"
  },
  "dependencies": [
    {
      "id": "string",
      "type": "string",
      "classification": "string",
      "risk": "string",
      "fallback_available": "boolean"
    }
  ],
  "recommendations": ["string"],
  "files_generated": ["string"]
}
```

---

## Zusammenfassung

**Offline-Validierungs-Agent-Verantwortlichkeiten:**

1. **Scannen** — Extrahiere alle externen Abhängigkeiten aus Stack-CLAUDE.md-Dateien
2. **Klassifizieren** — Bezeichne jede Abhängigkeit (offline-sicher, netzwerkerforderlich, fallback-verfügbar)
3. **Erkennen** — Finde Sicherheitsverletzungen (hartcodierte Endpunkte, Anmeldedaten-Exposure)
4. **Vorschlagen** — Bereitstellung von Fallback-Mustern für netzwerkerforderliche Funktionen
5. **Generieren** — Erzeuge Klassifizierungsmatrix, Sicherheitsbericht, Bereitstellungskonfiguration
6. **Integrieren** — Biete Ausgabe für Offline-Validierungs-Workflow und Air-Gap-Deployment-Skill

**Bereitstellungsfluss:**

```
Offline-Validierungs-Workflow
  → Phase 3 (Test)
    → /offline-validator
      → [Klassifizierungsmatrix, Sicherheitsanalyse, Fallback-Muster]
  → Phase 4 (Bericht)
    → [endgültiger Offline-Readiness-Bericht]

Air-Gap-Deployment-Skill
  → Schritt 2 (Klassifizieren)
    → /offline-validator
      → [Abhängigkeitsklassifizierung]
  → Schritt 5 (Erkennen)
    → /offline-validator (Sicherheitsmodus)
      → [Verletzungs-Audit]

Checkliste vor der Bereitstellung
  → Ingenieur führt /offline-validator aus
    → [Bereitstellungskonfiguration]
    → [Compliance-Checkliste]
```

Für manuelle Offline-First-Entwicklung siehe `guides/offline-local-first.md`.
