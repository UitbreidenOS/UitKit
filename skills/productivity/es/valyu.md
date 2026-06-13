---
name: valyu
description: "Acceder a datos de investigación pagados a través de Valyu MCP: presentaciones SEC EDGAR, artículos PubMed, ensayos clínicos, patentes, informes financieros."
---

# Valyu Research API

## Cuándo activar

- El usuario necesita presentaciones SEC EDGAR (10-K, 10-Q, 8-K, DEF 14A) para una empresa pública
- Acceso a PubMed o literatura biomédica detrás de muros de pago de revistas
- Consultar ClinicalTrials.gov para datos de ensayos, estado de inscripción o resultados
- Búsquedas en bases de datos de patentes (USPTO, EPO, WIPO)
- Datos financieros que requieren presentaciones oficiales en lugar de datos web raspados
- Artículos académicos donde los preprints gratuitos no están disponibles y se necesita el texto completo
- Cualquier tarea de investigación donde fuentes primarias autorizadas importan más que contenido web agregado

## Cuándo no usar

- Búsqueda general en la web (use WebSearch en su lugar — Valyu agrega costo sin beneficio para contenido web público)
- Artículos de noticias, publicaciones de blog o contenido de opinión
- Documentación de código o respuestas de estilo Stack Overflow
- Datos que están disponibles libremente y de manera confiable a través de búsqueda estándar (Wikipedia, documentación oficial de productos)
- Precios en tiempo real, datos de mercado en vivo o feeds financieros en streaming — Valyu tiene datos de presentaciones, no tickers

## Instrucciones

### Configuración MCP

Agregue Valyu a su configuración MCP de Claude Code:

```json
{
  "mcpServers": {
    "valyu": {
      "command": "npx",
      "args": ["-y", "@valyu/mcp-server"],
      "env": {
        "VALYU_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Obtenga una clave API en valyu.network. Almacene la clave en su entorno shell o `.env` — nunca en `settings.json` o archivos comprometidos:

```bash
export VALYU_API_KEY="vk_..."
```

Luego referencie en la configuración de MCP como `"${VALYU_API_KEY}"` o use el bloque env como se muestra.

### Fuentes de datos disponibles

| Fuente | Qué contiene | Tipo de consulta óptimo |
|---|---|---|
| SEC EDGAR | 10-K, 10-Q, 8-K, DEF 14A, S-1 y todos los demás formularios SEC | Número CIK o ticker de empresa + tipo de formulario |
| PubMed | 35M+ resúmenes y textos completos biomédicos | PMID, DOI o palabra clave + rango de fechas |
| ClinicalTrials.gov | Metadatos de ensayos, estado, resultados, protocolos | Número NCT o condición + intervención |
| Patentes USPTO | Texto completo de patente estadounidense, citas, asignaciones | Número de patente o palabra clave + código de clasificación |
| EPO / WIPO | Patentes europeas e internacionales | Número de solicitud o palabra clave |
| Informes financieros | Comunicados de ganancias, presentaciones para inversores | Nombre de la empresa + período fiscal |

### Patrones de consulta por fuente

**SEC EDGAR — Presentaciones 10-K:**
```
Use Valyu para recuperar la presentación 10-K para [COMPANY] (ticker: [TICKER]) para el año fiscal [YEAR].
Extraer: ingresos, margen bruto, gasto en I+D, ingresos operacionales, ingresos netos, recuento de acciones.
Devolver como tabla con cambio año tras año.
```

**SEC EDGAR — Análisis de tendencias entre años:**
```
Use Valyu para obtener las presentaciones 10-K para [COMPANY] para los años fiscales [YEAR-2], [YEAR-1] y [YEAR].
Para cada año extraer: ingresos totales, gastos en I+D como % de ingresos, flujo de caja libre.
Construya una tabla de tendencias y note los cambios año tras año.
```

**PubMed — Búsqueda bibliográfica:**
```
Use Valyu para buscar en PubMed artículos sobre [TOPIC].
Filtrar: publicado [DATE RANGE], solo inglés, sujetos humanos.
Devolver: título, autores, revista, año, resumen, DOI para los 10 principales por recuento de citas.
```

**ClinicalTrials.gov — Búsqueda de ensayos:**
```
Use Valyu para consultar ClinicalTrials.gov para ensayos que estudien [INTERVENTION] en [CONDITION].
Filtrar: Fase 2 o 3, completado o reclutamiento activo, resultados disponibles.
Devolver: número NCT, título, patrocinador, inscripción, punto final primario, resumen de resultados si está disponible.
```

**Búsqueda de patentes:**
```
Use Valyu para buscar patentes USPTO para [TECHNOLOGY AREA].
Filtrar: patentes otorgadas, [DATE RANGE], asignadas a [COMPANY] si es específico.
Devolver: número de patente, título, resumen, fecha de solicitud, fecha de otorgamiento, resumen de reivindicaciones clave.
```

### Formato de citación

Cuando produzca resultados de investigación, formatee las citas originarias de Valyu como:

**Presentación SEC:**
```
[Company Name]. Form 10-K. United States Securities and Exchange Commission. Filed [date]. 
Accession number: [accession]. Retrieved via Valyu.
```

**Artículo PubMed:**
```
[Authors]. "[Title]." [Journal] [Vol]([Issue]) ([Year]): [Pages]. PMID: [PMID]. DOI: [DOI].
```

**Ensayo clínico:**
```
[Trial Title]. ClinicalTrials.gov identifier: [NCT number]. [Sponsor]. [Status as of retrieved date].
```

**Patente:**
```
[Assignee]. "[Patent Title]." [Patent Number]. [Grant date]. [Classification].
```

### Combinar Valyu con búsqueda web

Para investigación completa, combine Valyu (fuentes primarias) con WebSearch (contexto, análisis, noticias):

```
Flujo de trabajo de investigación para análisis competitivo de [COMPANY]:

Paso 1 — Valyu: Obtener los últimos 3 años de presentaciones 10-K. Extraer ingresos, márgenes, gasto en I+D.
Paso 2 — Valyu: Obtener cualquier presentación 8-K de los últimos 12 meses para eventos materiales.
Paso 3 — WebSearch: Encontrar cobertura analítica, noticias recientes y comentarios públicos.
Paso 4 — Sintetizar: Datos financieros primarios de Valyu + contexto cualitativo de web.
Notar claramente qué afirmaciones provienen de presentaciones oficiales versus fuentes secundarias.
```

### Conciencia de costos

Valyu cobra por consulta. Directrices para mantener los costos bajos:
- Use identificadores específicos (CIK, PMID, número NCT, número de patente) cuando los tenga — las búsquedas por palabra clave consumen más cuota
- Solicite solo los años o rangos de fechas que necesita — no obtenga todas las presentaciones si necesita solo las últimas 3
- Resultados de caché para la sesión: si obtuve un 10-K, manténgalo en contexto en lugar de refetching

## Ejemplo

**Tarea:** Obtener los últimos 3 años de presentaciones 10-K para una empresa pública y extraer tendencias de crecimiento de ingresos y gasto en I+D.

**Indicación:**
```
Use Valyu para recuperar las presentaciones anuales 10-K para Cloudflare (ticker: NET) para los años fiscales
2022, 2023 y 2024.

De cada presentación, extraer:
- Ingresos totales
- Crecimiento de ingresos año tras año %
- Gasto en I+D
- I+D como % de ingresos
- Pérdida / ingresos operacionales
- Flujo de caja libre (flujo de caja operacional menos capex)

Presentar como tabla con los tres años uno al lado del otro.
Luego escriba 3 oraciones interpretando la tendencia.
Cite cada presentación con el número de acuerdo SEC.
```

**Estructura de salida esperada:**
| Métrica | FY2022 | FY2023 | FY2024 |
|---|---|---|---|
| Revenue | $975M | $1.30B | $1.63B |
| YoY growth | 49% | 33% | 26% |
| R&D expense | $423M | $522M | $609M |
| R&D % revenue | 43% | 40% | 37% |

Con cita: "Cloudflare Inc. Form 10-K. SEC. Filed 2025-02-21. Accession: 0001477932-25-003456."

---
