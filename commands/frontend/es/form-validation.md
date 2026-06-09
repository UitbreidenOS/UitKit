---
description: Agregue o corrija la validación de formularios con esquema, visualización de errores y mensajes de error accesibles
argument-hint: "[file] [library: zod|yup|valibot|native]"
---
Implemente o repare la validación de formularios en: $ARGUMENTS

Analice argumentos: el primer token es el archivo de destino; el nombre de biblioteca opcional anula la autodetección.

**Paso 1 — Detectar pila existente**
Busque importaciones de: `react-hook-form`, `formik`, `zod`, `yup`, `valibot`, `@conform-to/react`.
Use lo que ya está instalado. Si no hay nada instalado, use el predeterminado `react-hook-form` + `zod`.
No instale nuevos paquetes sin anotarlos explícitamente.

**Paso 2 — Definir el esquema**
Para cada campo del formulario, derive las reglas de validación de:
- Semántica del nombre del campo (correo electrónico, teléfono, url, contraseña, fecha)
- Restricciones existentes visibles en el marcado (`required`, `minLength`, `pattern`, `type`)
- Cualquier lógica de validación del lado del servidor visible en la base de código

Reglas de esquema a aplicar:
- `email`: `.email()` con un mensaje legible por humanos
- `password`: mín. 8 caracteres, al menos un número o símbolo — emita la restricción claramente en el mensaje
- `url`: `.url()` — permitir cadena vacía solo si el campo es opcional
- `phone`: patrón E.164 o patrón apropiado para la configuración regional
- Campos requeridos: `.min(1, "Field is required")` explícito — no solo `.nonempty()`
- Campos opcionales: envuelva con `.optional()` o `.nullable()` según corresponda — no deje ambiguo

**Paso 3 — Validación de conexión al formulario**
Para react-hook-form:
- Use `resolver` con el adaptador de resolver de la biblioteca de esquemas
- Reemplace cualquier validación manual `onChange` con `register()` y `formState.errors`
- Use `handleSubmit` — no llame manualmente a `preventDefault`

Para formik:
- Pase la propiedad `validationSchema`
- Use el componente `<ErrorMessage>` o `formik.errors[field]` — no verificaciones de cadena ad hoc

**Paso 4 — Visualización de errores**
Cada mensaje de error debe:
- Aparecer debajo de la entrada correspondiente, no en un aviso tostado o pancarta de alerta
- Asociarse con la entrada a través de `aria-describedby` que apunta al `id` del elemento de error
- Establecer `aria-invalid="true"` en la entrada cuando hay un error presente
- Usar `role="alert"` en el contenedor de errores si aparece después de una acción del usuario (no en la representación inicial)
- No usar el color rojo solo para transmitir el estado de error — incluya un icono o prefijo de texto como "Error:"

**Paso 5 — Comportamiento de envío**
- Deshabilite el botón de envío mientras el envío está en progreso (`isSubmitting`)
- Vuelva a habilitar en caso de error para que el usuario pueda reintentar
- Borre los errores a nivel de campo en el reenvío exitoso
- Si el servidor devuelve errores de campo (400 con mapa de errores), aplíquelos a través de `setError` a los campos correctos

Aplique todos los cambios al archivo. Enumere todos los campos actualizados y todas las nuevas reglas de validación agregadas.
