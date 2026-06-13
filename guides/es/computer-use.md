# Uso de computadora en Claude Code

El uso de computadora permite que Claude controle un entorno de escritorio — toma capturas de pantalla para ver la pantalla, luego envía clics del ratón, entrada de teclado y eventos de desplazamiento para interactuar con cualquier aplicación visible. No se requiere driver de navegador o API.

---

## Cómo funciona

Claude opera un bucle de retroalimentación:

1. Toma una captura de pantalla del estado actual del escritorio
2. Analiza lo que ve (ventanas de aplicación, botones, campos de texto, diálogos)
3. Decide la siguiente acción (clic en coordenadas, escribir texto, presionar una tecla)
4. Ejecuta la acción
5. Toma otra captura de pantalla para verificar el resultado
6. Repite hasta que se realiza la tarea

Cada captura de pantalla es una llamada de inferencia completa. Esto hace que el uso de computadora sea significativamente más lento y costoso que la automatización basada en CLI o API — planifica en consecuencia.

---

## Habilitación del uso de computadora

**Bandera CLI:**
```bash
claude --computer-use
```

**Archivo de configuración** (`settings.json`):
```json
{
  "computer_use": true
}
```

**Alternancia por sesión:** Escribe `/computer-use` para habilitar en la sesión actual.

El uso de computadora requiere que el modelo lo apoye. Claude Opus 4.7 se recomienda para tareas complejas de escritorio. Haiku no soporta uso de computadora.

---

## Acciones disponibles

| Acción | Descripción | Ejemplo |
|---|---|---|
| `screenshot` | Captura la pantalla actual | Observación de línea base |
| `click` | Clic izquierdo en coordenadas de píxeles | `click(450, 320)` |
| `right_click` | Clic derecho en coordenadas | Menús contextuales |
| `double_click` | Doble clic en coordenadas | Abrir archivos, activar campos |
| `type` | Escribe una cadena de texto | Completa campos de forma |
| `key` | Presiona una tecla o combinación | `key("ctrl+s")`, `key("Return")` |
| `scroll` | Desplaza en coordenadas | `scroll(400, 300, direction="down", amount=3)` |
| `drag` | Clic-mantener-arrastrar de punto a punto | Reordenar elementos, cambiar tamaño de ventanas |
| `move` | Mueve el ratón sin hacer clic | Disparar estados hover |

---

## Sistema de coordenadas

- Mapeo 1:1 de píxeles a la resolución actual de la pantalla
- El origen `(0, 0)` está en la esquina superior izquierda de la pantalla
- Resolución máxima: **2576px ancho, 3.75MP total** para Claude Opus 4.7
- Para pantallas de alto DPI (Retina), la resolución lógica y física difieren — Claude opera en píxeles lógicos

Si la pantalla es más grande que la resolución soportada, Claude trabajará en una versión reducida. Los elementos de interfaz de usuario objetivo pueden cambiar ligeramente. Prueba con registro de coordenadas explícita cuando la precisión es importante.

---

## Casos de uso

**Prueba de interfaz de usuario sin un driver de navegador**
Captura de pantalla antes y después de un cambio de CSS, compara diseños, verifica renderizado de componentes entre viewports.

**Automatización de formularios para herramientas sin API**
Completa formularios web, herramientas internas o aplicaciones de escritorio que no exponen interfaz programática.

**Extracción de datos desde aplicaciones de escritorio**
Lee valores mostrados en aplicaciones GUI (Excel, GUIs de base de datos, paneles) que no tienen opción de exportación.

**Automatización de instaladores sin CLI**
Pasos a través de instaladores de estilo asistente que requieren interacción GUI.

**Verificación de características implementadas**
Abre una URL en un navegador real (no headless), interactúa con la página como un usuario lo haría, captura de pantalla del resultado.

---

## Limitaciones

| Limitación | Detalle |
|---|---|
| Velocidad | Cada acción requiere una captura de pantalla (una inferencia). Las tareas complejas pueden tomar 10–30+ minutos. |
| Costo | Opus 4.7 a frecuencia de captura de pantalla es caro — presupuesta cuidadosamente |
| Paralelismo | Un escritorio a la vez; las acciones son estrictamente secuenciales |
| Precisión | Los clics basados en coordenadas pueden perder objetivos pequeños en DPI alto; usa descripciones de elementos cuando sea posible |
| Recuperación de estado | Si aparece un diálogo inesperado, Claude debe reconocerlo y descartarlo — esto agrega turnos |
| Sin deshacer | Los eventos de ratón y teclado son reales; el uso de computadora puede desencadenar acciones irreversibles |

---

## Seguridad

**Siempre usa `--dry-run` primero en flujos de trabajo destructivos:**
```bash
claude --computer-use --dry-run "Delete all files in the Downloads folder that are older than 30 days"
```

El modo dry-run registra cada acción planeada sin ejecutarla. Revisa el plan antes de permitir ejecución.

**Delimita tu prompt estrictamente.** El uso de computadora puede hacer clic en cualquier cosa visible — un prompt ampliamente delimitado como "clean up my desktop" puede desencadenar acciones no intencionadas. Nombra aplicaciones específicas, ventanas y operaciones.

**Establece `maxTurns` para tareas largas:**
```json
{
  "computer_use": true,
  "maxTurns": 50
}
```

Sin un límite de turno, un Claude confundido puede hacer bucles indefinidamente en un estado de UI atascado.

---

## Uso de computadora vs Playwright

| | Uso de computadora | Playwright |
|---|---|---|
| **Funciona en** | Cualquier interfaz de usuario visible (web, escritorio, aplicaciones nativas) | Solo web (Chromium, Firefox, WebKit) |
| **Velocidad** | Lento (captura de pantalla por acción) | Rápido (acceso directo a DOM) |
| **Confiabilidad** | Moderada (sensible a coordenadas) | Alta (basada en selector) |
| **Configuración** | Ninguna | `npm install playwright` |
| **Usar cuando** | No existe interfaz programática | Automatizar interfaces de usuario web |

**Regla de oro:** Usa Playwright para automatización web. Usa uso de computadora solo cuando no hay ruta de automatización de navegador — aplicaciones de escritorio nativas, aplicaciones web que evitan detección headless o herramientas que requieren una sesión GUI autenticada real.

---

## Ejemplo: Prueba de captura de pantalla automatizada

Compara interfaz de usuario antes y después de un cambio de CSS:

```
You have computer use enabled.

1. Open http://localhost:3000/dashboard in Chrome
2. Take a screenshot and save it to /tmp/before.png
3. I'm going to make a CSS change — wait for me to say "done"
4. After I say done, take a second screenshot and save it to /tmp/after.png
5. Compare the two screenshots and describe any visual differences you see
```

Para una versión no interactiva (rutina o paso de CI):

```
You have computer use enabled.

Open http://localhost:3000/dashboard in Chrome. 
Take a screenshot.
Compare it to the reference screenshot at /tmp/reference.png.
Report any layout differences, missing elements, or color changes.
Write your findings to /tmp/visual-diff-report.md.
```

---
