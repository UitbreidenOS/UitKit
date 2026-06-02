# Claude para Analistas de Datos y Analistas de BI

Todo lo que un analista de datos o analista de BI necesita para ejecutar trabajo SQL aumentado con IA, interpretación de dashboards, informes a partes interesadas, auditorías de calidad de datos y análisis ad hoc en Claude Code.

---

## Para quién es esta guía

Eres un analista de datos o analista de BI integrado en un equipo de negocio, producto o marketing. Recibes 15 solicitudes ad hoc a la semana, mantienes 8 dashboards, redactas un informe semanal para la dirección y siempre estás a un cambio de esquema de que una pipeline se rompa. Claude Code se convierte en tu programador en par para consultas, tu editor para informes y tu verificador de calidad para todo lo que entregas.

**Antes de Claude Code:** 2 horas para escribir una consulta SQL compleja desde cero. 1 hora para redactar el informe mensual a partes interesadas a partir de métricas sin procesar. 3 horas para investigar un problema de calidad de datos en 10 tablas.

**Después:** Consulta compleja en 15 minutos. Informe a partes interesadas en 20 minutos. Auditoría de calidad de datos en 30 minutos con SQL de corrección incluido.

---

## Instalación en 30 segundos

```bash
# Instalar habilidades de analista de datos
npx claudient add skill data-ml/sql
npx claudient add skill data-ml/pandas-polars
npx claudient add skill data-ml/dbt-data-pipelines
npx claudient add skill data-ml/dashboard-narrator
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill data-ml/data-quality-checker
npx claudient add skill product/product-analytics
npx claudient add skill marketing/analytics-tracking

# Instalar agentes relevantes
npx claudient add agent roles/data-pipeline-architect
npx claudient add agent roles/quant-analyst
```

---

## Tu stack de datos en Claude Code

### Habilidades (comandos de barra)

| Habilidad | Qué hace | Cuándo usarla |
|---|---|---|
| `/sql` | Escribe, optimiza y depura SQL complejo — CTEs, funciones de ventana, planes de consulta | Cualquier trabajo con consultas SQL |
| `/pandas-polars` | Manipulación de datos en Python — limpieza, transformación, agregación, exportaciones | Análisis ad hoc en Python |
| `/dbt-data-pipelines` | Diseño de modelos dbt, modelos incrementales, tests, documentación | Trabajo de pipeline y transformación |
| `/dashboard-narrator` | Traduce datos de dashboard a narrativa lista para ejecutivos — insights, anomalías, recomendaciones | Informes semanales y ad hoc |
| `/stakeholder-report` | Informe semanal/mensual: métricas principales, causa raíz, elementos de acción | Cadencias de informes regulares |
| `/data-quality-checker` | Auditoría de calidad de datos: nulos, duplicados, valores atípicos, deriva de esquema, SQL de corrección | Cualquier nueva fuente de datos o investigación de anomalías |
| `/product-analytics` | Análisis de embudo, retención, cohortes, pruebas A/B — métricas de crecimiento de producto | Análisis para el equipo de producto |
| `/analytics-tracking` | Diseño de esquema de seguimiento de eventos, planes de tracking, auditorías de etiquetas | Implementación de tracking |

### Agentes

| Agente | Modelo | Cuándo activarlo |
|---|---|---|
| `data-pipeline-architect` | Opus | Diseño de pipelines complejas, decisiones de arquitectura |
| `quant-analyst` | Opus | Análisis estadístico, metodología de pruebas A/B, predicciones |

---

## Flujo de trabajo diario

### Mañana (15-20 minutos)

**1. Control de salud de los datos — verificar los datos de producción antes de que lo pregunten las partes interesadas**
```
/data-quality-checker

Control rápido de salud de nuestras tablas de producción antes de que empiece la jornada laboral.

Ejecuta estas verificaciones en las siguientes tablas:
- [tabla_1]: verificar nulos en [columnas clave], duplicados en [clave primaria]
- [tabla_2]: verificar fechas futuras en [columna de fecha], valores negativos en [columna de importe]

[Pega el conteo de filas de ayer o la anomalía si la tienes]

Señala cualquier cosa que parezca incorrecta. Genera consultas SQL que pueda ejecutar para confirmar.
```

**2. Clasificar solicitudes ad hoc de la noche anterior**
Copia y pega la solicitud en Claude → obtén un borrador SQL o un plan de análisis antes de empezar a trabajar.

---

### Análisis ad hoc (bajo demanda)

**3. Consulta SQL compleja — cualquier solicitud**
```
/sql

Escribe una consulta SQL para responder esta pregunta de negocio:
"[Solicitud de la parte interesada en sus propias palabras]"

Nuestro esquema:
- [nombre_tabla]: columnas [lista], clave primaria [col], relaciones con [otras tablas]
- [nombre_tabla]: [igual]

Base de datos: [PostgreSQL / BigQuery / Snowflake / Redshift]
Necesito: [describe el resultado — forma de la tabla, nivel de granularidad, filtros]
```

**4. Análisis de embudo o cohorte**
```
/product-analytics

Construye un análisis de [embudo / retención por cohorte / prueba A/B].

Tabla de eventos: [esquema]
Pregunta: [qué estamos intentando responder]
Período de tiempo: [rango de fechas]
Segmentar por: [tipo de usuario / canal de adquisición / nivel de plan]

Resultado: [SQL + interpretación de los resultados]
```

---

### Informes (cadencia semanal)

**5. Informe semanal a partes interesadas**
```
/stakeholder-report

Redacta el informe de datos semanal para [dirección / equipo de producto / marketing].

Semana de: [fechas]
Métricas de esta semana:
[Pega tus métricas con cambios semana a semana y versus plan]

Eventos clave: [lanzamientos de producto, campañas, incidentes]
```

**6. Narrativa del dashboard — cuando la dirección pregunta "¿qué significa esto?"**
```
/dashboard-narrator

Traduce estos datos del dashboard en una lectura de 5 minutos para nuestro CEO.

Dashboard: [nombre]
Período: [este mes]
Audiencia: CEO + equipo ejecutivo — no técnica

[Pega los valores de tus métricas, cambios y cualquier contexto que tengas]
```

---

### Trabajo profundo mensual (primera semana del mes)

**7. Informe mensual**
```
/stakeholder-report

Informe de datos mensual para [audiencia].
Mes: [nombre]
[Tabla de métricas completa — mes actual, mes anterior, MoM%, año anterior, YoY%, vs plan]
Causa raíz de los mayores cambios: [tus notas]
Acciones y responsables: [lista]
```

**8. Auditoría de calidad de datos — auditoría mensual de producción**
```
/data-quality-checker

Auditoría mensual de calidad de datos en nuestras [N] tablas de producción.

Por cada tabla:
- [tabla_1]: [conteo de filas, clave primaria, columnas de negocio clave]
- [tabla_2]: [igual]

Genera el script de auditoría en Python que debo ejecutar. Cuando pegue los resultados, genera el informe de salud y el SQL de corrección.
```

---

### Continuo (trabajo de pipeline)

**9. Diseño de modelo dbt**
```
/dbt-data-pipelines

Necesito construir un modelo dbt para [concepto de negocio — p. ej., usuarios activos semanales por cohorte].

Tablas fuente: [lista con esquemas]
Resultado deseado: [granularidad, columnas, para qué se usa el modelo]
Materialización: [tabla / incremental / vista]

Genera: el SQL del modelo, schema.yml con tests y documentación.
```

---

## Plan de 30 días (analista nuevo o stack nuevo)

### Semana 1 — Dominio de SQL en tu nuevo esquema
- Instala todas las habilidades de datos: `npx claudient add skill data-ml/[nombre]`
- Documenta tus tablas clave en un CLAUDE.md en tu repositorio de analítica — Claude lo lee para contexto
- Usa `/sql` para escribir 10 consultas que respondan preguntas comunes de negocio — construye tu biblioteca de consultas
- Ejecuta `/data-quality-checker` en tus 3 tablas de producción más importantes — comprende tu base de referencia de salud de datos

### Semana 2 — Flujos de trabajo de informes
- Usa `/dashboard-narrator` para escribir la revisión semanal del negocio — compara con lo que habrías escrito manualmente
- Usa `/stakeholder-report` para escribir el informe mensual — compártelo con tu manager y recibe retroalimentación
- Identifica qué partes interesadas realmente leen los informes y calibra la longitud y el formato en consecuencia

### Semana 3 — Pipeline y tracking
- Usa `/dbt-data-pipelines` para agregar tests a cualquier modelo sin tests en tu proyecto
- Usa `/analytics-tracking` para auditar tu seguimiento de eventos — encuentra huecos antes de que se conviertan en problemas de calidad de datos
- Configura los tests dbt que genera Claude — pon en marcha el monitoreo automatizado de calidad

### Semana 4 — Análisis avanzado
- Usa `/product-analytics` para realizar un análisis de embudo completo — identifica la mayor caída en tu producto
- Usa el agente `quant-analyst` para cualquier análisis de prueba A/B — establece la metodología correctamente antes de presentar los resultados
- Mide tu tiempo: ¿cuántos minutos toma ahora cada solicitud común versus antes de Claude?

---

## Integraciones de herramientas

### dbt Core / dbt Cloud

```bash
# Claude lee la estructura de tu proyecto dbt
# Apunta Claude a tu directorio models/ y entenderá tu esquema
ls models/marts/ models/staging/  # muestra a Claude la estructura de tus carpetas
cat dbt_project.yml               # pega esto para contexto del proyecto
```

### BigQuery / Snowflake / Redshift

```json
// Conecta tu almacén de datos mediante MCP
{
  "mcpServers": {
    "bigquery": {
      "command": "npx",
      "args": ["-y", "@google-cloud/bigquery-mcp"],
      "env": {
        "GOOGLE_PROJECT_ID": "your-project",
        "GOOGLE_CREDENTIALS": "/path/to/credentials.json"
      }
    }
  }
}
```

Con tu almacén conectado: Claude puede leer esquemas de tablas directamente, ejecutar consultas y validar SQL antes de que lo hagas tú.

### Looker / Tableau / Metabase
Exporta los datos del dashboard como CSV o pega los valores de las métricas → `/dashboard-narrator` los convierte en narrativa. Para LookML: pega tu archivo de vista y Claude ayuda a escribir o refactorizar definiciones de dimensiones y medidas.

### Jupyter Notebooks
Claude escribe código de análisis en Python → pégalo en el notebook → ejecútalo → pega el resultado para interpretación. Usa `/pandas-polars` para el código y `/dashboard-narrator` para la interpretación.

### Slack (entrega a partes interesadas)
Pega el informe semanal de Claude en un mensaje de Slack. Configura un recordatorio semanal → abre Claude → ejecuta `/stakeholder-report` → pega en Slack. Tiempo total: 15 minutos desde los datos hasta la entrega.

---

## Métricas a seguir

| Actividad | Tiempo manual | Con Claude |
|---|---|---|
| Consulta SQL compleja (3+ tablas) | 2 horas | 20 min |
| Informe semanal a partes interesadas | 60 min | 15 min |
| Informe mensual a partes interesadas | 3 horas | 30 min |
| Auditoría de calidad de datos (5 tablas) | 3 horas | 30 min |
| Modelo dbt + tests + documentación | 2 horas | 25 min |
| Narrativa de dashboard | 45 min | 8 min |
| Análisis de prueba A/B | 3 horas | 45 min |

---

## Errores comunes (y cómo Claude Code los previene)

**Error 1: Enviar un informe con datos incorrectos**
Ejecuta `/data-quality-checker` antes de cada informe mensual. Conoce la salud de tus datos antes de que los vean las partes interesadas.

**Error 2: Escribir SQL correcto pero ilegible**
`/sql` genera CTEs y consultas documentadas por defecto. El tú del futuro agradecerá al tú del presente.

**Error 3: Informes a partes interesadas que son volcados de datos**
`/stakeholder-report` exige narrativa: qué ocurrió, por qué, qué hacer. No solo una tabla de números.

**Error 4: Anomalías en dashboards sin explicación**
`/dashboard-narrator` estructura la investigación de anomalías: cuál es la señal, cuáles son las hipótesis, cómo verificarlas.

**Error 5: Modelos dbt sin tests**
`/dbt-data-pipelines` genera schema.yml con tests como parte de cada modelo. Los tests no son una reflexión posterior.

---

## Recursos

- [Comenzar con Claude Code](getting-started.md)
- [Habilidad SQL](../skills/data-ml/sql.md)
- [Habilidad de narrador de dashboards](../skills/data-ml/dashboard-narrator.md)
- [Habilidad de informe a partes interesadas](../skills/data-ml/stakeholder-report.md)
- [Habilidad de verificador de calidad de datos](../skills/data-ml/data-quality-checker.md)
- [Flujo de trabajo de informes de datos](../workflows/data-reporting.md)

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
