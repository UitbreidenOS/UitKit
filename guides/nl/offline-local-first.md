---
name: offline-local-first
description: "Offline en local-first modus: Claudient uitvoeren in gesloten omgevingen, offline-veilige stacks, fallback-patronen en wat netwerkconnectiviteit vereist"
updated: 2026-06-15
---

# Offline en local-first modus gids

Deze gids behandelt het uitvoeren van Claudient, zijn stacks en Claude Code-workflows in gesloten, offline en laag-connectiviteitsomgevingen. Het maakt onderscheid tussen mogelijkheden die offline werken en die netwerktoegangen vereisen, en documenteert fallback-patronen voor verbroken scenario's.

---

## Overzicht

Claudient is ontworpen voor integratie met Claude Code en externe tools (Claude API, MCP-servers, cloudplatforms). Veel workflows kunnen echter offline draaien met:

1. **Lokale modeluitvoering** (Claude via lokale API-proxy)
2. **Offline-veilige stacks** (vaardigheden die geen externe MCP-servers of API's vereisen)
3. **Gecachte kennis** (CLAUDE.md, documentatie, promptsjablonen)
4. **Losgekoppelde tools** (lokale CLI, git, shell, bestandsbewerkingen)

Deze gids identificeert welke Claudient-componenten offline werken en hoe deze moeten worden geconfigureerd.

---

## Wat offline werkt

### Claudient-kernfuncties (volledig offline)

- **Gidsen, vaardigheden, agenten, workflows, prompts** — alle Markdown-documentatie en patronen
- **Git-bewerkingen** — klonen, committen, branching (alleen lokale repo)
- **Bestand lezen/schrijven** — elke lokale bestandssysteembewerking
- **Bash/shell-scripts** — lokale commando's, omgevingsinstellingen
- **Code-bewerking en review** — analyse van lokale code
- **Sjablonen en checklists** — offline prompt-patronen

### Offline-veilige stacks

De volgende stacks kunnen volledig offline draaien zonder externe API- of MCP-aanroepen:

- **Backend (Go, Rust, C++)** — buildtools, compilatie, testing (geen cloudimplementatie)
- **Data/ML** — lokale training, feature engineering, analyse (geen cloudinferentie)
- **DevOps/Infra** — infrastructure-as-code, lokale k8s, Docker (geen externe registers)
- **Frontend** — lokale build, SSG-generatie, offline componenttesting
- **Git-workflows** — versiebeheer, lokale CI (met lokale runners)
- **Productiviteit/Automatisering** — lokale CLI-scripts, shell-workflows
- **Database** — lokale instanties (PostgreSQL, Redis, SQLite) — geen cloudquery's
- **Computer Use** — lokale UI-automatisering, OCR, desktopscripting

### Offline-veilige MCP-servers

Als u MCP lokaal uitvoert, hebben deze servers geen externe afhankelijkheden:

- `filesystem` — lokale bestandsbewerkingen
- `git` — lokale git-repo-toegang
- `postgres` — lokale database (vereist lopende instantie)
- `sqlite` — ingebedde database
- `bash` — shell-commando's op lokale machine
- Aangepaste lokale MCP's (elke door gebruiker gemaakte MCP-server die op localhost draait)

---

## Wat netwerk vereist

### Claudient-functies die Internet nodig hebben

- **Claude API-aanroepen** — elke vaardigheid/agent die Claude aanroept (vereist Anthropic-API-sleutel en netwerktoegang)
- **Externe MCP-servers** — externe servers (GitHub, Linear, Slack, enz.)
- **Cloud-implementaties** — AWS, GCP, Azure (vereist cloud-API-toegang)
- **Pakketregisters** — npm, PyPI, Maven (vereist pakketdownload)
- **Web scraping/fetching** — elke vaardigheid die externe URL's ophaalt
- **Email, Slack, webhooks** — externe meldingskanalen
- **DNS, openbare API's** — elke externe HTTP/HTTPS-aanroep

### Niet-offline stacks

De volgende stacks vereisen netwerk voor volledige functionaliteit:

- **GTM/Growth** — marktonderzoek, analytics, social media-integraties
- **Legal/Compliance** — regelgevingsdatabases, API-integraties
- **Product/Marketing** — analytics, CMS-integratie, externe tools
- **Finance** — banking-API's, betalingsprocessors, marktgegevens
- **AI-Engineering** — cloud-model-API's, vectordatabases, inferentieservices

---

## Offline modus instellen

### 1. Lokale modeluitvoering

Als u Claude-modellen offline wilt gebruiken, voert u een lokale API-proxy uit die Claude in cache opslaat of zelf host:

**Optie A: Anthropic Proxy (Claude API lokaal)**

```bash
# Vereist: internet voor eenmalige setup, dan lokale uitvoering
# Claude API via een lokaal eindpunt proxyen
git clone https://github.com/anthropic-ai/python-sdk
cd python-sdk

# Lokale cachingproxy instellen (vereist anthropic-pakket)
pip install anthropic
python -m anthropic.proxy --host 127.0.0.1 --port 8000
```

Configureer vervolgens Claudient om het lokale eindpunt te gebruiken:

```json
{
  "model": "claude-3-5-haiku-20241022",
  "apiUrl": "http://127.0.0.1:8000/v1"
}
```

**Optie B: Ollama of lokale LLM**

Voor volledig offline-bedrijf, gebruik een lokale LLM:

```bash
brew install ollama  # macOS
# of download van https://ollama.ai

ollama run llama2  # lokaal downloaden en uitvoeren
```

Configureer Claude Code om Ollama te gebruiken:

```json
{
  "model": "llama2",
  "apiUrl": "http://127.0.0.1:11434/v1"
}
```

**Compromis:** Lokale modellen hebben verminderde kwaliteit vergeleken met Claude 3.5, maar maken volledig offline-bedrijf mogelijk.

### 2. Offline MCP-configuratie

Schakel externe MCP's uit en registreer alleen lokale servers:

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

Omgevingsvariabele om alle externe MCP's uit te schakelen:

```bash
export DISABLE_EXTERNAL_MCP=true
export MCP_SERVERS=filesystem,git  # kommagescheiden lijst
```

### 3. Claudient lokaal klonen

Download de volledige Claudient-repository voor offline-toegang:

```bash
git clone https://github.com/tushar2704/Claudient.git /opt/claudient
export CLAUDIENT_PATH=/opt/claudient

# Offline-toegang controleren
ls /opt/claudient/guides/offline-local-first.md
```

Wijs Claude Code naar lokale Claudient:

```bash
--project /opt/claudient
```

### 4. Cache API-reacties

Als u eenmalige internettoegang nodig heeft, cacherespons voor offline-gebruik:

```bash
# Voordat u offline gaat: ophalen en cachen
claude --project . --cache-responses=true \
  "Generate all patterns for {backend,devops,data-ml}/*.md"

# Ga offline met gecachte kennis
claude --offline-only --project .
```

---

## Offline-first stackconfiguratie

### Een offline stack gebruiken

Voorbeeld: **Backend Engineer Stack (volledig offline)**

```bash
# Zorg ervoor dat alleen offline-veilige MCP's zijn ingeschakeld
export DISABLE_EXTERNAL_MCP=true
export MCP_SERVERS=filesystem,git

# Laad de stack
claude --stack backend \
       --project /opt/claudient \
       "Build a Go API server with tests and Docker image"
```

Alle vaardigheden in de `backend` stack werken zonder externe aanroepen:
- `golang` — lokale compiler
- `dockerfile` — lokale containerbuild
- `testing` — lokaal testframework
- `postgres` — lokale database-instantie

### Offline-validatie controlelijst

Voordat u een stack als "offline-ready" declareert, voert u uit:

```markdown
- [ ] Alle MCP-servers zijn lokaal (filesystem, git, localhost-bound)
- [ ] Geen API-aanroepen naar externe services (Claude, cloudplatforms, SaaS)
- [ ] Geen pakketdownloads (alle afhankelijkheden lokaal in cache)
- [ ] Geen web scraping of URL fetching
- [ ] Alle commando's kunnen draaien met `DISABLE_EXTERNAL_MCP=true`
- [ ] CLAUDE.md vermeldt externe afhankelijkheden duidelijk
```

---

## Fallback-patronen voor lage connectiviteit

Wanneer het netwerk intermitterend of onbetrouwbaar is:

### 1. Retry met exponentiële backoff

```bash
# .claude/hooks/mcp-retry.sh
for attempt in {1..5}; do
  timeout 5 mcp-call "$@" && exit 0
  sleep $((2 ** attempt))
done
exit 1
```

### 2. Cache-eerst opzoeking

```bash
# Controleer lokale cache voordat u API-aanroep doet
if [[ -f ~/.claude/cache/$QUERY_HASH ]]; then
  cat ~/.claude/cache/$QUERY_HASH
else
  # Voer aanroep uit en cache
  result=$(mcp-call "$@")
  echo "$result" > ~/.claude/cache/$QUERY_HASH
  echo "$result"
fi
```

### 3. Gracefu afbraak

Offline-veilige vaardigheden moeten beschikbare MCP detecteren en terugval bieden:

```markdown
# Voorbeeld: AWS Architect Vaardigheid

## Wanneer activeren
- AWS-architectuur ontwerpen

## Wanneer niet gebruiken
- Geen internet en AWS-credentials niet beschikbaar
- Terugval: gebruik lokale cache CloudFormation-sjablonen

## Instructies

### Offline-modus
Als AWS API niet beschikbaar is, gebruik vooraf gegenereerde CloudFormation-sjablonen:

\`\`\`bash
if ! aws ec2 describe-instances &>/dev/null; then
  echo "AWS API unavailable. Using cached templates."
  cat /opt/claudient/cache/cf-templates/*.json
fi
\`\`\`
```

### 4. Batchbewerkingen tijdens online windows

Verzamel offline-werk en synchroniseer wanneer het netwerk beschikbaar is:

```bash
# Offline: commando's in wachtrij plaatsen
echo "claude --stack backend 'implement feature X'" >> ~/.claude/queue.txt
echo "claude --stack devops 'deploy to staging'" >> ~/.claude/queue.txt

# Wanneer online: wachtrij legen
while read cmd; do
  eval "$cmd"
done < ~/.claude/queue.txt
rm ~/.claude/queue.txt
```

---

## Netwerkdetectie en auto-fallback

### Netwerkbeschikbaarheid detecteren

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

Hook om bij startup uit te voeren:

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

### Auto-selectstack gebaseerd op connectiviteit

```bash
#!/bin/bash
# Selecteer offline-veilige stack als geen netwerk

if [[ "$NETWORK_AVAILABLE" == "false" ]]; then
  STACK="backend"  # offline-veilige standaard
else
  STACK="gtm"  # vereist netwerk
fi

claude --stack "$STACK" "$@"
```

---

## Offline-veilige stacks — snelverwijzing

| Stack | Offline? | Opmerkingen |
|---|---|---|
| **Backend (Go, Rust, C++)** | ✅ Volledig | Vereist lokale compiler; geen cloudimplementatie |
| **Data/ML** | ✅ Volledig | Alleen lokale training; geen cloudinferentie |
| **DevOps/Infra** | ⚠️ Gedeeltelijk | IaC werkt offline; cloudimplementatie vereist API |
| **Frontend** | ✅ Volledig | Lokale build en testing; SSG-generatie |
| **Database** | ✅ Volledig | Vereist lopende lokale instantie |
| **Productivity** | ✅ Volledig | Lokale automatisering, shell-scripts |
| **Git** | ✅ Volledig | Alleen lokaal versiebeheer |
| **Computer Use** | ✅ Volledig | Lokale UI-automatisering |
| **Finance** | ❌ Geen | Vereist banking/markt-API's |
| **GTM/Growth** | ❌ Geen | Vereist analytics-, marktgegevens-API's |
| **Legal/Compliance** | ❌ Geen | Vereist regelgevingsdatabases |
| **AI-Engineering** | ⚠️ Gedeeltelijk | Alleen lokale modellen; cloudinferentie niet beschikbaar |

---

## Offline-documentatiestructuur

Wanneer u offline werkt, navigeert u in de documentatiestructuur van Claudient:

```
/opt/claudient
├── guides/offline-local-first.md       ← U bent hier
├── enterprise/AIR_GAP.md               ← Implementatiegids
├── skills/devops-infra/air-gap-deployment.md
├── workflows/offline-validation.md
├── agents/roles/offline-validator.md
├── guides/                             ← Alle door mensen leesbare documenten
├── skills/                             ← Alle vaardigheidspatronen
├── agents/                             ← Alle agentdefinities
└── workflows/                          ← Alle workflowpatronen
```

Lees van `/opt/claudient` (niet van git remote) wanneer offline.

---

## Offline modusprobleemoplossing

### Symptoom: "MCP server not responding"

```bash
# Controleer of lokale MCP draait
lsof -i :8000  # als u lokale proxy gebruikt

# Forceer offline modus
export DISABLE_EXTERNAL_MCP=true
export OFFLINE_MODE=true
claude --project /opt/claudient "test query"
```

### Symptoom: "API key not found"

Wanneer offline, kan Claude Code de Anthropic-API niet bereiken. Gebruik lokaal model:

```bash
# Gebruik Ollama in plaats daarvan
export MODEL=llama2
export API_URL=http://127.0.0.1:11434/v1
claude "test query"
```

### Symptoom: "Package not found"

Als npm/pip probeert van externe register te halen:

```bash
# Gebruik alleen lokale cache
npm ci --prefer-offline --no-audit
pip install --no-index --find-links ./cache -r requirements.txt
```

---

## Samenvatting

**Offline-first-principes voor Claudient:**

1. **Local-first-afhankelijkheden** — alles cachen; netwerk is optioneel
2. **Graceful degradation** — detecteer beschikbare MCP; bied fallbacks
3. **Bestandssysteem en git zijn uw vrienden** — ze werken zonder netwerk
4. **Offline-veilige stacks** — backend, data/ML, devops (gedeeltelijk), frontend, database, productiviteit
5. **Netwerkafhankelijke stacks** — GTM, finance, legal, AI-engineering (gedeeltelijk)
6. **Lokale modeluitvoering** — Ollama, lokale Claude-proxy's voor offline Claude
7. **Documentatie als terugval** — alles CLAUDE.md, gidsen, en patronen zijn offline-toegankelijk

**Voor ondernemingsimplementaties**, zie `enterprise/AIR_GAP.md`.

**Voor validatieworkflows**, zie `workflows/offline-validation.md`.

**Voor gedetailleerde air-gap-implementatie**, zie `skills/devops-infra/air-gap-deployment.md`.
