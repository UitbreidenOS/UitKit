# MCP: Thomson Reuters Westlaw & Practical Law

Thomson Reuters proporciona un servidor MCP oficial que da a Claude Code acceso directo a Westlaw — la base de datos de investigación legal estadounidense líder — y Practical Law, que cubre guías de práctica, documentos estándar y listas de verificación. Requiere una suscripción activa de Westlaw. Una vez conectado, Claude puede recuperar la jurisprudencia actual, estatutos y regulaciones en lugar de depender de datos de entrenamiento congelados en su conocimiento de corte.

## Por qué lo necesitas

Sin MCP de TR, el conocimiento legal de Claude es estático. Con él:
- Busca y recupera jurisprudencia actual por jurisdicción, tribunal y rango de fechas
- Extrae estatutos y regulaciones en su forma actual y vigente
- Accede a notas de práctica de Practical Law y plantillas de documentos estándar
- Shepardiza / KeyCita casos para confirmar que siguen siendo ley vigente
- Genera citas en formato Bluebook
- Responde preguntas como: "¿Esta cláusula sigue siendo exigible bajo la ley de NY a partir de 2026?"

## Requisitos previos

- Suscripción activa de Westlaw (individual, firma o empresa)
- Clave API de TR Developer — obtén de `developer.thomsonreuters.com`
- El acceso a la API puede requerir el nivel legal.ai en tu cuenta de TR; confirma con tu representante de cuenta antes de la configuración

## Configuración

Agrega a `~/.claude.json` o a `.claude/mcp.json` del proyecto:

```json
{
  "mcpServers": {
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

Reemplaza `@thomsonreuters/westlaw-mcp@latest` con el nombre de paquete exacto listado en el Portal del Desarrollador de TR — el nombre anterior es ilustrativo y puede diferir del paquete publicado.

## Qué expone

| Herramienta | Qué hace |
|---|---|
| `search_cases` | Búsqueda de jurisprudencia de texto completo con filtros por jurisdicción, tribunal y fecha |
| `get_case` | Recupera la opinión del caso completo por citación |
| `shepardize` | Verifica si un caso sigue siendo ley vigente vía KeyCite |
| `search_statutes` | Busca estatutos federales y estatales por tema o citación |
| `get_statute` | Recupera una sección de estatuto con anotaciones |
| `search_regulations` | Busca el CFR y códigos administrativos estatales |
| `get_practical_law` | Recupera notas de práctica de Practical Law y plantillas de documentos |
| `search_secondary` | Busca revisiones de derecho, tratados y guías de práctica |
| `format_citation` | Genera una citación formateada en Bluebook |

## Ejemplos de prompts

```
"Find Delaware Court of Chancery cases from 2022–2026 on director fiduciary duty in M&A transactions"

"Is the arbitration clause in this contract enforceable under 9 USC §2 and recent Second Circuit case law?"

"Get the Practical Law standard NDA for M&A with governing law set to New York"

"Shepardize Revlon v. MacAndrews and tell me if it is still good law"

"What are the current GDPR Article 17 obligations under EU regulation and has anything changed in 2025–2026?"
```

## Costo

Las llamadas de la API de TR se extraen de tu cuota de API de Westlaw, que es separada del uso de tokens de Claude. Monitorea el consumo en `developer.thomsonreuters.com/usage`. Los contratos empresariales típicamente incluyen un nivel de API incluido — confirma tu cuota antes de ejecutar flujos de trabajo de investigación masiva.

## Combina con iManage

Emparejar MCP de Thomson Reuters con iManage DMS permite a Claude recuperar casos de precedente de Westlaw y recuperar el trabajo anterior de tu firma sobre el mismo asunto de iManage, luego redacta un memo que cita ambas fuentes. Configuración combinada:

```json
{
  "mcpServers": {
    "thomson-reuters": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp@latest"],
      "env": {
        "TR_API_KEY": "your-tr-api-key",
        "TR_JURISDICTION": "US",
        "TR_DEFAULT_CONTENT_TYPES": "cases,statutes,regulations,practicallaw"
      }
    },
    "imanage": {
      "command": "npx",
      "args": ["-y", "@imanage/mcp-server@latest"],
      "env": {
        "IMANAGE_SERVER": "https://your-firm.imanage.work",
        "IMANAGE_CLIENT_ID": "your-client-id",
        "IMANAGE_CLIENT_SECRET": "your-client-secret"
      }
    }
  }
}
```

Con ambos servidores activos, un prompt como "Draft a memo on enforceability of MNDA liquidated damages clauses under NY law, citing relevant cases and any prior firm memos on the topic" extraerá de Westlaw para jurisprudencia actual y de iManage para precedentes internos simultáneamente.
