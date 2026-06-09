---
description: Détecter les motifs de requête N+1 dans le code ORM et produire des corrections de chargement par lot
argument-hint: "[file path, directory, or route/controller name]"
---
Analysez les motifs de requête N+1 dans : $ARGUMENTS

Si $ARGUMENTS est un chemin de fichier, lisez-le. S'il s'agit d'un répertoire, analysez tous les fichiers source pertinents qu'il contient. S'il s'agit d'un contrôleur ou d'un nom de route, localisez les fichiers de code correspondants.

Approche de détection :

1. Identifiez l'ORM ou la bibliothèque de requête en utilisation (ActiveRecord, SQLAlchemy, Django ORM, TypeORM, Prisma, Sequelize, GORM, Hibernate, etc.).

2. Analysez les motifs N+1 :
   - Les boucles (for, forEach, map, each, .all.map, etc.) qui contiennent des appels ORM dans le corps de la boucle.
   - Les associations chargées tardivement accédées dans une boucle (par exemple, `post.comments` appelé par post dans une itération).
   - Les sérialiseurs ou modèles de vue qui déclenchent des chargements d'association par enregistrement.
   - Les appels `.find()` ou `.get()` dans les boucles qui pourraient être traités par lot.
   - Les directives de chargement enthousiaste manquantes (includes, eager_load, preload, joinedload, selectinload, with, include).

3. Pour chaque N+1 trouvé, affichez :
   - Le chemin du fichier et le ou les numéros de ligne du code incriminé.
   - La requête qui s'exécute N fois.
   - La correction : le code exact montrant comment regrouper/charger l'association avec enthousiasme.
   - La méthode spécifique à l'ORM à utiliser (par exemple, `includes(:comments)` pour ActiveRecord, `options(selectinload(Post.comments))` pour SQLAlchemy, `include: { comments: true }` pour Prisma).

4. Signalez également :
   - Les champs `select` manquants causant des chargements de ligne complète quand seul un sous-ensemble est nécessaire.
   - Les `.distinct` manquants sur les décomptes d'association qui causent des résultats gonflés.
   - Les requêtes identiques répétées dans le même cycle de demande qui devraient être mémorisées ou mises en cache.

5. Si la base de code a une journalisation des requêtes ou un motif d'assertion de décompte de requête (par exemple, `assert_queries`, bibliothèque `nplusone`), suggérez d'ajouter des gardes pour prévenir les régressions.

Affichez les découvertes sous forme de liste priorisée — ÉLEVÉE (dans un chemin chaud ou une boucle sur des collections non bornées), MOYENNE, BASSE — avec une correction de code exacte pour chacune.
