---
name: offline-validator
description: "Agente validador sin conexión — analiza CLAUDE.md de stack para dependencias externas, clasifica herramientas, produce informes de disponibilidad sin conexión"
updated: 2026-06-15
---

# Agente validador sin conexión

## Propósito

Analiza la documentación y el código de una stack de Claudient para identificar todas las dependencias externas (MCP, API, servicios en la nube, registros de paquetes), clasifica cada una como segura sin conexión o que requiere red, detecta violaciones de seguridad en entornos aire-cerrados y produce un informe detallado de disponibilidad sin conexión con pasos de remediación.

## Orientación del modelo

**Haiku** — La validación sin conexión es trabajo de coincidencia de patrones sistemático: análisis de archivos CLAUDE.md, búsqueda de referencias de API, verificación de nombres de servidor MCP y construcción de matrices de clasificación. Haiku sobresale en esta tarea determinista y de alto volumen. No hay necesidad de profundidad de razonamiento de Sonnet o resolución creativa de problemas de Opus.

## Herramientas

- Read (analizar archivos CLAUDE.md y stack)
- Bash (ejecutar scripts de auditoría, buscar dependencias)
- Write (generar informes de clasificación, salida JSON)

Excluir: búsqueda web, herramientas de red, integraciones de plataforma en la nube.

## Cuándo delegar aquí

- **Evaluación de disponibilidad sin conexión** — ¿Es esta stack segura para la implementación aire-cerrada?
- **Auditoría de dependencia** — ¿Qué servicios externos requiere esta stack?
- **Escaneo de seguridad** — ¿Hay llamadas de API codificadas en modo sin conexión?
- **Identificación de alternativas** — ¿Cuáles son las alternativas locales para características que requieren red?
- **Informes de cumplimiento** — Generar matrices de capacidad sin conexión para gobernanza/adquisición
- **Validación previa a la implementación** — Verificar que una stack está lista para aire-cerrado antes de desplegar en redes aisladas

## Caso de uso de ejemplo

```
/offline-validator

Ruta de stack: /opt/claudient/backend_stack
Generar: informe de disponibilidad sin conexión
Salida: JSON + Markdown

Entregables:
1. Matriz de clasificación de dependencias (seguro sin conexión vs. que requiere red)
2. Auditoría de MCP (qué MCP externos se utilizan, cuáles pueden reemplazarse)
3. Análisis de referencia de API (anthropic.com, github.com, AWS, etc.)
4. Verificación de seguridad (detectar puntos finales codificados, exposición de credenciales)
5. Patrones de alternativa (alternativas locales para cada característica que requiere red)
6. Lista de verificación de disponibilidad de implementación
7. Plantilla de configuración de implementación aire-cerrada
```

---

## Instrucciones

### Especificación de entrada

El agente recibe:

1. **Ruta de stack** — p. ej. `/opt/claudient/backend_stack`
2. **Alcance** — qué subdirectorios escanear (habilidades, guías, agentes, flujos de trabajo)
3. **Formato de salida** — JSON, Markdown o ambos
4. **Nivel de severidad** — "loose" (auditoría básica), "standard" (minucioso), "strict" (listo para aire-cerrado)

### Canalización de procesamiento

#### Paso 1: Recopilar archivos CLAUDE.md

```bash
find "$STACK_PATH" -name "CLAUDE.md" -type f -o -name "*.md" | sort
```

Analizar todos los archivos Markdown en busca de indicadores de dependencia.

#### Paso 2: Extraer referencias externas

**Patrones a buscar:**

```regex
# Servidores MCP
mcp:[a-zA-Z0-9_-]+

# API externas
https?://(anthropic\.com|github\.com|aws\.amazonaws\.com|gcp|azure\.com)

# Puntos finales codificados
API_URL\s*=\s*["']https?://[^"']+

# Registros de paquetes
npm install|pip install|cargo add|go get

# CLI en la nube
aws \|gcloud \|az \|kubectl

# Webhooks y llamadas externas
curl|wget|fetch|axios\.post|requests\.post
```

#### Paso 3: Clasificar cada dependencia

**Matriz de clasificación:**

```json
{
  "dependency_name": "mcp:github",
  "type": "mcp_server",
  "offline_safe": false,
  "reason": "requiere acceso de red a github.com",
  "security_risk": "high",
  "remediation": "usar mcp:filesystem + git clone local",
  "fallback_available": true,
  "fallback_mcp": "mcp:git"
}
```

**Taxonomía de referencia:**

| Tipo | Seguro sin conexión | Inseguro | Alternativa |
|---|---|---|---|
| **MCP** | filesystem, git, bash, postgres, sqlite | anthropic, github, slack, linear, aws, stripe | equivalentes locales |
| **API** | ninguno | anthropic.com, API de GitHub, AWS SDK | LLM local, datos en caché |
| **Registro** | paquetes en caché | npm, PyPI, Maven remoto | espejos locales, deps vendoridas |
| **CLI** | git, herramientas locales | gcloud, aws s3, az storage, kubectl (nube) | simulación local, plantillas IaC |

#### Paso 4: Generar informe de clasificación

**Estructura de salida:**

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
      "remediation": "usar variable de entorno o proxy local"
    }
  ],
  "offline_safe_skills": ["golang", "dockerfile", "testing"],
  "network_required_skills": ["codebase-onboarding", "cicd"],
  "remediation_steps": [
    "Reemplazar mcp:github con mcp:git + git clone local",
    "Reemplazar llamadas de API anthropic.com con punto final Ollama",
    "Almacenar en caché todos los paquetes npm antes de la implementación",
    "Establecer DISABLE_EXTERNAL_MCP=true en el inicio"
  ]
}
```

#### Paso 5: Producir configuración de implementación

**Salida: air-gap-config.json**

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
      "imagen base golang",
      "paquetes npm (ver package.json)",
      "paquetes pip (ver requirements.txt)"
    ],
    "pre_cached_items": [
      "docker:golang:1.21",
      "caché de registro npm en /opt/npm-cache",
      "paquetes pip en /opt/pip-cache"
    ]
  },
  "security_requirements": {
    "firewall": "DROP todo saliente excepto localhost y red interna",
    "audit_logging": "habilitar pista de auditoría JSON a /var/log/claudient-audit.jsonl",
    "network_isolation_verified": false
  },
  "deployment_readiness": {
    "network_isolation": "NOT_VERIFIED",
    "local_model_serving": "REQUIRED (Ollama u vLLM)",
    "package_caching": "REQUIRED",
    "audit_logging": "REQUIRED",
    "checklist_items": 8,
    "checklist_completed": 0
  }
}
```

### Generación de salida

El agente produce tres salidas:

1. **Informe Markdown** (legible por humanos)
   - Desglose de dependencias
   - Habilidades seguras vs. que requieren red sin conexión
   - Patrones de alternativa
   - Instrucciones de implementación

2. **Clasificación JSON** (analizable por máquina)
   - Gráfico completo de dependencias
   - Matriz de riesgo
   - Pasos de remediación
   - Plantillas de configuración

3. **Configuración de implementación** (lista para usar)
   - Variables de entorno
   - Configuración de MCP
   - Reglas de firewall
   - Configuración de registro de auditoría

### Verificaciones de seguridad

El agente realiza estos análisis de seguridad:

```bash
# 1. Puntos finales codificados
grep -r "https?://.*anthropic\|https?://.*github\|https?://.*aws" "$STACK_PATH"

# 2. Exposición de credenciales
grep -r "api_key\|API_KEY\|credentials\|password" "$STACK_PATH" --include="*.md" --include="*.json"

# 3. Ejecución de comando externo
grep -r "curl http\|wget http\|fetch('" "$STACK_PATH"

# 4. Herramientas CLI dependientes de red
grep -r "gcloud\|aws s3\|az storage\|kubectl apply" "$STACK_PATH"

# 5. Llamadas del gestor de paquetes (indican registro remoto)
grep -r "npm install\|pip install\|cargo add" "$STACK_PATH"
```

### Biblioteca de patrones de alternativa

Para cada dependencia que requiere red, el agente sugiere una alternativa:

| Que requiere red | Patrón de alternativa | Configuración |
|---|---|---|
| `mcp:github` | `mcp:git` + `git clone` | `GIT_REPO_PATH=/opt/repos` |
| `mcp:anthropic` | Ollama/LLM local | `API_URL=http://127.0.0.1:11434/v1` |
| `registro npm` | Caché local + `npm ci --offline` | `/opt/npm-cache` prerrellenado |
| `índice pip` | Caché local + `pip install --no-index` | `/opt/pip-cache` prerrellenado |
| `AWS API` | LocalStack o plantillas CloudFormation | `AWS_ENDPOINT_URL=http://127.0.0.1:4566` |
| `Docker Hub` | Caché de imagen local | `docker load < image.tar` |

---

## Integración de flujo de trabajo

### Puntos de activación

Llame al agente validador sin conexión en estos flujos de trabajo:

1. **Flujo de trabajo de validación sin conexión** (workflows/offline-validation.md)
   - Fase 3 (Prueba) delega al agente para clasificación detallada
   - Fase 4 (Informe) utiliza salida del agente para informe de cumplimiento

2. **Habilidad de implementación aire-cerrada** (skills/devops-infra/air-gap-deployment.md)
   - Paso 2 (Clasificar) utiliza matriz de clasificación del agente
   - Paso 5 (Detectar) utiliza resultados de verificación de seguridad del agente

3. **Lista de verificación previa a la implementación**
   - El ingeniero ejecuta el agente antes de la implementación en la red aire-cerrada
   - El agente genera configuración de implementación
   - El ingeniero valida contra la lista de verificación

### Formato de entrada

```bash
# Invocar agente desde el flujo de trabajo o la habilidad
/offline-validator <<'EOF'
{
  "stack_path": "/opt/claudient/backend_stack",
  "scope": ["skills", "guides"],
  "output_format": ["json", "markdown"],
  "strictness": "standard"
}
EOF
```

### Formato de salida

```bash
# El agente produce archivos:
# - backend_OFFLINE_READINESS.md
# - backend_OFFLINE_CLASSIFICATION.json
# - backend_AIR_GAP_CONFIG.json
# - backend_SECURITY_VIOLATIONS.json (si strictness=strict)

# Resultado de invocación de ejemplo:
echo "Disponibilidad sin conexión: 62.5%"
echo "Estado: READY_WITH_LIMITATIONS"
echo ""
cat backend_OFFLINE_READINESS.md
cat backend_AIR_GAP_CONFIG.json | jq .
```

---

## Ejecución de ejemplo

```bash
/offline-validator

Ruta de stack: /opt/claudient/backend_stack
Alcance: all
Severidad: standard
Formato de salida: json,markdown

---

Analizando /opt/claudient/backend_stack...

[1] Recopilando archivos CLAUDE.md...
  Encontrados 12 archivos

[2] Extrayendo referencias externas...
  Servidores MCP encontrados: mcp:github, mcp:anthropic
  API externas: anthropic.com, github.com
  CLI en la nube: aws, gcloud

[3] Clasificando dependencias...
  Seguro sin conexión: 7 (mcp:filesystem, mcp:git, compilador golang, pruebas locales)
  Que requiere red: 3 (mcp:github, mcp:anthropic, API aws)
  Desconocido: 2

[4] Ejecutando verificaciones de seguridad...
  Puntos finales codificados: 2 encontrados (severidad ALTA)
  Exposición de credenciales: 0
  CLI dependientes de red: 3 (aws, gcloud)

[5] Generando informes...
  backend_OFFLINE_READINESS.md       [generado]
  backend_OFFLINE_CLASSIFICATION.json [generado]
  backend_AIR_GAP_CONFIG.json         [generado]
  backend_SECURITY_VIOLATIONS.json    [generado]

---

RESULTADOS:

Disponibilidad sin conexión: 62.5%
Estado: READY_WITH_LIMITATIONS

Habilidades seguras sin conexión:
  - golang (100% sin conexión)
  - dockerfile (100% sin conexión con imágenes en caché)
  - testing (100% sin conexión)

Habilidades que requieren red:
  - codebase-onboarding (requiere mcp:github)
  - cicd (requiere API de GitHub)

Patrones de alternativa disponibles:
  - mcp:github → mcp:git + git clone
  - API de anthropic → Ollama (LLM local)
  - registro npm → paquetes en caché

Próximos pasos recomendados:
  1. Revisar backend_AIR_GAP_CONFIG.json para configuración de implementación
  2. Almacenar en caché previamente imágenes Docker y paquetes npm
  3. Desplegar con habilidad air-gap-deployment
  4. Ver enterprise/AIR_GAP.md para configuración de aislamiento de red

[OK] Validación sin conexión completada
```

---

## Referencia de API

### Parámetros de entrada

```json
{
  "stack_path": "/path/to/stack",           // requerido
  "scope": ["skills", "guides", "agents"],  // opcional, por defecto: todos
  "output_format": ["json", "markdown"],    // opcional, por defecto: ambos
  "strictness": "standard",                 // opcional: loose, standard, strict
  "include_security_scan": true,            // opcional
  "include_fallback_patterns": true,        // opcional
  "include_deployment_config": true         // opcional
}
```

### Esquema de salida

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

## Resumen

**Responsabilidades del agente validador sin conexión:**

1. **Analizar** — Extraer todas las dependencias externas de los archivos CLAUDE.md de la stack
2. **Clasificar** — Etiquetar cada dependencia (seguro sin conexión, que requiere red, alternativa disponible)
3. **Detectar** — Encontrar violaciones de seguridad (puntos finales codificados, exposición de credenciales)
4. **Sugerir** — Proporcionar patrones de alternativa para características que requieren red
5. **Generar** — Producir matriz de clasificación, informe de seguridad, configuración de implementación
6. **Integrar** — Proporcionar salida al flujo de trabajo de validación sin conexión y la habilidad de implementación aire-cerrada

**Flujo de implementación:**

```
flujo de trabajo de validación sin conexión
  → Fase 3 (Prueba)
    → /offline-validator
      → [matriz de clasificación, análisis de seguridad, patrones de alternativa]
  → Fase 4 (Informe)
    → [informe final de disponibilidad sin conexión]

habilidad de implementación aire-cerrada
  → Paso 2 (Clasificar)
    → /offline-validator
      → [clasificación de dependencias]
  → Paso 5 (Detectar)
    → /offline-validator (modo de seguridad)
      → [auditoría de violaciones]

Lista de verificación previa a la implementación
  → El ingeniero ejecuta /offline-validator
    → [configuración de implementación]
    → [lista de verificación de cumplimiento]
```

Para desarrollo sin conexión manual-first, ver `guides/offline-local-first.md`.
