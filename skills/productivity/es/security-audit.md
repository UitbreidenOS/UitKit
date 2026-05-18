---
name: security-audit
description: "Security audit for code: OWASP Top 10, injection, auth flaws, secrets, dependency vulnerabilities — with severity and fix for each finding"
---

> 🇪🇸 Versión en español. [Versión en inglés](../security-audit.md).

# Habilidad: Auditoría de Seguridad

## Cuándo activar
- Revisión de seguridad previa al lanzamiento de una nueva característica o endpoint
- Auditoría de una base de código antes de publicarla como open source
- La retroalimentación de revisión de código solicita análisis de seguridad
- Después de agregar autenticación, autorización o manejo de pagos
- Antes de una prueba de penetración — encontrar primero los problemas obvios

## Cuándo NO usar
- Escaneo de dependencias — usar `npm audit`, `pip-audit` o Snyk en su lugar (Claude no puede leer bases de datos CVE)
- Pruebas de penetración en vivo contra sistemas de producción
- Certificación de cumplimiento (SOC2, PCI-DSS) — estos requieren auditores humanos y herramientas especializadas
- Código binario/compilado — Claude necesita código fuente

## Instrucciones

### Invocación de la auditoría

```
/security-audit

Scope: {archivo, directorio o describir el área}
Focus: {all / auth / input validation / secrets / API endpoints}
```

O de forma dirigida:
```
/security-audit

Review the user authentication flow in src/auth/.
Pay special attention to: session management, password reset, and JWT validation.
```

### Lista de verificación OWASP Top 10 que Claude recorre

**A01 — Control de acceso roto**
- [ ] Autorización verificada en cada ruta/endpoint (no solo autenticación)
- [ ] Escalada horizontal de privilegios: ¿puede el usuario A acceder a los datos del usuario B?
- [ ] IDOR (Referencia directa de objeto insegura): ¿se validan los IDs contra el usuario autenticado?
- [ ] Endpoints solo para administradores protegidos contra usuarios regulares

**A02 — Fallos criptográficos**
- [ ] Contraseñas hasheadas con bcrypt/argon2/scrypt (no MD5, SHA1 o SHA256 puro)
- [ ] Datos sensibles cifrados en reposo (PII, información de pago, tokens)
- [ ] HTTPS aplicado, sin datos sensibles en URL ni registros
- [ ] Secrets no codificados de forma fija ni comprometidos en git

**A03 — Inyección**
- [ ] Las consultas SQL usan consultas parametrizadas / ORM (sin concatenación de cadenas)
- [ ] Consultas NoSQL saneadas
- [ ] Inyección de comandos: `subprocess`, `exec`, `eval` con entrada del usuario
- [ ] Inyección LDAP, XPath, XML si aplica

**A04 — Diseño inseguro**
- [ ] Limitación de tasa en endpoints de autenticación (inicio de sesión, restablecimiento de contraseña, OTP)
- [ ] Bloqueo de cuenta después de N intentos fallidos
- [ ] Las operaciones sensibles requieren reautenticación (cambio de contraseña, pago)

**A05 — Configuración de seguridad incorrecta**
- [ ] Modo de depuración desactivado en producción
- [ ] Los mensajes de error no filtran trazas de pila ni detalles internos a los usuarios
- [ ] Credenciales predeterminadas cambiadas, cuentas de ejemplo eliminadas
- [ ] CORS configurado de manera restrictiva (no `*`)
- [ ] Cabeceras de seguridad presentes (HSTS, CSP, X-Frame-Options)

**A06 — Componentes vulnerables y desactualizados**
- [ ] Sin dependencias con vulnerabilidades conocidas (ejecutar `npm audit` / `pip-audit` por separado)
- [ ] Dependencias fijadas a versiones específicas
- [ ] Sin paquetes abandonados con problemas de seguridad abiertos

**A07 — Fallos de identificación y autenticación**
- [ ] JWT validado correctamente (algoritmo, expiración, firma)
- [ ] Los tokens de sesión son criptográficamente aleatorios, entropía suficiente
- [ ] Sesiones invalidadas al cerrar sesión (no solo del lado del cliente)
- [ ] Los tokens "Recuérdame" almacenados de forma segura, renovados en cada uso
- [ ] Los tokens de restablecimiento de contraseña son de un solo uso y de corta duración

**A08 — Fallos de integridad de software y datos**
- [ ] Deserialización de la entrada del usuario verificada en busca de tipos peligrosos
- [ ] Cargas de archivos: tipo validado en el servidor, almacenado fuera del directorio raíz web
- [ ] Integridad del pipeline CI/CD (sin código no confiable en la cadena de compilación)

**A09 — Fallos de registro y monitorización**
- [ ] Fallos de autenticación registrados con IP, marca de tiempo, identificador de usuario
- [ ] Valores sensibles (contraseñas, tokens) no registrados
- [ ] Registros a prueba de manipulaciones (solo adjuntar, enviados a sistema externo)

**A10 — SSRF (Falsificación de solicitudes del lado del servidor)**
- [ ] URL proporcionadas por el usuario validadas contra una lista de permitidos
- [ ] Endpoints de metadatos internos bloqueados (169.254.169.254, etc.)
- [ ] Las solicitudes salientes usan un proxy con filtrado de salida

### Formato de salida

Claude reporta cada hallazgo con:

```
[GRAVEDAD] {título}
Location: {archivo:línea o área}
Issue: {en qué consiste la vulnerabilidad}
Risk: {qué podría hacer un atacante}
Fix:
  {cambio de código o paso de configuración}
```

**Niveles de gravedad:**
- 🔴 **CRÍTICO** — explotable ahora mismo, posible filtración de datos o toma de cuenta
- 🟠 **ALTO** — explotable con algunas condiciones, impacto significativo
- 🟡 **MEDIO** — explotable en escenarios específicos, impacto moderado
- 🟢 **BAJO** — problema de defensa en profundidad, baja probabilidad o impacto
- ℹ️ **INFO** — mejor práctica no seguida, sin explotabilidad directa

### Hallazgos comunes y soluciones

**Inyección SQL:**
```python
# Vulnerable
cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")

# Corregido
cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
```

**Secret codificado de forma fija:**
```python
# Vulnerable
API_KEY = "sk-prod-abc123..."

# Corregido
API_KEY = os.environ["API_KEY"]  # nunca en el código fuente
```

**Autorización faltante:**
```python
# Vulnerable — solo verifica autenticación
@app.get("/orders/{order_id}")
async def get_order(order_id: int, user = Depends(get_current_user)):
    return db.query(Order).get(order_id)

# Corregido — verifica que el pedido pertenece a este usuario
@app.get("/orders/{order_id}")
async def get_order(order_id: int, user = Depends(get_current_user)):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == user.id   # ← verificación de autorización
    ).first()
    if not order:
        raise HTTPException(status_code=404)
    return order
```

**Validación JWT débil:**
```python
# Vulnerable — acepta cualquier algoritmo (ataque de confusión de algoritmo)
payload = jwt.decode(token, key, algorithms=["none"])

# Corregido
payload = jwt.decode(token, key, algorithms=["HS256"])  # lista de permitidos explícita
```

**CORS demasiado permisivo:**
```python
# Vulnerable
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True)

# Corregido — las credenciales requieren origen explícito
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.yourdomain.com"],
    allow_credentials=True,
)
```

## Ejemplo

**Alcance:** `src/auth/` en una aplicación FastAPI

**Hallazgos esperados:**
```
🔴 CRÍTICO — Sin limitación de tasa en /auth/login
Location: src/auth/routes.py:24
Issue: El endpoint de inicio de sesión acepta solicitudes ilimitadas sin limitación.
Risk: Los ataques de fuerza bruta o relleno de credenciales pueden enumerar cuentas válidas.
Fix: Agregar limitador de tasa slowapi: @limiter.limit("5/minute") en la ruta de inicio de sesión.

🟠 ALTO — Token de restablecimiento de contraseña no invalidado tras su uso
Location: src/auth/password_reset.py:67
Issue: reset_password() actualiza la contraseña pero no elimina el token de restablecimiento.
Risk: Si un token es interceptado, puede reutilizarse para restablecer la contraseña nuevamente.
Fix: Eliminar o marcar el token como usado inmediatamente después de actualizar la contraseña.

🟡 MEDIO — Algoritmo JWT no especificado explícitamente
Location: src/auth/jwt.py:12
Issue: jwt.decode() usa detección automática de algoritmo.
Risk: Ataque de confusión de algoritmo si el servidor acepta el algoritmo 'none'.
Fix: Pasar algorithms=["HS256"] explícitamente a jwt.decode().

ℹ️ INFO — Intentos de inicio de sesión fallidos no registrados
Location: src/auth/routes.py:38
Issue: Los fallos de autenticación se ignoran silenciosamente.
Fix: Registrar los intentos fallidos con marca de tiempo, IP y nombre de usuario para monitorización.
```

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
