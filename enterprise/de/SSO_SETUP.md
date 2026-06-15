# SSO & Identity Integration

Enterprise Edition integriert sich mit SAML 2.0 und OpenID Connect (OIDC) Identity Providern. Dieser Leitfaden behandelt die Einrichtung mit Okta, Azure AD, Ping Identity und anderen gängigen Providern.

## Unterstützte Protokolle

- **SAML 2.0**: Für Unternehmen mit lokaler AD/IdP-Infrastruktur
- **OpenID Connect**: Für Cloud-Identität (Okta, Auth0, Google Workspace, Azure)
- **LDAP (on-prem)**: Lokale Verzeichnissynchronisierung über LDAP-Connector (nur Enterprise Cloud)

## Architektur

Claude Code authentifiziert sich nicht direkt gegen einen IdP. Stattdessen:

1. **Cloud-Integration** (Claudient Cloud): Enterprise Cloud agiert als SAML/OIDC Service Provider (SP), verwaltet Sessions
2. **On-Prem** (lokale `.claude/` Hooks): Git-Config-Identität + optionale JWT-Token-Validierung über öffentlichen Schlüssel im `pem`-Format
3. **Hybrid**: Lokaler Claude Code + Claudient Cloud Session-Backend für Audit/Kostendurchsetzung

## Setup: Okta (SAML 2.0)

### Schritt 1: SAML-Anwendung in Okta erstellen

1. Melden Sie sich beim Okta Admin-Dashboard an
2. **Applications** → **Create App Integration**
3. Wählen Sie **SAML 2.0**
4. Konfigurieren Sie:
   - **Single sign on URL**: `https://cloud.claudient.com/auth/saml/acs`
   - **Audience URI (Entity ID)**: `https://cloud.claudient.com`
   - **Name ID Format**: Email address
   - **Application username**: `${user.email}`

### Schritt 2: Benutzer und Gruppen zuweisen

- Fügen Sie Benutzer/Gruppen zur Claudient-Anwendung in Okta hinzu
- Konfigurieren Sie Gruppenmitgliedschaftsansprüche (z. B. „Engineering", „Finance")

### Schritt 3: Claudient Cloud konfigurieren

Stellen Sie Okta-Metadaten-XML für Claudient bereit:

```bash
# Laden Sie Metadaten von Okta herunter:
# Admin → Applications → Claudient → SAML 2.0 → Identity Provider metadata
curl https://company.okta.com/app/exk123abc/sso/saml/metadata > okta-metadata.xml

# Hochladen zu Claudient Cloud:
curl -X POST https://api.claudient.com/enterprise/sso/okta \
  -H "Authorization: Bearer $CLAUDIENT_API_KEY" \
  -F "metadata=@okta-metadata.xml"
```

### Schritt 4: Anmeldung testen

```bash
# Claude Code erkennt SAML-Anforderung und fordert auf:
# "Please authenticate via Okta: https://cloud.claudient.com/auth/okta?challenge=xyz"

# Nach Okta-Anmeldung erhalten Sie ein Session-Token:
# CLAUDIENT_SESSION_TOKEN=eyJ...
```

## Setup: Azure AD (OIDC)

### Schritt 1: Anwendung in Azure registrieren

1. **Azure Portal** → **Azure Active Directory** → **App registrations** → **New registration**
2. Konfigurieren Sie:
   - **Name**: Claudient
   - **Redirect URI**: `https://cloud.claudient.com/auth/oidc/callback`
   - **Accounts in this organizational directory only**

### Schritt 2: Client Secret erstellen

1. **Certificates & secrets** → **New client secret**
2. Kopieren Sie **Client ID** und **Client Secret**

### Schritt 3: OIDC-Scopes und -Ansprüche konfigurieren

1. **API permissions** → **Add a permission** → **Microsoft Graph**
   - Fügen Sie hinzu: `email`, `profile`, `openid`
2. **Token configuration**:
   - Optionalen Anspruch hinzufügen: `groups` (im Access Token)

### Schritt 4: Claudient Cloud konfigurieren

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

### Schritt 5: OIDC-Fluss testen

```bash
# Claude Code fordert zur Azure AD-Authentifizierung auf
# Weiterleitung zu: https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/authorize
# Nach Genehmigung erhalten Sie ID-Token mit E-Mail und Gruppen
```

## Setup: On-Premises (lokale JWT-Validierung)

Für Air-Gapped-Bereitstellungen ohne Cloud-Konnektivität:

### Schritt 1: RSA-Schlüsselpaar generieren

Ihr IdP generiert und signiert JWT-Token. Beschaffen Sie sich den **öffentlichen Schlüssel**:

```bash
# Von Ihrem IdP (Keycloak, Ping, etc.) herunterladen, öffentliche Schlüssel im PEM-Format:
# Beispiel: https://keycloak.company.com/auth/realms/claudient/protocol/openid-connect/certs

# Speichern Sie unter .claude/auth/public-key.pem
mkdir -p .claude/auth
curl https://your-idp.company.com/public-key.pem > .claude/auth/public-key.pem
```

### Schritt 2: JWT-Validierungs-Hook konfigurieren

Fügen Sie zu `settings.json` hinzu:

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

### Schritt 3: JWT bei Session-Start übergeben

Benutzer müssen ein gültiges JWT-Token bereitstellen:

```bash
# Option A: Umgebungsvariable
export CLAUDIENT_TOKEN=$(curl -X POST https://your-idp.company.com/token \
  -d "grant_type=client_credentials&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET")

# Option B: Aus Git-Konfiguration (falls IdP mit Git integriert)
# (Git-Anmeldeinformationsanbieter können JWT bereitstellen)

# Option C: Interaktive Anmeldung (falls OAuth2-Anbieter)
# Claude Code fordert auf: "Please authenticate"
```

## Rollenmapping

Nach erfolgreichem Authentifizierung ordnen Sie IdP-Gruppen Claude Code-Rollen zu:

### Okta-Gruppenmapping

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

### Azure AD Gruppenmapping

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

## Benutzerbereitstellung

### Just-In-Time (JIT) Bereitstellung

Wenn sich ein Benutzer zum ersten Mal über SSO anmeldet:

1. IdP-Ansprüche werden validiert
2. Benutzerdatensatz wird in Claudient mit folgenden Angaben erstellt:
   - E-Mail aus `email`-Anspruch
   - Name aus `name`-Anspruch
   - Rollen aus `groups`-Anspruch (zugeordnet via group_mapping)
3. Benutzer werden Standard-Berechtigungen zugewiesen (z. B. „Engineer" kann Bash, Read, Write ausführen)

### SCIM-Bereitstellung (nur Claudient Cloud)

Synchronisieren Sie Benutzer automatisch von Okta/Azure:

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

### SAML Assertion Validierung fehlgeschlagen

**Fehler**: `SAML response signature invalid`

- Stellen Sie sicher, dass das Okta-Zertifikat nicht rotiert wurde (Metadaten überprüfen)
- Verifizieren Sie, dass die Systemuhr synchronisiert ist (NTP)
- Überprüfen Sie, dass die SP-Assertionsverbraucherdienst-URL genau übereinstimmt

### OIDC Token läuft ab

**Fehler**: `JWT expired`

- Claude Code sollte Tokens automatisch aktualisieren
- Falls nicht, setzen Sie `token_refresh_interval: 300` (Sekunden) in settings.json
- Stellen Sie sicher, dass IdP den Offline-Zugriff für Aktualisierungs-Tokens zulässt

### Benutzergruppen nicht zugeordnet

**Fehler**: `User has no assigned roles`

- Überprüfen Sie, ob der Gruppennamen schrieb im Token enthalten ist: `jq -R 'split(".") | .[1] | @base64d | fromjson' <<< $TOKEN`
- Überprüfen Sie, dass der Gruppenname genau in `group_mapping` übereinstimmt
- Stellen Sie sicher, dass dem Benutzer die Gruppe in IdP (Okta/Azure) zugewiesen wird

### On-Prem JWT Validierung fehlgeschlagen

**Fehler**: `JWT signature verification failed`

- Laden Sie den neuesten öffentlichen Schlüssel von IdP herunter
- Verifizieren Sie das PEM-Format: sollte mit `-----BEGIN PUBLIC KEY-----` beginnen
- Testen Sie lokal: `echo $TOKEN | jq -R 'split(".") | .[1] | @base64d | fromjson'`

## Sicherheitsbestpraktiken

1. **Verwenden Sie nur HTTPS**: Alle Umleitungen und Rückrufe über TLS 1.3
2. **Validieren Sie Zertifikats-Pins** (optional): Pin-IdP-Zertifikat zur Verhinderung von MITM
3. **Rotieren Sie Geheimnisse**: Client-Geheimnisse, JWTs, API-Schlüssel nach Plan
4. **Deaktivieren Sie die Basis-Authentifizierung**: Schalten Sie die Passwortauthentifizierung aus, sobald SSO bereitgestellt ist
5. **Überwachen Sie IdP-Protokolle**: Benachrichtigen Sie bei fehlgeschlagenen Authentifizierungsversuchen, verdächtigem Token-Gebrauch
6. **Auditgruppen-Änderungen**: Protokollieren Sie, wenn Gruppen im IdP geändert werden (wirkt sich auf Claude Code-Rollen aus)

## Compliance-Notizen

- **SAML 2.0 Unterstützung** erfüllt die Single-Sign-On-Anforderung für SOC 2 Type II (AC-2.1)
- **OIDC-Föderationen** entspricht NIST SP 800-63-3 (Digital Identity Guidelines)
- **Audit Logging** von Authentifizierungsereignissen für HIPAA, GDPR Compliance (siehe AUDIT_TRAIL.md)

---

**Last updated**: 2026-06-15  
**Related files**: `RBAC.md`, `COMPLIANCE.md`
