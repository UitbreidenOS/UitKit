# Flujos de Trabajo de Visión y Multimodal en Claude Code

Claude puede analizar imágenes, PDFs, capturas de pantalla y diagramas como entradas de primera clase junto con texto. Esta guía cubre cómo obtener contenido visual en Claude Code, qué puede extraer Claude de él y flujos de trabajo de extremo a extremo que combinan visión con generación de código y correcciones automatizadas.

---

## Qué Puede Ver Claude

Claude soporta cuatro formatos de imagen:

| Formato | Notas |
|---|---|
| PNG | Sin pérdidas. Mejor para capturas de pantalla, diagramas, capturas de IU |
| JPEG / JPG | Con pérdidas. Aceptable para fotos; evitar para imágenes con mucho texto |
| GIF | Marco estático solo — Claude lee el primer marco, no animación |
| WebP | Soportado. Variantes sin pérdidas y con pérdidas |

**Los PDFs** se procesan como imágenes — cada página se renderiza y analiza visualmente. Claude no analiza flujos de texto PDF; lee lo visible en la página renderizada. Esto significa que puede manejar PDFs escaneados, documentos manuscritos y PDFs de contenido mixto de la misma manera que maneja imágenes.

**Las capturas de pantalla** son la entrada multimodal más común en flujos de trabajo de Claude Code. No requieren conversión de formato — arrastra desde cualquier herramienta de captura, o canaliza desde un script de captura.

Claude no puede procesar:
- Archivos de video (sin extracción de fotogramas, sin análisis de movimiento)
- Alimentación en vivo desde cámara
- Audio incrustado en archivos de medios
- Fotogramas de GIF animado más allá del primero

---

## Pasar Imágenes a Claude Code

### Arrastrar y Soltar en la Terminal

En terminales que soportan renderización de imagen (iTerm2, Ghostty, Warp, Kitty), arrastra un archivo de imagen de Finder directamente a la ventana de terminal donde Claude se está ejecutando. La imagen se adjunta al turno actual.

```
# macOS — arrastra cualquier archivo de Finder a la sesión de terminal de Claude Code
# La imagen aparece como un archivo adjunto antes de tu mensaje escrito
```

### Pegar desde Portapapeles

Claude Code lee imágenes del portapapeles cuando pegas (`Cmd+V` en macOS, `Ctrl+V` en Linux). Después de tomar una captura de pantalla con `Cmd+Shift+4` (captura de selección macOS) o `PrintScreen`, pega directamente en la terminal de Claude Code. La imagen se captura desde el portapapeles y se adjunta al mensaje actual.

```bash
# Captura una región y pégala en Claude
# macOS: Cmd+Shift+4 → selecciona región → Cmd+V en terminal de Claude
```

### Referencia a una Ruta de Archivo

Proporciona una ruta de archivo absoluta en tu mensaje y Claude Code lee el archivo:

```
Analiza la imagen en /tmp/error-screenshot.png. ¿Cuál es la causa raíz del error mostrado?
```

Esto funciona sin arrastrar y soltar en terminales que no renderizan imágenes — Claude Code lee el archivo desde el disco cuando se le proporciona una ruta.

### Entrada Programática a través de API

Cuando llamas a la API de Claude directamente, las imágenes se pasan como bloques de contenido estructurado. Se soportan dos tipos de fuente:

**Base64 (en línea):**
```json
{
  "role": "user",
  "content": [
    {
      "type": "image",
      "source": {
        "type": "base64",
        "media_type": "image/png",
        "data": "<base64-encoded-bytes>"
      }
    },
    {
      "type": "text",
      "text": "¿Qué componentes de interfaz de usuario son visibles en esta captura de pantalla?"
    }
  ]
}
```

**URL (obtención remota):**
```json
{
  "role": "user",
  "content": [
    {
      "type": "image",
      "source": {
        "type": "url",
        "url": "https://example.com/diagram.png"
      }
    },
    {
      "type": "text",
      "text": "Convierte este diagrama de arquitectura a Terraform."
    }
  ]
}
```

Usa base64 para imágenes que no son públicamente accesibles (archivos locales, capturas de pantalla internas, artefactos CI). Usa fuente de URL para imágenes ya alojadas y alcanzables desde los servidores de Anthropic. No pases URLs internas privadas como fuente de URL — fallarán silenciosamente o devolverán un error de obtención.

**Asistente Python para codificación base64:**
```python
import anthropic
import base64
from pathlib import Path

def image_to_message(path: str, prompt: str) -> dict:
    data = base64.standard_b64encode(Path(path).read_bytes()).decode("utf-8")
    ext = Path(path).suffix.lstrip(".")
    media_type = {"png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg",
                  "gif": "image/gif", "webp": "image/webp"}[ext]
    return {
        "role": "user",
        "content": [
            {"type": "image", "source": {"type": "base64", "media_type": media_type, "data": data}},
            {"type": "text", "text": prompt}
        ]
    }

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[image_to_message("/tmp/screenshot.png", "Identifica todos los campos de formulario visibles.")]
)
```

---

## Límites de Tamaño de Imagen y Restricciones

| Restricción | Valor |
|---|---|
| Tamaño máximo de archivo | 5 MB por imagen |
| Dimensión máxima recomendada | 1568 × 1568 px |
| Dimensión máxima absoluta | ~8000 px en el borde largo (escalado internamente hacia abajo) |
| Máximo de imágenes por solicitud | 20 (API); sin límite aplicado en sesiones de Claude Code |

Las imágenes mayores que 1568 × 1568 px se escalan hacia abajo antes del procesamiento. El modelo ve la versión escalada hacia abajo, no el original. Para imágenes con texto denso pequeño (recibos, tablas de datos, diagramas técnicos), mantén la resolución cerca de 1568 px en el borde largo para preservar legibilidad. Enviar una captura de pantalla 4K no mejora precisión — solo aumenta tamaño de carga base64 y tiempo de transferencia de red.

Escala hacia abajo antes de enviar cuando las imágenes excedan el límite:

```bash
# macOS ImageMagick — cambiar tamaño para caber en 1568x1568, preservar relación de aspecto
magick input.png -resize '1568x1568>' output.png

# O con sips (sin necesidad de instalar en macOS)
sips --resampleHeightWidthMax 1568 input.png --out output.png
```

---

## Costo de Token de Imágenes

Las imágenes no tienen costo de token variable que escale con el recuento de píxeles. El costo es aproximadamente fijo por imagen independientemente de la resolución (dentro del rango soportado):

| Modelo | Costo por imagen (aprox.) |
|---|---|
| Claude Haiku | ~1500 tokens |
| Claude Sonnet | ~1500–1600 tokens |
| Claude Opus | ~1600–2000 tokens |

Una miniatura de 200 × 200 px cuesta aproximadamente lo mismo que un diagrama de 1568 × 1568 px. Esto significa:
- No envíes múltiples recortes pequeños cuando una imagen completa es más clara
- No asumas que imágenes más pequeñas son más baratas
- Para flujos de trabajo de múltiples imágenes (p. ej., 10 capturas de pantalla), estima ~15,000–20,000 tokens de sobrecarga de imagen antes de cualquier texto

Los PDFs cuestan aproximadamente 1500–2000 tokens por página renderizada, usando el mismo modelo de costo fijo.

---

## Caso de Uso 1: Revisión de UI/UX y Auditoría de Accesibilidad

Pega una captura de pantalla de cualquier UI y pide a Claude que identifique problemas de accesibilidad, problemas de diseño o inconsistencias de diseño.

**Patrón de indicativo:**
```
Estoy pegando una captura de pantalla de nuestra página de inicio de sesión.

1. Enumera cada violación WCAG 2.1 AA que puedas identificar — enfócate en contraste de color, etiquetas faltantes e indicadores de foco de teclado.
2. Para cada violación, cita el criterio de éxito específico (p. ej., 1.4.3 Contraste Mínimo).
3. Sugiere el cambio de código mínimo que arregla cada problema.
```

**Qué esto captura sin un navegador:** `aria-label` faltante en botones de icono, texto de bajo contraste sobre imágenes de fondo, campos de formulario sin asociación de etiqueta visible, objetivos táctiles más pequeños que 44 × 44 px, texto de marcador de posición usado como sustituto de etiqueta.

Para revisión sistemática, captura capturas de pantalla en múltiples anchos de ventana gráfica y pásalas en un turno único:

```python
viewports = [375, 768, 1280]  # móvil, tableta, escritorio
screenshots = [f"/tmp/ui-{w}.png" for w in viewports]

content = []
for path in screenshots:
    data = base64.standard_b64encode(Path(path).read_bytes()).decode("utf-8")
    content.append({"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": data}})

content.append({"type": "text", "text": "Compara estas tres capturas de pantalla de ventana gráfica. Identifica roturas de diseño y problemas de accesibilidad en cada ancho. Agrupa los hallazgos por ventana gráfica."})
```

---

## Caso de Uso 2: OCR — Extracción de Texto de Imágenes

Claude extrae texto de documentos escaneados, fotos de pizarras, recibos, tarjetas de visita y notas manuscritas. A diferencia de herramientas OCR tradicionales, Claude comprende contexto — puede extraer datos estructurados de diseños visuales no estructurados.

**Recibos e invoices:**
```
Extrae todos los elementos de línea de este recibo. Devuelve una matriz JSON con campos:
- description (string)
- quantity (number)
- unit_price (number)
- total (number)

También incluye: vendor_name, date, subtotal, tax, total_amount.
```

**Notas de pizarra:**
```
Transcribe todo lo escrito en esta pizarra. Preserva la estructura — si los elementos están en una lista, formatea como lista. Si hay diagramas con etiquetas, describe el diagrama y extrae las etiquetas.
```

**Formularios manuscritos:**
```
Extrae todos los valores completados de este formulario. Devuelve un mapeo clave-valor donde la clave es la etiqueta de campo impresa en el formulario y el valor es lo que fue escrito adentro.
```

Limitaciones: Claude no puede leer confiablemente texto más pequeño que aproximadamente 8–10pt equivalente a resolución de 1568 px. Las marcas de agua, texto superpuesto y escaneos muy degradados reducen la precisión. Para tareas OCR críticas (documentos legales, registros financieros), valida valores extraídos contra patrones esperados.

---

## Caso de Uso 3: Diagrama-a-Código — Diagramas de Arquitectura a Infraestructura

Pasa un diagrama de arquitectura (dibujado a mano, exportación de Lucidchart o foto de pizarra) y pide a Claude que genere el código de infraestructura correspondiente.

**Indicativo:**
```
Este es un diagrama de arquitectura para nuestra aplicación. Genera un módulo Terraform que aprovisione cada recurso mostrado.

Requisitos:
- Usar proveedor AWS
- Usar variables para valores específicos del entorno (región, tipos de instancia, bloques CIDR)
- Agregar salidas para todos los IDs de recurso y ARNs que módulos descendentes necesitarían
- Seguir la convención de nomenclatura mostrada en las etiquetas del diagrama
```

**Lo que Claude infiere de diagramas:**
- Límites de VPC y diseños de subred
- Relaciones de balanceador de carga → grupo de destino → instancia
- Configuraciones de réplica de base de datos
- Límites de grupo de seguridad (líneas punteadas o codificación de color)
- Nombres de servicio y tipos de instancia si están etiquetados

Para diagramas complejos con elementos superpuestos, agrega una pista de indicativo: "Enfócate en las flechas sólidas — representan flujo de tráfico de red. Las líneas punteadas representan acceso de gestión."

---

## Caso de Uso 4: Depuración de Errores desde Capturas de Pantalla de UI

Cuando un bug se manifiesta visualmente (diseño inesperado, estado roto, modal de error), captura de pantalla y pasa a Claude con el código relevante.

**Indicativo:**
```
Esta captura de pantalla muestra el estado de error que ven nuestros usuarios cuando el pago falla.

Dado esta captura de pantalla y el manejador de error a continuación, identifica:
1. Qué activó este estado
2. Por qué el mensaje de error está cortado en la parte inferior
3. Qué cambio CSS o gestión de estado arregla el desbordamiento

[pega código del manejador de error]
```

Claude correlaciona lo que ve en la captura de pantalla (texto truncado, elementos desalineados, color de fondo inesperado) con el código que proporcionas. Esto es más rápido que describir el bug visual en palabras — mostrar es inequívoco.

**Para errores de consola:** Si la consola de DevTools del navegador es visible en la captura de pantalla, Claude lee los mensajes de error, números de línea y rastro de pila desde la imagen.

---

## Caso de Uso 5: Implementación de Diseño — Captura de Pantalla de Figma a Componente

Toma una captura de pantalla de un marco de Figma (o cualquier mockup de diseño) y genera el componente correspondiente.

**Indicativo:**
```
Esta es una captura de pantalla de un diseño de Figma para un componente de tarjeta de precios.

Genera un componente React que coincida exactamente con este diseño. Requisitos:
- Usar Tailwind CSS para estilos
- El componente acepta estos props: plan (string), price (number), features (string[]), isPopular (boolean)
- El distintivo "Popular" solo debe aparecer cuando isPopular es verdadero
- Coincide con los pesos de fuente, espaciado y radio de borde visible en la captura de pantalla
- El botón CTA debe usar el color primario mostrado
```

**Iterando sobre la salida:**
```
El texto del botón es demasiado pequeño — en la captura de pantalla parece ser aproximadamente 16px, coincidiendo con el tamaño del texto del cuerpo. Actualiza el componente.
```

Claude no puede extraer valores de color exactos de capturas de pantalla de forma confiable — la percepción de color de capturas de pantalla depende de la calibración del monitor y artefactos de compresión. Para colores precisos, cópialos desde Figma directamente y pégalos en la indicación: "El color primario es #6366F1."

---

## Caso de Uso 6: Extracción de Datos de Gráficos y Gráficos

Claude puede leer valores de gráficos de barras, gráficos de línea, gráficos circulares y tablas de datos mostradas como imágenes — útil cuando los datos subyacentes no son accesibles.

**Indicativo:**
```
Extrae todos los puntos de datos de este gráfico de barras. Devuelve una matriz JSON donde cada elemento tiene:
- label (la categoría del eje x)
- value (el valor numérico del eje y)

Estima valores tan precisamente como sea posible desde las alturas de las barras en relación con la escala del eje y. Incluye tu nivel de confianza (alto/medio/bajo) para cada valor.
```

**Para gráficos de línea con múltiples series:**
```
Este gráfico de línea muestra tres métricas a lo largo del tiempo. Para cada serie:
1. Identifica el nombre de la serie (de la leyenda)
2. Extrae el valor aproximado en cada marca de eje x etiquetada
3. Identifica cualquier punto de cruce entre series
```

Limitaciones: Claude estima valores por proporción visual. En un gráfico con eje y de 0 a 1,000,000, la precisión se degrada para valores que están cerca uno del otro. Para extracción de datos de alta precisión, solicita los datos subyacentes de la fuente de datos — la extracción visual de gráficos es un respaldo cuando la fuente no está disponible.

---

## Combinación de Visión con MCP: Flujo de Trabajo de Captura de Pantalla de Playwright

El patrón multimodal más poderoso en Claude Code combina Playwright MCP (que toma capturas de pantalla programáticas) con capacidades de visión de Claude para crear un ciclo de prueba y corrección de bucle cerrado.

### Configuración

Instala y configura Playwright MCP:

```bash
npm install -g @playwright/mcp
```

Agrega a `.claude/settings.json`:
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp", "--browser", "chromium"]
    }
  }
}
```

### El Patrón de Bucle Cerrado

```
1. Navega a http://localhost:3000/checkout
2. Toma una captura de pantalla con Playwright MCP
3. Analiza la captura de pantalla: identifica regresiones visuales en comparación con el diseño esperado descrito a continuación
4. Si se encuentran regresiones, lee los archivos de componente relevantes y arréglelos
5. Toma una segunda captura de pantalla después de tu corrección
6. Confirma que la regresión está resuelta comparando las capturas de pantalla antes y después

Diseño esperado: cuadrícula de tres columnas de tarjetas de producto, cada una con imagen en la parte superior, título a continuación, precio en negrita en la esquina inferior izquierda, botón Agregar al Carrito en la esquina inferior derecha.
```

Claude Code ejecuta esto de forma autónoma:
- Playwright MCP navega por el navegador y captura capturas de pantalla
- Claude analiza cada captura de pantalla
- Claude lee archivos de fuente, realiza ediciones y vuelve a capturar para verificar

### Ejemplo de Navegación de Múltiples Pasos

```
Usando Playwright MCP:
1. Abre http://localhost:3000
2. Captura de pantalla de la página de inicio — describe lo que ves
3. Haz clic en el enlace "Iniciar Sesión"
4. Captura de pantalla del formulario de inicio de sesión — enumera cada campo de formulario presente
5. Completa email: test@example.com, contraseña: testpass123
6. Haz clic en Enviar
7. Captura de pantalla del resultado — ¿el inicio de sesión fue exitoso o falló? ¿Qué error, si lo hay, se muestra?
```

---

## Procesamiento de PDF

Claude procesa PDFs página por página, tratando cada página como una imagen renderizada.

**PDF de una página:**
```python
with open("invoice.pdf", "rb") as f:
    data = base64.standard_b64encode(f.read()).decode("utf-8")

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=2048,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "document",
                "source": {
                    "type": "base64",
                    "media_type": "application/pdf",
                    "data": data
                }
            },
            {"type": "text", "text": "Extrae todos los elementos de línea y totales de esta factura."}
        ]
    }]
)
```

**PDFs de múltiples páginas:** Claude procesa todas las páginas por defecto. Para PDFs largos donde solo páginas específicas son relevantes, especifica el rango en la indicación: "Enfócate en páginas 3–7. Ignora el apéndice."

El costo de token escala con el recuento de páginas — un PDF de 20 páginas cuesta aproximadamente 20 veces la tasa de una imagen única (~30,000–40,000 tokens solo para el PDF). Para PDFs grandes, extrae las páginas relevantes antes de enviar:

```bash
# Extrae páginas 3-7 de un PDF (requiere pdftk o ghostscript)
pdftk input.pdf cat 3-7 output extracted.pdf

# O con ghostscript
gs -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -dFirstPage=3 -dLastPage=7 \
   -sOutputFile=extracted.pdf input.pdf
```

---

## Limitaciones

| Limitación | Detalle |
|---|---|
| Sin video | Claude no puede procesar archivos de video o extraer fotogramas |
| Sin cámara en tiempo real | No hay capacidad de alimentación de cámara en vivo — las capturas de pantalla siempre son estáticas |
| Texto pequeño | El texto más pequeño que aproximadamente 8–10pt equivalente en resolución soportada no es confiable |
| Colores exactos | Los valores de color hexadecimal extraídos de capturas de pantalla son estimaciones, no exactos |
| UI compleja superpuesta | UIs densas con elementos superpuestos o efectos de transparencia reducen la precisión de identificación |
| Calidad de escritura a mano | La escritura a mano altamente degradada, scripts no latinos o formas de letras inusuales degradan la precisión de OCR |
| Precisión de gráficos | Los valores numéricos leídos de gráficos son aproximaciones basadas en proporción visual |
| Contenido animado | Los GIFs se leen como un único marco estático |

---

## Patrones de Indicativo para Tareas de Visión

Usa estos como plantillas de inicio, ajustando el formato de salida para tu uso descendente.

**Descripción general:**
```
Describe lo que ves en esta imagen. Sé específico — enumera componentes de IU, contenido de texto, colores, estructura de diseño y cualquier estado visible (error, cargando, vacío, activo).
```

**Extracción de texto:**
```
Extrae todo el texto visible en esta imagen. Preserva el orden de lectura. Usa formato markdown para reflejar jerarquía visual — títulos como ##, listas como puntos, negrita donde el texto aparece en negrita.
```

**Inventario de componentes:**
```
Identifica cada componente de IU en esta captura de pantalla. Para cada componente, proporciona:
- Tipo de componente (botón, entrada, modal, tarjeta, etc.)
- Texto visible o etiqueta
- Posición aproximada (arriba-izquierda, centro, abajo-derecha, etc.)
- Estado aparente (activo, deshabilitado, seleccionado, error)
```

**Extracción de datos estructurados:**
```
Extrae los datos mostrados en esta [tabla/gráfico/formulario] como JSON. Usa los encabezados de columna como claves. Incluye todas las filas visibles.
```

**Generación de código desde visual:**
```
Implementa este diseño como [componente React / HTML+CSS / vista SwiftUI]. Coincide exactamente con la estructura visual. Usa [Tailwind / estilos en línea / módulos CSS] para estilos. El componente debe ser independiente sin dependencias externas más allá del sistema de estilos especificado.
```

**Comparación de Diff:**
```
Te doy dos capturas de pantalla — antes y después de un cambio. Enumera cada diferencia visual que puedas identificar, sin importar cuán pequeña. Agrupa diferencias por categoría: diseño, color, tipografía, contenido, espaciado.
```

---

## Ejemplo Completo de Flujo de Trabajo: Captura de Pantalla a Cambio de Código

Este ejemplo de extremo a extremo toma una captura de pantalla de reporte de error y produce una corrección confirmada.

**Configuración:** Un usuario informa que el distintivo de notificación se superpone con el avatar en el encabezado en móvil.

**Paso 1 — Captura y análisis:**
```
Tengo una captura de pantalla de un bug de encabezado móvil en /tmp/header-bug.png.

Describe exactamente lo que ves — ¿dónde está el distintivo de notificación en relación con el avatar? ¿Cuál es la superposición?
```

Claude responde: "El distintivo de notificación (círculo rojo, arriba-derecha del avatar) se posiciona en `top: -4px; right: -4px` pero el contenedor del avatar tiene `overflow: hidden`, recortando el distintivo."

**Paso 2 — Localizar la fuente:**
```
Basándote en ese análisis, encuentra el componente de avatar en este código base. Busca un componente que renderice un avatar circular con un distintivo de notificación superpuesto.
```

Claude busca y encuentra `src/components/Avatar/Avatar.tsx`.

**Paso 3 — Generar la corrección:**
```
Lee Avatar.tsx y arregla el problema de desbordamiento. El distintivo debe ser completamente visible — no lo recortes. Preserva todos los tipos de prop y comportamiento existentes.
```

Claude edita el archivo, cambiando `overflow: hidden` en el contenedor a `overflow: visible` y ajustando el contenedor padre para manejar el recorte de radio de borde por separado.

**Paso 4 — Verificar:**
```
Usando Playwright MCP, navega a http://localhost:3000 en ancho de ventana gráfica de 375px y captura el encabezado. ¿El distintivo aparece completamente visible y sin recorte?
```

Claude toma la captura de pantalla, la analiza y confirma la corrección o itera.

---

## Tabla de Decisiones

| Tarea | Enfoque |
|---|---|
| Captura de pantalla de bug de IU → causa raíz | Pega captura de pantalla, describe comportamiento esperado, pide corrección de código |
| Mockup de Figma → componente | Captura de pantalla del marco de Figma, especifica framework y sistema de estilos |
| PDF escaneado → datos estructurados | Codifica base64, usa bloque de contenido de documento, especifica esquema de salida |
| Diagrama de arquitectura → Terraform | Captura de pantalla del diagrama, pide salida IaC específica del proveedor |
| Gráfico → CSV | Captura de pantalla del gráfico, pide JSON/CSV con niveles de confianza |
| Regresión visual automatizada | Captura de pantalla de Playwright MCP → análisis de Claude → bucle de edición automatizada |
| PDF grande (10+ páginas) | Extrae páginas relevantes antes de enviar; estima ~1500 tokens/página |
| Múltiples estados de IU | Envía todas las capturas de pantalla en un turno; pide a Claude que compare entre ellas |

---
