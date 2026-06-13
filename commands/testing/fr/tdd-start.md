---
description: Amorcer un cycle TDD — écrire les tests qui échouent en premier, puis implémenter
argument-hint: "[fonction, classe ou fonctionnalité à construire]"
---
Démarrer un cycle TDD pour : $ARGUMENTS

Étapes :

1. Clarifier la cible à partir de l'argument :
   - Si une signature de fonction ou une description : dériver les contrats d'entrée/sortie
   - Si un nom de classe ou de module : déduire les responsabilités à partir du nom et du contexte de code existant
   - Si une description de fonctionnalité : identifier la plus petite unité de comportement à commencer

2. Vérifier s'il existe une implémentation existante ou un code partiel. Si trouvé, le lire mais ne pas le modifier pour le moment.

3. Écrire d'abord les tests qui échouent — aucun code d'implémentation pour le moment.

   Pour chaque test :
   - Le nommer au format : `[unité] [scénario] [résultat attendu]`
   - Couvrir dans cet ordre : chemin heureux → cas limites → chemins d'erreur
   - Écrire le nombre minimum de tests qui spécifient complètement le contrat (éviter les redondances)
   - Utiliser le framework de test existant du projet et le style d'assertion

   Cas de test minimum à écrire avant de s'arrêter :
   - Au moins 1 test du chemin heureux
   - Au moins 1 test de cas limite ou particulier
   - Au moins 1 test d'erreur/entrée invalide (si la cible peut échouer)

4. Exécuter les tests. Confirmer qu'ils échouent pour la bonne raison (pas une erreur de syntaxe ou d'import — un véritable échec d'assertion contre la logique manquante).

5. Écrire l'implémentation minimale qui fait passer les tests :
   - Aucune logique au-delà de ce que les tests exigent
   - Aucune gestion spéculative de cas non encore testés
   - Suivre le style de code existant du projet

6. Exécuter les tests à nouveau. Si tous passent, signaler le succès.

7. Si un test échoue toujours après l'implémentation, afficher la sortie d'échec et diagnostiquer l'écart avant de tenter une correction.

8. Terminer par :
   - Fichiers créés ou modifiés
   - Nombre de tests et statut réussi/échoué
   - Prochain test suggéré à écrire (une étape plus loin dans le cycle TDD)
