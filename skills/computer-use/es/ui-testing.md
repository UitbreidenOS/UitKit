---
name: ui-testing
description: Controla la interfaz de usuario nativa o web para probar flujos de usuario de extremo a extremo mediante el uso de la computadora — captura de pantalla, clic, afirmación e informe.
---

# Pruebas de interfaz de usuario mediante el uso de computadora

## Cuándo activar

- El usuario solicita probar un flujo de usuario en una aplicación en ejecución (web o nativa) sin un arnés de prueba existente
- La aplicación no tiene una superficie API comprobable y la interfaz de usuario es la única interfaz
- Existe un conjunto de Playwright o Cypress pero el usuario desea una verificación rápida de cordura sin ejecutar el conjunto completo
- El usuario dice "prueba este flujo manualmente", "haz clic y verifica", o "asegúrate de que la interfaz de usuario funciona"
- Necesitas verificar que una compilación recién implementada se comporta correctamente para un viaje específico
- La aplicación utiliza un marco que es difícil de instrumentar (Electron, Tauri, Qt, aplicaciones nativas de macOS/Windows)
- El usuario solicita explícitamente preferir el uso de la computadora sobre Playwright por una razón específica (velocidad, sin infraestructura de prueba, CI no disponible)

## Cuándo no usar

- Un conjunto de Playwright, Cypress o Selenium ya cubre el flujo — ejecuta las pruebas existentes primero
- La aplicación requiere inicio de sesión con credenciales reales almacenadas en un gestor de contraseñas — no hagas clic en pantallas de credenciales
- El flujo toca formularios de pago, registros médicos o cualquier pantalla que contenga PII — detente y pregunta al usuario
- Estás dentro de un entorno de producción — el uso de computadora en prod es de alto riesgo; confirma el entorno primero
- La pantalla no es visible o la aplicación no está en ejecución — no intentes acciones a ciegas
- El usuario desea un artefacto de prueba persistente y reproducible — escribe una prueba de Playwright en su lugar

## Instrucciones

### Lista de verificación previa

1. Confirma que la aplicación de destino está en ejecución y visible en pantalla antes de cualquier acción.
2. Pregunta qué entorno (desarrollo local, ensayo, producción). Si es producción, advierte y requiere confirmación explícita.
3. Identifica el flujo de usuario a probar: estado inicial, secuencia de acciones, condición de éxito.
4. Toma una captura de pantalla inicial para establecer el estado de referencia.

### Reglas de seguridad

- Nunca interactúes con pantallas que muestren: contraseñas, claves API, campos de tarjeta de crédito, campos de SSN, registros médicos, saldos bancarios.
- Antes de cada clic, narra lo que estás a punto de hacer y qué esperas que suceda.
- Después de cada acción, toma una captura de pantalla y verifica que la pantalla haya cambiado como se esperaba antes de continuar.
- Si la pantalla muestra un estado inesperado (error, página incorrecta, modal), detente e informa — no continúes haciendo clic a ciegas.
- Limita cada sesión de prueba a un flujo claramente definido. No encadenes flujos no relacionados.

### Bucle de prueba

Para cada paso en el flujo de usuario:

1. **Describe** — Indica qué acción estás a punto de realizar y el resultado esperado.
2. **Actúa** — Realiza la acción única (clic, escritura, desplazamiento, pulsación de tecla).
3. **Captura de pantalla** — Captura la pantalla inmediatamente después de la acción.
4. **Afirma** — Verifica la captura de pantalla para el estado esperado:
   - Se cargó la página/vista correcta
   - Los elementos de la interfaz de usuario esperados son visibles (etiqueta de botón, texto de encabezado, campo de formulario)
   - Sin banners de error, mensajes de notificación con texto de fallo o diseños rotos
5. **Registro** — Anota aprobado/fallido para este paso con la referencia de captura de pantalla.

Repite hasta que se alcance la condición de éxito o se detecte un fallo.

### Cuándo preferir el uso de computadora sobre Playwright

| Situación | Preferir |
|---|---|
| No existe infraestructura de prueba, verificación rápida única | Uso de computadora |
| La aplicación es Electron / nativa / sin acceso DOM | Uso de computadora |
| Reproducir un error de diseño que informó un usuario | Uso de computadora |
| Necesitar un archivo de prueba compartible y ejecutable | Playwright |
| El flujo se probará en cada implementación | Playwright |
| Canalización de CI disponible | Playwright |

### Informe de resultados

Después de completar el flujo, produce un informe conciso:

```
Flujo: [nombre]
Entorno: [local/ensayo/producción]
Pasos probados: [n]
Aprobado: [n]
Fallido: [n]

Paso a paso:
1. [acción] → APROBADO — [lo que se observó]
2. [acción] → FALLIDO — [lo que se observó vs esperado]

Capturas de pantalla: [lista de capturas de pantalla capturadas]
Recomendación: [arregla X en el paso 2 / todo claro]
```

### Trampas comunes

- Hacer clic en coordenadas que se desplazan al desplazarse — desplázate al elemento primero, luego haz clic
- Las animaciones retrasan la aparición de elementos — espera a que el elemento se asiente antes de afirmar
- Elementos Shadow DOM o canvas que parecen interactivos pero no lo son — trátalos como verificaciones visuales de solo lectura
- Los modales bloquean la interfaz de usuario subyacente — siempre cierra o descarta modales antes de afirmar el estado de la página

## Ejemplo

**Escenario**: Prueba el flujo de registro para una aplicación Next.js local en `http://localhost:3000`.

**Flujo definido por el usuario**: Navega a /signup, ingresa correo electrónico y contraseña, haz clic en "Crear cuenta", verifica el redireccionamiento a /dashboard con mensaje de bienvenida.

**Ejecución**:

1. Toma una captura de pantalla — confirma que el navegador está en `/signup`, el formulario es visible.
2. Haz clic en el campo de entrada de correo electrónico. Escribe `testuser@example.com`. Captura de pantalla — el campo contiene correo electrónico.
3. Haz clic en el campo de contraseña. Escribe `TestPass123!`. Captura de pantalla — el campo muestra caracteres enmascarados.
4. Haz clic en el botón "Crear cuenta". Captura de pantalla — verifica el estado de carga.
5. Espera el redireccionamiento. Captura de pantalla — la barra de URL muestra `/dashboard`.
6. Afirma: el encabezado "Bienvenido, testuser" es visible en pantalla. APROBADO.

**Informe**:
```
Flujo: Registro → Panel de control
Entorno: local
Pasos probados: 5
Aprobado: 5 / Fallido: 0

Todos los pasos pasaron. El usuario puede completar el registro y alcanzar el panel de control.
```

Si el paso 5 en su lugar mostraba un notificación "Algo salió mal", el informe marcaría FALLIDO en el paso 5 con la captura de pantalla y se detendría — sin más clics.
