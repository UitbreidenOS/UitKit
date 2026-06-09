# Reglas de Accesibilidad

## Aplicar a
Todo código de UI — HTML, JSX, TSX, motores de plantillas, componentes del sistema de diseño.

## Reglas

1. **HTML semántico primero** — usa `<button>`, `<nav>`, `<main>`, `<article>`, `<header>` antes de recurrir a `<div>` + ARIA. El elemento correcto transmite rol, estado y comportamiento de teclado de forma gratuita.

2. **Todos los elementos interactivos deben ser operables con el teclado** — focalizables, activables con Enter/Space, navegables con Tab/Shift-Tab. Nunca suprimas el contorno de enfoque sin proporcionar un indicador visual equivalente.

3. **Todas las imágenes necesitan texto `alt`** — las imágenes decorativas usan `alt=""`. Las imágenes informativas describen el contenido, no la apariencia: `alt="Error: fallo en el envío del formulario"` no `alt="icono rojo"`.

4. **El color por sí solo no puede transmitir significado** — empareja el color con texto, icono o patrón. Un borde rojo en un campo inválido necesita un mensaje de error. Los gráficos necesitan puntos de datos etiquetados o patrones.

5. **Relación de contraste mínima: 4.5:1 para texto normal, 3:1 para texto grande y componentes de UI** — prueba con una herramienta (axe, Lighthouse, Stark). Nunca estimes el contraste a simple vista.

6. **Etiqueta cada control de formulario** — usa `<label for="id">` o `aria-label` o `aria-labelledby`. El texto del marcador de posición no es una etiqueta — desaparece y tiene bajo contraste.

7. **Anuncia cambios de contenido dinámico** — cuando el contenido se actualiza sin recargar la página, usa `aria-live="polite"` para actualizaciones no urgentes, `aria-live="assertive"` solo para errores o alertas sensibles al tiempo.

8. **Nunca elimines `tabindex="-1"` para ocultar elementos del teclado sin también ocultarlos visualmente** — usa `display: none` o `visibility: hidden` o el atributo `hidden` para eliminar tanto del orden de enfoque como del flujo visual simultáneamente.

9. **Los widgets personalizados deben implementar el patrón ARIA Authoring Practices** — los modales atrapan el enfoque. Los menús usan teclas de flecha. Los acordeones usan Enter/Space. No inventes modelos de interacción.

10. **Prueba con un lector de pantalla antes de entregar UI interactiva** — VoiceOver (macOS/iOS) o NVDA (Windows). Las herramientas automatizadas detectan ~30% de los problemas; las pruebas manuales son innegociables para flujos críticos.

11. **Los encabezados forman un esquema lógico, nunca saltes niveles** — `h1` → `h2` → `h3`. Los encabezados comunican la estructura del documento, no el tamaño visual. Usa CSS para el tamaño.

12. **Los mensajes de error son específicos y están asociados con su campo** — "Requerido" es insuficiente. "Se requiere dirección de correo electrónico" emparejado con `aria-describedby` apuntando al elemento de error es correcto.

13. **No reproduzcas automáticamente audio o video con sonido** — proporciona controles de reproducir/pausar. El contenido parpadeante superior a 3 Hz puede desencadenar convulsiones — evita o proporciona una advertencia.

14. **Los objetivos de toque mínimo son 44×44 píxeles CSS** — se aplica a interfaces móviles y táctiles. Los objetivos pequeños fallan en usuarios con discapacidades motoras y pulgares.

15. **Ejecuta `axe-core` o `eslint-plugin-jsx-a11y` en CI** — detecta regresiones automáticamente. Cero violaciones de accesibilidad en verificaciones automatizadas es el piso, no el techo.


---

> **Trabaja con nosotros:** Claudient cuenta con el respaldo de [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
