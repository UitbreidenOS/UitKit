# Flujo de trabajo de revisión de seguridad

Proceso estructurado para realizar una revisión de seguridad de una base de código, API o sistema antes del lanzamiento o después de cambios significativos.

## Cuándo usar

Ejecute este flujo de trabajo:
- Antes de lanzar un nuevo producto o una característica importante
- Cuando un nuevo ingeniero se une al equipo y hereda una base de código
- Después de un incidente de seguridad para encontrar vulnerabilidades relacionadas
- Trimestralmente para rutas de código críticas de seguridad (pagos, autenticación, manejo de PII)
- Cuando se cambien patrones de autenticación, autorización o acceso a datos

## Fase 1: Modelado de amenazas (30-60 minutos)

Antes de revisar el código, defina qué está protegiendo:

**Activos a proteger:**
- Información personal del usuario (nombre, correo electrónico, dirección, información de pago)
- Credenciales de autenticación (contraseñas, tokens, claves API)
- Datos comerciales (propietarios, datos del cliente)
- Acceso al sistema (capacidades de administrador, infraestructura)

**Actores de amenaza:**
- Atacantes externos (usuarios no autenticados, bots automatizados)
- Usuarios autenticados intentando acceder a datos de otros usuarios
- Insiders maliciosos con acceso legítimo
- Cadena de suministro (dependencias comprometidas)

**Superficies de ataque:**
- Puntos finales de API (públicos y autenticados)
- Carga y procesamiento de archivos
- Gestión de autenticación y sesiones
- Integraciones de terceros (OAuth, webhooks)
- Interfaces administrativas

**Priorice según impacto × probabilidad.**

## Fase 2: Escaneo automatizado (30 minutos)

Ejecute estas herramientas primero — encuentran rápidamente los problemas obvios:

```bash
# 1. Vulnerabilidades de dependencias
npm audit --audit-level=high        # Node.js
pip-audit                           # Python
cargo audit                         # Rust

# 2. Detección de secretos en código
gitleaks detect --source . --verbose

# 3. Análisis estático (si está disponible para su lenguaje)
# Node.js:
npx eslint --ext .ts,.tsx . --rulesdir security-rules/
# Python:
bandit -r src/ -ll

# 4. Verificación de dependencias OWASP
docker run --rm owasp/dependency-check \
  --scan /path/to/project \
  --format HTML --out /output

# 5. Escaneo de contenedor (si Docker):
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image my-image:latest
```

## Fase 3: Revisión manual de código

Concéntrese en las áreas de mayor riesgo:

**Autenticación y gestión de sesiones:**
- [ ] El punto final de inicio de sesión tiene limitación de velocidad
- [ ] Las contraseñas se codifican con bcrypt/argon2 (no MD5/SHA1)
- [ ] Los tokens de sesión son criptográficamente aleatorios (no IDs secuenciales)
- [ ] La sesión se invalida al cerrar sesión (del lado del servidor)
- [ ] JWT: firma verificada, caducidad verificada, algoritmo fijado
- [ ] Los tokens de restablecimiento de contraseña caducan (< 1 hora) y se pueden usar una sola vez

**Autorización:**
- [ ] Cada punto final de API verifica la autenticación
- [ ] Las comprobaciones de acceso a recursos verifican la propiedad (no solo "conectado")
- [ ] Las funciones de administrador requieren verificación explícita del rol de administrador
- [ ] Escalada de privilegios horizontal probada: ¿puede el usuario A acceder a los recursos del usuario B?

**Validación de entrada:**
- [ ] Toda la entrada del usuario se valida antes de su uso
- [ ] Consultas SQL parametrizadas (sin interpolación de cadenas)
- [ ] Cargas de archivos: validación de tipo, límites de tamaño, escaneo de contenido
- [ ] Protección contra recorrido de ruta en operaciones de archivos
- [ ] Salida HTML escapada (sin contenido de usuario sin procesar representado como HTML)

**Datos sensibles:**
- [ ] Información personal no registrada (buscar patrones de correo electrónico, teléfono, SSN en registros)
- [ ] Los secretos no están en variables de entorno legibles del lado del cliente
- [ ] Sin secretos en código, comentarios o accesorios de prueba
- [ ] HTTPS forzado (sin respaldo HTTP)
- [ ] Datos sensibles cifrados en reposo (no solo codificados)

**Integraciones de terceros:**
- [ ] Webhooks verificados con firma (secreto del webhook de Stripe, etc.)
- [ ] Parámetro de estado OAuth validado (prevención de CSRF)
- [ ] URLs de redireccionamiento validadas contra lista blanca
- [ ] Claves API rotadas de las que vencen o han sido expuestas

## Fase 4: Pruebas de penetración (ligera)

Pruebe la aplicación directamente para detectar vulnerabilidades comunes:

```bash
# Prueba rápida de inyección SQL (envíe estos en campos de formulario y parámetros de URL):
' OR '1'='1
1; DROP TABLE users; --

# Prueba rápida de XSS:
<script>alert('xss')</script>
"><script>alert('xss')</script>

# Recorrido de ruta:
../../../etc/passwd
%2e%2e%2f%2e%2e%2fetc%2fpasswd

# Omisión de autenticación:
# Intente acceder a puntos finales autenticados sin un token
# Intente tokens caducados
# Intente tokens de un usuario diferente
```

Utilice OWASP ZAP o Burp Suite Community Edition para escaneo automatizado de su aplicación en ejecución.

## Fase 5: Informe y remediación

**Gravedad del hallazgo:**
- **Crítico**: explotable sin autenticación, riesgo de exfiltración de datos → corregir antes del lanzamiento
- **Alto**: requiere autenticación pero conduce a una violación de datos significativa → corregir dentro de 48 horas
- **Medio**: impacto limitado o difícil de explotar → corregir dentro del sprint
- **Bajo**: defensa en profundidad, problemas menores → corregir en la próxima ventana de mantenimiento

**Formato del informe:**
```markdown
## Revisión de seguridad — [Fecha]
Revisor: [nombre]
Alcance: [qué se revisó]

### Hallazgos críticos
1. [Hallazgo]: [descripción, ubicación, prueba de concepto, corrección]

### Hallazgos altos
...

### Hallazgos medios
...

### Plan de remediación
| Hallazgo | Propietario | Fecha objetivo | Estado |
|---|---|---|---|
```

## Contenido relacionado

- `/skills/productivity/ship-gate` — lista de verificación de seguridad previa al despliegue
- `/prompts/system-prompts/security-auditor` — indicación de auditoría de seguridad de Claude
- `/rules/common/api-design` — reglas de diseño seguro de API
- `/agents/roles/red-team` — simulación de adversario autorizada

---
