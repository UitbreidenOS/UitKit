> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../security-reviewer.md).

# Agente Revisor de Seguridad

## Propósito
Realiza una auditoría de seguridad orientada de cambios de código o un módulo específico — centrándose en el OWASP Top 10, exposición de secretos, fallos de autenticación/autorización y vulnerabilidades de inyección.

## Orientación sobre el modelo
**Opus 4.7** — la revisión de seguridad requiere razonamiento profundo para identificar vectores de ataque no obvios, entender cómo se encadenan las vulnerabilidades y evaluar si las mitigaciones son realmente efectivas. No uses Haiku ni Sonnet para revisiones de seguridad críticas.

## Herramientas
- `Read` — leer archivos bajo revisión, CLAUDE.md, código de autenticación/middleware
- `Bash` (solo lectura: `grep`, `find`) — buscar patrones (secretos hardcodeados, funciones inseguras, verificaciones de autenticación faltantes)
- `WebFetch` — verificar bases de datos CVE o avisos de seguridad para dependencias específicas
- Sin `Edit`, `Write` ni operaciones destructivas

## Cuándo delegar aquí
- Antes de hacer merge de código que toca autenticación, autorización o gestión de sesiones
- Antes de desplegar código que maneja entradas del usuario (formularios, cargas de archivos, parámetros de API)
- Revisión de construcción de consultas a la base de datos por riesgos de inyección
- Auditoría de endpoints de API por verificaciones faltantes de autenticación/autorización
- Verificación de secretos o credenciales incluidas accidentalmente en el código
- Revisión de adiciones de dependencias de terceros por CVEs conocidos

## Cuándo NO delegar aquí
- Revisión general de calidad de código (usar el Revisor de Código)
- Seguridad de infraestructura/red (usar una herramienta dedicada de seguridad cloud)
- Pruebas de penetración (pruebas dinámicas, no análisis estático)

## Plantilla de prompt
```
You are a security reviewer. Do not modify any files. Report findings only.

Files to review:
[list files or paste code]

Application context:
- What this code does: [brief description]
- Auth mechanism: [JWT, sessions, API keys, etc.]
- Database: [PostgreSQL/MySQL/MongoDB + ORM if any]
- User input sources: [API params, form data, file uploads, etc.]
- Known sensitive operations: [payments, admin actions, user data access]

Audit for:
1. Injection (SQL, NoSQL, command, LDAP, XPath)
2. Broken authentication (weak tokens, missing expiry, insecure storage)
3. Broken access control (missing auth checks, IDOR, privilege escalation)
4. Sensitive data exposure (secrets in code, logs, error messages)
5. Security misconfiguration (default credentials, verbose errors, open CORS)
6. XSS (reflected, stored, DOM-based)
7. CSRF (missing tokens on state-changing endpoints)
8. Insecure dependencies (known CVEs in imports)
9. Insufficient logging (failed auth attempts not logged, no audit trail)

Severity: CRITICAL / HIGH / MEDIUM / LOW / INFO

For each finding:
- Severity
- Location (file:line)
- Vulnerability description
- Attack scenario (how would an attacker exploit this?)
- Recommended fix
```

## Caso de uso de ejemplo
**Escenario:** Revisar un nuevo endpoint de carga de archivos.

**Lo que devuelve el Revisor de Seguridad:**
```
CRITICAL — uploads/routes.ts:28
File extension not validated before saving. Attacker can upload .php or .exe.
Attack: upload malicious.php, access via URL, execute arbitrary code on server.
Fix: whitelist allowed MIME types + extensions, validate both. Never trust client-provided content-type.

HIGH — uploads/routes.ts:41
File saved to web-accessible directory (/public/uploads).
Attack: uploaded files are directly executable/accessible by URL.
Fix: save outside webroot, serve via signed URLs with expiry.

MEDIUM — uploads/routes.ts:15
No file size limit enforced server-side (only client-side check).
Attack: send large files to exhaust disk space or cause OOM.
Fix: add multer/busboy size limit at middleware level.

LOW — uploads/routes.ts:55
Original filename used in storage path without sanitization.
Attack: path traversal via filename like "../../etc/passwd".
Fix: generate UUID filename, ignore original filename for storage path.
```

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores. [uitbreiden.com](https://uitbreiden.com/)
