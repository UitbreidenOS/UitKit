# SSO & Identity Integration

Enterprise Edition intègre avec les SAML 2.0 et OpenID Connect (OIDC) identity providers. Ce guide couvre le setup avec Okta, Azure AD, Ping Identity, et autres providers communs.

## Supported Protocols

- **SAML 2.0**: Pour enterprises avec infrastructure on-prem AD/IdP
- **OpenID Connect**: Pour identity cloud (Okta, Auth0, Google Workspace, Azure)
- **LDAP (on-prem)**: Sync répertoire local via LDAP connector (Enterprise Cloud seulement)

## Architecture

Claude Code n'authentifie pas directement contre un IdP. À la place:

1. **Cloud integration** (Claudient Cloud): Enterprise Cloud agit comme SAML/OIDC Service Provider (SP), manage sessions
2. **On-prem** (local `.claude/` hooks): Identité git config + validation JWT token optionnel via public key `pem`-format
3. **Hybride**: Claude Code local + backend session Claudient Cloud pour audit/cost enforcement

## Setup: Okta (SAML 2.0)

### Step 1: Create SAML Application dans Okta

1. Loggez-vous au dashboard admin Okta
2. **Applications** → **Create App Integration**
3. Choisissez **SAML 2.0**
4. Configurez:
   - **Single sign on URL**: `https://cloud.claudient.com/auth/saml/acs`
   - **Audience URI (Entity ID)**: `https://cloud.claudient.com`
   - **Name ID Format**: Email address
   - **Application username**: `${user.email}`

### Step 2: Assign Users & Groups

- Ajoutez users/groups à l'application Claudient dans Okta
- Configurez group membership claims (e.g., "Engineering", "Finance")

### Step 3: Configure Claudient Cloud

Fournissez metadata XML Okta à Claudient:

```bash
# Téléchargez metadata depuis Okta:
# Admin → Applications → Claudient → SAML 2.0 → Identity Provider metadata
curl https://company.okta.com/app/exk123abc/sso/saml/metadata > okta-metadata.xml

# Upload à Claudient Cloud:
curl -X POST https://api.claudient.com/enterprise/sso/okta \
  -H "Authorization: Bearer $CLAUDIENT_API_KEY" \
  -F "metadata=@okta-metadata.xml"
```

### Step 4: Test Login

```bash
# Claude Code détectera SAML requirement et promptera:
# "Please authenticate via Okta: https://cloud.claudient.com/auth/okta?challenge=xyz"

# Après Okta login, recevrez session token:
# CLAUDIENT_SESSION_TOKEN=eyJ...
```

## Setup: Azure AD (OIDC)

### Step 1: Register Application dans Azure

1. **Azure Portal** → **Azure Active Directory** → **App registrations** → **New registration**
2. Configurez:
   - **Name**: Claudient
   - **Redirect URI**: `https://cloud.claudient.com/auth/oidc/callback`
   - **Accounts in this organizational directory only**

### Step 2: Create Client Secret

1. **Certificates & secrets** → **New client secret**
2. Copiez **Client ID** et **Client Secret**

### Step 3: Configure OIDC Scopes & Claims

1. **API permissions** → **Add a permission** → **Microsoft Graph**
   - Ajoutez: `email`, `profile`, `openid`
2. **Token configuration**:
   - Ajoutez optional claim: `groups` (in Access token)

### Step 4: Configure Claudient Cloud

```bash
curl -X POST https://api.claudient.com/enterprise/sso/azure \
  -H "Authorization: Bearer $CLAUDIENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "12345678-abcd-efgh-ijkl-mnopqrstuvwx",
    "client_secret": "~Xy-_your_secret_here",
    "tenant_id": "common",
    "scopes": ["email", "profile", "openid"],
    "groups_claim": "groups"
  }'
```

### Step 5: Test OIDC Flow

```bash
# Claude Code promptera pour Azure AD authentication
# Redirects à: https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/authorize
# Après approval, recevez ID token avec email + groups
```

## Setup: On-Premises (Local JWT Validation)

Pour déploiements air-gapped sans cloud connectivity:

### Step 1: Generate RSA Keypair

Votre IdP génère et signe les JWT tokens. Obtenez la **public key**:

```bash
# Depuis votre IdP (Keycloak, Ping, etc.), téléchargez public key au format PEM:
# Exemple: https://keycloak.company.com/auth/realms/claudient/protocol/openid-connect/certs

# Sauvegardez à .claude/auth/public-key.pem
mkdir -p .claude/auth
curl https://your-idp.company.com/public-key.pem > .claude/auth/public-key.pem
```

### Step 2: Configure JWT Validation Hook

Ajoutez à `settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/jwt-validator.sh",
            "async": false
          }
        ]
      }
    ]
  },
  "auth": {
    "mode": "jwt",
    "public_key_path": "${CLAUDE_PROJECT_DIR}/.claude/auth/public-key.pem",
    "expected_issuer": "https://your-idp.company.com",
    "expected_audience": "claudient"
  }
}
```

### Step 3: Pass JWT at Session Start

Les utilisateurs doivent fournir un token JWT valide:

```bash
# Option A: Environment variable
export CLAUDIENT_TOKEN=$(curl -X POST https://your-idp.company.com/token \
  -d "grant_type=client_credentials&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET")

# Option B: Depuis git config (si IdP intégré à git)
# (Git credential providers peuvent fournir JWT)

# Option C: Interactive login (si OAuth2 provider)
# Claude Code promptera: "Please authenticate"
```

## Role Mapping

Après successful authentication, mappez IdP groups à Claude Code roles:

### Okta Group Mapping

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

### Azure AD Group Mapping

```json
{
  "sso": {
    "azure": {
      "group_mapping": {
        "00000000-0000-0000-0000-000000000001": "role:engineer",
        "00000000-0000-0000-0000-000000000002": "role:security-officer"
      }
    }
  }
}
```

## User Provisioning

### Just-In-Time (JIT) Provisioning

Quand un utilisateur login via SSO pour la première fois:

1. IdP claims sont validés
2. User record créé dans Claudient avec:
   - Email depuis `email` claim
   - Name depuis `name` claim
   - Roles depuis `groups` claim (mappé via group_mapping)
3. User assigne default permissions (e.g., "engineer" peut run Bash, Read, Write)

### SCIM Provisioning (Claudient Cloud seulement)

Sync users depuis Okta/Azure automatiquement:

```bash
curl -X POST https://api.claudient.com/enterprise/scim/config \
  -H "Authorization: Bearer $CLAUDIENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true,
    "provider": "okta",
    "scim_endpoint": "https://cloud.claudient.com/scim/v2",
    "bearer_token": "scim_secret_token_here"
  }'
```

## Troubleshooting

### SAML Assertion Validation Fails

**Error**: `SAML response signature invalid`

- Assurez-vous Okta certificate n'a pas rotated (check metadata)
- Vérifiez system clock est synchronized (NTP)
- Checkez SP assertion consumer service URL matches exactement

### OIDC Token Expires

**Error**: `JWT expired`

- Claude Code devrait refresh tokens automatiquement
- Si non, set `token_refresh_interval: 300` (seconds) dans settings.json
- Assurez-vous IdP permet offline access pour refresh tokens

### User Groups Not Mapped

**Error**: `User has no assigned roles`

- Vérifiez group claim est inclus dans token: `jq -R 'split(".") | .[1] | @base64d | fromjson' <<< $TOKEN`
- Checkez group name matches exactement dans `group_mapping`
- Assurez-vous user est assigné group dans IdP (Okta/Azure)

### On-Prem JWT Validation Fails

**Error**: `JWT signature verification failed`

- Téléchargez latest public key depuis IdP
- Vérifiez PEM format: devrait commencer avec `-----BEGIN PUBLIC KEY-----`
- Test localement: `echo $TOKEN | jq -R 'split(".") | .[1] | @base64d | fromjson'`

## Security Best Practices

1. **Utilisez HTTPS seulement**: Tous redirects et callbacks sur TLS 1.3
2. **Validez certificate pins** (optionnel): Pin certificat IdP pour prévenir MITM
3. **Rotatez secrets**: Client secrets, JWTs, API keys sur schedule
4. **Désactivez basic auth**: Turnez off password authentication une fois SSO déployé
5. **Monitores IdP logs**: Alertez sur failed auth attempts, suspicious token usage
6. **Auditez group changes**: Log quand groups sont modifiés dans IdP (affecte Claude Code roles)

## Compliance Notes

- **SAML 2.0 support** satisfait single sign-on exigence pour SOC 2 Type II (AC-2.1)
- **OIDC federation** aligne avec NIST SP 800-63-3 (digital identity guidelines)
- **Audit logging** d'authentication events pour HIPAA, GDPR compliance (voir AUDIT_TRAIL.md)

---

**Last updated**: 2026-06-15  
**Related files**: `RBAC.md`, `COMPLIANCE.md`
