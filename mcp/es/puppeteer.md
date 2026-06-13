# MCP: Automatización del navegador Puppeteer

Controla un navegador real desde Claude Code. Navega, haz clic, rellena formularios, toma capturas de pantalla y raspado de páginas — todo desde tu sesión.

## Por qué lo necesitas

Algunas tareas requieren un navegador real: raspado de contenido renderizado con JavaScript, automatización de flujos de trabajo en aplicaciones web, prueba de flujos de interfaz de usuario o captura de capturas de pantalla. El servidor MCP Puppeteer da a Claude control total del navegador.

## Configuración

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"],
      "env": {
        "PUPPETEER_HEADLESS": "true"
      }
    }
  }
}
```

Establece `PUPPETEER_HEADLESS` en `false` para ver el navegador mientras se ejecuta.

## Qué puede hacer Claude

```
# Captura de pantalla de página


# Raspado de datos estructurados
"Go to [URL] and extract all product names and prices into a JSON list"

# Rellenar y enviar formularios
"Navigate to our staging site, log in with test@example.com, and confirm the checkout flow works"

# Generar PDF
"Convert https://docs.example.com/guide to a PDF"

# Probar interacciones de interfaz de usuario
"Click the 'Get started' button and tell me what happens next"
```

## Herramientas disponibles

| Herramienta | Qué hace |
|---|---|
| `puppeteer_navigate` | Ir a una URL |
| `puppeteer_screenshot` | Capturar pantalla |
| `puppeteer_click` | Hacer clic en un elemento |
| `puppeteer_fill` | Rellenar campo de formulario |
| `puppeteer_evaluate` | Ejecutar JavaScript en la página |
| `puppeteer_pdf` | Generar PDF |
| `puppeteer_select` | Seleccionar opción de lista desplegable |

## Casos de uso

**Raspado de contenido:**
"Scrape the top 20 posts from this news site and summarise each one"

**Investigación competitiva:**
"Go to competitor's pricing page and extract their tier names, prices, and features"

**Prueba automatizada:**
"Run through our complete sign-up flow and report any errors you encounter"

**Documentación:**
"Take screenshots of each page of our onboarding flow for the user guide"

## vs. habilidad Playwright

La habilidad `/playwright-pro` genera código de prueba de Playwright. Este servidor MCP le da a Claude control directo del navegador para automatización bajo demanda — complementario, no competidor.

## Requisitos previos

```bash
# Puppeteer instala Chromium automáticamente en la primera ejecución
# Asegúrate de que Node.js 18+ esté instalado
node --version
```
