# MCP: Figma

Lee diseños de Figma directamente dentro de Claude Code. Extrae especificaciones de componentes, tokens de color, escalas de tipografía, estructura de capas y exporta activos — luego genera inmediatamente código que coincida con el diseño, sin cambiar entre pestañas del navegador y la terminal.

## Por qué lo necesitas

La brecha entre diseño e implementación es donde se rompe la consistencia. Con Figma MCP:
- Claude lee la especificación real en lugar de confiar en tu descripción de ella
- Los tokens de color, valores de espaciado y escalas de tipo provienen directamente de la fuente de verdad
- Los componentes se generan con las dimensiones correctas, no aproximaciones
- Los comentarios de diseño (preguntas abiertas, notas de redline) son accesibles programáticamente
- Puedes comparar una implementación en vivo contra la especificación de Figma en una sola solicitud

## Instalación

```bash
npm install -g figma-mcp
```

## Configuración

Agrega a `~/.claude.json` o `.claude/mcp.json` del proyecto:

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["figma-mcp"],
      "env": {
        "FIGMA_API_TOKEN": "your-figma-personal-access-token"
      }
    }
  }
}
```

## Herramientas clave

- `get_file` — obtener la estructura completa de un archivo de Figma (todos los frames, componentes y capas)
- `get_node` — obtener un frame, componente o capa específica por ID de nodo
- `get_styles` — extraer todos los estilos de color, tipografía y efecto definidos en el archivo
- `get_components` — listar cada componente en el archivo con sus propiedades
- `get_comments` — leer comentarios de diseño, útil para marcar preguntas abiertas o decisiones pendientes
- `export_node` — exportar cualquier nodo como PNG, SVG o PDF en una escala especificada
- `get_file_versions` — ver el historial de versiones de un archivo

## Ejemplos de uso

```
Lee el diseño de la página de checkout (ID de nodo: 123:456) y genera
el componente React con clases de Tailwind que coincidan con el espaciado,
colores y tipografía en la especificación exactamente.
```

```
Extrae todos los estilos de color de nuestro archivo del sistema de diseño
(clave de archivo: aBcDeFgHiJkL) y genera una configuración de tema de Tailwind
con los valores hex correctos y nombres de tokens.
```

```
Obtén la escala de tipografía de nuestro archivo de diseño de Figma y crea
una hoja de propiedades personalizadas de CSS con --font-size-xs a --font-size-4xl.
```

```
Lista todos los comentarios de diseño abiertos en el archivo y crea un problema de GitHub
para cada uno, etiquetado con la etiqueta 'design-feedback'.
```

```
Compara el componente Button en el archivo de Figma con nuestra implementación actual
en src/components/Button.tsx y lista cualquier discrepancia visual en espaciado,
color o peso de fuente.
```

## Autenticación

1. Inicia sesión en Figma y abre **Configuración de cuenta** (haz clic en tu avatar → Configuración)
2. Ve a **Seguridad** → **Tokens de acceso personal**
3. Haz clic en **Generar nuevo token**, dale un nombre y copia el valor
4. Un token de solo lectura es suficiente para todas las operaciones de lectura/exportación — no se necesitan alcances de escritura a menos que quieras crear comentarios

Establece el token como `FIGMA_API_TOKEN` en el bloque de configuración anterior. No lo confirmes en control de versiones.

## Consejos

**Encontrar claves de archivo e IDs de nodo:** La clave de archivo es la cadena entre `/file/` y la siguiente `/` en la URL de Figma. El ID de nodo es el valor del parámetro de consulta `node-id` (p. ej., `node-id=123-456` → usa `123:456` con dos puntos).

**Límites de tasa:** La API REST de Figma permite 600 solicitudes por minuto. Para sistemas de diseño grandes con cientos de componentes, agrupa tus consultas en lugar de bucle sobre cada nodo individualmente.

**Exportar activos:** `export_node` devuelve datos binarios. Indica a Claude dónde escribir el archivo: `"Exporta el nodo 123:456 como SVG y guárdalo en src/assets/icons/arrow.svg"`.

**Combinando herramientas:** Usa `get_styles` primero para construir tu mapa de tokens, luego `get_node` para componentes individuales. Esto evita llamadas redundantes a API cuando generas un sistema de diseño completo.

**Flujo de trabajo de comparación visual:** Toma una captura de pantalla del componente implementado con Playwright MCP, luego obtén la especificación de Figma con este servidor. Pide a Claude que compare los dos lado a lado y liste las diferencias.

---
