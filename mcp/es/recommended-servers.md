> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../recommended-servers.md).

# Servidores MCP Recomendados

Una guía práctica de servidores MCP que vale la pena habilitar en Claude Code. Organizados por categoría con estimaciones de costo de tokens y orientación clara sobre cuándo usar cada uno.

---

## Conciencia del Presupuesto de Tokens

Cada servidor MCP habilitado contribuye sus descripciones de herramientas a la ventana de contexto de Claude.

| Servidores MCP habilitados | Costo aproximado de tokens |
|--------------------|----------------------|
| 3 servidores (~10 herramientas) | ~10,000 tokens |
| 10 servidores (~30 herramientas) | ~30,000 tokens |
| 20 servidores (~60 herramientas) | ~60,000 tokens |

Con una ventana de 200k tokens, 10 MCPs activos consumen ~15% de tu contexto antes de cualquier conversación. Sé selectivo. Deshabilita los servidores que no estés usando activamente.

---

## Sistema de Archivos y Búsqueda

### `@modelcontextprotocol/server-filesystem`
```bash
npx -y @modelcontextprotocol/server-filesystem /path/to/project
```
- **Qué proporciona:** Leer, escribir, listar y buscar archivos con restricciones de ruta configurables
- **Costo de tokens:** ~2,000 tokens
- **Usar cuando:** Quieres que Claude explore un directorio del codebase más allá del directorio de trabajo actual
- **Evitar cuando:** Las herramientas integradas de Read/Write de Claude Code ya cubren tu proyecto

### `@modelcontextprotocol/server-brave-search` o `tavily`
```bash
npx -y @modelcontextprotocol/server-brave-search
```
- **Qué proporciona:** Búsqueda web desde dentro de Claude
- **Costo de tokens:** ~1,500 tokens
- **Usar cuando:** Los agentes necesitan información actual (docs, noticias, versiones de paquetes) no disponible en los datos de entrenamiento
- **Evitar cuando:** Solo necesitas generación de código, sin búsquedas web necesarias

---

## Bases de Datos

### `@modelcontextprotocol/server-postgres`
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
    }
  }
}
```
- **Qué proporciona:** Consultar, inspeccionar esquema, listar tablas — acceso directo a BD desde Claude
- **Costo de tokens:** ~3,000 tokens
- **Usar cuando:** Exploración de esquemas, escritura de consultas complejas, depuración de problemas de datos
- **Evitar cuando:** Base de datos de producción — usa una réplica de solo lectura o BD de desarrollo
- **Seguridad:** Nunca apuntes a la BD de producción. Usa un usuario de solo lectura como mínimo.

### `@modelcontextprotocol/server-sqlite`
- **Qué proporciona:** Lo mismo que postgres pero para archivos SQLite
- **Costo de tokens:** ~2,500 tokens
- **Usar cuando:** Desarrollo local con SQLite, bases de datos embebidas

---

## APIs y Servicios

### `@modelcontextprotocol/server-github`
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "<token>" }
    }
  }
}
```
- **Qué proporciona:** Leer issues, PRs, commits, archivos de repositorios de GitHub
- **Costo de tokens:** ~4,000 tokens
- **Usar cuando:** Revisión de PRs, triaje de issues, obtención de contexto de repos remotos
- **Evitar cuando:** Solo necesitas contexto git local (la CLI de git es más rápida)

### `@modelcontextprotocol/server-linear`
- **Qué proporciona:** Crear, actualizar y consultar issues y proyectos de Linear
- **Costo de tokens:** ~3,000 tokens
- **Usar cuando:** Seguimiento de issues integrado en el flujo de trabajo de desarrollo

### `stripe-mcp` (Stripe oficial)
```bash
npx -y @stripe/mcp --api-key sk_test_...
```
- **Qué proporciona:** Crear clientes, productos, precios, sesiones de checkout; consultar pagos
- **Costo de tokens:** ~5,000 tokens
- **Usar cuando:** Construyendo integraciones con Stripe, probando flujos de pago
- **Evitar cuando:** Claves de Stripe de producción — usa el modo de prueba solo en desarrollo

---

## Navegador y Testing

### `@modelcontextprotocol/server-puppeteer`
- **Qué proporciona:** Lanzar un navegador, navegar páginas, hacer clic en elementos, tomar capturas de pantalla
- **Costo de tokens:** ~3,500 tokens
- **Usar cuando:** Pruebas de UIs web, scraping, automatización de interacciones del navegador
- **Evitar cuando:** Pruebas de API — es excesivo, usa fetch/curl

### `@playwright/mcp`
```bash
npx -y @playwright/mcp@latest
```
- **Qué proporciona:** Automatización con Playwright — más fiable que Puppeteer para SPAs modernas
- **Costo de tokens:** ~4,000 tokens
- **Usar cuando:** Escritura de pruebas E2E, verificación de UI, automatización compleja del navegador
- **Recomendado sobre Puppeteer** para aplicaciones Next.js / React

---

## IA y Razonamiento

### `@modelcontextprotocol/server-memory`
```bash
npx -y @modelcontextprotocol/server-memory
```
- **Qué proporciona:** Un grafo de conocimiento que persiste entre sesiones — entidades, relaciones, observaciones
- **Costo de tokens:** ~2,000 tokens
- **Usar cuando:** Proyectos de larga duración donde quieres que Claude recuerde el contexto entre sesiones
- **Evitar cuando:** Tareas de una sola sesión — sobrecarga sin beneficio

### `@modelcontextprotocol/server-sequential-thinking`
- **Qué proporciona:** Obliga a Claude a pasar por pasos de razonamiento explícito antes de responder
- **Costo de tokens:** ~1,500 tokens
- **Usar cuando:** Resolución de problemas complejos de múltiples pasos, decisiones arquitectónicas
- **Evitar cuando:** Consultas simples — agrega latencia sin beneficio

---

## Plantilla de Configuración

Agrega servidores a `~/.claude/settings.json` (global) o `.claude/settings.json` (proyecto):

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "${DATABASE_URL}"]
    }
  }
}
```

Usa referencias a variables de entorno (`${VAR}`) en lugar de secretos hardcodeados.

---
