# MCP : Shopify AI Toolkit

Gérez une boutique Shopify depuis Claude Code — interrogez les produits, les commandes, les clients, les analyses et les métafields sans ouvrir le tableau de bord.

## Pourquoi vous avez besoin de ceci

Les opérations de magasin qui nécessitent normalement l'interface utilisateur d'administration Shopify ou des scripts personnalisés — mises à jour de produits en masse, requêtes de commandes, tirages d'analyses, gestion de collections — deviennent des requêtes conversationnelles uniques. Claude peut lire les données réelles du magasin, agir sur celles-ci et enchaîner les opérations : trouvez les produits à faible inventaire → mettez à jour les descriptions → ajoutez à une collection de soldes, tout en une seule session.

## Installation

```bash
npx -y @shopify/ai-toolkit-mcp
```

Le package s'exécute à la demande via `npx` — aucune installation globale requise.

## Configuration

```json
{
  "mcpServers": {
    "shopify": {
      "command": "npx",
      "args": ["-y", "@shopify/ai-toolkit-mcp"],
      "env": {
        "SHOPIFY_STORE_URL": "your-store.myshopify.com",
        "SHOPIFY_ADMIN_TOKEN": "shpat_..."
      }
    }
  }
}
```

`SHOPIFY_STORE_URL` doit être votre sous-domaine `.myshopify.com` — pas un domaine personnalisé. `SHOPIFY_ADMIN_TOKEN` est votre token d'accès Admin API d'application personnalisée (voir Authentification).

## Outils clés

| Outil | Ce qu'il fait |
|---|---|
| `list_products` | Interroger les produits avec des filtres (statut, inventaire, tags, vendeur) |
| `get_product` | Détail complet du produit incluant les variantes, métafields et images |
| `create_product` | Créer un nouveau produit avec variantes et prix |
| `update_product` | Mettre à jour le titre, la description, le prix, les tags ou le statut |
| `list_orders` | Interroger les commandes avec des filtres (plage de dates, valeur, statut d'exécution) |
| `get_order` | Détail complet de la commande incluant les articles, le client et l'exécution |
| `list_customers` | Interroger les clients par historique d'achat, tags ou lieu |
| `get_customer` | Profil client incluant l'historique des commandes et la valeur à vie |
| `get_analytics` | Données de revenus, sessions et conversions par plage de dates et ventilation |
| `list_collections` | Lister toutes les collections intelligentes et personnalisées |
| `add_to_collection` | Ajouter un ou plusieurs produits à une collection |
| `list_metafields` | Lister les métafields sur un produit, une variante ou un client |
| `update_metafield` | Écrire une valeur métafield |

## Exemples d'utilisation

```
Listez tous les produits avec inventaire inférieur à 5 unités

Montrez-moi les commandes des 7 derniers jours dépassant 200 $

Mettre à jour la description pour SKU SHIRT-BLK-L

Ajouter tous les produits marqués « summer-sale » à la collection d'été

Quel était le revenu par type de produit le mois dernier ?

Trouvez les clients qui ont acheté le produit X mais pas le produit Y

Listez tous les codes de réduction actifs et leurs compteurs d'utilisation
```

## Authentification

1. Dans votre administration Shopify, allez sur **Paramètres → Applications → Développer les applications**
2. Cliquez sur **Créer une application** et donnez-lui un nom (par exemple, `claude-mcp`)
3. Sous **Configuration → Intégration Admin API**, activez ces portées d'accès :
   - `read_products`, `write_products`
   - `read_orders`
   - `read_customers`
   - `read_analytics`
4. Cliquez sur **Installer l'application** — Shopify génère le token d'accès Admin API
5. Copiez le token (affiché une fois) et utilisez-le en tant que `SHOPIFY_ADMIN_TOKEN`

Pour les analyses et les rapports en lecture seule, omettez `write_products` de la liste des portées.

## Conseils

- L'URL du magasin doit être le domaine `.myshopify.com` — les domaines personnalisés ne sont pas acceptés dans la variable d'environnement.
- Plan standard limite de débit : 2 requêtes/seconde. Shopify Plus : 4 requêtes/seconde. Les opérations en masse sont gérées automatiquement par la boîte à outils.
- Les métafields sont la fonctionnalité la moins utilisée via MCP — Claude peut lire et écrire des attributs personnalisés sur n'importe quelle ressource, permettant la gestion de données de style CMS sans CMS découplé.
- `get_analytics` retourne les données dans la même structure que l'API Shopify Analytics — spécifiez `date_preset` (`today`, `last_7_days`, `last_30_days`) ou une plage de dates explicite.
- Pour les grands catalogues de produits, filtrez `list_products` par `status=active` et `vendor` pour garder les ensembles de résultats gérables avant d'enchaîner les opérations.

---
