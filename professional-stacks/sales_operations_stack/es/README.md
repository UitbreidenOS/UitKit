# Stack de Operaciones de Ventas

> Motor autónomo de ejecución de operaciones de ventas — análisis de pipeline, gestión de territorios, previsión de ventas, seguimiento de cuota, análisis de velocidad de acuerdos e inteligencia de ingresos para equipos de ventas de alto rendimiento.

---

## Inicio Rápido

1. **Copiar esta carpeta** en tu espacio de trabajo o proyecto de Claude Code.
2. **Configurar tu CRM** — Agregar credenciales de Salesforce o HubSpot a `settings.json` (ver `mcp/connections.md`).
3. **Revisar tu CLAUDE.md** — Personalizar dominios y restricciones de operaciones de ventas para tu negocio.
4. **Ejecutar `/analyze-pipeline`** — Obtener una instantánea de salud del pipeline en tiempo real con envejecimiento de acuerdos, tasas de conversión y acuerdos en riesgo.
5. **Ejecutar `/optimize-territory`** — Analizar balance de territorio, equidad de cuota y distribución de cuentas. Identificar brechas.
6. **Ejecutar `/build-forecast`** — Generar previsión móvil de 13 meses con escenarios de commit/mejor caso/alza.

---

## Qué hay dentro

| Archivo/Carpeta | Tipo | Propósito |
|---|---|---|
| `CLAUDE.md` | Config | Reglas del espacio de trabajo, objetivos de ventas, metodología de cuota, puntos de referencia de velocidad y barreras de desempeño. Comienza aquí. |
| `session-log.md` | Registro | Auto-actualizado con cada acción: previsiones generadas, análisis de velocidad, cambios de territorio, ajustes de cuota, señalizadores de coaching. |
| `skills/` | Directorio | 8 habilidades reutilizables para gestión de pipeline, planificación de cuota, previsión y análisis de desempeño. |
| `commands/` | Directorio | 3 comandos slash para flujos de trabajo comunes de operaciones de ventas. |
| `hooks/` | Directorio | 4 hooks automatizados para alertas en tiempo real y cumplimiento. |
| `mcp/` | Directorio | Configuraciones de Salesforce y HubSpot. |

---

## Habilidades (8)

| Habilidad | Activador | Herramientas Utilizadas | Propósito |
|---|---|---|---|
| `pipeline-forecaster` | `/forecast-pipeline` | API de Salesforce, WebSearch | Generar previsión trimestral, confianza por etapa, detección de cuellos de botella, puntuación de riesgo |
| `deal-velocity-analyzer` | `/analyze-velocity` | API de Salesforce, Exa | Rastrear tiempo de ciclo de acuerdos por rep/vertical, identificar acuerdos estancados, comparar con benchmark de la industria |
| `quota-planner` | `/plan-quota` | API de Salesforce, Read | Asignar cuota de arriba hacia abajo por territorio/vertical, ajustar para logro, planificar rampa para nuevas contrataciones |
| `sales-cycle-analyzer` | Diagnóstico | API de Salesforce, WebSearch | Analizar tamaño promedio de acuerdo, duración del ciclo, tasa de cierre por vertical/región; generar informe de tendencias |
| `territory-optimizer` | Estratégico | API de Salesforce, Read | Mapear cuentas a reps por región/vertical, calcular cobertura, señalizar objetivos de alto valor no asignados |
| `performance-auditor` | Cumplimiento | API de Salesforce, Exa | Auditar precisión de previsión, logro de cuota, salud de pipeline, señalizar mal pronóstico y fuga de cuota |
| `revenue-intelligence` | Estratégico | API de Salesforce, WebSearch, Exa | Exponer ganancias/pérdidas competitivas, patrones de expansión de clientes, riesgo de pérdida, cambios de mercado |
| `commission-modeler` | `/model-commission` | API de Salesforce, Read | Modelar pagos de comisión, planificar alineación de incentivos, calcular impacto de cambios de cuota |

---

## Comandos (3)

| Comando | Qué hace |
|---|---|
| `/forecast-pipeline` | Generar previsión trimestral a partir de datos de pipeline en vivo. Confianza por etapa, alertas de cuello de botella, metodología de previsión. Salida al registro de sesión. |
| `/analyze-velocity` | Rastrear tiempo de ciclo de acuerdos, tiempo de ciclo por rep, acuerdos estancados, velocidad vs. benchmark histórico. Generar informe. |
| `/optimize-territory` | Mapear cuentas de alto valor a capacidad de ventas disponible. Señalizar brechas de cobertura y sobreasignación. Recomendar realineamiento de territorio. |

---

## Hooks (4)

| Hook | Evento | Qué protege |
|---|---|---|
| `quota-alert` | PostToolUse | Señaliza cuando la previsión de rep cae >20% semana a semana o cae por debajo del umbral de cuota sin justificación |
| `velocity-warning` | PostToolUse | Alerta cuando un acuerdo está estancado (sin actividad >30 días) o el tiempo de ciclo excede el percentil 90 |
| `forecast-sync` | PostToolUse | Auto-valida los totales de previsión contra el pipeline del CRM, señaliza discrepancias >$5K |
| `session-summary` | Stop | Auto-registra a `session-log.md` al final de la sesión: previsiones generadas, informes de velocidad, cambios de territorio, señalizadores de coaching |

---

## Configuración de MCP

### Salesforce (Recomendado para Empresa)

Obtener URL de instancia, ID de cliente y token de seguridad. Agregar a `settings.json`:

```json
{
  "mcpServers": {
    "salesforce": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-salesforce"],
      "env": {
        "SALESFORCE_INSTANCE_URL": "https://yourorg.salesforce.com",
        "SALESFORCE_CLIENT_ID": "your-consumer-key",
        "SALESFORCE_CLIENT_SECRET": "your-consumer-secret",
        "SALESFORCE_USERNAME": "your-username@yourorg.com",
        "SALESFORCE_PASSWORD": "your-password",
        "SALESFORCE_SECURITY_TOKEN": "your-security-token"
      }
    }
  }
}