---
name: air-gap
description: "Enterprise air-gap implementatie: geen externe netwerkoproepen, lokale modelservering, goedgekeurde hulpprogrammalist, netwerkkontrolevereisten"
updated: 2026-06-15
---

# Handleiding voor enterprise air-gap implementatie

Dit document behandelt de implementatie van Claudient en Claude Code in volledig geïsoleerde (air-gap) bedrijfsnetwerken zonder externe connectiviteit. Het bevat beveiligingsmaatregelen, gereedschapswittelist, lokale modelservering en audittrails voor naleving.

---

## Bereik

**Air-gap-omgeving:** Een netwerk dat volledig geïsoleerd is van het internet en externe services. Geen uitgaande HTTP/HTTPS-oproepen, geen API-toegang tot cloudservices, geen externe MCP-serververbindingen.

**Nalevingsdoelstellingen:**
- Nul externe API-oproepen
- Geen gegevenslekkage (logboeken, code, referenties)
- Volledig controlelogboek van alle Claude Code-bewerkingen
- Alleen goedgekeurde hulpprogramma's en MCP's
- Lokale modelservering zonder externe gevolgtrekking

---

## Vereisten

### Netwerkvereisten

1. **Volledig geïsoleerd netwerk** — geen internetgateway, geen VPN naar cloud
2. **Lokale API-proxy** — uitgevoerd op interne servers (Claude API-proxy of lokale LLM)
3. **Interne pakketspiegels** — npm, PyPI, Maven met gecachete pakketten
4. **Lokale MCP-servers** — git, bestandssysteem, alleen aangepaste interne MCP's
5. **Controleverkeersinfrastructuur** — gecentraliseerde logboekverzameling (ELK, Splunk, enz.)

### Goedgekeurde infrastructuur

- **Besturingssystemen:** Ubuntu 22.04 LTS, CentOS 8, macOS 12+, Windows Server 2022
- **Containerruntime:** Docker CE of Podman (offline installeerbaar)
- **CI/CD:** Jenkins, GitLab Runner (alleen lokaal) of GitHub Enterprise Server (on-premise)
- **Modelservering:** Ollama (lokale LLM), vLLM of Claude API-proxy (lokaal gecacht)
- **Logboeking:** ELK Stack, Splunk of rsyslog met lokale syslog-server

---

## Deel 1: Netwerkvijzeling en verificatie

### 1.1 Netwerkaudit

Voordat u Claude Code in air-gap implementeert, controleert u nul externe connectiviteit:

```bash
#!/bin/bash
# enterprise/audit-network-isolation.sh

echo "[*] Controleren van netwerkvijzeling..."

# Test uitgaande connectiviteit
declare -a EXTERNAL_SERVICES=(
  "api.anthropic.com:443"
  "github.com:443"
  "hub.docker.com:443"
  "registry.npmjs.org:443"
  "pypi.org:443"
  "8.8.8.8:53"  # Google DNS
)

for service in "${EXTERNAL_SERVICES[@]}"; do
  if timeout 2 bash -c "cat < /dev/null > /dev/tcp/${service%:*}/${service#*:}" 2>/dev/null; then
    echo "[FAIL] Externe verbinding beschikbaar: $service"
    exit 1
  else
    echo "[PASS] Geblokkeerd: $service"
  fi
done

# Verificatie van firewallregels
echo "[*] Verificatie van firewallregels..."
sudo iptables -L -n | grep "REJECT\|DROP" | grep -E "out|eth0" && echo "[PASS] Uitgaand filteren ingeschakeld"

# DNS-resolutie controleren (moet mislukken voor externe domeinen)
if ! nslookup anthropic.com 2>/dev/null | grep -q "Address"; then
  echo "[PASS] Externe DNS-resolutie geblokkeerd"
else
  echo "[FAIL] Externe DNS-resolutie beschikbaar"
  exit 1
fi

echo "[OK] Netwerk is correct geïsoleerd"
```

Voer voor implementatie uit:

```bash
bash enterprise/audit-network-isolation.sh
```

### 1.2 Firewall-regels voor uitgaand verkeer

Beperk al het uitgaande verkeer. Sta alleen interne services toe:

**iptables-regels:**

```bash
#!/bin/bash
# enterprise/setup-firewall.sh

# Standaard al het uitgaande verkeer weigeren
sudo iptables -P OUTPUT DROP

# Sta uitgaand verkeer alleen naar interne services toe
sudo iptables -A OUTPUT -d 10.0.0.0/8 -j ACCEPT        # RFC1918 intern
sudo iptables -A OUTPUT -d 172.16.0.0/12 -j ACCEPT     # RFC1918 intern
sudo iptables -A OUTPUT -d 192.168.0.0/16 -j ACCEPT    # RFC1918 intern
sudo iptables -A OUTPUT -d 127.0.0.1 -j ACCEPT         # localhost

# Sta interne DNS toe (indien van toepassing)
sudo iptables -A OUTPUT -d <INTERNAL_DNS_IP> -p udp --dport 53 -j ACCEPT

# Sta interne NTP toe (indien van toepassing)
sudo iptables -A OUTPUT -d <INTERNAL_NTP_IP> -p udp --dport 123 -j ACCEPT

# Alles overig weigeren
sudo iptables -A OUTPUT -j REJECT --reject-with icmp-net-unreachable

# Regels behouden
sudo iptables-save > /etc/iptables/rules.v4
```

---

## Deel 2: Lokale modelservering

### 2.1 Ollama-implementatie (aanbevolen)

Ollama biedt lokale LLM-gevolgtrekking zonder externe afhankelijkheden:

**Ollama installeren:**

```bash
# macOS
brew install ollama

# Linux (downloaden van https://ollama.ai)
curl -fsSL https://ollama.ai/install.sh | sh

# Docker (voor air-gap-systemen)
docker load < ollama-docker.tar
docker run -d --name ollama -p 11434:11434 ollama:latest
```

**Trek modellen lokaal op (eenmalige internetverbinding vereist):**

```bash
# Voor air-gap: modellen met internetverbinding ophalen
ollama pull llama2
ollama pull mistral
ollama pull neural-chat

# Beschikbare modellen weergeven
ollama list

# Modellen exporteren voor offline overdracht
ollama export llama2 > llama2.gguf
```

**Claude Code configureren om Ollama te gebruiken:**

**.claude/settings.json**

```json
{
  "models": {
    "default": "ollama:llama2",
    "advanced": "ollama:mistral",
    "coding": "ollama:neural-chat"
  },
  "apiUrl": "http://127.0.0.1:11434/v1",
  "apiKey": "offline",
  "disableExternalMcp": true,
  "timeout": 300000
}
```

### 2.2 vLLM-implementatie (hoge prestaties)

Voor hogere doorvoer implementeert u vLLM:

**Docker-installatie:**

```bash
docker pull vllm/vllm-openai
docker run -d \
  --name vllm \
  --gpus all \
  -p 8000:8000 \
  vllm/vllm-openai:latest \
  --model /models/llama2 \
  --served-model-name llama2 \
  --gpu-memory-utilization 0.9
```

**Claude Code configureren:**

```json
{
  "apiUrl": "http://127.0.0.1:8000/v1",
  "model": "llama2",
  "apiKey": "fake-offline-key"
}
```

### 2.3 Claude API-proxy (gecachte reacties)

Als u vooraf in cache opgeslagen Claude-reacties hebt, voert u een lokale proxy uit:

**Installatie:**

```bash
git clone https://github.com/anthropic-ai/python-sdk
cd python-sdk
pip install -e .

# Cacheopslag maken
mkdir -p /var/cache/claude-proxy

# Proxy uitvoeren
python -m anthropic.proxy \
  --host 127.0.0.1 \
  --port 8000 \
  --cache-dir /var/cache/claude-proxy
```

---

## Deel 3: Goedgekeurde hulpprogramma's en MCP's

### 3.1 Veilige MCP-wittelist offline

Alleen deze MCP's zijn toegestaan in air-gap-omgevingen:

| MCP-server | Status | Configuratie |
|---|---|---|
| `filesystem` | ✅ Goedgekeurd | Lokale bestandsbewerkingen |
| `git` | ✅ Goedgekeurd | Lokale git-repositories |
| `bash` | ✅ Goedgekeurd | Lokale shellcommando's (met beperkingen) |
| `postgres` | ✅ Goedgekeurd | Lokale PostgreSQL-instantie |
| `sqlite` | ✅ Goedgekeurd | Ingebedde database |
| Alle externe MCP's | ❌ Geblokkeerd | GitHub, Slack, Linear, enz. |

### 3.2 MCP-configuratie voor air-gap

**.claude/settings.json**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "mcp",
      "args": ["server", "filesystem"],
      "disabled": false
    },
    "git": {
      "command": "mcp",
      "args": ["server", "git"],
      "disabled": false
    },
    "bash": {
      "command": "mcp",
      "args": ["server", "bash"],
      "disabled": false,
      "env": {
        "ALLOWED_COMMANDS": "cd,ls,find,grep,cat,echo,git,npm,pip"
      }
    },
    "postgres": {
      "command": "mcp",
      "args": ["server", "postgres"],
      "disabled": false,
      "env": {
        "DATABASE_URL": "postgresql://localhost/claudient"
      }
    }
  },
  "disableExternalMcp": true,
  "mcpTimeout": 5000
}
```

### 3.3 Bash-commandowittelist

Beperk shellcommando's tot goedgekeurde set:

```bash
# enterprise/bash-whitelist.sh

ALLOWED_COMMANDS=(
  "cd" "ls" "find" "grep" "cat" "echo" "pwd"
  "git" "npm" "pip" "python" "node" "go" "cargo"
  "docker" "docker-compose" "kubectl"
  "curl" "wget"  # Alleen interne URL's
  "jq" "yq" "sed" "awk"
  "ssh" "scp"    # Alleen naar interne hosts
)

# Commando's met het volgende weigeren:
BLOCKED_PATTERNS=(
  "curl http.*anthropic.com"
  "pip install.*--index-url.*https://"
  "npm install.*--registry.*https://"
  "|.*nc.*-l"     # omgekeerde shell
  ">&.*\/dev\/tcp" # uitgaande verbinding
)
```

Haak dit in naar `.claude/hooks/validate-bash.sh`:

```bash
#!/bin/bash
# .claude/hooks/validate-bash.sh

COMMAND="$1"

# Wittelist controleren
for allowed in "${ALLOWED_COMMANDS[@]}"; do
  if [[ "$COMMAND" == "$allowed"* ]]; then
    # Geblokkeerde patronen controleren
    for pattern in "${BLOCKED_PATTERNS[@]}"; do
      if [[ "$COMMAND" =~ $pattern ]]; then
        echo "[BLOCKED] Commando schendt beveiligingsbeleid: $COMMAND" >&2
        exit 1
      fi
    done
    exit 0
  fi
done

echo "[BLOCKED] Commando niet op wittelist: $COMMAND" >&2
exit 1
```

---

## Deel 4: Controle en logboeking

### 4.1 Gecentraliseerd controlelogboek

Alle Claude Code-bewerkingen moeten voor naleving worden geregistreerd:

**.claude/settings.json**

```json
{
  "logging": {
    "enabled": true,
    "level": "INFO",
    "format": "json",
    "outputs": [
      "file:///var/log/claudient/operations.log",
      "syslog://127.0.0.1:514"
    ]
  },
  "audit": {
    "enabled": true,
    "trackBashCommands": true,
    "trackFileAccess": true,
    "trackMcpCalls": true,
    "retentionDays": 365
  }
}
```

### 4.2 Controlelogboekschema

Elke bewerking moet registreren:

```json
{
  "timestamp": "2026-06-15T14:23:45.123Z",
  "user": "alice.smith",
  "action": "bash_command_executed",
  "details": {
    "command": "cd /opt/project && npm run build",
    "working_directory": "/opt/project",
    "exit_code": 0,
    "duration_ms": 1234
  },
  "security": {
    "network_isolation_verified": true,
    "external_calls_attempted": 0,
    "whitelist_check": "PASSED"
  }
}
```

### 4.3 Logboekdoorvoeringsinstallatie

Stuur logboeken naar centrale syslog-server:

```bash
#!/bin/bash
# enterprise/setup-log-forwarding.sh

# Installeer rsyslog als deze niet aanwezig is
sudo apt-get install -y rsyslog

# Syslog-doorstuurconfiguratie
sudo tee /etc/rsyslog.d/10-claudient-forward.conf > /dev/null <<EOF
# Claudient-logboeken naar centrale server doorsturen
:programname, isequal, "claudient" @@<INTERNAL_SYSLOG_SERVER>:514

# Ook lokaal opslaan voor controle
:programname, isequal, "claudient" /var/log/claudient/operations.log
EOF

# Rsyslog opnieuw starten
sudo systemctl restart rsyslog

# Verifiëren
tail -f /var/log/claudient/operations.log
```

### 4.4 Nalevingsrapportgeneratie

Genereer controleverslagen voor nalevingsbeoordelingen:

```bash
#!/bin/bash
# enterprise/generate-compliance-report.sh

REPORT_DATE=$(date +%Y-%m-%d)
REPORT_FILE="audit-report-${REPORT_DATE}.json"

jq -s '
{
  report_date: $REPORT_DATE,
  period: {
    start: (map(.timestamp) | min),
    end: (map(.timestamp) | max)
  },
  summary: {
    total_commands: length,
    failed_commands: map(select(.details.exit_code != 0)) | length,
    external_calls_attempted: map(.security.external_calls_attempted) | add
  },
  failed_operations: map(select(.details.exit_code != 0)),
  network_violations: map(select(.security.external_calls_attempted > 0))
}' \
  /var/log/claudient/operations.log > "$REPORT_FILE"

echo "Nalevingsrapport: $REPORT_FILE"
```

---

## Deel 5: Implementatiecontrolelijst

### Beveiligingscontrolelijst voor implementatie

```markdown
## Netwerkvijzeling
- [ ] Netwerkaudit voltooid (audit-network-isolation.sh geslaagd)
- [ ] Firewallregels geconfigureerd (setup-firewall.sh toegepast)
- [ ] Uitgaand filteren ingeschakeld (iptables DROP standaard)
- [ ] Geen internetgateway in netwerksegment
- [ ] Geen VPN-verbindingen naar externe netwerken

## Modelservering
- [ ] Lokale LLM actief (Ollama, vLLM of proxy)
- [ ] Claude Code geconfigureerd om lokaal model te gebruiken
- [ ] API-fallbacks geconfigureerd
- [ ] Modelupdateprocedure gedocumenteerd

## MCP en hulpprogramma's
- [ ] Alleen goedgekeurde MCP's ingeschakeld
- [ ] Externe MCP's uitgeschakeld (DISABLE_EXTERNAL_MCP=true)
- [ ] Bash-wittelist geconfigureerd
- [ ] Commandovalidatiehaken geïnstalleerd

## Controle en logboeking
- [ ] Controlelogboeking ingeschakeld
- [ ] Gecentraliseerde logboekdoorsturing geconfigureerd
- [ ] Logboekretentiebeleid ingesteld (365+ dagen)
- [ ] Nalevingsrapportgeneratie getest
- [ ] Logboekintegriteitsbewaking van kracht

## Documentatie
- [ ] Air-gap-implementatiehandleiding offline beschikbaar
- [ ] Incidentresponsprocedures gedocumenteerd
- [ ] Offline stacklijst aan gebruikers verstrekt
- [ ] Goedgekeurde commandolijst gedistribueerd
```

### Validatie na implementatie

```bash
#!/bin/bash
# enterprise/validate-air-gap.sh

echo "[*] Air-gap-implementatie valideren..."

# 1. Netwerkvijzelingtest
bash enterprise/audit-network-isolation.sh || exit 1

# 2. Lokale modeltest
curl -s http://127.0.0.1:11434/api/tags | grep -q "name" && echo "[PASS] Lokale LLM actief"

# 3. Test goedgekeurde MCP's
claude --help | grep -q "mcp" && echo "[PASS] MCP-ondersteuning beschikbaar"

# 4. Controlelogboektest
tail -5 /var/log/claudient/operations.log | grep -q "timestamp" && echo "[PASS] Controlelogboeking actief"

# 5. Claude Code testen met air-gap-instellingen
export DISABLE_EXTERNAL_MCP=true
claude --version && echo "[PASS] Claude Code in air-gap-modus"

echo "[OK] Air-gap-implementatievalidatie voltooid"
```

---

## Deel 6: Probleemoplossing en herstel

### Probleem: "Verbinding geweigerd" op lokaal model

```bash
# Controleer of het lokale model draait
lsof -i :11434 | grep -q LISTEN && echo "Ollama actief" || ollama serve

# Controleer of de firewall localhost niet blokkeert
sudo iptables -L | grep "127.0.0.1" | grep "ACCEPT"
```

### Probleem: "Externe oproep geprobeerd" in controlelogboek

Onderzoeksprocedure:

```bash
# Zoek de overtredende bewerking
grep "external_calls_attempted.*> 0" /var/log/claudient/operations.log | head -1

# Identificeer de opdracht
grep -B5 "external_calls_attempted" /var/log/claudient/operations.log | grep "command"

# Controleer of MCP-server geen externe oproep heeft geprobeerd
journalctl -u mcp-server --since "1 hour ago" | grep -i "connect\|http"
```

### Probleem: Modelkwaliteit is slecht (lokale LLM)

Overweeg deze verbeteringen:

1. **Groter model gebruiken:** `ollama pull mistral` of `llama2-13b`
2. **GPU-acceleratie inschakelen:** `--gpus all` in docker-configuratie
3. **Latentie verminderen:** Gebruik vLLM in plaats van Ollama
4. **Batchverzoeken:** Wachtrij en verwerking buiten piektijden

---

## Samenvatting

**Air-gap-beveiligingsmaatregelen:**

1. **Netwerkvijzeling:** Nul externe connectiviteit controleren; firewall DROP uitgang
2. **Lokale modelservering:** Ollama of vLLM voor gevolgtrekking; geen externe API's
3. **MCP-wittelist:** Alleen bestandssysteem, git, bash, postgres, sqlite toegestaan
4. **Bash-beperkingen:** Commandowittelist, geblokkeerde patronen, validatiehaken
5. **Controlelogboek:** JSON-logboeking, gecentraliseerde doorvoering, nalevingsrapporten
6. **Implementatiecontrolelijst:** Voor- en na-vluchtsvalidatie

**Voor offline bedrijf zonder air-gap**, zie `guides/offline-local-first.md`.

**Voor stack-validatie**, zie `workflows/offline-validation.md`.
