---
name: offline-local-first
description: "Offline- und Local-First-Modus: Claudient in air-gapped Umgebungen ausführen, offline-sichere Stacks, Fallback-Muster und was Netzwerkkonnektivität erfordert"
updated: 2026-06-15
---

# Offline- und Local-First-Modus-Anleitung

Diese Anleitung behandelt das Ausführen von Claudient, seinen Stacks und Claude Code-Workflows in air-gapped, offline und Low-Konnektivitäts-Umgebungen. Sie unterscheidet zwischen Fähigkeiten, die offline funktionieren, und denen, die Netzwerkzugang erfordern, und dokumentiert Fallback-Muster für getrennte Szenarien.

---

## Überblick

Claudient ist für die Integration mit Claude Code und externen Tools (Claude API, MCP-Servern, Cloud-Plattformen) konzipiert. Viele Workflows können jedoch offline mit folgenden ausgeführt werden:

1. **Lokales Modell-Serving** (Claude über lokalen API-Proxy)
2. **Offline-sichere Stacks** (Skills, die keine externen MCP-Server oder APIs erfordern)
3. **Gecachte Kenntnisse** (CLAUDE.md, Dokumentation, Prompt-Vorlagen)
4. **Getrennte Tools** (Lokale CLI, Git, Shell, Dateivorgänge)

Diese Anleitung identifiziert, welche Claudient-Komponenten offline funktionieren und wie sie konfiguriert werden.

---

## Was offline funktioniert

### Kern-Claudient-Funktionen (Vollständig offline)

- **Anleitungen, Skills, Agenten, Workflows, Prompts** — alle Markdown-Dokumentation und Muster
- **Git-Vorgänge** — Klonen, Commiten, Branching (nur lokales Repo)
- **Datei-Lesen/Schreiben** — jeder lokale Dateisystemvorgang
- **Bash/Shell-Scripting** — lokale Befehle, Umgebungssetup
- **Code-Bearbeitung und Review** — Analyse lokalen Codes
- **Vorlagen und Checklisten** — offline Prompt-Muster

### Offline-sichere Stacks

Die folgenden Stacks können vollständig offline ohne externe API- oder MCP-Aufrufe ausgeführt werden:

- **Backend (Go, Rust, C++)** — Build-Tools, Kompilierung, Testing (kein Cloud-Deployment)
- **Data/ML** — lokales Training, Feature-Engineerin, Analyse (keine Cloud-Inferenz)
- **DevOps/Infra** — Infrastructure-as-Code, lokales k8s, Docker (keine externen Registries)
- **Frontend** — lokaler Build, SSG-Generierung, offline Component Testing
- **Git-Workflows** — Versionskontrolle, lokale CI (mit lokalen Läufern)
- **Produktivität/Automation** — lokale CLI-Skripte, Shell-Workflows
- **Datenbank** — lokale Instanzen (PostgreSQL, Redis, SQLite) — keine Cloud-Abfragen
- **Computer Use** — lokale UI-Automation, OCR, Desktop-Scripting

### Offline-sichere MCP-Server

Wenn Sie MCP lokal ausführen, haben diese Server keine externen Abhängigkeiten:

- `filesystem` — lokale Dateivorgänge
- `git` — lokales Git-Repo-Zugriff
- `postgres` — lokale Datenbank (erfordert laufende Instanz)
- `sqlite` — eingebettete Datenbank
- `bash` — Shell-Befehle auf lokaler Maschine
- Benutzerdefinierte lokale MCPs (jeder von Benutzern erstellter MCP-Server auf localhost)

---

## Was Netzwerk erfordert

### Claudient-Funktionen, die Internet benötigen

- **Claude API-Aufrufe** — jeder Skill/Agent, der Claude aufruft (erfordert Anthropic-API-Schlüssel und Netzwerkzugriff)
- **Externe MCP-Server** — Remote-Server (GitHub, Linear, Slack, etc.)
- **Cloud-Deployments** — AWS, GCP, Azure (erfordert Cloud-API-Zugriff)
- **Paket-Registrys** — npm, PyPI, Maven (erfordert Paket-Download)
- **Web Scraping/Fetching** — jeder Skill, der externe URLs abruft
- **Email, Slack, Webhooks** — externe Benachrichtigungskanäle
- **DNS, öffentliche APIs** — jeder externe HTTP/HTTPS-Aufruf

### Nicht-Offline-Stacks

Die folgenden Stacks erfordern Netzwerk für vollständige Funktionalität:

- **GTM/Growth** — Marktforschung, Analytics, Social-Media-Integrationen
- **Legal/Compliance** — Regulierungsdatenbanken, API-Integrationen
- **Product/Marketing** — Analytics, CMS-Integration, externe Tools
- **Finance** — Banking-APIs, Zahlungsprozessoren, Marktdaten
- **AI-Engineering** — Cloud-Modell-APIs, Vector-Datenbanken, Inferenz-Services

---

## Offline-Modus konfigurieren

### 1. Lokales Modell-Serving

Um Claude-Modelle offline zu verwenden, führen Sie einen lokalen API-Proxy aus, der Claude cacht oder selbst hostet:

**Option A: Anthropic Proxy (Claude API lokal)**

```bash
# Erfordert: Internet für einmalige Einrichtung, dann lokales Serving
# Claude API durch einen lokalen Endpunkt proxieren
git clone https://github.com/anthropic-ai/python-sdk
cd python-sdk

# Lokalen Caching-Proxy einrichten (erfordert anthropic-Paket)
pip install anthropic
python -m anthropic.proxy --host 127.0.0.1 --port 8000
```

Konfigurieren Sie dann Claudient zur Verwendung des lokalen Endpunkts:

```json
{
  "model": "claude-3-5-haiku-20241022",
  "apiUrl": "http://127.0.0.1:8000/v1"
}
```

**Option B: Ollama oder lokales LLM**

Für vollständig offline-Operationen verwenden Sie ein lokales LLM:

```bash
brew install ollama  # macOS
# oder von https://ollama.ai herunterladen

ollama run llama2  # lokal herunterladen und ausführen
```

Konfigurieren Sie Claude Code zur Verwendung von Ollama:

```json
{
  "model": "llama2",
  "apiUrl": "http://127.0.0.1:11434/v1"
}
```

**Kompromiss:** Lokale Modelle haben reduzierte Qualität im Vergleich zu Claude 3.5, ermöglichen aber vollständig offline-Operationen.

### 2. Offline-MCP-Konfiguration

Deaktivieren Sie externe MCPs und registrieren Sie nur lokale Server:

**.claude/settings.json**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "mcp",
      "args": ["server", "filesystem"]
    },
    "git": {
      "command": "mcp",
      "args": ["server", "git"]
    }
  },
  "disableExternalMcp": true,
  "mcpTimeout": 5000
}
```

Umgebungsvariable zum Deaktivieren aller externen MCPs:

```bash
export DISABLE_EXTERNAL_MCP=true
export MCP_SERVERS=filesystem,git  # kommagetrennte Liste
```

### 3. Claudient lokal klonen

Laden Sie das gesamte Claudient-Repository für offline-Zugriff herunter:

```bash
git clone https://github.com/tushar2704/Claudient.git /opt/claudient
export CLAUDIENT_PATH=/opt/claudient

# Offline-Zugriff überprüfen
ls /opt/claudient/guides/offline-local-first.md
```

Zeigen Sie Claude Code auf lokales Claudient:

```bash
--project /opt/claudient
```

### 4. API-Antworten cachen

Wenn Sie einmaligen Internetzugriff benötigen, cachen Sie Antworten für offline-Verwendung:

```bash
# Vor Offline-Betrieb: abrufen und cachen
claude --project . --cache-responses=true \
  "Generate all patterns for {backend,devops,data-ml}/*.md"

# Mit gecachtem Wissen offline gehen
claude --offline-only --project .
```

---

## Offline-First Stack-Konfiguration

### Einen Offline-Stack verwenden

Beispiel: **Backend Engineer Stack (Vollständig offline)**

```bash
# Stellen Sie sicher, dass nur offline-sichere MCPs aktiviert sind
export DISABLE_EXTERNAL_MCP=true
export MCP_SERVERS=filesystem,git

# Laden Sie den Stack
claude --stack backend \
       --project /opt/claudient \
       "Build a Go API server with tests and Docker image"
```

Alle Skills im Stack `backend` funktionieren ohne externe Aufrufe:
- `golang` — lokaler Compiler
- `dockerfile` — lokaler Container-Build
- `testing` — lokales Test-Framework
- `postgres` — lokale Datenbankinstanz

### Offline-Validierungs-Checkliste

Vor der Erklärung eines Stacks als "offline-ready" durchgehen:

```markdown
- [ ] Alle MCP-Server sind lokal (filesystem, git, localhost-gebunden)
- [ ] Keine API-Aufrufe an externe Services (Claude, Cloud-Plattformen, SaaS)
- [ ] Keine Paket-Downloads (alle Deps lokal gecacht)
- [ ] Kein Web Scraping oder URL Fetching
- [ ] Alle Befehle können mit `DISABLE_EXTERNAL_MCP=true` ausgeführt werden
- [ ] CLAUDE.md listet externe Abhängigkeiten klar auf
```

---

## Fallback-Muster für niedrige Konnektivität

Wenn das Netzwerk intermittierend oder unzuverlässig ist:

### 1. Retry mit exponentieller Backoff-Zeit

```bash
# .claude/hooks/mcp-retry.sh
for attempt in {1..5}; do
  timeout 5 mcp-call "$@" && exit 0
  sleep $((2 ** attempt))
done
exit 1
```

### 2. Cache-First Lookup

```bash
# Überprüfen Sie den lokalen Cache vor dem API-Aufruf
if [[ -f ~/.claude/cache/$QUERY_HASH ]]; then
  cat ~/.claude/cache/$QUERY_HASH
else
  # Aufruf durchführen und cachen
  result=$(mcp-call "$@")
  echo "$result" > ~/.claude/cache/$QUERY_HASH
  echo "$result"
fi
```

### 3. Graceful Degradation

Offline-sichere Skills sollten unveerfügbares MCP erkennen und Fallback bieten:

```markdown
# Beispiel: AWS Architect Skill

## Wann aktivieren
- AWS-Architektur designen

## Wann nicht verwenden
- Kein Internet und AWS-Anmeldedaten nicht verfügbar
- Fallback: Verwenden Sie lokale Cache CloudFormation-Vorlagen

## Anweisungen

### Offline-Modus
Wenn AWS API nicht verfügbar ist, verwenden Sie vorgenerierte CloudFormation-Vorlagen:

\`\`\`bash
if ! aws ec2 describe-instances &>/dev/null; then
  echo "AWS API unavailable. Using cached templates."
  cat /opt/claudient/cache/cf-templates/*.json
fi
\`\`\`
```

### 4. Batch-Vorgänge während Online-Fenster

Sammeln Sie offline-Arbeit und synchronisieren Sie, wenn Netzwerk verfügbar ist:

```bash
# Offline: Befehle in Warteschlange
echo "claude --stack backend 'implement feature X'" >> ~/.claude/queue.txt
echo "claude --stack devops 'deploy to staging'" >> ~/.claude/queue.txt

# Wenn online: Warteschlange leeren
while read cmd; do
  eval "$cmd"
done < ~/.claude/queue.txt
rm ~/.claude/queue.txt
```

---

## Netzwerk-Erkennung und Auto-Fallback

### Netzwerkverfügbarkeit erkennen

```bash
#!/bin/bash
# ~/.claude/hooks/network-check.sh

if ping -c 1 8.8.8.8 &>/dev/null; then
  export NETWORK_AVAILABLE=true
  export MCP_TIMEOUT=5
else
  export NETWORK_AVAILABLE=false
  export DISABLE_EXTERNAL_MCP=true
  export MCP_TIMEOUT=1
fi
```

Hook beim Startup ausführen:

```json
{
  "hooks": {
    "before:startup": {
      "command": "bash",
      "args": ["~/.claude/hooks/network-check.sh"]
    }
  }
}
```

### Auto-Select Stack basierend auf Konnektivität

```bash
#!/bin/bash
# Offline-sicheren Stack auswählen, wenn kein Netzwerk

if [[ "$NETWORK_AVAILABLE" == "false" ]]; then
  STACK="backend"  # offline-sicheres Standard
else
  STACK="gtm"  # erfordert Netzwerk
fi

claude --stack "$STACK" "$@"
```

---

## Offline-sichere Stacks — Kurzreferenz

| Stack | Offline? | Anmerkungen |
|---|---|---|
| **Backend (Go, Rust, C++)** | ✅ Voll | Erfordert lokalen Compiler; kein Cloud-Deployment |
| **Data/ML** | ✅ Voll | Nur lokales Training; keine Cloud-Inferenz |
| **DevOps/Infra** | ⚠️ Teilweise | IaC funktioniert offline; Cloud-Deployment erfordert API |
| **Frontend** | ✅ Voll | Lokaler Build und Testing; SSG-Generierung |
| **Database** | ✅ Voll | Erfordert laufende lokale Instanz |
| **Productivity** | ✅ Voll | Lokale Automation, Shell-Skripte |
| **Git** | ✅ Voll | Nur lokale Versionskontrolle |
| **Computer Use** | ✅ Voll | Lokale UI-Automation |
| **Finance** | ❌ Keine | Erfordert Banking/Markt-APIs |
| **GTM/Growth** | ❌ Keine | Erfordert Analytics-, Marktdaten-APIs |
| **Legal/Compliance** | ❌ Keine | Erfordert Regulierungsdatenbanken |
| **AI-Engineering** | ⚠️ Teilweise | Nur lokale Modelle; Cloud-Inferenz nicht verfügbar |

---

## Offline-Dokumentationsstruktur

Bei offline-Arbeit navigieren Sie die Dokumentationsstruktur von Claudient:

```
/opt/claudient
├── guides/offline-local-first.md       ← Sie sind hier
├── enterprise/AIR_GAP.md               ← Deployment-Anleitung
├── skills/devops-infra/air-gap-deployment.md
├── workflows/offline-validation.md
├── agents/roles/offline-validator.md
├── guides/                             ← Alle menschenlesbaren Dokumente
├── skills/                             ← Alle Skill-Muster
├── agents/                             ← Alle Agent-Definitionen
└── workflows/                          ← Alle Workflow-Muster
```

Lesen Sie von `/opt/claudient` (nicht vom Git-Remote) wenn offline.

---

## Offline-Modus Fehlerbehebung

### Symptom: "MCP server not responding"

```bash
# Überprüfen Sie, ob lokales MCP läuft
lsof -i :8000  # wenn lokalen Proxy verwenden

# Erzwinge Offline-Modus
export DISABLE_EXTERNAL_MCP=true
export OFFLINE_MODE=true
claude --project /opt/claudient "test query"
```

### Symptom: "API key not found"

Wenn offline, kann Claude Code nicht auf Anthropic-API zugreifen. Verwenden Sie lokales Modell:

```bash
# Verwenden Sie Ollama stattdessen
export MODEL=llama2
export API_URL=http://127.0.0.1:11434/v1
claude "test query"
```

### Symptom: "Package not found"

Wenn npm/pip versucht, vom Remote-Registry abzurufen:

```bash
# Verwenden Sie nur lokalen Cache
npm ci --prefer-offline --no-audit
pip install --no-index --find-links ./cache -r requirements.txt
```

---

## Zusammenfassung

**Offline-First-Prinzipien für Claudient:**

1. **Local-First-Abhängigkeiten** — alles cachen; Netzwerk ist optional
2. **Graceful Degradation** — erkennen Sie unveerfügbares MCP; bieten Sie Fallbacks
3. **Dateisystem und Git sind Ihre Freunde** — sie funktionieren ohne Netzwerk
4. **Offline-sichere Stacks** — Backend, Data/ML, DevOps (teilweise), Frontend, Database, Produktivität
5. **Netzwerk-abhängige Stacks** — GTM, Finance, Legal, AI-Engineering (teilweise)
6. **Lokales Modell-Serving** — Ollama, lokale Claude-Proxies für offline Claude
7. **Dokumentation als Fallback** — alles CLAUDE.md, Anleitungen, und Muster sind offline-zugänglich

**Für Enterprise-Deployments**, siehe `enterprise/AIR_GAP.md`.

**Für Validierungs-Workflows**, siehe `workflows/offline-validation.md`.

**Für detailliertes Air-Gap-Deployment**, siehe `skills/devops-infra/air-gap-deployment.md`.
