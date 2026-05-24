# MCP: Free Law Project (CourtListener)

El MCP de CourtListener del Free Law Project proporciona acceso libre y abierto a opiniones de cortes estadounidenses, datos de expedientes y perfiles de jueces. No se requiere suscripción. La cobertura abarca opiniones de cortes de distrito federal, circuito y Corte Suprema obtenidas de PACER y alimentadores directos de cortes, así como muchas cortes estatales. La base de datos actualmente contiene más de 8,4 millones de opiniones y se actualiza continuamente conforme se publican nuevas decisiones.

## Por qué lo necesitas

- 8,4 millones+ de opiniones de cortes, libremente accesibles sin cargo por documento
- Opiniones de cortes de distrito federal, circuito y Corte Suprema que se remontan a décadas
- Datos de expedientes de PACER — historiales completos de presentaciones para casos federales activos y cerrados
- Perfiles de jueces incluyendo historial de designación y registros de recusación
- Audio de alegatos orales y transcripciones para casos donde estén disponibles
- Alimentadores en tiempo real para nuevas presentaciones y decisiones

## Instalación

```bash
npm install -g @freelawproject/courtlistener-mcp
```

O usa el punto final remoto de SSE directamente en tu configuración — no se requiere instalación local (ver configuración abajo).

## Configuración

**Local (npx):**

```json
{
  "mcpServers": {
    "courtlistener": {
      "command": "npx",
      "args": ["-y", "@freelawproject/courtlistener-mcp@latest"],
      "env": {
        "COURTLISTENER_API_KEY": "your-api-key"
      }
    }
  }
}
```

Clave de API: registro gratuito en `courtlistener.com/sign-in/`. El acceso anónimo funciona pero está limitado por tasa. Una cuenta gratuita aumenta el límite sustancialmente y es suficiente para la mayoría de flujos de trabajo de investigación.

## Qué expone

| Herramienta | Qué hace |
|---|---|
| `search_opinions` | Búsqueda de texto completo en todas las opiniones de cortes con filtros |
| `get_opinion` | Recupera el texto completo de la opinión por ID o citación |
| `search_dockets` | Busca expedientes de PACER por nombre del caso, número o tribunal |
| `get_docket` | Expediente completo con todas las entradas de presentación y enlaces de documentos |
| `get_judge` | Perfil de juez, historial de designación y registro de recusación |
| `search_oral_arguments` | Busca audio y transcripciones de alegatos orales |
| `get_court_info` | Metadatos de la corte y detalles de jurisdicción |
| `cite_count` | Cuántas veces un caso ha sido citado en opiniones posteriores |

## Ejemplos de prompts

```
"Find all Second Circuit opinions on fair use in software copyright from 2018–2026"

"Get the docket for Oracle v. Google in the Federal Circuit"

"Who are the current district court judges in SDNY and when were they appointed?"

"How many times has Campbell v. Acuff-Rose been cited in circuit court opinions?"

"Find recent EDVA opinions on preliminary injunctions in trade secret cases"
```

## Combina con Westlaw

Para investigación legal seria, ejecuta ambos servidores juntos: CourtListener para búsqueda amplia gratuita y conteo de citas, Westlaw MCP para recuperación de texto completo, shepardización, estatutos y documentos de Practical Law. Configuración combinada:

```json
{
  "mcpServers": {
    "courtlistener": {
      "command": "npx",
      "args": ["-y", "@freelawproject/courtlistener-mcp@latest"],
      "env": {
        "COURTLISTENER_API_KEY": "your-api-key"
      }
    },
    "thomson-reuters": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp@latest"],
      "env": {
        "TR_API_KEY": "your-tr-api-key",
        "TR_JURISDICTION": "US",
        "TR_DEFAULT_CONTENT_TYPES": "cases,statutes,regulations,practicallaw"
      }
    }
  }
}
```

Flujo de trabajo: usa `search_opinions` en CourtListener para identificar casos relevantes en un rango de fechas amplio de forma gratuita, luego usa `get_case` y `shepardize` en Westlaw para recuperar el texto completo y verificar la validez actual para los casos que importan.

## Privacidad

Todos los datos servidos por CourtListener son registros públicos. No hay preocupaciones de privilegio para consultas de investigación. Los datos de expedientes de PACER son públicos, pero las descargas completas de documentos para elementos aún no en el caché de CourtListener incurren en tarifas estándar de PACER por página (actualmente $0.10/página, limitado a $3.00 por documento). Las opiniones que CourtListener ya ha recuperado e indexado se sirven de forma gratuita desde su propio almacenamiento.
