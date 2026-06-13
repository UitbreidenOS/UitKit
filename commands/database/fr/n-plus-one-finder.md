---
description: Détecter les motifs de requête N+1 dans le code ORM et produire des corrections avec chargement par lot
argument-hint: "[chemin de fichier, répertoire, ou nom de route/contrôleur]"
---
Analyser les motifs de requête N+1 dans : $ARGUMENTS

Si $ARGUMENTS est un chemin de fichier, le lire. Si c'est un répertoire, analyser tous les fichiers source pertinents qu'il contient. Si c'est un nom de contrôleur ou de route, localiser les fichiers de code correspondants.

Approche de détection :

1. Identifier l'ORM ou la bibliothèque de requête en utilisation (ActiveRecord, SQLAlchemy, Django ORM, TypeORM, Prisma, Sequelize, GORM, Hibernate, etc.).

2. Analyser les motifs N+1 :
   - Boucles (for, forEach, map, each, .all.map, etc.) qui contiennent des appels ORM dans le corps de la boucle.
   - Associations chargées paresseusement accédées dans une boucle (par ex., `post.comments` appelé par post dans une itération).
   - Sérialiseurs ou modèles de vue qui déclenchent le chargement des associations par enregistrement.
   - Appels `.find()` ou `.get()` dans des boucles qui pourraient être mis en lot.
   - Directives de chargement enthousiaste manquantes (includes, eager_load, preload, joinedload, selectinload, with, include).

3. Pour chaque N+1 trouvé, sortir :
   - Chemin du fichier et numéro(s) de ligne du code problématique.
   - La requête qui s'exécute N fois.
   - La correction : code exact montrant comment mettre en lot/charger l'association avec impatience.
   - La méthode spécifique à l'ORM à utiliser (par ex., `includes(:comments)` pour ActiveRecord, `options(selectinload(Post.comments))` pour SQLAlchemy, `include: { comments: true }` pour Prisma).

4. Signaler également :
   - Champs `select` manquants causant le chargement de lignes complètes quand seul un sous-ensemble est nécessaire.
   - `.distinct` manquant sur les comptages d'association qui causent des résultats gonflés.
   - Requêtes identiques répétées au sein du même cycle de requête qui devraient être mémorisées ou mises en cache.

5. Si la base de code a une journalisation des requêtes ou un motif d'assertion de comptage de requête (par ex., `assert_queries`, bibliothèque `nplusone`), suggérer l'ajout de gardes pour prévenir les régressions.

Sortir les résultats comme une liste priorisée — ÉLEVÉ (dans un chemin critique ou boucle sur des collections illimitées), MOYEN, BAS — avec correction de code exacte pour chacun.
