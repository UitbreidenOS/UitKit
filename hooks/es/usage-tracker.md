# Hook: Rastreador de uso

Registra cada invocación de herramienta de Claude Code en `.claude/usage-log.jsonl` para recopilación de métricas de DX, seguimiento de adopción y medición de efectividad de habilidades.

## Evento

`PostToolUse` — se activa inmediatamente después de cualquier llamada de herramienta (Bash, Read, Write, WebSearch, llamadas API, etc.)

## entrada settings.json

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/usage-tracker.sh",
            "async": true
          }
        ]
      }
    ]
  },
  "dx": {
    "tracking_enabled": true,
    "usage_log_file": "${CLAUDE_PROJECT_DIR}/.claude/usage-log.jsonl",
    "rotation_size_mb": 50,
    "retention_days": 90
  }
}
```

## Qué hace

Agrega una línea JSON a `.claude/usage-log.jsonl` para cada llamada de herramienta, capturando:

- **Marca de tiempo** (ISO 8601 UTC)
- **ID de sesión** y usuario
- **Nombre de habilidad** (analizado del contexto, si está disponible)
- **Herramienta llamada** (Bash, Read, Write, WebSearch, etc.)
- **Duración** (milisegundos)
- **Éxito** (código de salida 0 = verdadero)
- **Metadatos específicos de la herramienta** (comando, ruta de archivo, consulta, etc.)

Registro de ejemplo:

```json
{
  "timestamp": "2026-06-15T14:32:15.234Z",
  "session_id": "sess_abc123",
  "user_id": "alice@company.com",
  "skill_name": "code-review",
  "tool_called": "Bash",
  "tool_input_summary": "git diff --name-only",
  "duration_ms": 2847,
  "exit_code": 0,
  "success": true,
  "invocation_num": 3,
  "retry_count": 0,
  "metadata": {
    "project_dir": "/Users/alice/myapp",
    "git_branch": "feature/auth",
    "model": "haiku-4.5"
  }
}
```

## Características

- **Ligero**: El registro asincrónico no bloquea la ejecución de Claude Code
- **Respetuoso de la privacidad**: Registra resúmenes de comandos, no entradas completamente sensibles
- **Seguimiento de adopción**: Vincula llamadas de herramienta a habilidades para análisis /dx-metrics
- **Sobrecarga mínima**: ~10ms por entrada de registro, escrituras por lotes
- **Rotación automática**: Mueve registros antiguos a `.jsonl.1`, `.jsonl.2` cuando > 50MB
- **Política de retención**: Elimina automáticamente registros más antiguos que 90 días
- **Seguimiento de sesión**: Todas las llamadas en una sesión comparten una session_id para correlación
- **Detección de reintento**: Cuenta llamadas repetidas a la misma herramienta dentro de 30 segundos

## Configuración

```bash
# Copiar script de hook al proyecto
cp hooks/usage-tracker.sh .claude/hooks/
chmod +x .claude/hooks/usage-tracker.sh

# Crear directorio de registro
mkdir -p .claude
touch .claude/usage-log.jsonl

# Agregar a .gitignore (los registros de uso contienen metadatos, no secretos)
echo ".claude/usage-log.jsonl*" >> .gitignore
echo ".claude/dx-scorecard*.json" >> .gitignore
echo ".claude/session-log*.md" >> .gitignore

# Verificar en settings.json (agregar arriba de la entrada de hooks)
cat >> .claude/settings.json << 'EOF'
  "dx": {
    "tracking_enabled": true,
    "usage_log_file": "${CLAUDE_PROJECT_DIR}/.claude/usage-log.jsonl",
    "rotation_size_mb": 50,
    "retention_days": 90
  }
EOF
```

## Ejemplos de consulta

**Enumere todas las llamadas de herramienta en una sesión**:
```bash
jq 'select(.session_id == "sess_abc123")' .claude/usage-log.jsonl
```

**Contar invocaciones de habilidades (para /dx-metrics)**:
```bash
jq -s 'group_by(.skill_name) | map({skill: .[0].skill_name, count: length})' \
  .claude/usage-log.jsonl
```

**Buscar errores**:
```bash
jq 'select(.success == false)' .claude/usage-log.jsonl | jq -s 'length'
```

**Calcular duración promedio por herramienta**:
```bash
jq -s 'group_by(.tool_called) | map({tool: .[0].tool_called, avg_ms: (map(.duration_ms) | add / length)})' \
  .claude/usage-log.jsonl
```

**Buscar operaciones lentas** (> 30 segundos):
```bash
jq 'select(.duration_ms > 30000) | {timestamp, tool_called, duration_ms}' \
  .claude/usage-log.jsonl | head -10
```

**Detectar bucles de reintento** (la misma herramienta llamada 3+ veces en 60 segundos):
```bash
jq -s '[.[] | select(.retry_count > 0)]' .claude/usage-log.jsonl
```

## Integración con /dx-metrics

El hook de rastreador de uso alimenta datos sin procesar a `/dx-metrics`, que agrega para puntuación de DX:

```
[Invocación de herramienta]
  ↓
[Hook PostToolUse]
  ↓
[usage-tracker.sh agrega a .claude/usage-log.jsonl]
  ↓
[/dx-metrics lee usage-log.jsonl]
  ↓
[Genera .claude/dx-scorecard.json (invocaciones, tasa de éxito, tiempo ahorrado, etc.)]
```

## Detección del nombre de habilidad

El hook intenta deducir `skill_name` del contexto:

1. Verifique la variable de entorno `CLAUDE_ACTIVE_SKILL` (establecida si se ejecuta dentro de una habilidad)
2. Analizar metadatos de sesión para comando `/skill-name` en ejecución
3. Deducir de la secuencia de herramientas (por ejemplo, si Bash + Read + Write en secuencia, probablemente habilidad tipo code-review)
4. Fallback: `skill_name = "manual"` (usuario ejecutando herramientas directamente)

Para mejores resultados, las habilidades deben establecer `CLAUDE_ACTIVE_SKILL` cuando se invocan:

```bash
# Dentro de una habilidad (por ejemplo, skills/productivity/code-review.md)
export CLAUDE_ACTIVE_SKILL="code-review"
# ... las instrucciones de habilidad siguen
```

## Ajuste de rendimiento

Si el registro impacta la responsividad:

1. **Aumentar tamaño de rotación** para agrupar menos rotaciones de registro:
   ```json
   "rotation_size_mb": 100
   ```

2. **Disminuir retención** para reducir uso de disco:
   ```json
   "retention_days": 30
   ```

3. **Deshabilitar temporalmente** (durante cálculos intensivos):
   ```bash
   export DX_TRACKING_DISABLED=1
   ```

4. **Registros de muestra** (registrar cada Nésima llamada) — editar usage-tracker.sh:
   ```bash
   SAMPLE_RATE=10  # Registrar 1 de 10 llamadas
   [ $((RANDOM % SAMPLE_RATE)) -ne 0 ] && exit 0
   ```

## Gobernanza de datos

- **Propiedad**: Equipo del proyecto / líder de DX
- **Acceso**: Los usuarios pueden consultar `.claude/usage-log.jsonl` localmente; sin carga a la nube
- **Anonimización**: Eliminar user_id antes de compartir informes (opcional):
  ```bash
  jq 'del(.user_id)' .claude/usage-log.jsonl > usage-log-anon.jsonl
  ```
- **Retención**: Eliminar automáticamente después de 90 días (configurable)
- **Opción de exclusión**: Establecer `DX_TRACKING_DISABLED=1` para omitir registro

## Solución de problemas

**No se escriben registros**:
- Verifique que el hook esté habilitado en `.claude/settings.json`
- Verifique los permisos del archivo `.claude/usage-log.jsonl`: `ls -la .claude/`
- Prueba de ejecución: `echo '{"test": 1}' | bash .claude/hooks/usage-tracker.sh`

**Los registros crecen demasiado rápido**:
- Aumentar `rotation_size_mb` o disminuir `retention_days`
- Verifique que el hook sea realmente asincrónico (no debe bloquear Claude Code)

**Nombre de habilidad faltante**:
- Envolver código de habilidad con `export CLAUDE_ACTIVE_SKILL="skill-name"`
- O agregar nombre de habilidad al contexto `.claude/settings.json`

---
