---
description: Identificar y corregir roturas de diseño responsivo para un archivo o componente determinado
argument-hint: "[file] [breakpoint: sm|md|lg|xl]"
---
Corregir problemas de diseño responsivo en: $ARGUMENTS

Analizar argumentos: el primer token es el archivo de destino; el nombre del punto de quiebre opcional limita el alcance a ese punto de quiebre solamente. Si no se proporciona punto de quiebre, auditar todos los puntos de quiebre estándar.

**Paso 1 — Identificar el sistema de puntos de quiebre**
Escanear el proyecto en busca de:
- Configuración de Tailwind (`tailwind.config.*`) para extraer puntos de quiebre personalizados
- Propiedades personalizadas de CSS o variables SCSS que definen puntos de quiebre
- Valores de consultas de medios utilizados en hojas de estilo existentes
Utilizar los nombres y valores de puntos de quiebre del proyecto — no inventar ni anular.

**Paso 2 — Auditar el diseño en cada punto de quiebre**
Verificar estos patrones de fallo:

Desbordamiento y recorte:
- Valores de `width` o `height` fijos en contenedores que deberían ser fluidos
- `min-width` mayor que la ventana gráfica en ese punto de quiebre
- `white-space: nowrap` en texto que se desbordará en pantallas estrechas

Flexbox / Grid:
- `flex-wrap: nowrap` causando desbordamiento en pantallas pequeñas
- Columnas de cuadrícula con unidades `fr` que colapsan a anchos ilegibles
- Falta de `min-width: 0` en elementos secundarios flex/grid que contienen contenido desbordante

Espaciado:
- Valores fijos de `padding` o `margin` que consumen espacio desproporcionado en dispositivos móviles
- Elementos con posición absoluta con desplazamientos fijos que escapan de su contenedor en anchos estrechos

Tipografía:
- Valores de `font-size` que no se escalan hacia abajo — marcar si no se usa `clamp()` o clase responsiva
- Longitudes de línea (`max-width`) no ajustadas para pantallas pequeñas

Imágenes y multimedia:
- Falta de `max-width: 100%` en imágenes dentro de contenedores fluidos
- `aspect-ratio` no establecido en multimedia que causa cambio de diseño

**Paso 3 — Aplicar correcciones**
Para cada problema encontrado:
- Editar el archivo directamente
- Utilizar clases de utilidad responsivas del proyecto (p. ej., `sm:`, `md:` de Tailwind) o consultas de medios que coincidan con el patrón existente
- No reescribir código que funciona — ediciones quirúrgicas y mínimas solamente

**Paso 4 — Reportar**
Después de aplicar las correcciones, listar: `file:line | breakpoint | issue | fix applied`

Si el componente requiere verificación visual, anotar qué puntos de quiebre verificar manualmente en el navegador.
