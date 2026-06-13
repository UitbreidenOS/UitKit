# MCP: Auth0

Verbind Claude Code naar Auth0 voor identiteit en access management — query gebruikers, manage rollen, inspecteer login logs, en neem remediation acties zonder terminal laten.

## Waarom je dit nodig

Gebruiker toegang issues — vergrendelde accounts, verdachte login patronen, rol mismatches — vereisen constant context wissel je code en Auth0 Management Dashboard. Auth0 MCP brengt die data Claude, dus je kunt onderzoeken incident, block compromised account, of audit rol toewijzingen één conversatie.

## Vereisten

- Auth0 account (enig plan; Management API toegang beschikbaar alle plans inclusief gratis)
- **Machine-to-Machine (M2M) applicatie** geregistreerd je Auth0 tenant, geautoriseerd roepen Auth0 Management API
- M2M applicatie's **Client ID** en **Client Secret**
- Je Auth0 **domein** (bijv. `your-tenant.us.auth0.com`)

## Installatie

Installeer officiële Auth0 MCP server via npx — geen global installatie vereist.

```bash
npx @auth0/auth0-mcp-server --version
```

## Configuratie

Voeg volgende naar je `~/.claude/settings.json` (user-niveau) of `.claude/settings.json` (project-niveau):

```json
{
  "mcpServers": {
    "auth0": {
      "command": "npx",
      "args": ["-y", "@auth0/auth0-mcp-server"],
      "env": {
        "AUTH0_DOMAIN": "your-tenant.us.auth0.com",
        "AUTH0_CLIENT_ID": "YOUR_M2M_CLIENT_ID",
        "AUTH0_CLIENT_SECRET": "YOUR_M2M_CLIENT_SECRET"
      }
    }
  }
}
```

Vervang `your-tenant.us.auth0.com` je werkelijk Auth0 domein — zichtbaar Auth0 Dashboard onder **Applications → je M2M app → Domain**.

## Sleutel tools

| Tool | Beschrijving | Sleutel parameters |
|---|---|---|
| `list_users` | Zoeken en list gebruikers tenant | `q` (Lucene query), `per_page`, `page`, `sort` |
| `get_user` | Haal volledige profiel enkel gebruiker | `id` (Auth0 user ID, bijv. `auth0\|abc123`) |
| `create_user` | Maak nieuw gebruiker in database verbinding | `email`, `password`, `connection`, `name` |
| `assign_roles` | Wijs één of meer rollen gebruiker | `id`, `roles` (array rol ID's) |
| `list_applications` | List alle applicatie's geregistreerd tenant | `per_page`, `page` |
| `get_logs` | Haal tenant log events met filter ondersteuning | `q` (event type, user, IP), `per_page`, `from`, `take` |
| `block_user` | Blokkeer gebruiker account (voorkomen login) | `id` |

## Gebruiksvoorbeelden

```
List alle gebruikers die nu in afgelopen 7 dagen aanmelden

Blokkeer account voor user email@example.com onmiddellijk

Toon alle mislukken login pogingen uit afgelopen 24 uur

Wijs "admin" rol toe gebruiker auth0|64a1f2b3c4d5e6f7a8b9c0d1

List alle applicatie's geregistreerd dit Auth0 tenant
```

## Authenticatie — M2M applicatie maken

1. Login Auth0 Dashboard en gaan **Applications → Creëer Applicatie**
2. Kies **Machine to Machine Applicatie's** en naam (bijv. `claude-code-mcp`)
3. Volgende scherm, selecteer **Auth0 Management API** als authorized API
4. Grant scopes je use case vereist (zie Scopes beneden) en klik **Autoriseer**
5. Gaan **Settings** tabblad je nieuwe M2M app en kopiëer **Domain**, **Client ID**, en **Client Secret**
6. Plak alle drie in `env` blok je settings.json

**Minimum vereiste scopes door operatie:**

| Operatie | Vereiste scope |
|---|---|
| Lees gebruikers | `read:users` |
| Maak gebruikers | `create:users` |
| Blokkeer/deblokkeer gebruikers | `update:users` |
| Wijs rollen | `update:users`, `read:roles` |
| Lees logs | `read:logs` |
| List applicatie's | `read:clients` |

Grant alleen scopes je nodig. Vermijd `read:client_keys` — expose client secret's alle applicatie's.

## Tips

- Auth0 user ID's volgen formaat `provider|id` — database verbindingen het `auth0|hex_id`. Gebruik `list_users` met `q:email:user@example.com` vind ID voordat laat enkel-gebruiker operaties.
- `get_logs` ondersteunt Auth0's event type codes query: `q=type:f` retourneren alle mislukken logins; `q=type:s` retourneren success's. Volledige event type reference Auth0 docs onder Log Event Type Codes.
- `block_user` reversible — gebruik `update_user` met `blocked: false` (of equivalent MCP tool als exposed) deblokkeer. Blokkeren invalideren niet bestaande sessies — paar met call sessie revoke nodig onmiddellijk lockout.
- Management API tarief limiet 2 verzoeken/seconde per tenant meeste gratis plans, en hoger limieten betaalde plans. Vermijd looping `get_user` aanroepen strak sequences.
- M2M tokens uitgegeven Auth0 vervallen 24 uur standaard. MCP server handhaaft token refresh automatisch — geen handmatige rotatie vereist.
- Voor multi-tenant architecturen (één Auth0 tenant per klant), je zult nodig apart MCP config per tenant. Overweeg gebruiken project-niveau settings.json bereikt elk project.

## Kosten opmerkingen

Auth0 Management API aanroepen inbegrepen alle Auth0 plans — geen per-call fees. Echter, gratis plans limiet 1.000 active gebruikers en handhaaf Management API rate limieten. Production tenants betaalde plans hoger rate limieten en gebruiker capaciteit hebben. Controleer je plan's Management API quota onder **Settings → Tenant Settings** Auth0 Dashboard.

---
