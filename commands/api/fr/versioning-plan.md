---
description: Auditez l'API et produisez une stratégie de versioning avec les chemins de migration pour les changements cassants
argument-hint: "[current-version] [target-version]"
---
Produisez un plan de versioning d'API pour : $ARGUMENTS

Analysez comme suit : version actuelle (par ex. v1) et version cible (par ex. v2). Si omis, analysez l'API existante et recommandez si le versioning est nécessaire du tout.

Phase d'analyse — lisez la base de code et identifiez :
1. Tous les points de terminaison publics (chemin, méthode, forme de la requête, forme de la réponse)
2. Quels changements sont cassants vs. non-cassants :
   - Cassants : suppression d'un champ, changement du type d'un champ, renommage d'un champ, changement de la sémantique du code de statut, suppression d'un point de terminaison, changement des exigences d'authentification
   - Non-cassants : ajout d'un champ optionnel, ajout d'un nouveau point de terminaison, ajout d'une nouvelle valeur enum (avec prudence), assouplissement de la validation
3. Tout client existant ou consommateur SDK qui serait affecté

Sélection de la stratégie de versioning :
- Versioning par chemin URL (`/v2/`) — recommandé par défaut ; explicite, cacheable, facile à router
- Versioning par en-tête (`API-Version: 2`) — URLs plus propres mais plus difficiles à tester dans les navigateurs ; utiliser uniquement si le projet le fait déjà
- Versioning par paramètre de requête — à éviter ; non-RESTful et casse la mise en cache

Plan d'implémentation :
- Définissez le préfixe de version en un seul endroit (configuration du routeur, constante URL de base) — pas dispersé dans chaque route
- Les anciennes routes de version doivent rester fonctionnelles pendant une fenêtre de dépréciation (recommandé : 6 mois minimum pour les APIs externes, 1 release majeure pour les internes)
- Ajoutez les en-têtes `Deprecation` et `Sunset` aux réponses v1 quand v2 est expédiée
- Versionnez uniquement les routes qui ont des changements cassants — les routes identiques peuvent partager les gestionnaires entre les versions
- Définissez un document de guide de migration listant chaque changement cassant avec des exemples avant/après

Résultat :
1. Liste des changements cassants trouvés (ou « aucun trouvé » si propre)
2. Stratégie de versioning recommandée avec justification
3. Structure de routage montrant comment v1 et v2 coexistent
4. Changements de code nécessaires pour implémenter la division de version
5. Recommandation de la chronologie de dépréciation
6. Squelette du guide de migration pour les consommateurs d'API
