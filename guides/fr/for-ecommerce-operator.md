# Claude pour les Opérateurs E-commerce

Tout ce dont un opérateur e-commerce a besoin pour piloter avec l'IA les fiches produit, le service client, les campagnes marketing et le reporting opérationnel — que vous soyez sur Shopify, Amazon, Etsy ou les trois.

---

## À qui s'adresse ce guide

Vous êtes un opérateur e-commerce, propriétaire de boutique en ligne ou vendeur sur les marketplaces dont le travail couvre le produit, le marketing, le service client et les opérations. Vous rédigez des fiches, gérez des campagnes email, gérez les avis, traitez les retours et surveillez les dépenses publicitaires — souvent tout ça dans la même journée.

**Avant Claude Code :** Nouvelle fiche produit : 45 minutes. Réponse à une réclamation client : 15 minutes (et vous vous remettez en question). Campagne email : 2 heures. Reporting mensuel : une demi-journée.

**Après :** Fiche produit optimisée en 15 minutes. Réclamation client traitée en 3 minutes. Campagne email briefée et rédigée en 30 minutes. Rapport mensuel extrait et formaté en 20 minutes.

---

## Installation en 30 secondes

```bash
# Installer la stack e-commerce complète
npx claudient add skills small-business/shopify-operations
npx claudient add skills small-business/ecommerce-seller
npx claudient add skills small-business/email-campaign
npx claudient add skills small-business/review-response
npx claudient add skills marketing/paid-ads
npx claudient add skills small-business/product-listing-optimizer
npx claudient add skills small-business/returns-handler
npx claudient add agents specialists/ecommerce-specialist
```

---

## Votre stack e-commerce avec Claude Code

### Compétences (commandes slash)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/product-listing-optimizer` | Optimiser les fiches pour le SEO et la conversion : titre, puces, description, contenu A+, brief photo | Nouvelles fiches, SKU à faible conversion, actualisations saisonnières |
| `/ecommerce-seller` | Opérations vendeur complètes : stratégie tarifaire, décisions de stock, tactiques marketplace | Décisions vendeur au quotidien |
| `/shopify-operations` | Spécifique Shopify : configuration boutique, décisions de thème, recommandations d'apps, optimisation du checkout | Gestion de boutique Shopify |
| `/email-campaign` | Planification des campagnes, copy, stratégie d'envoi pour l'email marketing | Campagnes promotionnelles et newsletters |
| `/review-response` | Répondre aux avis clients : positifs, négatifs, neutres — tous les canaux | Triage quotidien des avis |
| `/returns-handler` | Politique de retours, modèles de réponse, résolution de litiges, analyse des tendances | Gestion des retours et remboursements |
| `/paid-ads` | Copy publicitaire, structure de campagne, ciblage d'audience, analyse de performance | Publicité sociale et search payant |

### Agents

| Agent | Modèle | Quand le solliciter |
|---|---|---|
| `ecommerce-specialist` | Sonnet | Décisions complexes : stratégie marketplace, planification saisonnière, expansion de catégorie |

---

## Flux de travail quotidien

### Tableau de bord des ventes matinal (15 minutes)

Commencez chaque journée avec une image claire des performances :

```
/ecommerce-seller

Bilan matinal du [DATE] :

Métriques d'hier :
- Chiffre d'affaires : [$X]
- Commandes : [X]
- Valeur moyenne des commandes : [$X]
- Unités vendues par SKU principal : [liste]
- Demandes de retour : [X]
- Nouveaux avis : [positifs : X / négatifs : X]
- Dépenses publicitaires : [$X] / ROAS : [X]
- Taux d'abandon de panier : [X%]

Signalez :
- Tout SKU avec un stock < 14 jours de stock au rythme actuel
- Toute campagne publicitaire avec un ROAS en dessous du seuil [$X cible]
- Tout avis négatif nécessitant une réponse le jour même
- Toute commande présentant un risque de retard d'expédition
```

---

### Demandes clients et gestion des avis (20-30 minutes)

**Réponse à un avis négatif :**

```
/review-response

Plateforme : [Amazon / Google / Trustpilot / Etsy]
Avis : [collez le texte de l'avis]
Note : [1-3 étoiles]
Produit : [nom]
Détails de commande disponibles (si applicable) : [collez]

Rédigez une réponse professionnelle qui :
- Reconnaît la réclamation spécifique (pas une excuse générique)
- Indique ce que nous faisons pour y remédier (ou ce qui a déjà été fait)
- Propose une voie de résolution (remplacement, remboursement, contact direct)
- Évite toute défensive
- Moins de 100 mots
```

**Demande de retour :**

```
/returns-handler

Scénario : [décrivez la demande — ex. le client veut retourner des bottes en affirmant que la semelle se décolle après 3 semaines]
Détails de commande : [date, produit, montant]
Dans la fenêtre de politique : [oui / non — et quelle politique s'applique]

Rédigez : réponse client + note interne pour l'enregistrement.
```

---

### Optimisation des fiches (30-60 minutes)

**Nouvelle fiche produit :**

```
/product-listing-optimizer

Marketplace : [Amazon / Shopify / Etsy / eBay]
Produit : [nom et description]
Catégorie : [catégorie + sous-catégorie]
Prix : [$X]
Client cible : [qui achète ça, quel problème ça résout]
Caractéristiques clés : [liste]
Principal concurrent : [nom ou URL]

Produisez : recherche de mots-clés, titre optimisé, 5 puces, description, brief photo.
```

**Audit de fiche (SKU à faible conversion) :**

```
/product-listing-optimizer

Mode audit.

Fiche actuelle : [collez titre + puces + description]
Taux de conversion actuel : [X%] (moyenne de la catégorie : [Y%])
Classement actuel pour le mot-clé principal : [position ou inconnu]

Diagnostiquez : qu'est-ce qui nuit à la conversion ? Scorez chaque élément. Donnez-moi les 2 corrections les plus impactantes.
```

---

### Revue des performances publicitaires (20 minutes)

```
/paid-ads

Plateforme : [Meta Ads / Google Ads / Amazon PPC]

Performance des 7 derniers jours :
- Dépenses totales : [$X]
- Revenu attribué : [$X]
- ROAS : [X]
- CTR : [X%]
- Taux de conversion : [X%]
- Top 3 des campagnes : [nom, dépenses, ROAS chacune]
- Bas 3 des campagnes : [nom, dépenses, ROAS chacune]

Analyse :
- Quelles campagnes sont en dessous du ROAS cible ? Recommandez : pause / réduction des enchères / renouvellement créatif
- Quelles audiences sur-indexent ? Recommandez : scale
- Y a-t-il des changements d'allocation de budget à effectuer aujourd'hui ?
```

---

### Vérification des stocks (10 minutes, quotidienne)

```
/ecommerce-seller

État des stocks :

[Collez votre CSV de stock ou listez les SKU clés avec : unités disponibles, vélocité de vente quotidienne moyenne]

Signalez :
- Risque de rupture de stock dans < 14 jours au rythme actuel
- Articles sur-stockés (> 90 jours de stock) — recommandez remise ou bundle
- Recommandations de réapprovisionnement : quantité et timing basés sur le délai de livraison de [X jours]

Résultat : liste d'actions priorisées — quoi commander aujourd'hui, quoi remettre en promotion, quoi surveiller.
```

---

## Rythme hebdomadaire

### Lundi — Planification des campagnes et du contenu

```
/email-campaign

Planifiez l'email de cette semaine :
- Segment d'audience : [nom du segment, taille]
- Objectif : [générer du revenu / réengager / annoncer un produit]
- Angle d'offre ou de contenu : [ex. lancement de nouveau produit / solde 20% / mise en avant saisonnière]
- Performance de la campagne précédente : [dernier taux d'ouverture, CTR]

Produisez : brief de campagne, ligne d'objet (variantes A/B), brouillon d'email, recommandation d'heure d'envoi.
```

### Mercredi — Vérification des fiches et du SEO

Exécutez `/product-listing-optimizer` sur vos 3 SKU les moins performants (par taux de conversion).
Une fiche optimisée par semaine = amélioration composée significative en 90 jours.

### Vendredi — Rapport de performance hebdomadaire

```
/ecommerce-seller

Rapport hebdomadaire pour [semaine] :

Chiffre d'affaires : [$X] vs. [$X semaine précédente] vs. [$X cible]
Commandes : [X] / VMC : [$X]
Top 3 des produits par chiffre d'affaires : [liste]
Dépenses marketing : [$X] / Revenu attribué : [$X] / ROAS mixte : [X]
Service client : [X tickets] / [X retours] / Temps de résolution moyen : [X heures]
Stocks : [ruptures ou sur-stocks ?]

Format : résumé exécutif (3 points) + analyse détaillée pour les archives.
Sur quoi dois-je me concentrer la semaine prochaine ?
```

---

## Planification saisonnière

Utilisez l'agent `ecommerce-specialist` 60 à 90 jours avant les événements majeurs :

```
@ecommerce-specialist

Planifiez notre campagne [Q4 / Prime Day / Black Friday / Saint-Valentin].

Produits à mettre en avant : [liste]
Budget : [$X total pour le marketing]
Calendrier : [date de début à date de l'événement]
Position des stocks : [stock actuel + délai de réapprovisionnement]
Résultats de l'année dernière pour cet événement (si applicable) : [métriques]

Produisez :
- Checklist de préparation à 90-60-30 jours
- Stratégie tarifaire et de remises
- Calendrier des campagnes (email + publicité payante)
- Quantités et calendrier de commande des stocks
- Plan de mise à jour des fiches des produits mis en avant
```

---

## Plan de montée en compétence sur 30 jours

### Semaine 1 — Auditer votre référentiel

- Installez toutes les compétences e-commerce
- Exécutez `/product-listing-optimizer` en mode audit sur vos 10 SKU générant le plus de revenu
- Vérifiez votre politique de retours actuelle avec `/returns-handler` — vous protège-t-elle légalement et fidélise-t-elle les clients ?
- Extrayez les données de performance publicitaires sur 30 jours et effectuez une analyse des lacunes avec `/paid-ads`
- Configurez votre modèle de tableau de bord quotidien dans `/ecommerce-seller`

### Semaine 2 — Refonte des fiches et des avis

- Réécrivez vos 3 fiches les moins performantes avec `/product-listing-optimizer`
- Répondez à chaque avis sans réponse des 90 derniers jours avec `/review-response`
- Configurez un workflow de monitoring des avis : triage quotidien des avis dans la routine matinale

### Semaine 3 — Marketing et service client

- Planifiez et lancez votre première campagne email rédigée par IA avec `/email-campaign`
- Réécrivez votre politique de retours et vos modèles de réponse avec `/returns-handler`
- Effectuez un renouvellement créatif avec `/paid-ads` sur vos campagnes à dépenses les plus élevées

### Semaine 4 — Systématiser

- Construisez votre modèle de reporting hebdomadaire avec `/ecommerce-seller`
- Formez tout membre d'équipe ou assistant virtuel à l'utilisation des compétences pour le triage quotidien
- Identifiez votre prochain événement saisonnier et commencez la planification à 60 jours
- Revoyez la performance mois sur mois : quelles métriques se sont le plus améliorées ?

---

## Intégrations d'outils

### Shopify (gestion de boutique)

```json
{
  "mcpServers": {
    "shopify": {
      "command": "npx",
      "args": ["-y", "@shopify/mcp-server"],
      "env": {
        "SHOPIFY_ACCESS_TOKEN": "your-token",
        "SHOPIFY_STORE_DOMAIN": "yourstore.myshopify.com"
      }
    }
  }
}
```

Avec Shopify connecté : Claude peut lire directement les commandes, les données produit et les stocks.

### Klaviyo (email marketing)

```json
{
  "mcpServers": {
    "klaviyo": {
      "command": "npx",
      "args": ["-y", "@klaviyo/mcp-server"],
      "env": {
        "KLAVIYO_API_KEY": "your-private-api-key"
      }
    }
  }
}
```

Utilisation : analyse des segments, données de performance des campagnes, optimisation des flux.

### Google Analytics / GA4

Exportez vos données de performance produit et de trafic en CSV → collez dans `/ecommerce-seller` pour l'analyse.

### n8n (automatisation)

```
Automatisez la boucle de réponse aux avis :
Nouvel avis → classification du sentiment → réponse rédigée → alerte Slack pour approbation humaine → publication

Automatisez les alertes de stock :
Vérification quotidienne des stocks → si stock < 14 jours → créer une tâche de réapprovisionnement dans votre outil de gestion de projet
```

---

## Métriques à suivre

| Métrique | Cible | Signal d'alarme |
|---|---|---|
| Taux de conversion (page produit) | > 3% (moyenne Shopify) / > 15% (Amazon) | < 1,5% |
| Taux de retour | < 10% (général) / < 20% (habillement) | > 25% |
| ROAS (publicité payante) | > 3x (minimum) / > 5x (sain) | < 2x |
| Taux d'ouverture email | > 25% | < 15% |
| Taux de réponse aux avis | 100% des avis négatifs | Tout avis négatif sans réponse |
| Temps de réponse aux demandes clients | < 4 heures | > 24 heures |
| Taux de rupture de stock | < 2% des SKU à tout moment | > 5% |
| VMC (valeur moyenne des commandes) | En croissance mois sur mois | En baisse 2+ mois consécutifs |

---

## Erreurs courantes et comment Claude Code aide à les éviter

**Erreur 1 : Des fiches produit génériques qui ne se classent pas**
`/product-listing-optimizer` impose la recherche de mots-clés avant la rédaction. Pas de mots-clés = pas de classement = pas de trafic.

**Erreur 2 : Ignorer les avis négatifs**
`/review-response` fait de la réponse une tâche de 3 minutes. Chaque avis négatif sans réponse coûte des conversions futures.

**Erreur 3 : Utiliser le même créatif indéfiniment**
`/paid-ads` signale la fatigue créative avant que vous ne la remarquiez dans le ROAS. Les signaux de renouvellement viennent des tendances de CTR, pas seulement du ROAS.

**Erreur 4 : La politique de retours traitée comme une réflexion après coup**
`/returns-handler` construit des politiques qui fidélisent les clients et vous protègent contre la fraude. "Contactez-nous pour retourner" est une politique — c'est juste la pire.

**Erreur 5 : Acheter des stocks sur la base du ressenti**
`/ecommerce-seller` transforme vos données de vélocité en une recommandation de réapprovisionnement. Les ruptures de stock et les sur-stocks sont tous les deux coûteux.

---

## Ressources

- [Démarrer avec Claude Code](./getting-started.md)
- [Compétence Shopify Operations](../skills/small-business/shopify-operations.md)
- [Compétence Product Listing Optimizer](../skills/small-business/product-listing-optimizer.md)
- [Compétence Returns Handler](../skills/small-business/returns-handler.md)
- [Workflow hebdomadaire e-commerce](../workflows/ecommerce-weekly.md)

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous créons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
