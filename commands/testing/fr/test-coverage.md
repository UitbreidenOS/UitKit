---
description: Analyser les lacunes de couverture de test et générer des tests pour les combler
argument-hint: "[file-or-directory]"
---
Analyser et améliorer la couverture de test pour : $ARGUMENTS

Étape 1 — Mesurer la couverture actuelle.
Exécutez l'outil de couverture du projet (Jest --coverage, pytest --cov, go test -cover, etc.) limité à $ARGUMENTS. Analysez la sortie et identifiez :
- Les lignes/branches avec zéro couverture
- Les fonctions qui ne sont pas du tout testées
- Les branches (if/else, switch, ternaire) où un seul chemin est exercé

Étape 2 — Prioriser les lacunes par risque.
Classez le code non couvert par :
1. Les chemins critiques pour l'entreprise (paiement, authentification, mutation de données)
2. La gestion des erreurs et les branches de secours
3. La logique conditionnelle complexe (complexité cyclomatique > 3)
4. La surface API publique par rapport aux assistants internes

Étape 3 — Pour chaque lacune hautement prioritaire, écrivez un test ciblé.
- Nommez le test selon le scénario exact qu'il couvre (« lève une AuthError lorsque le jeton a expiré »)
- Gardez la mise en place minimale — seulement ce qui est nécessaire pour atteindre la branche non couverte
- Affirmez le comportement spécifique, pas seulement qu'aucune exception n'a été levée

Étape 4 — Relancez la couverture après l'ajout de tests et confirmez que la lacune est comblée. Rapportez :
- Couverture avant : X %
- Couverture après : Y %
- Les lacunes restantes et pourquoi il est acceptable de les laisser (par exemple, code mort, branches spécifiques à la plateforme)

Ne générez pas de tests qui gonflent les métriques de couverture sans affirmer un comportement réel (par exemple, appeler une fonction et affirmer `toBeTruthy()`). La qualité plutôt que la quantité.
