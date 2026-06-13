# MCP: Playwright

Controla un navegador real directamente desde Claude Code. Playwright MCP permite a Claude navegar páginas, hacer clic en elementos, completar formularios, tomar capturas de pantalla y extraer contenido — convirtiendo la automatización del navegador en una conversación natural en lugar de un ejercicio de scripting.

## Por qué lo necesitas

Las tareas basadas en navegador normalmente te sacen de la terminal: abre un navegador, haz clic manualmente, copia-pega resultados de vuelta. Con Playwright MCP:
- Claude puede probar flujos de interfaz de usuario de extremo a extremo sin tocas el ratón
- Las capturas de pantalla dan a Claude confirmación visual de cómo se ve realmente la página
- El llenado de formularios, los flujos de inicio de sesión y las interacciones de múltiples pasos se ejecutan en una sola solicitud
- El raspado y la extracción de contenido se convierten en líneas únicas en lugar de scripts
- Funciona sin interfaz en CI o con interfaz localmente para depuración

## Instalación

```bash
# Instala el servidor MCP
npm install -g @playwright/mcp

# Instala el binario del navegador Chromium (requerido)
npx playwright install chromium
```

## Configuración

Agrega a `~/.claude.json` o `.claude/mcp.json` del proyecto:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "true"
      }
    }
  }
}
```

Para modo con interfaz (ventana de navegador visible, útil para depuración):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "false"
      }
    }
  }
}
```

## Herramientas clave

- `browser_navigate` — ir a una URL
- `browser_screenshot` — capturar la página actual como una imagen
- `browser_click` — hacer clic en un elemento por selector CSS o coordenadas
- `browser_type` — escribir texto en un campo de entrada
- `browser_select_option` — elegir un valor de un desplegable
- `browser_scroll` — desplazarse por la página una cantidad de píxeles o a un elemento
- `browser_evaluate` — ejecutar JavaScript en el contexto de la página y devolver el resultado
- `browser_get_text` — extraer texto visible de la página o un elemento específico
- `browser_wait_for` — esperar a que aparezca un elemento, la red se ralentice o un timeout

## Ejemplos de uso

```
Navega a la página de inicio de sesión, completa las credenciales de prueba,
envía el formulario y toma una captura de pantalla para que pueda verificar
que el panel de control se carga correctamente.
```

```
Ve a nuestro entorno de staging en https://staging.myapp.com/dashboard,
extrae todo el texto de los elementos de mensaje de error y devuélvelos como una lista.
```

```
Prueba el flujo de checkout: navega a la página del producto, agrega el primer elemento
al carrito, procede al checkout y verifica que el resumen del pedido muestre
el elemento y precio correctos.
```

```
Raspa la página de precios en https://myapp.com/pricing — extrae los nombres de planes,
precios y listas de características, luego devuelve todo como JSON estructurado.
```

```
Toma una captura de pantalla de cada página en la navegación principal y guárdala
en /screenshots con nombres de archivo que coincidan con las etiquetas de navegación.
```

## Autenticación

No se requiere clave de API. El navegador se ejecuta localmente en tu máquina. Para sitios que requieren inicio de sesión:
- Usa `browser_navigate` + `browser_type` + `browser_click` para autenticarte como parte de la solicitud
- Para sesiones persistentes, usa `browser_evaluate` para inyectar cookies de autenticación directamente:
  ```
  Establece la cookie de autenticación: document.cookie = "session=abc123; path=/"
  ```

## Consejos

**Sin interfaz vs con interfaz:** El predeterminado es sin interfaz — más rápido y seguro para CI. Cambia a `PLAYWRIGHT_HEADLESS=false` cuando un flujo falla y quieres ver qué está haciendo clic en Claude.

**Tamaño de viewport:** Si una página se comporta diferente en anchos móviles vs escritorio, especifícalo en la solicitud: `"Establece el viewport a 375x812 antes de tomar la captura de pantalla"`.

**Esperando contenido:** Las páginas dinámicas que cargan datos de forma asincrónica pueden engañar a `browser_get_text`. Pide a Claude que use `browser_wait_for` con una condición de red inactiva antes de extraer contenido.

**Playwright MCP vs scripts de prueba Playwright:** Usa este MCP para automatización exploratoria, única o conversacional. Escribe un script de prueba Playwright adecuado cuando necesites pruebas repetibles, versionadas en control de versiones que se ejecuten en CI en cada push.

**Flujos de múltiples pasos:** Encadena herramientas naturalmente en una sola solicitud. Claude secuenciará `navigate → wait → type → click → screenshot` en el orden correcto sin que tengas que especificar cada paso por separado.

---
