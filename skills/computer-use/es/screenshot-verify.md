---
name: screenshot-verify
description: Capturar y verificar que un cambio de código se ha renderizado correctamente — el ciclo "verlo funcionar" después de una edición.
---

# Verificar Captura de Pantalla

## Cuándo activar

- El usuario dice "verifica si se ve bien", "verifica que se ha renderizado el cambio", o "¿funciona visualmente?"
- Acabas de hacer una edición de código y quieres confirmar que el cambio es visible en la aplicación en ejecución antes de reportar que está hecho
- Una compilación se ha recargado y el usuario quiere confirmación de que la nueva versión está en vivo
- Necesitas cerrar el ciclo después de un cambio de CSS, diseño o componente — la edición sola no es prueba
- El usuario pregunta "¿puedes verlo funcionando?" o "muéstrame una captura después de la corrección"
- Depurando un cambio que "debería haber funcionado" — confirmando si el nuevo código realmente se está ejecutando
- Verificando que un indicador de características, variable de entorno, o cambio de configuración se ha aplicado visualmente

## Cuándo NO usar

- El cambio es puramente backend/API sin salida visual — usa ejecución de pruebas o registros en su lugar
- La aplicación no se está ejecutando y no puede iniciarse sin credenciales proporcionadas por el usuario o configuración del entorno
- El estado visual no se puede alcanzar sin iniciar sesión a través de una pantalla de credencial sensible
- El usuario dice explícitamente "solo ejecuta las pruebas, no verifiques visualmente"
- El cambio está en un componente sin salida renderizada (función de utilidad, definición de tipo, lógica solo del servidor)

## Instrucciones

### El ciclo de verificación

El ciclo de verificación es el ciclo mínimo para cerrar la brecha entre "hice un cambio" y "puedo ver el cambio funcionando":

```
EDITAR → RECARGAR → NAVEGAR → CAPTURA DE PANTALLA → AFIRMAR → REPORTAR
```

Cada fase se describe a continuación.

### Fase 1: EDITAR

Confirma que el cambio se ha guardado en el disco. Si hiciste la edición, está guardada. Si el usuario hizo la edición, pregunta: "¿Está guardado el archivo?" antes de proceder.

Anota el archivo exacto y la línea cambiada para saber qué salida visual esperar.

### Fase 2: RECARGAR

Desencadena una recarga de la aplicación en ejecución:

**Aplicación web (navegador)**:
- Si la sustitución de módulo en caliente (HMR) está activa, el cambio puede haberse recargado ya. Verifica la consola del navegador para actividad HMR.
- Si no, desencadena una recarga forzada: Cmd+Shift+R (macOS) o Ctrl+Shift+F5 (Windows).
- Espera a que el indicador de actividad de red se detenga antes de tomar una captura de pantalla.

**Aplicación nativa / Electron**:
- Verifica si la recarga en vivo está configurada. Si es así, espera el indicador de recarga.
- Si no hay recarga en vivo, pide al usuario que reinicie la aplicación o use el atajo de recarga propio de la aplicación.

**Aplicación renderizada del lado del servidor**:
- Confirma que el servidor de desarrollo ha recogido el cambio (vigila el registro de cambios de archivo en terminal).
- Recarga forzada del navegador.

**Archivo estático servido localmente**:
- Confirma que el archivo se sirve desde disco (no una versión en caché). Recarga forzada con omisión de caché.

### Fase 3: NAVEGAR

Navega a la vista exacta donde el cambio debe ser visible:

1. Anota la URL o ruta de pantalla antes de navegar.
2. Toma una captura de pantalla en la vista de destino antes de afirmar — esto es tu evidencia de que la pantalla correcta se cargó.
3. Si el cambio solo aparece después de una interacción del usuario (clic, pasar el ratón, entrada), realiza la interacción mínima necesaria para mostrarla.

No tomes una captura de pantalla de una página que aún se está cargando — espera a que el indicador de carga se elimine.

### Fase 4: CAPTURA DE PANTALLA

Captura la pantalla con precisión:

- Desplázate al área donde el elemento cambiado sea visible si es necesario.
- Si el cambio está en un componente específico, acércate a ese componente después de la captura de pantalla de página completa.
- Si comparas con un estado anterior, captura en la misma posición de desplazamiento y ancho de ventana gráfica que la captura anterior.
- Nombra la captura con el contexto: `[componente]-[estado]-despues.png` — no uses nombres genéricos como `captura1.png`.

### Fase 5: AFIRMAR

Examina la captura de pantalla y comprueba el cambio específico:

Para un **cambio de CSS** (color, fuente, espaciado, diseño):
- ¿Se ha aplicado visualmente el nuevo valor? Describe lo que ves.
- ¿Es consistente en todas las instancias del componente en esta pantalla?
- ¿Hay algún elemento adyacente que se vea roto como efecto secundario?

Para un **cambio de texto/contenido**:
- ¿Aparece el nuevo texto exactamente como se escribió en la edición?
- ¿Está en la ubicación correcta (no desplazado a un elemento diferente)?
- ¿Desapareció el texto antiguo?

Para un **componente o característica nuevo**:
- ¿Se renderiza el componente y es visible?
- ¿Está en la posición correcta en el diseño?
- ¿Responde a la interacción esperada (estado activo visible, etiqueta, icono)?

Para una **corrección de error**:
- ¿Ha desaparecido el estado previamente roto?
- ¿Está presente el estado corregido?
- Describe tanto el problema antiguo como el nuevo estado en la afirmación.

Para un **cambio de configuración o indicador de característica**:
- ¿Se muestra/oculta el contenido condicional como se esperaba?
- Comprueba la condición opuesta también si es posible — confirma que no se muestra cuando no debería.

### Fase 6: REPORTAR

Produce una declaración de verificación concisa después de la verificación de captura de pantalla:

**Formato de aprobación**:
```
Verificado: [qué se cambió]
Captura de pantalla muestra: [observación específica que confirma el cambio]
No se observaron regresiones en elementos adyacentes.
Estado: CONFIRMADO
```

**Formato de rechazo**:
```
Verificación fallida: [qué se cambió]
Esperado: [lo que la captura debe mostrar]
Observado: [lo que la captura realmente muestra]
Causa posible: [razón más probable — archivo no guardado, selector incorrecto, HMR no activo, compilación en caché]
Próximo paso: [acción específica para investigar]
Estado: NO CONFIRMADO
```

### Modos de error común y cómo diagnosticar

| Síntoma | Causa probable | Verificar |
|---|---|---|
| Cambio no visible después de recarga | Archivo no guardado, o archivo incorrecto editado | Confirma ruta de archivo y contenido |
| Versión anterior aún mostrando | Caché del navegador | Recarga forzada con Cmd+Shift+R |
| Cambio visible en lugar incorrecto | Selector CSS demasiado amplio | Inspecciona alcance del selector |
| Componente sin renderizar en absoluto | Error de importación, renderizado condicional, indicador de característica apagado | Verifica consola del navegador para errores |
| Cambio visible en dev pero no después de compilación | Paso de compilación necesario, no solo servidor de desarrollo | Ejecuta el paso de compilación |
| Aplicación muestra pantalla en blanco después de edición | Error de sintaxis en archivo editado | Verifica terminal/consola para error de compilación |

### Verificar en múltiples estados

Algunos cambios solo aparecen en estados específicos. Para cada estado relevante, ejecuta el ciclo de verificación independientemente:

- **Estado predeterminado** — renderizado inicial sin interacción del usuario
- **Estado activo/pasar el ratón** — después de interacción del ratón (toma captura mientras se pasa el ratón si es posible)
- **Estado de error** — con entrada inválida o una búsqueda fallida
- **Estado vacío** — sin datos cargados
- **Estado de carga** — inmediatamente después de desencadenar una búsqueda de datos

### Reglas de seguridad

- No interactúes con ningún formulario que pueda enviar datos como efecto secundario de navegar para verificar un cambio visual.
- Si la ruta de navegación para alcanzar la vista cambiada pasa a través de una pantalla sensible (pago, autenticación, salud), detente y pide al usuario que navegue allí manualmente, luego toma una captura desde ese punto.
- La verificación es observación de solo lectura — no hagas ediciones adicionales durante un ciclo de verificación. Si se detecta una regresión, reporta y espera instrucción.

## Ejemplo

**Escenario**: El desarrollador cambió el color del botón primario de azul a índigo en una configuración de Tailwind. Quiere confirmación de que el cambio está en vivo en toda la aplicación.

**Edición realizada**: `tailwind.config.js` — color `primary` actualizado de `#3B82F6` a `#6366F1`.

**Ciclo de verificación**:

1. **RECARGAR**: HMR del navegador está activo. Verifica terminal — mensaje "Tailwind config changed, rebuilding..." visible. Espera mensaje de completación de reconstrucción.

2. **NAVEGAR**: Ve a `http://localhost:3000` — página de inicio con botón primario "Get Started" visible.

3. **CAPTURA DE PANTALLA**: Captura página completa. Anota el botón primario.

4. **AFIRMAR**: El color de fondo del botón es visualmente índigo (tendencia púrpura) no azul. Coincide con el tono esperado `#6366F1`. Ningún otro elemento aparece roto. Los botones secundarios adyacentes aún grises.

5. Navega a `/pricing` — otro botón CTA primario presente. Captura de pantalla. Mismo color índigo aplicado. Consistente.

**Reporte**:
```
Verificado: Cambio de color del botón primario de azul (#3B82F6) a índigo (#6366F1)
Captura de pantalla muestra: Tanto el CTA de página de inicio como el CTA de página de precios muestran el nuevo color índigo
No se observaron regresiones — botones secundarios y terciarios sin cambios
Estado: CONFIRMADO
```

**Si el botón aún era azul**:
```
Verificación fallida: Cambio de color del botón primario
Esperado: Fondo del botón índigo (#6366F1)
Observado: Botón aún mostrando azul (#3B82F6)
Causa posible: JIT de Tailwind no recogió cambio de configuración, o navegador almacenó en caché CSS antiguo
Próximo paso: Verifica terminal para errores de reconstrucción; intenta recarga forzada con Cmd+Shift+R; confirma que tailwind.config.js esté en las rutas de contenido
Estado: NO CONFIRMADO
```
