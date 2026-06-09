---
description: Ejecutar un escaneo de seguridad estático completo en un archivo o directorio e informar vulnerabilidades explotables
argument-hint: "[path]"
---
Realizar un análisis de seguridad estático exhaustivo de `$ARGUMENTS`. Si no se proporciona una ruta, escanear todo el árbol de trabajo.

Pasos:

1. **Enumerar superficie de ataque**: Lista todos los puntos de entrada — controladores HTTP, argumentos de CLI, lecturas de archivos, IPC, variables de entorno, deserialización.

2. **Escanear clases de vulnerabilidades** — para cada hallazgo reportar: archivo, línea, severidad (CRITICAL / HIGH / MEDIUM / LOW), ID de CWE, y descripción de una línea:
   - Inyección: SQL, NoSQL, LDAP, comando, plantilla, encabezado
   - Autenticación rota: credenciales codificadas, generación débil de tokens, expiración faltante
   - Exposición de datos sensibles: secretos en código fuente, almacenamiento sin cifrar, mensajes de error detallados
   - Deserialización insegura: pickle, carga YAML, analizadores basados en eval
   - Control de acceso roto: verificaciones de autorización faltantes, patrones IDOR, traversal de ruta
   - Configuración de seguridad incorrecta: banderas de depuración, CORS permisivo, listado de directorios
   - XSS / CSRF: reflejado, almacenado, basado en DOM; tokens CSRF faltantes
   - Componentes vulnerables: importaciones conocidas por estar afectadas por CVE (marcar para auditoría de dependencias)
   - SSRF: URLs controladas por el usuario obtenidas del lado del servidor
   - XXE: analizadores XML con entidades externas habilitadas

3. **Triaje y clasificación**: Ordenar todos los hallazgos por severidad y explotabilidad. Marcar cualquier cosa explotable sin autenticación como CRITICAL independientemente de la base CVSS.

4. **Para cada hallazgo CRITICAL y HIGH**, proporcionar:
   - Escenario de prueba de concepto mínimo (sin código de exploit funcional — describe el vector)
   - Corrección recomendada con fragmento de código corregido

5. **Formato de salida**:
   ```
   ## Security Scan: <path>

   ### Summary
   CRITICAL: N | HIGH: N | MEDIUM: N | LOW: N

   ### Findings
   [severity] [CWE-XXX] file:line — description
   Fix: ...

   ### Deferred (MEDIUM/LOW)
   Bullet list only — no fix detail
   ```

No incluir hallazgos de los que no estés seguro. Prefiere precisión sobre exhaustividad — una crítica confirmada supera diez bajas especulativas.
