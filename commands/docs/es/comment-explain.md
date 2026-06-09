---
description: Agrega comentarios explicativos a secciones de código complejas o no obvias
argument-hint: "[file or function]"
---
Agrega comentarios explicativos al código en: $ARGUMENTS

Reglas:
- Comenta el POR QUÉ, no el QUÉ. Nunca repitas lo que el código ya dice.
- Un buen comentario explica: una restricción oculta, una elección de algoritmo no obvia, una peculiaridad
  de una API externa, una compensación de rendimiento, o un invariante que debe cumplirse.
- Mal comentario: `// incrementar i` — el código ya lo dice.
- Buen comentario: `// omitir índice 0 — la API devuelve un valor centinela allí, no datos reales`.

Proceso:
1. Lee el archivo o función completo antes de escribir nada.
2. Identifica cada bloque que haría que un lector competente se detenga y pregunte "¿por qué?".
3. Para cada bloque, escribe un comentario de una sola línea (o máximo dos líneas) arriba.
4. Si una función o método tiene un contrato no obvio (precondiciones, efectos secundarios, requisito de orden),
   agrega un breve comentario de encabezado que indique solo lo que no es obvio de la firma.
5. Elimina cualquier comentario existente que solo describa lo que hace el código — agregan ruido.
6. No agregues un comentario a cada función. Solo donde existe ambigüedad genuina.

Estilo de comentario:
- Coincide con el estilo de comentario existente en el archivo (idioma, formato, capitalización).
- Para JavaScript/TypeScript: `//` para inline, `/** */` solo para JSDoc de API pública.
- Para Python: `#` inline; docstrings solo para funciones/clases públicas, una línea si es posible.
- Sin comentarios de bloque que expliquen secciones completas a menos que la sección sea un algoritmo no trivial.

Después de editar:
- Reporta cada ubicación donde agregaste o eliminaste un comentario con archivo:línea y una razón de una oración
  para el cambio.
- No reformatees el código circundante. Solo ediciones quirúrgicas.
- Si $ARGUMENTS apunta a un directorio completo, procesa cada archivo pero omite archivos generados,
  código vendido, y fixtures de prueba.
