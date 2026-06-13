# MCP : Meta Ads

Gérez les campagnes publicitaires Facebook et Instagram depuis Claude Code — créez des campagnes, optimisez les audiences, analysez les tests A/B et agissez sur les données de performance sans ouvrir Ads Manager.

## Pourquoi vous avez besoin de ceci

Ads Manager est construit pour la navigation humaine, pas pour l'analyse par programme. Extraire les données de performance, trouver les ensembles de publicités sous-performants et effectuer des modifications en masse nécessitent tous un travail répétitif de l'interface utilisateur. Le MCP Meta met votre arborescence de campagnes complet — campagnes, ensembles de publicités, publicités, audiences et insights — dans le contexte de Claude afin que vous puissiez analyser et agir en langage naturel.

## Installation

```bash
npx -y @meta/mcp-server-ads
```

S'exécute à la demande via `npx` — aucune installation globale requise.

## Configuration

```json
{
  "mcpServers": {
    "meta-ads": {
      "command": "npx",
      "args": ["-y", "@meta/mcp-server-ads"],
      "env": {
        "META_ACCESS_TOKEN": "your-system-user-token",
        "META_AD_ACCOUNT_ID": "act_XXXXXXXXX"
      }
    }
  }
}
```

`META_AD_ACCOUNT_ID` commence toujours par `act_`. Trouvez-le dans Meta Business Manager sous **Paramètres commerciaux → Comptes publicitaires**.

## Outils clés

| Outil | Ce qu'il fait |
|---|---|
| `list_campaigns` | Lister toutes les campagnes avec statut, objectif et dépense |
| `get_campaign` | Détail complet de la campagne incluant le budget, le planning et les performances |
| `create_campaign` | Créer une nouvelle campagne avec objectif et budget |
| `update_campaign` | Mettre à jour le budget, le statut, le planning ou la stratégie d'enchères |
| `list_ad_sets` | Lister les ensembles de publicités avec ciblage, placement et statut de livraison |
| `create_ad_set` | Créer un ensemble de publicités avec configuration d'audience et de placement |
| `list_ads` | Lister les publicités individuelles avec aperçus créatifs et mesures |
| `create_ad` | Créer une publicité avec créatif et copie |
| `get_insights` | Tirer les mesures de performance avec ventilations et plages de dates |
| `list_audiences` | Lister les audiences sauvegardées, personnalisées et similaires |
| `create_custom_audience` | Créer une audience personnalisée à partir d'une liste de clients ou d'événements de pixel |
| `create_lookalike_audience` | Générer un public similaire à partir d'une audience de base |
| `get_ab_test_results` | Récupérer les résultats statistiques du test A/B et la variante gagnante |

## Exemples d'utilisation

```
Afficher toutes les campagnes actives avec dépense vs budget ce mois-ci

Quel créatif publicitaire a eu le meilleur CTR cette semaine ?

Créer une audience similaire à partir de nos 5 % meilleurs acheteurs

Mettre en pause tous les ensembles de publicités avec CPA au-dessus de 40 $

Comparer les performances des deux variantes dans le test A/B #12345

Obtenir une ventilation des dépenses par groupe d'âge et placement pour la campagne de reciblage

Quelles campagnes ne suivent pas le rythme par rapport à leur budget quotidien ?
```

## Authentification

1. Dans Meta Business Manager, allez sur **Paramètres commerciaux → Utilisateurs système**
2. Créez un nouvel utilisateur système (ou utilisez un utilisateur système administrateur existant)
3. Cliquez sur **Générer un nouveau token** et sélectionnez le compte publicitaire que vous souhaitez gérer
4. Activez ces permissions : `ads_management`, `ads_read`, `business_management`
5. Copiez le token et définissez-le comme `META_ACCESS_TOKEN`
6. Trouvez votre AD Account ID sous **Paramètres commerciaux → Comptes publicitaires** — il commence par `act_`

Les tokens des utilisateurs système n'expirent pas selon un cycle de 60 jours comme les tokens des utilisateurs — utilisez-les pour un accès MCP persistant.

## Conseils

- Utilisez `get_insights` avec `breakdowns=["age","placement","device"]` pour une segmentation de performance granulaire en un seul appel.
- Les tokens d'utilisateur système ont des limites de débit plus élevées que les tokens d'utilisateur personnel et n'expirent pas — préférez toujours les accès API.
- Spécifiez toujours `date_preset` ou une plage `time_range` explicite sur les appels d'insights — la fenêtre de regardback par défaut n'est que de 7 jours et peut ne pas montrer les tendances.
- Meta Ads MCP a été lancé en avril 2026 dans le cadre du programme MCP officiel des développeurs de Meta.
- `create_lookalike_audience` nécessite une audience de base d'au moins 100 personnes. Les lookalikes prennent 1-2 heures à se remplir avant de pouvoir être utilisés dans les ensembles de publicités.
- Pour éviter de trop dépenser pendant les tests, définissez `status=PAUSED` lors de la création de campagnes via MCP — activez-les manuellement après avoir examiné la configuration.

---
