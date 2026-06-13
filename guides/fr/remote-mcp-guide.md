# Serveurs MCP Distants — Transport, Auth, et Opérations de Production

Comment connecter Claude Code à des serveurs MCP distants : sélection du transport, motifs d'authentification, découverte d'outil différée, hébergement, et renforcement pour la production.

---

## Ce qui rend un MCP « Distant »

Les serveurs MCP locaux s'exécutent comme processus enfants sur la même machine que Claude Code. Les serveurs MCP distants s'exécutent ailleurs — sur un hôte cloud, un service interne partagé, ou l'infrastructure d'un fournisseur — et Claude Code se connecte à eux sur un réseau.

La distinction importe pour :
- **Auth :** les processus locaux héritent des variables d'environnement; les serveurs distants requièrent le passage explicite des credentials
- **Coût de startup :** les serveurs locaux démarrent avec Claude Code; les serveurs distants ont une latence round-trip réseau sur chaque appel d'outil
- **Partage :** un MCP distant peut servir plusieurs développeurs et environnements d'un déploiement unique
- **Maintenance :** les binaires de serveur locaux ont besoin d'être installés et mis à jour partout; les serveurs distants sont mis à niveau centralement

---

## Types de Transport

Le spec MCP 2025-11 définit trois types de transport. Comprendre lequel un serveur utilise détermine comment vous le configurez et les caractéristiques de latence à attendre.

### stdio — Processus local (champ command)

Le transport MCP original. Claude Code génère le serveur comme subprocess et communique via stdin/stdout pipes.

```json
{
  "mcpServers": {
    "my-local-server": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/path/to/dir"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

**Caractéristiques :**
- Zéro latence réseau — communication IPC pipe
- Le processus serveur est possédé par Claude Code — le cycle de vie est lié à la session
- Auth via variables d'environnement passées dans le champ `env`
- Non partageables à travers machines ou utilisateurs
- Les crashes de subprocess terminent la connexion MCP silencieusement

**Quand utiliser stdio :** outils de développement locaux (système de fichiers, git, base de données locale), outils qui ont besoin d'accès aux fichiers de la machine locale ou processus, workflows pour développeur unique.

---

### SSE — HTTP Streaming (distants hérités)

Server-Sent Events sur HTTP. Le client maintient une connexion HTTP persistante ouverte; le serveur pousse les événements vers le bas. SSE était le premier transport MCP distant et reste le plus largement supporté depuis mi-2026.

```json
{
  "mcpServers": {
    "sentry": {
      "transport": "sse",
      "url": "https://mcp.sentry.io/sse",
      "headers": {
        "Authorization": "Bearer YOUR_SENTRY_TOKEN"
      }
    }
  }
}
```

**Caractéristiques :**
- Compatible HTTP/1.1 — fonctionne à travers la plupart des proxies et firewalls
- Connexion persistante — le serveur peut pousser les résultats d'outil progressivement
- Les headers sont envoyés avec la requête de connexion initiale
- Le comportement de reconnexion est automatique dans Claude Code (avec backoff exponentiel)
- Les connexions SSE sont unidirectionnelles du serveur vers le client — les invocations d'outil vont via un canal POST séparé

**Profil de latence :** 50–300ms de latence supplémentaire par appel d'outil vs stdio, dépendant de la géographie du serveur et de la réutilisation de connexion.

---

### Streamable-HTTP — Nouveau Par Défaut (MCP 2025-11)

Le spec MCP 2025-11 a introduit streamable-HTTP comme transport distant préféré. Il utilise les requêtes HTTP POST standard avec les corps de réponse streaming, éliminant le motif awkward dual-channel de SSE.

```json
{
  "mcpServers": {
    "my-server": {
      "transport": "http",
      "url": "https://mcp.example.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN"
      }
    }
  }
}
```

**Caractéristiques :**
- Chaque appel d'outil est une seule requête POST avec une réponse streaming
- Aucune connexion persistente requise — fonctionne bien derrière les équilibreurs de charge HTTP/2
- Implémentation de serveur plus simple que SSE (pas de gestion dual-channel)
- Stateless du point de vue infrastructure — facile à mettre à l'échelle horizontalement
- Supporte les jetons de session via le header de réponse `Mcp-Session-Id` pour les serveurs stateful qui en ont besoin

**Quand utiliser streamable-HTTP over SSE :**
- Hébergement derrière Cloudflare Workers ou tout edge runtime (les connexions SSE persistantes sont problématiques là)
- Déploiements multi-tenant à haute concurrence
- Tout nouveau serveur que vous écrivez vous-même — préférez streamable-HTTP

**Note de compatibilité :** Claude Code supporte à la fois `"transport": "sse"` et `"transport": "http"`. Les anciens serveurs qui ne parlent que SSE continueront à fonctionner. Les nouveaux MCPs vendeur lancés après le spec 2025-11 utilisent de plus en plus streamable-HTTP.

---

## Configuration d'MCP distant dans settings.json

Le champ `"url"` signale une connexion distante. Le champ `"command"` signale un processus stdio local. Ne jamais utiliser les deux dans la même entrée de serveur.

**Localisation de settings.json :**
- Au niveau projet : `.claude/settings.json` (coché dans le repo — évitez d'intégrer les tokens ici)
- Au niveau utilisateur : `~/.claude/settings.json` (machine-local — sûr pour les tokens personnels)
- Au niveau système : `/etc/claude/settings.json` (géré par les admins pour les environnements partagés)

**Structure complète de configuration de serveur distant :**
```json
{
  "mcpServers": {
    "server-name": {
      "transport": "sse",
      "url": "https://hostname/path",
      "headers": {
        "HeaderName": "value"
      },
      "timeout": 30000,
      "connectionTimeout": 10000
    }
  }
}
```

| Champ | Requis | Objectif |
|---|---|---|
| `transport` | Non (défaut `"sse"`) | `"sse"` ou `"http"` |
| `url` | Oui | URL complète au endpoint MCP |
| `headers` | Non | Headers HTTP envoyés avec chaque requête |
| `timeout` | Non | Timeout d'appel d'outil en millisecondes (défaut 30000) |
| `connectionTimeout` | Non | Timeout de connexion initiale en millisecondes |

---

## Motifs d'auth

### OAuth 2.0 Bearer Tokens

Le motif d'auth standard pour les MCPs distants hébergés par des fournisseurs. Vous obtenez un token du flux OAuth ou page de clés API du service, puis le passez comme header Authorization.

```json
{
  "mcpServers": {
    "github-copilot": {
      "transport": "http",
      "url": "https://api.githubcopilot.com/mcp/v1",
      "headers": {
        "Authorization": "Bearer ghp_YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

**Sourcing de token :** Ne jamais coder dur les tokens dans `.claude/settings.json` si le fichier est coché dans le contrôle de version. Utilisez plutôt l'interpolation de variable d'environnement :

```json
{
  "mcpServers": {
    "neon": {
      "transport": "sse",
      "url": "https://mcp.neon.tech/sse",
      "headers": {
        "Authorization": "Bearer ${NEON_API_KEY}"
      }
    }
  }
}
```

Claude Code développe `${VAR_NAME}` de l'environnement du processus avant d'établir la connexion. Définissez la variable dans votre profil de shell ou dans la section `env` de vos settings au niveau utilisateur.

**Flux OAuth 2.0 PKCE (auth basée navigateur) :** Certains MCPs distants (Supabase distant, GitHub MCP) supportent l'OAuth basée navigateur. Quand configuré avec `"auth": "oauth"` et aucun token explicite, Claude Code ouvre une fenêtre navigateur pour le flux OAuth et stocke le token résultant dans le système de chaînes de clés.

```json
{
  "mcpServers": {
    "supabase": {
      "transport": "sse",
      "url": "https://mcp.supabase.com/sse",
      "auth": "oauth"
    }
  }
}
```

---

### Clé API dans Header Personnalisé

Certains services utilisent un nom de header personnalisé plutôt que `Authorization`. Cloudflare, Vercel, et plusieurs MCPs d'entreprise internes suivent ce motif.

```json
{
  "mcpServers": {
    "cloudflare": {
      "transport": "http",
      "url": "https://mcp.cloudflare.com/mcp",
      "headers": {
        "X-Auth-Key": "${CLOUDFLARE_API_KEY}",
        "X-Auth-Email": "${CLOUDFLARE_EMAIL}"
      }
    }
  }
}
```

Pour les MCPs internes, c'est commun d'envoyer aussi un identifiant de service ou tag d'environnement :

```json
{
  "mcpServers": {
    "internal-api": {
      "transport": "http",
      "url": "https://mcp.internal.company.com/mcp",
      "headers": {
        "X-Api-Key": "${INTERNAL_MCP_KEY}",
        "X-Environment": "production",
        "X-Client": "claude-code"
      }
    }
  }
}
```

---

### Mutual TLS (mTLS)

Pour les environnements d'entreprise où le serveur a besoin de vérifier l'identité du client en plus du client vérifiant le serveur. mTLS est configuré en dehors des headers — il requiert que Claude Code soit lancé avec les variables d'environnement de certificat définies.

```bash
export MCP_CLIENT_CERT=/path/to/client.crt
export MCP_CLIENT_KEY=/path/to/client.key
export MCP_CA_CERT=/path/to/ca.crt
```

```json
{
  "mcpServers": {
    "enterprise-mcp": {
      "transport": "http",
      "url": "https://secure-mcp.corp.example.com/mcp",
      "headers": {
        "X-Client-Id": "claude-code-workstation"
      }
    }
  }
}
```

La poignée de main TLS utilise les certificats de l'environnement; le header est l'identification client au niveau application par-dessus.

**Quand mTLS vaut la complexité de setup :** industries réglementées (fintech, healthcare, défense) où l'auth au niveau réseau est requis par politique de conformité, ou MCPs internes qui devraient seulement être accessibles depuis les machines émises par l'entreprise avec certificats inscrits.

---

## Découverte d'outil différée

Par défaut, quand Claude Code se connecte à un serveur MCP il récupère immédiatement le schéma complet d'outil — noms, descriptions, et JSON Schema pour chaque paramètre d'input — pour chaque serveur enregistré. À startup avec 10+ serveurs, cela peut ajouter 2–5 secondes et une rafale de requêtes réseau.

La découverte d'outil différée change ceci : la connexion serveur est établie, mais les schémas d'outil ne sont pas récupérés jusqu'à ce que Claude Code ait réellement besoin d'utiliser un outil de ce serveur. Une entrée "utiliser ce serveur" stub apparaît dans le contexte de Claude immédiatement; le schéma complet se charge au premier accès.

**L'activer :**
```bash
CLAUDE_CODE_EXPERIMENTAL_MCP_DEFERRED_DISCOVERY=1 claude
```

Ou le définir de manière permanente dans vos settings au niveau utilisateur :
```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_MCP_DEFERRED_DISCOVERY": "1"
  }
}
```

**Comment ça fonctionne :**
1. Au démarrage de session, Claude Code ouvre les connexions à tous les serveurs MCP configurés (poignée de main TCP + auth)
2. Il n'appelle `tools/list` sur aucun serveur
3. Le contexte de Claude contient le nom du serveur et un placeholder — Claude sait que le serveur existe mais pas quels outils il expose
4. Quand Claude décide d'utiliser un outil de ce serveur (basé sur le nom du serveur ou la connaissance de session antérieure), cela déclenche un appel `tools/list` pour récupérer le schéma
5. Le schéma est mis en cache pour le reste de la session

**Implications de latence du chargement lazy :**
- Le premier usage de n'importe quel outil d'un serveur encourt un round-trip `tools/list` avant l'appel d'outil réel
- Sur un serveur distant avec 100ms de latence, cela ajoute ~200ms au premier appel d'outil (requête + réponse pour `tools/list`)
- Les appels suivants dans la même session utilisent le schéma en cache — pas de surcharge
- Pour les serveurs que vous utilisez une fois par session (par ex., un outil de deploy), la surcharge est négligeable
- Pour les serveurs que vous utilisez répétitivement (par ex., un MCP de base de données), le coût one-time est immédiatement amorti

**Quand l'activer :**
- Vous avez 5+ serveurs MCP configurés
- La plupart des sessions utilisent seulement 2–3 d'eux
- La latence de startup est notable ou vous utilisez Claude Code dans un contexte CI/automation où le temps de startup de session importe

**Quand le garder désactivé :**
- Vous comptez sur Claude pour suggérer de manière proactive les outils des serveurs qu'il n'a pas encore utilisés dans la session
- Vous avez seulement 2–3 serveurs — le coût de startup est négligeable

---

## Exécuter votre propre MCP distant

### Cloudflare Workers

Mieux pour : outils accédés mondialement, ont besoin de basse latence à travers le monde, et ont une logique stateless simple. Les Workers s'exécutent à l'edge — les requêtes sont traitées dans la région la plus proche du client.

**Contraintes :**
- Limite de mémoire 128MB par requête
- Limite de temps CPU 30 secondes (le temps réel peut être jusqu'à 30s avec placement intelligent, mais peut être étendu)
- Pas d'état in-memory persistant entre requêtes — utilisez Durable Objects ou KV pour l'état
- Les connexions SSE persistantes sont awkward dans Workers — utilisez le transport streamable-HTTP à la place

**Scaffold MCP minimal pour Workers :**
```typescript
// worker.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'

export default {
  async fetch(request: Request): Promise<Response> {
    const server = new McpServer({ name: 'my-tool', version: '1.0.0' })

    server.tool('do_thing', { input: z.string() }, async ({ input }) => ({
      content: [{ type: 'text', text: `Result: ${input}` }]
    }))

    const transport = new StreamableHTTPServerTransport(request)
    await server.connect(transport)
    return transport.response
  }
}
```

**Tarification :** La couche gratuite de Workers couvre 100K requêtes/jour. Pour un outil de développeur utilisé par une personne, c'est effectivement gratuit.

---

### Railway

Mieux pour : serveurs qui ont besoin de connexions persistantes, d'état in-memory, ou de workers en arrière-plan. Railway exécute des conteneurs Docker standard avec des processus persistants.

**Pros :**
- Vrais processus de longue durée — les connexions SSE fonctionnent normalement
- Accès au système de fichiers pour les outils qui en ont besoin
- Variables d'environnement gérées via le dashboard de Railway
- Déploiement `railway link` + `railway up` en moins de 60 secondes
- Redémarrage automatique en cas de crash

**Cons :**
- Minimum $5/mois pour le service toujours actif (plan Hobby)
- Démarrages froids si le service dort (sur la couche gratuite)
- Single-region par défaut — pas d'edge global

**Recommandé pour :** MCPs de team internes, MCPs avec connexions de base de données qui ont besoin de pooling de connexion, n'importe quel MCP où vous avez besoin de déboguer avec des vrais logs.

**Motif settings.json de Railway :**
```json
{
  "mcpServers": {
    "team-tools": {
      "transport": "sse",
      "url": "https://team-tools.up.railway.app/sse",
      "headers": {
        "Authorization": "Bearer ${TEAM_MCP_TOKEN}"
      }
    }
  }
}
```

---

### Fly.io

Mieux pour : MCPs qui ont besoin de distribution globale avec des processus persistants (contrairement aux Workers, Fly exécute de vrais VMs). Fly peut placer votre app dans 30+ régions et router les requêtes vers l'instance la plus proche.

**Pros :**
- VMs persistants — OS complet, pas de limites de temps CPU
- Multi-région avec routage anycast construit-in
- La couche gratuite couvre les petites instances (256MB RAM, CPU partagé)
- VPN WireGuard natif pour accès réseau privé

**Cons :**
- Config plus complexe que Railway (requiert `fly.toml`)
- Les machines de couche gratuite dorment après 15 minutes d'inactivité — les démarrages froids s'appliquent
- Les multi-régions stateful requièrent une coordination prudente (Fly Volumes sont single-région)

**Quand choisir Fly sur Railway :** vos utilisateurs sont sur plusieurs continents et la latence au MCP importe, ou vous avez besoin de co-localiser le MCP avec une base de données dans une région spécifique.

**Motif settings.json de Fly.io :**
```json
{
  "mcpServers": {
    "global-search": {
      "transport": "http",
      "url": "https://my-mcp.fly.dev/mcp",
      "headers": {
        "Authorization": "Bearer ${SEARCH_MCP_TOKEN}"
      },
      "timeout": 45000
    }
  }
}
```

---

## MCPs distants officiels (2026)

Ceux-ci sont des MCPs distants opérés par les fournisseurs avec des SLAs de production, sans dépendance locale, et support officiel.

### MCP distant Supabase

Fournit l'accès à la base de données Postgres, Auth, Storage, et Edge Functions de votre projet Supabase.

```json
{
  "mcpServers": {
    "supabase": {
      "transport": "sse",
      "url": "https://mcp.supabase.com/sse",
      "headers": {
        "Authorization": "Bearer ${SUPABASE_ACCESS_TOKEN}"
      }
    }
  }
}
```

Obtenez votre token d'accès sur `supabase.com/dashboard/account/tokens`. Le token est un token d'accès personnel limité à votre compte Supabase — il peut accéder à tous vos projets.

### MCP distant Sentry

Accès aux issues, stack traces, santé de release, et données de performance.

```json
{
  "mcpServers": {
    "sentry": {
      "transport": "sse",
      "url": "https://mcp.sentry.io/sse",
      "headers": {
        "Authorization": "Bearer ${SENTRY_AUTH_TOKEN}"
      }
    }
  }
}
```

Token de : `sentry.io` > Settings > Auth Tokens > Create New Token. Scopes requis : `project:read`, `org:read`, `event:read`.

### MCP distant Neon

Branching de base de données, exécution SQL, introspection de schéma, et gestion de chaîne de connexion.

```json
{
  "mcpServers": {
    "neon": {
      "transport": "sse",
      "url": "https://mcp.neon.tech/sse",
      "headers": {
        "Authorization": "Bearer ${NEON_API_KEY}"
      }
    }
  }
}
```

Token de : `console.neon.tech` > Account Settings > API Keys.

### MCPs d'extension GitHub Copilot

La couche MCP de GitHub expose les données de repository, pull requests, issues, recherche de code, et Actions — la même surface de données que Copilot, accessible depuis Claude Code.

```json
{
  "mcpServers": {
    "github": {
      "transport": "http",
      "url": "https://api.githubcopilot.com/mcp/v1",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      }
    }
  }
}
```

Token de : GitHub > Settings > Developer settings > Personal access tokens > Fine-grained. Les scopes requis dépendent des outils utilisés — au minimum `repo:read` et `issues:read`.

---

## Sécurité : Modèle de confiance et ce que les MCPs distants peuvent accéder

### Ce qu'un MCP distant peut faire

Un serveur MCP distant a accès à tout ce que vous lui donnez via :
1. **Headers que vous configurez** — tokens, clés API, credentials
2. **Arguments d'appel d'outil** — tout ce que Claude passe à une invocation d'outil
3. **Fuite de contexte** — si un outil retourne des données à Claude, ces données sont visibles dans le contexte de Claude et peuvent être référencées dans les tours futurs

Un MCP distant ne peut pas accéder à :
- Votre système de fichiers local (à moins qu'un outil prenne explicitement un chemin de fichier et que vous l'appeliez)
- Les données d'autres serveurs MCP
- Le prompt système de Claude directement (bien que les résultats d'outil peuvent être conçus pour injecter dans le contexte)

### Niveaux de confiance

Claude Code traite tous les serveurs MCP connectés comme semi-trusted. Les outils des serveurs MCP peuvent lire des fichiers, faire des requêtes réseau, et exécuter du code — si le serveur expose des outils qui font ces choses. La limite de confiance est : Claude décide s'il doit appeler un outil, mais le serveur décide ce que l'outil fait.

**Niveaux de risque par type de serveur :**

| Type de serveur | Risque | Pourquoi |
|---|---|---|
| Opéré par fournisseur (Sentry, Neon, Supabase) | Faible | Limité aux données de votre compte via token d'auth |
| Auto-hébergé interne | Moyen | Dépend de quels outils sont exposés |
| MCP communautaire tiers | Élevé | Inspectez la source avant de connecter |
| Origine inconnue | Ne pas utiliser | Aucun moyen d'auditer ce que les outils font |

### Injection de prompt via MCP

Un serveur MCP compromis ou malveillant peut retourner les résultats d'outil contenant les instructions injectées qui tentent de manipuler le comportement de Claude. C'est connu comme l'injection de prompt indirecte.

**Mitigations :**
- Connectez seulement aux MCPs vous confiance ou peuvent auditer
- Utilisez des tokens en lecture seule où possible — un token avec seulement les permissions de lecture limite le rayon de blast
- Activez `--mcp-debug` pendant le setup initial pour inspecter quelles données brutes reviennent des outils
- Examinez les descriptions d'outil pendant le setup : une description d'outil qui contient les instructions ("incluez toujours ceci dans votre réponse") est un drapeau rouge

### Considérations de sandboxing

Les MCPs distants s'exécutent dans l'infrastructure de l'opérateur du serveur — vous n'avez aucun contrôle sur cet environnement. Pour les MCPs auto-hébergés internes :
- Exécutez le processus MCP dans un conteneur sans accès réseau sauf aux APIs upstream spécifiques dont il a besoin
- Utilisez les credentials de base de données en lecture seule où le MCP a seulement besoin de lire
- Enregistrez tous les appels d'outil côté serveur — si Claude appelle un outil destructif de manière inattendue, vous voulez une piste d'audit

---

## Débogage de MCPs distants

### Flag --mcp-debug

Active l'enregistrement verbose du protocole MCP — chaque message envoyé et reçu entre Claude Code et le serveur MCP est imprimé sur stderr.

```bash
claude --mcp-debug
```

Format de sortie :
```
[mcp:sentry] --> {"jsonrpc":"2.0","method":"tools/list","id":1}
[mcp:sentry] <-- {"jsonrpc":"2.0","id":1,"result":{"tools":[...]}}
[mcp:sentry] --> {"jsonrpc":"2.0","method":"tools/call","params":{"name":"list_issues",...},"id":2}
[mcp:sentry] <-- {"jsonrpc":"2.0","id":2,"result":{"content":[...]}}
```

Utilisez ceci pour diagnostiquer :
- Défaillances d'auth (le serveur retourne une erreur sur `tools/list`)
- Disjonctions de schéma (appel d'outil rejeté dû à forme d'input incorrecte)
- Sorties d'outil inattendues (voir exactement ce qui est revenu avant que Claude ne le traite)

### Erreurs courantes de connexion

**`ECONNREFUSED` / `Connection refused` :**
Le serveur ne fonctionne pas ou l'URL est erronée. Vérifiez l'URL avec curl :
```bash
curl -I https://your-mcp-server.com/sse
```

**`401 Unauthorized` :**
Le header d'auth est manquant ou le token est invalide. Vérifiez que la variable d'environnement est définie :
```bash
echo $YOUR_MCP_TOKEN
```

**`Connection timeout` :**
Le serveur est atteignable mais lent à répondre. Augmentez `connectionTimeout` dans les settings :
```json
{
  "mcpServers": {
    "slow-server": {
      "url": "https://...",
      "connectionTimeout": 20000
    }
  }
}
```

**`tools/list returned 0 tools` :**
Serveur connecté mais aucun outil n'est enregistré. Habituellement indique que le serveur a démarré mais n'a pas initialisé son registre d'outil — vérifiez les logs du serveur.

**`Tool call timeout` :**
L'outil s'est exécuté mais n'a pas retourné dans la fenêtre timeout. Augmentez `timeout` (défaut est 30000ms) :
```json
{
  "mcpServers": {
    "slow-db": {
      "url": "https://...",
      "timeout": 120000
    }
  }
}
```

### Test sans Claude Code

Utilisez `curl` ou `npx @modelcontextprotocol/inspector` pour vérifier un serveur MCP distant indépendamment :

```bash
# Test de connexion SSE
curl -N -H "Authorization: Bearer $TOKEN" https://mcp.example.com/sse

# Inspector MCP — GUI interactif pour tester les serveurs MCP
npx @modelcontextprotocol/inspector https://mcp.example.com/sse
```

L'Inspector vous permet de naviguer les outils, les invoquer avec des arguments personnalisés, et voir les messages de protocole bruts — essentiel pour déboguer un serveur que vous construisez.

---

## MCPs Multi-Tenant : Tokens par-utilisateur et Isolation

Quand vous hébergez un MCP pour une team, chaque utilisateur doit être isolé des données des autres. Deux motifs :

### Isolation par token-per-user (recommandée)

Chaque développeur génère son propre token du service upstream (par ex., son propre token d'auth Sentry). Le serveur MCP utilise ce token pour faire les appels d'API upstream en leur nom — l'accès est tout ce que les permissions propres de l'utilisateur permettent.

**Configuration :** chaque développeur ajoute le MCP à son `~/.claude/settings.json` au niveau utilisateur avec son propre token. Le `.claude/settings.json` au niveau projet définit l'URL du MCP sans token.

Settings au niveau projet (partagés, dans le repo) :
```json
{
  "mcpServers": {
    "internal-api": {
      "transport": "http",
      "url": "https://mcp.company.com/mcp"
    }
  }
}
```

Settings au niveau utilisateur (locaux, pas dans le repo) :
```json
{
  "mcpServers": {
    "internal-api": {
      "headers": {
        "Authorization": "Bearer ${MY_PERSONAL_API_TOKEN}"
      }
    }
  }
}
```

Claude Code fusionne ceux-ci — l'URL vient des settings au niveau projet, le header d'auth vient des settings au niveau utilisateur.

### Isolation de session au niveau serveur

Pour les MCPs qui gèrent l'état partagé, le serveur doit isoler les données par utilisateur authentifié. Le motif :

1. Le client envoie un token d'identification utilisateur (clé d'API ou JWT) dans le header `Authorization`
2. Le serveur valide le token et extrait une user ID ou tenant ID
3. Toutes les opérations d'outil sont limitées aux données de ce tenant
4. Le serveur enregistre tous les appels d'outil côté serveur : `(user_id, tool_name, timestamp, args_hash)` pour chaque appel

```typescript
// Pseudocode — isolation au niveau serveur
async function handleToolCall(request: Request, toolName: string, args: unknown) {
  const userId = await authenticateRequest(request)  // lance sur auth invalide
  const userDb = getDbForTenant(userId)              // connexion/schéma isolé
  return await tools[toolName](userDb, args)
}
```

Ne jamais laisser un client passer son propre tenant ID comme argument d'outil — dérivent-le côté serveur de l'auth token. Un client passant `tenant_id: "other-company"` devrait résulter en 403, pas exposition de données.

---

## Motif MCP Proxy

Un unique MCP distant qui agrège les outils upstream multiples. Utile pour :
- Réduire le nombre de connexions MCP que Claude Code gère
- Centraliser la gestion d'auth pour une team
- Ajouter une couche de logging/audit à travers tous les appels d'outil
- Limiter les tarifs ou mettre en cache les appels d'API upstream

**Architecture :**
```
Claude Code
    |
    v
[Serveur Proxy MCP]  <-- une connexion, un token d'auth de la perspective de Claude
    |        |        |
    v        v        v
 Sentry   GitHub    API interne
 (token)  (token)   (token)
```

Le proxy maintient les credentials upstream côté serveur. Claude Code a seulement besoin des credentials pour le proxy lui-même. Le proxy traduit les appels d'outil et les route vers le service upstream approprié.

**Quand construire un proxy :**
- La team a 8+ services MCP et le temps de startup est noticé comme lent
- Vous avez besoin d'ajouter des middlewares d'auth (rafraîchissement de token, rate limiting) que les fournisseurs ne fournissent pas
- Vous voulez un unique enregistrement d'audit pour toute l'activité MCP à travers votre team
- Certains services upstream n'ont pas de serveurs MCP officiels et vous enveloppez leurs APIs REST

**Quand ne pas construire un proxy :**
- Vous avez 2–4 services — la surcharge n'en vaut pas la peine
- Vous avez besoin de mises à jour live aux schémas d'outil — le proxy ajoute une couche de caching qui peut devenir stale
- Vous voulez l'isolation per-utilisateur — un proxy rend la gestion de token au niveau utilisateur plus difficile

---

## Performance : MCP de production à l'échelle

### Connection Pooling

Les serveurs MCP distants devraient maintenir les connexions persistantes plutôt que d'établir une nouvelle poignée de main TCP+TLS par appel d'outil. Pour le transport SSE, la connexion est nativement persistante. Pour streamable-HTTP, le pooling de connexion côté serveur aux services upstream est la responsabilité de l'implémentation du serveur.

Côté serveur :
```typescript
// Réutilisez les connexions de base de données à travers les requêtes
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Utilisez le pool à travers tous les handlers d'appel d'outil
```

### Keep-Alive pour SSE

Les connexions SSE peuvent être silencieusement abandonnées par les proxies intermédiaires qui ferment les connexions oisives. Envoyez un heartbeat périodique pour maintenir la connexion vivante :

```typescript
// Le serveur envoie un commentaire chaque 30 secondes pour prévenir le timeout du proxy
const keepAlive = setInterval(() => {
  res.write(': keepalive\n\n')
}, 30000)

req.on('close', () => clearInterval(keepAlive))
```

Claude Code gère la reconnexion automatiquement, mais un heartbeat prévient la surcharge de reconnexion inutile.

### Retry avec Exponential Backoff

Claude Code retente les appels d'outil MCP échoués, mais les retries côté serveur pour les dépendances upstream sont votre responsabilité. Implémentez le backoff pour n'importe quel appel réseau que le MCP fait :

```typescript
async function callWithRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 200
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      if (attempt === maxAttempts) throw err
      const delay = baseDelayMs * Math.pow(2, attempt - 1)
      await new Promise(r => setTimeout(r, delay))
    }
  }
  throw new Error('unreachable')
}
```

Appliquez le backoff à : appels d'API upstream, requêtes de base de données (pour les erreurs de connexion transitoires), et opérations de stockage d'objet.

### Response Caching

Les résultats d'outil qui sont coûteux à calculer et ne changent pas fréquemment devraient être mis en cache côté serveur. Ceci est particulièrement utile pour les outils d'introspection de schéma — un schéma de base de données ne change pas entre les appels d'outil.

```typescript
const cache = new Map<string, { value: unknown; expiresAt: number }>()

function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key)
  if (hit && hit.expiresAt > Date.now()) return Promise.resolve(hit.value as T)

  return fn().then(value => {
    cache.set(key, { value, expiresAt: Date.now() + ttlMs })
    return value
  })
}

// Usage: mettez le schéma en cache pendant 5 minutes
const schema = await cached('db-schema', 5 * 60 * 1000, () => db.introspectSchema())
```

---

## Snippets complets de settings.json

### 1 — Supabase + Sentry + Neon (distant seulement, niveau utilisateur)

```json
{
  "mcpServers": {
    "supabase": {
      "transport": "sse",
      "url": "https://mcp.supabase.com/sse",
      "headers": {
        "Authorization": "Bearer ${SUPABASE_ACCESS_TOKEN}"
      }
    },
    "sentry": {
      "transport": "sse",
      "url": "https://mcp.sentry.io/sse",
      "headers": {
        "Authorization": "Bearer ${SENTRY_AUTH_TOKEN}"
      }
    },
    "neon": {
      "transport": "sse",
      "url": "https://mcp.neon.tech/sse",
      "headers": {
        "Authorization": "Bearer ${NEON_API_KEY}"
      }
    }
  }
}
```

### 2 — MCP de team interne avec mTLS et headers personnalisés

```json
{
  "mcpServers": {
    "internal": {
      "transport": "http",
      "url": "https://mcp.corp.example.com/mcp",
      "headers": {
        "X-Api-Key": "${CORP_MCP_API_KEY}",
        "X-Team": "platform",
        "X-Environment": "production"
      },
      "timeout": 60000,
      "connectionTimeout": 15000
    }
  }
}
```

### 3 — GitHub + Cloudflare + Vercel (motif de clé API)

```json
{
  "mcpServers": {
    "github": {
      "transport": "http",
      "url": "https://api.githubcopilot.com/mcp/v1",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      }
    },
    "cloudflare": {
      "transport": "http",
      "url": "https://mcp.cloudflare.com/mcp",
      "headers": {
        "X-Auth-Key": "${CLOUDFLARE_API_KEY}",
        "X-Auth-Email": "${CLOUDFLARE_EMAIL}"
      }
    },
    "vercel": {
      "transport": "sse",
      "url": "https://mcp.vercel.com/sse",
      "headers": {
        "Authorization": "Bearer ${VERCEL_TOKEN}"
      }
    }
  }
}
```

### 4 — Mixte local + distant (niveau projet, tokens de l'environnement)

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "${CLAUDE_PROJECT_DIR}"]
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "${CLAUDE_PROJECT_DIR}"]
    },
    "sentry": {
      "transport": "sse",
      "url": "https://mcp.sentry.io/sse",
      "headers": {
        "Authorization": "Bearer ${SENTRY_AUTH_TOKEN}"
      }
    },
    "neon": {
      "transport": "sse",
      "url": "https://mcp.neon.tech/sse",
      "headers": {
        "Authorization": "Bearer ${NEON_API_KEY}"
      }
    }
  }
}
```

### 5 — Proxy MCP auto-hébergé avec découverte différée activée

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_MCP_DEFERRED_DISCOVERY": "1"
  },
  "mcpServers": {
    "proxy": {
      "transport": "http",
      "url": "https://mcp-proxy.your-company.com/mcp",
      "headers": {
        "Authorization": "Bearer ${MCP_PROXY_TOKEN}",
        "X-User-Email": "${USER_EMAIL}"
      },
      "timeout": 90000,
      "connectionTimeout": 20000
    }
  }
}
```

Le proxy agrège tous les outils upstream — Claude Code voit un serveur avec de nombreux outils. La découverte différée est particulièrement utile ici parce que le proxy peut exposer 50+ outils et vous n'en utilisez qu'une poignée par session.

---

## Travaillez avec nous
