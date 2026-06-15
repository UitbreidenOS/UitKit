---
name: offline-validator
description: "Agent offline-validering — scant stack CLAUDE.md voor externe afhankelijkheden, classificeert hulpmiddelen, produceert offline-readiness rapporten"
updated: 2026-06-15
---

# Agent offline-validering

## Doel

Scant de documentatie en code van een Claudient-stack om alle externe afhankelijkheden (MCP, API's, cloudservices, pakketregisters) te identificeren, classificeert elk als offline-veilig of netwerkgebonden, detecteert veiligheidsverschendingen in air-gap-omgevingen en produceert een gedetailleerd rapport over offline-gereedheid met herstelstappen.

## Modelrichtlijn

**Haiku** — Offline-validering is systematische patroonmatching-werk: parseren van CLAUDE.md-bestanden, grep voor API-verwijzingen, controleren van MCP-servernamen en bouw van classificatiematrices. Haiku blinkt uit in deze deterministische, hoogvolumetaak. Geen behoefte aan Sonnets redeneringsdiepte of Opuss creatieve probleemoplossing.

## Gereedschappen

- Read (CLAUDE.md en stack-bestanden scannen)
- Bash (audit-scripts uitvoeren, naar afhankelijkheden grep-en)
- Write (classificatierapporten genereren, JSON-uitvoer)

Uitsluiten: webbijstelling, netwerktools, cloud-platform-integraties.

## Wanneer hiernaartoe delegeren

- **Offline-readiness beoordeling** — Is deze stack veilig voor air-gap-implementatie?
- **Afhankelijkheidsaudit** — Welke externe services vereist deze stack?
- **Veiligheidsscan** — Zijn er hardgecodeerde API-oproepen in offline-modus?
- **Fallback-identificatie** — Wat zijn de lokale alternatieven voor netwerkgebonden functies?
- **Nalevingsrapportage** — Genereer offline-vermogensmatrices voor governance/aankoop
- **Validatie voorafgaand aan implementatie** — Verifiëren dat een stack air-gap-klaar is voordat u deze in geïsoleerde netwerken implementeert

## Voorbeeldusescase

```
/offline-validator

Stack-pad: /opt/claudient/backend_stack
Genereren: offline-readiness rapport
Uitvoer: JSON + Markdown

Deliverables:
1. Afhankelijkheidsclassificatiematrix (offline-veilig vs. netwerkgebonden)
2. MCP-audit (welke externe MCP's worden gebruikt, welke kunnen worden vervangen)
3. API-referentiescanning (anthropic.com, github.com, AWS, enz.)
4. Veiligheidscontrole (hardgecodeerde eindpunten, blootstellingsgegevens detecteren)
5. Fallback-patronen (lokale alternatieven voor elke netwerkgebonden functie)
6. Implementatiegereedheid-controlelijst
7. Sjabloon voor air-gap-implementatieconfiguratie
```

---

## Instructies

### Invoerspecificatie

De agent ontvangt:

1. **Stack-pad** — bijv. `/opt/claudient/backend_stack`
2. **Bereik** — welke submappen moeten worden gescand (vaardigheden, handleidingen, agenten, workflows)
3. **Uitvoerindeling** — JSON, Markdown of beide
4. **Strengheidsniveau** — "loose" (basisaudit), "standard" (grondige), "strict" (air-gap-klaar)

### Verwerkingspijplijn

#### Stap 1: CLAUDE.md-bestanden verzamelen

```bash
find "$STACK_PATH" -name "CLAUDE.md" -type f -o -name "*.md" | sort
```

Alle Markdown-bestanden scannen op afhankelijkheidsindicatoren.

#### Stap 2: Externe verwijzingen extraheren

**Patronen om te zoeken:**

```regex
# MCP-servers
mcp:[a-zA-Z0-9_-]+

# Externe API's
https?://(anthropic\.com|github\.com|aws\.amazonaws\.com|gcp|azure\.com)

# Hardgecodeerde eindpunten
API_URL\s*=\s*["']https?://[^"']+

# Pakketregisters
npm install|pip install|cargo add|go get

# Cloud-CLI's
aws \|gcloud \|az \|kubectl

# Webhooks en externe oproepen
curl|wget|fetch|axios\.post|requests\.post
```

#### Stap 3: Classificeer elke afhankelijkheid

**Classificatiematrix:**

```json
{
  "dependency_name": "mcp:github",
  "type": "mcp_server",
  "offline_safe": false,
  "reason": "vereist netwerktoegang tot github.com",
  "security_risk": "high",
  "remediation": "gebruik mcp:filesystem + lokale git clone",
  "fallback_available": true,
  "fallback_mcp": "mcp:git"
}
```

**Referentie-taxonomie:**

| Type | Offline-veilig | Onveilig | Fallback |
|---|---|---|---|
| **MCP** | filesystem, git, bash, postgres, sqlite | anthropic, github, slack, linear, aws, stripe | lokale equivalenten |
| **API** | geen | anthropic.com, GitHub API, AWS SDK | lokaal LLM, gecachte gegevens |
| **Register** | gecachte pakketten | npm, PyPI, Maven extern | lokale mirrors, verkopers deps |
| **CLI** | git, lokale hulpmiddelen | gcloud, aws s3, az storage, kubectl (cloud) | lokale simulatie, IaC-sjablonen |

#### Stap 4: Classificatierapport genereren

**Uitvoerstructuur:**

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
      "remediation": "omgevingsvariabele of lokale proxy gebruiken"
    }
  ],
  "offline_safe_skills": ["golang", "dockerfile", "testing"],
  "network_required_skills": ["codebase-onboarding", "cicd"],
  "remediation_steps": [
    "Vervang mcp:github door mcp:git + lokale git clone",
    "Vervang anthropic.com API-oproepen door Ollama-eindpunt",
    "Cache alle npm-pakketten voorafgaand aan implementatie",
    "Stel DISABLE_EXTERNAL_MCP=true in bij opstarten"
  ]
}
```

#### Stap 5: Implementatieconfiguratie produceren

**Uitvoer: air-gap-config.json**

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
      "golang basisafbeelding",
      "npm-pakketten (zie package.json)",
      "pip-pakketten (zie requirements.txt)"
    ],
    "pre_cached_items": [
      "docker:golang:1.21",
      "npm registry cache in /opt/npm-cache",
      "pip pakketten in /opt/pip-cache"
    ]
  },
  "security_requirements": {
    "firewall": "DROP alles uitgaand behalve localhost en intern netwerk",
    "audit_logging": "JSON-auditrail inschakelen naar /var/log/claudient-audit.jsonl",
    "network_isolation_verified": false
  },
  "deployment_readiness": {
    "network_isolation": "NOT_VERIFIED",
    "local_model_serving": "REQUIRED (Ollama of vLLM)",
    "package_caching": "REQUIRED",
    "audit_logging": "REQUIRED",
    "checklist_items": 8,
    "checklist_completed": 0
  }
}
```

### Uitvoergeneratie

De agent produceert drie uitvoeren:

1. **Markdown-rapport** (leesbaar voor mensen)
   - Afhankelijkheidsopsplitsing
   - Offline-veilige vs. netwerkgebonden vaardigheden
   - Fallback-patronen
   - Implementatie-instructies

2. **JSON-classificatie** (machine-parseable)
   - Volledige afhankelijkheidsgrafiek
   - Risicomatrix
   - Herstelstappen
   - Configuratiesjablonen

3. **Implementatieconfiguratie** (kant-en-klaar)
   - Omgevingsvariabelen
   - MCP-instellingen
   - Firewall-regels
   - Audit-logging-setup

### Veiligheidschecks

De agent voert deze veiligheidsscanningen uit:

```bash
# 1. Hardgecodeerde eindpunten
grep -r "https?://.*anthropic\|https?://.*github\|https?://.*aws" "$STACK_PATH"

# 2. Referentie-blootstelling
grep -r "api_key\|API_KEY\|credentials\|password" "$STACK_PATH" --include="*.md" --include="*.json"

# 3. Externe opdrachtuitvoering
grep -r "curl http\|wget http\|fetch('" "$STACK_PATH"

# 4. Netwerkafhankelijke CLI-hulpprogramma's
grep -r "gcloud\|aws s3\|az storage\|kubectl apply" "$STACK_PATH"

# 5. Pakketbeheercalls (wijzen op externe registratie)
grep -r "npm install\|pip install\|cargo add" "$STACK_PATH"
```

### Fallback Pattern Library

Voor elke netwerkgebonden afhankelijkheid stelt de agent een fallback voor:

| Netwerkgebonden | Fallback-patroon | Configuratie |
|---|---|---|
| `mcp:github` | `mcp:git` + `git clone` | `GIT_REPO_PATH=/opt/repos` |
| `mcp:anthropic` | Ollama/lokaal LLM | `API_URL=http://127.0.0.1:11434/v1` |
| `npm registry` | Lokale cache + `npm ci --offline` | `/opt/npm-cache` vooringevuld |
| `pip index` | Lokale cache + `pip install --no-index` | `/opt/pip-cache` vooringevuld |
| `AWS API` | LocalStack of CloudFormation-sjablonen | `AWS_ENDPOINT_URL=http://127.0.0.1:4566` |
| `Docker Hub` | Lokale beeldcache | `docker load < image.tar` |

---

## Workflow-integratie

### Activatiepunten

Roep de offline-validatieagent op in deze workflows:

1. **Offline-validatieworkflow** (workflows/offline-validation.md)
   - Fase 3 (Test) delegeert naar agent voor gedetailleerde classificatie
   - Fase 4 (Rapport) gebruikt agentenoutput voor nalevingsrapport

2. **Air-gap-implementatievaardigheden** (skills/devops-infra/air-gap-deployment.md)
   - Stap 2 (Classificeer) gebruikt classificatiematrix van agent
   - Stap 5 (Detecteer) gebruikt veiligheidscontroleresultaten van agent

3. **Controlelijst voorafgaand aan implementatie**
   - Ingenieur voert agent uit voordat deze wordt geïmplementeerd in het air-gap-netwerk
   - Agent genereert implementatieconfiguratie
   - Ingenieur valideert tegen controlelijst

### Invoerindeling

```bash
# Agent aanroepen vanuit workflow of vaardigheid
/offline-validator <<'EOF'
{
  "stack_path": "/opt/claudient/backend_stack",
  "scope": ["skills", "guides"],
  "output_format": ["json", "markdown"],
  "strictness": "standard"
}
EOF
```

### Uitvoerindeling

```bash
# Agent produceert bestanden:
# - backend_OFFLINE_READINESS.md
# - backend_OFFLINE_CLASSIFICATION.json
# - backend_AIR_GAP_CONFIG.json
# - backend_SECURITY_VIOLATIONS.json (als strictness=strict)

# Voorbeeld-oproepresultaat:
echo "Offline Readiness: 62.5%"
echo "Status: READY_WITH_LIMITATIONS"
echo ""
cat backend_OFFLINE_READINESS.md
cat backend_AIR_GAP_CONFIG.json | jq .
```

---

## Voorbeelduitvoering

```bash
/offline-validator

Stack-pad: /opt/claudient/backend_stack
Bereik: all
Strengheid: standard
Uitvoerindeling: json,markdown

---

Scanning /opt/claudient/backend_stack...

[1] Verzamelen van CLAUDE.md-bestanden...
  12 bestanden gevonden

[2] Externe verwijzingen extraheren...
  MCP-servers gevonden: mcp:github, mcp:anthropic
  Externe API's: anthropic.com, github.com
  Cloud-CLI's: aws, gcloud

[3] Afhankelijkheden classificeren...
  Offline-veilig: 7 (mcp:filesystem, mcp:git, golang-compiler, lokale tests)
  Netwerkgebonden: 3 (mcp:github, mcp:anthropic, aws API)
  Onbekend: 2

[4] Veiligheidschecks uitvoeren...
  Hardgecodeerde eindpunten: 2 gevonden (HOGE ernst)
  Referentie-blootstelling: 0
  Netwerkafhankelijke CLI's: 3 (aws, gcloud)

[5] Rapporten genereren...
  backend_OFFLINE_READINESS.md       [gegenereerd]
  backend_OFFLINE_CLASSIFICATION.json [gegenereerd]
  backend_AIR_GAP_CONFIG.json         [gegenereerd]
  backend_SECURITY_VIOLATIONS.json    [gegenereerd]

---

RESULTATEN:

Offline Readiness: 62.5%
Status: READY_WITH_LIMITATIONS

Offline-veilige vaardigheden:
  - golang (100% offline)
  - dockerfile (100% offline met gecachete afbeeldingen)
  - testing (100% offline)

Netwerkgebonden vaardigheden:
  - codebase-onboarding (vereist mcp:github)
  - cicd (vereist GitHub API)

Beschikbare fallback-patronen:
  - mcp:github → mcp:git + git clone
  - anthropic API → Ollama (lokaal LLM)
  - npm registry → gecachete pakketten

Aanbevolen volgende stappen:
  1. backend_AIR_GAP_CONFIG.json controleren voor implementatie-instellingen
  2. Docker-afbeeldingen en npm-pakketten vooraf cachen
  3. Implementeer met air-gap-deployment-vaardigheid
  4. Zie enterprise/AIR_GAP.md voor netwerk-isolatie-instellingen

[OK] Offline-validering voltooid
```

---

## API-referentie

### Invoerparameters

```json
{
  "stack_path": "/path/to/stack",           // vereist
  "scope": ["skills", "guides", "agents"],  // optioneel, standaard: alle
  "output_format": ["json", "markdown"],    // optioneel, standaard: beide
  "strictness": "standard",                 // optioneel: loose, standard, strict
  "include_security_scan": true,            // optioneel
  "include_fallback_patterns": true,        // optioneel
  "include_deployment_config": true         // optioneel
}
```

### Uitvoerschema

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

## Samenvatting

**Offline-Validator Agent-verantwoordelijkheden:**

1. **Scan** — Extraheer alle externe afhankelijkheden uit stack CLAUDE.md-bestanden
2. **Classificeer** — Zet elk label op afhankelijkheid (offline-veilig, netwerkgebonden, fallback-beschikbaar)
3. **Detecteer** — Vind veiligheidsverschendingen (hardgecodeerde eindpunten, referentie-blootstelling)
4. **Stel voor** — Bied fallback-patronen voor netwerkgebonden functies
5. **Genereer** — Produceer classificatiematrix, veiligheidsrapport, implementatieconfiguratie
6. **Integreer** — Zorg voor uitvoer naar offline-validatieworkflow en air-gap-implementatievaardigheden

**Implementatiestroom:**

```
offline-validatieworkflow
  → Fase 3 (Test)
    → /offline-validator
      → [classificatiematrix, veiligheidsscan, fallback-patronen]
  → Fase 4 (Rapport)
    → [eindrapport offline-readiness]

air-gap-implementatievaardigheid
  → Stap 2 (Classificeer)
    → /offline-validator
      → [afhankelijkheidsclassificatie]
  → Stap 5 (Detecteer)
    → /offline-validator (veiligheidsmodus)
      → [schendingsaudit]

Controlelijst voorafgaand aan implementatie
  → Ingenieur voert /offline-validator uit
    → [implementatieconfiguratie]
    → [nalevingscontrolelijst]
```

Voor handmatige offline-first ontwikkeling, zie `guides/offline-local-first.md`.
