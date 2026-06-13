# MCP: Meta Ads

Gestiona campañas de anuncios de Facebook e Instagram desde Claude Code — crea campañas, optimiza audiencias, analiza pruebas A/B y actúa sobre datos de rendimiento sin abrir Ads Manager.

## Por qué lo necesitas

Ads Manager está construido para navegación humana, no para análisis programático. Obtener datos de rendimiento, encontrar conjuntos de anuncios con bajo desempeño y realizar cambios en lote requieren trabajo repetitivo de interfaz de usuario. El MCP de Meta pone tu árbol de campaña completo — campañas, conjuntos de anuncios, anuncios, audiencias e insights — en el contexto de Claude para que puedas analizar y actuar en lenguaje natural.

## Instalación

```bash
npx -y @meta/mcp-server-ads
```

Se ejecuta bajo demanda a través de `npx` — no se requiere instalación global.

## Configuración

```json
{
  "mcpServers": {
    "meta-ads": {
      "command": "npx",
      "args": ["-y", "@meta/mcp-server-ads"],
      "env": {
        "META_ACCESS_TOKEN": "your-system-user-token",
        "META_AD_ACCOUNT_ID": "act_XXXXXXXXX"
      }
    }
  }
}
```

`META_AD_ACCOUNT_ID` siempre comienza con `act_`. Encuéntralo en Meta Business Manager bajo **Business Settings → Ad Accounts**.

## Herramientas clave

| Herramienta | Qué hace |
|---|---|
| `list_campaigns` | Lista todas las campañas con estado, objetivo y gasto |
| `get_campaign` | Detalle de campaña completo incluyendo presupuesto, cronograma y rendimiento |
| `create_campaign` | Crear una nueva campaña con objetivo y presupuesto |
| `update_campaign` | Actualizar presupuesto, estado, cronograma o estrategia de oferta |
| `list_ad_sets` | Lista conjuntos de anuncios con orientación, colocación y estado de entrega |
| `create_ad_set` | Crear un conjunto de anuncios con configuración de audiencia y colocación |
| `list_ads` | Lista anuncios individuales con vistas previas creativas y métricas |
| `create_ad` | Crear un anuncio con contenido creativo y texto |
| `get_insights` | Extraer métricas de rendimiento con desgloses e intervalos de fechas |
| `list_audiences` | Lista audiencias guardadas, personalizadas y similares |
| `create_custom_audience` | Construir una audiencia personalizada a partir de una lista de clientes o eventos de píxeles |
| `create_lookalike_audience` | Generar una audiencia similar a partir de una audiencia semilla |
| `get_ab_test_results` | Recuperar resultados estadísticos de prueba A/B y variante ganadora |

## Ejemplos de uso

```
Muestra todas las campañas activas con gasto vs presupuesto para este mes

¿Qué contenido creativo de anuncio tuvo el mejor CTR esta semana?

Crear una audiencia similar a partir de nuestros compradores del top 5%

Pausa todos los conjuntos de anuncios con CPA por encima de $40

Compara el rendimiento de las dos variantes en la prueba A/B #12345

Obtén un desglose de gasto por grupo de edad y colocación para la campaña de retargeting

¿Qué campañas están por debajo de su ritmo en relación con su presupuesto diario?
```

## Autenticación

1. En Meta Business Manager ve a **Business Settings → System Users**
2. Crea un nuevo usuario de sistema (o usa un usuario de sistema administrador existente)
3. Haz clic en **Generate New Token** y selecciona la cuenta de anuncios que deseas gestionar
4. Habilita estos permisos: `ads_management`, `ads_read`, `business_management`
5. Copia el token y establécelo como `META_ACCESS_TOKEN`
6. Encuentra tu ID de cuenta de anuncios bajo **Business Settings → Ad Accounts** — comienza con `act_`

Los tokens de usuarios de sistema no expiran en un ciclo de 60 días como los tokens de usuarios — úsalos para acceso MCP persistente.

## Consejos

- Usa `get_insights` con `breakdowns=["age","placement","device"]` para segmentación de rendimiento granular en una sola llamada.
- Los tokens de usuarios de sistema tienen límites de tasa más altos que los tokens de usuarios personales y no expiran — siempre prefiere usarlos para acceso a API.
- Siempre especifica `date_preset` o un `time_range` explícito en llamadas de insights — la ventana de retrospectiva predeterminada es solo 7 días y puede no mostrar tendencias.
- Meta Ads MCP se lanzó en abril de 2026 como parte del programa de MCP oficial de Meta para desarrolladores.
- `create_lookalike_audience` requiere una audiencia semilla de al menos 100 personas. Las audiencias similares toman 1-2 horas para poblarse antes de que puedan usarse en conjuntos de anuncios.
- Para evitar gastos excesivos durante las pruebas, establece `status=PAUSED` cuando crees campañas a través de MCP — habilítalas manualmente después de revisar la configuración.

---
