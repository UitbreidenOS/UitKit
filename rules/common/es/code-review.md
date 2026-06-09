# Reglas de Revisión de Código

## Aplicar a
Todas las revisiones de solicitudes de extracción — conducta del autor y revisor.

## Reglas

### Como Autor

1. **Mantén los PRs pequeños y enfocados** — un cambio lógico por PR. Un PR que toca autenticación, facturación y enrutamiento simultáneamente son tres PRs. Los PRs más pequeños obtienen mejor revisión, se fusionan más rápido y revierten con claridad.

2. **Escribe la descripción del PR para el revisor, no para ti mismo** — explica qué cambió, por qué cambió y cuál es el riesgo. Incluye un plan de prueba. "Se corrigió un error" no es una descripción.

3. **Revísate a ti mismo antes de solicitar una revisión** — lee tu propio diff como si no hubieras escrito nada de él. Detecta errores tipográficos, artefactos de depuración, código comentado y casos límite faltantes antes de pedir a otros.

4. **Responde a cada comentario** — reconoce, resuelve o discute. El silencio señala desapego. Si no estás de acuerdo, dilo con razonamiento. Si estás de acuerdo, aplica el cambio y marca como resuelto.

5. **Anota opciones no obvias** — si hiciste algo sorprendente y la razón no está capturada en un comentario de código, explícalo en la descripción del PR o como respuesta a la pregunta esperada "¿por qué?".

### Como Revisor

6. **Distingue bloqueadores de sugerencias** — prefija los comentarios claramente: `bloqueador:`, `detalle:`, `pregunta:`, `sugerencia:`. Los revisores que marcan todo como bloqueador ralentizan la entrega. Reserva bloqueador para corrección y seguridad.

7. **Revisa la intención, no solo las líneas** — ¿el cambio logra lo que afirma la descripción del PR? ¿Hay casos límite que las pruebas no cubren? ¿Estarías cómodo siendo dueño de este código?

8. **Sugiere, no dictes estilo** — los comentarios de estilo deben referenciar una regla documentada. "Hubiera hecho así" no es un comentario bloqueador a menos que la regla exista. El estilo sin regla es preferencia.

9. **Aprueba cuando es suficientemente bueno, no perfecto** — el costo de un PR bloqueado se compone. Si los detalles restantes son menores y no bloqueadores, aprueba y deja que el autor decida. Perfecto es enemigo de enviado.

10. **No revises PRs obsoletos sin reconocer el rebase** — si un PR fue rebasado desde tu última revisión, anótalo y revisa el diff desde cero. Las revisiones obsoletas crean confianza falsa.

### Proceso

11. **Primera revisión dentro de un día hábil** — los PRs se pudren. El contexto se desvanece. Las revisiones demoradas desaniman a los autores y bloquean trabajo dependiente. Establece expectativas de equipo y honralas.

12. **Evita revisión por comité en cada PR** — un revisor requerido suele ser suficiente. Múltiples aprobadores requeridos para cada cambio crean cuellos de botella. Reserva requisitos de múltiples revisores para caminos de alto riesgo (autenticación, pagos, migraciones de datos).

13. **Verifica señales automatizadas antes de revisar** — CI debe pasar antes de revisión humana. Si las pruebas están fallando o el linting está roto, devuelve el PR al autor. No revises código que la máquina ya ha rechazado.

14. **No apruebes lo que no entiendes** — "LGTM" en código que no puedes explicar es un riesgo. Haz preguntas hasta que entiendas el cambio. Una pregunta no es un bloque.

15. **Documenta patrones que valga la pena repetir** — si una revisión expone un patrón que debe aplicarse ampliamente, no lo corrijas solo en este PR. Presenta una regla, agrega un lint, o actualiza la guía de codificación.

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
