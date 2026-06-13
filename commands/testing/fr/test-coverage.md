---
description: Analyser les lacunes de couverture de tests et générer des tests pour les combler
argument-hint: "[file-or-directory]"
---
Analyser et améliorer la couverture de tests pour : $ARGUMENTS

Étape 1 — Mesurer la couverture actuelle.
Exécuter l'outil de couverture du projet (Jest --coverage, pytest --cov, go test -cover, etc.) limité à $ARGUMENTS. Analyser la sortie et identifier :
- Lignes/branches avec zéro couverture
- Fonctions complètement non testées
- Branches (if/else, switch, ternaire) où un seul chemin est exercé

Étape 2 — Prioriser les lacunes selon le risque.
Classer le code non couvert par :
1. Chemins critiques métier (paiement, authentification, mutation de données)
2. Gestion des erreurs et branches de secours
3. Logique conditionnelle complexe (complexité cyclomatique > 3)
4. Surface API publique vs. assistants internes

Étape 3 — Pour chaque lacune prioritaire, écrire un test ciblé.
- Nommer le test d'après le scénario exact qu'il couvre (« lève AuthError quand le jeton est expiré »)
- Garder la configuration minimale — uniquement ce qui est nécessaire pour atteindre la branche non couverte
- Affirmer le comportement spécifique, pas seulement qu'aucune exception n'a été levée

Étape 4 — Réexécuter la couverture après l'ajout de tests et confirmer que la lacune est comblée. Signaler :
- Couverture avant : X%
- Couverture après : Y%
- Lacunes restantes et raison pour laquelle il est acceptable de les laisser (ex. code mort, branches spécifiques à la plateforme)

Ne pas générer de tests qui remplissent les métriques de couverture sans affirmer un comportement réel (ex. appeler une fonction et affirmer `toBeTruthy()`). La qualité plutôt que la quantité.
