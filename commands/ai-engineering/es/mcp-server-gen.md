---
description: Genera un servidor MCP completamente configurado que expone herramientas, recursos o indicaciones para un dominio determinado
argument-hint: "[domain or service to expose, e.g. 'GitHub issues' or 'Postgres query']"
---
Genera un servidor MCP (Model Context Protocol) listo para producción para: $ARGUMENTS

**Paso 1 — Diseño de capacidades**

A partir del dominio en $ARGUMENTS, enumera lo que el servidor debe exponer en cada primitiva MCP:

- **Herramientas** — acciones que el modelo puede invocar (crear, actualizar, eliminar, consultar). Lista nombre, descripción, esquema de entrada (JSON Schema) y forma de retorno.
- **Recursos** — datos que el modelo puede leer (listar y patrones de URI de lectura). Lista plantilla de URI y tipo de contenido.
- **Indicaciones** — plantillas de indicaciones reutilizables que el host puede exponer. Lista nombre, argumentos y texto de indicación.

Indica solo lo que es apropiado para el dominio — no siempre se necesitan las tres primitivas.

**Paso 2 — Genera el servidor**

Escribe un servidor MCP de Python completo usando el paquete `mcp` (`pip install mcp`). Requisitos:

- Usa `mcp.server.Server` y transporte `stdio_server()`
- Registra todas las herramientas, recursos e indicaciones identificadas en el Paso 1
- Cada controlador de herramienta debe:
  - Validar entrada con modelos Pydantic
  - Devolver `[TextContent(...)]` o `[ImageContent(...)]` según sea apropiado
  - Lanzar `McpError` con un `ErrorCode` apropiado en caso de fallo (no devolver cadenas de error en contenido)
- Incluir un bloque `__main__`: `asyncio.run(main())`
- Usar `httpx.AsyncClient` o el SDK relevante para llamadas a API salientes — no `requests`
- Secretos solo a través de variables de entorno — nunca codificados

**Paso 3 — Fragmento de registro settings.json**

Muestra el bloque JSON exacto para pegar en `.claude/settings.json` (o `~/.claude/settings.json`) para registrar el servidor:

```json
{
  "mcpServers": {
    "<server-name>": {
      "command": "python",
      "args": ["path/to/server.py"],
      "env": {
        "API_KEY": "${API_KEY}"
      }
    }
  }
}
```

**Paso 4 — Prueba de humo**

Escribe un `test_server.py` usando `mcp.client.session.ClientSession` y `stdio_client` que:
- Se conecta al servidor a través de subprocess
- Lista herramientas, recursos e indicaciones
- Llama a cada herramienta con una entrada válida mínima y afirma una respuesta sin error
- Se ejecuta con `pytest -xvs test_server.py`

**Salida:** `server.py`, fragmento `settings.json`, `test_server.py`. Sin `# TODO` stubs. Sin lógica de marcador de posición.
