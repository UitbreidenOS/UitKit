# SSO & Integración de Identidad

Enterprise Edition se integra con proveedores de identidad SAML 2.0 y OpenID Connect (OIDC). Esta guía cubre la configuración con Okta, Azure AD, Ping Identity y otros proveedores comunes.

## Protocolos admitidos

- **SAML 2.0**: Para empresas con infraestructura AD/IdP local
- **OpenID Connect**: Para identidad en la nube (Okta, Auth0, Google Workspace, Azure)
- **LDAP (on-prem)**: Sincronización de directorios locales a través del conector LDAP (solo Claudient Cloud empresarial)

## Arquitectura

Claude Code no se autentica directamente contra un IdP. En su lugar:

1. **Integración en la nube** (Claudient Cloud): Enterprise Cloud actúa como Proveedor de Servicios SAML/OIDC (SP)
2. **On-prem** (hooks locales `.claude`): Identidad de configuración de git + validación de token JWT opcional
3. **Híbrido**: Claude Code local + backend de sesión Claudient Cloud para auditoría/aplicación de costos

## Setup: Okta (SAML 2.0)

### Paso 1: Crear aplicación SAML en Okta

1. Inicie sesión en el panel de control de administración de Okta
2. **Applications** → **Create App Integration**
3. Elegir **SAML 2.0**
4. Configurar:
   - **Single sign on URL**: `https://cloud.claudient.com/auth/saml/acs`
   - **Audience URI (Entity ID)**: `https://cloud.claudient.com`
   - **Name ID Format**: Email address
   - **Application username**: `${user.email}`

### Paso 2: Asignar usuarios y grupos

- Agregar usuarios/grupos a la aplicación Claudient en Okta
- Configurar las afirmaciones de pertenencia a grupo (por ejemplo, "Ingeniería", "Finanzas")

### Paso 3: Configurar Claudient Cloud

Proporcione metadatos XML de Okta a Claudient:

```bash
curl https://company.okta.com/app/exk123abc/sso/saml/metadata > okta-metadata.xml
curl -X POST https://api.claudient.com/enterprise/sso/okta \
  -H "Authorization: Bearer $CLAUDIENT_API_KEY" \
  -F "metadata=@okta-metadata.xml"
```

### Paso 4: Probar inicio de sesión

```bash
# Claude Code detectará el requisito de SAML e indicará autenticarse
# CLAUDIENT_SESSION_TOKEN=eyJ...
```

## Setup: Azure AD (OIDC)

### Paso 1: Registrar aplicación en Azure

1. **Azure Portal** → **Azure Active Directory** → **App registrations** → **New registration**
2. Configurar:
   - **Name**: Claudient
   - **Redirect URI**: `https://cloud.claudient.com/auth/oidc/callback`

### Paso 2: Crear Client Secret

1. **Certificates & secrets** → **New client secret**
2. Copiar **Client ID** y **Client Secret**

### Paso 3: Configurar escopios y afirmaciones OIDC

1. **API permissions** → **Add a permission** → **Microsoft Graph**
   - Agregue: `email`, `profile`, `openid`
2. **Token configuration**: Agregue afirmación opcional: `groups`

## Setup: On-Premises (Validación JWT local)

Para despliegues air-gapped sin conectividad en la nube:

### Paso 1: Generar par de claves RSA

Obtenga la **clave pública** de su IdP:

```bash
mkdir -p .claude/auth
curl https://your-idp.company.com/public-key.pem > .claude/auth/public-key.pem
```

### Paso 2: Configurar gancho de validación JWT

Agregue a `settings.json`:

```json
{
  "auth": {
    "mode": "jwt",
    "public_key_path": "${CLAUDE_PROJECT_DIR}/.claude/auth/public-key.pem",
    "expected_issuer": "https://your-idp.company.com",
    "expected_audience": "claudient"
  }
}
```

## Asignación de roles

Después de la autenticación exitosa, asigne grupos de IdP a roles de Claude Code:

### Mapeo de grupo de Okta

```json
{
  "sso": {
    "okta": {
      "group_mapping": {
        "okta_group:Engineering": "role:engineer",
        "okta_group:Security": "role:security-officer",
        "okta_group:Finance": "role:cost-controller",
        "okta_group:Admins": "role:admin"
      }
    }
  }
}
```

## Solución de problemas

### Error: `SAML response signature invalid`
- Asegúrese de que el certificado de Okta no haya rotado
- Verifique que el reloj del sistema esté sincronizado (NTP)

### Error: `JWT expired`
- Claude Code debería actualizar tokens automáticamente
- Si no, configure `token_refresh_interval: 300` en settings.json

### Error: `User has no assigned roles`
- Verifique que la afirmación de grupo esté incluida en el token
- Compruebe que el nombre del grupo coincida exactamente en `group_mapping`

## Mejores prácticas de seguridad

1. **Use solo HTTPS**: Todos los redireccionamientos y devoluciones de llamada sobre TLS 1.3
2. **Valide los pines de certificado** (opcional): Fije el certificado de IdP
3. **Rote los secretos**: Secretos de cliente, JWTs, claves API según el horario
4. **Deshabilite la autenticación básica**: Desactive la autenticación de contraseña una vez que SSO esté implementado
5. **Monitoree registros de IdP**: Alerte sobre intentos de autenticación fallida
6. **Audite cambios de grupo**: Registre cuándo se modifican grupos en IdP

## Notas de cumplimiento

- **Soporte SAML 2.0**: Satisface requisito de inicio de sesión único para SOC 2 Type II (AC-2.1)
- **Federación OIDC**: Se alinea con NIST SP 800-63-3 (directrices de identidad digital)
- **Registro de auditoría**: Eventos de autenticación para cumplimiento HIPAA, GDPR

---

**Last updated**: 2026-06-15  
**Related files**: `RBAC.md`, `COMPLIANCE.md`
