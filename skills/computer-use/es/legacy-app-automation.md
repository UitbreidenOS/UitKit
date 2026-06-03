---
name: legacy-app-automation
description: Automatiza aplicaciones de escritorio o heredadas sin API mediante la automatización por computadora — interacción lenta, verificada y segura con aplicaciones Win32, VB6, mainframe y de cliente pesado.
---

# Automatización de Aplicaciones Heredadas por Computadora

## Cuándo activar

- La aplicación de destino no tiene API, CLI, interfaz programable, ni interfaz web
- La aplicación es una aplicación de escritorio nativa: Win32, MFC, VB6, Delphi, PowerBuilder, Java Swing, Electron heredado
- El usuario necesita extraer datos de una aplicación que solo los muestra en pantalla
- Automatizar entrada de formularios repetitiva en una aplicación ERP, CRM o de línea de negocio de cliente pesado
- El usuario dice "no hay otra forma de hacer esto" o "el proveedor no tiene API"
- Automatización de terminal mainframe (3270/5250) donde no existe un conector moderno
- Migrar datos de un sistema heredado que solo puede exportar mediante diálogos impulsados por la interfaz de usuario

## Cuándo NO usar

- La aplicación tiene una API, conexión de base de datos o función de exportación — usa esas en su lugar; la automatización por computadora es el último recurso
- La automatización requiere interactuar con pantallas de entrada de credenciales (inicio de sesión con contraseña, códigos MFA) — detente y pide al usuario que se autentique manualmente primero
- La pantalla contiene diálogos de confirmación de transacciones financieras (transferencias, envíos de pago) — requiere confirmación explícita del usuario por acción
- La aplicación es inestable o se sabe que falla — no automatices software inestable; el riesgo de dejar datos en un estado corrupto es demasiado alto
- No puedes verificar el resultado de cada acción (la aplicación no proporciona retroalimentación visual) — hacer clic a ciegas no es aceptable
- La tarea requiere velocidad sobre seguridad — la automatización de aplicaciones heredadas debe ser lenta y verificada; si la velocidad es la prioridad, encuentra un enfoque diferente

## Instrucciones

### Evaluación inicial

Antes de tocar nada:

1. Toma una captura de pantalla completa de la aplicación en su estado inicial.
2. Identifica y documenta:
   - Nombre y versión de la aplicación (visible en la barra de título o diálogo Acerca de)
   - Pantalla/vista actual
   - Qué datos o acción es el objetivo
   - Cualquier diálogo de advertencia o aviso de confirmación que pueda aparecer
3. Pregunta al usuario: "¿Ya has iniciado sesión? ¿Hay algún aviso de confirmación que deba tener en cuenta?"
4. Establece un plan de recuperación: ¿qué hace el usuario si la automatización deja la aplicación en un mal estado?

### El principio de lento y verificado

Las aplicaciones heredadas son frágiles. Un clic en el elemento incorrecto, una pulsación de tecla que llega mientras un diálogo aún se está cargando, o un evento de enfoque en el campo incorrecto puede corromper datos o desencadenar acciones irreversibles.

Cada acción sigue esta secuencia — sin excepciones:

```
1. OBSERVAR  — captura de pantalla, confirma que la aplicación está en el estado esperado
2. LOCALIZAR — identifica el elemento de destino exacto (por etiqueta, posición, orden de tabulación)
3. NARRAR    — indica qué estás a punto de hacer y cuál debe ser el resultado
4. ACTUAR    — realiza la acción única y mínima
5. ESPERAR   — pausa para que la aplicación responda (las aplicaciones heredadas suelen ser lentas; espera al cambio visual)
6. VERIFICAR — captura de pantalla, confirma que el resultado coincidió con la expectativa
7. REGISTRAR — registra el resultado del paso antes de proceder
```

Nunca encadenes dos acciones sin completar el paso de verificación para la primera.

### Patrones de interacción para aplicaciones heredadas

**Enfoque basado en teclado**: Muchas aplicaciones heredadas tienen objetivos de clic de ratón poco confiables. Prefiere navegación por teclado:
- Tabulación para ciclar a través de campos
- Intro para confirmar
- Alt+[letra subrayada] para aceleradores de menú
- Teclas F para acciones comunes (F3 búsqueda, F4 nuevo, F8 enviar — varía según la aplicación)

**Temporización**: Inserta pausas deliberadas después de:
- Abrir una nueva pantalla (espera a que la pantalla se renderice completamente)
- Guardar un registro (espera el indicador de confirmación)
- Ejecutar una consulta o búsqueda (espera a que se carguen los resultados)
- Cualquier llamada de red (la barra de estado a menudo muestra actividad)

**Disciplina de entrada de campo**:
1. Haz clic o tabula al campo.
2. Triple clic para seleccionar el contenido existente (no asumas que el campo está vacío).
3. Escribe el nuevo valor.
4. Captura de pantalla para confirmar que el valor se ingresó correctamente antes de proceder.

**Diálogos de confirmación**: Cuando aparece un diálogo de confirmación:
- Captura de pantalla de inmediato.
- Lee el texto exacto del diálogo — no asumas.
- Si el diálogo es para una acción destructiva o irreversible, detente y pide al usuario que confirme antes de hacer clic en OK.

### Reglas de seguridad — obligatorias

- **Nunca automatices transacciones financieras** (pagos, transferencias, asientos contables, facturas) sin que el usuario confirme explícitamente cada transacción antes de que hagas clic en OK/Enviar.
- **Nunca ingreses ni interactúes con campos de credenciales** (contraseñas, tokens, PINs). Pide al usuario que inicie sesión manualmente antes de comenzar.
- **Nunca interactúes con pantallas que contengan datos de salud** (registros de pacientes, resultados de laboratorio, recetas) sin confirmar que el usuario tiene la autorización adecuada y el entorno es apropiado.
- **Detente en pantallas inesperadas**: si aparece una pantalla que no era parte del flujo planeado (error, diálogo inesperado, vista incorrecta), detente por completo, captura de pantalla e informa al usuario antes de hacer nada más.
- **Sin acciones masivas irreversibles**: no automatices eliminaciones masivas, actualizaciones en lote ni envíos por lotes sin un punto de control de revisión humana después de un lote piloto pequeño.

### Patrón de extracción de datos

Cuando el objetivo es leer/exportar datos de una aplicación heredada:

1. Navega a la vista de datos.
2. Captura de pantalla de cada pantalla de datos.
3. Si la aplicación tiene una función de impresión o exportación (incluso a un diálogo de impresora), úsala — una exportación PDF es más segura que la transcripción manual.
4. Si la transcripción es inevitable, transcribe campos visibles un registro a la vez, captura de pantalla de cada registro como evidencia.
5. Después de la extracción, valida una muestra de valores extraídos contra la fuente en pantalla.

### Patrón de entrada de formulario

Cuando el objetivo es ingresar datos en la aplicación heredada:

1. El usuario proporciona los datos en un formato estructurado (CSV, lista, JSON) antes de que comience la automatización.
2. Procesa un registro a la vez.
3. Después de que cada registro se guarde, captura de pantalla la confirmación y registra el ID del registro o mensaje de confirmación.
4. Si algún registro falla, detén el lote, informa de la falla y espera instrucción del usuario antes de continuar.

### Recuperación y manejo de errores

Si la aplicación entra en un estado inesperado:

1. No hagas clic en nada. Captura de pantalla primero.
2. Busca una tecla Escape o botón Cancelar para salir de manera segura de la operación actual.
3. Comprueba si la operación ya se ha confirmado (busca un mensaje de estado de éxito/falla).
4. Informa al usuario del estado exacto de la pantalla y solicita orientación.
5. No intentes "arreglar" un estado desconocido adivinando — detente e informa.

## Ejemplo

**Escenario**: Exporta 50 registros de clientes de un CRM heredado VB6 que no tiene función de exportación. Cada registro debe abrirse individualmente y transcribir campos clave.

**Aplicación**: "CustomerBase 2.4" — aplicación VB6, la vista de lista muestra IDs de clientes, doble clic abre la pantalla de detalle.

**Ejecución**:

1. Captura de pantalla: Confirma que la aplicación está abierta en la vista de lista de clientes. 50 registros visibles.
2. Doble clic en el primer registro (ID de cliente: 10042). Espera la pantalla de detalle.
3. Captura de pantalla: Pantalla de detalle cargada — Nombre, Teléfono, Correo electrónico, Tipo de cuenta visibles.
4. Transcribe: `{"id": "10042", "name": "Acme Corp", "phone": "555-0192", "email": "billing@acme.com", "type": "Enterprise"}`.
5. Captura de pantalla: Confirma que los valores transcritos coinciden con los valores en pantalla.
6. Presiona Escape para volver a la lista. Captura de pantalla: Vista de lista restaurada.
7. Repite para el registro 10043.

Después de 5 registros, valida los datos extraídos contra capturas de pantalla — verifica errores de transcripción antes de continuar con el lote.

Después de los 50 registros:
- Proporciona los datos estructurados al usuario.
- Adjunta una muestra de capturas de pantalla como evidencia de precisión.
- Anota cualquier registro donde los datos fueron poco claros o los campos estaban vacíos.

**Qué causaría una parada**:
- La pantalla de detalle se abre a una pestaña "Historial de pagos" mostrando montos de facturas — detente, informa, pregunta si esta pantalla está en alcance.
- Un diálogo de confirmación "Eliminar registro" aparece inesperadamente — detente de inmediato, no hagas clic en nada, captura de pantalla e informa.
- La aplicación se vuelve sin respuesta después de abrir el registro 23 — detente, informa del estado, no reintentos sin confirmación del usuario.
