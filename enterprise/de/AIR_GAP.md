---
name: air-gap
description: "Enterprise-Luft-Lücken-Bereitstellung: keine externen Netzwerkaufrufe, lokale Modellbereitstellung, genehmigte Werkzeugliste, Netzwerk-Audit-Anforderungen"
updated: 2026-06-15
---

# Bereitstellungsleitfaden für Enterprise Air-Gap

Dieses Dokument behandelt die Bereitstellung von Claudient und Claude Code in vollständig isolierten (luftgestützten) Unternehmensnetzwerken ohne externe Konnektivität. Es umfasst Sicherheitskontrollen, Werkzeug-Whitelisting, lokale Modellbereitstellung und Audit-Trails für Compliance.

---

## Umfang

**Air-Gap-Umgebung:** Ein Netzwerk, das vollständig vom Internet und externen Diensten isoliert ist. Keine ausgehenden HTTP/HTTPS-Aufrufe, kein API-Zugriff auf Cloud-Dienste, keine Remote-MCP-Serververbindungen.

**Compliance-Ziele:**
- Null externe API-Aufrufe
- Keine Datenexfiltration (Logs, Code, Anmeldedaten)
- Vollständiger Audit-Trail aller Claude Code-Vorgänge
- Nur genehmigte Tools und MCPs
- Lokale Modellbereitstellung ohne externe Inferenz

---

## Voraussetzungen

### Netzwerkanforderungen

1. **Vollständig isoliertes Netzwerk** — kein Internet-Gateway, kein VPN zur Cloud
2. **Lokaler API-Proxy** — auf internen Servern ausgeführt (Claude API Proxy oder lokales LLM)
3. **Interne Paket-Mirrors** — npm, PyPI, Maven mit gecacheten Paketen
4. **Lokale MCP-Server** — git, Dateisystem, nur benutzerdefinierte interne MCPs
5. **Audit-Logging-Infrastruktur** — zentralisierte Log-Erfassung (ELK, Splunk, etc.)

### Genehmigte Infrastruktur

- **Betriebssysteme:** Ubuntu 22.04 LTS, CentOS 8, macOS 12+, Windows Server 2022
- **Container-Laufzeit:** Docker CE oder Podman (offline-installierbar)
- **CI/CD:** Jenkins, GitLab Runner (nur lokal) oder GitHub Enterprise Server (On-Prem)
- **Modellbereitstellung:** Ollama (lokales LLM), vLLM oder Claude API Proxy (lokal gecacht)
- **Logging:** ELK Stack, Splunk oder rsyslog mit lokalem Syslog-Server

---

## Teil 1: Netzwerkisolation und Überprüfung

### 1.1 Netzwerk-Audit

Vor der Bereitstellung von Claude Code in Air-Gap die Null-Konnektivität verifizieren:

```bash
#!/bin/bash
# enterprise/audit-network-isolation.sh

echo "[*] Überwachung der Netzwerkisolation..."

# Überprüfung der ausgehenden Konnektivität
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
    echo "[FAIL] Externe Verbindung verfügbar: $service"
    exit 1
  else
    echo "[PASS] Blockiert: $service"
  fi
done

# Firewall-Regeln verifizieren
echo "[*] Überprüfung der Firewall-Regeln..."
sudo iptables -L -n | grep "REJECT\|DROP" | grep -E "out|eth0" && echo "[PASS] Ausgangsfilterung aktiviert"

# DNS-Auflösung überprüfen (sollte für externe Domänen fehlschlagen)
if ! nslookup anthropic.com 2>/dev/null | grep -q "Address"; then
  echo "[PASS] Externe DNS-Auflösung blockiert"
else
  echo "[FAIL] Externe DNS-Auflösung verfügbar"
  exit 1
fi

echo "[OK] Netzwerk ist ordnungsgemäß isoliert"
```

Vor der Bereitstellung ausführen:

```bash
bash enterprise/audit-network-isolation.sh
```

### 1.2 Firewall-Regeln für Ausgangsverkehr

Beschränken Sie all ausgehenden Datenverkehr. Nur interne Dienste zulassen:

**iptables-Regeln:**

```bash
#!/bin/bash
# enterprise/setup-firewall.sh

# Standardmäßig allen ausgehenden Datenverkehr ablehnen
sudo iptables -P OUTPUT DROP

# Nur ausgehenden Datenverkehr zu internen Diensten zulassen
sudo iptables -A OUTPUT -d 10.0.0.0/8 -j ACCEPT        # RFC1918 intern
sudo iptables -A OUTPUT -d 172.16.0.0/12 -j ACCEPT     # RFC1918 intern
sudo iptables -A OUTPUT -d 192.168.0.0/16 -j ACCEPT    # RFC1918 intern
sudo iptables -A OUTPUT -d 127.0.0.1 -j ACCEPT         # localhost

# Internes DNS zulassen (falls erforderlich)
sudo iptables -A OUTPUT -d <INTERNAL_DNS_IP> -p udp --dport 53 -j ACCEPT

# Internes NTP zulassen (falls erforderlich)
sudo iptables -A OUTPUT -d <INTERNAL_NTP_IP> -p udp --dport 123 -j ACCEPT

# Alles andere ablehnen
sudo iptables -A OUTPUT -j REJECT --reject-with icmp-net-unreachable

# Regeln beibehalten
sudo iptables-save > /etc/iptables/rules.v4
```

---

## Teil 2: Lokale Modellbereitstellung

### 2.1 Ollama-Bereitstellung (empfohlen)

Ollama bietet lokale LLM-Inferenz ohne externe Abhängigkeiten:

**Ollama installieren:**

```bash
# macOS
brew install ollama

# Linux (von https://ollama.ai herunterladen)
curl -fsSL https://ollama.ai/install.sh | sh

# Docker (für luftgestützte Systeme)
docker load < ollama-docker.tar
docker run -d --name ollama -p 11434:11434 ollama:latest
```

**Modelle lokal abrufen (einmalig Internet erforderlich):**

```bash
# Vor Air-Gap: Modelle mit Internetzugang abrufen
ollama pull llama2
ollama pull mistral
ollama pull neural-chat

# Verfügbare Modelle auflisten
ollama list

# Modelle für Offline-Transfer exportieren
ollama export llama2 > llama2.gguf
```

**Claude Code konfigurieren, um Ollama zu verwenden:**

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

### 2.2 vLLM-Bereitstellung (hohe Leistung)

Für höheren Durchsatz vLLM bereitstellen:

**Docker-Setup:**

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

**Claude Code konfigurieren:**

```json
{
  "apiUrl": "http://127.0.0.1:8000/v1",
  "model": "llama2",
  "apiKey": "fake-offline-key"
}
```

### 2.3 Claude API Proxy (gecachte Antworten)

Wenn Sie vorher gecachte Claude-Antworten haben, führen Sie einen lokalen Proxy aus:

**Einrichtung:**

```bash
git clone https://github.com/anthropic-ai/python-sdk
cd python-sdk
pip install -e .

# Cache-Speicher erstellen
mkdir -p /var/cache/claude-proxy

# Proxy ausführen
python -m anthropic.proxy \
  --host 127.0.0.1 \
  --port 8000 \
  --cache-dir /var/cache/claude-proxy
```

---

## Teil 3: Genehmigte Tools und MCPs

### 3.1 Offline-sichere MCP-Whitelist

Nur diese MCPs sind in Air-Gap-Umgebungen zulässig:

| MCP-Server | Status | Konfiguration |
|---|---|---|
| `filesystem` | ✅ Genehmigt | Lokale Dateioperationen |
| `git` | ✅ Genehmigt | Lokale Git-Repositorys |
| `bash` | ✅ Genehmigt | Lokale Shell-Befehle (mit Einschränkungen) |
| `postgres` | ✅ Genehmigt | Lokale PostgreSQL-Instanz |
| `sqlite` | ✅ Genehmigt | Eingebettete Datenbank |
| Alle externen MCPs | ❌ Blockiert | GitHub, Slack, Linear, etc. |

### 3.2 MCP-Konfiguration für Air-Gap

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

### 3.3 Bash-Befehls-Whitelist

Shell-Befehle auf genehmigtes Set beschränken:

```bash
# enterprise/bash-whitelist.sh

ALLOWED_COMMANDS=(
  "cd" "ls" "find" "grep" "cat" "echo" "pwd"
  "git" "npm" "pip" "python" "node" "go" "cargo"
  "docker" "docker-compose" "kubectl"
  "curl" "wget"  # Nur interne URLs
  "jq" "yq" "sed" "awk"
  "ssh" "scp"    # Nur zu internen Hosts
)

# Befehle mit folgendem Inhalt ablehnen:
BLOCKED_PATTERNS=(
  "curl http.*anthropic.com"
  "pip install.*--index-url.*https://"
  "npm install.*--registry.*https://"
  "|.*nc.*-l"     # umgekehrte Shell
  ">&.*\/dev\/tcp" # ausgehende Verbindung
)
```

Hooking in `.claude/hooks/validate-bash.sh`:

```bash
#!/bin/bash
# .claude/hooks/validate-bash.sh

COMMAND="$1"

# Whitelist überprüfen
for allowed in "${ALLOWED_COMMANDS[@]}"; do
  if [[ "$COMMAND" == "$allowed"* ]]; then
    # Blockierte Muster überprüfen
    for pattern in "${BLOCKED_PATTERNS[@]}"; do
      if [[ "$COMMAND" =~ $pattern ]]; then
        echo "[BLOCKED] Befehl verstößt gegen Sicherheitsrichtlinie: $COMMAND" >&2
        exit 1
      fi
    done
    exit 0
  fi
done

echo "[BLOCKED] Befehl nicht auf Whitelist: $COMMAND" >&2
exit 1
```

---

## Teil 4: Audit und Logging

### 4.1 Zentralisierte Audit-Trail

Alle Claude Code-Vorgänge müssen zu Compliance-Zwecken protokolliert werden:

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

### 4.2 Audit-Log-Schema

Jeder Vorgang muss aufzeichnen:

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

### 4.3 Log-Weiterleitungssetup

Senden Sie Logs an den zentralen Syslog-Server:

```bash
#!/bin/bash
# enterprise/setup-log-forwarding.sh

# Installieren Sie rsyslog, falls nicht vorhanden
sudo apt-get install -y rsyslog

# Syslog-Weiterleitungskonfiguration
sudo tee /etc/rsyslog.d/10-claudient-forward.conf > /dev/null <<EOF
# Claudient-Logs an zentralen Server weiterleiten
:programname, isequal, "claudient" @@<INTERNAL_SYSLOG_SERVER>:514

# Auch lokal für Audit speichern
:programname, isequal, "claudient" /var/log/claudient/operations.log
EOF

# Starten Sie rsyslog neu
sudo systemctl restart rsyslog

# Überprüfen
tail -f /var/log/claudient/operations.log
```

### 4.4 Compliance-Berichtsgenerierung

Generieren Sie Audit-Berichte für Compliance-Überprüfungen:

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

echo "Compliance-Bericht: $REPORT_FILE"
```

---

## Teil 5: Bereitstellungs-Checkliste

### Sicherheitsprüfliste vor der Bereitstellung

```markdown
## Netzwerkisolation
- [ ] Netzwerk-Audit abgeschlossen (audit-network-isolation.sh bestanden)
- [ ] Firewall-Regeln konfiguriert (setup-firewall.sh angewendet)
- [ ] Ausgangsfilterung aktiviert (iptables DROP Standard)
- [ ] Kein Internet-Gateway im Netzwerksegment
- [ ] Keine VPN-Verbindungen zu externen Netzwerken

## Modellbereitstellung
- [ ] Lokales LLM läuft (Ollama, vLLM oder Proxy)
- [ ] Claude Code konfiguriert für lokales Modell
- [ ] API-Fallbacks konfiguriert
- [ ] Modell-Update-Verfahren dokumentiert

## MCP und Tools
- [ ] Nur genehmigte MCPs aktiviert
- [ ] Externe MCPs deaktiviert (DISABLE_EXTERNAL_MCP=true)
- [ ] Bash-Whitelist konfiguriert
- [ ] Befehlsvalidierungs-Hooks installiert

## Audit und Logging
- [ ] Audit-Logging aktiviert
- [ ] Zentrale Log-Weiterleitungskonfiguration
- [ ] Log-Aufbewahrungsrichtlinie festgelegt (365+ Tage)
- [ ] Compliance-Berichtsgenerierung getestet
- [ ] Log-Integritätsüberwachung in Kraft

## Dokumentation
- [ ] Air-Gap-Bereitstellungsleitfaden offline verfügbar
- [ ] Incident-Response-Verfahren dokumentiert
- [ ] Offline-Stack-Liste für Benutzer bereitgestellt
- [ ] Genehmigte Befehlsliste verteilt
```

### Validierung nach der Bereitstellung

```bash
#!/bin/bash
# enterprise/validate-air-gap.sh

echo "[*] Validierung der Air-Gap-Bereitstellung..."

# 1. Netzwerkisolationstest
bash enterprise/audit-network-isolation.sh || exit 1

# 2. Lokales Modelltest
curl -s http://127.0.0.1:11434/api/tags | grep -q "name" && echo "[PASS] Lokales LLM läuft"

# 3. Test der genehmigten MCPs
claude --help | grep -q "mcp" && echo "[PASS] MCP-Unterstützung verfügbar"

# 4. Audit-Logging-Test
tail -5 /var/log/claudient/operations.log | grep -q "timestamp" && echo "[PASS] Audit-Logging funktioniert"

# 5. Claude Code mit Air-Gap-Einstellungen testen
export DISABLE_EXTERNAL_MCP=true
claude --version && echo "[PASS] Claude Code im Air-Gap-Modus"

echo "[OK] Validierung der Air-Gap-Bereitstellung abgeschlossen"
```

---

## Teil 6: Fehlerbehebung und Wiederherstellung

### Problem: "Connection refused" beim lokalen Modell

```bash
# Überprüfen Sie, ob das lokale Modell läuft
lsof -i :11434 | grep -q LISTEN && echo "Ollama läuft" || ollama serve

# Überprüfen Sie, ob die Firewall localhost nicht blockiert
sudo iptables -L | grep "127.0.0.1" | grep "ACCEPT"
```

### Problem: "External call attempted" im Audit-Log

Untersuchungsverfahren:

```bash
# Finden Sie die verstößende Operation
grep "external_calls_attempted.*> 0" /var/log/claudient/operations.log | head -1

# Identifizieren Sie den Befehl
grep -B5 "external_calls_attempted" /var/log/claudient/operations.log | grep "command"

# Überprüfen Sie, dass der MCP-Server keinen externen Anruf versucht hat
journalctl -u mcp-server --since "1 hour ago" | grep -i "connect\|http"
```

### Problem: Modellqualität ist schlecht (lokales LLM)

Erwägen Sie diese Verbesserungen:

1. **Verwenden Sie ein größeres Modell:** `ollama pull mistral` oder `llama2-13b`
2. **Aktivieren Sie GPU-Beschleunigung:** `--gpus all` in der Docker-Konfiguration
3. **Reduzieren Sie Latenz:** Verwenden Sie vLLM statt Ollama
4. **Batch-Anfragen:** Warteschlange und Verarbeitung während Stoßzeiten

---

## Zusammenfassung

**Air-Gap-Sicherheitskontrollen:**

1. **Netzwerkisolation:** Null externe Konnektivität verifizieren; Firewall DROP Ausgang
2. **Lokale Modellbereitstellung:** Ollama oder vLLM zur Inferenz; keine externen APIs
3. **MCP-Whitelist:** Nur Dateisystem, Git, Bash, Postgres, SQLite zulässig
4. **Bash-Einschränkungen:** Befehls-Whitelist, blockierte Muster, Validierungs-Hooks
5. **Audit-Trail:** JSON-Logging, zentralisierte Weiterleitungswerte, Compliance-Berichte
6. **Bereitstellungs-Checkliste:** Vor- und Nach-Flug-Validierung

**Für Offline-Betrieb ohne Air-Gap**, siehe `guides/offline-local-first.md`.

**Für Stack-Validierung**, siehe `workflows/offline-validation.md`.
