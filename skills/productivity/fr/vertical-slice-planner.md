# Vertical Slice Planner

## Quand l'activer

- Planifier une nouvelle fonctionnalité ou projet avant que la construction commence
- L'utilisateur veut décomposer une fonctionnalité en unités de travail avant d'écrire du code
- Claude par défaut à un plan séquentiel "base de données → API → frontend" et vous voulez des coupes intersourcils à la place
- Vous avez besoin de commander le travail par risque ou valeur plutôt que par couche technique
- La portée des fonctionnalités est peu claire et nécessite une décomposition en incréments livables indépendants

## Quand ne pas l'utiliser

- Des tâches simples d'un seul point de terminaison ou des corrections de bugs limitées à une couche
- Les tâches qui sont déjà une unité verticale unique (par exemple, "ajouter un nouveau champ à ce formulaire")
- Les tâches très petites en dessous d'une demi-journée de travail estimée — les fusionner, ne pas les diviser
- Quand l'équipe s'est déjà engagée dans un contrat de livraison en phases spécifiques et ne peut pas réorganiser le travail

## Instructions

**Le problème avec les phases séquentielles :**

Les modèles d'IA passent par défaut à : Phase 1 = schéma de base de données, Phase 2 = points de terminaison API, Phase 3 = frontend. Cela retarde les retours d'intégration de bout en bout jusqu'à la dernière phase, où les problèmes architecturaux apparaissent trop tard pour être corrigés à moindre coût. Vous ne voyez pas un chemin de travail à travers le système jusqu'à ce que la phase 3 soit terminée.

**Approche de coupe verticale :**

Chaque coupe est un coupe mince à travers toutes les couches — base de données + API + frontend + critères d'acceptation — qui fournit une capacité de bout en bout fonctionnelle et testable. Chaque coupe s'expédie indépendamment. Une coupe est terminée quand un utilisateur peut interagir avec elle, pas quand une couche est terminée.

---

**Étape 1 — Identifier les actions utilisateur principales (pas les composants techniques)**

Demandez : "Que peut réellement *faire* l'utilisateur ?" — pas "Quelles tables avons-nous besoin ?"

Mauvaise décomposition : `table utilisateurs → point de terminaison /users → composant UserList`
Bonne décomposition : `l'utilisateur peut chercher par nom → l'utilisateur peut filtrer par statut → l'utilisateur peut exporter les résultats`

Énumérez chaque action utilisateur distincte. Ceux-ci deviennent vos candidats de coupe.

---

**Étape 2 — Classez les coupes par valeur et risque**

Classez les coupes :
- Valeur commerciale la plus élevée d'abord — qu'est-ce qui déverrouille le plus de travail en aval ou de tests utilisateur ?
- Risque d'intégration le plus élevé d'abord — qu'y a-t-il de plus d'inconnues à travers les couches ?
- Balle de traçage d'abord en exécution — le chemin le plus mince possible qui valide l'architecture avant de construire du contenu

---

**Étape 3 — Définir chaque coupe**

Utilisez ce modèle pour chaque coupe :

```
Slice: [Nom]
User action: [Ce que l'utilisateur fait — écrit comme une action utilisateur, pas une tâche technique]
Layers:
  Database: [changement de schéma, migration ou requête impliquée]
  API:      [point(s) de terminaison — méthode, chemin, forme de requête/réponse]
  Frontend: [composant(s) affecté(s)]
  Integration: [appels de service externes, files d'attente ou émissions d'événements]
Acceptance criteria:
  - [Condition spécifique et testable — comportement observable, pas détail d'implémentation]
  - [Condition supplémentaire]
Definition of done: [Comment vérifier que cette coupe est complètement terminée et prête à fusionner]
Estimate: [jours]
```

---

**Étape 4 — Dimensionner chaque coupe**

Cible 1–3 jours de travail par coupe. Si une coupe prend plus de temps, divisez-la. Signaux une coupe est trop grande :
- Plus de deux points de terminaison API créés en une coupe
- Migration de schéma et logique métier dans la même coupe
- Frontend et un nouveau travail de fond dans la même coupe

Les coupes plus courtes qu'une demi-journée sont trop granulaires — fusionnez-les avec une coupe adjacente.

---

**Étape 5 — Commencez par une balle de traçage**

La première coupe à exécuter est le chemin le plus mince possible à travers toutes les couches — même s'il retourne des résultats vides ou des données stub. Cela valide :
- La base de données peut être interrogée à partir de l'API
- La réponse de l'API atteint le frontend
- Le frontend peut rendre la forme d'une vraie réponse

Si la balle de traçage se casse, vous avez trouvé votre problème le plus difficile le jour un — quand il est le moins cher à corriger.

Construisez du contenu (vraies requêtes, vrai UI, vraie validation) dans les coupes suivantes sur une fondation prouvée.

---

**Format de sortie :**

```
VERTICAL SLICE PLAN — [Nom de la fonctionnalité]

User actions identified: [liste]
Slice order rationale: [une phrase sur pourquoi cet ordre]

Slice 1 (Tracer): [nom] — [description d'une ligne]
Slice 2: [nom] — [description d'une ligne]
...

[Définition de coupe complète pour chaque coupe utilisant le modèle ci-dessus]
```

## Exemple

**Entrée:** "Planifiez la fonction de recherche pour notre catalogue de produits. Décomposez-la en coupes verticales ordonnées par risque."

**Sortie attendue:**

```
VERTICAL SLICE PLAN — Product Catalog Search

User actions identified: rechercher par mot-clé, filtrer par catégorie/prix, trier les résultats, paginer les résultats
Slice order rationale: balle de traçage d'abord pour valider l'infrastructure de recherche, recherche principale ensuite, filtres derniers (complexité d'implémentation plus élevée)

Slice 1 (Tracer): Le point de terminaison de recherche basique retourne les résultats vides
Slice 2: La recherche par mot-clé retourne les produits correspondants
Slice 3: Filtrer par catégorie et plage de prix
Slice 4: Pagination

---

Slice 1 (Tracer): Le point de terminaison de recherche basique retourne les résultats vides
User action: L'utilisateur soumet une requête de recherche et reçoit une réponse (vide est acceptable)
Layers:
  Database: Ajouter la table des produits avec colonnes nom, description, prix, catégorie ; ensemencer 10 enregistrements
  API:      GET /search?q= → retourne { results: [], total: 0 }
  Frontend: Zone de recherche + liste de résultats rend un message d'état vide
  Integration: aucun
Acceptance criteria:
  - L'envoi de toute requête retourne HTTP 200 avec la forme de réponse correcte
  - Le frontend rend sans erreurs quand la tableau des résultats est vide
Definition of done: La requête de bout en bout de la zone de recherche à la base de données et retour se termine sans erreurs
Estimate: 0.5 jours

Slice 2: La recherche par mot-clé retourne les produits correspondants
User action: L'utilisateur recherche par mot-clé et voit les produits correspondants
Layers:
  Database: Index de texte complet sur les colonnes nom et description
  API:      GET /search?q= → retourne { results: [{ id, name, price, category }], total: N }
  Frontend: La liste des résultats rend les cartes de produit avec nom et prix
  Integration: aucun
Acceptance criteria:
  - La recherche "laptop" retourne les produits avec "laptop" en nom ou description
  - Les résultats sont triés par pertinence (correspondance de nom classée au-dessus de correspondance de description)
  - Une requête vide retourne tous les produits jusqu'à la taille de page
Definition of done: La recherche retourne des résultats précis pour 10 requêtes de test ; les cartes de résultats rendent correctement
Estimate: 2 jours

Slice 3: Filtrer par catégorie et plage de prix
User action: L'utilisateur affine les résultats en utilisant la liste déroulante de catégorie et les entrées de plage de prix
Layers:
  Database: Requête mise à jour pour accepter les paramètres de catégorie et price_min/price_max
  API:      GET /search?q=&category=&price_min=&price_max=
  Frontend: Panneau de filtre avec liste déroulante de catégorie et entrées de plage de prix ; les résultats se mettent à jour lors de l'application
  Integration: aucun
Acceptance criteria:
  - L'application d'un filtre de catégorie retourne uniquement les produits de cette catégorie
  - Le filtre de plage de prix retourne uniquement les produits dans la plage
  - Les filtres se combinent correctement avec la recherche par mot-clé
Definition of done: Toutes les combinaisons de filtres sont testées ; l'état du filtre persiste au rafraîchissement de la page
Estimate: 1.5 jours

Slice 4: Pagination
User action: L'utilisateur navigue dans plusieurs pages de résultats
Layers:
  Database: LIMIT/OFFSET appliquée à la requête
  API:      GET /search?q=&page=&page_size= → ajoute { page, total_pages } à la réponse
  Frontend: Les contrôles de pagination rendent ; l'état de la page met à jour l'URL
  Integration: aucun
Acceptance criteria:
  - La page 2 retourne le décalage correct des résultats
  - Les pages totales reflètent le nombre réel de résultats
  - La navigation vers une URL paginée directement retourne la page correcte
Definition of done: La pagination fonctionne dans toutes les combinaisons de filtre et de recherche
Estimate: 1 jour
```

---
