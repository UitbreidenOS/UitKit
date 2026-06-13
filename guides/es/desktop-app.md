# Aplicación de escritorio Claude Code

Guía completa del espacio de trabajo basado en paneles introducido en Claude Code v1.2581.0.

---

## Descripción general

La aplicación de escritorio Claude Code no es una ventana de chat con una barra lateral. Es un espacio de trabajo completamente basado en paneles — múltiples paneles redimensionables independientemente que Claude y el desarrollador comparten simultáneamente. Cada tipo de panel sirve un propósito distinto y se componen en diseños guardados por proyecto.

**Requisitos:** Escritorio v1.2581.0 o posterior. Descargue desde [claude.ai/code](https://claude.ai/code).

El cambio fundamental desde Claude Code terminal: ya no cambia de contexto entre su editor, navegador y terminal. El espacio de trabajo los sostiene a todos y Claude puede ver e interactuar con los mismos paneles que usted.

---

## Sistema de paneles

### Tipos de paneles

**Panel de chat**
La interfaz de conversación principal. Siempre presente — no se puede cerrar. Todos los mensajes, respuestas y resúmenes de llamadas de herramientas aparecen aquí.

**Panel de diferencia** — `Cmd+Shift+D`
Visor de diferencia interactivo. Muestra diferencias por turno, no solo el estado final acumulativo. Navegue hacia atrás a través de turnos para ver exactamente qué cambió cuándo. Desglose por archivo con secciones expandibles. Admite comentarios en línea en líneas específicas.

**Panel de vista previa** — `Cmd+Shift+P`
Renderiza archivos HTML en vivo sin navegador y abre PDF, imágenes y videos en línea. Actualizaciones automáticas cuando el archivo cambia en el disco. Claude puede usar este panel para verificación visual — tomar capturas de pantalla e inspeccionar el DOM — sin dejar el espacio de trabajo. La opción `Sesiones persistentes` conserva cookies y estado de auth en reinicios.

**Panel de terminal** — `Ctrl+\``
Terminal integrado. Se ejecuta dentro del directorio del proyecto. Útil para ejecutar pruebas, ver registros o emitir comandos en paralelo a una sesión de Claude activa sin cambiar ventanas.

**Panel de archivo**
Se abre cuando hace clic en cualquier ruta de archivo mencionada en el chat o visor de diferencia. Proporciona un editor directo para ediciones específicas. Guarda en disco inmediatamente al guardar. Advierte si el archivo cambió en el disco desde que lo abrió. No es un IDE completo — adecuado para ediciones enfocadas, no para refactors estructurales grandes.

**Panel de plan**
Visible durante el modo de plan. Muestra el plan actual de Claude como una lista estructurada. Se actualiza a medida que Claude revisa el plan durante la tarea.

**Panel de tareas**
Vista de lista de tareas. Muestra tareas activas y completadas en la sesión actual.

**Panel de subagente**
Muestra subagentes en ejecución y su estado actual — qué herramienta ejecuta cada uno, si está bloqueado esperando entrada y cuándo se completa. Útil para monitorear trabajo de agente paralelo sin encuestar el chat.

### Controles de panel

| Acción | Método |
|---|---|
| Reposicionar panel | Arrastrar encabezado del panel |
| Cambiar tamaño de panel | Arrastrar borde del panel |
| Cerrar panel enfocado | `Cmd+\` |
| Abrir paneles adicionales | Menú Vistas |

Los diseños se guardan por proyecto. La reapertura de un proyecto restaura el último arreglo de panel utilizado.

---

## Sesiones paralelas

La barra lateral de sesiones a la izquierda enumera todas las sesiones activas para la ventana actual. Haga clic para cambiar entre ellas. Cada sesión tiene contexto independiente — cambiar no interrumpe la otra sesión.

`Cmd+;` abre un **chat lateral** que no afecta el historial de sesión principal. El chat lateral ve el contexto actual completo pero no deja rastro en la conversación cuando se cierra. Úselo para preguntas rápidas durante la tarea — verificar un valor, preguntar sobre un patrón — sin contaminar la sesión con exploraciones de ida y vuelta.

Arrastre y suelte paneles para organizar vistas paralelas en sesiones. Un diseño común: chat de sesión principal a la izquierda, panel de subagente a la derecha, visor de diferencia en la parte inferior.

---

## Panel de vista previa

El panel de vista previa es el panel de mayor palanca para trabajo frontal y de documentos.

- Abre HTML renderizado en vivo — los cambios en el archivo en el disco aparecen inmediatamente, sin recarga del navegador
- Abre PDF, imágenes y archivos de video en línea
- Claude puede tomar una captura de pantalla de la vista previa y usarla como verificación visual antes de confirmar un cambio
- Claude puede inspeccionar el DOM a través del panel de vista previa, detectando problemas de diseño sin una sesión de devtools de navegador separada
- `Sesiones persistentes` mantiene cookies y estado de auth en reinicios — útil para previsualizar estados de UI autenticados
- El panel se actualiza automáticamente al guardar archivo — sin actualización manual

Utilice esto en lugar de un navegador para iterar en la IU. Mantenga el panel de vista previa abierto junto al panel de chat al trabajar en cualquier archivo HTML, CSS o plantilla.

---

## Panel de editor de archivo

Haga clic en cualquier ruta de archivo en la salida de chat o visor de diferencia para abrir el archivo en el panel de editor de archivo.

- Las ediciones se guardan en disco inmediatamente al guardar
- El panel advierte si el archivo fue modificado en el disco desde que lo abrió
- Útil para revisar escrituras de Claude y hacer pequeñas correcciones directamente
- No destinado para grandes refactors — abra un IDE apropiado para esos

---

## Visor de diferencia

El visor de diferencia muestra diferencias por turno, no solo el estado acumulado final.

- Navegue por turno usando el selector de turno en la parte superior del panel
- Vea exactamente qué líneas cambiaron en qué respuesta
- Desglose por archivo con secciones expandibles
- Agregue comentarios en línea en líneas específicas — los comentarios son visibles para Claude en turnos posteriores

Abra con `Cmd+Shift+D`. Útil al revisar una tarea larga de múltiples pasos para entender la secuencia de cambios, no solo el resultado.

---

## Auto-archivo

Las sesiones se archivan automáticamente cuando la solicitud de extracción vinculada se fusiona. Las sesiones archivadas se eliminan de la barra lateral de sesiones activas pero siguen siendo buscables. Reabra cualquier sesión archivada desde la pestaña Archivo.

El archivado manual también está disponible: haga clic derecho en cualquier sesión en la barra lateral para archivarlo inmediatamente.

---

## Atajos de teclado

| Acción | Atajo |
|---|---|
| Abrir panel de diferencia | `Cmd+Shift+D` |
| Abrir panel de vista previa | `Cmd+Shift+P` |
| Abrir panel de terminal | `Ctrl+\`` |
| Abrir chat lateral | `Cmd+;` |
| Cerrar panel enfocado | `Cmd+\` |
| Nueva sesión | `Cmd+N` |
| Cambiar a sesión 1–9 | `Cmd+[1-9]` |
| Enviar mensaje | `Enter` |
| Nueva línea en mensaje | `Shift+Enter` |

---

## Temas personalizados

Establezca tema Claro, Oscuro o Sistema a través de `/config`. Para usuarios avanzados, la inyección de CSS personalizada está disponible — inyecte una hoja de estilo para anular cualquier elemento visual en el espacio de trabajo. Esta es una opción avanzada sin garantía de estabilidad de API oficial.

---

## Consejos

- Mantenga el panel de vista previa abierto al iterar en cualquier IU. Claude lo usará para verificación visual antes de declarar una tarea completada.
- Utilice `Cmd+;` para chats laterales durante tareas activas — haga una pregunta rápida sobre la base de código sin que aparezca en el contexto de sesión que Claude continúa.
- Abra un panel de terminal junto al chat al ejecutar pruebas. Ejecute la suite de pruebas directamente sin dejar el espacio de trabajo.
- El panel del subagente muestra estado en tiempo real para agentes paralelos — verifíquelo en lugar de pedirle a Claude una actualización de estado.
- Arrastre sesiones en la barra lateral para reordenarlas. Mantenga las sesiones más activas en la parte superior.
- La navegación por turno del visor de diferencia es la forma más rápida de revisar lo que una tarea de agente largo realmente hizo — úsela antes de fusionar.

---
