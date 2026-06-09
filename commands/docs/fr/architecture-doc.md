---
description: Générer un document d'architecture structuré pour une base de code ou un module
argument-hint: "[path or module name]"
---
Produire un document d'architecture complet pour : $ARGUMENTS

Étapes :
1. Explorer la cible — lire les points d'entrée, les fichiers de configuration et la structure des répertoires. Ne pas ignorer les répertoires cachés comme `.claude/` ou `infra/`.
2. Identifier et nommer les composants de haut niveau : services, couches, magasins, files d'attente, intégrations externes.
3. Pour chaque composant, indiquer :
   - Responsabilité (une phrase)
   - Technologie / langage / framework
   - Dépendances entrantes et sortantes
   - Données qu'il possède ou qui le traversent
4. Dessiner le flux de données à l'exécution sous forme de diagramme ASCII. Étiqueter la direction d'appel avec des flèches. Inclure les limites asynchrones.
5. Identifier les problèmes transversaux : authentification, enregistrement, gestion des erreurs, indicateurs de fonctionnalité, mise en cache.
6. Lister les contraintes connues ou les décisions non évidentes (par exemple, « utilise le sondage au lieu de webhooks car l'API du fournisseur est en lecture seule »).
7. Identifier les lacunes : parties non documentées, tests manquants, propriété floue.

Format de sortie :
- En-têtes H2 pour chaque section
- Tableaux pour les listes de composants (Composant | Responsabilité | Tech | Dépend de)
- Diagramme ASCII en ligne sous « Data Flow »
- Listes à puces pour les préoccupations transversales et les lacunes
- Pas d'introduction vide — commencer avec le tableau des composants

Règles de précision :
- Fonder chaque affirmation sur des fichiers réels. Si vous ne pouvez pas vérifier une affirmation, la marquer `[unverified]`.
- Ne pas inventer d'intégrations ou de couches qui n'existent pas dans le code.
- Si $ARGUMENTS est vide, documenter la racine du référentiel entier.
