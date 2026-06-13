---
description: Agregar o mejorar docstrings/JSDoc/anotaciones de tipo en todos los símbolos públicos en un archivo
argument-hint: "<archivo>"
---
Agregar o mejorar comentarios de documentación para cada símbolo público en: $ARGUMENTS

Reglas para lo que cuenta como un símbolo público:
- Python: todas las funciones/clases/métodos no prefijados con `_`, más constantes a nivel de módulo en `__all__` si están definidas.
- TypeScript/JavaScript: todas las funciones, clases, interfaces, alias de tipo y constantes exportadas.
- Go: todos los identificadores exportados (capitalizados).
- Rust: todos los elementos `pub`.
- Otros lenguajes: aplicar la distinción pública/privada convencional del lenguaje.

Para cada símbolo público que no está documentado o tiene una documentación débil/genérica:

1. Lee la implementación completa — no solo la firma.
2. Escribe un docstring que cubra:
   - **Qué** hace la función (una oración, imperativo: "Analiza...", "Devuelve...", "Valida...").
   - **Parámetros**: nombre, tipo (si no está en la firma), significado, restricciones, valor por defecto si es relevante.
   - **Valor de retorno**: qué es y bajo qué condiciones (incluyendo retornos `null`/`None`/`undefined`/error).
   - **Genera/Lanza**: cada tipo de excepción o error que el llamador debe manejar.
   - **Efectos secundarios**: E/S, mutaciones, llamadas de red — si hay alguno.
   - **Ejemplo**: un ejemplo de uso mínimo si la función es no trivial.
3. Usa el formato idiomático para el lenguaje del archivo:
   - Python: docstrings estilo Google (secciones Args / Returns / Raises).
   - TypeScript/JavaScript: JSDoc (`@param`, `@returns`, `@throws`).
   - Go: godoc (oración que comienza con el nombre del símbolo).
   - Rust: comentarios de doc `///` con sección `# Examples` para elementos no triviales.
4. NO cambies lógica, firmas o formato fuera de los comentarios de documentación.
5. NO agregues documentación a símbolos privados/internos a menos que ya tengan un comentario que necesites mejorar.
6. Si un docstring ya existe y es preciso, déjalo sin cambios. Si es inexacto o incompleto, reemplaza solo las partes deficientes.

Después de editar, imprime un resumen compacto:
- Cuántos símbolos fueron documentados (nuevos).
- Cuántos fueron mejorados.
- Enumera cualquier símbolo que omitiste y por qué.
