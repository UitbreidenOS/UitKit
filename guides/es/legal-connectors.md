# Conectores de datos legales para Claude

## Descripción general

Los datos de entrenamiento de LLM tienen un corte duro — cada estatuto enmendado este trimestre, cada división de circuito decidida el mes pasado, cada carta de orientación regulatoria publicada la semana pasada es invisible para los pesos de un modelo. El trabajo legal es específico de la jurisdicción, específico de la materia y dependiente del estado actual de manera que hace que el conocimiento fuera de línea sea casi inútil para cualquier cosa más allá del razonamiento general. Los conectores de datos resuelven esto adjuntando Claude a las fuentes en vivo autorizadas: Westlaw para ley de control, iManage para documentos de materia del cliente, CourtListener para dockets públicos, y bases de datos de cumplimiento para sanciones y propiedad beneficiaria. El resultado es un sistema donde Claude redacta, analiza y razona contra datos reales en lugar de aproximaciones memorizadas — cual es el único estándar aceptable para el trabajo legal.

---

## Categorías de conectores

| Categoría | Ejemplos | Qué puede hacer Claude |
|---|---|---|
| Legal research DBs | Westlaw, LexisNexis, Bloomberg Law | Cite statutes, pull case law, summarize holdings |
| Document management | iManage, NetDocuments | Search matters, draft from precedents |
| Contract intelligence | Kira, Luminance, Ironclad | Extract clauses, flag deviations, redline |
| Public legal data | CourtListener (Free Law Project), PACER | Case search, docket tracking |
| Compliance data | Refinitiv/LSEG, FactSet | Regulatory lookups, sanctions screening |
| eDiscovery | Relativity | Privilege review, issue tagging |

---

## Thomson Reuters / Westlaw MCP

### Qué proporciona

El servidor Thomson Reuters MCP expone el conjunto de contenido completo de Westlaw: estatutos federales y estatales de EE.UU., regulaciones (CFR, Registro Federal), jurisprudencia con señales de citador KeyCite, Restatements, y guías de práctica Practical Law. La cobertura se extiende a jurisdicciones internacionales seleccionadas y contenido regulatorio transfronterizo.

- Estatutos: USCA, códigos anotados estatales, versiones históricas completas
- Regulaciones: CFR actual e histórico, avisos del Registro Federal, orientación de agencias
- Jurisprudencia: tribunales federales (todos los circuitos), cortes supremas y de apelación estatales, validación KeyCite
- Secundaria: listas de verificación de Practical Law, documentos estándar, actualizaciones legales

### Requisitos previos

1. Suscripción activa a Westlaw con nivel de acceso API (contacte a su gerente de cuenta de TR — el acceso a API no está incluido en licencias de asiento estándar)
2. Clave API de [developer.thomsonreuters.com](https://developer.thomsonreuters.com)
3. ID de cliente de Westlaw de su organización

### Configuración

Instale el servidor:

```bash
npm install -g @thomsonreuters/westlaw-mcp
```

Agregue a `~/.claude.json` o proyecto `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "westlaw": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp"],
      "env": {
        "TR_API_KEY": "your-tr-api-key-here",
        "TR_CLIENT_ID": "your-westlaw-client-id",
        "TR_JURISDICTION": "US",
        "TR_CONTENT_TYPES": "cases,statutes,regulations,practicallaw"
      }
    }
  }
}
```

Para configuración con alcance de proyecto donde diferentes materias requieren diferentes valores predeterminados de jurisdicción:

```json
{
  "mcpServers": {
    "westlaw": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp", "--jurisdiction=DE", "--content=cases,statutes"],
      "env": {
        "TR_API_KEY": "your-tr-api-key-here",
        "TR_CLIENT_ID": "your-westlaw-client-id"
      }
    }
  }
}
```

### Ejemplos de prompts

```
Find Delaware case law on fiduciary duty standards for directors in the
context of a merger transaction. Focus on post-Corwin decisions from
the Court of Chancery. Summarize the business judgment rule vs. entire
fairness framework and what triggers each.
```

```
Pull GDPR Article 17 (right to erasure) full text and summarize the
six grounds for erasure, the three-month obligation timeline for
controllers, and any current EU court interpretations that narrow or
expand the scope of "public interest" exceptions.
```

```
Retrieve New York CPLR §7501 through §7514 (arbitration provisions),
cite the most recent Court of Appeals decisions applying them, and
flag any 2024-2025 amendments.
```

```
Get the current CFPB regulation on UDAAP enforcement guidance from
the CFR and summarize the agency's position as reflected in the
three most recent consent orders.
```

### Nota de costo

Las llamadas a API se extraen de su cuota de API de Thomson Reuters, no de los créditos de API de Claude. TR cobra por artículo de contenido recuperado, no por consulta. Los casos de uso de alto volumen (investigación de materias a granel) deben usar patrones de recuperación por lotes en lugar de consultas individuales por documento. Consulte su contrato de TR para precios por unidad y límites mensuales.

---

## LexisNexis MCP

### Qué proporciona

LexisNexis expone jurisprudencia, estatutos, señales de citador Shepard's, documentos de Practical Guidance, noticias legales (integración Law360), y la capa de contenido de Lexis+ AI. Shepard's es el diferenciador crítico — proporciona historial de citación directa e indirecta, banderas de tratamiento negativo (revocado, distinguido, cuestionado), e historial posterior para cada caso.

- Jurisprudencia: federal, todos los 50 estados, plus internacional seleccionado
- Estatutos: USCA, códigos estatales, anotados con citaciones de casos
- Shepard's: historial de citador completo con códigos de tratamiento
- Practical Guidance: listas de verificación específicas de jurisdicción y documentos de plantilla
- Noticias: Law360, servicios de cables legales, anuncios regulatorios

### Requisitos previos

Suscripción activa a Lexis+ con nivel API. Obtenga credenciales de [developer.lexisnexis.com](https://developer.lexisnexis.com). El acceso a API requiere un apéndice de contrato separado de la suscripción de investigación estándar.

### Configuración

```bash
npm install -g @lexisnexis/lexis-mcp
```

```json
{
  "mcpServers": {
    "lexisnexis": {
      "command": "npx",
      "args": ["-y", "@lexisnexis/lexis-mcp"],
      "env": {
        "LEXIS_CLIENT_ID": "your-lexis-client-id",
        "LEXIS_CLIENT_SECRET": "your-lexis-client-secret",
        "LEXIS_SCOPE": "research shepards practicalguidance",
        "LEXIS_REGION": "us"
      }
    }
  }
}
```

El servidor maneja la renovación de tokens OAuth2 automáticamente usando `LEXIS_CLIENT_ID` y `LEXIS_CLIENT_SECRET`. Los tokens vencen cada hora; el servidor MCP gestiona la renovación sin requerir intervención.

### Ejemplo: redactación de un memorando de opinión

```
Using LexisNexis, research the enforceability of non-compete agreements
in California. Pull the controlling statute (Cal. Bus. & Prof. Code §16600),
the Edwards v. Arthur Andersen holding, and any Court of Appeal decisions
from 2020 onward that address the "narrow restraint" exception. Then draft
a two-page opinion memo advising a SaaS company on whether its standard
employee NCA is enforceable as applied to a software engineer in San Jose.
Cite every case with Shepard's signal.
```

Claude llamará a LexisNexis para recuperar el texto del estatuto, extraer los casos, verificar señales de Shepard's en cada cita, y redactar el memorando con citas en línea. El memorando anotará cualquier caso con tratamiento de Shepard's negativo.

---

## Free Law Project / CourtListener MCP

### Qué proporciona

CourtListener es una plataforma de investigación legal gratuita y de código abierto mantenida por el Free Law Project. Indexa más de 8 millones de opiniones de tribunales estadounidenses de tribunales federales y estatales, datos de dockets de PACER, grabaciones de argumentos orales, y perfiles de jueces incluido historial de recusación y divulgaciones financieras.

Debido a que opera sobre opiniones de tribunales del dominio público, no hay cargos por consulta y no se requiere suscripción. Esto lo hace adecuado para flujos de trabajo de alto volumen: monitoreo de dockets en masa, seguimiento de litigios entre múltiples materias, e investigación de jueces.

Cobertura:
- Corte Suprema de EE.UU. (historial completo)
- Los 13 Tribunales de Apelaciones de Circuito de EE.UU.
- Todos los Tribunales de Distrito de EE.UU. (integración PACER donde esté disponible)
- Cortes supremas y de apelación estatales (varía según el estado)
- Dockets PACER con actualizaciones en tiempo real
- Tribunales de quiebra

GitHub: [github.com/freelawproject/courtlistener](https://github.com/freelawproject/courtlistener)

### Configuración

#### Opción A: Punto final remoto (alojado por Free Law Project)

```json
{
  "mcpServers": {
    "courtlistener": {
      "type": "remote",
      "url": "https://mcp.courtlistener.com/sse",
      "env": {
        "COURTLISTENER_API_TOKEN": "your-token-from-courtlistener.com"
      }
    }
  }
}
```

Obtenga un token de API gratuito en [courtlistener.com/sign-in/](https://www.courtlistener.com/sign-in/).

#### Opción B: Instalación npm local

```bash
npm install -g @freelawproject/courtlistener-mcp
```

```json
{
  "mcpServers": {
    "courtlistener": {
      "command": "npx",
      "args": ["-y", "@freelawproject/courtlistener-mcp"],
      "env": {
        "COURTLISTENER_API_TOKEN": "your-token-from-courtlistener.com",
        "CL_BASE_URL": "https://www.courtlistener.com/api/rest/v4"
      }
    }
  }
}
```

### Mejores casos de uso

- Investigación de fallos anteriores de un juez antes de presentar — extraer todas las opiniones por nombre de juez, filtrar por tipo de caso
- Seguimiento de dockets activos para un cliente o contraparte — monitorear entradas de PACER a medida que presentan
- Buscar todas las decisiones de circuito sobre una cuestión legal estrecha sin una suscripción de pago
- Extracción de texto de opinión para capacitación, análisis o bases de datos de precedentes internos
- Monitoreo de quiebra — rastrear presentaciones de deudores por industria o geografía

### Ejemplos de prompts

```
Search CourtListener for all Second Circuit opinions from 2022 to present
that cite Ashcroft v. Iqbal and address the pleading standard for fraud
claims under Rule 9(b). Return citations, holdings, and any circuit splits
with other circuits.
```

```
Pull the PACER docket for [case number] in the Southern District of New York
and summarize all entries from the past 30 days. Flag any discovery motions,
scheduling order modifications, or summary judgment filings.
```

---

## iManage / NetDocuments (Conectores DMS)

### Cómo se conectan los sistemas de gestión de documentos a través de MCP

Los bufetes de abogados y departamentos legales almacenan su trabajo en sistemas de gestión de documentos (DMS) — no en sistemas de archivos locales. iManage Work y NetDocuments son las dos plataformas dominantes. Los conectores MCP para estos sistemas dan a Claude acceso directo a documentos de asunto: precedentes, borradores anteriores, contratos ejecutados, correspondencia y trabajo privilegiado.

La diferencia arquitectónica clave de las bases de datos legales públicas: los conectores DMS operan dentro de su perímetro de red y se autentican contra su proveedor de identidad de la firma. Los documentos recuperados a través de estos conectores están cubiertos por privilegio de cliente-abogado y protección de trabajo privilegiado — ver la sección Seguridad y Privilegio para requisitos de manejo.

### iManage Work MCP

iManage Work MCP expone la API REST de iManage Work a través de una interfaz MCP. Soporta búsqueda de documentos por materia, cliente, tipo de documento, autor, rango de fechas y contenido de texto completo. Puede recuperar contenido de documento, chequear documentos dentro y fuera, y publicar nuevas versiones de documentos.

#### Requisitos previos

- iManage Work 10.x o posterior con API REST habilitada
- Aplicación OAuth2 registrada en su Centro de Control de iManage
- ID de cliente y secreto de su administrador de iManage
- IDs de espacio de trabajo y biblioteca para su implementación

#### Configuración

```bash
npm install -g @imanage/work-mcp
```

```json
{
  "mcpServers": {
    "imanage": {
      "command": "npx",
      "args": ["-y", "@imanage/work-mcp"],
      "env": {
        "IMANAGE_HOST": "https://work.yourfirm.com",
        "IMANAGE_CLIENT_ID": "your-oauth2-client-id",
        "IMANAGE_CLIENT_SECRET": "your-oauth2-client-secret",
        "IMANAGE_LIBRARY": "ACTIVE",
        "IMANAGE_CUSTOMER_ID": "your-customer-id",
        "IMANAGE_SCOPE": "user openid read write"
      }
    }
  }
}
```

El servidor MCP maneja el flujo de código de autorización OAuth2 en el primer lanzamiento, abriendo una ventana del navegador para autenticación del usuario. Las llamadas posteriores usan el token de acceso renovado almacenado en la caché de credenciales local del servidor.

#### Operaciones disponibles

- `search_documents` — búsqueda de texto completo y metadatos entre materias
- `get_document` — recuperar contenido de documento por ID de documento
- `search_matters` — encontrar materias por nombre de cliente, número de materia, o grupo de práctica
- `checkout_document` — chequear un documento para edición (lo bloquea en iManage)
- `checkin_document` — chequear una nueva versión después de editar
- `list_matter_documents` — listar todos los documentos en un espacio de trabajo de materia específica
- `get_document_versions` — recuperar historial de versiones de un documento

#### Ejemplos de prompts

```
Search iManage for all NDAs executed with Acme Corp over the past two years.
Return document title, date, author, and matter number. Then retrieve the
most recent executed NDA and summarize the key terms: term, governing law,
scope of confidential information, and carve-outs.
```

```
Find all M&A engagement letters in the Davis matter workspace from 2023
onward. List them by date and pull the fee structure from each. I need
to compare how our engagement terms have evolved across these transactions.
```

```
Retrieve the latest draft of the merger agreement in matter 2024-0892.
Check it out under my name, then identify all representations and
warranties that reference material adverse effect and summarize the
current MAC definition language.
```

### NetDocuments MCP

NetDocuments usa un patrón similar a iManage. Las diferencias estructurales clave: NetDocuments organiza el contenido en armarios y carpetas en lugar de espacios de trabajo y bibliotecas centradas en asuntos, y su API usa un modelo de autenticación diferente (OAuth2 con alcances específicos de NetDocuments).

#### Configuración

```bash
npm install -g @netdocuments/nd-mcp
```

```json
{
  "mcpServers": {
    "netdocuments": {
      "command": "npx",
      "args": ["-y", "@netdocuments/nd-mcp"],
      "env": {
        "ND_BASE_URL": "https://api.netdocuments.com/v2",
        "ND_CLIENT_ID": "your-nd-client-id",
        "ND_CLIENT_SECRET": "your-nd-client-secret",
        "ND_REPOSITORY_ID": "your-repository-id",
        "ND_REDIRECT_URI": "http://localhost:4321/callback"
      }
    }
  }
}
```

NetDocuments usa IDs de armario para alcance de búsquedas. Configure `ND_DEFAULT_CABINET` en el entorno si su firma usa una estructura de armario consistente, o pase el ID de armario por consulta.

#### Operaciones disponibles

- `search` — búsqueda de texto completo en todos los armarios accesibles
- `get_document` — recuperar contenido de documento por ndID
- `list_folder` — listar documentos en una ruta de carpeta o armario
- `search_by_attribute` — filtrar por metadatos personalizados (cliente, materia, doctype)
- `get_document_history` — versión e historial de chequeo

---

## Inteligencia de contrato Ironclad

### Qué proporciona

Ironclad es una plataforma de gestión del ciclo de vida de contratos (CLM). Su servidor MCP expone búsqueda de repositorio de contratos, extracción de cláusulas estructuradas, consultas de estado de flujo de trabajo y puntos finales de activación de flujo de trabajo. Es el punto de integración cuando las operaciones de contratos (enrutamiento de aprobación, flujos de trabajo de negociación de contrapartes, recopilación de firmas) necesitan ser orquestadas junto con las capacidades de redacción y análisis de Claude.

El modelo de datos de Ironclad se centra en registros — cada contrato es un registro con atributos estructurados (partes, fecha efectiva, vencimiento, jurisdicción, ley aplicable) más el texto de contrato completo y datos de cláusulas extraídas.

### Requisitos previos

- Cuenta de Ironclad con acceso a API (disponible en planes Growth y Enterprise)
- Token de API de Configuración de Ironclad → API e Integraciones
- Su subdominio de Ironclad (p. ej., `yourcompany.ironcladapp.com`)

### Configuración

```bash
npm install -g @ironcladapp/ironclad-mcp
```

```json
{
  "mcpServers": {
    "ironclad": {
      "command": "npx",
      "args": ["-y", "@ironcladapp/ironclad-mcp"],
      "env": {
        "IRONCLAD_API_TOKEN": "your-ironclad-api-token",
        "IRONCLAD_SUBDOMAIN": "yourcompany",
        "IRONCLAD_API_VERSION": "v1"
      }
    }
  }
}
```

### Operaciones disponibles

- `search_contracts` — buscar por nombre de parte, tipo, estado, rango de fechas o texto completo
- `get_contract` — recuperar registro de contrato completo incluyendo atributos estructurados y texto sin formato
- `get_clause` — extraer un tipo de cláusula específica de un contrato (p. ej., limitación de responsabilidad, indemnización)
- `list_workflows` — listar flujos de trabajo activos por tipo y estado
- `trigger_workflow` — iniciar un flujo de trabajo de contrato (enviar para aprobación, enviar para firma)
- `compare_clause` — comparar una cláusula contra un estándar de playbook

### Ejemplos de prompts

```
Search Ironclad for all SaaS subscription agreements with renewal clauses
expiring in Q3 2026. Return party name, contract value, auto-renewal notice
deadline, and current status. Flag any where the notice deadline is within
45 days.
```

```
Retrieve the limitation of liability clause from contract ID IC-2024-4421
and compare it against our standard playbook cap of 12 months fees. Flag
any deviation and draft proposed redline language to bring it back to
standard.
```

```
Find all vendor agreements where we accepted unlimited liability for data
breaches. List them by value, jurisdiction, and expiry date so I can
prioritize renegotiation.
```

```
Trigger the standard renewal workflow for contract IC-2024-0234 and
notify the assigned account manager that auto-renewal notice deadline
is in 30 days.
```

---

## Kira / Luminance (Revisión de contratos con IA)

### Estas son herramientas nativas de IA — cómo complementan a Claude

Kira Systems (ahora parte de Litera) y Luminance son plataformas de aprendizaje automático creadas específicamente para revisión de contratos. Están entrenadas con millones de contratos legales y producen datos extraídos estructurados — ubicaciones de cláusulas, texto de cláusulas, nombres de partes, fechas, términos definidos — como salida estructurada.

El patrón de integración no es MCP nativo a partir de mayo de 2026. Ni Kira ni Luminance envían un servidor MCP. En su lugar, ambas plataformas exponen API REST que devuelven JSON estructurado, y la integración con Claude se produce a través de un patrón intermediario:

1. **Kira o Luminance** extrae datos de cláusulas estructuradas de contratos cargados (lote o documento único)
2. Un script de **puente** ligero llama a la API de Kira/Luminance y formatea la salida como una respuesta de herramienta
3. **Claude** recibe la extracción estructurada y realiza el análisis de orden superior: redacta el memorando, compara contra playbook, identifica riesgos, escribe el resumen ejecutivo

### Puente API de Kira (patrón de servidor MCP personalizado)

```bash
# Scaffold a custom MCP server to bridge Kira's REST API
npx @modelcontextprotocol/create-server kira-bridge
```

El puente expone dos herramientas:

```json
{
  "tools": [
    {
      "name": "kira_extract",
      "description": "Submit a document to Kira for clause extraction and return structured results",
      "inputSchema": {
        "type": "object",
        "properties": {
          "document_url": { "type": "string" },
          "provision_types": {
            "type": "array",
            "items": { "type": "string" },
            "description": "e.g. ['limitation_of_liability', 'indemnification', 'governing_law']"
          }
        }
      }
    },
    {
      "name": "kira_batch_status",
      "description": "Check status of a Kira batch extraction job",
      "inputSchema": {
        "type": "object",
        "properties": {
          "job_id": { "type": "string" }
        }
      }
    }
  ]
}
```

Configurar en `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "kira": {
      "command": "node",
      "args": ["/path/to/kira-bridge/build/index.js"],
      "env": {
        "KIRA_API_KEY": "your-kira-api-key",
        "KIRA_BASE_URL": "https://api.kirasystems.com/v2",
        "KIRA_PROJECT_ID": "your-project-id"
      }
    }
  }
}
```

### Patrón de Luminance

La API REST de Luminance sigue el mismo patrón. La respuesta de extracción de Luminance incluye tanto el texto de la cláusula como la clasificación de riesgo propia de Luminance, que Claude puede usar como señal inicial antes de aplicar su propio análisis.

### Cuándo usar este patrón vs. DMS nativo

Use Kira/Luminance como capa de extracción cuando:
- Está revisando grandes carteras de contratos (50+ documentos) donde la extracción estructurada es más rápida que Claude procesando PDF sin formato
- Su flujo de trabajo requiere registros de extracción auditables (Kira/Luminance registra cada extracción)
- Necesita los modelos de provisión pre-entrenados de Kira/Luminance para un tipo de contrato específico (p. ej., arrendamientos de bienes raíces, asignaciones de propiedad intelectual)

Use Claude directamente en documentos sin formato cuando:
- Tiene 1-10 contratos y la sobrecarga de la canalización de extracción no está justificada
- El tipo de contrato es inusual y es poco probable que los modelos pre-entrenados funcionen bien
- Está haciendo un análisis de forma libre que no se asigna a tipos de provisión definidos

---

## FactSet / Bloomberg Law (Crossover Finanzas-Legal)

### Qué proporcionan

Los casos de uso de crossover financiero-legal — KYC, detección de sanciones, búsqueda de propiedad beneficiaria, análisis de presentaciones de SEC y seguimiento de cambios regulatorios — requieren fuentes de datos que se encuentran en la intersección de la inteligencia legal y financiera. FactSet y Bloomberg Law son las plataformas principales aquí.

**MCP de FactSet** expone:
- Datos de empresas: identificadores de entidades legales, estructura corporativa, cadenas de propiedad beneficiaria
- Presentaciones regulatorias: SEC EDGAR (10-K, 10-Q, 8-K, declaraciones de representantes, S-1s)
- Sanciones y listas de vigilancia: OFAC SDN, lista consolidada de la UE, sanciones de la ONU
- Calificaciones ambientales, sociales y de gobierno e regulatorias: puntuaciones de cumplimiento de terceros
- Datos de propiedad: tenencias institucionales, transacciones de iniciados

**Bloomberg Law** expone:
- Noticias legales y monitoreo de dockets
- Seguimiento regulatorio (elaboración de normas de agencias, períodos de comentarios)
- Precedentes transaccionales (base de datos de términos de acuerdos)
- Orientación práctica y piezas de análisis de Bloomberg Law

### Configuración de MCP de FactSet

```bash
npm install -g @factset/factset-mcp
```

```json
{
  "mcpServers": {
    "factset": {
      "command": "npx",
      "args": ["-y", "@factset/factset-mcp"],
      "env": {
        "FACTSET_USERNAME": "your-factset-username",
        "FACTSET_API_KEY": "your-factset-api-key",
        "FACTSET_SCOPE": "company ownership sanctions filings",
        "FACTSET_ENVIRONMENT": "production"
      }
    }
  }
}
```

FactSet utiliza autenticación de nombre de usuario + clave API. Genere una clave API en [developer.factset.com](https://developer.factset.com). Tenga en cuenta que los productos de API de FactSet se licencian por separado — confirme que su contrato de FactSet incluye los conjuntos de datos que pretende consultar (Propiedad, presentaciones EDGAR y detección de lista de vigilancia son módulos separados).

### Configuración de MCP de Bloomberg Law

Bloomberg Law MCP está disponible para suscriptores de Bloomberg Terminal con el producto Ley habilitado. Configurar a través de la puerta de enlace de MCP de Bloomberg:

```json
{
  "mcpServers": {
    "bloomberg-law": {
      "command": "npx",
      "args": ["-y", "@bloomberg/blaw-mcp"],
      "env": {
        "BLAW_API_KEY": "your-bloomberg-law-api-key",
        "BLAW_CLIENT_ID": "your-client-id",
        "BLAW_BASE_URL": "https://api.blaw.com/v1"
      }
    }
  }
}
```

### Casos de uso

```
Look up the ultimate beneficial ownership structure for Meridian Holdings Ltd
(LEI: 254900...). Trace all entities with more than 10% ownership, identify
any individuals on OFAC SDN or EU consolidated watchlists, and flag any
jurisdictions with elevated FATF risk ratings.
```

```
Retrieve all 8-K filings for Acme Corp from the past 12 months from SEC EDGAR.
Summarize each material event disclosed, flag any litigation disclosures or
government investigation notices, and identify any changes to the company's
stated risk factors that relate to regulatory compliance.
```

```
Screen the attached list of 45 vendor names against OFAC SDN, EU consolidated
sanctions, and UK OFSI lists. Return matches with match confidence score,
matched list entry, and the basis for designation.
```

```
Track all CFPB rulemaking activity from January 2025 to present. List each
proposed rule, its comment period status, and summarize the primary industry
objections filed during public comment periods.
```

---

## Construcción de un pipeline de investigación legal

### Ejemplo de extremo a extremo: memorando de riesgo de cláusula de arbitraje

Un socio pregunta: "Redacte un memorando de riesgo sobre nuestra cláusula de arbitraje bajo la ley de Nueva York para el caso Johnson."

Esto requiere tres fuentes de datos trabajando juntas: ley de casos de arbitraje de Nueva York actual, el texto de estatuto de control, y la cláusula de arbitraje actual del cliente de la DMS.

#### Paso 1: CourtListener MCP — buscar casos de arbitraje de NY

Claude llama a `search_opinions` en CourtListener:
- Tribunal: `ny` (Corte de Apelaciones de Nueva York) y `ca2` (Segundo Circuito)
- Consulta: `arbitration clause enforcement CPLR 7501`
- Rango de fechas: 2020-01-01 hasta presente
- Devuelve: 12 opiniones con texto completo

#### Paso 2: Westlaw MCP — extraer NY CPLR §7501 y regulaciones relacionadas

Claude llama a `get_statute` en el MCP de Westlaw:
- Cita: `N.Y. C.P.L.R. §7501`
- Incluye: versión anotada con citas de casos
- También recupera: §7503 (aplicación para forzar arbitraje), §7511 (anular sentencia)

#### Paso 3: iManage MCP — recuperar cláusula de arbitraje actual del cliente

Claude llama a `search_documents` en iManage:
- Materia: Johnson (recuperada por número de materia del contexto del usuario)
- Tipo de documento: Acuerdo
- Filtro de texto completo: `arbitration`
- Devuelve: el acuerdo de servicios ejecutados actual que contiene la cláusula de arbitraje

#### Paso 4: Claude redacta el memorando

Con las tres fuentes recuperadas, Claude redacta el memorando — citando fuentes de CourtListener y Westlaw en línea, citando la cláusula actual del cliente, e indicando el riesgo específico (p. ej., la cláusula carece de designación de sede, que los tribunales de Nueva York han tratado como un defecto en la exigibilidad bajo el precedente actual de la Corte de Apelaciones).

### Configuración de CLAUDE.md para conectar los tres MCP

Agregue esto a `.claude/CLAUDE.md` para un proyecto específico de la materia:

```markdown
# Matter: Johnson — Arbitration Research Project

## MCP configuration

This project connects to three data sources:
- **westlaw**: current NY statutes and case law
- **courtlistener**: public federal and NY state court opinions
- **imanage**: Johnson matter documents (matter ID: 2024-JOH-0112)

## Research workflow

When asked to research a legal issue for this matter:
1. Always pull the controlling statute from westlaw first
2. Retrieve relevant case law from both westlaw (for KeyCite signals) and courtlistener (for full opinion text)
3. Check iManage for any existing research memos or prior analysis before starting new research
4. Draft memos in IRAC structure: Issue, Rule, Application, Conclusion
5. Include citation signals (KeyCite/Shepard's) next to every case citation

## Privilege note

All documents retrieved from iManage are privileged. Do not include document content in any output that will be shared outside the firm.
```

### Configuración de MCP para el proyecto de materia

Cree `.claude/mcp.json` en el directorio del proyecto de materia:

```json
{
  "mcpServers": {
    "westlaw": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp"],
      "env": {
        "TR_API_KEY": "${TR_API_KEY}",
        "TR_CLIENT_ID": "${TR_CLIENT_ID}",
        "TR_JURISDICTION": "NY",
        "TR_CONTENT_TYPES": "cases,statutes"
      }
    },
    "courtlistener": {
      "command": "npx",
      "args": ["-y", "@freelawproject/courtlistener-mcp"],
      "env": {
        "COURTLISTENER_API_TOKEN": "${COURTLISTENER_API_TOKEN}"
      }
    },
    "imanage": {
      "command": "npx",
      "args": ["-y", "@imanage/work-mcp"],
      "env": {
        "IMANAGE_HOST": "${IMANAGE_HOST}",
        "IMANAGE_CLIENT_ID": "${IMANAGE_CLIENT_ID}",
        "IMANAGE_CLIENT_SECRET": "${IMANAGE_CLIENT_SECRET}",
        "IMANAGE_LIBRARY": "ACTIVE",
        "IMANAGE_DEFAULT_MATTER": "2024-JOH-0112"
      }
    }
  }
}
```

Use referencias de variables de entorno (`${VAR_NAME}`) en lugar de secretos codificados en archivos de configuración comprometidos. Inyecte valores de un administrador de secretos o un archivo `.env` que está en gitignore.

---

## Seguridad y Privilegio

### Privilegio de cliente-abogado

La restricción de seguridad más significativa en implementaciones de MCP legal es el privilegio de cliente-abogado. Los documentos almacenados en iManage y NetDocuments son trabajo privilegiado. Enrutarlos a través de un servidor MCP en la nube de terceros — incluso uno suministrado por el proveedor — genera riesgo de divulgación inadvertida: el tránsito podría argumentarse como una renuncia dependiendo de la jurisdicción y los términos de servicio del servidor.

**Regla:** Para cualquier servidor MCP que maneje documentos de materia privilegiada, implemente autohospedado o en las instalaciones. No use puntos finales MCP en la nube alojados por proveedores para conectores DMS a menos que el consejero de ética de su firma haya revisado los términos específicos del proveedor y confirmado sin riesgo de privilegio.

Para conectores iManage y NetDocuments:

```bash
# Self-hosted deployment — run on firm infrastructure, not vendor cloud
docker run -d \
  --name imanage-mcp \
  --network internal \
  -e IMANAGE_HOST=https://work.yourfirm.com \
  -e IMANAGE_CLIENT_ID=$IMANAGE_CLIENT_ID \
  -e IMANAGE_CLIENT_SECRET=$IMANAGE_CLIENT_SECRET \
  -p 127.0.0.1:3100:3100 \
  firmregistry.yourfirm.com/imanage-mcp:latest
```

Apunte la configuración de Claude al host interno:

```json
{
  "mcpServers": {
    "imanage": {
      "type": "remote",
      "url": "http://127.0.0.1:3100/sse"
    }
  }
}
```

### Registro de auditoría

Cada llamada de herramienta MCP debe registrarse con: marca de tiempo, nombre de herramienta, parámetros (desinfectados de PII cuando sea apropiado), estado de respuesta y el ID de sesión de Claude. Use un gancho Stop para capturar y archivar la transcripción de conversación completa después de cada sesión.

Agregue a `.claude/settings.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "/usr/local/bin/legal-audit-log.sh"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "mcp__",
        "hooks": [
          {
            "type": "command",
            "command": "/usr/local/bin/mcp-call-log.sh"
          }
        ]
      }
    ]
  }
}
```

`mcp-call-log.sh` recibe los detalles de la llamada de herramienta a través de stdin como JSON. Escriba la entrada de registro en la SIEM de su firma o agregue a un archivo de auditoría específico de materia:

```bash
#!/bin/bash
# mcp-call-log.sh
# Logs every MCP call to a matter-specific audit file
# Receives tool call JSON on stdin

INPUT=$(cat)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // "unknown"')
MATTER_ID=$(echo "$INPUT" | jq -r '.tool_input.matter_id // "none"')

LOG_DIR="/var/log/claude-legal-audit"
LOG_FILE="$LOG_DIR/mcp-calls-$(date +%Y-%m-%d).jsonl"

mkdir -p "$LOG_DIR"
echo "{\"timestamp\":\"$TIMESTAMP\",\"session\":\"$SESSION_ID\",\"tool\":\"$TOOL_NAME\",\"matter\":\"$MATTER_ID\"}" >> "$LOG_FILE"
```

### Residencia de datos

Antes de implementar cualquier servidor MCP, confirme:

1. **Región del proveedor de nube** — Si su acuerdo de datos del cliente especifica residencia de datos solo en EE.UU. (común en materias de gobierno, atención médica y servicios financieros), verifique que cualquier servidor MCP de SaaS o conector DMS alojado en la nube se ejecute en una región compatible. Verifique acuerdos de procesamiento de datos del proveedor y listas de subprocesadores.

2. **Enrutamiento de API de Westlaw / LexisNexis** — TR y LexisNexis enrutan llamadas de API a través de infraestructura basada en EE.UU. de forma predeterminada, pero confirme si sus materias implican clientes no estadounidenses sujetos a GDPR, SCC o requisitos de localización de datos locales. Enviar datos de materia del cliente de la UE a través de puntos finales de API estadounidenses puede requerir una base legal bajo GDPR Capítulo V.

3. **Almacenamiento de registros** — Los registros de auditoría escritos por los ganchos Stop y PreToolUse deben almacenarse en una ubicación consistente con la política de retención de datos de su firma. No los escriba en una computadora portátil personal o una unidad compartida que carezca de controles de acceso apropiados.

4. **Credenciales del servidor MCP** — Las claves API para Westlaw, LexisNexis, FactSet e iManage son credenciales de la firma, no credenciales personales. Trátelas como secretos: almacene en un administrador de secretos administrado por la firma (HashiCorp Vault, AWS Secrets Manager), gire en un horario, y revoque inmediatamente después de la partida del abogado.

5. **Contaminación cruzada de materias** — Cuando ejecuta Claude en múltiples materias en la misma sesión, verifique que los resultados de búsqueda de iManage o NetDocuments no muestren documentos de materias para las que el usuario no está autorizado. Configure el alcance del servidor MCP a nivel de materia, no a nivel de usuario, donde la DMS lo admite.

---
