---
description: Agregar comentarios explicativos a secciones de código complejas u obvias
argument-hint: "[archivo o función]"
---
Agregar comentarios explicativos al código en: $ARGUMENTS

Reglas:
- Comentar el POR QUÉ, no el QUÉ. Nunca reexpones lo que el código ya dice.
- Un buen comentario explica: una restricción oculta, una elección de algoritmo no obvia, una particularidad
  de una API externa, una compensación de desempeño, o una invariante que debe mantenerse.
- Mal comentario: `// incrementar i` — el código ya lo dice.
- Buen comentario: `// saltar índice 0 — la API devuelve un valor centinela ahí, no datos reales`.

Proceso:
1. Leer el archivo o función objetivo completamente antes de escribir nada.
2. Identificar cada bloque que causaría que un lector competente se pause y pregunte "¿por qué?".
3. Para cada uno de estos bloques, escribir un comentario de una sola línea (o máximo dos líneas) encima.
4. Si una función o método tiene un contrato no obvio (precondiciones, efectos secundarios, requisitos de orden),
   agregar un comentario de encabezado corto que indique solo lo que no es obvio desde la firma.
5. Eliminar cualquier comentario existente que simplemente describa lo que hace el código — agregan ruido.
6. No agregar un comentario a cada función. Solo donde existe ambigüedad genuina.

Estilo de comentario:
- Coincidir con el estilo de comentario existente en el archivo (idioma, formato, capitalización).
- Para JavaScript/TypeScript: `//` para línea, `/** */` solo para JSDoc de API pública.
- Para Python: `#` en línea; docstrings solo para funciones/clases públicas, una línea si es posible.
- Sin comentarios de bloque explicando secciones completas a menos que la sección sea un algoritmo no trivial.

Después de editar:
- Reportar cada ubicación donde agregó o eliminó un comentario con archivo:línea y una razón de una sola oración
  para el cambio.
- No reformatear el código circundante. Solo ediciones quirúrgicas.
- Si $ARGUMENTS apunta a un directorio completo, procesar cada archivo pero saltar archivos generados,
  código vendido, y accesorios de prueba.
