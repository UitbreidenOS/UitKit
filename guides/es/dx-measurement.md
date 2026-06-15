# Guía de medición de experiencia del desarrollador

Medir la experiencia del desarrollador (DX) en la adopción de Claude Code requiere recopilación sistemática, agregación y análisis del uso de habilidades, patrones de sesión y efectividad de características. Esta guía define el marco de métricas DX y patrones de instrumentación.

---

## Por qué medir DX

- **Validación de adopción**: ¿Realmente los usuarios descubren e invocan habilidades publicadas?
- **ROI de características**: ¿Qué habilidades ahorran tiempo, reducen errores o desbloquean flujos de trabajo?
- **Detección de cuellos de botella**: Identifique puntos de fricción (habilidades lentas, docs confusos, integraciones faltantes)
- **Mejora iterativa**: Cuantifique el impacto de actualizaciones de habilidades, guías nuevas o cambios de flujo de trabajo
- **Apoyo de caso empresarial**: Demuestre el valor de la inversión de Claude Code a las partes interesadas

---

## Esquema de métricas

### Métricas principales

| Métrica | Definición | Unidad | Recopilación |
|---|---|---|---|
| `invocations` | Número de veces que se llamó una habilidad en una sesión/período | count | Hook PostToolUse |
| `success_rate` | % de invocaciones de habilidad que se completaron sin error | % (0–100) | PostToolUse + código de salida de herramienta |
| `avg_duration_sec` | Tiempo de ejecución promedio por invocación de habilidad | segundos | Par de marca de tiempo PostToolUse |
| `time_saved_min` | Tiempo estimado ahorrado vs. ejecución manual (reportado por usuario o deducido) | minutos | Metadatos de sesión + heurística |
| `error_rate` | % de invocaciones que resultan en error, timeout o reintento del usuario | % (0–100) | Estado de salida PostToolUse |
| `user_count` | Usuarios distintos que invocan la habilidad | count | Agregación de ID de sesión |
| `adoption_tier` | Clasificación: `abandoned` (<5 invocaciones), `low` (5–50), `active` (50–500), `core` (>500) | category | Invocaciones agregadas |

### Métricas derivadas

| Métrica | Fórmula | Interpretación |
|---|---|---|
| **DX Score** | `(success_rate * 0.4) + (adoption_tier_score * 0.3) + (time_saved_relevance * 0.3)` | 0–100: salud general |
| **Productivity Multiplier** | `total_time_saved_per_user / avg_session_duration` | Horas ahorradas por hora de uso de Claude Code |
| **Friction Index** | `error_rate + (100 - success_rate)` | 0–200: más bajo es mejor |

### Atributos a nivel de sesión

Rastrear en `.claude/session-log.md` (creado al iniciar sesión, agregado con resumen al final):

```markdown
## Resumen de sesión — 2026-06-15T14:30:00Z

**Usuario**: alice@company.com
**Duración**: 47 minutos
**Habilidades invocadas**: code-review, simplify, deep-research
**Total de llamadas de herramienta**: 18
**Errores**: 1 (timeout deep-research en 3er intento, reintentado con éxito)
**Tiempo ahorrado**: ~60 minutos (correcciones automáticas code-review + simplify ahorran refactorización manual)
**Blocker**: Ninguno
**Feedback**: "deep-research debería cachear resultados de búsqueda entre reintentos"
```

---

## Patrones de instrumentación

### 1. Hook PostToolUse (Registro en tiempo real)

Cada invocación de herramienta registra en `.claude/usage-log.jsonl`:

```json
{
  "timestamp": "2026-06-15T14:32:15.234Z",
  "session_id": "sess_7f8a9b2c",
  "user_id": "alice@company.com",
  "skill_name": "code-review",
  "tool_called": "Bash",
  "invocation_num": 3,
  "duration_ms": 2847,
  "exit_code": 0,
  "success": true,
  "tool_output_length": 1247,
  "retry_count": 0
}
```

Ver `hooks/usage-tracker.md` para implementación.

### 2. Session Log (Resumen de fin de sesión)

Cree `.claude/session-log.md` al iniciar sesión, agregue resumen al final:

```bash
# Inicializar al iniciar sesión
cat >> .claude/session-log.md << EOF
## Session Summary — $(date -u +"%Y-%m-%dT%H:%M:%SZ")

**User**: $USER
**Skills**: [se actualizará al final]
**Duration**: [se calculará]
**Errors**: [se contarán]

---
EOF
```

Al final de la sesión, analice `usage-log.jsonl` para agregar y anexar:

```json
{
  "session_id": "sess_7f8a9b2c",
  "user_id": "alice@company.com",
  "start_time": "2026-06-15T13:45:00Z",
  "end_time": "2026-06-15T14:32:47Z",
  "duration_minutes": 47,
  "skills_invoked": ["code-review", "simplify", "deep-research"],
  "total_invocations": 18,
  "total_errors": 1,
  "estimated_time_saved_min": 60,
  "sentiment": "positive"
}
```

### 3. Agregación semanal/mensual

Ejecute `/dx-metrics aggregate` (o agente `dx-analyst`) para producir `.claude/dx-scorecard.json`:

```json
{
  "period": "2026-06-08T00:00:00Z/2026-06-15T00:00:00Z",
  "metrics": {
    "code-review": {
      "invocations": 47,
      "success_rate": 97.9,
      "avg_duration_sec": 18.3,
      "error_rate": 2.1,
      "user_count": 12,
      "adoption_tier": "active",
      "time_saved_min": 891
    },
    "simplify": {
      "invocations": 31,
      "success_rate": 100,
      "avg_duration_sec": 12.1,
      "error_rate": 0,
      "user_count": 9,
      "adoption_tier": "active",
      "time_saved_min": 403
    },
    "deep-research": {
      "invocations": 8,
      "success_rate": 75.0,
      "avg_duration_sec": 45.7,
      "error_rate": 25.0,
      "user_count": 4,
      "adoption_tier": "low",
      "time_saved_min": 180
    }
  },
  "summary": {
    "total_users": 22,
    "avg_dx_score": 81.4,
    "total_time_saved_hours": 28.2,
    "friction_index": 12.3,
    "top_skill": "code-review",
    "lowest_adoption": "deep-research",
    "recommended_actions": [
      "Improve deep-research retry/caching to reduce 25% error rate",
      "Add session-log best practices guide (only 40% of sessions documented)"
    ]
  }
}
```

---

## Arquitectura de recopilación de datos

### Archivos generados

| Archivo | Propósito | Frecuencia | Retención |
|---|---|---|---|
| `.claude/usage-log.jsonl` | Registros de gancho sin procesar (solo adjuntar) | Por llamada de herramienta | 90 días |
| `.claude/session-log.md` | Resumen visible para el usuario (uno por sesión) | Por sesión | 30 días (acumulado) |
| `.claude/dx-scorecard.json` | Snapshot de métricas agregadas | Semanal/mensual | Indefinido |
| `.claude/dx-scorecard-history.jsonl` | Serie temporal de scorecards | Semanal/mensual | 2 años |

### Flujo de recopilación

```
[Invocación de herramienta] 
    ↓
[Se dispara el gancho PostToolUse]
    ↓
[usage-tracker.sh añade a usage-log.jsonl]
    ↓
[Termina sesión]
    ↓
[Se genera resumen de sesión]
    ↓
[Semanal: dx-analyst se agrega en dx-scorecard.json]
    ↓
[Mensual: se analizan tendencias, se proponen mejoras]
```

---

## Mejores prácticas

### Para usuarios (registro de sesión)

1. **Habilite el tracking de uso** en su proyecto `.claude/settings.json`:
   ```json
   {
     "hooks": {
       "PostToolUse": [{"type": "command", "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/usage-tracker.sh"}]
     }
   }
   ```

2. **Agregue feedback de sesión** al final de cada sesión:
   ```markdown
   ## Feedback

   - **Lo que funcionó**: code-review encontró 3 bugs críticos en el flujo de inicio de sesión
   - **Lo que fue lento**: timeout de deep-research en la 3ª búsqueda (necesita heurística de límite de reintento)
   - **Faltante**: Sin habilidad para validar el rendimiento de consultas SQL
   - **Tiempo ahorrado**: ~2 horas en refactorización vs. revisión de código manual
   ```

3. **Use nombres de habilidades consistentes** en consultas (verifique `/help` para nombres exactos)

### Para autores de habilidades

1. **Nombre habilidades para introspección**: Use nombres claros y de propósito único (p. ej., `code-review`, no `code-quality-plus`)
2. **Incluya consejos de tiempo en la salida**: "Se analizaron 412 líneas en 2.3 segundos"
3. **Reporte éxito/fracaso explícitamente**: Código de salida 0 = éxito; no cero = error (gancho captura esto)
4. **Documente duración esperada**: "Tiempo de ejecución típico: 30–120 segundos" ayuda a los usuarios a estimar ROI

### Para líderes de DX de organización

1. **Cadencia de revisión mensual**: Agregue métricas el primer lunes de cada mes
2. **Bucles de feedback del usuario**: Encueste a usuarios de habilidades trimestralmente sobre puntos de fricción
3. **Publique métricas**: Comparta `.claude/dx-scorecard.json` en el panel de equipo o wiki
4. **Actúe sobre cuellos de botella**: Si error_rate > 10%, investigue y proponga una corrección dentro de 2 semanas
5. **Celebre victorias**: Comparta totales de tiempo ahorrado y crecimiento de adopción en sincronizaciones de equipo

---

## Privacidad y gobernanza de datos

- **Anonimización de usuario**: Opción para agregar por rol/equipo en lugar de correo electrónico individual
- **Política de retención**: Elimine registros sin procesar después de 90 días; mantenga métricas agregadas indefinidamente
- **Optar por no participar**: Los usuarios pueden establecer `DX_TRACKING_DISABLED=1` para omitir el registro de gancho
- **Solo local por defecto**: `.claude/usage-log.jsonl` y `.claude/session-log.md` viven en el directorio del proyecto, nunca se cargan a menos que se configure explícitamente

---

## Ejemplos de integración

### Notificación de Slack (Resumen semanal)

Gancho en `.claude/settings.json` para publicar scorecard en Slack:

```json
{
  "hooks": {
    "SessionEnd": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL -d @.claude/dx-scorecard.json"
          }
        ]
      }
    ]
  }
}
```

### Problemas de GitHub (Seguimiento de cuellos de botella)

Auto-cree problemas de GitHub para habilidades con error_rate > 15%:

```bash
jq '.metrics[] | select(.error_rate > 15)' .claude/dx-scorecard.json | \
  while read skill; do
    gh issue create --title "High error rate: $(echo $skill | jq .name)" \
      --label "dx-bottleneck" \
      --body "Error rate: $(echo $skill | jq .error_rate)%"
  done
```

### Panel de control de Grafana

Exporte métricas de series de tiempo a Prometheus para visualización:

```bash
jq '.metrics | to_entries[] | {name: .key, value: .value.success_rate}' \
  .claude/dx-scorecard-history.jsonl | prometheus_remote_write
```

---

## Lista de verificación de medición

- [ ] Habilite el gancho `usage-tracker` en `.claude/settings.json`
- [ ] Cree plantilla `.claude/session-log.md`
- [ ] Programe revisión de DX semanal (o delegue al agente `dx-analyst`)
- [ ] Documente nombres de habilidades y duraciones esperadas en wiki de equipo
- [ ] Establezca umbales error_rate y adoption_tier para escalada
- [ ] Comparta scorecard mensual con el equipo
- [ ] Iterar: ajuste métricas basado en feedback

---
