---
description: Générer un document d'architecture structuré pour une base de code ou un module
argument-hint: "[chemin ou nom du module]"
---
Produisez un document d'architecture complet pour : $ARGUMENTS

Étapes :
1. Explorez la cible — lisez les points d'entrée, les fichiers de configuration et la structure des répertoires. Ne sautez pas les répertoires cachés comme `.claude/` ou `infra/`.
2. Identifiez et nommez les composants de haut niveau : services, couches, magasins, files d'attente, intégrations externes.
3. Pour chaque composant, indiquez :
   - Responsabilité (une phrase)
   - Technologie / langage / framework
   - Dépendances entrantes et sortantes
   - Données qu'il possède ou fait circuler
4. Tracez le flux de données à l'exécution sous forme de diagramme ASCII. Étiquetez la direction des appels avec des flèches. Incluez les limites asynchrones.
5. Identifiez les préoccupations transversales : authentification, journalisation, gestion des erreurs, drapeaux de fonctionnalités, mise en cache.
6. Énumérez les contraintes connues ou les décisions non évidentes (par exemple, « utilise l'interrogation plutôt que les webhooks car l'API du fournisseur est en lecture seule »).
7. Identifiez les lacunes : parties non documentées, tests manquants, propriété peu claire.

Format de sortie :
- En-têtes H2 pour chaque section
- Tables pour les listes de composants (Composant | Responsabilité | Tech | Dépend de)
- Diagramme ASCII en ligne sous « Flux de données »
- Listes à puces pour les préoccupations transversales et les lacunes
- Pas d'introduction inutile — commencez par le tableau des composants

Règles de précision :
- Fondez chaque affirmation sur des fichiers réels. Si vous ne pouvez pas vérifier une affirmation, marquez-la `[non vérifiée]`.
- N'inventez pas d'intégrations ou de couches qui n'existent pas dans le code.
- Si $ARGUMENTS est vide, documentez l'ensemble du répertoire racine.
