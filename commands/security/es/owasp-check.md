---
description: Ejecutar una revisión sistemática de OWASP Top 10 contra la base de código o un componente específico
argument-hint: "[componente o archivo]"
---
Realizar una revisión estructurada de OWASP Top 10 (2021) de `$ARGUMENTS` (por defecto: toda la base de código). Para cada categoría, determinar aplicabilidad, localizar código relevante e informar hallazgos con severidad y orientación de corrección.

Trabajar a través de cada categoría en orden:

**A01 — Control de Acceso Roto**
- ¿Se aplican consistentemente las verificaciones de autorización en todas las rutas y caminos de código para el mismo recurso?
- ¿Existen vulnerabilidades IDOR (búsquedas de objetos sin verificación de propiedad)?
- ¿Pueden los usuarios acceder a datos de otros usuarios manipulando IDs o parámetros?

**A02 — Fallos Criptográficos**
- ¿Se transmiten datos sensibles (PII, información de pago, credenciales) por canales sin encriptar?
- ¿Se utilizan algoritmos débiles (MD5, SHA1 para contraseñas, DES/RC4 para encriptación)?
- ¿Se almacenan secretos en código, archivos de configuración o ubicaciones expuestas en entorno?
- ¿Se deshabilitan las validaciones de certificados TLS en algún lugar?

**A03 — Inyección**
- Vectores de inyección SQL, NoSQL, comando OS, LDAP, XPath — ¿están las consultas parametrizadas?
- ¿Se interpola alguna vez la entrada del usuario en cadenas de consulta o comandos shell?

**A04 — Diseño Inseguro**
- ¿Faltan límites de velocidad en puntos finales de autenticación (fuerza bruta, relleno de credenciales)?
- ¿Hay falta de validación de entrada en la capa del modelo de dominio?
- ¿Se documentan y prueban los requisitos de seguridad, o están completamente ausentes?

**A05 — Configuración de Seguridad Incorrecta**
- ¿Se dejan credenciales predeterminadas, puertos o interfaces administrativas habilitados?
- ¿Se exponen mensajes de error detallados o trazas de pila a los clientes?
- ¿Hay características, puntos finales o servicios innecesarios habilitados?
- ¿Se configuran encabezados de seguridad HTTP (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)?

**A06 — Componentes Vulnerables y Desactualizados**
- ¿Las dependencias están fijadas a versiones con CVE conocidos?
- ¿Hay componentes del SO o tiempo de ejecución sin parches en Dockerfile o configuraciones de implementación?

**A07 — Fallos de Identificación y Autenticación**
- ¿Se almacenan contraseñas con un hash adaptativo fuerte (bcrypt, argon2, scrypt)?
- ¿Son los tokens de sesión suficientemente aleatorios e invalidados al cerrar sesión?
- ¿Está disponible MFA para cuentas privilegiadas?
- ¿Existen vectores de enumeración de cuentas (respuestas diferentes para nombres de usuario válidos vs inválidos)?

**A08 — Fallos de Integridad de Software y Datos**
- ¿Están los canales de CI/CD protegidos contra commits maliciosos o sustitución de dependencias?
- ¿Se realizan operaciones de deserialización en datos no confiables sin validación de tipo?

**A09 — Fallos de Registro y Monitoreo de Seguridad**
- ¿Se registran fallos de autenticación, violaciones de control de acceso y errores de validación de entrada?
- ¿Se almacenan registros donde un atacante que compromete la aplicación no pueda borrarlos?
- ¿Incluyen las entradas de registro suficiente contexto (usuario, IP, marca de tiempo, acción) para investigar incidentes?

**A10 — Falsificación de Solicitud del Lado del Servidor (SSRF)**
- ¿Recupera la aplicación URLs o realiza solicitudes salientes basadas en entrada proporcionada por el usuario?
- ¿Se valida el destino contra una lista de permitidos de dominios/IPs?
- ¿Se pueden alcanzar puntos finales internos de metadatos (169.254.169.254, localhost) a través de SSRF?

**Formato de salida**:
```
## Revisión OWASP Top 10

### [A0X] Nombre de Categoría — PASS / FINDING / NOT APPLICABLE
Finding: [archivo:línea] descripción
Severity: Critical / High / Medium / Low
Fix: remediación específica
```

Resumir con una tabla de riesgos al final: categoría, estado, cantidad de hallazgos, severidad más alta.
