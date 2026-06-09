---
description: Générer des scripts de données d'amorce réalistes pour les environnements de développement ou de test
argument-hint: "[table name(s), schema file, or description]"
---
Générer les données d'amorce pour : $ARGUMENTS

Si $ARGUMENTS est un nom de table ou une liste de noms, localisez les définitions de schéma dans la base de code. S'il s'agit d'un fichier de schéma, lisez-le. S'il s'agit d'une description, déduisez le schéma du contexte.

Règles pour la génération de données d'amorce :

1. Détectez le mécanisme d'amorçage utilisé dans ce projet :
   - Fichiers SQL INSERT, seeders de framework (Rails db/seeds.rb, Django fixtures, Prisma seed.ts, Laravel seeders, Knex seeds), ou bibliothèques factory (FactoryBot, factory-boy, Faker.js).
   - Correspondez exactement au format existant.

2. Générez des données qui sont :
   - Réalistes : utilisez des valeurs appropriées au domaine (noms réalistes, emails valides, dates plausibles, valeurs d'enum correctes).
   - Variées : au moins 10-20 lignes par table à moins que la table ne représente un petit ensemble de recherche.
   - Cohérentes entre les tables connexes : les clés étrangères font référence à des ID valides dans les tables parentes ; l'ordre d'amorçage respecte les contraintes FK.
   - Sûres : n'utilisez jamais les motifs PII réels — utilisez des données évidemment fausses (par exemple, `alice@example.com`, pas `alice@gmail.com`).

3. Couvrez les cas limites :
   - Au moins une ligne par valeur enum/statut distinct.
   - Valeurs nulles pour les colonnes nullables où l'application doit les gérer.
   - Valeurs limites (montants zéro, chaînes de longueur maximale, dates lointaines/passées) le cas échéant pour les tests.

4. Si le schéma a des colonnes de soft-delete, incluez les enregistrements actifs et supprimés.

5. Produisez le(s) fichier(s) de données d'amorce avec les noms de fichier et les chemins corrects suivant les conventions du projet.

6. Après les données d'amorce, énumérez les amorces préalables qui doivent s'exécuter en premier (ordre de dépendance) et toutes les étapes de configuration manuelle (par exemple, créer un superutilisateur avant d'amorcer les rôles utilisateur).

Ne produisez pas plus de 50 lignes par table à moins que cela ne soit explicitement demandé.
