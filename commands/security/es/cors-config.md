---
description: Auditar la configuración de CORS para orígenes demasiado permisivos, mal uso de credenciales y lagunas de preflight
argument-hint: "[server file or framework config]"
---
Audita la configuración de CORS (Cross-Origin Resource Sharing) en `$ARGUMENTS` (por defecto: escanea todos los puntos de entrada del servidor, archivos de middleware y configuraciones de framework) para detectar configuraciones incorrectas que permiten ataques entre orígenes.

**1. Localizar la configuración de CORS**

Encuentra todos los lugares donde se establecen los encabezados CORS:
- Express/Node: middleware `cors()`, `res.setHeader('Access-Control-Allow-Origin', ...)`
- Django: `CORS_ALLOWED_ORIGINS`, `CORS_ALLOW_ALL_ORIGINS`, configuración `django-cors-headers`
- FastAPI/Starlette: parámetros de `CORSMiddleware`
- Spring: `@CrossOrigin`, `WebMvcConfigurer.addCorsMappings`
- Nginx/Apache: directivas `add_header Access-Control-Allow-Origin`
- CDN o configuraciones de API Gateway

**2. Buscar comodín de origen con credenciales**

La configuración incorrecta más crítica:
- ¿Está `Access-Control-Allow-Origin: *` combinado con `Access-Control-Allow-Credentials: true`?
- Los navegadores bloquean esta combinación, pero algunos frameworks la configuran silenciosamente — verifica los encabezados de respuesta reales cuando las credenciales están presentes.

**3. Buscar reflexión de origen**

- ¿El servidor refleja directamente el encabezado de solicitud `Origin` en `Access-Control-Allow-Origin` sin validación?
- Patrón a buscar: código que lee `request.headers.origin` o `$_SERVER['HTTP_ORIGIN']` y lo devuelve en el encabezado de respuesta.
- Esto hace que todos los orígenes sean confiables — equivalente a `*` pero evita la restricción de credenciales.

**4. Validar la lista de orígenes permitidos**

- ¿Es la lista de orígenes permitidos una coincidencia exacta (comparación de cadena) o una coincidencia regex/prefijo?
- Coincidencia de prefijo débil: `origin.startsWith('https://example.com')` permite `https://example.com.attacker.com`
- Coincidencia de sufijo débil: `origin.endsWith('example.com')` permite `https://attackerexample.com`
- ¿Se permiten orígenes `null`? (activado por iframes en sandbox y `file://` — casi nunca es apropiado)

**5. Verificar el manejo de preflight**

- ¿Se manejan las solicitudes preflight de `OPTIONS` y devuelven `Access-Control-Allow-Methods` y `Access-Control-Allow-Headers` correctos?
- ¿Los puntos finales sensibles (que cambian estado, autenticados) están protegidos incluso si se omite el preflight (por ejemplo, solicitudes simples con `Content-Type: text/plain`)?

**6. Verificar encabezados expuestos**

- ¿`Access-Control-Expose-Headers` incluye encabezados que filtran información sensible (por ejemplo, nombres de servicios internos, tokens de sesión, IDs de usuario)?

**7. Verificar configuración por ruta vs global**

- ¿Hay una configuración global permisiva que se supone debe ajustarse por ruta, pero faltan los overrides por ruta en los puntos finales sensibles?

**Formato de salida**:
```
## CORS Audit

### Findings
[SEVERITY] [file:line or config key] — description
Attack scenario: what an attacker can do from a malicious origin
Fix: exact configuration change

### Current Allowed Origins
[List each configured origin and whether it's appropriate]

### Recommended Configuration
[Paste a corrected config snippet for the framework in use]
```

Severidad: Crítica (reflexión de origen o comodín+credenciales), Alta (regex demasiado amplio), Media (origen nulo, exceso de encabezados expuestos), Baja (lagunas de preflight en rutas no sensibles).
