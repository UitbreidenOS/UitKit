---
description: Ejecutar una revisión sistemática de OWASP Top 10 contra la base de código o un componente específico
argument-hint: "[component or file]"
---
Realizar una revisión estructurada de OWASP Top 10 (2021) de `$ARGUMENTS` (predeterminado: base de código completa). Para cada categoría, determinar la aplicabilidad, localizar código relevante e informar hallazgos con severidad y guía de corrección.

Trabajar a través de cada categoría en orden:

**A01 — Control de Acceso Roto**
- ¿Se aplican controles de autorización de manera consistente en todas las rutas y caminos de código al mismo recurso?
- ¿Están presentes vulnerabilidades IDOR (búsquedas de objetos sin verificación de propiedad)?
- ¿Pueden los usuarios acceder a datos de otros usuarios manipulando IDs o parámetros?

**A02 — Fallos Criptográficos**
- ¿Se transmiten datos sensibles (PII, información de pago, credenciales) sobre canales sin cifrar?
- ¿Se utilizan algoritmos débiles (MD5, SHA1 para contraseñas, DES/RC4 para cifrado)?
- ¿Se almacenan secretos en código, archivos de configuración o ubicaciones expuestas por entorno?
- ¿Se deshabilita la validación de certificados TLS en alguna parte?

**A03 — Inyección**
- Vectores de inyección SQL, NoSQL, comando OS, LDAP, XPath — ¿se parametrizan las consultas?
- ¿Se interpola entrada de usuario en cadenas de consulta o comandos de shell?

**A04 — Diseño Inseguro**
- ¿Hay límites de velocidad faltantes en puntos finales de autenticación (fuerza bruta, relleno de credenciales)?
- ¿Hay falta de validación de entrada en la capa de modelo de dominio?
- ¿Se documentan y prueban los requisitos de seguridad, o están completamente ausentes?

**A05 — Configuración Incorrecta de Seguridad**
- ¿Se dejan habilitadas credenciales predeterminadas, puertos o interfaces de administrador?
- ¿Se exponen mensajes de error detallados o seguimiento de pila a clientes?
- ¿Se habilitan características, puntos finales o servicios innecesarios?
- ¿Se configuran encabezados de seguridad HTTP (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)?

**A06 — Componentes Vulnerables y Desactualizados**
- ¿Se fijan las dependencias a versiones con CVEs conocidos?
- ¿Hay componentes de OS o runtime sin parches en configuraciones de Dockerfile o implementación?

**A07 — Fallos de Identificación y Autenticación**
- ¿Se almacenan contraseñas con un hash adaptativo fuerte (bcrypt, argon2, scrypt)?
- ¿Son suficientemente aleatorios los tokens de sesión e invalidados al cerrar sesión?
- ¿Está disponible MFA para cuentas privilegiadas?
- ¿Están presentes vectores de enumeración de cuentas (respuestas diferentes para nombres de usuario válidos vs inválidos)?

**A08 — Fallos de Integridad de Software y Datos**
- ¿Están protegidas las tuberías de CI/CD contra confirmaciones maliciosas o sustitución de dependencias?
- ¿Se realizan operaciones de deserialización en datos no confiables sin validación de tipo?

**A09 — Fallos de Registro y Monitoreo de Seguridad**
- ¿Se registran fallos de autenticación, violaciones de control de acceso y errores de validación de entrada?
- ¿Se almacenan registros donde un atacante que compromete la aplicación no puede borrarlos?
- ¿Incluyen las entradas de registro suficiente contexto (usuario, IP, marca de tiempo, acción) para investigar incidentes?

**A10 — Falsificación de Solicitud del Lado del Servidor (SSRF)**
- ¿Obtiene la aplicación URLs o realiza solicitudes salientes basadas en entrada proporcionada por el usuario?
- ¿Se valida el destino contra una lista permitida de dominios/IPs?
- ¿Se puede acceder a puntos finales de metadatos internos (169.254.169.254, localhost) a través de SSRF?

**Formato de salida**:
```
## OWASP Top 10 Review

### [A0X] Category Name — PASS / FINDING / NOT APPLICABLE
Finding: [file:line] description
Severity: Critical / High / Medium / Low
Fix: specific remediation
```

Resumir con una tabla de riesgos al final: categoría, estado, número de hallazgos, severidad más alta.
