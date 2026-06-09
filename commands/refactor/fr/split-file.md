---
description: Diviser un fichier surdimensionné ou à préoccupations mixtes en modules ciblés
argument-hint: "[file]"
---
Diviser $ARGUMENTS en fichiers plus petits, à préoccupation unique.

1. Lire le fichier entier. Identifier les clusters logiques de symboles :
   - Grouper par domaine de préoccupation (p. ex., logique d'authentification, requêtes DB, gestionnaires HTTP, assistants utilitaires)
   - Grouper par type (p. ex., tous les types/interfaces ensemble, toutes les constantes ensemble) si c'est la convention du projet
   - Regarder les fichiers voisins existants dans le même répertoire pour correspondre au pattern de division établi

2. Proposer un plan de division avant de faire des modifications :
   - Énumérer chaque nouveau nom de fichier et quels symboles il contiendra
   - Identifier toutes les dépendances inter-fichiers que la division créera (imports qui n'existaient pas auparavant)
   - Indiquer quel fichier, le cas échéant, devient le barrel de réexportation (index.ts, __init__.py, mod.rs, etc.)

3. Exécuter la division :
   - Créer chaque nouveau fichier avec seulement les symboles qui lui sont assignés
   - Ajouter toutes les déclarations d'importation nécessaires — à la fois dans les nouveaux fichiers et à partir de tous les fichiers qui importaient précédemment l'original
   - Mettre à jour le fichier original pour réexporter à partir des nouveaux modules si la rétrocompatibilité est requise ; sinon supprimer l'original
   - Supprimer toutes les importations désormais redondantes au sein des nouveaux fichiers

4. Vérifier que chaque symbole qui était accessible de l'extérieur du fichier original est toujours accessible au même chemin d'importation, ou documenter explicitement le changement de chemin.

5. Ne pas renommer les symboles, changer la logique, ou reformater le code pendant la division.

6. Sortie : liste des nouveaux fichiers créés, symboles déplacés vers chacun, et tous les chemins d'importation que les appelants externes doivent mettre à jour.

Contraintes :
- Ne jamais diviser en plus de 5 fichiers en une seule passe — si le fichier le justifie, expliquer et arrêter après 5.
- Ne pas créer de fichiers plus petits que ~20 lignes significatives à moins que la limite de domaine soit exceptionnellement claire.
- Adapter les nouveaux noms de fichiers à la convention d'appellation existante du projet.
