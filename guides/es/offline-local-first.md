---
name: offline-local-first
description: "Modo offline y local-first: ejecutar Claudient en entornos aislados, stacks offline, patrones de respaldo y qué requiere conectividad de red"
updated: 2026-06-15
---

# Guía de modo offline y local-first

Esta guía cubre la ejecución de Claudient, sus stacks y flujos de trabajo de Claude Code en entornos aislados, offline y de baja conectividad. Distingue entre capacidades que funcionan offline y las que requieren acceso a la red, y documenta patrones de respaldo para escenarios desconectados.

---

## Descripción general

Claudient está diseñado para integrarse con Claude Code y herramientas externas (Claude API, servidores MCP, plataformas en la nube). Sin embargo, muchos flujos de trabajo pueden ejecutarse offline con:

1. **Servicio de modelo local** (Claude a través de proxy API local)
2. **Stacks seguros offline** (habilidades que no requieren servidores MCP externos o APIs)
3. **Conocimiento en caché** (CLAUDE.md, documentación, plantillas de prompts)
4. **Herramientas desconectadas** (CLI local, git, shell, operaciones de archivo)

Esta guía identifica qué componentes de Claudient funcionan offline y cómo configurarlos.

---

## Lo que funciona offline

### Capacidades principales de Claudient (Completamente offline)

- **Guías, habilidades, agentes, flujos de trabajo, prompts** — toda documentación y patrones Markdown
- **Operaciones de git** — clonación, confirmación, ramificación (solo repositorio local)
- **Lectura/escritura de archivos** — cualquier operación de sistema de archivos local
- **Script bash/shell** — comandos locales, configuración de entorno
- **Edición y revisión de código** — análisis de código local
- **Plantillas y listas de verificación** — patrones de prompts offline

### Stacks seguros offline

Los siguientes stacks pueden ejecutarse completamente offline sin llamadas MCP o API externas:

- **Backend (Go, Rust, C++)** — herramientas de compilación, compilación, testing (sin implementación en la nube)
- **Data/ML** — entrenamiento local, ingeniería de características, análisis (sin inferencia en la nube)
- **DevOps/Infra** — infraestructura como código, k8s local, Docker (sin registros externos)
- **Frontend** — compilación local, generación SSG, testing de componentes offline
- **Flujos de trabajo de git** — control de versiones, CI local (usando runners locales)
- **Productividad/Automatización** — scripts CLI locales, flujos de trabajo shell
- **Base de datos** — instancias locales (PostgreSQL, Redis, SQLite) — sin consultas en la nube
- **Computer Use** — automatización de UI local, OCR, scripting de escritorio

### Servidores MCP seguros offline

Si ejecuta MCP localmente, estos servidores no tienen dependencias externas:

- `filesystem` — operaciones de archivo local
- `git` — acceso al repositorio git local
- `postgres` — base de datos local (requiere instancia en ejecución)
- `sqlite` — base de datos integrada
- `bash` — comandos shell en máquina local
- MCPs locales personalizados (cualquier servidor MCP construido por usuario que se ejecute en localhost)

---

## Lo que requiere red

### Características de Claudient que necesitan Internet

- **Llamadas Claude API** — cualquier habilidad/agente que invoque Claude (requiere clave API Anthropic y acceso a la red)
- **Servidores MCP externos** — servidores remotos (GitHub, Linear, Slack, etc.)
- **Implementaciones en la nube** — AWS, GCP, Azure (requiere acceso a API de la nube)
- **Registros de paquetes** — npm, PyPI, Maven (requiere descarga de paquete)
- **Web scraping/fetching** — cualquier habilidad que obtenga URLs externas
- **Email, Slack, webhooks** — canales de notificación externos
- **DNS, APIs públicas** — cualquier llamada HTTP/HTTPS externa

### Stacks sin capacidad offline

Los siguientes stacks requieren red para funcionalidad completa:

- **GTM/Growth** — investigación de mercado, análisis, integraciones de redes sociales
- **Legal/Compliance** — bases de datos normativas, integraciones de API
- **Product/Marketing** — análisis, integración CMS, herramientas externas
- **Finance** — APIs bancarias, procesadores de pago, datos de mercado
- **AI-Engineering** — APIs de modelos en la nube, bases de datos vectoriales, servicios de inferencia

---

## Configurar modo offline

### 1. Servicio de modelo local

Para usar modelos Claude offline, ejecute un proxy API local que caché o auto-hospede Claude:

**Opción A: Proxy de Anthropic (Claude API localmente)**

```bash
# Requiere: internet para configuración única, luego servicio local
# Proxy Claude API a través de un punto final local
git clone https://github.com/anthropic-ai/python-sdk
cd python-sdk

# Configurar proxy de almacenamiento en caché local (requiere paquete anthropic)
pip install anthropic
python -m anthropic.proxy --host 127.0.0.1 --port 8000
```

Luego configure Claudient para usar el punto final local:

```json
{
  "model": "claude-3-5-haiku-20241022",
  "apiUrl": "http://127.0.0.1:8000/v1"
}
```

**Opción B: Ollama o LLM local**

Para operación completamente offline, use un LLM local:

```bash
brew install ollama  # macOS
# o descargue de https://ollama.ai

ollama run llama2  # descargue y ejecute localmente
```

Configure Claude Code para usar Ollama:

```json
{
  "model": "llama2",
  "apiUrl": "http://127.0.0.1:11434/v1"
}
```

**Compromiso:** Los modelos locales tienen calidad reducida en comparación con Claude 3.5, pero habilitan la operación completamente offline.

### 2. Configuración MCP offline

Deshabilite los MCPs externos y registre solo servidores locales:

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

Variable de entorno para deshabilitar todos los MCPs externos:

```bash
export DISABLE_EXTERNAL_MCP=true
export MCP_SERVERS=filesystem,git  # lista separada por comas
```

### 3. Clonar Claudient localmente

Descargue el repositorio completo de Claudient para acceso offline:

```bash
git clone https://github.com/tushar2704/Claudient.git /opt/claudient
export CLAUDIENT_PATH=/opt/claudient

# Verificar acceso offline
ls /opt/claudient/guides/offline-local-first.md
```

Apunte Claude Code a Claudient local:

```bash
--project /opt/claudient
```

### 4. Respuestas API en caché

Si necesita acceso a Internet una sola vez, caché respuestas para uso offline:

```bash
# Antes de desconectar: obtener y cachear
claude --project . --cache-responses=true \
  "Generate all patterns for {backend,devops,data-ml}/*.md"

# Desconectarse con conocimiento en caché
claude --offline-only --project .
```

---

## Configuración de stack local-first offline

### Usar un stack offline

Ejemplo: **Backend Engineer Stack (Completamente offline)**

```bash
# Asegúrese de que solo los MCPs seguros para offline estén habilitados
export DISABLE_EXTERNAL_MCP=true
export MCP_SERVERS=filesystem,git

# Cargar el stack
claude --stack backend \
       --project /opt/claudient \
       "Build a Go API server with tests and Docker image"
```

Todas las habilidades en el stack `backend` funcionan sin llamadas externas:
- `golang` — compilador local
- `dockerfile` — compilación de contenedor local
- `testing` — framework de testing local
- `postgres` — instancia de base de datos local

### Lista de verificación de validación offline

Antes de declarar un stack "offline-ready", ejecute:

```markdown
- [ ] Todos los servidores MCP son locales (filesystem, git, localhost-bound)
- [ ] Sin llamadas API a servicios externos (Claude, plataformas en la nube, SaaS)
- [ ] Sin descargas de paquetes (todas las dependencias en caché localmente)
- [ ] Sin web scraping o URL fetching
- [ ] Todos los comandos pueden ejecutarse con `DISABLE_EXTERNAL_MCP=true`
- [ ] CLAUDE.md enumera claramente las dependencias externas
```

---

## Patrones de respaldo para baja conectividad

Cuando la red es intermitente o poco confiable:

### 1. Reintento con backoff exponencial

```bash
# .claude/hooks/mcp-retry.sh
for attempt in {1..5}; do
  timeout 5 mcp-call "$@" && exit 0
  sleep $((2 ** attempt))
done
exit 1
```

### 2. Búsqueda en caché primero

```bash
# Verificar caché local antes de hacer llamada API
if [[ -f ~/.claude/cache/$QUERY_HASH ]]; then
  cat ~/.claude/cache/$QUERY_HASH
else
  # Hacer llamada y cachear
  result=$(mcp-call "$@")
  echo "$result" > ~/.claude/cache/$QUERY_HASH
  echo "$result"
fi
```

### 3. Degradación elegante

Las habilidades seguras offline deben detectar MCP no disponible y proporcionar respaldo:

```markdown
# Ejemplo: AWS Architect Skill

## Cuándo activar
- Diseñar arquitectura AWS

## Cuándo no usar
- Sin internet y sin credenciales AWS disponibles
- Respaldo: usar plantillas CloudFormation del caché local

## Instrucciones

### Modo offline
Si API de AWS no está disponible, use plantillas CloudFormation pregeneradas:

\`\`\`bash
if ! aws ec2 describe-instances &>/dev/null; then
  echo "AWS API unavailable. Using cached templates."
  cat /opt/claudient/cache/cf-templates/*.json
fi
\`\`\`
```

### 4. Operaciones por lotes durante ventanas en línea

Recopile trabajo offline y sincronice cuando la red está disponible:

```bash
# Offline: poner en cola comandos
echo "claude --stack backend 'implement feature X'" >> ~/.claude/queue.txt
echo "claude --stack devops 'deploy to staging'" >> ~/.claude/queue.txt

# Cuando está en línea: vaciar cola
while read cmd; do
  eval "$cmd"
done < ~/.claude/queue.txt
rm ~/.claude/queue.txt
```

---

## Detección de red y respaldo automático

### Detectar disponibilidad de red

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

Hook para ejecutar en el inicio:

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

### Stack de selección automática basado en conectividad

```bash
#!/bin/bash
# Seleccionar stack seguro para offline si no hay red

if [[ "$NETWORK_AVAILABLE" == "false" ]]; then
  STACK="backend"  # predeterminado seguro para offline
else
  STACK="gtm"  # requiere red
fi

claude --stack "$STACK" "$@"
```

---

## Stacks seguros offline — Referencia rápida

| Stack | ¿Offline? | Notas |
|---|---|---|
| **Backend (Go, Rust, C++)** | ✅ Completo | Requiere compilador local; sin implementación en la nube |
| **Data/ML** | ✅ Completo | Solo entrenamiento local; sin inferencia en la nube |
| **DevOps/Infra** | ⚠️ Parcial | IaC funciona offline; la implementación en la nube requiere API |
| **Frontend** | ✅ Completo | Compilación y testing locales; generación SSG |
| **Database** | ✅ Completo | Requiere instancia local en ejecución |
| **Productivity** | ✅ Completo | Automatización local, scripts shell |
| **Git** | ✅ Completo | Solo control de versiones local |
| **Computer Use** | ✅ Completo | Automatización de UI local |
| **Finance** | ❌ Ninguno | Requiere APIs bancarias/de mercado |
| **GTM/Growth** | ❌ Ninguno | Requiere APIs de análisis, datos de mercado |
| **Legal/Compliance** | ❌ Ninguno | Requiere bases de datos normativas |
| **AI-Engineering** | ⚠️ Parcial | Solo modelos locales; inferencia en la nube no disponible |

---

## Estructura de documentación offline

Cuando trabaje offline, navegue la estructura de documentación de Claudient:

```
/opt/claudient
├── guides/offline-local-first.md       ← Está aquí
├── enterprise/AIR_GAP.md               ← Guía de implementación
├── skills/devops-infra/air-gap-deployment.md
├── workflows/offline-validation.md
├── agents/roles/offline-validator.md
├── guides/                             ← Todos los documentos legibles por humanos
├── skills/                             ← Todos los patrones de habilidad
├── agents/                             ← Todas las definiciones de agente
└── workflows/                          ← Todos los patrones de flujo de trabajo
```

Lea desde `/opt/claudient` (no desde git remoto) cuando esté offline.

---

## Solución de problemas del modo offline

### Síntoma: "MCP server not responding"

```bash
# Verificar si MCP local se está ejecutando
lsof -i :8000  # si usa proxy local

# Forzar modo offline
export DISABLE_EXTERNAL_MCP=true
export OFFLINE_MODE=true
claude --project /opt/claudient "test query"
```

### Síntoma: "API key not found"

Cuando está offline, Claude Code no puede acceder a la API de Anthropic. Use el modelo local:

```bash
# Use Ollama en su lugar
export MODEL=llama2
export API_URL=http://127.0.0.1:11434/v1
claude "test query"
```

### Síntoma: "Package not found"

Si npm/pip intenta obtener del registro remoto:

```bash
# Use solo caché local
npm ci --prefer-offline --no-audit
pip install --no-index --find-links ./cache -r requirements.txt
```

---

## Resumen

**Principios local-first offline para Claudient:**

1. **Dependencias local-first** — cachear todo; la red es opcional
2. **Degradación elegante** — detectar MCP no disponible; proporcionar respaldos
3. **El sistema de archivos y git son sus amigos** — funcionan sin red
4. **Stacks seguros offline** — backend, data/ML, devops (parcial), frontend, database, productividad
5. **Stacks dependientes de red** — GTM, finance, legal, AI-engineering (parcial)
6. **Servicio de modelo local** — Ollama, proxies Claude locales para Claude offline
7. **Documentación como respaldo** — todo CLAUDE.md, guías y patrones son accesibles offline

**Para implementaciones empresariales**, ver `enterprise/AIR_GAP.md`.

**Para flujos de trabajo de validación**, ver `workflows/offline-validation.md`.

**Para implementación air-gap detallada**, ver `skills/devops-infra/air-gap-deployment.md`.
