# /btw — Preguntas Laterales Sin Romper el Flujo

## Cuándo activar
- El usuario quiere hacer una pregunta rápida en medio de sesión sin que aparezca en el historial de conversación
- El usuario quiere buscar algo mientras Claude está trabajando activamente, sin interrumpir la tarea principal
- El usuario pregunta cómo hacer una pregunta lateral, verificar algo en silencio, o obtener una respuesta puntual sin contaminar el contexto
- El usuario quiere usar el comando `/btw` o pregunta sobre el overlay de chat lateral
- El usuario quiere verificar un nombre, ruta, variable, rama o valor de configuración a mitad de la tarea sin descarrilar la conversación

## Cuándo NO usar
- La pregunta requiere acceso a herramientas (lecturas de archivo, comandos Bash, búsqueda web) — las respuestas `/btw` no tienen acceso a herramientas
- La respuesta necesita influir en qué hace Claude después en la conversación principal — usa un prompt regular en su lugar para que la respuesta aterrice en el contexto
- El usuario quiere una discusión lateral multi-vuelta — `/btw` es solo respuesta única, no un hilo de conversación
- El usuario está en la interfaz web de Claude — `/btw` es una característica solo CLI

## Instrucciones

### Uso básico

```
/btw <pregunta>
```

La pregunta ve el contexto completo de la conversación — todo lo que Claude sabe sobre la sesión actual está disponible. La respuesta aparece como un overlay. No deja rastro en el historial de chat: sin mensaje de usuario, sin mensaje de asistente, nada. Una vez descartado, se va.

**Descartando el overlay:** Presiona Espacio, Enter o Escape.

**Equivalente de escritorio:** `Cmd+;` abre un panel de chat lateral con el mismo comportamiento.

### Qué /btw puede y no puede hacer

| Capacidad | Disponible |
|---|---|
| Contexto de conversación completo | Sí |
| Reutilización de caché de prompt | Sí (muy bajo costo) |
| Acceso a herramientas (Read, Bash, etc.) | No |
| Intercambio multi-vuelta | No |
| Persiste en historial | No |
| Funciona durante turno activo de Claude | Sí — overlay no bloqueante |

### Costo

`/btw` reutiliza el caché de prompt de la conversación actual. El costo incremental es solo los tokens de salida para la respuesta — sin recodificación del contexto. Para preguntas rápidas, esto es efectivamente negligible.

### Buenas preguntas para /btw

- "¿Cómo se llamaba esa variable de configuración de nuevo?"
- "¿En qué rama estoy en esta sesión?"
- "¿Cuál es el nombre del archivo que refacturizamos más temprano?"
- "Recuérdame cómo se llama la variable de entorno del webhook de Stripe en este proyecto."
- "¿Cuál es el valor predeterminado de `OTEL_EXPORTER_OTLP_ENDPOINT`?"
- "Explica qué hace el decorador que agregamos más temprano — versión rápida."
- "¿Cuál fue el mensaje de error de esa prueba fallida?"
- "¿Cuántos archivos hemos modificado hasta ahora?"

### Preguntas que pertenecen a la conversación principal

- "Lee `config/database.yml` y dime el tamaño del grupo de conexión." — necesita herramienta Read
- "¿Qué muestra `git log --oneline -10`?" — necesita Bash
- "Ahora que sabes X, actualiza el enfoque." — la respuesta necesita influir en la siguiente acción de Claude

## Ejemplo

**Escenario:** Claude está a mitad de extraer una clase de servicio. Estás leyendo el archivo original en un segundo monitor y no puedes recordar qué nombre de interfaz se acordó más temprano en la sesión.

En lugar de escribir un mensaje (que aparecería en el historial y potencialmente distraería a Claude de su trabajo actual), escribes:

```
/btw ¿cómo nombramos la nueva interfaz para la abstracción del procesador de pagos?
```

Claude responde en un overlay:

```
PaymentGateway — definida en la sección de interfaces alrededor del turno 12.
```

Presiona Espacio para descartar. La tarea principal continúa sin interrupciones. Nada aparece en el historial de conversación.

---

**Contraste con un prompt regular:**

Si hicieras la misma pregunta como un mensaje normal, estaría:
1. Aparecería en la conversación como un turno de usuario
2. Potencialmente interrupción de la cadena actual de razonamiento de Claude
3. Permanecer en contexto para todos los turnos futuros (agregando ruido)
4. Contar hacia el historial de conversación que informa respuestas posteriores

Para búsquedas puras sin efecto descendente, `/btw` es la herramienta correcta.

---
