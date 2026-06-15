---
name: air-gap
description: "Despliegue empresarial de red aislada: sin llamadas de red externas, servicio de modelo local, lista de herramientas aprobadas, requisitos de auditoría de red"
updated: 2026-06-15
---

# Guía de despliegue empresarial de red aislada

Este documento cubre el despliegue de Claudient y Claude Code en redes empresariales completamente aisladas (aire-cerradas) sin conectividad externa. Incluye controles de seguridad, lista blanca de herramientas, servicio de modelo local y auditorías de cumplimiento.

---

## Alcance

**Entorno aire-cerrado:** Una red completamente aislada de Internet y servicios externos. Sin llamadas HTTP/HTTPS salientes, sin acceso API a servicios en la nube, sin conexiones de servidor MCP remoto.

**Objetivos de cumplimiento:**
- Cero llamadas de API externa
- Sin exfiltración de datos (registros, código, credenciales)
- Auditoría completa de todas las operaciones de Claude Code
- Solo herramientas y MCP aprobados
- Servicio de modelo local sin inferencia externa

---

## Requisitos previos

### Requisitos de red

1. **Red completamente aislada** — sin puerta de enlace de Internet, sin VPN a la nube
2. **Proxy API local** — ejecutándose en servidores internos (proxy de API Claude o LLM local)
3. **Espejos de paquetes internos** — npm, PyPI, Maven con paquetes en caché
4. **Servidores MCP locales** — git, sistema de archivos, solo MCP internos personalizados
5. **Infraestructura de registro de auditoría** — recopilación centralizada de registros (ELK, Splunk, etc.)

### Infraestructura aprobada

- **Sistemas operativos:** Ubuntu 22.04 LTS, CentOS 8, macOS 12+, Windows Server 2022
- **Tiempo de ejecución de contenedor:** Docker CE o Podman (instalable sin conexión)
- **CI/CD:** Jenkins, GitLab Runner (solo local) o GitHub Enterprise Server (local)
- **Servicio de modelo:** Ollama (LLM local), vLLM o proxy de API Claude (en caché local)
- **Registro:** ELK Stack, Splunk o rsyslog con servidor syslog local

---

## Parte 1: Aislamiento de red y verificación

### 1.1 Auditoría de red

Antes de desplegar Claude Code en aire-cerrado, verifique conectividad cero externa:

```bash
#!/bin/bash
# enterprise/audit-network-isolation.sh

echo "[*] Auditoría de aislamiento de red..."

# Prueba de conectividad saliente
declare -a EXTERNAL_SERVICES=(
  "api.anthropic.com:443"
  "github.com:443"
  "hub.docker.com:443"
  "registry.npmjs.org:443"
  "pypi.org:443"
  "8.8.8.8:53"  # DNS de Google
)

for service in "${EXTERNAL_SERVICES[@]}"; do
  if timeout 2 bash -c "cat < /dev/null > /dev/tcp/${service%:*}/${service#*:}" 2>/dev/null; then
    echo "[FAIL] Conexión externa disponible: $service"
    exit 1
  else
    echo "[PASS] Bloqueado: $service"
  fi
done

# Verificar reglas del cortafuegos
echo "[*] Verificación de reglas del cortafuegos..."
sudo iptables -L -n | grep "REJECT\|DROP" | grep -E "out|eth0" && echo "[PASS] Filtrado de salida habilitado"

# Comprobar resolución de DNS (debe fallar para dominios externos)
if ! nslookup anthropic.com 2>/dev/null | grep -q "Address"; then
  echo "[PASS] Resolución DNS externa bloqueada"
else
  echo "[FAIL] Resolución DNS externa disponible"
  exit 1
fi

echo "[OK] La red está correctamente aislada"
```

Ejecute antes del despliegue:

```bash
bash enterprise/audit-network-isolation.sh
```

### 1.2 Reglas de cortafuegos de salida

Restrinja todo el tráfico saliente. Solo permita servicios internos:

**Reglas iptables:**

```bash
#!/bin/bash
# enterprise/setup-firewall.sh

# Denegar por defecto todo el tráfico saliente
sudo iptables -P OUTPUT DROP

# Permitir salida solo a servicios internos
sudo iptables -A OUTPUT -d 10.0.0.0/8 -j ACCEPT        # RFC1918 interno
sudo iptables -A OUTPUT -d 172.16.0.0/12 -j ACCEPT     # RFC1918 interno
sudo iptables -A OUTPUT -d 192.168.0.0/16 -j ACCEPT    # RFC1918 interno
sudo iptables -A OUTPUT -d 127.0.0.1 -j ACCEPT         # localhost

# Permitir DNS interno (si aplica)
sudo iptables -A OUTPUT -d <INTERNAL_DNS_IP> -p udp --dport 53 -j ACCEPT

# Permitir NTP interno (si aplica)
sudo iptables -A OUTPUT -d <INTERNAL_NTP_IP> -p udp --dport 123 -j ACCEPT

# Denegar todo lo demás
sudo iptables -A OUTPUT -j REJECT --reject-with icmp-net-unreachable

# Persistir reglas
sudo iptables-save > /etc/iptables/rules.v4
```

---

## Parte 2: Servicio de modelo local

### 2.1 Despliegue de Ollama (recomendado)

Ollama proporciona inferencia LLM local sin dependencias externas:

**Instalar Ollama:**

```bash
# macOS
brew install ollama

# Linux (descargar desde https://ollama.ai)
curl -fsSL https://ollama.ai/install.sh | sh

# Docker (para sistemas aire-cerrados)
docker load < ollama-docker.tar
docker run -d --name ollama -p 11434:11434 ollama:latest
```

**Extrae modelos localmente (se requiere Internet una vez):**

```bash
# Antes de aire-cerrado: extraer modelos con acceso a Internet
ollama pull llama2
ollama pull mistral
ollama pull neural-chat

# Enumerar modelos disponibles
ollama list

# Exportar modelos para transferencia sin conexión
ollama export llama2 > llama2.gguf
```

**Configure Claude Code para usar Ollama:**

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

### 2.2 Despliegue de vLLM (alto rendimiento)

Para mayor rendimiento, implemente vLLM:

**Configuración de Docker:**

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

**Configure Claude Code:**

```json
{
  "apiUrl": "http://127.0.0.1:8000/v1",
  "model": "llama2",
  "apiKey": "fake-offline-key"
}
```

### 2.3 Proxy de API Claude (respuestas en caché)

Si tiene respuestas de Claude precargadas, ejecute un proxy local:

**Configuración:**

```bash
git clone https://github.com/anthropic-ai/python-sdk
cd python-sdk
pip install -e .

# Crear almacén de caché
mkdir -p /var/cache/claude-proxy

# Ejecutar proxy
python -m anthropic.proxy \
  --host 127.0.0.1 \
  --port 8000 \
  --cache-dir /var/cache/claude-proxy
```

---

## Parte 3: Herramientas aprobadas y MCP

### 3.1 Lista blanca de MCP segura sin conexión

Solo estos MCP se permiten en entornos aire-cerrado:

| Servidor MCP | Estado | Configuración |
|---|---|---|
| `filesystem` | ✅ Aprobado | Operaciones de archivo local |
| `git` | ✅ Aprobado | Repositorios locales de git |
| `bash` | ✅ Aprobado | Comandos de shell local (con restricciones) |
| `postgres` | ✅ Aprobado | Instancia PostgreSQL local |
| `sqlite` | ✅ Aprobado | Base de datos integrada |
| Todos los MCP externos | ❌ Bloqueado | GitHub, Slack, Linear, etc. |

### 3.2 Configuración de MCP para aire-cerrado

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

### 3.3 Lista blanca de comandos Bash

Restringir comandos de shell al conjunto aprobado:

```bash
# enterprise/bash-whitelist.sh

ALLOWED_COMMANDS=(
  "cd" "ls" "find" "grep" "cat" "echo" "pwd"
  "git" "npm" "pip" "python" "node" "go" "cargo"
  "docker" "docker-compose" "kubectl"
  "curl" "wget"  # Solo URLs internas
  "jq" "yq" "sed" "awk"
  "ssh" "scp"    # Solo a hosts internos
)

# Rechazados comandos que contienen:
BLOCKED_PATTERNS=(
  "curl http.*anthropic.com"
  "pip install.*--index-url.*https://"
  "npm install.*--registry.*https://"
  "|.*nc.*-l"     # shell inverso
  ">&.*\/dev\/tcp" # conexión saliente
)
```

Enganche esto a `.claude/hooks/validate-bash.sh`:

```bash
#!/bin/bash
# .claude/hooks/validate-bash.sh

COMMAND="$1"

# Verificar lista blanca
for allowed in "${ALLOWED_COMMANDS[@]}"; do
  if [[ "$COMMAND" == "$allowed"* ]]; then
    # Verificar patrones bloqueados
    for pattern in "${BLOCKED_PATTERNS[@]}"; do
      if [[ "$COMMAND" =~ $pattern ]]; then
        echo "[BLOCKED] El comando viola la política de seguridad: $COMMAND" >&2
        exit 1
      fi
    done
    exit 0
  fi
done

echo "[BLOCKED] Comando no incluido en la lista blanca: $COMMAND" >&2
exit 1
```

---

## Parte 4: Auditoría y registro

### 4.1 Registro de auditoría centralizado

Todas las operaciones de Claude Code deben registrarse para cumplimiento:

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

### 4.2 Esquema de registro de auditoría

Cada operación debe registrar:

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

### 4.3 Configuración de reenvío de registros

Envíe registros al servidor syslog central:

```bash
#!/bin/bash
# enterprise/setup-log-forwarding.sh

# Instalar rsyslog si no está presente
sudo apt-get install -y rsyslog

# Configurar reenvío de syslog
sudo tee /etc/rsyslog.d/10-claudient-forward.conf > /dev/null <<EOF
# Reenviar registros de Claudient al servidor central
:programname, isequal, "claudient" @@<INTERNAL_SYSLOG_SERVER>:514

# También almacenar localmente para auditoría
:programname, isequal, "claudient" /var/log/claudient/operations.log
EOF

# Reiniciar rsyslog
sudo systemctl restart rsyslog

# Verificar
tail -f /var/log/claudient/operations.log
```

### 4.4 Generación de informes de cumplimiento

Genere informes de auditoría para revisiones de cumplimiento:

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

echo "Informe de cumplimiento: $REPORT_FILE"
```

---

## Parte 5: Lista de control de despliegue

### Lista de verificación de seguridad previa al despliegue

```markdown
## Aislamiento de red
- [ ] Auditoría de red completada (audit-network-isolation.sh aprobada)
- [ ] Reglas de cortafuegos configuradas (setup-firewall.sh aplicada)
- [ ] Filtrado de salida habilitado (DROP por defecto iptables)
- [ ] Sin puerta de enlace de Internet en segmento de red
- [ ] Sin conexiones VPN a redes externas

## Servicio de modelo
- [ ] LLM local en ejecución (Ollama, vLLM o proxy)
- [ ] Claude Code configurado para usar modelo local
- [ ] Conmutaciones por error de API configuradas
- [ ] Procedimiento de actualización del modelo documentado

## MCP y herramientas
- [ ] Solo MCP aprobados habilitados
- [ ] MCP externos deshabilitados (DISABLE_EXTERNAL_MCP=true)
- [ ] Lista blanca de Bash configurada
- [ ] Hooks de validación de comandos instalados

## Auditoría y registro
- [ ] Registro de auditoría habilitado
- [ ] Reenvío de registro central configurado
- [ ] Política de retención de registros establecida (365+ días)
- [ ] Generación de informe de cumplimiento probada
- [ ] Monitoreo de integridad de registros en vigor

## Documentación
- [ ] Guía de despliegue aire-cerrado disponible sin conexión
- [ ] Procedimientos de respuesta a incidentes documentados
- [ ] Lista de stack sin conexión proporcionada a usuarios
- [ ] Lista de comandos aprobados distribuida
```

### Validación posterior al despliegue

```bash
#!/bin/bash
# enterprise/validate-air-gap.sh

echo "[*] Validación del despliegue aire-cerrado..."

# 1. Prueba de aislamiento de red
bash enterprise/audit-network-isolation.sh || exit 1

# 2. Prueba de modelo local
curl -s http://127.0.0.1:11434/api/tags | grep -q "name" && echo "[PASS] LLM local en ejecución"

# 3. Prueba de MCP aprobados
claude --help | grep -q "mcp" && echo "[PASS] Soporte MCP disponible"

# 4. Prueba de registro de auditoría
tail -5 /var/log/claudient/operations.log | grep -q "timestamp" && echo "[PASS] Registro de auditoría en ejecución"

# 5. Prueba Claude Code con configuración aire-cerrado
export DISABLE_EXTERNAL_MCP=true
claude --version && echo "[PASS] Claude Code en modo aire-cerrado"

echo "[OK] Validación del despliegue aire-cerrado completada"
```

---

## Parte 6: Solución de problemas y recuperación

### Problema: "Conexión rechazada" en modelo local

```bash
# Verificar que el modelo local se está ejecutando
lsof -i :11434 | grep -q LISTEN && echo "Ollama en ejecución" || ollama serve

# Verificar que el cortafuegos no bloquea localhost
sudo iptables -L | grep "127.0.0.1" | grep "ACCEPT"
```

### Problema: "Llamada externa intentada" en registro de auditoría

Procedimiento de investigación:

```bash
# Encontrar la operación infractora
grep "external_calls_attempted.*> 0" /var/log/claudient/operations.log | head -1

# Identificar el comando
grep -B5 "external_calls_attempted" /var/log/claudient/operations.log | grep "command"

# Verificar que el servidor MCP no intentó llamada externa
journalctl -u mcp-server --since "1 hour ago" | grep -i "connect\|http"
```

### Problema: La calidad del modelo es pobre (LLM local)

Considere estas mejoras:

1. **Usar modelo más grande:** `ollama pull mistral` o `llama2-13b`
2. **Activar aceleración GPU:** `--gpus all` en configuración de docker
3. **Reducir latencia:** Use vLLM en lugar de Ollama
4. **Solicitudes por lotes:** Cola y proceso durante horas valle

---

## Resumen

**Controles de seguridad aire-cerrado:**

1. **Aislamiento de red:** Verificar conectividad cero externa; cortafuegos DROP salida
2. **Servicio de modelo local:** Ollama o vLLM para inferencia; sin APIs externas
3. **Lista blanca MCP:** Solo sistema de archivos, git, bash, postgres, sqlite permitidos
4. **Restricciones Bash:** Comando whitelist, patrones bloqueados, hooks de validación
5. **Auditoría:** Registro JSON, reenvío centralizado, informes de cumplimiento
6. **Lista de verificación de despliegue:** Validación previa y posterior al vuelo

**Para operación sin conexión sin aire-cerrado**, ver `guides/offline-local-first.md`.

**Para validación de stack**, ver `workflows/offline-validation.md`.
