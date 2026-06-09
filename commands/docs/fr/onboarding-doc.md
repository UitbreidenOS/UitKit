---
description: Générer un document d'intégration pour les développeurs de cette base de code
argument-hint: "[output-file]"
---
Vous écrivez un document d'intégration pour les développeurs de cette base de code. L'objectif est de rendre un nouvel ingénieur productif aussi rapidement que possible — pas de remplissage, pas de ton corporatif.

Fichier de sortie cible (s'il est spécifié) : $ARGUMENTS

Étapes à compléter :

1. Analysez la racine du référentiel pour : README, package.json, pyproject.toml, Makefile, Dockerfile, docker-compose.yml, .env.example, et tous les fichiers de configuration CI (.github/, .gitlab-ci.yml, etc.).

2. Identifiez :
   - Ce que fait le projet (un paragraphe, pas de langage marketing)
   - Langue(s) primaire(s) et versions d'exécution
   - Comment installer les dépendances
   - Comment exécuter le projet localement (mode développement)
   - Comment exécuter les tests
   - Comment exécuter le linting / vérifications de type
   - Les variables d'environnement requises (à partir de .env.example ou de la documentation)
   - Les services externes requis (bases de données, files d'attente, API)

3. Recherchez les étapes de configuration non évidentes : migrations, scripts de semis, installations de certificats, tunnels locaux, maquettes de services. Incluez-les explicitement.

4. Vérifiez s'il existe un CONTRIBUTING.md ou similaire. S'il est trouvé, extrayez la stratégie de branchement, le processus de PR et les attentes d'examen du code et résumez-les.

5. Identifiez les points d'entrée principaux : fichiers principaux, modules clés, répertoires importants. Fournissez une brève carte (3–8 éléments) afin que le lecteur sache où chercher en premier.

6. Notez tout comportement attendu ou inattendu, ou les choses qui surprennent les nouveaux développeurs (outils cassés, tests instables, conventions inhabituelles, étapes manuelles requises).

Écrivez le document en Markdown avec les sections suivantes — incluez uniquement les sections pour lesquelles vous avez du vrai contenu :

## Vue d'ensemble
## Conditions préalables
## Installation
## Exécution locale
## Exécution des tests
## Variables d'environnement
## Dépendances externes
## Carte de la base de code
## Contribution
## Problèmes connus / Pièges

Règles :
- Écrivez pour un développeur senior qui n'a jamais vu ce projet
- Chaque commande doit être copiable et correcte
- N'inventez pas d'informations — si quelque chose est peu clair, dites-le explicitement avec un marqueur TODO
- Pas de langage motivant, pas de cadrage de « chemin heureux » — juste les faits et les commandes
- Gardez chaque section compacte ; des points à puces plutôt que de la prose le cas échéant

Si $ARGUMENTS est un chemin de fichier, écrivez la sortie dans ce fichier. Sinon, imprimez le document dans la conversation.
