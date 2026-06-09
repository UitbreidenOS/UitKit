---
description: Amorcer un cycle TDD — écrire d'abord les tests qui échouent, puis implémenter
argument-hint: "[function, class, or feature to build]"
---
Démarrer un cycle TDD pour : $ARGUMENTS

Étapes :

1. Clarifier la cible à partir de l'argument :
   - Si une signature de fonction ou une description : dériver les contrats d'entrée/sortie
   - Si un nom de classe ou de module : déduire les responsabilités à partir du nom et de tout contexte de code existant
   - Si une description de fonctionnalité : identifier la plus petite unité de comportement par laquelle commencer

2. Vérifier tout code d'implémentation ou partiel existant. S'il y en a, le lire mais ne pas le modifier pour l'instant.

3. Écrire d'abord les tests qui échouent — aucun code d'implémentation pour l'instant.

   Pour chaque test :
   - Le nommer au format : `[unité] [scénario] [résultat attendu]`
   - Couvrir dans cet ordre : chemin heureux → cas limites → chemins d'erreur
   - Écrire le nombre minimum de tests qui spécifie complètement le contrat (éviter la redondance)
   - Utiliser le cadre de test existant du projet et le style d'assertion

   Cas de test minimaux à écrire avant d'arrêter :
   - Au moins 1 test de chemin heureux
   - Au moins 1 test de limite ou de cas limite
   - Au moins 1 test d'erreur/d'entrée invalide (si la cible peut échouer)

4. Exécuter les tests. Confirmer qu'ils échouent pour la bonne raison (pas une erreur de syntaxe ou d'importation — un véritable échec d'assertion contre une logique manquante).

5. Écrire l'implémentation minimale qui rend les tests réussis :
   - Aucune logique au-delà de ce que les tests nécessitent
   - Aucun traitement spéculatif de cas non encore testés
   - Suivre le style de code existant du projet

6. Exécuter les tests à nouveau. Si tous réussissent, signaler le succès.

7. Si un test échoue toujours après l'implémentation, afficher la sortie d'échec et diagnostiquer l'écart avant de tenter une correction.

8. Terminer par :
   - Fichiers créés ou modifiés
   - Nombre de tests et statut réussi/échoué
   - Prochain test suggéré à écrire (une étape plus loin dans le cycle TDD)
