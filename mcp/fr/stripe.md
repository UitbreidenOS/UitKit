# MCP : Stripe

Interrogez les données Stripe, gérez les clients, les produits et les abonnements directement depuis Claude Code — sans basculer vers le tableau de bord Stripe ou écrire des scripts ponctuels.

## Pourquoi vous avez besoin de ceci

Stripe détient la couche de données critique pour l'activité : qui paie, pour quoi ils paient et si les paiements réussissent. Sans MCP, y accéder signifie basculer vers un tableau de bord ou écrire des scripts jetables. Avec Stripe MCP :
- Les requêtes de revenus, l'analyse de churn et les enquêtes sur les défaillances de paiement s'exécutent à l'intérieur de la session de codage
- Les modifications de produits et de prix se font sans quitter le terminal
- Claude peut corréler les modifications de code par rapport aux données réelles de facturation — attrapant les incohérences avant qu'elles n'atteignent la production
- Les tâches de support routine (rechercher des clients, vérifier l'état de l'abonnement) prennent des secondes au lieu de minutes

## Installation

```bash
npm install -g @stripe/mcp
```

## Configuration

Ajoutez à `~/.claude.json` ou au projet `.claude/mcp.json` :

```json
{
  "mcpServers": {
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp", "--tools=all"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_test_your-restricted-key-here"
      }
    }
  }
}
```

Utilisez une clé restreinte limitée aux seules ressources que votre flux de travail touche. Ne jamais utiliser `sk_live_` dans la configuration de développement.

## Outils clés / Ce qu'ils font

- `list_customers` — lister les clients avec des filtres optionnels (email, plage de dates créées, métadonnées)
- `get_customer` — récupérer un seul client avec profil complet et métadonnées
- `create_customer` — créer un nouveau client avec nom, email et métadonnées
- `list_products` — lister tous les produits avec leur statut actif/inactif
- `create_product` — créer un nouveau produit avec nom, description et métadonnées
- `list_prices` — lister les prix d'un produit ou sur tous les produits
- `create_price` — créer un nouveau prix (récurrent ou ponctuels) pour un produit
- `list_subscriptions` — lister les abonnements avec des filtres (client, statut, prix)
- `get_subscription` — récupérer un abonnement avec la période actuelle, le statut et les articles
- `create_payment_link` — générer un lien de paiement hébergé pour un produit/prix
- `list_invoices` — lister les factures avec des filtres (client, statut, plage de dates)
- `retrieve_balance` — obtenir le solde du compte Stripe actuel (disponible et en attente)
- `list_charges` — lister les frais avec des filtres (client, résultat, plage de dates)
- `list_payment_intents` — lister les intentions de paiement avec des filtres de statut (échoué, réussi, en cours)

## Exemples d'utilisation

```
Montrez-moi tous les clients qui se sont désabonnés au cours des 30 derniers jours —
abonnements passés au statut annulé. Incluez leur email, le nom du plan et le temps
qu'ils ont été abonnés.
```

```
Créer un nouveau produit appelé « Plan Pro » et ajouter un prix mensuel récurrent de 49 $
et un prix annuel de 490 $. Retournez les IDs de prix pour que je puisse mettre à jour
la configuration du frontend.
```

```
Listez toutes les intentions de paiement échouées des 24 dernières heures,
regroupez-les par motif d'échec et résumez les 3 causes principales.
```

```
Générer un résumé des revenus pour Q1 2026 — MRR total, nouveaux abonnements,
abonnements résiliés et changement net de revenus mois après mois.
```

```
Trouvez tous les clients actuellement sur le plan « Starter » et listez leurs
emails, dates de début d'abonnement et dépenses mensuelles. J'ai besoin de ceci
pour une campagne de migration de plan.
```

## Authentification

1. Allez sur **dashboard.stripe.com → Développeurs → Clés API**
2. Cliquez sur **Créer une clé restreinte** (pas la clé secrète complète)
3. Nommez-la (par exemple, `claude-code-readonly`) et accordez seulement les permissions que votre flux de travail a besoin :
   - Pour l'analyse en lecture seule : **Lire** sur Clients, Produits, Prix, Abonnements, Factures, Intentions de paiement, Frais, Solde
   - Pour la création de produits/prix : ajouter **Écrire** sur Produits et Prix
4. Copiez la clé (commence par `sk_test_` pour le mode test, `sk_live_` pour la production)
5. Définissez-la comme `STRIPE_SECRET_KEY` dans la configuration ci-dessus

Utilisez toujours les clés du mode test (`sk_test_`) dans la configuration locale et de développement. Utilisez uniquement les clés actives dans les déploiements en production avec des variables d'environnement injectées à l'exécution — jamais dans la configuration commités.

## Conseils

**Clés restreintes plutôt que clés secrètes complètes :** Une clé restreinte limite le rayon de dégât si la clé est exposée. Limitez-la aux permissions minimales que votre flux de travail utilise réellement et n'accordez jamais l'accès en écriture sauf si vous avez besoin de créer ou modifier des données.

**Mode test vs mode actif :** Les clés commençant par `sk_test_` opèrent par rapport à vos données de test. Les clés commençant par `sk_live_` touchent les vraies données de client et l'argent réel. Gardez-les strictement séparés — utilisez les clés de test dans toutes les configurations locales et CI.

**Pagination sur les points de terminaison de liste :** La plupart des points de terminaison de liste retournent un maximum de 100 éléments par appel. Pour les grands ensembles de données, utilisez le paramètre `limit` et `starting_after` avec l'ID du dernier élément pour paginer les résultats. Claude gérera automatiquement cela si vous demandez "tous" les résultats.

**La vérification du webhook est hors de portée :** MCP ne peut pas vérifier les signatures de webhook — utilisez l'interface CLI Stripe (`stripe listen`) ou le tableau de bord pour les tests webhook. MCP est pour interroger et gérer les données, pas pour gérer les événements entrants.

**Les champs de métadonnées sont interrogeables :** Si votre application écrit des métadonnées structurées aux clients ou abonnements (par exemple, `plan_tier`, `internal_user_id`), ces champs sont filtrables dans `list_customers` et `list_subscriptions` — utile pour les requêtes ciblées.

---
