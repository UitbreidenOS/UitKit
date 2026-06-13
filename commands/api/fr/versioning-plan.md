---
description: Auditez l'API et produisez une stratégie de versioning avec des chemins de migration pour les changements incompatibles
argument-hint: "[version-actuelle] [version-cible]"
---
Produisez un plan de versioning d'API pour : $ARGUMENTS

Analysez comme : version actuelle (par ex. v1) et version cible (par ex. v2). Si omis, analysez l'API existante et recommandez si le versioning est nécessaire.

Phase d'analyse — lisez la base de code et identifiez :
1. Tous les endpoints publics (chemin, méthode, forme de requête, forme de réponse)
2. Quels changements sont incompatibles vs. compatibles :
   - Incompatibles : suppression d'un champ, changement de type de champ, renommage d'un champ, changement de sémantique de code de statut, suppression d'un endpoint, changement des exigences d'authentification
   - Compatibles : ajout d'un champ optionnel, ajout d'un nouvel endpoint, ajout d'une nouvelle valeur enum (avec prudence), relâchement de la validation
3. Tous les clients existants ou consommateurs SDK qui seraient affectés

Sélection de la stratégie de versioning :
- Versioning par chemin URL (`/v2/`) — recommandé par défaut ; explicite, cacheable, facile à acheminer
- Versioning par en-tête (`API-Version: 2`) — URLs plus propres mais plus difficiles à tester dans les navigateurs ; utilisez uniquement si le projet le fait déjà
- Versioning par paramètre de requête — à éviter ; non RESTful et casse la mise en cache

Plan d'implémentation :
- Définissez le préfixe de version à un seul endroit (configuration du routeur, constante d'URL de base) — non dispersé dans chaque route
- Les routes de l'ancienne version doivent rester fonctionnelles pendant une période de dépréciation (recommandation : minimum 6 mois pour les APIs externes, 1 version majeure pour les APIs internes)
- Ajoutez les en-têtes `Deprecation` et `Sunset` aux réponses v1 quand v2 est déployée
- Versionnez uniquement les routes qui ont des changements incompatibles — les routes identiques peuvent partager des gestionnaires entre versions
- Définissez un document de guide de migration listant chaque changement incompatible avec des exemples avant/après

Résultat :
1. Liste des changements incompatibles trouvés (ou « aucun trouvé » si propre)
2. Stratégie de versioning recommandée avec justification
3. Structure d'acheminement montrant comment v1 et v2 coexistent
4. Modifications de code nécessaires pour mettre en œuvre la division de version
5. Recommandation de calendrier de dépréciation
6. Squelette du guide de migration pour les consommateurs d'API
