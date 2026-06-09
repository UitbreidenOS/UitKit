---
description: Audita un componente o página en busca de violaciones de WCAG 2.1 AA y emite una lista de correcciones priorizada
argument-hint: "[file-or-directory]"
---
Realiza una auditoría de accesibilidad WCAG 2.1 AA en: $ARGUMENTS

Si no se proporciona un argumento, audita el archivo actualmente abierto o el directorio `src/`.

Lista de verificación de auditoría — evalúa cada criterio e identifica violaciones con referencias file:line:

**Perceptible**
- 1.1.1 Contenido no textual: cada `<img>`, `<svg>`, `<canvas>` tiene un `alt` o `aria-label` significativo; las imágenes decorativas usan `alt=""`
- 1.3.1 Información y relaciones: se utiliza correctamente HTML semántico (`<nav>`, `<main>`, `<header>`, `<section>`, `<article>`); sin tablas de diseño
- 1.3.2 Secuencia significativa: el orden del DOM coincide con el orden visual; sin reordenamiento solo CSS que rompa el flujo del lector de pantalla
- 1.4.1 Uso del color: la información no se transmite únicamente por color
- 1.4.3 Contraste: contraste de texto ≥ 4.5:1 (normal), ≥ 3:1 (grande); verifica los valores de color calculados
- 1.4.4 Cambiar tamaño del texto: el diseño sobrevive al zoom del 200% sin desplazamiento horizontal ni pérdida de contenido
- 1.4.10 Reflujo: sin desplazamiento bidimensional en ancho de viewport de 320px

**Operable**
- 2.1.1 Teclado: todos los elementos interactivos son accesibles y operables únicamente mediante teclado
- 2.1.2 Sin trampa de teclado: el foco siempre puede dejar cada componente
- 2.4.3 Orden del foco: la secuencia de tabulación lógica coincide con el flujo visual
- 2.4.7 Foco visible: todos los elementos enfocables tienen un indicador de foco visible (no solo el predeterminado del navegador)
- 2.4.6 Encabezados y etiquetas: los encabezados son jerárquicamente correctos (h1 → h2 → h3); sin niveles omitidos

**Comprensible**
- 3.1.1 Idioma de la página: `<html lang="...">` se establece correctamente
- 3.2.2 En la entrada: sin cambios de contexto inesperados en enfoque o entrada
- 3.3.1 Identificación de errores: los errores del formulario se identifican en texto y se asocian con el campo mediante `aria-describedby`
- 3.3.2 Etiquetas o instrucciones: cada campo de formulario tiene una etiqueta visible o `aria-label`

**Robusto**
- 4.1.2 Nombre, rol, valor: los componentes interactivos personalizados exponen rol ARIA, estado y propiedad correctos
- 4.1.3 Mensajes de estado: el contenido dinámico utiliza regiones `aria-live` apropiadamente

Formato de salida:
1. Línea de resumen: `N violaciones encontradas (X críticas, Y serias, Z moderadas)`
2. Tabla de violaciones: `| file:line | criterion | severity | issue | fix |`
3. Después de la tabla, emite el código corregido para cada violación en línea — no solo describas cambios, aplícalos

Escala de gravedad: crítica (bloquea usuarios de lector de pantalla), seria (falla WCAG), moderada (brecha de práctica recomendada).
