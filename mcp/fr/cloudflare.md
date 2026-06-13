# MCP : Cloudflare

Gérez la pile Cloudflare complète — Workers, R2, D1, KV, DNS, Pages, AI et Zero Trust — depuis Claude Code via une famille de 16 modules MCP spécialisés.

## Pourquoi vous avez besoin de ceci

Le tableau de bord Cloudflare couvre des dizaines de domaines de produits sur plusieurs couches de navigation. L'écosystème Cloudflare MCP réduit cela à des appels d'outils directs : déployez un Worker, mettez à jour un enregistrement DNS, exécutez une requête SQL D1 ou invoquez un modèle Workers AI — tout depuis une seule session Claude Code. Chaque module est indépendant, vous n'activez donc que ce que votre projet utilise.

## Installation

```bash
npx -y @cloudflare/mcp-server-cloudflare <module>
```

Remplacez `<module>` par le nom du service spécifique (par exemple, `workers`, `dns`, `d1`). Chaque module s'exécute en tant qu'entrée de serveur MCP séparate.

## Configuration

Chaque module est enregistré en tant que serveur séparé pour que vous puissiez les activer et les désactiver individuellement :

```json
{
  "mcpServers": {
    "cloudflare-workers": {
      "command": "npx",
      "args": ["-y", "@cloudflare/mcp-server-cloudflare", "workers"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "your-token",
        "CLOUDFLARE_ACCOUNT_ID": "your-account-id"
      }
    },
    "cloudflare-dns": {
      "command": "npx",
      "args": ["-y", "@cloudflare/mcp-server-cloudflare", "dns"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "your-token",
        "CLOUDFLARE_ACCOUNT_ID": "your-account-id"
      }
    },
    "cloudflare-d1": {
      "command": "npx",
      "args": ["-y", "@cloudflare/mcp-server-cloudflare", "d1"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "your-token",
        "CLOUDFLARE_ACCOUNT_ID": "your-account-id"
      }
    }
  }
}
```

Ajoutez ou supprimez des modules de votre configuration indépendamment.

## Outils clés

### workers
Déployez, mettez à jour et supprimez des scripts Workers. Affichez les journaux et suivez la sortie en temps réel.

### r2
Créez et supprimez des buckets. Téléchargez, téléchargez et listez les objets du stockage R2.

### d1
Créez des bases de données D1. Exécutez des requêtes SQL. Exécutez des migrations de schéma.

### kv
Lisez, écrivez et supprimez des entrées dans les espaces de noms KV. Listez les clés avec les filtres de préfixe.

### pages
Listez et créez des déploiements Pages. Gérez les domaines personnalisés sur les projets Pages.

### dns
Ajoutez, mettez à jour et supprimez les enregistrements DNS (A, AAAA, CNAME, MX, TXT, SRV).

### ai
Exécutez les modèles Workers AI : génération de texte, génération d'images, reconnaissance vocale et incorporations.

### analytics
Interrogez les données d'événements Web Analytics. Accédez à la configuration des analyses Zaraz.

### zero-trust
Gérez les politiques d'accès Zero Trust, les tunnels et les règles de posture d'appareil.

## Exemples d'utilisation

```
Déployez mon script worker mis à jour vers la zone de production example.com

Ajoutez un enregistrement CNAME pour api.example.com pointant vers my-load-balancer.com

Interrogez les 100 dernières lignes de ma base de données d'analyse D1

Exécutez la génération de texte llama-3 Workers AI avec cette invite

Afficher les analyses Web des 7 derniers jours ventilées par pays

Téléchargez ce fichier JSON vers le bucket R2 my-app-assets

Écrivez une entrée KV : clé=feature_flags valeur={"dark_mode":true}

Listez toutes les politiques d'accès Zero Trust actives pour le sous-domaine administrateur
```

## Authentification

1. Allez sur [cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Cliquez sur **Créer un token** — utilisez **Créer un token personnalisé**
3. Définissez les permissions en fonction des modules que vous activez :
   - Module DNS : `Zone → DNS → Edit`
   - Module Workers : `Account → Workers Scripts → Edit`
   - Module R2 : `Account → R2 Storage → Edit`
   - Module D1 : `Account → D1 → Edit`
   - Module Zero Trust : `Account → Access: Organizations, Identity Providers, and Groups → Edit`
4. Trouvez votre Account ID dans la barre latérale du tableau de bord Cloudflare (côté droit de n'importe quelle page d'aperçu de zone)
5. Définissez à la fois `CLOUDFLARE_API_TOKEN` et `CLOUDFLARE_ACCOUNT_ID` dans le bloc env pour chaque module

Un seul token peut porter plusieurs ensembles de permissions — vous n'avez pas besoin d'un token par module.

## Conseils

- Enregistrez chaque module en tant que serveur MCP nommé séparé (`cloudflare-workers`, `cloudflare-dns`, etc.) pour pouvoir commenter les modules inutilisés sans toucher aux autres.
- Workers AI (module `ai`) donne accès aux modèles hébergés de Cloudflare — Llama 3, Mistral, Whisper, SDXL — sans clé API supplémentaire au-delà de votre compte Cloudflare.
- Le module Zero Trust nécessite la permission `Access: Organizations, Identity Providers, and Groups` sur votre token — c'est séparé des permissions de zone/compte standard.
- D1 `execute_sql` prend en charge la lecture et l'écriture — utilisez-le directement pour les requêtes ponctuelles ou connectez-le aux workflows de migration aux côtés du MCP Neon pour les projets multi-base de données.
- Les opérations `kv` sont finalement cohérentes sur la périphérie de Cloudflare — les lectures peuvent être en retard par rapport aux écritures jusqu'à 60 secondes dans les régions éloignées.
- Le module `dns` est le moyen le plus rapide de gérer les modifications DNS par programme — les modifications se propagent en quelques secondes sur les zones gérées par Cloudflare.

---
