---
description: Auditar validación de entrada y sanitización en todos los límites de confianza
argument-hint: "[file, route, or module]"
---
Auditar validación de entrada y sanitización en `$ARGUMENTS` (predeterminado: todos los manejadores de solicitudes y puntos de entrada de datos) para vulnerabilidades de inyección, confusión de tipos y aplicación de límites faltante.

**1. Localizar todos los límites de confianza**

Encuentra todos los lugares donde datos externos ingresan a la aplicación:
- Manejadores de solicitudes HTTP (cuerpo, parámetros de consulta, parámetros de ruta, encabezados, cookies)
- Cargas de archivos y datos de formulario multiparte
- Manejadores de mensajes WebSocket
- Cargas de trabajos en segundo plano (colas, entradas cron)
- Respuestas de API externas tratadas como confiables
- Variables de entorno utilizadas en la lógica del código

**2. Inyección SQL**

- Encuentra todas las consultas de base de datos. ¿Son declaraciones parametrizadas/preparadas, o concatenadas con cadenas?
- Verifica el uso de ORM — ¿hay escapes de consulta sin procesar (`.raw()`, `query()`, `execute()`) con entrada sin sanitizar?
- Busca inyección de segundo orden: entrada del usuario almacenada en BD luego utilizada en una consulta sin procesar.

**3. Inyección de comandos**

- Encuentra todos los usos de `exec`, `spawn`, `system`, `popen`, `subprocess`, `child_process`, `os.system` y equivalentes.
- ¿Se interpola la entrada suministrada por el usuario en comandos de shell? Incluso con escape, prefiere matrices de argumentos sobre cadenas de shell.

**4. Inyección de plantilla (SSTI)**

- Identifica motores de plantilla del lado del servidor en uso (Jinja2, Twig, Handlebars, Pebble, Velocity).
- ¿Se renderiza datos controlados por el usuario dentro de expresiones de plantilla (`{{ }}`, `<%= %>`)?

**5. Traversal de ruta**

- Encuentra todas las operaciones de lectura/escritura de archivos que usan nombres o rutas de archivo suministrados por el usuario.
- ¿Se valida la ruta resuelta contra un directorio base permitido (por ejemplo, `os.path.abspath` + verificación de prefijo)?

**6. Validación de tipo y esquema**

- ¿Se valida cada objeto entrante contra un esquema estricto antes de su uso?
- ¿Se comprueban los límites de las entradas numéricas? ¿Se validan enums contra una lista permitida?
- ¿Hay riesgo de contaminación de prototipos (Node.js `Object.assign`, `merge` con entrada no confiable)?

**7. Salida**

Para cada hallazgo:
```
[SEVERITY] [file:line] — tipo de vulnerabilidad
Input source: de dónde proviene el dato no confiable
Sink: dónde se usa de manera insegura
PoC: carga mínima o solicitud que demuestra el problema
Fix: remediación específica (parametrizar, lista permitida, validar esquema, etc.)
```

No intentes explotar hallazgos — describe únicamente el vector de ataque y la solución.
