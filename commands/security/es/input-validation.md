---
description: Auditar validación de entrada y sanitización en todos los límites de confianza
argument-hint: "[archivo, ruta o módulo]"
---
Auditar validación de entrada y sanitización en `$ARGUMENTS` (por defecto: todos los manejadores de solicitudes y puntos de entrada de datos) para vulnerabilidades de inyección, confusión de tipos y aplicación de límites faltantes.

**1. Localizar todos los límites de confianza**

Encontrar cada lugar donde datos externos entran en la aplicación:
- Manejadores de solicitudes HTTP (cuerpo, parámetros de consulta, parámetros de ruta, encabezados, cookies)
- Cargas de archivos y datos de formularios multiparte
- Manejadores de mensajes WebSocket
- Cargas de trabajos en segundo plano (colas, entradas de cron)
- Respuestas de API externas tratadas como confiables
- Variables de entorno usadas en lógica de código

**2. Inyección SQL**

- Encontrar todas las consultas de base de datos. ¿Son parameterizadas/prepared statements o concatenación de cadenas?
- Verificar uso de ORM — ¿hay escotillas de consulta sin procesar (`.raw()`, `query()`, `execute()`) con entrada sin sanitizar?
- Buscar inyección de segundo orden: entrada de usuario almacenada en BD y luego usada en una consulta sin procesar.

**3. Inyección de comandos**

- Encontrar todos los usos de `exec`, `spawn`, `system`, `popen`, `subprocess`, `child_process`, `os.system` y equivalentes.
- ¿Se interpola entrada proporcionada por el usuario en comandos shell? Incluso con escape, preferir matrices de argumentos sobre cadenas shell.

**4. Inyección de plantillas (SSTI)**

- Identificar motores de plantillas del lado del servidor en uso (Jinja2, Twig, Handlebars, Pebble, Velocity).
- ¿Se renderiza datos controlados por el usuario dentro de expresiones de plantilla (`{{ }}`, `<%= %>`)?

**5. Traversal de ruta**

- Encontrar todas las operaciones de lectura/escritura de archivos usando nombres de ruta o rutas proporcionadas por el usuario.
- ¿Se valida la ruta resuelta contra un directorio base permitido (por ejemplo, `os.path.abspath` + verificación de prefijo)?

**6. Validación de tipo y esquema**

- ¿Se valida cada objeto entrante contra un esquema estricto antes de usarlo?
- ¿Se verifican límites de entradas numéricas? ¿Se validan enumeraciones contra una lista permitida?
- ¿Hay riesgo de contaminación de prototipos (Node.js `Object.assign`, `merge` con entrada no confiable)?

**7. Salida**

Para cada hallazgo:
```
[SEVERIDAD] [archivo:línea] — tipo de vulnerabilidad
Fuente de entrada: de dónde se origina el dato no confiable
Sumidero: dónde se usa de forma insegura
PoC: carga mínima o solicitud que demuestra el problema
Corrección: remediación específica (parametrizar, lista permitida, validar esquema, etc.)
```

No intentes explotar hallazgos — describe solo el vector de ataque y la corrección.
