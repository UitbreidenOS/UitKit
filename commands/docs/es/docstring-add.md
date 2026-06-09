---
description: Añadir o mejorar docstrings/JSDoc/anotaciones de tipo en todos los símbolos públicos en un archivo
argument-hint: "<file>"
---
Añadir o mejorar comentarios de documentación para cada símbolo público en: $ARGUMENTS

Reglas para lo que cuenta como un símbolo público:
- Python: todas las funciones/clases/métodos no prefijados con `_`, más constantes a nivel de módulo en `__all__` si se definen.
- TypeScript/JavaScript: todas las funciones exportadas, clases, interfaces, alias de tipo y constantes.
- Go: todos los identificadores exportados (capitalizados).
- Rust: todos los elementos `pub`.
- Otros lenguajes: aplicar la distinción pública/privada convencional del lenguaje.

Para cada símbolo público que está sin documentar o tiene una documentación débil/placeholder:

1. Lee la implementación completa — no solo la firma.
2. Escribe una docstring que cubra:
   - **Qué** hace la función (una oración, imperativo: "Analiza...", "Retorna...", "Valida...").
   - **Parámetros**: nombre, tipo (si no está en la firma), significado, restricciones, valor por defecto si es relevante.
   - **Valor de retorno**: qué es y bajo qué condiciones (incluyendo retornos de `null`/`None`/`undefined`/`error`).
   - **Lanza/throws**: cada tipo de excepción o error que el llamador debe manejar.
   - **Efectos secundarios**: I/O, mutaciones, llamadas de red — si las hay.
   - **Ejemplo**: un ejemplo de uso mínimo si la función no es trivial.
3. Usa el formato idiomático para el lenguaje del archivo:
   - Python: docstrings estilo Google (secciones Args / Returns / Raises).
   - TypeScript/JavaScript: JSDoc (`@param`, `@returns`, `@throws`).
   - Go: godoc (oración que comienza con el nombre del símbolo).
   - Rust: comentarios de documentación `///` con sección `# Examples` para elementos no triviales.
4. NO cambies ninguna lógica, firmas o formato fuera de los comentarios de documentación.
5. NO añadas documentos a símbolos privados/internos a menos que ya tengan un comentario que necesites mejorar.
6. Si una docstring ya existe y es precisa, déjala sin cambios. Si es inexacta o incompleta, reemplaza solo las partes deficientes.

Después de editar, imprime un resumen compacto:
- Cuántos símbolos fueron documentados (nuevos).
- Cuántos fueron mejorados.
- Lista cualquier símbolo que omitiste y por qué.
